// I45 — the related-works derivation, pure
import { describe, expect, it } from 'vitest';
import { adaptedNodes, deriveWatchPosition, extraBucket, extraKind, extraStanding, freePosition, ownerInstrumentIds, type ExtraMedia } from './related-works';

const media = (o: Partial<ExtraMedia> & { id: number }): ExtraMedia => ({ title: { romaji: 'x', english: null }, format: 'MOVIE', status: 'FINISHED', source: 'MANGA', relations: { edges: [] }, ...o });
const manga = (id: number) => ({ relationType: 'ADAPTATION', node: { id, type: 'MANGA', format: 'MANGA', popularity: 100, title: { romaji: `m${id}` } } });
const novel = (id: number) => ({ relationType: 'ADAPTATION', node: { id, type: 'MANGA', format: 'NOVEL', popularity: 50, title: { romaji: `n${id}` } } });
const oneShot = (id: number) => ({ relationType: 'ADAPTATION', node: { id, type: 'MANGA', format: 'ONE_SHOT', popularity: 10, title: { romaji: `o${id}` } } });

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
  it('any non-original source with no manga edge is unknown (held for Sean): a novel film, a visual-novel or game film', () => {
    expect(extraBucket(['SIDE_STORY'], media({ id: 6, source: 'LIGHT_NOVEL' }), owner)).toBe('unknown');
    expect(extraBucket(['SIDE_STORY'], media({ id: 7, source: 'VISUAL_NOVEL' }), owner)).toBe('unknown');
  });
  it('T25 instrument sets: a novel owner registers no manga id — its NOVEL node comes from its own anime (KonoSuba: Legend of Crimson is same_instrument; SAO Progressive is another novel)', () => {
    const ids = ownerInstrumentIds({ sourceType: 'light_novel', mangaId: null, ownedMedia: [media({ id: 21202, relations: { edges: [novel(86238)] } })] });
    expect([...ids]).toEqual([86238]);
    const konosuba = { mangaId: null, instrumentIds: ids };
    expect(extraBucket(['SEQUEL'], media({ id: 102976, source: 'LIGHT_NOVEL', relations: { edges: [novel(86238)] } }), konosuba)).toBe('same_instrument');
    expect(extraBucket(['SIDE_STORY'], media({ id: 8, source: 'LIGHT_NOVEL', relations: { edges: [novel(73921)] } }), konosuba)).toBe('other_instrument');
  });
  it('a novelization is not a source: a manga-sourced film whose only edge is a NOVEL node is held (MHA: Two Heroes); a one-shot tie-in under a manga source is other_instrument (Road to Ninja)', () => {
    expect(extraBucket(['SIDE_STORY'], media({ id: 100723, source: 'MANGA', relations: { edges: [novel(141517)] } }), owner)).toBe('unknown');
    const road = media({ id: 9, source: 'MANGA', relations: { edges: [oneShot(70549), novel(132777)] } });
    expect(extraBucket(['SIDE_STORY'], road, owner)).toBe('other_instrument');
    expect(adaptedNodes(road).map((n) => n.id)).toEqual([70549]);
    expect(adaptedNodes(media({ id: 10, source: 'ORIGINAL', relations: { edges: [manga(30011)] } }))).toEqual([]);
  });
  it('a manga owner ignores its own novel edges — the registered manga and the chain works are its instrument', () => {
    const ids = ownerInstrumentIds({ sourceType: 'manga', mangaId: 30011, chainWorkIds: [87178], ownedMedia: [media({ id: 20, relations: { edges: [novel(87232), manga(30011)] } })] });
    expect([...ids].sort((a, b) => a - b)).toEqual([30011, 87178]);
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
