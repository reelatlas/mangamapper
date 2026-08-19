import { useCallback, useMemo, useState } from 'react';
import type { AnimeSeries, MappingSummary } from '@/types/anime';
import {
  solvePosition,
  seedStepValue,
  episodeTypeAt,
  chapterForEpisode,
  unitToChapter,
  fieldMax,
  fieldMin,
  type PositionField,
  type PositionResult,
} from '@/lib/mapping';

// ─────────────────────────────────────────────────────────────────────────────
// All interaction state for the anime↔manga position lookup instrument.
// Interaction spec: docs/components/map-lookup.md
//
// State model: one DRIVER field holds the user's raw input; every other
// visible field displays a DERIVED value (dimmed). Autofill is one-way:
// ch fills vol, vol never fills ch. A PIN is a strip-selected filler episode —
// the needle shows a real position while the manga values stay null by design.
// ─────────────────────────────────────────────────────────────────────────────

export type LookupMode = 'ep' | 'manga';

export interface FieldView {
  value: string;
  isDriver: boolean;
  isDerived: boolean;
}

export interface PositionLookup {
  mode: LookupMode;
  fields: PositionField[];                    // visible fields for this mode
  fieldView: Record<PositionField, FieldView>;
  result: PositionResult | null;
  markerUnit: number | null;
  active: boolean;
  setField: (f: PositionField, raw: string) => void;
  step: (f: PositionField, dir: number) => void;
  toggleMode: () => void;
  clear: () => void;
  stripClick: (unit: number) => void;
}

const EMPTY_VIEW: FieldView = { value: '', isDriver: false, isDerived: false };

