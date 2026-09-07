// C2 (amended 2026-09-07 — "open the book here"; Sean with Cursor after batch 23 wave 1): THE COVERAGE WALK.
//
// The continue is where a reader who stops watching after this episode OPENS THE BOOK: the first chapter not yet
// FINISHED by this or any earlier episode in watch order. Three candidates, the lowest wins:
//   1. a HOLE this episode made — a chapter inside its own span that it jumped over (record-of-ragnarok 18 plays
//      31 then 34: the reader has not read 32 → continue 32);
//   2. its END, when the END chapter is still OPEN — a first-time remainder is pending (C1: the next canon / mixed
//      row starts on it, or the span marks it page-partial and no row at or before this one closes it);
//   3. END + 1, stepping over every chapter finished at or before this episode (eyeshield-21 54: 110 was ep 52 and
//      111 is unread until ep 57 → 111; a stretch never adapted stops the walk at its first chapter).
// What the NEXT episode does is a NOTE, never the number — the next row's START is on screen already (parity, the
// old C2 value, survives as that note). Holes made by EARLIER episodes never pull a later row's number back: the
// owning row said so, the next row echoes it, the strip carries the series-wide list.
//
// FINISHED = substantively adapted (T28): a position (START / END — A10 / A47 already judged it), a bare listing in
// chapters_adapted, or an `abridged` annotation. A page-ranged or partial listing TOUCHES (the chapter stays open);
// sliver / teaser / recap / flashback / graft / restaging wording and `recap` / `graft` / `partial` annotations
// never finish. An unanchored row contributes nothing: unknown is never finished (A14). Watch order is the episode
// number. Volume-space owners (T24) walk in volumes with the same code. Pure; ONE derivation for the healer, the
// audit and the apply (P2); unit-tested on the rows that ruled it.
import { allSegments, volumeUnit } from './sliver';
import { c3Ahead } from './c3';

export type CoverageAnchor = {
  episode: number;
  chapter: number | null;
  start_chapter: number | null;
  chapters_adapted: string | null;
  continue_chapter?: number | null;
  continue_kind?: string | null;
  continue_note?: string | null;
  continue_source?: string | null;
  source?: string | null;
};
export type CoverageAnnotation = { episode: number; kind: string; chapters: string | null };
export type Touch = 'whole' | 'part' | 'never';
export type ContinueKind = 'hole' | 'open' | 'walk' | 'default' | 'post_series';
/** the kinds a STORED continue may carry (C6, amended 2026-09-07): 'default' is never stored — the display derives END + 1 */
export const STORED_CONTINUE_KINDS = ['hole', 'open', 'walk', 'post_series'] as const;

const SCRAP = /sliver|teaser|cold[- ]open|fragment|panel|scrap|recap|flashback|montage|preview|replay|relocat|graft|restag|re-?staged|re-?shown|retold|clip|condens|motif|echo|allud|callback|homage|mirror|reprise|revisit|nod to|wrap-?up|wrap\b/i;
const WHOLE_WORDS = /\b(complete|in full|whole|entire|full chapter)\b/i;
const PARTIAL_WORDS = /\bp\.?\s*\d|\bpp\.?|pages?\b|partial|\bhalf\b|opening|closing|\bfirst\b|\blast\b|remainder|rest of|beats|\bonly\b|through|\bto p|\bfrom p|\bend of\b|\bstart of\b/i;
const rank = (t: Touch): number => (t === 'whole' ? 2 : t === 'part' ? 1 : 0);
/** the integer units a fragment names: ranges expand ('15-17'), a letter-prefixed token is a bonus / scene unit, never a chapter ('B5', 'Scene 3') */
const ints = (s: string): number[] => {
  const out: number[] = [];
  for (const m of s.matchAll(/(?<![A-Za-z])(\d+)(?:\.\d+)?(?:\s*[-–]\s*(\d+))?/g)) {
    const a = Number(m[1]), b = m[2] == null ? a : Number(m[2]);
    if (!Number.isInteger(a)) continue;
    if (b >= a && b - a < 400) for (let n = a; n <= b; n++) out.push(n); else out.push(a);
  }
  return out;
};

