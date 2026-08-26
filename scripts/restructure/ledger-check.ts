// ledger-check — referential integrity of the rules ledger (T1.2 / T2.7).
// Refuses: bad id format, duplicate ids, aliases that collide with ids or
// each other, family letter ≠ id, enforcement paths that do not exist,
// symbols not found in their file, audit classes that no audit computes,
// dead ids in supersedes/supersededBy/see, superseded rules without a
// successor. `--citations` additionally scans skills/agents/PROTOCOLs/lib
// for id-shaped tokens and reports any that do not resolve.
//   npx tsx scripts/restructure/ledger-check.ts [--citations]
// Exit 1 on any error. This is a GATE during the restructure phase.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ALL_RULES, FAMILIES, isRuleId, rule } from '../ingest/lib/ledger';
import type { Rule } from '../ingest/lib/ledger';

const ROOT = process.cwd();
const errors: string[] = [];
const warns: string[] = [];

// ---- the set of audit classes that actually exist
function auditClasses(): Set<string> {
  const set = new Set<string>();
  for (const f of ['scripts/ingest/audit-ui-truth.ts', 'scripts/ingest/audit-manga-coverage.ts']) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/classes\.([a-z_]+)/g)) set.add(m[1]);
    // object-literal keys of the `classes` map (some are only reached via classes[`mu_${result}`])
    const lit = src.match(/const classes[^=]*=\s*\{([\s\S]*?)\n\s*\};/);
    if (lit) for (const m of lit[1].matchAll(/^\s*([a-z_]+):/gm)) set.add(m[1]);
  }
  // audit-afg-structure reports by named arrays → afg:<snake_case>
  const afg = readFileSync(join(ROOT, 'scripts/ingest/audit-afg-structure.ts'), 'utf8');
  for (const m of afg.matchAll(/const (\w+): string\[\] = \[\]/g)) set.add('afg:' + m[1].replace(/[A-Z]/g, (c) => '_' + c.toLowerCase()));
  // report sections / verdict kinds of the other census tools (named, not keyed)
  for (const c of ['afg:aligned', 'afg:conflict', 'afg:registry_gap', 'afg:needs_ruling', 'verify:fail', 'verify:hole', 'verify:regression', 'titles:corrupt', 'titles:excluded']) set.add(c);
  return set;
}

function checkRules() {
  const ids = new Map<string, Rule>();
  const aliasOwner = new Map<string, string>();
  const classes = auditClasses();
  for (const r of ALL_RULES) {
    if (!isRuleId(r.id)) errors.push(`${r.id}: bad id format`);
    if (ids.has(r.id)) errors.push(`${r.id}: duplicate id`);
    ids.set(r.id, r);
    if (r.id[0] !== r.family) errors.push(`${r.id}: family '${r.family}' ≠ id letter`);
    if (!r.title || r.title.length > 60) errors.push(`${r.id}: title missing or > 60 chars`);
    if (!r.statement?.trim()) errors.push(`${r.id}: empty statement`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(r.ruledOn)) errors.push(`${r.id}: ruledOn '${r.ruledOn}' is not YYYY-MM-DD`);
    if (!r.enforcement?.length) errors.push(`${r.id}: no enforcement entry (use the skill/agent path for process rules)`);
    for (const e of r.enforcement ?? []) {
      const p = join(ROOT, e.path);
      if (!existsSync(p)) { errors.push(`${r.id}: enforcement path missing: ${e.path}`); continue; }
      if (e.symbol && statSync(p).isFile()) {
        const src = readFileSync(p, 'utf8');
        if (!src.includes(e.symbol)) errors.push(`${r.id}: symbol '${e.symbol}' not found in ${e.path}`);
      }
    }
    for (const c of r.auditClass ?? []) if (!classes.has(c)) errors.push(`${r.id}: audit class '${c}' does not exist`);
    if (r.status === 'superseded' && !r.supersededBy) errors.push(`${r.id}: superseded without supersededBy`);
    if (r.status !== 'superseded' && r.supersededBy) errors.push(`${r.id}: supersededBy set but status is '${r.status}'`);
  }
  for (const r of ALL_RULES) {
    for (const a of r.aliases ?? []) {
      const key = a.toLowerCase();
      if (isRuleId(a) && ids.has(a) && ids.get(a)!.id !== r.id) errors.push(`${r.id}: alias '${a}' collides with rule id ${a}`);
      if (aliasOwner.has(key) && aliasOwner.get(key) !== r.id) errors.push(`${r.id}: alias '${a}' also claimed by ${aliasOwner.get(key)}`);
      aliasOwner.set(key, r.id);
    }
    for (const ref of [...(r.supersedes ?? []), ...(r.see ?? []), ...(r.supersededBy ? [r.supersededBy] : [])]) {
      if (!rule(ref)) errors.push(`${r.id}: reference '${ref}' does not resolve to an id or alias`);
    }
  }
  return { ids, classes };
}

