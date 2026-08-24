// Populate series_relations: relations between CANONICAL series, for future
// linking/recommendations (Sean 2026-08-22: keep the full vocabulary).
// Two layers: AUTO (AniList relation edges between any two series' components,
// kept verbatim lowercase) and RULED (franchise-rulings.md kinds — 'remake'
// isn't an AniList concept, so rulings override the auto kind per pair).
//   npx tsx --env-file=.env.ingest scripts/ingest/relations.ts

import { db, startRun, finishRun } from './lib/db';
import type { AniListMedia } from './lib/anilist';

const AUTO_KINDS = new Set(['SEQUEL', 'PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE', 'PARENT']);

// franchise-rulings.md, addressed by afl_slug (skipped when either side is
// not in canonical yet — recovery-dependent pairs appear on a later run).
const RULED: [string, string, string][] = [
  ['naruto-shippuden', 'naruto', 'sequel'],
  ['cardcaptor-sakura-clear-card', 'cardcaptor-sakura', 'sequel'], // Sean 2026-08-24: Clear Card split (different manga)
  ['boruto-naruto-next-generations', 'naruto-shippuden', 'sequel'],
  ['dragon-ball-z', 'dragon-ball', 'sequel'],
  ['dragon-ball-gt', 'dragon-ball-z', 'sequel'],
  ['dragon-ball-super', 'dragon-ball-z', 'sequel'],
  ['dragon-ball-z-kai', 'dragon-ball-z', 'remake'],
  ['yu-gi-oh-gx', 'yu-gi-oh', 'sequel'],
  ['yu-gi-oh-5ds', 'yu-gi-oh-gx', 'sequel'],
  ['yu-gi-oh-zexal', 'yu-gi-oh', 'spin_off'],
  ['yu-gi-oh-arc-v', 'yu-gi-oh', 'spin_off'],
  ['yu-gi-oh-vrains', 'yu-gi-oh', 'spin_off'],
  ['yu-gi-oh-sevens', 'yu-gi-oh', 'spin_off'],
  ['digimon-adventure-2020', 'digimon-adventure', 'alternative'],
  ['sailor-moon-crystal', 'sailor-moon', 'remake'],
  ['fairy-tail-100-years-quest', 'fairy-tail', 'sequel'],
  ['hunter-x-hunter', 'hunter-x-hunter-1999', 'remake'], // 2011 remakes 1999
  ['fullmetal-alchemist-brotherhood', 'fullmetal-alchemist', 'alternative'],
  ['fruits-basket-2019', 'fruits-basket-2001', 'remake'],
  ['shaman-king-2021', 'shaman-king', 'remake'],
  ['shaman-kingflowers', 'shaman-king-2021', 'sequel'],
  ['rurouni-kenshin-2023', 'rurouni-kenshin', 'remake'],
  ['seven-deadly-sins-four-knights-apocalypse', 'nanatsu-no-taizai', 'sequel'],
  ['it-wrong-try-pick-girls-dungeon-side-sword-oratoria', 'it-wrong-try-pick-girls-dungeon', 'side_story'],
  ['sword-art-online-alternative-ggo', 'sword-art-online', 'spin_off'],
  ['a-certain-scientific-railgun', 'certain-magical-index', 'spin_off'],
  ['bleach-thousand-year-blood-war', 'bleach', 'sequel'],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    const { data: comps } = await db.from('series_components').select('series_id, anilist_id');
    const owner = new Map<number, string>();
    for (const c of comps ?? []) owner.set(c.anilist_id, c.series_id);

    const { data: seriesRows } = await db.from('series').select('id, afl_slug');
    const bySlug = new Map((seriesRows ?? []).map((s) => [s.afl_slug, s.id]));

    // AUTO: edges between components of different series
    const rows = new Map<string, { from_series: string; to_series: string; kind: string }>();
    const ids = [...owner.keys()];
    for (let i = 0; i < ids.length; i += 100) {
      const { data: staged } = await db
        .from('ingest_anilist_media')
        .select('anilist_id, raw')
        .in('anilist_id', ids.slice(i, i + 100));
      for (const row of staged ?? []) {
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
