// Applied rulings — apply-rearranged-anchors-2.ts (rearranged-zone promotion
// pass 2, Sean's GTO/Black-Lagoon report 2026-08-23): batch 12 anchored Black
// Lagoon only at arc-block ENDS, so interior episodes interpolated across
// non-monotonic points (eps 8-9 showed ~8/6 vs true chs 2-3; eps 19-23
// interpolated BACKWARDS). Same rule as pass 1 (A3, as-stored). T2.1.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-rearranged-anchors-2.ts';

const anchor = (seriesId: string, batch: string, episode: number, chapter: number, start_chapter: number, chapters_adapted: string, volume: number | null, reason: string): RulingEntry => ({
  seriesId, ruleId: 'A3', value: { episode, chapter, start_chapter, chapters_adapted, volume, source: 'manual' }, reason, ruledBy: 'session', ruledOn: ON,
  cite: [SCRIPT, 'docs/changelog.md §12.32', `${batch} verdict (${seriesId})`],
});
const bl = (episode: number, chapter: number, start_chapter: number, chapters_adapted: string, volume: number | null, reason: string) =>
  anchor('black-lagoon', 'batch-10/12 (lagooncompany.fandom infoboxes)', episode, chapter, start_chapter, chapters_adapted, volume, reason);

export const ENTRIES: RulingEntry[] = [
  bl(1, 0, 0, '0 (part; stretched with original expansion)', 1, 'ch 0 = the one-shot opener (kanzenban numbering)'),
  bl(2, 1, 0, '0 (end), 1 (start)', 1, 'finishes ch 0, opens ch 1'),
  bl(3, 1, 1, '1 (end)', 1, 'Chase for Ring-Ding Ships concludes'),
  bl(4, 6, 5, '5-6', 1, 'Das Wieder Erstehen Des Adlers begins'),
  bl(5, 7, 6, '6-7', 2, 'Nazi arc middle'),
  bl(6, 8, 7, '7-8', 2, 'Nazi arc end'),
  bl(8, 2, 2, '2', 1, 'Rasta Blasta begins (vol-1 material moved) — as-stored'),
  bl(9, 4, 3, '3-4 (parts 2-3 split)', 1, 'Rasta Blasta continues — as-stored (interpolation had shown ~8/6 for eps 8-9)'),
  bl(11, 19, 16, '16-19', 4, 'Goat Jihad parts 1-4'),
  bl(13, 12, 11, '11-12', 3, 'Bloodsport Fairy Tale begins (backfill) — as-stored'),
  bl(14, 14, 12, '12-14', 3, 'Bloodsport Fairy Tale continues — as-stored'),
  bl(16, 39, 38, '38-39', 6, 'Greenback Jane begins (pulled forward) — as-stored'),
  bl(17, 41, 39, '39-41', 6, 'Greenback Jane continues — as-stored'),
  bl(19, 24, 22, '22-24', 4, 'Fujiyama Gangsta Paradise begins — as-stored'),
  bl(20, 27, 24, '24-27', 4, 'Fujiyama Gangsta Paradise — as-stored (eps 19-23 had interpolated backwards)'),
  bl(22, 32, 30, '30-32', 5, 'Fujiyama Gangsta Paradise — as-stored'),
  bl(23, 34, 33, '33-34', 5, 'Fujiyama Gangsta Paradise — as-stored'),
  bl(25, 52, 44, '44-52', 6, 'El Baile de la Muerte begins (OVA)'),
  bl(26, 56, 51, '51-56', 7, 'El Baile de la Muerte — as-stored'),
  bl(27, 63, 56, '56-63', 8, 'El Baile de la Muerte — as-stored'),
  bl(28, 73, 64, '64-69 + 72-73 (interleaved)', 9, 'El Baile de la Muerte, 72-73 pulled forward — as-stored'),
  // my-hero-academia — S3 reorder pair (batch-12 verdict)
  anchor('my-hero-academia', 'batch-12', 60, 117, 113, '113 (p17), 114, 115 (p15-17), 116, 117 (p1-10)', 13, 'pulls ch-115 pages forward — as-stored'),
  anchor('my-hero-academia', 'batch-12', 62, 122, 115, '115 (p1-14), 121 (p10-17), 122', 14, 'goes back for ch 115 then finishes 121-122 — as-stored'),
  // hunter-x-hunter (1999) — Arena climax reorder (batch-12 verdict)
  anchor('hunter-x-hunter', 'batch-12', 43, 58, 56, '56-58 (extortion-trio backtrack)', 7, 'aired after 41-42 covered 60-62 — as-stored'),
];
