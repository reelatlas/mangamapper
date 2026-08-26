// Title exclusions — content exclusions per Sean's rulings that slug patterns
// could not catch: film trilogies/collections and fan re-edits (restructure
// T2.1, 2026-08-26; formerly the MANUAL_EXCLUDE literal in
// scripts/ingest/audit-titles.ts). Each is a durable source_map disposition
// (I11: dispositions are rulings, not cache state) written with the value as
// its note; audit-titles applies them idempotently on every run.
// value = the disposition note stored on source_map.

import { toRecord, type RulingEntry } from './types';

export const ENTRIES: RulingEntry<string>[] = [
  {
    seriesId: 'berserk-golden-age-arc',
    ruleId: 'I11',
    value: 'film trilogy — movies out of v1 scope (Sean 2026-08-22), re-evaluate with watch-order',
    reason: 'The Golden Age Arc is a film trilogy, not a series — movies are out of v1 scope (Sean 2026-08-22); re-evaluate with the watch-order concept.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-22',
    retiresWhen: 'the watch-order / movies design pass re-evaluates film collections',
  },
  {
    seriesId: 'kizumonogatari',
    ruleId: 'I11',
    value: 'film trilogy — movies out of v1 scope (Sean 2026-08-22), re-evaluate with watch-order',
    reason: 'Kizumonogatari is a film trilogy — movies are out of v1 scope (Sean 2026-08-22); the films sit inside monogatari-series as order-only extras (override chain), so the AFL page is not a series of its own. Re-evaluate with the watch-order concept.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-22',
    retiresWhen: 'the watch-order / movies design pass re-evaluates film collections',
  },
  {
    seriesId: 'digimon-adventure-tri',
    ruleId: 'I11',
    value: 'six-part film series — movies out of v1 scope (Sean 2026-08-22), re-evaluate with watch-order',
    reason: 'Digimon Adventure tri. is a six-part film series — movies are out of v1 scope (Sean 2026-08-22); re-evaluate with the watch-order concept.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-22',
    retiresWhen: 'the watch-order / movies design pass re-evaluates film collections',
  },
  {
    seriesId: 'one-pace',
    ruleId: 'I11',
    value: 'fan re-edit of One Piece, not an official series — EXCLUDED (Sean 2026-08-25)',
    reason: 'One Pace is a fan re-edit of One Piece, not an official series — EXCLUDED (Sean 2026-08-25, DRIFT-LIST A-10; the earlier note said "pending Sean confirmation" while the exclusion was already applied — the note now matches the apply).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: ['docs/restructure/DRIFT-LIST.md A-10'],
    supersedes: 'fan re-edit of One Piece, not an official series — excluded pending Sean confirmation',
  },
];

/** audit-titles.ts consumer shape: afl slug → source_map note */
export const MANUAL_EXCLUDE: Record<string, string> = toRecord(ENTRIES);
