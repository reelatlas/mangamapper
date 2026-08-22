import type { CatalogSource } from './source';
import { supabaseCatalogSource } from './supabaseSource';

// THE SWAP happened 2026-08-22: the catalog reads our Supabase canonical
// (AFL types + AniList metadata + AFG anchors — docs/data-pipeline.md).
// mockSource stays in-tree for offline reference; swap back here if needed.
export const catalog: CatalogSource = supabaseCatalogSource;

export type { CatalogSource, ListOptions, StatusFilter, SortBy } from './source';
