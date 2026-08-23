// UI-truth audit (Sean 2026-08-24: "still quite a few series where manga says
// mapping pending"): replicates buildMapping's EXACT decision points
// (supabaseSource.ts) for every series and classifies what the card actually
// renders — the data-level coverage audit can say "resolved" while a UI gate
// (volume ratio, synthesis prerequisites) still blanks the display. Keep the
// logic in lockstep with supabaseSource.ts when either changes.
// Classes: ok_full / ok_no_volume / pending_* / no_source /
// integrity_eps_beyond_total (episodes outrun the component structure).
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-ui-truth.ts

import { db } from './lib/db';

async function pageAll(table: string, select: string): Promise<any[]> {
  const out: any[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(select).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function main() {
  const series = await pageAll('series', 'id, source_type, manga_status, status, aired_episodes, total_episodes, total_chapters, total_volumes, latest_known_chapters, manga_anilist_id, manga_start_chapter');
  const episodes = await pageAll('episodes', 'series_id, number, type');
  const anchors = await pageAll('chapter_anchors', 'series_id, episode, chapter, volume');
  const comps = await pageAll('series_components', 'series_id, episode_end');
  const bounds = await pageAll('volume_boundaries', 'manga_anilist_id, volume, chapter_start, chapter_end');

  const epsBy = new Map<string, { max: number; lastCanon: number; count: number }>();
  for (const e of episodes) {
    const s = epsBy.get(e.series_id) ?? { max: 0, lastCanon: 0, count: 0 };
    s.max = Math.max(s.max, e.number);
    s.count++;
    if (e.type !== 'filler') s.lastCanon = Math.max(s.lastCanon, e.number);
    epsBy.set(e.series_id, s);
  }
  const anchBy = new Map<string, { episode: number; chapter: number; volume: number | null }>();
  for (const a of anchors) {
    const cur = anchBy.get(a.series_id);
    if (!cur || a.episode > cur.episode) anchBy.set(a.series_id, a);
  }
  const compEnd = new Map<string, number>();
  for (const c of comps) {
    if (c.episode_end != null) compEnd.set(c.series_id, Math.max(compEnd.get(c.series_id) ?? 0, c.episode_end));
  }
  const boundsBy = new Map<number, any[]>();
  for (const b of bounds) {
    if (!boundsBy.has(b.manga_anilist_id)) boundsBy.set(b.manga_anilist_id, []);
    boundsBy.get(b.manga_anilist_id)!.push(b);
  }
  const volumeFor = (row: any, chapter: number): number | null => {
    for (const b of boundsBy.get(row.manga_anilist_id) ?? []) {
      if (chapter >= b.chapter_start && (b.chapter_end === null || chapter <= b.chapter_end)) return b.volume;
    }
    if (!row.total_volumes || !row.total_chapters) return null;
    return Math.min(row.total_volumes, Math.max(1, Math.ceil((chapter * row.total_volumes) / row.total_chapters)));
  };

  const classes: Record<string, string[]> = {
    integrity_eps_beyond_total: [], integrity_total_beyond_eps: [], no_source: [], ok_full: [], ok_no_volume: [],
    pending_airing_no_anchor: [], pending_finished_no_totals: [], pending_no_canon: [], pending_other: [],
  };
  const lightNovel: string[] = [];

  for (const row of series) {
    const e = epsBy.get(row.id) ?? { max: 0, lastCanon: 0, count: 0 };
    const covered = Math.max(row.total_episodes ?? 0, compEnd.get(row.id) ?? 0, row.aired_episodes ?? 0);
    // any overshoot lists (reconcile-structure resolves what the chain can
    // confirm; what remains here = ruled extras + accepted 1-2 tolerance)
    if (e.max > covered) {
      classes.integrity_eps_beyond_total.push(`${row.id} (eps→${e.max}, structure=${covered})`);
    }
    // inverse direction (Sean's ±2 interrogation 2026-08-24): a FINISHED
    // series whose totals exceed its listed episodes means a source counts
    // content our episode list lacks (AFL missing a final special) — the
    // card would promise more episodes than the list shows
    if (row.status === 'finished' && row.aired_episodes > 0 && e.count > 0 && row.aired_episodes > e.max) {
      classes.integrity_total_beyond_eps.push(`${row.id} (aired/total=${row.aired_episodes}, eps listed→${e.max})`);
    }
    const hasSource = row.source_type !== 'original' && row.manga_status !== 'anime_only';
    if (!hasSource) { classes.no_source.push(row.id); continue; }
    if (row.source_type === 'light_novel') lightNovel.push(row.id);
    const latestAnchor = anchBy.get(row.id) ?? null;
    let latestKnown: { volume: number | null; chapters: number } | null = null;
    if (latestAnchor) latestKnown = { volume: latestAnchor.volume ?? volumeFor(row, latestAnchor.chapter), chapters: latestAnchor.chapter };
    if (!latestKnown && row.total_chapters && row.status === 'finished' && e.lastCanon > 0) {
      latestKnown = { volume: row.total_volumes ?? volumeFor(row, row.total_chapters), chapters: row.total_chapters };
    }
    if (latestKnown) {
      (latestKnown.volume != null ? classes.ok_full : classes.ok_no_volume).push(row.id);
    } else if (e.lastCanon === 0) classes.pending_no_canon.push(row.id);
    else if (row.status !== 'finished') classes.pending_airing_no_anchor.push(row.id);
    else if (!row.total_chapters) classes.pending_finished_no_totals.push(`${row.id} (manga ${row.manga_status}, latest_known=${row.latest_known_chapters})`);
    else classes.pending_other.push(row.id);
  }

  for (const [k, v] of Object.entries(classes)) {
    console.log(`\n${k}: ${v.length}`);
    for (const id of v.slice(0, 40)) console.log('   ' + id);
    if (v.length > 40) console.log(`   …+${v.length - 40} more`);
  }
  console.log('\nlight_novel-source series:', lightNovel.length, '→', lightNovel.slice(0, 25).join(', '));
  const eightySix = series.find((s: any) => s.id.includes('86') || s.id.includes('eighty'));
  console.log('\n86 row:', JSON.stringify(eightySix));
}
main().then(() => process.exit(0));
