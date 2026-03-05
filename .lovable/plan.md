

## Add "new_reader" option to reader dropdown in edit series flow

The `NewSeriesForm` reader dropdown includes a `+ new_reader` option pinned at the bottom with a dashed separator, plus the `InlineNewReaderForm` sub-form. The `SeriesCard` edit flow's reader dropdown is missing this entirely.

### Changes in `src/components/library/SeriesCard.tsx`

1. **Import `InlineNewReaderForm`** at the top of the file.

2. **Add state** for `showInlineNewReader` (boolean) and `newlyCreatedReader` (to handle optimistic local state after creation).

3. **Update `readerOptions` memo** to include `newlyCreatedReader` if it's not already in the list (same pattern as `NewSeriesForm`).

4. **Add `handleReaderSelect` logic for `__new_reader__`**: When the special value is selected, show the inline form instead of selecting a reader. Reset the current row's selection.

5. **Update the Select dropdown content** (lines 286-298) to add the pinned `+ new_reader` footer after the `SelectScrollDownButton`, matching the `NewSeriesForm` pattern:
   - Add `<div className="border-t border-dashed border-border" />` separator
   - Add `<div className="p-1"><SelectItem value="__new_reader__">+ new_reader</SelectItem></div>`

6. **Add `handleNewReaderCreated` callback**: Sets `newlyCreatedReader`, auto-selects it in the current assignment row, hides the inline form, and calls `onSave` to refresh data.

7. **Render `InlineNewReaderForm`** below the reader assignments section when `showInlineNewReader` is true, passing `userId`, `readerSites` as `existingReaders`, the created callback, and cancel callback.

8. **Reset `showInlineNewReader`** in `startEditing` and `cancelEditing`.

### File modified
- `src/components/library/SeriesCard.tsx`

