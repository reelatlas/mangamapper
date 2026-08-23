-- Asterisk review status (Sean's structure ruling 2026-08-23): the per-
-- episode annotations are the single source of truth for WHAT an asterisk
-- entails (kinds derive by aggregation — no duplicated series-level list to
-- drift). This column tracks the WORKFLOW: null = series has no
-- annotations; 'pending' = annotations exist, awaiting Sean's sign-off in
-- the asterisk UI pass; 'approved' = Sean signed off. Writers set
-- 'pending' on annotation writes; the ui-truth audit heals and reports.
alter table public.series add column asterisk_review text
  check (asterisk_review in ('pending', 'approved'));
