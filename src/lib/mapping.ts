import type { AnimeSeries, EpisodeType, MappingSummary } from '@/types/anime';

// ─────────────────────────────────────────────────────────────────────────────
// Pure anime↔manga position math. Interaction spec: docs/components/map-lookup.md
//
// Core principle: chapters only exist in canon/mixed episodes, so every ch↔ep
// conversion is CANON-AWARE — it walks the span data and skips filler. A
// chapter can never resolve to a filler episode; stepping a chapter hops the
// strip needle over red blocks.
// ─────────────────────────────────────────────────────────────────────────────

// ── parsing helpers ──────────────────────────────────────────────────────────

// Trailing chapter of a chapter string ("1088-1089" → 1089, "8-12,14" → 14)
export const lastChapterNumber = (chapters: string): number | null => {
  const parsed = parseInt(chapters.split(/[-,]/).pop() ?? '', 10);
  return Number.isNaN(parsed) ? null : parsed;
};

// Does a chapter string ("1088-1089", "8-12,14,16-19") contain this chapter?
// NB: a single-number part has NO hi element — it must compare as equality
// (Number.isNaN(undefined) is false, so a plain isNaN(hi) check silently
// broke every single-chapter mapping; fixed 2026-08-19).
const chapterInRange = (chapters: string, chapter: number): boolean =>
  chapters.split(',').some((part) => {
    const [lo, hi] = part.split('-').map((n) => parseInt(n, 10));
    if (Number.isNaN(lo)) return false;
    return hi === undefined || Number.isNaN(hi) ? chapter === lo : chapter >= lo && chapter <= hi;
  });

// ── canon-aware span math ────────────────────────────────────────────────────

const canonTotal = (m: MappingSummary): number => m.canonCount + m.mixedCount;

export const episodeTypeAt = (m: MappingSummary, ep: number): EpisodeType =>
  m.spans.find((s) => ep >= s.start && ep <= s.end)?.type ?? 'canon';

// How many canon/mixed episodes exist at-or-before this episode
const epToCanonIdx = (m: MappingSummary, ep: number): number => {
  let idx = 0;
  for (const s of m.spans) {
    if (s.start > ep) break;
    if (s.type !== 'filler') idx += Math.min(ep, s.end) - s.start + 1;
  }
  return idx;
};

// The idx-th canon/mixed episode's actual number
const canonIdxToEp = (m: MappingSummary, idx: number): number => {
  let seen = 0;
  for (const s of m.spans) {
    if (s.type === 'filler') continue;
    const len = s.end - s.start + 1;
    if (seen + len >= idx) return s.start + (idx - seen) - 1;
    seen += len;
  }
  return m.airedEpisodes;
};

// Nearest canon/mixed episode strictly after/before ep (null at the run's edge)
export const nextCanonEp = (m: MappingSummary, ep: number): number | null => {
  for (const s of m.spans) {
    if (s.type === 'filler') continue;
    if (s.end > ep) return Math.max(s.start, ep + 1);
  }
  return null;
};
export const prevCanonEp = (m: MappingSummary, ep: number): number | null => {
  let best: number | null = null;
  for (const s of m.spans) {
    if (s.start >= ep) break;
    if (s.type === 'filler') continue;
    best = Math.min(s.end, ep - 1);
  }
  return best;
};

// ── series ratios ────────────────────────────────────────────────────────────

interface Ratios {
  startCh: number;          // first chapter of THIS entry's source scope (sequels start mid-manga)
  covered: number | null;   // last chapter the anime has adapted (absolute)
  published: number;        // last chapter of this entry's scope (absolute)
  adapted: number | null;   // chapters adapted so far WITHIN the scope
  perVol: number | null;    // chapters per volume (absolute numbering)
}

