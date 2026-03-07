

## Fix: Stale UI and duplicate reader additions on details page

**Problem**: After saving a new reader assignment in `CollectionSection`, the view doesn't update to show the newly linked reader. This happens because `fetchData()` is called without `await` in `saveChanges()`, so the component switches to view mode with stale (empty) `linkedReaders` state. The user then sees "reader(null)" again and can add the same reader a second time.

**Root cause** (in `CollectionSection.tsx` `saveChanges`, ~line 282-284):
```
setSaving(false);
setIsEditing(false);  // switches to view mode immediately
fetchData();           // not awaited — view renders with stale linkedReaders
```

**Fix** — two changes in `CollectionSection.tsx`:

1. **Await `fetchData()` before exiting edit mode** in `saveChanges()`: Move `setIsEditing(false)` and `setSaving(false)` after `await fetchData()` so the view mode renders with fresh data.

2. **Prevent duplicate reader assignments**: Before inserting a new reader assignment in `saveChanges()`, check if a record with the same `name` + `anime_id` already exists in `linkedReaders`. Skip insertion if it's a duplicate. This mirrors the duplicate prevention already in place in `AddToReaderDropdown` (which filters out `linkedReaderNames`).

Both changes are confined to the `saveChanges` function in `CollectionSection.tsx`.

