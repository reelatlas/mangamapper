export type SortOption = 'alpha-asc' | 'alpha-desc' | 'date-desc' | 'date-asc';

export interface AnimeProgress {
  id: string;
  anime_id: string;
  last_watched_episode: number | null;
  last_read_volume: number | null;
  last_read_chapter: string | null;
  in_library: boolean;
  notes: string | null;
  updated_at: string;
}

export interface ReaderSite {
  id: string;
  name: string;
  url: string;
  notes: string | null;
  anime_id: string | null;
  series_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeriesAssignment {
  animeId: string;
  seriesUrl: string;
  suffix: string;
  existingId?: string;
  userModified?: boolean;
}

export interface ReaderAssignment {
  readerName: string;
  readerUrl: string;
  seriesUrl: string;
  suffix: string;
  existingSiteId?: string;
  userModified?: boolean;
}

export const getReadersForAnime = (animeId: string, readerSites: ReaderSite[]): ReaderSite[] => {
  return readerSites.filter(site => site.anime_id === animeId);
};
