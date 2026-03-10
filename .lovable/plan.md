

## AuthConfirm UI Refinements

### Changes to `src/pages/AuthConfirm.tsx`

**1. Pause/Start button hover colors**
- `pause` state: add `hover:text-syntax-amber hover:border-syntax-amber` (yellow on hover)
- `start` state: add `hover:text-syntax-green hover:border-syntax-green` (green on hover)

**2. Add time button — hover-to-reveal max_limit**
- When `atMaxLimit`: button is NOT disabled in the HTML sense (so hover still works), but clicks are blocked via conditional onClick
- Default text stays `add_time(5s)` always
- Use a group hover pattern: show `add_time(5s)` normally, on hover swap to `add_time(max_limit)` with muted styling when maxed
- Implementation: wrap two spans — one `group-hover:hidden` and one `hidden group-hover:inline` — inside a `group` button. When maxed, the hover text changes and button gets `cursor-not-allowed` + muted colors on hover

**3. Progress bar bracket sizing**
- Increase bracket `[` `]` text size: change from `text-xs` to `text-sm` on the brackets
- Reduce block character size: use a smaller font size on the blocks (e.g. `text-[10px]`) so 60 blocks fit on one line within `max-w-md`

**4. Status text color split**
- `[✓] email_confirmed` stays green
- `> welcome aboard!` uses default foreground color
- Split into two spans within the same flex row

