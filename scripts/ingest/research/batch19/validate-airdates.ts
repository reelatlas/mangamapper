// Batch-19 landing gate for lane B3 (air dates, G53): every verdict in
// out/airdates/ parses, names a series that exists, and every repair is an
// ISO air_date with old/new/why and ≥2 sources (R3); flags are strings.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/validate-airdates.ts
import { readdirSync, readFileSync } from 'node:fs';
import { selectAll } from '../../lib/db';

const OUT = new URL('./out/airdates/', import.meta.url).pathname;
const ISO = /^\d{4}-\d{2}-\d{2}$/;

async function main() {
  const series = new Set((await selectAll<{ id: string }>('series', 'id')).map((s) => s.id));
  const files = readdirSync(OUT).filter((f) => f.endsWith('.json'));
  let bad = 0, repairs = 0, flags = 0;
  for (const f of files) {
    const problems: string[] = [];
    let v: any;
    try { v = JSON.parse(readFileSync(OUT + f, 'utf8')); } catch (e) { console.log(`FAIL ${f}: does not parse — ${e}`); bad++; continue; }
    if (!v.series_id || !series.has(v.series_id)) problems.push(`series_id '${v.series_id}' unknown`);
    if ((v.anchors?.length ?? 0) || (v.continue_points?.length ?? 0) || (v.type_corrections?.length ?? 0)) problems.push('B3 verdicts carry repairs + flags only — anchors / continues / type_corrections must be empty');
    for (const r of v.repairs ?? []) {
      if (r.field !== 'air_date') problems.push(`repair ep ${r.episode}: field '${r.field}' (B3 repairs are air_date)`);
      if (r.new != null && !ISO.test(String(r.new))) problems.push(`repair ep ${r.episode}: new '${r.new}' is not YYYY-MM-DD`);
      if (!r.why || !(r.sources?.length >= 2)) problems.push(`repair ep ${r.episode}: needs why + ≥2 sources (R3)`);
      repairs++;
    }
    for (const fl of v.flags_for_sean ?? []) { if (typeof fl !== 'string') problems.push('flags_for_sean entries must be strings'); flags++; }
    if (problems.length) { bad++; console.log(`FAIL ${f}`); for (const p of problems) console.log(`   - ${p}`); }
    else console.log(`ok   ${f}: ${(v.repairs ?? []).length} repairs, ${(v.flags_for_sean ?? []).length} flags`);
  }
  console.log(`[validate-airdates] ${files.length} verdicts, ${repairs} repairs, ${flags} flags, ${bad} failing`);
  process.exit(bad ? 1 : 0);
}
main();
