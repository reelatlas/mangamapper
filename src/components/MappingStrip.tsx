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
  mangaAheadUnits?: number;      // manga_only tail width, in episode-equivalents
  mangaAheadChapters?: number | null; // for the tail's tooltip
  onUnitClick?: (unit: number) => void; // click-to-set (MapLookup's stripClick)
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
  mangaAheadUnits = 0,
  mangaAheadChapters,
  onUnitClick,
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
        className={cn('flex h-1.5 w-full overflow-hidden', className)}
        style={{ transformOrigin: 'left' }}
        initial={{ transform: 'scaleX(0)' }}
        whileInView={{ transform: 'scaleX(1)' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {spans.map((span) => (
          <div
            key={`${span.start}-${span.type}`}
            className={SPAN_COLORS[span.type]}
            style={{ width: `${((span.end - span.start + 1) / totalUnits) * 100}%` }}
            title={
              span.start === span.end
                ? `ep_${span.start} // ${SPAN_LABELS[span.type]}`
                : `ep_${span.start}-${span.end} // ${SPAN_LABELS[span.type]}`
            }
          />
        ))}
        {mangaAheadUnits > 0 && (
          <div
            style={{
              width: `${(mangaAheadUnits / totalUnits) * 100}%`,
              background: MANGA_ONLY_BACKGROUND,
            }}
            title={`+${mangaAheadChapters ?? '?'}ch // manga_only (not_animated)`}
          />
        )}
      </motion.div>
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
            isProjection ? 'bg-muted-foreground' : 'bg-foreground',
          )}
          style={{ left: `${markerLeft}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          title={isProjection ? `ep_${Math.round(markerEpisode)} // projected` : `ep_${Math.round(markerEpisode)}`}
        />
      )}
      </div>
    </div>
  );
};
