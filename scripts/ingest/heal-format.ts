// Derive episodes.format for every row (rule T29, T4.4 2026-08-26): the
// containing component's kind (season → tv; ova / special / movie) or a
// FORMAT_OVERRIDES ruling; no component and no ruling → NULL (honest — the
// format_missing census class is the queue; episode_without_component names
// the structure gap behind most of it). Idempotent; standard HEAL roster.
//   npx tsx --env-file=.env.ingest scripts/ingest/heal-format.ts [--dry-run]

import { db, selectAll } from './lib/db';
import { deriveFormat } from './lib/format';

const DRY = process.argv.includes('--dry-run');

async function main() {
  const comps = await selectAll<{ series_id: string; kind: string | null; episode_start: number | null; episode_end: number | null }>('series_components', 'series_id, kind, episode_start, episode_end', (q) => q.not('episode_start', 'is', null));
  const eps = await selectAll<{ series_id: string; number: number; format: string | null }>('episodes', 'series_id, number, format');
  const compsBy = new Map<string, typeof comps>();
  for (const c of comps) { if (!compsBy.has(c.series_id)) compsBy.set(c.series_id, []); compsBy.get(c.series_id)!.push(c); }
  const kindOf = (sid: string, n: number) => (compsBy.get(sid) ?? []).find((c) => n >= (c.episode_start as number) && (c.episode_end == null || n <= c.episode_end))?.kind ?? null;
  let changed = 0, nulls = 0;
  const byFormat = new Map<string, number>();
  const nullBy = new Map<string, number>();
  // batched: one update per (series, format) group — a row-by-row write over
  // 19.8k rows timed out the first run (2026-08-26)
  const pending = new Map<string, number[]>();
  for (const e of eps) {
    const want = deriveFormat(e.series_id, e.number, kindOf(e.series_id, e.number));
    byFormat.set(String(want), (byFormat.get(String(want)) ?? 0) + 1);
    if (!want) { nulls++; nullBy.set(e.series_id, (nullBy.get(e.series_id) ?? 0) + 1); }
    if (want !== e.format) {
      changed++;
      const k = `${e.series_id}|${want}`;
      if (!pending.has(k)) pending.set(k, []);
      pending.get(k)!.push(e.number);
    }
  }
  if (!DRY) {
    for (const [k, nums] of pending) {
      const [sid, want] = k.split('|');
      for (let i = 0; i < nums.length; i += 400) {
        const { error } = await db.from('episodes').update({ format: want === 'null' ? null : want }).eq('series_id', sid).in('number', nums.slice(i, i + 400));
        if (error) throw new Error(`${sid} ${want}: ${error.message}`);
      }
    }
  }
  console.log(`[heal-format] ${eps.length} rows: ${changed} changed; by format ${[...byFormat].map(([k, n]) => `${k}=${n}`).join(' ')}; ${nulls} null in ${nullBy.size} series${DRY ? ' — DRY RUN' : ''}`);
  for (const [sid, n] of [...nullBy].sort((a, b) => b[1] - a[1]).slice(0, 25)) console.log(`  null: ${sid} ×${n}`);
}
main().then(() => process.exit(0));
