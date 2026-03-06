

## Fix Stray Trailing Slash When Reader Has No URL

The bug: when a reader is created/selected with an empty URL, expressions like `reader.url.endsWith('/') ? reader.url : reader.url + '/'` produce `'/'` from an empty string. The fix is to guard with `reader.url ? ... : ''` everywhere.

### Affected locations

**1. `src/components/library/NewSeriesForm.tsx`**
- Line 72: selecting existing reader → `const baseUrl = option.url ? (option.url.endsWith('/') ? option.url : option.url + '/') : '';`
- Line 85: after inline new reader created → same guard on `readerUrl`

**2. `src/components/library/SeriesCard.tsx`**
- Line 122: selecting existing reader → guard `option.url`
- Line 135: already guarded ✓ (no change needed)

**3. `src/components/AddToReaderDropdown.tsx`**
- Line 61: selecting reader → `const baseUrl = reader.url ? (reader.url.endsWith('/') ? reader.url : reader.url + '/') : '';`

**4. `src/components/library/NewReaderForm.tsx`** (from provided code)
- Lines in `addSeriesRow`, `updateSeriesAssignment`, `handleReaderUrlChange` — these already use the `newSiteUrl.trim() ? ... : ''` pattern, so they're safe. No changes needed.

**5. `src/pages/Readers.tsx`** and **`src/components/library/LibraryGroupedView.tsx`** — these also already use the `trim() ? ... : ''` guard pattern. No changes needed.

### Summary
Three files need the empty-URL guard added at 4 specific spots. Simple one-line conditional fixes.

