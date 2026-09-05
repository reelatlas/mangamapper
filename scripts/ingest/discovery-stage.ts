// discovery-stage — STAGE THE HALO (I42; PULL roster, event: before a
// /discover sitting, or when discovery_new_since_sitting lists unstaged
// candidates). Every unowned TV-shaped story relation of an owned AniList
// entry is fetched and staged in ingest_anilist_media (G51: greedy staging —
// the full media, so the sitting's signals read a different manga, the
// english title, dates and status), and SEQUEL chains are walked
// transitively through what was just staged (S2 staged → S3 found → staged),
// up to ROUNDS rounds under a per-run BUDGET (G58: a deferral is data — an
// unstaged candidate leads the next run). Extras (MOVIE / OVA / SPECIAL) and
// noise (CHARACTER / MUSIC) are listed from edge data alone and are never
// staged here. Writes STAGING ONLY — never a series, never a component: the
// mint is an event step from /discover after the dry-run recap.
//   npx tsx --env-file=.env.ingest scripts/ingest/discovery-stage.ts [--dry-run] [--budget N]
import { db, finishRun, startRun } from './lib/db';
import { mediaByIds } from './lib/anilist';
import { stageAniList } from './lib/resolve';
import { haloCandidates, loadDiscoveryInput, type MediaLike } from './lib/discovery';

const DRY = process.argv.includes('--dry-run');
const budgetArg = process.argv.indexOf('--budget');
const BUDGET = budgetArg > 0 ? Number(process.argv[budgetArg + 1]) : 250;
const ROUNDS = 3;

async function main() {
  const runId = await startRun('anilist');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const input = await loadDiscoveryInput();
    let staged = 0;
    let deferred = 0;
    for (let round = 1; round <= ROUNDS; round++) {
      const cands = haloCandidates(input);
      const want = cands.filter((c) => !c.staged && (c.bucket === 'sequel' || c.bucket === 'series')).sort((a, b) => b.popularity - a.popularity);
      if (!want.length) { console.log(`[discovery-stage] round ${round}: nothing unstaged — the halo is staged`); break; }
      const take = want.slice(0, Math.max(0, BUDGET - staged));
      deferred = want.length - take.length;
      console.log(`[discovery-stage] round ${round}: ${want.length} TV-shaped candidates unstaged, staging ${take.length}${deferred ? ` (${deferred} deferred to the next run — budget ${BUDGET})` : ''}${DRY ? ' — DRY RUN' : ''}`);
      for (const c of take.slice(0, 12)) console.log(`   ${[...c.owners].join(',')}: anilist ${c.anilistId} ${c.title} [${c.format ?? '?'} ${c.status ?? '?'}] pop ${c.popularity} ← ${[...c.relations].join('/')}${c.hop > 1 ? ` (hop ${c.hop})` : ''}`);
      if (take.length > 12) console.log(`   …+${take.length - 12} more`);
      if (DRY || !take.length) break;
      const media = await mediaByIds(take.map((c) => c.anilistId));
      counters.fetched += media.length;
      for (const m of media) {
        const r = await stageAniList(m);
        if (r === 'unchanged') counters.unchanged++; else counters.changed++;
        input.staged.set(m.id, m as unknown as MediaLike);
        input.changedAt.set(m.id, new Date().toISOString());
        staged++;
      }
      const missing = take.filter((c) => !media.some((m) => m.id === c.anilistId));
      if (missing.length) { counters.flagged += missing.length; console.log(`   ${missing.length} not returned by AniList: ${missing.map((c) => c.anilistId).join(', ')}`); }
      if (staged >= BUDGET) { console.log(`[discovery-stage] budget ${BUDGET} reached — the rest leads the next run`); break; }
    }
    const after = haloCandidates(input);
    const tv = after.filter((c) => c.bucket === 'sequel' || c.bucket === 'series');
    console.log(`[discovery-stage] ${staged} staged this run · TV-shaped candidates ${tv.length} (${tv.filter((c) => c.staged).length} staged, ${tv.filter((c) => !c.staged).length} not) · extras ${after.filter((c) => c.bucket === 'extra').length} · ignored ${after.filter((c) => c.bucket === 'ignored').length}`);
    await finishRun(runId, 'ok', counters, `discovery-stage: ${staged} candidate media staged, ${deferred} deferred${DRY ? ' (dry run)' : ''}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
