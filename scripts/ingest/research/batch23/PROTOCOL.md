# Batch 23 — research protocol (pinned per wave, R31)

The VOCABULARY lives in `.claude/agents/research-agent.md` (the three standings,
the annotation kinds incl. `recap` / `unverified` / `chain_source` / `side_source`,
THE SLIVER CLAUSE and its per-segment weights, A44's bases, C5's covered-or-not
continue test, T26 — a licence is not adoption, the traps). This file pins only
the task shape, the output JSON (unchanged from batch 21: series_id, summary,
anchors, continue_points, anchor_hostile, annotations, repairs,
type_corrections, structure, flags_for_sean) and the wave's asks. Rules by id.
Shape rules that have cost a re-run: `type_corrections[].episodes` is a LIST;
every type_correction and anchor carries ≥ 2 `sources` (R3); `chapters` is a
chapter list, never prose; a chain_source / side_source `chapters` STARTS with
the work label (I41 — the write gate refuses one without it); repairs are
`{episode, target, kind?, field, old, new, why, sources}`; a summary that says
'no anchor' about one row names the OTHER rows' anchors in the same sentence
(the R25 scan). THE FORK IS NOT A PREMISE: when an ask names a row by its
relation to stored data, the stored endpoint may be the error — deliver
whichever the pages prove.

Wave 1 = **the refuted-pin wave** (planned 2026-09-05 at the batch-22 close;
NOT yet dispatched — Sean's go). Four asks, lane C: (1) record-of-ragnarok's
round-grain map (12, 18-41) → `record-of-ragnarok-w1.json`; (2) eyeshield-21
54-57 (ep 54's END 111 refuted; ep 57's own anchor) → `eyeshield-21-w1.json`;
(3) sailor-moon 73-77 (Act 18's home; the N35 shape for the 60-act renewal
space) → `sailor-moon-w1.json`; (4) beelzebub 59 (the stale finale note) →
`beelzebub-w1.json`.

**Dispatched 2026-09-07 (Sean's go, with Cursor: 'batch 23 wave 1 — the actual
RoK map and the other three refuted pins').** The RoK ask was REFRESHED before
dispatch: since it was written (2026-09-05) the afg sweep (§12.156) rebuilt a
derivation-tier anchor on every row 18-41 and the four finale STARTs / spans on
22 / 27 / 33 / 38 were nulled under A14 (§12.157) — the ask now names the
stored state as the anchor table, the afg tier as one lineage to check, the
four nulls as gaps to fill, and the healer's stale parity continues on 21 / 26
/ 32 / 37 as values to replace. AniList's API has been down since 2026-09-06:
every context carries the STAGED facts and says so — never guess a date, a
count or an id from memory. Verification (R23 by the count, Sean 2026-09-07):
the RoK verdict gets `verdict-verifier` on a DIFFERENT model (R24) — every
anchor, the repairs, the afg confirmations; the three narrow verdicts only on a
structure surprise (a reorder, a repair contradicting stored data, a retype).
Reports: `verify/w1-<series>.md`. Files: `out/<series>-w1.json`.

**After the wave landed (2026-09-07): `C2` was amended — the continue is the coverage walk (open the book here), not parity.** The four verdicts' `continue_points` were delivered under the parity rule; the apply lands anchors and annotations and lets the coverage healer derive every continue (eyeshield 54 → 111 not 112; 57 → 115 not 116; RoK's parities become END + 1, derived). A verdict continue survives only as a curated fact where it carries pages the walk cannot see.
