// The stitcher: multi-season series (one AFL page, several AniList entries)
// get their full component chain. Walks PREQUEL edges to the chain head, then
// SEQUEL edges forward (TV-ish formats only), and AUTO-FINALIZES only when
// the chain's episode sum matches AFL's continuous numbering (±2) — anything
// else flags for Sean. Aggregation rules: docs/data-pipeline.md §8.
//   npx tsx --env-file=.env.ingest scripts/ingest/stitch.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { type AniListMedia } from './lib/anilist';
import { stageAniList, registerIds, applyScope } from './lib/resolve';
import { slugify } from './lib/slug';
import type { AflShowPage } from './lib/afl';
import { getMedia, aired, walkChain, aggregate, writeComponents, ownedAnilistIds } from './lib/chain';

// (JoJo and Monogatari unheld 2026-08-22: Sean ruled both ONE series.)
const HOLD = new Set<string>([]);

// Assisted-batch explicit chains (2026-08-22): cases the relation walker
// can't derive — wrong upstream matches, broken/ambiguous relation graphs.
// ids are AniList entries in series order (verified against AFL counts by the
// same finalize gate); extras are in-flow components WITHOUT AFL episode rows
// (Sean's ruling: Kizumonogatari movies belong inside Monogatari).
const OVERRIDE_CHAINS: Record<
  string,
  { ids: number[]; extras?: { id: number; after: number }[]; title?: string }
> = {
  'jojos-bizarre-adventure-tv': { ids: [14719, 20474, 20799, 21450, 102883, 131942, 146722] },
  // Off & Monster Season (173533) intentionally absent: AFL's page (100 rows)
  // predates it — the count_mismatch flag on AFL's next update re-adds it here.
  'monogatari-series': {
    title: 'Monogatari Series', // the franchise identity, not the head season's
    ids: [5081, 11597, 15689, 17074, 20593, 20918, 21262, 21520, 21745, 100815],
    extras: [
      { id: 9260, after: 21520 },
      { id: 21399, after: 21520 },
      { id: 21400, after: 21520 },
    ],
  },
  'dragon-ball-z-kai': { ids: [6033, 20635] },
  'bleach-thousand-year-blood-war': { ids: [116674, 159322, 169755, 185874] },
  'yu-gi-oh-zexal': { ids: [10015, 15489] },
  'hell-girl': { ids: [228, 1594, 3713, 98379] },
  'magi-labyrinth-magic': { ids: [14513, 18115] },
  'melancholy-haruhi-suzumiya': { ids: [4382] }, // 2009 rebroadcast = full 28-ep ordering AFL uses
  'love-ru-darkness': { ids: [13663, 20995] },
  'kamisama-kiss': { ids: [14713, 20801, 21186] },
  x: { ids: [156] },
  // AniList relation-graph gaps found post-recovery (2026-08-23):
  'tokyo-ghoul': { ids: [20605, 20850] }, // S1 + √A (AFL page = both, 24 eps)
  'tokyo-ghoul-re-0': { ids: [100240, 102351] }, // :re parts 1+2
  'fatestay-night-unlimited-blade-works': { ids: [19603, 20792] }, // UBW two cours
  'rurouni-kenshin-2023': { ids: [142877, 171637] }, // 2023 + Kyoto Disturbance
  'berserk-2016': { ids: [21560, 97643] }, // 2016+2017 (Memorial is its PREQUEL edge — separate entry by ruling)
  'blade-immortal-2019': { ids: [109616] }, // 2019 ONA (match had landed on the 2008 TV)
  'hokuto-no-ken': { ids: [967, 1356] },
  'black-butler': { ids: [4898, 6707, 20606] },
};

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];

  try {
    // Candidates: AFL classified MORE than the matched entry aired — the
    // lumped-page signature; AFL cannot know more episodes than exist, so any
    // excess >2 is suspect (Tokyo Ghoul slipped a +12 gate: S1+√A page vs the
    // √A entry was exactly 12 over). (AFL having FEWER = site lag, no stitch.)
    const { data: flags } = await db
      .from('ingest_flags')
      .select('id, series_key, detail')
      .eq('kind', 'count_mismatch')
      .eq('status', 'open');
    const candidates = (flags ?? [])
      .map((f) => ({
        id: f.id,
        slug: f.series_key,
        afl: (f.detail as { aflClassified?: number }).aflClassified ?? 0,
        anilist: (f.detail as { anilistAired?: number }).anilistAired ?? 0,
      }))
      .filter((c) => c.afl > c.anilist + 2 && !HOLD.has(c.slug));
    console.log(`[stitch] ${candidates.length} candidates`);

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

      if (ambiguity || (Math.abs(chainAired - aflMax) > 2 && !lagOk)) {
        await fileFlagOnce(runId, cand.slug, 'resolve', 'count_mismatch', {
          stage: 'stitch',
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
      Object.assign(
        series,
        await applyScope(cand.slug, {
          total_volumes: series.total_volumes,
          total_chapters: series.total_chapters,
          manga_start_volume: series.manga_start_volume,
          manga_start_chapter: series.manga_start_chapter,
        }),
      );

      const { data: old } = await db.from('series').select('id').eq('afl_slug', cand.slug).maybeSingle();
      if (old && old.id !== series.id) await db.from('series').delete().eq('id', old.id);
      const { error: e1 } = await db.from('series').upsert(series);
      if (e1) throw new Error(`series (${cand.slug}): ${e1.message}`);
      await registerIds(series.id, { anilist: series.anilist_id, mal: series.mal_id, afl: cand.slug });

      await db.from('episodes').delete().eq('series_id', series.id);
      const epRows = page.episodes.map((e) => ({
        series_id: series.id,
        number: e.number,
        title: e.title,
        type: e.type,
        air_date: e.airDate,
      }));
      for (let i = 0; i < epRows.length; i += 500) {
        const { error } = await db.from('episodes').insert(epRows.slice(i, i + 500));
        if (error) throw new Error(`episodes (${cand.slug}): ${error.message}`);
      }

      await writeComponents(series.id, chain, cand.slug, override?.extras);

      await db
        .from('ingest_flags')
        .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
        .eq('id', cand.id);
      counters.changed++;
      actions.push(
        `STITCHED ${cand.slug} → ${series.id}: ${chain.length} seasons, ${chainAired} eps (${chain.map((m) => m.id).join(' → ')})`,
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
    const { data: open } = await db.from('ingest_flags').select('kind').eq('status', 'open');
    const byKind: Record<string, number> = {};
    for (const f of open ?? []) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
    console.log('open flags:', byKind);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
