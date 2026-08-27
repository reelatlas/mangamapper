import { seriesHasInstrument, seriesHasSource, sourceKindOf } from '../../../scripts/ingest/lib/rulings/source-kinds';
import type { AnimeSeries, EpisodeSpan, MappingSummary, SourceType } from '@/types/anime';
import { mockAnimeData, getFilteredAnime, searchAnime, getAnimeById } from '@/data/mockAnime';
import { lastChapterNumber } from '@/lib/mapping';
import type { CatalogSource, ListOptions } from './source';

// Simulated network latency so loading states are real and the AniList swap
// doesn't surprise the UI later.
const LATENCY_MS = 150;
const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), LATENCY_MS));

const SOURCE_TYPE_OVERRIDES: Record<string, SourceType> = {
  'dragon-ball-daima': 'original',
  'solo-leveling': 'webtoon',
};

// Full-run episode spans per series (approximating real filler distribution).
// Series absent from this map are treated as all-canon (or all anime-only
// when they have no source material).
const FILLER_SPANS: Record<string, EpisodeSpan[]> = {
  'one-piece': [
    { start: 1, end: 45, type: 'canon' },
    { start: 46, end: 47, type: 'filler' },
    { start: 48, end: 53, type: 'canon' },
    { start: 54, end: 61, type: 'filler' },
    { start: 62, end: 97, type: 'canon' },
    { start: 98, end: 99, type: 'filler' },
    { start: 100, end: 101, type: 'canon' },
    { start: 102, end: 102, type: 'filler' },
    { start: 103, end: 130, type: 'canon' },
    { start: 131, end: 143, type: 'filler' },
    { start: 144, end: 195, type: 'canon' },
    { start: 196, end: 206, type: 'filler' },
    { start: 207, end: 219, type: 'canon' },
    { start: 220, end: 226, type: 'filler' },
    { start: 227, end: 278, type: 'canon' },
    { start: 279, end: 283, type: 'filler' },
    { start: 284, end: 290, type: 'canon' },
    { start: 291, end: 292, type: 'filler' },
    { start: 293, end: 302, type: 'canon' },
    { start: 303, end: 303, type: 'filler' },
    { start: 304, end: 316, type: 'canon' },
    { start: 317, end: 319, type: 'filler' },
    { start: 320, end: 325, type: 'canon' },
    { start: 326, end: 336, type: 'filler' },
    { start: 337, end: 381, type: 'canon' },
    { start: 382, end: 384, type: 'filler' },
    { start: 385, end: 405, type: 'canon' },
    { start: 406, end: 407, type: 'filler' },
    { start: 408, end: 425, type: 'canon' },
    { start: 426, end: 429, type: 'filler' },
    { start: 430, end: 456, type: 'canon' },
    { start: 457, end: 458, type: 'filler' },
    { start: 459, end: 491, type: 'canon' },
    { start: 492, end: 492, type: 'filler' },
    { start: 493, end: 541, type: 'canon' },
    { start: 542, end: 542, type: 'mixed' },
    { start: 543, end: 574, type: 'canon' },
    { start: 575, end: 578, type: 'filler' },
    { start: 579, end: 589, type: 'canon' },
    { start: 590, end: 590, type: 'filler' },
    { start: 591, end: 625, type: 'canon' },
    { start: 626, end: 628, type: 'filler' },
    { start: 629, end: 652, type: 'canon' },
    { start: 653, end: 654, type: 'mixed' },
    { start: 655, end: 746, type: 'canon' },
    { start: 747, end: 750, type: 'filler' },
    { start: 751, end: 779, type: 'canon' },
    { start: 780, end: 782, type: 'filler' },
    { start: 783, end: 894, type: 'canon' },
    { start: 895, end: 896, type: 'filler' },
    { start: 897, end: 906, type: 'canon' },
    { start: 907, end: 907, type: 'filler' },
    { start: 908, end: 1028, type: 'canon' },
    { start: 1029, end: 1030, type: 'filler' },
    { start: 1031, end: 1122, type: 'canon' },
  ],
  naruto: [
    { start: 1, end: 25, type: 'canon' },
    { start: 26, end: 26, type: 'filler' },
    { start: 27, end: 96, type: 'canon' },
    { start: 97, end: 97, type: 'filler' },
    { start: 98, end: 100, type: 'canon' },
    { start: 101, end: 101, type: 'mixed' },
    { start: 102, end: 135, type: 'canon' },
    { start: 136, end: 219, type: 'filler' },
    { start: 220, end: 220, type: 'mixed' },
  ],
  'black-clover': [
    { start: 1, end: 28, type: 'canon' },
    { start: 29, end: 29, type: 'filler' },
    { start: 30, end: 65, type: 'canon' },
    { start: 66, end: 66, type: 'filler' },
    { start: 67, end: 81, type: 'canon' },
    { start: 82, end: 82, type: 'filler' },
    { start: 83, end: 122, type: 'canon' },
    { start: 123, end: 125, type: 'filler' },
    { start: 126, end: 133, type: 'canon' },
    { start: 134, end: 135, type: 'filler' },
    { start: 136, end: 157, type: 'canon' },
    { start: 158, end: 158, type: 'filler' },
    { start: 159, end: 167, type: 'canon' },
    { start: 168, end: 168, type: 'filler' },
    { start: 169, end: 170, type: 'canon' },
  ],
  'my-hero-academia': [
    { start: 1, end: 57, type: 'canon' },
    { start: 58, end: 58, type: 'filler' },
    { start: 59, end: 63, type: 'canon' },
    { start: 64, end: 64, type: 'filler' },
    { start: 65, end: 103, type: 'canon' },
    { start: 104, end: 104, type: 'filler' },
    { start: 105, end: 112, type: 'canon' },
    { start: 113, end: 114, type: 'filler' },
    { start: 115, end: 153, type: 'canon' },
  ],
  'spy-x-family': [
    { start: 1, end: 11, type: 'canon' },
    { start: 12, end: 12, type: 'mixed' },
    { start: 13, end: 24, type: 'canon' },
    { start: 25, end: 25, type: 'mixed' },
    { start: 26, end: 34, type: 'canon' },
    { start: 35, end: 35, type: 'filler' },
    { start: 36, end: 37, type: 'canon' },
  ],
};

