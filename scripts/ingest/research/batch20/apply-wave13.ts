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
const FENCE_REPAIR: { sid: string; episode: number; set: Record<string, unknown>; why: string }[] = [
  { sid: 'dragon-quest-the-adventure-of-dai', episode: 17, set: { chapter: 59, chapters_adapted: '57 (bulk), 58, 59, 60 (the relocated Crocodine-sends-Dai beat — a scrap; ep 18 owns ch 60)' }, why: 'A47 (w13a + the a-c verifier on three instruments: coco13 17 = ch 57-59 with no ch 60; Toei 17 ends on the reveal; the fandom ch-59 cast ends Hyunckel): the ch-60 share is a relocated beat, not first-time coverage — END 60 → 59; ep 18 → 63 [60].' },
];
// the a-c verifier: w13b ep 28 graft{196} is the fandom's number — OUR 197 (さらば我が子よ = en-WP 197)
const ANNOTATION_CHAPTERS_OVERRIDE: Record<string, string> = { 'dragon-quest-the-adventure-of-dai#28#graft': '197 (pp 10, 12)' };
const ANNOTATION_ADD: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [
  { sid: 'dragon-quest-the-adventure-of-dai', episode: 17, kind: 'rearranged', chapters: '60', note: 'The a-c verifier: ep 17\'s ch-60 share is the relocated Crocodine-sends-Dai beat (the fandom ep-17 差分 verbatim) — a relocation, not first-time coverage; END 59 (A47).' },
];
// A47 CONVENTION (Sean rules, WAVE13-RECOVERY §THE DECISIONS): A/B HOLD on 最初/序盤 tails; C ADVANCED on the same shape (30 → 108, 31 → 111, 32 → 114). Under the HOLD convention: 30 → 107, 31 → 110, 32 → 113 + partials; continues unchanged.
// THE A47 CONVENTION FOR THIS SERIES (Sean rules, WAVE13-RECOVERY §THE DECISIONS): A47 as written is an EXCEPTION that needs evidence — a ≤5-page tail or scrappy wording; an unquantified 最初/序盤 share is a real share of unknown size → the END ADVANCES (A4), the tail named as `partial`. C/D/E/F/G delivered that way (holds only on quantified tails: 46, 47, 56, 57); A/B held on position language. Under the ruled convention A/B's four position-language holds ADVANCE (23 → 82, 25 → 90, 28 → 101, 29 → 104 — their continues already sit there); ep 17 → 59 stands on the relocation evidence. HOLD_C = false leaves C as delivered.
const HOLD_C = false;
const END_OVERRIDE: Record<string, number> = HOLD_C ? { 'dragon-quest-the-adventure-of-dai#30': 107, 'dragon-quest-the-adventure-of-dai#31': 110, 'dragon-quest-the-adventure-of-dai#32': 113 } : { 'dragon-quest-the-adventure-of-dai#23': 82, 'dragon-quest-the-adventure-of-dai#25': 90, 'dragon-quest-the-adventure-of-dai#28': 101, 'dragon-quest-the-adventure-of-dai#29': 104 };
const HOLD_PARTIALS: { episode: number; chapters: string }[] = HOLD_C ? [{ episode: 30, chapters: '108 (序盤 — ep 31 starts on it)' }, { episode: 31, chapters: '111 (序盤 — ep 32 starts on it)' }, { episode: 32, chapters: '114 (序盤 — ep 33 starts on it)' }] : [];
// the d-g verifier: D's ep 39 START 135 and E's ep 42 START 150 applied opposite rules to the same shape (a first-time remainder of a chapter three back) — one rule: E's (the stored ep-7 shape): START = the running-order chapter, the back-jump stays `rearranged`
const START_OVERRIDE: Record<string, number> = { 'dragon-quest-the-adventure-of-dai#39': 138 };
// continues on rows outside the target ranges (fence-row additions — kept only where Sean rules them in scope)
const CONTINUE_SKIP = new Set<string>([]); // e.g. 'bleach#167' to drop the addition
const NOTE_FIX: Record<string, string> = {};
// chapters_adapted corrections from the verifiers (the value stands; the record's wording is fixed)
const CA_OVERRIDE: Record<string, string> = {}; // chapters_adapted wording fixes from the verifiers, keyed `${sid}#${episode}`

// THE PRINTED SPACE (N35, Sean 2026-09-02): every wave-13 verdict delivered in the 349-slot list space (en-WP = AniList = MU); the
// catalog now stores the PRINTED 348 space — list N ≥ 123 = printed N − 1. Converted at write (the ruled shift, applied to the
// list-space verdict values), with the stored volume table and the ep-100 MU row re-based first so the volume derivation reads the
// printed space. Numbers ≥ 123 inside chapters_adapted / annotation chapters are chapter numbers (page numbers never reach 123).
const LIST_FROM = 123;
const toPrinted = (n: number | null | undefined): number | null => (n == null ? null : n >= LIST_FROM ? n - 1 : n);
const toPrintedText = (t: string | null | undefined): string | null => (t == null ? null : t.replace(/\b(\d{3})\b/g, (m) => (Number(m) >= LIST_FROM ? String(Number(m) - 1) : m)));