// ---- citations: id-shaped tokens in the places that cite rules
function checkCitations(ids: Map<string, Rule>) {
  // docs/restructure* are excluded: their T0–T5 track ids are phase-temporary, not rule citations.
  const roots = ['.claude', 'CLAUDE.md', 'scripts/ingest/lib', 'scripts/ingest/research'];
  const files: string[] = [];
  const walk = (p: string) => {
    const full = join(ROOT, p);
    if (!existsSync(full)) return;
    if (statSync(full).isDirectory()) { for (const f of readdirSync(full)) if (!f.startsWith('.') || p === '.claude') walk(join(p, f)); }
    else if (/\.(md|ts)$/.test(p) && !/\/out2?\//.test(p) && !p.includes('lib/ledger/') && !p.startsWith('docs/restructure')) files.push(p);
  };
  roots.forEach(walk);
  const seen = new Map<string, Set<string>>();
  for (const f of files) {
    const src = readFileSync(join(ROOT, f), 'utf8');
    // cite shape: standalone A1 / C3 / N12 / P7 — word-bounded, not part of a wider identifier
    for (const m of src.matchAll(/(?<![\w/-])([ACTNIGVRP]\d{1,3})(?![\w-])/g)) {
      const id = m[1];
      if (!ids.has(id) && !rule(id)) { if (!seen.has(id)) seen.set(id, new Set()); seen.get(id)!.add(f); }
    }
  }
  for (const [id, fs] of [...seen].sort()) warns.push(`unresolved citation ${id} in ${[...fs].slice(0, 4).join(', ')}${fs.size > 4 ? ` (+${fs.size - 4})` : ''}`);
}

function main() {
  const { ids } = checkRules();
  if (process.argv.includes('--citations')) checkCitations(ids);
  const perFamily: Record<string, { n: number; noAudit: number; planned: number; superseded: number }> = {};
  for (const r of ALL_RULES) {
    const f = (perFamily[r.family] ??= { n: 0, noAudit: 0, planned: 0, superseded: 0 });
    f.n++; if (!r.auditClass?.length && r.status === 'live' && r.layer !== 'process') f.noAudit++;
    if (r.status === 'planned') f.planned++; if (r.status === 'superseded') f.superseded++;
  }
  console.log('[ledger-check]');
  for (const [k, name] of Object.entries(FAMILIES)) {
    const f = perFamily[k] ?? { n: 0, noAudit: 0, planned: 0, superseded: 0 };
    console.log(`  ${k}  ${name.padEnd(36)} ${String(f.n).padStart(3)} rules · ${f.noAudit} live data rules without audit class · ${f.planned} planned · ${f.superseded} superseded`);
  }
  console.log(`  total ${ALL_RULES.length} rules`);
  for (const w of warns) console.log(`  warn: ${w}`);
  for (const e of errors) console.log(`  ERROR: ${e}`);
  console.log(errors.length ? `[ledger-check] ${errors.length} error(s)` : '[ledger-check] OK');
  process.exit(errors.length ? 1 : 0);
}
main();
