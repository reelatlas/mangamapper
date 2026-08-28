# mangaMapper research batch 20 — agent protocol (THE HONEST TERMINAL)

You are producing episode→chapter ANCHORS, CONTINUE POINTS and annotation facts for ONE anime series (some tasks bundle two — then ONE output JSON per series). Your output is DATA applied to a database through ruled maps; be exact, cite everything, never guess. Pinned for the batch's lifetime (`R31`). AMENDED 2026-08-26 between wave 1 and wave 2, on the wave-1 verifiers' findings: the post-series continue regime is `C5` (the first draft cited `C4`, which is single-source-final), and the example anchor's volume is 10 (claymore Scene 57 is vol 10). No contract change. AMENDED 2026-08-27 between wave 1 and wave 2 (Sean's go on lane A2): the wave-2 mission section below is ADDED — the gap-block anchoring shape (batch 19's) — and nothing else moves; the rules, the sources bar, the confidence vocabulary and the output JSON are unchanged. No contract change. (standings, annotation kinds and bases, the materiality bar, the anchoring rules, the traps) lives in your agent definition — this file pins only the task shape, the batch-specific asks and the output JSON.

## The batch-20 mission (wave 1 — lane A1, the seven G36 refusals)

MangaUpdates' "anime coverage" field pins the manga chapter the anime reached — but on these series the pin lands on a FILLER row (an anime-original ending or block), which `A1` forbids as an anchor and `G36` refuses on every run. Your job is the HONEST TERMINAL (`G56`): the last canon/mixed row of the run and the exact chapter it reaches (END, START, chapters_adapted, volume — an anchor with ≥ 2 sources), the post-series continue (`C5`: coverage + 1, or the straddled chapter under `C1`), and a plain statement of whether MU's chapter is actually reached by that row (then the pin is REDUNDANT — G56 covers it) or overstated / in another edition's numbering (then say what MU counted — `G37`). Never anchor a filler row; if a filler-typed row in fact adapts source pages, propose the type repair with ≥ 2 sources (`T28`). Two of the seven (toriko, gto) also carry an EDITION question: MU's chapter numbering diverges >20% from AniList's count — state which numbering is the reading edition (the one our stored anchors and the fandom use) and put the terminal in THAT space.

Pinned rulings you inherit (cite the ids): **"pages, not numbers"** (Sean 2026-08-27) — new pages of a chapter airing for the first time are a real position even when the chapter's number was already an END (anchor + `rearranged`); re-shown pages are never cited; a first-time SLIVER inside an original plot is `A44` position-less. **Continue vocabulary** (`C2`/`C5`): when the anime WILL cover skipped material in known later episodes, continue = the next episode's START (parity) with the unseen range in the note; after the finale, coverage + 1 (`post_series`); a mid-chapter ending continues IN the straddled chapter (`C1`). The apply layer marks every continue you deliver as curated (`C7`) — write the note as the reader's instruction, not as a derivation.

- **A1 honest terminals** — the seven series above; one JSON per series; every TARGET row appears in anchors, anchor_hostile, or a stated A1 reason in summary.

## The batch-20 mission (wave 2 — lane A2, the small gap blocks)

The census class `anchor_gap_research` lists runs of canon/mixed rows with NO anchor between two stored anchors — a reader inside the run is shown a position derived by interpolation, which is a plausible guess, not a truth. Your job is the block: for EVERY canon/mixed target row deliver an anchor (END / START / chapters_adapted / volume, ≥ 2 sources, `A4`/`A10`; "pages, not numbers") or an `anchor_hostile` entry with the reason (`A44` shape: a fragment, a side story with no chapter number, another chapter space, acts behind an earlier anchor). Filler-typed rows inside the block take nothing (`A1`) — do not research them beyond confirming the type; if a filler-typed row in fact adapts source pages, propose the type repair (≥ 2 sources, `T28`). Continue points where the block's rows skip source material (`C2`/`C3` parity with the unseen range in the note) or end MID-CHAPTER (`C1` — ANY mid-chapter ending continues in the straddled chapter, a plain chapter straddle included; AMENDED at capture 2026-08-27, Sean: the ledger's C1 wins over this file's earlier "filler boundary" wording) — a row that ends on a chapter's last page needs none. The block's two bracketing stored anchors are your fence: a delivered END must sit between them in running order unless you REPAIR one of them with evidence (old → new, `A4`). One series carries an IDENTITY ask first (naruto-shippuden: which rows adapt which licensed NOVEL — the ruled 452-457 shape is canon + `side_source` naming the work; such rows carry no chapter anchor by design and the position instrument is the continue, `C5`); its context states it.

- **A2 gap blocks** — hunter-x-hunter 79-91, saint-seiya 100-113 (inside the Asgard filler 74-99, `A1`), yu-yu-hakusho 27-43, bleach 152-165, eyeshield-21 22-36, kingdom 78-102, d-gray-man 1-50 (25 canon/mixed rows), naruto-shippuden 480-500; one JSON per series; every canon/mixed TARGET row appears in anchors or anchor_hostile.

## The batch-20 mission (wave 3 — lane C narrow follow-ups, lane B numbering & dates; ADDED 2026-08-27, no contract change)

**Lane C — narrow follow-ups.** One row or one small block each, named by the prior wave that flagged it; the prior verdict / verifier report is in your task and is a starting point with citations, never the verdict. Deliver exactly the ask: anchors (≥ 2 sources, `A4`/`A10`, "pages, not numbers") or `anchor_hostile` for the named rows, repairs with old → new, type corrections under `T28`, the continue where the ask names one (`C1`/`C2`/`C3`/`C5`). Rows outside the ask are not yours unless the ask says "series-wide". Output = the batch's JSON shape, one file per series in `out/`.

**Lane B — numbering and air dates (`N11` / `G53` / `G54`).** Output = the batch-19 B3 shape, one file per series in `out/airdates/`: `repairs` only (`field` = `air_date` or `title`, `old` / `new` / `why`, ≥ 2 sources per repair — ja-WP 各話リスト, en-WP, syobocal `cal.syoboi.jp` per-airing, the broadcaster's own archive), `flags_for_sean` for TRUE deviations (a real out-of-order broadcast is a `G54` ack, never a repair) and for numbering findings, `structure.notes` for the row-identity map. A renumbering (`N11`: AFL skips a number / prints one twice) is delivered as the explicit row → title → date table for the affected span, in OUR numbering with the AFL numbers beside it — the apply layer decides the shift. Never index-join (`R20`); join on title AND date; a day-of-week that breaks the slot is a witness, not proof (a holiday move is real).

## The batch-20 mission (wave 4 — the standing lies left by wave 3; ADDED 2026-08-27, no contract change)

Four narrow tasks. **A TYPING PASS delivers standings, never anchors**: a row whose stored type is wrong (AFL "canon" on an anime-original arc) is a `type_corrections` entry under `T28` with ≥ 2 sources and the mandatory tie annotation (`graft` / `partial` / `loose_parallel` / `divergence`) — an anchor appears only where a type repair makes a row canon/mixed WITH real first-time pages (`A4`, "pages, not numbers"). **Row identity first where our rows are bare** (TBATE S2 carries no titles or dates): deliver the row → title → air date table in `structure.notes` and put the title/date values in `repairs` (`field` = `title` / `air_date`, ≥ 2 sources) so the types land on the right rows. **Join on OUR current numbering** (shugo-chara was renumbered 2026-08-27 — the context's rows are post-resort; AFL's old 82-96 are not our 82-96). Lane B (FotNS ep 29) keeps the batch-19 B3 shape in `out/airdates/`.

## The batch-20 mission (wave 5 — DBS IDENTITY; ADDED 2026-08-28, no contract change)

**Standings and DIRECTION only — no anchors.** Dragon Ball Super's manga (Toyotarou) runs ALONGSIDE the anime: for each ARC say what adapts what (`T21` direction — the anime adapts the manga; the manga adapts the anime; both adapt Toriyama's outline / a film; the arc is anime-only), then the standing of each row RELATIVE TO THE SERIES' IDENTIFIED SOURCE (the context states it): `canon` (the source's events), `mixed`, `filler` (zero standing — an anime-original arc or episode), with the exception vocabulary as annotations (`side_source` naming the other licensed work — a film, the manga where the anime is the source; `adopted` with its basis where the manga later incorporates anime-original events — the `author` basis is Toyotarou/Toriyama writing the EVENTS into the manga, never a blanket credit; `retconned` where the manga's version overwrites the anime's; `divergence` where both tell the same beat differently). Deliver `type_corrections` (≥ 2 sources each, `T28`) and `annotations` per row or per arc (an `episodes` LIST, never a span), `structure.notes` = the arc table (arc → episode range → manga chapters → direction → the rule id), and `flags_for_sean` for the forks. **Anchors are NOT in scope** (`anchors: []`); a row that could take one later is a `flags_for_sean` note, not a number. **The recap baseline is mandatory**: every row you name — `ep N — stored: type → proposed: …` — the context prints the stored types; a block is a table.

