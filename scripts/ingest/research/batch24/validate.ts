// Batch-20 landing gate (P13 steps 1-2, R25) for the ANCHORING shape: every
// verdict in out/ parses, names a TARGETS series, accounts for each target
// row (an anchor, an anchor_hostile entry, or a filler row under A1 — stored
// type or a type_correction), cites ≥2 sources per anchor (R3), keeps END ≥
// START and inside the chapter space, never anchors a filler row (A1) or a
// ruled position-less row (A44), uses the vocabulary, and its summary does
// not contradict its rows.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch24/validate.ts
import { readdirSync, readFileSync } from 'node:fs';
import { ANNOTATION_KINDS, ADOPTED_BASES } from '../../lib/annotations';
import { ANCHOR_SUPPRESSED } from '../../lib/rulings/anchor-suppressed';
import { db, selectAll } from '../../lib/db';
import { TARGETS } from './context';

const OUT = new URL('./out/', import.meta.url).pathname;
const TYPES = new Set(['canon', 'mixed', 'filler']);
const CONT = new Set(['parity', 'post_series']);
const ranges = (s: string): [number, number][] => s.split(',').map((p) => p.trim()).map((p) => { const [a, b] = p.split('-').map(Number); return [a, b ?? a]; });

async function main() {
  const files = readdirSync(OUT).filter((f) => f.endsWith('.json'));
  let bad = 0;
  for (const f of files) {
    const problems: string[] = [];
    let v: any;
    try { v = JSON.parse(readFileSync(OUT + f, 'utf8')); } catch (e) { console.log(`FAIL ${f}: does not parse — ${e}`); bad++; continue; }
    if (!v.series_id) { console.log(`FAIL ${f}: no series_id`); bad++; continue; }
    // a series can have one TARGETS entry per wave: `<id>-w<N>.json` names the wave; no suffix = the series' lowest wave
    const mine = TARGETS.filter((t) => t[0] === v.series_id).sort((a, b) => a[4] - b[4]);
    const wv = /-w(\d+)[a-z]?\.json$/.exec(f)?.[1];
    const sameWave = wv ? mine.filter((t) => t[4] === Number(wv)) : [];
    const touched = [...(v.anchors ?? []), ...(v.anchor_hostile ?? []), ...(v.repairs ?? []), ...(v.continue_points ?? [])].map((x: any) => Number(x.episode)).concat(...[...(v.type_corrections ?? []), ...(v.annotations ?? [])].map((x: any) => (x.episodes ?? []).map(Number)));
    // several same-wave entries (sub-blocks): the entry covering the MOST touched rows wins — a repair on the fence row outside every range must not throw the pick (wave 11, bleach-w11b's ep-203 START enrichment)
    const covered = (t: (typeof mine)[number]) => touched.filter((n) => ranges(t[1]).some(([a, b]) => n >= a && n <= b)).length;
    const task = (sameWave.length > 1 ? [...sameWave].sort((x, y) => covered(y) - covered(x))[0] : sameWave[0]) ?? mine[0];
    if (!task) { console.log(`FAIL ${f}: no TARGETS entry for ${v.series_id}`); bad++; continue; }
    const { data: s } = await db.from('series').select('total_chapters, latest_known_chapters').eq('id', v.series_id).maybeSingle();
    const space = Math.max(s?.total_chapters ?? 0, s?.latest_known_chapters ?? 0);
    const rows = await selectAll<{ number: number; type: string }>('episodes', 'number, type', (q) => q.eq('series_id', v.series_id));
    // a target row that ALREADY carries a stored anchor is accounted for (the ask may be its continue / repair)
    const stored = new Set((await selectAll<{ episode: number }>('chapter_anchors', 'episode', (q) => q.eq('series_id', v.series_id))).map((a) => a.episode));
    const typeOf = new Map(rows.map((r) => [r.number, r.type]));
    const rs = ranges(task[1]);
    const targets = rows.map((r) => r.number).filter((n) => rs.some(([a, b]) => n >= a && n <= b)).sort((a, b) => a - b);
    const corrected = new Map<number, string>();
    for (const tc of v.type_corrections ?? []) {
      if (!TYPES.has(tc.type)) problems.push(`type_correction type '${tc.type}' not in canon|mixed|filler`);
      if (!Array.isArray(tc.episodes)) problems.push('type_corrections.episodes must be a LIST');
      if (!(tc.sources?.length >= 2)) problems.push(`type_correction eps ${tc.episodes} needs ≥2 sources (R3)`);
      for (const ep of tc.episodes ?? []) corrected.set(ep, tc.type);
    }
    const effType = (n: number) => corrected.get(n) ?? typeOf.get(n);
    const anchored = new Set<number>();
    for (const a of v.anchors ?? []) {
      const ep = Number(a.episode);
      if (anchored.has(ep)) problems.push(`ep ${ep} anchored twice`);
      anchored.add(ep);
      if (!(a.sources?.length >= 2)) problems.push(`anchor ep ${ep} has ${a.sources?.length ?? 0} sources (R3 needs 2)`);
      if (a.end_chapter == null || !Number.isFinite(Number(a.end_chapter))) problems.push(`anchor ep ${ep} has no numeric end_chapter`);
      if (a.start_chapter != null && Number(a.start_chapter) > Number(a.end_chapter)) problems.push(`anchor ep ${ep} START ${a.start_chapter} > END ${a.end_chapter}`);
      if (space > 0 && Number(a.end_chapter) > space + 5) problems.push(`anchor ep ${ep} END ${a.end_chapter} beyond the chapter space (${space}) — wrong space?`);
      if (effType(ep) === 'filler') problems.push(`anchor on a FILLER row ep ${ep} without a type_correction (A1)`);
      if (ANCHOR_SUPPRESSED[v.series_id]?.includes(ep)) problems.push(`anchor on a ruled position-less row ep ${ep} (A44)`);
      if (!['high', 'medium'].includes(a.confidence)) problems.push(`anchor ep ${ep} confidence '${a.confidence}'`);
    }
    const hostile = new Set<number>((v.anchor_hostile ?? []).map((h: any) => Number(h.episode)));
    for (const h of v.anchor_hostile ?? []) if (!h.why || !(h.sources?.length >= 1)) problems.push(`anchor_hostile ep ${h.episode} needs why + a source`);
    for (const c of v.continue_points ?? []) {
      if (!CONT.has(c.kind)) problems.push(`continue ep ${c.episode} kind '${c.kind}' not in parity|post_series`);
      if (!Number.isFinite(Number(c.continue_chapter))) problems.push(`continue ep ${c.episode} has no numeric continue_chapter`);
    }
    for (const a of v.annotations ?? []) {
      if (!(ANNOTATION_KINDS as readonly string[]).includes(a.kind)) problems.push(`annotation kind '${a.kind}' not in vocabulary`);
      if (a.kind === 'adopted' && !(ADOPTED_BASES as readonly string[]).includes(a.basis)) problems.push(`adopted eps ${a.episodes} without a valid basis`);
      if (!Array.isArray(a.episodes)) problems.push('annotations.episodes must be a LIST');
    }
    for (const r of v.repairs ?? []) if (!r.field || r.new === undefined || !r.why || !(r.sources?.length >= 1)) problems.push(`repair ep ${r.episode} needs field/old/new/why/sources`);
    // row accounting binds lanes A1 (the honest terminal) and A2 (the gap blocks): every canon/mixed target row is anchored, hostile, or already carries a stored anchor
    const anchoringLane = task[2] === 'A1' || task[2] === 'A2' || task[2] === 'T'; // lane T (batch 24): every target row typed AND anchored or hostile; lane C: the ask names the rows (checked at curation); lane B: out/airdates/ + validate-airdates.ts
    const unaccounted = anchoringLane ? targets.filter((n) => !anchored.has(n) && !hostile.has(n) && !stored.has(n) && effType(n) !== 'filler') : [];
    if (unaccounted.length) problems.push(`canon/mixed target rows with neither an anchor nor an anchor_hostile entry: ${unaccounted.join(',')} (say why in summary if deliberate)`);
    const raw = readFileSync(OUT + f, 'utf8');
    if (/anime-only-canon|anime_only_canon/i.test(raw)) problems.push("mentions the retired type 'anime-only-canon'");
    if (v.flags_for_sean != null && !Array.isArray(v.flags_for_sean)) problems.push('flags_for_sean is not a list (shape)');
    const sum = String(v.summary ?? '').toLowerCase();
    // "no anchor-hostile rows" / "no anchor_hostile" is a count of the OTHER list, not a claim about anchors — strip it before the contradiction test;
    // likewise a parenthetical rule citation "(A1, no anchor)" is the stated A1 reason the protocol asks for
    // a QUOTED phrase is the stored record's wording, not a claim ('the stored \'fragment ties, no anchor\' record understates them' — wave 16)
    const sumNoHostile = sum.replace(/'[^']*'|"[^"]*"|‘[^’]*’|“[^”]*”/g, '').replace(/\bno anchors?[-_ ]hostile\b/g, '').replace(/\(a1,? no anchors?\)/g, '').replace(/\bno anchors?\s*\(a1\)/g, '');
    if (/\bno anchors?\b/.test(sumNoHostile) && (v.anchors?.length ?? 0) > 0 && !/\b(takes?|took|carry|carries|carried|get|gets|receives?) no anchors?\b|\bno anchors? (for|on|at|in|under|either|there|here|,? stated)\b/.test(sumNoHostile)) problems.push('summary says "no anchor" but anchors are present — read it');
    const n = v.anchors?.length ?? 0;
    if (problems.length) { bad++; console.log(`FAIL ${f} (${n} anchors over ${targets.length} target rows)`); for (const p of problems) console.log(`   - ${p}`); }
    else console.log(`ok   ${f}: ${targets.length} targets, ${n} anchors, ${hostile.size} hostile, ${(v.continue_points ?? []).length} continues, ${(v.annotations ?? []).length} annotations, ${(v.repairs ?? []).length} repairs, ${(v.type_corrections ?? []).length} type corrections, ${(v.flags_for_sean ?? []).length} flags`);
  }
  console.log(`[validate] ${files.length} verdicts, ${bad} failing`);
  process.exit(bad ? 1 : 0);
}
main();
