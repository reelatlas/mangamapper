-- Greedy staging (Sean 2026-08-24): AFG pages keep their full HTML so the
-- between-season reading guidance prose ("read ch 136-143 before starting
-- :re") is available for the IA/arc phase without re-scraping.
alter table ingest_afg_pages add column if not exists raw_html text;