## Read first
1. Your series context file (path in your task): source kind + chapter space, entry facts, EVERY ruling on the series (a verdict contradicting one is a REPAIR with evidence, never a silent override), all existing anchors (ep→END [START] {chapters_adapted} vol, continue), annotations grouped by fact, volume boundaries, the rows in and near the range with AFL's claim, open flags.
2. This protocol. 3. Your agent definition's anchoring vocabulary (`A1` `A2` `A10` `A12` `A13` `A44` `C1`–`C3` `C5` `N4` `R20`).

## Rules that bind your output (cite the id in notes)
- **`A1` filler rows never take anchors; `A44` a ruled position-less row never does either.** A row that looks anchorable but is typed filler → propose the type repair (≥2 sources, `T28` materiality), not an anchor.
- **END = the furthest MAINLINE chapter the episode adapts in running order (`A4`); START = the first chapter animated under the sliver rule (`A10`: a leading partial of the preceding chapter counts unless ≤5 pages or sliver / teaser / cold-open / recap / flashback; `A12` a relocated far-earlier opener is never the START).** Page splits go in `chapters_adapted`.
- **Chapter-NUMBER space only**: the manga's own chapter numbering (MU / fandom), never a count with specials, never a sequel's or sibling manga's numbering (Trigun Maximum ≠ Trigun; MKR II ≠ MKR). If the sources' numbering differs from the context's chapter space, state the conversion.
- **Continue points (`C1` `C2` `C3` `C5`)**: a mid-chapter ending continues IN the straddled chapter (`C1`); skipped material the anime covers in later known episodes → PARITY, continue at the next episode's start and note any later chapter to skip on arrival (`C2`/`C3`); after the anime's last adaptation (a studio ending, a divergence) the POST-SERIES continue is the furthest first-time coverage + 1 (`C5`; coverage per `A4`), with the never-adapted range named. (`C4` is single-source-final — not a continue regime.) Give `kind` ∈ `parity` | `post_series` per continue point. Chapter RE-USE never moves position.
- **Spinoff / bonus / side-story chapters** stay labeled inside chapters_adapted ("omake 85.5", "Scene 60 opening"), never converted to mainline numbers; a side story with no chapter number is `anchor_hostile`.
- **Repairs**: if an EXISTING anchor, continue point, annotation or type in the context is wrong, say so with old/new and evidence. Never silently contradict stored data. Repairs on `mu` / `afg` / `afg-continua` rows are re-derived by their source — the apply layer flips them to manual; you only need the evidence.
- **Standings vocabulary**: canon | mixed | filler only (`T27`); exceptions are annotations (`T26`). A row you retype must meet `T28`.

