// sync-related-works — THE RELATED-WORKS LEDGER writer (I45; HEAL roster,
// standard; Sean 2026-09-05: "make sure we have recaps, specials, films and
// everything, then decide whether to surface"). Every staged related work of
// an owned series (the halo's extra / recap / crossover buckets, lib/discovery)
// becomes a watch_order_entries row with origin 'halo': identity, relation,
// kind (T29), standing BY RULE where a rule can (recap / original / crossover
// → filler; same- or other-instrument → null, the sitting's), a DERIVED
// position (after the last episode aired before it — a ruling by AniList id
// overrides), title, date and a note naming the bucket. It never writes
// display_label or the adaptation fields (rulings own them, N31), never
// deletes (a stale row is a census listing, related_work_stale — P24), and
// keeps a row's position once written (rulings key on it). Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/sync-related-works.ts [--dry-run]
import { db, finishRun, selectAll, startRun } from './lib/db';
import { haloCandidates, loadDiscoveryInput } from './lib/discovery';
import { deriveWatchPosition, extraKind, extraStanding, freePosition, isoDate, type ExtraBucket } from './lib/related-works';
import { RULED_POSITION_BY_ANILIST } from './lib/rulings/watch-order-labels';

const DRY = process.argv.includes('--dry-run');
const LEDGER_BUCKETS = new Set(['extra', 'recap', 'crossover']);

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const input = await loadDiscoveryInput();
    const cands = haloCandidates(input).filter((c) => LEDGER_BUCKETS.has(c.bucket) && c.proposal !== 'unstaged');
    const episodes = await selectAll<{ series_id: string; number: number; air_date: string | null }>('episodes', 'series_id, number, air_date');
    const epsBy = new Map<string, { number: number; air_date: string | null }[]>();
    for (const e of episodes) epsBy.set(e.series_id, [...(epsBy.get(e.series_id) ?? []), e]);
    const existing = await selectAll<{ series_id: string; position: number; anilist_id: number | null; origin: string; standing: string | null; kind: string | null; title: string; air_date: string | null; relation: string | null; note: string | null }>('watch_order_entries', 'series_id, position, anilist_id, origin, standing, kind, title, air_date, relation, note');
    const byKey = new Map(existing.filter((e) => e.anilist_id != null).map((e) => [`${e.series_id}#${e.anilist_id}`, e]));
    const takenBy = new Map<string, Set<number>>();
    for (const e of existing) takenBy.set(e.series_id, new Set([...(takenBy.get(e.series_id) ?? []), Number(e.position)]));
    let inserted = 0, updated = 0, unpositioned = 0, held = 0;
    for (const c of cands) {
      const m = input.staged.get(c.anilistId);
      const bucket = c.proposal as ExtraBucket;
      for (const sid of c.owners) {
        const key = `${sid}#${c.anilistId}`;
        const cur = byKey.get(key);
        const ruledPos = RULED_POSITION_BY_ANILIST[sid]?.[c.anilistId];
        const date = m ? isoDate((m as { startDate?: { year?: number | null; month?: number | null; day?: number | null } | null }).startDate) : null;
        const derived = ruledPos ?? deriveWatchPosition(date, epsBy.get(sid) ?? []);
        if (derived == null && !cur) { unpositioned++; continue; } // no date, no ruling — listed by the census, never a guessed slot
        const position = cur ? Number(cur.position) : freePosition(derived!, takenBy.get(sid) ?? new Set());
        const standing = extraStanding(bucket);
        if (standing == null) held++;
        const row = {
          series_id: sid, position, anilist_id: c.anilistId, origin: 'halo', relation: [...c.relations].join('/'),
          kind: extraKind(c.format, bucket), standing, title: c.title, air_date: date,
          note: `${bucket === 'recap' ? 'recap / compilation (filler by rule, N8: never a numbered row)' : bucket === 'original' ? 'original side story (source ORIGINAL — filler by T25)' : bucket === 'crossover' ? 'crossover by shared characters only (filler)' : bucket === 'same_instrument' ? "adapts the series' own instrument — standing and chapters pending the sitting / research" : bucket === 'other_instrument' ? 'adapts another instrument — a series candidate too (the KonoSuba-Explosion shape)' : 'an instrument source with no manga edge — held for Sean'} · position ${ruledPos != null ? 'ruled' : 'derived from the air date (a proposal)'} · I45 halo ${new Date().toISOString().slice(0, 10)}`,
        };
        const same = cur && cur.origin === 'halo' && cur.standing === standing && cur.kind === row.kind && cur.title === row.title && cur.air_date === row.air_date && cur.relation === row.relation;
        if (same) { counters.unchanged++; continue; }
        if (cur && cur.origin !== 'halo') { counters.unchanged++; continue; } // a wiki / ruled row already models this work — never overwritten here
        if (cur) updated++; else { inserted++; takenBy.set(sid, new Set([...(takenBy.get(sid) ?? []), position])); }
        if (DRY) { if (inserted + updated <= 25) console.log(`  ${cur ? 'update' : 'insert'} ${sid} @${position} ${c.title} [${row.kind} ${standing ?? 'pending'}] ${bucket}`); continue; }
        const { error } = await db.from('watch_order_entries').upsert({ ...row, display_label: cur ? undefined : null }, { onConflict: 'series_id,position' });
        if (error) throw new Error(`${key}: ${error.message}`);
      }
    }
    counters.changed = inserted + updated; counters.flagged = unpositioned;
    console.log(`[sync-related-works] ${cands.length} staged related works → ${inserted} inserted, ${updated} updated, ${counters.unchanged} unchanged, ${held} standing pending (the sitting), ${unpositioned} without a derivable position${DRY ? ' — DRY RUN' : ''}`);
    await finishRun(runId, 'ok', counters, `related-works ledger: ${inserted} inserted, ${updated} updated${DRY ? ' (dry run)' : ''}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
