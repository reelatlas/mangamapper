// Continue-reading points — Sean's ruling 2026-08-23 (display/continue split):
// an episode DISPLAYS the first chapter it animates; where to CONTINUE
// READING after it derives from its anchor (end + 1, or the end chapter
// itself when a partial annotation marks a mid-chapter stop). This record
// stores the EXCEPTIONS research has named — skips, grafts, mid-chapter
// endings — in chapter_anchors.continue_chapter. Re-runnable; UI deferred.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-continue-points.ts

import { db, startRun, finishRun } from '../lib/db';

// [sid, episode, continue_chapter, why]
const EXCEPTIONS: [string, number, number, string][] = [
  ['jujutsu-kaisen', 47, 138, 'finale grafts post-Shibuya aftermath panels (137) — continue at 138, not 137 (batch 8)'],
  ['oshi-no-ko', 35, 127, 'S3 finale ends MID-ch 127 p.1-12 — continue reading ch 127 itself (batch 9)'],
  ['rent-a-girlfriend', 12, 52, 'ch 51 is a light skip/interstitial — WDTALO: resume vol 7 ch 52 (batch 9)'],
  ['rent-a-girlfriend', 24, 103, 'chs 103-104 never adapted (S3 opens 105) — readers resume at 103 (batch 9)'],
  ['miss-kobayashis-dragon-maid', 25, 65, 'anime end = ch 64 — resume vol 7 ch 65 (batch 9)'],
  ['seraph-of-the-end-vampire-reign', 24, 42, 'finale ends ch 41 with altered execution — resume ch 42 (batch 9)'],
  ['blue-exorcist', 37, 38, 'Kyoto Saga ends ch 34 but chs 35-37 are SKIPPED by the anime — S3 opens at 38; readers who want everything start at 35, anime-parity continues at 38 (batch 8; WDTALO)'],
  ['food-wars', 73, 265, 'S4 finale montage super-condenses 265-276 — read from 265 despite the credits coverage (batch 9)'],
  ['the-case-study-of-vanitas', 5, 10, 'ep 5 ends partway into Mémoire 10 — continue reading ch 10 itself (batch 8)'],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    for (const [sid, ep, cont, why] of EXCEPTIONS) {
      const { data } = await db.from('chapter_anchors').select('note').eq('series_id', sid).eq('episode', ep).maybeSingle();
      if (!data) {
        console.log(`SKIP ${sid} ep${ep}: no anchor to attach to`);
        continue;
      }
      const { error } = await db
        .from('chapter_anchors')
        .update({ continue_chapter: cont, note: `${data.note ?? ''} | continue_reading: ${cont} — ${why}` })
        .eq('series_id', sid).eq('episode', ep);
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
      console.log(`${sid} ep${ep} → continue ${cont}`);
    }
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: EXCEPTIONS.length, flagged: 0 }, 'continue-reading exceptions (display/continue split ruling)');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
