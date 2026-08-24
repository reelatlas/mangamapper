// AoT finale specials — Sean's ep-89 report (2026-08-23): ep 89 was only a
// raw MU frontier pin (end 139, no start, no adaptation record) and ep 88
// had NO anchor. Verified: Special 1 (ep 88) = chs 131-134; Special 2
// (ep 89) = chs 135-139 PLUS the volume-34 extended-ending pages (Mikasa
// epilogue: Ymir silhouette, grave visit, flash-forward), which the anime
// DID adapt. Chs "140-141" in our chapter space are vol-34 extras (school-
// caste omake etc.) counted by AniList and NOT adapted — beyond-frontier
// null is honest there. Sources: GamesRadar Final Chapters guide, mangashed
// season→chapter conversion, doublesama + cyphype Special recaps, fandom
// THE_FINAL_CHAPTERS_Special_2, dualshockers/comicbook/epicdope vol-34
// extra-pages coverage. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-aot-finale.ts

import { db, startRun, finishRun } from './lib/db';

const B = 'research: AoT finale specials (2026-08-23, Sean report — GamesRadar + mangashed + doublesama/cyphype + fandom Special_2 + vol-34 extras coverage)';

async function main() {
  const runId = await startRun('resolve');
  try {
    const rows = [
      {
        series_id: 'attack-on-titan', episode: 88, chapter: 134, start_chapter: 131,
        chapters_adapted: '131-134', volume: 33, source: 'manual',
        note: `${B}: The Final Chapters Special 1 (2023-03-04, 1 hr) — chs 131-134, vol 33`,
      },
      {
        series_id: 'attack-on-titan', episode: 89, chapter: 139, start_chapter: 135,
        chapters_adapted: '135-139 + vol-34 extended-ending pages', volume: 34, source: 'manual',
        note: `${B}: The Final Chapters Special 2 (2023-11-05) — chs 135-139 AND the vol-34 extended-ending pages (Mikasa epilogue/flash-forward). REPAIR: replaces unverified MU pin (end-only 139). Vol-34 omake extras (our chapter space 140-141) NOT adapted — frontier stays 139 honestly.`,
      },
    ];
    for (const r of rows) {
      const { error } = await db.from('chapter_anchors').upsert(r);
      if (error) throw new Error(`ep${r.episode}: ${error.message}`);
    }
    const { error } = await db.from('episode_annotations').upsert(
      {
        series_id: 'attack-on-titan', episode: 89, kind: 'graft',
        chapters: '139 + vol-34 extended-ending pages',
        note: `${B}: finale grafts the vol-34 extra pages (Ymir silhouette, grave visit, future flash-forward) beyond ch 139's magazine version`,
      },
      { onConflict: 'series_id,episode,kind' },
    );
    if (error) throw new Error(`annotation ep89: ${error.message}`);
    console.log('aot finale: 2 anchors (88 NEW, 89 promoted from MU pin) + 1 graft annotation');
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: 2, flagged: 0 }, 'AoT finale specials: ep 88 anchored, ep 89 MU pin promoted to full record incl. vol-34 extended ending');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
