// Discovery rulings — I42 (the candidate rule; Sean's go 2026-09-05 on
// scripts/ingest/research/discovery/PROPOSAL.md v2.2). Two kinds of record,
// one file, both read ONLY by the discovery derivation (lib/discovery.ts) and
// the sitting: nothing here is a writer gate, and a PROPOSAL never writes.
//
//   OPEN_ENDED_ENTRIES — keyed by OUR series id (I15 declared open-ended):
//     "every new SEQUEL part of this series joins as a component whatever its
//     title". This is a DECLARED property of an I15 ruling, never inferred
//     from OVERRIDE_CHAINS presence (that map is the declared CURRENT chain and
//     holds tokyo-ghoul, cardcaptor-sakura, bleach-thousand-year-blood-war —
//     ruled splits whose next sequel is a fork). Witness pair: JoJo Steel Ball
//     Run (190327 — every JoJo component carries a new subtitle, so only this
//     declaration proposes it right) vs Fairy Tail 100 Years Quest (139095 —
//     Fairy Tail's three seasons are one story with NO such declaration, and
//     100YQ is a ruled separate sequel; the signals say `series`, correctly).
//   CANDIDATE_ENTRIES — keyed 'anilist:<id>' (an AniList entry that is NOT a
//     series yet; the 'manga:<id>' convention's sibling): the disposition Sean
//     ruled at a sitting — `series` (promote: the seed writer's durable
//     provenance, as canon-tier's TARGETS was), `excluded` (reason) or
//     `deferred` (reason + retiresWhen). Component promotions are NOT here:
//     they are OVERRIDE_CHAINS ruled extensions (I27); extras are RULED_STRUCTURE
//     (I39) or watch-order rulings (N7). Defaults by rule keep this map small:
//     CHARACTER / MUSIC edges are ignored and standalone MOVIE / OVA / SPECIAL
//     relations are I13 standalone — neither needs an entry.
//   SITTINGS — the sitting log: discovery_new_since_sitting lists what the
//     staging has found since the last one.

import type { RulingEntry } from './types';

export type OpenEnded = { openEnded: true };

export type DiscoveryDisposition = 'series' | 'excluded' | 'deferred';
export type DiscoveryRuling = {
  disposition: DiscoveryDisposition;
  /** disposition 'series': the slug the seed writer mints (I1); else slugified from the title */
  slug?: string;
  /** disposition 'series': the relation to record (I17), newer / derived → base */
  relation?: { to: string; kind: 'sequel' | 'prequel' | 'side_story' | 'spin_off' | 'remake' | 'alternative' };
  /** disposition 'series': the franchise the membership sitting records (the franchises map is the one home; this is the pointer) */
  franchise?: string;
};

const FR = 'docs/franchise-rulings.md';

export const OPEN_ENDED_ENTRIES: RulingEntry<OpenEnded>[] = [
  {
    seriesId: 'jojos-bizarre-adventure',
    ruleId: 'I15',
    value: { openEnded: true },
    reason:
      "Sean 2026-08-22: JoJo's Bizarre Adventure = ONE series, parts as clearly-labeled components. Every part carries its own subtitle (Stardust Crusaders, Diamond wa Kudakenai, Ougon no Kaze, Stone Ocean), so title continuity alone would propose each new part as a separate series — the declared open-ended property is what proposes Steel Ball Run (190327) as a component. OVERRIDE_CHAINS presence carries no such meaning (I42).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-22',
    cite: [`${FR} "Ruled by Sean 2026-08-22" item 1`, 'scripts/ingest/research/discovery/PROPOSAL.md §1.5'],
  },
  {
    seriesId: 'monogatari-series',
    ruleId: 'I15',
    value: { openEnded: true },
    reason:
      'Sean 2026-08-22 (unheld with JoJo): Monogatari = ONE series with novel-season components (First / Second / Final / Off & Monster); a new novel season joins as a component whatever its title.',
    ruledBy: 'Sean',
    ruledOn: '2026-08-22',
    cite: [`${FR} "Final rulings" Monogatari`, 'scripts/ingest/lib/rulings/override-chains.ts monogatari-series'],
  },
  {
    seriesId: 'gintama',
    ruleId: 'I15',
    value: { openEnded: true },
    reason:
      "The 2026-08-22 franchise pass (clear consensus): Gintama = ONE series (~369 eps; AniList's title-per-run entries = seasons) — a new run joins as a component whatever its title.",
    ruledBy: 'session',
    ruledOn: '2026-08-22',
    cite: [`${FR} "Final rulings" Gintama`],
  },
];

/** the first sitting writes these — none before it */
export const CANDIDATE_ENTRIES: RulingEntry<DiscoveryRuling>[] = [];

/** the rulings index reads ENTRIES (lib/rulings/index.ts) */
export const ENTRIES: RulingEntry<OpenEnded | DiscoveryRuling>[] = [...OPEN_ENDED_ENTRIES, ...CANDIDATE_ENTRIES];

/** our series ids whose I15 ruling is declared open-ended */
export const OPEN_ENDED: Set<string> = new Set(OPEN_ENDED_ENTRIES.map((e) => e.seriesId));

export const candidateKey = (anilistId: number): string => `anilist:${anilistId}`;
export const candidateId = (seriesId: string): number | null => (seriesId.startsWith('anilist:') ? Number(seriesId.slice('anilist:'.length)) : null);

/** AniList id → the ruled disposition */
export const DISCOVERY_RULINGS: Record<number, DiscoveryRuling> = Object.fromEntries(
  CANDIDATE_ENTRIES.map((e) => [candidateId(e.seriesId) as number, e.value]),
);

/** the sitting log — the last entry's date is what discovery_new_since_sitting reads */
export const SITTINGS: { on: string; scope: string; note: string }[] = [];

export const lastSitting = (): string | null => (SITTINGS.length ? [...SITTINGS].map((s) => s.on).sort().at(-1)! : null);
