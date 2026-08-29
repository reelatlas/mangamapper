# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | **BATCH 20 — WAVE 7 APPLIED (§12.93); consolidate deep NEXT (P21: the G32 single-segment gate changed).** The S2 ruling: Outlaw Star class, NOT parallel (I40 keeps one witness; 'author credit does not mint correspondence' is now in the record). After deep, wave 8 candidates: L-D ×8 (17 in the class incl. cron drift), FotNS 109-151, kingdom 104-128, bleach 168-202, shippuden 374-392, four-knights 1-23; dai 18-99 ×3 LAST. PARKED for Sean: the T28 six (claymore 26 its own decision); killing-bites ep 11+12 dates (lane-B two-row); the cobra arc-level treatment; the next_work D2 specimen; mixed_fragment_only 16. |
| **last save point** | 2026-08-28: wave 7 applied (§12.93) — gates green (19/19 mu tests), edges current, ruling_violation 0, display 219/0 |
| **next action** | `/consolidate deep` (P21 — the G32 gate). Then Sean picks wave 8. |
| **awaiting Sean** | fund lane L-P (row-grain alignment: 67 canon/mixed rows + chapter runs 4, 6-13, 14, 18-26, 27, 33, 41-42; one arc per wave) or queue it; the UI pass (the two views from series_arcs + episode_correspondence; toggle vs two strips); DBS chapter counts (total_chapters null — MU suppressed on parallel by design, the manga_only arc is the open tail; decide if latest_known should come from a ruled count); the queues; the remaining /add-rules. Parked: D2, apothecary, trigun; no permanence locks. Boruto = candidate second parallel witness — research first. |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
