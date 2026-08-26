# scripts/ingest/history — the cited record, never run

These are one-shot apply/migration scripts whose rulings were EXTRACTED to
`scripts/ingest/lib/rulings/applied/*` (restructure T2.1/T2.5, 2026-08-26)
and whose effects live in the database. They stay because
`docs/rulings.md` and the changelog cite them by name.

**Never run one.** Several would REVERT later rulings if re-run
(apply-research-batch.ts recreates the fist-of-the-blue-sky 23–26 span
demoted on 2026-08-25; apply-research-aot-s4p2.ts sets AoT ep 87 start back
to 123; dr-stone row 95 vs the order-only ruling). Rule P34. The
`unpaged-selects` scanner and the rosters skip this directory; the system
census asserts nothing here is on a roster.

| file | class (T0 triage) |
|---|---|
| apply-continue-points.ts | history |
| apply-rearranged-anchors-2.ts | history |
| apply-rearranged-anchors-3.ts | history |
| apply-rearranged-anchors.ts | history |
| apply-research-aot-finale.ts | history |
| apply-research-aot-s4p2.ts | history |
| apply-research-batch-10.ts | history |
| apply-research-batch-11.ts | history |
| apply-research-batch-12.ts | history |
| apply-research-batch-13.ts | history |
| apply-research-batch-14.ts | history |
| apply-research-batch-15.ts | history |
| apply-research-batch-16.ts | history |
| apply-research-batch-17.ts | history |
| apply-research-batch-3.ts | history |
| apply-research-batch-4.ts | history |
| apply-research-batch-5.ts | history |
| apply-research-batch-6.ts | history |
| apply-research-batch-7.ts | history |
| apply-research-batch-8.ts | history |
| apply-research-batch-9.ts | history |
| apply-research-batch.ts | history |
| apply-rulings-20260824.ts | history |
| apply-rulings-20260825-mashle.ts | history |
| apply-rulings-20260825b.ts | history |
| apply-start-chapters.ts | history |
| assisted-prep.ts | history |
| canon-tier-2.ts | history |
| canon-tier.ts | history |
| cleanup.ts | history |
| fix-mismatch.ts | history |
| merge.ts | history |
| pilot.ts | dead |
| polish-ids.ts | history |
| stabilize.ts | history |
| wayback-recover2.ts | dead |
