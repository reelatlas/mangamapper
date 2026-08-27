# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 19 wave 2 LANDED 2026-08-26 (P13): 7 agents, 24 + 41 verdicts, both gates 0 failing, ≈1.62M tokens; `batch19/WAVE2-RECOVERY.md`. Next: step 3 VERIFY (16 verifiers in two batches of 8) on Sean's go → step 4 Sean rules → apply → the formal consolidate deep. |
| **last save point** | 2026-08-26: A42's outcome classes anchor_without_row / annotation_without_row (§12.73) — the three post-wave-1 /add-rules complete |
| **next action** | Sean's go on batch 19 WAVE 2 (B2 source kinds · B3 air dates incl. the E2 residual typos · B4 structure/kinds = IDENTITY for 5D's 155 + black-cat 24, the 37 watch-order kinds · B5 rearranged zones) — waves ≤ 8, stop for usage. D2 (prisma / rayearth) and apothecary's manga link stay parked; the trigun display-total RULING is his when he wants it. |
| **awaiting Sean** | "verify" on wave 2 (B2 + B4 + B5 fully; B3's contradictions as one task) — or rule directly on the plain G53 typos; the two B4 structure findings (5D's film-at-83 + missing ep 145; black-cat's OVA at row 15) are his structure calls at rule time |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
