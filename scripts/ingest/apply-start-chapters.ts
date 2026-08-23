// Research-anchor START chapters (Sean's ruling 2026-08-23): starts are real
// data — derived AFG anchors carry them from chart rows automatically; this
// record seeds them on RESEARCH anchors whose batch verdicts documented the
// exact adapted span (majority rule applied where a span opens with a
// chapter tail). Unlisted research anchors fall back to the display
// derivation until research names their spans. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-start-chapters.ts

import { db, startRun, finishRun } from './lib/db';

// [sid, episode, start_chapter] — spans from batch 8/9 verdicts
const STARTS: [string, number, number][] = [
  ['oshi-no-ko', 20, 65], // adapts 65-67
  ['oshi-no-ko', 24, 78], // ch 78-80 content (+109 graft)
  ['oshi-no-ko', 28, 93], // adapts 93-96
  ['oshi-no-ko', 30, 102], // adapts 102-103
  ['oshi-no-ko', 34, 115], // 114 p.18 tail + 115-118 → majority 115
  ['oshi-no-ko', 35, 119], // covers 119-127
  ['attack-on-titan', 64, 99], // chs 99-100
  ['attack-on-titan', 67, 105], // ch 105 only
  ['attack-on-titan', 68, 106], // ch 106 only
  ['attack-on-titan', 73, 112], // half of 112 through 113 → majority 112
  ['attack-on-titan', 74, 114], // ch 114 only
  ['jujutsu-kaisen', 34, 91], // 90 p.21 tail + 91-93 → majority 91
  ['jujutsu-kaisen', 35, 94], // 94-97
  ['jujutsu-kaisen', 40, 113], // 113-116
  ['jujutsu-kaisen', 42, 120], // 120 p.7-19 + 121-122 → majority 120
  ['jujutsu-kaisen', 45, 129], // 129-132
  ['haikyu', 65, 212], // 212-215
  ['haikyu', 68, 220], // 220-222
  ['haikyu', 70, 225], // 225-228
  ['haikyu', 72, 231], // 231-234
  ['haikyu', 74, 243], // 243-246
  ['naruto', 110, 182], // 182-183
  ['naruto', 114, 189], // 189-191
  ['naruto', 117, 196], // 196-198
  ['naruto', 124, 211], // 211-212
  ['naruto', 127, 216], // 216-217
  ['naruto', 132, 226], // 226-228
];

async function main() {
  const runId = await startRun('resolve');
  try {
    let applied = 0;
    for (const [sid, ep, start] of STARTS) {
      const { data } = await db.from('chapter_anchors').select('chapter').eq('series_id', sid).eq('episode', ep).maybeSingle();
      if (!data) {
        console.log(`SKIP ${sid} ep${ep}: no anchor`);
        continue;
      }
      const { error } = await db.from('chapter_anchors').update({ start_chapter: start }).eq('series_id', sid).eq('episode', ep);
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
      applied++;
    }
    console.log(`start chapters applied: ${applied}/${STARTS.length}`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: applied, flagged: 0 }, 'research-anchor start chapters (display ruling)');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
