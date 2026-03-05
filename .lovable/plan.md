

## Problem

When a user removes a series from the library via the toggle on the detail page, only `in_library` is set to `false`. The `manga_reader_sites` rows linking that anime to readers remain untouched. This means:
- The library grouped/flat views correctly hide it (due to filtering)
- But the detail page's `read_manga` section still shows linked readers
- Re-adding to library later would show stale reader assignments

The user expects "remove from library" to be a full cleanup -- severing all reader associations for that anime.

## Plan

**File: `src/components/LibrarySection.tsx`** -- In the `toggleLibrary` function, after successfully setting `in_library: false`, also delete all `manga_reader_sites` rows for this user + anime. Then trigger a page-level refresh of the linked readers.

1. After the successful `update({ in_library: false })` call (line 59), add a delete call:
   ```ts
   await supabase
     .from('manga_reader_sites')
     .delete()
     .eq('user_id', user.id)
     .eq('anime_id', animeId);
   ```

2. To refresh the `read_manga` section on the detail page, add an optional `onLibraryChange` callback prop. The detail page passes its `fetchLinkedReaders` function so the reader list re-fetches after removal.

**File: `src/pages/AnimeDetail.tsx`** -- Pass `onLibraryChange={fetchLinkedReaders}` to `<LibrarySection>`.

This ensures removing from library fully cleans up reader assignments everywhere.

