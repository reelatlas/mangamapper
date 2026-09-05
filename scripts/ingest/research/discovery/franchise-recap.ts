// THE FRANCHISE SIGNING TABLE (I43): generated from the ruling map + the
// database — one row per franchise, its members with the evidence edges,
// STORED franchise_id first, then the proposal, then Sean's decision column.
// Paste into the chat; never point Sean at the map for the baseline.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/franchise-recap.ts [--compact]   (compact = one row per franchise)
import { selectAll } from '../../lib/db';
import { ENTRIES, FRANCHISES, OWN_IP } from '../../lib/rulings/franchises';

async function main() {
  const series = await selectAll<{ id: string; title: string; start_date: string | null; popularity: number; franchise_id: string | null }>('series', 'id, title, start_date, popularity, franchise_id');
  const by = new Map(series.map((s) => [s.id, s]));
  const rels = await selectAll<{ from_series: string; to_series: string; kind: string }>('series_relations', 'from_series, to_series, kind');
  const edge = (a: string) => rels.filter((r) => r.from_series === a).map((r) => `${r.kind} → ${r.to_series}`).join('; ');
  const entries = new Map(ENTRIES.map((e) => [e.seriesId, e]));
  const compact = process.argv.includes('--compact');
  console.log(`### Franchise signing table — ${Object.keys(FRANCHISES).length} franchises · ${Object.values(FRANCHISES).reduce((n, f) => n + f.members.length, 0)} memberships · ${OWN_IP.size} own-IP rulings (generated ${new Date().toISOString().slice(0, 10)})\n`);
  if (compact) {
    console.log('| franchise (title) | members — base first · year | stored | proposed | decision |');
    console.log('|---|---|---|---|---|');
    for (const [id, f] of Object.entries(FRANCHISES).sort((a, b) => b[1].members.length - a[1].members.length || a[0].localeCompare(b[0]))) {
      const ordered = [f.base!, ...f.members.filter((m) => m !== f.base)];
      const stored = [...new Set(ordered.map((m) => by.get(m)?.franchise_id ?? 'null'))].join(' / ');
      const notes = ordered.map((m) => entries.get(m)!.value.note).filter(Boolean);
      console.log(`| **${id}** (${f.title}) | ${ordered.map((m) => `${m} ${by.get(m)?.start_date?.slice(0, 4) ?? '?'}`).join(' · ')} | ${stored} | one IP, ${ordered.length} series${notes.length ? ` — ${notes.join('; ')}` : ''} | |`);
    }
    for (const m of OWN_IP) console.log(`| — | ${m} ${by.get(m)?.start_date?.slice(0, 4) ?? '?'} | ${by.get(m)?.franchise_id ?? 'null'} | own IP (null) — AniList OTHER edge only | |`);
    return;
  }
  console.log('| franchise | member | year · pop | relations (stored) | stored franchise_id | proposed | decision |');
  console.log('|---|---|---|---|---|---|---|');
  for (const [id, f] of Object.entries(FRANCHISES).sort((a, b) => b[1].members.length - a[1].members.length || a[0].localeCompare(b[0]))) {
    for (const m of f.members) {
      const s = by.get(m);
      const e = entries.get(m)!;
      console.log(`| **${id}** (${f.title}) | ${m}${f.base === m ? ' (base)' : ''} | ${s?.start_date?.slice(0, 4) ?? '?'} · ${s?.popularity ?? '?'} | ${edge(m) || '—'} | ${s?.franchise_id ?? 'null'} | **${id}**${e.value.note ? ` — ${e.value.note}` : ''} | |`);
    }
  }
  for (const m of OWN_IP) {
    const s = by.get(m);
    console.log(`| — | ${m} | ${s?.start_date?.slice(0, 4) ?? '?'} · ${s?.popularity ?? '?'} | ${edge(m) || '— (AniList OTHER edge only)'} | ${s?.franchise_id ?? 'null'} | **own IP (null)** — ${entries.get(m)!.reason.slice(0, 120)}… | |`);
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
