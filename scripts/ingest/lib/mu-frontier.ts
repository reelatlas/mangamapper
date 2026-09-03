// MU-frontier application + manga-status cross-check — the single source of
// truth shared by audit-manga-coverage, mu-backfill (inline upkeep) and the
// refresh-mu edge function.
//
// MU's anime field is MULTI-SEGMENT prose (MHA lists every season's endpoint;
// Naruto's covers three series with an EP number belonging to the Boruto
// clause): parse ALL Vol/Chap pairs, pick the largest inside THIS series'
// scope segment, and trust an EP pin only when the text holds exactly one
// pair. The write is behind five gates — sibling-scope ceiling, chapter-space,
// airing-pin, scope-consumed, A1 episode-type — plus the pin-episode
// redundancy skip and curated precedence. 'mu' anchors are derivations —
// refreshing a series deletes and re-derives its row so rule fixes heal
// everything.

import { db, fileFlagOnce, selectAll } from './db';
import { MU_FRONTIER_SUPPRESSED } from './rulings/mu-frontier-suppressed';
import { isAnchorSuppressed } from './rulings/anchor-suppressed';
import { isParallelSeries } from './rulings/source-relations';
import { honestTerminal, pinRedundant } from './honest-terminal';

export { parseCoverageAll, parseCoverageSegments, pickEntrySegments, segmentIsEntry, type CoverageSegment, type EntryWindow } from './mu-coverage';
import { parseCoverageAll, parseCoverageSegments, pickEntrySegments } from './mu-coverage';
import { toRuledChapter, CHAPTER_SPACE_OVERRIDES } from './rulings/chapter-spaces';

export interface FrontierSeries {
  id: string;
  aired_episodes: number;
  total_chapters: number | null;
  manga_start_chapter: number | null;
  // anime status — an MU pin without an explicit episode may only anchor a
  // FINISHED run (see the airing-pin rule below)
  status?: string | null;
  // the broadcast window (G32 gate 0: a segment labelled with a year inside it is this entry's)
  start_date?: string | null;
  end_date?: string | null;
}

export type FrontierResult =
  | 'applied'
  | 'skipped_fresh'
  | 'skipped_terminal' // G56: the pin lands on a row that cannot take an anchor, but the honest terminal already reaches MU's chapter
  | 'no_progress'
  | 'no_coverage'
  | 'out_of_space'
  | 'refused_sibling_scope'
  | 'refused_scope_consumed'
  | 'refused_episode_type'
  | 'suppressed';

