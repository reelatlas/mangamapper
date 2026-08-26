-- T4.1 (rule T25, Sean's T4.0 D-9/D-12 rulings, 2026-08-26): source is series
-- identity. source_type becomes NULLABLE with NO default (an unregistered
-- AniList source fails closed → null + flag, never 'manga'), constrained to
-- the SOURCE_KINDS registry values (scripts/ingest/lib/rulings/source-kinds.ts
-- is canonical; this list mirrors it). manga_status 'anime_only' → 'none'.
-- Row values are migrated by the healer (heal-source-kinds.ts), which
-- re-derives from staging — not by SQL — so the mechanism is the migration.

alter table public.series alter column source_type drop not null;
alter table public.series alter column source_type drop default;
alter table public.series drop constraint if exists series_source_type_check;
alter table public.series add constraint series_source_type_check check (
  source_type is null or source_type in (
    'manga', 'manhwa', 'manhua', 'webtoon', 'doujinshi',
    'light_novel', 'web_novel', 'novel',
    'visual_novel', 'video_game', 'original', 'other'
  )
);

alter table public.series drop constraint if exists series_manga_status_check;
update public.series set manga_status = 'none' where manga_status = 'anime_only';
alter table public.series add constraint series_manga_status_check check (
  manga_status in ('publishing', 'finished', 'hiatus', 'none')
);
