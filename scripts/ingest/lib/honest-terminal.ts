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

/** the non-MU anchor on the last canon/mixed row at or before `pinEpisode` that CAN hold a position (A44 position-less rows are skipped — chrono-crusade 21); null when no such row carries one */
export const honestTerminal = (rows: TerminalRow[], anchors: TerminalAnchor[], pinEpisode: number, isPositionless: (episode: number) => boolean = () => false): HonestTerminal | null => {
  const lastCanon = rows
    .filter((r) => r.number <= pinEpisode && (r.type === 'canon' || r.type === 'mixed') && !isPositionless(r.number))
    .reduce<number | null>((m, r) => (m == null || r.number > m ? r.number : m), null);
  if (lastCanon == null) return null;
  const a = anchors.find((x) => x.episode === lastCanon && x.source !== 'mu');
  return a ? { episode: a.episode, chapter: Number(a.chapter), source: a.source } : null;
};

/** G56: the pin adds nothing when the honest terminal already reaches MU's chapter */
export const pinRedundant = (terminal: HonestTerminal | null, coverageChapter: number): boolean => terminal != null && terminal.chapter >= coverageChapter;
