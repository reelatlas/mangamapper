-- Canonical identity decouples from AFL's slugs (2026-08-22: AFL's Drupal
-- alias corruption proved external slugs unstable — /shows/digimon-adventure-02
-- serves Code Geass: Akito, BLUE LOCK lives at blue-lock-0). series.id becomes
-- OUR slug (from the resolved title); afl_slug records where the data came from.

alter table public.series add column afl_slug text unique;
