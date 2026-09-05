// I45's RULING LAYER — the researched facts of a related work (Sean ruled (b)/(c),
// 2026-09-05): a standing, the chapters it adapts, a position, keyed by the OWNER
// series + the work's AniList id. The ledger writer (sync-related-works) writes a
// ruled standing over the rule's (relatedWorkStanding), the adaptation fields from
// the entry, and a ruled position over the derived one; the census
// (related_work_violation) reads the same map, so a stored row that disagrees is a
// listing until the healer runs. Every entry lands from a verdict — never from a
// sitting's guess (R1); the recap shows a ruled standing as "(ruled)".
//   the row keeps origin 'halo' (the row is the ledger's; the FACTS are ruled).
import type { RulingEntry } from './types';

export type RelatedWorkRuling = {
  /** the work's AniList id — the key beside seriesId */
  anilistId: number;
  /** the researched standing under T28's bar (canon | mixed | filler); absent = the rule's standing stands */
  standing?: 'canon' | 'mixed' | 'filler';
  /** the adaptation record, in the watch_order_entries vocabulary (A-family: a position claim needs its chapters) */
  chapter?: number | null;
  volume?: number | null;
  chaptersAdapted?: string | null;
  /** a ruled position in the run (overrides the derived air-date position AND the label map's RULED_POSITION_BY_ANILIST) */
  position?: number;
  /** a short note the ledger row carries after the bucket note */
  note?: string;
  /** REPAIRS (P8): the row's title / air date / kind are rewritten from AniList's staging on every run — a ruled value here beats the source (a wrong AniList date, a mis-titled entry, a compilation AniList files as a special); the census lists a row that disagrees */
  title?: string;
  airDate?: string | null;
  kind?: 'movie' | 'ova' | 'special' | 'recap';
};

