# mangaMapper research — THE RULED-GRID PROTOCOL (G59 path C; the step-2 rows pass, 2026-09-06)

## The mission
A series minted from a discovery declaration (I13) has NO episode rows: AFL has no page for it and the wiki finder either
finds no episode table or one that cannot be locked (a franchise-numbered OVA table, a dateless table, a page that holds two
runs). The ruled grid is the named path (G59 C): the manual writer mints rows with number / title / air date from a RULED
list the sources agree on. Your verdict IS that list. It carries NO standings, NO anchors, NO chapters — those come from the
per-episode research later (the standing programme). A grid row is a FACT about the release, never a judgment.

## Rules that bind your output
- **Two independent sources per grid (R3)**: the licensor's or studio's own episode list (the series' official site, the
  Blu-ray / DVD 収録内容, the streaming platform's listing) AND ja-WP or en-WP. A fandom wiki is a cross-check, never one
  of the two. Cite URLs.
- **Numbering is the run's OWN**: 1..N in release order of THIS series' entries (an OVA series numbered 1-7; two films are
  rows 1 and 2). Never the franchise's OVA ordinal (Lost Girls is 1-3, not 16.5 / OVA 6-8), never the TV re-cut's numbering.
  If the licensor numbers the run itself (第1話…), use that; say so.
- **Dates are ISO (yyyy-mm-dd) release / broadcast dates** of the first Japanese release of each row (a disc bundle's ship
  date for an OAD; the theatrical date for a film; the streaming premiere for an ONA). A date you cannot source stays null
  with a flag — never a guess (P6).
- **Titles**: the official English title when the licensor prints one; else the romaji; the Japanese title in `title_native`.
- **Count check**: the row count must equal AniList's episode count for the entry (given in your task); a mismatch is a
  FLAG with the reason (a bonus disc, a recap, a split), never a silent fix.
- **A table that is a re-cut of another form** (a TV re-cut of films; a compilation film of an ONA) is NOT this series'
  grid — say which page carries which run.

## Output — one JSON file per series at the path in your task
```json
{
  "series_id": "<our slug>", "anilist_id": <the entry's id>, "expected_episodes": <AniList's count>,
  "rows": [ { "number": 1, "title": "…", "title_native": "…", "air_date": "yyyy-mm-dd", "note": "optional: the disc / the platform / an alias" } ],
  "numbering_basis": "the licensor's 第1話-第7話 / release order / …",
  "sources": [ { "url": "…", "what": "…", "tier": "licensor | ja-WP | en-WP | cross-check" } ],
  "flags_for_sean": [ "…" ]
}
```
## Finish
Report the output path, one line "N rows · yyyy-mm-dd → yyyy-mm-dd · basis", and every flag.
