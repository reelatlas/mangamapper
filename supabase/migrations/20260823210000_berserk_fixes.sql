-- Fix 2026-08-23: the prior anchor migration referenced the Memorial's AFL
-- slug instead of its canonical id ("the-" prefix) — the FK miss atomically
-- aborted all five rows. Re-insert against verified canonical ids, and add
-- the 1997 series' scope (it shares manga 30002 but AniList carries no
-- sequel edge between the Berserk entries, so the discovery guard couldn't
-- flag it — relations there are 'alternative'-shaped, a franchise-IA note).

insert into public.chapter_anchors (series_id, episode, volume, chapter, source, note) values
  ('berserk-2016', 1, 14, 96, 'wiki', 'Conviction arc opening (ch 95-96)'),
  ('berserk-2016', 12, 21, 176, 'wiki', 'season 1 finale — Conviction arc end'),
  ('berserk-2016', 13, 22, 177, 'wiki', 'season 2 opening — Millennium Falcon arc'),
  ('berserk-2016', 24, 29, 249, 'wiki', 'series finale (ch 244-249, Vritannis)'),
  ('berserk-the-golden-age-arc-memorial-edition', 13, 13, 91, 'wiki', 'recut endpoint — Golden Age through ch 91')
on conflict (series_id, episode) do nothing;

insert into public.series_scopes (afl_slug, start_volume, start_chapter, end_volume, end_chapter, note) values
  ('berserk', null, null, 14, 94, '1997 series: Black Swordsman intro then the full Golden Age arc through the Eclipse (arc = ch 0-9..94, vols 3-14)')
on conflict (afl_slug) do nothing;
