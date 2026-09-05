// seed — THE SEED WRITER's script (G52 / I42; HEAL roster, EVENT: run ONLY from
// /discover after the dry-run recap has been seen — never from `npm run heal`).
// Every `series` ruling in lib/rulings/discovery.ts whose AniList id no series
// owns is planned (the walk, the slug, the manga pick — lib/seed.ts#planSeed)
// and printed; without --dry-run each clean plan is written (lib/seed.ts#
// seedSeries): the series row (STAGED), the identity registration, the
// components. Rows come next from the wiki writer; relations from relations.ts.
//   npx tsx --env-file=.env.ingest scripts/ingest/seed.ts [--dry-run]
import { finishRun, startRun } from './lib/db';
import { planAllSeeds, seedLine, seedSeries } from './lib/seed';

const DRY = process.argv.includes('--dry-run');

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const plans = await planAllSeeds();
    console.log(`[seed] ${plans.length} \`series\` ruling(s)${DRY ? ' — DRY RUN' : ''}`);
    for (const p of plans) {
      console.log(`  ${seedLine(p)}`);
      if (p.owner) { counters.unchanged++; continue; }
      if (p.held) { counters.flagged++; continue; }
      if (DRY) continue;
      const r = await seedSeries(p);
      if (r === 'created') { counters.changed++; console.log(`  created ${p.slug}: ${p.chain.length} component(s), ${p.airedEpisodes} eps, staged`); }
    }
    await finishRun(runId, 'ok', counters, `seed: ${counters.changed} created, ${counters.flagged} held, ${counters.unchanged} already owned${DRY ? ' (dry run)' : ''}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
