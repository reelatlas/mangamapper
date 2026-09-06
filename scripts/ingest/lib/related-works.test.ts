// I45 — the related-works derivation, pure
import { describe, expect, it } from 'vitest';
import { adaptedNodes, clusterDisorder, deriveWatchPosition, ledgerBaseProblems, planRuledMoves, PROMO, extraBucket, extraKind, extraStanding, freePosition, ledgerWorthy, matchRelatedTitle, ownerInstrumentIds, pickAdoption, relatedWorkOwners, relatedWorkStanding, titleMatch, type ExtraMedia } from './related-works';

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
  it('relatedWorkOwners: strong in-run owners win (Sailor Moon Eternal continues Crystal despite the 1990s ALTERNATIVE); PARENT never claims; the base\'s ALTERNATIVE alone makes an alternative adaptation (GitS 1995); OTHER alone owns (Shippuden\'s own specials); a member\'s ALTERNATIVE with no base claim stays its row (UBW\'s special)', () => {
    const m = (o: Record<string, string[]>) => new Map(Object.entries(o).map(([k, v]) => [k, new Set(v)]));
    const smBase = (o: string) => (o.startsWith('sailor-moon') ? 'sailor-moon' : o);
    expect(relatedWorkOwners(m({ 'sailor-moon': ['ALTERNATIVE'], 'sailor-moon-crystal': ['SEQUEL'] }), smBase)).toEqual({ owners: new Set(['sailor-moon-crystal']), alternative: false });
    expect(relatedWorkOwners(m({ 'fate-stay-night': ['ALTERNATIVE'], 'fate-kaleid-liner-prisma-illya': ['PARENT'] }), (o) => (o.startsWith('fate') ? 'fate-stay-night' : o))).toEqual({ owners: new Set(['fate-stay-night']), alternative: true });
    expect(relatedWorkOwners(m({ 'gits-sac': ['ALTERNATIVE'], 'gits-arise': ['ALTERNATIVE'] }), (o) => (o === 'gits-arise' ? 'gits-sac' : o))).toEqual({ owners: new Set(['gits-sac']), alternative: true });
    expect(relatedWorkOwners(m({ 'naruto-shippuden': ['OTHER'] }))).toEqual({ owners: new Set(['naruto-shippuden']), alternative: false });
    expect(relatedWorkOwners(m({ 'fate-stay-night-unlimited-blade-works': ['ALTERNATIVE'] }), (o) => (o.startsWith('fate') ? 'fate-stay-night' : o))).toEqual({ owners: new Set(['fate-stay-night-unlimited-blade-works']), alternative: false });
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

describe('planRuledMoves (I45 — the pre-pass plans before any row is touched)', () => {
  const rows = [
    { seriesId: 'k', anilistId: 3276, position: 100.5 },
    { seriesId: 'k', anilistId: 147810, position: 119.5 },
    { seriesId: 'k', anilistId: 3277, position: 117.5 },
    { seriesId: 'm', anilistId: 1, position: 13.5 },
    { seriesId: 'm', anilistId: 2, position: 13.51 },
    { seriesId: 'w', anilistId: null, position: 24.1 },
  ];
  it('a mover onto a FREE slot moves', () => {
    const p = planRuledMoves(rows, (s, id) => (s === 'k' && id === 3276 ? 121.5 : null));
    expect(p.moves).toEqual([{ seriesId: 'k', anilistId: 3276, from: 100.5, to: 121.5 }]); expect(p.refused).toEqual([]);
  });
  it('a mover onto a slot held by a NON-moving row is REFUSED with the holder named — kinnikuman 3276 → 119.5 (the PSA); the row is kept', () => {
    const p = planRuledMoves(rows, (s, id) => (s === 'k' && id === 3276 ? 119.5 : null));
    expect(p.moves).toEqual([]); expect(p.refused).toEqual([{ seriesId: 'k', anilistId: 3276, from: 100.5, to: 119.5, heldBy: 147810 }]);
  });
  it('two movers may SWAP (Made in Abyss: the recap films ahead of the feature)', () => {
    const p = planRuledMoves(rows, (s, id) => (s === 'm' ? ({ 1: 13.51, 2: 13.5 } as Record<number, number>)[id] : null));
    expect(p.moves.map((m) => m.anilistId).sort()).toEqual([1, 2]); expect(p.refused).toEqual([]);
  });
  it('a mover may take a slot another mover is LEAVING (a chain) — the ruling that vacates it lands in the same run', () => {
    const p = planRuledMoves(rows, (s, id) => (s === 'k' ? ({ 3276: 119.5, 147810: 119.51 } as Record<number, number>)[id] : null));
    expect(p.moves.map((m) => m.anilistId).sort((a, b) => a - b)).toEqual([3276, 147810]); expect(p.refused).toEqual([]);
  });
  it('a slot held by a row WITHOUT identity (a wiki row) refuses too (heldBy null); another series\' slot is not this series\' slot', () => {
    const p = planRuledMoves(rows, (s, id) => (s === 'k' && id === 3277 ? 24.1 : null));
    expect(p.moves).toEqual([{ seriesId: 'k', anilistId: 3277, from: 117.5, to: 24.1 }]);
    const q = planRuledMoves([...rows, { seriesId: 'w', anilistId: 9, position: 30.5 }], (s, id) => (s === 'w' && id === 9 ? 24.1 : null));
    expect(q.refused).toEqual([{ seriesId: 'w', anilistId: 9, from: 30.5, to: 24.1, heldBy: null }]);
  });
});

describe('PROMO (I45 e — the title test, a table)', () => {
  it.each([
    ['BLEACH 20th Anime Anniversary Official Trailer', true], ['Jongtama PV', true], ['Evangelion x KATE CM', true], ['One Piece Teaser', true],
    ['Ranma ½ Music Video', true], ['らんま1/2 歌合戦', true], ['ミュージックビデオ集', true], ['Promo Special', true], ['Promotional Video', true],
    ['Kinnikuman: Ooabare! Seigi Choujin', false], ['Tennis no Ouji-sama: Zenkoku Taikai-hen', false], ['Kcmax Special', false], ['The Disappearance of Haruhi Suzumiya', false],
  ])('%s → promo %s', (title, promo) => { expect(PROMO.test(title)).toBe(promo); });
});

describe('ledgerBaseProblems (E2 — a positioned row whose base episode has no row)', () => {
  const eps = (sid: string) => (sid === 'k' ? new Set([1, 2, 3, 47, 65, 119]) : new Set<number>());
  it('a base that exists passes; 0.x (before ep 1) is allowed; a missing base lists', () => {
    expect(ledgerBaseProblems([{ seriesId: 'k', position: 65.51 }, { seriesId: 'k', position: 0.5 }], eps)).toEqual([]);
    expect(ledgerBaseProblems([{ seriesId: 'k', position: 76.5, title: 'x' }], eps)).toHaveLength(1);
    expect(ledgerBaseProblems([{ seriesId: 'z', position: 1.5 }], eps)).toHaveLength(1);
  });
  it('a RULED position past the grid is a fixed point (my-hero-academia 171 = 170+1, Sean): never stranded', () => {
    expect(ledgerBaseProblems([{ seriesId: 'k', position: 171 }, { seriesId: 'k', position: 171.5 }], eps, (sid, pos) => sid === 'k' && (pos === 171 || pos === 171.5))).toEqual([]);
    expect(ledgerBaseProblems([{ seriesId: 'k', position: 172 }], eps, (sid, pos) => pos === 171)).toHaveLength(1);
  });
});

describe('clusterDisorder (E13 — unruled rows inside a slot in air-date order among themselves)', () => {
  it('the ranma shape before its ruling: the film (1994-08) stored behind the Special (1994-12) lists once per cluster', () => {
    const rows = [
      { seriesId: 'r', position: 161.5, airDate: '1993-10-21', ruled: false },
      { seriesId: 'r', position: 161.51, airDate: '1994-12-16', ruled: false },
      { seriesId: 'r', position: 161.52, airDate: '1994-08-20', ruled: false },
      { seriesId: 'r', position: 161.53, airDate: '1995-03-03', ruled: false },
    ];
    expect(clusterDisorder(rows)).toHaveLength(1);
    expect(clusterDisorder(rows.map((r) => ({ ...r, ruled: true })))).toEqual([]); // the ruling makes it a fixed cluster
  });
  it('ruled rows are fixed points and are skipped; unruled rows around them are compared among themselves; null dates are skipped', () => {
    const rows = [
      { seriesId: 'k', position: 119.5, airDate: '1985-07-13', ruled: true },
      { seriesId: 'k', position: 119.51, airDate: '1986-01-01', ruled: true },
      { seriesId: 'k', position: 119.52, airDate: '1990-01-01', ruled: false },
      { seriesId: 'k', position: 119.53, airDate: null, ruled: false },
      { seriesId: 'k', position: 119.54, airDate: '1991-01-01', ruled: false },
    ];
    expect(clusterDisorder(rows)).toEqual([]);
    expect(clusterDisorder([...rows, { seriesId: 'k', position: 119.55, airDate: '1989-01-01', ruled: false }])).toHaveLength(1);
  });
});

describe('I47 (E15) — the source tag ROUTES; an ADAPTATION edge to the owner\'s own instrument counts whatever the tag says', () => {
  const owner = { mangaId: 30049, chainWorkIds: [] as number[] };
  it('the-prince-of-tennis 995: source null + ADAPTATION → the owner\'s manga = same_instrument (was unknown, held)', () => {
    expect(extraBucket(['SEQUEL'], media({ id: 995, source: null, relations: { edges: [manga(30049)] } }), owner)).toBe('same_instrument');
    expect(adaptedNodes(media({ id: 995, source: null, relations: { edges: [manga(30049)] } }), [30049]).map((n) => n.id)).toEqual([30049]);
  });
  it('the tag still gates edges to OTHER nodes: source null + ADAPTATION → another manga stays unknown (held), never other_instrument', () => {
    expect(extraBucket(['SIDE_STORY'], media({ id: 1, source: null, relations: { edges: [manga(99999)] } }), owner)).toBe('unknown');
    expect(adaptedNodes(media({ id: 1, source: null, relations: { edges: [manga(99999)] } }), [30049])).toEqual([]);
  });
  it('a tagged work is unchanged: source MANGA + ADAPTATION → another manga = other_instrument; → the owner\'s = same_instrument', () => {
    expect(extraBucket(['SIDE_STORY'], media({ id: 2, source: 'MANGA', relations: { edges: [manga(99999)] } }), owner)).toBe('other_instrument');
    expect(extraBucket(['SIDE_STORY'], media({ id: 3, source: 'MANGA', relations: { edges: [manga(30049)] } }), owner)).toBe('same_instrument');
  });
});
