# Verifier report — ranking-of-kings-the-treasure-chest-of-courage wave 8 (lane L-D MUPIN + identity preface)

Verdict: `scripts/ingest/research/batch20/out/ranking-of-kings-the-treasure-chest-of-courage.json`
Verifier: claude-fable-5-1 (cross-model vs the Opus research agent), 2026-09-02.
Method: mechanical anchor/repair/continue/summary agreement scan; refetched
ousamaranking.fandom via the MediaWiki API (Special_Episode_1-10, Chapter_156-161,
Chapter_155/162-167 = missingtitle, Volume_1/3/5-10/12/13, the manga page, the
Treasure Chest page, and the character pages Oyabu / Anne / Sheena / Kage's
Mother / Demon / Desha / Ouken / Despa / Hokuro / Bebin / Kage / Hiling); the
official STORY pages ?id=01..10 (synopses + JP titles); ja-WP 王様ランキング
wikitext (各話リスト（勇気の宝箱）, アニメオリジナルのキャラクター, 第一部/第二部,
描き下ろし mentions); en-WP Ranking_of_Kings wikitext (the 2023 episode table);
syobocal TID 6691 TitleLookup + ProgLookup; MangaDex aggregate + the full
1011-row all-language chapter feed (bonus-chapter titles per language);
handycomic 単話版 pages 第155話-第168話 (volume placement); and THREE sources the
author could not read: dic.pixiv.net 王様ランキング勇気の宝箱 (full text via a
fetch proxy — the author had only search excerpts), the MAL ep-10 discussion
thread, and the arumican / chiebukuro / ameblo ep-10 posts. DB untouched.

## Recap baseline

