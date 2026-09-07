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
//   · identity (G55, batch 19 E2 — the namesake lesson): a wiki row dated
//     before this series began, or long after a finished series ended, is
//     another show's row (kenshin-2023 25-27 wore the 1996 series; beyblade-x
//     41-102 wore 2001 Beyblade; the Ranking of Kings spin-off wore the 2021
//     main series). The row is REFUSED — title and date both — and the
//     series flagged once; lib/wiki-identity.ts is the one predicate, the
//     census class episode_date_off_window the outcome check
// Idempotent; re-runs fill only what is still missing.
//   npx tsx --env-file=.env.ingest scripts/ingest/wiki-episodes-backfill.ts [--dry-run] [--ruled] [seriesId ...]
//   --dry-run (2026-09-07, P40: a writer that mints rows has one): every lock and every planned row is printed, nothing is
//   written — no episode insert / update, no fractional staging, no flag, no ingest run

import { db, selectAll, startRun, finishRun, fileFlagOnce } from './lib/db';
import { extractMainArticles, extractTransclusions, fetchWikitext, findEpisodePages, parseEpisodeList, type WikiEpisode } from './lib/wikipedia';
import { filterEpisodeRows, SOURCE_NUMBERING_SHIFTS, translateEpisodeNumber } from './lib/resolve';
import { dateFit, disambiguatedTitles, pageFitsSeries, titleCased } from './lib/wiki-identity';
import { WIKI_PAGES } from './lib/rulings/wiki-pages';
import { loadEpisodeTies } from './lib/side-source';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// NUMBERING-SPACE TRANSLATION (Sean's ruling 2026-08-23, the Dr. Stone
// Ryuusui lesson): every per-episode external source has its OWN numbering
// space. A watch-order entry (special/OVA/movie) that Wikipedia numbers but
// we hold order-only shifts every later episode — the fill poisoned
// dr-stone 36-94 by one (ep 36 got "Ryusui"). Rules:
//   · series with a MID-RUN order-only component REQUIRE a declared shift
//     before any fill past that position — otherwise skip + flag
//   · declared shifts also run in CORRECTION mode: a stored row matching
//     the wiki title at the WRONG (untranslated) number is rewritten
// Since batch 19 E2 (§E.8 unification) the declaration is the ONE map every
// source reads — SOURCE_NUMBERING_SHIFTS (N11/N12) with 'wiki' among its
// spaces (or no space list = every space) — and wiki numbers enter our
// space through translateEpisodeNumber(…, 'wiki') like every other source's.
// The script-local WIKI_NUMBERING_SHIFTS map (always empty) is gone.
const declaresWikiShift = (sid: string): boolean => {
  const s = SOURCE_NUMBERING_SHIFTS[sid];
  return !!s && (!s.spaces || s.spaces.includes('wiki'));
};

