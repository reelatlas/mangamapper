# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 19 wave 2 CLOSED 2026-08-27 — step 5 applied (§12.74) and step 6 `/consolidate deep` DONE (§12.75); step 7 capture done (research-agent traps, system-evolution note). NEXT: Sean's decisions below, then batch 20's shape (A1 MU pins, A2 gap blocks) or the hygiene items — his go. |
| **last save point** | 2026-08-27: the open pile ruled + applied (§12.76) — Sailor Moon 167-168 anchored, hells-paradise 25 → 89 manual, watch-order dupes dropped, Conan 513 → 629 / 514 → 630 / 584 [706] strict A4; census ruling_violation 0 |
| **next action** | Sean rules the two cards (rosario 12/13, iruma 63 — WAVE2-RECOVERY §CARDS); then batch 20 planning from disk (P11): A1 MU-pin refusals ×7, A2 gap blocks ×11, the A18 hole additions (TMM 19/21/37/41/44, eyeshield 39), shugo-chara's AFL renumber (N11 shape), golden-kamuy 44's date, solo-leveling 13-24 (flag 1029), TBATE ep 23/12. |
| **awaiting Sean** | the two CARDS in WAVE2-RECOVERY.md: rosario-vampire 12/13 (confirm 9 [9] / 10 [9] and fix the strings — my pick (a)) and iruma-kun 63 (145 [142] rearranged under the pages line — my pick (a)); the C7 healer-gap /add-rule (his go); smaller items now batch-20 candidates (kinnikuman 47 divergence, x 17 typing, eyeshield 60/61 + the 54-57 continue question). Parked: D2, apothecary, the trigun space ruling. No permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
