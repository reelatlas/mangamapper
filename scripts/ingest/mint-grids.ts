// G59 path C — the MANUAL writer for ruled grids (lib/rulings/minted-grids.ts):
// inserts the rows an entry is ruled to have when AFL and the wiki cannot serve
// it (minted_by 'manual'), and asserts title / air date / type on standing
// manual rows. Standard roster; idempotent; never deletes (G57: only this
// writer may delete a manual row, and a ruled grid never shrinks silently —
// a row removed from the ruling is a listing for Sean, not a delete).
//   npx tsx --env-file=.env.ingest scripts/ingest/mint-grids.ts
import { db, selectAll, startRun, finishRun } from './lib/db';
import { filterEpisodeRows } from './lib/resolve';
import { MINTED_GRIDS } from './lib/rulings/minted-grids';

async function main() {
  const runId = await startRun('resolve');
  let minted = 0, asserted = 0, checked = 0;
  for (const [sid, grid] of Object.entries(MINTED_GRIDS)) {
    const { data: s } = await db.from('series').select('id, source_type').eq('id', sid).maybeSingle();
    if (!s) { console.log(`  ${sid}: not in canonical — skipped`); continue; }
    const existing = new Map((await selectAll<any>('episodes', 'number, title, air_date, type, minted_by', (q) => q.eq('series_id', sid))).map((e) => [Number(e.number), e]));
    const rows = grid.rows.map((r) => ({ series_id: sid, number: r.number, title: r.title, type: r.type, air_date: r.air_date }));
    const ruled = filterEpisodeRows(sid, rows, 'manual', { sourceType: s.source_type });
    for (const r of ruled) {
      checked++;
      const cur = existing.get(r.number);
      if (!cur) {
        const { error } = await db.from('episodes').insert({ ...r, minted_by: 'manual' });
        if (error) throw new Error(`${sid} #${r.number}: ${error.message}`);
        minted++; continue;
      }
      if (cur.minted_by !== 'manual') continue; // another writer's row — G57: not ours to rewrite
      const patch: Record<string, unknown> = {};
      if (cur.title !== r.title) patch.title = r.title;
      if (String(cur.air_date ?? '') !== String(r.air_date ?? '')) patch.air_date = r.air_date;
      if (cur.type !== r.type) patch.type = r.type;
      if (Object.keys(patch).length) { const { error } = await db.from('episodes').update(patch).eq('series_id', sid).eq('number', r.number); if (error) throw new Error(error.message); asserted++; }
    }
    console.log(`  ${sid}: ${grid.rows.length} ruled rows — ${ruled.length} pass the gate`);
  }
  console.log(`[mint-grids] ${Object.keys(MINTED_GRIDS).length} ruled grid(s), ${checked} rows checked, ${minted} minted, ${asserted} asserted`);
  await finishRun(runId, 'ok', { fetched: 0, unchanged: checked - minted - asserted, changed: minted + asserted, flagged: 0 }, `mint-grids: ${minted} minted, ${asserted} asserted`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
