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

type Chap = { start: number | string | null; end?: number | string | null; note?: string; volume?: number | null };
type PerWork = { series_id: string; anilist_id: number; title: string; summary: string; standing: string; confidence: string; chapters_adapted: Chap[]; recap: boolean; position: { stored: number | null; verdict: string; proposed: number | null; why: string }; adopted: { basis: string; note: string } | null; repairs: unknown[]; sources: string[]; flags_for_sean: string[] };
type Triage = { series_id: string; summary: string; works: { anilist_id: number; title: string; adapts_chapters: string; chapters: string | null; why: string; sources: string[] }[]; flags_for_sean: string[] };

const chapters = (c: Chap[]) => c.map((x) => (x.end != null && x.end !== x.start ? `${x.start ?? '?'}-${x.end}` : String(x.start ?? x.note ?? '?'))).join(', ');
/** the ruling's `chapter` is the END — the last numbered unit adapted (A4's convention; the Abyss / Mugen Train verifiers) — never the first listed unit (KonoSuba leads with an unnumbered epilogue scene) */
const endChapter = (c: Chap[]): number | null => { for (const x of [...c].reverse()) { const e = x.end ?? x.start; if (typeof e === 'number') return e; } return null; };
/** a novel owner's chapters are volume-local (T25 light_novel): the volume of the END unit, from its `volume` field or a "vol N" in its start / note — searched from the END backwards */
const volumeOf = (c: Chap[]): number | null => { for (const x of [...c].reverse()) { if (typeof x.volume === 'number') return x.volume; const m = String(x.start ?? '').match(/vol\s*(\d+)/i) ?? String(x.end ?? '').match(/vol\s*(\d+)/i) ?? String(x.note ?? '').match(/vol(?:ume)?\s*(\d+)/i); if (m) return Number(m[1]); } return null; };
const esc = (s: string) => s.replace(/\|/g, '/').replace(/\n/g, ' ');
/** a triage note is ONE LINE: the researcher's first sentence (the conclusion, by the protocol's convention); a longer first sentence is cut at a word boundary with a VISIBLE ellipsis — never a silent mid-word slice (the wave-2 verifiers' finding); the full why stays cited on the entry */
const oneLine = (why: string, cap = 300): string => {
  const first = (why.match(/^[^.。]+[.。]/)?.[0] ?? why).trim();
  if (first.length <= cap) return first;
  const cut = first.slice(0, cap - 20); return cut.slice(0, cut.lastIndexOf(' ')) + ' … (see the verdict)';
};

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
  // the ledger note is short by design (RelatedWorkRuling.note; the Slam Dunk verifier: a 1,480-char `why` sliced at 400 lost its conclusion) — over-cap
  // fields are WARNINGS: the entry is written by hand at curation, never truncated silently
  const warnings = perWork.filter(({ v }) => (v.position?.why ?? '').length > 400 || (v.summary ?? '').length > 900).map(({ file, v }) => `${file}: position.why ${(v.position?.why ?? '').length} chars / summary ${(v.summary ?? '').length} chars — over the 400 / 900 ledger caps: write the note and reason by hand (lead with the conclusion and the caveat)`);
  for (const { file, v } of triage) { const over = v.works.filter((w) => oneLine(w.why ?? '').endsWith('(see the verdict)')); if (over.length) warnings.push(`${file}: ${over.length} work note(s) whose first sentence exceeds the cap and is cut visibly (${over.map((w) => w.anilist_id).join(', ')}) — read them before the paste`); }
  console.log(`[validate-extras] ${files.length} verdict file(s): ${perWork.length} per-work, ${triage.length} triage · ${problems.length} problem(s)${problems.length ? '\n  ' + problems.join('\n  ') : ''}${warnings.length ? `\n  ${warnings.length} over-cap note(s) (hand-curate):\n  ` + warnings.join('\n  ') : ''}`);
  if (process.argv.includes('--entries')) {
    const today = new Date().toISOString().slice(0, 10);
    console.log('\n// ---- proposed RelatedWorkRuling entries (from the verdicts; Sean rules — paste after his ruling) ----');
    for (const { file, v } of perWork) {
      const pos = v.position?.verdict === 'corrected' && v.position.proposed != null ? `, position: ${v.position.proposed}` : '';
      const vol = volumeOf(v.chapters_adapted ?? []);
      const ch = (v.chapters_adapted ?? []).length ? `, chapter: ${endChapter(v.chapters_adapted)}${vol != null ? `, volume: ${vol}` : ''}, chaptersAdapted: ${JSON.stringify(chapters(v.chapters_adapted))}` : '';
      console.log(`  { seriesId: '${v.series_id}', ruleId: 'I45', value: { anilistId: ${v.anilist_id}, standing: '${v.standing}'${ch}${pos}, note: ${(v.position?.why ?? '').length > 400 ? '/* OVER CAP — write by hand: the conclusion + the caveat */' : JSON.stringify((v.recap ? 'recap; ' : '') + (v.adopted ? `adopted{${v.adopted.basis}}: ${v.adopted.note}; ` : '') + v.position.why)} },\n    reason: ${(v.summary ?? '').length > 900 ? '/* OVER CAP — write by hand from the summary */' : JSON.stringify(`${v.summary} (${v.confidence}; verdict ${file})`)},\n    ruledBy: 'Sean', ruledOn: '${today}', cite: ${JSON.stringify([`scripts/ingest/research/discovery/out/${file}`, ...(v.sources ?? []).slice(0, 4)])} },`);
    }
    for (const { file, v } of triage) for (const w of v.works) if (w.adapts_chapters === 'no') console.log(`  { seriesId: '${v.series_id}', ruleId: 'I45', value: { anilistId: ${w.anilist_id}, standing: 'filler', note: ${JSON.stringify(`original (triage): ${oneLine(w.why ?? '')}`)} },\n    reason: ${JSON.stringify(`Owner triage (${file}): ${w.title} adapts no chapters of the instrument — ${oneLine(w.why ?? '', 500)}`)},\n    ruledBy: 'Sean', ruledOn: '${today}', cite: ${JSON.stringify([`scripts/ingest/research/discovery/out/${file}`, ...(w.sources ?? []).slice(0, 3)])} },`);
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
