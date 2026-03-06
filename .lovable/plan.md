

## Fix Reader Dropdown Vertical Spacing

All three files with the `h-[25px]` scroll button wrappers are covered:

1. **`src/components/library/NewSeriesForm.tsx`** (new series flow)
2. **`src/components/library/SeriesCard.tsx`** (edit series flow)
3. **`src/components/CollectionSection.tsx`** (detail page collection/reader assignment)

The `AddToReaderDropdown` on the detail page uses a Popover with plain buttons — not a Select dropdown — so it doesn't have this issue.

### Fix (same in all 3 files)
Replace `<div className="h-[25px]"><SelectScrollUpButton /></div>` with just `<SelectScrollUpButton />`, and same for the down button. The Radix scroll buttons already self-hide when there's no overflow, so removing the fixed-height wrappers eliminates the blank space when the list is empty or short.

