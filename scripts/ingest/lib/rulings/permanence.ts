// PERMANENCE — the LOCKED tier (rule P25, built 2026-08-26). A series is
// locked when it is FINISHED and FULLY PUBLISHED, its mapping is researched,
// cross-verified and SEAN-SIGNED, and the census finds nothing open on it.
// Locked = its decisions are permanent: routine deep rescans and research
// work-lists skip it; a rule-change deep (an enforcement site changed) never
// does; every writer still runs, and the census class permanence_violation
// catches any data that drifts under a lock. The mechanical half of the
// criteria is computed by audit-ui-truth (permanence_candidate); the
// signature is this map — no entry lands without Sean's ruling.
import { toSet, type RulingEntry } from './types';

export const ENTRIES: RulingEntry<'locked'>[] = [
  // none yet — the permanence_candidate census class is Sean's signing queue
];

export const LOCKED: Set<string> = toSet(ENTRIES);
export const isLocked = (seriesId: string): boolean => LOCKED.has(seriesId);
