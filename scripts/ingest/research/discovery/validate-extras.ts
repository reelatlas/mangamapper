// validate-extras — the LANDING step of a related-works wave (P13): every verdict parses and carries its keys, the recap
// baseline prints as a table for the chat checkpoint (the STORED row first, then the verdict — Sean 2026-08-28), and
// --entries prints the RelatedWorkRuling entries the verdicts propose for lib/rulings/related-works.ts — a PROPOSAL:
// Sean rules, the map decides (P10); an entry is pasted only after his ruling, with his reason where he differs.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/validate-extras.ts [--dir scripts/ingest/research/discovery/out] [--entries]
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { selectAll } from '../../lib/db';
import { relatedWorkRuling } from '../../lib/rulings/related-works';

const arg = (k: string): string | null => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const DIR = arg('--dir') ?? 'scripts/ingest/research/discovery/out';
const STANDINGS = new Set(['canon', 'mixed', 'filler']); const CONF = new Set(['high', 'medium', 'low']); const YNU = new Set(['yes', 'no', 'unclear']);

type Chap = { start: number; end?: number | null; note?: string };
type PerWork = { series_id: string; anilist_id: number; title: string; summary: string; standing: string; confidence: string; chapters_adapted: Chap[]; recap: boolean; position: { stored: number | null; verdict: string; proposed: number | null; why: string }; adopted: { basis: string; note: string } | null; repairs: unknown[]; sources: string[]; flags_for_sean: string[] };
type Triage = { series_id: string; summary: string; works: { anilist_id: number; title: string; adapts_chapters: string; chapters: string | null; why: string; sources: string[] }[]; flags_for_sean: string[] };

const chapters = (c: Chap[]) => c.map((x) => (x.end != null && x.end !== x.start ? `${x.start}-${x.end}` : String(x.start))).join(', ');
const esc = (s: string) => s.replace(/\|/g, '/').replace(/\n/g, ' ');

