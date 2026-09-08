// C2 (amended 2026-09-07) — CURATED CONTINUES BY RULING: the continue is derived by the coverage walk (lib/coverage.ts);
// a curated continue exists only for a page-level fact the walk cannot see, and it is recorded HERE so the audit
// (continue_offwalk_curated) knows the disagreement is ruled, never stale. One entry per row; the apply writes the
// value through lib/continues.ts#writeCuratedContinue (C7) and this map is the ruling the census reads (P5). A row
// whose entry no longer matches the stored value is listed — re-rule or retire the entry (P24).
import { type RulingEntry } from './types';

export type CuratedContinueRuling = { episode: number; chapter: number; kind: 'hole' | 'open' | 'walk' | 'post_series' };

export const ENTRIES: RulingEntry<CuratedContinueRuling>[] = [
  {
    seriesId: 'eyeshield-21',
    ruleId: 'C2',
    value: { episode: 57, chapter: 115, kind: 'walk' },
    reason:
      "Batch 23 wave 1 (Sean 2026-09-07 with Cursor): with ep 55's START at 113 ch 112 is no longer a position on any row, and its two page-ranged listings (ep 55 pp.20-24, ep 57 pp.5-19) leave the walk reading 112 as open after ep 57; the verifier established ch 112 COMPLETE by pages (images 3-4 non-story). After ep 57 the reader opens at 115: 113-114 were eps 55-56, 115 is never adapted (its rooftop opening is a flashback in ep 58), ep 58 opens at 116.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-07',
    cite: ['scripts/ingest/research/batch23/verify/w1-eyeshield.md', 'scripts/ingest/research/batch23/out/eyeshield-21-w1.json'],
  },
];

export const CURATED_CONTINUES: Record<string, Record<number, CuratedContinueRuling>> = {};
for (const e of ENTRIES) (CURATED_CONTINUES[e.seriesId] ??= {})[e.value.episode] = e.value;

/** the ruled curated continue for a row, if any */
export const ruledContinue = (seriesId: string, episode: number): CuratedContinueRuling | undefined => CURATED_CONTINUES[seriesId]?.[episode];
