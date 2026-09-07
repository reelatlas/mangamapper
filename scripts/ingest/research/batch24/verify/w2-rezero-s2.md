# Batch 24 wave 2 — verifier report: re-zero-starting-life-in-another-world (rows 26-50, season 2 / Arc 4)

Verdict: `scripts/ingest/research/batch24/out/re-zero-starting-life-in-another-world-w2b.json` (Opus research-agent).
Sibling: `…-w2a.json` (rows 1-25) for the 25 / 26 seam. Verifier: Fable 5.1 (R24). Scope: R23 by the count — the checks A-G the
launch named, not a per-row citation fetch.
Method: every page I quote was fetched by me into `scratchpad/b24-verify-rezero-s2/` and grepped there (fandom en/es/ru/zh for eps
25-28, 30, 34, 35, 37, 42-46, 50, 51; the fandom volume pages and the Volume 11 / 12 synopsis subpages; the en fandom Arc 4 page;
en-WP season 2 + the episode list; ja-WP pageids 3333726 and 4469375; the licensor's tv2.html; Kadokawa's product pages for v9-12,
14-16; AFL; syobocal TID 5697; Bandai Channel 6988/001-002; the syosetu index p=3 and web-novel sections 49-51; the seven contents
scans v9-v15 viewed as images). MediaWiki `action=parse` JSON is `\u`-escaped, so Japanese greps ran on the decoded `wikitext.*`
of the cited URL; HTML pages were grepped in RAW bytes. `validate.ts` ok (25 targets, 25 anchors, 0 hostile, 1 continue, 9
annotations, 0 repairs, 1 type_correction, 5 flags); `scan.ts` ok (fence ep 51 → 16; 25 anchors 9…15; nothing to read). DB read:
`episodes` 25-52 (all `canon`, `format tv`, 26-50 `minted_by stitch`, 51+ `wiki`), `chapter_anchors` 24-52 (nothing stored on
26-50; ep 51 = volume 16 / chapter 16 / start 16 / source manual / continue null), `episode_annotations` (none on 26-50).

## Re:ZERO -Starting Life in Another World- — recap baseline (stored → verdict → verifier)

