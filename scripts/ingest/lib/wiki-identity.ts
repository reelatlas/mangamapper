// Series-window identity gate (rule G55, 2026-08-26 — batch 19 E2, the
// namesake lesson). A Wikipedia episode list found by NAME can belong to a
// different show than ours: "List of Rurouni Kenshin episodes" is the 1996
// series (our rows 25-27 wore its titles and dates), "List of Beyblade
// episodes" is 2001 (beyblade-x 41-102 wore sixty-two of its rows), "List of
// Ranking of Kings episodes" is the 2021 main series (the Treasure Chest
// spin-off's ten rows wore its first ten). A per-page year check existed
// inline in the backfill and still let these through — the offset-lock and
// continuity paths merge pages the check never saw. The durable form is a
// PER-ROW predicate on the outcome: an episode dated before its series
// began, or long after a finished series ended, is not this series' data,
// whatever page it came from. One mechanism (P2) behind the writer gate
// (wiki-episodes-backfill refuses + flags), the census class
// (episode_date_off_window lists standing rows) and the purge.
//
// Exemptions are structural, never per-series guesses:
//   number ≤ 0 — a special numbered into the run (N7) airs when it likes;
//   format other than tv — OVAs / movies / specials sit outside the run
//     (angel-beats 16 is a 2015 special on a 2010 series), the T29 axis
//     already says so;
//   AIR_DATE_WINDOW_ACK — a ruled true deviation (haruhi's rows keep their
//     2006 first-air dates under 2009 numbering), reason + cite.
// A series whose own end_date precedes its start_date cannot be windowed —
// that is a series-row fault and is reported as such, not as row noise.
import { isAirDateWindowAcked } from './rulings/air-date-window';

/** how far a row may sit outside [start_date, end_date] and still be the series' own */
export const SERIES_WINDOW = { beforeStartDays: 45, afterEndDays: 400 } as const;

const DAY = 86_400_000;

export type WindowSeries = { start_date?: string | null; end_date?: string | null; status?: string | null };
export type WindowRow = { number: number; air_date?: string | null; format?: string | null };

export type DateFit = 'fits' | 'before_start' | 'after_end' | 'unknown';

/** the pure predicate: where does one air date sit against the series' run? `unknown` when the series has no start date (never refuses). */
export const dateFit = (series: WindowSeries, airDate: string | null | undefined): DateFit => {
  if (!airDate || !series.start_date) return 'unknown';
  const t = Date.parse(airDate);
  const start = Date.parse(series.start_date);
  if (Number.isNaN(t) || Number.isNaN(start)) return 'unknown';
  if (t < start - SERIES_WINDOW.beforeStartDays * DAY) return 'before_start';
  if (series.end_date && series.status === 'finished') {
    const end = Date.parse(series.end_date);
    if (!Number.isNaN(end) && end >= start && t > end + SERIES_WINDOW.afterEndDays * DAY) return 'after_end';
  }
  return 'fits';
};

/** series-row fault: an end date before the start date (fist-of-the-blue-sky carried 1987 < 2006) */
export const seriesDatesInvalid = (series: WindowSeries): boolean =>
  !!series.start_date && !!series.end_date && Date.parse(series.end_date) < Date.parse(series.start_date);

/** the structural exemptions — a row the window does not bind */
export const windowExempt = (seriesId: string, row: WindowRow): boolean =>
  row.number <= 0 || (row.format != null && row.format !== 'tv') || isAirDateWindowAcked(seriesId, row.number);

export type OffWindowRow = { number: number; date: string; fit: Exclude<DateFit, 'fits' | 'unknown'> };

/** the outcome check over standing rows: every bound row dated outside the series' window */
export const offWindowRows = (seriesId: string, series: WindowSeries, rows: WindowRow[]): OffWindowRow[] => {
  const out: OffWindowRow[] = [];
  for (const r of rows) {
    if (!r.air_date || windowExempt(seriesId, r)) continue;
    const fit = dateFit(series, r.air_date);
    if (fit === 'before_start' || fit === 'after_end') out.push({ number: r.number, date: String(r.air_date), fit });
  }
  return out.sort((a, b) => a.number - b.number);
};

/** the page-level pre-check (kept from the backfill's inline form): a page whose EARLIEST air date sits more than a year from our start is another show */
export const pageFitsSeries = (series: WindowSeries, pageDates: (string | null | undefined)[]): boolean => {
  const ours = series.start_date ? Number(String(series.start_date).slice(0, 4)) : null;
  const theirs = pageDates.map((d) => (d ? Number(String(d).slice(0, 4)) : NaN)).filter((y) => !Number.isNaN(y));
  if (ours == null || !theirs.length) return true;
  return Math.abs(Math.min(...theirs) - ours) <= 1;
};

/** year-disambiguated Wikipedia title forms for a namesake (a remake, a spin-off, a same-named earlier show) — generic, from the series' own start year */
/**
 * An ALL-CAPS title in Wikipedia's casing (2026-09-07, the gits-2026 lesson: AniList prints "THE GHOST IN THE SHELL", the article is
 * "The Ghost in the Shell (2026 TV series)" and MediaWiki titles are case-sensitive past the first letter). Words capitalised, the
 * small words lowered after the first; null when the title is not all caps (nothing to normalise). A heuristic CANDIDATE only —
 * a miss is a missing page, never a wrong one (G55 still gates every row by date).
 */
export const titleCased = (title: string): string | null => {
  const letters = title.replace(/[^A-Za-z]/g, '');
  if (!letters || letters !== letters.toUpperCase()) return null;
  const small = new Set(['a', 'an', 'the', 'and', 'or', 'of', 'in', 'on', 'at', 'to', 'for', 'by', 'with', 'from', 'no', 'wa', 'ga', 'ni', 'x']);
  return title
    .toLowerCase()
    .split(/(\s+)/)
    .map((w, i) => (i === 0 || !small.has(w) ? w.replace(/^([a-z])/, (m) => m.toUpperCase()) : w))
    .join('');
};

export const disambiguatedTitles = (title: string, startDate: string | null | undefined): string[] => {
  const base = title.replace(/\s*\([^)]*\)\s*$/, '').trim();
  const year = startDate ? String(startDate).slice(0, 4) : null;
  if (!base || !year) return [];
  return [`${base} (${year} TV series)`, `${base} (${year} anime)`, `${base} (${year} series)`];
};
