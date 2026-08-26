// Applied rulings — apply-rearranged-anchors.ts (rearranged-zone promotion,
// the GTO 20/21 lesson — Sean's report 2026-08-23). RULE (A3): exact known
// per-episode adaptation ALWAYS becomes an anchor; the non-monotonic ruling
// (A19) renders it as stored. Values are banked batch 8-11 verdict data
// that had been left annotation-only. T2.1 extraction.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-rearranged-anchors.ts';

const anchor = (seriesId: string, batch: string, episode: number, chapter: number, start_chapter: number, chapters_adapted: string, volume: number | null, reason: string, ruledBy: 'Sean' | 'session' = 'session'): RulingEntry => ({
  seriesId, ruleId: 'A3', value: { episode, chapter, start_chapter, chapters_adapted, volume, source: 'manual' }, reason, ruledBy, ruledOn: ON,
  cite: [SCRIPT, 'docs/changelog.md §12.32', `${batch} verdict (${seriesId})`],
});

export const ENTRIES: RulingEntry[] = [
  // gto — full per-episode map from the batch-11 verdict (fandom infoboxes)
  anchor('gto-great-teacher-onizuka', 'batch-11', 12, 41, 39, '39-41', 5, 'per fandom infobox'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 13, 47, 41, '41-43, 46-47', 6, 'non-contiguous per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 14, 47, 44, '44-47', 6, 'per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 15, 52, 47, '47-52', 7, 'per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 16, 55, 51, '51-55', 7, 'Urumi introduced (Mermaid chapters)'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 17, 59, 56, '56-59', 7, 'per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 18, 63, 61, '61-63', 8, 'ch 60 skipped before this'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 20, 74, 73, '73-74', 9, 'aired BEFORE ep 21 (ch 70) — as-stored non-monotonic; the interpolated ~68 was wrong (Sean caught it)', 'Sean'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 21, 70, 70, '70', 9, 'aired after 73-74 — as-stored (the GTO 20/21 lesson: research knew the values but only an annotation held them, so the display interpolated and lied)', 'Sean'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 29, 77, 75, '75-77', 9, 'trip-money theft frame-up'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 30, 82, 77, '77-82', 10, 'per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 31, 85, 82, '82-85', 10, "'Destination: Okinawa'"),
  anchor('gto-great-teacher-onizuka', 'batch-11', 32, 87, 85, '85-87', 11, 'per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 35, 72, 72, '72', 9, 'Uchiyamada wedding, deferred from the vol-9 zone — as-stored'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 36, 94, 93, '93-94', 12, 'Fuyutsuki makeover / Teshigawara'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 37, 96, 95, '95-96', 12, 'per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 38, 98, 97, '97-98', 13, 'treasure hunt begins (ch 98 title match)'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 39, 102, 99, '99-102', 13, 'per fandom'),
  anchor('gto-great-teacher-onizuka', 'batch-11', 40, 102, 102, '102 + 107 (graft)', 13, 'graft from vol 14 — END stays 102; do not advance past 106'),
  // my-hero-academia — S5 MVA block per-ep runs (batch-11 caveat data)
  anchor('my-hero-academia', 'batch-11', 108, 224, 221, '220 (p8, 12-15), 221-224 (p1-6)', 23, 'MVA block, aired after 241-255 — as-stored'),
  anchor('my-hero-academia', 'batch-11', 109, 228, 225, '218 (p9-11), 224 (p6-15), 225-228', 24, 'MVA block — as-stored'),
  anchor('my-hero-academia', 'batch-11', 110, 232, 229, '229, 230, 231 (pp1, 6-15), 232', 24, 'MVA block — as-stored'),
  anchor('my-hero-academia', 'batch-11', 111, 236, 233, '233 (pp1-2, 4-15), 234, 235, 236', 24, 'MVA block — as-stored'),
  // cells-at-work — S1 exact singles (batch-11 verdict)
  anchor('cells-at-work', 'batch-11', 2, 4, 4, '4', 1, 'S1 out-of-book-order — as-stored'),
  anchor('cells-at-work', 'batch-11', 3, 3, 3, '3', 1, 'as-stored (S1 out-of-book-order)'),
  anchor('cells-at-work', 'batch-11', 5, 2, 2, '2', 1, 'as-stored (S1 out-of-book-order)'),
  anchor('cells-at-work', 'batch-11', 9, 12, 12, '12', 3, 'as-stored (S1 out-of-book-order)'),
  anchor('cells-at-work', 'batch-11', 10, 15, 15, '15', 3, 'as-stored (S1 out-of-book-order)'),
  anchor('cells-at-work', 'batch-11', 11, 6, 6, '6', 2, 'Heat Stress, moved from vol 2 — as-stored'),
  anchor('cells-at-work', 'batch-11', 15, 19, 13, '13, 19', 4, 'S2 pairs the S1-skipped chapters'),
  anchor('cells-at-work', 'batch-11', 16, 16, 14, '16, 14', 4, 'S2 pairs the S1-skipped chapters — as-stored'),
  // beastars — S2 jumble per-ep lists (batch-10 verdict; medium)
  anchor('beastars', 'batch-10', 13, 54, 50, '50, 52, 54', 7, 'S2 opening reorder — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 14, 56, 50, '53, 54 (end), 55, 56 (a), 50 (end)', 7, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 15, 59, 51, '58, 51, 59', 7, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 16, 64, 56, '60, 61, 62 (half), 64, 56 (b)', 8, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 17, 65, 57, '57, 62 (half), 63, 65 (a)', 8, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 19, 78, 71, '71, 72, 78, 77', 9, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 20, 80, 68, '70, 68, 79, 80', 9, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 21, 81, 65, '74, 81, 69 (part), 65 (end), 66 (start), 75, 76', 9, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 22, 89, 83, '89 (a), 83, 87, 93 (part), 84, 85', 11, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  anchor('beastars', 'batch-10', 23, 92, 82, '82, 89 (b), 88, 90 (parts), 91 (b), 92 (a)', 11, 'S2 jumble per-episode list — as-stored, MEDIUM'),
  // nisekoi — title-matched trio (batch-10, medium)
  anchor('nisekoi', 'batch-10', 29, 86, 82, '82, 86', 10, 'title-match mapping — MEDIUM, as-stored'),
  anchor('nisekoi', 'batch-10', 30, 85, 83, '83-85', 10, 'title-match mapping — MEDIUM, as-stored'),
  anchor('nisekoi', 'batch-10', 31, 98, 93, '93, 98', 11, 'title-match mapping — MEDIUM'),
  // assassination-classroom — ep 5 (batch-10 verdict)
  anchor('assassination-classroom', 'batch-10', 5, 11, 7, '7, 11', 2, 'ch 7 held back from ep 4, adapted here with 11 — as-stored'),
  // iruma — Walter Park reorder pair (batch-11 verdict)
  anchor('welcome-to-demon-school-iruma-kun', 'batch-11', 36, 73, 69, '69 (p.1, 12-20), 70, 73 (p.4-20)', 9, 'ch 73 pulled ahead — as-stored'),
  anchor('welcome-to-demon-school-iruma-kun', 'batch-11', 37, 74, 71, '71, 72, 74', 9, 'Walter Park reorder pair — as-stored'),
];
