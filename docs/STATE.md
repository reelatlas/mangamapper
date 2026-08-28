# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 4 APPLIED 2026-08-28 (§12.84): TBATE 13-22 identity + types + five anchors, TMM 38 → 20 [20], shugo 82-96 typing + the ZONE_ACKS re-key, FotNS three dates; AND a census-caught reversion fixed in lib — `translatedMax` (the AFL max in OUR space) now feeds the aired floor (5D's had floored back to 155 and lost its backfilled row 145 on a cron re-resolve; restored through the ruled path). Edges deployed; census green (ruling_violation 0, display 219/0). **NEXT: `/consolidate deep` (P21 — the floor's input is an enforcement site)**, then capture. |
| **last save point** | 2026-08-28: batch 20 wave 4 APPLIED (§12.84) — gates green, edges current |
| **next action** | `/consolidate deep` (required), then capture; then Sean's choice — DBS identity first (then dai last, FotNS 29-56; L-D in eights), the shugo 67-81 follow-up, the review queues (anchor_volume_mismatch 20), or the /add-rules (row provenance on episodes — 5D's 145 the witness; MU segment rulings; chapter-count ceiling; healer-on-regime; the day-of-week class). |
| **awaiting Sean** | after the deep: the next piece; the queues; the /add-rules (row provenance is new and structural). Parked: D2, apothecary, trigun; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
