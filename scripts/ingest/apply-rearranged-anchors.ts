// Rearranged-zone anchors — the GTO 20/21 lesson (Sean's report 2026-08-23):
// research knew ep 20 = chs 73-74 and ep 21 = ch 70, but the values lived
// only in an annotation, so the display INTERPOLATED (~68-70) across the
// zone and lied. RULE: exact known per-episode adaptation ALWAYS becomes an
// anchor — the non-monotonic ruling renders anchors as stored, so air-order
// back-jumps are safe. This record promotes every banked exact value that
// batches 8-11 left annotation-only. Zone-level-only knowledge (no per-ep
// data) stays annotation + acknowledged-approximate interpolation, now
// surfaced by the rearranged_zone_unanchored audit class. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-rearranged-anchors.ts

import { db, startRun, finishRun } from './lib/db';

const B = 'rearranged-zone promotion (2026-08-23, from batch 8-11 verdicts — the GTO 20/21 lesson)';

// [sid, ep, endCh, startCh, chaptersAdapted, vol|null, note]
const ANCHORS: [string, number, number, number, string, number | null, string][] = [
  // gto — full per-episode map from the batch-11 verdict (fandom infoboxes)
  ['gto-great-teacher-onizuka', 12, 41, 39, '39-41', 5, 'per fandom infobox'],
  ['gto-great-teacher-onizuka', 13, 47, 41, '41-43, 46-47', 6, 'non-contiguous per fandom'],
  ['gto-great-teacher-onizuka', 14, 47, 44, '44-47', 6, 'per fandom'],
  ['gto-great-teacher-onizuka', 15, 52, 47, '47-52', 7, 'per fandom'],
  ['gto-great-teacher-onizuka', 16, 55, 51, '51-55', 7, 'Urumi introduced (Mermaid chapters)'],
  ['gto-great-teacher-onizuka', 17, 59, 56, '56-59', 7, 'per fandom'],
  ['gto-great-teacher-onizuka', 18, 63, 61, '61-63', 8, 'ch 60 skipped before this'],
  ['gto-great-teacher-onizuka', 20, 74, 73, '73-74', 9, 'aired BEFORE ep 21 (ch 70) — as-stored non-monotonic; the interpolated ~68 was wrong (Sean caught it)'],
  ['gto-great-teacher-onizuka', 21, 70, 70, '70', 9, 'aired after 73-74 — as-stored'],
  ['gto-great-teacher-onizuka', 29, 77, 75, '75-77', 9, 'trip-money theft frame-up'],
  ['gto-great-teacher-onizuka', 30, 82, 77, '77-82', 10, 'per fandom'],
  ['gto-great-teacher-onizuka', 31, 85, 82, '82-85', 10, "'Destination: Okinawa'"],
  ['gto-great-teacher-onizuka', 32, 87, 85, '85-87', 11, 'per fandom'],
  ['gto-great-teacher-onizuka', 35, 72, 72, '72', 9, 'Uchiyamada wedding, deferred from the vol-9 zone — as-stored'],
  ['gto-great-teacher-onizuka', 36, 94, 93, '93-94', 12, 'Fuyutsuki makeover / Teshigawara'],
  ['gto-great-teacher-onizuka', 37, 96, 95, '95-96', 12, 'per fandom'],
  ['gto-great-teacher-onizuka', 38, 98, 97, '97-98', 13, 'treasure hunt begins (ch 98 title match)'],
  ['gto-great-teacher-onizuka', 39, 102, 99, '99-102', 13, 'per fandom'],
  ['gto-great-teacher-onizuka', 40, 102, 102, '102 + 107 (graft)', 13, 'graft from vol 14 — END stays 102; do not advance past 106'],
  // my-hero-academia — S5 MVA block per-ep runs (batch-11 caveat data)
  ['my-hero-academia', 108, 224, 221, '220 (p8, 12-15), 221-224 (p1-6)', 23, 'MVA block, aired after 241-255 — as-stored'],
  ['my-hero-academia', 109, 228, 225, '218 (p9-11), 224 (p6-15), 225-228', 24, 'MVA block — as-stored'],
  ['my-hero-academia', 110, 232, 229, '229, 230, 231 (pp1, 6-15), 232', 24, 'MVA block — as-stored'],
  ['my-hero-academia', 111, 236, 233, '233 (pp1-2, 4-15), 234, 235, 236', 24, 'MVA block — as-stored'],
  // cells-at-work — S1 exact singles (batch-11 verdict)
  ['cells-at-work', 2, 4, 4, '4', 1, 'S1 out-of-book-order — as-stored'],
  ['cells-at-work', 3, 3, 3, '3', 1, 'as-stored'],
  ['cells-at-work', 5, 2, 2, '2', 1, 'as-stored'],
  ['cells-at-work', 9, 12, 12, '12', 3, 'as-stored'],
  ['cells-at-work', 10, 15, 15, '15', 3, 'as-stored'],
  ['cells-at-work', 11, 6, 6, '6', 2, 'Heat Stress, moved from vol 2 — as-stored'],
  ['cells-at-work', 15, 19, 13, '13, 19', 4, 'S2 pairs the S1-skipped chapters'],
  ['cells-at-work', 16, 16, 14, '16, 14', 4, 'S2 pairs the S1-skipped chapters — as-stored'],
  // beastars — S2 jumble per-ep lists (batch-10 verdict; medium)
  ['beastars', 13, 54, 50, '50, 52, 54', 7, 'S2 opening reorder — as-stored, MEDIUM'],
  ['beastars', 14, 56, 50, '53, 54 (end), 55, 56 (a), 50 (end)', 7, 'as-stored, MEDIUM'],
  ['beastars', 15, 59, 51, '58, 51, 59', 7, 'as-stored, MEDIUM'],
  ['beastars', 16, 64, 56, '60, 61, 62 (half), 64, 56 (b)', 8, 'as-stored, MEDIUM'],
  ['beastars', 17, 65, 57, '57, 62 (half), 63, 65 (a)', 8, 'as-stored, MEDIUM'],
  ['beastars', 19, 78, 71, '71, 72, 78, 77', 9, 'as-stored, MEDIUM'],
  ['beastars', 20, 80, 68, '70, 68, 79, 80', 9, 'as-stored, MEDIUM'],
  ['beastars', 21, 81, 65, '74, 81, 69 (part), 65 (end), 66 (start), 75, 76', 9, 'as-stored, MEDIUM'],
  ['beastars', 22, 89, 83, '89 (a), 83, 87, 93 (part), 84, 85', 11, 'as-stored, MEDIUM'],
  ['beastars', 23, 92, 82, '82, 89 (b), 88, 90 (parts), 91 (b), 92 (a)', 11, 'as-stored, MEDIUM'],
  // nisekoi — title-matched trio (batch-10, medium)
  ['nisekoi', 29, 86, 82, '82, 86', 10, 'title-match mapping — MEDIUM, as-stored'],
  ['nisekoi', 30, 85, 83, '83-85', 10, 'title-match mapping — MEDIUM, as-stored'],
  ['nisekoi', 31, 98, 93, '93, 98', 11, 'title-match mapping — MEDIUM'],
  // assassination-classroom — ep 5 (batch-10 verdict)
  ['assassination-classroom', 5, 11, 7, '7, 11', 2, 'ch 7 held back from ep 4, adapted here with 11 — as-stored'],
  // iruma — Walter Park reorder pair (batch-11 verdict)
  ['welcome-to-demon-school-iruma-kun', 36, 73, 69, '69 (p.1, 12-20), 70, 73 (p.4-20)', 9, 'ch 73 pulled ahead — as-stored'],
  ['welcome-to-demon-school-iruma-kun', 37, 74, 71, '71, 72, 74', 9, 'as-stored'],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    let applied = 0;
    for (const [sid, ep, ch, start, adapted, vol, note] of ANCHORS) {
      // fill-only against curated rows at the same episode is NOT wanted
      // here — these ARE the curated values; upsert replaces
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, start_chapter: start,
        chapters_adapted: adapted, volume: vol, source: 'manual',
        note: `${B}: ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
      applied++;
    }
    console.log(`rearranged-zone anchors: ${applied}`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: applied, flagged: 0 }, 'rearranged-zone anchor promotion (GTO 20/21 lesson)');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
