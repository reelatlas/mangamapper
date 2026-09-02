// Sliver rule (A10, Sean 2026-08-23 s2 — MHA ep 170; lifted into lib for
// batch 19 E3 / drift item A-6, 2026-08-26). START is the FIRST CHAPTER
// ANIMATED: a leading PARTIAL of the immediately preceding chapter IS the
// start unless it is scraps — at most 5 pages, or sliver / teaser /
// cold-open / recap / flashback wording. Only a partial of start-1 counts:
// a far-earlier chapter opening the episode is a relocated graft or
// flashback and never the position (AoT ep 87: "123 (first half, relocated
// flashback), 130 (remainder)" keeps 130). Batches 14 and 17 carried this
// normalization as duplicated apply-script code; the 27 batch-8/9 starts
// seeded under the earlier MAJORITY rule were never re-normalized (A-6).
// This is now the ONE derivation (P2): apply scripts normalize through it,
// the census proves standing rows with it (start_sliver_mismatch), and a
// START with no chapters_adapted record is listed as unprovable
// (start_without_span). Pure; unit-tested.

export type SliverVerdict = {
  /** the START the rule derives (equals `start` when nothing moves) */
  start: number;
  /** the leading segment of chapters_adapted, as written */
  lead: string;
  /** the chapter the leading segment names, when it is start-1 */
  leadChapter: number | null;
  /** page count the record states for the leading partial (0 = unquantified) */
  pages: number;
  /** why the lead counts or does not */
  reason: 'no-lead' | 'lead-is-start' | 'not-preceding' | 'substantive' | 'scraps';
};

const WORDY = /half|most|bulk|remainder|rest of|majority|through/i;
const SCRAPPY = /sliver|teaser|cold[- ]open|fragment|panel|scrap|recap|flashback|montage|preview|replay/i;

/** the first comma-separated segment of a chapters_adapted record (commas inside parentheses do not split) */
export const leadingSegment = (chaptersAdapted: string | null | undefined): string =>
  String(chaptersAdapted ?? '').split(/,(?![^()]*\))/)[0]?.trim() ?? '';

/** pages a leading segment states: summed ranges, else a count of single page numbers; 0 when it states none */
export const statedPages = (lead: string): number => {
  const spans = [...lead.matchAll(/(\d+)\s*[-–]\s*(\d+)/g)].map((m) => Math.max(0, Number(m[2]) - Number(m[1]) + 1));
  const singles = (lead.match(/(?:p\.?\s*|,\s*)(\d+)(?!\s*[-–]|\d)/g) ?? []).length;
  return spans.reduce((x, y) => x + y, 0) + (spans.length ? 0 : singles);
};

/** A10: derive the START the sliver rule gives a record; `start` is the stored / proposed value */
export const sliverStart = (chaptersAdapted: string | null | undefined, start: number): SliverVerdict => {
  const lead = leadingSegment(chaptersAdapted);
  const leadNum = Number((lead.match(/^(\d+)(?!\.)/) ?? [])[1]);
  if (!lead || !Number.isInteger(leadNum) || leadNum < 1) return { start, lead, leadChapter: null, pages: 0, reason: 'no-lead' };
  if (leadNum === start) return { start, lead, leadChapter: null, pages: 0, reason: 'lead-is-start' };
  if (leadNum !== start - 1) return { start, lead, leadChapter: null, pages: 0, reason: 'not-preceding' };
  const pages = statedPages(lead);
  const substantive = !SCRAPPY.test(lead) && (WORDY.test(lead) || pages >= 6);
  return substantive ? { start: leadNum, lead, leadChapter: leadNum, pages, reason: 'substantive' } : { start, lead, leadChapter: leadNum, pages, reason: 'scraps' };
};

