-- Provenance backfill, second pass (2026-08-26): every T4.3 A-7 spread note
-- begins with 'A-7 ' (the studio-ending class AND world-trigger 48's
-- 'A-7 studio-original breather'); the first backfill matched only the
-- '...studio-ending class' form and left one map-written row unowned.
update public.episode_annotations set origin = 'ruling' where note like 'A-7 %';
