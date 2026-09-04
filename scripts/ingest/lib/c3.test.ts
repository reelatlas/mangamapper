import { describe, expect, it } from 'vitest';
import { backjumpNoteOk, backjumpRange, c3Ahead, hasSkipLanguage } from './c3';

describe('C3 (a continue below the row\'s own chapters)', () => {
  it('lists the covered chapters ahead of the continue, ignoring page facts', () => {
    expect(c3Ahead('142 (p.3-9), 145', 143)).toEqual([145]);
    expect(c3Ahead('142, 143', 143)).toEqual([]); // C1 straddle, not a skip
  });
  it('recognises skip language', () => {
    expect(hasSkipLanguage('skip on arrival')).toBe(true);
    expect(hasSkipLanguage('parity with anime')).toBe(false);
  });
});

describe('the C3 twin (a back-jump exit whose continue sits above its END)', () => {
  it('names the range between END and the continue only when there is one', () => {
    expect(backjumpRange(318, 343)).toEqual([319, 342]); // shippuden 112
    expect(backjumpRange(244, 353)).toEqual([245, 352]); // Kakashi Gaiden 120
    expect(backjumpRange(318, 319)).toBeNull(); // END + 1: nothing in between
    expect(backjumpRange(318, 318)).toBeNull(); // C1: continue IN the END
  });
  it('accepts a note that says the stretch was already adapted, or never', () => {
    expect(backjumpNoteOk('C2 parity with the anime … chs 319-342 were read long ago (eps 74-89)')).toBe(true);
    expect(backjumpNoteOk('a backward, first-time pass over chs 317-318')).toBe(true);
    expect(backjumpNoteOk('chs 291-299 never adapted — kind unseen')).toBe(true);
    expect(backjumpNoteOk('ch 319-343 already covered at eps 74-90')).toBe(true);
  });
  it('refuses a note that names neither', () => {
    expect(backjumpNoteOk('parity with anime (Sean C2 2026-08-24): ep 121 starts ch 353')).toBe(false);
    expect(backjumpNoteOk(null)).toBe(false);
  });
});
