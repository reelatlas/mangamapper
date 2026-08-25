import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { EpisodeSpan, EpisodeType } from '@/types/anime';
import { cn } from '@/lib/utils';

// forest_v1 type palette (2026-08-21) — dedicated --type-* tokens, decoupled
// from semantic colors
const SPAN_COLORS: Record<EpisodeType, string> = {
  canon: 'bg-type-canon',
  mixed: 'bg-type-mixed',
  filler: 'bg-type-filler',
  'anime-only-canon': 'bg-type-anime',
};

const SPAN_LABELS: Record<EpisodeType, string> = {
  canon: 'canon',
  mixed: 'mixed',
  filler: 'filler',
  'anime-only-canon': 'anime_only',
};

// Dimmed hatch for source material the anime hasn't covered — manga_only's
// own purple (2026-08-21, reverses the shares-canon ruling)
const MANGA_ONLY_BACKGROUND =
  'repeating-linear-gradient(45deg, hsl(var(--type-manga) / 0.4) 0 3px, transparent 3px 6px)';

// ─── THE CHAPTER-BAR LAYOUT MODEL (final, 2026-08-21) ────────────────────────
// The reference implementation is the YouTube chapter bar / GitHub language
// bar: (1) every segment gets a MINIMUM paint width so nothing is sub-pixel,
// (2) a fixed 1px gap separates every pair of segments, (3) interaction is
// DECOUPLED from raw proportions — the pointer hit-tests the painted segment
// and maps within that segment's own unit range (a gap pixel snaps to the
// nearest segment), and the needle/band placement is the exact inverse of the
// same mapping, so indicators always sit inside their segment's paint, never
// in a gap. Large segments absorb what the minimums borrow, proportionally.
const GAP_PX = 1;
const MIN_SEG_PX = 2;

interface Seg {
  key: string;
  type: EpisodeType | 'manga_only';
  u0: number; // 0-based start in unit space
  units: number;
  hidden: boolean;
  title: string;
}
interface SegRect extends Seg {
  x: number;
  w: number;
}

