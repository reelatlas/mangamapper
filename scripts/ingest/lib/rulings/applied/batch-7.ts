// Applied rulings — apply-research-batch-7.ts (Sean's review-queue rulings,
// 2026-08-23, all four queues). Every entry carries its why (N33). T2.1.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-7.ts';
const base = { ruledBy: 'Sean' as const, ruledOn: ON, cite: [SCRIPT, 'docs/changelog.md §12.23'] };

const demote = (seriesId: string, anilistId: number, start: number, end: number, ruleId: 'N3' | 'N4', reason: string): RulingEntry => ({
  seriesId, ruleId, value: { anilistId, start, end, action: 'numbered → order-only (rows deleted, later rows/anchors/annotations shift down)', fractional: { position: start - 0.5, disposition: 'order_only' } }, reason, ...base,
});

export const ENTRIES: RulingEntry[] = [
  // ── Queue 1: fractional dispositions ───────────────────────────────────
  { seriesId: 'urusei-yatsura', ruleId: 'N8', value: { position: 193.5, disposition: 'excluded_recap' }, reason: 'RECAP (rebroadcast of ep 44 + countdown) — recap rule (Monogatari precedent) excludes from count AND watch order; Sean sign-off 2026-08-23', ...base },
  { seriesId: 'dr-stone', ruleId: 'N8', value: { position: 24.5, disposition: 'excluded_recap' }, reason: '"Eve of the Battle Special Feature" = pre-S2 recap — recap rule; Sean sign-off 2026-08-23', ...base },
  { seriesId: 'dr-stone', ruleId: 'N9', value: { position: 35.5, disposition: 'modeled' }, reason: 'Ryuusui — modeled as order-only component at watch_position 35.5 (this ruling overtakes the batch-1 row-95 creation).', ...base },
  { seriesId: 'cells-at-work', ruleId: 'N9', value: { position: 11.5, disposition: 'order_only' }, reason: '"Heat Stress" Pocari collab bonus = real bonus content, holds a watch-order slot; surfacing decided in the UI pass; Sean sign-off 2026-08-23', ...base },

  // ── Queue 2 Group C: demotions (community does not number these) ───────
  demote('yu-yu-hakusho-ghostfiles', 6964, 113, 113, 'N3', 'Picture Drama = standalone bonus; community count = 112 (Sean sign-off 2026-08-23)'),
  demote('miss-kobayashis-dragon-maid', 98580, 14, 14, 'N3', 'Valentine/Onsen OVA = standalone bonus between seasons; community numbering excludes (Sean sign-off 2026-08-23)'),
  demote('fate-kaleid-liner-prisma-illya', 18851, 11, 11, 'N3', 'Undoukai DE Dance = mid-run bonus OVA the community numbering excludes (Sean sign-off 2026-08-23)'),
  demote('prison-school', 21565, 13, 13, 'N3', 'Mad Wax = standalone bonus OVA; community count = 12 (Sean sign-off 2026-08-23)'),
  demote('to-love-ru-darkness', 21852, 25, 26, 'N3', '2nd Specials = standalone bonuses; community count = 24 (Sean sign-off 2026-08-23)'),
  demote('ghost-in-the-shell-stand-alone-complex', 1566, 53, 53, 'N4', 'Solid State Society is a FILM — movies are order-only unless community-numbered (Initial D rule; Sean sign-off 2026-08-23)'),
  demote('yu-gi-oh-2000', 21265, 225, 225, 'N4', 'Dark Side of Dimensions is a FILM — order-only per the movies rule (Sean sign-off 2026-08-23)'),

  // ── Queue 4: bookmark closures ─────────────────────────────────────────
  { seriesId: 'rurouni-kenshin', ruleId: 'G3', value: { bookmark: 'sean_review_bookmark → confirmed' }, reason: 'resolved: interior anchors (Kyoto ep 28 → 48) + continua cross-verification + side_story annotations for 95-98 (Sean sign-off 2026-08-23)', ...base },
  { seriesId: 'haikyu', ruleId: 'G3', value: { bookmark: 'sean_review_bookmark → confirmed' }, reason: 'resolved: S2/S3/TTT boundary anchors in OUR numbering (50/60/75 → 149/207/249) + the 85→87 conversion (Sean sign-off 2026-08-23)', ...base },
  { seriesId: 'boruto-naruto-next-generations', ruleId: 'G3', value: { bookmark: 'sean_review_bookmark → confirmed' }, reason: 'resolved: four interior manga-arc anchors (66/151/187/220 → 10/15/23/55); anime-canon stretches mapped (Sean sign-off 2026-08-23)', ...base },
  { seriesId: 'x', ruleId: 'G3', value: { bookmark: 'sean_review_bookmark → confirmed' }, reason: 'resolved: eps 21-24 retyped anime-only-canon (research-ruled) via EPISODE_TYPE_OVERRIDES (Sean sign-off 2026-08-23)', ...base, retiresWhen: 'the retype it records was RE-RULED filler 2026-08-25 (T10 only-ending class, §12.50)' },

  // ── Queue 3: LN ruling logged (implementation = next phase) ────────────
  { seriesId: '*', ruleId: 'T24', value: { instrument: 'LN VOLUME space', scope: 'anchors / frontier / continue-from for light-novel series, same machinery' }, reason: 'Volume-based instrument for light-novel series (Sean sign-off 2026-08-23): behavior research per series logged as it lands; UI adaptation decided in the UI pass. Recorded in docs §10/§12.', ...base, retiresWhen: 'T24 build lands (planned)' },
];
