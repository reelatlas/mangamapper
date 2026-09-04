# Batch 22 — research protocol (pinned per wave, R31)

The VOCABULARY lives in `.claude/agents/research-agent.md` (the three standings,
the annotation kinds incl. `recap` / `unverified` / `chain_source` / `side_source`,
THE SLIVER CLAUSE and its per-segment weights, A44's bases — 'behind an earlier
anchor' is NOT one — C5's covered-or-not continue test, the traps). This file
pins only the task shape, the output JSON (unchanged from batch 21: series_id,
summary, anchors, continue_points, anchor_hostile, annotations, repairs,
type_corrections, structure, flags_for_sean) and the wave's asks. Rules by id.
Shape rules that have cost a re-run: `type_corrections[].episodes` is a LIST;
every type_correction and anchor carries ≥ 2 `sources` (R3); `chapters` is a
chapter list, never prose; a chain_source / side_source `chapters` STARTS with
the work label (I41).

Wave 1 = **the Boruto follow-up** (2026-09-04, Sean's go; the batch-21 wave-3
verdict's out-of-ask findings). Two agents: (1) eps 19-23 / 39, lane I — the
Gaiden rows want `chain_source` annotations under the ruled chain Naruto →
Naruto Gaiden → Boruto; standings confirmed, anchors none (position-less by
another chapter space); (2) eps 18 / 93-95, lane C — the untested members of
AFL's loose Mixed bucket, settled by chapter accounting. Files:
`<series>-w1a.json` (lane I) and `<series>-w1b.json` (lane C) in `out/`.
