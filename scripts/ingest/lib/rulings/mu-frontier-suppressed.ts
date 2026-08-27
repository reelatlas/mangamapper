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
  // ---- batch 20 wave 1 (2026-08-27; Sean): three pins that OVERSTATE a placed terminal by an arc / volume boundary - not the multi-work parse (G32 gate 0), which handles slam-dunk / kinnikuman / hellsing, and not zatch-bell (ep 139 -> 212 makes its pin redundant under G56).
  {
    seriesId: 'gantz',
    ruleId: 'G37',
    value: "MU end field 'Vol 8, Chap 91 (TV)' OVERSTATES the anime's coverage: the honest terminal is ep 21 -> 90 [80] (research, verified R24: ep 21 carries ch 90 to its last page; ch 91 - the news report, school, the original Kishimoto - is in no episode). MU's 91 is the Buddhist Temple arc's last chapter (the arc boundary), one past coverage; the pin lands on the anime-original block 22-26 (filler, A1). The terminal is placed; the pin is beyond it for a reason no gate can derive (G37). Sean 2026-08-27 (batch 20 wave 1).",
    reason:
      "MU end field 'Vol 8, Chap 91 (TV)' OVERSTATES the anime's coverage: the honest terminal is ep 21 -> 90 [80] (research, verified R24: ep 21 carries ch 90 to its last page; ch 91 - the news report, school, the original Kishimoto - is in no episode). MU's 91 is the Buddhist Temple arc's last chapter (the arc boundary), one past coverage; the pin lands on the anime-original block 22-26 (filler, A1). The terminal is placed; the pin is beyond it for a reason no gate can derive (G37). Sean 2026-08-27 (batch 20 wave 1).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/gantz.json', 'scripts/ingest/research/batch20/verify/gantz.md'],
    retiresWhen: "MU's anime.end for the entry reads the terminal's chapter (then the pin is redundant under G56 and the suppression is dead weight)",
  },
  {
    seriesId: 'gto-great-teacher-onizuka',
    ruleId: 'G37',
    value: "MU end field 'Vol 13, Chap 106 Original Ending in EP 42-43' OVERSTATES the anime's coverage: the honest terminal is ep 41 -> 105 [102] v13 (research, verified R24: Lesson 105 LOVE LOVE LOVE is the last Lesson animated; Lesson 106 is the volume-13 closer, never adapted). MU's 106 is the volume boundary, one past coverage; 'EP 42-43' names the filler block, so the pin lands on a filler row (A1). The terminal is placed; the pin is beyond it for a reason no gate can derive (G37). Sean 2026-08-27 (batch 20 wave 1).",
    reason:
      "MU end field 'Vol 13, Chap 106 Original Ending in EP 42-43' OVERSTATES the anime's coverage: the honest terminal is ep 41 -> 105 [102] v13 (research, verified R24: Lesson 105 LOVE LOVE LOVE is the last Lesson animated; Lesson 106 is the volume-13 closer, never adapted). MU's 106 is the volume boundary, one past coverage; 'EP 42-43' names the filler block, so the pin lands on a filler row (A1). The terminal is placed; the pin is beyond it for a reason no gate can derive (G37). Sean 2026-08-27 (batch 20 wave 1).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/gto-great-teacher-onizuka.json', 'scripts/ingest/research/batch20/verify/gto.md'],
    retiresWhen: "MU's anime.end for the entry reads the terminal's chapter (then the pin is redundant under G56 and the suppression is dead weight)",
  },
  {
    seriesId: 'toriko',
    ruleId: 'G37',
    value: "MU end field 'Vol 29, Chap 263 (with some differences)' OVERSTATES the anime's coverage: the honest terminal is ep 146 -> 254 [254] v29 (research, verified R24: Toei's ep-146 synopsis is Gourmet 254 beat for beat; 255-263 - Ichiryu's death, the food collapse - are never animated). MU's 263 is volume 29's last chapter, nine past coverage; the pin lands on eps 145-147 (145 A44, 147 filler). The terminal is placed; the pin is beyond it for a reason no gate can derive (G37). Sean 2026-08-27 (batch 20 wave 1).",
    reason:
      "MU end field 'Vol 29, Chap 263 (with some differences)' OVERSTATES the anime's coverage: the honest terminal is ep 146 -> 254 [254] v29 (research, verified R24: Toei's ep-146 synopsis is Gourmet 254 beat for beat; 255-263 - Ichiryu's death, the food collapse - are never animated). MU's 263 is volume 29's last chapter, nine past coverage; the pin lands on eps 145-147 (145 A44, 147 filler). The terminal is placed; the pin is beyond it for a reason no gate can derive (G37). Sean 2026-08-27 (batch 20 wave 1).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/toriko.json', 'scripts/ingest/research/batch20/verify/toriko.md'],
    retiresWhen: "MU's anime.end for the entry reads the terminal's chapter (then the pin is redundant under G56 and the suppression is dead weight)",
  },
];

export const MU_FRONTIER_SUPPRESSED: Record<string, string> = toRecord(ENTRIES);
