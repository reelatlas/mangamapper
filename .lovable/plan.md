

## Fix: Show filters in grouped view when only unassigned series exist

**Bug**: In `LibraryGroupedView`, line 297 conditionally renders the filter bar with `{readerSites.length > 0 && (`. When a user has series in their library but no readers, they see the grouped view content (unassigned section) but the view toggle and sort controls disappear.

**Fix**: Change the condition to always show the filter bar in the non-empty state. The empty state (line 243) already has its own view toggle, and the `return` at line 293 prevents reaching line 297 when both are empty. So the guard on line 297 is redundant — removing it will show filters whenever there's any content (readers or unassigned series).

**File**: `src/components/library/LibraryGroupedView.tsx`
- Remove the `{readerSites.length > 0 && (` wrapper around lines 297-309, making the filter bar always render in the non-empty view.

