import { cn } from '@/lib/utils';

// Kbd — THE keycap (settled 2026-08-21, Sean-tuned by eye; used for hotkey
// hints wherever they appear). Anatomy: page-flush face (bg-background),
// border, 3px radius, and a 1.5px BOTTOM-ONLY muted ledge — the key's front
// edge (a right ledge was tried and reverted). Grid centering beats flex
// baselines for lone glyphs. Per-glyph optical tuning: symbol glyphs drawn
// small at text size (⌘) render larger; every cap carries a 1px downward
// nudge (Plex Mono seats caps a hair high). Add new glyph cases here —
// never restyle at a call site.
const GLYPH_SIZE: Record<string, string> = {
  '⌘': 'text-[15px]',
};

export const Kbd = ({ glyph, className }: { glyph: string; className?: string }) => (
  <kbd
    className={cn(
      'grid h-5 min-w-5 place-items-center rounded-[3px] border border-border bg-background px-1 pt-px leading-none text-muted-foreground shadow-[0_1.5px_0_hsl(var(--muted))]',
      GLYPH_SIZE[glyph] ?? 'text-[11px]',
      className,
    )}
  >
    {glyph}
  </kbd>
);
