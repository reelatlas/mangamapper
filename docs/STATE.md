# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 19 wave 1 LANDED 2026-08-26 (P13): 8 verdicts (claymore, ajin, chrono, trigun, soul-eater, gto, railgun, DBS), gate 0 failing, ~973k research tokens; `batch19/WAVE1-RECOVERY.md`. Next: step 3 VERIFY over all eight (R24, different model) on Sean's go → step 4 Sean rules → apply through the maps. |
| **last save point** | 2026-08-26: batch 19 E4 — I39 ruled structure (`RULED_STRUCTURE` + `planComponents` + `heal-structure`), 15 rulings SIGNED; dxd row 0 dropped (N11); episode_without_component 20 → 4, format_missing 14 → 4 (§12.68) |
| **next action** | batch 19 per `research/batch19/PLAN.md` (ruled shape): ~~E1~~ → ~~E2~~ → ~~E3~~ (signed) → ~~E4~~ (signed; dxd row 0 dropped; 5D's 155 + black-cat 24 → B4) → E3 (A-6 sliver re-normalization healer) → E4 (32 component-less rows → N7 + kind components) → batch-19 PROTOCOL from the batch-17 anchoring shape → lane B bundles + the A3 frontier-tail wave → verify → Sean rules → apply via maps → consolidate. Each engineering piece stops for Sean's go |
| **awaiting Sean** | "verify" on wave 1 (all eight); the three A3 decisions — D2 for prisma-illya + rayearth, a manga-link ruling for apothecary-diaries (then T24) |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · A-6 healer over the 27 seeded starts (batch 18) · WIKI_NUMBERING_SHIFTS unification (§E.8) · kinnikuman/railgun dates (batch 18 narrow task) · kenshin-2023 rows 25-27 and beyblade-x 41-44 carry ANOTHER series' 1996/2001 titles+dates (wiki-backfill contamination, block-level — batch 18) · AFL trailing non-episode row (project-arms 53) as an add-rule sibling of G54 · 8 UNRECORDED override chains |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
