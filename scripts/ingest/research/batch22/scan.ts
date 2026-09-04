// Batch-20 contradiction scan (P13 step 2, R25) for lane A2 gap blocks — runs
// AFTER validate.ts. Mechanical, against the DB: (1) every delivered END sits
// inside the block's FENCE (the stored anchors bracketing the target range)
// unless the verdict REPAIRS that fence row; (2) ENDs are monotone across the
// block in row order — a regression is listed (it may be a legitimate
// `rearranged` row, but it must be NAMED, never silent); (3) a row is never
// both anchored and anchor_hostile; (4) repairs / annotations / continues
// name rows that exist, and a repair's `old` matches what is stored; (5) a
// continue on a row that has no anchor (stored or delivered) is orphaned.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch22/scan.ts [series_id ...]
import { readdirSync, readFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { TARGETS } from './context';

const OUT = new URL('./out/', import.meta.url).pathname;
const ranges = (s: string): [number, number][] => s.split(',').map((p) => p.trim()).map((p) => { const [a, b] = p.split('-').map(Number); return [a, b ?? a]; });

async function main() {
  const only = new Set(process.argv.slice(2));
  const files = readdirSync(OUT).filter((f) => f.endsWith('.json'));
  let warn = 0;
  for (const f of files) {
    const v = JSON.parse(readFileSync(OUT + f, 'utf8'));
    // a series can have one TARGETS entry per wave: `<id>-w<N>.json` names the wave; no suffix = the series' lowest wave
    const mine = TARGETS.filter((t) => t[0] === v.series_id).sort((a, b) => a[4] - b[4]);
    const wv = /-w(\d+)[a-z]?\.json$/.exec(f)?.[1];
    const sameWave = wv ? mine.filter((t) => t[4] === Number(wv)) : [];
    const touched = [...(v.anchors ?? []), ...(v.anchor_hostile ?? []), ...(v.repairs ?? []), ...(v.continue_points ?? [])].map((x: any) => Number(x.episode)).concat(...[...(v.type_corrections ?? []), ...(v.annotations ?? [])].map((x: any) => (x.episodes ?? []).map(Number)));
    // several same-wave entries (sub-blocks): the entry covering the MOST touched rows wins — a repair on the fence row outside every range must not throw the pick (wave 11, bleach-w11b's ep-203 START enrichment)
    const covered = (t: (typeof mine)[number]) => touched.filter((n) => ranges(t[1]).some(([a, b]) => n >= a && n <= b)).length;
    const task = (sameWave.length > 1 ? [...sameWave].sort((x, y) => covered(y) - covered(x))[0] : sameWave[0]) ?? mine[0];
    if (!task || (task[2] !== 'A2' && task[2] !== 'C')) continue; // lane C narrow follow-ups get the same fence / monotone / orphan checks (FotNS 1-28 is a gap block)
    if (only.size && !only.has(v.series_id)) continue;
    const [lo, hi] = [Math.min(...ranges(task[1]).map((r) => r[0])), Math.max(...ranges(task[1]).map((r) => r[1]))];
    const stored = await selectAll<any>('chapter_anchors', 'episode, chapter, start_chapter, continue_chapter, source', (q) => q.eq('series_id', v.series_id).order('episode'));
    const rows = new Set((await selectAll<{ number: number }>('episodes', 'number', (q) => q.eq('series_id', v.series_id))).map((r) => r.number));
    const byEp = new Map(stored.map((a) => [a.episode, a]));
    const below = stored.filter((a) => a.episode < lo).at(-1);
    const above = stored.find((a) => a.episode > hi);
    const repaired = new Set((v.repairs ?? []).map((r: any) => Number(r.episode)));
    const notes: string[] = [];
    const anchors = [...(v.anchors ?? [])].map((a) => ({ ...a, episode: Number(a.episode), end: Number(a.end_chapter) })).sort((a, b) => a.episode - b.episode);
    // (1) fence
    for (const a of anchors) {
      if (below && !repaired.has(below.episode) && a.end < below.chapter) notes.push(`FENCE: ep ${a.episode} END ${a.end} < lower fence ep ${below.episode} → ${below.chapter}`);
      if (above && !repaired.has(above.episode) && a.end > above.chapter) notes.push(`FENCE: ep ${a.episode} END ${a.end} > upper fence ep ${above.episode} → ${above.chapter}`);
      if (a.episode < lo || a.episode > hi) notes.push(`RANGE: anchor ep ${a.episode} outside the target range ${task[1]}${byEp.has(a.episode) ? ` (stored ${byEp.get(a.episode).chapter}${repaired.has(a.episode) ? ', repaired' : ' — a silent contradiction?'})` : ''}`);
    }
    // (2) monotone
    const rearranged = new Set<number>();
    for (const an of v.annotations ?? []) if (an.kind === 'rearranged' || an.kind === 'graft') for (const e of an.episodes ?? []) rearranged.add(Number(e));
    for (let i = 1; i < anchors.length; i++) if (anchors[i].end < anchors[i - 1].end) notes.push(`${rearranged.has(anchors[i].episode) ? 'regression (annotated rearranged/graft)' : 'REGRESSION unannotated'}: ep ${anchors[i - 1].episode} → ${anchors[i - 1].end} then ep ${anchors[i].episode} → ${anchors[i].end}`);
    // (3) anchored ∧ hostile
    const hostile = new Set((v.anchor_hostile ?? []).map((h: any) => Number(h.episode)));
    for (const a of anchors) if (hostile.has(a.episode)) notes.push(`BOTH: ep ${a.episode} is anchored AND anchor_hostile`);
    // (4) rows exist; repair old matches stored
    const named = [...(v.repairs ?? []).map((r: any) => r.episode), ...(v.continue_points ?? []).map((c: any) => c.episode), ...(v.annotations ?? []).flatMap((a: any) => a.episodes ?? []), ...(v.type_corrections ?? []).flatMap((t: any) => t.episodes ?? [])].map(Number);
    for (const e of named) if (!rows.has(e)) notes.push(`NO ROW: ep ${e} named but no episodes row exists`);
    for (const r of v.repairs ?? []) {
      const s = byEp.get(Number(r.episode));
      const fieldMap: Record<string, string> = { end_chapter: 'chapter', chapter: 'chapter', start_chapter: 'start_chapter', continue_chapter: 'continue_chapter' };
      const col = fieldMap[r.field];
      if (col && s && r.old != null && String(s[col]) !== String(r.old)) notes.push(`REPAIR old≠stored: ep ${r.episode} ${r.field} claims old ${r.old}, stored ${s[col]}`);
      if (col && !s) notes.push(`REPAIR on unanchored row: ep ${r.episode} ${r.field} (nothing stored to repair — an anchor instead?)`);
    }
    // (5) orphan continue
    const anchoredEps = new Set(anchors.map((a) => a.episode));
    for (const c of v.continue_points ?? []) if (!anchoredEps.has(Number(c.episode)) && !byEp.has(Number(c.episode))) notes.push(`ORPHAN continue: ep ${c.episode} has no anchor (stored or delivered)`);
    // summary numbers vs rows
    const nums = [...String(v.summary ?? '').matchAll(/\b(?:ch(?:apter)?\.?\s*)(\d{1,3})\b/gi)].map((m) => Number(m[1]));
    const delivered = new Set(anchors.flatMap((a) => [a.end, a.start_chapter].filter((x) => x != null).map(Number)));
    const strays = nums.filter((n) => !delivered.has(n) && !stored.some((s) => s.chapter === n || s.start_chapter === n));
    if (strays.length) notes.push(`summary cites chapters not in any anchor (read): ${[...new Set(strays)].join(', ')}`);
    warn += notes.length;
    console.log(`${notes.length ? 'WARN' : 'ok  '} ${f}: fence ${below ? `ep ${below.episode} → ${below.chapter}` : '—'} … ${above ? `ep ${above.episode} → ${above.chapter}` : '—'}; ${anchors.length} anchors ${anchors.length ? `(${anchors[0].end}…${anchors.at(-1)!.end})` : ''}, ${hostile.size} hostile`);
    for (const n of notes) console.log(`   - ${n}`);
  }
  console.log(`[scan] ${warn} items to read`);
  process.exit(0);
}
main();
