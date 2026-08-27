// Batch 19 close — Sean's rulings on the two cards (2026-08-27):
// rosario-vampire 12/13 (a): the stored values ALREADY equal the batch-17
// held repairs (12 = 9 [9], 13 = 10 [9]); confirm them and fix the lagging
// chapters_adapted strings. iruma-kun 63 (a): 145 [142] rearranged under
// the pages line (ch 145's pages air here first-time and are the episode's
// main job); continue parity 143 (ep 64's start). Idempotent; --dry-run.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-cards-20260827.ts [--dry-run]
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation } from '../../lib/annotations';
const DRY = process.argv.includes('--dry-run');
const CARDS = 'scripts/ingest/research/batch19/WAVE2-RECOVERY.md §CARDS';
async function main() {
  const runId = await startRun('resolve');
  const L: string[] = [];
  try {
    for (const r of [
      { episode: 12, adapted: '9', why: "CONFIRMED (Sean 2026-08-27, card a): ep 12 'Security Committee and a Vampire' = the arrest, the interrogation, Tsukune's confession, the death sentence = ch 9 'The Secret' (rosariovampire.fandom ch 9 + Wikipedia vol 3); the batch-17 held repair 10 → 9 stands; the stale chapters_adapted '10' (the off-by-one 'Adapted From' line) corrected." },
      { episode: 13, adapted: '9 (2nd half)-10 (heavily altered)', why: "CONFIRMED (Sean 2026-08-27, card a): ep 13 opens on the rescue attempt (ch 9's second movement) and runs the Kuyo fight to its end = ch 10 'The Gamble'; ch 11 'Blood' is not in S1 (one voice-over line — a sliver). The batch-17 held repairs (END 11 → 10, START 10 → 9) stand; chapters_adapted corrected from '10-11 (loose)'." },
    ]) {
      const cur = (await selectAll<any>('chapter_anchors', 'chapter, start_chapter, chapters_adapted, note', (q) => q.eq('series_id', 'rosario-vampire').eq('episode', r.episode)))[0];
      L.push(`  rosario ep${r.episode}: ${cur.chapter} [${cur.start_chapter}] "${cur.chapters_adapted}" → "${r.adapted}"`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').update({ chapters_adapted: r.adapted, note: `${String(cur.note ?? '').slice(0, 450)} | ${r.why} <${CARDS}>`.slice(0, 900) }).eq('series_id', 'rosario-vampire').eq('episode', r.episode); if (error) throw new Error(error.message); }
    }
    const cur63 = (await selectAll<any>('chapter_anchors', 'chapter, start_chapter, note', (q) => q.eq('series_id', 'welcome-to-demon-school-iruma-kun').eq('episode', 63)))[0];
    L.push(`  iruma ep63: ${cur63.chapter} [${cur63.start_chapter}] → 145 [142] v17 (rearranged)`);
    if (!DRY) {
      const { error } = await db.from('chapter_anchors').upsert({ series_id: 'welcome-to-demon-school-iruma-kun', episode: 63, chapter: 145, start_chapter: 142, chapters_adapted: '142 (the Ocho / Baal / Kiriwo half), 145 (教師陣の宴 — the bar party, the bulk; airs here FIRST, ahead of 143-144)', volume: 17, source: 'manual', continue_chapter: 143, continue_kind: 'parity', continue_note: "C2 parity (Sean 2026-08-27): ep 64 opens at ch 143 (its two halves are 144 then 143); ch 145 was already covered here — skip on arrival; ep 65 resumes at 147.", note: `Sean ruling 2026-08-27 (card a, the catalog line 'pages, not numbers'): ch 145's pages air here FIRST-TIME and are the episode's main job (the title 教師陣の宴 IS ch 145's; fandom chapter pages 142 and 145 both pin to Ep 63 — batch 17), so END 145 with START 142, rearranged (A41); ep 64 (143-144) is the documented back-step and ep 65's 147 the frontier. Batch 17's END 142 was the position-ladder (number) reading. Vol 17 per the stored ep-64 row (143-144 v17). ${String(cur63.note ?? '').slice(0, 300)} <${CARDS}>`.slice(0, 900) }, { onConflict: 'series_id,episode' }); if (error) throw new Error(error.message);
      await upsertAnnotation({ series_id: 'welcome-to-demon-school-iruma-kun', episode: 63, kind: 'rearranged', chapters: '145', note: "Sean 2026-08-27: ch 145 (the teachers' bar party) is animated at ep 63, ahead of chs 143-144 (ep 64) — first-time pages, so it carries the END (A41 settled reorder); ep 64 then steps back to 143-144.", origin: 'research' });
    }
    L.push('  ANN iruma ep63 rearranged {145}');
    console.log(L.join('\n'));
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DRY ? 0 : L.length, flagged: 0 }, `cards 2026-08-27${DRY ? ' dry' : ''}`);
  } catch (e) { await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200)); throw e; }
}
main().then(() => process.exit(0));
