// RULED_STRUCTURE — numbered extras and span overrides (rule I39, batch 19
// E4, 2026-08-26). series_components is REBUILT from the AniList chain by
// writeComponents (stitch, reconcile-structure, afg-extend, afg-expansion),
// so a structure row that exists only by hand is wiped on the next rebuild
// (the P8 lesson, applied to structure). Two ruled shapes, both consumed by
// the planner (lib/chain.ts#planComponents) so every writer and the healer
// produce the same rows:
//   extras — a numbered NON-season entry the community counts inside the
//     run (N7): an OVA / special / movie with its own AniList id, placed
//     AFTER a chain member (or first, `after: null`, for an episode-0
//     special), holding `rows` numbered rows; `startAt` pins the first
//     number (0 for an episode-0 row). Later chain members shift by `rows`.
//   spans — a chain member whose AniList episode count is not our space:
//     `episodeEnd` (Outlaw Star: AniList's 24 TV-aired vs the 26-episode
//     production space) or `episodeStart` (fate/UBW: AniList's 13 counts
//     the prologue the community numbers 0 → the span is 0-12).
// Identity evidence for every extra: the row's stored air date EQUALS the
// AniList entry's start date (the sync-watch-order join, R20 — never a title
// guess), plus the batch-18 verdict where one exists. A ruled extra IS its
// N7 review (special_numbered_unreviewed accepts it). Reason + cite required.
import { toRecord, type RulingEntry } from './types';

export type ComponentKind = 'season' | 'ova' | 'special' | 'movie';
export type RuledExtra = { anilistId: number; kind: ComponentKind; label: string; after: number | null; rows: number; startAt?: number };
export type SpanOverride = { episodeStart?: number; episodeEnd?: number };
export type RuledStructure = { extras?: RuledExtra[]; spans?: Record<number, SpanOverride> };

