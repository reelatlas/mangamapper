import type { AnimeSeries, MappingSummary } from '@/types/anime';

export type StatusFilter = 'all' | 'airing' | 'finished' | 'hiatus' | 'upcoming';
export type SortBy = 'popularity' | 'release_date';

export interface ListOptions {
  status?: StatusFilter;
  limit?: number;
  sortBy?: SortBy;
}

// The seam between the UI and wherever catalog data comes from.
// Today: mock data. Later: AniList (series) + a filler feed (spans),
// swapped in src/data/catalog/index.ts without touching components.
export interface CatalogSource {
  list(options?: ListOptions): Promise<AnimeSeries[]>;
  search(query: string): Promise<AnimeSeries[]>;
  getById(id: string): Promise<AnimeSeries | null>;
  getMapping(id: string): Promise<MappingSummary | null>;
}
