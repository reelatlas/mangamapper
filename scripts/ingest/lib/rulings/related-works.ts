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
    value: { anilistId: 3273, standing: 'filler', position: 65.5, note: "original (triage): NO — original screenplay (山崎晴哉), film 1 of the Toei Manga Matsuri line. Position RULED 65.5 (wave 4a, Sean 2026-09-05): the seam slot it derives to, ruled beside Movie 2's 65.51 so the pair never re-walks." },
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
    value: { anilistId: 147810, standing: 'filler', position: 119.51, note: "original (triage): NO — an original 15-minute 16mm traffic-safety education film (安全教育アニメ; ja-WP lists it in that genre's table). Position RULED 119.51 (wave 4a, Sean 2026-09-05): 119.5 is Movie 4's ruled watch slot; an out-of-story PSA follows it." },
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
    value: { anilistId: 3280, standing: 'mixed', chapter: 89, volume: 7, chaptersAdapted: "86-89 (JC vol 7 = 81-94) — the Planet Rakka / 宇宙野武士 spine (the invasion, the elder's messenger, the seven assembled, Rakka freed); the seven named bandits' ring duels, Marron's abduction, the Prince Medaka reveal and four recruitment duels are original", position: 47.5, airDate: '1984-04-07', note: "MIXED — the chapters supply the spine, ja-WP's アニメオリジナルシリーズ section catalogues the replaced second half; the block's sole animation (ch 80-81 / 84-85 animated nowhere). Ruled to the WATCH SLOT 47.5: the setting + the wiki's viewing order, Toei Video's VOL.5 = TVスペシャル＋第48話～第56話; broadcast 1984-04-07 = the air-date slot 51.5 (mid-match). ja-WP: パラレルワールド的な扱い. The 扉絵 roster (WSJ 1984 #18) = a credit (T26). Date repair (P8): AniList prints 1984-07-04, a month/day swap — Saturday 1984-04-07 on ja-WP and the 土曜トップスペシャル list." },
    reason:
      "Wave 2 triage (verified R24): the TV special adapts printed ch 86-89 (the Rakka arc the TV run cut); the stored date is a month/day swap. WAVE 4a (verified SOUND WITH NOTES): mixed — the spine is the chapters', the second half a replaced plot; Kayama's WSJ issue numbers prove no phantom slot; the watch slot 47.5 on the setting, the wiki's stated viewing order and Toei Video's own VOL.5 listing (a listing order, not an AoT-style ordinal). Sean 2026-09-05: mixed, 47.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/triage__kinnikuman.json', 'scripts/ingest/research/discovery/verify/triage__kinnikuman.md'],
  },
  // ---- WAVE 3 (same-instrument works), Sean ruled 2026-09-05 with Cursor: three of the eight task premises refuted on sources (the KonoSuba OVAs and Road to Hero are originals; the AoT OADs shipped with manga volumes and sit at 3.5)
  {
    seriesId: 'the-melancholy-of-haruhi-suzumiya',
    ruleId: 'I45',
    value: { anilistId: 7311, standing: 'canon', chapter: null, volume: 4, chaptersAdapted: 'LN vol 4 ch 1-6 — the whole volume (プロローグ + 第一章-第六章 + エピローグ, 本編 247 pp)', note: 'After the 2009 run\'s last row (Someday in the Rain is chronologically last; ja-WP: the film 続く from the TV finale). The original share is relocations (the rooftop) and a post-credits library coda from Tanigawa\'s idea — faithfulness-clause slivers (T28); Tanigawa 原作・脚本協力 is a credit, not an adoption. 162 min, 2010-02-06.' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES): ja-WP's series article (原作第4巻『消失』の内容を映像化したもの), the film article's critics (原作エピソードがほぼ網羅; 原作を忠実に再現) and the fandom agree the film adapts vol 4 whole; the six-chapter division is fan-tier (three compilations agree page for page; no publisher 目次 online) — the standing rests on the whole-volume claim, not the count. Sean 2026-09-05: canon, 28.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/the-melancholy-of-haruhi-suzumiya__7311.json', 'scripts/ingest/research/discovery/verify/the-melancholy-of-haruhi-suzumiya__7311.md'],
  },
  {
    seriesId: 'attack-on-titan',
    ruleId: 'I45',
    value: { anilistId: 18397, standing: 'mixed', chapter: null, volume: 5, chaptersAdapted: 'the unnumbered 特別編「イルゼの手帳」 (head of vol 5, before ch 19; WSM 2011 No. 2-3) — adapted in full by OAD #3.5 inside an original 49th-expedition frame; #3.25 突然の来訪者 and #3.75 困難 are originals (Kodansha: 完全新作アニメ)', position: 3.5, note: 'One AniList id, one standing: a whole special chapter beside two full originals is MIXED (T28); if the bundle is ever split, #3.5 is mixed too (the original frame), never canon. Ruled to 3.5: the licensor numbers the three OADs #3.25 / #3.5 / #3.75 between TV eps 3 and 4; they shipped with manga vols 12-14 limited editions (2013-12-09 → 2014-08-08) — AniList carries only the first date; 25.51 was the air-date proposal.' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES): Kodansha's vol-5 目次 prints 特別編 イルゼの手帳 first, before ch 19; the AoT Wiki's chapter infobox (Number N/A, overall s2) and OAD pages (Manga chapters = Ilse's Notebook on #3.5 only); shingeki.tv's OAD Archive lists #3.25 / #3.5 / #3.75; Kodansha's limited-edition copy calls the other two 完全新作アニメ. Sean 2026-09-05 (with Cursor): mixed, position 3.5, volume 5 by hand.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/attack-on-titan__18397.json', 'scripts/ingest/research/discovery/verify/attack-on-titan__18397.md'],
  },
  {
    seriesId: 'konosuba-gods-blessing-on-this-wonderful-world',
    ruleId: 'I45',
    value: { anilistId: 21574, standing: 'filler', note: 'An author-written original for the disc — KADOKAWA: 原作者書きおろしエピソードを完全シナリオ化, TVアニメでは放送されないオリジナルアニメ; the fandom\'s own row: Anime Original; no bonus story of vol 9 (four others) or of the よりみち collections is this story. Akatsuki\'s credit is not an adoption (T26). 第1期 第11話 — after ep 10 (10.5); the fandom\'s in-universe 14.5 is inference.' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES on four lineages: the publisher, the trade press, the fandom's field, ja-WP's 特典小説 inventory): the S1 OVA adapts no printed unit of the novel line. Sean 2026-09-05: filler, 10.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/konosuba-gods-blessing-on-this-wonderful-world__21574.json', 'scripts/ingest/research/discovery/verify/konosuba-gods-blessing-on-this-wonderful-world__21574.md'],
  },
  {
    seriesId: 'konosuba-gods-blessing-on-this-wonderful-world',
    ruleId: 'I45',
    value: { anilistId: 97996, standing: 'filler', note: 'An author-written original for the disc — the S2 product page and KADOKAWA: 原作者暁なつめ書き下ろしエピソード, TVアニメでは放送されないオリジナルアニメ; LN vol 12 is the bundle, not the source (its four bonus stories and the よりみち collections cleared); the fandom\'s Ran = an unnamed vol 11 cameo the OVA does not adapt. 第2期 第11話 — after ep 20, before the film (20.52).' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES): the same shape as the S1 OVA — the official S2 site, KADOKAWA's record, ja-WP's 特典小説 column and the fandom's Anime Original row agree; the vol 3 bonus 『芸術は爆裂だ』 is unrelated on content. Sean 2026-09-05: filler, 20.51.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/konosuba-gods-blessing-on-this-wonderful-world__97996.json', 'scripts/ingest/research/discovery/verify/konosuba-gods-blessing-on-this-wonderful-world__97996.md'],
  },
  {
    seriesId: 'haikyu',
    ruleId: 'I45',
    value: { anilistId: 153658, standing: 'canon', chapter: 326, volume: 37, chaptersAdapted: '293-325 in full; 326 closing scene only (Kamomedai\'s win, Hoshiumi\'s challenge — partial); the post-credit Daishō scene is ch 327\'s, played out of order — a sliver, never the END', note: 'After ep 87 (END 292): the film continues the run with no gap and stops at ch 326\'s closing scene — the whole Nekoma match, abridged (vols 33-37, 85 min); the TV run never animates it, so a viewer who skips the film misses 33 chapters. The cold open restages ch 25 (weightless). Continue = 326 from the top (C1). Film 2 (VS 小さな巨人, 2027) follows.' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES): the Haikyu Wiki's film infobox (293 to 326), MangaUpdates' segment (Vol 33 Chap 293 → Vol 37 Chap 325, abridged) and ja-WP (vols 33-37) agree; ep 87's stored END 292 is the manual G56 terminal and the film opens on 293; the 38-item difference list is reorders and omissions (T28). Sean 2026-09-05: canon, 87.5; END 326 (the Infinity Castle precedent), volume 37.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/haikyu__153658.json', 'scripts/ingest/research/discovery/verify/haikyu__153658.md'],
  },
  {
    seriesId: 'one-punch-man',
    ruleId: 'I45',
    value: { anilistId: 21386, standing: 'filler', note: 'An original prequel (Saitama\'s pre-hero days) told inside a present-day frame with Genos — no numbered chapter and none of the 45 bonus chapters is this story (the fandom\'s OVA-only characters; ja-WP\'s アニメオリジナル lists). 原案 ONE (the official site), 脚本 鈴木智尋 — a credit, not an adoption (T26). Shipped with manga vol 10 (2015-12-04) between eps 9 and 10; the "#00" label is a set ordinal, not a run position.' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES): the 45-bonus-chapter sweep replicated; the fandom's Saitama's Hero Suit page cites only the OVA for its origin; the official BOX page and V-STORAGE call it the vol-10 bundled OVA. The verifier corrected the note: ONE is credited 原案 on the official page the verdict cites — a credit, never an adoption. Sean 2026-09-05: filler, 9.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/one-punch-man__21386.json', 'scripts/ingest/research/discovery/verify/one-punch-man__21386.md'],
  },
  {
    seriesId: 'kaguya-sama-love-is-war',
    ruleId: 'I45',
    value: { anilistId: 125368, standing: 'canon', chapter: 96, volume: 10, chaptersAdapted: '96 (かぐや様は食べさせたい, vol 10 — its sole adaptation) + the two unnumbered 番外編 「かぐや様は告らせたい ダークネス」 vol.1 / vol.2 (YJ GOLD 2017-05-18 / 2017-10-19, uncollected) — the manga\'s own specials by its author, side-story facts with no number', note: 'CANON (Sean 2026-09-05): the publisher files Darkness as this manga\'s own 番外編 by the same author and bundled its adaptation with vol 22 — the instrument, not another work (I41). After S2 ep 24 (第2期OVA; ja-WP 全12話+OVA; MU (S2 + OVA)); nothing passes the S2 frontier (S2 ends 101, S3 opens 102). 2021-05-19.' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES): the official 収録内容 names the three segments; the fandom's Chapter 96 page, MangaDex and Abema agree on ch 96; Comic Natalie and Shueisha's own copy file the Darkness one-shots as the series' 番外編 / 外伝 (特別読切, 単行本未収録). Sean 2026-09-05 (with Cursor): canon, chapter 96, volume 10, the note names both specials; the GTO rule is not the basis (those extras were in the run and collected).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/kaguya-sama-love-is-war__125368.json', 'scripts/ingest/research/discovery/verify/kaguya-sama-love-is-war__125368.md'],
  },
  {
    seriesId: 'that-time-i-got-reincarnated-as-a-slime',
    ruleId: 'I45',
    value: { anilistId: 106509, standing: 'filler', position: 24.05, note: 'Five publisher-stated originals (Kodansha: 完全新作オリジナルアニメーション on every limited edition; Fuse\'s 描き下ろし on OADs 3-5 is a credit — printed only as the OAD\'s own plot in the 2022 BD booklet, never in the LN or manga line). Shipped with manga vols 12-16 limited editions (2019-07-09 → 2020-11-27). Ruled to 24.05: the OADs precede Visions of Coleus (the wiki row @24.1) in every sourced order (ja-WP\'s Coleus footnote, ABEMA\'s guide, the fandom\'s navigation); OAD 5 ends at the ep 24/25 seam.' },
    reason:
      "Wave 3 (verified SOUND WITH NOTES): the fandom's adaptation = N/A on all five OAD pages, ja-WP's 番外編OAD table, Bandai Channel and ANN / Famitsu agree nothing adapts a printed unit; the Veldora's Journal hypothesis points at the S1 recap special (a separate work, not held). Sean 2026-09-05: filler; ruled before Coleus at 24.05.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/that-time-i-got-reincarnated-as-a-slime__106509.json', 'scripts/ingest/research/discovery/verify/that-time-i-got-reincarnated-as-a-slime__106509.md'],
  },
  // ---- WAVE 4a (Kinnikuman ×3, Ranma ×3, One Piece ×2) + WAVE 4b (the Prince of Tennis National Tournament chain), Sean ruled 2026-09-05 with Cursor's notes: positions as WATCH SLOTS where the licensor states the setting; the Ranma cluster ruled explicitly (E13); the PoT chain three ledger rows now, an OVA component at the next /discover sitting
  //      (the three PoT chain entries — 995 / 2752 / 4053 under the-prince-of-tennis — were RETIRED at the 2026-09-06 consolidate (P24): the works became the-prince-of-tennis-national-tournament's own components at the Tennis sitting (§12.142), the rows retired under I13 (d), and their facts live as that series' 26 anchors from the same verdicts)
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3274, standing: 'mixed', chapter: 83, volume: 7, chaptersAdapted: "82-83 (JC vol 7 = 81-94) — Bibimba's attempt, the wounded leg, Meat's cape; Horumon Yaki / Shishkeba Boo's challenge (the film's first half); the Black Emperor / Black Corps half is original", position: 65.51, title: 'Kinnikuman: Ooabare! Seigi Choujin', note: "MIXED — ch 82-83's SOLE adaptation (the TV run cut 第2次怪獣退治編) beside a wholly original Black Corps half; share estimated (~15-20 of 48 min), no timings published. Ruled to the WATCH SLOT 65.51: set between 7人の悪魔超人編 and 黄金のマスク編 (Eiren / Anime Hodai copy; the wiki chain ep 65B → Movie 1 → Movie 2 → 66A); broadcast 1984-12-22 = the air-date slot 76.5. Title per MAL / Toei (ooabare; AniList's Daiabare / Segi is a misreading). ゆでたまご 原作 = a credit (T26)." },
    reason:
      "Wave 4a (verified SOUND WITH NOTES): Nikupedia's per-volume lists re-cumulated (vol 7 = 81-94, the vol-2 prose-line trap survives), the act on Eiren / ja-WP / the wiki / Anime Hodai, the New Characters list = Black Corps only; the setting is licensor-STATED copy with no licensor watch order. Sean 2026-09-05: mixed; positions as WATCH SLOTS (65.51, Movie 1 ruled 65.5); the title repair as 'Ooabare'.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/kinnikuman__3274.json', 'scripts/ingest/research/discovery/verify/kinnikuman__3274.md'],
  },
  {
    seriesId: 'kinnikuman',
    ruleId: 'I45',
    value: { anilistId: 3276, standing: 'mixed', chapter: null, volume: null, chaptersAdapted: "the UNNUMBERED one-shot 「キン肉マン スペシャル編 ロビン・メモ!!の巻」 — 8 colour pages, 週刊少年ジャンプ特別編集『キン肉マン熱闘スペシャル』1984-08-25; collected only in お〜い!!マンガだよ〜ん (1989) and マッスル・リターンズ (1997): no mainline number, in no numbered tankōbon", position: 119.5, note: "MIXED (medium) — all four one-shot beats in order (the film is its sole adaptation; the licensor's synopsis is the one-shot's plot) beside a wholly original middle (Hydra King, eight matches); ~8 pages ≈ 5 of 39 min, untimed. Movie 4, 1985-07-13 (the task's 'Movie 3, 1984' was wrong; nothing stored repaired). Ruled to the WATCH SLOT 119.5: 時系列は夢の超人タッグ編終了後 (ja-WP; the wiki timeline 87-119 → Movie 4 → 120); the air-date slot 100.5 is a story impossibility. The one-shot precedes the film (manga → film). ゆでたまご = a credit (T26)." },
    reason:
      "Wave 4a (verified SOUND WITH NOTES): identity, the one-shot (NDL for the 1989 collection; no numbered tankōbon holds it), the direction and the T28 fork reproduced; mixed is the better-supported reading under T28's text and the AoT / Railgun-41 precedent (the Kaguya precedent: the author's own uncollected special is the instrument's). The slot 119.5 was the PSA's — ruled to 119.51 in the same paste; the writer now plans before touching a row (E14). Sean 2026-09-05: mixed, 119.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/kinnikuman__3276.json', 'scripts/ingest/research/discovery/verify/kinnikuman__3276.md'],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'I45',
    value: { anilistId: 1007, standing: 'mixed', chapter: 265, volume: 25, chaptersAdapted: "230-233 (OVA Vol.1 = v22 stories 7-10); 241 (Vol.3 = v23 story 7); 259-265 (Vol.4 = v25 stories 3-9); Vol.2 / 5 / 6 originals. A ch-245 graft in one lineage only (the Ranma Wiki) — a sentence, never a unit", position: 161.5, note: "MIXED — three whole-arc tapes beside three originals (one AniList id, one standing; if ever split: Vol.1 / 4 canon, Vol.3 mixed-if-split, Vol.2 / 5 / 6 filler). The six 1993-94 OVAs (Vol.1-6, 1993-10-21 → 1994-08-19). Continuous 1-407 numbering; 単行本 = 新装版 boundaries (Kinokuniya's 目次); Viz runs two lower — never in the ledger. After the whole run on content: ep 161 ends at 229, Vol.1 opens on 230. Ruled 161.5 with the Special .51 and the film .52 (chapter and packaging order). Takahashi 原作 = a credit (T26)." },
    reason:
      "Wave 4a (verified SOUND WITH NOTES): membership on AniList / en-WP / ja-WP / the OP-ED fence, chapters on four lineages at every edge, the 新装版 fork proven absent at publisher tier, 234-240 / 242-258 animated by nothing. Sean 2026-09-05: mixed; the cluster ruled 161.5 / 161.51 / 161.52 (E13: the stored order was insertion history).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/ranma-1-2__1007.json', 'scripts/ingest/research/discovery/verify/ranma-1-2__1007.md'],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'I45',
    value: { anilistId: 1008, standing: 'canon', chapter: 278, volume: 26, chaptersAdapted: "266-278 (25巻10話 → 26巻11話, the Ryugenzawa arc; Part One 266-268, Part Two 269-278), adapted to the end (the closing hand-hold)", position: 161.51, note: "CANON — the two-part SPECIAL 甦る記憶 (上巻 1994-12-16 / 下巻 1995-02-17): every difference is a cut or alteration, no original share (53 min for 13 chapters). Boundaries on en-WP's Shogakukan volume table (vol 25 = 257-267, vol 26 = 268-278), the wiki's infoboxes and Shogakukan's 新装版 blurbs — not a 'ja-WP 原作 column' (none exists). Ruled 161.51: chapter order and Viz's set order put the Special before the third film; the air date (1994-12) does not. Title stays AniList's." },
    reason:
      "Wave 4a (verified SOUND WITH NOTES): canon on the negative control (ja-WP's OVAオリジナル marker sits on Vol.2 / 5 / 6, not here), both edges on the volume table, the 新装版 contents at publisher tier; one fabricated citation struck (no ja-WP 原作 column); the title repair refuted (AniList's romaji is stored correctly). Sean 2026-09-05: canon, 161.51 ruled.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/ranma-1-2__1008.json', 'scripts/ingest/research/discovery/verify/ranma-1-2__1008.md'],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'I45',
    value: { anilistId: 1010, standing: 'mixed', chapter: 302, volume: 29, chaptersAdapted: "301-302 (29巻1-2話, 恐怖の鳳凰剣 / 不滅の鳳凰剣 — the Phoenix Sword arc), adapted end to end", position: 161.52, title: "Ranma ½: One Grew Over the Kuno's Nest", note: "MIXED at the borderline — both chapters whole, but ~36-43% of the 25-min film is studio-made (the eviction, the Ukyo / Shampoo recruitment, the vacant-lot night; the aerial battle, the Furinkan rampage) and the phoenix's behaviour is changed; the distributor sold it on the original characters (映連). The third film, 1994-08-20, 配給 東映 (not a Toho fair). Ruled 161.52 after the Special (story order, Pony Canyon's DVD Vol.3, Viz's OVA #9). Title: Viz's jacket prints GREW — AniList's 'Flew' is a mistranscription; the on-screen 'Team Ranma vs. The Legendary Phoenix' is the display pass's question. Takahashi 原作 = a credit (T26)." },
    reason:
      "Wave 4a (verified SOUND WITH NOTES): 301-302 on ja-WP, the wiki's closed reverse index, en-WP's tables and the title-page scans; Shogakukan's own 新装版 29 目次; the verifier's own share count (36-39%) and MIXED recommended with the verdict; 配給 東映 on seven sources. Sean 2026-09-05 (Cursor's note evaluated): mixed; 'Flew' → 'Grew' as the English string; the title language is the display pass's rule, not a one-row swap.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/ranma-1-2__1010.json', 'scripts/ingest/research/discovery/verify/ranma-1-2__1010.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 16239, standing: 'filler', note: "FILLER — an original (Hand Island; 完全新作) whose flashbacks re-animate ch 1 pp. 4-47 and ch 2 pp. 4-22, pages the TV run owns (eps 4 / 1) — a recap share, weightless (T28); the ONE first-time share is ch 1 pp. 4-5 (Luffy's scar), a sliver (the wiki's Qref index: exactly two credits). Oda 原作 / 監修 / designs = credits (T26). Broadcast 2012-12-15 (Fuji TV); 576.51 = the broadcast slot; in-universe 'a little before Film Z' (574.5-578.5, all filler rows) noted only." },
    reason:
      "Wave 4a (verified SOUND WITH NOTES): the single first-time share reproduced mechanically over all 693 pages linking the special; the re-shown pages on Episode 1 / 4's own notes; nothing entered the manga. Sean 2026-09-05: filler, 576.51.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/one-piece__16239.json', 'scripts/ingest/research/discovery/verify/one-piece__16239.md'],
  },
  {
    seriesId: 'one-piece',
    ruleId: 'I45',
    value: { anilistId: 20835, standing: 'filler', note: "FILLER — an original (Byrnndi World, Oda's 描き下ろし villain — a credit, never an adoption, T26) with re-told bookends: Marineford beats (554-580, Ace's death 574), the cliff vow (589), the 3D2Y frame (597), Sabaody (598-602) and a series montage — every page TV-animated (eps 465-522), zero first-time coverage. The post-credit Sabo scene = ch 668's cover, a sliver. 658.5 = the broadcast slot (2014-08-30); the in-universe 516.5 (the timeskip) noted only." },
    reason:
      "Wave 4a (verified SOUND WITH NOTES): zero first-time coverage reproduced page by page; the recap share reaches wider than the verdict's 570-574 (Little Oars Jr, the Pacifistas, Kuzan / Law — all TV-animated); 658.5 the honest position under the KonoSuba precedent. Sean 2026-09-05: filler, 658.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/out/one-piece__20835.json', 'scripts/ingest/research/discovery/verify/one-piece__20835.md'],
  },
  // ---- WAVE 5 (One-Punch Man, DanMachi, Seven Deadly Sins, Gintama, Overlord, Noragami, Magus' Bride, Battle of Gods under three owners), Sean ruled 2026-09-06 with Cursor: as recommended except Magus' Bride → 9.5 (the frame collides with the release slot — the Kinnikuman date-slot class; the frame is recorded in the note, 'earliest the frame permits' is NOT a convention), DBS canon (I40 / T30); three CLUSTERS ruled whole in date order (E13 / E14 — without the sibling moves the writer refuses the ruled slot): gintama 369.5x, danmachi 13.5x, noragami 19.5x
  {
    seriesId: 'one-punch-man',
    ruleId: 'I45',
    value: { anilistId: 21416, standing: 'filler', position: 12.5, note: "FILLER — six OVAs shipped one per S1 BD / DVD volume (2015-12-24 → 2016-05-27), 「ONE原案による完全オリジナルストーリー」 on every disc page (ja-WP; ANN: ONE wrote all six; 脚本 鈴木智尋); no chapter of the instrument carries any of them (the 45-bonus-chapter sweep; ch 30-51 read) and the six named characters are OVA-only; the source-adjacent frames are replays (Sonic's ch-15 defeat, the ch-7 apartment door) — weightless (T28). Position 12.5 on the bundle's LAST member: #06 opens after the Boros invasion ep 12 closes; the members' own windows run 2.5 → 12.5 (one id, one row — I46; the windows are a note). ONE 原案 = a credit (T26); Swim's drawn design cameo is 'designs without the events'." },
    reason:
      "Wave 5 (research-agent, verified R24 SOUND WITH NOTES): the licensor's six volume pages, ja-WP's BD table, ANN 2015-11-15 and en-WP's writer column agree on six originals; the verifier corrected the door frame to ch 7, struck the 'disc order IS the story order' sentence (content windows instead: #01 2.5, #02 5.5+, #03 4.5-5.5, #04 7.5-9.5, #05 9.5+, #06 12.5) and strengthened adopted: null with the wiki's Swim design cameo. Sean 2026-09-06: filler, 12.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/one-punch-man__21416.json', 'scripts/ingest/research/discovery/verify/one-punch-man__21416.md'],
  },
  {
    seriesId: 'is-it-wrong-to-try-to-pick-up-girls-in-a-dungeon',
    ruleId: 'I45',
    value: { anilistId: 101166, standing: 'filler', position: 13.51, note: "FILLER — an anime-original story by the author (ja-WP 「原作者書き下ろし脚本だが、原作小説にはないアニメオリジナルストーリー」; Natalie / ANN 2018-02-18); no novel carries it — the three Ōmori giveaway novellas are DOWNSTREAM of the film (a 前日譚 and two side stories that presuppose it). Set between S1 and S2 by the author himself (Comic Natalie 2019-02-22: 「1期と2期の間、原作では5巻と6巻の間」; vol 5 = our eps 10-13, vol 6 opens S2). Position 13.51 — the 13.x CLUSTER ruled in date order: the hot-springs OVA 21660 (2016-12-07) first at 13.5 (ABEMA's 時系列 list; the fandom's nav ep 13 → OVA → II ep 1), this film (2019-02-15) second. Ōmori's 原作・脚本 = a credit (T26)." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES): standing, [] and adopted null hold on ja-WP, the trade press and the author's interview; the task's 'set after S2' premise refuted. The verifier struck the STORY-page quote (the 完全オリジナル line is not on the licensor's page — the Natalie feature lede carries it) and refused the delivered 13.5 (it would freeze the film ahead of the OVA and silence related_work_cluster_disorder). Sean 2026-09-06: filler; the cluster ruled whole (OVA 13.5, film 13.51). Queued: ep 1's date (stored 2015-04-03 vs ja-WP 4月4日 土曜 1:05).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/is-it-wrong-to-try-to-pick-up-girls-in-a-dungeon__101166.json', 'scripts/ingest/research/discovery/verify/is-it-wrong-to-try-to-pick-up-girls-in-a-dungeon__101166.md'],
  },
  {
    seriesId: 'is-it-wrong-to-try-to-pick-up-girls-in-a-dungeon',
    ruleId: 'I45',
    value: { anilistId: 21660, standing: 'filler', position: 13.5, note: "FILLER — 「大森藤ノ先生完全監修によるオリジナルストーリー！」 on the licensor's own OVA page (live + two 2016 snapshots) and its 2016-08-17 news entry; Ōmori twice (Comic Natalie 2019-08-09; Da Vinci 2019-09-07: the scriptwriter 白根 'ran wild', the author keeps out of OVA originals); the fandom's Volume = Anime Original; no printed unit (the disc's 8-page 解説書; NDL; the 2023 collections; ja-WP's 45-book list). 完全監修 is a blanket supervision credit — T26's rejected shape; adopted null. Vol 7's hot-spring pages belong to TV row 18 (S2 ep 5), not here. First of the 13.x cluster in date order (the film 101166 at 13.51; the climb back from the 18th floor after the Black Goliath — ABEMA's 時系列 list, the fandom's nav); air_date 2016-12-07 holds." },
    reason:
      "Sean 2026-09-06 (wave 5, the danmachi cluster): the writer had the film at 13.5 and this OVA behind it at 13.51 in insertion order — related_work_cluster_disorder's witness; the sourced order is OVA then film. WAVE 6 (a standing-only ask, verified SOUND WITH NOTES — the licensor line grep-verified in all four places, both Ōmori quotes verbatim, the printed-unit negative on three independent lineages): filler, edited IN PLACE (a replaced entry would have dropped the cluster ruling); the interview dates are the pages' own, not ja-WP's. Sean 2026-09-06: filler, 13.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/verify/is-it-wrong-to-try-to-pick-up-girls-in-a-dungeon__101166.md'],
  },
  {
    seriesId: 'the-seven-deadly-sins',
    ruleId: 'I45',
    value: { anilistId: 99540, standing: 'filler', position: 52.5, note: "FILLER — the film adapts no page of the instrument: its story exists only as the film (+ its novelisation). Suzuki's giveaway manga 『天空の囚われ人』 (46 pp, 2018-08-18) is the film's 前日譚 and backstory, drawn FOR it (the licensor's word), staged nowhere in it; 「幻を求めて」 ran in WSM 2018 No. 34 and the owner's wiki files it as Extra Chapter 21 — the manga's own uncollected extra (the Kaguya shape), which the film does not adapt: the DIRECTION, not the venue, decides. Position 52.5: released 2018-08-18 between the S2 finale (ep 52, 2018-06-30) and S3 ep 1 (2019-10-09), set after S2 (ANN; the full roster incl. Escanor and Merlin; AniList's PARENT edge = S2). Suzuki's 原作 credit = a credit (T26)." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES): filler, [], 52.5 and adopted null reproduce on the official site (story / novelty / staffcast), Aniplex, マガポケ, ja-WP, en-WP and the fandom; the verifier replaced the verdict's 'never collected / no mainline number' discriminator (false for 「幻を求めて」, WSM 2018 No. 34) with the direction sentence in the note and dropped 'vol 34/35' (「真昼の決闘」 is vol 34). Sean 2026-09-06: filler, 52.5. Queued: the 7DS shelf (Cursed by Light 128740, Grudge of Edinburgh).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/the-seven-deadly-sins__99540.json', 'scripts/ingest/research/discovery/verify/the-seven-deadly-sins__99540.md'],
  },
  {
    seriesId: 'gintama',
    ruleId: 'I45',
    value: { anilistId: 114129, standing: 'canon', chapter: 704, volume: 77, chaptersAdapted: "699-704 (the whole Jump GIGA + 銀魂公式アプリ 完結編; vol 77 = 696-704, the film opens three chapters in); abridged — 289 pp in 104 min; the ten-minute Dragon Ball-parody prologue re-tells 687-698 as a recap, not coverage", position: 369.5, note: "CANON — after ep 369 (corrected from the air-date slot 367.5): rows 368-369 ARE Gintama: THE SEMI-FINAL (AniList 126819, component 9), the film's 前日譚 adapting 687-698 though streamed a week after the film. The film adapts Lessons 699-704 (the GIGA / app 完結編, vol 77's back half): faithful to the panel (every flashback redrawn, Takasugi's eye = flourish — T28); the parody prologue is a recap, the post-credit 銀八先生 short the one original. END 704 = the manga's last chapter on four lineages; START 699 medium-high (the fandom's three page families + the plot; ja-WP's anime article says 696 against its own film article). First of the 369.5x cluster (date order). Sorachi's 原作／原案・原画・voice credits = credits (T26)." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES): 699-704 / vol 77 on the fandom's film + Lesson pages, MU ('Vol 77, Chap 704 (The Final Movie)'), ja-WP ×2 and en-WP's volume list; canon under T28's recap and faithfulness clauses; the story slot on four sources (the wiki's previous = Episode 369; the ep 368 / 369 pages; ja-WP's 前日譚; en-WP 'bridges the gap'). The verifier: the task's SEMI-FINAL id 121097 is wrong (126819, already component 9 — nothing to mint); 369.5 was held by the unruled Yoshiwara row, so the whole cluster is ruled here (E13 / E14). Sean 2026-09-06: canon, 369.5. Queued: Lesson 691 (skipped by the SEMI-FINAL); ep 367's ch 687 half.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/gintama__114129.json', 'scripts/ingest/research/discovery/verify/gintama__114129.md'],
  },
  {
    seriesId: 'gintama',
    ruleId: 'I45',
    value: { anilistId: 169000, position: 369.51, note: "Gintama on Theater 2D: Baragaki-hen (2023-11-10) — a compilation of the Baragaki arc — filler by rule (N8 recap). Ruled into the 369.5x cluster in date order behind THE VERY FINAL (369.5): Baragaki 369.51, Ikkoku 369.52, Kintama 369.53, Yoshiwara 369.54." },
    reason:
      "Sean 2026-09-06 (wave 5, the gintama cluster): the four halo rows stood in insertion order (2026 → 2024-06 → 2023-11 → 2024-11) at 369.5-369.53 — related_work_cluster_disorder's witness, and 369.5 was the slot THE VERY FINAL's ruling needed; date order ruled explicitly (E13), the film first as the story slot. Identity is the AniList id; the position is the ruled order.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/verify/gintama__114129.md'],
  },
  {
    seriesId: 'gintama',
    ruleId: 'I45',
    value: { anilistId: 175573, position: 369.52, note: "Gintama on Theater 2D: Ikkoku Keisei-hen (2024-06-21) — a compilation of the Ikkoku Keisei arc — filler by rule (N8 recap). Ruled into the 369.5x cluster in date order behind THE VERY FINAL (369.5): Baragaki 369.51, Ikkoku 369.52, Kintama 369.53, Yoshiwara 369.54." },
    reason:
      "Sean 2026-09-06 (wave 5, the gintama cluster): the four halo rows stood in insertion order (2026 → 2024-06 → 2023-11 → 2024-11) at 369.5-369.53 — related_work_cluster_disorder's witness, and 369.5 was the slot THE VERY FINAL's ruling needed; date order ruled explicitly (E13), the film first as the story slot. Identity is the AniList id; the position is the ruled order.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/verify/gintama__114129.md'],
  },
  {
    seriesId: 'gintama',
    ruleId: 'I45',
    value: { anilistId: 178436, position: 369.53, note: "Gintama on Theater 2D: Kintama-hen (2024-11-22) — a compilation of the Kintama arc — filler by rule (N8 recap). Ruled into the 369.5x cluster in date order behind THE VERY FINAL (369.5): Baragaki 369.51, Ikkoku 369.52, Kintama 369.53, Yoshiwara 369.54." },
    reason:
      "Sean 2026-09-06 (wave 5, the gintama cluster): the four halo rows stood in insertion order (2026 → 2024-06 → 2023-11 → 2024-11) at 369.5-369.53 — related_work_cluster_disorder's witness, and 369.5 was the slot THE VERY FINAL's ruling needed; date order ruled explicitly (E13), the film first as the story slot. Identity is the AniList id; the position is the ruled order.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/verify/gintama__114129.md'],
  },
  {
    seriesId: 'gintama',
    ruleId: 'I45',
    value: { anilistId: 197474, position: 369.54, note: "Gintama the Movie 2026: Yoshiwara in Flames (2026-02-13) — the 2026 film (the alternative bucket); standing pending — its own verdict is a later wave. Ruled into the 369.5x cluster in date order behind THE VERY FINAL (369.5): Baragaki 369.51, Ikkoku 369.52, Kintama 369.53, Yoshiwara 369.54." },
    reason:
      "Sean 2026-09-06 (wave 5, the gintama cluster): the four halo rows stood in insertion order (2026 → 2024-06 → 2023-11 → 2024-11) at 369.5-369.53 — related_work_cluster_disorder's witness, and 369.5 was the slot THE VERY FINAL's ruling needed; date order ruled explicitly (E13), the film first as the story slot. Identity is the AniList id; the position is the ruled order.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/verify/gintama__114129.md'],
  },
  {
    seriesId: 'overlord',
    ruleId: 'I45',
    value: { anilistId: 133845, standing: 'canon', chapter: null, volume: 13, chaptersAdapted: "LN vols 12-13 ch 1-7 + エピローグ (vol 12 『聖王国の聖騎士 上』 = ch 1-3 entire; vol 13 『下』 = ch 4-7 + the epilogue; the vol-13 幕間 is the only unadapted unit) — the ARC's own 1-7 numbering, not a series chapter space", position: 46.5, note: "CANON — a MIDQUEL: watch between S4 ep 7 (row 46, 霜の竜王, vol 11's close) and ep 8 (row 47, which opens on the film's outcome as past news) — ja-WP 「第4期第7話と第8話の間」, the fandom's film page, director Itō at NYCC 2024, and the content seam. The film is vols 12-13 entire (984 pp in 135 min: omission, compression, the Prart → Kalinsha relocation — no anime-original scene named by any source; T28). Chapter null: the owner's instrument is Maruyama's novel with arc-local 章 numbering (the novel-owner shape: KonoSuba 102976, Haruhi 108623) — volume 13 is the END unit. Maruyama's 原作 credit = a credit (T26); nothing entered the novel line." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES): the units on the fandom's Volume 12 / 13 pages and a Japanese per-chapter 感想 printing the headers; the position on ja-WP (a 2022 insertion, provenance traced), the fandom, the director and the seam (row 46 ends on Demiurge's report, row 47 opens after it); nothing weighs against 46.5 (no licensor packaging or marathon places the film elsewhere). The verifier: the proposer's chapter: 7 is a number in a space this owner does not have and '1-3, 4-7' drops the load-bearing volumes — hand-written; 'vol 11's epilogue' → 'vol 11's close'. Sean 2026-09-06 (Cursor): canon, chapter null, volume 13, 46.5. Queued: 「カッツェ平野の幽霊船」 (a Maruyama side story no anime adapts — I41 if the chain wants it).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/overlord__133845.json', 'scripts/ingest/research/discovery/verify/overlord__133845.md'],
  },
  {
    seriesId: 'noragami',
    ruleId: 'I45',
    value: { anilistId: 20494, standing: 'canon', chapter: 25, volume: 7, chaptersAdapted: "24 (the hanami — the chapter's body; Aragoto ep 7 = row 19 has only its closing beat) + 25 (the 神憑り possession half — Aragoto ep 7 has the Divine Council half) + ノラガミ拾遺集 ch 2 「神器の心中を問う事」 (the author's unnumbered 番外編, 拾遺集 第壱巻 2013-11-15 — a side_story fact, not in the 1-109 space)", position: 19.5, note: "CANON — after Aragoto ep 7 (row 19), the episode that reaches vol 7's chs 24-25 and skips exactly the picnic and the possession: the OADs are the SOLE adaptation of those PARTS. 7.5 was OAD 1's ship date (vol 10 LE, 2014-02-17); OAD 2 shipped with vol 11 LE (2014-07-17) after S1 ended — release slots that would spoil the Bishamonten arc. OAD 1 = ch 25 (Kodansha 「原作第25話神憑りのお話」; original share unsized), OAD 2 = ch 24 + 拾遺集 ch 2 (ja-WP; the wiki). No licensor numbering (ja-WP's OAD table unnumbered; both seasons' BD 収録話 = TV only). First of the 19.5x cluster; the Aragoto OADs 119941 follow at 19.51. Adachitoka's 原作 credit = a credit (T26)." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES): the chapter equations on Kodansha's own LE copy, ja-WP's 沿革 and the wiki's OVA / chapter / arc pages, MU's two coverage strings; canon under T28's faithfulness clause; the position on content (row 19 = where the run reaches chs 24-25 and Hiyori enters high school). The verifier: 19.5 was held by the Aragoto-OVA row (the writer would refuse) → the cluster ruled whole; '24, 25' overstated coverage → the parts string; the 拾遺集 shelf question (Kodansha files it as 『ノラガミ』の番外編 by the same author) is Sean's, queued with TV ep 4. Sean 2026-09-06: canon, 19.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/noragami__20494.json', 'scripts/ingest/research/discovery/verify/noragami__20494.md'],
  },
  {
    seriesId: 'noragami',
    ruleId: 'I45',
    value: { anilistId: 119941, position: 19.51, note: "Second of the 19.5x cluster (the S1 OADs 20494 first at 19.5, story order): the Aragoto OADs (2015-11-17 / 2016-03-17) keep the slot their air date derived, as the ruled order. Standing pending — its own verdict is a later wave (the verifier: 拾遺集 ch 6 + mainline ch 41 is past the run's terminal 39, so 25.5 may be its story slot)." },
    reason:
      "Sean 2026-09-06 (wave 5, the noragami cluster): 19.5 was this row's by air-date derivation and the S1 OADs' by content; the writer refuses a ruled slot held by a non-mover (E14), so the pair is ruled explicitly in story order (E13). Identity is the AniList id; the position is the ruled order.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/verify/noragami__20494.md'],
  },
  {
    seriesId: 'the-ancient-magus-bride',
    ruleId: 'I45',
    value: { anilistId: 21688, standing: 'filler', position: 9.5, note: "FILLER — 「ヤマザキコレ原案による完全オリジナルアニメーション」 (Mag Garden's OVA site; ja-WP; lisani; ANN; Shochiku): Chise's childhood, never drawn; the Chika beat restages vol 1's own fact (weightless). Three parts 2016-08-13 → 2017-09-08 with 特装版 vols 6-8; the row keeps the theatrical date. POSITION 9.5 (Sean): the OAD's own 'now' is its frame — Chise at 15 in Elias' house with Ruth already her familiar (contracted in TV ep 8), and the licensor's synopsis places the frame after her arrival — so 0.5 (release order) shows Ruth before he exists; 8.5 is refuted (ep 9 opens on Elias' two-week seclusion since ep 8); 9.5 is the first slot the run does not contradict (Elias is back by ep 9's end; ep 10 opens at home). An inference (medium) — no licensor order exists. Yamazaki's 原案 = a credit; adopted null at medium (断片集 1 第2片 unread)." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES on the standing, REFUTED on the delivered 8.5): the original-story claim on five lineages; the verifier found ep 9's seclusion clause (the fandom's Chapter = 13, 14; en-WP) and named 9.5 as the earliest slot the frame permits, 0.5 as release order only. Sean 2026-09-06 (Cursor's line): 9.5 — the setting collides with the release slot, the Kinnikuman date-slot class; the frame is recorded in the note and 'earliest the frame permits' is NOT a convention (P9 — a per-work judgment). Queued: the second trilogy's wiki row @24.1 (two AniList ids — identity).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/the-ancient-magus-bride__21688.json', 'scripts/ingest/research/discovery/verify/the-ancient-magus-bride__21688.md'],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 14837, standing: 'filler', position: 288.51, note: "RE-SEATED 288.51 (wave 6, 2026-09-06 — the 288.5x cluster in story and release order, one package: Yo! Son Goku Age 776 / 2008 at 288.5, this film 778 / 2013 at 288.51, Resurrection 'F' 779 / 2015 at 288.52). FILLER — official continuity (Toei: 「スピンオフでも番外編でもない…正史」) but no page of the manga is in it: set in the ten-year gap between ch 517 and 518 (Toei 2012-07-17; WSJ #33 via ANN; ja-WP's 年代記 ref) — after ep 288 (遅いぜ悟空！みんなでパーティ!!, 1996-01-10, the barbecue) and before ep 289 (悟空おじいちゃん！私がパンよ!!, the ten-years-later Budokai), ja-WP's own Z slot, rows joined by title + date (R20); our anchors agree (287 → 517, 288 filler, 289 → 517-518). Release order (291.5) would show Uub and Goku's departure before a film set six years earlier. No adopted{author} on the 脚本 basis (渡辺雄介; Sean 2026-09-05); nothing entered this manga (closed 1995) — the DBS manga's ch 1-4 incorporation is correspondence on THAT owner." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES, one work under three owners — verify/dragon-ball__14837.md): the placement sources reproduce verbatim (Toei's 2012-07-17 release, ANN / WSJ #33, ja-WP 神と神's three-owner slot, the wiki); the DBS standing was a genuine fork the verdict delivered honestly — the verifier and the sitting read CANON as the ruled model (I40 / T30 outrank the protocol's adaptation-owner example, whose adopted-note premise the 2026-09-05 sitting removed) and required the chapter string to say correspondence (a bare 'vol 1 · ch 4' would render as adaptation). Sean 2026-09-06: DBS canon; DBZ 288.5 and Kai 165.5 as one story point. WAVE 6: the DBZ seat re-ruled 288.51 with the cluster (Cursor: 'do not leave BoG at 288.5'). Queued (same class, next wave): Resurrection 'F' 20778 under all three owners; Yo! Son Goku 5152 (Age 776) at DBZ 291.53; the protocol's stale Battle-of-Gods sentence; a parallel-owner clause; the writer / census gap for chapter fields on a parallel owner.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/dragon-ball-z__14837.json', 'scripts/ingest/research/discovery/verify/dragon-ball__14837.md'],
  },
  {
    seriesId: 'dragon-ball-z-kai',
    ruleId: 'I45',
    value: { anilistId: 14837, standing: 'filler', position: 165.5, note: "FILLER — the same story point as DBZ 288.5: ja-WP's 改 slot 「第157話と第158話の間」 converted by TITLE, never by number (R20) — JP 157 やっぱり最強孫悟空!! 魔人ブウ消滅 = our row 164, JP 158 そして10年後… = our row 166; row 165 (Peace Returns!, international-only, = DBZ 287B-288) is the last row before the ten-year skip → 165.5. Our space is the international numbering (167 rows; eight rows never aired in Japan — batch 19's list); the task's 'Kai ends at 98' premise is refuted (98 is only the 2009-11 run's end; the air-date slot 98.5 sat inside a three-year broadcast gap). No adopted{author} (脚本 渡辺雄介); nothing entered the manga." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES, one work under three owners — verify/dragon-ball__14837.md): the placement sources reproduce verbatim (Toei's 2012-07-17 release, ANN / WSJ #33, ja-WP 神と神's three-owner slot, the wiki); the DBS standing was a genuine fork the verdict delivered honestly — the verifier and the sitting read CANON as the ruled model (I40 / T30 outrank the protocol's adaptation-owner example, whose adopted-note premise the 2026-09-05 sitting removed) and required the chapter string to say correspondence (a bare 'vol 1 · ch 4' would render as adaptation). Sean 2026-09-06: DBS canon; DBZ 288.5 and Kai 165.5 as one story point. Queued (same class, next wave): Resurrection 'F' 20778 under all three owners; Yo! Son Goku 5152 (Age 776) at DBZ 291.53; the protocol's stale Battle-of-Gods sentence; a parallel-owner clause; the writer / census gap for chapter fields on a parallel owner.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/dragon-ball-z-kai__14837.json', 'scripts/ingest/research/discovery/verify/dragon-ball__14837.md'],
  },
  {
    seriesId: 'dragon-ball-super',
    ruleId: 'I45',
    value: { anilistId: 14837, standing: 'canon', chapter: 4, volume: 1, chaptersAdapted: "1-4 (CORRESPONDENCE, never adaptation — the DBS manga's 65-page digest of the film, V-Jump 2015年8月号-11月号, vol 1 『第6宇宙の戦士たち』; the film precedes the pages by 27 months; A46 / T30)", position: 0.5, note: "CANON on the parallel owner (I40 / T30: from the outline or not — the film is the opening arc's FIRST telling; eps 1-14 re-compose it 「リメイク・再構成」 and manga ch 1-4 digest it). Position 0.5 — before ep 1 in release order (film 2013-03-30; ch 1 2015-06-20; ep 1 2015-07-05) and in story order alike; the Mugen Train shape (112151 @26.5): a viewer takes the film OR rows 1-14 OR the digest, not all three. The chapter fields are the T30 correspondence record (the arcs.ts Battle of Gods ruling, eps 1-14 ↔ ch 1-4), never a claim that the film adapts pages. No adopted{author} (脚本 渡辺雄介; Sean 2026-09-05); the manga's incorporation of the film IS the correspondence, not an adoption stacked on it (the RoF shape)." },
    reason:
      "Wave 5 (verified SOUND WITH NOTES, one work under three owners — verify/dragon-ball__14837.md): the placement sources reproduce verbatim (Toei's 2012-07-17 release, ANN / WSJ #33, ja-WP 神と神's three-owner slot, the wiki); the DBS standing was a genuine fork the verdict delivered honestly — the verifier and the sitting read CANON as the ruled model (I40 / T30 outrank the protocol's adaptation-owner example, whose adopted-note premise the 2026-09-05 sitting removed) and required the chapter string to say correspondence (a bare 'vol 1 · ch 4' would render as adaptation). Sean 2026-09-06: DBS canon; DBZ 288.5 and Kai 165.5 as one story point. Queued (same class, next wave): Resurrection 'F' 20778 under all three owners; Yo! Son Goku 5152 (Age 776) at DBZ 291.53; the protocol's stale Battle-of-Gods sentence; a parallel-owner clause; the writer / census gap for chapter fields on a parallel owner.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/dragon-ball-super__14837.json', 'scripts/ingest/research/discovery/verify/dragon-ball__14837.md'],
  },
  // ---- WAVE 6 (Blue Exorcist, Food Wars, BSD, DanMachi, Kaguya-sama, Fruits Basket, OPM S2, the Dragon Ball slot ask), Sean ruled 2026-09-06 with Cursor: all eleven as recommended — DBS Resurrection F canon at 14.5 (T30), the DBZ 288.5x cluster as ONE package (Yo! → BoG → RoF), Blue Exorcist pinned, no Kai row for Yo!; BSD lands on its wiki row through the adopted-row path
  {
    seriesId: 'food-wars',
    ruleId: 'I45',
    value: { anilistId: 98702, standing: 'mixed', chapter: 119, volume: 15, chaptersAdapted: "118-119 (vol 15 — the Elite Ten's arrival: ch 118 the Council's full appearance, 119 their formal introduction; en-WP: vol 14 ends at 118, vol 15 opens at 119) — episode 2 「遠月十傑」 entire, the TV run's hole between ep 37 (END 117) and ep 38 (START 120); episode 1 「秋月のめぐり逢い」 is the licensor's アニメオリジナルストーリー", position: 37.5, airDate: '2017-05-02', note: "MIXED — two near-equal OVAs on one AniList id (I46: one row, one standing): ep 1 (vol-24 disc, 2017-05-02, 24 min) an original on the licensor's own label; ep 2 (vol-25 disc, 2017-07-04, 25 min) a straight adaptation — ja-WP 「これまでのOVAシリーズとは違い原作の本筋が描かれ」. The OVA is the sole animation of 118-119 (S3 re-shows it as a flashback). Position 37.5: the chapters, the setting, the fandom's arc order (37 → OVA → 38) and the release slot agree. airDate 2017-05-02 (AniList's 05-01 = MAL's, one lineage — P8). 脚本 ヤスカワショウゴ; Tsukuda / Saeki = credits (T26)." },
    reason:
      "Wave 6 (research-agent, verified R24 SOUND WITH NOTES): standing, 118-119 / vol 15, 37.5 and adopted null on the licensor's own copy, ja-WP, en-WP's chapter list (a second lineage for the volume seam), the fandom's chapter and episode pages and MU's coverage string (its volume digits wrong, its chapters right). The verifier: the START 118 is firmer than filed (the Council's 'Full Appearance' debut) — no 119-119 fallback; the date repair is owed (four sources say 05-02; the verdict declined it on a false premise); the fandom's ch-118 summary is an AI paste — re-cited. Sean 2026-09-06: mixed, 37.5, airDate 2017-05-02.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/food-wars__98702.json', 'scripts/ingest/research/discovery/verify/food-wars__98702.md'],
  },
  {
    seriesId: 'bungo-stray-dogs',
    ruleId: 'I45',
    value: { anilistId: 21791, standing: 'canon', chapter: 40, volume: 10, chaptersAdapted: "40 (vol 10) — 第四十話 独り歩む in full (44 pp); the run's SOLE adaptation: S3 reorders around it (28 = 42, 29 = 38 + 41, 30 = 39 + 43, 31 = 44-45) and no episode carries ch 40", note: "CANON — the owner's own ch 40 『独り歩む』 (vol 10's printed 目次; KADOKAWA: the vol-13 限定版's Blu-ray, 発売日 2017-08-04; the licensor's own 第25話 count is the shift N9 records — the source's count, not an AFL artefact). The position 24.5 is the wiki row's own ruling (I46 adoption) — never moved here. The closing Fukuzawa / Taneda coda is an anime addition (Taneda debuts ch 58) — a divergence beat, T28. Asagiri / Harukawa credits = credits (T26); 脚本 榎戸洋司." },
    reason:
      "Wave 6 (verified SOUND on the facts — REFUTED on the landing, closed in code): ch 40 / vol 10 on the publisher's print, the licensor's own 第25話, en-WP's chapter list, the fandom's adapted-from field and three debut characters; the reorder verified on titles + dates; ja-WP's BD-BOX 2 「第13話 - 第25話」 a witness the verdict missed. The stored row is WIKI-origin (the batch-8 fractional ruling) and sync-related-works skipped non-halo rows before reading rulings — the I45 layer now applies a ruling's FACTS to adopted rows (standing, chapters, note, repairs; never the position) and the census covers them (2026-09-06). Sean 2026-09-06: canon, ch 40, 24.5 kept.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/bungo-stray-dogs__21791.json', 'scripts/ingest/research/discovery/verify/bungo-stray-dogs__21791.md'],
  },
  {
    seriesId: 'kaguya-sama-love-is-war',
    ruleId: 'I45',
    value: { anilistId: 194884, standing: 'canon', chapter: 267, volume: 27, chaptersAdapted: "a SELECTION, not a continuation — 163, 170, 191, 218-221, 266-267 (vols 17-27; each chapter page carries Anime Episode = Otona e no Kaidan and no TV episode; MU's 'adapts Chap 163, 170, 191, 218-221, 266-268' — 268 refuted, in no account); ch 162 「生徒会のNEW GAME」 is a ~1.5-min flashback sliver inside the first segment, never coverage; the adult-Kaguya album frame (~2 + 2 min) is the anime's own", position: 41.5, note: "CANON — the two-part TV special (2025-12-31, TOKYO MX / BS11 / とちぎテレビ as one hour; Prime Video 第1話 / 第2話 from 2026-01-01; AniList 2 × 26 min = one row, I46) animates chapters the 41-row run never reached, cherry-picked across vols 17-27 — the sole adaptation of each. The seam: ep 41 (First Kiss part 4) ends on ch 160 (vol 16; MU 'Vol 16, Chap 160 (Movie) Skips 152-158'); this work opens on 163; 161 and 152-158 stay unadapted. The undated finale film -Kanketsu-hen- (AniList 205081, Akasaka's 書き下ろし原案) follows when dated. Akasaka = a credit (T26)." },
    reason:
      "Wave 6 (the author died in a session-limit kill seconds after writing; verified R24 SOUND WITH NOTES): the ten-chapter set on the fandom's special page and all ten chapter pages, MU's sentence, en-WP's two episode summaries beat for beat; the START on the broadcast clock (the 163 title card at 22:04:33, the 162 gift beats after it); END 267 / vol 27 on the chapter and volume pages; 41.5 on the run's last END 160. The verifier: the generated string printed the sliver as coverage — hand-written as a SELECTION (Cursor); the 191 note's 'credited to no chapter' was wrong; ep 40 / 41's stored partial / rearranged is a by-catch (queued). Sean 2026-09-06: canon, 267 / vol 27, 41.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/kaguya-sama-love-is-war__194884.json', 'scripts/ingest/research/discovery/verify/kaguya-sama-love-is-war__194884.md'],
  },
  {
    seriesId: 'fruits-basket-2019',
    ruleId: 'I45',
    value: { anilistId: 136192, standing: 'canon', chapter: 93, volume: 16, chaptersAdapted: "90-93 (vol 16 — the Kyoko and Katsuya story that opens vol 16; producer Ito: 「原作第90話〜第93話」): the film's last hour, in order and in full — the one block the TV run never adapted (ep 48 = 88-89, ep 49 = 94-95; only ch 93's present-day frame sits in ep 57); the first ~30 min is a clip show of the 63-row run through Kyoko's grave (weightless — T28's recap clause, the Gintama-prologue shape) and a 3-min Takaya epilogue closes it", position: 63.5, note: "CANON — the new footage is the film's job and it is the manga's own chapters (three independent bylines size the clip show at ~30-33 min against ~52 min of adaptation). Position 63.5: the chapter slot would be 48.5, but the film opens on a recap through the finale's own grave scene and its epilogue is post-series — after the run's last row, the chapter fact carried here. Takaya's opening-day booklet manga and the BD 8-pager are tie-ins downstream of the film (T26 — the comicalization trap); a 'prelude - Special Comics' node is unverified, minted nothing. 88 min, 2022-02-18." },
    reason:
      "Wave 6 (verified SOUND WITH NOTES): 90-93 on Ito's Febri line verbatim, en-WP's vol 16 = 90-95 and Hakusensha's own copy; the never-adapted block reproduced on all 63 fandom episode pages; canon under T28's recap clause (the ledger's precedents: gintama's prologue, FotNS 130, bleach 190). The verifier: `recap: true` beside canon is the wave's only such pair — ruled in the gintama shape, the clip show in the string, no 'recap;' note prefix (Cursor: recap false on the row); the category API's 50-revision cap silently truncated the author's coverage dump (a trap, queued). Sean 2026-09-06: canon, 90-93 / vol 16, 63.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/fruits-basket-2019__136192.json', 'scripts/ingest/research/discovery/verify/fruits-basket-2019__136192.md'],
  },
  {
    seriesId: 'blue-exorcist',
    ruleId: 'I45',
    value: { anilistId: 11737, standing: 'filler', position: 25.5, note: "FILLER — a film-original story (ja-WP, citing Monthly Newtype 2013/01: 「テレビシリーズ第1期の後日談に当たり、映画オリジナルのストーリーとなる」; Comic Natalie: Usamaro and Liu 「劇場版オリジナルキャラクター」). The vol-6 unnumbered 番外編 「幽霊列車」 (Shueisha: 「番外編2本も同時収録!!」 — a fact, never a number, N35) is RESTAGED as the opening exorcism — a sliver (T28): the train's return, the shrine and Usamaro are original. Position 25.5 PINNED: the release slot (2012-12-28, between ep 25 and ep 26) and the stated setting (S1's 後日談) agree; the 2011 OVA beside it (25.51) is mis-dated — its true slot is ~11.5, its own ruling later. Kato's designs, the BD jacket, the 年賀カード and the novella's cover + 巻末マンガ are drawn pages OFF the source line — T26's non-adoption (Liu's later manga cameo carries no film event); the same-day novelisation is downstream. 88 min." },
    reason:
      "Wave 6 (verified SOUND WITH NOTES): the original-story claim on ja-WP (Newtype) and Comic Natalie independently, the fandom, J-Books and ANN; the bonus chapter's two wiki readings reconciled on the chapter's own content (restaged beats, an original payload); MU's coverage string has no movie segment; the date 2012-12-28 on every source (no repair). The verifier: the adoption clause must name the BD jacket, the 年賀カード and the novella's art and dismiss them on T26's source-line test (done above); the 25.5x cluster stays listed until pinned — pinned here (Cursor: the 2011 OVA is a mis-dated ~11.5, not a 25.x peer). Sean 2026-09-06: filler, 25.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/blue-exorcist__11737.json', 'scripts/ingest/research/discovery/verify/blue-exorcist__11737.md'],
  },
  {
    seriesId: 'one-punch-man',
    ruleId: 'I45',
    value: { anilistId: 108945, standing: 'filler', position: 24.5, note: "FILLER — six anime-original shorts on the six S2 discs (2019-10-25 → 2020-03-27, 約10分 each): 「アニメ完全オリジナルストーリー」 once per page, six for six, on the licensor's site and v-storage (one publisher's copy on two outlets; the independent legs are the credits — 脚本 稲本達郎 ×4 / 鈴木智尋 ×2 — and the content: no bonus chapter matches, zero Chapter / Volume backlinks, ten OVA-only characters). Position 24.5 — the derived S2 seam stands because every member's floor is cleared and nothing pins later: #02 12.5 (「ボロスの地球襲撃から1週間」), #03 14.5+, #04 17.5-19.5 (Suiryu introduced ep 17, broken inside ep 20), #05 9.5+, #06 unpinned; disc order is not story order. ONE 原案 = a credit (T26); the discs' audio dramas carry 「プロット原案：ONE」, the OVAs do not. air_date = disc 1 (the bundle convention)." },
    reason:
      "Wave 6 (the S1 bundle's method reused; verified SOUND WITH NOTES): the licensor's line six for six on two outlets, the writers on ja-WP's OVA table and en-WP, ANN's 'new story'; the negatives reproduced (the bonus-chapter sweep, the backlinks query, the character fields). The verifier: the sensitivity-control flag overstated 'positive silence' (the OVA infobox has no chapter field at all — the standing rests on the licensor's copy + the content); two member windows corrected by an episode (#04 17.5-19.5, #05 9.5+); the position's basis written as the protocol's form, never a new convention (P9). Sean 2026-09-06: filler, 24.5.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/one-punch-man__108945.json', 'scripts/ingest/research/discovery/verify/one-punch-man__108945.md'],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 20778, standing: 'filler', position: 288.52, note: "FILLER — an original (原作・脚本 鳥山明 = a credit, T26; no page of the manga is in it): set in Age 779, after Battle of Gods (Age 778), both inside the ten-year gap between ch 517 and 518 (Toei; ja-WP 神と神; the fandom's Age pages) — after ep 288, before ep 289 (rows joined by title + date, R20). Third seat of the 288.5x cluster in story AND release order: Yo! Son Goku (Age 776, 2008) → Battle of Gods (778, 2013) → Resurrection 'F' (779, 2015) — ruled as ONE package (the writer refuses a half-applied cluster). The DBS manga skipped this arc — nothing was ever incorporated (this manga closed in 1995)." },
    reason:
      "Wave 6 (the narrow slot ask, verified SOUND WITH NOTES): the ch 517 / 518 gap on Toei's 2012 release, ja-WP 神と神 and the wiki; the Ages on three lineages; rows 288 / 289 by title + date. The verifier: the seat 288.52 is conditional on the cluster (BoG → 288.51) — ruled together (Cursor: 'do not leave BoG at 288.5'); the 291.5x release-order alternative is closed by the ruled BoG entry. Sean 2026-09-06: filler, 288.52.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/dragon-ball-z__20778.json', 'scripts/ingest/research/discovery/verify/dragon-ball__20778.md'],
  },
  {
    seriesId: 'dragon-ball-z',
    ruleId: 'I45',
    value: { anilistId: 5152, standing: 'filler', position: 288.5, note: "FILLER — the 2008-09-21 Jump Super Anime Tour special (Age 776; 脚本 小山高生, 原案 鳥山明 = a credit, T26); no page of the manga is in it. The 2009 manga chapter 「オッス！帰ってきた孫悟空と仲間たち!!」 (AniList 46110) is a COMICALIZATION of the special — never an instrument, never a mint (disposed, wave 6; ja-WP 「単行本化はされていない」). First seat of the DBZ 288.5x cluster in story and release order (776 / 2008 → BoG 778 / 2013 → RoF 779 / 2015): after ep 288, before ep 289 (the ch 517 / 518 gap). No Kai row: the halo cannot derive one (5152's only edges are PARENT → 813 and the comicalization) and none is minted." },
    reason:
      "Wave 6 (the narrow slot ask, verified SOUND WITH NOTES): Age 776 on three lineages; the credits on ja-WP and Kanzenshuu; no chapter cited (the comicalization trap held). The verifier: the cluster and its options stated; a Kai row is a ruling-only staging question — none (Cursor: 'do not mint a Kai row the halo cannot keep'); the wiki's 'collected 2010-09-10' conflicts with ja-WP (the 2010 anime comics is a different product). Sean 2026-09-06: filler, 288.5, the first seat.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/dragon-ball-z__5152.json', 'scripts/ingest/research/discovery/verify/dragon-ball__20778.md'],
  },
  {
    seriesId: 'dragon-ball-z-kai',
    ruleId: 'I45',
    value: { anilistId: 20778, standing: 'filler', position: 165.51, note: "FILLER — the same story point as DBZ 288.52 (Age 779, the ch 517 / 518 gap): ja-WP's 改 slot converted by TITLE, never by number (R20 — JP 157 / 158 = our rows 164 / 166; row 165 is international-only) → behind Battle of Gods' ruled 165.5, the 165.5x cluster in date order. No Yo! Son Goku row on Kai (the halo cannot derive one; none minted). 脚本 鳥山明 = a credit (T26)." },
    reason:
      "Wave 6 (the narrow slot ask, verified SOUND): the wave-5 conversion repeated correctly (exactly eight international-only rows on en-WP; row 165 NULL-dated filler); 165.51 free; nothing to re-rule. Sean 2026-09-06: filler, 165.51.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/dragon-ball-z-kai__20778.json', 'scripts/ingest/research/discovery/verify/dragon-ball__20778.md'],
  },
  {
    seriesId: 'dragon-ball-super',
    ruleId: 'I45',
    value: { anilistId: 20778, standing: 'canon', chapter: null, volume: null, chaptersAdapted: "none — CORRESPONDENCE: the DBS manga SKIPPED the Resurrection 'F' arc (ja-WP 「漫画：未登場…省略されている」; Kanzenshuu: omitted from the manga, which charged ahead to the Champa arc; the wiki's manga field empty) — the run's rows 15-27 are the story's telling; nothing to read for it", position: 14.5, note: "CANON on the parallel owner (I40 / T30: from the outline or not — Toriyama's own story outline, listed by ja-WP under 「鳥山が自らストーリー原案を手がけた内容」; the run's rows 18-21 / 23-27 are canon on adopted{author} for THIS film). Position 14.5 — the film precedes its own retelling (rows 15-27), the Battle of Gods parity (0.5); a viewer who takes the film KEEPS 16-17 (the bridges ruled mixed); 17.5 (after the bridges) was the alternative seam. No adopted record on the film — that act is already on rows 18-27. Chapter null = the honest dash: no correspondence exists. 脚本 鳥山明 = a credit (T26)." },
    reason:
      "Wave 6 (the narrow slot ask; the standing REFUTED as filler by the verifier — the ruled parallel model gives canon: T30's proxy, the T26 sitting's adopted{author} rows, ja-WP's outline list): the skip statements verified verbatim on three lineages; 14.5 on the ruled arc's seat and BoG parity, 17.5 the truer story seam. The validator's 'canon with no chapters' rule is an adaptation-owner rule — a parallel-owner clause is queued (P29). Sean 2026-09-06 (Cursor: 'Fork 1 is T30, not a stretch'): canon, chapter null, 14.5, keep 16-17.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/dragon-ball-super__20778.json', 'scripts/ingest/research/discovery/verify/dragon-ball__20778.md'],
  },
];

/** series id → anilist id → the ruling */
export const RELATED_WORK_RULINGS: Record<string, Record<number, RelatedWorkRuling>> = {};
for (const e of ENTRIES) {
  const m = (RELATED_WORK_RULINGS[e.seriesId] ??= {});
  if (m[e.value.anilistId]) throw new Error(`related-works rulings: duplicate entry for ${e.seriesId} × anilist ${e.value.anilistId} — the lookup is ONE ruling per work: merge the fields into the existing entry (a second entry would silently override the first)`);
  m[e.value.anilistId] = e.value;
}

export const relatedWorkRuling = (seriesId: string, anilistId: number): RelatedWorkRuling | null => RELATED_WORK_RULINGS[seriesId]?.[anilistId] ?? null;
