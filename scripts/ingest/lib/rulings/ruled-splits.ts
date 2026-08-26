// Ruled splits — AFG pages whose numbering deliberately runs across one of
// OUR ruled series splits (restructure T2.1, 2026-08-26; formerly the
// RULED_SPLITS literal in scripts/ingest/afg-extend.ts). AFG treats the
// franchise as one list; we keep separate entries by ruling (I16), and I20
// says a ruled split stays split whatever AFG's continuous page suggests —
// so afg-extend skips these pages BY NAME. The ownership guard (I21) would
// stop the walk anyway; the named skip keeps the report honest about WHY.
// seriesId = the AFG page slug (== our series id for both entries today).

import { toSet, type RulingEntry } from './types';

export const ENTRIES: RulingEntry<{ splitOffSeries: string; splitAt: number }>[] = [
  {
    seriesId: 'bleach',
    ruleId: 'I20',
    value: { splitOffSeries: 'bleach-thousand-year-blood-war', splitAt: 367 },
    reason: "AFG's bleach page numbers TYBW as 367+; TYBW is a separate entry (bleach-thousand-year-blood-war) by the Naruto→Shippuden pattern, so the page's tail belongs to that series' own scope.",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: ['docs/franchise-rulings.md "Bleach→TYBW"'],
  },
  {
    seriesId: 'tokyo-ghoul',
    ruleId: 'I20',
    value: { splitOffSeries: 'tokyo-ghoul-re-0', splitAt: 25 },
    reason: "AFG's tokyo-ghoul page numbers :re as 25+; :re is a separate entry (Sean 2026-08-24: Naruto/Shippuden pattern), so the page's tail belongs to tokyo-ghoul-re-0's own scope.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    cite: ['docs/franchise-rulings.md "Sean\'s :re ruling"'],
  },
];

/** afg-extend.ts consumer shape: the set of AFG external_ids to skip */
export const RULED_SPLITS: Set<string> = toSet(ENTRIES);
