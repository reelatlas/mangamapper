// AFG backfill: stage every animefillerguide.com anime page (greedy), and for
// pages matching a canonical series write dense chapter_anchors (source
// 'afg'). AFG never touches episode types — anchors only. 10s/host courtesy
// pacing; ~460 pages ≈ 80 min; resumable via the 24h staging window.
//   npx tsx --env-file=.env.ingest scripts/ingest/afg-backfill.ts

import { AFG_BASE, parseAfgPage, parseSitemap } from './lib/afg';
import { politeFetch } from './lib/http';
import { contentHash } from './lib/hash';
import { db, startRun, finishRun } from './lib/db';
import { slugify } from './lib/slug';
import { syncAnchors } from './lib/anchors';

const RESUME_WINDOW_MS = 24 * 60 * 60 * 1000;
// --force: re-fetch + re-parse everything (parser fixes; staging holds parsed
// output, not HTML, so a parser change needs a fresh sweep)
const FORCE = process.argv.includes('--force');

async function main() {
  const runId = await startRun('afg');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  let anchored = 0;
  const errors: string[] = [];

  try {
    const slugs: string[] = [];
    for (const sm of ['anime-sitemap1.xml', 'anime-sitemap2.xml']) {
      const res = await politeFetch(`${AFG_BASE}/${sm}`);
      if (res.status === 200 && res.html) slugs.push(...parseSitemap(res.html));
    }
    console.log(`[afg] ${slugs.length} pages in sitemaps`);

    // series lookup: by afl_slug, own id, and slugified title
    const { data: series } = await db.from('series').select('id, afl_slug, title, total_chapters');
    const bySlug = new Map<string, { id: string; total_chapters: number | null }>();
    for (const s of series ?? []) {
      const entry = { id: s.id, total_chapters: s.total_chapters };
      if (s.afl_slug) bySlug.set(s.afl_slug, entry);
      bySlug.set(s.id, entry);
      bySlug.set(slugify(s.title), entry);
    }

    for (const [i, slug] of slugs.entries()) {
      try {
        const { data: staged } = await db
          .from('ingest_afg_pages')
          .select('etag, last_modified, fetched_at, content_hash')
          .eq('slug', slug)
          .maybeSingle();
        const fresh =
          !FORCE &&
          staged?.fetched_at &&
          Date.now() - new Date(staged.fetched_at).getTime() < RESUME_WINDOW_MS;
        if (fresh) continue;

        const res = await politeFetch(
          `${AFG_BASE}/anime/${slug}/`,
          FORCE ? {} : { etag: staged?.etag, lastModified: staged?.last_modified },
        );
        counters.fetched++;
        if (res.status === 304) {
          counters.unchanged++;
          continue;
        }
        if (res.status !== 200 || !res.html) {
          errors.push(`${slug}: HTTP ${res.status}`);
          continue;
        }
        const page = parseAfgPage(res.html);
        const raw = { title: page.title, seasons: page.seasons, episodes: page.episodes };
        const hash = contentHash(raw);
        if (staged?.content_hash === hash) {
          await db.from('ingest_afg_pages').update({ fetched_at: new Date().toISOString() }).eq('slug', slug);
          counters.unchanged++;
          continue;
        }
        const { error } = await db.from('ingest_afg_pages').upsert({
          slug,
          raw,
          content_hash: hash,
          etag: res.etag,
          last_modified: res.lastModified,
          fetched_at: new Date().toISOString(),
          changed_at: new Date().toISOString(),
        });
        if (error) throw new Error(error.message);
        counters.changed++;

        // anchors for matched series only — shared write path (lib/anchors)
        const target = bySlug.get(slug) ?? bySlug.get(slugify(page.title));
        if (!target) continue;
        const result = await syncAnchors(runId, target.id, slug, page);
        if (result.withheld) {
          counters.flagged++;
          continue;
        }
        if (result.anchors > 0) {
          anchored++;
          console.log(`[afg] anchored ${target.id} (${result.anchors} anchors) [${i + 1}/${slugs.length}]`);
        }
      } catch (err) {
        errors.push(`${slug}: ${err}`);
      }
    }

    await finishRun(runId, 'ok', counters, `afg backfill: ${anchored} series anchored, ${errors.length} errors`);
    const { count } = await db.from('chapter_anchors').select('*', { count: 'exact', head: true });
    console.log('\n=== AFG BACKFILL COMPLETE ===');
    console.log(`series anchored: ${anchored} · total anchors: ${count}`);
    console.log(`errors (${errors.length}):`, errors.slice(0, 20));
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