const ratios = (anime: AnimeSeries, m: MappingSummary): Ratios => {
  const startCh = anime.mangaStartChapter ?? 1;
  const covered = m.latestKnown?.chapters ? lastChapterNumber(m.latestKnown.chapters) : null;
  const published = anime.totalChapters ?? (covered ?? 0) + (m.mangaAheadChapters ?? 0);
  const adapted = covered !== null && covered >= startCh ? covered - startCh + 1 : null;
  const startVol = anime.mangaStartVolume ?? 1;
  const perVol =
    anime.totalChapters && anime.totalVolumes
      ? (anime.totalChapters - startCh + 1) / (anime.totalVolumes - startVol + 1)
      : covered && m.latestKnown?.volume
        ? (covered - startCh + 1) / (m.latestKnown.volume - startVol + 1)
        : null;
  return { startCh, covered, published, adapted, perVol };
};

// absolute chapter → volume, respecting the entry's scope start
const chToVol = (anime: AnimeSeries, r: Ratios, ch: number): number | null => {
  if (!r.perVol) return null;
  const startVol = anime.mangaStartVolume ?? 1;
  const vol = startVol + Math.floor((ch - r.startCh) / r.perVol);
  return Math.min(anime.totalVolumes ?? Infinity, Math.max(startVol, vol));
};


// Estimated chapter for a canon/mixed episode (chapters spread over canon eps only)
export const canonEpToCh = (anime: AnimeSeries, m: MappingSummary, ep: number): number | null => {
  const { startCh, covered, adapted } = ratios(anime, m);
  const ct = canonTotal(m);
  if (!covered || !adapted || ct <= 0) return null;
  const within = Math.max(1, Math.min(adapted, Math.round((epToCanonIdx(m, ep) / ct) * adapted)));
  return startCh - 1 + within;
};

// The canon/mixed episode covering a chapter — by construction never filler
export const chToEp = (anime: AnimeSeries, m: MappingSummary, ch: number): number | null => {
  const { startCh, covered, adapted } = ratios(anime, m);
  const ct = canonTotal(m);
  if (!covered || !adapted || ct <= 0 || ch < startCh) return null;
  const idx = Math.max(1, Math.min(ct, Math.round(((ch - startCh + 1) / adapted) * ct)));
  return canonIdxToEp(m, idx);
};

// A chapter guaranteed to resolve back to this canon/mixed episode — used by
// strip clicks so the needle lands exactly where the user clicked. Prefers the
// episode's confirmed chapter range; otherwise corrects the estimate's ±1
// roundtrip drift.
export const chapterForEpisode = (
  anime: AnimeSeries,
  m: MappingSummary,
  ep: number,
): number | null => {
  const exact = anime.episodes.find((e) => e.number === ep && e.mangaMapping);
  if (exact?.mangaMapping) {
    const first = parseInt(exact.mangaMapping.chapters.split(/[-,]/)[0], 10);
    if (!Number.isNaN(first)) return first;
  }
  const est = canonEpToCh(anime, m, ep);
  if (est === null) return null;
  const { startCh, covered } = ratios(anime, m);
  // Candidates must be validated with the SAME resolution solvePosition uses —
  // confirmed episode ranges win before the estimator — or a candidate that
  // passes chToEp can still land inside a neighbor's confirmed range.
  const resolves = (ch: number): boolean => {
    const hit = anime.episodes.find(
      (e) => e.mangaMapping && chapterInRange(e.mangaMapping.chapters, ch),
    );
    return hit ? hit.number === ep : chToEp(anime, m, ch) === ep;
  };
  for (const cand of [est, est + 1, est - 1, est + 2, est - 2, est + 3, est - 3]) {
    if (cand < startCh || (covered !== null && cand > covered)) continue;
    if (resolves(cand)) return cand;
  }
  // No chapter resolves to this episode — the linear estimate disagrees with
  // nearby confirmed anchors. Anchor-aware interpolation (estimate BETWEEN
  // confirmed points) is the real fix once AniList data lands; until then the
  // estimate is returned and the solver's answer wins.
  return est;
};

