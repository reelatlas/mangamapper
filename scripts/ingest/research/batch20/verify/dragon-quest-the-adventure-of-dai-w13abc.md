# Verifier report — dragon-quest-the-adventure-of-dai wave 13, sub-blocks a + b + c (eps 18-35, lane A2 gap block)

Verdicts: `scripts/ingest/research/batch20/out/dragon-quest-the-adventure-of-dai-w13a.json` (rows 18-23),
`-w13b.json` (rows 24-29), `-w13c.json` (rows 30-35).
Verifier: claude-fable-5-1 (cross-model vs the three Opus research agents), 2026-09-02.
Brief weight order: (1) the chapter-space fault line, amended mid-task by the coordinator (the fandom→OUR
offset is a WINDOW, +1 for OUR 123-207 only); (2) A's ep-17 fence repair; (3) B's four A47 holds vs ep 24's
advance; (4) C's ep-34 / ch-112 field corrections and its two medium rows; (5) six anchor spot-checks;
(6) source independence.
Method: mechanical row / continue / monotonicity / volume scan across all THREE files (the 23/24 and 29/30
seams are the double-dispatch points); every anchor pushed through `lib/sliver.ts#sliverStart/sliverEnd`
with the neighbouring START; refetched dragonquest.fandom via the MediaWiki API (2020 episode pages 17-36 and
100; chapter pages 59, 60, 63, 72, 78, 81, 82, 85, 86, 88, 90, 98, 99, 101, 104, 107, 108, 111, 112, 113,
114, 117, 118, 121, 122, 123, 131, 132, 178-180, 183, 184, 189, 190, 196; The Hero Avan; probes for 206-209,
298-300, 347-349 = missingtitle), en-WP "List of Dragon Quest: The Adventure of Dai volumes" raw wikitext
(numbering scan of the whole list), ja-WP DRAGON QUEST -ダイの大冒険- raw (話数 + the 2020 各話リスト rows
17-35), Toei's あらすじ pages 17-36, TV Tokyo's episode pages index_7 / index_8 (eps 21-40), coco13.club
daianime17-36 (the 原作 line of every episode, verbatim), MangaDex's English feed (offset 100), and — new —
Out A Times' per-volume 各話タイトル tables for vols 11-20, 21-30, 31-37 ("旧コミック版を基にしています";
Wayback 2024 captures, the live host no longer resolves). lineup.toei-anim.co.jp (A's "same text" claim)
404s at the cited path. DB untouched; verdict JSONs untouched.

## Recap baseline

Dragon Quest: The Adventure of Dai — stored per the wave-13 contexts: eps 18-35 sit inside the
anchor_gap_research block 18-59 (NO stored anchors inside); lower fence ep 17 → 60 [57] v7 (manual, batch
17); no anchored fence above within the wave (ep 100 → 349 is an unverified MU pin). Stored types: all
eighteen rows canon (AFL: —). The two stored rows the verdicts touch outside the ask: ep 17 (canon, manual
anchor 60 [57]) and ep 1 (canon, manual anchor 3 [1] + graft annotation {99, 183 (partials); 6 (1 panel)}).

| row | stored | verdict | verifier |
|---|---|---|---|
| ep 1 — stored: canon, anchor 3 [1], graft{99, 183, 6} | → verdict (c): repair annotation 183 → 184 (OUR space) | → verifier: SOUND — fandom 183 誓いの魔槍 = en-WP 184 = OUR v20; NOTE the printed tankōbon prints 第183話 (F1) |
| ep 17 — stored: canon, anchor 60 [57] {57 (bulk), 58, 59, 60 (partial)} v7, continue 60/parity | → verdict (a): REPAIR END 60 → 59 under A47; chapters_adapted "60 (cliffhanger scrap…)" | → verifier: SOUND WITH CORRECTIONS — 59 holds on THREE instruments (coco13 17 = ch 57→59, no ch 60 at all; Toei 17 ends on the reveal; fandom ch-59 cast ends Hyunckel), but the ch-60 share is a RELOCATED mid-chapter beat (Crocodine sends Dai on), not a cliffhanger — wording + a `rearranged{60}` (F3) |
| ep 18 — stored: canon, no anchor | → verdict (a): END 63 [60] high, clean | → verifier: SOUND (coco13 18 = 60→63 verbatim; Toei 18 opens on Hyunckel's rescue account = ch 60; title = ch 61 激突!!ヒュンケル対ハドラー; ch-63 cast ends Bartos (vision) > Flazzard as claimed) |
| ep 19 — stored: canon, no anchor | → verdict (a): END 68 [64] high, clean | → verifier: SOUND (coco13 19 = 64→68; Toei 19 opens at the Valge tower blocked by Flazzard = ch 64, ends on the 心眼 Kuretsuzan = ch 68; title = ch 67 verbatim) |
| ep 20 — stored: canon, no anchor | → verdict (a): END 72 [69] high, clean | → verifier: SOUND (coco13 20 = 69→72; Toei 20 opens on Hadlar revived by Mystvearn = ch 69, ends on Baran in Carl = ch 72 whose cast ends Baran > Zaboera; title = ch 70) |
| ep 21 — stored: canon, no anchor | → verdict (a): END 75 [73] high, clean | → verifier: SOUND (coco13 21 = 73→75; title = ch 73 verbatim; Toei ends 移動する鬼岩城 = ch 75 また会う日まで) |
| ep 22 — stored: canon, no anchor | → verdict (a): END 78 [76] high, clean | → verifier: SOUND (coco13 22 = 76→78; title = ch 76; Toei ends on the Hydra bearing down on Merle; ch-78 cast ends Merle > Nabara) |
| ep 23 — stored: canon, no anchor | → verdict (a): END 81 [79] high, A47 hold + partial{82} + rearranged{82} + parity continue 82 | → verifier: SOUND (coco13 23 = 79 → "82 最初まで"; coco13 24 = "82 序盤から"; title = ch 81; the Horkins relocation is on the fandom's ep-23 差分 verbatim) — one side of the convention fork (F2) |
| ep 24 — stored: canon, no anchor | → verdict (b): END 86 [82] high + parity continue 86 | → verifier: SOUND (coco13 24 verbatim "…第86話…の中盤まで"; Toei 24 ends on 竜の騎士最強の秘密 = ch 86; v10) |
| ep 25 — stored: canon, no anchor | → verdict (b): END 89 [86] high, A47 hold + partial{90} + parity continue 90 | → verifier: SOUND (coco13 25 "86 中盤から 90 序盤まで"; Toei's one-clause 竜騎衆 tail; ch-88's page carries ep 25); NOTE the fandom ch-90 reverse field credits ONLY "25 (Partial)" — it omits ep 26 (F4) |
| ep 26 — stored: canon, no anchor | → verdict (b): END 94 [90] high, clean | → verifier: SOUND (coco13 26 "90 序盤から 94 まで"; Toei ends on Hyunckel's arrival; 94 = v10's last) |
| ep 27 — stored: canon, no anchor | → verdict (b): END 97 [95] high, A47 hold + rearranged{98} + partial{98} + parity continue 98 | → verifier: SOUND (coco13 27 = 95 序盤 → 97 まで — coco13's line does NOT name 98; the fragment rests on fandom ch-98 "27 (Partial), 28 (Partial)" + the ep-27 差分 "Baran's arrival is put early on" + Toei 27's closing Teran paragraph) — attribution nit (F7) |
| ep 28 — stored: canon, no anchor | → verdict (b): END 100 [98] high, A47 hold + partial{101} + graft{196 pp 10,12} + parity continue 101 | → verifier: anchor SOUND (coco13 28 = 98 → 101 序盤; Toei ends on Borahorn rising; ch-99 "28, 1 (partial)" verbatim; ep-28 trivia "cold open of episode 1 is repurposed" verbatim); **graft chapter WRONG in OUR space — the fandom's 196 さらば我が子よ is OUR 197** (F1b) |
| ep 29 — stored: canon, no anchor | → verdict (b): END 103 [101] high, A47 hold + partial{104} + parity continue 104 | → verifier: SOUND (coco13 29 = 101 序盤 → 104 序盤; Toei ends on the 竜魔人 transformation; ch-104 "29 (Partial), 30"); the "原作では一瞬" line is an embedded reader tweet, not the blogger (F7) |
| ep 30 — stored: canon, no anchor | → verdict (c): END 108 [104] high, END ADVANCED onto 108 (partial) + parity continue 108 | → verifier: value SOUND on the sources, but the A47 call is the OPPOSITE of A/B on identical evidence (coco13 30 = 104 序盤 → "108 序盤まで"; ch-108 "30 (partial), 31") — convention fork (F2) |
| ep 31 — stored: canon, no anchor | → verdict (c): END 111 [108] MEDIUM, advanced onto 111 (partial) + parity continue 111 | → verifier: ch-112 question RESOLVED (coco13 31 = 108 序盤 → "111 序盤まで"; coco13 32 starts 111 序盤 — ch 112 is ep 32's; the reverse field's "31" is a wrong episode number) → medium can lift; the END is in the F2 fork |
| ep 32 — stored: canon, no anchor | → verdict (c): END 114 [111] high, advanced onto 114 (partial) + parity continue 114 | → verifier: value SOUND; title = ch 113 父との決別 verbatim; Toei 32's tail is a one-clause cutaway (時を同じくして、鬼岩城では…最後のチャンスを与えていた) — the exact shape B held at ep 25 (F2) |
| ep 33 — stored: canon, no anchor | → verdict (c): END 117 [114] high, clean | → verifier: SOUND (coco13 33 = 114 序盤 → 117 まで; Toei 33 opens on Hadlar's last chance and Zaboera's Maam disguise = ch 114-115; ch-117 credits ep 33) |
| ep 34 — stored: canon, no anchor | → verdict (c): END 120 [118] MEDIUM, forward field corrected (drops 118, adds 121) | → verifier: SOUND, lift to HIGH (coco13 34 = "118 最強剣はどこだ…!!? から 120 再会!!武道家マァム まで" verbatim; ch-118 reverse = 34; ch-121 reverse = 35; Toei 35 opens on Maam's promise to win the Blade) (F4) |
| ep 35 — stored: canon, no anchor | → verdict (c): END 125 [121] high, "121, 123, 124, 125 (partial)" v14 + parity continue 125 | → verifier: SOUND in OUR space (coco13 35 = "121 覇者の剣 から 14巻124話 恐怖の超魔生物 の途中まで" = OUR 125 by title; 途中 = mid-chapter, the ep-24 shape, so the advance is consistent); coco13's "124" is the PRINTED number (F1) |

## Findings, ranked by damage

### F1 — The chapter-space fault line: the fandom→OUR conversion is SOUND at the 122/123 edge, but the framing needs one correction — OUR space is the outlier against the PRINTED tankōbon, not the fandom
What I established on primaries, in the order the brief asked:

**(a) The vol-13 boundary.** en-WP's original-release list prints v13 as `*114.` … `*121. 覇者の剣` followed by
`* SP. 【番外編】勇者アバン`, and v14 opens `*123. 決勝戦の異変!!`. A mechanical scan of every numbered entry in
the whole list finds exactly ONE gap in 1-349: "gap after 121 -> 123". The stored table's `v13: 114-122` is
that reserved slot. The fandom's "The Hero Avan" page: `|volume=13`, `previous = chapter 108 (pre-release) /
chapter 121 (tankobon ed.) / chapter 117 (bunkobon ed.)`, `next = chapter 109 (pre-release) / chapter 122
(tankobon ed.) / chapter 118 (bunkobon ed.)` — verbatim, three placements. The fandom's ch-121 page (`|volume=13`,
next = 122 + "Avan, The Hero — Side Story (Tankobon bonus)"), ch-122 決勝戦の異変!! `|volume=14`, ch-131
ザムザ落日に消ゆ `|volume=14`, ch-132 新たなる出発!!! `|volume=15` — the fandom's own |volume= fields land on
OUR boundaries (v14 = 123-132, v15 = 133-141) only under fandom N = OUR N+1. C's three-way proof reproduces.

**(b) The vol-20 boundary.** fandom 178 決戦場への誘い! `|volume=19` = en-WP 179 (v19's last); fandom 179
凶刃!!フェンブレン `|volume=20` = en-WP 180 (v20's first); fandom 183 誓いの魔槍 = en-WP 184; fandom 189 戦火の告白
`|volume=21` = en-WP 190 (v21's first); fandom 196 さらば我が子よ `|volume=21` = en-WP 197. +1 holds at v19/20/21.

**(c) The last chapters.** The fandom's ep-100 field reads "346 (partial), 347, 348, 349" and en-WP's v37 =
342-349 with 349 = さらば!!!愛する地上よ — so at the top the fandom's number IS ours, exactly as the
coordinator's amendment predicted (a window, not a uniform shift). The fandom's chapter pages for 206-209 and
298-349 do not exist (missingtitle), so the window's CLOSE cannot be tested on chapter pages from here; that
stays G's inference (see below for what the printed books say about it).

**(d) The batch-17 rows and ep 1's graft.** Eps 1-17 (ch ≤ 60) and the 99 / 6 grafts are below the seam and
untouched. The 183 → 184 repair is SOUND in OUR space: fandom 183 = 誓いの魔槍 (adapted "1 (partial), 51"), en-WP
184 = 誓いの魔槍, OUR v20 = 180-189 holds both numbers so the volume never catches it.

**(e) MangaDex.** Its English feed numbers "Avan, The Hero — Side Story" as ch 118 (vol 8 = the bunkoban
placement, right after 117 Individual Missions); MD 119-122 = OUR 118-121 (Where's the Strongest Blade = 119 …
The Blade of Champions = 122); MD 123 Disaster in the Finals = OUR 123. C's warning is exact: MangaDex is +1 on
OUR 118-121 and equal from 123. C's ep-35 anchor cites MangaDex only for the 123-125 titles, where it agrees.

**(f) THE CORRECTION — what the books print.** Out A Times' per-volume 各話タイトル tables (explicitly 旧コミック版
= the original Jump Comics) number the mainline CONTIGUOUSLY: v13 = 第114話 … 第121話 覇者の剣 + 番外編 勇者アバン
(unnumbered; "アバン・ロカ vs ハドラー（回想）【初登場】フローラ"); **v14 opens 第122話 決勝戦の異変!!**, 第124話
恐怖の超魔生物; v20 = 第179話 凶刃!!フェンブレン … 第183話 誓いの魔槍 … 第188話 開かれし扉; v22 = 第198-206話
(第206話 絶望のバトル!!!), v23 opens 第207話 太陽を我が手に; **v37 = 第341-348話, 第348話 さらば!!!愛する地上よ**.
Two independent witnesses agree: coco13 (a reader with the manga open) writes "14巻124話 恐怖の超魔生物" and
"128話 閃光の大逆襲" (OUR 125 / 129); ja-WP's infobox: `話数 = 全343話` with the sentence 「読切や番外編を除いて
全343話」 — 343 serial + the 5 one-shot parts en-WP numbers 01-05 = 348 printed chapters. The fandom's numbers
equal the printed numbers on every chapter page I fetched (59-196). So:

- OUR 349-slot space = 348 printed chapters + ONE phantom slot (122) that en-WP alone reserves for the
  unnumbered 番外編. MangaDex reserves a slot too, at 118. No printed edition numbers it.
- fandom N = OUR N+1 for OUR 123-207 is TRUE as a conversion, but the honest statement is **printed N = OUR
  N−1 for every mainline chapter from 決勝戦の異変 (printed 122, OUR 123) to the finale (printed 348, OUR 349)**
  — the printed offset never closes. The fandom's window closing at OUR 208 (G) is therefore a FANDOM quirk
  (it gains a number somewhere in 207-208 while the books do not), not a property of the manga.
- Product consequence, for Sean, not for the verdicts: every anchor the catalog will render for OUR ≥ 123
  reads ONE HIGHER than the 第N話 printed in the volume a reader holds (and than coco13's numbers, and than the
  fandom's below 207). The verdicts are right to land in OUR space (the stored table, AniList's and MU's 349),
  but this is an N-family chapter-space question that deserves a series ruling BEFORE d-g land: keep the
  en-WP space and record the display conversion, or move the entry to the printed 348 space. It also bears on
  the wave-14 ep-100 MU pin (MU's 349 = en-WP's count, i.e. printed 348 + the side story).

Verdict on (1): **SOUND WITH CORRECTIONS** — the conversion C states is true against OUR space; the sentence
"the fandom numbers only the 348 mainline chapters contiguously" is true and is ALSO exactly what the printed
tankōbon does; C's "must be +1'd" instruction is right for OUR space and must travel with the caveat above.

### F1b — w13b: the ep-28 graft annotation carries a FANDOM number — `graft{196 (pp 10, 12)}` is OUR 197 (REFUTED as written)
B copied the fandom's ep-28 field "196 (page 10,12)" and wrote "ch 196 'さらば我が子よ…!!' (vol 21, mainline-
adapted in ep 54)". The fandom's ch-196 page IS さらば我が子よ (`|volume=21`, adapted ep 54) — but en-WP prints
`*197. さらば我が子よ...!!` and OUR v21 = 190-198 holds both 196 and 197, so the volume check does not catch it
(the same trap C caught on 183/184). Damage if curated as-is: an annotation chapter number one low, in
exactly the class this wave was warned about. Fix at curation: `graft{197 (printed 第196話; pp 10, 12)}`; the
END is not inflated either way (A4).

### F2 — The A47 convention is SPLIT across the three files on identical evidence — the wave needs one ruling (the parent's point 3)
Every straddle in 17-36, with what each instrument says (coco13's line verbatim-checked; the fandom's
REVERSE field as printed; Toei's tail):

| seam | chapter | coco13 (earlier ep → later ep) | fandom reverse field | Toei tail of the earlier ep | call |
|---|---|---|---|---|---|
| 17/18 | 60 | 57→59 まで / 60 から (no 60 in ep 17) | "17, 18" | the reveal (ch 59's last beat) | A: HOLD 59 (repair) |
| 23/24 | 82 | 82 最初まで / 82 序盤から | "23, 24" | "バランは…意外な言葉をかける" | A: HOLD 81 |
| 24/25 | 86 | 86 中盤まで / 86 中盤から | "24 (Partial)" (omits 25) | the aura reveal | B: ADVANCE 86 |
| 25/26 | 90 | 90 序盤まで / 90 序盤から | "25 (Partial)" (omits 26) | "竜騎衆を召喚していた――" (one clause) | B: HOLD 89 |
| 28/29 | 101 | 101 序盤まで / 101 序盤から | "28 (Partial), 29" | Borahorn rising (one clause) | B: HOLD 100 |
| 29/30 | 104 | 104 序盤まで / 104 序盤から | "29 (Partial), 30" | the 竜魔人 transformation | B: HOLD 103 |
| 30/31 | 108 | 108 序盤まで / 108 序盤から | "30 (partial), 31" | the crest on the right fist | **C: ADVANCE 108** |
| 31/32 | 111 | 111 序盤まで / 111 序盤から | "31 (Partial), 32 (partial)" | the knife crumbles, Baran draws the sword | **C: ADVANCE 111** |
| 32/33 | 114 | 114 序盤まで / 114 序盤から | "32 (partial), 33 (partial)" | "時を同じくして、鬼岩城では…最後のチャンスを与えていた……" (one clause) | **C: ADVANCE 114** |
| 35/36 | 125 | 124(=125) 途中まで / から | ep-36 fwd "124 (partial)" | Zamza unleashes the true form | C: ADVANCE 125 |

The 29/30 row and the 30/31 row are the same shape in every column (序盤/序盤, "(partial), N", a cliffhanger
beat that the next synopsis re-states) and got opposite calls from B and C. C's stated basis — "the series'
stored convention, ep 12->44 and ep 16->57, advances the END on a marked partial" — cites batch-17 rows
written 2026-08-24, i.e. BEFORE A47 (ruled 2026-09-02, §12.96); that is the convention A47 overrides, not a
precedent for it. C's own flag names 30 / 32 / 35 as the candidates; the correct set is **30 / 31 / 32** —
ep 35's 途中 ("midway") is the ep-24 中盤 shape and its advance is consistent with B.

What I could add on the page question: nobody in the chain has a page count. coco13's vocabulary is
graded (最初 < 序盤 < 中盤/途中) and it uses 序盤 for both the end of the earlier episode and the start of the
later one on every held seam, which reads as "the opening pages" on ~18-page chapters (B's ch-88 scale note
checks: the fandom's ch-88 page is the 1991 "15 of 18 pages" witness). Toei's tails on 25 / 28 / 32 are single
closing clauses (teaser-shaped); on 30 / 31 the tail is the episode's climactic beat, which is the one place
the "story-carrying" argument has some weight — but it is the same beat the next synopsis opens on, which is
what A47 was written for.

Recommendation: rule ONE convention for wave 13 and apply it across the seven files. Under the ledger's
wording (sliver / teaser wording ⇒ hold) the hold convention is the rule-conformant one and is what A and B
delivered, so the minimal curation is **ep 30 → 107 [104] + partial{108}, ep 31 → 110 [108] + partial{111},
ep 32 → 113 [111] + partial{114}**; every continue (108 / 111 / 114) is unchanged because each already
points at the next START. If Sean instead rules that position language without a page count does NOT meet
A47's ≤5-page test, the reverse set moves: 25 → 90, 28 → 101, 29 → 104 (B), 23 → 82 (A) and the ep-17 repair
is withdrawn — with C1 continues (values unchanged). Either way the reader instruction is identical; only the
rendered END differs by one on eight rows.

P5 aside for the parent: the apply layer will NOT decide this. `sliverEnd` on all 18 records (simulated):
B's held tails name end+1 ("90 (opening)" → `tail-not-end`), C's advanced tails read "(partial)" which is not
in SCRAPPY → `substantive`; ep 24's "(first half)" → `substantive`; nothing moves in either file. The
end_sliver_mismatch census class will read all eighteen as proven whichever way Sean rules — the rows are
decided by the verdicts, not by the rule.

### F3 — w13a: the ep-17 fence repair 60 → 59 — SOUND WITH CORRECTIONS (mechanism and wording)
Three instruments put ep 17's END at 59, one more than A cited:
- coco13 17: 「アニメ第17話は原作7巻第57話”魔王軍総攻撃‼”から第59話”不死身の救世主”までだよ」 — no ch 60 at all;
  coco13 18: 「第60話”戦士復活‼”から第63話…までだよ」.
- Toei 17's last sentence: 「ハドラーがマァムに止めを刺そうとしたその瞬間、氷魔塔が崩れ、そこにはヒュンケルの姿があった」;
  the fandom's ch-59 cast (in order) ends "… Crocodine > Gargoyle F > Hyunckel" — the reveal is ch 59's closing
  page. Toei 18 opens on Hyunckel's account of Crocodine's rescue = ch 60's cast opening "Hyunckel > Maam >
  Popp > Hadlar".
- What the fandom's "60 (partial)" on ep 17 actually is: the ep-17 差分 says verbatim "Crocodine's throwing
  Dai is put earlier (after the ice tower shatters instead of during the middle of Hadlar and Hyunckel's
  fight" — and ch 60's cast carries "Crocodine > Gargoyle F > Gargoyle D > Dai" for exactly that beat. So ep
  17's ch-60 share is a RELOCATED mid-chapter beat (Crocodine sends Dai to the Valge tower), not a cliffhanger
  scrap of Hyunckel's first line. That is stronger for the repair, not weaker: a relocated fragment never sets
  a position (A12's spirit, which A itself invoked on ep 23).
Corrections at curation: the chapters_adapted wording should read "60 (relocated beat — Crocodine sends Dai
on; rearranged; ep 18 owns the chapter)" rather than "cliffhanger scrap", and a `rearranged{60}` on ep 17 is
owed for the same reason ep 6/7 carry one for ch 17. Continue 60/parity and ep 18's START 60 unchanged; v7
unchanged. Convention caveat: this repair belongs to the hold side of F2.

### F4 — w13c: the two fandom field corrections — SOUND; ep 34 lifts to high; and the reverse field is defective in more places than C found
- ep 34's forward field "119, 120, 121" (verbatim, refetched) drops 118 and adds 121. coco13 34 puts ep 34 at
  118 → 120 and coco13 35 starts ep 35 on 121; the fandom's ch-118 reverse = "episode 34", ch-121 reverse =
  "episode 35"; Toei 34 ends on Zamza's glance from the VIP box (「貴賓席では、ある男が…怪しい視線を送っていた」)
  and Toei 35 opens on Maam's promise to win the Blade of Champions (ch 121). END 120 [118] v13 stands on
  three instruments — medium → high.
- ch 112's reverse field "2020: episode 31 (Partial)" (verbatim) names no completing episode. coco13 31 ends
  at "111 序盤", coco13 32 runs "111 序盤 → 114 序盤" — ch 112 死を超えた一撃 is whole inside ep 32 (Toei 32: the
  mutual strike that ends the duel). The reverse field simply carries the wrong episode number. ep 31's
  medium can lift on coco13; its END is in the F2 fork.
- NOT flagged by B: the ch-86 reverse field reads only "episode 24 (Partial)" and the ch-90 reverse only
  "episode 25 (Partial)" — both omit the episode that completes the chapter (25 and 26 per the forward fields
  and coco13). Three incomplete reverse fields in 86-112 means "the chapter page credits ep N alone" (used by A
  on 63/72/75/78, by B on 89/94/100/103, by C on 117/121) is weak evidence of a clean cut on its own; every
  one of those cuts is nonetheless confirmed by coco13's unqualified "…まで" line plus Toei, so the values stand.

### F5 — The two medium rows (31, 34): both can lift
ep 34 → high (F4). ep 31: the ch-112 doubt is resolved (F4); the remaining uncertainty is the wave's convention
(F2), not the sources — mark it high once Sean rules F2, whichever way.

### F6 — Spot-checks on Toei's あらすじ + en-WP namesakes (six anchors across the three files) — all SOUND
19 → 68 [64]: Toei opens 「ようやくバルジの塔にたどり着いたダイ、ポップ、マァムは、塔の前でフレイザードに行く手を阻まれてしまう」
= ch 64 突入!!レオナを救え; ends on the 心眼 空裂斬 = ch 68 出たっ!!空裂斬; ep title = ch 67. 21 → 75 [73]: title = ch 73
マァムの決意; Toei ends 「ヒュンケルたちの追跡を逃れるために移動する鬼岩城の中で…」 = ch 75. 22 → 78 [76]: title = ch 76
デパートへ行こう!; Toei ends on the Hydra bearing down on Merle = ch 78's closing (cast ends Merle > Nabara).
24 → 86 [82]: Toei 24 opens on Baran's mission speech (ch 82 衝撃のバラン) and ends 「竜の騎士最強の秘密」で迎え撃つ =
ch 86 戦慄!竜闘気; en-WP v10 = 85-94 → volume 10 ✓. 26 → 94 [90]: Toei opens on the three Dragon Riders
summoned (ch 90 最強軍団集合) and ends 「そこにヒュンケルが駆けつける」 = ch 94 狂乱!!ガルダンディー's last beat; 94 = v10's
last ✓. 33 → 117 [114]: Toei opens on Hadlar's last chance + Zaboera (ch 114 remainder), the fake Maam = ch 115
帰ってきたマァム…!!?, ends on the Book of Avan = ch 117 それぞれの使命; v13 ✓. Plus the seam row 35 → 125 [121]:
title 決勝戦の異変 = OUR ch 123 in en-WP (the +1 namesake check C proposed holds); Toei 35 ends on Zamza
unleashing the hyper-demon form = OUR 125 恐怖の超魔生物 (coco13 "124 … の途中").

### F7 — Source independence (the parent's point 6)
- **dragonquest.fandom forward + reverse = ONE wiki**, and its reverse field is incomplete at 86, 90, 112 and
  wrong-direction at ep 34 (F4). Count it as one instrument, and not a clean one.
- **Toei = TV Tokyo = ONE content instrument.** TV Tokyo's episode pages print Toei's first paragraph
  sentence-for-sentence (ep 30: 「竜魔人と化したバランの強さは想像を絶していた。バランはポップたちを次々に打ちのめすと…」
  identical in both; ep 35 identical up to Toei's 「しかし、」). C's "TV Tokyo's synopses" and A/B's "Toei's
  あらすじ" are the same text; C's ep-34 END is therefore fandom-reverse + coco13-shape + ONE licensor text,
  which still clears R3 because coco13 is independent. A's "lineup.toei-anim.co.jp prints the SAME text" —
  the cited path 404s today; unverifiable, harmless (it would be the same source anyway). coco13 also QUOTES
  the official synopsis verbatim in each post (「公式サイトより引用」) — its 原作 line and 変更点 list are its own,
  the あらすじ is not.
- **coco13.club** — a single-author WordPress fan blog (affiliate links to the 新装彩録版), writing per episode
  「原作を読み返しながらアニメを視聴して判明した変更点・カットシーン」. Tier: the protocol's "scene-level comparison blog"
  — a legitimate second instrument, independent of the fandom and of Toei, and the ONLY intra-chapter
  position instrument on this series. Verbatim-checked for every episode 17-36: it agrees with the fandom on
  every chapter number ≤ 121 and disagrees NOWHERE. Two cautions B's hand-off to d-g must carry: (i) above
  121 its numbers are the PRINTED space (124 = 恐怖の超魔生物, 128 = 閃光の大逆襲) → +1 into OUR space, the same
  conversion as the fandom's; (ii) not everything on a coco13 page is the blogger — B's ep-29 "coco13 states
  it was 原作では一瞬" is an embedded reader tweet (@Hiryu_Jinrai, 2021-04-24), and B's ep-27 "coco13 states the
  manga draws it after Hyunckel goes down" I could not locate in coco13's ep-27 差分 list (the reorder is
  established by the fandom ch-98 "27 (Partial), 28 (Partial)" + ep-27 差分 + Toei's closing paragraph, so the
  annotation stands; soften the attribution).
- **en-WP** volume list (titles + boundaries) and **ja-WP** 各話リスト（2020）(titles + dates 17-35 all match:
  17 不死身の救世主 1/30 … 35 決勝戦の異変 6/5; no 原作 column) — verified. **Out A Times** — a fan-run listing
  site (旧コミック版 basis), used here only for the printed numbering (F1f), corroborated by coco13 + ja-WP's 話数.
- Honest independence count for a chapter NUMBER on these rows: fandom (1) + coco13 (2) + Toei/TV Tokyo at
  beat level (3) + en-WP namesake where the title matches. flag #929 is answered on this range: there is now a
  second per-episode chapter instrument (coco13); it is fan-tier.

### F8 — Mechanical scan across the three files — SOUND
- Row accounting: 18 anchors = 18 targets; no filler rows in the block; no anchor_hostile needed; T27 clean
  (no type corrections proposed, none owed); no A1 / A44 exposure.
- Internal consistency: every chapters_adapted agrees with its START / END (ep 35's "121, 123, 124, 125
  (partial)" skips 122 by design); continues 23→82, 24→86, 25→90, 27→98, 28→101, 29→104, 30→108, 31→111,
  32→114, 35→125 each equal the next row's START (35→125 = the fandom ep-36 field "124 (partial)" = OUR 125);
  rows 18-22, 26, 33, 34 end on a chapter's last page (coco13 "…まで" without a qualifier) and correctly owe none.
- Monotonicity: 63 < 68 < 72 < 75 < 78 < 81 < 86 < 89 < 94 < 97 < 100 < 103 < 108 < 111 < 114 < 117 < 120 <
  125; the 23/24 (81|82) and 29/30 (103|104) seams agree on both sides; all above the fence (59 or 60).
- Volumes: all 18 match the stored table by the END's volume (63/68 v7|v8 — 68 is v8 ✓, 72 v8, 75 v8, 78 v9, 81
  v9, 86 v10, 89 v10, 94 v10, 97 v11, 100 v11, 103 v11, 108 v12, 111 v12, 114 v13, 117 v13, 120 v13, 125 v14).
- `sliverStart` on all 18: `lead-is-start` everywhere (nothing moves); `sliverEnd`: see F2.
- Scope: single-season entry; fandom 2020 numbers = OUR numbers (ja-WP title+date join); the fandom's "episode
  37.5" recap is outside the range; no sibling-manga numbering anywhere.
- Citation quality: no content farms; every quoted fandom field, Toei sentence and coco13 line reproduced
  verbatim except the two attribution nits in F7.

## Verdict per claim

| claim | verdict |
|---|---|
| (1) fault line: fandom N = OUR N+1 for OUR 123-207; slot 122 = 番外編; batch-17 rows unaffected; ep-1 183 → 184 | SOUND WITH CORRECTIONS — true against OUR space (verified at v13/14, v19/20/21, and 349 = 349 at the top); OUR space is +1 over the PRINTED tankōbon from 122 to the finale (348) — a series chapter-space ruling is owed (F1) |
| w13b ep 28 graft{196} | REFUTED as written → OUR 197 (F1b) |
| (2) ep 17 END 60 → 59 (A47) | SOUND WITH CORRECTIONS — 59 on three instruments; the ch-60 share is a relocated beat, wording + `rearranged{60}` (F3); subject to the F2 convention |
| ep 23 → 81 held, partial{82} | SOUND (hold side of F2) |
| (3) B's holds 25 → 89, 27 → 97, 28 → 100, 29 → 103 vs 24 → 86 | SOUND and internally consistent (最初/序盤 ⇒ hold, 中盤 ⇒ advance); NOT consistent with C (F2) |
| C's advances 30 → 108, 31 → 111, 32 → 114 | SOUND on the sources, REFUTED as a convention — same evidence shape B held; C's "stored convention" basis pre-dates A47; the candidate set is 30/31/32, not 30/32/35 (F2) |
| C's 35 → 125 [121] "121, 123, 124, 125 (partial)" v14 | SOUND (途中 = the ep-24 shape; +1 applied correctly; coco13's 124 is the printed number) |
| (4) ep 34 field correction (drops 118, adds 121) → 120 [118] | SOUND — lift medium → high (F4) |
| ch 112 reverse field → ch 112 is ep 32's, ep 31 END ≤ 111 | SOUND (coco13 31/32) (F4) |
| medium rows 31, 34 | 34 → high; 31 → high after the F2 ruling (F5) |
| (5) spot-checks 19, 21, 22, 24, 26, 33 (+35) | SOUND (F6) |
| (6) independence: fandom fwd+rev = one; Toei lineup = same text; coco13 tier | SOUND WITH CORRECTIONS — Toei = TV Tokyo (one instrument); the fandom reverse field is defective at 86/90/112; coco13 = comparison-blog tier, independent, printed-space numbers above 121, two attribution nits (F7) |
| volumes (18) vs the stored table | SOUND on all 18 |
| row identity 17-35 (ja-WP title + date) | SOUND |

## Verdict on the verdicts

All eighteen chapter values are supported by the sources, every volume checks, every continue points at
the next START, and the three files are monotone across both seams. Three things must not pass curation as
written: (1) B's ep-28 graft chapter 196 → **197** (a fandom number in OUR space — the wave's own trap);
(2) the A47 convention — A and B hold on 最初/序盤 tails, C advances on the same shape at 30/31/32; Sean rules
one convention and eight rows follow it (the hold reading is the ledger-conformant one and costs three
edits: 30 → 107, 31 → 110, 32 → 113, each with a `partial`); (3) the ep-17 repair's wording — 59 stands, but
the ch-60 share is the relocated Crocodine/Dai beat (`rearranged`), not a cliffhanger. Lift ep 34 to high.
Above the row level: OUR 349-slot space is en-WP's construction; the printed tankōbon (and coco13, and the
fandom below 207) number contiguously, so every rendered anchor ≥ OUR 123 will read one higher than the
第N話 in the reader's hands through the finale — a chapter-space ruling is owed before sub-blocks d-g land,
and coco13's numbers above 121 need the same +1 as the fandom's when handed to those agents.

## Summary (5 lines)

1. Fault line SOUND at 122/123 (Hero Avan page prev 121 / next 122 tankōbon; fandom |volume= 121→13, 122→14, 131→14, 132→15; v19/20/21 edges +1; fandom ep 100 = 349 = en-WP 349) — but the PRINTED tankōbon numbers contiguously (v14 opens 第122話 決勝戦の異変, v37 ends 第348話; ja-WP 全343話+5), so OUR space is +1 over the books from 123 to 349: a series chapter-space ruling is owed before d-g land.
2. One REFUTED value: w13b ep 28 `graft{196}` is the fandom's number — OUR 197 (さらば我が子よ, en-WP 197, v21).
3. A47 is applied two ways: A/B hold on 最初/序盤 tails (17→59, 23→81, 25→89, 28→100, 29→103), C advances on the identical shape (30→108, 31→111, 32→114) citing pre-A47 batch-17 rows; Sean rules one convention — hold = 30→107, 31→110, 32→113 with `partial`s; sliverEnd moves nothing either way.
4. ep-17 repair 60→59 SOUND on three instruments (coco13 17 = 57-59; Toei; fandom ch-59 cast) but the ch-60 share is the relocated Crocodine-sends-Dai beat → wording + `rearranged{60}`; ep 34's field corrections SOUND (coco13 118-120 / 121) → high; ch 112 is ep 32's (coco13) → ep 31's doubt resolved.
5. Independence: fandom fwd+rev = ONE and its reverse field is incomplete at 86/90/112; Toei = TV Tokyo (one text); coco13 is an independent comparison-blog instrument, verbatim-consistent 17-36, whose numbers above 121 are the printed space (+1 into OUR) and whose ep-29 "一瞬" line is a reader's tweet.
