// Daily AniList refresh (edge runner — bundled from scripts/ingest/lib by
// scripts/ingest/build-functions.ts; the libs are the single source of truth).
// G58 (2026-09-03; amended 2026-09-06 — the airing writer fix): the loop itself is
// lib/anilist-refresh.ts#refreshAniList — one loop, two callers. This runner gives it the
// edge budgets (RESOLVE_BUDGET series, TIME_BUDGET_MS inside the wall clock); the local
// form (scripts/ingest/refresh-anilist.ts) runs the same function without them — the
// catch-up after a restage or a query-shape change. The change decision compares the
// fresh structural hash with the hash each series was last RESOLVED from
// (resolved_hash), never with staging; the queue runs airing / upcoming series first,
// then the oldest resolve; every payload is staged every run; what the budget could not
// resolve stays in debt (anilist_resolve_debt) and leads the next run; the run row is
// always closed.
//   invoke: select public.invoke_edge_refresh('refresh-anilist')  (pg_cron, 08:10 UTC)
//   a manual call may pass { "resolveBudget": N } (the time budget never exceeds the wall clock)

import { refreshAniList } from '../../../scripts/ingest/lib/anilist-refresh';

declare const Deno: {
  env: { get(k: string): string | undefined };
  serve(handler: (req: Request) => Promise<Response>): void;
};

const RESOLVE_BUDGET = 40; // series re-resolved per invocation (a normal day changes a handful; a mass edit on AniList is spread over days)
const TIME_BUDGET_MS = 110_000; // resolves stop here so staging + the run close inside the edge wall clock

Deno.serve(async (req: Request) => {
  const secret = Deno.env.get('CRON_SECRET');
  if (secret && req.headers.get('x-cron-secret') !== secret) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  }
  const body: { resolveBudget?: number; timeBudgetMs?: number } = await req.json().catch(() => ({}));
  const resolveBudget = Number(body?.resolveBudget) > 0 ? Number(body.resolveBudget) : RESOLVE_BUDGET;
  const timeBudgetMs = Math.min(Number(body?.timeBudgetMs) > 0 ? Number(body.timeBudgetMs) : TIME_BUDGET_MS, TIME_BUDGET_MS);
  try {
    const result = await refreshAniList({ resolveBudget, timeBudgetMs });
    return new Response(JSON.stringify({ ok: true, ...result }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err).slice(0, 300) }), { headers: { 'Content-Type': 'application/json' } });
  }
});
