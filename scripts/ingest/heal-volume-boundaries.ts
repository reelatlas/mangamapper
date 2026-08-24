// Volume-boundary healer — enforces the MONOTONIC-START rule (Sean's Sailor
// Moon "v3: chs 10-3" report, 2026-08-24) over STORED rows, the same rule
// lib/wikipedia.ts boundariesWithDrops applies at parse time.
//
// Why this exists: every boundary row's chapter_end is derived from the next
// volume's chapter_start, so ONE mis-parsed start yields an impossible row
// (end < start) and corrupts volume readouts for every chapter after it. The
// row is a parse artifact, not data: drop it and let the neighbours re-close
// around the gap. A coarser self-consistent table beats a contradictory one
// (the Ippo v61 partial-boundary principle).
//
// Idempotent: re-running after a clean pass changes nothing. Research-tier
// rows (source != 'wikipedia') are AUTHORITATIVE — when a research row is the
// one that breaks monotonicity the wikipedia neighbour is dropped instead, and
// a research row is never deleted by this healer.
//   npx tsx --env-file=.env.ingest scripts/ingest/heal-volume-boundaries.ts [--dry-run]

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';

const DRY = process.argv.includes('--dry-run');

type Row = {
  manga_anilist_id: number;
  volume: number;
  chapter_start: number;
  chapter_end: number | null;
  source: string | null;
};

