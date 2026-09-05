// Watch-order entry rulings — N31 (restructure T2.1, 2026-08-26; formerly the
// RULED_LABELS / RULED_RECORDS literals in scripts/ingest/sync-watch-order.ts).
// One entry per ruled watch-order POSITION of a series: `record` carries the
// structured adaptation fields the ruling knows (chapter / volume /
// chapters_adapted / kind); `label` is the per-series SURFACE ruling — an
// entry with a label renders in the episode table in the +N format, an entry
// without one stays data-ready with display_label null.
//
// SURFACING IS PARKED (Sean 2026-08-24): MHA's labels ('170+1', '170+1.5')
// were briefly live, then pulled — surfacing waits for the
// specials/OVAs/movies STATUS design pass (the v2 reference point is N32).
// Re-activate by setting label: '170+1' / '170+1.5' on the two MHA entries.
// RULED_LABELS is therefore derived EMPTY today — authoritative both ways.

import type { RulingEntry } from './types';

// A record may be KIND-ONLY (T29, batch 19 wave 2, 2026-08-27): the entry's
// format — ova | special | movie | recap — cited from AniList's `format` /
// en-WP, with the adaptation fields absent until an anchors lane rules them.
export type WatchOrderRecord = { chapter?: number | null; volume?: number | null; chapters_adapted?: string | null; kind: string; anilistId?: number };
export type WatchOrderRuling = { position: number; label?: string; record?: WatchOrderRecord };

