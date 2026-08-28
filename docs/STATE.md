# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 2 APPLIED 2026-08-27 (§12.80): the seiya marker-keyed N22 re-migration (7 volume mismatches → 0) + the `anchor_volume_mismatch` census class (20 listed elsewhere, a review queue) + 117 anchors / 50 continues / 104 annotations over the eight gap blocks; edges deployed; census green (ruling_violation 0, display 219/0). **NEXT: `/consolidate deep` (P21 — required: a migration changed stored values, a census class was added)**, then capture (the list in WAVE2-RECOVERY §APPLIED). |
| **last save point** | 2026-08-27: batch 20 wave 2 APPLIED (§12.80) — gates green, edges current |
| **next action** | `/consolidate deep` (Sean: yes), then capture; then Sean's choice — wave 3 (L-C + L-B), the anchor_volume_mismatch review queue (20 rows / 8 series), or the two queued /add-rules (chapter-count ceiling; MU segment rulings — bleach #677 joins that queue). |
| **awaiting Sean** | after the deep: the next wave's shape; the 20-row anchor_volume_mismatch review; the two queued /add-rules (chapter-count ceiling; MU segment rulings + bleach #677); the hxh OVA date regime (ja-WP vs Nippon Animation). Parked: D2, apothecary, the trigun space ruling; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
