// Batch 20 wave 8 — the curated apply (P10). Sean ruled 2026-09-02
// (WAVE8-RECOVERY §THE DECISIONS, "full set, ready to proceed"): the eight
// L-D / A1 verdicts fold as delivered — every anchor re-lands at the MANUAL
// tier (P8: the mu pins they replace would re-derive), the repairs ride the
// anchor write (made-in-abyss 25 → 26, orient 113 → 115, handa-kun vol 7 → 6,
// ranking-tcoc 155 v12 → 161 v13), every continue goes through
// writeCuratedContinue (C7), annotations through upsertAnnotation. Row-less
// targets (orient — zero rows; one-piece-log 7-21 — AFL lag) land as A42
// anchor_without_row by ruling (research runs ahead of rows). ENDs are
// normalized through lib/sliver.ts#sliverEnd (A47, the END-side sliver rule
// Sean ruled this wave: one-piece-log ep 10 618 → 617 because ep 11 starts on
// 618 and ep 10 holds only pp 3-4; orient ep 12 stays 46 as delivered) — the
// gate does the ruling, the dry run prints every move. Types (T6), dates and
// titles (G53) are MAP entries asserted by the healers, not row writes here.
// The verifier's ranking-tcoc note edits (F2/F3: strike the 1A and 5C
// candidates, 8A confirmed, 8B an opening beat) are the NOTE_OVERRIDE
// overlay. Flags #687 / #698 / #769 (three "no edition" questions the
// verdicts answered) are dismissed with their answers. Idempotent; --dry-run
// prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave8.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';
import { sliverEnd } from '../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const B = 'batch 20 wave 8 (2026-09-02; Sean ruled)';
const FILES: [string, string][] = [
  ['uq-holder.json', 'uq-holder'],
  ['pluto.json', 'pluto'],
  ['made-in-abyss.json', 'made-in-abyss'],
  ['orient.json', 'orient'],
  ['one-piece-log-fish-man-island-saga.json', 'one-piece-log-fish-man-island-saga'],
  ['masamune-kun-s-revenge.json', 'masamune-kun-s-revenge'],
  ['handa-kun.json', 'handa-kun'],
  ['ranking-of-kings-the-treasure-chest-of-courage.json', 'ranking-of-kings-the-treasure-chest-of-courage'],
];

