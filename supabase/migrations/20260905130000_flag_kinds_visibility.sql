-- Discovery step 3 (2026-09-05): (1) the ingest_flags kind check widened — it
-- still listed the five original kinds, so the two kinds the code already
-- files (airdate_withheld, source_kind_unknown) could never insert, and the
-- adoption gate's `adoption_held` (I44) joins them; (2) P39 visibility — a
-- series is PUBLIC only when its episode types come from a classifier (an
-- AFL / AFG registration) or a PUBLISHED ruling; a seeded series is STAGED:
-- reachable by id, absent from list and search, until then. Derived by
-- lib/rulings/visibility.ts#deriveVisibility, mirrored by assert-overrides.
alter table public.ingest_flags drop constraint if exists ingest_flags_kind_check;
alter table public.ingest_flags add constraint ingest_flags_kind_check
  check (kind in ('parse_integrity', 'taxonomy_conflict', 'match_ambiguous', 'count_mismatch', 'large_diff', 'airdate_withheld', 'source_kind_unknown', 'adoption_held'));
alter table public.series add column if not exists visibility text not null default 'public'
  check (visibility in ('public', 'staged'));
create index if not exists series_visibility_idx on public.series (visibility) where visibility <> 'public';
