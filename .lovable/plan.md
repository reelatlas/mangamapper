

## Plan: Show progress fields regardless of library status

Currently, sections 2 (progress inputs), 3 (readers), and 4 (last_updated) are conditionally rendered with `{inLibrary && ...}`. The user wants progress data (last_watched, last_read, last_updated) to always be visible, even when the item is not in the library.

### Changes to `src/components/CollectionSection.tsx`

**1. Always show progress inputs (Section 2, line 456)**
- Remove the `{inLibrary && (` wrapper around the progress inputs block (lines 456 and 512)
- Instead, gate it on `progress` existing (i.e., show whenever there's a progress record, regardless of `in_library` status)
- Since progress data is preserved when removing from library (only `in_library` flips to false), the record still exists and inputs should display

**2. Keep readers gated on `inLibrary` (Section 3, line 515)**
- No change here — readers are still removed when leaving library, so hiding them when not in library is correct

**3. Always show last_updated (Section 4, line 553)**
- Change `{inLibrary && progress?.updated_at && (` to just `{progress?.updated_at && (`
- The timestamp should display whenever progress exists

**4. Ensure `saveProgress` creates/upserts without requiring `in_library`**
- The existing `saveProgress` function already uses `upsert` with `onConflict: 'user_id,anime_id'` and does NOT set `in_library`, so it preserves the current value — no change needed

### Summary of conditional changes

| Section | Before | After |
|---------|--------|-------|
| Progress inputs | `inLibrary && (...)` | `progress && (...)` |
| Readers | `inLibrary && anime.hasManga && (...)` | No change |
| Last updated | `inLibrary && progress?.updated_at && (...)` | `progress?.updated_at && (...)` |

