import { describe, expect, it } from 'vitest';
import { c3Ahead, hasSkipLanguage } from './c3';

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
