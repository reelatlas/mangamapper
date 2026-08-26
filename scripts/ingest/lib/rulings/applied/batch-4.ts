// Applied rulings — apply-research-batch-4.ts (research batch 4, 2026-08-23):
// part-boundary anchors for the airing trio + TYBW premise corrections.
// Agent-verified 2+ sources; no Sean sign-off text → session. T2.1 extraction.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-4.ts';
const base = { ruledBy: 'session' as const, ruledOn: ON, cite: [SCRIPT] };
const anchor = (seriesId: string, episode: number, chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'A3', value: { episode, chapter, volume: null, source: 'manual' }, reason, ...base });
const cont = (seriesId: string, continue_from_chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'C8', value: { continue_from_chapter }, reason, ...base });

export const ENTRIES: RulingEntry[] = [
  { seriesId: 'bleach-thousand-year-blood-war', ruleId: 'N22', value: { series_scopes: { end_chapter: 686, end_volume: 74 } }, reason: 'final arc ch 480-686 (adaptation + manga number-space end; AniList 705/706 = count space). Scope lever in NUMBER space. Research 2026-08-23', ...base },
  { seriesId: 'bleach-thousand-year-blood-war', ruleId: 'N22', value: { total_chapters: 686 }, reason: 'manga number-space ends at 686; AniList\'s 706 is count space.', ...base },
  anchor('bleach-thousand-year-blood-war', 13, 542, 'Part 1 (The Blood Warfare) finale adapts 538-542. Wikipedia + sportskeeda'),
  anchor('bleach-thousand-year-blood-war', 26, 609, 'Part 2 (The Separation) covered 543-609, ends partway into 609. culturehub + sportskeeda'),
  anchor('bleach-thousand-year-blood-war', 40, 661, 'Part 3 (The Conflict) = eps 27-40 (hour-long double finale), ends at ch 661 p.10. sportskeeda x2 + cbr. Part 4 (eps 41-50) airing — do not anchor until finale'),
  cont('bleach-thousand-year-blood-war', 661, 'Part 3 ends at ch 661 p.10 (mid-chapter) — continue in 661.'),
  anchor('a-certain-scientific-railgun', 73, 96, 'Railgun T finale = end of Dream Ranker arc (chs 71-97; magazine 96/97 merged in volume — conservative 96, continue at 98). toaru wiki x3'),
  cont('a-certain-scientific-railgun', 98, 'magazine 96/97 merged in volume — conservative anchor 96, continue at 98.'),
  anchor('tokyo-revengers', 24, 73, 'S1 finale = ch 73 "A Cry Baby" (ch 64 epilogue skipped). dualshockers + mangashed + animecorner'),
  anchor('tokyo-revengers', 37, 121, 'S2 Christmas Showdown end = ch 121. afteranime + mangashed'),
  anchor('tokyo-revengers', 50, 185, 'S3 Tenjiku end = ch 185 (manga arc runs to 188; anime stopped at 185), continue at 186 / vol 21. mangashed + animecorner + dualshockers'),
  cont('tokyo-revengers', 186, 'S3 stopped at ch 185; continue at 186 / vol 21.'),
];
