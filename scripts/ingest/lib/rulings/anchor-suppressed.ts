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
import { toRecord, type RulingEntry } from './types';

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
    value: [167, 168],
    reason:
      'Play never-adapted Dream-arc material (Act 38 tail, Act 44 core, the Eternal debut of Acts 48-49) — mixed — but those Acts sit BEHIND ep 166\'s stored Act 49: an anchor would run the position backwards. Zone-acknowledged; position-less by ruling.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
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
      'Mixed rows (the ch 50-53 outline; ch 42-43 and ch 56 beats) inside the anime-original ending: an end-chapter of 53 would skip ch 39/44/45/47-50 (never adapted) and ep 21 reaches back to ch 42-43. The anchor line stops at ep 19 (afg-continua 36). Position-less by ruling.',
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
];

export const ANCHOR_SUPPRESSED: Record<string, number[]> = toRecord(ENTRIES);

/** A44: a row ruled position-less — every anchor writer refuses it; the healer removes standing anchors on it. */
export const isAnchorSuppressed = (seriesId: string, episode: number): boolean => ANCHOR_SUPPRESSED[seriesId]?.includes(episode) ?? false;