// the one record the shift cannot express: ep 35's divergence names the LIST's slot 122 = the unnumbered 番外編「勇者アバン」 (printed at
// the back of vol 13, no mainline number); in the printed space '122' is a real chapter ep 35 adapts. Sean (2026-09-02): the
// unnumbered chapter and every one-shot are NOTED as side_story wherever they sit or are adapted, never numbered.
const ANNOTATION_REWRITE: Record<string, { kind: AnnotationKind; chapters: string; note: string }> = {
  'dragon-quest-the-adventure-of-dai#35#divergence#122 (not adapted)': { kind: 'side_story', chapters: 'the unnumbered 番外編「勇者アバン」 (vol 13 back matter, between printed ch 121 and 122; NOT adapted here)', note: 'N35 (Sean 2026-09-02): the 番外編 "The Hero Avan" (V Jump, Nov 1991) is printed as unnumbered bonus matter at the end of tankobon vol 13 — the catalog\'s chapter space is the PRINTED 348, so it carries no number (en-WP / AniList / MU / MangaDex count it as their 122 and run +1 from there). The 2020 series skips it at this point (ep 35 runs printed 121 → 122 with no story gap); it is adapted out of order later (queued for the 60-99 block — ep 61) and will be noted there.' },
};

async function rebaseToPrinted(sid: string, manga: number) {
  // the volume table: wikipedia rows in the list space → printed (v13 end 122 → 121; v14-v37 − 1); idempotent via the v13 end marker
  const rows = await selectAll<any>('volume_boundaries', 'volume, chapter_start, chapter_end, source', (q) => q.eq('manga_anilist_id', manga).order('volume'));
  const v13 = rows.find((r) => Number(r.volume) === 13);
  if (v13 && Number(v13.chapter_end) === 122) {
    for (const r of rows) {
      const cs = Number(r.chapter_start), ce = r.chapter_end == null ? null : Number(r.chapter_end);
      // v13's last entry WAS the extra's slot (list 122): printed v13 ends at 121 — the only boundary the shift cannot express
      const ncs = toPrinted(cs)!, nce = Number(r.volume) === 13 ? 121 : toPrinted(ce);
      if (ncs === cs && nce === ce) continue;
      console.log(`  volume_boundaries v${r.volume}: ${cs}-${ce} → ${ncs}-${nce} (printed space, N35)`);
      if (!DRY) { const { error } = await db.from('volume_boundaries').update({ chapter_start: ncs, chapter_end: nce }).eq('manga_anilist_id', manga).eq('volume', r.volume); if (error) throw new Error(`vol ${r.volume}: ${error.message}`); }
    }
  } else console.log('  volume_boundaries already in the printed space');
  // the ep-100 MU pin (349 = MU's unit count) → 348 printed; the mu cron re-derives the same through the ruled shift from now on
  const { data: pin } = await db.from('chapter_anchors').select('chapter, source').eq('series_id', sid).eq('episode', 100).maybeSingle();
  if (pin && pin.source === 'mu' && Number(pin.chapter) === 349) {
    console.log('  ep 100 mu pin 349 → 348 (printed space; MU shift ruled)');
    if (!DRY) { const { error } = await db.from('chapter_anchors').update({ chapter: 348, volume: 37 }).eq('series_id', sid).eq('episode', 100); if (error) throw new Error(`ep 100: ${error.message}`); }
  }
}

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let anchors = 0, normalized = 0, revol = 0, continues = 0, annoN = 0, repairs = 0;
  for (const { sid, files, upperFence } of SERIES) {
    const { data: s } = await db.from('series').select('manga_anilist_id').eq('id', sid).maybeSingle();
    await rebaseToPrinted(sid, s!.manga_anilist_id as number);
    const rawBounds = await selectAll<any>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', s!.manga_anilist_id).order('volume'));
    // in a DRY run the table is not yet re-based — derive against the printed shape
    const bounds = DRY ? rawBounds.map((b: any) => ({ volume: b.volume, chapter_start: toPrinted(Number(b.chapter_start)), chapter_end: b.chapter_end == null ? null : toPrinted(Number(b.chapter_end)) })) : rawBounds;
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
      // list → printed conversion of the delivered values (the overrides are stated in the list space too)
      const endList = END_OVERRIDE[`${sid}#${a.episode}`] ?? Number(a.end_chapter);
      const endP = toPrinted(endList)!; const nextP = nextStart == null ? null : toPrinted(nextStart);
      const caP = toPrintedText(a.chapters_adapted);
      const ruled = END_OVERRIDE[`${sid}#${a.episode}`] != null ? endP : null;
      const verdict = ruled != null ? { ...sliverEnd(caP, ruled, nextP), end: ruled } : sliverEnd(caP, endP, nextP);
      const moved = verdict.end !== endP; if (moved) normalized++;
      const startMoved = START_OVERRIDE[`${sid}#${a.episode}`] != null && START_OVERRIDE[`${sid}#${a.episode}`] !== Number(a.start_chapter);
      const vol = volOf(verdict.end); const agentVol = a.volume != null ? Number(a.volume) : null;
      if (vol != null && agentVol !== vol) revol++;
      const fix = NOTE_FIX[`${sid}#${a.episode}#anchor`];
      const row = { series_id: sid, episode: Number(a.episode), chapter: verdict.end, start_chapter: toPrinted(START_OVERRIDE[`${sid}#${a.episode}`] ?? (a.start_chapter != null ? Number(a.start_chapter) : null)), chapters_adapted: toPrintedText(CA_OVERRIDE[`${sid}#${a.episode}`] ?? a.chapters_adapted ?? null), volume: vol ?? agentVol, source: 'manual', note: `PRINTED SPACE (N35): list ${a.end_chapter} → printed ${endP}. ${moved ? `A47/ruled: END ${endP} → ${verdict.end}. ` : ''}${fix ? `${fix} ` : ''}${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
      console.log(`  anchor ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter} v${row.volume}${moved ? ` (ruled/A47: END from ${endP})` : ''}${endP !== Number(a.end_chapter) ? ` (printed: list ${a.end_chapter})` : ''}${startMoved ? ` (ruled: START from ${a.start_chapter})` : ''}${vol != null && agentVol !== vol ? ` (volume derived: agent said v${agentVol})` : ''}`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`); }
      anchors++;
    }
    for (const c of conts) {
      if (CONTINUE_SKIP.has(`${sid}#${c.episode}`)) { console.log(`  continue ep ${c.episode} SKIPPED by ruling`); continue; }
      const nf = NOTE_FIX[`${sid}#${c.episode}#continue`];
      const contP = toPrinted(Number(c.continue_chapter))!;
      console.log(`  continue ep ${c.episode} → ${contP} (${c.kind})${contP !== Number(c.continue_chapter) ? ` (printed: list ${c.continue_chapter})` : ''}`);
      if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: contP, kind: c.kind, note: `${nf ? `${nf} ` : ''}${c.note ?? c.why ?? ''} ${B}` });
      continues++;
    }
    for (const a of annos) for (const ep of a.episodes as number[]) {
      const chO = ANNOTATION_CHAPTERS_OVERRIDE[`${sid}#${ep}#${a.kind}`];
      const rw = ANNOTATION_REWRITE[`${sid}#${ep}#${a.kind}#${a.chapters ?? ''}`];
      if (rw) { console.log(`  annotation ep ${ep} ${rw.kind}{${rw.chapters.slice(0, 40)}…} (REWRITE of ${a.kind}{${a.chapters}}: the extra's list slot)`); if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: rw.kind, chapters: rw.chapters, note: `${rw.note} [${B}]`, origin: 'research' }); annoN++; continue; }
      const chP = toPrintedText(chO ?? a.chapters ?? null);
      console.log(`  annotation ep ${ep} ${a.kind}${chP ? `{${String(chP).slice(0, 30)}}` : ''}${chO ? ' (overlay: verifier)' : ''}${chP !== (chO ?? a.chapters ?? null) ? ' (printed)' : ''}`);
      const listNums = /\b(1[2-9]\d|[23]\d\d)\b/.test(String(a.note ?? ''));
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters: chP, note: `${a.note}${listNums ? ' [chapter numbers in this note are the 349-slot LIST space; printed = list − 1 from 123 (N35)]' : ''} [${B}]`.slice(0, 1200), origin: 'research' });
      annoN++;
    }
    for (const hp of HOLD_PARTIALS) {
      console.log(`  annotation ep ${hp.episode} partial{${hp.chapters}} (overlay: the A47 hold convention)`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: hp.episode, kind: 'partial', chapters: toPrintedText(hp.chapters), note: `A47 hold (Sean ruled one convention for the block, wave 13): the tail is the next episode's — END stays one chapter back. ${B}`, origin: 'research' });
      annoN++;
    }
    for (const a of ANNOTATION_ADD.filter((x) => x.sid === sid)) {
      console.log(`  annotation ep ${a.episode} ${a.kind}{${a.chapters}} (overlay: verifier)`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} [${B}]`, origin: 'research' });
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
