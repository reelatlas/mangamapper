// Note text helpers (P5, 2026-09-07). An anchor / continue note is a ' | '-separated list of provenance sentences that writers APPEND to;
// an idempotent writer appends once. `repeatedSegment` names the first sentence a note carries twice (the batch-17 append loop —
// the Ace act II verifier found ep 52's REPAIR sentence five times); `dedupeSegments` is the one repair shape (order kept, first wins).
export const noteSegments = (note: string | null | undefined): string[] => String(note ?? '').split(/\s\|\s/).map((s) => s.trim()).filter(Boolean);

export const repeatedSegment = (note: string | null | undefined): string | null => {
  const seen = new Set<string>();
  for (const s of noteSegments(note)) { if (seen.has(s)) return s; seen.add(s); }
  return null;
};

export const dedupeSegments = (note: string | null | undefined): string => [...new Set(noteSegments(note))].join(' | ');
