// The wiki page walkers — pure parsing, no network (2026-09-07).
import { describe, expect, it } from 'vitest';
import { extractMainArticles, extractTransclusions, multiPartTitle, parseEpisodeList } from './wikipedia';

describe('extractMainArticles (the re-zero lesson)', () => {
  const wt = `== Season 3 ==\n{{Main|Re:Zero season 3{{!}}''Re:Zero'' season 3}}\n{{#Section-h:Re:Zero season 3|Attack Arc}}\n{{Main article|Re:Zero season 4|l1=Season 4}}\n{{Main|Re:Zero season 5}}\n{{:Re:Zero season 1}}\n{{Episode list|EpisodeNumber=1}}`;
  it('finds the season sub-articles a list page links instead of transcluding — the nested {{!}} label, the l1= form, the bare form, section transclusions — each once', () => {
    expect(extractMainArticles(wt)).toEqual(['Re:Zero season 3', 'Re:Zero season 4', 'Re:Zero season 5']);
  });
  it('is disjoint from the transclusion walk', () => {
    expect(extractTransclusions(wt)).toEqual(['Re:Zero season 1']);
  });
});

describe('parseEpisodeList — a two-part episode entry (the re-zero row-67 lesson, G59)', () => {
  const wt = `{{Episode list\n |EpisodeNumber = 67\n |EpisodeNumber2 = 1\n |NumParts = 2\n |Title_1 = The Reason I'm Taking You With Me\n |NativeTitle_1 = 君を連れ出す理由\n |Title_2 = Gorgeous Tiger Reloaded\n |NativeTitle_2 = ゴージャス・タイガー・リローデッド\n |OriginalAirDate = {{Start date|2026|4|8}}\n}}\n{{Episode list\n |EpisodeNumber = 68\n |Title = Overcome Sand Time\n |OriginalAirDate = {{Start date|2026|4|15}}\n}}`;
  it('joins Title_1 … Title_N with " / " when the entry has no Title; a plain Title still wins', () => {
    const rows = parseEpisodeList(wt);
    expect(rows.map((r) => [r.number, r.title, r.airDate])).toEqual([
      [67, "The Reason I'm Taking You With Me / Gorgeous Tiger Reloaded", '2026-04-08'],
      [68, 'Overcome Sand Time', '2026-04-15'],
    ]);
    expect(multiPartTitle('|Title_2 = B\n|Title_1 = A')).toBe('A / B');
    expect(multiPartTitle('|Title = A')).toBeNull();
  });
});