export const ENTRIES: RulingEntry<RelatedWorkRuling>[] = [
  // ---- WAVE 1 (films first), Sean ruled 2026-09-05 — eight works, two cluster positions; every note carries the verifier's corrections
  {
    seriesId: 'demon-slayer-kimetsu-no-yaiba',
    ruleId: 'I45',
    value: { anilistId: 112151, standing: 'canon', chapter: 66, volume: 8, chaptersAdapted: '54 (from p. 5 — pp. 1-4 are ep 26\'s) to 66, vols 7-8', note: 'This work IS our rows 28-33: the theatrical feature split into six TV episodes (about 70 new cuts); row 27 is an anime-original prologue. A viewer takes one path or the other. The grave-visit prologue and the studio beats inside adapted chapters are faithfulness-clause slivers (T28). Position 26.5 on the page split: ep 26 ends at ch 54 p. 4.' },
    reason:
      "Wave 1 (research-agent, verified R24 SOUND WITH NOTES): a straight, in-order adaptation of the owner's manga, ch 54 p. 5 to the end of ch 66 — MangaUpdates' S1 / S2 page pins and the Kimetsu Wiki's page-partitioned episode fields agree; ja-WP: vols 7-8. The verifier corrected the note (the bento is p. 5 onward, the film's; the 70-cut figure is AV Watch's / ja-WP's anime article; MU segments by TV season). Sean 2026-09-05: canon, 26.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/demon-slayer-kimetsu-no-yaiba__112151.json', 'scripts/ingest/research/discovery/verify/demon-slayer-kimetsu-no-yaiba__112151.md'],
  },
  {
    seriesId: 'demon-slayer-kimetsu-no-yaiba',
    ruleId: 'I45',
    value: { anilistId: 178788, standing: 'canon', chapter: 157, volume: 18, chaptersAdapted: '140-157 (157 pp. 1-6, partial); the ch 139 opening is re-shown from ep 63, position-less', note: 'Part 1 of the Infinity Castle trilogy (第一章 猗窩座再来; AniList\'s title is the trilogy name — a display-label question for the surfacing pass, never a second row). Parts 2 and 3 are separate ids, undated, unpositioned. Position 63.5: ep 63 ends at ch 139, the film starts at 140.' },
    reason:
      "Wave 1 (verified SOUND WITH NOTES): the Kimetsu Wiki's film infobox prints 140-157 (p. 1-6) and MangaUpdates pins Vol 16 Chap 140 → Vol 18 Chap 156 (MU names the last chapter adapted in full; the straddle into 157 rests on the wiki and en-WP's plot). Realsound's inventory of the studio additions is all flourish (T28 faithfulness clause). Sean 2026-09-05: canon, 63.5; no Part 1 row; related-work coverage does not feed the series frontier until ruled.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/demon-slayer-kimetsu-no-yaiba__178788.json', 'scripts/ingest/research/discovery/verify/demon-slayer-kimetsu-no-yaiba__178788.md'],
  },
  {
    seriesId: 'chainsaw-man',
    ruleId: 'I45',
    value: { anilistId: 171627, standing: 'canon', chapter: 52, volume: 6, chaptersAdapted: '39-52 (the Bomb Girl arc entire; the post-credits scene is ch 52\'s own close); the pre-title cold open plays ch 38 pp. 23-25 as scraps — A10, START 39', note: 'Directly after ep 12 (END 38): the arc begins at the next chapter, no gap, no overlap; the manga continues at ch 53 (the announced 刺客篇, format unannounced). Additions are expansions of adapted scenes (T28).' },
    reason:
      "Wave 1 (verified SOUND WITH NOTES): fandom arc page + all 14 chapter pages + en-WP's volume list (vol 5 = 35-43, vol 6 = 44-52) put the film at ch 39 → 52; the official continuity quote (坂田将吾: 地続き, the next day). The verifier found the cold open also plays ch 38's waking / punch pages (23-25), first-time but scraps under A10 — START stays 39, the note names the tail. Sean 2026-09-05: canon, 12.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/chainsaw-man__171627.json', 'scripts/ingest/research/discovery/verify/chainsaw-man__171627.md'],
  },
  {
    seriesId: 'konosuba-gods-blessing-on-this-wonderful-world',
    ruleId: 'I45',
    value: { anilistId: 102976, standing: 'mixed', chapter: null, volume: 5, chaptersAdapted: 'LN vol 5 ch 1-6 (the ch 1-2 trek and vol 5\'s Epilogue are cut — both land in S3 ep 1; the Prologue unaccounted) + the closing scene of vol 4\'s Epilogue (Yunyun\'s declaration, first-time)', position: 20.52, note: 'MIXED (Sean 2026-09-05, T28\'s recap boundary): the post-Railgun act — Sylvia\'s resurrection, Kazuma\'s death and return — and the Red Prison sequence are an original climax of significant length beside a real source share. Ruled to 20.52: the S2 OVA (2017, @20.51) precedes it in the fandom\'s order.' },
    reason:
      "Wave 1 (verified SOUND WITH NOTES, standing corrected to MIXED): the owner's instrument is Akatsuki's light novel; the film adapts vol 5 ch 1-6 (fandom LN range + manga map ch 43-53; ja-WP 第2期の後・原作第5巻; the licensor's STORY page and the Sneaker Bunko blurb tell the same story) with two holes S3 ep 1 fills. Every source agrees the post-Railgun act is anime-original and the film's dramatic peak — the Shippuden-388 shape Sean ruled mixed. Position after the S2 OVA per the fandom's navigation (ep 20 → OVA 2 → Movie → ep 21).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/konosuba-gods-blessing-on-this-wonderful-world__102976.json', 'scripts/ingest/research/discovery/verify/konosuba-gods-blessing-on-this-wonderful-world__102976.md'],
  },
  {
    seriesId: 'made-in-abyss',
    ruleId: 'I45',
    value: { anilistId: 101343, position: 13.5, note: 'Journey\'s Dawn (compilation of S1 eps 1-8, 2019-01-04) — filler by rule (N8); ruled first in the 13.5 cluster: the two compilations precede the feature they lead into, in date order.' },
    reason:
      "Sean 2026-09-05 (wave 1, the Made in Abyss cluster): the writer had slotted the feature at 13.5 and the two recap films behind it in iteration order; the sourced order is Journey's Dawn, Wandering Twilight, then Dawn of the Deep Soul. Identity is the AniList id; the position is the ruled order.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/made-in-abyss__100643.json', 'scripts/ingest/research/discovery/verify/made-in-abyss__100643.md'],
  },
  {
    seriesId: 'made-in-abyss',
    ruleId: 'I45',
    value: { anilistId: 101344, position: 13.51, note: 'Wandering Twilight (compilation of S1 eps 9-13 with new footage, 2019-01-18) — filler by rule (N8); second in the 13.5 cluster.' },
    reason:
      "Sean 2026-09-05 (wave 1, the Made in Abyss cluster): ruled second, after Journey's Dawn and before the feature (ja-WP: both compilations carry 新規カット; the Series Continuity page lists a new Movie-2 scene — N8 keeps them recap / filler).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/made-in-abyss__100643.json', 'scripts/ingest/research/discovery/verify/made-in-abyss__100643.md'],
  },
  {
    seriesId: 'made-in-abyss',
    ruleId: 'I45',
    value: { anilistId: 100643, standing: 'canon', chapter: 38, volume: 5, chaptersAdapted: '26 (pp. 12-16 — pp. 1-11 are ep 13\'s) to 38 (ch 27-38 in full; ch 37 pp. 17-18 also in the Together with Papa OVA); the rest of vol 4 and all of vol 5', position: 13.52, note: 'Starts where ep 13 stops inside ch 26 and ends at ch 38; the second TV season (unheld — a halo candidate) continues at ch 39. Ruled to 13.52 behind the two compilation films. Mezameru Shinpi (2026) adapts chapters after S2 and re-derives when S2 is held.' },
    reason:
      "Wave 1 (verified SOUND WITH NOTES): three independent instruments (the Made in Abyss Wiki's film page refs 026 → 038, MangaUpdates' Vol 4 Chap 26 → Vol 5 Chap 38 segment, ja-WP 第4巻の途中から第5巻) agree; the ch 26 page split against ep 13 was verified in batch 20 wave 6; the seven movie-only beats are slivers (T28). Sean 2026-09-05: canon, ruled third in the 13.5 cluster.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/made-in-abyss__100643.json', 'scripts/ingest/research/discovery/verify/made-in-abyss__100643.md'],
  },
  {
    seriesId: 'saga-of-tanya-the-evil',
    ruleId: 'I45',
    value: { anilistId: 100878, standing: 'mixed', chapter: null, volume: 4, chaptersAdapted: 'LN vol 4: ch 1-3 in substance (ch 3\'s Tiegenhoff substantially altered), ch 4 outcome only, ch 6 opening (the 1926-06-25 call) as the epilogue; ch 5 NOT adapted; framed by vol 1\'s 1967 Andrew–Schugel interlude', note: 'MIXED (Sean 2026-09-05): the Commonwealth multinational force, Mary\'s Moskva and Tiegenhoff clashes, Vivi and the eleven-minute duel are anime-only (ja-WP 年表 アニメのみ) — a story-carrying original share the film\'s own staff call its theme; the novel\'s Dodobird engagement (ch 5) is not adapted. S2 opens after the epilogue; the Pasta Operation short (2021) is a prequel sitting before the film in watch order.' },
    reason:
      "Wave 1 (verified SOUND WITH NOTES, standing corrected to MIXED): ja-WP's 作中の年表 (原作 4巻 / 劇場版 rows), the fandom's vol 4 chapter pages and a reader's dated scene index of the printed volume agree on ch 1-3 + ch 4's outcome + ch 6's first scene; the same timeline marks the film's Mary clashes アニメのみ and the novel's ch 5 clash unadapted — no source states a relocation. Sean 2026-09-05: mixed; ch 5 not adapted; 12.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/saga-of-tanya-the-evil__100878.json', 'scripts/ingest/research/discovery/verify/saga-of-tanya-the-evil__100878.md'],
  },
  {
    seriesId: 'goblin-slayer',
    ruleId: 'I45',
    value: { anilistId: 108623, standing: 'canon', chapter: null, volume: 5, chaptersAdapted: 'LN vol 5 ch 1-7 (the whole volume; the interlude 待っている人たちのお話 omitted — issued as a Kagyu-written drama CD)', note: 'S1 (rows 1-12) adapts vols 1-2 (+ vol 4 ch 1 in ep 5) and ends on vol 1 ch 13 at ep 12; GOBLIN SLAYER II opens on vol 6. 59 min (Eirin) / 60; filed as an OVA in Japanese databases, a theatrical release; the 85-min figure is the Western listing.' },
    reason:
      "Wave 1 (verified SOUND WITH NOTES): the Goblin Slayer Wiki (an adaptation of the fifth light novel; the title is vol 5 ch 6's), ANN's review (volume 5, condensed) and SB Creative's vol-5 blurb matching the licensor's synopsis; the Movie Notes list only cuts and reorders (T28). The verifier's apply guidance: volume 5 with a chapter string, never a bare chapter 1 (the owner has no chapter space). Sean 2026-09-05: canon, 12.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/goblin-slayer__108623.json', 'scripts/ingest/research/discovery/verify/goblin-slayer__108623.md'],
  },
  {
    seriesId: 'slam-dunk',
    ruleId: 'I45',
    value: { anilistId: 128207, standing: 'mixed', chapter: 276, volume: 31, chaptersAdapted: '223-276 (the Sannoh match, abridged; 276 partial — the Shohoku-side epilogue replaced; 216-222 not adapted)', note: 'MIXED (Sean 2026-09-05): the Ryota thread (Okinawa, Sota, the crash — partly from Inoue\'s unnumbered 1998 one-shot ピアス) and the epilogue are original; Inoue 原作・脚本・監督 is the credit, not an adoption — the manga never took the thread in. Continues the run: the TV series stops at ch 197 (ep 96); ch 198-222 (Toyotama, the Sannoh build-up) are animated nowhere — 25 chapters exist only in print between ep 101 and this film.' },
    reason:
      "Wave 1 (verified SOUND WITH NOTES): MangaUpdates' own segment (Vol 25 Chap 223 → Vol 31 Chap 276, abridged with an original epilogue), en-WP and ja-WP (Ryota takes top credit; original flashbacks and a new epilogue) and the fandom agree; the TV run's terminal 197 is the stored G56 anchor. Sean 2026-09-05: mixed — a substantial source share beside a substantial original share; the author's film credit is recorded in the note, not as adopted{author} (T26's adoptions put material into the source line; this screenplay exists only as the film). The verdict's ep-94 flag was wrong (stored canon, anchored 196) and is struck.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/slam-dunk__128207.json', 'scripts/ingest/research/discovery/verify/slam-dunk__128207.md'],
  },
];

/** series id → anilist id → the ruling */
export const RELATED_WORK_RULINGS: Record<string, Record<number, RelatedWorkRuling>> = {};
for (const e of ENTRIES) (RELATED_WORK_RULINGS[e.seriesId] ??= {})[e.value.anilistId] = e.value;

export const relatedWorkRuling = (seriesId: string, anilistId: number): RelatedWorkRuling | null => RELATED_WORK_RULINGS[seriesId]?.[anilistId] ?? null;
