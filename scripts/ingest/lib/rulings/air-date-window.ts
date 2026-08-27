// AIR_DATE_WINDOW_ACK — ruled rows whose air date truly sits outside their
// series' run (rule G55, 2026-08-26; batch 19 E2). The window gate
// (lib/wiki-identity.ts) refuses and lists a TV row dated before the series
// began or long after it ended, because such a row is usually another
// show's (the namesake lesson). An acknowledged series ('all') or episode
// list (number[]) is a documented true deviation — reason + cite required.
// Non-TV formats and episode-0 rows are exempt structurally and need no
// entry. Everything else off-window is either contamination (purged, the
// honest gap stands) or a G53 date typo.
import { toRecord, type RulingEntry } from './types';

export type AirDateWindowAck = 'all' | number[];

export const ENTRIES: RulingEntry<AirDateWindowAck>[] = [
  {
    seriesId: 'the-melancholy-of-haruhi-suzumiya',
    ruleId: 'G55',
    value: 'all',
    reason:
      "Same fact as the G54 acknowledgement: our 28 rows follow the 2009 chronological rebroadcast numbering (start_date 2009) while the fourteen original episodes keep their true 2006 first-air dates. Every 'before start' row in the series is that design, not another show's data.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://en.wikipedia.org/wiki/List_of_The_Melancholy_of_Haruhi_Suzumiya_episodes', 'scripts/ingest/lib/rulings/air-date-order.ts'],
  },
];

export const AIR_DATE_WINDOW_ACK: Record<string, AirDateWindowAck> = toRecord(ENTRIES);

export const isAirDateWindowAcked = (seriesId: string, episode: number): boolean => {
  const a = AIR_DATE_WINDOW_ACK[seriesId];
  return a === 'all' || (Array.isArray(a) && a.includes(episode));
};
