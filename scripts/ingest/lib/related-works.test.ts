// I45 — the related-works derivation, pure
import { describe, expect, it } from 'vitest';
import { deriveWatchPosition, extraBucket, extraKind, extraStanding, freePosition, type ExtraMedia } from './related-works';

const media = (o: Partial<ExtraMedia> & { id: number }): ExtraMedia => ({ title: { romaji: 'x', english: null }, format: 'MOVIE', status: 'FINISHED', source: 'MANGA', relations: { edges: [] }, ...o });
const manga = (id: number) => ({ relationType: 'ADAPTATION', node: { id, type: 'MANGA', format: 'MANGA', popularity: 100, title: { romaji: `m${id}` } } });

describe('extraBucket (I45)', () => {
  const owner = { mangaId: 30011, chainWorkIds: [87178] };
  it('SUMMARY / COMPILATION relations are recaps, whatever the media says; a recap title too', () => {
    expect(extraBucket(['SUMMARY'], null, owner)).toBe('recap');
    expect(extraBucket(['SIDE_STORY'], media({ id: 1, title: { romaji: 'Naruto: Recap Special' } }), owner)).toBe('recap');
  });
  it('a CHARACTER-only edge is a crossover; an unstaged story extra is unstaged', () => {
    expect(extraBucket(['CHARACTER'], null, owner)).toBe('crossover');
    expect(extraBucket(['SIDE_STORY'], null, owner)).toBe('unstaged');
  });
  it('source ORIGINAL is original; the owner\'s own manga or a chain work is same_instrument; another manga is other_instrument', () => {
    expect(extraBucket(['SIDE_STORY'], media({ id: 2, source: 'ORIGINAL' }), owner)).toBe('original');
    expect(extraBucket(['SIDE_STORY'], media({ id: 3, relations: { edges: [manga(30011)] } }), owner)).toBe('same_instrument');
    expect(extraBucket(['SIDE_STORY'], media({ id: 4, relations: { edges: [manga(87178)] } }), owner)).toBe('same_instrument');
    expect(extraBucket(['SIDE_STORY'], media({ id: 5, relations: { edges: [manga(99999)] } }), owner)).toBe('other_instrument');
  });
  it('an instrument source with no manga edge is unknown (held for Sean); a game source is original (no instrument)', () => {
    expect(extraBucket(['SIDE_STORY'], media({ id: 6, source: 'LIGHT_NOVEL' }), owner)).toBe('unknown');
    expect(extraBucket(['SIDE_STORY'], media({ id: 7, source: 'VIDEO_GAME' }), owner)).toBe('original');
  });
});

describe('extraStanding / extraKind', () => {
  it('recaps, originals and crossovers are filler BY RULE; same- and other-instrument extras are pending', () => {
    expect(extraStanding('recap')).toBe('filler');
    expect(extraStanding('original')).toBe('filler');
    expect(extraStanding('crossover')).toBe('filler');
    expect(extraStanding('same_instrument')).toBeNull();
    expect(extraStanding('unknown')).toBeNull();
  });
  it('kind follows the format, except a recap is always kind recap', () => {
    expect(extraKind('MOVIE', 'original')).toBe('movie');
    expect(extraKind('OVA', 'same_instrument')).toBe('ova');
    expect(extraKind('SPECIAL', 'recap')).toBe('recap');
    expect(extraKind('TV', 'recap')).toBe('recap');
  });
});

describe('deriveWatchPosition / freePosition', () => {
  const eps = [{ number: 1, air_date: '2020-01-05' }, { number: 2, air_date: '2020-01-12' }, { number: 3, air_date: '2020-01-19' }];
  it('after the last episode aired on or before the date; 0.5 before the first; null without a date', () => {
    expect(deriveWatchPosition('2020-01-15', eps)).toBe(2.5);
    expect(deriveWatchPosition('2020-01-12', eps)).toBe(2.5);
    expect(deriveWatchPosition('2019-12-01', eps)).toBe(0.5);
    expect(deriveWatchPosition('2021-01-01', eps)).toBe(3.5);
    expect(deriveWatchPosition(null, eps)).toBeNull();
  });
  it('a taken position steps by 0.01 so same-day works keep their order', () => {
    expect(freePosition(2.5, new Set([2.5, 2.51]))).toBe(2.52);
    expect(freePosition(2.5, new Set())).toBe(2.5);
  });
});
