# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | G57 ROW PROVENANCE built 2026-08-28 (§12.86): `episodes.minted_by` (nullable → backfilled from the writers' reach → NOT NULL, no default), `lib/minted.ts#syncMintedRows` the one write path (upsert + re-stamp; a writer deletes only its own stale rows), the five witnesses non-afl, `row_minted_by_missing` 0, the 5D's proof (row 145 survives a re-resolve, 154/154); edges deployed; the recap baseline rule landed in the flow. Batch 20 waves 1-4 closed. **NEXT: Sean's go on wave 5 — DBS identity** (PLAN: which arcs adapt the manga at all — side_source / T21 — before any anchors). |
| **last save point** | 2026-08-28: G57 row provenance built (§12.86) — gates green, edges current, census green |
| **next action** | Sean's go on wave 5 (DBS identity first; then dai 18-99 ×3 last, FotNS 29-56; L-D in eights); the shugo 67-81 follow-up whenever; MU segments a queue; the anchor_volume_mismatch review (20). |
| **awaiting Sean** | the wave-5 go (DBS identity); the queues; the remaining /add-rules (MU segment rulings; chapter-count ceiling; healer-on-regime after a dry-run list; the day-of-week class). Parked: D2, apothecary, trigun; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
