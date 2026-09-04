// P6 window guard (2026-09-04, the fist-of-the-blue-sky 1987 catch): a series
// window never runs backwards — an end date before the start is another
// media's date and is dropped (null), never stored; the census class
// episode_date_off_window reads the outcome. Pure; shared by chain.ts#aggregate
// and resolve.ts#resolveSeries.
export const windowedEnd = (start: string | null, end: string | null): string | null => (start && end && end < start ? null : end);
