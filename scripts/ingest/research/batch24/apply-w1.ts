// Batch 24 wave 1 — THE TYPING WAVE, APPLY (Sean ruled 2026-09-07 with Cursor: all eleven decisions as recommended,
// the two forks as the verifiers read the rules — WAVE1-RECOVERY.md § THE DECISIONS). File-driven over the four verdict
// JSONs with a curated OVERLAY (P10). The RULINGS land through the maps: the T6 pins (episode-types.ts — a confirmed
// default is a pin, never a no-op), the N35 spaces (chapter-spaces.ts: gits 12, re-zero 45 volumes), T24 live. This
// script lands the research tier: anchors (manual, P8; the volume from the boundary table where one exists, else the
// verdict's; A47 against the TRUE next START through sliverEnd — which now reads the VOLUME vocabulary), the curated
// overrides (re-zero ep 77 END 24 [23]; gits ep 2 START 3 with its lead rewritten), the verifiers' label fixes, the
// gits ep-8 `unverified{9}`, the two Ace C2 continues (C7) — a continue equal to the END is DERIVED and skipped
// (decision 4) — research-origin annotations (same-kind upsert replaces), the 8 note-append-loop dedupes (P5), and
// flag #927's closure. Row 67's title is NOT written here (decision 5: the parser fix + the wiki event run first).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch24/apply-w1.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { volumeForChapter, type VolumeBound } from '../../lib/volumes';
import { sliverEnd, sliverStart } from '../../lib/sliver';
import { dedupeSegments, repeatedSegment } from '../../lib/note-text';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch24/out';
const B = '[batch 24 wave 1 — the typing wave, verified R24, Sean ruled 2026-09-07 with Cursor — WAVE1-RECOVERY.md]';
const FILES = ['re-zero-starting-life-in-another-world-w1a.json', 're-zero-starting-life-in-another-world-w1b.json', 'ghost-in-the-shell-2026-w1.json', 'ace-of-the-diamond-act-ii-w1.json'];
const RZ = 're-zero-starting-life-in-another-world', GITS = 'ghost-in-the-shell-2026', ACE = 'ace-of-the-diamond-act-ii';

