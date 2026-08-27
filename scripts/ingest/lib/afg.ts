// animefillerguide.com parsing — the chapter-anchor source (data-pipeline.md
// §1). WordPress pages titled "Episode to Chapter Conversion Guide": season
// tables of [#, Start, Title, Chapters] rows with arc-label rows between.
// AFG never influences episode TYPES (AFL is the authority); its value is the
// per-episode chapter coverage, densified into chapter_anchors.

import * as cheerio from 'cheerio';

export const AFG_BASE = 'https://www.animefillerguide.com';

export interface AfgEpisode {
  number: number;
  title: string;
  arc: string | null;
  canonStart: string | null; // "(2:05)" timestamps on mixed episodes
  chapters: number[];        // chapters this episode covers (empty = filler/none)
  // AFG's 3-way taxonomy via cell classes: red = filler, blue = mixed,
  // unstyled = canon. Only used where AFL is absent (expansion series) —
  // AFL stays the type authority everywhere it exists.
  type: 'canon' | 'mixed' | 'filler';
}

export interface AfgPage {
  title: string;
  seasons: string[];         // h3 season headers, kept for provenance
  episodes: AfgEpisode[];
}

// Chapters cell ambiguity: ", " separates entries ("3, 4, 5") but bare commas
// are thousands separators ("1,144"). Split on comma-space, then strip
// thousands commas inside tokens.
export function parseChapters(cell: string): number[] {
  const out: number[] = [];
  for (const token of cell.split(/,\s+|;\s*/)) {
    const clean = token.replace(/(\d),(\d{3})\b/g, '$1$2').trim();
    const m = clean.match(/(\d+(?:\.\d+)?)\s*(?:-|–|to)\s*(\d+(?:\.\d+)?)/);
    if (m) {
      const [a, b] = [Number(m[1]), Number(m[2])];
      if (b >= a && b - a < 500) for (let n = a; n <= b; n++) out.push(n);
      continue;
    }
    const single = clean.match(/^(\d+(?:\.\d+)?)$/);
    if (single) out.push(Number(single[1]));
  }
  // no manga has 10k chapters — anything above is a parse artifact
  return out.filter((n) => n > 0 && n < 10000);
}