Ranking of Kings: The Treasure Chest of Courage — stored per the dispatch
context: rows 1-10 all `canon`, all BARE (no title, no air date, afl_slug null);
the only anchor is the MU pin ep 10 → 155 v12; no annotations; volume boundary
v13: 156-167.

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 1 — stored: canon, bare, no anchor | → verdict: same; anchor_hostile (A44); side_story{vol 8 描き下ろし = 1B; 1A "unidentified", candidate vol 5 "A Safe Haven"}; title + date repairs | → verifier: hostile CONFIRMED; 1B vol 8 CONFIRMED (pixiv 「原作は単行本8巻の書き下ろし」; MangaDex 104.5 in vol 8 "Inversion de Despa"); 1A candidate REFUTED — pixiv: 「カゲのおつかい」 = オリジナルエピソード (F3); identity CONFIRMED ×4 |
| ep 2 — stored: canon, bare, no anchor | → verdict: same; anchor_hostile; side_story{vol 6 描き下ろし = 2A; 2B unidentified} | → verifier: CONFIRMED (pixiv 「荒野の獣 … 単行本6巻の書き下ろし」, 「1期11話と12話の間」; MangaDex 80.5 sits in vol 6 in vi/ru, untitled; fandom's Volume 6 page lists no bonus — silent, not contradicting); 2B carries no 原作 label on pixiv either |
| ep 3 — stored: canon, bare, no anchor | → verdict: same type (flagged only); anchor_hostile; no annotation | → verifier: hostile CONFIRMED; TYPE QUESTION NOW ANSWERABLE — pixiv labels BOTH segments オリジナルエピソード and ja-WP lists ドドン as anime-original: the two-source T28 shape for → filler the verdict said it lacked (F1) |
| ep 4 — stored: canon, bare, no anchor | → verdict: same; anchor_hostile; side_story{vol 9 描き下ろし 「不死」}; divergence{フレン anime-original} | → verifier: CONFIRMED (pixiv 「単行本9巻書き下ろし」; fandom Volume 9 "Bonus Chapter, Immortality"; es-la 117.5 "inmortalidad"; ja-WP フレン anime-original; ja-WP also records an ep-4 divergence: 「アニメ「勇気の宝箱」では不老不死こそが自身の超能力だと確信している」) |
| ep 5 — stored: canon, bare, no anchor | → verdict: same type (flagged only); anchor_hostile; 5C candidate vol 7 bonus 92.5 | → verifier: hostile CONFIRMED; pixiv: 「いずれもオリジナルエピソード」 for ALL THREE segments + ja-WP フレン anime-original → same T28 fork as ep 3 (F1); the 5C vol-7 candidate rests on a title resemblance only and pixiv contradicts it (F3) |
| ep 6 — stored: canon, bare, no anchor | → verdict: same type (flagged); anchor_hostile; no annotation | → verifier: CONFIRMED as delivered — pixiv: 「いずれも無印最終話(原作の第一部終了後)の直後のエピソード」 with NO 原作/オリジナル label; ja-WP ピッピ anime-original; the Miranjo-teaching beat is cited by ja-WP only as 「勇気の宝箱」6話. Genuinely unresolved; flag stands |
| ep 7 — stored: canon, bare, no anchor | → verdict: same; anchor_hostile; side_story{vol 3 描き下ろし 「笑う門には福来る」 = 7A}; 7B antagonist anime-original | → verifier: CONFIRMED (pixiv 「単行本3巻書き下ろし」 for 7A and 「オリジナルエピソード」 for 7B; fandom Volume 3 bonus title; MangaDex ru 41.5 "Удача благоволит веселым" ≈ the JP title; ja-WP チャンピオン anime-original) |
| ep 8 — stored: canon, bare, no anchor | → verdict: same; anchor_hostile; side_story{vol 10 描き下ろし cand. = 8A; vol 1 描き下ろし (13.5) = 8B} | → verifier: 8A CONFIRMED and can be promoted from candidate (pixiv 「単行本10巻書き下ろし」; es-la 129.5 "aspiracion"); 8B OVERSTATED — pixiv labels 偉大な母 オリジナルエピソード; the vol-1 bonus is only "an expanded version of Bosse and Sheena's first meeting" while the segment runs on through the founding, the bread thief, an invasion and the judge's visit (F2) |
| ep 9 — stored: canon, bare, no anchor | → verdict: same; anchor_hostile; no annotation; 9A "prequel vignette", 9B "coda after ch 155" | → verifier: hostile CONFIRMED; pixiv: 9A 「原作は単行本で、幼少期のミランジョと魔神の子のエピソード」 (a tankōbon source is asserted but NO volume is named — likely one of the untitled 141.5 / 155.5 bonuses; under-identified, no position effect); 9B 「ボッジが旅立つまでのオリジナルエピソード」 |
| ep 10 — stored: canon, bare, anchor END 155 v12 (mu) | → verdict: REPAIR end 155 → 161, vol 12 → 13 (G37); anchor END 161 [156] {156-161} v13 medium "verified floor"; rearranged{156-157}; continue 162 post_series | → verifier: G37 CONFIRMED on four independent sources; 156-161 CONFIRMED beat by beat; the floor is REAL but probably 3-4 chapters low (MAL: "adapts the next 10 or so chapters"; pixiv: 13巻 第二部の序盤 incl. the god-kill) — and an Oyabu (ch 166) CAMEO is planted in the closing scene that must not be mistaken for coverage (F4) |

## Findings, ranked by damage

### F1 — eps 3 and 5: the T28 two-source shape the verdict said it could not reach now exists (the main finding)
The verdict keeps every row `canon` "deliberately", because "a T28 retype
needs the segment-level split and a second source, and the settling document
is the tankobon 描き下ろし table, which is not published anywhere I could read".
The dic.pixiv.net article IS that segment-level split, and I read it in full
(the live page is Cloudflare-403 and has no Wayback capture, as the verdict
says, but it serves through a fetch proxy). It labels, segment by segment:
- 1A カゲのおつかい — 「オリジナルエピソード」
- 3A ヒリングの旧友 — 「1期9話と11話の間のオリジナルエピソード」; 3B ダイダと魔法 — 「幼少期のオリジナルエピソード」
- ep 5 — 「いずれもオリジナルエピソード」 (all three segments)
- 7B 四天王の宴 — 「オリジナルエピソード」
- 8B 偉大な母 — 「ボッスとシーナの過去を描いたオリジナルエピソード」
- 9B 王子と宝物 — 「ボッジが旅立つまでのオリジナルエピソード」
- and, for the source-backed ones: 1B 8巻書き下ろし, 2A 6巻書き下ろし, 4 9巻書き下ろし, 7A 3巻書き下ろし, 8A 10巻書き下ろし, 10 「単行本13巻で描かれた第二部の序盤」.

So two rows are WHOLLY anime-original on this source — ep 3 (both segments)
and ep 5 (all three) — and ja-WP independently places their drivers (ドドン
for 3A, フレン for 5A) under アニメオリジナルのキャラクター 「いずれも勇気の宝箱に
登場」 (verbatim). ja-WP's 白王 entry additionally separates the manga fact
(the horse grew fat) from the 5B anime plot (「勇気の宝箱」5話では黒い馬に一目惚れ
…リバウンド). That is a fan wiki plus ja-WP — the same tier the verdict
accepted for its 描き下ろし pairings. Damage if left as-is: none to a rendered
position (no anchor goes on these rows either way), but a `canon` standing on
a wholly-original row is exactly the standing lie T28 exists to remove, and
the verdict's own flag #2 asked for this evidence. What settles it: Sean's
call on whether pixiv (cross-check tier under R1) + ja-WP's character list
meets the bar; if yes, eps 3 and 5 → filler (A1 then forbids nothing new —
they carry no anchor). Eps 6 and 9 do NOT reach the same shape (pixiv labels
ep 6 only as post-part-one 直後のエピソード, and 9A as a tankōbon source with no
volume named) — keep them as flagged.

### F2 — ep 8B: "the vol 1 描き下ろし" is at most the opening beat
The annotation reads "vol 1 描き下ろし bonus chapter (MangaDex 13.5, 'an
expanded version of Bosse and Sheena's first meeting') for segment B 偉大な母".
The fandom's manga page says exactly that about Bonus Chapter 1 and nothing
more; the segment (fandom ep-8 summary + official 「偉大な母」 synopsis + pixiv)
runs from the demon contract through the courtship, Bojji's birth, the
founding of the kingdom, the bread thief who becomes a maid, an invasion, and
the Ranking judge's visit — and pixiv labels the segment オリジナルエピソード.
Correct wording: "opening beat shared with the vol-1 bonus (a remake of the
Bosse/Sheena meeting); the remainder anime-original". No position effect; the
side_story annotation should not name 13.5 as the segment's source.

