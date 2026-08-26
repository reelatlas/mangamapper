// COMMUNITY_COUNT_OVERRIDES — per-series episode-count caps (N3). Sean
// 2026-08-24: the community-consensus episode count is the truth —
// specials / ep-0s the community numbers are IN; large events it does not
// number are order-only components. A cap is entered where a SOURCE numbers
// content the consensus does not. Enforced at every episode-row write (rows
// above the cap drop, filterEpisodeRows) and as a totals clamp after the
// episode floor (applyCommunityCap).
//
// Consumer shape: Record<seriesId, { cap, note }> — `note` is what the
// consumer reads; `reason` is the ruling record.

import type { RulingEntry } from './types';
import { toRecord } from './types';

export type CommunityCount = { cap: number; note: string };

export const ENTRIES: RulingEntry<CommunityCount>[] = [
  {
    seriesId: 'psycho-pass',
    ruleId: 'N3',
    value: { cap: 41, note: 'First Inspector + films are watch-order events, not numbered episodes (Sean 2026-08-24)' },
    reason:
      'AFL numbers First Inspector as 42-44, but the community treats it and the films as watch-order events, not numbered episodes — 41 episodes.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'monogatari-series',
    ruleId: 'N3',
    value: { cap: 100, note: 'community numbering excludes the 3 Second Season recaps (Sean 2026-08-24)' },
    reason:
      "AniList's Second Season count includes 3 recaps the community numbering excludes (the recap rule, N8) — 100 episodes.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'high-school-dxd',
    ruleId: 'N3',
    value: { cap: 48, note: "HERO's Episode 0 is a mid-run special the community's continuous numbering excludes — order-only (Sean 2026-08-24)" },
    reason:
      "HERO's Episode 0 is a mid-run special the community's continuous numbering excludes; it holds an order-only slot, so the count caps at 48.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'urusei-yatsura',
    ruleId: 'N3',
    value: { cap: 194, note: 'MAL/AniList count the farewell RECAP special (rebroadcast of ep 44 + countdown) as #194; Wikipedia holds it at 193.5 unnumbered — recap rule (Monogatari precedent): excluded, finale = 194 (research-verified 2026-08-23)' },
    reason:
      'MAL/AniList count the farewell recap special (a rebroadcast of ep 44 plus a countdown) as #194 while Wikipedia holds it at 193.5 unnumbered; under the recap rule (N8, Monogatari precedent) it is excluded and the finale is 194.',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'yu-yu-hakusho-ghostfiles',
    ruleId: 'N3',
    value: { cap: 112, note: 'TV run = 112; trailing extras (2009 Picture Drama, 2018 OVAs Two Shot/All or Nothing) are order-only — AFL renumbers them after drops, so the CAP is the durable instrument (the drop[113] alone let All or Nothing re-enter as 113; research batch 11, 2026-08-23)' },
    reason:
      'The TV run is 112; the trailing extras (2009 Picture Drama, 2018 OVAs Two Shot / All or Nothing) are order-only. AFL renumbers them after drops, so the numbering-shift drop[113] alone let All or Nothing re-enter as 113 — the cap is the durable instrument (research batch 11).',
    ruledBy: 'session',
    ruledOn: '2026-08-23',
  },
  {
    seriesId: 'cardcaptor-sakura',
    ruleId: 'N3',
    value: { cap: 71, note: 'Clear Card split (Sean 2026-08-24); AFL page spans both series' },
    reason:
      'Clear Card is a SEPARATE series (the Naruto→Shippuden pattern: different manga, AniList 87296). The shared AFL page numbers through 93; rows beyond 71 (1998 TV 1-70 + Prologue OVA 71) belong to cardcaptor-sakura-clear-card in its own 1-22 numbering.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
  },
  {
    seriesId: 'eyeshield-21',
    ruleId: 'N3',
    value: { cap: 145, note: 'AFG\'s chart typos its finale row as "155." (the page has 145 rows) — the cap keeps the phantom from re-entering via extend/expansion (Sean 2026-08-25, §12.49); the anime is 145 episodes on every real source' },
    reason:
      'AFG\'s chart typos its finale row as "155." while the page has 145 rows; the anime is 145 episodes on every real source. The cap keeps the phantom from re-entering via extend/expansion (the former EXTRAS_ADOPTED floor rationalized this typo — N2).',
    ruledBy: 'Sean',
    ruledOn: '2026-08-25',
    cite: ['docs/data-pipeline.md §12.49'],
  },
  {
    seriesId: 'project-arms',
    ruleId: 'N3',
    value: { cap: 52, note: 'AFL row 53 "PS2 Video Game" is a Bandai PS2 game absorbed as an episode row (air date 2002-03-28 sits BEFORE ep 52\'s — verifier-confirmed 2026-08-25); the anime is 52 eps (26+26). Cap keeps the phantom from re-entering on any AFL refresh' },
    reason:
      'AFL row 53 "PS2 Video Game" is a Bandai PS2 game absorbed as an episode row (its air date 2002-03-28 sits BEFORE ep 52\'s — verifier-confirmed); the anime is 52 episodes (26+26). The cap keeps the phantom from re-entering on any AFL refresh.',
    ruledBy: 'session',
    ruledOn: '2026-08-25',
    cite: ['scripts/ingest/research/batch17/out/project-arms.json'],
  },
];

export const COMMUNITY_COUNT_OVERRIDES: Record<string, CommunityCount> = toRecord(ENTRIES);
