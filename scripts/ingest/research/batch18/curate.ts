// Batch-18 curation helper (apply-batch step 2, P10): a verdict never writes
// rows — Sean's rulings become RulingEntry records in the standing maps
// (lib/rulings/episode-types.ts = T6 types, lib/rulings/standing-annotations.ts
// = T26 annotations, lib/rulings/air-dates.ts = G53), then `npm run heal`
// asserts them. This prints the TS blocks for ONE verdict so the curated
// entry carries the verdict's reason + cites verbatim; the session edits
// what Sean changed and pastes. Nothing is written.
//   npx tsx scripts/ingest/research/batch18/curate.ts scripts/ingest/research/batch18/out/<file>.json [--only 1,2,3] [--drop 4-5]
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const file = process.argv[2];
if (!file) { console.error('usage: curate.ts <verdict.json> [--only eps] [--drop eps]'); process.exit(1); }
const v = JSON.parse(readFileSync(resolve(process.cwd(), file), 'utf8'));
const arg = (flag: string) => (process.argv.includes(flag) ? process.argv[process.argv.indexOf(flag) + 1] : undefined);
const parse = (s?: string) => new Set((s ?? '').split(',').filter(Boolean).flatMap((p) => { const [a, b] = p.split('-').map(Number); return b ? Array.from({ length: b - a + 1 }, (_, i) => a + i) : [a]; }));
const only = parse(arg('--only'));
const drop = parse(arg('--drop'));
const keep = (n: number) => (!only.size || only.has(n)) && !drop.has(n);
const q = (s: string) => JSON.stringify(String(s));
const today = '2026-08-26';
const cite = (arr: string[] = []) => `[${[...new Set([`scripts/ingest/research/batch18/out/${file.split('/').pop()}`, ...arr])].map(q).join(', ')}]`;

// T6 — one entry per series; value = every judged row (the map is the ruling of record)
const types: Record<number, string> = {};
const reasons: string[] = [];
for (const st of v.standings ?? []) {
  const eps = (st.episodes as number[]).filter(keep);
  if (!eps.length) continue;
  for (const e of eps) types[e] = st.type;
  reasons.push(`${eps.length > 6 ? `${eps[0]}-${eps[eps.length - 1]} (${eps.length})` : eps.join(',')} → ${st.type}: ${st.note}`);
}
if (Object.keys(types).length) {
  console.log(`// ---- lib/rulings/episode-types.ts (T6) — ${v.series_id}\n  {\n    seriesId: '${v.series_id}',\n    ruleId: 'T6',\n    value: ${JSON.stringify(types)},\n    reason:\n      ${q(`Batch 18 standing verdict (${today}), verified R24, Sean ruled: ${reasons.join(' · ')}`)},\n    ruledBy: 'Sean',\n    ruledOn: '${today}',\n    cite: ${cite((v.standings ?? []).flatMap((s: any) => s.sources ?? []).slice(0, 6))},\n  },`);
}
// T26 — annotations
const ann = (v.annotations ?? []).map((a: any) => ({ ...a, episodes: (a.episodes as number[]).filter(keep) })).filter((a: any) => a.episodes.length);
if (ann.length) {
  const vals = ann.map((a: any) => `      { episodes: [${a.episodes.join(', ')}], kind: '${a.kind}'${a.basis ? `, basis: '${a.basis}'` : ''}${a.chapters ? `, chapters: ${q(a.chapters)}` : ''}, note: ${q(a.note)} },`).join('\n');
  console.log(`// ---- lib/rulings/standing-annotations.ts (T26) — ${v.series_id}\n  {\n    seriesId: '${v.series_id}',\n    ruleId: 'T26',\n    value: [\n${vals}\n    ],\n    reason: ${q(`Batch 18 (${today}), verified R24, Sean ruled: ${v.summary}`)},\n    ruledBy: 'Sean',\n    ruledOn: '${today}',\n    cite: ${cite(ann.flatMap((a: any) => a.sources ?? []).slice(0, 6))},\n  },`);
}
// G53 — air-date repairs
const dates = (v.repairs ?? []).filter((r: any) => r.field === 'air_date' && keep(r.episode));
if (dates.length) {
  console.log(`// ---- lib/rulings/air-dates.ts (G53) — ${v.series_id}\n  {\n    seriesId: '${v.series_id}',\n    ruleId: 'G53',\n    value: ${JSON.stringify(Object.fromEntries(dates.map((r: any) => [r.episode, r.new])))},\n    reason: ${q(dates.map((r: any) => `ep ${r.episode} ${r.old} → ${r.new}: ${r.why}`).join(' · '))},\n    ruledBy: 'Sean',\n    ruledOn: '${today}',\n    cite: ${cite(dates.flatMap((r: any) => r.sources ?? []))},\n  },`);
}
// other repairs (types on non-target rows, anchors) — reported, never auto-curated
const other = (v.repairs ?? []).filter((r: any) => r.field !== 'air_date');
if (other.length) console.log(`// ---- REPORTED repairs (curate by hand if Sean approves):\n${other.map((r: any) => `//   ep ${r.episode} ${r.field}: ${r.old} → ${r.new} — ${r.why}`).join('\n')}`);
if ((v.flags_for_sean ?? []).length) console.log(`// ---- flags_for_sean (${v.flags_for_sean.length}):\n${v.flags_for_sean.map((f: string) => `//   ${String(f).slice(0, 300)}`).join('\n')}`);
