// C5 curation queue (Sean 2026-09-04, "audit now, healer later"): the block
// exits the census lists — backjump_continue_unruled (no continue) and
// backjump_continue_unnoted (a continue whose note says neither already nor
// never). PROPOSES, from stored spans only: for an exit with no continue —
// covered → the frontier row's own continue (the ep-90 → ep-112 shape), else
// END + 1 with the unseen range; for an unnoted continue — the C5 note. Values
// are written ONLY with --apply, through writeCuratedContinue (C7) for new
// continues and a note-only update for the rest. Nothing here is research:
// every number comes from chapter_anchors.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch22/c5-queue.ts [--apply]
import { db, selectAll } from '../../lib/db';
import { writeCuratedContinue } from '../../lib/continues';
import { backjumpCoverage, backjumpNote, backjumpNoteOk, backjumpRange } from '../../lib/c3';

const APPLY = process.argv.includes('--apply');
const nums = (s: string | null) => (String(s ?? '').replace(/\([^)]*\)/g, '').match(/\d+/g) ?? []).map(Number);
const anchors = await selectAll<any>('chapter_anchors', 'series_id, episode, chapter, start_chapter, chapters_adapted, continue_chapter, continue_kind, continue_note, continue_source, source');
const series = await selectAll<any>('series', 'id, mapping_mode, status');
const loose = new Set(series.filter((s: any) => s.mapping_mode === 'loose').map((s: any) => s.id));
const statusOf = new Map(series.map((s: any) => [s.id, s.status]));
const by = new Map<string, any[]>();
for (const a of anchors) { if (!by.has(a.series_id)) by.set(a.series_id, []); by.get(a.series_id)!.push(a); }
const proposals: string[] = [];
let newContinues = 0, notes = 0;
for (const [sid, list] of by) {
  if (loose.has(sid)) continue;
  const sorted = [...list].sort((x, y) => x.episode - y.episode);
  const rows = sorted.map((r) => ({ episode: r.episode, chapters: [...new Set([...(r.start_chapter != null ? Array.from({ length: r.chapter - r.start_chapter + 1 }, (_, i) => r.start_chapter + i) : [r.chapter]), ...nums(r.chapters_adapted)])] }));
  let envelope = -Infinity, envRow: any = null;
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];
    const back = Number.isFinite(envelope) && a.chapter < envelope;
    if (a.chapter >= envelope) { envelope = a.chapter; envRow = a; }
    if (!back) continue;
    const next = sorted[i + 1];
    const exit = !next || next.chapter >= envelope || next.chapter < a.chapter;
    if (!exit) continue;
    if (a.continue_chapter == null) {
      // covered-or-not: is every chapter in (END, frontier] adapted by some other row?
      const cov = backjumpCoverage(a.episode, a.chapter, envelope + 1, rows);
      const covered = cov.unseen.length === 0;
      const isLast = !next && statusOf.get(sid) === 'finished';
      let value: number, kind: 'parity' | 'post_series', why: string;
      if (isLast) { value = envelope + 1; kind = 'post_series'; why = `finale of a finished series: post-series resume = coverage ${envelope} + 1`; }
      else if (covered && envRow?.continue_chapter != null && envRow.continue_chapter >= envelope) { value = envRow.continue_chapter; kind = 'parity'; why = `the stretch ${a.chapter + 1}-${envelope} is already adapted; continue = the frontier row's own FORWARD continue (ep ${envRow.episode} → ${envRow.continue_chapter})`; }
      else if (covered) { value = envelope + 1; kind = 'parity'; why = `the stretch ${a.chapter + 1}-${envelope} is already adapted; the frontier row (ep ${envRow?.episode}) has no forward continue → frontier + 1 (C1 if the frontier chapter was left unfinished — say so when ruling)`; }
      else { value = a.chapter + 1; kind = 'parity'; why = `NOT covered by anchored rows — END + 1 with the unplaced range named (a next known START from research outranks this, C2)`; }
      // the note always describes the stretch up to the FRONTIER (on the uncovered branch the continue is END + 1 and the unplaced range must still be named)
      const note = backjumpNote(backjumpCoverage(a.episode, a.chapter, Math.max(value, envelope + 1), rows), null);
      proposals.push(`NEW  ${sid} ep ${a.episode} (END ${a.chapter}, frontier ${envelope}${next ? `, next ep ${next.episode} → ${next.chapter}` : ', last row'}) → continue ${value} [${kind}] — ${why} | ${note.slice(0, 160)}`);
      newContinues++;
      if (APPLY) await writeCuratedContinue(sid, a.episode, { chapter: value, kind, note });
    } else {
      const range = backjumpRange(a.chapter, a.continue_chapter);
      if (!range || backjumpNoteOk(a.continue_note ?? null)) continue;
      const note = backjumpNote(backjumpCoverage(a.episode, a.chapter, a.continue_chapter, rows), a.continue_note ?? null);
      proposals.push(`NOTE ${sid} ep ${a.episode} (END ${a.chapter} → continue ${a.continue_chapter}, ${a.continue_source ?? 'no source'}) | ${note.slice(note.indexOf('C5 ('), note.indexOf('C5 (') + 170)}`);
      notes++;
      if (APPLY) await db.from('chapter_anchors').update({ continue_note: note }).eq('series_id', sid).eq('episode', a.episode);
    }
  }
}
for (const p of proposals) console.log(p);
console.log(`[c5-queue] ${newContinues} new continues, ${notes} notes${APPLY ? ' — APPLIED' : ' — DRY RUN'}`);
