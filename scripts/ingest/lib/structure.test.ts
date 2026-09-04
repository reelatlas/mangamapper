// I39 — the component planner, proven on the rulings that built it
// (2026-08-26, batch 19 E4). Pure; no DB.
import { describe, expect, it } from 'vitest';
import { planComponents, type PlanMember } from './structure-plan';

const tv = (id: number, aired: number, label = `s${id}`): PlanMember => ({ id, aired, label, kind: 'season', closed: true });
const spans = (p: ReturnType<typeof planComponents>) => p.map((r) => `${r.anilist_id}:${r.episode_start}-${r.episode_end}:${r.kind}`);

describe('planComponents (I39)', () => {
  it('plain chain: running spans, no rulings', () => {
    expect(spans(planComponents('nobody', [tv(1, 12), tv(2, 13)]))).toEqual(['1:1-12:season', '2:13-25:season']);
  });
  it('a numbered extra after a member shifts what follows (durarara: the S1 special at 25)', () => {
    const p = planComponents('durarara', [tv(6746, 24), tv(20652, 12), tv(20879, 12), tv(20880, 12)]);
    expect(spans(p)).toEqual(['6746:1-24:season', '8408:25-25:special', '20652:26-37:season', '20879:38-49:season', '20880:50-61:season']);
  });
  it('an episode-0 extra precedes the chain (assassination-classroom)', () => {
    expect(spans(planComponents('assassination-classroom', [tv(20755, 22), tv(21170, 25)]))).toEqual(['21303:0-0:special', '20755:1-22:season', '21170:23-47:season']);
  });
  it('extras chain onto extras (angel-beats 10067 then 9062 ×2)', () => {
    expect(spans(planComponents('angel-beats', [tv(6547, 13)]))).toEqual(['6547:1-13:season', '10067:14-14:special', '9062:15-16:special']);
  });
  it('span overrides: episodeEnd (outlaw-star 24 → 26) and episodeStart (fate/UBW 0-12, 13-25)', () => {
    expect(spans(planComponents('outlaw-star', [tv(400, 24)]))).toEqual(['400:1-26:season']);
    expect(spans(planComponents('fate-stay-night-unlimited-blade-works', [tv(19603, 13), tv(20792, 13)]))).toEqual(['19603:0-12:season', '20792:13-25:season']);
  });
  it('an airing tail keeps a null end and an unaired member holds no span', () => {
    const p = planComponents('nobody', [tv(1, 12), { id: 2, aired: 5, label: 's2', kind: 'season', closed: false }, tv(3, 0)]);
    expect(spans(p)).toEqual(['1:1-12:season', '2:13-null:season', '3:null-null:season']);
  });
  it('order-only extras hold no span and do not shift the run', () => {
    const p = planComponents('nobody', [tv(1, 12), tv(2, 12)], [{ id: 9, after: 1 }]);
    expect(spans(p)).toEqual(['1:1-12:season', '9:null-null:season', '2:13-24:season']);
  });
});

import { windowedEnd } from './window';
describe('windowedEnd (P6 window guard, 2026-09-04)', () => {
  it('drops an end date that precedes the start (another media\'s date) and keeps a sane one', () => {
    expect(windowedEnd('2006-10-05', '1987-03-05')).toBeNull();
    expect(windowedEnd('2006-10-05', '2007-03-15')).toBe('2007-03-15');
    expect(windowedEnd(null, '2007-03-15')).toBe('2007-03-15');
    expect(windowedEnd('2006-10-05', null)).toBeNull();
  });
});
