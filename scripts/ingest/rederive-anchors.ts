// Re-derive chapter anchors from STAGED AFG pages (no refetch) — the
// repeatable path after anchor-derivation logic changes (e.g. the
// monotonicity filter). Same matching + gates as afg-backfill.
//   npx tsx --env-file=.env.ingest scripts/ingest/rederive-anchors.ts

import { syncAnchors } from './lib/anchors';
import { db, startRun, finishRun } from './lib/db';
import { slugify } from './lib/slug';
import type { AfgPage } from './lib/afg';

async function main() {
  const runId = await startRun('afg');
  const actions: string[] = [];
  try {
    const { data: series } = await db.from('series').select('id, afl_slug, title');
    const bySlug = new Map<string, string>();
    for (const s of series ?? []) {
      if (s.afl_slug) bySlug.set(s.afl_slug, s.id);
      bySlug.set(s.id, s.id);
      bySlug.set(slugify(s.title), s.id);
    }
    const { data: pages } = await db.from('ingest_afg_pages').select('slug, raw');
    for (const p of pages ?? []) {
      const raw = p.raw as AfgPage;
      const target = bySlug.get(p.slug) ?? bySlug.get(slugify(raw.title));
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
