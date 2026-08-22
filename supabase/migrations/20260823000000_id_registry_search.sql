-- Identity registry (Sean's ruling 2026-08-22): OUR series.id is the one
-- canonical identity; every external source maps INTO it here. The primary
-- key makes it structurally impossible for two series to claim one external
-- id, and the unique constraint keeps one id per source per series. New data
-- sources MUST register their mapping before writing any data.

create table public.series_external_ids (
  series_id text not null references public.series (id) on delete cascade,
  source text not null,      -- anilist | mal | afl | afg | mangaupdates | mangadex | ...
  external_id text not null,
  created_at timestamptz not null default now(),
  primary key (source, external_id),
  unique (series_id, source)
);

alter table public.series_external_ids enable row level security;
create policy "public read series_external_ids" on public.series_external_ids for select using (true);

-- Search across every name a series answers to (english/romaji/native titles
-- + AniList synonyms). Maintained by the resolver/stitcher on every write
-- (array_to_string is only STABLE, so no generated column).
alter table public.series add column search_text text not null default '';
