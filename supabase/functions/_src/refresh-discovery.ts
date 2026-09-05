// Weekly discovery refresh (edge runner — bundled from scripts/ingest/lib by
// scripts/ingest/build-functions.ts; the libs are the single source of truth).
// G60 + I42, Sean's go 2026-09-05: (1) snapshot the eight ranked AniList lists
// into ingest_anilist_rankings (staging, kept as history); (2) stage the halo
// — unowned TV-shaped story relations of owned entries — under a budget.
// STAGING ONLY: nothing here creates a series, a component, a row or an
// anchor; the census reads staging into seed_candidate and the halo classes,
// and a /discover sitting is where Sean rules. Budgeted (G58): a deferred list
// or candidate leads the next run; the run row always closes.
//   invoke: select public.invoke_edge_refresh('refresh-discovery')  (pg_cron, weekly Sun 10:30 UTC)
import { startRun, finishRun } from '../../../scripts/ingest/lib/db';
import { snapshotRankings } from '../../../scripts/ingest/lib/rankings';
import { stageHalo } from '../../../scripts/ingest/lib/discovery';
declare const Deno: {
  env: { get(k: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};
const TIME_BUDGET_MS = 115_000; // the whole run closes inside the edge wall clock
const HALO_BUDGET = 150; // candidate media staged per run
async function run() {
  const t0 = Date.now();
  const runId = await startRun('anilist');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const r = await snapshotRankings({ timeBudgetMs: 75_000, sleepMs: 2100 });
    counters.fetched += r.requests; counters.changed += r.rows;
    const left = TIME_BUDGET_MS - (Date.now() - t0);
    const h = left > 15_000 ? await stageHalo({ budget: HALO_BUDGET, timeBudgetMs: left - 5_000 }) : null;
    if (h) { counters.fetched += h.requests; counters.changed += h.staged; counters.flagged += h.missing.length; }
    const note = `edge discovery refresh (G60 / I42): rankings ${r.lists} lists / ${r.rows} rows${r.deferred.length ? ` (deferred: ${r.deferred.join(', ')})` : ''}; halo ${h ? `${h.staged} staged, ${h.deferred} deferred, ${h.tv} TV-shaped candidates` : 'skipped (no time left)'}`;
    await finishRun(runId, 'ok', counters, note);
    return { ok: true, ...counters, rankings: r, halo: h, ms: Date.now() - t0 };
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 300));
    return { ok: false, error: String(err).slice(0, 300), ...counters };
  }
}
Deno.serve(async (req: Request) => {
  const secret = Deno.env.get('CRON_SECRET');
  if (secret && req.headers.get('x-cron-secret') !== secret) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }
  const result = await run();
  return new Response(JSON.stringify(result), { headers: { 'Content-Type': 'application/json' } });
});
