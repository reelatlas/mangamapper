// Batch 24 wave 2 — THE RE-ZERO GAP BLOCK, APPLY (Sean ruled 2026-09-07 with Cursor: 'Yes on the block. Overlay only.' —
// WAVE2-RECOVERY.md § Questions). File-driven over the two verdict JSONs with a curated OVERLAY (P10). No ruling map moves:
// the rows are AFL-typed canon (no T6 pin — the type_corrections entries are SKIPPED as no-ops), the space is T24's (live)
// and its N35 count already stands. This script lands the research tier on rows 1-50: 50 anchors in LN VOLUME space
// (manual, P8; volume = the END on a volume-space row; A47 / A10 through lib/sliver.ts, which reads the vocabulary),
// the verifiers' wording fixes (the wiki family is ONE lineage — appended where a note over-claims; ep 34's basis
// re-based on the independent lineages; ep 45's false flip sentence struck), research-origin annotations (same-kind
// upsert replaces), and the block's ONE stored continue (ep 50 → 16: C5 unseen, landed as `parity` with the 蛇足 named
// — it differs from the END; every other C1 continue equals its END and is derived).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch24/apply-w2.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { volumeForChapter, type VolumeBound } from '../../lib/volumes';
import { sliverEnd, sliverStart } from '../../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch24/out';
const B = '[batch 24 wave 2 — the re-zero gap block, verified R24 (S2), Sean ruled 2026-09-07 with Cursor — WAVE2-RECOVERY.md]';
const FILES = ['re-zero-starting-life-in-another-world-w2a.json', 're-zero-starting-life-in-another-world-w2b.json'];
const RZ = 're-zero-starting-life-in-another-world';

// ---- THE OVERLAY
// the wiki family is ONE lineage at chapter granularity (es / zh / ru translate en — R3 counts lineages by editorship): a note that counts
// them as four gets the correction appended; the values rest on the licensor's synopses, en-WP, ja-WP's bracket, Kadokawa's labels and the
// printed contents scans (both verifiers; Sean's decision 7)
const FAMILY = /four (?:separately[- ]edited |independent )?(?:wikis|lineages)/i;
const FAMILY_NOTE = "[verifier w2-rezero-s2 / Sean 2026-09-07: the four Re:Zero wikis are ONE lineage at chapter granularity (es / zh / ru are translations of en — R3 counts lineages by editorship, not language); the volume rests on the licensor's synopses, en-WP, ja-WP's 章構成 bracket, Kadokawa's own labels and the printed contents scans]";
const ANCHOR_NOTE_APPEND: Record<string, string> = {
  [`${RZ}#34`]: "OVERLAY (Sean's decision 3, Cursor's sharpening): END 12 [11] medium stands under A47 — an unproven tail on TWO lineages with no size or teaser evidence advances (the ep-77 shape) — but the lineages are NOT 'four wikis': the second lineage is en-WP's ep-34 plot (Garfiel's rescue, the Witch's turn to the manor, Roswaal engulfed — placed in ep 34) plus Kadokawa's v12 blurb (「影に呑まれる集落、敵であるはずのガーフィールの助力」 as v12 content, no Witch in v11's); the fandom's book-side Arc 4 page is the same wiki family (R3 editorship) and the web novel's ※※ break is a cross-check, never a position; the hold at 11 [11] is the alternative only if the second lineage is rejected",
  [`${RZ}#26`]: 'verifier w2-rezero-s2: not double-length — eight first-run 30-minute airings on syobocal (the ninth is AT-X\'s October rerun at 35 min), Bandai Channel 29分 vs 26分 for ep 27; the four-unit share fits a standard slot',
};
const ANNOTATION_OVERRIDE: Record<string, { chapters?: (c: string) => string; note: (n: string) => string; why: string }> = {
  [`${RZ}#34#partial`]: { why: "the basis re-based on the independent lineages (decision 3)", note: (n) => n.replace("ALL FOUR wikis credit it — en 'Volume 12 (Ch 1)', es 'Volumen 12 (Capítulo 1)', ru 'Том 12, глава 1', zh '文库正传第12卷（第一章）' — so R3 is satisfied", "the wiki family credits it (en 'Volume 12 (Ch 1)' — es / ru / zh are its translations, ONE lineage) and a SECOND lineage places it: en-WP's ep-34 plot and Kadokawa's v12 blurb (「影に呑まれる集落、敵であるはずのガーフィールの助力」 as v12 content) — so R3 is satisfied") },
  [`${RZ}#45#side_story`]: { why: 'the false flip clause struck (verifier finding 3; decision 5)', note: (n) => n.replace(' A side_source annotation would be wrong here and would also flip a canon row to filler at write time.', ' A side_source annotation would be wrong here (a different licensed work is the T26 shape; this is the series\' own source).') },
};
// ep 50's continue: C5 unseen (v15's closing 蛇足 is never animated), landed as `parity` — the only kind the writer admits — with the skip named (Cursor: 'not C3 — C3 is a skip of chapters the anime already covered')
const CONTINUE_NOTE_FIX: Record<string, (n: string) => string> = {
  [`${RZ}#50`]: (n) => `C5 UNSEEN, landed as parity (Sean 2026-09-07, decision 4 — not C3: nothing here was covered earlier): read v15's 蛇足『――再臨』 (pp 321-328, the Omega reveal) before volume 16 — never animated through ep 79. ${n.replace(/^C2\/C3 PARITY at the next episode's start, with the skip named\. /, '')}`,
};