/** what a chapters_adapted record says about each unit (chapter, or LN volume under T24) it names */
export function spanContributions(chaptersAdapted: string | null | undefined): Map<number, Touch> {
  const out = new Map<number, Touch>();
  const put = (n: number, t: Touch) => {
    const prev = out.get(n);
    if (prev === undefined || rank(t) > rank(prev)) out.set(n, t);
  };
  for (const seg of allSegments(chaptersAdapted)) {
    const head = seg.replace(/\(.*$/, '').trim();
    const qualifier = seg.slice(head.length).trim();
    const vol = volumeUnit(seg);
    if (vol != null) {
      // T24: 'v17' names the volume whole; 'v16 ch 1-3', 'v19 prologue', 'v20 ch 7 (…)' name units inside it
      const inside = head.replace(/^v(?:ol\.?|olume)?\s*\d+/i, '').trim();
      put(vol, SCRAP.test(seg) && !WHOLE_WORDS.test(seg) ? 'never' : inside ? 'part' : 'whole');
      continue;
    }
    if (SCRAP.test(seg) && !WHOLE_WORDS.test(seg)) {
      for (const n of ints(head)) put(n, 'never');
      continue;
    }
    const range = head.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if (range) {
      const a = Number(range[1]), b = Number(range[2]);
      if (b >= a && b - a < 400) for (let n = a; n <= b; n++) put(n, 'whole');
      continue;
    }
    const single = head.match(/^(\d+)(?:\.\d+)?$/);
    if (single) {
      const n = Number(single[1]);
      put(n, qualifier && !WHOLE_WORDS.test(qualifier) && PARTIAL_WORDS.test(qualifier) ? 'part' : 'whole');
      continue;
    }
    for (const n of ints(head)) put(n, 'part'); // prose, 'Scene 3', 'B5 …': touched at most
  }
  return out;
}

/** the integer chapters an annotation's `chapters` names (ranges expand; page facts in parentheses are stripped; bonus units like B5 are ignored) */
export function annotationChapters(chapters: string | null | undefined): number[] {
  const clean = String(chapters ?? '').replace(/\([^)]*\)/g, '').replace(/^[^:]*:\s*/, '');
  const out = new Set<number>();
  for (const seg of clean.split(/[,;·]/)) {
    const vol = volumeUnit(seg.trim()); // T24: 'v16 ch 3' names the volume unit
    if (vol != null) { out.add(vol); continue; }
    for (const n of ints(seg)) out.add(n);
  }
  return [...out].sort((x, y) => x - y);
}

type Contribution = { episode: number; touch: Touch; isStart: boolean; isEnd: boolean };

export type CoverageIndex = {
  /** the anchored canon / mixed rows in watch order */
  rows: CoverageAnchor[];
  /** every contribution to a chapter, in watch order */
  byChapter: Map<number, Contribution[]>;
  /** the next anchored canon / mixed row after `episode` (null at the end) */
  nextRow: (episode: number) => CoverageAnchor | null;
  /** finished by a row at or before `episode` in watch order */
  finishedAt: (chapter: number, episode: number) => boolean;
  /** the END chapter of `row` is still open at `episode`: a first-time remainder is pending */
  endOpenAt: (row: CoverageAnchor, episode: number) => boolean;
  /** the first row AFTER `episode` that finishes `chapter` (null = never, so far) */
  finishedLaterBy: (chapter: number, episode: number) => number | null;
  /** the units this row names (touch ≠ never) plus its positions */
  listed: (row: CoverageAnchor) => Map<number, Touch>;
};

const ANNOTATION_TOUCH: Record<string, Touch | undefined> = { abridged: 'whole', partial: 'part', graft: 'never', recap: 'never' };

