// INCIDENT 2026-09-05, recovery step 5 — replay the research-tier anchors,
// continues and annotations of chrono-crusade / kinnikuman / orient from the
// verdict files on disk (the cited record, P11), in batch order, later files
// winning per episode, with the overlays the applied maps recorded
// (lib/rulings/applied/batch-17.ts, batch-20-waves-1-8.ts, batch-20-waves-9-16.ts)
// and today's normalizers (A47 sliverEnd, the boundary-table volume, A1, A44).
// A move the normalizer makes is printed, never hidden; a row the gates refuse
// is listed, never forced; residue is a research ask. --dry-run prints every
// write. One-shot: moves to history/ when the recovery closes (P34).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/restore-anchors.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { isAnnotationRetired } from '../../lib/rulings/retired-annotations';
import { isAnchorSuppressed } from '../../lib/rulings/anchor-suppressed';
import { writeCuratedContinue } from '../../lib/continues';
import { volumeForChapter, type VolumeBound } from '../../lib/volumes';
import { sliverEnd } from '../../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const TAG = '[restored 2026-09-05 after INCIDENT-2026-09-05 from the verdict file]';
const R = 'scripts/ingest/research/';

// the files, in the order the batches applied them (later wins per episode / per annotation key)
const FILES: Record<string, string[]> = {
  'chrono-crusade': ['batch17/out/chrono-crusade.json', 'batch18/out/chrono-crusade.json', 'batch19/out/chrono-crusade.json', 'batch20/out/chrono-crusade-w16.json'],
  kinnikuman: ['batch17/out/kinnikuman.json', 'batch19/out/kinnikuman.json', 'batch20/out/kinnikuman.json', 'batch20/out/kinnikuman-w3.json'],
  orient: ['batch20/out/orient.json'],
};
// the overlays the applied maps recorded for these series
const ANCHOR_OVERRIDE: Record<string, { end: number; chapters_adapted: string; note: string }> = {
  'kinnikuman#44': { end: 116, chapters_adapted: '116-117 (ch 117 only its opening beat)', note: "END 116 (the verifier, batch 20 wave 3 — applied/batch-20-waves-1-8.ts A4): the ch-117 plea the verdict placed in 44B is Toei's expansion; 44 ends on ch 116" },
};
const ANNOTATION_REJECT = new Set(['kinnikuman#44#partial', 'kinnikuman#45#partial']); // applied/batch-20-waves-1-8.ts P10: the 117 straddle, refuted with END 116 — ONLY the partial that names ch 117 (batch 19's ch-119 partial on 45 stood)
// the A7 zone acknowledgments (applied/batch-17.ts): the census recognises an acknowledged zone by the phrase
// 'zone-acknowledged' in the annotation's note — the original apply wrote it there, so the replay does too
const NOTE_SUFFIX: Record<string, string> = {
  'chrono-crusade#6#graft': " — zone-acknowledged (A7, batch 17): Satella is introduced via an anime-original mission; her manga intro (Act 15) is skipped entirely — no chapter adapted, A2 annotation-only.",
  'chrono-crusade#8#graft': " — zone-acknowledged (A7, batch 17): anime-original story borrowing only the spider/puppet CONCEPT from Acts 19-21 — concept-level, never a position.",
  'chrono-crusade#21#graft': " — zone-acknowledged (A7, batch 17): the Mary Magdalene flashback pulls v6 material (36-41) far out of order inside an otherwise anime-original stretch — graft, not this episode's position. Extent unverified — Act 22 'Sinner' was read by nobody (MangaDex node 404); keep the qualifier (R3, applied/batch-20-waves-9-16.ts).",
};
// C5's covered-or-not wording on a back-jump continue (lib/c3.ts#backjumpNoteOk) — the C5 curation of 2026-09-05 (§12.116) reworded such notes; the verdict's own note lacks the word
const CONTINUE_SUFFIX: Record<string, string> = {
  'kinnikuman#2': ' — chs 6-7 lie between this END and the continue: ch 7 already adapted (ep 1B), ch 6 adapted later (ep 3B) [C5]',
  'kinnikuman#3': ' — ch 7 lies between this END and the continue: already adapted (ep 1B) [C5]',
};

