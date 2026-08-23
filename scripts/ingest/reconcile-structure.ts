// Structure reconciliation (Sean's AoT finding 2026-08-24: episodes table
// reached 89 while components summed 87 — the Final Chapters specials aired
// AFTER the stitch, and every gate treats +2 as tolerance so nothing re-ran).
// Repeatable rule: whenever a series' episode numbering outruns its
// component structure BY ANY AMOUNT, walk the AniList chain to the episodes'
// end (ownership-guarded, bridge formats included). Chain confirms (±2/lag)
// → structure rebuilds (id/title/afl_slug preserved, scope applied). No
// confirm → accepted-extras flag; nothing is guessed. Ruled extras (episodes
// with no AniList entries, accepted by Sean) are skipped by name.
//   npx tsx --env-file=.env.ingest scripts/ingest/reconcile-structure.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { stageAniList, applyScope, EXTRAS_ADOPTED, applyEpisodeFloor } from './lib/resolve';
import { aired, walkChain, aggregate, writeComponents, ownedAnilistIds } from './lib/chain';

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];
  try {
    const epMax = new Map<string, number>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('episodes').select('series_id, number').range(from, from + 999);
      for (const r of data ?? []) epMax.set(r.series_id, Math.max(epMax.get(r.series_id) ?? 0, r.number));
      if (!data || data.length < 1000) break;
    }
    const compEnd = new Map<string, number>();
    for (let from = 0; ; from += 1000) {
      const { data } = await db.from('series_components').select('series_id, episode_end').range(from, from + 999);
      for (const r of data ?? []) {
        if (r.episode_end != null) compEnd.set(r.series_id, Math.max(compEnd.get(r.series_id) ?? 0, r.episode_end));
      }
      if (!data || data.length < 1000) break;
    }
    const { data: series } = await db
      .from('series')
      .select('id, afl_slug, anilist_id, title, aired_episodes, total_episodes, status');

    for (const s of series ?? []) {
      try {
        const eps = epMax.get(s.id) ?? 0;
        const covered = Math.max(compEnd.get(s.id) ?? 0, s.total_episodes ?? 0, s.aired_episodes ?? 0);
        if (!eps || !s.anilist_id || eps <= covered) continue;
        // ruled extras ADOPT the episode count (Sean's invariant: displayed
        // totals can never be lower than our own episode numbering) — the
        // same floor every totals writer now applies, so refreshes keep it
        if (EXTRAS_ADOPTED.has(s.id)) {
          const floor = { aired_episodes: s.aired_episodes, total_episodes: s.total_episodes };
          applyEpisodeFloor(s.id, floor, eps);
          await db.from('series').update({ ...floor, updated_at: new Date().toISOString() }).eq('id', s.id);
          counters.changed++;
          actions.push(`${s.id}: ADOPTED ruled extras — totals floored to ${eps}`);
          continue;
        }

        const owned = await ownedAnilistIds(s.id);
        const { chain, ambiguity } = await walkChain(s.anilist_id, eps, owned);
        const chainAired = chain.reduce((sum, m) => sum + aired(m), 0);
        // no progress = the structure is already the best the chain knows;
        // a 1-2 episode overshoot (recap/ep-0 numbering) floors the totals
        // (invariant), larger unexplained ones flag for research
        if (!ambiguity && chain.length && chainAired <= covered) {
          if (eps - covered <= 2) {
            const floor = { aired_episodes: s.aired_episodes, total_episodes: s.total_episodes };
            applyEpisodeFloor(s.id, floor, eps);
            await db.from('series').update({ ...floor, updated_at: new Date().toISOString() }).eq('id', s.id);
            await db
              .from('ingest_flags')
              .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
              .eq('series_key', s.id)
              .eq('kind', 'count_mismatch')
              .eq('status', 'open');
            counters.changed++;
            actions.push(`${s.id}: FLOORED totals to ${eps} (small numbering overshoot)`);
          }
          continue;
        }
        const lagOk = chainAired > eps && chain.length > 0 && chainAired - eps <= aired(chain[chain.length - 1]);
        if (!chain.length || ambiguity || (Math.abs(chainAired - eps) > 2 && !lagOk)) {
          await fileFlagOnce(runId, s.id, 'resolve', 'count_mismatch', {
            stage: 'reconcile-structure',
            episodesMax: eps,
            structureCovered: covered,
            chainAired,
            ambiguity,
            note: 'episodes outrun the component structure and the AniList chain cannot confirm — accepted-extras candidate or relation-graph gap; rule per-case',
          });
          counters.flagged++;
          actions.push(`FLAGGED ${s.id}: eps ${eps} vs structure ${covered}, chain ${chainAired}`);
          continue;
        }

        for (const m of chain) await stageAniList(m);
        const row = aggregate(chain, s.afl_slug, s.title);
        row.id = s.id; // canonical id/title/afl_slug are stable — structure only
        row.title = s.title;
        Object.assign(
          row,
          await applyScope(s.afl_slug ?? s.id, {
            total_volumes: row.total_volumes,
            total_chapters: row.total_chapters,
            manga_start_volume: row.manga_start_volume,
            manga_start_chapter: row.manga_start_chapter,
          }),
        );
        applyEpisodeFloor(s.id, row, eps);
        const { error } = await db.from('series').upsert(row);
        if (error) throw new Error(error.message);
        await writeComponents(s.id, chain, s.afl_slug);
        await db
          .from('ingest_flags')
          .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
          .in('series_key', [s.id, s.afl_slug ?? s.id])
          .eq('kind', 'count_mismatch')
          .eq('status', 'open');
        counters.changed++;
        actions.push(
          `RECONCILED ${s.id}: structure ${covered} → ${chainAired} (${chain.map((m) => m.id).join(' → ')})`,
        );
      } catch (e) {
        actions.push(`${s.id}: ERROR ${String(e).slice(0, 120)}`);
      }
    }

    await finishRun(runId, 'ok', counters, 'structure reconciliation');
    console.log('\n=== STRUCTURE RECONCILIATION ===');
    for (const a of actions) console.log('  -', a);
    if (!actions.length) console.log('  all structures cover their episodes — nothing to do');
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
