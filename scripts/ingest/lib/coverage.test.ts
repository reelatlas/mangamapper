// C2 (amended 2026-09-07) — the coverage walk, proven on the rows that ruled it (batch 23 wave 1 + the consolidate).
import { describe, expect, it } from 'vitest';
import { annotationChapters, buildCoverage, continueAgrees, curatedStandsByRuling, spanContributions, walkContinue, type CoverageAnchor } from './coverage';

const canon = () => 'canon';
const row = (episode: number, chapter: number, start: number | null, span: string | null, extra: Partial<CoverageAnchor> = {}): CoverageAnchor => ({ episode, chapter, start_chapter: start, chapters_adapted: span, ...extra });

describe('spanContributions reads what a chapters_adapted record says per chapter', () => {
  it('bare chapters and ranges are whole; a page range or partial wording touches; scrap wording never finishes', () => {
    const m = spanContributions('41, 42, 43 (pp.1-15, 22-43)');
    expect(m.get(41)).toBe('whole'); expect(m.get(42)).toBe('whole'); expect(m.get(43)).toBe('part');
    expect(spanContributions('36-38').get(37)).toBe('whole');
    expect(spanContributions('19 (partial: Pluto\'s debut, ahead of the time warp)').get(19)).toBe('part');
    expect(spanContributions('66-77 (Round 8 complete)').get(70)).toBe('whole');
    expect(spanContributions('54 (pp.17-24, recap), 55 (pp.19-34), 56').get(54)).toBe('never');
    expect(spanContributions('123 (first half, relocated flashback), 130 (remainder)').get(123)).toBe('never');
    expect(spanContributions('15-17 (abduction motif condensed), 18 (opening)').get(16)).toBe('never');
  });
  it('T24 volume space: a bare volume is whole, units inside it touch', () => {
    const m = spanContributions('v10 ch 5-8, v11, v12 ch 1-2');
    expect(m.get(10)).toBe('part'); expect(m.get(11)).toBe('whole'); expect(m.get(12)).toBe('part');
  });
  it('annotationChapters expands ranges and ignores bonus units and page facts', () => {
    expect(annotationChapters('116-118')).toEqual([116, 117, 118]);
    expect(annotationChapters('B5, 84-85')).toEqual([84, 85]);
    expect(annotationChapters('43 (pp.16-21)')).toEqual([43]);
  });
});

describe('the walk — record-of-ragnarok (the hole this episode made; the open END)', () => {
  const rows = [
    row(17, 30, 29, '29 (pp.25-50), 30, 32 (pp.6-8, 30-32), 33 (pp.27-60)'),
    row(18, 34, 34, '31, 34 (pp.1-27)'),
    row(19, 36, 32, '32 (pp.1-5, 9-29, 33-38), 33 (pp.1-26), 34 (pp.28-30), 35, 36 (pp.1-14)'),
    row(20, 38, 36, '36 (pp.15-34), 37, 38'),
    row(21, 40, 39, '39, 40'),
    row(22, 43, 41, '41, 42, 43 (pp.1-15, 22-43)'),
    row(23, 45, 43, '43 (pp.16-21), 44, 45 (pp.1-12)'),
    row(24, 46, 45, '45 (pp.13-68), 46'),
  ];
  const index = buildCoverage(rows, [], canon);
  it('ep 18 plays 31 then 34: the reader has not read 32 — a hole, ep 19 adapts it', () => {
    const w = walkContinue(rows[1], index, { finale: false });
    expect(w.value).toBe(32); expect(w.kind).toBe('hole'); expect(w.holes).toEqual([32, 33]); expect(w.stored).toBe(true);
    expect(w.note).toContain('skipped ch 32-33'); expect(w.note).toContain('ep 19 adapts them');
  });
  it('ep 22 leaves ch 43 open (pp.16-21 are ep 23\'s): continue 43 (C1)', () => {
    const w = walkContinue(rows[5], index, { finale: false });
    expect(w.value).toBe(43); expect(w.kind).toBe('open'); expect(w.note).toContain('ep 23 finishes it');
  });
  it('ep 21 → 41 is END + 1: derived, nothing stored; the note is not needed', () => {
    const w = walkContinue(rows[4], index, { finale: false });
    expect(w.value).toBe(41); expect(w.kind).toBe('default'); expect(w.stored).toBe(false);
  });
  it('ep 17 → 31 (END 30; 32-33 only touched, ep 18 opens on 31)', () => {
    const w = walkContinue(rows[0], index, { finale: false });
    expect(w.value).toBe(31); expect(w.kind).toBe('default');
  });
  it('a hole an EARLIER episode made never pulls a later row back (the binge reader after ep 24 opens at 47)', () => {
    const early = [row(18, 34, 34, '31, 34'), row(24, 46, 45, '45, 46')];
    const w = walkContinue(early[1], buildCoverage(early, [], canon), { finale: false });
    expect(w.value).toBe(47); expect(w.holes).toEqual([]);
  });
});

