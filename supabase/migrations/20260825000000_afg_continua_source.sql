-- 'afg-continua' joins the anchor source vocabulary: AFG's continua-manga
-- table ("Where does the anime end? / Where should I start reading?") is a
-- structured end-frontier source present on EVERY AFG page — including
-- chartless all-canon shows (Sean's full-source ruling 2026-08-23). Distinct
-- from 'afg' (chart-derived) so chart re-syncs never wipe continua anchors.
alter table public.chapter_anchors drop constraint chapter_anchors_source_check;
alter table public.chapter_anchors add constraint chapter_anchors_source_check
  check (source in ('afg', 'manual', 'wiki', 'mu', 'afg-continua'));
