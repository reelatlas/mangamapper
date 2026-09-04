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
    seriesId: 'eyeshield-21',
    ruleId: 'T6',
    value: { 22: 'filler', 27: 'filler', 28: 'filler', 15: 'filler', 16: 'filler' },
    reason:
      "Batch 20 wave 2 (verified R24, Sean ruled 2026-08-27): eps 22, 27, 28 are anime-original on three independent sources — ja-WP 各話リスト 備考 prints アニメオリジナルストーリー (verbatim, the 27/28 rowspan), eyeshield21.fandom Category:Anime-Original Episodes (via the API), AFG '* Filler' with an N/A chapter cell — and the fandom `chapters=` field is empty on all three while the neighbours are populated (AFL is silent, so no one-source problem). Ep 28's Doburoku debut is a ch-72 fragment tie (graft, T28), not mixed. Eps 15 and 16 (out of the wave's range, the verifier's finding): ja-WP row 15 `rowspan=2` アニメオリジナルストーリー covers 16; the fandom lists both; ch 34 page-checked is ep 17's material, so the afg anchor 15 → 34 was a chart artefact (deleted, A1).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/eyeshield-21.json', 'scripts/ingest/research/batch20/verify/eyeshield-21.md'],
  },
  {
    seriesId: 'the-beginning-after-the-end',
    ruleId: 'T6',
    value: { 24: 'filler' },
    reason: "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): the finale is ≈ ¾ anime-original (Shiun, the church duel, the city rampage — no source-side synopsis carries them, Shiun has no wiki page, AFG types it Filler); its source share is a half-sentence coda of the Xyrus opening ceremony (ch 86) plus ~30 s of a restaged reunion — T28's 'restaged closing scene / transplanted single beat' branch → filler + graft {86}; no anchor (A1), the terminal stays ep 23 → 84 [81], continue 85 post_series.",
    ruledBy: 'Sean', ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/the-beginning-after-the-end.json', 'scripts/ingest/research/batch20/verify/the-beginning-after-the-end.md'],
  },
  {
    seriesId: 'fist-of-the-north-star',
    ruleId: 'T6',
    value: { 5: 'filler' },
    reason: "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): ep 5 is an anime-invented castle and Joker's fire trap (Toei's own synopsis; ja-WP's anime-original marker; the fandom King-arc page) with the Shin-betrayal backstory delivered only as flashback (A44) — T28's fragment branch: filler + graft {8}. AFL 'Mixed' / AFG unmarked are the dissent (one lineage).",
    ruledBy: 'Sean', ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/fist-of-the-north-star.json', 'scripts/ingest/research/batch20/verify/fist-of-the-north-star.md'],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'T6',
    value: { 41: 'filler' },
    reason: "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): 41A/41B are the anime-original Daisetsuzan winter training and the giant bear Gorota, an anime-only character (Toei's synopsis; kinnikuman.fandom Gorota + Kinniku Buster pages; ja-WP ウォーズマン, 登場人物 §巨大熊ゴロータ 「アニメのみ登場」, 技一覧 「対ウォーズマン戦で初使用」) — the manga's only pre-final training is ch 109 (= ep 39B) and the Buster's manga debut is ch 120 inside the final. Zero source pages → filler (A1: no anchor); AFL + AFG's Manga Canon are one source.",
    ruledBy: 'Sean', ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/kinnikuman-w3.json', 'scripts/ingest/research/batch20/verify/kinnikuman-w3.md'],
  },
  {
    seriesId: 'x',
    ruleId: 'T6',
    value: { 17: 'mixed' },
    reason: "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): ep 17 'Wish' is a recap episode (en-WP 'recapped'; TheTVDB's broadcaster texts DE/FR/PT; 13 of 21 roster names flashback-marked on the fandom page) that also carries FIRST-TIME vol-14 material as its own plot (Kakyō enters Kamui's dream; the Sacred Sword answer — en-WP's vol-14 summary; animated on no other row) and an anime-original climax (Kotori in the dream). Source + non-source in one episode → mixed (T28: the vol-14 dream is the episode's plot, not a quoted fragment). A44 stands: no anchor, no continue.",
    ruledBy: 'Sean', ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/x.json', 'scripts/ingest/research/batch20/verify/x.md'],
  },
  {
    seriesId: 'tokyo-mew-mew',
    ruleId: 'T6',
    value: { 44: 'filler' },
    reason: "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): ep 44 has no counterpart in vol 6 (the TokyoPop scan read page by page): the forest echoes ch 18 already animated at ep 40 and the 'Ryou isn't the Blue Knight' beat echoes ch 22 delivered at ep 45 — restaged beats, T28 → filler with the loose_parallel tie. ja-WP's 太字 marker is unreliable both ways on this series.",
    ruledBy: 'Sean', ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/tokyo-mew-mew.json', 'scripts/ingest/research/batch20/verify/eyeshield-tmm-w3.md'],
  },
  {
    seriesId: 'the-beginning-after-the-end',
    ruleId: 'T6',
    value: { 13: 'filler', 14: 'filler', 15: 'filler', 16: 'filler', 21: 'filler' },
    reason: "Batch 20 wave 4 (verified R24, Sean ruled 2026-08-28): S2 rows 13-16 and 21 are anime-original (AFG filler; the official site's per-episode synopses; the JP scene-level recap; ≥ 4 sources each) — the 'adventuring' arc the webcomic lacks (row 14: the source's own account of Tessia's two years has her at Xyrus, no adventuring); no story-carrying source share → filler with the ties (loose_parallel {57} on 13-16, {58} on 16, {74-75} on 21; rows 14/15 carry none). 17-20 and 22 confirmed canon and anchored (58-80).",
    ruledBy: 'Sean', ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/the-beginning-after-the-end-w4.json', 'scripts/ingest/research/batch20/verify/the-beginning-after-the-end-w4.md'],
  },
  {
    seriesId: 'shugo-chara',
    ruleId: 'T6',
    value: { 83: 'filler', 86: 'filler', 87: 'filler', 88: 'filler', 89: 'filler', 90: 'filler', 91: 'filler', 92: 'filler', 93: 'filler', 94: 'filler', 95: 'filler', 96: 'filler' },
    reason: "Batch 20 wave 4 (verified R24, Sean ruled 2026-08-28; OUR post-resort numbering): the Lulu ?-egg arc is anime-original — ja-WP 各話リスト's ☆ (ほぼ全編アニメオリジナル) on 81-90 and 93-96 with 91/92/97/98 unmarked as the control, Pony Canyon's official per-episode synopses (= Bandai Channel's text, one licensor source), no chapter field on any of the 13 shugochara.fandom pages; the fence 80 → 32 [31] / 97 → 33 [32] holds. Ep 91 animates ch 34's Rhythm-hatch pages first-time but as a transplanted single beat inside an original plot (T28's fragment branch: filler + graft {34}); ep 92 (titled Beat Jumper) opens with Rhythm already born (loose_parallel {34}). AFL's canon on all twelve is the same lie the resort exposed. Follow-up, not this apply: rows 67, 69, 70, 71, 73, 78, 81 (☆, stored canon).",
    ruledBy: 'Sean', ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/shugo-chara.json', 'scripts/ingest/research/batch20/verify/shugo-chara-w4.md'],
  },
  {
    seriesId: 'd-gray-man',
    ruleId: 'T6',
    value: { 28: 'filler', 37: 'filler', 40: 'filler' },
    reason:
      "Batch 20 wave 2 (verified R24, Sean ruled 2026-08-27): ep 28 'Exorcist Krory' (Krory's solo mission, the stained-glass Innocence) adapts no manga page — dgrayman.fandom's episode page has no chapter field and no chapter page names it; ep 40 'Requiem Rose' opens the anime-original Lulu Bell arc, its only manga content a spoken recap of ch 44 already animated in ep 39 (the balcony flashback may be ch 30's Lenalee exchange — loose_parallel {30, 44}); ep 37 is Daisya Barry's anime-original origin story (the wiki's Second Filler Arc list 'Episodes 35-37', no chapter field, no reverse-index entry, a JP witness; the Order in Crisis arc box '36-39' is arc-granular and already holds filler-typed ep 36) — loose_parallel {30, 43}. AFL and AFG both print Manga Canon on all three and are ONE source (AFG reproduces AFL's column). T28: an original plot quoting a fragment is filler with the tie annotated.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/d-gray-man.json', 'scripts/ingest/research/batch20/verify/d-gray-man.md'],
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
    reason: "Ep 64: the JP title = ch 38's title (OUR 109-chapter space; the batch-17 text said 39 in Wikipedia's phantom +1 space — corrected by the batch-20 N22 re-migration, 2026-08-27), but the Sagittarius trials are Toei's own → mixed.",
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
    value: {"16": "mixed", "17": "mixed", "22": "filler", "50": "canon", "52": "filler", "71": "filler", "72": "filler", "78": "canon", "79": "canon", "80": "canon", "81": "canon", "90": "canon", "91": "canon", "94": "canon", "95": "canon"},
    reason:
      "T30 (Sean 2026-08-28, the parallel re-pass, batch 20 waves 5c-5f; SUPERSEDES the batch-18 manga-relative typings below on the rows that moved): dragon-ball-super is a PARALLEL telling (I40) — standing is from-the-outline-or-not, and AFL's 'anime canon' bucket holds both B and D rows, so every row is pinned by the load-bearing test: 16/17 MIXED E (Sean's override of the verdict's medium-confidence canon, 2026-08-28: the node — Goku and Vegeta as Whis's students, Pan's birth — is B and real, but a significant share of each episode is anime-only padding outside the outline and the manga: Bulma courting Whis with restaurant meals in 16, the domestic slice-of-life in 17 — a self-contained D block beside the story = mixed under T28), 50 canon B (installs the destroyed time machine and Black's Time Ring that eps 51/53 run on; the manga's Black never leaves the future), 78 canon C (ch 28 carries the whole episode), 79-81 canon B (the Zeno Expo — manga ch 30 opens on its outcome), 90 canon B (Gohan's power-up + team leadership → eps 97/124), 91 canon B/C (the gathering; Buu's hibernation = ch 31's close → 92-95; medium), 94/95 canon C (ch 32: the revival, Frieza's power-up, the off-screen fight); 22 filler D (the film throws Tagoma into space in its first act — no Ginyu anywhere), 52 filler D (both tellings pause; nothing later depends on the Gohan visit), 71/72 filler D (the anime-only interlude arc). Earlier ruling kept for the record: Batch 18 (2026-08-26), verified R24, Sean ruled: Toriyama's outline is commissioned text expanded by Toei screenwriters (ja.wikipedia verbatim; no 鳥山 in the 脚本 table) → no author adoption; 16/17/22/50/52/71/72/79-81/90 filler (fandom: entire events exclusive to the anime); 78 mixed (manga ch 28 assembly + announcement; chapters '28 (partial)' — ch 30 pairs with eps 82-83, not 78), 91 mixed (ch 31 Buu hibernation), 94-95 mixed on the SAME standard as 91 (one restaged ch-32 scene each; fandom infobox Manga = ch 32). T28 (2026-08-26, Sean): 91/94/95 → filler — original episodes with one restaged ch-31 / ch-32 scene each (partial annotations); 78 stays mixed.",
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
  {
    seriesId: 'fist-of-the-north-star',
    ruleId: 'T6',
    value: { 53: 'filler', 54: 'mixed', 57: 'mixed' },
    reason:
      "Batch 20 wave 6 (verified R24), Sean ruled 2026-08-28: 53 → filler + graft{78} (its ch-78 fragment DUPLICATES coverage — ep 52's C1 straddle enters 78 and ep 54 partials 78-79 — so the T28 sole-adaptation exception does not apply); 54 → mixed + partial{78-79} (a substantial share); 57 → MIXED under the sole-adaptation exception, its first ruling: the clip show's tail is the ONLY adaptation of ch 82's closing pages (Rei's death — fandom Filler page: 'Clip show until Rei's death at the end'; hokutosite/RQ87 agree) — load-bearing + sole, so the row keeps the anchor (repaired 83 → 82) and the skip advice lives in partial{82}.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/fist-of-the-north-star-w6.json', 'scripts/ingest/research/batch20/verify/fist-of-the-north-star-w6.md'],
  },
  {
    seriesId: 'fist-of-the-blue-sky-regenesis',
    ruleId: 'T6',
    value: { 12: 'filler' },
    reason:
      "Batch 20 wave 6 (verified R24), Sean ruled 2026-08-28: ep 12 is the Nahash/Genesis branch aired ahead of the ReGenesis comic (ja-WP 「コミック版に先駆けて」) and exists in NO chapter of the instrument (the original Souten no Ken, N35 space 255) — filler + divergence; the stored MU anchor 88 was the 2006 TV series' endpoint (G37) and is deleted (A1). The honest terminal is ep 9 → 254 v22 (medium) with the post_series continue 255 ON EP 9 (the verifier's apply-blocking catch: a continue on a row whose anchor is deleted lands nothing).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/fist-of-the-blue-sky-regenesis.json', 'scripts/ingest/research/batch20/verify/fist-of-the-blue-sky-regenesis.md'],
  },

  {
    seriesId: 'fist-of-the-blue-sky-regenesis',
    ruleId: 'T6',
    value: { 9: 'mixed', 10: 'filler', 11: 'filler' },
    reason:
      "Batch 20 wave 7 (Sean ruled 2026-08-28, with Cursor): vs the instrument (the original 蒼天の拳, 255 chs) eps 10-11 have zero pages — the Nahash/Genesis branch is Hara's ANIME-FIRST continuation (his interview on the anime's own site: the anime came first, he worked its ending, 「マンガとアニメは別物です」), which makes it a NEW WORK in the Outlaw Star / T21 class, never canon to the 255 and never DBS-parallel (no comparison instrument: only the opening arc and climax touch the ReGenesis manga, the middles are disjoint, and no source maps an episode to a chapter — author credit does not mint correspondence; adopted{author} does not fire because Hara wrote none of it into 31148). Ep 9 → MIXED: its first half adapts the manga's close (the anchor 254 v22 stays), its second half opens the Nahash branch — a real share, not a sliver (T28). S2 stays OUT of the catalog; if ever added it is its own original-class series (AniList 102860), not rows here.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/fist-of-the-blue-sky-regenesis-w7.json', 'scripts/ingest/research/batch20/WAVE7-RECOVERY.md'],
  },

  {
    seriesId: 'ranking-of-kings-the-treasure-chest-of-courage',
    ruleId: 'T6',
    value: { 1: 'mixed', 3: 'filler', 5: 'filler', 7: 'mixed', 8: 'mixed' },
    reason:
      "Batch 20 wave 8 (verified R24), Sean ruled 2026-09-02 ('full set'): the 2023 anthology's rows were BARE defaults (no AFL page; all ten stored canon). The verifier read dic.pixiv.net's segment-by-segment article in full and ja-WP's アニメオリジナルのキャラクター list: ep 3 (both segments original; ドドン) and ep 5 (all three segments original; フレン, and ja-WP's 白王 entry separates the manga fact from the anime plot) are wholly anime-original → filler (T28, two sources). Eps 1, 7 and 8 pair a confirmed tankōbon 描き下ろし bonus chapter (1B vol 8 / 7A vol 3 / 8A vol 10 — pixiv volume numbers + MangaDex placement + es-la titles) with an original segment (1A, 7B チャンピオン, 8B) → mixed (T27: source and non-source in one episode). Eps 2, 6 and 9 stay canon by default with their flags open (one source on the original half); 4 (vol 9 「不死」 + divergence) and 10 (mainline 156-161+) stand. No anchor is affected: rows 1-9 are A44 position-less.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/ranking-of-kings-the-treasure-chest-of-courage.json', 'scripts/ingest/research/batch20/verify/ranking-of-kings-the-treasure-chest-of-courage.md'],
  },
  {
    seriesId: 'erased',
    ruleId: 'T6',
    value: { 11: 'mixed', 12: 'mixed' },
    reason:
      "Batch 20 wave 9 (verified R24), Sean ruled 2026-09-02: the anime leaves the source partway through ep 11 (the official synopsis vs ch 35 — Yashiro re-enters as 西園 at the hospital in 2003, the memory reveal on the roof; the manga keeps him away until ch 37) — ep 11 adapts ch 33-35 (abridged) AND carries an original half → mixed (T28). Ep 12 「宝物」 is the studio's ending (the hospital-rooftop confrontation is anime-invented start to finish; the manga's climax is the camping trap and the burning bridge, ch 40-43) — BUT its closing scene is ch 44's arc close: the final line 「一緒に雪やどりしてもいいですか？」 verbatim, the same 高架下 in the same snow, adapted in no other episode — the sole-adaptation exception (T28, Sean 2026-08-28: a fragment flips to mixed when it is the SOLE adaptation of a major plot point — an arc close is the rule's own example). Sean weighed the direction question (ch 44 went on sale after the episode was produced; both realize the author's conveyed ending) and ruled mixed: the tie is `partial`{44}, the row stays A44 position-less (a far-forward beat is never an END, A4/A47 — an END of 44 would retire nine unseen chapters), the continue is 35 on ep 11 (C1). Reversal to filler = this entry's 12 → 'filler' + drop the partial.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/erased.json', 'scripts/ingest/research/batch20/verify/erased.md'],
  },
  {
    seriesId: 'fist-of-the-north-star',
    ruleId: 'T6',
    value: { 131: 'mixed', 132: 'filler', 133: 'mixed', 139: 'mixed', 140: 'mixed' },
    reason:
      "Batch 20 wave 10 (verified R24 ×3), Sean ruled 2026-09-02: five HnK2 rows AFL prints 'Manga Canon' on. 131 → mixed (hokutosite: everything but the Xie fight and Han's body reaching Hyoh is ほぼアニメオリジナル; Hyoh's debut on ch 179 is sole + load-bearing — the anchor rides the mixed row). 132 → filler + graft{183, 186} (RQ87 'does not happen in the manga', hokutosite '呪龍羅斬陣が登場する以外は全てアニメオリジナル', the fandom Filler page; the sole-adaptation exception fails — ep 135 adapts ch 183's guard scene; A1, no anchor). 133 → mixed (the Jūkei revelation is ch 179's only adaptation, the arc's central reveal, inside an otherwise original episode; rearranged + partial{180} + graft{181-182}). 139 and 140 → mixed (hokutosite's ほぼアニメオリジナル lines, RQ87's invented-plot list, the character indexes: Sayaka ch 189 only, Cain/Coyote anime-only — the ruled eps 54 / 84-86 shape). Ep 130 STAYS canon + divergence by ruling — THE RECAP CLAUSE (Sean 2026-09-02, T28): a recap segment does not progress the story, so it counts for NOTHING in the standing — the REMAINDER of the episode decides: pure source adaptation → canon (with the recap noted), source + original plot → mixed. Ep 130's remainder is ch 178 adapted with alterations (companions cut, a softened Buron beat, Kosem kept alive) — an adaptation with divergences, not an original thread → canon + divergence. Sean's clarification on this row: alterations / cuts / reorders keep canon while faithful to the source; one small studio-made beat (Buron's added massacre of deserters) is noted, never weighed.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/fist-of-the-north-star-w10d.json', 'scripts/ingest/research/batch20/out/fist-of-the-north-star-w10e.json', 'scripts/ingest/research/batch20/out/fist-of-the-north-star-w10f.json', 'scripts/ingest/research/batch20/verify/fist-of-the-north-star-w10de.md', 'scripts/ingest/research/batch20/verify/fist-of-the-north-star-w10fg.md'],
  },
  {
    seriesId: 'bleach',
    ruleId: 'T6',
    value: { 190: 'canon', 193: 'canon' },
    reason:
      "Batch 20 wave 11 (verified R24), Sean ruled 2026-09-02: both stored MIXED rows come apart under the T28 recap + faithfulness clauses. 190 'Hueco Mundo Chapter, Restart!' — its only non-source share is a 15:08 clip-show RECAP of ch 178 onward (bleach.fandom Trivia + AFG's own timestamp note); the recap counts for nothing and the remainder is a full adaptation of ch 286 p.9-21 + 287 → canon + divergence. 193 'Irresistible, Puppet Show of Terror' — three positive pure-manga readings (AFG canon; TV Tokyo's 第193話 synopsis = ch 292-293; the fandom summary) and no source names an original block (the fandom's Anime Notes stop at ep 167 — silence, noted as such); the padding is extended banter and drawn-out exchanges around a faithful adaptation of 292-293 (Sean: 'the filler parts are very insignificant and the main brunt is canon') → canon + divergence. AFL's 'Mixed' (bleachfiller.com is the same list) is the only dissent.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/bleach-w11a.json', 'scripts/ingest/research/batch20/verify/bleach-w11.md'],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T6',
    value: { 388: 'mixed' },
    reason:
      "Batch 20 wave 11 (verified R24), Sean ruled 2026-09-02: 388 'My First Friend' is NOT filler on four witnesses (Narutopedia chapters=656 + the arc page; ja-WP unbolded under the 全編アニメオリジナル legend; AFG 'Mixed' 2:05-5:18 / 20:42-21:05; ch 656's opening third adapted nowhere else — a sole, load-bearing canon share) — and NOT canon: its ~15-minute Gaara retrospective is NEWLY ANIMATED (not recycled footage; better art than the Rin episodes, fresh cast credits incl. a child role), retells Part I story already adapted from ch 129-131, and carries scenes the manga never drew (the Temari/Kankurō childhood dinner) plus a studio framing beat (Son Gokū's question / 'my first friend' — not in ch 656). THE RECAP CLAUSE'S BOUNDARY (Sean, this ruling): a recap is re-shown or plainly retold material that progresses nothing and counts for nothing; a newly animated sequence of significant length is anime production that shapes the episode, and with scenes the source lacks it is original material however familiar its subject — it weighs toward filler; with a real canon share in the same episode → MIXED. The anchor 656 [656] v68 rides the mixed row; divergence names the retrospective.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/naruto-shippuden-w11b.json', 'scripts/ingest/research/batch20/verify/naruto-shippuden-w11.md'],
  },
  {
    seriesId: 'reborn',
    ruleId: 'T6',
    value: { 159: 'filler', 177: 'filler', 178: 'filler', 189: 'filler' },
    reason:
      "Batch 20 sidecar (verified R24), Sean ruled 2026-09-04 under T28's sliver clause — and the research found the ties were PHANTOM: eps 159 / 178 / 189 contain no segment of ch 232 / 257 at all (TV Tokyo's synopses, ja-WP's 未来編 episode ↔ chapter line excludes 178-189 outright, Marvelous' DVD copy アニメオリジナルストーリー; the fandom's 'Chapter 257 (mostly filler)' field restates animefillerlist's typing, 22/22 sampled rows one lineage). Ch 232's scenes are in eps 158 (graft) and 160; ch 257 opens in ep 176 and closes in ep 190. Ep 177 is a wholesale recap of the Choice arc on every source → the recap clause: weightless, filler, `recap`{240-256}, no anchor (its stored 256 also sat one below ep 176's corrected 257 — a back-jump). Anchors on all four deleted (A1). Reversal = these entries + the verdict's rows.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/reborn-slivers.json', 'scripts/ingest/research/batch20/verify/reborn-slivers.md'],
  },
  {
    seriesId: 'd-gray-man',
    ruleId: 'T6',
    value: { 66: 'filler' },
    reason:
      "Sean ruled 2026-09-04 (T28's sliver clause, the first witness): ep 66 「焦燥と混乱」 is an original Asian-Branch training episode built out of roughly ONE page of ch 78 (batch 17, agent-verified; both wiki families place it inside ch 78 and nowhere else); ep 65 already ends inside ch 78 and ep 67 adapts it properly. A sliver is canon material that carries no weight: the remainder (all original) decides → filler; no anchor (A44: no position of its own — the display carries ep 65's 78 forward); the `partial`{78 (p13 only)} stays and names ep 67. Was canon (AFL + batch 17) — the type over-claimed a page.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch17/out/d-gray-man.json', 'scripts/ingest/research/batch20/SIDECAR-DECISIONS.md'],
  },
  {
    seriesId: 'black-butler',
    ruleId: 'T6',
    value: { 37: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28 (sliver clause, Sean 2026-09-04): the episode's own plot is 100% anime-original (Cedric Brandel — no manga debut); every manga tie is a page-level sliver (ch 5 p.2/pp.9-11/pp.18-20, ch 22 pp.30-34, ch 23 p.2) restaged as framing or a gag, so the REMAINDER decides and the remainder is original. Stored type mixed came from the batch-10 `graft` (chapters null) and AFL's 'Mixed Canon/Filler'; under the sliver clause a fragment tie alone no longer earns the type. Sole-adaptation exception checked and refused on both halves (see the graft notes).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/black-butler-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'chrono-crusade',
    ruleId: 'T6',
    value: { 8: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause: no source segment at all — the Grand Central Rizelle story is anime-original and the only tie is the spider/puppet CONCEPT of Acts 19-21, which ep 13 adapts properly and in full (sole-adaptation test fails). Remainder is 100% original -> filler; graft{19-21 (concept only)} kept as the mandatory tie; A1 forbids an anchor. This also aligns the row with the existing A7 ruling ('concept-level, never a position', session 2026-08-24), which the mixed type had been sitting on top of.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/chrono-crusade-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'chrono-crusade',
    ruleId: 'T6',
    value: { 14: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause: the row adapts no source scene — it merely parallels the source's SLOT. Its three defining beats (the fever, the fortune teller's remedy, the kiss) are tropedia ANIME ONLY entries; the only candidate chapters (Acts 22-26, the Chicago block) contain nothing of the kind and are never adapted, the anime going straight from Act 21 (ep 13) to Act 27 (ep 18). Same shape as eps 15 and 16, which batch 19 already retyped filler on the identical {22-26} tie. loose_parallel{22-26} kept; A1 forbids an anchor.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/chrono-crusade-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'chrono-crusade',
    ruleId: 'T6',
    value: { 17: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause: the row adapts no source scene. The San Francisco battle, Viede's and Carv's deaths and Rosette's stigmata are anime constructs — the fandom places Viede's death at the Eden crusade (v7-v8) and Gurio in the anime only, and ja-WP records the sanctified Rosette as anime-only. The v4 Pursuers thread it echoes (Acts 23-24) is set in Chicago and inverts the alliance, and is never adapted. Same shape as eps 15 and 16 on the identical {22-26} tie. loose_parallel{22-26} kept; A1 forbids an anchor.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/chrono-crusade-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'detective-school-q',
    ruleId: 'T6',
    value: { 1: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28 (sliver clause, Sean 2026-09-04): the stored 'mixed' rests on the `loose_parallel{45-46}` tie alone, inherited from AFL's 'Mixed Canon/Filler'. A parallel is not source content: no scene, panel or beat of ch 45-46 is animated, the victim, investigator and timeline all differ, and the episode's own plot (the bank-note misunderstanding, the first meeting of Kyu/Megu/Kinta before the DDS exam) is anime-original. The remainder decides → filler. This is consistent with the batch-17 verdict's own finding ('Nine episodes adapt nothing (1, 4-7, 15, 35, 44-45)') and with Sean's T11/T6 rulings of 2026-08-25, which already typed 35/44/45 filler on the same logic; ep 1 is the row that was left h",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/detective-school-q-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'eyeshield-21',
    ruleId: 'T6',
    value: { 39: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause. The episode's job is the clip-show review (weightless, recap clause) plus a wholly anime-original TV-interview chase; the source share is two pages of ch 89 carried as background, weight SLIVER, adapted-properly episode named (ep 38). Sole-adaptation exception fails on its second half (not a major plot point). Filler + partial{89} + recap{1-91}; no anchor (A1), ANCHOR_SUPPRESSED[39] unaffected. This supersedes the T6 map entry '39':'mixed' (Sean 2026-08-25) - delivered as an explicit correction, not a silent override; the batch-20 wave-3 verdict already flagged this row to Sean as 'the cleanest candidate in the series' for the T28 line and deliberately left the typing to h",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/eyeshield-21-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'eyeshield-21',
    ruleId: 'T6',
    value: { 66: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause. Three independent sources call the episode anime-original (ja-WP 備考 アニメオリジナルストーリー; eyeshield21.fandom Category:Anime-Original Episodes; AFG '* Filler', chapter cell N/A) and the licensor synopsis + en-WP describe a plot with no manga counterpart end to end. The single tie is a framing line echoing vol 15's kicker turn, weight SLIVER, and the chapters it names are adapted properly at ep 76 - the sole-adaptation exception fails on its first half. Filler + loose_parallel{132-133}; no anchor (A1). This supersedes the T6 map entry '66':'mixed' (Sean 2026-08-25), whose own research file called it 'a JUDGMENT CALL... the weakest verdict in this file'.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/eyeshield-21-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'hajime-no-ippo-the-fighting',
    ruleId: 'T6',
    value: { 76: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause (Sean 2026-09-04): the two-panel Round 383 graft carries no weight (duplicate — ep 97 adapts the chapter in full), so the remainder decides, and the remainder is anime-original throughout. Two independent witnesses to the content: ippo.fandom's Episode 76 page (full synopsis + trivia 'While this episode is considered filler, a small amount of panels from Round 383 were adapted', filed under Category:Filler Episodes) and AniList 12069's own description of the special ('A special episode included in the DVDs. It tells how Takamura started boxing', SPECIAL, 23 min). en-WP records it as the DVD-only episode numbered 76 that did not air. animefillerlist prints 'Mixed Canon/Fille",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/hajime-no-ippo-the-fighting-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'heavens-lost-property',
    ruleId: 'T6',
    value: { 18: 'canon' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28 under the sliver clause. Both of this episode's segments are SOURCE and both are significant: ch 23 'War!!' (the whole snow-war plot, its sole adaptation) and the vol-6 番外編 「はじめてのはっくつ」 (the hot-spring dig). A side story printed inside the tankōbon IS the source (the GTO ruling), so there is no non-source share to make the row mixed — en-WP's beat list for ep 18 maps onto ch 23 and that extra with nothing left over, and the fandom's independently written episode summary lists the same beats. AFL's 'mixed' is the coarse call the sliver clause exists to correct; flagged for Sean since I cannot watch the episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/heavens-lost-property-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'rosario-vampire',
    ruleId: 'T6',
    value: { 14: 'mixed' }, // T26 THE CHAIN (Sean 2026-09-04): Season II ch 1 + 3 are canon told out of order — MIXED, not filler; pinned against the AFL re-derive (P8)
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28: standing is relative to the IDENTIFIED SOURCE — Rosario + Vampire, 40 chapters / 10 volumes (AniList 30894), the space every stored anchor uses. Ep 14 adapts none of it: its manga content is the sequel work (Season II ch 1 + 3, another chapter space, carried as side_source above), its only season-one content is the in-episode recap gag (weightless, T28 recap clause), and the rest is anime-original. Mixed requires source + non-source in one episode; there is no weighted source share here, so the remainder decides and the row is filler + side_source. This is also how the catalog already types every other Season-II-only Capu2 row (15-19, 21-23, 25-26). NOTE the title trap: ep 14 'Reuni",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/rosario-vampire-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'sailor-moon',
    ruleId: 'T6',
    value: { 36: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause. The episode is a Dark-Kingdom youma-of-the-week with an anime-original antagonist (Kariko Tokoyama) and an anime-only youma (Mitsuami, first and only appearance here, created by Kunzite), and its single source-shaped element - the evil-Endymion reveal - is an arc-level echo of Acts 10-11 with no adapted page, weight SLIVER. The stored mixed comes from AFL's 'Mixed Canon/Filler' label on the row, which is a source label, not a content finding: AFL prints the same label on ep 42 (Minako's past) and prints plain Filler on eps 37-41 and 43, whose Dark-Kingdom framing is identical in kind to this row's. Filler + loose_parallel{11} (annotation unchanged); no anchor (A1).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/sailor-moon-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'tokyo-mew-mew',
    ruleId: 'T6',
    value: { 19: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28 sliver clause. Zero standing in the source: the porpoise-fin debut is a loose parallel of ch 21 with no ch-21 scene shown, and ch 21's own version is at ep 41. en-WP's episode summary and the fandom's independently written (dub-based) summary describe the same wholly invented beach plot; the manga's chapter list for the adjacent volumes (ch 10 'Shall We Dance?', 11 'Cruise Control', 12 'Alien Invasion', 13 'The Truth About Cats and Dogs') contains nothing resembling it, and chs 10, 12-13 are already claimed by eps 13 and 28 while ch 11 is ruled never adapted.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/tokyo-mew-mew-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'tokyo-mew-mew',
    ruleId: 'T6',
    value: {}, // ep 21 HELD by the verifier (w16-types.md): the first and only animation of ch 9's closing mew-aqua briefing — significant; stays MIXED + partial{9} + A44
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28 sliver clause. The one source-derived segment is a weightless restatement of ch 9's closing mew-aqua briefing, already animated at ep 12; the episode's own plot (Minto's dream, her resignation, the fake mew aqua) exists in no chapter. en-WP's summary and the fandom's dub summary agree on the beat list, and en-WP's vol-2 chapter summary places the briefing at the end of ch 9.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/tokyo-mew-mew-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'tokyo-mew-mew',
    ruleId: 'T6',
    value: { 37: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28 sliver clause. No page of ch 19 is in this row: en-WP's ep-37 summary is entirely the invented Christmas set-up, and en-WP's vol-5 chapter summary gives ch 19's content as the lunch-date attack and forced transformation, which the anime replaces (the stored ep-38 divergence {19} already records the relocation). The ch-19 pages the anime keeps are on ep 38's anchor. Consistent with the A44 ruling of 2026-08-27, which already found this row holds no truthful position.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/tokyo-mew-mew-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'trigun',
    ruleId: 'T6',
    value: { 6: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T28 sliver clause (Sean 2026-09-04): both source segments are slivers with no weight (ch 4's opening = a duplicate of pages ep 5 / ep 7 carry; ch 0 = 6 wordless prologue pages used as flashback imagery), so the remainder decides — and the remainder is wholly anime-original. Elizabeth (the plant technician who hires the assassin and sabotages the Inepril plant) and Kesskass are anime-only characters: trigun.fandom's Elizabeth page carries ONLY anime fields (AniDebut = Episode 6) and no manga counterpart, and none of the episode's plot appears in ch 4's chapter summary. animefillerlist independently types ep 6 'Filler'. SUPERSEDES the T6 override {'6':'mixed'} (Sean 2026-08-25) for this row on",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/trigun-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'zatch-bell',
    ruleId: 'T6',
    value: { 122: 'filler' },
    reason:
      "Batch 20 wave 16 (the mixed_fragment_only queue under T28's sliver clause; verified R24), Sean ruled 2026-09-04: T27/T28 (sliver clause, Sean 2026-09-04): the stored 'mixed' rests on the single `partial{186}` framing beat, and that beat is a duplicate of a chapter adapted in full at ep 121 — a sliver with no weight. The remainder (the entire Kaguya festival story) is anime-original, so the row is filler. This does NOT contradict Sean's T6 ruling of 2026-08-25 (which set 122 → mixed against AFL's 'canon'): that ruling rested on konjikinogash's per-episode chapter field alone, before the sliver clause existed; the same field is what shows the beat is a duplicate. AFL still prints 'Canon' for 122 (and for the already-filler 118/119/123) — AFL's typing on this block was overruled once already.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/zatch-bell-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'saint-seiya-knights-of-the-zodiac',
    ruleId: 'T6',
    value: { 64: 'mixed' },
    reason:
      "Batch 20 wave 16 (verified R24 — w16-anchors.md), Sean ruled 2026-09-04: ep 64 carries the Aiolos testament pages of ch 38 (the chapter's title beat and reveal) and no other episode adapts them (ep 63 ends on the arrow being fired, ep 65 opens inside ch 38's aftermath) — T28's sole-adaptation exception: mixed, with the anchor 38 [38] v11 so the pages are not falsely marked never-adapted. animefillerlist types the row FILLER; this entry pins mixed against the re-derive (P8).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/saint-seiya-knights-of-the-zodiac-w16.json', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'black-clover',
    ruleId: 'T6',
    value: { 3: 'filler' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: CONFIRMATION, NOT A CHANGE — stored type is already filler; recorded so the T4 flag can be closed with evidence. T27/T28: zero story-carrying source share. Segment weights: ch 1 p.1 = SLIVER (1 page, a retold prologue already carried by ep 2 per the wiki's Chapter 1 page; inside AFG's own skip zone, Start 4:30); ch 2 p.4-5 = SLIVER (2 pages, AFG's own window 06:37-09:07 = 2m30s of a ~16-minute body). Remainder ~13-14 minutes anime-original — the licensor's 第3話 synopsis is training + the send-off by the church family + the journey to the capital, and the manga skips those six months entirely (Chapter 2: 'Six months after receiving their grimoires, Asta and Yuno travel to a venue'). An origina",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/black-clover-w1.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'black-clover',
    ruleId: 'T6',
    value: { 68: 'filler' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: CONFIRMATION, NOT A CHANGE — stored type is already filler and AFL is RIGHT here ('Filler'); recorded so the T4 flag can be closed with evidence. T27/T28: one source segment, ch 103 p.14-15, WEIGHT SLIVER — a ~30-second closing hook (AFG's own window 20:29→end) that is a DUPLICATE of ep 69's opening (Chapter 103 page: p.14-17 → eps 68 AND 69; ep 69 page: p.15-17; licensor's 第69話 synopsis opens on the same beat). Remainder ~19-20 minutes anime-original: the food-stall contest, Julius's Chrono Stasis gag. The licensor's 第68話 synopsis contains only the stalls and ends on teaser wording ('ついには……!?'). Sole-adaptation exception fails on both halves. AFG's blue 'Mixed' class is the flag's false pos",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/black-clover-w1.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'T6',
    value: { 43: 'mixed' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: Stored filler (AFL: Filler). Flip to MIXED under T28's SOLE-ADAPTATION EXCEPTION, both halves stated explicitly. (1) The pages appear in NO other episode: Kanzenshuu's ch-246 page lists its corresponding DBZ episodes as exactly 039, 040, 042, 043 (plus Kai 019) and the four page ranges are disjoint — p.1-4 / p.5-8 / p.9 / p.10 + p.11-End; this row alone holds the chapter's last five pages of fourteen. (2) The beat is a major plot point of the source: Kewi/Cui reveals that Freeza heard about the Namekian Dragon Balls over Vegeta's scouter, has already left for Namek to wish for immortality and intends to exterminate the Namekians afterwards; Vegeta takes his scouter back and launches for Name",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/dragon-ball-z-w1.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'fairy-tail',
    ruleId: 'T6',
    value: { 246: 'mixed' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: T28 + the SOLE-ADAPTATION EXCEPTION, both halves stated. Segment 1 (weight: n/a — no source pages): the Jellal / Meredy / Oración Seis / Rustyrose story, ~21 of ~22 minutes, entirely anime-original (fandom Differences: 'With the exception of Mard Geer appearing towards the end of the episode, all the scenes taken place in the episode were anime-only'; ja-WP bold = アニメオリジナルストーリー, the only such mark in eps 240-260). Segment 2 (weight: SIGNIFICANT): ch 380 pp.22-end, the episode's closing scene — Mard Geer Tartaros on his throne with the book of E.N.D. Half (a) of the exception: these pages appear in NO other episode — the coverage set is ep 245 {379, 380 pp.1-21}, ep 246 {380 pp.22-end}, ep 24",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/fairy-tail-w1.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T6',
    value: { 179: 'mixed' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: Stored filler (AFL). T28 sole-adaptation exception, both halves stated explicitly: (1) SOLE — the pages animated at 0:00-4:05 are ch 450's closing pages (the Fire Daimyo's emergency council: Koharu and Homura pressed by Danzo, Shikaku nominating Kakashi, Danzo's rebuttal, Danzo appointed Sixth Hokage) and they appear in NO other episode; ch 450's other threads are held by eps 175 (hero's welcome), 176 (Zetsu/Team Samui) and 178 (Taka; Tobi and Kisame), and the next canon episode 197 starts at ch 451 on both AFG and Narutopedia. (2) MAJOR PLOT POINT — the appointment of the Sixth Hokage is a reveal the entire following arc is built on and the political close of Pain's Assault; if this row sta",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/naruto-shippuden-w1.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 93: 'mixed' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: T28: source and non-source in one episode, with the source share substantial and story-carrying. SEGMENT 1 (significant): ch 158 p.2-3 and p.14-16 — the crew waiting at Nanohana and spotting Mr. 3's ship; the perfume shop, Vivi setting the destination (Yuba, and Koza) and the crew realising Luffy is missing. Sole adaptation — ep 94 plays p.4-13 and never restages these beats — roughly a third of the episode. SEGMENT 2 (anime-original): Luffy burning the Dance Powder and Kamonegi's explanation of it, Chopper's truck ride, and the early debuts of Koza and Matsuge (Matsuge debuts in ch 162 in the manga). WHO SAYS WHAT: AFL 'Filler' (wrong — it cannot see a bookended manga share); AFG plain-cano",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/one-piece-w1a.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 203: 'mixed' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: T28 + the sliver clause. SEGMENT 1 (significant): ch 303 p.16-18, ~6m23s of the episode (AFG's own timestamps 13:35-19:58, cross-checked on Crunchyroll and Netflix in the same note) — the division of the Skypiea gold, Nami's 80%, and Luffy's decision that the next crewmate is a shipwright, then a musician. It is a SCENE, it progresses the source's story (the Water 7 hinge), and this episode is its only adaptation anywhere in the run; by the clause's own definition that is significant, not a sliver — it is not a tease, not framing panels, not a page tie, and the anime never adapts it properly later. SEGMENT 2 (anime-original): the G-8 plot — sailing back into the fortress by the Marines' bell",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/one-piece-w1a.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 51: 'filler', 55: 'filler', 214: 'filler', 216: 'filler', 225: 'filler' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: CONFIRMATIONS — stored type is right and AFL is right on all five; this is the result, not an empty verdict. 51: an invented cooking contest against the anime-original Carmen; the tie is ch 98's tuna-stand panels, a sliver duplicated properly in ep 52 (ja-WP bold; OPwiki Unbekannt; AFG's '98' is the row-50/51 plateau). 55: the Calm Belt exposition of ch 101 restaged with Apis inside the Warship Island arc, the chapter's own story adapted in ep 61 (ja-WP bold; AFL filler; only AFG types it Mixed). 214: a Toei-invented Davy Back race; its two-page tie cannot even be placed (sources split between 214 and 215). 216: a Toei-invented Davy Back game; its only manga claim is single-source and contra",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/one-piece-w1a.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 195: 'canon' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: CONFIRMATION — stored canon is right, AFL is right, AFG's '*Mixed' is the outlier. The episode adapts ch 302 in full plus ch 303 p.2-3, 10-11, 14 (OPwiki), which AFG's own timestamp puts at 1:50-15:58 — about 74% of the body; ja-WP does not bold the row; OPwiki gives it no filler banner and no '(Filler)' arc qualifier, uniquely among the nine rows in this ask. The studio material is the closing ~5 minutes: a padded octopus-balloon descent and the substitution of the manga's sea-monkey tsunami with the Marine base that hooks the G-8 arc. T28's faithfulness clause governs: a studio-made closing scene inside an otherwise faithful adaptation is a `divergence` annotation and is never weighed towa",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/one-piece-w1a.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 418: 'mixed', 419: 'mixed', 420: 'mixed' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: T28. Stored filler; AFL labels them 'Anime Canon' (not a type — T27) and AFG maps them to ch 523-524. Chapter accounting settles it for MIXED on two independent grounds, both stated. (1) THE MATERIALITY BAR: ask what each episode's JOB is. Ep 418's job is to show where Nami and Franky landed; 419's, where Sanji and Chopper landed; 420's, where Usopp and Robin landed — which is precisely what ch 523 p.14-19 and ch 524 do. The source beat is the episode's premise and spine, padded with anime-original elaboration; that is the shape Sean already ruled MIXED on this series at eps 453-456 ('each episode's plot is the serial, padded with anime-original antics'), and it is why ep 421 — the same bloc",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/one-piece-w1b.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 50: 'filler' },
    reason:
      "Batch 21 wave 1 (the STRONG AFL-vs-AFG contradictions settled by chapter accounting; verified R24), Sean ruled 2026-09-04: Sean ruled 2026-09-04 (batch 21 wave 1, verified w1-flips.md): ep 50 animates Act 3 of the Loguetown NOVELIZATION — a licensed add-on in the universe, not a continuation of the chain and not adopted canon (T26: a work outside the chain is canon only by an adopted{basis} ruling; 'same author' is the blanket credit the rule rejects) — FILLER stands with a side_source note naming the novel; re-evaluate if adoption evidence lands. graft{98} deleted (no source puts ch 98 here).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/one-piece-w1a.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'T6',
    value: { 39: 'filler', 40: 'filler', 42: 'filler', 125: 'filler', 274: 'filler' },
    reason:
      "Batch 21 wave 1 (verified R24), Sean ruled 2026-09-04 — CONFIRMED AS STORED by chapter accounting on two independent sources: animefillerguide's opposite claim on these rows was a viewing-guide class or a reading-position plateau (AFG's class is an opinion, its note is the evidence); pinned so the type_source_disagreement class stops re-listing a settled row (a confirmation is a result).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/WAVE1-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T6',
    value: { 180: 'filler' },
    reason:
      "Batch 21 wave 1 (verified R24), Sean ruled 2026-09-04 — CONFIRMED AS STORED by chapter accounting on two independent sources: animefillerguide's opposite claim on these rows was a viewing-guide class or a reading-position plateau (AFG's class is an opinion, its note is the evidence); pinned so the type_source_disagreement class stops re-listing a settled row (a confirmation is a result).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/WAVE1-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'inuyasha',
    ruleId: 'T6',
    value: { 79: 'filler' },
    reason:
      "Batch 21 wave 1 (verified R24), Sean ruled 2026-09-04 — CONFIRMED AS STORED by chapter accounting on two independent sources: animefillerguide's opposite claim on these rows was a viewing-guide class or a reading-position plateau (AFG's class is an opinion, its note is the evidence); pinned so the type_source_disagreement class stops re-listing a settled row (a confirmation is a result).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/WAVE1-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'slam-dunk',
    ruleId: 'T6',
    value: { 92: 'filler' },
    reason:
      "Batch 21 wave 1 (verified R24), Sean ruled 2026-09-04 — CONFIRMED AS STORED by chapter accounting on two independent sources: animefillerguide's opposite claim on these rows was a viewing-guide class or a reading-position plateau (AFG's class is an opinion, its note is the evidence); pinned so the type_source_disagreement class stops re-listing a settled row (a confirmation is a result).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/WAVE1-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 51: 'filler', 55: 'filler', 195: 'canon', 214: 'filler', 216: 'filler', 225: 'filler', 319: 'filler', 326: 'filler', 497: 'filler', 498: 'filler', 626: 'filler', 747: 'filler' },
    reason:
      "Batch 21 wave 1 (verified R24), Sean ruled 2026-09-04 — CONFIRMED AS STORED by chapter accounting on two independent sources: animefillerguide's opposite claim on these rows was a viewing-guide class or a reading-position plateau (AFG's class is an opinion, its note is the evidence); pinned so the type_source_disagreement class stops re-listing a settled row (a confirmation is a result).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/WAVE1-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
  // ---- batch 21 wave 2 (2026-09-03) — generated from the verdicts' type_corrections; behind-is-not-a-basis ruling (A44 amended)
  {
    seriesId: 'black-clover',
    ruleId: 'T6',
    value: { 67: 'canon', 85: 'mixed', 86: 'filler', 88: 'mixed' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 67 confirmed as stored (canon); 85 → mixed (the seam-episode standing, ruled once for bc 85/88, db 34, dbz 118, TPN 21/22: a page-verified source share beside a story-carrying original act is MIXED); 86 → filler (the Yami/Vangeance original episode — animateTimes \'オリジナル回\'; the ch-133 p.10 tag is a sliver duplicating ep 87; the afg anchor comes out under A1); 88 → mixed (the seam-episode standing, ruled once for bc 85/88, db 34, dbz 118, TPN 21/22: a page-verified source share beside a story-carrying original act is MIXED)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/black-clover-w2.json'],
  },
  {
    seriesId: 'dragon-ball',
    ruleId: 'T6',
    value: { 34: 'mixed' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 34 → mixed (the seam-episode standing, ruled once for bc 85/88, db 34, dbz 118, TPN 21/22: a page-verified source share beside a story-carrying original act is MIXED)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/dragon-ball-w2.json'],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'T6',
    value: { 17: 'mixed', 118: 'mixed', 174: 'filler' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 17 confirmed as stored (mixed); 118 → mixed (the seam-episode standing, ruled once for bc 85/88, db 34, dbz 118, TPN 21/22: a page-verified source share beside a story-carrying original act is MIXED); 174 confirmed as stored (filler)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/dragon-ball-z-w2.json'],
  },
  {
    seriesId: 'fairy-tail',
    ruleId: 'T6',
    value: { 69: 'mixed' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 69 → mixed (first-time ch 165 pages beside an original plot; anchor 165 lands)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/fairy-tail-w2.json'],
  },
  {
    seriesId: 'inuyasha',
    ruleId: 'T6',
    value: { 62: 'canon', 147: 'filler', 148: 'filler' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 62 confirmed as stored (canon); 147 → filler (inuyasha.fandom \'chapter = (Anime Only)\', ja-WP TVオリジナル); 148 → filler (inuyasha.fandom \'chapter = (Anime Only)\', ja-WP TVオリジナル)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/inuyasha-w2.json'],
  },
  {
    seriesId: 'my-hero-academia',
    ruleId: 'T6',
    value: { 39: 'filler' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 39 → filler confirmed (the 49.5 recap; graft sliver)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/my-hero-academia-w2.json'],
  },
  {
    seriesId: 'naruto-shippuden',
    ruleId: 'T6',
    value: { 71: 'filler', 72: 'canon', 112: 'mixed', 176: 'filler', 178: 'filler', 181: 'filler', 417: 'mixed', 429: 'filler', 460: 'filler', 461: 'filler', 469: 'filler' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 71 confirmed as stored (filler); 72 confirmed as stored (canon); 112 → mixed (the sole first-time adaptation of chs 317-318\'s Akatsuki thread, ~5.5 min, the arc close; anchored 318 [317] under A8 — behind is not a basis — with continue 343 curated under C5); 176 confirmed as stored (filler); 178 confirmed as stored (filler); 181 confirmed as stored (filler); 417 → mixed (the sole adaptation of ch 666\'s closing third); 429 confirmed as stored (filler); 460 → filler (T28 sliver clause: the only source-tied material is Black Zetsu\'s ch-681 narration frame, a duplicate of pages eps 459 / 462 carry; the batch-15 manual anchor comes out under A1); 461 → filler (T28 sliver clause: the only source-tied material is Black Zetsu\'s ch-681 narration frame, a duplicate of pages eps 459 / 462 carry; the batch-15 manual anchor comes out under A1); 469 → filler (the Sukea caper, no source names a chapter)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/naruto-shippuden-w2a.json'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'T6',
    value: { 209: 'canon', 210: 'canon', 211: 'canon', 212: 'canon', 217: 'canon', 219: 'canon', 886: 'canon' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 209 confirmed as stored (canon); 210 confirmed as stored (canon); 211 confirmed as stored (canon); 212 confirmed as stored (canon); 217 confirmed as stored (canon); 219 confirmed as stored (canon); 886 confirmed as stored (canon)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/one-piece-w2.json'],
  },
  {
    seriesId: 'the-promised-neverland',
    ruleId: 'T6',
    value: { 20: 'filler', 21: 'mixed', 22: 'mixed' },
    reason:
      'Batch 21 wave 2 (verified R24, w2-flips.md), Sean ruled 2026-09-03 — settled by chapter accounting on two independent sources beyond AFL/AFG; confirmations are pinned so the type_source_disagreement class stops re-listing them (T6). 20 → filler confirmed; 21 → mixed (the seam-episode standing, ruled once for bc 85/88, db 34, dbz 118, TPN 21/22: a page-verified source share beside a story-carrying original act is MIXED); 22 → mixed (the seam-episode standing, ruled once for bc 85/88, db 34, dbz 118, TPN 21/22: a page-verified source share beside a story-carrying original act is MIXED)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/WAVE2-RECOVERY.md', 'scripts/ingest/research/batch21/verify/w2-flips.md', 'scripts/ingest/research/batch21/out/the-promised-neverland-w2.json'],
  },
  {
    seriesId: 'beelzebub',
    ruleId: 'T6',
    value: { 49: 'canon' },
    reason:
      'Batch 21 wave 2, Sean ruled 2026-09-03 — CONFIRMED AS STORED by chapter accounting; pinned so type_source_disagreement stops re-listing rows whose AFG class is a column artefact (T6). 49 canon confirmed (the unnumbered vol-10 extra + the light novel, A44 position-less; AFG\'s filler is its column\'s blindness to unnumbered chapters). Eps 17 / 34 / 39 remain STRONG and unresearched',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/out/beelzebub-w2.json', 'scripts/ingest/research/batch21/WAVE2-RECOVERY.md'],
  },
  {
    seriesId: 'soul-eater',
    ruleId: 'T6',
    value: { 32: 'canon', 36: 'canon', 38: 'canon' },
    reason:
      'Batch 21 wave 2, Sean ruled 2026-09-03 — CONFIRMED AS STORED by chapter accounting; pinned so type_source_disagreement stops re-listing rows whose AFG class is a column artefact (T6). 32 canon confirmed (the unnumbered vol-9 bonus 「聖剣伝説」, A44 position-less); 36 / 38 canon confirmed with page-level divergence facts enriched',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/out/soul-eater-w2.json', 'scripts/ingest/research/batch21/WAVE2-RECOVERY.md'],
  },
  {
    seriesId: 'bleach',
    ruleId: 'T6',
    value: { 109: 'mixed', 227: 'canon' },
    reason:
      'Batch 21 wave 2, Sean ruled 2026-09-03 — CONFIRMED AS STORED by chapter accounting; pinned so type_source_disagreement stops re-listing rows whose AFG class is a column artefact (T6). 109 mixed / 227 canon confirmed (the unnumbered prologue chapters 0.side-A / 0.side-B / 0.8, A44 position-less)',
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/out/bleach-w2.json', 'scripts/ingest/research/batch21/WAVE2-RECOVERY.md'],
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T6',
    value: { 95: 'canon' },
    reason:
      'Batch 21 wave 2, Sean ruled 2026-09-04 — CONFIRMED AS STORED: our row 95 is the Tsuioku-hen OVA act 1 (1999-02-20, manga canon on en-WP / animefillerlist, which shares our row space); the type_source_disagreement flag was an R20 INDEX join against animefillerguide\'s TV-only page, whose row 95 is the never-broadcast 1996 TV episode 「流浪の最果て」 (filler) that our grid does not carry. Pinned so the class stops re-listing an artefact; the missing TV ep 95 is an identity fork for Sean (inserting it renumbers the six OVA rows — I39 / T29 / N1).',
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/rurouni-kenshin-w2.json', 'scripts/ingest/research/batch21/WAVE2-RECOVERY.md'],
  },
];

export const EPISODE_TYPE_OVERRIDES: Record<string, EpisodeTypes> = ENTRIES.reduce<Record<string, EpisodeTypes>>((acc, e) => {
  acc[e.seriesId] = { ...(acc[e.seriesId] ?? {}), ...e.value };
  return acc;
}, {});
