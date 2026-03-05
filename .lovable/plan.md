

## Edit Series Flow

Add inline editing to `SeriesCard`, mirroring the edit reader pattern. Clicking edit on a series card transforms it into an editable form with progress fields and a reader assignment builder.

### New type

**`src/types/library.ts`** -- Add `ReaderAssignment` interface (inverse of `SeriesAssignment`):
```ts
export interface ReaderAssignment {
  readerName: string;
  readerUrl: string;
  seriesUrl: string;
  suffix: string;
  existingSiteId?: string;  // manga_reader_sites.id if editing existing
  userModified?: boolean;
}
```

### SeriesCard changes

**`src/components/library/SeriesCard.tsx`** -- Major expansion:

**New props needed:**
- `userId: string`
- `onSave: () => void` (triggers `handleRefreshAll` to re-fetch progress + readers)
- `hasManga: boolean` (from anime data, to conditionally show read fields)

**Edit mode state:**
- `isEditing` boolean
- `editWatchedEpisode`, `editReadVolume`, `editReadChapter` -- progress fields
- `editReaderAssignments: ReaderAssignment[]` -- the reader builder rows

**View mode:** Add a pencil edit button (like the edit reader button). Clicking it populates edit state from current `item` progress values and current linked readers (from `readerSites` filtered by `anime_id`).

**Edit mode renders:**
1. Series title (read-only, displayed as header)
2. `last_watched` section with episode input (same pattern as ProgressTracker)
3. `last_read` section with vol + ch inputs (only if `hasManga`)
4. `assign_to // optional` section:
   - Each row: reader select (from distinct reader names) + series_url input + trash button
   - `+ add_another` button to add rows
   - Reader select excludes already-assigned readers in other rows (same dedup pattern as edit_reader's SeriesCombobox)
5. `save_changes()` + `cancel` + `delete_from_library()` buttons

**Save logic:**
1. Upsert `anime_progress` with updated episode/vol/ch values
2. Diff reader assignments vs existing linked readers:
   - Keep existing rows that match, update their `series_url` if changed
   - Insert new rows for newly added readers
   - Delete removed reader assignment rows
3. Call `onSave()` to refresh all data

**Reader select component:** Use a simple `Select` dropdown listing distinct reader names (same pattern as `NewSeriesForm`'s reader select). Each reader option maps to a `name + url` pair. When selected, auto-fill `seriesUrl` with the reader's base URL + trailing slash.

### Parent wiring

**`src/components/library/LibraryFlatView.tsx`:**
- Pass `userId`, `readerSites`, and `onSave={handleRefreshAll}` through to `SeriesCard`
- Add `userId` prop to `LibraryFlatViewProps`

**`src/components/library/LibraryGroupedView.tsx`:**
- Pass `userId`, `readerSites`, and `onSave={fetchReaderSites}` (which is already `handleRefreshAll`) to each `SeriesCard`

**`src/pages/Library.tsx`:**
- Pass `userId={user!.id}` to `LibraryFlatView`

### Files to modify:
1. `src/types/library.ts` -- add `ReaderAssignment` type
2. `src/components/library/SeriesCard.tsx` -- add edit mode with progress fields + reader assignment builder
3. `src/components/library/LibraryFlatView.tsx` -- pass new props to SeriesCard
4. `src/components/library/LibraryGroupedView.tsx` -- pass new props to SeriesCard
5. `src/pages/Library.tsx` -- pass userId to flat view

