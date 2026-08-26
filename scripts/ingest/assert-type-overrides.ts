// Assert EPISODE_TYPE_OVERRIDES over STANDING rows (2026-08-25, the
// eyeshield ep-74 lesson): overrides re-apply inside filterEpisodeRows on
// every episode WRITE, but a ruling that enters the map after a row's last
// write leaves the stored row stale until the next source refresh — which
// the ruling_violation audit class then flags. This healer closes the gap
// mechanically: every override is asserted over the stored row now.
// Idempotent; pairs with the ruling_violation outcome check.
//   npx tsx --env-file=.env.ingest scripts/ingest/assert-type-overrides.ts [--dry-run]

import { db, selectAll } from './lib/db';
import { EPISODE_TYPE_OVERRIDES } from './lib/resolve';

const DRY = process.argv.includes('--dry-run');

async function main() {
  let fixed = 0, checked = 0;
  for (const [sid, map] of Object.entries(EPISODE_TYPE_OVERRIDES)) {
    const nums = Object.keys(map).map(Number);
    const rows = await selectAll<{ number: number; type: string }>('episodes', 'number, type', (q) => q.eq('series_id', sid).in('number', nums));
    for (const r of rows) {
      checked++;
      const want = map[r.number];
      if (r.type !== want) {
        console.log(`  ${sid} ep${r.number}: ${r.type} → ${want}`);
        if (!DRY) {
          const { error } = await db.from('episodes').update({ type: want }).eq('series_id', sid).eq('number', r.number);
          if (error) throw new Error(`${sid} ep${r.number}: ${error.message}`);
        }
        fixed++;
      }
    }
  }
  console.log(`[assert-type-overrides] ${checked} ruled rows checked, ${fixed} asserted${DRY ? ' — DRY RUN' : ''}`);
}
main().then(() => process.exit(0));
