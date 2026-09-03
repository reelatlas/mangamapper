// G58 healer: an ingest run left 'running' past the edge wall clock was
// KILLED — it will never close itself. Mark it (status 'error', a note that
// says so) so the census class `run_stuck` reads as backlog, not as a live
// run. Witness: refresh-anilist, every daily run 2026-08-24 → 09-03.
//   npx tsx --env-file=.env.ingest scripts/ingest/heal-stuck-runs.ts
import { db, selectAll } from './lib/db';

export const STUCK_AFTER_MS = 6 * 60 * 60 * 1000; // no edge or script run legitimately lasts 6 h

async function main() {
  const cutoff = new Date(Date.now() - STUCK_AFTER_MS).toISOString();
  const stuck = await selectAll<{ id: number; source: string; started_at: string }>('ingest_runs', 'id, source, started_at', (q) => q.eq('status', 'running').lt('started_at', cutoff));
  for (const r of stuck) {
    const { error } = await db.from('ingest_runs').update({ status: 'error', finished_at: new Date().toISOString(), note: `killed: still 'running' ${Math.round((Date.now() - new Date(r.started_at).getTime()) / 3600000)} h after start — the invocation never closed its run (edge wall clock); marked by heal-stuck-runs (G58)` }).eq('id', r.id);
    if (error) throw new Error(`run ${r.id}: ${error.message}`);
  }
  console.log(`[heal-stuck-runs] ${stuck.length} run(s) marked killed${stuck.length ? `: ${stuck.map((r) => `${r.source}#${r.id} (${String(r.started_at).slice(0, 10)})`).join(', ')}` : ''}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
