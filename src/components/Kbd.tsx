import { cn } from '@/lib/utils';

// Kbd — THE keycap (used for hotkey hints wherever they appear).
//
// **kbd_v4: tonal @ md, 4px gap** (locked 2026-08-21, held loosely —
// "satisfied for the moment, may change later"). Picked from the Keycap
// Lab `ea48caa3` after auditioning the whole boxed family live on the
// search line: tonal/vscode/ledge_v1/bevel at md, gaps dialed 6→4→2.
// Runner-up and first fallback if tonal ever reads too soft: vscode
// (alpha fill + hairline border + 1px inset bottom ledge, 3px radius).
//
// The recipe (Linear/Raycast/shadcn lineage): gray-ALPHA fill
// (muted-foreground @ 16%), NO border, 4px radius — alpha composites
// correctly over any surface it lands on (page, card, hovered row), which
// a solid face cannot. md tier = 18px cap, 11px base glyph. Cap gap = 4px
// at call sites (gap-1) — the industry chord gap (Raycast/Linear/Motion).
// Tier vocabulary for future registers (see the lab): lg 22px/13px
// (trigger, empty-state hints) · md 18px/11px (rows, menus) · sm
// 14px/10px (footer legends, dense chrome).
//
// Per-glyph optical sizing off the tier's base: symbol glyphs are drawn
// small inside their em box so they render +2px; word keys (ctrl/esc) drop
// 1px and gain tracking so they don't out-shout the lone glyphs. Every cap
// carries a 1px downward nudge (Plex Mono seats caps a hair high). Grid
// centering beats flex baselines for lone glyphs. Extend the sets here —
// never restyle at a call site.
const SYMBOLS = new Set(['⌘', '⌥', '⇧', '⌃', '↵', '⇥', '↑', '↓', '←', '→']);

// each size carries its OWN leading-none, placed AFTER the size: tailwind-
// merge treats font-size as owning line-height (named sizes set both), so a
// trailing text-[..] silently deletes an earlier leading-none — the caps
// then inherit line-height 1.5 and every glyph seats low (the lab-vs-live
// misalignment bug, found 2026-08-21). Keep size+leading atomic here.
const glyphClass = (glyph: string) =>
  SYMBOLS.has(glyph)
    ? 'text-[13px] leading-none'
    : glyph.length > 1
      ? 'text-[10px] leading-none tracking-wider'
      : 'text-[11px] leading-none';

export const Kbd = ({ glyph, className }: { glyph: string; className?: string }) => (
  <kbd
    className={cn(
      'grid h-[18px] min-w-[18px] select-none place-items-center rounded-[4px] px-1 pt-px font-medium',
      'bg-muted-foreground/[0.16] text-muted-foreground',
      glyphClass(glyph),
      className,
    )}
  >
    {glyph}
  </kbd>
);
