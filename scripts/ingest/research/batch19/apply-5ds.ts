// Batch 19 wave 2 — yu-gi-oh-5d-s structure (Sean B4-4, 2026-08-27). The
// ruling is the SOURCE_NUMBERING_SHIFTS entry (drop AFL's film row 83, shift
// 84+ by −1, spaces ['afl']) + the RULED_RECORDS kind; this script executes
// it the way every N11 drop is executed (the dr-stone / dxd precedent):
// (1) the order-only record in ingest_fractionals (@82.5, the film, AniList
// 6951), (2) re-resolve the series so filterEpisodeRows drops row 83 and
// translates 84-155 → 83-154 (the stale row 155 is deleted by the ≤ ourMax
// stale-zone rule), (3) aired/total → 154 (the floor never lowers; the
// community count is 154) so the wiki backfill's countAligned guard holds,
// then the caller runs `wiki-episodes-backfill.ts yu-gi-oh-5d-s` to restore
// real ep 145 (AFL omits it) and the census's N11 outcome check proves
// contiguity. Idempotent.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-5ds.ts
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { resolveSeries } from '../../lib/resolve';

const SID = 'yu-gi-oh-5d-s';
const runId = await startRun('resolve');
try {
  const { error } = await db.from('ingest_fractionals').upsert({
    series_id: SID,
    position: 82.5,
    title: 'Yu-Gi-Oh!: Bonds Beyond Time (劇場版 遊☆戯☆王 ~超融合!時空を越えた絆~)',
    air_date: '2010-01-23',
    note: "The theatrical film (AniList 6951, MOVIE, 49 min, 2010-01-23) that AFL numbered into the TV run as row 83 — dropped under N11 (Sean 2026-08-27, batch 19 wave 2). Story position between ep 82 and ep 83: yugioh.fandom's film page (before Crash Town, Bruno present) and Katsumi Ono's tweet 「クラッシュタウン編」以前. Kind movie via RULED_RECORDS (T29).",
    source: 'ruling',
    disposition: 'order_only',
  });
  if (error) throw new Error(error.message);
  const { data: s } = await db.from('series').select('afl_slug, aired_episodes, total_episodes').eq('id', SID).maybeSingle();
  if (!s?.afl_slug) throw new Error(`${SID} has no afl_slug`);
  const r = await resolveSeries(runId, s.afl_slug);
  console.log('re-resolved:', JSON.stringify(r).slice(0, 300));
  const rows = await selectAll<{ number: number; title: string; air_date: string | null }>('episodes', 'number, title, air_date', (q) => q.eq('series_id', SID).order('number'));
  const max = rows.reduce((m, e) => Math.max(m, e.number), 0);
  const show = (n: number) => { const e = rows.find((x) => x.number === n); return e ? `${n} "${e.title}" ${e.air_date}` : `${n} (missing)`; };
  console.log('rows:', rows.length, 'max:', max);
  for (const n of [82, 83, 84, 96, 100, 120, 134, 144, 145, 146, 147, 153, 154, 155]) console.log('  ', show(n));
  const holes: number[] = [];
  for (let i = 1; i <= max; i++) if (!rows.some((e) => e.number === i)) holes.push(i);
  console.log('holes:', holes.join(', ') || 'none');
  const { data: s2 } = await db.from('series').select('aired_episodes, total_episodes').eq('id', SID).maybeSingle();
  console.log('aired/total after resolve:', s2?.aired_episodes, s2?.total_episodes);
  if (s2 && (s2.aired_episodes !== 154 || s2.total_episodes !== 154)) {
    const { error: e2 } = await db.from('series').update({ aired_episodes: 154, total_episodes: 154 }).eq('id', SID);
    if (e2) throw new Error(e2.message);
    console.log('aired/total set to 154 (ja-WP 全154話; AniList 3972; the film is order-only)');
  }
  await finishRun(runId, 'ok', { fetched: 1, unchanged: 0, changed: 1, flagged: 0 }, '5D\'s: film row 83 dropped (N11), @82.5 order-only');
} catch (e) {
  await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
  throw e;
}
process.exit(0);
