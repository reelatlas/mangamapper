

## Plan: Show All Reader Entries Regardless of Library Status

### Problem
In the grouped view, line 388 filters out series entries that don't have a matching `progress` record (`if (!progressItem) return null`). This means reader entries for series not in the library are hidden in the view but visible in the edit form.

### Solution — `src/components/library/LibraryGroupedView.tsx`

Remove the early return on line 388. Instead, pass `progressItem` as potentially `undefined` to `SeriesCard`, allowing all reader entries to render even without a library progress record.

Before checking `SeriesCard`, I need to verify what props it requires.

### Files to check
- `src/components/library/SeriesCard.tsx` — confirm if it can handle a missing/undefined progress item, or if it needs adjustment.

### Changes

1. **LibraryGroupedView.tsx (line 386-407)**: Remove `if (!progressItem) return null` guard. Render all `seriesEntries` — if `progressItem` is undefined, still show the card with the series name (from `mockAnimeData`) but without progress info.

2. **SeriesCard.tsx**: May need to make the `item` prop optional or accept a partial item, rendering gracefully when no progress data exists.

