// Applied rulings — apply-research-aot-finale.ts (AoT finale specials, Sean's
// ep-89 report 2026-08-23). Script = cited record; T2.1 extraction.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-aot-finale.ts';
const CITES = [SCRIPT, 'docs/changelog.md §12.33', 'GamesRadar Final Chapters guide', 'mangashed season→chapter conversion', 'doublesama + cyphype Special recaps', 'attackontitan.fandom THE_FINAL_CHAPTERS_Special_2', 'dualshockers/comicbook/epicdope vol-34 extra-pages coverage'];
const base = { ruledBy: 'Sean' as const, ruledOn: ON, cite: CITES };

export const ENTRIES: RulingEntry[] = [
  { seriesId: 'attack-on-titan', ruleId: 'A30', value: { episode: 88, chapter: 134, start_chapter: 131, chapters_adapted: '131-134', volume: 33, source: 'manual' }, reason: 'The Final Chapters Special 1 (2023-03-04, 1 hr) — chs 131-134, vol 33. Ep 88 had NO anchor before this report.', ...base },
  { seriesId: 'attack-on-titan', ruleId: 'A14', value: { episode: 89, chapter: 139, start_chapter: 135, chapters_adapted: '135-139 + vol-34 extended-ending pages', volume: 34, source: 'manual' }, reason: 'The Final Chapters Special 2 (2023-11-05) — chs 135-139 AND the vol-34 extended-ending pages (Mikasa epilogue/flash-forward). REPAIR: replaces unverified MU pin (end-only 139, no start, no adaptation record). Vol-34 omake extras (our chapter space 140-141) NOT adapted — frontier stays 139 honestly.', ...base },
  { seriesId: 'attack-on-titan', ruleId: 'A43', value: { episode: 89, kind: 'graft', chapters: '139 + vol-34 extended-ending pages' }, reason: "finale grafts the vol-34 extra pages (Ymir silhouette, grave visit, future flash-forward) beyond ch 139's magazine version", ...base },
];
