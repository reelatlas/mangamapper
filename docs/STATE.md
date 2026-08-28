# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 3 APPLIED 2026-08-27 (§12.82): the N11 `resort` form + a faithful AFL parser + `toMergedRecord` for the title/date maps (lib, 140 tests, edges deployed); shugo-chara renumbered (127 rows, true ep 95 restored, anchors/annotations re-keyed), golden-kamuy 25-44 as one block, 45 anchors / 50 continues (rosario's 13 curated) / 43 annotations, T6 ×5, A44 ×2; census green (airdate_regression 0, ruling_violation 0, display 219/0). **NEXT: `/consolidate deep` (P21 — three enforcement sites changed)**, then capture (WAVE3-RECOVERY §APPLIED). |
| **last save point** | 2026-08-27: batch 20 wave 3 APPLIED (§12.82) — gates green, edges current |
| **next action** | `/consolidate deep` (required), then capture; then Sean's choice — waves 4-5 (dai ×3, FotNS 29-56, DBS identity; L-D in eights), the review queues (anchor_volume_mismatch 20; the shugo 82-96 T28 lane; TBATE 13-22), or the /add-rules (segment rulings incl. the in-window-Movie gap; chapter-count ceiling; healer-on-regime after a dry-run list). |
| **awaiting Sean** | after the deep: the next wave's shape; the review queues; the /add-rules. Parked: D2, apothecary, trigun; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