| ep | stored | verdict | verifier |
|---|---|---|---|
| 25 | canon ("That's All This Story Is About", 2016-09-19, no anchor) — w2a's row, the seam | (w2a) END 9 [9] {v9 ch 4-5}, no continue (C1 inside v9, derived) | seam SOUND: en `Volume 9 Ch 4-5 (Original)<br>… Ch 4-Interlude (Director's Cut)`, zh `第四章 - 第五章（旧版）… 第四章-幕间（新编集版）`, ru `главы 4-5`; the v9 scan prints 第五章 179 → 幕間『竜車でのひと時』 252; Kadokawa v9 ページ数 328. |
| 26 | canon ("Each One's Promise", 2020-07-08, no anchor) | END 9 [9] vol 9 {v9 幕間 252, 断章 258 (3 shots), 幕間 276, 第六章 292 — volume complete}, high; partial{断章}; canon confirmed | SOUND. en `Volume 9 (Interlude-Ch 6)`, es `Volumen 9 (Iinterludio-Capítulo 6)`, ru `Том 9, Интерлюдии 1-2, Глава 6`, zh `文库正传第9卷（幕间-第六章）` in my bytes; en-WP's summary opens on the carriage and the ambush; licensor 第26話 = Rem's erasure; ja-WP series article's 第三章 plot puts the ambush after the confession scene; title = v9 第六章『それぞれの、誓い』 on the scan. Not a double-length row (E). The 3-shot 断章 line grepped: `3 split-second shots of Subaru, Rem and their two children`. |
| 27 | canon | END 10 [10] {v10 ch 1-2; プロローグ『墓所』 dropped}, high; abridged{prologue} | SOUND. Four fields `Ch 1-2` / `Capítulos 1-2` / `главы 1-2` / `第一章 - 第二章`; en + zh: `The flashforward with Subaru meeting Echidna was omitted from the start of the episode.`; v10 scan プロローグ『墓所』 011 / 第一章 014; Kadokawa v10 `シリーズ紹介　第四章 追懐のクレマルディの聖域編` raw. |
| 28 | canon | END 10 [10] {v10 ch 2-3} | not sampled beyond the fields (four agree) and the title (v10 第三章『待ちかねた再会』 132 on the scan). |
| 30 | canon | END 10 [10] {v10 ch 5 + relocated ch-3 scenes}, high; rearranged{ch 3} | SOUND — a real relocation, not a transcription (C). en `Volume 10 (Ch 3,5)`, es `(Capítulos 3 y 5)`, zh `（第三章，第五章）`, ru `Том 10, глава 5` (the dissent, as stated); en `Most of the cut content that was cut in Episode 28 was moved to this episode` + `first appearance was moved to after Subaru took the first trial`; ru's own words `Несколько вырезанных моментов из 28 эпизода было добавлено в этот эпизод`. Both rows v10 — no move. |
| 34 | canon ("Love Love Love Love Love Love You", 2020-09-02) | END 12 [11] vol 12 {v11 ch 5-6 complete + v12 ch 1 opening share}, MEDIUM; partial{v12 ch 1}; flagged | VALUE SOUND, BASIS WRONG (finding 1). The four fields are ONE lineage at chapter granularity (es/zh plot text is en's translated/copied, ru's differences are en's bullets) — "four independent lineages" fails R3's lineage clause. But the share exists on evidence outside the family (en-WP, Kadokawa's v12 blurb, the fandom's book-side Arc 4 page, the author's WN structure), so A47's existence clause is met and the unproven-tail convention advances the END: keep 12 [11], re-base the note / partial / flag. |
| 35 | canon | END 12 [12] {v12 ch 1-3} | SOUND. Four fields `Ch 1-3`; en-WP: the counter-attack with the Ryuzu clones, Garfiel killed, the suicide, the lab, the "Apostle of Greed"; the Arc 4 page's v12 ch 1 notes put the swallowing and the suicide in ch 1; title = v12 第二章『地獄なら知っている』 048. |
| 37 | canon ("The Witches' Tea Party") | END 12 [12] {v12 ch 5-6 — volume complete}; divergence slivers; canon confirmed; the title trap stated | SOUND (D). Four fields `Ch 5-6`; en-WP: the second trial, Carmilla, the contract offer, the other witches, Satella's invasion; licensor 第37話 = the second visit to Echidna; the trap is real on the scans — v11 第五章『魔女たちの茶会』 239 vs v12 第六章『魔女の茶会』 282; additions grepped (`Although briefly, new scenes from the second trial were added`, `never happened in the Light Novel`) are beats inside the adapted chapter — canon under T28. |
| 42-46 | canon | END 14 [14] ×5 {ch 1-2 / 2-3 / 2,4-5 / 2,5 / 5-7}; rearranged{ch 2 over 42-45, ch 5 over 44-46} | SOUND — a real cross-cut (C). All four wikis carry the identical split on each of the five rows (my bytes); licensor 第43話 names both strands (`まだ聖域が聖域と呼ばれる前の出来事` + Emilia's trial); v14 scan 第二章 061 / 第五章 219; flat at 14 — no move. |
| 45 | canon ("The Beginning of the Sanctuary and the Beginning of the End") | END 14 [14] {v14 ch 2 (4th share), ch 5 (2nd share)}; side_story{Kremaldy Forest Team…}; flagged | SOUND on the value and the kind; ONE SENTENCE WRONG (finding 3). Fields `Ch 2,5` on four; en `The episode adapted parts of` … `explaining how Echidna saved Roswaal from imminent death`; ru's own `адаптирована часть побочной истории`; the story page `is a Melonbooks shop exclusive limited edition short story that came with` Volume 14 (2017-09-25); licensor 第45話 sentence verbatim in raw bytes. The claim that a side_source "would flip this canon row to filler at write time" is false for an anchored row (lib/side-source.ts). |
| 50 | canon ("Offbeat Steps Under the Moonlight", 2021-03-24) | END 15 [15] {v15 ch 8, 幕間, 終章 — 蛇足 NOT animated}, high; abridged{蛇足}; continue 16 / parity (C3) | SOUND (seam ii). en `Volume 15 (Ch 8-Final Chapter)`, es same, ru `главы 8-9`, zh `第八章 - 第九章`; v15 scan 第八章 240 / 幕間 259 / 終章 298 / 蛇足『――再臨』 321 of a 328-page book (Kadokawa); omission on three lineages — en `was entirely omitted`, zh `…并为自己取名为欧米茄的场景被完全删除`, ru's own `Вырезана финальная сцена 4 сюжетной арки…назвала себя Омегой`; ep 51's field credits v16 ch 1-5 + v17 ch 4 only. |
| 51 | canon (wiki, "Theatrical Malice", 2024-10-02) — STORED anchor 16 [16] v16, manual — NOT in this ask | fence | the block closes at 15 one volume below it; no repair owed. ja-WP: `第五章『歴史を刻む星々』（文庫第16巻 - 第20巻、アニメ第3期 第51話 -`; Kadokawa v16 `シリーズ紹介　第五章 決戦の水門都市プリステラ編`. |

## Findings, ranked by damage

1. **(basis of the block's one straddle — renders in ep 34's note, its partial and flag 4; VALUE UNCHANGED) "ALL FOUR wikis credit
   it … four independent lineages" is one lineage.** In my bytes the es ep-34 plot is a translation of en's paragraph by paragraph
   (`Echidna … no parece haber límite alguno … "engaño"`), the zh 梗概 is en's English text verbatim with Chinese links
   (`enjoying another tea party with`), and ru's 'Различия' are en's three bullets translated (`Вырезана короткая сцена появления
   Ехидны прямо перед приходом Дафны`); the same is true on ep 26 (es `El carro de Otto sigue a un gran grupo de carros`; zh's
   older revision still says `wagon`). The w2a author's own second flag said exactly this ("ONE FAMILY at chapter granularity")
   and the w2b verdict repeats it for the PROSE (trap e) while counting the FIELDS as four. So the verdict's A47 argument, as
   written, rests on a premise R3's lineage clause rejects — and the wave-1 standard (ep 54 held at 17: one lineage for the v18
   share) would then apply here too.
   **What settles it — the share exists OUTSIDE the family**, so A47's existence clause is met and the delivery stands:
   (a) en-WP's ep-34 summary (independent): `She then starts devouring Subaru with her miasma but Garfiel saves him. Elsewhere,
   Roswaal is being devoured by the miasma`; ep 35 opens `Garfiel launches a counter-attack against Satella with an army of Ryuzu
   clones` — so the rescue, the Witch's turn toward the manor and Roswaal's engulfing are INSIDE ep 34.
   (b) The en fandom's Arc 4 page — a book-side page, the LN-vs-web-novel notes, not the episode field — assigns those beats to
   volume 12 chapter 1: `The Witch of Envy chases Subaru and Garfiel until they get far enough away. She then suddenly turns her
   attention towards the mansion` (its Chapter 1 bullet; the swallowing and the suicide follow in the same chapter).
   (c) KADOKAWA's own v12 blurb (raw bytes): 「四度目の機会を得たその場所で、スバルはついにあってはならない存在、『嫉妬の魔女』との邂逅を
   果たす。影に呑まれる集落、敵であるはずのガーフィールの助力、実験場と呼ばれた『聖域』の真実。」 — Garfiel's help is v12 content; the
   v11 blurb ends on Garfiel's 「てめェだけは、絶対に」 with no Witch at all.
   (d) Cross-check in the author's OTHER space (never a position): web-novel 第四章４９『らぶらぶらぶらぶらぶらぶゆー』 (11.3k chars)
   has a scene break `※※` right after Satella's first 「――愛してる」 (char 4557 of 11299), with Garfiel's rescue (6569) and the
   rooftop (7471) after it and the 「愛してる」 torrent at its end; ５０『遠い雄叫び』 is the clone counter-attack to Garfiel's death;
   ５１『…みー』 opens on his death and ends on the handkerchief suicide. The printed v11 第六章 runs pp 312-≤328 (~12 story pages, a
   328-page book) — far too short for all of WN 49 — so the LN's cliffhanger falls at that break, with the rescue and the turn
   toward the manor in v12 第一章 (37 pages, 011-047). Consistent with (b) and (c); the exact seam page is still unstated.
   Size: no page count, no teaser wording anywhere (en-WP's Roswaal beat is not marked post-credits; the fandom's plot ends on it
   as a scene) → the unproven-tail convention advances the END — the ep-77 decision-3 shape, not the ep-54 hold. **A47 / A10 / R3
   support END 12 [11], medium, partial{v12 ch 1}** with the basis rewritten: one wiki lineage + en-WP + Kadokawa's v12 blurb +
   the Arc 4 page's ch-1 notes (the WN break as a cross-check). If Sean rejects the second lineage, the alternative the flag
   already names is right: 11 [11] with the share kept in chapters_adapted and the partial re-worded; nothing else moves (ep 35
   starts inside v12 ch 1 on the same evidence).
2. **(citation over-claim, no data effect) "Four separately-hosted, separately-edited Re:Zero wikis … agree on 24 of the 25 rows"**
   (type_corrections.why) and every anchor's "four wikis agree" — separately hosted, yes (four wikiids); separately edited, no
   (finding 1). The canon confirmation does not need them: the licensor's 25 synopses are in my bytes and are LN content
   throughout (第26話 … 第50話 all present; the quoted 第28 / 31 / 43 / 45 sentences verbatim), en-WP's 25 summaries agree, ja-WP
   brackets `第四章『永遠の契約』（文庫第10巻 - 第15巻、アニメ第2期 第27話 - 第50話）` and its anime article says `原作の第三章ラストから
   第四章が映像化された。`, AFL types 26-50 `Manga Canon` on a 50-row page (my fetch), and the title test holds on the scans I viewed
   (v9-v15: every 第N章 string and page the verdict quotes matches, including 第三章『STRAIGHT BET』 117 and 第八章『らぶれたー』 286).
   Fix: wording — "four wikis (one editorial lineage at chapter grain)".
3. **(wrong sentence in flag 3 and the side_story note; kind unchanged) "A side_source annotation would additionally flip this
   canon row to filler at write time".** `lib/side-source.ts#sideSourceStandingProblem` flips only a canon/mixed row whose ONLY
   tie is an unadopted side_source; ep 45 carries an anchor (v14), which is a weight-bearing tie, so no writer would flip it.
   The kind itself is right on the merits — the same work, the same author, a store bonus bundled with v14 (the Dai 番外編 shape;
   `side_story` is on WEIGHT_BEARING_KINDS) — and it is labelled as a work in `chapters`, never a position. Fix: delete the clause.
