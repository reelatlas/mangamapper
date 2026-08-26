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
import { toRecord } from './types';

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
    retiresWhen: 'taxonomy-v2 rule lands (T4.0; DRIFT-LIST A-7)',
    supersedes: '2026-08-23 ruling anime-only-canon for 21-24 (same evidence, different class)',
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
      ...range(14, 21, 'mixed'), ...range(22, 24, 'filler'),
    },
    reason:
      'The anime departs after ep 13: 5/7/8/11/12 are original bridges on canon continuity, 14-21 the "primarily original" stretch that still pulls manga beats (Wikipedia lead + MU + ja-WP), 22-24 the original ending. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
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
    value: { ...range(167, 172, 'filler') },
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
      'Eps 24-26: fully anime-original ending (Madhouse outran the manga) — research verdict (AFG + wheredoestheanimeleaveoff + sportskeeda), Sean sign-off. Contrary to the later T11 (DSQ) class; parked under DRIFT-LIST A-7, nothing retyped. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
    retiresWhen: 'T4.0 taxonomy v2 unifies the studio-original-ending classes (A-7)',
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
    seriesId: 'boruto-naruto-next-generations',
    ruleId: 'T6',
    value: range(221, 286, 'canon'),
    reason:
      "Eps 221-286: five ANIME-CANON arcs between the Kawaki arc end (ep 220 → ch 55) and Code's Assault (287-293 = chs 56-67) — Chunin Re-Exam, Kirigakure war, Kawaki Academy, Labyrinth, Sasuke Retsuden (narutopedia arc pages + animefillerguide + cbr; research batch 11). TRAP: animefillerlist marks 282-293 'Manga Canon' crediting the Sasuke Retsuden SPIN-OFF manga — trusting it would falsely advance Boruto chapter progress. T4.3 (T26/T27, 2026-08-26): anime-only-canon → canon; the override lives as an adopted / side_source annotation (lib/rulings/standing-annotations.ts), mapping null by design.",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'gto-great-teacher-onizuka',
    ruleId: 'T6',
    value: {
      ...range(22, 28, 'filler'),
      ...range(34, 34, 'filler'),
      ...range(42, 43, 'filler'),
    },
    reason:
      'Anime-original mid-series block (22-28, 34) + the original ending 42-43 (caught up to the manga) — fandom infoboxes list Manga Chapter(s) = N/A; mangashed + wheredoestheanimeleaveoff call 42-43 non-canon (research batch 11). Contrary to the later T11 class; parked under A-7. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    retiresWhen: 'T4.0 taxonomy v2 unifies the studio-original-ending classes (A-7)',
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'T6',
    value: {
      ...range(13, 13, 'filler'),
      ...range(15, 24, 'filler'),
      ...range(41, 48, 'filler'),
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
    value: range(14, 26, 'filler'),
    reason:
      'S2 (14-26) is anime-original from the start with a non-canon ending (WDTALO + mangashed + per-episode breakdown; research batch 12); canon resumes at manga ch 22. Contrary to the later T11 class; parked under A-7. T4.3 (T27, 2026-08-26): anime-only-canon → filler (adheres to no source; the studio-ending class A-7 carries a divergence annotation and stays on the review list — twin-star 21-50 explicitly, T4-GLOSSARY §7).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [`${B15}/ajin-demi-human.json`],
    retiresWhen: 'T4.0 taxonomy v2 unifies the studio-original-ending classes (A-7)',
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
];

export const EPISODE_TYPE_OVERRIDES: Record<string, EpisodeTypes> = toRecord(ENTRIES);
