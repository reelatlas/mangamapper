

## Plan: Constrain Cover Image Fallback State

### Problem
When a cover image fails to load, the browser renders the alt text which can expand the element beyond the intended `w-14` x `~5rem` dimensions, breaking card layout consistency.

### Fix
In `src/components/library/SeriesCard.tsx` (line 26), update the `img` element to:

1. Add `max-h-[5rem]` and `overflow-hidden` to constrain the image container
2. Add an `onError` handler that replaces the broken image with a styled fallback `div` showing a truncated title snippet — same dimensions (`w-14 min-h-[5rem] max-h-[5rem]`), with `text-[9px] text-muted-foreground line-clamp-3 overflow-hidden` to prevent any text expansion
3. Use React state (`imgError`) to toggle between `img` and the fallback div

The fallback div will have a muted background (`bg-muted/50`) and display a truncated version of the title, constrained to the exact same box as a loaded cover image.

### Files
| File | Change |
|------|--------|
| `src/components/library/SeriesCard.tsx` | Add `imgError` state, conditional render: `img` with `onError` or fixed-size fallback `div` with truncated text |