4. **(wording, E) "syobocal's nine channels all show a 30-minute slot".** My TID-5697 bytes: EIGHT first-run airings of 第26話 in
   30-minute slots (ChID 19 23:30-00:00, 128, 59, 58, 20 22:30-23:00, 66, 90, 239 23:00-23:30, all 2020-07-08…11) and a NINTH entry
   that is AT-X's 2020-10-07 rerun in a 35-minute slot (flag 10; the same 35-minute slot recurs for 27-35). The conclusion holds
   — nothing is double-length; Bandai Channel `第26話 (29分)` / `第27話 (26分)` verbatim; ja-WP's S2 table has no 拡大 / 総集編 note
   (both strings hit only in S3's ep-51 footnote). Fix: "eight channels; AT-X's October rerun is a 35-minute slot".
5. **(attribution nit) 「このシーンからアニメ第2期が開始」** is in the ja-WP SERIES article (pageid 3333726, the 第三章 plot:
   `自分の想いを告白する（このシーンでアニメ第1期は終了し、このシーンからアニメ第2期が開始）`), not the anime article; ep 26 cites both
   pageids, so it lands. The verdict's reading (continuity, no re-used footage) is consistent with all four plot texts opening on
   the carriage; no recap annotation is right.
6. **(landing note, nothing wrong) the continue.** ep 50 → 16 is C5's never-covered shape (furthest covered + 1 with the skip
   named); the ledger's regime word is `unseen`, but `writeCuratedContinue` accepts only `parity | post_series` and the DB holds only
   those (954 / 46), so `parity` is the only landable kind and the note carries the skip (`the anime never shows it`). The C3
   skip predicate does not fire on an above-row continue, so no census class will list it. It differs from the END (15), so it is
   stored under decision 4, not derived.