async function main() {
  const rows: Row[] = [];
  for (let f = 0; ; f += 1000) {
    const { data } = await db
      .from('volume_boundaries')
      .select('manga_anilist_id, volume, chapter_start, chapter_end, source')
      .range(f, f + 999);
    rows.push(...((data ?? []) as Row[]));
    if (!data || data.length < 1000) break;
  }
  const byManga = new Map<number, Row[]>();
  for (const r of rows) {
    const list = byManga.get(r.manga_anilist_id) ?? [];
    list.push(r);
    byManga.set(r.manga_anilist_id, list);
  }
  const { data: series } = await db.from('series').select('id, manga_anilist_id');
  const seriesOf = new Map<number, string[]>();
  for (const s of series ?? []) {
    if (!s.manga_anilist_id) continue;
    const list = seriesOf.get(s.manga_anilist_id) ?? [];
    list.push(s.id);
    seriesOf.set(s.manga_anilist_id, list);
  }

  const runId = DRY ? -1 : await startRun('resolve');
  const report: string[] = [];
  let healedManga = 0;
  let deleted = 0;
  let reclosed = 0;
  try {
    for (const [mangaId, list] of byManga) {
      const sorted = [...list].sort((a, b) => a.volume - b.volume);
      // pass 1: which rows are the parse ARTIFACTS? A greedy left-to-right
      // scan picks the wrong victim whenever the bad row comes first (Fairy
      // Tail v8 parsed as starting at 71 would evict the perfectly good v9 at
      // 66). The principled answer is the maximum-weight strictly increasing
      // subsequence of chapter_start: keep the largest coherent run, drop the
      // outliers. Research rows carry a heavy weight so they are never the
      // ones dropped (they are the trusted tier).
      // weights: research rows are the trusted tier and are never dropped;
      // among equal-LENGTH chains prefer keeping rows that are not themselves
      // impossible (Fairy Tail's v8 "71-65" is the artifact, not the v9 "66-74"
      // it collides with). Count still dominates — the bonus only breaks ties.
      const selfDegenerate = (r: Row) => r.chapter_end != null && r.chapter_end < r.chapter_start;
      const w = (r: Row) => ((r.source ?? 'wikipedia') !== 'wikipedia' ? 1000 : selfDegenerate(r) ? 1 : 1.1);
      const best = sorted.map(() => 0);
      const from = sorted.map(() => -1);
      for (let i = 0; i < sorted.length; i++) {
        best[i] = w(sorted[i]);
        for (let j = 0; j < i; j++) {
          if (sorted[j].chapter_start < sorted[i].chapter_start && best[j] + w(sorted[i]) > best[i]) {
            best[i] = best[j] + w(sorted[i]);
            from[i] = j;
          }
        }
      }
      let tail = 0;
      for (let i = 1; i < sorted.length; i++) if (best[i] > best[tail]) tail = i;
      const keepIdx = new Set<number>();
      for (let i = tail; i >= 0; i = from[i]) {
        keepIdx.add(i);
        if (from[i] === -1) break;
      }
      const kept = sorted.filter((_, i) => keepIdx.has(i));
      const drop = sorted.filter((_, i) => !keepIdx.has(i));
      // pass 2: re-close ONLY the ends that are actually broken — degenerate
      // (end < start), overlapping the next volume, or null with a successor.
      // A valid end is left alone: Tokyo Ghoul :re v3 legitimately ends at ch
      // 31 while v4 opens on the fractional 31.5, and "next start − 1" would
      // wrongly rewrite it to 30.5 and strand chapter 31.
      const endBefore = (nextStart: number) => (Number.isInteger(nextStart) ? nextStart - 1 : Math.floor(nextStart));
      const fixes: Row[] = [];
      for (let i = 0; i + 1 < kept.length; i++) {
        const cur = kept[i];
        const next = kept[i + 1];
        const broken = cur.chapter_end == null || cur.chapter_end < cur.chapter_start || cur.chapter_end >= next.chapter_start;
        if (!broken) continue;
        const want = endBefore(next.chapter_start);
        if (want >= cur.chapter_start) fixes.push({ ...cur, chapter_end: want });
      }
      // the FINAL volume has no successor to re-close against, so a degenerate
      // end there (Beelzebub v27 "234-0") can only be nulled — which is
      // precisely what an open final volume means in this table
      const last = kept[kept.length - 1];
      if (last && last.chapter_end != null && last.chapter_end < last.chapter_start) {
        fixes.push({ ...last, chapter_end: null });
      }
      if (!drop.length && !fixes.length) continue;
      healedManga++;
      const names = (seriesOf.get(mangaId) ?? ['(no series)']).join(', ');
      // WHOLESALE-GARBAGE rule (the Ippo v61 principle): when the coherent run
      // is a minority of the table, the parse failed for this manga — every
      // start is suspect (Urusei Yatsura had 12 volumes all claiming to start
      // at chapter 2). Keeping one arbitrary survivor would label real
      // chapters with a wrong volume forever; dropping the table lets the
      // ratio fallback take over honestly until research restores it.
      const research = sorted.filter((r) => (r.source ?? 'wikipedia') !== 'wikipedia');
      if (!research.length && kept.length * 2 < sorted.length) {
        report.push(`== manga ${mangaId} (${names}): WIPE — only ${kept.length}/${sorted.length} rows form a coherent run; the whole parse is untrustworthy`);
        if (!DRY) {
          const { error } = await db.from('volume_boundaries').delete().eq('manga_anilist_id', mangaId);
          if (error) throw new Error(`wipe ${mangaId}: ${error.message}`);
          deleted += sorted.length;
          await fileFlagOnce(runId, `manga:${mangaId}`, 'wikipedia', 'count_mismatch', {
            kind_of_note: 'boundary_parse_unusable',
            rows: sorted.length,
            note: `volume-boundary table WIPED: only ${kept.length} of ${sorted.length} rows had increasing chapter starts, so the Wikipedia parse failed wholesale for this manga. Volume display falls back to ratio until research seeds real boundaries. Series: ${names}`,
          });
        }
        continue;
      }
      report.push(`== manga ${mangaId} (${names}): drop ${drop.length}, re-close ${fixes.length}`);
      for (const d of drop) report.push(`   DROP v${d.volume} ${d.chapter_start}-${d.chapter_end} (${d.source}) — start does not exceed the previous volume's`);
      for (const f of fixes) report.push(`   RECLOSE v${f.volume} ${f.chapter_start}-${f.chapter_end} (was ${kept.find((k) => k.volume === f.volume)?.chapter_end})`);
      if (!DRY) {
        for (const d of drop) {
          const { error } = await db
            .from('volume_boundaries')
            .delete()
            .eq('manga_anilist_id', mangaId)
            .eq('volume', d.volume);
          if (error) throw new Error(`drop ${mangaId} v${d.volume}: ${error.message}`);
          deleted++;
        }
        for (const f of fixes) {
          const { error } = await db
            .from('volume_boundaries')
            .update({ chapter_end: f.chapter_end })
            .eq('manga_anilist_id', mangaId)
            .eq('volume', f.volume);
          if (error) throw new Error(`reclose ${mangaId} v${f.volume}: ${error.message}`);
          reclosed++;
        }
        // the table is now self-consistent but THINNER than the manga's real
        // volume list — flag for research so the true starts can be recovered
        await fileFlagOnce(runId, `manga:${mangaId}`, 'wikipedia', 'count_mismatch', {
          kind_of_note: 'boundary_parse_artifact',
          droppedVolumes: drop.map((d) => d.volume),
          note: `volume-boundary parse artifacts dropped (chapter_start not increasing — impossible rows). The remaining table is self-consistent but missing ${drop.length} volume boundary(ies); research can restore the true starts. Series: ${names}`,
        });
      }
    }
    console.log(report.join('\n') || 'no degenerate boundary rows — nothing to heal');
    console.log(`\n[heal-boundaries] ${healedManga} manga touched, ${deleted} row(s) dropped, ${reclosed} re-closed${DRY ? ' — DRY RUN, nothing written' : ''}`);
    if (!DRY) await finishRun(runId, 'ok', { fetched: rows.length, unchanged: rows.length - deleted - reclosed, changed: deleted + reclosed, flagged: healedManga }, `boundary heal: ${deleted} dropped, ${reclosed} re-closed across ${healedManga} manga`);
  } catch (e) {
    if (!DRY) await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
