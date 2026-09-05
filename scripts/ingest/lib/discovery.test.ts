// I42 — the candidate rule, pure. Fixtures are the shapes that ruled it
// (scripts/ingest/research/discovery/PROPOSAL.md v2.2 §1.5): the witnesses,
// the precedence pair, the buckets.
import { describe, expect, it } from 'vitest';
import { bucketOf, discoveryClasses, haloCandidates, titleContinuity, type DiscoveryInput, type MediaLike } from './discovery';

type Edge = { relationType: string; node: { id: number; type: string; format: string | null; status?: string; popularity?: number; title: { romaji: string; english?: string | null } } };
const media = (id: number, romaji: string, opts: { english?: string | null; format?: string | null; status?: string; popularity?: number; edges?: Edge[]; synonyms?: string[]; source?: string | null } = {}): MediaLike => ({
  source: opts.source ?? null,
  id, title: { romaji, english: opts.english ?? null }, synonyms: opts.synonyms ?? [], format: opts.format === undefined ? 'TV' : opts.format, status: opts.status ?? 'FINISHED', popularity: opts.popularity ?? 1000, relations: { edges: opts.edges ?? [] },
});
const anime = (relationType: string, id: number, romaji: string, format: string | null = 'TV', status = 'FINISHED', popularity = 500): Edge => ({ relationType, node: { id, type: 'ANIME', format, status, popularity, title: { romaji } } });
const manga = (id: number, popularity = 100): Edge => ({ relationType: 'ADAPTATION', node: { id, type: 'MANGA', format: 'MANGA', popularity, title: { romaji: `manga ${id}` } } });

const input = (over: Partial<DiscoveryInput> & { staged: Map<number, MediaLike>; owned: Map<number, string> }): DiscoveryInput => ({
  changedAt: new Map(), ownerTitles: new Map(), ownerManga: new Map(), rulings: {}, openEnded: new Set(), ...over,
});

describe('titleContinuity', () => {
  const owner = ['Tate no Yuusha no Nariagari', 'The Rising of the Shield Hero'];
  it('a season ordinal after an owner title is ORDINAL', () => {
    for (const t of ['Tate no Yuusha no Nariagari Season 2', 'Tate no Yuusha no Nariagari 2nd Season', 'The Rising of the Shield Hero Season 3 Part 2', 'Tate no Yuusha no Nariagari III', 'Tate no Yuusha no Nariagari 2', 'Tate no Yuusha no Nariagari: The Final Season', 'Tate no Yuusha no Nariagari 2nd Cour', 'Tate no Yuusha no Nariagari Zoku-hen'])
      expect(titleContinuity([t], owner), t).toBe('ordinal');
    expect(titleContinuity(['Ijiranaide, Nagatoro-san 2nd Attack'], ['Ijiranaide, Nagatoro-san'])).toBe('ordinal');
    expect(titleContinuity(['Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka III'], ['Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka', 'Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka II'])).toBe('ordinal');
  });
  it('a punctuation sequel normalizes to the owner title — ORDINAL', () => {
    expect(titleContinuity(['Hataraku Maou-sama!!'], ['Hataraku Maou-sama!'])).toBe('ordinal');
    expect(titleContinuity(['Kaguya-sama wa Kokurasetai?'], ['Kaguya-sama wa Kokurasetai'])).toBe('ordinal');
  });
  it('a new subtitle is SUBTITLE; a title that does not carry the owner is UNRELATED', () => {
    expect(titleContinuity(['Naruto: Shippuuden'], ['Naruto'])).toBe('subtitle');
    expect(titleContinuity(['FAIRY TAIL: 100 YEARS QUEST'], ['Fairy Tail'])).toBe('subtitle');
    expect(titleContinuity(['JoJo no Kimyou na Bouken: Steel Ball Run - 1st STAGE'], ['JoJo no Kimyou na Bouken (TV)', 'JoJo no Kimyou na Bouken: Stone Ocean'])).toBe('subtitle');
    expect(titleContinuity(['Kono Subarashii Sekai ni Bakuen wo!'], ['Kono Subarashii Sekai ni Shukufuku wo!'])).toBe('unrelated');
    expect(titleContinuity(['Boruto: Naruto Next Generations'], ['Naruto: Shippuuden'])).toBe('unrelated');
  });
  it('the best verdict over every owner title wins (the english title carries the ordinal)', () => {
    expect(titleContinuity(['Frieren: Beyond Journey\'s End Season 3', 'Sousou no Frieren 3rd Season'], ['Frieren', 'Sousou no Frieren', 'Frieren: Beyond Journey\'s End'])).toBe('ordinal');
  });
});

