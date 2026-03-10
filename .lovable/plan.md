

## Increase speed_up multiplier from 1.05x to 1.15x

**File**: `src/pages/AuthConfirm.tsx`

Single change in the `speedUp` callback: replace `prev * 1.05` with `prev * 1.15`.

The recursive `setTimeout` pattern already reads `speedMultiplierRef.current` on every tick, so both the block fill rate and the remaining time display will immediately reflect the faster speed — no other changes needed.

