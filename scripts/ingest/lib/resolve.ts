// Staging → canonical. Staging writes are hash-gated; anything suspicious
// files a flag and HOLDS (the previous data stands until Sean rules on it).
// Resolution rules live in docs/data-pipeline.md §2.

import { db, fileFlag, fileFlagOnce } from './db';
import { contentHash } from './hash';
import { slugify } from './slug';
import type { AflShowPage } from './afl';
import type { AniListMedia } from './anilist';

export type StageOutcome = 'unchanged' | 'changed' | 'held';

// >20% of previously known episode types changing in one pull is not how
// filler lists evolve — it's how parsers break. Hold for confirmation.
const LARGE_DIFF_RATIO = 0.2;

const decodeSlug = (s: string) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

// Every name a series answers to, for search (english/romaji/native + synonyms).
export const searchTextFor = (parts: (string | null | undefined)[], synonyms: string[]): string =>
  [...new Set([...parts, ...synonyms].filter(Boolean).map((s) => String(s).toLowerCase()))].join(' ');

// Source-scope enforcement (DESIGN_SYSTEM §6): curated series_scopes rows
// override manga-wide totals with the entry's OWN range. Applied by every
// writer AND runnable standalone (scopes-apply) after curated edits.
export async function applyScope(
  aflSlug: string,
  fields: {
    total_volumes: number | null;
    total_chapters: number | null;
    manga_start_volume: number | null;
    manga_start_chapter: number | null;
  },
) {
  const { data: scope } = await db.from('series_scopes').select('*').eq('afl_slug', aflSlug).maybeSingle();
  if (!scope) return fields;
  return {
    total_volumes: scope.end_volume ?? fields.total_volumes,
    total_chapters: scope.end_chapter ?? fields.total_chapters,
    manga_start_volume: scope.start_volume ?? fields.manga_start_volume,
    manga_start_chapter: scope.start_chapter ?? fields.manga_start_chapter,
  };
}

// Volatile-field refresh for STITCHED series (the daily AniList sweep):
// aggregates recompute from the components' freshly staged media without
// touching the stitcher's structure. Single-season series use resolveSeries.
// Episode-floor invariant (Sean 2026-08-24: displayed totals can NEVER be
// lower than our own episode numbering). Small overshoots (≤2: recap/ep-0
// numbering) floor automatically — a lumped multi-season page overshoots by
// a whole cour, so they can't be confused. Larger overshoots floor only once
// RULED (Sean's confirm loop via reconcile-structure flags); until then the
// flag is the research trigger. Every totals writer applies this.
export const EXTRAS_ADOPTED = new Set<string>([
  'angel-beats', // OVA specials 14-16 (broadcast content, ruled 2026-08-24)
  'rurouni-kenshin', // 1996 broadcast tail 95-100
  // eyeshield-21 REMOVED (Sean's report 2026-08-25, §12.49): the "10
  // specials beyond 145" premise was an AFG PAGE TYPO — its chart has 145
  // rows with the finale mis-numbered "155."; no source names any content
  // for 146-154. The adopted floor rationalized a parse artifact.
]);

// Community-count rulings (Sean 2026-08-24: the community-consensus episode
// count is the truth — specials/ep-0s the community numbers are IN; large
// events it does not number are order-only components). Per-series caps for
// cases where a source numbers content the community consensus does not:
//   psycho-pass: AFL numbers First Inspector as 42-44, but community treats
//   it + the films as watch-order events → 41 episodes (Sean's ruling).
//   monogatari-series: AniList's Second Season count includes 3 recaps the
//   community numbering excludes → 100.
// Enforced at every episode-row write (rows above the cap are dropped) and
// as a totals clamp after the floor.
export const COMMUNITY_COUNT_OVERRIDES: Record<string, { cap: number; note: string }> = {
  'psycho-pass': { cap: 41, note: 'First Inspector + films are watch-order events, not numbered episodes (Sean 2026-08-24)' },
  'monogatari-series': { cap: 100, note: 'community numbering excludes the 3 Second Season recaps (Sean 2026-08-24)' },
  'high-school-dxd': { cap: 48, note: "HERO's Episode 0 is a mid-run special the community's continuous numbering excludes — order-only (Sean 2026-08-24)" },
  'urusei-yatsura': { cap: 194, note: 'MAL/AniList count the farewell RECAP special (rebroadcast of ep 44 + countdown) as #194; Wikipedia holds it at 193.5 unnumbered — recap rule (Monogatari precedent): excluded, finale = 194 (research-verified 2026-08-23)' },
  'yu-yu-hakusho-ghostfiles': { cap: 112, note: 'TV run = 112; trailing extras (2009 Picture Drama, 2018 OVAs Two Shot/All or Nothing) are order-only — AFL renumbers them after drops, so the CAP is the durable instrument (the drop[113] alone let All or Nothing re-enter as 113; research batch 11, 2026-08-23)' },
  //   Clear Card = SEPARATE series (Sean 2026-08-24, the Naruto→Shippuden
  //   pattern: different manga, 87296). The shared AFL page numbers through
  //   93 — rows beyond 71 (1998 TV 1-70 + Prologue OVA 71) belong to
  //   cardcaptor-sakura-clear-card in its own 1-22 numbering
  'cardcaptor-sakura': { cap: 71, note: 'Clear Card split (Sean 2026-08-24); AFL page spans both series' },
  'eyeshield-21': { cap: 145, note: 'AFG\'s chart typos its finale row as "155." (the page has 145 rows) — the cap keeps the phantom from re-entering via extend/expansion (Sean 2026-08-25, §12.49); the anime is 145 episodes on every real source' },
  'project-arms': { cap: 52, note: 'AFL row 53 "PS2 Video Game" is a Bandai PS2 game absorbed as an episode row (air date 2002-03-28 sits BEFORE ep 52\'s — verifier-confirmed 2026-08-25); the anime is 52 eps (26+26). Cap keeps the phantom from re-entering on any AFL refresh' },
};

export function applyCommunityCap(
  seriesId: string,
  row: { aired_episodes?: number | null; total_episodes?: number | null },
) {
  const o = COMMUNITY_COUNT_OVERRIDES[seriesId];
  if (!o) return;
  if (row.aired_episodes != null) row.aired_episodes = Math.min(row.aired_episodes, o.cap);
  if (row.total_episodes != null) row.total_episodes = Math.min(row.total_episodes, o.cap);
}

