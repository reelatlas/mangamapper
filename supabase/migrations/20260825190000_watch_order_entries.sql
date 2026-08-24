-- Watch-order entries as CANONICAL, app-readable data (Sean 2026-08-24).
-- Order-only specials / OVAs / movies hold fractional POSITIONS in a series'
-- watch order; ingest_fractionals stays the staging/ruling record
-- (service-role only), this table is what the app reads. An entry is
-- SURFACED only when display_label is set — a per-series ruling (MHA's
-- post-finale specials render as "170+1" / "170+1.5"; everything else is
-- data-ready, unsurfaced, until its UI ruling). Full-record fields mirror
-- chapter_anchors so "what does this special adapt" is first-class.
create table public.watch_order_entries (
  series_id text not null references public.series (id) on delete cascade,
  position numeric not null,   -- sorts into the episode flow (171, 171.5, 76.6…)
  title text not null,
  air_date date,
  kind text,                   -- special / ova / movie / recap …
  display_label text,          -- render label when ruled ("170+1"); null = not surfaced yet
  chapter numeric,             -- end-position of what it adapts (431, 431.5)
  volume integer,
  chapters_adapted text,       -- full record, same serialization as chapter_anchors
  note text,
  created_at timestamptz not null default now(),
  primary key (series_id, position)
);
alter table public.watch_order_entries enable row level security;
create policy "public read watch_order_entries" on public.watch_order_entries for select using (true);
