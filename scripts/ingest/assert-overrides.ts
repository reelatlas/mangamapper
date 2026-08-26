// Assert the per-episode ruling maps over STANDING rows (T6 types, G53 air
// dates). Overrides re-apply inside filterEpisodeRows on every episode
// WRITE, but a ruling that enters a map after a row's last write leaves the
// stored row stale until the next source refresh — the eyeshield ep-74
// lesson (2026-08-25). This healer closes the gap mechanically; idempotent;
// pairs with the ruling_violation outcome check. Formerly
// assert-type-overrides.ts (renamed 2026-08-26 when air dates joined).
//   npx tsx --env-file=.env.ingest scripts/ingest/assert-overrides.ts [--dry-run]

import { db, selectAll } from './lib/db';
import { EPISODE_TYPE_OVERRIDES } from './lib/resolve';
import { AIR_DATE_OVERRIDES } from './lib/rulings/air-dates';

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

async function main() {
  await assertMap('types (T6)', EPISODE_TYPE_OVERRIDES, 'type');
  await assertMap('air dates (G53)', AIR_DATE_OVERRIDES, 'air_date');
}
main().then(() => process.exit(0));
