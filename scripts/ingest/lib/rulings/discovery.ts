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
  /** disposition 'series': pin the component chain (AniList ids in order) when the SEQUEL walk is ambiguous or must stop short; else the writer walks */
  chain?: number[];
  /** a RESTORATION: the series existed and was deleted by the named incident; the ruling recreates it under its old id (never a discovery proposal) */
  restoration?: string;
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

const GO = 'scripts/ingest/research/discovery/PROPOSAL.md §9 row 4 (the three witness promotions; Sean: "ok yes lets proceed", 2026-09-05)';

export const CANDIDATE_ENTRIES: RulingEntry<DiscoveryRuling>[] = [
  {
    seriesId: 'anilist:151040',
    ruleId: 'I42',
    value: { disposition: 'series', slug: 'trigun-stampede', relation: { to: 'trigun', kind: 'alternative' }, franchise: 'trigun' },
    reason:
      "TRIGUN STAMPEDE (2023, 12 eps) and its sequel TRIGUN STARGAZE (163144, Winter 2026, 12 eps) — a CG re-adaptation of Nightow's Trigun / Trigun Maximum (manga 30703 / 30704, the same instrument the trigun entry maps), divergent from the 1998 series: an ALTERNATIVE telling (I17), so a separate series under the trigun franchise (I43), never a component of the 1998 entry. Discovery witness #2. The seed writer walks the SEQUEL chain, so Stargaze rides as component 2 (same continuous story — the new title is the studio's, not a narrative shift).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: [GO],
  },
  {
    seriesId: 'anilist:150075',
    ruleId: 'I42',
    value: { disposition: 'series', slug: 'konosuba-an-explosion-on-this-wonderful-world', relation: { to: 'konosuba-gods-blessing-on-this-wonderful-world', kind: 'spin_off' }, franchise: 'konosuba' },
    reason:
      "KONOSUBA -An Explosion on This Wonderful World! (2023, 12 eps): Megumin's prequel spin-off light novel (AniList 100147) — own story, shared universe: SPIN_OFF (I17), a separate series under the konosuba franchise (I43). Discovery witness #3.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: [GO],
  },
  // ── RESTORATIONS after INCIDENT 2026-09-05 (audit-titles.ts deleted six series; Sean chose the targeted rebuild) ──
  // The seed writer is the one series-creation path (G52 rostered form); a restoration pins the OLD id and the
  // chain the series had, so every ruling keyed by that id (T6 pins, G53 dates, A44 / A45, standing annotations,
  // ruled wiki pages) re-attaches on the next heal. kakegurui is NOT here: its AFG page types its rows, so
  // afg-expansion --only kakegurui recreates it as the AFG-only writer did.
  {
    seriesId: 'anilist:60',
    ruleId: 'G52',
    value: { disposition: 'series', slug: 'chrono-crusade', chain: [60], restoration: 'INCIDENT-2026-09-05' },
    reason: 'chrono-crusade (Chrno Crusade, 24 eps, 2003): a G52 canon-tier entry with T6 pins, standing annotations, A44 suppressions and research anchors (batches 17 / 18 / 19 / 20-w16) — deleted by the incident; recreated under its old id, chain [60], rows via the wiki writer, anchors replayed from the verdict files.',
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md (Sean 2026-09-05: option A — targeted rebuild through the existing writers)'],
  },
  {
    seriesId: 'anilist:3272',
    ruleId: 'G52',
    value: { disposition: 'series', slug: 'kinnikuman', chain: [3272], restoration: 'INCIDENT-2026-09-05' },
    reason: 'kinnikuman (137 eps, 1983): 137 rows (19 filler by T6 pins), G53 air dates, A45 retirements, research anchors (batches 17 / 19 / 20 ×2) — deleted by the incident; recreated under its old id, chain [3272] WITHOUT the 1991 sequel 3281 (never a component), rows via the wiki writer, anchors replayed.',
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md (Sean 2026-09-05: option A — targeted rebuild through the existing writers)'],
  },
  {
    seriesId: 'anilist:128034',
    ruleId: 'G52',
    value: { disposition: 'series', slug: 'orient', chain: [128034, 146637], restoration: 'INCIDENT-2026-09-05' },
    reason: 'orient (ORIENT 12 + Awajishima Gekitou-hen 12, 2022): a G52 entry with a ruled wiki page (G59 B) and two research anchors (batch 20 w8) — deleted by the incident; recreated under its old id, chain [128034, 146637] (both cours, as the ruled page numbers them 1-24).',
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md (Sean 2026-09-05: option A — targeted rebuild through the existing writers)'],
  },
  {
    seriesId: 'anilist:1470',
    ruleId: 'G52',
    value: { disposition: 'series', slug: 'city-hunter', chain: [1470], restoration: 'INCIDENT-2026-09-05' },
    reason: 'city-hunter (51 eps, 1987): default-typed rows and a G54 air-date-order ruling — deleted by the incident; recreated under its old id, chain [1470] WITHOUT City Hunter 2 (1471, never a component); stays STAGED (P39: no classifier, Sean 2026-09-05).',
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md (Sean 2026-09-05: option A — targeted rebuild through the existing writers)'],
  },
  {
    seriesId: 'anilist:1250',
    ruleId: 'G52',
    value: { disposition: 'series', slug: 'elemental-gelade', chain: [1250], restoration: 'INCIDENT-2026-09-05' },
    reason: 'elemental-gelade (26 eps, 2005): default-typed rows, no rulings — deleted by the incident; recreated under its old id, chain [1250]; stays STAGED (P39, Sean 2026-09-05).',
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/INCIDENT-2026-09-05.md (Sean 2026-09-05: option A — targeted rebuild through the existing writers)'],
  },
];

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
export const SITTINGS: { on: string; scope: string; note: string }[] = [
  { on: '2026-09-05T06:34:00Z', scope: 'the three witness promotions (go-list row 4): shield hero S2-S4 as an OVERRIDE_CHAINS ruled extension; trigun stampede + konosuba explosion as series rulings', note: 'the first sitting; the rest of the 267 TV-shaped candidates wait for /discover; the halo was staged 2026-09-05 before this timestamp' },
];

export const lastSitting = (): string | null => (SITTINGS.length ? [...SITTINGS].map((s) => s.on).sort().at(-1)! : null);
