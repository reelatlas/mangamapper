// MangaUpdates refresh (edge runner, bundled — see build-functions.ts).
// MU earned the scheduled tier 2026-08-24 (Sean): it supplies the frontier
// anchors for ~140 series and the latest_known denominator for every
// publishing manga — both go stale as chapters release weekly. Daily tick,
// ≤20 stalest staged rows older than 7 days → each manga cycles ~weekly at
// ~1.5s API spacing (well within MU's AUP; responses hash-gated). Inline
// upkeep on change: latest_known (publishing only), frontier re-derivation
// via the shared lib, and the manga-status cross-check.

import { db, startRun, finishRun, selectAll } from '../../../scripts/ingest/lib/db';
import { fetchMuSeries, muHash } from '../../../scripts/ingest/lib/mangaupdates';
import { contentHash } from '../../../scripts/ingest/lib/hash';
import { applyMuFrontier, bestLatestKnown, crossCheckMangaStatus } from '../../../scripts/ingest/lib/mu-frontier';

declare const Deno: {
  env: { get(k: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const STALE_MS = 7 * 24 * 60 * 60 * 1000;
const BATCH = 20;

async function run() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const notes: string[] = [];
  try {
    const { data: staged } = await db
      .from('ingest_mangaupdates')
      .select('manga_anilist_id, mu_series_id, content_hash, fetched_at')
      .order('fetched_at', { ascending: true })
      .limit(BATCH * 2);
    const cutoff = Date.now() - STALE_MS;
    const batch = (staged ?? []).filter((r) => new Date(r.fetched_at).getTime() < cutoff).slice(0, BATCH);

    for (const row of batch) {
      try {
        const mu = await fetchMuSeries(row.mu_series_id);
        counters.fetched++;
        if (!mu) {
          notes.push(`mu:${row.mu_series_id}: fetch failed`);
          continue;
        }
        const hash = contentHash(muHash(mu));
        if (row.content_hash === hash) {
          counters.unchanged++;
          await db.from('ingest_mangaupdates').update({ fetched_at: new Date().toISOString() }).eq('manga_anilist_id', row.manga_anilist_id);
          continue;
        }
        await db
          .from('ingest_mangaupdates')
          .update({ raw: mu, content_hash: hash, fetched_at: new Date().toISOString(), changed_at: new Date().toISOString() })
          .eq('manga_anilist_id', row.manga_anilist_id);
        counters.changed++;

        // inline upkeep for every series backed by this manga
        const linked = await selectAll<{ id: string; status: string | null; aired_episodes: number | null; total_chapters: number | null; manga_start_chapter: number | null; manga_status: string | null }>(
          'series',
          'id, status, aired_episodes, total_chapters, manga_start_chapter, manga_status',
          (q) => q.eq('manga_anilist_id', row.manga_anilist_id),
        );
        for (const s of linked) {
          const { data: epTop } = await db.from('chapter_anchors').select('episode').eq('series_id', s.id).neq('source', 'mu').order('episode', { ascending: false }).limit(1);
          const { data: chTop } = await db.from('chapter_anchors').select('chapter').eq('series_id', s.id).neq('source', 'mu').order('chapter', { ascending: false }).limit(1);
          await db
            .from('series')
            .update({
              latest_known_chapters: bestLatestKnown(mu, s.total_chapters, chTop?.[0]?.chapter ?? 0),
              updated_at: new Date().toISOString(),
            })
            .eq('id', s.id);
          await crossCheckMangaStatus(runId, s.id, s.manga_status, mu);
          await applyMuFrontier(runId, s, mu.anime?.end ?? null, epTop?.[0]?.episode, chTop?.[0]?.chapter);
        }
      } catch (e) {
        notes.push(`mu:${row.mu_series_id}: ${String(e).slice(0, 100)}`);
      }
    }

    await finishRun(runId, 'ok', counters, `edge mu refresh: batch of ${batch.length}`);
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
