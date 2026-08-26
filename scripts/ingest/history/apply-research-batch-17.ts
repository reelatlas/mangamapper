// Research batch 17 — the GAP TIER batch (roadmap item 2, Sean-approved
// 2026-08-24): the anchor_gap_research class (unanchored canon stretches) +
// the frontier_tail_null class (canon eps past the last anchor). Verdicts are
// DATA FILES in-repo (research/batch17/out/<series>.json — the cited record)
// applied under the §11 batch contract, batch-16 script lineage, with the
// batch-17 deltas:
//   1. ANCHOR DELETIONS (new): a verdict repair with new === null removes a
//      stored anchor entirely. Gap research surfaced a whole CLASS of these —
//      MU coverage pins that state a FRANCHISE/sequel endpoint and landed on a
//      scoped entry (ace-ii ep52 = Season 2's ch 259; yowamushi ep38 = the
//      season-5 franchise end; gantz ep26 = the Gantz:O movie; toriko ep147 =
//      a full volume past the frontier) or on an anime-original finale where
//      A1 forbids an anchor at all. Only via DELETIONS_APPROVED, never silent.
//   2. BOUNDARY_SEEDS (new): research-tier volume_boundaries rows recovered by
//      the agents (YYH v9-13, which our table lacked) or healing corrupt
//      stored rows (rave-master v9/v10 were polluted by omake numbering).
//   3. zone_level_only + annotation_updates + curated REPAIRS_APPROVED behave
//      exactly as in batches 15/16.
// Everything else follows batch 14: anchors upsert end/start/chapters_adapted/
// volume (source 'manual'), sliver-rule + running-order END normalization,
// REPAIR detection vs existing curated values, continue points, type
// corrections only via EPISODE_TYPE_OVERRIDES, flags_for_sean → ONE review
// bookmark per series. Re-runnable (safe to re-run as later verdicts land).
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-17.ts [--dry-run] [seriesId ...]

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, startRun, finishRun, fileFlagOnce } from '../lib/db';
import { EPISODE_TYPE_OVERRIDES } from '../lib/resolve';

const DRY = process.argv.includes('--dry-run');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DIR = join(dirname(fileURLToPath(import.meta.url)), 'research/batch17/out');
// chunk-1 second pass (2026-08-25): supplemental verdicts — A1 triage lanes,
// narrow tasks, and re-research files — live in out2/ as their own cited
// records (multiple verdicts per series are expected; the apply is idempotent
// and per-verdict, so they compose instead of merging by hand)
const DIR2 = join(dirname(fileURLToPath(import.meta.url)), 'research/batch17/out2');
const B = 'research-tier batch 17 (2026-08-24, agent-verified 2+ sources, gap tier)';
const ZMARK = 'zone-acknowledged (batch 17)';
const now = () => new Date().toISOString();

type Anchor = { episode: number; end_chapter: number; start_chapter?: number | null; chapters_adapted?: string | null; volume?: number | null; confidence?: string; note?: string; sources?: string[] };
type Verdict = {
  series_id: string;
  summary?: string;
  anchors?: Anchor[];
  zone_level_only?: { episode: number; zone?: string; best_bound?: string; tried?: string; sources?: string[] }[];
  continue_points?: { episode: number; continue_chapter: number; note?: string }[];
  annotations?: { episodes: number[]; kind: string; chapters?: string | null; note?: string }[];
  annotation_updates?: { episodes: number[]; kind: string; chapters?: string | null; note?: string }[];
  type_corrections?: { episodes: number[]; type: string; note?: string; sources?: string[] }[];
  repairs?: { episode: number; field?: string; old?: unknown; new?: unknown; why?: string; sources?: string[] }[];
  structure?: { notes?: string; order_only?: { anilist_id?: number; title?: string; after_anilist_id?: number; adapts?: string; note?: string }[] };
  flags_for_sean?: string[];
};

