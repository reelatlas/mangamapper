

## Plan: Respect user-cleared series_url across all reader components

### Problem
When a user clears a `series_url` and saves (DB stores `null`), the URL gets re-populated with the reader's base URL the next time the form is loaded or the reader is selected. The user's intentional clearing is not respected.

### Root causes

1. **NewSeriesForm `handleAnimeSelect`** (line 52): `seriesUrl: r.series_url || base` falls back to base URL when DB value is null
2. **All `handleReaderSelect` functions** (SeriesCard line 126, CollectionSection line 263, NewSeriesForm line 111): Always set `seriesUrl` to the reader's base URL when a reader is selected, even if there's an existing DB record with a null/custom series_url for that reader+anime
3. **AddToReaderDropdown `handleSelectReader`** (line 61): Same - always defaults to base URL
4. **Reader URL change propagation** (LibraryGroupedView `handleEditReaderUrlChange` line 175, NewReaderForm line 57): Auto-updates all series_urls including ones the user intentionally cleared

### Changes

**1. NewSeriesForm.tsx `handleAnimeSelect`** (line 52)
- Change `seriesUrl: r.series_url || base` to `seriesUrl: r.series_url ?? ''`
- If DB has null, keep empty instead of falling back to base URL

**2. SeriesCard.tsx `handleReaderSelect`** (~line 111-131)
- Before defaulting to base URL, check `readerSites` for an existing record matching the selected reader name + current `resolvedAnimeId`
- If found, use the existing `series_url` from DB (empty if null)
- Only default to base URL if no existing record exists

**3. CollectionSection.tsx `handleReaderSelect`** (~line 253-264)
- Same logic: check `allReaderSites` for existing record for selected reader + `anime.id`
- Use DB value if exists, base URL only for new assignments

**4. NewSeriesForm.tsx `handleReaderSelect`** (~line 100-117)
- Same: check `readerSites` for existing record for selected reader + current `animeId`
- Use DB value if found

**5. AddToReaderDropdown.tsx `handleSelectReader`** (~line 58-63)
- Check existing linked readers for this anime + selected reader name
- Use existing `series_url` if found

**6. LibraryGroupedView.tsx `handleEditReaderUrlChange`** (~line 171-181)
- Skip auto-updating series_url for assignments where `seriesUrl` is empty (user intentionally cleared)
- Only propagate URL changes to assignments that have a non-empty series_url

**7. NewReaderForm.tsx `handleReaderUrlChange`** (~line 55-62)
- Same: skip propagation for assignments with empty seriesUrl

**8. LibraryGroupedView.tsx `addEditSeriesRow`** (line 150-151) and `removeEditSeriesRow` (line 187-188)
- When resetting to empty, use `seriesUrl: ''` instead of base URL
- `addEditSeriesRow` can keep base URL for truly new rows (user hasn't cleared anything yet)

