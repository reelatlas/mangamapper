// AFL refresh (edge runner, bundled — see build-functions.ts). Edge wall-time
// limits forbid the full 57-min sweep, so this processes a SMALL BATCH of the
// stalest pages per invocation (crawl-delay 10s × ≤20 pages ≈ 200s) and the
// hourly cron makes the whole catalog cycle inside the weekly cadence.
// Alias-corruption defenses run inline via stageAfl's expected-title check.

import { db, startRun, finishRun } from '../../../scripts/ingest/lib/db';
import { AFL_BASE, parseShowPage } from '../../../scripts/ingest/lib/afl';
import { politeFetch } from '../../../scripts/ingest/lib/http';
import { stageAfl, resolveSeries } from '../../../scripts/ingest/lib/resolve';

declare const Deno: {
  env: { get(k: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const STALE_MS = 6 * 24 * 60 * 60 * 1000;
const BATCH = 20;

async function run() {
  const runId = await startRun('afl');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const notes: string[] = [];
  try {
    const { data: active } = await db.from('source_map').select('afl_slug').eq('disposition', 'active');
    const activeSet = new Set((active ?? []).map((m) => m.afl_slug));
    const { data: staged } = await db
      .from('ingest_afl_shows')
      .select('slug, etag, last_modified, fetched_at, raw')
      .order('fetched_at', { ascending: true })
      .limit(200);
    const cutoff = Date.now() - STALE_MS;
    const batch = (staged ?? [])
      .filter((s) => activeSet.has(s.slug) && new Date(s.fetched_at).getTime() < cutoff)
      .slice(0, BATCH);

    for (const s of batch) {
      try {
        const res = await politeFetch(`${AFL_BASE}/shows/${s.slug}`, {
          etag: s.etag,
          lastModified: s.last_modified,
        });
        counters.fetched++;
        if (res.status === 304) {
          counters.unchanged++;
          await db.from('ingest_afl_shows').update({ fetched_at: new Date().toISOString() }).eq('slug', s.slug);
          continue;
        }
        if (res.status !== 200 || !res.html) {
          notes.push(`${s.slug}: HTTP ${res.status}`);
          continue;
        }
        const page = parseShowPage(res.html);
        const outcome = await stageAfl(runId, s.slug, page, {
          etag: res.etag,
          lastModified: res.lastModified,
          expectedTitle: (s.raw as { title?: string }).title,
        });
        if (outcome === 'held') {
          counters.flagged++;
          continue;
        }
        counters[outcome]++;
        if (outcome === 'changed') await resolveSeries(runId, s.slug);
      } catch (e) {
        notes.push(`${s.slug}: ${String(e).slice(0, 100)}`);
      }
    }

    await finishRun(runId, 'ok', counters, `edge afl refresh: batch of ${batch.length}`);
    return { ok: true, batch: batch.length, ...counters, errors: notes };
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
