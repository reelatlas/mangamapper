// Systematic manga-coverage audit (Sean 2026-08-23: never one-off fixes —
// classify every series' manga-instrument state, apply GENERAL rules, flag
// what no rule can honestly solve). Also applies the MU-frontier rule:
// MangaUpdates' curated anime-coverage field ("Vol 112, Chap 1138 as of EP
// 1168") becomes a real anchor (source 'mu') for series AFG doesn't cover —
// retiring mapping_pending for airing series with staged MU data.
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-manga-coverage.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { applyMuFrontier, crossCheckMangaStatus } from './lib/mu-frontier';

interface MuRaw {
  latest_chapter: number | null;
  anime: { start: string | null; end: string | null } | null;
  status?: string | null;
}

async function main() {
  const runId = await startRun('resolve');
  const classes: Record<string, string[]> = {
    active_anchored: [],
    active_synthesized: [],
    mu_frontier_applied: [],
    stale_anchor_no_frontier: [],
    pending_airing_no_frontier: [],
    pending_finished_unknown_coverage: [],
    no_source: [],
    data_hole_no_manga_link: [],
  };

  try {
    // "anchored" only counts when the frontier is FRESH — a max anchor far
    // behind the run (sparse AFG page: MHA's stops at ep 13 of 170) is a
    // stale picture, and the series still needs a real frontier (MU) or a
    // research flag. Sean 2026-08-24. maxChapter guards MU staleness: an MU
    // pair that adds no chapter progress is the SAME stale frontier.
    const anchorMax = new Map<string, number>();
    const chapterMax = new Map<string, number>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('chapter_anchors').select('series_id, episode, chapter').neq('source', 'mu').range(from, from + 999);
      for (const r of data ?? []) {
        anchorMax.set(r.series_id, Math.max(anchorMax.get(r.series_id) ?? 0, r.episode));
        chapterMax.set(r.series_id, Math.max(chapterMax.get(r.series_id) ?? 0, r.chapter));
      }
      if (!data || data.length < 1000) break;
    }
    const { data: muRows } = await db.from('ingest_mangaupdates').select('manga_anilist_id, raw');
    const muByManga = new Map((muRows ?? []).map((r) => [r.manga_anilist_id, r.raw as MuRaw]));

    const { data: series } = await db
      .from('series')
      .select('id, status, source_type, manga_status, manga_anilist_id, total_chapters, aired_episodes, manga_start_chapter');

    for (const s of series ?? []) {
      const hasSource = s.source_type !== 'original' && s.manga_status !== 'anime_only';
      if (!hasSource) {
        classes.no_source.push(s.id);
        continue;
      }
      if (!s.manga_anilist_id) {
        classes.data_hole_no_manga_link.push(s.id);
        await fileFlagOnce(runId, s.id, 'resolve', 'count_mismatch', {
          note: 'has a manga source_type but no manga link — pickManga found no ADAPTATION edge',
        });
        continue;
      }
      const maxAnchor = anchorMax.get(s.id);

      // MU-frontier rule via the shared lib (scope segment, chapter
      // progress, EP pin only from single-pair text) + the manga-status
      // cross-check (MU vs our AniList-derived manga_status). latest_known
      // self-heals from staged data (chapter-NUMBER space, all manga).
      const mu = muByManga.get(s.manga_anilist_id);
      if (mu) {
        await crossCheckMangaStatus(runId, s.id, s.manga_status, mu);
        if (mu.latest_chapter && mu.latest_chapter > 0 && mu.latest_chapter < 10000) {
          await db
            .from('series')
            .update({ latest_known_chapters: mu.latest_chapter, updated_at: new Date().toISOString() })
            .eq('id', s.id);
        }
      }
      const result = await applyMuFrontier(
        { id: s.id, aired_episodes: s.aired_episodes, total_chapters: s.total_chapters, manga_start_chapter: s.manga_start_chapter },
        mu?.anime?.end ?? null,
        anchorMax.get(s.id),
        chapterMax.get(s.id),
      );
      if (result === 'applied') {
        classes.mu_frontier_applied.push(s.id);
        continue;
      }
      if (result === 'skipped_fresh') {
        classes.active_anchored.push(s.id);
        continue;
      }
      if (maxAnchor !== undefined) {
        // stale anchors + no MU frontier: the card shows a truthful-but-old
        // "as of ep N" — synthesis must NOT override (diverged anime would
        // claim full coverage). Research closes these, never guesses.
        classes.stale_anchor_no_frontier.push(s.id);
        await fileFlagOnce(runId, s.id, 'resolve', 'count_mismatch', {
          maxAnchorEpisode: maxAnchor,
          airedEpisodes: s.aired_episodes,
          note: 'anchors stale (sparse source page) and MU has no anime-coverage — frontier needs research',
        });
      } else if (s.status === 'finished' && s.total_chapters) {
        classes.active_synthesized.push(s.id); // the scope-semantics rule covers it
      } else if (s.status === 'airing' || s.status === 'upcoming') {
        classes.pending_airing_no_frontier.push(s.id);
      } else {
        classes.pending_finished_unknown_coverage.push(s.id);
        await fileFlagOnce(runId, s.id, 'resolve', 'count_mismatch', {
          note: 'finished anime, publishing manga, no coverage frontier (no anchors, no MU coverage, no scope) — needs curation',
        });
      }
    }

    await finishRun(
      runId,
      'ok',
      { fetched: 0, unchanged: 0, changed: classes.mu_frontier_applied.length, flagged: classes.pending_finished_unknown_coverage.length + classes.data_hole_no_manga_link.length },
      'manga coverage audit',
    );
    console.log('=== MANGA COVERAGE AUDIT ===');
    for (const [k, v] of Object.entries(classes)) {
      console.log(`${k}: ${v.length}${v.length && v.length <= 12 ? '  → ' + v.join(', ') : ''}`);
    }
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
