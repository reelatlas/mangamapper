# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | Restructure phase (docs/restructure-plan.md) — batch 18 comes after |
| **track / piece** | T0–T3 DONE. T4.0 RULED. T4.1 (T25) + T4.2 (T26) + T4.3 (T27) + the batch-18 review lane (T28, A44, the incorporation basis) DONE. **Next piece = T4.4 `episodes.format` + healer + FORMAT_OVERRIDES + watch-order kinds** |
| **cycle step** | BATCH 18 CLOSED 2026-08-26 (changelog §12.59): 32 verdicts through research → verify → Sean → apply; afl_anime_canon_unruled 1 (assassination-classroom ep 0 → T4.4 format). Between batches |
| **last save point** | 2026-08-26: batch 18 wave 3 applied + batch closed — A44 ANCHOR_SUPPRESSED (10 rows), kenshin 44 refuted → filler, akame 23-24 retconned, black-clover 55-56 side_source, SAO 50 movie canon + adopted, beastars 44 studio; ruling_violation 0; display 220/0 (§12.59) |
| **next action** | EXECUTE in this order (T4-GLOSSARY.md §6): ~~A-11~~ → ~~T4.1~~ → ~~T4.2~~ → ~~T4.3~~ → ~~batch-18 review lane (waves 1-3)~~ → **T4.4 `episodes.format` (tv/ova/special/movie/recap) + healer + FORMAT_OVERRIDES + watch_order_entries.kind backfill** → T4.4 format → T4.5 words (UI strings LAST) → consolidate deep |
| **awaiting Sean** | "T4.4" (the format axis). Batch-18 narrow tasks queued in `batch18/WAVE2-RECOVERY.md` + `WAVE3-RECOVERY.md` (claymore frontier, ajin anchors + continues, soul-eater continue, chrono 15-16, gto 25-26, railgun 14/25, DBS Resurrection 'F', SAO movie component + N7, durarara components, a "row covered by no component" audit class). T4-GLOSSARY §7 items. `airdate_regression` (67) + `airdate_withheld` (10) → G53 cites. PARKED /add-rule: `mixed_fragment_only` discrepancy class (T28 queue for pre-bar rows; never auto-flips) |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · A-6 healer over the 27 seeded starts (batch 18) · WIKI_NUMBERING_SHIFTS unification (§E.8) · kinnikuman/railgun dates (batch 18 narrow task) · kenshin-2023 rows 25-27 and beyblade-x 41-44 carry ANOTHER series' 1996/2001 titles+dates (wiki-backfill contamination, block-level — batch 18) · AFL trailing non-episode row (project-arms 53) as an add-rule sibling of G54 · 8 UNRECORDED override chains |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
