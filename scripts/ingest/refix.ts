// Repair pass after the backfill's flag analysis: re-scrape the pages the
// fixed parser can now handle, rematch every ambiguous slug with the improved
// matcher (parenthetical titles, decoded slugs, native titles), resolve the
// newly matched. Old flags that a fix supersedes are dismissed; anything
// still ambiguous refiles a fresh flag for Sean's queue.
//   npx tsx --env-file=.env.ingest scripts/ingest/refix.ts

import { AFL_BASE, parseShowPage } from './lib/afl';
import { politeFetch } from './lib/http';
import { mediaByIds } from './lib/anilist';
import { db, startRun, finishRun, fileFlag, selectAll } from './lib/db';
import { matchSlug } from './lib/match';
import { stageAfl, stageAniList, resolveSeries } from './lib/resolve';

async function openFlagSlugs(kind: string): Promise<string[]> {
  const data = await selectAll<{ series_key: string }>('ingest_flags', 'series_key', (q) => q.eq('kind', kind).eq('status', 'open'));
  return [...new Set(data.map((f) => f.series_key))];
}

async function dismissFlags(kind: string, slug: string) {
  await db
    .from('ingest_flags')
    .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
    .eq('kind', kind)
    .eq('series_key', slug)
    .eq('status', 'open');
}

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const errors: string[] = [];

  try {
    // 1 — re-scrape the integrity failures with the fixed parser
    const integritySlugs = await openFlagSlugs('parse_integrity');
    console.log(`[integrity] re-scraping ${integritySlugs.length} pages...`);
    for (const slug of integritySlugs) {
      // no conditional headers: the page didn't change, the parser did
      const res = await politeFetch(`${AFL_BASE}/shows/${slug}`);
      counters.fetched++;
      if (res.status !== 200 || !res.html) {
        errors.push(`${slug}: HTTP ${res.status}`);
        continue;
      }
      const page = parseShowPage(res.html);
      if (!page.integrity.ok) {
        console.log(`[integrity] ${slug}: STILL failing — ${page.integrity.mismatches.join('; ')}`);
        continue; // original flag stays open
      }
      const outcome = await stageAfl(runId, slug, page, { etag: res.etag, lastModified: res.lastModified });
      if (outcome === 'held') {
        counters.flagged++;
        continue;
      }
      counters[outcome]++;
      await dismissFlags('parse_integrity', slug);
      console.log(`[integrity] ${slug}: fixed (${page.episodes.length} eps)`);
    }

    // 2 — rematch everything ambiguous (plus fixed pages not yet mapped)
    const ambiguous = await openFlagSlugs('match_ambiguous');
    const rematch = [...new Set([...ambiguous, ...integritySlugs])];
    console.log(`[rematch] ${rematch.length} slugs...`);
    const matched: { slug: string; anilistId: number }[] = [];
    for (const slug of rematch) {
      const { data: staged } = await db.from('ingest_afl_shows').select('raw').eq('slug', slug).maybeSingle();
      if (!staged) continue; // never staged (still-broken page) — flag stays
      await dismissFlags('match_ambiguous', slug); // superseded; rematch refiles if still stuck
      const title = (staged.raw as { title: string }).title;
      try {
        const match = await matchSlug(runId, slug, title);
        if (match) {
          matched.push({ slug, anilistId: match.anilistId });
          console.log(`[rematch] ${slug}: anilist ${match.anilistId} via ${match.method}`);
        } else {
          counters.flagged++;
        }
      } catch (err) {
        errors.push(`${slug}: ${err}`);
      }
    }

    // 3 — enrich + resolve the newly matched
    console.log(`[anilist] pulling ${matched.length} media...`);
    const media = await mediaByIds(matched.map((m) => m.anilistId));
    const found = new Set(media.map((m) => m.id));
    for (const m of media) await stageAniList(m);
    let resolved = 0;
    for (const { slug, anilistId } of matched) {
      if (!found.has(anilistId)) {
        errors.push(`${slug}: AniList ${anilistId} not returned`);
        continue;
      }
      try {
        const r = await resolveSeries(runId, slug);
        if (r.flagged) counters.flagged++;
        if (r.episodes > 0) resolved++;
      } catch (err) {
        errors.push(`${slug}: resolve: ${err}`);
      }
    }

    await finishRun(runId, 'ok', counters, `refix: ${resolved} newly resolved`);

    // 4 — report
    const { count: seriesCount } = await db.from('series').select('*', { count: 'exact', head: true });
    const { count: episodeCount } = await db.from('episodes').select('*', { count: 'exact', head: true });
    const flags = await selectAll<{ kind: string; series_key: string }>('ingest_flags', 'kind, series_key', (q) => q.eq('status', 'open'));
    const byKind: Record<string, number> = {};
    for (const f of flags ?? []) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
    // Per-series head counts: a plain select over episodes silently truncates
    // at PostgREST's 1000-row cap and false-positives nearly everything.
    const allSeries = await selectAll<{ id: string }>('series', 'id', (q) => q.order('id'));
    const empty: string[] = [];
    for (const s of allSeries ?? []) {
      const { count } = await db
        .from('episodes')
        .select('*', { count: 'exact', head: true })
        .eq('series_id', s.id)
        .limit(1);
      if (!count) empty.push(s.id);
    }

    console.log('\n=== REFIX COMPLETE ===');
    console.log(`canonical: ${seriesCount} series, ${episodeCount} episodes (+${resolved} series this pass)`);
    console.log('open flags:', byKind);
    console.log('canonical series with ZERO episodes (need ruling):', empty);
    console.log('still ambiguous:', (flags ?? []).filter((f) => f.kind === 'match_ambiguous').map((f) => f.series_key).sort());
    console.log(`errors (${errors.length}):`, errors.slice(0, 20));
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
