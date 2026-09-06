# VERIFY — triage__ranma-1-2 (related-works programme, wave 2 owner triage) — 2026-09-05

Verifier: Claude Fable 5.1 (a different model than authored the verdict — R24).
Under review: `scripts/ingest/research/discovery/out/triage__ranma-1-2.json`.
Author's context: scratchpad `extras-w2/triage__ranma-1-2.md`. Contract: `PROTOCOL-extras.md` (TRIAGE shape).
AniList's API was NOT queried (disabled today). AniList facts below come from the repo's cache
(`ingest_anilist_media`, raw rows dated 2026-09-03/05) and from Kitsu's AniList mappings. All
fandom and Wikipedia reads were MediaWiki API wikitext, never HTML. DB access was read-only (GET).

## Conclusion

**SOUND WITH NOTES.** The three YES rows and every chapter they name are confirmed at every
boundary by three witnesses — ja-WP's OVA / film lists, the Ranma Wiki (episode infoboxes, chapter
pages, arc pages) and, new and independent of the fandom wiki, en-WP's Shogakukan volume contents,
whose Japanese chapter titles match the wiki's kanji at all 19 edges tested. The five NO rows are
confirmed. The shelf flag is confirmed and sharpened from the DB and the AniList cache. One factual
error sits in the summary (the owner is the 1989 run, not the 2024 remake); it touches no proposed
value. No anchors proposed, no adoption claims, no forbidden vocabulary, no content farms or AI
summaries among the sources.

Per row: 1007 SOUND · 1008 SOUND · 1010 SOUND · 418 SOUND · 792 SOUND · 6713 SOUND (gate note) ·
10825 SOUND (kind → recap) · 10824 SOUND (gate note) · chapter space SOUND (now independently
proved) · shelf SOUND (sharpened).

## Recap baseline — Ranma ½ (`ranma-1-2` · AniList 210 · the 1989 run, 161 eps · instrument manga 30023 · 407 ch)

Stored = the I45 ledger row (`watch_order_entries`, origin halo; standing null = pending). The run's
honest terminal: ep 161 → ch 229 (afg-continua), ep 155 → 221-224 (manual).

| work (AniList) | stored | verdict | verifier |
|---|---|---|---|
| 1007 Ranma ½ (OVA) — OVA Vol.1-6, 1993-10-21 → 1994-08-19 | pending · kind ova @161.5 · halo / SEQUEL · held (source MANGA, no instrument edge) | yes — 230-233 (Vol.1), 241 (Vol.3), 259-265 (Vol.4); Vol.2 / 5 / 6 original | SOUND — every chapter and every gap confirmed (§1); per-work note: 3 of 6 episodes are original → T28 at the entry level |
| 418 Big Trouble in Nekonron, China — film 1, 1991-11-02, 75 min | pending · movie @118.5 · halo / SIDE_STORY · held (source MANGA) | no — original screenplay (原案 柳川茂) | SOUND |
| 792 Nihao My Concubine — film 2, 1992-08-01, 60 min | pending · movie @153.5 · halo / SIDE_STORY · held (source MANGA) | no — original screenplay (山口亮太) | SOUND |
| 1008 Ranma ½ Special — よみがえる記憶 上 / 下, 1994-12-16 / 1995-02-17 | pending · ova @161.51 · halo / SEQUEL · held (source MANGA) | yes — 266-278 | SOUND |
| 1010 One Flew Over the Kuno's Nest — film 3, 1994-08-20, 25 min | pending · movie @161.52 · halo / SEQUEL · held (source null) | yes — 301-302 | SOUND; the title flag is upgraded to two sources (finding 2) |
| 6713 Nettou Uta Gassen — 1990-11-07 / 11-21 | pending · ova @69.5 · halo / OTHER · held (source MANGA) | no — music video | SOUND on the facts; the gate did not catch it (finding 3) |
| 10825 Battle ga Ippai 29-nin no Korinai Yatsura — 1995-03-03 | pending · ova @161.53 · halo / SIDE_STORY · held (source MANGA) | no — TV clip compilation with new framing footage | SOUND; must land as kind recap, not "original" (finding 4) |
| 10824 DoCo Music Video — 1995-08-19 | pending · ova @161.54 · halo / OTHER · held (source null) | no — music video | SOUND on the facts; the gate did not catch it (finding 3) |
| 1011 Ranma ½ SUPER — 3 OVAs, 1995-09-21 → 1996-01-19 | NO ROW — reachable (cached 1010 carries SEQUEL → 1011, hop 4) but UNSTAGED | flag: adapts 287-288, 308, 331-332 | CONFIRMED (finding 5) |
| 5493 It's a Rumic World: Akumu! Shunminkō — 2008 | NO ROW — reachable (cached 1010 carries SEQUEL → 5493) but UNSTAGED | flag: adapts 365 | CONFIRMED (finding 5) |
| 10819 Tendō-ke no Oyobidenai Yatsura! — 1992-08-30 | NO ROW — reached by NO cached edge | flag: a recap | CONFIRMED (finding 5) |

