// Applied rulings — apply-rearranged-anchors-3.ts (rearranged-zone pass 3,
// Black Lagoon per-episode completion, 2026-08-23). Agent-verified records
// replace stale batch-10 arc-BLOCK anchors (A22 deprecated shape). T2.1.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-rearranged-anchors-3.ts';
const CITES = [SCRIPT, 'docs/changelog.md §12.32', 'lagooncompany.fandom episode infoboxes + Chapters and Volumes List', 'Wikipedia ep list + continuation guides'];
const base = { seriesId: 'black-lagoon', ruledBy: 'session' as const, ruledOn: ON, cite: CITES };

const anchor = (ruleId: 'A3' | 'A22', episode: number, chapter: number, start_chapter: number, chapters_adapted: string, volume: number | null, reason: string): RulingEntry => ({
  ...base, ruleId, value: { episode, chapter, start_chapter, chapters_adapted, volume, source: 'manual' }, reason,
});

export const ENTRIES: RulingEntry[] = [
  anchor('A22', 7, 10, 9, '9-10', 2, "standalone 'Calm down, two men' Parts 1-2 — NOT the Adler conclusion (Adler chs 5-8 ends at ep 6). REPAIR: replaces batch-10 block '0-1, 5-10'"),
  anchor('A22', 10, 4, 3, '3-4', 1, "Rasta Blasta Parts 2-3 re-covered — arc is only chs 2-4 stretched across eps 8-10 with anime-original expansion (extended Revy-vs-Roberta duel); mostly ch-4 material. REPAIR: replaces batch-10 block '2-4'"),
  anchor('A22', 12, 21, 19, '19-21', null, "Goat Jihad Parts 4-6; shares ch-19 boundary with ep 11. Straddles vols 3/4. REPAIR: replaces batch-10 block '16-21'"),
  anchor('A22', 15, 15, 14, '14-15', 3, "Bloodsport Fairy Tale Parts 4-5, arc conclusion. REPAIR: replaces batch-10 block '11-15'"),
  anchor('A22', 18, 43, 41, '41-43', 6, "Greenback Jane Parts 4-6, arc conclusion — furthest-adapted S2 material (aired out of order before Fujiyama). REPAIR: replaces batch-10 block '38-43'"),
  anchor('A3', 21, 30, 28, '28-30', null, 'Fujiyama Gangsta Paradise Parts 7-9; shares ch-30 boundary with ep 22. Straddles vols 4/5. NEW: never mapped'),
  anchor('A22', 24, 37, 35, '35-37', 5, "Fujiyama Parts 14-16 — arc + Second Barrage conclusion. REPAIR: replaces batch-10 block '22-37'"),
  anchor('A22', 29, 76, 70, '70-76', 9, "El Baile de la muerte Parts 27-33, series-of-arc end — interleaves around ep 28's pulled-forward 72-73 (rearranged annotations already ruled). OVA ending diverges somewhat from manga. REPAIR: replaces batch-10 block '44-76'"),
  { ...base, ruleId: 'C2', value: { episode: 24, continue_chapter: 44 }, reason: 'S2 finale: readers continue at 44 (Greenback Jane 38-43 already aired earlier, out of order), not end+1 — anime parity.' },
];
