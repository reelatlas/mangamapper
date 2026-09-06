// G58 (amended 2026-09-06) — the airing writer fix, pure: what a series is resolved from, the queue order, the resolve debt.
import { describe, expect, it } from 'vitest';
import { resolveDebt, resolveInputsOf, resolveOrder } from './anilist-refresh';

describe('resolveInputsOf (G58 — exactly what the resolvers read)', () => {
  it('an AFL-slug series with one ranged component reads its HEAD (resolveSeries)', () => {
    expect(resolveInputsOf({ id: 'one-piece', aflSlug: 'one-piece', headId: 21, comps: [{ anilistId: 21, ranged: true }] })).toEqual({ seriesId: 'one-piece', aflSlug: 'one-piece', inputs: [21], mode: 'afl' });
  });
  it('a stitched series reads its RANGED components only — order-only films never feed aired / totals', () => {
    expect(resolveInputsOf({ id: 'bleach', aflSlug: 'bleach', headId: 269, comps: [{ anilistId: 269, ranged: true }, { anilistId: 116674, ranged: true }, { anilistId: 999, ranged: false }] }).inputs).toEqual([269, 116674]);
    expect(resolveInputsOf({ id: 'bleach', aflSlug: 'bleach', headId: 269, comps: [{ anilistId: 269, ranged: true }, { anilistId: 116674, ranged: true }] }).mode).toBe('volatile');
  });
  it('a seeded series with no AFL page reads its ranged component through the volatile refresh — the daily loop skipped 53 of these before 2026-09-06', () => {
    expect(resolveInputsOf({ id: 'tokyo-babylon', aflSlug: null, headId: 1043, comps: [{ anilistId: 1043, ranged: true }] })).toEqual({ seriesId: 'tokyo-babylon', aflSlug: null, inputs: [1043], mode: 'volatile' });
  });
  it('nothing to read = none (no debt possible)', () => {
    expect(resolveInputsOf({ id: 'x', aflSlug: null, headId: 5, comps: [{ anilistId: 5, ranged: false }] }).mode).toBe('none');
    expect(resolveInputsOf({ id: 'y', aflSlug: 'y', headId: null, comps: [] }).mode).toBe('none');
  });
});

describe('resolveOrder (G58 — airing first, then the oldest resolve, never updated_at)', () => {
  it('airing / upcoming series lead; a never-resolved series is the oldest; ties by id', () => {
    const q = resolveOrder([
      { seriesId: 'finished-old', airing: false, resolvedAt: '2026-09-01T00:00:00Z' },
      { seriesId: 'airing-fresh', airing: true, resolvedAt: '2026-09-06T00:00:00Z' },
      { seriesId: 'finished-never', airing: false, resolvedAt: null },
      { seriesId: 'airing-old', airing: true, resolvedAt: '2026-08-30T00:00:00Z' },
      { seriesId: 'b-same', airing: false, resolvedAt: '2026-09-01T00:00:00Z' },
    ]);
    expect(q.map((x) => x.seriesId)).toEqual(['airing-old', 'airing-fresh', 'finished-never', 'b-same', 'finished-old']);
  });
});

describe('resolveDebt (G58 — content_hash ≠ resolved_hash past a day)', () => {
  const now = new Date('2026-09-06T12:00:00Z');
  it('a staged structure the row was not resolved from is a debt once it is older than the daily run\'s reach', () => {
    expect(resolveDebt([{ anilistId: 21, contentHash: 'b', resolvedHash: 'a', changedAt: '2026-09-03T08:34:00Z' }], now)).toHaveLength(1);
    expect(resolveDebt([{ anilistId: 21, contentHash: 'b', resolvedHash: null, changedAt: null }], now)).toHaveLength(1);
  });
  it("today's change is the daily run's to clear — not yet a debt; equal hashes never are", () => {
    expect(resolveDebt([{ anilistId: 21, contentHash: 'b', resolvedHash: 'a', changedAt: '2026-09-06T08:10:00Z' }], now)).toHaveLength(0);
    expect(resolveDebt([{ anilistId: 21, contentHash: 'a', resolvedHash: 'a', changedAt: '2026-09-01T00:00:00Z' }], now)).toHaveLength(0);
  });
});
