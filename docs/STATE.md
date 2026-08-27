# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 19 wave 2 APPLIED 2026-08-27 (step 5 done — §12.74; the record is `WAVE2-RECOVERY.md §APPLIED`). NEXT: step 6 — the formal **`/consolidate deep`** (P21: the afg.ts parser, the G53 gate (NULL + titles) and G56's writer all changed enforcement sites); then capture (P29) and Sean's go on batch 20 (A1 MU pins, A2 gap blocks) or the hygiene items. |
| **last save point** | 2026-08-27: batch 19 wave 2 applied (§12.74) — parser fix 4d2b9cc, then the maps + apply-wave2 + apply-5ds; census ruling_violation 0, display 220/0 |
| **next action** | `/consolidate deep` (required, P21). Then Sean's decisions from WAVE2-RECOVERY §APPLIED: hells-paradise 25 → 94; shugo-chara's reversed pairs / AFL 73-skip renumber; golden-kamuy 44; the two watch-order duplicate pairs. Batch 20 shape after that. |
| **awaiting Sean** | the open decisions in WAVE2-RECOVERY §APPLIED (hells-paradise 25, shugo-chara pairs, golden-kamuy 44, watch-order duplicates, kinnikuman 47 divergence, x 17 typing, eyeshield 60/61 + the 54-57 continue question, conan 513/584 strict-A4 re-look, TBATE ep 23/12, solo-leveling 13-24 anchors); parked: Sailor Moon 167-168 re-look at the deep, D2, apothecary, the trigun space ruling |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
