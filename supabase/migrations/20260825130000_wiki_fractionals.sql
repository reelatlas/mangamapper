-- Fractional watch-order entries, staged greedily (Sean's ruling
-- 2026-08-23): every non-main entry a source separates fractionally
-- (Ryuusui 35.5, UY's farewell recap 193.5, Dr. Stone's 24.5 special)
-- is NOTED here with its position/title/date — the ask-Sean loop decides
-- which become order-only components; the UI phase decides surfacing.
create table public.ingest_wiki_fractionals (
  series_id text not null references public.series (id) on delete cascade,
  position numeric not null,
  title text,
  air_date date,
  note text,
  fetched_at timestamptz not null default now(),
  primary key (series_id, position)
);
alter table public.ingest_wiki_fractionals enable row level security;
create policy "public read wiki_fractionals" on public.ingest_wiki_fractionals for select using (true);
