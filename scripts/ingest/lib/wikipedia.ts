// Wikipedia chapter-list parsing → volume boundaries. The pages use
// {{Graphic novel list}} templates: VolumeNumber plus ChapterList columns of
// {{Numbered list|start=N|...}} — the start values give chapter boundaries
// deterministically. Volume N spans [its first start .. next volume's first
// start - 1]; the final (ongoing) volume stays open-ended.

const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const UA = 'mangaMapper/0.1 (ingest; contact: seanreedux@gmail.com)';

export interface WikiVolume {
  volume: number;
  chapterStart: number;
}

export function parseVolumes(wikitext: string): WikiVolume[] {
  const out: WikiVolume[] = [];
  // split on template openings; each block runs to the next one
  const blocks = wikitext.split(/\{\{Graphic novel list\s*(?=\|||\n)/i).slice(1);
  for (const block of blocks) {
    const volMatch = block.match(/\|\s*VolumeNumber\s*=\s*(\d+)/i);
    if (!volMatch) continue;
    // chapter numbering appears in three page dialects: {{Numbered list|start=N}},
    // a plain # list opening with #<li value="N"> (Naruto-style pages avoiding
    // the template for transclusion cost), or a bare range in the ChapterList
    // value with a series-specific label ("*Mission: 1–5", Spy×Family-style)
    let startMatch =
      block.match(/\{\{Numbered list\s*\|\s*start\s*=\s*(\d+(?:\.\d+)?)/i) ??
      block.match(/<li value="(\d+(?:\.\d+)?)"/i);
    if (!startMatch) {
      const listValue = block.match(/\|\s*ChapterList\w*\s*=\s*([^\n]*)/i)?.[1] ?? '';
      startMatch = listValue.match(/(\d+(?:\.\d+)?)/);
    }
    if (!startMatch) continue;
    out.push({ volume: Number(volMatch[1]), chapterStart: Number(startMatch[1]) });
  }
  out.sort((a, b) => a.volume - b.volume);
  return out;
}

export interface VolumeBoundary {
  volume: number;
  chapterStart: number;
  chapterEnd: number | null; // null = open (final volume of an ongoing run)
}

// Combine volumes from all part-pages into contiguous boundaries.
// MONOTONIC-START GATE (Sean's Sailor Moon 10-to-3 report, 2026-08-24): each
// end is derived from the NEXT volume's start, so a single mis-parsed start
// produces an IMPOSSIBLE row (v3 "chs 10-3") and silently corrupts every
// volume readout downstream — 24 such rows across 11 manga were live when the
// rule landed. Chapter starts must strictly increase with volume number; a row
// that violates that is a parse artifact, not data, so it is DROPPED and the
// remaining rows re-close around the gap (a slightly coarser table that is
// self-consistent beats a precise-looking contradictory one — the same
// principle as the Ippo v61 partial-boundary rule). `dropped` lets callers
// flag the manga for research instead of silently shipping a thinner table.
export function toBoundaries(volumes: WikiVolume[]): VolumeBoundary[] {
  return boundariesWithDrops(volumes).boundaries;
}

export function boundariesWithDrops(volumes: WikiVolume[]): {
  boundaries: VolumeBoundary[];
  dropped: { volume: number; chapterStart: number; after: number }[];
} {
  const dedup = new Map<number, number>();
  for (const v of volumes) if (!dedup.has(v.volume)) dedup.set(v.volume, v.chapterStart);
  const sorted = [...dedup.entries()].sort(([a], [b]) => a - b);
  const kept: [number, number][] = [];
  const dropped: { volume: number; chapterStart: number; after: number }[] = [];
  for (const [volume, chapterStart] of sorted) {
    const prev = kept[kept.length - 1];
    if (prev && chapterStart <= prev[1]) {
      dropped.push({ volume, chapterStart, after: prev[1] });
      continue;
    }
    kept.push([volume, chapterStart]);
  }
  return {
    boundaries: kept.map(([volume, chapterStart], i) => ({
      volume,
      chapterStart,
      chapterEnd: i + 1 < kept.length ? kept[i + 1][1] - 1 : null,
    })),
    dropped,
  };
}

async function wikiGet(params: Record<string, string>): Promise<unknown> {
  const qs = new URLSearchParams({ format: 'json', formatversion: '2', ...params });
  const res = await fetch(`${WIKI_API}?${qs}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`wikipedia ${res.status}`);
  return res.json();
}

async function prefixFamily(base: string): Promise<string[]> {
  const data = (await wikiGet({
    action: 'query',
    list: 'prefixsearch',
    pssearch: base,
    pslimit: '20',
  })) as { query?: { prefixsearch?: { title: string }[] } };
  const hits = (data.query?.prefixsearch ?? []).map((p) => p.title);
  return hits.filter((t) => t === base || t.startsWith(`${base} (`));
}

// All pages in the "List of X chapters" family (part pages included).
// Titles vary (anime vs manga naming, casing, subtitles) — try candidate
// variants via prefixsearch, then fall back to full-text search.
export async function findChapterPages(titleCandidates: string[]): Promise<string[]> {
  const tried = new Set<string>();
  const variants: string[] = [];
  for (const t of titleCandidates) {
    for (const v of [t, t.replace(/\s*\([^)]*\)\s*$/, '').trim()]) {
      if (v && !tried.has(v.toLowerCase())) {
        tried.add(v.toLowerCase());
        variants.push(v);
      }
    }
  }
  for (const v of variants) {
    const family = await prefixFamily(`List of ${v} chapters`);
    if (family.length) return family;
  }
  // full-text fallback (case-insensitive; catches ALL-CAPS titles and
  // subtitle variants): accept hits shaped like "List of … chapters" with or
  // without a part-page suffix, then expand the family from the base name.
  // The hit's inner title must SHARE TOKENS with a candidate — search ranking
  // alone once returned "List of Ranma ½ chapters" for My Dress-Up Darling.
  const tokens = (s: string) =>
    new Set(s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean));
  const titleAgrees = (inner: string) =>
    variants.some((v) => {
      const a = tokens(inner);
      const b = tokens(v);
      if (!a.size || !b.size) return false;
      let shared = 0;
      for (const t of a) if (b.has(t)) shared++;
      return shared / Math.min(a.size, b.size) >= 0.5;
    });
  for (const v of variants.slice(0, 2)) {
    const data = (await wikiGet({
      action: 'query',
      list: 'search',
      srsearch: `intitle:"chapters" List of ${v}`,
      srlimit: '5',
    })) as { query?: { search?: { title: string }[] } };
    const hit = (data.query?.search ?? []).find((p) => {
      const m = p.title.match(/^List of (.+) chapters(\s*\(.+\))?$/);
      return m !== null && titleAgrees(m[1]);
    });
    if (hit) {
      const base = hit.title.replace(/\s*\(.+\)$/, '');
      const family = await prefixFamily(base);
      if (family.length) return family;
      return [hit.title];
    }
  }
  return [];
}

// ── episode lists (episode-data initiative, §12.19d) ────────────────────────
// Wikipedia episode pages use {{Episode list}} templates: EpisodeNumber
// (overall), EpisodeNumber2 (in-season), Title (plain, quoted, or the
// English arg of {{nihongo|...}}), OriginalAirDate ({{Start date|Y|M|D}}).
// Season part-pages often carry BOTH number columns — the overall column is
// the one that matches our cumulative numbering.

export interface WikiEpisode {
  // overall/cumulative when the page provides it. FRACTIONAL numbers (35.5,
  // 13.5, 0.5) are the community convention for specials/OVAs/movies slotted
  // BETWEEN episodes without being counted — exactly our order-only concept
  // (Sean 2026-08-23: Wikipedia labels Dr. Stone's Ryuusui 35.5). Their
  // presence proves the page shares our numbering space; their data can
  // describe order-only components; they are never episode rows.
  number: number;
  title: string | null;
  airDate: string | null; // ISO yyyy-mm-dd
}

const stripMarkup = (s: string) =>
  s
    .replace(/\{\{[Nn]ihongo\|((?:[^{}|]|\{\{[^{}]*\}\})*?)(\|[^{}]*)?\}\}/g, '$1')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]+)\]\]/g, '$1')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^\s*"|"\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** `Title_1` … `Title_N` of a multi-part {{Episode list}} entry, joined with ' / ' — null when the entry has none */
export function multiPartTitle(block: string): string | null {
  const parts: [number, string][] = [];
  for (const m of block.matchAll(/\|\s*Title_(\d+)\s*=\s*([^\n]*)/gi)) { const t = stripMarkup(m[2]); if (t) parts.push([Number(m[1]), t]); }
  if (!parts.length) return null;
  return parts.sort((a, b) => a[0] - b[0]).map(([, t]) => t).join(' / ');
}

export function parseEpisodeList(wikitext: string): WikiEpisode[] {
  const out: WikiEpisode[] = [];
  const blocks = wikitext.split(/\{\{Episode list/i).slice(1);
  for (const block of blocks) {
    // overall number preferred; a lone EpisodeNumber on a season page may be
    // season-relative — the caller's alignment gate decides trustworthiness
    const overall = block.match(/\|\s*EpisodeNumber\s*=\s*(\d+(?:\.\d+)?)/i);
    if (!overall) continue;
    const number = Number(overall[1]);
    const titleRaw = block.match(/\|\s*Title\s*=\s*([^\n]*)/i)?.[1] ?? '';
    // a TWO-PART episode (2026-09-07, re-zero row 67 — G59): the entry carries `NumParts = N` with `Title_1` … `Title_N` and NO
    // `Title`, so the row minted title-less and the FILL-ONLY event run could never fill it — the parts join with ' / '
    // (the licensor's own form is a full-width slash; en-WP's precedent for a double bill)
    const title = stripMarkup(titleRaw) || multiPartTitle(block) || null;
    const dateMatch =
      block.match(/\{\{Start date\|(\d{4})\|(\d{1,2})\|(\d{1,2})/i) ??
      block.match(/OriginalAirDate\s*=\s*[^\n]*?(\d{4})-(\d{2})-(\d{2})/i);
    const airDate = dateMatch
      ? `${dateMatch[1]}-${String(dateMatch[2]).padStart(2, '0')}-${String(dateMatch[3]).padStart(2, '0')}`
      : null;
    out.push({ number, title, airDate });
  }
  // dedup by number (transcluded rows can repeat); first occurrence wins
  const seen = new Set<number>();
  return out.filter((e) => (seen.has(e.number) ? false : (seen.add(e.number), true))).sort((a, b) => a.number - b.number);
}

// Episode tables often live on SEASON pages transcluded into the main list
// ("List of Dr. Stone episodes" holds only {{:Dr. Stone season N}} markers —
// the raw wikitext has no rows). Depth-1 transclusion targets to follow.
export function extractTransclusions(wikitext: string): string[] {
  const out: string[] = [];
  for (const m of wikitext.matchAll(/\{\{:([^{}|]+)\}\}/g)) out.push(m[1].trim());
  return [...new Set(out)];
}

// Season SUB-ARTICLES a list page links instead of transcluding (2026-09-07, the re-zero lesson: "List of Re:Zero episodes" holds
// only the OVA / shorts table itself and points at "Re:Zero season 3" / "season 4" with {{Main|…}} — the episode tables live there).
// Depth-1 targets to fetch like transclusions; a target with no episode rows is simply empty.
export function extractMainArticles(wikitext: string): string[] {
  const out: string[] = [];
  // {{Main|Title}} / {{Main|Title{{!}}label}} / {{Main article|Title|l1=…}} — the target ends at the first pipe, nested {{!}} or close
  for (const m of wikitext.matchAll(/\{\{\s*(?:Main|Main article|See also)\s*\|\s*([^{}|]+?)\s*(?:\{\{!\}\}|\||\}\})/gi)) out.push(m[1].trim());
  // section transclusions — {{#Section-h:Title|Section}} / {{#section:Title|…}} / {{#lst:Title|…}} — pull a sub-article's table by part
  for (const m of wikitext.matchAll(/\{\{#(?:Section-h|section|lst|lsth):\s*([^{}|]+?)\s*\|/gi)) out.push(m[1].trim());
  return [...new Set(out)];
}

// "List of X episodes" family — mirrors findChapterPages.
export async function findEpisodePages(titleCandidates: string[]): Promise<string[]> {
  const tried = new Set<string>();
  const variants: string[] = [];
  for (const t of titleCandidates) {
    for (const v of [t, t.replace(/\s*\([^)]*\)\s*$/, '').trim()]) {
      if (v && !tried.has(v.toLowerCase())) {
        tried.add(v.toLowerCase());
        variants.push(v);
      }
    }
  }
  for (const v of variants) {
    const family = await prefixFamily(`List of ${v} episodes`);
    if (family.length) return family;
  }
  const tokens = (s: string) =>
    new Set(s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean));
  const titleAgrees = (inner: string) =>
    variants.some((v) => {
      const a = tokens(inner);
      const b = tokens(v);
      if (!a.size || !b.size) return false;
      let shared = 0;
      for (const t of a) if (b.has(t)) shared++;
      return shared / Math.min(a.size, b.size) >= 0.5;
    });
  // every variant is searched (2026-09-07, the re-zero lesson): the two year-disambiguated forms used to occupy the only two
  // search slots while the native title — the one the search resolves — sat fifth; a search is one request per variant
  for (const v of variants) {
    const data = (await wikiGet({
      action: 'query',
      list: 'search',
      srsearch: `intitle:"episodes" List of ${v}`,
      srlimit: '5',
    })) as { query?: { search?: { title: string }[] } };
    const hit = (data.query?.search ?? []).find((p) => {
      const m = p.title.match(/^List of (.+) episodes(\s*\(.+\))?$/);
      return m !== null && titleAgrees(m[1]);
    });
    if (hit) {
      const base = hit.title.replace(/\s*\(.+\)$/, '');
      const family = await prefixFamily(base);
      if (family.length) return family;
      return [hit.title];
    }
  }
  return [];
}

export async function fetchWikitext(pageTitle: string): Promise<string | null> {
  const data = (await wikiGet({
    action: 'parse',
    page: pageTitle,
    prop: 'wikitext',
    redirects: '1',
  })) as { parse?: { wikitext?: string } };
  return data.parse?.wikitext ?? null;
}
