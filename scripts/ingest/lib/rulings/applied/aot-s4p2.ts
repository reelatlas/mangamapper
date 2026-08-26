// Applied rulings — apply-research-aot-s4p2.ts (AoT S4 Part 2 per-episode
// map, Sean's eps 85/86/87 report 2026-08-23). Ep 87's start (123) was
// OVERTAKEN the same day (batch-14 SESSION_REPAIRS: 123 → 130, A12 relocated
// openers are never the START) — re-running the script reverts it
// (DRIFT-LIST §E.5). T2.1 extraction.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-aot-s4p2.ts';
const CITES = [SCRIPT, 'docs/changelog.md §12.33', 'attackontitan.fandom episode + chapter pages', 'animefillerguide conversion chart', 'doublesama manga-reader reviews', 'Wikipedia S4 plot summaries'];
const base = { ruledBy: 'Sean' as const, ruledOn: ON, cite: CITES };

const anchor = (episode: number, chapter: number, start_chapter: number, chapters_adapted: string, volume: number, reason: string, extra: Partial<RulingEntry> = {}): RulingEntry => ({
  seriesId: 'attack-on-titan', ruleId: 'A30', value: { episode, chapter, start_chapter, chapters_adapted, volume, source: 'manual' }, reason, ...base, ...extra,
});

export const ENTRIES: RulingEntry[] = [
  anchor(76, 118, 117, '115 (paths flashback), 117-118', 29, "begins mid-117 (ep 75 animated 117's opening pages); ch-115 fragment = Zeke paths-revival flashback"),
  anchor(77, 119, 118, '117 (tail sliver), 118, 119 (part)', 29, 'majority 118, ends partway into 119; start=118 per sliver rule'),
  anchor(78, 120, 119, '119, 120 (first half), 115 (fragment)', 30, "ends halfway through 120 (doublesama), not at 119's cliffhanger"),
  anchor(79, 121, 120, '120 (second half), 121 (most)', 30, 'Grisha memories; ep 80 finishes 121'),
  anchor(80, 124, 121, '121 (end), 122, 123 (second half), 124 (opening)', 30, "REORDER: skips 123's first half (relocated to ep 87); ends on 124's opening panels (walls crumble)"),
  anchor(81, 124, 124, '124', 31, "single chapter 'Thaw'; its opening panels were ep 80's ending"),
  anchor(82, 125, 125, '125', 31, "single chapter 'Sunset'"),
  anchor(83, 126, 126, '126', 31, "single chapter 'Pride'"),
  anchor(84, 127, 127, '127', 32, "single chapter 'Night of the End' — visually restructured (anime-original memory-vista framing), content faithful"),
  anchor(85, 128, 128, '128', 32, "single chapter 'Traitor'"),
  anchor(86, 130, 129, '129, 130 (first part)', 32, 'all of 129 + beginning of 130; ep 87 resumes 130'),
  anchor(87, 130, 123, '123 (first half, relocated flashback), 130 (remainder)', 32, "REORDER: cold-opens with ch 123's first half (Marley survey trip) skipped back in ep 80, then finishes 130. Furthest point = 130 (linear instrument intact). REPAIR: was end-only 130", {
    retiresWhen: 'OVERTAKEN 2026-08-23 (same day; batch-14 SESSION_REPAIRS, Sean\'s out-of-order report) — start_chapter 123 → 130: the relocated ch-123 cold open is a flashback sliver, not the position (A12 relocated openers are never the START; A21 start-sanity). chapters_adapted keeps 123 leading.',
  }),
  { seriesId: 'attack-on-titan', ruleId: 'A43', value: { episode: 80, kind: 'rearranged', chapters: '123 (second half only)' }, reason: "adapts 123's second half; first half deferred to ep 87's cold open", ...base },
  { seriesId: 'attack-on-titan', ruleId: 'A43', value: { episode: 87, kind: 'rearranged', chapters: '123 (first half) + 130 (remainder)' }, reason: "finale opens with ch 123's relocated first half before finishing 130", ...base },
];
