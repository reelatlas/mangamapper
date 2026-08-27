// EPISODE_TYPE_OVERRIDES — research-ruled per-episode TYPE corrections (T6,
// Sean 2026-08-23): where a source site misclasses episodes against
// community consensus, the ruling lives here and re-applies inside
// filterEpisodeRows on EVERY episode write — a bare DB update would be
// clobbered by the next AFL page refresh. assert-type-overrides.ts asserts
// every standing row after an addition; ruling_violation is the outcome
// check. Class rulings that name a specific type class carry that id
// instead: T10 (only-ending, x), T11 (caught-up-padded-out, dsq).
//
// Vocabulary (Sean 2026-08-24/25): anime-only-canon = made for the anime but
// standing as canon; filler = outside both canons (retconned or disposable);
// mixed = canon AND non-canon in one episode. AFL/AFG labels are advisory
// only (T4).
//
// One entry per SERIES; `value` is that series' Record<episode, type>.
// Consumer shape: Record<seriesId, Record<episode, type>>.

import type { RulingEntry } from './types';

export const range = (from: number, to: number, type: string) =>
  Object.fromEntries(Array.from({ length: to - from + 1 }, (_, i) => [from + i, type]));

export type EpisodeTypes = Record<number, string>;

const B15 = 'scripts/ingest/research/batch15/out';
const B17 = 'scripts/ingest/research/batch17/out';
const B17b = 'scripts/ingest/research/batch17/out2';
const B14 = 'scripts/ingest/research/batch14/out';

