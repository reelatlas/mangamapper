// gen-rulings — generate docs/rulings.md from the typed ruling maps (T2.2).
// Keyed BY SERIES so "what have we ruled about X" is one hop. Never edit
// the output by hand; the maps under scripts/ingest/lib/rulings/ are the
// truth. Also verifies every ruleId resolves in the ledger (exit 1 if not).
//   npx tsx scripts/restructure/gen-rulings.ts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_RULINGS } from '../ingest/lib/rulings';
import { rule } from '../ingest/lib/ledger';
import type { RulingEntry } from '../ingest/lib/rulings/types';

const esc = (s: string) => String(s).replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const val = (v: unknown) => { const s = typeof v === 'string' ? v : JSON.stringify(v); return s.length > 160 ? s.slice(0, 157) + '…' : s; };

function main() {
  const bad: string[] = [];
  const bySeries = new Map<string, RulingEntry[]>();
  for (const r of ALL_RULINGS) {
    if (!rule(r.ruleId)) bad.push(`${r.seriesId}: ruleId '${r.ruleId}' does not resolve`);
    if (!r.reason?.trim()) bad.push(`${r.seriesId}: empty reason`);
    bySeries.set(r.seriesId, [...(bySeries.get(r.seriesId) ?? []), r]);
  }
  const unrecorded = ALL_RULINGS.filter((r) => /^UNRECORDED/.test(r.reason)).length;
  const retiring = ALL_RULINGS.filter((r) => r.retiresWhen);
  const L: string[] = [];
  L.push('# Rulings — per-series decisions, keyed by series', '', '> GENERATED from `scripts/ingest/lib/rulings/**` by `scripts/restructure/gen-rulings.ts` — do not edit by hand. A ruling is an INSTANCE of a rule (`docs/rules.md`); the map is the record, this is the index.', '');
  L.push(`- rulings: ${ALL_RULINGS.length} across ${bySeries.size} series/keys · by Sean: ${ALL_RULINGS.filter((r) => r.ruledBy === 'Sean').length} · UNRECORDED reasons: ${unrecorded} · with a retire condition: ${retiring.length}`, '');
  L.push('## Retire conditions (re-evaluate when…)', '');
  const byCond = new Map<string, string[]>();
  for (const r of retiring) byCond.set(r.retiresWhen!, [...(byCond.get(r.retiresWhen!) ?? []), `${r.seriesId} (${r.ruleId})`]);
  for (const [c, items] of [...byCond].sort()) L.push(`- **${esc(c)}** — ${items.slice(0, 12).join(', ')}${items.length > 12 ? ` (+${items.length - 12})` : ''}`);
  L.push('', '## By series', '');
  for (const [sid, items] of [...bySeries].sort((a, b) => a[0].localeCompare(b[0]))) {
    L.push(`### ${sid} (${items.length})`, '');
    L.push('| rule | value | reason | ruled | retires when |', '|---|---|---|---|---|');
    for (const r of items) {
      const rr = rule(r.ruleId);
      L.push(`| \`${r.ruleId}\`${rr && rr.id !== r.ruleId ? ` (${rr.id})` : ''} | ${esc(val(r.value))} | ${esc(r.reason)} | ${r.ruledBy} ${r.ruledOn}${r.cite?.length ? ` · ${r.cite.map(esc).join(', ')}` : ''} | ${r.retiresWhen ? esc(r.retiresWhen) : ''} |`);
    }
    L.push('');
  }
  writeFileSync(join(process.cwd(), 'docs/rulings.md'), L.join('\n'));
  for (const b of bad) console.log('  ERROR: ' + b);
  console.log(`[gen-rulings] docs/rulings.md: ${ALL_RULINGS.length} rulings, ${bySeries.size} series, ${unrecorded} UNRECORDED${bad.length ? ` — ${bad.length} error(s)` : ''}`);
  process.exit(bad.length ? 1 : 0);
}
main();
