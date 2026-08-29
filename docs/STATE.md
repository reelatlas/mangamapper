# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | **BATCH 20 — WAVE 6 CLOSED end to end (§12.91 apply + §12.92 deep); step 1 for wave 7.** Standing queues: L-D 22 pins; FotNS 109-151; kingdom 104-128; bleach 168-202; shippuden 374-392; four-knights 1-23 (cron drift); dai 18-99 ×3 LAST; the T28 sole-adaptation triage (~17 filler rows, §12.92 — load-bearing is Sean's half; claymore 26 the sharpest case); regenesis follow-ups (10/11 typing; S2 = possible SECOND parallel witness, research first); mixed_fragment_only 16; asterisk sign-offs 155; anchor_volume_mismatch 20; lane L-P. Wave 7 needs Sean's go. |
| **last save point** | 2026-08-28: wave 6 closed (§12.91-92) — gates green, edges current, census green, ruling_violation 0 |
| **next action** | Sean picks wave 7 (recommend: L-D ×8). /research-batch from a disk-recomputed work-list. |
| **awaiting Sean** | fund lane L-P (row-grain alignment: 67 canon/mixed rows + chapter runs 4, 6-13, 14, 18-26, 27, 33, 41-42; one arc per wave) or queue it; the UI pass (the two views from series_arcs + episode_correspondence; toggle vs two strips); DBS chapter counts (total_chapters null — MU suppressed on parallel by design, the manga_only arc is the open tail; decide if latest_known should come from a ruled count); the queues; the remaining /add-rules. Parked: D2, apothecary, trigun; no permanence locks. Boruto = candidate second parallel witness — research first. |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
