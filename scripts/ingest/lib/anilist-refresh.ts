// THE ANILIST REFRESH LOOP (G58 amended 2026-09-06 — the airing writer fix, Sean with
// Cursor). One loop, two callers (P2 / P3): the edge (supabase/functions/_src/
// refresh-anilist.ts) runs it under its budgets; scripts/ingest/refresh-anilist.ts runs
// it locally without them (the catch-up after a restage or a query-shape change).
//
// The change decision compares each RESOLVE INPUT's fresh structural hash with the hash
// its series was last RESOLVED from (ingest_anilist_media.resolved_hash — stamped only
// by the resolvers, lib/resolve.ts#stampResolved), never with staging's own hash: before
// this a restage (which refetches + stages without resolving) swallowed every change made
// between a series' last resolve and the restage (one-piece: row aired 1175 / next
// 2026-08-30 while staging said ep 1177 on 2026-09-06). Every fetched payload is staged
// every run (the raw refreshes for readers of staging); what the budget could not resolve
// stays in debt — anilist_resolve_debt lists it past a day — and leads the next run.
// The queue is AIRING / UPCOMING first, then the oldest resolve first (resolved_at —
// never series.updated_at, which the healers bump every day, so airing series sorted
// as fresh and went last).
import type { AniListMedia } from './anilist';
// db / anilist / resolve are imported lazily inside refreshAniList: the predicates above the loop are pure and unit-tested without a DB (the side-source.ts pattern)

export type SeriesRef = { id: string; aflSlug: string | null; headId: number | null; comps: { anilistId: number; ranged: boolean }[] };
/** what the series row is DERIVED from and by which resolver — exactly what lib/resolve.ts reads (P2) */
export type ResolveInput = { seriesId: string; aflSlug: string | null; inputs: number[]; mode: 'afl' | 'volatile' | 'none' };

/**
 * The media a series row is derived from: an AFL-slug series with at most one ranged
 * component reads its HEAD (resolveSeries); a stitched series, or a seeded series with no
 * AFL page, reads its RANGED components (refreshStitchedVolatile — order-only components
 * never feed aired / totals). A series with nothing to read is 'none' (no debt possible).
 */
export function resolveInputsOf(s: SeriesRef): ResolveInput {
  const ranged = s.comps.filter((c) => c.ranged).map((c) => c.anilistId);
  if (s.aflSlug && ranged.length <= 1) return s.headId != null ? { seriesId: s.id, aflSlug: s.aflSlug, inputs: [s.headId], mode: 'afl' } : { seriesId: s.id, aflSlug: s.aflSlug, inputs: [], mode: 'none' };
  return { seriesId: s.id, aflSlug: s.aflSlug, inputs: ranged, mode: ranged.length ? 'volatile' : 'none' };
}

export type QueueItem = { seriesId: string; airing: boolean; resolvedAt: string | null };
/** airing / upcoming series first, then the oldest resolve first (a never-resolved series is oldest), then the id — never series.updated_at */
export const resolveOrder = (items: QueueItem[]): QueueItem[] =>
  [...items].sort((a, b) => Number(b.airing) - Number(a.airing) || (a.resolvedAt ?? '').localeCompare(b.resolvedAt ?? '') || a.seriesId.localeCompare(b.seriesId));

export type DebtRow = { anilistId: number; contentHash: string | null; resolvedHash: string | null; changedAt: string | null };
export const DEBT_GRACE_MS = 24 * 3600 * 1000;
/** a resolve input whose staged structure is not what its series was last resolved from, older than the daily run's reach (one day) — the census's violation */
export const resolveDebt = (rows: DebtRow[], now: Date, graceMs = DEBT_GRACE_MS): DebtRow[] =>
  rows.filter((r) => r.contentHash !== r.resolvedHash && (r.changedAt == null || now.getTime() - new Date(r.changedAt).getTime() > graceMs));

export type RefreshOpts = {
  /** series resolved per run (the edge: 40); undefined = no cap (the local catch-up) */
  resolveBudget?: number;
  /** wall-clock allowance for the resolves (the edge: 110 s); undefined = none */
  timeBudgetMs?: number;
  /** resolve EVERY series with inputs regardless of the hash — the catch-up that flushes the drift a hash cannot see */
  all?: boolean;
  /** decide and print, write nothing (no staging, no resolve) */
  dryRun?: boolean;
  log?: (line: string) => void;
};
export type RefreshResult = { fetched: number; unchanged: number; changed: number; queued: number; airing: number; resolved: number; deferred: string[]; errors: string[]; note: string; ms: number };

