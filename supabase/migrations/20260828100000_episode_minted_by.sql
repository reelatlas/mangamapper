-- Row provenance, step 1 of 3 (rule G57 — "a writer deletes only rows it
-- minted"; Sean 2026-08-28, batch 20 wave 4 deep). Twelve episode writers
-- exist and three of them (resolveSeries, stitch, afg-expansion) DELETED a
-- numeric range and re-inserted their own rows, so a row minted by another
-- writer inside that range died on the next cron pass: yu-gi-oh-5d-s 145
-- (the wiki backfill), dragon-ball-z-kai 139, detective-school-q 19,
-- kenichi 1-50 and hayate 5-23 (stitched blocks) are the witnesses; 5D's was
-- eaten by the crons of 2026-08-28. `minted_by` names the writer that owns
-- the row. NULLABLE here, NO DEFAULT (a default 'afl' would stamp the five
-- witnesses as AFL's for the first cron and they would still die): the
-- backfill script infers each row's minter from the writers' reach, and
-- step 3 makes the column NOT NULL only when no row is null. Not `origin`:
-- episode_annotations.origin (research | ruling) is a different axis.
alter table public.episodes add column if not exists minted_by text
  check (minted_by in ('afl', 'afg', 'wiki', 'stitch', 'anilist', 'manual'));
create index if not exists episodes_minted_by_idx on public.episodes (series_id, minted_by);
