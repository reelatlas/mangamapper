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
      .select('id, title, title_native, aired_episodes, total_episodes, start_date, source_type, manga_status, popularity')
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
        // no list page is NOT terminal — the main-article fallback below
        // still runs (SHY-class: tables live on the series article)
        // gather PER-PAGE row sets (main page + each transclusion separately)
        // — franchise families number per-season, so offsets are per PAGE
        const pageSets: { name: string; eps: WikiEpisode[] }[] = [];
        for (const p of pages) {
          const wt = await fetchWikitext(p);
          if (!wt) continue;
          const own = parseEpisodeList(wt);
          if (own.length) pageSets.push({ name: p, eps: own });
          for (const sub of extractTransclusions(wt).slice(0, 15)) {
            const swt = await fetchWikitext(sub);
            if (swt) {
              const se = parseEpisodeList(swt);
              if (se.length) pageSets.push({ name: sub, eps: se });
            }
            await sleep(600);
          }
          await sleep(600);
        }
        if (!pageSets.length && pages.length) {
          console.log(`  ${t.id}: list pages held no parseable rows (${pages.join('; ')}) — trying main article`);
        }
        // our component structure — used by the component lock below and
        // the mid-run order-only guard after the merge list is built
        const { data: comps } = await db
          .from('series_components')
          .select('season_order, episode_start, episode_end, label')
          .eq('series_id', t.id)
          .order('season_order');
        const cl = comps ?? [];
        // which season a component LABEL names ("Kingdom 2nd Season",
        // "Mahoutsukai no Yome SEASON 2 Part 2" → 2); null when silent
        // ("Saishuushou", the head season) — callers fall back to position
        const seasonOfLabel = (label: string | null): number | null => {
          const m = String(label ?? '').match(/\b(\d+)(?:st|nd|rd|th)\s+season\b|\bseason\s+(\d+)\b/i);
          return m ? Number(m[1] ?? m[2]) : null;
        };
        // namesake guard for name-only page locks (the Kingdom lesson: the
        // 2007 British drama's list page is "List of Kingdom episodes"): a
        // page whose earliest air date sits years away from our start date
        // is another show, whatever its name says
        const datesCompatible = (rows: WikiEpisode[]): boolean => {
          const ours = t.start_date ? Number(String(t.start_date).slice(0, 4)) : null;
          const theirs = rows.map((w) => (w.airDate ? Number(String(w.airDate).slice(0, 4)) : NaN)).filter((y) => !Number.isNaN(y));
          if (ours == null || !theirs.length) return true;
          return Math.abs(Math.min(...theirs) - ours) <= 1;
        };
        // EVIDENCE-LOCKED per-page offsets (Sean's When They Cry case,
        // 2026-08-23): a page's offset into OUR numbering must be PROVEN
        // before its rows merge — votes come from exact air-date matches
        // (strong) and title similarity (fallback) against stored rows.
        // ≥3 consistent votes lock the page; a page with no stored overlap
        // falls back to offset 0 only when its own numbering fits our run
        // (the old gate). Unlockable pages skip with a log line, per-page —
        // a franchise family fills the seasons it can prove.
        const storedRows = eps.filter((e) => e.series_id === t.id);
        const byDate = new Map(storedRows.filter((e) => e.air_date).map((e) => [String(e.air_date), e.number]));
        const norm2 = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        // similarity voting (exact equality missed translation variants —
        // Kenshin-2023's season pages were unlockable): ≥75% token overlap
        const simTokens = (a: string, b: string) => {
          const ta = new Set(norm2(a).split(' ').filter(Boolean));
          const tb = new Set(norm2(b).split(' ').filter(Boolean));
          if (!ta.size || !tb.size) return 0;
          let sh = 0;
          for (const x of ta) if (tb.has(x)) sh++;
          return sh / Math.min(ta.size, tb.size);
        };
        const titleVotes = (w: WikiEpisode): number[] => {
          if (!w.title) return [];
          return storedRows
            .filter((r) => String(r.title ?? '').trim() && simTokens(String(r.title), w.title!) >= 0.75)
            .map((r) => r.number - w.number);
        };
        // no-overlap fallback is only safe when the PAGE NAME strongly names
        // this series (the Orphan-Black/HBO-Girls lesson: search can return
        // token-overlapping strangers; evidence-locked pages prove identity
        // by content, fallback pages must prove it by name)
        const pageNames = norm2(`${t.title} ${t.title_native ?? ''}`);
        const pageNameMatches = (name: string) => {
          const inner = name.replace(/^List of /i, '').replace(/ episodes.*$/i, '');
          return simTokens(inner, pageNames) >= 0.99 || norm2(inner) === norm2(t.title);
        };
        let wiki: WikiEpisode[] = [];
        const skipped: { name: string; eps: WikiEpisode[]; isOwnArticle?: boolean }[] = [];
        const lockAndMerge = (sets: { name: string; eps: WikiEpisode[]; isOwnArticle?: boolean }[]) => {
        for (const ps of sets) {
          const ints = ps.eps.filter((w) => Number.isInteger(w.number));
          const tally = new Map<number, number>();
          for (const w of ints) {
            if (w.airDate && byDate.has(w.airDate)) {
              const o = byDate.get(w.airDate)! - w.number;
              tally.set(o, (tally.get(o) ?? 0) + 2); // date votes weigh double
            }
            for (const o of titleVotes(w)) tally.set(o, (tally.get(o) ?? 0) + 1);
          }
          const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]);
          const best = ranked[0];
          const second = ranked[1]?.[1] ?? 0;
          let offset: number | null = null;
          // margin lock: the winner must dominate the runner-up (top-vs-
          // total drowned in cross-title vote spam — When They Cry had 223
          // votes at 0 yet failed the old ratio)
          if (best && best[1] >= 3 && best[1] >= 3 * Math.max(second, 1)) offset = best[0];
          // component lock: a page named "... season N" maps to our season-
          // order-N component's start (Kenshin-2023's junk-cleaned rows had
          // no votes to give)
          if (offset === null) {
            const sm = ps.name.match(/season (\d+)/i);
            if (sm) {
              const sn = Number(sm[1]);
              const ourSeasons = cl.filter((c) => c.episode_start !== null);
              // season N = every numbered component whose LABEL names season N
              // (two-part seasons: "2nd Season" + "2nd Season Part 2" — the
              // Slime lesson); positional N-th component when labels are silent
              const byLabel = ourSeasons.filter((c) => seasonOfLabel(c.label) === sn);
              const group = byLabel.length ? byLabel : ourSeasons[sn - 1] ? [ourSeasons[sn - 1]] : [];
              if (group.length) {
                const gStart = Math.min(...group.map((c) => c.episode_start as number));
                const gEnd = group.every((c) => c.episode_end != null) ? Math.max(...group.map((c) => c.episode_end as number)) : null;
                // an airing tail's episode_end is "aired so far" — the page
                // lists the planned season, so cap at the known total
                const isTail = group.includes(ourSeasons[ourSeasons.length - 1]);
                const gCap = gEnd != null ? Math.max(gEnd, isTail ? t.total_episodes ?? 0 : 0) : null;
                const len = gCap != null ? gCap - gStart + 1 : null;
                const pmax = Math.max(...ints.map((w) => w.number));
                const pmin = Math.min(...ints.map((w) => w.number));
                if (pmin >= gStart && gCap != null && pmax <= gCap + 2) {
                  // season page already numbered in OVERALL space
                  offset = 0;
                  console.log(`  ${t.id}: page "${ps.name}" component-locked (overall numbering)`);
                } else if (pmin <= 2 && (len === null || pmax <= len + 2)) {
                  offset = gStart - 1;
                  console.log(`  ${t.id}: page "${ps.name}" component-locked at +${offset}`);
                }
              }
            }
          }
          // first-segment fallback: exact-name page starting at 1 merges its
          // opening segment even when the family numbering runs past our
          // count (Kinnikuman's page runs to 205; rows ≤ aired cap protects)
          if (
            offset === null &&
            best === undefined &&
            (ps.isOwnArticle || pageNameMatches(ps.name)) &&
            Math.min(...ints.map((w) => w.number)) === 1
          ) {
            if (!datesCompatible(ps.eps)) {
              console.log(`  ${t.id}: page "${ps.name}" REJECTED — air dates belong to another show (namesake)`);
              continue;
            }
            offset = 0;
          }
          if (offset === null) {
            skipped.push(ps);
            continue;
          }
          wiki = wiki.concat(ps.eps.map((w) => ({ ...w, number: w.number + offset })));
          if (offset !== 0) console.log(`  ${t.id}: page "${ps.name}" locked at offset ${offset > 0 ? '+' : ''}${offset}`);
        }
        // CONTINUITY lock (the Kingdom S6 lesson: a list page's own rows run
        // 143-155 while its season sub-pages carry 1-142): a skipped set
        // whose integer rows begin exactly where the merged/stored rows end,
        // fit inside our count, and whose air dates continue monotonically
        // from the last known row is numbered in OUR overall space.
        const ourTopForLock = Math.max(t.aired_episodes ?? 0, t.total_episodes ?? 0);
        for (let pass = 0; pass < 3 && skipped.length; pass++) {
          const mergedNums = [...wiki.filter((w) => Number.isInteger(w.number)).map((w) => w.number), ...storedRows.map((r) => r.number)];
          const top = mergedNums.length ? Math.max(...mergedNums) : 0;
          const lastDate = [...wiki, ...storedRows.map((r) => ({ number: r.number, airDate: r.air_date ? String(r.air_date) : null }))]
            .filter((r) => r.number <= top && r.airDate)
            .map((r) => String(r.airDate))
            .sort()
            .pop();
          const idx = skipped.findIndex((ps) => {
            const ints = ps.eps.filter((w) => Number.isInteger(w.number));
            if (!ints.length) return false;
            const pmin = Math.min(...ints.map((w) => w.number));
            const pmax = Math.max(...ints.map((w) => w.number));
            const firstDate = ints.map((w) => w.airDate).filter(Boolean).sort()[0];
            return pmin === top + 1 && pmax <= ourTopForLock + 2 && (!lastDate || !firstDate || firstDate >= lastDate);
          });
          if (idx < 0) break;
          const ps = skipped.splice(idx, 1)[0];
          wiki = wiki.concat(ps.eps);
          console.log(`  ${t.id}: page "${ps.name}" continuity-locked (rows continue our numbering from ${top + 1})`);
        }
        for (const ps of skipped) {
          console.log(`  ${t.id}: page "${ps.name}" offset unprovable — skipped`);
        }
        skipped.length = 0;
        };
        lockAndMerge(pageSets);
        // MAIN-ARTICLE fallback (the SHY / Kenshin-2023 class): newer or
        // remake series keep their episode tables on the series article
        // itself — and list-page search can surface a NAMESAKE's pages (all
        // four "Rurouni Kenshin" list pages belong to the 1996 series). The
        // article fetched by OUR exact title is identity-proven by name.
        if (!wiki.length) {
          // namesake disambiguation forms first (Kingdom: the plain list page
          // is the 2007 British drama; ours is "List of Kingdom (Japanese TV
          // series) episodes")
          for (const cand of [
            `List of ${t.title} (Japanese TV series) episodes`,
            `List of ${t.title} (TV series) episodes`,
            `List of ${t.title} (anime) episodes`,
            t.title,
            `${t.title} (TV series)`,
            `${t.title} (Japanese TV series)`,
            `${t.title} (manga)`,
          ]) {
            const wt = await fetchWikitext(cand);
            await sleep(500);
            if (!wt) continue;
            const own = parseEpisodeList(wt);
            const subs: { name: string; eps: WikiEpisode[]; isOwnArticle?: boolean }[] = own.length
              ? [{ name: cand, eps: own, isOwnArticle: true }]
              : [];
            for (const sub of extractTransclusions(wt).slice(0, 12)) {
              const swt = await fetchWikitext(sub);
              if (swt) {
                const se = parseEpisodeList(swt);
                if (se.length) subs.push({ name: sub, eps: se, isOwnArticle: true });
              }
              await sleep(500);
            }
            if (subs.length) {
              console.log(`  ${t.id}: main-article tables found on "${cand}" (${subs.length} set(s))`);
              lockAndMerge(subs);
              break;
            }
          }
        }
        const seen = new Set<number>();
        wiki = wiki.filter((e) => (seen.has(e.number) ? false : (seen.add(e.number), true)));
        if (!wiki.length) {
          console.log(`  ${t.id}: no page could be offset-locked — nothing merged`);
          continue;
        }
        // mid-run order-only guard: filling past an order-only position
        // without a declared numbering shift is forbidden (Ryuusui lesson)
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
        // alignment evidence, two kinds: fractional separators, OR the page's
        // top number equals our count — a page that had numbered an
        // order-only insert as an integer would overshoot by exactly the
        // inserts (the Magus Bride S2 case: overall-numbered page, un-numbered
        // OVA). Exact match when the total is known; ≤ aired while airing.
        const pageTop = Math.max(0, ...wiki.filter((w) => Number.isInteger(w.number)).map((w) => w.number));
        const countAligned =
          pageTop > 0 &&
          (t.total_episodes != null ? pageTop === Math.max(t.total_episodes, t.aired_episodes ?? 0) : pageTop <= (t.aired_episodes ?? 0));
        const wikiAligned = fractionals.length > 0 || countAligned;
        if (midRunOrderOnly && countAligned && !fractionals.length) {
          console.log(`  ${t.id}: page top ${pageTop} = our count — numbering aligned without fractional separators`);
        }
        if (midRunOrderOnly && !wikiAligned && !WIKI_NUMBERING_SHIFTS[t.id]) {
          await fileFlagOnce(runId, t.id, 'wikipedia', 'count_mismatch', {
            note: 'mid-run order-only component and the wiki page shows no fractional separators — numbering space unverified; fills past the insert withheld until a shift is declared or alignment verified',
          });
          counters.flagged++;
        }
        if (fractionals.length) {
          console.log(`  ${t.id}: wiki separates ${fractionals.length} watch-order entr${fractionals.length === 1 ? 'y' : 'ies'} fractionally (${fractionals.map((f) => f.number).join(', ')}) — numbering aligned`);
          // stage every fractional entry durably (Sean's ruling: non-main
          // entries are NOTED so the UI/watch-order phase decides from data)
          for (const f of fractionals) {
            await db.from('ingest_fractionals').upsert({
              series_id: t.id,
              position: f.number,
              title: f.title,
              air_date: f.airDate,
              note: 'wiki fractional separator (community between-episodes notation)',
            });
          }
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
