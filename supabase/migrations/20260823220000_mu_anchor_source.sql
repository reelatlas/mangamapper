-- 'mu' joins the anchor source vocabulary: MangaUpdates' human-curated
-- per-series anime-coverage field ("Vol 112, Chap 1138 as of EP 1168") is the
-- adaptation FRONTIER for series AFG doesn't anchor — the general rule that
-- retires mapping_pending for airing series (audit 2026-08-23).
alter table public.chapter_anchors drop constraint chapter_anchors_source_check;
alter table public.chapter_anchors add constraint chapter_anchors_source_check
  check (source in ('afg', 'manual', 'wiki', 'mu'));
