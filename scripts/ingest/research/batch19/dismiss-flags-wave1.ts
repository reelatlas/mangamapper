// Consolidate deep after batch 19 wave 1 (2026-08-26, P24 stale cleanup):
// open flags whose condition this wave or E2 resolved — dismissed with the
// reason inline (the batch-17 precedent). Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/dismiss-flags-wave1.ts
import { db } from '../../lib/db';
const DISMISS: [number, string][] = [
  [817, 'E2 (§12.66): the namesake contamination was purged and the 2023 series filled from its own year-disambiguated page under G55; the gate now refuses namesake rows.'],
  [787, 'E2 (§12.66): superseded — the backfill now tries "(2023 TV series)" forms first; the 1996 list family no longer wins the prefix search.'],
  [943, 'batch 19 wave 1 (§12.69): the honest terminal is on the last mixed row — ep 16 → ch 20 (finishes the chapter), continue 20 (the space ends); ep 18 is A44 + side_source{Trigun Maximum}. The MU pin on a filler row stays refused by A1.'],
  [841, 'batch 19 wave 1 (§12.69): the frontier was researched — ep 36 END 37 (AFG page-level continua), ep 38 → 39 confirmed, post-series continue 37 (C1); 39-51 are the studio ending (filler).'],
  [849, 'stale: maxAnchorEpisode already equals aired (73); batch 19 wave 1 re-ruled 14/25/49 and the ep-12 continue.'],
  [928, 'batch 17 applied the ep-24 removal / ep-20 bound; batch 19 wave 1 ruled the tail (ep 21 A44, continue 31 post-series) and 15-16 (filler) — the notes are consumed.'],
  [439, 'stale 2026-08-22 parse_integrity "empty" — the series has 24 rows from later resolves; batch 17/18/19 researched it end to end.'],
];
for (const [id, why] of DISMISS) {
  const { data } = await db.from('ingest_flags').select('status, detail').eq('id', id).maybeSingle();
  if (!data) { console.log(`#${id}: not found`); continue; }
  if (data.status !== 'open') { console.log(`#${id}: already ${data.status}`); continue; }
  const { error } = await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString(), detail: { ...(data.detail ?? {}), dismissed: why } }).eq('id', id);
  if (error) throw new Error(error.message);
  console.log(`#${id}: dismissed — ${why.slice(0, 70)}…`);
}
process.exit(0);
