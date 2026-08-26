// Re-stage every canonical series' AniList media (heads + components) after
// the GraphQL query shape changes — the G44 principle applied to AniList:
// staging must never hold output the current query would not produce. Unlike
// afg-restage this REFETCHES (the raw IS the API response); stageAniList is
// hash-gated so unchanged media cost nothing. Event healer (rosters.ts):
// trigger = any MEDIA_FIELDS change in lib/anilist.ts (T4.1 2026-08-26 added
// relation-node countryOfOrigin, which deriveSourceKind needs to tell manga
// from manhwa / manhua). Does NOT re-resolve: the healers that read staging
// (heal-source-kinds) run next.
//   npx tsx --env-file=.env.ingest scripts/ingest/anilist-restage.ts

import { db, finishRun, selectAll, startRun } from './lib/db';
import { mediaByIds } from './lib/anilist';
import { stageAniList } from './lib/resolve';

async function main() {
  const series = await selectAll<{ anilist_id: number | null }>('series', 'anilist_id');
  const comps = await selectAll<{ anilist_id: number | null }>('series_components', 'anilist_id');
  const ids = [...new Set([...series, ...comps].map((r) => r.anilist_id).filter((n): n is number => n != null))];
  const runId = await startRun('anilist');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const media = await mediaByIds(ids);
    counters.fetched = media.length;
    for (const m of media) {
      const out = await stageAniList(m);
      if (out === 'held') counters.flagged++; else counters[out]++;
    }
    console.log(`[anilist-restage] ${ids.length} ids: ${counters.fetched} fetched, ${counters.changed} restaged, ${counters.unchanged} unchanged, ${counters.flagged} held`);
    await finishRun(runId, 'ok', counters, 'anilist-restage');
  } catch (e) {
    await finishRun(runId, 'error', counters, String(e));
    throw e;
  }
  void db;
}
main().then(() => process.exit(0));
