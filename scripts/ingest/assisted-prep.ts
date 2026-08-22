// Assisted-batch prep (2026-08-22): manual match corrections and exclusions
// for slugs the automated passes couldn't settle. Verified via AniList
// lookups; chains themselves live in stitch.ts OVERRIDE_CHAINS.
//   npx tsx --env-file=.env.ingest scripts/ingest/assisted-prep.ts

import { db, startRun, finishRun } from './lib/db';
import { mediaByIds } from './lib/anilist';
import { stageAniList, resolveSeries } from './lib/resolve';

const SET_MATCH: Record<string, { id: number; note: string }> = {
  'f-zero-legend-falcon': { id: 3101, note: 'F-Zero: GP Legend — manual match (title variant defeated search)' },
  'it-wrong-try-pick-girls-dungeon-side-sword-oratoria': { id: 21676, note: 'Sword Oratoria — separate series per ruling (side_story of DanMachi)' },
  'kuroko%E2%80%99s-basketball': { id: 11771, note: 'Kuroko no Basket S1 — manual match (curly-quote slug)' },
  'jojos-bizarre-adventure-tv': { id: 14719, note: 'JoJo 2012 TV — corrects earlier mismatch; chain in stitcher overrides' },
  x: { id: 156, note: 'X (TV) 1999 — corrects earlier mismatch to a 1-ep entry' },
  'melancholy-haruhi-suzumiya': { id: 4382, note: '2009 rebroadcast = the full 28-ep ordering AFL uses' },
};

const EXCLUDE: Record<string, string> = {
  rwby: 'Western web series — no AniList entry for the original RWBY (only Ice Queendom); revisit if a metadata source appears',
  'hajime-no-ippo-mashiba-vs-kimura-execution': 'standalone 1-ep special — out of v1 scope, re-evaluate with watch-order',
  'k-seven-stories': 'movie series — movies out of v1 scope (Sean 2026-08-22)',
  'pok%C3%A9mon-origins-0': 'standalone 4-ep special miniseries — out of v1 scope, re-evaluate with watch-order',
};

async function main() {
  const runId = await startRun('resolve');
  const actions: string[] = [];
  try {
    for (const [slug, cfg] of Object.entries(SET_MATCH)) {
      const { error } = await db.from('source_map').upsert({
        afl_slug: slug,
        anilist_id: cfg.id,
        match_method: 'manual',
        confidence: 1,
        verified: true,
        disposition: 'active',
        note: cfg.note,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        actions.push(`FAILED match ${slug}: ${error.message}`);
        continue;
      }
      await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString() })
        .eq('series_key', slug).eq('status', 'open').eq('kind', 'match_ambiguous');
      actions.push(`matched ${slug} → ${cfg.id}`);
    }

    for (const [slug, note] of Object.entries(EXCLUDE)) {
      await db.from('source_map').upsert({
        afl_slug: slug, anilist_id: null, match_method: 'manual', confidence: 1,
        verified: true, disposition: 'excluded', note, updated_at: new Date().toISOString(),
      });
      await db.from('series').delete().eq('afl_slug', slug);
      await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString() })
        .eq('series_key', slug).eq('status', 'open');
      actions.push(`excluded ${slug}`);
    }

    // resolve the freshly matched single-season ones (multi-season get their
    // chains from the stitcher's next run)
    const singles = ['f-zero-legend-falcon', 'it-wrong-try-pick-girls-dungeon-side-sword-oratoria'];
    const ids = Object.entries(SET_MATCH).filter(([s]) => singles.includes(s)).map(([, c]) => c.id);
    const media = await mediaByIds(ids);
    for (const m of media) await stageAniList(m);
    for (const slug of singles) {
      try {
        const r = await resolveSeries(runId, slug);
        actions.push(`resolved ${slug}: ${r.episodes} eps`);
      } catch (e) {
        actions.push(`resolve ${slug} failed: ${e}`);
      }
    }

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'assisted prep');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
