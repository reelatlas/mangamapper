-- Row provenance, step 3 of 3 (G57): after the backfill inferred every row's
-- minter from the writers' reach (scripts/ingest/minted-by-backfill.ts printed
-- 0 nulls), the column becomes NOT NULL — every writer stamps it on insert
-- (lib/minted.ts#syncMintedRows; afg-extend / the wiki backfill stamp their
-- fills), so no row can ever again be nobody's. Still no default: a writer
-- that forgets to stamp fails loudly instead of claiming AFL's ownership.
alter table public.episodes alter column minted_by set not null;
