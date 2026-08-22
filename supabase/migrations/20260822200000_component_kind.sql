-- Sean's ruling 2026-08-22: in-flow movies/OVAs belong INSIDE their series as
-- clearly-classified components (Initial D Third Stage, HxH 1999 Greed Island
-- OVAs). kind powers the UI tag/section header that keeps the separation clear.

alter table public.series_components
  add column kind text not null default 'season'
    check (kind in ('season', 'movie', 'ova', 'special'));
