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
// c3Note, backjumpRange / backjumpNoteOk / backjumpCoverage / backjumpNote (2026-08-25 … 09-04) were superseded on
// 2026-09-07 by lib/coverage.ts#walkContinue (C2 amended: the note is generated from the coverage index, the back-jump
// exit is the walk's ordinary case). c3Ahead + hasSkipLanguage stay: the walk's "already seen here" part and the
// curated-note check (continue_offwalk_curated) read them.
