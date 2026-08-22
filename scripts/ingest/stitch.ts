// The stitcher: multi-season series (one AFL page, several AniList entries)
// get their full component chain. Walks PREQUEL edges to the chain head, then
// SEQUEL edges forward (TV-ish formats only), and AUTO-FINALIZES only when
// the chain's episode sum matches AFL's continuous numbering (±2) — anything
// else flags for Sean. Aggregation rules: docs/data-pipeline.md §8.
//   npx tsx --env-file=.env.ingest scripts/ingest/stitch.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { mediaByIds, type AniListMedia } from './lib/anilist';
import { stageAniList, registerIds, searchTextFor, applyScope } from './lib/resolve';
import { slugify } from './lib/slug';
import type { AflShowPage } from './lib/afl';

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
  'hokuto-no-ken': { ids: [967, 1356] },
  'black-butler': { ids: [4898, 6707, 20606] },
};

const SERIES_FORMATS = new Set(['TV', 'TV_SHORT', 'ONA']);
// In-flow movies/OVAs join the chain when the TV path dead-ends before AFL's
// numbering is covered (Sean's ruling: Initial D Third Stage, HxH Greed
// Island OVAs) — recorded with an explicit component kind for UI tagging.
const BRIDGE_FORMATS = new Set(['MOVIE', 'OVA', 'SPECIAL']);
const KIND_BY_FORMAT: Record<string, string> = {
  MOVIE: 'movie',
  OVA: 'ova',
  SPECIAL: 'special',
};
const MAX_CHAIN = 15;

const mediaCache = new Map<number, AniListMedia>();
async function getMedia(id: number): Promise<AniListMedia | null> {
  if (mediaCache.has(id)) return mediaCache.get(id)!;
  const { data } = await db.from('ingest_anilist_media').select('raw').eq('anilist_id', id).maybeSingle();
  if (data) {
    mediaCache.set(id, data.raw as AniListMedia);
    return data.raw as AniListMedia;
  }
  const [fetched] = await mediaByIds([id]);
  if (!fetched) return null;
  await stageAniList(fetched);
  mediaCache.set(id, fetched);
  return fetched;
}

function edges(media: AniListMedia, relationType: string, formats: Set<string> = SERIES_FORMATS) {
  return media.relations.edges.filter(
    (e) => e.relationType === relationType && e.node.type === 'ANIME' && formats.has(e.node.format ?? ''),
  );
}

const aired = (m: AniListMedia) =>
  m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : m.episodes ?? 0;

interface ChainResult {
  chain: AniListMedia[];
  ambiguity: string | null;
}

async function walkChain(startId: number, targetEps: number): Promise<ChainResult> {
  // back to the head
  let head = await getMedia(startId);
  if (!head) return { chain: [], ambiguity: `start ${startId} unavailable` };
  const seen = new Set<number>([head.id]);
  for (let i = 0; i < MAX_CHAIN; i++) {
    const prequels = edges(head, 'PREQUEL');
    if (!prequels.length) break;
    if (prequels.length > 1) return { chain: [], ambiguity: `multiple prequels at ${head.id}` };
    if (seen.has(prequels[0].node.id)) break;
    const prev = await getMedia(prequels[0].node.id);
    if (!prev) break;
    head = prev;
    seen.add(head.id);
  }
  // forward — stopping the moment AFL's numbering is covered, so a sequel
  // that is a SEPARATE series by ruling (Fairy Tail → 100 Years Quest) never
  // gets swallowed into the chain.
  const chain: AniListMedia[] = [head];
  let cur = head;
  let cum = aired(head);
  for (let i = 0; i < MAX_CHAIN; i++) {
    if (cum >= targetEps) break;
    let sequels = edges(cur, 'SEQUEL').filter((e) => !seen.has(e.node.id));
    if (!sequels.length) {
      // TV path dead-ends short of AFL's numbering — bridge through an
      // in-flow movie/OVA/special (Initial D Third Stage pattern).
      sequels = edges(cur, 'SEQUEL', BRIDGE_FORMATS).filter((e) => !seen.has(e.node.id));
    }
    if (!sequels.length) break;
    if (sequels.length > 1) {
      return { chain, ambiguity: `multiple sequels after ${cur.id}: ${sequels.map((e) => e.node.id).join(',')}` };
    }
    const next = await getMedia(sequels[0].node.id);
    if (!next) break;
    chain.push(next);
    seen.add(next.id);
    cur = next;
    cum += aired(next);
  }
  return { chain, ambiguity: null };
}

const STATUS_RANK: Record<string, string> = {
  RELEASING: 'airing',
  NOT_YET_RELEASED: 'upcoming',
  HIATUS: 'hiatus',
};

