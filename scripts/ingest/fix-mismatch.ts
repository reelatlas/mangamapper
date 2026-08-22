// Repair for AFL alias corruption (discovered 2026-08-22: /shows/chrono-crusade
// serves Thus Spoke Rohan Kishibe). Scans staging for slug↔title suspects,
// re-fetches each, and lets the parser's canonicalSlug check decide:
// confirmed corrupt → purge staging + canonical, exclude with note;
// clean → restage. Also un-excludes shows that were wrongly swept up when a
// bad *match* (movie/OVA-format AniList entry) was mistaken for a movie page,
// and rematches them with the format-aware matcher.
//   npx tsx --env-file=.env.ingest scripts/ingest/fix-mismatch.ts

import { AFL_BASE, parseShowPage } from './lib/afl';
import { politeFetch } from './lib/http';
import { mediaByIds } from './lib/anilist';
import { db, startRun, finishRun } from './lib/db';
import { matchSlug } from './lib/match';
import { stageAfl, stageAniList, resolveSeries } from './lib/resolve';

// Wrongly excluded by the cleanup's format rule: staging is healthy (title
// matches slug, real episode counts) — only the match was bad.
const UNEXCLUDE = ['jojos-bizarre-adventure-tv', 'monster', 'x'];

const STOPWORDS = new Set(['the', 'a', 'an', 'of', 'on', 'in', 'to', 'and', 'no', 'wa', 'ga']);
const tokens = (s: string) => {
  let d = s;
  try {
    d = decodeURIComponent(s);
  } catch {
    /* keep raw */
  }
  return new Set(
    d
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((w) => w && !STOPWORDS.has(w)),
  );
};

function overlap(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 1; // nothing to compare — not a suspect
  let hit = 0;
  for (const w of a) if (b.has(w)) hit++;
  return hit / Math.min(a.size, b.size);
}

async function main() {
  const runId = await startRun('afl');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];

  try {
    // ————— scan staging for slug↔title mismatch suspects
    const { data: staged } = await db.from('ingest_afl_shows').select('slug, raw');
    const suspects: string[] = [];
    for (const row of staged ?? []) {
      const title = (row.raw as { title: string }).title;
      if (overlap(tokens(row.slug), tokens(title)) < 0.5) suspects.push(row.slug);
    }
    console.log(`[scan] ${suspects.length} suspects:`, suspects);

    // ————— re-fetch each suspect; the parser's canonicalSlug check decides
    for (const slug of suspects) {
      const res = await politeFetch(`${AFL_BASE}/shows/${slug}`);
      counters.fetched++;
      if (res.status !== 200 || !res.html) {
        actions.push(`${slug}: HTTP ${res.status} — left flagged`);
        continue;
      }
      const page = parseShowPage(res.html);
      const outcome = await stageAfl(runId, slug, page, { etag: res.etag, lastModified: res.lastModified });
      if (outcome === 'held') {
        // confirmed alias corruption: purge the poisoned rows everywhere
        counters.flagged++;
        await db.from('ingest_afl_shows').delete().eq('slug', slug);
        await db.from('series').delete().eq('id', slug);
        await db.from('source_map').upsert({
          afl_slug: slug,
          anilist_id: null,
          match_method: 'manual',
          confidence: 1,
          verified: true,
          disposition: 'excluded',
          note: `AFL alias corruption: /shows/${slug} serves "${page.title}" (${page.canonicalSlug}) — AFL-side bug, re-check on future sweeps`,
          updated_at: new Date().toISOString(),
        });
        await db
          .from('ingest_flags')
          .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
          .eq('series_key', slug)
          .eq('status', 'open')
          .neq('kind', 'parse_integrity');
        actions.push(`${slug}: CONFIRMED corrupt — serves "${page.title}"; purged + excluded`);
      } else {
        counters[outcome]++;
        actions.push(`${slug}: clean on re-fetch (${outcome}) — false positive`);
      }
    }

    // ————— un-exclude the wrongly-swept shows and rematch with format preference
    const rematched: { slug: string; anilistId: number }[] = [];
    for (const slug of UNEXCLUDE) {
      await db.from('source_map').delete().eq('afl_slug', slug);
      const { data: row } = await db.from('ingest_afl_shows').select('raw').eq('slug', slug).maybeSingle();
      if (!row) {
        actions.push(`${slug}: no staging — skipped`);
        continue;
      }
      const title = (row.raw as { title: string }).title;
      const match = await matchSlug(runId, slug, title);
      if (match) {
        rematched.push({ slug, anilistId: match.anilistId });
        actions.push(`${slug}: rematched → anilist ${match.anilistId} (${match.method})`);
      } else {
        counters.flagged++;
        actions.push(`${slug}: still ambiguous — flagged for manual pass`);
      }
    }

    if (rematched.length) {
      const media = await mediaByIds(rematched.map((m) => m.anilistId));
      for (const m of media) await stageAniList(m);
      for (const { slug } of rematched) {
        const r = await resolveSeries(runId, slug);
        actions.push(`${slug}: resolved (${r.episodes} eps${r.flagged ? ', flagged' : ''})`);
        const { data: s } = await db
          .from('series')
          .select('anilist_id, aired_episodes, total_episodes')
          .eq('id', slug)
          .single();
        if (s?.anilist_id) {
          await db.from('series_components').upsert({
            series_id: slug,
            anilist_id: s.anilist_id,
            season_order: 1,
            episode_start: 1,
            episode_end: s.total_episodes ?? s.aired_episodes ?? null,
            afl_slug: slug,
            afl_offset: 0,
          });
        }
      }
    }

    await finishRun(runId, 'ok', counters, 'alias-corruption repair');

    const { count: seriesCount } = await db.from('series').select('*', { count: 'exact', head: true });
    const { data: flags } = await db.from('ingest_flags').select('kind').eq('status', 'open');
    const byKind: Record<string, number> = {};
    for (const f of flags ?? []) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
    console.log('\n=== FIX-MISMATCH COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    console.log(`canonical series: ${seriesCount} · open flags:`, byKind);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
