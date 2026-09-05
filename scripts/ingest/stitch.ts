// The stitcher: multi-season series (one AFL page, several AniList entries)
// get their full component chain. Walks PREQUEL edges to the chain head, then
// SEQUEL edges forward (TV-ish formats only), and AUTO-FINALIZES only when
// the chain's episode sum matches AFL's continuous numbering (±2) — anything
// else flags for Sean. Aggregation rules: docs/data-pipeline.md §8.
//
// RULED EXTENSIONS (2026-08-23, the Kingdom/Beastars/Black Butler class):
// AFL pages lag newer seasons, so an override chain may be RULED to run
// beyond its AFL page (`ruledExtent` = the ruling's reasoning). Such chains
// are standing candidates — every run re-asserts the ruled structure when it
// drifts, flag or no flag — and their finalize gate only requires the chain
// to COVER AFL's numbering (the ruling covers the excess). Episode rows
// MERGE (AFL's range rewritten, rows beyond it — Wikipedia/AFG fills —
// survive; §10 AFL-range merge rule), id/title stay stable (structure only).
//   npx tsx --env-file=.env.ingest scripts/ingest/stitch.ts [--dry-run] [--only <afl-slug>]

import { db, selectAll, startRun, finishRun, fileFlagOnce } from './lib/db';
import { type AniListMedia } from './lib/anilist';
import { stageAniList, registerIds, applyScope, applyEpisodeFloor, filterEpisodeRows } from './lib/resolve';
import { syncMintedRows } from './lib/minted';
import { loadEpisodeTies } from './lib/side-source';
import { slugify } from './lib/slug';
import type { AflShowPage } from './lib/afl';
import { getMedia, aired, walkChain, aggregate, writeComponents, ownedAnilistIds } from './lib/chain';
import { OVERRIDE_CHAINS } from './lib/rulings/override-chains';

// Override chains live in lib/rulings/override-chains.ts (restructure T2.1,
// 2026-08-26): the typed RulingEntry record carrying each chain and its
// reason; OVERRIDE_CHAINS is the derived lookup (same name, same shape).
// HOLD (a stitch skip-list) had been empty since JoJo and Monogatari were
// unheld 2026-08-22 (Sean ruled both ONE series) and was removed with the
// extraction — a future hold is a ruling, declared in lib/rulings.

const DRY_RUN = process.argv.includes('--dry-run');
// --only <afl-slug>: apply ONE candidate (a ruled extension from a /discover sitting) and leave the
// open count_mismatch candidates for their own run — the I42 mint rule applies per ruling
const ONLY = process.argv.indexOf('--only') > 0 ? process.argv[process.argv.indexOf('--only') + 1] : null;

