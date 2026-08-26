// Full staging audit against the AFL index (the ground truth for what each
// slug should be): staged title vs index anchor title. Confirmed mismatches
// are alias-corruption victims — purge staging + canonical, exclude with a
// note so future sweeps skip them until a deliberate re-audit.
// Also applies standing exclusions the earlier passes missed (film/OVA pages
// whose slugs didn't pattern-match, fan re-edits).
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-titles.ts

import { readFileSync } from 'node:fs';
import { parseShowsIndex } from './lib/afl';
import { db, selectAll, startRun, finishRun } from './lib/db';
import { titlesAgree } from './lib/resolve';
import { MANUAL_EXCLUDE } from './lib/rulings/title-exclusions';

// Content exclusions per Sean's rulings that slug patterns couldn't catch
// live in lib/rulings/title-exclusions.ts (restructure T2.1); MANUAL_EXCLUDE
// is the derived slug → note lookup.

async function exclude(slug: string, note: string, disposition: 'excluded' | 'duplicate' = 'excluded') {
  const { error } = await db.from('source_map').upsert({
    afl_slug: slug,
    anilist_id: null,
    match_method: 'manual',
    confidence: 1,
    verified: true,
    disposition,
    note,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(`exclude(${slug}): ${error.message}`);
  await db.from('ingest_afl_shows').delete().eq('slug', slug);
  await db.from('series').delete().eq('id', slug);
  await db
    .from('ingest_flags')
    .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
    .eq('series_key', slug)
    .eq('status', 'open');
}

async function main() {
  const runId = await startRun('afl');
  const actions: string[] = [];

  try {
    const index = parseShowsIndex(readFileSync('scripts/ingest/fixtures/afl-shows-index.html', 'utf8'));
    const indexTitle = new Map(index.map((e) => [e.slug, e.title]));

    const staged = await selectAll<{ slug: string; raw: unknown }>('ingest_afl_shows', 'slug, raw');
    for (const row of staged) {
      const expected = indexTitle.get(row.slug);
      if (!expected) continue; // slug no longer on the index — leave for refresh logic
      const served = (row.raw as { title: string }).title;
      if (!titlesAgree(expected, served)) {
        await exclude(
          row.slug,
          `AFL alias corruption: /shows/${row.slug} (index: "${expected}") serves "${served}" — AFL-side bug, re-audit later`,
        );
        actions.push(`corrupt: ${row.slug} (expected "${expected}", serves "${served}")`);
      }
    }

    for (const [slug, note] of Object.entries(MANUAL_EXCLUDE)) {
      await exclude(slug, note);
      actions.push(`manual exclude: ${slug}`);
    }

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'title audit');

    const { count: seriesCount } = await db.from('series').select('*', { count: 'exact', head: true });
    const { count: stagedCount } = await db.from('ingest_afl_shows').select('*', { count: 'exact', head: true });
    const flags = await selectAll<{ kind: string }>('ingest_flags', 'kind', (q) => q.eq('status', 'open'));
    const byKind: Record<string, number> = {};
    for (const f of flags) byKind[f.kind] = (byKind[f.kind] ?? 0) + 1;
    console.log('=== TITLE AUDIT COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    console.log(`canonical: ${seriesCount} · staged: ${stagedCount} · open flags:`, byKind);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
