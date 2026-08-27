// RETIRED_ANNOTATIONS — annotation rows retired BY RULING (rule A45, the
// first post-wave-1 /add-rule, 2026-08-26). An annotation is a first-class
// fact (A43); when research proves a stored fact wrong, the fact does not
// die by a hand delete — research-origin rows had NO delete path at all
// (batch 17's script-level ANNOTATION_DELETIONS were one-shots that a re-run
// apply could undo; the T26 healer only reconciles ruling-origin rows). A
// retirement is a typed record: (series, episodes, kind) + the reason and
// the evidence. One mechanism (P2): the writer gate (upsertAnnotation
// refuses a retired key — no apply can re-insert it), the healer
// (assert-overrides removes a standing retired row, any origin) and the
// census (a standing retired row, or a retired key that is ALSO a standing
// T26 ruling, is a ruling_violation). Reason + cite required.
import type { AnnotationKind } from '../annotations';
import type { RulingEntry } from './types';

export type RetiredAnnotation = { episodes: number[]; kind: AnnotationKind };

export const ENTRIES: RulingEntry<RetiredAnnotation>[] = [
  {
    seriesId: 'claymore',
    ruleId: 'A45',
    value: { episodes: [21, 22, 23], kind: 'loose_parallel' },
    reason:
      "The batch-3 loose_parallel {ch 57-59} ('loosely parallels the Northern Campaign … anime outran the ongoing manga') was refuted twice: batch 18 (verified) found eps 21/22/23 are close 1:1 adaptations of Scenes 57/58/59 (stored as divergence{57}/{58}/{59}), and batch 19 anchored them 21→57, 22→58, 23→59 with the frontier at ep 23. The rows were research-origin with no delete path — the witness for A45.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch19/out/claymore.json', 'scripts/ingest/research/batch19/verify/claymore.md', 'scripts/ingest/lib/rulings/applied/batch-3.ts'],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'A45',
    value: { episodes: [25], kind: 'partial' },
    reason:
      "partial {~18 setup} (batch 12) was refuted three ways in batch 19 wave 1: the S#1 episode page says only the ch-41 library scene is adapted; ch 18's Adapted To is Railgun S ep 2 (our 26); the ja Railgun wiki maps 妹達編 to S #2+. Replaced by graft{41}. Deleted at apply (P24); retired here so no re-apply can re-insert it.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch19/out/a-certain-scientific-railgun.json', 'scripts/ingest/research/batch19/verify/a-certain-scientific-railgun.md'],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'A45',
    value: { episodes: [49], kind: 'partial' },
    reason:
      'partial {40-42} (batch 12) contradicted the stored abridged{40-42} on the same row and the chapter pages (ch 40 → S ep 17 rat scene only; ch 42 → the T Drama CD only); abridged is the correct fact. Deleted at apply (P24); retired here.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch19/verify/a-certain-scientific-railgun.md'],
  },
];

const key = (seriesId: string, episode: number, kind: string) => `${seriesId}#${episode}#${kind}`;

/** the derived lookup: every retired (series, episode, kind) key */
export const RETIRED_ANNOTATIONS: Set<string> = new Set(ENTRIES.flatMap((e) => e.value.episodes.map((ep) => key(e.seriesId, ep, e.value.kind))));

/** A45: is this annotation retired by ruling? */
export const isAnnotationRetired = (seriesId: string, episode: number, kind: string): boolean => RETIRED_ANNOTATIONS.has(key(seriesId, episode, kind));

/** the retired keys grouped per series for the healer */
export const retiredBySeries = (): Map<string, { episode: number; kind: AnnotationKind }[]> => {
  const out = new Map<string, { episode: number; kind: AnnotationKind }[]>();
  for (const e of ENTRIES) for (const ep of e.value.episodes) { if (!out.has(e.seriesId)) out.set(e.seriesId, []); out.get(e.seriesId)!.push({ episode: ep, kind: e.value.kind }); }
  return out;
};