// Research-ruled per-episode TYPE corrections (Sean 2026-08-23): where a
// source site misclasses episodes against community consensus, the ruling
// lives here and re-applies on every episode write — a bare DB update would
// be clobbered by the next AFL page refresh. Each entry carries citations.
//   x 21-24: the anime-original ending (manga on hiatus at broadcast) — AFL
//   classes them manga-canon; research verdict (xtvclamp.fandom, Wikipedia,
//   cbr.com) says original. anime-only-canon renders them truthfully (no
//   chapter counterpart BY DESIGN, not mapping-pending null).
// Research-ruled SOURCE SUPPRESSIONS (2026-08-23, the Claymore/Kimi lesson):
// same-episode precedence cannot stop a ruled-WRONG source value landing on
// a DIFFERENT episode — when research proves a source's frontier wrong for a
// series, that source is suppressed there entirely. Applied by the source's
// writer; verified outcome-side by the ruling_violation audit.
export const CONTINUA_SUPPRESSED: Record<string, string> = {
  claymore: 'continua says ep 26 → ch 54, but eps 24-26 are fully anime-original (research 2026-08-23) — the manual ep-20 → ch-56 anchor is the frontier',
  'kimi-ni-todoke-from-me-to-you': 'continua says ep 43 → ch 86 — ch 86 is unsupported anywhere (mid-vol 21, unadapted; research 2026-08-23); manual ep-44 → ch-75 is the frontier',
};

const range = (from: number, to: number, type: string) =>
  Object.fromEntries(Array.from({ length: to - from + 1 }, (_, i) => [from + i, type]));

