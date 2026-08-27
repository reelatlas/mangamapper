// Batch 19 wave 2 close — Conan 513/584 re-cut under Sean's STRICT A4 line
// (2026-08-27: "Conan 513/584 → strict A4 now"; the narrow research check
// out/detective-conan-513-584.json, ConanWiki per-chapter summaries + ytv +
// DCW + ja-WP). 513 → 629 [628] (file 630 is entirely ep 514's); 514 → 630
// [629] as the companion anchor (the wave-2 ep-525 precedent, so the case's
// last file is a per-episode value); 584's END 708 CONFIRMED (file 708's
// opening plays in 584), START 705 → 706 (705 is ep 583's; 584 animates 706
// pages 583 skipped); three straddle annotations. Idempotent; --dry-run.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-conan-513-584.ts [--dry-run]
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation } from '../../lib/annotations';

const DRY = process.argv.includes('--dry-run');
const V = 'scripts/ingest/research/batch19/out/detective-conan-513-584.json';
const B = `research-tier batch 19 wave 2 close (2026-08-27, strict A4 — Sean's line; sources ConanWiki per-chapter pages via web.archive.org, ytv archive, DCW, ja-WP) <${V}>`;
const SID = 'detective-conan';

async function main() {
  const runId = await startRun('resolve');
  const L: string[] = [];
  try {
    const rows = [
      { episode: 513, chapter: 629, start: 628, adapted: '628-629 (629 straddled with ep 514)', volume: 60, note: `${B}: REPAIR END 630 → 629 — file 630 苦い真実 (the two cake slices, the coffee in the plant pot, the missing fork, the sleeping-Kogoro solution, Maiko's suicide) is entirely ep 514's; ep 513 ends mid-file 629 不可能犯罪 — Conan sees the floor stains do not match the chair legs and cannot yet explain the chained door (ConanWiki ch 629 / ep 513; ytv k20080901; DCW 'Conan wonders if this is an impossible crime' = 629's title). Batch 17 had written the case's last file onto the first part. [high]` },
      { episode: 514, chapter: 630, start: 629, adapted: '629-630 (629 straddled with ep 513)', volume: 60, note: `${B}: COMPANION anchor (the ep-525 precedent — otherwise file 630 is carried by no row). Ep 514 opens on 629's second half (the flat searched, Takagi checking Somei's alibi with the production company and the pharmacy clerk) and closes on 630 苦い真実 (the cake slices, the coffee-smelling plant and pen cup, the missing fork, Somei's false confession, the sleeping-Kogoro solution, Maiko's suicide) — ConanWiki ch 629/630 against ytv k20080908 and DCW's Part 2. A10 START 629: a substantial leading partial, not a sliver. [high]` },
      { episode: 584, chapter: 708, start: 706, adapted: '706-708 (706 straddled with ep 583; 708 straddled with ep 585)', volume: 68, note: `${B}: END 708 CONFIRMED under strict A4 — file 707 ends on Kobayashi hurrying off with a hooded figure watching; file 708 桜、満開 OPENS with the Detective Boys stopping Shiratori, the fake-policeman phone call, the music-room walk and the attack from behind = ep 584's closing block (ConanWiki ch 707/708 + ep 584; ytv k20100821; DCW). REPAIR START 705 → 706: file 705 小林先生の恋 is entirely ep 583's; ep 584 opens on 706 material ep 583 skipped (the victim's true sex, the three suspects' motives, restaged as a Megure interrogation). Soft edge: if that opening block is read as a restaging of ground ep 583 covered, A10 gives START 707 — the END is unaffected. Ep 585's 712 [708] stands: 708 genuinely straddles 584/585. [high]` },
    ];
    for (const a of rows) {
      const cur = (await selectAll<any>('chapter_anchors', 'chapter, start_chapter, source', (q) => q.eq('series_id', SID).eq('episode', a.episode)))[0];
      L.push(`  ANCHOR conan ep${a.episode}: ${cur ? `${cur.chapter} [${cur.start_chapter}] (${cur.source})` : 'NEW'} → ${a.chapter} [${a.start}] v${a.volume}`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').upsert({ series_id: SID, episode: a.episode, chapter: a.chapter, start_chapter: a.start, chapters_adapted: a.adapted, volume: a.volume, source: 'manual', note: a.note.slice(0, 900) }, { onConflict: 'series_id,episode' }); if (error) throw new Error(error.message); }
    }
    // continues: 513's 613 stands (A18 regime); its skip list drops 630; 514 shares it (curated — the healer cannot derive one: 515/516 are unanchored canon)
    const c513 = (await selectAll<any>('chapter_anchors', 'continue_note', (q) => q.eq('series_id', SID).eq('episode', 513)))[0];
    const n513 = String(c513?.continue_note ?? '').replace('628-630', '628-629');
    L.push(`  CONTINUE conan ep513 note: 628-630 → 628-629 (${n513 !== c513?.continue_note ? 'changed' : 'unchanged'})`);
    L.push('  CONTINUE conan ep514 → 613/parity (A18: the next unseen block 613-618 at eps 516-517; skip on arrival 619-630)');
    if (!DRY) {
      await db.from('chapter_anchors').update({ continue_note: n513.slice(0, 600) }).eq('series_id', SID).eq('episode', 513);
      const { error } = await db.from('chapter_anchors').update({ continue_chapter: 613, continue_kind: 'parity', continue_note: `${B}: A18 reorder regime, same as eps 510-513 — after ep 514 every chapter below 613 has been animated; 613-618 (eps 516-517) are the next unseen block. C3 skip on arrival: 619-630 (furthest chapter animated by this point: 640).`.slice(0, 600) }).eq('series_id', SID).eq('episode', 514); if (error) throw new Error(error.message);
    }
    for (const [eps, ch, note] of [
      [[513, 514], '629', "File 629 不可能犯罪 straddles the 513/514 boundary: ep 513 stops after Conan shows the floor stains do not match the chair legs and calls the crime impossible; ep 514 resumes inside the same file with Megure ordering the flat searched and Takagi checking Somei's alibi. Only ep 513's coverage is first-time for 628-629."],
      [[583, 584], '706', "File 706 小林先生の誤解 straddles the 583/584 boundary in the OTHER direction: ep 583 runs to the end of 706 (Kobayashi overhears the officers; Ayumi and Ai find her collapsed) and ep 584 re-opens on that beat, then animates 706 pages ep 583 skipped (the victim's true sex, the three suspects' motives) — why ep 584's START is 706, not 707 and not the case-block 705."],
      [[584, 585], '708', "File 708 桜、満開 straddles the 584/585 boundary: ep 584 carries its opening (the Detective Boys stopping Shiratori, the fake-policeman call, the walk to the music room, the attack from behind); ep 585 re-opens on the walk and plays the ambush, Sato's reveal, the solution and Shiratori's confession. Confirms the batch-19 ep-585 anchor 712 [708]."],
    ] as const) {
      for (const ep of eps) { L.push(`  ANN conan ep${ep} partial {${ch}}`); if (!DRY) await upsertAnnotation({ series_id: SID, episode: ep, kind: 'partial', chapters: ch, note: `${B}: ${note}`.slice(0, 900), origin: 'research' }); }
    }
    console.log(L.join('\n'));
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DRY ? 0 : L.length, flagged: 0 }, `conan 513/584 strict A4${DRY ? ' dry' : ''}`);
  } catch (e) { await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200)); throw e; }
}
main().then(() => process.exit(0));
