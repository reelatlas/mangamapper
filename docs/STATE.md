# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 1 VERIFIED 2026-08-27 (step 3 done — 7/7 reports, nothing refuted on a terminal; ≈1.8M tokens wave total; record `research/batch20/WAVE1-RECOVERY.md §Verification` + §THE DECISIONS). NEXT: step 4 — Sean rules the eight items, then `/apply-batch` (with the G37/G56 lib /add-rule if he says go). |
| **last save point** | 2026-08-27: C7 continue provenance (§12.77) + the two cards — census ruling_violation 0, continue_provenance_missing 0, display 220/0 |
| **next action** | Sean's rulings on WAVE1-RECOVERY §THE DECISIONS (toriko 254, zatch 139 filler-vs-mixed, hellsing 12, gantz 91, gto 200, kinnikuman 116 START 264 + the G53 block, slam-dunk 101 loose_parallel) and his go on the lib /add-rule that actually closes the seven refusals (multi-work MU segment parse + honestTerminal over the MAX anchor). |
| **awaiting Sean** | the eight wave-1 decisions + the /add-rule go (WAVE1-RECOVERY.md). Parked: D2, apothecary, the trigun space ruling; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
