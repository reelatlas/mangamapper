// MU coverage-string parsing — PURE (no DB import) so the gate is unit-tested
// without credentials; lib/mu-frontier.ts re-exports and consumes it.

/** "Original Ending Ep 22-26" / "in EP 42-43" describe a FILLER BLOCK, never the pin episode — a ranged EP is not a coverage episode. */
const stripEpRanges = (t: string) => t.replace(/\bEP\.?\s*\d+\s*-\s*\d+/gi, '');

export function parseCoverageAll(text: string | null): {
  pairs: { volume: number; chapter: number }[];
  explicitEp: number | null;
} {
  if (!text) return { pairs: [], explicitEp: null };
  const pairs = [...text.matchAll(/Vol\.?\s*(\d+)\s*,?\s*Chap(?:ter)?\.?\s*(\d+)/gi)].map((m) => ({
    volume: Number(m[1]),
    chapter: Number(m[2]),
  }));
  const ep = pairs.length === 1 ? stripEpRanges(text).match(/\bEP\.?\s*(\d+)/i) : null;
  return { pairs, explicitEp: ep ? Number(ep[1]) : null };
}

// ---- LABELLED SEGMENTS (G32 gate 0, batch 20 wave 1, 2026-08-27). MU writes
// one coverage sentence for the whole FRANCHISE, one "Vol N, Chap M (label)"
// segment per work, " / "-separated: "Vol 22, Chap 197 (TV) / Vol 31, Chap
// 276 (The First Slam Dunk)", "Vol 23, Chap 273 (1983 EP 119) … / Vol 36,
// Chap 387 (Scramble for the Throne) / Vol 45, Chap 465 (Perfect Origin S2)",
// "Vol 2, Chap 12 (2001) / Vol 10, Chap 95 (Ultimate)". Taking the in-band
// MAX pair picks another work's endpoint whenever a film / OVA / remake /
// unlisted sequel shares the manga space — and, with more than one pair, the
// explicit "EP n" was ignored, so the pin fell on the last aired row (a
// filler row on every one of the seven wave-1 refusals). A segment is THIS
// entry's when its label names an episode inside the run ("EP 119"), a TV /
// season tag ("TV", "S1", "S2P2", "Season 3"), a year inside the entry's
// broadcast window, or no label at all. A segment with any other label — a
// title, "Movie", "OVA", "Film", "Ultimate", a foreign year — belongs to
// another work and never wins. Season splits on a whole-run entry keep
// today's behaviour (the max among THIS entry's segments). When every
// labelled segment is foreign, the frontier refuses and flags (research
// decides which work the entry is), never guesses.
export type CoverageSegment = { volume: number; chapter: number; label: string; explicitEp: number | null };

export function parseCoverageSegments(text: string | null): CoverageSegment[] {
  if (!text) return [];
  const out: CoverageSegment[] = [];
  // split on the " / " work separator; a segment without a Vol/Chap pair (e.g. "TBA") is dropped
  for (const part of text.split(/\s\/\s/)) {
    const m = part.match(/Vol\.?\s*(\d+)\s*,?\s*Chap(?:ter)?\.?\s*(\d+)/i);
    if (!m) continue;
    const label = (part.match(/\(([^)]*)\)/)?.[1] ?? '').trim();
    const ep = stripEpRanges(part).match(/\bEP\.?\s*(\d+)/i);
    out.push({ volume: Number(m[1]), chapter: Number(m[2]), label, explicitEp: ep ? Number(ep[1]) : null });
  }
  return out;
}

export type EntryWindow = { airedEpisodes: number; startYear?: number | null; endYear?: number | null };

// "this entry" markers anywhere in the label: a TV tag, a season tag (also
// "S1+OVA", "S2P2", "Season 3"), an episode ("E13", "EP 119"), a year inside
// the broadcast window (±1: MU wrote "1983 S1" for a run that began 1984).
const ENTRY_MARKER = /(^|[^A-Za-z])(TV|S\d+(P\d+)?|Season\s*\d+|E\d+|EP\.?\s*\d+)(?![A-Za-z])/i;
// another work's markers — decisive only when SOME segment carries an entry marker
const FOREIGN_LABEL = /\b(movie|film|ova|oad|ona|special|ultimate|remake|live[- ]action)\b/i;

/** Is this segment THIS entry's (true), another work's (false), or undecidable (null)? */
export function segmentIsEntry(seg: CoverageSegment, w: EntryWindow): boolean | null {
  const label = seg.label;
  if (!label) return null;
  if (seg.explicitEp != null) return seg.explicitEp <= w.airedEpisodes; // "1983 EP 119": the episode decides, whatever else the label says
  const years = [...label.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => Number(m[0]));
  if (years.length && w.startYear != null) {
    const lo = w.startYear - 1, hi = (w.endYear ?? w.startYear) + 1;
    if (years.some((y) => y >= lo && y <= hi)) return true;
    return false; // a year outside the window names another work ("(2001)" vs Ultimate 2006; "(1998)" vs the 2011 series)
  }
  if (ENTRY_MARKER.test(label)) return true;
  if (FOREIGN_LABEL.test(label)) return false;
  return null; // a bare title ("Dragon Ball", "The Final Act", "Immortal") — not decidable from the label alone
}

export type SegmentPick = { chosen: CoverageSegment[]; foreign: CoverageSegment[]; unresolved: boolean; reason: string };

/**
 * The segments the frontier may use for THIS entry. Entry-marked segments
 * win; a foreign-marked segment never wins beside them. When no segment
 * carries an entry marker the string is UNRESOLVED: today's behaviour is
 * kept (every segment, the caller takes the max) and the audit lists the
 * series (mu_pin_multiwork_unresolved) for a ruling — never a regression,
 * never a guess against a title.
 */
export function pickEntrySegments(segments: CoverageSegment[], w: EntryWindow): SegmentPick {
  if (segments.length <= 1) return { chosen: segments, foreign: [], unresolved: false, reason: 'single segment' };
  // an explicit episode inside the run is the strongest marker: when any segment carries one, only those segments are this entry's ("(1983 EP 119)" beats a sequel's "(Perfect Origin S2)")
  const withEp = segments.filter((x) => x.explicitEp != null && x.explicitEp <= w.airedEpisodes);
  const mine = withEp.length ? withEp : segments.filter((x) => segmentIsEntry(x, w) === true);
  const foreign = segments.filter((x) => segmentIsEntry(x, w) === false || (withEp.length && !withEp.includes(x) && ENTRY_MARKER.test(x.label)));
  if (mine.length) return { chosen: mine, foreign, unresolved: false, reason: `labelled for this entry: ${mine.map((x) => `${x.chapter} (${x.label})`).join(', ')}` };
  const labelled = segments.some((x) => x.label);
  if (!labelled) return { chosen: segments, foreign: [], unresolved: false, reason: 'no work labels — every segment is this entry\'s' };
  return { chosen: segments, foreign, unresolved: true, reason: `no segment carries an entry marker (${segments.map((x) => `${x.chapter} (${x.label})`).join(', ')}) — today's pin kept, listed for a ruling` };
}

