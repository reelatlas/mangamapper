// G54 — the air-date order walk, proven on the shapes that ruled it
// (2026-08-26). Pure; no DB.
import { describe, expect, it } from 'vitest';
import { airdateOrderWalk, withholdAirdateRegressions } from './airdate-order';

const rows = (dates: (string | null)[], from = 1) => dates.map((d, i) => ({ number: from + i, air_date: d }));

describe('airdateOrderWalk (G54)', () => {
  it('withholds a predecessor spike when the run resumes (gto 31)', () => {
    const r = airdateOrderWalk('gto', rows(['2000-04-23', '2000-04-30', '2014-02-07', '2000-05-14', '2000-05-28'], 29));
    expect(r.withheld.map((w) => w.number)).toEqual([31]);
    expect(r.regressions).toEqual([]);
  });

  it('withholds a lone early date when nothing continues from it', () => {
    const r = airdateOrderWalk('x', rows(['2010-01-01', '2010-01-08', '2001-01-15', '2010-01-22']));
    expect(r.withheld.map((w) => w.number)).toEqual([3]);
  });

  it('withholds a last-row regression (no successor)', () => {
    const r = airdateOrderWalk('x', rows(['2024-06-28', '2024-07-05', '2001-10-15']));
    expect(r.withheld.map((w) => w.number)).toEqual([3]);
  });

  it('reports, never withholds, a block change (kenshin-2023 25-27 / beyblade-x 41-44)', () => {
    const r = airdateOrderWalk('x', rows(['2023-12-08', '2023-12-15', '1996-08-28', '1996-09-04', '1996-10-16'], 23));
    expect(r.withheld).toEqual([]);
    expect(r.regressions.map((x) => x.number)).toEqual([25]);
  });

  it('an alternating block resolves to a fixed point: named spikes go, the block change stays reported (dbz-kai)', () => {
    // 101-103 US dates (a block), then JP dates with US spikes at 106, 108
    const r = airdateOrderWalk('x', rows(['2017-01-28', '2017-02-04', '2014-04-20', '2014-04-27', '2017-02-25', '2014-05-04', '2017-03-11', '2014-05-11', '2014-05-18'], 102));
    expect(r.withheld.map((x) => x.number).sort()).toEqual([106, 108]);
    expect(r.regressions.map((x) => x.number)).toEqual([104]);
  });

  it('a strictly alternating tail with nothing to resume from is reported, not withheld', () => {
    const r = airdateOrderWalk('x', rows(['2017-01-28', '2017-02-04', '2014-04-20', '2014-04-27', '2017-02-25', '2014-05-04', '2017-03-11'], 102));
    expect(r.withheld).toEqual([]);
    expect(r.regressions.map((x) => x.number)).toEqual([104, 107]);
  });

  it('shallow regressions are the review queue, not withheld', () => {
    const r = airdateOrderWalk('x', rows(['2009-09-03', '2008-09-10', '2008-09-17'], 23));
    expect(r.withheld).toEqual([]);
    expect(r.regressions).toEqual([{ number: 24, date: '2008-09-10', against: 23, againstDate: '2009-09-03', days: 358 }]);
  });

  it('episode 0 is outside the walk (N7)', () => {
    const r = airdateOrderWalk('x', rows(['2018-04-10', '2012-01-06', '2012-01-13'], 0));
    expect(r.withheld).toEqual([]);
    expect(r.regressions).toEqual([]);
  });

  it('ruled deviations (AIRDATE_ORDER_ACK) are neither withheld nor reported', () => {
    const all = airdateOrderWalk('the-melancholy-of-haruhi-suzumiya', rows(['2009-09-11', '2006-04-02', '2006-06-18'], 24));
    expect(all.withheld).toEqual([]);
    expect(all.regressions).toEqual([]);
    const some = airdateOrderWalk('cowboy-bebop', rows(['1998-10-24', '1998-04-03', '1998-10-31'], 1));
    expect(some.regressions).toEqual([]);
    const unacked = airdateOrderWalk('cowboy-bebop', rows(['1999-09-03', '1999-04-10', '1999-04-17'], 23));
    expect(unacked.regressions.map((x) => x.number)).toEqual([24]);
  });

  it('a multi-year season gap is not a regression', () => {
    const r = airdateOrderWalk('x', rows(['2011-03-27', '2014-04-06', '2014-04-13'], 98));
    expect(r.withheld).toEqual([]);
    expect(r.regressions).toEqual([]);
  });

  it('a spike with no successor to confirm the resume is reported, not withheld (fail closed)', () => {
    const r = airdateOrderWalk('x', rows(['2000-04-30', '2014-02-07', '2000-05-14'], 30));
    expect(r.withheld).toEqual([]);
    expect(r.regressions.map((x) => x.number)).toEqual([32]);
  });

  it('withholdAirdateRegressions nulls the outlier and keeps the rest', () => {
    const { rows: out, withheld } = withholdAirdateRegressions('gto', rows(['2000-04-30', '2014-02-07', '2000-05-14', '2000-05-28'], 30));
    expect(withheld.map((w) => w.number)).toEqual([31]);
    expect(out.map((r) => r.air_date)).toEqual(['2000-04-30', null, '2000-05-14', '2000-05-28']);
  });
});
