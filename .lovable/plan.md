

## Disable submit/save buttons until changes are made

Add dirty-state tracking across all form instances so the primary action button is `disabled` until the user has actually changed something.

### Affected locations (7 total)

1. **NewSeriesForm** (`src/components/library/NewSeriesForm.tsx`) — `add_series()` button (line 404)
   - Already requires `animeId` to be set. The button is only disabled when `saving`. Add: disabled when `!animeId` (no series selected = no change).
   - This already validates `animeId` on submit, but the button should be visually muted too.

2. **NewReaderForm** (`src/components/library/NewReaderForm.tsx`) — `add_reader()` button (line ~155)
   - Disable when `!newSiteName.trim()` (the only required field for a new reader).

3. **InlineNewReaderForm** (`src/components/library/InlineNewReaderForm.tsx`) — `add_reader()` button (line 102)
   - Disable when `!name.trim()` (already validates on submit, just need to reflect in button state).

4. **Readers page — new reader form** (`src/pages/Readers.tsx`, line ~523)
   - Disable when `!newSiteName.trim()`.

5. **Readers page — edit reader form** (`src/pages/Readers.tsx`, line ~628)
   - Track initial state (`editSiteName`, `editSiteUrl`, `editSiteNotes`, `editSeriesAssignments`) when `startEditingReader` is called. Compute `isEditDirty` by comparing current values to initial snapshot. Disable `save_changes()` when not dirty.
   - Store initial snapshot in state (e.g., `editInitialSnapshot`).

6. **CollectionSection — edit readers** (`src/components/CollectionSection.tsx`, line ~500)
   - Track initial `editReaderAssignments` snapshot when `startEditing` is called. Compute dirty by comparing current assignments to initial. Disable `save_readers()` when not dirty.

7. **CollectionSection — edit notes** (`src/components/CollectionSection.tsx`, line ~689)
   - Disable `save()` when `editNotesValue === (progress?.notes ?? '')` (no change from original).

### Implementation approach

For **new** forms (1-4): simple — disable when the required field is empty.

For **edit** forms (5-7): capture an initial snapshot when editing starts, then compute a `isDirty` boolean by comparing current state to the snapshot. Use JSON.stringify for assignment arrays.

Each button gets `disabled={!isDirty || saving}` added to its props. The existing `disabled:opacity-50 disabled:pointer-events-none` styles in the button component handle the visual muting automatically.

### Changes per file

**`src/components/library/NewSeriesForm.tsx`**
- Line 404: add `disabled={saving || !animeId}`

**`src/components/library/NewReaderForm.tsx`**
- Submit button: add `disabled={!newSiteName.trim()}`

**`src/components/library/InlineNewReaderForm.tsx`**
- Line 102: change `disabled={saving}` to `disabled={saving || !name.trim()}`

**`src/pages/Readers.tsx`**
- New reader submit (~line 523): add `disabled={!newSiteName.trim()}`
- Edit reader: add `initialEditSnapshot` state, set it in `startEditingReader`, compute `isEditReaderDirty` comparing name/url/notes/assignments, disable `save_changes()` when not dirty
- Snapshot shape: `{ name, url, notes, assignments: JSON.stringify(seriesEntries mapped to comparable form) }`

**`src/components/CollectionSection.tsx`**
- Edit readers: add `initialReaderSnapshot` state, set in `startEditing`, compute `isReadersDirty`, disable `save_readers()` when not dirty
- Edit notes (line 689): add `disabled={savingNotes || editNotesValue === (progress?.notes ?? '')}`

