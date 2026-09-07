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

/** The first chapter a span names — the parity healer's own reader, moved here 2026-09-07 so the healer and the audit read ONE function (P2). */
export const firstChapterOf = (s: string | null | undefined): number | null => {
  const m = String(s ?? '').match(/\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isInteger(n) ? n : Math.floor(n);
};

export type NextAnchoredRow = { episode: number; start_chapter: number | null; chapters_adapted?: string | null };

/**
 * Where the parity healer may derive (C2): the next anchored row is the immediately next canon / mixed EPISODE (no
 * unanchored canon / mixed row between — a missing row counts as one) and its START is known (start_chapter, else the
 * first chapter its span names). Null = no basis today.
 */
export const parityBasis = (a: { episode: number }, b: NextAnchoredRow | undefined, typeOf: (episode: number) => string | undefined): number | null => {
  if (!b) return null;
  for (let n = a.episode + 1; n < b.episode; n++) {
    const t = typeOf(n);
    if (t === 'canon' || t === 'mixed' || t === undefined) return null;
  }
  return b.start_chapter ?? firstChapterOf(b.chapters_adapted);
};

/**
 * C7 × A14 (2026-09-07, record-of-ragnarok 21 / 26 / 32 / 37): a HEALER parity continue was derived from the next
 * row's START. When that START is later set to unknown (A14 — the four round-grain finale STARTs nulled) and the span
 * names no chapter either, or that row is no longer the adjacent anchored canon / mixed episode, the continue's BASIS
 * IS GONE: the healer clears it on its next pass (the display then derives END + 1 — the same designed unknown as the
 * derived START) and the audit lists one still standing (`continue_basis_unknown`). A curated continue (manual) is
 * never touched — its basis is the apply's citation, not the neighbour; a C1 straddle (continue = the row's own END) is kept.
 */
export const healerContinueBasisGone = (r: ContinueRow & { chapter?: number | null; episode?: number }, next: NextAnchoredRow | undefined, basis: number | null): boolean =>
  r.continue_chapter != null && r.continue_source === 'healer' && r.continue_kind === 'parity' && !!next && basis == null
  // the C1 shape — a continue EQUAL to the row's own END (a straddle) — is kept: its basis is the row's own tail, whichever
  // neighbour the healer read it from (the C1 guard's rule: value kept); only the pure neighbour-derived values go — a
  // back-jump (below the END) or a skip ahead (above it)
  && Number(r.continue_chapter) !== Number(r.chapter);

export type CuratedContinue = { chapter: number; kind: 'parity' | 'post_series'; note: string };

/** The one way an apply writes a continue: value + kind + note + the 'manual' marker. */
export async function writeCuratedContinue(seriesId: string, episode: number, c: CuratedContinue): Promise<void> {
  if (isParallelSeries(seriesId)) throw new Error(`continue ${seriesId} ep${episode}: a parallel series has no continue point — the manga_only arc is the tail (A46)`);
  const { db } = await import('./db'); // lazy: the predicates above stay pure
  const { error } = await db.from('chapter_anchors').update({ continue_chapter: c.chapter, continue_kind: c.kind, continue_note: c.note.slice(0, 600), continue_source: 'manual' }).eq('series_id', seriesId).eq('episode', episode);
  if (error) throw new Error(`continue ${seriesId} ep${episode}: ${error.message}`);
}