export const EPISODE_TYPE_OVERRIDES: Record<string, Record<number, string>> = {
  x: { 21: 'anime-only-canon', 22: 'anime-only-canon', 23: 'anime-only-canon', 24: 'anime-only-canon' },
  //   RESEARCH BATCH 15 (2026-08-24, exact-record promotion — 2+ sources each,
  //   verdict JSONs in research/batch15/out):
  //   black-butler ep 3: Grelle subplot anime-original (ScreenRant explicit +
  //   fandom differences; AFL dissents — 2-of-3). bleach ep 149: adapts ch 247
  //   p.16-end in its closing minutes (fandom page-level + AFG 'Mixed'; AFL
  //   dissents). dagashi ep 11: second half anime-original framing around chs
  //   50/52/13. kamisama ep 10: ch-25 beats reworked into anime-only Christmas
  //   mixer + past-arc graft. dragon-maid 19-21/23: one segment per ep
  //   anime-original (fandom + Rory Muses per-episode reviews).
  //   naruto-shippuden 452-454/456-457: Itachi Shinden novel adaptation, zero
  //   manga pages (Narutopedia + AFG + Wikipedia S20) — licensed canon side
  //   story = anime-only-canon per the Boruto/Black Clover precedent (ep 455
  //   stays mixed: disputed ch-678 frame).
  'black-butler': { 3: 'mixed' },
  bleach: { 149: 'mixed' },
  'kamisama-kiss': { 10: 'mixed' },
  'miss-kobayashis-dragon-maid': { 19: 'mixed', 20: 'mixed', 21: 'mixed', 23: 'mixed' },
  'naruto-shippuden': { 452: 'anime-only-canon', 453: 'anime-only-canon', 454: 'anime-only-canon', 456: 'anime-only-canon', 457: 'anime-only-canon' },
  //   RESEARCH BATCH 17 (2026-08-24, gap tier — 2+ sources each, verdict
  //   JSONs in research/batch17/out). Sean's vocabulary (2026-08-24):
  //   anime-only-canon = made for the anime but standing as canon;
  //   filler = outside both canons (retconned or disposable).
  //   chrono-crusade: anime departs after ep 13 — 5/7/8/11/12 are original
  //   bridges on canon continuity, 14-21 the "primarily original" stretch
  //   that still pulls manga beats (Wikipedia lead + MU + ja-WP), 22-24 the
  //   original ending. kenichi 51: OAD 1 is an author-original scenario
  //   (ja-WP 原作者オリジナルの書き下ろし). rave-master 41: filler sites say
  //   filler, but its core IS ch 74 (Let joins / Silver Knights) — mixed.
  //   rurouni-kenshin-2023 34/44: zero chapters adapted (fandom blank +
  //   no Act page); 34 is Watsuki's own exhibition storyboard = canon-grade.
  //   sailor-moon 167-172: Nehelenia-revival arc, anime-original
  //   continuation of SuperS's villain. twin-star 20 mixed (canon to
  //   ~14:05) and 21-50 the anime's own serialized finale — never returns
  //   to the manga (contradicts it: Yuto dies here, survives there).
  //   world-trigger 48 = anime-original breather inside the canon arc;
  //   49-63 = the Fugitive Arc, RETCONNED by S2 → filler, not canon.
  'chrono-crusade': {
    ...range(5, 5, 'mixed'), ...range(7, 8, 'mixed'), ...range(11, 12, 'mixed'),
    ...range(14, 21, 'mixed'), ...range(22, 24, 'anime-only-canon'),
  },
  'kenichi-the-mightiest-disciple': { 51: 'mixed' },
  'rave-master': { 41: 'mixed' },
  'rurouni-kenshin-2023': { 34: 'anime-only-canon', 44: 'anime-only-canon' },
  //   rurouni-kenshin (1996) 79-82: were typed mixed, but the whole 63-94
  //   block is anime-original (batch-17 verdict: Wikipedia season-3 "not
  //   adapted from the manga" + AFL) — the Shimabara/Christian arc included.
  //   Found in Sean's post-switch review 2026-08-24: these four mistyped rows
  //   were why frontier_tail_null flagged the series (the audit was RIGHT;
  //   the earlier "false positive" framing was wrong). Rows 95-98 are the
  //   Trust & Betrayal OVAs adopted as episodes — real manga adaptation
  //   (Remembrance arc), kept canon, flagged for anchor research.
  'rurouni-kenshin': { 79: 'filler', 80: 'filler', 81: 'filler', 82: 'filler' },
  'sailor-moon': { ...range(167, 172, 'anime-only-canon') },
  'twin-star-exorcists': { 20: 'mixed', ...range(21, 50, 'anime-only-canon') },
  'world-trigger': { 48: 'anime-only-canon', ...range(49, 63, 'filler') },
  //   BATCH 17 CHUNK 1 WAVE 1 (Sean's rulings 2026-08-25; verdict JSONs in
  //   research/batch17/out + out2, each 2+ sources, cross-model verified
  //   where weight-bearing). Type semantics per Sean's 2026-08-25 ruling:
  //   mixed = canon AND non-canon in one episode; AFL/AFG advisory only.
  //   hellsing 7/10: ep 7 closes with ch 11-12 material inside an
  //   increasingly-original stretch; ep 10 adapts ch 2 as a rearranged
  //   flashback inside the original back half — both mixed.
  //   fist-of-the-north-star: 61/78/83 zero canon (Bugal filler, recap-block
  //   opener, filler — hokuto.fandom + Finn Clark part-3/4 reviews; AFL
  //   dissents, ruled fandom+accounting-beats-AFL); 58/75/84/86/91 carry
  //   canon alongside original material — mixed.
  //   sket-dance 26/32: AFL's table STOPS at ep 54 so its filler labels
  //   there are not typings — ep 26 adapts ch 180 in full (ja-WP subtitle =
  //   the chapter title), ep 32 adapts chs 18+45 → canon. ep 77: finale
  //   adapts ch 167 with an anime-original bookend → mixed.
  //   dragon-ball-z 100: Kanzenshuu ch 323 p.1-11 "Half Filler" + Dragon
  //   Universe manga field — 3 sources vs AFL alone → mixed.
  //   fairy-tail 256: closing act adapts ch 398 p.12-end (~9 pages, past
  //   the sliver line); Laxus/Tempester substitution is original → mixed.
  //   the-promised-neverland 23: adapts chs 172-178 beat-for-beat with
  //   ruled substitutions (Isabella lives, Emma keeps memories) → mixed.
  //   one-piece 737: the Sabo special adapts ch 794 (wiki fwd+reverse) —
  //   AFL's anime-canon label loses to the explicit chapter mapping → mixed.
  hellsing: { 7: 'mixed', 10: 'mixed' },
  //   zatch-bell contested block (Sean's overlap-rule re-research 2026-08-25,
  //   out2/zatch-bell-contested.json — konjikinogash.fandom per-episode
  //   manga_chapter fields + en-WP; the prior "all 10 filler" proposal rested
  //   on exhaustive accounting, ruled insufficient): 13/108/118/119/123 zero
  //   canon (119 = a re-staged REHASH of the ch 35-36 flashback already
  //   animated at eps 14-15 — the overlap rule's discount case); 51 (ch 22
  //   Germany half, held back 41 eps), 57 (chs 109-110 reworked), 103
  //   (ch 173 opening), 117 (ch 183 closing scene), 122 (ch 186 tail) all
  //   carry real canon → mixed.
  'zatch-bell': {
    13: 'filler', 108: 'filler', 118: 'filler', 119: 'filler', 123: 'filler',
    51: 'mixed', 57: 'mixed', 103: 'mixed', 117: 'mixed', 122: 'mixed',
  },
  //   BATCH 17 WAVE 2 (Sean's rulings 2026-08-25, verifier-confirmed where
  //   weight-bearing; verdicts in research/batch17/out):
  //   kinnikuman 120-137: the two anime-original arcs — author-COMMISSIONED
  //   but never author-declared canon; the 1991 sequel continuity-overwrites
  //   their timeline slot (ja-WP verbatim) and the canon-signal hunt came up
  //   empty → filler (were anime-only-canon).
  //   trigun 6: adapts ch 0 prologue + ch 4's opening inside original
  //   framing; 16: adapts ch 16 + ch 20's Angel Arm climax (episode title =
  //   chapter title) inside the divergence zone → mixed.
  //   hayate 10: anime-only per Wikipedia outright + only S1 canon-numbered
  //   fandom page with no Adapted From → filler; 19: canon + original mix.
  //   saint-seiya 64: JP title = ch 39's title (Sagittarius trials are
  //   Toei's) → mixed.
  kinnikuman: { ...range(120, 137, 'filler') },
  //   eyeshield-21 (Sean's sign-off 2026-08-25; base verdict + contested
  //   re-research out2/eyeshield-21-contested.json; the 19-block verified
  //   per-episode AND double-sourced via ja-WP's 備考 column): import took
  //   AFG titles but never mapped its filler flag → all defaulted canon.
  //   45/46 exhibition, 89-95 Cream Puff Cup, 96 recap, 97-105 Death Game
  //   (101 EXCLUDED — canon island chs 168-169), 108 whodunnit, 51 fake-
  //   Eyeshield, 109/110 (relocation hypothesis REFUTED on content) → filler.
  //   39 recap + canon scene, 66 ch-133 tag, 88 ch-100 4-koma intervals in
  //   original framing (wiki states mixed outright), 74 ch-150 content in
  //   flagged-original episode → mixed.
  'eyeshield-21': {
    45: 'filler', 46: 'filler', ...range(89, 100, 'filler'), ...range(102, 105, 'filler'),
    108: 'filler', 51: 'filler', 109: 'filler', 110: 'filler',
    39: 'mixed', 66: 'mixed', 88: 'mixed', 74: 'mixed',
  },
  trigun: { 6: 'mixed', 16: 'mixed' },
  'hayate-the-combat-butler': { 10: 'filler', 19: 'mixed' },
  'saint-seiya-knights-of-the-zodiac': { 64: 'mixed' },
  'fist-of-the-north-star': {
    61: 'filler', 78: 'filler', 83: 'filler',
    58: 'mixed', 75: 'mixed', 84: 'mixed', 86: 'mixed', 91: 'mixed',
  },
  'sket-dance': { 26: 'canon', 32: 'canon', 77: 'mixed' },
  'dragon-ball-z': { 100: 'mixed' },
  'fairy-tail': { 256: 'mixed' },
  'the-promised-neverland': { 23: 'mixed' },
  'one-piece': { 737: 'mixed' },
  //   claymore 24-26: fully anime-original ending (Madhouse outran the
  //   manga) — research verdict 2026-08-23 (AFG + wheredoestheanimeleaveoff
  //   + sportskeeda), Sean sign-off
  claymore: { 24: 'anime-only-canon', 25: 'anime-only-canon', 26: 'anime-only-canon' },
  //   black-clover 130-157: zero manga chapters adapted anywhere in the
  //   stretch (blackclover.fandom infoboxes all empty + animefillerguide +
  //   animefillerlist agree; research batch 8, 2026-08-23) — manga position
  //   holds at ch 228 until canon resumes at ep 158 → ch 229-231.
  //   Tabata-supervised side stories = anime-only-canon; the disputed
  //   131/134-135 and the Devil Banishers arc 142-149 = filler (2-of-3
  //   sources).
  'black-clover': {
    ...range(130, 130, 'anime-only-canon'),
    ...range(131, 131, 'filler'),
    ...range(132, 133, 'anime-only-canon'),
    ...range(134, 135, 'filler'),
    ...range(136, 141, 'anime-only-canon'),
    ...range(142, 149, 'filler'),
    ...range(150, 157, 'anime-only-canon'),
  },
  //   boruto 221-286: five ANIME-CANON arcs between the Kawaki arc end
  //   (ep 220 → ch 55) and Code's Assault (287-293 = chs 56-67) — Chunin
  //   Re-Exam, Kirigakure war, Kawaki Academy, Labyrinth, Sasuke Retsuden.
  //   TRAP: animefillerlist marks 282-293 'Manga Canon' crediting the
  //   Sasuke Retsuden SPIN-OFF manga — trusting it would falsely advance
  //   Boruto chapter progress (research batch 11, 2026-08-23:
  //   narutopedia arc pages + animefillerguide + cbr).
  'boruto-naruto-next-generations': range(221, 286, 'anime-only-canon'),
  //   gto: anime-original mid-series block + the original ending (caught
  //   up to the manga) — fandom infoboxes list Manga Chapter(s) = N/A;
  //   mangashed + wheredoestheanimeleaveoff call 42-43 non-canon
  //   (research batch 11, 2026-08-23).
  'gto-great-teacher-onizuka': {
    ...range(22, 28, 'anime-only-canon'),
    ...range(34, 34, 'anime-only-canon'),
    ...range(42, 43, 'anime-only-canon'),
  },
  //   railgun: S1 back half (Big Spider/Poltergeist) + S's Silent Party are
  //   anime-original (director-confirmed); ep 14 EXCEPTED — it grafts manga
  //   ch 17 (research batch 12, 2026-08-23: animefillerlist + fandom arc
  //   pages + Wikipedia).
  'a-certain-scientific-railgun': {
    ...range(13, 13, 'anime-only-canon'),
    ...range(15, 24, 'anime-only-canon'),
    ...range(41, 48, 'anime-only-canon'),
  },
  //   ajin S2 (14-26) is anime-original from the start with a non-canon
  //   ending (research batch 12: WDTALO + mangashed + per-episode breakdown);
  //   canon resumes at manga ch 22.
  'ajin-demi-human': range(14, 26, 'anime-only-canon'),
  //   hunter-x-hunter (1999) ep 7: AFL types it filler, but Hunterpedia's
  //   page-level 'Adapted' field has it adapting ch 7 p.3-9,12-19 + ch 8
  //   p.2-4 (Wikipedia's summary + AniB's phase ranges agree on the content)
  //   — research batch 14 (2026-08-23 s2), anchored ep7→7
  'hunter-x-hunter': { 7: 'mixed' },
  // ---- research batch 14 (2026-08-23 s2) type corrections, 2+ sources each
  //   beastars Final Season: ep 44 adapts no chapter (reviewer recap vs every
  //   chapter synopsis 149-196); eps 37/42 mix anime-original plots with 141 / 155.
  //   ep 44 SEAN-RULED anime-only-canon 2026-08-24 on positive evidence
  //   (batch15/out/beastars-ep44-followup.json): chs 169-171 = cut Kyuu
  //   chapters, 172-176 in ep 47, frame-up/rat-base/kiss-deferral content
  //   matches no chapter in 161-179 (the manga's ch-173 first kiss is
  //   relocated to the ep-48 finale). Caveat: flips to mixed if the
  //   step-stool line is ever confirmed inside ch 166.
  beastars: { 37: 'mixed', 42: 'mixed', 44: 'anime-only-canon' },
  //   cardcaptor-sakura: Wood/Rain (4) and Silent (7) are anime-only cards with
  //   anime-original plots; 5 (ch-1 flashback video only) and 39 (Cloud, on the
  //   premise of ch 33) are mixed; Clear Card 76, 83-87 anime-original, 82 mixed
  'cardcaptor-sakura': { 4: 'filler', 5: 'mixed', 7: 'filler', 39: 'mixed' },
  //   Clear Card (separate series, Sean 2026-08-24): our old 76/82-87 in the
  //   split entry's own numbering (−71)
  'cardcaptor-sakura-clear-card': { 5: 'anime-only-canon', 11: 'mixed', 12: 'anime-only-canon', 13: 'anime-only-canon', 14: 'anime-only-canon', 15: 'anime-only-canon', 16: 'anime-only-canon' },
  //   dagashi-kashi ep 10 'That's Dagashi!': anime-original sick-Hotaru story
  //   with gag fragments only (MAL reader posts, Inquisitr, WDTALO list, fandom);
  //   ep 11 second half anime-original station-farewell framing around chs
  //   50/52/13 (research batch 15, 2026-08-24)
  'dagashi-kashi': { 10: 'mixed', 11: 'mixed' },
  //   reborn 111-112: fights against anime-only characters with anime-original
  //   box weapons (ja.wikipedia アニメオリジナル匣 + fandom Future Arc page)
  reborn: { 111: 'mixed', 112: 'mixed' },
  //   slime ep 30 (S2E6): adapts 54-55 (Rimuru/Hinata) but the whole Tempest
  //   segment is anime-original (fandom adaptation notes + batch-14 review)
  'that-time-i-got-reincarnated-as-a-slime': { 30: 'mixed' },
};

