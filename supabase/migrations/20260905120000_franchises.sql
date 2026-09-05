-- I43 — THE FRANCHISE UMBRELLA (Sean's go 2026-09-05; the design is
-- scripts/ingest/research/discovery/PROPOSAL.md §2). The top of the
-- hierarchy: the IP that groups canonical series for IA (a browse page can
-- list by franchise; a series page can say "part of Naruto") and for
-- discovery (a candidate is proposed into the IP its owner belongs to). It is
-- NEVER a merge: I15 / I16 boundaries stand, and a franchise carries no
-- chapter number, no standing, no totals and no lock. Membership is a RULING
-- (lib/rulings/franchises.ts, mirrored by assert-overrides#assertFranchises —
-- the permanence pattern); NULL franchise_id = a franchise of one.
create table public.franchises (
  id text primary key,                 -- OUR slug (I1): naruto, dragon-ball, fate
  title text not null,
  title_native text,
  note text,
  base_series_id text references public.series (id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.series add column if not exists franchise_id text references public.franchises (id) on delete set null;
create index if not exists series_franchise_idx on public.series (franchise_id) where franchise_id is not null;
alter table public.franchises enable row level security;
create policy "public read franchises" on public.franchises for select using (true);
