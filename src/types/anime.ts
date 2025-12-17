export type EpisodeType = 'canon' | 'filler' | 'anime-only-canon';

export type TrackingSite = 'mal' | 'anilist';
export type StreamingService = 'crunchyroll' | 'netflix' | 'amazon' | 'disney-hulu' | 'bilibili' | 'hidive';

export const TRACKING_SITES: { value: TrackingSite; label: string }[] = [
  { value: 'mal', label: 'MyAnimeList' },
  { value: 'anilist', label: 'AniList' },
];

export const STREAMING_SERVICES: { value: StreamingService; label: string }[] = [
  { value: 'crunchyroll', label: 'Crunchyroll' },
  { value: 'netflix', label: 'Netflix' },
  { value: 'amazon', label: 'Amazon Prime Video' },
  { value: 'disney-hulu', label: 'Disney+/Hulu' },
  { value: 'bilibili', label: 'Bilibili' },
  { value: 'hidive', label: 'HiDive' },
];

export interface MangaMapping {
  volume: number;
  chapters: string; // e.g., "1-3" or "45"
}

export interface Episode {
  number: number;
  title: string;
  type: EpisodeType;
  mangaMapping: MangaMapping | null; // null for filler/anime-only
  airDate: string;
}

export interface SourceRanking {
  trackingSite: TrackingSite;
  streamingService: StreamingService;
  rank: number;
}

export interface AnimeSeries {
  id: string;
  title: string;
  japaneseTitle: string;
  coverImage: string;
  currentEpisode: number;
  totalEpisodes: number | null; // null if ongoing
  status: 'airing' | 'completed' | 'upcoming';
  hasManga: boolean;
  episodes: Episode[];
  rankings: SourceRanking[];
  genres: string[];
  synopsis: string;
}
