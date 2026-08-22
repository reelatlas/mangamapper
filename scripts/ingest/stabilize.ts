// Post-recovery stabilization (2026-08-22): sparse-page holds, per-season
// duplicate pages, and the School Days / School Rumble disentanglement.
//   npx tsx --env-file=.env.ingest scripts/ingest/stabilize.ts

import { db, startRun, finishRun } from './lib/db';
import { mediaByIds } from './lib/anilist';
import { stageAniList, resolveSeries } from './lib/resolve';

// AFL never fully classified these (Kinnikuman 4/137...). The resolver's new
// sparse guard keeps them out until classification reaches 60% — these rows
// were published before the guard existed.
const SPARSE_HOLD = ['kakegurui', 'city-hunter', 'elemental-gelade', 'kinnikuman', 'ranking-kings', 'mobile-suit-zeta-gundam', 'mobile-suit-gundam-zz', 'digimon-adventure-02'];

// Per-season pages that duplicate content already inside a stitched series.
const DUPLICATE_OF: Record<string, string> = {
  'food-wars-second-plate-1': 'food-wars',
  'food-wars-third-plate-1': 'food-wars',
  'food-wars-fourth-plate': 'food-wars',
  'food-wars-fifth-plate': 'food-wars',
  'nekomonogatari-kuro': 'monogatari-series',
};

async function main() {
  const runId = await startRun('resolve');
  const actions: string[] = [];
  try {
    for (const slug of SPARSE_HOLD) {
      const { data } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
      if (data) {
        await db.from('series').delete().eq('id', data.id);
        actions.push(`sparse-held (removed from canonical): ${slug}`);
      }
      await db.from('source_map').update({ note: 'AFL classification sparse — held by resolver guard, auto-returns at 60% coverage', updated_at: new Date().toISOString() }).eq('afl_slug', slug);
    }

    for (const [slug, primary] of Object.entries(DUPLICATE_OF)) {
      const { data } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
      if (data) await db.from('series').delete().eq('id', data.id);
      await db.from('source_map').update({ disposition: 'duplicate', note: `per-season page duplicating content inside "${primary}"`, updated_at: new Date().toISOString() }).eq('afl_slug', slug);
      await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString() }).eq('series_key', slug).eq('status', 'open');
      actions.push(`duplicate of ${primary}: ${slug}`);
    }

    // School Days / School Rumble disentanglement: the corrupt-era alias got
    // School Days matched to School Rumble; the recovery then overwrote the
    // stitched School Rumble's episodes with School Days rows. School Rumble
    // has no readable AFL source left; School Days re-resolves correctly.
    const { data: sr } = await db.from('series').select('id').eq('afl_slug', 'school-days').maybeSingle();
    if (sr) {
      await db.from('series').delete().eq('id', sr.id);
      actions.push(`removed ${sr.id} (School Rumble shell holding School Days rows)`);
    }
    await db.from('source_map').update({ anilist_id: 2476, match_method: 'manual', confidence: 1, verified: true, disposition: 'active', note: 'School Days (TV) — slug was alias-crossed with School Rumble; School Rumble itself has no readable AFL page (data-pipeline.md §9)', updated_at: new Date().toISOString() }).eq('afl_slug', 'school-days');
    const [m] = await mediaByIds([2476]);
    if (m) {
      await stageAniList(m);
      const r = await resolveSeries(runId, 'school-days');
      actions.push(`school-days re-resolved: ${r.episodes} eps`);
    }

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'stabilize');
    for (const a of actions) console.log('  -', a);
    const { count } = await db.from('series').select('*', { count: 'exact', head: true });
    const { count: eps } = await db.from('episodes').select('*', { count: 'exact', head: true });
    const { data: flags } = await db.from('ingest_flags').select('kind').eq('status', 'open');
    const byKind: Record<string, number> = {};
    for (const f of flags ?? []) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
    console.log(`canonical: ${count} series, ${eps} episodes · open flags:`, byKind);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
