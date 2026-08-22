-- Volume boundaries from Wikipedia chapter lists (data-pipeline.md §1:
-- publisher-derived, static once printed → one-time ingest per manga).
-- Keyed by MANGA (AniList manga id): Naruto and Shippuden share one set.
-- Manga-scoped sources carry per-row provenance here rather than entries in
-- the series-keyed identity registry (documented nuance in §11 checklist).

create table public.ingest_wikipedia_chapters (
  page_title text primary key,
  manga_anilist_id integer not null,
  raw_wikitext text not null,       -- keep the SOURCE (AFG re-fetch lesson)
  content_hash text not null,
  fetched_at timestamptz not null default now(),
  changed_at timestamptz not null default now()
);
alter table public.ingest_wikipedia_chapters enable row level security;

create table public.volume_boundaries (
  manga_anilist_id integer not null,
  volume integer not null,
  chapter_start numeric not null,
  chapter_end numeric,              -- null = open (the ongoing final volume)
  source text not null default 'wikipedia',
  source_page text,                 -- provenance: which page produced this row
  created_at timestamptz not null default now(),
  primary key (manga_anilist_id, volume)
);
alter table public.volume_boundaries enable row level security;
create policy "public read volume_boundaries" on public.volume_boundaries for select using (true);
