# mangaMapper research batch 17 — agent protocol (gap tier: anchor coverage)

You are producing episode→manga-chapter anchors for ONE anime series (some tasks bundle 2-4 small series — then ONE output JSON per series). Your output is DATA applied to a database by a script; be exact, cite everything, never guess.

## The batch-17 mission

Your series is in the `anchor_gap_research` class: a stretch of canon/mixed
episodes has NO anchors, so the mapping interpolates blind (or renders
pending). Your job is ANCHOR COVERAGE across the target range — not
necessarily every episode:

- **Density rule**: every canon/mixed episode when sources state it cheaply
  (a wiki with per-episode chapter fields = take them all); otherwise at
  least every arc/season boundary and every 3-5 episodes, all with honest
  confidence. For VERY long series (100+ episode targets) a checkpoint
  lattice is acceptable: every arc boundary + every ~10 episodes, densest
  where the adaptation is non-linear.
- Season/arc BOUNDARY anchors are the most load-bearing — get those exact
  (first/last episode of each season: END + START + volume).
- If the range turns out to be heavily anime-original or divergent, say so:
  type_corrections (≥2 sources) and/or a `loose_parallel`/`divergence`
  annotation are better deliverables than fabricated anchors.

## Read first
1. Your series context file (path given in your task): entry facts, OUR episode numbering (cumulative across seasons — the numbering you must output), existing anchors/annotations, Wikipedia volume boundaries, episode rows (titles help correlate), open flags.
2. This protocol.

## Rules that bind your output (Sean's rulings, 2026-08-24)
- **Anchors are position instruments on CANON content.** Filler/anime-only
  episodes never get anchors — deliver `type_corrections` (≥2 sources)
  instead; cameo/sliver borrowings (≤~5 pages) go in annotation facts only.
- **END = last mainline chapter in RUNNING ORDER**; START = first chapter
  animated (majority rule: a leading tail of the previous chapter counts
  only when it's the bulk; page splits recorded in chapters_adapted).
- **Chapter-NUMBER space only**: use the chapter numbering that matches the
  manga's last chapter NUMBER (MU/fandom numbering), never a count that
  includes mid-run specials/oneshots. If your source's numbering differs
  from the context file's chapter space, state the conversion.
- **Continue point** = the reader's honest resume where it differs from
  END+1, per Sean's C2/C3 regimes (2026-08-25, §10):
  - mid-chapter ending → the straddled chapter itself (C1);
  - skipped material the anime WILL cover in known later episodes →
    PARITY: continue at the next episode's start (the reader stays in
    step with the anime), noting any already-covered later chapter to
    skip on arrival;
  - skips never covered / future unknown → furthest-covered + 1, with
    the skip range noted for context.
  Chapter RE-USE across episodes is listed as true data everywhere it
  occurs but never moves position — only furthest first-time coverage
  does.
- **Spinoff/bonus chapters** are labeled inside chapters_adapted (e.g.
  "omake 85.5", "Gaiden 3"), never converted to mainline numbers.
- **Finales anchor to what they adapt**, never inflated to the furthest
  chapter touched.

## What to research (per anchored episode)
- END chapter, START chapter, chapters_adapted (complete in-order list),
  volume (context file's boundaries; else Wikipedia's chapter list),
  continue point where ≠ END+1.
- annotations for non-linear facts: kind ∈ rearranged | graft | partial | divergence | side_story | loose_parallel | abridged, with chapters + one-line why.
- type corrections: mis-typed episodes per ≥2 sources.
- repairs: if an EXISTING anchor in the context file is wrong, say so with evidence (old vs new). Never silently contradict stored data. (Apply-script contract, 2026-08-24 hikaru lesson: an applied repair on a derivation-tier row — mu/afg/afg-continua — must flip the row's source to `manual`, or the source's next wipe-and-re-derive erases the repair.)

## Sources (≥2 independent sources per anchor, with URLs)
- Fandom wikis via the MediaWiki API, NOT HTML (Cloudflare): `https://<wiki>.fandom.com/api.php?action=parse&page=<Page_Title>&prop=wikitext&format=json`. Episode pages carry "Manga counterpart"/"Chapters" fields; chapter pages carry the REVERSE mapping — a strong cross-check, and for some series the only per-episode source (walk the chapter pages).
- animefillerguide.com (chapter tables), animefillerlist.com (types), Wikipedia episode + chapter lists (episode titles equal to chapter titles = strong evidence), "where to continue the manga after episode N" articles/threads (reddit, CBR, ScreenRant, GameRant, Dexerto, TheReviewGeek, ButWhyTho, WDTALO), MAL episode discussion threads, ja.wikipedia episode tables (sometimes carry manga columns).
- Instant answers and content-farm episode pages are cross-check only, NEVER sole truth (the Oshi no Ko rule; Google-AI and animeoshi were both concretely discredited on this project). animefillerguide often shares lineage with fandom — corroborate key boundaries with a genuinely independent third source.
- Numbering: sources number per-season or count OVAs/specials; convert to OUR cumulative numbering (context file lists components + episode rows). State every conversion.

## Confidence
- high: 2+ independent sources agree on the exact chapter.
- medium: single strong source, or arc-span derivation; still include (interpolation is worse), marked honestly.
- Disagreements: research until resolved; unresolved → better-supported value, medium, flags_for_sean entry with links.

## Operational
- Use a per-task subdirectory under the scratchpad for temp files (agents share the scratchpad; collisions have corrupted work).
- macOS: BSD sed; fandom via API not HTML.

## Output — ONE JSON file PER SERIES to the path given in your task, exactly this shape
{
  "series_id": "<id>",
  "summary": "3-6 sentences: what the range adapts, structure findings, anything surprising",
  "anchors": [
    {"episode": 45, "end_chapter": 83, "start_chapter": 82, "chapters_adapted": "82-83", "volume": 10,
     "confidence": "high", "note": "why/what — one line", "sources": ["url", "url"]}
  ],
  "continue_points": [{"episode": 21, "continue_chapter": 71, "note": "ends p.3 of ch 71"}],
  "annotations": [{"episodes": [80, 87], "kind": "rearranged", "chapters": "123", "note": "first half relocated to ep 87 cold open"}],
  "type_corrections": [{"episodes": [22, 23], "type": "anime-only-canon", "note": "...", "sources": ["url"]}],
  "repairs": [{"episode": 24, "field": "end_chapter", "old": 196, "new": 99, "why": "...", "sources": ["url"]}],
  "structure": {"notes": "season/count/numbering findings; where order-only OVAs/movies sit", "order_only": []},
  "flags_for_sean": ["unresolved disagreement: ..."]
}
Types allowed in type_corrections: canon | mixed | filler | anime-only-canon.

## Finish
Return (as your final message) a 5-10 line summary: anchors produced (count, range), confidence mix, repairs, structure findings, unresolved items. The JSON file(s) are the deliverable — written and valid before you finish.
