import { supabase } from '@/integrations/supabase/client';
import type {
  AnimeSeries,
  AnimeStatus,
  Episode,
  EpisodeSpan,
  EpisodeType,
  MangaStatus,
  MappingSummary,
  SourceType,
  StreamingService,
} from '@/types/anime';
import { lastChapterNumber } from '@/lib/mapping';
import type { CatalogSource, ListOptions } from './source';

// The real catalog: canonical tables filled by scripts/ingest/ (AFL episode
// types + AniList metadata + AFG chapter anchors — docs/data-pipeline.md).
// The app reads ONLY this database; external APIs never appear on a user path.

type SeriesRow = {
  id: string;
  title: string;
  title_native: string | null;
  cover_url: string | null;
  status: string;
  source_type: string;
  manga_status: string | null;
  manga_anilist_id: number | null;
  aired_episodes: number;
  total_episodes: number | null;
  total_volumes: number | null;
  total_chapters: number | null;
  manga_start_volume: number | null;
  manga_start_chapter: number | null;
  popularity: number;
  genres: string[];
  synopsis_html: string | null;
  external_links: { site: string; type: string | null }[];
  search_text: string;
};

const SERIES_COLS =
  'id, title, title_native, cover_url, status, source_type, manga_status, manga_anilist_id, aired_episodes, total_episodes, total_volumes, total_chapters, manga_start_volume, manga_start_chapter, popularity, genres, synopsis_html, external_links, search_text';

type EpisodeRow = { number: number; title: string; type: string; air_date: string | null };
type AnchorRow = { episode: number; volume: number | null; chapter: number };

const STREAM_TOKENS: [RegExp, StreamingService][] = [
  [/crunchyroll/i, 'crunchyroll'],
  [/netflix/i, 'netflix'],
  [/amazon|prime video/i, 'amazon'],
  [/hulu|disney/i, 'disney-hulu'],
  [/bilibili/i, 'bilibili'],
  [/hidive/i, 'hidive'],
];

const streamingOn = (links: SeriesRow['external_links']): StreamingService[] => {
  const out = new Set<StreamingService>();
  for (const link of links ?? []) {
    if (link.type !== 'STREAMING') continue;
    for (const [re, token] of STREAM_TOKENS) if (re.test(link.site)) out.add(token);
  }
  return [...out];
};

type Boundary = { volume: number; chapter_start: number; chapter_end: number | null };

// Volume from chapter: real published boundaries first (Wikipedia-derived,
// volume_boundaries table), ratio estimate as fallback when totals are known,
// null otherwise (the UI omits vol: for those rows).
const volumeFor = (row: SeriesRow, chapter: number, boundaries: Boundary[]): number | null => {
  for (const b of boundaries) {
    if (chapter >= b.chapter_start && (b.chapter_end === null || chapter <= b.chapter_end)) return b.volume;
  }
  if (!row.total_volumes || !row.total_chapters) return null;
  return Math.min(row.total_volumes, Math.max(1, Math.ceil((chapter * row.total_volumes) / row.total_chapters)));
};

async function allBoundaries(mangaId: number | null): Promise<Boundary[]> {
  if (!mangaId) return [];
  const { data, error } = await supabase
    .from('volume_boundaries')
    .select('volume, chapter_start, chapter_end')
    .eq('manga_anilist_id', mangaId)
    .order('volume');
  if (error) throw error;
  return (data ?? []) as Boundary[];
}

const toEpisodes = (row: SeriesRow, eps: EpisodeRow[], anchors: AnchorRow[], boundaries: Boundary[]): Episode[] => {
  const anchorByEp = new Map(anchors.map((a) => [a.episode, a]));
  return eps.map((e) => {
    const anchor = anchorByEp.get(e.number);
    const type = e.type as EpisodeType;
    const mappable = type === 'canon' || type === 'mixed';
    return {
      number: e.number,
      title: e.title,
      type,
      mangaMapping:
        mappable && anchor
          ? {
              volume: anchor.volume ?? volumeFor(row, anchor.chapter, boundaries),
              chapters: String(anchor.chapter),
            }
          : null,
      airDate: e.air_date ?? '',
    };
  });
};