// SOURCE NUMBERING TRANSLATION (Sean's ruling 2026-08-23, the Dr. Stone /
// Ryuusui lesson): a source that NUMBERS an entry our community count holds
// order-only lives in a different numbering space — its rows past the
// insert must shift into ours, and the insert's own row drops (it exists as
// a watch-order component, never an episode). Without this, titles AND
// types downstream of the insert are silently off by the insert's length.
//   drop: source-space numbers whose rows are the order-only entry itself
//   shifts: source number n ≥ from maps to our number n + offset
//   spaces (optional, 2026-08-25 the mashle lesson): the SOURCE SPACES the
//   shift applies to ('afl' | 'afg' | 'wiki'). Absent = every space (the
//   historical entries: AFL and AFG both number the dropped entry). Sources
//   can genuinely disagree about one series' numbering — mashle's recap is
//   integer ep 7 on AFL but "6.5" (excluded) on AFG/fandom/Wikipedia — so a
//   blanket shift would corrupt the already-aligned source. Every caller
//   states its space; the shift skips spaces it does not name.
export const SOURCE_NUMBERING_SHIFTS: Record<string, { drop: number[]; shifts: { from: number; offset: number }[]; spaces?: string[] }> = {
  'dr-stone': { drop: [36], shifts: [{ from: 37, offset: -1 }] }, // AFL numbers the Ryuusui special as ep 36; our ruling holds it order-only at position 36
  // Queue-2 Group C demotions (Sean sign-off 2026-08-23): standalone
  // bonuses/films the community does not number — order-only by ruling;
  // AFL numbers them, so its rows translate on every refresh.
  'yu-yu-hakusho-ghostfiles': { drop: [113], shifts: [] }, // Picture Drama bonus
  'miss-kobayashis-dragon-maid': { drop: [14], shifts: [{ from: 15, offset: -1 }] }, // Valentine/Onsen bonus OVA
  'fate-kaleid-liner-prisma-illya': { drop: [11], shifts: [{ from: 12, offset: -1 }] }, // Undoukai DE Dance bonus
  // mashle (Sean's fractional ruling 2026-08-25, CHUNK1-RECOVERY.md §9): the
  // S1 recap is integer ep 7 in AFL's numbering only — AFG/fandom/Wikipedia/
  // AniList all exclude it (fandom calls it "Episode 6.5"). Our rows follow
  // the community convention: recap = watch-order entry at 6.5, main rows
  // 1-24. AFL-space rows translate; AFG chart numbers are ALREADY in our
  // space and must not shift.
  'mashle-magic-and-muscles': { drop: [7], shifts: [{ from: 8, offset: -1 }], spaces: ['afl'] },
  'prison-school': { drop: [13], shifts: [] }, // Mad Wax bonus OVA
  'to-love-ru-darkness': { drop: [25, 26], shifts: [] }, // 2nd Specials bonuses
  'ghost-in-the-shell-stand-alone-complex': { drop: [53], shifts: [] }, // Solid State Society is a FILM (movies order-only unless community-numbered)
  'yu-gi-oh-2000': { drop: [225], shifts: [] }, // Dark Side of Dimensions is a FILM
  //   AFL counts the 2017 OVA 'Hitori Ayumu' as ep 25 (aired between S2 and
  //   S3), shifting S3+ by +1 vs the community's 60-episode TV numbering —
  //   research batch 8 (2026-08-23): fandom's 'Episode 61' = TV ep 60
  //   'Twilight Goodbye'. The OVA holds watch position 24.5 (order-only,
  //   adapts ~ch 40 side material).
  'bungo-stray-dogs': { drop: [25], shifts: [{ from: 26, offset: -1 }] },
  //   AFL counts the anime-original OVA 'Vampire Shahal' (May 2016) as a
  //   trailing ep 25; only 24 TV episodes exist (research batch 9,
  //   2026-08-23). No shift — the row is at the end. OVA holds watch
  //   position 24.5 (order-only, adapts no manga).
  'seraph-of-the-end-vampire-reign': { drop: [25], shifts: [] },
  //   Netflix lists a ~14-min RECAP special ('S3 Episode 00') as a sixth S3
  //   item; AFL numbers it as a trailing ep 44 — only 43 story episodes
  //   exist (research batch 10, 2026-08-23). Recap rule: excluded.
  'kimi-ni-todoke-from-me-to-you': { drop: [44], shifts: [] },
};

