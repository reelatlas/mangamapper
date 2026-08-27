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

// absolute chapter → volume: REAL print boundaries first (estimated rows must
// never contradict anchor rows' curated volumes — the Kenshin ep-29 wobble,
// Sean 2026-08-23), ratio estimate as the boundary-less fallback.
const chToVol = (anime: AnimeSeries, r: Ratios, ch: number): number | null => {
  for (const b of anime.volumeBoundaries ?? []) {
    if (ch >= b.chapterStart && (b.chapterEnd === null || ch <= b.chapterEnd)) return b.volume;
  }
  if (!r.perVol) return null;
  const startVol = anime.mangaStartVolume ?? 1;
  const vol = startVol + Math.floor((ch - r.startCh) / r.perVol);
  return Math.min(anime.totalVolumes ?? Infinity, Math.max(startVol, vol));
};


// ── anchor-aware interpolation (Sean 2026-08-24) ────────────────────────────
// A single far-end frontier anchor (Boruto: ep 293 → ch 67) made the old
// global linear estimate paint wrong values across the whole run. Confirmed
// points — every episode with a real mangaMapping (its last chapter = the
// frontier reached BY that episode) plus the latestKnown frontier — form a
// piecewise curve in canon-index space; estimates interpolate BETWEEN
// surrounding points and never extrapolate past the last confirmed one.

interface AnchorPoint {
  idx: number; // canon/mixed episode index
  ch: number; // chapter frontier reached at that episode
  // REORDER REGIME (Sean's MHA 107/113 report, 2026-08-23): a point below the
  // running maximum sits inside a jumped-back block (MHA's My Villain
  // Academia arc aired after the Endeavor Agency arc: 218-240 after 241-252).
  // Formulas — interpolation, prevEnd+1 starts, the successor cap — only
  // hold BETWEEN points of the same regime; across a boundary they paint
  // plausible-but-wrong numbers, so they return null there (honest unknown)
  onTrend: boolean;
}

// two consecutive points can be bridged by a formula only when they share a
// regime (both on the monotonic envelope, or both inside the same
// jumped-back block and still advancing)
const bridgeable = (a: AnchorPoint, b: AnchorPoint): boolean =>
  (a.onTrend && b.onTrend) || (!a.onTrend && !b.onTrend && b.ch >= a.ch);

const anchorPointsCache = new WeakMap<MappingSummary, AnchorPoint[]>();
const anchorPoints = (anime: AnimeSeries, m: MappingSummary): AnchorPoint[] => {
  const hit = anchorPointsCache.get(m);
  if (hit) return hit;
  const raw: AnchorPoint[] = [];
  for (const e of anime.episodes) {
    if (!e.mangaMapping) continue;
    const last = lastChapterNumber(e.mangaMapping.chapters);
    if (last !== null) raw.push({ idx: epToCanonIdx(m, e.number), ch: last, onTrend: true });
  }
  if (m.latestKnown?.chapters) {
    const covered = lastChapterNumber(m.latestKnown.chapters);
    if (covered !== null) raw.push({ idx: epToCanonIdx(m, m.latestKnown.episode), ch: covered, onTrend: true });
  }
  raw.sort((a, b) => a.idx - b.idx || a.ch - b.ch);
  // same idx keeps the max. DECREASING chapters at later episodes are KEPT
  // (Sean 2026-08-23: adaptation order may legitimately jump back — the curve
  // renders confirmed flow as stored). Junk numbering-space anchors are gated
  // at write time (chapter-space gate, lib/anchors) and audited
  // (anchor_nonmonotonic), never silently dropped at display time.
  const pts: AnchorPoint[] = [];
  for (const p of raw) {
    const prev = pts[pts.length - 1];
    if (prev && p.idx === prev.idx) prev.ch = Math.max(prev.ch, p.ch);
    else pts.push({ ...p });
  }
  let envelope = -Infinity;
  for (const p of pts) {
    p.onTrend = p.ch >= envelope;
    envelope = Math.max(envelope, p.ch);
  }
  anchorPointsCache.set(m, pts);
  return pts;
};