// ---- THE OVERLAY (every deviation from a file is a keyed entry with its reason; the dry run prints "(overlay)" beside each)
const ANCHOR_OVERRIDE: Record<string, { end?: number; start?: number; volume?: number; chapters_adapted?: string; why: string }> = {
  [`${RZ}#77`]: { end: 24, volume: 24, why: "decision 3 (the S4 verifier): A47's hold needs a ≤ 5-page or teaser-worded scrap; the closing beat is v24 ch 1's opening scene on three lineages (en-WP's position language 'after respawning, Subaru vows…', the fandom's Volume 24 (Ch 1), the licensor's ep-78 synopsis opening on it — A47's precondition, not size evidence) — the END advances to 24; START 23 and the reader's continue (v24) are unchanged" },
  [`${GITS}#2`]: { start: 3, chapters_adapted: "2 (final 5 pp, pp.45-49 — the disbandment order and the founding of the 攻殻機動隊), 3 (opening — ~pp.50-77; Batou's stakeout through the culprit's discovery)", why: "decision 7 (the FULL verifier): A10's exception is inclusive at five pages and 「ラスト5ページ目前後から」 sits on that line; the walkthrough's page map lists p44・45 and p46・47・49 after the punch with p.44's beat placed in no episode summary — five story pages, scraps → START 3; the lead rewritten so sliverStart agrees (the delivered '~5-6 pp — ~pp.44-49' parsed as six pages); the tail stays visible as partial{2}" },
};
// a chapters_adapted label the verifier corrected (values unchanged) — the fix must MATCH the verdict text or the apply stops
const ANCHOR_CHAPTERS_FIX: Record<string, { fix: (c: string) => string; why: string }> = {
  [`${RZ}#54`]: { why: "verifier w1-rezero-s3 finding 1: the Emilia / Regulus scene is v17's LAST scene (ep 54's stinger) and its continuation is v18's OPENING (ep 55's relocated opener, A12); what leaves v17 ch 5 unfinished at ep 54 is the rooftop / Roy → Julius → Capella-hostage thread", fix: (c) => c.replace('ch 5 unfinished — ep 55 carries its Emilia/Regulus thread', 'ch 5 unfinished — the rooftop / Roy → Julius → Capella-hostage thread continues into ep 55; the Emilia / Regulus stinger is v17\'s closing scene, continued in v18\'s opening') },
};
const ANCHOR_NOTE_APPEND: Record<string, string> = {
  [`${RZ}#54`]: 'verifier w1-rezero-s3: END 17 HELD is the right delivery under A47 / R3 (END 18 [17] has one lineage for, one against, one copy artifact); the thread label corrected — the Emilia / Regulus stinger closes v17 and continues in v18\'s opening (ep 55); the rooftop / Roy → Capella-hostage thread is what leaves ch 5 unfinished',
  [`${RZ}#55`]: 'verifier w1-rezero-s3: the START basis mis-described — the opener (Regulus and Emilia) is v18\'s FIRST scene, a relocated opener (A12); START 17 rests on the rooftop / Roy → Julius → Capella-hostage share; END 18 stands',
  [`${RZ}#73`]: 'verifier w1-rezero-s4: END 22 SOUND — v22\'s printed last section 「迎えた朝」 is the scene en-WP ends on; three wikis say v22 only although the episode borrows v23 ch 1\'s title',
  [`${GITS}#8`]: 'verifier w1-gits item 2: the ch-9 tail is supported in existence (three lineages), not in size — START 9 stands on A10\'s default; landed with unverified{9} (decision 8)',
};
// a source URL the verifier corrected (Ace ep 65: the blog archives cited were ch 261 / 262's, not 259 / 260's)
const SOURCE_FIX: Record<string, (u: string) => string> = {
  [`${ACE}#65`]: (u) => u.replace('mangakansou.xyz/archives/17182', 'mangakansou.xyz/archives/17162').replace('mangakansou.xyz/archives/17208', 'mangakansou.xyz/archives/17164'),
};
const ANNOTATION_OVERRIDE: Record<string, { chapters?: (c: string) => string; note: (n: string) => string; why: string }> = {
  [`${RZ}#54#partial`]: { why: 'the thread label (verifier w1-rezero-s3 finding 1)', chapters: (c) => c.replace('unfinished — its Emilia/Regulus thread continues into ep 55', 'unfinished — the rooftop / Roy → Julius → Capella-hostage thread continues into ep 55; the Emilia / Regulus scene is v17\'s closing stinger, continued in v18\'s opening'), note: (n) => `${n} [verifier w1-rezero-s3: the licensor's 第55話 opening on Regulus and Emilia is v18's FIRST scene (a relocated opener, A12), not the continuation of v17 ch 5 — what leaves ch 5 unfinished at ep 54 is the rooftop / Roy → Julius → Capella-hostage thread; the values are unchanged]` },
  [`${RZ}#71#divergence`]: { why: 'a spliced quote not on the cited page (verifier w1-rezero-s4 finding 2)', note: (n) => n.replace('(「スバルとメィリィの新しい会話シーンが追加されたと見られます」)', '(its hedged sentence on the added scene)') + " [verifier w1-rezero-s4: the quoted sentence was a splice not on lanobare's page; the page's real sentence hedges the same claim — the claim survives]" },
  [`${RZ}#67#partial`]: { why: "the section count (verifier w1-rezero-s4 finding 4)", note: (n) => n.replace('the six sections ep 67 takes', 'the seven headed sections ep 67 takes (after an un-headed lead that is ep 66\'s)') + ' [verifier w1-rezero-s4]' },
  [`${GITS}#2#partial`]: { why: 'decision 7 — START 3, the ch-2 tail is A10 scraps at five pages', chapters: (c) => c.replace('2 (final ~5-6 pp)', '2 (final 5 pp, pp.45-49)'), note: (n) => `${n} [decision 7: START 3 — the ch-2 tail (pp.45-49) is A10 scraps at five pages and stays visible here]` },
};
// the gits ep-8 unverified share (decision 8; T28's unverified-share shape — the census queues it)
const ANNOTATION_ADD: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [
  { sid: GITS, episode: 8, kind: 'unverified', chapters: '9', note: "weight: unsized — the ch-9 closing pages (the case's wrap: Batou pulling Kusanagi's ghost out of the dying Puppet Master; Nakamura arrested; the loose ends) are in the episode on three lineages (the licensor's synopsis, animatetimes' 「人形使いへのダイブから目覚めた素子…」, en-WP's INTERMISSION segment) but no page counts the share — T28's unverified-share shape: the anchor's START 9 stands on A10's default and this row is the census's queue (unverified_share) [decision 8; verifier w1-gits item 2]" },
];
// flag #927 (batch 17's review bookmark on ep 52) — closed: item (1) corroborated, item (2) answered by the S2 rows
const FLAG_927 = "RESOLVED (batch 24 wave 1, 2026-09-07 — Sean's decision 10): (1) the ep-52 graft{189} is CORROBORATED — diamondnoace.fandom's 'Norikane Academy vs. Seidou High' match page (created 2020-04-04, unchanged since 2021) carries anime = Episode 52 for the teaser and the 2026 season opens on that game (ep 53 → 189-197); (2) the MU line 'Vol 30, Chap 259 (S2P1)' is Second Season part 1's endpoint and now has rows to land on — ep 65 → 259 [255] by research (MU is chapter-right and volume-wrong: 259 is vol 29); the finished 52-ep entry is a 65-row entry today (I27, C2).";

