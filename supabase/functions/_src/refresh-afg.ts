// AFG refresh (edge runner, bundled — see build-functions.ts). AFG is the
// chapter-anchor authority: pages update slowly (historically months behind
// AFL), so a daily tick with a 13-day staleness window cycles the catalog
// ~biweekly, ≤25 pages per run at 10s courtesy pacing. Changed pages re-sync
// anchors via the shared syncAnchors path (monotonicity filter, alignment
// gate, volumes-staleness event trigger included).

import { db, startRun, finishRun } from '../../../scripts/ingest/lib/db';
import { AFG_BASE, parseAfgPage } from '../../../scripts/ingest/lib/afg';
import { politeFetch } from '../../../scripts/ingest/lib/http';
import { contentHash } from '../../../scripts/ingest/lib/hash';
import { syncAnchors } from '../../../scripts/ingest/lib/anchors';
import { slugify } from '../../../scripts/ingest/lib/slug';

declare const Deno: {
  env: { get(k: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const STALE_MS = 13 * 24 * 60 * 60 * 1000;
const BATCH = 25;

async function run() {
  const runId = await startRun('afg');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const notes: string[] = [];
  try {
    const { data: staged } = await db
      .from('ingest_afg_pages')
      .select('slug, etag, last_modified, fetched_at')
      .order('fetched_at', { ascending: true })
      .limit(BATCH * 2);
    const cutoff = Date.now() - STALE_MS;
    const batch = (staged ?? []).filter((s) => new Date(s.fetched_at).getTime() < cutoff).slice(0, BATCH);

    const { data: series } = await db.from('series').select('id, afl_slug, title');
    const bySlug = new Map<string, string>();
    for (const s of series ?? []) {
      if (s.afl_slug) bySlug.set(s.afl_slug, s.id);
      bySlug.set(s.id, s.id);
      bySlug.set(slugify(s.title), s.id);
    }

    for (const s of batch) {
      try {
        const res = await politeFetch(`${AFG_BASE}/anime/${s.slug}/`, {
          etag: s.etag,
          lastModified: s.last_modified,
        });
        counters.fetched++;
        if (res.status === 304) {
          counters.unchanged++;
          await db.from('ingest_afg_pages').update({ fetched_at: new Date().toISOString() }).eq('slug', s.slug);
          continue;
        }
        if (res.status !== 200 || !res.html) {
          notes.push(`${s.slug}: HTTP ${res.status}`);
          continue;
        }
        const page = parseAfgPage(res.html);
        const raw = { title: page.title, seasons: page.seasons, episodes: page.episodes };
        const hash = contentHash(raw);
        const { data: prev } = await db.from('ingest_afg_pages').select('content_hash').eq('slug', s.slug).maybeSingle();
        if (prev?.content_hash === hash) {
          counters.unchanged++;
          await db.from('ingest_afg_pages').update({ fetched_at: new Date().toISOString() }).eq('slug', s.slug);
          continue;
        }
        await db.from('ingest_afg_pages').upsert({
          slug: s.slug,
          raw,
          content_hash: hash,
          etag: res.etag,
          last_modified: res.lastModified,
          fetched_at: new Date().toISOString(),
          changed_at: new Date().toISOString(),
        });
        counters.changed++;

        const target = bySlug.get(s.slug) ?? bySlug.get(slugify(page.title));
        if (target) {
          const result = await syncAnchors(runId, target, s.slug, page);
          if (result.withheld) counters.flagged++;
        }
      } catch (e) {
        notes.push(`${s.slug}: ${String(e).slice(0, 100)}`);
      }
    }

    await finishRun(runId, 'ok', counters, `edge afg refresh: batch of ${batch.length}`);
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
