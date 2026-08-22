import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SECRET_KEY (run via: npx tsx --env-file=.env.ingest ...)');
}

export const db = createClient(url, secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

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

export type FlagKind = 'parse_integrity' | 'taxonomy_conflict' | 'match_ambiguous' | 'count_mismatch' | 'large_diff';

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
