// animefillerlist.com parsing. The page states the data twice — the episode
// table and the Quick List ranges, both semantically classed — so we parse
// both and refuse pages where they disagree (parse_integrity flag upstream).

import * as cheerio from 'cheerio';
import type { EpisodeType } from '../../../src/types/anime';

export const AFL_BASE = 'https://www.animefillerlist.com';

// STAGING vocabulary (G51: AFL's claim is kept verbatim): 'anime-only-canon'
// is AFL's "anime canon" class, mapped to a standing at write by the series'
// source kind (T27, filterEpisodeRows) — never a stored type since T4.3.
export type AflType = EpisodeType | 'anime-only-canon';
const CLASS_TO_TYPE: Record<string, AflType> = {
  manga_canon: 'canon',
  'mixed_canon/filler': 'mixed',
  filler: 'filler',
  anime_canon: 'anime-only-canon',
};

export interface AflEpisode {
  number: number;
  title: string;
  type: AflType;
  airDate: string | null; // YYYY-MM-DD
}

export interface AflShowPage {
  title: string; // display title, h1 minus the " Filler List" suffix
  // The slug the page's own episode links point at. AFL's Drupal aliases can
  // serve show B at /shows/A (rename collisions — chrono-crusade serves Thus
  // Spoke Rohan Kishibe); callers must compare this to the requested slug.
  canonicalSlug: string | null;
  episodes: AflEpisode[];
  // Quick List, expanded to per-episode numbers, for the integrity check
  quickList: Partial<Record<AflType, number[]>>;
  integrity: { ok: boolean; mismatches: string[] };
}

export interface AflIndexEntry {
  slug: string;
  title: string;
}

export function parseShowsIndex(html: string): AflIndexEntry[] {
  const $ = cheerio.load(html);
  const entries: AflIndexEntry[] = [];
  $('#ShowList a[href^="/shows/"]').each((_, el) => {
    const href = $(el).attr('href') ?? '';
    const slug = href.replace('/shows/', '').split('/')[0];
    if (slug) entries.push({ slug, title: $(el).text().trim() });
  });
  return entries;
}

function expandRange(text: string): number[] {
  const m = text.trim().match(/^(\d+)(?:-(\d+))?$/);
  if (!m) return [];
  const start = Number(m[1]);
  const end = m[2] ? Number(m[2]) : start;
  const out: number[] = [];
  for (let n = start; n <= end; n++) out.push(n);
  return out;
}

export function parseShowPage(html: string): AflShowPage {
  const $ = cheerio.load(html);

  const title = $('h1').first().text().replace(/\s*Filler List\s*$/i, '').trim();

  const firstEpisodeHref = $('td.Title a[href^="/shows/"]').first().attr('href') ?? '';
  const canonicalSlug = firstEpisodeHref.split('/')[2] || null;

  const episodes: AflEpisode[] = [];
  $('tr[class]').each((_, el) => {
    const typeClass = ($(el).attr('class') ?? '').split(' ')[0];
    const type = CLASS_TO_TYPE[typeClass];
    if (!type) return; // not an episode row
    const number = Number($(el).find('td.Number').text().trim());
    const title = $(el).find('td.Title').text().trim();
    const date = $(el).find('td.Date').text().trim();
    // Episode 0 is real (OVAs/prologues, e.g. Another) — only reject negatives.
    if (!Number.isFinite(number) || number < 0) return;
    episodes.push({ number, title, type, airDate: /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null });
  });
  episodes.sort((a, b) => a.number - b.number);

  // Duplicate-number rows are KEPT here (G44: staging is a faithful parse).
  // The wiki-edit artefact (Boruto ep 182: the same row twice) is collapsed on
  // the write path by applyNumberingShift — same number + same type keeps the
  // first, exactly the old predicate — and a ruled N11 resort (shugo-chara's
  // doubled 96 = two different episodes) can renumber both rows by position.

  const quickList: Partial<Record<AflType, number[]>> = {};
  $('#Condensed > div[class]').each((_, el) => {
    const type = CLASS_TO_TYPE[($(el).attr('class') ?? '').trim()];
    if (!type) return;
    const nums: number[] = [];
    $(el)
      .find('.Episodes a')
      .each((_i, a) => { nums.push(...expandRange($(a).text())); });
    quickList[type] = nums.sort((a, b) => a - b);
  });

  // Integrity: per type, the table's episode set must equal the Quick List's.
  const mismatches: string[] = [];
  const types = new Set<AflType>([
    ...episodes.map((e) => e.type),
    ...(Object.keys(quickList) as EpisodeType[]),
  ]);
  for (const type of types) {
    const fromTable = episodes.filter((e) => e.type === type).map((e) => e.number);
    const fromQuick = quickList[type] ?? [];
    if (fromTable.length !== fromQuick.length || fromTable.some((n, i) => n !== fromQuick[i])) {
      mismatches.push(
        `${type}: table has ${fromTable.length} eps, quick list has ${fromQuick.length}`,
      );
    }
  }

  return { title, canonicalSlug, episodes, quickList, integrity: { ok: mismatches.length === 0, mismatches } };
}
