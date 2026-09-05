// the related-works ledger by origin / standing / position / label — a read for the sitting recap (I45)
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/count-ledger.ts
import { selectAll } from '../../lib/db';
async function main() {
  const rows = await selectAll<{ origin: string | null; standing: string | null; position: number | null; kind: string | null; display_label: string | null }>('watch_order_entries', 'origin, standing, position, kind, display_label');
  const by = new Map<string, number>();
  for (const r of rows) { const k = `${r.origin ?? 'null'} | standing=${r.standing ?? 'null'} | pos=${r.position == null ? 'null' : 'set'} | label=${r.display_label ? 'yes' : 'no'}`; by.set(k, (by.get(k) ?? 0) + 1); }
  for (const [k, v] of [...by].sort()) console.log(String(v).padStart(5), k);
  const kinds = new Map<string, number>(); for (const r of rows) if (r.origin === 'halo') kinds.set(r.kind ?? 'null', (kinds.get(r.kind ?? 'null') ?? 0) + 1);
  console.log('halo kinds:', [...kinds].sort().map(([k, v]) => `${k}=${v}`).join(' '));
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
