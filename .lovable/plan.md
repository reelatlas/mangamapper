

## Problem

The grouped-by-reader view shows series based on `manga_reader_sites` entries, independent of library status. When a series is removed from the library (`in_library: false`), it disappears from the flat "all" view but persists in reader groups because those groups iterate over `manga_reader_sites` entries, not library progress.

## Solution

Filter `seriesEntries` in `LibraryGroupedView.tsx` to only include entries whose `anime_id` exists in the `progress` array. Since `progress` is already filtered to `in_library: true` by the `useLibraryData` hook, this naturally excludes removed series.

### Technical detail

In `LibraryGroupedView.tsx` around line 256, where `seriesEntries` is computed per reader group:

```ts
const seriesEntries = group.entries
  .filter(e => e.anime_id)
  // ADD: only show series that are in the library
  .filter(e => progress.some(p => p.anime_id === e.anime_id))
  .sort(...)
```

This single filter addition ensures that when a series is removed from the library (on the detail page or flat view), it also disappears from all reader groups in the grouped view.

**File:** `src/components/library/LibraryGroupedView.tsx` -- one line change at the `seriesEntries` filter.

