# VERIFY — yu-yu-hakusho-ghostfiles, batch 20 wave 2 (lane A2, rows 27-43)

Verifier: Fable 5 (R24 — the verdict was authored by Opus). Sources re-fetched 2026-08-27: fandom episode wikitext for eps 26-44 (all 19), fandom chapter wikitext for 46/52/53/54/55/56/63/64/65/66/72/73/76/77/81, the Dark_Tournament_Saga page, en-WP `List_of_YuYu_Hakusho_chapters` (raw), en-WP `Yu_Yu_Hakusho_season_2` (raw), ja-WP 幽☆遊☆白書 (manga, raw) and 幽☆遊☆白書 (テレビアニメ) (raw). Scratch: `/private/tmp/claude-501/-Users-sean-Projects-mangamapper/49d94ea1-3266-4937-9ee1-d7e4e22cba72/scratchpad/b20v2/yyh/`.

## Mechanical pass

17/17 rows: `chapters_adapted` agrees with START/END on every row (the two sliver rows 27 and 36 exclude their fragment from END/START by the stated rule, and say so). ENDs 53 55 56 58 59 60 61 63 64 65 67 69 70 72 73 75 76 — strictly monotone; every START ≤ its END and ≥ the previous END. Fence: ep 26 → 52 [51] (stored) ≤ ep 27 START 52 … ep 43 END 76 < ep 44 → 78 [77] (stored) — contained, no repair. Volume on every row = the fandom `volume` field of its END chapter (v6: 53, 55; v7: 56-63; v8: 64-72; v9: 73-76). Summary ↔ rows: chapter range 52-76, the six continues (28/30/34/38/40/42), the two MEDIUM rows (34, 36), "no anchor_hostile" — all match the rows. Six continues each sit IN the straddled chapter (END of the row = continue = START of the next row): 55, 58, 63, 69, 72, 75. No A1 exposure (all 17 rows canon, stored and AFL). Vocabulary: canon only. Repair `old` ("A Master of Love and Death") matches the stored row title in the context. Every fandom `Manga` field re-fetched matches the verdict's `chapters_adapted` string for all 17 rows plus the two fence rows (26: "51-52 (first half)"; 44: "77-78"). Row identity: ja-WP 各話リスト rows 27-44 carry the same dates and subtitles the verdict quotes (27 = 4月24日 死の船出!地獄の島へ … 43 = 8月14日 覆面戦士の厳しき素顔, 44 = 8月21日 幻海からの最大の試練).

## Findings, ranked by damage

### 1. THE CHAPTER SPACE — SOUND WITH A CORRECTION TO THE EXPLANATION (no value impact)

Verified: our numbers are the JP act numbering. fandom `Chapter_64` = 目を覚ませ!! "Open Your Eyes!!", volume 8; fandom `Chapter_72` = 霊丸を越えろ!! "Surpass the Reigun!!", volume 8; `Chapter_73` = 意外な敗北!? volume 9. en-WP lists "065. Open Your Eyes!!" as the first chapter of vol 8 and "073. Surpass the Reigun!!" as its last, "074. An Unexpected Defeat?!" opening vol 9, "078. The Huge Ordeal!!" (= act 77, the ep-44 fence START). So en-WP's labels run +1 from vol 8, exactly as the verdict states, and all nine anchors 35-43 are in act space. ja-WP manga page: 暗黒武術会編（act.52〜112）, act.052「暗黒武術会開幕!!の巻」; vol 8 = 霊丸を超えろ!!の巻, vol 9 = 最大の試練!!の巻 — corroborates.

Correction to the note's mechanism: en-WP does not simply "skip the number 064". Its vol-7 list ends "063." then an unnumbered line `Extra: "YuYu Hakusho Tales: Two Shot"` with the footnote: *"Viz Media counts this as chapter 64, so all subsequent chapter numbers are ahead by one when compared to the Japanese release. English Wikipedia follows Viz's numbering hereafter for consistency's sake."* So the +1 IS the Viz numbering (the Two Shot side story = Viz ch 64), not an unrelated en-WP artefact. The verdict's structure note calls the Viz +1 "separate, unrelated" — that sentence conflates two footnotes: the act-18-as-second-17 mislabel (en-WP ch 018 footnote) which Viz "fixed" at ch 046 (en-WP ch 046 footnote), and the Two-Shot-as-64 count which is the very cause of the vol-8+ shift. Suggested wording for the stored V6/structure note: "en-WP follows Viz from vol 8: the Two Shot extra is Viz ch 64, so en-WP NNN = act NNN-1 for acts ≥ 64." Values unaffected.