/** build the coverage index for ONE series: `typeOf` reads the episode's type (undefined = no row → treated as canon, the AFL-lag case) */
export function buildCoverage(anchors: CoverageAnchor[], annotations: CoverageAnnotation[], typeOf: (episode: number) => string | undefined): CoverageIndex {
  const rows = anchors
    .filter((a) => a.chapter != null && Number.isFinite(Number(a.episode)))
    .filter((a) => { const t = typeOf(a.episode); return t === undefined || t === 'canon' || t === 'mixed'; })
    .sort((x, y) => x.episode - y.episode);
  const annByEp = new Map<number, CoverageAnnotation[]>();
  for (const a of annotations) annByEp.set(a.episode, [...(annByEp.get(a.episode) ?? []), a]);
  const listedOf = new Map<number, Map<number, Touch>>();
  const byChapter = new Map<number, Contribution[]>();
  for (const r of rows) {
    const span = spanContributions(r.chapters_adapted);
    const end = Number(r.chapter), start = r.start_chapter == null ? null : Number(r.start_chapter);
    // positions are substantive by A10 / A47: a START or END the span does not qualify is finished by the position
    // itself (an afg row with no span, an END-only continua pin); only the span's own page range keeps an END open
    if (start != null && !span.has(start)) span.set(start, 'whole');
    if (!span.has(end)) span.set(end, 'whole');
    // annotations, in a FIXED precedence (never the query's row order — kinnikuman 33 carried abridged{95-120} AND
    // partial{98} and flip-flopped between heals): `abridged` first, upgrading only what the row's own span lists (a
    // block-level abridged{116-126} copied onto six rows must not credit every row with the whole block); then
    // partial / graft / recap, which TOUCH the chapters they name and WIN — covered means finished, not touched, and an
    // explicit partial on the END keeps it open
    const anns = [...(annByEp.get(r.episode) ?? [])].sort((x, y) => (ANNOTATION_TOUCH[x.kind] === 'whole' ? 0 : 1) - (ANNOTATION_TOUCH[y.kind] === 'whole' ? 0 : 1));
    for (const a of anns) {
      const t = ANNOTATION_TOUCH[a.kind];
      if (!t) continue;
      for (const c of annotationChapters(a.chapters)) {
        if (t === 'whole') { if (span.get(c) === 'part') span.set(c, 'whole'); }
        else if (span.get(c) !== 'never') span.set(c, t);
      }
    }
    // A47: the END is the last chapter the episode adapted substantively — a chapter listed ABOVE it is a tail the next
    // row owns, a teaser, an echo or a graft, never finished here (sailor-moon 46: '14 (daily-life reset echoed)')
    for (const [c, t] of span) if (c > end && t === 'whole') span.set(c, 'part');
    listedOf.set(r.episode, span);
    for (const [c, touch] of span) {
      byChapter.set(c, [...(byChapter.get(c) ?? []), { episode: r.episode, touch, isStart: c === start, isEnd: c === end }]);
    }
  }
  for (const list of byChapter.values()) list.sort((x, y) => x.episode - y.episode);
  const nextRow = (episode: number): CoverageAnchor | null => rows.find((r) => r.episode > episode) ?? null;
  const rowOf = new Map(rows.map((r) => [r.episode, r]));
  const endOpenAt = (row: CoverageAnchor, episode: number): boolean => {
    const end = Number(row.chapter);
    // (a) a later first-time remainder: the next canon / mixed row STARTS on this END and has not aired for this reader
    const g = nextRow(row.episode);
    if (g && g.start_chapter != null && Number(g.start_chapter) === end && g.episode > episode) return true;
    // (b) the span marks the END page-partial and no other row at or before `episode` finishes it
    const own = listedOf.get(row.episode)?.get(end);
    if (own === 'part') {
      const others = (byChapter.get(end) ?? []).filter((k) => k.episode !== row.episode && k.episode <= episode);
      return !others.some((k) => k.touch === 'whole' || k.isStart);
    }
    return false;
  };
  const finishedAt = (chapter: number, episode: number): boolean =>
    (byChapter.get(chapter) ?? []).some((k) => {
      if (k.episode > episode) return false;
      if (k.touch === 'whole' || k.isStart) return true;
      if (k.isEnd) { const r = rowOf.get(k.episode); return !!r && !endOpenAt(r, episode); }
      return false;
    });
  const finishedLaterBy = (chapter: number, episode: number): number | null => {
    for (const k of byChapter.get(chapter) ?? []) {
      if (k.episode <= episode) continue;
      if (k.touch === 'whole' || k.isStart || k.isEnd) return k.episode;
    }
    return null;
  };
  return { rows, byChapter, nextRow, finishedAt, endOpenAt, finishedLaterBy, listed: (row) => listedOf.get(row.episode) ?? new Map() };
}

export type WalkResult = {
  episode: number;
  end: number;
  /** the chapter to open the book at */
  value: number;
  kind: ContinueKind;
  /** false when the display's derived END + 1 already says it (kind 'default') */
  stored: boolean;
  holes: number[];
  /** chapters between END and the value that earlier episodes finished, with the episodes that did */
  finishedEarlier: { chapters: number[]; episodes: number[] };
  /** chapters this episode listed ABOVE the value (C3: skip on arrival) */
  ahead: number[];
  /** the next anchored canon / mixed row and its START (null = unknown) */
  next: { episode: number; start: number | null } | null;
  note: string;
};

const ranges = (chs: number[]): string => {
  const out: [number, number][] = [];
  for (const c of [...new Set(chs)].sort((a, b) => a - b)) { const last = out[out.length - 1]; if (last && c === last[1] + 1) last[1] = c; else out.push([c, c]); }
  return out.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(', ');
};
const epRanges = (eps: number[]): string => {
  const r = ranges(eps);
  return `${r.includes('-') || r.includes(',') ? 'eps' : 'ep'} ${r}`;
};

export const WALK_NOTE_PREFIX = 'C2 walk (2026-09-07)';

