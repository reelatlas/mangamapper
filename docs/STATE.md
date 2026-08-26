# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | Restructure phase (docs/restructure-plan.md) — batch 18 comes after |
| **track / piece** | T1 + T2 DONE. Next: T3 skills (T3.1 /add-rule + AIR_DATE_OVERRIDES exercise) and Sean's T4.0 glossary session — either order |
| **cycle step** | between batches (batch 17 sealed 2026-08-25; census all rule classes 0) |
| **last save point** | T2 complete (2026-08-26): history/ moved, lib-hash stamped, system census (`npm run system:census`) green, edges redeployed |
| **next action** | Sean: T4.0 glossary session (docs/restructure-plan.md §5). Session: T3.1 /add-rule skill + AIR_DATE_OVERRIDES exercise |
| **awaiting Sean** | the T4.0 glossary session (D-9..D-13) — schedule it; nothing else blocked |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts unification (no new source_type values before T4.0) · A-6 healer over the 27 seeded starts · P8 check on 14 batch-15/16 repairs · WIKI_NUMBERING_SHIFTS unification (DRIFT-LIST §E.8) |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
