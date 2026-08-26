// SOURCE_NUMBERING_SHIFTS — source-space → our-space episode translation
// (N11, Sean's ruling 2026-08-23, the Dr. Stone / Ryuusui lesson): a source
// that NUMBERS an entry our community count holds order-only lives in a
// different numbering space — its rows past the insert shift into ours and
// the insert's own row drops (it exists as a watch-order component, never an
// episode). Without this, titles AND types downstream of the insert are
// silently off by the insert's length.
//   drop:   source-space numbers whose rows are the order-only entry itself
//   shifts: source number n ≥ from maps to our number n + offset
//   spaces: (N12, 2026-08-25 the mashle lesson) the SOURCE SPACES the shift
//           applies to ('afl' | 'afg' | 'wiki'). Absent = every space (the
//           historical entries: AFL and AFG both number the dropped entry).
//           Every caller states its space; the shift skips spaces it does
//           not name.
//
// Consumer shape: Record<seriesId, Shift> (filterEpisodeRows,
// translateEpisodeNumber).

import type { RulingEntry } from './types';
import { toRecord } from './types';

export type Shift = { drop: number[]; shifts: { from: number; offset: number }[]; spaces?: string[] };

export const ENTRIES: RulingEntry<Shift>[] = [
  {
    seriesId: 'dr-stone',
    ruleId: 'N11',
    value: { drop: [36], shifts: [{ from: 37, offset: -1 }] },
    reason:
      'AFL numbers the Ryuusui special as ep 36; our ruling holds it order-only at position 36, so AFL rows from 37 shift down by one. The originating lesson: without the shift every title and type after the insert was off by one.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  // Queue-2 Group C demotions (Sean sign-off 2026-08-23): standalone
  // bonuses / films the community does not number — order-only by ruling;
  // AFL numbers them, so its rows translate on every refresh.
  {
    seriesId: 'yu-yu-hakusho-ghostfiles',
    ruleId: 'N11',
    value: { drop: [113], shifts: [] },
    reason:
      'Queue-2 Group C demotion: the Picture Drama bonus AFL numbers as 113 is a standalone bonus the community does not number — order-only, row drops (trailing, so no shift). The community cap (N3) is the durable instrument because AFL renumbers after drops.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'miss-kobayashis-dragon-maid',
    ruleId: 'N11',
    value: { drop: [14], shifts: [{ from: 15, offset: -1 }] },
    reason:
      'Queue-2 Group C demotion: the Valentine/Onsen bonus OVA AFL numbers as 14 is order-only in the community count; the row drops and later AFL rows shift down by one.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'fate-kaleid-liner-prisma-illya',
    ruleId: 'N11',
    value: { drop: [11], shifts: [{ from: 12, offset: -1 }] },
    reason:
      'Queue-2 Group C demotion: the Undoukai DE Dance bonus AFL numbers as 11 is order-only in the community count; the row drops and later AFL rows shift down by one.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'mashle-magic-and-muscles',
    ruleId: 'N12',
    value: { drop: [7], shifts: [{ from: 8, offset: -1 }], spaces: ['afl'] },
    reason:
      "Sean's fractional ruling: the S1 recap is integer ep 7 in AFL's numbering only — AFG / fandom / Wikipedia / AniList all exclude it (fandom calls it \"Episode 6.5\"). Our rows follow the community convention (recap = watch-order entry at 6.5, main rows 1-24), so only AFL-space rows translate; AFG chart numbers are ALREADY in our space and must not shift — the lesson that added `spaces`.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: ['scripts/ingest/research/batch17/CHUNK1-RECOVERY.md §9', 'scripts/ingest/research/batch17/out/mashle-magic-and-muscles.json'],
  },
  {
    seriesId: 'prison-school',
    ruleId: 'N11',
    value: { drop: [13], shifts: [] },
    reason:
      'Queue-2 Group C demotion: the Mad Wax bonus OVA AFL numbers as 13 is order-only in the community count; trailing, so the row drops with no shift.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'to-love-ru-darkness',
    ruleId: 'N11',
    value: { drop: [25, 26], shifts: [] },
    reason:
      'Queue-2 Group C demotion: the 2nd Specials bonuses AFL numbers as 25-26 are order-only in the community count; trailing, so the rows drop with no shift.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'ghost-in-the-shell-stand-alone-complex',
    ruleId: 'N11',
    value: { drop: [53], shifts: [] },
    reason:
      'Queue-2 Group C demotion: Solid State Society is a FILM (movies are order-only unless community-numbered); AFL numbers it as 53, so the row drops — trailing, no shift.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'yu-gi-oh-2000',
    ruleId: 'N11',
    value: { drop: [225], shifts: [] },
    reason:
      'Queue-2 Group C demotion: Dark Side of Dimensions is a FILM (movies are order-only unless community-numbered); AFL numbers it as 225, so the row drops — trailing, no shift.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'bungo-stray-dogs',
    ruleId: 'N11',
    value: { drop: [25], shifts: [{ from: 26, offset: -1 }] },
    reason:
      "AFL counts the 2017 OVA 'Hitori Ayumu' as ep 25 (aired between S2 and S3), shifting S3+ by +1 against the community's 60-episode TV numbering — fandom's 'Episode 61' = TV ep 60 'Twilight Goodbye'. The OVA holds watch position 24.5 (order-only, adapts ~ch 40 side material). Research batch 8.",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'seraph-of-the-end-vampire-reign',
    ruleId: 'N11',
    value: { drop: [25], shifts: [] },
    reason:
      "AFL counts the anime-original OVA 'Vampire Shahal' (May 2016) as a trailing ep 25; only 24 TV episodes exist. No shift — the row is at the end. The OVA holds watch position 24.5 (order-only, adapts no manga). Research batch 9.",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'kimi-ni-todoke-from-me-to-you',
    ruleId: 'N11',
    value: { drop: [44], shifts: [] },
    reason:
      "Netflix lists a ~14-min RECAP special ('S3 Episode 00') as a sixth S3 item and AFL numbers it as a trailing ep 44 — only 43 story episodes exist. Recap rule (N8): excluded; trailing, so no shift. Research batch 10.",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
];

export const SOURCE_NUMBERING_SHIFTS: Record<string, Shift> = toRecord(ENTRIES);
