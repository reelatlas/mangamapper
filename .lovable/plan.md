

## Plan: Auto-populate readers and notes when selecting a series

When a user selects a series in the `NewSeriesForm`, if that series already has existing reader assignments or notes in the database, populate the form fields automatically.

### Changes to `src/components/library/NewSeriesForm.tsx`

**Add a handler that runs when `animeId` changes** (either via `useEffect` on `animeId` or wrapping `setAnimeId`):

1. **Populate reader assignments**: Filter `readerSites` by `anime_id === animeId`. For each matching reader site, create a `ReaderAssignment` entry with `readerName`, `readerUrl`, `seriesUrl`, `suffix`, and `existingSiteId`. If none found, reset to one empty row.

2. **Populate series notes**: Find matching entry in `progress` (even non-library entries may exist). Also query `anime_progress` for the selected `animeId` if not in the passed `progress` array (since `progress` is filtered to `in_library: true`). Set `notes` from the matched entry.

3. **Reset on clear**: When `animeId` is cleared, reset assignments and notes to defaults.

The simplest approach: wrap the `setAnimeId` call in a custom handler (`handleAnimeSelect`) that does the lookup from the already-available `readerSites` and `progress` props, plus a quick Supabase query for any non-library progress notes.

