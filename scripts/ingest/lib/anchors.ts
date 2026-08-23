// Shared anchor synchronization — used by afg-backfill, rederive-anchors,
// and the refresh-afg edge function (single source of truth for the anchor
// write path: monotonicity-filtered derivation, alignment gate, registry,
// flag dismissal, and the volumes-staleness event trigger).

import { deriveAnchors, type AfgPage, type AfgContinua } from './afg';
import { db, fileFlagOnce } from './db';
import { registerIds } from './resolve';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// AFG continua-manga application (Sean's full-source ruling 2026-08-23):
// a staged continua table becomes an end-frontier anchor (source
// 'afg-continua') + a volume boundary — behind the full gate stack:
// identity guard (heading vs series names — SHY's page carried Kamonohashi
// Ron's heading), self-consistency (continue-1 = end), chapter-space gate,
// episode sanity. PRECEDENCE at the (series, episode) PK: manual/wiki are
// never overwritten (continua cross-CHECKS them, disagreement >1 flags);
// chart-'afg'/mu yield to the curated continua (>2 disagreement flags).
// Boundaries write absent-only; a disagreeing Wikipedia boundary flags —
// sources verify each other in conjunction, none limits another.
// Shared by afg-continua-apply.ts (sweep) and refresh-afg (inline upkeep).
export async function applyContinua(
  runId: number,
  seriesId: string,
  continua: AfgContinua | null | undefined,
): Promise<'applied' | 'withheld' | 'kept_curated' | 'no_data'> {
  if (!continua || continua.endChapter === null) return 'no_data';
  const { data: s } = await db
    .from('series')
    .select('id, title, title_native, aired_episodes, total_chapters, latest_known_chapters, manga_anilist_id, search_text')
    .eq('id', seriesId)
    .maybeSingle();
  if (!s) return 'no_data';

  await db.from('chapter_anchors').delete().eq('series_id', s.id).eq('source', 'afg-continua');

  const heading = continua.heading ? norm(continua.heading) : null;
  const names = norm(`${s.title} ${s.title_native ?? ''} ${s.search_text ?? ''}`);
  if (heading && !names.includes(heading)) {
    await fileFlagOnce(runId, s.id, 'afg', 'parse_integrity', {
      continuaHeading: continua.heading,
      note: 'continua table heading names a DIFFERENT series (AFG template bug class) — data withheld, verify by hand',
    });
    return 'withheld';
  }
  if (continua.continueChapter !== null && continua.continueChapter - 1 !== continua.endChapter) {
    await fileFlagOnce(runId, s.id, 'afg', 'parse_integrity', {
      endChapter: continua.endChapter,
      continueChapter: continua.continueChapter,
      note: 'continua table internally inconsistent (continue-1 ≠ end) — withheld',
    });
    return 'withheld';
  }
  const spaceMax = Math.max(s.total_chapters ?? 0, s.latest_known_chapters ?? 0);
  if (spaceMax > 0 && continua.endChapter > spaceMax + 10) {
    await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
      continuaEndChapter: continua.endChapter,
      spaceMax,
      note: "continua frontier exceeds this entry's chapter space — partial structure or edition mismatch; withheld",
    });
    return 'withheld';
  }
  const ep = continua.endEpisode !== null && continua.endEpisode <= (s.aired_episodes ?? 0)
    ? continua.endEpisode
    : s.aired_episodes;
  if (!ep) return 'no_data';

  const { data: holder } = await db
    .from('chapter_anchors')
    .select('source, chapter')
    .eq('series_id', s.id)
    .eq('episode', ep)
    .maybeSingle();
  const diff = holder ? Math.abs(Number(holder.chapter) - continua.endChapter) : 0;
  if (holder && (holder.source === 'manual' || holder.source === 'wiki')) {
    if (diff > 1) {
      await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
        episode: ep,
        [holder.source]: holder.chapter,
        afgContinua: continua.endChapter,
        note: `continua frontier disagrees with the ${holder.source} anchor at ep ${ep} — cross-check finding, ${holder.source} kept`,
      });
    }
    return 'kept_curated';
  }
  if (holder && diff > 2) {
    await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
      episode: ep,
      [holder.source]: holder.chapter,
      afgContinua: continua.endChapter,
      note: `continua frontier disagrees with the ${holder.source} anchor at ep ${ep} by ${diff} ch — continua (curated) applied, verify`,
    });
  }
  const { error } = await db.from('chapter_anchors').upsert({
    series_id: s.id,
    episode: ep,
    volume: null,
    chapter: continua.endChapter,
    source: 'afg-continua',
    note: `AFG continua table: "${continua.text.slice(0, 180)}"`,
  });
  if (error) throw new Error(`applyContinua(${s.id}): ${error.message}`);

  if (s.manga_anilist_id && continua.continueVolume !== null && continua.volumeStart !== null && continua.volumeEnd !== null) {
    const { data: existing } = await db
      .from('volume_boundaries')
      .select('chapter_start, chapter_end')
      .eq('manga_anilist_id', s.manga_anilist_id)
      .eq('volume', continua.continueVolume)
      .maybeSingle();
    if (!existing) {
      await db.from('volume_boundaries').insert({
        manga_anilist_id: s.manga_anilist_id,
        volume: continua.continueVolume,
        chapter_start: continua.volumeStart,
        chapter_end: continua.volumeEnd,
      });
    } else if (existing.chapter_start !== continua.volumeStart || existing.chapter_end !== continua.volumeEnd) {
      await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
        volume: continua.continueVolume,
        staged: existing,
        afg: { chapter_start: continua.volumeStart, chapter_end: continua.volumeEnd },
        note: 'AFG continua volume boundary disagrees with the staged (Wikipedia) boundary — verify which edition',
      });
    }
  }
  return 'applied';
}

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

  // CHAPTER-SPACE gate (Sean 2026-08-23, the Boruto ch-710 class): an AFG
  // page charted in franchise-continuous chapter numbering produces anchors
  // outside this series' own manga space (Boruto has 81 chapters; AFG's rows
  // said 702-710 — Naruto-space). One out-of-space anchor means the whole
  // page's numbering is suspect: withhold and flag, never partially write.
  // The margin absorbs a frontier slightly ahead of stale totals.
  const { data: chapterSpace } = await db
    .from('series')
    .select('total_chapters, latest_known_chapters')
    .eq('id', seriesId)
    .maybeSingle();
  const spaceMax = Math.max(chapterSpace?.total_chapters ?? 0, chapterSpace?.latest_known_chapters ?? 0);
  const maxAnchorCh = anchors.reduce((m, a) => Math.max(m, a.chapter), 0);
  if (spaceMax > 0 && maxAnchorCh > spaceMax + 10) {
    await fileFlagOnce(runId, afgSlug, 'afg', 'parse_integrity', {
      seriesId,
      maxAnchorCh,
      spaceMax,
      note: 'AFG chapters exceed this series\' own manga space — franchise-continuous numbering suspected; anchors withheld',
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
