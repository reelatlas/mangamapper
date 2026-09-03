// Batch 20 wave 7 — the curated apply (P10). Sean ruled 2026-08-28 (with
// Cursor; WAVE7-RECOVERY §Open for Sean): the seven L-D verdicts fold as
// delivered (cobra's bad pin DELETED, no fabricated continue); regenesis
// 9 → mixed / 10-11 → filler and S2 stays OUT (the Outlaw Star class, NOT
// parallel — no comparison instrument; author credit does not mint
// correspondence); N35 ×2 and the G53 date/title blocks are MAP edits
// asserted by the healers; the killing-bites date is HELD (the slot check
// surfaced an ep-11/12 collision — a sourced two-row lane-B follow-up);
// the T28 six stay PARKED (not ruled). Idempotent; --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave7.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const B = 'batch 20 wave 7 (2026-08-28; Sean ruled)';
const FILES: [string, string][] = [
  ['shaman-king-flowers.json', 'shaman-king-flowers'],
  ['prison-school.json', 'prison-school'],
  ['killing-bites.json', 'killing-bites'],
  ['soul-eater-not.json', 'soul-eater-not'],
  ['drifters.json', 'drifters'],
  ['cobra-the-animation.json', 'cobra-the-animation'],
  ['orange.json', 'orange'],
  ['fist-of-the-blue-sky-regenesis-w7.json', 'fist-of-the-blue-sky-regenesis'],
];
const ANCHOR_DROP = new Set(['cobra-the-animation#13']); // G37/A44: the 1983 series' pin in another numbering — deleted, never repaired

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let anchors = 0, continues = 0, annos = 0, dropped = 0;
  for (const [f, sid] of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    if (v.series_id !== sid) throw new Error(`${f}: ${v.series_id}`);
    for (const a of v.anchors ?? []) {
      if (ANCHOR_DROP.has(`${sid}#${a.episode}`)) continue;
      const row = { series_id: sid, episode: Number(a.episode), chapter: Number(a.end_chapter), start_chapter: a.start_chapter != null ? Number(a.start_chapter) : null, chapters_adapted: a.chapters_adapted ?? null, volume: a.volume != null ? Number(a.volume) : null, source: 'manual', note: `${a.why ?? a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
      console.log(`  anchor ${sid} ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter}${row.volume ? ` v${row.volume}` : ''}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' });
        if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`);
      }
      anchors++;
    }
    for (const c of v.continue_points ?? []) {
      console.log(`  continue ${sid} ep ${c.episode} → ${c.continue_chapter} (${c.kind})`);
      if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: Number(c.continue_chapter), kind: c.kind, note: `${c.note ?? c.why ?? ''} ${B}` });
      continues++;
    }
    for (const a of v.annotations ?? []) {
      for (const ep of a.episodes as number[]) {
        console.log(`  annotation ${sid} ep ${ep} ${a.kind}${a.chapters ? `{${a.chapters}}` : ''}`);
        if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters: a.chapters ?? null, note: `${a.note} [${B}]`.slice(0, 1200), origin: 'research' });
        annos++;
      }
    }
  }
  for (const key of ANCHOR_DROP) {
    const [sid, ep] = key.split('#');
    console.log(`  DELETE anchor ${sid} ep ${ep}`);
    if (!DRY) {
      const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', Number(ep));
      if (error) throw new Error(`${key}: ${error.message}`);
    }
    dropped++;
  }
  console.log(`[apply-wave7] ${anchors} anchors, ${dropped} deleted, ${continues} continues, ${annos} annotations${DRY ? ' — DRY RUN' : ''}. Types (T6), totals (N35), dates/titles (G53): run assert-overrides, then heal + census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annos, flagged: 0 }, `apply-wave7: ${anchors} anchors, ${continues} continues, ${annos} annotations`);
}
main().then(() => process.exit(0));
