// Shared anchor synchronization — used by afg-backfill, rederive-anchors,
// and the refresh-afg edge function (single source of truth for the anchor
// write path: monotonicity-filtered derivation, alignment gate, registry,
// flag dismissal, and the volumes-staleness event trigger).

import { deriveAnchors, type AfgPage } from './afg';
import { db, fileFlagOnce } from './db';
import { registerIds } from './resolve';

// New anchors reaching this far past the last known volume boundary mean the
// manga has published new volumes — the EVENT that triggers a volumes
// re-ingest for that manga (validation tier is event-driven, never scheduled).
const VOLUME_STALE_MARGIN = 20;

export async function syncAnchors(
  runId: number,
  seriesId: string,
  afgSlug: string,
  page: Pick<AfgPage, 'episodes'>,
): Promise<{ anchors: number; withheld: boolean }> {
  const anchors = deriveAnchors(page.episodes);
  if (!anchors.length) return { anchors: 0, withheld: false };

  const { data: maxRow } = await db
    .from('episodes')
    .select('number')
    .eq('series_id', seriesId)
    .order('number', { ascending: false })
    .limit(1);
  const ourMax = maxRow?.[0]?.number ?? 0;
  const afgMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
  if (ourMax && Math.abs(afgMax - ourMax) > 12) {
    await fileFlagOnce(runId, afgSlug, 'afg', 'count_mismatch', {
      afgMax,
      ourMax,
      seriesId,
      note: 'AFG numbering misaligned — anchors withheld',
    });
    return { anchors: 0, withheld: true };
  }

  await db.from('chapter_anchors').delete().eq('series_id', seriesId).eq('source', 'afg');
  const rows = anchors.map((a) => ({
    series_id: seriesId,
    episode: a.episode,
    volume: null,
    chapter: a.chapter,
    source: 'afg',
    note: a.arc,
  }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db.from('chapter_anchors').upsert(rows.slice(i, i + 500));
    if (error) throw new Error(`anchors (${seriesId}): ${error.message}`);
  }
  await registerIds(seriesId, { afg: afgSlug });
  await db
    .from('ingest_flags')
    .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
    .eq('series_key', afgSlug)
    .eq('source', 'afg')
    .eq('status', 'open');

  // volumes-staleness event: anchors past the final boundary = new volumes exist
  const { data: series } = await db.from('series').select('manga_anilist_id').eq('id', seriesId).maybeSingle();
  if (series?.manga_anilist_id) {
    const { data: lastBoundary } = await db
      .from('volume_boundaries')
      .select('chapter_start')
      .eq('manga_anilist_id', series.manga_anilist_id)
      .order('volume', { ascending: false })
      .limit(1);
    const lastStart = lastBoundary?.[0]?.chapter_start;
    const maxChapter = Math.max(...rows.map((r) => r.chapter));
    if (lastStart != null && maxChapter > Number(lastStart) + VOLUME_STALE_MARGIN) {
      await fileFlagOnce(runId, `manga:${series.manga_anilist_id}`, 'wikipedia', 'count_mismatch', {
        seriesId,
        maxAnchorChapter: maxChapter,
        lastBoundaryStart: lastStart,
        note: 'anchors passed the last known volume boundary — published volumes likely grew; re-run volumes-backfill for this manga',
      });
    }
  }

  return { anchors: rows.length, withheld: false };
}
