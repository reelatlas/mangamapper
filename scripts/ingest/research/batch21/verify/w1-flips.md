# Batch 21 wave 1 — adversarial verification of the flips (verdict-verifier, Fable 5.1; verdicts by Opus)

Scope: the six weight-bearing files under `scripts/ingest/research/batch21/out/` — dragon-ball-z-w1, one-piece-w1a, one-piece-w1b, fairy-tail-w1, naruto-shippuden-w1, ranma-1-2-w1. Every flip was re-read against the series' own primary pages (fandom episode + chapter wikitext via api.php, Kanzenshuu, OPwiki, ja-WP live wikitext, AFG live HTML, Shueisha), the stored neighbours were queried read-only, and `validate.ts` was run. Scratch: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/626dada3-d5b3-4dcd-b917-06bf2bdcd5e0/scratchpad/b21v/`.

Mechanical sweep (all six files): no `anime-only-canon` / `anime_only` / `original canon` strings; every annotation kind is in `ANNOTATION_KINDS`; every source-segment annotation carries a `weight:` phrase (the `rearranged` / `divergence` entries are not segments); every anchor's `chapters_adapted` agrees with its own `end_chapter` / `start_chapter`; no summary-vs-rows contradiction; no scope leakage (no sequel entries). `validate.ts`: 5 of 6 ok; naruto-shippuden-w1 FAILS on shape (`flags_for_sean` is a string — one-piece-w1a's is a string too) and on a false-positive "no anchor" test (the phrase is the ep-180 A1 reason).

## Findings, ranked by damage

### 1. one-piece ep 50 → canon + side_source — UNPROVEN under T26 (the type); the annotation repair is SOUND

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 50 | filler + graft{98} | canon + side_source{Loguetown novel, Act 3}; delete graft{98} | type UNPROVEN; graft deletion SOUND; side_source note SOUND as the tie fact on either type |

- T26's live text (the chain clause, 2026-09-04) says `side_source` narrows to works outside the chain "whose canon is the **'adopted' ruling**" — "an Itachi-novel row is canon + adopted + side_source". The verdict supplies no `adopted{basis}`. The only candidate basis is `author` (Oda's 原作 credit + four illustrations + Daddy/Carol designs), which is exactly the shape T26 rejects ("a blanket credit", "importing names or designs ... is not adoption"). onepiece.fandom itself files Daddy under `Category:Non-Canon Characters Designed by Oda` and calls the episode's version "the anime filler"; the novel page calls the book "a novelization of the Loguetown Arc". So canon is not established by the evidence cited.
- Catalog inconsistency for Sean, not the agent's fault: 57 stored `side_source` rows carry canon with NO `adopted` record (naruto-shippuden 452-457/484-500, black-clover 55-56, fullmetal-alchemist 11-12/37, gto 25-26, dragon-ball-super 6/18-27, boruto 93-111/282-286, cobra 13; trigun 18 is mixed). The verdict copies that stored precedent; T26's text disagrees with it. Either the precedent rows need `adopted` records + an audit class, or T26's sentence is wrong. Rule on that before applying ep 50.
- SOUND parts: no source puts ch 98 in ep 50 (ch 97/98 fandom summaries have no goggles beat — Usopp buys eggs, Sanji the tuna; OPwiki `Unbekannt`; AFG's 98 on rows 50/51 is the 49=97 → 52=98,99 plateau, confirmed on the live page). ja-WP's unique footnote `小説版でのエピソード。` on row 50 is real (live wikitext). Shueisha lists 浜崎達也 as 著者 and 尾田栄一郎 as 原作; the release date 2000-07-17 is from the fandom novel page (Shueisha's page did not render a date in the fetched HTML — one leg, not two).
- Caveat on the instrument: OPwiki prints `Unbekannt` on pure-filler rows 51 and 56 but also literally means "unknown"; it is the wiki's null, not a positive "adapts nothing" claim as the structure note reads it.

### 2. ranma-1-2 — the seven filler confirmations are SOUND; the STRUCTURAL mechanism is PARTLY REFUTED and its R20 recommendation is unsafe

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 14 | filler | filler, no anchor | SOUND (ranma.fandom production 17 / aired 14, manga = None) |
| 90 | filler | filler | SOUND (production 88 / aired 90, manga = None; AFG row 88 = *Filler) |
| 123 | filler | filler | SOUND (production 125, manga = None; AFG 125 = *Filler) |
| 124 | filler | filler | SOUND (AFG 126 = *Filler; AFG 124 = Matriarch / 58 = our ep 130) |
| 131 | filler | filler | SOUND (production 127, manga = None; AFG 127 = *Filler) |
| 134 | filler | filler | SOUND (AFG 135 = *Filler; AFG 134 = Gosunkugi / 200 = our ep 133) |
| 156 | filler | filler | SOUND (AFG 154 = *Filler; AFG 156 = Cheerleader (2) / 221-224 = our ep 155) |

- Verified on 26 AFG rows: the CHAPTER cell at AFG index N is ranma.fandom's production-order episode N in every zone checked (14-30, 88-90, 122-135, 154-158). That half of the claim holds and it settles all seven phantoms.
- REFUTED as stated: "the TITLE column is in Japanese broadcast order". True only in the 14-30 zone (Pelvic at 14, Enter Shampoo at 15, Abduction of P-Chan at 25 with cell 46-47). In the 88-90, 122-135 and 154-158 zones AFG's titles are in PRODUCTION order and in phase with their chapters (Ling-Ling at 88 = production 88; A Xmas Without Ranma at 125 = production 125; Miss Beachside at 154 = production 154 — all per ranma.fandom's own `(production order)` field). The phantom in those zones comes from OUR rows being in aired order, not from AFG's two columns being out of phase.
- Consequence: the verdict's first recommendation — "re-derive the AFG lane for this series joined on normalised TITLE" — would in the 14-30 zone join Pelvic Fortune-Telling → "23, 24" and re-mint the ep-14 junk anchor Sean deleted on 2026-08-25 (the verdict's own row-14 note shows this). The only safe key is the production number (ranma.fandom's field), or suppressing the AFG lane. Do not fold the "titles broadcast / chapters production" sentence into a ruling as written.

### 3. one-piece eps 418 / 419 / 420 → mixed + page-level anchors — SOUND on evidence; the load-bearing half is Sean's

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 417 | canon · 523 [522] · cont 524 | continue → 523 (C1) | SOUND consequence |
| 418 | filler + partial{523-524} | mixed · 523 [523] {523 p.14-17} + partial | SOUND |
| 419 | filler + partial{523-524} | mixed · 524 [523] {523 p.18-19, 524 p.8-9, 13-14} + partial + rearranged{524} | SOUND |
| 420 | filler + partial{523-524} | mixed · 524 [524] {524 p.2-3, 6-7} + partial + rearranged{524} | SOUND; Usopp's p.2-3 is positional (Boin's Qref has `page=` empty) — the verdict says so |
| 421 | mixed · 524 [524] | untouched | consistent (Longarm 524 p.4-5, Perona 524 p.10-12, Kuraigana/Namakura 524 all `ep=421`) |

