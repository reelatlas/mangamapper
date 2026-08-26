// T0.2 — merge the eight per-home extracts (docs/restructure/t0/*.json) into
// one inventory. MECHANICAL joins only: same alias, same enforcement site,
// same audit class, or a strong key-term overlap across DIFFERENT homes. The
// output is a working document — the drift/duplicate READING is done on the
// grouped view, not by this script.
//   npx tsx scripts/restructure/t0-merge.ts            → writes docs/restructure/inventory.md + inventory.json
//   npx tsx scripts/restructure/t0-merge.ts --validate → shape check only

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type Kind = 'rule' | 'ruling' | 'architecture' | 'process' | 'trap' | 'audit-class';
type Entry = {
  kind: Kind; statement: string; alias: string | null; family_candidate: string | null;
  where: { file: string; loc: string }[]; enforcement_site: string | null; enforcement_layer: string;
  audit_class: string | null; witnesses: string[]; bundle: boolean; bundle_parts?: string[];
  ruled_by: string | null; ruled_on: string | null; status_hint: string; notes: string;
  home: string; idx: number;
};
type Extract = { home: string; read: string[]; entries: Entry[]; standing_maps?: unknown[]; scripts?: unknown[] };

const DIR = join(process.cwd(), 'docs/restructure/t0');
const KINDS = new Set<Kind>(['rule', 'ruling', 'architecture', 'process', 'trap', 'audit-class']);
const STOP = new Set('the a an of on in to and or is are be never always every any this that for with by as at from into not no its our their it if when where which than then else only one two must should may can will does do rule rules ruling sean series episode episodes chapter chapters manga anime data row rows value values source sources'.split(' '));

const terms = (s: string): Set<string> =>
  new Set(s.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w)));
const jaccard = (a: Set<string>, b: Set<string>): number => {
  let i = 0; for (const t of a) if (b.has(t)) i++;
  return i / (a.size + b.size - i || 1);
};
const normAlias = (a: string | null): string | null => (a ? a.toLowerCase().replace(/[^a-z0-9]/g, '') : null);

function load(): Extract[] {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.json'));
  const out: Extract[] = [];
  for (const f of files) {
    const x = JSON.parse(readFileSync(join(DIR, f), 'utf8')) as Extract;
    const problems: string[] = [];
    if (!x.home) problems.push('missing home');
    if (!Array.isArray(x.entries)) problems.push('entries not an array');
    x.entries?.forEach((e, i) => {
      if (!KINDS.has(e.kind)) problems.push(`#${i} bad kind ${e.kind}`);
      if (!e.statement) problems.push(`#${i} empty statement`);
      if (!Array.isArray(e.where) || !e.where.length) problems.push(`#${i} no where`);
      e.home = x.home; e.idx = i;
      e.witnesses ??= []; e.bundle ??= false; e.notes ??= '';
    });
    console.log(`${f}: ${x.entries?.length ?? 0} entries, ${x.standing_maps?.length ?? 0} maps, ${x.scripts?.length ?? 0} scripts${problems.length ? ` — PROBLEMS: ${problems.slice(0, 5).join('; ')}${problems.length > 5 ? ` (+${problems.length - 5})` : ''}` : ''}`);
    out.push(x);
  }
  return out;
}

// Union-find over entries; join reasons recorded per group.
function group(all: Entry[]) {
  const parent = all.map((_, i) => i);
  const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const reasons = new Map<string, string[]>();
  const union = (a: number, b: number, why: string) => {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[rb] = ra;
    const key = String(Math.min(a, b)) + ':' + String(Math.max(a, b));
    reasons.set(key, [...(reasons.get(key) ?? []), why]);
  };
  const byAlias = new Map<string, number[]>(), bySite = new Map<string, number[]>(), byAudit = new Map<string, number[]>();
  all.forEach((e, i) => {
    if (e.kind === 'ruling') return; // rulings group by series, below
    const a = normAlias(e.alias); if (a) byAlias.set(a, [...(byAlias.get(a) ?? []), i]);
    if (e.enforcement_site) bySite.set(e.enforcement_site.toLowerCase(), [...(bySite.get(e.enforcement_site.toLowerCase()) ?? []), i]);
    if (e.audit_class) byAudit.set(e.audit_class.toLowerCase(), [...(byAudit.get(e.audit_class.toLowerCase()) ?? []), i]);
  });
  for (const [k, ids] of byAlias) for (let j = 1; j < ids.length; j++) union(ids[0], ids[j], `alias ${k}`);
  for (const [k, ids] of bySite) for (let j = 1; j < ids.length; j++) union(ids[0], ids[j], `site ${k}`);
  for (const [k, ids] of byAudit) for (let j = 1; j < ids.length; j++) union(ids[0], ids[j], `audit ${k}`);
  // key-term overlap across DIFFERENT homes only (same-home near-duplicates are the reader's grain choice)
  const T = all.map((e) => terms(e.statement + ' ' + (e.alias ?? '')));
  for (let i = 0; i < all.length; i++) {
    if (all[i].kind === 'ruling') continue;
    for (let j = i + 1; j < all.length; j++) {
      if (all[j].kind === 'ruling' || all[i].home === all[j].home) continue;
      const s = jaccard(T[i], T[j]);
      if (s >= 0.45) union(i, j, `terms ${s.toFixed(2)}`);
    }
  }
  const groups = new Map<number, number[]>();
  all.forEach((_, i) => { const r = find(i); groups.set(r, [...(groups.get(r) ?? []), i]); });
  return { groups: [...groups.values()], reasons };
}

