// system-census — invariant 3 applied to the reference system itself (T2.7,
// rule P33). Runs standalone (`npm run system:census`) and as consolidate
// step 0. Red = blocking during the restructure phase. Checks:
//   1. ledger-check --citations    (ids, aliases, enforcement paths, audit classes, citations)
//   2. unpaged-selects             (P32 — no unbounded catalog read)
//   3. one-hop-check               (the success test, mechanical layer)
//   4. rosters: every scripts/ingest/*.ts is on a roster, lib-support, or in history/; nothing in history/ is rostered
//   5. rulings index: every file under lib/rulings/ (except index/types) is imported by index.ts
//   6. generated docs are not stale: gen-docs + gen-rulings reproduce docs/rules.md and docs/rulings.md byte-for-byte
//   7. edge bundles carry the CURRENT lib hash (T2.6 — a lib change without a rebuild is drift)
//   8. component writers: series_components is written only by chain.ts / resolve.ts, both via planComponents (I39 / P2)
//   npx tsx scripts/restructure/system-census.ts
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { ROSTERED, LIB_SUPPORT } from '../ingest/rosters';
import { libHash } from '../ingest/lib-hash';

const ROOT = process.cwd();
const fails: string[] = [];
const run = (label: string, args: string[]) => {
  const r = spawnSync('npx', ['tsx', ...args], { cwd: ROOT, encoding: 'utf8' });
  const last = (r.stdout + r.stderr).trim().split('\n').slice(-1)[0];
  console.log(`  ${r.status === 0 ? 'ok  ' : 'FAIL'} ${label}: ${last}`);
  if (r.status !== 0) fails.push(label);
};

console.log('[system-census]');
run('ledger-check', ['scripts/restructure/ledger-check.ts', '--citations']);
run('unpaged-selects', ['scripts/restructure/unpaged-selects.ts']);
run('one-hop-check', ['scripts/restructure/one-hop-check.ts']);

// 4. rosters
{
  const dir = join(ROOT, 'scripts/ingest');
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts'));
  const unlisted = files.filter((f) => !ROSTERED.has(f) && !LIB_SUPPORT.includes(f));
  const hist = existsSync(join(dir, 'history')) ? readdirSync(join(dir, 'history')).filter((f) => f.endsWith('.ts')) : [];
  const rosteredHistory = hist.filter((f) => ROSTERED.has(f));
  const missing = [...ROSTERED].filter((f) => !existsSync(join(dir, f)));
  const msg = `${files.length} scripts, ${unlisted.length} unlisted${unlisted.length ? ` (${unlisted.join(', ')})` : ''}, ${rosteredHistory.length} history files still rostered, ${missing.length} rostered files missing${missing.length ? ` (${missing.join(', ')})` : ''}`;
  const ok = !unlisted.length && !rosteredHistory.length && !missing.length;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} rosters: ${msg}`);
  if (!ok) fails.push('rosters');
}

// 5. rulings index completeness
{
  const dir = join(ROOT, 'scripts/ingest/lib/rulings');
  const files = [...readdirSync(dir).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts') && !['index.ts', 'types.ts'].includes(f)), ...readdirSync(join(dir, 'applied')).filter((f) => f.endsWith('.ts')).map((f) => 'applied/' + f)];
  const index = readFileSync(join(dir, 'index.ts'), 'utf8');
  const notImported = files.filter((f) => !index.includes(`'./${f.replace(/\.ts$/, '')}'`));
  console.log(`  ${notImported.length ? 'FAIL' : 'ok  '} rulings index: ${files.length} files, ${notImported.length} not imported${notImported.length ? ` (${notImported.join(', ')})` : ''}`);
  if (notImported.length) fails.push('rulings index');
}

// 6. generated docs not stale
for (const [label, script, out] of [['rules.md', 'scripts/restructure/gen-docs.ts', 'docs/rules.md'], ['rulings.md', 'scripts/restructure/gen-rulings.ts', 'docs/rulings.md']] as const) {
  const before = readFileSync(join(ROOT, out), 'utf8');
  const r = spawnSync('npx', ['tsx', script], { cwd: ROOT, encoding: 'utf8' });
  const after = readFileSync(join(ROOT, out), 'utf8');
  const stale = before !== after;
  console.log(`  ${stale || r.status !== 0 ? 'FAIL' : 'ok  '} generated ${label}: ${stale ? 'was STALE — regenerated; commit it' : 'current'}${r.status !== 0 ? ' (generator failed)' : ''}`);
  if (stale || r.status !== 0) fails.push(`generated ${label}`);
}

// 7. edge bundles carry the current lib hash (T2.6)
{
  const hash = libHash();
  const fns = readdirSync(join(ROOT, 'supabase/functions/_src')).filter((f) => f.endsWith('.ts')).map((f) => f.replace(/\.ts$/, '')); // P3: every bundle, derived — never a magic four
  const bad = fns.filter((f) => {
    const p = join(ROOT, 'supabase/functions', f, 'index.ts');
    if (!existsSync(p)) return true;
    const head = readFileSync(p, 'utf8').slice(0, 400);
    return !head.includes(`lib-hash: ${hash}`);
  });
  console.log(`  ${bad.length ? 'FAIL' : 'ok  '} edge bundles: lib-hash ${hash.slice(0, 12)}… ${bad.length ? `STALE in ${bad.join(', ')} — run build-functions + deploy every bundle (P3)` : 'current in every bundle'}`);
  if (bad.length) fails.push('edge bundles');
}

// 8. component writers (I39 / P2): series_components spans are laid out by ONE
// planner. Every insert/upsert/update on the table outside lib/chain.ts
// (writeComponents) and lib/resolve.ts (the baseline row) is drift, and both
// callers must actually call planComponents — the 2026-09-02 catch was a
// raw AniList count written at the resolve call site (outlaw-star 1-24 ≠
// ruled 1-26 on every AniList refresh). history/ and research/ are skipped.
{
  const ALLOWED = new Set(['scripts/ingest/lib/chain.ts', 'scripts/ingest/lib/resolve.ts']);
  const files: string[] = [];
  const walk = (p: string) => { for (const f of readdirSync(p)) { const full = join(p, f); if (statSync(full).isDirectory()) { if (!/node_modules|history|research|fixtures/.test(f)) walk(full); } else if (full.endsWith('.ts') && !full.endsWith('.test.ts')) files.push(full); } };
  walk(join(ROOT, 'scripts/ingest')); walk(join(ROOT, 'supabase/functions/_src'));
  const bad: string[] = [];
  for (const f of files) {
    const rel = f.replace(ROOT + '/', '');
    const src = readFileSync(f, 'utf8');
    const writes = [...src.matchAll(/from\(\s*['"`]series_components['"`]\s*\)\s*\.(insert|upsert|update)\(/g)];
    if (!writes.length) continue;
    if (!ALLOWED.has(rel)) bad.push(`${rel} (${writes.length} write${writes.length > 1 ? 's' : ''} outside the planner's callers)`);
    else if (!/planComponents\(/.test(src)) bad.push(`${rel} writes series_components without calling planComponents`);
  }
  console.log(`  ${bad.length ? 'FAIL' : 'ok  '} component writers: ${bad.length ? bad.join('; ') : 'only chain.ts + resolve.ts write series_components, both through planComponents (I39/P2)'}`);
  if (bad.length) fails.push('component writers');
}

console.log(fails.length ? `[system-census] ${fails.length} check(s) FAILED: ${fails.join(', ')}` : '[system-census] OK');
process.exit(fails.length ? 1 : 0);
