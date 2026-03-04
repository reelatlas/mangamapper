

## Plan: Prevent Duplicate Series Selection

### 1. NewSeriesForm — exclude series already in library

**File**: `src/components/library/NewSeriesForm.tsx`

Pass the `progress` array (library entries) to `NewSeriesForm` so it can extract anime IDs already in the library and pass them as `excludeIds` to `SeriesCombobox`.

- **Library.tsx** (line ~97): Add `progress` prop when rendering `<NewSeriesForm>`.
- **NewSeriesForm.tsx**: Accept `progress` prop (type `AnimeProgress[]`), compute `libraryAnimeIds = progress.map(p => p.anime_id)`, pass as `excludeIds` to `SeriesCombobox`.

### 2. NewReaderForm — exclude series already assigned to any reader with same name + selected in other rows

**File**: `src/components/library/NewReaderForm.tsx`

Currently `excludeIds` only filters out sibling row selections. We also need to exclude series already assigned to the reader being created (by name match from `readerSites`). Since the reader is new, there won't be existing DB entries — so the current sibling-row logic is sufficient. No change needed here beyond the existing behavior.

### 3. Edit Reader (LibraryGroupedView) — exclude series already in this reader group + selected in other rows

**File**: `src/components/library/LibraryGroupedView.tsx` (line 296)

Currently `excludeIds` only filters sibling `editSeriesAssignments` rows. We should also include anime IDs from the existing group entries that are not being edited (i.e., entries that already exist in the reader group). Actually, looking at the code, `editSeriesAssignments` is initialized from the group's existing entries, so the sibling-row filter already covers them — existing entries show up as rows, and their IDs are excluded from other rows.

**Conclusion**: The edit reader form's current logic is already correct since all existing assignments become rows in `editSeriesAssignments`.

### Summary of actual changes needed

Only **one change** is needed:

| File | Change |
|------|--------|
| `src/pages/Library.tsx` | Pass `progress` prop to `<NewSeriesForm>` |
| `src/components/library/NewSeriesForm.tsx` | Accept `progress: AnimeProgress[]` prop, pass `progress.map(p => p.anime_id)` as `excludeIds` to `SeriesCombobox` |

