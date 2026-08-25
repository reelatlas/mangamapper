---
name: consolidate
description: mangaMapper consolidation pass — verify every rule is enforced through the data logic, clean stale logic, sync all pull/freshness/cross-check mechanisms to current thinking, rescan data, and cut a committed save point. Run after any significant rules/logic change. Invoke with "deep" to add the full-catalog rescan (step 9).
---

# Consolidation pass (Sean's standing directive, systematized)

Work through EVERY step in order. The principle: rules live in shared lib
code consumed identically by scripts and edge functions; rulings are
declarative records; audits verify OUTCOMES so a misbehaving writer
surfaces as data; incomplete inputs degrade gracefully, never into
garbage; nothing is presented to Sean unresearched.

Two modes:
- **`/consolidate`** — the standard pass: steps 1–8.
- **`/consolidate deep`** — steps 1–8 PLUS step 9 (full-catalog rescan
  against current rules, notes re-validated, stale cleanup). Also run
  deep without being asked when a rule change plausibly invalidates
  prior per-series decisions — say so when doing it. Expect deep to run
  often while the data logic is under active design, and to taper off as
  mangaMapper stabilizes; once the data logic closes, rarely.

## 1. Writer-consistency sweep
Grep every write site and confirm it goes through the shared gates:
- `grep -rn "from('episodes')" scripts/ supabase/functions/_src/ | grep -v "select\|delete"` — every insert must pass **filterEpisodeRows** (source-numbering translation → community caps → type overrides).
- `latest_known_chapters:` writers must use **bestLatestKnown** (same-edition band + chapter-floor + status-string fallback).
- `from('chapter_anchors')` writers: AFG chart via **syncAnchors** (chapter-space gate + curated-precedence skip), MU via **applyMuFrontier** (scope parse, sibling-scope ceiling, chapter-space, airing-pin rule, scope-consumed, A1 episode-type, MU_FRONTIER_SUPPRESSED, pin-episode redundancy, curated precedence — the D1 gate stack, 2026-08-24), continua via **applyContinua** (identity guard, sanity band, numbering conversion, precedence, suppressions). Manual/research anchors are the trusted tier — and REPAIRS to derivation-tier rows must flip the source to manual (the hikaru ep-75 wipe): a repaired value on a mu/afg/afg-continua row is deleted by that source's next re-derive.
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
- `npx tsx --env-file=.env.ingest scripts/ingest/heal-volume-boundaries.ts` — enforces the MONOTONIC-START rule (Sean's Sailor Moon "v3: chs 10-3", 2026-08-24) over stored rows: drops parse artifacts, re-closes neighbours, wipes wholesale-garbage tables. Idempotent; pairs with the `boundaries_degenerate` audit class.
- `npx tsx --env-file=.env.ingest scripts/ingest/research/batch15/apply-parity-continues.ts` — re-stamps ANIME-PARITY continue points (Sean's C2 rule 2026-08-24); idempotent, converts any fresh anchors (new MU run-end pins, new research rows) that arrived without continue metadata.
- If numbering/type rulings changed: re-run `resolveSeries` for affected series (stale-zone healing removes stranded rows).

## 5. Full census + verification
`npx tsx --env-file=.env.ingest scripts/ingest/audit-ui-truth.ts`
- **ruling_violation MUST be 0** — anything else means a writer bypassed a gate; fix the writer, never the data alone.
- anchor_nonmonotonic / anchor_beyond_chapter_space: each hit is triaged (real reorder → annotate; junk → gate + delete; ruled → suppression), never left unexplained.
- anchor_beyond_display_total (Sean's Tokyo Ghoul 144/143 rule, 2026-08-24): any END/START/CONTINUE above the same-edition-band display total is a count-space value in a number-space instrument — convert to the chapter number (applyMuFrontier does this for MU pins at the writer; other sources: fix the value + note the conversion), never leave one standing.
- anchor_on_noncanon_row (A1 outcome check, 2026-08-24): an anchor from ANY source on a filler/anime-only row. Each hit is a triage FORK — junk anchor (delete via research, honest terminal on the last canon/mixed ep) or WRONG ROW TYPE (research anchored it deliberately — retype) — never auto-delete. The MU writer refuses these at the source (D1); extending the gate to AFG writers is Sean's open D4.
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
- `npx tsc -b --noEmit` (0 errors — `-p .` on the solution tsconfig checks NOTHING; the 2026-08-23 allBoundaries regression slipped through a vacuous pass) and `npm run build` must pass. Regenerate `src/integrations/supabase/types.ts` (`npx supabase gen types typescript --project-id ysjnqbnbtftjdepovpkt --schema public`) after any migration so the gate stays real.

## 8. Save point
- Update the memory file (`mangamapper-data-sources.md`) as a REFRESH POINT: current census, new rules, open queues, next steps.
- Commit with a message that reads as the ruling record; push to main (Vercel deploys from main).
- Report the census delta and any items awaiting Sean.

## 9. Deep rescan (only in `deep` mode — see the modes note up top)
Re-evaluate ALL existing data entries against CURRENT rules, staying
ahead of stale data instead of waiting for it to surface as a bug.

- **Notes are precedence, not blindfolds.** Rulings, suppressions,
  overrides, closed flags, and "don't touch" notes are still SCANNED —
  respect them as the default, but re-check that each one is still
  valid under current rules:
  - Note is blocking something **no longer valid** (the rule it encoded
    was superseded, the source healed, the premise changed) → bring it
    to Sean's attention with the evidence.
  - The needed change is **clear-cut** under an established rule →
    disregard the note, apply the change, update the note to record the
    supersession, and REPORT it (never silently).
  - Ambiguous → flag, research first, present a verdict.
- **Stale cleanup.** Delete no-longer-referenced logic (dead constants,
  ruling entries pointing at series/episodes that no longer exist,
  orphaned staging rows, resolved-but-lingering flags, dead scripts).
  Every deletion is listed in the report.
- **Permanence tiers.** A series that is FINISHED and FULLY PUBLISHED,
  with its mapping researched, cross-verified, and Sean-signed, is
  effectively LOCKED: its decisions are permanent and it drops out of
  routine deep rescans — revisit only when a rule change explicitly
  touches it. Airing/ongoing/unverified series stay in the active
  rescan pool. Over time the locked set grows and deep rescans shrink;
  that is the goal state.
- End with the same census gate as step 5 (ruling_violation = 0) and
  fold results into the step-8 save point.

## 10. Close the loop (every pass)

A consolidation that changes nothing durable was a wasted pass. Before
reporting done:

- **Capture.** For each finding this pass produced, name where it was routed
  per CLAUDE.md's capture table — §10 rule + writer gate + audit class, an
  agent/skill trap, a curated map, or a §12 entry. A finding with no durable
  home will be re-found at full price.
- **Check the gates are real.** Every rule cited in §10 should have an
  enforcement site AND an outcome check. Where a rule exists with no audit
  class behind it, say so — that rule is still costing model attention on
  every pass and is a candidate for automation.
- **Report cycle position.** Say plainly where the project now sits in the
  data cycle and what step is next, so the user is never reconstructing it.
