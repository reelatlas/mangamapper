---
name: consolidate
description: mangaMapper consolidation pass — verify every rule is enforced through the data logic, clean stale logic, sync all pull/freshness/cross-check mechanisms to current thinking, rescan data, and cut a committed save point. Run after any significant rules/logic change.
---

# Consolidation pass (Sean's standing directive, systematized)

Work through EVERY step in order. The principle: rules live in shared lib
code consumed identically by scripts and edge functions; rulings are
declarative records; audits verify OUTCOMES so a misbehaving writer
surfaces as data; incomplete inputs degrade gracefully, never into
garbage; nothing is presented to Sean unresearched.

## 1. Writer-consistency sweep
Grep every write site and confirm it goes through the shared gates:
- `grep -rn "from('episodes')" scripts/ supabase/functions/_src/ | grep -v "select\|delete"` — every insert must pass **filterEpisodeRows** (source-numbering translation → community caps → type overrides).
- `latest_known_chapters:` writers must use **bestLatestKnown** (same-edition band + chapter-floor + status-string fallback).
- `from('chapter_anchors')` writers: AFG chart via **syncAnchors** (chapter-space gate + curated-precedence skip), MU via **applyMuFrontier** (scope parse, chapter-space, airing-pin rule, curated precedence), continua via **applyContinua** (identity guard, sanity band, numbering conversion, precedence, suppressions). Manual/research anchors are the trusted tier.
- Any NEW writer found without gates: wire it through the lib, never inline.

## 2. Lib → edges
If anything under `scripts/ingest/lib/` changed since the last deploy:
`npx tsx scripts/ingest/build-functions.ts` then `npx supabase functions deploy` for ALL FOUR (refresh-afl, refresh-afg, refresh-anilist, refresh-mu). The crons must run the same code as the scripts — always.

## 3. Staging freshness
If a parser changed (lib/afg.ts, lib/wikipedia.ts): restage from stored raw
(`raw_html` re-parse — no refetch) so staging never holds output a current
parse wouldn't produce. AFG: re-parse `ingest_afg_pages.raw_html` into
`raw` (episodes + continua) with content_hash update.

## 4. Healer rescans (all idempotent)
- `npx tsx --env-file=.env.ingest scripts/ingest/afg-continua-apply.ts`
- `npx tsx --env-file=.env.ingest scripts/ingest/audit-manga-coverage.ts`
- `npx tsx --env-file=.env.ingest scripts/ingest/cleanup-flags.ts`
- If numbering/type rulings changed: re-run `resolveSeries` for affected series (stale-zone healing removes stranded rows).

## 5. Full census + verification
`npx tsx --env-file=.env.ingest scripts/ingest/audit-ui-truth.ts`
- **ruling_violation MUST be 0** — anything else means a writer bypassed a gate; fix the writer, never the data alone.
- anchor_nonmonotonic / anchor_beyond_chapter_space: each hit is triaged (real reorder → annotate; junk → gate + delete; ruled → suppression), never left unexplained.
- Compare every class count to the previous census; explain each delta.
- Review-queue classes (special_numbered_unreviewed, fractional_unmodeled, asterisk_unreviewed) are Sean's — list them, RESEARCH each item first (web, 2+ sources, citations), present verdicts with context, never raw numbers.

## 6. Docs + rulings ledger
- Every new rule → `docs/data-pipeline.md` §10 with its enforcement site.
- §11 freshness map current for each source's gates.
- §12 gets a numbered consolidation log entry.
- New rulings from Sean land as declarative records (lib constants like COMMUNITY_COUNT_OVERRIDES / EPISODE_TYPE_OVERRIDES / SOURCE_NUMBERING_SHIFTS / CONTINUA_SUPPRESSED, or apply-research-batch-N.ts scripts) — reasoning + citations in notes, ALWAYS.

## 7. Frontend contract check
- Episode-level display data comes ONLY from the hydrated series (getById); the shallow list item renders identity fields only.
- Incomplete data degrades gracefully (pending / hidden / "48-60+"), never NaN or junk.
- `npx tsc --noEmit -p .` and `npm run build` must pass.

## 8. Save point
- Update the memory file (`mangamapper-data-sources.md`) as a REFRESH POINT: current census, new rules, open queues, next steps.
- Commit with a message that reads as the ruling record; push to main (Vercel deploys from main).
- Report the census delta and any items awaiting Sean.
