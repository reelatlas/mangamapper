// The Tennis own-series sitting (Sean 2026-09-06, with Cursor): the 26 anchors of the-prince-of-tennis-national-tournament, curated
// FROM THE THREE VERIFIED VERDICTS (the verdict JSON is the anchor source — out/the-prince-of-tennis__995 / 2752 / 4053.json):
// each chapters_adapted entry names its EPISODE; rows 1-13 = 995's eps 1-13, 14-19 = 2752's eps 1-6, 20-26 = 4053's eps 0-6.
// START = the row's main range's first chapter; END = the last SIGNIFICANT chapter (A47's sliverEnd with the next row's START);
// interludes (out-of-order first-time chapters) and slivers ride in chapters_adapted / the note, never as the END. Volume =
// the verdict's volume on the END entry (en-WP's Shogakukan boundaries — the series has no boundary table yet). source 'manual'.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/apply-tennis-anchors.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db } from '../../lib/db';
import { sliverEnd } from '../../lib/sliver';

const SID = 'the-prince-of-tennis-national-tournament';
const DRY = process.argv.includes('--dry-run');
type Entry = { start: number | null; end: number | null; volume?: number | null; weight?: string; note?: string };
type Verdict = { anilist_id: number; chapters_adapted: Entry[] };
const FILES: { file: string; rowOf: (ep: number) => number }[] = [
  { file: 'scripts/ingest/research/discovery/out/the-prince-of-tennis__995.json', rowOf: (ep) => ep },
  { file: 'scripts/ingest/research/discovery/out/the-prince-of-tennis__2752.json', rowOf: (ep) => 13 + ep },
  { file: 'scripts/ingest/research/discovery/out/the-prince-of-tennis__4053.json', rowOf: (ep) => 20 + ep }, // the Final counts from 第0話 = row 20
];

async function main() {
  const rows = new Map<number, { sig: Entry[]; sliv: Entry[]; file: string }>();
  for (const { file, rowOf } of FILES) {
    const v = JSON.parse(readFileSync(file, 'utf8')) as Verdict;
    for (const e of v.chapters_adapted) {
      const m = /EPISODE\s+(\d+)/i.exec(e.note ?? '');
      if (!m) throw new Error(`${file}: an entry without an EPISODE marker — ${(e.note ?? '').slice(0, 80)}`);
      const row = rowOf(Number(m[1]));
      const r = rows.get(row) ?? { sig: [], sliv: [], file };
      (e.weight === 'significant' ? r.sig : r.sliv).push(e);
      rows.set(row, r);
    }
  }
  if (rows.size !== 26) throw new Error(`${rows.size} rows carry entries, expected 26`);
  const { data: series } = await db.from('series').select('id').eq('id', SID).maybeSingle();
  if (!series) { console.log(`[tennis-anchors] ${SID} is not in canonical — run the seed and the grid first (nothing written)`); return; }
  const { data: eps } = await db.from('episodes').select('number').eq('series_id', SID);
  const have = new Set((eps ?? []).map((e) => Number(e.number)));
  // the plan: START / END / volume per row, then A47 against the NEXT row's START
  const plan = [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([row, r]) => {
    const main = r.sig.reduce((best, e) => (best == null || (e.end ?? 0) > (best.end ?? 0) ? e : best), null as Entry | null)!;
    const end = main.end!; const start = main.start!;
    const interludes = r.sig.filter((e) => e !== main);
    const ca = [`${start}-${end}`, ...interludes.map((e) => `${e.start === e.end ? e.start : `${e.start}-${e.end}`} (interlude, first-time)`), ...r.sliv.map((e) => `${e.start === e.end ? e.start : `${e.start}-${e.end}`} (sliver)`)].join('; ');
    return { row, start, end, volume: main.volume ?? null, chapters_adapted: ca, file: r.file };
  });
  let written = 0;
  for (let i = 0; i < plan.length; i++) {
    const p = plan[i]; const next = plan[i + 1];
    const verdict = sliverEnd(p.chapters_adapted, p.end, next ? next.start : null);
    const row = { series_id: SID, episode: p.row, chapter: verdict.end, start_chapter: p.start, chapters_adapted: p.chapters_adapted, volume: p.volume, source: 'manual', note: `the Tennis own-series sitting (Sean 2026-09-06): curated from ${p.file.split('/').pop()} (verified SOUND WITH NOTES); END = the last significant chapter${verdict.end !== p.end ? ` (A47 normalized from ${p.end})` : ''}` };
    console.log(`  row ${String(p.row).padStart(2)} → ${row.start_chapter}–${row.chapter} v${row.volume ?? '·'}${verdict.end !== p.end ? ` (A47 from ${p.end})` : ''}${have.has(p.row) ? '' : '  !! NO EPISODE ROW'}  ${p.chapters_adapted}`);
    if (!have.has(p.row)) throw new Error(`row ${p.row} has no episode row — mint the grid first`);
    if (DRY) continue;
    const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' });
    if (error) throw new Error(`row ${p.row}: ${error.message}`); written++;
  }
  console.log(`[tennis-anchors] ${plan.length} anchors planned, ${written} written${DRY ? ' — DRY RUN' : ''}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
