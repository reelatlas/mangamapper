// Honest terminal (rule G56, 2026-08-26 — the claymore #945 class). When an
// MU frontier pin lands on a row that cannot take an anchor (A1 filler,
// A44 position-less), the SERIES' honest terminal is the non-MU anchor on
// the last canon/mixed row at or before the pin episode. If that anchor
// already reaches MU's coverage chapter, the pin is REDUNDANT — research has
// already placed the terminal MU is pointing at — and the writer skips
// silently instead of refusing and re-filing a flag forever. If it does not
// reach it, the refusal stands: research still owes the terminal. Pure;
// unit-tested; the writer (lib/mu-frontier.ts) and the census call it.

export type TerminalRow = { number: number; type: string | null };
export type TerminalAnchor = { episode: number; chapter: number; source: string };
export type HonestTerminal = { episode: number; chapter: number; source: string };

/**
 * The series' honest terminal at or before `pinEpisode`: the MAX-chapter
 * non-MU anchor over canon/mixed rows that CAN hold a position (A44
 * position-less rows skipped — chrono-crusade 21). A4 says coverage is the
 * max-chapter anchor, never the run-end anchor, because an anime may end on
 * a relocated earlier block — hellsing (batch 20 wave 1, 2026-08-27): the
 * last manga row is ep 10 → Order 2 (a relocated flashback) while the
 * frontier is ep 7 → 12; the first cut of this function read the last row
 * and could never see MU's "Chap 12" as redundant. Null when no such row
 * carries an anchor.
 */
export const honestTerminal = (rows: TerminalRow[], anchors: TerminalAnchor[], pinEpisode: number, isPositionless: (episode: number) => boolean = () => false): HonestTerminal | null => {
  const eligible = new Set(rows.filter((r) => r.number <= pinEpisode && (r.type === 'canon' || r.type === 'mixed') && !isPositionless(r.number)).map((r) => r.number));
  let best: HonestTerminal | null = null;
  for (const a of anchors) {
    if (a.source === 'mu' || !eligible.has(a.episode)) continue;
    if (!best || Number(a.chapter) > best.chapter) best = { episode: a.episode, chapter: Number(a.chapter), source: a.source };
  }
  return best;
};

/** G56: the pin adds nothing when the honest terminal already reaches MU's chapter */
export const pinRedundant = (terminal: HonestTerminal | null, coverageChapter: number): boolean => terminal != null && terminal.chapter >= coverageChapter;
