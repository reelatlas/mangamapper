# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 19 CLOSED 2026-08-27 (wave 2 applied §12.74, deep §12.75, the open pile §12.76, the C7 gate §12.77). NEXT: step 1 of batch 20 — the plan, recomputed FROM DISK (P11), waves ≤ 8 (P12); research on Sean's go. |
| **last save point** | 2026-08-27: C7 continue provenance (§12.77) + the two cards — census ruling_violation 0, continue_provenance_missing 0, display 220/0 |
| **next action** | Plan batch 20 from disk (research/batch20/PLAN.md): A1 MU-pin refusals ×7 (slam-dunk, toriko, gantz, kinnikuman, hellsing, zatch-bell, gto), A2 gap blocks ×11 (anchor_gap_research), the A18 hole additions (TMM 19/21/37/41/44, eyeshield 39 + the standing hole list), shugo-chara's AFL 73-skip/double-96 renumber (N11 shape), golden-kamuy 44's date, solo-leveling 13-24 (flag 1029), TBATE ep 23/12, rosario's S1 continue convention, kinnikuman 47 divergence, x 17 typing, eyeshield 60/61. Stop for Sean's go before any research wave. |
| **awaiting Sean** | the batch-20 plan (his go on the shape and the first wave). Parked: D2, apothecary, the trigun space ruling; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
