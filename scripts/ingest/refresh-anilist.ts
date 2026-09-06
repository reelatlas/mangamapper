// THE LOCAL ANILIST REFRESH (G58 amended 2026-09-06 — the airing writer fix). The same
// lib loop the daily edge runs (lib/anilist-refresh.ts#refreshAniList), without the edge
// budgets: the catch-up after anilist-restage.ts (which leaves a resolve debt by design),
// after any MEDIA_FIELDS change, or when anilist_resolve_debt lists series. --all resolves
// EVERY series with inputs once — the flush for the drift a hash cannot see (a row behind
// staging after a restage: one-piece 1175 vs 1177, 2026-09-06). PULL roster, event.
//   npx tsx --env-file=.env.ingest scripts/ingest/refresh-anilist.ts [--dry-run] [--all] [--budget N]
import { refreshAniList } from './lib/anilist-refresh';

const DRY = process.argv.includes('--dry-run');
const ALL = process.argv.includes('--all');
const b = process.argv.indexOf('--budget');
const BUDGET = b > 0 ? Number(process.argv[b + 1]) : undefined;

refreshAniList({ dryRun: DRY, all: ALL, resolveBudget: BUDGET, log: console.log })
  .then((r) => { console.log(`[refresh-anilist] fetched ${r.fetched} · staged ${r.changed} changed / ${r.unchanged} unchanged · queued ${r.queued} (${r.airing} airing) · resolved ${r.resolved} · deferred ${r.deferred.length} · errors ${r.errors.length} · ${Math.round(r.ms / 1000)} s`); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
