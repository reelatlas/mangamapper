// Multi-AFL-page merges (franchise-rulings.md): some rulings join several AFL
// pages into ONE canonical series (SAO + Alicization; later the recovered
// Food Wars plates). Each absorbed page's episodes renumber into the base's
// continuous numbering via afl_offset, and its components append in order.
//   npx tsx --env-file=.env.ingest scripts/ingest/merge.ts

import { db, startRun, finishRun } from './lib/db';

const MERGES: { baseAfl: string; absorb: string[]; note: string }[] = [
  {
    baseAfl: 'sword-art-online',
    absorb: ['sword-art-online-alicization'],
    note: 'SAO ruling: Alicization = seasons 3+ of the one SAO series (franchise-rulings.md)',
  },
];

async function main() {
  const runId = await startRun('resolve');
  const actions: string[] = [];

  try {
    for (const merge of MERGES) {
      const { data: base } = await db.from('series').select('*').eq('afl_slug', merge.baseAfl).maybeSingle();
      if (!base) {
        actions.push(`SKIP ${merge.baseAfl}: base not in canonical`);
        continue;
      }

      for (const absorbSlug of merge.absorb) {
        const { data: victim } = await db.from('series').select('*').eq('afl_slug', absorbSlug).maybeSingle();
        if (!victim) {
          actions.push(`SKIP ${absorbSlug}: not in canonical (already merged?)`);
          continue;
        }

        const { data: baseEps } = await db
          .from('episodes')
          .select('number')
          .eq('series_id', base.id)
          .order('number', { ascending: false })
          .limit(1);
        const offset = baseEps?.[0]?.number ?? 0;

        const { data: victimEps } = await db.from('episodes').select('*').eq('series_id', victim.id);
        const { data: victimComps } = await db
          .from('series_components')
          .select('*')
          .eq('series_id', victim.id)
          .order('season_order');
        const { data: baseComps } = await db
          .from('series_components')
          .select('season_order')
          .eq('series_id', base.id)
          .order('season_order', { ascending: false })
          .limit(1);
        const orderOffset = baseComps?.[0]?.season_order ?? 0;

        // absorbed rows move under the base BEFORE deleting the victim row
        const movedEps = (victimEps ?? []).map((e) => ({
          ...e,
          series_id: base.id,
          number: e.number + offset,
        }));
        const movedComps = (victimComps ?? []).map((c) => ({
          ...c,
          series_id: base.id,
          season_order: c.season_order + orderOffset,
          episode_start: c.episode_start != null ? c.episode_start + offset : null,
          episode_end: c.episode_end != null ? c.episode_end + offset : null,
          afl_offset: offset,
        }));

        const { error: delErr } = await db.from('series').delete().eq('id', victim.id);
        if (delErr) throw new Error(`delete ${victim.id}: ${delErr.message}`);
        for (let i = 0; i < movedEps.length; i += 500) {
          const { error } = await db.from('episodes').insert(movedEps.slice(i, i + 500));
          if (error) throw new Error(`episodes move (${absorbSlug}): ${error.message}`);
        }
        if (movedComps.length) {
          const { error } = await db.from('series_components').insert(movedComps);
          if (error) throw new Error(`components move (${absorbSlug}): ${error.message}`);
        }

        // combined aggregates: sums where both known, victim's currency wins
        const { error: updErr } = await db
          .from('series')
          .update({
            aired_episodes: base.aired_episodes + victim.aired_episodes,
            total_episodes:
              base.total_episodes != null && victim.total_episodes != null
                ? base.total_episodes + victim.total_episodes
                : null,
            status: victim.status === 'finished' ? base.status === 'finished' ? 'finished' : base.status : victim.status,
            end_date: victim.end_date ?? null,
            next_airing_at: victim.next_airing_at ?? base.next_airing_at,
            popularity: Math.max(base.popularity, victim.popularity),
            average_score: base.average_score ?? victim.average_score,
            updated_at: new Date().toISOString(),
          })
          .eq('id', base.id);
        if (updErr) throw new Error(`update ${base.id}: ${updErr.message}`);

        await db
          .from('source_map')
          .update({ disposition: 'merged', note: merge.note, updated_at: new Date().toISOString() })
          .eq('afl_slug', absorbSlug);
        await db
          .from('ingest_flags')
          .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
          .eq('series_key', absorbSlug)
          .eq('status', 'open');

        actions.push(
          `MERGED ${absorbSlug} into ${base.id}: +${movedEps.length} eps at offset ${offset}, +${movedComps.length} components`,
        );
      }
    }

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: actions.length, flagged: 0 }, 'page merges');
    console.log('=== MERGE COMPLETE ===');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}

main().then(() => process.exit(0));
