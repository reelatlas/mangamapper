// G57 row provenance — the pure half. The five witnesses: a row another
// writer minted inside the AFL range must survive an AFL re-resolve.
import { describe, expect, it } from 'vitest';
import { staleOwnRows, writerOwns } from './minted';

describe('writerOwns', () => {
  it('a writer owns only rows it minted; an unstamped row is nobody\'s', () => {
    expect(writerOwns('afl', 'afl')).toBe(true);
    expect(writerOwns('wiki', 'afl')).toBe(false);
    expect(writerOwns(null, 'afl')).toBe(false);
  });
});

describe('staleOwnRows — the 5D\'s shape', () => {
  // AFL's translated payload runs 1..154 minus nothing; the DB holds 145 minted by the wiki backfill (AFL never carried it) and 150 minted by AFL but no longer on the page
  const existing = [
    { number: 144, minted_by: 'afl' }, { number: 145, minted_by: 'wiki' }, { number: 146, minted_by: 'afl' }, { number: 150, minted_by: 'afl' }, { number: 160, minted_by: 'afg' },
  ];
  const payload = [144, 146]; // AFL still carries 144 and 146, not 150
  it('deletes only the writer\'s own stale rows below the ceiling: 150, never the wiki row 145 nor the AFG tail 160', () => {
    expect(staleOwnRows(existing, payload, 'afl', 154).map((r) => r.number)).toEqual([150]);
  });
  it('a foreign writer touches only its own rows: the wiki writer carrying 145 deletes nothing; a wiki payload WITHOUT 145 would delete only 145', () => {
    expect(staleOwnRows(existing, [145], 'wiki', 154)).toEqual([]);
    expect(staleOwnRows(existing, [], 'wiki', 154).map((r) => r.number)).toEqual([145]);
  });
  it('an unstamped row is never deleted', () => {
    expect(staleOwnRows([{ number: 3, minted_by: null }], [], 'afl', 10)).toEqual([]);
  });
});
