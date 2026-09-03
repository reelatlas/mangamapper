# Verify — dragon-quest-the-adventure-of-dai, wave 14 sub-blocks A (60-65), B (66-71), D (78-83)

Verifier: Fable 5.1 (R24 — the verdicts were authored by Opus research agents). 2026-09-03.
Files under review: `scripts/ingest/research/batch20/out/dragon-quest-the-adventure-of-dai-w14a.json`, `-w14b.json`, `-w14d.json`. Sub-block C (`-w14c.json`, 72-77) was read for the seams only.
Stored baseline read from the DB (read-only, `chapter_anchors` / `episodes` / `episode_annotations` / `volume_boundaries`): ep 57 → 207 [204] c208 "204 (bulk), 205, 206, 207, 208 (1 panel)" v23 + partial{208}; ep 58 → 212 [208] c212 "208 (bulk), 209, 210, 211, 212 (partial)" v23; ep 59 → 216 [213] c216 "212 (tail), 213, 214, 215, 216 (partial)" v24; eps 60-62 canon, no anchors; ep 100 → 348 v37 (source `mu`, note "Vol 37, Chap 349"). Volume table (printed): v23 207-215, v24 216-225, v25 226-235, v26 236-245, v27 246-254, v28 255-264, v29 265-274, v30 275-284, v31 285-294. Series totals 348 / 37.
Scratch: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/626dada3-d5b3-4dcd-b917-06bf2bdcd5e0/scratchpad/w14v/abd/` (fandom API pulls, the volumes page, the DB read script).

## Bottom line

- **The numbering claim is SOUND.** dragonquest.fandom's per-episode `adapted` field is the PRINTED number throughout 204-293 (every row in A, B, D and the 57-59 repairs). Tested with titles on three instruments that are not the fandom (coco13's title-bounded ranges, Toei's licensor synopses, game-anime.top's per-chapter number+title pages), plus two fandom-internal facts. The wave-13 inference that the fandom numbers vol 22's extra as its 207 is refuted: the fandom has no page for 大魔宮の秘密, its volumes page lists vol 22 as nine titles, and its ep-57 field links six ordinary `chapter 204…209` pages (its ep-61 field, by contrast, links a named side-story page — that is how it handles unnumbered matter).
- **The 57/58/59 END + continue + chapters_adapted repairs are SOUND** and identical across A, B, C and D. Apply once.
- **REFUSE A's ep-59 START repair (213 → 214).** The sources say the ep-59 share of printed 213 is "途中から" (from midway), the fandom marks it "(partial)", and A10 (a substantial leading partial takes the START) is the convention A itself applied on eps 60/63/64/65. B, C and D keep 213. The stored START 213 is already the printed 213 — nothing to change.
- **One convention fork Sean must rule uniformly:** B HELD ep 70's END at 249 while D ADVANCED eps 80 and 83 on the identical evidence shape (the fandom marks the chapter partial on both sides; coco13 and Toei stop the episode at the previous chapter). Either answer keeps the run monotone; the wave-14 A47 clause as pinned says ADVANCE, the source count (2 of 3) says HOLD. Pick one and apply it to 70, 80, 83 (and D's ep-79 START, the mirror case).
- ep 61 anchor_hostile + side_story: SOUND. All seams monotone A → B → C → D → (E's ep 84). No A1/T27 violations, no scope leakage.
- Minor text defects (do not touch rows): D's structure-notes chapter table is wrong at 268-270; B's ep-69 annotation and A's ep-97/98 aside each carry one title one chapter off; all three verdicts argue against a "ruled fandom shift from 208" that the ruling file no longer contains (stale premise, harmless).

## 1. The numbering (the weight-bearing claim)

### 1a. The title test — is the fandom's N the printed N?

The fandom's own chapter pages stop at 201 (`chapter 202/207/208/221/233/250/274/284` all `missingtitle`; `chapter 201` exists but is empty), so the test cannot run on the fandom's chapter titles. It runs instead on CONTENT: which chapter's story beats the episode carrying the fandom number actually contains, with the chapter ↔ title ↔ number map from en-WP's volume list (list − 1 from 123, the ruled N35 shift) and, independently, game-anime.top's per-chapter pages (which print 第N話『title』 with prev/next links and end at 第348話 with no 349 — i.e. the printed space).

| fandom N (row) | printed N = title (en-WP list N+1; game-anime 第N話) | alternative if the fandom were +1 (printed N−1) | what the episode contains (source not the fandom) | verdict |
|---|---|---|---|---|
| 208 (ep 57, whole) + 209 (1 panel) | 208 不屈の勇者・ダイ (game-anime 第208話 ends with the Avan Strash landing) / 209 恐怖の切り札 | 207 太陽を我が手に / 208 不屈 (1 panel) | Toei ep 57's last sentence: 「ポップたちが戦意を失いかけたそのとき、ダイが再び立ち上がる！」 (the 不屈 beat); Toei ep 58 opens 「…ダイが放ったアバンストラッシュは、見事にバーンに直撃した…自らの武器を呼び寄せる」 = 恐怖の切り札; coco13 ep 57 「204話"大魔王からの褒美"から…208話"不屈の勇者・ダイ"まで」, ep 58 「209話"恐怖の切り札"から」 | fandom 208 = printed 208 |
| 217 (ep 60, from midway) | 217 処刑宣告の罠 (game-anime 第217話; prev 216 最後の希望, next 218 ダイ戦線離脱) | 216 最後の希望 | Toei ep 60 opens 「魔王軍からの通告は、明後日の正午にヒュンケルとクロコダインを処刑するという内容だった」 — the execution-notice trap; coco13 ep 60 「217話"処刑宣告の罠"の途中から220話"五つめのしるし…！"の序盤まで」 | fandom 217 = printed 217 |
| 221 (ep 62, whole, first) | 221 破邪の洞窟 (game-anime 第221話) | 220 五つめのしるし | ep 62's own title is 破邪の洞窟; coco13 ep 62 「原作24巻の"破邪の洞窟"から"希望への前進"の途中まで」; ep 60 already holds 220's opening and ep 61 is the side story | fandom 221 = printed 221 |
| 236 (ep 66, opening) / 239 (ep 67, last, whole) | 236 魔界軍団包囲網 (game-anime 第236話) / 239 その人の名は | 235 五色の光 / 238 殺意の毒牙 | Toei ep 66 ends 「ザボエラが超強力なモンスターを戦場に投入し…」 (the Makai army committed = 236's opening); Toei ep 67 ends with Popp shouting Maam's name and his mark blazing 「マァムの名前を叫ぶのだった。すると彼のアバンのしるしがまばゆく輝き始める」 = その人の名は (239); Toei ep 68 opens AFTER the awakening; coco13 66 = ロン・ベルクの秘密 → 魔界軍団包囲網 序盤, 67 = 魔界軍団包囲網 序盤 → その人の名は | fandom 236/239 = printed 236/239 |
| 250 (ep 71, first) / 253 (ep 71, opening) | 250 真竜の闘い (game-anime 第250話; prev 249 マァムの返事, next 251 出たぞ!!超必殺技) / 253 最後の一太刀 | 249 マァムの返事 / 252 燃えつきる生命 | Toei ep 70 ends on Maam's answer to Popp (マァムの返事); Toei ep 71 opens with Popp's group returning to Dai and names the 「真竜の戦い」 legend, then Avan Strash X (251), Hadlar burning his life (252), the final stance; Toei ep 72 (title 最後の一太刀) opens on Hadlar rising after Strash X; coco13 71 = 真竜の闘い → 最後の一太刀, 72 = 最後の一太刀 の序盤から | fandom 250/253 = printed 250/253 |
| 274 (ep 78 END / ep 79 START) | 274 銀髪鬼ヒム (game-anime 第271話 未完の究極剣 → 272 最後の対峙 → 273 地獄からの生還者 → 274) | 273 地獄からの生還者 | coco13 ep 78 「原作29巻の"未完の究極剣"から"銀髪鬼ヒム"まで」, ep 79 「原作30巻の"兵士の昇格"から」; Toei ep 79 opens with Hym already revived-and-stronger 「地獄から蘇ったヒムは、これまで以上に強敵だった」 | fandom 274 = printed 274 |
| 283 (ep 81 END) / 284 (ep 82 START) | 283 アバン抹殺完了 / 284 正義の後継者 (game-anime 第284話; prev 283 アバン抹殺完了, next 285 勝利への誓い) | 282 白い宮庭の決闘 / 283 アバン抹殺完了 | Toei ep 81 ends 「突如としてキルバーンのトラップが発動。アバンはダイたちの目の前で、異空間へと連れて去られてしまった」 = アバン抹殺完了; Toei ep 82 opens on Avan already in the revenge space and Leona's feather/successor role = 正義の後継者; coco13 81 = さらば!闘いの日々よ → アバン抹殺完了, 82 = 正義の後継者 → 不動!!ミストバーン | fandom 283/284 = printed 283/284 |

Also checked: fandom `chapter 122` page = 決勝戦の異変!! vol 14 (game-anime 第122話 決勝戦の異変; en-WP list 123) and `chapter 196` = さらば我が子よ vol 21 — the fandom's own numbered pages are printed on both sides of the 122 seam; `chapter 121`'s `next` = "chapter 122 / Avan, The Hero — Side Story (Tankobon bonus)" — the side story is unnumbered on the fandom, exactly as in print.

Conclusion: at every check the fandom's number is the printed number and the +1 alternative fails on content. The three agents' shared claim stands, and the ruling text in `scripts/ingest/lib/rulings/chapter-spaces.ts` (as amended mid-wave: "THE FANDOM NEEDS NO SHIFT through at least ep 97") is correct for 204-293.

### 1b. Why wave 13's "fandom 207 = the vol-22 extra" was wrong

- The fandom's ep-57 field links `[[The Adventure of Dai chapter 204|204]] … [[The Adventure of Dai chapter 209|209]]` — six ordinary numbered-chapter links. Its ep-61 field is `Special chapter: [[Avan, The Hero — Side Story]]` — a named page. The wiki's convention for unnumbered matter is a named link, and it did not use one at 207.
- The fandom's `The Adventure of Dai volumes` page lists vol 22 as nine titles (戦慄の魔法力 … 絶望のバトル); no 大魔宮の秘密 entry. A site search for 大魔宮の秘密 returns only that volumes page and the series article — the fandom has no page for the extra at all.
- coco13's numbered statements (eps 55-60) are printed: 「204話 大魔王からの褒美」 (en-WP list 205), 「208話 不屈の勇者・ダイ」 (list 209), 「209話 恐怖の切り札」 (list 210), 「213話 世界破滅への序曲」 (list 214), 「217話 処刑宣告の罠」 (list 218), 「220話 五つめのしるし」 (list 221). Wave 13 G's Toei-pinned seam put 不屈の勇者・ダイ wholly in ep 58 with its first panel closing ep 57; both per-episode instruments (the fandom's "208, 209 (1 panel)"; coco13's "→ 208 不屈の勇者・ダイ まで" / "209 から") put 208 in ep 57 and only a panel of 209 after it, and Toei ep 57's closing sentence is the 不屈 beat itself.

### 1c. Where the fandom's one surplus number actually sits (for sub-block G, outside this scope)

The fandom's ep-100 field ends at 349 (printed 348 is the last chapter — game-anime 第348話 has no 349), so it gains exactly one number somewhere above 293. From coco13: ep 96 = 響く闇からの声 序盤 → 閃光のように (printed 332p → 334); ep 97 = 瞳の中の奇蹟 → 心を1つに 序盤 (335 → 338p); ep 98 = 心を1つに 序盤 → 咆哮 序盤 (338p → 342p). The fandom: ep 96 = 332p…335p, ep 97 = 335p, 336, 337, 338, 339p, ep 98 = 339p…343p. Ep 98's field fits coco13 only as list (−1); ep 97's field STARTS printed (335 = 瞳の中の奇蹟) and ENDS list (339 = 心をひとつに 序盤). So the surplus unit is INSIDE the fandom's ep-97 field, at one of its 336/337/338. A's placement ("its 338") and D's placement ("its 336") both fit; B's "at the 97/98 boundary" is slightly off (it is inside 97). The fandom's vol-36 list shows nine titles only, so which of 336-338 is the extra is not decidable from the fandom; G should not adopt any of the three placements without a page-level source. Note A's aside "between printed 337 神の涙 and 338 心をひとつに" has 神の涙 one high — 神の涙 is printed 336 (list 337), 最後の願い is 337.

## 2. The repairs on stored rows 57-59

| ep | stored | A | B | C | D | sources | verifier |
|---|---|---|---|---|---|---|---|
| 57 END | 207 | (flag only) 208 | 208 | 208 | 208 | fandom "204p, 205, 206, 207, 208, 209 (1 panel)"; coco13 「204話…から208話"不屈の勇者・ダイ"まで」; Toei 57 ends on Dai standing (208); game-anime 208 ends with the strash | **208 — SOUND**, v23 unchanged |
| 57 chapters | "204 (bulk), 205, 206, 207, 208 (1 panel)" | "204 (bulk), 205, 206, 207, 208, 209 (1 panel)" | same | same | same | as above | SOUND; the 1-panel tail is 209 恐怖の切り札's first panel (A47 holds, quantified) |
| 57 continue | 208 | 209 | 209 | 209 | 209 | coco13 58 opens 209 | SOUND |
| 57 annotation | partial{208} "a single panel of ch 209 (不屈の勇者・ダイ…)" | — | flag: → {209}, rename | — | — | — | the stored annotation is wrong in both number and title; when the row is repaired, rewrite it as partial{209} 恐怖の切り札 (1 panel) |
| 58 START | 208 | (flag) 209 | 209 | 209 | 209 | fandom "209, 210, 211, 212, 213p"; coco13 「209話"恐怖の切り札"から」; Toei 58 opens on the strash's hit + 光魔の杖 = 209 | **209 — SOUND** |
| 58 END | 212 | (flag) 213 | 213 | 213 | 213 | coco13 「213話"世界破滅への序曲"の途中まで」; Toei 58 ends past Block's sacrifice (212) at the sea + Mother Dragon | **213 — SOUND** (途中 → advance under the pinned A47 clause), v23 unchanged |
| 58 continue | 212 | 213 | 213 | 213 | 213 | coco13 59 「213話…の途中から」 | SOUND |
| 59 START | 213 | **214** | keep 213 | keep 213 | keep 213 | fandom "213 (partial)"; coco13 「213話"世界破滅への序曲"の途中から」 (from midway, not a tail) | **keep 213 — REFUSE A's 214.** A10: a substantial leading partial takes the START — the convention A itself applied on 60 (217 "from midway"), 63, 64, 65. A's "why" quotes 途中から and then labels it "(tail)": internal contradiction. A's own text concedes "the value is 213" under that convention. The stored 213 IS the printed 213 (world-destruction prelude) — no change needed |
| 59 END | 216 | 217 | 217 | 217 | 217 | fandom "…217 (partial)"; coco13 「217話"処刑宣告の罠"の序盤まで」; Toei 59 closes on the notice arriving, Toei 60 opens on its content | **217 — SOUND** (序盤, unquantified → advance), v24 unchanged (216-225) |
| 59 chapters | "212 (tail), 213, 214, 215, 216 (partial)" | "213 (tail), 214, 215, 216, 217 (partial)" | "213 (from midway), 214, 215, 216, 217 (opening)" | "213 (partial), 214, 215, 216, 217 (序盤)" | = B | — | take B's wording (matches the sources; "tail" is wrong) |
| 59 continue | 216 | 217 | 217 | 217 | 217 | Toei 60 opens inside 217 | SOUND |

Also: the stored notes on 57/58/59 quote list-space titles ("209 不屈の勇者・ダイ", "217 最後の希望", "213 思わぬ伏兵") — when the numbers are repaired, the note prose must be regenerated in the printed space or it will contradict the row.

## 3. ep 61 as anchor_hostile

| instrument | what it says |
|---|---|
| Toei ep 61 「勇者アバン」 | the whole synopsis is Avan's past: young Avan in Flora's Carl knights researching cooking, Hadlar's attack on Carl, 毒蛾の粉, Roca, the flash strike, Avan and Roca setting out. No Flora-tells-Leona frame, no present-day beat |
| coco13 ep 61 | 「アニメ第61話は原作13巻番外編の"勇者アバン"だよ」; 「61話は番外編であったため大きな変更はありませんでした」; changes listed are inside the side story (an added Avan's-mark / Carl-charm exchange); no mainline chapter named |
| fandom ep 61 field | `Special chapter: [[Avan, The Hero — Side Story]]` and nothing else |
| fandom `The Hero Avan` page | 番外編, V Jump November 1991 (released 1991-11-27), volume 13; navigation "previous: chapter 121 (tankobon ed.) / next: chapter 122 (tankobon ed.)" and "117 / 118 (bunkobon ed.)" — the bunkobon placement explains wave 13's "MangaDex 118" confusion; the 2020 prequel re-adapts it in its ch 1 |

Verdict: ep 61 adapts ONLY the unnumbered 番外編 — no numbered chapter, not even a framing sliver. anchor_hostile (A44) with a `side_story` annotation is right; the row stays `canon` (stored type is canon; A proposes no retype) and the parity continue 220 is honest (the reader's position does not move). A's provenance note (side_story on the source's own bonus matter, not side_source on the prequel) is correct: both per-episode sources name the 番外編.

## 4. Seams and monotonicity

| seam | left | right | verifier |
|---|---|---|---|
| A ep 65 → B ep 66 | END 232 (232 whole; fandom "229p, 230, 231, 232", coco13 「…"集結‼5人の使徒"まで」, Toei 65 ends with the five gathered) | START 233 (fandom "233, 234, 235, 236p"; coco13 「"ロン・ベルクの秘密"から」; Toei 66 opens 「ついに五人のアバンの使徒が集結した」 as recap) | clean chapter boundary, no continue needed on 65 — SOUND |
| B ep 71 → C ep 72 | END 253 (opening) | C START 253 ("253 (from its opening)"; coco13 72 「"最後の一太刀"の序盤から」) | straddle agreed on both files — SOUND |
| C ep 77 → D ep 78 | C END 271 ("271 (to its 終盤)"; coco13 77 「"ザボエラ最強変身‼"から"未完の究極剣"の終盤まで」) | D START 271 ("271 (completion)") | SOUND |
| D ep 83 → E ep 84 (E not yet delivered) | END 290 (opening) | fandom ep 84 = "290 (partial), 291, 292, 293"; coco13 84 「"魔宮の心臓"から"吠えろ！双竜紋"まで」; Toei 84 opens on Leona seized in the tower and the 魔力炉 | consistent with E starting on 290 (or 290 whole if E follows coco13 — see §5) |

Mechanical pass over A, B, C, D (24 anchors): every START ≤ END; ENDs strictly monotone 220 → 290; every END inside its stated volume; every continue equals END (C1) or END+1 (parity); chapters_adapted min = START on every row; max = END except the three declared held tails (B 70: 250; C 74: 262 hook; C 75: 265 relocated fragment). No `anime-only-canon`, no `side_source` as a type, no mapping on a filler/adopted row, no chapter above 348.

## 5. A47 — the one inconsistency in the wave

Same evidence shape, opposite handling:

| row | fandom | coco13 | Toei | agent's END | agent's basis |
|---|---|---|---|---|---|
| B ep 70 | "…249, 250 (partial)" (and 250 partial on ep 71) | 「…"マァムの返事"まで」 (249) | ends on Maam's answer (249) | **249 HELD**, tail as partial{250} | "only one of three sources places it inside 250, which ep 71 starts on" |
| D ep 80 | "…280, 281 (partial)" (and 281 partial on ep 81) | 「…"超戦士推参！"まで」 (280) | ends on Larhart's appearance (280) | **281 ADVANCED**, partial{281} | "no page count / teaser wording → A47's unproven-tail clause advances" |
| D ep 83 | "…289, 290 (partial)" (and 290 partial on ep 84) | 「…"予期せぬ難関…！？"まで」 (289) | ends 「レオナの背後には怪しげな影が這い寄っていた」 (289's hook) | **290 ADVANCED**, partial{290} | same |
| D ep 79 START (mirror) | "274 (partial), 275…" | 「"兵士の昇格"から」 (275) | opens with Hym already revived | **274** | took the fandom straddle (A10) |

Both agents flagged their own choice for Sean. The pinned wave-14 clause ("hold an END only on a page count ≤ 5 or teaser wording — an unquantified 'opening of X' ADVANCES") answers ADVANCE for all three; the evidence (two non-fandom instruments stop at the previous chapter each time, and the fandom marks EVERY split "(partial)" on both sides regardless of size) answers HOLD. I do not rule; I only say it must be ONE answer for 70, 80 and 83 (and 79's START), and that the run is monotone under either (249/250 < 253; 280/281 < 283; 289/290 < 293). If HOLD wins, D's continues (281, 290) already read correctly (they are the next row's START).

Where A47 was applied consistently and correctly: A advanced on every unquantified 序盤/途中 tail (59 → 217, 60 → 220, 62 → 223, 63 → 226, 64 → 229) and D on 79 → 278; the only quantified tail in the set (ep 57's "209 (1 panel)") is held — all per the pinned clause.

## 6. Text defects (rows unaffected)

- **D structure.notes (4), the printed table**: "268 究極の結論 / 269 ザボエラ最強変身 / 270 もうひとりの勇者" are the LIST numbers and 超兵器招来 is missing. Printed: 267 究極の結論, 268 ザボエラ最強変身, 269 もうひとりの勇者, 270 超兵器招来, 271 未完の究極剣 (game-anime 第268話 ザボエラ最強変身 → 第269話 もうひとりの勇者; 第271話's prev = 第270話 超兵器招来; en-WP list 269-272). D's rows start at 271 and are right; C's ep 77 (268 → 271) is right. Do not copy D's table into any note.
- **B ep-69 annotation**: "Ch 246 逆転… / 想いよ走れ…!!" — printed 246 is 想いよ走れ only; 逆転!! 女王の死角 is 245. The number is right, the gloss should drop 逆転.
- **A structure.notes (c) / flags**: "printed 337 神の涙" — 神の涙 is printed 336. And A's proposed "move the fandom shift to from 338" addresses a `sourceShifts` entry the ruling file does not contain (the fandom entry was removed when the ruling was amended mid-wave; only wikipedia/mu/afg shifts remain). Nothing to move; G decides whether a fandom entry is needed at all for 336-349.
- All three summaries argue against "the ruled N35 sourceShift {fandom, from 208, delta −1}". That was the contract at dispatch, not the ruling as it now stands. Harmless, but the apply should not re-litigate it.
- A's ep-60 fandom title reads ダイとボップ (a fandom typo for ポップ) — A did not copy it; noted only so nobody "corrects" the stored title from that page.

## 7. Citations

- **coco13.club** (per-episode 原作 comparison blog; quotes the licensor synopsis verbatim; states ranges by volume + chapter TITLE, and by number for eps 55-60 where its numbers are printed at all six checks). Independent of the fandom (different author, title-based, no wiki numbering). It is a fan blog and the only per-episode comparison for this series; used as one leg of every anchor by all three agents — acceptable, and I found no case where its title boundary conflicted with Toei's synopsis.
- **Toei Animation** per-episode あらすじ (licensor) — fetchable for every episode I tried (57-84). D cites NO Toei URL on any anchor (it says the official site was 403 and read the synopsis through coco13's quotes); the Toei pages are live and should be added to D's citations at apply time — as delivered, D's anchors rest on the fandom + coco13 + the en-WP map only.
- **en-WP volume list** (the chapter ↔ title ↔ volume map; list − 1 = printed from 123) — cited by all; its raw wikitext confirms every title/number pair the agents quote.
- **dragonquest.fandom** — the forward field is the primary numbering instrument; its reverse chapter pages do not exist above 201 (flag #929 stands: one wiki, and only its forward field is usable here).
- **game-anime.top** — a per-chapter summary blog; I used it ONLY as a printed-space number ↔ title map (cross-check tier), never for an anchor value.
- No content farms or AI summaries cited by any of the three verdicts.

## Rows

### dragon-quest-the-adventure-of-dai

| ep | stored | verdict | verifier |
|---|---|---|---|
| 57 | canon · anchor 207 [204] v23 c208 + partial{208} | B/C/D repair: END 208, chapters "204 (bulk), 205, 206, 207, 208, 209 (1 panel)", continue 209; A flags the same | SOUND — 208 [204] v23 c209; rewrite the annotation as partial{209} (恐怖の切り札, 1 panel) and the note prose in printed titles |
| 58 | canon · anchor 212 [208] v23 c212 | B/C/D repair: 213 [209], chapters "209, 210, 211, 212, 213 (partial)", continue 213; A flags the same | SOUND — 213 [209] v23 c213 + partial{213} |
| 59 | canon · anchor 216 [213] v24 c216 | A: 217 [214]; B/C/D: 217 [213]; all: continue 217 | 217 [213] v24 c217 — END/continue SOUND; **A's START 214 REFUSED** (途中から + A10); chapters per B: "213 (from midway), 214, 215, 216, 217 (opening)"; partial{213, 217} |
| 60 | canon · no anchor | A: 220 [217] v24 c220; partial{217, 220 (opening)}; divergence | SOUND (fandom + coco13 + Toei; 220's remainder never animated — the continue names it) |
| 61 | canon · no anchor | A: anchor_hostile (A44) + side_story 番外編「勇者アバン」 (back of vol 13, between 121 and 122); continue 220 parity; type unchanged | SOUND — only the unnumbered side story is adapted (Toei, coco13, fandom, The Hero Avan page) |
| 62 | canon · no anchor | A: 223 [221] v24 c223; partial{223 (first half)}; divergence | SOUND |
| 63 | canon · no anchor | A: 226 [223] v25 c226; partial{223, 226}; divergence | SOUND (Toei 63 ends with Ron Berk arriving with the repaired sword = 226's opening; Toei 64 opens on his weapons for everyone) |
| 64 | canon · no anchor | A: 229 [226] v25 c229; partial{226, 229}; divergence | SOUND |
| 65 | canon · no anchor | A: 232 [229] v25, no continue; partial{229}; divergence | SOUND — clean close on 232, hands to 233 |
| 66 | canon · no anchor | B: 236 [233] v26 c236; partial{236}; divergence | SOUND |
| 67 | canon · no anchor | B: 239 [236] v26, no continue; divergence | SOUND (Toei 67 ends on the mark blazing = その人の名は) |
| 68 | canon · no anchor | B: 242 [240] v26 c242; partial{242}; divergence | SOUND (Toei 68 ends on Albinass's hidden intent = 242's opening) |
| 69 | canon · no anchor | B: 246 [242] v27 c246; partial{246}; abridged | SOUND (annotation gloss "逆転…" should go — 246 is 想いよ走れ) |
| 70 | canon · no anchor | B: 249 [246] v27 c250; partial{250} (tail HELD); divergence | value SOUND either way; **convention fork with D's 80/83** — Sean picks HOLD 249 or ADVANCE 250 uniformly |
| 71 | canon · no anchor | B: 253 [250] v27 c253; partial{253}; divergence | SOUND; seam to C's ep 72 START 253 closes |
| 78 | canon · no anchor | D: 274 [271] v29 c274; partial{271}, partial{274}; divergence | SOUND |
| 79 | canon · no anchor | D: 278 [274] v30 c278 (medium); partial{278} | END SOUND; START 274 vs coco13's 275 is the mirror of the §5 fork — rule with it |
| 80 | canon · no anchor | D: 281 [278] v30 c281 (medium); partial{281} ADVANCED | §5 fork — 280 if HOLD, 281 if ADVANCE; continue 281 correct either way |
| 81 | canon · no anchor | D: 283 [281] v30, no continue | SOUND (Toei 81 ends on Avan taken = アバン抹殺完了) |
| 82 | canon · no anchor | D: 286 [284] v31, no continue | SOUND (Toei 82 opens on 正義の後継者; coco13 → 不動!!ミストバーン) |
| 83 | canon · no anchor | D: 290 [287] v31 c290 (medium); partial{290} ADVANCED | §5 fork — 289 if HOLD, 290 if ADVANCE; continue 290 correct either way |

## Sources used by the verifier

- dragonquest.fandom API (wikitext) — episodes 57, 58, 59, 60, 61, 62, 65, 66, 70, 71, 77, 78, 79, 80, 83, 84, 96, 97, 98, 100; chapter pages 121, 122, 196, 201 (and the missing 202/207/208/221/233/250/274/284); `The Hero Avan`; `The Adventure of Dai volumes`; site search for 大魔宮の秘密 / "Side Story" / "Tankobon bonus": https://dragonquest.fandom.com/api.php?action=parse&page=The_Adventure_of_Dai_(2020)_episode_57&prop=wikitext&format=json (and the analogous URLs)
- en-WP, raw wikitext: https://en.wikipedia.org/w/index.php?title=List_of_Dragon_Quest:_The_Adventure_of_Dai_volumes&action=raw
- coco13.club: https://coco13.club/daianime57/ 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 98
- Toei Animation: https://www.toei-anim.co.jp/tv/dq-dai/episode/summary/57/ 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 78, 79, 80, 81, 82, 83, 84
- game-anime.top (cross-check only): https://game-anime.top/dragonquest/manga-dainodaibouken/episode122/ 208, 217, 221, 236, 250, 268, 271, 284, 338, 348
- Ruling: `scripts/ingest/lib/rulings/chapter-spaces.ts` (dai entry); protocol: `scripts/ingest/research/batch20/PROTOCOL.md` (wave 14); prior verify: `scripts/ingest/research/batch20/WAVE13-RECOVERY.md`
- DB (read-only): `chapter_anchors`, `episodes`, `episode_annotations`, `volume_boundaries` for the series