function main() {
  const extracts = load();
  if (process.argv.includes('--validate')) return;
  const all = extracts.flatMap((x) => x.entries);
  const { groups, reasons } = group(all);
  const multiHome = groups.filter((g) => new Set(g.map((i) => all[i].home)).size > 1);
  const single = groups.filter((g) => g.length === 1);

  const kinds: Record<string, number> = {};
  for (const e of all) kinds[e.kind] = (kinds[e.kind] ?? 0) + 1;
  const bundles = all.filter((e) => e.bundle).length;
  const rulesNoAudit = all.filter((e) => e.kind === 'rule' && !e.audit_class).length;
  const rulesNoSite = all.filter((e) => e.kind === 'rule' && !e.enforcement_site).length;

  const lines: string[] = [];
  lines.push('# T0 inventory (generated by scripts/restructure/t0-merge.ts — working document, not the ledger)', '');
  lines.push(`Extracts: ${extracts.map((x) => `${x.home} (${x.entries.length})`).join(' · ')}`);
  lines.push(`Entries: ${all.length} — ${Object.entries(kinds).map(([k, n]) => `${k} ${n}`).join(' · ')}`);
  lines.push(`Bundles flagged: ${bundles} · rules with no audit class named: ${rulesNoAudit} · rules with no enforcement site named: ${rulesNoSite}`);
  lines.push(`Groups: ${groups.length} (${multiHome.length} span ≥2 homes = duplicate/drift candidates; ${single.length} singletons)`, '');

  lines.push('## A. Multi-home groups — read each for DRIFT (same rule, different statement) vs pure duplicate', '');
  multiHome.sort((a, b) => b.length - a.length).forEach((g, n) => {
    const homes = [...new Set(g.map((i) => all[i].home))].join(', ');
    const alias = [...new Set(g.map((i) => all[i].alias).filter(Boolean))].join(' / ');
    lines.push(`### G${n + 1} — ${alias || '(no alias)'} — homes: ${homes}`);
    for (const i of g) {
      const e = all[i];
      lines.push(`- **[${e.home}#${e.idx}] ${e.kind}${e.bundle ? ' BUNDLE' : ''}** ${e.statement}`);
      lines.push(`  where: ${e.where.map((w) => `${w.file} @ ${w.loc}`).join('; ')}${e.enforcement_site ? ` · site: ${e.enforcement_site}` : ''}${e.audit_class ? ` · audit: ${e.audit_class}` : ''}${e.status_hint && e.status_hint !== 'live' ? ` · status: ${e.status_hint}` : ''}`);
      if (e.notes) lines.push(`  notes: ${e.notes}`);
    }
    const why = new Set<string>();
    for (const [k, r] of reasons) { const [a, b] = k.split(':').map(Number); if (g.includes(a) && g.includes(b)) r.forEach((x) => why.add(x)); }
    lines.push(`  joined by: ${[...why].join('; ')}`, '');
  });

  lines.push('## B. Single-home entries by kind (candidates that live in ONE place today)', '');
  for (const kind of ['rule', 'audit-class', 'process', 'trap', 'architecture'] as Kind[]) {
    const items = single.map((g) => all[g[0]]).filter((e) => e.kind === kind);
    if (!items.length) continue;
    lines.push(`### ${kind} (${items.length})`);
    for (const e of items) lines.push(`- [${e.home}#${e.idx}]${e.alias ? ` **${e.alias}**` : ''}${e.bundle ? ' BUNDLE' : ''} ${e.statement} — ${e.where.map((w) => `${w.file} @ ${w.loc}`).join('; ')}${e.enforcement_site ? ` · site: ${e.enforcement_site}` : ''}${e.audit_class ? ` · audit: ${e.audit_class}` : ''}${e.status_hint && e.status_hint !== 'live' ? ` · ${e.status_hint}` : ''}`);
    lines.push('');
  }

  lines.push('## C. Rulings by series', '');
  const bySeries = new Map<string, Entry[]>();
  for (const e of all.filter((e) => e.kind === 'ruling')) {
    const sid = e.witnesses[0] ?? (e.statement.match(/^([a-z0-9-]+)[:\s]/)?.[1] ?? '(unkeyed)');
    bySeries.set(sid, [...(bySeries.get(sid) ?? []), e]);
  }
  for (const [sid, items] of [...bySeries].sort()) {
    lines.push(`- **${sid}** (${items.length}): ${items.map((e) => `[${e.home}#${e.idx}] ${e.statement.slice(0, 140)}${e.ruled_by === 'Sean' ? ' (Sean)' : ''}`).join(' | ')}`);
  }
  lines.push('');

  lines.push('## D. Standing maps (all homes)', '');
  for (const x of extracts) for (const m of (x.standing_maps ?? []) as Record<string, unknown>[]) lines.push(`- ${m.file}#${m.symbol} — ${m.entries} entries, reasons: ${m.has_reason_per_entry} — ${m.note ?? ''}`);
  lines.push('');
  lines.push('## E. Script triage', '');
  const classes: Record<string, string[]> = {};
  for (const x of extracts) for (const s of (x.scripts ?? []) as Record<string, string>[]) (classes[s.class] ??= []).push(`${s.file} (${s.last_touched}) — ${s.evidence}`);
  for (const [c, files] of Object.entries(classes)) { lines.push(`### ${c} (${files.length})`); files.sort().forEach((f) => lines.push(`- ${f}`)); lines.push(''); }

  writeFileSync(join(process.cwd(), 'docs/restructure/inventory.md'), lines.join('\n'));
  writeFileSync(join(process.cwd(), 'docs/restructure/inventory.json'), JSON.stringify({ entries: all, groups }, null, 1));
  console.log(`inventory: ${all.length} entries, ${groups.length} groups (${multiHome.length} multi-home) → docs/restructure/inventory.md`);
}
main();
