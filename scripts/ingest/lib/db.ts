import { createClient } from '@supabase/supabase-js';

// Runs under Node (tsx scripts) AND the Supabase Edge runtime (Deno) — the
// edge runtime injects SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY by default.
declare const Deno: { env: { get(k: string): string | undefined } } | undefined;
const env = (k: string): string | undefined =>
  (typeof Deno !== 'undefined' ? Deno.env.get(k) : undefined) ??
  (typeof process !== 'undefined' ? process.env[k] : undefined);

const url = env('SUPABASE_URL');
const secretKey = env('SUPABASE_SECRET_KEY') ?? env('SUPABASE_SERVICE_ROLE_KEY');
if (!url || !secretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY (run via: npx tsx --env-file=.env.ingest ...)');
}

export const db = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// P32 — completeness as an outcome (restructure T2.3, 2026-08-26). Supabase
// caps a select at 1000 rows and says nothing; the C3 healer once stamped
// 16 of 351 and reported success, and syncAnchors' per-series episode read
// let one-piece/detective-conan rows past the cap through the A1 allow-list
// as "row-less". EVERY catalog-sized read goes through selectAll: it pages
// until a short page, asks the server for the exact count on the first
// page, and THROWS if the two disagree — a walk that cannot prove it was
// complete does not return. `apply` adds filters/order to the query.
//   const rows = await selectAll<{ id: string }>('series', 'id', (q) => q.eq('status', 'finished'));
export async function selectAll<T = Record<string, unknown>>(
  table: string,
  select: string,
  apply?: (q: any) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
  pageSize = 1000,
): Promise<T[]> {
  const out: T[] = [];
  let expected: number | null = null;
  for (let from = 0; ; from += pageSize) {
    let q: any = db.from(table).select(select, from === 0 ? { count: 'exact' } : undefined); // eslint-disable-line @typescript-eslint/no-explicit-any
    if (apply) q = apply(q);
    const { data, error, count } = await q.range(from, from + pageSize - 1);
    if (error) throw new Error(`selectAll(${table}): ${error.message}`);
    if (from === 0 && typeof count === 'number') expected = count;
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < pageSize) break;
  }
  if (expected != null && out.length !== expected) {
    throw new Error(`selectAll(${table}): walk incomplete — ${out.length} rows read, server count ${expected} (P32)`);
  }
  return out;
}

// Every ingest write goes through a run so provenance is queryable.
export async function startRun(source: 'afl' | 'afg' | 'anilist' | 'resolve'): Promise<number> {
  const { data, error } = await db.from('ingest_runs').insert({ source }).select('id').single();
  if (error) throw new Error(`startRun(${source}): ${error.message}`);
  return data.id as number;
}

export interface RunCounters {
  fetched: number;
  unchanged: number;
  changed: number;
  flagged: number;
}

export async function finishRun(id: number, status: 'ok' | 'error', counters: RunCounters, note?: string) {
  const { error } = await db
    .from('ingest_runs')
    .update({ finished_at: new Date().toISOString(), status, ...counters, note: note ?? null })
    .eq('id', id);
  if (error) throw new Error(`finishRun(${id}): ${error.message}`);
}

export type FlagKind = 'parse_integrity' | 'taxonomy_conflict' | 'match_ambiguous' | 'count_mismatch' | 'large_diff' | 'airdate_withheld';

// The confirm queue: a flag records the anomaly AND the proposed data so it
// can be ruled on later without re-scraping. Callers hold the change.
export async function fileFlag(
  runId: number,
  seriesKey: string,
  source: string,
  kind: FlagKind,
  detail: Record<string, unknown>,
) {
  const { error } = await db
    .from('ingest_flags')
    .insert({ run_id: runId, series_key: seriesKey, source, kind, detail });
  if (error) throw new Error(`fileFlag(${seriesKey}/${kind}): ${error.message}`);
}

// For recurring conditions (an unclassified show stays unclassified every
// weekly run): file only if no open flag of this kind already exists.
export async function fileFlagOnce(
  runId: number,
  seriesKey: string,
  source: string,
  kind: FlagKind,
  detail: Record<string, unknown>,
) {
  const { data } = await db
    .from('ingest_flags')
    .select('id')
    .eq('series_key', seriesKey)
    .eq('kind', kind)
    .eq('status', 'open')
    .limit(1);
  if (data?.length) return;
  await fileFlag(runId, seriesKey, source, kind, detail);
}
