-- P25 permanence tiers (designed 2026-08-23, BUILT 2026-08-26 as the first
-- post-restructure /add-rule). `series.permanence = 'locked'` mirrors the
-- ruling map lib/rulings/permanence.ts (Sean-signed; asserted by
-- assert-overrides.ts) so the app / a future API can show that a series'
-- decisions are permanent. NULL = the active pool.
alter table public.series add column if not exists permanence text
  check (permanence is null or permanence in ('locked'));
