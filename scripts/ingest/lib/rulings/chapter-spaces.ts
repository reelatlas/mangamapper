// RULED CHAPTER SPACES — N35 (Sean 2026-08-28, batch 20 wave 6). AniList's
// chapter/volume totals are the default; when research proves the real
// numbering differs (a propagated scalar nothing instantiates, a franchise
// count), the ruled space WINS at every totals writer (resolve + the chain
// aggregate) and the healer asserts it over standing rows — a re-derive can
// never undo it (P8). Pure (no db import).
import { toRecord, type RulingEntry } from './types';

/** a per-SOURCE chapter-number shift into the ruled space (N35 sourceShifts, 2026-09-02 — the Dai case): a source that numbers
 * an unnumbered extra, or omits a numbered one, runs off the printed numbering from `from` on; `delta` converts its number to ours */
export type ChapterShiftSource = 'wikipedia' | 'mu' | 'afg' | 'fandom';
export type ChapterShift = { source: ChapterShiftSource; from: number; delta: number; note?: string };
export type ChapterSpace = { chapters: number; volumes?: number; sourceShifts?: ChapterShift[] };

export const ENTRIES: RulingEntry<ChapterSpace>[] = [
  {
    seriesId: 'fist-of-the-blue-sky-regenesis',
    ruleId: 'N35',
    value: { chapters: 255 },
    reason:
      "The instrument is the ORIGINAL 蒼天の拳 (the anime's 原作 credit; AniList ADAPTATION edge 100408 → 31148) and its real length is 255 chapters: Coamix's own digital index runs 1-255 complete with zero gaps and nothing above (243 天授の儀 終焉 … 255 第62代北斗神拳伝承者), ja-WP's prose says 全255話. The stored/AniList/MU/fandom 260 is a propagated scalar — no title, TOC or chapter page names 256-260 anywhere (the verifier hunted them; ja-WP's own infobox prints 260 against its prose, which is where the scalar likely came from). Batch 20 wave 6, verified R24.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/fist-of-the-blue-sky-regenesis.json', 'scripts/ingest/research/batch20/verify/fist-of-the-blue-sky-regenesis.md'],
  },
  {
    seriesId: 'to-the-abandoned-sacred-beasts',
    ruleId: 'N35',
    value: { chapters: 87, volumes: 15 },
    reason:
      "The manga's own numbering is 1-87 across 15 volumes: ja-WP 全87話, en-WP's chapter list, MangaDex lastChapter 87.5, and Magazine Pocket's own 第N話 issue titles all agree; the stored total_chapters 120 (AniList) matches no sourceable numbering. Closes flag #681. The full volume-boundary table (v1 1-5 … v15 80-87) is in the wave-6 verdict's structure.notes. Batch 20 wave 6.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/to-the-abandoned-sacred-beasts.json', 'https://ja.wikipedia.org/wiki/かつて神だった獣たちへ', 'https://en.wikipedia.org/wiki/To_the_Abandoned_Sacred_Beasts'],
  },
  {
    seriesId: 'soul-eater-not',
    ruleId: 'N35',
    value: { chapters: 42 },
    reason:
      "The manga's last magazine chapter is 42 (souleater.fandom chapter pages; MangaDex lastChapter 42; the finale adapts 40-42); the stored 41 is AniList's unsourced total that no per-chapter source reproduces. The JP tankobon / Yen Press numbering is a THIRD space (31, via the 35+36 merge) — our instrument stays the magazine numbering the anchors use. Batch 20 wave 7.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/soul-eater-not.json'],
  },
  {
    seriesId: 'orange',
    ruleId: 'N35',
    value: { chapters: 22, volumes: 5 },
    reason:
      "The main story is 22 chapters (LETTER 1-21 + LAST LETTER) in 5 tankobon (ja-WP 話数=全22話（本編）; Futabasha's own site dates 第21話 and the 最終回; MU '5 Volumes (Complete)'). The stored 39/7 is AniList's unit count of the whole 7-volume ACTION COMICS line (mainline + numberless 番外編 volumes) that nobody reproduces; the side stories (-未来- etc., adapted by the 2016 FILM) are outside our instrument. Batch 20 wave 7.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/out/orange.json'],
  },
  {
    seriesId: 'don-t-toy-with-me-miss-nagatoro',
    ruleId: 'N35',
    value: { chapters: 154, volumes: 20 },
    reason:
      "Batch 20 wave 9, Sean ruled 2026-09-02: the mainline ceiling is 154 — MU latest_chapter 154 + its own '154 Chapters + 26 Bonus + 6 Side Story', MangaDex lastChapter 154 / lastVolume 20, exactly 154 fandom 'Chapter N' pages beside 51 extras pages, Kodansha's vol-6 目次 validating the numbering. The stored 189 is a UNIT count that matches no source's arithmetic (MU's own unit total is 186). The S1 anchor (46 v6) and continue (47) sit in this space.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/don-t-toy-with-me-miss-nagatoro.json'],
  },
  {
    seriesId: 'cells-at-work-code-black',
    ruleId: 'N35',
    value: { chapters: 48, volumes: 8 },
    reason:
      "Batch 20 wave 9 (verified R24), Sean ruled 2026-09-02: 48 is the mainline ceiling (ja-WP 全48話, MU latest_chapter 48, MangaDex, the fandom's chapter pages; vol 8 = 42-48 on Kodansha's 初出); AniList's 50 = 48 + the two-part 出張版 unit collected in vols 4/5 — a unit count, not a number ceiling. The finale anchor (11 v3) and the ep-8 frontier (17 v3) sit in this space.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/out/cells-at-work-code-black.json', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'],
  },
  {
    seriesId: 'dragon-quest-the-adventure-of-dai',
    ruleId: 'N35',
    value: {
      chapters: 348,
      volumes: 37,
      sourceShifts: [
        { source: 'wikipedia', from: 123, delta: -1, note: "en-WP's original-release volume list gives the unnumbered vol-13 番外編「勇者アバン」 a slot (its 122) — every list number ≥ 123 is printed number + 1" },
        { source: 'mu', from: 123, delta: -1, note: "MangaUpdates counts the same 349 units (its pin 'Vol 37, Chap 349' = printed 第348話)" },
        { source: 'afg', from: 123, delta: -1, note: 'AniList / aggregator space = the 349-slot list' },
      ],
    },
    reason:
      "Batch 20 wave 13 (verified R24 ×2), Sean ruled 2026-09-02: the catalog follows the PRINTED chapter numbering — the tankōbon number the 348 story chapters contiguously (ja-WP 全343話 + the 5 読切 = 348; vol 14 opens 第122話 決勝戦の異変, vol 37 ends 第348話 さらば!!!愛する地上よ; the fandom's own side-story page navigates 'previous: chapter 121 (tankōbon), next: chapter 122 (tankōbon)'). The stored 349 was en-WP's list construction (adopted by AniList, MangaUpdates and MangaDex's scanlation numbering): it gives the unnumbered 番外編「勇者アバン」 printed at the back of vol 13 its own slot, so every list number ≥ 123 is the printed number + 1 — the same class as orange 39 → 22 and regenesis 260 → 255 (a unit count, not the reading edition). Sean: 'this catalog's job is follow-along in the source, not matching a wiki TOC'. THE UNNUMBERED CHAPTERS ARE STILL FACTS: the 番外編「勇者アバン」 (back of vol 13; adapted by anime ep 61 out of order) and the five 読切 one-shots carry NO mainline number and are recorded as `side_story` annotations naming them when an episode adapts them — never numbered, never counted (Sean 2026-09-02: note them so the UI can represent them later). THE FANDOM (dragonquest.fandom) NEEDS NO SHIFT through at least ep 97: wave 13's inference that it numbers vol 22's extra as its 207 (so its ≥ 208 = printed + 1) was REFUTED by wave 14 sub-block B — the fandom's per-episode field is the printed number (ep 62 opens on 破邪の洞窟 = list 222 = printed 221 = the fandom's 221; the title test holds on 20+ episodes); it gains +1 only near the finale (its ep-100 field ends at 349), located by wave 14 G. The volume table is re-based to the printed space (v13 = 114-121, v14 = 122-131 … v37 = 341-348); the wikipedia backfill, the MU pin writer and the AFG anchor writer convert through sourceShifts; the census's anchor_beyond_chapter_space guards the ceiling.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-02',
    cite: ['scripts/ingest/research/batch20/verify/dragon-quest-the-adventure-of-dai-w13abc.md', 'scripts/ingest/research/batch20/verify/dragon-quest-the-adventure-of-dai-w13defg.md', 'scripts/ingest/research/batch20/WAVE13-RECOVERY.md', 'https://ja.wikipedia.org/wiki/DRAGON_QUEST_-ダイの大冒険-'],
  },
];

