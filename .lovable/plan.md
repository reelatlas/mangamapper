

## Plan: Fix Image Sizing in SeriesCard

### Problem
The last change added `min-h-[5rem] max-h-[5rem]` to the `img` element, which constrains it to exactly 5rem tall. Before, the image could grow vertically to fill the card height (driven by the text content beside it) using `object-cover` to maintain aspect ratio.

### Fix
**`src/components/library/SeriesCard.tsx`** — line 32:

- **Image**: Remove `min-h-[5rem] max-h-[5rem]` from the `img`. Keep `w-14 object-cover opacity-90 shrink-0`. Since the parent uses `items-stretch`, the image will naturally fill the card height and `object-cover` preserves aspect ratio. This restores pre-change behavior.

- **Fallback div** (line 28): Keep `w-14 min-h-[5rem] max-h-[5rem]` on the error fallback — this is correct because we want the zero state to stay constrained and not expand.

### Summary
One line change: remove the height constraints from the `img` tag only, leave them on the fallback `div`.