// END-SIDE SLIVER (A47, Sean 2026-09-02 — the A10 twin; witnesses orient ep 12
// and one-piece-log ep 10). END is the furthest MAINLINE chapter the episode
// adapts (A4) — but an END does not ADVANCE on a trailing scrap of the next
// chapter that the NEXT episode owns: a tail of at most 5 pages (or
// sliver / teaser / cold-open wording) of chapter X, when the next anchored
// episode STARTS on X, is that episode's chapter — the position stays on
// X-1 and the tail is recorded (chapters_adapted keeps it; a `partial`
// annotation names it). Without a next episode (a finale) the tail stands:
// there is no one to own it, and the reader continues IN it (C1). Only a
// tail of exactly `end` moves; a record whose trailing segment already sits
// beyond END is normalized already. Pure; unit-tested; the apply layer
// normalizes through it and the census proves standing rows
// (end_sliver_mismatch).
export type EndSliverVerdict = {
  /** the END the rule derives (equals `end` when nothing moves) */
  end: number;
  /** the trailing segment of chapters_adapted, as written */
  tail: string;
  /** the chapter the trailing segment names */
  tailChapter: number | null;
  /** page count the record states for the trailing partial (0 = unquantified) */
  pages: number;
  reason: 'no-tail' | 'tail-not-end' | 'sole-segment' | 'no-next' | 'next-not-on-end' | 'substantive' | 'owned-tail';
};

/** the last comma-separated segment of a chapters_adapted record (commas inside parentheses do not split) */
export const trailingSegment = (chaptersAdapted: string | null | undefined): string => {
  const parts = String(chaptersAdapted ?? '').split(/,(?![^()]*\))|\s·\s/).map((x) => x.trim()).filter(Boolean); // commas (outside parens) or the ' · ' separator some records use
  return parts[parts.length - 1] ?? '';
};

/** A47: derive the END the end-side sliver rule gives a record; `nextStart` is the next anchored episode's START (null = no next anchor) */
export const sliverEnd = (chaptersAdapted: string | null | undefined, end: number, nextStart: number | null): EndSliverVerdict => {
  const tail = trailingSegment(chaptersAdapted);
  // a range segment ("43-46") names its upper bound; a single chapter names itself
  const m = tail.match(/^(\d+)(?:\s*[-–]\s*(\d+))?(?!\.)/);
  const tailNum = m ? Number(m[2] ?? m[1]) : NaN;
  if (!tail || !Number.isInteger(tailNum) || tailNum < 1) return { end, tail, tailChapter: null, pages: 0, reason: 'no-tail' };
  if (m?.[2]) return { end, tail, tailChapter: tailNum, pages: 0, reason: 'tail-not-end' }; // a whole range is never a scrap
  if (tailNum !== end) return { end, tail, tailChapter: tailNum, pages: 0, reason: 'tail-not-end' };
  // the tail is the episode's ONLY record: there is no earlier chapter to fall back to — X-1 would be a
  // chapter the episode never adapts (d-gray-man 66: '78 (approx. p13 only)'). Never move; such a row is
  // a judgment call (a one-page fragment → A44 position-less, or the value stands) — listed, not derived.
  if (leadingSegment(chaptersAdapted) === tail) return { end, tail, tailChapter: tailNum, pages: 0, reason: 'sole-segment' };
  if (nextStart == null) return { end, tail, tailChapter: tailNum, pages: 0, reason: 'no-next' };
  if (nextStart !== end) return { end, tail, tailChapter: tailNum, pages: 0, reason: 'next-not-on-end' };
  // a range counts as PAGES only behind a page marker (p. / pp. / page): '46 — 44-45 skipped' and
  // '638 (opening of the 638-640 …)' name chapters, not pages (the first census run listed both)
  const pages = /\bp(?:p|ages?|g)?\.?\s*\d/i.test(tail) ? statedPages(tail) : 0;
  const scraps = SCRAPPY.test(tail) || (pages > 0 && pages <= 5 && !WORDY.test(tail));
  return scraps ? { end: end - 1, tail, tailChapter: tailNum, pages, reason: 'owned-tail' } : { end, tail, tailChapter: tailNum, pages, reason: 'substantive' };
};
