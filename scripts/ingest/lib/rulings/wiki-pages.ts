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
];

export const WIKI_PAGES: Record<string, WikiPage> = toRecord(ENTRIES);
