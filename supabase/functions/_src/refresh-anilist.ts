// Daily AniList refresh (edge runner — bundled from scripts/ingest/lib by
// scripts/ingest/build-functions.ts; the libs are the single source of truth).
// Sweeps every canonical series' media (+ per-season components) in ~50-per-
// request batches, stages changes hash-gated, then refreshes: stitched series
// get a volatile-field recompute, single-season series a full re-resolve.

import { db, startRun, finishRun } from '../../../scripts/ingest/lib/db';
import { mediaByIds } from '../../../scripts/ingest/lib/anilist';
import { stageAniList, resolveSeries, refreshStitchedVolatile } from '../../../scripts/ingest/lib/resolve';

declare const Deno: {
  env: { get(k: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

async function run() {
  const runId = await startRun('anilist');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const notes: string[] = [];
  try {
    const compBySeries = new Map<string, number[]>();
    const seriesMeta = new Map<string, { afl_slug: string | null }>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('series_components').select('series_id, anilist_id').range(from, from + 999);
      for (const c of data ?? []) compBySeries.set(c.series_id, [...(compBySeries.get(c.series_id) ?? []), c.anilist_id]);
      if (!data || data.length < 1000) break;
    }
    const { data: allSeries } = await db.from('series').select('id, afl_slug, anilist_id');
    for (const s of allSeries ?? []) {
      seriesMeta.set(s.id, { afl_slug: s.afl_slug });
      if (s.anilist_id) compBySeries.set(s.id, [...new Set([...(compBySeries.get(s.id) ?? []), s.anilist_id])]);
    }
    const ownerByMedia = new Map<number, string>();
    for (const [sid, ids] of compBySeries) for (const id of ids) ownerByMedia.set(id, sid);

    const allIds = [...ownerByMedia.keys()];
    counters.fetched = allIds.length;
    const media = await mediaByIds(allIds);
    const changedSeries = new Set<string>();
    for (const m of media) {
      if ((await stageAniList(m)) === 'changed') {
        counters.changed++;
        const owner = ownerByMedia.get(m.id);
        if (owner) changedSeries.add(owner);
      } else counters.unchanged++;
    }

    for (const sid of changedSeries) {
      const comps = compBySeries.get(sid) ?? [];
      const slug = seriesMeta.get(sid)?.afl_slug;
      try {
        if (comps.length > 1) await refreshStitchedVolatile(sid);
        else if (slug) await resolveSeries(runId, slug);
      } catch (e) {
        notes.push(`${sid}: ${String(e).slice(0, 100)}`);
      }
    }

    await finishRun(runId, 'ok', counters, `edge anilist refresh: ${changedSeries.size} series updated`);
    return { ok: true, ...counters, updatedSeries: changedSeries.size, errors: notes };
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
