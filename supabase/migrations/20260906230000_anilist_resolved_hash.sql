-- G58 amended 2026-09-06 (the airing writer fix, Sean with Cursor): the daily AniList
-- refresh compared a fresh payload's structural hash with STAGING's hash, so a restage
-- (anilist-restage.ts refetches + stages without resolving) swallowed every change made
-- between a series' last resolve and the restage — one-piece's row read aired 1175 /
-- next 2026-08-30 while its staging already said episode 1177 airs 2026-09-06. The gate
-- now compares with the hash the series was last RESOLVED from: `resolved_hash` is
-- stamped ONLY by the resolvers (lib/resolve.ts#stampResolved) for the media they read,
-- so a restage leaves a resolve debt by construction and the census lists it
-- (anilist_resolve_debt). `resolved_at` orders the queue (never series.updated_at, which
-- the healers bump daily).
alter table public.ingest_anilist_media
  add column if not exists resolved_hash text,
  add column if not exists resolved_at timestamptz;
comment on column public.ingest_anilist_media.resolved_hash is 'G58: the structural hash the owning series was last resolved from — written only by lib/resolve.ts#stampResolved; content_hash ≠ resolved_hash is a resolve debt';
comment on column public.ingest_anilist_media.resolved_at is 'G58: when the owning series was last resolved from this media — the refresh queue''s order key (airing first, then oldest)';
-- baseline (2026-09-06): every staged media is taken as consistent with its series row —
-- the drift a hash cannot see (the restage-swallowed rows) is flushed once by the local
-- catch-up (scripts/ingest/refresh-anilist.ts --all), which resolves every series.
update public.ingest_anilist_media set resolved_hash = content_hash where resolved_hash is null;
