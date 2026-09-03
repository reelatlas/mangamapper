// Batch 20 wave 13 — the curated apply (P10): dragon-quest-the-adventure-of-dai
// 18-59 (-w13a…g; the LAST gap block, wave 1 of 2) folding as delivered with
// the verifier corrections as overlays. Per series the sub-block files
// are merged into one episode-sorted list so A47 sees the next START across
// seams; every anchor lands at the MANUAL tier with its VOLUME derived from
// the boundary table (the wave-10 shape); continues via writeCuratedContinue
// (C7); annotations via upsertAnnotation. Fence-row repairs ride as anchor
// updates on the stored manual rows (kingdom 103 END 364 → 363 + partial{364};
// bleach 203 START null → 313); shippuden 392's stale batch-8 annotation note
// is replaced by the same-kind upsert. Types (T6) and dates (G53) are MAP
// entries asserted by the healers — Sean rules. Idempotent; --dry-run prints
// all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave13.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { sliverEnd } from '../../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const B = 'batch 20 wave 13 (2026-09-02; Sean ruled)';
const SERIES: { sid: string; files: string[]; upperFence: number | null }[] = [
  { sid: 'dragon-quest-the-adventure-of-dai', files: ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) => `dragon-quest-the-adventure-of-dai-w13${x}.json`), upperFence: null }, // no anchored fence above within this wave (rows 60-99 = wave 14)
];
// fence-row repairs delivered by the verdicts (old → new on stored MANUAL rows)
const FENCE_REPAIR: { sid: string; episode: number; set: Record<string, unknown>; why: string }[] = [];
// continues on rows outside the target ranges (fence-row additions — kept only where Sean rules them in scope)
const CONTINUE_SKIP = new Set<string>([]); // e.g. 'bleach#167' to drop the addition
const NOTE_FIX: Record<string, string> = {};
// chapters_adapted corrections from the verifiers (the value stands; the record's wording is fixed)
const CA_OVERRIDE: Record<string, string> = {}; // chapters_adapted wording fixes from the verifiers, keyed `${sid}#${episode}`

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let anchors = 0, normalized = 0, revol = 0, continues = 0, annoN = 0, repairs = 0;
  for (const { sid, files, upperFence } of SERIES) {
    const { data: s } = await db.from('series').select('manga_anilist_id').eq('id', sid).maybeSingle();
    const bounds = await selectAll<any>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', s!.manga_anilist_id).order('volume'));
    const volOf = (ch: number) => bounds.find((b) => b.chapter_start <= ch && (b.chapter_end == null || ch <= b.chapter_end))?.volume ?? null;
    const all: any[] = []; const conts: any[] = []; const annos: any[] = []; const types: any[] = [];
    for (const f of files) {
      const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
      if (v.series_id !== sid) throw new Error(`${f}: ${v.series_id}`);
      all.push(...(v.anchors ?? [])); conts.push(...(v.continue_points ?? [])); annos.push(...(v.annotations ?? [])); types.push(...(v.type_corrections ?? []));
    }
    all.sort((x, y) => Number(x.episode) - Number(y.episode));
    console.log(`== ${sid}`);
    for (let i = 0; i < all.length; i++) {
      const a = all[i]; const next = all[i + 1];
      const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : upperFence; // null → sliverEnd 'no-next': the wave's last END stands
      const verdict = sliverEnd(a.chapters_adapted, Number(a.end_chapter), nextStart);
      const moved = verdict.end !== Number(a.end_chapter); if (moved) normalized++;
      const vol = volOf(verdict.end); const agentVol = a.volume != null ? Number(a.volume) : null;
      if (vol != null && agentVol !== vol) revol++;
      const fix = NOTE_FIX[`${sid}#${a.episode}#anchor`];
      const row = { series_id: sid, episode: Number(a.episode), chapter: verdict.end, start_chapter: a.start_chapter != null ? Number(a.start_chapter) : null, chapters_adapted: CA_OVERRIDE[`${sid}#${a.episode}`] ?? a.chapters_adapted ?? null, volume: vol ?? agentVol, source: 'manual', note: `${moved ? `A47: END normalized ${a.end_chapter} → ${verdict.end}. ` : ''}${fix ? `${fix} ` : ''}${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
      console.log(`  anchor ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter} v${row.volume}${moved ? ` (A47 normalized from ${a.end_chapter})` : ''}${vol != null && agentVol !== vol ? ` (volume derived: agent said v${agentVol})` : ''}`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`); }
      anchors++;
    }
    for (const c of conts) {
      if (CONTINUE_SKIP.has(`${sid}#${c.episode}`)) { console.log(`  continue ep ${c.episode} SKIPPED by ruling`); continue; }
      const nf = NOTE_FIX[`${sid}#${c.episode}#continue`];
      console.log(`  continue ep ${c.episode} → ${c.continue_chapter} (${c.kind})`);
      if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: Number(c.continue_chapter), kind: c.kind, note: `${nf ? `${nf} ` : ''}${c.note ?? c.why ?? ''} ${B}` });
      continues++;
    }
    for (const a of annos) for (const ep of a.episodes as number[]) {
      console.log(`  annotation ep ${ep} ${a.kind}${a.chapters ? `{${String(a.chapters).slice(0, 30)}}` : ''}`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters: a.chapters ?? null, note: `${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
      annoN++;
    }
    if (types.length) console.log(`  type corrections delivered (T6 map, asserted by the healer): ${types.map((t) => `${t.episodes.join(',')} → ${t.type}`).join('; ')}`);
  }
  for (const r of FENCE_REPAIR) {
    console.log(`  REPAIR ${r.sid} ep ${r.episode}: ${JSON.stringify(r.set)} (fence row)`);
    if (!DRY) {
      const { data: cur } = await db.from('chapter_anchors').select('note').eq('series_id', r.sid).eq('episode', r.episode).maybeSingle();
      const { error } = await db.from('chapter_anchors').update({ ...r.set, source: 'manual', note: `${r.why} ${B} | ${String(cur?.note ?? '')}`.slice(0, 600) }).eq('series_id', r.sid).eq('episode', r.episode);
      if (error) throw new Error(`${r.sid} ep${r.episode} repair: ${error.message}`);
    }
    repairs++;
  }
  console.log(`[apply-wave13] ${anchors} anchors (${normalized} A47-normalized, ${revol} volumes derived ≠ agent), ${continues} continues, ${annoN} annotations, ${repairs} fence repairs${DRY ? ' — DRY RUN' : ''}. Types (T6) + dates (G53): assert-overrides in the heal roster, then census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: 7, unchanged: 0, changed: anchors + continues + annoN + repairs, flagged: 0 }, `apply-wave13: ${anchors} anchors, ${continues} continues, ${annoN} annotations, ${repairs} repairs`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
