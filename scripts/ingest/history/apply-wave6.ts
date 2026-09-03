// Batch 20 wave 6 — the curated apply (P10: the map decides). Sean ruled
// 2026-08-28 (WAVE6-RECOVERY + the verify reports + the chat rulings):
// FotNS 29-56 anchors as delivered; 53 → filler / 54 → mixed / 57 → MIXED
// under the T28 sole-adaptation exception (its first ruling) with the fence
// repair 83 → 82 and ep 58's curated repair → 80; the seven L-D pins land at
// the manual tier (regenesis ep 12's anchor DELETED, its continue moved to
// the ep-9 terminal — the verifier's apply-blocking catch); flags 771 / 681 /
// 541 resolved. Types (T6), totals (N35) and the retirement are MAP edits
// asserted by the healers; this script carries anchors, continues (C7),
// annotations and the flag resolutions. Idempotent; --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave6.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const B = 'batch 20 wave 6 (2026-08-28; verified R24, Sean ruled)';
const FILES: [string, string][] = [
  ['fist-of-the-north-star-w6.json', 'fist-of-the-north-star'],
  ['mf-ghost.json', 'mf-ghost'],
  ['shy.json', 'shy'],
  ['to-the-abandoned-sacred-beasts.json', 'to-the-abandoned-sacred-beasts'],
  ['d-frag.json', 'd-frag'],
  ['darwin-s-game.json', 'darwin-s-game'],
  ['fist-of-the-blue-sky-regenesis.json', 'fist-of-the-blue-sky-regenesis'],
  ['btooom.json', 'btooom'],
];
// curation overlay — the ruled deviations from the files
const ANCHOR_DROP = new Set(['fist-of-the-blue-sky-regenesis#12']); // G37/A1: the 2006 series' pin — deleted, never repaired
const CONTINUE_MOVE: Record<string, number> = { 'fist-of-the-blue-sky-regenesis#12': 9 }; // the verifier's apply-blocking catch: the continue lives on the ep-9 terminal
const EXTRA_ANCHORS: { sid: string; episode: number; chapter: number; start: number | null; adapted: string | null; volume: number | null; note: string }[] = [
  { sid: 'fist-of-the-north-star', episode: 57, chapter: 82, start: null, adapted: '82 (closing pages only — Rei\'s death)', volume: 10, note: `Fence repair 83 → 82 (the clip show's one manga beat is Rei's death = ch 82's last pages; ch 83 opens the Souther arc — Rei ch 26-82 / ep 23-57 per the fandom index; hokutosite + RQ87 agree). The row is MIXED under the T28 sole-adaptation exception (its first ruling): these pages are adapted NOWHERE else and are load-bearing, so the anchor stands rather than deleting (A1 does not bite on mixed). ${B}` },
  { sid: 'fist-of-the-north-star', episode: 58, chapter: 80, start: null, adapted: '80 (the betrayal passage, partial)', volume: 9, note: `Curated repair 83 → 80: ep 58's one manga sequence is ch 80's betrayal passage, not ch 83 (hokuto.fandom appearances + RQ87 + hokutosite, all three; the wave-6 verifier confirmed the flag; Souther = ch 85-97 / eps 58-68 — the next block must not read ep 58 as ch-83/85 coverage). ${B}` },
];
const EXTRA_ANNOTATIONS: { sid: string; episode: number; kind: AnnotationKind; chapters: string | null; note: string }[] = [
  { sid: 'fist-of-the-north-star', episode: 58, kind: 'rearranged', chapters: '80', note: `A42 reorder ack: ep 58 revisits ch 80's betrayal passage (earlier material — its anchor 80 sits below ep 57's 82 by design, a flashback, not junk; hokuto.fandom appearances + RQ87 + hokutosite). Settles the nonmonotonic audit for this seam. ${B}` },
  { sid: 'fist-of-the-north-star', episode: 57, kind: 'partial', chapters: '82', note: `Clip show until Rei's death at the end (the fandom Filler page's own phrase): only ch 82's closing pages are adapted — the sole adaptation of a load-bearing beat, which is what makes the row mixed (T28 sole-adaptation exception, first witness). Skip advice: everything before the tail is recap. ${B}` },
];
const FLAG_RESOLUTIONS: { id: number; resolution: string }[] = [
  { id: 771, resolution: 'DISMISSED (wave 6): no edition divergence — MU latest_chapter 211 is a latest-DATED-release artifact against a 293-ch / 33-vol space MU itself calls complete; the ep-24 pin verified 72-74 v9.' },
  { id: 681, resolution: 'RESOLVED (wave 6, N35): the reading edition is the manga\'s own 1-87 / 15 volumes (ja-WP 全87話, en-WP, MangaDex 87.5, Magazine Pocket 第N話); stored 120 was an unsourceable AniList scalar — re-based by CHAPTER_SPACE_OVERRIDES.' },
  { id: 541, resolution: 'RESOLVED (wave 6): the frontier exists — ep 12 → ch 35-36 vol 5 at the manual tier; C5 continue 37 with the skip list named (chs 8/10/11 skipped; 26 OAD-only).' },
];

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let anchors = 0, continues = 0, annos = 0, dropped = 0;
  for (const [f, sid] of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    if (v.series_id !== sid) throw new Error(`${f}: series ${v.series_id}`);
    for (const a of v.anchors ?? []) {
      const key = `${sid}#${a.episode}`;
      if (ANCHOR_DROP.has(key)) continue;
      const row = { series_id: sid, episode: Number(a.episode), chapter: Number(a.end_chapter), start_chapter: a.start_chapter != null ? Number(a.start_chapter) : null, chapters_adapted: a.chapters_adapted ?? null, volume: a.volume != null ? Number(a.volume) : null, source: 'manual', note: `${a.why ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
      console.log(`  anchor ${sid} ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter}${row.volume ? ` v${row.volume}` : ''}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' });
        if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`);
      }
      anchors++;
    }
  }
  for (const x of EXTRA_ANCHORS) {
    console.log(`  anchor (curated) ${x.sid} ep ${x.episode} → ${x.chapter}${x.volume ? ` v${x.volume}` : ''}`);
    if (!DRY) {
      const { error } = await db.from('chapter_anchors').upsert({ series_id: x.sid, episode: x.episode, chapter: x.chapter, start_chapter: x.start, chapters_adapted: x.adapted, volume: x.volume, source: 'manual', note: x.note.slice(0, 600) }, { onConflict: 'series_id,episode' });
      if (error) throw new Error(`${x.sid} ep${x.episode}: ${error.message}`);
    }
    anchors++;
  }
  for (const key of ANCHOR_DROP) {
    const [sid, ep] = key.split('#');
    console.log(`  DELETE anchor ${sid} ep ${ep} (G37/A1 — another adaptation's pin)`);
    if (!DRY) {
      const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', Number(ep));
      if (error) throw new Error(`${key}: ${error.message}`);
    }
    dropped++;
  }
  for (const [f, sid] of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    for (const c of v.continue_points ?? []) {
      const ep = CONTINUE_MOVE[`${sid}#${c.episode}`] ?? Number(c.episode);
      const note = `${c.note ?? c.why ?? ''}${CONTINUE_MOVE[`${sid}#${c.episode}`] ? ' [moved to the terminal row at curation — the verifier: a continue on a deleted-anchor row lands nothing]' : ''} ${B}`;
      console.log(`  continue ${sid} ep ${ep} → ${c.continue_chapter} (${c.kind})`);
      if (!DRY) await writeCuratedContinue(sid, ep, { chapter: Number(c.continue_chapter), kind: c.kind, note });
      continues++;
    }
    for (const a of v.annotations ?? []) {
      for (const ep of a.episodes as number[]) {
        // the verifier's text fix (R24): the restaged range ends at the END (254), not 255
        const chapters = `${sid}#${ep}#${a.kind}` === 'fist-of-the-blue-sky-regenesis#9#rearranged' ? '≈246-254 reached over the never-adapted 190-243' : a.chapters ?? null;
        console.log(`  annotation ${sid} ep ${ep} ${a.kind}${chapters ? `{${chapters}}` : ''}`);
        if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters, note: `${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
        annos++;
      }
    }
  }
  for (const x of EXTRA_ANNOTATIONS) {
    console.log(`  annotation (curated) ${x.sid} ep ${x.episode} ${x.kind}{${x.chapters}}`);
    if (!DRY) await upsertAnnotation({ series_id: x.sid, episode: x.episode, kind: x.kind, chapters: x.chapters, note: x.note.slice(0, 1200), origin: 'research' });
    annos++;
  }
  for (const fr of FLAG_RESOLUTIONS) {
    console.log(`  flag #${fr.id} → dismissed`);
    if (!DRY) {
      const { data: old } = await db.from('ingest_flags').select('detail').eq('id', fr.id).maybeSingle();
      const { error } = await db.from('ingest_flags').update({ status: 'dismissed', detail: { ...(old?.detail as object ?? {}), resolution: fr.resolution } }).eq('id', fr.id);
      if (error) throw new Error(`flag ${fr.id}: ${error.message}`);
    }
  }
  console.log(`[apply-wave6] ${anchors} anchors, ${dropped} deleted, ${continues} continues, ${annos} annotations, ${FLAG_RESOLUTIONS.length} flags${DRY ? ' — DRY RUN' : ''}. Types (T6), totals (N35), the A45 state: run assert-overrides, then heal + census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annos, flagged: 0 }, `apply-wave6: ${anchors} anchors, ${continues} continues, ${annos} annotations`);
}
main().then(() => process.exit(0));
