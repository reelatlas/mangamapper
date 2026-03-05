

## Plan: Match spacing between field and trash button in NewSeriesForm

The new_reader form uses `gap-2` between the field and the trash icon. The new_series form currently uses `gap-1` for both the series and reader rows. Change both to `gap-2` to match.

### Changes in `src/components/library/NewSeriesForm.tsx`

1. **Line 150**: Change `flex gap-1 items-center` → `flex gap-2 items-center` (series row)
2. **Line 174**: Change `flex gap-1 items-center` → `flex gap-2 items-center` (reader row)

**Single file**: `src/components/library/NewSeriesForm.tsx`

