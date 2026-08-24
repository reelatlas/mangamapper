# mangaMapper research batch 14 — agent protocol (full-record model)

You are producing episode→manga-chapter anchors for ONE anime series. Your output is DATA that will be applied to a database by a script; be exact, cite everything, and never guess.

## Read first
1. Your series context file (path given in your task). It holds our entry facts, OUR episode numbering (cumulative across seasons — this is the numbering you must output), existing anchors/annotations, Wikipedia volume boundaries (chapter→volume), the episode rows (titles help you correlate), and open flags.
2. This protocol.

## What to research (per episode in the target range, for canon/mixed episodes)
- END chapter: the last mainline chapter the episode adapts (the position instrument).
- START chapter: the FIRST chapter animated in the episode. Majority rule: if the episode opens by finishing the tail pages of the previous chapter, START is the first FULL chapter unless the tail is the bulk of the episode; when a source states page splits, record them in chapters_adapted (e.g. "49 (p.2-18), 50-51").
- chapters_adapted: the COMPLETE in-order list of chapters the episode adapts, canonical serialization "63-64, 67" (non-contiguous and out-of-order allowed; include bonus/x.5 chapters).
- volume: the volume of the END chapter (use the boundaries in the context file; if none, from Wikipedia's chapter list).
- continue point: where a reader RESUMES after the episode when it differs from end+1 (mid-chapter ending → the chapter itself; skips/grafts → the honest resume chapter).
- annotations for non-linear facts: kind ∈ rearranged | graft | partial | divergence | side_story | loose_parallel | abridged, with the chapters involved and a one-line why.
- type corrections: episodes our rows type as canon/mixed that are actually anime-original (or vice versa) per ≥2 sources.
- repairs: if an EXISTING anchor in the context file is wrong, say so explicitly with evidence (old vs new). Never silently contradict stored data.

## Sources (≥2 independent sources per anchor, with URLs)
- Fandom wikis: fetch via the MediaWiki API, NOT the HTML pages (Cloudflare blocks them): `https://<wiki>.fandom.com/api.php?action=parse&page=<Page_Title>&prop=wikitext&format=json` (episode pages usually have "Manga counterpart"/"Chapters" fields; chapter pages have "Anime episode" — the REVERSE mapping is a strong cross-check).
- animefillerguide.com (chapter tables), animefillerlist.com (types), Wikipedia episode lists + chapter lists (volume boundaries; episode titles that equal chapter titles are strong evidence), "where to continue the manga after episode N" threads/articles (reddit, CBR, ScreenRant, GameRant, Dexerto, TheReviewGeek, ButWhyTho, leisurebyte, WDTALO "where does the anime leave off").
- Fan mapping threads are cross-check inputs, never sole truth (a popular r/OshiNoKo ratio thread was systematically wrong). Two agreeing citations beat one instant answer. animefillerguide often shares lineage with fandom — corroborate key boundaries with a genuinely independent third source (title matches, volume boundaries, reviews).
- Numbering: sources number per-season or count OVAs/specials; convert to OUR cumulative numbering (the context file lists our components and episode rows). State every conversion you applied.

## Confidence
- high: 2+ independent sources agree on the exact chapter.
- medium: single strong source, or arc-span interpolation; still include (interpolation is worse), but mark it.
- If sources disagree, research until resolved; if unresolved, include the better-supported value, mark medium, and add a flags_for_sean entry describing the disagreement with links.

## Output — write ONE JSON file to the path given in your task, exactly this shape
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
  "structure": {"notes": "for stitch tasks: confirm season entries/episode counts/cumulative numbering; where order-only OVAs/movies sit in the watch order and what they adapt", "order_only": [{"anilist_id": 20670, "title": "Book of Murder", "after_anilist_id": 20606, "adapts": "chs 38-50", "note": "..."}]},
  "flags_for_sean": ["unresolved disagreement: ..."]
}
Types allowed in type_corrections: canon | mixed | filler | anime-only-canon.
Anchor density: every canon/mixed episode in the range when sources allow; otherwise at least every arc boundary and every 3-5 episodes, all marked with the honest confidence.

## Finish
Return (as your final message) a 5-10 line summary: anchors produced (count, range), confidence mix, repairs, structure findings, unresolved items. The JSON file is the deliverable — make sure it is written and valid JSON before you finish.
