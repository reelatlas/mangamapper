

## Problem

When unlinking a removed reader in `NewSeriesForm.handleSubmit`, the update `{ anime_id: null, series_url: null }` does NOT include `updated_at`. The database auto-sets `updated_at = now()` on this record. Since the unlink call runs AFTER the kept reader updates (sequential `for` loop), the unlinked reader ends up with the newest `updated_at` timestamp.

In the grouped view, `latestUpdatedAt` for each reader group is computed from ALL entries (line 100), including those with `anime_id: null`. So the unlinked reader's fresh timestamp makes its group sort to the top.

## Fix

**File: `src/components/library/NewSeriesForm.tsx`** -- line 262

Add an explicit `updated_at` to the unlink update, set to a value slightly in the past (e.g., 2 seconds before `now()`), so the unlinked reader's timestamp is older than the kept readers' timestamps.

Change:
```ts
.update({ anime_id: null, series_url: null })
```
To:
```ts
.update({ anime_id: null, series_url: null, updated_at: new Date(Date.now() - 2000).toISOString() })
```

This ensures the unlinked reader group doesn't jump to the top of the date-sorted list.

