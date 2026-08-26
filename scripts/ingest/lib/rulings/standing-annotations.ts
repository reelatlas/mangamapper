// STANDING ANNOTATIONS — the ruled override annotations (rule T26, T4.3
// 2026-08-26). Every row here USED to be typed 'anime-only-canon'; under the
// three-standing model the row is canon or filler relative to the source and
// the exception is an annotation:
//   adopted     — ruled canon though outside the source; basis REQUIRED
//   side_source — adapts a work other than the series' source (named in note)
//   retconned   — later dropped from canon
//   divergence  — the A-7 studio-ending class: filler + asterisk, on Sean's
//                 review list (T4-GLOSSARY §7), never a quiet demotion
// Asserted over standing rows by assert-overrides.ts through upsertAnnotation
// (idempotent); the asterisk_unreviewed census class is the review queue.
// `basis` marked PROVISIONAL is inferred from the existing reason and is
// open for Sean at batch 18 (T4-GLOSSARY §7).
import type { AdoptedBasis, AnnotationKind } from '../annotations';
import type { RulingEntry } from './types';

export type StandingAnnotation = {
  episodes: number[];
  kind: AnnotationKind;
  basis?: AdoptedBasis;
  chapters?: string;
  note: string;
};

const span = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const ENTRIES: RulingEntry<StandingAnnotation[]>[] = [
  {
    seriesId: 'black-clover',
    ruleId: 'T26',
    value: [
      {
        episodes: [130, 132, 133, ...span(136, 141), ...span(150, 157)],
        kind: 'adopted',
        basis: 'author',
        note: 'Tabata-supervised side stories adapting zero manga chapters (blackclover.fandom + animefillerguide + animefillerlist; research batch 8); canon by the author\'s supervision, no chapter mapping by design — position holds at ch 228 until ep 158.',
      },
    ],
    reason: 'T4.0 D-10: the author-supervised class is canon + adopted{author}, never a fourth type. Basis AUTHOR is explicit in the batch-8 ruling.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §3', 'scripts/ingest/lib/rulings/episode-types.ts black-clover'],
  },
  {
    seriesId: 'boruto-naruto-next-generations',
    ruleId: 'T26',
    value: [
      {
        episodes: span(221, 286),
        kind: 'adopted',
        basis: 'community',
        note: 'Five anime-canon arcs between the Kawaki arc end (ep 220 → ch 55) and Code\'s Assault (287-293 = chs 56-67): Chunin Re-Exam, Kirigakure war, Kawaki Academy, Labyrinth, Sasuke Retsuden (narutopedia + animefillerguide + cbr; research batch 11). basis PROVISIONAL (community consensus canon) — open for Sean, T4-GLOSSARY §7.',
      },
    ],
    reason: 'T4.0 D-10 ruled consensus rows → canon + adopted. The basis is inferred (community-accepted anime canon; Sasuke Retsuden adapts a licensed novel) and listed for Sean.',
    ruledBy: 'session',
    retiresWhen: 'batch-18: Sean rules the adopted.basis (T4-GLOSSARY §7) — the basis here is INFERRED, not signed',
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §3', 'scripts/ingest/lib/rulings/episode-types.ts boruto'],
  },
  {
    seriesId: 'rurouni-kenshin-2023',
    ruleId: 'T26',
    value: [{ episodes: [34], kind: 'adopted', basis: 'author', note: 'Watsuki\'s own exhibition storyboard, adapted with zero chapters — canon-grade by the author\'s hand (batch-17 verdict).' }],
    reason: 'T4.0 D-10: kenshin-2023 34 (Watsuki\'s own storyboard) → canon + adopted{author}.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §3'],
  },
  {
    seriesId: 'beastars',
    ruleId: 'T26',
    value: [{ episodes: [44], kind: 'adopted', basis: 'studio', note: 'Adapts no chapter (chs 169-171 are the cut Kyuu chapters, 172-176 land in ep 47); SEAN-RULED canon 2026-08-24 on positive evidence. basis PROVISIONAL (the studio\'s own bridge, accepted) — open for Sean, T4-GLOSSARY §7.' }],
    reason: 'T4.0 D-10: beastars 44 (Sean) → canon + adopted; basis inferred and listed.',
    ruledBy: 'session',
    retiresWhen: 'batch-18: Sean rules the adopted.basis (T4-GLOSSARY §7) — the basis here is INFERRED, not signed',
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §3', 'scripts/ingest/lib/rulings/episode-types.ts beastars'],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T26',
    value: [{ episodes: [452, 453, 454, 456, 457], kind: 'side_source', note: 'Adapts the Itachi Shinden NOVEL (Takashi Yano), zero manga pages — Narutopedia + AFG + Wikipedia S20. Canon relative to the franchise\'s licensed side source; the series\' own source stays the manga, so no chapter mapping.' }],
    reason: 'T4.0 D-10: Shippuden 452-457 adapt a licensed novel → canon + side_source naming the work; ep 455 stays mixed (disputed ch-678 frame).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §3', 'scripts/ingest/lib/rulings/episode-types.ts naruto-shippuden'],
  },
  {
    seriesId: 'world-trigger',
    ruleId: 'T26',
    value: [
      { episodes: span(49, 63), kind: 'retconned', note: 'The Fugitive Arc — anime-original, RETCONNED by Season 2, which resumes from the manga as if it never happened.' },
      { episodes: [48], kind: 'divergence', note: 'A-7 studio-original breather inside the canon arc — filler under T27; on the review list.' },
    ],
    reason: 'T4.0 D-10 names world-trigger 49-63 as the retconned class; 48 is the A-7 review item.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §3'],
  },
  // ---- the A-7 studio-ending class: filler + asterisk, ON THE REVIEW LIST
  ...(
    [
      ['claymore', span(24, 26), 'Madhouse outran the manga and wrote its own ending (AFG + wheredoestheanimeleaveoff + sportskeeda).'],
      ['gto-great-teacher-onizuka', [...span(22, 28), 34, 42, 43], 'Anime-original mid-series block (22-28, 34) and the original ending 42-43 after the anime caught the manga (fandom infoboxes N/A; mangashed; wheredoestheanimeleaveoff).'],
      ['ajin-demi-human', span(14, 26), 'Season 2 is anime-original from the start with a non-canon ending; canon resumes at manga ch 22 (WDTALO + mangashed).'],
      ['chrono-crusade', span(22, 24), 'The anime\'s original ending after departing the manga at ep 13 (Wikipedia lead + MU + ja-WP).'],
      ['sailor-moon', span(167, 172), 'The Nehelenia-revival arc: an anime-original continuation of SuperS\'s villain.'],
      ['a-certain-scientific-railgun', [13, ...span(15, 24), ...span(41, 48)], 'S1\'s back half (Big Spider / Poltergeist) and S\'s Silent Party are anime-original, director-confirmed; ep 14 excepted (grafts ch 17).'],
      ['twin-star-exorcists', span(21, 50), 'The anime\'s own serialized finale that never returns to the manga and contradicts it (Yuto dies here, survives there) — studio ending, NOT author consensus; explicitly a review item, not a quiet demotion (T4-GLOSSARY §3/§7).'],
    ] as [string, number[], string][]
  ).map(([seriesId, episodes, why]) => ({
    seriesId,
    ruleId: 'T26',
    value: [{ episodes, kind: 'divergence' as AnnotationKind, note: `A-7 studio-ending class — filler under T27 (adheres to no source) + asterisk; on Sean's batch-18 review list (adopted{studio} or filler). ${why}` }],
    reason: 'T4.0 D-10: the A-7 studio-ending class → filler + asterisk, ON THE REVIEW LIST (T4-GLOSSARY §3 / §7).',
    ruledBy: 'Sean' as const,
    ruledOn: '2026-08-26',
    cite: ['docs/restructure/T4-GLOSSARY.md §3', 'docs/restructure/DRIFT-LIST.md A-7'],
  })),
];

export const STANDING_ANNOTATIONS: Record<string, StandingAnnotation[]> = Object.fromEntries(ENTRIES.map((e) => [e.seriesId, e.value]));
