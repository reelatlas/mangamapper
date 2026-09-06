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
  // ---- WAVE 2 (the owner triage), Sean ruled 2026-09-05 with Cursor: the originals are filler by ruling (their verdicts cited; the note is the researcher's first sentence);
  // six adapt ANOTHER run and say so; the repairs (P8) ride on the entries; the two music videos have no entry (the promo test removes their rows)
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'I45',
    value: { anilistId: 9047, standing: 'filler', airDate: '2010-10-29', note: "original (triage): Anime-original OVA (#EX 御坂さんはいま注目の的ですから). · repair (P8): the disc release 2010-10-29 (the official site, ja-WP); AniList's 09-26 is unsupported" },
    reason:
      "Owner triage (triage__a-certain-scientific-railgun.json): Toaru Kagaku no Railgun: Misaka-san wa Ima Chuumoku no Mato Desukara adapts no chapters of the instrument — Anime-original OVA (#EX 御坂さんはいま注目の的ですから).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__a-certain-scientific-railgun.json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Toaru%20Kagaku%20no%20Railgun%20OVA&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%81%A8%E3%81%82%E3%82%8B%E7%A7%91%E5%AD%A6%E3%81%AE%E8%B6%85%E9%9B%BB%E7%A3%81%E7%A0%B2%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json","https://toaru-project.com/railgun/goods/bddvd/ova.html"],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'I45',
    value: { anilistId: 8023, standing: 'filler', note: "original (triage): The two S1 MMR bonus discs (MMR I, 超電磁DISC1 with BD/DVD vol 1, 2010-01-29; MMR II, 超電磁DISC2 with vol 5, 2010-05-28) — chibi outtake/parody skits." },
    reason:
      "Owner triage (triage__a-certain-scientific-railgun.json): Toaru Kagaku no Railgun: Motto Marutto Railgun adapts no chapters of the instrument — The two S1 MMR bonus discs (MMR I, 超電磁DISC1 with BD/DVD vol 1, 2010-01-29; MMR II, 超電磁DISC2 with vol 5, 2010-05-28) — chibi outtake/parody skits.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__a-certain-scientific-railgun.json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Motto%20Marutto%20Railgun%20Episode%2001&prop=wikitext&format=json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Motto%20Marutto%20Railgun%20Episode%2002&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%81%A8%E3%81%82%E3%82%8B%E7%A7%91%E5%AD%A6%E3%81%AE%E8%B6%85%E9%9B%BB%E7%A3%81%E7%A0%B2%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json"],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'I45',
    value: { anilistId: 9063, standing: 'filler', note: "original (triage): Anime-original 4-5 minute short (numbered #13' by both wikis), bundled on the DVD attached to the Railgun OFFICIAL VISUAL BOOK." },
    reason:
      "Owner triage (triage__a-certain-scientific-railgun.json): Toaru Kagaku no Railgun: Entenka no Satsuei Model mo Raku ja Arimasen wa ne. adapts no chapters of the instrument — Anime-original 4-5 minute short (numbered #13' by both wikis), bundled on the DVD attached to the Railgun OFFICIAL VISUAL BOOK.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__a-certain-scientific-railgun.json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Toaru%20Kagaku%20no%20Railgun%20Episode%2013%27&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%81%A8%E3%81%82%E3%82%8B%E7%A7%91%E5%AD%A6%E3%81%AE%E8%B6%85%E9%9B%BB%E7%A3%81%E7%A0%B2%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json","https://www.kadokawa.co.jp/product/201007000200/"],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'I45',
    value: { anilistId: 19697, standing: 'filler', note: "original (triage): The two Railgun S MMR bonus discs (MMR III with BD/DVD vol 1, 2013-07-24; MMR IV with vol 5, 2013-11-27) — the same chibi parody format." },
    reason:
      "Owner triage (triage__a-certain-scientific-railgun.json): A Certain Scientific Railgun S Specials adapts no chapters of the instrument — The two Railgun S MMR bonus discs (MMR III with BD/DVD vol 1, 2013-07-24; MMR IV with vol 5, 2013-11-27) — the same chibi parody format.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__a-certain-scientific-railgun.json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Motto%20Marutto%20Railgun%20Episode%2003&prop=wikitext&format=json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Motto%20Marutto%20Railgun%20Episode%2004&prop=wikitext&format=json","https://toaru-project.com/railgun_s/goods/bddvd/01.html"],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'I45',
    value: { anilistId: 20686, standing: 'filler', airDate: '2014-03-27', note: "original (triage): Anime-original short (#特典 大事なことはぜんぶ銭湯に教わった) on the Blu-ray attached to the Railgun S OFFICIAL VISUAL BOOK. · repair (P8): Kadokawa: 2014-03-27" },
    reason:
      "Owner triage (triage__a-certain-scientific-railgun.json): A Certain Scientific Railgun S: All the Important Things I Learned in a Bathhouse adapts no chapters of the instrument — Anime-original short (#特典 大事なことはぜんぶ銭湯に教わった) on the Blu-ray attached to the Railgun S OFFICIAL VISUAL BOOK.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__a-certain-scientific-railgun.json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Toaru%20Kagaku%20no%20Railgun%20S%20OVA&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%81%A8%E3%81%82%E3%82%8B%E7%A7%91%E5%AD%A6%E3%81%AE%E8%B6%85%E9%9B%BB%E7%A3%81%E7%A0%B2%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json","https://www.kadokawa.co.jp/product/312031400000/"],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'I45',
    value: { anilistId: 122041, standing: 'filler', note: "original (triage): The two Railgun T MMR bonus features (MMR V on BD/DVD Vol." },
    reason:
      "Owner triage (triage__a-certain-scientific-railgun.json): Toaru Kagaku no Railgun T: Motto Marutto Railgun adapts no chapters of the instrument — The two Railgun T MMR bonus features (MMR V on BD/DVD Vol.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__a-certain-scientific-railgun.json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Motto%20Marutto%20Railgun%20Episode%2005&prop=wikitext&format=json","https://toarumajutsunoindex.fandom.com/api.php?action=parse&page=Motto%20Marutto%20Railgun%20Episode%2006&prop=wikitext&format=json","https://toaru-project.com/railgun_t/bd/"],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'I45',
    value: { anilistId: 20811, standing: 'filler', note: "filler for this owner — adapts the spin-off manga 進撃の巨人 悔いなき選択 (Gun Snark / Suruga, 2 vols) — a different run: decision (d) candidate; never 'original'" },
    reason:
      "Owner triage (triage__attack-on-titan.json): Attack on Titan: No Regrets adapts no chapters of the instrument — OTHER INSTRUMENT — decision (d), not a mainline adaptation.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__attack-on-titan.json","https://attackontitan.fandom.com/api.php?action=parse&page=A%20Choice%20with%20No%20Regrets%3A%20Part%20One&prop=wikitext&format=json","https://attackontitan.fandom.com/api.php?action=parse&page=Attack%20on%20Titan%3A%20No%20Regrets&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E9%80%B2%E6%92%83%E3%81%AE%E5%B7%A8%E4%BA%BA&prop=wikitext&format=json"],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'I45',
    value: { anilistId: 108942, standing: 'filler', note: "original (triage): ORIGINAL — the Flash chibi gag shorts ｢進撃の巨人｣ちみキャラ劇場“とんでけ！新生リヴァイ班”, carried as 映像特典 on the Season 3 Blu-ray/DVD volumes; this AniList entry is vols 1-4 (2018-10-17, 2018-12-19, 2019-01-30, 2019-02-27 — the stored date matches vol 1 exactly), which ja-WP's per-volume table … (see the verdict)" },
    reason:
      "Owner triage (triage__attack-on-titan.json): Shingeki no Kyojin: Chimi Kyara Gekijou - Rivai-han adapts no chapters of the instrument — ORIGINAL — the Flash chibi gag shorts ｢進撃の巨人｣ちみキャラ劇場“とんでけ！新生リヴァイ班”, carried as 映像特典 on the Season 3 Blu-ray/DVD volumes; this AniList entry is vols 1-4 (2018-10-17, 2018-12-19, 2019-01-30, 2019-02-27 — the stored date matches vol 1 exactly), which ja-WP's per-volume table numbers as segments #38-#49, the same span AniList's own description gives.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__attack-on-titan.json","https://shingeki.tv/season3/product/season3_1.php","https://shingeki.tv/season3/product/season3_5.php","https://ja.wikipedia.org/w/api.php?action=parse&page=%E9%80%B2%E6%92%83%E3%81%AE%E5%B7%A8%E4%BA%BA%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json"],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'I45',
    value: { anilistId: 19391, standing: 'filler', title: 'Shingeki no Kyojin: Chimi Kyara Gekijou - Tondeke! Kunren Heidan', note: "original (triage): ORIGINAL — and MIS-TITLED: this entry is not a picture drama, it is the SEASON 1 chibi theatre 「進撃の巨人」ちみキャラ劇場“とんでけ! 訓練兵団” (MAL 19391 and Kitsu 7889 both carry exactly that Japanese title for this id, 9 videos, 2013-07-17 → 2014-03-19 — the same nine dates as the S1 BD/DVD … (see the verdict) · repair (P8): MAL 19391 / Kitsu 7889 / the licensor's S1 line-up: the entry is the S1 chibi theatre; 'Picture Drama' survives on MAL as a synonym only" },
    reason:
      "Owner triage (triage__attack-on-titan.json): Attack on Titan Picture Drama adapts no chapters of the instrument — ORIGINAL — and MIS-TITLED: this entry is not a picture drama, it is the SEASON 1 chibi theatre 「進撃の巨人」ちみキャラ劇場“とんでけ! 訓練兵団” (MAL 19391 and Kitsu 7889 both carry exactly that Japanese title for this id, 9 videos, 2013-07-17 → 2014-03-19 — the same nine dates as the S1 BD/DVD volumes, and the stored date matches vol 1).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__attack-on-titan.json","https://shingeki.tv/season1/products/bd_01.php","https://shingeki.tv/season1/products/bd_09.php","https://attackontitan.fandom.com/api.php?action=parse&page=Chibi%20Theater%3A%20Fly%2C%20Cadets%2C%20Fly!&prop=wikitext&format=json"],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'I45',
    value: { anilistId: 120257, standing: 'filler', note: "original (triage): ORIGINAL — the same ちみキャラ劇場“とんでけ！新生リヴァイ班” shorts, continued on Season 3 Blu-ray/DVD vols 5, 6 and 7 (2019-07-24, 2019-08-21, 2019-09-18 — the stored date matches vol 5), which ja-WP's table numbers as segments #50-#59; AniList's own description says three videos of three stories each." },
    reason:
      "Owner triage (triage__attack-on-titan.json): Shingeki no Kyojin: Chimi Kyara Gekijou - Rivai-han Part 2 adapts no chapters of the instrument — ORIGINAL — the same ちみキャラ劇場“とんでけ！新生リヴァイ班” shorts, continued on Season 3 Blu-ray/DVD vols 5, 6 and 7 (2019-07-24, 2019-08-21, 2019-09-18 — the stored date matches vol 5), which ja-WP's table numbers as segments #50-#59; AniList's own description says three videos of three stories each.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__attack-on-titan.json","https://shingeki.tv/season3/product/season3_5.php","https://shingeki.tv/season3/product/season3_7.php","https://ja.wikipedia.org/w/api.php?action=parse&page=%E9%80%B2%E6%92%83%E3%81%AE%E5%B7%A8%E4%BA%BA%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json"],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'I45',
    value: { anilistId: 139754, standing: 'filler', note: "original (triage): ORIGINAL — the same chibi theatre, one video on each of The Final Season Blu-ray/DVD vols 1 and 2 (2021-07-07 and 2021-08-04; the stored date matches vol 1)." },
    reason:
      "Owner triage (triage__attack-on-titan.json): Attack On Titan: The Final Season Specials adapts no chapters of the instrument — ORIGINAL — the same chibi theatre, one video on each of The Final Season Blu-ray/DVD vols 1 and 2 (2021-07-07 and 2021-08-04; the stored date matches vol 1).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__attack-on-titan.json","https://shingeki.tv/final/product/final_1/","https://shingeki.tv/final/product/final_2/","https://animaru.jp/anmr/product/P2100324"],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'I45',
    value: { anilistId: 110640, standing: 'filler', airDate: '2017-04-10', note: "original (triage): ORIGINAL PROMOTIONAL SHORT — 進撃の巨塔 ~attack on SKYTREE~, made for the Tokyo Skytree collaboration event that ran 2017-04-10 → 2017-07-14. · repair (P8): the Skytree event opened 2017-04-10 (shingeki.tv, the venue, MAL)" },
    reason:
      "Owner triage (triage__attack-on-titan.json): Attack on Skytree adapts no chapters of the instrument — ORIGINAL PROMOTIONAL SHORT — 進撃の巨塔 ~attack on SKYTREE~, made for the Tokyo Skytree collaboration event that ran 2017-04-10 → 2017-07-14.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__attack-on-titan.json","https://shingeki.tv/news/archives/2761","https://shingeki.tv/news/archives/3109","http://web.archive.org/web/20170427015101/http://www.tokyo-skytree.jp:80/event/special/shingeki2017/"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 6115, standing: 'filler', note: "original (triage): Original crossover TV special (NTV 55th / ytv 50th anniversary, 金曜特別ロードショー 2009-03-27): ja-WP's infobox gives 原作=モンキー・パンチ、青山剛昌 (the two franchises' creator credits) and 脚本=前川淳 (Atsushi Maekawa); DCW's page prints the same screenplay credit and notes it is 'officially a Lupin III TV Special'." },
    reason:
      "Owner triage (triage__detective-conan.json): Lupin the 3rd Vs Detective Conan adapts no chapters of the instrument — Original crossover TV special (NTV 55th / ytv 50th anniversary, 金曜特別ロードショー 2009-03-27): ja-WP's infobox gives 原作=モンキー・パンチ、青山剛昌 (the two franchises' creator credits) and 脚本=前川淳 (Atsushi Maekawa); DCW's page prints the same screenplay credit and notes it is 'officially a Lupin III TV Special'.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Lupin_III_vs._Detective_Conan&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%AB%E3%83%91%E3%83%B3%E4%B8%89%E4%B8%96VS%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3_(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 18429, standing: 'filler', note: "original (triage): Original crossover feature (2013-12-07), the sequel to the 2009 special: ja-WP's Infobox Film gives 原作=モンキー・パンチ／青山剛昌 and 脚本=前川淳; DCW's page gives the same director/screenplay pair and describes it as the second crossover between the two franchises, commemorating five anniversaries." },
    reason:
      "Owner triage (triage__detective-conan.json): Lupin the 3rd Vs Detective Conan: The Movie adapts no chapters of the instrument — Original crossover feature (2013-12-07), the sequel to the 2009 special: ja-WP's Infobox Film gives 原作=モンキー・パンチ／青山剛昌 and 脚本=前川淳; DCW's page gives the same director/screenplay pair and describes it as the second crossover between the two franchises, commemorating five anniversaries.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Lupin_III_vs._Detective_Conan:_The_Movie&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%AB%E3%83%91%E3%83%B3%E4%B8%89%E4%B8%96VS%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3_THE_MOVIE&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AE%E6%BC%AB%E7%94%BB%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 1369, standing: 'filler', note: "filler for this owner — adapts MAGIC KAITO vol 3 ch 5 (Aoyama's other run) — the IP is already declared (anilist:2514 → magic-kaito); this OVA's row is Conan's related work, filler here" },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: Conan vs. Kid vs. Yaiba adapts no chapters of the instrument — OVA 1 (2000-10-11).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Conan_vs._Kid_vs._Yaiba_-_The_Grand_Battle_for_the_Treasure_Sword!!&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 2512, standing: 'filler', note: "original (triage): OVA 2 「16人の容疑者!?」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: 16 Suspects adapts no chapters of the instrument — OVA 2 「16人の容疑者!?」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=16_Suspects!%3F&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 2513, standing: 'filler', note: "original (triage): OVA 3 「コナンと平次と消えた少年」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: Conan and Heiji and the Vanished Boy adapts no chapters of the instrument — OVA 3 「コナンと平次と消えた少年」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Conan,_Heiji,_and_the_Vanished_Boy&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 2515, standing: 'filler', note: "original (triage): OVA 5 「標的は小五郎!! 少年探偵団マル秘調査」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: The Target is Kogoro! The Detective Boys' Secret Investigation adapts no chapters of the instrument — OVA 5 「標的は小五郎!! 少年探偵団マル秘調査」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=The_Target_is_Kogoro!!_The_Detective_Boys'_Secret_Report&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 1368, standing: 'filler', note: "original (triage): OVA 6 「消えたダイヤを追え! コナン・平次vsキッド!」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Meitantei Conan: Kieta Daiya wo Oe! Conan & Heiji vs Kid! adapts no chapters of the instrument — OVA 6 「消えたダイヤを追え! コナン・平次vsキッド!」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Follow_the_Vanished_Diamond!_Conan_%26_Heiji_vs._Kid!&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 2597, standing: 'filler', note: "original (triage): OVA 7 「阿笠からの挑戦状! 阿笠vsコナン&少年探偵団」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: A Challenge from Agasa! Agasa vs. Conan and the Detective Boys adapts no chapters of the instrument — OVA 7 「阿笠からの挑戦状! 阿笠vsコナン&少年探偵団」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=A_Challenge_from_Agasa!_Agasa_vs._Conan_and_the_Detective_Boys&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 6198, standing: 'filler', note: "original (triage): OVA 8 「女子高生探偵 鈴木園子の事件簿」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: High School Girl Detective Sonoko Suzuki's Case Files adapts no chapters of the instrument — OVA 8 「女子高生探偵 鈴木園子の事件簿」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=The_Casebook_of_Female_High-School_Detective_Sonoko_Suzuki&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 6438, standing: 'filler', note: "original (triage): OVA 9 「10年後の異邦人」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: The Stranger in 10 Years... adapts no chapters of the instrument — OVA 9 「10年後の異邦人」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=The_Stranger_from_Ten_Years_Later&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 8609, standing: 'filler', note: "original (triage): OVA 10 「KID in TRAP ISLAND」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: Kid in Trap Island adapts no chapters of the instrument — OVA 10 「KID in TRAP ISLAND」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Kid_in_Trap_Island&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 10703, standing: 'filler', note: "original (triage): OVA 11 「ロンドンからのマル秘指令!」 — an anime-original episode." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: A Secret Order from London adapts no chapters of the instrument — OVA 11 「ロンドンからのマル秘指令!」 — an anime-original episode.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=A_Secret_Order_From_London&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 13839, standing: 'filler', note: "filler for this owner — adapts Aoyama's 1988 one-shot 「えくすかりばあ」 (青山剛昌短編集) — a one-shot tie-in, never a series; rides with the per-work programme like Road to Ninja" },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed: The Miracle of Excalibur adapts no chapters of the instrument — OVA 12 (2012).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=The_Miracle_of_Excalibur&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%81%88%E3%81%8F%E3%81%99%E3%81%8B%E3%82%8A%E3%81%B0%E3%81%82&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 5348, standing: 'filler', note: "original (triage): MAGIC FILE 2 「工藤新一 謎の壁と黒ラブ事件」 (2008-04-19) — an anime-original short made for the 7-Eleven movie tie-in disc." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed Magic File 2: Kudou Shinichi - The Case of the Mysterious Wall and the Black Lab adapts no chapters of the instrument — MAGIC FILE 2 「工藤新一 謎の壁と黒ラブ事件」 (2008-04-19) — an anime-original short made for the 7-Eleven movie tie-in disc.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Magic_File_2:_Shinichi_Kudo,_The_Case_of_the_Mysterious_Wall_and_the_Black_Lab&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 6231, standing: 'filler', note: "original (triage): MAGIC FILE 3 「新一と蘭・麻雀牌と七夕の思い出」 (2009-04-18) — an anime-original short made for the 7-Eleven movie tie-in disc." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed Magic File 3: Shinichi and Ran - Memories of Mahjong Tiles and Tanabata adapts no chapters of the instrument — MAGIC FILE 3 「新一と蘭・麻雀牌と七夕の思い出」 (2009-04-18) — an anime-original short made for the 7-Eleven movie tie-in disc.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Magic_File_3:_Shinichi_and_Ran,_Memories_of_Mahjong_Tiles_and_Tanabata&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 8331, standing: 'filler', note: "original (triage): MAGIC FILE 4 「大阪お好み焼きオデッセイ」 (2010-04-17) — an anime-original short made for the 7-Eleven movie tie-in disc." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed Magic File 4: Osaka Okonomiyaki Odyssey adapts no chapters of the instrument — MAGIC FILE 4 「大阪お好み焼きオデッセイ」 (2010-04-17) — an anime-original short made for the 7-Eleven movie tie-in disc.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Magic_File_4:_The_Osaka_Okonomiyaki_Odyssey&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 10531, standing: 'filler', note: "original (triage): MAGIC FILE 5 「新潟〜東京 おみやげ狂騒曲」 (2011-04-16) — an anime-original short made for the 7-Eleven movie tie-in disc." },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed Magic File 5: Niigata - Tokyo Omiyage Capriccio adapts no chapters of the instrument — MAGIC FILE 5 「新潟〜東京 おみやげ狂騒曲」 (2011-04-16) — an anime-original short made for the 7-Eleven movie tie-in disc.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Magic_File_5:_Niigata~Tokyo_Souvenir_Capriccio&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 13837, standing: 'filler', title: 'Detective Conan: BONUS FILE - Fantasista no Hana', note: "original (triage): BONUS FILE 1 「ファンタジスタの花」 (2012-04-14) — 'Magic File 6' is a fan label; both wikis call it BONUS FILE 1 and DCW redirects Magic File 6 → Bonus File 1 — an anime-original short made for the 7-Eleven movie tie-in disc. · repair (P8): the product is BONUS FILE ファンタジスタの花 (ja-WP); 'Magic File 6' is a fan-database path" },
    reason:
      "Owner triage (triage__detective-conan.json): Case Closed Magic File 6: Fantasista Flower adapts no chapters of the instrument — BONUS FILE 1 「ファンタジスタの花」 (2012-04-14) — 'Magic File 6' is a fan label; both wikis call it BONUS FILE 1 and DCW redirects Magic File 6 → Bonus File 1 — an anime-original short made for the 7-Eleven movie tie-in disc.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Bonus_File_1:_Flower_of_Fantasista&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AEOVA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=OVAs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 9785, standing: 'filler', note: "original (triage): A 2005 event 3D short screened exclusively at the サントリーアイマックスシアター (Tempozan, Osaka) as a special item of Yomiuri TV's 「天保山10デイズわくわく宝島」 event — ja-WP's Conan anime article lists both under §3Dアニメ as event screenings with no 原作 story credit." },
    reason:
      "Owner triage (triage__detective-conan.json): Meitantei Conan: Conan vs. Kid - SHARK & JEWEL adapts no chapters of the instrument — A 2005 event 3D short screened exclusively at the サントリーアイマックスシアター (Tempozan, Osaka) as a special item of Yomiuri TV's 「天保山10デイズわくわく宝島」 event — ja-WP's Conan anime article lists both under §3Dアニメ as event screenings with no 原作 story credit.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Conan_vs._Kid:_Shark_%26_Jewel&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3_(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AE%E6%BC%AB%E7%94%BB%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 9786, standing: 'filler', note: "original (triage): A 2006 event 3D short screened exclusively at the サントリーアイマックスシアター (Tempozan, Osaka) as a special item of Yomiuri TV's 「天保山10デイズわくわく宝島」 event — ja-WP's Conan anime article lists both under §3Dアニメ as event screenings with no 原作 story credit." },
    reason:
      "Owner triage (triage__detective-conan.json): Meitantei Conan: Conan vs. Kid - Shikkoku no Sniper adapts no chapters of the instrument — A 2006 event 3D short screened exclusively at the サントリーアイマックスシアター (Tempozan, Osaka) as a special item of Yomiuri TV's 「天保山10デイズわくわく宝島」 event — ja-WP's Conan anime article lists both under §3Dアニメ as event screenings with no 原作 story credit.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Conan_vs._Kid:_The_Pitch-Black_Sniper&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3_(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AE%E6%BC%AB%E7%94%BB%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 198369, standing: 'filler', note: "original (triage): Theatrical film 29 「名探偵コナン ハイウェイの堕天使」 (2026-04-10) — an original screenplay by 大倉崇裕 (Takahiro Okura, his fifth Conan film) directed by 蓮井隆弘; ja-WP's Infobox Film gives 原作=青山剛昌, which on this series is the CREATOR credit, not a story source, and the same article states the rule … (see the verdict)" },
    reason:
      "Owner triage (triage__detective-conan.json): Detective Conan: Fallen Angel of the Highway adapts no chapters of the instrument — Theatrical film 29 「名探偵コナン ハイウェイの堕天使」 (2026-04-10) — an original screenplay by 大倉崇裕 (Takahiro Okura, his fifth Conan film) directed by 蓮井隆弘; ja-WP's Infobox Film gives 原作=青山剛昌, which on this series is the CREATOR credit, not a story source, and the same article states the rule for the whole film line: 「ストーリー自体は劇場版独自のものだが、まれに原作やテレビアニメ版との明確な繋がりを示す描写があり…」 ('the story itself is the film's own').",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=Fallen_Angel_of_the_Highway&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3_%E3%83%8F%E3%82%A4%E3%82%A6%E3%82%A7%E3%82%A4%E3%81%AE%E5%A0%95%E5%A4%A9%E4%BD%BF&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3_(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json"],
  },
  {
    seriesId: 'detective-conan',
    ruleId: 'I45',
    value: { anilistId: 212994, standing: 'filler', note: "original (triage): TV special 「はなまるな真実(アンサー)」 (2026-06-06), a 30th-anniversary crossover with 『名探偵プリキュア!』 — DCW's infobox states it flatly: `manga = TV Original` (and `Filler case number = #465`), screenplay 大和屋暁." },
    reason:
      "Owner triage (triage__detective-conan.json): Detective Conan: The Gold-Star Answer adapts no chapters of the instrument — TV special 「はなまるな真実(アンサー)」 (2026-06-06), a 30th-anniversary crossover with 『名探偵プリキュア!』 — DCW's infobox states it flatly: `manga = TV Original` (and `Filler case number = #465`), screenplay 大和屋暁.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__detective-conan.json","https://www.detectiveconanworld.com/wiki/api.php?action=parse&page=The_Gold-Star_Answer&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%90%8D%E6%8E%A2%E5%81%B5%E3%82%B3%E3%83%8A%E3%83%B3%E3%81%AE%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://www.ytv.co.jp/conan/archive/k20260606.html"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 905, standing: 'filler', note: "original (triage): Original screenplay: Toei's own lineup entry credits 脚本 小山高生 (Takao Koyama) with 原作 鳥山明 as the franchise-creator line (a credit, not a chapter claim)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Fusion Reborn adapts no chapters of the instrument — Original screenplay: Toei's own lineup entry credits 脚本 小山高生 (Takao Koyama) with 原作 鳥山明 as the franchise-creator line (a credit, not a chapter claim).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Fusion_Reborn&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E5%BE%A9%E6%B4%BB%E3%81%AE%E3%83%95%E3%83%A5%E3%83%BC%E3%82%B8%E3%83%A7%E3%83%B3%21%21%E6%82%9F%E7%A9%BA%E3%81%A8%E3%83%99%E3%82%B8%E3%83%BC%E3%82%BF&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_doragonball_fusion"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 901, standing: 'filler', note: "original (triage): Original screenplay (Toei: 脚本 小山高生; 原作 鳥山明 = the franchise credit)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Broly - The Legendary Super Saiyan adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生; 原作 鳥山明 = the franchise credit).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Broly_-_The_Legendary_Super_Saiyan&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E7%87%83%E3%81%88%E3%81%A4%E3%81%8D%E3%82%8D%21%21%E7%86%B1%E6%88%A6%E3%83%BB%E7%83%88%E6%88%A6%E3%83%BB%E8%B6%85%E6%BF%80%E6%88%A6&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonballz_nessen"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 898, standing: 'filler', note: "original (triage): Original screenplay (Toei: 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Cooler's Revenge adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Cooler%27s_Revenge&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E3%81%A8%E3%81%B3%E3%81%A3%E3%81%8D%E3%82%8A%E3%81%AE%E6%9C%80%E5%BC%B7%E5%AF%BE%E6%9C%80%E5%BC%B7&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonballz_saikyou"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 906, standing: 'filler', note: "original (triage): Original screenplay (Toei: 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Wrath of the Dragon adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Wrath_of_the_Dragon&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E9%BE%8D%E6%8B%B3%E7%88%86%E7%99%BA%21%21%E6%82%9F%E7%A9%BA%E3%81%8C%E3%82%84%E3%82%89%E3%81%AD%E3%81%B0%E8%AA%B0%E3%81%8C%E3%82%84%E3%82%8B&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_doragonball_ryuken"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 903, standing: 'filler', note: "original (triage): Original screenplay (ja-WP and en-WP both credit 脚本 小山高生 / Takao Koyama; the Dragon Ball Wiki agrees)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Broly - Second Coming adapts no chapters of the instrument — Original screenplay (ja-WP and en-WP both credit 脚本 小山高生 / Takao Koyama; the Dragon Ball Wiki agrees).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Broly_-_Second_Coming&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E5%8D%B1%E9%99%BA%E3%81%AA%E3%81%B5%E3%81%9F%E3%82%8A%21%E8%B6%85%E6%88%A6%E5%A3%AB%E3%81%AF%E3%81%AD%E3%82%80%E3%82%8C%E3%81%AA%E3%81%84&prop=wikitext&format=json&formatversion=2","https://en.wikipedia.org/w/api.php?action=parse&page=Dragon%20Ball%20Z%3A%20Broly%20%E2%80%93%20Second%20Coming&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 899, standing: 'filler', note: "original (triage): Original screenplay (Toei: 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: The Return of Cooler adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_The_Return_of_Cooler&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E6%BF%80%E7%AA%81%21%21100%E5%84%84%E3%83%91%E3%83%AF%E3%83%BC%E3%81%AE%E6%88%A6%E5%A3%AB%E3%81%9F%E3%81%A1&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonballz_gekitotu"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 902, standing: 'filler', note: "original (triage): Original screenplay (Toei: 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Bojack Unbound adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Bojack_Unbound&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E9%8A%80%E6%B2%B3%E3%82%AE%E3%83%AA%E3%82%AE%E3%83%AA%21%21%E3%81%B6%E3%81%A3%E3%81%A1%E3%81%8E%E3%82%8A%E3%81%AE%E5%87%84%E3%81%84%E5%A5%B4&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonball_ginga"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 904, standing: 'filler', note: "original (triage): Original screenplay (Toei: 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Bio-Broly adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Bio-Broly&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E8%B6%85%E6%88%A6%E5%A3%AB%E6%92%83%E7%A0%B4%21%21%E5%8B%9D%E3%81%A4%E3%81%AE%E3%81%AF%E3%82%AA%E3%83%AC%E3%81%A0&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_doragonballz_tyousensi"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 896, standing: 'filler', note: "original (triage): Original screenplay (Toei's official credits: 監督 西尾大介 / 脚本 小山高生; ja-WP and en-WP agree — the Dragon Ball Wiki's infobox disagrees, see flags)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: The Tree of Might adapts no chapters of the instrument — Original screenplay (Toei's official credits: 監督 西尾大介 / 脚本 小山高生; ja-WP and en-WP agree — the Dragon Ball Wiki's infobox disagrees, see flags).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_The_Tree_of_Might&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E5%9C%B0%E7%90%83%E3%81%BE%E3%82%8B%E3%81%94%E3%81%A8%E8%B6%85%E6%B1%BA%E6%88%A6&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonball_tyoukessen"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 900, standing: 'filler', note: "original (triage): Original screenplay (Toei: 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Super Android 13! adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Super_Android_13%21&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E6%A5%B5%E9%99%90%E3%83%90%E3%83%88%E3%83%AB%21%21%E4%B8%89%E5%A4%A7%E8%B6%85%E3%82%B5%E3%82%A4%E3%83%A4%E4%BA%BA&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonball_saiya"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 894, standing: 'filler', note: "original (triage): Original screenplay (Toei: 監督 西尾大介 / 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Dead Zone adapts no chapters of the instrument — Original screenplay (Toei: 監督 西尾大介 / 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Dead_Zone&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%281989%E5%B9%B4%E3%81%AE%E6%98%A0%E7%94%BB%29&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonball_oranogohan"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 897, standing: 'filler', airDate: '1991-03-09', note: "original (triage): Original screenplay (Toei: 脚本 小山高生). · repair (P8): Toei / ja-WP / en-WP / the wiki all print 1991-03-09; AniList carries the date of manga ch 317" },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Lord Slug adapts no chapters of the instrument — Original screenplay (Toei: 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Lord_Slug&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E8%B6%85%E3%82%B5%E3%82%A4%E3%83%A4%E4%BA%BA%E3%81%A0%E5%AD%AB%E6%82%9F%E7%A9%BA&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonballz_goku"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 986, standing: 'filler', note: "original (triage): Anime-original TV special, stated as such: ja-WP calls it 「劇場版作品以外のTV放送用特番のアニメ版オリジナルストーリーとして制作された初の作品」 (the first Dragon Ball work made as an ANIME-ORIGINAL story for a TV special); writers Takao Koyama + Katsuyuki Sumisawa (en-WP, ja-WP, Dragon Ball Wiki all agree). · Bardock later appears in ch 307 (vol 26 pp. 94-95) — Toriyama drew him after the special: a cameo, not material (Sean 2026-09-05), no adoption" },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Bardock – The Father of Goku adapts no chapters of the instrument — Anime-original TV special, stated as such: ja-WP calls it 「劇場版作品以外のTV放送用特番のアニメ版オリジナルストーリーとして制作された初の作品」 (the first Dragon Ball work made as an ANIME-ORIGINAL story for a TV special); writers Takao Koyama + Katsuyuki Sumisawa (en-WP, ja-WP, Dragon Ball Wiki all agree).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Bardock_-_The_Father_of_Goku&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E3%81%9F%E3%81%A3%E3%81%9F%E3%81%B2%E3%81%A8%E3%82%8A%E3%81%AE%E6%9C%80%E7%B5%82%E6%B1%BA%E6%88%A6%E3%80%9C%E3%83%95%E3%83%AA%E3%83%BC%E3%82%B6%E3%81%AB%E6%8C%91%E3%82%93%E3%81%A0Z%E6%88%A6%E5%A3%AB%20%E5%AD%AB%E6%82%9F%E7%A9%BA%E3%81%AE%E7%88%B6%E3%80%9C&prop=wikitext&format=json&formatversion=2","https://en.wikipedia.org/w/api.php?action=parse&page=Dragon%20Ball%20Z%3A%20Bardock%20%E2%80%93%20The%20Father%20of%20Goku&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 895, standing: 'filler', note: "original (triage): Original screenplay (Toei: 監督 西尾大介 / 脚本 小山高生)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: The World's Strongest adapts no chapters of the instrument — Original screenplay (Toei: 監督 西尾大介 / 脚本 小山高生).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_The_World%27s_Strongest&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%20%E3%81%93%E3%81%AE%E4%B8%96%E3%81%A7%E4%B8%80%E7%95%AA%E5%BC%B7%E3%81%84%E3%83%A4%E3%83%84&prop=wikitext&format=json&formatversion=2","https://lineup.toei-anim.co.jp/lineup/archive/json.php?category=movie&id=movie_dragonballz_konoyodeitiban"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 10017, standing: 'filler', note: "original (triage): A 2010 remake of the 1993 OVA — 「OVAアニメーションをベースに完全新規製作したリメイク作」 (ja-WP), bundled as an in-game movie with DRAGON BALL RAGING BLAST 2 (2010-11-11) and later on a Saikyō Jump bonus DVD (Dragon Ball Wiki)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball: Plan to Eradicate the Super Saiyans adapts no chapters of the instrument — A 2010 remake of the 1993 OVA — 「OVAアニメーションをベースに完全新規製作したリメイク作」 (ja-WP), bundled as an in-game movie with DRAGON BALL RAGING BLAST 2 (2010-11-11) and later on a Saikyō Jump bonus DVD (Dragon Ball Wiki).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball%3A_Plan_to_Eradicate_the_Saiyans&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%E5%A4%96%E4%BC%9D%20%E3%82%B5%E3%82%A4%E3%83%A4%E4%BA%BA%E7%B5%B6%E6%BB%85%E8%A8%88%E7%94%BB&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 984, standing: 'filler', note: "original (triage): Game-derived, not manga-derived: ja-WP describes the OVA as 「ゲームのストーリーを基に作られたアニメーション」 — an animation built on the story of the Famicom RPG 『ドラゴンボールZ外伝 サイヤ人絶滅計画』 (Bandai / Tose, 1993-08-06) — sold as a two-volume 攻略ビデオ (上巻 1993-07-23, 下巻 1993-08-25) that is 「実質的に『ドラゴンボールZ』のOVA」." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Plan to Eradicate the Saiyans adapts no chapters of the instrument — Game-derived, not manga-derived: ja-WP describes the OVA as 「ゲームのストーリーを基に作られたアニメーション」 — an animation built on the story of the Famicom RPG 『ドラゴンボールZ外伝 サイヤ人絶滅計画』 (Bandai / Tose, 1993-08-06) — sold as a two-volume 攻略ビデオ (上巻 1993-07-23, 下巻 1993-08-25) that is 「実質的に『ドラゴンボールZ』のOVA」.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball%3A_Plan_to_Eradicate_the_Saiyans&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ%E5%A4%96%E4%BC%9D%20%E3%82%B5%E3%82%A4%E3%83%A4%E4%BA%BA%E7%B5%B6%E6%BB%85%E8%A8%88%E7%94%BB&prop=wikitext&format=json&formatversion=2","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 6714, standing: 'filler', note: "original (triage): A Terebikko interactive VHS (Bandai, 1992) whose animation ja-WP's 関連アニメ section calls flatly 「オリジナルアニメ」." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: Atsumare! Goku's World adapts no chapters of the instrument — A Terebikko interactive VHS (Bandai, 1992) whose animation ja-WP's 関連アニメ section calls flatly 「オリジナルアニメ」.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_Atsumare%21_Gok%C5%AB_W%C4%81rudo&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 102431, standing: 'filler', note: "original (triage): An 11-minute full-CG attraction film for Universal Studios Japan's 'Universal Jump Summer' (run 2016-07-01 to 09-04; ja-WP's ドラゴンボールZ article documents it with USJ's own press release, and the Dragon Ball Wiki cites Kanzenshuu's report)." },
    reason:
      "Owner triage (triage__dragon-ball-z.json): Dragon Ball Z: The Real 4-D adapts no chapters of the instrument — An 11-minute full-CG attraction film for Universal Studios Japan's 'Universal Jump Summer' (run 2016-07-01 to 09-04; ja-WP's ドラゴンボールZ article documents it with USJ's own press release, and the Dragon Ball Wiki cites Kanzenshuu's report).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__dragon-ball-z.json","https://dragonball.fandom.com/api.php?action=parse&page=Dragon_Ball_Z%3A_The_Real_4-D&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%89%E3%83%A9%E3%82%B4%E3%83%B3%E3%83%9C%E3%83%BC%E3%83%ABZ&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3273, standing: 'filler', note: "original (triage): NO — original screenplay (山崎晴哉), film 1 of the Toei Manga Matsuri line." },
    reason:
      "Owner triage (triage__kinnikuman.json): Kinnikuman (1984) adapts no chapters of the instrument — NO — original screenplay (山崎晴哉), film 1 of the Toei Manga Matsuri line.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__kinnikuman.json","https://kinnikuman.fandom.com/api.php?action=parse&page=Movie_1&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3%20%E5%A5%AA%E3%82%8F%E3%82%8C%E3%81%9F%E3%83%81%E3%83%A3%E3%83%B3%E3%83%94%E3%82%AA%E3%83%B3%E3%83%99%E3%83%AB%E3%83%88&prop=wikitext&format=json","https://kinnikuman.fandom.com/api.php?action=parse&page=List_of_Story_Arcs&prop=wikitext&format=json"],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3275, standing: 'filler', note: "original (triage): NO — ja-WP says it outright: 時系列は「黄金のマスク編」の後だが、前作と異なり原作をベースとしていない完全オリジナルの展開となっている ('unlike the previous film, a completely original development, not based on the source')." },
    reason:
      "Owner triage (triage__kinnikuman.json): Kinnikuman: Seigi Choujin vs. Kodai Choujin adapts no chapters of the instrument — NO — ja-WP says it outright: 時系列は「黄金のマスク編」の後だが、前作と異なり原作をベースとしていない完全オリジナルの展開となっている ('unlike the previous film, a completely original development, not based on the source').",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__kinnikuman.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3%20%E6%AD%A3%E7%BE%A9%E8%B6%85%E4%BA%BAvs%E5%8F%A4%E4%BB%A3%E8%B6%85%E4%BA%BA&prop=wikitext&format=json","https://kinnikuman.fandom.com/api.php?action=parse&page=Movie_3&prop=wikitext&format=json"],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3278, standing: 'filler', note: "original (triage): NO — an original screenplay by 寺田憲史: ja-WP says he had written it as the plot of a SCRAPPED TV special and the producer had him rework it into the film, and that it contradicts the manga's own setting (原作設定ならば悪魔将軍の正体は…ゴールドマンだが、今作では…「悪」の存在として描かれている)." },
    reason:
      "Owner triage (triage__kinnikuman.json): Kinnikuman: New York Kikiippatsu! adapts no chapters of the instrument — NO — an original screenplay by 寺田憲史: ja-WP says he had written it as the plot of a SCRAPPED TV special and the producer had him rework it into the film, and that it contradicts the manga's own setting (原作設定ならば悪魔将軍の正体は…ゴールドマンだが、今作では…「悪」の存在として描かれている).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__kinnikuman.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3%20%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%A8%E3%83%BC%E3%82%AF%E5%8D%B1%E6%A9%9F%E4%B8%80%E9%AB%AA%21&prop=wikitext&format=json","https://kinnikuman.fandom.com/api.php?action=parse&page=Movie_6&prop=wikitext&format=json","https://kinnikuman.fandom.com/ja/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3_%E3%83%8B%E3%83%A5%E3%83%BC%E3%83%A8%E3%83%BC%E3%82%AF%E5%8D%B1%E6%A9%9F%E4%B8%80%E9%AB%AA%21&prop=wikitext&format=json"],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3277, standing: 'filler', note: "original (triage): NO — an Edo-period time-slip built out of jidaigeki parodies (水戸黄門, 旗本退屈男) with an all-new cast: Shuten Doji and his Shitennō, the Tokugawa doppelgangers of the Kinniku family, and the anime-original Kinkotsu-Obaba." },
    reason:
      "Owner triage (triage__kinnikuman.json): Kinnikuman: Haresugata! Seigi Choujin adapts no chapters of the instrument — NO — an Edo-period time-slip built out of jidaigeki parodies (水戸黄門, 旗本退屈男) with an all-new cast: Shuten Doji and his Shitennō, the Tokugawa doppelgangers of the Kinniku family, and the anime-original Kinkotsu-Obaba.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__kinnikuman.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3%20%E6%99%B4%E3%82%8C%E5%A7%BF%21%E6%AD%A3%E7%BE%A9%E8%B6%85%E4%BA%BA&prop=wikitext&format=json","https://kinnikuman.fandom.com/api.php?action=parse&page=Movie_5&prop=wikitext&format=json","https://kinnikuman.fandom.com/ja/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3_%E6%99%B4%E3%82%8C%E5%A7%BF%21%E6%AD%A3%E7%BE%A9%E8%B6%85%E4%BA%BA&prop=wikitext&format=json"],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3279, standing: 'filler', note: "filler for this owner — transplants Yudetamago's separate one-shot デスゲーム (WJ 1980 #16) — a one-shot tie-in, never a series; rides with the per-work programme" },
    reason:
      "Owner triage (triage__kinnikuman.json): Kinnikuman: Seigi Choujin vs. Senshi Choujin adapts no chapters of the instrument — NO Kinnikuman chapter — it transplants a DIFFERENT Yudetamago work.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__kinnikuman.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3%20%E6%AD%A3%E7%BE%A9%E8%B6%85%E4%BA%BAvs%E6%88%A6%E5%A3%AB%E8%B6%85%E4%BA%BA&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%86%E3%81%A7%E3%81%9F%E3%81%BE%E3%81%94%E3%81%AE%E8%AA%AD%E3%81%BF%E5%88%87%E3%82%8A%E4%BD%9C%E5%93%81%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://kinnikuman.fandom.com/api.php?action=parse&page=Movie_7&prop=wikitext&format=json"],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 147810, standing: 'filler', note: "original (triage): NO — an original 15-minute 16mm traffic-safety education film (安全教育アニメ; ja-WP lists it in that genre's table)." },
    reason:
      "Owner triage (triage__kinnikuman.json): Kinnikuman no Koutsuu Anzen adapts no chapters of the instrument — NO — an original 15-minute 16mm traffic-safety education film (安全教育アニメ; ja-WP lists it in that genre's table).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__kinnikuman.json","https://www.manabi.city.osaka.lg.jp/yoyaku/ShichokakuDetailInfo.html?mcon_code=2067&searchmode=2&janru=260","https://kinnikuman.fandom.com/ja/api.php?action=parse&page=%E3%82%AD%E3%83%B3%E8%82%89%E3%83%9E%E3%83%B3%E3%81%AE%E4%BA%A4%E9%80%9A%E5%AE%89%E5%85%A8&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E3%82%A2%E3%83%8B%E3%83%A1&prop=wikitext&format=json"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 139273, standing: 'filler', note: "original (triage): Remake of TV EPISODE 15 of the 1979 series (script Yoshihisa Araki), not a manga — ja-WP: 「第15話「ククルス・ドアンの島」のリメイク作品」; wiki infobox adapted from=Cucuruz Doan's Island." },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): Mobile Suit Gundam: Cucuruz Doan's Island adapts no chapters of the instrument — Remake of TV EPISODE 15 of the 1979 series (script Yoshihisa Araki), not a manga — ja-WP: 「第15話「ククルス・ドアンの島」のリメイク作品」; wiki infobox adapted from=Cucuruz Doan's Island.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://gundam.fandom.com/api.php?action=parse&page=Mobile%20Suit%20Gundam%3A%20Cucuruz%20Doan%27s%20Island&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E6%A9%9F%E5%8B%95%E6%88%A6%E5%A3%AB%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0%20%E3%82%AF%E3%82%AF%E3%83%AB%E3%82%B9%E3%83%BB%E3%83%89%E3%82%A2%E3%83%B3%E3%81%AE%E5%B3%B6&prop=wikitext&format=json","https://gundam.fandom.com/api.php?action=parse&page=Cucuruz%20Doan%27s%20Island&prop=wikitext&format=json"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 7113, standing: 'filler', note: "original (triage): Original ~3-minute promotional short (PV) for the TV series' 30th anniversary: the franchise's Gundams escort a Core Fighter from Earth to space, set to 哀戦士." },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): 30th GUNDAM PERFECT MISSION adapts no chapters of the instrument — Original ~3-minute promotional short (PV) for the TV series' 30th anniversary: the franchise's Gundams escort a Core Fighter from Earth to space, set to 哀戦士.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://gundam.fandom.com/api.php?action=parse&page=30th%20Gundam%20Perfect%20Mission&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=GUNDAM%20PERFECT%20MISSION&prop=wikitext&format=json","https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=15758"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 5270, standing: 'filler', note: "original (triage): Original ~1-minute 10th-anniversary short: newly drawn footage of every Gundam set to Kenji Kawai's music plus a 夜明けのShooting Star clip cut from 0080, distributed free to buyers of all six 0080 VHS/LD volumes and teasing 0080." },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): ALL THAT GUNDAM adapts no chapters of the instrument — Original ~1-minute 10th-anniversary short: newly drawn footage of every Gundam set to Kenji Kawai's music plus a 夜明けのShooting Star clip cut from 0080, distributed free to buyers of all six 0080 VHS/LD volumes and teasing 0080.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://gundam.fandom.com/api.php?action=parse&page=All%20That%20Gundam&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E6%A9%9F%E5%8B%95%E6%88%A6%E5%A3%AB%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A00080%20%E3%83%9D%E3%82%B1%E3%83%83%E3%83%88%E3%81%AE%E4%B8%AD%E3%81%AE%E6%88%A6%E4%BA%89&prop=wikitext&format=json","https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=17657"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 104557, standing: 'filler', note: "filler for this owner — the ONA it compiles rests on the Twilight AXIS web novel (矢立文庫, 2016-11-07 → 2017-12-28; the ONA aired from 2017-06) — a different run: decision (d) candidate; the Gundam Wiki claims the anime preceded the novel, ja-WP's dates say the novel began first — the picks read decides on dates; no mint either way today" },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): Mobile Suit Gundam: Twilight Axis - Remain of the Red adapts no chapters of the instrument — NOT the owner's instrument.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://gundam.fandom.com/api.php?action=parse&page=Mobile%20Suit%20Gundam%20Twilight%20Axis%20-%20Red%20Trace&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E6%A9%9F%E5%8B%95%E6%88%A6%E5%A3%AB%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0%20Twilight%20AXIS&prop=wikitext&format=json","https://gundam.fandom.com/api.php?action=parse&page=Mobile%20Suit%20Gundam%20Twilight%20Axis&prop=wikitext&format=json"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 2302, standing: 'filler', note: "original (triage): Original gag shorts — SD Gundam's first animation (3 parts; script Hiroyuki Hoshiyama, dir Osamu Sekita), parodying the ANIME's own One Year War beats." },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): Kidou Senshi SD Gundam adapts no chapters of the instrument — Original gag shorts — SD Gundam's first animation (3 parts; script Hiroyuki Hoshiyama, dir Osamu Sekita), parodying the ANIME's own One Year War beats.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://gundam.fandom.com/api.php?action=parse&page=Mobile%20Suit%20SD%20Gundam%20Mk%20I&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E6%A9%9F%E5%8B%95%E6%88%A6%E5%A3%ABSD%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0&prop=wikitext&format=json","https://cdn.animenewsnetwork.com/encyclopedia/api.xml?anime=2458"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 9040, standing: 'filler', note: "original (triage): Original 3-part model-kit OVA for Gunpla's 30th anniversary (2010; 黒田洋介 / 松尾衡)." },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): Mokei Senshi Gunpla Builders Beginning G adapts no chapters of the instrument — Original 3-part model-kit OVA for Gunpla's 30th anniversary (2010; 黒田洋介 / 松尾衡).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://gundam.fandom.com/api.php?action=parse&page=Model%20Suit%20Gunpla%20Builders%20Beginning%20G&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E6%A8%A1%E5%9E%8B%E6%88%A6%E5%A3%AB%E3%82%AC%E3%83%B3%E3%83%97%E3%83%A9%E3%83%93%E3%83%AB%E3%83%80%E3%83%BC%E3%82%BA%20%E3%83%93%E3%82%AE%E3%83%8B%E3%83%B3%E3%82%B0G&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%AC%E3%83%B3%E3%83%80%E3%83%A0%E3%82%B7%E3%83%AA%E3%83%BC%E3%82%BA%E4%B8%80%E8%A6%A7&prop=wikitext&format=json"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 4540, standing: 'filler', note: "original (triage): Original ~3-minute full-CG short by Katsuhiro Otomo, screened 1998-08-01 at the ガンダムビッグバン宣言 20th-anniversary event." },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): Gundam: Mission To The Rise adapts no chapters of the instrument — Original ~3-minute full-CG short by Katsuhiro Otomo, screened 1998-08-01 at the ガンダムビッグバン宣言 20th-anniversary event.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://gundam.fandom.com/api.php?action=parse&page=Gundam%3A%20Mission%20To%20The%20Rise&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=GUNDAM%20Mission%20to%20the%20Rise&prop=wikitext&format=json","http://gundamania.com/other/bigbang/bigbang.html"],
  },
  {
    seriesId: 'mobile-suit-gundam',
    ruleId: 'I45',
    value: { anilistId: 19977, standing: 'filler', kind: 'recap', note: "original (triage): A RECAP, not an adaptation — a multi-screen digest of the 1979 anime screened at the same 1998-08-01 ガンダムビッグバン宣言 event. · repair (P8): a three-screen digest of the 1979 anime (ja-WP) — a compilation, kind recap (N8)" },
    reason:
      "Owner triage (triage__mobile-suit-gundam.json): The Impression of First GUNDAM adapts no chapters of the instrument — A RECAP, not an adaptation — a multi-screen digest of the 1979 anime screened at the same 1998-08-01 ガンダムビッグバン宣言 event.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__mobile-suit-gundam.json","https://ja.wikipedia.org/w/api.php?action=parse&page=GUNDAM%20Mission%20to%20the%20Rise&prop=wikitext&format=json","http://gundamania.com/other/bigbang/bigbang.html","https://animeanime.jp/article/2019/04/27/45176.html"],
  },
  {
    seriesId: 'naruto',
    ruleId: 'I45',
    value: { anilistId: 442, standing: 'filler', note: "original (triage): Original screenplay: ja-WP credits 監督 岡村天斎 / 脚本 隅沢克之, with 岸本斉史 listed only in the Infobox Film 原作 slot (the franchise-creator credit every Naruto film carries), and heads the ENTIRE guest cast list === オリジナルキャラクター === (Fujikaze Yukie / Kazahana Koyuki, Sandayu Asama, director Makino, Doto's team)." },
    reason:
      "Owner triage (triage__naruto.json): Naruto the Movie: Ninja Clash in the Land of Snow adapts no chapters of the instrument — Original screenplay: ja-WP credits 監督 岡村天斎 / 脚本 隅沢克之, with 岸本斉史 listed only in the Infobox Film 原作 slot (the franchise-creator credit every Naruto film carries), and heads the ENTIRE guest cast list === オリジナルキャラクター === (Fujikaze Yukie / Kazahana Koyuki, Sandayu Asama, director Makino, Doto's team).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__naruto.json","https://naruto.fandom.com/api.php?action=parse&page=Naruto%20the%20Movie%3A%20Ninja%20Clash%20in%20the%20Land%20of%20Snow&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&pageid=716216&prop=wikitext&format=json","https://naruto.fandom.com/api.php?action=parse&page=Koyuki%20Kazahana&prop=text&format=json"],
  },
  {
    seriesId: 'naruto',
    ruleId: 'I45',
    value: { anilistId: 936, standing: 'filler', note: "original (triage): Original screenplay: ja-WP credits 監督・脚本 川崎博嗣 with 宮田由佳 (no 原作 episode cited) and files Haido, Temujin, Fugai, Kamira, Ranke, Emina, Kahiko and the ferret Nerugui under === オリジナルキャラクター ===, noting their names are riffs on Jekyll & Hyde / Carmilla / Frankenstein." },
    reason:
      "Owner triage (triage__naruto.json): Naruto the Movie: Legend of the Stone of Gelel adapts no chapters of the instrument — Original screenplay: ja-WP credits 監督・脚本 川崎博嗣 with 宮田由佳 (no 原作 episode cited) and files Haido, Temujin, Fugai, Kamira, Ranke, Emina, Kahiko and the ferret Nerugui under === オリジナルキャラクター ===, noting their names are riffs on Jekyll & Hyde / Carmilla / Frankenstein.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__naruto.json","https://naruto.fandom.com/api.php?action=parse&page=Naruto%20the%20Movie%3A%20Legend%20of%20the%20Stone%20of%20Gelel&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&pageid=715275&prop=wikitext&format=json","https://naruto.fandom.com/api.php?action=parse&page=Temujin&prop=text&format=json"],
  },
  {
    seriesId: 'naruto',
    ruleId: 'I45',
    value: { anilistId: 2144, standing: 'filler', note: "original (triage): Original screenplay: ja-WP credits 監督・脚本 都留稔幸 (one man, no source episode) and heads the Land of the Moon cast === オリジナルキャラクター === (Tsuki Michiru, Tsuki Hikaru, Amayo, Tsuki Kakeru, Shabadaba, Ishidate, Karenbana, Kongo)." },
    reason:
      "Owner triage (triage__naruto.json): Naruto the Movie: Guardians of the Crescent Moon Kingdom adapts no chapters of the instrument — Original screenplay: ja-WP credits 監督・脚本 都留稔幸 (one man, no source episode) and heads the Land of the Moon cast === オリジナルキャラクター === (Tsuki Michiru, Tsuki Hikaru, Amayo, Tsuki Kakeru, Shabadaba, Ishidate, Karenbana, Kongo).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__naruto.json","https://naruto.fandom.com/api.php?action=parse&page=Naruto%20the%20Movie%3A%20Guardians%20of%20the%20Crescent%20Moon%20Kingdom&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&pageid=521967&prop=wikitext&format=json","https://naruto.fandom.com/api.php?action=parse&page=Hikaru%20Tsuki&prop=text&format=json"],
  },
  {
    seriesId: 'naruto',
    ruleId: 'I45',
    value: { anilistId: 594, standing: 'filler', note: "original (triage): A 40-minute Jump Festa short, not an adaptation." },
    reason:
      "Owner triage (triage__naruto.json): Naruto: The Lost Story - Mission: Protect the Waterfall Village adapts no chapters of the instrument — A 40-minute Jump Festa short, not an adaptation.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__naruto.json","https://naruto.fandom.com/api.php?action=parse&page=Mission%3A%20Protect%20the%20Waterfall%20Village!&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&pageid=684529&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&pageid=816381&prop=wikitext&format=json"],
  },
  {
    seriesId: 'naruto',
    ruleId: 'I45',
    value: { anilistId: 761, standing: 'filler', note: "original (triage): A 13-minute Jump Festa short under the same ja-WP == ジャンプフェスタ == heading whose lead sentence is 「…オリジナルアニメが公開された」; staff 監督 伊達勇登 / 脚本 隅沢克之; ja-WP's plot (Konohamaru hunting the crimson four-leaf clover in Akagahara for Kaede) matches Narutopedia's." },
    reason:
      "Owner triage (triage__naruto.json): NARUTO: Akaki Yotsuba no Clover wo Sagase adapts no chapters of the instrument — A 13-minute Jump Festa short under the same ja-WP == ジャンプフェスタ == heading whose lead sentence is 「…オリジナルアニメが公開された」; staff 監督 伊達勇登 / 脚本 隅沢克之; ja-WP's plot (Konohamaru hunting the crimson four-leaf clover in Akagahara for Kaede) matches Narutopedia's.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__naruto.json","https://naruto.fandom.com/api.php?action=parse&page=Find%20the%20Four-Leaf%20Red%20Clover!&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&pageid=684529&prop=wikitext&format=json","https://naruto.fandom.com/api.php?action=parse&page=Kaede%20Yoshino&prop=text&format=json"],
  },
  {
    seriesId: 'naruto',
    ruleId: 'I45',
    value: { anilistId: 1074, standing: 'filler', note: "original (triage): A game bonus video, not an adaptation of anything." },
    reason:
      "Owner triage (triage__naruto.json): NARUTO: Narutimate Hero 3: Tsui ni Gekitotsu! Jounin VS Genin!! Musabetsu Dairansen Taikai Kaisai!! adapts no chapters of the instrument — A game bonus video, not an adaptation of anything.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__naruto.json","https://naruto.fandom.com/api.php?action=parse&pageid=19701&prop=wikitext&format=json","https://en.wikipedia.org/w/api.php?action=parse&pageid=74871410&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&pageid=688144&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 141902, standing: 'filler', note: "original (triage): Original screenplay by Tsutomu Kuroiwa (ja-WP infobox: 脚本 黒岩勉, 監督 谷口悟朗); Oda is credited 原作 (the standing franchise credit carried by every One Piece film) and 総合プロデューサー, and Uta is a 映画オリジナルキャラクター." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece Film: Red adapts no chapters of the instrument — Original screenplay by Tsutomu Kuroiwa (ja-WP infobox: 脚本 黒岩勉, 監督 谷口悟朗); Oda is credited 原作 (the standing franchise credit carried by every One Piece film) and 総合プロデューサー, and Uta is a 映画オリジナルキャラクター.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=One%20Piece%20Film:%20Red&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20FILM%20RED&prop=wikitext&format=json","https://onepiece.fandom.com/api.php?action=parse&page=Volume%204000000001&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 105143, standing: 'filler', note: "original (triage): Original screenplay by Atsuhiro Tomioka and director Takashi Otsuka; ja-WP: 原作者の尾田栄一郎は監修として制作に参加し、原作キャラクターの衣装やオリジナルキャラクターのデザインを手掛けている - Oda supervised and designed the film-original characters (Douglas Bullet, Buena Festa)." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece: Stampede adapts no chapters of the instrument — Original screenplay by Atsuhiro Tomioka and director Takashi Otsuka; ja-WP: 原作者の尾田栄一郎は監修として制作に参加し、原作キャラクターの衣装やオリジナルキャラクターのデザインを手掛けている - Oda supervised and designed the film-original characters (Douglas Bullet, Buena Festa).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=One%20Piece:%20Stampede&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20STAMPEDE&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 4155, standing: 'filler', note: "original (triage): An original story Oda himself wrote (ja-WP: 尾田自身がストーリーを書き下ろし製作総指揮も務めた; fandom: 'the film is an original story written by Eiichiro Oda himself'), set between Thriller Bark and Sabaody with a film-original cast (Shiki's crew, Merveille)." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece Film: Strong World adapts no chapters of the instrument — An original story Oda himself wrote (ja-WP: 尾田自身がストーリーを書き下ろし製作総指揮も務めた; fandom: 'the film is an original story written by Eiichiro Oda himself'), set between Thriller Bark and Sabaody with a film-original cast (Shiki's crew, Merveille).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=One%20Piece%20Film:%20Strong%20World&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20FILM%20STRONG%20WORLD&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 21831, standing: 'filler', note: "original (triage): A film tie-in TV special, original: Toei's own press release calls it 映画へつながる完全新作SP and the licensor's page says the story is self-contained (この物語で完結しているエピソード); 脚本 黒岩勉 (the Film Gold writer), 監督 長峯達也, with Oda drawing the guest characters' designs." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece: Heart of Gold adapts no chapters of the instrument — A film tie-in TV special, original: Toei's own press release calls it 映画へつながる完全新作SP and the licensor's page says the story is self-contained (この物語で完結しているエピソード); 脚本 黒岩勉 (the Film Gold writer), 監督 長峯達也, with Oda drawing the guest characters' designs.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://one-piece.com/tvspecial/o2527/index.html","https://onepiece.fandom.com/api.php?action=parse&page=Heart%20of%20Gold&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20FILM%20GOLD&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 2386, standing: 'filler', note: "original (triage): A 5m30s featurette screened with movie 3 (Chopper's Kingdom), original: a Grand Line Cup penalty shootout between Luffy's team and a villain all-stars team, ending as Luffy's dream, with Oda himself appearing as the original character Odacchi (ja-WP: 同時公開されたショート映画." },
    reason:
      "Owner triage (triage__one-piece.json): ONE PIECE: Yume no Soccer Ou! adapts no chapters of the instrument — A 5m30s featurette screened with movie 3 (Chopper's Kingdom), original: a Grand Line Cup penalty shootout between Luffy's team and a villain all-stars team, ending as Luffy's dream, with Oda himself appearing as the original character Odacchi (ja-WP: 同時公開されたショート映画.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=Dream%20Soccer%20King&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20%E7%8F%8D%E7%8D%A3%E5%B3%B6%E3%81%AE%E3%83%81%E3%83%A7%E3%83%83%E3%83%91%E3%83%BC%E7%8E%8B%E5%9B%BD&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 16468, standing: 'filler', note: "original (triage): A two-part smartphone (NOTTV) short that leads into the opening of Film Z: ja-WP calls it 短編オリジナルエピソード." },
    reason:
      "Owner triage (triage__one-piece.json): ONE PIECE FILM: Z - GLORIOUS ISLAND adapts no chapters of the instrument — A two-part smartphone (NOTTV) short that leads into the opening of Film Z: ja-WP calls it 短編オリジナルエピソード.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=Glorious%20Island&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20FILM%20Z&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 2385, standing: 'filler', note: "original (triage): A 5-minute featurette screened with movie 2 (Clockwork Island), original: Jango hypnotises Mirror Ball Island into dancing (ja-WP: 同時公開された短編映画。" },
    reason:
      "Owner triage (triage__one-piece.json): One Piece: Django's Dance Carnival adapts no chapters of the instrument — A 5-minute featurette screened with movie 2 (Clockwork Island), original: Jango hypnotises Mirror Ball Island into dancing (ja-WP: 同時公開された短編映画。",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=Jango's%20Dance%20Carnival&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20%E3%81%AD%E3%81%98%E3%81%BE%E3%81%8D%E5%B3%B6%E3%81%AE%E5%86%92%E9%99%BA&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 1094, standing: 'filler', note: "original (triage): TV Special 1 (2000-12-20), an hour-long anime-original one-off: the crew descends into the 'Ocean's Navel' and meets Hamu, Meroie and the ghost-pirate Joke - a cast that exists nowhere in the manga." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece: Umi no Heso no Daibouken-hen adapts no chapters of the instrument — TV Special 1 (2000-12-20), an hour-long anime-original one-off: the crew descends into the 'Ocean's Navel' and meets Hamu, Meroie and the ghost-pirate Joke - a cast that exists nowhere in the manga.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=Episode%20Special%201&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%E3%81%AE%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 21880, standing: 'filler', note: "original (triage): A 7-Eleven campaign short (viewable by buying two doughnuts, 2016-07-02): ONE PIECE." },
    reason:
      "Owner triage (triage__one-piece.json): ONE PIECE FILM: GOLD - episode 0 711ver. adapts no chapters of the instrument — A 7-Eleven campaign short (viewable by buying two doughnuts, 2016-07-02): ONE PIECE.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://one-piece.com/news/detail/20160627_4011","https://onepiece.fandom.com/api.php?action=parse&page=One%20Piece%20Film:%20Gold%20Episode%200&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20FILM%20GOLD&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 2490, standing: 'filler', note: "original (triage): A 5m32s featurette screened with movie 5 (The Cursed Holy Sword): a baseball game between the Straw Hats and the Arlong crew." },
    reason:
      "Owner triage (triage__one-piece.json): ONE PIECE: Mezase! Kaizoku Yakyuu Ou adapts no chapters of the instrument — A 5m32s featurette screened with movie 5 (The Cursed Holy Sword): a baseball game between the Straw Hats and the Arlong crew.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=Take%20Aim!%20The%20Pirate%20Baseball%20King&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20%E5%91%AA%E3%82%8F%E3%82%8C%E3%81%9F%E8%81%96%E5%89%A3&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 1238, standing: 'filler', note: "original (triage): TV Special 3 (2003-12-14)." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece Special: Protect! The Last Great Performance adapts no chapters of the instrument — TV Special 3 (2003-12-14).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json","https://onepiece.fandom.com/api.php?action=parse&page=Episode%20Special%203&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 1237, standing: 'filler', note: "original (triage): TV Special 2 (2003-04-06), anime-original: Amanda, Milia, Holy, Zap and the Bayan Pirates appear nowhere in the manga and are tagged Non-Canon on the wiki, whose infobox field for this special reads chapter = Anime Special." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece Special: Open Upon the Great Sea! A Father's Huge, HUGE Dream! adapts no chapters of the instrument — TV Special 2 (2003-04-06), anime-original: Amanda, Milia, Holy, Zap and the Bayan Pirates appear nowhere in the manga and are tagged Non-Canon on the wiki, whose infobox field for this special reads chapter = Anime Special.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=Episode%20Special%202&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%E3%81%AE%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%A8%E3%83%94%E3%82%BD%E3%83%BC%E3%83%89%E4%B8%80%E8%A6%A7&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 2020, standing: 'filler', note: "original (triage): TV Special 4 (2005-12-18), the first of the ワンピース時代劇 specials: an alternate-reality Edo-period 'Grand Jipangu' where Luffy is an okappiki policeman." },
    reason:
      "Owner triage (triage__one-piece.json): One Piece Special: The Detective Memoirs of Chief Straw Hat Luffy adapts no chapters of the instrument — TV Special 4 (2005-12-18), the first of the ワンピース時代劇 specials: an alternate-reality Edo-period 'Grand Jipangu' where Luffy is an okappiki policeman.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%AF%E3%83%B3%E3%83%94%E3%83%BC%E3%82%B9%E6%99%82%E4%BB%A3%E5%8A%87&prop=wikitext&format=json","https://onepiece.fandom.com/api.php?action=parse&page=Episode%20Special%204&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 12001, standing: 'filler', note: "original (triage): A 12-minute stereoscopic-3D theatre short shown at five leisure venues from 2011-12-01." },
    reason:
      "Owner triage (triage__one-piece.json): ONE PIECE 3D: Gekisou! Trap Coaster adapts no chapters of the instrument — A 12-minute stereoscopic-3D theatre short shown at five leisure venues from 2011-12-01.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://www.itmedia.co.jp/lifestyle/articles/1111/11/news124.html","https://onepiece.fandom.com/api.php?action=parse&page=ONE%20PIECE%203D!%20Trap%20Coaster&prop=wikitext&format=json","https://ja.wikipedia.org/w/api.php?action=parse&page=ONE%20PIECE%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext&format=json"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 107110, standing: 'filler', note: "original (triage): Not an anime work adapting pages: three ~5-minute stop-motion PROMOTIONAL VIDEOS made by Banpresto for its 'Cry heart' crane-game figure line and posted to YouTube (ONE PIECE." },
    reason:
      "Owner triage (triage__one-piece.json): ONE PIECE: Cry heart adapts no chapters of the instrument — Not an anime work adapting pages: three ~5-minute stop-motion PROMOTIONAL VIDEOS made by Banpresto for its 'Cry heart' crane-game figure line and posted to YouTube (ONE PIECE.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://one-piece.com/news/o20140217_395/index.html","https://onepiece.fandom.com/api.php?action=parse&page=Cry%20heart&prop=wikitext&format=json","https://www.animenewsnetwork.com/news/2014-01-19/one-piece-chopper-stars-in-5-minute-stop-motion-cry-heart-short"],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 126649, standing: 'filler', airDate: '2018-04-21', title: 'Tokyo One Piece Tower: The Great Treasure of Tongari Island', note: "original (triage): The Tokyo One Piece Tower park-exclusive short 東京ワンピースタワー トンガリ島の大秘宝 (MAL 38419 carries AniList's English title as a synonym): an original story set on Tongari Island, the park's own invented New World island, in which Law appears to betray the crew and Luffy and Law fight Kizaru … (see the verdict) · repair (P8): AniList's title and date are the Takarush treasure-hunt EVENT's; the work is 東京ワンピースタワー トンガリ島の大秘宝, screened from 2018-04-21" },
    reason:
      "Owner triage (triage__one-piece.json): The Great Tongari Island Treasure Hunting Adventure adapts no chapters of the instrument — The Tokyo One Piece Tower park-exclusive short 東京ワンピースタワー トンガリ島の大秘宝 (MAL 38419 carries AniList's English title as a synonym): an original story set on Tongari Island, the park's own invented New World island, in which Law appears to betray the crew and Luffy and Law fight Kizaru until the island's Den Den Mushi amplify their Haki.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__one-piece.json","https://onepiece.fandom.com/api.php?action=parse&page=The%20Great%20Treasure%20of%20Tongari%20Island&prop=wikitext&format=json","https://myanimelist.net/anime/38419/Tokyo_One_Piece_Tower__Tongari_Shima_no_Dai_Hihou","https://www.takarush.jp/promo/onepiece/"],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'I45',
    value: { anilistId: 418, standing: 'filler', note: "original (triage): Original screenplay." },
    reason:
      "Owner triage (triage__ranma-1-2.json): Ranma ½: Big Trouble in Nekonron, China adapts no chapters of the instrument — Original screenplay.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__ranma-1-2.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%89%E3%82%93%E3%81%BE1/2%20%E8%B6%85%E7%84%A1%E5%B7%AE%E5%88%A5%E6%B1%BA%E6%88%A6!%20%E4%B9%B1%E9%A6%AC%E3%83%81%E3%83%BC%E3%83%A0VS%E4%BC%9D%E8%AA%AC%E3%81%AE%E9%B3%B3%E5%87%B0&prop=wikitext&format=json&formatversion=2","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%89%E3%82%93%E3%81%BE1/2%20%E4%B8%AD%E5%9B%BD%E5%AF%9D%E5%B4%91%E5%B4%99%E5%A4%A7%E6%B1%BA%E6%88%A6!%20%E6%8E%9F%E3%82%84%E3%81%B6%E3%82%8A%E3%81%AE%E6%BF%80%E9%97%98%E7%AF%87!!&prop=wikitext&format=json&formatversion=2","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%89%E3%82%93%E3%81%BE1/2&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'I45',
    value: { anilistId: 792, standing: 'filler', note: "original (triage): Original screenplay (Ryota Yamaguchi)." },
    reason:
      "Owner triage (triage__ranma-1-2.json): Ranma ½: Nihao My Concubine adapts no chapters of the instrument — Original screenplay (Ryota Yamaguchi).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__ranma-1-2.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%89%E3%82%93%E3%81%BE1/2%20%E8%B6%85%E7%84%A1%E5%B7%AE%E5%88%A5%E6%B1%BA%E6%88%A6!%20%E4%B9%B1%E9%A6%AC%E3%83%81%E3%83%BC%E3%83%A0VS%E4%BC%9D%E8%AA%AC%E3%81%AE%E9%B3%B3%E5%87%B0&prop=wikitext&format=json&formatversion=2","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%89%E3%82%93%E3%81%BE1/2%20%E6%B1%BA%E6%88%A6%E6%A1%83%E5%B9%BB%E9%83%B7!%20%E8%8A%B1%E5%AB%81%E3%82%92%E5%A5%AA%E3%82%8A%E3%82%82%E3%81%A9%E3%81%9B!!&prop=wikitext&format=json&formatversion=2","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%89%E3%82%93%E3%81%BE1/2&prop=wikitext&format=json&formatversion=2"],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'I45',
    value: { anilistId: 10825, standing: 'filler', kind: 'recap', note: "original (triage): A clip-show compilation, not an adaptation. · repair (P8): ja-WP 「新録を含むTVアニメ総集編」 — a clip compilation, kind recap (N8)" },
    reason:
      "Owner triage (triage__ranma-1-2.json): Ranma 1/2: Battle ga Ippai 29-nin no Korinai Yatsura adapts no chapters of the instrument — A clip-show compilation, not an adaptation.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__ranma-1-2.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%82%89%E3%82%93%E3%81%BE1/2&prop=wikitext&format=json&formatversion=2","http://web.archive.org/web/20200216153825/http://furinkan.com:80/ranma/anime/specials.html","https://kitsu.io/api/edge/mappings?filter%5BexternalSite%5D=anilist%2Fanime&filter%5BexternalId%5D=10825&include=item"],
  },
  {
    seriesId: 'the-prince-of-tennis',
    ruleId: 'I45',
    value: { anilistId: 815, standing: 'filler', note: "original (triage): Original screenplay (脚本: 前川淳 / Jun Maekawa, per ja-WP and en-WP's film infobox)." },
    reason:
      "Owner triage (triage__the-prince-of-tennis.json): Tennis no Ouji-sama: Futari no Samurai - The First Game adapts no chapters of the instrument — Original screenplay (脚本: 前川淳 / Jun Maekawa, per ja-WP and en-WP's film infobox).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext","https://en.wikipedia.org/w/api.php?action=parse&page=The%20Prince%20of%20Tennis%3A%20Futari%20no%20Samurai&prop=wikitext","https://princeoftennis.fandom.com/api.php?action=parse&page=The%20Prince%20of%20Tennis%20-%20The%20Two%20Samurai%3A%20The%20First%20Game&prop=wikitext"],
  },
  {
    seriesId: 'the-prince-of-tennis',
    ruleId: 'I45',
    value: { anilistId: 814, standing: 'filler', note: "original (triage): Original 29-minute short co-screened with Futari no Samurai; 脚本 志茂文彦 (Fumihiko Shimo) per ja-WP, whose synopsis is one line: 「跡部が各校のテニス部を集めて大規模な学園祭風のパーティーを開く」 — Atobe throws a school-festival-style party for every school's tennis club." },
    reason:
      "Owner triage (triage__the-prince-of-tennis.json): Tennis no Ouji-sama: Atobe Kara no Okurimono - Kimi ni Sasageru Tenipuri Matsuri adapts no chapters of the instrument — Original 29-minute short co-screened with Futari no Samurai; 脚本 志茂文彦 (Fumihiko Shimo) per ja-WP, whose synopsis is one line: 「跡部が各校のテニス部を集めて大規模な学園祭風のパーティーを開く」 — Atobe throws a school-festival-style party for every school's tennis club.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext","https://princeoftennis.fandom.com/api.php?action=parse&page=Atobe's%20Gift&prop=wikitext","https://en.wikipedia.org/w/api.php?action=parse&page=The%20Prince%20of%20Tennis%3A%20Futari%20no%20Samurai&prop=wikitext"],
  },
  {
    seriesId: 'the-prince-of-tennis',
    ruleId: 'I45',
    value: { anilistId: 1190, standing: 'filler', note: "original (triage): An event short, not an adaptation." },
    reason:
      "Owner triage (triage__the-prince-of-tennis.json): Tennis no Ouji-sama: A Day of the Survival Mountain - Kyoufu no Kyouka Training! adapts no chapters of the instrument — An event short, not an adaptation.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext","https://www.productionig.com/contents/works/07_/000129.html","https://princeoftennis.fandom.com/api.php?action=parse&page=A%20Day%20on%20Survival%20Mountain&prop=wikitext"],
  },
  {
    seriesId: 'the-prince-of-tennis',
    ruleId: 'I45',
    value: { anilistId: 10731, standing: 'filler', note: "original (triage): The 10th-anniversary film (劇場版 テニスの王子様 英国式庭球城決戦!, 2011-09-03), 脚本 広田光毅 (Koki Hirota) per ja-WP — an original story with original antagonists." },
    reason:
      "Owner triage (triage__the-prince-of-tennis.json): Tennis no Ouji-sama: Eikokushiki Teikyuu Shiro Kessen! adapts no chapters of the instrument — The 10th-anniversary film (劇場版 テニスの王子様 英国式庭球城決戦!, 2011-09-03), 脚本 広田光毅 (Koki Hirota) per ja-WP — an original story with original antagonists.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext","https://princeoftennis.fandom.com/api.php?action=parse&page=The%20Prince%20of%20Tennis%3A%20Eikoku-shiki%20Teiky%C5%AB-j%C5%8D%20Kessen!&prop=wikitext","https://en.wikipedia.org/w/api.php?action=parse&page=The%20Prince%20of%20Tennis&prop=wikitext"],
  },
  {
    seriesId: 'the-prince-of-tennis',
    ruleId: 'I45',
    value: { anilistId: 5996, standing: 'filler', title: 'Hagoita no Ouji-sama', note: "original (triage): The New Year special of 2002-01-01. · repair (P8): ja-WP 羽子板の王子様 — Hagoita, a typo in the stored title" },
    reason:
      "Owner triage (triage__the-prince-of-tennis.json): Tennis no Ouji-sama: Hagiota no Ouji-sama adapts no chapters of the instrument — The New Year special of 2002-01-01.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext","https://princeoftennis.fandom.com/api.php?action=parse&page=New%20Years%20Special&prop=wikitext"],
  },
  {
    seriesId: 'the-prince-of-tennis',
    ruleId: 'I45',
    value: { anilistId: 10862, standing: 'filler', note: "original (triage): A DVD line, not an adaptation." },
    reason:
      "Owner triage (triage__the-prince-of-tennis.json): Tennis no Ouji-sama: TV Anime-ban Pairpuri DVD adapts no chapters of the instrument — A DVD line, not an adaptation.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext","https://princeoftennis.fandom.com/api.php?action=parse&page=PairPuri~arc&prop=wikitext","https://princeoftennis.fandom.com/api.php?action=parse&page=List%20of%20The%20Prince%20of%20Tennis%20Pair%20Puri%20Volumes&prop=wikitext"],
  },
  {
    seriesId: 'the-prince-of-tennis',
    ruleId: 'I45',
    value: { anilistId: 20942, standing: 'filler', note: "filler for this owner — adapts the 4-koma spin-off 放課後の王子様 (原案・監修 許斐剛 / 漫画 佐倉ケンイチ, 9 vols) — a different run: decision (d) candidate" },
    reason:
      "Owner triage (triage__the-prince-of-tennis.json): Houkago no Ouji-sama adapts no chapters of the instrument — It adapts a manga — but a DIFFERENT run, so 'no' against this owner's instrument.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ["scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98%20(%E3%82%A2%E3%83%8B%E3%83%A1)&prop=wikitext","https://ja.wikipedia.org/w/api.php?action=parse&page=%E3%83%86%E3%83%8B%E3%82%B9%E3%81%AE%E7%8E%8B%E5%AD%90%E6%A7%98&prop=wikitext","https://princeoftennis.fandom.com/api.php?action=parse&page=List%20of%20The%20Prince%20of%20After%20School%20Chapters&prop=wikitext"],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3280, airDate: '1984-04-07', note: 'repair (P8): AniList prints 1984-07-04 — a month/day swap; ja-WP (three places) and the 土曜トップスペシャル list give Saturday 1984-04-07. Standing stays pending: the special adapts ch 86-89 (the owner triage, wave 2) and joins the per-work programme.' },
    reason:
      "Wave 2 triage (verified R24): the TV special 決戦!七人の正義超人vs宇宙野武士 adapts printed ch 86-89 (the Rakka arc the TV run cut) — a YES; the stored date is a month/day swap. Sean 2026-09-05: the repair lands now, the standing waits for the per-work verdict.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/triage__kinnikuman.json', 'scripts/ingest/research/discovery/verify/triage__kinnikuman.md'],
  },
];

/** series id → anilist id → the ruling */
export const RELATED_WORK_RULINGS: Record<string, Record<number, RelatedWorkRuling>> = {};
for (const e of ENTRIES) (RELATED_WORK_RULINGS[e.seriesId] ??= {})[e.value.anilistId] = e.value;

export const relatedWorkRuling = (seriesId: string, anilistId: number): RelatedWorkRuling | null => RELATED_WORK_RULINGS[seriesId]?.[anilistId] ?? null;
