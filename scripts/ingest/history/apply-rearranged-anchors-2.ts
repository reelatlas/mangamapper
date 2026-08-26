// Rearranged-zone promotion pass 2 — Sean's GTO/Black-Lagoon report
// (2026-08-23): batch 12 anchored Black Lagoon only at arc-block ENDS, so
// unanchored episodes inside blocks interpolated across non-monotonic
// points (eps 8-9 showed ~8/6 vs the true chs 2-3; eps 19-23 interpolated
// BACKWARDS). Same rule as pass 1: exact known per-episode values always
// anchor, as-stored. Data from the batch-10/12 verdicts. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-rearranged-anchors-2.ts

import { db, startRun, finishRun } from '../lib/db';

const B = 'rearranged-zone promotion 2 (2026-08-23, Sean report — per-episode values from batch 10-12 verdicts)';

// [sid, ep, endCh, startCh, chaptersAdapted, vol|null, note]
const ANCHORS: [string, number, number, number, string, number | null, string][] = [
  // black-lagoon — full per-episode map (lagooncompany.fandom infoboxes)
  ['black-lagoon', 1, 0, 0, '0 (part; stretched with original expansion)', 1, 'ch 0 = the one-shot opener (kanzenban numbering)'],
  ['black-lagoon', 2, 1, 0, '0 (end), 1 (start)', 1, 'finishes ch 0, opens ch 1'],
  ['black-lagoon', 3, 1, 1, '1 (end)', 1, 'Chase for Ring-Ding Ships concludes'],
  ['black-lagoon', 4, 6, 5, '5-6', 1, 'Das Wieder Erstehen Des Adlers begins'],
  ['black-lagoon', 5, 7, 6, '6-7', 2, 'Nazi arc middle'],
  ['black-lagoon', 6, 8, 7, '7-8', 2, 'Nazi arc end'],
  ['black-lagoon', 8, 2, 2, '2', 1, 'Rasta Blasta begins (vol-1 material moved) — as-stored'],
  ['black-lagoon', 9, 4, 3, '3-4 (parts 2-3 split)', 1, 'as-stored'],
  ['black-lagoon', 11, 19, 16, '16-19', 4, 'Goat Jihad parts 1-4'],
  ['black-lagoon', 13, 12, 11, '11-12', 3, 'Bloodsport Fairy Tale begins (backfill) — as-stored'],
  ['black-lagoon', 14, 14, 12, '12-14', 3, 'as-stored'],
  ['black-lagoon', 16, 39, 38, '38-39', 6, 'Greenback Jane begins (pulled forward) — as-stored'],
  ['black-lagoon', 17, 41, 39, '39-41', 6, 'as-stored'],
  ['black-lagoon', 19, 24, 22, '22-24', 4, 'Fujiyama Gangsta Paradise begins — as-stored'],
  ['black-lagoon', 20, 27, 24, '24-27', 4, 'as-stored'],
  ['black-lagoon', 22, 32, 30, '30-32', 5, 'as-stored'],
  ['black-lagoon', 23, 34, 33, '33-34', 5, 'as-stored'],
  ['black-lagoon', 25, 52, 44, '44-52', 6, 'El Baile de la Muerte begins (OVA)'],
  ['black-lagoon', 26, 56, 51, '51-56', 7, 'as-stored'],
  ['black-lagoon', 27, 63, 56, '56-63', 8, 'as-stored'],
  ['black-lagoon', 28, 73, 64, '64-69 + 72-73 (interleaved)', 9, 'as-stored'],
  // my-hero-academia — S3 reorder pair (batch-12 verdict)
  ['my-hero-academia', 60, 117, 113, '113 (p17), 114, 115 (p15-17), 116, 117 (p1-10)', 13, 'pulls ch-115 pages forward — as-stored'],
  ['my-hero-academia', 62, 122, 115, '115 (p1-14), 121 (p10-17), 122', 14, 'goes back for ch 115 then finishes 121-122 — as-stored'],
  // hunter-x-hunter (1999) — Arena climax reorder (batch-12 verdict)
  ['hunter-x-hunter', 43, 58, 56, '56-58 (extortion-trio backtrack)', 7, 'aired after 41-42 covered 60-62 — as-stored'],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    let n = 0;
    for (const [sid, ep, ch, start, adapted, vol, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, start_chapter: start,
        chapters_adapted: adapted, volume: vol, source: 'manual',
        note: `${B}: ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
      n++;
    }
    console.log(`pass-2 anchors: ${n}`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, 'rearranged-zone promotion 2 (Black Lagoon per-episode map + MHA/HxH99 reorder eps)');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
// (appended) — oshi-no-ko reorder eps, Sean's 29/30 report; batch-9 page data
