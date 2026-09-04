// G59 — THE MINT RULE, path C (Sean ruled 2026-09-04): when AFL has nothing
// usable and no wiki episode list exists, the grid is a RULED GRID minted by
// the MANUAL writer (scripts/ingest/mint-grids.ts, minted_by 'manual'): rows
// with number / title / air date / type and the source cited. Never a
// research apply script. G57 governs deletion (only the manual writer may
// delete a manual row); filterEpisodeRows gates the rows like every writer.
import type { RulingEntry } from './types';
import { toRecord } from './types';

export type GridRow = { number: number; title: string; air_date: string | null; type: 'canon' | 'mixed' | 'filler' };
export type MintedGrid = { rows: GridRow[]; source: string };

export const ENTRIES: RulingEntry<MintedGrid>[] = [
  {
    seriesId: 'shounan-junai-gumi',
    ruleId: 'G59',
    value: {
      source: 'AFL page sh%C5%8Dnan-pure-love-gang (5 rows, titles + dates + types, staged 2026-08-22; held sparse for the resolver by the source_map note) + the batch-17 research anchors (Sean sign-off 2026-08-23: OVA endpoints spot-checked)',
      rows: [
        { number: 1, title: 'Shonan Junai Gumi! Down the Delinquent Highway!', air_date: '1994-01-21', type: 'mixed' },
        { number: 2, title: 'Shonan Junai Gumi! 2', air_date: '1994-09-23', type: 'mixed' },
        { number: 3, title: 'Shonan Junai Gumi! 3 Runaway Angel of Hell', air_date: '1995-06-23', type: 'mixed' },
        { number: 4, title: 'Shonan Junai Gumi! 4 Hunting Death', air_date: '1996-05-24', type: 'mixed' },
        { number: 5, title: 'Shonan Junai Gumi! 5 Forever Onibaku', air_date: '1997-01-24', type: 'mixed' },
      ],
    },
    reason:
      "A five-episode OVA (1994-97) with no wiki episode list; the AFL page carries the five rows but the source_map holds it sparse (anilist_id null, 'AFL page stays sparse-held for validation', 2026-08-23), so the resolver refuses by design and the entry sat with five manual anchors and ZERO rows. Sean ruled 2026-09-04 (G59 path C): the grid is ruled here from AFL's own rows (types mixed per AFL's quick list — each OVA condenses a manga arc with original framing) and minted at the manual tier.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch17/out/shounan-junai-gumi.json'],
  },
];

export const MINTED_GRIDS: Record<string, MintedGrid> = toRecord(ENTRIES);