- Fandom infobox `chapter=` fields reproduced verbatim: 417 = `522 p.15-19 and 523 p.2-13`; 418 = `523 p.14-17`; 419 = `523 p.18-19 and 524 p.8-9, 13-14`; 420 and 421 = no field; 422 = `525 p.2-19 and 526 p.3-6`. Qref reverse index reproduced page for page (Haredas / Weatheria 523 p.14-15 ep 418; Kitton 523 p.16-17 ep 418; Momoiro 523 p.18-19 ep 419; Torino 524 p.8-9 ep 419; Tequila Wolf + Chief 524 p.6-7 ep 420; Heracles / Boin 524 ep 420). Ch 524's long summary runs Usopp → Brook → Robin → Chopper → Zoro/Perona → Hancock → Marineford, matching the page order claimed. ja-WP live: 418-421 NOT bold. Every page of 523-524 is claimed exactly once across 417-421; the "sole" half holds.
- Anchors are chapter-monotone (523, 523, 524, 524, 524, 526) and v54 matches stored 417/421. The `rearranged{524}` on 419/420 records a page-level back-jump only; there is no chapter-level back-jump.
- Judgment left to Sean: whether "where each crewmate landed" is a major plot point. The consistency argument (stored mixed 421, ruled mixed 453-456) is real. Safe to apply as a block if the exception is taken.

### 4. dragon-ball-z ep 43 → mixed + 246 — SOUND on evidence; exception half (2) is Sean's

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 39 | filler + graft{246} | filler; graft{246 (p.1-4)} sliver | SOUND (Kanzenshuu ep 39 "Chapter 246 (Pages 1-4)" then "Mostly Filler") |
| 40 | filler + graft{246} | filler; graft{246 (p.5-8)} sliver | SOUND (not re-fetched; consistent with the ch-246 reverse index) |
| 42 | filler + graft{246} | filler; graft{246 (p.9)} sliver | SOUND (same) |
| 43 | filler + graft{246} | mixed · 246 [246] {246 (p.10-14)} v21; partial{246 (p.10-14)} significant; cont 247 parity; retire graft on 43 (A45) | SOUND on evidence; ruling is Sean's |
| 125 | filler + graft{336} | filler; graft{336 (p.14)} sliver; air_date 1992-02-05 → 1992-01-29 | SOUND (Kanzenshuu ep 125 "Chapter 336 (Page 14)", premiered 29 Jan 1992; ja-WP 1月29日 with ★; ja-WP 124 = 1月22日, 126 = 2月5日 — the stored block IS one week late) |
| 274 | filler + graft{506} | filler; graft{506 (p.8-9)} sliver, duplicate both edges | SOUND as cited (Kanzenshuu 273/275 not re-fetched; no change proposed) |