// A strip unit (episode-equivalent, may sit in the manga_only tail) → chapter
export const unitToChapter = (anime: AnimeSeries, m: MappingSummary, unit: number): number | null => {
  const { covered, published } = ratios(anime, m);
  if (covered === null) return null;
  const ep = Math.max(1, Math.round(unit));
  if (ep <= m.airedEpisodes) return canonEpToCh(anime, m, ep);
  if (m.mangaAheadUnits <= 0 || published <= covered) return covered;
  return Math.min(
    published,
    covered + Math.round(((ep - m.airedEpisodes) * (published - covered)) / m.mangaAheadUnits),
  );
};

// ── unified position solve ───────────────────────────────────────────────────

export type PositionField = 'ep' | 'vol' | 'ch';
export type PositionQuery = Partial<Record<PositionField, number>>;

export interface PositionResult {
  state: 'run' | 'hatch' | 'out'; // in the aired run / manga_only zone / beyond everything
  driver: PositionField;
  ep: number | null;
  vol: number | null;
  ch: string | null;    // display string — confirmed data may be a range ("1088-1089")
  chEnd: number | null; // vol-driven: estimated last chapter of the volume
  type: EpisodeType | null;
  unit: number | null;  // strip coordinate in episode-equivalents
  noManga: boolean;     // filler episode → no manga values exist
  pin?: boolean;        // a strip-pinned filler selection (values null by design)
  boundMsg: string | null; // out_of_range bounds text
}

const base = (over: Partial<PositionResult> & Pick<PositionResult, 'state' | 'driver'>): PositionResult => ({
  ep: null,
  vol: null,
  ch: null,
  chEnd: null,
  type: null,
  unit: null,
  noManga: false,
  boundMsg: null,
  ...over,
});

export const solvePosition = (
  anime: AnimeSeries,
  mapping: MappingSummary,
  query: PositionQuery,
): PositionResult | null => {
  const r = ratios(anime, mapping);
  const { startCh, covered, published, perVol } = r;
  const startVol = anime.mangaStartVolume ?? 1;
  const aired = mapping.airedEpisodes;
  const aheadUnits = Math.max(0, mapping.mangaAheadUnits);

  const solveChapter = (
    ch: number,
    driver: PositionField,
    givenVol: number | null,
    chEnd: number | null,
  ): PositionResult | null => {
    if (!Number.isInteger(ch) || ch < 1) return null;
    // chapters before this entry's scope belong to a predecessor series
    if (ch < startCh) {
      return base({ state: 'out', driver, boundMsg: `ch ${startCh}-${published}` });
    }
    if (ch > published) {
      return base({ state: 'out', driver, unit: aired + aheadUnits + 1, boundMsg: `ch ${startCh}-${published}` });
    }
    const vol = givenVol ?? chToVol(anime, r, ch);
    if (covered !== null && ch <= covered) {
      const exact = anime.episodes.find(
        (e) => e.mangaMapping && chapterInRange(e.mangaMapping.chapters, ch),
      );
      const ep = exact ? exact.number : chToEp(anime, mapping, ch);
      if (ep === null) return null;
      return base({
        state: 'run', driver, ep, vol, ch: String(ch), chEnd,
        type: exact?.type ?? episodeTypeAt(mapping, ep), unit: ep,
      });
    }
    const unit =
      covered !== null && published > covered && aheadUnits > 0
        ? aired + ((ch - covered) * aheadUnits) / (published - covered)
        : aired;
    return base({ state: 'hatch', driver, vol, ch: String(ch), chEnd, unit });
  };

  if (query.ep != null) {
    const ep = query.ep;
    if (!Number.isInteger(ep) || ep < 1) return null;
    if (ep <= aired) {
      const exact = anime.episodes.find((e) => e.number === ep);
      const type = exact?.type ?? episodeTypeAt(mapping, ep);
      if (type === 'filler' || type === 'anime-only-canon') {
        return base({ state: 'run', driver: 'ep', ep, type, unit: ep, noManga: true });
      }
      if (exact?.mangaMapping) {
        return base({
          state: 'run', driver: 'ep', ep, type, unit: ep,
          vol: exact.mangaMapping.volume, ch: exact.mangaMapping.chapters,
        });
      }
      const chNum = canonEpToCh(anime, mapping, ep);
      return base({
        state: 'run', driver: 'ep', ep, type, unit: ep,
        vol: chNum !== null ? chToVol(anime, r, chNum) : null,
        ch: chNum !== null ? String(chNum) : null,
      });
    }
    // beyond the aired run: project at the tail's pacing
    if (aheadUnits > 0 && covered !== null) {
      const estCh = covered + Math.round(((ep - aired) * (published - covered)) / aheadUnits);
      if (estCh <= published) {
        return base({
          state: 'hatch', driver: 'ep', unit: ep,
          vol: chToVol(anime, r, estCh), ch: String(estCh),
        });
      }
    }
    return base({ state: 'out', driver: 'ep', unit: ep, boundMsg: `ep 1-${aired}` });
  }

  if (query.vol != null) {
    const vol = query.vol;
    if (!Number.isInteger(vol) || vol < 1) return null;
    // volumes before this entry's scope belong to a predecessor series
    if (vol < startVol || (anime.totalVolumes !== null && vol > anime.totalVolumes)) {
      return base({ state: 'out', driver: 'vol', boundMsg: `vol ${startVol}-${anime.totalVolumes ?? '?'}` });
    }
    if (!perVol) return null;
    const volStartCh = Math.max(startCh, startCh + Math.round((vol - startVol) * perVol));
    const chEnd = Math.max(volStartCh, Math.min(startCh - 1 + Math.round((vol - startVol + 1) * perVol), published));
    return solveChapter(volStartCh, 'vol', vol, chEnd);
  }

  if (query.ch != null) return solveChapter(query.ch, 'ch', null, null);

  return null;
};