// Curated MU-frontier suppressions (declarative records, Sean's D1 ruling
// 2026-08-24): entries whose MU pin is WRONG for a reason NO structural gate
// can derive from held data. Each entry states its reasoning and the
// condition that retires it. The delete-at-entry still runs, so a standing
// bad pin heals on the next pass; the suppression only blocks the rewrite.
export { MU_FRONTIER_SUPPRESSED } from './rulings/mu-frontier-suppressed';

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
  if (MU_FRONTIER_SUPPRESSED[s.id]) return 'suppressed';
  if (isParallelSeries(s.id)) return 'suppressed'; // A46: an MU frontier is not a position on a parallel telling

  // G32 gate 0 — labelled segments: only THIS entry's segments may pin
  const year = (d?: string | null) => (d && /^\d{4}/.test(d) ? Number(d.slice(0, 4)) : null);
  const segments = parseCoverageSegments(muEnd);
  // the mf-ghost S3 lesson (wave 6): a season-numbered segment beyond this entry's own
  // season count is another entry's — count the seasons we actually contain
  const { count: seasonComponents } = await db.from('series_components').select('*', { count: 'exact', head: true }).eq('series_id', s.id).eq('kind', 'season');
  const picked = pickEntrySegments(segments, { airedEpisodes: s.aired_episodes, startYear: year(s.start_date), endYear: year(s.end_date), seasonCount: Math.max(1, seasonComponents ?? 0) });
  // an UNRESOLVED string (no entry marker on any segment) keeps today's pin;
  // the coverage audit lists it (mu_pin_multiwork_unresolved) for a ruling
  // the cobra caller-bypass (wave 7 deep, 2026-08-28): a SINGLE labelled-foreign
  // segment must refuse here too — before this, only multi-segment strings
  // consulted the pick, so '(1983)' / '(As of EP 1168)' pins landed unexamined (P5)
  const usePick = segments.length > 1 || (segments.length === 1 && picked.chosen.length === 0);
  // N35 sourceShifts (2026-09-02): MU's chapter numbers arrive in MU's space — convert into the ruled (printed) space before every gate
  const pairs = (usePick ? picked.chosen.map((x) => ({ volume: x.volume, chapter: x.chapter })) : parseCoverageAll(muEnd).pairs).map((p) => ({ ...p, chapter: toRuledChapter(s.id, 'mu', p.chapter) ?? p.chapter }));
  const explicitEp = usePick
    ? (picked.chosen.find((x) => x.explicitEp != null)?.explicitEp ?? null)
    : parseCoverageAll(muEnd).explicitEp;
  const scopeStart = s.manga_start_chapter ?? 1;
  const scopeEnd = s.total_chapters ?? Number.POSITIVE_INFINITY;

  const { data: srow } = await db
    .from('series')
    .select('latest_known_chapters, manga_anilist_id')
    .eq('id', s.id)
    .maybeSingle();

  // SIBLING-SCOPE CEILING (Sean's D1 ruling, 2026-08-24, the batch-17
  // franchise-conflation class — ace-ii ep52→259, yowamushi ep38→544): a
  // sequel's endpoint sits INSIDE the manga's chapter space, so the
  // chapter-space gate can't tell it from this entry's own frontier. When
  // sibling entries share the manga, the successors' scope starts bound this
  // entry from above: Naruto's pin can never claim Shippuden's chapters.
  // Pairs at/past the ceiling are OUT OF SCOPE for this entry — filtering
  // them (rather than refusing outright) lets the multi-segment parse pick
  // this entry's OWN labeled endpoint, exactly as scopeStart already does
  // for later entries.
  let ceiling = Number.POSITIVE_INFINITY;
  let ceilingSib: string | null = null;
  if (srow?.manga_anilist_id != null) {
    const sibs = await selectAll<{ id: string; manga_start_chapter: number | null }>('series', 'id, manga_start_chapter', (q) =>
      q.eq('manga_anilist_id', srow.manga_anilist_id).neq('id', s.id),
    );
    for (const sib of sibs) {
      const sibStart = sib.manga_start_chapter ?? 1;
      if (sibStart > scopeStart && sibStart < ceiling) {
        ceiling = sibStart;
        ceilingSib = sib.id;
      }
    }
  }

  const inBand = pairs.filter((p) => p.chapter >= scopeStart && p.chapter <= scopeEnd);
  const inScope = inBand.filter((p) => p.chapter < ceiling);
  if (!inScope.length) {
    if (inBand.length) {
      // every candidate belongs to a successor entry's scope — MU's text
      // holds nothing for THIS entry; withhold + flag, never write
      await fileFlagOnce(runId, s.id, 'mangaupdates', 'count_mismatch', {
        muPairs: inBand,
        siblingCeiling: ceiling,
        siblingId: ceilingSib,
        note: `MU coverage pairs all sit at/past sibling entry '${ceilingSib}' scope start ${ceiling} — successor-entry endpoints, not this entry's frontier; withheld (D1 sibling-scope ceiling)`,
      });
      return 'refused_sibling_scope';
    }
    return 'no_coverage';
  }
  const coverage = inScope.reduce((a, b) => (b.chapter > a.chapter ? b : a));

  // CHAPTER-SPACE gate on MU pins (Sean 2026-08-23, the Slime/4KOTA class):
  // MU's coverage prose describes the whole FRANCHISE — against a partial
  // entry (Slime held only S1's 24 eps) the largest pair lands a chapter the
  // entry's own space can't contain. A pin past max(total, latest_known)+10
  // is a structure/edition mismatch: withhold + flag, never write.
  const spaceMax = Math.max(s.total_chapters ?? 0, srow?.latest_known_chapters ?? 0);
  // COUNT-SPACE → NUMBER-SPACE conversion (Sean's Tokyo Ghoul 144/143 report,
  // 2026-08-24): for a finished manga where AniList's total is a COUNT and
  // MU's latest is the last chapter NUMBER (same-edition band — the display
  // total shows the NUMBER), a pin that lands between them is count-space
  // (mid-run specials/oneshot padding) and must be converted, or the
  // position row renders coverage ABOVE its own denominator (144/143).
  // Mirrors the display rule in assemble.ts totalChapters exactly.
  let converted: number | null = null;
  const latest = srow?.latest_known_chapters ?? null;
  if (
    s.total_chapters != null && latest != null &&
    latest < s.total_chapters && latest >= s.total_chapters * 0.8 &&
    coverage.chapter > latest && coverage.chapter <= s.total_chapters
  ) {
    converted = coverage.chapter;
    coverage.chapter = latest;
  }
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
  // REDUNDANCY keys on the PIN EPISODE, never a freshness window (fixed
  // 2026-08-23, Sean's AoT 88-89 report): the old "non-MU anchors within 12
  // eps of the run end" blanket-skip deleted real run-end pins the moment
  // research added interior anchors nearby (AoT's ep-89 → 139 finale pin,
  // Kuroko's 75 → 275) and nulled every trailing episode — the beyond-
  // frontier display rule refuses to extrapolate past the last anchor, so
  // "fresh enough" and "covers the run end" are NOT the same thing. Chapter
  // no-progress was the same trap in chapter space (Naruto's ep-220 → 238
  // pin adds EPISODE-space knowledge even at zero chapter progress). The
  // pin is redundant only when a non-MU anchor covers the pin episode
  // itself.
  if (nonMuMaxEp !== undefined && nonMuMaxEp >= episode) return 'skipped_fresh';
  // BACKWARDS pin (A4/A19, 2026-08-27 — the kaguya ep-41 case): a pin whose
  // chapter sits BELOW the researched maximum would render the position
  // going backwards at the run end (kaguya 40 → 160 then a pin 41 → 137 once
  // the segment gate dropped the entry's own '(Movie)' segment; heavens-lost-
  // property 27 → 38 then 28 → 34). Zero progress (== the max) is still
  // written — the Naruto rule above — but below it the pin adds nothing true.
  if (nonMuMaxCh !== undefined && coverage.chapter < nonMuMaxCh) return 'no_progress';
  // curated precedence (the same one-anchor-per-episode PK rule as every
  // derived writer): a manual/wiki anchor at the pin episode IS the frontier
  const { data: holder } = await db
    .from('chapter_anchors')
    .select('source')
    .eq('series_id', s.id)
    .eq('episode', episode)
    .maybeSingle();
  if (holder && holder.source !== 'mu') return 'skipped_fresh';

  // SCOPE-CONSUMED refusal (Sean's D1 ruling, 2026-08-24, the prisma-illya
  // case): research anchors already reach the END of this entry's scope
  // (its total, or the last chapter below the sibling ceiling), yet the pin
  // episode extends BEYOND all research — the pin would claim later episodes
  // still sit inside a space that is fully adapted. Those episodes adapt
  // something else (a different manga, a sequel scope) or nothing; a
  // frontier pin there can only be conflation. Placed after the redundancy
  // skips so a fully-researched series (research to the run end AND the
  // scope end) stays a silent skipped_fresh, never a flag.
  const scopeCap = Math.min(scopeEnd, ceiling - 1);
  if (nonMuMaxCh !== undefined && Number.isFinite(scopeCap) && nonMuMaxCh >= scopeCap) {
    await fileFlagOnce(runId, s.id, 'mangaupdates', 'count_mismatch', {
      pinEpisode: episode,
      muCoverageChapter: coverage.chapter,
      nonMuMaxCh,
      scopeCap,
      note: 'non-MU anchors already consume this entry\'s whole chapter scope but the MU pin episode extends beyond them — the trailing episodes cannot adapt this scope; frontier withheld (D1 scope-consumed)',
    });
    return 'refused_scope_consumed';
  }

  // A1 at the writer (Sean's D1 ruling, 2026-08-24, the gantz/toriko case):
  // filler rows NEVER take anchors (A1, MHA ep 104; A44 position-less rows neither) — a
  // run-end pin landing on one states adaptation for an episode that adapts
  // nothing. Refuse + flag; research records the honest terminal on the
  // last canon/mixed episode instead (toriko ep146→253). Allow-list, so an
  // unknown future type fails closed. A row-less episode can't be typed —
  // the pin stands (synthesized-row entries keep their frontier).
  const { data: epRow } = await db
    .from('episodes')
    .select('type')
    .eq('series_id', s.id)
    .eq('number', episode)
    .maybeSingle();
  const cannotAnchor = isAnchorSuppressed(s.id, episode) || (epRow != null && epRow.type !== 'canon' && epRow.type !== 'mixed');
  if (cannotAnchor) {
    // G56 honest-terminal redundancy (2026-08-26, the claymore #945 class):
    // research may already have placed the terminal MU points at — the
    // non-MU anchor on the last canon/mixed row at or before the pin. If it
    // reaches MU's chapter the pin adds nothing: skip silently and close
    // the writer's own stale refusal flag. Otherwise the refusal below
    // stands — research still owes the terminal.
    const rows = await selectAll<{ number: number; type: string | null }>('episodes', 'number, type', (q) => q.eq('series_id', s.id).lte('number', episode));
    const nonMu = await selectAll<{ episode: number; chapter: number; source: string }>('chapter_anchors', 'episode, chapter, source', (q) => q.eq('series_id', s.id).lte('episode', episode).neq('source', 'mu'));
    const terminal = honestTerminal(rows, nonMu, episode, (n) => isAnchorSuppressed(s.id, n));
    if (pinRedundant(terminal, coverage.chapter)) {
      const stale = await selectAll<{ id: number; detail: unknown }>('ingest_flags', 'id, detail', (q) => q.eq('series_key', s.id).eq('source', 'mangaupdates').eq('kind', 'count_mismatch').eq('status', 'open'));
      for (const f of stale) {
        if (!/^MU frontier pin lands on/.test(String((f.detail as { note?: string })?.note ?? ''))) continue;
        await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString(), detail: { ...(f.detail as object), dismissed: `G56: the honest terminal ep ${terminal!.episode} → ch ${terminal!.chapter} (${terminal!.source}) already reaches MU's ch ${coverage.chapter} — the pin is redundant` } }).eq('id', f.id);
      }
      return 'skipped_terminal';
    }
  }
  if (isAnchorSuppressed(s.id, episode)) return 'refused_episode_type'; // A44: position-less by ruling
  if (epRow && epRow.type !== 'canon' && epRow.type !== 'mixed') {
    await fileFlagOnce(runId, s.id, 'mangaupdates', 'count_mismatch', {
      pinEpisode: episode,
      episodeType: epRow.type,
      muCoverageChapter: coverage.chapter,
      note: `MU frontier pin lands on a ${epRow.type} episode — A1 forbids the anchor; withheld for research to place the honest terminal on the last canon/mixed episode (D1 episode-type refusal)`,
    });
    return 'refused_episode_type';
  }

  const { error } = await db.from('chapter_anchors').upsert({
    series_id: s.id,
    episode,
    volume: coverage.volume,
    chapter: coverage.chapter,
    source: 'mu',
    note: `MU curated anime-coverage: "${muEnd}"${converted != null ? ` [count-space ${converted} → chapter-number ${coverage.chapter} per the same-edition band rule]` : ''}`,
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
  // N35 (2026-09-02): the ruled chapter space is the ceiling — MU's count is
  // converted through the series' ruled MU shift (dai: MU's 349 slots = the
  // printed 348) and capped at the ruled count (orange 22, regenesis 255), so
  // the coverage healer, the MU backfill and the refresh-mu edge all write the
  // value assert-overrides would otherwise re-clamp on every heal (P20: a
  // healer converges in one run; two writers never fight over one column)
  seriesId?: string,
): number | null {
  const raw =
    sameEditionLatest(mu.latest_chapter, anilistCount, anchorFloorCh) ??
    sameEditionLatest(muStatusChapterCount(mu), anilistCount, anchorFloorCh);
  if (raw == null || !seriesId) return raw;
  const shifted = toRuledChapter(seriesId, 'mu', raw) ?? raw;
  const cap = CHAPTER_SPACE_OVERRIDES[seriesId]?.chapters;
  return cap != null ? Math.min(shifted, cap) : shifted;
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
  if (!muStatus || ourStatus === 'none' || muStatus === ourStatus) return;
  await fileFlagOnce(runId, seriesId, 'mangaupdates', 'taxonomy_conflict', {
    ourMangaStatus: ourStatus,
    muStatus: mu.status,
    muCompleted: mu.completed,
    muMapped: muStatus,
    note: 'MU and AniList disagree on the manga publication status — review (AniList lag on a just-finished manga, or a data gap)',
  });
}