interface MappingStripProps {
  spans: EpisodeSpan[];
  airedEpisodes: number;
  markerEpisode?: number | null; // position indicator, in episode-equivalent units
  markerRest?: boolean;          // dim marker: the series' PRESENT position (inline instrument at rest)
  mangaAheadUnits?: number;      // manga_only tail width, in episode-equivalents
  mangaAheadChapters?: number | null; // for the tail's tooltip
  onUnitClick?: (unit: number) => void; // click-to-set (the lookup's stripClick)
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
  const [ghostX, setGhostX] = useState<number | null>(null);
  const [stripW, setStripW] = useState(0);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStripW(el.clientWidth));
    ro.observe(el);
    setStripW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const totalUnits = airedEpisodes + Math.max(0, mangaAheadUnits);

  // unit-space segments (data) — geometry-free
  const segs = useMemo<Seg[]>(() => {
    const out: Seg[] = [];
    let u0 = 0;
    for (const s of spans) {
      const units = s.end - s.start + 1;
      const hidden = hiddenTypes?.has(s.type) ?? false;
      out.push({
        key: `${s.start}-${s.type}`,
        type: s.type,
        u0,
        units,
        hidden,
        title:
          (s.start === s.end ? `ep_${s.start}` : `ep_${s.start}-${s.end}`) +
          ` // ${SPAN_LABELS[s.type]}${hidden ? ' (filtered)' : ''}`,
      });
      u0 += units;
    }
    if (mangaAheadUnits > 0) {
      const hidden = hiddenTypes?.has('manga_only') ?? false;
      out.push({
        key: 'manga_only',
        type: 'manga_only',
        u0,
        units: mangaAheadUnits,
        hidden,
        title: `+${mangaAheadChapters ?? '?'}ch // manga_only (not_animated)${hidden ? ' (filtered)' : ''}`,
      });
    }
    return out;
  }, [spans, mangaAheadUnits, mangaAheadChapters, hiddenTypes]);

  // paint-space rects: proportional widths, floored at MIN_SEG_PX, the
  // borrow re-absorbed by segments with slack, fixed gaps between all
  const rects = useMemo<SegRect[]>(() => {
    if (stripW <= 0 || segs.length === 0 || totalUnits <= 0) return [];
    const avail = Math.max(0, stripW - GAP_PX * (segs.length - 1));
    let w = segs.map((s) => Math.max(MIN_SEG_PX, (s.units / totalUnits) * avail));
    const over = w.reduce((a, b) => a + b, 0) - avail;
    if (over > 0) {
      const slack = w.map((x) => x - MIN_SEG_PX);
      const S = slack.reduce((a, b) => a + b, 0);
      if (S > 0) w = w.map((x, i) => x - over * (slack[i] / S));
    }
    // pixel-snap the layout: rounding each cumulative boundary keeps every
    // gap EXACTLY 1 device px (crisp, never an antialiased fractional edge)
    // and never shrinks a segment below its floor (round(c+w)-round(c) ≥ ⌊w⌋)
    let cursor = 0;
    return segs.map((s, i) => {
      const x = Math.round(cursor);
      const wi = Math.max(1, Math.round(cursor + w[i]) - x);
      cursor += w[i] + GAP_PX;
      return { ...s, x, w: wi };
    });
  }, [segs, stripW, totalUnits]);

  if (airedEpisodes <= 0 || spans.length === 0) return null;

  // pointer → unit: hit-test the painted segment (gaps snap to nearest)
  const unitAt = (clientX: number): number | null => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || rects.length === 0) return null;
    const px = clientX - rect.left;
    let best: SegRect = rects[0];
    let bestD = Infinity;
    for (const r of rects) {
      if (px >= r.x && px <= r.x + r.w) {
        best = r;
        break;
      }
      const d = px < r.x ? r.x - px : px - (r.x + r.w);
      if (d < bestD) {
        bestD = d;
        best = r;
      }
    }
    const local = Math.max(0, Math.min(0.999, (px - best.x) / best.w));
    return best.u0 + Math.floor(local * best.units) + 1;
  };

  // unit-continuum → paint x: the exact inverse of unitAt (u in [0, total])
  const xAt = (u: number): number => {
    if (rects.length === 0) return 0;
    const c = Math.max(0, Math.min(totalUnits - 0.0001, u));
    const r = rects.find((r) => c >= r.u0 && c < r.u0 + r.units) ?? rects[rects.length - 1];
    return r.x + ((c - r.u0) / r.units) * r.w;
  };

  // indicator ticks are 2px wide (w-0.5 -ml-px), CENTERED on a point — at a
  // segment's first/last episode that center sits <1px from the boundary, so
  // a raw xAt() tick would bleed into the gap (Sean's ep_336/382 report).
  // Video-player playheads solve this by clamping the tick's extent inside
  // the segment's PAINT: center ∈ [x+1, x+w-1] — never in a gap.
  const tickX = (u: number): number => {
    if (rects.length === 0) return 0;
    const c = Math.max(0, Math.min(totalUnits - 0.0001, u));
    const r = rects.find((s) => c >= s.u0 && c < s.u0 + s.units) ?? rects[rects.length - 1];
    const x = r.x + ((c - r.u0) / r.units) * r.w;
    const lo = r.x + 1;
    const hi = Math.max(lo, r.x + r.w - 1);
    return Math.min(Math.max(x, lo), hi);
  };

  const showMarker = markerEpisode != null && markerEpisode >= 1 && rects.length > 0;
  const isProjection = showMarker && markerEpisode! > airedEpisodes;
  const markerX = showMarker ? tickX(markerEpisode! - 0.5) : 0;

  // the ghost previews EXACTLY where a click would land: pointer → episode
  // (unitAt, gaps snap to nearest) → that episode's tick position
  const snapGhost = (clientX: number): number | null => {
    const u = unitAt(clientX);
    return u === null ? null : tickX(u - 0.5);
  };

  return (
    <div
      ref={wrapRef}
      className={cn('relative', onUnitClick && 'cursor-pointer py-[5px] my-[-5px]')}
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
              setGhostX(snapGhost(e.clientX));
            }
          : undefined
      }
      onPointerLeave={onUnitClick ? () => setGhostX(null) : undefined}
    >
      <div className="relative">
        <motion.div
          // interior_v1 (2026-08-21): 18px tall; segments are absolutely
          // placed from the paint-space layout above
          className={cn('relative h-[18px] w-full overflow-hidden', className)}
          style={{ transformOrigin: 'left' }}
          initial={{ transform: 'scaleX(0)' }}
          whileInView={{ transform: 'scaleX(1)' }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {rects.map((r) => (
            <div
              key={r.key}
              className={cn(
                'absolute inset-y-0',
                r.hidden
                  ? 'bg-muted/60'
                  : r.type === 'manga_only'
                    ? undefined
                    : SPAN_COLORS[r.type],
              )}
              style={{
                left: r.x,
                width: r.w,
                background:
                  !r.hidden && r.type === 'manga_only' ? MANGA_ONLY_BACKGROUND : undefined,
              }}
              title={r.title}
            />
          ))}
        </motion.div>
        {viewband && rects.length > 0 && (
          <div
            aria-hidden
            // M1 fill-only band; BRIGHT veil (2026-08-21): foreground at 45% —
            // the original 18% vanished against forest_v1's bright fills and a
            // muted mid-grey read as dimming, so the band went brighter instead
            // (alpha is the dial if it ever fights the fills)
            className="absolute top-[-3px] bottom-[-3px] bg-foreground/45 pointer-events-none"
            style={{
              left: xAt(viewband.start - 1),
              width: Math.max(2, xAt(viewband.end) - xAt(viewband.start - 1)),
            }}
          />
        )}
        {onUnitClick && ghostX !== null && (
          <div
            aria-hidden
            className="absolute -top-0.5 -bottom-0.5 w-0.5 -ml-px bg-foreground/25 pointer-events-none"
            style={{ left: ghostX }}
          />
        )}
        {showMarker && (
          <motion.div
            aria-hidden
            className={cn(
              'absolute -top-1 -bottom-1 w-0.5 -ml-px pointer-events-none',
              isProjection ? 'bg-muted-foreground' : markerRest ? 'bg-foreground/45' : 'bg-foreground',
            )}
            style={{ left: markerX }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            title={
              isProjection
                ? `ep_${Math.round(markerEpisode!)} // projected`
                : markerRest
                  ? `ep_${Math.round(markerEpisode!)} // current`
                  : `ep_${Math.round(markerEpisode!)}`
            }
          />
        )}
      </div>
    </div>
  );
};
