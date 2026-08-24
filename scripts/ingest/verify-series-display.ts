// Whole-series display verification (Sean's ruling 2026-08-23: "after
// adjusting, check ALL other episodes — data keeps getting broken every
// time we make adjustments"). Renders a series EXACTLY as the app does —
// same assemble (src/data/catalog/assemble.ts) + same display math
// (src/lib/mapping.ts buildEpisodeList) — against service-role data, then
// sanity-checks every row. Run it after ANY anchor/episode adjustment to a
// series, BEFORE reporting the change done. Not a re-implementation: if
// the app's code path changes, this changes with it.
//
//   npx tsx --env-file=.env.ingest scripts/ingest/verify-series-display.ts <series-id> [...ids]
//   npx tsx --env-file=.env.ingest scripts/ingest/verify-series-display.ts --print <series-id>
//   npx tsx --env-file=.env.ingest scripts/ingest/verify-series-display.ts --all   (every anchored series)
//
// Checks per canon/mixed row inside the frontier: ch present (no null/NaN
// holes between mapped neighbors), start non-decreasing (except episodes
// ruled by rearranged/graft annotations, or loose series — skipped whole).
// REORDER HOLES (Sean's MHA 107/113 report, 2026-08-23): a canon row inside
// a reorder crossing (src/lib/mapping.ts inReorderCrossing — between anchor
// points of different regimes) renders null BY RULE: no formula may bridge a
// reorder. Such rows are reported as `hole` lines (the exact-record
// work-list), never as failures. Exit 1 on any failure.

import { db } from './lib/db';
import {
  buildMapping,
  toAnimeSeries,
  toEpisodes,
  SERIES_COLS,
  type AnchorRow,
  type Boundary,
  type EpisodeRow as DbEpisodeRow,
  type SeriesRow,
} from '../../src/data/catalog/assemble';
import { buildEpisodeList, inReorderCrossing } from '../../src/lib/mapping';

