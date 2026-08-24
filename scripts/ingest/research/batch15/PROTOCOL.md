# mangaMapper research batch 15 — agent protocol (exact-record promotion)

You are producing episode→manga-chapter records for ONE anime series (some tasks bundle 2-4 small series — then ONE output JSON per series). Your output is DATA that will be applied to a database by a script; be exact, cite everything, and never guess.

## The batch-15 mission (different from a gap batch)

Every target episode in your task is already KNOWN to be non-linear: it sits in a
rearranged/graft zone (an `episode_annotations` row records the zone), is a
reorder hole (inside a reorder crossing with no exact record), or was flagged in
a prior batch's review notes. Zone-level knowledge exists; interpolation is
forbidden there. Your job is to PROMOTE each target episode to an EXACT
per-episode record — or to establish, explicitly and with evidence, that only
zone-level knowledge exists.

Per target episode, exactly one of:
1. **Full record** (preferred): END chapter, START chapter, complete
   chapters_adapted list, volume, continue point where it differs from end+1.
   Non-monotonic values are LEGAL and rendered as stored — record the honest
   values, never launder a reorder into monotonic numbers.
2. **zone_level_only verdict**: after real research you can bound the episode
   only at zone level (page-level interleaving no source documents, per-episode
   splits nowhere stated). Say what you tried, what the best zone-level bound
   is, and what source would settle it if it exists. This is a legitimate
   verdict — an acknowledged-approximate row beats a guessed anchor.

Reorder-hole episodes (marked HOLE in the ask) additionally NEED their own
start_chapter — the verifier flags them precisely because their position inside
a reorder crossing cannot be derived from neighbors.

## Read first
1. Your series context file (path given in your task): entry facts, OUR episode numbering (cumulative across seasons — the numbering you must output), existing anchors/annotations (the zone annotations that define your targets are here), Wikipedia volume boundaries, episode rows (titles help correlate), open flags.
2. This protocol.
3. If the ask references prior batch review notes, the full text is in the repo verdict JSON it names (`scripts/ingest/research/batch14/out/<id>.json`, field `flags_for_sean`) — your task quotes the relevant items.

## What to research (per target episode)
- END chapter: the last mainline chapter the episode adapts (the position instrument).
- START chapter: the FIRST chapter animated in the episode. Majority rule: if the episode opens by finishing the tail pages of the previous chapter, START is the first FULL chapter unless the tail is the bulk of the episode; when a source states page splits, record them in chapters_adapted (e.g. "49 (p.2-18), 50-51").
- chapters_adapted: the COMPLETE in-order list of chapters the episode adapts, canonical serialization "63-64, 67" (non-contiguous and out-of-order allowed; include bonus/x.5 chapters).
- volume: the volume of the END chapter (use the boundaries in the context file; if none, from Wikipedia's chapter list).
- continue point: where a reader RESUMES after the episode when it differs from end+1 (mid-chapter ending → the chapter itself; skips/grafts → the honest resume chapter). In reorder zones the continue point is the reader's honest mainline position, which often differs from END.
- annotations: keep/refine the zone annotation — if your research shows the zone boundaries or chapter set were wrong, say so in `annotation_updates`.
- type corrections: episodes our rows type as canon/mixed that are actually anime-original (or vice versa) per ≥2 sources.
- repairs: if an EXISTING anchor in the context file is wrong, say so explicitly with evidence (old vs new). Never silently contradict stored data.

## Sources (≥2 independent sources per anchor, with URLs)
- Fandom wikis: fetch via the MediaWiki API, NOT the HTML pages (Cloudflare blocks them): `https://<wiki>.fandom.com/api.php?action=parse&page=<Page_Title>&prop=wikitext&format=json` (episode pages usually have "Manga counterpart"/"Chapters" fields; chapter pages have "Anime episode" — the REVERSE mapping is a strong cross-check; for interleaved zones the chapter-side reverse map is often the ONLY per-episode source — walk every chapter page in the zone).
- animefillerguide.com (chapter tables), animefillerlist.com (types), Wikipedia episode lists + chapter lists (volume boundaries; episode titles that equal chapter titles are strong evidence), "where to continue the manga after episode N" threads/articles (reddit, CBR, ScreenRant, GameRant, Dexerto, TheReviewGeek, ButWhyTho, leisurebyte, WDTALO "where does the anime leave off"), MAL episode discussion threads (manga readers post exact chapters), ja.wikipedia (episode tables sometimes carry manga columns).
- Fan mapping threads are cross-check inputs, never sole truth (a popular r/OshiNoKo ratio thread was systematically wrong). Two agreeing citations beat one instant answer. animefillerguide often shares lineage with fandom — corroborate key boundaries with a genuinely independent third source (title matches, volume boundaries, reviews).
- Numbering: sources number per-season or count OVAs/specials; convert to OUR cumulative numbering (the context file lists our components and episode rows). State every conversion you applied.

## Confidence
- high: 2+ independent sources agree on the exact chapter.
- medium: single strong source, or event-level derivation; still include (interpolation is worse), but mark it.
- If sources disagree, research until resolved; if unresolved, include the better-supported value, mark medium, and add a flags_for_sean entry describing the disagreement with links.

## Output — write ONE JSON file PER SERIES to the path given in your task, exactly this shape
{
  "series_id": "<id>",
  "summary": "3-6 sentences: what you resolved, what stayed zone-level, anything surprising",
  "anchors": [
    {"episode": 45, "end_chapter": 83, "start_chapter": 82, "chapters_adapted": "82-83", "volume": 10,
     "confidence": "high", "note": "why/what — one line", "sources": ["url", "url"]}
  ],
  "zone_level_only": [
    {"episode": 37, "zone": "chs 98-112", "best_bound": "ep 37 draws from 101-105 + 111 fragments", "tried": "fandom reverse map has no per-episode split for 37; MAL thread silent", "sources": ["url"]}
  ],
  "continue_points": [{"episode": 21, "continue_chapter": 71, "note": "ends p.3 of ch 71"}],
  "annotation_updates": [{"episodes": [80, 87], "kind": "rearranged", "chapters": "123", "note": "corrected zone facts — only when your research changes the stored annotation"}],
  "type_corrections": [{"episodes": [22, 23], "type": "anime-only-canon", "note": "...", "sources": ["url"]}],
  "repairs": [{"episode": 24, "field": "end_chapter", "old": 196, "new": 99, "why": "...", "sources": ["url"]}],
  "flags_for_sean": ["unresolved disagreement: ..."]
}
Types allowed in type_corrections: canon | mixed | filler | anime-only-canon.
Every target episode in your task MUST appear in either `anchors` or `zone_level_only` (holes: `anchors` strongly preferred, and with start_chapter).

## Finish
Return (as your final message) a 5-10 line summary: targets promoted vs zone-level (counts), confidence mix, repairs, unresolved items. The JSON file(s) are the deliverable — make sure each is written and valid JSON before you finish.