export const usePositionLookup = (
  anime: AnimeSeries,
  mapping: MappingSummary | null | undefined,
): PositionLookup => {
  const [mode, setMode] = useState<LookupMode>('ep');
  const [driver, setDriver] = useState<PositionField | null>(null);
  const [raw, setRaw] = useState('');
  const [pin, setPin] = useState<number | null>(null);

  const fields = useMemo<PositionField[]>(() => (mode === 'ep' ? ['ep'] : ['vol', 'ch']), [mode]);

  const result = useMemo<PositionResult | null>(() => {
    if (!mapping) return null;
    if (pin !== null) {
      // pin ≤ aired = filler episode (no manga values); pin > aired = a
      // manga_only position (no episode exists) — both keep inputs null
      if (pin <= mapping.airedEpisodes) {
        return {
          state: 'run', driver: 'ep', ep: pin, vol: null, ch: null, chEnd: null,
          type: 'filler', unit: pin, noManga: true, pin: true, boundMsg: null,
        };
      }
      const solved = solvePosition(anime, mapping, { ep: pin });
      return solved ? { ...solved, pin: true } : null;
    }
    const parsed = parseInt(raw, 10);
    if (!driver || Number.isNaN(parsed)) return null;
    return solvePosition(anime, mapping, { [driver]: parsed });
  }, [anime, mapping, driver, raw, pin]);

  const fieldView = useMemo(() => {
    const view: Record<PositionField, FieldView> = { ep: EMPTY_VIEW, vol: EMPTY_VIEW, ch: EMPTY_VIEW };
    for (const f of fields) {
      if (f === driver) {
        view[f] = { value: raw, isDriver: raw !== '', isDerived: false };
        continue;
      }
      // one-way autofill: vol never fills ch; pins keep all values null
      let derived: number | null = null;
      if (result && !result.pin && result.state !== 'out' && !(driver === 'vol' && f === 'ch')) {
        if (f === 'ep') derived = result.ep;
        else if (f === 'vol') derived = result.vol;
        else derived = result.ch !== null ? parseInt(result.ch.split(/[-,]/)[0], 10) || null : null;
      }
      view[f] = derived !== null
        ? { value: String(derived), isDriver: false, isDerived: true }
        : EMPTY_VIEW;
    }
    return view;
  }, [fields, driver, raw, result]);

  const setField = useCallback((f: PositionField, nextRaw: string) => {
    setPin(null);
    if (nextRaw === '') {
      setDriver(null);
      setRaw('');
    } else {
      setDriver(f);
      setRaw(nextRaw);
    }
  }, []);

  const step = useCallback(
    (f: PositionField, dir: number) => {
      const displayed = f === driver ? raw : fieldView[f].value;
      if (displayed !== '') {
        const cur = parseInt(displayed, 10) || 0;
        let next = cur + dir;
        // stepping stays within valid values (typing beyond remains allowed):
        // ep never steps into the manga_only hatch; ch/vol respect the entry's
        // SOURCE SCOPE (a sequel's chapters start mid-manga, not at 1).
        // Directional integrity: from outside the range, stepping toward it
        // snaps to the boundary; stepping away is a no-op.
        const max = mapping ? fieldMax(anime, mapping, f) : null;
        const min = mapping ? fieldMin(anime, mapping, f) : 1;
        if (max !== null) {
          if (cur > max) next = dir > 0 ? cur : max;
          else next = Math.min(next, max);
        }
        if (cur < min) next = dir < 0 ? cur : min;
        else next = Math.max(next, min);
        if (next !== cur) setField(f, String(next));
        return;
      }
      if (!mapping) return;
      const hasContext = pin !== null || result !== null;
      const seeded = seedStepValue(
        anime, mapping,
        { pinEp: pin, result: pin !== null ? null : result },
        f, dir > 0 ? 1 : -1,
      );
      if (seeded !== null) {
        setField(f, String(seeded));
      } else if (!hasContext) {
        // truly empty instrument: stepping starts at the scope's first value
        setField(f, String(fieldMin(anime, mapping, f)));
      }
      // context exists but no valid value in that direction → no-op
    },
    [anime, mapping, driver, raw, fieldView, pin, result, setField],
  );

  const clear = useCallback(() => {
    setDriver(null);
    setRaw('');
    setPin(null);
  }, []);

  // Switching channels carries the current position; a filler position
  // carries as a pin (needle stays, values stay null).
  const toggleMode = useCallback(() => {
    const carry = result;
    const next: LookupMode = mode === 'ep' ? 'manga' : 'ep';
    setMode(next);
    setDriver(null);
    setRaw('');
    setPin(null);
    if (!carry || carry.state === 'out' || !mapping) return;
    if (next === 'ep') {
      if (carry.ep !== null) {
        setDriver('ep');
        setRaw(String(carry.ep));
      } else if (carry.unit !== null && carry.unit > mapping.airedEpisodes) {
        // manga_only position: no episode exists — carry as a pin, input null
        setPin(Math.round(carry.unit));
      }
    } else if (carry.noManga && carry.ep !== null) {
      setPin(carry.ep);
    } else if (carry.ch !== null) {
      const chNum = parseInt(carry.ch.split(/[-,]/)[0], 10);
      if (!Number.isNaN(chNum)) {
        setDriver('ch');
        setRaw(String(chNum));
      }
    }
  }, [mode, result, mapping]);

  // Mode-preserving strip clicks: ep channel jumps by episode (hatch click =
  // projection); manga channel sets the chapter — except filler, which pins.
  const stripClick = useCallback(
    (unit: number) => {
      if (!mapping) return;
      const u = Math.max(1, Math.min(Math.round(unit), mapping.airedEpisodes + Math.max(0, mapping.mangaAheadUnits)));
      if (mode === 'ep') {
        if (u <= mapping.airedEpisodes) {
          setField('ep', String(u));
        } else {
          // manga_only click: no episode exists — pin the position, input null
          setDriver(null);
          setRaw('');
          setPin(u);
        }
        return;
      }
      if (u <= mapping.airedEpisodes && episodeTypeAt(mapping, u) === 'filler') {
        setDriver(null);
        setRaw('');
        setPin(u);
        return;
      }
      // canon-zone clicks use a chapter that resolves back to the clicked
      // episode exactly, so the needle lands under the cursor
      const ch =
        u <= mapping.airedEpisodes
          ? chapterForEpisode(anime, mapping, u)
          : unitToChapter(anime, mapping, u);
      if (ch !== null) setField('ch', String(ch));
    },
    [anime, mapping, mode, setField],
  );

  return {
    mode,
    fields,
    fieldView,
    result,
    markerUnit: pin ?? result?.unit ?? null,
    active: pin !== null || (driver !== null && raw !== ''),
    setField,
    step,
    toggleMode,
    clear,
    stripClick,
  };
};
