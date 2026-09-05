// I45 — the related-works derivation, pure
import { describe, expect, it } from 'vitest';
import { adaptedNodes, deriveWatchPosition, extraBucket, extraKind, extraStanding, freePosition, ledgerWorthy, matchRelatedTitle, ownerInstrumentIds, pickAdoption, relatedWorkStanding, titleMatch, type ExtraMedia } from './related-works';

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
  it('I45 amended (e): a trailer / PV / teaser / commercial is promo — never a row, whatever its edges; an unfetched CHARACTER-only PV is promo by its edge title', () => {
    expect(extraBucket(['SIDE_STORY'], media({ id: 182561, title: { romaji: 'BLEACH 20th Anime Anniversary Official Trailer' }, relations: { edges: [manga(30011)] } }), owner)).toBe('promo');
    expect(extraBucket(['CHARACTER'], null, owner, 'Jongtama PV')).toBe('promo');
    expect(extraBucket(['SIDE_STORY'], media({ id: 125785, title: { romaji: 'Evangelion x KATE CM' } }), owner)).toBe('promo');
    expect(extraBucket(['CHARACTER'], null, owner, 'Some Crossover Special')).toBe('crossover');
    expect(extraKind('SPECIAL', 'promo')).toBeNull();
    expect(ledgerWorthy('promo')).toBe(false); expect(ledgerWorthy('unstaged')).toBe(false); expect(ledgerWorthy('unknown')).toBe(true);
  });
  it('I46: a stored row of another origin names the same work — equal cores after the trailing parenthetical, or containment of a name-length core', () => {
    expect(matchRelatedTitle("My Hero Academia: World Heroes' Mission", "My Hero Academia: World Heroes' Mission (film, 2021-08-06)")).toBe(true);
    expect(matchRelatedTitle('To LOVE-Ru Darkness OVA', 'To LOVE-Ru Darkness OVA (2012)')).toBe(true);
    expect(matchRelatedTitle('Cardcaptor Sakura: The Movie', 'Cardcaptor Sakura the Movie')).toBe(true);
    expect(matchRelatedTitle('Naruto OVA', 'OVA')).toBe(false); // a three-letter core matches nothing
    expect(matchRelatedTitle('One Piece Film: Red', 'One Piece Film: Gold')).toBe(false);
    expect(matchRelatedTitle('More', 'My Hero Academia: More Stories')).toBe(false); // MHA 171 "More" must not swallow a longer title
  });
  it('I46 pickAdoption fails closed and separates by exactness, then by year', () => {
    const ccs = { position: 35.1, title: 'Cardcaptor Sakura: The Movie (1999)', air_date: '1999-08-21' };
    const movie1 = { title: 'Cardcaptor Sakura: The Movie', year: 1999 }, movie2 = { title: 'Cardcaptor Sakura the Movie 2: The Sealed Card', year: 2000 };
    expect(titleMatch(movie1.title, ccs.title)).toBe('equal'); expect(titleMatch(movie2.title, ccs.title)).toBe('contains');
    expect(pickAdoption(movie1, [ccs], [movie2])).toMatchObject({ row: ccs, reason: expect.stringContaining('exact title') });
    expect(pickAdoption(movie2, [ccs], [movie1])).toBeNull(); // the exact one adopts on its turn
    // two containing fits: the row's year decides, else ambiguous
    const row = { position: 5.5, title: 'Kuroko Basketball OVA', air_date: '2013-08-09' }; // two works only CONTAIN the row's core
    const a = { title: 'Kuroko Basketball OVA: Tip Off', year: 2013 }, b = { title: 'Kuroko Basketball OVA 2: Once More', year: 2014 };
    expect(titleMatch(a.title, row.title)).toBe('contains'); expect(titleMatch(b.title, row.title)).toBe('contains');
    expect(pickAdoption(a, [row], [b])).toMatchObject({ reason: expect.stringContaining('2013') });
    expect(pickAdoption(b, [row], [a])).toBeNull();
    expect(pickAdoption(a, [{ ...row, air_date: null }], [b])).toMatchObject({ ambiguous: expect.stringContaining('no date') });
    // dates a year apart or more never adopt; two rows fitting one work is ambiguous
    expect(pickAdoption({ title: 'X OVA Special', year: 2001 }, [{ position: 1.5, title: 'X OVA Special (2011)', air_date: '2011-01-01' }], [])).toMatchObject({ ambiguous: expect.stringContaining('dates disagree') });
    expect(pickAdoption(movie1, [ccs, { ...ccs, position: 36.1 }], [])).toMatchObject({ ambiguous: expect.stringContaining('2 stored rows') });
    expect(pickAdoption({ title: 'Nothing Like It', year: null }, [ccs], [])).toBeNull();
  });
  it('the ruling layer beats the rule: a researched standing lands; without one the rule (or pending) stands', () => {
    expect(relatedWorkStanding('same_instrument', { standing: 'canon' })).toBe('canon');
    expect(relatedWorkStanding('original', { standing: 'mixed' })).toBe('mixed');
    expect(relatedWorkStanding('same_instrument', null)).toBeNull();
    expect(relatedWorkStanding('recap', undefined)).toBe('filler');
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
