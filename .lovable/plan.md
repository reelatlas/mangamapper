

## Plan: Persist all data when removing series from library

Three locations clear data on library removal — all need to only set `in_library: false` without touching notes, readers, or progress fields.

### Changes

**1. `src/hooks/useLibraryData.ts` (line 46-67) — Library page removal**
- Change `.update({ in_library: false, notes: null })` to `.update({ in_library: false })`
- Remove the reader sites deletion block (lines 57-62)

**2. `src/components/CollectionSection.tsx` (line 163-172) — Details page removal**
- Change `.update({ in_library: false, notes: null })` to `.update({ in_library: false })`
- Remove the `manga_reader_sites` delete call (line 168)
- Keep `setLinkedReaders([])` for local UI state (hides readers while not in library)

**3. `src/components/CollectionSection.tsx` — Details page re-add**
- When toggling back to `in_library: true` (line 174), after the upsert succeeds, re-fetch progress and reader data so persisted notes/readers/progress fields repopulate the UI.