async function main() {
  const boundsCache = new Map<number, VolumeBound[]>();
  const series = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id');
  const mangaOf = new Map(series.map((s) => [s.id, s.manga_anilist_id]));
  const boundsFor = async (sid: string) => { const m = mangaOf.get(sid); if (!m) return []; if (!boundsCache.has(m)) boundsCache.set(m, await selectAll<VolumeBound>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', m).order('volume'))); return boundsCache.get(m)!; };
  const typeOf = new Map((await selectAll<{ series_id: string; number: number; type: string }>('episodes', 'series_id, number, type')).map((e) => [`${e.series_id}#${e.number}`, e.type]));
  let anns = 0, anchors = 0, conts = 0, skippedConts = 0, overlays = 0, family = 0;
  const nextStart = async (sid: string, ep: number, delivered: Map<number, number | null>) => {
    if (delivered.has(ep + 1)) return delivered.get(ep + 1) ?? null;
    const { data: nxt } = await db.from('chapter_anchors').select('episode, start_chapter').eq('series_id', sid).gt('episode', ep).order('episode').limit(1).maybeSingle();
    return nxt?.start_chapter ?? null;
  };
  const writeAnchor = async (sid: string, ep: number, end: number, start: number | null, chapters_adapted: string | null, note: string, delivered: Map<number, number | null>, label: string, agentVolume: number | null = null) => {
    const bd = await boundsFor(sid);
    const derived = volumeForChapter(bd, end);
    const vol = derived ?? agentVolume; // re-zero has no manga and no boundary table: the volume IS the END (T24)
    if (derived == null && agentVolume != null && agentVolume !== end) label += ` (volume: the verdict's v${agentVolume} ≠ END ${end} on a volume-space row — REFUSED)`;
    const ns = await nextStart(sid, ep, delivered);
    const normEnd = sliverEnd(chapters_adapted, end, ns);
    const normStart = start != null ? sliverStart(chapters_adapted, start) : null;
    const { data: cur } = await db.from('chapter_anchors').select('chapter, start_chapter, source').eq('series_id', sid).eq('episode', ep).maybeSingle();
    console.log(`  anchor ep ${ep} → ${start ?? '·'}-${end} v${vol ?? '·'} {${String(chapters_adapted).slice(0, 60)}} manual${cur ? ` (was ${cur.start_chapter ?? '·'}-${cur.chapter} ${cur.source})` : ' (NEW)'}${label}${normEnd.end !== end ? ` (A47 would move ${end} → ${normEnd.end}: '${normEnd.tail}')` : ''}${normStart && normStart.start !== start ? ` (A10 would move START ${start} → ${normStart.start}: '${normStart.lead.slice(0, 40)}', ${normStart.reason})` : ''}`);
    if (agentVolume != null && derived == null && agentVolume !== end) throw new Error(`${sid}#${ep}: volume ≠ END on a volume-space row — curate before applying`);
    if (normEnd.end !== end) throw new Error(`${sid}#${ep}: A47 moves the END — curate before applying`);
    if (normStart && normStart.start !== start) throw new Error(`${sid}#${ep}: A10 moves the START — curate before applying`);
    const row = { series_id: sid, episode: ep, chapter: end, start_chapter: start, chapters_adapted, volume: vol, source: 'manual', note: note.slice(0, 600) };
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${sid}#${ep}: ${error.message}`); }
    anchors++;
  };
  const withFamilyNote = (text: string) => (FAMILY.test(text) ? (family++, `${text} ${FAMILY_NOTE}`) : text);

  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    const sid: string = v.series_id;
    console.log(`\n== ${f} (${sid})`);
    const named = new Set<number>([...(v.annotations ?? []).flatMap((a: { episodes: number[] }) => a.episodes), ...(v.anchors ?? []).map((a: { episode: number }) => Number(a.episode))]);
    for (const ep of [...named].sort((a, b) => a - b)) console.log(`  baseline ep ${ep} — stored ${typeOf.get(`${sid}#${ep}`)} → no type change (AFL-typed; the confirmation entry is a no-op — no pin)`);
    const effective = new Map<number, { start: number | null; end: number }>();
    for (const a of v.anchors ?? []) effective.set(Number(a.episode), { start: a.start_chapter != null ? Number(a.start_chapter) : null, end: Number(a.end_chapter) });
    const delivered = new Map<number, number | null>([...effective].map(([ep, x]) => [ep, x.start]));
    for (const a of v.annotations ?? []) for (const ep of a.episodes as number[]) {
      const key = `${sid}#${ep}#${a.kind}`;
      const o = ANNOTATION_OVERRIDE[key];
      let note = a.note ?? ''; let chapters: string | null = a.chapters ?? null;
      if (o) { const fixed = o.note(note); if (fixed === note) throw new Error(`overlay ${key}: the note fix did not match — the verdict text changed`); note = fixed; if (o.chapters) chapters = o.chapters(String(chapters)); overlays++; }
      note = withFamilyNote(note);
      console.log(`  annotation ep ${ep} ${a.kind}${chapters ? ` {${String(chapters).slice(0, 44)}…}` : ''}${o ? ` (overlay: ${o.why.slice(0, 60)}…)` : ''}`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters, note: `${note} ${B}`.slice(0, 4000), origin: 'research' });
      anns++;
    }
    for (const a of v.anchors ?? []) {
      const ep = Number(a.episode); const key = `${sid}#${ep}`; const eff = effective.get(ep)!;
      const sources: string[] = a.sources ?? [];
      let note = `${a.why ?? a.note ?? ''}${ANCHOR_NOTE_APPEND[key] ? ` | ${ANCHOR_NOTE_APPEND[key]}` : ''}`;
      note = withFamilyNote(note);
      if (ANCHOR_NOTE_APPEND[key]) overlays++;
      await writeAnchor(sid, ep, eff.end, eff.start, a.chapters_adapted ?? null, `${note} [${sources.slice(0, 2).join(' ; ')}] ${B}`, delivered, ANCHOR_NOTE_APPEND[key] ? ' (overlay: the note re-based)' : '', a.volume != null ? Number(a.volume) : null);
    }
    for (const c of v.continue_points ?? []) {
      const ep = Number(c.episode); const eff = effective.get(ep); const key = `${sid}#${ep}`;
      if (eff && Number(c.continue_chapter) === eff.end) { skippedConts++; console.log(`  continue ep ${ep} → ${c.continue_chapter} SKIPPED — equals the END (derived, never stored; decision 4 of wave 1)`); continue; }
      let note = `${c.why ?? c.note ?? ''}`;
      if (CONTINUE_NOTE_FIX[key]) { const fixed = CONTINUE_NOTE_FIX[key](note); if (fixed === note) throw new Error(`overlay ${key}: the continue note fix did not match`); note = fixed; overlays++; }
      console.log(`  continue ep ${ep} → ${c.continue_chapter} (${c.kind}${CONTINUE_NOTE_FIX[key] ? ' — C5 unseen, landed as parity' : ''})`);
      if (!DRY) await writeCuratedContinue(sid, ep, { chapter: Number(c.continue_chapter), kind: c.kind, note: `${note} ${B}`.slice(0, 1200) });
      conts++;
    }
    if ((v.type_corrections ?? []).length) console.log(`  type_corrections: ${v.type_corrections.length} entry re-asserting the stored AFL type — SKIPPED (no pin, no retype; decision 6)`);
  }
  if (!DRY) { const { error } = await db.from('series').update({ asterisk_review: 'pending' }).eq('id', RZ).is('asterisk_review', null); if (error) throw new Error(error.message); }
  console.log(`\n[apply-w2] ${anchors} anchors, ${anns} annotations, ${conts} continues stored (${skippedConts} skipped as derived), ${overlays} overlay entries, ${family} notes carrying the one-lineage correction${DRY ? ' — DRY RUN' : ''}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
