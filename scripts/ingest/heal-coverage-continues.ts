// THE COVERAGE HEALER — C2 (amended 2026-09-07, "open the book here") over every anchored canon / mixed row:
// continue_chapter = the first chapter not yet FINISHED by this or any earlier episode (lib/coverage.ts#walkContinue —
// the ONE derivation the audit and the apply read too, P2). Rules:
//   - a HEALER row (continue_source 'healer', or null with a value, or no continue): written when the walk stores a
//     value (kind hole / open / walk / post_series) and the stored row differs; CLEARED when the walk says 'default'
//     (the display derives END + 1) and a healer value stands. Value, kind, the generated three-part note.
//   - a CURATED row (continue_source 'manual' — an apply / ruling — or 'source') is never overwritten (C7): the audit
//     lists a disagreement (continue_offwalk_curated) for Sean; the healer only migrates a stale KIND vocabulary
//     ('parity' / 'unseen', retired by C6's amendment) where the VALUE already agrees with the walk.
//   - loose series (borrow-maps) and series without an instrument are skipped (A40 / T25).
// Re-runnable; converges in one pass. --dry-run prints every change without writing.
//   npx tsx --env-file=.env.ingest scripts/ingest/heal-coverage-continues.ts [--dry-run] [seriesId ...]
import { db, selectAll } from './lib/db';
import { seriesHasInstrument, sourceKindOf } from './lib/rulings/source-kinds';
import { buildCoverage, continueAgrees, continueValueAgrees, kindFor, walkContinue, type CoverageAnchor, type CoverageAnnotation } from './lib/coverage';
import { isCuratedContinue } from './lib/continues';

const DRY = process.argv.includes('--dry-run');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));

async function main() {
  const seriesRows = await selectAll<{ id: string; status: string; mapping_mode: string | null; source_type: string | null }>(
    'series',
    'id, status, mapping_mode, source_type',
    (q) => q.neq('mapping_mode', 'loose'),
  );
  const targets = seriesRows.filter((s) => (ONLY.length ? ONLY.includes(s.id) : true)).filter((s) => seriesHasInstrument(s.source_type)); // T25
  let written = 0, cleared = 0, restamped = 0, curatedOff = 0, rowsWalked = 0;
  for (const s of targets) {
    const anchors = await selectAll<CoverageAnchor & { series_id: string }>('chapter_anchors', 'series_id, episode, chapter, start_chapter, chapters_adapted, continue_chapter, continue_kind, continue_note, continue_source, source', (q) => q.eq('series_id', s.id).order('episode'));
    if (!anchors.length) continue;
    const eps = await selectAll<{ number: number; type: string }>('episodes', 'number, type', (q) => q.eq('series_id', s.id));
    const typeOf = new Map(eps.map((e) => [Number(e.number), e.type]));
    const annotations = await selectAll<CoverageAnnotation>('episode_annotations', 'episode, kind, chapters', (q) => q.eq('series_id', s.id));
    const index = buildCoverage(anchors, annotations, (n) => typeOf.get(n));
    const unit = sourceKindOf(s.source_type)?.unit === 'volume' ? 'vol' : 'ch';
    const last = index.rows[index.rows.length - 1];
    const lines: string[] = [];
    for (const row of index.rows) {
      rowsWalked++;
      const w = walkContinue(row, index, { finale: s.status === 'finished' && row === last, unit });
      if (isCuratedContinue(row) || row.continue_source === 'source') {
        // C7: never the healer's to change; C6 (amended): a retired kind on an agreeing value is restamped
        if (row.continue_chapter != null && continueValueAgrees(row, w) && row.continue_kind !== kindFor(w) && (row.continue_kind === 'parity' || row.continue_kind === 'unseen' || row.continue_kind == null)) {
          lines.push(`  ep${row.episode}: curated continue ${row.continue_chapter} — kind ${row.continue_kind ?? 'null'} → ${kindFor(w)} (C6 vocabulary; value and note kept)`);
          if (!DRY) await db.from('chapter_anchors').update({ continue_kind: kindFor(w) }).eq('series_id', s.id).eq('episode', row.episode);
          restamped++;
        } else if (!continueValueAgrees(row, w)) curatedOff++;
        continue;
      }
      if (continueAgrees(row, w) && (!w.stored || row.continue_note === w.note)) continue;
      if (!w.stored) {
        if (row.continue_chapter == null) continue;
        lines.push(`  ep${row.episode}: healer continue ${row.continue_chapter} (${row.continue_kind ?? 'no kind'}) CLEARED — the walk says END + 1 = ${w.end + 1} (derived)`);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').update({ continue_chapter: null, continue_kind: null, continue_note: null, continue_source: null }).eq('series_id', s.id).eq('episode', row.episode);
          if (error) throw new Error(`${s.id} ep${row.episode}: ${error.message}`);
        }
        cleared++;
        continue;
      }
      lines.push(`  ep${row.episode}: continue ${row.continue_chapter ?? '(none)'}${row.continue_kind ? ` [${row.continue_kind}]` : ''} → ${w.value} [${w.kind}] — ${w.note.slice(0, 150)}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors')
          .update({ continue_chapter: w.value, continue_kind: w.kind, continue_note: w.note, continue_source: 'healer' })
          .eq('series_id', s.id).eq('episode', row.episode);
        if (error) throw new Error(`${s.id} ep${row.episode}: ${error.message}`);
      }
      written++;
    }
    if (lines.length) console.log(`== ${s.id}\n${lines.join('\n')}`);
  }
  console.log(`\n[coverage] ${targets.length} series, ${rowsWalked} rows walked: written ${written}, cleared ${cleared}, kinds restamped ${restamped}; curated rows off the walk (listed by the census, never touched) ${curatedOff}${DRY ? ' — DRY RUN, nothing written' : ''}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
