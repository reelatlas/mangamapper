// run-roster — run a roster's STANDARD entries in order (T2.4). Event
// entries are listed, never run here.
//   npx tsx --env-file=.env.ingest scripts/ingest/run-roster.ts heal|census|pull [--dry-run] [--list]
// Every step must exit 0; the first failure stops the run (a healer that
// half-ran is worse than one that did not run — P32).
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { PULL, HEAL, CENSUS, type RosterEntry } from './rosters';

const which = process.argv[2];
const roster: Record<string, RosterEntry[]> = { pull: PULL, heal: HEAL, census: CENSUS };
if (!roster[which]) { console.error('usage: run-roster.ts heal|census|pull [--dry-run] [--list]'); process.exit(2); }
const flags = process.argv.slice(3);
const list = flags.includes('--list');
const dry = flags.includes('--dry-run');

for (const e of roster[which]) {
  if (e.when === 'event') { if (list) console.log(`  (event) ${e.file} — ${e.trigger}`); continue; }
  const args = [...(e.args ?? []), ...(dry && !e.args?.includes('--dry-run') ? ['--dry-run'] : [])];
  console.log(`\n== ${which}: ${e.file} ${args.join(' ')}  — ${e.note}`);
  if (list) continue;
  const r = spawnSync('npx', ['tsx', '--env-file=.env.ingest', join('scripts/ingest', e.file), ...args], { stdio: 'inherit' });
  if (r.status !== 0) { console.error(`\n[run-roster] ${e.file} exited ${r.status} — stopping (P32)`); process.exit(r.status ?? 1); }
}
console.log(`\n[run-roster] ${which}: done`);
