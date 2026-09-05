// discovery-stage — STAGE THE HALO (I42; PULL roster, event: before a
// /discover sitting, or when discovery_new_since_sitting lists unstaged
// candidates) and, with --rankings, SNAPSHOT THE RANKED LISTS (G60). Both are
// lib functions the weekly refresh-discovery bundle runs on its cron; this is
// their local, on-demand form. Writes STAGING ONLY — never a series, never a
// component: the mint is an event step from /discover after the dry-run recap.
//   npx tsx --env-file=.env.ingest scripts/ingest/discovery-stage.ts [--dry-run] [--budget N] [--rankings]
import { finishRun, startRun } from './lib/db';
import { stageHalo } from './lib/discovery';
import { snapshotRankings } from './lib/rankings';

const DRY = process.argv.includes('--dry-run');
const budgetArg = process.argv.indexOf('--budget');
const BUDGET = budgetArg > 0 ? Number(process.argv[budgetArg + 1]) : 250;
const RANKINGS = process.argv.includes('--rankings');

async function main() {
  const runId = await startRun('anilist');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const h = await stageHalo({ budget: BUDGET, dryRun: DRY, log: console.log });
    counters.fetched += h.requests; counters.changed += h.staged; counters.flagged += h.missing.length;
    if (h.missing.length) console.log(`   ${h.missing.length} not returned by AniList: ${h.missing.join(', ')}`);
    console.log(`[discovery-stage] ${h.staged} staged this run · TV-shaped candidates ${h.tv} (${h.tvStaged} staged, ${h.tv - h.tvStaged} not) · extras ${h.extras} · ignored ${h.ignored}`);
    let note = `discovery-stage: ${h.staged} candidate media staged, ${h.deferred} deferred${DRY ? ' (dry run)' : ''}`;
    if (RANKINGS && !DRY) {
      const r = await snapshotRankings({ sleepMs: 2100 });
      counters.fetched += r.requests; counters.changed += r.rows;
      console.log(`[discovery-stage] rankings: ${r.lists} lists, ${r.rows} rows, ${r.requests} requests${r.deferred.length ? `; deferred ${r.deferred.join(', ')}` : ''} (G60)`);
      note += `; rankings ${r.lists} lists / ${r.rows} rows`;
    }
    await finishRun(runId, 'ok', counters, note);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