// Curated approvals for agent `repairs` on NON-target episodes (target-ep
// corrections flow through the anchor upsert + REPAIR detection like batch
// 14). key = `${sid}#${episode}#${field}`; value = why-approved. A verdict
// repair NOT listed here prints as a report line only — convention-sensitive
// ones go to DECISIONS-FOR-SEAN instead. FILLED AFTER READING EVERY VERDICT.
const REPAIRS_APPROVED = new Map<string, string>([
  // ---- MU franchise/sequel-endpoint conflation (the batch-17 pattern): a MU
  // coverage pin stating a LATER entry's endpoint landed on this scoped entry.
  ['ace-of-the-diamond-act-ii#52#end_chapter', 'stored 259 is Act II SEASON 2 Part 1\'s 2026 endpoint on this finished 52-ep entry; the season ends ch 169 (fandom + MangaShed + WDTALO)'],
  ['ace-of-the-diamond-act-ii#52#volume', 'paired: ch 169 sits in vol 19 (166-174), not vol 30'],
  ['yowamushi-pedal#38#end_chapter', 'stored 544 is the WHOLE-FRANCHISE endpoint (post-season-5 "continue at 544") on this S1-only entry; S1 ends ch 140 (fandom + Wikipedia + Grande Road ep 1 opening at 140-145)'],
  ['yowamushi-pedal#38#volume', 'paired: ch 140 is vol 17 (138-146), not the season-5 franchise volume 63'],
  // ---- finale inflation (Sean's A4 rule: a finale anchors to what it ADAPTS)
  ['sailor-moon-crystal#39#end_chapter', 'A4 finale rule: ep 39 adapts Act 38 only; stored 60 was the manga\'s LAST chapter (Stars 11) filled in as a finale value'],
  ['sailor-moon-crystal#39#volume', 'paired: Act 38 sits in vol 10; v18 is the Stars arc end'],
  ['gintama#369#end_chapter', 'stored 704 counts the Jump GIGA chapters (699-704) that only THE FINAL movie adapts; the semi-final ep 369 adapts L693-696 (fandom fwd+reverse)'],
  // ---- plain wrong values, evidenced
  ['hikaru-no-go#75#end_chapter', 'finale adapts Game 148 (exact episode/chapter title match なつかしい笑顔 + explicit wiki chapter field); stored 166 unsupported'],
  ['hikaru-no-go#75#volume', 'paired: Game 148 closes vol 17 (fandom chapter list + Wikipedia)'],
  ['mashle-magic-and-muscles#24#end_chapter', 'resolves a double-claim: our ep 25 = chs 73-74, so ep 24 cannot also end at 74; wiki E23 = chs 71-72 (numbering offset verified by title+date)'],
  // ---- zatch contested re-research (2026-08-25) resolves the base verdict's own SOFT SPLIT flag:
  ['zatch-bell#120#end_chapter', 'konjikinogash.fandom per-episode fields: ep 120 ends at ch 184, not 185 (ch 185 opens ep 121) — repairs the base verdict\'s soft split (out2/zatch-bell-contested.json)'],
  ['zatch-bell#121#end_chapter', 'paired with ep 120: ep 121 = chs 185-186 ending at 186, not 187 (ch 187 lands at ep 124, anchored by the contested verdict)'],
  // ---- wave 2 (Sean 2026-08-25):
  ['eyeshield-21#37#end_chapter', 'ep 37 cannot end at ch 79: the Death March arc is chs 72-88 ending at ep 36 (ch-88 page reverse-maps to ep 36); anchors the left edge of the wave-2 range (out/eyeshield-21.json)'],
  ['d-gray-man#116#end_chapter', 'Hallow finale adapts chs 206-208 ending 20 pages into 208 (Episode 13 (Hallow) infobox + Chapter 207/208 pages + AFG "resume at 208 p.21"); stored 206 was a floor — ch 206 is the bonus-chapter opening flashback. Row already manual'],
  // ---- chunk 2 wave 1 (Sean's rulings 2026-08-25, verifier-confirmed):
  ['x#20#end_chapter', 'Sean ruled 94 (best-supported estimate): ep 20\'s closing beat (Arashi losing her powers) is vol-18 material per Wikipedia\'s volume summary; 95 would overshoot a beat the prose places later; the exact digit inside 88-95 is an honest boundary-locked estimate like every X anchor'],
  ['x#20#volume', 'paired: the Arashi beat is vol 18 (verifier-confirmed); stored v17 ends before it'],
  ['tokyo-mew-mew#52#end_chapter', 'stored 32 is MangaDex/AniList padded count-space (5 bonus stories); the 27-chapter mainline is the space our stored volume boundaries use, and ep 52 adapts ch 27 "A Transfer of Power" beat-for-beat (verifier-confirmed via live APIs)'],
  // ---- batch-12 "as-stored" sweep (2026-08-25, out2/rosario-vampire-asstored.json):
  ['rosario-vampire#11#end_chapter', 'ep 11 is the Keito/newspaper episode = ch 8 "Wish Upon the Moon" (fandom + Wikipedia vol-2 summary); stored 9 came from the wiki\'s episode-page off-by-one from ep 11 onward, inherited by batch 12\'s as-stored blessing'],
  ['rosario-vampire#11#volume', 'paired: ch 8 sits in vol 2, not vol 3'],
  // eps 12/13 rode the same broken chain — VERIFIER-CONFIRMED 2026-08-25
  // (beat-for-beat vs fandom ch 9/10/11 + Wikipedia; ch 11 "Blood" proven
  // never adapted in S1; chain tiles 11→8, 12→9, 13→9-10 with no gaps):
  ['rosario-vampire#12#end_chapter', 'ep 12 is the arrest/interrogation/confession = ch 9 "The Secret" (the ep page\'s own Trivia cross-references the manga arrest); stored ch 10 is entirely the Kuyou fight, none of it in ep 12'],
  ['rosario-vampire#12#start_chapter', 'paired: single-chapter episode, moves with end'],
  ['rosario-vampire#13#end_chapter', 'S1 finale second half IS ch 10 beat-for-beat (fire attack, blood transfusion, yoko form, Gin, finishing kick); stored END 11 inflated — ch 11 "Blood" is never adapted in S1'],
  ['rosario-vampire#13#start_chapter', 'ch 9\'s second movement (the rescue decision) opens ep 13; medium confidence per the verifier, better than the stored 10'],
  // HELD (not applied — see DECISIONS-FOR-SEAN batch 17):
  //   toriko#147 → handled as a DELETION instead (filler row, A1)
  //   shugo-chara#127 → agent kept the stored value deliberately (scene-level
  //   sliver only; AFL disagrees with fandom on the typing)
]);
// Verdict files present on disk but NOT YET CURATED into these maps — the
// in-flight narrow tasks land here mid-apply; each is released by name once
// its decisions are ruled and mapped. A held file is loudly skipped, never
// silently applied.
const HELD_FILES = new Set<string>([
  // (eyeshield released 2026-08-25 — Sean's sign-off: 26 retypes via
  // overrides, ep-88 anchored per the first-time-adaptation precedent)
  // mashle: fully applied, then the §9 fractional renumber shifted rows —
  // these files' episode numbers are the OLD numbering; re-running them
  // would re-create rows/annotations at stale keys (caught 2026-08-25:
  // a re-run resurrected an annotation on nonexistent row 25).
  'mashle-magic-and-muscles.json',
  'mashle-magic-and-muscles-a1.json',
]);
// Stored anchors DELETED by this batch (key `${sid}#${episode}`). Gap research
// proved each one is not a position instrument for THIS entry at all.
const DELETIONS_APPROVED = new Map<string, string>([
  ['gantz#26', 'ep 26 is anime-original filler (A1: filler rows never take anchors) and the stored ch-280/v25 value is the Gantz:O MOVIE endpoint — wrong instrument on a forbidden row'],
  ['chrono-crusade#24', 'ep 24 is the anime-original ending (typed anime-only-canon this batch); the stored ch-30 value is MU\'s SERIES-level bound ("ends at Vol 5 Chap 30, diverges") misplaced onto it — the real ch-30 bound now sits on ep 20'],
  ['fate-kaleid-liner-prisma-illya#42', 'ep 42 is the Oath Under Snow movie adapting 3rei!! chs 29-39 — a DIFFERENT manga; the stored ch-13 pin is a wrong-chapter-space value in the 1st-series numbering (order-only until the entry is split)'],
  ['toriko#147', 'ep 147 is filler (A1) AND the stored ch-263 value overshoots the adaptation frontier by a full volume; the honest terminal anchor is ep 146 → ch 253, which this batch writes'],
  // ---- A1 TRIAGE (Sean's D4 rulings 2026-08-25): all 49 anchor_on_noncanon_row
  // audit hits adjudicated — 45 junk anchors, 4 mistyped rows (those four keep
  // corrected anchors via retype + the verdicts' own anchor upserts: dbz 100,
  // fairy-tail 256, tpn 23, one-piece 737). The junk class below deletes.
  // Root cause (one-piece lane, cross-model verified): AFG's chapter column is
  // a READING-POSITION CONVERSION that plateaus across noncanon rows — the D4
  // writer gate now refuses these at the source; these deletions clear the
  // stored residue. mashle ep 7 is NOT here: the §9 fractional renumber makes
  // its anchor correct in place (see CHUNK1-RECOVERY.md §9).
  // one-piece: 12 slivers preserved as annotations by the verdict; every
  // nulled row bracketed by real canon-neighbour anchors (verified).
  ...(['50', '51', '55', '93', '98', '203', '214', '216', '319', '326', '418', '419', '420', '455', '497', '498', '626', '747'] as const)
    .map((ep) => [`one-piece#${ep}`, 'A1 junk anchor (D4 triage, out2/one-piece-a1.json): AFG reading-position plateau on a noncanon row; slivers recorded as annotations, canon neighbours carry position'] as [string, string]),
  ...(['39', '40', '42', '43', '125', '274'] as const)
    .map((ep) => [`dragon-ball-z#${ep}`, 'A1 junk anchor (D4 triage, out2/dragon-ball-z-a1.json): Kanzenshuu page-level splits prove a sliver graft (ch sliced across the filler block), not an adaptation'] as [string, string]),
  ['dragon-ball-z-kai#101', 'A1 junk anchor (D4 triage, out2/dragon-ball-z-kai-a1.json): batch 15 used an anchor to carry a reader position across a filler episode — the facts re-verified, the instrument was wrong; A1 answers the fork batch 15 itself flagged'],
  ['dragon-ball-z-kai#165', 'A1 junk anchor (D4 triage, out2/dragon-ball-z-kai-a1.json): same batch-15 instrument error as ep 101 — ch 517 adapts to episodes already anchored; filler finale carries no anchor'],
  ...(['14', '90', '123', '131', '134', '156'] as const)
    .map((ep) => [`ranma-1-2#${ep}`, 'A1 junk anchor (D4 triage, out2/ranma-1-2-a1.json, verifier-confirmed 6/6): wiki manga=None + AFL Filler + anime-only categories; stored values are chart-misalignment artifacts (production-vs-aired order zones)'] as [string, string]),
  ['black-clover#3', 'A1 junk anchor (D4 triage, out2/black-clover-a1.json): ch 1 p.1 + ch 2 p.4-5 slivers per the wiki\'s own inline refs — annotation, not position'],
  ['black-clover#68', 'A1 junk anchor (D4 triage, out2/black-clover-a1.json): ch 103 p.14-15 sliver — annotation, not position'],
  ['black-clover#157', 'A1 junk anchor (D4 triage, out2/black-clover-a1.json): batch-5 parked ep 129\'s END on the anime-canon stretch\'s last row as a frontier hold; ch 228\'s reverse mapping lists ep 129 only, which still holds ch 228 (afg) — lossless deletion, pre-checked'],
  ['fairy-tail#246', 'A1 junk anchor (D4 triage, out2/fairy-tail-a1.json): wiki — all scenes anime-only except Mard Geer\'s appearance = ch 380\'s last page; sliver, not position'],
  ['noragami#12', 'A1 junk anchor (D4 triage, out2/noragami-a1.json): the Rabou arc (eps 10-12) is anime-only; ch 11 belongs to ep 9; the honest S1 terminal moves to ep 10 (mixed) END 12 via CURATED_ANCHORS'],
  ['a-certain-scientific-railgun#14', 'A1 junk anchor (D4 triage, out2/a-certain-scientific-railgun-a1.json, verifier-confirmed): batch-12 "as-stored" confirmation-laundering — no chapter titled 特別講習 exists in any edition; ch 17 = "July 25", adapted by ep 2; ep 14 is anime-original by its own wiki page'],
  ['fist-of-the-north-star#109', 'A1 junk anchor (Sean\'s ruling 2026-08-25, out/fist-of-the-north-star.json): ep 109 is a clip show by 3 independent sources; the stored manual 136 was terminal inflation — the honest terminal ep 108 → 136 lands via this verdict\'s anchors with a partial annotation for ch 136\'s closing pages'],
  ['hunter-x-hunter#2', 'A1 junk anchor (chunk-1 first-pass A1 verdict, out2/hunter-x-hunter-a1.json): genuine filler body with a 2-3 page ch-1 graft (Hunterpedia Adapted=Filler + AFL pure-filler set); sliver ruling → annotation only'],
  ['hunter-x-hunter#18', 'A1 junk anchor (out2/hunter-x-hunter-a1.json): filler body with the relocated Kurapika reveal graft (ch 7 p.9-11); sliver ruling → annotation only'],
  ['cardcaptor-sakura#7', 'A1 junk anchor (out/cardcaptor-sakura.json): D4\'s "likeliest mistyped row" hypothesis was WRONG — genuine filler; anchor was junk'],
  ['inuyasha#79', 'A1 junk anchor (out/inuyasha.json): wholly anime-original Jaken comedy episode'],
  ['slam-dunk#92', 'A1 junk anchor (out/slam-dunk.json): pure anime-original beachside comedy episode'],
  // ---- wave 2 (Sean 2026-08-25, verifier-confirmed):
  ['detective-school-q#45', 'MU\'s record is SELF-contradictory (vol 13 cannot contain ch 69 — vol 13 = chs 96-103; verifier-confirmed against MU\'s live API + MangaDex); ep 45 is the anime-original padded finale (ja-WP verbatim) where A1 forbids anchors; coverage lives on the ep-40 anchor (95-96, v13)'],
  ['magic-knight-rayearth#49', 'wrong chapter space (verifier-confirmed): ep 49 is the S2 finale adapting MKR II\'s separately-numbered manga; the stored ch-15 pin is MU\'s MKR-I S1 endpoint ("Vol 3, Chap 15 (1994 S1)") pinned to the wrong episode by the run-end derivation. Deletion stands on the scope leg; NOTE the verdict\'s "15 is not a valid number" leg was REFUTED (serialization numbering runs 1-15) — Sean ruled 15, total_chapters stays 15'],
  ['project-arms#53', '"episode 53" is a PS2 VIDEO GAME animefillerlist absorbed as a row (air date 2002-03-28 sits BEFORE ep 52\'s 03-30 — the giveaway); its ch-205/v19 mu anchor is MangaUpdates\' series-level anime.end, not an episode record. The row itself is deleted by apply-rulings-20260825b (durability: the row is typed mixed, so the anchor alone would be re-derived); ch 205 lands on ep 50 by content evidence'],
]);
// Curated anchors this batch AUTHORS (not proposed as a verdict anchors row —
// the evidence lives in the named verdict, the decision is Sean's). Applied
// exactly like verdict anchors (source manual, batch note).
const CURATED_ANCHORS: { sid: string; anchor: Anchor; why: string }[] = [
  {
    sid: 'zatch-bell',
    anchor: { episode: 51, end_chapter: 22, start_chapter: 22, chapters_adapted: '22 (Germany half — Brago vs Furigaro; first and only adaptation, held back 41 episodes from the S1 Germany arc)', volume: 3, confidence: 'high', note: "Sean's C3 ruling 2026-08-25: the row truthfully shows what it adapts (ch 22, first-time); coverage/continue stay at parity (everything through ch 98/99 already covered — resume ch 100 with ep 52). The reorder is explained by this row's graft/divergence annotations.", sources: ['https://konjikinogash.fandom.com', 'https://en.wikipedia.org/wiki/List_of_Zatch_Bell!_episodes'] },
    why: 'evidence in out2/zatch-bell-contested.json (withheld there pending Sean; ruled 2026-08-25: anchor + annotation, continue via parity)',
  },
  {
    sid: 'zatch-bell',
    anchor: { episode: 103, end_chapter: 173, start_chapter: 173, chapters_adapted: '173 (opening beat only — partial)', volume: 19, confidence: 'medium', note: "Sean's C3 ruling 2026-08-25: first-time partial adaptation anchors truthfully; the anime backfills chs 164-168 across eps 104-107, so continue = 164 (the coming block's chronological start), matching the stored eps 102/104 continues.", sources: ['https://konjikinogash.fandom.com', 'https://en.wikipedia.org/wiki/List_of_Zatch_Bell!_episodes'] },
    why: 'evidence in out2/zatch-bell-contested.json (withheld there pending Sean; ruled 2026-08-25: anchor + partial annotation, continue 164)',
  },
  {
    sid: 'magic-knight-rayearth',
    anchor: { episode: 20, end_chapter: 15, start_chapter: null, chapters_adapted: '11-15 (vol 3)', volume: 3, confidence: 'high', note: "Sean's numbering ruling 2026-08-25: MKR I runs chs 1-15 in SERIALIZATION numbering (Nakayoshi issue-by-issue record, date math, MU's own Vol 3 Chap 15, pt-br MangaDex — verifier-confirmed); the digital storefront's '...5b...14' labels are a re-cut artifact. S1 finale ends the manga at ch 15.", sources: ['https://shidouhikaru15.wordpress.com/2021/08/12/rayearth-in-nakayoshi-magazine/', 'https://en.wikipedia.org/wiki/List_of_Magic_Knight_Rayearth_episodes'] },
    why: 'overrides the verdict\'s END 14 (built on the refuted re-cut numbering); the verdict\'s own boundary evidence (v3 → eps 10-20) is unchanged',
  },
  {
    sid: 'trigun',
    anchor: { episode: 9, end_chapter: 18, start_chapter: 18, chapters_adapted: '18-19 (bus sequence only)', volume: 3, confidence: 'high', note: "Sean's ruling 2026-08-25 (the zatch-51 first-time-adaptation precedent): Wolfwood's manga introduction (ch 18 into ch 19's opening) is pulled ~9 chapters forward to ep 9 — the row anchors truthfully at what it adapts; the rearranged annotation + parity continue carry the reorder. Both wikis agree on the mapping (the verdict withheld on position-honesty grounds A4 already covers).", sources: ['https://trigun.fandom.com', 'https://en.wikipedia.org/wiki/Trigun'] },
    why: 'evidence in out/trigun.json (flag: withheld by judgement, not lack of evidence; alternative form spelled out there — Sean ruled to anchor)',
  },
  {
    sid: 'noragami',
    anchor: { episode: 10, end_chapter: 12, start_chapter: 9, chapters_adapted: '9 (part), 12 (part)', volume: null, confidence: 'high', note: 'honest S1 terminal (Sean 2026-08-25): ep 10 is the last episode with manga content (parts of chs 9 and 12) before the anime-only Rabou arc closes the season; replaces the deleted junk ep-12 anchor per A4 (anchor = what the episode adapts; coverage carries continue-read)', sources: ['https://noragami.fandom.com/wiki/Rabou_Arc'] },
    why: 'evidence in out2/noragami-a1.json flags; DB pre-check confirmed ep 10 typed mixed and previously anchorless',
  },
];
// Curated continue points (Sean's C3 regime rule 2026-08-25): when the anime
// is KNOWN to cover skipped material in later episodes, continue points at
// the skip (parity) and the note tells the reader which already-covered
// chapter to skip on arrival; when not known, continue = furthest-covered+1
// with the skip range annotated. Applied after the anchor pass.
const CURATED_CONTINUES: { sid: string; episode: number; continue_chapter: number; kind: string; note: string }[] = [
  {
    sid: 'trigun', episode: 9, continue_chapter: 13, kind: 'parity',
    note: "Sean's C3 ruling: ep 9's ch 18-19 is a forward graft; the anime covers chs 10-15 at eps 12/14 — continue in step with the anime, and skip the already-seen bus sequence when you reach ch 18.",
  },
  {
    sid: 'welcome-to-demon-school-iruma-kun', episode: 63, continue_chapter: 143, kind: 'parity',
    note: "Sean's C3 ruling 2026-08-25: ep 63 adapts 142 + 145 (forward graft); the anime covers 143-144 next (ep 64), so continue from 143 — and skip ch 145 when you reach it (already covered by this episode) unless re-reading.",
  },
  {
    sid: 'zatch-bell', episode: 103, continue_chapter: 164, kind: 'parity',
    note: "Sean's C3 ruling 2026-08-25: eps 104-107 backfill chs 164-168 (scrambled); continue from 164, the coming block's chronological start — ch 173's opening beat seen here re-arrives at ep 108+.",
  },
  {
    sid: 'zatch-bell', episode: 51, continue_chapter: 100, kind: 'parity',
    note: "Sean's C3 ruling 2026-08-25: ch 22 here is a held-back first-time adaptation inside fully-covered territory (coverage through 99); resume at 100 with ep 52.",
  },
];
// Stored episode_annotations DELETED by this batch (key `${sid}#${episode}#${kind}`):
// a verdict proved the annotation itself misidentifies the content.
const ANNOTATION_DELETIONS = new Map<string, string>([
  ['rurouni-kenshin#95#side_story', 'rows 95-98 are the Trust & Betrayal OVA acts adapting mainline Acts 165-179 (titles/kanji/air dates match AFL + en-WP OVA table) — the "pilot one-shots" side_story annotation was a misidentification, deleted not superseded (out2/rurouni-kenshin-tb.json)'],
  ['rurouni-kenshin#96#side_story', 'same misidentification as ep 95 — T&B act 2 adapts Acts 168-170'],
  ['rurouni-kenshin#97#side_story', 'same misidentification as ep 95 — T&B act 3 adapts Acts 172-174'],
  ['rurouni-kenshin#98#side_story', 'same misidentification as ep 95 — T&B act 4 adapts Acts 175-179'],
]);
// Research-tier volume_boundaries recovered/healed by the agents. full = the
// rows replace every stored row for that manga; else upsert by volume.
const BOUNDARY_SEEDS: { sid: string; why: string; full?: boolean; rows: { volume: number; chapter_start: number; chapter_end: number | null }[] }[] = [
  {
    sid: 'yu-yu-hakusho-ghostfiles',
    why: 'our table had NO boundaries for this manga; recovered in fandom/JP numbering (the space our anchors use — en-WP runs +1 from vol 8) with fandom chapter pages and shifted en-WP agreeing exactly',
    rows: [
      { volume: 10, chapter_start: 82, chapter_end: 91 },
      { volume: 11, chapter_start: 92, chapter_end: 100 },
      { volume: 12, chapter_start: 101, chapter_end: 109 },
      { volume: 13, chapter_start: 110, chapter_end: 118 },
    ],
  },
  {
    sid: 'rave-master',
    why: 'stored v9 "65-14" and v10 "15-79" are corrupt (omake chapter numbering 0014/0015 polluted the parse); true v9=65-73, v10=74-79 per Wikipedia chapter list + fandom chapter pages',
    rows: [
      { volume: 9, chapter_start: 65, chapter_end: 73 },
      { volume: 10, chapter_start: 74, chapter_end: 79 },
    ],
  },
  {
    sid: 'sailor-moon-crystal',
    why: 'restores two of the volumes the monotonic-start heal dropped (their parsed starts were the VOLUME NUMBER — v4 "4", v7 "7" — the corruption signature): true v4 = Acts 14-17 and v7 = Acts 25-27 per the crystal verdict\'s volume fields (Wikipedia original-18-volume distribution). Shared manga 30092, so this fixes the 90s entry too; run heal-volume-boundaries after so v3/v6 re-close to 10-13 / 21-24',
    rows: [
      { volume: 4, chapter_start: 14, chapter_end: 17 },
      { volume: 7, chapter_start: 25, chapter_end: 27 },
    ],
  },
];
// wave-2 additions (Sean 2026-08-25):
BOUNDARY_SEEDS.push(
  {
    sid: 'project-arms', full: true,
    why: 'stored table was EMPTY; rebuilt from Shogakukan per-volume TOCs (Kinokuniya 出版社内容情報) for 19/22 volumes + MangaDex chapter feed for all 22, zero mismatches (verifier-confirmed; v7=12 chapters is the load-bearing count)',
    rows: [
      { volume: 1, chapter_start: 1, chapter_end: 10 }, { volume: 2, chapter_start: 11, chapter_end: 21 }, { volume: 3, chapter_start: 22, chapter_end: 32 },
      { volume: 4, chapter_start: 33, chapter_end: 43 }, { volume: 5, chapter_start: 44, chapter_end: 54 }, { volume: 6, chapter_start: 55, chapter_end: 65 },
      { volume: 7, chapter_start: 66, chapter_end: 77 }, { volume: 8, chapter_start: 78, chapter_end: 88 }, { volume: 9, chapter_start: 89, chapter_end: 99 },
      { volume: 10, chapter_start: 100, chapter_end: 110 }, { volume: 11, chapter_start: 111, chapter_end: 121 }, { volume: 12, chapter_start: 122, chapter_end: 132 },
      { volume: 13, chapter_start: 133, chapter_end: 143 }, { volume: 14, chapter_start: 144, chapter_end: 154 }, { volume: 15, chapter_start: 155, chapter_end: 165 },
      { volume: 16, chapter_start: 166, chapter_end: 176 }, { volume: 17, chapter_start: 177, chapter_end: 187 }, { volume: 18, chapter_start: 188, chapter_end: 198 },
      { volume: 19, chapter_start: 199, chapter_end: 209 }, { volume: 20, chapter_start: 210, chapter_end: 220 }, { volume: 21, chapter_start: 221, chapter_end: 231 },
      { volume: 22, chapter_start: 232, chapter_end: 242 },
    ],
  },
  {
    sid: 'angel-heart',
    why: 'stored v6 "56-77" merges v6+v7 (v7 row missing); Coamix MangaHot + en-WP + fr-WP chapter lists all agree v6 = 56-66, v7 = 67-77 (out/angel-heart.json)',
    rows: [
      { volume: 6, chapter_start: 56, chapter_end: 66 },
      { volume: 7, chapter_start: 67, chapter_end: 77 },
    ],
  },
);
BOUNDARY_SEEDS.push(
  {
    sid: 'magic-knight-rayearth', full: true,
    why: "Sean's 15-ruling (2026-08-25, verifier-corrected): MKR I serialization numbering 1-15 over 3 volumes (Nakayoshi record + tankōbon; the storefront re-cut's 5b/14 labels rejected)",
    rows: [
      { volume: 1, chapter_start: 1, chapter_end: 5 },
      { volume: 2, chapter_start: 6, chapter_end: 10 },
      { volume: 3, chapter_start: 11, chapter_end: 15 },
    ],
  },
  {
    sid: 'emma-a-victorian-romance', full: true,
    why: 'no boundaries stored; mainline 52-chapter space over 7 volumes, agreed exactly by en-WP, ja-WP 目次 and fandom (verifier-confirmed; both final chapters are UNNUMBERED — casual counts read 51, the true count is 52)',
    rows: [
      { volume: 1, chapter_start: 1, chapter_end: 7 }, { volume: 2, chapter_start: 8, chapter_end: 14 }, { volume: 3, chapter_start: 15, chapter_end: 21 },
      { volume: 4, chapter_start: 22, chapter_end: 29 }, { volume: 5, chapter_start: 30, chapter_end: 36 }, { volume: 6, chapter_start: 37, chapter_end: 43 },
      { volume: 7, chapter_start: 44, chapter_end: 52 },
    ],
  },
  {
    sid: 'arms-alchemy', full: true,
    why: 'no boundaries stored; 83-unit space (chs 1-79 WSJ + Finale 80 + Period 81 + Embalming one-shot 82 + After 83) per MangaDex aggregate + en-WP + fandom (verifier-confirmed; flag #699). v10 starts at 81 (80.5 is a bonus, boundaries stay integer)',
    rows: [
      { volume: 1, chapter_start: 1, chapter_end: 7 }, { volume: 2, chapter_start: 8, chapter_end: 17 }, { volume: 3, chapter_start: 18, chapter_end: 26 },
      { volume: 4, chapter_start: 27, chapter_end: 36 }, { volume: 5, chapter_start: 37, chapter_end: 45 }, { volume: 6, chapter_start: 46, chapter_end: 54 },
      { volume: 7, chapter_start: 55, chapter_end: 63 }, { volume: 8, chapter_start: 64, chapter_end: 73 }, { volume: 9, chapter_start: 74, chapter_end: 80 },
      { volume: 10, chapter_start: 81, chapter_end: 83 },
    ],
  },
);
// Anchors excluded from apply pending Sean's ruling (key `${sid}#${episode}`):
const EXCLUDED_ANCHORS = new Map<string, string>([]);
// Curated zone acknowledgements: annotated episodes that legitimately carry NO
// anchor because what they touch is borrowed, concept-level, or a
// character-debut timing difference — Sean's A2/A3 rule (cameo/sliver
// borrowings never set position). The marker moves them out of the open
// research work-list into rearranged_zone_acknowledged, honestly rather than
// silently.
const CURATED_ZONE_ACK: { sid: string; episode: number; bound: string }[] = [
  { sid: 'chrono-crusade', episode: 6, bound: 'Satella is introduced via an anime-original mission; her manga intro (Act 15) is skipped entirely — no chapter adapted, A2 annotation-only' },
  { sid: 'chrono-crusade', episode: 8, bound: 'anime-original story borrowing only the spider/puppet CONCEPT from Acts 19-21 — concept-level, never a position' },
  { sid: 'chrono-crusade', episode: 21, bound: 'Mary Magdalene flashback pulls v6 material (36-41) far out of order inside an otherwise anime-original stretch — graft, not this episode\'s position' },
  { sid: 'sailor-moon', episode: 103, bound: 'character-timing difference (Chibiusa/Chibi Moon deferred vs the manga), not adapted chapters' },
  { sid: 'sailor-moon', episode: 113, bound: 'character-timing difference (Hotaru introduced mid-season vs Infinity\'s opening), not adapted chapters' },
  { sid: 'sailor-moon', episode: 133, bound: 'character-timing difference (Diana\'s debut relocated out of Black Moon), not adapted chapters' },
  { sid: 'shugo-chara', episode: 59, bound: 'partially re-covers ch 22 material already adapted by ep 39 — a re-tread, so ch 22 is not this episode\'s position' },
  { sid: 'shugo-chara', episode: 93, bound: 'Nagihiko\'s Beat Jumper debut (ch 34) grafted early; ch 34 is properly covered by its own later episode' },
];
// Entry-level updates ratified by this batch's research:
const SERIES_UPDATES: { sid: string; patch: Record<string, unknown>; why: string }[] = [
  { sid: 'd-gray-man', patch: { continue_from_chapter: 208 }, why: 'follows the ep-116 repair: Hallow ends 20 pages into ch 208 (AFG: resume at 208 p.21) — 206 was the bonus-chapter floor' },
  { sid: 'tokyo-mew-mew', patch: { total_chapters: 27 }, why: 'Sean 2026-08-25: the mainline space (our boundaries\' space) runs 1-27; AniList\'s 33 counts the 5 bonus stories — annotated on ep 52 so the UI can surface why' },
  { sid: 'project-arms', patch: { total_chapters: 242, total_episodes: 52, aired_episodes: 52 }, why: 'verifier-confirmed: 242 chapters (AniList\'s 241 = the dropped-v10-chapter parse error) and 52 episodes (row 53 is a PS2 game, deleted by apply-rulings-20260825b)' },
];
// Curated annotations (applied like verdict annotation groups; feed the
// order-check ruledEps): zone facts the verdicts evidence but did not file.
const CURATED_ANNOTATIONS: { sid: string; episodes: number[]; kind: string; chapters?: string; note: string }[] = [
  {
    sid: 'magic-knight-rayearth', episodes: [21], kind: 'divergence',
    note: "Sean's D2 ruling 2026-08-25: eps 21-49 adapt Magic Knight Rayearth II — a SEPARATE manga with its own restarted numbering — while this entry's chapter space is MKR I (chs 1-15, fully adapted by ep 20). The 14 canon/mixed rows in 21-49 can never carry anchors in this space without lying; scoped/segmented representation lands with the D2 design pass (specimen #3, with prisma-illya and rosario ep 14).",
  },
  {
    sid: 'x', episodes: [21, 22, 23, 24], kind: 'divergence',
    note: "Sean's ruling 2026-08-25 (the \"only ending\" class): studio-original ending, technically filler — but the manga went on indefinite hiatus so no true ending exists; the community accepts this as the series' only ending and prefers it over the 1996 movie's alternative ending. Asterisked for re-evaluation under the taxonomy-v2 rule (system-evolution.md).",
  },
  {
    sid: 'detective-school-q', episodes: [44, 45], kind: 'divergence',
    note: "Sean's ruling 2026-08-25 (the \"caught up, padded out\" class): the anime outran the still-running manga (ja-WP: 最終回はアニメオリジナルの結末で終了した), so the studio padded an original two-part finale — pure filler, no canon standing. The real continuation (chs 97+, incl. the never-animated 77-83/90-94 blocks) was never adapted; resume reading at ch 97.",
  },
  {
    sid: 'tokyo-mew-mew', episodes: [52], kind: 'side_story',
    note: "Sean 2026-08-25: the manga volumes include 5 bonus stories outside the 27-chapter mainline — Bonus Comic + Afterward (v3), Tokyo Black Cat Girl (v4), Petite Mew Mew (v5, v7), Sleeping Beauty of Berry Forest (v6). AniList/MangaDex count them (33/32); our chapter space and total (27) deliberately exclude them.",
  },
  {
    sid: 'tokyo-mew-mew', episodes: [46, 47], kind: 'divergence',
    note: 'curated correction of the verdict annotation (verifier 2026-08-25): eps 46-47 are the anime-original finale build-up with no continuous chapter counterpart; note ja-WP DOES bold ep 46 as manga-based — the divergence claim rests on en-WP content comparison, and ep 46 may carry a canon beat (unresolved, low stakes).',
  },
  {
    sid: 'arms-alchemy', episodes: [18], kind: 'partial', chapters: '63-64',
    note: "Sean 2026-08-25: ep 18 ends on a graveyard-ambush cliffhanger that plausibly touches ch 63-64's opening (en-WP's final beat; unproven) — END stays 61 under the majority rule; recorded so the fact survives without overclaiming.",
  },
  {
    sid: 'emma-a-victorian-romance', episodes: [19, 20, 21, 22, 23], kind: 'divergence', chapters: '38-46',
    note: "curated span correction (verifier 2026-08-25 — evidence supports 38-46, not 37-46): the O'Donnell kidnapping (chs 38-43, all of vol 6 after ch 37) and the American rescue (chs 44-46) are cut entirely and replaced by an invented Viscount-Campbell railway-financing conspiracy (ja-WP verbatim); interpolating these five episodes would place readers inside the unadapted block.",
  },
  {
    sid: 'sailor-moon', episodes: [73], kind: 'rearranged', chapters: '15-17',
    note: 'curated batch 17: ep 73 condenses the Rubeus abduction motif from chs 15-17 AFTER ep 71 already adapted ch 16 — a genuine step back in the loose R-season adaptation, rendered as stored (the derived-start rule keeps ep 72 at 17 rather than following the jump).',
  },
];
// DOCUMENTED REORDER REGIMES (batch 17). Each verdict PROVES its series adapts
// out of publication order, so below-predecessor anchors are honest data, not
// suspect values. The apply step derives the per-episode `rearranged`
// annotations from the anchors that actually jump (never a blanket claim over
// a season), which is what makes the audit read them as ruled.
// NOTE the shape trap these verdicts exposed: agents write regime spans as
// `episodes: [3, 201]` meaning "3 THROUGH 201", but the annotation contract is
// a LIST of episodes — those groups land on the two boundary episodes only.
// The derived annotations below are what actually covers the span.
const REORDER_REGIMES: Record<string, string> = {
  gintama: 'reorder regime (batch 17): Gintama adapts Lessons far out of publication order across its whole run — S1 shuffles vols 1-34 (ep 25 = L100 pulled ~60 chapters forward), Gintama\' opens on post-timeskip L324-326 then rewinds, Gintama° interleaves the skipped L384-465 backlog, and Porori-hen (329-341) is pure backlog slotted between Rakuyou and Silver Soul',
  'heavens-lost-property': 'reorder regime (batch 17): the anime adapts its short chapters out of order across both seasons, revisiting earlier material after later material',
  'shugo-chara': 'reorder regime (batch 17): Doki-era episodes revisit earlier chapters and our DB episode numbering diverges from broadcast order (rows 73-96 — episode-row audit flagged), so adjacent anchors legitimately step backwards',
  'kenichi-the-mightiest-disciple': 'reorder regime (batch 17): the OAD block (rows 51-61) adapts the Yami/YOMI saga out of manga order — Spark 158-166 before Eclair 145-150, a backfill of TV-skipped 106-109, then Boris 175-180 before 173-174',
  toriko: 'reorder regime (batch 17): ch 173 "Gourmet Santa" is pulled forward to the Christmas episode, and the war chapters 218-232 are regrouped per-fighter across eps 133-140',
  'hunter-x-hunter': 'reorder regime (batch 17): the Yorknew stretch pre-grafts and re-treads chapters (ch 72 p.1-3 into ep 50, the Uvogin fight stretched with overlapping page splits across eps 53-56, ch 83 mainline in ep 56 after its ep-45 pre-graft)',
  'that-time-i-got-reincarnated-as-a-slime': 'reorder regime (batch 17): S1 skips chs 40-42 and 44-45 and jumps to ch 43 + 46-52 for its final four episodes, leaving the skipped block to S2',
  kingdom: 'reorder regime (batch 17): ep 16 grafts the Ryo Fui introduction (chs 96-100) ahead of the campaign arc, and ep 22 skips 74-81 (adapted later in S2)',
  'space-adventure-cobra': 'reorder regime (chunk 2 final wave, verifier-confirmed vs ja-WP character statements + jajanken installment table): six blocks air out of Jump order — ep 2 pulls the Psychogun-secret story (ch 32) forward, the Sword-people block (chs 20-23) lands at eps 20-21, ep 25 (ch 53-54) before ep 26 (ch 51-52)',
  'detective-school-q': 'reorder regime (chunk 2, verifier-confirmed against fandom Story_Arcs + ja-WP case table): ch 34-37 airs before ch 14-30, the Q-vs-A duel block (38-44) is dismantled across eps 5/16/22/24-25, vol 8 is scrambled (62-63→ep 23, 64→ep 32, 60-61→eps 33-34), and ch 95-96 airs at ep 40 before 84-89 at eps 41-43',
  'detective-conan': 'reorder regime (chunk 2, verifier-confirmed): 201 of 631 manga episodes start below the running-max chapter — the adaptation freely interleaves backlog cases; every continue point carries both the parity value and the monotonic alternative (out/detective-conan.json)',
  'eyeshield-21': 'reorder regime (batch 17 wave 2, Sean sign-off): documented relocations — Musashi\'s return (chs 141-142) moved from ep 70 to eps 82-83, ch 131 into ep 87, the 109/110 and 120/121 swaps, ch 99 backfilled at ep 49, ch 100 backfilled at ep 88 (first-time adaptation, anchored per the zatch-51 precedent) — every jump per-episode evidenced in the verdicts',
  'hayate-the-combat-butler': 'reorder regime (batch 17 wave 2): season 1 adapts out of publication order throughout — ep 4 = ch 36 then ep 5 = ch 16, ep 22 = 85 then ep 23 = 70, ep 42 = 129 then ep 43 = 51 (out/hayate-the-combat-butler.json, per-episode evidence)',
  kinnikuman: 'reorder regime (batch 17 wave 2, verifier-confirmed both directions): the Kaiju arc is scrambled (1A=ch3, 1B=ch7, 2A=ch5, 2B=ch4, 3A=ch1, 3B=ch6) with later grafts (9A carries ch 23, 14A carries ch 9); END non-monotone by design in eps 1-3',
  'ranma-1-2': 'reorder regime (batch 17 re-anchor 2026-08-25, out2/ranma-1-2-reanchor.json, title-keyed): the aired order genuinely deviates from manga order in the re-anchored zones — eps 22 (59-62), 26 (43-45), 28 (70-73), 125 (179) legitimately sit below their predecessors; every jump is documented per-episode in the verdict',
  'sket-dance': 'reorder regime (batch 17, Sean\'s END=max ruling 2026-08-25, verifier-confirmed): the adaptation is deliberately NON-LINEAR — near-exhaustive as a set through ch 157 (only 68/106/139/151 skipped) then cherry-picking, with episodes freely pairing early and late chapters (ep 28 = ch 102 alone, ep 74 = 182+196) — verified by fandom forward+reverse links, ja-WP subtitle splices, and en-WP summaries',
  'zatch-bell': 'reorder regime (batch 17): S1 is heavily resequenced (ep 12 → ch 54-55, ep 14/16/19 back-jumps, ep 17 picks up skipped ch 21, ep 39 → 80-82 before eps 42-43 return to 75-79) and S3 resequences again (Ted arc 169-172 at eps 101-102, Koral Q 164-167 backfilled at 105-107) — per the zatchbell.fandom Story_Arcs table + en-WP season summaries',
  // sailor-moon-crystal REMOVED (Sean's post-switch review, 2026-08-24): it
  // never belonged here — a shared-chapter split (Act 27 over eps 27-28) is
  // not a below-predecessor jump — and its presence LAUNDERED a corrupted
  // verdict tail (eps 29-39 written 10 acts low) into a "ruled" annotation
  // instead of letting the order guard trip. The regime mechanism is a
  // waiver of that guard: list a series ONLY when its verdict documents
  // pervasive out-of-publication-order adaptation, and expect every derived
  // annotation to correspond to a jump the verdict itself describes.
};
const REPAIR_FIELDS: Record<string, string> = {
  end_chapter: 'chapter', chapter: 'chapter', start_chapter: 'start_chapter',
  chapters_adapted: 'chapters_adapted', volume: 'volume', continue_chapter: 'continue_chapter',
};

