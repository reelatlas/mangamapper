// one-hop-check — the success test of the restructure phase, made mechanical
// (T1.6). For every case in docs/restructure/one-hop-cases.json: each expected
// id resolves to a LIVE or PLANNED rule (never superseded, never missing), and
// each of the case's key terms appears in at least one expected rule's title /
// aliases / statement — i.e. the family strip and alias index can carry a cold
// reader from the ask to the id. The cold-session probe (a different model
// asked the same asks) is the second layer; this is the first.
//   npx tsx scripts/restructure/one-hop-check.ts

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { rule } from '../ingest/lib/ledger';

type Case = { ask: string; expected: string[]; terms: string[]; source: string };
const { cases } = JSON.parse(readFileSync(join(process.cwd(), 'docs/restructure/one-hop-cases.json'), 'utf8')) as { cases: Case[] };

let fails = 0;
for (const c of cases) {
  const problems: string[] = [];
  const texts: string[] = [];
  for (const id of c.expected) {
    const r = rule(id);
    if (!r) { problems.push(`${id} missing`); continue; }
    if (r.status === 'superseded') problems.push(`${id} is superseded → ${r.supersededBy}`);
    texts.push([r.title, ...(r.aliases ?? []), r.statement].join(' ').toLowerCase());
  }
  for (const t of c.terms) if (!texts.some((x) => x.includes(t.toLowerCase()))) problems.push(`term '${t}' not findable in ${c.expected.join('/')}`);
  if (problems.length) { fails++; console.log(`FAIL  ${c.ask.slice(0, 90)}\n      ${problems.join('; ')}`); }
  else console.log(`ok    ${c.expected.join(',').padEnd(14)} ${c.ask.slice(0, 80)}`);
}
console.log(fails ? `[one-hop-check] ${fails}/${cases.length} cases FAIL` : `[one-hop-check] ${cases.length}/${cases.length} cases pass`);
process.exit(fails ? 1 : 0);
