# STATE — where the project is right now

One screen. Consolidate reads this FIRST and writes it LAST; the memory file
points here instead of restating it. If this file and a conversation
disagree, this file is the claim to verify, not the conversation.

| | |
|---|---|
| **phase** | Restructure phase (docs/restructure-plan.md) — batch 18 comes after |
| **track / piece** | T1 DONE (ledger, docs split, router, STATE, one-hop cases). Next: T4.0 glossary session with Sean; T2/T3 can run on either side of it |
| **cycle step** | between batches (batch 17 sealed 2026-08-25; census all rule classes 0) |
| **last save point** | T1 complete (2026-08-26): ledger v1 + docs split + CLAUDE.md router + one-hop cases 16/16 |
| **next action** | Sean: T4.0 glossary session (docs/restructure-plan.md §5). Session: T2.3 completeness sidecar (syncAnchors A1 hole) can start any time |
| **awaiting Sean** | the T4.0 glossary session (D-9..D-13) — schedule it; nothing else blocked |
| **open sidecars** | T2.3 completeness (syncAnchors unpaged A1 hole first) · T2.6 edge lib-hash · chain.ts#aggregate source_type unification (no new values before T4.0) |
| **gates** | `npx tsc -b --noEmit` (now real for scripts) · `npm run lint` · `npm test` · `npm run build` · `npx tsx scripts/restructure/ledger-check.ts` (red = blocking this phase) |
