// PARITY CONTINUE CONVERSION (Sean's C2 ruling, 2026-08-24): where the
// anime's next step is KNOWN (the next canon/mixed episode has an exact
// record), continue_chapter = the chapter that keeps the reader in step with
// the anime — the next episode's start — even when chapters were skipped;
// what a chronological reader would miss is preserved in continue_note.
// Rules:
//   - Only research-grade pairs convert: anchor A → anchor B where B is the
//     IMMEDIATELY next canon/mixed episode row and B's start is known
//     (start_chapter or chapters_adapted first value). Interpolated regions
//     keep default end+1 semantics.
//   - parity == stored continue → stamp continue_kind 'parity' (no note).
//   - parity == end+1 and no stored continue → untouched (default is right).
//   - LAST anchor of a finished series with a stored continue → kind
//     'post_series' (coverage+1 semantics; ippo 558, dragon-maid 65).
//   - loose series skipped (borrow-maps).
// Re-runnable. --dry-run prints every change without writing.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch15/apply-parity-continues.ts [--dry-run] [seriesId ...]
import { db, selectAll } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/db';
import { c3Ahead, hasSkipLanguage, c3Note } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/c3';

const DRY = process.argv.includes('--dry-run');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));

const firstNum = (s: string | null): number | null => {
  const m = String(s ?? '').match(/\d+(?:\.\d+)?/);
  if (!m) return null;
  const n = Number(m[0]);
  return Number.isInteger(n) ? n : Math.floor(n);
};

