# verify: dragon-ball-super 1-76 (w5a, IDENTITY) — SOUND WITH CORRECTIONS (Fable verifier, R24; ~130k)

Verified against Sean's ruling of 2026-08-28 (Reading 1: source = the manga, AniList 86508 linked manually; standings RELATIVE TO THE MANGA; T28 = the CONTENT test; no fourth standing; the manga is an ALTERNATIVE realization, chapter numbers are CORRESPONDENCE).

Fetched: AniList GraphQL (21175 relations, 86508 node + relations); ja-WP ドラゴンボール超 wikitext (制作 §186-189, 漫画 §211-219, 相違点 §221-247, 書誌情報 table) and ドラゴンボールZ 神と神 wikitext; Kanzenshuu Manga Guide (/manga/super/, /battle-of-gods/, /future-trunks/) and Kanzenshuu's translation of the vol-1 Tori-Toyo interview (book version); the V Jump web とりとよ放談 (web.archive 2016-04-07); dragonball.fandom via API: eps 1-14 and 47-67 (all 35 pages: `Manga=` field + "Differences from the manga"), chs 1, 3-26 (`episode=` index + "Anime and Manga differences"), Universe 6 Saga, the chapter template, the episode list. Nothing on a standing is refuted. Two rows go to Sean as forks the verdict did not surface (4, 51); two note-level corrections on the ep-53 and ep-6 premises; one nuance for the I-family ruling.

## 1. THE DIRECTION TABLE — SOUND (every support fetched; nothing claims adaptation in either direction for any arc)