function aggregate(chain: AniListMedia[], aflSlug: string, page: AflShowPage) {
  const head = chain[0];
  const tail = chain[chain.length - 1];
  const releasing = chain.find((m) => m.status === 'RELEASING');
  const statuses = new Set(chain.map((m) => m.status));
  const status = statuses.has('RELEASING')
    ? 'airing'
    : statuses.has('NOT_YET_RELEASED')
      ? 'upcoming'
      : statuses.has('HIATUS')
        ? 'hiatus'
        : 'finished';

  const allTotalsKnown = chain.every((m) => m.episodes != null);
  const weightSum = chain.reduce((s, m) => s + m.popularity, 0) || 1;
  const score = Math.round(
    chain.reduce((s, m) => s + (m.averageScore ?? 0) * m.popularity, 0) / weightSum,
  );

  const manga = head.relations.edges
    .filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA' && e.node.format === 'MANGA')
    .sort((a, b) => (b.node.popularity ?? 0) - (a.node.popularity ?? 0))[0]?.node;

  const dedupBy = <T>(items: T[], key: (t: T) => string) => {
    const m = new Map<string, T>();
    for (const i of items) if (!m.has(key(i))) m.set(key(i), i);
    return [...m.values()];
  };

  return {
    id: slugify(head.title.english ?? head.title.romaji ?? page.title),
    afl_slug: aflSlug,
    anilist_id: head.id,
    mal_id: head.idMal,
    title: head.title.english ?? head.title.romaji ?? page.title,
    title_english: head.title.english,
    title_native: head.title.native,
    synonyms: dedupBy(chain.flatMap((m) => m.synonyms), (s) => s),
    cover_url: head.coverImage.extraLarge,
    cover_color: head.coverImage.color,
    banner_url: head.bannerImage,
    format: head.format,
    status,
    source_type:
      head.source === 'MANGA'
        ? head.countryOfOrigin === 'KR' || head.countryOfOrigin === 'CN'
          ? 'webtoon'
          : 'manga'
        : head.source === 'LIGHT_NOVEL' || head.source === 'NOVEL' || head.source === 'WEB_NOVEL'
          ? 'light_novel'
          : 'original',
    start_date: head.startDate.year
      ? `${head.startDate.year}-${String(head.startDate.month ?? 1).padStart(2, '0')}-${String(head.startDate.day ?? 1).padStart(2, '0')}`
      : null,
    end_date:
      status === 'finished' && tail.endDate.year
        ? `${tail.endDate.year}-${String(tail.endDate.month ?? 1).padStart(2, '0')}-${String(tail.endDate.day ?? 1).padStart(2, '0')}`
        : null,
    season: head.season,
    season_year: head.seasonYear,
    total_episodes: allTotalsKnown ? chain.reduce((s, m) => s + (m.episodes ?? 0), 0) : null,
    aired_episodes: chain.reduce((s, m) => s + aired(m), 0),
    next_airing_at: releasing?.nextAiringEpisode
      ? new Date(releasing.nextAiringEpisode.airingAt * 1000).toISOString()
      : null,
    duration_min: head.duration,
    average_score: score || null,
    mean_score: head.meanScore,
    popularity: Math.max(...chain.map((m) => m.popularity)),
    favourites: Math.max(...chain.map((m) => m.favourites ?? 0)) || null,
    trending: Math.max(...chain.map((m) => m.trending ?? 0)) || null,
    genres: dedupBy(chain.flatMap((m) => m.genres), (g) => g),
    tags: head.tags,
    studios: dedupBy(chain.flatMap((m) => m.studios.nodes.map((s) => s.name)), (s) => s),
    is_adult: chain.some((m) => m.isAdult),
    synopsis_html: head.description,
    external_links: dedupBy(chain.flatMap((m) => m.externalLinks), (l) => l.url ?? l.site),
    manga_anilist_id: manga?.id ?? null,
    manga_status: manga
      ? ({ RELEASING: 'publishing', FINISHED: 'finished', HIATUS: 'hiatus' } as Record<string, string>)[
          manga.status ?? ''
        ] ?? 'publishing'
      : 'anime_only',
    total_volumes: manga?.volumes ?? null,
    total_chapters: manga?.chapters ?? null,
    manga_start_volume: null,
    manga_start_chapter: null,
    search_text: searchTextFor(
      [head.title.english, head.title.romaji, head.title.native, page.title,
        ...chain.map((m) => m.title.english), ...chain.map((m) => m.title.romaji)],
      chain.flatMap((m) => m.synonyms),
    ),
    updated_at: new Date().toISOString(),
  };
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
        ({ chain, ambiguity } = await walkChain(map.anilist_id, aflMax));
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
      const series = aggregate(chain, cand.slug, page);
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

      await db.from('series_components').delete().eq('series_id', series.id);
      let cursor = 0;
      let order = 0;
      for (const m of chain) {
        const len = aired(m);
        order += 1;
        const { error } = await db.from('series_components').insert({
          series_id: series.id,
          anilist_id: m.id,
          season_order: order,
          episode_start: cursor + 1,
          episode_end: m.episodes != null || m.nextAiringEpisode ? cursor + len : null,
          label: m.title.romaji,
          kind: KIND_BY_FORMAT[m.format ?? ''] ?? 'season',
          afl_slug: cand.slug,
          afl_offset: 0,
        });
        if (error) throw new Error(`component (${cand.slug}/${m.id}): ${error.message}`);
        cursor += len;

        // in-flow components WITHOUT AFL rows (Kizumonogatari movies): they
        // occupy series order but no episode range.
        for (const extra of override?.extras?.filter((x) => x.after === m.id) ?? []) {
          const em = await getMedia(extra.id);
          if (!em) continue;
          order += 1;
          const { error: exErr } = await db.from('series_components').insert({
            series_id: series.id,
            anilist_id: em.id,
            season_order: order,
            episode_start: null,
            episode_end: null,
            label: em.title.romaji,
            kind: KIND_BY_FORMAT[em.format ?? ''] ?? 'season',
            afl_slug: cand.slug,
            afl_offset: 0,
          });
          if (exErr) throw new Error(`extra component (${cand.slug}/${em.id}): ${exErr.message}`);
        }
      }

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
