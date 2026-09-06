// VISIBILITY — a series is PUBLIC only when its episode types come from a
// classifier or a ruling (P39; Sean's go 2026-09-05, go-list row 5; Cursor:
// "list() really does read every series row — a staged visibility column is
// required, not optional"). A SEEDED series (I42 / G52: no AFL page, no AFG
// page) carries wiki-minted rows typed by the canon-tier default
// (type_default_unclassified) — an honest queue for the census, but a claim
// on a browse page. So it is STAGED: reachable by id (the honest dash
// renders), absent from list and search, until the default rows are
// classified (an AFL / AFG adoption registers the classifier) or a ruling
// here publishes it (T6 pins / research typed it; or the per-row provenance
// column renders a default row as a dash — the queued UI sidecar).
//
// DERIVED, never hand-set: public ⇔ a CLASSIFIER typed the rows — an afl or
// afg registration, a T6 pin on the series (EPISODE_TYPE_OVERRIDES: research
// / Sean typed it), a ruled manual grid (MINTED_GRIDS, G59 path C — every row
// carries a ruled type) — or a PUBLISHED ruling names the series; else
// staged. The first live run (2026-09-05) staged six existing entries: four
// typed by ruling (cardcaptor-sakura-clear-card, ranking-of-kings' treasure
// chest, kinnikuman — T6 pins; shounan-junai-gumi — a ruled grid) and two
// carrying all-canon defaults with no classifier (elemental-gelade,
// city-hunter) — the four are the reason pins and grids count, the two are
// the honest outcome. assert-overrides mirrors it; a stored value that
// disagrees is a ruling_violation; `series_staged` lists what is hidden.

import { toSet, type RulingEntry } from './types';
import { EPISODE_TYPE_OVERRIDES } from './episode-types';
import { MINTED_GRIDS } from './minted-grids';

export const ENTRIES: RulingEntry<'public'>[] = [
  // none yet — the first seeded series to be typed by ruling lands here
];

export const PUBLISHED: Set<string> = toSet(ENTRIES);

export type Visibility = 'public' | 'staged';

/** the one derivation every writer, the healer and the census read */
export function deriveVisibility(seriesId: string, has: { afl: boolean; afg: boolean }): Visibility {
  if (has.afl || has.afg) return 'public';
  if (Object.keys(EPISODE_TYPE_OVERRIDES[seriesId] ?? {}).length) return 'public'; // T6: a ruling typed it
  if (MINTED_GRIDS[seriesId]?.typesRuled) return 'public'; // G59 path C: a ruled grid publishes only when its TYPES are ruled (amended 2026-09-06: the step-2 grids carry the canon-tier default, signed as a default — staged until the standing programme types them)
  if (PUBLISHED.has(seriesId)) return 'public';
  return 'staged';
}
