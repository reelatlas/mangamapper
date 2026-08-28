# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | RESTRUCTURE PHASE CLOSED 2026-08-26 (docs/restructure-plan.md; P36 passed). Between phases — Sean's next three calls: (1) permanence tiers as the first `/add-rule` (P25), (2) batch 19's shape, (3) the UI chip pass |
| **track / piece** | none in flight. The restructure board is history (docs/restructure-plan.md); the rules ledger (267), the rulings maps, the rosters and the system census are the standing reference |
| **cycle step** | BATCH 20 wave 3 VERIFIED 2026-08-27 (step 3 done): 8/8 reports in `batch20/verify/` (≈1.13M; wave ≈2.66M). Nothing refuted on an anchor value; two render-level corrections (TBATE 24 → filler + graft{86} per T28; kinnikuman 44 → 116), one refuted annotation (x → {54-62, 63}), the eyeshield ep-60 fork closed for 123, and the shugo-chara apply SHAPE ruled by the verifier: renumber only — which needs an N11 `resort` form in lib (a gate on the AFL write path). WAVE3-RECOVERY §Verification + §THE DECISIONS (11 items) written. **NEXT: step 4 — Sean rules**, then `/apply-batch` (apply-wave3.ts; the N11 resort as its lib step if ruled in). |
| **last save point** | 2026-08-27: consolidate deep after batch 20 wave 2 (§12.81) — every check green |
| **next action** | Sean's rulings on WAVE3-RECOVERY §THE DECISIONS — the weighty ones: 1 (shugo-chara: the N11 `resort` form in this apply, or defer the renumber to its own /add-rule; the 35/37/46 + 107/108 repairs apply either way), 2 (golden-kamuy 25-46 atomic), 3 (TBATE 24 filler), 8 (FotNS 5 filler). Then `/apply-batch`; then consolidate (deep if the N11 form lands — an enforcement site). |
| **awaiting Sean** | the wave-3 rulings once the eight reports land; the 20-row anchor_volume_mismatch review; the /add-rules (chapter-count ceiling; MU segment rulings — 10 unresolved strings + the in-window-Movie gap; healer-on-regime after a dry-run list); the day-of-week class; the hxh OVA date regime; the "never adapted" instrument; TBATE 13-22 as a lane. Parked: D2, apothecary, trigun; no permanence locks (50 candidates). |
| **open sidecars** | chain.ts#aggregate ↔ resolve.ts: source_type + manga_status unified in T4.1 (T25); the rest of aggregate's field-by-field duplication (status, dates, totals) still a T2 sidecar · audit-ui-truth.ts hand-mirrors buildMapping's decision points (the assemble lift into a shared module is the FIRST engineering piece of the UI chip pass, not before) · episodes.type has no per-row provenance column (needed before any public API) · 84 live rules without an audit class shrink one /add-rule at a time, when a wave produces a witness — never farmed · docs/rulings.md: 8 UNRECORDED reasons |
| **gates** | `npx tsc -b --noEmit` · `npm run lint` · `npm test` (now includes `scripts/ingest/lib/**/*.test.ts`) · `npm run build` · **`npm run system:census`** (ledger + citations, unpaged selects, one-hop, rosters, rulings index, generated docs, edge hash — red = blocking) |
