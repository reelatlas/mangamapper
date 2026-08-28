// Row provenance, step 2 of 3 (G57): infer every existing episodes row's
// minter from the writers' REACH — never by hand — and stamp it. Order of
// claims (the source that carries a number owns it): (1) the translated AFL
// payload → 'afl'; (2) else the translated AFG page → 'afg'; (3) else a
// stitched series (more than one season component) → 'stitch' (the stitcher
// minted every row AFL's primary page does not carry); (4) else a series with
// an AFL page → 'wiki' (the only other creator of rows inside an AFL series is
// the wiki backfill); (5) else → 'anilist'. Prints the distribution and the
// five witnesses; refuses to leave a null. Idempotent (stamps only nulls
// unless --restamp). Step 3 (NOT NULL) runs only when this prints 0 nulls.
//   npx tsx --env-file=.env.ingest scripts/ingest/minted-by-backfill.ts [--dry-run] [--restamp]
import { db, selectAll } from './lib/db';
import { SOURCE_NUMBERING_SHIFTS, applyNumberingShift } from './lib/rulings/numbering-shifts';
import { COMMUNITY_COUNT_OVERRIDES } from './lib/resolve';
import type { MintedBy } from './lib/minted';

const DRY = process.argv.includes('--dry-run');
const RESTAMP = process.argv.includes('--restamp');
const WITNESSES = ['yu-gi-oh-5d-s#145', 'dragon-ball-z-kai#139', 'detective-school-q#19', 'kenichi-the-mightiest-disciple#1', 'hayate-the-combat-butler#5'];

const translate = (sid: string, rows: { number: number; type?: string }[], space: string) => {
  const t0 = SOURCE_NUMBERING_SHIFTS[sid];
  const t = t0 && (!t0.spaces || t0.spaces.includes(space)) ? t0 : { drop: [], shifts: [] };
  const cap = COMMUNITY_COUNT_OVERRIDES[sid]?.cap;
  return new Set(applyNumberingShift(t, rows).map((r) => r.number).filter((n) => cap == null || n <= cap));
};

async function main() {
  const series = await selectAll<any>('series', 'id, afl_slug');
  const sm = await selectAll<any>('source_map', 'afl_slug, afg_slug');
  const afgBySlug = new Map(sm.filter((m) => m.afl_slug && m.afg_slug).map((m) => [m.afl_slug, m.afg_slug]));
  const afl = new Map((await selectAll<any>('ingest_afl_shows', 'slug, raw')).map((s) => [s.slug, (s.raw?.episodes ?? []) as { number: number; type: string }[]]));
  const afg = new Map((await selectAll<any>('ingest_afg_pages', 'slug, raw')).map((s) => [s.slug, (s.raw?.episodes ?? []) as { number: number; type: string }[]]));
  const comps = await selectAll<any>('series_components', 'series_id, kind');
  const seasonCount = new Map<string, number>(); for (const c of comps) if (c.kind === 'season') seasonCount.set(c.series_id, (seasonCount.get(c.series_id) ?? 0) + 1);
  const episodes = await selectAll<any>('episodes', 'series_id, number, minted_by');
  const dist: Record<string, number> = {}; const updates: { series_id: string; number: number; minted_by: MintedBy }[] = [];
  for (const s of series) {
    const rows = episodes.filter((e) => e.series_id === s.id);
    if (!rows.length) continue;
    const aflNums = s.afl_slug ? translate(s.id, afl.get(s.afl_slug) ?? [], 'afl') : new Set<number>();
    const afgSlug = s.afl_slug ? afgBySlug.get(s.afl_slug) : undefined;
    const afgNums = afgSlug ? translate(s.id, afg.get(afgSlug) ?? [], 'afg') : new Set<number>();
    const stitched = (seasonCount.get(s.id) ?? 0) > 1;
    for (const r of rows) {
      if (r.minted_by && !RESTAMP) { dist[`kept:${r.minted_by}`] = (dist[`kept:${r.minted_by}`] ?? 0) + 1; continue; }
      const m: MintedBy = aflNums.has(r.number) ? 'afl' : afgNums.has(r.number) ? 'afg' : stitched ? 'stitch' : s.afl_slug ? 'wiki' : 'anilist';
      dist[m] = (dist[m] ?? 0) + 1;
      updates.push({ series_id: s.id, number: r.number, minted_by: m });
      if (WITNESSES.includes(`${s.id}#${r.number}`)) console.log(`  witness ${s.id}#${r.number} → ${m}`);
    }
  }
  console.log('distribution:', JSON.stringify(dist));
  if (!DRY) {
    const by = new Map<string, { series_id: string; number: number }[]>();
    for (const u of updates) { const k = `${u.series_id}|${u.minted_by}`; if (!by.has(k)) by.set(k, []); by.get(k)!.push(u); }
    for (const [k, list] of by) {
      const [series_id, minted_by] = k.split('|');
      for (let i = 0; i < list.length; i += 500) {
        const { error } = await db.from('episodes').update({ minted_by }).eq('series_id', series_id).in('number', list.slice(i, i + 500).map((u) => u.number));
        if (error) throw new Error(`${k}: ${error.message}`);
      }
    }
    const { count } = await db.from('episodes').select('*', { count: 'exact', head: true }).is('minted_by', null);
    console.log(`[minted-by] stamped ${updates.length}; nulls remaining: ${count}`);
  } else console.log(`[minted-by] would stamp ${updates.length} (dry run)`);
  process.exit(0);
}
main();
