// G59 — THE MINT RULE, path C (Sean ruled 2026-09-04): when AFL has nothing
// usable and no wiki episode list exists, the grid is a RULED GRID minted by
// the MANUAL writer (scripts/ingest/mint-grids.ts, minted_by 'manual'): rows
// with number / title / air date / type and the source cited. Never a
// research apply script. G57 governs deletion (only the manual writer may
// delete a manual row); filterEpisodeRows gates the rows like every writer.
import type { RulingEntry } from './types';
import { toRecord } from './types';

export type GridRow = { number: number; title: string; air_date: string | null; type: 'canon' | 'mixed' | 'filler' };
export type MintedGrid = { rows: GridRow[]; source: string; /** P39 (amended 2026-09-06): the grid's TYPES are researched / ruled, not the canon-tier default — only then does the grid publish the series */ typesRuled?: true };

export const ENTRIES: RulingEntry<MintedGrid>[] = [
  {
    seriesId: 'shounan-junai-gumi',
    ruleId: 'G59',
    value: {
      typesRuled: true, // the five types are researched (batch 17, mixed) — the grid publishes (P39)
      source: 'AFL page sh%C5%8Dnan-pure-love-gang (5 rows, titles + dates + types, staged 2026-08-22; held sparse for the resolver by the source_map note) + the batch-17 research anchors (Sean sign-off 2026-08-23: OVA endpoints spot-checked)',
      rows: [
        { number: 1, title: 'Shonan Junai Gumi! Down the Delinquent Highway!', air_date: '1994-01-21', type: 'mixed' },
        { number: 2, title: 'Shonan Junai Gumi! 2', air_date: '1994-09-23', type: 'mixed' },
        { number: 3, title: 'Shonan Junai Gumi! 3 Runaway Angel of Hell', air_date: '1995-06-23', type: 'mixed' },
        { number: 4, title: 'Shonan Junai Gumi! 4 Hunting Death', air_date: '1996-05-24', type: 'mixed' },
        { number: 5, title: 'Shonan Junai Gumi! 5 Forever Onibaku', air_date: '1997-01-24', type: 'mixed' },
      ],
    },
    reason:
      "A five-episode OVA (1994-97) with no wiki episode list; the AFL page carries the five rows but the source_map holds it sparse (anilist_id null, 'AFL page stays sparse-held for validation', 2026-08-23), so the resolver refuses by design and the entry sat with five manual anchors and ZERO rows. Sean ruled 2026-09-04 (G59 path C): the grid is ruled here from AFL's own rows (types mixed per AFL's quick list — each OVA condenses a manga arc with original framing) and minted at the manual tier.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch17/out/shounan-junai-gumi.json'],
  },
  // ---- THE STEP-2 ROWS PASS (2026-09-06): eight ruled grids for the seeded OVA runs — research/discovery/out/grid__*.json (PROTOCOL-grids.md; two source tiers each)
  {
    seriesId: 'attack-on-titan-lost-girls',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__attack-on-titan-lost-girls.json): licensor: https://www.kodansha.co.jp/comic/products/0000048308 · licensor: https://www.kodansha.co.jp/comic/products/0000048309 · licensor: https://www.kodansha.co.jp/comic/products/0000048310 · licensor: https://shingeki.tv/final/product/oad/",
      rows: [
        { number: 1, title: "Wall Sina, Goodbye: Part 1", air_date: "2017-12-08", type: 'canon' },
        { number: 2, title: "Wall Sina, Goodbye: Part 2", air_date: "2018-04-09", type: 'canon' },
        { number: 3, title: "Lost in the Cruel World", air_date: "2018-08-09", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (Release order of THIS entry's three OADs, 1-3 (2017-12-08 → 2018-04-09 → 2018-08-09). No Japanese source numbers the run itself: the licensor's own OAD Archive listing (shingeki.tv 商品情報 and the official portal aot-portal.com) and dアニメストア label them with the FRANCHISE OVA ordinal #16.5A / #16.5B / #??? — the third has no number, its title card reads '???'. The Attack on Titan Wiki calls them OVA 6 / 7 / 8 and Crunchyroll's 'Attack on Titan OADs' collection numbers them Episodes 6 / 7 / 8. en-WP's 'Attack on Titan: Lost Girls' episode table prints 16.5A / 16.5B / ??? in its EpisodeNumber column but carries 1 / 2 / 3 in EpisodeNumber2 — that release-order column is the one that matches our numbering. Dates are the first Japanese release of each row = the manga limited edition's ship date (the disc bundle), per the protocol.); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__attack-on-titan-lost-girls.json'],
  },
  {
    seriesId: 'attack-on-titan-no-regrets',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__attack-on-titan-no-regrets.json): licensor: https://www.kodansha.co.jp/comic/products/0000039927 · licensor: https://www.kodansha.co.jp/comic/products/0000039928 · licensor: https://shingeki.tv/final/product/oad/ · licensor: https://shingeki.tv/news/archives/2605",
      rows: [
        { number: 1, title: "No Regrets: Part 1", air_date: "2014-12-09", type: 'canon' },
        { number: 2, title: "No Regrets: Part 2", air_date: "2015-04-09", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (Release order of THIS entry's own two OADs — rows 1 and 2 (2014-12-09, then 2015-04-09). The licensor does NOT number the run 第1話/第2話: Kodansha's limited-edition copy labels the discs 前編 / 後編, and the anime's official site labels them with the FRANCHISE OAD ordinal #0.5A / #0.5B (shingeki.tv 進撃の巨人 OAD Archive Blu-ray 収録話, alongside #3.25 / #3.5 / #3.75 / #16.5A / #16.5B / #???). Every third-party numbering seen is a franchise ordinal too — en-WP's episode table prints 0.5A / 0.5B in its EpisodeNumber column (it does carry 1 / 2 as EpisodeNumber2), the AoT Wiki's infoboxes print `Number (OVA) = 4` and `= 5`, and Crunchyroll's combined 'Attack on Titan OADs' collection numbers them E4 / E5. None of those is our space; ours is 1-2 in release order, which matches en-WP's secondary column and livechart's episode list.); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__attack-on-titan-no-regrets.json'],
  },
  {
    seriesId: 'blue-exorcist-weekend-hero',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__blue-exorcist-weekend-hero.json): licensor: https://ao-ex.com/news/?id=66728 · ja-WP: https://ja.wikipedia.org/wiki/%E9%9D%92%E3%81%AE%E7%A5%93%E9%AD%94%E5%B8%AB_(%E3%82%A2%E3%83%8B%E3%83%A1) · ja-WP: https://ja.wikipedia.org/wiki/%E9%9D%92%E3%81%AE%E7%A5%93%E9%AD%94%E5%B8%AB · en-WP: https://en.wikipedia.org/wiki/List_of_Blue_Exorcist_episodes",
      rows: [
        { number: 1, title: "Hebi to Doku", air_date: "2017-04-04", type: 'canon' },
        { number: 2, title: "Supai Gēmu", air_date: "2017-10-04", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (release order 1-2 of THIS run's own entries (AniList 97891 = 2 episodes; the licensor says 「青の祓魔師 京都不浄王篇OAD」（全2話）). The licensor and the JP streaming platforms do NOT number the run itself — they carry 第13話 / 第14話, continuing the Kyoto Saga TV season's 12 episodes (a number space that would collide with the TV rows); en-WP's OVA table is franchise-numbered 1-3, where 1 is the 2011 series' OVA クロの家出 (2012-12-27) and 2-3 are ours. Neither foreign numbering is used.); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__blue-exorcist-weekend-hero.json'],
  },
  {
    seriesId: 'houkago-no-ouji-sama',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__houkago-no-ouji-sama.json): licensor: http://tenipuri.jp/dvd_bd/09/01.html · licensor: http://tenipuri.jp/dvd_bd/09/02.html · licensor: https://web.archive.org/web/20141230014904/http://tenipuri.jp/dvd_bd/09/02.html · licensor: http://tenipuri.jp/dvd_bd/09/03.html",
      rows: [
        { number: 1, title: "Houkago no Ouji-sama - vs Genius10 Vol.1 bonus", air_date: "2014-10-29", type: 'canon' },
        { number: 2, title: "Houkago no Ouji-sama - vs Genius10 Vol.2 bonus", air_date: "2014-12-25", type: 'canon' },
        { number: 3, title: "Houkago no Ouji-sama - vs Genius10 Vol.3 bonus", air_date: "2015-02-20", type: 'canon' },
        { number: 4, title: "Houkago no Ouji-sama - vs Genius10 Vol.4 bonus", air_date: "2015-04-24", type: 'canon' },
        { number: 5, title: "Houkago no Ouji-sama - vs Genius10 Vol.5 bonus", air_date: "2015-06-26", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (Release order of the five 「新テニスの王子様 OVA vs Genius10」 discs (Vol.1-Vol.5, 2014-10-29 -> 2015-06-26), one 4-koma anime 『放課後の王子様』 block per disc as a 映像特典. The licensor numbers the HOST OVA's own episodes 第1話-第10話 but prints NO number for the 4-koma blocks, so this run's numbering is ours: 1..5 in disc order. Dates are the discs' Japanese on-sale dates, identical on the licensor's product pages, the licensor's news posts and ja-WP's per-volume table (day-of-week checked: Wed / Thu / Fri / Fri / Fri, exactly as the licensor prints them).); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__houkago-no-ouji-sama.json'],
  },
  {
    seriesId: 'mobile-suit-gundam-thunderbolt',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__mobile-suit-gundam-thunderbolt.json): licensor: https://gundam-official.com/series/thunderbolt/story · licensor: https://en.gundam-official.com/series/thunderbolt/story · licensor: https://web.archive.org/web/20151215034513/http://gundam-tb.net/top_news.php · licensor: https://web.archive.org/web/20160512050253/http://gundam-tb.net/news/index.php",
      rows: [
        { number: 1, title: "Episode 1", air_date: "2015-12-25", type: 'canon' },
        { number: 2, title: "Episode 2", air_date: "2016-02-12", type: 'canon' },
        { number: 3, title: "Episode 3", air_date: "2016-03-18", type: 'canon' },
        { number: 4, title: "Episode 4", air_date: "2016-04-22", type: 'canon' },
        { number: 5, title: "Episode 5", air_date: "2017-03-24", type: 'canon' },
        { number: 6, title: "Episode 6", air_date: "2017-04-28", type: 'canon' },
        { number: 7, title: "Episode 7", air_date: "2017-05-31", type: 'canon' },
        { number: 8, title: "Episode 8", air_date: "2017-07-14", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (The licensor's own continuous 第1話-第8話 / Episode 1-Episode 8 across both ONA seasons. gundam-official.com's STORY index (Bandai Namco Filmworks' live CMS) emits episodeNumber 1..8 with subtile 第1話..第8話 on the JA locale and Episode 1..Episode 8 on the EN locale, in one list; Gundam.info's season-2 announcement writes 「アニメ第2シーズンとなる第5話から第8話」; the legacy official site's STORY artwork is act01..act08. Only the production ASSET filenames keep a per-season index (TB_1st_sc_ep01-04, TB_2nd_sc_ep01-04). So our run numbering 1-4 (AniList 21458) then 5-8 (AniList 97853) IS the licensor's published numbering — no re-basing, and the task's premise that season 2 is re-numbered 第1話-第4話 does not hold (flag 2). air_date is the GENERAL Japanese paid-streaming premiere (通常配信, 12:00 JST); the season-1 fan-club advance dates are per-row notes (flag 3). The compilation films and the 2023 TV Edition are not rows (flags 6, 7).); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__mobile-suit-gundam-thunderbolt.json'],
  },
  {
    seriesId: 'mobile-suit-gundam-unicorn',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__mobile-suit-gundam-unicorn.json): licensor: https://web.archive.org/web/20140324050036/http://www.gundam-unicorn.net/en/world/ · licensor: https://web.archive.org/web/20140324/http://www.gundam-unicorn.net/en/world/episode1.html · licensor: https://web.archive.org/web/20121214092434/http://www.gundam-unicorn.net/en/world/episode5.html · licensor: https://web.archive.org/web/20100301/http://www.gundam-unicorn.net/",
      rows: [
        { number: 1, title: "Day of the Unicorn", air_date: "2010-02-20", type: 'canon' },
        { number: 2, title: "The Second Coming of Char", air_date: "2010-10-30", type: 'canon' },
        { number: 3, title: "The Ghost of Laplace", air_date: "2011-03-05", type: 'canon' },
        { number: 4, title: "At the Bottom of the Gravity Well", air_date: "2011-11-12", type: 'canon' },
        { number: 5, title: "The Black Unicorn", air_date: "2012-05-19", type: 'canon' },
        { number: 6, title: "Two Worlds, Two Tomorrows", air_date: "2013-03-02", type: 'canon' },
        { number: 7, title: "Over the Rainbow", air_date: "2014-05-17", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (The licensor's own labelling of the OVA run: its seven volumes are 'episode 1' … 'episode 7' (gundam-unicorn.net STORY pages; the current gundam-official.com portal serves episodeNumber 1-7 for this series and states 話数：全7話; ja-WP's 各章リスト 巻数 column reads episode 1-7). Rows are in release order, one per volume, dated by the FIRST Japanese release of that volume — the nationwide event screening (a commercial theatrical release for episode 7), which for episodes 1-5 was also the day paid streaming opened. NOT en-WP's page numbering: 'List of Mobile Suit Gundam Unicorn episodes' holds two runs on one page and its OVA table also carries a non-episode 'SP' row; the 22-episode TV re-cut RE:0096 (AniList 21658) is a different series and is excluded entirely. No franchise OVA ordinal is used.); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__mobile-suit-gundam-unicorn.json'],
  },
  {
    seriesId: 'thus-spoke-rohan-kishibe',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__thus-spoke-rohan-kishibe.json): licensor: http://jojo-animation.com/ova/rohan/ · licensor: http://jojo-animation.com/ova/rohan/story/episode05.php · licensor: http://jojo-animation.com/ova/rohan/kitankenbunroku.html · licensor: https://jojo-animation.com/du/bddvd/13.html",
      rows: [
        { number: 1, title: "Episode 5: Millionaire Village", air_date: null, type: 'canon' },
        { number: 2, title: "Episode 2: Mutsu-kabe Hill", air_date: "2018-07-19", type: 'canon' },
        { number: 3, title: "Episode 16: At a Confessional", air_date: "2019-12-08", type: 'canon' },
        { number: 4, title: "Episode 9: The Run", air_date: "2019-12-08", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (Release order of THIS run's own four entries, 1-4, by first Japanese release (row 1 = 2017 mail-in bonus disc, row 2 = 2018-07-19 bundled disc, rows 3-4 = 2019-12-08 event premiere). The licensor does NOT number the run: every OVA is titled by the MANGA one-shot's own episode number (#05 富豪村, #02 六壁坂, #16 懺悔室, #09 ザ・ラン), which is a source-chapter label, never a run ordinal — kept in title / title_native so the label is not lost. Rows 3 and 4 share a date; tie broken by the premiere programme 『懺悔室／ザ・ラン』 (the production committee's own event report) plus ja-WP's 各話リスト order and en-WP's OVA 3 / OVA 4.); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__thus-spoke-rohan-kishibe.json'],
  },
  {
    seriesId: 'tokyo-babylon',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__tokyo-babylon.json): licensor: https://db.animedb.jp/index.php/searchdata/?mode=view&id=02433 · licensor: https://db.animedb.jp/index.php/searchdata/?mode=view&id=02817 · licensor: https://www.sonymusicshop.jp/m/item/itemShw.php?site=S&ima=0148&cd=SVWB000007015 · ja-WP: https://ja.wikipedia.org/wiki/%E6%9D%B1%E4%BA%ACBABYLON#OVA",
      rows: [
        { number: 1, title: "Tokyo Babylon", air_date: "1992-10-21", type: 'canon' },
        { number: 2, title: "Tokyo Babylon 2", air_date: "1994-03-21", type: 'canon' },
      ],
    },
    reason:
      "The step-2 rows pass (Sean signed 2026-09-06): a series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (Release order of this run's own two OVA volumes (1 = the 1992 tape, 2 = the 1994 tape). The licensor numbers the run itself only on the second unit — the product title is 東京BABYLON2 (Sony Music Shop / Aniplex SVWB-7016; アニメ大全 id 02817) against a plain 東京BABYLON for the first (SVWB-7015; アニメ大全 id 02433). allcinema's single work record calls the run 「OVAシリーズ全2巻」. No franchise ordinal and no TV numbering is involved.); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__tokyo-babylon.json'],
  },
  // ---- the Prince of Tennis National Tournament chain as its OWN series (2026-09-06): 26 rows, the platforms' continuous numbering; types canon-tier default (typesRuled absent → the series stays STAGED until the standing programme types it, P39)
  {
    seriesId: 'the-prince-of-tennis-national-tournament',
    ruleId: 'G59',
    value: {
      source: "the step-2 rows pass (2026-09-06; research/discovery/out/grid__the-prince-of-tennis-national-tournament.json): licensor: http://tenipuri.jp/dvd_bd/01/ · licensor: http://tenipuri.jp/dvd_bd/01/01.html · licensor: http://tenipuri.jp/dvd_bd/tenipuri/02/vol-1-%e3%80%8c%e5%9b%9b%e5%a4%a9%e5%ae%9d%e5%af%bavs%e4%b8%8d%e5%8b%95%e5%b3%b0%e3%80%8d-%e3%80%8c%e5%92%86%e5%93%ae%e3%80%8d.html · licensor: http://tenipuri.jp/dvd_bd/02/02.html",
      rows: [
        { number: 1, title: "Kaettekita Ouji-sama", air_date: "2006-03-24", type: 'canon' },
        { number: 2, title: "Hot & Cool", air_date: "2006-05-26", type: 'canon' },
        { number: 3, title: "The fourth counter", air_date: "2006-05-26", type: 'canon' },
        { number: 4, title: "Kikumaru Hitoribocchi", air_date: "2006-07-28", type: 'canon' },
        { number: 5, title: "Ichiban Nagai Natsu", air_date: "2006-07-28", type: 'canon' },
        { number: 6, title: "Koroshiya to Yobareru Otoko", air_date: "2006-09-22", type: 'canon' },
        { number: 7, title: "Beach Volley no Ouji-sama!?", air_date: "2006-09-22", type: 'canon' },
        { number: 8, title: "Arashi no Yokan", air_date: "2006-11-24", type: 'canon' },
        { number: 9, title: "Orenai Kokoro", air_date: "2006-11-24", type: 'canon' },
        { number: 10, title: "Tanki Kessen", air_date: "2007-01-26", type: 'canon' },
        { number: 11, title: "Tezuka Kunimitsu", air_date: "2007-01-26", type: 'canon' },
        { number: 12, title: "Futari", air_date: "2007-03-23", type: 'canon' },
        { number: 13, title: "Shitou - Teiou VS Ouji-sama", air_date: "2007-03-23", type: 'canon' },
        { number: 14, title: "Shitenhouji VS Fudoumine", air_date: "2007-06-22", type: 'canon' },
        { number: 15, title: "Houkou", air_date: "2007-06-22", type: 'canon' },
        { number: 16, title: "Owarai Tennis no Kyoufu", air_date: "2007-09-25", type: 'canon' },
        { number: 17, title: "Seigaku no Onimotsu", air_date: "2007-09-25", type: 'canon' },
        { number: 18, title: "Futatsu no Tobira", air_date: "2008-01-25", type: 'canon' },
        { number: 19, title: "Ikkyuu Shoubu!", air_date: "2008-01-25", type: 'canon' },
        { number: 20, title: "Yakiniku no Ouji-sama", air_date: "2008-04-25", type: 'canon' },
        { number: 21, title: "Choujou Taiketsu!", air_date: "2008-07-25", type: 'canon' },
        { number: 22, title: "Ore-tachi no Yarikata", air_date: "2008-07-25", type: 'canon' },
        { number: 23, title: "Mahiru ni Hoshi wa Mieru ka!?", air_date: "2008-10-24", type: 'canon' },
        { number: 24, title: "Kokoro wo Hitotsu ni", air_date: "2008-10-24", type: 'canon' },
        { number: 25, title: "Saishuu Kessen! Ouji-sama VS Kami no Ko", air_date: "2009-01-23", type: 'canon' },
        { number: 26, title: "Dear Prince ~Tennis no Ouji-sama-tachi e~", air_date: "2009-01-23", type: 'canon' },
      ],
    },
    reason:
      "The Tennis own-series sitting (Sean 2026-09-06, with Cursor: the key is what the sources print — 1-26, the Lost Canvas shape; I42 ii): a series minted from a declaration with no rows AFL or the wiki finder can serve (the OVA lists sit inside the parent's episode page) (The run's OWN continuous 1-26 across the three entries in release order (995 全国大会篇 = rows 1-13, 2752 Semifinal = rows 14-19, 4053 Final = rows 20-26) — Sean's ruling of 2026-09-06, and the scheme the platforms print: dアニメストア numbers the chain Episode 1-13 / 14-19 / 20-26 across its three work pages and en-WP heads its three OVA tables 'Episodes 1–13' / 'Episodes 14–19' / 'Episode 20–26'. The LICENSOR numbers each set from its own beginning instead — tenipuri.jp's DVD pages print 'Episode 1' again at the head of Semifinal and again after the Final's opener, and its Blu-ray BOX pages print 第1話…第13話, 第1話…第6話 and, for the Final, 第0話…第6話 — so the Final's opener 「焼肉の王子様」 is the licensor's 第0話 and this grid's row 20. Never the parent TV series' 178-episode count. Dates are the first Japanese release of each episode = its DVD volume's on-sale date, so the twelve two-episode discs give twelve pairs of rows the same date.); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/grid__the-prince-of-tennis-national-tournament.json'],
  },
];

export const MINTED_GRIDS: Record<string, MintedGrid> = toRecord(ENTRIES);