// Largest steppable value per field. Stepping never leaves the valid range:
// ep clamps to the aired run (the manga_only hatch holds no episode numbers —
// nothing to land on), ch to published chapters, vol to total volumes.
// Typing beyond these remains allowed (an intentional query → projection or
// out_of_range); only stepping is bounded.
export const fieldMax = (
  anime: AnimeSeries,
  mapping: MappingSummary,
  field: PositionField,
): number | null => {
  if (field === 'ep') return mapping.airedEpisodes;
  if (field === 'ch') return ratios(anime, mapping).published;
  return anime.totalVolumes;
};

// Smallest steppable value per field — the scope's start, not 1, for sequels.
export const fieldMin = (
  anime: AnimeSeries,
  mapping: MappingSummary,
  field: PositionField,
): number => {
  if (field === 'ep') return 1;
  if (field === 'ch') return anime.mangaStartChapter ?? 1;
  return anime.mangaStartVolume ?? 1;
};

// ── episode list synthesis ───────────────────────────────────────────────────
// The full aired run as rows + its spans as collapsible sections.
// Interaction spec: docs/components/episode-list.md

export interface EpisodeRow {
  ep: number;
  type: EpisodeType;
  title: string | null; // null → rendered as // title_pending
  vol: number | null;   // null for filler/anime-only (no manga values exist)
  ch: string | null;    // display string — confirmed data may be a range ("1088-1089")
}

export interface EpisodeSection {
  index: number;
  start: number;
  end: number;
  type: EpisodeType;
  count: number;
  // manga coverage of the section — WHOLE volumes, no partial marking
  volStart: number | null;
  volEnd: number | null;
  chStart: number | null;
  chEnd: number | null;
}

export interface EpisodeListData {
  rows: EpisodeRow[];
  sections: EpisodeSection[];
}

