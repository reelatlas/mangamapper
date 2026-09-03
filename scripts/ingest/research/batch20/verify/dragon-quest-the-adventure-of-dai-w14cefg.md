# verdict-verifier — dragon-quest-the-adventure-of-dai, batch 20 wave 14, sub-blocks C / E / F / G (+ D's seams)

Verifier: Fable 5.1 (claude-fable-5-1), 2026-09-03. Authors: Opus research agents. R24 satisfied (different model).
Files under review: `scripts/ingest/research/batch20/out/dragon-quest-the-adventure-of-dai-w14c.json` (72-77), `-w14e.json` (84-89), `-w14f.json` (90-95), `-w14g.json` (96-100); `-w14d.json` (78-83) for the seams only.
Contract: `scripts/ingest/research/batch20/PROTOCOL.md` (wave-14 section); chapter space: `scripts/ingest/lib/rulings/chapter-spaces.ts` (dai, N35 — PRINTED 1-348).
Scratch: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/626dada3-d5b3-4dcd-b917-06bf2bdcd5e0/scratchpad/w14v/cefg/` (raw fetches of every source cited below + `scan.mjs`, the mechanical seam scan).

## Headline

The five files are mechanically clean across every seam, the 85-87 reorder is real and correctly shaped, and the finale is right (ep 100 → 348 [345] v37, the manga's last printed chapter, confirmed on three independent instruments). **Three ENDs are one chapter high** — D ep 83 (290 → 289), E ep 86 (301 → 300), F ep 92 (321 → 320) — each because the author advanced on the fandom's trailing `(partial)` while the licensor's own synopsis closes on teaser wording, which is A47's named HOLD case. One annotation is wrong in kind and chapter (G ep 96: the "335 sliver" is a forward-pulled fragment of 335, not a tail — the END 334 is right, for a reason G did not find). Everything else I checked holds.

## 1. Seams (all five files) — SOUND

Mechanical scan (`scan.mjs`) over the 29 rows 72-100: no START > END; STARTs and ENDs monotone; every sub-block's first START equals the previous block's END (or END+1 on a clean boundary); every continue equals the next row's START; every row's volume is the printed volume of its END (v28 = 255-264 … v37 = 341-348). The only `max(chapters_adapted) > END` hits are declared A47 tails / `rearranged` entries (74, 75, 85, 87, 96) — adjudicated in §3.

| seam | prev END | next START | continue | verdict |
|---|---|---|---|---|
| B→C (71→72) | 253 "(opening)" (w14b) | 253 "(from its opening)" | — | consistent (straddle, both sides partial) |
| C→D (77→78) | 271 (終盤) | 271 (completion) | 271 parity | consistent |
| D→E (83→84) | 290 "(opening)" | 290 (bulk) | 290 parity | **E is right that D's END should be 289** — see §3 / finding 3; the seam stays monotone at 289 → 290 |
| E→F (89→90) | 310 (first third) | 310 | 310 parity | consistent; the 310 share is two-source (§3) |
| F→G (95→96) | 332 (序盤) | 332 (bulk) | 332 parity | consistent (coco13 marks 序盤 on both sides) |

## 2. The 85-87 reorder (E) — SOUND, one prose inaccuracy

Sources state the jumps E describes:
- coco13 ep 85 変更点: 「ヒム救出場面が原作より早い段階で登場 … 原作ではヒム救出場面はバーンのカイザーフェニックスによるW攻撃の後でしたが … 時系列が変更され、原作より早い段階でヒムが登場しました」 — the forward pull is stated in words.
- coco13 ep 86 変更点: 「バーン戦、ミストバーン戦、キルバーン戦が原作と違い、同時進行で描かれている」 — the interleave is stated.
- morisan3rd 299 (不安な優勢): first half = Dai vs Barn, Barn launches the Kaiser Phoenix + 光魔の杖 simultaneous attack; second half = Larhart's blows fail, Popp about to be skewered, **Him arrives (the chapter's last beat)**. morisan3rd 300 (ミスト最終決戦) opens with the Maam/Hyunckel reunion (the merge), then Him's light aura, ending on 闘魔滅砕陣. morisan3rd 303 opens with Dai diving into the Kaiser Phoenix (the counter to 299's attack).
- Toei ep 85 closes 「頼もしい援軍がやってくる！」 (= 299's last beat, pulled forward); Toei ep 86 = 297 → 298 → the merge + Him's light aura (300); Toei ep 87 = 301 (闘魔滅砕陣 broken, 闘魔最終掌, settlement) → 302 (the mask debate) → **back to Dai vs Barn: the simultaneous attack (299a)** → Dai's counter, Douloura, second Douloura (303).
- fandom fields (fetched): ep 85 `294, 295, 296, 299 (partial), 300 (partial)`; ep 86 `297, 298, 299 (partial), 300 (partial), 301 (partial)`; ep 87 `299 (partial), 301, 302, 303, 304 (partial)`.

Running-order rule: ep 85 START 294 / END 296 (the forward-pulled 299b/300a never advance the END — A4); ep 86 START 297 is a genuine back-jump (`rearranged`, not a plain range) — correct; ep 87 START 301 (the main line opens on the White Garden), END 303 (the furthest mainline chapter in running order; 299a is a back-jump inside the episode) — correct. E's reorder map in structure.notes (4) matches morisan3rd + Toei + the fandom exactly.

One inaccuracy: E's ep-85 `chapters_adapted` labels the 300 share "Him's arrival pulled forward" and the note says Him's arrival is "the opening of ch 300 (morisan3rd)". morisan3rd 299 puts Him's arrival at the END of 299; 300 opens with the merge. The fandom's `300 (partial)` on ep 85 stands as data (probably the group's arrival), but the label is wrong. Prose only; no value moves.

## 3. END judgement calls under A47's unproven-tail convention

The wave-14 clause: hold ONLY on a page count ≤ 5 or teaser wording; an unquantified "opening of X" advances with a `partial`. The base rule (amendment 2026-09-02b): an END never advances on a trailing scrap (≤ 5 pages, or sliver / teaser / cold-open wording) of the chapter the NEXT episode starts on.

| ep | stored | verdict | convention as written? | verifier |
|---|---|---|---|---|
| 75 (C) | canon | END 264 [262]; `rearranged{265 (partial)}` | not an A47 case — A4 (relocated pages never advance) governs, and was applied correctly | **CONFIRMED, can go medium → high.** coco13 ep 75 変更点: 「バーンがミストバーンにアバンが生きていると伝える場面が、原作より早い段階で描かれている」; morisan3rd 265 opens 「場面は大魔王バーンがミストバーンを呼び出すシーンから。アバンが生きており緊急事態」 — the fandom's `265 (partial)` IS that relocated opening. END 264 stands. |
| 83 (D) | canon | END 290 [287]; `partial{290}` | **NO** — D wrote "no teaser wording exists", but Toei's ep-83 close is 「レオナの背後には怪しげな影が這い寄っていた……」 (teaser), and D had that line (it is inside the coco13 あらすじ quote D used) | **END 289.** morisan3rd 289 ends 「突然、触手がレオナを襲います」; morisan3rd 290 opens with the identification of the captor (魔力炉); Toei ep 84 re-narrates the seizure as its opening; coco13 bounds ep 83 at 予期せぬ難関 (289) with plain まで. The 290 share is the fandom's straddle mark alone. Continue 290 (parity) unchanged; E's ep-84 START 290 unaffected. (Same shape on D ep 80 → 281 — for the 60-83 verifier.) |
| 86 (E) | canon | END 301 [297]; `partial{301}` | **NO** — E wrote "no page count, no teaser wording"; Toei's close is 「ヒムが光の闘気をまとって攻撃を仕掛けていく。はたして、三局の戦いの決着はいかに――？」 (teaser) | **END 300.** morisan3rd 300 = the merge → Him's light aura at full → Mistbarn cannot counter → 闘魔滅砕陣 (the chapter's close); morisan3rd 301 = Him's Hadlar monologue, 闘魔最終掌, the counter. Toei ep 87 OPENS on 闘魔滅砕陣 being broken — so ep 86 ends inside 300. E cited story298/story301 but not story300, the chapter that actually holds the light-aura reveal; E's own note concedes the boundary is "blurred". The 301 share is fandom-only. Continue 301 unchanged; ep 87 START 301 unaffected. |
| 87 (E) | canon | END 303 [301]; `partial{304}` | not as written (no count, no teaser → the clause says advance) — E held on evidentiary grounds | **303 stands.** morisan3rd 303 ends with the Douloura volley; 304 opens 「連発されるドルオーラ … 吹き飛んでしまう大魔王バーン」; Toei ep 87 ends 「二撃めのドルオーラを放つ！」 (303's last beat), Toei ep 88 opens on the impact (304). The 304 share is fandom-only; nothing places 304's content in ep 87. See finding 5 for the policy. |
| 89 (E) | canon | END 310 [307]; `partial{310}` | **YES** | **310 stands.** morisan3rd 310 OPENS with the Phoenix Wing deflection and Popp/Brokeena consumed; Toei ep 89 narrates exactly that as its close (a death, not a teaser); Toei ep 90 opens by recapping it. Two sources for the share; coco13's plain range line (309 まで) is silence, not dissent. |
| 92 (F) | canon | END 321 [317]; `partial{321}` | **NO** — F called the 321 share "unquantified → advance" while Toei's own close is 「ショックを受けるレオナにある提案を持ちかける――」 (the proposal unnamed = teaser) and F cited that line as its evidence | **END 320.** morisan3rd 320 ends 「ダイが倒れ、大魔王バーンは王女レオナに悪の手をかけます … 自分のものにしようとします」; morisan3rd 321 opens with the proposal proper (魔界の歌姫となれ); Toei ep 93 re-narrates the proposal and Leona's refusal as its opening; coco13 bounds ep 92 at 不動の構え (320). Continue 321 unchanged; ep 93 START 321 unaffected. |
| 96 (G) | canon | END 334 [332]; `partial{332, 335}`, `rearranged{334}` | not the A47 test (no count, no teaser) — G held because the sliver is single-source | **334 stands, but the annotation is wrong in kind and chapter.** coco13 ep 96 変更点: 「ゴメスのロモス城での声掛けやノヴァのオーザムへ向かう姿を描いた場面が、原作ではダイが立ち上がった後だが、アニメでは前に描かれている」. morisan3rd 334 ends with Dai standing; morisan3rd 335 carries 「ロモス城でゴメスが誰かいないのか！と叫びます … ノヴァは這ってでもオーザムに行く気です」. So the fandom's `335 (partial)` on ep 96 is those scenes — a fragment of 335 pulled FORWARD before 334's climax (A4, the ep-75 / ep-85 class), not a trailing sliver. Correct record: `rearranged{335}` (Gomez at Romos / Nova toward Ozam, played before Dai stands), `partial{332}` only, and NO `rearranged{334}` (the reorder is not "within 334"). G's flag offering "334 → 335 if you prefer the tail to advance" is wrong: a relocated fragment never advances the END. |

## 4. The finale (G) — SOUND

- Toei ep 100 あらすじ (fetched): 鬼眼王 cut in two, Barn 爆散 (347 さらば!!大魔王); return to the surface, ピロロ = Killvearn's true body with a black-core doll, Dai flies alone into the blast, 「それから数週間――」 epilogue with the sword's gem shining (348 さらば!!!愛する地上よ). coco13 ep 100: 「この腕で勝利を(345)の序盤からエンディングまで」.
- My own confirmation of the terminal: Shueisha's 少年ジャンプ＋ atom feed for the series lists 第1話 … 第348話 contiguous (348 numbered entries; last = 第348話); en-WP's list 349 = 「さらば!!! 愛する地上よ」 (list 349 = printed 348 under N35); ja-WP: 全343話 読切や番外編を除いて, 単行本全37巻.
- MU pin "Vol 37, Chap 349 (2020)" → printed 348 v37 under the ruled `mu` shift — the stored value is confirmed, G adds START 345 and the split. No post-series continue is the honest value (no printed 349 exists).
- Fandom seam: fields fetched — ep 96 `332 (partial), 333, 334, 335 (partial)`; ep 97 `335 (partial), 336, 337, 338, 339 (partial)`; ep 98 `339 (partial), 340, 341, 342, 343 (partial)`; ep 100 `346 (partial), 347, 348, 349`. Eps 98-100 are list-space beyond doubt (a printed reading would put 343 大魔宮脱出せよ in ep 98 and end ep 100 on a chapter that does not exist). Ep 97's field cannot be fully printed either (339 世界が輝く時 is Toei's ep-98 content, and coco13 ends ep 97 at 心を1つに(338)の序盤). Ep 96's trailing 335 is printed 335 (§3 — the relocated Gomez/Nova scenes). So the seam sits INSIDE ep 97's field, as G says. **But G's "counts printed 335 twice" is an inference stated as fact**: `335p, 336, 337, 338 = printed 335-338 with a stray list-space 339p` fits the same evidence. Anchors are identical under both readings (97 = 335 → 338); the structure.notes should say "seam inside ep 97's field; the exact editorial artefact is not determinable". Low.
- No `side_story` owed in 96-100: en-WP's volume blocks v35/v36/v37 carry 9/9/8 numbered entries and 0 unnumbered (the list's only SP entry is vol 13's 勇者アバン); Jump+ 348 contiguous. Confirmed.
- Spot check of "the fandom's per-episode field is printed" (one, as asked): ep 94's field ends on 327; en-WP list 328 = 絆にかけて = printed 327 = ep 94's title. Pass. (Also: ep 96's field holds 334 whole, and 閃光のように = list 335 = printed 334 = ep 96's title.)

## 5. Internal contradictions, vocabulary, lists

- Summary vs rows: C, E, F, G each state their coverage in the summary and the rows agree (C 253-271, E 290-310, F 310-332, G 332-348). No ten-chapters-off class defect.
- Annotation kinds used: `partial`, `rearranged`, `divergence`, `abridged` — all in the closed vocabulary (PROTOCOL line 76). No `anime-only-canon`, no anchors on filler rows (all 29 rows are stored canon), no mapping on adopted / side_source rows.
- `chapters_adapted`: comma lists on every row (parenthetical qualifiers only). E's ep-85/87 lists carry long parentheticals — still lists.
- Confidence: G marks ep 96 "high" while its own flag calls the 335 share "one single-source page-level claim left standing" — mildly inconsistent; moot once the annotation is corrected per §3.
- **THE POLICY INCONSISTENCY (the one finding that spans files):** a trailing `(partial)` asserted by the fandom's straddle convention ALONE, with coco13 bounding one chapter lower and Toei's synopsis stopping in the lower chapter, is handled three ways across the wave — advanced (D 80, D 83, E 86, F 92), held under A47 (C 74, E 87, G 96), and in two of the advances the hold criterion (teaser wording) was actually present. The principled rule is R3 before A47: a share only one wiki's straddle mark asserts is not a proven share, so the END stays at the last chapter two sources place in the episode and the mark is recorded as a partial with its basis. Under that rule the deltas are exactly findings 1-3 (+ D ep 80 → 280 for the 60-83 verifier); E 87 and G 96 stand as delivered. Sean should pin ONE rule; whichever he pins, the three rows in findings 1-3 fail the convention as written today because of the teaser wording.
- **Cross-file contradiction on the fence repairs (outside the ask, flag only):** C, D, F propose ep 57 END 207 → 208, ep 58 208-212 → 209-213, ep 59 END 216 → 217; E proposes the OPPOSITE on two of them (ep 57 END 207 correct; ep 59 START 213 → 214 and END 216 correct). These cannot all be applied. coco13 prints explicit 話数 with titles on eps 57-59 (「208話"不屈の勇者・ダイ"まで」, 「209話 … 213話の途中まで」, 「213話の途中から217話"処刑宣告の罠"の序盤まで」) which favours C/D/F's set; E's dissent rests on morisan3rd's placement of single beats. Not adjudicated here — belongs to the 60-83 verifier / Sean, and no file's repairs should land unreconciled.
- E's summary/flag says the fandom's surplus number "appears only from its ep-98 field"; D, F and G locate it inside ep 97's field. G owns the row and is right; E's phrasing is the outlier. Low.

## Deltas for Sean (recap baseline — dragon-quest-the-adventure-of-dai)

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 83 | canon | anchor 290 [287] v31; partial{290} | **anchor 289 [287] v31**; the 290 mark is the fandom's straddle convention only — drop from chapters_adapted or keep as "fandom straddle mark" in the partial note; continue 290 (parity) unchanged |
| 85 | canon | anchor 296 [294] v32; rearranged{299, 300} | unchanged; relabel the 300 share in chapters_adapted (Him's arrival is 299's last beat; 300 opens with the merge) |
| 86 | canon | anchor 301 [297] v32; partial{301} | **anchor 300 [297] v32**; drop partial{301}; continue 301 unchanged |
| 87 | canon | anchor 303 [301] v32; partial{304} | unchanged (held correctly; see the policy note) |
| 89 | canon | anchor 310 [307] v33; partial{310} | unchanged (two-source share; convention applied as written) |
| 92 | canon | anchor 321 [317] v34; partial{321} | **anchor 320 [317] v34**; partial{321} stays as the teaser tail; continue 321 unchanged |
| 96 | canon | anchor 334 [332] v36; partial{332, 335}, rearranged{334} | anchor unchanged; **partial{332}** only; **rearranged{335}** (Gomez at Romos / Nova toward Ozam, pulled before Dai stands — coco13 ep 96 変更点, morisan3rd 335) replacing rearranged{334} |
| 75 | canon | anchor 264 [262] v28 (medium); rearranged{265 (partial)} | unchanged; confidence → high (morisan3rd 265 opens on the relocated scene) |
| 100 | canon · anchor 348 (mu) | anchor 348 [345] v37 | confirmed on Toei ep 100 + Jump+ (348 contiguous) + en-WP list 349 = printed 348; no post-series continue |

All other rows in C/E/F/G (72, 73, 74, 76, 77, 84, 88, 90, 91, 93, 94, 95, 97, 98, 99): checked against coco13's range line, Toei's synopsis and the fandom field; nothing found.

## Sources used (all fetched 2026-09-03; raw copies in scratch)

- Toei Animation あらすじ: https://www.toei-anim.co.jp/tv/dq-dai/episode/summary/NN/ for NN = 75, 76, 83, 84, 85, 86, 87, 88, 89, 90, 92, 93, 96, 97, 98, 100
- coco13: https://coco13.club/daianimeNN/ for NN = 75, 83, 85, 86, 87, 89, 92, 96, 97, 98, 100 (range lines + 原作との変更点・カットシーン sections)
- dai.morisan3rd.site per-chapter pages via the Wayback Machine (`https://web.archive.org/web/2025id_/https://dai.morisan3rd.site/entry/storyNNN`): 265, 289, 290, 299, 300, 301, 303, 304, 309, 310, 320, 321, 334, 335
- dragonquest.fandom episode fields (parse API, wikitext): eps 83, 85, 86, 87, 94, 95, 96, 97, 98, 100
- en-WP List of Dragon Quest: The Adventure of Dai volumes (parse API, wikitext) — chapter titles 320-349, volume blocks 35-37, the single SP entry
- ja-WP DRAGON QUEST -ダイの大冒険- (parse API) — 全343話 / 読切・番外編 / 全37巻; episode titles 96-100
- Shueisha 少年ジャンプ＋ atom feed https://shonenjumpplus.com/atom/series/13932016480029243319 — 第1話 … 第348話
- Repo: `scripts/ingest/research/batch20/PROTOCOL.md`, `scripts/ingest/research/batch20/WAVE14-RECOVERY.md` (stored standings), `scripts/ingest/lib/rulings/chapter-spaces.ts`, `scripts/ingest/research/batch20/out/dragon-quest-the-adventure-of-dai-w14b.json` (ep 71 fence)
