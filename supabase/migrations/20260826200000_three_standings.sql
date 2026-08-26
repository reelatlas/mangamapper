-- T4.3 (rule T27, Sean's T4.0 D-10/D-12 rulings, 2026-08-26): standing is
-- exactly three values, relative to the series' source. 'anime-only-canon'
-- leaves the canonical vocabulary: AFL's anime_canon class is mapped at
-- write by the series' source kind (lib/rulings/source-kinds.ts
-- aflAnimeCanon; original / video_game → canon, sourced series → filler) and
-- T6 rulings win row by row; the override facts live in episode_annotations
-- (adopted / side_source / retconned, T26). Rows were migrated by the healer
-- (assert-overrides.ts) BEFORE this constraint; staging keeps AFL's claim
-- (G51) and the census class afl_anime_canon_unruled is the review queue.

alter table public.episodes drop constraint if exists episodes_type_check;
alter table public.episodes add constraint episodes_type_check check (type in ('canon', 'mixed', 'filler'));