async function main() {
  const seriesRows = await selectAll<{ id: string; status: string; mapping_mode: string | null; source_type: string | null; manga_status: string | null }>(
    'series',
    'id, status, mapping_mode, source_type, manga_status',
    (q) => q.neq('mapping_mode', 'loose'),
  );
  const targets = seriesRows.filter((s: any) => (ONLY.length ? ONLY.includes(s.id) : true))
    .filter((s: any) => s.source_type !== 'original' && s.manga_status !== 'anime_only');
  let converted = 0, stamped = 0, postSeries = 0;
  for (const s of targets) {
    const anchors = await selectAll<any>('chapter_anchors', 'episode, chapter, start_chapter, chapters_adapted, continue_chapter, continue_kind, source', (q) => q.eq('series_id', s.id).order('episode'));
    if (anchors.length < 2) continue;
    const eps = await selectAll<any>('episodes', 'number, type', (q) => q.eq('series_id', s.id).order('number'));
    const typeOf = new Map(eps.map((e: any) => [e.number, e.type]));
    const lines: string[] = [];
    for (let i = 0; i < anchors.length; i++) {
      const A = anchors[i];
      if (!Number.isInteger(A.episode)) continue;
      const B = anchors[i + 1];
      const isLast = !B;
      const effective = A.continue_chapter ?? A.chapter + 1;
      if (isLast) {
        // finale semantics: a stored continue on the run-end anchor of a
        // finished series is the post-series resume (coverage max + 1)
        if (s.status === 'finished' && A.continue_chapter != null && A.continue_kind !== 'post_series') {
          lines.push(`  ep${A.episode}: kind → post_series (continue ${A.continue_chapter})`);
          if (!DRY) await db.from('chapter_anchors').update({ continue_kind: 'post_series' }).eq('series_id', s.id).eq('episode', A.episode);
          postSeries++;
        }
        continue;
      }
      // B must be the immediately next canon/mixed EPISODE (no unanchored
      // canon/mixed row between) with a known start
      let adjacent = true;
      for (let n = A.episode + 1; n < B.episode; n++) {
        const t = typeOf.get(n);
        if (t === 'canon' || t === 'mixed' || t === undefined) { adjacent = false; break; }
      }
      if (!adjacent) continue;
      const bStart = A === B ? null : (B.start_chapter ?? firstNum(B.chapters_adapted));
      if (bStart == null || !Number.isInteger(B.episode)) continue;
      if (bStart === effective) {
        if (A.continue_chapter != null && A.continue_kind !== 'parity') {
          lines.push(`  ep${A.episode}: kind → parity (continue ${A.continue_chapter} already matches ep${B.episode} start)`);
          if (!DRY) await db.from('chapter_anchors').update({ continue_kind: 'parity' }).eq('series_id', s.id).eq('episode', A.episode);
          stamped++;
        }
        continue;
      }
      // parity differs from the stored/derived continue — convert, keep facts
      const unseenLo = Math.min(effective, A.chapter + 1);
      const skipNote =
        bStart > effective
          ? `chs ${effective}${bStart - 1 > effective ? `-${bStart - 1}` : ''} not yet seen at this point (chronological next-unseen was ${effective})`
          : bStart === A.chapter
            ? `ch ${bStart} straddles the episode boundary — ep ${B.episode} finishes it (mid-chapter rule: re-reading a few pages is fine)`
            : `anime jumps back: ep ${B.episode} opens at ch ${bStart} (chronological next-unseen stays ${effective})`;
      const note = `parity with anime (Sean C2 2026-08-24): ep ${B.episode} starts ch ${bStart}; ${skipNote}`.slice(0, 500);
      lines.push(`  ep${A.episode}: continue ${A.continue_chapter ?? `(default ${effective})`} → ${bStart} [parity] — ${skipNote.slice(0, 110)}`);
      if (!DRY) {
        const { error: e2 } = await db.from('chapter_anchors')
          .update({ continue_chapter: bStart, continue_kind: 'parity', continue_note: note })
          .eq('series_id', s.id).eq('episode', A.episode);
        if (e2) throw new Error(`${s.id} ep${A.episode}: ${e2.message}`);
      }
      converted++;
      void unseenLo;
    }
    if (lines.length) console.log(`== ${s.id}\n${lines.join('\n')}`);
  }

  // C3 SKIP-NOTE PASS (Sean's C3 ruling, 2026-08-25): when a continue point
  // legitimately sits BELOW chapters the same episode already covered (a
  // forward graft with parity-back-jump), the note must name the covered
  // chapters so the reader knows to skip them on arrival. Derived entirely
  // from stored chapters_adapted (parenthesized page facts stripped first);
  // idempotent — a note already carrying skip language is left alone.
  let c3 = 0;
  {
    // selectAll pages (P32) — the catalog holds >1000 continue-bearing anchors
    // and the client caps unpaged selects at 1000 (the audit caught exactly
    // this: 351 hits vs the 16 an unpaged first run saw)
    const all = await selectAll<{ series_id: string; episode: number; chapter: number | null; chapters_adapted: string | null; continue_chapter: number | null; continue_note: string | null }>(
      'chapter_anchors',
      'series_id,episode,chapter,chapters_adapted,continue_chapter,continue_note',
      (q) => q.not('continue_chapter', 'is', null).order('series_id').order('episode'),
    );
    for (const a of all) {
      if (ONLY.length && !ONLY.includes(a.series_id)) continue;
      const ahead = c3Ahead(a.chapters_adapted, a.continue_chapter);
      if (!ahead.length || hasSkipLanguage(a.continue_note)) continue;
      const note = c3Note(a.continue_note, ahead);
      console.log(`  C3 skip-note ${a.series_id} ep${a.episode}: continue ${a.continue_chapter}, covered-ahead ${ahead.join(',')}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').update({ continue_note: note }).eq('series_id', a.series_id).eq('episode', a.episode);
        if (error) throw new Error(`c3 ${a.series_id} ep${a.episode}: ${error.message}`);
      }
      c3++;
    }
  }
  console.log(`\n[parity] converted ${converted}, stamped ${stamped}, post-series ${postSeries}, c3-skip-notes ${c3}${DRY ? ' — DRY RUN, nothing written' : ''}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
