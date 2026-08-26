# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | Restructure phase (docs/restructure-plan.md) — batch 18 comes after |
| **track / piece** | T0–T3 DONE (T3.1 proven with two exercises: G53, G54; T3.2/T3.5 land inside T4.5). T4.0 RULED. **T4 build in progress: next piece = T4.1 SOURCE_KINDS** |
| **cycle step** | between batches (batch 17 sealed 2026-08-25; census all rule classes 0) |
| **last save point** | 2026-08-26: A-11 executed as `G54` — air-date order gate (fixed-point walk in lib/airdate-order.ts, AIRDATE_ORDER_ACK map, healer pass, classes airdate_regression 68 / airdate_withheld 10); edges deployed; `npm run system:census` now runs the 7-check runner |
| **next action** | EXECUTE in this order (T4-GLOSSARY.md §6): ~~A-11~~ → **T4.1 SOURCE_KINDS registry + SOURCE_TYPE_OVERRIDES + `series_without_source_kind` + migrate 16 rows + manga_status anime_only→none + hasSource/hasInstrument split** → T4.2 annotation kinds → T4.3 standing migration (+A1 spike check, afl_anime_canon_unruled) → batch-18 review of big unruled blocks → T4.4 format → T4.5 words (UI strings LAST) → consolidate deep |
| **awaiting Sean** | nothing blocking. Batch-18 items: T4-GLOSSARY §7 + the `airdate_regression` queue (68 rows / 46 series; 6 at 351–359 d are yearly typos just under the 365 threshold — his call whether the threshold moves) + `airdate_withheld` (10 rows needing a cited date via G53) |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts unification (after T4.0 rules; no new source_type values) · A-6 healer over the 27 seeded starts (batch 18) · WIKI_NUMBERING_SHIFTS unification (§E.8) · kinnikuman/railgun dates (batch 18 narrow task) · kenshin-2023 rows 25-27 and beyblade-x 41-44 carry ANOTHER series' 1996/2001 titles+dates (wiki-backfill contamination, block-level — batch 18) · AFL trailing non-episode row (project-arms 53) as an add-rule sibling of G54 · 8 UNRECORDED override chains |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
