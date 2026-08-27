// Batch 19 wave 2 close — Sean's rulings of 2026-08-27 on the open pile
// (Cursor concurring): (1) Sailor Moon 167-168 ANCHOR under the pages line
// (the saint-seiya 29-30 shape; the A44 entry superseded) with ep 166
// tightened so Act 49's pages are claimed once each; (2) hells-paradise
// ep 25 → 89 [86] as a MANUAL anchor (A12: the four-page peek at ch 94 is a
// graft, and P8: the next continua re-derive must not put 94 back);
// (5) the duplicate watch-order entries @24.5 / @112.5 dropped. Idempotent;
// --dry-run prints every change.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-rulings-20260827.ts [--dry-run]
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation } from '../../lib/annotations';

const DRY = process.argv.includes('--dry-run');
const B18 = 'scripts/ingest/research/batch18';
const B = 'Sean ruling 2026-08-27 (batch 19 wave 2 close; batch-18 sailor-moon verdict, verified R24)';

async function main() {
  const runId = await startRun('resolve');
  const lines: string[] = [];
  try {
    // (1) sailor-moon
    const sm = [
      { episode: 167, chapter: 44, start: 38, adapted: '38 (tail: high-school entry, Chibiusa\'s aborted departure, the Outers taking in Hotaru), 44 (opening: the Outers\' household, Hotaru\'s growth, Uranus/Neptune/Pluto powered up)', volume: null, note: `${B}: FIRST-TIME pages of Acts SuperS skipped — sailormoon.fandom 'This episode is based on part of Act 38'; the Super-form / Sailor-Crystal beats are Act 44 (ja-WP 土萠ほたる). Mixed, substantial (not a sliver); behind ep 166's Act 49 → rearranged (A41), the saint-seiya 29-30 shape under 'pages, not numbers'. Verifier F2: the Moon-swallowed vision is ep 168's. Volume left null (the stored boundaries end at v10 of the shinsōban space; P6). <${B18}/out/sailor-moon.json ; ${B18}/verify/sailor-moon.md>` },
      { episode: 168, chapter: 49, start: 44, adapted: '44 (core: Saturn re-awakens Hotaru, Super Sailor Saturn, the ten guardians unite), 48-49 (the Eternal beat: the nine pour their power into Sailor Moon — Eternal Sailor Moon, the Eternal Tiare, Starlight Honeymoon Therapy Kiss)', volume: null, note: `${B}: sailormoon.fandom 'Half of this episode is based on Act 44'; ja-WP dates every Eternal item/form to 原作第4部 and to スターズ. The Eternal attainment lands HERE, not at ep 166 (en-WP; fandom 166 has no Eternal) — so ep 166 is tightened to Act 49's outcome and this row claims 48-49's Eternal pages first-time. Verifier F3: the Eternal Moon Article is anime-only (manga = Holy Moon Chalice). Rearranged (A41). <${B18}/out/sailor-moon.json ; ${B18}/verify/sailor-moon.md>` },
    ];
    for (const a of sm) {
      lines.push(`  ANCHOR sailor-moon ep${a.episode}: NEW → ${a.chapter} [${a.start}] (manual)`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').upsert({ series_id: 'sailor-moon', episode: a.episode, chapter: a.chapter, start_chapter: a.start, chapters_adapted: a.adapted, volume: a.volume, source: 'manual', note: a.note.slice(0, 900) }, { onConflict: 'series_id,episode' }); if (error) throw new Error(error.message); }
    }
    const cur166 = (await selectAll<{ chapters_adapted: string | null; note: string | null }>('chapter_anchors', 'chapters_adapted, note', (q) => q.eq('series_id', 'sailor-moon').eq('episode', 166)))[0];
    lines.push(`  ADAPTED sailor-moon ep166: "${cur166?.chapters_adapted}" → "48-49 (Act 49's OUTCOME — the Nehelenia defeat; the Eternal attainment of 48-49 lands at ep 168)"`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').update({ chapters_adapted: "48-49 (Act 49's OUTCOME — the Nehelenia defeat; the Eternal attainment of 48-49 lands at ep 168)", note: `${(cur166?.note ?? '').slice(0, 500)} | TIGHTENED ${B}: ep 166 renders the Nehelenia defeat (Act 49's outcome) but NOT the Act 48-49 payload — the Holy Moon Chalice / Eternal Sailor Moon / Eternal Tiare / Starlight Honeymoon Therapy Kiss land in ep 168 (Sailor Moon is still Super here). END 49 stands for its own pages; 168 claims the Eternal pages first-time.`.slice(0, 900) }).eq('series_id', 'sailor-moon').eq('episode', 166); if (error) throw new Error(error.message); }
    for (const c of [
      { episode: 167, chapter: 44, note: 'C2 parity inside the ruled 167-168 backfill: ep 168 continues Act 44 (its core) — resume in 44.' },
      { episode: 168, chapter: 50, note: "C2/C5: the Nehelenia block (169-172) is anime-original filler; the Stars adaptation proper resumes at ep 173 = Act 50 (Mamoru's departure, the Starlights). After 168 every Act through 49 has been animated in some form (38/44 here, 45 and 47 loosely at 170-172); next unseen = 50." },
    ]) {
      lines.push(`  CONTINUE sailor-moon ep${c.episode} → ${c.chapter}/parity`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').update({ continue_chapter: c.chapter, continue_kind: 'parity', continue_note: `${B}: ${c.note}`.slice(0, 600) }).eq('series_id', 'sailor-moon').eq('episode', c.episode); if (error) throw new Error(error.message); }
    }
    // (2) hells-paradise ep 25 — manual (P8), A12 graft for the ch-94 peek
    const hp = (await selectAll<{ chapter: number; source: string }>('chapter_anchors', 'chapter, source', (q) => q.eq('series_id', 'hells-paradise').eq('episode', 25)))[0];
    lines.push(`  ANCHOR hells-paradise ep25: ${hp?.chapter} (${hp?.source}) → 89 [86] v10 (manual)`);
    if (!DRY) { const { error } = await db.from('chapter_anchors').upsert({ series_id: 'hells-paradise', episode: 25, chapter: 89, start_chapter: 86, chapters_adapted: '86-89 (plus a 3-page relocated sliver of ch 71 and a 4-page peek at ch 94 — see annotations)', volume: 10, source: 'manual', continue_chapter: 90, continue_kind: 'post_series', continue_note: `${B}: C5 post-series = AFG's own resume point ('start reading from Chapter 90'); ch 94's four pages (p. 11-14) were a peek, not coverage — skip nothing.`, note: `Sean ruling 2026-08-27 (A12 + P8): AFG's continua sentence reads 'Chapter 71 (p. 1-3), 86, 87, 88, 89 y 94 (p. 11-14) … start reading from Chapter 90' — the season ends inside ch 89; ch 94's four pages are a pull-forward PEEK (a graft, never the END) and ch 71's three pages a relocated sliver (never the START, A10/A12). The continua parser's max-of-the-list read 94 (2026-08-27 parser fix); a MANUAL anchor so the next afg-continua re-derive keeps precedence (P8). Vol 10 = 87-96 (stored boundaries); 86 is v9's last chapter — START by the block's lead (A10). <scripts/ingest/research/batch19/WAVE2-RECOVERY.md §APPLIED>` }, { onConflict: 'series_id,episode' }); if (error) throw new Error(error.message); }
    lines.push('  ANN hells-paradise ep25 graft {94 (p. 11-14)}');
    if (!DRY) await upsertAnnotation({ series_id: 'hells-paradise', episode: 25, kind: 'graft', chapters: '94 (p. 11-14), 71 (p. 1-3)', note: `${B}: the season finale pulls four pages of ch 94 forward as a peek and re-stages three pages of ch 71; neither moves position (A12) — END 89, resume 90 (AFG's own guidance).`, origin: 'research' });
    // (5) duplicate watch-order entries
    for (const [sid, pos, keep, sentence] of [['to-love-ru-darkness', 24.5, 24.1, "2nd Specials = standalone bonuses; community count = 24 (Sean sign-off 2026-08-23)"], ['yu-yu-hakusho-ghostfiles', 112.5, 112.1, 'Picture Drama = standalone bonus; community count = 112 (Sean sign-off 2026-08-23)']] as const) {
      lines.push(`  DROP fractional ${sid}@${pos} (duplicate of @${keep}); note carried`);
      if (!DRY) {
        const cur = (await selectAll<{ note: string | null }>('ingest_fractionals', 'note', (q) => q.eq('series_id', sid).eq('position', keep)))[0];
        const { error: e1 } = await db.from('ingest_fractionals').update({ note: `${cur?.note ?? ''} | ${sentence}; the duplicate @${pos} entry (same AniList work) dropped 2026-08-27 (Sean).`.slice(0, 900) }).eq('series_id', sid).eq('position', keep); if (e1) throw new Error(e1.message);
        const { error: e2 } = await db.from('ingest_fractionals').delete().eq('series_id', sid).eq('position', pos); if (e2) throw new Error(e2.message);
        const { error: e3 } = await db.from('watch_order_entries').delete().eq('series_id', sid).eq('position', pos); if (e3) throw new Error(e3.message);
      }
    }
    console.log(lines.join('\n'));
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DRY ? 0 : lines.length, flagged: 0 }, `rulings 2026-08-27${DRY ? ' dry' : ''}`);
  } catch (e) { await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200)); throw e; }
}
main().then(() => process.exit(0));
