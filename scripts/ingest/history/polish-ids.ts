// Id-polish: re-key clunky auto-generated series ids before the app swap
// makes ids user-visible. No ON UPDATE CASCADE, so a re-key is copy → move
// children → delete. Also refreshes relations endpoints.
//   npx tsx --env-file=.env.ingest scripts/ingest/polish-ids.ts

import { db, startRun, finishRun } from '../lib/db';

const REKEY: Record<string, string> = {
  'jojo-s-bizarre-adventure-tv': 'jojos-bizarre-adventure',
  'heaven-s-lost-property': 'heavens-lost-property',
  'hell-s-paradise': 'hells-paradise',
  'miss-kobayashi-s-dragon-maid': 'miss-kobayashis-dragon-maid',
  'konosuba-god-s-blessing-on-this-wonderful-world': 'konosuba-gods-blessing-on-this-wonderful-world',
  'pretty-guardian-sailor-moon-crystal-seasons-1-2': 'sailor-moon-crystal',
  'the-melancholy-of-haruhi-suzumiya-2009': 'the-melancholy-of-haruhi-suzumiya',
  'initial-d-1st-stage': 'initial-d',
  'x-tv': 'x',
};

async function main() {
  const runId = await startRun('resolve');
  const actions: string[] = [];
  try {
    for (const [oldId, newId] of Object.entries(REKEY)) {
      const { data: row } = await db.from('series').select('*').eq('id', oldId).maybeSingle();
      if (!row) {
        actions.push(`skip ${oldId}: not present`);
        continue;
      }
      const { data: clash } = await db.from('series').select('id').eq('id', newId).maybeSingle();
      if (clash) {
        actions.push(`SKIP ${oldId} → ${newId}: target exists`);
        continue;
      }
      // free the unique columns (anilist_id, afl_slug) before the copy exists
      const { error: freeErr } = await db
        .from('series')
        .update({ anilist_id: null, afl_slug: null })
        .eq('id', oldId);
      if (freeErr) throw new Error(`free ${oldId}: ${freeErr.message}`);
      const { error: insErr } = await db.from('series').insert({ ...row, id: newId });
      if (insErr) throw new Error(`insert ${newId}: ${insErr.message}`);
      for (const table of ['episodes', 'series_components', 'chapter_anchors']) {
        const { error } = await db.from(table).update({ series_id: newId }).eq('series_id', oldId);
        if (error) throw new Error(`${table} move ${oldId}: ${error.message}`);
      }
      await db.from('series_relations').update({ from_series: newId }).eq('from_series', oldId);
      await db.from('series_relations').update({ to_series: newId }).eq('to_series', oldId);
      const { error: delErr } = await db.from('series').delete().eq('id', oldId);
      if (delErr) throw new Error(`delete ${oldId}: ${delErr.message}`);
      actions.push(`rekeyed ${oldId} → ${newId}`);
    }
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'id polish');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
