-- Berserk scope curation (research 2026-08-23, berserk.fandom.com cited in
-- docs/franchise-rulings.md). Numbering caveat: the manga's 16
-- pre-serialization chapters are numbered 0-1..0-16 (Golden Age begins at
-- 0-9); integer columns can't hold those, so Memorial's start_chapter is
-- null with the start captured by start_volume 4 (its true start is ch 0-11,
-- skipping Guts' birth chapters). MU/wiki regular numbering thereafter.

insert into public.series_scopes (afl_slug, start_volume, start_chapter, end_volume, end_chapter, note) values
  ('berserk-golden-age-arc-memorial-edition', 4, null, 13, 91,
   'Golden Age recut: ch 0-11 through 91 (arc''s eps 92-94 not adapted; Wyald subplot vols 11-12 omitted)'),
  ('berserk-2016', 14, 95, 29, 249,
   'Conviction arc (Lost Children skipped) into mid-Millennium Falcon; ends ch 249 (vol 29). Ch 83 is the excluded "lost episode".')
on conflict (afl_slug) do nothing;
