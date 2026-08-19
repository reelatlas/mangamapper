import type { CatalogSource } from './source';
import { mockCatalogSource } from './mockSource';

// The swap point: replace mockCatalogSource with an AniList-backed source
// (plus filler feed) and the entire read-only UI follows.
export const catalog: CatalogSource = mockCatalogSource;

export type { CatalogSource, ListOptions, StatusFilter, SortBy } from './source';
