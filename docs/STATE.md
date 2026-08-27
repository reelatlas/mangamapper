# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | Restructure phase (docs/restructure-plan.md) — batch 18 comes after |
| **track / piece** | T0–T3 DONE. T4.0 RULED. T4.1 (T25) + T4.2 (T26) + T4.3 (T27) + the batch-18 review lane (T28, A44, the incorporation basis) DONE. T4.4 (T29) + T4.5 (T19, T3.2, T3.5) DONE — the T4 build is complete. **`/consolidate deep` DONE (§12.62). Next = P36 cross-model frame check (Cursor) → restructure phase closes → batch 19 / the permanence add-rule** |
| **cycle step** | BATCH 18 CLOSED 2026-08-26 (changelog §12.59): 32 verdicts through research → verify → Sean → apply; afl_anime_canon_unruled 1 (assassination-classroom ep 0 → T4.4 format). Between batches |
| **last save point** | 2026-08-26: consolidate deep — heal is a fixed point, census unmoved vs T4.4, ruling_violation 0, display 220/0; retiresWhen worklist triaged (4 retired, 4 overtaken, 10 pending listed in §12.62); LN-class no-manga-link flags fixed at the healer + 34 dismissed; runbook §5 = rosters (§12.62) |
| **next action** | EXECUTE in this order (T4-GLOSSARY.md §6): ~~A-11~~ → ~~T4.1~~ → ~~T4.2~~ → ~~T4.3~~ → ~~batch-18 review lane (waves 1-3)~~ → ~~T4.4~~ → ~~T4.5~~ → ~~consolidate deep~~ → **P36 frame check** → T4.4 format → T4.5 words (UI strings LAST) → consolidate deep |
| **awaiting Sean** | the P36 cross-model frame check (this thread, with Cursor) — then the phase closes. After it, Sean's calls: (1) permanence tiers as the first post-phase /add-rule (P25: LOCKED series skip routine deep); (2) batch 19's shape — the narrow-task queue (batch-18 recovery records), the LN-side instrument (T24: 33 pending LN series), structure fixes (episode_without_component 32, watch_order_kind_missing 36, format_missing 18), airdate queues (67 + 10), mixed_fragment_only (parked); (3) the UI chip pass (format / adopted / sourceLabel; the `_` token grammar) |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · A-6 healer over the 27 seeded starts (batch 18) · WIKI_NUMBERING_SHIFTS unification (§E.8) · kinnikuman/railgun dates (batch 18 narrow task) · kenshin-2023 rows 25-27 and beyblade-x 41-44 carry ANOTHER series' 1996/2001 titles+dates (wiki-backfill contamination, block-level — batch 18) · AFL trailing non-episode row (project-arms 53) as an add-rule sibling of G54 · 8 UNRECORDED override chains |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
