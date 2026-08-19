export const normalizeUrl = (url: string): string => url.trim().replace(/\/+$/, '');

export const isSeriesUrlDefined = (readerUrl: string, seriesUrl: string | null): boolean => {
  if (!seriesUrl) return false;
  return normalizeUrl(seriesUrl) !== normalizeUrl(readerUrl);
};
