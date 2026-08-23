-- Complete the Dragon Ball Z / Kai scope rulings (Sean 2026-08-24: "dbz ends
-- with chapter 519"): the seed rows always said "ch 195-519" in their notes
-- but never set end_chapter, so totals fell through to AniList's 520 COUNT
-- (which includes a bonus chapter). 519 = the consensus final chapter number,
-- matching our wiki anchors' frontier.
update series_scopes set end_volume = 42, end_chapter = 519
  where afl_slug in ('dragon-ball-z', 'dragon-ball-z-kai');
