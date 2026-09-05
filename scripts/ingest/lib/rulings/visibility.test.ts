// P39 — visibility, pure
import { describe, expect, it } from 'vitest';
import { deriveVisibility } from './visibility';

describe('deriveVisibility (P39)', () => {
  it('a classifier registration publishes; a seed with neither is staged', () => {
    expect(deriveVisibility('no-such-series', { afl: true, afg: false })).toBe('public');
    expect(deriveVisibility('no-such-series', { afl: false, afg: true })).toBe('public');
    expect(deriveVisibility('no-such-series', { afl: false, afg: false })).toBe('staged');
  });
  it('a ruling that typed the rows is a classifier: T6 pins (clear-card, kinnikuman) and a ruled grid (shounan) publish without any page', () => {
    expect(deriveVisibility('cardcaptor-sakura-clear-card', { afl: false, afg: false })).toBe('public');
    expect(deriveVisibility('kinnikuman', { afl: false, afg: false })).toBe('public');
    expect(deriveVisibility('shounan-junai-gumi', { afl: false, afg: false })).toBe('public');
  });
});
