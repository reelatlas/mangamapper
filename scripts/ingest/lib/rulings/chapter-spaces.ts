// RULED CHAPTER SPACES — N35 (Sean 2026-08-28, batch 20 wave 6). AniList's
// chapter/volume totals are the default; when research proves the real
// numbering differs (a propagated scalar nothing instantiates, a franchise
// count), the ruled space WINS at every totals writer (resolve + the chain
// aggregate) and the healer asserts it over standing rows — a re-derive can
// never undo it (P8). Pure (no db import).
import { toRecord, type RulingEntry } from './types';

export type ChapterSpace = { chapters: number; volumes?: number };

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
];

export const CHAPTER_SPACE_OVERRIDES: Record<string, ChapterSpace> = toRecord(ENTRIES);

/** the totals a writer stores: the ruled space wins over the derived values */
export const ruledChapterSpace = (seriesId: string, totals: { total_chapters: number | null; total_volumes: number | null }) => {
  const r = CHAPTER_SPACE_OVERRIDES[seriesId];
  if (!r) return totals;
  return { total_chapters: r.chapters, total_volumes: r.volumes ?? totals.total_volumes };
};
