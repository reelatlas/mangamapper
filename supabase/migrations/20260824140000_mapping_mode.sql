-- Loose-adaptation state (Sean 2026-08-24, research-tier verdicts): some
-- anime relate to their manga as parallel tellings, not chapter adaptations
-- (Outlaw Star's anime finished before the manga; Sgt. Frog cherry-picks
-- stories non-linearly across 358 eps). 'loose' renders an honest "loose
-- adaptation" state instead of eternal mapping_pending.
alter table series add column if not exists mapping_mode text not null default 'chapter'
  check (mapping_mode in ('chapter', 'loose'));
