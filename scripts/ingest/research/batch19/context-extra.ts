// Batch 19 wave 2 — the row-level context bundles that the per-series
// generator does not fit: B3 (air dates, G53) as bundles of regressing /
// withheld / off-window rows with their neighbours and AFL's staged date,
// and B4's watch-order entries with no kind (T29). Writes b3-1.md, b3-2.md,
// b4-watch-order.md into <outdir>.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/context-extra.ts <outdir>
import { writeFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { translateEpisodeNumber } from '../../lib/resolve';
import { airdateOrderWalk } from '../../lib/airdate-order';
import { offWindowRows, seriesDatesInvalid } from '../../lib/wiki-identity';

const OUT = process.argv[2] ?? '/tmp/batch19-ctx2';

async function main() {
  const series = await selectAll<any>('series', 'id, title, afl_slug, start_date, end_date, status, aired_episodes');
  const episodes = await selectAll<any>('episodes', 'series_id, number, title, air_date, type, format');
  const byS = new Map<string, any[]>();
  for (const e of episodes) { if (!byS.has(e.series_id)) byS.set(e.series_id, []); byS.get(e.series_id)!.push(e); }
  for (const l of byS.values()) l.sort((a, b) => a.number - b.number);
  const aflBy = new Map(series.filter((s) => s.afl_slug).map((s) => [s.afl_slug, s.id]));
  const staged = await selectAll<{ slug: string; raw: any }>('ingest_afl_shows', 'slug, raw', (q) => q.in('slug', [...aflBy.keys()]));
  const aflDate = new Map<string, string>();
  for (const st of staged) { const sid = aflBy.get(st.slug)!; for (const ep of (st.raw?.episodes ?? []) as any[]) { const n = translateEpisodeNumber(sid, ep.number, 'afl'); if (n != null && ep.airDate) aflDate.set(`${sid}#${n}`, ep.airDate); } }
  type Item = { sid: string; ep: number; kind: string; detail: string };
  const items: Item[] = [];
  for (const s of series) {
    const rows = byS.get(s.id) ?? [];
    const { regressions } = airdateOrderWalk(s.id, rows);
    for (const r of regressions) items.push({ sid: s.id, ep: r.number, kind: 'regression', detail: `${r.date} is ${r.days} d before ep ${r.against} ${r.againstDate}` });
    for (const e of rows) if (!e.air_date && aflDate.has(`${s.id}#${e.number}`)) items.push({ sid: s.id, ep: e.number, kind: 'withheld', detail: `stored NULL; AFL says ${aflDate.get(`${s.id}#${e.number}`)} (withheld by the G54 gate — a year out of order)` });
    if (!seriesDatesInvalid(s)) for (const o of offWindowRows(s.id, s, rows)) if (o.fit === 'before_start') items.push({ sid: s.id, ep: o.number, kind: 'off-window', detail: `${o.date} is before the series start ${s.start_date} (G55) — a year/month slip?` });
  }
  const sids = [...new Set(items.map((i) => i.sid))].sort();
  const half = Math.ceil(sids.length / 2);
  const bundles = [sids.slice(0, half), sids.slice(half)];
  bundles.forEach((b, i) => {
    const lines: string[] = [];
    lines.push(`# Batch 19 wave 2 — lane B3 air dates (G53), bundle ${i + 1}/2`);
    lines.push('Every row below is a stored air date the G54 order gate reports (a regression against its predecessor), a date the gate WITHHELD (stored NULL, AFL\'s claim shown), or a G55 off-window row. For EACH row deliver a `repairs` entry (field air_date, old, new, why, ≥2 sources — ja-WP 各話リスト + en-WP episode list / the broadcaster\'s page) when the stored date is wrong, OR name it a TRUE broadcast-order deviation (an `AIRDATE_ORDER_ACK` candidate: say which episodes and why — a first-run subset, a TX/WOWOW split, a hiatus). A withheld row gets the correct date (may equal AFL\'s claim if AFL was right and the neighbour was the typo). Never guess: an unresolved row is a flags_for_sean line with the links.');
    lines.push('');
    for (const sid of b) {
      const s = series.find((x) => x.id === sid)!;
      const rows = byS.get(sid) ?? [];
      lines.push(`## ${s.title} (series_id: ${sid}) — start ${s.start_date} end ${s.end_date ?? '—'} ${s.status}, aired ${s.aired_episodes}`);
      for (const it of items.filter((x) => x.sid === sid).sort((a, b) => a.ep - b.ep)) {
        lines.push(`- ep ${it.ep} [${it.kind}]: ${it.detail}`);
        const near = rows.filter((e) => Math.abs(e.number - it.ep) <= 2);
        for (const e of near) lines.push(`    ${e.number === it.ep ? '→' : ' '} ${e.number} ${e.air_date ?? 'NULL'} [${e.type}] ${String(e.title ?? '').slice(0, 50)}${aflDate.has(`${sid}#${e.number}`) && aflDate.get(`${sid}#${e.number}`) !== e.air_date ? ` (AFL: ${aflDate.get(`${sid}#${e.number}`)})` : ''}`);
      }
      lines.push('');
    }
    writeFileSync(`${OUT}/b3-${i + 1}.md`, lines.join('\n'));
    console.log(`b3-${i + 1}: ${b.length} series, ${items.filter((x) => b.includes(x.sid)).length} rows`);
  });
  // B4: watch-order entries with no kind
  const wo = await selectAll<any>('watch_order_entries', 'series_id, position, title, air_date, note', (q) => q.is('kind', null).order('series_id'));
  const comps = await selectAll<any>('series_components', 'series_id, anilist_id, kind, label, episode_start, episode_end', (q) => q.in('series_id', [...new Set(wo.map((w) => w.series_id))]).order('season_order'));
  const lines: string[] = ['# Batch 19 wave 2 — lane B4: watch-order entries with no kind (T29)', 'Each order-only entry below needs a KIND ∈ ova | special | movie | recap, cited from AniList (the entry\'s format) or Wikipedia — a title is not a ruling. Deliver them in `structure.order_only` as {"series_id", "position", "kind", "anilist_id" (when found), "sources"}. Components listed for orientation (a kind may already be derivable from an order-only component whose AniList start date equals the entry\'s air date — say so).', ''];
  for (const w of wo) {
    lines.push(`- ${w.series_id} @${w.position}: "${w.title}" ${w.air_date ?? 'no date'}${w.note ? ` — ${String(w.note).slice(0, 120)}` : ''}`);
  }
  lines.push('', '## Components of the series above (season_order: anilist_id kind span label)');
  for (const c of comps) lines.push(`- ${c.series_id}: ${c.anilist_id} [${c.kind}] ${c.episode_start ?? 'null'}-${c.episode_end ?? 'null'} ${c.label ?? ''}`);
  writeFileSync(`${OUT}/b4-watch-order.md`, lines.join('\n'));
  console.log(`b4-watch-order: ${wo.length} entries`);
  void db;
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
