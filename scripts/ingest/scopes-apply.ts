// Sync curated series_scopes into canonical without a full re-resolve — the
// repeatable path after editing scope rows. (Writers also apply scopes inline
// on every resolve/stitch; this covers already-published series.)
//   npx tsx --env-file=.env.ingest scripts/ingest/scopes-apply.ts

import { db, selectAll, startRun, finishRun, fileFlagOnce } from './lib/db';

async function main() {
  const runId = await startRun('resolve');
  const actions: string[] = [];
  try {
    const scopes = await selectAll<{ series_id: string; afl_slug: string | null; start_volume: number | null; start_chapter: number | null; end_volume: number | null; end_chapter: number | null }>('series_scopes', '*');

    // Discovery: sequel-linked series sharing one manga MUST be scoped —
    // otherwise each shows the whole franchise (the Naruto bug). Flag any
    // pair the curated table doesn't cover yet.
    const scoped = new Set(scopes.map((s) => s.series_id));
    const all = await selectAll<{ id: string; afl_slug: string | null; manga_anilist_id: number | null }>('series', 'id, afl_slug, manga_anilist_id', (q) => q.not('manga_anilist_id', 'is', null));
    const byManga = new Map<number, { id: string; afl_slug: string | null }[]>();
    for (const s of all) byManga.set(s.manga_anilist_id!, [...(byManga.get(s.manga_anilist_id!) ?? []), s]);
    const { data: rels } = await db.from('series_relations').select('from_series, to_series, kind').in('kind', ['sequel', 'prequel']);
    const linked = new Set((rels ?? []).flatMap((r) => [`${r.from_series}|${r.to_series}`, `${r.to_series}|${r.from_series}`]));
    for (const group of byManga.values()) {
      if (group.length < 2) continue;
      for (const s of group) {
        const isSequelLinked = group.some((o) => o.id !== s.id && linked.has(`${s.id}|${o.id}`));
        if (isSequelLinked && !scoped.has(s.id)) {
          await fileFlagOnce(runId, s.id, 'resolve', 'count_mismatch', {
            note: 'shares a manga with a sequel-linked series but has no series_scopes row — needs scope curation',
            mangaAnilistId: group[0] && all.find((x) => x.id === s.id)?.manga_anilist_id,
          });
          actions.push(`UNSCOPED shared-manga series flagged: ${s.id}`);
        }
      }
    }
    for (const scope of scopes) {
      const { data: s } = await db
        .from('series')
        .select('id, total_volumes, total_chapters, manga_start_volume, manga_start_chapter')
        .eq('id', scope.series_id)
        .maybeSingle();
      if (!s) {
        actions.push(`${scope.series_id}: not in canonical — skipped`);
        continue;
      }
      const next = {
        total_volumes: scope.end_volume ?? s.total_volumes,
        total_chapters: scope.end_chapter ?? s.total_chapters,
        manga_start_volume: scope.start_volume ?? s.manga_start_volume,
        manga_start_chapter: scope.start_chapter ?? s.manga_start_chapter,
      };
      const changed = (Object.keys(next) as (keyof typeof next)[]).some((k) => next[k] !== s[k]);
      if (!changed) {
        actions.push(`${scope.series_id}: already scoped`);
        continue;
      }
      const { error } = await db
        .from('series')
        .update({ ...next, updated_at: new Date().toISOString() })
        .eq('id', s.id);
      if (error) throw new Error(`${scope.series_id}: ${error.message}`);
      // a curated scope satisfies the discovery guard's flag for this slug
      await db
        .from('ingest_flags')
        .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
        .in('series_key', [scope.series_id, scope.afl_slug ?? scope.series_id])
        .eq('status', 'open')
        .eq('kind', 'count_mismatch')
        .contains('detail', { note: 'shares a manga with a sequel-linked series but has no series_scopes row — needs scope curation' });
      actions.push(
        `${scope.series_id}: vol ${next.manga_start_volume ?? 1}-${next.total_volumes ?? '—'} · ch ${next.manga_start_chapter ?? 1}-${next.total_chapters ?? '—'}`,
      );
    }
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'scopes apply');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