describe('bucketOf', () => {
  it('SEQUEL × TV-shaped is the sequel bucket; an unknown format is still series-shaped', () => {
    expect(bucketOf(new Set(['SEQUEL']), 'TV')).toBe('sequel');
    expect(bucketOf(new Set(['SEQUEL']), 'ONA')).toBe('sequel');
    expect(bucketOf(new Set(['SEQUEL']), null)).toBe('sequel');
  });
  it('the other story relations × TV-shaped are series candidates; extras and noise are buckets by rule', () => {
    for (const r of ['PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE', 'PARENT', 'SAME_UNIVERSE', 'OTHER']) expect(bucketOf(new Set([r]), 'TV'), r).toBe('series');
    expect(bucketOf(new Set(['SIDE_STORY']), 'MOVIE')).toBe('extra');
    expect(bucketOf(new Set(['SEQUEL']), 'OVA')).toBe('extra');
    expect(bucketOf(new Set(['SUMMARY']), 'TV')).toBe('recap'); // I45: a recap is a bucket, not noise
    expect(bucketOf(new Set(['CHARACTER']), 'TV')).toBe('crossover'); // I45: listed, not fetched
    expect(bucketOf(new Set(['OTHER']), 'MUSIC')).toBe('ignored');
    expect(bucketOf(new Set(['CHARACTER', 'SEQUEL']), 'TV')).toBe('sequel'); // a noise edge beside a story edge does not hide it
  });
});

