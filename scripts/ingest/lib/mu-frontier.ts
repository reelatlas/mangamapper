// MU-frontier application + manga-status cross-check — the single source of
// truth shared by audit-manga-coverage, mu-backfill (inline upkeep) and the
// refresh-mu edge function.
//
// MU's anime field is MULTI-SEGMENT prose (MHA lists every season's endpoint;
// Naruto's covers three series with an EP number belonging to the Boruto
// clause): parse ALL Vol/Chap pairs, pick the largest inside THIS series'
// scope segment, require chapter progress beyond existing non-MU anchors
// (else it's the same stale frontier), and trust an EP pin only when the
// text holds exactly one pair. 'mu' anchors are derivations — refreshing a
// series deletes and re-derives its row so rule fixes heal everything.

import { db, fileFlagOnce } from './db';

export function parseCoverageAll(text: string | null): {
  pairs: { volume: number; chapter: number }[];
  explicitEp: number | null;
} {
  if (!text) return { pairs: [], explicitEp: null };
  const pairs = [...text.matchAll(/Vol\.?\s*(\d+)\s*,\s*Chap(?:ter)?\.?\s*(\d+)/gi)].map((m) => ({
    volume: Number(m[1]),
    chapter: Number(m[2]),
  }));
  const ep = pairs.length === 1 ? text.match(/EP\.?\s*(\d+)/i) : null;
  return { pairs, explicitEp: ep ? Number(ep[1]) : null };
}

export interface FrontierSeries {
  id: string;
  aired_episodes: number;
  total_chapters: number | null;
  manga_start_chapter: number | null;
}

export type FrontierResult = 'applied' | 'skipped_fresh' | 'no_progress' | 'no_coverage';

// nonMuMaxEp/nonMuMaxCh: the series' anchor maxima EXCLUDING source 'mu'
// (undefined when the series has no non-MU anchors at all).
export async function applyMuFrontier(
  s: FrontierSeries,
  muEnd: string | null,
  nonMuMaxEp: number | undefined,
  nonMuMaxCh: number | undefined,
): Promise<FrontierResult> {
  await db.from('chapter_anchors').delete().eq('series_id', s.id).eq('source', 'mu');
  const anchorsFresh = nonMuMaxEp !== undefined && nonMuMaxEp >= (s.aired_episodes ?? 0) - 12;
  if (anchorsFresh) return 'skipped_fresh';

  const { pairs, explicitEp } = parseCoverageAll(muEnd);
  const scopeStart = s.manga_start_chapter ?? 1;
  const scopeEnd = s.total_chapters ?? Number.POSITIVE_INFINITY;
  const inScope = pairs.filter((p) => p.chapter >= scopeStart && p.chapter <= scopeEnd);
  if (!inScope.length) return 'no_coverage';
  const coverage = inScope.reduce((a, b) => (b.chapter > a.chapter ? b : a));
  if (coverage.chapter <= (nonMuMaxCh ?? 0)) return 'no_progress';

  const episode = explicitEp && explicitEp <= s.aired_episodes ? explicitEp : s.aired_episodes;
  const { error } = await db.from('chapter_anchors').upsert({
    series_id: s.id,
    episode,
    volume: coverage.volume,
    chapter: coverage.chapter,
    source: 'mu',
    note: `MU curated anime-coverage: "${muEnd}"`,
  });
  return error ? 'no_coverage' : 'applied';
}

// MU's latest_chapter is release-record-derived: reliable for currently
// publishing/scanlated manga, GARBAGE for old completed ones (Dragon Ball
// came back "149" of 519). Same-edition band: accept only when it reaches at
// least 80% of AniList's count (when a count exists) — beyond that the two
// sources track different editions; callers flag, never write.
export function sameEditionLatest(
  muLatest: number | null | undefined,
  anilistCount: number | null | undefined,
): number | null {
  if (!muLatest || muLatest <= 0 || muLatest >= 10000) return null;
  if (anilistCount != null && muLatest < anilistCount * 0.8) return null;
  return muLatest;
}

// MU's publication status: the explicit `completed` boolean when present
// (newer staged rows), else the status string ("182 Chapters (Ongoing)",
// "74 Volumes (Complete)") mapped onto our manga_status vocabulary.
export function muPublicationStatus(mu: {
  status?: string | null;
  completed?: boolean | null;
}): 'publishing' | 'finished' | 'hiatus' | null {
  if (mu.completed === true) return 'finished';
  // multi-part status strings ("27 Volumes (Ongoing)\nPart 1: … (Complete)")
  // state the OVERALL status on the first line
  const status = mu.status?.split('\n')[0];
  if (!status) return mu.completed === false ? 'publishing' : null;
  if (/complete/i.test(status)) return 'finished';
  if (/hiatus/i.test(status)) return 'hiatus';
  if (/ongoing/i.test(status)) return 'publishing';
  return mu.completed === false ? 'publishing' : null;
}

// Cross-check tier (Sean 2026-08-24): MU independently states the manga's
// publication status — disagreement with our AniList-derived manga_status
// flags for review, never auto-applies. Catches both AniList lag on
// just-finished manga and the null-totals-but-actually-finished gap.
export async function crossCheckMangaStatus(
  runId: number,
  seriesId: string,
  ourStatus: string,
  mu: { status?: string | null; completed?: boolean | null },
) {
  const muStatus = muPublicationStatus(mu);
  if (!muStatus || ourStatus === 'anime_only' || muStatus === ourStatus) return;
  await fileFlagOnce(runId, seriesId, 'mangaupdates', 'taxonomy_conflict', {
    ourMangaStatus: ourStatus,
    muStatus: mu.status,
    muCompleted: mu.completed,
    muMapped: muStatus,
    note: 'MU and AniList disagree on the manga publication status — review (AniList lag on a just-finished manga, or a data gap)',
  });
}
