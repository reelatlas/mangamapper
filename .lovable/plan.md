

## Plan: Ensure Reader-Assigned Series Always Appear in Library

### Problem
When a series is assigned to a reader via `NewReaderForm`, `AddToReaderDropdown`, or the edit reader flow in `LibraryGroupedView`, no `anime_progress` entry is created. The flat "all" view only shows `anime_progress` rows where `in_library=true`, so these series are invisible in that view.

### Root Cause
Three flows create `manga_reader_sites` entries with an `anime_id` but never upsert `anime_progress`:
1. **`NewReaderForm.tsx`** — `handleSubmit` inserts reader rows with `anime_id` but no progress upsert
2. **`AddToReaderDropdown.tsx`** — `handleConfirm` inserts a reader row but no progress upsert
3. **`LibraryGroupedView.tsx`** — `saveReaderEdit` can add new series assignments without creating progress entries

(`NewSeriesForm.tsx` already does this correctly.)

### Fix
In each of the three files, after successfully inserting/updating `manga_reader_sites` rows with an `anime_id`, upsert `anime_progress` for each assigned anime:

```typescript
await supabase
  .from('anime_progress')
  .upsert(
    { user_id: userId, anime_id: animeId, in_library: true, updated_at: new Date().toISOString() },
    { onConflict: 'user_id,anime_id' }
  );
```

### File Changes

| File | Change |
|------|--------|
| `src/components/library/NewReaderForm.tsx` | After successful insert (~line 99), loop through `validAssignments` and upsert `anime_progress` for each `animeId` |
| `src/components/AddToReaderDropdown.tsx` | After successful insert (~line 77), upsert `anime_progress` for the `animeId` prop |
| `src/components/library/LibraryGroupedView.tsx` | In `saveReaderEdit` (~line 199), after all reader rows are saved, upsert `anime_progress` for each `validAssignment.animeId` |

Each upsert uses `onConflict: 'user_id,anime_id'` so it's safe if the progress row already exists — it just ensures `in_library` is true.

