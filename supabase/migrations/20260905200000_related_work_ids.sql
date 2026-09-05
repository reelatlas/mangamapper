-- I46 (amended 2026-09-05, Sean's identity concern): the identity registry for RELATED WORKS — the same rule as
-- series_external_ids (I44): an external id maps INTO our identity (series_id, anilist_id) ONCE; a different work already
-- holding the id is a collision, refused and listed, never overwritten. Identity outlives a row: watch_order_entries is
-- keyed by (series_id, position) and a wiki row can be re-created by its writer — the registry is what puts the AniList
-- id back. Sources: anilist (the identity itself), mal (AniList's idMal, staged), wiki (the fractional row key
-- series@position — the writer's own identity for the row it adopts), and whatever a later source brings.
create table public.related_work_external_ids (
  series_id text not null references public.series (id) on delete cascade,
  anilist_id integer not null,
  source text not null,
  external_id text not null,
  registered_by text not null,   -- halo | adoption | ruling
  created_at timestamptz not null default now(),
  primary key (source, external_id),
  unique (series_id, anilist_id, source)
);
alter table public.related_work_external_ids enable row level security;
create policy "public read related_work_external_ids" on public.related_work_external_ids for select using (true);
