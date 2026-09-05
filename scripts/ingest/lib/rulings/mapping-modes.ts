// Mapping modes — A40 (Sean 2026-08-23): a series ruled `loose` renders its
// anchors as stored and makes no monotonicity claim (volume-jumping, an
// anime-original finale, genuinely untrackable borrow-maps). The column
// series.mapping_mode had NO ruling map until 2026-09-05: INCIDENT-2026-09-05
// deleted city-hunter and elemental-gelade and their 'loose' went with them
// (a DB-only value). Sean 2026-09-05: "restore by an A40 map entry — that
// column had no home; give it one so this cannot happen again." Every loose
// series is an entry here; assert-overrides#assertMappingModes mirrors the
// map (default 'chapter'); a stored value that disagrees is a ruling_violation.
import { toRecord, type RulingEntry } from './types';

const CL = 'docs/changelog.md §12.29-31 (2026-08-23, the MU-pin verification session)';

export const ENTRIES: RulingEntry<'loose'>[] = [
  {
    seriesId: 'ouran-high-school-host-club',
    ruleId: 'A40',
    value: 'loose',
    reason: 'Volume-jumping from ep 10 and an anime-original finale — the anchors are a borrow-map, not a curve; MU pin → continue point 37 (Sean 2026-08-23).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
    cite: [CL],
  },
  {
    seriesId: 'blood-blockade-battlefront',
    ruleId: 'A40',
    value: 'loose',
    reason: 'Borrows chapters out of any order (the A40 witness with Ouran): anchors are maps, not a curve (Sean 2026-08-23).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
    cite: [CL, 'docs/rules.md A40'],
  },
  {
    seriesId: 'rosario-vampire',
    ruleId: 'A40',
    value: 'loose',
    reason: "The ep-26 ch-19 MU pin REJECTED (Wikipedia's series-summary line stamped onto the last episode — ch 19 aired as ep 7); the adaptation borrows out of order — loose (Sean 2026-08-23).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
    cite: [CL],
  },
  {
    seriesId: 'to-love-ru',
    ruleId: 'A40',
    value: 'loose',
    reason: 'The 2008 series is loose (pin 44 → 162 = the manga end; full Motto segment maps + a never-adapted sweep) — an episodic borrow-map (Sean 2026-08-23).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-23',
    cite: [CL],
  },
  {
    seriesId: 'we-never-learn-bokuben',
    ruleId: 'A40',
    value: 'loose',
    reason: 'Pin 26 → 69 verified and promoted as loose (2026-08-23): the adaptation reorders chapters freely.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: [CL],
  },
  {
    seriesId: 'sgt-frog',
    ruleId: 'A40',
    value: 'loose',
    reason: 'A parallel telling where no chapter mapping is meaningful (research-tier verdict; src/types/anime.ts mappingMode gloss names Sgt. Frog) — the card shows an honest state instead of mapping_pending.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
    cite: ['src/types/anime.ts (mappingMode)'],
  },
  {
    seriesId: 'urusei-yatsura',
    ruleId: 'A40',
    value: 'loose',
    reason: "UNRECORDED — stored 'loose' before the map existed (the 2026-09-05 backfill of this map from the ok_loose census listing); the 1981 episodic adaptation borrows chapters out of order. Reason to be written at the next sitting that touches it.",
    ruledBy: 'session',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md'],
  },
  {
    seriesId: 'city-hunter',
    ruleId: 'A40',
    value: 'loose',
    reason: "Stored 'loose' before INCIDENT-2026-09-05 (ok_loose listed it), lost with the row; restored by this entry on Sean's ruling (2026-09-05: 'restore by an A40 map entry'). The original reason was never recorded; the series stays STAGED (P39).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md §Residues'],
  },
  {
    seriesId: 'elemental-gelade',
    ruleId: 'A40',
    value: 'loose',
    reason: "Stored 'loose' before INCIDENT-2026-09-05 (ok_loose listed it), lost with the row; restored by this entry on Sean's ruling (2026-09-05). The original reason was never recorded; the series stays STAGED (P39).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md §Residues'],
  },
  {
    seriesId: 'outlaw-star',
    ruleId: 'A40',
    value: 'loose',
    reason: "A sibling telling with no comparison instrument — the research-tier 'loose' verdict of the parallel re-pass (A40's own Outlaw Star clause; T25 original since T4.1, so no instrument renders either way). Stored 'loose' before this map existed; the entry keeps the stored ruling rather than flipping it silently (2026-09-05).",
    ruledBy: 'session',
    ruledOn: '2026-08-28',
    cite: ['docs/rules.md A40 (Outlaw Star), I40 (the second candidate resolved)'],
  },
];

export const MAPPING_MODES: Record<string, 'loose'> = toRecord(ENTRIES);
export const mappingModeFor = (seriesId: string): 'loose' | 'chapter' => MAPPING_MODES[seriesId] ?? 'chapter';
