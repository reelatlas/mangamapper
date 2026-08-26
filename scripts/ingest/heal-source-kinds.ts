// Re-derive series.source_type from staging through the SOURCE_KINDS registry
// (rule T25, T4.1 2026-08-26). Standard HEAL roster entry: the derivation is
// the mechanism, so this healer IS the migration (the 16 collapsed rows) and
// the standing assertion (a registry or override change re-applies here;
// the daily refresh-anilist re-resolve applies the same function at write).
// Fails closed: an unregistered source / country → source_type NULL + flag
// source_kind_unknown; the census class series_without_source_kind is the
// ruling queue. Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/heal-source-kinds.ts [--dry-run]

import { db, fileFlagOnce, finishRun, selectAll, startRun } from './lib/db';
import type { AniListMedia } from './lib/anilist';
import { pickManga } from './lib/resolve';
import { deriveSourceKind, SOURCE_KIND_VALUES } from './lib/rulings/source-kinds';

const DRY = process.argv.includes('--dry-run');

async function main() {
  const series = await selectAll<{ id: string; anilist_id: number | null; source_type: string | null }>('series', 'id, anilist_id, source_type');
  const ids = series.map((s) => s.anilist_id).filter((n): n is number => n != null);
  const staged = await selectAll<{ anilist_id: number; raw: AniListMedia }>('ingest_anilist_media', 'anilist_id, raw', (q) => q.in('anilist_id', ids));
  const rawBy = new Map(staged.map((r) => [r.anilist_id, r.raw]));
  const runId = DRY ? 0 : await startRun('resolve');
  let changed = 0, unknown = 0, unstaged = 0;
  const byValue = new Map<string, number>();
  for (const s of series) {
    const media = s.anilist_id != null ? rawBy.get(s.anilist_id) : undefined;
    if (!media) { unstaged++; console.log(`  ${s.id}: AniList media not staged — left as ${s.source_type}`); continue; }
    const node = pickManga(media);
    const d = deriveSourceKind(s.id, { source: media.source, mangaCountry: node ? node.countryOfOrigin : null, hasMangaEdge: !!node });
    if (d.value && !SOURCE_KIND_VALUES.includes(d.value)) throw new Error(`${s.id}: derived '${d.value}' is not a registered kind (an override names an unregistered value)`);
    byValue.set(String(d.value), (byValue.get(String(d.value)) ?? 0) + 1);
    if (!d.value) {
      unknown++;
      console.log(`  ${s.id}: → NULL (${d.reason})`);
      if (!DRY) await fileFlagOnce(runId, s.id, 'heal-source-kinds', 'source_kind_unknown', { anilistSource: media.source, mangaCountry: node?.countryOfOrigin ?? null, reason: d.reason });
    }
    if (d.value !== s.source_type) {
      changed++;
      console.log(`  ${s.id}: ${s.source_type} → ${d.value} (${d.reason})`);
      if (!DRY) {
        const { error } = await db.from('series').update({ source_type: d.value }).eq('id', s.id);
        if (error) throw new Error(`${s.id}: ${error.message}`);
      }
    }
  }
  console.log(`[heal-source-kinds] ${series.length} series: ${changed} changed, ${unknown} unregistered → NULL+flag, ${unstaged} unstaged; by kind: ${[...byValue].map(([k, n]) => `${k}=${n}`).join(' ')}${DRY ? ' — DRY RUN' : ''}`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: series.length, unchanged: series.length - changed, changed, flagged: unknown }, `heal-source-kinds: ${changed} changed, ${unknown} unknown, ${unstaged} unstaged`);
}
main().then(() => process.exit(0));
