

## Plan

The reader group header uses `p-3` for padding, but the hover overlay with `absolute inset-0` and `flex items-center justify-center` should visually center the buttons. The likely issue is that the card has minimal content height, and the buttons row itself has asymmetric internal padding or the card's `space-y-1` creates uneven visual weight.

### Fix

In `LibraryGroupedView.tsx`, add explicit equal vertical padding to the hover overlay content areas (both the normal hover and the delete confirmation overlays) to ensure consistent spacing. Change `inset-0` to use `p-3` on the overlay divs to match the card's own padding, ensuring the overlay content aligns with the card edges rather than relying solely on centering.

**File: `src/components/library/LibraryGroupedView.tsx`**

- **Line 410** (delete confirmation overlay): Change from `absolute inset-0 bg-background/90 flex items-center justify-center` → add `p-3` to ensure equal padding
- **Line 420** (hover overlay): Same treatment — add `p-3`

Both overlays already use `inset-0` which fills the card. Adding `p-3` to match the card's own padding ensures the button content has visually equal spacing top and bottom, instead of relying on `items-center justify-center` which can look off on short cards.