export const ENTRIES: RulingEntry<EpisodeTypes>[] = [
  {
    seriesId: 'x',
    ruleId: 'T10',
    value: { 21: 'filler', 22: 'filler', 23: 'filler', 24: 'filler' },
    reason:
      'The anime-original ending (manga on indefinite hiatus at broadcast) — AFL classes 21-24 manga-canon; research (xtvclamp.fandom, Wikipedia, cbr.com) says original. RE-RULED filler: the studio ending is technically filler; the community accepts it only because no true ending exists and prefers it over the movie\'s alternative — the "only ending" class, annotated + asterisked for re-evaluation when the taxonomy-v2 rule lands.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/x.json`, 'docs/system-evolution.md "Episode-type taxonomy v2"', 'docs/data-pipeline.md §12.50'],
    supersedes: '2026-08-23 ruling anime-only-canon for 21-24 (same evidence, different class); the A-7 parking (taxonomy-v2 retiresWhen) RETIRED by T4.0 / batch 18 (2026-08-26) — the only-ending class stays filler + divergence + asterisk (T13)',
  },
  // ---- research batch 15 (2026-08-24, exact-record promotion — 2+ sources each)
  {
    seriesId: 'black-butler',
    ruleId: 'T6',
    value: { 3: 'mixed' },
    reason:
      'Ep 3: the Grelle subplot is anime-original inside a canon episode (ScreenRant explicit + fandom differences page; AFL dissents — 2-of-3).',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B15}/black-butler.json`],
  },
  {
    seriesId: 'bleach',
    ruleId: 'T6',
    value: { 149: 'mixed' },
    reason:
      "Ep 149 adapts ch 247 p.16-end in its closing minutes inside an otherwise-filler episode (fandom page-level + AFG 'Mixed'; AFL dissents).",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B15}/bleach.json`],
  },
  {
    seriesId: 'kamisama-kiss',
    ruleId: 'T6',
    value: { 10: 'mixed' },
    reason: 'Ep 10: ch-25 beats reworked into an anime-only Christmas mixer plus a past-arc graft — canon and original in one episode.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B15}/kamisama-kiss.json`],
  },
  {
    seriesId: 'miss-kobayashis-dragon-maid',
    ruleId: 'T6',
    value: { 19: 'mixed', 20: 'mixed', 21: 'mixed', 23: 'mixed' },
    reason: 'Eps 19-21/23: one segment per episode is anime-original (fandom + Rory Muses per-episode reviews).',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B15}/miss-kobayashis-dragon-maid.json`],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T6',
    value: { 452: 'canon', 453: 'canon', 454: 'canon', 456: 'canon', 457: 'canon' },
    reason:
      'Eps 452-454/456-457 adapt the Itachi Shinden NOVEL — zero manga pages (Narutopedia + AFG + Wikipedia S20). A licensed canon side story = anime-only-canon per the Boruto/Black Clover precedent (T9). Ep 455 stays mixed: disputed ch-678 frame. T4.3 (T26/T27, 2026-08-26): anime-only-canon → canon; the override lives as an adopted / side_source annotation (lib/rulings/standing-annotations.ts), mapping null by design.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B15}/naruto-shippuden.json`],
  },
  // ---- research batch 17 (2026-08-24, gap tier — 2+ sources each)
  {
    seriesId: 'chrono-crusade',
    ruleId: 'T6',
    value: {
      ...range(5, 5, 'mixed'), ...range(7, 8, 'mixed'), ...range(11, 12, 'mixed'),
      ...range(14, 14, 'mixed'), ...range(15, 16, 'filler'), ...range(17, 21, 'mixed'), ...range(22, 24, 'filler'),
    },
    reason:
      'The anime departs after ep 13: 5/7/8/11/12 are original bridges on canon continuity, 14-21 the "primarily original" stretch that still pulls manga beats (Wikipedia lead + MU + ja-WP), 22-24 the original ending. [Batch 19 wave 1 (2026-08-26), verified R24, Sean ruled: 15-16 carved out to FILLER under T28 — ep 15 is the anime-only Order/Pursuers alliance + the Magdalene-reincarnation premise (ja-WP: the manga\'s Pursuers HUNT the party; Fuji TV synopsis), ep 16 the anime-exclusive Eliza Brown case; the v4 block coherence is the loose_parallel{22-26} annotation. batch19/out/chrono-crusade.json + verify/chrono-crusade.md.] T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B17}/chrono-crusade.json`],
  },
  {
    seriesId: 'kenichi-the-mightiest-disciple',
    ruleId: 'T6',
    value: { 51: 'mixed' },
    reason: 'Ep 51 (OAD 1) is an author-original scenario (ja-WP 原作者オリジナルの書き下ろし) on canon continuity.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B17}/kenichi-the-mightiest-disciple.json`],
  },
  {
    seriesId: 'rave-master',
    ruleId: 'T6',
    value: { 41: 'mixed' },
    reason: 'Ep 41: filler sites say filler, but its core IS ch 74 (Let joins / Silver Knights) — chapter overlap in an original frame = mixed.',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B17}/rave-master.json`],
  },
  {
    seriesId: 'rurouni-kenshin-2023',
    ruleId: 'T6',
    value: { 34: 'canon', 44: 'filler' },
    reason:
      "Eps 34/44 adapt zero chapters (fandom blank + no Act page); 34 is Watsuki's own exhibition storyboard = canon-grade, so anime-only-canon rather than filler. T4.3 (T26/T27): 34 → canon + adopted{author} (Watsuki's storyboard); 44 has no positive canon signal → filler (adheres to no source), on the review list.",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B17}/rurouni-kenshin-2023.json`],
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T6',
    value: { 79: 'filler', 80: 'filler', 81: 'filler', 82: 'filler' },
    reason:
      'Eps 79-82 were typed mixed, but the whole 63-94 block is anime-original (batch-17 verdict: Wikipedia season-3 "not adapted from the manga" + AFL) — the Shimabara/Christian arc included. Found in Sean\'s post-switch review: these four mistyped rows were why frontier_tail_null flagged the series (the audit was RIGHT; the earlier "false positive" framing was wrong). Rows 95-98 are the Trust & Betrayal OVAs adopted as episodes — real manga adaptation (Remembrance arc), kept canon, flagged for anchor research.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    cite: [`${B17}/rurouni-kenshin.json`],
  },
  {
    seriesId: 'sailor-moon',
    ruleId: 'T6',
    value: { 167: 'mixed', 168: 'mixed', ...range(169, 172, 'filler') }, // batch 18 wave 2: 167-168 play never-adapted Acts 38/44 (+ the Eternal debut)
    reason: "Eps 167-172: the Nehelenia-revival arc, an anime-original continuation of SuperS's villain — made for the anime, standing as canon. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B17}/sailor-moon.json`],
  },
  {
    seriesId: 'twin-star-exorcists',
    ruleId: 'T6',
    value: { 20: 'mixed', ...range(21, 50, 'filler') },
    reason:
      "Ep 20 is canon to ~14:05 then departs (mixed); 21-50 are the anime's own serialized finale that never returns to the manga and contradicts it (Yuto dies here, survives there). T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B17}/twin-star-exorcists.json`],
  },
  {
    seriesId: 'world-trigger',
    ruleId: 'T6',
    value: { 48: 'filler', ...range(49, 63, 'filler') },
    reason: 'Ep 48 is an anime-original breather inside the canon arc; 49-63 is the Fugitive Arc, RETCONNED by S2 → filler, not canon. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B17}/world-trigger.json`],
  },
  // ---- batch 17 chunk 1 wave 1 (Sean's rulings 2026-08-25; 2+ sources each,
  // cross-model verified where weight-bearing). mixed = canon AND non-canon in
  // one episode; AFL/AFG advisory only.
  {
    seriesId: 'hellsing',
    ruleId: 'T6',
    value: { 7: 'mixed', 10: 'mixed' },
    reason:
      'Ep 7 closes with ch 11-12 material inside an increasingly-original stretch; ep 10 adapts ch 2 as a rearranged flashback inside the original back half — both mixed.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/hellsing.json`],
  },
  {
    seriesId: 'zatch-bell',
    ruleId: 'T6',
    value: {
      13: 'filler', 108: 'filler', 118: 'filler', 119: 'filler', 123: 'filler',
      51: 'mixed', 57: 'mixed', 103: 'mixed', 117: 'mixed', 122: 'mixed',
      // batch 20 wave 1 (Sean 2026-08-27, T28 materiality): ep 139's first act is ch 212 pp. 2-10 of 18 (first-time pages, ~a third of the episode) before the studio ending — a substantial share of canon in an episode that then diverges = MIXED, anchored 212 [212]; NOT the Claymore-24 sliver shape (a few pages of Scene 60)
      139: 'mixed',
    },
    reason:
      'Contested block, re-researched under the overlap rule (T7): the prior "all 10 filler" proposal rested on exhaustive accounting, ruled insufficient. konjikinogash.fandom per-episode manga_chapter fields + en-WP: 13/108/118/119/123 zero canon (119 = a re-staged REHASH of the ch 35-36 flashback already animated at eps 14-15 — the overlap rule\'s discount case, T8); 51 (ch 22 Germany half, held back 41 eps), 57 (chs 109-110 reworked), 103 (ch 173 opening), 117 (ch 183 closing scene), 122 (ch 186 tail) all carry real canon → mixed.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/zatch-bell.json`, `${B17b}/zatch-bell-contested.json`],
  },
  // ---- batch 17 wave 2 (Sean's rulings 2026-08-25, verifier-confirmed where weight-bearing)
  {
    seriesId: 'kinnikuman',
    ruleId: 'T6',
    value: { ...range(120, 137, 'filler') },
    reason:
      'Eps 120-137 are the two anime-original arcs — author-COMMISSIONED but never author-declared canon; the 1991 sequel continuity-overwrites their timeline slot (ja-WP verbatim) and the canon-signal hunt came up empty → filler (were anime-only-canon; T9 discriminator).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/kinnikuman.json`],
  },
  {
    seriesId: 'eyeshield-21',
    ruleId: 'T6',
    value: {
      45: 'filler', 46: 'filler', ...range(89, 100, 'filler'), ...range(102, 105, 'filler'),
      108: 'filler', 51: 'filler', 109: 'filler', 110: 'filler',
      39: 'mixed', 66: 'mixed', 88: 'mixed', 74: 'mixed',
    },
    reason:
      "The import took AFG titles but never mapped its filler flag, so every row defaulted canon. Base verdict + contested re-research; the 19-block verified per-episode AND double-sourced via ja-WP's 備考 column. 45/46 exhibition, 89-95 Cream Puff Cup, 96 recap, 97-105 Death Game (101 EXCLUDED — canon island chs 168-169), 108 whodunnit, 51 fake-Eyeshield, 109/110 (relocation hypothesis REFUTED on content) → filler. 39 recap + canon scene, 66 ch-133 tag, 88 ch-100 4-koma intervals in original framing (wiki states mixed outright), 74 ch-150 content in a flagged-original episode → mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/eyeshield-21.json`, `${B17b}/eyeshield-21-contested.json`],
  },
  {
    seriesId: 'trigun',
    ruleId: 'T6',
    value: { 6: 'mixed', 16: 'mixed' },
    reason:
      "Ep 6 adapts the ch 0 prologue + ch 4's opening inside original framing; ep 16 adapts ch 16 + ch 20's Angel Arm climax (episode title = chapter title) inside the divergence zone → mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/trigun.json`],
  },
  {
    seriesId: 'hayate-the-combat-butler',
    ruleId: 'T6',
    value: { 10: 'filler', 19: 'mixed' },
    reason:
      'Ep 10: anime-only per Wikipedia outright + the only S1 canon-numbered fandom page with no Adapted From → filler; ep 19: canon + original mix.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/hayate-the-combat-butler.json`],
  },
  {
    seriesId: 'saint-seiya-knights-of-the-zodiac',
    ruleId: 'T6',
    value: { 64: 'mixed' },
    reason: "Ep 64: the JP title = ch 39's title, but the Sagittarius trials are Toei's own → mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/saint-seiya-knights-of-the-zodiac.json`],
  },
  // ---- batch 17 chunk 2 wave 1 (Sean's rulings 2026-08-25, all verifier-confirmed)
  {
    seriesId: 'detective-school-q',
    ruleId: 'T11',
    value: { 35: 'filler', 44: 'filler', 45: 'filler' },
    reason:
      'Ep 35 zero canon. Eps 44-45 = the "caught up, padded out" class — the anime outran the manga and the studio padded a finale: pure filler (Sean overruled the verdict\'s anime-only-canon), annotated with why the real canon was never animated.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/detective-school-q.json`, 'docs/data-pipeline.md §12.50'],
  },
  {
    seriesId: 'emma-a-victorian-romance',
    ruleId: 'T6',
    value: { 19: 'mixed', 20: 'mixed', 21: 'mixed', 22: 'mixed', 23: 'mixed' },
    reason: "Eps 19-23: the O'Donnell arc (chs 38-46) replaced by an invented conspiracy while the surrounding canon plays out → mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/emma-a-victorian-romance.json`],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'T6',
    value: { 128: 'mixed', 1000: 'mixed', 1001: 'mixed' },
    reason:
      'Eps 128/1000/1001 are chapter re-runs — re-staged canon content, never position → mixed. Under the later rehash rule (T8, DRIFT-LIST A-5) a re-staging with nothing new is filler; these three are a named re-check task.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/detective-conan.json`],
    retiresWhen: 'A-5 re-check under T8: retype filler if the re-runs add no new canon',
  },
  {
    seriesId: 'fist-of-the-north-star',
    ruleId: 'T6',
    value: {
      61: 'filler', 78: 'filler', 83: 'filler',
      58: 'mixed', 75: 'mixed', 84: 'mixed', 86: 'mixed', 91: 'mixed',
    },
    reason:
      '61/78/83 zero canon (Bugal filler, recap-block opener, filler — hokuto.fandom + Finn Clark part-3/4 reviews; AFL dissents, ruled fandom + accounting beats AFL); 58/75/84/86/91 carry canon alongside original material → mixed.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/fist-of-the-north-star.json`],
  },
  {
    seriesId: 'sket-dance',
    ruleId: 'T6',
    value: { 26: 'canon', 32: 'canon', 77: 'mixed' },
    reason:
      "AFL's table STOPS at ep 54, so its filler labels there are not typings (T4): ep 26 adapts ch 180 in full (ja-WP subtitle = the chapter title), ep 32 adapts chs 18+45 → canon. Ep 77: the finale adapts ch 167 with an anime-original bookend → mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17}/sket-dance.json`],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'T6',
    value: { 100: 'mixed' },
    reason: 'Ep 100: Kanzenshuu ch 323 p.1-11 "Half Filler" + the Dragon Universe manga field — 3 sources vs AFL alone → mixed.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17b}/dragon-ball-z-a1.json`],
  },
  {
    seriesId: 'fairy-tail',
    ruleId: 'T6',
    value: { 256: 'mixed' },
    reason: 'Ep 256: the closing act adapts ch 398 p.12-end (~9 pages, past the sliver line); the Laxus/Tempester substitution is original → mixed.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17b}/fairy-tail-a1.json`],
  },
  {
    seriesId: 'the-promised-neverland',
    ruleId: 'T6',
    value: { 23: 'mixed' },
    reason: 'Ep 23 adapts chs 172-178 beat-for-beat with ruled substitutions (Isabella lives, Emma keeps memories) → mixed.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17b}/the-promised-neverland-a1.json`],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 737: 'mixed' },
    reason: "Ep 737: the Sabo special adapts ch 794 (wiki forward + reverse) — AFL's anime-canon label loses to the explicit chapter mapping → mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: [`${B17b}/one-piece-a1.json`],
  },
  // ---- earlier standing rulings (2026-08-23 batches)
  {
    seriesId: 'claymore',
    ruleId: 'T6',
    value: { 24: 'filler', 25: 'filler', 26: 'filler' },
    reason:
      'Eps 24-26: fully anime-original ending (the anime stopped 13 already-published chapters short — tankōbon through Scene 69, magazine through 73 — and wrote its own conclusion; "Madhouse outran the manga" was refuted in batch 18/19) — research verdict (AFG + wheredoestheanimeleaveoff + sportskeeda), Sean sign-off. Contrary to the later T11 (DSQ) class; parked under DRIFT-LIST A-7, nothing retyped. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
    supersedes: 'A-7 parking (2026-08-23): RETIRED by batch 18 wave 2 (2026-08-26) — the studio-ending class is filler + divergence (T27/T28), no adoption basis on any A-7 ending',
  },
  {
    seriesId: 'black-clover',
    ruleId: 'T6',
    value: {
      ...range(130, 130, 'canon'),
      ...range(131, 131, 'filler'),
      ...range(132, 133, 'canon'),
      ...range(134, 135, 'filler'),
      ...range(136, 141, 'canon'),
      ...range(142, 149, 'filler'),
      ...range(150, 157, 'canon'),
    },
    reason:
      'Eps 130-157 adapt zero manga chapters anywhere in the stretch (blackclover.fandom infoboxes all empty + animefillerguide + animefillerlist agree; research batch 8) — manga position holds at ch 228 until canon resumes at ep 158 → ch 229-231. Tabata-supervised side stories = anime-only-canon (T9); the disputed 131/134-135 and the Devil Banishers arc 142-149 = filler (2-of-3 sources). T4.3 (T26/T27, 2026-08-26): anime-only-canon → canon; the override lives as an adopted / side_source annotation (lib/rulings/standing-annotations.ts), mapping null by design.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'gto-great-teacher-onizuka',
    ruleId: 'T6',
    value: {
      ...range(22, 24, 'filler'), ...range(25, 26, 'canon'), // 25-26 CANON + side_source{Shonan Junai Gumi!} — batch 19 wave 1 (Sean 2026-08-26, verified R24): SJG vol 27 ch 234-242 'Last Signal' IS the race; batch19/out/gto-great-teacher-onizuka.json + verify/gto.md
      27: 'mixed', // batch 18 wave 2 (T28): adapts the Toroko Oppai side story serialized INSIDE GTO — the episode's plot IS the source
      28: 'filler',
      ...range(34, 34, 'filler'),
      ...range(42, 43, 'filler'),
    },
    reason:
      'Anime-original mid-series block (22-28, 34) + the original ending 42-43 (caught up to the manga) — fandom infoboxes list Manga Chapter(s) = N/A; mangashed + wheredoestheanimeleaveoff call 42-43 non-canon (research batch 11). Contrary to the later T11 class; parked under A-7. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    supersedes: 'A-7 parking (2026-08-23): RETIRED by batch 18 wave 2 (2026-08-26) — the studio-ending class is filler + divergence (T27/T28), no adoption basis on any A-7 ending',
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'T6',
    value: {
      13: 'filler',
      ...range(15, 24, 'canon'), // batch 18 wave 2: canon + adopted{author} by INCORPORATION (Kamachi wrote the arcs' events into the source line)
      41: 'mixed', // adapts the ch-39 special + ch 40's rat scene inside original framing (T28: a whole chapter counts)
      ...range(42, 48, 'canon'),
    },
    reason:
      "S1's back half (Big Spider / Poltergeist, 13 + 15-24) and S's Silent Party (41-48) are anime-original (director-confirmed); ep 14 EXCEPTED — it grafts manga ch 17 (animefillerlist + fandom arc pages + Wikipedia; research batch 12). T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [`${B14}/a-certain-scientific-railgun.json`, `${B15}/a-certain-scientific-railgun.json`],
  },
  {
    seriesId: 'ajin-demi-human',
    ruleId: 'T6',
    value: { 14: 'canon', 15: 'canon', 16: 'canon', 17: 'mixed', 18: 'filler', 19: 'mixed', 20: 'filler', 21: 'filler', 22: 'mixed', 23: 'filler', 24: 'filler', 25: 'filler', 26: 'filler' }, // batch 18 wave 2: 14-22 adapt ch 23-42 (batch-12 premise wrong); 23-26 the studio ending
    reason:
      'S2 (14-26) is anime-original from the start with a non-canon ending (WDTALO + mangashed + per-episode breakdown; research batch 12); canon resumes at manga ch 22. Contrary to the later T11 class; parked under A-7. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [`${B15}/ajin-demi-human.json`],
    supersedes: 'A-7 parking (2026-08-23): RETIRED by batch 18 wave 2 (2026-08-26) — the studio-ending class is filler + divergence (T27/T28), no adoption basis on any A-7 ending',
  },
  {
    seriesId: 'hunter-x-hunter',
    ruleId: 'T6',
    value: { 7: 'mixed' },
    reason:
      "Ep 7 (1999): AFL types it filler, but Hunterpedia's page-level 'Adapted' field has it adapting ch 7 p.3-9,12-19 + ch 8 p.2-4 (Wikipedia's summary + AniB's phase ranges agree on the content) — anchored ep7→7. Research batch 14 (2026-08-23 s2).",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [`${B14}/hunter-x-hunter.json`],
  },
  // ---- research batch 14 (2026-08-23 s2) type corrections, 2+ sources each
  {
    seriesId: 'beastars',
    ruleId: 'T6',
    value: { 37: 'mixed', 42: 'mixed', 44: 'canon' },
    reason:
      'Final Season: eps 37/42 mix anime-original plots with chs 141 / 155. Ep 44 adapts no chapter (reviewer recap vs every chapter synopsis 149-196); SEAN-RULED anime-only-canon 2026-08-24 on positive evidence: chs 169-171 are the cut Kyuu chapters, 172-176 land in ep 47, and the frame-up / rat-base / kiss-deferral content matches no chapter in 161-179 (the manga\'s ch-173 first kiss is relocated to the ep-48 finale). T4.3 (T26/T27, 2026-08-26): anime-only-canon → canon; the override lives as an adopted / side_source annotation (lib/rulings/standing-annotations.ts), mapping null by design.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    cite: [`${B14}/beastars.json`, `${B15}/beastars-ep44-followup.json`],
    retiresWhen: 'flips to mixed if the step-stool line is ever confirmed inside ch 166',
  },
  {
    seriesId: 'cardcaptor-sakura',
    ruleId: 'T6',
    value: { 4: 'filler', 5: 'mixed', 7: 'filler', 39: 'mixed' },
    reason:
      'Wood/Rain (4) and Silent (7) are anime-only cards with anime-original plots → filler; 5 (ch-1 flashback video only) and 39 (Cloud, on the premise of ch 33) → mixed. The Clear Card rows moved to their own series.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [`${B14}/cardcaptor-sakura.json`],
  },
  {
    seriesId: 'cardcaptor-sakura-clear-card',
    ruleId: 'T6',
    value: { 5: 'filler', 11: 'mixed', 12: 'filler', 13: 'filler', 14: 'filler', 15: 'filler', 16: 'filler' },
    reason:
      'Clear Card is a separate series (Sean 2026-08-24): the batch-14 typings of our old rows 76 (anime-original), 82 (mixed) and 83-87 (anime-original) carried into the split entry\'s own numbering (−71). T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    cite: [`${B15}/cardcaptor-sakura-clear-card.json`],
  },
  {
    seriesId: 'dagashi-kashi',
    ruleId: 'T6',
    value: { 10: 'mixed', 11: 'mixed' },
    reason:
      "Ep 10 'That's Dagashi!': anime-original sick-Hotaru story with gag fragments only (MAL reader posts, Inquisitr, WDTALO list, fandom); ep 11: second half is anime-original station-farewell framing around chs 50/52/13 (research batch 15).",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: [`${B15}/dagashi-kashi.json`],
  },
  {
    seriesId: 'reborn',
    ruleId: 'T6',
    value: { 111: 'mixed', 112: 'mixed' },
    reason: 'Eps 111-112: fights against anime-only characters with anime-original box weapons inside the canon Future Arc (ja.wikipedia アニメオリジナル匣 + fandom Future Arc page).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [`${B14}/reborn.json`],
  },
  {
    seriesId: 'that-time-i-got-reincarnated-as-a-slime',
    ruleId: 'T6',
    value: { 30: 'mixed' },
    reason: 'Ep 30 (S2E6) adapts chs 54-55 (Rimuru/Hinata) but the whole Tempest segment is anime-original (fandom adaptation notes + batch-14 review).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [`${B14}/that-time-i-got-reincarnated-as-a-slime.json`],
  },
  {
    seriesId: 'clannad',
    ruleId: 'T6',
    value: { 24: 'canon' },
    reason:
      "Ep 24 'Another World: Tomoyo Chapter' (OVA, 2008-07-16) adapts the visual novel's Tomoyo route — an alternate route of the SOURCE, not a studio invention (Clannad Wiki: 'highlighting segments of Tomoyo's visual novel route'; en-WP: alternate timeline from the TV series). AFL's anime-canon on a VN series maps filler by T27; the cited route makes it canon relative to the VN. Instrument none (no mapping). T4.3 follow-up 2026-08-26.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://clannad.fandom.com/wiki/Another_World:_Tomoyo_Chapter', 'https://en.wikipedia.org/wiki/List_of_Clannad_episodes'],
  },
  {
    seriesId: 'clannad-after-story',
    ruleId: 'T6',
    value: { 23: 'filler', 25: 'canon' },
    reason:
      "Ep 25 'Another World: Kyou Chapter' (OVA, 2009-07-01) adapts the visual novel's Kyou route (Clannad Wiki: 'based on the events of Kyou's route'; en-WP: alternate timeline) → canon relative to the VN. Ep 23 'The Event from One Year Before' is an anime-original extra set a year before the story (Clannad Wiki + en-WP) → filler, ruled so it leaves the afl_anime_canon_unruled queue. Ep 24 is the recap (AFL filler, untouched). T4.3 follow-up 2026-08-26.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://clannad.fandom.com/wiki/Another_World:_Kyou_Chapter', 'https://clannad.fandom.com/wiki/The_Event_from_One_Year_Before', 'https://en.wikipedia.org/wiki/List_of_Clannad_episodes'],
  },
  {
    seriesId: 'boruto-naruto-next-generations',
    ruleId: 'T6',
    value: {"2": "filler", "3": "filler", "4": "filler", "5": "filler", "6": "filler", "7": "filler", "8": "canon", "9": "canon", "10": "filler", "11": "filler", "12": "filler", "13": "filler", "14": "filler", "15": "filler", "25": "filler", "26": "filler", "27": "filler", "28": "filler", "29": "filler", "30": "filler", "31": "filler", "32": "filler", "33": "filler", "34": "filler", "35": "filler", "36": "filler", "37": "filler", "38": "filler", "42": "filler", "43": "filler", "44": "filler", "45": "filler", "46": "filler", "47": "filler", "51": "filler", "52": "filler", "60": "filler", "67": "canon", "68": "canon", "69": "canon", "70": "filler", "71": "filler", "72": "filler", "73": "filler", "74": "filler", "75": "filler", "76": "filler", "77": "filler", "78": "filler", "79": "filler", "80": "filler", "81": "filler", "82": "filler", "83": "filler", "84": "filler", "85": "filler", "86": "filler", "87": "filler", "88": "filler", "89": "filler", "90": "filler", "91": "filler", "92": "filler", "93": "canon", "94": "canon", "95": "canon", "98": "filler", "99": "filler", "100": "filler", "101": "filler", "102": "filler", "103": "filler", "104": "filler", "105": "filler", "106": "canon", "107": "canon", "108": "canon", "109": "canon", "110": "canon", "111": "canon", "120": "filler", "121": "filler", "122": "filler", "123": "filler", "124": "filler", "125": "filler", "126": "filler", "128": "canon", "129": "canon", "130": "canon", "131": "canon", "132": "canon", "133": "canon", "134": "canon", "135": "canon", "136": "canon", "137": "filler", "141": "filler", "142": "filler", "143": "filler", "144": "filler", "145": "filler", "146": "filler", "147": "filler", "155": "filler", "158": "filler", "159": "filler", "160": "filler", "161": "filler", "162": "filler", "163": "filler", "164": "filler", "165": "filler", "166": "filler", "167": "filler", "168": "filler", "169": "filler", "170": "filler", "171": "filler", "172": "filler", "173": "filler", "174": "filler", "175": "filler", "176": "filler", "177": "filler", "178": "filler", "179": "filler", "180": "filler", "190": "filler", "191": "filler", "209": "filler", "221": "canon", "222": "canon", "223": "canon", "224": "canon", "225": "canon", "226": "canon", "227": "canon", "228": "canon", "229": "canon", "230": "canon", "231": "canon", "232": "canon", "233": "canon", "234": "canon", "235": "canon", "236": "canon", "237": "canon", "238": "canon", "239": "canon", "240": "canon", "241": "canon", "242": "canon", "243": "canon", "244": "canon", "245": "canon", "246": "canon", "247": "canon", "248": "canon", "249": "canon", "250": "canon", "251": "canon", "252": "canon", "253": "canon", "254": "canon", "255": "canon", "256": "canon", "257": "canon", "258": "canon", "259": "canon", "260": "canon", "261": "canon", "262": "canon", "263": "canon", "264": "canon", "265": "canon", "266": "canon", "267": "canon", "268": "canon", "269": "canon", "270": "canon", "271": "canon", "272": "canon", "273": "canon", "274": "canon", "275": "canon", "276": "canon", "277": "canon", "278": "canon", "279": "canon", "280": "canon", "281": "canon", "282": "canon", "283": "canon", "284": "canon", "285": "canon", "286": "canon"},
    reason:
      "Batch 18 (2026-08-26), verified R24, SEAN RULED: AFL's 'anime canon' on Boruto is a claim about the manga, not adoption. Kodachi's blanket ストーリー監修 (eps 1-216) is a show-runner credit that also covers rows every list calls filler — REJECTED as an adoption basis (verifier refuted verdict B's 41 rows on the protocol's own test). Adopted on a SPECIFIC act by the source's author: 128-136 Time Slip (Kishimoto's own story, 20th-anniversary project; high), 8-9 (Kishimoto and Kodachi expanded one episode into two; medium), 67-69 Chocho (Kishimoto 原案 + dialogue; repair of stored filler). Ep 34 (Kodachi co-script) declined. 93-95 (親子の日 novel), 106-111 (湯煙忍法帖 novel) and 282-286 (Sasuke Retsuden) adapt licensed novels → canon + side_source (Shippuden 452-457 precedent). 221-281 stay canon + adopted{community} — a DIFFERENT basis from a staff credit: the community and the manga-era story treat the stretch as having happened; written here so it is not 'staff credit for some, vibes for others'. Everything else AFL calls anime canon in 2-105 / 120-209 → filler (adheres to no source).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/boruto-naruto-next-generations-A.json", "scripts/ingest/research/batch18/out/boruto-naruto-next-generations-B.json", "scripts/ingest/research/batch18/verify/boruto.md", "https://ja.wikipedia.org/wiki/BORUTO-ボルト-_NARUTO_NEXT_GENERATIONS", "https://naruto.fandom.com/wiki/Time_Slip_Arc"],
  },
  {
    seriesId: 'beyblade-metal-fusion',
    ruleId: 'T6',
    value: {"3": "filler", "4": "filler", "5": "filler", "6": "filler", "7": "filler", "8": "filler", "9": "filler", "10": "filler", "11": "filler", "15": "filler", "16": "filler", "18": "filler", "20": "filler", "21": "filler", "22": "filler", "23": "filler", "24": "filler", "25": "filler", "26": "filler", "27": "filler", "29": "filler", "31": "filler", "33": "filler", "34": "filler", "35": "filler", "36": "filler", "38": "filler", "39": "filler", "40": "filler", "41": "filler", "42": "filler", "44": "filler", "45": "filler"},
    reason:
      "Batch 18 (2026-08-26), verified R24 SOUND, Sean ruled: all 32 AFL 'anime canon' rows adhere to no source — ja.wikipedia (概要 / 作中用語 / アニメオリジナルキャラクター, cited to Adachi's own blog) documents parallel production with settings flowing anime → manga; anime Battle Bladers pairings share zero matchups with manga ch 9-15; the 原作 credit is a media-mix credit, no 監修 → no adoption. Ep 3 repair mixed → filler (Doji/Dark Wolf/Kenta content absent from ch 1-3; the Blader's Spirit line is a rehash).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/beyblade-metal-fusion.json", "scripts/ingest/research/batch18/verify/beyblade-metal-fusion.md", "https://ja.wikipedia.org/wiki/メタルファイト_ベイブレード", "https://hottate2.exblog.jp/11447754/"],
  },
  {
    seriesId: 'fullmetal-alchemist',
    ruleId: 'T6',
    value: {"8": "mixed", "11": "canon", "12": "canon", "16": "canon", "21": "mixed", "22": "canon", "24": "filler", "29": "mixed", "30": "mixed", "31": "filler", "32": "mixed", "35": "filler", "36": "filler", "37": "canon", "38": "filler", "39": "filler", "40": "filler", "41": "filler", "42": "filler", "43": "filler", "44": "filler", "45": "filler", "46": "filler", "47": "filler", "48": "filler", "49": "filler", "50": "filler", "51": "filler"},
    reason:
      "Batch 18 (2026-08-26), verified R24, Sean ruled: manga content continues through ep 34 and resurfaces in 40-41 (ch 30, Martel inside Al) — 8/21/24/29/30/32/40/41 mixed, 16/22 canon (fma.fandom 'adapted from' fields verified verbatim); eps 11-12 adapt the first light novel The Land of Sand → canon + side_source (Itachi Shinden precedent); 31/35-36/38-39 anime-original connective → filler; 42-51 Bones' original finale → FILLER for manga standing — Arakawa ORDERED a different ending (Asahi 2005-07-25, her own words), holds no 監修 credit, 'did not write for the television series'; authorised parallel continuity is a divergence annotation, never adopted{author} (the kinnikuman rule). Ep 37 repair filler → canon: adapts Arakawa's bonus chapters + a novel story, the same basis ep 13 is stored canon on. T28 (2026-08-26, Sean): 24/40/41 → filler — a ch-15 fragment; ch 30's Martel beat as a closer and a recall inside Bones' Lior/Dante plot (graft annotations); coverage stays on 8/21/29/30/32.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/fullmetal-alchemist.json", "scripts/ingest/research/batch18/verify/fullmetal-alchemist.md", "https://web.archive.org/web/20050728025135/http://www.asahi.com/culture/theater/TKY200507250335.html", "https://fma.fandom.com/wiki/Episode_40_(2003_Anime)"],
  },
  {
    seriesId: 'dragon-ball-super',
    ruleId: 'T6',
    value: {"16": "filler", "17": "filler", "22": "filler", "50": "filler", "52": "filler", "71": "filler", "72": "filler", "78": "mixed", "79": "filler", "80": "filler", "81": "filler", "90": "filler", "91": "filler", "94": "filler", "95": "filler"},
    reason:
      "Batch 18 (2026-08-26), verified R24, Sean ruled: Toriyama's outline is commissioned text expanded by Toei screenwriters (ja.wikipedia verbatim; no 鳥山 in the 脚本 table) → no author adoption; 16/17/22/50/52/71/72/79-81/90 filler (fandom: entire events exclusive to the anime); 78 mixed (manga ch 28 assembly + announcement; chapters '28 (partial)' — ch 30 pairs with eps 82-83, not 78), 91 mixed (ch 31 Buu hibernation), 94-95 mixed on the SAME standard as 91 (one restaged ch-32 scene each; fandom infobox Manga = ch 32). T28 (2026-08-26, Sean): 91/94/95 → filler — original episodes with one restaged ch-31 / ch-32 scene each (partial annotations); 78 stays mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/dragon-ball-super.json", "scripts/ingest/research/batch18/verify/dragon-ball-super.md", "https://ja.wikipedia.org/wiki/ドラゴンボール超", "https://dragonball.fandom.com/wiki/Dragon_Ball_Super_outline"],
  },
  {
    seriesId: 'outlaw-star',
    ruleId: 'T6',
    value: {"1": "canon", "2": "canon", "3": "canon", "4": "canon", "5": "canon", "6": "canon", "7": "canon", "8": "canon", "9": "canon", "10": "canon", "11": "canon", "12": "canon", "13": "canon", "14": "canon", "15": "canon", "16": "canon", "17": "canon", "18": "canon", "19": "canon", "20": "canon", "21": "canon", "22": "canon", "23": "canon", "24": "canon", "25": "canon", "26": "canon"},
    reason:
      "Batch 18 (2026-08-26), verified R24, SEAN RULED the SERIES a studio original (SOURCE_TYPE_OVERRIDES): Sunrise's official page credits 原作 矢立肇・伊東岳彦 on the anime and Yatate (Sunrise's pseudonym) sits in the manga's own vol-1 index — a co-primary media-mix, the manga a sibling telling, not the source (A40/G3 already ruled no chapter mapping meaningful). With the anime as its own source every story episode is canon, including AFL's plain 'Filler' rows 13/14/16/18/19/20 (ep 19 = Ito's own screenplay; none are recaps — Sunrise's episode list). Eps 1-2's overlap with manga vol 1 is a divergence annotation, not a mapping.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/outlaw-star.json", "scripts/ingest/research/batch18/verify/outlaw-star.md", "https://www.sunrise-world.net/titles/pickup_094.php", "https://ja.wikipedia.org/wiki/星方武侠アウトロースター"],
  },
  {
    seriesId: 'soul-eater',
    ruleId: 'T6',
    value: {"37": "filler", "39": "filler", "40": "filler", "41": "filler", "42": "filler", "43": "filler", "44": "filler", "45": "filler", "46": "filler", "47": "filler", "48": "filler", "49": "filler", "50": "filler", "51": "filler"},
    reason:
      "Batch 18 (2026-08-26), verified R24, Sean ruled: ep 38 is the last row adapting chapters; 39 mixed (ch 40's opening scene — fandom states the link, en-WP both sides), 40 mixed (ch 44 tail + ch 45 opening grafted, bidirectional fields); 41-51 Bones' original ending with no Ohkubo credit (archived TV Tokyo staff page; ja-WP) → filler, the A-7 class, divergence-annotated. Ep 37 repair canon → mixed: two sources now say no chapter standing (fandom 'no corresponding chapters', ja-WP anime-original from 37; AFG chapters []), ch 38 slivers only — parity with 39. T28 (2026-08-26, Sean): 37/39/40 → filler — a ch-38 sliver, the ch-40 opening scene, the grafted ch-44/45 deal, each inside Bones' original ending; the ties are annotations.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/soul-eater.json", "scripts/ingest/research/batch18/verify/soul-eater.md", "https://souleater.fandom.com/wiki/Chapter_40", "https://ja.wikipedia.org/wiki/ソウルイーター"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: {"213": "filler", "215": "filler", "453": "mixed", "454": "mixed", "455": "mixed", "456": "mixed", "499": "filler", "506": "filler", "775": "filler", "1084": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: 453-456 MIXED — they animate Oda's cover-page side story (the Straw Hat's Separation Serial, ch 543-560 covers; the wiki's Canon page files it under Canon, ja-WP does not bold them) — the side story IS the plot (T28); 455 repaired for consistency. POSITION-LESS by A44 (the cover chapters run ahead of the main line; AFG prints them — the ep-455 junk anchor Sean deleted in batch 17). 213/215 (added Davy Back games), 499, 506, 775, 1084 filler with their ties recorded. No adoption (the Canon page files 'Oda's Involvement' under Non-Canon).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/one-piece.json", "scripts/ingest/research/batch18/verify/one-piece.md"],
  },
  {
    seriesId: 'akame-ga-kill',
    ruleId: 'T6',
    value: {"20": "mixed", "21": "mixed", "22": "filler", "23": "filler", "24": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled (with Cursor): 20 mixed (MEDIUM — the ch 50-52 outline: Budo beats Tatsumi, Lubbock kills Syura and dies, execution announced; ch 46 unverifiable), 21 mixed (HIGH — ch 42-43 Esdeath vs Najenda/Susanoo never adapted elsewhere; ch 51-53; the ch-56 Budo kill, published AFTER broadcast); both POSITION-LESS (A44: ch 39/44/45/47-50 unadapted). 22 filler + divergence (Kurome's death is not in the director's account). 23-24 FILLER + RETCONNED: director Kobayashi (animeanime.jp 2015-01) states the anime ending — Tatsumi dies vs the Emperor's Teigu, Akame vs Esdeath — was Takahiro's own planned outline, him on site, and that the manga later changed it; standing is relative to the source AS FINISHED (the world-trigger 49-63 shape), never canon + adopted.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/akame-ga-kill.json", "scripts/ingest/research/batch18/verify/akame-ga-kill.md", "https://animeanime.jp/article/2015/01/20/21646.html"],
  },
  {
    seriesId: 'black-clover',
    ruleId: 'T6',
    value: {"13": "filler", "55": "canon", "56": "canon"},
    reason:
      "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: 55-56 CANON + side_source — they adapt the licensed light novel Bōgyū no Sho (暴牛の書, Johnny Onda / illus. Tabata, Jump J-Books 2016-08-04; fandom |chapter=, AFG, en-WP, ja-WP's Fanzell/Dominante/Mariella entries); ep 56 also closes on ch 81 p.14-17 (+ a ch-82 restage) → partial, NO anchor (ep 54 holds END 82). Novel + manga frame is two standings, not a mix — canon (Shippuden 455 stayed mixed because its frame was DISPUTED). 13 filler (empty chapter field, AFG Filler).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/black-clover.json", "scripts/ingest/research/batch18/verify/black-clover.md"],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T6',
    value: {"28": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): ep 28 — only the start/end of Team Guy's clone fights are in the manga (ch 275-276 seam fragments); all four finishing techniques debut anime-only; AFG N/A → filler + partial (T28).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/naruto-shippuden.json"],
  },
  {
    seriesId: 'noragami',
    ruleId: 'T6',
    value: {"11": "filler", "12": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): the S1 Rabo finale is the studio's arc, written to Adachitoka's brief 原作の未来を奪わない形で; Adachitoka gave 原案 for the CHARACTER only (official site 2014-02-06 via ja-WP); Rabo entered the manga in 2021 as a prequel gaiden — character canon, not story adoption → filler + divergence.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/noragami.json"],
  },
  {
    seriesId: 'sgt-frog',
    ruleId: 'T6',
    value: {"180": "filler", "357": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): ja-WP's アニメエピソード一覧 ● index (原作に沿った内容, segment grain, matched stored typing 10/10 on neighbours) gives no ● to either row; 357 is the anime's originally-planned finale (studio ending, no adoption) → filler.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/sgt-frog.json"],
  },
  {
    seriesId: 'girls-last-tour',
    ruleId: 'T6',
    value: {"4": "canon"},
    reason:
      "Batch 18 wave 3 (2026-08-26): AFL's lone 'anime canon' in a 12-for-12 linear adaptation is a mislabel — ep 4 = 写真 (ch 9) + 寺院 (ch 10), fandom both directions + ja-WP titles + MangaDex → canon (research anchor later; MangaDex's EN feed omits ch 11 — off by one from there).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/girls-last-tour.json"],
  },
  {
    seriesId: 'vinland-saga',
    ruleId: 'T6',
    value: {"5": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): only the Ylva cutaway is manga (vol-3 gaiden ch 21.5, transplanted ~5 volumes early); fandom: 'the entirety of this episode excluding the scenes with Ylva is anime original' → filler + graft (T28).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/vinland-saga.json"],
  },
  {
    seriesId: '86-eighty-six',
    ruleId: 'T6',
    value: {"10": "canon"},
    reason:
      "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: ep 10 adapts LN vol 10 — 'The Banks of Lethe' (ch 8, front half), the 'Fido' and 'Varlet' stories (the memory montage, anime-arranged presentation), the manga-vol-1 side story, and vol 2 ch 2's opening (last ~30 s); Asato Asato supplied the vol-10 content to the director ahead of time and supervised the script (BD booklet interview). The LN is the series' SOURCE → canon + side_story (not side_source); 'mixed' recorded as the alternative reading of the montage's presentation.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/86-eighty-six.json", "scripts/ingest/research/batch18/verify/86-eighty-six.md", "https://hackmd.io/@felza127/86interview5"],
  },
  {
    seriesId: 'demon-slayer-kimetsu-no-yaiba',
    ruleId: 'T6',
    value: {"27": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): a new TV episode (Rengoku's road to the train), 'entirely anime-original… takes place during ch 53' (fandom; ja-WP) → filler + loose_parallel{53-54}.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/demon-slayer-kimetsu-no-yaiba.json"],
  },
  {
    seriesId: 'durarara',
    ruleId: 'T6',
    value: {"25": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): the S1 OVA 天下泰平 (DVD 13, 2011-02-23) — 'adapted from' empty where every TV row is filled; no matching Narita short story; pre-debuts vol-4 characters → filler + loose_parallel (medium). STRUCTURE: components off by one from row 25.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/durarara.json"],
  },
  {
    seriesId: 'fullmetal-alchemist-brotherhood',
    ruleId: 'T6',
    value: {"1": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): the Isaac McDougal prologue is anime-original (ja-WP: faithful 'except episode 1'); Isaac's design came from Arakawa's rough illustration and she attended script meetings — commissioned, not declared (the kinnikuman discriminator) → filler + divergence, no adoption.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/fullmetal-alchemist-brotherhood.json"],
  },
  {
    seriesId: 'high-school-of-the-dead',
    ruleId: 'T6',
    value: {"13": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): the Drifters of the Dead OVA — the manga's three extras include no island story; wiki 'Manga Chapters = None'; ja-WP: a 番外編 whose island exists only in the OVA; opens with a recap montage → filler + abridged.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/high-school-of-the-dead.json"],
  },
  {
    seriesId: 'steins-gate',
    ruleId: 'T6',
    value: {"25": "filler"},
    reason:
      "Batch 18 wave 3 (2026-08-26): 'Egoistic Poriomania' — 'entirely anime-original' (wiki), BD-9 unaired special set in America (ja-WP); only carry-forward is downstream (the movie novelisation) → filler; the VN default (T27) holds.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/steins-gate.json"],
  },
  {
    seriesId: 'sword-art-online',
    ruleId: 'T6',
    value: {"50": "canon"},
    reason:
      "Batch 18 wave 3 (2026-08-26), verified R24, Sean ruled: row 50 IS the Ordinal Scale MOVIE (2017-02-18; AFL #50; AniList 21403), not Extra Edition. Kawahara wrote story + screenplay (official site 脚本 川原礫・伊藤智彦; ja-WP 川原書き下ろしの完全オリジナル作) and two OS-continuity prose stories (Hopeful Chant, Cordial Chords) → canon + adopted{author} by AUTHORSHIP (not side_source — it adapts no book; 'incorporated into LN canon' is uncited, ja-WP 原作未収録). STRUCTURE (separate): no component — N7 ruling + a kind: movie component; do not renumber.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ["scripts/ingest/research/batch18/out/sword-art-online.json", "scripts/ingest/research/batch18/verify/sword-art-online.md", "https://sao-movie.net/staffcast/"],
  },
  // ---- batch 19 wave 2 (2026-08-27; verified R24; Sean ruled)
  {
    seriesId: 'ghost-in-the-shell-arise-alternative-architecture',
    ruleId: 'T6',
    value: { 9: 'canon', 10: 'canon' },
    reason:
      "Rides with the T25 `original` ruling (B2-3): under `original` the anime IS the source, and eps 9-10 PYROPHORIC CULT are 完全新作エピソード of the same production (ja-WP 新作エピソード table, 脚本 藤咲淳一; the official site's INTRODUCTION 新劇場版へとつながる; AV Watch 2015-04-06 「新作は話数としては9話と10話にあたり…前日譚」) that lead into 新劇場版 — story episodes of the source → canon, the outlaw-star shape. AFL classes them plain Filler (no anime-only-canon row), so nothing mechanical would retype them: this entry IS the retype (P8). No annotation — no source is overridden (T26).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/ghost-in-the-shell-arise-alternative-architecture.json', 'scripts/ingest/research/batch19/verify/ghost-in-the-shell-arise-alternative-architecture.md'],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'T6',
    value: { 130: 'mixed' },
    reason:
      "Sean's T28 call (B5-12, verified R24) under the catalog line 'pages, not numbers': ep 130 is an anime-original Miyakoji-school kidnapping plot whose payoff — ch 58's CLOSING pages (the real Satsuki's reveal, the honeymoon letter and photo, the horse at the Tendo Dojo) — is FIRST-TIME coverage: ep 93 dropped Satsuki AND the monkey and had Ranma fight the grandmother (ranma.fandom Martial Arts Tea Ceremony Arc, 'Changes in anime'), so the verdict's 're-use of a chapter animated 37 episodes earlier' was refuted for exactly these pages. New pages airing first-time are real → MIXED (AFL mixed; AFG row 124 '58' un-struck; ja-WP attaches no アニメオリジナル footnote to 第112話), with graft{58} as the mandatory tie. NO anchor — a first-time sliver inside an original plot is position-less (A44 entry).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/ranma-1-2.json', 'scripts/ingest/research/batch19/verify/b5c-ranma-bobobo-arms-emma.md'],
  },
  // ---- batch 20 wave 1 (2026-08-27; verified R24; Sean ruled)
  {
    seriesId: 'toriko',
    ruleId: 'T6',
    value: { 145: 'filler', 144: 'mixed' },
    reason:
      "Ep 145: Toei's official synopsis is the Four Kings' anime-only combination attacks on Joie (Tornado Leg Boomerang 'only seen on the anime' — toriko.fandom), Jiro/Setsuno sealing the Taste-Changed Teppei, the four-man technique — no page of Gourmet 244-254 plays (verifier: ch 244 ends with Starjun refusing Joie; ch 245 is Starjun's Bloom); the stored 253 [253] anchor was the fandom field's plateau → filler (T28), anchor deleted (A1). Ep 144: half the Gourmet 251-253 Froese/Midora flashback (canon), half Toriko and Starjun returning to fight Joie (anime-original — in the manga Toriko is unconscious) → mixed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/toriko.json', 'scripts/ingest/research/batch20/verify/toriko.md'],
  },
];

export const EPISODE_TYPE_OVERRIDES: Record<string, EpisodeTypes> = ENTRIES.reduce<Record<string, EpisodeTypes>>((acc, e) => {
  acc[e.seriesId] = { ...(acc[e.seriesId] ?? {}), ...e.value };
  return acc;
}, {});