/** derive the continue for ONE anchored canon / mixed row; `finale` = the series is finished and this is its last anchored row */
export function walkContinue(row: CoverageAnchor, index: CoverageIndex, opts: { finale: boolean; unit?: 'ch' | 'vol' }): WalkResult {
  const unit = opts.unit ?? 'ch';
  const end = Number(row.chapter);
  const ep = row.episode;
  const listed = index.listed(row);
  // 1. holes this episode made: between the lowest unit it names and its END, unnamed, not finished so far
  const named = [...listed.entries()].filter(([, t]) => t !== 'never').map(([c]) => c);
  const lo = named.length ? Math.min(...named) : end;
  const holes: number[] = [];
  if (end - lo <= 100) for (let c = lo + 1; c < end; c++) if (!listed.has(c) && !index.finishedAt(c, ep)) holes.push(c);
  // 2. the END still open
  const open = index.endOpenAt(row, ep);
  // 3. the forward walk
  let walk = end + 1;
  while (walk <= end + 500 && index.finishedAt(walk, ep)) walk++;
  const value = holes.length ? holes[0] : open ? end : walk;
  let kind: ContinueKind = holes.length ? 'hole' : open ? 'open' : walk > end + 1 ? 'walk' : 'default';
  if (opts.finale) kind = 'post_series';
  const stored = kind !== 'default';
  const finishedChapters: number[] = [];
  const finishedEps = new Set<number>();
  if (!holes.length && !open) for (let c = end + 1; c < value; c++) {
    finishedChapters.push(c);
    for (const k of index.byChapter.get(c) ?? []) if (k.episode <= ep && (k.touch === 'whole' || k.isStart || k.isEnd)) finishedEps.add(k.episode);
  }
  const ahead = c3Ahead(row.chapters_adapted, value).filter((c) => listed.get(c) !== 'never');
  const g = index.nextRow(ep);
  const next = g ? { episode: g.episode, start: g.start_chapter == null ? null : Number(g.start_chapter) } : null;
  // the note: three facts, generated, episodes named as ranges (never hand prose)
  const parts: string[] = [];
  if (holes.length) {
    const later = index.finishedLaterBy(holes[0], ep);
    parts.push(`this episode skipped ${unit} ${ranges(holes)} (unread)${later ? ` — ep ${later} adapts ${holes.length > 1 ? 'them' : 'it'}` : ' — never adapted so far'}`);
  }
  if (open && !holes.length) {
    const closer = g && next?.start === end ? g.episode : index.finishedLaterBy(end, ep);
    parts.push(`${unit} ${end} is left open here${closer ? ` — ep ${closer} finishes it` : ''}`);
  }
  if (finishedChapters.length) parts.push(`${unit} ${ranges(finishedChapters)} already adapted (${epRanges([...finishedEps])})`);
  if (ahead.length) parts.push(`already seen here: ${unit} ${ranges(ahead)} — skip on arrival`);
  if (next) {
    if (next.start == null) parts.push(`ep ${next.episode}'s start is unknown`);
    else if (next.start > value) parts.push(`the anime skips ahead: ep ${next.episode} opens at ${unit} ${next.start}`);
    else if (next.start < value) parts.push(`the anime jumps back: ep ${next.episode} opens at ${unit} ${next.start}`);
  } else if (opts.finale) parts.push('the anime ends here — the book continues');
  const note = `${WALK_NOTE_PREFIX}: open the book at ${unit} ${value}${parts.length ? ' — ' + parts.join('; ') : ''}`.slice(0, 600);
  return { episode: ep, end, value, kind, stored, holes, finishedEarlier: { chapters: finishedChapters, episodes: [...finishedEps].sort((a, b) => a - b) }, ahead, next, note };
}

/** the stored VALUE agrees with the walk: the walk's value, or nothing where the walk says END + 1 — a stored END + 1 is redundant, never wrong */
export const continueValueAgrees = (row: CoverageAnchor, w: WalkResult): boolean =>
  row.continue_chapter == null ? !w.stored : Number(row.continue_chapter) === w.value;

/** the kind a stored row should carry for this walk (C6): the walk's own, or 'walk' for a curated value the healer would not store */
export const kindFor = (w: WalkResult): Exclude<ContinueKind, 'default'> => (w.kind === 'default' ? 'walk' : w.kind);

/** the stored continue agrees with the walk in value AND kind (the healer's own test; a curated row is judged on value by the audit) */
export const continueAgrees = (row: CoverageAnchor, w: WalkResult): boolean =>
  continueValueAgrees(row, w) && (row.continue_chapter == null || row.continue_kind === kindFor(w));
