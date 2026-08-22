-- Source-scope enforcement (DESIGN_SYSTEM §6 rule + Sean 2026-08-23): a
-- series entry adapts a RANGE of the source manga, never the franchise.
-- Curated scope rows (keyed by afl_slug — survives canonical rebuilds) are
-- applied by the resolver/stitcher and the scopes applier: totals become the
-- scope's END, start floors mark where a successor picks up. Series absent
-- here span their manga's full run (the common case).

create table public.series_scopes (
  afl_slug text primary key,
  start_volume integer,
  start_chapter integer,
  end_volume integer,
  end_chapter integer,
  note text,
  updated_at timestamptz not null default now()
);
alter table public.series_scopes enable row level security;

insert into public.series_scopes (afl_slug, start_volume, start_chapter, end_volume, end_chapter, note) values
  ('naruto', null, null, 27, 244, 'Part I; Shippuden continues at vol 28 / ch 245'),
  ('naruto-shippuden', 28, 245, null, null, 'Part II through the manga end (vol 72 / ch 700)'),
  ('bleach', null, null, 54, 479, 'original run through the Fullbring arc; TYBW continues at ch 480'),
  ('bleach-thousand-year-blood-war', 55, 480, null, null, 'final arc (ch 480-686), per the design-system source-scope example'),
  ('dragon-ball', null, null, 16, 194, 'original series scope; Z continues at ch 195'),
  ('dragon-ball-z', 17, 195, null, null, 'Z scope (ch 195-519)'),
  ('dragon-ball-z-kai', 17, 195, null, null, 'Kai retells Z — same scope (ch 195-519)');
