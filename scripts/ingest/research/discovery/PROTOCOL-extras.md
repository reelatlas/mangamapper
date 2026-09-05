# mangaMapper research — THE RELATED-WORKS PROTOCOL (I45's ruling layer; Sean ruled 2026-09-05)

You are producing a verdict about ONE related work — a film, OVA, special or compilation
— of ONE mangaMapper series (the OWNER), or, in TRIAGE mode, about every held work of one
owner. Your output is DATA: it lands in `lib/rulings/related-works.ts` as a ruling (a
standing, the chapters adapted, a position) that the ledger writer stores and the census
checks. The same bar as every batch: `R1` nothing reaches Sean unresearched, `R3` two
independent sources per claim, cited.

## The mission

The related-works ledger (`I45`) lists every recap, special, OVA and film of every series
we hold, with a standing where a RULE can decide it (a recap, an original, a crossover →
filler) and PENDING where only research can: the work adapts the owner's own instrument
(`same_instrument`) or AniList names no chapters at all (`held`). Your job:

- **PER WORK** (the same-instrument programme, decision (b)): the standing under the T28
  bar, the CHAPTERS the work adapts in the owner's instrument (its manga or novel, in the
  numbering the owner's chapter space uses), and whether the derived POSITION in the run
  is right (after which episode a viewer should watch it).
- **PER OWNER** (the triage, decision (c)): of the owner's held works, which adapt the
  instrument's chapters AT ALL. Yes → the work joins the per-work programme; no → an
  original, filler by ruling with your citation; unclear → say so.

## Read first
1. Your context file (path in your task): the owner's source kind and chapter space, the
   stored ledger row (position, kind, standing, note), the episode grid around the
   position with its anchors, the work's AniList facts and relations, any existing ruling.
2. This protocol. The vocabulary (standings, the materiality bar, the traps) is the
   `research-agent` definition's — unchanged.

## Rules that bind your output
- **Standing is relative to THE OWNER's instrument** (`T25` / `T27`): `canon` = the work
  adapts the owner's manga / novel chapters (or a chain work of it, `I41`); `mixed` = a
  substantial share is the instrument and a substantial share is not (`T28` — ask "what
  is this work's job?"); `filler` = zero standing in the instrument: an original story, a
  recap with nothing new, a promotional short. A film the author wrote that the source
  LATER adopted (Battle of Gods → the DBS manga) is `filler` here with an `adopted` note —
  the adoption is the SERIES' fact (`T26`), never this row's standing.
- **A recap is filler** (`N8`) even when it re-cuts canon episodes; say `recap: true` and
  name what it compiles. New footage with source content inside a recap → `mixed`, and
  say which chapters.
- **Chapters are the owner's units.** Cite the printed chapter numbers of the OWNER's
  instrument (the context names it and its numbering space); a work adapting a
  different run (a spin-off manga, a side novel) is NOT canon here — say which run and
  stop (`other_instrument` is a separate decision, (d)).
- **No anchors, no numbering.** A related work never becomes an episode row (`N4` / `N8`).
  The position is a fraction between episodes (26.5 = after episode 26): CONFIRM the
  derived one or CORRECT it with the reason (a film set between S1 and S2 sits after the
  S1 finale even if it aired during S2).
- **Repairs**: if the stored kind (movie / ova / special / recap), title or date is wrong,
  say so with old / new and evidence. Never silently contradict stored data.
- **Overlap never proves filler** (the zatch-bell lesson): a film retelling adapted
  chapters with new material is `mixed` or `canon`; `filler` only when nothing of the
  instrument is in it.

## Sources (2+ independent per verdict, with URLs)
- The owner's fandom wiki via the MediaWiki API (`api.php?action=parse&page=…&prop=wikitext`),
  never HTML: film / OVA pages carry "Manga counterpart", "Adapted chapters", "Setting".
- Japanese Wikipedia (`ja.wikipedia.org/w/api.php`) for 原作 / 収録 chapter statements;
  the official site or Jump / Kodansha announcements for "adapts volumes X-Y".
- AniList / MAL for the facts already in the context (format, date, source tag) — they are
  the STARTING PRINCIPLE that put the work in this programme, never the verdict.
- Instant answers, AI summaries and content farms are cross-check only.

## Confidence
`high` = two sources name the same chapters / the same standing; `medium` = one strong
source plus consistent secondary evidence; `low` = inference — say what would settle it.

## Traps
- AniList's `source: MANGA` on a franchise film is a franchise tag, not a chapter claim —
  most such films are originals; do not infer canon from the tag.
- A novelization or comicalization released AFTER the work is an adaptation OF it, never
  its source (the edge on AniList reads "ADAPTATION" both ways).
- A volume-split novel on AniList (Haruhi) lists one node per volume — the owner's
  instrument is the whole novel; a per-volume node IS the instrument.
- Compilation films ("Episode of …", "Recap", 総集編) that add an epilogue: the epilogue
  may adapt a chapter — say which; the film stays kind `recap`.

## Operational
- Use the per-task scratchpad subdirectory given in your task. macOS: BSD sed. Fandom via
  API, not HTML. Do not touch the database or any repo file except your verdict JSON.

## Output — PER WORK: one JSON file per (owner, work) at the path in your task
```json
{
  "series_id": "demon-slayer-kimetsu-no-yaiba",
  "anilist_id": 112151,
  "title": "Demon Slayer -Kimetsu no Yaiba- The Movie: Mugen Train",
  "summary": "3-6 sentences: what the work is, what the sources say it adapts, anything surprising",
  "standing": "canon",
  "confidence": "high",
  "chapters_adapted": [{ "start": 54, "end": 69, "note": "vols 7-8; the Enmu / Akaza arc — one line" }],
  "recap": false,
  "position": { "stored": 26.5, "verdict": "confirmed", "proposed": 26.5, "why": "directly after S1 ep 26; S2 ep 1-7 retell it" },
  "adopted": null,
  "repairs": [],
  "sources": ["url", "url"],
  "flags_for_sean": []
}
```
`standing` ∈ canon | mixed | filler; `chapters_adapted` is `[]` when filler; `adopted` is
`null` or `{ "basis": "author | studio | community", "note": "…" }` (a note for the
sitting, never a standing); `position.verdict` ∈ confirmed | corrected.

## Output — TRIAGE: one JSON file per OWNER at the path in your task
```json
{
  "series_id": "dragon-ball-z",
  "summary": "3-6 sentences: the shelf, what adapts chapters, the pattern",
  "works": [
    { "anilist_id": 901, "title": "Dragon Ball Z: Broly - The Legendary Super Saiyan", "adapts_chapters": "no", "chapters": null, "why": "original screenplay (Takao Koyama); no manga counterpart — one line", "sources": ["url", "url"] },
    { "anilist_id": 985, "title": "Dragon Ball Z: The History of Trunks", "adapts_chapters": "yes", "chapters": "the 1993 special chapter (vol 33 bonus)", "why": "…", "sources": ["url"] }
  ],
  "flags_for_sean": []
}
```
`adapts_chapters` ∈ yes | no | unclear. A `yes` joins the per-work programme; a `no` becomes
an original (filler by ruling, your citation on the entry); `unclear` stays held.

## Finish
Return (as your final message) a 5-10 line summary: the standing (or the yes / no / unclear
counts), the chapters, the position verdict, repairs, unresolved items. The JSON file is the
deliverable — written and valid before you finish.
