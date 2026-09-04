// T26 — A LICENCE IS NOT ADOPTION (Sean ruled 2026-09-05, the adoption sitting;
// scripts/ingest/research/batch22/T26-SITTING.md). episodes.type measures the
// row against the series' IDENTIFIED source (T25 / T27). A `side_source`
// annotation records that the episode adapts a work OUTSIDE the reading chain
// (a licensed novel, a film, a game) — that is a fact about the work, never a
// standing. A canon / mixed standing on such a row needs either an
// `adopted{basis}` record (the source's author / studio / community took the
// material in — a specific act per work, never a franchise credit or an
// illustrator's name on the cover) or a WEIGHT-BEARING tie to the source
// itself. Without one the row is FILLER + side_source (the one-piece 50 shape).
//
// WEIGHT, NOT KIND (T28's sliver clause): the ties that carry weight in the
// standing are the catalog's own mechanisms — a chapter anchor (A1, the
// position claim itself), `chain_source` (canon by definition, I41),
// `side_story` (an unnumbered chapter of the source that IS the plot —
// position-less, but it counts) and `unverified` (the anchor lands, the share
// is unsized). Sliver kinds (graft / partial / loose_parallel / divergence /
// abridged / rearranged / recap) weigh NOTHING — the Itachi rows carry
// graft + side_source and must still fire. A44's ANCHOR_SUPPRESSED is a
// POSITION ruling and is deliberately not a signal here (it covers weight-
// bearing side stories and two-page slivers alike).
//
// One predicate, three consumers (P2): the episode writer defaults the
// standing (filterEpisodeRows, before the T6 pins — a pin still wins), the
// healer asserts it over standing rows (assert-overrides#assertStandings),
// and the census lists a stored row that disagrees (side_source_unadopted →
// ruling_violation).

/** annotation kinds that carry weight in the standing besides an anchor (T28) */
export const WEIGHT_BEARING_KINDS = ['chain_source', 'side_story', 'unverified'] as const;

export type RowTies = {
  /** every annotation kind stored on the row */
  kinds: Iterable<string>;
  /** the row carries a chapter anchor (any source) */
  anchored: boolean;
};

/** does the row have a weight-bearing tie to the SERIES' source (not counting an unadopted side_source)? */
export const weightBearingTie = (t: RowTies): boolean => {
  if (t.anchored) return true;
  for (const k of t.kinds) if ((WEIGHT_BEARING_KINDS as readonly string[]).includes(k)) return true;
  return false;
};

/**
 * The T26 standing problem for one row, or null when the standing is allowed.
 * A canon / mixed row whose only source tie is an unadopted `side_source`
 * cannot hold that standing — the licence is not adoption.
 */
export const sideSourceStandingProblem = (type: string | null | undefined, t: RowTies): string | null => {
  if (type !== 'canon' && type !== 'mixed') return null;
  const kinds = new Set(t.kinds);
  if (!kinds.has('side_source')) return null;
  if (kinds.has('adopted')) return null;
  if (weightBearingTie(t)) return null;
  return `${type} row tied only to a work outside the chain (side_source) with no adopted{basis} and no weight-bearing source tie (anchor / chain_source / side_story / unverified) — a licence is not adoption (T26); the standing is filler`;
};

/** the writer default: the standing the row may hold given its ties (T6 pins are applied AFTER this and win) */
export const sideSourceStanding = (type: string, t: RowTies): string => (sideSourceStandingProblem(type, t) ? 'filler' : type);

/** the ties of every row of a series, keyed by episode number — the loader every writer and healer shares */
export async function loadEpisodeTies(seriesId: string): Promise<Record<number, RowTies>> {
  const { selectAll } = await import('./db'); // lazy: the predicates above are pure and unit-tested without a DB
  const out: Record<number, { kinds: Set<string>; anchored: boolean }> = {};
  const at = (ep: number) => (out[ep] ??= { kinds: new Set(), anchored: false });
  for (const a of await selectAll<{ episode: number; kind: string }>('episode_annotations', 'episode, kind', (q) => q.eq('series_id', seriesId))) at(a.episode).kinds.add(a.kind);
  for (const a of await selectAll<{ episode: number }>('chapter_anchors', 'episode', (q) => q.eq('series_id', seriesId))) at(a.episode).anchored = true;
  return out;
}
