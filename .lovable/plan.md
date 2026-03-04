

## Plan

### 1. Remove `reader_url` required validation (4 files)

Change all validation checks from requiring both name AND url to requiring only name. Update error messages to match.

**Files and locations:**
- `src/components/library/InlineNewReaderForm.tsx` (line 24): `!name.trim() || !url.trim()` → `!name.trim()`
- `src/pages/Readers.tsx` (line 202): new reader validation — name only
- `src/pages/Readers.tsx` (line 365): edit reader validation — name only
- `src/components/library/LibraryGroupedView.tsx` (line 159): edit reader validation — name only
- `src/components/library/NewReaderForm.tsx` (line 76): new reader validation — name only

Error message updated to: `'Please fill in reader name'`

### 2. Fix scroll button height jitter in reader dropdown

The `SelectScrollUpButton` and `SelectScrollDownButton` appear/disappear as user scrolls to top/bottom, causing the dropdown height to shift.

**Fix**: Give the scroll buttons a fixed reserved space using `min-h` so they always occupy the same height whether visible or not. Override the scroll button styles in the `NewSeriesForm.tsx` dropdown with a wrapper that maintains height:

```tsx
<div className="h-[25px]">
  <SelectScrollUpButton />
</div>
```

This reserves a fixed height slot. The Radix scroll buttons already hide themselves via `display: none` when not needed — wrapping in a fixed-height container means the space is always occupied, preventing layout shift. Same for the down button.

**Single additional file**: `src/components/library/NewSeriesForm.tsx` (lines 169, 177)

