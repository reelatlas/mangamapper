// Volume re-derive over standing anchors (2026-09-03, the anchor_volume_mismatch
// 20): every chapter_anchors row whose END chapter the boundary table covers
// gets volume := the table's volume (lib/volumes.ts#volumeForChapter — the one
// derivation, P2). A disagreement that survives this is a TABLE question
// (wrong edition, a wrong boundary), never an anchor edit. Standard roster.
//   npx tsx --env-file=.env.ingest scripts/ingest/heal-anchor-volumes.ts [--dry-run]
import { db, selectAll, startRun, finishRun } from './lib/db';
import { volumeForChapter, type VolumeBound } from './lib/volumes';

const DRY = process.argv.includes('--dry-run');

async function main() {
  const series = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id');
  const mangaOf = new Map(series.map((s) => [s.id, s.manga_anilist_id]));
  const bounds = await selectAll<VolumeBound & { manga_anilist_id: number }>('volume_boundaries', 'manga_anilist_id, volume, chapter_start, chapter_end');
  const byManga = new Map<number, VolumeBound[]>();
  for (const b of bounds) byManga.set(b.manga_anilist_id, [...(byManga.get(b.manga_anilist_id) ?? []), b]);
  const anchors = await selectAll<{ series_id: string; episode: number; chapter: number; volume: number | null }>('chapter_anchors', 'series_id, episode, chapter, volume');
  const runId = DRY ? 0 : await startRun('resolve');
  let n = 0;
  for (const a of anchors) {
    const manga = mangaOf.get(a.series_id);
    const table = manga ? byManga.get(manga) : undefined;
    if (!table?.length || a.chapter == null) continue;
    const want = volumeForChapter(table, Number(a.chapter));
    if (want == null || want === Number(a.volume)) continue;
    console.log(`  ${a.series_id} ep ${a.episode} (ch ${a.chapter}): v${a.volume ?? '·'} → v${want} (boundary table)`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').update({ volume: want }).eq('series_id', a.series_id).eq('episode', a.episode); if (error) throw new Error(`${a.series_id} ep${a.episode}: ${error.message}`); }
    n++;
  }
  console.log(`[heal-anchor-volumes] ${anchors.length} anchors, ${n} volume(s) re-derived${DRY ? ' — DRY RUN' : ''}`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: anchors.length, unchanged: anchors.length - n, changed: n, flagged: 0 }, `heal-anchor-volumes: ${n} re-derived`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
