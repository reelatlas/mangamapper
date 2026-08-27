// Batch 19 E4 — the one fork Sean ruled as a data change (2026-08-26):
// high-school-dxd row 0 DROPPED under N11 (HERO's Episode 0 was ruled
// order-only on 2026-08-24; a numbered row stood anyway). The ruling is the
// SOURCE_NUMBERING_SHIFTS entry; this script executes it the way every N11
// drop is executed: (1) the order-only record in ingest_fractionals (the
// seraph / bungo precedent — position 36.5, between BorN 25-36 and HERO
// 37-48), (2) re-resolve the series so filterEpisodeRows drops the row.
// No anchor or annotation depended on row 0 (checked 2026-08-26). Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-e4.ts
import { db, startRun, finishRun } from '../../lib/db';
import { resolveSeries } from '../../lib/resolve';

const runId = await startRun('resolve');
try {
  const { error } = await db.from('ingest_fractionals').upsert({
    series_id: 'high-school-dxd',
    position: 36.5,
    title: 'Holy Behind the Gymnasium (HERO Episode 0)',
    air_date: '2018-04-10',
    note: "HERO's Episode 0 — a mid-run special the community's continuous numbering excludes; ruled order-only (Sean 2026-08-24, COMMUNITY_COUNT_OVERRIDES cap 48); the numbered row 0 dropped under N11 (batch 19 E4, Sean 2026-08-26).",
    source: 'ruling',
    disposition: 'order_only',
  });
  if (error) throw new Error(error.message);
  const { data: s } = await db.from('series').select('afl_slug').eq('id', 'high-school-dxd').maybeSingle();
  if (!s?.afl_slug) throw new Error('high-school-dxd has no afl_slug');
  const r = await resolveSeries(runId, s.afl_slug);
  console.log('re-resolved high-school-dxd:', JSON.stringify(r).slice(0, 200));
  const { data: row0 } = await db.from('episodes').select('number').eq('series_id', 'high-school-dxd').eq('number', 0);
  console.log('row 0 standing:', row0?.length ?? 0);
  await finishRun(runId, 'ok', { fetched: 1, unchanged: 0, changed: 1, flagged: 0 }, 'E4: dxd row 0 dropped (N11)');
} catch (e) {
  await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
  throw e;
}
process.exit(0);
