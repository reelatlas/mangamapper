// N35 sourceShifts — a source's chapter numbers converted into the ruled (printed) space (2026-09-02, the Dai case)
import { describe, expect, it } from 'vitest';
import { toRuledChapter } from './chapter-spaces';

describe('toRuledChapter (N35 sourceShifts)', () => {
  it('dai: the 349-slot list numbers (en-WP / MU / AniList) are printed + 1 from 123', () => {
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'wikipedia', 122)).toBe(121); // the removed slot: an END resolves to the last printed chapter
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'wikipedia', 123)).toBe(122);
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'mu', 349)).toBe(348);
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'afg', 200)).toBe(199);
  });
  it('dai: the fandom has NO ruled shift (wave 13\'s inferred from-208 window was refuted by wave 14 B — the title test)', () => {
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'fandom', 206)).toBe(206);
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'fandom', 208)).toBe(208);
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'fandom', 221)).toBe(221);
  });
  it('identity for a series with no ruled shift, and for null', () => {
    expect(toRuledChapter('orange', 'mu', 22)).toBe(22);
    expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'mu', null)).toBeNull();
  });
});

it('N35 sourceShifts: a list number ON a removed slot resolves by role — the last printed chapter as an END, the next as a START (dai list 122 = the unnumbered 番外編)', () => {
  expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'wikipedia', 122)).toBe(121);
  expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'wikipedia', 122, 'end')).toBe(121);
  expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'wikipedia', 122, 'start')).toBe(122);
  expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'wikipedia', 121, 'start')).toBe(121);
  expect(toRuledChapter('dragon-quest-the-adventure-of-dai', 'wikipedia', 123, 'start')).toBe(122);
});
