// Research-tier batch application — Sean's sign-off 2026-08-24. Every item
// carries its citations (research agents, ≥2 corroborating sources; URLs in
// flag verdicts / notes). Kept in the repo as the ruling record; re-runnable
// (idempotent upserts/deletes).
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch.ts

import { db, startRun, finishRun } from './lib/db';
import { refreshStitchedVolatile } from './lib/resolve';

const now = () => new Date().toISOString();

async function dismissFlags(keys: string[], verdict: string) {
  for (const key of keys) {
    const { data } = await db.from('ingest_flags').select('id, detail').eq('series_key', key).eq('status', 'open');
    for (const f of data ?? []) {
      await db.from('ingest_flags').update({ status: 'confirmed', resolved_at: now(), detail: { ...(f.detail as object), verdict } }).eq('id', f.id);
    }
  }
}

// order-only conversion: non-season components lose their ranges; season
// ranges recompute contiguously in season_order
async function toOrderOnly(seriesId: string, note: string) {
  const { data: comps } = await db
    .from('series_components')
    .select('anilist_id, season_order, episode_start, episode_end, kind')
    .eq('series_id', seriesId)
    .order('season_order');
  let cursor = 0;
  for (const c of comps ?? []) {
    if (c.kind && c.kind !== 'season') {
      await db.from('series_components').update({ episode_start: null, episode_end: null }).eq('series_id', seriesId).eq('anilist_id', c.anilist_id);
    } else {
      const len = c.episode_end != null && c.episode_start != null ? c.episode_end - c.episode_start + 1 : 0;
      await db
        .from('series_components')
        .update({ episode_start: cursor + 1, episode_end: len ? cursor + len : null })
        .eq('series_id', seriesId)
        .eq('anilist_id', c.anilist_id);
      cursor += len;
    }
  }
  await refreshStitchedVolatile(seriesId); // order-only excluded + community cap applied
  console.log(`  order-only: ${seriesId} → season span ${cursor} (${note})`);
}

