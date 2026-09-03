// Systematic manga-coverage audit (Sean 2026-08-23: never one-off fixes —
// classify every series' manga-instrument state, apply GENERAL rules, flag
// what no rule can honestly solve). Self-healing applications each run, all
// via lib/mu-frontier (shared with mu-backfill + refresh-mu):
//   - MU frontier anchors where anchors are absent/STALE (anchor-freshness
//     rule; scope-segment multi-pair parse; chapter-progress guard)
//   - latest_known_chapters from staged MU (chapter-NUMBER space, all manga)
//   - manga-status cross-check + edition-divergence flags
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-manga-coverage.ts

import { db, selectAll, startRun, finishRun, fileFlagOnce } from './lib/db';
import { seriesHasInstrument, sourceKindOf } from './lib/rulings/source-kinds';
import { parseCoverageSegments, pickEntrySegments } from './lib/mu-coverage';
import { applyMuFrontier, bestLatestKnown, crossCheckMangaStatus } from './lib/mu-frontier';

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
    // D1 refusals (Sean 2026-08-24): the gate already filed the flag inside
    // the lib — surfaced as their own classes so a refused frontier never
    // masquerades as "no MU coverage, needs research"
    mu_refused_sibling_scope: [],
    mu_refused_scope_consumed: [],
    mu_refused_episode_type: [],
    mu_skipped_terminal: [],
    mu_suppressed: [],
    stale_anchor_no_frontier: [],
    pending_airing_no_frontier: [],
    pending_finished_unknown_coverage: [],
    mu_pin_multiwork_unresolved: [],
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
    for (const r of await selectAll<{ series_id: string; episode: number; chapter: number }>('chapter_anchors', 'series_id, episode, chapter', (q) => q.neq('source', 'mu'))) {
      anchorMax.set(r.series_id, Math.max(anchorMax.get(r.series_id) ?? 0, r.episode));
      chapterMax.set(r.series_id, Math.max(chapterMax.get(r.series_id) ?? 0, r.chapter));
    }
    const muRows = await selectAll<{ manga_anilist_id: number; raw: unknown }>('ingest_mangaupdates', 'manga_anilist_id, raw');
  // G38 floor: the volume table's last bounded chapter per manga (a printed fact) — latest_known never sits below it
  const tableMax = new Map<number, number>();
  for (const b of await selectAll<{ manga_anilist_id: number; chapter_end: number | null }>('volume_boundaries', 'manga_anilist_id, chapter_end')) if (b.chapter_end != null) tableMax.set(b.manga_anilist_id, Math.max(tableMax.get(b.manga_anilist_id) ?? 0, Number(b.chapter_end)));
    const muByManga = new Map(muRows.map((r) => [r.manga_anilist_id, r.raw as MuRaw]));

    const series = await selectAll<{
      id: string;
      status: string;
      source_type: string | null;
      manga_status: string | null;
      manga_anilist_id: number | null;
      total_chapters: number | null;
      aired_episodes: number | null;
      manga_start_chapter: number | null;
          start_date: string | null;
      end_date: string | null;
    }>('series', 'id, status, source_type, manga_status, manga_anilist_id, total_chapters, aired_episodes, manga_start_chapter, start_date, end_date');

    for (const s of series) {
      const hasSource = seriesHasInstrument(s.source_type); // T25: the manga instrument, not mere identity
      if (!hasSource) {
        classes.no_source.push(s.id);
        continue;
      }
      if (!s.manga_anilist_id) {
        classes.data_hole_no_manga_link.push(s.id);
        // T25/T24 (consolidate deep 2026-08-26): a volume-unit source (light
        // novel / web novel / novel) has no MANGA link by design — its missing
        // link is the NOVEL side, the T24 instrument build; the census already
        // lists it (pending_finished_no_totals). The flag is for chapter-unit
        // kinds only — it fired on all 33 LN series after T4.1 (dismissed).
        if (sourceKindOf(s.source_type)?.unit !== 'chapter') continue;
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
        const editionLatest = bestLatestKnown(mu, s.total_chapters, chapterMax.get(s.id) ?? 0, s.id, tableMax.get(s.manga_anilist_id) ?? 0);
        // same-edition band + confirmed-anchor chapter floor: write the
        // number-space end only when MU tracks the same edition AND the
        // number reaches at least the confirmed anchors (release-derived
        // "latest" is sometimes a volume count — Kakegurui's "9"); the
        // status-string chapter count stands in when the release number
        // fails. Failures null-heal (a bad write from before the guard must
        // not linger) and flag for review
        await db
          .from('series')
          .update({ latest_known_chapters: editionLatest, updated_at: new Date().toISOString() })
          .eq('id', s.id);
        if (mu.latest_chapter && editionLatest === null) {
          await fileFlagOnce(runId, s.id, 'mangaupdates', 'count_mismatch', {
            anilistCount: s.total_chapters,
            muLatestChapter: mu.latest_chapter,
            note: 'MU chapter numbering diverges >20% from AniList count — likely different editions (or release-derived garbage on an old manga); which is the reading edition?',
          });
        }
      }
      {
        // G32 gate 0 listing: a multi-work MU string with no segment marked for this entry keeps today's pin and is listed for a ruling
        const segs = parseCoverageSegments(mu?.anime?.end ?? null);
        const yr = (d?: string | null) => (d && /^\d{4}/.test(d) ? Number(d.slice(0, 4)) : null);
        const pick = pickEntrySegments(segs, { airedEpisodes: s.aired_episodes, startYear: yr(s.start_date), endYear: yr(s.end_date) });
        if (pick.unresolved) classes.mu_pin_multiwork_unresolved.push(`${s.id}: ${segs.map((x) => `${x.chapter} (${x.label})`).join(' / ')}`);
      }
      const result = await applyMuFrontier(
        runId,
        { id: s.id, status: s.status, aired_episodes: s.aired_episodes, total_chapters: s.total_chapters, manga_start_chapter: s.manga_start_chapter, start_date: s.start_date, end_date: s.end_date },
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
      if (result === 'skipped_terminal') {
        classes.mu_skipped_terminal.push(s.id); // G56: research already holds the terminal MU points at
        classes.active_anchored.push(s.id);
        continue;
      }
      if (result === 'refused_sibling_scope' || result === 'refused_scope_consumed' || result === 'refused_episode_type') {
        classes[`mu_${result}`].push(s.id);
        continue;
      }
      if (result === 'suppressed') {
        classes.mu_suppressed.push(s.id);
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
