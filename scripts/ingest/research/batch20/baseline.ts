// RECAP BASELINE (Sean 2026-08-28, a process rule — baked into the flow, not a
// one-off): whenever a row is named in a recap — a landing, WAVE*-RECOVERY,
// THE DECISIONS, an apply recap — every episode is ONE LINE, stored first,
// then the delta:
//   ep N — stored: {canon|mixed|filler} [+ annotation kinds] → proposed: {same | new type | annotation change | no type change}
// A block of retypes is a table, never a sentence; unchanged rows in the ask
// still show the stored type once (the baseline); identity/date-only repairs
// still show the stored type. GENERATED here from the DB + the verdict so it
// cannot drift (P5). Prints one block per verdict file.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/baseline.ts <verdict.json ...>
import { readFileSync } from 'node:fs';
import { selectAll } from '../../lib/db';

const ranges = (s: string): [number, number][] => s.split(',').map((p) => p.trim()).map((p) => { const [a, b] = p.split('-').map(Number); return [a, b ?? a]; });

async function main() {
  const files = process.argv.slice(2);
  if (!files.length) { console.log('usage: baseline.ts <verdict.json ...>'); process.exit(1); }
  const { TARGETS } = await import('./context');
  for (const f of files) {
    const v = JSON.parse(readFileSync(f, 'utf8'));
    const sid: string = v.series_id;
    const wv = /-w(\d)[a-z]?\.json$/.exec(f)?.[1];
    const mine = TARGETS.filter((t) => t[0] === sid).sort((a, b) => a[4] - b[4]);
    const sameWave = wv ? mine.filter((t) => t[4] === Number(wv)) : [];
    const touched = [...(v.anchors ?? []), ...(v.anchor_hostile ?? []), ...(v.repairs ?? []), ...(v.continue_points ?? [])].map((x: any) => Number(x.episode)).concat(...[...(v.type_corrections ?? []), ...(v.annotations ?? [])].map((x: any) => (x.episodes ?? []).map(Number)));
    const inRange = (t: (typeof mine)[number]) => touched.length > 0 && touched.every((n) => ranges(t[1]).some(([a, b]) => n >= a && n <= b));
    const task = (sameWave.length > 1 ? sameWave.find(inRange) ?? sameWave[0] : sameWave[0]) ?? mine[0];
    const rows = await selectAll<any>('episodes', 'number, type', (q) => q.eq('series_id', sid).order('number'));
    const anns = await selectAll<any>('episode_annotations', 'episode, kind, chapters', (q) => q.eq('series_id', sid).order('episode'));
    const anchors = await selectAll<any>('chapter_anchors', 'episode, chapter, start_chapter', (q) => q.eq('series_id', sid).order('episode'));
    const typeOf = new Map(rows.map((r) => [r.number, r.type]));
    const annOf = new Map<number, string[]>(); for (const a of anns) { if (!annOf.has(a.episode)) annOf.set(a.episode, []); annOf.get(a.episode)!.push(`${a.kind}${a.chapters ? `{${a.chapters}}` : ''}`); }
    const ancOf = new Map(anchors.map((a) => [a.episode, `${a.chapter}${a.start_chapter != null ? ` [${a.start_chapter}]` : ''}`]));
    // the rows to name: the task's target range ∪ every row the verdict touches
    const named = new Set<number>();
    if (task) for (const [a, b] of ranges(task[1])) for (let n = a; n <= b; n++) if (typeOf.has(n)) named.add(n);
    for (const a of v.anchors ?? []) named.add(Number(a.episode));
    for (const h of v.anchor_hostile ?? []) named.add(Number(h.episode));
    for (const r of v.repairs ?? []) named.add(Number(r.episode));
    for (const c of v.continue_points ?? []) named.add(Number(c.episode));
    for (const t of v.type_corrections ?? []) for (const e of t.episodes ?? []) named.add(Number(e));
    for (const a of v.annotations ?? []) for (const e of a.episodes ?? []) named.add(Number(e));
    const newType = new Map<number, string>(); for (const t of v.type_corrections ?? []) for (const e of t.episodes ?? []) newType.set(Number(e), t.type);
    const newAnn = new Map<number, string[]>(); for (const a of v.annotations ?? []) for (const e of a.episodes ?? []) { if (!newAnn.has(Number(e))) newAnn.set(Number(e), []); newAnn.get(Number(e))!.push(`${a.kind}${a.chapters ? `{${a.chapters}}` : ''}`); }
    const newAnc = new Map<number, string>(); for (const a of v.anchors ?? []) newAnc.set(Number(a.episode), `${a.end_chapter}${a.start_chapter != null ? ` [${a.start_chapter}]` : ''}`);
    const hostile = new Set<number>((v.anchor_hostile ?? []).map((h: any) => Number(h.episode)));
    const repairs = new Map<number, string[]>(); for (const r of v.repairs ?? []) { if (!repairs.has(Number(r.episode))) repairs.set(Number(r.episode), []); repairs.get(Number(r.episode))!.push(String(r.field)); }
    console.log(`\n## ${sid} — recap baseline (${f.split('/').pop()}; ${named.size} rows named)`);
    console.log('| ep | stored | → proposed |\n|---|---|---|');
    for (const n of [...named].sort((a, b) => a - b)) {
      const stored = `${typeOf.get(n) ?? 'NO ROW'}${ancOf.has(n) ? ` · anchor ${ancOf.get(n)}` : ''}${annOf.has(n) ? ` + ${annOf.get(n)!.join(', ')}` : ''}`;
      const delta: string[] = [];
      if (newType.has(n) && newType.get(n) !== typeOf.get(n)) delta.push(`${newType.get(n)}`);
      if (newAnc.has(n)) delta.push(`anchor ${newAnc.get(n)}${ancOf.has(n) ? ` (was ${ancOf.get(n)})` : ''}`);
      if (hostile.has(n)) delta.push('anchor_hostile');
      if (newAnn.has(n)) delta.push(`+ ${newAnn.get(n)!.join(', ')}`);
      if (repairs.has(n)) delta.push(`repair ${repairs.get(n)!.join('/')}`);
      console.log(`| ${n} | ${stored} | ${delta.length ? delta.join('; ') : 'no type change'} |`);
    }
  }
  process.exit(0);
}
main();
