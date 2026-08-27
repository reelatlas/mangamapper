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
  it('ignores mu anchors and rows after the pin', () => {
    const t = honestTerminal([{ number: 1, type: 'canon' }, { number: 2, type: 'filler' }, { number: 3, type: 'canon' }], [{ episode: 1, chapter: 5, source: 'mu' }, { episode: 3, chapter: 9, source: 'manual' }], 2);
    expect(t).toBeNull();
    expect(pinRedundant(null, 5)).toBe(false);
  });
  it('chrono-crusade: an A44 position-less mixed row (ep 21) is skipped — ep 20 → 30 is the terminal, MU ch 30 covered', () => {
    const rows = [{ number: 20, type: 'mixed' }, { number: 21, type: 'mixed' }, { number: 22, type: 'filler' }, { number: 24, type: 'filler' }];
    const anchors = [{ episode: 20, chapter: 30, source: 'manual' }];
    expect(honestTerminal(rows, anchors, 24)).toBeNull(); // without the A44 predicate ep 21 blocks
    const t = honestTerminal(rows, anchors, 24, (n) => n === 21);
    expect(t).toEqual({ episode: 20, chapter: 30, source: 'manual' });
    expect(pinRedundant(t, 30)).toBe(true);
  });
});