### F3 — two candidates to strike (1A, 5C)
- ep 1A: the verdict floats vol 5's "A Safe Haven" ("an interlude during
  Bojji's training under Despa"). pixiv: オリジナルエピソード. The annotation
  already says "unidentified"; the anchor_hostile text should drop the
  candidate.
- ep 5C 優しき兵士ホクロ: the candidate is the vol-7 bonus 92.5 'Devocion
  inquebrantable', paired on title resemblance alone; pixiv says all of ep 5
  is original. Mark contradicted, not "NOT confirmed".
Nothing else in the chapter map is wrong: 1B / 2A / 4 / 7A / 8A all reproduce
on pixiv (volume numbers verbatim) and on MangaDex's per-volume placement
(104.5 vol 8, 80.5 vol 6, 117.5 vol 9, 41.5 vol 3, 129.5 vol 10 — the es-la
titles "Inversion de Despa", "Capitulo extra: inmortalidad", "Capitulo extra:
aspiracion", "Capitulo extra: Devocion inquebrantable" are exactly as quoted).
8A can be promoted from "candidate" to confirmed.

### F4 — ep 10: END 161 is an honest floor, probably 3-4 chapters low; and an Oyabu cameo is a trap for the next wave
Verified: the six fandom chapter pages 156-161 and the fandom ep-10 page match
in order (wagon / ruined Desha → vault & swords → cursed swords + Kuhya inn →
speared corpse, prison, demon child, the lake → rope, catfish, the wish →
human Ouken, the carcass, the lost connection → Despa's flashback, the
knights' report, Ouken sees an armoured man at the vault). START 156 is the
episode's first scene; the ch-157 inn scene closes the episode (fandom "In the
present…"; pixiv 「二人が宿に泊まったところで本作は幕を下ろす」) — the
`rearranged{156-157}` annotation is right. Fandom Chapter_162-167 do not
exist (missingtitle), MangaDex carries no title for 162-167 in any of its 1011
chapter rows, and the 単話版 storefront pages (handycomic 第156話-第168話,
BookWalker 第163話) print only series boilerplate — the verdict's "no readable
source summarises 162-167" is true. Two witnesses it did not have both say the
episode goes further: the MAL ep-10 thread ("It starts at chapter 156 of the
manga, picking up where season 1 of the anime left off, and adapts the next
10 or so chapters very faithfully") and pixiv's synopsis, which carries the
god encounter and kill inside 「単行本13巻で描かれた第二部の序盤」. Both are
cross-check tier; they support the verdict's own expectation (164-165) rather
than 161. So: the anchor is SOUND as a labelled floor, the continue at 162
(C5 = END+1) is the safe value, and the reader will re-read ~3-4 animated
chapters — the note already warns of that.
The trap: the fandom ep-10 cast list includes [[Oyabu]] (manga debut Chapter
166, per his page), and pixiv's synopsis has 「片足が不自由な謎の男が横切る」 in
the closing Kuhya scene — that is Oyabu's ch-166 crutch disguise planted as a
cameo. It is a teaser sliver, not adapted pages; the wave that lifts END must
not read it as coverage of ch 166.

### F5 — nits (no value changes)
- structure.notes "ch 156-161 verified page-for-page" overstates: verified on
  fandom summaries; no pages were read (the verdict's own end_chapter text
  says as much).
- "syobocal's counts 11/12 are a 「勇気の記念碑」 special": only Count 11
  (2023-06-23 00:55, ChID 3) coincides with the special (flagged as
  「^特別番組 王様ランキング 勇気の記念碑」 at the same time on the same channel);
  Count 12 (06-30) is an empty placeholder with no programme behind it. The
  conclusion (exactly 10 rows) is right on ja-WP 全10話, en-WP, the official
  nav and AniList.
- The summary says rows 1-9 carry "side_story annotations"; rows 3, 5, 6, 9
  carry none (consistent with no chapter identified — the sentence overstates).
- ja-WP's infobox shows a THIRD run (第一部 2017-05-20 – 2021-01-02, 第二部
  2021-05-08 – 2023-04-01, then 2024-12-31 –); "第二部 = ch 156 onward" is fine
  for this entry but should not be read as "to the frontier".
- Title nit: the fandom's ep-5 heading is "The Law of the Underworld"
  (singular); en-WP's "The Laws of the Underworld" is what the verdict
  delivered — either is defensible, en-WP is the cited primary.

## Per-claim verdicts (the five hunts)

1. **Part-one/part-two boundary at 155/156 and MU's 155 = the main series' S1
   endpoint — SOUND.** ja-WP: 「原作の第一部（1巻1話〜12巻155話）が映像化された」
   (verbatim, in the 2021 TV section); ja-WP 発表期間 第一部 2017-05-20 –
   2021-01-02 / 第二部 2021-05-08 –; fandom Volume 13 "The second part …
   starts now", Chapter 156 = vol 13 number 1; handycomic 単話版 第155話 →
   「単行本第12巻に収録」, 第156話-第167話 → 第13巻, 第168話 → 第14巻; MangaDex
   aggregate vol 12 = 142-155 (+155.5), vol 13 = 156-167 (+167.5). MU's
   "(S1)" is the 2021-22 series; G37 confirmed twice over (another entry's
   frontier AND an understatement).
2. **ep 10 adapts 156-161 — SOUND WITH CORRECTIONS (F4).** 161 is a real
   floor; the true END is higher (MAL "next 10 or so"; pixiv), not lower.
   START 156 and the rearranged 157 close are right. Oyabu cameo caution
   recorded.
3. **描き下ろし identifications — SOUND WITH CORRECTIONS (F2, F3).** 1B / 2A /
   4 / 7A / 8A confirmed on pixiv volume numbers + MangaDex placement +
   fandom volume pages (where the fandom lists the bonus at all: vols 1, 3,
   5, 9, 13 only). 8B overstated; 1A and 5C candidates contradicted.
4. **anchor_hostile on 1-9 / no retypes — hostile SOUND; typing SOUND WITH
   CORRECTIONS (F1).** No row 1-9 adapts mainline-numbered pages in running
   order (every segment is a bonus chapter, an original, or a post-155
   coda); A44 applies to all nine; A1/T27 clean; no mapping on any
   adopted/side_source row; no `anime-only-canon`. The T28 evidence for eps 3
   and 5 → filler now exists and is Sean's call.
5. **10 titles + 10 air dates — SOUND.** en-WP episode table (EN + JP titles,
   {{Start date}} 2023-04-14 … 06-16, slot footnotes 1:10 / 1:05 / 1:25 /
   1:55 / 1:05 / 1:15 / 1:10); ja-WP 各話リスト（勇気の宝箱）(JP titles, 4月14日
   … 6月16日); syobocal SubTitles (JP titles joined with ／, exactly as
   delivered) + ProgLookup ChID 3 StTime 01:10 / 01:05 / 00:55 / 01:25 / 01:55
   / 01:05 / 01:15 / 00:55 / 00:55 / 01:10 — every slot the verdict prints;
   official STORY pages 01-10 (JP titles). The fandom's Thursday dates (April
   13 … June 15) are the previous-evening convention the verdict describes.
   All 20 identity repairs verified.

## Mechanical scan

Single anchor: END 161 = repair new 161; START 156 ≤ END; volume 13 = repair
new 13 = stored boundary v13: 156-167 = MangaDex; continue 162 = END + 1
(post_series); summary "at least ch 161 in volume 13" agrees. No back-jump, no
scope leakage (the spin-off adapts the same manga's own numbering), no
anchor on any filler row, no fabricated number. Citation quality: fandom
API, ja-WP, en-WP, syobocal, the official site, MangaDex — no content farms
as primary; pixiv correctly labelled cross-check-only by the author (and now
read in full by me).

## Verdict on the verdict

Sound in everything it renders: the G37 repair, the 156-161 anchor as a
labelled floor, the continue, and all 20 identity repairs. Three things
should change hands at curation: (1) eps 3 and 5 now have the two-source
anime-original evidence the verdict asked for — Sean decides filler vs the
flagged canon; (2) soften 8B to "opening beat shared" and strike the 1A / 5C
candidates; (3) promote 8A from candidate to confirmed and record the Oyabu
ch-166 cameo as a do-not-lift caution beside the END-floor flag.
