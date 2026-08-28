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
import { deriveSourceKind, seriesHasSource, SOURCE_KIND_VALUES } from './lib/rulings/source-kinds';
import { deriveSourceRelation, MANGA_LINK_OVERRIDES } from './lib/rulings/source-relations';
import { resolveSeries } from './lib/resolve';

const DRY = process.argv.includes('--dry-run');

async function main() {
  const series = await selectAll<{ id: string; afl_slug: string | null; anilist_id: number | null; source_type: string | null; source_relation: string | null; manga_anilist_id: number | null }>('series', 'id, afl_slug, anilist_id, source_type, source_relation, manga_anilist_id');
  const ids = series.map((s) => s.anilist_id).filter((n): n is number => n != null);
  const staged = await selectAll<{ anilist_id: number; raw: AniListMedia }>('ingest_anilist_media', 'anilist_id, raw', (q) => q.in('anilist_id', ids));
  const rawBy = new Map(staged.map((r) => [r.anilist_id, r.raw]));
  const runId = DRY ? 0 : await startRun('resolve');
  let changed = 0, unknown = 0, unstaged = 0, relations = 0, relinked = 0;
  const byValue = new Map<string, number>();
  for (const s of series) {
    const media = s.anilist_id != null ? rawBy.get(s.anilist_id) : undefined;
    if (!media) { unstaged++; console.log(`  ${s.id}: AniList media not staged — left as ${s.source_type}`); continue; }
    const node = pickManga(media, s.id);
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
    // I40: source_relation derived from identity + the ruling map (null without a source)
    const rel = deriveSourceRelation(s.id, seriesHasSource(d.value));
    if ((s.source_relation ?? null) !== rel) {
      relations++;
      console.log(`  ${s.id}: source_relation ${s.source_relation} → ${rel}`);
      if (!DRY) {
        const { error } = await db.from('series').update({ source_relation: rel }).eq('id', s.id);
        if (error) throw new Error(`${s.id}: ${error.message}`);
      }
    }
    // I40: a RULED manga link (a parallel telling's ALTERNATIVE node) is written by the
    // resolver's one series write path — re-resolve the series rather than hand-write
    // the link (status / totals / scope travel with it). A stitched series is owned by
    // the stitcher and is reported instead.
    const ruledLink = MANGA_LINK_OVERRIDES[s.id];
    if (ruledLink != null && s.manga_anilist_id !== ruledLink) {
      relinked++;
      console.log(`  ${s.id}: manga link ${s.manga_anilist_id} ≠ ruled ${ruledLink} → re-resolve${s.afl_slug ? '' : ' (no afl_slug — cannot)'}`);
      if (!DRY && s.afl_slug) {
        await resolveSeries(runId, s.afl_slug);
        const { data: after } = await db.from('series').select('manga_anilist_id').eq('id', s.id).maybeSingle();
        if (after?.manga_anilist_id !== ruledLink) console.log(`  ${s.id}: still ${after?.manga_anilist_id} after re-resolve — stitched? the stitcher owns the aggregate (ruling_violation until it runs)`);
      }
    }
  }
  console.log(`[heal-source-kinds] ${series.length} series: ${changed} changed, ${relations} relations asserted (I40), ${relinked} ruled links re-resolved, ${unknown} unregistered → NULL+flag, ${unstaged} unstaged; by kind: ${[...byValue].map(([k, n]) => `${k}=${n}`).join(' ')}${DRY ? ' — DRY RUN' : ''}`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: series.length, unchanged: series.length - changed, changed, flagged: unknown }, `heal-source-kinds: ${changed} changed, ${unknown} unknown, ${unstaged} unstaged`);
}
main().then(() => process.exit(0));