async function main() {
  const runId = await startRun('resolve');
  try {
    // ── A. Frontier anchors (manual, cited) ─────────────────────────────
    const anchors: [string, number, number, number, string][] = [
      ['rurouni-kenshin', 62, 151, 18, 'Kyoto arc end; eps 63+ anime-original. mangashed.com + wheredoestheanimeleaveoff.com + Wikipedia'],
      ['rurouni-kenshin-2023', 47, 106, 13, 'Kyoto Disturbance end (Act 106 partially adapted). animefillerguide.com + wheredoestheanimeleaveoff.com + kenshin.fandom.com'],
      ['haikyu', 85, 292, 33, 'S4 end = Ch 292 "The Same Old Night Never Comes Again". Wikipedia + wheredoestheanimeleaveoff.com + haikyuu.fandom.com'],
      ['boruto-naruto-next-generations', 293, 67, 17, 'Ep 293 hiatus finale = end of Ch 67 "Rift". sportskeeda + mangashed + boruto.fandom.com'],
    ];
    for (const [sid, ep, ch, vol, note] of anchors) {
      await db.from('chapter_anchors').upsert({ series_id: sid, episode: ep, chapter: ch, volume: vol, source: 'manual', note: `research-tier (Sean sign-off 2026-08-24): ${note}` });
      console.log(`  anchor: ${sid} ep ${ep} → ch ${ch} vol ${vol}`);
    }
    await db.from('chapter_anchors').upsert({ series_id: 'x', episode: 20, chapter: 84, volume: 17, source: 'manual', note: 'research-tier (medium confidence): follows manga to ~vol 17/ch 84 at ep 20, then original ending. xtvclamp.fandom.com + Wikipedia + cbr.com' });
    console.log('  anchor: x ep 20 → ch 84 vol 17');
    await dismissFlags(['rurouni-kenshin', 'rurouni-kenshin-2023', 'haikyu', 'boruto-naruto-next-generations', 'x'], 'research-tier frontier applied as manual anchor (sources in anchor note); Sean sign-off 2026-08-24');

    // ── B. Loose-adaptation verdicts ────────────────────────────────────
    for (const [sid, why] of [
      ['sgt-frog', '71% filler, manga stories cherry-picked non-linearly across 358 eps — no chapter mapping meaningful (animefillerlist + Wikipedia)'],
      ['outlaw-star', 'parallel telling: anime finished ~11 months before the manga; episodic vs manga\'s direct Leyline drive (Wikipedia + anime-planet)'],
    ] as const) {
      await db.from('series').update({ mapping_mode: 'loose', updated_at: now() }).eq('id', sid);
      console.log(`  loose: ${sid} (${why.slice(0, 50)}…)`);
    }
    await dismissFlags(['sgt-frog', 'outlaw-star'], 'research-tier verdict: loose adaptation — no chapter mapping is meaningful; mapping_mode=loose; Sean sign-off 2026-08-24');

    // ── C. Souten no Ken conflation repair ──────────────────────────────
    await db.from('series_components').delete().eq('series_id', 'fist-of-the-blue-sky').eq('anilist_id', 967);
    await db.from('series_components').delete().eq('series_id', 'fist-of-the-blue-sky');
    await db.from('series_components').insert([
      { series_id: 'fist-of-the-blue-sky', anilist_id: 1541, season_order: 1, episode_start: 1, episode_end: 22, label: 'Souten no Ken', kind: 'season', afl_slug: 'fist-of-the-blue-sky', afl_offset: 0 },
      { series_id: 'fist-of-the-blue-sky', anilist_id: 3864, season_order: 2, episode_start: 23, episode_end: 26, label: 'Souten no Ken (DVD episodes)', kind: 'ova', afl_slug: 'fist-of-the-blue-sky', afl_offset: 0 },
    ]);
    await db.from('series').update({ aired_episodes: 26, total_episodes: 26, updated_at: now() }).eq('id', 'fist-of-the-blue-sky');
    await db.from('chapter_anchors').delete().eq('series_id', 'fist-of-the-blue-sky').eq('source', 'mu');
    console.log('  repaired: fist-of-the-blue-sky (22 TV + 4 DVD eps; Hokuto no Ken component removed — 109+22=131 conflation proven)');

    // ── D. Monogatari legacy duplicates (one-series ruling) ─────────────
    for (const sid of ['nisemonogatari', 'monogatari-series-second-season', 'hanamonogatari', 'tsukimonogatari', 'owarimonogatari']) {
      const { data: s } = await db.from('series').select('afl_slug').eq('id', sid).maybeSingle();
      if (!s) { console.log(`  dup: ${sid} already gone`); continue; }
      await db.from('chapter_anchors').delete().eq('series_id', sid);
      await db.from('episodes').delete().eq('series_id', sid);
      await db.from('series_components').delete().eq('series_id', sid);
      await db.from('series_external_ids').delete().eq('series_id', sid);
      await db.from('series').delete().eq('id', sid);
      if (s.afl_slug) await db.from('source_map').update({ disposition: 'duplicate' }).eq('afl_slug', s.afl_slug);
      console.log(`  deleted duplicate: ${sid} (content lives in monogatari-series per the one-series ruling)`);
    }
    await refreshStitchedVolatile('monogatari-series'); // Kizu excluded + cap 100

    // ── E. Community-count restructures (Sean's numbered-vs-event rule) ─
    await db.from('episodes').delete().eq('series_id', 'psycho-pass').in('number', [42, 43, 44]);
    await toOrderOnly('psycho-pass', 'First Inspector + films = watch-order events; 41 eps (Sean ruling)');
    await toOrderOnly('k', 'Missing Kings movie = watch-order event; 26 eps');
    await toOrderOnly('hayate-the-combat-butler', 'OVA + movie = watch-order events; 101 eps');
    await toOrderOnly('hajime-no-ippo-the-fighting', 'Champion Road / Mashiba OVA = watch-order events; 127 eps');

    // ── F. Community-counted specials become rows ───────────────────────
    const addRow = async (row: { series_id: string; number: number; title: string; type: string; air_date: string | null }) => {
      const { data: exists } = await db.from('episodes').select('number').eq('series_id', row.series_id).eq('number', row.number).maybeSingle();
      if (!exists) await db.from('episodes').insert(row);
    };
    await addRow({ series_id: 'dr-stone', number: 95, title: 'Dr. STONE: Ryuusui', type: 'canon', air_date: '2022-07-10' });
    console.log('  row: dr-stone ep 95 (Ryuusui TV special, adapts ch 84-89; community-counted — Sean ruling)');
    await addRow({ series_id: 'fate-stay-night-unlimited-blade-works', number: 0, title: 'Prologue', type: 'anime-only-canon', air_date: '2014-10-04' });
    console.log('  row: UBW ep 0 (broadcast prologue; count starts at 0 per Sean)');
    await addRow({ series_id: 'darwin-s-game', number: 11, title: 'Sunset Ravens', type: 'canon', air_date: '2020-03-20' });
    console.log('  row: darwin-s-game ep 11 (finale; community list stale — MAL + ANN)');

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: 1, flagged: 0 }, 'research-tier batch (Sean sign-off)');
    console.log('\n=== RESEARCH BATCH APPLIED ===');
  } catch (err) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
