// BATCH 23 WAVE 1 APPLY — the refuted-pin wave (record-of-ragnarok 12 / 18-41, eyeshield-21 54-57, sailor-moon 73-77,
// beelzebub 59), Sean's rulings 2026-09-07 with Cursor (WAVE1-RECOVERY.md; the three verifier reports in verify/). File-driven
// with a curated OVERLAY (the batch-24 pattern): the verdict JSONs are the record set; every deviation is a keyed entry with
// its reason. NO CONTINUE IS WRITTEN HERE — C2 (amended 2026-09-07) derives every continue in heal-coverage-continues from the
// anchors and annotations this script lands. Types (T6), the position-less row (A44) and the chapter spaces (N35) land through
// their maps and assert-overrides on the heal. Idempotent; --dry-run prints every change without writing.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch23/apply-w1.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { volumeForChapter, type VolumeBound } from '../../lib/volumes';
import { sliverEnd, sliverStart } from '../../lib/sliver';
import { writeCuratedContinue } from '../../lib/continues';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch23/out';
const B = '[batch 23 wave 1 — the refuted-pin wave, verified R24, Sean ruled 2026-09-07 with Cursor — WAVE1-RECOVERY.md]';
const FILES = ['record-of-ragnarok-w1.json', 'eyeshield-21-w1.json', 'sailor-moon-w1.json', 'beelzebub-w1.json'];
const ROK = 'record-of-ragnarok', EYE = 'eyeshield-21', SM = 'sailor-moon';