// The regime an episode index belongs to: its own point's when exact, the
// surrounding segment's when that segment is bridgeable, null when the index
// falls inside a reorder crossing (no formula may speak for it)
const regimeAt = (anime: AnimeSeries, m: MappingSummary, idx: number): boolean | null => {
  const { startCh } = ratios(anime, m);
  let prev: AnchorPoint = { idx: 0, ch: startCh - 1, onTrend: true };
  for (const p of anchorPoints(anime, m)) {
    if (p.idx === idx) return p.onTrend;
    if (p.idx > idx) return bridgeable(prev, p) ? prev.onTrend : null;
    prev = p;
  }
  return prev.onTrend;
};

// True when an episode sits inside a reorder crossing — the rows the
// verifier and audits list as zone holes (they need their own exact record)
export const inReorderCrossing = (anime: AnimeSeries, m: MappingSummary, ep: number): boolean =>
  regimeAt(anime, m, epToCanonIdx(m, ep)) === null;

// Estimated chapter for a canon/mixed episode — piecewise between confirmed
// anchor points (falls back to the origin→frontier line when no interior
// anchors exist, which is the old behavior)
export const canonEpToCh = (anime: AnimeSeries, m: MappingSummary, ep: number): number | null => {
  const { startCh, covered, adapted } = ratios(anime, m);
  const ct = canonTotal(m);
  if (!covered || !adapted || ct <= 0) return null;
  const idx = epToCanonIdx(m, ep);
  let prev: AnchorPoint = { idx: 0, ch: startCh - 1, onTrend: true }; // synthetic origin
  for (const p of anchorPoints(anime, m)) {
    if (p.idx >= idx) {
      if (p.idx === prev.idx) return Math.max(startCh, Math.min(covered, p.ch));
      // an exact row always resolves to its own point; an ESTIMATE inside a
      // reorder crossing has no honest value (MHA ep 107 between the
      // Endeavor Agency block and the MVA back-jump)
      if (p.idx !== idx && !bridgeable(prev, p)) return null;
      const frac = (idx - prev.idx) / (p.idx - prev.idx);
      const ch = Math.round(prev.ch + frac * (p.ch - prev.ch));
      return Math.max(startCh, Math.min(covered, ch));
    }
    prev = p;
  }
  // BEYOND the last confirmed point the honest estimate is NO estimate:
  // canon-typed episodes past the frontier may adapt side stories or nothing
  // (Kenshin's "lost episodes" 95-98 repeated ch 151 under the old clamp)
  return null;
};

// DISPLAY chapter for an episode = the FIRST chapter it animates (Sean's
// ruling 2026-08-23): an episode row anchors where it STARTS in the manga,
// not where it ends — "ep 35 = ch 119", never the mid/end point 127. Derived
// from the same end-position curve (one derivation path): start(ep) =
// previous canon episode's end + 1, clamped to this episode's own end. This
// clamp IS the majority rule — when the previous episode ended mid-chapter
// leaving only scraps, the next full chapter is shown; when two episodes
// share a chapter (end(prev) = end(ep)) the shared chapter is shown. The
// anchors themselves stay end-position instruments (interpolation, frontier,
// continue-from all rest on them).
export const canonEpStartCh = (anime: AnimeSeries, m: MappingSummary, ep: number): number | null => {
  const end = canonEpToCh(anime, m, ep);
  if (end === null) return null;
  const prev = prevCanonEp(m, ep);
  const myRegime = regimeAt(anime, m, epToCanonIdx(m, ep));
  let start: number;
  let floor = Number.NEGATIVE_INFINITY; // no successor may pull the start below this
  if (prev === null) start = Math.min(end, ratios(anime, m).startCh);
  else {
    const prevEnd = canonEpToCh(anime, m, prev);
    // prevEnd+1 presumes the previous episode shares this one's regime; across
    // a reorder boundary (MHA ep 113 resuming at 256 after the MVA block ended
    // at 240) the derivation is meaningless — no start (callers fall back to
    // the row's own end value when one is known)
    if (prevEnd !== null && (myRegime === null || regimeAt(anime, m, epToCanonIdx(m, prev)) !== myRegime || prevEnd > end)) return null;
    start = prevEnd === null ? end : Math.min(end, prevEnd + 1);
    // the predecessor's OWN stated start (when it has an exact record) is the
    // floor: this row may share or re-tread its chapters, but can never
    // render as beginning before it did
    const prevRow = anime.episodes.find((e) => e.number === prev);
    const prevOwn = prevRow?.mangaMapping
      ? prevRow.mangaMapping.start ?? parseInt(prevRow.mangaMapping.chapters.split(/[-,]/)[0], 10)
      : null;
    if (prevOwn != null && !Number.isNaN(prevOwn)) floor = prevOwn;
  }
  // Interpolated rows adjacent to an exact row can overshoot past that row's
  // REAL start by one (the end-curve doesn't know where the next episode
  // actually begins) — an episode can never start after its successor, so the
  // next exact row's span start caps every derived start before it
  // (the one-chapter-dip class, Sean 2026-08-23) — within ONE regime only: a
  // successor that opens a jumped-back block says nothing about this row.
  // The `floor` guard is the same rule the regime check aims at, enforced
  // locally so it also holds where regime detection is too coarse (Sean's
  // Sailor Moon ep-72 report, 2026-08-24: ep 73 re-treads chs 15-17 after ep
  // 71 reached 16, and the cap dragged ep 72's derived start back to 15 —
  // rendering an episode as starting BEFORE its predecessor). A successor
  // that reaches back past the predecessor's end is a reorder, and reorders
  // never set a neighbour's position (the AoT-87 rule).
  for (const e of anime.episodes) {
    if (e.number <= ep || !e.mangaMapping) continue;
    if (e.type !== 'canon' && e.type !== 'mixed') continue;
    const s = parseInt(e.mangaMapping.chapters.split(/[-,]/)[0], 10);
    const nextRegime = regimeAt(anime, m, epToCanonIdx(m, e.number));
    if (!Number.isNaN(s) && /[-,]/.test(e.mangaMapping.chapters) && s < start && s >= floor && nextRegime === myRegime) start = s;
    break; // only the nearest following exact row bounds this one
  }
  return start;
};