export const buildEpisodeList = (anime: AnimeSeries, m: MappingSummary): EpisodeListData => {
  const r = ratios(anime, m);
  const byNumber = new Map(anime.episodes.map((e) => [e.number, e]));
  const rows: EpisodeRow[] = [];
  for (let ep = 1; ep <= m.airedEpisodes; ep++) {
    const exact = byNumber.get(ep);
    const type = exact?.type ?? episodeTypeAt(m, ep);
    let vol: number | null = null;
    let ch: string | null = null;
    // filler/anime-only rows keep manga values null by design (— in the UI)
    if (type !== 'filler' && type !== 'anime-only-canon') {
      if (exact?.mangaMapping) {
        vol = exact.mangaMapping.volume;
        ch = exact.mangaMapping.chapters;
      } else {
        const chNum = canonEpToCh(anime, m, ep);
        vol = chNum !== null ? chToVol(anime, r, chNum) : null;
        ch = chNum !== null ? String(chNum) : null;
      }
    }
    rows.push({ ep, type, title: exact?.title ?? null, vol, ch });
  }
  // section coverage reads from the rows themselves, so header ranges always
  // agree with the rows revealed on expand
  const sections: EpisodeSection[] = m.spans.map((span, index) => {
    const first = rows[span.start - 1];
    const last = rows[span.end - 1];
    const chStart = first?.ch != null ? parseInt(first.ch.split(/[-,]/)[0], 10) || null : null;
    const chEnd = last?.ch != null ? lastChapterNumber(last.ch) : null;
    return {
      index,
      start: span.start,
      end: span.end,
      type: span.type,
      count: span.end - span.start + 1,
      volStart: first?.vol ?? null,
      volEnd: last?.vol ?? null,
      chStart,
      chEnd,
    };
  });
  return { rows, sections };
};

// ── seeded stepping ──────────────────────────────────────────────────────────
// Stepping an EMPTY input continues from the current selection instead of
// restarting at 1. From a filler position, seek the nearest canon episode in
// the step direction and seed its chapter/volume.

export interface SeedContext {
  pinEp: number | null;
  result: PositionResult | null;
}

export const seedStepValue = (
  anime: AnimeSeries,
  mapping: MappingSummary,
  ctx: SeedContext,
  field: PositionField,
  dir: number,
): number | null => {
  const r = ratios(anime, mapping);
  const aired = mapping.airedEpisodes;
  let baseEp: number | null = null;
  let baseCh: number | null = null;

  // DIRECTIONAL INTEGRITY: seeding only ever moves in the pressed direction.
  // If no valid value exists that way, return null (the caller no-ops) —
  // never fall back to the other direction, never revert.

  // pinned in the manga_only hatch (beyond the aired run): every episode is
  // BELOW the pin, so ep↑ has nothing to land on (no-op); ep↓ = last aired.
  // The chapter at a hatch pin is itself a real published chapter.
  if (ctx.pinEp !== null && ctx.pinEp > aired) {
    if (field === 'ep') return dir > 0 ? null : aired;
    const pinCh = unitToChapter(anime, mapping, ctx.pinEp);
    if (field === 'ch') return pinCh;
    return pinCh !== null ? chToVol(anime, r, pinCh) : null;
  }

  const fillerEp = ctx.pinEp ?? (ctx.result?.noManga ? ctx.result.ep : null);
  if (fillerEp !== null) {
    // nearest canon episode strictly in the step direction; none → no-op
    const near = dir > 0 ? nextCanonEp(mapping, fillerEp) : prevCanonEp(mapping, fillerEp);
    if (near === null) return null;
    baseEp = near;
    baseCh = canonEpToCh(anime, mapping, near);
  } else if (ctx.result && ctx.result.state !== 'out') {
    baseEp = ctx.result.ep;
    baseCh = ctx.result.ch !== null ? lastChapterNumber(ctx.result.ch) : null;
  } else {
    return null;
  }

  if (field === 'ep') return baseEp;
  if (field === 'ch') return baseCh;
  return baseCh !== null ? chToVol(anime, r, baseCh) : null;
};
