-- MangaUpdates staging (cross-check tier, data-pipeline.md §1): fills the one
-- gap AniList cannot — the latest published chapter of an ONGOING manga (the
-- position-row denominator). Manga-scoped like volume_boundaries: identity
-- lives here (mu id verified via the MangaDex bridge), not in the series
-- registry. Refresh is event/manual, never scheduled (validation-tier ruling).

create table public.ingest_mangaupdates (
  manga_anilist_id integer primary key,
  mu_series_id bigint not null,
  mu_slug text,
  mangadex_uuid text,
  raw jsonb not null,
  content_hash text not null,
  fetched_at timestamptz not null default now(),
  changed_at timestamptz not null default now()
);
alter table public.ingest_mangaupdates enable row level security;

-- "latest known published chapter" — the denominator for ongoing manga where
-- total_chapters is null. Semantically LATEST, not TOTAL.
alter table public.series add column latest_known_chapters integer;
