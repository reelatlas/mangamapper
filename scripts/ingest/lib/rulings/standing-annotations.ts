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
        episodes: span(221, 281),
        kind: 'adopted',
        basis: 'community',
        note: 'Four anime-canon arcs between the Kawaki arc end (ep 220 → ch 55) and Code\'s Assault (287-293 = chs 56-67): Chunin Re-Exam, Kirigakure war, Kawaki Academy, Labyrinth (narutopedia + animefillerguide + cbr; research batch 11). BASIS RULED community (Sean, batch 18): the community and the manga-era story treat this stretch as having happened — a DIFFERENT basis from a staff credit. Kodachi\'s blanket supervision (eps 1-216) was REJECTED as an author basis for 2-105 / 120-209 because it also covers undisputed filler; this block is post-tenure and stands on consensus, not on that credit.',
      },
      {
        episodes: span(282, 286),
        kind: 'side_source',
        note: 'Adapts the licensed novel Sasuke Retsuden (ja-WP arc footnote ノベライズ『サスケ烈伝』を原作としてアニメ化; narutopedia arc page) — canon relative to a licensed side source, not adopted; no chapter mapping.',
      },
      {
        episodes: [...span(128, 136)],
        kind: 'adopted',
        basis: 'author',
        note: 'Time Slip: Kishimoto supplied the story himself for Naruto\'s 20th anniversary (ja-WP 岸本がアイデアを提供; narutopedia arc page; Kishimoto\'s own Sept-2019 comment via コミックナタリー / シネマトゥデイ). AFL-definitive types these filler — the adoption does not depend on the fan label.',
      },
      {
        episodes: [8, 9],
        kind: 'adopted',
        basis: 'author',
        note: 'Kodachi\'s own account: episodes 8 and 9 were one episode expanded into two "from Mr Kishimoto and I" (2017 post; en-WP repeats it). Single-source translation → medium.',
      },
      {
        episodes: [67, 68, 69],
        kind: 'adopted',
        basis: 'author',
        note: 'Chocho arc: based on Kishimoto\'s idea, with him providing dialogue (narutopedia; ja-WP 原作者である岸本斉史が原案を務めた) — the same credit type as Time Slip; repaired from stored filler for consistency.',
      },
      {
        episodes: [93, 94, 95],
        kind: 'side_source',
        note: 'Adapts the licensed novel 親子の日 (Parent and Child Day) — ja-WP arc footnote, same ノベライズ…を原作として form as Sasuke Retsuden.',
      },
      {
        episodes: [...span(106, 111)],
        kind: 'side_source',
        note: 'Steam Ninja Scrolls: adapts the licensed novel 湯煙忍法帖 (ja-WP arc footnote) — canon relative to a licensed side source.',
      },
      {
        episodes: [51, 52, 60],
        kind: 'divergence',
        note: 'Anime-original episodes (Urashiki; Sarada vs Araya) interleaved into the Versus Momoshiki arc that otherwise adapts chs 1-10 (verdict A).',
      },
    ],
    reason: 'Batch 18 (2026-08-26), verified R24, SEAN RULED: adoption follows a specific act by the source\'s author, never a blanket staff credit; licensed novels are side_source (Shippuden precedent); 221-281 community on a stated basis distinct from the rejected credit.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/verify/boruto.md', 'scripts/ingest/research/batch18/out/boruto-naruto-next-generations-A.json', 'scripts/ingest/research/batch18/out/boruto-naruto-next-generations-B.json', 'docs/restructure/T4-GLOSSARY.md §3'],
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
  {
    seriesId: 'fullmetal-alchemist',
    ruleId: 'T26',
    value: [
      { episodes: [11, 12], kind: 'side_source', note: "Adapts the light novel 'Fullmetal Alchemist: The Land of Sand' (鋼の錬金術師1 砂礫の大地), story by Makoto Inoue from Arakawa's original work, illustrations by Arakawa, Square Enix, published 2003-02-28 — a different licensed work in the same franchise, not the manga. en.wikipedia's light-novel list, citing Square Enix's own novel page, states the novel 'was used as the source material for episodes 11, 12 and part of 37'. Episode titles 砂礫の大地・前編 / ・後編 are the novel's title. No manga chapter is involved, so these rows take no chapter anchor." },
      { episodes: [37], kind: 'side_source', note: "Third segment adapts a Land of Sand novel story (The Phantom of Warehouse 13) alongside two Arakawa bonus chapters (Dog of the Military?, The Military Festival) — the same basis ep 13 is stored canon on." },
      { episodes: [8], kind: 'rearranged', chapters: "24", note: "Chapter 24 (vol 6, Mustang recruiting the Elrics / Ed receiving the name 'Fullmetal') is pulled forward out of serialized order and used as this episode's closing scene, 16 chapters ahead of its published position. FMA 2003 does this repeatedly in eps 1-9 because eps 3-9 are a restructured backstory block." },
      { episodes: [21], kind: 'graft', note: "Screenwriter Sho Aikawa is on record (FMA Wiki episode notes) as having expanded the manga's Laboratory 5 story by grafting Scar, Greed and Kimbley into it 'in order to engage viewers and set up future plotlines'. The Chapter 12-13 material is intact underneath; the grafted threads are what later carry the original half." },
      { episodes: [40, 41], kind: 'divergence', chapters: "30", note: "Chapter 30's Martel-dies-inside-Al scene is relocated into an anime-original context: in the manga it happens in the Devil's Nest tunnels immediately after Greed's capture and triggers Al recovering his memory of the Truth; in the 2003 anime it happens at a military outpost outside Reole, weeks later in story time, with Kimbley reinstated and Reole about to be destroyed, and Al does not see the Truth. Same beat, different continuity around it." },
      { episodes: [42, 43, 44, 45, 46, 47, 48, 49, 50, 51], kind: 'divergence', note: "Bones' original finale (Dante, the Gate, Munich) — no manga standing, FILLER as a type — but author-authorised as the 2003 series' own ending: Arakawa 「アニメ化の際、『マンガと違う独自の結末を』と注文した」 and compares it to the ending she has held since serialization began (Asahi Shimbun 2005-07-25); she attended meetings to advise but did not write for the series (Yahoo Books via en-WP); Aikawa's 2026-02-08 account of her NG list and Square Enix's presence at every script meeting. Guardrails and blessing, not adoption — the kinnikuman rule. Watch it as the 2003 line's own story; Brotherhood re-adapts the manga." },
      { episodes: [31, 35, 36, 38, 39], kind: 'divergence', note: "Anime-original connective tissue between manga-adapting rows (no chapter fields on fma.fandom) — filler, not the finale class." },
    ],
    reason: "Batch 18 (2026-08-26), verified R24, Sean ruled: provenance of FMA 2003's split lives here — novel rows as side_source, the finale as a cited divergence (never adopted{author}), connective filler noted so the UI can tell the two filler reasons apart.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/fullmetal-alchemist.json", "scripts/ingest/research/batch18/verify/fullmetal-alchemist.md", "https://web.archive.org/web/20050728025135/http://www.asahi.com/culture/theater/TKY200507250335.html"],
  },
  {
    seriesId: 'dragon-ball-super',
    ruleId: 'T26',
    value: [
      { episodes: [79, 80, 81], kind: 'divergence', note: "Substitution, not omission: the Zeno Expo exists in the source (manga ch. 28-29) but as a twelve-God-of-Destruction battle royal that the Grand Minister cancels, followed by one Goku vs Top match Top wins by ring-out. The anime replaces it with three Universe 7 vs Universe 9 matches against the Trio of Danger. Recording this so the block is not mistaken for material the source simply skipped." },
      { episodes: [78], kind: 'rearranged', chapters: "28", note: "The manga announces the tournament in ch 28 (same position as the anime); only the detailed rules are deferred to ch 30 — the anime front-loads the erasure stipulation. chapters '28 (partial)' (verifier: ch 30 pairs with eps 82-83, not 78)." },
      { episodes: [91], kind: 'partial', chapters: "31", note: "Only the closing scene (Buu's hibernation, manga ch. 31) has source standing; roughly nineteen minutes of the episode are anime-original recruitment vignettes across Universes 2, 6, 9, 10 and 11." },
      { episodes: [94, 95], kind: 'divergence', chapters: "32", note: "The anime dramatises as a two-part assassination plot an event the source states in one clause: in manga ch. 32 Goku and Frieza simply turn up at Capsule Corporation 'battered and bruised from a battle' and Piccolo hands them Senzu Beans. Universes 4 and 9 never move against Universe 7 in the manga and the Universe 9 assassins do not exist there. Ruled mixed on the same standard as ep 91 (one restaged ch-32 scene each; fandom infobox Manga = ch 32)." },
    ],
    reason: "Batch 18 (2026-08-26), verified R24, Sean ruled: the Toei-original episodes' relation to Toriyama's outline and Toyotarou's manga, per row.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/dragon-ball-super.json", "scripts/ingest/research/batch18/verify/dragon-ball-super.md"],
  },
  {
    seriesId: 'soul-eater',
    ruleId: 'T26',
    value: [
      { episodes: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51], kind: 'divergence', note: "Divergence point established: ep 38 is the last row that adapts chapters (ch 38-39, partial — already stored). From ep 39 the anime runs its own story to its own ending. en.wikipedia: 'After episode 38, the anime deviated from the manga it was based on which lead to an anime original ending not found in the source material.' ja.wikipedia: 「第36話までは原作の展開を踏襲していたが、原作への追いつきに伴い第37話以降はアニメオリジナルストーリーとして独自の物語で完結した」. The two disagree by two rows (37, 38) because ep 38 still carries the Black☆Star-vs-Kid duel from ch 39; the finer fandom chapter-side index resolves it in favour of 'ep 38 last, ep 39 first diverged'. CONTINUE-READ CONSEQUENCE: the manga's Clown arc (ch 41-44) was never adapted in any form, so the correct post-series reading position for Soul Eater is CHAPTER 40, not a chapter derived from eps 39-51." },
      { episodes: [39], kind: 'partial', chapters: "40", note: "Only the opening scene of ch 40 (Eruka orders Crona back to Medusa) survives into the episode; the chapter's substance and outcome do not. Do not treat this row as covering ch 40." },
      { episodes: [40], kind: 'graft', chapters: "44-45", note: "ch 45's Medusa-arrival/deal scene lifted out of order into an otherwise original episode, with ch 41-43 skipped entirely (ch 44's tail — Medusa's Brew deal — is also lifted; fandom ch 44 differences + en-WP vol 11). An out-of-sequence graft, not a reading position — the row must not advance continue-read past ch 40." },
      { episodes: [42, 46, 47], kind: 'loose_parallel', chapters: "45-60", note: "Reworks recognisable beats of the manga's Operation Capture Baba Yaga Castle arc (ch 45-60) — the assault on Baba Yaga Castle in the Amazon (ch 46-48) and the Black☆Star vs Mifune duel (ch 49, 56-57) — with different causes, participants and outcomes, and without adapting the chapters (ch 46/47/48 are marked 'anime correspondent: None'). In the manga Black☆Star kills Mifune; in the anime he spares him and Mifune joins the DWMA. The wiki's stray 'ch 49 → Episode 47' infobox value has no supporting prose and was not treated as an adaptation claim." },
      { episodes: [43], kind: 'loose_parallel', chapters: "41-43", note: "Uses the manga's Clown concept (ch 41-43, 'The Clown') but nothing of its story: in the manga Maka fights a madness-born clown in a demonic factory, in the anime Kid fights two mechanical Clowns guarding the last magic tool in the town of Sarcophagus. souleater.fandom's Chapter 41 page: 'Although a version of The Clown would appear in the Soul Eater anime, this chapter's story is original to the manga.'" },
      { episodes: [45], kind: 'loose_parallel', note: "Relocates two manga elements into an original scene: Maka's anti-magic Genie Hunter (Majin-gari, used against Arachne late in the manga's Baba Yaga arc) and Medusa's death (dealt by Crona far later in the manga). Here Maka's Genie Hunter kills Medusa — an outcome the manga never has." },
    ],
    reason: "Batch 18 (2026-08-26), verified R24, Sean ruled: Bones' ending is the A-7 class (no Ohkubo credit) — filler + divergence; the two grafted rows are mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/soul-eater.json", "scripts/ingest/research/batch18/verify/soul-eater.md"],
  },
  {
    seriesId: 'outlaw-star',
    ruleId: 'T26',
    value: [
      { episodes: [1, 2], kind: 'divergence', chapters: "vol 1 (ch 1-4)", note: "Same opening events, different execution: the manga's ch 1 antagonist (Wraith, revived as a cyborg, with the Liberty Bell gang) is replaced by Death Rob; Hilda's manga arc keeps her on Sentinel III to her death while the anime sends her to space at the end of ep 2. ja.wikipedia: the anime and manga differ in characterisation and in how the XGP-15A2 is obtained, and Ito said during serialization that the two versions would greatly change the developments along the way while landing on the same final scene (Animage 1997-06, pp.17-18). Recorded as the sibling manga's overlap with the anime (the series is ruled a studio original, SOURCE_TYPE_OVERRIDES); A40/G3: no chapter mapping is meaningful here." },
    ],
    reason: "Batch 18 (2026-08-26), verified R24, Sean ruled the series original (co-primary media-mix); the manga overlap survives as trivia, never as an anchor.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/outlaw-star.json", "scripts/ingest/research/batch18/verify/outlaw-star.md", "https://www.sunrise-world.net/titles/pickup_094.php"],
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
