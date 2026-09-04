// Chain walking + aggregation: the single source of truth for turning one
// AniList entry into its full season chain and that chain into a canonical
// series row. Used by stitch.ts (AFL-driven), afg-expansion.ts and
// afg-extend.ts (AFG-driven). Extracted from stitch.ts 2026-08-24.
//
// The OWNERSHIP GUARD (Sean's :re ruling): a walk never crosses into an
// AniList entry that already belongs to another canonical series — deliberate
// splits (Bleach → TYBW, Tokyo Ghoul → :re, Naruto → Shippuden) are safe by
// construction, whatever any source's continuous numbering suggests.

import { windowedEnd } from './window';
import { db, selectAll } from './db';
import { mediaByIds, type AniListMedia } from './anilist';
import { stageAniList, searchTextFor } from './resolve';
import { slugify } from './slug';
import { deriveSourceKind, mangaStatusOf, seriesHasSource } from './rulings/source-kinds';
import { deriveSourceRelation, pickMangaNode } from './rulings/source-relations';
import { ruledChapterSpace } from './rulings/chapter-spaces';
import { planComponents, type PlanMember } from './structure-plan';

export const SERIES_FORMATS = new Set(['TV', 'TV_SHORT', 'ONA']);
// In-flow movies/OVAs join the chain when the TV path dead-ends before the
// target numbering is covered (Initial D Third Stage, HxH Greed Island).
export const BRIDGE_FORMATS = new Set(['MOVIE', 'OVA', 'SPECIAL']);
export const KIND_BY_FORMAT: Record<string, string> = {
  MOVIE: 'movie',
  OVA: 'ova',
  SPECIAL: 'special',
};
export const MAX_CHAIN = 15;

