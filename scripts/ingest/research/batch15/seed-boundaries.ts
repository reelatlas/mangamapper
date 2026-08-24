// Batch 15 boundary seeds (Dragon Ball research-rows precedent): two manga
// whose Wikipedia chapter lists are SHARED franchise pages that
// volumes-backfill correctly refuses to parse (repeated/backward volumes):
//   - Tokyo Ghoul:re (85611): stored 'wikipedia' rows were a mis-scrape of
//     the combined Tokyo Ghoul list (v2: 10-19 …). True table verified by the
//     batch-15 agent on Wikipedia + tokyoghoul.fandom chapter infoboxes
//     agreeing on every sampled boundary; stored anchors already match it.
//   - Cardcaptor Sakura: Clear Card (87296): had no rows (split series
//     2026-08-24); table from Wikipedia's Clear Card chapter list, fandom
//     chapter pages agreeing (ch 39 = v8, ch 46 = v10).
// Full-replace per manga, source 'research'. Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch15/seed-boundaries.ts
import { db } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/db';

const SEEDS: { mangaId: number; cite: string; vols: [number, number, number][] }[] = [
  {
    mangaId: 85611, // Tokyo Ghoul:re — 16 vols, chs 1-179 standard numbering (v4 opens on omake 31.5)
    cite: 'batch15 research: en.wikipedia List_of_Tokyo_Ghoul_chapters (:re section) + tokyoghoul.fandom |vol= fields (see out/tokyo-ghoul-re.json)',
    vols: [
      [1, 1, 9], [2, 10, 20], [3, 21, 31], [4, 31.5, 41], [5, 42, 52], [6, 53, 63], [7, 64, 75], [8, 76, 86],
      [9, 87, 98], [10, 99, 110], [11, 111, 122], [12, 123, 132], [13, 133, 144], [14, 145, 154], [15, 155, 164], [16, 165, 179],
    ],
  },
  {
    mangaId: 87296, // Cardcaptor Sakura: Clear Card — 16 vols, chs 1-80
    cite: 'batch15 research: en.wikipedia Clear Card chapter list + ccsakura fandom chapter pages (see out/cardcaptor-sakura-clear-card.json)',
    vols: [
      [1, 1, 4], [2, 5, 8], [3, 9, 13], [4, 14, 19], [5, 20, 24], [6, 25, 29], [7, 30, 34], [8, 35, 39],
      [9, 40, 44], [10, 45, 49], [11, 50, 54], [12, 55, 59], [13, 60, 65], [14, 66, 70], [15, 71, 75], [16, 76, 80],
    ],
  },
];

async function main() {
  for (const s of SEEDS) {
    const { error: delErr } = await db.from('volume_boundaries').delete().eq('manga_anilist_id', s.mangaId);
    if (delErr) throw new Error(`delete ${s.mangaId}: ${delErr.message}`);
    const rows = s.vols.map(([volume, chapter_start, chapter_end]) => ({
      manga_anilist_id: s.mangaId, volume, chapter_start, chapter_end, source: 'research', source_page: s.cite.slice(0, 200),
    }));
    const { error } = await db.from('volume_boundaries').insert(rows);
    if (error) throw new Error(`insert ${s.mangaId}: ${error.message}`);
    console.log(`seeded ${s.mangaId}: ${rows.length} research boundary rows`);
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
