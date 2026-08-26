// AIR_DATE_OVERRIDES — research-ruled air dates (rule G53, 2026-08-26; the
// first /add-rule exercise). AFL inherits date errors on some pages; a bare
// DB update is clobbered by the next AFL refresh, so ruled dates live here
// and are re-applied inside filterEpisodeRows at EVERY episode write, then
// asserted over standing rows by assert-overrides.ts; ruling_violation is
// the outcome check. Only rows with a CITED date enter (R3): the kinnikuman
// set ("eps 90-119 one week early", ep 38, ep 87) and railgun ep 14 are
// claims without dates in any verdict → batch-18 narrow task, not entries.
import { toRecord, type RulingEntry } from './types';

export const ENTRIES: RulingEntry<Record<number, string>>[] = [
  {
    seriesId: 'fist-of-the-north-star',
    ruleId: 'G53',
    value: { 81: '1986-07-24', 82: '1986-07-31', 85: '1986-08-21', 90: '1986-10-16', 96: '1986-11-27', 108: '1987-02-26' },
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
];

export const AIR_DATE_OVERRIDES: Record<string, Record<number, string>> = toRecord(ENTRIES);
