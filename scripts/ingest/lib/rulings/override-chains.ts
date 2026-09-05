// Override chains — the stitcher's RULED component chains (restructure T2.1,
// 2026-08-26; formerly the OVERRIDE_CHAINS literal in scripts/ingest/stitch.ts).
// Each entry is one series whose AniList component chain is declared rather
// than walked: cases the relation walker cannot derive (wrong upstream
// matches, broken/ambiguous relation graphs — I24 stitch candidacy) and the
// RULED EXTENSIONS class (I27: AFL pages lag newer seasons, so the chain runs
// beyond its AFL page; `ruledExtent` carries the ruling's reasoning and makes
// the chain a standing candidate re-asserted on every run).
//   ids    — AniList entries in series order (verified against AFL counts by
//            the finalize gate, I25)
//   extras — in-flow order-only components WITHOUT AFL episode rows (I19;
//            movies count only when numbered, N4)
//   title  — franchise identity override (else the head season's)
// The derived OVERRIDE_CHAINS keeps the consumer's shape; entry order is the
// literal's order (it is the ruled-extension re-assert order in stitch.ts).

import { toRecord, type RulingEntry } from './types';

export type OverrideChain = {
  ids: number[];
  extras?: { id: number; after: number }[];
  title?: string;
  ruledExtent?: string;
};

