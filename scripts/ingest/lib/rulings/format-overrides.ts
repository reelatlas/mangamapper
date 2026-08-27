// FORMAT_OVERRIDES — ruled episode formats (rule T29, T4.4 2026-08-26).
// Rows no component covers, or rows whose component kind is not their
// format (a recap inside a season). Cited; asserted by heal-format.ts;
// a stored format that disagrees is a ruling_violation.
import type { RulingEntry } from './types';

export type FormatValue = 'tv' | 'ova' | 'special' | 'movie' | 'recap';

export const ENTRIES: RulingEntry<Record<number, FormatValue>>[] = [
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T29',
    value: { 95: 'ova', 96: 'ova', 97: 'ova', 98: 'ova' },
    reason: 'Tsuioku-hen (Trust & Betrayal): four OVAs numbered 95-98 after the 94-episode TV run; canon standing (T23: canon AND OVA), no component covers them. T4-GLOSSARY §4 names them as the FORMAT_OVERRIDES witness.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §4', 'https://en.wikipedia.org/wiki/Rurouni_Kenshin:_Trust_%26_Betrayal'],
  },
  {
    seriesId: 'sword-art-online',
    ruleId: 'T29',
    value: { 50: 'movie' },
    reason: "Row 50 is the Ordinal Scale MOVIE (2017-02-18; AFL #50; AniList 21403 MOVIE), not Extra Edition — batch 18 wave 3, verified R24. No component covers it (structure task: kind: movie component + N7).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/verify/sword-art-online.md'],
  },
  {
    seriesId: 'clannad',
    ruleId: 'T29',
    value: { 24: 'ova' },
    reason: "Ep 24 'Another World: Tomoyo Chapter' is the DVD OVA (2008-07-16) after the 23-episode TV run (en-WP episode list; Clannad Wiki). Canon (adapts the VN's Tomoyo route, T6 ruling 2026-08-26).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://en.wikipedia.org/wiki/List_of_Clannad_episodes', 'https://clannad.fandom.com/wiki/Another_World:_Tomoyo_Chapter'],
  },
  {
    seriesId: 'clannad-after-story',
    ruleId: 'T29',
    value: { 24: 'recap', 25: 'ova' },
    reason: "Ep 24 'Under the Green Tree' (2009-03-26) is the summary episode — Tomoya tells Ushio the story from meeting Nagisa to her birth (en-WP); ep 25 'Another World: Kyou Chapter' is the DVD OVA (2009-07-01).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://en.wikipedia.org/wiki/List_of_Clannad_episodes', 'https://clannad.fandom.com/wiki/Another_World:_Kyou_Chapter'],
  },
  {
    seriesId: 'durarara',
    ruleId: 'T29',
    value: { 25: 'ova' },
    reason: 'Row 25 is the S1 OVA 天下泰平 (DVD 13, 2011-02-23) — batch 18 wave 3; the x2 Shou component starts one row late (structure task), so no component covers it.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/out/durarara.json'],
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T29',
    value: { 99: 'ova', 100: 'ova' },
    reason: 'Seisou-hen (Reflection): the two-part 2001-12 / 2002-03 OVA numbered 99-100 after Tsuioku-hen; stored filler (anime-original epilogue), format ova. No component covers them.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://en.wikipedia.org/wiki/Rurouni_Kenshin:_Reflection'],
  },
  {
    seriesId: 'outlaw-star',
    ruleId: 'T29',
    value: { 25: 'tv', 26: 'tv' },
    reason: "Rows 25-26 ('Maze of Despair', 'Return to Space', 1998-06-18/25) are the series' last two TV episodes in the 26-episode space; the component's 1-24 span is AniList's TV-aired count (16 and 23 were 未放映) — a stale span (I33 reconcile), not a format question.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://www.sunrise-inc.co.jp/work/detail.php?cid=94', 'scripts/ingest/research/batch18/verify/outlaw-star.md'],
  },
  {
    seriesId: 'angel-beats',
    ruleId: 'T29',
    value: { 14: 'special', 15: 'special', 16: 'special' },
    reason: "Rows 14-16 ('Another Epilogue', 'Stairway to Heaven' — BD/DVD specials 2010-12-22; 'Hell's Kitchen' — the 2015 BD-box special) numbered after the 13-episode TV run; no component covers them (structure: N7 + special components).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://en.wikipedia.org/wiki/List_of_Angel_Beats!_episodes'],
  },
];

// MERGED per series (a series may carry several format rulings — kenshin's
// Tsuioku-hen 95-98 and Seisou-hen 99-100; last-wins dropped the first on
// 2026-08-26, caught by the healer's null count)
export const FORMAT_OVERRIDES: Record<string, Record<number, FormatValue>> = ENTRIES.reduce<Record<string, Record<number, FormatValue>>>((acc, e) => {
  acc[e.seriesId] = { ...(acc[e.seriesId] ?? {}), ...e.value };
  return acc;
}, {});
