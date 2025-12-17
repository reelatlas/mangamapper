export type EpisodeType = 'canon' | 'filler' | 'anime-only-canon';

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
  popularity: number; // ranking score
  genres: string[];
  synopsis: string;
}
