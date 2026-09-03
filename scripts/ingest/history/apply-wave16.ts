// Batch 20 wave 16 — the curated apply (P10): the mixed_fragment_only queue
// under T28's sliver clause, 15 verdict files (-w16). File-driven with the
// curated overlays: anchors land at the MANUAL tier with the volume derived
// (lib/volumes.ts); continues via writeCuratedContinue (C7); annotations via
// upsertAnnotation (a same-kind upsert REPLACES); an annotation whose KIND
// changed is deleted by the explicit list below (never auto — A6); types are
// T6 MAP entries (generated from the verdicts' type_corrections, asserted by
// the healer); anchor_hostile rows that stay mixed are A44 map entries.
// --dry-run prints all, plus a per-row report of stored vs delivered
// annotation kinds so the delete list can be curated.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave16.ts [--dry-run]
import { readFileSync, readdirSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';
import { sliverEnd } from '../lib/sliver';
import { volumeForChapter, type VolumeBound } from '../lib/volumes';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const B = 'batch 20 wave 16 (2026-09-04; T28 sliver clause; Sean ruled)';
const FILES = readdirSync(OUT).filter((f) => f.endsWith('-w16.json')).sort();
// annotations whose KIND the verdict replaced (old kind deleted; the new kind is in the verdict's annotations)
const ANNOTATION_DELETE: { sid: string; episode: number; kind: AnnotationKind; why: string }[] = [
  { sid: 'bleach', episode: 46, kind: 'partial', why: 'replaced by side_story{-17} (the bonus chapter carries no mainline number)' },
  { sid: 'eyeshield-21', episode: 66, kind: 'partial', why: 'replaced by loose_parallel{132-133} (no page-level evidence; a framing line)' },
  { sid: 'heavens-lost-property', episode: 23, kind: 'partial', why: 'replaced by rearranged{32} + side_story (the chapter identified)' },
  { sid: 'heavens-lost-property', episode: 24, kind: 'partial', why: 'replaced by side_story naming both 北風と太陽 extras' },
  { sid: 'naruto-shippuden', episode: 90, kind: 'partial', why: 'replaced by rearranged{343,346,347} + divergence (the thread split)' },
  { sid: 'naruto-shippuden', episode: 213, kind: 'partial', why: 'replaced by rearranged{482} + recap' },
  { sid: 'rosario-vampire', episode: 14, kind: 'graft', why: 'replaced by side_source{Season II ch 1 + 3} + recap + divergence' },
  { sid: 'tokyo-mew-mew', episode: 37, kind: 'partial', why: 'replaced by loose_parallel{19} (weight sliver)' },
];
const CONTINUE_OVERRIDE: Record<string, { chapter: number; why: string }> = {};
const START_OVERRIDE: Record<string, number> = {};
const END_OVERRIDE: Record<string, number> = {};
const ANCHOR_SKIP = new Set<string>(); // 'sid#ep' — a verifier-refuted anchor
const CONTINUE_SKIP = new Set<string>(['bleach#46']); // verifier (w16-anchors): no anchor row can hold it (A44) — the display carries the previous position forward
// fence repairs on stored rows outside the verdicts' asks (verifier-ruled)
const FENCE_REPAIR: { sid: string; episode: number; set: Record<string, unknown>; why: string }[] = [
  { sid: 'saint-seiya-knights-of-the-zodiac', episode: 65, set: { start_chapter: 38 }, why: 'Verifier (w16-anchors): ep 65 opens INSIDE ch 38 (the testament\'s aftermath) — the stored START 39 collided with ep 64\'s C1 continue 38; both the verdict\'s flag and the verifier\'s sources agree.' },
];
// rows the verifier HELD: the verdict's annotations for them are not applied (the stored record stands)
const ROW_HOLD = new Set<string>(['tokyo-mew-mew#21']);
// T26 THE CHAIN (Sean 2026-09-04): a delivered kind rewritten at apply — the sequel manga is ON THE CHAIN (I41), so the row is canon material told out of order
const KIND_OVERRIDE: Record<string, { kind: AnnotationKind; chapters: string; note: string }> = {
  'rosario-vampire#14#side_source': { kind: 'chain_source', chapters: "Season II: ch 1 'A Brand-New Season', ch 3 'Superglue Girl'", note: 'T26 THE CHAIN / I41 (Sean 2026-09-04): Rosario + Vampire Season II is the sequel manga on the series\' reading chain — its ch 1 + 3 carry the episode\'s spine, so the material is CANON to the series told out of order: the row is MIXED (canon chapters inside Gonzo\'s original Kokoa plot), POSITION-LESS (A44: the anchor column is numeric in Season I\'s space; the display carries the previous position forward). weight: significant (in the chain work). Whether Capu2 should be its own entry with Season II as its instrument is queued for the identity pass.' },
};
const EXTRA_ANNOTATIONS: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string; deleteKind?: AnnotationKind }[] = [
  { sid: 'trigun', episode: 18, kind: 'chain_source', chapters: "Trigun Maximum: ch 1 'HERO REBORN', ch 2 'LINA' (TM vol 1)", note: 'T26 THE CHAIN / I41 (Sean 2026-09-04): Trigun Maximum is the continuation manga on the series\' reading chain — its own numbering, never convertible into Trigun\'s; the standing side_source becomes chain_source (canon to the series told out of order; the row stays mixed, position-less). Re-kinded from the original side_source note.', deleteKind: 'side_source' },
];
// note fixes from the verifier (prepended to the annotation note of that row + kind)
const NOTE_FIX: Record<string, string> = {
  'saint-seiya-knights-of-the-zodiac#64#partial': 'DISCLOSED (verifier): animefillerlist types ep 64 FILLER — the sole-adaptation exception overrules it (the Aiolos testament pages appear in no other episode: fandom ep 64 + ch 38, en-WP eps 63/65); the T6 map pins mixed (P8).',
  'bleach#284#partial': 'Verifier: the fandom\'s Aizen page says ch 376 pp 1-7, its Harribel page pp 1-5 for the same scene — the share is 5-7 pages; END 376 holds either way (376 is the row\'s only record).',
  'black-butler#37#graft': 'Verifier: ch 22 pp 30-34 are FIRST-TIME pages here (the 2008 series never reaches the circus), a tease — the assignment is adapted properly at ep 38 (ch 24-25); weight: sliver.',
  'trigun#6#partial': 'Verifier: the steamer-arrival / plant-supplies beat of ch 4 is shown only here (ep 7 restages the party); a trivial first-time beat — weight: sliver, filler stands.',
  'chrono-crusade#21#graft': 'Verifier: keep the extent-unverified qualifier — Act 22 "Sinner" was read by nobody (MangaDex node 404).',
};

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
      const next = list[i + 1];
      const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : null;
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
    if (v.type_corrections?.length) console.log(`  types (T6 map, asserted by the healer): ${v.type_corrections.map((t: any) => `${t.episodes.join(',')} → ${t.type}`).join('; ')}`);
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
  console.log(`[apply-wave16] ${anchors} anchors, ${continues} continues, ${annoN} annotations, ${deleted} annotation deletions${DRY ? ' — DRY RUN' : ''}. Types (T6) + A44: map entries asserted by the healer; then census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annoN + deleted, flagged: 0 }, `apply-wave16: ${anchors} anchors, ${continues} continues, ${annoN} annotations`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
