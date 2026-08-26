// EXTRAS_ADOPTED — episode-floor adoptions (N1). Episode-floor invariant
// (Sean 2026-08-24): displayed totals can NEVER be lower than our own
// episode numbering. Small overshoots (≤2: recap / ep-0 numbering) floor
// automatically in every totals writer; a LARGER overshoot floors only once
// RULED — an entry here — until then the reconcile-structure flag is the
// research trigger. A refresh never reverts an adopted floor.
//
// Consumer shape: Set<seriesId> (applyEpisodeFloor). `value` records the
// adopted tail for the generated index; the set only reads membership.
//
// REMOVED 2026-08-25 — eyeshield-21 (Sean's report, §12.49): the "10
// specials beyond 145" premise was an AFG PAGE TYPO — its chart has 145 rows
// with the finale mis-numbered "155."; no source names any content for
// 146-154. The adopted floor had rationalized a parse artifact (N2: a
// lone-row overshoot is a typo candidate). The cap lives in community-counts.

import type { RulingEntry } from './types';
import { toSet } from './types';

export const ENTRIES: RulingEntry<{ adopted: [number, number] }>[] = [
  {
    seriesId: 'angel-beats',
    ruleId: 'N1',
    value: { adopted: [14, 16] },
    reason:
      'Episodes 14-16 are the OVA specials — broadcast content the community numbers, so the displayed total floors at our row count rather than the 13-episode source count.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'N1',
    value: { adopted: [95, 100] },
    reason:
      'The 1996 broadcast tail 95-100 overshoots the source count by more than 2; rows 95-98 are the Trust & Betrayal OVAs adopted as episodes (real manga adaptation, the Remembrance arc — see the rurouni-kenshin type ruling), so the floor is adopted rather than flagged. Evidence for 99-100 beyond "broadcast tail" was not recorded at the call site.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
];

export const EXTRAS_ADOPTED = toSet(ENTRIES);
