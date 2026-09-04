// Batch 22 wave 3 — the hole wave, APPLY (Sean ruled 2026-09-05: decisions 1-5 as verified;
// 48 / 50 as delivered; eyeshield 54's END queued with ep 57). File-driven over the verdict
// JSONs with a curated OVERLAY (P10). The RULINGS land through the maps (T6 pins; the A45
// on beelzebub 51; FMA 13's records in standing-annotations.ts); this script lands the
// research tier: anchors (manual, P8, volume derived, A47 against the TRUE next START),
// the CURATED 46 / 47 repair (the verifier's diagnosis, outside the verdict's anchors),
// continues (C7), research-origin annotations (same-kind upsert replaces).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch22/apply-wave3.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { volumeForChapter, type VolumeBound } from '../../lib/volumes';
import { sliverEnd } from '../../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch22/out';
const B = '[batch 22 wave 3, verified R24, Sean ruled 2026-09-05 — WAVE3-RECOVERY.md]';
const V = '(verifier, verify/w3-*.md)';
const FILES = ['record-of-ragnarok-w3.json', 'beelzebub-w3.json', 'eyeshield-21-w3.json', 'sailor-moon-w3.json']; // fullmetal-alchemist-w3.json lands through standing-annotations.ts

// ---- THE OVERLAY
const ANNOTATION_SKIP: Record<string, string> = {
  'beelzebub#48#rearranged': "its own note says 'NOT a back-jump… every page is new' — a rearranged whose content is 'not rearranged' (P38); the crossing disappears with the 46 / 47 repair " + V,
};
const ANNOTATION_OVERRIDE: Record<string, { chapters?: string; note: (n: string) => string; why: string }> = {
  'beelzebub#58#graft': { why: 'Quetzalcoatl IS in chs 120 / 121 — seven names, not eight; the ep-59 page count is 52, not 54', note: (n) => n.replace(/eight names?/gi, 'seven names (Quetzalcoatl is in chs 120 / 121 and ep 59)').replace(/\b54\b(?=[^\d]*\(?\s*119\s*\+\s*120\s*\+\s*121)/, '52').replace(/match(?:es)? (?:it )?exactly/gi, 'is close') + ` ${V}` },
  'record-of-ragnarok#17#rearranged': { why: "programming-cafe books ch 33 to eps 18 AND 19 (2-6,7), ch 32 to 19 alone — not '19 alone' for both", note: (n) => n.replace(/single-assign(?:ing|s)[^.]*?32-33[^.]*?19 alone[^.]*\./i, 'programming-cafe books ch 32 to ep 19 alone and ch 33 to eps 18 AND 19 (2-6,7) — neither to ep 17; the pull-forward rests on ch 33\'s summary ending on ep 17\'s closing beat (Okita and Kondo arrive, Hoteison\'s warning) + en-WP\'s ep-17 summary — two witnesses for existence, one for pages.') + ` ${V}` },
  'eyeshield-21#53#graft': { why: "add Kanagushi's habit-reading (ch 109 pp 7-9) as a third, unsized ch-109 element (en-WP: 'predicting the Devil Bats' every move'); drop the A44 mention (filler is A1's alone)", note: (n) => n.replace(/A44[^.]*\./g, '').trimEnd() + ` A third, unsized ch-109 element: Kanagushi's habit-reading mechanic (pp 7-9) is staged in ep 53 against the Hiruma-less offense (en-WP: 'predicting the Devil Bats' every move') and RE-STAGED in ep 54 against Hiruma's — not a sole adaptation. Ep 53 is filler under A1 alone (no A44 entry: that rule is for canon / mixed rows) ${V}` },
};
const CONTINUE_NOTE_FIX: Record<string, (n: string) => string> = {
  'beelzebub#50': (n) => n.replace(/ch 115's OPENING pages[^.]*\./i, "ch 115's Koma-origin FLASHBACK (pp 8-19) aired earlier in eps 46 / 47 as a graft; its opening (the present frame) is ep 51's own.") + ` ${V}`,
  'record-of-ragnarok#17': (n) => (/skip|already|covered|re-read/i.test(n) ? n : `${n} This episode also covered ch 32-33 in part ahead of the continue point — skip on arrival unless re-reading (C3).`),
};
const CONTINUE_SKIP: Record<string, string> = { 'eyeshield-21#53': 'a FILLER row holds no anchor row — a continue lands nothing (C7 updates chapter_anchors); ep 52\'s stored C3 continue 109 already carries the reader' };
const ANCHOR_SKIP: Record<string, string> = { 'eyeshield-21#52': 'CONFIRMED AS STORED (110 [110] manual) — no value moves, no write' };
const ANCHOR_CHAPTERS: Record<string, string> = {
  'beelzebub#48': '106-110', // the prose ('part — the chapter straddles…') lives in the partial annotation; the A47 parsers read this field
  'beelzebub#50': '110-113',
  'beelzebub#58': '116-118, 123 (graft)',
};
// the ep-17 START repair lands as a manual anchor write (END 30 stands; A47 will be checked against ep 22's stored START 31)
const ANCHOR_REPAIR: Record<string, { end: number; start: number; chapters_adapted: string; why: string }> = {
  'record-of-ragnarok#17': { end: 30, start: 29, chapters_adapted: '29 (pp.25-50), 30, 32 (pp.6-8, 30-32), 33 (pp.27-60)', why: "the stored START 20 was batch 12's ROUND-LEVEL span ('20-30 (Round 4 complete)', applied/batch-12.ts:147) — ep 17 opens on ch 29 p.25, the frame ep 16 stops on (fandom adapted= + programming-cafe 対応表 + frame continuity); END 30 / v8 stand " + V },
};
// THE CURATED 46 / 47 REPAIR — the verifier's diagnosis (outside the verdict's anchors), Sean ruled it in this apply
const ANCHOR_ADD: { sid: string; episode: number; end: number; start: number; chapters_adapted: string; note: string; continue: { chapter: number; note: string }; graft: { chapters: string; note: string } }[] = [
  { sid: 'beelzebub', episode: 46, end: 101, start: 98, chapters_adapted: '97-101', note: `REPAIRED ${B}: the stored afg END 115 [98] {97-101, 115} was the ch-115 GRAFT promoted to a position — ch 115's present frame (pp 2-5: Kunieda, Teimō gone, at Isafuyu's house) is post-ch-114 and cannot sit here; what this episode carries of ch 115 is the Koma-origin FLASHBACK body (pp 8-19), on the fandom lineage alone (no cast list; Bandai 046 = the game war only). END 101 = the episode's own last chapter (97-101 the ネトゲ war; Bandai 046, ja-WP unbold). ${V}`, continue: { chapter: 102, note: 'C2 parity: ep 47 STARTS on ch 102 (its cast list opens on the jail scene, ch 102 pp 2-7). ' + B }, graft: { chapters: "115 (the Koma-origin flashback, pp 8-19 — relocated forward; one-lineage: the fandom's ch-115 page `episode = 46, 47, 51`)", note: `weight: SLIVER — a flashback body lifted forward so Kunieda already has Koma for ep 48's expanded battle; ch 115 is adapted PROPERLY by ep 51 (its present frame pp 1-5 + the close). Recorded on ep 46 on the fandom lineage alone (Bandai 046 is silent; no cast list) ${V}. ${B}` } },
  { sid: 'beelzebub', episode: 47, end: 105, start: 102, chapters_adapted: '102-105', note: `REPAIRED ${B}: the stored afg END 115 [115] {102-105, 115} was the ch-115 GRAFT promoted to a position AND an A13 breach (a START that is not the row's first chapter). The episode's own chapters are 102-105 (the Yolda chase / En next door — Bandai 047 = ch 102 pp 8-20; the fandom's ep summary = ch 102 pp 2-7); its cast list opens '#1 Kunieda, #2 Isafuyu' BEFORE '#3 Hecadoth, #4 Laymia' (= ch 102 pp 2-7): a relocated cold open of ch 115's flashback (pp 8-19). ${V}`, continue: { chapter: 106, note: 'C2 parity: ep 48 STARTS on ch 106 p1 (the fandom reverse index 106-109 → 48 only; Bandai 048). ' + B }, graft: { chapters: "115 (the Koma-origin flashback, pp 8-19 — the cold open; the fandom's ch-115 page `episode = 46, 47, 51` + ep 47's own cast list)", note: `weight: SLIVER — Kunieda / Isafuyu's cold open is ch 115's flashback body relocated forward (two sources: the fandom's reverse index + the row's cast-list order); ch 115 is adapted PROPERLY by ep 51 (its present frame + close). The stored END 115 was this graft read as a position ${V}. ${B}` } },
];

async function main() {
  const boundsCache = new Map<number, VolumeBound[]>();
  const series = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id');
  const mangaOf = new Map(series.map((s) => [s.id, s.manga_anilist_id]));
  const boundsFor = async (sid: string) => { const m = mangaOf.get(sid); if (!m) return []; if (!boundsCache.has(m)) boundsCache.set(m, await selectAll<VolumeBound>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', m).order('volume'))); return boundsCache.get(m)!; };
  const typeOf = new Map((await selectAll<any>('episodes', 'series_id, number, type')).map((e: any) => [`${e.series_id}#${e.number}`, e.type]));
  let anns = 0, anchors = 0, conts = 0;
  const touched = new Set<string>();
  const nextStart = async (sid: string, ep: number, delivered: Map<number, number | null>) => {
    if (delivered.has(ep + 1)) return delivered.get(ep + 1) ?? null;
    const { data: nxt } = await db.from('chapter_anchors').select('episode, start_chapter').eq('series_id', sid).gt('episode', ep).order('episode').limit(1).maybeSingle();
    return nxt?.start_chapter ?? null;
  };
  const writeAnchor = async (sid: string, ep: number, end: number, start: number | null, chapters_adapted: string | null, note: string, delivered: Map<number, number | null>, label: string, agentVolume: number | null = null) => {
    const bd = await boundsFor(sid);
    // the boundary table is the derivation; a series with NO boundary rows (record-of-ragnarok) falls back to the verdict's two-sourced volume and says so
    const derived = volumeForChapter(bd, end);
    const vol = derived ?? agentVolume;
    if (derived == null && agentVolume != null) label += ` (volume: the verdict's v${agentVolume} — no boundary row for ch ${end})`;
    else if (derived != null && agentVolume != null && derived !== agentVolume) label += ` (volume derived: agent said v${agentVolume})`;
    const ns = await nextStart(sid, ep, delivered);
    const norm = sliverEnd(chapters_adapted, end, ns);
    const { data: cur } = await db.from('chapter_anchors').select('chapter, start_chapter, source').eq('series_id', sid).eq('episode', ep).maybeSingle();
    console.log(`  anchor ep ${ep} → ${start ?? '·'}-${end} v${vol ?? '·'} {${chapters_adapted}} manual${cur ? ` (was ${cur.start_chapter ?? '·'}-${cur.chapter} ${cur.source})` : ' (NEW)'}${label}${norm.end !== end ? ` (A47 would move ${end} → ${norm.end}: '${norm.tail}', ${norm.pages} pp)` : ''}`);
    if (norm.end !== end) throw new Error(`${sid}#${ep}: A47 moves the END — curate before applying`);
    const row = { series_id: sid, episode: ep, chapter: end, start_chapter: start, chapters_adapted, volume: vol, source: 'manual', note: note.slice(0, 600) };
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${sid}#${ep}: ${error.message}`); }
    anchors++;
  };

  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    const sid: string = v.series_id; touched.add(sid);
    console.log(`\n== ${f} (${sid})`);
    const named = new Set<number>([...(v.type_corrections ?? []).flatMap((t: any) => t.episodes), ...(v.annotations ?? []).flatMap((a: any) => a.episodes), ...(v.anchors ?? []).map((a: any) => Number(a.episode))]);
    for (const ep of [...named].sort((a, b) => a - b)) { const tc = (v.type_corrections ?? []).find((t: any) => t.episodes.includes(ep)); console.log(`  baseline ep ${ep} — stored ${typeOf.get(`${sid}#${ep}`)} → ${tc ? tc.type : 'no type change'}`); }
    const delivered = new Map<number, number | null>((v.anchors ?? []).map((a: any) => [Number(a.episode), a.start_chapter != null ? Number(a.start_chapter) : null]));
    for (const [k, r] of Object.entries(ANCHOR_REPAIR)) if (k.startsWith(`${sid}#`)) delivered.set(Number(k.split('#')[1]), r.start);
    for (const a of ANCHOR_ADD) if (a.sid === sid) delivered.set(a.episode, a.start);
    // annotations
    for (const a of v.annotations ?? []) for (const ep of a.episodes as number[]) {
      const key = `${sid}#${ep}#${a.kind}`;
      if (ANNOTATION_SKIP[key]) { console.log(`  annotation ep ${ep} ${a.kind} DROPPED — ${ANNOTATION_SKIP[key].slice(0, 80)}…`); continue; }
      const o = ANNOTATION_OVERRIDE[key];
      let note = a.note ?? '';
      if (o) { const fixed = o.note(note); if (fixed === note) throw new Error(`overlay ${key}: the note fix did not match — the verdict text changed`); note = fixed; }
      const chapters = o?.chapters ?? a.chapters ?? null;
      console.log(`  annotation ep ${ep} ${a.kind}${chapters ? ` {${String(chapters).slice(0, 50)}…}` : ''}${o ? ` (overlay: ${o.why.slice(0, 60)}…)` : ''}`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters, note: `${note} ${B}`.slice(0, 4000), origin: 'research' });
      anns++;
    }
    // anchors (file)
    for (const a of v.anchors ?? []) {
      const key = `${sid}#${a.episode}`;
      if (ANCHOR_SKIP[key]) { console.log(`  anchor ep ${a.episode} SKIPPED — ${ANCHOR_SKIP[key]}`); continue; }
      const end = Number(a.end_chapter ?? a.chapter); const start = a.start_chapter != null ? Number(a.start_chapter) : null;
      await writeAnchor(sid, Number(a.episode), end, start, ANCHOR_CHAPTERS[key] ?? a.chapters_adapted ?? null, `${a.why ?? a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`, delivered, ANCHOR_CHAPTERS[key] ? ' (chapters_adapted kept clean — the prose is in the partial)' : '', a.volume != null ? Number(a.volume) : null);
    }
    // anchor repairs (overlay)
    for (const [k, r] of Object.entries(ANCHOR_REPAIR)) if (k.startsWith(`${sid}#`)) { const { data: cur } = await db.from('chapter_anchors').select('volume').eq('series_id', sid).eq('episode', Number(k.split('#')[1])).maybeSingle(); await writeAnchor(sid, Number(k.split('#')[1]), r.end, r.start, r.chapters_adapted, `${r.why} ${B}`, delivered, ' (REPAIR)', cur?.volume ?? null); }
    // curated adds (46 / 47)
    for (const a of ANCHOR_ADD) if (a.sid === sid) {
      await writeAnchor(sid, a.episode, a.end, a.start, a.chapters_adapted, a.note, delivered, ' (CURATED REPAIR — the verifier\'s diagnosis)');
      console.log(`  continue ep ${a.episode} → ${a.continue.chapter} (parity, curated)`);
      if (!DRY) await writeCuratedContinue(sid, a.episode, { chapter: a.continue.chapter, kind: 'parity', note: a.continue.note }); conts++;
      console.log(`  annotation ep ${a.episode} graft {${a.graft.chapters.slice(0, 40)}…} (curated)`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: a.episode, kind: 'graft', chapters: a.graft.chapters, note: a.graft.note, origin: 'research' }); anns++;
    }
    // continues (file)
    for (const c of v.continue_points ?? []) {
      const key = `${sid}#${c.episode}`;
      if (CONTINUE_SKIP[key]) { console.log(`  continue ep ${c.episode} SKIPPED — ${CONTINUE_SKIP[key].slice(0, 90)}…`); continue; }
      let note = `${c.why ?? c.note ?? ''}`;
      if (CONTINUE_NOTE_FIX[key]) note = CONTINUE_NOTE_FIX[key](note);
      console.log(`  continue ep ${c.episode} → ${c.continue_chapter} (${c.kind})${CONTINUE_NOTE_FIX[key] ? ' (note fixed)' : ''}`);
      if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: Number(c.continue_chapter), kind: c.kind, note: `${note} ${B}` });
      conts++;
    }
  }
  if (!DRY) { const { error } = await db.from('series').update({ asterisk_review: 'pending' }).in('id', [...touched, 'fullmetal-alchemist']).is('asterisk_review', null); if (error) throw new Error(error.message); }
  console.log(`\n[apply-wave3] ${anns} annotations, ${anchors} anchors, ${conts} continues${DRY ? ' — DRY RUN' : ''}; the T6 pins, the A45 on beelzebub 51 and FMA 13's records land through the maps (assert-overrides)`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
