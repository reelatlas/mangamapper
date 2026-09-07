// The wiki page walkers — pure parsing, no network (2026-09-07).
import { describe, expect, it } from 'vitest';
import { extractMainArticles, extractTransclusions } from './wikipedia';

describe('extractMainArticles (the re-zero lesson)', () => {
  const wt = `== Season 3 ==\n{{Main|Re:Zero season 3{{!}}''Re:Zero'' season 3}}\n{{#Section-h:Re:Zero season 3|Attack Arc}}\n{{Main article|Re:Zero season 4|l1=Season 4}}\n{{Main|Re:Zero season 5}}\n{{:Re:Zero season 1}}\n{{Episode list|EpisodeNumber=1}}`;
  it('finds the season sub-articles a list page links instead of transcluding — the nested {{!}} label, the l1= form, the bare form, section transclusions — each once', () => {
    expect(extractMainArticles(wt)).toEqual(['Re:Zero season 3', 'Re:Zero season 4', 'Re:Zero season 5']);
  });
  it('is disjoint from the transclusion walk', () => {
    expect(extractTransclusions(wt)).toEqual(['Re:Zero season 1']);
  });
});