## §1 The YES rows — what the sources say, fetched and read

**ja-WP らんま1/2, OVA list (lines 794-805 of the wikitext), verbatim:** Vol.1 「原作コミックス22巻7 - 10話」 ·
Vol.2 「OVAオリジナル」 · Vol.3 「原作コミックス23巻7話」 · Vol.4 「同25巻3 - 9話」 · Vol.5 / Vol.6 「OVAオリジナル」 ·
SPECIAL 上 「原作コミックス25巻10話 - 26巻11話」, 下 「同上」 · SUPER Vol.1 「27巻9、10話」 · SUPER Vol.2 「29巻8話」 ·
SUPER Vol.3 「31巻9、10話」 · 悪夢!春眠香 「34巻10話」. Film list: only film 3 carries 「原作コミックス29巻1、2話」;
films 1-2 carry no note. Exactly as the verdict states.

**ja-WP film-3 article:** 「完全オリジナルストーリーだった前2作とは異なり、原作29巻収録の鳳凰の雛を巡るエピソードを基にしているが、
原作では登場していない良牙、右京、シャンプーらも話に関わる他、鳳凰の習性が一部原作と異なっており…」; 「媒体によってはOVAシリーズの
9本目として扱われている」; 上映時間 25分. As paraphrased.

**en-WP List of Ranma ½ episodes:** "11 OVAs … All but three are based on stories originally in the
manga."; Viz "added [film 3] as the ninth episode"; the 2008 short "is based on the 'Nightmare! Incense
of Deep Sleep' manga story from volume 34". As quoted.

