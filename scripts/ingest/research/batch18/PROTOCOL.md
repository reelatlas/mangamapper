# mangaMapper research batch 18 — agent protocol (standing tier: the unruled anime-canon blocks)

You are producing a STANDING verdict for a block of episodes in ONE anime series (some tasks bundle several small series — then ONE output JSON per series). Your output is DATA applied to a database by a script; be exact, cite everything, never guess. Pinned for the batch's lifetime (R31).

## The batch-18 mission

Every target row is one that animefillerlist.com calls **"anime canon"**. Under mangaMapper's model that phrase is NOT a type. Since T4.3 (rules `T25`/`T26`/`T27`, docs/rules.md) every episode has exactly one STANDING relative to the series' identified SOURCE — the work it adapts, named in the context file (`source kind`):

- `canon` — the episode adheres to the source (adapts it, or is an adopted exception — see annotations).
- `mixed` — source and non-source material in one episode.
- `filler` — ZERO standing in the source: anime-original material, recaps with nothing new, studio endings, padding. "Made for the anime" is filler unless it is ADOPTED.

There is no fourth value. Do not write `anime-only-canon`, `anime_only`, `anime canon` or `original` as a type; the apply script and the database both refuse them.

**An exception to the source is an ANNOTATION on a canon row, never a type:**

- `adopted` with a REQUIRED `basis` ∈ `author` | `studio` | `community` — material outside the source that stands as canon: the source's author wrote / supervised / declared it (`author`: Black Clover 130-157, Tabata-supervised), the studio's own material the franchise carries forward (`studio`: Evangelion's EoE), or a consensus the community holds for lack of an ending (`community`: X's only ending). The basis is the deliverable — WHO adopted it, with the citation that proves it. "Fans like it" is not a basis.
- `side_source` — the episode adapts a DIFFERENT licensed work than the series' source (Shippuden 452-457 → the Itachi Shinden novel). Name the work in the note.
- `retconned` — material later dropped from canon by the source or the studio (World Trigger 49-63).
- `divergence` / `loose_parallel` / `abridged` / `partial` / `graft` / `rearranged` / `side_story` — the research kinds from earlier batches, unchanged.