const mediaCache = new Map<number, AniListMedia>();
export async function getMedia(id: number): Promise<AniListMedia | null> {
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

export function edges(media: AniListMedia, relationType: string, formats: Set<string> = SERIES_FORMATS) {
  return media.relations.edges.filter(
    (e) => e.relationType === relationType && e.node.type === 'ANIME' && formats.has(e.node.format ?? ''),
  );
}

export const aired = (m: AniListMedia) =>
  m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : m.episodes ?? 0;

export interface ChainResult {
  chain: AniListMedia[];
  ambiguity: string | null;
}

// Every AniList id already claimed by a canonical series (series.anilist_id +
// series_components.anilist_id), for the ownership guard. Pass excludeSeriesId
// to allow re-walking the caller's own series.
export async function ownedAnilistIds(excludeSeriesId?: string | null): Promise<Set<number>> {
  const owned = new Set<number>();
  for (const r of await selectAll<{ series_id: string; anilist_id: number | null }>('series_components', 'series_id, anilist_id')) {
    if (r.anilist_id != null && r.series_id !== excludeSeriesId) owned.add(r.anilist_id);
  }
  for (const r of await selectAll<{ id: string; anilist_id: number | null }>('series', 'id, anilist_id')) {
    if (r.anilist_id != null && r.id !== excludeSeriesId) owned.add(r.anilist_id);
  }
  return owned;
}

async function walkForward(
  head: AniListMedia,
  targetEps: number,
  seen: Set<number>,
  ownedByOthers: Set<number>,
): Promise<ChainResult> {
  // forward — stopping the moment the target numbering is covered, so a
  // sequel that is a SEPARATE series by ruling (Fairy Tail → 100 Years
  // Quest) never gets swallowed; the ownership guard hard-stops at ruled
  // splits even when the numbering runs on (Bleach → TYBW).
  const chain: AniListMedia[] = [head];
  let cur = head;
  let cum = aired(head);
  for (let i = 0; i < MAX_CHAIN; i++) {
    if (cum >= targetEps) break;
    const notOurs = (e: { node: { id: number } }) => !seen.has(e.node.id) && !ownedByOthers.has(e.node.id);
    let sequels = edges(cur, 'SEQUEL').filter(notOurs);
    if (!sequels.length) {
      sequels = edges(cur, 'SEQUEL', BRIDGE_FORMATS).filter(notOurs);
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

export async function walkChain(
  startId: number,
  targetEps: number,
  ownedByOthers: Set<number> = new Set(),
): Promise<ChainResult> {
  // back to the head — but never into another series' territory
  const start = await getMedia(startId);
  if (!start) return { chain: [], ambiguity: `start ${startId} unavailable` };
  let head = start;
  const seen = new Set<number>([head.id]);
  for (let i = 0; i < MAX_CHAIN; i++) {
    const prequels = edges(head, 'PREQUEL');
    if (!prequels.length) break;
    if (prequels.length > 1) return { chain: [], ambiguity: `multiple prequels at ${head.id}` };
    if (seen.has(prequels[0].node.id) || ownedByOthers.has(prequels[0].node.id)) break;
    const prev = await getMedia(prequels[0].node.id);
    if (!prev) break;
    head = prev;
    seen.add(head.id);
  }
  const walked = await walkForward(head, targetEps, seen, ownedByOthers);

  // PREQUEL edges can be chronological side stories, not series heads
  // (AniList marks the MONSTERS ONA as One Piece's prequel — same class that
  // once forced the berserk-2016 override). If the walked-back chain lands
  // far from the target, retry forward-only from the matched entry itself
  // and keep whichever numbering actually fits.
  if (head.id !== start.id) {
    const walkedSum = walked.chain.reduce((s, m) => s + aired(m), 0);
    if (walked.ambiguity || Math.abs(walkedSum - targetEps) > 2) {
      const direct = await walkForward(start, targetEps, new Set([start.id]), ownedByOthers);
      const directSum = direct.chain.reduce((s, m) => s + aired(m), 0);
      if (!direct.ambiguity && Math.abs(directSum - targetEps) < Math.abs(walkedSum - targetEps)) {
        return direct;
      }
    }
  }
  return walked;
}

export function aggregate(chain: AniListMedia[], aflSlug: string | null, fallbackTitle: string) {
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

  // derivative-manga rule holds here too: a source=ORIGINAL head never
  // claims its ADAPTATION edge (that manga adapts the anime)
  // I40: the same picker as resolve.ts — a ruled link (a parallel telling) wins
  const seriesId = slugify(head.title.english ?? head.title.romaji ?? fallbackTitle);
  const mangaEdge = pickMangaNode(head.relations.edges, seriesId) ?? undefined;
  const manga = head.source === 'ORIGINAL' ? undefined : mangaEdge;
  const sourceKindValue = deriveSourceKind(seriesId, { source: head.source, mangaCountry: mangaEdge ? mangaEdge.countryOfOrigin : null, hasMangaEdge: !!mangaEdge }).value;

  const dedupBy = <T>(items: T[], key: (t: T) => string) => {
    const m = new Map<string, T>();
    for (const i of items) if (!m.has(key(i))) m.set(key(i), i);
    return [...m.values()];
  };

  return {
    id: seriesId,
    afl_slug: aflSlug,
    anilist_id: head.id,
    mal_id: head.idMal,
    title: head.title.english ?? head.title.romaji ?? fallbackTitle,
    title_english: head.title.english,
    title_native: head.title.native,
    synonyms: dedupBy(chain.flatMap((m) => m.synonyms), (s) => s),
    cover_url: head.coverImage.extraLarge,
    cover_color: head.coverImage.color,
    banner_url: head.bannerImage,
    format: head.format,
    status,
    // T25: the shared registry derivation (unified with resolve.ts, T2 edge)
    source_type: sourceKindValue,
    source_relation: deriveSourceRelation(seriesId, seriesHasSource(sourceKindValue)), // I40
    start_date: head.startDate.year
      ? `${head.startDate.year}-${String(head.startDate.month ?? 1).padStart(2, '0')}-${String(head.startDate.day ?? 1).padStart(2, '0')}`
      : null,
    // P6 window guard (2026-09-04, the fist-of-the-blue-sky 1987 catch): an end before the start is another media's date — null, never stored
    end_date: windowedEnd(
      head.startDate.year ? `${head.startDate.year}-${String(head.startDate.month ?? 1).padStart(2, '0')}-${String(head.startDate.day ?? 1).padStart(2, '0')}` : null,
      status === 'finished' && tail.endDate.year
        ? `${tail.endDate.year}-${String(tail.endDate.month ?? 1).padStart(2, '0')}-${String(tail.endDate.day ?? 1).padStart(2, '0')}`
        : null,
    ),
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
    manga_status: mangaStatusOf(manga),
    ...ruledChapterSpace(seriesId, { total_volumes: manga?.volumes ?? null, total_chapters: manga?.chapters ?? null }), // N35
    manga_start_volume: null as number | null,
    manga_start_chapter: null as number | null,
    search_text: searchTextFor(
      [head.title.english, head.title.romaji, head.title.native, fallbackTitle,
        ...chain.map((m) => m.title.english), ...chain.map((m) => m.title.romaji)],
      chain.flatMap((m) => m.synonyms),
    ),
    updated_at: new Date().toISOString(),
  };
}

export { planComponents, type PlannedComponent, type PlanMember } from './structure-plan';

// Shared component writer: replaces a series' components with the plan —
// the chain's members with running episode ranges, ruled extras and span
// overrides (I39), and order-only extras = in-flow components without
// episode rows (Kizumonogatari pattern).
export async function writeComponents(
  seriesId: string,
  chain: AniListMedia[],
  aflSlug: string | null,
  extras?: { id: number; after: number }[],
) {
  const members: PlanMember[] = chain.map((m) => ({ id: m.id, aired: aired(m), label: m.title.romaji, kind: KIND_BY_FORMAT[m.format ?? ''] ?? 'season', closed: m.episodes != null || !!m.nextAiringEpisode }));
  const plan = planComponents(seriesId, members, extras);
  // order-only extras carry the AniList entry's own label and kind
  for (const row of plan) {
    if (row.label == null && extras?.some((x) => x.id === row.anilist_id)) {
      const em = await getMedia(row.anilist_id);
      if (em) { row.label = em.title.romaji; row.kind = KIND_BY_FORMAT[em.format ?? ''] ?? 'season'; }
    }
  }
  await db.from('series_components').delete().eq('series_id', seriesId);
  for (const row of plan) {
    const { error } = await db.from('series_components').insert({ series_id: seriesId, ...row, afl_slug: aflSlug, afl_offset: 0 });
    if (error) throw new Error(`component (${seriesId}/${row.anilist_id}): ${error.message}`);
  }
}
