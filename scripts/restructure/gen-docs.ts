// gen-docs — generate docs/rules.md from the ledger records (T1.2).
// The ledger (scripts/ingest/lib/ledger/*.ts) is the truth; this file is
// the human view. Never edit docs/rules.md by hand — edit the record and
// re-run. Run after ledger-check passes.
//   npx tsx scripts/restructure/gen-docs.ts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_RULES, FAMILIES } from '../ingest/lib/ledger';
import type { Family, Rule } from '../ingest/lib/ledger';

const num = (id: string) => Number(id.slice(1));
const esc = (s: string) => s.replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const enf = (r: Rule) => r.enforcement.map((e) => `[${e.path.replace(/^scripts\/ingest\//, '')}${e.symbol ? `#${e.symbol}` : ''}](../${e.path})`).join(' · ');

function main() {
  const L: string[] = [];
  L.push('# The rules ledger', '', '> GENERATED from `scripts/ingest/lib/ledger/*.ts` by `scripts/restructure/gen-docs.ts` — do not edit by hand. Edit the record, run `ledger-check`, regenerate. Rulings (per-series instances) are in `docs/rulings.md`.', '');
  L.push('## Where things go — the five kinds', '');
  L.push('| kind | what it is | home | direction of truth |', '|---|---|---|---|');
  L.push('| **Rule** | a universal predicate (A1, sliver, ownership guard) | a ledger record → lib gate → audit class → this file | ledger → code → audit (spec first; never generated from code) |');
  L.push('| **Ruling** | an instance for one series/episode/franchise | a typed map in `scripts/ingest/lib/rulings/` → `docs/rulings.md` (generated, keyed by series) | code map → generated index |');
  L.push('| **Architecture fact** | how the system is built | `docs/architecture.md` | prose |');
  L.push('| **Process** | how a session works | the skill + `docs/changelog.md`; a P-row here only where an agent must cite it | skill text |');
  L.push('| **Trap** | a source or pipeline lie | `.claude/agents/research-agent.md` / `.claude/skills/apply-batch` traps | agent/skill text |', '');
  L.push('**Capture routing:** a rule → record + gate + audit class · a source trap → research-agent · a pipeline trap → apply-batch · a ruling → the map (with reason) · a process fix → the skill + changelog.', '');

  L.push('## Family strip — one line per rule', '');
  for (const f of Object.keys(FAMILIES) as Family[]) {
    const rules = ALL_RULES.filter((r) => r.family === f).sort((x, y) => num(x.id) - num(y.id));
    L.push(`**${f} — ${FAMILIES[f]}** (${rules.length})`);
    for (const r of rules) L.push(`- \`${r.id}\` ${esc(r.title)}${r.status !== 'live' ? ` *(${r.status})*` : ''}${r.aliases?.length ? ` — aka ${r.aliases.map((a) => `\`${a}\``).join(', ')}` : ''}`);
    L.push('');
  }

  for (const f of Object.keys(FAMILIES) as Family[]) {
    const rules = ALL_RULES.filter((r) => r.family === f).sort((x, y) => num(x.id) - num(y.id));
    if (!rules.length) continue;
    L.push(`## ${f} — ${FAMILIES[f]}`, '');
    for (const r of rules) {
      L.push(`### ${r.id} · ${esc(r.title)}${r.status !== 'live' ? ` *(${r.status}${r.supersededBy ? ` → ${r.supersededBy}` : ''})*` : ''}`);
      L.push('', r.statement.trim(), '');
      if (r.why) L.push(`*Why:* ${r.why.trim()}`, '');
      const meta: string[] = [];
      meta.push(`ruled ${r.ruledBy} ${r.ruledOn}${r.origin ? ` (${esc(r.origin)})` : ''}`);
      meta.push(`layer **${r.layer}**`);
      meta.push(`enforced: ${enf(r)}`);
      meta.push(r.auditClass?.length ? `audit: ${r.auditClass.map((c) => `\`${c}\``).join(', ')}` : '**audit: none — automation backlog**');
      if (r.witnesses?.length) meta.push(`witnesses: ${r.witnesses.join(', ')}`);
      if (r.aliases?.length) meta.push(`aliases: ${r.aliases.join(', ')}`);
      if (r.see?.length) meta.push(`see: ${r.see.join(', ')}`);
      if (r.supersedes?.length) meta.push(`supersedes: ${r.supersedes.join(', ')}`);
      L.push(meta.map((m) => `- ${m}`).join('\n'), '');
    }
  }

  L.push('## Alias index', '');
  const aliases = ALL_RULES.flatMap((r) => (r.aliases ?? []).map((a) => [a, r.id] as const)).sort((x, y) => x[0].localeCompare(y[0]));
  for (const [a, id] of aliases) L.push(`- ${esc(a)} → \`${id}\``);
  L.push('');

  const live = ALL_RULES.filter((r) => r.status === 'live');
  const noAudit = live.filter((r) => r.layer !== 'process' && !r.auditClass?.length);
  L.push('## Scoreboard', '', `- rules: ${ALL_RULES.length} (live ${live.length}, planned ${ALL_RULES.filter((r) => r.status === 'planned').length}, superseded ${ALL_RULES.filter((r) => r.status === 'superseded').length})`);
  L.push(`- live data rules with no audit class (the automation backlog): ${noAudit.length}`);
  L.push(`- by layer: ${['writer', 'display', 'both', 'process'].map((l) => `${l} ${ALL_RULES.filter((r) => r.layer === l).length}`).join(' · ')}`, '');

  writeFileSync(join(process.cwd(), 'docs/rules.md'), L.join('\n'));
  console.log(`[gen-docs] docs/rules.md: ${ALL_RULES.length} rules, ${noAudit.length} without audit class`);
}
main();
