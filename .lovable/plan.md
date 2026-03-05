
Goal: make library + reader state fully consistent across all entry points (flat view, grouped-by-reader view, detail page), so removing/adding in one place is reflected everywhere.

What’s happening now
- The grouped-by-reader removal path in `src/components/library/LibraryGroupedView.tsx` is bypassing shared logic.
- It directly sets `anime_progress.in_library = false` but does not delete `manga_reader_sites` assignments.
- Network evidence confirms this: PATCH to `anime_progress` succeeds, but no DELETE on `manga_reader_sites` for `bleach-tybw`, so detail page still shows linked readers.

Implementation plan
1. Centralize removal behavior
- In `LibraryGroupedView`, remove the inline `onRemove` handlers that directly call `supabase.from('anime_progress').update(...)`.
- Add a `removeFromLibrary` prop to `LibraryGroupedView` and use it for every `SeriesCard` remove action (grouped entries + unassigned entries).
- This reuses `useLibraryData.removeFromLibrary`, which already performs:
  - set `in_library=false`
  - delete related `manga_reader_sites` rows for the same user/anime
  - refresh both progress + readers

2. Wire shared handler from parent
- In `src/pages/Library.tsx`, pass `removeFromLibrary` into `LibraryGroupedView` (like flat view already does).
- Keep `fetchReaderSites={handleRefreshAll}` as-is (or rename prop for clarity in a cleanup pass), since grouped view also needs full refresh after edits.

3. Remove duplicate DB logic in grouped view
- Delete now-redundant direct `supabase` update code inside grouped view `onRemove` callbacks.
- Remove no-longer-needed imports from grouped view (`supabase` and related inline removal-only code paths), while keeping edit/save logic intact.

4. Verify add flows remain bidirectional
- Keep current grouped edit/save behavior that upserts `anime_progress` with `in_library=true` when assigning a series to a reader.
- Confirm detail-page add-to-reader path still upserts `in_library=true` and refreshes library section.
- Net result: adding either via library or detail keeps both “in_library” and “read_manga” state in sync.

5. Validation checklist
- From grouped-by-reader, remove a series card → confirm:
  - disappears from library lists
  - reader assignment is removed from DB
  - detail page `read_manga` no longer shows that reader
- Add a reader assignment in library grouped flow → confirm detail page shows reader and library toggle is in-library.
- Add reader from detail page → confirm grouped/flat library views reflect assignment + in-library state.
