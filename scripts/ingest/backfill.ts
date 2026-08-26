// Full AFL-spine backfill: every show on animefillerlist.com → staging →
// match → AniList enrichment → canonical. ~70 min at the mandatory 10s crawl
// delay. Resumable: shows staged within RESUME_WINDOW_MS are not re-fetched.
//   npx tsx --env-file=.env.ingest scripts/ingest/backfill.ts

import { AFL_BASE, parseShowPage, parseShowsIndex } from './lib/afl';
import { politeFetch } from './lib/http';
import { mediaByIds } from './lib/anilist';
import { db, selectAll, startRun, finishRun, fileFlag } from './lib/db';
import { matchSlug } from './lib/match';
import { stageAfl, stageAniList, resolveSeries } from './lib/resolve';

const RESUME_WINDOW_MS = 24 * 60 * 60 * 1000;

async function main() {
  const runId = await startRun('afl');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const errors: string[] = [];
  const matched: { slug: string; anilistId: number }[] = [];
  let unmatchedCount = 0;

  try {
    const indexRes = await politeFetch(`${AFL_BASE}/shows`);
    if (indexRes.status !== 200 || !indexRes.html) throw new Error(`shows index: HTTP ${indexRes.status}`);
    const allShows = parseShowsIndex(indexRes.html);

    // Dispositions are rulings, not cache state: excluded (movies/OVAs,
    // alias-corrupt pages) and duplicate slugs stay out until deliberately
    // re-evaluated (docs/data-pipeline.md).
    const dispositions = await selectAll<{ afl_slug: string; disposition: string }>('source_map', 'afl_slug, disposition');
    const skip = new Set(
      dispositions.filter((d) => d.disposition !== 'active').map((d) => d.afl_slug),
    );
    const shows = allShows.filter((s) => !skip.has(s.slug));
    console.log(`[index] ${allShows.length} shows, ${shows.length} active (${skip.size} excluded/duplicate)`);

    for (const [i, show] of shows.entries()) {
      const tag = `${i + 1}/${shows.length} ${show.slug}`;
      try {
        const { data: staged } = await db
          .from('ingest_afl_shows')
          .select('etag, last_modified, fetched_at')
          .eq('slug', show.slug)
          .maybeSingle();

        const fresh =
          staged?.fetched_at && Date.now() - new Date(staged.fetched_at).getTime() < RESUME_WINDOW_MS;

        if (!fresh) {
          const res = await politeFetch(`${AFL_BASE}/shows/${show.slug}`, {
            etag: staged?.etag,
            lastModified: staged?.last_modified,
          });
          counters.fetched++;
          if (res.status === 304) {
            counters.unchanged++;
          } else if (res.status !== 200 || !res.html) {
            errors.push(`${show.slug}: HTTP ${res.status}`);
            console.log(`[afl] ${tag}: HTTP ${res.status} — skipped`);
            continue;
          } else {
            const page = parseShowPage(res.html);
            if (!page.integrity.ok) {
              await fileFlag(runId, show.slug, 'afl', 'parse_integrity', {
                mismatches: page.integrity.mismatches,
              });
              counters.flagged++;
              console.log(`[afl] ${tag}: INTEGRITY FAIL — held`);
              continue;
            }
            const outcome = await stageAfl(runId, show.slug, page, {
              etag: res.etag,
              lastModified: res.lastModified,
              expectedTitle: show.title,
            });
            if (outcome === 'held') {
              counters.flagged++;
              console.log(`[afl] ${tag}: large diff — held`);
              continue;
            }
            counters[outcome]++;
          }
        }

        const match = await matchSlug(runId, show.slug, show.title);
        if (!match) {
          unmatchedCount++;
          counters.flagged++;
          console.log(`[match] ${tag}: ambiguous — flagged`);
          continue;
        }
        matched.push({ slug: show.slug, anilistId: match.anilistId });
        if ((i + 1) % 25 === 0) console.log(`[progress] ${tag}: ${matched.length} matched so far`);
      } catch (err) {
        errors.push(`${show.slug}: ${err}`);
        console.log(`[error] ${tag}: ${err}`);
      }
    }

    console.log(`[anilist] pulling ${matched.length} media in ${Math.ceil(matched.length / 50)} requests...`);
    const media = await mediaByIds(matched.map((m) => m.anilistId));
    const found = new Set(media.map((m) => m.id));
    for (const m of media) await stageAniList(m);
    for (const m of matched) {
      if (!found.has(m.anilistId)) errors.push(`${m.slug}: AniList id ${m.anilistId} not returned`);
    }

    let resolved = 0;
    for (const { slug, anilistId } of matched) {
      if (!found.has(anilistId)) continue;
      try {
        const { flagged } = await resolveSeries(runId, slug);
        if (flagged) counters.flagged++;
        resolved++;
      } catch (err) {
        errors.push(`${slug}: resolve: ${err}`);
      }
    }

    await finishRun(
      runId,
      'ok',
      counters,
      `backfill: ${resolved} resolved, ${unmatchedCount} unmatched, ${errors.length} errors`,
    );

    const { count: seriesCount } = await db.from('series').select('*', { count: 'exact', head: true });
    const { count: episodeCount } = await db.from('episodes').select('*', { count: 'exact', head: true });
    const flags = await selectAll<{ kind: string }>('ingest_flags', 'kind', (q) => q.eq('status', 'open'));
    const flagCounts: Record<string, number> = {};
    for (const f of flags) flagCounts[f.kind] = (flagCounts[f.kind] ?? 0) + 1;

    console.log('\n=== BACKFILL COMPLETE ===');
    console.log(`series in canonical: ${seriesCount}`);
    console.log(`episodes in canonical: ${episodeCount}`);
    console.log(`resolved this run: ${resolved} · unmatched: ${unmatchedCount}`);
    console.log(`open flags by kind:`, flagCounts);
    console.log(`errors (${errors.length}):`);
    for (const e of errors.slice(0, 40)) console.log(`  - ${e}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
