// EVENT — the one-time conversion of CURATED continues to the coverage walk (C2 amended 2026-09-07; Sean ruled with
// Cursor 2026-09-07: "no to ruling 1 as one yes — split them"). For every curated row (continue_source manual / source)
// whose VALUE disagrees with the walk:
//   - HOLE: the walk sits BEFORE the END (a chapter this episode jumped over) → CONVERT. Standing the value reprints
//     the skip (gantz 2 kept 10 and hid 5-9). This is why the walk exists.
//   - STRADDLE CLAMP: stored = END and the walk says END + 1, with no page range in the span — the old C1 guard's
//     clamp, not a page-level fact → CONVERT, EXCEPT a NAMED C1: a curated note that says C1 / mid-chapter / straddle
//     (soul-eater 36 is the witness) stays, restamped kind 'open'.
//   - everything else (skips whose chapters are unread, back-jumps, END + 1 values the walk steps past or holds at)
//     → CONVERT.
//   - EXCEPT a curated FINALE (kind post_series) whose researched value sits ABOVE a walk that stopped at a unit no
//     anchored row touches (hajime-no-ippo 127: 558 vs 421 — rows 103-126 carry no anchors): the walk's stop is an
//     unknown (A14), not a fact about the adaptation; the finale's 'where to start after the anime' was researched and
//     is a fact the walk cannot see → KEPT, listed (the missing anchors are the gap, anchor_gap_research's business).
// CONVERT = value and kind := the walk's; note := the generated note + ' | ' + the curated note (the research facts
// are kept); continue_source stays 'manual' (the ruling converts, it does not re-derive). Dry-run first (P40).
//   npx tsx --env-file=.env.ingest scripts/ingest/convert-curated-continues.ts [--dry-run] [seriesId ...]
import { db, selectAll } from './lib/db';
import { seriesHasInstrument, sourceKindOf } from './lib/rulings/source-kinds';
import { buildCoverage, continueValueAgrees, curatedStandsByRuling, kindFor, walkContinue, type CoverageAnchor, type CoverageAnnotation } from './lib/coverage';
import { isCuratedContinue } from './lib/continues';
import { ruledContinue } from './lib/rulings/curated-continues';

const DRY = process.argv.includes('--dry-run');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const TAG = 'CONVERTED to the walk (C2 amended 2026-09-07; Sean with Cursor)';
const WALK_PREFIX = /^C2 walk \(2026-09-07\): /;