async function main() {
  const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const DRY = process.argv.includes('--dry-run');
  const runId = DRY ? -1 : await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    // targets: series with missing titles/dates (or no rows at all)
    const series = await selectAll<{
      id: string;
      title: string;
      title_native: string | null;
      aired_episodes: number | null;
      total_episodes: number | null;
      start_date: string | null;
      end_date: string | null;
      status: string | null;
      source_type: string | null;
      manga_status: string | null;
      popularity: number | null;
    }>('series', 'id, title, title_native, aired_episodes, total_episodes, start_date, end_date, status, source_type, manga_status, popularity', (q) =>
      q.order('popularity', { ascending: false }),
    );
    const eps: any[] = await selectAll<any>('episodes', 'series_id, number, title, air_date');
    const stateBy = new Map<string, { rows: number; missingTitle: number; missingDate: number }>();
    for (const e of eps) {
      const s = stateBy.get(e.series_id) ?? { rows: 0, missingTitle: 0, missingDate: 0 };
      s.rows++;
      if (!e.title || !String(e.title).trim()) s.missingTitle++;
      if (!e.air_date) s.missingDate++;
      stateBy.set(e.series_id, s);
    }
    const allTargets = series.filter((s) => {
      if (only.length) return only.includes(s.id);
      if (!s.aired_episodes) return false;
      const st = stateBy.get(s.id);
      return !st || st.missingTitle > 0 || st.missingDate > 0 || st.rows < s.aired_episodes;
    });
    // G59 path B on the STANDARD roster: `--ruled` runs ONLY the ruled-page keys (two fetches, every heal) — the full
    // lag fill (rows < aired across the catalog) stays an EVENT run on title_incomplete, never a Wikipedia crawl per heal
    const RULED_ONLY = process.argv.includes('--ruled');
    const targets = RULED_ONLY ? allTargets.filter((s) => WIKI_PAGES[s.id]) : allTargets;
    console.log(`[wiki-episodes] ${targets.length} target series${RULED_ONLY ? ' (ruled pages only, G59 path B)' : ''}`);

    for (const t of targets) {
      try {
        // year-disambiguated forms FIRST (G55): a namesake's plain list page
        // ("List of Rurouni Kenshin episodes" = 1996) would otherwise win
        // the prefix search for a remake / spin-off
        // G59 path B: a RULED page replaces the finder (the finder matched a namesake / a franchise list for orient / code-black)
        const ruledPage = WIKI_PAGES[t.id];
        // an ALL-CAPS AniList title also tries Wikipedia's casing (titleCased — the gits-2026 lesson); the finder searches every variant
        const cased = titleCased(t.title);
        const pages = ruledPage ? [ruledPage.page] : await findEpisodePages([...disambiguatedTitles(t.title, t.start_date), t.title, ...(cased ? [...disambiguatedTitles(cased, t.start_date), cased] : []), t.title_native ?? ''].filter(Boolean));
        if (ruledPage) console.log(`  ${t.id}: ruled wiki page "${ruledPage.page}" (G59)`);
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
          // transclusions AND {{Main|…}} season sub-articles (the re-zero lesson) — one bounded depth-1 walk
          for (const sub of [...new Set([...extractTransclusions(wt), ...extractMainArticles(wt)])].slice(0, 15)) {
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
        const cl = await selectAll<{ season_order: number; episode_start: number | null; episode_end: number | null; label: string | null }>(
          'series_components',
          'season_order, episode_start, episode_end, label',
          (q) => q.eq('series_id', t.id).order('season_order'),
        );
        // which season a component LABEL names ("Kingdom 2nd Season",
        // "Mahoutsukai no Yome SEASON 2 Part 2" → 2); null when silent
        // ("Saishuushou", the head season) — callers fall back to position
        const seasonOfLabel = (label: string | null): number | null => {
          const m = String(label ?? '').match(/\b(\d+)(?:st|nd|rd|th)\s+season\b|\bseason\s+(\d+)\b/i);
          if (m) return Number(m[1] ?? m[2]);
          // word ordinals (2026-09-07, Ace act II: AniList labels "Second Season") — the same season the digit form names
          const w = String(label ?? '').match(/\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+season\b/i);
          return w ? ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'].indexOf(w[1].toLowerCase()) + 1 : null;
        };
        // namesake guard for name-only page locks (the Kingdom lesson: the
        // 2007 British drama's list page is "List of Kingdom episodes"): a
        // page whose earliest air date sits years away from our start date
        // is another show, whatever its name says — lib/wiki-identity (G55)
        const datesCompatible = (rows: WikiEpisode[]): boolean => pageFitsSeries(t, rows.map((w) => w.airDate));
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
        const storedTitleByNumber = new Map(storedRows.map((e) => [e.number, String(e.title ?? '').trim()]));
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
        // every page set that LOCKED, with its proven offset and the top of its own numbering — the family-offset carry reads it
        const locked: { name: string; offset: number; pmax: number }[] = [];
        const lockAndMerge = (sets: { name: string; eps: WikiEpisode[]; isOwnArticle?: boolean }[]) => {
        for (const ps of sets) {
          // G55 (the Thunderbolt lesson, 2026-09-06): a numbered table with NO air dates cannot be locked to the run — it is refused whole,
          // whatever page it came from (the main article's own table minted 8 dateless, title-less rows for a seeded series)
          if (!ps.eps.some((w) => w.airDate)) { console.log(`  ${t.id}: table on "${ps.name}" REFUSED — ${ps.eps.length} numbered row(s) with no air date (G55 cannot lock a dateless table)`); continue; }
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
          if (best && best[1] >= 3 && best[1] >= 3 * Math.max(second, 1)) {
            // COMPANION-TABLE GUARD (G55, 2026-09-07 — the re-zero lesson): a list page's own rows were the OVA / shorts table, and the
            // weekly shorts aired the SAME DAYS as the season-2 episodes — 50 exact date votes for +14, a wrong lock that would have
            // merged "Otto's Diary" over rows 51-79. Dates prove a row only when the titles do not contradict it. The measure is
            // MEASURED, not assumed (the catalog dry run): a true table under a different titling system still shares a distinctive
            // word on a quarter of its rows (One Piece's AniFiller titles vs Wikipedia's 4Kids titles: 3 of 13, 5 of 19; Cuckoos'
            // translation variants: 17 of 23) — a companion table shares one on almost none (re-zero's shorts: 1 of 51). So: over
            // the date-matched rows where both sides carry a title, at least ten compared and a distinctive word shared on at most
            // one row in twenty = another table, refused; fewer compared rows is no evidence and the lock stands as before.
            const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'to', 'in', 'on', 'is', 'for', 'with', 'at', 'by', 'from', 'no', 'wa', 'ga', 'ni', 'part', 'episode', 'chapter', 'season']);
            const sharesDistinctive = (a: string, b: string) => {
              const tb = new Set(norm2(b).split(' ').filter(Boolean));
              return norm2(a).split(' ').some((x) => x.length >= 4 && !STOP.has(x) && tb.has(x));
            };
            let agree = 0, compared = 0;
            for (const w of ints) {
              if (!w.airDate || !byDate.has(w.airDate) || !w.title) continue;
              const ours = byDate.get(w.airDate)!;
              if (ours - w.number !== best[0]) continue;
              const st = storedTitleByNumber.get(ours);
              if (!st) continue;
              compared++;
              if (sharesDistinctive(st, w.title) || simTokens(st, w.title) >= 0.75) agree++;
            }
            if (compared >= 10 && agree <= Math.max(1, Math.floor(compared / 20))) {
              console.log(`  ${t.id}: page "${ps.name}" REFUSED — ${best[1] / 2} date matches at offset ${best[0]} but the titles share a distinctive word on only ${agree} of ${compared} (a companion table: shorts / OVAs aired alongside the run)`);
              continue;
            }
            offset = best[0];
          }
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
          locked.push({ name: ps.name, offset, pmax: Math.max(...ints.map((w) => w.number)) });
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
          // FAMILY-OFFSET CARRY (G59 amended 2026-09-07, the Ace act II lesson): a franchise numbers its season sub-pages in ONE
          // family space ("Ace of Diamond Act II season 2" runs 179-191 while our act II tops at 52); a sibling page PROVED the
          // family's offset by votes (-126). A skipped set whose numbering continues a locked page's numbering (pmin = that
          // page's top + 1) takes that page's offset — and must still fit our count and continue the dates, like any
          // continuity lock. Evidence, never a guess: no locked sibling, no carry.
          const carried = (ps: { eps: WikiEpisode[] }): { offset: number; via: string } | null => {
            const ints = ps.eps.filter((w) => Number.isInteger(w.number));
            if (!ints.length) return null;
            const pmin = Math.min(...ints.map((w) => w.number));
            const pmax = Math.max(...ints.map((w) => w.number));
            const firstDate = ints.map((w) => w.airDate).filter(Boolean).sort()[0];
            for (const l of locked) {
              if (pmin !== l.pmax + 1) continue;
              if (pmin + l.offset !== top + 1) continue; // the carried numbering must land exactly where our rows end
              if (pmax + l.offset > ourTopForLock + 2) continue;
              if (lastDate && firstDate && firstDate < lastDate) continue;
              return { offset: l.offset, via: l.name };
            }
            return null;
          };
          let idx = skipped.findIndex((ps) => carried(ps) != null);
          if (idx >= 0) {
            const ps = skipped.splice(idx, 1)[0];
            const c = carried(ps)!;
            const ints = ps.eps.filter((w) => Number.isInteger(w.number));
            wiki = wiki.concat(ps.eps.map((w) => ({ ...w, number: w.number + c.offset })));
            locked.push({ name: ps.name, offset: c.offset, pmax: Math.max(...ints.map((w) => w.number)) });
            console.log(`  ${t.id}: page "${ps.name}" family-offset-locked (continues "${c.via}"'s numbering at offset ${c.offset > 0 ? '+' : ''}${c.offset} → rows from ${top + 1})`);
            continue;
          }
          idx = skipped.findIndex((ps) => {
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
          locked.push({ name: ps.name, offset: 0, pmax: Math.max(...ps.eps.filter((w) => Number.isInteger(w.number)).map((w) => w.number)) });
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
            ...disambiguatedTitles(t.title, t.start_date).flatMap((d) => [`List of ${d} episodes`, d]),
            ...(cased ? disambiguatedTitles(cased, t.start_date).flatMap((d) => [`List of ${d} episodes`, d]) : []),
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
        if (midRunOrderOnly && !wikiAligned && !declaresWikiShift(t.id)) {
          if (!DRY) await fileFlagOnce(runId, t.id, 'wikipedia', 'count_mismatch', {
            note: 'mid-run order-only component and the wiki page shows no fractional separators — numbering space unverified; fills past the insert withheld until a shift is declared or alignment verified',
          });
          counters.flagged++;
        }
        if (fractionals.length) {
          console.log(`  ${t.id}: wiki separates ${fractionals.length} watch-order entr${fractionals.length === 1 ? 'y' : 'ies'} fractionally (${fractionals.map((f) => f.number).join(', ')}) — numbering aligned`);
          // stage every fractional entry durably (Sean's ruling: non-main
          // entries are NOTED so the UI/watch-order phase decides from data)
          for (const f of fractionals) {
            if (DRY) continue;
            await db.from('ingest_fractionals').upsert({
              series_id: t.id,
              position: f.number,
              title: f.title,
              air_date: f.airDate,
              note: 'wiki fractional separator (community between-episodes notation)',
            });
          }
        }
        // wiki numbers → OUR space through the one translation every source
        // uses (N11/N12, 'wiki' space); a number the ruling drops is skipped
        const wikiByNumber = new Map(wiki.filter((w) => Number.isInteger(w.number)).map((w) => [w.number, w]));
        const wikiByOurs = new Map<number, WikiEpisode>();
        for (const w of wikiByNumber.values()) {
          const ours = translateEpisodeNumber(t.id, w.number, 'wiki');
          if (ours != null) wikiByOurs.set(ours, w);
        }
        const existing = new Map(eps.filter((e) => e.series_id === t.id).map((e) => [e.number, e]));
        let filled = 0, conflicts = 0, created = 0, corrected = 0;
        const refused: { number: number; airDate: string; fit: string }[] = [];
        const newRows: any[] = [];
        for (let n = 1; n <= t.aired_episodes; n++) {
          if (midRunOrderOnly && !wikiAligned && !declaresWikiShift(t.id) && n >= firstAfterOrderOnly) continue;
          const w = wikiByOurs.get(n);
          if (!w) continue;
          // G55 identity gate: a row dated outside this series' run is not
          // this series' row — nothing from it is written (title included)
          const fit = dateFit(t, w.airDate);
          if (fit === 'before_start' || fit === 'after_end') {
            refused.push({ number: n, airDate: String(w.airDate), fit });
            continue;
          }
          const cur = existing.get(n);
          if (!cur) {
            newRows.push({ series_id: t.id, number: n, title: w.title ?? '', type: 'canon', air_date: w.airDate });
            continue;
          }
          const curTitle = String(cur.title ?? '').trim();
          const patch: Record<string, unknown> = {};
          // correction mode: a stored title matching the wiki value at the
          // WRONG (untranslated) number is a poisoned fill — rewrite it
          if (w.number !== n && curTitle) {
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
            if (!DRY) await db.from('episodes').update(patch).eq('series_id', t.id).eq('number', n);
            filled++;
          }
        }
        if (newRows.length) {
          const ruled = filterEpisodeRows(t.id, newRows, 'wiki', { sourceType: t.source_type, ties: await loadEpisodeTies(t.id) }); // T26: the side_source default
          if (DRY && ruled.length) console.log(`  ${t.id}: DRY — would create ${ruled.length} row(s) ${ruled[0].number}-${ruled[ruled.length - 1].number} (${ruled[0].air_date ?? '—'} … ${ruled[ruled.length - 1].air_date ?? '—'})`);
          for (let i = 0; i < ruled.length && !DRY; i += 500) {
            const { error } = await db.from('episodes').insert(ruled.slice(i, i + 500).map((r) => ({ ...r, minted_by: 'wiki' }))); // G57: a wiki-created row is the wiki's — no AFL re-resolve may delete it
            if (error) throw new Error(error.message);
          }
          created = ruled.length;
        }
        if (refused.length) {
          const first = refused[0], last = refused[refused.length - 1];
          console.log(`  ${t.id}: G55 REFUSED ${refused.length} row(s) dated outside the series' run (${first.number} ${first.airDate} … ${last.number} ${last.airDate}) — a namesake's page`);
          if (!DRY) await fileFlagOnce(runId, t.id, 'wikipedia', 'match_ambiguous', {
            note: `G55 identity gate: ${refused.length} wiki row(s) dated ${first.fit === 'before_start' ? 'before the series began' : 'after the series ended'} were refused (eps ${first.number}-${last.number}, ${first.airDate}…${last.airDate}) — the page belongs to a namesake; titles/dates withheld`,
            refused: refused.slice(0, 20),
          });
          counters.flagged++;
        }
        if (conflicts > 3) {
          if (!DRY) await fileFlagOnce(runId, t.id, 'wikipedia', 'taxonomy_conflict', {
            conflicts,
            note: 'wiki titles disagree with stored titles on many rows — numbering offset suspected; stored titles kept, verify',
          });
          counters.flagged++;
        }
        if (filled || created) counters.changed++;
        console.log(`  ${t.id}: ${DRY ? 'DRY — would fill' : 'filled'} ${filled}, ${DRY ? 'create' : 'created'} ${created}${corrected ? `, CORRECTED ${corrected} shifted` : ''}${conflicts ? `, ${conflicts} title conflicts (kept stored)` : ''} [${pages.length} page(s)]`);
        await sleep(400);
      } catch (e) {
        console.log(`  ${t.id}: ERROR ${String(e).slice(0, 90)}`);
      }
    }
    if (!DRY) await finishRun(runId, 'ok', counters, `wiki episodes backfill: ${counters.changed} series filled, ${counters.flagged} withheld`);
    console.log(`=== WIKI EPISODES BACKFILL COMPLETE${DRY ? ' (DRY RUN — nothing written)' : ''} ===`);
  } catch (err) {
    if (!DRY) await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0));