const getSourceType = (anime: AnimeSeries): SourceType =>
  SOURCE_TYPE_OVERRIDES[anime.id] ?? (anime.hasManga ? 'manga' : 'original');

// "read from here next": last mapped chapter + 1
const estimateNextChapter = (chapters: string): string | null => {
  const parsed = lastChapterNumber(chapters);
  return parsed === null ? null : String(parsed + 1);
};

const buildMapping = (anime: AnimeSeries): MappingSummary => {
  const aired = anime.currentEpisode;
  const sourceType = getSourceType(anime);
  const hasSource = seriesHasSource(sourceType);
  const hasInstrument = seriesHasInstrument(sourceType);

  const spans: EpisodeSpan[] = FILLER_SPANS[anime.id] ?? [
    { start: 1, end: aired, type: 'canon' },
  ];

  const counts = { canon: 0, mixed: 0, filler: 0 };
  for (const span of spans) {
    counts[span.type] += span.end - span.start + 1;
  }
  const total = counts.canon + counts.mixed + counts.filler;

  // A series can end on filler (Naruto: eps 219-220 have no mapping), so the
  // latest CONFIRMED mapping is the newest episode that has one.
  const latest = anime.episodes.find((e) => e.mangaMapping) ?? null;
  const latestKnown =
    hasSource && latest?.mangaMapping
      ? {
          episode: latest.number,
          volume: latest.mangaMapping.volume,
          chapters: latest.mangaMapping.chapters,
        }
      : null;
  const continueFrom =
    hasSource && latest?.mangaMapping
      ? {
          episode: latest.number,
          volume: latest.mangaMapping.volume,
          chapters: estimateNextChapter(latest.mangaMapping.chapters) ?? latest.mangaMapping.chapters,
        }
      : null;

  // manga_only zone: published canon chapters the anime hasn't covered,
  // expressed in episode-equivalents at CANON pacing (hypothetical future
  // episodes have no filler) so the strip and lookup share one coordinate space
  const coveredChapter = latestKnown?.chapters ? lastChapterNumber(latestKnown.chapters) : null;
  const scopeStartCh = anime.mangaStartChapter ?? 1;
  const adaptedSpan = coveredChapter !== null ? coveredChapter - scopeStartCh + 1 : null;
  const canonEpisodes = counts.canon + counts.mixed;
  let mangaAheadChapters: number | null = null;
  let mangaAheadUnits = 0;
  if (hasSource && anime.totalChapters && coveredChapter && adaptedSpan && adaptedSpan > 0 && canonEpisodes > 0 && anime.totalChapters > coveredChapter) {
    mangaAheadChapters = anime.totalChapters - coveredChapter;
    mangaAheadUnits = Math.round(mangaAheadChapters * (canonEpisodes / adaptedSpan));
  }

  return {
    airedEpisodes: aired,
    sourceType,
    hasSource,
    hasInstrument,
    spans,
    canonCount: counts.canon,
    mixedCount: counts.mixed,
    fillerCount: counts.filler,
    tailBadge: hasInstrument ? sourceKindOf(sourceType)?.tailBadge ?? null : null,
    sourceLabel: sourceKindOf(sourceType)?.seriesLabel ?? sourceKindOf(sourceType)?.noun ?? 'source',
    fillerPercent: total > 0 ? Math.round((counts.filler / total) * 100) : 0,
    continueFrom,
    latestKnown,
    mangaAheadChapters,
    mangaAheadUnits,
  };
};

export const mockCatalogSource: CatalogSource = {
  list: (options: ListOptions = {}) => delay(getFilteredAnime(options)),
  search: (query: string) => delay(searchAnime(query)),
  getById: (id: string) => delay(getAnimeById(id) ?? null),
  getMapping: (id: string) => {
    const anime = getAnimeById(id);
    return delay(anime ? buildMapping(anime) : null);
  },
};

// Used by phase-2 library components that still need sync title/cover lookup;
// goes away when those are reworked onto the async catalog.
export { mockAnimeData };
