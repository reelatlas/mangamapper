

## Plan: Filter non-library series from edit_reader flow in Library

### Problem
When editing a reader in the grouped view, `startEditingReader` loads **all** `group.entries` with an `anime_id`, including series that are no longer in the library. The user sees and can modify reader assignments for series they've removed.

### Solution
Filter `group.entries` in `startEditingReader` to only include series that are currently in the library (i.e., have a matching entry in the `progress` array).

### Change

**`src/components/library/LibraryGroupedView.tsx`** — `startEditingReader` (line 132)

Change the filter from:
```ts
const seriesEntries = group.entries.filter(e => e.anime_id)
```
to:
```ts
const seriesEntries = group.entries
  .filter(e => e.anime_id && progress.some(p => p.anime_id === e.anime_id))
```

This mirrors the exact same filter already used on line 363 for display. Non-library reader associations remain persisted in the database and are still editable from the anime detail page — they just won't appear in the library's edit_reader form.

### No other changes needed
- The detail page (`AnimeDetail.tsx`, `CollectionSection.tsx`) reads directly from `manga_reader_sites` regardless of `in_library`, so editing/persisting reader data there is unaffected.
- The `saveReaderEdit` function doesn't need changes — it only processes what's in `editSeriesAssignments`, which will now be correctly scoped.

