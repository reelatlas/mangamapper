-- MU joins the scheduled tier (Sean 2026-08-24): it supplies frontier
-- anchors (~140 series) and the latest_known denominator for every
-- publishing manga — weekly-release data that goes stale on a wall clock.
-- Daily tick at 09:50 UTC (after AFG's 09:20); the 7-day staleness window
-- inside the function cycles each staged manga ~weekly, ≤15 per run.
-- Event triggers remain: mu-backfill runs on new-series ingestion.

select cron.schedule('refresh-mu-daily', '50 9 * * *',
  $$select public.invoke_edge_refresh('refresh-mu')$$);
