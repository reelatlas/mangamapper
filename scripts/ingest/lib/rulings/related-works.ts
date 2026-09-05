// I45's RULING LAYER — the researched facts of a related work (Sean ruled (b)/(c),
// 2026-09-05): a standing, the chapters it adapts, a position, keyed by the OWNER
// series + the work's AniList id. The ledger writer (sync-related-works) writes a
// ruled standing over the rule's (relatedWorkStanding), the adaptation fields from
// the entry, and a ruled position over the derived one; the census
// (related_work_violation) reads the same map, so a stored row that disagrees is a
// listing until the healer runs. Every entry lands from a verdict — never from a
// sitting's guess (R1); the recap shows a ruled standing as "(ruled)".
//   the row keeps origin 'halo' (the row is the ledger's; the FACTS are ruled).
import type { RulingEntry } from './types';

export type RelatedWorkRuling = {
  /** the work's AniList id — the key beside seriesId */
  anilistId: number;
  /** the researched standing under T28's bar (canon | mixed | filler); absent = the rule's standing stands */
  standing?: 'canon' | 'mixed' | 'filler';
  /** the adaptation record, in the watch_order_entries vocabulary (A-family: a position claim needs its chapters) */
  chapter?: number | null;
  volume?: number | null;
  chaptersAdapted?: string | null;
  /** a ruled position in the run (overrides the derived air-date position AND the label map's RULED_POSITION_BY_ANILIST) */
  position?: number;
  /** a short note the ledger row carries after the bucket note */
  note?: string;
};

export const ENTRIES: RulingEntry<RelatedWorkRuling>[] = [
  // the first entries land from the films-first research wave (b) / the owner triage (c) — verdict JSON cited per entry
];

/** series id → anilist id → the ruling */
export const RELATED_WORK_RULINGS: Record<string, Record<number, RelatedWorkRuling>> = {};
for (const e of ENTRIES) (RELATED_WORK_RULINGS[e.seriesId] ??= {})[e.value.anilistId] = e.value;

export const relatedWorkRuling = (seriesId: string, anilistId: number): RelatedWorkRuling | null => RELATED_WORK_RULINGS[seriesId]?.[anilistId] ?? null;
