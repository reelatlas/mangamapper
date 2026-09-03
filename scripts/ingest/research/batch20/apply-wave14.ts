// Batch 20 wave 14 — the curated apply (P10): dragon-quest-the-adventure-of-dai
// 60-100, seven sub-block verdicts (-w14a … -w14g) DELIVERED IN THE PRINTED
// SPACE (N35 sourceShifts — no conversion at write; wave 13's apply was the
// last converter). Merged into one episode-sorted list so A47 sees the next
// START across seams; the finale (ep 100) has no next row, so its tail stands
// (C1). Every anchor lands at the MANUAL tier with its VOLUME derived from
// the (printed) boundary table; ep 100's stored MU pin (348 v37, verified by
// G) is enriched with START 345 + the span and flips mu → manual (P8).
// Ep 61 is anchor_hostile (A44: it adapts ONLY the unnumbered 番外編「勇者
// アバン」) — the map entry in lib/rulings/anchor-suppressed.ts is the ruling;
// this script writes its `side_story` annotation and no anchor. FENCE
// REPAIRS on wave 13's eps 57-59: five agents independently found the
// fandom's field is printed (wave 13's inferred 'from 208' window was
// phantom), so those three rows sit one chapter low — each +1 with its
// chapters_adapted and continue, the ep-57 partial re-keyed {208} → {209}.
// Continues via writeCuratedContinue (C7); annotations via upsertAnnotation.
// Idempotent; --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave14.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { sliverEnd } from '../../lib/sliver';
import { ANCHOR_SUPPRESSED } from '../../lib/rulings/anchor-suppressed';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const SID = 'dragon-quest-the-adventure-of-dai';
const B = 'batch 20 wave 14 (2026-09-03; Sean ruled)';
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) => `${SID}-w14${x}.json`);
// the verifier's rulings land here as overlays (keyed by episode); empty until curated
const CONTINUE_OVERRIDE: Record<number, { chapter: number; why: string }> = {};
const START_OVERRIDE: Record<number, number> = {};
// THE A47 FORK (verifier w14abd item 2): the fandom's field names a trailing partial that coco13 / Toei do not mention. B held
// ep 70 at 249 and G held ep 96 at 334; D advanced ep 80 → 281 and ep 83 → 290 on the identical shape. Sean rules ONE way:
// ADVANCE (his unproven-tail convention: the furthest chapter played + a partial; a synopsis's silence is not a contradiction —
// the bleach-193 principle) = { 70: 250, 96: 335 } added here; HOLD = { 80: 280, 83: 289 } instead.
const END_OVERRIDE: Record<number, number> = {
  // A47 AS WRITTEN (verifier w14cefg items 1-3): Toei's own episode close carries TEASER wording — the trailing share is a scrap the
  // next episode owns; the continues already point at the next START (290 / 301 / 321) and the partial annotations name the tie.
  83: 289, // Toei's close = the creeping shadow 「……」; morisan3rd 289 ends on the tentacle attack; Toei ep 84 re-narrates the seizure (E's fence note was right)
  86: 300, // Toei's close 「はたして、三局の戦いの決着はいかに――？」; morisan3rd 300 holds 闘魔滅砕陣, Toei ep 87 opens on it breaking; the 301 share is fandom-only
  92: 320, // Toei's close 「ある提案を持ちかける――」 (the teaser F itself cited); morisan3rd puts the proposal in 321; coco13 bounds at 320
  // THE FANDOM-ONLY FORK (both verifiers): a trailing share asserted by the fandom's straddle mark ALONE (coco13 / Toei stop one short,
  // no teaser wording). B held ep 70 (249), E held ep 87 (303), D advanced ep 80 (281). RECOMMENDED: R3 before A47 — a tail's EXISTENCE
  // needs two sources before its SIZE is even a question; hold, keep the share in chapters_adapted, the partial notes it single-source.
  80: 280, // HOLD (recommended; delete this line if Sean rules ADVANCE — then also add 70: 250 and 87: 304)
};
const CA_OVERRIDE: Record<number, string> = {};
const NOTE_FIX: Record<string, string> = Object.fromEntries<string>([78, 79, 80, 81, 82, 83].map((ep) => [`${ep}#anchor`, `Toei's synopsis (added at curation; the verifier read it live): https://www.toei-anim.co.jp/tv/dq-dai/episode/summary/${ep}/`]));
NOTE_FIX['96#anchor'] = 'Verifier (w14cefg): the closing 335 scenes are a FORWARD PULL (rearranged{335}), not a tail — END 334 stands on two sources.';
NOTE_FIX['75#anchor'] = 'Verifier (w14cefg): morisan3rd 265 opens on exactly the relocated Barn/Mistbarn scene — confidence high.';
const ANNOTATION_ADD: { episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [];
// ep 59's START: A and E repair 213 → 214 (Toei's synopsis opens at Carl = ch 214); B, C, D and F keep 213 (coco13:
// ep 58 '213話…の途中まで', ep 59 '213話の途中から' — a real split, 'from midway'). Held at the stored 213 until the verifier rules.
const EP59_START = 213;
// wave 13's three fence rows, one chapter low (the phantom fandom shift) — the same values in every file that repairs them
const FENCE_REPAIR: { episode: number; set: Record<string, unknown>; continue: number; why: string }[] = [
  { episode: 57, set: { chapter: 208, start_chapter: 204, chapters_adapted: '204 (bulk), 205, 206, 207, 208, 209 (1 panel)' }, continue: 209, why: 'Wave 14 (B, C, D, F agree): the fandom\'s ep-57 field is PRINTED (six consecutive numbers 204-209; the ruled from-208 shift collided 207/208 and wave 13 dropped one); coco13 bounds ep 57 at 原作23巻208話 不屈の勇者・ダイ; the 1-panel shot is ch 209 恐怖の切り札\'s first panel. END 207 → 208, continue 208 → 209.' },
  { episode: 58, set: { chapter: 213, start_chapter: 209, chapters_adapted: '209, 210, 211, 212, 213 (partial)' }, continue: 213, why: 'Wave 14 (B, C, D, E, F agree): coco13 opens ep 58 at 原作23巻209話 恐怖の切り札 (en-WP list 210 − 1) and Toei\'s synopsis ends with the Mother Dragon carrying Dai away = ch 213 世界破滅への序曲!!!. START 208 → 209, END 212 → 213, continue 212 → 213 (C1: ep 59 resumes in 213).' },
  { episode: 59, set: { chapter: 217, start_chapter: EP59_START, chapters_adapted: `213 (${EP59_START === 213 ? 'from midway' : 'tail'}), 214, 215, 216, 217 (opening)` }, continue: 217, why: 'Wave 14 (A, B, C, D, F agree on the END): the stored note was self-refuting — "ch 217 最後の希望" while printed 217 is 処刑宣告の罠!!! and 216 is 最後の希望; Toei ep 59 ends on the Demon Army\'s notice arriving (217\'s opening), ep 60 opens on its contents. END 216 → 217 (A47: an unproven opening advances with a partial), continue 216 → 217.' },
];
const ANNOTATION_CHAPTERS_OVERRIDE: Record<string, string> = {
  '57#partial': '209 (1 panel)', // re-keyed with the repair
  // ep 96 (verifier w14cefg item 4): the fandom's '335 sliver' is the Gomez-at-Romos / Nova-to-Ozam scenes morisan3rd places in 335 and
  // coco13 says the anime MOVED before Dai stands — a forward-pulled fragment (rearranged, A4), not an A47 tail; END 334 stands
  '96#rearranged': '335 (the Gomez-at-Romos / Nova-to-Ozam scenes, pulled forward)',
  '96#partial': '332',
};

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  const { data: s } = await db.from('series').select('manga_anilist_id').eq('id', SID).maybeSingle();
  const bounds = await selectAll<any>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', s!.manga_anilist_id).order('volume'));
  const volOf = (ch: number) => bounds.find((b: any) => b.chapter_start <= ch && (b.chapter_end == null || ch <= b.chapter_end))?.volume ?? null;
  const suppressed = new Set(ANCHOR_SUPPRESSED[SID] ?? []);
  const all: any[] = []; const conts: any[] = []; const annos: any[] = []; const types: any[] = []; const hostile: any[] = [];
  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    if (v.series_id !== SID) throw new Error(`${f}: ${v.series_id}`);
    all.push(...(v.anchors ?? [])); conts.push(...(v.continue_points ?? [])); annos.push(...(v.annotations ?? [])); types.push(...(v.type_corrections ?? [])); hostile.push(...(v.anchor_hostile ?? []));
  }
  for (const h of hostile) if (!suppressed.has(Number(h.episode))) throw new Error(`ep ${h.episode} is anchor_hostile in the verdict but not ruled A44 in lib/rulings/anchor-suppressed.ts — rule it first (P10)`);
  all.sort((x, y) => Number(x.episode) - Number(y.episode));
  let anchors = 0, normalized = 0, revol = 0, continues = 0, annoN = 0, repairs = 0;
  for (let i = 0; i < all.length; i++) {
    const a = all[i]; const next = all[i + 1];
    if (suppressed.has(Number(a.episode))) { console.log(`  anchor ep ${a.episode} REFUSED (A44 ruled position-less)`); continue; }
    const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : null; // the finale has no next row: the tail stands (C1)
    const ca = CA_OVERRIDE[Number(a.episode)] ?? a.chapters_adapted ?? null;
    const ruledEnd = END_OVERRIDE[Number(a.episode)];
    const verdict = ruledEnd != null ? { ...sliverEnd(ca, ruledEnd, nextStart), end: ruledEnd } : sliverEnd(ca, Number(a.end_chapter), nextStart);
    const moved = verdict.end !== Number(a.end_chapter); if (moved) normalized++;
    const vol = volOf(verdict.end); const agentVol = a.volume != null ? Number(a.volume) : null;
    if (vol != null && agentVol !== vol) revol++;
    const fix = NOTE_FIX[`${a.episode}#anchor`];
    const start = START_OVERRIDE[Number(a.episode)] ?? (a.start_chapter != null ? Number(a.start_chapter) : null);
    const row = { series_id: SID, episode: Number(a.episode), chapter: verdict.end, start_chapter: start, chapters_adapted: ca, volume: vol ?? agentVol, source: 'manual', note: `${moved ? `A47/ruled: END ${a.end_chapter} → ${verdict.end}. ` : ''}${fix ? `${fix} ` : ''}${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
    console.log(`  anchor ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter} v${row.volume}${moved ? ` (END from ${a.end_chapter})` : ''}${START_OVERRIDE[Number(a.episode)] != null ? ` (START overlay: agent said ${a.start_chapter})` : ''}${vol != null && agentVol !== vol ? ` (volume derived: agent said v${agentVol})` : ''}${Number(a.episode) === 100 ? ' (the MU pin, verified → manual)' : ''}`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`ep${a.episode}: ${error.message}`); }
    anchors++;
  }
  for (const c of conts) {
    if (suppressed.has(Number(c.episode))) { console.log(`  continue ep ${c.episode} SKIPPED (A44 row carries no anchor to hold it)`); continue; }
    const o = CONTINUE_OVERRIDE[Number(c.episode)];
    const chapter = o?.chapter ?? Number(c.continue_chapter);
    const nf = NOTE_FIX[`${c.episode}#continue`];
    console.log(`  continue ep ${c.episode} → ${chapter} (${c.kind})${o ? ` (overlay: was ${c.continue_chapter})` : ''}`);
    if (!DRY) await writeCuratedContinue(SID, Number(c.episode), { chapter, kind: c.kind, note: `${o ? `${o.why} ` : ''}${nf ? `${nf} ` : ''}${c.note ?? c.why ?? ''} ${B}` });
    continues++;
  }
  for (const a of annos) for (const ep of a.episodes as number[]) {
    const chO = ANNOTATION_CHAPTERS_OVERRIDE[`${ep}#${a.kind}`];
    console.log(`  annotation ep ${ep} ${a.kind}${(chO ?? a.chapters) ? `{${String(chO ?? a.chapters).slice(0, 40)}}` : ''}${chO ? ' (overlay)' : ''}`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: ep, kind: a.kind as AnnotationKind, chapters: chO ?? a.chapters ?? null, note: `${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
    annoN++;
  }
  for (const a of ANNOTATION_ADD) {
    console.log(`  annotation ep ${a.episode} ${a.kind}{${a.chapters}} (overlay)`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} [${B}]`, origin: 'research' });
    annoN++;
  }
  for (const r of FENCE_REPAIR) {
    const vol = volOf(Number(r.set.chapter));
    console.log(`  REPAIR ep ${r.episode}: ${JSON.stringify(r.set)} v${vol}, continue → ${r.continue} (fence row, +1)`);
    if (!DRY) {
      // the verifier (w14abd): wave 13's note quoted LIST-space titles ('217 最後の希望') — replaced outright, not appended (a self-refuting note is worse than none)
      const { error } = await db.from('chapter_anchors').update({ ...r.set, volume: vol, source: 'manual', note: `${r.why} ${B} (replaces wave 13's note, which quoted list-space titles; see out/${SID}-w13d.json + verify/${SID}-w14abd.md)`.slice(0, 600) }).eq('series_id', SID).eq('episode', r.episode);
      if (error) throw new Error(`ep${r.episode} repair: ${error.message}`);
      await writeCuratedContinue(SID, r.episode, { chapter: r.continue, kind: 'parity', note: `${r.why} ${B}` });
    }
    repairs++;
  }
  // the ep-57 partial keyed on the old number: the same-kind upsert above replaces it only if the verdicts carry one — re-key explicitly
  const ep57 = await db.from('episode_annotations').select('chapters').eq('series_id', SID).eq('episode', 57).eq('kind', 'partial').maybeSingle();
  if (ep57.data && /\b208\b/.test(String(ep57.data.chapters ?? '')) && !/\b209\b/.test(String(ep57.data.chapters ?? ''))) {
    console.log(`  annotation ep 57 partial{${ep57.data.chapters}} → {209 (1 panel)} (re-keyed with the repair)`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: 57, kind: 'partial', chapters: '209 (1 panel)', note: `A47: the closing panel is ch 209 恐怖の切り札's first panel, which ep 58 opens on — END stays 208 (re-keyed from {208}: the phantom fandom shift). [${B}]`, origin: 'research' });
    annoN++;
  }
  if (types.length) console.log(`  type corrections delivered (T6 map, asserted by the healer): ${types.map((t) => `${t.episodes.join(',')} → ${t.type}`).join('; ')}`);
  console.log(`[apply-wave14] ${anchors} anchors (${normalized} A47-normalized, ${revol} volumes derived ≠ agent), ${continues} continues, ${annoN} annotations, ${repairs} fence repairs, ${hostile.length} A44 rows${DRY ? ' — DRY RUN' : ''}. Then heal + census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annoN + repairs, flagged: 0 }, `apply-wave14: ${anchors} anchors, ${continues} continues, ${annoN} annotations, ${repairs} repairs`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
