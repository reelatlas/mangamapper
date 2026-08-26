// Re-derive chapter anchors from STAGED AFG pages (no refetch) — the
// repeatable path after anchor-derivation logic changes (e.g. the
// monotonicity filter). Same matching + gates as afg-backfill.
//   npx tsx --env-file=.env.ingest scripts/ingest/rederive-anchors.ts

import { syncAnchors } from './lib/anchors';
import { db, startRun, finishRun, selectAll } from './lib/db';
import { slugify } from './lib/slug';
import type { AfgPage } from './lib/afg';

async function main() {
  const runId = await startRun('afg');
  const actions: string[] = [];
  try {
    // identity registry FIRST (the canonical afg↔series mapping), slug/title
    // heuristics only as fallback for never-registered pages
    const reg = await selectAll<{ series_id: string; external_id: string }>('series_external_ids', 'series_id, external_id', (q) => q.eq('source', 'afg'));
    const byRegistry = new Map((reg ?? []).map((r) => [r.external_id, r.series_id]));
    const series = await selectAll<{ id: string; afl_slug: string | null; title: string }>('series', 'id, afl_slug, title');
    const bySlug = new Map<string, string>();
    for (const s of series ?? []) {
      if (s.afl_slug) bySlug.set(s.afl_slug, s.id);
      bySlug.set(s.id, s.id);
      bySlug.set(slugify(s.title), s.id);
    }
    const pages = await selectAll<{ slug: string; raw: AfgPage }>('ingest_afg_pages', 'slug, raw');
    for (const p of pages) {
      const raw = p.raw as AfgPage;
      const target = byRegistry.get(p.slug) ?? bySlug.get(p.slug) ?? bySlug.get(slugify(raw.title));
      if (!target) continue;
      const result = await syncAnchors(runId, target, p.slug, raw);
      if (result.anchors === 0) continue;
      actions.push(`${target}: ${result.anchors} anchors`);
    }
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'anchor re-derivation');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