### 2. Anchors vs the evidence (rows 27, 34, 36, 43 + the namesakes) — SOUND

fandom infobox `Manga` fields (re-fetched): 27 = "Chapters 52 (second half)-54 (first page)"; 34 = "62-63 (first half)"; 36 = "64 (end only)-66 (start only)"; 43 = "75 (second half)-76"; 44 = "77-78". Saga page block map: 51-53/26-27, 54-60/28-32, 61-65/33-36, 66-76/37-43, 77-87/44-50 — matches the verdict's block claims. ja-WP subtitle ↔ chapter-title namesakes hold: ep 28 小さな強敵!鈴駒の秘技 ↔ act 55 秘技・魔妖妖!!; ep 33 激突!ベスト8出そろう ↔ act 61 ベスト8出そろう!! (verbatim); ep 37 闇の忍・魔性使いチーム ↔ act 66 魔性使いT登場!!; ep 41 霊光弾!意外な決着?! ↔ act 73 意外な敗北!? (partial namesake, "意外な"); ep 43 覆面戦士の厳しき素顔 ↔ act 76 覆面の下の素顔. ja-WP's 相違点 text cites `act.66「魔性使いT登場!!の巻」` directly beside the ep-37 (第37話 闇の忍・魔性使いチーム, 1993-07-03) Ruka discussion — the independent act-number citation the verdict relies on is real. The divergence annotations' citations (第32話, 第33話, 第37話, 第41話, 第42話, 第43話) are all present in ja-WP with the quoted content (Rinku/Chu slum meeting, Sakyo-brokered knife-edge, Karasu's route, Shizuru/Sakyo meeting; Karasu + Elder Toguro at ringside, 羅愚毘; Ruka as nurse + barrier damage; ropes peeling; lighter; Genkai baiting Yusuke).

A third, independent cross-check the author did not use: ja-WP's 各話リスト has a 編 column — 六遊怪T編 spans eps 27-33, Dr.イチガキ編 eps 34-36, 魔性使い編 eps 37-43, 裏御伽T編 opens at ep 44. This agrees with the saga block map's episode edges (28-32 Rokuyukai, 33-36 Ichigaki, 37-43 Masho, 44+ Uraotogi) up to ja-WP's grouping of the ep-33 rest day with the Rokuyukai block.

### 3. The sliver calls (ep 27 "54 (first page)", ep 36 "66 (start only)") — SOUND; the precedents support the author's reading

What the stored precedents actually say (context): ep 1 {1, 2 (p.1-2)} END 1, annotation "cold-close with the first two pages of ch 2; ep 2 re-covers ch 2 p.1-6, so END stays 1". ep 52 {89 (end only), 90-91} START 90, annotation "cold-open re-covers only the ending of ch 89 (already anchored to ep 51); start counted at 90 per majority rule". Both are Sean-applied and both say: a fragment the adjacent episode re-covers does not move END/START.

Do the sources show re-coverage here?
- 27/28: fandom ep 27's summary ends in the hotel room with Rinku and Zeru; `Chapter_53`'s cast list ends "…Rinku, Zeru" (the hotel visit closes act 53) and `Chapter_54` opens on Koto/Rinku/Zeru at the arena. fandom ep 28's field is a plain "Chapters 54-55 (first half)" (no "(from p.2)" qualifier) and its summary opens with the arrival at the arena and Rinku stepping up — ep 28 covers act 54 from its start. So "54 (first page)" is a ≤5-page cold-close that ep 28 re-covers → END 53 under the ep-1 shape. SOUND.
- 36/37: fandom ep 36's summary ends "The next team appears, five fighters in dark black cloaks, from Team Mashoutsukai"; fandom ep 37's field is a plain "Chapters 66-67" and its summary opens on the committee's announcement and Team Masho. ep 37 re-covers act 66 from its start → END 65. SOUND.

Sean's alternative (27 → 54, 36 → 66) is legal under a strict A4 reading, but it would contradict the series' own applied ep-1 ruling; the author was right to file the precedent reading and flag the fork.

### 4. The ep 35/36 boundary ("64 (end only)" → START 65, A12/A10) — SOUND

