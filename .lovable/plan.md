

## Plan: Replace new_series reader/notes section with edit_series-style layout

Replace the current single reader dropdown + notes input in `NewSeriesForm` with the same multi-reader assignment UI and notes section used in the edit mode of `SeriesCard`.

### Changes to `src/components/library/NewSeriesForm.tsx`

**1. Replace single-reader state with multi-reader assignments array**
- Remove `selectedReaderKey`, `selectedReaderName`, `selectedReaderUrl`, `seriesUrl` state
- Add `editReaderAssignments: ReaderAssignment[]` state (initialized with one empty row)
- Add `showInlineNewReader` state

**2. Replace reader selection handlers with edit_series equivalents**
- Copy `handleReaderSelect`, `handleSeriesUrlChange`, `removeReaderRow`, `addReaderRow`, `handleNewReaderCreated` logic from `SeriesCard`

**3. Replace the reader UI section (lines 169-235) with the edit_series assign_to block**
- Use the same `assign_to // optional` header (line 315 of SeriesCard)
- Same grid layout with reader dropdown + series_url per row (lines 316-396 of SeriesCard)
- Same `add_another` button and `InlineNewReaderForm` placement
- Same `!mt-8` spacing

**4. Replace notes section (lines 237-247) with edit_series-style notes**
- Use `!mt-8` spacing, `// optional` suffix label (matching SeriesCard lines 401-413)

**5. Update `handleSubmit` to iterate over `editReaderAssignments`**
- Insert a `manga_reader_sites` row for each valid assignment (ones with a `readerName`)

**6. Update action buttons spacing to `!mt-8`** (matching SeriesCard line 416)

