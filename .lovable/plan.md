

## Issues Found

There are two bugs:

### Bug 1: Duplicate reader site records created on save
In `NewSeriesForm.tsx` `handleSubmit` (line 216-230), it always uses `insert` for reader assignments, even when `existingSiteId` is set (populated by `handleAnimeSelect` from existing DB records). This means re-adding a series that already had reader associations creates duplicate entries.

**Fix**: Check `existingSiteId` on each assignment. If present, use `update` instead of `insert`.

### Bug 2: Non-library series shown under reader groups (already partially handled)
Line 363 in `LibraryGroupedView.tsx` filters `seriesEntries` by `progress.some(p => p.anime_id === e.anime_id)`. Since `progress` only contains `in_library: true` entries, this should correctly hide removed series. However, there's a subtle issue: **unassigned reader site entries** (with `anime_id` set but not matching any in-library progress) still exist in `group.entries`, which means they show up in the edit form and affect the reader group's presence. The series cards are correctly filtered, but the data persists as intended.

The display filtering is actually working correctly on line 363. The real problem is the duplicates from Bug 1 -- the user added One Piece twice because the save always inserts.

---

## Plan

### 1. Fix `NewSeriesForm.tsx` `handleSubmit` -- upsert instead of always insert

In the save loop (lines 216-230), change logic to:
- If `assignment.existingSiteId` exists: use `update` on that record
- If no `existingSiteId`: use `insert` as before
- This prevents duplicate reader site records when re-adding a series that was previously removed from library

### 2. No changes needed for grouped view display
Line 363 already filters `seriesEntries` by `progress` (which only has `in_library: true` entries). Once duplicates stop being created, the display will be correct.

