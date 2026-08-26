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
];

export const AIRDATE_ORDER_ACK: Record<string, AirdateOrderAck> = toRecord(ENTRIES);

export const isAirdateOrderAcked = (seriesId: string, episode: number): boolean => {
  const a = AIRDATE_ORDER_ACK[seriesId];
  return a === 'all' || (Array.isArray(a) && a.includes(episode));
};
