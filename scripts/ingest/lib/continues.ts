// C7 — continue provenance (2026-08-27, the parity-healer gap found closing
// batch 19 wave 2). continue_chapter / continue_kind / continue_note are
// CURATED when an apply script or a ruling wrote them; the parity healer
// fills ABSENT metadata and re-derives only what it wrote itself. Before
// this, nothing on the row said "curated" and the healer converted three
// just-applied continues (tokyo-mew-mew 28, eyeshield-21 43, project-arms
// 43) on the same pass. `continue_source` is the marker:
//   manual — an apply / ruling (never overwritten; the healer may stamp a
//            missing kind only)
//   healer — heal-parity-continues' own C2/C3 derivation (re-derived freely)
//   source — afg-continua's parsed continue-from (re-derived by the source)
// Pure predicates here; the DB write helper is what every apply uses so the
// marker can never be forgotten (P2).
import { isParallelSeries } from './rulings/source-relations';

export type ContinueSource = 'manual' | 'healer' | 'source';

export type ContinueRow = { continue_chapter: number | null; continue_kind?: string | null; continue_note?: string | null; continue_source?: ContinueSource | string | null };

/** The healer's own note shapes — used by the migration backfill and the audit's outcome check. */
export const HEALER_NOTE_PREFIXES = ['parity with anime (Sean C2', 'C3 (Sean 2026-08-25):'] as const;
export const isHealerNote = (note: string | null | undefined): boolean => HEALER_NOTE_PREFIXES.some((p) => String(note ?? '').startsWith(p));

/** C7: a stored continue the healer must not overwrite (it may stamp an absent kind). */
export const isCuratedContinue = (r: ContinueRow): boolean => r.continue_chapter != null && r.continue_source === 'manual';

/** The C7 outcome the audit lists: a curated continue whose note is the healer's — the healer wrote over it. */
export const curatedOverwritten = (r: ContinueRow): boolean => isCuratedContinue(r) && isHealerNote(r.continue_note);

/** A stored continue no writer claimed — every writer must set the marker (P2). */
export const continueUnprovenanced = (r: ContinueRow): boolean => r.continue_chapter != null && !r.continue_source;

export type CuratedContinue = { chapter: number; kind: 'parity' | 'post_series'; note: string };

/** The one way an apply writes a continue: value + kind + note + the 'manual' marker. */
export async function writeCuratedContinue(seriesId: string, episode: number, c: CuratedContinue): Promise<void> {
  if (isParallelSeries(seriesId)) throw new Error(`continue ${seriesId} ep${episode}: a parallel series has no continue point — the manga_only arc is the tail (A46)`);
  const { db } = await import('./db'); // lazy: the predicates above stay pure
  const { error } = await db.from('chapter_anchors').update({ continue_chapter: c.chapter, continue_kind: c.kind, continue_note: c.note.slice(0, 600), continue_source: 'manual' }).eq('series_id', seriesId).eq('episode', episode);
  if (error) throw new Error(`continue ${seriesId} ep${episode}: ${error.message}`);
}