export const CHAPTER_SPACE_OVERRIDES: Record<string, ChapterSpace> = toRecord(ENTRIES);

/** the totals a writer stores: the ruled space wins over the derived values */
export const ruledChapterSpace = (seriesId: string, totals: { total_chapters: number | null; total_volumes: number | null }) => {
  const r = CHAPTER_SPACE_OVERRIDES[seriesId];
  if (!r) return totals;
  return { total_chapters: r.chapters, total_volumes: r.volumes ?? totals.total_volumes };
};

/** N35 sourceShifts: convert a chapter number a SOURCE printed into the ruled (printed) space; identity when no shift is ruled or below `from` */
export type ChapterRole = 'end' | 'start';
/**
 * A source's chapter number → the ruled (printed) space. A NEGATIVE shift removes list slots — the numbers
 * [from + delta, from − 1] name entries the printed space does not number (the Dai 番外編 at list 122). A number
 * ON a removed slot has no printed twin: as an END (a frontier, a volume's last entry, an anchor's END — the
 * default) it resolves to the last printed chapter before the slot; as a START (a volume's first entry, an
 * anchor's START, a continue) to the next printed chapter after it. Everything past the window shifts by delta.
 */
export const toRuledChapter = (seriesId: string, source: ChapterShiftSource, chapter: number | null | undefined, role: ChapterRole = 'end'): number | null => {
  if (chapter == null || !Number.isFinite(chapter)) return chapter ?? null;
  const shifts = CHAPTER_SPACE_OVERRIDES[seriesId]?.sourceShifts?.filter((x) => x.source === source) ?? [];
  let out = chapter;
  for (const sh of shifts) {
    if (sh.delta < 0 && chapter >= sh.from + sh.delta && chapter < sh.from) { out = role === 'end' ? sh.from + sh.delta - 1 : sh.from + sh.delta; continue; }
    if (chapter >= sh.from) out += sh.delta;
  }
  return out;
};
/** the same, keyed by the manga's AniList id (the volumes backfill iterates manga, not series) */
export const seriesIdsForManga = (mangaAnilistId: number, seriesRows: { id: string; manga_anilist_id: number | null }[]): string[] => seriesRows.filter((r) => r.manga_anilist_id === mangaAnilistId).map((r) => r.id);
