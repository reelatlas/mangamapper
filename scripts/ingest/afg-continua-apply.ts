// AFG continua sweep: applies every staged continua table to its registered
// canonical series via the shared applyContinua (lib/anchors — identity
// guard, self-consistency, chapter-space gate, precedence, boundary writes,
// cross-check flags). The refresh-afg edge runs the SAME function inline on
// every page refresh, so this sweep is for backfills and rule-fix healing.
// Idempotent: 'afg-continua' anchors are wiped + rebuilt per series.
//   npx tsx --env-file=.env.ingest scripts/ingest/afg-continua-apply.ts

import { db, startRun, finishRun } from './lib/db';
import { applyContinua } from './lib/anchors';
import type { AfgContinua } from './lib/afg';

async function main() {
  const runId = await startRun('afg');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const tally: Record<string, number> = {};
  try {
    const { data: pages } = await db.from('ingest_afg_pages').select('slug, raw');
    const { data: reg } = await db.from('series_external_ids').select('series_id, external_id').eq('source', 'afg');
    const bySlug = new Map((reg ?? []).map((r) => [r.external_id, r.series_id]));

    for (const p of pages ?? []) {
      const raw = p.raw as { continua?: AfgContinua | null; episodes?: { number: number }[] };
      const continua = raw.continua;
      const seriesId = bySlug.get(p.slug);
      if (!seriesId) continue; // unserved pages apply at series-creation time
      const pageMax = (raw.episodes ?? []).reduce((m, e) => Math.max(m, e.number), 0);
      const result = await applyContinua(runId, seriesId, continua, pageMax);
      tally[result] = (tally[result] ?? 0) + 1;
      if (result === 'applied') counters.changed++;
      if (result === 'withheld') counters.flagged++;
    }
    await finishRun(runId, 'ok', counters, `afg continua sweep: ${JSON.stringify(tally)}`);
    console.log('continua sweep:', JSON.stringify(tally));
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0));
