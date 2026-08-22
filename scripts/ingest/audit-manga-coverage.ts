// Systematic manga-coverage audit (Sean 2026-08-23: never one-off fixes —
// classify every series' manga-instrument state, apply GENERAL rules, flag
// what no rule can honestly solve). Also applies the MU-frontier rule:
// MangaUpdates' curated anime-coverage field ("Vol 112, Chap 1138 as of EP
// 1168") becomes a real anchor (source 'mu') for series AFG doesn't cover —
// retiring mapping_pending for airing series with staged MU data.
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-manga-coverage.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';

interface MuRaw {
  latest_chapter: number | null;
  anime: { start: string | null; end: string | null } | null;
}

// "Vol 112, Chap 1138 (As of EP 1168)" — volume/chapter required, episode optional
function parseCoverage(text: string | null): { volume: number | null; chapter: number; episode: number | null } | null {
  if (!text) return null;
  const m = text.match(/Vol\.?\s*(\d+)\s*,\s*Chap(?:ter)?\.?\s*(\d+)/i);
  if (!m) return null;
  const ep = text.match(/EP\.?\s*(\d+)/i);
  return { volume: Number(m[1]), chapter: Number(m[2]), episode: ep ? Number(ep[1]) : null };
}

async function main() {
  const runId = await startRun('resolve');
  const classes: Record<string, string[]> = {
    active_anchored: [],
    active_synthesized: [],
    mu_frontier_applied: [],
    pending_airing_no_frontier: [],
    pending_finished_unknown_coverage: [],
    no_source: [],
    data_hole_no_manga_link: [],
  };

  try {
    const anchored = new Set<string>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('chapter_anchors').select('series_id').range(from, from + 999);
      for (const r of data ?? []) anchored.add(r.series_id);
      if (!data || data.length < 1000) break;
    }
    const { data: muRows } = await db.from('ingest_mangaupdates').select('manga_anilist_id, raw');
    const muByManga = new Map((muRows ?? []).map((r) => [r.manga_anilist_id, r.raw as MuRaw]));

    const { data: series } = await db
      .from('series')
      .select('id, status, source_type, manga_status, manga_anilist_id, total_chapters, aired_episodes');

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
      if (anchored.has(s.id)) {
        classes.active_anchored.push(s.id);
        continue;
      }

      // MU-frontier rule: curated coverage becomes a real anchor
      const mu = muByManga.get(s.manga_anilist_id);
      const coverage = parseCoverage(mu?.anime?.end ?? null);
      if (coverage) {
        const episode = coverage.episode && coverage.episode <= s.aired_episodes ? coverage.episode : s.aired_episodes;
        const { error } = await db.from('chapter_anchors').upsert({
          series_id: s.id,
          episode,
          volume: coverage.volume,
          chapter: coverage.chapter,
          source: 'mu',
          note: `MU curated anime-coverage: "${mu!.anime!.end}"`,
        });
        if (!error) {
          classes.mu_frontier_applied.push(s.id);
          continue;
        }
      }

      if (s.status === 'finished' && s.total_chapters) {
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
