// MU_FRONTIER_SUPPRESSED — curated MU-frontier suppressions (G37, Sean's D1
// ruling 2026-08-24): entries whose MU pin is WRONG for a reason NO
// structural gate can derive from held data. The delete-at-entry still runs
// in applyMuFrontier, so a standing bad pin heals on the next pass; the
// suppression only blocks the rewrite. Surfaces as the mu_suppressed census
// class. Each entry states its reasoning and the condition that retires it.
//
// Consumer shape: Record<seriesId, string> (applyMuFrontier) — the string is
// the reasoning the census surfaces, so `value` and `reason` carry the same
// text.

import type { RulingEntry } from './types';
import { toRecord } from './types';

const FATE_KALEID_REASON =
  'multi-manga entry pending the D2 split — the MU pin conflates S1\'s first-manga completion onto the 3rei!!-adapting movie episode';

export const ENTRIES: RulingEntry<string>[] = [
  {
    seriesId: 'fate-kaleid-liner-prisma-illya',
    ruleId: 'G37',
    value: FATE_KALEID_REASON,
    reason:
      "The entry's seasons adapt THREE different manga (S1 eps 1-10 = the 1st series' 14-chapter space, 2wei!/Herz!, 3rei!!) but the entry holds ONE chapter space. MU's \"Vol 2, Chap 14\" states S1's completion of the FIRST manga; the run-end assumption would land it on ep 42 — the movie, which adapts 3rei!! 29-39. The scope-consumed check misses it by one chapter (research ENDs stop at 13; 14 is the unadapted epilogue), so no structural gate can refuse the pin.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    retiresWhen: 'D2 lands (Clear-Card-style scoped entries split the multi-manga run)',
  },
];

export const MU_FRONTIER_SUPPRESSED: Record<string, string> = toRecord(ENTRIES);