export const ENTRIES: RulingEntry<WatchOrderRuling>[] = [
  {
    seriesId: 'my-hero-academia',
    ruleId: 'N31',
    value: { position: 171, record: { chapter: 431, volume: 42, chapters_adapted: '431', kind: 'special' } },
    reason:
      "'No. 170+1: More' (AniList 204356, 2026-05-02) adapts ch 431 (vol 42 bonus). Sean 2026-08-24: essential canon the community groups with the series, community-numbered 170+1 — order-only after the FINAL SEASON; counts stay 170. Label PARKED pending the specials/OVAs/movies STATUS design pass.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    retiresWhen: 'the STATUS design pass rules on surfacing — then the label is restored (N32)',
  },
  {
    seriesId: 'my-hero-academia',
    ruleId: 'N31',
    value: { position: 171.5, record: { chapter: 431.5, volume: 42, chapters_adapted: '431.5', kind: 'special' } },
    reason:
      "'I am a hero too' Eri special (AniList 211711, 2026-08-03) adapts ch 431.5 (vol 42). Sean's ruling: mangaMapper position 170+1.5, matching the manga's .5 bonus format — order-only after the FINAL SEASON; counts stay 170. Label PARKED pending the specials/OVAs/movies STATUS design pass.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    retiresWhen: 'the STATUS design pass rules on surfacing — then the label is restored (N32)',
  },
  // ---- batch 19 wave 2, lane B4 watch-order kinds (2026-08-27; Sean ruled B4-6):
  // 34 of the 37 order-only entries, each from a live AniList `format` query
  // and/or en-WP. NOT ruled (uncitable as a T29 kind, listed for Sean):
  // cells-at-work @11.5 (ONA on both sources), high-school-dxd @36.5 (counted
  // inside HERO's 13 by AniList), the-heroic-legend-of-arslan @25.2 (a TV
  // season — the missing S2 component, not order-only). Probable DUPLICATE
  // pairs, both typed, listed for Sean: to-love-ru-darkness @24.1/@24.5
  // (one work, AniList 21852); yu-yu-hakusho-ghostfiles @112.1/@112.5 (one
  // work, 6964). @112.7/@112.8 share id 102631 but are two shorts.
  // RULED 2026-08-27 (Sean): one entry per work — @24.1 and @112.1 (the
  // research-tier records) stay; the untitled @24.5 / @112.5 sign-off
  // entries were DROPPED (ingest_fractionals + watch_order_entries), their
  // community-count sentence carried into the surviving entry's note.
  {
    seriesId: 'black-butler',
    ruleId: 'T29',
    value: { position: 46.75, record: { kind: 'ova', anilistId: 20670 } },
    reason:
      "AniList 20670 format=OVA, 2 eps, 2014-10-25 to 2014-11-15 — the entry's stored date 2014-11-15 is exactly the OVA's endDate (Part 2). en-WP Black Butler infobox: type=ova, 'Black Butler: Book of Murder', released October 25, 2014.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/20670', 'https://en.wikipedia.org/wiki/Black_Butler'],
  },
  {
    seriesId: 'bungo-stray-dogs',
    ruleId: 'T29',
    value: { position: 24.5, record: { kind: 'ova', anilistId: 21791 } },
    reason:
      "AniList 21791 'Bungou Stray Dogs: Hitori Ayumu' format=OVA, 1 ep, startDate 2017-08-04 = the entry's stated air date.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/21791'],
  },
  {
    seriesId: 'cardcaptor-sakura',
    ruleId: 'T29',
    value: { position: 35.1, record: { kind: 'movie', anilistId: 371 } },
    reason:
      "AniList 371 format=MOVIE, 81 min, 1999-08-21. en-WP: 'Cardcaptor Sakura: The Movie ... is a 1999 Japanese animated fantasy film'.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/371', 'https://en.wikipedia.org/wiki/Cardcaptor_Sakura:_The_Movie'],
  },
  {
    seriesId: 'cardcaptor-sakura',
    ruleId: 'T29',
    value: { position: 70.1, record: { kind: 'movie', anilistId: 372 } },
    reason:
      "AniList 372 'Cardcaptor Sakura Movie: Fuinsareta Card' format=MOVIE, 79 min, 2000-07-15. (The en-WP title 'Cardcaptor Sakura: The Sealed Card' redirects to the franchise article, which describes it as the second film.)",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/372'],
  },
  {
    seriesId: 'fate-kaleid-liner-prisma-illya',
    ruleId: 'T29',
    value: { position: 10.5, record: { kind: 'ova', anilistId: 18851 } },
    reason:
      "AniList 18851 'Undoukai DE Dance!' format=OVA, 1 ep, 2014-03-07. No en-WP video infobox exists for it (the franchise article lists only the TV seasons, the two films and Prisma Phantasm).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/18851'],
  },
  {
    seriesId: 'ghost-in-the-shell-stand-alone-complex',
    ruleId: 'T29',
    value: { position: 52.5, record: { kind: 'special', anilistId: 1566 } },
    reason:
      "AniList 1566 format=SPECIAL, 108 min, 2006-09-01; our stored component kind for 1566 is also [special]. DISAGREEMENT: en-WP calls it 'a 2006 Japanese anime science fiction television film' and Sean's stored order-only ruling reasons from the movies rule ('is a FILM'). Kept as `special` so the AniList format and the stored component kind are not contradicted — see flags.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/1566', 'https://en.wikipedia.org/wiki/Ghost_in_the_Shell:_Stand_Alone_Complex_%E2%80%93_Solid_State_Society'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'T29',
    value: { position: 12.1, record: { kind: 'ova', anilistId: 101830 } },
    reason:
      "AniList 101830 'Golden Kamuy OVA' format=OVA, 1 ep, 2018-09-19 (bundled with manga vol 15, per the stored note).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/101830'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'T29',
    value: { position: 24.2, record: { kind: 'ova', anilistId: 124756 } },
    reason:
      "AniList 124756 'Golden Kamuy 2nd Season OVA' format=OVA, 3 eps, 2019-03-19 to 2020-09-18 — the three segments the entry bundles (OVA 2, 3, 4).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/124756'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'T29',
    value: { position: 49.3, record: { kind: 'ova', anilistId: 194872 } },
    reason:
      "AniList 194872 'Golden Kamuy: Inazuma Goutou to Mamushi no Ogin/Shimaenaga' format=OVA, 1 ep, 2025-10-17 = the entry's stated date.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/194872'],
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'T29',
    value: { position: 49.4, record: { kind: 'movie', anilistId: 196115 } },
    reason:
      "AniList 196115 'Golden Kamuy: Sapporo Beer Koujou-hen' format=MOVIE, 2 parts, 68 min, startDate 2025-10-10 = the entry's stated 前編 date (後編 2025-10-31).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/196115'],
  },
  {
    seriesId: 'hajime-no-ippo-the-fighting',
    ruleId: 'T29',
    value: { position: 76.3, record: { kind: 'ova', anilistId: 265 } },
    reason:
      "AniList 265 'Mashiba vs Kimura - Shikei Shikkou' format=OVA, 61 min, 2003-09-05. en-WP Hajime no Ippo infobox: type=ova, released September 5, 2003.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/265', 'https://en.wikipedia.org/wiki/Hajime_no_Ippo'],
  },
  {
    seriesId: 'hajime-no-ippo-the-fighting',
    ruleId: 'T29',
    value: { position: 76.6, record: { kind: 'special', anilistId: 264 } },
    reason:
      "AniList 264 'Champion Road' format=SPECIAL, 90 min, 2003-04-18; our stored component kind for 264 is also [special]. DISAGREEMENT: en-WP infobox says type=tv film (network Nippon TV, released April 18, 2003) — `movie` is defensible; kept `special` to match AniList + the stored component kind. See flags.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/264', 'https://en.wikipedia.org/wiki/Hajime_no_Ippo'],
  },
  {
    seriesId: 'miss-kobayashis-dragon-maid',
    ruleId: 'T29',
    value: { position: 13.5, record: { kind: 'ova', anilistId: 98580 } },
    reason:
      "AniList 98580 'Valentine, Soshite Onsen!' format=OVA, 1 ep, 2017-09-20. (en-WP's Dragon Maid article carries video infoboxes only for the TV seasons and the 2025 film.)",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/98580'],
  },
  {
    seriesId: 'my-hero-academia',
    ruleId: 'T29',
    value: { position: 113.1, record: { kind: 'movie', anilistId: 126659 } },
    reason:
      "AniList 126659 format=MOVIE, 104 min, 2021-08-06 = the entry's stated date. en-WP: 'is a 2021 Japanese animated superhero film'. (AniList 142411 'Tabidachi' is a separate 6-min short, not this entry.)",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/126659', 'https://en.wikipedia.org/wiki/My_Hero_Academia:_World_Heroes%27_Mission'],
  },
  {
    seriesId: 'prison-school',
    ruleId: 'T29',
    value: { position: 12.5, record: { kind: 'ova', anilistId: 21565 } },
    reason:
      "AniList 21565 'Prison School: Mad Wax' format=OVA, 1 ep, 2016-03-04. (en-WP's Prison School article has no video infobox for it.)",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/21565'],
  },
  {
    seriesId: 'reborn',
    ruleId: 'T29',
    value: { position: 203.1, record: { kind: 'ova', anilistId: 8532 } },
    reason:
      "en-WP Reborn!: 'An original video animation (OVA) was produced under the same staff and cast and was released in October 2009 during the annual Jump Super Anime Tour'; the franchise infobox reads '203 + 2 OVAs' and 'List of Reborn! episodes' carries an == OVAs == table whose first row is this work. DISAGREEMENT: AniList 8532 format=ONA (ja-WP files it under ジャンプアニメ, 上映 at Jump Super Anime Tour 2009, complete-edition DVD 2010-07-21). AniList id now verified (the stored note said unverified).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/8532', 'https://en.wikipedia.org/wiki/Reborn!', 'https://en.wikipedia.org/wiki/List_of_Reborn!_episodes'],
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T29',
    value: { position: 94.1, record: { kind: 'ova', anilistId: 44 } },
    reason:
      "AniList 44 format=OVA, 4 eps, 1999-02-20 to 1999-09-22. en-WP: 'is a Japanese original video animation (OVA) series'.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/44', 'https://en.wikipedia.org/wiki/Rurouni_Kenshin:_Trust_%26_Betrayal'],
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T29',
    value: { position: 94.2, record: { kind: 'ova', anilistId: 11441 } },
    reason:
      "AniList 11441 'Shin Kyoto-hen' format=OVA, 2 eps, from 2011-12-17. en-WP: 'is a two-part original video animation (OVA)'.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/11441', 'https://en.wikipedia.org/wiki/Rurouni_Kenshin:_New_Kyoto_Arc'],
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T29',
    value: { position: 94.3, record: { kind: 'movie', anilistId: 46 } },
    reason:
      "AniList 46 'Ishinshishi e no Requiem' format=MOVIE, 91 min, 1997-12-20. en-WP: 'is a Japanese animated martial arts film'.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/46', 'https://en.wikipedia.org/wiki/Rurouni_Kenshin:_The_Motion_Picture'],
  },
  {
    seriesId: 'rurouni-kenshin',
    ruleId: 'T29',
    value: { position: 94.4, record: { kind: 'ova', anilistId: 401 } },
    reason:
      "AniList 401 'Seisou-hen' format=OVA, 2 eps, 2001-12-03. en-WP: 'is a Japanese original video animation (OVA)'.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/401', 'https://en.wikipedia.org/wiki/Rurouni_Kenshin:_Reflection'],
  },
  {
    seriesId: 'seraph-of-the-end-vampire-reign',
    ruleId: 'T29',
    value: { position: 24.5, record: { kind: 'ova', anilistId: 21586 } },
    reason:
      "AniList 21586 'Owari no Seraph: Kyuuketsuki Shahal' format=OVA, 1 ep, 2016-05-02 = the entry's stated date. en-WP Seraph of the End infobox: type=ova, 'Seraph of the End: Vampire Shahal', released May 2, 2016.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/21586', 'https://en.wikipedia.org/wiki/Seraph_of_the_End'],
  },
  {
    seriesId: 'that-time-i-got-reincarnated-as-a-slime',
    ruleId: 'T29',
    value: { position: 24.1, record: { kind: 'ova', anilistId: 161802 } },
    reason:
      "AniList 161802 'Coleus no Yume' format=OVA, 3 eps, 2023-11-01. (The stored note calls it '3 ONA eps'; AniList's format field for the entry is OVA — flagged.)",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/161802'],
  },
  {
    seriesId: 'that-time-i-got-reincarnated-as-a-slime',
    ruleId: 'T29',
    value: { position: 48.2, record: { kind: 'movie', anilistId: 139498 } },
    reason:
      "AniList 139498 format=MOVIE, 108 min, 2022-11-25. en-WP: 'is a 2022 Japanese animated isekai fantasy film'.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/139498', 'https://en.wikipedia.org/wiki/That_Time_I_Got_Reincarnated_as_a_Slime_the_Movie:_Scarlet_Bond'],
  },
  {
    seriesId: 'that-time-i-got-reincarnated-as-a-slime',
    ruleId: 'T29',
    value: { position: 72.3, record: { kind: 'movie', anilistId: 182206 } },
    reason:
      "AniList 182206 'Soukai no Namida-hen' format=MOVIE, 104 min, 2026-02-27 = the entry's stated JP release.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/182206'],
  },
  {
    seriesId: 'the-ancient-magus-bride',
    ruleId: 'T29',
    value: { position: 24.1, record: { kind: 'ova', anilistId: 130713 } },
    reason:
      "AniList 130713 format=OVA, 3 eps, 2021-09-10 to 2022-09-09. en-WP infobox: type=oad (original animation DVD), 'The Ancient Magus' Bride: The Boy from the West and the Knight of the Blue Storm' — OAD is the home-video-bundle form of OVA.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/130713', 'https://en.wikipedia.org/wiki/The_Ancient_Magus%27_Bride'],
  },
  {
    seriesId: 'the-heroic-legend-of-arslan',
    ruleId: 'T29',
    value: { position: 25.1, record: { kind: 'ova', anilistId: 21817 } },
    reason:
      "AniList 21817 'Arslan Senki (TV) OVA' format=OVA, 2 eps, 2016-03-09 and 2016-12-09. en-WP The Heroic Legend of Arslan carries an infobox with type=ova for the TV series' OVAs.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/21817', 'https://en.wikipedia.org/wiki/The_Heroic_Legend_of_Arslan'],
  },
  {
    seriesId: 'to-love-ru-darkness',
    ruleId: 'T29',
    value: { position: 12.2, record: { kind: 'ova', anilistId: 13851 } },
    reason:
      "AniList 13851 'To LOVE-Ru Darkness OVA' format=OVA, 6 eps, from 2012-08-17. en-WP To Love Ru infobox: type=ova, 'To Love Ru Darkness', released August 17, 2012.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/13851', 'https://en.wikipedia.org/wiki/To_Love_Ru'],
  },
  {
    seriesId: 'to-love-ru-darkness',
    ruleId: 'T29',
    value: { position: 24.1, record: { kind: 'special', anilistId: 21852 } },
    reason:
      "AniList 21852 'To LOVE-Ru Darkness 2nd Specials' format=SPECIAL, 2 eps, 2015-10-29 — the '2nd eps 13-14' the entry names. NOTE: appears to be the same work as the @24.5 entry — see flags.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/21852'],
  },
  {
    seriesId: 'yu-gi-oh-2000',
    ruleId: 'T29',
    value: { position: 224.5, record: { kind: 'movie', anilistId: 21265 } },
    reason:
      "AniList 21265 format=MOVIE, 130 min, 2016-04-23. en-WP: 'is a 2016 Japanese animated science fantasy film'.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/21265', 'https://en.wikipedia.org/wiki/Yu-Gi-Oh!_The_Dark_Side_of_Dimensions'],
  },
  {
    seriesId: 'yu-yu-hakusho-ghostfiles',
    ruleId: 'T29',
    value: { position: 112.1, record: { kind: 'special', anilistId: 6964 } },
    reason:
      "AniList 6964 'Yuu Yuu Hakusho Picture Drama' format=SPECIAL, 1 ep, 6 min, 2009-10-27. en-WP: Bandai Visual's first Blu-ray set (October 27, 2009) 'contain[ed] a picture drama set after the end of the series'. NOTE: appears to be the same work as the @112.5 entry — see flags.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/6964', 'https://en.wikipedia.org/wiki/YuYu_Hakusho_(1992_TV_series)'],
  },
  {
    seriesId: 'yu-yu-hakusho-ghostfiles',
    ruleId: 'T29',
    value: { position: 112.7, record: { kind: 'ova', anilistId: 102631 } },
    reason:
      "en-WP YuYu Hakusho (1992 TV series) infobox: type=ova, title 'Yu Yu Hakusho: Two Shot & All or Nothing', 2 episodes, released October 26, 2018; the franchise article: 'A brand new OVA ... was released with a Blu-ray box set ... on October 26, 2018'. DISAGREEMENT: AniList 102631 bundles both shorts as ONE entry with format=SPECIAL. The anilist_id is therefore shared with @112.8 — it is not a per-entry id.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/102631', 'https://en.wikipedia.org/wiki/YuYu_Hakusho_(1992_TV_series)'],
  },
  {
    seriesId: 'yu-yu-hakusho-ghostfiles',
    ruleId: 'T29',
    value: { position: 112.8, record: { kind: 'ova', anilistId: 102631 } },
    reason:
      "en-WP YuYu Hakusho (1992 TV series) infobox: type=ova, 'Yu Yu Hakusho: Two Shot & All or Nothing', 2 episodes, released October 26, 2018. DISAGREEMENT: AniList 102631 bundles both shorts as ONE entry with format=SPECIAL; the id is shared with @112.7.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/watch-order-kinds.json', 'https://anilist.co/anime/102631', 'https://en.wikipedia.org/wiki/YuYu_Hakusho_(1992_TV_series)'],
  },
  {
    seriesId: 'yu-gi-oh-5d-s',
    ruleId: 'T29',
    value: { position: 82.5, record: { kind: 'movie', anilistId: 6951 } },
    reason:
      "The theatrical film 劇場版 遊☆戯☆王 ~超融合!時空を越えた絆~ 'Bonds Beyond Time' (AniList 6951, format MOVIE, 49 min, 2010-01-23), which AFL numbered into the TV run as row 83 (dropped under N11, 2026-08-27). Order-only @82.5: yugioh.fandom's film page places it before Crash Town with Bruno present, and Katsumi Ono's tweet puts it 「クラッシュタウン編」以前 → between ep 82 and ep 83 (range 82-86). The yu-gi-oh-2000 @224.5 shape.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/yu-gi-oh-5d-s.json', 'scripts/ingest/research/batch19/verify/yu-gi-oh-5d-s.md', 'https://anilist.co/anime/6951'],
  },
];

/** sync-watch-order.ts consumer shape: series_id → position → surfaced label (absent = unsurfaced) */
export const RULED_LABELS: Record<string, Record<number, string>> = {};
/** sync-watch-order.ts consumer shape: series_id → position → structured adaptation record */
export const RULED_RECORDS: Record<string, Record<number, WatchOrderRecord>> = {};
for (const e of ENTRIES) {
  if (e.value.label != null) (RULED_LABELS[e.seriesId] ??= {})[e.value.position] = e.value.label;
  if (e.value.record) (RULED_RECORDS[e.seriesId] ??= {})[e.value.position] = e.value.record;
}
/** I45: a ruled position for a related work by its AniList id (overrides the derived air-date position) */
export const RULED_POSITION_BY_ANILIST: Record<string, Record<number, number>> = {};
for (const e of ENTRIES) if (e.value.record?.anilistId != null) (RULED_POSITION_BY_ANILIST[e.seriesId] ??= {})[e.value.record.anilistId] = e.value.position;
