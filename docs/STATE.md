# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 19 wave 1 APPLIED 2026-08-26 (step 5): 42 decisions through the maps + apply-wave1.ts; heal + census clean (ruling_violation 0; frontier_tail_null 7 → 3; verify 220/0). NEXT: step 6 `/consolidate deep` — REQUIRED (P21): C1 gained an enforcement site (the parity healer's C1 guard). No wave 2 until Sean's go. |
| **last save point** | 2026-08-26: batch 19 wave 1 applied (§12.69) — 12 anchors, 15 continues, 12 annotations, 2 deletions, 3 A44, T6/T26 map rulings; C1 guard in heal-parity-continues |
| **next action** | batch 19 per `research/batch19/PLAN.md` (ruled shape): ~~E1~~ → ~~E2~~ → ~~E3~~ (signed) → ~~E4~~ (signed; dxd row 0 dropped; 5D's 155 + black-cat 24 → B4) → E3 (A-6 sliver re-normalization healer) → E4 (32 component-less rows → N7 + kind components) → batch-19 PROTOCOL from the batch-17 anchoring shape → lane B bundles + the A3 frontier-tail wave → verify → Sean rules → apply via maps → consolidate. Each engineering piece stops for Sean's go |
| **awaiting Sean** | "go" for `/consolidate deep` (required after the C1 enforcement change); then the process items (annotation-delete shape; MU pin skip / G37; loose_parallel gloss; trigun's durable space ruling) and the parked structure decisions (D2 prisma/rayearth; apothecary manga link); wave 2 only on his go |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · A-6 healer over the 27 seeded starts (batch 18) · WIKI_NUMBERING_SHIFTS unification (§E.8) · kinnikuman/railgun dates (batch 18 narrow task) · kenshin-2023 rows 25-27 and beyblade-x 41-44 carry ANOTHER series' 1996/2001 titles+dates (wiki-backfill contamination, block-level — batch 18) · AFL trailing non-episode row (project-arms 53) as an add-rule sibling of G54 · 8 UNRECORDED override chains |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
