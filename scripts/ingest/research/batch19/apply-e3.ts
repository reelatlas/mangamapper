// Batch 19 E3 — drift item A-6, the sliver-rule re-normalization (rule A10,
// 2026-08-26). Two ruled writes, BOTH held for Sean's signature (the
// DRIFT-LIST disposition: "deltas listed; Sean signs"):
//
//   1. START moves — every manual anchor whose stored START disagrees with
//      lib/sliver.ts over its own chapters_adapted record. Derived at run
//      time, never listed by hand: the catalog census (start_sliver_mismatch)
//      names the same rows. Batch-12 rows predate the rule (2026-08-23 s2);
//      batches 14+ normalized at apply.
//   2. SPAN RECORDS for the 27 batch-8/9 starts seeded by
//      history/apply-start-chapters.ts. Their verdict files never reached
//      git; the seeding script's inline comments are the only record of the
//      spans the agents documented, transcribed here verbatim as
//      chapters_adapted so the rows become PROVABLE (start_without_span → 0)
//      and the A10 derivation can run over them. Under A10 all 27 stand:
//      the three that open on a tail are 1-page scraps (oshi 34: 114 p.18;
//      jjk 34: 90 p.21) or already start on the partial (aot 73 "half of
//      112"; jjk 42 "120 p.7-19").
//
// Dry-run by default; `--apply` writes. Manual tier, so the values persist
// (P8). Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-e3.ts [--apply]
import { db, selectAll } from '../../lib/db';
import { sliverStart } from '../../lib/sliver';

const apply = process.argv.includes('--apply');

/** [series, episode, chapters_adapted as the seeding record states it] — history/apply-start-chapters.ts comments, verbatim */
const SEEDED_SPANS: [string, number, string][] = [
  ['oshi-no-ko', 20, '65-67'],
  ['oshi-no-ko', 24, '78-80 (+109 graft)'],
  ['oshi-no-ko', 28, '93-96'],
  ['oshi-no-ko', 30, '102-103'],
  ['oshi-no-ko', 34, '114 (p.18 tail), 115-118'],
  ['oshi-no-ko', 35, '119-127'],
  ['attack-on-titan', 64, '99-100'],
  ['attack-on-titan', 67, '105'],
  ['attack-on-titan', 68, '106'],
  ['attack-on-titan', 73, '112 (half), 113'],
  ['attack-on-titan', 74, '114'],
  ['jujutsu-kaisen', 34, '90 (p.21 tail), 91-93'],
  ['jujutsu-kaisen', 35, '94-97'],
  ['jujutsu-kaisen', 40, '113-116'],
  ['jujutsu-kaisen', 42, '120 (p.7-19), 121-122'],
  ['jujutsu-kaisen', 45, '129-132'],
  ['haikyu', 65, '212-215'],
  ['haikyu', 68, '220-222'],
  ['haikyu', 70, '225-228'],
  ['haikyu', 72, '231-234'],
  ['haikyu', 74, '243-246'],
  ['naruto', 110, '182-183'],
  ['naruto', 114, '189-191'],
  ['naruto', 117, '196-198'],
  ['naruto', 124, '211-212'],
  ['naruto', 127, '216-217'],
  ['naruto', 132, '226-228'],
];

const anchors = await selectAll<any>('chapter_anchors', 'series_id, episode, start_chapter, chapter, chapters_adapted, source, note', (q) => q.eq('source', 'manual'));
const key = (s: string, e: number) => `${s}#${e}`;
const byKey = new Map(anchors.map((a) => [key(a.series_id, a.episode), a]));

console.log(`== 1. START moves under A10 (derived from stored chapters_adapted)`);
let moves = 0;
for (const a of anchors) {
  if (a.start_chapter == null || !a.chapters_adapted) continue;
  const v = sliverStart(a.chapters_adapted, a.start_chapter);
  if (v.start === a.start_chapter) continue;
  moves++;
  console.log(`  ${a.series_id} ep ${a.episode}: start ${a.start_chapter} → ${v.start} (lead '${v.lead}', ≈${v.pages || '?'} pages, ${v.reason}) :: ${String(a.note ?? '').slice(0, 60)}`);
  if (apply) {
    const { error } = await db.from('chapter_anchors').update({ start_chapter: v.start }).eq('series_id', a.series_id).eq('episode', a.episode);
    if (error) throw new Error(error.message);
  }
}
console.log(`  ${moves} move(s)${apply ? ' applied' : ' (dry run)'}`);

console.log(`\n== 2. span records for the 27 seeded starts (A-6)`);
let spans = 0, already = 0, missing = 0;
for (const [sid, ep, adapted] of SEEDED_SPANS) {
  const a = byKey.get(key(sid, ep));
  if (!a) { missing++; console.log(`  ${sid} ep ${ep}: NO manual anchor`); continue; }
  if (a.chapters_adapted) { already++; continue; }
  const v = sliverStart(adapted, a.start_chapter);
  console.log(`  ${sid} ep ${ep}: start ${a.start_chapter} end ${a.chapter} ← '${adapted}' → A10 says start ${v.start} (${v.reason})${v.start !== a.start_chapter ? '  !! WOULD MOVE — rule it' : ''}`);
  spans++;
  if (apply) {
    const { error } = await db.from('chapter_anchors').update({ chapters_adapted: adapted }).eq('series_id', sid).eq('episode', ep);
    if (error) throw new Error(error.message);
  }
}
console.log(`  ${spans} span record(s)${apply ? ' written' : ' (dry run)'}, ${already} already carry one, ${missing} missing`);
process.exit(0);
