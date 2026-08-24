# Batch 17 (gap tier) — decisions & findings for Sean

Status: **32 of 53 series researched and applied** (1114 anchors). 21 series
still need research — the list is in `docs/data-pipeline.md` §12.42 and
regenerates live from `ls scripts/ingest/research/batch17/out/` vs the TARGETS
table in `context.ts`. Census after apply: ruling_violation 0,
boundaries_degenerate 0, rearranged_zone_unanchored 0, ok_full 235,
verify 220/220 with 0 failures.

---

## D1. The MU franchise-conflation pattern — a gate is warranted (YOUR CALL)

**This is the one real decision in the batch.** Five separate series had a
MangaUpdates coverage pin that stated a *different, later* entry's endpoint and
landed on a scoped entry as if it were that entry's frontier:

| series | stored pin | what it actually was | repaired to |
|---|---|---|---|
| ace-of-the-diamond-act-ii | ep 52 → ch 259 | Act II **Season 2 Part 1's** 2026 endpoint | 169 (v19) |
| yowamushi-pedal | ep 38 → ch 544 | the **whole-franchise** end (post-season-5) on an S1-only entry | 140 (v17) |
| gantz | ep 26 → ch 280 | the **Gantz:O movie** endpoint, on a filler row | anchor deleted |
| toriko | ep 147 → ch 263 | a full volume **past the adaptation frontier**, on a filler row | anchor deleted (ep 146 → 253 is the honest terminal) |
| fate-kaleid-liner-prisma-illya | ep 42 → ch 13 | a pin from a **different manga** (the movie adapts 3rei!! chs 29-39) | anchor deleted |

All five are repaired/deleted. The question is whether to **gate the writer**.

MU's coverage field is franchise-level prose ("Vol 11 Chap 90 (S1) / Vol 20
Chap 174 (S2) / Vol 34 Chap 305 (S3P2)"). `applyMuFrontier` already picks the
largest pair inside the entry's scope and has a chapter-space gate — but a
sequel's endpoint often sits *inside* the manga's chapter space, so the gate
doesn't catch it.

- **Recommendation**: add a scope-aware gate — when a series has sibling
  entries on the same `manga_anilist_id`, a MU pin may not exceed the start of
  the next sibling's scope (Naruto's pin can't claim Shippuden's chapters), and
  a pin on a row typed filler/anime-only is refused outright (A1 already
  forbids the anchor). Both are derivable from data we already hold
  (`series_scopes`, sibling `manga_start_chapter`, episode types).
- **Alternative**: leave it to the `mu_pin_unverified` review queue (47 open)
  and repair case-by-case as batches touch them.

I'd go with the gate — this is the fourth distinct MU-pin failure mode we've
found (after chapter-space, airing-pin, and count-space), and each one we
gated has stayed fixed.

## D2. prisma-illya should be split, Clear-Card style (recommendation)

Its seasons adapt **three different manga**: S1 (our eps 1-10) = the 1st series
(13 chapters + epilogue = exactly our 14-chapter space), 2wei!/Herz! (11-29) =
the 2wei! manga (AniList 85136), 3rei!! (30-41) + the movie (42) = 3rei!!.
Our entry has ONE chapter space, so eps 11-42 can never be honestly anchored in
it — they currently render out-of-space (the ep-42 pin is deleted).

- **Recommendation**: split into scoped entries the way Clear Card was split
  from Cardcaptor Sakura. Until then eps 11-42 must render out-of-space and
  never be interpolated in the 14-chapter space (that is the current state).

## D3. Two typing-vocabulary calls (low stakes, applied as recommended)

Your 2026-08-24 definition — *anime-only-canon = made for the anime but
standing as canon; filler = outside both canons* — decided both, but flag if
you disagree:

- **world-trigger 49-63** (the Fugitive Arc) → **filler**, because S2 explicitly
  retconned it, so it stands in neither canon. Ep 48 (an original breather that
  was *not* retconned) → anime-only-canon.
- **twin-star-exorcists 21-50** → **anime-only-canon**: it is the show's own
  serialized finale, but it *contradicts* the manga (Yuto dies here, survives
  there). Made-for-anime and treated as the anime's canon, so anime-only-canon;
  filler-list sites call it filler.

## Applied without needing you (recorded for your sweep)

- **6 curated repairs**: gintama ep 369 (704→696 — chs 699-704 are Jump GIGA,
  adapted only by THE FINAL movie), sailor-moon-crystal ep 39 (Act 60→38, your
  A4 finale rule — 60 was the manga's last chapter used as a finale filler),
  hikaru-no-go ep 75 (166→148, exact title match), mashle ep 24 (74→72,
  resolving a double-claim with ep 25), plus the ace-ii and yowamushi rows in D1.
- **8 zone acknowledgements** (A2/A3): annotated episodes that correctly carry
  no anchor because what they touch is a borrow, a concept-level nod, or a
  character-debut timing difference — chrono-crusade 6/8/21, sailor-moon
  103/113/133, shugo-chara 59/93.
- **Reorder-regime annotations** derived for 9 series from the anchors that
  actually jump (72 episodes), rather than blanket-claiming whole seasons.

## Findings worth knowing (no action)

- **kenichi rows 51-61 identified**: they are the 11 Brain's Base OADs adopted
  as episodes, adapting the Yami/YOMI saga out of manga order (Spark 158-166
  before Eclair 145-150, a backfill of TV-skipped 106-109, Boris 175-180 before
  173-174). Now anchored with the reorder recorded.
- **rurouni-kenshin (1996) eps 63-70 were a false positive** — already typed
  filler; the whole 63-94 block is anime-original. The `frontier_tail_null`
  audit class was flagging filler tails as if they were unmapped canon.
- **shugo-chara episode rows 73-96 diverge from broadcast order** (no #73 row;
  broadcast ep 95 missing entirely). Episode-row audit recommended — anchors
  were title-matched into OUR numbering, so one honest non-monotonic pair
  exists (ep 75 → 29, ep 76 → 28).
- **rurouni-kenshin-2023 rows 25-27 still carry stale 1996-series titles and
  air dates** (namesake collision #817); verified 2023 titles are available for
  the wiki-fill queue.
- **Three gintama reorder holes remain** (eps 111, 120, 227) — its regime is
  heavy enough that three episodes still lack exact records.
- **Flag resolutions** the batch produced: #678 (gintama chapter space = Lesson
  1-704; MU's 496 was a stale edition), #696 (sailor-moon: AniList's 61 = 52
  original acts + 9 side stories; our 60-act space is the modern reading
  edition), #697 (heavens-lost-property: 77 mainline + 20 extras = AniList's 97).

## The 30 review bookmarks

One `sean_review_bookmark` flag per series with flags (85 individual notes
across 30 series; full text in `scripts/ingest/research/batch17/out/<id>.json`
under `flags_for_sean`). All informational except D1-D3 above.
