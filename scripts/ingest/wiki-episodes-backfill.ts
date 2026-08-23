// Episode-data initiative (§12.19d, Sean's directive): titles + air dates
// from Wikipedia episode lists. FILL-ONLY merge — AFL remains the title
// authority where it has real titles; Wikipedia fills '' titles and null
// air dates; AniList labels remain the tier below (specials). Conflicts
// (wiki title disagrees with a non-empty stored title) are NOT written —
// they flag for the research loop, per the metadata contract.
// Gates:
//   · alignment: the page family's max overall number must fit our aired
//     count (+2 lag tolerance) — season-relative numbering or franchise
//     pages fail this and flag instead of writing garbage
//   · per-row: only numbers 1..aired; per-series rulings via
//     filterEpisodeRows for rows this script CREATES (row-less canon-tier
//     series get full rows: number/title/date, type from the canon-default
//     span logic — canon unless the series carries type overrides)
// Idempotent; re-runs fill only what is still missing.
//   npx tsx --env-file=.env.ingest scripts/ingest/wiki-episodes-backfill.ts [seriesId ...]

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { extractTransclusions, findEpisodePages, fetchWikitext, parseEpisodeList, type WikiEpisode } from './lib/wikipedia';
import { filterEpisodeRows } from './lib/resolve';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// NUMBERING-SPACE TRANSLATION (Sean's ruling 2026-08-23, the Dr. Stone
// Ryuusui lesson): every per-episode external source has its OWN numbering
// space. A watch-order entry (special/OVA/movie) that Wikipedia numbers but
// we hold order-only shifts every later episode — the fill poisoned
// dr-stone 36-94 by one (ep 36 got "Ryusui"). Rules:
//   · series with a MID-RUN order-only component REQUIRE a declared shift
//     here before any fill past that position — otherwise skip + flag
//   · declared shifts also run in CORRECTION mode: a stored row matching
//     the wiki title at the WRONG offset is rewritten to the right one
// [from, offset]: our episode n ≥ from maps to wiki number n + offset.
// (Dr. Stone resolved differently: Wikipedia labels Ryuusui 35.5 — a
// FRACTIONAL position, meaning wiki already shares our numbering space;
// the shifted source was AFL, handled by SOURCE_NUMBERING_SHIFTS in
// lib/resolve. This map stays for sources that flatten inserts into
// integers.)
const WIKI_NUMBERING_SHIFTS: Record<string, { from: number; offset: number }[]> = {};

const shiftFor = (sid: string, ep: number): number =>
  (WIKI_NUMBERING_SHIFTS[sid] ?? []).reduce((s, r) => (ep >= r.from ? s + r.offset : s), 0);

