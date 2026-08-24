// Rearranged-zone pass 3 — Black Lagoon completion (2026-08-23). The first
// anchor_start_offtrend audit run exposed stale batch-10 arc-BLOCK anchors
// (eps 7, 10, 12, 15, 18, 24, 29 held multi-episode aggregates like ep 24 =
// "22-37") coexisting with pass-2's per-episode map, and ep 21 was never
// mapped. Agent-verified per-episode records replace all of them. Source:
// lagooncompany.fandom episode infoboxes (chapters by TITLE) resolved to
// numbers via the wiki's Chapters and Volumes List (one-shot opener = ch 00,
// same kanzenban scheme as our verified rows — no +1 normalization), plus
// Wikipedia ep list and continuation guides (ch 44 after S2, ch 77 after
// OVA). Surprises vs expectation: ep 7 is the STANDALONE "Calm down, two
// men" (9-10), not the Adler conclusion (Adler ends at ep 6); ep 10 re-covers
// 3-4 (Rasta Blasta = chs 2-4 stretched across eps 8-10 with anime-original
// expansion); S2-finale continue point is 44 because Greenback Jane (38-43)
// aired out of order before Fujiyama. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-rearranged-anchors-3.ts

import { db, startRun, finishRun } from './lib/db';

const B = 'rearranged pass 3 (2026-08-23, black-lagoon per-episode completion — lagooncompany.fandom infoboxes + Chapters/Volumes List + Wikipedia; replaces stale batch-10 block anchors)';

// [ep, endCh, startCh, chaptersAdapted, vol|null, note]
const ANCHORS: [number, number, number, string, number | null, string][] = [
  [7, 10, 9, '9-10', 2, "standalone 'Calm down, two men' Parts 1-2 — NOT the Adler conclusion (Adler chs 5-8 ends at ep 6). REPAIR: replaces batch-10 block '0-1, 5-10'"],
  [10, 4, 3, '3-4', 1, "Rasta Blasta Parts 2-3 re-covered — arc is only chs 2-4 stretched across eps 8-10 with anime-original expansion (extended Revy-vs-Roberta duel); mostly ch-4 material. REPAIR: replaces batch-10 block '2-4'"],
  [12, 21, 19, '19-21', null, "Goat Jihad Parts 4-6; shares ch-19 boundary with ep 11. Straddles vols 3/4. REPAIR: replaces batch-10 block '16-21'"],
  [15, 15, 14, '14-15', 3, "Bloodsport Fairy Tale Parts 4-5, arc conclusion. REPAIR: replaces batch-10 block '11-15'"],
  [18, 43, 41, '41-43', 6, "Greenback Jane Parts 4-6, arc conclusion — furthest-adapted S2 material (aired out of order before Fujiyama). REPAIR: replaces batch-10 block '38-43'"],
  [21, 30, 28, '28-30', null, 'Fujiyama Gangsta Paradise Parts 7-9; shares ch-30 boundary with ep 22. Straddles vols 4/5. NEW: never mapped'],
  [24, 37, 35, '35-37', 5, "Fujiyama Parts 14-16 — arc + Second Barrage conclusion. REPAIR: replaces batch-10 block '22-37'"],
  [29, 76, 70, '70-76', 9, "El Baile de la muerte Parts 27-33, series-of-arc end — interleaves around ep 28's pulled-forward 72-73 (rearranged annotations already ruled). OVA ending diverges somewhat from manga. REPAIR: replaces batch-10 block '44-76'"],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    let n = 0;
    for (const [ep, ch, start, adapted, vol, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: 'black-lagoon', episode: ep, chapter: ch, start_chapter: start,
        chapters_adapted: adapted, volume: vol, source: 'manual', note: `${B}: ${note}`,
      });
      if (error) throw new Error(`ep${ep}: ${error.message}`);
      n++;
    }
    // S2 finale: readers continue at 44 (38-43 already aired earlier), not end+1
    const { error } = await db.from('chapter_anchors')
      .update({ continue_chapter: 44 })
      .eq('series_id', 'black-lagoon').eq('episode', 24);
    if (error) throw new Error(`continue ep24: ${error.message}`);
    console.log(`pass-3: ${n} black-lagoon anchors + ep-24 continue point 44`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, 'rearranged pass 3: black-lagoon per-episode completion (stale block anchors replaced, ep 21 mapped, S2 continue=44)');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
