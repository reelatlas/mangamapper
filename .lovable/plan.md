

## Problem

When editing a reader in the grouped view, the `startEditingReader` function filters out series not in the library (line 132). This is correct for display. However, when the user then **selects** a non-library anime (e.g., Naruto) via the series combobox:

1. The existing reader association data (series_url, existingId) for that anime+reader combo is not looked up, so the fields start blank instead of pre-populated.
2. On save, since `existingId` is missing, a new `insert` happens instead of updating the existing record, potentially creating a duplicate.

Scenario 2 (showing the anime under other readers after save) already works: `saveReaderEdit` upserts into `anime_progress` with `in_library: true` (line 237), and once the page refreshes, the grouped view filter on line 132 will include the anime under all its associated readers.

## Plan

### 1. Pre-populate existing reader data when selecting an anime in `updateEditSeriesAssignment`

**File: `src/components/library/LibraryGroupedView.tsx`** -- `updateEditSeriesAssignment` function (line 162-164)

When `field === 'animeId'` and a value is selected, look up `readerSites` for an existing entry matching:
- Same reader name (case-insensitive, matching `editingReaderName`)
- Same `anime_id` as the selected value

If found:
- Set `existingId` to the found entry's `id`
- Set `seriesUrl` to the found entry's `series_url` (preserving persisted data)
- Set `userModified` to `true` (so subsequent URL changes don't overwrite)

If not found:
- Clear `existingId`
- Set `seriesUrl` to the base URL (current behavior via suffix logic)
- Keep `userModified` as `true`

This ensures:
- Existing series_url data is restored when re-selecting a previously-associated anime
- The `existingId` is set so `saveReaderEdit` does an `update` instead of `insert`
- User can still modify the pre-populated series_url freely

### 2. No other changes needed

- **Save flow** (line 235-242): Already upserts `anime_progress` with `in_library: true`, so adding Naruto back via any reader automatically makes it appear under all associated readers after refresh.
- **Duplicate prevention**: Setting `existingId` from the lookup ensures the save uses `update` instead of `insert`.

