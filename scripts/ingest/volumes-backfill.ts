// Volume boundaries from Wikipedia chapter lists (data-pipeline.md §1, §12).
// Targets: every manga behind an anchored series (where volumes display).
// Boundaries are static once printed — this is a one-time ingest per manga,
// re-runnable safely (hash-gated staging, full-replace boundaries).
//   npx tsx --env-file=.env.ingest scripts/ingest/volumes-backfill.ts [mangaAnilistId ...]
//
// IDENTITY + NUMBERING-SPACE rules (2026-08-23 s2, the Slime/Dragon Ball
// lesson — ten manga carried boundaries from OTHER series' pages, Dragon
// Ball's came from the Z list in Viz's restarted numbering): the manga's own
// title leads the page search (the anime title is the fallback key); a manga
// whose page family no longer qualifies loses its stale rows (never kept on
// faith); for a FINISHED manga with a known total, rows past the total are
// TRIMMED (a shared page lists sequels — Cardcaptor + Clear Card, Rosario
// Season II) instead of poisoning the readout; audit-ui-truth's
// boundaries_wrong_page / boundaries_beyond_total classes verify outcome-side.

import { findChapterPages, fetchWikitext, parseVolumes, boundariesWithDrops, type WikiVolume } from './lib/wikipedia';
import { contentHash } from './lib/hash';
import { db, startRun, finishRun, fileFlagOnce } from './lib/db';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ONLY = new Set(process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number));

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
      .select('id, title, anilist_id, manga_anilist_id, popularity, total_chapters, manga_status')
      .not('manga_anilist_id', 'is', null)
      .order('popularity', { ascending: false });
    const targets = new Map<number, { title: string; candidates: string[]; totalChapters: number | null; finished: boolean }>();
    for (const s of series ?? []) {
      if (targets.has(s.manga_anilist_id!)) continue;
      // an explicit id list overrides the anchored-only default (healing a
      // manga whose anchors are still landing)
      if (ONLY.size ? !ONLY.has(s.manga_anilist_id!) : !anchored.has(s.id)) continue;
      // candidates: the manga's own title FIRST (Dragon Ball, not Dragon Ball
      // Z Kai), the anime series title as the fallback key
      const candidates = [s.title];
      if (s.anilist_id) {
        const { data: al } = await db.from('ingest_anilist_media').select('raw').eq('anilist_id', s.anilist_id).maybeSingle();
        const media = al?.raw as { relations?: { edges: { relationType: string; node: { id: number; title: { romaji: string | null } } }[] } } | undefined;
        const mangaNode = media?.relations?.edges.find(
          (e) => e.relationType === 'ADAPTATION' && e.node.id === s.manga_anilist_id,
        )?.node;
        if (mangaNode?.title.romaji) candidates.unshift(mangaNode.title.romaji);
      }
      targets.set(s.manga_anilist_id!, { title: s.title, candidates, totalChapters: s.total_chapters, finished: s.manga_status === 'finished' });
    }
    console.log(`[wiki] ${targets.size} manga targets`);

    for (const [mangaId, t] of targets) {
      try {
        const pages = await findChapterPages(t.candidates);
        await sleep(1000);
        if (!pages.length) {
          // stale rows from an earlier, looser page match are wrong by
          // definition once no page qualifies — clear them (ratio fallback
          // is honest; a stranger's volumes are not)
          const { count: stale } = await db.from('volume_boundaries').select('*', { count: 'exact', head: true }).eq('manga_anilist_id', mangaId).eq('source', 'wikipedia');
          if (stale) await db.from('volume_boundaries').delete().eq('manga_anilist_id', mangaId).eq('source', 'wikipedia');
          await fileFlagOnce(runId, `manga:${mangaId}`, 'wikipedia', 'match_ambiguous', {
            title: t.title,
            note: 'no "List of X chapters" page family found',
          });
          counters.flagged++;
          actions.push(`${t.title}: no chapter-list pages${stale ? ` — ${stale} stale wikipedia rows CLEARED` : ''}`);
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
          // a page whose parse repeats volume numbers or runs backwards is a
          // franchise/disambiguation page, not a chapter list ("List of
          // Dragon Ball chapters" vs the clean "... (series)" page) — merging
          // it poisons the family; skip it
          const parsed = parseVolumes(wikitext);
          const volNums = parsed.map((v) => v.volume);
          const consistent = new Set(volNums).size === volNums.length && parsed.every((v, i) => i === 0 || v.chapterStart > parsed[i - 1].chapterStart);
          if (!consistent) {
            actions.push(`${t.title}: page "${page}" parse inconsistent (repeated/backward volumes) — skipped`);
            continue;
          }
          allVolumes.push(...parsed);
        }

        // MONOTONIC-START GATE (Sean 2026-08-24): boundariesWithDrops discards
        // parsed volumes whose chapter_start does not exceed the previous
        // one's — each such row would otherwise be written with an impossible
        // end (derived as next-start − 1) and mis-label every later chapter's
        // volume. Dropped volumes are flagged: the table ships self-consistent
        // but thinner, and research can restore the true starts.
        const parsedBounds = boundariesWithDrops(allVolumes);
        if (parsedBounds.dropped.length) {
          await fileFlagOnce(runId, `manga:${mangaId}`, 'wikipedia', 'parse_integrity', {
            title: t.title,
            pages,
            kind_of_note: 'boundary_parse_artifact',
            dropped: parsedBounds.dropped.slice(0, 20),
            note: `${parsedBounds.dropped.length} volume row(s) had a chapter_start that does not exceed the previous volume's — parse artifacts, dropped rather than written as impossible rows`,
          });
          counters.flagged++;
          actions.push(`${t.title}: ${parsedBounds.dropped.length} non-increasing volume start(s) dropped — flagged`);
        }
        let bounds = parsedBounds.boundaries.filter((b) => b.chapterStart < 5000);
        // finished manga with a known total: rows past the total belong to a
        // sequel/other series sharing the page — trim, clamp the last end
        let trimmed = 0;
        if (t.totalChapters && t.finished) {
          const keep = bounds.filter((b) => b.chapterStart <= t.totalChapters!);
          trimmed = bounds.length - keep.length;
          if (keep.length) {
            const last = keep[keep.length - 1];
            if (last.chapterEnd == null || last.chapterEnd > t.totalChapters) last.chapterEnd = t.totalChapters;
          }
          bounds = keep;
        }
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

        // research-tier rows for LATER volumes (Dragon Ball's Z volumes 17-42,
        // which Wikipedia only lists in Viz's restarted numbering) close the
        // last wiki volume at their first chapter − 1 — an open-ended wiki
        // row would otherwise swallow every later chapter in chToVol
        const { data: laterRows } = await db.from('volume_boundaries').select('volume, chapter_start').eq('manga_anilist_id', mangaId).neq('source', 'wikipedia');
        const lastWiki = bounds[bounds.length - 1];
        const later = (laterRows ?? []).filter((r) => r.volume > lastWiki.volume).map((r) => r.chapter_start);
        if (later.length && (lastWiki.chapterEnd == null || lastWiki.chapterEnd >= Math.min(...later))) lastWiki.chapterEnd = Math.min(...later) - 1;
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
        actions.push(`${t.title}: ${bounds.length} volumes (${pages.length} pages: ${pages[0]})${trimmed ? ` — ${trimmed} volume(s) past the ${t.totalChapters}-chapter total trimmed` : ''}`);
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
