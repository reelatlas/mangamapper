// Recover alias-corruption victims from title-verified Wayback snapshots
// (docs/data-pipeline.md §9: AFL's live nodes are corrupt since ~2023; the
// lost shows are finished, so a clean archived page is as good as live).
// Input: the sweep results file (slug | FOUND node=N title="..." ts=TS).
//   npx tsx --env-file=.env.ingest scripts/ingest/wayback-ingest.ts <results-file>

import { readFileSync } from 'node:fs';
import { parseShowPage } from './lib/afl';
import { politeFetch } from './lib/http';
import { mediaByIds } from './lib/anilist';
import { db, startRun, finishRun } from './lib/db';
import { matchSlug } from './lib/match';
import { stageAfl, stageAniList, resolveSeries } from './lib/resolve';

const resultsPath = process.argv[2];
if (!resultsPath) throw new Error('usage: wayback-ingest.ts <results-file>');

interface Found {
  slug: string;
  ts: string;
  title: string;
}

function parseResults(path: string): Found[] {
  const found: Found[] = [];
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const m = line.match(/^(\S+) \| FOUND node=\d+ title="([^"]*)" ts=(\d+)/);
    if (m) found.push({ slug: m[1], title: m[2], ts: m[3] });
  }
  return found;
}

async function main() {
  const runId = await startRun('afl');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];
  const matched: { slug: string; anilistId: number }[] = [];

  try {
    const targets = parseResults(resultsPath);
    console.log(`[wayback] ${targets.length} recoverable shows`);

    for (const t of targets) {
      // id_ raw form: original HTML without archive rewriting
      const url = `https://web.archive.org/web/${t.ts}id_/https://www.animefillerlist.com/shows/${t.slug}`;
      const res = await politeFetch(url);
      counters.fetched++;
      if (res.status !== 200 || !res.html) {
        actions.push(`${t.slug}: snapshot HTTP ${res.status}`);
        continue;
      }
      const page = parseShowPage(res.html);
      if (!page.integrity.ok) {
        actions.push(`${t.slug}: integrity fail in snapshot — ${page.integrity.mismatches.join('; ')}`);
        counters.flagged++;
        continue;
      }
      const outcome = await stageAfl(runId, t.slug, page, {
        etag: null,
        lastModified: null,
        expectedTitle: t.title,
      });
      if (outcome === 'held') {
        counters.flagged++;
        actions.push(`${t.slug}: held (${page.title})`);
        continue;
      }
      counters[outcome]++;

      await db
        .from('source_map')
        .update({
          disposition: 'active',
          note: `recovered from Wayback snapshot ${t.ts} — AFL live page corrupt since ~2023 (data-pipeline.md §9); static (show finished)`,
          updated_at: new Date().toISOString(),
        })
        .eq('afl_slug', t.slug);

      const match = await matchSlug(runId, t.slug, page.title);
      if (!match) {
        counters.flagged++;
        actions.push(`${t.slug}: staged (${page.episodes.length} eps) but match ambiguous — flagged`);
        continue;
      }
      matched.push({ slug: t.slug, anilistId: match.anilistId });
      actions.push(`${t.slug}: staged ${page.episodes.length} eps, matched ${match.anilistId} (${match.method})`);
    }

    const media = await mediaByIds(matched.map((m) => m.anilistId));
    const found = new Set(media.map((m) => m.id));
    for (const m of media) await stageAniList(m);
    for (const { slug, anilistId } of matched) {
      if (!found.has(anilistId)) continue;
      try {
        const r = await resolveSeries(runId, slug);
        actions.push(`resolved ${slug}: ${r.episodes} eps`);
      } catch (e) {
        actions.push(`resolve ${slug} FAILED: ${e}`);
      }
    }

    await finishRun(runId, 'ok', counters, `wayback recovery: ${matched.length} matched`);
    console.log('\n=== WAYBACK INGEST COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    const { count } = await db.from('series').select('*', { count: 'exact', head: true });
    console.log(`canonical series now: ${count}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