describe('the walk — eyeshield-21 (the walk over chapters earlier episodes finished; the back-jump as a note)', () => {
  const rows = [
    row(52, 110, 110, '110'),
    row(54, 109, 109, '109'),
    row(55, 113, 112, '112 (pp.20-24), 113'),
    row(56, 114, 114, '114'),
    row(57, 112, 111, '111 (pp.6-19), 112 (pp.5-19)'),
    row(58, 116, 116, '116'),
  ];
  const index = buildCoverage(rows, [{ episode: 58, kind: 'abridged', chapters: '116-118' }], canon);
  it('ep 54: 110 was ep 52, 111 is unread until ep 57 → 111, and the note says the anime skips ahead to 112', () => {
    const w = walkContinue(rows[1], index, { finale: false });
    expect(w.value).toBe(111); expect(w.kind).toBe('walk');
    expect(w.finishedEarlier.chapters).toEqual([110]); expect(w.finishedEarlier.episodes).toEqual([52]);
    expect(w.note).toContain('ch 110 already adapted (ep 52)'); expect(w.note).toContain('skips ahead: ep 55 opens at ch 112');
  });
  it('ep 57: 113-114 were eps 55-56, 115 never → 115; ep 58 opens at 116', () => {
    const w = walkContinue(rows[4], index, { finale: false });
    expect(w.value).toBe(115); expect(w.kind).toBe('walk');
    expect(w.note).toContain('ch 113-114 already adapted (eps 55-56)'); expect(w.note).toContain('ep 58 opens at ch 116');
  });
  it('ep 56: END + 1 = 115 is unread — nothing stored; the back-jump to 111 is a note only', () => {
    const w = walkContinue(rows[3], index, { finale: false });
    expect(w.value).toBe(115); expect(w.stored).toBe(false); expect(w.note).toContain('jumps back: ep 57 opens at ch 111');
  });
  it('abridged finishes what the row lists: a later back-jump row walks over 116-118 (ep 58 abridged them)', () => {
    const rows2 = [row(58, 118, 116, '116-118 (abridged)'), row(59, 115, 115, '115')];
    const index2 = buildCoverage(rows2, [{ episode: 58, kind: 'abridged', chapters: '116-118' }], canon);
    const w = walkContinue(rows2[1], index2, { finale: false });
    expect(w.value).toBe(119); expect(w.kind).toBe('walk'); expect(w.finishedEarlier.chapters).toEqual([116, 117, 118]); expect(w.finishedEarlier.episodes).toEqual([58]);
  });
});

describe('the reader on the shapes stored data actually has', () => {
  it('a block-level abridged annotation copied onto every row finishes only what each row lists (eyeshield 58-63)', () => {
    const rows = [row(58, 116, 116, '116'), row(59, 121, 119, '119-121'), row(60, 123, 122, '122-123 (game beats only)')];
    const ann = [58, 59, 60].map((episode) => ({ episode, kind: 'abridged', chapters: '116-126' }));
    const index = buildCoverage(rows, ann, canon);
    expect(index.finishedAt(117, 58)).toBe(false);
    expect(walkContinue(rows[0], index, { finale: false }).value).toBe(117);
  });
  it('a chapter listed above the END is a tail or an echo, never finished here (sailor-moon 46)', () => {
    const rows = [row(46, 13, 12, '12-13 (heavily altered: Beryl/Metalia destroyed), 14 (daily-life reset echoed)'), row(60, 15, 14, '14-15')];
    const index = buildCoverage(rows, [], canon);
    expect(index.finishedAt(14, 46)).toBe(false);
    const w = walkContinue(rows[0], index, { finale: false });
    expect(w.value).toBe(14); expect(w.kind).toBe('default');
  });
  it('a flash-forward inside the span is a hole the episode made (kingdom 16 plays 48 then 96-100)', () => {
    const rows = [row(15, 47, 45, '44 (tail), 45-47'), row(16, 100, 48, '48, 96-100'), row(17, 52, 49, '49-52')];
    const w = walkContinue(rows[1], buildCoverage(rows, [], canon), { finale: false });
    expect(w.value).toBe(49); expect(w.kind).toBe('hole'); expect(w.note).toContain('ep 17 adapts them');
  });
  it('a graft block annotation lists its chapters as touched, so they are neither holes nor finished (kingdom 44-48)', () => {
    const rows = [row(22, 82, 71, '71-73, 82'), row(44, 185, 184, '74, 184-185')];
    const index = buildCoverage(rows, [{ episode: 44, kind: 'graft', chapters: '74-82' }], canon);
    const w = walkContinue(rows[1], index, { finale: false });
    expect(w.holes).toEqual([]); expect(index.finishedAt(75, 44)).toBe(false);
  });
});

