-- Franchise structure (Sean's rulings 2026-08-22, docs/data-pipeline.md):
-- dispositions make exclusions/duplicates durable data; series_components
-- records which AniList entries compose each series (with episode ranges for
-- future per-season markers); series_relations keeps the full relation
-- vocabulary between canonical series for future linking/recommendations.

alter table public.source_map
  add column disposition text not null default 'active'
    check (disposition in ('active', 'excluded', 'duplicate', 'merged', 'stitch_pending'));

-- One row per AniList entry inside a canonical series. Single-season series
-- get exactly one row, so the model is uniform. afl_offset supports merged
-- AFL pages (each page restarts numbering at 1) — 0 until a merge needs it.
create table public.series_components (
  series_id text not null references public.series (id) on delete cascade,
  anilist_id integer not null,
  season_order integer not null,
  episode_start integer,          -- in the series' continuous numbering
  episode_end integer,
  label text,                     -- e.g. the season's own title
  afl_slug text,
  afl_offset integer not null default 0,
  primary key (series_id, anilist_id)
);

-- Relations between canonical series, kind kept verbatim from AniList
-- (sequel, prequel, side_story, spin_off, alternative, ...; remakes like
-- DB Kai are 'alternative' — distinct entries per Sean's ruling).
create table public.series_relations (
  from_series text not null references public.series (id) on delete cascade,
  to_series text not null references public.series (id) on delete cascade,
  kind text not null,
  primary key (from_series, to_series, kind)
);

alter table public.series_components enable row level security;
alter table public.series_relations enable row level security;
create policy "public read series_components" on public.series_components for select using (true);
create policy "public read series_relations" on public.series_relations for select using (true);
