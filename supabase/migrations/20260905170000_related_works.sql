-- I45 — THE RELATED-WORKS LEDGER (Sean 2026-09-05; the extras sitting of the
-- discovery build). watch_order_entries is the ledger of every related work
-- of a series — recaps, compilations, specials, OVAs, films — whether or not
-- it counts (N4: only counted extras keep a component) and whether or not it
-- surfaces (N31: display_label alone puts a row on the series page). Each
-- row now carries its IDENTITY (anilist_id), the relation that reached it,
-- its ORIGIN (which writer minted it — G57: a writer deletes only its own),
-- and its STANDING in the episode vocabulary (canon | mixed | filler — never
-- a third axis; recaps and originals are filler by rule, a same-instrument
-- extra is ruled or researched).
alter table public.watch_order_entries add column if not exists anilist_id integer;
alter table public.watch_order_entries add column if not exists relation text;
alter table public.watch_order_entries add column if not exists origin text not null default 'wiki'
  check (origin in ('wiki', 'ruling', 'halo'));
alter table public.watch_order_entries add column if not exists standing text
  check (standing is null or standing in ('canon', 'mixed', 'filler'));
create unique index if not exists watch_order_entries_anilist_idx on public.watch_order_entries (series_id, anilist_id) where anilist_id is not null;
