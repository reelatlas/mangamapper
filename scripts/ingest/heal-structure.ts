// Re-plan series_components for every series with a RULED_STRUCTURE entry
// (rule I39, batch 19 E4, 2026-08-26): numbered extras (OVAs / specials /
// movies with their own AniList id) and span overrides land through the
// same planner every chain writer uses (lib/chain.ts#planComponents), so a
// rebuild from the AniList chain and this healer agree row for row (P2).
// Chain members are the stored non-extra components in season_order, with
// aired counts from staged AniList media (getMedia — staging first, network
// only for an unstaged id); order-only rows (null span, not a ruled extra)
// are carried as order-only extras after their predecessor. Idempotent;
// standard HEAL roster, before heal-format (formats derive from kinds).
//   npx tsx --env-file=.env.ingest scripts/ingest/heal-structure.ts [--dry-run]
import { db, selectAll, startRun, finishRun } from './lib/db';
import { aired, getMedia, KIND_BY_FORMAT, planComponents, writeComponents, type PlanMember } from './lib/chain';
import { ENTRIES, RULED_EXTRA_KEYS } from './lib/rulings/structure';

const DRY = process.argv.includes('--dry-run');

type StoredComponent = { series_id: string; anilist_id: number; season_order: number; episode_start: number | null; episode_end: number | null; label: string | null; kind: string; afl_slug: string | null };

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    for (const e of ENTRIES) {
      const sid = e.seriesId;
      const stored = await selectAll<StoredComponent>('series_components', '*', (q) => q.eq('series_id', sid).order('season_order'));
      if (!stored.length) { console.log(`  ${sid}: no components stored — skipped (stitch first)`); counters.flagged++; continue; }
      const chainRows = stored.filter((c) => !RULED_EXTRA_KEYS.has(`${sid}:${c.anilist_id}`));
      const members: PlanMember[] = [];
      const orderOnly: { id: number; after: number }[] = [];
      let prev: number | null = null;
      const media = [];
      for (const c of chainRows) {
        const m = await getMedia(c.anilist_id);
        if (!m) throw new Error(`${sid}: AniList ${c.anilist_id} unavailable`);
        if (c.episode_start == null && c.episode_end == null && aired(m) > 0 && prev != null && c.kind !== 'season') {
          // an order-only row (in-flow, no episode rows) stays order-only
          orderOnly.push({ id: c.anilist_id, after: prev });
          continue;
        }
        media.push(m);
        members.push({ id: m.id, aired: aired(m), label: m.title.romaji, kind: KIND_BY_FORMAT[m.format ?? ''] ?? 'season', closed: m.episodes != null || !!m.nextAiringEpisode });
        prev = m.id;
      }
      counters.fetched++;
      const plan = planComponents(sid, members, orderOnly);
      const key = (r: { anilist_id: number; season_order: number; episode_start: number | null; episode_end: number | null; kind: string }) => `${r.anilist_id}|${r.season_order}|${r.episode_start ?? '-'}|${r.episode_end ?? '-'}|${r.kind}`;
      const before = stored.map(key).sort().join(';');
      const after = plan.map(key).sort().join(';');
      if (before === after) { counters.unchanged++; continue; }
      console.log(`  ${sid}:`);
      for (const r of plan) {
        const was = stored.find((c) => c.anilist_id === r.anilist_id);
        const span = `${r.episode_start ?? '-'}-${r.episode_end ?? '-'}`;
        const wasSpan = was ? `${was.episode_start ?? '-'}-${was.episode_end ?? '-'}` : 'NEW';
        if (!was || wasSpan !== span || was.kind !== r.kind) console.log(`    #${r.season_order} ${r.kind} [${r.anilist_id}] ${wasSpan} → ${span} ${String(r.label ?? '').slice(0, 40)}`);
      }
      if (!DRY) await writeComponents(sid, media, stored[0].afl_slug ?? null, orderOnly);
      counters.changed++;
    }
    console.log(`[heal-structure] ${counters.changed} series re-planned, ${counters.unchanged} already current${DRY ? ' (dry run)' : ''}`);
    await finishRun(runId, 'ok', counters, `heal-structure: ${counters.changed} re-planned`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0));
