// AIRDATE_ORDER_ACK — ruled broadcast-order deviations (rule G54, 2026-08-26;
// the second /add-rule exercise, A-11). Our rows follow production / DVD
// numbering; some broadcasts aired a different order, so a stored air date
// that REGRESSES against its predecessor can be true. An acknowledged
// series (value 'all') or episode list (value number[]) leaves the
// airdate_regression review queue and is never withheld by the 365-day
// gate. Everything else regressing is either a typo (G53 corrects it with a
// cited date) or an unruled deviation (the queue). Reason + cite required.
import { toRecord, type RulingEntry } from './types';

export type AirdateOrderAck = 'all' | number[];

export const ENTRIES: RulingEntry<AirdateOrderAck>[] = [
  {
    seriesId: 'the-melancholy-of-haruhi-suzumiya',
    ruleId: 'G54',
    value: 'all',
    reason:
      'The 2006 broadcast deliberately aired its 14 episodes out of chronological order ("Episode 00" first, the six-part Melancholy arc interleaved); our 28 rows follow the 2009 chronological rebroadcast numbering while the rows keep their ORIGINAL first-air dates (2006 for the original episodes, 2009 for the new ones). Every regression in the series is that design, not a typo.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://en.wikipedia.org/wiki/List_of_The_Melancholy_of_Haruhi_Suzumiya_episodes', 'docs/restructure/DRIFT-LIST.md A-11'],
  },
  {
    seriesId: 'cowboy-bebop',
    ruleId: 'G54',
    value: [2, 7, 18],
    reason:
      'TV Tokyo first aired a 12-session subset (Apr–Jun 1998) before WOWOW ran all 26 (Oct 1998–Apr 1999); rows 2, 7 and 18 carry their TX first-air dates and so regress against WOWOW-dated neighbours — real broadcast order. Session 24 (regresses 146 d against 23\'s 1999-09-03) is NOT acknowledged: 23\'s date is suspect (WOWOW\'s run ended 1999-04-24) → batch-18 G53 candidate.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://en.wikipedia.org/wiki/List_of_Cowboy_Bebop_episodes', 'docs/restructure/DRIFT-LIST.md A-11'],
  },
  // ---- batch 19 wave 2, lane B3 (2026-08-27; the contradictions verified R24; Sean ruled B3-7). The walk checks the ack on the REGRESSING row, so each pair names both rows.
  {
    seriesId: 'ranma-1-2',
    ruleId: 'G54',
    value: 'all',
    reason:
      "Our row order is not the Japanese broadcast order — it follows the AFL/AFG sequence, which mixes production / home-video order into aired order (the documented ranma trap: the フィギュアスケート編 was pulled and aired later as 熱闘編 7-9; ja-WP 話数は実際に放送された順). Every stored date is right for its row's TITLE (verifier-sampled 16→26 1989-12-15, 18→15 1989-08-26, 28→30 1990-01-26, 63→69 1990-11-09 …). A renumber to broadcast order would be an N-family change that moves every anchor — never an air-date edit.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/ranma-1-2.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'when-they-cry',
    ruleId: 'G54',
    value: [27, 28],
    reason:
      "Row 27 is the Nekogoroshi-hen OVA — a DVD-purchase bonus (ja-WP 各話リスト OVA / 猫殺し編 / Number -; DVD 全9巻 購入特典) carrying a home-video RELEASE date (ANN Vintage 2007-08-02 = stored; en-WP July 27 = the vol-9 street date), slotted by story position between the 2006 season and Kai, whose ep 1 (row 28, 2007-07-06) therefore regresses against it. A release date is not a broadcast date; the row is correctly ordered.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/when-they-cry.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'f-zero-gp-legend',
    ruleId: 'G54',
    value: 'all',
    reason:
      "Our episode numbering follows the English 4Kids broadcast order, which reordered a block of the Japanese run, while air_date is the Japanese TV Tokyo first broadcast (weekly Tuesday 18:00): EN6=JP9 (2003-12-02), EN9=JP10, EN10=JP12, EN11=JP13 (2004-01-06), EN12=JP11, EN13=JP6 (2003-11-11) per fzero.fandom's JP/EN fields, confirmed on TVmaze's Japanese-order list. Every stored date in rows 5-15 is correct for its title. Join any Japanese source by TITLE, never number.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/f-zero-gp-legend.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'haikyu',
    ruleId: 'G54',
    value: [61, 62, 63],
    reason:
      "Rows 61-62 are the two never-broadcast OVAs 陸VS空 / ボールの\"道\" (ja-WP Number = OVA, 放送日 -; BD 2020-01-22) placed between seasons 3 and 4 in our row order and carrying their home-video date, so S4 ep 1 (row 63, 2020-01-10 in the stored nominal-Friday convention) regresses against them. Real order, not a typo; the release date stays (Sean: ack, not NULL).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/haikyu.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'michiko-and-hatchin',
    ruleId: 'G54',
    value: [6, 9, 17, 20],
    reason:
      "Four pairs aired as double episodes on one night — TIES, not regressions: 5+6 (2008-11-19), 8+9 (2008-12-10), 16+17 (2009-02-11), 19+20 (2009-03-04) in the stored Wednesday convention (syoboi TID 1503 settles the pairings; ja-WP's other pairings are wrong; the slot is Wed 26:08). The walk treats equal dates as consistent; the ack records the design so no pass re-asks.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/michiko-and-hatchin.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'ghost-in-the-shell-stand-alone-complex',
    ruleId: 'G54',
    value: [46, 48, 50, 52],
    reason:
      "2nd GIG's PPV first run aired in monthly PAIRS (ja-WP 月2話ずつ), so rows 45/46, 47/48, 49/50 and 51/52 legitimately carry IDENTICAL dates (en-WP pairs; row 50's 2004-12-04 forced structurally, G53). Ties, not regressions — recorded so no pass re-asks.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/ghost-in-the-shell-stand-alone-complex.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md'],
  },
  {
    seriesId: 'city-hunter',
    ruleId: 'G54',
    value: [13, 14],
    reason:
      "SPLIT EVIDENCE, HELD (the verifier's call): ja-WP pairs 13 = 6月29日 オレの敵は美女 / 14 = 7月6日 16歳 while en-WP, the fandom and TVmaze (one lineage) pair the titles the other way round — and WEBザテレビジョン (thetv.jp/program/0000854667/) independently numbers 第13話「16歳結婚宣言!」/ 第14話「オレの敵は美女?」 with 1, 11, 12, 15, 16 matching official numbering: exactly a broadcast-order swap. Stored dates stand (13 = 1987-07-06, 14 = 1987-06-29 regresses); the G53 repair is NOT taken. A 1987 newspaper listing / the Yomiuri TV archive would decide it.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/city-hunter.json', 'scripts/ingest/research/batch19/verify/b3-contradictions.md', 'https://thetv.jp/program/0000854667/'],
  },
  {
    seriesId: 'black-cat',
    ruleId: 'G54',
    value: [15, 16],
    reason:
      "A first-run SUBSET (the bebop shape): TBS/MBS skipped #15 遠ざかる猫 entirely (syoboi memo #15はTBS系では未放送); its first and only broadcast is Animax 2006-05-23 (G53, replacing the DVD street date 07-26), which sits after row 14 (01-26) and before row 16 (02-02) in TBS order — row 16 regresses against it. Follows from the B4-5 date ruling (session, from the verdict's flagged candidate; not a separate Sean line).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/airdates/black-cat.json', 'scripts/ingest/research/batch19/verify/black-cat.md', 'https://cal.syoboi.jp/tid/685'],
  },
];

export const AIRDATE_ORDER_ACK: Record<string, AirdateOrderAck> = toRecord(ENTRIES);

export const isAirdateOrderAcked = (seriesId: string, episode: number): boolean => {
  const a = AIRDATE_ORDER_ACK[seriesId];
  return a === 'all' || (Array.isArray(a) && a.includes(episode));
};
