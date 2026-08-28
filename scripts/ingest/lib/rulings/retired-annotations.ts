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
    seriesId: 'shugo-chara',
    ruleId: 'A45',
    value: { episodes: [74], kind: 'rearranged' },
    reason:
      "The batch-17 'rearranged {28-28 after 29}' fact (stored on old row 76, re-keyed to 74 by the N11 resort 2026-08-27) was a NUMBERING artefact, not an anime reorder: AFL had transposed its 75/76, so White Day (ch 28) appeared to follow Utau's visit (ch 29). In true numbering 74 = White Day = ch 28 precedes 75 = ch 29 — the stored anchors are monotone (74 → 28, 75 → 29, 76 → 30). The verifier (batch 20 wave 3) named it; retired at the deep (P23).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/airdates/shugo-chara.json', 'scripts/ingest/research/batch20/verify/shugo-chara.md', 'docs/changelog.md §12.82'],
  },
  {
    seriesId: 'shugo-chara',
    ruleId: 'A45',
    value: { episodes: [91, 92], kind: 'divergence' },
    reason: "Batch 20 wave 4 (verified R24, Sean ruled 2026-08-28): rows 91/92 leave the anime-original block's divergence {none} fact — 91 carries ch 34's Rhythm-hatch pages as a transplanted beat (graft {34}), 92 (titled Beat Jumper) opens with Rhythm already born (loose_parallel {34}); the block's fact is re-stated on 82-90 + 93-96 with the corrected wording ('inside the ch 32 split').",
    ruledBy: 'Sean', ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/shugo-chara.json', 'scripts/ingest/research/batch20/verify/shugo-chara-w4.md'],
  },
  {
    seriesId: 'shugo-chara',
    ruleId: 'A45',
    value: { episodes: [92], kind: 'graft' },
    reason: "Batch 20 wave 4 (verified R24, Sean ruled 2026-08-28): the batch-17 graft {34} sat on the episode TITLED Beat Jumper (old row 93, re-keyed to 92 by the resort); the debut is ep 91 (Pony Canyon / Bandai 第91話; the fandom's Rhythm page) — the graft moves to 91, ep 92 becomes loose_parallel {34}. Ep 98's graft {34} stays.",
    ruledBy: 'Sean', ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/shugo-chara.json', 'scripts/ingest/research/batch20/verify/shugo-chara-w4.md'],
  },
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
  // ---- batch 19 wave 2 (2026-08-27; verified R24; Sean ruled)
  {
    seriesId: 'kinnikuman',
    ruleId: 'A45',
    value: { episodes: [32, 46], kind: 'rearranged' },
    reason:
      "The batch-17 'eps 32,46 rearranged {96-118}: the 21st Chojin Olympics is reordered — Warsman debuts ep 32A vs manga ch 107' was refuted on two independent sources: kinnikuman.fandom's Warsman page (ch 94 USSR contestant; 96 the pachinko bracket; 97 the Screw Driver kill on Teapackman; 107 only the first MENTION of his computer) and ja-WP ウォーズマン (初登場 = ch 94; 第8巻 p.23 = ch 96, p.177 = ch 107), plus dアニメストア's per-episode synopses. The block runs in publication order, EXPANDED (26 chapters over 21 episodes) — replaced by abridged{95-120} with the verified checkpoints (minus the disputed 35=101) on the same rows.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/kinnikuman.json', 'scripts/ingest/research/batch19/verify/b5a-conan-eyeshield-kinnikuman.md'],
  },
  {
    seriesId: 'eyeshield-21',
    ruleId: 'A45',
    value: { episodes: [59, 62], kind: 'rearranged' },
    reason:
      "The batch-17 'eps 59,62 rearranged {120-121}: High Wave (ch 120) not revealed until ep 62' was refuted by Bandai Channel's official synopses: ep 59 unveils the High Wave (『ハイ・ウェーブ』 with 大平・大西 joining 筧) and takes its title from ch 121; ep 62 unveils the ULTIMATE 'POSEIDON' formation = ch 124 我の名はポセイドン (18 seconds left). en-WP's fan summary called the Poseidon Formation 'High Wave' (the four-linebacker variant — eyeshield21.fandom High_Wave) — the conflation the stored fact rested on. The Kyoshin game runs strictly forward: abridged{116-126} on 58-63.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/eyeshield-21.json', 'scripts/ingest/research/batch19/verify/b5a-conan-eyeshield-kinnikuman.md', 'https://www.b-ch.com/titles/8777/059', 'https://www.b-ch.com/titles/8777/062'],
  },
  {
    seriesId: 'tokyo-mew-mew',
    ruleId: 'A45',
    value: { episodes: [25, 26, 27], kind: 'partial' },
    reason:
      "The batch-17 zone fact 'eps 25,26,27 partial {13-16}: volume 4's internal ch 14 / 15 / 16 split could not be pinned' is SUPERSEDED — the split is pinned by chapter TITLES (en-WP's ChapterList: 14 'Kiss and Tell', 15 'Tokyo Tower Tales', 16 'Young Love'; tokyomewmew.fandom's vol-4 'Chapters included') laid against the volume's four-beat summary → per-episode anchors 25 → 14, 26 → 15, 27 → 16 (rearranged, the A41 settled reorder). A zone annotation next to exact anchors would assert the split is unknown.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/tokyo-mew-mew.json', 'scripts/ingest/research/batch19/verify/b5b-x-seiya-mewmew.md'],
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
