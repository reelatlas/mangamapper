-- Asterisk model (Sean's ruling 2026-08-23): non-linear adaptation facts
-- (divergence, partial/rearranged finales, grafted scenes, side stories,
-- abridgment) become first-class per-episode annotations — the UI renders
-- an asterisk wherever a row exists; representation is a later design
-- decision, the DATA lands now. This is also agenda item 19b's data model
-- (Kenshin 95-98 pilot one-shots = kind 'side_story').
create table public.episode_annotations (
  series_id text not null references public.series (id) on delete cascade,
  episode integer not null,
  kind text not null check (kind in ('divergence','partial','graft','rearranged','side_story','loose_parallel','abridged')),
  chapters text,      -- the manga content involved, when known ("ch 34 scene", "pilot one-shots")
  note text,          -- prose + citations
  created_at timestamptz not null default now(),
  primary key (series_id, episode, kind)
);
alter table public.episode_annotations enable row level security;
create policy "public read episode_annotations" on public.episode_annotations for select using (true);

-- The three-numbers model (research finding 2026-08-23: finales are often
-- non-linear, so frontier / max-adapted / continue-from are DIFFERENT):
-- continue_from_chapter = where to actually resume reading (AFG continua
-- parses this explicitly; research overrides); max_adapted_chapter = the
-- highest chapter the anime touches when it differs from the frontier
-- (Kowloon reaches ch 82 in ep 11 while its finale sits on ch 79).
alter table public.series add column continue_from_chapter integer;
alter table public.series add column max_adapted_chapter integer;
