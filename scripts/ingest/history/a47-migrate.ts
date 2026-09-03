// A47 backlog migration (the END-side sliver over STANDING manual anchors —
// the batch-14 A10 shape, consolidate deep after wave 8, 2026-09-02). Lists
// every manual anchor whose END the rule moves (lib/sliver.ts#sliverEnd,
// the ONE derivation, P2) with its continue and whether a `partial` already
// names the tail; with --apply it writes END := derived, stamps the row's
// note with the A47 marker (N22: per-row marker, never a sentinel value —
// re-runs select on its ABSENCE through the derivation itself, which is
// idempotent), and upserts partial{tail} so the tail stays visible. The
// continue is untouched (it already points at the next episode's START).
// SEAN SIGNS THIS AS ONE BLOCK before --apply (the ledger record: a listing
// class, Sean signs each move; this script is how "each" becomes one
// decision with the full list in front of him).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/a47-migrate.ts [--apply]
import { db, selectAll, startRun, finishRun } from '../lib/db';
import { sliverEnd } from '../lib/sliver';
import { upsertAnnotation } from '../lib/annotations';

const APPLY = process.argv.includes('--apply');
const MARK = '[A47 migrated 2026-09-02]';

async function main() {
  const anchors = await selectAll<any>('chapter_anchors', 'series_id, episode, chapter, start_chapter, chapters_adapted, source, note, continue_chapter', (q) => q.eq('source', 'manual').order('series_id').order('episode'));
  const partials = new Set((await selectAll<any>('episode_annotations', 'series_id, episode, kind', (q) => q.eq('kind', 'partial'))).map((a) => `${a.series_id}#${a.episode}`));
  const bySeries = new Map<string, any[]>();
  for (const a of anchors) { if (!bySeries.has(a.series_id)) bySeries.set(a.series_id, []); bySeries.get(a.series_id)!.push(a); }
  const moves: { a: any; end: number; tail: string; pages: number; next: any }[] = [];
  for (const [, list] of bySeries) {
    list.sort((x, y) => x.episode - y.episode);
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      if (!a.chapters_adapted) continue;
      const next = list[i + 1];
      const v = sliverEnd(a.chapters_adapted, a.chapter, next ? (next.start_chapter ?? next.chapter) : null);
      if (v.end !== a.chapter) moves.push({ a, end: v.end, tail: v.tail, pages: v.pages, next });
    }
  }
  console.log(`${moves.length} standing manual anchor(s) advance on an owned tail (A47)${APPLY ? ' — APPLYING' : ' — DRY RUN'}`);
  console.log('| series | ep | END | → | tail | continue | partial |');
  for (const m of moves) {
    console.log(`| ${m.a.series_id} | ${m.a.episode} | ${m.a.chapter} | ${m.end} | ${m.tail.slice(0, 44)} (≈${m.pages || '?'} p; ep ${m.next.episode} starts ${m.next.start_chapter ?? m.next.chapter}) | ${m.a.continue_chapter ?? '·'} | ${partials.has(`${m.a.series_id}#${m.a.episode}`) ? 'has' : 'add'} |`);
  }
  if (!APPLY) return;
  const runId = await startRun('resolve');
  let n = 0;
  for (const m of moves) {
    const note = `${MARK} END ${m.a.chapter} → ${m.end}: the tail '${m.tail.slice(0, 60)}' is ep ${m.next.episode}'s (starts on it). ${m.a.note ?? ''}`.slice(0, 600);
    const { error } = await db.from('chapter_anchors').update({ chapter: m.end, note }).eq('series_id', m.a.series_id).eq('episode', m.a.episode);
    if (error) throw new Error(`${m.a.series_id} ep${m.a.episode}: ${error.message}`);
    if (!partials.has(`${m.a.series_id}#${m.a.episode}`)) {
      await upsertAnnotation({ series_id: m.a.series_id, episode: m.a.episode, kind: 'partial', chapters: m.tail.slice(0, 120), note: `A47 (Sean 2026-09-02): the tail of ch ${m.a.chapter} is ep ${m.next.episode}'s; END stays ${m.end}. ${MARK}`, origin: 'research' });
    }
    n++;
  }
  // REVERT pass (2026-09-02, the d-gray-man 66 catch): a marked row whose tail is its ONLY segment was moved to a
  // chapter it never adapts — the refined rule (sole-segment) no longer moves it; restore END from the marker text.
  let reverted = 0;
  for (const a of await selectAll<any>('chapter_anchors', 'series_id, episode, chapter, chapters_adapted, note', (q) => q.eq('source', 'manual').like('note', `${MARK}%`))) {
    const v = sliverEnd(a.chapters_adapted, a.chapter + 1, a.chapter + 1); // re-derive from the ORIGINAL end (marker rows moved by exactly one)
    if (v.reason !== 'sole-segment') continue;
    const m = String(a.note).match(/END (\d+) → (\d+):/);
    const orig = m ? Number(m[1]) : a.chapter + 1;
    const note = `(A47 revert) ${String(a.note).replace(/^\[A47 migrated 2026-09-02\] END \d+ → \d+: [^.]*\. /, '')}`.slice(0, 600);
    console.log(`  REVERT ${a.series_id} ep ${a.episode}: END ${a.chapter} → ${orig} (the tail is the row's only record — A44 judgment, not a derivation)`);
    const { error } = await db.from('chapter_anchors').update({ chapter: orig, note }).eq('series_id', a.series_id).eq('episode', a.episode);
    if (error) throw new Error(`${a.series_id} ep${a.episode} revert: ${error.message}`);
    reverted++;
  }
  if (reverted) console.log(`[a47-migrate] ${reverted} reverted (sole-segment rows)`);
  // a moved END can step back across a volume boundary — re-derive the volume from the boundary table for every marked row (the first run left 4 stale: oshi-no-ko 21, saint-seiya 112, dbz-kai 93 / 132)
  let vols = 0;
  const marked = await selectAll<any>('chapter_anchors', 'series_id, episode, chapter, volume', (q) => q.eq('source', 'manual').or(`note.like.${MARK}%,note.like.%(A47 revert)%`));
  const seriesIds = [...new Set(marked.map((m) => m.series_id))];
  const mangaOf = new Map((await selectAll<any>('series', 'id, manga_anilist_id', (q) => q.in('id', seriesIds))).map((s) => [s.id, s.manga_anilist_id]));
  const bounds = await selectAll<any>('volume_boundaries', 'manga_anilist_id, volume, chapter_start, chapter_end', (q) => q.in('manga_anilist_id', [...new Set([...mangaOf.values()].filter(Boolean))]));
  for (const m of marked) {
    const b = bounds.find((x) => x.manga_anilist_id === mangaOf.get(m.series_id) && x.chapter_start <= m.chapter && (x.chapter_end == null || m.chapter <= x.chapter_end));
    if (!b || b.volume === m.volume) continue;
    console.log(`  volume ${m.series_id} ep ${m.episode} (ch ${m.chapter}): v${m.volume} → v${b.volume} (boundary table)`);
    const { error } = await db.from('chapter_anchors').update({ volume: b.volume }).eq('series_id', m.series_id).eq('episode', m.episode);
    if (error) throw new Error(`${m.series_id} ep${m.episode} volume: ${error.message}`);
    vols++;
  }
  await finishRun(runId, 'ok', { fetched: anchors.length, unchanged: anchors.length - n, changed: n + vols, flagged: 0 }, `a47-migrate: ${n} END(s) moved off owned tails, ${vols} volume(s) re-derived`);
  console.log(`[a47-migrate] ${n} applied`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
