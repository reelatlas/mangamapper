// C3 skip-note predicate (Sean's C3 ruling, 2026-08-25) — THE single
// definition, consumed by the parity healer (which stamps the notes) and by
// audit-ui-truth's continue_skip_unnoted class (which verifies the outcome).
// A continue point sitting below chapters the same episode already covered
// must tell the reader which chapters to skip on arrival. STRICTLY greater:
// continue == an adapted chapter is C1 (mid-chapter straddle — re-reading is
// intended, never "skip"). Parenthesized page/graft facts are stripped
// before number extraction so page spans never masquerade as chapters.

export function c3Ahead(chaptersAdapted: string | null, continueChapter: number | null): number[] {
  if (continueChapter == null) return [];
  const clean = String(chaptersAdapted ?? '').replace(/\([^)]*\)/g, '');
  const nums = clean.match(/\d+(?:\.\d+)?/g)?.map(Number).filter(Number.isInteger) ?? [];
  return [...new Set(nums.filter((n) => n > continueChapter))].sort((x, y) => x - y);
}

export const hasSkipLanguage = (note: string | null): boolean =>
  /skip|already|covered|re-read/i.test(String(note ?? ''));

export const c3Note = (existingNote: string | null, ahead: number[]): string => {
  const kept = String(existingNote ?? '').trim();
  return `${kept ? kept + ' | ' : ''}C3 (Sean 2026-08-25): this episode also covered ch ${ahead.join(', ')} ahead of the continue point — skip on arrival unless re-reading.`.slice(0, 600);
};

// THE C3 TWIN (Sean 2026-09-04, shippuden 112 — C5's back-jump paragraph):
// C3 only sees a continue BELOW the row's own chapters. A row that EXITS a
// jumped-back block has the opposite shape — its continue sits ABOVE its END,
// and the chapters in between were either ALREADY adapted (112: 319-343 at
// eps 74-90 → continue 343) or NEVER adapted (kind unseen → continue END + 1
// / the next START, the range named). Either way the note must SAY which,
// or the reader cannot tell a skip from a re-read. One predicate, consumed by
// audit-ui-truth's backjump_continue_unnoted class (and by the healer when it
// learns to fill the covered branch itself).
export const backjumpRange = (end: number, continueChapter: number): [number, number] | null =>
  Number.isInteger(end) && Number.isInteger(continueChapter) && continueChapter > end + 1 ? [end + 1, continueChapter - 1] : null;

export const backjumpNoteOk = (note: string | null): boolean =>
  /already|never adapted|not adapted|unseen|read (?:long )?ago|adapted (?:at|by|in) ep|first-time pass|backward/i.test(String(note ?? ''));
