# Batch 21 — research protocol (pinned per wave, R31)

The VOCABULARY lives in `.claude/agents/research-agent.md` (the three standings,
the annotation kinds incl. `recap` / `unverified` / `chain_source`, THE SLIVER
CLAUSE and its per-segment weights, the traps). This file pins only the task
shape, the output JSON (unchanged from batch 20: series_id, summary, anchors,
continue_points, anchor_hostile, annotations, repairs, type_corrections,
structure, flags_for_sean) and the wave's asks. Rules by id.

Wave 1 = **the STRONG tier of `type_source_disagreement` (T4's flag, 2026-09-04)**:
38 rows across 8 series where AFL's type and animefillerguide's POSITIVE claim
contradict (AFL filler vs an AFG row that maps chapters; AFL canon vs an AFG
red / blue class). One agent per series; One Piece split in two by episode
range. THE ASK per row: settle the type by CHAPTER ACCOUNTING (T28 — what the
episode adapts, which share; a recap or a sliver is weightless; the remainder
decides) on two independent sources beyond the two disagreeing labels. Deliver:
`type_corrections` where the stored type is wrong (reason + segment weights),
anchors where a canon / mixed row adapts numbered chapters and none is stored
(A4 / A10 / A47), annotations for every segment (`weight: significant | sliver`),
and — when AFL is RIGHT — say so with the evidence: a confirmed stored type is a
result, not an empty verdict. Name which source lied and how. `unverified`
where a chapter is certainly present but the share cannot be sized. Files:
`<series>-w1.json` in `out/`.
