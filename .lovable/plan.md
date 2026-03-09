

## Revert pluralization and update button labels

### Changes in `CollectionSection.tsx`:

1. **Line 680**: `readers(null)` → `reader(null)`
2. **Line 681**: `> add_readers` → `> add_reader`
3. **Line 445**: `'add_readers'` → `'add_reader'` (header in add mode)
4. **Line 521**: `'add_readers()'` → `'add_reader()'` (confirm button in add mode)
5. **Line 521**: `'save_readers()'` → `'save_changes()'` (confirm button in edit mode)

### Changes in `SeriesCard.tsx`:

6. **Line 544**: `readers(null)` → `reader(null)`

