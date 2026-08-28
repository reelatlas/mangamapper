-- I40 / T30 / A46 — parallel tellings (Sean 2026-08-28; built as one /add-rule
-- motion). `series.source_relation` says HOW the anime relates to its linked
-- source work: 'adaptation' (the default world — the anime adapts the work)
-- or 'parallel' (two official realizations of one unpublished outline —
-- dragon-ball-super is the first witness; AniList's edge is ALTERNATIVE and
-- correct). NULL when the series has no source (a studio original). Derived
-- by the resolver / heal-source-kinds from lib/rulings/source-relations.ts.
alter table public.series add column if not exists source_relation text
  check (source_relation is null or source_relation in ('adaptation', 'parallel'));

-- series_arcs — the arc-grain correspondence (A46). Ruled rows (origin
-- 'ruling', mirrored from lib/rulings/arcs.ts by assert-overrides). A
-- `shared` arc has both ranges; `anime_only` (studio padding, timeline D)
-- and `side_source` (another licensed work, named in note) have episodes
-- only; `manga_only` has chapters only (ch_end NULL = open to the frontier).
create table if not exists public.series_arcs (
  series_id text not null references public.series (id) on delete cascade,
  ordinal integer not null,
  label text not null,
  kind text not null check (kind in ('shared', 'anime_only', 'manga_only', 'side_source')),
  ep_start integer,
  ep_end integer,
  ch_start numeric,
  ch_end numeric,
  note text,
  origin text not null default 'ruling' check (origin in ('ruling', 'research')),
  created_at timestamptz not null default now(),
  primary key (series_id, ordinal),
  check (kind <> 'manga_only' or (ep_start is null and ep_end is null and ch_start is not null)),
  check (kind not in ('anime_only', 'side_source') or (ep_start is not null and ep_end is not null and ch_start is null and ch_end is null)),
  check (kind <> 'shared' or (ep_start is not null and ep_end is not null and ch_start is not null)),
  check (ep_end is null or ep_start is null or ep_end >= ep_start),
  check (ch_end is null or ch_start is null or ch_end >= ch_start)
);
alter table public.series_arcs enable row level security;
create policy "public read series_arcs" on public.series_arcs for select using (true);

-- episode_correspondence — the row-grain correspondence (A46): how one
-- episode and one chapter range sit on the outline. `aligned` (timeline C:
-- same story, lines up) and `divergent` (same outline node, told differently)
-- need both sides; `anime_only` (timeline B: the anime's own telling of a
-- shared arc, no manga pages) is episode-only; `manga_only` (timeline A: the
-- manga's own telling / no anime) is chapter-only. One episode may carry
-- several rows (ep ↔ 100-110 aligned, ↔ 111-120 divergent). Both focused
-- views (watching / reading) are projections of this table; nothing is
-- stored twice. Anchors never stand on a parallel series (A46).
create table if not exists public.episode_correspondence (
  id bigserial primary key,
  series_id text not null references public.series (id) on delete cascade,
  episode integer,
  ch_start numeric,
  ch_end numeric,
  alignment text not null check (alignment in ('aligned', 'divergent', 'anime_only', 'manga_only')),
  note text,
  origin text not null default 'research' check (origin in ('ruling', 'research')),
  created_at timestamptz not null default now(),
  check (alignment not in ('aligned', 'divergent') or (episode is not null and ch_start is not null and ch_end is not null)),
  check (alignment <> 'anime_only' or (episode is not null and ch_start is null and ch_end is null)),
  check (alignment <> 'manga_only' or (episode is null and ch_start is not null and ch_end is not null)),
  check (ch_end is null or ch_start is null or ch_end >= ch_start)
);
create unique index if not exists episode_correspondence_key
  on public.episode_correspondence (series_id, coalesce(episode, 0), coalesce(ch_start, 0), coalesce(ch_end, 0), alignment);
create index if not exists episode_correspondence_series_episode on public.episode_correspondence (series_id, episode);
alter table public.episode_correspondence enable row level security;
create policy "public read episode_correspondence" on public.episode_correspondence for select using (true);
