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

Wave 2 = **the STRONG tier as it reads AFTER the AFG parser fix** (2026-09-04:
classes on `<span>`s, `(04).` start cells and timestamp notes are read
correctly now; wave 1's rows are pinned in T6): 47 rows across 15 series, ≤ 8
agents. Same ask as wave 1. Wave-1 lessons pinned: AFG's CLASS is a viewing
guide and its chapter column a reading-position plateau — its minute-range
NOTE is the sizing instrument; AFL's 'Anime Canon' bucket is not a type
witness; the fandom's explicit `chapter = Filler` vs a missing field; ja-WP's
一部原作 marker; a novelization is `side_source` on a filler row unless adopted.
Files: `<series>-w2.json` (`-w2a` / `-w2b` where a series is split).


Wave 3 = **what the census exposed after the wave-2 apply** (2026-09-04, Sean's
go; A44 / A8 / C5 amended §12.111-112 — BEHIND IS NOT A BASIS: a first-time
significant block anchors at its own END wherever the frontier stands; its
continue follows C5's covered-or-not test). Three agents: (1) naruto-shippuden
113-117, lane A2 — the five honest reorder holes the ep-112 anchor opened;
anchor each with its own START / END; (2) beelzebub 17 / 34 / 39 and (3)
boruto 1 / 24 / 127 / 157, lane C — the last STRONG `type_source_disagreement`
rows, settled by chapter accounting exactly as waves 1-2 (confirmations
delivered as the stored type; `weight: significant | sliver` on every segment;
A44 bases are no-chapter-number / another space / re-shown pages, never
'behind'). Files: `<series>-w3.json` in `out/`. rurouni-kenshin 95 is NOT a
target: wave 2 proved the flag an R20 index-join artefact (AFG's page is the
TV series only; our row 95 is the OVA) — pinned T6, the missing TV ep 95 is an
identity fork for Sean.
