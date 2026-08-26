// Assert the per-episode ruling maps over STANDING rows (T6 types, G53 air
// dates) and the G54 air-date order gate. Overrides re-apply inside
// filterEpisodeRows on every episode WRITE, but a ruling that enters a map
// after a row's last write leaves the stored row stale until the next
// source refresh — the eyeshield ep-74 lesson (2026-08-25). This healer
// closes the gap mechanically; idempotent; pairs with the ruling_violation
// and airdate_withheld outcome checks. Formerly assert-type-overrides.ts
// (renamed 2026-08-26 when air dates joined; G54 joined the same day).
//   npx tsx --env-file=.env.ingest scripts/ingest/assert-overrides.ts [--dry-run]

import { db, selectAll } from './lib/db';
import { EPISODE_TYPE_OVERRIDES } from './lib/resolve';
import { AIR_DATE_OVERRIDES } from './lib/rulings/air-dates';
import { airdateOrderWalk } from './lib/airdate-order';

const DRY = process.argv.includes('--dry-run');

async function assertMap(label: string, map: Record<string, Record<number, string>>, column: 'type' | 'air_date') {
  let fixed = 0, checked = 0;
  for (const [sid, m] of Object.entries(map)) {
    const nums = Object.keys(m).map(Number);
    const rows = await selectAll<{ number: number; type: string; air_date: string | null }>('episodes', 'number, type, air_date', (q) => q.eq('series_id', sid).in('number', nums));
    for (const r of rows) {
      checked++;
      const want = m[r.number];
      if (r[column] !== want) {
        console.log(`  ${sid} ep${r.number} ${column}: ${r[column]} → ${want}`);
        if (!DRY) {
          const { error } = await db.from('episodes').update({ [column]: want }).eq('series_id', sid).eq('number', r.number);
          if (error) throw new Error(`${sid} ep${r.number}: ${error.message}`);
        }
        fixed++;
      }
    }
  }
  console.log(`[assert-overrides] ${label}: ${checked} ruled rows checked, ${fixed} asserted${DRY ? ' — DRY RUN' : ''}`);
}

// G54: the air-date order gate over STANDING rows — the same walk the write
// gate runs; a deep out-of-order date that entered before the rule is
// withheld (NULL) here. Nothing is deleted; the audit class airdate_withheld
// (stored NULL where AFL staging has a date) is the review queue.
async function assertAirdateOrder() {
  const rows = await selectAll<{ series_id: string; number: number; air_date: string | null }>('episodes', 'series_id, number, air_date', (q) => q.not('air_date', 'is', null));
  const by = new Map<string, { number: number; air_date: string | null }[]>();
  for (const r of rows) {
    if (!by.has(r.series_id)) by.set(r.series_id, []);
    by.get(r.series_id)!.push(r);
  }
  let withheld = 0;
  for (const [sid, rs] of by) {
    const { withheld: w } = airdateOrderWalk(sid, rs);
    for (const x of w) {
      console.log(`  ${sid} ep${x.number} air_date ${x.date} → NULL (${x.days} d out of order against ep${x.against} ${x.againstDate}; G54)`);
      if (!DRY) {
        const { error } = await db.from('episodes').update({ air_date: null }).eq('series_id', sid).eq('number', x.number);
        if (error) throw new Error(`${sid} ep${x.number}: ${error.message}`);
      }
      withheld++;
    }
  }
  console.log(`[assert-overrides] air-date order (G54): ${by.size} series walked, ${withheld} dates withheld${DRY ? ' — DRY RUN' : ''}`);
}

async function main() {
  await assertMap('types (T6)', EPISODE_TYPE_OVERRIDES, 'type');
  await assertMap('air dates (G53)', AIR_DATE_OVERRIDES, 'air_date');
  await assertAirdateOrder();
}
main().then(() => process.exit(0));
