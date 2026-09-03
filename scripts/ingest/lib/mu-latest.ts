// The latest_known derivation — PURE (no DB) so it is unit-testable; re-exported
// by mu-frontier.ts for its callers (the coverage healer, mu-backfill, the
// refresh-mu edge). Split out 2026-09-04 with the G38 coverage floor.
import { toRuledChapter, CHAPTER_SPACE_OVERRIDES } from './rulings/chapter-spaces';

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
  mu: { latest_chapter?: number | null; status?: string | null; anime?: { start?: string | null; end?: string | null } | null },
  anilistCount: number | null | undefined,
  anchorFloorCh = 0,
  // N35 (2026-09-02): the ruled chapter space is the ceiling — MU's count is
  // converted through the series' ruled MU shift (dai: MU's 349 slots = the
  // printed 348) and capped at the ruled count (orange 22, regenesis 255), so
  // the coverage healer, the MU backfill and the refresh-mu edge all write the
  // value assert-overrides would otherwise re-clamp on every heal (P20: a
  // healer converges in one run; two writers never fight over one column)
  seriesId?: string,
  // G38 floor (Sean 2026-09-04, four-knights): a chapter MU's own anime-coverage field names ("Vol 14, Chap 120 Page 12 (S2)")
  // exists, so latest_known never sits below it — MU's release-derived count lags scanlation; the coverage string does not.
  // The caller may add the volume table's last bounded chapter as a second floor (tableFloorCh).
  tableFloorCh = 0,
): number | null {
  const raw =
    sameEditionLatest(mu.latest_chapter, anilistCount, anchorFloorCh) ??
    sameEditionLatest(muStatusChapterCount(mu), anilistCount, anchorFloorCh);
  const coverageFloor = muCoverageChapterMax(mu);
  const floor = Math.max(coverageFloor ?? 0, tableFloorCh);
  const base = raw == null ? (floor > 0 ? floor : null) : Math.max(raw, floor);
  if (base == null || !seriesId) return base;
  const shifted = toRuledChapter(seriesId, 'mu', base) ?? base;
  const cap = CHAPTER_SPACE_OVERRIDES[seriesId]?.chapters;
  return cap != null ? Math.min(shifted, cap) : shifted;
}

/** the highest chapter number MU's anime coverage strings name (every "Chap N" in anime.start / anime.end), or null */
export function muCoverageChapterMax(mu: { anime?: { start?: string | null; end?: string | null } | null }): number | null {
  const text = `${mu.anime?.start ?? ''} ${mu.anime?.end ?? ''}`;
  const nums = [...text.matchAll(/Chap(?:ter)?\.?\s*(\d+)/gi)].map((m) => Number(m[1])).filter((n) => Number.isFinite(n) && n > 0 && n < 10000);
  return nums.length ? Math.max(...nums) : null;
}
