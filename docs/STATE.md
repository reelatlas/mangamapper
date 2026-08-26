# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | Restructure phase (docs/restructure-plan.md) — batch 18 comes after |
| **track / piece** | T1 in progress: T1.2 ledger DONE (258 rules, check green, rules.md generated) → T1.1 docs split → T1.3/T1.6 |
| **cycle step** | between batches (batch 17 sealed 2026-08-25; census all rule classes 0) |
| **last save point** | T1.2 ledger v1 (2026-08-26): 9 families, 258 records, ledger-check + gen-docs |
| **next action** | T1.1 docs split (architecture / runbook / changelog; §10/§11 rule text → pointers to ids; CLAUDE.md router) |
| **awaiting Sean** | nothing — A-1..A-10 ruled 2026-08-25; next ruling point = T4.0 glossary session (after T1) |
| **open sidecars** | T2.3 completeness (syncAnchors unpaged A1 hole first) · T2.6 edge lib-hash · chain.ts#aggregate source_type unification (no new values before T4.0) |
| **gates** | `npx tsc -b --noEmit` (now real for scripts) · `npm run lint` · `npm test` · `npm run build` · `npx tsx scripts/restructure/ledger-check.ts` (red = blocking this phase) |
