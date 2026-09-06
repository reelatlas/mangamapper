// E16 (Sean 2026-09-05, the rule-logic evaluation) — every census class has a KIND, so the summary separates what MUST be
// zero from work-lists that are never zero: a VIOLATION is stored data a gate should have prevented (red when non-zero);
// a QUEUE is Sean's work-list (a sitting consumes it); a LISTING is inventory (explained or queued by name, P17). The
// discovery census prints the kind beside every class; the UI-truth census adopts the map as its classes are touched.
export type CensusClassKind = 'violation' | 'queue' | 'listing';

export const CENSUS_CLASS_KINDS: Record<string, CensusClassKind> = {
  // I42 — the halo
  halo_sequel_unclaimed: 'queue', halo_series_unclaimed: 'queue',
  discovery_new_since_sitting: 'queue', discovery_ruled_unbuilt: 'queue', discovery_ruling_stale: 'listing',
  seed_candidate: 'queue',
  // I45 — the related-works buckets (AniList's CLAIM, a bucket census — not a work-list)
  extra_same_instrument: 'listing', extra_other_instrument: 'listing', extra_unknown: 'listing', extra_unstaged: 'listing',
  extra_recap: 'listing', extra_original: 'listing', extra_crossover: 'listing', extra_promo: 'listing', extra_alternative: 'listing',
  // I45 / I46 — the ledger's outcome
  related_work_unruled: 'queue',
  related_work_stale: 'listing',
  related_work_violation: 'violation', related_work_duplicate: 'violation', related_work_base_missing: 'violation',
  // E13: a LISTING until the writer re-walks unruled rows between ruled fixed points (after E1, the identity key) — the stored order is insertion history by the writer's own contract today; it becomes a violation the day the re-walk lands
  related_work_cluster_disorder: 'listing',
  related_work_identity_gap: 'violation', related_work_identity_conflict: 'violation', related_work_identity_orphan: 'violation',
};

/** the suffix printed beside a class count */
export const censusKindMark = (cls: string): string => {
  const k = CENSUS_CLASS_KINDS[cls];
  return k === 'violation' ? '   [violation — must be 0]' : k === 'queue' ? '   [queue]' : k === 'listing' ? '   [listing]' : '   [unkinded — add it to lib/census-kinds.ts]';
};
