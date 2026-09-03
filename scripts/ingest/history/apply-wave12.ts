// Batch 20 wave 12 — the curated apply (P10): the-seven-deadly-sins-four-knights-
// of-the-apocalypse 1-23 (-w12a…d) folding as delivered with the verifier
// corrections as overlays. The four sub-block files are merged into one
// episode-sorted list so A47 sees the next START across seams (the block's
// upper fence = the wave-9 manual anchor ep 24 → 77 [75]); every anchor lands
// at the MANUAL tier with its VOLUME derived from the boundary table — which is
// EMPTY for this manga (AniList 129117), so the apply first SEEDS
// volume_boundaries v1-v9 from the table all three landed verdicts agree on
// (fandom Volume pages + programming-cafe's 単行本 column + Kodansha's own
// product records / 初出; source 'research', provenance = the verdict files),
// inserting only rows that do not exist (P8: research-tier rows the volumes
// backfill never overwrites — they carry a source it does not own). Continues
// via writeCuratedContinue (C7); annotations via upsertAnnotation. Idempotent;
// --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave12.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';
import { sliverEnd } from '../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const SID = 'the-seven-deadly-sins-four-knights-of-the-apocalypse';
const B = 'batch 20 wave 12 (2026-09-02; Sean ruled)';
const FILES = ['a', 'b', 'c', 'd'].map((x) => `${SID}-w12${x}.json`);
const UPPER_FENCE_START = 75; // ep 24 → 77 [75] (manual, wave 9)
// v1-v9, identical in the a / b / c verdicts' structure.notes (fandom Volume pages + pc 単行本 column + Kodansha)
const VOLUME_SEED: [number, number, number][] = [[1, 1, 5], [2, 6, 14], [3, 15, 23], [4, 24, 32], [5, 33, 41], [6, 42, 50], [7, 51, 59], [8, 60, 68], [9, 69, 77]];
const CONTINUE_OVERRIDE: Record<number, { chapter: number; why: string }> = {};
const NOTE_FIX: Record<string, string> = {};
const CA_OVERRIDE: Record<number, string> = {};
const ANNOTATION_ADD: { episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [
  { episode: 5, kind: 'partial', chapters: '14 (the C-part tag)', note: 'The verifier (wave 12): ep 5\'s C-part is ch 14\'s opening (nissi0725 ep 5 "そこそこの長さ" Sistana/Calden/Anne C-part; ep 6 "冒頭 … 原作14話の冒頭部分" cold open) — two sources; a tail ep 6 starts on (A47: END 13 unchanged).' },
];

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  const { data: s } = await db.from('series').select('manga_anilist_id').eq('id', SID).maybeSingle();
  const manga = s!.manga_anilist_id as number;
  // 1. seed the empty boundary table (only rows that do not exist)
  const have = new Set((await selectAll<any>('volume_boundaries', 'volume', (q) => q.eq('manga_anilist_id', manga))).map((b) => Number(b.volume)));
  let seeded = 0;
  for (const [volume, chapter_start, chapter_end] of VOLUME_SEED) {
    if (have.has(volume)) continue;
    console.log(`  volume_boundaries seed: v${volume} = ${chapter_start}-${chapter_end} (research; the w12a/b/c tables)`);
    if (!DRY) { const { error } = await db.from('volume_boundaries').insert({ manga_anilist_id: manga, volume, chapter_start, chapter_end, source: 'research', source_page: `${OUT}/${SID}-w12a.json structure.notes (agrees with -w12b, -w12c; fandom Volume pages + programming-cafe 単行本 + Kodansha)` }); if (error) throw new Error(`seed v${volume}: ${error.message}`); }
    seeded++;
  }
  const bounds = DRY ? VOLUME_SEED.map(([volume, chapter_start, chapter_end]) => ({ volume, chapter_start, chapter_end })) : await selectAll<any>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', manga).order('volume'));
  const volOf = (ch: number) => bounds.find((b: any) => b.chapter_start <= ch && (b.chapter_end == null || ch <= b.chapter_end))?.volume ?? null;
  // 2. merge the sub-blocks
  const all: any[] = []; const conts: any[] = []; const annos: any[] = []; const types: any[] = [];
  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    if (v.series_id !== SID) throw new Error(`${f}: ${v.series_id}`);
    all.push(...(v.anchors ?? [])); conts.push(...(v.continue_points ?? [])); annos.push(...(v.annotations ?? [])); types.push(...(v.type_corrections ?? []));
  }
  all.sort((x, y) => Number(x.episode) - Number(y.episode));
  let anchors = 0, normalized = 0, revol = 0, continues = 0, annoN = 0;
  for (let i = 0; i < all.length; i++) {
    const a = all[i]; const next = all[i + 1];
    const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : UPPER_FENCE_START;
    const ca = CA_OVERRIDE[Number(a.episode)] ?? a.chapters_adapted ?? null;
    const verdict = sliverEnd(ca, Number(a.end_chapter), nextStart);
    const moved = verdict.end !== Number(a.end_chapter); if (moved) normalized++;
    const vol = volOf(verdict.end); const agentVol = a.volume != null ? Number(a.volume) : null;
    if (vol != null && agentVol !== vol) revol++;
    const fix = NOTE_FIX[`${a.episode}#anchor`];
    const row = { series_id: SID, episode: Number(a.episode), chapter: verdict.end, start_chapter: a.start_chapter != null ? Number(a.start_chapter) : null, chapters_adapted: ca, volume: vol ?? agentVol, source: 'manual', note: `${moved ? `A47: END normalized ${a.end_chapter} → ${verdict.end}. ` : ''}${fix ? `${fix} ` : ''}${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
    console.log(`  anchor ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter} v${row.volume}${moved ? ` (A47 normalized from ${a.end_chapter})` : ''}${vol != null && agentVol !== vol ? ` (volume derived: agent said v${agentVol})` : ''}`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`ep${a.episode}: ${error.message}`); }
    anchors++;
  }
  for (const c of conts) {
    const o = CONTINUE_OVERRIDE[Number(c.episode)];
    const chapter = o?.chapter ?? Number(c.continue_chapter);
    const nf = NOTE_FIX[`${c.episode}#continue`];
    console.log(`  continue ep ${c.episode} → ${chapter} (${c.kind})${o ? ` (overlay: was ${c.continue_chapter})` : ''}`);
    if (!DRY) await writeCuratedContinue(SID, Number(c.episode), { chapter, kind: c.kind, note: `${o ? `${o.why} ` : ''}${nf ? `${nf} ` : ''}${c.note ?? c.why ?? ''} ${B}` });
    continues++;
  }
  for (const a of annos) for (const ep of a.episodes as number[]) {
    console.log(`  annotation ep ${ep} ${a.kind}${a.chapters ? `{${String(a.chapters).slice(0, 30)}}` : ''}`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: ep, kind: a.kind as AnnotationKind, chapters: a.chapters ?? null, note: `${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
    annoN++;
  }
  for (const a of ANNOTATION_ADD) {
    console.log(`  annotation ep ${a.episode} ${a.kind}{${a.chapters}} (overlay)`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} [${B}]`, origin: 'research' });
    annoN++;
  }
  if (types.length) console.log(`  type corrections delivered (T6 map, asserted by the healer): ${types.map((t) => `${t.episodes.join(',')} → ${t.type}`).join('; ')}`);
  console.log(`[apply-wave12] ${seeded} volumes seeded, ${anchors} anchors (${normalized} A47-normalized, ${revol} volumes derived ≠ agent), ${continues} continues, ${annoN} annotations${DRY ? ' — DRY RUN' : ''}. Then heal + census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: seeded + anchors + continues + annoN, flagged: 0 }, `apply-wave12: ${seeded} volumes seeded, ${anchors} anchors, ${continues} continues, ${annoN} annotations`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