fandom ep 35 = "63 (second half)-64" (act 64 in full, no qualifier); ep 36 = "64 (end only)-…". This is the exact shape of the stored ep 51 {88-89} / ep 52 {89 (end only), 90-91} → START 90 pair. Content check: ep 35 ends with Yusuke rising to fire a Spirit Gun at the three fighters; ep 36 opens with the Masked Fighter stopping him and performing the Spirit Wave on the three — and act 65's title is 1対3!! "One vs. Three!!" (the Masked Fighter alone against the three), whose cast list opens Yusuke/Botan/Keiko/Kai/En/Ryo/Genkai. The Spirit Wave is act 65's subject, so ep 36's first-time content starts in 65 and the "64 (end only)" is the re-shown cliffhanger. START 65 is the better-supported reading; MEDIUM is the right label because the page split is unquantified in every source. The flagged alternative (START 64 + a continue at 64 on ep 35) would need a page-level source nobody has.

### 5. Volumes v6-v9 — SOUND

fandom `volume` fields: 46 → 6, 53/54/55 → 6, 56 → 7, 63 → 7, 64/65/72 → 8, 73 → 9, 81 → 9. en-WP (shifted): v6 046-055, v7 056-063(+Extra), v8 065-073 = acts 64-72, v9 074-082 = acts 73-81. Both witnesses agree with the verdict's v6 46-55 / v7 56-63 / v8 64-72 / v9 73-81, and with the stored v10 82-91. The ingest gap flag is correct (nothing below v10 in the table). Note for the ingester: ja-WP's 各話リスト has a 巻 column (第7巻, 第8巻 …) but that is the VHS/DVD volume, not the manga volume — the author did not use it; do not.

### 6. The fence and the ep-44 promotion — SOUND

ep 44 field "77-78"; saga semi-final block 77-87 / eps 44-50; ja-WP 幻海からの最大の試練 ↔ act 77 最大の試練!! (also vol 9's Shueisha subtitle); ja-WP 編 column opens 裏御伽T編 at ep 44. Four agreeing witnesses; value unchanged. Promotion to high is justified.

### 7. The six C1 continues — SOUND on content; one protocol-wording note for Sean

Each sits in the straddled chapter (55, 58, 63, 69, 72, 75) and equals the next row's START. The ledger's C1 text ("when an episode ends mid-chapter, continue-read is the straddled chapter itself") and the series' own stored rows (eps 10, 12, 14, 18, 20, 22, 23, 24, 26 all carry `continue N/parity` at mid-chapter straddles with no filler boundary) support delivering them. The batch-20 PROTOCOL wording is narrower ("straddle a chapter at a filler boundary (C1) — a plain forward-running row needs none"). The verdict follows the ledger and the series precedent, not the protocol sentence; this is the same shape the apply layer already holds for eps 10-26, so I read it as consistent, but it is Sean's call whether lane-A2 rows take C1 continues at all. No value is wrong either way.

### 8. Citation quality — minor

- For the mid-chapter split ("first half"/"second half") on rows 28/29/30/31/34/35/38/39/40/41/42/43, fandom's episode field is the only source that states the split; the second source in each case confirms the chapter identity (namesake title, saga block, cast order), not the split. That is inherent to the material and acceptable, but "high" on the split itself is fandom-only. No change proposed.
- Row 27's second source (saga block 51-53 / 26-27) is the same wiki as its first; the independent leg is the stored ep-26 anchor dovetail (52 first half → 52 second half) and act 53's cast order. Acceptable; noting for the record.
- The block-wide `partial` annotation on 14 rows includes eps 27 and 36, which also carry their own `partial` rows — a harmless duplicate kind on those two rows.
- Repair ep 42 title: en-WP season 2 raw reads "A Matter of Love and Death"; fandom infobox reads the same. SOUND. en-WP writes ep 36 as "A Trial by Light" vs our/fandom "A Trial of Light" — the author correctly left it alone.

## Standing

No REFUTED items. All 17 anchors, the six continues, the volume rows, the fence promotion and the title repair are SOUND. One wording correction (finding 1: the en-WP +1 is Viz's Two-Shot-as-64 numbering, not an unexplained skip — carry that into the stored V6 note). Two forks remain Sean's by design (the sliver default 27/36, the lane-A2 C1 policy).
