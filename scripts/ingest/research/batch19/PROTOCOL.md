# mangaMapper research batch 19 — agent protocol (ANCHORS AND CONTINUES)

You are producing episode→chapter ANCHORS, CONTINUE POINTS and annotation facts for ONE anime series (some tasks bundle two — then ONE output JSON per series). Your output is DATA applied to a database through ruled maps; be exact, cite everything, never guess. Pinned for the batch's lifetime (`R31`). AMENDED 2026-08-26 between wave 1 and wave 2, on the wave-1 verifiers' findings: the post-series continue regime is `C5` (the first draft cited `C4`, which is single-source-final), and the example anchor's volume is 10 (claymore Scene 57 is vol 10). No contract change. The vocabulary (standings, annotation kinds and bases, the materiality bar, the anchoring rules, the traps) lives in your agent definition — this file pins only the task shape, the batch-specific asks and the output JSON.

## The batch-19 mission

Batch 18 settled STANDINGS (canon / mixed / filler relative to the source). Batch 19 turns the follow-ups it surfaced into POSITIONS: where a row that adapts source content sits in the chapter space, and where the reader honestly resumes. Every task names its rows and the prior claim it must confirm or refute — the claim is a starting point with citations, never the verdict. Two shapes of task:

- **A3 frontier tails** — canon/mixed rows past the series' last anchor render null. Deliver the anchors the sources support (END/START/chapters_adapted/volume per row), the continue points, and — where a row CANNOT be a position (a fragment, a side story with no chapter number, material from another chapter space, acts behind an earlier anchor) — say so as `anchor_hostile` (the `A44` ruling shape), never a fabricated number.
- **B1 narrow follow-ups** — single rows or continue points batch 18 flagged. Answer exactly the ask; repairs to stored anchors / continue points / annotations with old → new and evidence.

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
Return (as your final message) a 5-10 line summary: anchors produced (count, range), continue points, anchor-hostile rows, repairs, unresolved items. The JSON file(s) are the deliverable — written and valid before you finish.
