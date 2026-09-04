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

Wave 2 = **the narrow wave** (2026-09-05, Sean's go after the T26 adoption
sitting, §12.117 — research, not rulings). Five agents, five sized asks: (1)
beelzebub 49 — the extra chapter vs the novel, beat by beat (T28; the novel no
longer counts: a licence is not adoption), lane C; (2) beelzebub 15 / 16 /
26-28 / 51 — the standing crumbs batch 21 flagged, lane C; (3) fma 37 / 13 —
the Arakawa bonus-chapter share vs the novel segment, own verdict, lane C; (4)
dbs 6 — T30's load-bearing test on the shared Battle of Gods arc, the pages of
ch 1-4 decide what the digest carries, a correspondence row proposed with its
alignment, NO adopted{author}, lane I; (5) boruto 106 — the ch-700 tie,
chain_source or nothing, never an anchor, lane C. Files: `beelzebub-w2a.json`
(49), `beelzebub-w2b.json` (the crumbs), `fullmetal-alchemist-w2.json`,
`dragon-ball-super-w2.json`, `boruto-naruto-next-generations-w2.json`. Rule of
the wave: NO premise in an ask is evidence — the stored note is 'the standing
claim to test', the pages decide (R3); a delivered canon on a side_source row
without a weight-bearing manga share is overwritten by the writer (T26).

Wave 3 = **the hole wave** (2026-09-05, Sean's go after the deep consolidate,
§12.119). The A18 START clause (a START reaching back past the previous END is
a regime boundary) turned seven interpolations into honest holes; each row
wants its OWN exact START (A18: 'research: anchor it with its own start').
Five agents, lane C: (1) beelzebub 48 / 50 (+ 58's short END) —
`beelzebub-w3.json`; (2) eyeshield-21 53 — `eyeshield-21-w3.json`; (3)
record-of-ragnarok 14-16 — `record-of-ragnarok-w3.json`; (4) sailor-moon 72 —
`sailor-moon-w3.json`; (5) fma 13's T28 share sizing (ruled mixed on an
estimate; size it with an instrument) — `fullmetal-alchemist-w3.json`. Rule of
the wave: THE FORK IS NOT A PREMISE — a hole's far endpoint (the stored START
that reaches back) may itself be the error; deliver whichever the pages prove,
as an anchor + `rearranged` or as a repair with old → new. Every number in the
row's own chapter space (say which space).