export const ENTRIES: RulingEntry<RuledStructure>[] = [
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'I39',
    value: {
      extras: [
        { anilistId: 44, kind: 'ova', label: 'Tsuioku-hen (Trust & Betrayal)', after: 45, rows: 4 },
        { anilistId: 401, kind: 'ova', label: 'Seisou-hen (Reflection)', after: 44, rows: 2 },
      ],
    },
    reason:
      'Rows 95-98 are the four Tsuioku-hen OVAs (AniList 44: OVA, 4 eps, 1999-02-20 → our row 95 1999-02-20) and 99-100 the two Seisou-hen OVAs (AniList 401: OVA, 2 eps, 2001-12-03 → our row 99 2001-12-03), numbered after the 94-episode TV run by AFL and adopted by the episode floor (EXTRAS_ADOPTED 95-100). Formats already ruled ova (T29); these rows give them structure.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/44', 'https://anilist.co/anime/401', 'scripts/ingest/lib/rulings/format-overrides.ts', 'docs/restructure/T4-GLOSSARY.md §4'],
  },
  {
    seriesId: 'sword-art-online',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 21403, kind: 'movie', label: 'Ordinal Scale', after: 20594, rows: 1 }] },
    reason: 'Row 50 is the Ordinal Scale film (AniList 21403: MOVIE, 2017-02-18 = our row 50 date); batch 18 wave 3 verified it and named the missing movie-kind component. The stored spans already skip 50 (26-49 → 51-74).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/21403', 'scripts/ingest/research/batch18/verify/sword-art-online.md'],
  },
  {
    seriesId: 'clannad',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 4059, kind: 'ova', label: 'Another World: Tomoyo Chapter', after: 2167, rows: 1 }] },
    reason: "Row 24 'Another World: Tomoyo Chapter' 2008-07-16 = AniList 4059 (OVA, 2008-07-16), the DVD OVA after the 23-episode TV run (format ruled ova, T29).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/4059', 'scripts/ingest/lib/rulings/format-overrides.ts'],
  },
  {
    seriesId: 'clannad-after-story',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 6351, kind: 'ova', label: 'Another World: Kyou Chapter', after: 4181, rows: 1 }] },
    reason: "Row 25 'Another World: Kyou Chapter' 2009-07-01 = AniList 6351 (OVA, 2009-07-01), the DVD OVA after the 24-episode run (format ruled ova, T29).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/6351', 'scripts/ingest/lib/rulings/format-overrides.ts'],
  },
  {
    seriesId: 'angel-beats',
    ruleId: 'I39',
    value: {
      extras: [
        { anilistId: 10067, kind: 'special', label: 'Another Epilogue', after: 6547, rows: 1 },
        { anilistId: 9062, kind: 'special', label: 'Angel Beats! Specials (Stairway to Heaven; Hell\'s Kitchen)', after: 10067, rows: 2 },
      ],
    },
    reason: "Row 14 'Another Epilogue' 2010-12-22 = AniList 10067 (SPECIAL, 2010-12-22); rows 15-16 'Stairway to Heaven' 2010-12-22 and 'Hell's Kitchen' 2015-06-24 = AniList 9062 Tokubetsu-hen (SPECIAL, 2 eps, 2010-12-22 → 2015-06-24). Adopted by the episode floor (EXTRAS_ADOPTED 14-16); formats ruled special (T29).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/10067', 'https://anilist.co/anime/9062', 'scripts/ingest/lib/rulings/format-overrides.ts'],
  },
  {
    seriesId: 'cowboy-bebop',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 5, kind: 'movie', label: "Knockin' on Heaven's Door", after: 1, rows: 1 }] },
    reason: "Row 27 'The Movie' 2001-09-01 = AniList 5 (MOVIE, 2001-09-01), numbered after the 26 sessions by AFL. The movie-kind component gives the row its format (E2 residual: bebop 27 belongs to E4, Sean 2026-08-26).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/5', 'docs/changelog.md §12.66'],
  },
  {
    seriesId: 'durarara',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 8408, kind: 'special', label: 'World at Peace (S1 DVD special)', after: 6746, rows: 1 }] },
    reason: "Row 25 'World at Peace' 2011-02-23 = the second of AniList 8408 Durarara!! Specials (2010-08-25 → 2011-02-23); one numbered row (the 12.5 special is order-only). Batch 18 wave 3 found x2 Shou / Ten / Ketsu stored one row too low (25-36 / 37-48 / 49-60) with row 61 outside every component; the extra shifts them to 26-37 / 38-49 / 50-61 — confirmed by title (row 26 = x2 Shou #1, 2015-01-10). Format stays the ruled ova (T29).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/8408', 'scripts/ingest/research/batch18/out/durarara.json'],
  },
  {
    seriesId: 'kamisama-kiss',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 98033, kind: 'ova', label: 'Kamisama, Shiawase ni Naru', after: 21186, rows: 1 }] },
    reason: "Row 30 'The God at the Eve of Marriage' 2016-12-20 = AniList 98033 (OVA, 2016-12-20), after the Kako-hen OVAs 26-29 (N7-reviewed).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/98033', 'scripts/ingest/lib/rulings/reviewed-specials.ts'],
  },
  {
    seriesId: 'heavens-lost-property',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 7858, kind: 'ova', label: 'Project Pink (OVA)', after: 5958, rows: 1 }] },
    reason: "Row 14 'Project Pink' 2010-09-09 = AniList 7858 (OVA, 2010-09-09), numbered between S1 (13) and Forte by AFL. Without it the stored structure was one row low from 14 on: Forte 14-25 while row 26 (2010-12-17) is Forte's finale, the films at 26/27 while rows 27 (2011-06-25 = AniList 9790's date) and 28 (2014-04-26 = AniList 12783's date) are the films. The extra shifts Forte to 15-26 and the films to 27 / 28 — the N7 reviews of 9790 and 12783 stand, their '26' / '27' wording was one row stale.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/7858', 'https://anilist.co/anime/9790', 'https://anilist.co/anime/12783'],
  },
  {
    seriesId: 'assassination-classroom',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 21303, kind: 'special', label: 'episode:0 Meeting Time', after: null, rows: 1, startAt: 0 }] },
    reason: "Row 0 'Meeting Time' 2014-11-09 = AniList 21303 'episode:0 Deai no Jikan' (SPECIAL, 2014-11-09), a pre-broadcast special the community numbers 0 (N7); it precedes the S1 component (22 eps, 1-22).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/21303'],
  },
  {
    seriesId: 'another',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 11701, kind: 'ova', label: 'The Other - Inga', after: null, rows: 1, startAt: 0 }] },
    reason: "Row 0 'The other' 2012-05-26 = AniList 11701 'Another: The Other - Inga' (OVA, 2012-05-26), the prequel OVA the community numbers 0 (N7).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/11701'],
  },
  {
    seriesId: 'deadman-wonderland',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 10418, kind: 'ova', label: 'The Red Knife Wielder', after: null, rows: 1, startAt: 0 }] },
    reason: "Row 0 'The Red Knife Wielder' 2011-10-08 = AniList 10418 'Akai Knife Tsukai' (OVA, 2011-10-08), the prequel OVA the community numbers 0 (N7).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/10418'],
  },
  {
    seriesId: 'no-game-no-life',
    ruleId: 'I39',
    value: { extras: [{ anilistId: 21875, kind: 'movie', label: 'No Game No Life: Zero', after: null, rows: 1, startAt: 0 }] },
    reason: "Row 0 'No Game No Life : Zero' 2017-07-15 = AniList 21875 (MOVIE, 2017-07-15), the prequel film the community numbers 0 (N7). Kind movie — the row's format derives movie, no override needed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/21875'],
  },
  {
    seriesId: 'outlaw-star',
    ruleId: 'I39',
    value: { spans: { 400: { episodeEnd: 26 } } },
    reason: "AniList 400 counts 24 (TV-aired; eps 16 and 23 were 未放映) but the production space is 26 and our rows are in it — rows 25 'Maze of Despair' and 26 'Return to Space' (1998-06-18/25) are the last two episodes (Sunrise; batch 18 verified). Formats ruled tv (T29); the span is the structure half of that ruling.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://www.sunrise-inc.co.jp/work/detail.php?cid=94', 'scripts/ingest/research/batch18/verify/outlaw-star.md'],
  },
  {
    seriesId: 'fate-stay-night-unlimited-blade-works',
    ruleId: 'I39',
    value: { spans: { 19603: { episodeStart: 0 } } },
    reason: "AniList 19603's 13 episodes include the one-hour prologue the community (and AFL) number 0: our rows run 0-12 ('Prologue' 2014-10-04 … 'The Final Choice' 2014-12-27) and S2 (20792, 13 eps) continues 13-25 ('Time of Departure' 2015-04-04). The stored 1-13 / 14-26 was one row high and left row 0 outside every component.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://anilist.co/anime/19603', 'https://anilist.co/anime/20792'],
  },
];

export const RULED_STRUCTURE: Record<string, RuledStructure> = toRecord(ENTRIES);

/** N7: a ruled extra is its own review — the census accepts it as reviewed */
export const RULED_EXTRA_KEYS: Set<string> = new Set(ENTRIES.flatMap((e) => (e.value.extras ?? []).map((x) => `${e.seriesId}:${x.anilistId}`)));
