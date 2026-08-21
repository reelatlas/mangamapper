import { useCallback, useMemo, useRef, useState } from 'react';
import type { AnimeSeries, MappingSummary } from '@/types/anime';
import {
  solvePosition,
  seedStepValue,
  lastChapterNumber,
  unitToChapter,
  fieldMax,
  fieldMin,
  type PositionField,
  type PositionResult,
} from '@/lib/mapping';

// ─────────────────────────────────────────────────────────────────────────────
// The INLINE position instrument ("Q1", 2026-08-19) — the totals row IS the
// lookup. Interaction spec: docs/components/position-row.md
//
// Model: REST shows the series' present position (latest aired ep + its
// vol/ch). Editing any field makes it the DRIVER; the others display DERIVED
// values (dimmed). There are no channels (all three fields are always
// visible — the driver is simply the last field touched) and no pins (a
// filler position is ep + vol/ch —; a manga_only position is ch + ep —).
// reset() (or Esc) restores the present position. One-way fill survives:
// ch fills vol, vol never fills ch.
// ─────────────────────────────────────────────────────────────────────────────

export interface InlineField {
  display: string;    // '1122', '—', or the raw text while driving
  isDriver: boolean;
  isDerived: boolean; // dimmed — computed from the driver
  isNull: boolean;    // '—' (universal null, disabled tone)
  editable: boolean;
  maxCh: number;      // digit width for the focus width-lock
}

export interface PositionLookup {
  fields: Record<PositionField, InlineField>;
  result: PositionResult | null; // null at rest
  exploring: boolean;
  markerUnit: number | null; // strip marker: rest → present position (dim)
  markerRest: boolean;
  setField: (f: PositionField, raw: string) => void;
  step: (f: PositionField, dir: number) => void;
  reset: () => void;
  // Esc = UNDO, not reset (2026-08-21): beginEdit snapshots the whole
  // exploration state (driver + raw) when a field gains focus; cancelEdit
  // restores it — Esc reverts to wherever you were BEFORE clicking in
  // (which may be another field's exploration, not rest). reset() remains
  // the explicit full return to the present position.
  beginEdit: () => void;
  cancelEdit: () => void;
  stripClick: (unit: number) => void;   // aired zone → ep drives; hatch → ch drives
  selectEpisode: (ep: number) => void;  // episode-list rows route here
  // Keyboard-handoff intent (ruling 2026-08-21): ONLY a strip click hands the
  // keyboard to the episode list. Monotonic serial — bumped by stripClick,
  // never by field edits (typing/stepping must not lose the input's focus).
  // The list focuses itself when this changes; explicit intent, no
  // activeElement sniffing.
  jumpSerial: number;
}

const FIELDS: PositionField[] = ['ep', 'vol', 'ch'];

const firstNumber = (s: string): number | null => {
  const n = parseInt(s.split(/[-,]/)[0], 10);
  return Number.isNaN(n) ? null : n;
};

