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

// C5's covered-or-not note for a block exit (Sean + Cursor 2026-09-04): the
// chapters between this END and the continue are each ALREADY adapted by an
// earlier row, adapted LATER by a following row (parity — skip on arrival),
// or NEVER adapted (unseen). One builder, used by the curation proposal now
// and by the parity healer when it learns the covered branch.
export type BackjumpCoverage = { before: [number, number][]; after: [number, number][]; unseen: [number, number][]; beforeEps: [number, number] | null; afterEps: [number, number] | null };
const spans = (chs: number[]): [number, number][] => {
  const out: [number, number][] = [];
  for (const c of [...new Set(chs)].sort((a, b) => a - b)) {
    const last = out[out.length - 1];
    if (last && c === last[1] + 1) last[1] = c; else out.push([c, c]);
  }
  return out;
};
const fmt = (s: [number, number][]) => s.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`)).join(', ');
const epRange = (eps: number[]): [number, number] | null => (eps.length ? [Math.min(...eps), Math.max(...eps)] : null);
/** classify every chapter in [end+1, continue-1] against the chapters other ANCHORED rows adapt (by episode order).
 *  'unseen' means not adapted by any anchored row — a gap in the anchors is not a skip by the anime. */
export function backjumpCoverage(episode: number, end: number, continueChapter: number, rows: { episode: number; chapters: number[] }[]): BackjumpCoverage {
  const before = new Map<number, number[]>(), after = new Map<number, number[]>();
  for (const r of rows) for (const c of r.chapters) {
    const m = r.episode < episode ? before : r.episode > episode ? after : null;
    if (m) m.set(c, [...(m.get(c) ?? []), r.episode]);
  }
  const b: number[] = [], a: number[] = [], u: number[] = [], bEps: number[] = [], aEps: number[] = [];
  for (let c = end + 1; c < continueChapter; c++) {
    if (before.has(c)) { b.push(c); bEps.push(...before.get(c)!); } else if (after.has(c)) { a.push(c); aEps.push(...after.get(c)!); } else u.push(c);
  }
  return { before: spans(b), after: spans(a), unseen: spans(u), beforeEps: epRange(bEps), afterEps: epRange(aEps) };
}
const eps = (r: [number, number] | null) => (r ? (r[0] === r[1] ? ` (ep ${r[0]})` : ` (eps ${r[0]}-${r[1]})`) : '');
export function backjumpNote(cov: BackjumpCoverage, existing: string | null): string {
  const parts: string[] = [];
  if (cov.before.length) parts.push(`chs ${fmt(cov.before)} already adapted by earlier episodes${eps(cov.beforeEps)} — not a skip`);
  if (cov.after.length) parts.push(`chs ${fmt(cov.after)} are adapted later${eps(cov.afterEps)} — parity: skip on arrival`);
  if (cov.unseen.length) parts.push(`chs ${fmt(cov.unseen)} not adapted by any anchored row (a gap in the anchors is not proof the anime skipped them)`);
  const kept = String(existing ?? '').trim();
  return `${kept ? kept + ' | ' : ''}C5 (Sean 2026-09-04, back-jump exit): ${parts.join('; ') || 'nothing lies between END and the continue'}.`.slice(0, 900);
}