export function parseAfgPage(html: string): AfgPage {
  const $ = cheerio.load(html);
  const title = ($('title').text() ?? '')
    .replace(/\s*Filler List.*$/i, '')
    .trim();

  const seasons: string[] = [];
  $('h3').each((_, el) => {
    const t = $(el).text().trim();
    if (/^season\s+\d+/i.test(t)) seasons.push(t);
  });

  const episodes: AfgEpisode[] = [];
  let currentArc: string | null = null;
  $('table').each((_, table) => {
    $(table)
      .find('tr')
      .each((_i, tr) => {
        const cells = $(tr)
          .find('td, th')
          .map((_j, c) => $(c).text().trim())
          .get();
        if (!cells.length) return;
        if (cells.length === 1) {
          // DIVIDER lines ("<—— Pelicula 2: The Last Mission ——>") mark
          // where a film/OVA sits in the chart's watch order — they are NOT
          // arc labels and must never become the running arc (propagating
          // one poisoned every later row's arc, and the old divider-pattern
          // anchor guard then dropped whole stretches — the Naruto 6-27
          // regression, 2026-08-23). Watch-order surfacing is the fractional
          // pipeline's job, not the arc field's.
          if (cells[0] && /[—–-]{3,}|^<.*>$/.test(cells[0])) return;
          currentArc = cells[0] || currentArc; // arc label row
          return;
        }
        if (cells[0] === '#' || /^#/.test(cells[0])) return; // header
        // Episode cells are strictly "01." / "1174." — anything else (summary
        // rows, colspan mashes) must NOT digit-concatenate into fake numbers.
        const numMatch = cells[0].trim().match(/^(\d{1,4})\.?$/);
        if (!numMatch) return;
        const number = Number(numMatch[1]);
        if (number <= 0) return;
        const hasStart = /^\(?[\d:]+\)?$/.test(cells[1] ?? '');
        // AFG's newer page formats emit placeholder cells like "(01)." where
        // no real title exists — junk stored as a title renders as a WRONG
        // title (Sean's Dorohedoro report 2026-08-23); normalize to pending
        const rawTitle = hasStart ? cells[2] : cells[1];
        // AFG appends its own "* Filler" marker INSIDE the title cell on
        // some pages — it is table annotation, not the episode's name
        // (Sean's eyeshield report 2026-08-25: 99 stored titles carried it
        // verbatim while the flag itself was never mapped). Strip it; the
        // type signal comes from the row class below.
        const rawClean = rawTitle?.replace(/\s*\*\s*Filler\s*$/i, '');
        const titleCell = rawClean && /^\(?\d{1,4}\)?\.?$/.test(rawClean.trim()) ? '' : rawClean;
        const chaptersCell = hasStart ? cells[3] : cells[2];
        const numberClass = $(tr).find('td').first().attr('class') ?? '';
        episodes.push({
          number,
          title: titleCell ?? '',
          arc: currentArc,
          canonStart: hasStart ? (cells[1].replace(/[()]/g, '') || null) : null,
          chapters: parseChapters(chaptersCell ?? ''),
          type: /\bred\b/.test(numberClass) ? 'filler' : /\bblue\b/.test(numberClass) ? 'mixed' : 'canon',
        });
      });
  });

  // pages can repeat an episode across tables (recap boxes) — keep first
  const seen = new Set<number>();
  const deduped = episodes.filter((e) => (seen.has(e.number) ? false : (seen.add(e.number), true)));
  deduped.sort((a, b) => a.number - b.number);

  return { title, seasons, episodes: deduped };
}

// Anchor derivation from a parsed page, with a monotonicity filter: chapters
// never decrease as episodes advance, so any anchor below the running maximum
// is page junk (AFG's Naruto page: ep 141 → "ch 21") and gets dropped.
// Canonical adaptation-list serialization (Sean's full-record ruling
// 2026-08-23): comma-separated, consecutive integer runs compressed to
// ranges, ORDER PRESERVED AS ADAPTED — "63-64, 67" keeps TokyoRev's
// pulled-forward ch 67 visible; "8-10, 15.5" keeps Vanitas's woven-in bonus.
export function serializeChapters(chapters: number[]): string {
  const parts: string[] = [];
  let runStart: number | null = null;
  let runEnd: number | null = null;
  const flush = () => {
    if (runStart === null) return;
    parts.push(runStart === runEnd ? String(runStart) : `${runStart}-${runEnd}`);
    runStart = runEnd = null;
  };
  for (const c of chapters) {
    if (Number.isInteger(c) && runEnd !== null && c === runEnd + 1) {
      runEnd = c;
      continue;
    }
    flush();
    if (Number.isInteger(c)) {
      runStart = runEnd = c;
    } else {
      parts.push(String(c));
    }
  }
  flush();
  return parts.join(', ');
}

export function deriveAnchors(
  episodes: AfgEpisode[],
): { episode: number; chapter: number; startChapter: number; chaptersAdapted: string; arc: string | null }[] {
  // the derived POSITION anchor uses the highest MAINLINE (integer) chapter
  // per row — a fractional value in the chart is a bonus/Memoire entry
  // (Vanitas ep-5 listed "8, 9, 10, 15.5"; taking the max scraped 15.5).
  // The row's FIRST mainline chapter is the episode's START — real source
  // data (Sean's ruling 2026-08-23: display anchors at starts), captured
  // here rather than re-derived by formula downstream. Bonus chapters are
  // NEVER silently dropped: deriveBonusChapters records them, and a
  // research-verified fractional anchor MAY be written at the manual tier
  // when the bonus IS what the episode adapts.
  const candidates: { episode: number; chapter: number; startChapter: number; chaptersAdapted: string; arc: string | null }[] = [];
  for (const e of [...episodes].sort((a, b) => a.number - b.number)) {
    const mainline = e.chapters.filter((c) => Number.isInteger(c));
    if (!mainline.length) continue; // bonus-only episode: association recorded, anchor is research's call
    candidates.push({
      episode: e.number,
      chapter: Math.max(...mainline),
      startChapter: Math.min(...mainline),
      // the FULL record, bonus values included, in adaptation order
      chaptersAdapted: serializeChapters(e.chapters),
      arc: e.arc,
    });
  }
  // SPIKE FILTER: keep the longest non-decreasing chapter subsequence. A
  // stray value — divider-row digits merging into a row, a flash-forward
  // graft (HxH ep-83 carried ch 288 mid-Chimera-lead-in) — is an outlier
  // against the chart's own trend and gets dropped, without the old
  // arc-pattern guard that nuked whole stretches when a divider's text
  // propagated as the running arc label (the Naruto 6-27 regression).
  if (candidates.length < 2) return candidates;
  const lis: number[] = new Array(candidates.length).fill(1);
  const prev: number[] = new Array(candidates.length).fill(-1);
  let best = 0;
  for (let i = 1; i < candidates.length; i++) {
    for (let j = 0; j < i; j++) {
      if (candidates[j].chapter <= candidates[i].chapter && lis[j] + 1 > lis[i]) {
        lis[i] = lis[j] + 1;
        prev[i] = j;
      }
    }
    if (lis[i] > lis[best]) best = i;
  }
  const keep = new Set<number>();
  for (let i = best; i >= 0; i = prev[i]) {
    keep.add(i);
    if (prev[i] === -1) break;
  }
  const kept = candidates.filter((_, i) => keep.has(i));
  // START sanity (Sean's Oshi ep-4 report, 2026-08-23): the row's raw min is
  // poisoned by stray low values — grafts/backfills a chart lists alongside
  // the mainline (Oshi ep 4 listed a stray 10 beside 17-19 → start read 10).
  // The start must sit on the same trend the LNDS kept: recompute it as the
  // lowest chapter ≥ the previous kept row's end (a split chapter is SHARED —
  // equal is legal; charts double-list the boundary chapter, so a derived
  // start one BELOW the previous end is chart noise, not data — the Fairy
  // Tail 277 / One Piece 510 dip class). Off-trend values stay recorded in
  // chapters_adapted — data, not position. Research-tier starts are exempt
  // (page-cited splits are exact).
  let prevEnd = 0;
  const eps = new Map(episodes.map((e) => [e.number, e]));
  for (const k of kept) {
    const mainline = (eps.get(k.episode)?.chapters ?? []).filter((c) => Number.isInteger(c));
    const onTrend = mainline.filter((c) => c >= prevEnd && c <= k.chapter);
    k.startChapter = onTrend.length ? Math.min(...onTrend) : k.chapter;
    prevEnd = k.chapter;
  }
  return kept;
}

// Bonus/fractional chapters a chart associates with episodes (Sean's ruling
// 2026-08-23): real content making up the episode — recorded so we always
// know they exist (asterisk workflow now, possible "everything in this
// episode" UI later), even though they don't drive the derived position.
export function deriveBonusChapters(episodes: AfgEpisode[]): { episode: number; chapters: number[] }[] {
  const out: { episode: number; chapters: number[] }[] = [];
  for (const e of [...episodes].sort((a, b) => a.number - b.number)) {
    if (!e.chapters.length) continue;
    const bonus = e.chapters.filter((c) => !Number.isInteger(c));
    if (bonus.length) out.push({ episode: e.number, chapters: bonus });
  }
  return out;
}

// ── continua-manga table (Sean's full-source ruling 2026-08-23) ─────────────
// Every AFG page — chartless all-canon shows included — carries a structured
// "Where does the anime end? / Where should I start reading?" table:
// end-of-anime frontier (episode → chapter equivalence), the continue-from
// chapter, and that chapter's print volume with its collected range (a real
// volume boundary). The heading names the series — pages exist where the
// template names the WRONG series (SHY's said Kamonohashi Ron), so the
// heading is captured for the apply step's identity guard, never trusted
// blindly. Wikipedia + research stay co-verifiers everywhere (Sean: AFG
// coverage never limits the other sources).
export interface AfgContinua {
  heading: string | null; // series name the table claims to describe
  endEpisode: number | null; // absolute episode number of the frontier
  endSeason: number | null;
  endChapter: number | null; // highest chapter the frontier episode reaches
  continueChapter: number | null; // "start reading from Chapter N"
  continueVolume: number | null;
  volumeStart: number | null; // that volume's collected range
  volumeEnd: number | null;
  text: string; // the table's plain text — citation + future re-parses
}

const num = (s: string | undefined | null): number | null => (s ? Number(s) : null);

// AFG serves smart-quote apostrophes etc. as numeric entities — decode so
// headings compare cleanly ("Hell&#8217;s Paradise" → "Hell's Paradise")
const decodeEntities = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));