async function main() {
  const only = process.argv.slice(2);
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    // targets: series with missing titles/dates (or no rows at all)
    const { data: series } = await db
      .from('series')
      .select('id, title, title_native, aired_episodes, source_type, manga_status, popularity')
      .order('popularity', { ascending: false });
    const eps: any[] = [];
    for (let f = 0; ; f += 1000) {
      const { data } = await db.from('episodes').select('series_id, number, title, air_date').range(f, f + 999);
      eps.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    const stateBy = new Map<string, { rows: number; missingTitle: number; missingDate: number }>();
    for (const e of eps) {
      const s = stateBy.get(e.series_id) ?? { rows: 0, missingTitle: 0, missingDate: 0 };
      s.rows++;
      if (!e.title || !String(e.title).trim()) s.missingTitle++;
      if (!e.air_date) s.missingDate++;
      stateBy.set(e.series_id, s);
    }
    const targets = (series ?? []).filter((s) => {
      if (only.length) return only.includes(s.id);
      if (!s.aired_episodes) return false;
      const st = stateBy.get(s.id);
      return !st || st.missingTitle > 0 || st.missingDate > 0 || st.rows < s.aired_episodes;
    });
    console.log(`[wiki-episodes] ${targets.length} target series`);

    for (const t of targets) {
      try {
        const pages = await findEpisodePages([t.title, t.title_native ?? ''].filter(Boolean));
        counters.fetched++;
        if (!pages.length) {
          console.log(`  ${t.id}: no episode-list page found`);
          continue;
        }
        let wiki: WikiEpisode[] = [];
        for (const p of pages) {
          const wt = await fetchWikitext(p);
          if (!wt) continue;
          wiki = wiki.concat(parseEpisodeList(wt));
          // season pages transcluded into the list page hold the actual
          // rows (Dr. Stone class) — follow depth-1 transclusions
          for (const sub of extractTransclusions(wt).slice(0, 12)) {
            const swt = await fetchWikitext(sub);
            if (swt) wiki = wiki.concat(parseEpisodeList(swt));
            await sleep(600);
          }
          await sleep(600);
        }
        const seen = new Set<number>();
        wiki = wiki.filter((e) => (seen.has(e.number) ? false : (seen.add(e.number), true)));
        if (!wiki.length) {
          console.log(`  ${t.id}: pages held no parseable episode rows (${pages.join('; ')})`);
          continue;
        }
        const wikiMax = Math.max(...wiki.map((e) => e.number));
        if (wikiMax > t.aired_episodes + 2) {
          await fileFlagOnce(runId, t.id, 'wikipedia', 'count_mismatch', {
            wikiMax,
            aired: t.aired_episodes,
            pages,
            note: 'episode-list numbering exceeds our aired count — franchise page or numbering-space mismatch; withheld',
          });
          counters.flagged++;
          console.log(`  ${t.id}: WITHHELD (wiki max ${wikiMax} vs aired ${t.aired_episodes})`);
          continue;
        }
        // mid-run order-only guard: filling past an order-only position
        // without a declared numbering shift is forbidden (Ryuusui lesson)
        const { data: comps } = await db
          .from('series_components')
          .select('season_order, episode_start')
          .eq('series_id', t.id)
          .order('season_order');
        const cl = comps ?? [];
        const midRunOrderOnly = cl.some(
          (c, i) => c.episode_start === null && cl.slice(i + 1).some((n) => n.episode_start !== null),
        );
        const firstAfterOrderOnly = midRunOrderOnly
          ? cl.find((c, i) => c.episode_start !== null && cl.slice(0, i).some((p) => p.episode_start === null))?.episode_start ?? 1
          : Number.POSITIVE_INFINITY;
        // FRACTIONAL rows (35.5-style) prove the page separates watch-order
        // entries the way we do — the numbering spaces align. Without them,
        // a mid-run order-only series stays unverified: withhold + flag.
        const fractionals = wiki.filter((w) => !Number.isInteger(w.number));
        const wikiAligned = fractionals.length > 0;
        if (midRunOrderOnly && !wikiAligned && !WIKI_NUMBERING_SHIFTS[t.id]) {
          await fileFlagOnce(runId, t.id, 'wikipedia', 'count_mismatch', {
            note: 'mid-run order-only component and the wiki page shows no fractional separators — numbering space unverified; fills past the insert withheld until a shift is declared or alignment verified',
          });
          counters.flagged++;
        }
        if (fractionals.length) {
          console.log(`  ${t.id}: wiki separates ${fractionals.length} watch-order entr${fractionals.length === 1 ? 'y' : 'ies'} fractionally (${fractionals.map((f) => f.number).join(', ')}) — numbering aligned`);
        }
        const wikiByNumber = new Map(wiki.filter((w) => Number.isInteger(w.number)).map((w) => [w.number, w]));
        const existing = new Map(eps.filter((e) => e.series_id === t.id).map((e) => [e.number, e]));
        let filled = 0, conflicts = 0, created = 0, corrected = 0;
        const newRows: any[] = [];
        for (let n = 1; n <= t.aired_episodes; n++) {
          if (midRunOrderOnly && !wikiAligned && !WIKI_NUMBERING_SHIFTS[t.id] && n >= firstAfterOrderOnly) continue;
          const shift = shiftFor(t.id, n);
          const w = wikiByNumber.get(n + shift);
          if (!w) continue;
          const cur = existing.get(n);
          if (!cur) {
            newRows.push({ series_id: t.id, number: n, title: w.title ?? '', type: 'canon', air_date: w.airDate });
            continue;
          }
          const curTitle = String(cur.title ?? '').trim();
          const patch: Record<string, unknown> = {};
          // correction mode: a stored title matching the wiki value at the
          // WRONG offset is a poisoned fill — rewrite to the right one
          if (shift !== 0 && curTitle) {
            const wrong = wikiByNumber.get(n);
            if (wrong?.title && curTitle.toLowerCase() === wrong.title.toLowerCase() && w.title) {
              patch.title = w.title;
              if (w.airDate) patch.air_date = w.airDate;
              corrected++;
            }
          }
          if (!curTitle && w.title) patch.title = w.title;
          if (!cur.air_date && w.airDate) patch.air_date = w.airDate;
          if (!patch.title && curTitle && w.title && curTitle.toLowerCase() !== w.title.toLowerCase()) conflicts++;
          if (Object.keys(patch).length) {
            await db.from('episodes').update(patch).eq('series_id', t.id).eq('number', n);
            filled++;
          }
        }
        if (newRows.length) {
          const ruled = filterEpisodeRows(t.id, newRows);
          for (let i = 0; i < ruled.length; i += 500) {
            const { error } = await db.from('episodes').insert(ruled.slice(i, i + 500));
            if (error) throw new Error(error.message);
          }
          created = ruled.length;
        }
        if (conflicts > 3) {
          await fileFlagOnce(runId, t.id, 'wikipedia', 'taxonomy_conflict', {
            conflicts,
            note: 'wiki titles disagree with stored titles on many rows — numbering offset suspected; stored titles kept, verify',
          });
          counters.flagged++;
        }
        if (filled || created) counters.changed++;
        console.log(`  ${t.id}: filled ${filled}, created ${created}${corrected ? `, CORRECTED ${corrected} shifted` : ''}${conflicts ? `, ${conflicts} title conflicts (kept stored)` : ''} [${pages.length} page(s)]`);
        await sleep(400);
      } catch (e) {
        console.log(`  ${t.id}: ERROR ${String(e).slice(0, 90)}`);
      }
    }
    await finishRun(runId, 'ok', counters, `wiki episodes backfill: ${counters.changed} series filled, ${counters.flagged} withheld`);
    console.log('=== WIKI EPISODES BACKFILL COMPLETE ===');
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0));