describe('a segment naming another work contributes nothing (dragon-maid 25)', () => {
  it("'Elma OL ch 6' is a spin-off reference, never main-line chapter 6; 'Act 18' and 'Lesson 105' are the instrument's own units", () => {
    const m = spanContributions('40, 48, Elma OL ch 6');
    expect(m.has(6)).toBe(false); expect(m.get(40)).toBe('whole'); expect(m.get(48)).toBe('whole');
    expect(spanContributions('Act 18').get(18)).toBe('whole');
    expect(spanContributions('Act 18 (opening)').get(18)).toBe('part');
    expect(spanContributions('Lesson 105').get(105)).toBe('whole');
  });
  it('the finale walks from its own chapters, not from the spin-off number (49-64 finished earlier → post_series 65)', () => {
    const rows = [row(16, 64, 49, '49-64'), row(24, 47, 41, '41-47'), row(25, 48, 40, '40, 48, Elma OL ch 6')];
    const w = walkContinue(rows[2], buildCoverage(rows, [], canon), { finale: true });
    expect(w.holes).toEqual([]); expect(w.value).toBe(65); expect(w.kind).toBe('post_series');
  });
});

describe('a far-back sliver never sets the hole floor (nagatoro 12)', () => {
  it("'43-46; ch 8 epilogue (post-credits scene, first animated here)' walks from 47, not from 9", () => {
    const rows = [row(11, 42, 39, '39-42'), row(12, 46, 43, '43-46; ch 8 epilogue (post-credits scene, first animated here)')];
    const w = walkContinue(rows[1], buildCoverage(rows, [], canon), { finale: true });
    expect(w.holes).toEqual([]); expect(w.value).toBe(47); expect(w.kind).toBe('post_series');
  });
});

describe('a fractional END walks to the next integer unit (ajin 19)', () => {
  it('27.5 → 28, never 28.5', () => {
    const rows = [row(18, 26, 25, '25-26'), row(19, 27.5, 27, '27, 27.5')];
    const w = walkContinue(rows[1], buildCoverage(rows, [], canon), { finale: true });
    expect(w.value).toBe(28); expect(w.kind).toBe('post_series');
  });
});

describe('a curated continue stands by ruling (the two facts the walk cannot see)', () => {
  it('a named C1 on a clamp stands; the same value with no C1 wording does not', () => {
    const rows = [row(35, 35, 34, '34-35'), row(36, 37, 36, '36-37', { continue_chapter: 37, continue_kind: 'parity', continue_source: 'manual', continue_note: "C1 straddle (Sean 2026-08-26): ep 36 ends mid-ch-37" }), row(37, 40, 38, '38-40')];
    const index = buildCoverage(rows, [], canon);
    const w = walkContinue(rows[1], index, { finale: false });
    expect(w.value).toBe(38);
    expect(curatedStandsByRuling(rows[1], w, index)).toBe('named-c1');
    expect(curatedStandsByRuling({ ...rows[1], continue_note: 'parity' }, w, index)).toBeNull();
  });
  it('a researched finale above a walk that stopped at an unknown stands (ippo 127)', () => {
    const rows = [row(102, 420, 415, '415-420'), row(127, 557, 555, '555-557', { continue_chapter: 558, continue_kind: 'post_series', continue_source: 'manual', continue_note: 'C5 coverage + 1' })];
    const index = buildCoverage(rows, [], canon);
    const w = walkContinue(rows[1], index, { finale: true });
    expect(w.value).toBe(558);
    const rows2 = [row(102, 420, 415, '415-420'), row(127, 420, 419, '419-420', { continue_chapter: 558, continue_kind: 'post_series', continue_source: 'manual' })];
    const index2 = buildCoverage(rows2, [], canon);
    const w2 = walkContinue(rows2[1], index2, { finale: true });
    expect(w2.value).toBe(421);
    expect(curatedStandsByRuling(rows2[1], w2, index2)).toBe('finale-above-unknown');
  });
});

