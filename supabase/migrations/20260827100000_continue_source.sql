-- Continue provenance (rule C7, the parity-healer gap found closing batch 19
-- wave 2, 2026-08-27): the parity healer converted three JUST-APPLIED curated
-- continues (tokyo-mew-mew 28, eyeshield-21 43, project-arms 43) because
-- nothing on the row said "curated" — only the C1 guard (a value at or below
-- the END) protected a value. `continue_source` says which writer owns the
-- continue: 'manual' (an apply script / a Sean ruling — the healer fills
-- absent metadata only and never overwrites), 'healer' (heal-parity-
-- continues' own C2/C3 derivation — re-derived on every pass), 'source'
-- (afg-continua's parsed continue-from — re-derived by the source).
-- Backfill by the writers' own note shapes: the healer's notes begin
-- 'parity with anime (Sean C2 2026-08-24)' or 'C3 (Sean 2026-08-25):';
-- afg-continua rows are the parse; every other stored continue was written
-- by a batch apply (batch 15's carry no note) or a ruling → manual.
alter table public.chapter_anchors add column if not exists continue_source text
  check (continue_source in ('manual', 'healer', 'source'));
update public.chapter_anchors set continue_source = 'healer'
  where continue_chapter is not null and continue_source is null
    and (continue_note like 'parity with anime (Sean C2%' or continue_note like 'C3 (Sean 2026-08-25):%');
update public.chapter_anchors set continue_source = 'source'
  where continue_chapter is not null and continue_source is null and source = 'afg-continua';
update public.chapter_anchors set continue_source = 'manual'
  where continue_chapter is not null and continue_source is null;
