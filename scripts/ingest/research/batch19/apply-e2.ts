// Batch 19 E2 — purge the namesake contamination (rule G55, 2026-08-26).
// Three series hold episode rows whose titles and air dates belong to a
// DIFFERENT show: the wiki backfill merged a namesake's list page (the
// 1996 Rurouni Kenshin, 2001 Beyblade, the 2021 Ranking of Kings main
// series). The rows themselves are ours (numbered positions inside the
// aired count); only the borrowed title + date are wiped — the honest gap
// (P6) until the correct page fills them. Types, anchors and annotations
// on the rows are untouched. Curated list with the evidence inline (the
// apply-batch principle); the G55 census class proves the outcome and the
// G55 writer gate keeps it from recurring. Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-e2.ts [--dry-run]
import { db, selectAll } from '../../lib/db';
import { dateFit, windowExempt } from '../../lib/wiki-identity';

const dry = process.argv.includes('--dry-run');

/** every row listed must ALSO fail the G55 predicate against the stored series dates — the list is the ruling, the gate is the proof */
const PURGE: { seriesId: string; episodes: number[]; reason: string }[] = [
  {
    seriesId: 'rurouni-kenshin-2023',
    episodes: [25, 26, 27],
    reason:
      'Rows 25-27 carry "The Crimson Pirate" 1996-08-28, "Lightning Incarnate" 1996-09-04, "Burn, Island of Terror!" 1996-10-16 — the 1996 series\' episodes 25-27 (List of Rurouni Kenshin episodes). Our series started 2023-07-07; our 25-47 are the 2024-2025 Kyoto Disturbance season, unfilled by AFL (max 24).',
  },
  {
    seriesId: 'beyblade-x',
    episodes: Array.from({ length: 62 }, (_, i) => 41 + i),
    reason:
      'Rows 41-102 carry the 2001-2002 original Beyblade series ("Out of the Past" 2001-10-15 … "Destiny of The Final Battle" 2002-12-30) from "List of Beyblade episodes". BEYBLADE X started 2023-10-06; AFL reaches 40. Sixty-two rows, every one dated 22 years before the series.',
  },
  {
    seriesId: 'ranking-of-kings-the-treasure-chest-of-courage',
    episodes: Array.from({ length: 10 }, (_, i) => 1 + i),
    reason:
      'All ten rows carry the 2021 MAIN series\' first ten episodes ("The Prince\'s New Clothes" 2021-10-15 … "The Prince\'s Sword" 2021-12-17) from "List of Ranking of Kings episodes". The Treasure Chest of Courage spin-off aired 2023-04-14 → 2023-06-16. Found by the G55 catalog probe, not in the batch-19 plan.',
  },
];

const series = await selectAll<any>('series', 'id, start_date, end_date, status', (q) => q.in('id', PURGE.map((p) => p.seriesId)));
const sBy = new Map(series.map((s) => [s.id, s]));
let wiped = 0, already = 0, refusedToWipe = 0;
for (const p of PURGE) {
  const s = sBy.get(p.seriesId);
  if (!s) throw new Error(`${p.seriesId}: series not found`);
  const rows = await selectAll<any>('episodes', 'number, title, air_date, format', (q) => q.eq('series_id', p.seriesId).in('number', p.episodes));
  console.log(`\n== ${p.seriesId}: ${p.episodes.length} ruled rows — ${p.reason.slice(0, 100)}…`);
  for (const n of p.episodes) {
    const r = rows.find((x) => x.number === n);
    if (!r) { console.log(`  ep ${n}: no row`); continue; }
    if (!r.air_date && !String(r.title ?? '').trim()) { already++; continue; }
    const fit = dateFit(s, r.air_date);
    // a row that FITS the series (or has no date to judge by) is not proven contamination — refuse to wipe it, report
    if (r.air_date && (fit === 'fits' || windowExempt(p.seriesId, r))) { refusedToWipe++; console.log(`  ep ${n}: ${r.air_date} fits the series window — NOT wiped (rule the row, do not list it)`); continue; }
    console.log(`  ep ${n}: ${dry ? 'would wipe' : 'wipe'} "${String(r.title).slice(0, 40)}" ${r.air_date}`);
    if (!dry) {
      const { error } = await db.from('episodes').update({ title: '', air_date: null }).eq('series_id', p.seriesId).eq('number', n);
      if (error) throw new Error(error.message);
    }
    wiped++;
  }
}
console.log(`\n${dry ? 'DRY RUN — ' : ''}wiped ${wiped}, already clean ${already}, refused ${refusedToWipe}`);
process.exit(0);