// Translate ONE source-space episode number into ours (null = the number IS
// a dropped order-only entry). Anchor/annotation writers use this so a
// shift-ruled series (Bungo's OVA row, Dr. Stone's Ryuusui) can never
// receive per-episode data at untranslated numbers — the same rule
// filterEpisodeRows applies to episode rows (gap closed 2026-08-23,
// Sean's bake-into-sources directive).
export const translateEpisodeNumber = (seriesId: string, n: number, space: string): number | null => {
  const t = SOURCE_NUMBERING_SHIFTS[seriesId];
  if (!t || (t.spaces && !t.spaces.includes(space))) return n;
  if (t.drop.includes(n)) return null;
  return n + t.shifts.reduce((s, x) => (n >= x.from ? s + x.offset : s), 0);
};

// Per-series episode-row rulings, applied by EVERY episode writer:
// source-numbering translation first, then community caps, then type
// overrides.
export const filterEpisodeRows = <T extends { number: number; type?: string }>(seriesId: string, rows: T[], space: string): T[] => {
  const t0 = SOURCE_NUMBERING_SHIFTS[seriesId];
  const t = t0 && (!t0.spaces || t0.spaces.includes(space)) ? t0 : undefined;
  let translated = rows;
  if (t) {
    translated = rows
      .filter((r) => !t.drop.includes(r.number))
      .map((r) => ({ ...r, number: r.number + t.shifts.reduce((s, x) => (r.number >= x.from ? s + x.offset : s), 0) }));
  }
  const o = COMMUNITY_COUNT_OVERRIDES[seriesId];
  const capped = o ? translated.filter((r) => r.number <= o.cap) : translated;
  const types = EPISODE_TYPE_OVERRIDES[seriesId];
  if (!types) return capped;
  return capped.map((r) => (types[r.number] && 'type' in r ? { ...r, type: types[r.number] } : r));
};

export function applyEpisodeFloor(
  seriesId: string,
  row: { aired_episodes?: number | null; total_episodes?: number | null },
  epMax: number,
) {
  if (!epMax) return;
  const aired = row.aired_episodes ?? 0;
  const overshoot = epMax - Math.max(aired, row.total_episodes ?? 0);
  if (overshoot <= 0) return;
  if (overshoot > 2 && !EXTRAS_ADOPTED.has(seriesId)) return; // flag-first: research before adopting
  row.aired_episodes = Math.max(aired, epMax);
  if (row.total_episodes != null) row.total_episodes = Math.max(row.total_episodes, epMax);
}