async function main() {
  const boundsCache = new Map<number, VolumeBound[]>();
  const series = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id');
  const mangaOf = new Map(series.map((s) => [s.id, s.manga_anilist_id]));
  const boundsFor = async (sid: string) => { const m = mangaOf.get(sid); if (!m) return []; if (!boundsCache.has(m)) boundsCache.set(m, await selectAll<VolumeBound>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', m).order('volume'))); return boundsCache.get(m)!; };
  const typeOf = new Map((await selectAll<{ series_id: string; number: number; type: string }>('episodes', 'series_id, number, type')).map((e) => [`${e.series_id}#${e.number}`, e.type]));
  let anns = 0, anchors = 0, conts = 0, skippedConts = 0, overlays = 0;
  const touched = new Set<string>();
  const nextStart = async (sid: string, ep: number, delivered: Map<number, number | null>) => {
    if (delivered.has(ep + 1)) return delivered.get(ep + 1) ?? null;
    const { data: nxt } = await db.from('chapter_anchors').select('episode, start_chapter').eq('series_id', sid).gt('episode', ep).order('episode').limit(1).maybeSingle();
    return nxt?.start_chapter ?? null;
  };
  const writeAnchor = async (sid: string, ep: number, end: number, start: number | null, chapters_adapted: string | null, note: string, delivered: Map<number, number | null>, label: string, agentVolume: number | null = null) => {
    const bd = await boundsFor(sid);
    // the boundary table is the derivation; a series with NO boundary rows (all three here: 31023 and 86569 have none, re-zero has no manga)
    // falls back to the verdict's sourced volume and says so; on a VOLUME-space series the volume IS the END (T24)
    const derived = volumeForChapter(bd, end);
    const vol = derived ?? agentVolume;
    if (derived == null && agentVolume != null) label += ` (volume: the verdict's v${agentVolume} — no boundary row for ${end})`;
    else if (derived != null && agentVolume != null && derived !== agentVolume) label += ` (volume derived: agent said v${agentVolume})`;
    const ns = await nextStart(sid, ep, delivered);
    const normEnd = sliverEnd(chapters_adapted, end, ns);
    const normStart = start != null ? sliverStart(chapters_adapted, start) : null;
    const { data: cur } = await db.from('chapter_anchors').select('chapter, start_chapter, source').eq('series_id', sid).eq('episode', ep).maybeSingle();
    console.log(`  anchor ep ${ep} → ${start ?? '·'}-${end} v${vol ?? '·'} {${String(chapters_adapted).slice(0, 70)}} manual${cur ? ` (was ${cur.start_chapter ?? '·'}-${cur.chapter} ${cur.source})` : ' (NEW)'}${label}${normEnd.end !== end ? ` (A47 would move ${end} → ${normEnd.end}: '${normEnd.tail}', ${normEnd.pages} pp)` : ''}${normStart && normStart.start !== start ? ` (A10 would move START ${start} → ${normStart.start}: '${normStart.lead.slice(0, 40)}', ${normStart.reason})` : ''}`);
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
    const named = new Set<number>([...(v.type_corrections ?? []).flatMap((t: { episodes: number[] }) => t.episodes), ...(v.annotations ?? []).flatMap((a: { episodes: number[] }) => a.episodes), ...(v.anchors ?? []).map((a: { episode: number }) => Number(a.episode))]);
    for (const ep of [...named].sort((a, b) => a - b)) { const tc = (v.type_corrections ?? []).find((t: { episodes: number[] }) => t.episodes.includes(ep)); const stored = typeOf.get(`${sid}#${ep}`); console.log(`  baseline ep ${ep} — stored ${stored} → ${tc ? (tc.type === stored ? `${tc.type} (confirmed — the T6 pin)` : tc.type) : 'no type change'}`); }
    // the effective START / END per row (the overlay applied) — A47 / A10 and the continue rule read these
    const effective = new Map<number, { start: number | null; end: number }>();
    for (const a of v.anchors ?? []) { const o = ANCHOR_OVERRIDE[`${sid}#${a.episode}`]; effective.set(Number(a.episode), { start: o?.start ?? (a.start_chapter != null ? Number(a.start_chapter) : null), end: o?.end ?? Number(a.end_chapter) }); }
    const delivered = new Map<number, number | null>([...effective].map(([ep, x]) => [ep, x.start]));
    // annotations (file, with the overlay)
    for (const a of v.annotations ?? []) for (const ep of a.episodes as number[]) {
      const key = `${sid}#${ep}#${a.kind}`;
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
    for (const a of ANNOTATION_ADD) if (a.sid === sid) {
      console.log(`  annotation ep ${a.episode} ${a.kind} {${a.chapters}} (curated add)`); overlays++;
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} ${B}`.slice(0, 4000), origin: 'research' });
      anns++;
    }
    // anchors (file, with the overlay)
    for (const a of v.anchors ?? []) {
      const ep = Number(a.episode); const key = `${sid}#${ep}`;
      const o = ANCHOR_OVERRIDE[key]; const eff = effective.get(ep)!;
      let chapters: string | null = o?.chapters_adapted ?? a.chapters_adapted ?? null;
      let label = o ? ` (overlay: ${o.why.slice(0, 70)}…)` : '';
      const cf = ANCHOR_CHAPTERS_FIX[key];
      if (cf) { const fixed = cf.fix(String(chapters)); if (fixed === chapters) throw new Error(`overlay ${key}: the chapters_adapted fix did not match`); chapters = fixed; label += ` (label fixed: ${cf.why.slice(0, 50)}…)`; overlays++; }
      if (o) overlays++;
      const sources: string[] = (a.sources ?? []).map((u: string) => (SOURCE_FIX[key] ? SOURCE_FIX[key](u) : u));
      if (SOURCE_FIX[key]) { label += ' (sources fixed: the ch 259 / 260 archives)'; overlays++; }
      const note = `${a.why ?? a.note ?? ''}${o ? ` | OVERRIDE: ${o.why}` : ''}${ANCHOR_NOTE_APPEND[key] ? ` | ${ANCHOR_NOTE_APPEND[key]}` : ''} [${sources.slice(0, 2).join(' ; ')}] ${B}`;
      await writeAnchor(sid, ep, eff.end, eff.start, chapters, note, delivered, label, o?.volume ?? (a.volume != null ? Number(a.volume) : null)); // T24: volume = END on a volume-space row — the override carries it with the END
    }
    // continues (file) — decision 4: a continue equal to the row's END is DERIVED, never stored
    for (const c of v.continue_points ?? []) {
      const ep = Number(c.episode); const eff = effective.get(ep);
      if (eff && Number(c.continue_chapter) === eff.end) { skippedConts++; console.log(`  continue ep ${ep} → ${c.continue_chapter} SKIPPED — equals the END (derived, never stored; decision 4)`); continue; }
      console.log(`  continue ep ${ep} → ${c.continue_chapter} (${c.kind})`);
      if (!DRY) await writeCuratedContinue(sid, ep, { chapter: Number(c.continue_chapter), kind: c.kind, note: `${c.why ?? c.note ?? ''} ${B}`.slice(0, 1200) });
      conts++;
    }
  }
  // the note-append loop (P5): batch 17's re-runs appended their REPAIR sentence on every pass — dedupe the manual rows, list any other tier
  const loops = (await selectAll<{ series_id: string; episode: number; note: string | null; source: string }>('chapter_anchors', 'series_id, episode, note, source')).filter((r) => repeatedSegment(r.note));
  let deduped = 0;
  for (const r of loops) {
    if (r.source !== 'manual') { console.log(`  note loop ${r.series_id} ep ${r.episode} on a ${r.source}-tier row — LISTED, not touched (P8)`); continue; }
    const fixed = dedupeSegments(r.note);
    console.log(`  note dedupe ${r.series_id} ep ${r.episode}: ${String(r.note).length} → ${fixed.length} chars ('${repeatedSegment(r.note)!.slice(0, 40)}…' repeated)`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').update({ note: fixed }).eq('series_id', r.series_id).eq('episode', r.episode); if (error) throw new Error(`${r.series_id}#${r.episode}: ${error.message}`); }
    deduped++;
  }
  // flag #927
  const { data: flag } = await db.from('ingest_flags').select('id, status, detail').eq('id', 927).maybeSingle();
  if (flag && flag.status === 'open') {
    console.log(`  flag #927 → dismissed with its resolution (${FLAG_927.slice(0, 80)}…)`);
    if (!DRY) { const { error } = await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString(), detail: { ...(flag.detail as object), resolution: FLAG_927 } }).eq('id', 927); if (error) throw new Error(`flag 927: ${error.message}`); }
  } else console.log(`  flag #927 already ${flag?.status ?? 'missing'}`);
  if (!DRY) { const { error } = await db.from('series').update({ asterisk_review: 'pending' }).in('id', [...touched]).is('asterisk_review', null); if (error) throw new Error(error.message); }
  console.log(`\n[apply-w1] ${anchors} anchors, ${anns} annotations, ${conts} continues stored (${skippedConts} skipped as derived), ${overlays} overlay entries, ${deduped} notes deduped${DRY ? ' — DRY RUN' : ''}; the T6 pins, the N35 spaces and T24 land through the maps (assert-overrides on the heal); row 67's title through the parser fix + the wiki event run`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
