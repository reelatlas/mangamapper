export type EpisodeType = 'canon' | 'mixed' | 'filler' | 'anime-only-canon';

export type SourceType = 'manga' | 'webtoon' | 'light_novel' | 'original';

// A contiguous run of episodes sharing one type — the unit of the filler density strip
export interface EpisodeSpan {
  start: number; // inclusive episode number
  end: number;   // inclusive
  type: EpisodeType;
}

// Where to pick up the source material after the latest aired episode
export interface ContinuePoint {
  episode: number;          // the episode this continue point is relative to
  volume: number | null;
  chapters: string | null;  // e.g. "1093"
}

// Per-series summary powering the comparison-first UI
export interface MappingSummary {
  airedEpisodes: number;
  sourceType: SourceType;
  spans: EpisodeSpan[];
  canonCount: number;
  mixedCount: number;
  fillerCount: number;
  animeOnlyCount: number;
  fillerPercent: number;          // 0-100, rounded
  continueFrom: ContinuePoint | null; // null when there is no source material
  latestKnown: ContinuePoint | null;  // latest episode with a confirmed manga mapping
  // Canon source material never (or not yet) animated — the manga_only zone
  mangaAheadChapters: number | null;  // published chapters beyond anime coverage
  mangaAheadUnits: number;            // same, in episode-equivalents (for strip proportions)
}

export type AnimeStatus = 'airing' | 'finished' | 'hiatus' | 'upcoming';
export type MangaStatus = 'publishing' | 'finished' | 'hiatus' | 'anime_only';

export type TrackingSite = 'mal' | 'anilist';
export type StreamingService = 'all' | 'crunchyroll' | 'netflix' | 'amazon' | 'disney-hulu' | 'bilibili' | 'hidive';

export const TRACKING_SITES: { value: TrackingSite; label: string }[] = [
  { value: 'mal', label: 'MAL' },
  { value: 'anilist', label: 'AniList' },
];

export const STREAMING_SERVICES: { value: StreamingService; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'crunchyroll', label: 'crunchyroll' },
  { value: 'netflix', label: 'netflix' },
  { value: 'amazon', label: 'prime video' },
  { value: 'disney-hulu', label: 'disney+/hulu' },
  { value: 'bilibili', label: 'bilibili' },
  { value: 'hidive', label: 'hidive' },
];

export interface MangaMapping {
  // null when the source knows the chapter but not the volume (AFG anchors);
  // display sites render the vol: segment conditionally.
  volume: number | null;
  chapters: string; // e.g., "1-3" or "45"
}

export interface Episode {
  number: number;
  title: string;
  type: EpisodeType;
  mangaMapping: MangaMapping | null; // null for filler/anime-only
  airDate: string;
}

export interface TrackingRanking {
  mal: number;      // MAL popularity rank for currently airing
  anilist: number;  // AniList popularity rank for currently airing
}

export interface AnimeSeries {
  id: string;
  title: string;
  japaneseTitle: string;
  coverImage: string;
  currentEpisode: number;
  totalEpisodes: number | null;
  status: AnimeStatus;
  mangaStatus: MangaStatus;
  hasManga: boolean;
  // SOURCE SCOPE: the range of the source material THIS series entry adapts.
  // A franchise split into distinct series (Naruto → Shippuden) is separate
  // entries, each scoped to its own portion — never lumped. Totals are the
  // scope's END (absolute numbering); start fields mark where the scope
  // BEGINS (null = starts at vol/ch 1, e.g. a first series). Sequels like
  // Bleach TYBW start mid-manga (vol 55 / ch 480).
  totalVolumes: number | null;   // last volume in this entry's scope (null = no source)
  totalChapters: number | null;  // last chapter in this entry's scope (null = no source)
  mangaStartVolume: number | null;
  mangaStartChapter: number | null;
  episodes: Episode[];
  // every name the series answers to (english/romaji/native + synonyms),
  // lowercased — the field's grep haystack beyond the display title
  searchText?: string;
  ranking: TrackingRanking;
  streamingOn: StreamingService[]; // Which services have this anime
  genres: string[];
  synopsis: string;
}