type Anchor = { episode: number; end_chapter: number; start_chapter?: number | null; chapters_adapted?: string | null; volume?: number | null; note?: string; sources?: string[]; confidence?: string };
type Cont = { episode: number; continue_chapter: number; kind?: string; note?: string };
type Ann = { episodes: number[]; kind: string; chapters?: string; note?: string };

async function main() {
  const series = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id', (q) => q.in('id', Object.keys(FILES)));
  const mangaOf = new Map(series.map((s) => [s.id, s.manga_anilist_id]));
  const typeOf = new Map((await selectAll<any>('episodes', 'series_id, number, type', (q) => q.in('series_id', Object.keys(FILES)))).map((e: any) => [`${e.series_id}#${e.number}`, e.type as string]));
  let anchors = 0, conts = 0, anns = 0, refused = 0, moved = 0;
  for (const [sid, files] of Object.entries(FILES)) {
    if (!mangaOf.has(sid)) { console.log(`${sid}: NOT IN CATALOG — restore the series first`); continue; }
    const bounds = mangaOf.get(sid) ? await selectAll<VolumeBound>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', mangaOf.get(sid)!)) : [];
    const anchorBy = new Map<number, Anchor & { file: string }>();
    const contBy = new Map<number, Cont & { file: string }>();
    const annList: (Ann & { file: string })[] = [];
    for (const f of files) {
      const v = JSON.parse(readFileSync(R + f, 'utf8'));
      for (const a of (v.anchors ?? []) as Anchor[]) anchorBy.set(Number(a.episode), { ...a, file: f });
      for (const c of (v.continue_points ?? []) as Cont[]) contBy.set(Number(c.episode), { ...c, file: f });
      for (const a of (v.annotations ?? []) as Ann[]) annList.push({ ...a, file: f });
    }
    console.log(`\n== ${sid}: ${anchorBy.size} anchored episodes, ${contBy.size} continues, ${annList.length} annotation records over ${files.length} file(s); bounds ${bounds.length}`);
    const eps = [...anchorBy.keys()].sort((a, b) => a - b);
    const startOf = new Map<number, number | null>(eps.map((e) => [e, anchorBy.get(e)!.start_chapter != null ? Number(anchorBy.get(e)!.start_chapter) : null]));
    const landed = new Set<number>();
    for (const ep of eps) {
      const a = anchorBy.get(ep)!;
      const key = `${sid}#${ep}`;
      const type = typeOf.get(key);
      if (!type) { console.log(`  ep ${ep}: NO ROW — refused (A42 would list it); ${a.file}`); refused++; continue; }
      if (type === 'filler') { console.log(`  ep ${ep}: filler row — no anchor (A1); ${a.file}`); refused++; continue; }
      if (isAnchorSuppressed(sid, ep)) { console.log(`  ep ${ep}: ANCHOR_SUPPRESSED (A44) — no anchor; ${a.file}`); refused++; continue; }
      const ov = ANCHOR_OVERRIDE[key];
      let end = ov ? ov.end : Number(a.end_chapter);
      const start = a.start_chapter != null ? Number(a.start_chapter) : null;
      const chapters = ov ? ov.chapters_adapted : a.chapters_adapted ?? null;
      const next = eps.find((e) => e > ep);
      const nextStart = next != null ? startOf.get(next) ?? null : null;
      const norm = sliverEnd(chapters, end, nextStart);
      let normNote = '';
      if (norm.end !== end) { normNote = ` (A47 normalized from ${end}: ${norm.tail ?? ''})`; end = norm.end; moved++; }
      const vol = volumeForChapter(bounds, end) ?? (a.volume != null ? Number(a.volume) : null);
      const note = `${ov ? ov.note + ' · ' : ''}${(a.note ?? '').slice(0, 380)} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${TAG} ${a.file}`.slice(0, 600);
      console.log(`  anchor ep ${ep} → ${start ?? '·'}-${end} v${vol ?? '·'} {${chapters ?? ''}} manual${ov ? ' (OVERLAY)' : ''}${normNote} ← ${a.file}`);
      landed.add(ep); anchors++;
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').upsert({ series_id: sid, episode: ep, chapter: end, start_chapter: start, chapters_adapted: chapters, volume: vol, source: 'manual', note }, { onConflict: 'series_id,episode' });
        if (error) throw new Error(`${key}: ${error.message}`);
      }
    }
    for (const [ep, c] of [...contBy.entries()].sort((x, y) => x[0] - y[0])) {
      if (!landed.has(ep)) { console.log(`  continue ep ${ep} → ${c.continue_chapter}: row has no anchor — skipped (the parity healer derives; C7 needs an anchored row); ${c.file}`); continue; }
      const kind = c.kind === 'post_series' ? 'post_series' : 'parity';
      console.log(`  continue ep ${ep} → ${c.continue_chapter} (${kind}) ← ${c.file}`);
      conts++;
      if (!DRY) await writeCuratedContinue(sid, ep, { chapter: Number(c.continue_chapter), kind, note: `${(c.note ?? '').slice(0, 300)}${CONTINUE_SUFFIX[`${sid}#${ep}`] ?? ''} ${TAG} ${c.file}`.slice(0, 600) });
    }
    // the batch-17 curator expanded a two-element [a, b] to a SPAN for ZONE kinds (rearranged / abridged / divergence /
    // loose_parallel — the notes count the episodes: '12 segments' over 1-6, '21 episodes' over 27-47, ep1..ep4 scrambled)
    // and read every other shape as the LIST the contract states; verify-series-display's kinnikuman ep-3 refusal was the
    // outcome check that caught the list reading here
    const ZONE_KINDS = new Set(['rearranged', 'abridged', 'divergence', 'loose_parallel']);
    const expand = (a: Ann): number[] => {
      const e = a.episodes.map(Number);
      if (e.length === 2 && e[1] - e[0] >= 2 && ZONE_KINDS.has(a.kind)) return Array.from({ length: e[1] - e[0] + 1 }, (_, i) => e[0] + i);
      return [...new Set(e)];
    };
    for (const a of annList) {
      for (const ep of expand(a)) {
        const key = `${sid}#${ep}#${a.kind}`;
        if (ANNOTATION_REJECT.has(key) && /\b117\b/.test(a.chapters ?? '')) { console.log(`  annotation ep ${ep} ${a.kind}: REJECTED by the applied overlay (P10) — skipped; ${a.file}`); continue; }
        if (isAnnotationRetired(sid, ep, a.kind)) { console.log(`  annotation ep ${ep} ${a.kind}: RETIRED (A45) — skipped; ${a.file}`); continue; }
        if (!typeOf.has(`${sid}#${ep}`)) { console.log(`  annotation ep ${ep} ${a.kind}: no row — skipped; ${a.file}`); continue; }
        const note = `${(a.note ?? '').slice(0, 900)}${NOTE_SUFFIX[key] ?? ''} ${TAG} ${a.file}`;
        console.log(`  annotation ep ${ep} ${a.kind} {${a.chapters ?? ''}} ← ${a.file}`);
        anns++;
        if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters: a.chapters ?? null, note, origin: 'research' });
      }
    }
  }
  console.log(`\n[restore-anchors] ${anchors} anchors (${moved} A47-normalized, ${refused} refused), ${conts} continues, ${anns} annotations${DRY ? ' — DRY RUN' : ' written'}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
