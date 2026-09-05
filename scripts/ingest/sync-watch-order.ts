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
import { loadRelatedWorkRegistry, lookupRelatedWork, wikiKey } from './lib/related-work-ids';
import { RULED_LABELS, RULED_RECORDS } from './lib/rulings/watch-order-labels';

// RULED_LABELS (series_id → position → surfaced label; AUTHORITATIVE both
// ways — absent = display_label null, not rendered) and RULED_RECORDS
// (structured adaptation records; prose lives in the note) live in
// lib/rulings/watch-order-labels.ts (restructure T2.1), including the PARKED
// MHA surfacing ruling (Sean 2026-08-24) and how to re-activate it.

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
    // T29 (T4.4): an entry's kind comes from a ruling (RULED_RECORDS) or from
    // the order-only component whose AniList start date EQUALS the entry's
    // air date — an exact join, never a title guess (R20). Else null: the
    // watch_order_kind_missing census class is the queue.
    const orderOnly = await selectAll<{ series_id: string; kind: string | null; anilist_id: number | null }>('series_components', 'series_id, kind, anilist_id', (q) => q.is('episode_start', null));
    const alIds = orderOnly.map((c) => c.anilist_id).filter((n): n is number => n != null);
    const al = alIds.length ? await selectAll<{ anilist_id: number; raw: any }>('ingest_anilist_media', 'anilist_id, raw', (q) => q.in('anilist_id', alIds)) : [];
    const startBy = new Map(al.map((r) => { const d = r.raw?.startDate; return [r.anilist_id, d?.year ? `${d.year}-${String(d.month ?? 1).padStart(2, '0')}-${String(d.day ?? 1).padStart(2, '0')}` : null]; }));
    const kindByDate = new Map<string, string>();
    for (const c of orderOnly) { const d = c.anilist_id != null ? startBy.get(c.anilist_id) : null; if (d && c.kind) kindByDate.set(`${c.series_id}|${d}`, c.kind); }
    // I46 (amended): identity outlives the row — the registry holds the AniList id an adoption attached to this wiki key, so a re-created
    // row carries it again; a halo row still holding that id (the adoption not yet run) blocks the write until sync-related-works resolves it
    const registry = await loadRelatedWorkRegistry();
    const heldBy = new Map<string, number>(); // `${series}#${anilist}` → the position that holds it
    for (const r of await selectAll<{ series_id: string; position: number; anilist_id: number | null }>('watch_order_entries', 'series_id, position, anilist_id', (q) => q.not('anilist_id', 'is', null))) heldBy.set(`${r.series_id}#${r.anilist_id}`, Number(r.position));
    let identities = 0;
    let n = 0;
    for (const f of fr) {
      const label = RULED_LABELS[f.series_id]?.[Number(f.position)] ?? null;
      const rec = RULED_RECORDS[f.series_id]?.[Number(f.position)];
      const derivedKind = rec?.kind ?? (f.air_date ? kindByDate.get(`${f.series_id}|${f.air_date}`) ?? null : null);
      const row: Record<string, unknown> = {
        series_id: f.series_id,
        position: f.position,
        title: f.title ?? '(untitled)',
        air_date: f.air_date,
        note: f.note,
        kind: derivedKind,
        chapter: rec?.chapter ?? null,
        volume: rec?.volume ?? null,
        chapters_adapted: rec?.chapters_adapted ?? null,
        origin: 'wiki', // I45 / G57: this writer's rows; sync-related-works owns origin 'halo'
      };
      row.display_label = label; // the code map is the ruling source — absent = unsurfaced
      const known = lookupRelatedWork(registry, 'wiki', wikiKey(f.series_id, f.position));
      if (known) { // the wiki key is owner-scoped by construction
        const holder = heldBy.get(`${f.series_id}#${known.anilist_id}`);
        if (holder == null || holder === Number(f.position)) { row.anilist_id = known.anilist_id; identities++; }
      }
      const { error } = await db.from('watch_order_entries').upsert(row, { onConflict: 'series_id,position' });
      if (error) throw new Error(`${f.series_id}@${f.position}: ${error.message}`);
      n++;
    }
    // entries whose fractional record vanished (re-dispositioned) drop out
    // G57 / I45: this writer deletes ONLY its own rows (origin 'wiki'); the related-works ledger (origin 'halo') and
    // ruled rows are never touched here — before 2026-09-05 this loop deleted every row it had not derived
    const keep = new Set(fr.map((f) => `${f.series_id}|${f.position}`));
    const existing = await selectAll<{ series_id: string; position: number; origin: string | null }>('watch_order_entries', 'series_id, position, origin');
    let dropped = 0;
    for (const e of existing) {
      if ((e.origin ?? 'wiki') !== 'wiki') continue;
      if (!keep.has(`${e.series_id}|${e.position}`)) {
        await db.from('watch_order_entries').delete().eq('series_id', e.series_id).eq('position', e.position);
        dropped++;
      }
    }
    const labeled = fr.filter((f) => RULED_LABELS[f.series_id]?.[Number(f.position)] != null).length;
    console.log(`watch_order_entries: ${n} synced (${labeled} labeled/surfaced, ${identities} identities from the registry), ${dropped} dropped`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, 'watch-order sync');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
