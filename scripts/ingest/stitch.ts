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
//   npx tsx --env-file=.env.ingest scripts/ingest/stitch.ts [--dry-run]

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { type AniListMedia } from './lib/anilist';
import { stageAniList, registerIds, applyScope, applyEpisodeFloor, filterEpisodeRows } from './lib/resolve';
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
  { ids: number[]; extras?: { id: number; after: number }[]; title?: string; ruledExtent?: string }
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
  'love-ru-darkness': {
    ids: [13663, 20995],
    extras: [{ id: 21852, after: 20995 }], // '2nd Specials' (eps 13-14 of 2nd) — order-only, adapts chs 43-47 (batch 14)
    ruledExtent: 'AFL numbers the two 2nd-season specials as 25-26 (dropped by SOURCE_NUMBERING_SHIFTS); they hold an order-only position after 20995 — batch 14 (2026-08-23 s2)',
  },
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
  // RULED EXTENSIONS (2026-08-23; AniList back up after the 08-23 outage):
  // the stitch queue's AFL-lag class — every id verified against AniList's
  // SEQUEL graph this session; extras are order-only watch-order entries
  // (movies count only when numbered, §10).
  'black-butler': {
    ids: [4898, 6707, 20606, 166715, 179054],
    extras: [
      { id: 20670, after: 20606 }, // Book of Murder OVAs — order-only (flag #853)
      { id: 21425, after: 20606 }, // Book of the Atlantic film — order-only (flag #853)
    ],
    ruledExtent: 'AFL page = S1+S2+Circus (46); Public School Arc TV (2024, our 47-57) + Emerald Witch Arc TV (2025, our 58-70) aired — flag #853',
  },
  kingdom: {
    ids: [12031, 17389, 113108, 140350, 155227, 190840],
    ruledExtent: 'AFL page stops at S3 (104 rows); S5 (2024, our 130-142) + S6 (Oct-Dec 2025, our 143-155) aired — flag #814. Zoku-hen (204688) joins when it airs',
  },
  'rent-girlfriend': {
    ids: [113813, 124410, 154745, 179344, 199029],
    ruledExtent: 'AFL page = S1-S3 (36); S4 (ONA, Jul 2025, our 37-48) + S5 (ONA, Apr 2026, our 49-60) aired — flag #839',
  },
  beastars: {
    ids: [107660, 114194, 136880, 187267],
    ruledExtent: 'AFL page = S1+S2 (24); FINAL SEASON Part 1 (Dec 2024, our 25-36) + Part 2 (Mar 2026, our 37-48) complete the manga — flag #854',
  },
  'ancient-magus-bride': {
    ids: [98436, 154364, 166452],
    extras: [{ id: 130713, after: 98436 }], // 2021 OVA 'Nishi no Shounen to Seiran no Kishi' — order-only between S1 and S2
    ruledExtent: 'AFL page = S1 (24); SEASON 2 (2023, two cours, our 25-48) aired — batch-10 stitch flag',
  },
  'golden-kamuy': {
    ids: [99699, 102977, 110355, 142343, 166521],
    extras: [
      { id: 101830, after: 99699 }, // OVA 1 (with vol 15): chs 55 (part)-59 + 32 — order-only (batch 14)
      { id: 124756, after: 102977 }, // OVAs 2/3/4 (with vols 17/19/21): 83-85+104 / 63-69 / 108-113 — order-only (batch 14)
      { id: 194872, after: 142343 }, // OVA 5 (2025): 102, 104-107, 228 — order-only (batch 14)
    ],
    ruledExtent: 'AFL page = S1+S2 (24); S3 (2020, our 25-36) + S4 (2022, our 37-49) + Final Season (Jan-Mar 2026, our 50-62 → ch 302, NOT the manga end: Bousou Ressha-hen 210073 will adapt 303-314) — flag #856; OVAs order-only per batch 14. Sapporo Beer Koujou-hen films (196115) = recut of eps 50-55, excluded',
  },
  'cardcaptor-sakura': {
    ids: [232, 98554],
    ruledExtent: "1998 TV (232, 1-70) + Clear Card PROLOGUE OVA 98554 ('Sakura and the Two Bears', ep 71, adapts chs 46-50 — NOT the Sealed Card film 372 the relation walk bridged through). Clear Card TV (97881) = SEPARATE series cardcaptor-sakura-clear-card (Sean 2026-08-24, different manga 87296); community cap 71 keeps the shared AFL page's tail out",
  },
  'my-hero-academia': {
    ids: [21459, 21856, 100166, 104276, 117193, 139630, 163139, 182896],
    extras: [
      { id: 204356, after: 182896 }, // "No. 170+1: More" (2026-05-02, ch 431) — community-numbered 170+1 (Sean 2026-08-24)
      { id: 211711, after: 182896 }, // "I am a hero too" Eri special (2026-08-03, ch 431.5) — mangaMapper position 170+1.5 (Sean's ruling)
    ],
    ruledExtent: "post-finale specials join as order-only entries (Sean 2026-08-24: essential canon the community groups with the series; surfaced with the community +N format — 'No. 170+1: More' at 170+1, the Eri fan-book special at Sean's 170+1.5, matching the manga's .5 bonus format). Counts stay 170",
  },
  'heroic-legend-arslan': {
    ids: [20935, 21424],
    extras: [{ id: 21817, after: 21424 }], // OVA: two anime-original side stories — order-only (batch 14)
    ruledExtent: 'AFL page = S1 (25); Fuujin Ranbu (2016, 8 eps, our 26-33, chs 72-107) aired — batch 14 (2026-08-23 s2): the stored ep25→107 pin was the S2 endpoint (repaired to 71). 1991 OVA (1762) is a separate novel adaptation — excluded',
  },
  'time-i-got-reincarnated-slime': {
    ids: [101280, 108511, 116742, 156822, 182205],
    extras: [
      { id: 161802, after: 101280 }, // Visions of Coleus OVA — order-only, anime-original (batch 14 placement)
      { id: 139498, after: 116742 }, // Scarlet Bond film — order-only, anime-original (batch 14)
      { id: 182206, after: 156822 }, // Tears of the Azure Sea film — order-only, anime-original (batch 14)
    ],
    ruledExtent: 'AFL page = S1 (24); S2 (2021, two parts, our 25-48) + S3 (2024, our 49-72) + S4 (airing 2026, our 73-96) — docs §12.19e structure gap, MU out-of-space flag #728. OVA/films wired order-only once batch-14 research places them',
  },
};