const KINDS = new Set(['divergence', 'partial', 'graft', 'rearranged', 'side_story', 'loose_parallel', 'abridged']);
const TYPES = new Set(['canon', 'mixed', 'filler', 'anime-only-canon']);

function loadVerdicts(): (Verdict & { __file: string })[] {
  const out: (Verdict & { __file: string })[] = [];
  for (const [dir, label] of [[DIR, 'out'], [DIR2, 'out2']] as const) {
    const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
    for (const f of files) {
      if (HELD_FILES.has(f)) { console.log(`[batch-17] HELD (uncurated — awaiting Sean/curation): ${label}/${f}`); continue; }
      const v = JSON.parse(readFileSync(join(dir, f), 'utf8')) as Verdict;
      if (!v.series_id) throw new Error(`${label}/${f}: missing series_id`);
      if (ONLY.length && !ONLY.includes(v.series_id)) continue;
      out.push({ ...v, __file: `${label}/${f}` });
    }
  }
  return out;
}

async function main() {
  const verdicts = loadVerdicts();
  console.log(`[batch-17] ${verdicts.length} verdict file(s)${DRY ? ' — DRY RUN' : ''}`);
  const runId = DRY ? -1 : await startRun('resolve');
  const totals = { anchors: 0, repairs: 0, zoneAck: 0, continues: 0, annotations: 0, retyped: 0, orderOnly: 0, bookmarks: 0, appliedRepairs: 0, deletions: 0, boundaries: 0, skipped: 0 };
  const report: string[] = [];
  try {
    for (const v of verdicts) {
      const sid = v.series_id;
      const { data: s } = await db
        .from('series')
        .select('id, aired_episodes, total_chapters, latest_known_chapters, asterisk_review, manga_anilist_id')
        .eq('id', sid)
        .maybeSingle();
      if (!s) {
        report.push(`!! ${sid}: series not found — verdict skipped`);
        continue;
      }
      const { data: existing } = await db
        .from('chapter_anchors')
        .select('episode, chapter, start_chapter, source, note, chapters_adapted')
        .eq('series_id', sid);
      const byEp = new Map((existing ?? []).map((a) => [a.episode, a]));
      const { data: bounds } = s.manga_anilist_id
        ? await db.from('volume_boundaries').select('volume, chapter_start, chapter_end').eq('manga_anilist_id', s.manga_anilist_id).order('volume')
        : { data: [] as { volume: number; chapter_start: number; chapter_end: number | null }[] };
      const volOf = (ch: number): number | null => {
        const b = (bounds ?? []).find((x) => ch >= x.chapter_start && (x.chapter_end == null || ch <= x.chapter_end));
        return b ? b.volume : null;
      };
      const { data: annRows } = await db.from('episode_annotations').select('episode, kind, note').eq('series_id', sid);
      const ruledEps = new Set<number>((annRows ?? []).filter((a) => a.kind === 'rearranged' || a.kind === 'graft').map((a) => a.episode));
      const allAnnGroups = [...(v.annotations ?? []), ...(v.annotation_updates ?? []), ...CURATED_ANNOTATIONS.filter((c) => c.sid === sid)];
      for (const g of allAnnGroups) if (g.kind === 'rearranged' || g.kind === 'graft') for (const ep of g.episodes ?? []) ruledEps.add(Number(ep));
      const lines: string[] = [`== ${sid}: ${v.anchors?.length ?? 0} anchors, ${v.zone_level_only?.length ?? 0} zone-level, ${v.continue_points?.length ?? 0} continue, ${allAnnGroups.length} annotation groups, ${v.type_corrections?.length ?? 0} type corrections, ${v.repairs?.length ?? 0} repairs`];
      if (v.summary) lines.push(`   ${v.summary.slice(0, 400)}`);

      // ---- anchors (batch-14 lineage: sliver rule + running-order END)
      // CURATED_ANCHORS for this series ride the same path (source manual,
      // same gates) — the curation entry is the ruling record.
      const curatedHere = CURATED_ANCHORS.filter((c) => c.sid === sid);
      for (const c of curatedHere) lines.push(`   CURATED anchor ep${c.anchor.episode}: ${c.why.slice(0, 160)}`);
      const seenEp = new Set<number>();
      // curated anchors FIRST: the curated map decides — a verdict anchor at
      // the same episode is then skipped as the duplicate (rayearth ep 20:
      // Sean's 15-ruling overrides the verdict's re-cut-derived 14)
      for (const a of [...curatedHere.map((c) => c.anchor), ...(v.anchors ?? [])]) {
        const ep = Number(a.episode);
        const excl = EXCLUDED_ANCHORS.get(`${sid}#${ep}`);
        if (excl) { lines.push(`   EXCLUDED ep${ep} (Sean decision pending): ${excl.slice(0, 160)}`); totals.skipped++; continue; }
        let end = Number(a.end_chapter);
        let start = a.start_chapter == null ? null : Number(a.start_chapter);
        // SLIVER RULE (Sean 2026-08-23 s2, MHA ep 170): the episode's START is
        // the first chapter animated — a leading PARTIAL chapter counts unless
        // it is scraps (≤5 pages / sliver/teaser wording). Normalize agent
        // records to the one rule.
        {
          const lead = String(a.chapters_adapted ?? '').split(/,(?![^()]*\))/)[0]?.trim() ?? '';
          const leadNum = Number((lead.match(/^(\d+)(?!\.)/) ?? [])[1]);
          if (start != null && Number.isInteger(leadNum) && leadNum >= 1 && leadNum === start - 1) {
            const pageSpans = [...lead.matchAll(/(\d+)\s*[-–]\s*(\d+)/g)].map((m) => Math.max(0, Number(m[2]) - Number(m[1]) + 1));
            const singles = (lead.match(/(?:p\.?\s*|,\s*)(\d+)(?!\s*[-–]|\d)/g) ?? []).length;
            const pages = pageSpans.reduce((x, y) => x + y, 0) + (pageSpans.length ? 0 : singles);
            const wordy = /half|most|bulk|remainder|rest of|majority|through/i.test(lead);
            const scrappy = /sliver|teaser|cold[- ]open|fragment|panel|scrap|recap|flashback|montage|preview|replay/i.test(lead);
            const substantive = !scrappy && (wordy || pages >= 6);
            if (substantive) {
              lines.push(`   sliver rule: ep${ep} start ${start} → ${leadNum} (leading partial '${lead.slice(0, 48)}' ≈ ${pages || '?'} pages)`);
              start = leadNum;
            }
          }
        }
        // running-order END convention: END is the POSITION instrument — lift
        // to the highest mainline chapter touched when the agent's end sits
        // below the start; the list keeps the real order
        if (start != null && start > end) {
          const nums = String(a.chapters_adapted ?? '').match(/\d+(?:\.\d+)?/g)?.map(Number).filter((n) => Number.isInteger(n)) ?? [];
          const top = Math.max(start, end, ...nums);
          lines.push(`   note: ep${ep} running-order end ${end} lifted to position ${top} (list: ${a.chapters_adapted})`);
          end = top;
        }
        if (!Number.isFinite(ep) || !Number.isFinite(end) || ep < 1 || end < 0) { lines.push(`   !! bad anchor ${JSON.stringify(a).slice(0, 120)}`); totals.skipped++; continue; }
        if (ep > (s.aired_episodes ?? 0)) { lines.push(`   !! ep${ep} > aired ${s.aired_episodes} — skipped`); totals.skipped++; continue; }
        if (start != null && start > end) { lines.push(`   !! ep${ep} start ${start} > end ${end} — skipped`); totals.skipped++; continue; }
        if (seenEp.has(ep)) { lines.push(`   !! ep${ep} duplicated in verdict — later entry skipped`); totals.skipped++; continue; }
        seenEp.add(ep);
        const prev = byEp.get(ep);
        if (prev && prev.source !== 'mu' && !String(prev.note ?? '').includes(B) && (prev.chapter !== end || (prev.start_chapter != null && start != null && prev.start_chapter !== start))) {
          lines.push(`   REPAIR ep${ep}: ${prev.source} ${prev.chapter}${prev.start_chapter != null ? ` [start ${prev.start_chapter}]` : ''} → ${end}${start != null ? ` [start ${start}]` : ''} — ${(a.note ?? '').slice(0, 140)}`);
          totals.repairs++;
        } else if (prev && prev.source === 'mu') {
          lines.push(`   mu pin ep${ep} ${prev.chapter} → manual ${end}${prev.chapter === end ? ' (verified)' : ' (REPLACED)'}`);
        }
        const space = Math.max(s.total_chapters ?? 0, s.latest_known_chapters ?? 0);
        if (space && end > space + 10) lines.push(`   note: ep${ep} → ${end} exceeds current chapter space ${space} — research tier sets the floor; latest_known heals via MU`);
        const note = `${B}: ${a.note ?? ''}${a.confidence ? ` [${a.confidence}]` : ''}${a.sources?.length ? ` <${a.sources.slice(0, 3).join(' ; ')}>` : ''}`.slice(0, 900);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').upsert({
            series_id: sid, episode: ep, chapter: end, start_chapter: start,
            chapters_adapted: a.chapters_adapted ?? null, volume: a.volume ?? null, source: 'manual', note,
          });
          if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
        }
        totals.anchors++;
      }

      // ---- cross-checks: order vs neighbors, volume vs boundaries
      const regimeAnn: { ep: number; note: string; chapters: string }[] = [];
      const merged = new Map<number, { chapter: number; start: number | null }>();
      for (const a of existing ?? []) if (a.source !== 'mu') merged.set(a.episode, { chapter: a.chapter, start: a.start_chapter });
      for (const a of v.anchors ?? []) if (seenEp.has(Number(a.episode))) merged.set(Number(a.episode), { chapter: Number(a.end_chapter), start: a.start_chapter == null ? null : Number(a.start_chapter) });
      const ordered = [...merged.entries()].sort((x, y) => x[0] - y[0]);
      const regime = REORDER_REGIMES[sid];
      for (let i = 1; i < ordered.length; i++) {
        const [ep, cur] = ordered[i];
        const [pep, prev] = ordered[i - 1];
        if (!seenEp.has(ep) && !seenEp.has(pep)) continue;
        if ((cur.chapter < prev.chapter || (cur.start != null && cur.start < prev.chapter - 1)) && !ruledEps.has(ep)) {
          if (regime) {
            // DOCUMENTED REORDER REGIME (batch-17): the verdict proves this
            // series adapts out of publication order, so a below-predecessor
            // anchor is real data, not a suspect value. Annotate exactly the
            // episodes that ACTUALLY jump — derived from the applied anchors,
            // never a blanket claim over a whole season — so the audit reads
            // them as ruled and the UI can surface the reorder.
            regimeAnn.push({ ep, note: `${regime} | this episode's record sits below ep ${pep} (ch ${prev.chapter}) — reorder, rendered as stored`, chapters: `${cur.start ?? cur.chapter}-${cur.chapter} after ${prev.chapter}` });
            ruledEps.add(ep);
          } else {
            lines.push(`   WARN order: ep${ep} → ${cur.chapter}${cur.start != null ? ` [start ${cur.start}]` : ''} sits below ep${pep} → ${prev.chapter} with no rearranged/graft ruling — verify or annotate`);
          }
        }
      }
      if (regimeAnn.length) lines.push(`   reorder regime: ${regimeAnn.length} episode(s) annotated rearranged (derived from the anchors that jump)`);
      for (const a of v.anchors ?? []) {
        if (a.volume == null || !seenEp.has(Number(a.episode))) continue;
        const bv = volOf(Number(a.end_chapter));
        if (bv != null && bv !== Number(a.volume)) lines.push(`   WARN volume: ep${a.episode} → ch ${a.end_chapter} is vol ${bv} by Wikipedia boundaries, verdict says vol ${a.volume}`);
      }

      // ---- continue points (anchor must exist)
      for (const c of v.continue_points ?? []) {
        const ep = Number(c.episode);
        if (!seenEp.has(ep) && !byEp.has(ep)) { lines.push(`   !! continue ep${ep}: no anchor — skipped`); totals.skipped++; continue; }
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').update({ continue_chapter: Number(c.continue_chapter) }).eq('series_id', sid).eq('episode', ep);
          if (error) throw new Error(`continue ${sid} ep${ep}: ${error.message}`);
        }
        totals.continues++;
      }

      // curated continue points (C3): explicit values with kind + note —
      // never overwritten by the parity healer (it only fills absent metadata)
      for (const cc of CURATED_CONTINUES.filter((c) => c.sid === sid)) {
        lines.push(`   CURATED continue ep${cc.episode} → ${cc.continue_chapter} [${cc.kind}]`);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors')
            .update({ continue_chapter: cc.continue_chapter, continue_kind: cc.kind, continue_note: cc.note.slice(0, 600) })
            .eq('series_id', sid).eq('episode', cc.episode);
          if (error) throw new Error(`curated-continue ${sid} ep${cc.episode}: ${error.message}`);
        }
        totals.continues++;
      }

      // ---- annotations + annotation_updates (same upsert; updates supersede)
      let annotated = false;
      for (const g of allAnnGroups) {
        if (!KINDS.has(g.kind)) { lines.push(`   !! annotation kind '${g.kind}' unknown — skipped`); totals.skipped++; continue; }
        for (const ep of g.episodes ?? []) {
          if (!DRY) {
            const { error } = await db.from('episode_annotations').upsert(
              { series_id: sid, episode: Number(ep), kind: g.kind, chapters: g.chapters ?? null, note: `${B}: ${g.note ?? ''}`.slice(0, 600) },
              { onConflict: 'series_id,episode,kind' },
            );
            if (error) throw new Error(`annotate ${sid} ep${ep}: ${error.message}`);
          }
          totals.annotations++;
          annotated = true;
        }
      }
      // derived reorder-regime annotations (see REORDER_REGIMES). Written
      // AFTER the verdict's own groups so a real per-episode annotation always
      // wins the (series_id, episode, kind) key over the derived regime note.
      for (const ra of regimeAnn) {
        const hasOwn = allAnnGroups.some((g) => (g.kind === 'rearranged' || g.kind === 'graft') && (g.episodes ?? []).map(Number).includes(ra.ep));
        if (hasOwn) continue;
        if (!DRY) {
          const { error } = await db.from('episode_annotations').upsert(
            { series_id: sid, episode: ra.ep, kind: 'rearranged', chapters: ra.chapters, note: `${B}: ${ra.note}`.slice(0, 600) },
            { onConflict: 'series_id,episode,kind' },
          );
          if (error) throw new Error(`regime-annotate ${sid} ep${ra.ep}: ${error.message}`);
        }
        totals.annotations++;
        annotated = true;
      }
      if (annotated && !DRY && s.asterisk_review == null) {
        await db.from('series').update({ asterisk_review: 'pending', updated_at: now() }).eq('id', sid);
      }

      // ---- zone_level_only: acknowledge the zone on its annotation rows so
      // the audit separates acknowledged-approximate from unresearched. MUST
      // run AFTER the annotations upsert — an annotation_update on the same
      // (episode, kind) would otherwise overwrite the marker. Re-read the
      // rows so the marker lands on the freshly-written note.
      const { data: annNow } = DRY
        ? { data: annRows }
        : await db.from('episode_annotations').select('episode, kind, note').eq('series_id', sid);
      const zoneEntries = [
        ...(v.zone_level_only ?? []),
        ...CURATED_ZONE_ACK.filter((c) => c.sid === sid).map((c) => ({ episode: c.episode, best_bound: c.bound, zone: undefined, tried: undefined, sources: undefined })),
      ];
      for (const z of zoneEntries) {
        const ep = Number(z.episode);
        const rows = (annNow ?? []).filter((a) => a.episode === ep && (a.kind === 'rearranged' || a.kind === 'graft'));
        const ack = `${ZMARK}: ${z.best_bound ?? z.zone ?? ''}${z.tried ? ` | tried: ${z.tried}` : ''}${z.sources?.length ? ` <${z.sources.slice(0, 2).join(' ; ')}>` : ''}`.slice(0, 500);
        if (!rows.length) {
          // no zone annotation to acknowledge (e.g. a hole ep) — record the
          // bound as a fresh rearranged annotation carrying the marker
          lines.push(`   zone-ack ep${ep} (no existing annotation — creating): ${(z.best_bound ?? z.zone ?? '').slice(0, 100)}`);
          if (!DRY) {
            const { error } = await db.from('episode_annotations').upsert(
              { series_id: sid, episode: ep, kind: 'rearranged', chapters: z.zone ?? null, note: ack },
              { onConflict: 'series_id,episode,kind' },
            );
            if (error) throw new Error(`zone-ack ${sid} ep${ep}: ${error.message}`);
          }
        } else {
          for (const r of rows) {
            if (String(r.note ?? '').includes(ZMARK)) { lines.push(`   zone-ack ep${ep} [${r.kind}] already marked — kept`); continue; }
            lines.push(`   zone-ack ep${ep} [${r.kind}]: ${(z.best_bound ?? '').slice(0, 100)}`);
            if (!DRY) {
              const { error } = await db.from('episode_annotations')
                .update({ note: `${String(r.note ?? '')} | ${ack}`.slice(0, 900) })
                .eq('series_id', sid).eq('episode', ep).eq('kind', r.kind);
              if (error) throw new Error(`zone-ack ${sid} ep${ep}: ${error.message}`);
            }
          }
        }
        totals.zoneAck++;
      }

      // ---- type corrections: applied only when the code map carries them
      for (const t of v.type_corrections ?? []) {
        if (!TYPES.has(t.type)) { lines.push(`   !! type '${t.type}' unknown — skipped`); continue; }
        const map = EPISODE_TYPE_OVERRIDES[sid] ?? {};
        const missing = (t.episodes ?? []).filter((ep) => map[Number(ep)] !== t.type);
        if (missing.length) {
          lines.push(`   TODO type: ${sid} eps ${missing.join(',')} → ${t.type} — add to EPISODE_TYPE_OVERRIDES then re-run (${(t.note ?? '').slice(0, 120)})`);
          continue;
        }
        for (const ep of t.episodes ?? []) {
          if (!DRY) await db.from('episodes').update({ type: t.type }).eq('series_id', sid).eq('number', Number(ep));
          totals.retyped++;
        }
      }

      // ---- anchor DELETIONS (batch-17 delta): a curated removal of a stored
      // anchor that gap research proved is not this entry's instrument at all
      // (MU franchise/sequel endpoints, movie endpoints, anchors on rows A1
      // forbids). Keyed `${sid}#${episode}` in DELETIONS_APPROVED; a verdict
      // repair with new === null that is NOT approved prints only.
      // The CURATED decision drives deletions, not the agent's field shape: a
      // verdict may propose the same removal as `new: null` OR as a value
      // repair we decided to answer with a deletion instead (Toriko ep 147
      // proposed 263 → 253, but the row is filler and A1 forbids the anchor
      // outright — the honest terminal anchor is ep 146).
      for (const [key, why] of DELETIONS_APPROVED) {
        const [dsid, deps] = key.split('#');
        if (dsid !== sid) continue;
        const ep = Number(deps);
        if (!byEp.has(ep)) { lines.push(`   DELETE ep${ep}: already absent (idempotent re-run)`); continue; }
        const prev = byEp.get(ep)!;
        lines.push(`   DELETE anchor ep${ep} (${prev.source} → ch ${prev.chapter}): ${why.slice(0, 150)}`);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', ep);
          if (error) throw new Error(`delete ${sid} ep${ep}: ${error.message}`);
        }
        totals.deletions++;
      }

      // ---- annotation DELETIONS: a verdict proved the stored annotation
      // misidentifies the content (rurouni T&B "pilot one-shots" class) —
      // deleted, never superseded, so the wrong claim cannot resurface.
      for (const [key, why] of ANNOTATION_DELETIONS) {
        const [dsid, deps, dkind] = key.split('#');
        if (dsid !== sid) continue;
        const ep = Number(deps);
        const hit = (annRows ?? []).find((a) => a.episode === ep && a.kind === dkind);
        if (!hit) { lines.push(`   DELETE annotation ep${ep} [${dkind}]: already absent (idempotent re-run)`); continue; }
        lines.push(`   DELETE annotation ep${ep} [${dkind}]: ${why.slice(0, 150)}`);
        if (!DRY) {
          const { error } = await db.from('episode_annotations').delete().eq('series_id', sid).eq('episode', ep).eq('kind', dkind);
          if (error) throw new Error(`ann-delete ${sid} ep${ep}: ${error.message}`);
        }
        totals.deletions++;
      }

      // ---- agent repairs: curated application (REPAIRS_APPROVED), else report
      for (const r of v.repairs ?? []) {
        if (r.new === null) continue; // proposed removals: the deletion pass above rules on them
        const ep = Number(r.episode);
        if (DELETIONS_APPROVED.has(`${sid}#${ep}`)) continue; // answered with a deletion
        const key = `${sid}#${ep}#${r.field ?? ''}`;
        const col = REPAIR_FIELDS[String(r.field ?? '')];
        if (seenEp.has(ep) && (r.field === 'end_chapter' || r.field === 'start_chapter')) {
          lines.push(`   repair ep${ep} (${r.field}) covered by this verdict's own anchor upsert`);
          continue;
        }
        if (REPAIRS_APPROVED.has(key) && col && byEp.has(ep)) {
          const why = REPAIRS_APPROVED.get(key)!;
          lines.push(`   APPLY repair ep${ep}: ${r.field} ${JSON.stringify(r.old)} → ${JSON.stringify(r.new)} — ${why.slice(0, 140)}`);
          if (!DRY) {
            const prev = byEp.get(ep)!;
            const note = `${String(prev.note ?? '')} | REPAIR (${B}): ${r.why ?? why}`.slice(0, 1200);
            // a repaired value is a RESEARCHED value — it must live at the
            // manual tier. Derivation-tier rows (mu/afg/afg-continua) are
            // wipe-and-re-derive by contract: hikaru ep75's 166→148 repair
            // sat on a mu row and the next frontier pass wiped it back to
            // 166 (2026-08-24). Research-tier sources keep their provenance.
            const src = ['mu', 'afg', 'afg-continua'].includes(prev.source) ? 'manual' : prev.source;
            const { error } = await db.from('chapter_anchors').update({ [col]: r.new as never, note, source: src }).eq('series_id', sid).eq('episode', ep);
            if (error) throw new Error(`repair ${sid} ep${ep}: ${error.message}`);
          }
          totals.appliedRepairs++;
        } else {
          lines.push(`   agent-reported repair ep${ep} (NOT auto-applied): ${JSON.stringify(r).slice(0, 200)}`);
        }
      }

      // ---- flags for Sean: ONE review bookmark per series
      const notes = (v.flags_for_sean ?? []).filter((f) => f && f.trim());
      for (const f of notes) lines.push(`   FLAG: ${f.slice(0, 220)}`);
      if (notes.length) {
        if (!DRY) {
          await fileFlagOnce(runId, sid, 'research', 'count_mismatch', {
            kind_of_note: 'sean_review_bookmark',
            note: `batch 17 research notes (${notes.length}; full text: scripts/ingest/research/batch17/${v.__file}): ${notes.map((f, i) => `(${i + 1}) ${f}`).join(' ')}`.slice(0, 1800),
          });
        }
        totals.bookmarks++;
      }
      if (v.structure?.notes) lines.push(`   structure: ${v.structure.notes.slice(0, 300)}`);
      report.push(...lines);
    }

    // ---- entry-level updates ratified by the batch
    for (const u of SERIES_UPDATES) {
      if (ONLY.length && !ONLY.includes(u.sid)) continue;
      report.push(`== series UPDATE ${u.sid}: ${JSON.stringify(u.patch)} — ${u.why.slice(0, 160)}`);
      if (!DRY) {
        const { error } = await db.from('series').update({ ...u.patch, updated_at: now() }).eq('id', u.sid);
        if (error) throw new Error(`series update ${u.sid}: ${error.message}`);
      }
    }

    // ---- research-tier volume boundaries (recovered or healing corrupt rows)
    for (const seed of BOUNDARY_SEEDS) {
      if (ONLY.length && !ONLY.includes(seed.sid)) continue;
      const { data: s } = await db.from('series').select('manga_anilist_id').eq('id', seed.sid).maybeSingle();
      if (!s?.manga_anilist_id) { report.push(`!! boundary seed ${seed.sid}: no manga_anilist_id — skipped`); continue; }
      report.push(`== boundary seed ${seed.sid} (manga ${s.manga_anilist_id}, ${seed.rows.length} rows${seed.full ? ', FULL replace' : ''}): ${seed.why.slice(0, 170)}`);
      if (!DRY) {
        if (seed.full) await db.from('volume_boundaries').delete().eq('manga_anilist_id', s.manga_anilist_id);
        const { error } = await db.from('volume_boundaries').upsert(
          seed.rows.map((r) => ({ manga_anilist_id: s.manga_anilist_id, ...r, source: 'research', source_page: `batch 17: ${seed.why}`.slice(0, 300) })),
          { onConflict: 'manga_anilist_id,volume' },
        );
        if (error) throw new Error(`boundary seed ${seed.sid}: ${error.message}`);
      }
      totals.boundaries += seed.rows.length;
    }

    console.log(report.join('\n'));
    console.log(`\n[batch-17] anchors ${totals.anchors} (repairs-detected ${totals.repairs}), DELETIONS ${totals.deletions}, boundaries ${totals.boundaries}, zone-ack ${totals.zoneAck}, continue ${totals.continues}, annotations ${totals.annotations}, retyped ${totals.retyped}, applied-repairs ${totals.appliedRepairs}, bookmarks ${totals.bookmarks}, skipped ${totals.skipped}${DRY ? ' — nothing written' : ''}`);
    if (!DRY) await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: totals.anchors, flagged: totals.bookmarks }, `research batch 17: ${verdicts.length} series, ${totals.anchors} anchors, ${totals.zoneAck} zone-ack, ${totals.appliedRepairs} applied repairs`);
  } catch (e) {
    if (!DRY) await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
