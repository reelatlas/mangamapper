// G55 — the series-window identity gate, proven on the rows that ruled it
// (2026-08-26, batch 19 E2). Pure; no DB.
import { describe, expect, it } from 'vitest';
import { dateFit, disambiguatedTitles, offWindowRows, pageFitsSeries, seriesDatesInvalid } from './wiki-identity';

const kenshin = { start_date: '2023-07-07', end_date: '2025-03-21', status: 'finished' };

describe('dateFit (G55)', () => {
  it('refuses a namesake row dated decades before the series began (kenshin-2023 25)', () => {
    expect(dateFit(kenshin, '1996-08-28')).toBe('before_start');
  });
  it('accepts the series\' own rows, including the 45-day pre-air margin', () => {
    expect(dateFit(kenshin, '2023-12-15')).toBe('fits');
    expect(dateFit(kenshin, '2023-06-01')).toBe('fits');
  });
  it('refuses a row long after a FINISHED series ended, tolerates a late special window', () => {
    expect(dateFit(kenshin, '2027-01-01')).toBe('after_end');
    expect(dateFit(kenshin, '2025-12-01')).toBe('fits');
  });
  it('never binds an airing series\' tail or a series without dates', () => {
    expect(dateFit({ start_date: '2023-10-06', end_date: null, status: 'airing' }, '2030-01-01')).toBe('fits');
    expect(dateFit({ start_date: null }, '1990-01-01')).toBe('unknown');
  });
  it('does not window against an invalid end date (fist-of-the-blue-sky 1987 < 2006)', () => {
    const s = { start_date: '2006-10-05', end_date: '1987-03-05', status: 'finished' };
    expect(seriesDatesInvalid(s)).toBe(true);
    expect(dateFit(s, '2007-03-14')).toBe('fits');
  });
});

describe('offWindowRows (G55)', () => {
  it('lists TV rows only — episode 0 and non-tv formats are structurally exempt', () => {
    const rows = [
      { number: 0, air_date: '2014-11-09', format: null },
      { number: 16, air_date: '2027-06-24', format: 'special' },
      { number: 25, air_date: '1996-08-28', format: 'tv' },
      { number: 26, air_date: '1996-09-04', format: null },
      { number: 24, air_date: '2023-12-15', format: 'tv' },
    ];
    expect(offWindowRows('rurouni-kenshin-2023', kenshin, rows)).toEqual([
      { number: 25, date: '1996-08-28', fit: 'before_start' },
      { number: 26, date: '1996-09-04', fit: 'before_start' },
    ]);
  });
  it('honours the ruled acknowledgement (haruhi keeps its 2006 dates)', () => {
    const s = { start_date: '2009-04-03', end_date: '2009-10-09', status: 'finished' };
    expect(offWindowRows('the-melancholy-of-haruhi-suzumiya', s, [{ number: 1, air_date: '2006-04-02', format: 'tv' }])).toEqual([]);
  });
});

describe('page helpers', () => {
  it('pageFitsSeries rejects a page whose earliest year is far from ours', () => {
    expect(pageFitsSeries(kenshin, ['1996-01-10', '1996-01-17'])).toBe(false);
    expect(pageFitsSeries(kenshin, ['2023-07-07', null])).toBe(true);
    expect(pageFitsSeries({ start_date: null }, ['1996-01-10'])).toBe(true);
  });
  it('disambiguatedTitles strips a trailing parenthetical and uses the start year', () => {
    expect(disambiguatedTitles('Rurouni Kenshin (2023)', '2023-07-07')[0]).toBe('Rurouni Kenshin (2023 TV series)');
    expect(disambiguatedTitles('BEYBLADE X', null)).toEqual([]);
  });
});
