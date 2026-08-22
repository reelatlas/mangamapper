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
        const titleCell = hasStart ? cells[2] : cells[1];
        const chaptersCell = hasStart ? cells[3] : cells[2];
        episodes.push({
          number,
          title: titleCell ?? '',
          arc: currentArc,
          canonStart: hasStart ? (cells[1].replace(/[()]/g, '') || null) : null,
          chapters: parseChapters(chaptersCell ?? ''),
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
    const chapter = Math.max(...e.chapters);
    if (chapter < maxSeen) continue; // non-monotonic = junk cell
    maxSeen = chapter;
    out.push({ episode: e.number, chapter, arc: e.arc });
  }
  return out;
}

export function parseSitemap(xml: string): string[] {
  const slugs: string[] = [];
  for (const m of xml.matchAll(/<loc>https?:\/\/www\.animefillerguide\.com\/anime\/([^/<]+)\/?<\/loc>/g)) {
    slugs.push(m[1]);
  }
  return [...new Set(slugs)];
}
