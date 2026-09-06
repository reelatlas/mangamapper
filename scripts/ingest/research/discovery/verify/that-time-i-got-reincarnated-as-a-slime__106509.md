# Verification — That Time I Got Reincarnated as a Slime × AniList 106509 (the five-OAD bundle, 番外編OAD) — related-works wave 3 (R24)

- Verdict under review: `scripts/ingest/research/discovery/out/that-time-i-got-reincarnated-as-a-slime__106509.json` (author: the Opus research-agent; verifier: Fable 5.1, 2026-09-05)
- Contract: `scripts/ingest/research/discovery/PROTOCOL-extras.md` (PER WORK). The owner's instrument AS STORED is Kawakami's manga node 86399 (chapter space 140, `mapping_mode` chapter) under `source_type` light_novel — finding 2 says what the row shows.
- Fetched raw: all five Kodansha limited-edition pages (the 発売日 / ISBN fields read from the markup, not a summary), ja-WP's anime and main articles via the API, tensura.fandom via the API (Season 1/OAD, all five `Extra:` pages, `Tales: Veldora's Journal 1`, the Manga page, The Slime Diaries page, four `list=search` queries), Bandai Channel's title page and eps 001-005, ANN, Famitsu, ABEMA Times (raw HTML), the official portal's OAD story/no1-5, intro and BD pages, and the ja-WP side-novel lists (8.5 / 13.5 設定資料集). AniList was not queried. Stored values below are read from the DB (`series`, `watch_order_entries`, `episodes`, `chapter_anchors`), not from the context file. `validate-extras.ts`: 0 problems; one over-cap warning (finding 7).

## Recap baseline — That Time I Got Reincarnated as a Slime (stored first, then the verdict, then the verifier)

| row | stored | → verdict | → verifier |
|---|---|---|---|
| 24.5 · AniList 106509 「転生したらスライムだった件 OAD」 (ova, 2019-07-09, relation SIDE_STORY) | **pending** (standing null) · kind ova · origin halo · chapter — · volume — · chapters_adapted — · unlabelled · note "adapts the series' own instrument: Tensei Shitara Slime Datta Ken (MANGA) — standing and chapters pending" | **filler** (high) · chapters [] · recap false · position confirmed 24.5 · adopted null · repairs [] | standing, chapters, recap, adopted, kind, date, title: **CONFIRMED on the sources** — five publisher-stated originals, no printed unit anywhere (findings 4-5 close the two hypotheses). Position right as a gap claim (after ep 24, before ep 25); the ORDER inside the 24.x gap against the stored Coleus row is inverted (finding 1). Note wording to correct at apply (findings 3, 6) |
| 24.1 · 「Visions of Coleus (Coleus no Yume)」 (wiki row, kind ova by the T29 ruling, no AniList id on the row, air_date null) | **standing null** · origin wiki · note "original story by Fuse … Set between S1 and S2 during Rimuru's Ingrassia teaching days … Type: anime-only-canon" (batch-14 text) | not mentioned — the sibling flag names only ヴェルドラ日記 and ヒナタ・サカグチ | ja-WP, ABEMA and the fandom all place the Teacher OADs BEFORE Coleus; stored 24.1 < 24.5 renders them after it (finding 1). The note's "Type: anime-only-canon" is a retired T27 string in a note field, outside this verdict (finding 7) |
| ep 23 「Saved Souls」 (2019-03-12) | **canon** · manual anchor start 52 → END 52 (vol 11) · adapted "52 (rest…), 54 (part: … tease)" · continue 40 (C3 note) | "OADs 3-5 sit internally inside eps 20-23" | the OADs post-date ep 23's spirit summoning (OAD 3 opens on flashbacks to it; Ken's light elemental is already resident in OAD 5) — "after ep 23, before ep 25" is the precise reading; no anchor touched (A1) (finding 6) |
| ep 24 「Black and a Mask」 (2019-03-19) | **filler** · no anchor | the work sits after this row | confirmed; A1 — no anchor proposed on it; ja-WP: 第24話「外伝：黒と仮面」は伏瀬が書き下ろした … アニメオリジナルストーリー (stored type corroborated, no change) |
| ep 25 「Rimuru's Busy Life」 (2021-01-12) | **canon** · manual anchor 40 → 40 (vol 9) | OAD 5 ends "with Rimuru leaving the Academy for Tempest — the ep 24/25 seam" | the fandom's OAD 5 summary closes "For now, they are needed back in Tempest. To Be Continued in Episode 25" — confirmed |
| 閑話：ヴェルドラ日記 (S1 recap, 2019-03-26) | **not held** — no episode row (our S1 = eps 1-24), no halo row | "the S1 RECAP special — a separate work, filler by N8 when it reaches the shelf" | confirmed: ja-WP 第24.5話, 3月26日, 総集編, on S1 BD vol 4 / DVD vol 8; not in ja-WP's 番外編OAD table. The NAME has a printed cousin — the manga's 巻末おまけ小説 「ヴェルドラのスライム観察日記」 (finding 4) |
| ep 91 「Death and Disappearance」 (2026-08-21, the last row) | **canon** · manual anchor start 142 → END 142 · adapted "142, 143 (part?)" · volume null | cited as "ep 91 END = ch 142" — proof the anchors are manga-numbered | confirmed from `chapter_anchors`; the series row's `latest_known_chapters` is 140 — the registered space lags the anchor frontier (finding 2, by-catch) |

## Conclusion: SOUND WITH NOTES — apply as FILLER at 24.5 exactly as delivered; rule the 24.x ORDER (the bundle before Coleus) at the same sitting, and correct two note sentences

Every verdict field holds on the primary sources: five discs, five originals, no chapter of the manga or the novel in any of them, no adoption, no repair. The one thing the verdict did not see is a stored sibling — the Coleus row at 24.1 — whose position renders the block in the wrong order; that is a ruling for Sean, not a defect in the verdict's stated claims. Nothing here is a REFUTED-class finding.

## Findings, ranked by damage

### 1. The 24.x cluster renders Coleus BEFORE the OAD bundle; three sources put the Teacher OADs first

**Stored** (`watch_order_entries`): 「Visions of Coleus」 at **24.1** (wiki row, batch 14, kind ova by the T29 ruling in `watch-order-labels.ts` keyed on position 24.1 / AniList 161802); this bundle at **24.5**. A viewer following our order watches Coleus, then the OADs.

**Sourced order** — the OADs, then Coleus:
- ja-WP (anime article, the Coleus paragraph's footnote): 「物語の時系列上では『外伝：リムルの華麗な教師生活』と第2期の間に位置する。」
- ABEMA Times (the guide the verdict itself cites): the numbered order is 2番目 OAD「外伝：Mの悲劇？」→ 3番目 OAD「外伝：HEY！尻！」→ 4番目 OAD「外伝：リムルの華麗な教師生活」→ 5番目 転生したらスライムだった件 コリウスの夢; summary 「第1期→OAD→「コリウスの夢」→第2期」.
- tensura.fandom, OAD 5 infobox: `next = Visions of Coleus Episode 1 → Episode 24.9 → Episode 25`.
- Content: OADs 3-5 are the Academy's outdoor-training week; Coleus (our own note) is "during Rimuru's Ingrassia teaching days (Yuuki's mission)" and ja-WP says after the Teacher OADs.

**Why it is the verdict's blind spot and not its error.** The context grid shows episode rows only and "EXISTING RULING: none"; the author had no view of the 24.1 row. The verdict's "24.5 confirmed" is right as "after ep 24" (Sean's mechanical check: stored 24.5 = proposed 24.5, verdict confirmed — consistent). But its flag 7 ("expect three works at or near 24.5 once they are ruled") names the two unheld 閑話 specials and omits the one sibling already stored, which is the one that inverts the order today.

**Settle** (Sean's call): either (a) a ruled `position` on this entry below 24.1 (the KONOSUBA precedent ruled a film to 20.52 behind its OVA), or (b) move Coleus behind the bundle (24.6) — which re-keys its T29 record. When the two specials land, the sourced gap order is: ヴェルドラ日記 (S1 recap, 2019-03-26) → this bundle → Coleus → ヒナタ・サカグチ (2021-01-05, fandom 24.9) → ep 25.

### 2. What the DB row shows on the instrument pairing — the verdict's flag 4 is right and understated

`series`: `source_type` **light_novel** · `manga_anilist_id` **86399** (Kawakami's manga — the node the halo note names as "the series' own instrument (MANGA)") · `latest_known_chapters` **140** · `mapping_mode` **chapter** · `total_chapters` null · `max_adapted_chapter` null · `source_relation` adaptation. `chapter_anchors` eps 19-27: chapters 37→52 with `volume` 8-11 (manga volumes), ep 25-27: 40-42 (vol 9), ep 91: 142 — all in the manga's numbering; the LN appears only inside note text ("LN vol 4 ch1", "LN vol 11 ch4 end / ch5").

Of the catalog's **35** novel-source series (`light_novel` / `novel` / `web_novel`) exactly **one** registers a manga id or a chapter space: this one. `lib/related-works.ts` documents the opposite shape — "a novel-instrument series (T25 light_novel / novel / web_novel) registers no manga id — its instrument is the NOVEL-format node(s)" — and T24 (planned) gives LN-sourced series a VOLUME-space instrument, "never a fake manga position". The `same_instrument` bucket that put this work in the programme fired precisely because `owner.mangaId = 86399` and the OAD's ADAPTATION edge (AniList `source: MANGA`) hits it.

Whether this owner is meant to be mapped on the manga (fan practice for this franchise; the manga is a close, sequential adaptation of the LN, and every anchor the catalog holds is in that space) or belongs in T24's LN volume-space is a T24 / T25 ruling — outside this verdict, and it does not touch the standing (filler against either instrument). **By-catch:** `latest_known_chapters` 140 < ep 91's END 142 (the anchor note dates ch 142 to 2026-05-26; the fandom's Manga page lists chs 141-145 not yet in a volume) — the registered chapter space lags the anchor frontier; a freshness item for the queue, not this verdict's.

### 3. `adopted: null` stands, but "no printing of the story in any form" is overstated — the OAD Blu-ray booklet prints Fuse's plot

The official portal's BD page: 「転生したらスライムだった件 OADシリーズBlu-ray【特装限定版】 2022年10月28日(金)発売 … 封入特典 特製ブックレット(72P) →原作者・伏瀬テキストコメンタリー、原作者・伏瀬書き下ろしOAD用オリジナルプロットなどを収録」 (BCXA-1782, OAD #1-#5, 118 min). So Fuse's OAD plot exists in print — in a disc booklet, which is merchandise of the anime, not the novel or manga line. Under T26 (adoption = material entering the SOURCE line) and the protocol's Inoue line, that is still a credit, not an adoption: `adopted: null` is correct. The note should say "printed only as the OAD's own plot in the 2022 Blu-ray booklet — never in the LN or manga line" rather than "no printing … in any form".

### 4. Where 閑話：ヴェルドラ日記 lives — the hypothesis is refuted for THIS work, and the name has a real printed cousin the verdict did not mention

- ja-WP's anime article: the S1 table lists 第24.5話「閑話：ヴェルドラ日記」 (3月26日 [2019]); the production note reads 「当初、第24話までの予定だったところに急遽制作が決定した第25話「閑話：ヴェルドラ日記」はいわゆる総集編として制作され、リムルに取り込まれたヴェルドラとイフリートの視点から、本編映像を振り返る形で進行する」; S1 BD vol 4 (BCXA-1414) carries 第19話-第24話 + 閑話：ヴェルドラ日記. The fandom: "a special episode summarizing the first season … Veldora plays Shogi with Ifrit inside Rimuru", `adaptation = N/A`. A second one, 第36.5話「閑話：ヴェルドラ日記2」 (2021-06-29), is the S2 part-1 recap. ja-WP's 番外編OAD table is exactly the five vol 12-16 discs. So nothing of the recap is inside AniList 106509 — the verdict is right.
- **The printed cousin.** ja-WP's main article: 「漫画版の巻末おまけ小説「ヴェルドラのスライム観察日記」では、その巻におけるヴェルドラ視点の感想を知ることができる。… 暇つぶし相手として取り込まれたイフリートを自身のいる亜空間に誘い込んでおり、一緒にリムルの言動を観察したり … 将棋といったゲームを嗜んでいる」 — the manga's end-of-volume bonus NOVEL is the recap special's exact frame (Veldora + Ifrit + shogi + reviewing Rimuru's doings). For the recap's future row: it stays filler by N8 whatever its frame; the bonus is an unnumbered 巻末おまけ小説 and can never yield a chapter; the lineage is a note, if the shelf wants it. Nothing changes for 106509.

### 5. No printed unit matches any of the five stories — checked beyond the verdict's search

- Kodansha, all five pages: 「完全新作オリジナルアニメーション」; vols **14, 15 and 16** each add 「原作・伏瀬先生がOADのために描き下ろした、完全新作エピソード！」 (the verdict says "the vols 14/16 pages add" — vol 15 carries it too; precision only). Vol 13: 「11巻限定版に同梱予定だったオリジナルアニメーションDVDを13巻限定版に同梱いたします」 with the 2019年3月29日 announcement referenced — the slip the verdict describes.
- The fandom: `adaptation = N/A` on all five `Extra:` pages; Part 1's trivia verbatim: "This is an anime original episode as it does not adopt any material from the Light Novels and the Manga." Its manga page's extras are 「The Reincarnation Question」「Temple School Seven Mysterious」「Diablo's Interview」 — none is sumo, the cushion, or the outdoor training; `list=search` for sumo / cushion / Sarasa / outdoor training returns only the OAD pages, the 'M' monster page and character pages; The Slime Diaries (転スラ日記, Shiba) page names no such chapter either (so no `other_instrument` note is owed).
- ja-WP's printed side-novel lists (8.5: 蓑虫ゴブタ … 聖騎士たちの敗北; 13.5: 魔物の国の給与事情, 常世の国の女神様, 紅に染まる湖畔事変): the one lakeside title, 「紅に染まる湖畔事変」, is Testarossa's annihilation of the Silveria kingdom (ja-WP's Testarossa and Blanche entries), not the picnic. Nothing about 相撲 / クッション / 野外訓練 anywhere in the LN or manga sections.
- ja-WP's 番外編OAD table carries no 脚本 column; the Fudeyasu credit is Bandai Channel's title-level 脚本：筆安一幸 — consistent with the verdict's "on-screen 脚本" remark.

### 6. Wording to fix in the note / reason before it lands (no data change)

- "OADs 3-5 sit internally inside eps 20-23": the content pins them AFTER ep 23's summoning (OAD 3 opens on flashbacks to the light elemental, Ramiris and future Chloe; the elemental is already in Ken in OAD 5) and before ep 25's return — the fandom's "set during … Anime Episodes 20-23" is loose. 24.5 is unaffected.
- "THE TASK PREMISE FAILED … The ask said the bundle 'mixes original episodes with an adaptation of a side story (Veldora's Journal / Tensura Nikki)'": the CONTEXT FILE's THE ASK carries no such sentence — the premise was in the task prompt. A ledger reason should not record a premise the artifact never had; say "the task's hypothesis", not "the ask".
- ABEMA's 「ディアブロの活躍が見どころです」 (the trilogy's draw) and 「第1期の後であればどこで見ても問題ありません」 are verbatim on the page — keep them.

### 7. Citation quality, the validator, and one by-catch

- Sources: publisher (Kodansha ×5), licensor portal (ten-sura.com), Bandai Channel, ja-WP and the fandom via the API, and three news/media pieces (ANN, Famitsu, ABEMA Times) used for the authorship credit and the viewing order — each corroborated by a primary. No content farm, no AI summary, no instant answer. The `ten-sura.com/news/1207/` link the fandom cites for the setting now redirects to the portal top; the setting claim rests on the content and ABEMA regardless.
- `validate-extras.ts`: 0 problems; `summary` 1335 chars > the 900 cap → the entry's `reason` must be hand-written. The generated `note` is the position `why` alone and never states the standing's reason — write it: "filler: five publisher-stated originals (完全新作オリジナルアニメーション ×5); Fuse's 描き下ろし on OADs 3-5 is a credit (T26), printed only as a plot in the 2022 BD booklet".
- By-catch, outside this verdict: the Coleus wiki row's note still carries "Type: anime-only-canon" (batch-14 text) — a retired T27 string in a NOTE field (the standing field is null, so no census class fires). A candidate for the T27 sweep.

## Checked and found sound

- **Standing.** Five discs = five originals on two independent lineages (the publisher's copy on every limited edition; the fandom's `adaptation = N/A` on every page) plus ja-WP's table naming them as 番外編OAD with no 原作 statement — zero source share, so T28's mixed bar is never reached. Vocabulary canon | mixed | filler respected (T27).
- **Chapters** `[]` with filler (A1); no anchor on any episode row; the halo row carries no mapping (A44); no `side_source` or adoption claim (T26 STANDING not in play).
- **Recap false.** None of the five compiles footage; the two recaps (24.5 / 36.5) are separate works.
- **Release facts.** Kodansha's 発売日 / ISBN fields: vol 12 限定版 2019-07-09 / 978-4-06-513935-6 (= AniList's start date and the verdict's ISBN), vol 13 2019-12-04, vol 14 2020-03-27, vol 15 2020-07-09, vol 16 2020-11-27 (the AIR_News "Nov 11" and Famitsu "11月9日" were earlier plans; the verdict took the publisher's actual date). Collection order (#1 HEY！尻！, #2 Mの悲劇？) on the official portal and Bandai Channel vs release order — exactly as the verdict's flag 3 says.
- **Authorship.** Fuse's 描き下ろし on OADs 3-5: Kodansha (×3), Famitsu 「作者・伏瀬氏書き下ろし完全新作エピソード」, ANN "Original novel author Fuse wrote new stories exclusively for the three-part anime", the fandom (Parts 1-3). OADs 1-2: publisher "完全新作オリジナル", no author-story claim anywhere — consistent with the verdict.
- **Kind / date / title** — ova (オリジナルビデオ on Bandai Channel), 2019-07-09, title as AniList; `repairs: []` is right.
- **Position 24.5** as a gap claim: `deriveWatchPosition` on 2019-07-09 lands after ep 24 (2019-03-19) and before ep 25 (2021-01-12); ABEMA's guide; the fandom's 24.6-24.8 numbering; OAD 5's close. Sean's mechanical check: stored = proposed = 24.5, verdict "confirmed".
- **Internal consistency.** Summary ↔ flags ↔ fields agree on the five units, the volumes, the dates, the release-vs-collection order, `adopted` null, `repairs` []. No chapter row exists to disagree with the summary (the class-1 defect cannot occur here).
- **Scope.** Nothing from a sibling entry (転スラ日記's anime, Coleus, the films) is carried into this row's values.
