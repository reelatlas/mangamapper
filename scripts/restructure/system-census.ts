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
//   npx tsx scripts/restructure/system-census.ts
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
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
  const files = [...readdirSync(dir).filter((f) => f.endsWith('.ts') && !['index.ts', 'types.ts'].includes(f)), ...readdirSync(join(dir, 'applied')).filter((f) => f.endsWith('.ts')).map((f) => 'applied/' + f)];
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
  const fns = ['refresh-afl', 'refresh-afg', 'refresh-anilist', 'refresh-mu'];
  const bad = fns.filter((f) => {
    const p = join(ROOT, 'supabase/functions', f, 'index.ts');
    if (!existsSync(p)) return true;
    const head = readFileSync(p, 'utf8').slice(0, 400);
    return !head.includes(`lib-hash: ${hash}`);
  });
  console.log(`  ${bad.length ? 'FAIL' : 'ok  '} edge bundles: lib-hash ${hash.slice(0, 12)}… ${bad.length ? `STALE in ${bad.join(', ')} — run build-functions + deploy all four (P3)` : 'current in all four'}`);
  if (bad.length) fails.push('edge bundles');
}

console.log(fails.length ? `[system-census] ${fails.length} check(s) FAILED: ${fails.join(', ')}` : '[system-census] OK');
process.exit(fails.length ? 1 : 0);
