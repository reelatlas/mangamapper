# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 4 CLOSED 2026-08-28 (applied §12.84, deep §12.85). Batch 20: four waves closed (the honest terminals; the gap blocks + the seiya re-migration; the narrow follow-ups + the shugo renumber; the standing lies + the translatedMax floor fix). NEXT: Sean's choice — waves 5-6 (DBS IDENTITY first, then dai 18-99 ×3, FotNS 29-56; L-D in eights), the shugo 67-81 follow-up, a review queue (anchor_volume_mismatch 20), or an /add-rule (row provenance on episodes — five witnesses — is the structural one; MU segment rulings; chapter-count ceiling; healer-on-regime; the day-of-week class). |
| **last save point** | 2026-08-28: consolidate deep after batch 20 wave 4 (§12.85) — every check green |
| **next action** | Sean's go on the next piece — recommend DBS identity (PLAN: which arcs adapt the manga at all — side_source / T21 — before any anchors) as wave 5. |
| **awaiting Sean** | the next wave's shape; the queues; the /add-rules (row provenance first if he wants the structural one). Parked: D2, apothecary, trigun; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
