// Research batch 4 — part-boundary anchors for the airing trio (agent
// research 2026-08-23, 2+ sources each; URLs in notes). Also TYBW premise
// corrections: manga number-space ends at 686 (scope lever), Part 3 = eps
// 27-40.
import { db, startRun, finishRun } from './lib/db';
const now = () => new Date().toISOString();
async function main() {
  const runId = await startRun('resolve');
  try {
    const anchor = async (sid: string, ep: number, ch: number, note: string) => {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, volume: null, source: 'manual',
        note: `research-tier (2026-08-23, agent-verified 2+ sources): ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
      console.log(`  ${sid} ep ${ep} → ch ${ch}`);
    };
    // TYBW: scope end 686 (number space; AniList's 706 is count space)
    await db.from('series_scopes').update({ end_chapter: 686, end_volume: 74, note: 'final arc ch 480-686 (adaptation + manga number-space end; AniList 705/706 = count space). Research 2026-08-23' }).eq('afl_slug', 'bleach-thousand-year-blood-war');
    await db.from('series').update({ total_chapters: 686, updated_at: now() }).eq('id', 'bleach-thousand-year-blood-war');
    await anchor('bleach-thousand-year-blood-war', 13, 542, 'Part 1 (The Blood Warfare) finale adapts 538-542. Wikipedia + sportskeeda');
    await anchor('bleach-thousand-year-blood-war', 26, 609, 'Part 2 (The Separation) covered 543-609, ends partway into 609. culturehub + sportskeeda');
    await anchor('bleach-thousand-year-blood-war', 40, 661, 'Part 3 (The Conflict) = eps 27-40 (hour-long double finale), ends at ch 661 p.10. sportskeeda x2 + cbr. Part 4 (eps 41-50) airing — do not anchor until finale');
    await db.from('series').update({ continue_from_chapter: 661, updated_at: now() }).eq('id', 'bleach-thousand-year-blood-war');
    // Railgun: T finale
    await anchor('a-certain-scientific-railgun', 73, 96, 'Railgun T finale = end of Dream Ranker arc (chs 71-97; magazine 96/97 merged in volume — conservative 96, continue at 98). toaru wiki x3');
    await db.from('series').update({ continue_from_chapter: 98, updated_at: now() }).eq('id', 'a-certain-scientific-railgun');
    // Tokyo Revengers: three season boundaries
    await anchor('tokyo-revengers', 24, 73, 'S1 finale = ch 73 "A Cry Baby" (ch 64 epilogue skipped). dualshockers + mangashed + animecorner');
    await anchor('tokyo-revengers', 37, 121, 'S2 Christmas Showdown end = ch 121. afteranime + mangashed');
    await anchor('tokyo-revengers', 50, 185, 'S3 Tenjiku end = ch 185 (manga arc runs to 188; anime stopped at 185), continue at 186 / vol 21. mangashed + animecorner + dualshockers');
    await db.from('series').update({ continue_from_chapter: 186, updated_at: now() }).eq('id', 'tokyo-revengers');
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: 3, flagged: 0 }, 'research batch 4: airing-trio part boundaries (TYBW/Railgun/Tokyo Revengers)');
    console.log('=== BATCH 4 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error('FAIL:', e.message ?? e); process.exit(1); });