// ---- THE OVERLAY (Sean 2026-09-07 with Cursor) ----
const ANCHOR_OVERRIDE: Record<string, { end?: number; start?: number; volume?: number; why: string }> = {
  [`${SM}#73`]: { start: 18, why: "option (b), one principle for 73 / 74: a re-tread never sets a START (A10's recap clause) and a row shows its first first-time chapter (A13) — ep 73 opens on Act 18's beat; the 15-17 abduction montage is a restaging of Acts already adapted at eps 70-72 and stays in the span and the rearranged note" },
  [`${EYE}#55`]: { start: 113, why: "A10's letter: the leading partial of ch 112 (images 20-24) is exactly five pages — 'at most five' is scraps — so the START is 113; ch 112's body (pp.5-19) is ep 57's; the span keeps '112 (pp.20-24)' and the partial{112} note names it" },
};
const ANCHOR_CHAPTERS_FIX: Record<string, { fix: (c: string) => string; why: string }> = {
  [`${EYE}#57`]: { fix: (c) => c.replace('112 (pp.2-19)', '112 (pp.5-19)'), why: 'the verifier: images 3-4 are non-story pages — the ch-112 share is pp.5-19 (page-verified)' },
};
const ANCHOR_NOTE_APPEND: Record<string, string> = {
  [`${ROK}#23`]: "DISSENT RECORDED (the verifier): programming-cafe's 対応表 books ch 43 to ep 22 alone (ep 23 = 44-45) and the fandom's own ep-22 plot plays the opening of the pp.16-21 scene shortened — START 43 stands on the field's six pages (one over A10's five-page line); if ep 22 already plays that opening, A10's recap clause could still make it 44 — Sean ruled 43 (2026-09-07)",
  [`${ROK}#19`]: "the verifier: the ch-34 sliver (pp.28-30) is Zeus seeing Shiva's broken arm, not '1116 souls' — the wording in the delivered why is corrected here",
};
// annotations: a REJECT drops the delivered record; an override rewrites chapters and / or the note (each must match, else the verdict text changed)
const ANNOTATION_REJECT: Record<string, string> = {
  [`${ROK}#25#rearranged`]: "REFUTED by the verifier: ep 26's Plot opens on ch 51's rose beat and none of ch 49's tail appears — ch 49 pp.23-26 are a GAP (never adapted), not a relocation",
  [`${ROK}#26#rearranged`]: 'the same record on the other row of the pair — refuted (a gap, not a relocation)',
};
const ANNOTATION_OVERRIDE: Record<string, { chapters?: (c: string) => string; note: (n: string) => string; why: string }> = {
  [`${ROK}#29#recap`]: { chapters: (c) => c.replace('55 (pp.1-18)', '55 (pp.1-18 — only the door / disguise / prophecy beat is re-staged)'), note: (n) => `${n} | NARROWED (the verifier): the anchor's own citation says the anime skips Michel Nostradamus — only the door / disguise / prophecy beat of ch 55 pp.1-18 is re-staged`, why: 'the recap span contradicted its own anchor citation' },
  [`${ROK}#28#recap`]: { chapters: (c) => c.replace('54; plus a clip-show montage of Rounds 1-6', '54'), note: (n) => `${n} | THE MONTAGE (moved out of chapters, a list never prose): plus a clip-show montage of Rounds 1-6`, why: "'…Rounds 1-6' in chapters — a numeric reader takes 1 and 6 as chapters" },
  [`${EYE}#57#divergence`]: { chapters: (c) => c.replace('111-112', '111'), note: (n) => `${n} | chapters narrowed to 111 (the verifier; the ep-53 precedent divergence{109})`, why: 'the divergence sits beside ch 111, not 112' },
  [`${EYE}#57#partial`]: { note: (n) => `weight: significant — ${n}`, why: 'the verifier: the partial notes lack weight' },
  [`${SM}#73#rearranged`]: { chapters: (c) => c.replace('15-18', '15-17'), note: (n) => `${n} | OPTION (b) (Sean 2026-09-07): the restaged acts are 15-17; Act 18 is first-time and in running order, so it is the row's START and END, never part of the reorder`, why: 'under option (b) the reorder is the 15-17 montage only' },
  [`${SM}#76#loose_parallel`]: { note: (n) => `${n} | the fandom's own line (the verifier): "This is a filler episode. None of these events happened in the manga."`, why: 'the line the verdict missed' },
};
// the ONE curated continue of this wave — a page-level fact the walk cannot see (C2 amended 2026-09-07): with ep 55's START at
// 113 (Sean's ruling) ch 112 is no longer a position on any row, and its two page-ranged listings (ep 55 pp.20-24, ep 57
// pp.5-19) leave the walk reading it as open after ep 57; the verifier established ch 112 COMPLETE by pages (images 3-4 are
// non-story), so after ep 57 the reader opens at 115 (113-114 were eps 55-56; 115 is never adapted; ep 58 opens at 116)
const CURATED_CONTINUES: { sid: string; episode: number; chapter: number; kind: 'hole' | 'open' | 'walk' | 'post_series'; note: string }[] = [
  { sid: EYE, episode: 57, chapter: 115, kind: 'walk', note: 'CURATED (C2 amended 2026-09-07 — a page-level fact the walk cannot see; lib/rulings/curated-continues.ts): open the book at ch 115 — ch 112 is COMPLETE by pages across two rows (ep 57 pp.5-19 + ep 55 pp.20-24; images 3-4 non-story — the verifier, page-verified), a fact the walk cannot see once ep 55 starts at 113; ch 113-114 already adapted (eps 55-56); ch 115 never adapted (only its rooftop opening as a flashback in ep 58); the anime skips ahead: ep 58 opens at ch 116' },
];
// rows whose anchor is DELETED (A1: a row retyped filler carries no anchor; the T6 pin lands through the map)
const ANCHOR_DELETE: Record<string, string> = {
  [`${SM}#75`]: "retyped FILLER (the verdict, verified: no Act-19 page is in the row — Pluto's debut is 'adapted properly later' at ep 82; batch 17's anchor 19 [19] was the same facts read as a position) — A1: a filler row never carries an anchor",
};

