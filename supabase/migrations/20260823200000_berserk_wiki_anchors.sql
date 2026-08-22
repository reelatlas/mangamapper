-- Curated wiki anchors for Berserk (berserk.fandom.com research 2026-08-23,
-- cited in the series_scopes notes + franchise-rulings.md). AFG has no
-- conversion table for Berserk; these sparse anchors give the interpolation
-- math real endpoints (source 'wiki' = curated from a cited one-off source,
-- the cross-check-tier pattern for big IPs).

insert into public.chapter_anchors (series_id, episode, volume, chapter, source, note) values
  -- 2016 series: ep 1 = ch 95-96 (Conviction opening), S1 finale ep 12 ends
  -- ch 176, S2 opens ch 177, finale ep 24 covers ch 244-249
  ('berserk-2016', 1, 14, 96, 'wiki', 'Conviction arc opening (ch 95-96)'),
  ('berserk-2016', 12, 21, 176, 'wiki', 'season 1 finale — Conviction arc end'),
  ('berserk-2016', 13, 22, 177, 'wiki', 'season 2 opening — Millennium Falcon arc'),
  ('berserk-2016', 24, 29, 249, 'wiki', 'series finale (ch 244-249, Vritannis)'),
  -- Memorial Edition: recut ends at ch 91 (arc eps 92-94 not adapted)
  ('berserk-the-golden-age-arc-memorial-edition', 13, 13, 91, 'wiki', 'recut endpoint — Golden Age through ch 91')
on conflict (series_id, episode) do nothing;
