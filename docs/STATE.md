# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 18 CLOSED 2026-08-26 (changelog §12.59): 32 verdicts through research → verify → Sean → apply; afl_anime_canon_unruled 1 (assassination-classroom ep 0 → T4.4 format). Between batches |
| **last save point** | 2026-08-26: batch 19 E3 — A10 sliver rule in `lib/sliver.ts`, classes `start_sliver_mismatch` (2: bokuben 6, MHA 61) + `start_without_span` (the 27 batch-8/9 seeds); sign sheet `research/batch19/apply-e3.ts` (dry-run; `--apply` on Sean's signature); the 27 seeded starts all STAND under A10 (§12.67) |
| **next action** | batch 19 per `research/batch19/PLAN.md` (ruled shape): ~~E1~~ → ~~E2~~ → ~~E3~~ (built; awaiting signature) → E3 (A-6 sliver re-normalization healer) → E4 (32 component-less rows → N7 + kind components) → batch-19 PROTOCOL from the batch-17 anchoring shape → lane B bundles + the A3 frontier-tail wave → verify → Sean rules → apply via maps → consolidate. Each engineering piece stops for Sean's go |
| **awaiting Sean** | "go E4"; SIGN E3: `apply-e3.ts --apply` (2 START moves + 27 span records — listed in §12.67; both classes go to 0); the `episode_date_off_window` residual (6): bebop 27 → a T29 format entry, dbz-kai 101-103 → a G55 ack (cite), three single-date typos (future-diary 13, gx 14, 5d's 35) → G53 with cited dates, fist-of-the-blue-sky's series row (end_date 1987 < start 2006; 26 rows vs aired 22); the `mixed_fragment_only` queue (35 rows) is his per-row call whenever he wants it — a partial written before T28 may still be a substantial share |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · A-6 healer over the 27 seeded starts (batch 18) · WIKI_NUMBERING_SHIFTS unification (§E.8) · kinnikuman/railgun dates (batch 18 narrow task) · kenshin-2023 rows 25-27 and beyblade-x 41-44 carry ANOTHER series' 1996/2001 titles+dates (wiki-backfill contamination, block-level — batch 18) · AFL trailing non-episode row (project-arms 53) as an add-rule sibling of G54 · 8 UNRECORDED override chains |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
