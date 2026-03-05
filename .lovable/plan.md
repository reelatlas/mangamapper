

## Plan: Reduce vertical spacing between form field rows

The forms currently use `space-y-3` (0.75rem) on the parent `<form>`. Reducing to `space-y-2` (0.5rem) will tighten the gaps between the field rows (reader_name/reader_url grid, notes, series, reader, etc.) while the `!mt-8` on major sections and footer buttons stays untouched.

### Changes

1. **`src/components/library/NewReaderForm.tsx`** line 122: `space-y-3` → `space-y-2`
2. **`src/components/library/NewSeriesForm.tsx`** line 145: `space-y-3` → `space-y-2`
3. **`src/components/library/LibraryGroupedView.tsx`** — edit reader form: `space-y-3` → `space-y-2`
4. **`src/pages/Readers.tsx`** — new reader and edit reader forms: `space-y-3` → `space-y-2`

