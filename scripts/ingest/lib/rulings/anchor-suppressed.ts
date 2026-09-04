// ANCHOR_SUPPRESSED — per-episode rows ruled POSITION-LESS (rule A44,
// 2026-08-26, batch 18 wave 3 — the one-piece cover-serial lesson). A canon
// or mixed row whose source content cannot be a reading position — a
// cover-page side story running ahead of the main line, a side story with no
// chapter number, acts that sit behind an earlier anchor — must never take
// an anchor from ANY writer (AFG chart, AFG continua, MU frontier). The A1
// type gate cannot hold these: the row is legitimately canon/mixed. Before
// this map the one-piece ep-455 junk anchor (cover pages 545-551) was held
// off only by a one-time A6 deletion in a history script, and 453/454/456
// only by an LIS tie-break on chart values. Reason + cite required; the
// healer removes any standing anchor on a suppressed row (the ruling IS the
// A6 triage); a stored anchor on one is a ruling_violation.
import { toMergedList, type RulingEntry } from './types';

export const ENTRIES: RulingEntry<number[]>[] = [
  {
    seriesId: 'one-piece',
    ruleId: 'A44',
    value: [453, 454, 455, 456],
    reason:
      "The Straw Hat's Separation Serial: Oda's cover-page side story (ch 543-560 covers) animated during Luffy's Impel Down → Marineford travel. Canon per the wiki's own Canon page and ja-WP (not bold), so the rows are mixed under T28 — but the cover chapters run 5-11 chapters AHEAD of the main-line position (ep 452 ends ch 549; ep 459 holds 551): an anchor here spoils Marineford and states adaptation of single cover pages. AFG's chart prints the cover numbers on all four rows (fixture: 455 → 545-546, 550-551 — the exact junk anchor Sean deleted under A6 in batch 17). Position-less by ruling.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/out/one-piece.json', 'scripts/ingest/research/batch18/verify/one-piece.md', 'https://onepiece.fandom.com/wiki/Straw_Hat%27s_Separation_Serial'],
  },
  {
    seriesId: 'gto-great-teacher-onizuka',
    ruleId: 'A44',
    value: [27],
    reason:
      "Adapts the Great Toroko Oppai side story (Scenes 1-7) serialized inside GTO between Lessons 92/93 and 97/98 — mixed under T28, but the Scenes have NO Lesson number and sit AHEAD of what eps 29-33 adapt (Lessons 75-92). A reading position cannot be stated; the verdict's own graft note says DO NOT ANCHOR.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/out/gto-great-teacher-onizuka.json', 'scripts/ingest/research/batch18/verify/gto.md'],
  },
  {
    seriesId: 'sailor-moon',
    ruleId: 'A44',
    value: [],
    reason:
      "SUPERSEDED 2026-08-27 (Sean, the catalog line 'pages, not numbers'): eps 167-168 play never-adapted Dream-arc material (Act 38 tail + Act 44 opening at 167; Act 44 core + the Act 48-49 Eternal beat at 168) — mixed, substantial, FIRST-TIME pages — the saint-seiya 29-30 shape, so they ANCHOR (167 → 44 [38], 168 → 49 [44], rearranged) and ep 166 is tightened to Act 49's outcome. The 2026-08-26 ruling ('those Acts sit BEHIND ep 166's stored Act 49: an anchor would run the position backwards') was the number reading; kept as the record, no episodes suppressed.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    supersedes: '2026-08-26 A44 [167, 168] — position-less by the number reading',
    cite: ['scripts/ingest/research/batch18/out/sailor-moon.json', 'scripts/ingest/research/batch18/verify/sailor-moon.md'],
  },
  {
    seriesId: 'a-certain-scientific-railgun',
    ruleId: 'A44',
    value: [41],
    reason:
      "Adapts the ch-39 gag special + ch 40's rat-buying scene + a vol-5 omake inside original framing — mixed under T28, but a gag special and a single scene do not advance the reading position (ch 40 is otherwise adapted by S #16-17's neighbours). Zone-acknowledged; position-less by ruling.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/out/a-certain-scientific-railgun.json', 'scripts/ingest/research/batch18/verify/a-certain-scientific-railgun.md'],
  },
  {
    seriesId: 'akame-ga-kill',
    ruleId: 'A44',
    value: [20, 21],
    reason:
      'Mixed rows (the ch 50-53 outline; ch 42-43 and ch 56 beats) inside the anime-original ending: an end-chapter of 53 would skip ch 39/44/45/47-50 (never adapted) and ep 21 reaches back to ch 42-43. The anchor line stops at ep 19 (afg-continua 38 — 36 until the 2026-08-27 parser fix: AFG reads "36 (p. 31-41), 37 and 38"). Position-less by ruling.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch18/verify/akame-ga-kill.md'],
  },
  {
    seriesId: 'ajin-demi-human',
    ruleId: 'A44',
    value: [22],
    reason:
      "Mixed row (re-confirmed) that restages the manga's Forge Security arc (ch 32-42) in a substituted setting (ja-WP: 武蔵重工の橋口 for フォージ安全の甲斐と李; 黒木 9巻38話 / 平沢 9巻42話 → 第2期22話): ch 32-37 have no counterpart and the source itself tells readers to go read 32-42. An END of 42 would set coverage to 42 and manufacture a continue of 43 — a false position; even a beat-mapped anchor would START at 38. Position-less by ruling; the post-series resume stays 29 on ep 19.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch19/out/ajin-demi-human.json', 'scripts/ingest/research/batch19/verify/ajin-demi-human.md'],
  },
  {
    seriesId: 'chrono-crusade',
    ruleId: 'A44',
    value: [21],
    reason:
      "Mixed row (the Magdalene flashback) whose v6 span 36-41 is INFERRED (fandom debut field + en-WP's volume title list), not sourced per episode; an END there would leap the never-adapted Acts 31-35 and drag A4 coverage 30 → 41 past MU's explicit 'Ends at Vol 5, Chap 30'. The stored 2026-08-24 ruling was only an A7 zone bound — no writer refused the row until this entry. Graft{36-41} stays as the annotation, zone-acknowledged.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch19/out/chrono-crusade.json', 'scripts/ingest/research/batch19/verify/chrono-crusade.md'],
  },
  {
    seriesId: 'trigun',
    ruleId: 'A44',
    value: [18],
    reason:
      "Mixed row adapting Trigun Maximum ch 1-2 — the SEQUEL manga's chapter space, never convertible to this entry's Trigun 0-20 space (both wikis publish continuous overall numbers 21/22). Anchor-eligible by type, anchor-forbidden by chapter space; the MU frontier writer would otherwise pin it. side_source annotation carries the fact.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['scripts/ingest/research/batch19/out/trigun.json', 'scripts/ingest/research/batch19/verify/trigun.md'],
  },
  // ---- batch 19 wave 2 (2026-08-27; verified R24; Sean ruled under the
  // catalog line 'pages, not numbers': re-shown pages, another chapter space,
  // or a first-time SLIVER inside an original plot → position-less)
  {
    seriesId: 'eyeshield-21',
    ruleId: 'A44',
    value: [39],
    reason: "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): ep 39 is the clip show + TV-interview plot whose only source content is ch 89 pp 14-15 (Suzuna in the BATS cheer uniform) — two pages of an 18-page chapter anchored on ep 38, page-verified; a first-time sliver inside an original plot is position-less (A44). The stored partial {89} carries the tie; its stored 'mixed' type is a T28 card (two pages).",
    ruledBy: 'Sean', ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/eyeshield-21-w3.json', 'scripts/ingest/research/batch20/verify/eyeshield-tmm-w3.md'],
  },
  {
    seriesId: 'tokyo-mew-mew',
    ruleId: 'A44',
    value: [19, 21, 37, 44],
    reason: "Batch 20 wave 3 (verified R24, Sean ruled 2026-08-27): the A18 reorder holes inside the ruled settled-reorder regime (A41) hold no truthful continuous position — 19 / 21 / 37 (mixed) quote fragments of chapters already reached or later delivered whole (the tie annotations name them; the dub pages for 19/21 are independent witnesses), 44 is anime-original (T6 filler) restaging ch 18 / ch 22 beats. Ep 41 was the one anchorable hole (→ 21 [21], first-time pages of ch 21's red-tide half).",
    ruledBy: 'Sean', ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch20/out/tokyo-mew-mew.json', 'scripts/ingest/research/batch20/verify/eyeshield-tmm-w3.md'],
  },
  {
    seriesId: 'x',
    ruleId: 'A44',
    value: [9, 10, 16, 17, 18],
    reason:
      "Five rows of the remix zone hold no truthful continuous position (batch 19 B5-10). Eps 9-10: FORWARD grafts of volume 8's recruitment beats (ch 29-31: Subaru's onmyoji job / the Seishiro illusion at 9; Saiki taking Yuzuriha to recruit Aoki at 10) fused with the bonus chapters 41.5 / 24.5 / 34.5, played BEFORE ch 24 (ep 11) and ch 25 (ep 12) — an END would claim 24-28 unseen and run backwards two rows later (A12). Ep 16: vol 12's opening (42-43) welded to vol 15's close and vol 16's Rainbow Bridge duel (71-78), stopping mid-volume — no boundary lands; the monotone option END 43 exists (true, understates the episode's own title beat, Seishiro's death) and was shown to Sean. Ep 17: largely a clip show + vol 14/15 fragments (54-62, 63, 70.5) + an anime-only scene. Ep 18: vol 13's first beat (49, Inuki's death) + vol 15's Yuzuriha/Kusanagi block (63-70) — the monotone option END 49 exists (forward of ep 15's 41) and was shown to Sean; it claims nothing of the vol-15 half. The per-episode rearranged / side_story / divergence annotations carry the chapters; eps 15 → 41 and 19 → 53 are the zone's two true waypoints (volume boundaries).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/x.json', 'scripts/ingest/research/batch19/verify/b5b-x-seiya-mewmew.md'],
  },
  {
    seriesId: 'saint-seiya-knights-of-the-zodiac',
    ruleId: 'A44',
    value: [32],
    reason:
      "Ep 32 opens the anime-exclusive Post-Silver-Saints block (ES wiki: 'Historia exclusiva del anime', 'el segundo arco de relleno') and RE-STAGES ch 18-19's Esmeralda memories and Black Phoenix fight — already ep 15's END 19 — under invented circumstances (Jango's promotion after Ikki's departure, the island's destruction). Re-shown pages are not cited (the catalog line); Jango is NOT an anime invention (ES wiki: manga ch 18) — recorded as loose_parallel{18-19}. Typing stays mixed (no retype: the filler reading rests on one wiki; AFL says mixed) — Sean's call, not made. Contrast eps 29-30, ANCHORED at 24: ch 24's back half airs there first-time.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/saint-seiya-knights-of-the-zodiac.json', 'scripts/ingest/research/batch19/verify/b5b-x-seiya-mewmew.md'],
  },
  {
    seriesId: 'emma-a-victorian-romance',
    ruleId: 'A44',
    value: [2],
    reason:
      "No chapter is adapted: Kuga Maki's on-air review (spqr.hatenablog.com 2005-04-10) states 今回は原作に無いシナリオ構成をしていました; ch 2 眼鏡 (the failed glasses gift) appears in no ep-2 synopsis; the only manga-sourced element is Eleanor Campbell's debut, relocated from ch 7 (ep 6's stored END) — rearranged{7}. An END of 7 would claim chs 3-7 after two episodes; A12 forbids a relocated element setting a START. Typing stays canon (no second source; the loose-parallel reading of vol-1 material noted by the verifier) — a future typing pass with eps 4-5.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/emma-a-victorian-romance.json', 'scripts/ingest/research/batch19/verify/b5c-ranma-bobobo-arms-emma.md'],
  },
  {
    seriesId: 'ranma-1-2',
    ruleId: 'A44',
    value: [130],
    reason:
      "A first-time SLIVER inside an original plot: ch 58's closing pages (Satsuki's reveal, the honeymoon letter, the horse) air here for the first time — real enough for MIXED (T6 entry) and the graft{58} tie, not a position: an END of 58 would drag the reader from ch 198 (ep 129) back 140 chapters, and A12 forbids a relocated far-earlier beat from setting a START. Ep 93 carries 56-58 as the arc's anchor (rearranged, the A18 regime).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/ranma-1-2.json', 'scripts/ingest/research/batch19/verify/b5c-ranma-bobobo-arms-emma.md'],
  },
  {
    seriesId: 'erased',
    ruleId: 'A44',
    value: [12],
    reason:
      "Batch 20 wave 9 (verified R24), Sean ruled 2026-09-02: ep 12 「宝物」 is the studio's ending — the hospital-rooftop confrontation is anime-invented start to finish — typed MIXED on the sole-adaptation tie to ch 44's arc close (the final line verbatim, the same 高架下 in the same snow; `partial`{44}). A far-forward closing beat is never an END (A4/A47): an anchor of 44 would retire nine unseen chapters (36-43 never adapted), so the row is position-less by ruling; the honest terminal is ep 11 → 35 [33] (G56) with the continue IN 35 (C1). The mu anchor that sat on this row (35) was deleted in the same apply.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/erased.json', 'scripts/ingest/research/batch20/verify/erased.md'],
  },
  {
    seriesId: 'dragon-quest-the-adventure-of-dai',
    ruleId: 'A44',
    value: [61],
    reason:
      "Batch 20 wave 14 (sub-block A, verified R24), Sean's standing ruling 2026-09-02 (unnumbered extras are noted, never numbered): ep 61 特別篇「勇者アバン」 adapts the UNNUMBERED 番外編「勇者アバン」 (V Jump, Nov 1991; printed as bonus matter at the back of tankōbon vol 13, between printed ch 121 覇者の剣 and 122 決勝戦の異変!!) in full, out of order, and no numbered mainline chapter — the catalog's chapter space is the PRINTED 348 (N35), which does not number it, so the row has no position: canon + `side_story` naming it; the reader's position carries over from ep 60 (continue IN 220). An anchor of 121/122 would drag the reader 100 chapters back (A12).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch20/out/dragon-quest-the-adventure-of-dai-w14a.json', 'scripts/ingest/research/batch20/verify/dragon-quest-the-adventure-of-dai-w14abd.md'],
  },
  {
    seriesId: 'bleach',
    ruleId: 'A44',
    value: [46],
    reason:
      "Batch 20 wave 16 (T28's sliver clause; verified R24), Sean ruled 2026-09-04 — mixed stands, position-less: A44 position-less — the episode's source content is bonus chapter -17 「逸れゆく星々の為の前奏曲」 'Prelude for the Straying Stars', which carries NO mainline number: it is printed at the back of tankobon 15 behind ch 130 (en-WP's volume list prints it as the volume's last entry; bleach.fandom's volume page carries its full summary and names Episode 46 as its only adaptation; AFG's chapter column prints '-17' on row 046). That is the negative gaiden space, outside the series' 1-479 line — the same treatment already ruled for the Turn Back the Pendulum eps 206-212 ('CANON but negative chapter numbering outsi",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/bleach-w16.json', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'heavens-lost-property',
    ruleId: 'A44',
    value: [24],
    reason:
      "Batch 20 wave 16 (T28's sliver clause; verified R24), Sean ruled 2026-09-04 — mixed stands, position-less: A44 position-less. The episode's source content is two UNNUMBERED 番外編 — 「北風と太陽」 UMA chapter (vol 4) and 「北風と太陽」 UMA Chapter 2 (vol 7) — which carry no mainline chapter number and therefore no position; the rest of the episode has no identified manga counterpart. The segments are significant (they ARE the episode's A-part, adapted in full and nowhere else), so the row is not filler — mixed stands — but it takes no anchor. Delivered as a side_story annotation naming both extras (the Dai convention: unnumbered extras are facts, never numbers).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/heavens-lost-property-w16.json', 'scripts/ingest/research/batch20/verify/w16-anchors.md'],
  },
  {
    seriesId: 'rosario-vampire',
    ruleId: 'A44',
    value: [14],
    reason:
      "T26 THE CHAIN / I41 (Sean ruled 2026-09-04): ep 14 adapts Rosario + Vampire Season II ch 1 + 3 (the sequel manga on the chain) inside an original plot — mixed, but the material lives in another work's chapter space, so the row has no position in Season I's instrument (A12: a far-forward beat never sets the position); the display carries the previous position forward. `chain_source`{Season II: ch 1, 3} is the record.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/rosario-vampire-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md'],
  },
  // ---- batch 21 wave 2 (2026-09-03; Sean ruled) — AFG's red class on rows that adapt UNNUMBERED chapters (its column
  // cannot hold them): canon/mixed rows whose source share has no mainline chapter number — position-less, the
  // side_story annotation carries the fact. Under the amended A44 the basis is 'no chapter number', never 'behind'.
  {
    seriesId: 'beelzebub',
    ruleId: 'A44',
    value: [49],
    reason:
      "Batch 21 wave 2, Sean ruled 2026-09-03: ep 49 (the New Year's special) adapts the UNNUMBERED extra chapter 「ベルベル☆西遊記〜天竺までぶっとばせ!!〜」 printed inside tankobon vol 10 plus the Beelzebub light novel 『大長編べるぜバブ ベルベル☆西遊記 魔王、孫悟空になる』 (side_source) — no mainline chapter number exists for either; the row is CANON as stored (AFL confirmed) and takes no position. AFG prints filler because its column cannot hold an unnumbered chapter.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/out/beelzebub-w2.json', 'scripts/ingest/research/batch21/WAVE2-RECOVERY.md'],
  },
  {
    seriesId: 'soul-eater',
    ruleId: 'A44',
    value: [32],
    reason:
      "Batch 21 wave 2, Sean ruled 2026-09-03: ep 32 adapts Ohkubo's UNNUMBERED bonus chapter 「聖剣伝説」 ('Legend of the Holy Sword', 31 pages, printed at the back of tankobon vol 9) end to end — CANON as stored, no chapter number it could hold; side_story carries the fact. AFG's red class is its column's blindness to unnumbered chapters, not a filler claim.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/out/soul-eater-w2.json', 'scripts/ingest/research/batch21/WAVE2-RECOVERY.md'],
  },
  {
    seriesId: 'bleach',
    ruleId: 'A44',
    value: [109, 227],
    reason:
      "Batch 21 wave 2, Sean ruled 2026-09-03 (joins the wave-16 entry for ep 46 — the map UNIONS entries per series): ep 109 (MIXED as stored) adapts the unnumbered prologue chapters 「0.side-A the sand」 / 「0.side-B the rotator」 (back of tankobon vol 23), ep 227 (CANON as stored) adapts 「0.8. a wonderful error」 (vol 12) plus 0.side-A / 0.side-B in full — none carries a mainline number, so neither row holds a position; side_story annotations carry the facts.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-03',
    cite: ['scripts/ingest/research/batch21/out/bleach-w2.json', 'scripts/ingest/research/batch21/WAVE2-RECOVERY.md'],
  },
];

export const ANCHOR_SUPPRESSED: Record<string, number[]> = toMergedList(ENTRIES);

/** A44: a row ruled position-less — every anchor writer refuses it; the healer removes standing anchors on it. */
export const isAnchorSuppressed = (seriesId: string, episode: number): boolean => ANCHOR_SUPPRESSED[seriesId]?.includes(episode) ?? false;