| claim in the verdict | source | verifier |
|---|---|---|
| Toriyama's outline is delivered as TEXT | ja-WP §186 verbatim 「テキスト（文章）形式で制作スタッフに届けられ」(cites the vol-1 book Free Talk); Kanzenshuu's translation of that Free Talk: "Since the original story you give me is text, I constantly have your manga by my side as I draw" | verbatim, holds |
| TV and manga staff produce 同時進行 from that outline; 相互に補完 | ja-WP §222 verbatim — SCOPED 「破壊神シャンパ編」以降; §211 for the manga generally | verbatim; the verdict scopes it correctly (the BoG arc is ruled via the film, not this sentence) |
| BoG / RoF TV arcs = the two films 再構成・再制作; the film article says the same from its side | ja-WP §189 and §1178; film article §58 「本作を原作とした「破壊神ビルス編」として…リメイク・再構成」 | verbatim, both directions |
| the manga's BoG arc is a ダイジェスト of the film, 65 pp (16+15+15+19) | ja-WP §213; Kanzenshuu arc page: 65 pages, ch 01 = 16, 02 = 15, 03 = 15, 04 = 19 | exact |
| RoF 漫画：未登場 | ja-WP §57 + §233; Kanzenshuu "omitted from the manga" | holds (batch 19's finding, unchanged) |
| Kanzenshuu: "each often go with their own separate take on events; … in contrast to … Dragon Ball and Dragon Ball Z … nearly direct adaptations" | /manga/super/ verbatim | holds |
| Future Trunks: Toriyama built the story from an editorial idea; screenwriters finish the TV scripts | ja-WP §186 verbatim | holds |
| the chronology (ch 5 2015-10-21 vs ep 28 2016-01-24; ep 41 2016-05-01 vs ch 13 2016-06-21; ep 47 2016-06-12 vs ch 14 2016-07-21; ep 67 2016-11-20 vs ch 26 2017-07) | fandom chapter `release=` fields; Kanzenshuu chapter list | holds; ch 26 is 2017-07-18 (fandom) vs 21 July 2017 (Kanzenshuu, V-Jump Sept 2017 issue) — a 3-day source disagreement, not load-bearing |
| manga divergences named (Whis coins "Blue" vol 1 pp 82-83; no SSB Kaio-ken vs Hit; Time-Skip explained via Whis; Vegeta SSG vs Black; Goku's Mafuba; Gowasu rescues Trunks early; body parts regenerate into separate Zamasus; Zeno erases the timeline incl. its Time Ring; ordinary sword; SS Rage anime-only) | ja-WP §224/§235-243; Kanzenshuu Future Trunks synopsis (Kibito spar, Vegeta "with the power and agility of Super Saiyan God", "Goku meanwhile uses the Mafūba", "each body part regenerates into a separate Zamasu", Gowasu + Kaiōshin "taking Trunks and Mai with them"); fandom ep 61/62/66/67 + ch 26 differences | all confirmed verbatim or near-verbatim |
| Geppuman / Piccolo's recruitment scene anime-only; Buu fails by sleeping (anime) vs wrong answers (manga) | U6 Saga page confirms Buu sleeps in the anime; the manga side and Geppuman I did NOT confirm from chs 6-8 | decorative, inside a note — not load-bearing; leave or trim |

**Nuance the I-family ruling must carry (not in the verdict):** the one documented flow FROM the manga TO the anime is COMPOSITION REFERENCE, not adaptation. ja-WP §211: 「テレビシリーズも漫画版のコマを参考にしている」, sourced to the V Jump web とりとよ放談, which I fetched — interviewer: 「鳥山先生の連載時、アニメは鳥山先生の漫画のコマを参考に製作されていたんですよね…それが今はとよたろう先生の漫画を参考にしているそうなんですよ」, Toriyama: 「ああ！ それがいいよ！ そのほうがまちがいがない！」. Toyotarou in the same interview: 「第1話以後は、鳥山先生のプロットを元に、僕の方で膨らませて描かせてもらってます」. So the ruling should say "the anime staff consult the manga's panels for staging where it is ahead in print; neither work adapts the other" — not "no contact". This strengthens CORRESPONDENCE-not-adaptation: the panels are referenced, the story is not transferred.

**Extra support the verdict missed:** AniList's MANGA node 86508 carries `ADAPTATION → ANIME 14837` (the Battle of Gods film) — AniList's own encoding of "ch 1-4 adapt the film", exactly arc 1's direction. (It also carries ADAPTATION → 133898 Super Hero and → 206812 Ginga Patrol, and SIDE_STORY → 94109 the RoF manga.) Apply should note that `pickManga`-style logic reading the MANGA side would see an ADAPTATION edge pointing at a FILM, not at 21175.

## 2. THE ALTERNATIVE CLAIM — SOUND

AniList 21175 (idMal 30694, 131 eps) relations: PREQUEL 20635 / 813 / 170083; **ALTERNATIVE → MANGA 86508** (idMal **89734**, RELEASING, start 2015-06-20, `chapters: null`, `volumes: null`); ALTERNATIVE → 14837 神と神, 20778 復活の「F」, 102352 SDBH; CHARACTER 2222 / 84627 / 98030; SEQUEL 101302 Broly; SUMMARY 206814 "Dragon Ball Super: Beerus" (2026). **No ADAPTATION edge on 21175** — the verdict's "its ADAPTATION-typed neighbours are none" is exact; flag #1016 is correct behaviour. Reverse edge 86508 → ALTERNATIVE 21175 present. Staff: Original Creator / Supervisor 鳥山明, Story & Art とよたろう.

Counts: ja-WP infobox 「既刊24巻（2025年4月現在）」, last listed chapter 其之百四 — the verdict's 24 / 104 holds, but the summary sentence attaches those counts to the AniList clause; AniList's fields are NULL (the recovery record says this correctly). Cosmetic. Volume boundaries vol 1 = 1-9, vol 2 = 10-15, vol 3 = 16-20, vol 4 = 21-24, vol 5 = 25-28: ja-WP 書誌情報 rowspans + fandom `volume=` on chs 3/16/17 agree.

## 3. THE RETYPE ep 53 → filler + partial — SOUND under the CONTENT test; the chapter string should read 16-17

| ep | stored | verdict | verifier |
|---|---|---|---|
| 53 | canon (AFL: manga canon) | filler + partial{17 (the Gowasu–Zamasu tea conversation, relocated)} | **filler + partial{16-17}** — agree on the standing; the carried beat is doubled in the source |

Evidence, all fetched: fandom ep 53 `Manga=` EMPTY, "The entire events of this episode were exclusive to the anime", then the counterpart note (Shin + Kibito visit, Kibito spars) — verbatim as quoted. fandom ch 16 differences: "In the manga, Zamasu fights against Kibito. In the anime they never met, instead, Goku went with Beerus and Whis to their world and Goku fought him instead." Kanzenshuu Future Trunks synopsis: "Meanwhile in Universe 10, Zamasu is training with Kibito of Universe 7 … Learning of Majin Boo's defeat, Zamasu is astonished…". Reverse index across chs 14-26: ep 53 appears in NO chapter's `episode=` list (ch 16 → 49, 51, 54; ch 17 → 54, 55, 57; ch 18 → 55, 56, 58, 59) — exact.

Content test row by row: the Beerus/Whis/Goku journey, Whis naming Zamasu, the Time Ring inspection by Beerus, Goku's spar, the Krillin/18/Marron scene — none carried. The ONE carried beat (Zamasu: mortals should be destroyed / Gowasu: Kais create and observe, interference is the God of Destruction's job, then tea) exists TWICE in the source: end of ch 16 ("Gowasu berates Zamasu for speaking so bluntly, telling him that such tasks are for the God of Destruction") and ch 17 (after Babari: "Gowasu tells him that that's the job of the God of Destruction while they, as Supreme Kais, are to maintain the peace … begins to prepare tea"). The tea staging is ch 17; the words are ch 16 too. Write `16-17`.

Note-level correction inside the same entry: "the manga's Beerus/Whis trip to Universe 10 is the LATER destruction visit (ch 18 = eps 58-59)" — the destruction is in **ch 19** (fandom ch 19 summary: "Beerus easily catches his attack and destroys him"; ch 19 differences: "In the manga, Beerus and Whis go themselves while Goku goes to fight Black, and Shin later shows up"; ch 18 → 55, 56, 58, 59; ch 19 → 56, 59). Write "ch 18-19".

The 91/94/95 shape (an original episode carrying one restaged source scene → filler + partial) fits exactly. Under Reading 1 + the CONTENT test, filler is the right standing; AFL's "manga canon" is the broadcast-date label the recovery already names.

## 4. ep 6 side_source{Battle of Gods film} — the SHAPE is batch 19's ruling; the "ZERO pages" premise is overstated; Sean must choose which of two consistent instruments, because the CONTENT test and the film precedent point different ways on this row

| ep | stored | verdict | verifier |
|---|---|---|---|
| 6 | canon | canon + side_source{BoG film} | **agree IF the batch-19 film precedent governs (recommended, for consistency with 18-27)**; the honest alternative under the bare CONTENT test is filler + partial{3}; plain canon is NOT a consistent option |

The film carries the content: ja-WP 神と神 あらすじ §65 verbatim 「パーティーに現れたビルスとウイスを目の当たりにし…ベジータは…ダンスまで踊って奮闘する…そのベジータの安堵の隙にブウとビルスがプリンを巡ってケンカになってしまう」; 原案 = 鳥山明, 脚本 = 渡辺雄介; §48: 90%以上のストーリーと台詞 from Toriyama's dialogue-bearing plot. NOTE the author basis differs from RoF: BoG's 脚本 is Watanabe (Toriyama = 原案 + the 90% plot), RoF's 脚本 is Toriyama alone — the batch-19 verifier's "author-written screenplay" argument does not transfer to BoG verbatim; the basis here is 原案 + plot, which T26's side_source (a licensed work by the source's author, named) still covers.