## A. The instrument / space claim — SOUND
1. Arc map, grepped verbatim in my decoded ja-WP bytes: `第三章『再来の王都』（文庫第4巻 - 第9巻、アニメ第1期 第12話 - 第2期 第26話）` and
   `第四章『永遠の契約』（文庫第10巻 - 第15巻、アニメ第2期 第27話 - 第50話）`; the 既刊一覧 row for volume 10 carries `rowspan="6" |第四章`
   (11-15 follow, then `rowspan="5" |第五章` on 16); the header reads 既刊65巻+4巻（本編45巻…） = N35's 45; the anime article:
   `原作の第三章ラストから第四章が映像化された。`. Kadokawa raw bytes: v9 `第三章、王都再来編決着――！！`, v10 `シリーズ紹介　第四章
   追懐のクレマルディの聖域編`, v16 `シリーズ紹介　第五章 決戦の水門都市プリステラ編`; ページ数 328 on v9, v10, v11, v12, v14, v15, v16.
   The zh volume pages: 9卷 `Web第三章…的第六卷以及收尾部分`, 15卷 `Web第四章…的第六卷以及结尾部分`; en v9 `6th and final volume of
   [[Arc 3]]`, v15 `6th and final volume of [[Arc 4]]`, v12 `3rd volume of [[Arc 4]]`.
