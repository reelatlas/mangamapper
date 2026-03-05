

## Plan: Increase vertical spacing above assign_to section

Change `mt-4` to `!mt-8` on the assign_to wrapper div in all four occurrences (same `!important` pattern used for the footer buttons), so the section visually separates from the fields above it.

### Files & changes

1. **`src/components/library/NewReaderForm.tsx`** line 145: `mt-4` → `!mt-8`
2. **`src/components/library/LibraryGroupedView.tsx`** line 288: `mt-4` → `!mt-8`
3. **`src/pages/Readers.tsx`** line 485: `mt-4` → `!mt-8` (new reader)
4. **`src/pages/Readers.tsx`** line 590: `mt-4` → `!mt-8` (edit reader)