/** Drop "(p. 23-36)" style page groups (and any other parenthetical) from an
 * equivalence list so only chapter numbers remain. Exported for tests. */
export function stripParentheticals(s: string): string {
  return s.replace(/\([^)]*\)/g, ' ');
}

export function parseContinua(html: string): AfgContinua | null {
  const i = html.indexOf('continua-manga');
  if (i < 0) return null;
  const end = html.indexOf('</table>', i);
  const text = decodeEntities(
    html
      .slice(i, end < 0 ? i + 4000 : end)
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );

  const heading = /Where to start (.+?) manga after (?:the )?anime/i.exec(text)?.[1]?.trim() ?? null;

  // frontier: "ended at episode 99 (14 of Season 3)" | "ended at episode 23
  // of Season 1" | "last canon episode that aired is 12th of Season 1"
  let endEpisode: number | null = null;
  let endSeason: number | null = null;
  const mAbs = /ended at episode (\d+)(?:\s*\(\s*\d+ of Season (\d+)\s*\))?(?:\s*of Season (\d+))?/i.exec(text);
  const mLast = /last canon episode[^.]*?is (?:the )?(\d+)(?:st|nd|rd|th)?(?:\s*(?:episode)?\s*of Season (\d+))?/i.exec(text);
  if (mAbs) {
    endEpisode = num(mAbs[1]);
    endSeason = num(mAbs[2]) ?? num(mAbs[3]);
  } else if (mLast) {
    endSeason = num(mLast[2]);
    // season-relative: only trustable as absolute for season 1
    endEpisode = endSeason === null || endSeason === 1 ? num(mLast[1]) : null;
  }

  // the equivalence list runs to " of the manga" / sentence end ("Chapter
  // 150, 151, 152, 153, 154 and 155 of the manga") — frontier = its max;
  // continueChapter-1 must agree (the apply step's self-consistency gate).
  // AFG annotates partial chapters with page groups — "Chapter 104
  // (p. 23-36), 105, 106, 107 and 108 (p. 1-19) of the manga" — so a "."
  // followed by digits is NOT a sentence end, and every parenthetical is
  // stripped before the max: page numbers are not chapters (batch 19 wave 2,
  // 2026-08-27: the lazy `[^.]*?` capture stopped at "p." and rendered a
  // too-low frontier on 14 series — solo-leveling 104 for AFG's own 108).
  const mCh = /(?:corresponds? to|equivalent to) Chapters? (.*?)(?: of the manga|\.(?!\s*\d)|$)/i.exec(text);
  const endChapter = mCh
    ? Math.max(...(stripParentheticals(mCh[1]).match(/\d+/g) ?? ['0']).map(Number)) || null
    : null;

  const continueChapter = num(/start reading from Chapter (\d+)/i.exec(text)?.[1]);
  const mVol = /Volume (\d+) \(collect(?:s|ing) chapters? (\d+) to (\d+)\)/i.exec(text);

  return {
    heading,
    endEpisode,
    endSeason,
    endChapter,
    continueChapter,
    continueVolume: num(mVol?.[1]),
    volumeStart: num(mVol?.[2]),
    volumeEnd: num(mVol?.[3]),
    text,
  };
}

export function parseSitemap(xml: string): string[] {
  const slugs: string[] = [];
  for (const m of xml.matchAll(/<loc>https?:\/\/www\.animefillerguide\.com\/anime\/([^/<]+)\/?<\/loc>/g)) {
    slugs.push(m[1]);
  }
  return [...new Set(slugs)];
}
