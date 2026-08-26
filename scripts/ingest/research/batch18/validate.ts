// Batch-18 landing gate (P13 steps 1-2, R25): every verdict in out/ parses,
// names its series, covers each TARGET row exactly once with a standing in
// the vocabulary, gives every adopted annotation a basis, never writes the
// retired type, and its summary does not contradict its own rows.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch18/validate.ts
import { readdirSync, readFileSync } from 'node:fs';
import { ANNOTATION_KINDS, ADOPTED_BASES } from '../../lib/annotations';
import { TARGETS, targetRows } from './context';

const OUT = new URL('./out/', import.meta.url).pathname;
const STANDINGS = new Set(['canon', 'mixed', 'filler']);

async function main() {
  const files = readdirSync(OUT).filter((f) => f.endsWith('.json'));
  let bad = 0;
  for (const f of files) {
    const problems: string[] = [];
    let v: any;
    try { v = JSON.parse(readFileSync(OUT + f, 'utf8')); } catch (e) { console.log(`FAIL ${f}: does not parse — ${e}`); bad++; continue; }
    if (!v.series_id) problems.push('no series_id');
    // which task is this file? (boruto A/B split by suffix)
    const suffix = f.replace(/\.json$/, '').replace(v.series_id ?? '', '');
    const tasks = TARGETS.filter((t) => t[0] === v.series_id);
    const task = tasks.length > 1 ? tasks.find((t) => (suffix === '-A' ? t[1].startsWith('2-') : t[1].startsWith('120-'))) : tasks[0];
    if (!task) { console.log(`FAIL ${f}: no TARGETS entry for ${v.series_id}`); bad++; continue; }
    const expected = await targetRows(task[0], task[1], task[2]);
    const seen = new Map<number, number>();
    for (const st of v.standings ?? []) {
      if (!STANDINGS.has(st.type)) problems.push(`standing type '${st.type}' not in canon|mixed|filler (eps ${st.episodes})`);
      if (!Array.isArray(st.episodes)) problems.push(`standings.episodes must be a LIST (got ${JSON.stringify(st.episodes)})`);
      if (!(st.sources?.length >= 1)) problems.push(`standing eps ${st.episodes} has no sources`);
      for (const ep of st.episodes ?? []) seen.set(ep, (seen.get(ep) ?? 0) + 1);
    }
    const missing = expected.filter((n) => !seen.has(n));
    const dup = [...seen].filter(([, c]) => c > 1).map(([n]) => n);
    const extra = [...seen.keys()].filter((n) => !expected.includes(n));
    if (missing.length) problems.push(`${missing.length} target rows without a standing: ${missing.slice(0, 15).join(',')}${missing.length > 15 ? '…' : ''}`);
    if (dup.length) problems.push(`rows in more than one standing: ${dup.join(',')}`);
    if (extra.length) problems.push(`standings on non-target rows (allowed only as repairs): ${extra.slice(0, 15).join(',')}`);
    for (const a of v.annotations ?? []) {
      if (!(ANNOTATION_KINDS as readonly string[]).includes(a.kind)) problems.push(`annotation kind '${a.kind}' not in vocabulary`);
      if (a.kind === 'adopted' && !(ADOPTED_BASES as readonly string[]).includes(a.basis)) problems.push(`adopted eps ${a.episodes} without a valid basis (got ${a.basis})`);
      if (!Array.isArray(a.episodes)) problems.push(`annotations.episodes must be a LIST`);
    }
    const raw = readFileSync(OUT + f, 'utf8');
    if (/anime-only-canon|anime_only_canon|"anime canon"/i.test(raw.replace(/AFL[^"]*anime canon/gi, ''))) problems.push("mentions the retired type 'anime-only-canon' outside an AFL quote — check it is not used as a value");
    // summary vs rows (R25): a summary that says "all filler" while rows say canon, or vice versa
    const types = new Set((v.standings ?? []).map((s: any) => s.type));
    const sum = String(v.summary ?? '').toLowerCase();
    if (/\ball (of it |of them |rows |episodes )?(are |is )?filler\b/.test(sum) && (types.has('canon') || types.has('mixed'))) problems.push('summary says all filler but rows carry canon/mixed');
    if (/\ball (of it |rows |episodes )?(are |is )?canon\b/.test(sum) && types.has('filler')) problems.push('summary says all canon but rows carry filler');
    const adoptedRows = (v.annotations ?? []).filter((a: any) => a.kind === 'adopted').flatMap((a: any) => a.episodes ?? []);
    const fillerRows = new Set((v.standings ?? []).filter((s: any) => s.type === 'filler').flatMap((s: any) => s.episodes ?? []));
    const contradictory = adoptedRows.filter((n: number) => fillerRows.has(n));
    if (contradictory.length) problems.push(`adopted annotation on rows the verdict types filler: ${contradictory.join(',')}`);
    const n = (v.standings ?? []).reduce((s: number, x: any) => s + (x.episodes?.length ?? 0), 0);
    if (problems.length) { bad++; console.log(`FAIL ${f} (${n} rows over ${expected.length} targets)`); for (const p of problems) console.log(`   - ${p}`); }
    else console.log(`ok   ${f}: ${expected.length} targets, standings ${[...types].join('/')}, ${(v.annotations ?? []).length} annotations, ${(v.repairs ?? []).length} repairs, ${(v.flags_for_sean ?? []).length} flags`);
  }
  console.log(`[validate] ${files.length} verdicts, ${bad} failing`);
  process.exit(bad ? 1 : 0);
}
main();
