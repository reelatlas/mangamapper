// Applied rulings — apply-start-chapters.ts (research-anchor START chapters,
// Sean's ruling 2026-08-23: starts are real data). The 27 starts were seeded
// under the MAJORITY rule (A11, since superseded by the sliver rule A10) —
// they are DRIFT-LIST A-6's re-normalization target. T2.1 extraction.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-start-chapters.ts';
const RETIRES = 'A-6 healer under the sliver rule';

const start = (seriesId: string, episode: number, start_chapter: number, reason: string, majority = false): RulingEntry => ({
  seriesId, ruleId: majority ? 'A11' : 'A10', value: { episode, start_chapter }, reason: `${reason}${majority ? ' (majority rule decided this value; sliver rule may differ)' : ' (span opens on a whole chapter — sliver and majority rules agree)'}`,
  ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT, 'docs/changelog.md §12.27', `batch ${seriesId === 'oshi-no-ko' || seriesId === 'haikyu' || seriesId === 'naruto' ? '9' : '8'} verdict (${seriesId})`],
  retiresWhen: RETIRES, ...(majority ? { supersedes: 'A11 majority rule → A10 sliver rule (batch 14 tightened it; never re-normalized — A-6)' } : {}),
});

export const ENTRIES: RulingEntry[] = [
  start('oshi-no-ko', 20, 65, 'adapts 65-67'),
  start('oshi-no-ko', 24, 78, 'ch 78-80 content (+109 graft)'),
  start('oshi-no-ko', 28, 93, 'adapts 93-96'),
  start('oshi-no-ko', 30, 102, 'adapts 102-103'),
  start('oshi-no-ko', 34, 115, '114 p.18 tail + 115-118 → majority 115', true),
  start('oshi-no-ko', 35, 119, 'covers 119-127'),
  start('attack-on-titan', 64, 99, 'chs 99-100'),
  start('attack-on-titan', 67, 105, 'ch 105 only'),
  start('attack-on-titan', 68, 106, 'ch 106 only'),
  start('attack-on-titan', 73, 112, 'half of 112 through 113 → majority 112', true),
  start('attack-on-titan', 74, 114, 'ch 114 only'),
  start('jujutsu-kaisen', 34, 91, '90 p.21 tail + 91-93 → majority 91', true),
  start('jujutsu-kaisen', 35, 94, '94-97'),
  start('jujutsu-kaisen', 40, 113, '113-116'),
  start('jujutsu-kaisen', 42, 120, '120 p.7-19 + 121-122 → majority 120', true),
  start('jujutsu-kaisen', 45, 129, '129-132'),
  start('haikyu', 65, 212, '212-215'),
  start('haikyu', 68, 220, '220-222'),
  start('haikyu', 70, 225, '225-228'),
  start('haikyu', 72, 231, '231-234'),
  start('haikyu', 74, 243, '243-246'),
  start('naruto', 110, 182, '182-183'),
  start('naruto', 114, 189, '189-191'),
  start('naruto', 117, 196, '196-198'),
  start('naruto', 124, 211, '211-212'),
  start('naruto', 127, 216, '216-217'),
  start('naruto', 132, 226, '226-228'),
];
