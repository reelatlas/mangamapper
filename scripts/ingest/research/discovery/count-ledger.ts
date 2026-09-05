// the related-works ledger by origin / standing / position / label — a read for the sitting recap (I45)
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/count-ledger.ts [--owner <series-id>]   (--owner: that series' stored rows, every origin, in position order)
import { selectAll } from '../../lib/db';
async function main() {
  const i = process.argv.indexOf('--owner'); const owner = i > 0 ? process.argv[i + 1] : null;
  if (owner) {
    const eps = await selectAll<{ number: number; title: string | null; air_date: string | null; type: string | null }>('episodes', 'number, title, air_date, type', (q) => q.eq('series_id', owner));
    const ledger = await selectAll<{ position: number; title: string; kind: string | null; standing: string | null; origin: string | null; display_label: string | null; air_date: string | null; note: string | null }>('watch_order_entries', 'position, title, kind, standing, origin, display_label, air_date, note', (q) => q.eq('series_id', owner));
    console.log(`| position | title | kind | standing | origin | label | air date | note |`); console.log('|---|---|---|---|---|---|---|---|');
    const all = [...eps.map((e) => ({ pos: Number(e.number), line: `| ${e.number} | ${e.title ?? ''} | episode | ${e.type ?? ''} | — | — | ${e.air_date ?? ''} | |` })), ...ledger.map((w) => ({ pos: Number(w.position), line: `| ${w.position} | ${w.title} | ${w.kind ?? ''} | ${w.standing ?? 'pending'} | ${w.origin ?? ''} | ${w.display_label ?? '—'} | ${w.air_date ?? ''} | ${(w.note ?? '').slice(0, 90)} |` }))].sort((a, b) => a.pos - b.pos);
    for (const r of all) console.log(r.line);
    return;
  }
  const rows = await selectAll<{ origin: string | null; standing: string | null; position: number | null; kind: string | null; display_label: string | null }>('watch_order_entries', 'origin, standing, position, kind, display_label');
  const by = new Map<string, number>();
  for (const r of rows) { const k = `${r.origin ?? 'null'} | standing=${r.standing ?? 'null'} | pos=${r.position == null ? 'null' : 'set'} | label=${r.display_label ? 'yes' : 'no'}`; by.set(k, (by.get(k) ?? 0) + 1); }
  for (const [k, v] of [...by].sort()) console.log(String(v).padStart(5), k);
  const kinds = new Map<string, number>(); for (const r of rows) if (r.origin === 'halo') kinds.set(r.kind ?? 'null', (kinds.get(r.kind ?? 'null') ?? 0) + 1);
  console.log('halo kinds:', [...kinds].sort().map(([k, v]) => `${k}=${v}`).join(' '));
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
