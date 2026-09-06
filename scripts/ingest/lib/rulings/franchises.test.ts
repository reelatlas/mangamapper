// I43 — the franchise map's integrity and the shapes that ruled it
import { describe, expect, it } from 'vitest';
import { ENTRIES, FRANCHISES, FRANCHISE_OF, OWN_IP, franchiseMapProblems } from './franchises';

describe('franchises (I43)', () => {
  it('the map has no integrity problems (one series → one franchise; one title and one base per franchise; never a franchise of one)', () => {
    expect(franchiseMapProblems()).toEqual([]);
  });
  it('the bootstrap: Yu-Gi-Oh is nine entries under one IP; Dragon Ball six; Naruto three; every 2026-09-05 entry is session-ruled until Sean signs', () => {
    expect(FRANCHISES['yu-gi-oh'].members).toHaveLength(9);
    expect(FRANCHISES['dragon-ball'].members).toHaveLength(7); // the six bootstrap members + dragon-ball-episode-of-bardock (the step-2 picks pass, 2026-09-06)
    expect(FRANCHISE_OF['naruto-shippuden']).toBe('naruto');
    expect(FRANCHISE_OF['boruto-naruto-next-generations']).toBe('naruto');
    expect(FRANCHISES['naruto'].base).toBe('naruto');
    expect(ENTRIES.every((e) => e.ruledBy === 'session' || e.ruledBy === 'Sean')).toBe(true);
  });
  it('the umbrella is not a merge: Tokyo Ghoul and :re share a franchise and stay two series ids', () => {
    expect(FRANCHISE_OF['tokyo-ghoul']).toBe('tokyo-ghoul');
    expect(FRANCHISE_OF['tokyo-ghoul-re']).toBe('tokyo-ghoul');
  });
  it('a shared-universe cameo is not the IP: fire-force and witch-watch are ruled their OWN IP (franchise: null) and are absent from FRANCHISE_OF', () => {
    expect(OWN_IP.has('fire-force')).toBe(true);
    expect(OWN_IP.has('witch-watch')).toBe(true);
    expect(FRANCHISE_OF['fire-force']).toBeUndefined();
    expect(FRANCHISES['soul-eater'].members).toEqual(['soul-eater', 'soul-eater-not']);
  });
  it('a crossover pair is never merged: dragon-ball-z and one-piece sit in different franchises', () => {
    expect(FRANCHISE_OF['dragon-ball-z']).toBe('dragon-ball');
    expect(FRANCHISE_OF['one-piece']).toBe('one-piece');
  });
});
