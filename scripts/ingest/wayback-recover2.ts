// Wayback recovery, corrected (v2): the id_ raw form redirects to the nearest
// raw capture (sometimes YEARS off — mid-airing pages), so v1 staged
// truncated data for several shows. This pass fetches RENDERED snapshots at
// exact timestamps, normalizes archive-rewritten hrefs back to originals,
// validates the parsed episode count against the matched AniList total, and
// walks newer→older snapshots until a complete capture parses.
//   npx tsx --env-file=.env.ingest scripts/ingest/wayback-recover2.ts

import { readFileSync } from 'node:fs';
import { parseShowPage } from './lib/afl';
import { politeFetch } from './lib/http';
import { mediaByIds } from './lib/anilist';
import { db, startRun, finishRun } from './lib/db';
import { matchSlug } from './lib/match';
import { stageAfl, stageAniList, resolveSeries } from './lib/resolve';
import type { AniListMedia } from './lib/anilist';

const RESULTS = process.argv[2] ?? '/private/tmp/claude-501/-Users-sean-Projects-mangamapper/a187a108-fa75-4592-8bd9-ad625e34019f/scratchpad/wayback-results.txt';

function deWayback(html: string): string {
  // strip snapshot prefixes so hrefs read as original site-relative paths
  return html
    .replace(/https?:\/\/web\.archive\.org\/web\/\d+(?:[a-z_]+)?\//g, '/')
    .replace(/\/web\/\d+(?:[a-z_]+)?\/(?:https?:\/\/)?(?:www\.)?animefillerlist\.com/g, '')
    .replace(/\/web\/\d+(?:[a-z_]+)?\//g, '/');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// archive.org drops/refuses connections under load — always retry with backoff
async function retryFetch(url: string, attempts = 4): Promise<Response | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429 || res.status >= 500) {
        await sleep(8000 * (i + 1));
        continue;
      }
      return res;
    } catch {
      await sleep(8000 * (i + 1));
    }
  }
  return null;
}

async function snapshots(slug: string): Promise<string[]> {
  const url = `https://web.archive.org/cdx/search/cdx?url=animefillerlist.com/shows/${slug}&output=json&filter=statuscode:200&collapse=timestamp:6&limit=30`;
  const res = await retryFetch(url);
  if (!res?.ok) return [];
  const rows = (await res.json()) as string[][];
  return rows.slice(1).map((r) => r[1]).sort().reverse(); // newest first
}

async function main() {
  const runId = await startRun('afl');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];
  const matched: { slug: string; anilistId: number }[] = [];

  try {
    const targets: { slug: string; title: string }[] = [];
    for (const line of readFileSync(RESULTS, 'utf8').split('\n')) {
      const m = line.match(/^(\S+) \| FOUND node=\d+ title="([^"]*)" ts=\d+/);
      if (m) targets.push({ slug: m[1], title: m[2].replace(/&amp;/g, '&').replace(/&#039;/g, "'") });
    }

    for (const t of targets) {
      try {
      // expected total (finished shows): from the already-matched AniList entry
      const { data: map } = await db.from('source_map').select('anilist_id').eq('afl_slug', t.slug).maybeSingle();
      let expected: number | null = null;
      if (map?.anilist_id) {
        const { data: al } = await db.from('ingest_anilist_media').select('raw').eq('anilist_id', map.anilist_id).maybeSingle();
        expected = (al?.raw as AniListMedia | undefined)?.episodes ?? null;
      }

      // current staging good enough already?
      const { data: cur } = await db.from('ingest_afl_shows').select('raw').eq('slug', t.slug).maybeSingle();
      const curCount = cur ? (cur.raw as { episodes: unknown[] }).episodes.length : 0;
      if (expected && curCount >= Math.floor(expected * 0.9)) {
        actions.push(`${t.slug}: staging already complete (${curCount}/${expected})`);
        if (map?.anilist_id) matched.push({ slug: t.slug, anilistId: map.anilist_id });
        continue;
      }

      let best: ReturnType<typeof parseShowPage> | null = null;
      let bestMeta = '';
      for (const ts of (await snapshots(t.slug)).slice(0, 12)) {
        const res = await politeFetch(`https://web.archive.org/web/${ts}/https://www.animefillerlist.com/shows/${t.slug}`);
        counters.fetched++;
        if (res.status !== 200 || !res.html) continue;
        const page = parseShowPage(deWayback(res.html));
        const titleOk = page.title && t.title.toLowerCase().includes(page.title.toLowerCase().slice(0, 8));
        if (!titleOk || !page.integrity.ok) continue;
        if (!best || page.episodes.length > best.episodes.length) {
          best = page;
          bestMeta = ts;
        }
        if (expected && page.episodes.length >= Math.floor(expected * 0.95)) break; // complete enough
      }

      if (!best || best.episodes.length === 0) {
        actions.push(`${t.slug}: NO complete capture found (best ${best?.episodes.length ?? 0} eps)`);
        counters.flagged++;
        continue;
      }
      if (expected && best.episodes.length < Math.floor(expected * 0.9)) {
        actions.push(`${t.slug}: best capture INCOMPLETE ${best.episodes.length}/${expected} — staged anyway, flagged`);
        counters.flagged++;
      }

      const outcome = await stageAfl(runId, t.slug, best, { etag: null, lastModified: null, expectedTitle: t.title });
      if (outcome === 'held') {
        counters.flagged++;
        actions.push(`${t.slug}: held on stage (${best.title})`);
        continue;
      }
      counters[outcome]++;
      await db.from('source_map')
        .update({ note: `recovered from Wayback snapshot ${bestMeta} (rendered, count-validated) — AFL live corrupt since ~2023`, updated_at: new Date().toISOString() })
        .eq('afl_slug', t.slug);
      actions.push(`${t.slug}: staged ${best.episodes.length} eps from ts=${bestMeta}${expected ? ` (expected ${expected})` : ''}`);

      if (map?.anilist_id) {
        matched.push({ slug: t.slug, anilistId: map.anilist_id });
      } else {
        const match = await matchSlug(runId, t.slug, best.title);
        if (match) matched.push({ slug: t.slug, anilistId: match.anilistId });
        else {
          counters.flagged++;
          actions.push(`${t.slug}: match still ambiguous`);
        }
      }
      } catch (err) {
        actions.push(`${t.slug}: ERROR ${err}`);
      }
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

    await finishRun(runId, 'ok', counters, 'wayback recovery v2');
    console.log('\n=== RECOVERY V2 COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    const { count } = await db.from('series').select('*', { count: 'exact', head: true });
    console.log(`canonical series: ${count}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
