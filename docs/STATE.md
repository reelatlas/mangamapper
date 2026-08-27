# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 19 wave 2 VERIFIED 2026-08-27 (R24): 9 reports in `batch19/verify/`, nothing refuted outright (two premises corrected, city-hunter repair held), one LIB BUG found (afg.ts continua '(p.' truncation — 14 series render a too-low frontier); ≈2.8M tokens. NOW: step 4 — Sean rules (the list in the checkpoint report + WAVE2-RECOVERY §Verification); then apply (incl. the parser fix) → the formal consolidate deep. |
| **last save point** | 2026-08-26: A42's outcome classes anchor_without_row / annotation_without_row (§12.73) — the three post-wave-1 /add-rules complete |
| **next action** | Sean's go on batch 19 WAVE 2 (B2 source kinds · B3 air dates incl. the E2 residual typos · B4 structure/kinds = IDENTITY for 5D's 155 + black-cat 24, the 37 watch-order kinds · B5 rearranged zones) — waves ≤ 8, stop for usage. D2 (prisma / rayearth) and apothecary's manga link stay parked; the trigun display-total RULING is his when he wants it. |
| **awaiting Sean** | the wave-2 rulings: B2 kinds (+ the webtoon-vs-manhwa criterion; Arise 9-10 T6); 5D's drop+shift+insert sequence; black-cat span (A) + row-15 date/format; the B3 package (DBZ Kai NULLs, transpositions, ORDER_ACKs incl. city-hunter); TMM/arms/bobobo out-of-order regimes (A41/A18) + the already-reached-chapter shape; ranma 130 T28; conan's first-part convention; the afg.ts parser fix as an apply-time lib change |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