export async function refreshStitchedVolatile(seriesId: string) {
  // order-only components (null episode range — Kizu movies, Psycho-Pass
  // films) hold watch-order positions and NEVER count toward aired/totals
  const { data: comps } = await db
    .from('series_components')
    .select('anilist_id')
    .eq('series_id', seriesId)
    .not('episode_start', 'is', null);
  if (!comps?.length) return;
  const media: AniListMedia[] = [];
  for (const c of comps) {
    const { data } = await db.from('ingest_anilist_media').select('raw').eq('anilist_id', c.anilist_id).maybeSingle();
    if (data) media.push(data.raw as AniListMedia);
  }
  if (!media.length) return;
  const aired = (m: AniListMedia) => (m.nextAiringEpisode ? m.nextAiringEpisode.episode - 1 : m.episodes ?? 0);
  const statuses = new Set(media.map((m) => m.status));
  const releasing = media.find((m) => m.status === 'RELEASING');
  const weightSum = media.reduce((s, m) => s + m.popularity, 0) || 1;
  const { data: topEp } = await db
    .from('episodes')
    .select('number')
    .eq('series_id', seriesId)
    .order('number', { ascending: false })
    .limit(1);
  const volatile = {
    aired_episodes: media.reduce((s, m) => s + aired(m), 0),
    total_episodes: media.every((m) => m.episodes != null) ? media.reduce((s, m) => s + (m.episodes ?? 0), 0) : null,
  };
  applyEpisodeFloor(seriesId, volatile, topEp?.[0]?.number ?? 0);
  applyCommunityCap(seriesId, volatile);
  await db
    .from('series')
    .update({
      ...volatile,
      status: statuses.has('RELEASING')
        ? 'airing'
        : statuses.has('NOT_YET_RELEASED')
          ? 'upcoming'
          : statuses.has('HIATUS')
            ? 'hiatus'
            : 'finished',
      next_airing_at: releasing?.nextAiringEpisode
        ? new Date(releasing.nextAiringEpisode.airingAt * 1000).toISOString()
        : null,
      popularity: Math.max(...media.map((m) => m.popularity)),
      average_score: Math.round(media.reduce((s, m) => s + (m.averageScore ?? 0) * m.popularity, 0) / weightSum) || null,
      trending: Math.max(...media.map((m) => m.trending ?? 0)) || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', seriesId);
}

// The identity registry (data-pipeline.md): external ids map INTO our id.
// A different series already holding the id is a hard error — the exact
// cross-source mixup the registry exists to prevent.
export async function registerIds(
  seriesId: string,
  ids: Record<string, string | number | null | undefined>,
) {
  for (const [source, val] of Object.entries(ids)) {
    if (val == null) continue;
    const external_id = String(val);
    const { error } = await db.from('series_external_ids').insert({ series_id: seriesId, source, external_id });
    if (!error) continue;
    if (error.code !== '23505') throw new Error(`registerIds(${seriesId}/${source}): ${error.message}`);
    const { data: existing } = await db
      .from('series_external_ids')
      .select('series_id, external_id')
      .eq('source', source)
      .eq('external_id', external_id)
      .maybeSingle();
    if (existing && existing.series_id !== seriesId) {
      throw new Error(
        `ID COLLISION: ${source}:${external_id} already maps to "${existing.series_id}", refused for "${seriesId}"`,
      );
    }
    if (!existing) {
      // (series_id, source) unique hit: this series' id for the source changed
      await db
        .from('series_external_ids')
        .update({ external_id })
        .eq('series_id', seriesId)
        .eq('source', source);
    }
  }
}

const STOP = new Set(['the', 'a', 'an', 'of', 'on', 'in', 'to', 'and', 'no', 'wa', 'ga']);
const titleTokens = (s: string) =>
  new Set(
    decodeSlug(s)
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((w) => w && !STOP.has(w)),
  );

// Loose match: enough shared tokens that this is plausibly the same show.
export function titlesAgree(a: string, b: string): boolean {
  const ta = titleTokens(a);
  const tb = titleTokens(b);
  if (!ta.size || !tb.size) return true;
  let hit = 0;
  for (const w of ta) if (tb.has(w)) hit++;
  return hit / Math.min(ta.size, tb.size) >= 0.5;
}

export async function stageAfl(
  runId: number,
  slug: string,
  page: AflShowPage,
  meta: { etag: string | null; lastModified: string | null; expectedTitle?: string },
): Promise<StageOutcome> {
  // AFL alias corruption, two forms (both real, 2026-08-22): the URL serves
  // another show's page. Episode links betray it when the node kept its true
  // alias; when Drupal swapped the primary alias the links lie too, and only
  // the index-anchor title exposes it. Never stage another show's data.
  const aliasMismatch = page.canonicalSlug && decodeSlug(page.canonicalSlug) !== decodeSlug(slug);
  const titleMismatch = meta.expectedTitle && !titlesAgree(meta.expectedTitle, page.title);
  if (aliasMismatch || titleMismatch) {
    await fileFlagOnce(runId, slug, 'afl', 'parse_integrity', {
      aliasServes: page.canonicalSlug,
      servedTitle: page.title,
      expectedTitle: meta.expectedTitle ?? null,
    });
    return 'held';
  }

  const raw = { title: page.title, episodes: page.episodes, quickList: page.quickList };
  const hash = contentHash(raw);

  const { data: prev, error: readErr } = await db
    .from('ingest_afl_shows')
    .select('raw, content_hash')
    .eq('slug', slug)
    .maybeSingle();
  if (readErr) throw new Error(`stageAfl read (${slug}): ${readErr.message}`);

  if (prev?.content_hash === hash) return 'unchanged';

  if (prev) {
    const oldTypes = new Map(
      (prev.raw as { episodes: { number: number; type: string }[] }).episodes.map((e) => [e.number, e.type]),
    );
    const changedTypes = page.episodes.filter(
      (e) => oldTypes.has(e.number) && oldTypes.get(e.number) !== e.type,
    ).length;
    if (oldTypes.size > 0 && changedTypes / oldTypes.size > LARGE_DIFF_RATIO) {
      await fileFlag(runId, slug, 'afl', 'large_diff', {
        changedTypes,
        previousCount: oldTypes.size,
        proposed: raw,
      });
      return 'held';
    }
  }

  const { error } = await db.from('ingest_afl_shows').upsert({
    slug,
    raw,
    content_hash: hash,
    etag: meta.etag,
    last_modified: meta.lastModified,
    fetched_at: new Date().toISOString(),
    changed_at: new Date().toISOString(),
  });
  if (error) throw new Error(`stageAfl write (${slug}): ${error.message}`);
  return 'changed';
}

export async function stageAniList(media: AniListMedia): Promise<StageOutcome> {
  const hash = contentHash(media);
  const { data: prev, error: readErr } = await db
    .from('ingest_anilist_media')
    .select('content_hash')
    .eq('anilist_id', media.id)
    .maybeSingle();
  if (readErr) throw new Error(`stageAniList read (${media.id}): ${readErr.message}`);
  if (prev?.content_hash === hash) {
    await db.from('ingest_anilist_media').update({ fetched_at: new Date().toISOString() }).eq('anilist_id', media.id);
    return 'unchanged';
  }
  const { error } = await db.from('ingest_anilist_media').upsert({
    anilist_id: media.id,
    raw: media,
    content_hash: hash,
    fetched_at: new Date().toISOString(),
    changed_at: new Date().toISOString(),
  });
  if (error) throw new Error(`stageAniList write (${media.id}): ${error.message}`);
  return 'changed';
}

export const STATUS_MAP: Record<string, string> = {
  RELEASING: 'airing',
  FINISHED: 'finished',
  HIATUS: 'hiatus',
  NOT_YET_RELEASED: 'upcoming',
  CANCELLED: 'finished',
};

export const MANGA_STATUS_MAP: Record<string, string> = {
  RELEASING: 'publishing',
  FINISHED: 'finished',
  HIATUS: 'hiatus',
  NOT_YET_RELEASED: 'publishing',
  CANCELLED: 'finished',
};

export function sourceType(media: AniListMedia, hasMangaEdge: boolean): string {
  const src = media.source ?? '';
  if (src === 'MANGA' || src === 'DOUJINSHI' || src === 'ONE_SHOT') {
    return media.countryOfOrigin === 'KR' || media.countryOfOrigin === 'CN' ? 'webtoon' : 'manga';
  }
  if (src === 'LIGHT_NOVEL' || src === 'NOVEL' || src === 'WEB_NOVEL') return 'light_novel';
  // no declared source but a manga ADAPTATION edge exists: old AniList
  // entries often omit `source` — the edge is evidence of a manga source
  if (!src && hasMangaEdge) return 'manga';
  return 'original';
}

export function fuzzyDate(d: { year: number | null; month: number | null; day: number | null }): string | null {
  // Display only uses years; month/day default to 1 when AniList omits them.
  if (!d.year) return null;
  return `${d.year}-${String(d.month ?? 1).padStart(2, '0')}-${String(d.day ?? 1).padStart(2, '0')}`;
}

// The source manga: ADAPTATION edge, format MANGA, most popular on ties.
export function pickManga(media: AniListMedia) {
  const candidates = media.relations.edges
    .filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA' && e.node.format === 'MANGA')
    .sort((a, b) => (b.node.popularity ?? 0) - (a.node.popularity ?? 0));
  return candidates[0]?.node ?? null;
}

// A season of natural lag between AFL's classified count and AniList's aired
// count is noise; more than that deserves eyes. Informational — resolve proceeds.
const COUNT_MISMATCH_THRESHOLD = 12;

export async function resolveSeries(runId: number, slug: string): Promise<{ episodes: number; flagged: boolean }> {
  const [{ data: afl, error: e1 }, { data: map, error: e2 }] = await Promise.all([
    db.from('ingest_afl_shows').select('raw').eq('slug', slug).maybeSingle(),
    db.from('source_map').select('anilist_id, mal_id').eq('afl_slug', slug).maybeSingle(),
  ]);
  if (e1 || e2) throw new Error(`resolve read (${slug}): ${(e1 ?? e2)!.message}`);
  if (!afl || !map?.anilist_id) throw new Error(`resolve (${slug}): missing staging or mapping`);

  const { data: alRow, error: e3 } = await db
    .from('ingest_anilist_media')
    .select('raw')
    .eq('anilist_id', map.anilist_id)
    .maybeSingle();
  if (e3) throw new Error(`resolve read anilist (${slug}): ${e3.message}`);
  if (!alRow) throw new Error(`resolve (${slug}): AniList ${map.anilist_id} not staged`);

  const media = alRow.raw as AniListMedia;
  const page = afl.raw as AflShowPage;

  // A show AFL hasn't classified yet has nothing for us to map — hold rather
  // than publish an empty instrument.
  if (page.episodes.length === 0) {
    await fileFlagOnce(runId, slug, 'resolve', 'parse_integrity', { empty: true });
    return { episodes: 0, flagged: true };
  }

  // AniList's ADAPTATION edge is DIRECTIONLESS: on an anime-original show
  // (source=ORIGINAL) the linked manga is an adaptation OF the anime, not
  // source material — never attach it (Evangelion/Madoka class, 2026-08-23).
  const mangaEdge = pickManga(media);
  const manga = media.source === 'ORIGINAL' ? null : mangaEdge;

  // A STITCHED series (multiple components) is owned by the stitcher — a
  // plain resolve would collapse it back to one season. Refresh only the
  // episode rows (AFL's data) and leave the aggregate to the next stitch run.
  const { data: existing } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
  if (existing) {
    const { count: compCount } = await db
      .from('series_components')
      .select('*', { count: 'exact', head: true })
      .eq('series_id', existing.id);
    if ((compCount ?? 0) > 1) {
      // MERGE, not full replace: AFL owns only its own numbering range —
      // rows beyond it (AFG-filled tails, curated specials) must survive a
      // page refresh. The boundary uses the TRANSLATED max: AFL's numbering
      // can sit +N of ours past an order-only insert (Ryuusui), and
      // deleting to the source-space max would eat rows the translation
      // doesn't refill.
      const stitchedRows = filterEpisodeRows(
        existing.id,
        page.episodes.map((e) => ({
          series_id: existing.id,
          number: e.number,
          title: e.title,
          type: e.type,
          air_date: e.airDate,
        })),
        'afl',
      );
      const ourPageMax = stitchedRows.reduce((m, e) => Math.max(m, e.number), 0);
      await db.from('episodes').delete().eq('series_id', existing.id).lte('number', ourPageMax);
      // STALE-ZONE healing (Sean 2026-08-23): when translation SHRINKS the
      // range (ourMax < source max), rows stranded in (ourMax, sourceMax]
      // are pre-translation leftovers wearing shifted titles — purge them
      // (an AFG tail re-extends; stale wrong data never self-heals)
      const srcMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
      if (srcMax > ourPageMax) {
        await db.from('episodes').delete().eq('series_id', existing.id).gt('number', ourPageMax).lte('number', srcMax);
      }
      for (let i = 0; i < stitchedRows.length; i += 500) {
        const { error } = await db.from('episodes').insert(stitchedRows.slice(i, i + 500));
        if (error) throw new Error(`episodes refresh (${slug}): ${error.message}`);
      }
      await db.from('series').update({ updated_at: new Date().toISOString() }).eq('id', existing.id);
      return { episodes: stitchedRows.length, flagged: false };
    }
  }

  // Canonical id is OUR slug: once assigned to this afl_slug it is stable
  // (app identity survives AFL renames); new series slugify their title, with
  // year → anilist id as collision tiebreakers.
  const { data: prior } = await db.from('series').select('id').eq('afl_slug', slug).maybeSingle();
  let id = prior?.id ?? null;
  if (!id) {
    const base = slugify(media.title.english ?? media.title.romaji ?? page.title);
    for (const candidate of [base, `${base}-${media.startDate.year ?? ''}`, `${base}-${media.id}`]) {
      const clean = candidate.replace(/-$/, '');
      const { data: clash } = await db.from('series').select('afl_slug').eq('id', clean).maybeSingle();
      if (!clash || clash.afl_slug === slug) {
        id = clean;
        break;
      }
    }
    if (!id) throw new Error(`resolve (${slug}): could not assign id`);
  }

  const aflMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
  const anilistAired = media.nextAiringEpisode
    ? media.nextAiringEpisode.episode - 1
    : media.episodes ?? aflMax;

  // Sparse-classification hold (2026-08-22): some AFL pages were never fully
  // classified by the community (Kinnikuman: 4 of 137). A FINISHED show with
  // under 60% coverage publishes a misleading strip — hold it; it returns
  // automatically once AFL classification grows past the bar.
  if (
    media.status !== 'RELEASING' &&
    media.episodes != null &&
    page.episodes.length < media.episodes * 0.6
  ) {
    await fileFlagOnce(runId, slug, 'resolve', 'count_mismatch', {
      sparse: true,
      aflClassified: page.episodes.length,
      anilistTotal: media.episodes,
    });
    return { episodes: 0, flagged: true };
  }

  let flagged = false;
  if (Math.abs(anilistAired - aflMax) > COUNT_MISMATCH_THRESHOLD) {
    await fileFlag(runId, slug, 'resolve', 'count_mismatch', {
      aflClassified: aflMax,
      anilistAired,
    });
    flagged = true;
  }

  const series = {
    id,
    afl_slug: slug,
    anilist_id: media.id,
    mal_id: media.idMal,
    title: media.title.english ?? media.title.romaji ?? page.title,
    title_english: media.title.english,
    title_native: media.title.native,
    synonyms: media.synonyms,
    cover_url: media.coverImage.extraLarge,
    cover_color: media.coverImage.color,
    banner_url: media.bannerImage,
    format: media.format,
    status: STATUS_MAP[media.status] ?? 'finished',
    source_type: sourceType(media, mangaEdge !== null),
    start_date: fuzzyDate(media.startDate),
    end_date: fuzzyDate(media.endDate),
    season: media.season,
    season_year: media.seasonYear,
    total_episodes: media.episodes,
    aired_episodes: anilistAired,
    next_airing_at: media.nextAiringEpisode
      ? new Date(media.nextAiringEpisode.airingAt * 1000).toISOString()
      : null,
    duration_min: media.duration,
    average_score: media.averageScore,
    mean_score: media.meanScore,
    popularity: media.popularity,
    favourites: media.favourites,
    trending: media.trending,
    genres: media.genres,
    tags: media.tags,
    studios: media.studios.nodes.map((s) => s.name),
    is_adult: media.isAdult,
    synopsis_html: media.description,
    external_links: media.externalLinks,
    manga_anilist_id: manga?.id ?? null,
    manga_status: manga ? MANGA_STATUS_MAP[manga.status ?? ''] ?? 'publishing' : 'anime_only',
    ...(await applyScope(slug, {
      total_volumes: manga?.volumes ?? null,
      total_chapters: manga?.chapters ?? null,
      manga_start_volume: null,
      manga_start_chapter: null,
    })),
    search_text: searchTextFor(
      [media.title.english, media.title.romaji, media.title.native, page.title],
      media.synonyms,
    ),
    updated_at: new Date().toISOString(),
  };
  applyEpisodeFloor(id, series, aflMax);
  applyCommunityCap(id, series);

  const { error: e4 } = await db.from('series').upsert(series);
  if (e4) throw new Error(`series upsert (${slug}): ${e4.message}`);
  await registerIds(id, { anilist: media.id, mal: media.idMal, afl: slug });

  // MERGE within AFL's own numbering range (staging writes already passed
  // the hash/large-diff gates); rows beyond aflMax — AFG tails, curated
  // specials — survive. Community-count caps drop rows the consensus does
  // not number (Psycho-Pass 42-44).
  const rows = filterEpisodeRows(id, page.episodes.map((e) => ({
    series_id: id,
    number: e.number,
    title: e.title,
    type: e.type,
    air_date: e.airDate,
  })), 'afl');
  // translated-max boundary (see the stitched-guard note): never delete past
  // what the translated rows refill
  const ourMax = rows.reduce((m, e) => Math.max(m, e.number), 0) || aflMax;
  const { error: e5 } = await db.from('episodes').delete().eq('series_id', id).lte('number', ourMax);
  if (e5) throw new Error(`episodes clear (${slug}): ${e5.message}`);
  // stale-zone healing (see the stitched-guard note)
  if (aflMax > ourMax) {
    await db.from('episodes').delete().eq('series_id', id).gt('number', ourMax).lte('number', aflMax);
  }
  for (let i = 0; i < rows.length; i += 500) {
    const { error: e6 } = await db.from('episodes').insert(rows.slice(i, i + 500));
    if (e6) throw new Error(`episodes insert (${slug}): ${e6.message}`);
  }

  // Baseline component row — kept in step by every resolve; the stitcher
  // replaces these with full chains for multi-season series.
  const { error: e7 } = await db.from('series_components').upsert({
    series_id: id,
    anilist_id: media.id,
    season_order: 1,
    episode_start: 1,
    episode_end: media.episodes ?? anilistAired ?? null,
    afl_slug: slug,
    afl_offset: 0,
  });
  if (e7) throw new Error(`component (${slug}): ${e7.message}`);

  return { episodes: rows.length, flagged };
}
