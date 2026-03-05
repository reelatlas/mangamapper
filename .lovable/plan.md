

## Plan

Two changes:

### 1. Series Combobox: Single chevron icon
In `SeriesCombobox.tsx`, replace `ChevronsUpDown` (double chevron) with `ChevronDown` (single chevron) to match the reader Select dropdown styling.

- Import `ChevronDown` instead of `ChevronsUpDown` from lucide-react
- Swap the icon on line 70

### 2. Fix reader dropdown height shift in edit series flow
The Radix `ScrollUpButton` / `ScrollDownButton` components auto-hide when there's nothing to scroll in that direction, causing the dropdown to shift height. The fix is to wrap the viewport in a container with fixed max-height and use CSS to reserve space for the scroll arrows so they don't collapse.

In `SeriesCard.tsx` (lines 328-345), update the reader dropdown content to use `min-height` on the scroll buttons so they always occupy space even when hidden by Radix:

- Add `min-h-[25px]` to both `SelectScrollUpButton` and `SelectScrollDownButton` so they reserve vertical space regardless of scroll state, preventing the content area from resizing as the user scrolls

This matches the approach that should be applied in both forms for consistency.

