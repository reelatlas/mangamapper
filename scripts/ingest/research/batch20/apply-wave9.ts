// Batch 20 wave 9 — the curated apply (P10). Sean ruled 2026-09-02
// (WAVE9-RECOVERY §THE DECISIONS; "everything else is good", the erased
// ep-12 type reconsidered → the T6 map entry is the ruling record): the nine
// verdicts fold as delivered with the verifier corrections riding as
// overlays — every anchor at the MANUAL tier (P8), ENDs normalized through
// sliverEnd (A47), continues via writeCuratedContinue (C7), annotations via
// upsertAnnotation. Overlays: erased's ep-12 mu anchor DELETED (A1, the studio
// ending) and its continue MOVED to ep 11 (the wave-6 trap: a continue on a
// deleted row lands nothing); code-black's ep-8 frontier anchor ADDED from
// the verdict's map (G56: the honest frontier is ch 17 at ep 8, not the
// finale) and its ch-11 tail re-worded (verifier correction A); erased's
// partial{44} ADDED (the sole-adaptation tie, T28) and its ja-WP citation
// softened; six flags dismissed with their answers. Types (T6), dates (G53)
// and chapter spaces (N35) are MAP entries asserted by the healers.
// Idempotent; --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave9.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';
import { sliverEnd } from '../../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const B = 'batch 20 wave 9 (2026-09-02; Sean ruled)';
const FILES: [string, string][] = [
  ['the-seven-deadly-sins-four-knights-of-the-apocalypse.json', 'the-seven-deadly-sins-four-knights-of-the-apocalypse'],
  ['don-t-toy-with-me-miss-nagatoro.json', 'don-t-toy-with-me-miss-nagatoro'],
  ['tsugumomo.json', 'tsugumomo'],
  ['cells-at-work-code-black.json', 'cells-at-work-code-black'],
  ['gangsta.json', 'gangsta'],
  ['magi-adventure-of-sinbad.json', 'magi-adventure-of-sinbad'],
  ['girls-last-tour.json', 'girls-last-tour'],
  ['erased.json', 'erased'],
];
const ANCHOR_DROP = new Set(['erased#12']); // A1: the studio ending; the mu pin sat on the wrong row (the chapter is reached in ep 11)
const CONTINUE_MOVE: Record<string, number> = { 'erased#12': 11 }; // the continue lands on the surviving terminal row (C1 IN 35)
const ANCHOR_ADD: { sid: string; episode: number; chapter: number; start: number; chapters_adapted: string; volume: number; note: string; sources: string[] }[] = [
  { sid: 'cells-at-work-code-black', episode: 1, chapter: 1, start: 1, chapters_adapted: '出張版 (the unnumbered prequel extra), 1', volume: 1, note: "ep 1 = ch 1 + the 出張版 prequel (unnumbered tankōbon extra — side_story); the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 2, chapter: 2, start: 2, chapters_adapted: '2 (+ 出張版後編 per the fandom)', volume: 1, note: "ep 2 = ch 2 (+ the 出張版's second half); the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 3, chapter: 3, start: 3, chapters_adapted: '3', volume: 1, note: "ep 3 = ch 3; the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 4, chapter: 4, start: 4, chapters_adapted: '4', volume: 1, note: "ep 4 = ch 4; the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 5, chapter: 5, start: 5, chapters_adapted: '5', volume: 1, note: "ep 5 = ch 5; the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 6, chapter: 14, start: 13, chapters_adapted: '13, 14', volume: 3, note: "ep 6 = ch 13 + 14 (the anime pulls part two's opening chapters into the first body); the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 7, chapter: 15, start: 15, chapters_adapted: '15, 12 (a back-reach — rearranged)', volume: 3, note: "ep 7 = ch 15 + 12 (ch 12 played after 14 — a back-reach, END stays 15 in running order, A4); the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 9, chapter: 6, start: 6, chapters_adapted: '6', volume: 2, note: "ep 9 = ch 6 — the run returns to part one after eps 6-8 (a settled reorder zone 9-13 = ch 6-10, A42 rearranged); the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 10, chapter: 7, start: 7, chapters_adapted: '7', volume: 2, note: "ep 10 = ch 7 (AC1677's death); the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 11, chapter: 8, start: 8, chapters_adapted: '8', volume: 2, note: "ep 11 = ch 8; the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 12, chapter: 9, start: 9, chapters_adapted: '9', volume: 2, note: "ep 12 = ch 9; the verified 13-row map (ja-WP's adaptation-structure paragraph + the fandom's per-episode Manga Adaptation column agree row for row; verifier 13/13). Landed as a ZONE because the display interpolates a row-less entry between anchors and a lone frontier rendered a false back-jump (P5; the 2026-09-02 apply). Row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_(Anime)', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'] },
  { sid: 'cells-at-work-code-black', episode: 8, chapter: 17, start: 16, chapters_adapted: '16, 17', volume: 3, note: "G56: the series' furthest first-time coverage is ch 17, reached in ep 8, not the finale — ep 8's title takes 肺血栓 and 機転 from ch 17 肺血栓、機転、再会 and ja-WP footnotes the thrombus deaths 原作第17話に基づく; the fandom's episode field lists 16 + 17. Delivered from the wave-9 verdict's per-episode map (verified 13/13); the row does not exist yet (A42).", sources: ['https://ja.wikipedia.org/wiki/はたらく細胞BLACK', 'https://hataraku-saibou.fandom.com/wiki/Cells_at_Work!_CODE_BLACK_Episode_8'] },
];
const ANCHOR_NOTE_OVERRIDE: Record<string, { chapters_adapted?: string; note: string }> = {
  'cells-at-work-code-black#13': { chapters_adapted: '10; 11 (the syringe-and-waking beat only — ch 11 runs on past it, unadapted)', note: "ep 13 = ch 10 心筋梗塞、蘇生、変化 verbatim + a post-credits tail from ch 11 (ja-WP 原作第11話): the syringe and the waking in the second body ONLY — ch 11 continues into the second body's cast and the 顆粒球輸血 reveal, none animated (verifier correction A). A47's finale clause: the tail stands, END 11, C1 IN 11." },
};
const CONTINUE_NOTE_OVERRIDE: Record<string, string> = {
  'cells-at-work-code-black#13': "C1: the finale ends INSIDE ch 11 — only its syringe-and-waking beat is animated; read ch 11 whole, then SKIP ch 12-17 (C3: eps 6-8 played 13+14 / 15+12 / 16+17 out of order, relocated into the first body), then ch 18-48 were never adapted.",
};
const NOTE_OVERRIDE: Record<string, string> = {
  'erased#12#divergence': "The whole finale is the studio's own realization of an ending the author described but did not draw for it (ja-WP's own sentence 「第十一話の途中から」 marks the departure; the cited 三部けい × 伊藤智彦 interview says 着地点は同じ / 尺がない / 新しいシチュエーション without an episode number — the mid-ep-11 cut-over is proven by the synopsis-vs-ch-35 comparison). Setting, mechanism and timeframe all differ from ch 36-44 (the rooftop and a sabotaged IV in 2010 vs the camping trap, the burning bridge and 2012.01).",
  'erased#12#loose_parallel': "Mandatory tie (T28). The finale restages, without adapting, the beats the manga carries in ch 42-44: Yashiro using Kumi as bait (ch 42: lured and drugged, not a sabotaged IV), Yashiro's admission that Satoru is what makes him feel alive, and the reunion under the overpass — whose final line 「一緒に雪やどりしてもいいですか？」 is ch 44's verbatim (see the partial{44}).",
};
const ANNOTATION_ADD: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [
  { sid: 'cells-at-work-code-black', episode: 1, kind: 'side_story', chapters: '出張版 (prequel)', note: 'The unnumbered 出張版 tankōbon extra (collected in vols 4/5) opens the anime — part of the SOURCE with no mainline number (the GTO/Toroko rule); position rests on ch 1. {wave 9 map}' },
  { sid: 'cells-at-work-code-black', episode: 2, kind: 'side_story', chapters: '出張版後編', note: 'The 出張版 extra\'s second half per the fandom; position rests on ch 2. {wave 9 map}' },
  { sid: 'cells-at-work-code-black', episode: 7, kind: 'rearranged', chapters: '12', note: 'Ch 12 is played after ch 13-15 (eps 6-7 pull part two\'s chapters into the first body in the order 13, 14, 15, 12); the END stays 15 in running order (A4). {wave 9 map}' },
  { sid: 'cells-at-work-code-black', episode: 8, kind: 'graft', chapters: '6 (the fatty-liver scene)', note: 'ja-WP: 原作第6話の脂肪肝の場面がアニメ版第8話に取り込まれている — one scene of ch 6 grafted into ep 8; ch 6 proper is ep 9. {wave 9 map}' },
  { sid: 'cells-at-work-code-black', episode: 9, kind: 'rearranged', chapters: '6-10 (the zone, eps 9-13)', note: 'A42 settled reorder: after eps 6-8 played ch 12-17 in the first body, eps 9-13 return to part one\'s ch 6-10 (ja-WP: アニメ版第9話からは原作第6話以降の各話に基づく); the frontier stays ch 17 at ep 8 (G56). {wave 9 map}' },
  { sid: 'erased', episode: 12, kind: 'partial', chapters: '44 (the closing scene)', note: "T28 sole-adaptation exception (Sean 2026-09-02): the anime's closing scene is ch 44's arc close — the final line 「一緒に雪やどりしてもいいですか？」 verbatim, the same 高架下 in the same snow (the 相合傘 footprints / Sachiko's umbrella / the Re:Re: mail / 2012.01 are the manga's alone) — adapted in no other episode; the row is mixed on this tie and stays A44 position-less (a far-forward beat is never an END; the continue is 35 on ep 11)." },
];
const FLAGS_DISMISS: [number, string][] = [
  [729, 'four-knights: MU\'s 120 is the S2 segment; the S1 pin 77 confirmed (wave 9).'],
  [664, 'gangsta: MU and AniList now agree the manga is publishing — it resumed in Comic Bunch Kai 2026-07-03 (wave 9).'],
  [675, 'erased: MU latest_chapter 29 is the release-record field; the space is 44 + 5 Re chapters = 49 (wave 9, verified).'],
  [782, 'girls-last-tour: G55 namesake contamination — "List of Girls episodes" is HBO\'s Girls (wave 9).'],
  [823, 'girls-last-tour: the same HBO namesake page bleeding titles (wave 9).'],
  [786, 'cells-at-work-code-black: G55 namesake contamination — "List of Orphan Black episodes" (wave 9, verified).'],
];

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let anchors = 0, normalized = 0, continues = 0, annos = 0, dropped = 0;
  for (const [f, sid] of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    if (v.series_id !== sid) throw new Error(`${f}: ${v.series_id}`);
    const sorted = [...(v.anchors ?? [])].sort((x: any, y: any) => Number(x.episode) - Number(y.episode));
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      if (ANCHOR_DROP.has(`${sid}#${a.episode}`)) continue;
      const next = sorted[i + 1];
      const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : null;
      const o = ANCHOR_NOTE_OVERRIDE[`${sid}#${a.episode}`];
      const ca = o?.chapters_adapted ?? a.chapters_adapted ?? null;
      const verdict = sliverEnd(ca, Number(a.end_chapter), nextStart);
      const moved = verdict.end !== Number(a.end_chapter);
      if (moved) normalized++;
      const row = { series_id: sid, episode: Number(a.episode), chapter: verdict.end, start_chapter: a.start_chapter != null ? Number(a.start_chapter) : null, chapters_adapted: ca, volume: a.volume != null ? Number(a.volume) : null, source: 'manual', note: `${moved ? `A47: END normalized ${a.end_chapter} → ${verdict.end}. ` : ''}${o?.note ?? a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
      console.log(`  anchor ${sid} ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter}${row.volume ? ` v${row.volume}` : ''}${moved ? ` (A47 normalized from ${a.end_chapter})` : ''}${o ? ' (overlay: verifier note)' : ''}`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`); }
      anchors++;
    }
    for (const c of v.continue_points ?? []) {
      const ep = CONTINUE_MOVE[`${sid}#${c.episode}`] ?? Number(c.episode);
      const note = CONTINUE_NOTE_OVERRIDE[`${sid}#${c.episode}`] ?? c.note ?? c.why ?? '';
      console.log(`  continue ${sid} ep ${ep} → ${c.continue_chapter} (${c.kind})${ep !== Number(c.episode) ? ` (overlay: moved from ep ${c.episode})` : ''}`);
      if (!DRY) await writeCuratedContinue(sid, ep, { chapter: Number(c.continue_chapter), kind: c.kind, note: `${note} ${B}` });
      continues++;
    }
    for (const a of v.annotations ?? []) {
      for (const ep of a.episodes as number[]) {
        const note = NOTE_OVERRIDE[`${sid}#${ep}#${a.kind}`] ?? a.note;
        console.log(`  annotation ${sid} ep ${ep} ${a.kind}${a.chapters ? `{${String(a.chapters).slice(0, 30)}}` : ''}${NOTE_OVERRIDE[`${sid}#${ep}#${a.kind}`] ? ' (overlay: verifier note)' : ''}`);
        if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters: a.chapters ?? null, note: `${note} [${B}]`.slice(0, 1200), origin: 'research' });
        annos++;
      }
    }
  }
  for (const a of ANCHOR_ADD) {
    console.log(`  anchor ${a.sid} ep ${a.episode} → ${a.start}-${a.chapter} v${a.volume} (overlay: G56 frontier)`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert({ series_id: a.sid, episode: a.episode, chapter: a.chapter, start_chapter: a.start, chapters_adapted: a.chapters_adapted, volume: a.volume, source: 'manual', note: `${a.note} [${a.sources.join(' ; ')}] ${B}`.slice(0, 600) }, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${a.sid} ep${a.episode}: ${error.message}`); }
    anchors++;
  }
  for (const a of ANNOTATION_ADD) {
    console.log(`  annotation ${a.sid} ep ${a.episode} ${a.kind}{${a.chapters}} (overlay: T28)`);
    if (!DRY) await upsertAnnotation({ series_id: a.sid, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} [${B}]`, origin: 'research' });
    annos++;
  }
  for (const key of ANCHOR_DROP) {
    const [sid, ep] = key.split('#');
    console.log(`  DELETE anchor ${sid} ep ${ep} (A1)`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', Number(ep)); if (error) throw new Error(`${key}: ${error.message}`); }
    dropped++;
  }
  for (const [id, why] of FLAGS_DISMISS) {
    console.log(`  dismiss flag #${id}: ${why.slice(0, 70)}…`);
    if (!DRY) { const { error } = await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString() }).eq('id', id).eq('status', 'open'); if (error) throw new Error(`flag #${id}: ${error.message}`); }
  }
  console.log(`[apply-wave9] ${anchors} anchors (${normalized} A47-normalized), ${dropped} deleted, ${continues} continues, ${annos} annotations, ${FLAGS_DISMISS.length} flags dismissed${DRY ? ' — DRY RUN' : ''}. Types (T6) + dates (G53) + spaces (N35): assert-overrides in the heal roster, then census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annos + dropped, flagged: 0 }, `apply-wave9: ${anchors} anchors, ${dropped} deleted, ${continues} continues, ${annos} annotations`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
