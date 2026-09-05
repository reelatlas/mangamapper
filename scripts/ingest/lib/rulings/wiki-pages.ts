// G59 — THE MINT RULE, path B (Sean ruled 2026-09-04): when AFL has nothing for
// an entry (no page / an empty page) and the wiki page FINDER cannot locate the
// episode list (a namesake wins the search — orient's finder returned the 1987
// TMNT seasons, refused by G55; a franchise-numbered list wins over the show's
// own table — code-black), the page is RULED here and the wiki writer mints the
// grid from it (minted_by 'wiki'; G55 identity and the alignment gates still
// apply). Never a research apply script; A42 display synthesis stays the lag
// fallback, not a source of rows.
import type { RulingEntry } from './types';
import { toRecord } from './types';

export type WikiPage = { page: string; note?: string };

export const ENTRIES: RulingEntry<WikiPage>[] = [
  {
    seriesId: 'orient',
    ruleId: 'G59',
    value: { page: 'Orient (manga)', note: 'the series article carries the 24-row episode table (cumulative 1-24 across the two cours); no "List of Orient episodes" page exists — the finder matched the 1987 TMNT season pages instead (G55 refused all 18 rows)' },
    reason:
      "Batch 20 wave 8 (out/orient.json, verified R24): the entry held ZERO rows — AFL staged an empty page (parse_integrity {empty:true}); ja-WP 各話リスト, en-WP 'Orient (manga)' #Episodes and syobocal (TID 6215 / 6393) agree on all 24 titles and dates. Sean ruled 2026-09-04 (G59, the mint rule): the wiki writer mints the grid from the ruled page.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/orient.json', 'scripts/ingest/research/batch20/verify/orient.md'],
  },
  {
    seriesId: 'cells-at-work-code-black',
    ruleId: 'G59',
    value: { page: 'Cells at Work! Code Black', note: "the series article's own 13-row table; the finder's 'List of Cells at Work! episodes' is the franchise list with overall numbering (withheld 2026-08-23: numbering exceeds our aired count)" },
    reason:
      "Batch 20 wave 9 (out/cells-at-work-code-black.json, verified R24): the entry held ZERO rows — AFL staged an empty page; ja-WP 各話リスト, en-WP 'Cells at Work! Code Black' and syobocal TID 5849 agree on every date and title (the 13-row map already carries anchors + a reorder zone, A42). Sean ruled 2026-09-04 (G59): the wiki writer mints the grid from the ruled page.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/cells-at-work-code-black.json', 'scripts/ingest/research/batch20/verify/cells-at-work-code-black.md'],
  },
  // ── the first seeded series (discovery step 3, Sean's mint go 2026-09-05) ──
  {
    seriesId: 'trigun-stampede',
    ruleId: 'G59',
    value: { page: 'Trigun Stampede', note: "the series article carries the 24-row table in OVERALL numbering (Stampede 1-12, Stargaze 13-24 — 'Trigun Stargaze' redirects to it); the finder returned nothing for the all-caps AniList title" },
    reason:
      "The seeded series (I42 witness #2) has no AFL / AFG page; the wiki finder found no list page for 'TRIGUN STAMPEDE' (the article is title-cased) and the main-article fallback could not lock. en-WP 'Trigun Stampede' #Episodes: 24 rows numbered 1-24 across both seasons, first 'Noman's Land' 2023-01-07 — matching the two components 1-12 / 13-24 (component lock, overall numbering). Sean's mint go 2026-09-05.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['docs/changelog.md §12.125', 'https://en.wikipedia.org/wiki/Trigun_Stampede'],
  },
  {
    seriesId: 'konosuba-an-explosion-on-this-wonderful-world',
    ruleId: 'G59',
    value: { page: 'KonoSuba: An Explosion on This Wonderful World!', note: "the series article's own 12-row table; the finder returned 'List of KonoSuba episodes' — the franchise list (the code-black shape: a franchise-numbered list wins over the show's own table) and the writer correctly refused to lock it" },
    reason:
      "The seeded series (I42 witness #3) has no AFL / AFG page; the finder matched the franchise's episode list, which the offset lock refused. en-WP 'KonoSuba: An Explosion on This Wonderful World!' #Episodes: 12 rows numbered 1-12, first 'The Crimson-Eyed Wizards' 2023-04-06 — the one component 1-12. Sean's mint go 2026-09-05.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['docs/changelog.md §12.125', 'https://en.wikipedia.org/wiki/KonoSuba:_An_Explosion_on_This_Wonderful_World!'],
  },
];

export const WIKI_PAGES: Record<string, WikiPage> = toRecord(ENTRIES);
