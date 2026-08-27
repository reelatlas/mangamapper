# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 2 LANDED 2026-08-27 (step 2 done, checkpointed P13): 8/8 verdicts in `batch20/out/`, validate 15/0, scan read; WAVE2-RECOVERY.md written (≈1.43M tokens). 117 anchors delivered across the eight blocks (hxh 13, yyh 17, bleach 14, eyeshield 12, kingdom 25, d-gray-man 22, seiya 14, shippuden 0 by design + 17 side_source hostile); 2 fence repairs (eyeshield 21 → 48, d-gray-man 51 → 46), 5 retypes → filler, 2 reorder regimes, hxh 83/84 G53. NEXT: **step 3 VERIFY (R24)** — eight verifier tasks, a different model than Opus. |
| **last save point** | 2026-08-27: consolidate deep after batch 20 wave 1 (§12.79) — every check green |
| **next action** | Sean's go on step 3: verify wave 2 (eight `verdict-verifier` tasks, Fable — the weight-bearing items are in WAVE2-RECOVERY §Next); then Sean rules the forks; then `/apply-batch`. Still queued: the two /add-rules (chapter-count ceiling map — gto 200 / zatch 323; per-series MU segment rulings). |
| **awaiting Sean** | the go on wave-2 VERIFY; the two queued /add-rules (chapter-count ceiling; MU segment rulings — the 8 unresolved strings: dragon-ball ×3, urusei-yatsura, gintama, berserk memorial, blade-of-the-immortal ONA, inuyasha). Parked: D2, apothecary, the trigun space ruling; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
