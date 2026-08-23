-- Episode START chapter (Sean's ruling 2026-08-23): the first chapter an
-- episode animates is REAL SOURCE DATA — AFG chart rows list every chapter a
-- row adapts, and ingest was keeping only the max (the end). Derived writers
-- now store the row's first mainline chapter here; research anchors populate
-- it when a span is named. Where null, display falls back to the derivation
-- min(end(ep), end(prevCanon)+1). The `chapter` column remains the
-- end-position instrument.
alter table chapter_anchors add column if not exists start_chapter numeric;