export const ENTRIES: RulingEntry<OverrideChain>[] = [
  // ── Assisted-batch explicit chains (2026-08-22) ──────────────────────────
  {
    seriesId: 'jojos-bizarre-adventure-tv',
    ruleId: 'I24',
    value: { ids: [14719, 20474, 20799, 21450, 102883, 131942, 146722] },
    reason:
      "Assisted-batch explicit chain: the relation walker cannot derive it. Sean ruled JoJo ONE series (unheld 2026-08-22). Off & Monster Season (173533) intentionally absent — AFL's page (100 rows) predates it; the count_mismatch flag on AFL's next update re-adds it here.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'monogatari-series',
    ruleId: 'I24',
    value: {
      title: 'Monogatari Series', // the franchise identity, not the head season's
      ids: [5081, 11597, 15689, 17074, 20593, 20918, 21262, 21520, 21745, 100815],
      extras: [
        { id: 9260, after: 21520 },
        { id: 21399, after: 21520 },
        { id: 21400, after: 21520 },
      ],
    },
    reason:
      'Assisted-batch explicit chain under the franchise identity title (not the head season). Sean ruled Monogatari ONE series (unheld 2026-08-22) and that the Kizumonogatari films (9260, 21399, 21400) belong INSIDE Monogatari — in-flow order-only extras after Owarimonogatari (21520).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'dragon-ball-z-kai',
    ruleId: 'I24',
    value: { ids: [6033, 20635] },
    reason: 'UNRECORDED — assisted-batch explicit chain (Kai + Kai: The Final Chapters); a case the relation walker could not derive (wrong upstream match or broken/ambiguous relation graph), per-series detail not written down.',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'bleach-thousand-year-blood-war',
    ruleId: 'I24',
    value: { ids: [116674, 159322, 169755, 185874] },
    reason: 'UNRECORDED — assisted-batch explicit chain (TYBW parts 1-4); a case the relation walker could not derive, per-series detail not written down. TYBW is a separate entry from bleach by the Naruto→Shippuden pattern (I16).',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'yu-gi-oh-zexal',
    ruleId: 'I24',
    value: { ids: [10015, 15489] },
    reason: 'UNRECORDED — assisted-batch explicit chain (Zexal + Zexal II); a case the relation walker could not derive, per-series detail not written down.',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'hell-girl',
    ruleId: 'I24',
    value: { ids: [228, 1594, 3713, 98379] },
    reason: 'UNRECORDED — assisted-batch explicit chain (four Hell Girl seasons); a case the relation walker could not derive, per-series detail not written down.',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'magi-labyrinth-magic',
    ruleId: 'I24',
    value: { ids: [14513, 18115] },
    reason: 'UNRECORDED — assisted-batch explicit chain (Labyrinth + Kingdom of Magic); a case the relation walker could not derive, per-series detail not written down.',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'melancholy-haruhi-suzumiya',
    ruleId: 'I24',
    value: { ids: [4382] },
    reason: 'The 2009 rebroadcast entry (4382) is the full 28-episode ordering AFL uses, so the chain is that single entry rather than the 2006 original.',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'love-ru-darkness',
    ruleId: 'I27',
    value: {
      ids: [13663, 20995],
      extras: [{ id: 21852, after: 20995 }], // '2nd Specials' (eps 13-14 of 2nd) — order-only, adapts chs 43-47 (batch 14)
      ruledExtent: 'AFL numbers the two 2nd-season specials as 25-26 (dropped by SOURCE_NUMBERING_SHIFTS); they hold an order-only position after 20995 — batch 14 (2026-08-23 s2)',
    },
    reason:
      "AFL numbers the two 2nd-season specials as 25-26 (dropped by SOURCE_NUMBERING_SHIFTS); the '2nd Specials' entry (21852, eps 13-14 of 2nd, adapts chs 43-47) holds an order-only position after 20995 — batch 14 (2026-08-23 s2).",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['docs/data-pipeline.md §12 batch 14'],
  },
  {
    seriesId: 'kamisama-kiss',
    ruleId: 'I24',
    value: { ids: [14713, 20801, 21186] },
    reason: 'UNRECORDED — assisted-batch explicit chain (S1 + S2 + Kako-hen OVAs 21186, community-counted 26-29 per REVIEWED_NUMBERED_SPECIALS); a case the relation walker could not derive, per-series detail not written down.',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  {
    seriesId: 'x',
    ruleId: 'I24',
    value: { ids: [156] },
    reason: 'UNRECORDED — assisted-batch explicit chain pinning the X TV series (156); a case the relation walker could not derive (the one-letter title mis-matches upstream), per-series detail not written down.',
    ruledBy: 'session',
    ruledOn: '2026-08-22',
  },
  // ── AniList relation-graph gaps found post-recovery (2026-08-23) ─────────
  {
    seriesId: 'tokyo-ghoul',
    ruleId: 'I24',
    value: { ids: [20605, 20850] },
    reason: 'AniList relation-graph gap found post-recovery: S1 + √A — the AFL page covers both (24 eps). :re is a SEPARATE entry (Sean 2026-08-24, Naruto/Shippuden pattern), so the chain stops at √A.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'tokyo-ghoul-re-0',
    ruleId: 'I24',
    value: { ids: [100240, 102351] },
    reason: 'AniList relation-graph gap found post-recovery: :re parts 1+2 form the split-off series (Sean 2026-08-24: :re separate from tokyo-ghoul).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'fatestay-night-unlimited-blade-works',
    ruleId: 'I24',
    value: { ids: [19603, 20792] },
    reason: 'AniList relation-graph gap found post-recovery: UBW is two cours under one AFL page.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'rurouni-kenshin-2023',
    ruleId: 'I24',
    value: { ids: [142877, 171637] },
    reason: 'AniList relation-graph gap found post-recovery: 2023 + Kyoto Disturbance (the 2023 remake is a separate series from the 1996 TV, I16).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'berserk-2016',
    ruleId: 'I24',
    value: { ids: [21560, 97643] },
    reason: '2016 + 2017 seasons. The Memorial Edition is its PREQUEL edge on AniList but a separate entry by ruling, so the walk would bridge wrongly without the explicit chain.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'blade-immortal-2019',
    ruleId: 'I24',
    value: { ids: [109616] },
    reason: 'Pins the 2019 ONA (109616): the automatic match had landed on the 2008 TV adaptation.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'hokuto-no-ken',
    ruleId: 'I24',
    value: { ids: [967, 1356] },
    reason: 'UNRECORDED — post-recovery relation-graph gap (Hokuto no Ken + Hokuto no Ken 2); per-series detail not written down.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  // ── RULED EXTENSIONS (2026-08-23; the stitch queue's AFL-lag class) ──────
  // every id verified against AniList's SEQUEL graph that session; extras are
  // order-only watch-order entries (movies count only when numbered, N4).
  {
    seriesId: 'black-butler',
    ruleId: 'I27',
    value: {
      ids: [4898, 6707, 20606, 166715, 179054],
      extras: [
        { id: 20670, after: 20606 }, // Book of Murder OVAs — order-only (flag #853)
        { id: 21425, after: 20606 }, // Book of the Atlantic film — order-only (flag #853)
      ],
      ruledExtent: 'AFL page = S1+S2+Circus (46); Public School Arc TV (2024, our 47-57) + Emerald Witch Arc TV (2025, our 58-70) aired — flag #853',
    },
    reason:
      'AFL-lag class: AFL page = S1+S2+Circus (46); Public School Arc TV (2024, our 47-57) + Emerald Witch Arc TV (2025, our 58-70) aired. Book of Murder OVAs (20670) and the Book of the Atlantic film (21425) are order-only after Circus — flag #853.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['ingest_flags #853'],
  },
  {
    seriesId: 'kingdom',
    ruleId: 'I27',
    value: {
      ids: [12031, 17389, 113108, 140350, 155227, 190840],
      ruledExtent: 'AFL page stops at S3 (104 rows); S5 (2024, our 130-142) + S6 (Oct-Dec 2025, our 143-155) aired — flag #814. Zoku-hen (204688) joins when it airs',
    },
    reason: 'AFL-lag class: AFL page stops at S3 (104 rows); S5 (2024, our 130-142) + S6 (Oct-Dec 2025, our 143-155) aired — flag #814. Zoku-hen (204688) joins when it airs.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['ingest_flags #814'],
    retiresWhen: 'Zoku-hen (204688) airs — chain gains an id',
  },
  {
    seriesId: 'rent-girlfriend',
    ruleId: 'I27',
    value: {
      ids: [113813, 124410, 154745, 179344, 199029],
      ruledExtent: 'AFL page = S1-S3 (36); S4 (ONA, Jul 2025, our 37-48) + S5 (ONA, Apr 2026, our 49-60) aired — flag #839',
    },
    reason: 'AFL-lag class: AFL page = S1-S3 (36); S4 (ONA, Jul 2025, our 37-48) + S5 (ONA, Apr 2026, our 49-60) aired — flag #839.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['ingest_flags #839'],
  },
  {
    seriesId: 'beastars',
    ruleId: 'I27',
    value: {
      ids: [107660, 114194, 136880, 187267],
      ruledExtent: 'AFL page = S1+S2 (24); FINAL SEASON Part 1 (Dec 2024, our 25-36) + Part 2 (Mar 2026, our 37-48) complete the manga — flag #854',
    },
    reason: 'AFL-lag class: AFL page = S1+S2 (24); FINAL SEASON Part 1 (Dec 2024, our 25-36) + Part 2 (Mar 2026, our 37-48) complete the manga — flag #854.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['ingest_flags #854'],
  },
  {
    seriesId: 'ancient-magus-bride',
    ruleId: 'I27',
    value: {
      ids: [98436, 154364, 166452],
      extras: [{ id: 130713, after: 98436 }], // 2021 OVA 'Nishi no Shounen to Seiran no Kishi' — order-only between S1 and S2
      ruledExtent: 'AFL page = S1 (24); SEASON 2 (2023, two cours, our 25-48) aired — batch-10 stitch flag',
    },
    reason: "AFL-lag class: AFL page = S1 (24); SEASON 2 (2023, two cours, our 25-48) aired — batch-10 stitch flag. The 2021 OVA 'Nishi no Shounen to Seiran no Kishi' (130713) is order-only between S1 and S2.",
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'golden-kamuy',
    ruleId: 'I27',
    value: {
      ids: [99699, 102977, 110355, 142343, 166521],
      extras: [
        { id: 101830, after: 99699 }, // OVA 1 (with vol 15): chs 55 (part)-59 + 32 — order-only (batch 14)
        { id: 124756, after: 102977 }, // OVAs 2/3/4 (with vols 17/19/21): 83-85+104 / 63-69 / 108-113 — order-only (batch 14)
        { id: 194872, after: 142343 }, // OVA 5 (2025): 102, 104-107, 228 — order-only (batch 14)
      ],
      ruledExtent: 'AFL page = S1+S2 (24); S3 (2020, our 25-36) + S4 (2022, our 37-49) + Final Season (Jan-Mar 2026, our 50-62 → ch 302, NOT the manga end: Bousou Ressha-hen 210073 will adapt 303-314) — flag #856; OVAs order-only per batch 14. Sapporo Beer Koujou-hen films (196115) = recut of eps 50-55, excluded',
    },
    reason:
      'AFL-lag class: AFL page = S1+S2 (24); S3 (2020, our 25-36) + S4 (2022, our 37-49) + Final Season (Jan-Mar 2026, our 50-62 → ch 302, NOT the manga end: Bousou Ressha-hen 210073 will adapt 303-314) — flag #856. OVA 1 (101830: chs 55 part-59 + 32), OVAs 2/3/4 (124756: 83-85+104 / 63-69 / 108-113) and OVA 5 (194872: 102, 104-107, 228) are order-only per batch 14. Sapporo Beer Koujou-hen films (196115) = recut of eps 50-55, excluded.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['ingest_flags #856', 'docs/data-pipeline.md §12 batch 14'],
    retiresWhen: 'Bousou Ressha-hen (210073) airs — chain gains an id',
  },
  {
    seriesId: 'cardcaptor-sakura',
    ruleId: 'I27',
    value: {
      ids: [232, 98554],
      ruledExtent: "1998 TV (232, 1-70) + Clear Card PROLOGUE OVA 98554 ('Sakura and the Two Bears', ep 71, adapts chs 46-50 — NOT the Sealed Card film 372 the relation walk bridged through). Clear Card TV (97881) = SEPARATE series cardcaptor-sakura-clear-card (Sean 2026-08-24, different manga 87296); community cap 71 keeps the shared AFL page's tail out",
    },
    reason:
      "1998 TV (232, 1-70) + Clear Card PROLOGUE OVA 98554 ('Sakura and the Two Bears', ep 71, adapts chs 46-50 — NOT the Sealed Card film 372 the relation walk bridged through). Clear Card TV (97881) is the SEPARATE series cardcaptor-sakura-clear-card (Sean 2026-08-24: different manga 87296); the community cap 71 keeps the shared AFL page's tail out.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    cite: ['docs/franchise-rulings.md "Cardcaptor Sakura: Clear Card = SEPARATE SERIES"'],
  },
  {
    seriesId: 'my-hero-academia',
    ruleId: 'I27',
    value: {
      ids: [21459, 21856, 100166, 104276, 117193, 139630, 163139, 182896],
      extras: [
        { id: 204356, after: 182896 }, // "No. 170+1: More" (2026-05-02, ch 431) — community-numbered 170+1 (Sean 2026-08-24)
        { id: 211711, after: 182896 }, // "I am a hero too" Eri special (2026-08-03, ch 431.5) — mangaMapper position 170+1.5 (Sean's ruling)
      ],
      ruledExtent: "post-finale specials join as order-only entries (Sean 2026-08-24: essential canon the community groups with the series; surfaced with the community +N format — 'No. 170+1: More' at 170+1, the Eri fan-book special at Sean's 170+1.5, matching the manga's .5 bonus format). Counts stay 170",
    },
    reason:
      "Post-finale specials join as order-only entries — Sean 2026-08-24: essential canon the community groups with the series. 'No. 170+1: More' (204356, 2026-05-02, ch 431) at community position 170+1; the 'I am a hero too' Eri special (211711, 2026-08-03, ch 431.5) at Sean's 170+1.5, matching the manga's .5 bonus format. Counts stay 170.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'heroic-legend-arslan',
    ruleId: 'I27',
    value: {
      ids: [20935, 21424],
      extras: [{ id: 21817, after: 21424 }], // OVA: two anime-original side stories — order-only (batch 14)
      ruledExtent: 'AFL page = S1 (25); Fuujin Ranbu (2016, 8 eps, our 26-33, chs 72-107) aired — batch 14 (2026-08-23 s2): the stored ep25→107 pin was the S2 endpoint (repaired to 71). 1991 OVA (1762) is a separate novel adaptation — excluded',
    },
    reason:
      'AFL-lag class: AFL page = S1 (25); Fuujin Ranbu (2016, 8 eps, our 26-33, chs 72-107) aired — batch 14 (2026-08-23 s2): the stored ep25→107 pin was the S2 endpoint (repaired to 71). The OVA (21817) is two anime-original side stories, order-only. The 1991 OVA (1762) is a separate novel adaptation — excluded.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['docs/data-pipeline.md §12 batch 14'],
  },
  {
    seriesId: 'time-i-got-reincarnated-slime',
    ruleId: 'I27',
    value: {
      ids: [101280, 108511, 116742, 156822, 182205],
      extras: [
        { id: 161802, after: 101280 }, // Visions of Coleus OVA — order-only, anime-original (batch 14 placement)
        { id: 139498, after: 116742 }, // Scarlet Bond film — order-only, anime-original (batch 14)
        { id: 182206, after: 156822 }, // Tears of the Azure Sea film — order-only, anime-original (batch 14)
      ],
      ruledExtent: 'AFL page = S1 (24); S2 (2021, two parts, our 25-48) + S3 (2024, our 49-72) + S4 (airing 2026, our 73-96) — docs §12.19e structure gap, MU out-of-space flag #728. OVA/films wired order-only once batch-14 research places them',
    },
    reason:
      'AFL-lag class: AFL page = S1 (24); S2 (2021, two parts, our 25-48) + S3 (2024, our 49-72) + S4 (airing 2026, our 73-96) — docs §12.19e structure gap, MU out-of-space flag #728. Visions of Coleus OVA (161802), Scarlet Bond (139498) and Tears of the Azure Sea (182206) are anime-original, order-only at their batch-14 placements.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['docs/data-pipeline.md §12.19e', 'ingest_flags #728'],
  },
  // ── Discovery witness #1 (I42 / I27, Sean's go 2026-09-05) ────────────────
  {
    seriesId: 'rising-shield-hero',
    ruleId: 'I27',
    value: {
      ids: [99263, 111321, 111322, 173780],
      ruledExtent: "AFL's page charts S1 only (25 eps); AniList's SEQUEL chain S2 (111321, 13) → S3 (111322, 12) → S4 (173780, 12) is the same continuous story — season ordinals on the base title (I42 title continuity). S5 (199185) is announced for 2027 with no count and joins when it has dates, the standing practice (Kingdom S6 Part 2, Rent-a-Girlfriend S6): an undated member would flip the series to 'upcoming'. Rows for 26-62 via the wiki writer (G59 A); types default until AFL charts them.",
    },
    reason:
      "The first discovery promotion (the-rising-of-the-shield-hero, the I42 witness): the catalog stopped at AFL's S1 page for three finished seasons. A component, not a series — same title, season ordinals, one continuous story (I15); the finalize gate needs only the chain to COVER AFL's 25 (I25's ruled clause). Sean's go 2026-09-05 (PROPOSAL.md §9 row 4).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/PROPOSAL.md §9 row 4', 'docs/changelog.md §12.124'],
    retiresWhen: 'S5 (anilist 199185) is dated — add it to ids',
  },
];

/** stitch.ts consumer shape: afl_slug → chain */
export const OVERRIDE_CHAINS: Record<string, OverrideChain> = toRecord(ENTRIES);
