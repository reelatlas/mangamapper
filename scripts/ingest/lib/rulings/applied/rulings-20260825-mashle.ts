// Applied rulings — Sean's fractional ruling, 2026-08-25 (CHUNK1-RECOVERY.md
// §9), applied by scripts/ingest/apply-rulings-20260825-mashle.ts (the cited,
// runnable record; NOT modified). In-between entries (specials/OVAs/recaps/
// movies) live at FRACTIONAL watch-order positions (the Crunchyroll/community
// convention), never absorbed as integer rows. Mashle's S1 recap sat as
// integer row 7 (AFL numbering), shifting every later row one off from
// AFG/fandom/Wikipedia/AniList and making the AFG anchors on rows 8-12 each
// one row early (batch-17 A1 lane finding, cross-model verified 4/4).
// One RulingEntry per migration step. The durable guard —
// SOURCE_NUMBERING_SHIFTS['mashle-magic-and-muscles'] (spaces: ['afl']) — is a
// STANDING map and lives with its own rulings file, not here.
// Changelog record: docs/changelog.md §12.45 / §12.46.

import type { RulingEntry } from '../types';

const SCRIPT = 'scripts/ingest/apply-rulings-20260825-mashle.ts';
const RECOVERY = 'scripts/ingest/research/batch17/CHUNK1-RECOVERY.md §9';
const A1_LANE = 'scripts/ingest/research/batch17/out2/mashle-magic-and-muscles-a1.json';
const SID = 'mashle-magic-and-muscles';
const D = '2026-08-25';
const RECAP_TITLE = 'Mash Burnedead and the Mysterious Letter';

export const ENTRIES: RulingEntry[] = [
  // 1. recap row 7 → watch-order entry 6.5 (+ ingest_fractionals record)
  {
    seriesId: SID, ruleId: 'N9',
    value: { from_row: 7, position: 6.5, title: RECAP_TITLE, kind: 'recap', disposition: 'excluded_recap', chapters_adapted: '1-16 (recap)', retired_annotation: { episode: 7, kind: 'abridged' } },
    reason: "S1 recap ('Episode 6.5' on mashle.fandom; excluded by Wikipedia/AniList; AFL numbers it 7) recaps chs 1-16 and adapts nothing new — the community convention holds it BETWEEN eps 6 and 7, so it moves to watch_order_entries 6.5 (kind recap) mirrored in ingest_fractionals as excluded_recap; its ep-7 abridged annotation retires into the entry's note; surfacing decided at the specials/OVAs design pass",
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, RECOVERY, A1_LANE, '§12.45'],
  },
  // 2. renumber rows 8-25 → 7-24 (ascending so the PK is never contested)
  {
    seriesId: SID, ruleId: 'N11',
    value: { rows: '8-25', offset: -1, into: '7-24', travels: ['title', 'type', 'air_date'] },
    reason: 'with the recap out of the integer space every later row was one too high vs AFG/fandom/Wikipedia/AniList; rows 8-25 renumber to 7-24 (titles/types/air dates travel with the rows). AFL is now the ONLY source in the old numbering — the standing SOURCE_NUMBERING_SHIFTS entry (spaces: [afl]) translates AFL refreshes forever; AFG/wiki need no translation',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, RECOVERY, '§12.45'],
  },
  // 3. AFG anchors 1-12 STAY KEYED AS-IS
  {
    seriesId: SID, ruleId: 'N13',
    value: { anchors: '1-12 (afg)', change: 'none — correct in place after the row renumber' },
    reason: 'the AFG anchors on rows 1-12 were always authored in the recap-exclusive (6.5) space, so renumbering the rows under them makes every one correct in place with zero anchor edits (verified: anchor(8) = chs 20-23 is fandom ep 8 "Wolves of Magic", which becomes our row 8). This is why mashle ep 7 is NOT in batch 17\'s DELETIONS_APPROVED',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, RECOVERY, A1_LANE, '§12.45'],
  },
  // 4. manual tail anchors 24/25 (batch-17 records in OLD numbering) → 23/24, annotations with them
  {
    seriesId: SID, ruleId: 'N13',
    value: { anchors: { 24: 23, 25: 24 }, annotations: 'episode 24→23, 25→24' },
    reason: 'the two manual tail anchors from batch 17 were delivered in the OLD numbering, so they travel with their rows (24→23, 25→24) and their annotations move with them — anchors and annotations translate like episode rows. The batch-17 mashle verdict files are HELD by name from now on (their keys are stale)',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, RECOVERY, 'scripts/ingest/research/batch17/out/mashle-magic-and-muscles.json', '§12.45'],
  },
  // 5. counts
  {
    seriesId: SID, ruleId: 'N20',
    value: { aired_episodes: 24 },
    reason: 'aired_episodes 25 → 24: a shift-ruled count never includes the dropped (fractional) row; season components 1-12 / 13-24 / 25+ were already correct for the new numbering',
    ruledBy: 'Sean', ruledOn: D, cite: [SCRIPT, RECOVERY, '§12.45'],
  },
];