describe('annotation precedence is fixed, never the row order', () => {
  it('kinnikuman 33: abridged{95-120} + partial{98} in either order → 98 stays open', () => {
    const rows = [row(32, 97, 95, '95-97'), row(33, 98, 98, '98 (second half)'), row(34, 101, 99, '99-101')];
    const a = { episode: 33, kind: 'abridged', chapters: '95-120' }, b = { episode: 33, kind: 'partial', chapters: '98' };
    for (const anns of [[a, b], [b, a]]) {
      const w = walkContinue(rows[1], buildCoverage(rows, anns, canon), { finale: false });
      expect(w.value).toBe(98); expect(w.kind).toBe('open');
    }
  });
  it('an explicit partial on an END-only pin keeps it open (the-seven-deadly-sins 76)', () => {
    const rows = [row(76, 267, null, null), row(77, 270, 268, '268-270')];
    const w = walkContinue(rows[0], buildCoverage(rows, [{ episode: 76, kind: 'partial', chapters: 'ch 198-267 rushed; 268/272/285 cherry-picked' }], canon), { finale: false });
    expect(w.value).toBe(267); expect(w.kind).toBe('open');
  });
});

describe('the walk — finales, unknown rows, curated agreement', () => {
  it('beelzebub 59: END 121 finished, 122 unread → post_series 122', () => {
    const rows = [row(58, 118, 116, '116-118, 123 (graft)'), row(59, 121, 119, '119, 120, 121')];
    const w = walkContinue(rows[1], buildCoverage(rows, [], canon), { finale: true });
    expect(w.value).toBe(122); expect(w.kind).toBe('post_series'); expect(w.stored).toBe(true);
    expect(w.note).toContain('the anime ends here');
  });
  it('a grafted chapter is touched, never finished: 123 stays unread after ep 58', () => {
    const rows = [row(58, 118, 116, '116-118, 123 (graft)')];
    const index = buildCoverage(rows, [{ episode: 58, kind: 'graft', chapters: '123' }], canon);
    expect(index.finishedAt(123, 58)).toBe(false); expect(index.finishedAt(117, 58)).toBe(true);
  });
  it('unknown is never finished: unanchored canon rows between leave the walk at END + 1 (ranma 93 → 59)', () => {
    const rows = [row(93, 58, 57, '57-58'), row(121, 183, 158, '158-183')];
    const w = walkContinue(rows[0], buildCoverage(rows, [], canon), { finale: false });
    expect(w.value).toBe(59); expect(w.kind).toBe('default'); expect(w.note).toContain('skips ahead: ep 121 opens at ch 158');
  });
  it('a filler row contributes nothing and gets no walk', () => {
    const rows = [row(10, 20, 19, '19-20'), row(11, 22, 21, '21-22')];
    const index = buildCoverage(rows, [], (n) => (n === 11 ? 'filler' : 'canon'));
    expect(index.rows.map((r) => r.episode)).toEqual([10]);
  });
  it('continueAgrees compares the stored value and kind against the walk', () => {
    const rows = [row(54, 109, 109, '109', { continue_chapter: 112, continue_kind: 'parity', continue_source: 'manual' }), row(55, 113, 112, '112 (pp.20-24), 113')];
    const rows2 = [row(52, 110, 110, '110'), ...rows];
    const index = buildCoverage(rows2, [], canon);
    const w = walkContinue(rows2[1], index, { finale: false });
    expect(w.value).toBe(111);
    expect(continueAgrees(rows2[1], w)).toBe(false);
    expect(continueAgrees({ ...rows2[1], continue_chapter: 111, continue_kind: 'walk' }, w)).toBe(true);
    const d = walkContinue(rows2[0], index, { finale: false });
    expect(d.stored).toBe(false); expect(continueAgrees(rows2[0], d)).toBe(true);
  });
});