**Ranma Wiki episode infoboxes (`manga =` field):** OVA1 230/231/232/233 · OVA2 None ("the first OVA to
not adapt a manga storyline") · OVA3 241 · OVA4 259-265 · OVA5 None · OVA6 None · Special 1 266/267/268 ·
Special 2 269-278 · film 3 301/302 · SUPER 1 287/288 · SUPER 2 308 · SUPER 3 331/332 · Shunminkō 365.
Film 1: "It features an original, standalone story." Film 2: "The film features an original story."

**Ranma Wiki chapter pages — `anime =` field and tankōbon volume, read one by one, INCLUDING the
neighbours on each side of every range** (the verdict's ranges must stop where the wiki stops):

| ch | tankōbon vol (scan file) | anime field |
|---|---|---|
| 229 | 22 | Boy Meets Mom Part 2 (= TV ep 161 — the run's terminal, ch 229 in our DB) |
| 230-233 | 22 (231 = Vol22Chapter8.png) | Shampoo's Sudden Switch (OVA 1) — all four |
| 234 | 22 (Vol22Chapter11.png) | none |
| 240 / 242 | 23 (Vol23Chapter6 / 8) | none |
| 241 | 23 (Vol23Chapter7.png) | Akane vs. Ranma (OVA 3) |
| 245 | 23 (Vol23Chapter11.png) | none |
| 258 | 25 | none |
| 259-265 | 25 | Stormy Weather Comes to School (OVA 4) — all seven |
| 266, 267 | 25 | Reawakening Memories Part One |
| 268 | 26 | Reawakening Memories Part One |
| 269-278 | 26 | Reawakening Memories Part Two — all ten |
| 279 | 27 | none |
| 286 / 289 | 27 (Vol27Chapter8 / 11) | none |
| 287, 288 | 27 (Vol27Chapter9 / 10) | Oh, Cursed Tunnel of Lost Love (SUPER 1) |
| 300 | 28 (Vol28Chapter11) | none |
| 301, 302 | 29 (Vol29Chapter1 / 2) | Team Ranma vs. the Legendary Phoenix (film 3) |
| 303 / 307 / 309 | 29 | none |
| 308 | 29 (Vol29Chapter8) | The Evil Ogre (SUPER 2) |
| 330 / 333 | 31 | none |
| 331, 332 | 31 (332 = Vol31Chapter10) | The Two Akanes (SUPER 3) |
| 364 / 366 | 34 (Vol34Chapter9 / 11) | none |
| 365 | 34 (Vol34Chapter10) | Nightmare! Incense of Spring Sleep (5493) |
| 407 | 38 | none — 「最終話 らんまとあかね」; Chapter 408 does not exist |

**Ranma Wiki arc pages** (the same lineage, a third index): Reversal Jewel Arc = 230-233 · Violence of
Cooking Arc = 241 · Hinako Ninomiya Intro Arc = 259-265 · One-Punch Armor Arc = 245 ("OVA adapts only
the first scene, where Gosunkugi is attacked by the bullies … Rest of the OVA adapts Hinako Ninomiya
Intro Arc") · Ryugenzawa Arc = 266-278 · Curséd Cave of Broken Loves Arc = 287-288 · Phoenix Sword
Arc = 301-302 · Evil Oni Arc = 308 · Doll of Vengeance Arc = 331-332.

**Kitsu (AniList mappings):** 1007 → 6 eps 1993-10-21 → 1994-08-19 · 1008 → 2 eps 1994-12-16 →
1995-02-17 · 1010 → movie 1994-08-20 · 6713 → 2 eps 1990-11-07 → 11-21 · 10825 → 1995-03-03 ·
10824 → 1995-08-19 · 1011 → 3 eps 1995-09-21 → 1996-01-19 · 5493 → 2008-07-31 · 10819 → special
1992-08-30. The cached AniList raw agrees (1007 eps 6, 1008 eps 2, 1010 source null, the two films
source MANGA — the trap the verdict records is real).

## §2 The chapter-space claim — SOUND, and now proved independently of the fandom wiki

The author's proof rested on two lineages: ja-WP's (volume, story) form and the Ranma Wiki's continuous
number + its own tankōbon-volume field + scan filenames. The volume boundaries therefore came from the
fandom wiki alone. I added **en-WP's List of Ranma ½ chapters** (the Tankōbon edition section: Shogakukan
volume contents with Japanese titles, numbered 001-407): 38 volumes, 407 chapters, contiguous with no
gaps or overlaps; vols 21-34 carry 11 chapters each (vol 22 = 224-234, 23 = 235-245, 25 = 257-267,
26 = 268-278, 27 = 279-289, 29 = 301-311, 31 = 323-333, 34 = 356-366); vol 38 = 399-407. Then the
Japanese title of the chapter at each (volume, story) the author converted, against the kanji the Ranma
Wiki prints on the chapter page at the number the author used:

| ja-WP form | en-WP # · Japanese title | Ranma Wiki kanji at that # | match |
|---|---|---|---|
| 22巻1話 | 224 それでも愛は勝つ!! | それでも愛は勝つ!! | yes |
| 22巻6話 | 229 母子水いらず!! | 母子水いらず!! | yes (the run's terminal) |
| 22巻7話 | 230 突然大嫌い!! | 突然大嫌い!! | yes |
| 23巻7話 | 241 暴力料理教室 | 暴力料理教室 | yes |
| 23巻11話 | 245 ファイト一発 | ファイト一発 | yes |
| 25巻3話 | 259 必殺新任教師!! | 必殺新任教師!! | yes |
| 25巻9話 | 265 究極の健康法！ | 究極の健康法！ | yes |
| 25巻10話 | 266 あかねの旅立ち | あかねの旅立ち | yes |
| 26巻11話 | 278 贈る言葉 | 贈る言葉 | yes |
| 27巻1話 | 279 必殺！家庭訪問 | 必殺！家庭訪問 | yes |
| 27巻9-10話 | 287 呪いの破恋洞 · 288 別れの出口 | same | yes |
| 29巻1-2話 | 301 恐怖の鳳凰剣 · 302 不滅の鳳凰剣 | same | yes |
| 29巻8話 | 308 邪悪と豆の字 | 邪悪と豆の字 | yes |
| 31巻9-10話 | 331 怪談・仕返し人形 · 332 人形の罠 | same | yes |
| 34巻10話 | 365 悪夢！春眠香 | 悪夢！春眠香 | yes |
| 38巻 last | 407 最終話 らんまとあかね | 最終話 らんまとあかね | yes |

19 of 19. The wiki's space IS the catalog's: our anchors on the run were sourced from these same
chapter pages (batch 17 re-anchor: "Chapter 23", "Chapter 24", en-WP's chapter list), the DB's terminal
ep 161 → ch 229 is the wiki's 229 (vol 22 story 6, ep 161's page), and OVA 1's 230 resumes exactly one
chapter later. The "within-volume numbering" premise is consistent with ja-WP's own wording for the
2008 short (「原作34巻PART.10」) and the scan filenames; I did not inspect a physical tankōbon.
The Viz-volume caution is right in the range that matters (ch 224 = Viz 20 / tankōbon 22 … ch 407 =
Viz 36 / 38), though the offset is not 2 everywhere (Viz vol 1 = tankōbon 1-2) — irrelevant here.

## §3 The NO rows

- **418 / 792:** ja-WP film-3 article 「完全オリジナルストーリーだった前2作」; film 1's own article: 原案 柳川茂,
  脚本 柳川茂 / 井内秀治 / 山口亮太, オリジナルキャラクター 麒麟・来雉・恵比天・大黒星・大白星; film 2's: 脚本 山口亮太,
  オリジナルキャラクター 桃磨・王譚・猿十琉・酉簾譚; ja-WP's film list gives neither a chapter note; the Ranma Wiki's
  film pages say original in English. Two independent lineages each. SOUND.
- **6713:** ja-WP 企画ビデオ list: 「熱闘歌合戦 その1（1990年11月7日） - ミュージックビデオ」, その2 (11-21), LD (12-21), all
  「ミュージックビデオ」; the album 「乱馬的企画音盤 らんま1/2 熱闘歌合戦（1990年4月21日）」 is on the same page;
  furinkan (archived 2020-02-16): "comprised of original music videos developed for the Hot Songs Contest
  album"; Tower 888070: DVD 2002-06-19, 00:46:00, 規格品番 PCBA-51045. SOUND.
- **10825:** ja-WP: 「スペシャルビデオ バトルがいっぱい29人の懲りないやつら（1995年3月3日） - 新録を含むTVアニメ総集編」;
  furinkan: "clips from twenty-nine of Ranma's most memorable opponents from the television series",
  Kitty Animation Circle. (The 1992 tape reads 「TVアニメ総集編（含新録）」 — same meaning, not the same
  string; the verdict's "same phrase" is loose, no consequence.) SOUND on the facts — see finding 4.
- **10824:** ja-WP lists 「らんま1/2 DoCoミュージックビデオ（1995年8月19日）」 under 企画ビデオ with no note;
  furinkan: "a collection of the opening and ending OAV themes performed by DoCo … an interview with the
  cast during their recording of the 'Tunnel of Lost Love' OAV"; Tower 2290944: VHS 1995-08-19,
  ポニーキャニオン, 規格品番 PCVE-10333, 高橋留美子 / 西村純二. SOUND.

## Findings, ranked by damage

**1. The summary misidentifies the owner (internal contradiction; no value depends on it).**
The summary opens "The owner row is the 2024 remake, but all 8 held works belong to the 1989-96 line".
Wrong: `ranma-1-2` is AniList 210, the 1989 run — DB series row total_episodes 161, aired 161; the
author's own context said "episodes 161 / 161" and every stored position (161.5 …) is relative to that
run; `lib/rulings/franchises.ts:723-735` names `ranma-1-2` the franchise base and the remake is the
separate series `ranma1-2-2024` (AniList 178533, 24 eps). Both series share instrument 30023 and the
407 space, so no chapter, standing or yes/no is affected — but the sentence must not be copied into any
ruling note, and it is the exact class (a self-consistent block that disagrees with its own context)
this project has shipped before. Settled by: the DB series rows (fetched) and franchises.ts.

**2. Title of 1010 — the flag is now two-sourced (a repair candidate, Sean's call).** The stored
title is AniList's English title (cached raw: "Ranma ½: One Flew Over the Kuno's Nest"). en-WP cites the
Viz VHS jacket (ISBN 1-56931-059-9) for "One GREW Over the Kuno's Nest"; the Ranma Wiki's film page,
independently: "It was released on VHS as One Grew Over the Kuno's Nest on December 16, 1999 …
The Viz title is a parody of … One Flew Over the Cuckoo's Nest. This has created confusion over the
film's English title as 'One Flew Over the Kuno's Nest'." The author flagged without proposing — correct
under "never silently contradict stored data". A title repair lives at the manual tier (P8); whether the
display should carry a Viz VHS pun at all is Sean's.

**3. The two music videos reached the ledger; the gate cannot see them (a P5 gap, not a verdict
defect).** I45's text: music videos are "listed by the census as extra_promo, never a row". The
implementation has two gates — AniList format MUSIC (`lib/discovery.ts:159`) and the title regex
`PROMO = /\b(?:PV|trailer|promo(?:tion(?:al)?)?|teaser|CM)\b/i` (`lib/related-works.ts:64`). AniList
formats 6713 and 10824 as OVA and neither title matches, so both became held rows. The verdict's `no`
is right on the facts; the question for Sean is the disposition — filler by ruling (the author's path)
or no row at all (the rule's intent), which needs a title signal for "music video" / ミュージックビデオ or a
ruling-tier list. Settled by: the code lines cited and the DB rows.

**4. 10825 must land as kind `recap`, not "original".** The triage vocabulary turns a `no` into "an
original (filler by ruling)"; this tape is a TV compilation (ja-WP 総集編; furinkan clips) with new framing
footage. The author says so in `why` ("treat it as a recap unless the tape itself says otherwise") but
`flags_for_sean` does not name the kind repair (stored kind ova → recap, `recap: true`, N8). Its AniList
relation is SIDE_STORY, not SUMMARY / COMPILATION, and its title carries no recap keyword, so the bucket
rule could not see it either. Same treatment for 10819 if it ever enters.

**5. The shelf — confirmed and sharpened.** DB: exactly the 8 rows exist for `ranma-1-2`, none for
`ranma1-2-2024`. The cached AniList raw for 1010 carries SEQUEL → 1011 (Ranma ½ SUPER) and SEQUEL →
5493 (Akumu! Shunmin Kou), so the halo walk reaches both at hop 4 (210 → 1007 → 1008 → 1010 → …) — but
`ingest_anilist_media` holds no row for 1011 or 5493: they are UNSTAGED, which is why they are neither
held nor same_instrument (the sitting table's franchise row: same 0 · held 8 · crossover 1 [= 6566 It's
a Rumic World 50th, a CHARACTER edge from 210] · unstaged 1). After the next discovery-stage they bucket
by their own edges (same_instrument with an ADAPTATION edge to 30023, held without) and enter the
per-work programme; the chapters the author gave them are confirmed here at every boundary (287-288,
308, 331-332 — ja-WP SUPER Vol.1-3 + wiki episode / chapter / arc pages; 365 — ja-WP + en-WP + the
wiki + the ja-WP 春眠香 article 「原作34巻PART.10」). 10819 appears in NO cached edge (none of 210 / 149939 /
1007 / 1008 / 1010 list it) — it can only enter as a wiki-origin row or a ruling; it is a recap (ja-WP
「TVアニメ総集編（含新録）」; furinkan: Nabiki-narrated review spliced with new animation).

**6. Per-work inputs the triage correctly left open (not defects).** (a) OVA 4's opening scene is
ch 245's (Ranma Wiki OVA-4 trivia; the One-Punch Armor Arc and Hinako Intro Arc pages say the same —
still one lineage; ja-WP credits only 25巻3-9話): an annotation / graft for the per-work verdict, never
an extension of the range to 245. (b) Positions: the sub-order after ep 161 is popularity order (1007 →
1008 → 1010 → 10825 → 10824), which happens to be STORY order for 1008 (vols 25-26) before 1010
(vol 29) although by date 1010 (1994-08-20) precedes 1008 (1994-12-16); 1011's SUPER Vol.1 (vol 27,
1995-09-21) would sit between them by story. The author's position note is right that this needs a
ruling. (c) 1007 is six episodes of which three are original — the entry-level standing is a T28
question (mixed) unless the per-work stage treats the OVA line per episode.

**7. Nits (no consequence).** The chapter-space flag says "eight independent boundaries" and lists
ten. The 10825 `why` calls two different ja-WP strings "the same phrase" (same meaning).

## What I checked and found nothing

- JSON valid, TRIAGE shape exact (8 works; keys as specified; `chapters` null on every `no`); summary
  count "3 yes, 5 no, 0 unclear" equals the rows. No `standing`, no anchors, no `anime-only-canon`
  (T27), no adoption claim (T26), no A1 / A44 exposure (a triage proposes no positions).
- Scope leakage: none — every chapter is the owner's instrument (30023) in the catalog's 1-407 space;
  the owner misstatement leaks nothing because both Ranma series share the instrument.
- Citation quality: ja-WP, en-WP, the owner's fandom wiki via the API, furinkan.com (a fan reference,
  used only for the 企画ビデオ, with ja-WP as the independent classifier; the author disclosed that the
  AniList / Kitsu descriptions descend from it — honest), Tower Records (artifact facts only), Kitsu
  (cross-check). No content farm, no AI summary, no instant answer.
- Every URL in the verdict's `sources` arrays resolves to a page that states what the verdict
  attributes to it (all fetched; the 13 Special chapter pages and the 7 OVA-4 chapter pages read
  individually, as the author claimed to have done).
- Neighbour discipline: at every range edge the adjacent chapter page carries no reference to the
  work (229 / 234, 240 / 242, 258 / 266, 279, 300 / 303, 286 / 289, 307 / 309, 330 / 333, 364 / 366).

## Sources fetched by the verifier
ja-WP: らんま1/2; らんま1/2 超無差別決戦! 乱馬チームVS伝説の鳳凰; らんま1/2 中国寝崑崙大決戦! 掟やぶりの激闘篇!!; らんま1/2 決戦桃幻郷!
花嫁を奪りもどせ!!; らんま1/2 悪夢!春眠香 (all `w/api.php?action=parse&prop=wikitext`). en-WP: List of Ranma ½
episodes; List of Ranma ½ chapters. ranma.fandom.com API: the 11 OVA / film / special episode pages, the
SUPER 1-3 and Shunminkō pages, 62 chapter pages (1-2, 9-12, 223-224, 229-235, 240-242, 245, 256-279,
286-289, 300-303, 307-309, 322-323, 330-333, 355-356, 364-366, 406-408), 9 arc pages, Movie + OVA
Ranma ½. web.archive.org furinkan.com/ranma/anime/specials.html (2020-02-16). tower.jp/item/888070,
/2290944. kitsu.io mappings for 1007, 1008, 1010, 6713, 10825, 10824, 1011, 5493, 10819. Repo / DB:
`series`, `watch_order_entries`, `chapter_anchors`, `ingest_anilist_media` (GET only); `lib/discovery.ts`,
`lib/related-works.ts`, `lib/rulings/franchises.ts`, `EXTRAS-SITTING.md`, the batch 17 / 19 / 21 ranma
verdicts. Scratch copies: the session scratchpad `verify-ranma/`.
