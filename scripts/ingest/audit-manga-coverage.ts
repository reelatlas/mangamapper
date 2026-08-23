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

// MU's anime field is often MULTI-SEGMENT prose: MHA's end lists every
// season's endpoint ("Vol 3, Chap 21 (S1) / … / Vol 42, Chap 432 (S8)");
// Naruto's covers three series in one string with an EP number belonging to
// the BORUTO clause. Parse ALL Vol/Chap pairs; the caller picks the pair
// inside the series' own scope (segment model). An EP marker is only
// trustworthy when the text holds exactly one pair.
function parseCoverageAll(text: string | null): {
  pairs: { volume: number; chapter: number }[];
  explicitEp: number | null;
} {
  if (!text) return { pairs: [], explicitEp: null };
  const pairs = [...text.matchAll(/Vol\.?\s*(\d+)\s*,\s*Chap(?:ter)?\.?\s*(\d+)/gi)].map((m) => ({
    volume: Number(m[1]),
    chapter: Number(m[2]),
  }));
  const ep = pairs.length === 1 ? text.match(/EP\.?\s*(\d+)/i) : null;
  return { pairs, explicitEp: ep ? Number(ep[1]) : null };
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
    // 'mu' anchors are pure derivations of staged MU data — wipe and rebuild
    // them every run so a rule fix heals all series at once.
    await db.from('chapter_anchors').delete().eq('source', 'mu');

    // "anchored" only counts when the frontier is FRESH — a max anchor far
    // behind the run (sparse AFG page: MHA's stops at ep 13 of 170) is a
    // stale picture, and the series still needs a real frontier (MU) or a
    // research flag. Sean 2026-08-24. maxChapter guards MU staleness: an MU
    // pair that adds no chapter progress is the SAME stale frontier.
    const anchorMax = new Map<string, number>();
    const chapterMax = new Map<string, number>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('chapter_anchors').select('series_id, episode, chapter').range(from, from + 999);
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
      const anchorsFresh = maxAnchor !== undefined && maxAnchor >= (s.aired_episodes ?? 0) - 12;
      if (anchorsFresh) {
        classes.active_anchored.push(s.id);
        continue;
      }

      // MU-frontier rule: curated coverage becomes a real anchor — the pair
      // must fall inside THIS series' scope segment, add chapter progress
      // beyond existing anchors (else it's the same stale frontier), and an
      // episode pin is only taken from single-pair text
      const mu = muByManga.get(s.manga_anilist_id);
      const { pairs, explicitEp } = parseCoverageAll(mu?.anime?.end ?? null);
      const scopeStart = s.manga_start_chapter ?? 1;
      const scopeEnd = s.total_chapters ?? Number.POSITIVE_INFINITY;
      const inScope = pairs.filter((p) => p.chapter >= scopeStart && p.chapter <= scopeEnd);
      const coverage = inScope.length ? inScope.reduce((a, b) => (b.chapter > a.chapter ? b : a)) : null;
      const priorChapterMax = chapterMax.get(s.id) ?? 0;
      if (coverage && coverage.chapter > priorChapterMax) {
        const episode = explicitEp && explicitEp <= s.aired_episodes ? explicitEp : s.aired_episodes;
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
