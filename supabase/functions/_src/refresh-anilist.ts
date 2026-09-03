// Daily AniList refresh (edge runner — bundled from scripts/ingest/lib by
// scripts/ingest/build-functions.ts; the libs are the single source of truth).
// G58 (2026-09-03): the run is BUDGETED and hash-gated on STRUCTURE. Before
// this every invocation hashed the whole media object (scores, popularity,
// trending…), so ~all 660 media read as changed, the edge re-resolved ~100
// series and the wall clock killed it mid-loop — the run row sat 'running'
// forever, every day from 08-24 to 09-03. Now: (1) the change decision reads
// lib#aniListHash (the structural subset); (2) changed series are resolved
// stalest-first under a RESOLVE_BUDGET and a TIME_BUDGET, and a series that
// misses the budget is NOT staged (its hash stays old, so tomorrow it is first
// in line — a deferral, never a silent skip); (3) the run row is always closed.
//   invoke: select public.invoke_edge_refresh('refresh-anilist')  (pg_cron, 08:10 UTC)

import { db, startRun, finishRun, selectAll } from '../../../scripts/ingest/lib/db';
import { mediaByIds, type AniListMedia } from '../../../scripts/ingest/lib/anilist';
import { stageAniList, aniListChanged, resolveSeries, refreshStitchedVolatile } from '../../../scripts/ingest/lib/resolve';

declare const Deno: {
  env: { get(k: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const RESOLVE_BUDGET = 40; // series re-resolved per invocation (a normal day changes a handful; a mass edit on AniList is spread over days)
const TIME_BUDGET_MS = 110_000; // resolves stop here so staging + the run close inside the edge wall clock

async function run() {
  const t0 = Date.now();
  const runId = await startRun('anilist');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const notes: string[] = [];
  try {
    const compBySeries = new Map<string, number[]>();
    const seriesMeta = new Map<string, { afl_slug: string | null; updated_at: string }>();
    for (const c of await selectAll<{ series_id: string; anilist_id: number }>('series_components', 'series_id, anilist_id')) {
      compBySeries.set(c.series_id, [...(compBySeries.get(c.series_id) ?? []), c.anilist_id]);
    }
    const allSeries = await selectAll<{ id: string; afl_slug: string | null; anilist_id: number | null; updated_at: string }>('series', 'id, afl_slug, anilist_id, updated_at');
    for (const s of allSeries) {
      seriesMeta.set(s.id, { afl_slug: s.afl_slug, updated_at: s.updated_at });
      if (s.anilist_id) compBySeries.set(s.id, [...new Set([...(compBySeries.get(s.id) ?? []), s.anilist_id])]);
    }
    const ownerByMedia = new Map<number, string>();
    for (const [sid, ids] of compBySeries) for (const id of ids) ownerByMedia.set(id, sid);

    const allIds = [...ownerByMedia.keys()];
    const media = await mediaByIds(allIds);
    counters.fetched = media.length;
    // 1. decide first, write nothing: which SERIES changed structurally
    const mediaBySeries = new Map<string, AniListMedia[]>();
    const changedSeries = new Set<string>();
    for (const m of media) {
      const owner = ownerByMedia.get(m.id);
      if (!owner) continue;
      mediaBySeries.set(owner, [...(mediaBySeries.get(owner) ?? []), m]);
      if (await aniListChanged(m)) changedSeries.add(owner);
    }
    // 2. unchanged series: refresh their raw + fetched_at (stageAniList's unchanged path), nothing else
    for (const [sid, ms] of mediaBySeries) {
      if (changedSeries.has(sid)) continue;
      for (const m of ms) { await stageAniList(m); counters.unchanged++; }
    }
    // 3. changed series, stalest-first, under the budgets; a deferred series is left UNSTAGED so it leads tomorrow
    const queue = [...changedSeries].sort((a, b) => String(seriesMeta.get(a)?.updated_at ?? '').localeCompare(String(seriesMeta.get(b)?.updated_at ?? '')));
    let resolved = 0; const deferred: string[] = [];
    for (const sid of queue) {
      if (resolved >= RESOLVE_BUDGET || Date.now() - t0 > TIME_BUDGET_MS) { deferred.push(sid); continue; }
      const comps = compBySeries.get(sid) ?? [];
      const slug = seriesMeta.get(sid)?.afl_slug;
      try {
        for (const m of mediaBySeries.get(sid) ?? []) { await stageAniList(m); counters.changed++; }
        if (comps.length > 1) await refreshStitchedVolatile(sid);
        else if (slug) await resolveSeries(runId, slug);
        resolved++;
      } catch (e) {
        notes.push(`${sid}: ${String(e).slice(0, 100)}`);
      }
    }
    const note = `edge anilist refresh (G58): ${resolved} series re-resolved of ${changedSeries.size} changed${deferred.length ? `; ${deferred.length} DEFERRED to the next run (budget ${RESOLVE_BUDGET} / ${TIME_BUDGET_MS} ms): ${deferred.slice(0, 8).join(', ')}` : ''}${notes.length ? `; errors: ${notes.join(' | ')}` : ''}`.slice(0, 900);
    await finishRun(runId, 'ok', counters, note);
    return { ok: true, ...counters, resolved, deferred: deferred.length, ms: Date.now() - t0, errors: notes };
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