async function main() {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.json')).sort();
  const rows = await selectAll<{ series_id: string; anilist_id: number | null; position: number; kind: string | null; standing: string | null }>('watch_order_entries', 'series_id, anilist_id, position, kind, standing');
  const stored = new Map(rows.filter((r) => r.anilist_id != null).map((r) => [`${r.series_id}#${r.anilist_id}`, r]));
  const problems: string[] = []; const perWork: { file: string; v: PerWork }[] = []; const triage: { file: string; v: Triage }[] = [];
  for (const f of files) {
    let v: PerWork | Triage;
    try { v = JSON.parse(readFileSync(join(DIR, f), 'utf8')); } catch (e) { problems.push(`${f}: does not parse — ${String(e).slice(0, 80)}`); continue; }
    if (!v.series_id) { problems.push(`${f}: no series_id`); continue; }
    if ('works' in v) {
      for (const w of v.works ?? []) { if (!YNU.has(w.adapts_chapters)) problems.push(`${f}: ${w.anilist_id} adapts_chapters '${w.adapts_chapters}' not yes|no|unclear`); if (!w.sources?.length) problems.push(`${f}: ${w.anilist_id} no sources`); }
      triage.push({ file: f, v });
    } else {
      const p = v as PerWork;
      if (!STANDINGS.has(p.standing)) problems.push(`${f}: standing '${p.standing}' not canon|mixed|filler`);
      if (!CONF.has(p.confidence)) problems.push(`${f}: confidence '${p.confidence}'`);
      if (p.standing === 'filler' && (p.chapters_adapted ?? []).length) problems.push(`${f}: filler with chapters_adapted (A1 — a filler work names no chapters)`);
      if (p.standing !== 'filler' && !(p.chapters_adapted ?? []).length) problems.push(`${f}: ${p.standing} with no chapters_adapted`);
      if (!['confirmed', 'corrected'].includes(p.position?.verdict)) problems.push(`${f}: position.verdict '${p.position?.verdict}'`);
      if ((p.sources ?? []).length < 2) problems.push(`${f}: fewer than 2 sources (R3)`);
      if (!p.anilist_id) problems.push(`${f}: no anilist_id`);
      perWork.push({ file: f, v: p });
    }
  }
  console.log(`[validate-extras] ${files.length} verdict file(s): ${perWork.length} per-work, ${triage.length} triage · ${problems.length} problem(s)${problems.length ? '\n  ' + problems.join('\n  ') : ''}`);
  if (process.argv.includes('--entries')) {
    const today = new Date().toISOString().slice(0, 10);
    console.log('\n// ---- proposed RelatedWorkRuling entries (from the verdicts; Sean rules — paste after his ruling) ----');
    for (const { file, v } of perWork) {
      const pos = v.position?.verdict === 'corrected' && v.position.proposed != null ? `, position: ${v.position.proposed}` : '';
      const ch = (v.chapters_adapted ?? []).length ? `, chapter: ${v.chapters_adapted[0].start}, chaptersAdapted: '${chapters(v.chapters_adapted)}'` : '';
      console.log(`  { seriesId: '${v.series_id}', ruleId: 'I45', value: { anilistId: ${v.anilist_id}, standing: '${v.standing}'${ch}${pos}, note: ${JSON.stringify((v.recap ? 'recap; ' : '') + (v.adopted ? `adopted{${v.adopted.basis}}: ${v.adopted.note}; ` : '') + v.position.why).slice(0, 400)} },\n    reason: ${JSON.stringify(`${v.summary} (${v.confidence}; verdict ${file})`).slice(0, 900)},\n    ruledBy: 'Sean', ruledOn: '${today}', cite: ${JSON.stringify([`scripts/ingest/research/discovery/out/${file}`, ...(v.sources ?? []).slice(0, 4)])} },`);
    }
    for (const { file, v } of triage) for (const w of v.works) if (w.adapts_chapters === 'no') console.log(`  { seriesId: '${v.series_id}', ruleId: 'I45', value: { anilistId: ${w.anilist_id}, standing: 'filler', note: ${JSON.stringify(`original (triage): ${w.why}`).slice(0, 300)} },\n    reason: ${JSON.stringify(`Owner triage (${file}): ${w.title} adapts no chapters of the instrument — ${w.why}`).slice(0, 600)},\n    ruledBy: 'Sean', ruledOn: '${today}', cite: ${JSON.stringify([`scripts/ingest/research/discovery/out/${file}`, ...(w.sources ?? []).slice(0, 3)])} },`);
    return;
  }
  if (perWork.length) {
    console.log('\n### Wave recap — per work (STORED first, then the verdict)\n');
    console.log('| owner | work | stored: position · kind · standing | verdict: standing (confidence) · chapters · recap | position | flags |'); console.log('|---|---|---|---|---|---|');
    for (const { v } of perWork) {
      const s = stored.get(`${v.series_id}#${v.anilist_id}`); const r = relatedWorkRuling(v.series_id, v.anilist_id);
      console.log(`| ${v.series_id} | ${esc(v.title)} (${v.anilist_id}) | ${s ? `${s.position} · ${s.kind ?? '?'} · ${s.standing ?? 'pending'}` : 'no row'}${r ? ` (ruled ${r.standing ?? '?'})` : ''} | **${v.standing}** (${v.confidence}) · ${(v.chapters_adapted ?? []).length ? chapters(v.chapters_adapted) : '—'} · ${v.recap ? 'recap' : ''}${v.adopted ? ` · adopted{${v.adopted.basis}}` : ''} | ${v.position?.verdict}${v.position?.verdict === 'corrected' ? ` → ${v.position.proposed}` : ''}: ${esc(v.position?.why ?? '')} | ${esc((v.flags_for_sean ?? []).join('; '))} |`);
    }
  }
  if (triage.length) {
    console.log('\n### Wave recap — triage per owner\n');
    console.log('| owner | works | yes (adapt chapters) | no (originals) | unclear | flags |'); console.log('|---|---|---|---|---|---|');
    for (const { v } of triage) {
      const by = (k: string) => v.works.filter((w) => w.adapts_chapters === k);
      console.log(`| ${v.series_id} | ${v.works.length} | ${by('yes').map((w) => `${esc(w.title)}${w.chapters ? ` (${esc(w.chapters)})` : ''}`).join('; ') || '—'} | ${by('no').length} | ${by('unclear').map((w) => esc(w.title)).join('; ') || '—'} | ${esc((v.flags_for_sean ?? []).join('; '))} |`);
    }
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
