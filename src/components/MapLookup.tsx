import { Crosshair } from 'lucide-react';
import { StepperInput } from '@/components/StepperInput';
import { cn } from '@/lib/utils';
import type { PositionLookup } from '@/hooks/usePositionLookup';
import type { PositionResult } from '@/lib/mapping';

interface MapLookupProps {
  lookup: PositionLookup;
  seriesTitle: string; // for aria labels
}

const FIELD_LABEL = { ep: 'ep', vol: 'vol', ch: 'ch' } as const;

// Metadata reads TAG-FIRST: `canon → vol:108 · ch:1092`. Tags carry no `//`;
// manga_only matches the strip legend's vocabulary. ep-driven shows vol+ch,
// manga-driven shows only the episode (the inputs already hold the rest).
const Result = ({ result, onClear }: { result: PositionResult | null; onClear: () => void }) => {
  if (!result) return null;

  const clearLink = (
    <button
      type="button"
      onClick={onClear}
      className="text-muted-foreground hover:text-destructive cursor-pointer"
    >
      {'// clear()'}
    </button>
  );

  if (result.state === 'out') {
    return (
      <>
        <span className="text-muted-foreground">// out_of_range ({result.boundMsg})</span>
        {clearLink}
      </>
    );
  }

  const arrow = <span className="text-muted-foreground">→</span>;
  const tag =
    result.state === 'hatch' ? (
      <span className="text-accent/60">manga_only</span>
    ) : result.noManga ? (
      <span className="text-destructive">filler</span>
    ) : result.type === 'mixed' ? (
      <span className="text-syntax-amber">mixed</span>
    ) : (
      <span className="text-accent">canon</span>
    );

  // filler pin: show the clicked episode; a manga_only (hatch) pin falls
  // through to the ep-driven branch and renders manga_only → vol · ch
  if (result.pin && result.noManga) {
    return (
      <>
        {tag}
        {arrow}
        <span>
          <span className="text-muted-foreground">ep:</span>
          <span className="text-foreground">{result.ep}</span>
        </span>
        {clearLink}
      </>
    );
  }

  if (result.driver === 'ep') {
    return (
      <>
        {tag}
        {result.noManga ? (
          <span className="text-muted-foreground">(no_manga)</span>
        ) : result.ch !== null ? (
          <>
            {arrow}
            <span>
              <span className="text-muted-foreground">vol:</span>
              <span className="text-foreground">{result.vol ?? '—'}</span>
              <span className="text-muted-foreground"> · ch:</span>
              <span className="text-foreground">{result.ch}</span>
            </span>
          </>
        ) : (
          <span className="text-muted-foreground">(mapping_pending)</span>
        )}
        {clearLink}
      </>
    );
  }

  // manga-driven: episode only
  return (
    <>
      {tag}
      {result.state === 'run' && (
        <>
          {arrow}
          <span>
            <span className="text-muted-foreground">ep:</span>
            <span className="text-foreground">{result.ep}</span>
          </span>
        </>
      )}
      {clearLink}
    </>
  );
};

// The anime↔manga position lookup instrument ("channel C, final candidate").
// Interaction spec: docs/components/map-lookup.md. State lives in
// usePositionLookup (owned by the parent so the MappingStrip can share it).
export const MapLookup = ({ lookup, seriesTitle }: MapLookupProps) => {
  const { mode, fields, fieldView, result, active, setField, step, toggleMode, clear } = lookup;

  return (
    <div
      className="border-t border-dashed pt-3 flex flex-wrap items-end gap-3 font-mono"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div className="inline-flex flex-col gap-1.5">
        {/* label row: the whole row switches channels; ⇄ reveals on row hover,
            right-aligned to the input group's edge */}
        <button
          type="button"
          onClick={toggleMode}
          title={mode === 'ep' ? 'switch to manga → episode' : 'switch to episode → manga'}
          className="relative flex gap-2.5 text-left cursor-pointer group/lkrow"
        >
          {fields.map((f, i) => (
            <span
              key={f}
              className="w-[4.8rem] flex items-center gap-1.5 text-xs leading-3 tracking-wider text-muted-foreground"
            >
              {i === 0 && (
                <Crosshair className={cn('w-3 h-3 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
              )}
              <span
                className={cn(
                  'group-hover/lkrow:text-syntax-cyan transition-colors',
                  fieldView[f].isDriver && 'text-syntax-cyan',
                )}
              >
                {FIELD_LABEL[f]}
              </span>
            </span>
          ))}
          <span
            aria-hidden
            className="absolute right-0 top-0 text-xs leading-3 text-muted-foreground opacity-0 group-hover/lkrow:opacity-100 group-hover/lkrow:text-primary transition-opacity"
          >
            ⇄
          </span>
        </button>

        {/* input row */}
        <div className="flex items-center gap-2.5">
          {fields.map((f) => (
            <StepperInput
              key={`${mode}-${f}`}
              value={fieldView[f].value}
              onValueChange={(next) => setField(f, next)}
              onStep={(dir) => step(f, dir)}
              onEscape={clear}
              derived={fieldView[f].isDerived}
              aria-label={`map ${FIELD_LABEL[f]} for ${seriesTitle}`}
            />
          ))}
        </div>
      </div>

      <div className="meta-row min-h-7 text-sm">
        <Result result={result} onClear={clear} />
      </div>
    </div>
  );
};
