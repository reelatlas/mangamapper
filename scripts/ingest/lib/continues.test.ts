// C7 — continue provenance, proven on the rows that ruled it (2026-08-27).
import { describe, expect, it } from 'vitest';
import { continueUnprovenanced, curatedOverwritten, firstChapterOf, healerContinueBasisGone, isCuratedContinue, isHealerNote, parityBasis } from './continues';

describe('C7 continue provenance', () => {
  it('a manual continue is curated; healer and source rows are not', () => {
    expect(isCuratedContinue({ continue_chapter: 18, continue_source: 'manual' })).toBe(true);
    expect(isCuratedContinue({ continue_chapter: 20, continue_source: 'healer' })).toBe(false);
    expect(isCuratedContinue({ continue_chapter: 108, continue_source: 'source' })).toBe(false);
    expect(isCuratedContinue({ continue_chapter: null, continue_source: 'manual' })).toBe(false);
  });
  it("recognises the healer's own note shapes (the migration backfill's rule)", () => {
    expect(isHealerNote('parity with anime (Sean C2 2026-08-24): ep 36 starts ch 20; chs 18-19 not yet seen')).toBe(true);
    expect(isHealerNote('C3 (Sean 2026-08-25): this episode also covered ch 97,98 — skip on arrival')).toBe(true);
    expect(isHealerNote('research-tier batch 19 wave 2 (2026-08-27): C2 parity — ep 28 starts ch 12')).toBe(false);
    expect(isHealerNote(null)).toBe(false);
  });
  it('the outcome: a curated row wearing a healer note was overwritten (tokyo-mew-mew 28, 2026-08-27)', () => {
    expect(curatedOverwritten({ continue_chapter: 20, continue_source: 'manual', continue_note: 'parity with anime (Sean C2 2026-08-24): ep 36 starts ch 20' })).toBe(true);
    expect(curatedOverwritten({ continue_chapter: 18, continue_source: 'manual', continue_note: 'C2/C3 — ep 28 closes the backfill' })).toBe(false);
  });
  it('a continue with no marker is unprovenanced (a writer forgot the column)', () => {
    expect(continueUnprovenanced({ continue_chapter: 5, continue_source: null })).toBe(true);
    expect(continueUnprovenanced({ continue_chapter: null, continue_source: null })).toBe(false);
  });

  // C7 × A14 (2026-09-07): record-of-ragnarok ep 21's healer continue 31 was derived from ep 22's round-grain START 31;
  // the START was nulled under A14 (with its span) — the basis is gone, the healer clears, the audit lists one standing
  describe('a healer continue whose basis is gone (record-of-ragnarok 21 → 22, 2026-09-07)', () => {
    const types = new Map<number, string>([[21, 'canon'], [22, 'canon'], [23, 'canon']]);
    const typeOf = (n: number) => types.get(n);
    const ep21 = { episode: 21, chapter: 40, continue_chapter: 31, continue_kind: 'parity', continue_source: 'healer', continue_note: 'parity with anime (Sean C2 2026-08-24): ep 22 starts ch 31; anime jumps back' };
    it('the basis is the next adjacent canon / mixed row\'s start, else the first chapter its span names', () => {
      expect(parityBasis(ep21, { episode: 22, start_chapter: 31, chapters_adapted: '31-42 + ch 43 partial' }, typeOf)).toBe(31);
      expect(parityBasis(ep21, { episode: 22, start_chapter: null, chapters_adapted: '31-42 + ch 43 partial' }, typeOf)).toBe(31);
      expect(parityBasis(ep21, { episode: 22, start_chapter: null, chapters_adapted: null }, typeOf)).toBeNull();
      expect(parityBasis(ep21, undefined, typeOf)).toBeNull();
      // an unanchored canon row between (22 unanchored, next anchored is 23): no basis
      expect(parityBasis(ep21, { episode: 23, start_chapter: 43, chapters_adapted: '43-45' }, typeOf)).toBeNull();
      // a filler row between does not break adjacency
      expect(parityBasis(ep21, { episode: 23, start_chapter: 43, chapters_adapted: '43-45' }, (n) => (n === 22 ? 'filler' : types.get(n)))).toBe(43);
    });
    it('a healer parity continue with no basis is gone; a curated one never is', () => {
      const nulled = { episode: 22, start_chapter: null, chapters_adapted: null };
      expect(healerContinueBasisGone(ep21, nulled, parityBasis(ep21, nulled, typeOf))).toBe(true);
      expect(healerContinueBasisGone(ep21, { episode: 22, start_chapter: 31 }, 31)).toBe(false);
      expect(healerContinueBasisGone({ ...ep21, continue_source: 'manual' }, nulled, null)).toBe(false);
      expect(healerContinueBasisGone({ ...ep21, continue_kind: 'post_series' }, nulled, null)).toBe(false);
      expect(healerContinueBasisGone({ ...ep21, continue_chapter: null }, nulled, null)).toBe(false);
      expect(healerContinueBasisGone(ep21, undefined, null)).toBe(false);
      // the C1 shape (aoashi 23 → 111 = its own END; ep 24 is an END-only continua pin): kept, the row's own tail is the basis
      expect(healerContinueBasisGone({ episode: 23, chapter: 111, continue_chapter: 111, continue_kind: 'parity', continue_source: 'healer' }, { episode: 24, start_chapter: null, chapters_adapted: null }, null)).toBe(false);
      // a skip ahead across unanchored canon rows (ranma 93 → 158 with END 58, next anchored row 121): gone
      expect(healerContinueBasisGone({ episode: 93, chapter: 58, continue_chapter: 158, continue_kind: 'parity', continue_source: 'healer' }, { episode: 121, start_chapter: 158 }, null)).toBe(true);
    });
    it('firstChapterOf reads the first number of a span (an integer, floored)', () => {
      expect(firstChapterOf('31-42 + ch 43 partial')).toBe(31);
      expect(firstChapterOf('v16 ch 1')).toBe(16);
      expect(firstChapterOf('20.5 (pp.1-3)')).toBe(20);
      expect(firstChapterOf(null)).toBeNull();
    });
  });
});
