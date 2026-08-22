// Volume boundaries from Wikipedia chapter lists (data-pipeline.md §1, §12).
// Targets: every manga behind an anchored series (where volumes display).
// Boundaries are static once printed — this is a one-time ingest per manga,
// re-runnable safely (hash-gated staging, full-replace boundaries).
//   npx tsx --env-file=.env.ingest scripts/ingest/volumes-backfill.ts

import { findChapterPages, fetchWikitext, parseVolumes, toBoundaries, type WikiVolume } from './lib/wikipedia';
import { contentHash } from './lib/hash';
import { db, startRun, finishRun, fileFlagOnce } from './lib/db';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];

  try {
    // manga targets: anchored series first (volumes actually render there).
    // chapter_anchors exceeds PostgREST's 1000-row cap — page it.
    const anchored = new Set<string>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('chapter_anchors').select('series_id').range(from, from + 999);
      for (const r of data ?? []) anchored.add(r.series_id);
      if (!data || data.length < 1000) break;
    }
    const { data: series } = await db
      .from('series')
      .select('id, title, anilist_id, manga_anilist_id, popularity, total_chapters')
      .not('manga_anilist_id', 'is', null)
      .order('popularity', { ascending: false });
    const targets = new Map<number, { title: string; candidates: string[]; totalChapters: number | null }>();
    for (const s of series ?? []) {
      if (!anchored.has(s.id) || targets.has(s.manga_anilist_id!)) continue;
      // candidates: anime series title + the manga's own titles from staging
      const candidates = [s.title];
      if (s.anilist_id) {
        const { data: al } = await db.from('ingest_anilist_media').select('raw').eq('anilist_id', s.anilist_id).maybeSingle();
        const media = al?.raw as { relations?: { edges: { relationType: string; node: { id: number; title: { romaji: string | null } } }[] } } | undefined;
        const mangaNode = media?.relations?.edges.find(
          (e) => e.relationType === 'ADAPTATION' && e.node.id === s.manga_anilist_id,
        )?.node;
        if (mangaNode?.title.romaji) candidates.push(mangaNode.title.romaji);
      }
      targets.set(s.manga_anilist_id!, { title: s.title, candidates, totalChapters: s.total_chapters });
    }
    console.log(`[wiki] ${targets.size} manga targets`);

    for (const [mangaId, t] of targets) {
      try {
        const pages = await findChapterPages(t.candidates);
        await sleep(1000);
        if (!pages.length) {
          await fileFlagOnce(runId, `manga:${mangaId}`, 'wikipedia', 'match_ambiguous', {
            title: t.title,
            note: 'no "List of X chapters" page family found',
          });
          counters.flagged++;
          actions.push(`${t.title}: no chapter-list pages`);
          continue;
        }

        const allVolumes: WikiVolume[] = [];
        for (const page of pages) {
          const wikitext = await fetchWikitext(page);
          counters.fetched++;
          await sleep(1000);
          if (!wikitext) continue;
          const hash = contentHash(wikitext);
          const { data: staged } = await db
            .from('ingest_wikipedia_chapters')
            .select('content_hash')
            .eq('page_title', page)
            .maybeSingle();
          if (staged?.content_hash !== hash) {
            await db.from('ingest_wikipedia_chapters').upsert({
              page_title: page,
              manga_anilist_id: mangaId,
              raw_wikitext: wikitext,
              content_hash: hash,
              fetched_at: new Date().toISOString(),
              changed_at: new Date().toISOString(),
            });
            counters.changed++;
          } else {
            counters.unchanged++;
          }
          allVolumes.push(...parseVolumes(wikitext));
        }

        const bounds = toBoundaries(allVolumes).filter((b) => b.chapterStart < 5000);
        if (bounds.length < 2) {
          await fileFlagOnce(runId, `manga:${mangaId}`, 'wikipedia', 'parse_integrity', {
            title: t.title,
            pages,
            volumesParsed: bounds.length,
          });
          counters.flagged++;
          actions.push(`${t.title}: only ${bounds.length} volumes parsed — flagged`);
          continue;
        }
        // sanity: known chapter totals should land inside the boundary span
        const lastStart = bounds[bounds.length - 1].chapterStart;
        if (t.totalChapters && lastStart > t.totalChapters + 50) {
          await fileFlagOnce(runId, `manga:${mangaId}`, 'wikipedia', 'count_mismatch', {
            title: t.title,
            lastVolumeStart: lastStart,
            knownTotalChapters: t.totalChapters,
          });
          counters.flagged++;
          actions.push(`${t.title}: boundaries exceed known totals — flagged`);
          continue;
        }

        await db.from('volume_boundaries').delete().eq('manga_anilist_id', mangaId).eq('source', 'wikipedia');
        const rows = bounds.map((b) => ({
          manga_anilist_id: mangaId,
          volume: b.volume,
          chapter_start: b.chapterStart,
          chapter_end: b.chapterEnd,
          source: 'wikipedia',
          source_page: pages[0],
        }));
        for (let i = 0; i < rows.length; i += 500) {
          const { error } = await db.from('volume_boundaries').insert(rows.slice(i, i + 500));
          if (error) throw new Error(error.message);
        }
        actions.push(`${t.title}: ${bounds.length} volumes (${pages.length} pages)`);
      } catch (err) {
        actions.push(`${t.title}: ERROR ${String(err).slice(0, 120)}`);
      }
    }

    await finishRun(runId, 'ok', counters, 'wikipedia volume boundaries');
    console.log('\n=== VOLUMES BACKFILL COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    const { count } = await db.from('volume_boundaries').select('*', { count: 'exact', head: true });
    console.log(`total boundary rows: ${count}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
