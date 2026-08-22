// ⚠️ DANGER POST-STITCHING: this re-resolves every series as SINGLE-SEASON,
// clobbering stitched aggregates and components. Only for canonical-shape
// migrations — and ALWAYS re-run stitch.ts (and scopes-apply.ts) afterwards.
//
// Rebuild canonical from staging (no network): wipe series (episodes /
// components / relations cascade) and re-resolve every active, matched slug.
//   npx tsx --env-file=.env.ingest scripts/ingest/rebuild.ts

import { db, startRun, finishRun } from './lib/db';
import { resolveSeries } from './lib/resolve';

async function main() {
  const runId = await startRun('resolve');
  const errors: string[] = [];
  let resolved = 0;
  let held = 0;

  try {
    const { error: wipeErr } = await db.from('series').delete().neq('id', '');
    if (wipeErr) throw new Error(`wipe: ${wipeErr.message}`);

    const { data: maps } = await db
      .from('source_map')
      .select('afl_slug, anilist_id')
      .eq('disposition', 'active')
      .not('anilist_id', 'is', null);
    const { data: staged } = await db.from('ingest_afl_shows').select('slug');
    const stagedSet = new Set((staged ?? []).map((s) => s.slug));

    for (const m of maps ?? []) {
      if (!stagedSet.has(m.afl_slug)) continue;
      try {
        const r = await resolveSeries(runId, m.afl_slug);
        if (r.episodes > 0) resolved++;
        else held++;
      } catch (err) {
        errors.push(`${m.afl_slug}: ${err}`);
      }
    }

    await finishRun(
      runId,
      'ok',
      { fetched: 0, unchanged: 0, changed: resolved, flagged: held },
      `rebuild: ${resolved} resolved, ${held} held, ${errors.length} errors`,
    );

    const { count: seriesCount } = await db.from('series').select('*', { count: 'exact', head: true });
    const { count: epCount } = await db.from('episodes').select('*', { count: 'exact', head: true });
    const { count: compCount } = await db.from('series_components').select('*', { count: 'exact', head: true });
    console.log('=== REBUILD COMPLETE ===');
    console.log(`series: ${seriesCount} · episodes: ${epCount} · components: ${compCount} · held(empty): ${held}`);
    console.log(`errors (${errors.length}):`, errors.slice(0, 20));
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: resolved, flagged: held }, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
