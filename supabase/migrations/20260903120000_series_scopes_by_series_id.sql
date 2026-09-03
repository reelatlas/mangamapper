-- series_scopes keyed by the ENTRY (series.id), not the AFL slug (2026-09-03).
-- The Ranking of Kings side entry (the-treasure-chest-of-courage) owns the
-- manga's part two (vol 13 / ch 156 → open) but has no AFL page, so an
-- afl_slug-keyed table could not hold its scope at all — the Naruto bug with
-- no way to fix it. series_id is the identity every writer already knows
-- (resolveSeries, stitch, scopes-apply); afl_slug stays as a nullable
-- convenience column for the rows that have one.
alter table public.series_scopes add column if not exists series_id text;
update public.series_scopes sc set series_id = s.id from public.series s where s.afl_slug = sc.afl_slug and sc.series_id is null;
alter table public.series_scopes drop constraint if exists series_scopes_pkey;
alter table public.series_scopes alter column afl_slug drop not null;
alter table public.series_scopes alter column series_id set not null;
alter table public.series_scopes add primary key (series_id);
alter table public.series_scopes add constraint series_scopes_series_fk foreign key (series_id) references public.series(id) on delete cascade;
