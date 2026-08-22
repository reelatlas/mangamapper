-- Phase 1.5: the data pipeline (docs/data-pipeline.md).
-- Staging is greedy (raw jsonb per source), canonical is deliberate (typed
-- columns the app queries), flags hold anything suspicious for confirmation.

-- ————————————————————————————————— staging (service-role only)

create table public.ingest_afl_shows (
  slug text primary key,
  raw jsonb not null,            -- parsed page: episodes[] + quick_list ranges
  content_hash text not null,
  etag text,
  last_modified text,
  fetched_at timestamptz not null default now(),
  changed_at timestamptz not null default now()
);

create table public.ingest_afg_pages (
  slug text primary key,
  raw jsonb not null,            -- parsed arcs/episodes + chapter equivalents
  content_hash text not null,
  etag text,
  last_modified text,
  fetched_at timestamptz not null default now(),
  changed_at timestamptz not null default now()
);

create table public.ingest_anilist_media (
  anilist_id integer primary key,
  raw jsonb not null,            -- full Media payload (tiers 1-3)
  content_hash text not null,
  fetched_at timestamptz not null default now(),
  changed_at timestamptz not null default now()
);

-- ————————————————————————————————— identity & matching

create table public.source_map (
  afl_slug text primary key,
  anilist_id integer unique,
  mal_id integer,
  afg_slug text,
  match_method text not null check (match_method in ('anifiller_seed', 'exact_title', 'synonym', 'manual')),
  confidence numeric not null default 1 check (confidence >= 0 and confidence <= 1),
  verified boolean not null default false,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ————————————————————————————————— canonical (public read)

create table public.series (
  id text primary key,                        -- AFL slug; the app-facing identity
  anilist_id integer unique,
  mal_id integer,
  title text not null,
  title_english text,
  title_native text,                          -- the jp line
  synonyms text[] not null default '{}',
  cover_url text,
  cover_color text,                           -- AniList dominant hex
  banner_url text,
  format text,                                -- TV / MOVIE / OVA / ONA ...
  status text not null check (status in ('airing', 'finished', 'hiatus', 'upcoming')),
  source_type text not null default 'manga' check (source_type in ('manga', 'webtoon', 'light_novel', 'original')),
  start_date date,
  end_date date,
  season text,
  season_year integer,
  total_episodes integer,                     -- null while airing (AniList semantics)
  aired_episodes integer not null default 0,  -- nextAiringEpisode.episode - 1, or total
  next_airing_at timestamptz,
  duration_min integer,
  average_score integer,                      -- 0-100
  mean_score integer,
  popularity integer not null default 0,
  favourites integer,
  trending integer,
  genres text[] not null default '{}',
  tags jsonb not null default '[]',           -- [{name, rank, isMediaSpoiler}]
  studios text[] not null default '{}',
  is_adult boolean not null default false,
  synopsis_html text,
  external_links jsonb not null default '[]', -- [{site, type, language, url}]
  -- source scope (DESIGN_SYSTEM §6): the range of the source THIS entry adapts
  manga_anilist_id integer,
  manga_status text check (manga_status in ('publishing', 'finished', 'hiatus', 'anime_only')),
  total_volumes integer,
  total_chapters integer,
  manga_start_volume integer,
  manga_start_chapter integer,
  updated_at timestamptz not null default now()
);

create index series_status_idx on public.series (status);
create index series_popularity_idx on public.series (popularity desc);

create table public.episodes (
  series_id text not null references public.series (id) on delete cascade,
  number integer not null,
  title text not null default '',
  type text not null check (type in ('canon', 'mixed', 'filler', 'anime-only-canon')),
  air_date date,
  primary key (series_id, number)
);

create table public.chapter_anchors (
  series_id text not null references public.series (id) on delete cascade,
  episode integer not null,
  volume integer,
  chapter numeric not null,                   -- numeric: chapter 545.5 exists
  source text not null check (source in ('afg', 'manual', 'wiki')),
  note text,
  created_at timestamptz not null default now(),
  primary key (series_id, episode)
);

-- ————————————————————————————————— ops (service-role only)

create table public.ingest_runs (
  id bigint generated always as identity primary key,
  source text not null check (source in ('afl', 'afg', 'anilist', 'resolve')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null default 'running' check (status in ('running', 'ok', 'error')),
  fetched integer not null default 0,
  unchanged integer not null default 0,
  changed integer not null default 0,
  flagged integer not null default 0,
  note text
);

-- The confirm queue: nothing suspicious auto-applies. A flag holds its change
-- (detail carries the proposed data) until Sean confirms or dismisses.
create table public.ingest_flags (
  id bigint generated always as identity primary key,
  run_id bigint references public.ingest_runs (id) on delete set null,
  series_key text not null,                   -- afl slug or anilist id as text
  source text not null,
  kind text not null check (kind in ('parse_integrity', 'taxonomy_conflict', 'match_ambiguous', 'count_mismatch', 'large_diff')),
  detail jsonb not null default '{}',
  status text not null default 'open' check (status in ('open', 'confirmed', 'dismissed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index ingest_flags_open_idx on public.ingest_flags (status) where status = 'open';

-- ————————————————————————————————— RLS

alter table public.ingest_afl_shows enable row level security;
alter table public.ingest_afg_pages enable row level security;
alter table public.ingest_anilist_media enable row level security;
alter table public.source_map enable row level security;
alter table public.ingest_runs enable row level security;
alter table public.ingest_flags enable row level security;
-- no policies on the above: service-role only by construction

alter table public.series enable row level security;
alter table public.episodes enable row level security;
alter table public.chapter_anchors enable row level security;

create policy "public read series" on public.series for select using (true);
create policy "public read episodes" on public.episodes for select using (true);
create policy "public read chapter_anchors" on public.chapter_anchors for select using (true);