async function main() {
  const seriesRows = await selectAll<{ id: string; status: string; source_type: string | null }>('series', 'id, status, source_type', (q) => q.neq('mapping_mode', 'loose'));
  const targets = seriesRows.filter((s) => (ONLY.length ? ONLY.includes(s.id) : true)).filter((s) => seriesHasInstrument(s.source_type));
  const counts = { hole: 0, clamp: 0, keptC1: 0, keptFinale: 0, keptRuled: 0, other: 0 };
  // REPAIR (the first run, 2026-09-07 late): its notes led with the walk's prefix and read as healer notes on manual rows
  // (ruling_violation 179) — reshape them to lead with the TAG; idempotent (a reshaped note no longer matches)
  {
    const bad = (await selectAll<{ series_id: string; episode: number; continue_note: string | null }>('chapter_anchors', 'series_id, episode, continue_note', (q) => q.eq('continue_source', 'manual').not('continue_chapter', 'is', null)))
      .filter((r) => String(r.continue_note ?? '').startsWith('C2 walk (2026-09-07): ') && String(r.continue_note).includes(TAG));
    for (const r of bad) {
      if (ONLY.length && !ONLY.includes(r.series_id)) continue;
      const m = String(r.continue_note).match(/^C2 walk \(2026-09-07\): (.*?) \| CONVERTED to the walk \(C2 amended 2026-09-07; Sean with Cursor\); (was .*)$/s);
      if (!m) continue;
      const fixed = `${TAG}: ${m[1]} | ${m[2]}`.slice(0, 1200);
      if (!DRY) { const { error } = await db.from('chapter_anchors').update({ continue_note: fixed }).eq('series_id', r.series_id).eq('episode', r.episode); if (error) throw new Error(`${r.series_id} ep${r.episode}: ${error.message}`); }
    }
    if (bad.length) console.log(`  note shape repaired on ${bad.length} converted row(s) (the TAG leads; the walk prefix is the healer's)`);
  }
  const rows: string[] = [];
  for (const s of targets) {
    const anchors = await selectAll<CoverageAnchor>('chapter_anchors', 'episode, chapter, start_chapter, chapters_adapted, continue_chapter, continue_kind, continue_note, continue_source, source', (q) => q.eq('series_id', s.id).order('episode'));
    if (!anchors.length) continue;
    const eps = await selectAll<{ number: number; type: string }>('episodes', 'number, type', (q) => q.eq('series_id', s.id));
    const typeOf = new Map(eps.map((e) => [Number(e.number), e.type]));
    const ann = await selectAll<CoverageAnnotation>('episode_annotations', 'episode, kind, chapters', (q) => q.eq('series_id', s.id));
    const index = buildCoverage(anchors, ann, (n) => typeOf.get(n));
    const unit = sourceKindOf(s.source_type)?.unit === 'volume' ? 'vol' : 'ch';
    const last = index.rows[index.rows.length - 1];
    for (const row of index.rows) {
      if (!(isCuratedContinue(row) || row.continue_source === 'source')) continue;
      const w = walkContinue(row, index, { finale: s.status === 'finished' && row === last, unit });
      if (continueValueAgrees(row, w)) continue;
      const stored = Number(row.continue_chapter), end = Number(row.chapter);
      const stands = curatedStandsByRuling(row, w, index, ruledContinue(s.id, row.episode));
      if (stands === 'ruled') { counts.keptRuled++; rows.push(`  ${s.id} ep ${row.episode}: KEPT — a curated continue by ruling (lib/rulings/curated-continues.ts: ${row.continue_chapter})`); continue; }
      if (stands === 'finale-above-unknown') {
        counts.keptFinale++;
        rows.push(`  ${s.id} ep ${row.episode}: KEPT — a researched finale value ${stored} above a walk that stopped at an unknown (${w.value}: no anchored row touches it; kind ${row.continue_kind ?? 'null'} → post_series)`);
        if (!DRY && row.continue_kind !== 'post_series') await db.from('chapter_anchors').update({ continue_kind: 'post_series' }).eq('series_id', s.id).eq('episode', row.episode);
        continue;
      }
      const bucket: 'hole' | 'clamp' | 'other' = w.value < end ? 'hole' : stored === end && w.value === end + 1 ? 'clamp' : 'other';
      if (stands === 'named-c1') {
        counts.keptC1++;
        rows.push(`  ${s.id} ep ${row.episode}: KEPT as a named C1 (stored ${stored} = END; kind ${row.continue_kind ?? 'null'} → open) — ${String(row.continue_note).slice(0, 80)}`);
        if (!DRY && row.continue_kind !== 'open') await db.from('chapter_anchors').update({ continue_kind: 'open' }).eq('series_id', s.id).eq('episode', row.episode);
        continue;
      }
      counts[bucket]++;
      const kind = w.stored ? w.kind : kindFor(w);
      // the note leads with the conversion TAG, never the healer's prefix — a manual row wearing a healer note is a ruling violation (C7)
      const note = `${TAG}: ${w.note.replace(WALK_PREFIX, '')} | was ${stored} [${row.continue_kind ?? '-'}]: ${String(row.continue_note ?? '').trim()}`.slice(0, 1200);
      rows.push(`  ${s.id} ep ${row.episode}: ${bucket.toUpperCase()} — ${stored} [${row.continue_kind ?? '-'}] → ${w.value} [${kind}] — ${w.note.replace(/^C2 walk \(2026-09-07\): /, '').slice(0, 100)}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').update({ continue_chapter: w.value, continue_kind: kind, continue_note: note, continue_source: 'manual' }).eq('series_id', s.id).eq('episode', row.episode);
        if (error) throw new Error(`${s.id} ep${row.episode}: ${error.message}`);
      }
    }
  }
  console.log(rows.join('\n'));
  console.log(`\n[convert-curated-continues] holes ${counts.hole}, straddle clamps ${counts.clamp}, other ${counts.other} — converted ${counts.hole + counts.clamp + counts.other}; kept: named C1 ${counts.keptC1}, researched finales above an unknown ${counts.keptFinale}, ruled ${counts.keptRuled}${DRY ? ' — DRY RUN, nothing written' : ''}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
