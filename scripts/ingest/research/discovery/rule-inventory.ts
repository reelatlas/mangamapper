// The related-works RULE INVENTORY — the generated half of the rule-logic evaluation Sean asked
// for (2026-09-05, §12.133): every exported mechanism of lib/related-works.ts and
// lib/related-work-ids.ts with its call sites (the gates that consume it), the ledger
// records whose enforcement names it, the unit tests that exercise it, and the census
// classes the audit emits. Generated from the code (P5) — the judgment layer sits on top of
// this table, never instead of it.
//   npx tsx scripts/ingest/research/discovery/rule-inventory.ts [--md]
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const LIB = ['scripts/ingest/lib/related-works.ts', 'scripts/ingest/lib/related-work-ids.ts'];
const walk = (dir: string, out: string[] = []): string[] => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (f === 'node_modules' || f === 'history' || f.startsWith('.')) continue;
    if (statSync(p).isDirectory()) walk(p, out); else if (p.endsWith('.ts')) out.push(p);
  }
  return out;
};
const files = walk(join(ROOT, 'scripts/ingest')).map((p) => relative(ROOT, p));
const src = new Map(files.map((f) => [f, readFileSync(join(ROOT, f), 'utf8')]));
const exportsOf = (f: string) => [...(src.get(f) ?? '').matchAll(/^export (?:const|function|type) ([A-Za-z_]+)/gm)].map((m) => m[1]);
const ledger = files.filter((f) => f.startsWith('scripts/ingest/lib/ledger/'));
const tests = files.filter((f) => f.endsWith('.test.ts'));
const word = (sym: string) => new RegExp(`\\b${sym}\\b`);

type Row = { symbol: string; home: string; homeUse: number; callSites: string[]; edge: boolean; records: string[]; tests: number; };
const rows: Row[] = [];
for (const home of LIB) for (const symbol of exportsOf(home)) {
  const re = word(symbol);
  const callSites = files.filter((f) => f !== home && !f.endsWith('.test.ts') && !f.startsWith('scripts/ingest/research/') && !f.startsWith('scripts/ingest/lib/ledger/') && re.test(src.get(f)!)).map((f) => f.replace('scripts/ingest/', ''));
  const edge = ['scripts/ingest/lib/discovery.ts'].some((f) => callSites.includes(f.replace('scripts/ingest/', ''))); // discovery.ts is bundled into refresh-discovery (P3)
  const records: string[] = [];
  for (const lf of ledger) for (const m of src.get(lf)!.matchAll(/id: '([A-Z]\d+)'[\s\S]*?(?=\n {2}\},)/g)) { const enf = /enforcement:\s*(?:'[^']*'|`[^`]*`|"[^"]*"|\[[\s\S]*?\])/.exec(m[0]); if (enf && re.test(enf[0])) records.push(m[1]); }
  const homeUse = (src.get(home)!.match(new RegExp(`\\b${symbol}\\b`, 'g')) ?? []).length - 1;
  let t = 0; for (const tf of tests) for (const line of src.get(tf)!.split('\n')) if (re.test(line)) t++;
  rows.push({ symbol, home: home.replace('scripts/ingest/lib/', ''), homeUse, callSites, edge, records: [...new Set(records)], tests: t });
}
// the census classes the discovery audit emits for related works
const audit = src.get('scripts/ingest/audit-discovery.ts') ?? '';
const classes = [...new Set([...audit.matchAll(/\b((?:related_work|extra)_[a-z_]+)\b/g)].map((m) => m[1]))].filter((c) => !c.endsWith('_'));

const md = process.argv.includes('--md');
if (md) {
  console.log('| mechanism | home | used inside home | consumed by (gates) | in an edge bundle | ledger enforcement naming it | test lines |');
  console.log('|---|---|---|---|---|---|---|');
  for (const r of rows) console.log(`| \`${r.symbol}\` | ${r.home} | ${r.homeUse} | ${r.callSites.join(', ') || (r.homeUse > 0 ? '— (internal helper)' : '— UNUSED')} | ${r.edge ? 'yes (refresh-discovery)' : 'no'} | ${r.records.join(', ') || '—'} | ${r.tests} |`);
  console.log(`\nCensus classes emitted by audit-discovery.ts for related works (${classes.length}): ${classes.join(', ')}`);
} else {
  for (const r of rows) console.log(`${r.symbol.padEnd(26)} ${r.home.padEnd(22)} home=${String(r.homeUse).padStart(2)} edge=${r.edge ? 'y' : 'n'} tests=${String(r.tests).padStart(3)} records=${r.records.join(',') || '-'} sites=${r.callSites.join(',') || '-'}`);
  console.log(`\nclasses (${classes.length}): ${classes.join(', ')}`);
}