// A ruled extension is "unchanged" when the series already carries exactly
// the ruled component sequence (seasons + extras in order) — aired-count
// drift on an airing tail is refreshStitchedVolatile's job, not a re-stitch.
async function structureMatches(slug: string, ids: number[], extras?: { id: number; after: number }[]): Promise<boolean> {
  const { data: s } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
  if (!s) return false;
  const comps = await selectAll<{ anilist_id: number; season_order: number; episode_start: number | null }>('series_components', 'anilist_id, season_order, episode_start', (q) =>
    q.eq('series_id', s.id).order('season_order'),
  );
  // compare the id SEQUENCE and each entry's numbered-vs-order-only shape
  // (an extra that an earlier walk bridged in as a numbered season must be
  // rewritten to its null-span, order-only position)
  const want: { id: number; orderOnly: boolean }[] = [];
  for (const id of ids) {
    want.push({ id, orderOnly: false });
    for (const x of extras?.filter((e) => e.after === id) ?? []) want.push({ id: x.id, orderOnly: true });
  }
  const have = comps.map((c) => ({ id: c.anilist_id as number, orderOnly: c.episode_start == null }));
  return have.length === want.length && have.every((h, i) => h.id === want[i].id && h.orderOnly === want[i].orderOnly);
}

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];

  try {
    // Candidates: AFL classified MORE than the matched entry aired — the
    // lumped-page signature; AFL cannot know more episodes than exist, so any
    // excess >2 is suspect (Tokyo Ghoul slipped a +12 gate: S1+√A page vs the
    // √A entry was exactly 12 over). (AFL having FEWER = site lag, no stitch.)
    const flags = await selectAll<{ id: number; series_key: string; detail: unknown }>('ingest_flags', 'id, series_key, detail', (q) =>
      q.eq('kind', 'count_mismatch').eq('status', 'open'),
    );
    type Cand = { id: number | null; slug: string; afl: number; anilist: number };
    const candidates: Cand[] = flags
      .map((f) => ({
        id: f.id as number,
        slug: f.series_key as string,
        afl: (f.detail as { aflClassified?: number }).aflClassified ?? 0,
        anilist: (f.detail as { anilistAired?: number }).anilistAired ?? 0,
      }))
      .filter((c) => c.afl > c.anilist + 2);
    // ruled extensions: standing candidates whenever the stored structure
    // differs from the ruled chain (self-healing, no flag required)
    const flagged = new Set(candidates.map((c) => c.slug));
    for (const [slug, o] of Object.entries(OVERRIDE_CHAINS)) {
      if (!o.ruledExtent || flagged.has(slug)) continue;
      if (await structureMatches(slug, o.ids, o.extras)) {
        counters.unchanged++;
        continue;
      }
      candidates.push({ id: null, slug, afl: 0, anilist: 0 });
    }
    if (ONLY) { const n = candidates.length; candidates.splice(0, candidates.length, ...candidates.filter((c) => c.slug === ONLY)); console.log(`[stitch] --only ${ONLY}: ${candidates.length} of ${n} candidates`); }
    console.log(`[stitch] ${candidates.length} candidates${DRY_RUN ? ' (dry run)' : ''}`);

    for (const cand of candidates) {
      try {
      const { data: map } = await db
        .from('source_map')
        .select('anilist_id, disposition')
        .eq('afl_slug', cand.slug)
        .maybeSingle();
      if (!map?.anilist_id || map.disposition !== 'active') continue;
      const { data: aflRow } = await db.from('ingest_afl_shows').select('raw').eq('slug', cand.slug).maybeSingle();
      if (!aflRow) continue;
      const page = aflRow.raw as AflShowPage;
      const aflMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);

      const override = OVERRIDE_CHAINS[cand.slug];
      const ruled = !!override?.ruledExtent;
      let chain: AniListMedia[];
      let ambiguity: string | null = null;
      if (override) {
        chain = (await Promise.all(override.ids.map(getMedia))).filter(Boolean) as AniListMedia[];
        if (chain.length !== override.ids.length) ambiguity = 'override id unavailable';
      } else {
        // ownership guard: the walk stops at any AniList entry another
        // canonical series already claims (ruled splits stay split)
        const { data: self } = await db.from('series').select('id').eq('afl_slug', cand.slug).maybeSingle();
        const owned = await ownedAnilistIds(self?.id ?? '__none__');
        ({ chain, ambiguity } = await walkChain(map.anilist_id, aflMax, owned));
      }
      const chainAired = chain.reduce((s, m) => s + aired(m), 0);

      // AFL trailing the newest cour is normal lag, not a mis-scope: accept
      // when the whole excess fits inside the last (typically airing) node.
      const lagOk =
        chainAired > aflMax && chain.length > 0 && chainAired - aflMax <= aired(chain[chain.length - 1]);

      // a ruled extension only needs the chain to COVER AFL's numbering —
      // the excess is exactly what the ruling asserts exists
      const gateFails = ruled ? chainAired < aflMax - 2 : Math.abs(chainAired - aflMax) > 2 && !lagOk;
      if (ambiguity || gateFails) {
        await fileFlagOnce(runId, cand.slug, 'resolve', 'count_mismatch', {
          stage: 'stitch',
          ruledExtent: override?.ruledExtent ?? null,
          aflClassified: aflMax,
          chainAired,
          chain: chain.map((m) => ({ id: m.id, title: m.title.romaji, eps: m.episodes, aired: aired(m) })),
          ambiguity,
        });
        counters.flagged++;
        actions.push(`FLAGGED ${cand.slug}: chain ${chainAired} vs afl ${aflMax}${ambiguity ? ` (${ambiguity})` : ''}`);
        continue;
      }

      // finalize: stage chain, re-key series, components with ranges
      for (const m of chain) await stageAniList(m);
      const series = aggregate(chain, cand.slug, page.title);
      if (override?.title) {
        series.title = override.title;
        series.id = slugify(override.title);
      }
      const { data: old } = await db.from('series').select('id, title').eq('afl_slug', cand.slug).maybeSingle();
      // a ruled extension is structure only: the canonical id/title an
      // existing series already carries are stable (afg-extend's rule)
      if (ruled && old) {
        series.id = old.id;
        series.title = old.title;
      }
      const { data: topRow } = await db.from('episodes').select('number').eq('series_id', old?.id ?? series.id).order('number', { ascending: false }).limit(1);
      const ourMax = Math.max(aflMax, topRow?.[0]?.number ?? 0);
      if (DRY_RUN) {
        actions.push(
          `DRY ${ruled ? 'EXTEND' : 'STITCH'} ${cand.slug} → ${series.id}: ${chain.length} seasons, ${chainAired} eps vs afl ${aflMax} (${chain.map((m) => m.id).join(' → ')})${override?.extras?.length ? ` + ${override.extras.length} order-only` : ''}`,
        );
        continue;
      }
      Object.assign(
        series,
        await applyScope(series.id, {
          total_volumes: series.total_volumes,
          total_chapters: series.total_chapters,
          manga_start_volume: series.manga_start_volume,
          manga_start_chapter: series.manga_start_chapter,
        }),
      );
      applyEpisodeFloor(series.id, series, ourMax);

      if (old && old.id !== series.id) await db.from('series').delete().eq('id', old.id);
      const { error: e1 } = await db.from('series').upsert(series);
      if (e1) throw new Error(`series (${cand.slug}): ${e1.message}`);
      await registerIds(series.id, { anilist: series.anilist_id, mal: series.mal_id, afl: cand.slug });

      // every episode writer goes through the per-series rulings (community
      // caps + type overrides) — a re-stitch must never resurrect rows or
      // types a ruling removed
      const epRows = filterEpisodeRows(series.id, page.episodes.map((e) => ({
        series_id: series.id,
        number: e.number,
        title: e.title,
        type: e.type,
        air_date: e.airDate,
      })), 'afl', { ties: await loadEpisodeTies(series.id) }); // T26: the side_source default
      // AFL-range merge (§10): rewrite only AFL's own (translated) numbering
      // range — rows beyond it (AFG/Wikipedia fills on a ruled extension)
      // survive the re-stitch
      const aflTop = epRows.reduce((m, r) => Math.max(m, r.number), 0);
      // G57: the stitcher mints its rows as 'stitch' (upsert + re-stamp) and deletes only its own stale rows ≤ aflTop
      await syncMintedRows(series.id, epRows, 'stitch', aflTop);

      await writeComponents(series.id, chain, cand.slug, override?.extras);

      if (cand.id != null) {
        await db
          .from('ingest_flags')
          .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
          .eq('id', cand.id);
      }
      counters.changed++;
      actions.push(
        `${ruled ? 'EXTENDED' : 'STITCHED'} ${cand.slug} → ${series.id}: ${chain.length} seasons, ${chainAired} eps (${chain.map((m) => m.id).join(' → ')})${override?.extras?.length ? ` + ${override.extras.length} order-only` : ''}`,
      );
      } catch (err) {
        // one candidate's failure (e.g. AniList outage on a cache miss) must
        // never kill the run — it stays flagged and retries next time
        actions.push(`ERROR ${cand.slug}: ${String(err).slice(0, 140)}`);
      }
    }

    await finishRun(runId, 'ok', counters, 'stitcher');
    console.log('\n=== STITCH COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    const open = await selectAll<{ kind: string }>('ingest_flags', 'kind', (q) => q.eq('status', 'open'));
    const byKind: Record<string, number> = {};
    for (const f of open) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
    console.log('open flags:', byKind);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
