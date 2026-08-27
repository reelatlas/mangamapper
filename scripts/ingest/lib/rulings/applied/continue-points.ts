// Applied rulings — apply-continue-points.ts (continue-reading exceptions,
// Sean's display/continue split ruling 2026-08-23). The default these
// exceptions sat on was C9 (end + 1), since SUPERSEDED by C2 anime parity /
// C3 skip notes (b17, DRIFT-LIST A-1); mid-chapter stops apply C1. T2.1.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-continue-points.ts';
const RETIRES = 'RETIRED 2026-08-27 (batch 19 wave 2 deep) — the parity healer (heal-parity-continues, C2/C3 with the C1 guard) re-derives every continue catalog-wide on each pass; the batch-17 values were converted 2026-08-24/26 and nothing stands outside the mechanism';

const cont = (seriesId: string, episode: number, continue_chapter: number, reason: string, batch: 8 | 9, ruleId: 'C9' | 'C1' = 'C9'): RulingEntry => ({
  seriesId, ruleId, value: { episode, continue_chapter }, reason, ruledBy: 'Sean', ruledOn: ON,
  cite: [SCRIPT, 'docs/changelog.md §12.27', `batch ${batch} verdict (${seriesId})`], retiresWhen: RETIRES, ...(ruleId === 'C9' ? { supersedes: 'C9 end+1 default → C2 anime parity' } : {}),
});

export const ENTRIES: RulingEntry[] = [
  cont('jujutsu-kaisen', 47, 138, 'finale grafts post-Shibuya aftermath panels (137) — continue at 138, not 137', 8),
  cont('oshi-no-ko', 35, 127, 'S3 finale ends MID-ch 127 p.1-12 — continue reading ch 127 itself (C1 mid-chapter straddle)', 9, 'C1'),
  cont('rent-a-girlfriend', 12, 52, 'ch 51 is a light skip/interstitial — WDTALO: resume vol 7 ch 52', 9),
  cont('rent-a-girlfriend', 24, 103, 'chs 103-104 never adapted (S3 opens 105) — readers resume at 103', 9),
  cont('miss-kobayashis-dragon-maid', 25, 65, 'anime end = ch 64 — resume vol 7 ch 65', 9),
  cont('seraph-of-the-end-vampire-reign', 24, 42, 'finale ends ch 41 with altered execution — resume ch 42', 9),
  cont('blue-exorcist', 37, 38, 'Kyoto Saga ends ch 34 but chs 35-37 are SKIPPED by the anime — S3 opens at 38; readers who want everything start at 35, anime-parity continues at 38 (WDTALO)', 8),
  cont('food-wars', 73, 265, 'S4 finale montage super-condenses 265-276 — read from 265 despite the credits coverage', 9),
  cont('the-case-study-of-vanitas', 5, 10, 'ep 5 ends partway into Mémoire 10 — continue reading ch 10 itself (C1 mid-chapter straddle)', 8, 'C1'),
];
