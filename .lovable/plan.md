

## AuthConfirm Button & Progress Bar Refinements

### Changes to `src/pages/AuthConfirm.tsx`

**1. Pause button hover** — yellow/amber **background**, not text color:
- Change from `hover:text-syntax-amber hover:border-syntax-amber` to `hover:bg-[hsl(var(--syntax-amber))] hover:text-background`

**2. Start button hover** — green **background** matching the existing accent hover pattern (screenshots 1-2):
- Change from `hover:text-syntax-green hover:border-syntax-green` to `hover:bg-accent hover:text-accent-foreground`

**3. Add time max_limit hover** — disabled/muted state matching screenshot 3 (`reader_url(null)` pattern):
- Replace `hover:opacity-50` with `hover:bg-muted/50 hover:text-muted-foreground` to match existing disabled button hover convention

**4. Bracket size** — increase from `text-sm` to `text-base` on the `[` `]` spans