async function main() {
  const series = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id');
  const mangaOf = new Map(series.map((s) => [s.id, s.manga_anilist_id]));
  const boundsCache = new Map<number, VolumeBound[]>();
  const boundsFor = async (sid: string) => { const m = mangaOf.get(sid); if (!m) return []; if (!boundsCache.has(m)) boundsCache.set(m, await selectAll<VolumeBound>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', m).order('volume'))); return boundsCache.get(m)!; };
  const typeOf = new Map((await selectAll<{ series_id: string; number: number; type: string }>('episodes', 'series_id, number, type')).map((e) => [`${e.series_id}#${e.number}`, e.type]));
  let anns = 0, anchors = 0, overlays = 0, deletes = 0, rejects = 0;
  const touched = new Set<string>();
  const nextStart = async (sid: string, ep: number, delivered: Map<number, number | null>) => {
    if (delivered.has(ep + 1)) return delivered.get(ep + 1) ?? null;
    const { data: nxt } = await db.from('chapter_anchors').select('episode, start_chapter').eq('series_id', sid).gt('episode', ep).order('episode').limit(1).maybeSingle();
    return nxt?.start_chapter ?? null;
  };
  const writeAnchor = async (sid: string, ep: number, end: number, start: number | null, chapters_adapted: string | null, note: string, delivered: Map<number, number | null>, label: string, agentVolume: number | null) => {
    const bd = await boundsFor(sid);
    const derived = volumeForChapter(bd, end);
    const vol = derived ?? agentVolume;
    if (derived == null && agentVolume != null) label += ` (volume: the verdict's v${agentVolume} — no boundary row for ${end})`;
    else if (derived != null && agentVolume != null && derived !== agentVolume) label += ` (volume derived v${derived}: agent said v${agentVolume})`;
    const ns = await nextStart(sid, ep, delivered);
    const normEnd = sliverEnd(chapters_adapted, end, ns);
    const normStart = start != null ? sliverStart(chapters_adapted, start) : null;
    const { data: cur } = await db.from('chapter_anchors').select('chapter, start_chapter, source').eq('series_id', sid).eq('episode', ep).maybeSingle();
    const moved = cur && (Number(cur.chapter) !== end || (cur.start_chapter != null && Number(cur.start_chapter) !== start));
    console.log(`  anchor ep ${ep} → ${start ?? '·'}-${end} v${vol ?? '·'} {${String(chapters_adapted).slice(0, 70)}} manual${cur ? ` (was ${cur.start_chapter ?? '·'}-${cur.chapter} ${cur.source}${moved ? ' — REPAIR' : ''})` : ' (NEW)'}${label}${normEnd.end !== end ? ` (A47 would move ${end} → ${normEnd.end}: '${normEnd.tail}', ${normEnd.pages} pp)` : ''}${normStart && normStart.start !== start ? ` (A10 would move ${start} → ${normStart.start}: '${normStart.lead}', ${normStart.reason})` : ''}`);
    if (normEnd.end !== end) throw new Error(`${sid}#${ep}: A47 moves the END — curate before applying`);
    if (normStart && normStart.start !== start) throw new Error(`${sid}#${ep}: A10 moves the START — curate before applying`);
    const row = { series_id: sid, episode: ep, chapter: end, start_chapter: start, chapters_adapted, volume: vol, source: 'manual', note: note.slice(0, 600) };
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${sid}#${ep}: ${error.message}`); }
    anchors++;
  };

  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    const sid: string = v.series_id; touched.add(sid);
    console.log(`\n== ${f} (${sid})`);
    const named = new Set<number>([...(v.type_corrections ?? []).flatMap((t: { episodes: number[] }) => t.episodes), ...(v.anchors ?? []).map((a: { episode: number }) => Number(a.episode)), ...(v.anchor_hostile ?? []).map((h: { episode: number }) => Number(h.episode))]);
    for (const ep of [...named].sort((a, b) => a - b)) {
      const tc = (v.type_corrections ?? []).find((t: { episodes: number[] }) => t.episodes.includes(ep));
      const stored = typeOf.get(`${sid}#${ep}`);
      console.log(`  baseline ep ${ep} — stored ${stored} → ${tc ? (tc.type === stored ? `${tc.type} (confirmed)` : `${tc.type} (RETYPE — the T6 pin)`) : 'no type claim'}`);
    }
    const effective = new Map<number, { start: number | null; end: number }>();
    for (const a of v.anchors ?? []) { const o = ANCHOR_OVERRIDE[`${sid}#${a.episode}`]; effective.set(Number(a.episode), { start: o?.start ?? (a.start_chapter != null ? Number(a.start_chapter) : null), end: o?.end ?? Number(a.end_chapter) }); }
    const delivered = new Map<number, number | null>([...effective].map(([ep, x]) => [ep, x.start]));
    // deletions first (a retyped row's anchor; A1)
    for (const [key, why] of Object.entries(ANCHOR_DELETE)) {
      const [s2, e2] = key.split('#'); if (s2 !== sid) continue;
      const ep = Number(e2);
      const { data: cur } = await db.from('chapter_anchors').select('chapter, start_chapter, source').eq('series_id', sid).eq('episode', ep).maybeSingle();
      console.log(`  anchor ep ${ep} DELETE${cur ? ` (was ${cur.start_chapter ?? '·'}-${cur.chapter} ${cur.source})` : ' (already absent)'} — ${why.slice(0, 90)}…`);
      if (cur && !DRY) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', ep); if (error) throw new Error(`${key}: ${error.message}`); }
      if (cur) deletes++;
    }
    // annotations (file, with the overlay)
    for (const a of v.annotations ?? []) for (const ep of a.episodes as number[]) {
      const key = `${sid}#${ep}#${a.kind}`;
      if (ANNOTATION_REJECT[key]) { console.log(`  annotation ep ${ep} ${a.kind} REJECTED — ${ANNOTATION_REJECT[key].slice(0, 80)}…`); rejects++; continue; }
      const o = ANNOTATION_OVERRIDE[key];
      let note = a.note ?? ''; let chapters: string | null = a.chapters ?? null;
      if (o) {
        const fixed = o.note(note); if (fixed === note) throw new Error(`overlay ${key}: the note fix did not match — the verdict text changed`); note = fixed;
        if (o.chapters) { const fc = o.chapters(String(chapters)); if (fc === chapters) throw new Error(`overlay ${key}: the chapters fix did not match`); chapters = fc; }
        overlays++;
      }
      console.log(`  annotation ep ${ep} ${a.kind}${chapters ? ` {${String(chapters).slice(0, 50)}…}` : ''}${o ? ` (overlay: ${o.why.slice(0, 60)}…)` : ''}`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters, note: `${note} ${B}`.slice(0, 4000), origin: 'research' });
      anns++;
    }
    // anchors (file, with the overlay); repairs are the same rows written over their stored values (the verdict's repairs[] is the old → new record)
    for (const a of v.anchors ?? []) {
      const ep = Number(a.episode); const key = `${sid}#${ep}`;
      const o = ANCHOR_OVERRIDE[key]; const eff = effective.get(ep)!;
      let chapters: string | null = a.chapters_adapted ?? null;
      let label = o ? ` (overlay: ${o.why.slice(0, 70)}…)` : '';
      const cf = ANCHOR_CHAPTERS_FIX[key];
      if (cf) { const fixed = cf.fix(String(chapters)); if (fixed === chapters) throw new Error(`overlay ${key}: the chapters_adapted fix did not match`); chapters = fixed; label += ` (span fixed: ${cf.why.slice(0, 50)}…)`; overlays++; }
      if (o) overlays++;
      if (ANCHOR_NOTE_APPEND[key]) overlays++;
      const sources: string[] = a.sources ?? [];
      const note = `${a.why ?? a.note ?? ''}${o ? ` | OVERRIDE: ${o.why}` : ''}${ANCHOR_NOTE_APPEND[key] ? ` | ${ANCHOR_NOTE_APPEND[key]}` : ''} [${sources.slice(0, 2).join(' ; ')}] ${B}`;
      await writeAnchor(sid, ep, eff.end, eff.start, chapters, note, delivered, label, a.volume != null ? Number(a.volume) : null);
    }
    for (const h of v.anchor_hostile ?? []) console.log(`  anchor_hostile ep ${h.episode}: ${String(h.why).slice(0, 90)}… — ${typeOf.get(`${sid}#${h.episode}`) === 'canon' && h.episode === 74 ? 'ANCHOR_SUPPRESSED [74] (A44, the map)' : 'a filler row carries no anchor (A1, the T6 pin)'}`);
    for (const c of v.continue_points ?? []) console.log(`  continue ep ${c.episode} → ${c.continue_chapter} (${c.kind}) NOT WRITTEN — C2 (amended 2026-09-07): heal-coverage-continues derives it`);
    for (const c of CURATED_CONTINUES) if (c.sid === sid) {
      console.log(`  continue ep ${c.episode} → ${c.chapter} [${c.kind}] CURATED — a page-level fact the walk cannot see (${c.note.slice(0, 80)}…)`);
      if (!DRY) await writeCuratedContinue(sid, c.episode, { chapter: c.chapter, kind: c.kind, note: `${c.note} ${B}` });
      overlays++;
    }
  }
  if (!DRY) { const { error } = await db.from('series').update({ asterisk_review: 'pending' }).in('id', [...touched]).is('asterisk_review', null); if (error) throw new Error(error.message); }
  console.log(`\n[apply-w1] ${anchors} anchors (repairs included), ${anns} annotations, ${rejects} rejected, ${deletes} anchors deleted, ${overlays} overlay entries${DRY ? ' — DRY RUN' : ''}; then: npm run heal (assert-overrides lands the T6 pins, A44 [74] and the N35 spaces; heal-coverage-continues derives every continue), verify-series-display --all, npm run census`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
