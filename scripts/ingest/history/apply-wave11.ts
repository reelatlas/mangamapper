// Batch 20 wave 11 — the curated apply (P10): kingdom 104-128 (-w11a…d), bleach
// 190-202 (-w11a/b), naruto-shippuden 374-392 (-w11a/b), folding as delivered
// with the verifier corrections as overlays. Per series the sub-block files
// are merged into one episode-sorted list so A47 sees the next START across
// seams; every anchor lands at the MANUAL tier with its VOLUME derived from
// the boundary table (the wave-10 shape); continues via writeCuratedContinue
// (C7); annotations via upsertAnnotation. Fence-row repairs ride as anchor
// updates on the stored manual rows (kingdom 103 END 364 → 363 + partial{364};
// bleach 203 START null → 313); shippuden 392's stale batch-8 annotation note
// is replaced by the same-kind upsert. Types (T6) and dates (G53) are MAP
// entries asserted by the healers — Sean rules. Idempotent; --dry-run prints
// all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave11.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';
import { sliverEnd } from '../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const B = 'batch 20 wave 11 (2026-09-02; Sean ruled)';
const SERIES: { sid: string; files: string[]; upperFence: number }[] = [
  { sid: 'kingdom', files: ['kingdom-w11a.json', 'kingdom-w11b.json', 'kingdom-w11c.json', 'kingdom-w11d.json'], upperFence: 441 },
  { sid: 'bleach', files: ['bleach-w11a.json', 'bleach-w11b.json'], upperFence: 315 },
  { sid: 'naruto-shippuden', files: ['naruto-shippuden-w11a.json', 'naruto-shippuden-w11b.json'], upperFence: 661 },
];
// fence-row repairs delivered by the verdicts (old → new on stored MANUAL rows)
const FENCE_REPAIR: { sid: string; episode: number; set: Record<string, unknown>; why: string }[] = [
  { sid: 'kingdom', episode: 103, set: { chapter: 363, start_chapter: 360, chapters_adapted: '359 (p.14-18), 360-363, 364 (p.1-5)' }, why: 'A47 (kingdom-w11a): the S3 finale ends on ch 364\'s first pages (Kyou Kai rejoining the unit, 364 p.1-5 — the fandom\'s Episode 103 page contradicts its own infobox; pcafe assigns 364 to S4 ep 1; ep 104 opens on 364 p.6) — the tail is ep 104\'s; END 364 → 363 (closes the wave-2 flag).' },
  { sid: 'bleach', episode: 203, set: { start_chapter: 313, chapters_adapted: '313, 314, 315' }, why: 'Enrichment (bleach-w11b, three sources; the verifier: carry the span so start_without_span cannot list it): ep 203 opens on ch 313 — the 202 → 203 seam is no longer interpolated.' },
  { sid: 'naruto-shippuden', episode: 393, set: { chapter: 662, start_chapter: 660, chapters_adapted: '660 (tail), 661, 662', volume: 69 }, why: 'The wave-11 shippuden verifier CONFIRMED the flag: ep 393 adapts ch 660\'s tail + 661 + 662 in full (its last line = ch 662\'s last sentence verbatim; Narutopedia infobox 660, 661, 662; AFG; en-WP) — the stored END 661 was one short and contradicted its own continue 663. 661 → 662 [660] v69.' },
  { sid: 'bleach', episode: 167, set: { start_chapter: 284, chapters_adapted: '284, 285, 286 (p.1-8)' }, why: 'Enrichment (bleach-w11a + the verifier): ep 167 = ch 284-286 p.8 in front of the 22-episode Amagai arc (A47: an 8-page share is substantive — END 286 stands); its continue 286 is precedented (127 → 229, 146 → 247 across filler blocks). Sean ruled the fence-row addition in scope.' },
];
// continues on rows outside the target ranges (fence-row additions — kept only where Sean rules them in scope)
const CONTINUE_SKIP = new Set<string>([]); // e.g. 'bleach#167' to drop the addition
const NOTE_FIX: Record<string, string> = {};
// chapters_adapted corrections from the verifiers (the value stands; the record's wording is fixed)
const CA_OVERRIDE: Record<string, string> = {
  'naruto-shippuden#388': '656 (opening third: the Big Ball Rasenshuriken lands and Hashirama pins Madara with the Wood Dragon, Sai escorts Naruto, Gaara asks Shukaku for help and the tanuki agrees, the other beasts join to repay Naruto)', // the Gate of the Great God torii beat is ep 391's (verifier)
};

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
      const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : upperFence;
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
  console.log(`[apply-wave11] ${anchors} anchors (${normalized} A47-normalized, ${revol} volumes derived ≠ agent), ${continues} continues, ${annoN} annotations, ${repairs} fence repairs${DRY ? ' — DRY RUN' : ''}. Types (T6) + dates (G53): assert-overrides in the heal roster, then census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: 8, unchanged: 0, changed: anchors + continues + annoN + repairs, flagged: 0 }, `apply-wave11: ${anchors} anchors, ${continues} continues, ${annoN} annotations, ${repairs} repairs`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