async function pageAll<T>(table: string, select: string, seriesId: string, order: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(select).eq('series_id', seriesId).order(order).range(from, from + 999);
    if (error) throw error;
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

// same-manga continuation lookup (mirrors supabaseSource.continuationStart —
// kept tiny here because it is a DB query, not assembly logic)
async function continuationStart(row: SeriesRow): Promise<number | null> {
  if (!row.manga_anilist_id || !row.total_chapters) return null;
  const { data } = await db
    .from('series')
    .select('manga_start_chapter')
    .eq('manga_anilist_id', row.manga_anilist_id)
    .neq('id', row.id)
    .not('manga_start_chapter', 'is', null);
  const ourStart = row.manga_start_chapter ?? 1;
  const starts = (data ?? [])
    .map((s: any) => s.manga_start_chapter as number)
    .filter((st: number) => st > ourStart && st <= row.total_chapters! + 1);
  return starts.length ? Math.min(...starts) : null;
}

export const holesFound: string[] = [];

export async function verifySeries(id: string, print = false): Promise<string[]> {
  const { data: rowData, error } = await db.from('series').select(SERIES_COLS).eq('id', id).maybeSingle();
  if (error) throw error;
  const row = rowData as SeriesRow | null;
  if (!row) return [`${id}: series not found`];

  const eps = await pageAll<DbEpisodeRow>('episodes', 'number, title, type, air_date', id, 'number');
  const anchors = await pageAll<AnchorRow>('chapter_anchors', 'episode, volume, chapter, start_chapter', id, 'episode');
  const annos = await pageAll<{ episode: number; kind: string }>('episode_annotations', 'episode, kind', id, 'episode');
  let boundaries: Boundary[] = [];
  if (row.manga_anilist_id) {
    const { data: b } = await db
      .from('volume_boundaries')
      .select('volume, chapter_start, chapter_end')
      .eq('manga_anilist_id', row.manga_anilist_id)
      .order('volume');
    boundaries = (b ?? []) as Boundary[];
  }

  const m = buildMapping(row, eps, anchors, boundaries, await continuationStart(row));
  const anime = toAnimeSeries(row, 1, toEpisodes(row, eps, anchors, boundaries), boundaries.length, boundaries);
  const list = buildEpisodeList(anime, m);

  if (print) {
    for (const r of list.rows) console.log(`  ep ${r.ep} [${r.type}] vol ${r.vol ?? '·'} ch ${r.ch ?? '·'}`);
    for (const s of list.sections) {
      const ch = s.chStart == null || s.chEnd == null ? '—' : s.chStart === s.chEnd ? `${s.chStart}` : `${s.chStart}-${s.chEnd}`;
      const vol = s.volStart == null ? '—' : s.volEnd != null && s.volEnd !== s.volStart ? `${s.volStart}-${s.volEnd}` : `${s.volStart}`;
      console.log(`  section ${s.start}-${s.end} [${s.type}] (${s.count}) vol ${vol} · ch ${ch}${s.openEnded ? '+' : ''}`);
    }
  }

  const problems: string[] = [];
  if (row.mapping_mode === 'loose') return problems; // borrow-maps render as stored
  const ruled = new Set(annos.filter((a) => a.kind === 'rearranged' || a.kind === 'graft').map((a) => a.episode));
  const frontier = m.latestKnown ? m.latestKnown.episode : 0;
  let prevStart: number | null = null;
  let prevEp = 0;
  for (const r of list.rows) {
    if (r.type !== 'canon' && r.type !== 'mixed') continue;
    const start = r.ch != null ? parseInt(r.ch.split(/[-,]/)[0], 10) : NaN;
    if (r.ep <= frontier && (r.ch == null || Number.isNaN(start))) {
      if (inReorderCrossing(anime, m, r.ep)) {
        holesFound.push(`${id}: ep ${r.ep} is a reorder hole — inside a reorder crossing with no exact record (research: anchor it with its own start)`);
        continue;
      }
      problems.push(`${id}: ep ${r.ep} renders ch "${r.ch}" inside the mapped frontier (ep ${frontier})`);
      continue;
    }
    if (Number.isNaN(start)) continue; // beyond frontier: null is the honest state
    if (prevStart != null && start < prevStart && !ruled.has(r.ep) && !ruled.has(prevEp)) {
      problems.push(`${id}: ep ${r.ep} starts ch ${start} below ep ${prevEp}'s ${prevStart} with no rearranged/graft ruling`);
    }
    prevStart = start;
    prevEp = r.ep;
  }
  return problems;
}

const isMain = process.argv[1]?.endsWith('verify-series-display.ts');
if (isMain) {
  (async () => {
    const args = process.argv.slice(2);
    const print = args.includes('--print');
    let ids = args.filter((a) => !a.startsWith('--'));
    if (args.includes('--all')) {
      // every series that carries at least one anchor
      const seen = new Set<string>();
      for (let from = 0; ; from += 1000) {
        const { data } = await db.from('chapter_anchors').select('series_id').range(from, from + 999);
        for (const r of data ?? []) seen.add(r.series_id as string);
        if (!data || data.length < 1000) break;
      }
      ids = [...seen].sort();
    }
    if (!ids.length) {
      console.error('usage: verify-series-display.ts [--print] <series-id> [...ids] | --all');
      process.exit(2);
    }
    let bad = 0;
    for (const id of ids) {
      const before = holesFound.length;
      const problems = await verifySeries(id, print);
      const holes = holesFound.length - before;
      if (problems.length) {
        bad++;
        for (const p of problems) console.log('FAIL', p);
      } else console.log(holes ? `ok   ${id} (${holes} reorder hole${holes === 1 ? '' : 's'})` : `ok   ${id}`);
    }
    if (holesFound.length) {
      console.log(`\n${holesFound.length} reorder hole(s) — the exact-record work-list:`);
      for (const h of holesFound) console.log('  hole', h);
    }
    console.log(`\n${ids.length} series verified, ${bad} failing`);
    process.exit(bad ? 1 : 0);
  })();
}
