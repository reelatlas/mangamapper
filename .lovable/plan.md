

## Plan: Add series-level notes

### What exists today
- `NewSeriesForm` has a notes input, but it saves to `manga_reader_sites.notes` (reader-level notes)
- Series cards and the details page `library_data` section have no series notes display or editing
- Reader notes (`manga_reader_sites.notes`) shown in reader headers — this stays unchanged

### What needs to happen

**Database**: Add `notes text` column to `anime_progress` table.

**Types**: Add `notes: string | null` to the `AnimeProgress` interface in `src/types/library.ts`.

**NewSeriesForm** (`src/components/library/NewSeriesForm.tsx`):
- Move the `notes` value into the `anime_progress` upsert (not the reader insert)
- Remove `notes` from the `manga_reader_sites` insert — reader notes are only set via the reader-specific flows

**SeriesCard view mode** (`src/components/library/SeriesCard.tsx` ~line 495):
- Display `item.notes` below the readers row if present (small muted text with a note icon)

**SeriesCard edit mode** (`src/components/library/SeriesCard.tsx` ~line 240):
- Add `editNotes` state, populate from `item?.notes` in `startEditing`
- Add a notes input field in the edit form (after the reader assignments section)
- Include `notes` in the `anime_progress` upsert in `saveChanges`

**CollectionSection view mode** (`src/components/CollectionSection.tsx` ~line 569):
- Add a notes display section after the readers section, showing `progress.notes` if present

**CollectionSection edit mode** (`src/components/CollectionSection.tsx` ~line 365):
- Rename header from `edit_readers` to `edit_series`
- Add `editNotes` state, populate from progress
- Add notes input field
- Save notes to `anime_progress` in `saveChanges`
- Rename save button from `save_readers()` to `save()`

**CollectionSection `toggleLibrary`** (~line 157):
- When removing: also set `notes: null` on the progress update (readers already get deleted, notes get cleared too)

**`useLibraryData.ts` `removeFromLibrary`** (~line 48):
- Also set `notes: null` in the update alongside `in_library: false`

**CollectionSection Progress interface** (~line 21):
- Add `notes: string | null`