- Kanzenshuu ep 43 Corresponding: `Partial Filler | Chapter 246 (Page 10) | Half Filler | Chapter 246 (Pages 11-End)`; ch 246 = `Pages 01-14`, corresponding episodes exactly 039 / 040 / 042 / 043 (+ Kai 019). dragonball.fandom "A Friendly Surprise" is Number 43, Airdate 1990-04-11, Manga = The Return of Vegeta, Major Events "Vegeta hears about Frieza's desire to gather the Dragon Balls on Namek and races to the planet". ja-WP ★ on 41 (and 124, 125, 274), none on 39/40/42/43. Anchors 38 → 245, 43 → 246, 44 → 247 monotone; v21 = 241-252.
- Whether an inciting reveal (not a death / arc close) satisfies half (2) is the fork the verdict names honestly; plain materiality fails (~3.5 of ~19.5 min). The batch-17 A6 ruling predates the exception, as stated.

### 5. naruto-shippuden ep 179 → mixed + 450 — SOUND on evidence; shape defects; parser claim already landed

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 175 | canon · 450 [449] (manual) + rearranged | note-only repair of chapters_adapted | SOUND (ep 197's synopsis has Tokuma REPORTING the appointment; the council itself is not there) |
| 179 | filler | mixed · 450 [450] {450 (closing pages: the daimyo's council)} v48; partial significant; loose_parallel{3} sliver; cont 451 parity | SOUND on evidence; ruling is Sean's |
| 180 | filler | filler; partial{451 (opening)} sliver; anchor_hostile | SOUND (AFG live: blue, `0:00 to 2:12`, 451; Narutopedia chapters = 451; ep 197 = 451-453) |

- Narutopedia ep 179 infobox `chapters=450`, synopsis opens on the daimyo council appointing Danzō; ch 450 summary contains the appointment; ep 176 = 450, ep 178 = 449, 450, ep 181 = 451. AFG live rows confirmed: 179 blue, `0:00 to 4:05, here is the meeting to choose the new Hokage`, 450. Anchors 175 → 450 [449], 179 → 450 [450], 199 → 457 [454] monotone. The continue warning (healer will land on 454 unless 197/198 are anchored) is correct and matters.
- Shape: `flags_for_sean` is a string (validate FAIL); the repair entry carries extra keys (`target`, `series_id`); `chapters_adapted` is a prose paragraph — trim to `450 (closing pages: the daimyo's council)` at apply. `confidence: high` is high on evidence, medium on the ruling.
- The AFG parser defect described in `structure` is consistent with the stored `1-4` / `1-2` artefact, and the fix is ALREADY in the tree (`scripts/ingest/lib/afg.ts` line 94 accepts a trailing period; line 112 reads descendant-span classes; commit eda11b3, 2026-09-03). Nothing further to patch; re-derive and verify the outcome (P5).

### 6. fairy-tail ep 246 → mixed + 380 — SOUND on evidence; ruling is Sean's; two annotation-vocabulary defects

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 245 | canon · 380 [379] · cont 381 | continue should heal to C1 in 380 (not proposed) | correct observation |
| 246 | filler + partial{380 (from p.22)} | mixed · 380 [380] {380 (p.22-end)} v45; partial significant; divergence{"no source chapters"}; unverified{380 (p.22-end)}; cont 381 parity; A6 repair | type/anchor SOUND on evidence; `divergence` and `unverified` entries should NOT be applied |

- fairytail.fandom: ep 245 Adapted = 379 / 380 (to page 21); ep 246 = 380 (from page 22); ep 247 = 381 / 382; ch 380 relepisode = 245 + 246, volume #45, summary closes on Mard Geer's throne room; Mard Geer manga debut = Chapter 380, anime debut = Episode 246; ep 246 Differences = "With the exception of Mard Geer appearing towards the end of the episode, all the scenes ... were anime-only"; "Mard" absent from ep 245's page. ja-WP live: 246 subtitle 冥王 bold. Anchors 245 → 380 [379], 246 → 380 [380], 247 → 382 [381] monotone; v45 = 379-386.
- Vocabulary: (a) the `divergence` entry puts non-chapter text in `chapters` ("no source chapters — anime-original body") and misuses the kind (divergence = departs from the source it adapts) — drop it; the fact lives in the partial's note. (b) `unverified` on the same segment as a SIGNIFICANT `partial` double-records: `unverified` is the case where the anchor lands BECAUSE the share cannot be sized; here it lands on the exception, so the row would sit in `unverified_share` waiting for a page count nobody needs. Do not apply it. (c) `type_corrections[0]` uses `reason` / `confidence` instead of `note` (tolerated by validate).
- The verdict's own counter-case (ii) is the strongest: ch 380's NUMBER is already ep 245's END, so the never-adapted harm is only page-level here.

### 7. one-piece ep 93 → mixed + 158 and ep 203 → mixed + 303 — SOUND on presence and sole; the 93 sizing is asserted; 203's standing is the transplanted-beat fork

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 93 | filler + partial{158} | mixed · 158 [158] {158 (p.2-3, 14-16)} v18; partial significant; rearranged{158} | SOUND (OPwiki 093 = `Kapitel 158 (S. 2-3, 14-16)`, 094 = `157 (S. 12-17), 158 (S. 4-13)`; ch 158 long-summary ¶1 and ¶6 are in ep 93's long summary; ja-WP 93 not bold; AFG live 93 = plain, 158). "Roughly a third" has no timed source — UNPROVEN as a number, not needed for the flip |
| 94 | canon · 158 [158] | continue 158 parity | SOUND |
| 195 | canon · 303 [302] (afg) | canon confirmed; anchor re-delivered with page split; divergence{303} | SOUND (fandom ep 195 `302 p.2-19 and 303 p.2-3, 10-11, 14`; ja-WP not bold; AFG blue 1:50-15:58) — note this re-delivers an afg-tier anchor at the manual tier |
| 203 | filler + graft{303} | mixed · 303 [303] {303 (p.16-18)} v32; partial significant; rearranged{303}; reverse A6 | SOUND on presence/sole with a THIRD leg the verdict did not cite: fandom ep 203 infobox `chapter = Chapter 303 (p. 16-18)`. Not-a-plateau premise CONFIRMED on the live AFG page (196-202 red N/A, 203 blue 303, 204-206 red N/A). ja-WP 203 bold + `<ref name="original" />`. The standing is Sean's: a scene RESTAGED inside G-8 is T28's "transplanted beat" shape unless the shipwright decision is read as load-bearing; the 226 consistency argument is real |
| 207 | canon · 305 [303] | continue 204 → 303 | SOUND (fandom ep 207 `303 p.4-9, 13, 304 p.2-21, 305 p.2-6`) |
| 225 | filler | filler + graft{303 (p.19)} sliver | SOUND (ep 225 long summary opens on the Marine HQ / bicycle scene; ja-WP bold without the ref); page partition of 303 (195 / 203 / 207 / 225) confirmed on fandom + OPwiki |
| 51, 55, 214, 216 | filler | filler confirmed | SOUND as cited (ja-WP 51/55 bold + ref; OPwiki 051 Unbekannt; not re-fetched beyond that) |

### 8. Confirmed-filler rows in one-piece-w1b (319, 326, 497, 498, 626, 747)

No change proposed; the `chapter = Filler` vs missing-field semantics and the ja-WP ref list were spot-checked (ja-WP 418-421 unbold; fandom fields on 417/422) and not contradicted. Not independently re-fetched row by row — low stakes.

## What is safe to apply

- **Safe (evidence sound, values consistent with neighbours):** one-piece 418/419/420 block (types + three anchors + partials + rearranged + the 417-420 continues); one-piece 93 (type + anchor + partial + rearranged + 94 continue); one-piece 203 (type + anchor + partial + rearranged + 204 continue) IF Sean takes the exception / consistency line; dragon-ball-z 43 (type + anchor + partial + continue + the graft re-split) IF Sean takes the exception; the DBZ ep-125 air-date repair; naruto-shippuden 179 (type + anchor + both annotations + the 175 note repair) IF Sean takes the exception — and only WITH the manual anchor and with 197/198 anchored or the continue pinned; fairy-tail 246 type + anchor + partial IF Sean takes the exception; every "confirmed filler" row and every sliver annotation in all six files; the one-piece ep-50 graft{98} deletion and the ep-51 graft{98} rewrite.
- **Do not apply as delivered:** one-piece ep 50 → canon (no `adopted` basis under T26; rule on the 57-row precedent first — the `side_source` annotation itself is fine on either type); fairy-tail 246's `divergence` and `unverified` entries; ranma-1-2's "join AFG on TITLE" recommendation (join on production number or suppress the lane); the ranma structural sentence "titles broadcast / chapters production" as a series-wide ruling text.
- **Shape fixes before apply:** `flags_for_sean` → list (naruto-shippuden-w1, one-piece-w1a); naruto 179 `chapters_adapted` trimmed to a chapter phrase; naruto repair entry's extra keys.
