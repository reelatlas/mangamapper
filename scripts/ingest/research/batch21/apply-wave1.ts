// Batch 21 wave 1 — the curated apply (P10): the STRONG AFL-vs-AFG type
// contradictions settled by chapter accounting (T4 / T28), 9 verdict files
// (-w1, -w1a, -w1b). Derived from the wave-16 shape (history/apply-wave1.ts). File-driven with the
// curated overlays: anchors land at the MANUAL tier with the volume derived
// (lib/volumes.ts); continues via writeCuratedContinue (C7); annotations via
// upsertAnnotation (a same-kind upsert REPLACES); an annotation whose KIND
// changed is deleted by the explicit list below (never auto — A6); types are
// T6 MAP entries (generated from the verdicts' type_corrections, asserted by
// the healer); anchor_hostile rows that stay mixed are A44 map entries.
// --dry-run prints all, plus a per-row report of stored vs delivered
// annotation kinds so the delete list can be curated.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch21/apply-wave1.ts [--dry-run]
import { readFileSync, readdirSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { sliverEnd } from '../../lib/sliver';
import { volumeForChapter, type VolumeBound } from '../../lib/volumes';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch21/out';
const B = 'batch 21 wave 1 (2026-09-04; T4 contradictions by chapter accounting; Sean ruled)';
const FILES = readdirSync(OUT).filter((f) => /-w1[ab]?\.json$/.test(f)).sort();
// annotations whose KIND the verdict replaced (old kind deleted; the new kind is in the verdict's annotations)
const ANNOTATION_DELETE: { sid: string; episode: number; kind: AnnotationKind; why: string }[] = [
  { sid: 'dragon-ball-z', episode: 43, kind: 'graft', why: 'retired in favour of partial{246 (p.10-14)} — the row is mixed with the anchor (verifier: Kanzenshuu ep 43 = ch 246 p.10-end)' },
  { sid: 'inuyasha', episode: 79, kind: 'partial', why: 'replaced by graft{219 (p.1)} weight sliver (AFG\'s own note: "only adapts page 1")' },
  { sid: 'slam-dunk', episode: 92, kind: 'partial', why: 'replaced by graft{194} weight sliver, a duplicate (AFG: "only watch from 19:14 to the end")' },
  { sid: 'one-piece', episode: 50, kind: 'graft', why: 'no source puts ch 98 in ep 50 (verifier: ch 97/98 summaries have no goggles beat; OPwiki Unbekannt; AFG\'s 98 = the 49 → 52 plateau)' },
  { sid: 'one-piece', episode: 203, kind: 'graft', why: 'replaced by partial{303 (p.16-18)} + rearranged — the row is mixed with the anchor (fandom infobox chapter = 303 p.16-18)' },
];
const CONTINUE_OVERRIDE: Record<string, { chapter: number; why: string }> = {};
const START_OVERRIDE: Record<string, number> = {};
const END_OVERRIDE: Record<string, number> = {};
const ANCHOR_SKIP = new Set<string>(); // 'sid#ep' — a verifier-refuted anchor
const CONTINUE_SKIP = new Set<string>(); // verifier (w16-anchors): no anchor row can hold it (A44) — the display carries the previous position forward
// fence repairs on stored rows outside the verdicts' asks (verifier-ruled)
const FENCE_REPAIR: { sid: string; episode: number; set: Record<string, unknown>; why: string }[] = [];
// rows the verifier HELD: the verdict's annotations for them are not applied (the stored record stands)
const ROW_HOLD = new Set<string>();
// per-annotation SKIPS (verifier w1-flips): fairy-tail 246's divergence carries non-chapter text in `chapters` (wrong kind) and its
// `unverified` double-records a segment already weighed SIGNIFICANT (would park the row in unverified_share for a page count nobody needs)
const ANNOTATION_SKIP = new Set<string>(['fairy-tail#246#divergence', 'fairy-tail#246#unverified']);
// TYPE overrides at curation (the T6 entries are generated from type_corrections MINUS these): one-piece 50 stays FILLER — a
// novelization is canon only by an `adopted` ruling (T26), which the verdict does not supply; its side_source note lands on the filler row
const TYPE_SKIP = new Set<string>(['one-piece#50']);
// T26 THE CHAIN (Sean 2026-09-04): a delivered kind rewritten at apply — the sequel manga is ON THE CHAIN (I41), so the row is canon material told out of order
const KIND_OVERRIDE: Record<string, { kind: AnnotationKind; chapters: string; note: string }> = {};
const EXTRA_ANNOTATIONS: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string; deleteKind?: AnnotationKind }[] = [];
// note fixes from the verifier (prepended to the annotation note of that row + kind)
const NOTE_FIX: Record<string, string> = {};

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  const seriesRows = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id');
  const mangaOf = new Map(seriesRows.map((s) => [s.id, s.manga_anilist_id]));
  const allBounds = await selectAll<VolumeBound & { manga_anilist_id: number }>('volume_boundaries', 'manga_anilist_id, volume, chapter_start, chapter_end');
  const stored = await selectAll<any>('episode_annotations', 'series_id, episode, kind');
  const storedKinds = new Map<string, Set<string>>();
  for (const a of stored) { const k = `${a.series_id}#${a.episode}`; storedKinds.set(k, (storedKinds.get(k) ?? new Set()).add(a.kind)); }
  let anchors = 0, continues = 0, annoN = 0, deleted = 0;
  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8')); const sid = v.series_id as string;
    console.log(`== ${sid} (${f})`);
    const bounds = allBounds.filter((b) => b.manga_anilist_id === mangaOf.get(sid));
    const list = [...(v.anchors ?? [])].sort((x: any, y: any) => Number(x.episode) - Number(y.episode));
    for (let i = 0; i < list.length; i++) {
      const a = list[i]; const key = `${sid}#${a.episode}`;
      if (ANCHOR_SKIP.has(key)) { console.log(`  anchor ep ${a.episode} SKIPPED (verifier)`); continue; }
      // A47 needs the TRUE next episode's START — the next row in a non-contiguous verdict is not it (batch 21: one-piece 195's
      // END was 'normalized' against ep 203's START). Delivered next-episode row first, else the stored anchor for episode + 1.
      const next = list[i + 1];
      let nextStart: number | null = null;
      if (next && Number(next.episode) === Number(a.episode) + 1) nextStart = Number(next.start_chapter ?? next.end_chapter);
      else {
        const { data: st } = await db.from('chapter_anchors').select('start_chapter, chapter').eq('series_id', sid).eq('episode', Number(a.episode) + 1).maybeSingle();
        nextStart = st ? Number(st.start_chapter ?? st.chapter) : null;
      }
      const ruledEnd = END_OVERRIDE[key];
      const verdict = ruledEnd != null ? { ...sliverEnd(a.chapters_adapted, ruledEnd, nextStart), end: ruledEnd } : sliverEnd(a.chapters_adapted, Number(a.end_chapter), nextStart);
      const vol = volumeForChapter(bounds, verdict.end) ?? (a.volume != null ? Number(a.volume) : null);
      const start = START_OVERRIDE[key] ?? (a.start_chapter != null ? Number(a.start_chapter) : null);
      const row = { series_id: sid, episode: Number(a.episode), chapter: verdict.end, start_chapter: start, chapters_adapted: a.chapters_adapted ?? null, volume: vol, source: 'manual', note: `${verdict.end !== Number(a.end_chapter) ? `A47: END ${a.end_chapter} → ${verdict.end}. ` : ''}${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
      console.log(`  anchor ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter} v${row.volume ?? '·'}`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`); }
      anchors++;
    }
    for (const c of v.continue_points ?? []) {
      if (CONTINUE_SKIP.has(`${sid}#${c.episode}`)) { console.log(`  continue ep ${c.episode} SKIPPED (no anchor row can hold it — A44)`); continue; }
      const o = CONTINUE_OVERRIDE[`${sid}#${c.episode}`]; const chapter = o?.chapter ?? Number(c.continue_chapter);
      console.log(`  continue ep ${c.episode} → ${chapter} (${c.kind})${o ? ' (overlay)' : ''}`);
      if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter, kind: c.kind, note: `${o ? `${o.why} ` : ''}${c.note ?? c.why ?? ''} ${B}` });
      continues++;
    }
    const delivered = new Map<number, Set<string>>();
    for (const a of v.annotations ?? []) for (const ep of a.episodes as number[]) {
      if (ROW_HOLD.has(`${sid}#${ep}`)) { console.log(`  annotation ep ${ep} ${a.kind} HELD (verifier)`); continue; }
      if (ANNOTATION_SKIP.has(`${sid}#${ep}#${a.kind}`)) { console.log(`  annotation ep ${ep} ${a.kind} SKIPPED (verifier)`); continue; }
      const fix = NOTE_FIX[`${sid}#${ep}#${a.kind}`];
      const ko = KIND_OVERRIDE[`${sid}#${ep}#${a.kind}`];
      if (ko) { delivered.set(ep, (delivered.get(ep) ?? new Set()).add(ko.kind)); console.log(`  annotation ep ${ep} ${a.kind} → ${ko.kind}{${ko.chapters.slice(0, 30)}} (KIND OVERRIDE: the chain)`); if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: ko.kind, chapters: ko.chapters, note: `${ko.note} Original research note: ${String(a.note).slice(0, 400)} [${B}]`.slice(0, 1200), origin: 'research' }); annoN++; continue; }
      delivered.set(ep, (delivered.get(ep) ?? new Set()).add(a.kind));
      console.log(`  annotation ep ${ep} ${a.kind}{${String(a.chapters ?? '').slice(0, 36)}}`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters: a.chapters ?? null, note: `${fix ? `${fix} ` : ''}${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
      annoN++;
    }
    for (const [ep, kinds] of delivered) {
      const old = [...(storedKinds.get(`${sid}#${ep}`) ?? [])].filter((k) => !kinds.has(k));
      if (old.length) console.log(`  REPORT ep ${ep}: stored kinds not re-delivered → ${old.join(', ')} (curate ANNOTATION_DELETE if the verdict replaced them)`);
    }
    for (const h of v.anchor_hostile ?? []) {
      if (ROW_HOLD.has(`${sid}#${h.episode}`)) { console.log(`  hostile ep ${h.episode} HELD (verifier)`); continue; }
      const { data: cur } = await db.from('chapter_anchors').select('chapter').eq('series_id', sid).eq('episode', Number(h.episode)).maybeSingle();
      console.log(`  hostile ep ${h.episode}${cur ? ` — stored anchor ${cur.chapter} DELETED (A1 / A44)` : ' (no anchor stored)'}`);
      if (!DRY && cur) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', Number(h.episode)); if (error) throw new Error(error.message); }
    }
    if (v.type_corrections?.length) console.log(`  types (T6 map, asserted by the healer): ${v.type_corrections.map((t: any) => `${t.episodes.join(',')} → ${t.type}${t.episodes.some((e: number) => TYPE_SKIP.has(`${sid}#${e}`)) ? ' (SKIPPED at curation)' : ''}`).join('; ')}`);
  }
  for (const x of EXTRA_ANNOTATIONS) {
    console.log(`  annotation ${x.sid} ep ${x.episode} ${x.kind}{${x.chapters.slice(0, 30)}}${x.deleteKind ? ` (replaces ${x.deleteKind})` : ''}`);
    if (!DRY) { await upsertAnnotation({ series_id: x.sid, episode: x.episode, kind: x.kind, chapters: x.chapters, note: `${x.note} [${B}]`, origin: 'research' }); if (x.deleteKind) { const { error } = await db.from('episode_annotations').delete().eq('series_id', x.sid).eq('episode', x.episode).eq('kind', x.deleteKind); if (error) throw new Error(error.message); } }
    annoN++;
  }
  for (const r of FENCE_REPAIR) {
    console.log(`  REPAIR ${r.sid} ep ${r.episode}: ${JSON.stringify(r.set)} — ${r.why.slice(0, 80)}`);
    if (!DRY) { const { data: cur } = await db.from('chapter_anchors').select('note').eq('series_id', r.sid).eq('episode', r.episode).maybeSingle(); const { error } = await db.from('chapter_anchors').update({ ...r.set, source: 'manual', note: `${r.why} ${B} | ${String(cur?.note ?? '')}`.slice(0, 600) }).eq('series_id', r.sid).eq('episode', r.episode); if (error) throw new Error(error.message); }
  }
  for (const d of ANNOTATION_DELETE) {
    console.log(`  DELETE annotation ${d.sid} ep ${d.episode} ${d.kind} — ${d.why}`);
    if (!DRY) { const { error } = await db.from('episode_annotations').delete().eq('series_id', d.sid).eq('episode', d.episode).eq('kind', d.kind); if (error) throw new Error(error.message); }
    deleted++;
  }
  console.log(`[apply-wave1] ${anchors} anchors, ${continues} continues, ${annoN} annotations, ${deleted} annotation deletions${DRY ? ' — DRY RUN' : ''}. Types (T6) + A44: map entries asserted by the healer; then census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annoN + deleted, flagged: 0 }, `apply-wave1: ${anchors} anchors, ${continues} continues, ${annoN} annotations`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
