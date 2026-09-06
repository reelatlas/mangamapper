// The ruled-grid validator (G59 path C — the step-2 rows pass, 2026-09-06): every grid__<slug>.json under out/ is checked
// against PROTOCOL-grids.md (count = AniList's, numbering 1..N contiguous, ISO dates, two source tiers incl. a licensor and a
// WP tier), printed as a STORED-FIRST recap (the series' rows today vs the grid), and — with --entries — proposed as
// MINTED_GRIDS entries for lib/rulings/minted-grids.ts. A PROPOSAL: Sean signs; the manual writer (mint-grids.ts) mints.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/validate-grids.ts [--entries]
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { selectAll } from '../../lib/db';

type Grid = { series_id: string; anilist_id: number; expected_episodes: number; rows: { number: number; title: string; title_native?: string; air_date: string | null; note?: string }[]; numbering_basis?: string; sources: { url: string; what?: string; tier?: string }[]; flags_for_sean?: string[] };
const DIR = 'scripts/ingest/research/discovery/out';
const ISO = /^\d{4}-\d{2}-\d{2}$/;

async function main() {
  const files = readdirSync(DIR).filter((f) => f.startsWith('grid__') && f.endsWith('.json')).sort();
  const problems: string[] = []; const grids: { file: string; g: Grid }[] = [];
  for (const f of files) {
    let g: Grid;
    try { g = JSON.parse(readFileSync(join(DIR, f), 'utf8')); } catch (e) { problems.push(`${f}: does not parse — ${String(e).slice(0, 80)}`); continue; }
    if (!g.series_id || !Array.isArray(g.rows)) { problems.push(`${f}: no series_id / rows`); continue; }
    const nums = g.rows.map((r) => r.number);
    if (nums.some((n, i) => n !== i + 1)) problems.push(`${f}: numbering is not 1..N contiguous (${nums.join(',')})`);
    if (g.expected_episodes != null && g.rows.length !== g.expected_episodes) problems.push(`${f}: ${g.rows.length} rows vs AniList's ${g.expected_episodes} — a flag must explain it`);
    for (const r of g.rows) { if (r.air_date != null && !ISO.test(r.air_date)) problems.push(`${f}: row ${r.number} date '${r.air_date}' is not ISO`); if (!r.title) problems.push(`${f}: row ${r.number} has no title`); }
    const tiers = new Set((g.sources ?? []).map((s) => (s.tier ?? '').toLowerCase()));
    if ((g.sources ?? []).length < 2) problems.push(`${f}: fewer than 2 sources (R3)`);
    if (!tiers.has('licensor')) problems.push(`${f}: no licensor-tier source (the protocol asks for the licensor's own list)`);
    if (!tiers.has('ja-wp') && !tiers.has('en-wp')) problems.push(`${f}: no WP-tier source`);
    grids.push({ file: f, g });
  }
  console.log(`[validate-grids] ${files.length} grid(s) · ${problems.length} problem(s)${problems.length ? '\n  ' + problems.join('\n  ') : ''}`);
  if (!grids.length) return;
  const stored = new Map<string, { number: number; title: string | null; air_date: string | null; minted_by: string | null }[]>();
  for (const e of await selectAll<{ series_id: string; number: number; title: string | null; air_date: string | null; minted_by: string | null }>('episodes', 'series_id, number, title, air_date, minted_by', (q) => q.in('series_id', grids.map((x) => x.g.series_id)))) stored.set(e.series_id, [...(stored.get(e.series_id) ?? []), e]);
  console.log('\n### Rows pass — per series (STORED first, then the grid)\n');
  console.log('| series | stored rows today | grid | dates | basis | flags |');
  console.log('|---|---|---|---|---|---|');
  for (const { g } of grids) {
    const st = (stored.get(g.series_id) ?? []).sort((a, b) => a.number - b.number);
    const stLine = st.length ? st.map((r) => `${r.number} ${r.air_date ?? '—'} [${r.minted_by}]`).join('; ') : 'none';
    const dates = g.rows.map((r) => r.air_date).filter(Boolean) as string[];
    console.log(`| ${g.series_id} | ${stLine} | ${g.rows.length} rows: ${g.rows.map((r) => `${r.number} ${r.title}`).join('; ').slice(0, 160)} | ${dates.length ? `${dates[0]} → ${dates[dates.length - 1]}` : 'undated'}${g.rows.some((r) => !r.air_date) ? ' (some null)' : ''} | ${(g.numbering_basis ?? '').slice(0, 80)} | ${(g.flags_for_sean ?? []).length} |`);
  }
  if (process.argv.includes('--entries')) {
    console.log('\n// ---- MINTED_GRIDS entries (a PROPOSAL from the grids; Sean signs) ----');
    for (const { file, g } of grids) {
      const rows = g.rows.map((r) => `        { number: ${r.number}, title: ${JSON.stringify(r.title)}, air_date: ${r.air_date ? JSON.stringify(r.air_date) : 'null'}, type: 'canon' },`).join('\n');
      const src = (g.sources ?? []).slice(0, 4).map((s) => `${s.tier ?? '?'}: ${s.url}`).join(' · ');
      console.log(`  {\n    seriesId: '${g.series_id}',\n    ruleId: 'G59',\n    value: {\n      source: ${JSON.stringify(`the step-2 rows pass (2026-09-06; research/discovery/out/${file}): ${src}`)},\n      rows: [\n${rows}\n      ],\n    },\n    reason:\n      ${JSON.stringify(`A series minted from a (d) declaration (I13) with no rows AFL or the wiki finder can serve (${g.numbering_basis ?? 'release order'}); the grid's rows are release facts on two source tiers — types default canon-tier (T27) until the standing programme researches them.`)},\n    ruledBy: 'Sean',\n    ruledOn: '2026-09-06',\n    cite: ['scripts/ingest/research/discovery/out/${file}'],\n  },`);
    }
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
