import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { EpisodeSpan, EpisodeType } from '@/types/anime';
import { cn } from '@/lib/utils';

const SPAN_COLORS: Record<EpisodeType, string> = {
  canon: 'bg-accent',
  mixed: 'bg-syntax-amber',
  filler: 'bg-destructive',
  'anime-only-canon': 'bg-syntax-purple',
};

const SPAN_LABELS: Record<EpisodeType, string> = {
  canon: 'canon',
  mixed: 'mixed',
  filler: 'filler',
  'anime-only-canon': 'anime_only',
};

// Dimmed hatch for source material the anime hasn't covered
const MANGA_ONLY_BACKGROUND =
  'repeating-linear-gradient(45deg, hsl(var(--accent) / 0.3) 0 3px, transparent 3px 6px)';

interface MappingStripProps {
  spans: EpisodeSpan[];
  airedEpisodes: number;
  markerEpisode?: number | null; // position indicator, in episode-equivalent units
  markerRest?: boolean;          // dim marker: the series' PRESENT position (inline instrument at rest)
  mangaAheadUnits?: number;      // manga_only tail width, in episode-equivalents
  mangaAheadChapters?: number | null; // for the tail's tooltip
  onUnitClick?: (unit: number) => void; // click-to-set (MapLookup's stripClick)
  // Minimap band: the episode range currently visible in the EpisodeList.
  // Treatment is M1 fill-only (chosen 2026-08-19): a brighter neutral fill,
  // NO edge lines — the highlight alone carries it.
  viewband?: { start: number; end: number } | null;
  // Legend-as-filter: types excluded from the active filter selection render
  // as neutral ghosts IN PLACE — strip geometry (units, needle, clicks) never
  // changes, so filtering is purely a view concern.
  hiddenTypes?: ReadonlySet<EpisodeType | 'manga_only'>;
  className?: string;
}

// Whole-story density strip: one colored segment per contiguous span of
// canon/mixed/filler/anime-only episodes, plus a hatched manga_only tail for
// published chapters the anime hasn't adapted. Clickable when onUnitClick is
// provided (hover shows a ghost needle); the marker dims for projected
// positions beyond the aired run and pegs at the bar's end past the story.
export const MappingStrip = ({
  spans,
  airedEpisodes,
  markerEpisode,
  markerRest,
  mangaAheadUnits = 0,
  mangaAheadChapters,
  onUnitClick,
  viewband,
  hiddenTypes,
  className,
}: MappingStripProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [ghostPct, setGhostPct] = useState<number | null>(null);

  if (airedEpisodes <= 0 || spans.length === 0) return null;

  const totalUnits = airedEpisodes + Math.max(0, mangaAheadUnits);
  const showMarker = markerEpisode != null && markerEpisode >= 1;
  const isProjection = showMarker && markerEpisode > airedEpisodes;
  const markerLeft = showMarker
    ? Math.min(((markerEpisode - 0.5) / totalUnits) * 100, 99.8)
    : 0;

  const unitAt = (clientX: number): number | null => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return null;
    const frac = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    // cell-accurate: unit k owns [(k-1)/T, k/T) of the width
    return Math.max(1, Math.min(totalUnits, Math.floor(frac * totalUnits) + 1));
  };

  return (
    <div
      ref={wrapRef}
      className={cn('relative', onUnitClick && 'cursor-pointer py-[5px] -my-[5px]')}
      onClick={
        onUnitClick
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              const unit = unitAt(e.clientX);
              if (unit !== null) onUnitClick(unit);
            }
          : undefined
      }
      onPointerMove={
        onUnitClick
          ? (e) => {
              const rect = wrapRef.current?.getBoundingClientRect();
              if (!rect || rect.width === 0) return;
              setGhostPct(Math.max(0, Math.min(99.8, ((e.clientX - rect.left) / rect.width) * 100)));
            }
          : undefined
      }
      onPointerLeave={onUnitClick ? () => setGhostPct(null) : undefined}
    >
      <div className="relative">
      <motion.div
        // double-height trial (2026-08-19) — was h-1.5 (6px); the strip is
        // the card's primary data visual and earns more presence
        className={cn('flex h-3 w-full overflow-hidden', className)}
        style={{ transformOrigin: 'left' }}
        initial={{ transform: 'scaleX(0)' }}
        whileInView={{ transform: 'scaleX(1)' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {spans.map((span) => {
          const hidden = hiddenTypes?.has(span.type) ?? false;
          return (
            <div
              key={`${span.start}-${span.type}`}
              className={hidden ? 'bg-muted/60' : SPAN_COLORS[span.type]}
              style={{ width: `${((span.end - span.start + 1) / totalUnits) * 100}%` }}
              title={
                span.start === span.end
                  ? `ep_${span.start} // ${SPAN_LABELS[span.type]}${hidden ? ' (filtered)' : ''}`
                  : `ep_${span.start}-${span.end} // ${SPAN_LABELS[span.type]}${hidden ? ' (filtered)' : ''}`
              }
            />
          );
        })}
        {mangaAheadUnits > 0 && (
          <div
            className={hiddenTypes?.has('manga_only') ? 'bg-muted/60' : undefined}
            style={{
              width: `${(mangaAheadUnits / totalUnits) * 100}%`,
              background: hiddenTypes?.has('manga_only') ? undefined : MANGA_ONLY_BACKGROUND,
            }}
            title={`+${mangaAheadChapters ?? '?'}ch // manga_only (not_animated)${hiddenTypes?.has('manga_only') ? ' (filtered)' : ''}`}
          />
        )}
      </motion.div>
      {viewband && (
        <div
          aria-hidden
          className="absolute -top-[3px] -bottom-[3px] bg-foreground/[0.18] pointer-events-none"
          style={{
            left: `${((viewband.start - 1) / totalUnits) * 100}%`,
            width: `${Math.max(0.4, ((viewband.end - viewband.start + 1) / totalUnits) * 100)}%`,
          }}
        />
      )}
      {onUnitClick && ghostPct !== null && (
        <div
          aria-hidden
          className="absolute -top-0.5 -bottom-0.5 w-0.5 -ml-px bg-foreground/25 pointer-events-none"
          style={{ left: `${ghostPct}%` }}
        />
      )}
      {showMarker && (
        <motion.div
          aria-hidden
          className={cn(
            'absolute -top-1 -bottom-1 w-0.5 -ml-px pointer-events-none',
            isProjection ? 'bg-muted-foreground' : markerRest ? 'bg-foreground/45' : 'bg-foreground',
          )}
          style={{ left: `${markerLeft}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          title={
            isProjection
              ? `ep_${Math.round(markerEpisode)} // projected`
              : markerRest
                ? `ep_${Math.round(markerEpisode)} // current`
                : `ep_${Math.round(markerEpisode)}`
          }
        />
      )}
      </div>
    </div>
  );
};
