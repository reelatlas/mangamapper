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
        const titleCell = rawTitle && /^\(?\d{1,4}\)?\.?$/.test(rawTitle.trim()) ? '' : rawTitle;
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
export function deriveAnchors(episodes: AfgEpisode[]): { episode: number; chapter: number; arc: string | null }[] {
  const out: { episode: number; chapter: number; arc: string | null }[] = [];
  let maxSeen = 0;
  for (const e of [...episodes].sort((a, b) => a.number - b.number)) {
    if (!e.chapters.length) continue;
    // AFG interleaves DIVIDER rows for films/specials ("<—— Pelicula 2:
    // The Last Mission ——>") whose stray digits parse as chapters — HxH's
    // ep-83 got an impossible ch-288 from one (2026-08-23). Never anchors.
    if (e.arc && /—{3,}|pel[ií]cula|movie|film|special/i.test(e.arc)) continue;
    const chapter = Math.max(...e.chapters);
    if (chapter < maxSeen) continue; // non-monotonic = junk cell
    maxSeen = chapter;
    out.push({ episode: e.number, chapter, arc: e.arc });
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
  // continueChapter-1 must agree (the apply step's self-consistency gate)
  const mCh = /(?:corresponds? to|equivalent to) Chapters? ([^.]*?)(?: of the manga|\.)/i.exec(text);
  const endChapter = mCh
    ? Math.max(...(mCh[1].match(/\d+/g) ?? ['0']).map(Number)) || null
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
