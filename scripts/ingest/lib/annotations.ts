// Episode annotations — the closed kind vocabulary and the ONE writer gate
// (rules R10 / A43, extended by T26 in T4.2, 2026-08-26). Non-linear facts
// about an episode are first-class per-episode records; the asterisk UI
// aggregates them by kind, so the vocabulary is closed and every writer
// (scripts, edge functions, the T4.3 standing migration) goes through
// upsertAnnotation so a malformed record cannot land (P2). The migration's
// check constraints mirror this file; the census class annotation_invalid
// keeps the two in lockstep (P5). A45 (2026-08-26): a key retired by ruling
// (lib/rulings/retired-annotations.ts) is refused here — the retirement is
// the one durable delete shape for an annotation fact.
//
// T26: an author / studio / community override of the source is an
// ANNOTATION, never a fourth episode type — the episode's standing stays
// canon / mixed / filler relative to the source; the exception lives here.

import { isAnnotationRetired } from './rulings/retired-annotations';

export const ANNOTATION_KINDS = [
  'divergence', // the episode departs from the source material it adapts
  'partial', // adapts part of its chapters (a partial finale, a cut arc)
  'graft', // scenes from elsewhere in the source woven in (bonus / fractional chapters)
  'rearranged', // adapts source out of the source's order (settles a reorder for audits, A42)
  'side_story', // a side story / pilot one-shot outside the mainline
  'loose_parallel', // loosely parallels the source with growing variation (an original stretch that tracks a source arc's shape without adapting it)
  'abridged', // compresses source material
  'adopted', // T26: outside the source, ruled CANON by Sean — basis REQUIRED
  'retconned', // T26: material later dropped from canon (world-trigger 49-63)
  'side_source', // T26: adapts a work other than the series' source — the work is named in note
  'recap', // T28 (2026-09-04): re-shown / retold material of chapters already covered — weightless in the standing; chapters = what is retold
  'unverified', // T28 (2026-09-04): a chapter certainly in the episode whose SHARE could not be sized — the anchor stands, the row is a census queue (unverified_share)
  'chain_source', // T26 / I41 (2026-09-04): adapts material from ANOTHER WORK ON THE SERIES' READING CHAIN (a sequel / prequel manga — canon to the series, told out of order; position-less; chapters = '<work label>: ch …')
] as const;
export type AnnotationKind = (typeof ANNOTATION_KINDS)[number];

/** who adopted the material: the source's author (Black Clover 130-157), the studio (EoE), or the community for lack of an ending (X) */
export const ADOPTED_BASES = ['author', 'studio', 'community'] as const;
export type AdoptedBasis = (typeof ADOPTED_BASES)[number];

export type AnnotationRow = {
  series_id: string;
  episode: number;
  kind: AnnotationKind;
  chapters?: string | null;
  note?: string | null;
  basis?: AdoptedBasis | null;
  /** who owns the row: 'ruling' = written from lib/rulings/standing-annotations.ts (reconciled by the healer); 'research' = a batch apply (default) */
  origin?: 'ruling' | 'research';
};

/** the shape rules, as data — the migration's constraints say the same thing */
export const annotationProblem = (a: AnnotationRow): string | null => {
  if (!(ANNOTATION_KINDS as readonly string[]).includes(a.kind)) return `kind '${a.kind}' is not in the vocabulary`;
  if (isAnnotationRetired(a.series_id, a.episode, a.kind)) return `retired by ruling (A45, lib/rulings/retired-annotations.ts) — the fact was refuted; do not re-insert`;
  if (a.kind === 'adopted' && !a.basis) return "kind 'adopted' requires basis author | studio | community";
  if (a.kind !== 'adopted' && a.basis) return `basis is only for kind 'adopted' (got ${a.kind})`;
  if (a.basis && !(ADOPTED_BASES as readonly string[]).includes(a.basis)) return `basis '${a.basis}' is not author | studio | community`;
  if (a.kind === 'side_source' && !a.note?.trim()) return "kind 'side_source' must name the work in note";
  return null;
};

/** The gate: refuses a malformed record before the DB does; idempotent (PK series_id, episode, kind). */
export async function upsertAnnotation(a: AnnotationRow, opts?: { ignoreDuplicates?: boolean }) {
  const problem = annotationProblem(a);
  if (problem) throw new Error(`annotation ${a.series_id} ep ${a.episode} ${a.kind}: ${problem}`);
  const { db } = await import('./db'); // lazy: the vocabulary + shape rules above are pure and unit-tested without a DB
  const { error } = await db
    .from('episode_annotations')
    .upsert({ series_id: a.series_id, episode: a.episode, kind: a.kind, chapters: a.chapters ?? null, note: a.note ?? null, basis: a.basis ?? null, origin: a.origin ?? 'research' }, { ignoreDuplicates: opts?.ignoreDuplicates ?? false });
  if (error) throw new Error(`annotation ${a.series_id} ep ${a.episode} ${a.kind}: ${error.message}`);
}
