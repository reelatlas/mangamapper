# Batch 24 — research protocol (pinned per wave, R31)

The VOCABULARY lives in `.claude/agents/research-agent.md` (the three standings,
the annotation kinds incl. `recap` / `unverified` / `chain_source` / `side_source`,
THE SLIVER CLAUSE and its per-segment weights, A44's bases, C5's covered-or-not
continue test, T26 — a licence is not adoption, the parallel-telling clause
(I40 / T30 / A46), the traps). This file pins only the task shape, the output
JSON (unchanged from batch 21: series_id, summary, anchors, continue_points,
anchor_hostile, annotations, repairs, type_corrections, structure,
flags_for_sean) and the wave's asks. Rules by id. Shape rules that have cost a
re-run: `type_corrections[].episodes` is a LIST; every type_correction and
anchor carries ≥ 2 `sources` (R3); `chapters` is a chapter list, never prose; a
chain_source / side_source `chapters` STARTS with the work label (I41); repairs
are `{episode, target, kind?, field, old, new, why, sources}`; a summary that
says 'no anchor' about one row names the OTHER rows' anchors in the same
sentence (the R25 scan); every anchor carries `confidence: high | medium`. THE
FORK IS NOT A PREMISE: when an ask names a row by its relation to stored data,
the stored endpoint may be the error — deliver whichever the pages prove.
AniList's API has been down since 2026-09-06: every context carries the STAGED
facts and says so — never guess a date, a count or an id from memory.

## Lane T — a typed block (new in this batch)

