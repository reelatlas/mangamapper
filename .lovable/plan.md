

## Problem

The `removeFromLibrary` function in `useLibraryData.ts` only sets `in_library: false` but does not delete associated `manga_reader_sites` entries. This means:
- Removing from the library page leaves stale reader assignments in the DB
- Navigating to the detail page still shows readers linked to that anime

The detail page's `LibrarySection` already does the cleanup (deletes `manga_reader_sites` on removal), but the library page's hook does not.

## Plan

**File: `src/hooks/useLibraryData.ts`** -- Update `removeFromLibrary` to also delete `manga_reader_sites` rows for that anime, then refresh both progress and reader sites.

Currently the function receives the progress row `id`, but we need the `anime_id` and `user_id` to delete reader assignments. We can look up the progress entry from state before updating, or pass `anime_id` directly.

Approach: Find the progress entry by `id` from the current `progress` state to get `anime_id` and `user_id`, then:
1. Set `in_library: false`
2. Delete all `manga_reader_sites` where `user_id` and `anime_id` match
3. Re-fetch both `progress` and `readerSites`

```ts
const removeFromLibrary = async (id: string) => {
  const entry = progress.find(p => p.id === id);
  const { error } = await supabase
    .from('anime_progress')
    .update({ in_library: false })
    .eq('id', id);

  if (error) {
    toast.error('Failed to remove from library');
  } else {
    // Clean up reader assignments
    if (entry) {
      await supabase
        .from('manga_reader_sites')
        .delete()
        .eq('user_id', entry.user_id)
        .eq('anime_id', entry.anime_id);
    }
    toast.success('Removed from library');
    fetchProgress();
    fetchReaderSites(); // also refresh readers since we deleted some
  }
};
```

This is a single-file change that ensures library removal from any page consistently cleans up reader assignments.