// The canon/mixed episode covering a chapter — piecewise inverse of the same
// curve; by construction never filler
export const chToEp = (anime: AnimeSeries, m: MappingSummary, ch: number): number | null => {
  const { startCh, covered, adapted } = ratios(anime, m);
  const ct = canonTotal(m);
  if (!covered || !adapted || ct <= 0 || ch < startCh) return null;
  let prev: AnchorPoint = { idx: 0, ch: startCh - 1, onTrend: true };
  for (const p of anchorPoints(anime, m)) {
    if (ch <= p.ch) {
      if (p.ch === prev.ch || p.idx === prev.idx) return canonIdxToEp(m, Math.max(1, p.idx));
      const frac = (ch - prev.ch) / (p.ch - prev.ch);
      const idx = Math.max(1, Math.min(ct, Math.round(prev.idx + frac * (p.idx - prev.idx))));
      return canonIdxToEp(m, idx);
    }
    prev = p;
  }
  return canonIdxToEp(m, Math.max(1, Math.min(ct, prev.idx)));
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
      if (type === 'filler' || exact?.offSource) {
        return base({ state: 'run', driver: 'ep', ep, type, unit: ep, noManga: true });
      }
      if (exact?.mangaMapping) {
        // position readout mirrors the episode list: START chapter — the
        // record's OWN start whenever it states one (a single-chapter episode
        // states it too), the span's first number otherwise, derivation only
        // when the start is genuinely unknown
        const first = parseInt(exact.mangaMapping.chapters.split(/[-,]/)[0], 10);
        const hasSpan = /[-,]/.test(exact.mangaMapping.chapters);
        const startNum = exact.mangaMapping.start ?? (hasSpan && !Number.isNaN(first) ? first : canonEpStartCh(anime, mapping, ep));
        return base({
          state: 'run', driver: 'ep', ep, type, unit: ep,
          vol: startNum !== null ? (chToVol(anime, r, startNum) ?? exact.mangaMapping.volume) : exact.mangaMapping.volume,
          ch: startNum !== null ? String(startNum) : exact.mangaMapping.chapters,
        });
      }
      // estimated rows display the episode's START chapter (Sean's ruling)
      const chNum = canonEpStartCh(anime, mapping, ep);
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
  vol: number | null;   // null for filler and off-source rows (no source values exist)
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
  // known values exist but the section's tail is unmapped (frontier inside)
  openEnded?: boolean;
}

export interface EpisodeListData {
  rows: EpisodeRow[];
  sections: EpisodeSection[];
}

