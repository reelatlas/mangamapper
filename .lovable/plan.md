

## Problem

When unlinking a reader association in `NewSeriesForm.handleSubmit`, the update `{ anime_id: null, series_url: null }` bumps `updated_at` on that `manga_reader_sites` row. The reader groups that **kept** the series may not get their `updated_at` refreshed (if no data changed). So the unlinked reader group appears at the top of the "last_updated" sort.

## Fix

**File: `src/components/library/NewSeriesForm.tsx`** -- `handleSubmit` function

After processing all valid assignments and unlinking removed ones, explicitly touch the `updated_at` on the kept reader assignments so they sort above the unlinked one:

For each valid assignment that was saved (both updated existing and newly inserted), set `updated_at` to now. The simplest approach: in the existing update/insert calls for valid assignments (lines 222-249), add `updated_at: new Date().toISOString()` to both the `update` and `insert` payloads. This ensures the kept readers' timestamps are at least as recent as the unlinked one.

### Changes

1. **Line ~224-229** (existing reader update): Add `updated_at: new Date().toISOString()` to the update payload
2. **Line ~238-243** (new reader insert): Add `updated_at: new Date().toISOString()` to the insert payload

This way the two kept readers get a fresh timestamp, sorting them above the unlinked reader whose `updated_at` was set moments earlier.

