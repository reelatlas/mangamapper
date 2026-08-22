// Re-derive chapter anchors from STAGED AFG pages (no refetch) — the
// repeatable path after anchor-derivation logic changes (e.g. the
// monotonicity filter). Same matching + gates as afg-backfill.
//   npx tsx --env-file=.env.ingest scripts/ingest/rederive-anchors.ts

import { deriveAnchors } from './lib/afg';
import { db, startRun, finishRun } from './lib/db';
import { registerIds } from './lib/resolve';
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
      const anchors = deriveAnchors(raw.episodes);
      if (!anchors.length) continue;
      const { data: maxRow } = await db.from('episodes').select('number').eq('series_id', target).order('number', { ascending: false }).limit(1);
      const ourMax = maxRow?.[0]?.number ?? 0;
      const afgMax = raw.episodes.reduce((m, e) => Math.max(m, e.number), 0);
      if (ourMax && Math.abs(afgMax - ourMax) > 12) continue; // alignment gate
      await db.from('chapter_anchors').delete().eq('series_id', target).eq('source', 'afg');
      const rows = anchors.map((a) => ({ series_id: target, episode: a.episode, volume: null, chapter: a.chapter, source: 'afg', note: a.arc }));
      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await db.from('chapter_anchors').upsert(rows.slice(i, i + 500));
        if (error) throw new Error(`${target}: ${error.message}`);
      }
      await registerIds(target, { afg: p.slug });
      actions.push(`${target}: ${rows.length} anchors`);
    }
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'anchor re-derivation');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
