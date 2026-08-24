# Batch 16 — decisions & notable findings for Sean

Batch 16 (2026-08-24) closed **all 38 remaining reorder holes** across 10
series — every one promoted to a full anchor with its own start_chapter, zero
zone-level fallbacks, all high confidence. The reorder-hole work-list from
`verify-series-display --all` is now EMPTY and the census gates stayed green
(ruling_violation 0, rearranged_zone_unanchored 0, ok_full 235).

## The one open decision

### D1. kamisama-kiss ep 10 — END/volume follow-up (LOW stakes)
Batch 16 proved the S1 ep-10 Christmas goukon adapts **ch 50** (vol 9) pulled
forward — the mixer boy is Kohiruimaki, a named ch-50 character (batch 15
wrongly called him anime-only; that note is now repaired in
`chapters_adapted`). Remaining question: ep 10's stored END is 25 (v5). If
the mixer segment CLOSES the episode (ja-wiki's segment order suggests it
does), the running-order END would be **50 (v9)** instead. We didn't verify
the in-episode segment order frame-level, so only `chapters_adapted` was
repaired; END/volume awaits your call.
- **Options**: (a) keep END 25 until someone checks the episode itself;
  (b) rule END 50/v9 on the ja-wiki segment order. Either is defensible;
  the ep is inside a ruled rearranged zone so display is annotation-aware
  regardless.

## Applied without needing you (recorded here for the light sweep)

- **kamisama-kiss ep 25** (S2 finale): season-envelope anchor replaced by its
  own exact record — END 64→63, start 31→62, chapters 62-63. Your A4 rule
  (finale anchors to what it adapts) applied; ch 64 is consumed by ep 24's
  opening graft, whose running-order lift keeps position/coverage at 64.
- **food-wars eps 17-18** added to the batch-9 arc-swap rearranged zone
  (curated annotation): they're the displaced Karaage block airing after the
  swapped-forward 40-44; the old annotation tagged only eps 15-16.
- **TYBW ep 38** continue refined 654→655 by the parity healer now that ep
  39's record accounts for ch 654's tail.

## Notable facts the batch surfaced (no action needed)

- **Permanent skips confirmed**: black-butler ch 5 (never animated — the gap
  after ep 3's continue→5 is permanent, and continue→5 is the honest reader
  resume); kamisama-kiss chs 35-36 + 65-66 (Kayako's whole character is cut
  from the anime); tokyo-ghoul-re ch 145 (ep 20 gets continue→146), ch 121
  p.1-6 (page-level seam gap); TYBW ch 654 pp.6-15; nisekoi chs 70-74 (never
  TV-adapted; ep 26 continue = 70 reads forward seamlessly).
- **Zones simpler than feared**: black-butler's reorder ends at ep 3 (4-5 are
  clean); cells-at-work S2 reorder is confined to eps 14-16 (17-21 in book
  order); shippuden 121-125 + 130-132 are clean monotonic runs (the apparent
  interleave was the already-recorded 127-128 fragments); tokyo-ghoul-re
  19-22 decompose cleanly per episode (batch 9's skip set confirmed exactly).
- **Genuine reorders now exactly recorded**: dragon-maid ep 6 (ch 29 before
  27); kamisama-kiss ep 24 (ch 64 grafted before 61); TYBW ep 39 (resumes
  655 after ep 38's deferred-Friend 634); shippuden 122/123 mid-chapter
  share of 356-357.
- **Post-S2 kamisama resume**: internet's "continue at ch 64" is wrong —
  honest resume after ep 25 is ch 65 (or 67 for the next arc). Stored ep-25
  continue→80 is your watch-order ruling and was left untouched.
- **Source landscape**: kamisama EN fandom is stubs in the S2 zone — the
  working sources were completed-manga-review.blog (chapter-by-chapter,
  chs 20-109), the Ukrainian sister wiki's per-chapter character lists (its
  ch-51 page is a corrupted copy of ch 50 — do not trust), and
  first-appearance infobox pairs. namu.wiki (dragon-maid's one candidate
  explicit table) is bot-blocked. wiki.gg black-butler pages are verbatim
  fandom forks (not independent), reconfirmed.

## The 9 review bookmarks

One `sean_review_bookmark` flag per series with flags (9 series; full text in
`scripts/ingest/research/batch16/out/<id>.json`). All informational — the
only one that asks for a ruling is D1 above.
