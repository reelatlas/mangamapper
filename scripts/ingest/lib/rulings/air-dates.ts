// AIR_DATE_OVERRIDES — research-ruled air dates (rule G53, 2026-08-26; the
// first /add-rule exercise). AFL inherits date errors on some pages; a bare
// DB update is clobbered by the next AFL refresh, so ruled dates live here
// and are re-applied inside filterEpisodeRows at EVERY episode write, then
// asserted over standing rows by assert-overrides.ts; ruling_violation is
// the outcome check. Only rows with a CITED date enter (R3): the kinnikuman
// set ("eps 90-119 one week early", ep 38, ep 87) and railgun ep 14 are
// claims without dates in any verdict → batch-18 narrow task, not entries.
import { toMergedRecord, type RulingEntry } from './types';

// A ruled value may be NULL (2026-08-27): an episode with no Japanese
// broadcast (dragon-ball-z-kai's eight international-only rows) stores an
// honest gap (P6), never a foreign dub date — the key is present, the value
// null; the gate, the assert and the audit all read the key.
export type RuledAirDate = string | null;

export const ENTRIES: RulingEntry<Record<number, RuledAirDate>>[] = [
  {
    seriesId: 'fist-of-the-north-star',
    ruleId: 'G53',
    value: { 53: '1985-11-28', 60: '1986-01-23', 81: '1986-07-24', 82: '1986-07-31', 85: '1986-08-21', 90: '1986-10-16', 96: '1986-11-27', 108: '1987-02-26', 126: '1987-08-13' },
    // + 53 / 60 / 126 (batch 20 wave 4, verified R24, Sean ruled 2026-08-28): three AFL dates no other source has — Wed / Sun / Mon on a Thursday slot; ja-WP 各話リスト, en-WP (unchanged since 2007-08-20) and TheTVDB agree on the Thursdays; the full-run day-of-week sweep found exactly these three. Ep 29 STAYS 1985-05-16: ja-WP's 5月9日 is one anonymous unsourced 2007-10-01 edit made after both wikis' first dated lists read 5/16 (the verifier's revision-history lineage); no Japanese primary exists online.
    reason:
      'Stored dates inherited from animefillerlist are wrong on six rows (ep 96 a whole year off; ep 108 carried ep 112\'s date), which made the stored order/date pairs look scrambled around eps 79-85. Values per en.wikipedia\'s episode list (batch-17 verdict, out-of-scope note raised for this pass).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: ['scripts/ingest/research/batch17/out/fist-of-the-north-star.json', 'https://en.wikipedia.org/wiki/List_of_Fist_of_the_North_Star_episodes'],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'G53',
    value: { 153: '1992-07-31' },
    reason:
      "Stored 1992-09-04 is ep 158's date; the Ranma wiki's episode list and the episode page both give 1992-07-31 for \"Gosunkugi's Summer Affair!\". The wrong date faked an order deviation in the batch-17 re-anchor (join on title/date, R20).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: ['scripts/ingest/research/batch17/out2/ranma-1-2-reanchor.json', 'https://ranma.fandom.com/wiki/Gosunkugi%27s_Summer_Affair!'],
  },
  {
    seriesId: 'outlaw-star',
    ruleId: 'G53',
    value: { 1: '1998-01-08', 8: '1998-02-26' },
    reason:
      "Both stored values are animefillerlist's: ep 1 1998-01-05 → 1998-01-08 (ja-WP, en-WP, fandom, AniList startDate, Sunrise official 放送開始 1998年01月08日); ep 8 1998-12-26 → 1998-02-26 (ja-WP, en-WP, fandom) — the ep-8 typo was the outlaw-star entry in the G54 airdate_regression queue. MAL's Jan 9 / Feb 27 are the post-midnight dates of a 25:15 slot, not a conflict. Ep 23's stored 1998-06-04 is for a broadcast that never happened (Sunrise: 第23話 TV未放映) — left for a ruling on whether G53 may carry NULL.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/out/outlaw-star.json', 'scripts/ingest/research/batch18/verify/outlaw-star.md', 'https://www.sunrise-inc.co.jp/work/detail.php?cid=94', 'https://ja.wikipedia.org/wiki/星方武侠アウトロースター'],
  },
  // ---- batch 19 wave 2, lane B3 (2026-08-27): 40 series, the 82 verdict repairs minus city-hunter 13/14 (HELD → G54), plus dragon-ball-z-kai's five already-withheld NULLs and shugo-chara's five same-block year slips (DB-confirmed).
  {
    seriesId: 'beelzebub',
    ruleId: 'G53',
    value: { 47: '2011-12-18' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 47: ja-WP 各話リスト gives バブ47「お待たせしました」= 2011年12月18日; en-WP gives December 18, 2011; syoboi Count 47 = 2011-12-18 07:00. Stored 12-08 is a transposition of 12-18. Neighbours 46",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/beelzebub.json', 'https://cal.syoboi.jp/tid/2076', 'https://en.wikipedia.org/wiki/List_of_Beelzebub_episodes', 'https://ja.wikipedia.org/wiki/%E3%81%B9%E3%82%8B%E3%81%9C%E3%83%90%E3%83%96'],
  },
  {
    seriesId: 'beyblade-metal-fusion',
    ruleId: 'G53',
    value: { 50: '2010-03-21' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 50: ja-WP メタルファイト ベイブレード 各話リスト: 第50話 怒りの最終決戦 = 3月21日 (2010); en-WP Beyblade: Metal Fusion season 1 = March 21, 2010; syoboi Count 50 = 2010-03-21 08:30 (TXN). Stored 2010-01-",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/beyblade-metal-fusion.json', 'https://cal.syoboi.jp/tid/1613', 'https://en.wikipedia.org/wiki/Beyblade:_Metal_Fusion_season_1', 'https://ja.wikipedia.org/wiki/%E3%83%A1%E3%82%BF%E3%83%AB%E3%83%95%E3%82%A1%E3%82%A4%E3%83%88_%E3%83%99%E3%82%A4%E3%83%96%E3%83%AC%E3%83%BC%E3%83%89'],
  },
  {
    seriesId: 'black-butler',
    ruleId: 'G53',
    value: { 31: '2010-08-13' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 31: ja-WP 黒執事 (アニメ) 各話リスト, 黒執事II block: 第7話「殺執事」初放送日 = 2010年8月13日 (第6話 夜露執事 8月6日, 第8話 吐露執事 8月20日). en-WP List of Black Butler episodes: ep 31 / season-2 ep 7 'Deathly Butler'",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/black-butler.json', 'https://en.wikipedia.org/wiki/List_of_Black_Butler_episodes', 'https://ja.wikipedia.org/wiki/%E9%BB%92%E5%9F%B7%E4%BA%8B_(%E3%82%A2%E3%83%8B%E3%83%A1)'],
  },
  {
    seriesId: 'black-cat',
    ruleId: 'G53',
    value: { 15: '2006-05-23' },
    reason:
      "First broadcast on any channel is the catalog's air date (the bebop / haruhi convention): Animax 2006-05-23, not the R2 DVD vol-8 street date. Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 15: The episode has no TBS broadcast. Its first (and only) broadcast is Animax 2006-05-23 23:00 per syoboi's ProgItem for TID 685 Count 15 (Animax also carried 14 on 05-16 an",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/black-cat.json', 'https://cal.syoboi.jp/tid/685', 'https://en.wikipedia.org/wiki/List_of_Black_Cat_episodes', 'https://ja.wikipedia.org/wiki/BLACK_CAT', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'blue-lock',
    ruleId: 'G53',
    value: { 15: '2023-01-22', 16: '2023-01-29' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 15: ja-WP ブルーロック 各話リスト: 第15話「喰」Aux6 = 1月22日. en-WP Blue Lock season 1: EpisodeNumber 15 'Devour' = 2023-01-22. Weekly TV Asahi NUMAnimation Saturday slot: 14 = 01-15, 15 = 01 | ep 16: ja-WP: 第16話「三者融合(トライ・セッション)」= 1月29日; en-WP: EpisodeNumber 16 'Tri-Fusion' = 2023-01-29.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/blue-lock.json', 'https://en.wikipedia.org/wiki/Blue_Lock_season_1', 'https://ja.wikipedia.org/wiki/%E3%83%96%E3%83%AB%E3%83%BC%E3%83%AD%E3%83%83%E3%82%AF', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'code-geass-lelouch-of-the-rebellion',
    ruleId: 'G53',
    value: { 5: '2006-11-03', 6: '2006-11-10', 28: '2008-04-20', 29: '2008-04-27' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 5: ja-WP コードギアス 反逆のルルーシュ 各話リスト: STAGE 5「皇女 と 魔女」= 11月3日; en-WP List of Code Geass season 1 episodes: ep 5 = 2006-11-03. Every R1 date in both sources is a Friday (10/6, 10/1 | ep 6: ja-WP: STAGE 6「奪われた 仮面」= 11月10日; en-WP ep 6 'The Stolen Mask' = 2006-11-10 (cited to geass.jp/first/story_06.html). Stored 2006-10-09 is not a Code Geass broadcast date a | ep 28: ja-WP R2 table: TURN 03「囚われ の 学園」= 4月20日; en-WP List of Code Geass season 2 episodes: 'Imprisoned in Campus' = 2008-04-20. R2 ran weekly Sunday 2008-04-06 … 2008-09-28; s | ep 29: ja-WP: TURN 04「逆襲 の 処刑台」= 4月27日; en-WP: 'Counterattack at the Gallows' = 2008-04-27. Same month-digit corruption as ep 28.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/code-geass-lelouch-of-the-rebellion.json', 'https://en.wikipedia.org/wiki/List_of_Code_Geass_season_1_episodes', 'https://en.wikipedia.org/wiki/List_of_Code_Geass_season_2_episodes', 'https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%BC%E3%83%89%E3%82%AE%E3%82%A2%E3%82%B9_%E5%8F%8D%E9%80%86%E3%81%AE%E3%83%AB%E3%83%AB%E3%83%BC%E3%82%B7%E3%83%A5'],
  },
  {
    seriesId: 'cowboy-bebop',
    ruleId: 'G53',
    value: { 23: '1999-04-03' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 23: ja-WP カウボーイビバップ 各話リスト (WOWOW初放送): Session #23「ブレイン・スクラッチ」= 1999年4月2日, in the 金曜 25:00-25:30 slot (= Saturday 01:00 calendar), i.e. 1999-04-03 under the convention our nei",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/cowboy-bebop.json', 'https://en.wikipedia.org/wiki/List_of_Cowboy_Bebop_episodes', 'https://ja.wikipedia.org/wiki/%E3%82%AB%E3%82%A6%E3%83%9C%E3%83%BC%E3%82%A4%E3%83%93%E3%83%90%E3%83%83%E3%83%97'],
  },
  {
    seriesId: 'darling-in-the-franxx',
    ruleId: 'G53',
    value: { 9: '2018-03-10' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 9: syoboi TID 4788 Count 9 = 2018-03-10 23:30 (the whole run is an unbroken weekly Saturday 23:30 sequence 2018-01-13 … 2018-07-07); en-WP List of Darling in the Franxx epis",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/darling-in-the-franxx.json', 'https://cal.syoboi.jp/tid/4788', 'https://en.wikipedia.org/wiki/List_of_Darling_in_the_Franxx_episodes', 'https://web.archive.org/web/20171226020657/http://darli-fra.jp/story/?no=9'],
  },
  {
    seriesId: 'death-note',
    ruleId: 'G53',
    value: { 35: '2007-06-12' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 35: syoboi TID 945 Count 35 = 2007-06-13 00:56 (NTV), i.e. the Tuesday 2007-06-12 24:56 broadcast; en-WP Death Note (2006 TV series) episode table gives ep 35 'Malice' = 2007",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/death-note.json', 'https://cal.syoboi.jp/tid/945', 'https://en.wikipedia.org/wiki/Death_Note_(2006_TV_series)'],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'G53',
    value: { 110: '1998-07-27', 111: '1998-08-03', 112: '1998-08-10', 113: '1998-08-17', 114: '1998-08-24', 115: '1998-08-31' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 110: ja-WP: |7月27日||110||料理教室殺人事件（前編）; DCW Season 3 {{SeasonItem|110|116|Cooking Classroom Murder Case (Part 1)|July 27, 1998}}. (DCW's first argument is the Jp# column, which | ep 111: ja-WP: |8月3日||111||料理教室殺人事件（後編）; DCW Season 3: Jp# 111 = August 3, 1998. A two-parter cannot straddle 07-27 and 08-10 with 08-03 given to a different case. | ep 112: ja-WP: |8月10日||112||帝丹小7不思議事件; DCW Season 3: Jp# 112 'The Seven Mysteries of Teitan Elementary School Case' = August 10, 1998. | ep 113: ja-WP: |8月17日||113||白い砂浜殺人事件; DCW Season 3: Jp# 113 'The White Sandy Beach Murder Case' = August 17, 1998. | ep 114: ja-WP: |8月24日||114||スキューバダイビング殺人事件（前編）; DCW Season 3: Jp# 114 = August 24, 1998. | ep 115: ja-WP: |8月31日||115||スキューバダイビング殺人事件（後編）; DCW Season 3: Jp# 115 = August 31, 1998. Ep 116 (09-07) is already correct in our data, so 08-31 is the only slot left.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/detective-conan.json', 'https://ja.wikipedia.org/wiki/%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AE%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7', 'https://www.detectiveconanworld.com/wiki/Season_3'],
  },
  {
    seriesId: 'dragon-ball-z-kai',
    ruleId: 'G53',
    value: { 101: null, 102: null, 103: null, 106: null, 108: null, 111: null, 113: null, 119: '2014-07-06', 128: '2014-09-14', 165: null },
    reason:
      "NULL = never broadcast in Japan (Sean 2026-08-27: an honest gap, P6 — never a foreign dub date): 101/102/103 carried Toonami dates. Our row space is the international 69-episode Final Chapters numbering (99-167) vs Fuji TV's 99-159 — join JP sources by title. Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 119: Intl ep 119 = 真打ち登場! 立ちはだかる魔王!! = JP ep 112, aired 2014年7月6日 per ja-WP ドラゴンボール改 魔人ブウ編 table; en-WP List of Dragon Ball Z Kai episodes ep 119 OriginalAirDate = 2014-07-06. | ep 128: Intl ep 128 = 悪夢再来 不死身の怪物 魔人ブウ! = JP ep 121, aired 2014年9月14日 (ja-WP; en-WP ep 128 OriginalAirDate = 2014-09-14). The stored 2014-11-30 is intl ep 139's date (JP 132 魔人を倒 | ep 102: Intl ep 102 'A Monster Is Taken Away! The Culprit Is Great Saiyaman?' has NO Japanese broadcast — en-WP prints OriginalAirDate = '—' with the {{efn|name=Int}} internation | ep 103: Same class as 102: intl ep 103 'Entering the World Martial Arts Tournament!' is international-only (en-WP OriginalAirDate '—', AltDate February 5, 2017 = Toonami). Absent | ep 101: Not one of the flagged rows, but the SAME class and it must be handled with 102/103 or the gate will just move: intl ep 101 \"Videl's Crisis? Gohan's Urgent Call-out!\" is | 106/108/111/113/165 (already withheld by G54): never broadcast in Japan either — AFL's 2017-02-25 / 03-11 / 04-01 / 04-15 / 2018-06-09 are US Toonami dub premieres (en-WP AltDates); ruled NULL so the withheld value can never re-enter",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/dragon-ball-z-kai.json', 'https://en.wikipedia.org/wiki/List_of_Dragon_Ball_Z_Kai_episodes', 'https://ja.wikipedia.org/wiki/%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%AB%E6%94%B9', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'durarara',
    ruleId: 'G53',
    value: { 18: '2010-05-14', 20: '2010-05-28', 37: '2015-03-28', 38: '2015-07-04' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 18: syoboi TID 1802 Count 18 = 2010-05-14 (the S1 run is an unbroken weekly Friday sequence); en-WP Durarara!! season 1: ep 18 'Out of Your Control' = 2010-05-14. Stored 2010 | ep 20: syoboi TID 1802 Count 20 = 2010-05-28; en-WP: ep 20 'A New King Will Arise' = 2010-05-28. Stored 2010-05-20 is a Thursday, sits before ep 19's correct 05-21, and again ma | ep 37: Under our ×2 offset (our row = en-WP overall + 1, verified at rows 36/39/40), row 37 is ×2 承 ep 12「郷に入っては郷に従え」/'Adversity Makes a Man Wise', which aired 2015-03-28: syobo | ep 38: Row 38 is ×2 転 ep 1 'Love Thy Enemy', 2015-07-04: syoboi TID 3799 (転) first entry = 2015-07-04 23:30; en-WP Durarara!!×2 ep 37 = 2015-07-04. APPLY WITH THE TITLE SWAP.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/durarara.json', 'https://cal.syoboi.jp/tid/1802', 'https://cal.syoboi.jp/tid/3625', 'https://cal.syoboi.jp/tid/3799', 'https://en.wikipedia.org/wiki/Durarara!!%C3%972', 'https://en.wikipedia.org/wiki/Durarara!!_season_1', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'fruits-basket',
    ruleId: 'G53',
    value: { 8: '2001-08-23' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 8: syoboi TID 213 Count 8 = 2001-08-23 18:00 (TV Tokyo), inside an unbroken weekly Thursday sequence 2001-07-05 onward; en-WP Fruits Basket (2001 TV series): ep 8 \"Don't Cry",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/fruits-basket.json', 'https://cal.syoboi.jp/tid/213', 'https://en.wikipedia.org/wiki/Fruits_Basket_(2001_TV_series)'],
  },
  {
    seriesId: 'ghost-in-the-shell-stand-alone-complex',
    ruleId: 'G53',
    value: { 50: '2004-12-04' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 50: en-WP List of Ghost in the Shell: Stand Alone Complex episodes: overall ep 50 / 2nd GIG ep 24 'IN: Aerial Bombing of Dejima – NUCLEAR POWER' = 2004-12-04, paired with ep",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/ghost-in-the-shell-stand-alone-complex.json', 'https://en.wikipedia.org/wiki/List_of_Ghost_in_the_Shell:_Stand_Alone_Complex_episodes', 'https://ja.wikipedia.org/wiki/%E6%94%BB%E6%AE%BB%E6%A9%9F%E5%8B%95%E9%9A%8A_S.A.C._2nd_GIG', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'G53',
    value: { 45: '2023-05-29', 46: '2023-06-05' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 45: ja-WP ゴールデンカムイ 各話リスト: 第四十五話「共犯」Aux5 = 5月29日 (2023); en-WP Golden Kamuy season 4: EpisodeNumber 45 / season ep 9 'Partner in Crime' = 2023-05-29. The stored 2023-06-20 is | ep 46: ja-WP: 第四十六話「完璧な母」= 6月5日; en-WP Golden Kamuy season 4: EpisodeNumber 46 / season ep 10 'Perfect Mother' = 2023-06-05. Stored 2023-06-27 is ゴールデン道画劇場 #46「メンコ編」's delivery",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/golden-kamuy.json', 'https://en.wikipedia.org/wiki/Golden_Kamuy_season_4', 'https://ja.wikipedia.org/wiki/%E3%82%B4%E3%83%BC%E3%83%AB%E3%83%87%E3%83%B3%E3%82%AB%E3%83%A0%E3%82%A4', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'gto-great-teacher-onizuka',
    ruleId: 'G53',
    value: { 31: '2000-05-07' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 31: ja-WP GTO (漫画) 各話リスト: Lesson31「目指せ!! 憧れの沖縄行路」Aux4 = 5月7日 (Lesson30 = 4月30日, Lesson32 = 5月14日); en-WP List of Great Teacher Onizuka episodes: EpisodeNumber 31 'Destination",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/gto-great-teacher-onizuka.json', 'https://en.wikipedia.org/wiki/List_of_Great_Teacher_Onizuka_episodes', 'https://ja.wikipedia.org/wiki/GTO_(%E6%BC%AB%E7%94%BB)'],
  },
  {
    seriesId: 'hell-girl',
    ruleId: 'G53',
    value: { 39: '2007-01-06', 40: '2007-01-13', 63: '2008-12-13' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 39: Row 39 = 地獄少女 二籠 ep 13 'Tragedy of the V' (Vの惨劇). syoboi TID 1022 Count 13 = 2007-01-06 19:30; en-WP List of Hell Girl episodes, season 2 ep 13 = 2007-01-06. The 二籠 run w | ep 40: Row 40 = 二籠 ep 14 'The Peaceful Lakeshore' (静かな湖畔). syoboi TID 1022 Count 14 = 2007-01-13; en-WP season 2 ep 14 = 2007-01-13. Same month-digit corruption as row 39. | ep 63: Row 63 = 地獄少女 三鼎 ep 11 'Blotted Paper' (滲んだ頁). syoboi TID 1460 Count 11 = 2008-12-13; en-WP season 3 ep 11 = 2008-12-13. 2008-12-23 is a Tuesday and the 三鼎 run was weekly",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/hell-girl.json', 'https://cal.syoboi.jp/tid/1022', 'https://cal.syoboi.jp/tid/1460', 'https://en.wikipedia.org/wiki/List_of_Hell_Girl_episodes'],
  },
  {
    seriesId: 'initial-d',
    ruleId: 'G53',
    value: { 46: '2004-08-21', 47: '2004-10-15' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 46: Row 46 = Fourth Stage ACT.6「ブラインド・アタック」. ja-WP 頭文字D 各話リスト prints ACT.5 and ACT.6 under one rowspan'd 8月21日 (2004); en-WP List of Initial D episodes gives ACT.6 'Blind Att | ep 47: Row 47 = ACT.7「嵐のハチゴーターボ」. ja-WP: ACT.7 and ACT.8 share the rowspan'd 10月15日; en-WP: ACT.7 'The Stormy 85 Turbo' = 2004-10-15. APPLY WITH THE TITLE ROTATION.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/initial-d.json', 'https://en.wikipedia.org/wiki/List_of_Initial_D_episodes', 'https://ja.wikipedia.org/wiki/%E9%A0%AD%E6%96%87%E5%AD%97D', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'jojos-bizarre-adventure',
    ruleId: 'G53',
    value: { 35: '2014-05-30', 45: '2014-08-08' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 35: Ep 35 = Stardust Crusaders ep 9 'Yellow Temperance' / 黄の節制, first broadcast Tokyo MX 2014-05-30 24:30 (listed as 5月31日 / May 31 on ja-WP and en-WP, i.e. 2014-05-30 in thi | ep 45: Ep 45 = SC ep 19 'Death Thirteen, Part 1' / 死神13 その1, first broadcast 2014-08-08 24:30 (ja-WP 8月9日, en-WP August 9 => 2014-08-08 stored convention). Stored 2014-08-28 is",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/jojos-bizarre-adventure.json', 'https://en.wikipedia.org/wiki/JoJo%27s_Bizarre_Adventure:_Stardust_Crusaders', 'https://ja.wikipedia.org/wiki/%E3%82%B8%E3%83%A7%E3%82%B8%E3%83%A7%E3%81%AE%E5%A5%87%E5%A6%99%E3%81%AA%E5%86%92%E9%99%BA_(%E3%83%86%E3%83%AC%E3%83%93%E3%82%A2%E3%83%8B%E3%83%A1)'],
  },
  {
    seriesId: 'michiko-and-hatchin',
    ruleId: 'G53',
    value: { 6: '2008-11-19' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 6: Ep 6 'The Saudade of Fools, Part 2' aired the same night as ep 5, on 2008-11-19 (Wed 24:45; published as 2008-11-20 by en-WP and TheTVDB, = 2008-11-19 in this series' sto",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/michiko-and-hatchin.json', 'https://en.wikipedia.org/wiki/Michiko_%26_Hatchin', 'https://thetvdb.com/series/michiko-and-hatchin/allseasons/official', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'nisekoi',
    ruleId: 'G53',
    value: { 29: '2015-06-05' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 29: Ep 29 = Nisekoi: (S2) ep 9 'Cleanup Day / Visiting the Sick' (オソウジ／オミマウ), aired 2015-06-05 (Fri 23:30). Stored 2015-07-05 is a month-digit slip and is what produced the e",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/nisekoi.json', 'https://anilist.co/anime/20876', 'https://en.wikipedia.org/wiki/List_of_Nisekoi_episodes', 'https://ja.wikipedia.org/wiki/%E3%83%8B%E3%82%BB%E3%82%B3%E3%82%A4'],
  },
  {
    seriesId: 'prison-school',
    ruleId: 'G53',
    value: { 7: '2015-08-21' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 7: Ep 7 \"Meiko's Delicious Restaurant\" (メイコトゥイユ / 'Meikotouille') aired 2015-08-21 24:05 (published 2015-08-22). Stored 2015-12-21 is a month-digit slip (12 for 08) - the se",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/prison-school.json', 'https://anilist.co/anime/20807', 'https://en.wikipedia.org/wiki/Prison_School'],
  },
  {
    seriesId: 'rave-master',
    ruleId: 'G53',
    value: { 9: '2001-12-08' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 9: Ep 9 'A Bite to Eat' (プルーのひみつ) aired 2001-12-08; ja-WP 各話リスト 初回放送日 = 12月8日 and en-WP = December 8, 2001. Stored 2001-11-08 is a month-digit slip; it is what produced the",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/rave-master.json', 'https://en.wikipedia.org/wiki/List_of_Rave_Master_episodes', 'https://ja.wikipedia.org/wiki/RAVE_(%E6%BC%AB%E7%94%BB)'],
  },
  {
    seriesId: 'reborn',
    ruleId: 'G53',
    value: { 64: '2008-01-05' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 64: Ep 64 'The Truth Behind The Rage' (怒りの真相) aired 2008-01-05 (the first Saturday after the 2007-12-29 New Year skip). ja-WP 各話リスト 2008年 and en-WP 'Reborn! season 2' both gi",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/reborn.json', 'https://en.wikipedia.org/wiki/Reborn!_season_2', 'https://ja.wikipedia.org/wiki/%E5%AE%B6%E5%BA%AD%E6%95%99%E5%B8%AB%E3%83%92%E3%83%83%E3%83%88%E3%83%9E%E3%83%B3REBORN!'],
  },
  {
    seriesId: 'saga-of-tanya-the-evil',
    ruleId: 'G53',
    value: { 5: '2017-02-03', 6: '2017-02-10' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 5: Episode 5 is 'My First Battalion' (はじまりの大隊), aired 2017-02-03 (Fri 22:00, AT-X). ja-WP 各話リスト 第伍話 = 2月3日; en-WP episode list ep 5 = February 3, 2017; AniList airing schedu | ep 6: Episode 6 is 'Beginning of Madness' (狂気の幕開け), aired 2017-02-10. ja-WP 第陸話 = 2月10日; en-WP ep 6 = February 10, 2017; AniList = 2017-02-10. Same transposition as ep 5 - swap",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/saga-of-tanya-the-evil.json', 'https://anilist.co/anime/21613', 'https://en.wikipedia.org/wiki/List_of_Saga_of_Tanya_the_Evil_episodes', 'https://ja.wikipedia.org/wiki/%E5%B9%BC%E5%A5%B3%E6%88%A6%E8%A8%98_(%E3%82%A2%E3%83%8B%E3%83%A1)', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'sailor-moon-crystal',
    ruleId: 'G53',
    value: { 8: '2014-10-18', 10: '2014-11-15', 29: '2016-04-18' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 8: Act.8 'Minako -Sailor V-' streamed 2014-10-18. ja-WP 各話リスト Act.8 = 10月18日 (with 5月20日 as the later TV date) and en-WP = October 18, 2014. Stored 2014-11-18 is a month-dig | ep 10: Act.10 'Moon' (MOON -月-) streamed 2014-11-15, not 11-08. ja-WP Act.10 = 11月15日; en-WP = November 15, 2014. The fortnightly cadence (Act.9 = 11-01, Act.11 = 12-06) confirm | ep 29: Ep 29 = Crystal season 3 (Death Busters) ep 3 'Infinity 2 Ripples' (無限2 波紋), broadcast 2016-04-18 (Mon 23:00). en-WP = April 18, 2016 and AniList's airing schedule for De",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/sailor-moon-crystal.json', 'https://anilist.co/anime/21462', 'https://en.wikipedia.org/wiki/List_of_Sailor_Moon_Crystal_episodes', 'https://ja.wikipedia.org/wiki/%E7%BE%8E%E5%B0%91%E5%A5%B3%E6%88%A6%E5%A3%AB%E3%82%BB%E3%83%BC%E3%83%A9%E3%83%BC%E3%83%A0%E3%83%BC%E3%83%B3Crystal', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'shugo-chara',
    ruleId: 'G53',
    // RE-KEYED 2026-08-27 (batch 20 wave 3, the N11 resort — keys are OUR numbers after translation): 88 → 87, 92 → 91, 93 → 92, 94 → 93, 95 → 94; 95 (= AFL's first '96', true 「りまとやや、真珠の絆！」) added; 96-100 unchanged; + the three Saturday-slot AFL typos 35 / 37 / 46 and the 107/108 transposition (dates travel with the titles, episode-titles.ts)
    value: { 23: '2008-03-15', 26: '2008-04-05', 35: '2008-06-07', 37: '2008-06-21', 46: '2008-08-23', 87: '2009-06-13', 91: '2009-07-11', 92: '2009-07-18', 93: '2009-07-25', 94: '2009-08-01', 95: '2009-08-08', 96: '2009-08-15', 97: '2009-08-22', 98: '2009-08-29', 99: '2009-09-05', 100: '2009-09-12', 107: '2009-10-31', 108: '2009-11-07' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 23: Ep 23 'Remake Honey! My Would Be Self!' (リメイクハニー！なりたい自分！) aired 2008-03-15 (Sat, TV Tokyo). ja-WP 第23話 = 3月15日; en-WP 'List of Shugo Chara! episodes' ep 23 = March 15, 20 | ep 26: Ep 26 'The New Beginning!' (新しいはじまり！) aired Saturday 2008-04-05. ja-WP 第26話 = 4月5日; en-WP ep 26 = April 5, 2008. Stored 2008-04-06 is a Sunday and cannot be right for a S | ep 88: Our row 88 is 'Save Nana! Guardian Character Nurses, Move Out?' = Shugo Chara!! Doki ep 36, aired 2009-06-13. en-WP Doki ep 36 = June 13, 2009; ja-WP 第87話 = 6月13日. Stored | ep 92: Our row 92 is 'Full Throttle! My Rhythm!' (全開！僕のリズム) = Doki ep 40, aired 2009-07-11. en-WP Doki ep 40 = July 11, 2009; ja-WP 第91話 = 7月11日. Stored 2010-07-01 has both a wr | ep 93: Our row 93 is \"It's Got to Be Cool! Beat Jumper!\" (クールに決めろ！ビートジャンパー！) = Doki ep 41, aired 2009-07-18. en-WP = July 18, 2009; ja-WP 第92話 = 7月18日. Year slip only. | ep 99: Our row 99 is \"Our Feelings United! The Guardians' Battle!\" (思いは一つ！ガーディアンの戦い！) = Doki ep 48, aired 2009-09-05. en-WP = September 5, 2009; ja-WP 第99話 = 9月5日. Year slip; th | ep 100: Our row 100 is 'The Birth of Two Character Transformations!' (誕生！2つのキャラなり！) = Doki ep 49, aired 2009-09-12. en-WP = September 12, 2009; ja-WP 第100話 = 9月12日. Year slip. | 94-98: the same 2010-for-2009 YEAR-SLIP block (AFL prints 2010 for rows 92-100; the verdict asked for a DB check — confirmed 2026-08-27: 94 2010-07-25, 95 08-01, 96 08-15, 97 08-22, 98 08-29), keyed by title: 'Hoshina Utau, Fly to the Future!' 2009-07-25, 'Onward! The Calico Cat Search Party!?' 08-01, 'Unheard Pleas, Shattered Feelings.' 08-15, 'Tadase and Ikuto, the Horoscope of Fate!' 08-22, 'Reborn!! My Radiant Dancing Princess!' 08-29 (ja-WP 各話リスト + en-WP Doki list)",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/shugo-chara.json', 'https://en.wikipedia.org/wiki/List_of_Shugo_Chara%21%21_Doki%E2%80%94_episodes', 'https://en.wikipedia.org/wiki/List_of_Shugo_Chara%21_episodes', 'https://ja.wikipedia.org/wiki/%E3%81%97%E3%82%85%E3%81%94%E3%82%AD%E3%83%A3%E3%83%A9%21', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'the-asterisk-war',
    ruleId: 'G53',
    value: { 23: '2016-06-11' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 23: Ep 23 = Asterisk War S2 ep 11 'The Lonely Strega' (孤毒の魔女), aired 2016-06-11. en-WP 'The Asterisk War' episode table gives EpisodeNumber 23 / EpisodeNumber2 11 = June 11,",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/the-asterisk-war.json', 'https://anilist.co/anime/21390', 'https://en.wikipedia.org/wiki/The_Asterisk_War'],
  },
  {
    seriesId: 'the-devil-is-a-part-timer',
    ruleId: 'G53',
    value: { 9: '2013-05-30' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 9: Ep 9 'The Hero Experiences a Fray' (勇者、修羅場を経験する) aired 2013-05-30. ja-WP はたらく魔王さま! (アニメ) 各話リスト 第9話 Aux5 = 5月30日 (year header 2013年); en-WP 'The Devil Is a Part-Timer! sea",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/the-devil-is-a-part-timer.json', 'https://en.wikipedia.org/wiki/The_Devil_Is_a_Part-Timer%21_season_1', 'https://ja.wikipedia.org/wiki/%E3%81%AF%E3%81%9F%E3%82%89%E3%81%8F%E9%AD%94%E7%8E%8B%E3%81%95%E3%81%BE%21%20%28%E3%82%A2%E3%83%8B%E3%83%A1%29'],
  },
  {
    seriesId: 'the-future-diary',
    ruleId: 'G53',
    value: { 13: '2012-01-09' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 13: Ep 13 'Unknown Number' / 'Number Withheld' (非通知設定) aired 2012-01-09, not 2011-01-09 - the series had not started in January 2011 (premiere 2011-10-09), which is exactly w",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/the-future-diary.json', 'https://en.wikipedia.org/wiki/List_of_Future_Diary_episodes', 'https://ja.wikipedia.org/wiki/%E6%9C%AA%E6%9D%A5%E6%97%A5%E8%A8%98%20%28%E6%BC%AB%E7%94%BB%29'],
  },
  {
    seriesId: 'to-love-ru',
    ruleId: 'G53',
    value: { 9: '2008-05-29', 10: '2008-06-05' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 9: Episode 9 is 'From a Shining Star, With Love' (光星より愛を込めて); ja-WP 各話リスト TL第1期 lists it as 話数 9, and en-WP 'To Love Ru season 1' dates that title 2008-05-30 (TBS Fri 01:55) | ep 10: Episode 10 is 'A Space Entertainer' (宇宙の女芸人……); ja-WP lists it as 話数 10 and en-WP dates that title 2008-06-06 = 2008-06-05 stored convention. Same transposition as ep 9 -",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/to-love-ru.json', 'https://en.wikipedia.org/wiki/To_Love_Ru_season_1', 'https://ja.wikipedia.org/wiki/To%20LOVE%E3%82%8B%20-%E3%81%A8%E3%82%89%E3%81%B6%E3%82%8B-', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'vampire-knight',
    ruleId: 'G53',
    value: { 19: '2008-11-10' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 19: Ep 19 = Vampire Knight Guilty 第6夜 'The Fake Lovers' (偽りの恋人〜ラヴァーズ〜), broadcast 2008-11-10 25:30 (ja-WP 各話リスト 第6夜 = 11月11日, i.e. 2008-11-10 in the Monday convention our row",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/vampire-knight.json', 'https://en.wikipedia.org/wiki/List_of_Vampire_Knight_episodes', 'https://ja.wikipedia.org/wiki/%E3%83%B4%E3%82%A1%E3%83%B3%E3%83%91%E3%82%A4%E3%82%A2%E9%A8%8E%E5%A3%AB'],
  },
  {
    seriesId: 'yu-gi-oh-5d-s',
    ruleId: 'G53',
    value: { 23: '2008-09-03', 35: '2008-11-26', 46: '2009-02-18', 96: '2010-02-10', 100: '2010-03-10', 120: '2010-07-28', 134: '2010-11-10', 146: '2011-02-02' },
    reason:
      "KEYS ARE POST-N11 NUMBERS (the 2026-08-27 drop of AFL's film row 83 shifts 84+ by −1; AIR_DATE_OVERRIDES applies AFTER translation): the verdict's 97/101/121/135/147 are 96/100/120/134/146 here. Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 23: Our row 23 is 5D's episode 23 'Duel of the Dragons, Part 1 (決勝戦(ファイナルマッチ))'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 9月3日 (2008年) and the Yu-Gi-Oh! Fandom episode page gives japanese | ep 35: Our row 35 is 5D's episode 35 'Dark Signs, Part 4 (戦慄! 地縛神コカパク・アプ)'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 11月26日 and the Yu-Gi-Oh! Fandom episode page gives japanese air date = 20 | ep 46: Our row 46 is 5D's episode 46 'Mark of the Spider, Part 2 (17年前の真実 隠されたダークシグナーの罠)'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 2月18日 and the Yu-Gi-Oh! Fandom episode page gives japanese | ep 96: Our row 97 is 5D's episode 96 'Natural Instincts, Part 1 (結成!チーム5D's)'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 2月10日 and the Yu-Gi-Oh! Fandom episode page gives japanese air date = | ep 100: Our row 101 is 5D's episode 100 'The Edge of Elimination, Part 1 (窮地 ラスト・ホイーラー遊星)'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 3月10日 and the Yu-Gi-Oh! Fandom episode page gives japanese | ep 120: Our row 121 is 5D's episode 120 'Tie Those Feelings! The Hand Tied to the Majin! (想いをつなげ! 手をつなぐ魔人)'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 7月28日 and the Yu-Gi-Oh! Fandom episode pa | ep 134: Our row 135 is 5D's episode 134 'For Synchro's Sake (破滅の道! シンクロ召喚が行きつく未来)'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 11月10日 and the Yu-Gi-Oh! Fandom episode page gives japanese air da | ep 146: Our row 147 is 5D's episode 146 'The Last Human, Z-ONE (最後の一人 Z-ONE)'. ja-WP 遊☆戯☆王5D's 各話リスト 放送日 = 2月2日 and the Yu-Gi-Oh! Fandom episode page gives japanese air date = 20",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/yu-gi-oh-5d-s.json', 'https://ja.wikipedia.org/wiki/%E9%81%8A%E2%98%86%E6%88%AF%E2%98%86%E7%8E%8B5D%27s', 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh%21_5D%27s_-_Episode_023', 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh%21_5D%27s_-_Episode_035', 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh%21_5D%27s_-_Episode_046', 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh%21_5D%27s_-_Episode_096', 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh%21_5D%27s_-_Episode_100', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'yu-gi-oh-arc-v',
    ruleId: 'G53',
    value: { 19: '2014-08-17' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 19: Ep 19 'Quiz Quagmire, Part 1' (知識の宇宙!!九庵堂栄太) aired 2014-08-17. ja-WP 遊☆戯☆王ARC-V 各話リスト 第19話 = 8月17日; Yu-Gi-Oh! Fandom 'Yu-Gi-Oh! ARC-V - Episode 019' japanese air date = A",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/yu-gi-oh-arc-v.json', 'https://ja.wikipedia.org/wiki/%E9%81%8A%E2%98%86%E6%88%AF%E2%98%86%E7%8E%8BARC-V', 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh%21_ARC-V_-_Episode_019'],
  },
  {
    seriesId: 'yu-gi-oh-gx',
    ruleId: 'G53',
    value: { 2: '2004-10-13', 3: '2004-10-20', 14: '2005-01-05', 132: '2007-04-18', 134: '2007-05-02', 144: '2007-07-11' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 2: Ep 2 'Welcome to Duel Academy (フレイム・ウィングマン)' aired 2004-10-13. ja-WP 遊☆戯☆王デュエルモンスターズGX 各話リスト 放送日 for TURN-2 = 10月13日. SPLIT SOURCE: en-WP's 'Yu-Gi-Oh! GX season 1' table | ep 3: Ep 3 'A Duel in Love (エトワール・サイバー)' aired 2004-10-20. ja-WP 遊☆戯☆王デュエルモンスターズGX 各話リスト 放送日 for TURN-3 = 10月20日. en-WP season 1 also gives October 20, 2004. Stored 2005-10-20 | ep 14: Ep 14 'A Spirit Summoned (VS(バーサス)サイコショッカー!?)' aired 2005-01-05. ja-WP 遊☆戯☆王デュエルモンスターズGX 各話リスト 放送日 for TURN-14 = 1月5日 (2005年). en-WP season 1 gives January 5, 2005. Store | ep 132: Ep 132 'A New World Order (生死を賭けた決闘(デュエル))' aired 2007-04-18. ja-WP 遊☆戯☆王デュエルモンスターズGX 各話リスト 放送日 for TURN-132 = 4月18日. en-WP 'Yu-Gi-Oh! GX season 3' gives April 18, 2007. | ep 134: Ep 134 'Dueling With The Dark Army (十代VS暗黒界の騎士ズール)' aired 2007-05-02. ja-WP 遊☆戯☆王デュエルモンスターズGX 各話リスト 放送日 for TURN-134 = 5月2日. en-WP season 3 gives May 2, 2007. Stored 2007 | ep 144: Ep 144 'The Forbidden Ritual, Part 1 (発動!究極封印解放儀式術!)' aired 2007-07-11. ja-WP 遊☆戯☆王デュエルモンスターズGX 各話リスト 放送日 for TURN-144 = 7月11日. en-WP season 3 gives July 11, 2007. Stored",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/yu-gi-oh-gx.json', 'https://en.wikipedia.org/wiki/Yu-Gi-Oh%21_GX_season_1', 'https://en.wikipedia.org/wiki/Yu-Gi-Oh%21_GX_season_3', 'https://ja.wikipedia.org/wiki/%E9%81%8A%E2%98%86%E6%88%AF%E2%98%86%E7%8E%8B%E3%83%87%E3%83%A5%E3%82%A8%E3%83%AB%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC%E3%82%BAGX', 'https://yugioh.fandom.com/wiki/Yu-Gi-Oh%21_GX_-_Episode_002', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'zatch-bell',
    ruleId: 'G53',
    value: { 77: '2004-10-10', 131: '2005-11-06' },
    reason:
      "Batch 19 wave 2 lane B3 (ja-WP + en-WP / syoboi / fandom, 2+ sources per row; the contradictions verified R24; Sean ruled B3-7): ep 77: Ep 77 'The Return of Sherry and Brago!' (シェリー気高き輪舞(ロンド) 炸裂バベルガ・グラビドン) aired 2004-10-10. ja-WP 金色のガッシュ!! 各話リスト 放送日 = 10月10日 for 話数 77; konjikinogash.fandom.com Episode 77 | ep 131: Ep 131 'Determination of the King. Friends? The World? Gash's Decision' (王の覚悟 友か? 世界か? ガッシュの決断) aired 2005-11-06. ja-WP 各話リスト 放送日 = 11月6日 for 話数 131; konjikinogash.fandom",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/zatch-bell.json', 'https://ja.wikipedia.org/wiki/%E9%87%91%E8%89%B2%E3%81%AE%E3%82%AC%E3%83%83%E3%82%B7%E3%83%A5%21%21', 'https://konjikinogash.fandom.com/wiki/Episode_131', 'https://konjikinogash.fandom.com/wiki/Episode_77'],
  },
  // ---- batch 20 wave 1 (2026-08-27; verified R24 — the verifier parsed all 137 ja-WP rows: zero mismatches; Sean ruled)
  {
    seriesId: 'hunter-x-hunter',
    ruleId: 'G53',
    value: { 83: '2004-04-07', 84: '2004-04-07' },
    reason:
      "Batch 20 wave 2 (verified R24, Sean ruled 2026-08-27): G.I. Final DVD vol 3 (OVA eps 5-6 = OUR rows 83-84) is dated 4月7日 by ja-WP's 各話リスト, 2004.4.7 by Nippon Animation's own goods-net DVD page and April 7 by en-WP; the stored 2004-03-07 follows hunterpedia's typo. The verifier's witness: 2004-03-07 is a SUNDAY while every other release date across all three OVA blocks, in both date regimes, is a Wednesday. Ascending-but-wrong — the order gate could not see it. The block's two-valued regime (ja-WP's table vs Nippon Animation's sell-through schedule, 2-3 weeks apart on five of seven volumes) is a series-level fork left open; only 83/84, where both regimes agree, are repaired.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/hunter-x-hunter.json', 'scripts/ingest/research/batch20/verify/hunter-x-hunter.md'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'G53',
    value: { 25: '2020-10-05', 26: '2020-10-12', 27: '2020-10-19', 28: '2020-10-26', 29: '2020-11-02', 30: '2020-11-09', 31: '2020-11-16', 32: '2020-11-23', 33: '2020-11-30', 34: '2020-12-07', 35: '2020-12-14', 36: '2020-12-21', 37: '2022-10-03', 38: '2022-10-10', 39: '2022-10-17', 40: '2022-10-24', 41: '2022-10-31', 42: '2022-11-07', 43: '2023-05-15', 44: '2023-05-22' },
    reason:
      "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27, ONE atomic block with the titles): rows 25-46 held the Golden Dōga Gekijō web shorts' titles AND dates verbatim — AFL's title authority stops at row 24 and en-WP's second {{Episode list}} block (== Golden Dōga Gekijō ==, shorts #1-46) filled 25-46 (rows 45/46 ruled in batch 19; 47-62 clean). True S3/S4 dates from ja-WP 各話リスト 第三期/第四期 + en-WP seasons 3/4 + goldenkamuy.fandom Episode_N + syobocal TID 6441 (the earliest airing per Count whose flag lacks 再; TV = TOKYO MX Monday 23:00, the shorts are Tuesdays). S4 was a split broadcast (37-42 in 2022, a main-staff-death suspension, 43-49 from 2023-05-15) — the 5-month gap is real, no G54 ack. Applied as a block: 38-44 alone leaves row 37 above the new 38.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/airdates/golden-kamuy.json', 'scripts/ingest/research/batch20/verify/golden-kamuy.md'],
  },
  {
    seriesId: 'the-beginning-after-the-end',
    ruleId: 'G53',
    value: { 13: '2026-04-01', 14: '2026-04-08', 15: '2026-04-15', 16: '2026-04-22', 17: '2026-04-29', 18: '2026-05-06', 19: '2026-05-13', 20: '2026-05-20', 21: '2026-05-27', 22: '2026-06-03' },
    reason:
      "Batch 20 wave 4 (verified R24, Sean ruled 2026-08-28): our S2 rows 13-22 carried NO dates (the AniList component wrote bare rows) — the identity table: Wednesdays 2026-04-01 … 06-03 on syobocal TID 7805 (the earliest non-再 airing per Count), en-WP's season-2 list, MAL, tbate.fandom, and the official site's Monday-before publication cadence (its Firestore pages/story:runQuery, ids s2-01…). No slot move in 13-22; the finale (row 24) moved 06-17 → 06-24 (a World Cup pre-emption — en-WP and AFG still print June 17, wrong).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/the-beginning-after-the-end-w4.json', 'scripts/ingest/research/batch20/verify/the-beginning-after-the-end-w4.md'],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'G53',
    value: { 38: '1983-12-25', 87: '1985-04-07', 90: '1985-04-28', 91: '1985-05-05', 92: '1985-05-12', 93: '1985-05-19', 94: '1985-05-26', 95: '1985-06-02', 96: '1985-06-09', 97: '1985-06-16', 98: '1985-06-23', 99: '1985-06-30', 100: '1985-07-07', 101: '1985-07-14', 102: '1985-07-21', 103: '1985-07-28', 104: '1985-08-04', 105: '1985-08-11', 106: '1985-08-18', 107: '1985-10-06', 108: '1985-10-13', 109: '1985-10-20', 110: '1985-10-27', 111: '1985-11-03', 112: '1985-11-10', 113: '1985-11-17', 114: '1985-11-24', 115: '1985-12-01', 116: '1985-12-08', 117: '1985-12-15', 118: '1985-12-22', 119: '1985-12-29' },
    reason:
      "The dateless kinnikuman claim G53 has waited for since batch 18 ('eps 90-119 one week early', ep 38, ep 87), now cited: the stored column duplicates 1984-01-08 on rows 38/39 and 1985-04-21 on rows 89/90 and drops the 1985-12-29 airing, so rows 38 and 90-119 each carry the NEIGHBOUR's date (ep+1 for 38, ep-1 for 90-119) and row 87 is null; every corrected value is ja-WP 各話リスト's (all Sundays, the 日曜10:00 slot; 107 = 1985-10-06 after the seven-week 傑作選 hiatus), corroborated one day early (Saturday) by kinnikuman.fandom's episode list. Rows 1-37, 39-86, 88-89 and 120-137 already match ja-WP.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/kinnikuman.json', 'scripts/ingest/research/batch20/verify/kinnikuman.md', 'https://ja.wikipedia.org/wiki/キン肉マン_(テレビアニメ)'],
  },
  {
    seriesId: 'gantz',
    ruleId: 'G53',
    value: { 22: '2004-10-21', 25: '2004-11-11' },
    reason:
      "The second season ran Thursdays 10:00 on AT-X without a break (ep 14 2004-08-26 → ep 26 2004-11-18): 2004-10-22 is a Friday and 2004-11-10 a Wednesday — AFL's values, inherited; syobocal TID 483 (ChID 20 = AT-X, per-airing rows), gantz.fandom's episode infoboxes, en-WP's episode list and MAL's episode list all give 10-21 and 11-11 (four witnesses). Both errors still ascend, so no order gate saw them (the day-of-week class).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/gantz.json', 'scripts/ingest/research/batch20/verify/gantz.md', 'https://cal.syoboi.jp/tid/483'],
  },
  {
    seriesId: 'orange',
    ruleId: 'G53',
    value: { 10: '2016-09-05', 11: '2016-09-12', 12: '2016-09-19', 13: '2016-09-26' },
    reason:
      "AFL's rows 10-13 are one day early as one block (stored Sundays; the broadcast is 月曜 0:00 MX/AT-X = Monday): syobocal TID 4229 per-airing + ja-WP's 7/4-9/26 run. One atomic repair, not four one-offs (the wave-7 orange verdict named the block). Batch 20 wave 7.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/orange.json', 'https://cal.syoboi.jp/db.php?Command=ProgLookup&TID=4229'],
  },
  {
    seriesId: 'soul-eater-not',
    ruleId: 'G53',
    value: { 12: '2014-07-01' },
    reason:
      "AFL runs a naive 12-week grid from the premiere and misses the broadcast's skip week: the finale aired Tue 2014-07-01 (syobocal TID 3336: TV Tokyo Count=12 at 07-02 01:40 = 07-01 25:40; ja-WP 4/8-7/1; AniList endDate 07-02). Stored 06-24 repaired. Batch 20 wave 7.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/soul-eater-not.json', 'https://cal.syoboi.jp/db.php?Command=ProgLookup&TID=3336'],
  },

  {
    seriesId: 'one-piece-log-fish-man-island-saga',
    ruleId: 'G53',
    value: { 2: '2024-11-10', 3: '2024-11-17', 4: '2024-11-24', 5: '2024-12-01', 6: '2024-12-08' },
    reason:
      "Batch 20 wave 8 (verified R24), Sean ruled 2026-09-02: rows 2-6 stored AFL's Saturdays = Crunchyroll's US dates, one day early against the Fuji TV Sunday 09:30 JST slot (ja-WP ONE PIECE LOG table, onepiece.fandom's Log episode table, opwiki, MAL — fandom's crunchyAirdate prints the stored values exactly); row 1 alone held the JP date, so AFL's simulcast-era column is a MIXED lineage. One block, not five one-offs. Rows 7-21 will arrive from the same seeder one day early — extend this entry when they land.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/one-piece-log-fish-man-island-saga.json', 'scripts/ingest/research/batch20/verify/one-piece-log-fish-man-island-saga.md'],
  },
  {
    seriesId: 'ranking-of-kings-the-treasure-chest-of-courage',
    ruleId: 'G53',
    value: { 1: '2023-04-14', 2: '2023-04-21', 3: '2023-04-28', 4: '2023-05-05', 5: '2023-05-12', 6: '2023-05-19', 7: '2023-05-26', 8: '2023-06-02', 9: '2023-06-09', 10: '2023-06-16' },
    reason:
      "Batch 20 wave 8 (verified R24), Sean ruled 2026-09-02: the anthology's ten rows carried NO air dates (no AFL page). The post-midnight calendar dates of the Noitamina 木曜24:55 slot, agreed by ja-WP 各話リスト（勇気の宝箱）, en-WP's 2023 episode table, syobocal TID 6691 ProgLookup (ChID 3, every slot slip 00:55-01:55 verified) and the official STORY pages; Fuji TV's own listing and the fandom print the previous Thursday (the broadcaster's evening convention) — the calendar date is the catalog's convention.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/ranking-of-kings-the-treasure-chest-of-courage.json', 'scripts/ingest/research/batch20/verify/ranking-of-kings-the-treasure-chest-of-courage.md', 'https://cal.syoboi.jp/db.php?Command=ProgLookup&TID=6691'],
  },
];

export const AIR_DATE_OVERRIDES: Record<string, Record<number, RuledAirDate>> = toMergedRecord(ENTRIES);
