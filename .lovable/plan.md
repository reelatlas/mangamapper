

## Plan: Rename `notes` labels to `series_notes` and `reader_notes`

### Series notes → `series_notes` (5 locations)

1. **`src/components/library/NewSeriesForm.tsx`** line 301: `notes` → `series_notes`
2. **`src/components/library/SeriesCard.tsx`** line 404: `notes` → `series_notes` (edit label)
3. **`src/components/library/SeriesCard.tsx`** line 520: `notes(null)` → `series_notes(null)` (display)
4. **`src/components/CollectionSection.tsx`** line 668: `notes` → `series_notes` (details header)
5. **`src/components/CollectionSection.tsx`** line 705: `notes(null)` → `series_notes(null)` and `add_notes` → `add_series_notes`

### Reader notes → `reader_notes` (7 locations)

1. **`src/pages/Readers.tsx`** line 478: new reader label
2. **`src/pages/Readers.tsx`** line 582: edit reader label
3. **`src/pages/Readers.tsx`** line 680: display label
4. **`src/components/library/NewReaderForm.tsx`** line 139: label
5. **`src/components/library/InlineNewReaderForm.tsx`** line 91: label
6. **`src/components/library/LibraryGroupedView.tsx`** line 389: edit label
7. **`src/components/library/LibraryGroupedView.tsx`** line 475: display label

All changes are pure string replacements in JSX text content.