export const buildEpisodeList = (anime: AnimeSeries, m: MappingSummary): EpisodeListData => {
  const r = ratios(anime, m);
  const byNumber = new Map(anime.episodes.map((e) => [e.number, e]));
  const rows: EpisodeRow[] = [];
  // per-row COVERAGE end (end-position curve) — rows display their START
  // chapter (Sean's ruling 2026-08-23), but section headers describe the
  // section's full coverage, so the true end is tracked alongside
  const rowEnd: (number | null)[] = [];
  for (let ep = 1; ep <= m.airedEpisodes; ep++) {
    const exact = byNumber.get(ep);
    const type = exact?.type ?? episodeTypeAt(m, ep);
    let vol: number | null = null;
    let ch: string | null = null;
    let end: number | null = null;
    // filler and off-source (adopted / side_source, T26) rows keep manga values null by design (— in the UI)
    if (type !== 'filler' && !exact?.offSource) {
      if (exact?.mangaMapping) {
        end = lastChapterNumber(exact.mangaMapping.chapters);
        // display the episode's START (Sean's first-chapter ruling): the
        // record's OWN start wins whenever it states one, then a span's first
        // number ("119-127"), and only a genuinely unknown start derives
        const first = parseInt(exact.mangaMapping.chapters.split(/[-,]/)[0], 10);
        const hasSpan = /[-,]/.test(exact.mangaMapping.chapters);
        const startNum = exact.mangaMapping.start ?? (hasSpan && !Number.isNaN(first) ? first : canonEpStartCh(anime, m, ep));
        ch = startNum !== null ? String(startNum) : exact.mangaMapping.chapters;
        vol = startNum !== null ? (chToVol(anime, r, startNum) ?? exact.mangaMapping.volume) : exact.mangaMapping.volume;
      } else {
        const chNum = canonEpStartCh(anime, m, ep);
        vol = chNum !== null ? chToVol(anime, r, chNum) : null;
        ch = chNum !== null ? String(chNum) : null;
        end = canonEpToCh(anime, m, ep);
      }
    }
    rows.push({ ep, type, title: exact?.title ?? null, vol, ch });
    rowEnd.push(end);
  }
  // section coverage reads from the rows themselves, so header ranges always
  // agree with the rows revealed on expand. PARTIAL knowledge renders as
  // partial (Sean 2026-08-23): a section straddling the frontier keeps its
  // KNOWN start/end from the first/last valued rows and marks the tail
  // open-ended ("ch:48–?") — never a bare dash while values exist inside.
  // ENVELOPE RULE (Sean 2026-08-23 s2, the MHA 106-126 header): a section's
  // range is the true envelope of the rows inside it — chStart = the LOWEST
  // row start anywhere in the section (a reorder block that dips below the
  // first row counts), chEnd = the HIGHEST coverage end anywhere in it (a
  // peak that isn't the last row counts). Never "first row → last row":
  // that hid MHA's vol-23 MVA block inside a "ch:250-295" header. Supersedes
  // the high-to-low header ruling: rows still show the flow as stored, the
  // header shows what the section spans.
  const sections: EpisodeSection[] = m.spans.map((span, index) => {
    const valued = rows.slice(span.start - 1, span.end).filter((r) => r.ch != null);
    const starts = valued
      .map((row) => parseInt(row.ch!.split(/[-,]/)[0], 10))
      .filter((n) => Number.isFinite(n) && n > 0);
    const ends = valued
      .map((row) => rowEnd[rows.indexOf(row)] ?? lastChapterNumber(row.ch!))
      .filter((n): n is number => n != null && Number.isFinite(n));
    const chStart = starts.length ? Math.min(...starts) : null;
    const chEnd = ends.length ? Math.max(...ends, ...(chStart !== null ? [chStart] : [])) : null;
    const vols = valued.map((row) => row.vol).filter((v): v is number => v != null);
    const tailRow = rows[span.end - 1];
    return {
      index,
      start: span.start,
      end: span.end,
      type: span.type,
      count: span.end - span.start + 1,
      volStart: chStart !== null ? (chToVol(anime, r, chStart) ?? (vols.length ? Math.min(...vols) : null)) : null,
      // coverage end's volume, not the last row's start-volume
      volEnd: chEnd !== null ? (chToVol(anime, r, chEnd) ?? (vols.length ? Math.max(...vols) : null)) : null,
      chStart,
      chEnd,
      // known values exist but the section's final row is unmapped —
      // the range is open-ended past the frontier
      openEnded: chEnd !== null && tailRow?.ch == null,
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
  let baseEp: number | null;
  let baseCh: number | null;

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