// The verifier's chapter-map corrections (verify/ranking-…md F2/F3): the stored fact keeps the confirmed pairing and drops the contradicted candidate.
const NOTE_OVERRIDE: Record<string, { chapters?: string; note: string }> = {
  'ranking-of-kings-the-treasure-chest-of-courage#1#side_story': {
    chapters: "vol 8 描き下ろし bonus chapter (MangaDex 104.5, 'Despa's investment') for segment B 王子とお金",
    note: "Segment B adapts the vol-8 tankōbon bonus chapter (pixiv 「原作は単行本8巻の書き下ろし」; MangaDex 104.5 in vol 8). Segment A カゲのおつかい is anime-original (pixiv オリジナルエピソード — the vol-5 'A Safe Haven' candidate was refuted by the verifier). A tankōbon bonus chapter is part of the SOURCE but carries no mainline number — side_story, never side_source; the row is mixed (T27).",
  },
  'ranking-of-kings-the-treasure-chest-of-courage#8#side_story': {
    chapters: "vol 10 描き下ろし (MangaDex 129.5, 'Aspiracion') for segment A カゲのあこがれ",
    note: "Segment A adapts the vol-10 tankōbon bonus chapter (pixiv 「単行本10巻書き下ろし」; es-la 129.5 'aspiracion') — confirmed by the verifier. Segment B 偉大な母 is anime-original (pixiv オリジナルエピソード); at most its opening beat is shared with the vol-1 bonus (a remake of Bosse and Sheena's first meeting) — the vol-1 bonus is NOT the segment's source. The row is mixed (T27).",
  },
};
// A47: the tail the normalizer moved off the END is named on the row as a partial (the orient ep-12 shape)
const ANNOTATION_ADD: { sid: string; episode: number; kind: AnnotationKind; chapters: string; note: string }[] = [
  { sid: 'one-piece-log-fish-man-island-saga', episode: 10, kind: 'partial', chapters: '618 (pp. 3-4)', note: "A47 (Sean 2026-09-02): the episode's last two pages are ch 618 pp 3-4; ep 11 starts on 618 and re-shows them — the tail is ep 11's chapter, END stays 617 (the continue is IN 618, C1)." },
];
// Three "no edition" questions the wave-8 verdicts answered (flag id → the answer)
const FLAGS_DISMISS: [number, string][] = [
  [687, 'uq-holder: no edition fork — MU says 28 volumes complete and its Vol 14 / Chap 134 matches Kodansha\'s vol-14 TOC; latest_chapter 130 is a release-record artifact (wave 8 verdict).'],
  [698, 'handa-kun: no second edition — MU\'s 20 = the English scanlation\'s stopping point; AniList\'s 35 = 31 mainline + 4 vol-7 post-completion extras, our stored space (wave 8 verdict).'],
  [769, 'orient: no edition split — one continuous space 1-156 / 22 vols across the WSM → Bessatsu move (Kodansha 初出 per volume, ja-WP 全156話, MangaDex); MU\'s 121 is its scanlation release ceiling (wave 8 verdict, verified).'],
];

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let anchors = 0, normalized = 0, continues = 0, annos = 0;
  for (const [f, sid] of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    if (v.series_id !== sid) throw new Error(`${f}: ${v.series_id}`);
    const sorted = [...(v.anchors ?? [])].sort((x: any, y: any) => Number(x.episode) - Number(y.episode));
    for (let i = 0; i < sorted.length; i++) {
      const a = sorted[i];
      const next = sorted[i + 1];
      const nextStart = next ? Number(next.start_chapter ?? next.end_chapter) : null;
      const verdict = sliverEnd(a.chapters_adapted, Number(a.end_chapter), nextStart);
      const moved = verdict.end !== Number(a.end_chapter);
      if (moved) normalized++;
      const row = {
        series_id: sid,
        episode: Number(a.episode),
        chapter: verdict.end,
        start_chapter: a.start_chapter != null ? Number(a.start_chapter) : null,
        chapters_adapted: a.chapters_adapted ?? null,
        volume: a.volume != null ? Number(a.volume) : null,
        source: 'manual',
        note: `${moved ? `A47: END normalized ${a.end_chapter} → ${verdict.end} (the ${verdict.pages}-page tail of ch ${verdict.tailChapter} is ep ${next.episode}'s, which starts on it). ` : ''}${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600),
      };
      console.log(`  anchor ${sid} ep ${row.episode} → ${row.start_chapter ?? '·'}-${row.chapter}${row.volume ? ` v${row.volume}` : ''}${moved ? ` (A47 normalized from ${a.end_chapter})` : ''}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' });
        if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`);
      }
      anchors++;
    }
    for (const c of v.continue_points ?? []) {
      console.log(`  continue ${sid} ep ${c.episode} → ${c.continue_chapter} (${c.kind})`);
      if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: Number(c.continue_chapter), kind: c.kind, note: `${c.note ?? c.why ?? ''} ${B}` });
      continues++;
    }
    for (const a of v.annotations ?? []) {
      for (const ep of a.episodes as number[]) {
        const o = NOTE_OVERRIDE[`${sid}#${ep}#${a.kind}`];
        const chapters = o?.chapters ?? a.chapters ?? null;
        const note = o ? `${o.note} [verifier F2/F3; ${B}]` : `${a.note} [${B}]`;
        console.log(`  annotation ${sid} ep ${ep} ${a.kind}${chapters ? `{${String(chapters).slice(0, 40)}}` : ''}${o ? ' (overlay: verifier note)' : ''}`);
        if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters, note: note.slice(0, 1200), origin: 'research' });
        annos++;
      }
    }
  }
  for (const a of ANNOTATION_ADD) {
    console.log(`  annotation ${a.sid} ep ${a.episode} ${a.kind}{${a.chapters}} (overlay: A47)`);
    if (!DRY) await upsertAnnotation({ series_id: a.sid, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${a.note} [${B}]`, origin: 'research' });
    annos++;
  }
  for (const [id, why] of FLAGS_DISMISS) {
    console.log(`  dismiss flag #${id}: ${why.slice(0, 80)}…`);
    if (!DRY) {
      const { error } = await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: new Date().toISOString() }).eq('id', id).eq('status', 'open');
      if (error) throw new Error(`flag #${id}: ${error.message}`);
    }
  }
  console.log(`[apply-wave8] ${anchors} anchors (${normalized} A47-normalized), ${continues} continues, ${annos} annotations, ${FLAGS_DISMISS.length} flags dismissed${DRY ? ' — DRY RUN' : ''}. Types (T6) + dates/titles (G53): assert-overrides in the heal roster, then census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: anchors + continues + annos, flagged: 0 }, `apply-wave8: ${anchors} anchors (${normalized} A47), ${continues} continues, ${annos} annotations`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