describe('haloCandidates — the witnesses', () => {
  const shieldHero = media(99263, 'Tate no Yuusha no Nariagari', { english: 'The Rising of the Shield Hero', edges: [anime('SEQUEL', 111321, 'Tate no Yuusha no Nariagari Season 2', 'TV', 'FINISHED', 245040), manga(101226)] });
  const fairyTail = media(6702, 'Fairy Tail', { edges: [anime('SEQUEL', 139095, 'FAIRY TAIL: 100 YEARS QUEST'), manga(30016)] });
  const yearsQuest = media(139095, 'FAIRY TAIL: 100 YEARS QUEST', { english: 'FAIRY TAIL: 100 YEARS QUEST', edges: [manga(102400), anime('PREQUEL', 6702, 'Fairy Tail')] });
  const jojo = media(14719, 'JoJo no Kimyou na Bouken (TV)', { edges: [anime('SEQUEL', 190327, 'JoJo no Kimyou na Bouken: Steel Ball Run - 1st STAGE', 'ONA', 'FINISHED', 76647)] });
  const trigun = media(6, 'Trigun', { edges: [anime('ALTERNATIVE', 151040, 'TRIGUN STAMPEDE', 'TV', 'FINISHED', 87705), anime('SIDE_STORY', 5391, 'Trigun: Badlands Rumble', 'MOVIE'), anime('CHARACTER', 999, 'Some crossover', 'TV'), anime('OTHER', 998, 'Trigun music video', 'MUSIC')] });
  const konosuba = media(21202, 'Kono Subarashii Sekai ni Shukufuku wo!', { edges: [anime('SPIN_OFF', 150075, 'Kono Subarashii Sekai ni Bakuen wo!', 'TV', 'FINISHED', 122993)] });
  const base = () => input({
    owned: new Map([[99263, 'the-rising-of-the-shield-hero'], [6702, 'fairy-tail'], [14719, 'jojos-bizarre-adventure'], [6, 'trigun'], [21202, 'konosuba']]),
    staged: new Map([[99263, shieldHero], [6702, fairyTail], [139095, yearsQuest], [14719, jojo], [6, trigun], [21202, konosuba]]),
    ownerTitles: new Map([['the-rising-of-the-shield-hero', ['Tate no Yuusha no Nariagari', 'The Rising of the Shield Hero']], ['fairy-tail', ['Fairy Tail']], ['jojos-bizarre-adventure', ['JoJo no Kimyou na Bouken (TV)']], ['trigun', ['Trigun']], ['konosuba', ['Kono Subarashii Sekai ni Shukufuku wo!']]]),
    ownerManga: new Map([['the-rising-of-the-shield-hero', 101226], ['fairy-tail', 30016], ['jojos-bizarre-adventure', 30651]]),
    openEnded: new Set(['jojos-bizarre-adventure']),
  });
  const by = (cands: ReturnType<typeof haloCandidates>, id: number) => cands.find((c) => c.anilistId === id)!;

  it('I16 / I45: a MOVIE reached only by ALTERNATIVE edges is an alternative adaptation — one row under the franchise base, never same_instrument (GitS 1995 beside SAC; Heaven\'s Feel beside every Fate entry)', () => {
    const sac = media(467, 'Koukaku Kidoutai: Stand Alone Complex', { edges: [anime('ALTERNATIVE', 43, 'Koukaku Kidoutai', 'MOVIE', 'FINISHED', 175840), manga(30036)] });
    const arise = media(17187, 'Koukaku Kidoutai: Arise', { edges: [anime('ALTERNATIVE', 43, 'Koukaku Kidoutai', 'MOVIE', 'FINISHED', 175840)] });
    const film = media(43, 'Koukaku Kidoutai', { english: 'Ghost in the Shell', format: 'MOVIE', source: 'MANGA', edges: [manga(30036)] });
    const cands = haloCandidates(input({
      owned: new Map([[467, 'gits-sac'], [17187, 'gits-arise']]), staged: new Map([[467, sac], [17187, arise], [43, film]]),
      ownerTitles: new Map(), ownerManga: new Map([['gits-sac', 30036], ['gits-arise', 30036]]), openEnded: new Set(),
      franchiseBase: new Map([['gits-sac', 'gits-sac'], ['gits-arise', 'gits-sac']]),
    } as never));
    const c = by(cands, 43);
    expect(c.bucket).toBe('extra');
    expect(c.proposal).toBe('alternative');
    expect([...c.owners]).toEqual(['gits-sac']); // once, under the base — not under arise too
    expect(c.signals.join(' ')).toMatch(/series candidate/);
  });
  it('Shield Hero S2: a SEQUEL with a season ordinal → component (the "we waited on AFL" witness)', () => {
    const c = by(haloCandidates(base()), 111321);
    expect(c.bucket).toBe('sequel');
    expect(c.proposal).toBe('component');
    expect(c.signals).toContain('title continuity: season ordinal');
    expect([...c.owners]).toEqual(['the-rising-of-the-shield-hero']);
    expect(c.staged).toBe(false);
  });
  it('Fairy Tail 100 Years Quest: no open-ended declaration, a new subtitle, a DIFFERENT manga → series (the counter-witness)', () => {
    const c = by(haloCandidates(base()), 139095);
    expect(c.proposal).toBe('series');
    expect(c.mangaId).toBe(102400);
    expect(c.signals.join(' ')).toMatch(/different manga 102400 vs 30016/);
  });
  it('JoJo Steel Ball Run: a new subtitle, but the owner is DECLARED open-ended → component, whatever the title', () => {
    const c = by(haloCandidates(base()), 190327);
    expect(c.proposal).toBe('component');
    expect(c.signals[0]).toMatch(/declared open-ended I15: jojos-bizarre-adventure/);
  });
  it('without the declaration the same JoJo part is AMBIGUOUS (not staged, manga unknown) — never a blanket from any map presence', () => {
    const c = by(haloCandidates({ ...base(), openEnded: new Set() }), 190327);
    expect(c.proposal).toBe('ambiguous');
    expect(c.signals.join(' ')).toMatch(/new subtitle/);
    expect(c.signals.join(' ')).toMatch(/not staged/);
  });
  it('Trigun Stampede (ALTERNATIVE × TV) and Konosuba Explosion (SPIN_OFF × TV) → series; the movie is an extra (unstaged); CHARACTER is a crossover; MUSIC is ignored', () => {
    const cands = haloCandidates(base());
    expect(by(cands, 151040).proposal).toBe('series');
    expect(by(cands, 150075).proposal).toBe('series');
    expect(by(cands, 5391).bucket).toBe('extra');
    expect(by(cands, 5391).proposal).toBe('unstaged'); // I45: the bucket needs the full media
    expect(by(cands, 999).bucket).toBe('crossover');
    expect(by(cands, 998).bucket).toBe('ignored');
  });
  it('same manga + a new subtitle is AMBIGUOUS (Shippuden / TYBW went series, arc-titled seasons are components) — same manga is no signal', () => {
    const naruto = media(20, 'Naruto', { edges: [anime('SEQUEL', 1735, 'Naruto: Shippuuden'), manga(30011)] });
    const shippuden = media(1735, 'Naruto: Shippuuden', { edges: [manga(30011)] });
    const c = by(haloCandidates(input({ owned: new Map([[20, 'naruto']]), staged: new Map([[20, naruto], [1735, shippuden]]), ownerTitles: new Map([['naruto', ['Naruto']]]), ownerManga: new Map([['naruto', 30011]]) })), 1735);
    expect(c.proposal).toBe('ambiguous');
    expect(c.signals.join(' ')).toMatch(/same manga 30011 \(no signal\)/);
  });
  it('a SEQUEL chain walks through a STAGED candidate (S2 staged → S3 seen at hop 2, owners inherited); an owned id is never a candidate', () => {
    const s1 = media(1, 'Show', { edges: [anime('SEQUEL', 2, 'Show 2nd Season')] });
    const s2 = media(2, 'Show 2nd Season', { edges: [anime('PREQUEL', 1, 'Show'), anime('SEQUEL', 3, 'Show 3rd Season', 'TV', 'NOT_YET_RELEASED')] });
    const cands = haloCandidates(input({ owned: new Map([[1, 'show']]), staged: new Map([[1, s1], [2, s2]]), ownerTitles: new Map([['show', ['Show']]]) }));
    expect(cands.map((c) => c.anilistId).sort()).toEqual([2, 3]);
    const s3 = by(cands, 3);
    expect(s3.hop).toBe(2);
    expect(s3.via).toBe(2);
    expect([...s3.owners]).toEqual(['show']);
    expect(s3.proposal).toBe('component');
  });
  it('a ruled candidate carries its ruling and leaves the unclaimed classes; a `series` ruling with no series is ruled_unbuilt; a contradicted ruling is stale', () => {
    const cands = haloCandidates({ ...base(), rulings: { 151040: { disposition: 'deferred' }, 150075: { disposition: 'series', relation: { to: 'konosuba', kind: 'spin_off' } } } });
    expect(by(cands, 151040).ruling?.disposition).toBe('deferred');
    const classes = discoveryClasses(cands, { ...base(), rulings: { 151040: { disposition: 'deferred' }, 150075: { disposition: 'series' }, 6: { disposition: 'excluded' }, 4242: { disposition: 'deferred' } } }, null);
    expect(classes.halo_series_unclaimed.map((c) => c.anilistId)).not.toContain(151040);
    expect(classes.discovery_ruled_unbuilt.map((r) => r.anilistId)).toEqual([150075]);
    expect(classes.discovery_ruling_stale.map((r) => r.anilistId).sort()).toEqual([4242, 6]);
  });
  it('discovery_new_since_sitting: unstaged or changed after the last sitting, TV-shaped only; nothing new once the sitting postdates the staging', () => {
    const inp = { ...base(), changedAt: new Map([[139095, '2026-09-01T00:00:00Z']]) };
    const cands = haloCandidates(inp);
    const before = discoveryClasses(cands, inp, null);
    expect(before.discovery_new_since_sitting.map((c) => c.anilistId).sort((a, b) => a - b)).toEqual([111321, 139095, 150075, 151040, 190327]);
    const inp2 = { ...inp, changedAt: new Map([[139095, '2026-09-01T00:00:00Z'], [111321, '2026-09-01T00:00:00Z'], [150075, '2026-09-01T00:00:00Z'], [151040, '2026-09-01T00:00:00Z'], [190327, '2026-09-01T00:00:00Z']]) };
    const after = discoveryClasses(haloCandidates(inp2), inp2, '2026-09-02');
    expect(after.discovery_new_since_sitting).toEqual([]);
    expect(before.halo_extra_standing.map((c) => c.anilistId).sort()).toEqual([5391, 999]); // extras + crossovers are listed (I45)
  });
});
