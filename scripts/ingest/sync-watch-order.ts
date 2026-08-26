// Mirror order-only watch-order rulings into the CANONICAL, app-readable
// table (watch_order_entries) — ingest_fractionals stays the staging/ruling
// record (service-role only). Fill-only on display_label: labels are
// per-series surface RULINGS (Sean 2026-08-24: MHA's post-finale specials
// render as "170+1" / "170+1.5"; everything else stays data-ready and
// unsurfaced until its own ruling) and live in RULED_LABELS below. Full
// adaptation fields are carried where the ruling knows them (RULED_RECORDS).
// Idempotent; run after any fractional disposition change.
//   npx tsx --env-file=.env.ingest scripts/ingest/sync-watch-order.ts

import { db, selectAll, startRun, finishRun } from './lib/db';

// series_id → position → surfaced label (a UI-surface ruling, per series).
// AUTHORITATIVE both ways: an entry absent here carries display_label null
// and does NOT render.
//
// PARKED (Sean 2026-08-24): MHA's labels were briefly live, then pulled —
// surfacing waits for the specials/OVAs/movies STATUS design pass. The
// intended v2 logic, recorded as the reference point (docs §10 has the
// full version): entries render as episode rows in the +N format
// (#170+1 'More', #170+1.5 'I am a hero too'), COUNT as units — section
// header envelope includes their chapters (…-431.5) and volume, section
// counts include them, they appear on the manga strip and are selectable/
// steppable, and the series episode total reads "170+1.5". Re-activate by
// restoring: 'my-hero-academia': { 171: '170+1', 171.5: '170+1.5' }.
const RULED_LABELS: Record<string, Record<number, string>> = {};

// structured adaptation records for ruled entries (prose lives in the note)
const RULED_RECORDS: Record<string, Record<number, { chapter: number; volume: number | null; chapters_adapted: string; kind: string }>> = {
  'my-hero-academia': {
    171: { chapter: 431, volume: 42, chapters_adapted: '431', kind: 'special' },
    171.5: { chapter: 431.5, volume: 42, chapters_adapted: '431.5', kind: 'special' },
  },
};

async function main() {
  const runId = await startRun('resolve');
  try {
    const fr = await selectAll<{
      series_id: string;
      position: number;
      title: string | null;
      air_date: string | null;
      note: string | null;
      source: string | null;
      disposition: string;
    }>('ingest_fractionals', 'series_id, position, title, air_date, note, source, disposition', (q) => q.eq('disposition', 'order_only'));
    let n = 0;
    for (const f of fr) {
      const label = RULED_LABELS[f.series_id]?.[Number(f.position)] ?? null;
      const rec = RULED_RECORDS[f.series_id]?.[Number(f.position)];
      const row: Record<string, unknown> = {
        series_id: f.series_id,
        position: f.position,
        title: f.title ?? '(untitled)',
        air_date: f.air_date,
        note: f.note,
        kind: rec?.kind ?? null,
        chapter: rec?.chapter ?? null,
        volume: rec?.volume ?? null,
        chapters_adapted: rec?.chapters_adapted ?? null,
      };
      row.display_label = label; // the code map is the ruling source — absent = unsurfaced
      const { error } = await db.from('watch_order_entries').upsert(row, { onConflict: 'series_id,position' });
      if (error) throw new Error(`${f.series_id}@${f.position}: ${error.message}`);
      n++;
    }
    // entries whose fractional record vanished (re-dispositioned) drop out
    const keep = new Set(fr.map((f) => `${f.series_id}|${f.position}`));
    const existing = await selectAll<{ series_id: string; position: number }>('watch_order_entries', 'series_id, position');
    let dropped = 0;
    for (const e of existing) {
      if (!keep.has(`${e.series_id}|${e.position}`)) {
        await db.from('watch_order_entries').delete().eq('series_id', e.series_id).eq('position', e.position);
        dropped++;
      }
    }
    const labeled = fr.filter((f) => RULED_LABELS[f.series_id]?.[Number(f.position)] != null).length;
    console.log(`watch_order_entries: ${n} synced (${labeled} labeled/surfaced), ${dropped} dropped`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, 'watch-order sync');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
