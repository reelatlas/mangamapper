# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 4 VERIFIED 2026-08-28 (step 3 done): 4/4 reports (≈518k; wave ≈1.25M). Nothing refuted on a value; the FotNS ep-29 lean refuted on lineage (leave 05-16); shugo 91 → filler + graft agreed; the resort apply's missed ZONE_ACKS key found. WAVE4-RECOVERY §Verification + §THE DECISIONS (five items) written. **NEXT: step 4 — Sean rules**, then `/apply-batch` (apply-wave4.ts), then a standard consolidate. |
| **last save point** | 2026-08-27: consolidate deep after batch 20 wave 3 (§12.83) — every check green |
| **next action** | Sean's rulings on WAVE4-RECOVERY §THE DECISIONS (1 shugo 91 filler + graft + the ZONE_ACKS re-key + the optional 80 → 32; 2 TBATE as delivered + row 12's continue value; 3 TMM 38 → 20 [19]; 4 FotNS three dates, 29 stays; 5 capture). Then `/apply-batch`; then DBS identity first, dai last; MU segments a queue. |
| **awaiting Sean** | the next wave's shape; the review queues; the /add-rules (MU segment rulings; chapter-count ceiling — gto 200 / zatch 323; healer-on-regime; the day-of-week class; the 'never adapted' instrument); the hxh OVA date regime. Parked: D2, apothecary, trigun; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