## Sources (≥2 independent per anchor, with URLs — `R3`)
- Fandom wikis via the MediaWiki API, NOT HTML: `https://<wiki>.fandom.com/api.php?action=parse&page=<Page_Title>&prop=wikitext&format=json` — episode pages ("Manga counterpart" / "Chapters" fields), chapter pages (the reverse mapping), arc pages.
- ja.wikipedia 各話リスト and per-character 原作↔アニメ tables (the ajin lesson: 巻話 ↔ 第2期N話 citations are exact), animefillerguide chapter tables, Wikipedia episode + chapter lists (title = title is strong), scene-level comparison blogs where they exist (AllYourAnime, trigunwiki), reddit / MAL "where to continue" threads as a cross-check.
- Instant answers and content farms are cross-check only, never sole truth. Join on TITLE or DATE, never on index (`R20`); state every numbering conversion.

## Confidence
- high: 2+ independent sources agree on the exact chapter. medium: one strong source, or an arc-span derivation — include it, marked. Unresolved → the better-supported value, medium, and a `flags_for_sean` entry with the links.

## Operational
- Per-task scratchpad subdirectory only (`R22`); agents share the scratchpad. macOS: BSD sed; fandom via API not HTML. Read-only: you never touch the database.

## Output — ONE JSON file PER SERIES to the path given in your task, exactly this shape
{
  "series_id": "<id>",
  "summary": "3-6 sentences: what the rows adapt, where the frontier and the honest resume sit, anything surprising",
  "anchors": [
    {"episode": 21, "end_chapter": 57, "start_chapter": 57, "chapters_adapted": "57", "volume": 10, "confidence": "high", "note": "why/what — one line, rule ids", "sources": ["url", "url"]}
  ],
  "continue_points": [
    {"episode": 23, "continue_chapter": 60, "kind": "post_series", "note": "ch 60's Last-stand section is nowhere in the anime; 60+ never adapted", "sources": ["url"]}
  ],
  "anchor_hostile": [
    {"episode": 18, "why": "adapts Trigun Maximum ch 1-2 — another chapter space (A44 shape)", "sources": ["url"]}
  ],
  "annotations": [{"episodes": [21], "kind": "divergence", "chapters": "57", "note": "close 1:1 adaptation with an inserted anime-original B-plot"}],
  "repairs": [{"episode": 13, "field": "continue_chapter", "old": 22, "new": 23, "why": "…", "sources": ["url"]}],
  "type_corrections": [{"episodes": [16], "type": "canon", "note": "…", "sources": ["url", "url"]}],
  "structure": {"notes": "count / numbering / chapter-space findings", "order_only": []},
  "flags_for_sean": ["split evidence: …"]
}
Types allowed in type_corrections: canon | mixed | filler. Annotation kinds: divergence | partial | graft | rearranged | side_story | loose_parallel | abridged | adopted (basis REQUIRED) | retconned | side_source. Continue kinds: parity | post_series. Every target row must appear in exactly one of: anchors, anchor_hostile, or a note in summary saying why it takes neither (filler under A1).

## Finish
**RECAP BASELINE (Sean 2026-08-28 — every recap, every wave):** whenever you name a row you propose to change, it is ONE LINE, stored first, then the delta — `ep N — stored: {canon|mixed|filler} [+ annotation kinds] → proposed: {same | new type | annotation change | no type change}`; the SERIES is the table's TITLE when the table covers one series (no series column); a table that mixes series carries a `series` column as its first column — either way a row is never shown without its series (Sean 2026-08-28). Your context prints every target row's stored type; use it. A block of retypes is a TABLE, never a sentence ("12 rows → filler" is not a recap); unchanged rows in the ask still get their stored type once (the baseline); identity/date-only repairs still show the stored type. The landing gate regenerates the block mechanically from the DB + your JSON (`baseline.ts`) — your lines must agree with it.

Return (as your final message) a 5-10 line summary: anchors produced (count, range), continue points, anchor-hostile rows, repairs, unresolved items. The JSON file(s) are the deliverable — written and valid before you finish.
