

## Plan: Keep readers and notes visible when not in library

Currently, the readers section (line 618) and notes section (line 664) are conditionally rendered with `{inLibrary && ...}`, hiding them when the series is removed from the library.

### Changes

**`src/components/CollectionSection.tsx`** — 2 edits:

1. **Line 618**: Change `{inLibrary && anime.hasManga && (` to `{anime.hasManga && (` — remove the `inLibrary` guard so readers always show when the anime has manga.

2. **Line 664**: Change `{inLibrary && (` to just `{(` (or remove the conditional wrapper entirely) — so the notes section always renders regardless of library status.

Additionally on line 170, remove `setLinkedReaders([])` from the removal handler so linked readers remain populated in the UI after toggling `in_library` to false.

