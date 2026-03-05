

## Plan: Fix dropdown width and focus ring dismissal

### 1. Fix dropdown content width to match trigger

The custom `SelectPrimitive.Content` in `NewSeriesForm.tsx` (line 180) uses `min-w-[8rem]` but the viewport inside uses `min-w-[var(--radix-select-trigger-width)]`. The content container itself has no width constraint, so it can grow wider than the trigger. Add `w-[var(--radix-select-trigger-width)]` to the Content element to lock it to the trigger width.

**`src/components/library/NewSeriesForm.tsx`** line 180: Add `w-[var(--radix-select-trigger-width)]` to the Content className.

### 2. Fix blue ring requiring 2 clicks to dismiss

The `SelectTrigger` has both `focus:ring-2` and `data-[state=open]:ring-2`. When the dropdown closes, the trigger retains browser focus, so `focus:ring-2` keeps the ring visible even after `data-[state=open]` is removed. The fix is to remove the `focus:ring-*` styles and rely solely on `data-[state=open]` for the ring, plus add `focus-visible:ring-2` for keyboard accessibility only.

**`src/components/ui/select.tsx`** line 20: Replace `focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2` with `focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

