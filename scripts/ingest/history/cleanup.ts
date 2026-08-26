// Cleanup pass implementing Sean's rulings (2026-08-22):
// 1. Movies/films/OVAs excluded from v1 (durable disposition + note).
// 2. Duplicate AFL pages: more classified episodes wins; loser marked.
// 3. Empty (unclassified) series leave canonical unless status=upcoming.
// 4. Flags addressed by the above are dismissed.
// 5. Every remaining canonical series gets its baseline component row.
//   npx tsx --env-file=.env.ingest scripts/ingest/cleanup.ts

import { db, startRun, finishRun } from '../lib/db';

const EXCLUDE_NOTE = 'movies/OVAs out of v1 scope (Sean 2026-08-22) — re-evaluate with the watch-order concept';
const SLUG_EXCLUDE = /(^|-)(movies?|films?|ovas?|oads?|oav|specials?|ovaoad)(-|$)/;
const EXCLUDED_FORMATS = new Set(['MOVIE', 'OVA', 'SPECIAL', 'MUSIC']);

async function dismiss(seriesKey: string, kinds?: string[]) {
  let q = db
    .from('ingest_flags')
    .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
    .eq('series_key', seriesKey)
    .eq('status', 'open');
  if (kinds) q = q.in('kind', kinds);
  await q;
}

async function markExcluded(slug: string, note: string) {
  const { error } = await db.from('source_map').upsert({
    afl_slug: slug,
    anilist_id: null,
    match_method: 'manual',
    confidence: 1,
    verified: true,
    disposition: 'excluded',
    note,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`markExcluded(${slug}): ${error.message}`);
}

async function main() {
  const runId = await startRun('resolve');
  const actions: string[] = [];

  try {
    // ————— 1a. canonical series whose AniList format is a movie/OVA
    const { data: allSeries } = await db.from('series').select('id, format, status');
    for (const s of allSeries ?? []) {
      if (EXCLUDED_FORMATS.has(s.format ?? '')) {
        await markExcluded(s.id, `${EXCLUDE_NOTE} (format: ${s.format})`);
        await db.from('series').delete().eq('id', s.id);
        await dismiss(s.id);
        actions.push(`excluded+removed (format ${s.format}): ${s.id}`);
      }
    }

    // ————— 1b. unresolved slugs whose name marks them as movie/OVA pages
    const { data: openMatch } = await db
      .from('ingest_flags')
      .select('series_key')
      .eq('kind', 'match_ambiguous')
      .eq('status', 'open');
    const ambiguous = [...new Set((openMatch ?? []).map((f) => f.series_key))];
    for (const slug of ambiguous) {
      const decoded = decodeURIComponent(slug);
      if (SLUG_EXCLUDE.test(decoded)) {
        await markExcluded(slug, EXCLUDE_NOTE);
        await dismiss(slug);
        actions.push(`excluded (slug pattern): ${slug}`);
      }
    }

    // ————— 2. duplicate AFL pages: "-0" Drupal collision slugs + flagged dups
    const { data: maps } = await db.from('source_map').select('afl_slug, disposition');
    const activeSlugs = new Set((maps ?? []).filter((m) => m.disposition === 'active').map((m) => m.afl_slug));
    const { data: stagedAll } = await db.from('ingest_afl_shows').select('slug, raw');
    const epCount = new Map<string, number>();
    for (const s of stagedAll ?? []) {
      epCount.set(s.slug, (s.raw as { episodes: unknown[] }).episodes.length);
    }

    const dupPairs: [string, string][] = []; // [candidate, base]
    for (const slug of epCount.keys()) {
      if (slug.endsWith('-0')) {
        const base = slug.slice(0, -2);
        if (epCount.has(base)) dupPairs.push([slug, base]);
      }
    }
    // flagged duplicate (two names for one series, e.g. promised-neverland)
    const { data: dupFlags } = await db
      .from('ingest_flags')
      .select('series_key, detail')
      .eq('status', 'open')
      .contains('detail', { reason: 'anilist_id already mapped to another AFL slug — likely duplicate AFL pages for one series' });
    for (const f of dupFlags ?? []) {
      const owner = (f.detail as { ownerSlug?: string }).ownerSlug;
      if (owner) dupPairs.push([f.series_key, owner]);
    }

    for (const [a, b] of dupPairs) {
      const [winner, loser] = (epCount.get(a) ?? 0) > (epCount.get(b) ?? 0) ? [a, b] : [b, a];
      await markExcluded(loser, `duplicate AFL page for "${winner}" — fewer classified episodes`);
      await db.from('source_map').update({ disposition: 'duplicate' }).eq('afl_slug', loser);
      const { data: loserSeries } = await db.from('series').select('id').eq('id', loser).maybeSingle();
      if (loserSeries) {
        await db.from('series').delete().eq('id', loser);
        actions.push(`duplicate removed from canonical: ${loser} (primary: ${winner})`);
      } else {
        actions.push(`duplicate marked: ${loser} (primary: ${winner})`);
      }
      await dismiss(loser);
      if (activeSlugs.has(loser)) activeSlugs.delete(loser);
    }

    // ————— 3. unclassified series leave canonical unless upcoming
    const { data: remaining } = await db.from('series').select('id, status').order('id');
    for (const s of remaining ?? []) {
      const { count } = await db
        .from('episodes')
        .select('*', { count: 'exact', head: true })
        .eq('series_id', s.id)
        .limit(1);
      if (!count && s.status !== 'upcoming') {
        await db.from('series').delete().eq('id', s.id);
        await dismiss(s.id, ['count_mismatch', 'parse_integrity']);
        actions.push(`unclassified removed from canonical (stays staged): ${s.id}`);
      }
    }

    // ————— 5. baseline component row for every canonical series
    const { data: finalSeries } = await db
      .from('series')
      .select('id, anilist_id, aired_episodes, total_episodes');
    let components = 0;
    for (const s of finalSeries ?? []) {
      if (!s.anilist_id) continue;
      const { error } = await db.from('series_components').upsert({
        series_id: s.id,
        anilist_id: s.anilist_id,
        season_order: 1,
        episode_start: 1,
        episode_end: s.total_episodes ?? s.aired_episodes ?? null,
        afl_slug: s.id,
        afl_offset: 0,
      });
      if (error) throw new Error(`component (${s.id}): ${error.message}`);
      components++;
    }

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'cleanup pass');

    const { count: seriesCount } = await db.from('series').select('*', { count: 'exact', head: true });
    const { data: flags } = await db.from('ingest_flags').select('kind').eq('status', 'open');
    const byKind: Record<string, number> = {};
    for (const f of flags ?? []) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;

    console.log('=== CLEANUP COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    console.log(`canonical series now: ${seriesCount} · baseline components: ${components}`);
    console.log('open flags:', byKind);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
