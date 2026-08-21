import { useRef, useState } from 'react';
import type { AnimeSeries, MappingSummary } from '@/types/anime';
import type { PositionField } from '@/lib/mapping';
import type { InlineField, PositionLookup } from '@/hooks/usePositionLookup';
import { TvIcon as Tv, BookOpenIcon as BookOpen } from '@/components/icons';
import { PositionLabel } from '@/components/PositionLabel';
import { StepperInput } from '@/components/StepperInput';

// ─────────────────────────────────────────────────────────────────────────────
// InlinePositionRow — the merged totals row + lookup instrument ("Q1",
// chosen 2026-08-19). The current numbers ARE the inputs; totals stay static
// after the /. Interaction spec: docs/components/position-row.md
//
// - rest = the series' present position; // reset() (or Esc) restores it
// - WIDTH LOCK: while a field is focused, all three fields freeze at their
//   series-max digit widths so nothing shifts under the cursor while
//   typing/stepping/holding; blur returns to the tight hug immediately
// - metadata (tag + reset) sits IN the row, right of the fields
// ─────────────────────────────────────────────────────────────────────────────

interface InlinePositionRowProps {
  anime: AnimeSeries;
  mapping: MappingSummary | null | undefined;
  lookup: PositionLookup;
  hasSource: boolean;
}

const NULL_TONE = 'text-muted-foreground/60';

// No type tag while exploring (removed 2026-08-19): the strip zone under the
// needle, the selected list row, and the — values already say where you are.
// Only the reset affordance — plus the out_of_range error, which nothing
// else communicates.
const Meta = ({ lookup }: { lookup: PositionLookup }) => {
  const { result, exploring, reset } = lookup;
  if (!exploring || result === null) return null;

  return (
    <>
      {result.state === 'out' && (
        <span className="text-muted-foreground">// out_of_range ({result.boundMsg})</span>
      )}
      <button type="button" onClick={reset} className="text-muted-foreground hover:text-primary cursor-pointer">
        {'// reset()'}
      </button>
    </>
  );
};

export const InlinePositionRow = ({ anime, mapping, lookup, hasSource }: InlinePositionRowProps) => {
  // focus-only width lock (2026-08-19 ruling): the shift problem exists
  // solely when the affordances can move under the user's own cursor
  const [focusLock, setFocusLock] = useState(false);
  // set while an Esc-undo is blurring the field — see onEscape below
  const escapingRef = useRef(false);

  const field = (f: PositionField) => {
    const view: InlineField = lookup.fields[f];
    if (!view.editable) {
      return <span className={view.isNull ? NULL_TONE : 'text-foreground'}>{view.display}</span>;
    }
    return (
      <StepperInput
        variant="inline"
        value={view.display}
        widthCh={focusLock ? view.maxCh : Math.max(1, view.display.length)}
        onValueChange={(raw) => lookup.setField(f, raw)}
        onStep={(dir) => lookup.step(f, dir)}
        // Esc = undo to the pre-focus state (2026-08-21) — never the full
        // reset; // reset() stays the explicit way back to rest. The flag
        // stops the blur handler's empty-field reset from stomping the
        // restore (Esc blurs synchronously, before state flushes).
        onEscape={() => {
          escapingRef.current = true;
          lookup.cancelEdit();
        }}
        // derived dimming only WHILE editing (focused): the moment focus
        // leaves, every non-null value returns to the normal text color —
        // rest state and strip/list selections read as plain data
        derived={view.isDerived && focusLock}
        nullValue={view.isNull}
        onFocusChange={(focused) => {
          setFocusLock(focused);
          // focus opens an edit: snapshot for Esc-undo
          if (focused) lookup.beginEdit();
          if (!focused) {
            if (escapingRef.current) {
              escapingRef.current = false; // Esc-undo owns this blur
            } else if (lookup.fields[f].display === '') {
              // blur with an emptied driver → back to the present position
              lookup.reset();
            }
          }
        }}
        aria-label={`map ${f} for ${anime.title}`}
      />
    );
  };

  // interior_v1 denominator dim (2026-08-21): the CURRENT number is the
  // instrument, the total is context — denominators + separators sit at 40%
  // foreground (FabFilter/vim-statusline grammar: bright value, dim unit)
  const DENOM_TONE = 'text-foreground/40';
  const total = (v: number | null) =>
    v !== null ? <span className={DENOM_TONE}>/{v}</span> : (
      <span>
        <span className={DENOM_TONE}>/</span>
        <span className={NULL_TONE}>—</span>
      </span>
    );

  return (
    <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm tabular-nums font-mono">
      <div>
        <PositionLabel icon={Tv} label="anime" iconActive className="mb-0.5" />
        <span className="inline-flex items-baseline">
          <span className="text-muted-foreground">ep:</span>
          {field('ep')}
          {total(anime.totalEpisodes)}
        </span>
      </div>
      <div>
        <PositionLabel icon={BookOpen} label="manga" iconActive={hasSource} className="mb-0.5" />
        {hasSource && mapping?.latestKnown ? (
          <span className="inline-flex items-baseline">
            <span className="text-muted-foreground">vol:</span>
            {field('vol')}
            {total(anime.totalVolumes)}
            {/* whitespace-pre: a flex item's edge spaces are otherwise stripped */}
            <span className="text-foreground/40 whitespace-pre">{' · '}</span>
            <span className="text-muted-foreground">ch:</span>
            {field('ch')}
            {total(anime.totalChapters)}
          </span>
        ) : hasSource ? (
          <span className="text-muted-foreground">// mapping_pending</span>
        ) : (
          // no source material: the universal null, disabled tone
          <span className={NULL_TONE}>—</span>
        )}
      </div>
      {/* metadata column: baseline-aligned with the values via a hidden label */}
      <div>
        <PositionLabel icon={Tv} label="meta" className="mb-0.5 invisible" />
        <span className="meta-row min-h-5 text-sm">
          <Meta lookup={lookup} />
        </span>
      </div>
    </div>
  );
};
