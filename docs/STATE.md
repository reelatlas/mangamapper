# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 3 — step 2 RESEARCH, DISPATCHED 2026-08-27 (Sean's go; Cursor's sequencing): lane C narrow follow-ups (solo-leveling 13-24, TBATE 12/23-24, kinnikuman 33-35/38-45/47, eyeshield 39/60-61 + tokyo-mew-mew 19/21/37/41/44 bundled, x 17, FotNS 1-28) + lane B numbering/dates (shugo-chara 70-110 renumber, golden-kamuy 42-46) — 8 agents. PROTOCOL.md gained the wave-3 mission (no contract change); V11 `anchor_volume_mismatch` ledger record landed in the same motion (Sean: hygiene, not a gate). Contexts in scratchpad `b20ctx3/`; verdicts → `batch20/out/` (lane C) and `out/airdates/` (lane B, `validate-airdates.ts`). |
| **last save point** | 2026-08-27: consolidate deep after batch 20 wave 2 (§12.81) — every check green |
| **next action** | Sean's go on wave 3, the review queue, or an /add-rule (the anchor_volume_mismatch record is the natural first: the class is live, seven witnesses closed, 20 open). |
| **awaiting Sean** | the next wave's shape; the 20-row anchor_volume_mismatch review; the /add-rules (anchor_volume_mismatch record; chapter-count ceiling — gto 200 / zatch 323; MU segment rulings — 10 unresolved strings + kaguya / heavens); the hxh OVA date regime; the day-of-week class; the "never adapted" instrument. Parked: D2, apothecary, the trigun space ruling; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
