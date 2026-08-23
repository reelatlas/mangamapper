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
  // anime status — an MU pin without an explicit episode may only anchor a
  // FINISHED run (see the airing-pin rule below)
  status?: string | null;
}

export type FrontierResult = 'applied' | 'skipped_fresh' | 'no_progress' | 'no_coverage' | 'out_of_space';

// nonMuMaxEp/nonMuMaxCh: the series' anchor maxima EXCLUDING source 'mu'
// (undefined when the series has no non-MU anchors at all).
export async function applyMuFrontier(
  runId: number,
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

  // CHAPTER-SPACE gate on MU pins (Sean 2026-08-23, the Slime/4KOTA class):
  // MU's coverage prose describes the whole FRANCHISE — against a partial
  // entry (Slime held only S1's 24 eps) the largest pair lands a chapter the
  // entry's own space can't contain. A pin past max(total, latest_known)+10
  // is a structure/edition mismatch: withhold + flag, never write.
  const { data: srow } = await db
    .from('series')
    .select('latest_known_chapters')
    .eq('id', s.id)
    .maybeSingle();
  const spaceMax = Math.max(s.total_chapters ?? 0, srow?.latest_known_chapters ?? 0);
  if (spaceMax > 0 && coverage.chapter > spaceMax + 10) {
    await fileFlagOnce(runId, s.id, 'mangaupdates', 'count_mismatch', {
      muCoverageChapter: coverage.chapter,
      spaceMax,
      note: 'MU coverage pin exceeds this entry\'s chapter space — partial structure (unstitched seasons?) or edition mismatch; frontier withheld',
    });
    return 'out_of_space';
  }

  // AIRING-PIN rule (Sean's TYBW report, 2026-08-23): without an explicit
  // episode in MU's text, the pin lands at the RUN END — which is a MOVING
  // target while the series airs. MU's coverage can describe the completed
  // portion (or even the announced final coverage: TYBW's said ch 705 while
  // part 4 was mid-air), so pinning it to today's episode count claims
  // chapters the aired episodes haven't reached and inflates the whole back
  // curve. Finished runs only; airing series need the explicit episode or a
  // research anchor.
  if (!explicitEp && s.status && s.status !== 'finished') {
    return 'no_coverage';
  }
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
// CHAPTER-FLOOR (Sean 2026-08-23, symmetric to the episode-floor invariant):
// the chapter space can never be smaller than what confirmed anchors reach.
// MU's latest_chapter is release-record-derived and sometimes counts VOLUMES
// (Kakegurui came back "9" while anchors confirm ch 55+) — a latest below the
// anchor floor is a different unit space, never a chapter number.
export function sameEditionLatest(
  muLatest: number | null | undefined,
  anilistCount: number | null | undefined,
  anchorFloorCh = 0,
): number | null {
  if (!muLatest || muLatest <= 0 || muLatest >= 10000) return null;
  if (anilistCount != null && muLatest < anilistCount * 0.8) return null;
  if (anchorFloorCh > 0 && muLatest < anchorFloorCh) return null;
  return muLatest;
}

// MU's status string often carries an explicit chapter count ("67 Chapters
// (Ongoing)") even when latest_chapter tracks volume releases — use the best
// info available (Sean's standing rule): it stands in as latest_known when
// the release-derived number fails the guards, same floor applied.
export function muStatusChapterCount(mu: { status?: string | null }): number | null {
  const m = /(\d+)\s+Chapters?\b/i.exec(mu.status ?? '');
  return m ? Number(m[1]) : null;
}

// The one latest_known derivation every writer uses: release-derived
// latest_chapter first, the status string's chapter count as fallback —
// both behind the same-edition band AND the confirmed-anchor chapter floor.
export function bestLatestKnown(
  mu: { latest_chapter?: number | null; status?: string | null },
  anilistCount: number | null | undefined,
  anchorFloorCh = 0,
): number | null {
  return (
    sameEditionLatest(mu.latest_chapter, anilistCount, anchorFloorCh) ??
    sameEditionLatest(muStatusChapterCount(mu), anilistCount, anchorFloorCh)
  );
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
