// Batch 22 wave 1 — the curated apply (P10): the Boruto follow-up (chain rows lane I + AFL's loose bucket lane C), 2 verdict files (-w1a / -w1b). Derived from apply-wave2.ts: the STRONG AFL-vs-AFG type
// contradictions settled by chapter accounting (T4 / T28), 9 verdict files
// (-w1, -w1a, -w1b). Derived from the wave-16 shape (history/apply-wave2.ts). File-driven with the
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
const OUT = 'scripts/ingest/research/batch22/out';
const B = 'batch 22 wave 1 (2026-09-04; the Boruto chain follow-up; Sean ruled)';
const FILES = readdirSync(OUT).filter((f) => /-w1[ab]\.json$/.test(f)).sort();
// annotations whose KIND the verdict replaced (old kind deleted; the new kind is in the verdict's annotations)
const ANNOTATION_DELETE: { sid: string; episode: number; kind: AnnotationKind; why: string }[] = [];
const CONTINUE_OVERRIDE: Record<string, { chapter: number; why: string }> = {};
const START_OVERRIDE: Record<string, number> = {};
// chapters_adapted rewritten at write (verifier w3-flips): the delivered TAIL wording tripped lib/sliver.ts#sliverEnd — ep 113's
// 344 segment said 'flashback pages open ep 114' (SCRAPPY → END 343, wrong: the episode adapts 344 through the snake-and-hawk
// speech), ep 114's 346 segment said 'replays the reversal' (SCRAPPY → END 345, wrong: en-WP credits the Sharingan-to-Kabuto beat
// independently, A47 advances). The stored text must not re-trip end_sliver_mismatch, so the record is reworded, not overridden.
const CHAPTERS_ADAPTED_FIX: Record<string, string> = {};
// annotation chapters rewritten at write (verifier): an inferred page count is not a count
const ANNOTATION_CHAPTERS_FIX: Record<string, string> = {
  // RECOMMENDED RULING (verifier w1-boruto, finding 2): the one-shot is its own AniList work (87175, ONE_SHOT, sequel to Scarlet Spring) — a chain node with a colon-free label, not a 'Naruto Gaiden' sub-item. Remove if Sean keeps one Gaiden label.
  'boruto-naruto-next-generations#39#chain_source': 'The Path Lit by the Full Moon: the unnumbered one-shot 「満ちた月が照らす道」 (Kishimoto, 2016; collected at the back of Boruto vol 1), adapted in full',
  'boruto-naruto-next-generations#39#divergence': 'The Path Lit by the Full Moon: the one-shot',
};
const END_OVERRIDE: Record<string, number> = {};
const ANCHOR_SKIP = new Set<string>(); // 'sid#ep' — a verifier-refuted anchor. shippuden 112 WAS here as "position-less (A44)"; Sean ruled 2026-09-03 that behind is not a basis: END 318 [317] lands (A8), continue 343 curated (C5), 113-117 are the next narrow ask (verify:hole)
const CONTINUE_SKIP = new Set<string>(); // shippuden 112's continue 343/parity rides WITH its anchor (C7 — the healer refuses the row while 113 is unanchored)
const CONTINUE_NOTE_FIX: { sid: string; episode: number; chapter: number; note: string }[] = [];
// rows the verdicts retype FILLER whose stored MANUAL anchors come out (A1) — curated after the verifier
const ANCHOR_DELETE: { sid: string; episode: number; why: string }[] = [];
// fence repairs on stored rows outside the verdicts' asks (verifier-ruled)
const TYPE_SKIP = new Set<string>(); // 'sid#ep' — a type_correction held at curation
const FENCE_REPAIR: { sid: string; episode: number; set: Record<string, unknown>; why: string }[] = [];
// rows the verifier HELD: the verdict's annotations for them are not applied (the stored record stands)
const ROW_HOLD = new Set<string>();
// per-annotation SKIPS (verifier w1-flips): fairy-tail 246's divergence carries non-chapter text in `chapters` (wrong kind) and its
// `unverified` double-records a segment already weighed SIGNIFICANT (would park the row in unverified_share for a page count nobody needs)
const ANNOTATION_SKIP = new Set<string>(['boruto-naruto-next-generations#93#side_source', 'boruto-naruto-next-generations#94#side_source', 'boruto-naruto-next-generations#95#side_source']); // verifier w1-boruto: these rows are RULING-tier (standing-annotations.ts, origin 'ruling') — the T26 healer re-upserts them every run, so a research apply would be reverted; the novel map lands by EDITING the ruling entry (on Sean's go)
// verifier: prose in a divergence's chapters field is not a chapter list — nulled at write
const CHAPTERS_NULL = new Set<string>(['boruto-naruto-next-generations#93#abridged', 'boruto-naruto-next-generations#94#abridged', 'boruto-naruto-next-generations#95#abridged']); // verifier: a novel's chapter map is not a manga chapter list
// T26 THE CHAIN (Sean 2026-09-04): a delivered kind rewritten at apply — the sequel manga is ON THE CHAIN (I41), so the row is canon material told out of order
const KIND_OVERRIDE: Record<string, { kind: AnnotationKind; chapters: string; note: string }> = {
  // RECOMMENDED RULING (rule ep 18 with ep 39): the omake is a Kishimoto MANGA in the continuity with its own AniList id (87402) — on the chain as its own node, chain_source, not a foreign licensed side work. Remove if Sean keeps it side_source.
  'boruto-naruto-next-generations#18#side_source': { kind: 'chain_source', chapters: 'The Day Naruto Became Hokage: the unnumbered special extra 『BORUTO -NARUTO THE MOVIE- 特別番外編 ナルトが火影になった日』 (Kishimoto, 2015; printed in 秘伝・在の書), adapted as the first half', note: "weight: SIGNIFICANT — the omake is the episode's first half end to end (the day of Naruto's inauguration: the sleeping-Naruto gag, Konohamaru's shadow clone at the ceremony); the second half is anime-original. On the ruled chain as its own node (Sean 2026-09-04), so chain_source: canon material told out of order, position-less (no chapter number; A44)." },
};
const EXTRA_ANNOTATIONS: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string; deleteKind?: AnnotationKind }[] = [];
// note fixes from the verifier (prepended to the annotation note of that row + kind)
const NOTE_FIX: Record<string, string> = {
  'boruto-naruto-next-generations#95#abridged': "verifier w1-boruto: ep 95's coda (Naruto gifts Boruto the kunai set) is the novel's ch 1 CLOSING beat relocated, and the novel's Epilogue is unadapted (missing from the delivered list). ",
  'boruto-naruto-next-generations#18#side_source': "verifier w1-boruto: Narutopedia's index is SILENT on the omake — only AFG names it ('OMAKE: The Day Naruto Became Hokage'); the tie rests on AFG + the movie book's own contents. ",
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
      // A47 needs the TRUE next episode's START — the next row in a non-contiguous verdict is not it (batch 21: one-piece 195's
      // END was 'normalized' against ep 203's START). Delivered next-episode row first, else the stored anchor for episode + 1.
      const next = list[i + 1];
      let nextStart: number | null;
      if (next && Number(next.episode) === Number(a.episode) + 1) nextStart = Number(next.start_chapter ?? next.end_chapter);
      else {
        const { data: st } = await db.from('chapter_anchors').select('start_chapter, chapter').eq('series_id', sid).eq('episode', Number(a.episode) + 1).maybeSingle();
        nextStart = st ? Number(st.start_chapter ?? st.chapter) : null;
      }
      if (CHAPTERS_ADAPTED_FIX[key]) { a.chapters_adapted = CHAPTERS_ADAPTED_FIX[key]; console.log(`  anchor ep ${a.episode} chapters_adapted REWORDED (verifier — sliverEnd wording)`); }
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
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters: CHAPTERS_NULL.has(`${sid}#${ep}#${a.kind}`) ? null : (ANNOTATION_CHAPTERS_FIX[`${sid}#${ep}#${a.kind}`] ?? a.chapters ?? null), note: `${fix ? `${fix} ` : ''}${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
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
  for (const c of CONTINUE_NOTE_FIX) {
    console.log(`  continue NOTE ${c.sid} ep ${c.episode} (value ${c.chapter} unchanged)`);
    if (!DRY) await writeCuratedContinue(c.sid, c.episode, { chapter: c.chapter, kind: 'parity', note: `${c.note} ${B}` });
  }
  for (const d of ANCHOR_DELETE) {
    const { data: cur } = await db.from('chapter_anchors').select('chapter, source').eq('series_id', d.sid).eq('episode', d.episode).maybeSingle();
    console.log(`  DELETE anchor ${d.sid} ep ${d.episode}${cur ? ` (was ${cur.chapter}, ${cur.source})` : ' (absent)'} — ${d.why.slice(0, 90)}`);
    if (!DRY && cur) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', d.sid).eq('episode', d.episode); if (error) throw new Error(error.message); }
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
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annoN + deleted, flagged: 0 }, `apply-wave2: ${anchors} anchors, ${continues} continues, ${annoN} annotations`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