export const usePositionLookup = (
  anime: AnimeSeries,
  mapping: MappingSummary | null | undefined,
): PositionLookup => {
  const [driver, setDriver] = useState<PositionField | null>(null);
  const [raw, setRaw] = useState('');
  const [jumpSerial, setJumpSerial] = useState(0);

  const hasSource = mapping ? mapping.sourceType !== 'original' : anime.hasManga;
  const mangaEditable = hasSource && !!mapping?.latestKnown;
  const epEditable = !!mapping && mapping.airedEpisodes > 0;

  // REST = the series' present position
  const rest = useMemo(() => {
    const ep = mapping ? mapping.airedEpisodes : anime.currentEpisode;
    const vol = mangaEditable ? mapping!.latestKnown!.volume : null;
    const ch = mangaEditable ? lastChapterNumber(mapping!.latestKnown!.chapters) : null;
    return { ep, vol, ch };
  }, [anime, mapping, mangaEditable]);

  const exploring = driver !== null;

  const result = useMemo<PositionResult | null>(() => {
    if (!mapping || driver === null) return null;
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) return null; // mid-clear: pending state
    return solvePosition(anime, mapping, { [driver]: parsed });
  }, [anime, mapping, driver, raw]);

  const fields = useMemo<Record<PositionField, InlineField>>(() => {
    const maxOf = (f: PositionField): number => {
      const max = mapping ? fieldMax(anime, mapping, f) : null;
      const fallback = f === 'ep' ? rest.ep : f === 'vol' ? rest.vol ?? 1 : rest.ch ?? 1;
      return String(max ?? fallback ?? 1).length;
    };
    const make = (f: PositionField): InlineField => {
      const editable = f === 'ep' ? epEditable : mangaEditable;
      let display: string;
      if (!exploring) {
        const v = rest[f];
        display = v !== null ? String(v) : '—';
      } else if (driver === f) {
        display = raw;
      } else if (result === null || result.state === 'out') {
        display = '—';
      } else if (f === 'ep') {
        display = result.ep !== null ? String(result.ep) : '—';
      } else if (f === 'vol') {
        display = result.vol !== null ? String(result.vol) : '—';
      } else {
        // vol-driven ch derives to the volume's FIRST chapter (2026-08-19).
        // The old "vol never fills ch" rule protected a TYPED ch from
        // autofill in the two-box model — in the driver model derived
        // display overwrites nothing, so full derivation is consistent.
        const chNum = result.ch !== null ? firstNumber(result.ch) : null;
        display = chNum !== null ? String(chNum) : '—';
      }
      const isNull = display === '—';
      return {
        display,
        isDriver: exploring && driver === f && raw !== '',
        isDerived: exploring && driver !== f && !isNull,
        isNull,
        editable,
        maxCh: maxOf(f),
      };
    };
    return { ep: make('ep'), vol: make('vol'), ch: make('ch') };
  }, [anime, mapping, rest, exploring, driver, raw, result, epEditable, mangaEditable]);

  const setField = useCallback((f: PositionField, nextRaw: string) => {
    const digits = nextRaw.replace(/[^0-9]/g, '');
    setDriver(f);
    setRaw(digits);
  }, []);

  const reset = useCallback(() => {
    setDriver(null);
    setRaw('');
  }, []);

  // Esc-undo snapshot (see interface note): captured on focus, restored on Esc
  const editSnapshotRef = useRef<{ driver: PositionField | null; raw: string } | null>(null);
  const beginEdit = useCallback(() => {
    editSnapshotRef.current = { driver, raw };
  }, [driver, raw]);
  const cancelEdit = useCallback(() => {
    const s = editSnapshotRef.current;
    setDriver(s ? s.driver : null);
    setRaw(s ? s.raw : '');
  }, []);

  const step = useCallback(
    (f: PositionField, dir: number) => {
      if (!mapping) return;
      const displayed = fields[f].display;
      if (displayed !== '' && displayed !== '—') {
        const cur = parseInt(displayed, 10) || 0;
        let next = cur + dir;
        // stepping stays within valid values (typing beyond remains allowed);
        // ch/vol respect the entry's SOURCE SCOPE. Directional integrity:
        // from outside the range, stepping toward it snaps to the boundary;
        // stepping away is a no-op.
        const max = fieldMax(anime, mapping, f);
        const min = fieldMin(anime, mapping, f);
        if (max !== null) {
          if (cur > max) next = dir > 0 ? cur : max;
          else next = Math.min(next, max);
        }
        if (cur < min) next = dir < 0 ? cur : min;
        else next = Math.max(next, min);
        if (next !== cur) setField(f, String(next));
        return;
      }
      // '—' field: seed from the position context, only in the pressed
      // direction (a manga_only position seeds ep↓ → last aired, ep↑ no-ops;
      // a filler position seeds ch/vol from the nearest canon episode)
      const hatchUnit =
        result && result.state === 'hatch' && result.unit !== null ? Math.round(result.unit) : null;
      const seeded = seedStepValue(
        anime,
        mapping,
        { pinEp: hatchUnit, result: hatchUnit !== null ? null : result },
        f,
        dir > 0 ? 1 : -1,
      );
      if (seeded !== null) setField(f, String(seeded));
      // no valid value in that direction → no-op, never reverse or reset
    },
    [anime, mapping, fields, result, setField],
  );

  const stripClick = useCallback(
    (unit: number) => {
      if (!mapping) return;
      const u = Math.max(1, Math.min(Math.round(unit), mapping.airedEpisodes + Math.max(0, mapping.mangaAheadUnits)));
      setJumpSerial((n) => n + 1); // strip origin → list takes the keyboard
      if (u <= mapping.airedEpisodes) {
        setField('ep', String(u)); // filler included — ep is a real value there
        return;
      }
      const ch = unitToChapter(anime, mapping, u);
      if (ch !== null) setField('ch', String(ch));
    },
    [anime, mapping, setField],
  );

  const selectEpisode = useCallback((ep: number) => setField('ep', String(ep)), [setField]);

  const markerUnit = exploring ? result?.unit ?? null : epEditable ? rest.ep : null;

  return {
    fields,
    result,
    exploring,
    markerUnit,
    markerRest: !exploring,
    setField,
    step,
    reset,
    beginEdit,
    cancelEdit,
    stripClick,
    selectEpisode,
    jumpSerial,
  };
};

export { FIELDS as POSITION_FIELDS };
