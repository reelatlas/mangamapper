// C7 — continue provenance, proven on the rows that ruled it (2026-08-27).
import { describe, expect, it } from 'vitest';
import { continueUnprovenanced, curatedOverwritten, isCuratedContinue, isHealerNote } from './continues';

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
});
