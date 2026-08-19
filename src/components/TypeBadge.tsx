import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TypeBadge — THE type-token treatment ("S2 tint", chosen 2026-08-19).
// One visual language for the strip legend and episode-list section headers:
// colored text on a ~10% tint of the same hue, 1px faint border, system
// radius (2px). The *_only zones carry their strip identity — their badge
// background IS the strip's hatch pattern (green for manga_only, purple for
// anime_only).
//
// Rules (DESIGN_SYSTEM.md):
// - the badge is the legend unit: counts live INSIDE it (dimmer, one size down)
// - a badge with no data does not render at all (empty-state rule) — enforce
//   by conditional rendering at the call site, never with a disabled look
// - vocabulary: these spans are "sections", never "arcs"
// ─────────────────────────────────────────────────────────────────────────────

export type TypeBadgeKind = 'canon' | 'mixed' | 'filler' | 'manga_only' | 'anime_only';

// anime_only gets the full solid tint like canon/mixed/filler — that content
// IS canon to the show; only manga_only (the not-yet-animated zone) carries
// the hatch identity. Most series never surface the anime_only badge at all
// (empty-state rule) — it renders only where the tag exists.
const STYLES: Record<TypeBadgeKind, string> = {
  canon: 'text-accent border-accent/[0.35] bg-accent/10',
  mixed: 'text-syntax-amber border-syntax-amber/[0.35] bg-syntax-amber/10',
  filler: 'text-destructive border-destructive/[0.35] bg-destructive/10',
  manga_only: 'text-accent/[0.85] border-accent/30',
  anime_only: 'text-syntax-purple border-syntax-purple/[0.35] bg-syntax-purple/10',
};

const HATCH: Partial<Record<TypeBadgeKind, string>> = {
  manga_only:
    'repeating-linear-gradient(45deg, hsl(var(--accent) / 0.16) 0 3px, transparent 3px 6px)',
};

interface TypeBadgeProps {
  type: TypeBadgeKind;
  count?: ReactNode; // rendered inside the badge, dimmed — the badge IS the legend unit
  className?: string;
  // legend-as-filter: clickable badges toggle their type in the card's filter
  // selection; `dimmed` = an active selection excludes this type
  onClick?: () => void;
  pressed?: boolean;
  dimmed?: boolean;
}

export const TypeBadge = ({ type, count, className, onClick, pressed, dimmed }: TypeBadgeProps) => {
  const classes = cn(
    // px must stay 0.45rem: the episode list's column-alignment contract
    // derives the row indent from this padding (docs/components/episode-list.md)
    'inline-flex items-baseline gap-1.5 whitespace-nowrap rounded-lg border px-[0.45rem] py-px text-[0.68rem] leading-normal tracking-wider',
    STYLES[type],
    onClick && 'cursor-pointer transition-opacity hover:opacity-75',
    dimmed && 'opacity-40 hover:opacity-60',
    className,
  );
  const style = HATCH[type] ? { backgroundImage: HATCH[type] } : undefined;
  const content = (
    <>
      {type}
      {count != null && <span className="text-[0.64rem] opacity-70">{count}</span>}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={pressed} className={classes} style={style}>
        {content}
      </button>
    );
  }
  return (
    <span className={classes} style={style}>
      {content}
    </span>
  );
};