2. Every number is a volume: mechanically, all 25 rows have start ≤ end, volume = end, END sequence
   9,10,10,10,10,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,14,15,15,15,15 (monotone); every `chapters_adapted` names `vN ch M`
   with the printed page, and its vN set equals [start, end] on all 25; web-novel numbers appear only in notes labelled as the
   author's web-novel section (my syosetu index bytes carry 第四章３５『少女の福音』… １２９『――俺を選べ』, and 第四章４『次なる場所』 is the
   ep-27 exception the verdict states); the comicalization is named only to be excluded (ja-WP infobox 既刊13巻).
3. Seam (i) 25 / 26: the v9 scan prints 第五章 179 / 幕間『竜車でのひと時』 252 / 断章『ナツキ・レム』 258 / 幕間『イタダキマス』 276 /
   第六章『それぞれの、誓い』 292; the fields split exactly there (row 25 / 26 above); independent lineages: en-WP ep 26 opens on the
   carriage and the ambush, licensor 第26話 is Rem's erasure, ja-WP's 第三章 plot places the ambush after the confession. w2a and w2b
   state the same seam on the same page numbers — they agree.
4. Seam (ii) 50 / 51: stored ep 51 = 16 [16] (DB); ep 50 → 15 [15]; volume 15 ends 終章 298 → 蛇足『――再臨』 321 of 328; the 蛇足 is
   omitted on three lineages (row 50) and credited to no S3/S4 row (ep 51's field = v16 ch 1-5 + v17 ch 4). The continue 16 with the
   蛇足 named is the block's only continue — right (finding 6).

## B. Ep 34 — see finding 1: END 12 [11] medium stands on independent evidence; the verdict's own basis must be rewritten.

## C. The two rearranged records — both REAL, no position moves
ep 30: three fields carry `Ch 3,5`, ru carries ch 5 only, and two prose lineages (en, ru's own words) say ep-28 cuts were moved
here; v10 scan 第三章 132 / 第五章 258; both rows v10. eps 42-46: the identical five-row split on four wikis and the licensor's
第43話 naming both strands; v14 scan 第二章 061 / 第五章 219; flat at 14. Neither is a transcription error.

## D. Type confirmations sampled on 26, 37, 50 — canon stands; no recap / original under T28 / N8
26: additions are the army aftermath, the doctor, the moved suicide and the Puck explanation (`this scene does exist in the` web
novel) inside v9's ending — slivers; 37: added death-aftermaths inside 『えんでぃんぐりすと』 and one Wilhelm/Ferris beat — slivers
(not the shippuden-388 shape; the spine is the second trial + tea party = v12 ch 5-6); 50: outfit, a moved conversation, an added
Annerose beat, the Omega omission — slivers. No 総集編 in ja-WP's S2 table, none on AFL (all `Manga Canon`), en-WP's S2 table has
25 rows (ep 40 `NumParts = 2`, `Title_1 = Otto Suwen`, `Title_2 = A Reason to Believe`; ja-WP `TitleA/TitleB`), stored dates all
Wednesdays (computed), en-WP's ep-39 `Straight Bet` vs stored `STRAIGHT BET` = AFL's string on a stitch-minted row — no repair.

## E. The failed premise — CONFIRMED in one line
Ep 26 is a normal slot: eight 30-minute first-run airings on syobocal, Bandai Channel 29分 vs 26分, no 拡大 note on ja-WP — the
four-unit share is ~76 printed pages (252-328) in ~29 minutes, plausible for a dialogue-heavy close (finding 4 is wording only).

## F. R25 scan — CLEAN
Summary map = anchors (all seven ranges, the END string, 24 high / 1 medium = ep 34, NO REPAIRS, ONE continue, two rearranged);
type_corrections episodes = 26..50; every annotation episode is a row; per-episode annotation segments sit inside their row's
[start, end]; the structure notes' 25-row map equals the anchors; flags name rows 26/51, 26, 45, 34/35/54, 50/79; the title-test
list has 23 entries (26…50 minus 27, 37). `validate.ts` ok; `scan.ts` ok.

## G. Scope — CLEAN
"Director's Cut" / 新編集版 / Break Time / 休憩時間 appear only in structure notes and type_corrections as exclusions; Memory Snow /
氷結の絆 are not mentioned; `Re:IF` appears once inside ep 26's partial as the wiki's reference, never a position; the Break-Time
hazard is real (en-WP's list page holds a second `=== Season 2 (2020–2021) ===` under `== ''Break Time'' ==` with `Otto's Diary` /
`The Diary of Petra's Struggles`). ep 45's side_story is labelled as a work (title, Melonbooks, bundled with v14, 2017-09-25).

## Verdict on the file
**SOUND WITH FIXES** — all 25 volume values, the arc bracket, both seams, the canon confirmation, the empty repairs, the two
rearranged records and the one continue stand on pages I fetched. Fixes before apply: (1) ep 34 — re-base the note, the partial and
flag 4 on the independent lineages (en-WP, Kadokawa v12, the Arc 4 page's ch-1 notes, the WN break as a cross-check) instead of
"four independent lineages"; value 12 [11] medium unchanged, the 11 [11] hold is the alternative only if Sean rejects that basis;
(2) wording — "four wikis (one lineage at chapter grain)" in type_corrections.why and the notes; (3) delete the "would flip to
filler" clause in flag 3 / the side_story note; (4) "eight channels, AT-X's rerun 35 min" in the premise flag and structure notes.
Token usage: ≈ 385k (from 15.00M to ≈ 14.61M remaining).
