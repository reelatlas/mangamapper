# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 2 VERIFIED 2026-08-27 (step 3 done): 8/8 reports in `batch20/verify/` (≈1.24M; wave total ≈2.67M). Nothing refuted on an anchor value; two refutations that render (eyeshield fence repair 21 → 48 — declined; d-gray-man continues 5/6/24 → 2/3/29) and ONE SYSTEMIC out-of-block defect: saint-seiya rows 43-72 never received the N22 −1 migration (7 rows outside their volume range; no audit class compares anchor volume to the boundary table). WAVE2-RECOVERY §Verification + §THE DECISIONS written. **NEXT: step 4 — Sean rules** (the nine decisions), then `/apply-batch`. |
| **last save point** | 2026-08-27: consolidate deep after batch 20 wave 1 (§12.79) — every check green |
| **next action** | Sean's rulings on WAVE2-RECOVERY §THE DECISIONS (1 = the seiya N22 re-migration + the `anchor_volume_mismatch` /add-rule; 2 = d-gray-man continues; 3-8 per series; 9 = capture list); then `/apply-batch` (apply-wave2.ts). Still queued: the two wave-1 /add-rules (chapter-count ceiling; MU segment rulings). |
| **awaiting Sean** | the wave-2 rulings (WAVE2-RECOVERY §THE DECISIONS, nine items — the seiya migration is the weighty one); the two queued /add-rules (chapter-count ceiling; MU segment rulings — the 8 unresolved strings: dragon-ball ×3, urusei-yatsura, gintama, berserk memorial, blade-of-the-immortal ONA, inuyasha). Parked: D2, apothecary, the trigun space ruling; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