export async function refreshAniList(opts: RefreshOpts = {}): Promise<RefreshResult> {
  const t0 = Date.now();
  const log = opts.log ?? (() => {});
  const { finishRun, selectAll, startRun } = await import('./db');
  const { mediaByIds } = await import('./anilist');
  const { aniListHash, refreshStitchedVolatile, resolveSeries, stageAniList } = await import('./resolve');
  const runId = opts.dryRun ? 0 : await startRun('anilist');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    // 1. the catalog's AniList ids and each series' resolve inputs
    const comps = await selectAll<{ series_id: string; anilist_id: number; episode_start: number | null }>('series_components', 'series_id, anilist_id, episode_start');
    const series = await selectAll<{ id: string; afl_slug: string | null; anilist_id: number | null }>('series', 'id, afl_slug, anilist_id');
    const compsBy = new Map<string, { anilistId: number; ranged: boolean }[]>();
    for (const c of comps) compsBy.set(c.series_id, [...(compsBy.get(c.series_id) ?? []), { anilistId: c.anilist_id, ranged: c.episode_start != null }]);
    const refs: SeriesRef[] = series.map((s) => ({ id: s.id, aflSlug: s.afl_slug, headId: s.anilist_id, comps: compsBy.get(s.id) ?? [] }));
    const inputs = new Map(refs.map((r) => [r.id, resolveInputsOf(r)]));
    const allIds = [...new Set(refs.flatMap((r) => [r.headId, ...r.comps.map((c) => c.anilistId)]).filter((x): x is number => x != null))];
    // 2. fetch everything, decide before writing anything: fresh structural hash vs the hash each series was last RESOLVED from
    const media = await mediaByIds(allIds);
    counters.fetched = media.length;
    const fresh = new Map<number, AniListMedia>(media.map((m) => [m.id, m]));
    const stamps = new Map((await selectAll<{ anilist_id: number; resolved_hash: string | null; resolved_at: string | null }>('ingest_anilist_media', 'anilist_id, resolved_hash, resolved_at')).map((r) => [r.anilist_id, r]));
    const items: QueueItem[] = [];
    for (const [sid, inp] of inputs) {
      if (inp.mode === 'none') continue;
      const ms = inp.inputs.map((id) => fresh.get(id)).filter((m): m is AniListMedia => m != null);
      if (!ms.length) continue; // AniList returned none of the inputs — nothing to decide (the missing-media count is in the note)
      if (!opts.all && !ms.some((m) => aniListHash(m) !== (stamps.get(m.id)?.resolved_hash ?? null))) continue;
      const airing = ms.some((m) => m.status === 'RELEASING' || m.status === 'NOT_YET_RELEASED');
      const resolvedAt = inp.inputs.map((id) => stamps.get(id)?.resolved_at ?? null).sort((a, b) => (a ?? '').localeCompare(b ?? ''))[0] ?? null;
      items.push({ seriesId: sid, airing, resolvedAt });
    }
    const queue = resolveOrder(items);
    const missing = allIds.length - media.length;
    log(`[refresh-anilist] ${media.length} media fetched${missing ? ` (${missing} not returned)` : ''} · ${queue.length} series to resolve (${queue.filter((q) => q.airing).length} airing / upcoming first)${opts.all ? ' — ALL (the catch-up)' : ''}${opts.dryRun ? ' — DRY RUN' : ''}`);
    // 3. stage every fetched payload (raw + hash refresh for readers of staging; the decision above never read it)
    if (!opts.dryRun) for (const m of media) { const o = await stageAniList(m); if (o === 'changed') counters.changed++; else counters.unchanged++; }
    // 4. resolve in order under the budgets; a deferred series stays in debt and leads the next run
    const deferred: string[] = []; const errors: string[] = []; let resolved = 0;
    for (const q of queue) {
      if ((opts.resolveBudget != null && resolved >= opts.resolveBudget) || (opts.timeBudgetMs != null && Date.now() - t0 > opts.timeBudgetMs)) { deferred.push(q.seriesId); continue; }
      const inp = inputs.get(q.seriesId)!;
      if (opts.dryRun) { log(`  would resolve ${q.seriesId} [${inp.mode}${q.airing ? ', airing' : ''}; last ${q.resolvedAt ?? 'never'}]`); resolved++; continue; }
      try {
        if (inp.mode === 'afl') await resolveSeries(runId, inp.aflSlug!);
        else await refreshStitchedVolatile(q.seriesId);
        resolved++;
      } catch (e) { errors.push(`${q.seriesId}: ${String(e).slice(0, 100)}`); }
    }
    const note = `${opts.dryRun ? 'dry run' : 'anilist refresh'} (G58): ${resolved} series re-resolved of ${queue.length} in debt (${queue.filter((q) => q.airing).length} airing first)${deferred.length ? `; ${deferred.length} DEFERRED to the next run (budget ${opts.resolveBudget ?? '∞'} / ${opts.timeBudgetMs ?? '∞'} ms)` : ''}${errors.length ? `; ${errors.length} error(s): ${errors.slice(0, 3).join(' | ')}` : ''}`;
    if (!opts.dryRun) await finishRun(runId, 'ok', counters, note);
    log(`[refresh-anilist] ${note}`);
    return { ...counters, queued: queue.length, airing: queue.filter((q) => q.airing).length, resolved, deferred, errors, note, ms: Date.now() - t0 };
  } catch (err) {
    if (!opts.dryRun) await finishRun(runId, 'error', counters, String(err).slice(0, 300));
    throw err;
  }
}