Premise correction: ep 6 is not zero-page. fandom ch 3 carries Vegeta's Planet Vegeta flashback (Beerus stepping on King Vegeta — "This chapter marks the debut of King Vegeta in the manga"), which ep 6 stages at the moment of meeting; ch 3 also opens with the pudding quarrel NARRATED ("Beerus explaining that he wanted to try pudding, Gotenks replied back by saying that Majin Buu ate it"); the vol-1 bonus page has Vegeta disappointed he could not show off his bingo dance. Kanzenshuu's synopsis confirms the jump ("the festivities have been interrupted … After quickly dispatching Gohan, Majin Boo, and Gotenks"). So ep 6 = one restaged flashback + a narrated outcome — the 91 shape against the manga, the 19-27 shape against the film.

**Does the same apply to other rows left plain?** The verdict argues the other twelve BoG rows have manga pages (true — every one has a `Manga=` field and sits in ch 1-4's index; ch 4's index omits 13, see §5) and that side_source there would suppress a real mapping. Agreed. But the verdict states "only ep 4 and ep 15 are filler in the arc" WITHOUT testing ep 4 against the film, and ep 4's premise is a FILM subplot: the Pilaf gang sneak into Bulma's party in 神と神 (ja-WP film §104: トランクス「忍び込んでいたマイに一目惚れし」; §93 Goten/Pilaf confusion) — ep 4 is Toei's whole-episode expansion of that subplot. If ep 6 takes the film instrument, ep 4 must be ruled by the SAME rule (stays filler as an expansion with no film-scale pages, or canon + side_source like 19-27's half-Toei rows). I lean "stays filler" (the film's Pilaf material is a running gag, not a sequence), but it has to be decided, not left unexamined.

| ep | stored | verdict | verifier |
|---|---|---|---|
| 4 | filler (AFL: filler) | no change | **put to Sean** — same rule as ep 6; lean filler (film carries only the premise) |

## 5. THE CONTENT TEST on the rows left canon — one row to Sean (51); 13 and 49 hold

All 21 episode pages 47-67 and chs 14-26 read. Every stored-canon row in 47-67 except 51 and 53 has a `Manga=` field, sits in a chapter's `episode=` index, and its CENTRAL beats are in that chapter (with the divergences the verdict records): 47 (ch 14), 48-49 (ch 15), 54 (ch 16-17: the Babari trip, the Vegeta spar, the Zeno call), 55 (ch 17-18), 56 (ch 18-19: Vegeta vs Black → Rosé), 57 (ch 17/20), 58-59 (ch 18-19), 60-62 (ch 20), 63 (ch 21-22), 64 (ch 22), 65-66 (ch 23-24), 67 (ch 25-26). Filler 50 and 52 are consistent with the manga ("Goku Black never follows Future Trunks to the present"; the Gohan visit is replaced by the restaurant scene).

| ep | stored | verdict | verifier |
|---|---|---|---|
| 51 | canon (AFL: canon) | canon + divergence{14-26} | **put to Sean: mixed under the CONTENT test** — the one carried beat is Future Trunks meeting Mai (ch 16: "Future Trunks also meets Mai, who is lovestruck by him … tells her that she is still alive in the future"); the rest — Cell's second time machine, Goku asking Whis then King Kai for training, Black's musing, the resistance FLASHBACK ("exclusive to the anime", fandom) — is not in chs 14-16 (grepped: no Cell time machine, no King Kai). Not filler: the carried beat is the episode's title. Not the 91 shape either — the flashback's CONTENT (Black appeared, the resistance formed, Mai led it) is ch 14's premise, staged differently. Mixed + divergence is the honest line; canon + divergence is defensible under the arc-wide digest reading. Sean's call. |
| 13 | canon (AFL: canon) | canon + divergence{1-4}; "corrected false positive" | **canon holds**; the ja-WP support cuts both ways. fandom ep 13 `Manga=` EMPTY + "entire events exclusive" (as the verdict says) and ch 4's index omits 13 — but ch 4's summary carries the Limitbreaker Kamehameha vs Beerus Ball clash and the SSG timeout, which is ep 13's spine. HOWEVER ep 13's other spine beat — Goku "fully merged" the god power and keeps fighting as a Super Saiyan — is NOT in the manga: ja-WP 相違点 §229 「超サイヤ人ゴッドが解除されず…悟空が超サイヤ人ゴッドのパワーを吸収したと言及されていない」, fandom ch 4 "Goku does not revert … during the battle". So ja-WP "discusses that exact exchange" as a DIFFERENCE, which supports "not anime-exclusive" and equally "half of ep 13 is not carried". Mr. Satan's bribe scene is anime-only. Canon + divergence is right for a digest arc where fandom says ep 9 is one page; do not cite ja-WP as confirming the exchange. |
| 49 | canon | canon + divergence{14-26} | canon holds — the arrival, Trunks's account, Bulma's fuel problem, the Goku spar are ch 15; only the closing incursion is anime-only (and ep 50, its continuation, is already filler) |

## 6. Internal consistency — CLEAN

`episodes` are integer LISTS everywhere (no spans); kinds ∈ {divergence, side_source, partial}; `anchors: []`, `continue_points: []`, `anchor_hostile: []`, `repairs: []`; one `type_corrections` entry, type `filler`; side_source carries no `chapters`; the partial's `chapters` is a string. 46 rows named across annotations + type_corrections; the other 30 (4, 15-17, 18-27 ruled, 22, 42-46, 50, 52, 68-76) are accounted for in the summary (A1 filler / the batch-19 ruling). divergence{1-4} lists 1, 2, 3, 5, 7-14 (12 rows) — ep 6 carries side_source ONLY, no divergence; the JSON and the recovery record's generated baseline table agree. The recovery's prose "divergence {1-4} on 1-14 (minus the filler 4)" is inexact (also minus 6) — prose only. The reverse index the verdict quotes for chs 5-13 (5→28, 6→28-30, 7→31-32, 8→32-33, 9→33, 10→33-34, 11→34-37, 12→37-38, 13→39-41) matches fandom exactly. Row identity: fandom's list 1-76 joined on title to the context's rows one for one.

Under Sean's constraint the `chapters` strings on the three arc-wide divergence annotations ("1-4", "5-13", "14-26") are CORRESPONDENCE ranges — the notes say so ("parallel telling, not a transfer"); apply must not render them as "adapted ch N".

## 7. Citation quality — CLEAN

ja-WP (with its own citations to the vol-1 book Free Talk, the V Jump web interview, 日経エンタテインメント), Kanzenshuu (Manga Guide + a translated primary interview), dragonball.fandom via the API (two-way index), AniList's API. No content farms, no AI summaries. AFL used as cross-check only.

## For Sean

1. **ep 53 → filler + partial{16-17}** — apply (the verdict's retype holds; chapter string widened; "ch 18" → "ch 18-19" in the note).
2. **ep 6** — choose the instrument: (A) canon + side_source{神と神} (the verdict; consistent with 18-27) or (B) filler + partial{3} + a series-level film note (the bare CONTENT test). Plain canon is not consistent with either rule.
3. **ep 4** — rule it by whatever rule ep 6 gets (lean: stays filler).
4. **ep 51** — mixed + divergence (content test) vs canon + divergence (the verdict). Lean mixed.
5. The I-family record should carry the panel-reference nuance (§1) and AniList's manga-side ADAPTATION → the BoG film (§1), and state chapter numbers as correspondence.

## Recap baseline — every row the verifier would change or put to Sean (stored first)

| ep | stored | → verdict | → verifier |
|---|---|---|---|
| 4 | filler | no type change | put to Sean — same rule as ep 6; lean filler (no change) |
| 6 | canon | canon + side_source{BoG film} | agree under the film precedent (A); else filler + partial{3} (B); not plain canon |
| 13 | canon | canon + divergence{1-4} | no change; drop "ja-WP discusses that exact exchange" as confirmation — it records the difference |
| 51 | canon | canon + divergence{14-26} | put to Sean — mixed + divergence{14-26} under the CONTENT test (one carried beat: Trunks meets Mai, ch 16) |
| 53 | canon | filler + partial{17} | filler + partial{16-17}; note "ch 18" → "ch 18-19" |

All other rows: the verdict's line stands as delivered (1-3, 5, 7-12, 14 canon/mixed + divergence{1-4}; 28-41 canon + divergence{5-13}; 47-49, 54-67 canon + divergence{14-26}; 15-17, 22, 42-46, 50, 52, 68-76 filler unchanged; 18-27 untouched per batch 19).
