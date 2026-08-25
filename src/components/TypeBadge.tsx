import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// TypeBadge — THE type-token treatment. TINT CHIP (trial 2026-08-21): the
// type color as text over its own tint wash (/0.12, matching the section
// bands' tint grammar), radius token, no border. Supersedes the naked tag
// (which superseded brackets, which superseded the S2 tint boxes).
//
// manga_only wears its OWN purple (2026-08-21, reverses the shares-canon
// ruling): same hue as the strip's hatched tail and its section band.
//
// Rules (DESIGN_SYSTEM.md):
// - the badge is the legend unit: counts live INSIDE it (dimmer, one size down)
// - a badge with no data does not render at all (empty-state rule) — enforce
//   by conditional rendering at the call site, never with a disabled look
// - vocabulary: these spans are "sections", never "arcs"
// ─────────────────────────────────────────────────────────────────────────────

export type TypeBadgeKind = 'canon' | 'mixed' | 'filler' | 'manga_only' | 'anime_only';

const STYLES: Record<TypeBadgeKind, string> = {
  canon: 'text-type-canon bg-type-canon/12',
  mixed: 'text-type-mixed bg-type-mixed/12',
  filler: 'text-type-filler bg-type-filler/12',
  manga_only: 'text-type-manga bg-type-manga/12',
  anime_only: 'text-type-anime bg-type-anime/12',
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
    // tint chip (trial 2026-08-21): colored text over its own /0.12 wash,
    // radius token — the tint carries the chip, no border
    'inline-flex items-baseline gap-1.5 whitespace-nowrap rounded-sm px-1.5 py-0.5 text-[0.68rem] leading-normal tracking-wider',
    STYLES[type],
    onClick && 'cursor-pointer transition-opacity hover:opacity-75',
    // hidden-state = fade (interior_v1): the tag recedes, never struck/boxed
    dimmed && 'opacity-40 hover:opacity-60',
    className,
  );
  const content = (
    <>
      {type}
      {count != null && <span className="text-[0.64rem] opacity-70">{count}</span>}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={pressed} className={classes}>
        {content}
      </button>
    );
  }
  return <span className={classes}>{content}</span>;
};
