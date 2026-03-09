

## Problem

When selecting a series in the new_series form, `handleAnimeSelect` pre-populates `editReaderAssignments` with all existing reader associations from the DB (each with an `existingSiteId`). If the user removes one of these rows, `removeReaderRow` removes it from the local array. But `handleSubmit` only processes entries **remaining** in the array -- it never unlinks the removed ones from the database. So the deleted reader association persists with its `anime_id` intact.

## Solution

Track which `existingSiteId`s were initially loaded when a series is selected. On submit, compare that set against the IDs still present in `editReaderAssignments`. For any initially-loaded IDs that were removed by the user, set `anime_id = null` on those `manga_reader_sites` records to unlink them.

## Changes

**`src/components/library/NewSeriesForm.tsx`**

1. Add state to track initially loaded existing site IDs:
   ```ts
   const [initialExistingSiteIds, setInitialExistingSiteIds] = useState<string[]>([]);
   ```

2. In `handleAnimeSelect`, when populating from matching readers, also save their IDs:
   ```ts
   setInitialExistingSiteIds(matchingReaders.map(r => r.id));
   ```
   When clearing (empty `id`), reset to `[]`.

3. In `handleSubmit`, after processing valid assignments, compute removed IDs and unlink them:
   ```ts
   const remainingExistingIds = validAssignments
     .filter(a => a.existingSiteId)
     .map(a => a.existingSiteId!);
   const removedIds = initialExistingSiteIds
     .filter(id => !remainingExistingIds.includes(id));
   if (removedIds.length > 0) {
     await supabase
       .from('manga_reader_sites')
       .update({ anime_id: null, series_url: null })
       .in('id', removedIds);
   }
   ```

This preserves the reader site records themselves (just unlinks the series) and respects the user's removal intent.

