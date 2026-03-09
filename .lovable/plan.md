

## Problem

In `NewSeriesForm.handleSubmit`, the operations execute in this order:
1. Update/insert kept reader assignments (lines 220-251) -- gets timestamp X
2. Unlink removed reader associations (lines 254-264) -- gets timestamp X+later

Since the unlink runs last, the removed reader's `updated_at` is naturally later than the kept readers, making it sort to the top in the grouped view.

## Fix

**File: `src/components/library/NewSeriesForm.tsx`** -- `handleSubmit` function

Reorder the operations: move the "unlink removed readers" block **before** the "update/insert kept readers" block. This way:
1. Unlink removed readers first -- gets timestamp T1
2. Update/insert kept readers after -- gets timestamp T2 (T2 > T1)

The kept readers will always have a later `updated_at` than the unlinked ones, ensuring correct sort order. No timing hacks needed -- just sequential ordering.

### Specific change

Move lines 254-264 (the `removedIds` computation and unlink update) to execute immediately after `progressError` check (after line 216), before the `for...of` loop that processes valid assignments.