Your job per target block: for EVERY row in the block, say which standing it takes and why, with ≥2 independent sources; where the standing is `canon` by adoption, give the annotation with its basis. A block-level answer ("22-51 are all filler") is acceptable ONLY when the sources support the block as a unit — say so; where a block is mixed (some rows adapt, some don't), row by row.

## Read first
1. Your series context file (path given in your task): the series' SOURCE KIND, what standing AFL's claim would take by default under T27, the existing rulings and annotations, the target rows with titles/dates, and every anchor that brackets the block.
2. This protocol.

## Rules that bind your output
- **Standing is relative to THIS series' source.** A game-sourced series' episodes that adapt the game are `canon`; a manga-sourced series' episodes that adapt a novel are `canon` + `side_source`; a studio original's episodes are `canon` to itself (those are not in this batch).
- **Filler = zero source standing.** A studio ending that the community "accepts" is filler unless an author / studio / community basis is documented — then it is canon + `adopted{basis}` and you must cite who adopted it. Present both readings when the evidence is split; recommend one.
- **A1: filler never takes an anchor.** You are not producing anchors in this batch; if a target row turns out to ADAPT source chapters (AFL was simply wrong), say `canon` and list the chapters in `chapters` — the apply layer handles the anchor.
- **Overlap never proves filler (the zatch-bell lesson):** an episode revisiting already-adapted chapters is `mixed` or `canon` if it carries real source content, `filler` only when it rehashes with nothing new.
- **Recaps** are `filler` unless they carry new source material; note `recap` in the annotation kind field as `abridged` and say "recap" in the note (the format axis lands in T4.4).
- **Numbered specials / ep 0** — say what the entry is (OVA, special, recap) and its standing; do not renumber anything.
- **Repairs**: if stored data (a type, an annotation, an anchor) is wrong, say so with old/new and evidence. Never silently contradict stored data.

## Sources (≥2 independent per verdict, with URLs)
- Fandom wikis via the MediaWiki API, NOT HTML: `https://<wiki>.fandom.com/api.php?action=parse&page=<Page_Title>&prop=wikitext&format=json`. Episode pages carry "Manga counterpart" / "Adapted from" / "Anime-original" fields; arc pages carry canon-status statements ("this arc is anime-original", "supervised by the author").
- animefillerguide.com and animefillerlist.com are STARTING PRINCIPLES (AFL's claim is what put the row in this batch) — never the verdict on their own.
- Wikipedia episode lists (production notes: "original story by …", "supervised by …"), ja.wikipedia (often states 原作にない / アニメオリジナル explicitly and names the author's involvement), interviews / staff credits (an author credited for story = `author` basis evidence), reddit / MAL threads for community standing (a `community` basis needs more than one thread: cite the consensus, not a poster).
- Instant answers and content farms are cross-check only, never sole truth.
- Numbering: sources number per season; convert to OUR cumulative numbering (the context file lists components and rows). State every conversion.

## Confidence
- high: 2+ independent sources agree on the standing and (for adopted) the basis.
- medium: single strong source, or the basis is inferred from staff credits; say so.
- Unresolved → the better-supported reading, medium, and a `flags_for_sean` entry with the links.

## Traps carried from batches 14-17
- Two-part episodes carry two infoboxes on fandom — read both.
- Episode-table row colors are arc groupings, not canon flags.
- AFL marks whole seasons "anime canon" when the franchise had no manga at broadcast (Boruto 2-105): that is a claim about the MANGA, not about adoption — check whether the author's involvement is documented per arc.
- "Author-commissioned" is not "author-declared canon" (kinnikuman 120-137 → filler). The discriminator is declaration or supervision.
- Digital-storefront re-cut numbering, MangaDex web-UI language filter, content-farm episode pages: see batch-17 CHUNK1-RECOVERY.md §11 if you touch chapter numbers at all.

## Operational
- Use the per-task scratchpad subdirectory given in your task (agents share the scratchpad; collisions have corrupted work).
- macOS: BSD sed; fandom via API not HTML.

## Output — ONE JSON file PER SERIES to the path given in your task, exactly this shape
{
  "series_id": "<id>",
  "summary": "3-6 sentences: what the block is, what the sources say about its standing, anything surprising",
  "standings": [
    {"episodes": [22, 23, 24], "type": "filler", "confidence": "high", "note": "studio ending after the anime outran the manga — why, one line", "sources": ["url", "url"]},
    {"episodes": [34], "type": "canon", "chapters": "none", "confidence": "high", "note": "…", "sources": ["url", "url"]}
  ],
  "annotations": [
    {"episodes": [34], "kind": "adopted", "basis": "author", "note": "Watsuki's own storyboard (cite)", "sources": ["url"]},
    {"episodes": [452, 453], "kind": "side_source", "note": "adapts the Itachi Shinden novel", "sources": ["url"]}
  ],
  "repairs": [{"episode": 44, "field": "type", "old": "filler", "new": "canon", "why": "…", "sources": ["url"]}],
  "structure": {"notes": "season/count/numbering findings; what an ep 0 / special IS", "order_only": []},
  "flags_for_sean": ["split evidence: …"]
}
Types allowed in standings: canon | mixed | filler. Annotation kinds allowed: adopted (basis REQUIRED: author | studio | community) | side_source | retconned | divergence | loose_parallel | abridged | partial | graft | rearranged | side_story. Every target row must appear in exactly one `standings` entry.

## Finish
Return (as your final message) a 5-10 line summary: rows judged (count), standings mix, adoptions proposed with their bases, repairs, unresolved items. The JSON file(s) are the deliverable — written and valid before you finish.
