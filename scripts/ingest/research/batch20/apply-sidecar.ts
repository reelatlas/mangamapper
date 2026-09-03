// Batch 20 SIDECAR apply (Sean ruled 2026-09-04 — T28's sliver clause + the
// standing list): reborn (the phantom ties + the recap rows + the ch-257
// fence), d-gray-man 66 (the sliver clause's first witness), tsugumomo 8
// (anchor 19 + the unnumbered extra as side_story), the Ranking of Kings
// scopes (part one / part two at 155 / 156, the Naruto shape) with the ep-23
// handoff note. Types are T6 MAP entries asserted by the healer; anchors on
// filler rows are deleted here (A1); annotations through upsertAnnotation /
// deleteAnnotation; continues through writeCuratedContinue (C7). Idempotent;
// --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-sidecar.ts [--dry-run]
import { db, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';

const DRY = process.argv.includes('--dry-run');
const B = 'batch 20 sidecar (2026-09-04; Sean ruled)';
const V_REBORN = 'out/reborn-slivers.json + verify/reborn-slivers.md';

type Del = { sid: string; episode: number; why: string };
const ANCHOR_DELETE: Del[] = [
  { sid: 'reborn', episode: 159, why: 'no ch-232 segment exists (the baseball episode is original end to end; ch 232 is in eps 158 / 160) — filler (T6), A1' },
  { sid: 'reborn', episode: 177, why: 'a wholesale recap of the Choice arc on every source — the recap clause: weightless, filler (T6), no anchor; its 256 also sat below ep 176\'s corrected 257' },
  { sid: 'reborn', episode: 178, why: 'no ch-257 segment exists (the frame is Irie\'s device, anime-original; ch 257 opens in ep 176 and closes in ep 190) — filler (T6), A1' },
  { sid: 'reborn', episode: 189, why: 'no ch-257 segment exists (the frame is the anime\'s Lal Mirch device from ep 177; ch 257\'s cast has no Lal Mirch) — filler (T6), A1' },
  { sid: 'd-gray-man', episode: 66, why: 'T28\'s sliver clause (first witness): one page of ch 78 inside an original training episode carries no weight — filler (T6), no position of its own (A44); ep 65 ends inside 78, ep 67 adapts it properly' },
];
const ANNOTATION_DELETE: { sid: string; episode: number; kind: AnnotationKind; why: string }[] = [
  { sid: 'reborn', episode: 159, kind: 'partial', why: 'the sliver never existed' },
  { sid: 'reborn', episode: 178, kind: 'partial', why: 'the sliver never existed' },
  { sid: 'reborn', episode: 189, kind: 'partial', why: 'the sliver never existed' },
  { sid: 'reborn', episode: 177, kind: 'abridged', why: 'replaced by recap{240-256} — abridged means a condensed adaptation, this row is a recap' },
  { sid: 'reborn', episode: 189, kind: 'abridged', why: 'replaced by recap{256-257}' },
  ...[178, 179, 188, 189].map((episode) => ({ sid: 'reborn', episode, kind: 'side_story' as AnnotationKind, why: 'an anime-original arc is filler rows, not a side story of the source; the "257 bookends" were phantom' })),
];
const ANNOTATION_UPSERT: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [
  { sid: 'reborn', episode: 158, kind: 'graft', chapters: '232 (the Chrome / I-Pin baozi scene)', note: 'weight: sliver — one scene of ch 232 inside an otherwise original episode (three sources place the scene here); ch 232 is adapted properly by ep 160 (Choice rules, the Airbike reveal). Filler stands; the scene is noted, never weighed (T28). [' + V_REBORN + ']' },
  { sid: 'reborn', episode: 176, kind: 'partial', chapters: '254, 255, 256, 257 (opening block)', note: 'Ep 176 runs past ch 256 into ch 257\'s opening block (the shrine arrival, Shoichi\'s order, Gokudera\'s Flame Missile, Byakuran recalling the system, Hibari peeling off, the group reaching the base) and stops there — END 256 → 257 (verified medium: two content witnesses + TV Tokyo 190\'s tell; the fandom Choice_Arc box 240-257 / 154-177). Ch 257\'s closing block is ep 190\'s. [' + V_REBORN + ']' },
  { sid: 'reborn', episode: 177, kind: 'recap', chapters: '240-256 (the Choice arc, retold to Lal Mirch)', note: 'THE RECAP CLAUSE (T28): a wholesale recap on every source (TV Tokyo, fandom, ja-WP) — weightless; nothing else in the row → filler, no anchor. Its "return to Namimori" is ep 176\'s pages retold. The first row to carry the `recap` kind (2026-09-04). [' + V_REBORN + ']' },
  { sid: 'reborn', episode: 189, kind: 'recap', chapters: '256-257 (retold inside the anime\'s Lal Mirch frame)', note: 'THE RECAP CLAUSE (T28): the arc\'s closing episode retells 256-257 around an anime-original frame (the Lal Mirch emergency-room device from ep 177); no new ch-257 material — the fandom\'s "257 (mostly filler)" restated animefillerlist\'s typing. Ch 257 is adapted properly by eps 176 (opening) and 190 (closing). [' + V_REBORN + ']' },
  { sid: 'reborn', episode: 190, kind: 'partial', chapters: '257 (closing block), 258', note: 'Ep 190 adapts the remainder of ch 257 (Squalo\'s call to Lussuria, the system\'s return and crash, six lights, the wall, Zakuro) and ch 258; ch 257\'s opening block is ep 176\'s. [' + V_REBORN + ']' },
  { sid: 'd-gray-man', episode: 66, kind: 'partial', chapters: '78 (approx. p13 only)', note: 'weight: sliver — ep 66 is built out of roughly one page of ch 78 (batch 17, agent-verified; both wiki families); ep 65 ends inside 78 and ep 67 adapts ch 78 properly. T28\'s sliver clause (Sean 2026-09-04): canon material with no weight — no anchor, the remainder decides (filler); noted here so the tie stays visible. [scripts/ingest/research/batch17/out/d-gray-man.json]' },
  { sid: 'tsugumomo', episode: 8, kind: 'side_story', chapters: 'the unnumbered extra 「コミックハイ！出張版 モテモテフレグランス」 (printed in vol 5 between ch 29 and ch 30)', note: 'Ep 8\'s second segment adapts the unnumbered extra (a side story serialized inside the source, printed as bonus matter in vol 5) — noted, never numbered (N35 / the Dai 61 convention); its first segment adapts ch 19 (the anchor). [scripts/ingest/research/batch20/out/tsugumomo.json (wave 9, structure.notes + flags_for_sean)]' },
  { sid: 'ranking-of-kings', episode: 23, kind: 'divergence', chapters: '150-155', note: 'The finale has an original epilogue expansion. HANDOFF: the manga\'s part one ends here (vol 12 / ch 155 — ja-WP 「第一部（1巻1話〜12巻155話）」); part two (vol 13 / ch 156 →) is adapted by Ranking of Kings: The Treasure Chest of Courage, whose finale (ep 10) covers 156-161 and continues at 162 (C5 from a proven END — the earlier "post-TCoC continue = 165" was a single uncited research note). [scripts/ingest/research/batch20/out/ranking-of-kings-the-treasure-chest-of-courage-scope.json]' },
  { sid: 'ranking-of-kings-the-treasure-chest-of-courage', episode: 9, kind: 'side_story', chapters: 'vol 11 描き下ろし bonus chapter (MangaDex 141.5) — Miranjo and the demon\'s first meeting', note: 'The publisher\'s own vol-11 e-book copy: 「ミランジョと魔神の出会いを描く単行本描き下ろしエピソードも収録!!」 — ep 9A 「ミランジョと魔神」 adapts it (closes the wave-8 open item). Unnumbered → noted, never numbered. [scripts/ingest/research/batch20/out/ranking-of-kings-the-treasure-chest-of-courage-scope.json]' },
  { sid: 'ranking-of-kings-the-treasure-chest-of-courage', episode: 1, kind: 'side_story', chapters: 'the extra printed at the back of vol 8 (MangaDex 104.5) — a 読切番外篇 first published in 月刊コミックビーム 2019年7月号', note: 'Wording refinement (the publisher\'s vol-8 copy): the vol-8 extra is a 読切番外篇 from Comic Beam 2019/7, not a 描き下ろし. Unnumbered → noted, never numbered. [scripts/ingest/research/batch20/out/ranking-of-kings-the-treasure-chest-of-courage-scope.json]' },
];
// tsugumomo ep 8 — the S1 map (wave 9: the fandom's straddle-aware chapters field corroborated by the wiki's arc table and matching titles; the verdict trusts it at page grain)
const ANCHOR_UPSERT = [
  { sid: 'tsugumomo', episode: 8, chapter: 19, start_chapter: 19, chapters_adapted: '19; + the unnumbered vol-5 extra (side_story)', note: 'Ep 8 = ch 19 (the first segment; the real 8/9 reorder: ep 9 = ch 16-18) + the unnumbered extra モテモテフレグランス (side_story). Sean ruled 2026-09-04: not A44 — a numbered chapter is adapted, so the row has a position. [scripts/ingest/research/batch20/out/tsugumomo.json wave 9, structure.notes: the S1 per-episode map]' },
];
const CONTINUE_UPSERT: { sid: string; episode: number; chapter: number; kind: 'parity' | 'post_series'; note: string }[] = [
  { sid: 'reborn', episode: 176, chapter: 257, kind: 'parity', note: 'C1: ep 176 ends inside ch 257\'s opening block; ch 257 resumes properly at ep 190 (eps 177-189 are a recap + the anime-original Primo arc). ' + B },
  { sid: 'tsugumomo', episode: 8, chapter: 20, kind: 'parity', note: 'C2: ep 8 completes ch 19; ep 9 back-jumps to 16-18 (rearranged) and ep 10 resumes at 20 — resume at 20, ch 16-18 are ep 9\'s. ' + B },
];
const SCOPES = [
  { series_id: 'ranking-of-kings', afl_slug: 'ranking-of-kings', start_volume: null, start_chapter: null, end_volume: 12, end_chapter: 155, note: 'Part one (vol 1 / ch 1 → vol 12 / ch 155 — ja-WP 「原作の第一部（1巻1話〜12巻155話）が映像化された」; KADOKAWA vol 13 「第二部開幕!!」); part two continues in the-treasure-chest-of-courage (the Naruto → Shippuden shape). Sean ruled 2026-09-04.' },
  { series_id: 'ranking-of-kings-the-treasure-chest-of-courage', afl_slug: null, start_volume: 13, start_chapter: 156, end_volume: null, end_chapter: null, note: 'Part two from vol 13 / ch 156 (its finale ep 10 = 156-161; the ch 162 → tail belongs here as the family\'s last covering entry); eps 1-9 are extras + originals owning no range. Sean ruled 2026-09-04.' },
];

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let n = 0;
  for (const d of ANCHOR_DELETE) {
    const { data: cur } = await db.from('chapter_anchors').select('chapter, source').eq('series_id', d.sid).eq('episode', d.episode).maybeSingle();
    console.log(`  DELETE anchor ${d.sid} ep ${d.episode}${cur ? ` (was ${cur.chapter}, ${cur.source})` : ' (already absent)'} — ${d.why.slice(0, 90)}`);
    if (!DRY && cur) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', d.sid).eq('episode', d.episode); if (error) throw new Error(error.message); }
    n++;
  }
  // reborn 176: END 256 → 257 (the fence repair, verified medium; volume 27 unchanged — v27 = 249-258)
  {
    console.log('  REPAIR reborn ep 176: END 256 → 257 [254] (ch 257\'s opening block)');
    if (!DRY) { const { error } = await db.from('chapter_anchors').update({ chapter: 257, chapters_adapted: '254, 255, 256, 257 (opening block)', source: 'manual', note: `Ch 257's opening block ends the episode (verified R24, medium: two content witnesses + TV Tokyo 190's tell); the closing block is ep 190's. ${B} [${V_REBORN}]` }).eq('series_id', 'reborn').eq('episode', 176); if (error) throw new Error(error.message); }
    n++;
  }
  for (const a of ANCHOR_UPSERT) {
    console.log(`  anchor ${a.sid} ep ${a.episode} → ${a.start_chapter}-${a.chapter}`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert({ series_id: a.sid, episode: a.episode, chapter: a.chapter, start_chapter: a.start_chapter, chapters_adapted: a.chapters_adapted, source: 'manual', note: `${a.note} ${B}` }, { onConflict: 'series_id,episode' }); if (error) throw new Error(error.message); }
    n++;
  }
  for (const c of CONTINUE_UPSERT) {
    console.log(`  continue ${c.sid} ep ${c.episode} → ${c.chapter} (${c.kind})`);
    if (!DRY) await writeCuratedContinue(c.sid, c.episode, { chapter: c.chapter, kind: c.kind, note: c.note });
    n++;
  }
  for (const d of ANNOTATION_DELETE) {
    console.log(`  DELETE annotation ${d.sid} ep ${d.episode} ${d.kind} — ${d.why}`);
    if (!DRY) { const { error } = await db.from('episode_annotations').delete().eq('series_id', d.sid).eq('episode', d.episode).eq('kind', d.kind); if (error) throw new Error(error.message); }
    n++;
  }
  for (const a of ANNOTATION_UPSERT) {
    console.log(`  annotation ${a.sid} ep ${a.episode} ${a.kind}{${a.chapters.slice(0, 40)}}`);
    if (!DRY) await upsertAnnotation({ series_id: a.sid, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
    n++;
  }
  for (const sc of SCOPES) {
    console.log(`  scope ${sc.series_id}: vol ${sc.start_volume ?? 1}-${sc.end_volume ?? '·'} · ch ${sc.start_chapter ?? 1}-${sc.end_chapter ?? '·'}`);
    if (!DRY) { const { error } = await db.from('series_scopes').upsert({ ...sc, updated_at: new Date().toISOString() }, { onConflict: 'series_id' }); if (error) throw new Error(error.message); }
    n++;
  }
  console.log(`[apply-sidecar] ${n} change(s)${DRY ? ' — DRY RUN' : ''}. Then: scopes-apply, heal (T6 asserts the four reborn rows + d-gray-man 66 → filler), census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, `apply-sidecar: ${n} changes`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
