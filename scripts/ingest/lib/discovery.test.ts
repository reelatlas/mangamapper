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

describe('the skip-split (I13 amended 2026-09-05, E9): owned by THIS owner never an extra; a ONE-ROW film series elsewhere still is; another multi-entry run never is', () => {
  const jjk = media(113415, 'Jujutsu Kaisen', { edges: [anime('SIDE_STORY', 131573, 'Jujutsu Kaisen 0', 'MOVIE'), anime('SEQUEL', 145064, 'Jujutsu Kaisen 2nd Season', 'TV')] });
  const jjk0 = media(131573, 'Jujutsu Kaisen 0', { format: 'MOVIE', edges: [anime('PARENT', 113415, 'Jujutsu Kaisen', 'TV')] });
  const hxh2011 = media(11061, 'Hunter x Hunter (2011)', { edges: [anime('ALTERNATIVE', 136, 'Hunter x Hunter', 'TV'), anime('ALTERNATIVE', 138, 'Hunter x Hunter: Greed Island', 'OVA')] });
  const owned = new Map([[113415, 'jujutsu-kaisen'], [145064, 'jujutsu-kaisen'], [131573, 'jujutsu-kaisen-0'], [136, 'hunter-x-hunter'], [137, 'hunter-x-hunter'], [138, 'hunter-x-hunter'], [11061, 'hunter-x-hunter-2011']]);
  const cands = haloCandidates(input({ owned, staged: new Map([[113415, jjk], [131573, jjk0], [11061, hxh2011], [136, media(136, 'Hunter x Hunter')], [138, media(138, 'Greed Island', { format: 'OVA' })]]) }));
  const by = (id: number) => cands.find((c) => c.anilistId === id);
  it('JJK 0 (a one-row film series) is an extra candidate of JJK, marked ownedElsewhere — never a series or mint proposal', () => {
    const c = by(131573);
    expect(c?.ownedElsewhere).toBe('jujutsu-kaisen-0'); expect([...c!.owners]).toEqual(['jujutsu-kaisen']); expect(c?.bucket).toBe('extra');
    expect(c?.signals.some((x) => /owned by jujutsu-kaisen-0/.test(x))).toBe(true);
  });
  it("this owner's own component (JJK S2) is never its extra", () => { expect(by(145064)).toBeUndefined(); });
  it('down a SEQUEL chain through a candidate, a one-row OVA series elsewhere is still an extra of the chain\'s owner (Gundam → CCA → Unicorn)', () => {
    const gundam = media(80, 'Kidou Senshi Gundam', { edges: [anime('SEQUEL', 90, 'Char\'s Counterattack', 'MOVIE')] });
    const cca = media(90, "Char's Counterattack", { format: 'MOVIE', edges: [anime('SEQUEL', 6336, 'Gundam UC', 'OVA')] });
    const cands2 = haloCandidates(input({ owned: new Map([[80, 'mobile-suit-gundam'], [6336, 'mobile-suit-gundam-unicorn']]), staged: new Map([[80, gundam], [90, cca], [6336, media(6336, 'Gundam UC', { format: 'OVA' })]]) }));
    const uc = cands2.find((c) => c.anilistId === 6336);
    expect(uc?.ownedElsewhere).toBe('mobile-suit-gundam-unicorn'); expect(uc?.hop).toBe(2); expect([...uc!.owners]).toEqual(['mobile-suit-gundam']);
  });
  it('the real shape: the chain candidate is ALSO a related work of the one-row series itself (Unicorn reaches CCA by PREQUEL) — Unicorn joins Gundam only, never itself', () => {
    const gundam = media(80, 'Kidou Senshi Gundam', { edges: [anime('SEQUEL', 90, "Char's Counterattack", 'MOVIE')] });
    const ucMedia = media(6336, 'Gundam UC', { format: 'OVA', edges: [anime('PREQUEL', 90, "Char's Counterattack", 'MOVIE')] });
    const cca = media(90, "Char's Counterattack", { format: 'MOVIE', edges: [anime('SEQUEL', 6336, 'Gundam UC', 'OVA')] });
    const cands2 = haloCandidates(input({ owned: new Map([[80, 'mobile-suit-gundam'], [6336, 'mobile-suit-gundam-unicorn']]), staged: new Map([[80, gundam], [90, cca], [6336, ucMedia]]) }));
    const c90 = cands2.find((c) => c.anilistId === 90); expect([...c90!.owners].sort()).toEqual(['mobile-suit-gundam', 'mobile-suit-gundam-unicorn']);
    const uc = cands2.find((c) => c.anilistId === 6336); expect(uc?.ownedElsewhere).toBe('mobile-suit-gundam-unicorn'); expect([...uc!.owners]).toEqual(['mobile-suit-gundam']);
  });
  it('the Greed Island OVA — a component of the multi-entry 1999 run — is not an extra of the 2011 series (the franchise page orders runs); the 1999 TV entry neither', () => {
    expect(by(138)).toBeUndefined(); expect(by(136)).toBeUndefined();
  });
});

describe('a related_work ruling beats the format (2026-09-06, C1 — the Frieren ●● no Mahou shorts)', () => {
  it('an ONA SIDE_STORY ruled a related work is an EXTRA candidate, never a series to build; unruled it proposes series', () => {
    const owner = media(1, 'Frieren', { edges: [anime('SIDE_STORY', 2, 'Frieren: ●● no Mahou Part 3', 'ONA', 'RELEASING')] });
    const shorts = media(2, 'Frieren: ●● no Mahou Part 3', { format: 'ONA', status: 'RELEASING', source: 'ORIGINAL', edges: [anime('PARENT', 1, 'Frieren')] });
    const ruled = input({ owned: new Map([[1, 'frieren']]), staged: new Map([[1, owner], [2, shorts]]), ownerTitles: new Map([['frieren', ['Frieren']]]), rulings: { 2: { disposition: 'related_work', owner: 'frieren', bucket: 'original' } } });
    const c = haloCandidates(ruled).find((x) => x.anilistId === 2)!;
    expect(c.bucket).toBe('extra');
    expect(discoveryClasses(haloCandidates(ruled), ruled, null).halo_series_unclaimed.map((x) => x.anilistId)).not.toContain(2);
    const unruled = input({ owned: new Map([[1, 'frieren']]), staged: new Map([[1, owner], [2, shorts]]), ownerTitles: new Map([['frieren', ['Frieren']]]) });
    expect(haloCandidates(unruled).find((x) => x.anilistId === 2)!.bucket).toBe('series');
  });
});
