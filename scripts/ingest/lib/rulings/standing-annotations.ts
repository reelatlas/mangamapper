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
    value: [{ episodes: [44], kind: 'adopted', basis: 'studio', note: 'Adapts no chapter (chs 169-171 are the cut Kyuu chapters, 172-176 land in ep 47); Sean ruled canon 2026-08-24 on positive evidence. BASIS RULED studio (batch 18 wave 3): Orange\'s own bridge, carried forward by eps 45-48 (manhunt; Gosha/Haru → ep 45\'s ch-189 graft; the deferred kiss → the ep-48 finale). Author fails three staff lists — Itagaki holds a bare 原作 credit, told the staff 「本当に自由にやってください」 and calls the anime 「また別の『BEASTARS』」 (Animate Times 2021-01-06); incorporation is time-barred (the manga ended 2020-10-08); community fails structurally (the source has an ending and eps 47-48 adapt it).' }],
    reason: 'Batch 18 wave 3 (2026-08-26), Sean ruled: beastars 44 canon + adopted{studio} — the provisional marker lifts.',
    ruledBy: 'Sean',
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
      { episodes: [48], kind: 'side_story', note: 'Self-contained anime-original interlude inside the B-Rank Wars arc (no chapter fields on fandom for 48-63; ep 47 closes on ch 103, ep 64 opens on ch 104); NOT part of the Fugitive Arc retcon (four sources bound it at 49-63). Batch 18 wave 2: filler confirmed, no adoption; side_story replaces divergence — it alters no manga event.' },
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
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'T26',
    value: [
      { episodes: [20, 21, 22, 23, 24], kind: 'adopted', basis: "author", note: "Poltergeist arc. BASIS = INCORPORATION (Sean's batch-18 class ruling): the source's author wrote the arc's events into the source line — Railgun manga ch 31 names Haruue Erii and ch 32 shows the photo on Mikoto's phone 'taken in episode 20' (chapter body, not cover); Kamachi's Souyaku v7 ch2 has Therestina in prison (the S1 ep-24 outcome); the 2022 Railgun novel has Saten regretting she let Haruue / Edasaki / Janie / Febrie go. HIGH. ja-WP's '2クール目は原作者・鎌池和馬の監修下' sentence is UNCITED — corroboration only, never the basis." },
      { episodes: [17, 18, 19], kind: 'adopted', basis: "author", note: "Poltergeist arc: Haruue's existence and transfer presupposed by manga ch 31/32 and the 2022 novel — incorporation basis, MEDIUM (the ep-20 event anchors the class; these rows carry its setup)." },
      { episodes: [15, 16], kind: 'adopted', basis: "author", note: "Big Spider arc: Kamachi's Item LN v1 ch2 winks at the arc's twist ('You thought Big Spider was led by a guy called Kurozuma? ...'), presupposing the arc happened. Incorporation basis, MEDIUM-LOW — one oblique line." },
      { episodes: [42, 43, 44, 45, 46, 47, 48], kind: 'adopted', basis: "author", note: "Silent Party arc: the 2022 Railgun novel (Kamachi's own prose) has Saten say 'I'd even take Janie or Febrie's help right now! Oh, I never should have let them go!' — presupposing the arc's ENDING (Haruue moved, Febrie and Janie left with Nunotaba). MEDIUM: a single referback, readable as a fourth-wall joke; the Silent Party fandom page makes no canon claim. Souyaku v7's Therestina supports Poltergeist only. Sean's fallback if rejected: 42-45/48 filler, 46-47 filler + graft." },
      { episodes: [13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 41, 42, 43, 44, 45, 46, 47, 48], kind: 'divergence', note: "Anime-original arcs (Big Spider / Poltergeist in S1's second cour; Silent Party in S): director-confirmed original material that departs from the manga's timeline — Kongou is present months before her manga debut (ch 40); Kiyama's revived Child Errors never reappear in the manga. Ruled canon + adopted{author} by INCORPORATION (batch 18 wave 2), except 13 (filler, outside every arc) and 41 (mixed)." },
      { episodes: [41], kind: 'graft', chapters: "39 special, 40 (rat scene), vol-5 omake", note: "zone-acknowledged — anchor-hostile: a gag special and a single scene do not advance the reading position. Refines the stored graft {39.5, 40}: confirmed and extended. The episode carries (a) material from the vol-7 special chapter after ch 39, 'The Iron Bridge is a Sign of Love' (its chapter page lists Adapted To = Railgun S eps 16 AND 17), (b) ch 40's rat-buying scene ('slightly altered' per the ch-40 page), and (c) a volume-5 omake 4-koma staged as the Kuroko/Frenda argument over whose Level 5 acquaintance is better. Graft, not anchor." },
      { episodes: [46], kind: 'graft', chapters: "43 (Item pool scene only)", note: "Stored graft {43} re-verified from both sides: ep 46 (S #22 'STUDY') borrows only the Item swimming-pool scene from manga ch 43 'Negotiation' (ch 43 page: Adapted To = Railgun S ep 22, 'Item pool scene only, though slightly altered'). Ch 43 is properly adapted at ep 49; no anchor here." },
      { episodes: [47], kind: 'graft', chapters: "44 (Aoki scene only)", note: "Stored graft {44} re-verified from both sides: ep 47 (S #23 'Silent Party') borrows a single scene from manga ch 44 'Opening' (ch 44 page: Adapted To = Railgun S ep 23, 'Aoki scene only'). Ch 44 is properly adapted at ep 50; no anchor here." },
    ],
    reason: "Batch 18 wave 2 (2026-08-26), verified R24, SEAN RULED THE CLASS: incorporating an arc's EVENTS/OUTCOMES into the source line adopts (T26 author basis); importing names/designs does not (Twin Star). Gradient recorded per block. The ep-20 cover-art 'graft' proposed by the verdict is DROPPED (artwork is not source material). 41 mixed under T28 (adapts a whole special chapter).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/a-certain-scientific-railgun.json", "scripts/ingest/research/batch18/verify/a-certain-scientific-railgun.md", "https://toarumajutsunoindex.fandom.com/wiki/Toaru_Kagaku_no_Railgun_Manga_Chapter_032", "https://www.baka-tsuki.org/project/index.php?title=Toaru_Majutsu_no_Index:Railgun_Chapter2"],
  },
  {
    seriesId: 'sailor-moon',
    ruleId: 'T26',
    value: [
      { episodes: [167], kind: 'rearranged', chapters: "38, 44", note: "zone-acknowledged — no anchor by design: Acts 38/44 sit behind ep 166's Act 49 and an anchor would run position backwards. Deferred manga content, not new content. The tail of Act 38 (high-school entry; Chibiusa packing for the 30th century, her departure aborted by the new threat; the Outers taking in infant Hotaru) and the opening of Act 44 (the Outers' household, Hotaru's abnormal growth and her vision of the Moon devoured by darkness, her power-up of Uranus/Neptune/Pluto) land here because SuperS dropped the Outer Guardians wholesale. sailormoon.fandom's episode page states 'This episode is based on part of Act 38'; the Super-form and Sailor-Crystal bullets in the same section are Act 44 material." },
      { episodes: [168], kind: 'rearranged', chapters: "44, 48-49", note: "zone-acknowledged — no anchor by design (see 167). Act 44's core (Sailor Saturn's spirit re-awakens Hotaru, returns her past-life memories and ages her; Super Sailor Saturn's debut; the ten guardians uniting) plus the Act 48-49 Eternal beat (the nine pour their power into Sailor Moon; Eternal Moon Article, Eternal Tiare, Eternal Sailor Moon and Starlight Honeymoon Therapy Kiss all debut). sailormoon.fandom: 'Half of this episode is based on Act 44 of the manga'. ja.wikipedia dates each Eternal item/form to 原作第4部 (Dream) and to the anime's 『スターズ』, confirming the relocation across the SuperS/Stars seam." },
      { episodes: [170, 171, 172], kind: 'loose_parallel', chapters: "45, 47", note: "Element-level carryover only — recorded so it is not mistaken for adaptation. The guardians sealed inside mirror shards and later freed (manga Acts 45 and 47, where Zirconia traps Saturn and Chibi Moon and Sailor Moon frees them), Saturn's Silence Wall and Silence Glaive Surprise (both debut in manga Act 45; ja.wikipedia dates both to 原作第4部 and 初代テレビアニメ『スターズ』), and Chibi Moon fading from existence because Mamoru is lost (an idea from the manga's Stars arc, where Chibiusa ceases to exist after Galaxia kills Mamoru) are re-used inside a scenario with no manga counterpart. No manga act is adapted in 169-172; these rows stay filler. (verifier: the Chibiusa-fades beat is the Cauldron endgame, ~Acts 57-59, not 50-51.)" },
    ],
    reason: "Batch 18 wave 2 (2026-08-26), verified R24, Sean ruled: 167-168 mixed — half of 168 is Act 44 (Saturn re-awakens Hotaru; the Eternal debut) and 167 carries Act 38's tail + Act 44's opening (never adapted in SuperS); 169-172 filler; no adoption (Takeuchi: 原作/原案 + GAME 監修 only, documented friction). No anchors — they would run position backwards from ep 166.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/sailor-moon.json", "scripts/ingest/research/batch18/verify/sailor-moon.md"],
  },
  {
    seriesId: 'claymore',
    ruleId: 'T26',
    value: [
      { episodes: [24], kind: 'partial', chapters: "60 (opening section)", note: "Scene 60 is split and never completed in place: its opening (Rigaldo's corpse, Clare's plea to Helen, Deneve taking Undine's sword) is here, its closing (Jean's sacrifice, Clare restored, Jean dead) is displaced to ep 26 in an invented setting, and its middle (Jean stopping Helen; the Northern Army closing in for the last stand) is dropped. T28: the opening section of Scene 60 before the studio ending takes over — filler + partial, not mixed (consensus block)." },
      { episodes: [26], kind: 'graft', chapters: "60 (Jean’s sacrifice, transplanted)", note: "Scene 60's Jean-sacrifice beat is grafted out of sequence into the anime-original volcano finale: Jean is impaled on Clare's mandibles and spends her life realigning Clare's yoki to pull her back from awakening, exactly as in ch 60, but two episodes later, in a location and with a trigger (Raki) that do not exist in the manga." },
      { episodes: [21], kind: 'divergence', chapters: "57", note: "Adapts Scene 57 section by section (five kills, Rigaldo's awakening); the Raki/Isley/Priscilla B-plot is the anime's own. Narrowed from the batch-15 loose_parallel {57-59} (verified R24). Frontier consequence (ep 23 → ch 59?) is a separate C/A ruling." },
      { episodes: [22], kind: 'divergence', chapters: "58", note: "Adapts Scene 58 (Miria pierced, Clare's charge, the arm); B-plot original. Narrowed from loose_parallel {57-59}." },
      { episodes: [23], kind: 'divergence', chapters: "59", note: "Adapts Scene 59 (Helen severs the arm, Clare's claw, Rigaldo shredded); Raki's entrance is the anime's own. Narrowed from loose_parallel {57-59}." },
    ],
    reason: "Batch 18 wave 2 (2026-08-26), verified R24, Sean ruled under T28: 24-26 stay FILLER (the community's 'completely non-canon' block holds; the two Scene-60 fragments are recorded as partial/graft, never as mixed); no adoption (Yagi 原作 only, NTV archived staff page). The 'Madhouse outran the manga' premise is false — 13 chapters were unadapted.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/claymore.json", "scripts/ingest/research/batch18/verify/claymore.md"],
  },
  {
    seriesId: 'gto-great-teacher-onizuka',
    ruleId: 'T26',
    value: [
      { episodes: [27], kind: 'side_story', chapters: "GTO (Great Toroko Oppai) Scenes 1-7 (vols 11-12)", note: "Adapts the GTO (ぐれえと・とろこ・おっぱい) / 'Great Toroko Oppai' side story - Scene 1 日本一のアイドル, Scene 2 マネージャーブギ, Scene 3 明日のための\"その1\", Scene 4 事務所がない!, Scene 5 ヘア出し一番搾り, Scene 6 あの娘のスキャンダル!, Scene 7 明日のために.. - with Onizuka taking manga manager Munakata's role. The Scenes are part of the source work (Kodansha's Comic Days serialization carries them; collected in GTO vols 11-12) but carry NO Lesson number." },
      { episodes: [27], kind: 'graft', note: "POSITION WARNING - do not anchor and do not advance the reader. In Kodansha reading order the Scenes sit AFTER Lesson 92 (Scenes 1-3) and AFTER Lesson 97 (Scenes 4-7), while eps 29-33 immediately afterwards go back and adapt Lessons 75-92. Ep 27 therefore grafts material from ahead of its own position, exactly like the stored ep-40 ch-107 graft." },
      { episodes: [25, 26], kind: 'loose_parallel', note: "Imports Kadena Nao (嘉手納南風) and her brother from Fujisawa's own prequel manga Shonan Junai Gumi! (ch 229 / 241) into the manga nurse Naoko Moritaka's slot, reusing her Queen-of-Hakosuka / Last Signal past and the brother's racing accident, but telling a new story that ja.wikipedia says contradicts SJG continuity (in the anime she has never met Onizuka)." },
      { episodes: [34], kind: 'loose_parallel', note: "Reuses only the celebrity hidden-camera-prank twist from the Great Toroko Oppai scene that follows Lesson 97, recast onto Onizuka/Saejima/gold/yakuza; 'rehashed into something completely different whilst using a similar event'." },
      { episodes: [22], kind: 'divergence', note: "Substitutes an original two-episode Hakuba arc for manga Lesson 71 とっておきの場所; ep 21 carries Lesson 70, Lesson 71 itself is never adapted (chapter hole between the stored ep21->70 and ep35->72 anchors). (The fan blog's own CH 70-71 / EP 21-22 heading is a story-unit grouping, not an adaptation claim — Lesson 71 is unadapted.)" },
      { episodes: [24], kind: 'divergence', note: "Anime-first: the manga's own Uchiyamada mid-life/daughter chapter is Lesson 143 中年ペイシェンス (vol 18, 2000-12-15), serialized after this episode aired 2000-03-05. Not an adaptation in either direction on the evidence available." },
      { episodes: [28], kind: 'divergence', note: "Replaces the side story's Munakata press campaign with an original rigged beauty contest (MGPC) plus an MMR マガジンミステリー調査班 crossover; rival Hoshino Megumi is anime-only." },
    ],
    reason: "Batch 18 wave 2 (2026-08-26), verified R24, Sean ruled: ep 27 MIXED — it adapts the Toroko Oppai side story Fujisawa serialized INSIDE GTO (Comic Days feed: Scenes 1-3 between Lesson 92/93, 4-7 between 97/98) — the side story IS the source (T28: an omake that is the episode's plot counts), never side_source; no anchor (Scenes have no Lesson number). 25-26 filler + loose_parallel (a character loan from Shonan Junai Gumi, not an adaptation; re-open if SJG proves to contain an Eikichi-vs-Kadena race). 22/23/24/28/34/42-43 filler; no adoption (Fujisawa 原作 + a voice cameo).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/gto-great-teacher-onizuka.json", "scripts/ingest/research/batch18/verify/gto.md", "https://comic-days.com/atom/series/10834108156636906135"],
  },
  {
    seriesId: 'ajin-demi-human',
    ruleId: 'T26',
    value: [
      { episodes: [23, 24, 25, 26], kind: 'divergence', note: "The genuine studio ending: the SDF seizure, the VX missiles and the tunnel burial have no manga counterpart; the manga's own final wave (Iruma base, F-15, the Flood) is ch 58-85, serialised 2018-2021. No Sakurai credit beyond 原作 (Polygon Pictures page, ja-WP staff) → filler, the A-7 class." },
      { episodes: [14, 15, 16, 17, 19, 21, 22], kind: 'divergence', note: "Season-wide, systematic divergence inside otherwise adapted episodes. The single biggest change is a renaming rather than a replacement: ja.wikipedia's plot summary states that the second-wave ambush target is 'フォージ安全の甲斐と李' in the manga and '武蔵重工の橋口' in the anime, and Kai and Li are written off in a news report at ep 17 (原作 9巻41話). Other systematic changes, all sourced from ja.wikipedia's per-character 原作/アニメ版 tables: the hit list carries 15 numbered names killed in order instead of 11 unnumbered ones (5巻23話); Tosaki is removed from the list; Wakai's death (7巻29話) is moved forward to ep 14 and Kishi's (5巻24話) to ep 16; the Health Minister is killed at ep 20 where the manga's ryotei ambush leaves him alive; the Anti-Ajin Special Force is legalised and deployed at eps 20-22 where the manga withholds it until the final wave ; Tosaki's fiancee Ai never dies (manga 10巻45話); Sato acquires 10+ extra anime-original Ajin followers (第2期21話)." },
      { episodes: [15], kind: 'graft', chapters: "23 (Kazuo Sakurai)", note: "The airliner assassination re-uses manga material the anime had skipped: ja.wikipedia's 桜井和夫 entry notes that the method of smuggling the weapon aboard and the cabin conversation 'は、原作の第1ウェーブのグラント製薬への旅客機墜落テロの時と一部同じ描写がされている' — i.e. the manga's first-wave airliner attack on Grant Pharmaceutical (ch 19-20), which S1 ep 11 had replaced with a collapsing building (ja.wikipedia plot footnote, 第1期11話). AllYourAnime independently: 'aspects of his terrorist activity have been adapted from earlier chapters of the manga, specifically the plane terrorist attack that the show replaced with the bombing in the 1st season.'" },
      { episodes: [16, 17, 19], kind: 'rearranged', chapters: "28 before 27/27.5", note: "The anime adapts ch 28 (Kotobuki and Kaito in juvenile hall) BEFORE ch 27/27.5 (Shimomura's origin): ep 16 pulls ch 28's opening forward, ep 17 adapts ch 28's body, and only ep 19 doubles back for ch 27/27.5. AllYourAnime states it twice — 'the anime skips a couple flashback chapters for Shimomura' (ep 16 article) and 'this means the anime jumps over chapters 27 and 27.5. Instead we open with content from Chapter 28' (ep 17 article), then 'it does utilize a few chapters that were initially skipped over' (ep 19 article). Ordering matters for anchors: the covered set across eps 16-19 is 26, 28, 27, 27.5, not a monotone run." },
      { episodes: [19], kind: 'abridged', chapters: "27, 27.5", note: "Ch 27/27.5 are severely truncated. ja.wikipedia's 下村泉 アニメ版 note enumerates the cuts and changes: '彼女の過去のエピソードは大幅に省略・変更されている。変更点は戸崎と初めて会った時に亜人の存在を知らないこと、実父は彼女が15歳の時に事故死したこと。省略されたのはバイト先・家庭内・学校での出来事や自殺未遂、義父の強姦未遂など'. AllYourAnime lists the same omissions (the convenience-store job, the drained bank account, the cheating boyfriend, the graveyard scene replaced with an apartment visit)." },
      { episodes: [20, 24, 26], kind: 'loose_parallel', note: "Anime-original episodes that touch a source beat without adapting it. Ep 20: the Minister's meeting is 'a riff on the same meeting presented in the manga' (ch 29) with the outcome inverted — Sato attends and kills him, where in the manga he skips it out of boredom and the Minister lives. Ep 24: a compressed echo of the Kei/Nakano argument (ch 43) and a Tosaki/Kei reunion conversation 'similar... to one of the manga's latest chapters' (ch 48). Ep 26: the Shimomura-vs-Tanaka duel 'hearkening to the manga's big moment between the two during the Forge Security Arc' (ch 38-39), relocated to the finale. None of these carry source standing on their own." },
      { episodes: [21], kind: 'loose_parallel', chapters: "31, 31.5 (story position only)", note: "Story position only: the episode sits at ch 31/31.5's place in the run without adapting a scene (the 'Nakano needling' beat is manga content AllYourAnime never places here). T28 → filler + loose_parallel." },
      { episodes: [22], kind: 'partial', chapters: "32-42 (loose)", note: "Very loose reworking of the second wave: Hirasawa's death (ch 38), Suzumura/Manabe's deaths (ch 40), the tranquiliser / IBM-revival twist (ch 41-42) — plus a separable anime-original tail (VX theft, Hashiguchi, Sokabe). Mixed on the same standard as ep 17." },
      { episodes: [23], kind: 'loose_parallel', chapters: "43, 44 (echoes)", note: "Nagai's reaction and an Okuyama conversation echo ch 43/44 with different portrayals — contact points comparable to ep 20 → filler (T28); the studio ending starts here." },
    ],
    reason: "Batch 18 wave 2 (2026-08-26), verified R24 (14 ja-WP 巻話↔第2期N話 pairs verbatim; AllYourAnime independent), Sean ruled: the batch-12 season-level 'anime-original' premise was WRONG — 14-22 adapt manga ch 23-42; 14/15/16 canon, 17/19/22 mixed, 18/20/21/23-26 filler; only 23-26 are the studio ending; no adoption. C-family follow-ups (ep-13 continue 22→23; series continue 29, not ~43) are a narrow task.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/ajin-demi-human.json", "scripts/ingest/research/batch18/verify/ajin-demi-human.md", "https://ja.wikipedia.org/wiki/亜人_(漫画)"],
  },
  {
    seriesId: 'chrono-crusade',
    ruleId: 'T26',
    value: [
      { episodes: [22], kind: 'partial', chapters: "v7 (Satella / Fiore crystallisation)", note: "ANNOTATION-ONLY, never a position (same treatment as the stored ep-21 graft). Satella's confrontation with Fiore and the sisters' mutual impalement retells the manga's Eden-battle scene in which Satella instead crystallises herself together with Fiore — both survive there and are recovered in 1994. Manga side: vol 7 (Acts 43-48, Dec 2003); the act is 'Flower of Stone' (Act 47) by title, which I could NOT confirm independently, so no act number should be written into an anchor. The series' adaptation bound remains ch 30 (MangaUpdates). T28: one climactic scene retold inside the studio ending → filler + partial, not mixed. Never write an Act number (47 is unconfirmed)." },
    ],
    reason: "Batch 18 wave 2 (2026-08-26), verified R24, Sean ruled: 22-24 filler (the studio ending; Moriyama 原作 only; the manga's own ending printed a month before ep 24 aired); the Satella/Fiore scene is recorded as partial. total_chapters 59 is RIGHT (56 Acts + 2 extras + epilogue). Eps 15-16 → narrow re-look (likely filler).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/chrono-crusade.json", "scripts/ingest/research/batch18/verify/chrono-crusade.md"],
  },
  {
    seriesId: 'soul-eater',
    ruleId: 'T26',
    value: [
      { episodes: [37], kind: 'partial', chapters: "38 (slivers)", note: "Joe's arrival and an Eruka/Crona beat are ch-38 slivers inside an otherwise original episode (fandom: no corresponding chapters; ja-WP anime-original from 37; AFG chapters []). T28 → filler + partial; keeps the batch-17 loose_parallel." },
    ],
    reason: "Batch 18 (2026-08-26) T28 repairs, Sean ruled: 37, 39, 40 → filler — the ch-40 opening scene (39, partial) and the grafted ch-44/45 Medusa deal (40, graft) are fragments inside Bones' original ending; the ties stay as annotations.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/verify/soul-eater.md"],
  },
  {
    seriesId: 'dragon-ball-super',
    ruleId: 'T26',
    value: [
      { episodes: [94, 95], kind: 'partial', chapters: "32 (one restaged scene each)", note: "Ep 94 carries the Team U7 assembly at Capsule Corp, ep 95 Goku and Frieza's battered arrival (ch 32) — one restaged scene each inside anime-original two-parters. T28 → filler + partial (same shape as 91)." },
    ],
    reason: "Batch 18 (2026-08-26) T28 repairs, Sean ruled: 91, 94, 95 → filler — original episodes with one restaged ch-31 / ch-32 scene each; 78 stays mixed (ch 28's assembly and announcement carry the episode).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/verify/dragon-ball-super.md"],
  },
  {
    seriesId: 'fullmetal-alchemist',
    ruleId: 'T26',
    value: [
      { episodes: [24], kind: 'partial', chapters: "15 (fragment)", note: "'Has some adapted content from Chapter 15' (fma.fandom) inside an otherwise Bones-original episode — T28 → filler + partial." },
      { episodes: [40, 41], kind: 'graft', chapters: "30 (Martel dies inside Al; Bradley's ouroboros)", note: "Chapter 30's Martel-dies-inside-Al beat — Bradley's eyepatch, the sword through the armour gap — is the closing scene of ep 40 and a recall in ep 41, inside Bones' Lior/Dante plotline. The last manga contact of the 2003 series; T28 → filler + graft (Claymore-26 shape), coverage stays on 8/21/29/30/32." },
    ],
    reason: "Batch 18 (2026-08-26) T28 repairs, Sean ruled with Cursor: 24, 40, 41 → filler; the ch-15 fragment and the ch-30 Martel beat are recorded as partial/graft so the UI can surface them without painting the rows mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/verify/fullmetal-alchemist.md"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T26',
    value: [
      { episodes: [453, 454, 455, 456], kind: 'side_story', chapters: "cover-page serial ch 543-560 (covers)", note: "The Straw Hat's Separation Serial — Oda's cover-page side story animated during Luffy's Impel Down → Marineford travel; each episode's plot is the serial, padded with anime-original antics. Canon per the wiki's Canon page; ja-WP does not bold them. POSITION-LESS (A44): the cover chapters run 5-11 ahead of the main line — never anchor." },
      { episodes: [213], kind: 'divergence', chapters: "313", note: "Same insertion already annotated divergence{313} on eps 214 and 216 (batch 17): Toei added three extra Davy Back games after the Groggy Ring 'to lengthen the storyline', the Roller Race replacing the manga's Combat round as the finale of the first three-coin set. This is a STRUCTURAL divergence marker, not adapted content — ep 213 carries no manga panel. The displaced beat is ch 313's: in the manga winning the Groggy Ring (ch 313) is what wins Chopper back, whereas the anime holds Chopper's return until the end of the invented Roller Race, i.e. the opening of ep 215." },
      { episodes: [215], kind: 'graft', chapters: "313 p.8-9", note: "Chapter 313's own Anime Episodes section credits ep 215 p.8-9 (Chopper returned to the crew); the rest is the added Roller Race / Dodgeball / Red-Light games. T28 → filler + graft." },
      { episodes: [499], kind: 'divergence', chapters: "585", note: "Continues the anime-original expansion of ch 585's 'and from day to day they kept getting stronger' montage that is already annotated divergence{585} on eps 497 and 498 — same ellipsis, same annotation kind kept for consistency. The episode itself carries no adapted panel (Naguri and his ship are anime-only); its closing beat, Bluejam ordering his crew to tell Sabo's father they have found him, is the set-up for the capture that ends ch 585 and is adapted in ep 500." },
      { episodes: [506], kind: 'graft', chapters: "593", note: "The one canon scene the wiki names — Robin on Tequila Wolf: the Revolutionaries ask her to come to Dragon, she answers that she has to reach her crew, and they hand her the newspaper. That is ch 593's opening (Bunny Joe, 'the Light of the Revolution', the crow delivering the paper), pre-played here and then animated in full in ep 510, whose infobox reads 'Chapter 591 p.17-19 and Chapter 593 p.2-11'. Every other strand of ep 506 (Zoro vs the Humandrills and Mihawk's arrival, Chopper brokering peace between the Torino natives and the birds, Nami, Usopp, Sanji, Franky, Brook receiving the paper) is anime-original. Chapter cited for the tie only — A1: no anchor on a filler row, and ch 593 is already anchored by ep 510." },
      { episodes: [775], kind: 'loose_parallel', chapters: "822", note: "The episode dramatises, at feature length and with invented complications, the single event the manga reports as already complete on the first page of ch 822 ('Chopper and the minks finish bandaging the wounds on Zunesha's front left leg'). No manga panel is adapted here — ch 822 is adapted by ep 776 — but the episode is not free-standing filler either: it occupies the off-panel interval between ch 821 and ch 822." },
      { episodes: [1084], kind: 'loose_parallel', chapters: "1056-1057", note: "Stages the Wano goodbyes that ch 1056 only refers to (Hiyori's line) and that ch 1057 skips over on the way to the Tokage Port departure. Two beats are consistent back-fills of later manga reveals rather than adaptations: Chopper handing Bepo the Sulong drug used in ch 1081, and Usopp buying the black cloth that becomes Momonosuke's Jolly Roger in ch 1057." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: the cover-serial rows are mixed + side_story and position-less (A44); every filler row keeps its tie.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/one-piece.json", "scripts/ingest/research/batch18/verify/one-piece.md"],
  },
  {
    seriesId: 'akame-ga-kill',
    ruleId: 'T26',
    value: [
      { episodes: [20, 21], kind: 'rearranged', chapters: "41-43, 46, 51-53, 56", note: "ja.wikipedia's phrase for the whole post-ep-19 run is 原作エピソードを流用した — manga episodes REPURPOSED into an anime-original development. These two rows are where that shows: the anime skips the Wild Hunt arc almost entirely (ch 44, 45, 47, 48, 49, 50 are never adapted, and ch 39 and 41 only in fragments), pulls ch 46 and 51-53 forward, and drops Esdeath's ch 42-43 battle with Najenda and Susanoo — cut from ep 19 — into the middle of ep 21's execution rescue. Adapted chapters therefore run out of order and with gaps behind them. Ch 56 (Mine kills Budo with Pumpkin's all-out shot; Pumpkin shatters) is ep 21's climax with ONE outcome changed (coma → death) — and it was published after broadcast: the strongest shared-outline evidence. Position-less (A44)." },
      { episodes: [20, 21, 22, 23, 24], kind: 'divergence', chapters: "51-78", note: "The branch point. From ep 19 the anime runs a story the manga does not tell, and every major outcome in this block is contradicted by the source Takahiro went on to finish two years later: Lubbock dies in both (ch 52 — cut in half by Izou after strangling Syura; the manner differs), Mine dies in ep 21 (survives in the manga), Budo is killed by Mine's Pumpkin blast in both (ch 56); in the manga Mine falls into a coma (ch 57), in the anime she dies, Kurome dies in ep 22 (survives and starts over with Wave), Tatsumi dies in ep 23 (survives permanently transformed, and has a child with Mine). Note the outline overlap, which is evidence of a shared plan rather than of adaptation: the anime's ep 22, 23 and 24 titles (妹を斬る, 皇帝を斬る, アカメが斬る!) are exactly the kanji titles Takahiro later gave manga chapters 64/65, 74 and 78, covering the same three set-pieces with the opposite outcomes. Ep 22 (Kurome's death) is NOT in the director's account of Takahiro's outline — divergence, not retconned." },
      { episodes: [23, 24], kind: 'retconned', note: "The anime ending — Tatsumi dies fighting the Emperor's Teigu (23), the final battle is Akame vs Esdeath (24) — was TAKAHIRO'S OWN planned outline, supplied to the staff with him on site (director Kobayashi Tomoki, animeanime.jp 2015-01-20/21: 「タカヒロさんが考えていた物語の流れや結末を聞いていて…『タツミがシコウテイザーと戦って死ぬ』ことも最終決戦がアカメ対エスデスになるっていうのも決定していました」); the manga later CHANGED it (「アニメがあったから原作が変化した」). Standing is relative to the source as finished → filler + retconned (the world-trigger 49-63 shape), never canon + adopted." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled (with Cursor): 23-24 retconned author outline; 22 divergence; 20/21 mixed, position-less.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/akame-ga-kill.json", "scripts/ingest/research/batch18/verify/akame-ga-kill.md", "https://animeanime.jp/article/2015/01/20/21646.html", "https://animeanime.jp/article/2015/01/21/21664.html"],
  },
  {
    seriesId: 'black-clover',
    ruleId: 'T26',
    value: [
      { episodes: [55, 56], kind: 'side_source', note: "Adapts 'Black Clover: Abareushi no Sho' (ブラッククローバー 暴牛の書, Viz: 'The Book of the Black Bulls'; fandom romanises it 'Bogyu no Sho' / 'Stubborn Bull Book'), the first Black Clover light novel: author Johnny Onda, illustrator Yuki Tabata, Shueisha Jump J-Books, released 4 August 2016, 256pp, ISBN 978-4-08-703400-4 — the same day as manga Volume 7, with a cover illustration that lines up with it. Ep 55 = story 1 'Boy's Challenge'; ep 56 = story 4 'Bulls'. English Wikipedia independently confirms the novel's existence, author, imprint and date ('Three novels written by Johnny Onda have been released under the Jump J-Books imprint. The first, Black Clover: Abareushi no Sho ... was released on August 4, 2016'). This is a DIFFERENT licensed work from the series' source manga, so side_source — not adopted{author}, and not the 130-157 Tabata-supervised class. (Bōgyū no Sho, 暴牛の書 — Jump J-Books 2016-08-04; the Itachi Shinden precedent.)" },
      { episodes: [56], kind: 'partial', chapters: "81 p.14-17; 82 p.1-9 (restaged)", note: "Closes on ch 81 p.14-17 (Vanessa swallowed by the gate — the only inline ref crediting ep 56) plus a restage of ch 82 p.1-9 (the Fanzell-house conversation; inline refs credit eps 54/57). Inside held position (ep 54 END 82, ep 57 START 82) → annotation only, NO anchor." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: novel episodes are side_source; the manga frame on 56 is a partial, never a mix (two licensed works are two standings).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/black-clover.json", "scripts/ingest/research/batch18/verify/black-clover.md"],
  },
  {
    seriesId: 'noragami',
    ruleId: 'T26',
    value: [
      { episodes: [11, 12], kind: 'divergence', note: "S1's Rabo finale is anime-original: the studio's arc to Adachitoka's brief 原作の未来を奪わない形で; Adachitoka supplied the character's 原案 only; Rabo entered the manga in 2021 as a prequel gaiden (character canon, not story adoption)." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler + divergence; adoption rejected (character 原案 is not a story act).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/noragami.json"],
  },
  {
    seriesId: 'sgt-frog',
    ruleId: 'T26',
    value: [
      { episodes: [180, 357], kind: 'divergence', note: "ja-WP ● index: no 原作に沿った内容 segment on either row; 357 is the anime's originally-planned finale (studio ending)." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler; ja-WP's segment-grain ● index is the source of record.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/sgt-frog.json"],
  },
  {
    seriesId: 'vinland-saga',
    ruleId: 'T26',
    value: [
      { episodes: [5], kind: 'graft', chapters: "21.5 (vol-3 gaiden はたらくユルヴァちゃん)", note: "Carries the volume-3 gaiden 'Ylva at Work' (はたらくユルヴァちゃん, Hataraku Yuruva-chan), numbered chapter 21.5 between ch 21 and ch 22, 14 pages, first published in issue 2006-07 (25 May 2006) — Leif and the village boys return to Iceland with Thors' war chest and the news that Thorfinn is missing; then, in 1003 AD, Ylva works herself to exhaustion so Helga can rest, spears the whale in the bay, and finally breaks down crying when her mother takes the weaving stick from her hands. Transplanted forward roughly five volumes to sit against the ep-4/ep-6 position (ch 16-17); the chapter's own wiki page reverse-indexes |episode=[[Episode 5]]. This is a real chapter tie inside an otherwise anime-original episode, recorded per T28 as an annotation and NOT as position: ch 21.5 is far ahead of the ep-5 reading position and eps 11 ('A Gamble', ch 21-22) later adapt the surrounding chapters, so no anchor and no continue-read effect." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler + graft (T28); eps 7-8 adapt ch 1-2 AFTER eps 1-6 adapt 2-17 — a deliberate rearrangement.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/vinland-saga.json"],
  },
  {
    seriesId: '86-eighty-six',
    ruleId: 'T26',
    value: [
      { episodes: [10], kind: 'side_story', chapters: "LN vol 10: The Banks of Lethe (ch 8), Fido, Varlet; manga vol-1 side story; vol 2 ch 2 opening", note: "Front half adapts 'The Banks of Lethe' (vol 10 ch 8) directly; the back half is an anime-arranged Fido-POV montage built on the 'Fido' and 'Varlet' stories + the manga-vol-1 side story (For Nameless Soldiers Have No Graves); the last ~30 s = vol 2 ch 2's opening. Asato Asato supplied the vol-10 content to the director ahead of time and supervised the script (BD booklet interview, fan TL hackmd.io/@felza127/86interview5). Same source, not mainline volume progression → side_story. ANN's 'anime original' reading recorded as dissent." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: canon + side_story.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/86-eighty-six.json", "scripts/ingest/research/batch18/verify/86-eighty-six.md", "https://hackmd.io/@felza127/86interview5"],
  },
  {
    seriesId: 'demon-slayer-kimetsu-no-yaiba',
    ruleId: 'T26',
    value: [
      { episodes: [27], kind: 'loose_parallel', chapters: "53-54", note: "Reading-position tie only (T28: record the tie, do not let it colour the typing): the episode is placed inside manga ch 53 by the fandom's own Anime Notes, and its final scene - Fuku watching Inosuke headbutt the locomotive while Zenitsu scolds him - is an original-vantage restaging of the trio's arrival at the station, the beat the manga uses to open ch 54 (adapted properly in ep 28). No manga pages are adapted." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler + loose_parallel.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/demon-slayer-kimetsu-no-yaiba.json"],
  },
  {
    seriesId: 'durarara',
    ruleId: 'T26',
    value: [
      { episodes: [25], kind: 'loose_parallel', note: "Records the tie without treating it as adaptation: the OVA gives Mairu Orihara, Kururi Orihara and Max Sandshelt (all three debut in LN volume 4 chapter 1, per their fandom character infoboxes) their first ANIME appearance ahead of x2 Shou ep 1, which is where vol 4 is actually adapted. Plot events are original; only the cast is pulled forward. The closing scene deliberately mirrors ep 1 (Mikado meeting a new arrival at the station)." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler + loose_parallel (medium).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/durarara.json"],
  },
  {
    seriesId: 'fullmetal-alchemist-brotherhood',
    ruleId: 'T26',
    value: [
      { episodes: [1], kind: 'divergence', note: "Anime-original prologue (Isaac McDougal, the Freezing Alchemist); ja-WP: faithful except episode 1. Isaac's design came from Arakawa's rough illustration and she attended script meetings — commissioned, not declared." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler + divergence; adoption laid out, not proposed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/fullmetal-alchemist-brotherhood.json"],
  },
  {
    seriesId: 'high-school-of-the-dead',
    ruleId: 'T26',
    value: [
      { episodes: [13], kind: 'abridged', note: "Format note, not a typing claim: the OVA OPENS with a fast recap montage of episodes 1-12 (Takashi voiceover, intercut with ecchi shots) before its original island story begins. Entry format = OVA (~16 min), bundled as a Blu-ray with the limited first-press edition of manga volume 7 (2011-04-26), never broadcast." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler + abridged (recap opening).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/high-school-of-the-dead.json"],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T26',
    value: [
      { episodes: [28], kind: 'partial', chapters: "275-276 (seam fragments)", note: "T28 tie record, not a typing claim: inside the original clone-fight material the episode carries two genuine manga beats - Chiyo collapsing from Sasori's poison and refusing to return to Sunagakure (the closing page-beats of ch 275, per Narutopedia's chapter summary) and Naruto's declaration that he will finish Deidara if Kakashi's Mangekyo fails (the opening of ch 276). Both sit on the 275/276 seam that eps 27 and 29 already carry, so no anchor moves; the episode's own job is the anime-invented middle of the clone fights." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26): filler + partial (T28).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/naruto-shippuden.json"],
  },
  {
    seriesId: 'sword-art-online',
    ruleId: 'T26',
    value: [
      { episodes: [50], kind: 'adopted', basis: "author", note: "Ordinal Scale (2017-02-18 movie, AFL #50, AniList 21403): Kawahara Reki wrote story + screenplay (official site 脚本 川原礫・伊藤智彦; ja-WP 川原書き下ろしの完全オリジナル作) and two OS-continuity prose stories (Hopeful Chant, Dengeki 2017-03; Cordial Chords, BD 完全生産限定版 2017-09). Basis = AUTHORSHIP (a specific act), not incorporation: the film is 原作未収録 (ja-WP); the Unital Ring line proceeds from the post-OS world state (vol 21 ch 1 Augma). Structure: a movie numbered into the run — N7 + kind: movie component, separately." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: canon + adopted{author}.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/sword-art-online.json", "scripts/ingest/research/batch18/verify/sword-art-online.md", "https://sao-movie.net/staffcast/"],
  },
  {
    seriesId: 'rurouni-kenshin-2023',
    ruleId: 'T26',
    value: [
      { episodes: [44], kind: 'divergence', note: "京都大火（中編）: adapts zero Acts (fandom chapter= blank; Acts 100/101 → Part One, 102 → Part Three — the shared titles are a trap, never anchor 44 to Act 101). The Aoshi-on-the-Rengoku duel and the Juppongatana street fights are the anime's own. Watsuki holds a season-wide 脚本監修 credit and the Rengoku block was 'expanded in consultation' (Real Sound 2024-11-09 — block-level, 相談); no per-episode act is documented (the 炸裂弾 redesign answers a question about ep 25), so no adoption — the Kodachi class. Ep 34's basis (the exhibition ネーム) is independent and stands." },
    ],
    reason: "Batch 18 wave 3 (2026-08-26), verifier REFUTED the per-episode author act, Sean ruled: filler + divergence, no series-level regime.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/rurouni-kenshin-2023.json", "scripts/ingest/research/batch18/verify/rurouni-kenshin-2023.md", "https://realsound.jp/movie/2024/11/post-1829130.html"],
  },
  // ---- the A-7 studio-ending class: filler + asterisk, ON THE REVIEW LIST
  ...(
    [
      ['claymore', span(24, 26), 'Madhouse outran the manga and wrote its own ending (AFG + wheredoestheanimeleaveoff + sportskeeda).'],
      ['gto-great-teacher-onizuka', [...span(22, 28), 34, 42, 43], 'Anime-original mid-series block (22-28, 34) and the original ending 42-43 after the anime caught the manga (fandom infoboxes N/A; mangashed; wheredoestheanimeleaveoff).'],
      ['chrono-crusade', span(22, 24), 'The anime\'s original ending after departing the manga at ep 13 (Wikipedia lead + MU + ja-WP).'],
      ['sailor-moon', span(167, 172), 'The Nehelenia-revival arc: an anime-original continuation of SuperS\'s villain.'],
      ['twin-star-exorcists', span(21, 50), 'The anime\'s own serialized finale (列島覇乱篇 21-31 / 天地鳴動篇 32-40 / 破星篇 41-50) never returns to the manga and contradicts it (Yuto dies here, survives there). RULED FILLER, batch 18 wave 2 (verified R24): Sukeno\'s only credit is character-DESIGN 監修 (animatetimes: デザイン監修); no story credit; no sequel or game carries the ending; the manga ended with its own ending (ch 134, 2024); Sukeno later imported the anime\'s Basara DESIGNS into the manga (Suzu ch 78, Chijiwa/Yamato/Momochi ch 88, Kinasa ch 104 — alive there) while refusing its EVENTS; and in 2020 he wrote that his goal is a from-episode-1 REMAKE, not a season 2 (@sukeno0723, 2020-07). Community consensus and the author agree: not canon.'],
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

// MERGED per series — a series may carry several rulings (its A-7 spread
// entry plus batch-18 entries); last-wins silently dropped railgun's adopted
// rows on 2026-08-26 (caught by the post-heal note check).
export const STANDING_ANNOTATIONS: Record<string, StandingAnnotation[]> = ENTRIES.reduce<Record<string, StandingAnnotation[]>>((acc, e) => {
  (acc[e.seriesId] ??= []).push(...e.value);
  return acc;
}, {});
