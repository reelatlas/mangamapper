// AFG continua-manga backfill (Sean's full-source ruling 2026-08-23): the
// "Where does the anime end? / Where should I start reading?" table is a
// structured end-frontier + volume-boundary source on EVERY AFG page —
// including registration-tier pages staged without raw_html (they were
// identity-only) and chartless all-canon shows. This campaign fetches every
// staged page missing raw_html or a continua parse, stages both, and stores
// the parsed table inside raw.continua. Application (anchors/boundaries,
// gated) is afg-continua-apply.ts. Re-runnable: complete pages are skipped.
//   npx tsx --env-file=.env.ingest scripts/ingest/afg-continua-backfill.ts
//
// Etiquette: politeFetch (shared host delay, project UA, conditional GETs).

import { db, startRun, finishRun } from './lib/db';
import { AFG_BASE, parseAfgPage, parseContinua } from './lib/afg';
import { politeFetch } from './lib/http';
import { contentHash } from './lib/hash';

async function main() {
  const runId = await startRun('afg');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const { data: pages } = await db.from('ingest_afg_pages').select('slug, raw, raw_html, etag, last_modified');
    const targets = (pages ?? []).filter((p) => {
      const raw = p.raw as { continua?: unknown };
      return !p.raw_html || raw.continua === undefined;
    });
    console.log(`[continua-backfill] ${targets.length} of ${pages?.length} staged pages need fetch/parse`);

    for (const t of targets) {
      try {
        // pages already holding html just need the parse — no fetch
        let html = (t.raw_html as string) || null;
        let etag = t.etag as string | null;
        let lastModified = t.last_modified as string | null;
        if (!html) {
          const res = await politeFetch(`${AFG_BASE}/anime/${t.slug}/`, { etag, lastModified });
          counters.fetched++;
          if (res.status === 304) { counters.unchanged++; continue; }
          if (res.status !== 200 || !res.html) {
            console.log(`  ${t.slug}: HTTP ${res.status}`);
            continue;
          }
          html = res.html;
          etag = res.etag ?? null;
          lastModified = res.lastModified ?? null;
        }
        const page = parseAfgPage(html);
        const continua = parseContinua(html); // null when the table is absent
        const raw = { title: page.title, seasons: page.seasons, episodes: page.episodes, continua };
        await db.from('ingest_afg_pages').upsert({
          slug: t.slug,
          raw,
          raw_html: html,
          content_hash: contentHash(raw),
          etag,
          last_modified: lastModified,
          fetched_at: new Date().toISOString(),
          changed_at: new Date().toISOString(),
        });
        counters.changed++;
        console.log(`  ${t.slug}: eps=${page.episodes.length}, continua=${continua ? `ep${continua.endEpisode ?? '?'}→ch${continua.endChapter ?? '?'}` : 'none'}`);
      } catch (e) {
        console.log(`  ${t.slug}: ERROR ${String(e).slice(0, 80)}`);
      }
    }
    await finishRun(runId, 'ok', counters, `afg continua backfill: ${counters.changed} pages staged`);
    console.log('\n=== CONTINUA BACKFILL COMPLETE ===');
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0));
