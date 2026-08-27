# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | Restructure phase (docs/restructure-plan.md) — batch 18 comes after |
| **track / piece** | T0–T3 DONE. T4.0 RULED. T4.1 (T25) + T4.2 (T26) + T4.3 (T27) + the batch-18 review lane (T28, A44, the incorporation basis) DONE. T4.4 (T29) DONE. **Next piece = T4.5 the words (UI strings last) → `/consolidate deep` → P36 frame check** |
| **cycle step** | BATCH 18 CLOSED 2026-08-26 (changelog §12.59): 32 verdicts through research → verify → Sean → apply; afl_anime_canon_unruled 1 (assassination-classroom ep 0 → T4.4 format). Between batches |
| **last save point** | 2026-08-26: T4.4 done as `T29` — episodes.format derived + stored (19,845 of 19,863 rows), FORMAT_OVERRIDES (8 series), watch-order kinds by exact date join, classes format_missing / episode_without_component / watch_order_kind_missing; ruling_violation 0; display 220/0 (§12.60) |
| **next action** | EXECUTE in this order (T4-GLOSSARY.md §6): ~~A-11~~ → ~~T4.1~~ → ~~T4.2~~ → ~~T4.3~~ → ~~batch-18 review lane (waves 1-3)~~ → ~~T4.4~~ → **T4.5 the words: badge strings canon/mixed/filler + `{noun} only`, `studio original` series label, retire 'anime only' / 'anime-only-canon' from the EpisodeType union, agent + PROTOCOL text (T3.2 PROTOCOL collapse, T3.5 agent defs)** → T4.4 format → T4.5 words (UI strings LAST) → consolidate deep |
| **awaiting Sean** | "T4.5" (the words — the first piece that changes what users read; the UI pass proper is later). Queues: `format_missing` (18 rows / 14 series), `episode_without_component` (32 rows / 20 series → N7 + kind components, stale spans), `watch_order_kind_missing`; batch-18 narrow tasks (WAVE2/3-RECOVERY.md); T4-GLOSSARY §7; `airdate_regression` (67) + `airdate_withheld` (10) → G53; PARKED `mixed_fragment_only` |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · A-6 healer over the 27 seeded starts (batch 18) · WIKI_NUMBERING_SHIFTS unification (§E.8) · kinnikuman/railgun dates (batch 18 narrow task) · kenshin-2023 rows 25-27 and beyblade-x 41-44 carry ANOTHER series' 1996/2001 titles+dates (wiki-backfill contamination, block-level — batch 18) · AFL trailing non-episode row (project-arms 53) as an add-rule sibling of G54 · 8 UNRECORDED override chains |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