The census class `type_default_unclassified` reads, verbatim: *the row's type is
the wiki mint's default (`canon`) and no source has typed it* — rows minted from
Wikipedia's episode table (G59 path A) for a season the AFL page does not list.
The default is OUR label, not a claim about the episode. For EVERY target row
deliver: (1) its standing under T25-T28 on ≥ 2 independent sources — a
`type_corrections` entry where the default is wrong, and where canon is
CONFIRMED say so per row in `structure.notes` (a confirmed default is a
result, never an empty verdict); (2) an anchor — END / START / chapters_adapted
/ volume, ≥ 2 sources, A4 / A10 / A47, "pages, not numbers" — or an
`anchor_hostile` entry with its A44 basis; (3) annotations for every non-source
segment (`weight: significant | sliver`); (4) a continue only where C1-C3 apply
(the block's frontier is DERIVED from the anchors, never delivered as a
post-series continue on a season that continues); (5) `repairs` for a stored
title or air_date the pages refute (old → new, ≥ 2 sources; a wiki-minted row
can be title-less — the repair's `old` is the empty string); (6)
`structure.notes` = the block's arc ↔ instrument map; `flags_for_sean` for what
only Sean can rule. Rows outside the ask are not yours. Files: `<series>-w1.json`
in `out/` (`-w1a` / `-w1b` where a series is split).

**One protocol shape lies across these three series (Sean 2026-09-07): the
instrument is stated per ask and is not the same kind twice.**

- **re-zero-starting-life-in-another-world** — a NOVEL owner (T24, source_type
  light_novel, no manga link, NO stored anchor on any of its 79 rows). Anchors
  are in LN VOLUME space: `end_chapter` / `start_chapter` carry the LN VOLUME
  number (MF文庫J 長月達平『Re:ゼロから始める異世界生活』, the tankōbon numbering),
  `volume` the same number, and `chapters_adapted` names the chapters INSIDE
  the volume as the printed table of contents numbers them (never the
  web-novel arc/chapter numbering — a different space; say which space every
  cited page uses). The arc manga (Kadokawa's per-arc comicalizations) are
  DOWNSTREAM licensed works: never the instrument, never a citation for a
  position (T24: never a fake manga position). AFL's page lists 1-50 only.
- **ace-of-the-diamond-act-ii** — a MANGA continuation: the act II manga
  (AniList 86569; 308 chapters / 34 volumes, finished) in its OWN chapter
  space (never Act I's, never a count with specials). The stored map ends at
  ep 52 → END 169 [START 166] v19 (batch 17, manual). MangaUpdates' curated
  coverage line reads "Vol 19, Chap 169 (S1) / Vol 30, Chap 259 (S2P1)" — a
  CROSS-CHECK, never a premise. No volume_boundaries are stored for 86569:
  cite the tankōbon contents for every row's volume.
- **ghost-in-the-shell-2026** — a NEW TELLING of the original manga (AniList
  31023, 士郎正宗『攻殻機動隊』 1989-91: ONE volume, 11 numbered chapters — the
  stored space) beside three other tellings that are SEPARATE series (I16:
  the 1995 film, Stand Alone Complex, Arise). THE FORK, ruled as the question
  (Sean 2026-09-07, not "default canon"): (a) an ADAPTATION with ordinary
  anchors in the 11-chapter space, page splits in `chapters_adapted`; or (b) a
  PARALLEL telling (I40: two realizations of one unpublished outline, neither
  adapting the other — proven only if the pages show it; then NO anchors:
  `anchor_hostile` per row citing I40, `correspondence` rows `{episode,
  chapters, alignment: aligned | divergent | anime_only, note, sources}` and
  `structure.source_relation: "parallel"` with the evidence); or (c) the
  OUTLAW STAR class (T21 / original: the author's spine but no episode ↔
  chapter source) — deliver whichever the pages prove. The stored titles are
  the manga's chapter titles verbatim ("Prologue + Super Spartan i", "Junk
  Jungle ii + Megatech Machine i + ii" …): EVIDENCE the pages must confirm,
  never a premise.

## Wave 1 = THE TYPING WAVE (Sean's go 2026-09-07, with Cursor)

Four asks, lane T, one agent each — the wiki-minted aired rows that render
default-canon on public pages:

1. re-zero 51-66 (season 3, Arc 5) → `re-zero-starting-life-in-another-world-w1a.json`
2. re-zero 67-79 (season 4 so far, Arc 6; row 67 is title-less; 80-85 are
   unaired and NOT rows) → `re-zero-starting-life-in-another-world-w1b.json`
3. ace-of-the-diamond-act-ii 53-65 (Second Season part 1, 2026-04-05 →
   06-28; Part 2 (213658) is announced, undated) → `ace-of-the-diamond-act-ii-w1.json`
4. ghost-in-the-shell-2026 1-9 (ep 10, the finale, airs 2026-09-08 and is
   NOT a stored row) → `ghost-in-the-shell-2026-w1.json`

Off this wave by ruling: slime 92-93, tennis 105, beyblade-x 133 (they ride
with their owners' next standing research); re-zero 1-50 (AFL-typed, never
anchored — a gap block of its own, not the typing lane).

## Verification (R23 ON — weight-bearing, not every row; Sean 2026-09-07)

`verdict-verifier` on a DIFFERENT model than the author (R24), dispatched in
halves as verdicts land. **ghost-in-the-shell-2026 gets the FULL verifier**
(every row, every citation, the fork). The other three get a verifier SCOPED
to the weight-bearing claims: the instrument / space claim (re-zero's volume
map, Ace's 169 → 170 seam and the part's endpoint against MU's 259), every
`type_corrections` entry (a retyped default renders), every `repairs` entry
(it contradicts stored data), the block's first and last anchor and one
middle row on the pages, and the mechanical R25 scan (`scan.ts`) — not a
per-row citation fetch. Reports: `verify/w1-<series>.md`.

## Wave 2 = THE RE-ZERO GAP BLOCK (Sean's go 2026-09-07: 'lets get through the rezero blocks')

Two lane-A2 asks (anchor_gap_research: 50 AFL-typed canon rows never anchored — the
block wave 1 exposed), the same instrument clause as wave 1's re-zero asks: LN
VOLUME space (T24, now live), `end_chapter` / `start_chapter` / `volume` = the LN
volume number, `chapters_adapted` = 'vN ch M' as the printed table of contents
numbers them; the web-novel part numbering and the per-arc comicalizations are
other spaces, never positions. THE TYPES STAND: every row is AFL-typed canon and
AFL is a source here (T4: advisory); a `type_corrections` entry needs T28 evidence
on ≥ 2 sources, otherwise no type change. THE FENCES: the block's upper fence is
the stored ep 51 → 16 [16] (Arc 5 opens on volume 16 whole — the wave-1 verdict);
there is no lower fence (ep 1 is the series' first row). The seam at 25 / 26 is
the two asks' shared claim (Arc 3's last volume closes S1; Arc 4 opens S2) and
must agree across the two files.

1. rows 1-25 (season 1, 2016 — Arcs 1-3) → `re-zero-starting-life-in-another-world-w2a.json`
2. rows 26-50 (season 2, 2020-21, two cours — Arc 4) → `re-zero-starting-life-in-another-world-w2b.json`

Not rows, not the ask: the 2020 Director's Cut rebroadcast (13 double-length
episodes — a re-cut, I16), the Memory Snow / Frozen Bonds OVAs (related works),
the Break Time / Break Room shorts (a companion table on the same dates — the
G59 guard's witness). Verification: R23 by the count — the S2 verdict (the denser
arc, six volumes over 25 rows with its time loops) gets a verifier; S1's only if
its verdict carries a structure surprise (a reorder, a repair contradicting
stored data, a retype).
