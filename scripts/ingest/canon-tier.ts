// Canon-tier creation — Sean's ruling 2026-08-23: manga-sourced shows with
// no per-episode chart ANYWHERE (~0% filler, so AFL's community never built
// a page and AFG has no filler chart) still enter the catalog: AniList
// supplies structure/totals via the ownership-guarded chain walk, episode
// typing defaults to canon through the existing spans gap rule (NO episode
// rows are fabricated), AFG's continua table supplies the end-frontier
// anchor where present, and MU picks them up on its universal cycle.
// This file is the ruling record (like apply-research-batch.ts) and is
// re-runnable: existing series are skipped.
//   npx tsx --env-file=.env.ingest scripts/ingest/canon-tier.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { stageAniList, registerIds } from './lib/resolve';
import { getMedia, walkChain, aggregate, writeComponents, ownedAnilistIds } from './lib/chain';
import { applyContinua } from './lib/anchors';
import type { AfgContinua } from './lib/afg';

// Sean's Q2 ruling list (2026-08-23). aflSlug = the dead/held AFL identity
// (kept for provenance; a 0-row page refresh is a harmless no-op and
// self-heals if AFL ever restores the page). afgSlug = staged AFG page
// carrying the continua table.
const TARGETS: { anilistId: number; aflSlug?: string; afgSlug?: string }[] = [
  { anilistId: 155389, aflSlug: 'shy', afgSlug: 'shy' },
  { anilistId: 100977, aflSlug: 'cells-work' },
  { anilistId: 117533, aflSlug: 'cells-work-code-black' },
  { anilistId: 113717, aflSlug: 'ranking-kings', afgSlug: 'ousama-ranking' },
  { anilistId: 60, aflSlug: 'chrono-crusade' },
  { anilistId: 128034, aflSlug: 'orient' },
  { anilistId: 154, aflSlug: 'shaman-king' },
];

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const owned = await ownedAnilistIds();
    for (const t of TARGETS) {
      try {
        // already canonical? (any series owning this AniList id)
        const { data: has } = await db
          .from('series_external_ids')
          .select('series_id')
          .eq('source', 'anilist')
          .eq('external_id', String(t.anilistId))
          .maybeSingle();
        if (has) {
          console.log(`skip: anilist ${t.anilistId} already canonical as ${has.series_id}`);
          continue;
        }
        const start = await getMedia(t.anilistId);
        counters.fetched++;
        if (!start) throw new Error(`anilist ${t.anilistId} unavailable`);
        // full unambiguous sequel chain; branches flag rather than guess
        const { chain, ambiguity } = await walkChain(t.anilistId, Number.POSITIVE_INFINITY, owned);
        if (!chain.length || ambiguity) {
          await fileFlagOnce(runId, t.aflSlug ?? String(t.anilistId), 'resolve', 'match_ambiguous', {
            anilistId: t.anilistId,
            ambiguity: ambiguity ?? 'empty chain',
            note: 'canon-tier creation held — chain ambiguous, needs a ruling',
          });
          counters.flagged++;
          console.log(`FLAGGED ${t.anilistId}: ${ambiguity}`);
          continue;
        }
        for (const m of chain) await stageAniList(m);
        const series = aggregate(chain, t.aflSlug ?? null, start.title.english ?? start.title.romaji);
        const { error } = await db.from('series').upsert(series);
        if (error) throw new Error(`series upsert: ${error.message}`);
        await registerIds(series.id, { anilist: series.anilist_id, mal: series.mal_id, afl: t.aflSlug, afg: t.afgSlug });
        await writeComponents(series.id, chain, t.aflSlug ?? null);
        counters.changed++;
        console.log(`created ${series.id}: ${chain.length} component(s), ${series.aired_episodes} eps (canon-default typing)`);

        // continua end-frontier, when the AFG page is staged (full gates)
        if (t.afgSlug) {
          const { data: page } = await db.from('ingest_afg_pages').select('raw').eq('slug', t.afgSlug).maybeSingle();
          const continua = (page?.raw as { continua?: AfgContinua | null } | null)?.continua;
          const r = await applyContinua(runId, series.id, continua);
          console.log(`  continua: ${r}`);
        }
      } catch (e) {
        console.log(`ERROR ${t.anilistId}: ${String(e).slice(0, 120)}`);
        counters.flagged++;
      }
    }
    await finishRun(runId, 'ok', counters, `canon-tier creation (Sean ruling 2026-08-23): ${counters.changed} created`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0));