const DRY_RUN = process.argv.includes('--dry-run');

// A ruled extension is "unchanged" when the series already carries exactly
// the ruled component sequence (seasons + extras in order) — aired-count
// drift on an airing tail is refreshStitchedVolatile's job, not a re-stitch.
async function structureMatches(slug: string, ids: number[], extras?: { id: number; after: number }[]): Promise<boolean> {
  const { data: s } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
  if (!s) return false;
  const { data: comps } = await db
    .from('series_components')
    .select('anilist_id, season_order, episode_start')
    .eq('series_id', s.id)
    .order('season_order');
  // compare the id SEQUENCE and each entry's numbered-vs-order-only shape
  // (an extra that an earlier walk bridged in as a numbered season must be
  // rewritten to its null-span, order-only position)
  const want: { id: number; orderOnly: boolean }[] = [];
  for (const id of ids) {
    want.push({ id, orderOnly: false });
    for (const x of extras?.filter((e) => e.after === id) ?? []) want.push({ id: x.id, orderOnly: true });
  }
  const have = (comps ?? []).map((c) => ({ id: c.anilist_id as number, orderOnly: c.episode_start == null }));
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
    const { data: flags } = await db
      .from('ingest_flags')
      .select('id, series_key, detail')
      .eq('kind', 'count_mismatch')
      .eq('status', 'open');
    type Cand = { id: number | null; slug: string; afl: number; anilist: number };
    const candidates: Cand[] = (flags ?? [])
      .map((f) => ({
        id: f.id as number,
        slug: f.series_key as string,
        afl: (f.detail as { aflClassified?: number }).aflClassified ?? 0,
        anilist: (f.detail as { anilistAired?: number }).anilistAired ?? 0,
      }))
      .filter((c) => c.afl > c.anilist + 2 && !HOLD.has(c.slug));
    // ruled extensions: standing candidates whenever the stored structure
    // differs from the ruled chain (self-healing, no flag required)
    const flagged = new Set(candidates.map((c) => c.slug));
    for (const [slug, o] of Object.entries(OVERRIDE_CHAINS)) {
      if (!o.ruledExtent || flagged.has(slug) || HOLD.has(slug)) continue;
      if (await structureMatches(slug, o.ids, o.extras)) {
        counters.unchanged++;
        continue;
      }
      candidates.push({ id: null, slug, afl: 0, anilist: 0 });
    }
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
        await applyScope(cand.slug, {
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
      })), 'afl');
      // AFL-range merge (§10): rewrite only AFL's own (translated) numbering
      // range — rows beyond it (AFG/Wikipedia fills on a ruled extension)
      // survive the re-stitch
      const aflTop = epRows.reduce((m, r) => Math.max(m, r.number), 0);
      await db.from('episodes').delete().eq('series_id', series.id).lte('number', aflTop);
      for (let i = 0; i < epRows.length; i += 500) {
        const { error } = await db.from('episodes').insert(epRows.slice(i, i + 500));
        if (error) throw new Error(`episodes (${cand.slug}): ${error.message}`);
      }

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