const toAnimeSeries = (row: SeriesRow, rank: number, episodes: Episode[], publishedVolumes = 0): AnimeSeries => ({
  id: row.id,
  title: row.title,
  japaneseTitle: row.title_native ?? row.title,
  coverImage: row.cover_url ?? '',
  currentEpisode: row.aired_episodes,
  totalEpisodes: row.total_episodes,
  status: row.status as AnimeStatus,
  mangaStatus: (row.manga_status ?? 'anime_only') as MangaStatus,
  hasManga: row.manga_status !== null && row.manga_status !== 'anime_only',
  // ongoing manga: AniList totals are null — published volume count (from
  // real boundaries) stands in as the latest-known denominator
  totalVolumes: row.total_volumes ?? (publishedVolumes || null),
  totalChapters: row.total_chapters,
  mangaStartVolume: row.manga_start_volume,
  mangaStartChapter: row.manga_start_chapter,
  episodes,
  searchText: row.search_text || undefined,
  ranking: { mal: rank, anilist: rank },
  streamingOn: streamingOn(row.external_links),
  genres: row.genres ?? [],
  synopsis: (row.synopsis_html ?? '').replace(/<[^>]+>/g, ''),
});

// PostgREST caps selects at 1000 rows; long runs (One Piece) need paging.
async function allEpisodes(seriesId: string): Promise<EpisodeRow[]> {
  const out: EpisodeRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('episodes')
      .select('number, title, type, air_date')
      .eq('series_id', seriesId)
      .order('number')
      .range(from, from + 999);
    if (error) throw error;
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function allAnchors(seriesId: string): Promise<AnchorRow[]> {
  const out: AnchorRow[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from('chapter_anchors')
      .select('episode, volume, chapter')
      .eq('series_id', seriesId)
      .order('episode')
      .range(from, from + 999);
    if (error) throw error;
    out.push(...((data ?? []) as AnchorRow[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function fetchSeriesRow(id: string): Promise<SeriesRow | null> {
  const { data, error } = await supabase.from('series').select(SERIES_COLS).eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as SeriesRow | null) ?? null;
}

// Contiguous same-type runs; classification gaps and the not-yet-classified
// tail default to canon (the overwhelmingly common type for fresh episodes).
const buildSpans = (eps: EpisodeRow[], aired: number, fallback: EpisodeType): EpisodeSpan[] => {
  if (!eps.length) return aired > 0 ? [{ start: 1, end: aired, type: fallback }] : [];
  const spans: EpisodeSpan[] = [];
  for (const e of eps) {
    if (e.number < 1) continue; // episode 0 stays visible in lists, not in strip math
    const type = e.type as EpisodeType;
    const prev = spans[spans.length - 1];
    if (prev && prev.type === type && e.number === prev.end + 1) prev.end = e.number;
    else if (prev && e.number <= prev.end) continue;
    else if (prev && prev.type === 'canon' && type === 'canon') prev.end = e.number; // gap folds into canon
    else spans.push({ start: e.number, end: e.number, type });
  }
  const last = spans[spans.length - 1];
  if (last && aired > last.end) {
    if (last.type === 'canon') last.end = aired;
    else spans.push({ start: last.end + 1, end: aired, type: 'canon' });
  }
  return spans;
};

const buildMapping = (row: SeriesRow, eps: EpisodeRow[], anchors: AnchorRow[], boundaries: Boundary[]): MappingSummary => {
  const sourceType = row.source_type as SourceType;
  const hasSource = sourceType !== 'original' && row.manga_status !== 'anime_only';
  const aired = Math.max(row.aired_episodes, eps.reduce((m, e) => Math.max(m, e.number), 0));

  const spans = buildSpans(eps, aired, hasSource ? 'canon' : 'anime-only-canon');
  const counts = { canon: 0, mixed: 0, filler: 0, 'anime-only-canon': 0 };
  for (const s of spans) counts[s.type] += s.end - s.start + 1;
  const total = counts.canon + counts.mixed + counts.filler + counts['anime-only-canon'];

  const latestAnchor = anchors.length ? anchors[anchors.length - 1] : null;
  const latestKnown =
    hasSource && latestAnchor
      ? {
          episode: latestAnchor.episode,
          volume: latestAnchor.volume ?? volumeFor(row, latestAnchor.chapter, boundaries),
          chapters: String(latestAnchor.chapter),
        }
      : null;
  const continueFrom =
    hasSource && latestAnchor
      ? {
          episode: latestAnchor.episode,
          volume: latestAnchor.volume ?? volumeFor(row, latestAnchor.chapter + 1, boundaries),
          chapters: String(latestAnchor.chapter + 1),
        }
      : null;

  const coveredChapter = latestKnown ? lastChapterNumber(latestKnown.chapters) : null;
  const scopeStartCh = row.manga_start_chapter ?? 1;
  const adaptedSpan = coveredChapter !== null ? coveredChapter - scopeStartCh + 1 : null;
  const canonEpisodes = counts.canon + counts.mixed;
  let mangaAheadChapters: number | null = null;
  let mangaAheadUnits = 0;
  if (
    hasSource &&
    row.total_chapters &&
    coveredChapter &&
    adaptedSpan &&
    adaptedSpan > 0 &&
    canonEpisodes > 0 &&
    row.total_chapters > coveredChapter
  ) {
    mangaAheadChapters = row.total_chapters - coveredChapter;
    mangaAheadUnits = Math.round(mangaAheadChapters * (canonEpisodes / adaptedSpan));
  }

  return {
    airedEpisodes: aired,
    sourceType,
    spans,
    canonCount: counts.canon,
    mixedCount: counts.mixed,
    fillerCount: counts.filler,
    animeOnlyCount: counts['anime-only-canon'],
    fillerPercent: total > 0 ? Math.round((counts.filler / total) * 100) : 0,
    continueFrom,
    latestKnown,
    mangaAheadChapters,
    mangaAheadUnits,
  };
};

export const supabaseCatalogSource: CatalogSource = {
  async list(options: ListOptions = {}) {
    let q = supabase.from('series').select(SERIES_COLS);
    if (options.status && options.status !== 'all') q = q.eq('status', options.status);
    q =
      options.sortBy === 'release_date'
        ? q.order('start_date', { ascending: false, nullsFirst: false })
        : q.order('popularity', { ascending: false });
    if (options.limit) q = q.limit(options.limit);
    const { data, error } = await q;
    if (error) throw error;
    // list stays shallow: episodes load when a card opens (getById/getMapping)
    return ((data ?? []) as SeriesRow[]).map((row, i) => toAnimeSeries(row, i + 1, []));
  },

  async search(query: string) {
    const term = query.trim();
    if (!term) return [];
    const pattern = `%${term.replace(/[%_]/g, '')}%`;
    const { data, error } = await supabase
      .from('series')
      .select(SERIES_COLS)
      .ilike('search_text', pattern)
      .order('popularity', { ascending: false })
      .limit(50);
    if (error) throw error;
    return ((data ?? []) as SeriesRow[]).map((row, i) => toAnimeSeries(row, i + 1, []));
  },

  async getById(id: string) {
    const row = await fetchSeriesRow(id);
    if (!row) return null;
    const [eps, anchors, boundaries] = await Promise.all([
      allEpisodes(id),
      allAnchors(id),
      allBoundaries(row.manga_anilist_id),
    ]);
    const { count } = await supabase
      .from('series')
      .select('*', { count: 'exact', head: true })
      .gt('popularity', row.popularity);
    return toAnimeSeries(row, (count ?? 0) + 1, toEpisodes(row, eps, anchors, boundaries), boundaries.length);
  },

  async getMapping(id: string) {
    const row = await fetchSeriesRow(id);
    if (!row) return null;
    const [eps, anchors, boundaries] = await Promise.all([
      allEpisodes(id),
      allAnchors(id),
      allBoundaries(row.manga_anilist_id),
    ]);
    return buildMapping(row, eps, anchors, boundaries);
  },
};
