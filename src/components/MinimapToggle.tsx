import { useState } from 'react';
import { cn } from '@/lib/utils';

// ─────────────────────────────────────────────────────────────────────────────
// MinimapToggle — the strip viewband's on/off control. bare_miniature
// (Minimap Toggle Lab ae6bae37, picked 2026-08-21): the drawn strip ALONE,
// no wash, no word — the control is a picture of its state (on: band shown;
// off: band gone, track dimmed). Going wordless sidesteps naming; internal
// name stays minimap/viewband.
//
// Glyph anatomy (Sean's tuning walk — center → right → left+wider → proud
// 8px → 7px → flush): 28×6 track, band 26–64% (left-of-center — dead center
// reads as a logo mark), flush height, 1px radii. Invisible button padding
// is the hit area. Rejected en route: // minimap(on|off) text (wordy), the
// TypeBadge-grammar chip (badges hide data, this hides chrome — the shared
// form muddied the kinds). Contract: docs/components/episode-list.md §6.
// ─────────────────────────────────────────────────────────────────────────────

// user chrome preference, shared across cards via localStorage; a private-
// mode storage failure degrades to session-only state
export const useMinimapPref = () => {
  const [on, setOn] = useState(() => {
    try {
      return localStorage.getItem('mm:minimap') !== 'off';
    } catch {
      return true;
    }
  });
  const toggle = () =>
    setOn((v) => {
      try {
        localStorage.setItem('mm:minimap', v ? 'off' : 'on');
      } catch {
        /* private mode: session-only */
      }
      return !v;
    });
  return [on, toggle] as const;
};

interface MinimapToggleProps {
  on: boolean;
  onToggle: () => void;
  className?: string;
}

export const MinimapToggle = ({ on, onToggle, className }: MinimapToggleProps) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={on}
    aria-label="toggle minimap band"
    title="minimap"
    className={cn('cursor-pointer px-1 py-1.5 transition-opacity hover:opacity-75', className)}
  >
    <span
      className={cn(
        'relative block h-1.5 w-7 rounded-[1px]',
        on ? 'bg-foreground/20' : 'bg-foreground/12',
      )}
    >
      {on && <span className="absolute inset-y-0 left-[26%] w-[38%] rounded-[1px] bg-foreground/70" />}
    </span>
  </button>
);
