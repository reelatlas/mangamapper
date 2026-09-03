// Batch 20 wave 10 — the curated apply (P10): FotNS 109-151, seven sub-block
// verdicts (-w10a … -w10g) folding as delivered with the verifier corrections
// as overlays. Every anchor lands at the MANUAL tier; ENDs are normalized
// through sliverEnd (A47); the VOLUME is DERIVED from the boundary table for
// every anchor (the a+b verifier refuted two copied volumes — the catalog
// convention is the END's volume; deriving it is the P2 answer, the agent's
// field is printed beside it when they differ); continues go through
// writeCuratedContinue (C7) with the seam overlays (114 → 145 = B's START;
// 131 → 179 = C1, ep 133 finishes ch 179); annotations through
// upsertAnnotation (+ the A47-required partial{154} on ep 119). Types (T6)
// are MAP entries asserted by the healers (131 / 133 / 139 / 140 → mixed,
// 132 → filler — Sean rules). Idempotent; --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave10.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { sliverEnd } from '../../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const SID = 'fist-of-the-north-star';
const B = 'batch 20 wave 10 (2026-09-02; Sean ruled)';
const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((x) => `fist-of-the-north-star-w10${x}.json`);
// seam / C1 corrections from the verifiers (verify/fist-of-the-north-star-w10ab.md, -w10de.md)
const CONTINUE_OVERRIDE: Record<number, { chapter: number; why: string }> = {
  114: { chapter: 145, why: 'C2 parity = ep 115\'s START (B read the seam on Falco\'s {1st} cast entry: ch 145; the verifier agreed) — the delivered 146 was A\'s guess at the handoff' },
  144: { chapter: 195, why: 'C2 parity = ep 145\'s START 195: F\'s 196 would skip ch 195\'s remaining fight pages that ep 145 shows (the f+g verifier: the no-skip choice)' },
  131: { chapter: 179, why: 'C1: ep 131 ends MID-ch 179 (the Hyoh debut) and ep 133 finishes the chapter (the Jūkei revelation) — parity with 133\'s START; the delivered 180 contradicted the ch-179 cast (verifier F1)' },
};
const NOTE_FIX: Record<string, string> = {
  '115#continue': 'C3: SKIP ch 151 on arrival — this episode already grafted ch 151 (Falco\'s Hokuto-Army beat) ahead of the running order; resume at 147 and skip 151 when you reach it.',
  '148#continue': 'ch 202\'s Hyoh/Kuroyasha opening is ep 149\'s (verifier note).',
  '151#continue': 'MEDIUM: whether ep 152 finishes ch 209 is unwitnessed — ch 210\'s cast opens on the duel and Bat\'s arrival follows the final blow (verifier note).',
  '113#anchor': 'ch 142\'s tail is RESTAGED at ep 117 (not animated first-time there) — verifier wording fix.',
};
const ANNOTATION_ADD: { episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [
  { episode: 144, kind: 'graft', chapters: '196 (the Jūkei flashback)', note: 'The Jūkei flashback sits LAST in ch 196\'s cast (at the reunion) and RQ87 states the relocation on both episode pages — ep 144 grafts it forward; END stays 195 (Kaioh\'s "Raoh was a fool" speech is ch 195\'s title beat). Added at curation (the f+g verifier).' },
  { episode: 119, kind: 'partial', chapters: '154 (the duel\'s opening pages)', note: 'A47: ep 119\'s closing pages are ch 154\'s opening, which ep 120 starts on and replays — the tail is ep 120\'s; END stays 153 (Rihaku absent from ch 153\'s cast; ch 154 opens with the observers). Added at curation — the verdict applied A47 but omitted the tie annotation.' },
];

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  const { data: s } = await db.from('series').select('manga_anilist_id').eq('id', SID).maybeSingle();
  const bounds = await selectAll<any>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', s!.manga_anilist_id).order('volume'));
  const volOf = (ch: number) => bounds.find((b) => b.chapter_start <= ch && (b.chapter_end == null || ch <= b.chapter_end))?.volume ?? null;
  // one merged, episode-sorted anchor list across the seven files (A47 needs the NEXT anchored row's START across sub-block seams)
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
    const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : 210; // the block's upper fence: ep 152 → 210
    const verdict = sliverEnd(a.chapters_adapted, Number(a.end_chapter), nextStart);
    const moved = verdict.end !== Number(a.end_chapter); if (moved) normalized++;
    const vol = volOf(verdict.end); const agentVol = a.volume != null ? Number(a.volume) : null;
    if (vol != null && agentVol !== vol) revol++;
    const fix = NOTE_FIX[`${a.episode}#anchor`];
    const row = { series_id: SID, episode: Number(a.episode), chapter: verdict.end, start_chapter: a.start_chapter != null ? Number(a.start_chapter) : null, chapters_adapted: a.chapters_adapted ?? null, volume: vol ?? agentVol, source: 'manual', note: `${moved ? `A47: END normalized ${a.end_chapter} → ${verdict.end}. ` : ''}${fix ? `${fix} ` : ''}${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
    console.log(`  anchor ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter} v${row.volume}${moved ? ` (A47 normalized from ${a.end_chapter})` : ''}${vol != null && agentVol !== vol ? ` (volume derived: agent said v${agentVol})` : ''}`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`ep${a.episode}: ${error.message}`); }
    anchors++;
  }
  for (const c of conts) {
    const o = CONTINUE_OVERRIDE[Number(c.episode)];
    const chapter = o?.chapter ?? Number(c.continue_chapter);
    console.log(`  continue ep ${c.episode} → ${chapter} (${c.kind})${o ? ` (overlay: was ${c.continue_chapter})` : ''}`);
    const nf = NOTE_FIX[`${c.episode}#continue`];
    if (!DRY) await writeCuratedContinue(SID, Number(c.episode), { chapter, kind: c.kind, note: `${o ? `${o.why} ` : ''}${nf ? `${nf} ` : ''}${c.note ?? c.why ?? ''} ${B}` });
    continues++;
  }
  for (const a of annos) for (const ep of a.episodes as number[]) {
    console.log(`  annotation ep ${ep} ${a.kind}${a.chapters ? `{${String(a.chapters).slice(0, 30)}}` : ''}`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: ep, kind: a.kind as AnnotationKind, chapters: a.chapters ?? null, note: `${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
    annoN++;
  }
  for (const a of ANNOTATION_ADD) {
    console.log(`  annotation ep ${a.episode} ${a.kind}{${a.chapters}} (overlay: A47)`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} [${B}]`, origin: 'research' });
    annoN++;
  }
  console.log(`  type corrections delivered (T6 map, asserted by the healer): ${types.map((t) => `${t.episodes.join(',')} → ${t.type}`).join('; ')}`);
  console.log(`[apply-wave10] ${anchors} anchors (${normalized} A47-normalized, ${revol} volumes derived ≠ agent), ${continues} continues, ${annoN} annotations${DRY ? ' — DRY RUN' : ''}. Then heal + census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annoN, flagged: 0 }, `apply-wave10: ${anchors} anchors, ${continues} continues, ${annoN} annotations`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
