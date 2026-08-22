-- AFG joins the scheduled primary tier (it's the chapter-anchor authority —
-- Sean 2026-08-23). Daily tick, 13-day staleness window inside the function:
-- pages cycle ~biweekly, matching AFG's slow editorial pace, and most runs
-- no-op. Wikipedia stays event-driven (the volumes-staleness flag in
-- syncAnchors is the trigger).

select cron.schedule('refresh-afg-daily', '20 9 * * *',
  $$select public.invoke_edge_refresh('refresh-afg')$$);
