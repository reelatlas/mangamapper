import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { catalog, type ListOptions } from '@/data/catalog';

export const catalogKeys = {
  list: (options: ListOptions) => ['catalog', 'list', options] as const,
  search: (query: string) => ['catalog', 'search', query] as const,
  series: (id: string) => ['catalog', 'series', id] as const,
  mapping: (id: string) => ['catalog', 'mapping', id] as const,
};

export const useCatalogList = (options: ListOptions) =>
  useQuery({
    queryKey: catalogKeys.list(options),
    queryFn: () => catalog.list(options),
    placeholderData: keepPreviousData,
  });

export const useCatalogSearch = (query: string) =>
  useQuery({
    queryKey: catalogKeys.search(query),
    queryFn: () => catalog.search(query),
    enabled: query.trim().length > 0,
    placeholderData: keepPreviousData,
  });

export const useCatalogSeries = (id: string | undefined) =>
  useQuery({
    queryKey: catalogKeys.series(id ?? ''),
    queryFn: () => catalog.getById(id!),
    enabled: !!id,
  });

export const useCatalogMapping = (id: string | undefined) =>
  useQuery({
    queryKey: catalogKeys.mapping(id ?? ''),
    queryFn: () => catalog.getMapping(id!),
    enabled: !!id,
  });
