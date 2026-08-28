// EPISODE CORRESPONDENCE — the row-grain correspondence (rule A46, Sean
// 2026-08-28). How ONE episode and ONE chapter range sit on the outline:
//   aligned    — timeline C: the same story, lines up (episode + chapters)
//   divergent  — the same outline node, told differently (episode + chapters:
//                the manga's version of that node)
//   anime_only — timeline B: the anime's own telling of a shared arc, no manga
//                pages for the beat (episode only)
//   manga_only — timeline A: the manga's own telling / no anime (chapters only)
// One episode may carry several rows (ep ↔ 100-110 aligned, ↔ 111-120
// divergent). Studio padding (timeline D) is the episode's TYPE (filler) and
// carries no row. Both focused views (watching / reading) are projections of
// these rows plus the arcs; a canon row in a shared arc with no row renders
// an honest dash — never assumed aligned (P6). Completeness is mechanical:
// correspondence_incomplete lists every canon/mixed episode and every chapter
// of a shared arc no row covers (the L-P work queue).
//
// Ruled rows live in ENTRIES (asserted by assert-overrides, origin 'ruling');
// research rows land through upsertCorrespondence from an apply (origin
// 'research'). dragon-ball-super's rows are HELD for Sean's row-by-row
// evaluation (batch 20 wave 5; apply-wave5.ts) — the mechanism ships first.
import type { Arc } from './arcs';
import { toRecord, type RulingEntry } from './types';

export const ALIGNMENTS = ['aligned', 'divergent', 'anime_only', 'manga_only'] as const;
export type Alignment = (typeof ALIGNMENTS)[number];

export type CorrespondenceRow = {
  episode?: number | null;
  chStart?: number | null;
  chEnd?: number | null;
  alignment: Alignment;
  note?: string | null;
};

/** the shape rules, as data — the migration's check constraints say the same thing */
export const correspondenceProblem = (r: CorrespondenceRow): string | null => {
  if (!(ALIGNMENTS as readonly string[]).includes(r.alignment)) return `alignment '${r.alignment}' is not in the vocabulary`;
  const hasEp = r.episode != null;
  const hasCh = r.chStart != null && r.chEnd != null;
  if ((r.alignment === 'aligned' || r.alignment === 'divergent') && (!hasEp || !hasCh)) return `${r.alignment} needs an episode and a chapter range`;
  if (r.alignment === 'anime_only' && (!hasEp || r.chStart != null || r.chEnd != null)) return 'anime_only takes an episode only';
  if (r.alignment === 'manga_only' && (hasEp || !hasCh)) return 'manga_only takes a chapter range only';
  if (hasCh && (r.chEnd as number) < (r.chStart as number)) return `chapter range ${r.chStart}-${r.chEnd} is backwards`;
  return null;
};

export type Coverage = { episodesUncovered: number[]; chaptersUncovered: [number, number][] };

/**
 * What the correspondence still owes on the SHARED arcs: every canon/mixed
 * episode inside a shared arc needs a row (aligned / divergent / anime_only);
 * every chapter of a shared arc's range needs a row (aligned / divergent /
 * manga_only). Filler rows (timeline D) owe nothing. Pure.
 */
export function correspondenceCoverage(arcs: Arc[], rows: CorrespondenceRow[], episodes: { number: number; type: string }[]): Coverage {
  const epCovered = new Set(rows.filter((r) => r.episode != null && r.alignment !== 'manga_only').map((r) => r.episode as number));
  const episodesUncovered: number[] = [];
  const chaptersUncovered: [number, number][] = [];
  for (const a of arcs) {
    if (a.kind !== 'shared') continue;
    for (const e of episodes) {
      if (e.number < (a.epStart as number) || e.number > (a.epEnd as number)) continue;
      if (e.type === 'filler') continue;
      if (!epCovered.has(e.number)) episodesUncovered.push(e.number);
    }
    if (a.chEnd == null) continue;
    const chRows = rows.filter((r) => r.chStart != null && r.chEnd != null && r.alignment !== 'anime_only');
    let run: number | null = null;
    for (let ch = a.chStart as number; ch <= (a.chEnd as number); ch++) {
      const covered = chRows.some((r) => ch >= (r.chStart as number) && ch <= (r.chEnd as number));
      if (!covered && run == null) run = ch;
      if (covered && run != null) { chaptersUncovered.push([run, ch - 1]); run = null; }
    }
    if (run != null) chaptersUncovered.push([run, a.chEnd as number]);
  }
  return { episodesUncovered: episodesUncovered.sort((x, y) => x - y), chaptersUncovered };
}

export const ENTRIES: RulingEntry<CorrespondenceRow[]>[] = [];

export const RULED_CORRESPONDENCE: Record<string, CorrespondenceRow[]> = toRecord(ENTRIES);

const keyOf = (r: CorrespondenceRow) => `${r.episode ?? '-'}:${r.chStart ?? '-'}-${r.chEnd ?? '-'}:${r.alignment}`;

/** The gate: refuses a malformed row before the DB does; idempotent on (series, episode, chapters, alignment). */
export async function upsertCorrespondence(seriesId: string, r: CorrespondenceRow, origin: 'ruling' | 'research' = 'research'): Promise<void> {
  const problem = correspondenceProblem(r);
  if (problem) throw new Error(`correspondence ${seriesId} ${keyOf(r)}: ${problem}`);
  const { db } = await import('../db'); // lazy: the shape rules above are pure and unit-tested without a DB
  let q = db.from('episode_correspondence').select('id').eq('series_id', seriesId).eq('alignment', r.alignment);
  q = r.episode == null ? q.is('episode', null) : q.eq('episode', r.episode);
  q = r.chStart == null ? q.is('ch_start', null) : q.eq('ch_start', r.chStart);
  q = r.chEnd == null ? q.is('ch_end', null) : q.eq('ch_end', r.chEnd);
  const { data: existing, error: e1 } = await q.maybeSingle();
  if (e1) throw new Error(`correspondence ${seriesId} ${keyOf(r)}: ${e1.message}`);
  const row = { series_id: seriesId, episode: r.episode ?? null, ch_start: r.chStart ?? null, ch_end: r.chEnd ?? null, alignment: r.alignment, note: r.note ?? null, origin };
  const { error } = existing ? await db.from('episode_correspondence').update(row).eq('id', existing.id) : await db.from('episode_correspondence').insert(row);
  if (error) throw new Error(`correspondence ${seriesId} ${keyOf(r)}: ${error.message}`);
}
