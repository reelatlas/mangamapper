-- Fractional/non-main entries are labeled by MANY sources, not just
-- Wikipedia (Sean 2026-08-23) — generalize the staging: rename +
-- source column so every source's separators land in one queryable place.
alter table public.ingest_wiki_fractionals rename to ingest_fractionals;
alter table public.ingest_fractionals add column source text not null default 'wikipedia';
