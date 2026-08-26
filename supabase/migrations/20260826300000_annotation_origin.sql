-- Annotation provenance (batch 18 wave 2, 2026-08-26): a ruling-written
-- annotation (from lib/rulings/standing-annotations.ts, asserted by
-- assert-overrides.ts) must be reconcilable — when the map stops naming a
-- row, the stored row is stale. Research-written rows (batch applies) are
-- not the map's to delete. `origin` says which writer owns the row; the
-- healer stamps 'ruling' on every row it upserts and removes 'ruling' rows
-- the map no longer names. Backfill: the T4.3 A-7 spread and the three
-- override kinds were only ever written by the map.
alter table public.episode_annotations add column if not exists origin text not null default 'research'
  check (origin in ('ruling', 'research'));
update public.episode_annotations set origin = 'ruling'
  where kind in ('adopted', 'side_source', 'retconned')
     or note like 'A-7 studio-ending class%';
