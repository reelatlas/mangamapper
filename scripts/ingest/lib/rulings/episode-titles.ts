// EPISODE_TITLE_OVERRIDES — ruled episode titles (rule G53, extended
// 2026-08-27 in batch 19 wave 2, Sean's B3-7 ruling): a row-content
// TRANSPOSITION carries the TITLE with the date — AFL prints two adjacent
// rows with each other's content (tanya 5/6, to-love-ru 9/10, blue-lock
// 15/16, durarara 37/38, initial-d 46-48) or a web short's row where a TV
// episode belongs (golden-kamuy 45/46), and an air_date-only repair would
// leave the row self-inconsistent. Same mechanism as AIR_DATE_OVERRIDES:
// re-applied inside filterEpisodeRows at EVERY episode write (a bare DB
// update is clobbered by the next AFL refresh), asserted over standing rows
// by assert-overrides.ts, a disagreeing stored title is a ruling_violation.
// Titles are AFL-space strings (the stored wording is kept where it was
// merely transposed); a title never enters without a cited pairing (R3).
import { toMergedRecord, type RulingEntry } from './types';

export const ENTRIES: RulingEntry<Record<number, string>>[] = [
  {
    seriesId: 'the-beginning-after-the-end',
    ruleId: 'G53',
    value: { 13: "The King Begins Adventuring", 14: "The Princess Begins Adventuring", 15: "The King is Stranded", 16: "The King’s Homecoming", 17: "The King’s Struggles", 18: "The King is Betrayed", 19: "The King Survives", 20: "The King’s Day in Court", 21: "The King’s Gratitude", 22: "The King Negotiates" },
    reason:
      "Batch 20 wave 4 (verified R24, Sean ruled 2026-08-28): our S2 rows 13-22 carried NO titles — the English titles in the space our S1 rows store (MAL / Crunchyroll; AFG agreeing on all ten), the Japanese titles confirmed character-for-character on the official site's story articles and syobocal TID 7805's SubTitles (12/12). The row-18 en-WP title is a translation of the native title, not the licensed one.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/the-beginning-after-the-end-w4.json', 'scripts/ingest/research/batch20/verify/the-beginning-after-the-end-w4.md'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'G53',
    value: { 25: "To Karafuto", 26: "Stenka", 27: "Igogusa", 28: "The Immortal Sugimoto Harakiri Show", 29: "The Border", 30: "Bad Sign", 31: "Meko Oyasi", 32: "Manslayer", 33: "Revolutionary", 34: "Catching Up to the Wolf", 35: "Sin and Impurity", 36: "To Live", 37: "Rushin' Outta Russia", 38: "Cocoon", 39: "The Smell of Sulfur", 40: "Spoiled Rich Kid", 41: "Cinematograph", 42: "Sweet Lies", 43: "Fleeing Karafuto", 44: "Brown Bear Man" },
    reason:
      "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27, one atomic block with the dates — air-dates.ts): rows 25-44 held the Golden Dōga Gekijō shorts' titles verbatim ('Are you tired? Episode' … 'Fukujusō Episode'); the TV titles from en-WP seasons 3/4 + goldenkamuy.fandom + ja-WP 各話リスト, 1:1 by number and date. Flag #860 = no offset.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/airdates/golden-kamuy.json', 'scripts/ingest/research/batch20/verify/golden-kamuy.md'],
  },
  {
    seriesId: 'shugo-chara',
    ruleId: 'G53',
    value: { 107: "Yaya's Enthusiastic Gardening!", 108: 'The Place Eggs Return To' },
    reason:
      "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): AFL's Party rows 107/108 hold each other's title AND date — ja-WP しゅごキャラ! パーティー! 各話リスト, en-WP and syobocal ChID 7 agree: 107 = ややの張り切りガーデニング!! 2009-10-31, 108 = たまごの帰る場所！ 2009-11-07. A transposition carries the title with the date; both rows are filler, no anchors. Outside the N11 resort span (74-96).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/airdates/shugo-chara.json', 'scripts/ingest/research/batch20/verify/shugo-chara.md'],
  },
  {
    seriesId: 'yu-yu-hakusho-ghostfiles',
    ruleId: 'G53',
    value: { 42: 'A Matter of Love and Death' },
    reason:
      "Batch 20 wave 2 (verified R24, Sean ruled 2026-08-27): the stored 'A Master of Love and Death' is a typo — en-WP 'Yu Yu Hakusho season 2' (ep 42, 1993-08-07), yuyuhakusho.fandom Episode_42 and its Season 2 guide all read 'Matter'. Cosmetic; the wave's joins were made on date + the JP subtitle (覆面戦士の厳しき素顔 is ep 43; ep 42 = 1993-08-07).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/yu-yu-hakusho-ghostfiles.json', 'scripts/ingest/research/batch20/verify/yu-yu-hakusho-ghostfiles.md'],
  },
  {
    seriesId: 'saga-of-tanya-the-evil',
    ruleId: 'G53',
    value: { 5: 'My First Battalion', 6: 'Beginning of Madness' },
    reason:
      "Rows 5 and 6 held each other's title AND date (AFL-inherited): ja-WP 各話リスト 第伍話 はじまりの大隊 2月3日 / 第陸話 狂気の幕開け 2月10日; en-WP agrees. The dates move under AIR_DATE_OVERRIDES; the titles travel with them.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/saga-of-tanya-the-evil.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'to-love-ru',
    ruleId: 'G53',
    value: { 9: 'From a Shining Star, With Love', 10: 'A Space Entertainer' },
    reason:
      "Rows 9 and 10 held each other's title AND date: ja-WP 話数 9 光星より愛を込めて / 10 宇宙の女芸人; en-WP 05-30 / 06-06; syoboi TID 1352 #9 2008-05-30 01:55 / #10 06-06 (the stored −1-day convention → 05-29 / 06-05). Titles travel with the dates.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/to-love-ru.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'blue-lock',
    ruleId: 'G53',
    value: { 15: 'Devour', 16: 'Tri-Fusion' },
    reason:
      "Rows 15 and 16 held each other's title AND date: ja-WP 第15話「喰」1月22日 / 第16話「三者融合」1月29日; en-WP Blue Lock season 1 agrees. Titles travel with the dates.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/blue-lock.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'durarara',
    ruleId: 'G53',
    value: { 37: 'Adversity Makes a Man Strong', 38: 'Love Thy Enemy' },
    reason:
      "Rows 37 and 38 held each other's title AND date (AFL's own transposition, copied verbatim): our 37 = ×2 承 ep 12 郷に入っては郷に従え 'Adversity Makes a Man Wise/Strong' 2015-03-28 (syoboi TID 3625), our 38 = ×2 転 ep 1 'Love Thy Enemy' 2015-07-04 (syoboi TID 3799); en-WP overall list agrees. The AFL wording of the stored title is kept (titles are AFL-space).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/durarara.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'initial-d',
    ruleId: 'G53',
    value: { 46: 'Blind Attack', 47: "The 85's Raging Turbo", 48: 'Fateful Battle of the FDs' },
    reason:
      "A 3-cycle at rows 46-48 (AFL's own ordering, inherited): ja-WP prints ACT.5+6 under one rowspan'd 8月21日 (2004) and ACT.7+8 under 10月15日, ACT.9 12月17日; en-WP agrees. Correct: 46 = ACT.6 'Blind Attack' 08-21, 47 = ACT.7 'The Stormy 85 Turbo' (AFL wording kept) 10-15, 48 = ACT.8 'Fateful Battle of the FDs' 10-15 (row 48's date was already right; only its title moves). Fourth Stage aired two ACTs per date — equal consecutive dates in 41-64 are correct.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/initial-d.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'G53',
    value: { 45: 'Partner in Crime', 46: 'Perfect Mother' },
    reason:
      "Rows 45/46 held the titles AND dates of two ゴールデン道画劇場 web shorts ('Shoot and stop! Episode' 2023-06-20 / 'Menko Episode' 06-27) — en-WP's 'List of Golden Kamuy episodes' carries a second {{Episode list}} block under '== Golden Dōga Gekijō ==' whose numbers 1-46 collide with the TV numbers (the scraper trap; verifier: our stored strings are that block's rows 45/46 verbatim). The TV episodes: 第四十五話「共犯」'Partner in Crime' 2023-05-29, 第四十六話「完璧な母」'Perfect Mother' 2023-06-05 (ja-WP + en-WP season 4).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/golden-kamuy.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md', 'https://en.wikipedia.org/wiki/Golden_Kamuy_season_4'],
  },
  {
    seriesId: 'dragon-ball-z-kai',
    ruleId: 'G53',
    value: { 128: 'The Nightmare Returns; The Immortal Monster, Majin Buu!' },
    reason:
      "Stored row 128 held intl ep 139's title AND date ('Who Will Defeat Majin Buu? The Mightiest of Men Moves Out' = 魔人を倒すのは誰だ? 最強の男始動!!, 2014-11-30 — row 139 carries the same date, a duplicate not a swap; verifier: en-WP 139 = 2014-11-30 = ja JP132). Intl ep 128 = 悪夢再来 不死身の怪物 魔人ブウ! = JP 121, 2014-09-14 (ja-WP 魔人ブウ編; en-WP ep 128) — the date moves under AIR_DATE_OVERRIDES, the title with it.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/dragon-ball-z-kai.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'orange',
    ruleId: 'G53',
    value: { 13: 'LAST LETTER' },
    reason:
      "AFL prints 'LETTER 13'; the episode's real title is LAST LETTER (the official site's story page, ja-WP 各話リスト, en-WP — and the manga's own final chapter is titled LAST LETTER, Futabasha's webアクション page). Batch 20 wave 7.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/orange.json'],
  },

  {
    seriesId: 'ranking-of-kings-the-treasure-chest-of-courage',
    ruleId: 'G53',
    value: { 1: "Kage's Errand / The Prince and Money", 2: "Beasts of the Wilderness / A Mysterious Desert", 3: "Hiling's Old Friend / Daida and Magic", 4: "Immortality and the Three Brothers", 5: "The Laws of the Underworld / A White Horse in Love / The Gentle Soldier, Hokuro", 6: "Bojji the King / The Melancholy of King Daida", 7: "The Snake Charmer with the Crooked Smile / The Big Four's Banquet", 8: "Kage's Yearning / A Great Mother", 9: "Miranjo and the Demon / The Prince and His Treasures", 10: "Return of the Sword King" },
    reason:
      "Batch 20 wave 8 (verified R24), Sean ruled 2026-09-02: the anthology's ten rows carried NO titles (no AFL page). English titles per en-WP's 2023 episode table + ousamaranking.fandom (the catalog's convention, as TBATE / orange); multi-segment rows joined with ' / ' in broadcast order (syobocal joins the same segments with ／; the JP titles are in the verdict's structure.notes). All ten agree across ja-WP, en-WP, syobocal and the official STORY pages.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/ranking-of-kings-the-treasure-chest-of-courage.json', 'scripts/ingest/research/batch20/verify/ranking-of-kings-the-treasure-chest-of-courage.md'],
  },
];

export const EPISODE_TITLE_OVERRIDES: Record<string, Record<number, string>> = toMergedRecord(ENTRIES);
