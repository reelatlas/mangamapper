// Pilot ingest: three headline shows end-to-end (AFL → match → AniList →
// resolve), then a report. The full backfill runs only after Sean reviews
// this pilot's output and flags. Run:
//   npx tsx --env-file=.env.ingest scripts/ingest/pilot.ts

import { AFL_BASE, parseShowPage } from '../lib/afl';
import { politeFetch } from '../lib/http';
import { mediaByIds } from '../lib/anilist';
import { db, startRun, finishRun, fileFlag } from '../lib/db';
import { matchSlug } from '../lib/match';
import { stageAfl, stageAniList, resolveSeries } from '../lib/resolve';

const SLUGS = ['naruto', 'one-piece', 'bleach'];

async function main() {
  const runId = await startRun('afl');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const matched: { slug: string; anilistId: number }[] = [];

  try {
    for (const slug of SLUGS) {
      const { data: staged } = await db
        .from('ingest_afl_shows')
        .select('etag, last_modified')
        .eq('slug', slug)
        .maybeSingle();

      const res = await politeFetch(`${AFL_BASE}/shows/${slug}`, {
        etag: staged?.etag,
        lastModified: staged?.last_modified,
      });
      counters.fetched++;

      if (res.status === 304) {
        console.log(`[afl] ${slug}: 304 not modified`);
        counters.unchanged++;
      } else if (res.status !== 200 || !res.html) {
        throw new Error(`[afl] ${slug}: HTTP ${res.status}`);
      } else {
        const page = parseShowPage(res.html);
        if (!page.integrity.ok) {
          await fileFlag(runId, slug, 'afl', 'parse_integrity', {
            mismatches: page.integrity.mismatches,
          });
          counters.flagged++;
          console.log(`[afl] ${slug}: INTEGRITY FAIL — held. ${page.integrity.mismatches.join('; ')}`);
          continue;
        }
        const outcome = await stageAfl(runId, slug, page, {
          etag: res.etag,
          lastModified: res.lastModified,
        });
        if (outcome === 'held') counters.flagged++;
        else counters[outcome]++;
        console.log(`[afl] ${slug}: ${outcome} (${page.episodes.length} episodes, "${page.title}")`);
        if (outcome === 'held') continue;
      }

      const { data: raw } = await db.from('ingest_afl_shows').select('raw').eq('slug', slug).single();
      const title = (raw!.raw as { title: string }).title;
      const match = await matchSlug(runId, slug, title);
      if (!match) {
        counters.flagged++;
        console.log(`[match] ${slug}: AMBIGUOUS — flagged, held`);
        continue;
      }
      console.log(`[match] ${slug}: anilist ${match.anilistId} via ${match.method}`);
      matched.push({ slug, anilistId: match.anilistId });
    }

    console.log(`[anilist] pulling ${matched.length} media...`);
    const media = await mediaByIds(matched.map((m) => m.anilistId));
    for (const m of media) {
      const outcome = await stageAniList(m);
      console.log(`[anilist] ${m.title.romaji}: ${outcome}`);
    }

    for (const { slug } of matched) {
      const { episodes, flagged } = await resolveSeries(runId, slug);
      if (flagged) counters.flagged++;
      console.log(`[resolve] ${slug}: ${episodes} episodes in canonical${flagged ? ' (flagged)' : ''}`);
    }

    await finishRun(runId, 'ok', counters, `pilot: ${SLUGS.join(', ')}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }

  // ————— report
  const { data: series } = await db
    .from('series')
    .select('id, title, title_native, status, aired_episodes, total_episodes, average_score, popularity, cover_color, manga_status, total_chapters, total_volumes')
    .order('popularity', { ascending: false });
  console.log('\n=== canonical series ===');
  console.table(series ?? []);

  for (const { slug } of matched) {
    const { data: eps } = await db.from('episodes').select('type').eq('series_id', slug);
    const counts: Record<string, number> = {};
    for (const e of eps ?? []) counts[e.type] = (counts[e.type] ?? 0) + 1;
    console.log(`${slug}:`, counts);
  }

  const { data: flags } = await db.from('ingest_flags').select('*').eq('status', 'open');
  console.log(`\n=== open flags: ${flags?.length ?? 0} ===`);
  for (const f of flags ?? []) {
    console.log(`#${f.id} [${f.kind}] ${f.series_key} (${f.source}):`, JSON.stringify(f.detail).slice(0, 200));
  }
}

main().then(() => process.exit(0));
