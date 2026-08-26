// Reviewed numbered specials — N7, the numbered-specials research trigger
// (restructure T2.1, 2026-08-26; formerly the REVIEWED_NUMBERED_SPECIALS
// literal in scripts/ingest/audit-ui-truth.ts). Sean's standing rule
// (2026-08-24): ANY non-typical entry (special / OVA / movie / recap) that any
// source NUMBERS into a run is a research trigger — verify against community
// consensus, ask Sean, then record the ruling HERE. A numbered non-season
// component absent from this list is an open audit hit
// (special_numbered_unreviewed), never a silent count.
// value = the component's AniList id; the audit key is `${seriesId}:${id}`.
// Confidence (Queue-2 sign-off 2026-08-23): A = high, B = medium
// (community-practice based; re-open if evidence emerges).

import type { RulingEntry } from './types';

export const ENTRIES: RulingEntry<number>[] = [
  {
    seriesId: 'initial-d',
    ruleId: 'N7',
    value: 187,
    reason: "Third Stage (a movie mid-sequence) = AFL's ep 40 — the founding precedent: it carries mainline plot and AFL numbers it (movies count only when numbered, N4).",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: ['docs/franchise-rulings.md "Initial D"'],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'N7',
    value: 146984,
    reason: 'Final Chapters Zenpen = ep 88 (AFL-numbered); community-counted.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'N7',
    value: 165790,
    reason: 'Final Chapters Kouhen = ep 89 (AFL-numbered); community-counted.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'hunter-x-hunter',
    ruleId: 'N7',
    value: 137,
    reason: 'HxH 1999 OVA continuations (137/138/139) ruled in-flow: they continue the 1999 run and are community-counted.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'hunter-x-hunter',
    ruleId: 'N7',
    value: 138,
    reason: 'HxH 1999 OVA continuations (137/138/139) ruled in-flow: they continue the 1999 run and are community-counted.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'hunter-x-hunter',
    ruleId: 'N7',
    value: 139,
    reason: 'HxH 1999 OVA continuations (137/138/139) ruled in-flow: they continue the 1999 run and are community-counted.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'fist-of-the-blue-sky',
    ruleId: 'N7',
    value: 3864,
    reason: 'Reviewed as: 4 DVD episodes, AFL numbers 23-26. STALE (DRIFT-LIST §B): the 23-26 span was demoted to order-only on 2026-08-25b, so the component no longer carries an episode span and this entry is inert — kept as the record of the review, not deleted.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    retiresWhen: 'the fotbs 3864 component is confirmed order-only by audit-ui-truth (no numbered span) — then drop the entry',
  },
  {
    seriesId: 'hajime-no-ippo-the-fighting',
    ruleId: 'N7',
    value: 12069,
    reason: "Boxer's Fist = community ep 76; counted.",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'dr-stone',
    ruleId: 'N7',
    value: 142876,
    reason: "Ryuusui: order-only at position 36 (after Stone Wars) — Sean confirmed 2026-08-24; the community places it mid-run. STALE wording (DRIFT-LIST §B): the source comment's \"his 'ep 95' was a typo\" aside records a superseded exchange; the ruling that stands is order-only at 36 (SOURCE_NUMBERING_SHIFTS drops AFL's row 36). As an order-only component it carries no numbered span, so this entry is inert — kept as the record.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    retiresWhen: 'the dr-stone 142876 component is confirmed order-only by audit-ui-truth (no numbered span) — then drop the entry',
  },
  // ── Queue-2 Groups A+B, Sean sign-off 2026-08-23: continuation/finale
  // content the community counts as episodic canon (kind stays on the
  // component for UI differentiation later).
  {
    seriesId: 'haikyu',
    ruleId: 'N7',
    value: 111790,
    reason: 'A (high): Riku vs Kuu OVA = eps 61-62 — our conversion ruling; community counts it.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'N7',
    value: 162314,
    reason: 'A (high): Final Chapters Kouhen = ep 89 (twin of the reviewed 88).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'monogatari-series',
    ruleId: 'N7',
    value: 100815,
    reason: 'A (high): Zoku Owarimonogatari = 97-102 under the one-series numbering (Sean: Monogatari is ONE series).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'relife',
    ruleId: 'N7',
    value: 98635,
    reason: 'A (high): Kanketsu-hen 14-17 = the actual ending of the story.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'black-lagoon',
    ruleId: 'N7',
    value: 4901,
    reason: "A (high): Roberta's Blood Trail is functionally S3.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'when-they-cry',
    ruleId: 'N7',
    value: 3652,
    reason: 'A (high): Rei 51-55 is counted as the third entry.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'kenichi-the-mightiest-disciple',
    ruleId: 'N7',
    value: 11813,
    reason: 'A (high): OVA 51-61 is a direct continuation.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'steins-gate',
    ruleId: 'N7',
    value: 10863,
    reason: 'A (high): the Egg OVA = ep 25 epilogue, near-universally counted.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'cardcaptor-sakura',
    ruleId: 'N7',
    value: 98554,
    reason: 'A (high): Clear Card Prologue OVA = ep 71 — Sean 2026-08-24: Sealed Card is the direct FINALE but stays order-only (@70.2); the Prologue OVA is the bridge to the sequel and acts as ep 71 (community identity).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'shounan-junai-gumi',
    ruleId: 'N7',
    value: 1913,
    reason: 'A (high): the series IS the 5-episode OVA run — numbering 1-5 is its identity (Sean 2026-08-24).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'the-future-diary',
    ruleId: 'N7',
    value: 16762,
    reason: 'A (high): Redial = ep 27 epilogue.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'heavens-lost-property',
    ruleId: 'N7',
    value: 9790,
    reason: 'A (high): Clockwork Angeloid film = ep 26, canon continuation.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'heavens-lost-property',
    ruleId: 'N7',
    value: 12783,
    reason: 'A (high): Final film = ep 27, canon conclusion.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'gintama',
    ruleId: 'N7',
    value: 126819,
    reason: 'A (high): Semi-Final 368-369, canon prelude to the finale film.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'to-love-ru',
    ruleId: 'N7',
    value: 5667,
    reason: 'B (medium): OVA 27-32 bridges to Motto; community-practice based — re-open if evidence emerges.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'kill-la-kill',
    ruleId: 'N7',
    value: 20572,
    reason: 'B (medium): Tokubetsu-hen = ep 25, commonly counted; community-practice based — re-open if evidence emerges.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'high-school-of-the-dead',
    ruleId: 'N7',
    value: 9515,
    reason: 'B (medium): Drifters of the Dead = ep 13; community-practice based — re-open if evidence emerges.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'dragon-ball-z-kai',
    ruleId: 'N7',
    value: 11359,
    reason: 'B (medium): Kai special = ep 98; community-practice based — re-open if evidence emerges.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'dragon-ball-gt',
    ruleId: 'N7',
    value: 987,
    reason: "B (medium): A Hero's Legacy = ep 65 epilogue special; community-practice based — re-open if evidence emerges.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'kamisama-kiss',
    ruleId: 'N7',
    value: 21186,
    reason: 'B (medium): Kako-hen 26-29 prequel OVAs; community-practice based — re-open if evidence emerges.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
  },
];

/** audit-ui-truth.ts consumer shape: the set of `${series_id}:${anilist_id}` keys reviewed */
export const REVIEWED_NUMBERED_SPECIALS: Set<string> = new Set(ENTRIES.map((e) => `${e.seriesId}:${e.value}`));
