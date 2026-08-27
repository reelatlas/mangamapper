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
