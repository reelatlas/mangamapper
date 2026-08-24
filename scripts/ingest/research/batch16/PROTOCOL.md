# mangaMapper research batch 16 — agent protocol (reorder-hole closure)

You are producing episode→manga-chapter records for ONE anime series. Your output is DATA that will be applied to a database by a script; be exact, cite everything, and never guess.

## The batch-16 mission

Every target episode in your task is a **reorder hole**: it sits inside a
reorder crossing (the surrounding episodes air chapters out of manga order)
and has NO exact record, so its position cannot be derived from neighbors —
interpolation is forbidden there. Your job, per target episode, is exactly
one of:

1. **Full record** (strongly preferred for holes): END chapter, its OWN
   START chapter, complete chapters_adapted list, volume, continue point
   where it differs from end+1. Non-monotonic values are LEGAL and rendered
   as stored — record the honest values, never launder a reorder into
   monotonic numbers.
2. **zone_level_only verdict**: after real research you can bound the episode
   only at zone level (page-level interleaving no source documents,
   per-episode splits nowhere stated). Say what you tried, what the best
   zone-level bound is, and what source would settle it if it exists. This is
   a legitimate verdict — an acknowledged-approximate row beats a guessed
   anchor.

## Read first
1. Your series context file (path given in your task): entry facts, OUR episode numbering (cumulative across seasons — the numbering you must output), existing anchors/annotations, volume boundaries, episode rows, open flags.
2. The prior-batch verdict your ask names (`scripts/ingest/research/batch15/out/<id>.json` and/or `batch14/out/<id>.json`) — it records the adjacent exact records, the source landscape that worked, and discredited sources. Do NOT contradict applied prior records; fill only your target episodes (if you find an applied record is WRONG, that is a `repairs` entry with evidence, never a silent overwrite).
3. This protocol.

## Rules that bind your output (Sean's rulings, 2026-08-24)
- **Anchors are position instruments on CANON content.** An episode that is
  actually filler or anime-only-canon must NOT get an anchor — deliver a
  `type_corrections` entry (≥2 sources) instead; borrowed cameo/sliver scenes
  (≤~5 pages) go in annotation facts, never as anchors or chapter numbers.
- **END = last mainline chapter in RUNNING ORDER** (the last chapter the
  episode adapts as its main content, not the numerically largest).
- **Continue point = the reader's honest resume position** — in reorder zones
  this often differs from END+1 (mid-chapter ending → the chapter itself;
  skips/grafts → the earliest not-yet-adapted-but-will-be mainline chapter).
  Deliver honest continue points; the apply layer stamps parity metadata.
- **Spinoff/bonus chapters** are labeled inside chapters_adapted (e.g.
  "Kanna ch 3", "omake 85.5") — never converted into mainline numbers.
- **Finales anchor to what they adapt**, never inflated to the furthest
  chapter the series touched.

## What to research (per target episode)
- END chapter: the last mainline chapter the episode adapts (running order).
- START chapter: the FIRST chapter animated in the episode. Majority rule: if the episode opens by finishing the tail pages of the previous chapter, START is the first FULL chapter unless the tail is the bulk of the episode; when a source states page splits, record them in chapters_adapted (e.g. "49 (p.2-18), 50-51").
- chapters_adapted: the COMPLETE in-order list of chapters the episode adapts, canonical serialization "63-64, 67" (non-contiguous and out-of-order allowed; include bonus/x.5 chapters labeled).
- volume: the volume of the END chapter (use the boundaries in the context file; if none, from Wikipedia's chapter list).
- continue point: where a reader RESUMES after the episode when it differs from end+1.
- annotations: if your research shows a stored zone annotation's boundaries or chapter set are wrong, say so in `annotation_updates`.
- type corrections: episodes our rows type as canon/mixed that are actually anime-original or filler (or vice versa) per ≥2 sources.
- repairs: if an EXISTING anchor in the context file is wrong, say so explicitly with evidence (old vs new). Never silently contradict stored data.

## Sources (≥2 independent sources per anchor, with URLs)
- Fandom wikis: fetch via the MediaWiki API, NOT the HTML pages (Cloudflare blocks them): `https://<wiki>.fandom.com/api.php?action=parse&page=<Page_Title>&prop=wikitext&format=json` (episode pages usually have "Manga counterpart"/"Chapters" fields; chapter pages have "Anime episode" — the REVERSE mapping is a strong cross-check; for interleaved zones the chapter-side reverse map is often the ONLY per-episode source — walk every chapter page in the zone).
- animefillerguide.com (chapter tables), animefillerlist.com (types), Wikipedia episode lists + chapter lists (volume boundaries; episode titles that equal chapter titles are strong evidence), "where to continue the manga after episode N" threads/articles (reddit, CBR, ScreenRant, GameRant, Dexerto, TheReviewGeek, ButWhyTho, leisurebyte, WDTALO), MAL episode discussion threads (manga readers post exact chapters), ja.wikipedia (episode tables sometimes carry manga columns).
- Fan mapping threads and instant answers / content-farm episode pages (Google AI snippets, animeoshi-class sites) are cross-check inputs, NEVER sole truth — both were concretely discredited this project. Two agreeing citations beat one instant answer. animefillerguide often shares lineage with fandom — corroborate key boundaries with a genuinely independent third source.
- Numbering: sources number per-season or count OVAs/specials; convert to OUR cumulative numbering (the context file lists our components and episode rows). State every conversion you applied.

## Confidence
- high: 2+ independent sources agree on the exact chapter.
- medium: single strong source, or event-level derivation; still include (interpolation is worse), but mark it.
- If sources disagree, research until resolved; if unresolved, include the better-supported value, mark medium, and add a flags_for_sean entry describing the disagreement with links.

## Operational
- Use a per-task subdirectory under the scratchpad for any temp files (other agents share the scratchpad — filename collisions have corrupted work before).
- macOS: BSD sed (no GNU `-n "N,+Np"`), fetch fandom via the API not HTML.

## Output — write ONE JSON file to the path given in your task, exactly this shape
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
Every target episode in your task MUST appear in either `anchors` or `zone_level_only` (`anchors` with start_chapter strongly preferred — these are holes).

## Finish
Return (as your final message) a 5-10 line summary: targets promoted vs zone-level (counts), confidence mix, repairs, unresolved items. The JSON file is the deliverable — make sure it is written and valid JSON before you finish.
