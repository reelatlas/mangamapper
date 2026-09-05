-- G60 — AniList rankings are a READER (Sean's go 2026-09-05, discovery go-list
-- step 4; PROPOSAL.md §3). Greedy STAGING (G51) of the ranked lists the
-- discovery engines read — airing / upcoming, popularity, trending, manga-first
-- — one snapshot per list per day it runs, kept as history so a title CLIMBING
-- is itself a signal. Never canonical: a rank is the sort key of a queue
-- (seed_candidate), never standing, never a mint, never authority (R4).
create table public.ingest_anilist_rankings (
  list text not null,                      -- lib/rankings.ts#LISTS name
  snapshot date not null,
  rank integer not null,                   -- 1-based position in the list that day
  anilist_id integer not null,
  raw jsonb not null,                      -- the full media payload as fetched
  fetched_at timestamptz not null default now(),
  primary key (list, snapshot, anilist_id)
);
create index ingest_anilist_rankings_latest_idx on public.ingest_anilist_rankings (list, snapshot desc, rank);
alter table public.ingest_anilist_rankings enable row level security;  -- service-role only

-- the fifth bundle, weekly: rankings snapshot + the halo staging, budgeted (G58)
select cron.schedule('refresh-discovery-weekly', '30 10 * * 0',
  $$select public.invoke_edge_refresh('refresh-discovery')$$);
