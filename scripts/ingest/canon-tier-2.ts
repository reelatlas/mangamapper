// Canon-tier round 2 — Sean's sign-off 2026-08-23 ("apply all B"): the
// researched sparse-AFL shows. Kinnikuman maps cleanly (hard cutoff ep 119
// → continue ch 274; eps 120-137 anime-original); City Hunter and Elemental
// Gelade enter as LOOSE adaptations carrying the info we do know
// (continue-from waypoints, divergence annotations) — richer representation
// comes with the loose-adaptation UI pass. Shonan Junai Gumi follows after
// its endpoint spot-check. Re-runnable; existing series skipped.
//   npx tsx --env-file=.env.ingest scripts/ingest/canon-tier-2.ts

import { db, startRun, finishRun } from './lib/db';
import { stageAniList, registerIds } from './lib/resolve';
import { getMedia, aggregate, writeComponents } from './lib/chain';

const now = () => new Date().toISOString();

async function exists(anilistId: number): Promise<string | null> {
  const { data } = await db.from('series_external_ids').select('series_id').eq('source', 'anilist').eq('external_id', String(anilistId)).maybeSingle();
  return data?.series_id ?? null;
}

// single-entry creation: these shows' sequels are SEPARATE series by
// research (Kinnikuman → Scramble for the Throne; City Hunter 2/3/'91)
async function createSingle(anilistId: number): Promise<string> {
  const media = await getMedia(anilistId);
  if (!media) throw new Error(`anilist ${anilistId} unavailable`);
  await stageAniList(media);
  const series = aggregate([media], null, media.title.english ?? media.title.romaji);
  const { error } = await db.from('series').upsert(series);
  if (error) throw new Error(error.message);
  await registerIds(series.id, { anilist: series.anilist_id, mal: series.mal_id });
  await writeComponents(series.id, [media], null);
  console.log(`created ${series.id}: ${series.aired_episodes} eps`);
  return series.id;
}

async function main() {
  const runId = await startRun('resolve');
  try {
    // ── Kinnikuman (1983, 137 eps): faithful arc-by-arc through ep 119 ──
    if (!(await exists(3272))) {
      const id = await createSingle(3272);
      // explicit type rows: 1-119 canon (arc-level faithful), 120-137
      // anime-original tail (titles land via the title initiative)
      const rows = [];
      for (let n = 1; n <= 137; n++) {
        rows.push({ series_id: id, number: n, title: '', type: n <= 119 ? 'canon' : 'anime-only-canon', air_date: null });
      }
      for (let i = 0; i < rows.length; i += 500) {
        const { error } = await db.from('episodes').insert(rows.slice(i, i + 500));
        if (error) throw new Error(error.message);
      }
      await db.from('chapter_anchors').upsert({
        series_id: id, episode: 119, chapter: 273, volume: null, source: 'manual',
        note: 'research-tier (Sean sign-off 2026-08-23): manga coverage ends ep 119, continue at ch 274 (Throne arc = the separate Scramble for the Throne anime); interleaved filler exists but no community per-episode list — arc-level accuracy. wheredoestheanimeleaveoff.com + kinnikuman.fandom.com + Wikipedia',
      });
      await db.from('series').update({ continue_from_chapter: 274, updated_at: now() }).eq('id', id);
    } else console.log('kinnikuman exists — skip');

    // ── City Hunter (1987, 51 eps): loose — heavy filler + skips/reorders ─
    if (!(await exists(1470))) {
      const id = await createSingle(1470);
      await db.from('series').update({ mapping_mode: 'loose', continue_from_chapter: 63, updated_at: now() }).eq('id', id);
      console.log(`  ${id}: loose; continue vol 15 ch 63 (season waypoint — wheredoestheanimeleaveoff.com + Wikipedia chapter list)`);
    } else console.log('city-hunter exists — skip');

    // ── Elemental Gelade (2005, 26 eps): alternate-story adaptation ─────
    if (!(await exists(1250))) {
      const id = await createSingle(1250);
      await db.from('series').update({ mapping_mode: 'loose', continue_from_chapter: 1, updated_at: now() }).eq('id', id);
      await db.from('episode_annotations').upsert({
        series_id: id, episode: 12, kind: 'divergence', chapters: null,
        note: 'fully diverges from ep 12: anime-original Chaos Choir story and original ending (manga was ongoing) — read the manga from vol 1 as a separate telling. elementalgelade.fandom.com + TVTropes + Wikipedia',
      });
    } else console.log('elemental-gelade exists — skip');

    await finishRun(runId, 'ok', { fetched: 3, unchanged: 0, changed: 3, flagged: 0 }, 'canon-tier 2 (Sean sign-off): kinnikuman mapped, city-hunter + elemental-gelade loose');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
