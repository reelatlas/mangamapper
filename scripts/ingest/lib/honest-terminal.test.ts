// G56 — the honest terminal, proven on the flags that ruled it (2026-08-26).
import { describe, expect, it } from 'vitest';
import { honestTerminal, pinRedundant } from './honest-terminal';

const rows = (types: string[]) => types.map((t, i) => ({ number: i + 1, type: t }));

describe('honestTerminal / pinRedundant (G56)', () => {
  it('claymore: pin on filler ep 24, ep 23 → 59 covers MU ch 59 → redundant', () => {
    const r = rows(['canon', 'canon', 'mixed', 'filler', 'filler', 'filler'].map((t, i) => (i < 3 ? 'canon' : 'filler')));
    r[2] = { number: 3, type: 'mixed' };
    const t = honestTerminal(r, [{ episode: 3, chapter: 59, source: 'manual' }], 4);
    expect(t).toEqual({ episode: 3, chapter: 59, source: 'manual' });
    expect(pinRedundant(t, 59)).toBe(true);
  });
  it('zatch-bell: ep 138 → 211 does not reach MU ch 212 → the refusal stands', () => {
    const t = honestTerminal([{ number: 138, type: 'canon' }, { number: 139, type: 'filler' }], [{ episode: 138, chapter: 211, source: 'manual' }], 139);
    expect(pinRedundant(t, 212)).toBe(false);
  });
  it('hellsing (A4, 2026-08-27): the terminal is the MAX-chapter anchor, not the last row\'s — ep 7 → 12 covers MU ch 12 though ep 10 → 2 is the last manga row', () => {
    const rows = [{ number: 7, type: 'canon' }, { number: 8, type: 'filler' }, { number: 10, type: 'mixed' }, { number: 13, type: 'filler' }];
    const anchors = [{ episode: 7, chapter: 12, source: 'manual' }, { episode: 10, chapter: 2, source: 'manual' }];
    const t = honestTerminal(rows, anchors, 13);
    expect(t).toEqual({ episode: 7, chapter: 12, source: 'manual' });
    expect(pinRedundant(t, 12)).toBe(true);
  });
  it('ignores mu anchors and rows after the pin', () => {
    const t = honestTerminal([{ number: 1, type: 'canon' }, { number: 2, type: 'filler' }, { number: 3, type: 'canon' }], [{ episode: 1, chapter: 5, source: 'mu' }, { episode: 3, chapter: 9, source: 'manual' }], 2);
    expect(t).toBeNull();
    expect(pinRedundant(null, 5)).toBe(false);
  });
  it('chrono-crusade: an A44 position-less mixed row (ep 21) is skipped — ep 20 → 30 is the terminal, MU ch 30 covered', () => {
    const rows = [{ number: 20, type: 'mixed' }, { number: 21, type: 'mixed' }, { number: 22, type: 'filler' }, { number: 24, type: 'filler' }];
    const anchors = [{ episode: 20, chapter: 30, source: 'manual' }];
    // A4 max semantics (2026-08-27): an unanchored later mixed row no longer blocks — the known max is the terminal either way
    expect(honestTerminal(rows, anchors, 24)).toEqual({ episode: 20, chapter: 30, source: 'manual' });
    const t = honestTerminal(rows, anchors, 24, (n) => n === 21);
    expect(t).toEqual({ episode: 20, chapter: 30, source: 'manual' });
    expect(pinRedundant(t, 30)).toBe(true);
  });
});
