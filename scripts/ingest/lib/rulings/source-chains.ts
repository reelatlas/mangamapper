// I41 — THE SOURCE CHAIN (Sean ruled 2026-09-04): a franchise's reading chain is
// the ordered sequence of NAMED MANGA WORKS (instruments the catalog can count
// chapters in) that tell one continuous story: Rosario + Vampire Season I →
// Season II; Trigun → Trigun Maximum. An episode that adapts material from
// another work on the chain is CANON to the series, told out of order — the
// `chain_source` annotation (T26), position-less (A12 / A44; the anchor column is
// numeric in the entry's own source). Novels, games and parallel tellings are
// NEVER on the chain however the author blessed them: their canon is the
// `adopted` ruling and their record is `side_source`. The chain is what makes
// the two kinds CHECKABLE: a chain_source naming a work off the map, or a
// side_source naming a work on it, is a census mismatch (chain_source_unmapped /
// side_source_on_chain). Convention: a chain_source / side_source annotation's
// chapters field STARTS with the work's label as written here ('Season II: ch 1, 3').
import type { RulingEntry } from './types';
import { toRecord } from './types';

export type ChainWork = { label: string; anilistMangaId: number | null; note?: string };
export type SourceChain = { works: ChainWork[] };

export const ENTRIES: RulingEntry<SourceChain>[] = [
  {
    seriesId: 'rosario-vampire',
    ruleId: 'I41',
    value: { works: [
      { label: 'Season I', anilistMangaId: 30894, note: 'Rosario + Vampire (2004-07), the entry\'s instrument — 40 chapters' },
      { label: 'Season II', anilistMangaId: null, note: 'Rosario + Vampire Season II (2007-14) — the sequel manga; the Capu2 TV season adapts its ch 1 + 3 in ep 14 and is otherwise original' },
    ] },
    reason:
      "Batch 20 wave 16 (verified R24), Sean ruled 2026-09-04: ep 14 adapts Season II ch 1 'A Brand-New Season' + ch 3 'Superglue Girl' inside an original plot — the sequel manga is the same story by the same author, so the material is canon to the series told out of order: mixed, position-less, `chain_source`{Season II: ch 1, 3}. Whether Capu2 should be its own entry with Season II as its instrument is an identity question queued for the identity pass; this chain works either way.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/out/rosario-vampire-w16.json', 'scripts/ingest/research/batch20/verify/w16-types.md'],
  },
  {
    seriesId: 'trigun',
    ruleId: 'I41',
    value: { works: [
      { label: 'Trigun', anilistMangaId: 30703, note: 'Trigun (1995-97), the entry\'s instrument' },
      { label: 'Trigun Maximum', anilistMangaId: null, note: 'Trigun Maximum (1997-2007) — the continuation; its own numbering, never convertible into Trigun\'s' },
    ] },
    reason:
      "Sean ruled 2026-09-04 (the wave-16 sitting): ep 18 adapts Trigun Maximum ch 1 'HERO REBORN' + ch 2 'LINA' — the continuation manga, canon to the series told out of order: the standing `side_source` becomes `chain_source`{Trigun Maximum: ch 1, 2} (the row stays mixed, position-less). The novel / game / parallel boundary keeps naruto-shippuden 452-457 + 484-500 (the Itachi / Sasuke / Shikamaru / Konoha Hiden novels) as side_source + adopted.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch20/WAVE16-RECOVERY.md'],
  },
  {
    seriesId: 'boruto-naruto-next-generations',
    ruleId: 'I41',
    value: { works: [
      { label: 'Naruto', anilistMangaId: 30011, note: 'Naruto (1999-2014), ch 1-700 — the Naruto TV / Shippuden instrument; ep 24 adapts its epilogue ch 700' },
      { label: 'Naruto Gaiden', anilistMangaId: 86171, note: 'Naruto Gaiden: The Seventh Hokage and the Scarlet Spring (2015) — its own tankōbon, printed 700+1…700+10, not inside 30011\'s 700; eps 19-23 adapt it, ep 39 its second one-shot' },
      { label: 'Boruto', anilistMangaId: 87178, note: 'Boruto: Naruto Next Generations (2016-), the entry\'s instrument — its chapter space is 1-80, never 700' },
    ] },
    reason:
      "Batch 21 wave 3 (verified R24), Sean ruled 2026-09-04 (Cursor's framing): one continuity, three instruments — Naruto → Naruto Gaiden → Boruto. Naruto TV and Shippuden share one manga and need no chain; Boruto's instrument is the Boruto manga, so ep 24 adapting Naruto ch 700 is the Rosario-14 shape: the same story in another book's numbers = chain_source, position-less in Boruto's 1-80 space (an anchor of 700 would pretend Boruto's chapters reach 700). The Gaiden is the extra named work (its own tankōbon, 700+1…+10, not inside 30011's 700). Novels stay off the chain. One annotation row per kind (the table's key is series + episode + kind), so ep 24's record names both works in one chapters field, first label checked. Follow-up: eps 19-23 / 39 (stored canon on Gaiden chapters) want chain_source annotations.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/boruto-naruto-next-generations-w3.json', 'scripts/ingest/research/batch21/verify/w3-flips.md', 'scripts/ingest/research/batch21/WAVE3-RECOVERY.md'],
  },
];

export const SOURCE_CHAINS: Record<string, SourceChain> = toRecord(ENTRIES);

const norm = (s: string) => s.trim().toLowerCase();
/** the work label a chain_source / side_source annotation names (the text before the first ':'), or null when unlabelled */
export const annotationWorkLabel = (chapters: string | null | undefined): string | null => {
  const m = /^\s*([^:]{2,60}):/.exec(chapters ?? '');
  return m ? m[1].trim() : null;
};
/** is this label a work on the series' chain? */
export const isChainWork = (seriesId: string, label: string): boolean =>
  (SOURCE_CHAINS[seriesId]?.works ?? []).some((w) => norm(w.label) === norm(label));
