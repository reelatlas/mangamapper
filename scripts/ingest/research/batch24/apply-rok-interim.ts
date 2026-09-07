// record-of-ragnarok — THE INTERIM on the four round-grain STARTs (Sean ruled 2026-09-07 with Cursor: 'null them. The ENDs
// stay. Cite A14 (null = unknown; display falls back), not A13. Do not leave chapters_adapted as 31-42 and friends; that span is the
// same lie. Display may show prevEnd+1 until batch 23 — that is the designed unknown, not a second map.'). The §12.156 AFG run rebuilt
// the afg tier on this series (anchors at 20 / 21 / 23 / 26 / 32 / 37) and the batch-12 ROUND-GRAIN manual STARTs on 22 / 27 / 33 / 38
// (the round's first chapter — the phantom back-reach batch 22's verifier named and repaired on ep 17) now render as four false
// back-jumps (verify-series-display FAILS; anchor_start_offtrend 4). A14: start_chapter → null and chapters_adapted → null (a bare END
// = genuinely unknown; every display site derives only then); the END (the verified round finale) and the volume stay; the note says
// why. Retires when batch 23 wave 1's RoK verdict lands the exact STARTs on pages. Manual tier only (P8); refuses any other shape.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch24/apply-rok-interim.ts [--dry-run]
import { db } from '../../lib/db';

const DRY = process.argv.includes('--dry-run');
const SID = 'record-of-ragnarok';
// episode → the END the batch-12 record carries (the verified round finale — batch 22's verifier: 'every VALUE holds')
const ROWS: Record<number, number> = { 22: 42, 27: 54, 33: 65, 38: 77 };
const NOTE = "A14 INTERIM (Sean 2026-09-07 with Cursor, §12.157): START and span set to UNKNOWN — the batch-12 round-grain START (the round's first chapter) is the phantom back-reach batch 22's verifier named and repaired on ep 17 (A13: a START that is not the row's first chapter); the END is the verified round finale and stays; the display derives the start (prevEnd + 1) until batch 23 wave 1's RoK verdict lands the exact START on pages";

async function main() {
  let changed = 0;
  for (const [epS, end] of Object.entries(ROWS)) {
    const ep = Number(epS);
    const { data: cur, error } = await db.from('chapter_anchors').select('episode, chapter, start_chapter, chapters_adapted, volume, source, note').eq('series_id', SID).eq('episode', ep).maybeSingle();
    if (error) throw new Error(`${SID}#${ep}: ${error.message}`);
    if (!cur) throw new Error(`${SID}#${ep}: no stored anchor — the shape changed, stop`);
    if (cur.source !== 'manual') throw new Error(`${SID}#${ep}: source ${cur.source}, not manual — P8, stop`);
    if (cur.chapter !== end) throw new Error(`${SID}#${ep}: END ${cur.chapter} ≠ the recorded ${end} — the shape changed, stop`);
    if (cur.start_chapter == null && cur.chapters_adapted == null) { console.log(`  ep ${ep}: already unknown — nothing to do`); continue; }
    console.log(`  ep ${ep}: START ${cur.start_chapter} → null, span '${cur.chapters_adapted}' → null; END ${cur.chapter} v${cur.volume} stays (${DRY ? 'DRY' : 'writing'})`);
    if (!DRY) {
      const { error: e2 } = await db.from('chapter_anchors').update({ start_chapter: null, chapters_adapted: null, note: `${String(cur.note ?? '').slice(0, 380)} | ${NOTE}`.slice(0, 600) }).eq('series_id', SID).eq('episode', ep);
      if (e2) throw new Error(`${SID}#${ep}: ${e2.message}`);
    }
    changed++;
  }
  console.log(`[rok-interim] ${changed} row(s) ${DRY ? 'would change — DRY RUN' : 'changed'}; then: verify-series-display.ts --all (expect 0 failing), npm run census`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
