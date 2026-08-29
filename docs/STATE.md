# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | **BATCH 20 — WAVE 6 CLOSED (§12.91); consolidate deep NEXT (P21: T28 exception, N35, the G32 season fix all changed enforcement sites).** FotNS 1-108 is now anchored solid (29-56 landed; 109-151 = the next block); six L-D pins verified/repaired at the manual tier + regenesis's deleted as another adaptation's (G37). Two new rules: the T28 sole-adaptation exception (witness FotNS 57) and N35 ruled chapter spaces (regenesis 255, sacred-beasts 87/15). After deep: L-D wave 7 (22 pins in eights), FotNS 109-151, kingdom 104-128, bleach 168-202, naruto-shippuden 374-392, four-knights 1-23 (new cron drift), dai 18-99 ×3 LAST; regenesis follow-ups (eps 10/11 typing; S2 = a possible SECOND parallel witness, research first). |
| **last save point** | 2026-08-28: wave 6 applied (§12.91) — gates green (156 tests), edges current, ruling_violation 0, display 219/0 |
| **next action** | `/consolidate deep` (P21). Then Sean picks wave 7 (recommend: L-D ×8 of the 22 remaining). |
| **awaiting Sean** | fund lane L-P (row-grain alignment: 67 canon/mixed rows + chapter runs 4, 6-13, 14, 18-26, 27, 33, 41-42; one arc per wave) or queue it; the UI pass (the two views from series_arcs + episode_correspondence; toggle vs two strips); DBS chapter counts (total_chapters null — MU suppressed on parallel by design, the manga_only arc is the open tail; decide if latest_known should come from a ruled count); the queues; the remaining /add-rules. Parked: D2, apothecary, trigun; no permanence locks. Boruto = candidate second parallel witness — research first. |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
