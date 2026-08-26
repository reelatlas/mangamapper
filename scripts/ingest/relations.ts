// Populate series_relations: relations between CANONICAL series, for future
// linking/recommendations (Sean 2026-08-22: keep the full vocabulary).
// Two layers: AUTO (AniList relation edges between any two series' components,
// kept verbatim lowercase) and RULED (franchise-rulings.md kinds — 'remake'
// isn't an AniList concept, so rulings override the auto kind per pair).
//   npx tsx --env-file=.env.ingest scripts/ingest/relations.ts

import { db, selectAll, startRun, finishRun } from './lib/db';
import type { AniListMedia } from './lib/anilist';
import { RULED } from './lib/rulings/relations';

const AUTO_KINDS = new Set(['SEQUEL', 'PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE', 'PARENT']);

// RULED (franchise-rulings.md kinds, addressed by afl_slug; skipped when
// either side is not in canonical yet) lives in lib/rulings/relations.ts
// (restructure T2.1) — the typed record with each pair's reason.

async function main() {
  const runId = await startRun('resolve');
  try {
    const comps = await selectAll<{ series_id: string; anilist_id: number }>('series_components', 'series_id, anilist_id');
    const owner = new Map<number, string>();
    for (const c of comps) owner.set(c.anilist_id, c.series_id);

    const seriesRows = await selectAll<{ id: string; afl_slug: string | null }>('series', 'id, afl_slug');
    const bySlug = new Map(seriesRows.map((s) => [s.afl_slug, s.id]));

    // AUTO: edges between components of different series
    const rows = new Map<string, { from_series: string; to_series: string; kind: string }>();
    const ids = [...owner.keys()];
    for (let i = 0; i < ids.length; i += 100) {
      const staged = await selectAll<{ anilist_id: number; raw: unknown }>('ingest_anilist_media', 'anilist_id, raw', (q) => q.in('anilist_id', ids.slice(i, i + 100)));
      for (const row of staged) {
        const from = owner.get(row.anilist_id)!;
        const media = row.raw as AniListMedia;
        for (const e of media.relations.edges) {
          if (!AUTO_KINDS.has(e.relationType)) continue;
          const to = owner.get(e.node.id);
          if (!to || to === from) continue;
          const kind = e.relationType.toLowerCase();
          rows.set(`${from}→${to}→${kind}`, { from_series: from, to_series: to, kind });
        }
      }
    }

    // RULED: authoritative kinds — clear the pair's auto rows, insert the ruling
    let ruled = 0;
    const ruledPairs = new Set<string>();
    for (const [fromSlug, toSlug, kind] of RULED) {
      const from = bySlug.get(fromSlug);
      const to = bySlug.get(toSlug);
      if (!from || !to) continue;
      for (const key of [...rows.keys()]) {
        if (key.startsWith(`${from}→${to}→`)) rows.delete(key);
      }
      rows.set(`${from}→${to}→${kind}`, { from_series: from, to_series: to, kind });
      ruledPairs.add(`${from}→${to}`);
      ruled++;
    }

    await db.from('series_relations').delete().neq('kind', '');
    const all = [...rows.values()];
    for (let i = 0; i < all.length; i += 500) {
      const { error } = await db.from('series_relations').insert(all.slice(i, i + 500));
      if (error) throw new Error(`insert: ${error.message}`);
    }

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: all.length, flagged: 0 }, 'relations');
    const kinds: Record<string, number> = {};
    for (const r of all) kinds[r.kind] = (kinds[r.kind] ?? 0) + 1;
    console.log(`relations: ${all.length} rows (${ruled} ruled pairs applied)`, kinds);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
