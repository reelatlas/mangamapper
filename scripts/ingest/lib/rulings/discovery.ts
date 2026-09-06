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

/**
 * THE SEED WRITER'S RELATION GATE, pure (I13 d + T31, 2026-09-06): a mint writes its relation (series_relations) and its franchise
 * membership or does not mint — unless it is an explicit NEW IP (no relation, franchise null) or a restoration. Fail closed: a newIp
 * that also names a relation or a franchise is a contradiction; a series with neither declaration is held. Returns the hold text or null.
 */
export function seedRelationHold(ruling: Pick<DiscoveryRuling, 'relation' | 'restoration' | 'newIp' | 'franchise'>, franchise: string | null, franchiseRuled: boolean, slug: string): string | null {
  if (ruling.newIp) {
    if (ruling.relation) return `newIp declared WITH a relation (${ruling.relation.kind} → ${ruling.relation.to}) — a contradiction (T31 / I13 d): a new IP relates to nothing the catalog holds; drop newIp or the relation`;
    if (ruling.franchise || franchise) return `newIp declared WITH a franchise ('${ruling.franchise ?? franchise}') — a contradiction (T31): a new IP is franchise: null; rule the membership and drop newIp if it belongs to a held franchise`;
    return null;
  }
  if (!ruling.relation && !ruling.restoration) return 'no relation declared — I13 (d): a mint writes its relation (series_relations) and its franchise membership or does not mint; add relation: { to, kind } to the declaration, or newIp: true for a title nothing in the catalog relates to (T31)';
  if (franchise && !franchiseRuled) return `franchise '${franchise}' named by the ruling but no membership entry for '${slug}' in lib/rulings/franchises.ts — rule the membership with the seed`;
  return null;
}

export type DiscoveryDisposition = 'series' | 'excluded' | 'deferred' | 'related_work';
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
  /** disposition 'series', T31 (2026-09-06): a NEW IP — nothing the catalog holds relates to it (a seed-list title); no relation, franchise null; the gate refuses a contradiction (newIp WITH a relation or a franchise). Never reuse `restoration` for it. */
  newIp?: true;
  /** disposition 'related_work' (I45 / I16): AniList's relation labels mis-attribute the work — it is a related work of THIS owner, in this bucket (an alternative adaptation under the franchise base, say), whatever the edges claim */
  owner?: string;
  bucket?: 'alternative' | 'same_instrument' | 'other_instrument' | 'unknown' | 'original' | 'recap';
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
  // ---- decision (d) of the extras sitting (Sean signed 2026-09-05): DECLARATIONS — the run-shaped other-instrument works as step 2's mint input (the one-row film mint from /discover; never minted here)
  {
    seriesId: 'anilist:43',
    ruleId: 'I13',
    value: { disposition: 'series', slug: 'ghost-in-the-shell-1995', relation: { to: 'ghost-in-the-shell-stand-alone-complex', kind: 'alternative' }, franchise: 'ghost-in-the-shell' },
    reason:
      "Sean 2026-09-05 (the extras rulings, via Cursor): the 1995 Ghost in the Shell film is an I16 alternative of Shirow's manga, not in-flow of Stand Alone Complex — 'before ep 1' was a watch-order opinion; an unowned instrumented film is a mint candidate under the films ruling (I13, step 2), never extras research on SAC. Pulled from wave 1; its halo row stays SAC's alternative-adaptation related work (I45).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:131573',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'jujutsu-kaisen', kind: 'prequel' }, slug: 'jujutsu-kaisen-0', franchise: 'jujutsu-kaisen' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): JUJUTSU KAISEN 0 (MOVIE 2021) adapts Jujutsu Kaisen 0: Tokyo Toritsu Jujutsu Koutou Senmon Gakkou (AniList manga 105469: MANGA · FINISHED · 4/1 · 71509) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of jujutsu-kaisen. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:124140',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'sword-art-online', kind: 'alternative' }, slug: 'sword-art-online-progressive', franchise: 'sword-art-online' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Sword Art Online the Movie -Progressive- Aria of a Starless Night (MOVIE 2021) adapts Sword Art Online: Progressive (AniList manga 73921: NOVEL · RELEASING · ?/? · 6430) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of sword-art-online. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:99634',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'attack-on-titan', kind: 'side_story' }, slug: 'attack-on-titan-lost-girls', franchise: 'attack-on-titan' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Attack on Titan: Lost Girls (OVA 2017) adapts Shingeki no Kyojin: LOST GIRLS (AniList manga 93313: NOVEL · FINISHED · 3/1 · 2871) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of attack-on-titan. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21377',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'kurokos-basketball', kind: 'sequel' }, slug: 'kurokos-basketball-extra-game', franchise: 'kurokos-basketball' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Kuroko's Basketball: Last Game (MOVIE 2017) adapts Kuroko no Basket: Extra Game (AniList manga 85604: MANGA · FINISHED · 9/2 · 4449) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of kurokos-basketball. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21132',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'tokyo-ghoul', kind: 'prequel' }, slug: 'tokyo-ghoul-jack', franchise: 'tokyo-ghoul' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Tokyo Ghoul: [JACK] (OVA 2015) adapts Tokyo Ghoul: Jack (AniList manga 85522: MANGA · FINISHED · 7/1 · 10119) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of tokyo-ghoul. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:182469',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'one-piece', kind: 'side_story' }, slug: 'one-piece-novel-mugiwara-stories', franchise: 'one-piece' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): ONE PIECE FAN LETTER (SPECIAL 2024) adapts ONE PIECE novel Mugiwara Stories (AniList manga 128291: NOVEL · FINISHED · 9/1 · 629) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of one-piece. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21778',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'jojos-bizarre-adventure', kind: 'side_story' }, slug: 'thus-spoke-rohan-kishibe', franchise: 'jojos-bizarre-adventure' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Thus Spoke Rohan Kishibe (OVA 2017) adapts Kishibe Rohan wa Ugokanai (AniList manga 103029: MANGA · RELEASING · ?/? · 6967) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of jojos-bizarre-adventure. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21326',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'tokyo-ghoul', kind: 'prequel' }, slug: 'tokyo-ghoul-hibi', franchise: 'tokyo-ghoul' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Tokyo Ghoul: [PINTO] (OVA 2015) adapts Tokyo Ghoul: Hibi (AniList manga 87233: NOVEL · FINISHED · 6/1 · 3310) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of tokyo-ghoul. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:154966',
    ruleId: 'I13',
    value: { disposition: 'deferred', slug: 'fate-strange-fake', franchise: 'fate' },
    reason:
      "DEFERRED 2026-09-06 (the picks pass): Whispers of Dawn is the PROLOGUE special of the TV series (AniList SEQUEL → 166617, 2026); the mint's anime entry is the HEAD (I13 f) — re-target to 166617 when it is dated and in the halo; the special becomes its extra. Decision (d) of the extras sitting (Sean 2026-09-05): Fate/strange Fake -Whispers of Dawn- (SPECIAL 2023) adapts Fate/strange Fake (AniList manga 50006: NOVEL · RELEASING · ?/10 · 4575) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of fate. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:163147',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'blue-lock', kind: 'side_story' }, slug: 'blue-lock-episode-nagi', franchise: 'blue-lock' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): BLUE LOCK THE MOVIE -EPISODE NAGI- (MOVIE 2024) adapts Blue Lock: EPISODE Nagi (AniList manga 146203: MANGA · FINISHED · 36/8 · 9563) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of blue-lock. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:6336',
    ruleId: 'I13',
    value: { disposition: 'series', chain: [6336], relation: { to: 'mobile-suit-gundam', kind: 'sequel' }, slug: 'mobile-suit-gundam-unicorn', franchise: 'mobile-suit-gundam' },
    reason:
      "CHAIN PINNED 2026-09-06 (the seed dry run): the SEQUEL walk pulled Twilight AXIS (98504) in — a HELD, disputed-instrument work; Unicorn is the 7 OVA episodes (RE:0096 is its TV re-cut, an alternative). Decision (d) of the extras sitting (Sean 2026-09-05): Mobile Suit Gundam UC (OVA 2010) adapts Kidou Senshi Gundam Unicorn (AniList manga 35177: NOVEL · FINISHED · 31/11 · 353) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of mobile-suit-gundam. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:10937',
    ruleId: 'I13',
    value: { disposition: 'series', chain: [10937], relation: { to: 'mobile-suit-gundam', kind: 'prequel' }, slug: 'mobile-suit-gundam-the-origin', franchise: 'mobile-suit-gundam' },
    reason:
      "CHAIN PINNED 2026-09-06 (the seed dry run): the SEQUEL walk ran from The Origin into the 1981 compilation films of the original Gundam (1090 →) — The Origin is its own 6-episode OVA run. Decision (d) of the extras sitting (Sean 2026-09-05): Mobile Suit Gundam: The Origin (OVA 2015) adapts Kidou Senshi Gundam: The Origin (AniList manga 30214: MANGA · FINISHED · 112/24 · 7722) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of mobile-suit-gundam. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:97891',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'blue-exorcist', kind: 'side_story' }, slug: 'blue-exorcist-weekend-hero', franchise: 'blue-exorcist' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Ao no Exorcist: Kyoto Fujouou-hen OVA (OVA 2017) adapts Ao no Exorcist: Weekend Hero (AniList manga 58103: NOVEL · FINISHED · 5/1 · 428) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of blue-exorcist. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:6171',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'saint-seiya-knights-of-the-zodiac', kind: 'prequel' }, slug: 'saint-seiya-the-lost-canvas', franchise: 'saint-seiya-knights-of-the-zodiac' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Saint Seiya: The Lost Canvas (OVA 2009) adapts Saint Seiya: THE LOST CANVAS - Meiou Shinwa (AniList manga 31047: MANGA · FINISHED · 224/25 · 4231) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of saint-seiya-knights-of-the-zodiac. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21068',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'durarara', kind: 'side_story' }, chain: [21068, 21331], slug: 'durarara-gaiden', franchise: 'durarara' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Durarara!! X2: My Heart is in the Pattern of a Hot Pot (SPECIAL 2015) adapts Durarara!! Gaiden!? (AniList manga 85836: NOVEL · FINISHED · 10/1 · 333) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of durarara. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:197178',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'one-piece', kind: 'side_story' }, slug: 'one-piece-novel-heroines', franchise: 'one-piece' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): ONE PIECE HEROINES (SPECIAL 2026) adapts ONE PIECE novel HEROINES (AniList manga 113686: NOVEL · FINISHED · 10/2 · 987) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of one-piece. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:101695',
    ruleId: 'I13',
    value: { disposition: 'related_work', owner: 'blood-blockade-battlefront', bucket: 'same_instrument' },
    reason:
      "NOT A MINT (2026-09-06, Cursor's correction): Back 2 Back (86771) is already this series' S2 instrument (Kekkai Sensen & BEYOND, component 97886; ep 13 grafts its ch 1) — registered as a chain work (I41) today; the OVA adapts side chapters of the owner's own chain → an extras row, research decides. Decision (d) of the extras sitting (Sean 2026-09-05): Blood Blockade Battlefront & Beyond OVA (OVA 2018) adapts Kekkai Sensen: Back 2 Back (AniList manga 86771: MANGA · FINISHED · 32/10 · 2363) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of blood-blockade-battlefront. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:997',
    ruleId: 'I13',
    value: { disposition: 'related_work', owner: 'sailor-moon', bucket: 'same_instrument' },
    reason:
      "NOT A MINT (2026-09-06, the picks pass): the S film adapts a SHORT STORY of the instrument itself (Kaguya-hime no Koibito, 1993-94) — AniList's 'Short Stories' node (38552) is the 2004 collected edition, the reissue-date trap; an extras row of sailor-moon adapting its own instrument, research decides the standing. Decision (d) of the extras sitting (Sean 2026-09-05): Sailor Moon S Movie: Hearts in Ice (MOVIE 1994) adapts Bishoujo Senshi Sailor Moon: Short Stories (AniList manga 38552: MANGA · FINISHED · 10/2 · 1729) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of sailor-moon. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21458',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'mobile-suit-gundam', kind: 'side_story' }, chain: [21458, 97853], slug: 'mobile-suit-gundam-thunderbolt', franchise: 'mobile-suit-gundam' },
    reason:
      "RE-TARGETED 2026-09-06 (the picks pass, Cursor's correction): December Sky (21893) is the COMPILATION of the ONA (AniList ALTERNATIVE → 21458); the mint's anime entry is the HEAD — the ONA 21458 with its sequel 97853 (I13 f); the two compilation films join the new series' ledger as recaps. Decision (d) of the extras sitting (Sean 2026-09-05): Mobile Suit Gundam Thunderbolt: December Sky (MOVIE 2016) adapts Kidou Senshi Gundam Thunderbolt (AniList manga 67683: MANGA · FINISHED · 230/27 · 1815) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of mobile-suit-gundam. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:1043',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'x', kind: 'prequel' }, slug: 'tokyo-babylon', franchise: 'x' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Tokyo BABYLON (OVA 1992) adapts Tokyo BABYLON (AniList manga 30133: MANGA · FINISHED · 18/7 · 8483) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of x. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21864',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'assassination-classroom', kind: 'spin_off' }, slug: 'koro-sensei-q', franchise: 'assassination-classroom' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Koro-sensei Q! (MOVIE 2016) adapts Koro-sensei Q! (AniList manga 86949: MANGA · FINISHED · 40/5 · 1233) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of assassination-classroom. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:100719',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'bleach', kind: 'side_story' }, slug: 'colourful-bleach', franchise: 'bleach' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): BLEACH Colorful!: Gotei Juusan Yatai Daisakusen! (OVA 2008) adapts Tsurezure Nichijou Ekotoba Colourful Bleach (AniList manga 104300: MANGA · FINISHED · 37/1 · 1196) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of bleach. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:8310',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'detective-conan', kind: 'side_story' }, slug: 'magic-kaito', franchise: 'detective-conan' },
    reason:
      "RE-TARGETED 2026-09-06 (the picks pass): 2514 is a Conan OVA with a Kaito cameo; the HEAD adaptation of the Magic Kaito manga (31804) is the 2010-12 specials 8310 (12 eps; Magic Kaito 1412 — 20790 — is a second adaptation, a series candidate of its own, I16). The OVA stays a Conan extra. Decision (d) of the extras sitting (Sean 2026-09-05): Case Closed: Conan and Kid and Crystal Mother (OVA 2004) adapts Magic Kaito (AniList manga 31804: MANGA · RELEASING · ?/? · 2881) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of detective-conan. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:17277',
    ruleId: 'I13',
    value: { disposition: 'deferred', slug: 'code-geass-oz-the-reflection', franchise: 'code-geass-lelouch-of-the-rebellion' },
    reason:
      "DEFERRED 2026-09-06 (the picks pass): a PICTURE DRAMA is not a head work for a series (I13 f); the Oz manga (72381) has no full anime — the picture drama stays a Code Geass extra. Decision (d) of the extras sitting (Sean 2026-09-05): Code Geass: Oz the Reflection Picture Drama (OVA 2013) adapts Code Geass: Soubou no Oz (AniList manga 72381: MANGA · FINISHED · 24/5 · 634) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of code-geass-lelouch-of-the-rebellion. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:21806',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'yowamushi-pedal', kind: 'spin_off' }, slug: 'yowamushi-pedal-spare-bike', franchise: 'yowamushi-pedal' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Yowamushi Pedal: SPARE BIKE (MOVIE 2016) adapts Yowamushi Pedal: Spare Bike (AniList manga 99139: MANGA · RELEASING · ?/? · 321) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of yowamushi-pedal. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  {
    seriesId: 'anilist:166060',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'detective-conan', kind: 'side_story' }, slug: 'detective-conan-wild-police-story', franchise: 'detective-conan' },
    reason:
      "Decision (d) of the extras sitting (Sean 2026-09-05): Meitantei Conan: Keisatsu Gakkou-hen - Wild Police Story CASE. Furuya Rei (SPECIAL 2023) adapts Meitantei Conan: Keisatsu Gakkou-hen - Wild Police Story (AniList manga 112094: MANGA · FINISHED · 13/2 · 957) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of detective-conan. Mint: step 2's writer, from /discover. Slug per I1 from the English title.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'],
  },
  // ---- related-work attributions (Sean 2026-09-05, via Cursor: "Heaven's Feel → Fate before any research"): AniList reaches the Fate/stay night film
  // adaptations from Fate/Zero by SEQUEL (three rival tellings cannot all be a prequel's run) and from Prisma Illya by PARENT (a spin-off's ancestor);
  // the base, Fate/stay night, says ALTERNATIVE — the true claim. One row each, under the base, an alternative adaptation (VN-sourced: held, never a mint)
  {
    seriesId: 'anilist:20791',
    ruleId: 'I45',
    value: { disposition: 'related_work', owner: 'fate-stay-night', bucket: 'alternative' },
    reason:
      "Fate/stay night [Heaven's Feel] I. presage flower: an alternative adaptation of the Fate/stay night visual novel (I16), attributed to the franchise base — Fate/Zero's SEQUEL edge is chronology (it points at all three stay-night adaptations) and Prisma Illya's PARENT edge names an ancestor, not a work in its run. Sean 2026-09-05: Heaven's Feel belongs to Fate, never to a Prisma Illya extras verdict. No instrument (a VN): held, never a mint.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0'],
  },
  {
    seriesId: 'anilist:21718',
    ruleId: 'I45',
    value: { disposition: 'related_work', owner: 'fate-stay-night', bucket: 'alternative' },
    reason:
      "Fate/stay night [Heaven's Feel] II. lost butterfly: an alternative adaptation of the Fate/stay night visual novel (I16), attributed to the franchise base — Fate/Zero's SEQUEL edge is chronology (it points at all three stay-night adaptations) and Prisma Illya's PARENT edge names an ancestor, not a work in its run. Sean 2026-09-05: Heaven's Feel belongs to Fate, never to a Prisma Illya extras verdict. No instrument (a VN): held, never a mint.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0'],
  },
  {
    seriesId: 'anilist:21719',
    ruleId: 'I45',
    value: { disposition: 'related_work', owner: 'fate-stay-night', bucket: 'alternative' },
    reason:
      "Fate/stay night [Heaven's Feel] III. spring song: an alternative adaptation of the Fate/stay night visual novel (I16), attributed to the franchise base — Fate/Zero's SEQUEL edge is chronology (it points at all three stay-night adaptations) and Prisma Illya's PARENT edge names an ancestor, not a work in its run. Sean 2026-09-05: Heaven's Feel belongs to Fate, never to a Prisma Illya extras verdict. No instrument (a VN): held, never a mint.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0'],
  },
  {
    seriesId: 'anilist:6922',
    ruleId: 'I45',
    value: { disposition: 'related_work', owner: 'fate-stay-night', bucket: 'alternative' },
    reason:
      "Fate/stay night: Unlimited Blade Works (Movie, 2010): an alternative adaptation of the Fate/stay night visual novel (I16), attributed to the franchise base — Fate/Zero's SEQUEL edge is chronology (it points at all three stay-night adaptations) and Prisma Illya's PARENT edge names an ancestor, not a work in its run. Sean 2026-09-05: Heaven's Feel belongs to Fate, never to a Prisma Illya extras verdict. No instrument (a VN): held, never a mint.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-05',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0'],
  },

  {
    seriesId: 'anilist:17187',
    ruleId: 'I45',
    value: { disposition: 'related_work', owner: 'ghost-in-the-shell-arise-alternative-architecture', bucket: 'alternative' },
    reason:
      "Attribution (2026-09-06, Sean with Cursor): Arise Border:1 Ghost Pain is the first of the four Border films the 2015 TV re-cut (our Arise series, source original) derives from — AniList labels it SPIN_OFF of SAC while its siblings Border:2-4 are ALTERNATIVE of Arise, a label accident (the Fate-films shape); it sits under Arise with them. Not a mint: Arise exists; the 'Sleepless Eye' manga (78321) is a media-mix tie-in, not the film's source — research decides its standing.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §6.3'],
  },
  {
    seriesId: 'anilist:12231',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'dragon-ball-z', kind: 'side_story' }, slug: 'dragon-ball-episode-of-bardock', franchise: 'dragon-ball' },
    reason:
      "The picks pass (2026-09-06): Dragon Ball: Episode of Bardock (SPECIAL 2011-12-17) adapts the V-Jump manga Episode of Bardock (56373, 2011-06 → 08, Ōishi) — a run of its own that PRECEDED the special (the live picks read; not a comicalization); a one-row series under the dragon-ball franchise (I13 b).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md appendix B'],
  },
  {
    seriesId: 'anilist:20811',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'attack-on-titan', kind: 'prequel' }, slug: 'attack-on-titan-no-regrets', franchise: 'attack-on-titan' },
    reason:
      "The (d) queue (2026-09-06; the wave-2 owner triage): Shingeki no Kyojin Gaiden: Kuinaki Sentaku (2-ep OVA, 2014-12 / 2015-04) adapts 悔いなき選択 (Suruga, 2 vols) — Levi's prequel manga, a run of its own (I13 b); prequel of attack-on-titan.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/triage__attack-on-titan.json'],
  },
  {
    seriesId: 'anilist:20942',
    ruleId: 'I13',
    value: { disposition: 'series', relation: { to: 'the-prince-of-tennis', kind: 'side_story' }, slug: 'houkago-no-ouji-sama', franchise: 'the-prince-of-tennis' },
    reason:
      "The (d) queue (2026-09-06; the wave-2 owner triage): Houkago no Ouji-sama (5 shorts, 2014) adapts the 4-koma spin-off manga 放課後の王子様 — a run of its own (I13 b), the Colourful Bleach shape; side story of the-prince-of-tennis.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/triage__the-prince-of-tennis.json'],
  },
  {
    seriesId: 'anilist:995',
    ruleId: 'I13',
    value: { disposition: 'series', chain: [995, 2752, 4053], relation: { to: 'the-prince-of-tennis', kind: 'sequel' }, slug: 'the-prince-of-tennis-national-tournament', franchise: 'the-prince-of-tennis' },
    reason:
      "The extras wave 4b (three verdicts verified SOUND WITH NOTES): the National Tournament OVA chain — 995 (13 eps) → 2752 Semifinal (6) → 4053 Final (7) — adapts Genius 237-379, the manga's second half the TV run never animates, seams clean at 305/306 and 340/341. Sean ruled (2026-09-06, with Cursor): NOT a component keyed 179-204 — that count is invented (N4: the key is what the sources print; Hunter x Hunter's 63-92 is printed, Tennis's sources print 1-26 or three sets); its OWN series with the numbering the sources print — the Lost Canvas shape (one series, three OVA components, rows 1-26), sequel of the-prince-of-tennis under its franchise; the three ledger rows on the parent retire by the skip-split (a multi-entry run elsewhere). Rows via a ruled grid (G59 C) from the verdicts + the licensor; anchors from the verdicts' per-episode maps.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/the-prince-of-tennis__995.json', 'scripts/ingest/research/discovery/out/the-prince-of-tennis__2752.json', 'scripts/ingest/research/discovery/out/the-prince-of-tennis__4053.json', 'scripts/ingest/research/discovery/verify/the-prince-of-tennis__995.md'],
  },
  // ── C1 — the first AIRING sitting (Sean 2026-09-06 with Cursor: 'C1 as proposed, except Frieren shorts') ──
  {
    seriesId: 'anilist:177699',
    ruleId: 'I13',
    value: { disposition: 'series', chain: [177699], relation: { to: 'ghost-in-the-shell-stand-alone-complex', kind: 'alternative' }, slug: 'ghost-in-the-shell-2026', franchise: 'ghost-in-the-shell' },
    reason:
      "C1 (2026-09-06): THE GHOST IN THE SHELL (Science SARU, TV, 10 eps, 2026-07-07 → 09-08) is a new adaptation of the original manga (31023 — the same instrument as Stand Alone Complex): a SERIES, alternative to the franchise base, never a component of SAC — the 1995 film's shape (I16: same manga is no signal against a split). The slug carries the year like ranma1-2-2024 / rurouni-kenshin-2023.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['audit-discovery halo_airing (2026-09-06)', 'scripts/ingest/research/discovery/recap.ts --scope sequel,series --airing (2026-09-06)'],
  },
  {
    seriesId: 'anilist:206425',
    ruleId: 'I13',
    value: { disposition: 'related_work', owner: 'frieren-beyond-journeys-end', bucket: 'original' },
    reason:
      "C1 (2026-09-06, Cursor's correction): ●● no Mahou Part 3 (ONA, one-minute comedy shorts, source ORIGINAL, airing since 2026-01-19) proposed `series` only because ONA is TV-shaped in the halo; the work is I13 — an EXTRA of Frieren (a ledger row, filler by rule: original), revisited with the extras programme, never phase B. The ruling beats the format (lib/discovery.ts, 2026-09-06).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['audit-discovery halo_airing (2026-09-06)', 'scripts/ingest/research/discovery/recap.ts --scope sequel,series --airing (2026-09-06)'],
  },
  {
    seriesId: 'anilist:189513',
    ruleId: 'I13',
    value: { disposition: 'related_work', owner: 'frieren-beyond-journeys-end', bucket: 'original' },
    reason: "C1 (2026-09-06): ●● no Mahou Part 2 (ONA, 6 shorts, 2025-04-02) — the same work's earlier part, one row per AniList id (I46), the same ruling as Part 3 (P9: one shape, every part).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['audit-discovery halo_airing (2026-09-06)', 'scripts/ingest/research/discovery/recap.ts --scope sequel,series --airing (2026-09-06)'],
  },
  {
    seriesId: 'anilist:170068',
    ruleId: 'I13',
    value: { disposition: 'related_work', owner: 'frieren-beyond-journeys-end', bucket: 'original' },
    reason: "C1 (2026-09-06): ●● no Mahou (Part 1: ONA, 12 shorts) — the same work's first part, one row per AniList id (I46), the same ruling as Part 3 (P9).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['audit-discovery halo_airing (2026-09-06)', 'scripts/ingest/research/discovery/recap.ts --scope sequel,series --airing (2026-09-06)'],
  },
  {
    seriesId: 'anilist:188388',
    ruleId: 'I13',
    value: { disposition: 'deferred', slug: 'digimon-beatbreak', franchise: 'digimon' },
    reason:
      "DEFERRED 2026-09-06 (C1, Cursor): DIGIMON BEATBREAK (TV, airing since 2025-10-05, 46 eps aired, source ORIGINAL; PARENT → 552 Digimon Adventure, held as digimon-digital-monsters) — the relation exists and the writer would take it; the wait is the NO-INSTRUMENT shape (phase B: source_type as AniList states it, canon rows, no instrument, the studio-original label, an explicit publish ruling), never the gate.",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['audit-discovery halo_airing (2026-09-06)', 'scripts/ingest/research/discovery/recap.ts --scope sequel,series --airing (2026-09-06)'],
    retiresWhen: 'phase B lands (the no-instrument record) — then a series ruling at the next sitting',
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
  { on: '2026-09-06T21:51:34Z', scope: 'C1 — the first AIRING sitting (halo_airing, RELEASING first; Sean 2026-09-06 with Cursor): five season ordinals as I27 ruled extensions (re-zero S3 + S4, Tanya S2, Polar Opposites S2, Iruma-kun S4, 100 Girlfriends S3 — three on no-AFL owners keyed by series id), THE GHOST IN THE SHELL 2026 as a series (alternative to SAC), the Frieren ●● no Mahou shorts (three parts) as ledger extras by ruling, DIGIMON BEATBREAK deferred to phase B', note: 'the staging run before it: the weekly refresh-discovery of 2026-09-06 10:30 UTC (AniList was disabled site-wide afterwards — no restage possible; all eight candidates were already staged)' },
  { on: '2026-09-06T07:20:31Z', scope: 'the step-2 film mint sitting (I13 b/d/e/f): 26 series minted from the (d) declarations + the picks pass (Sean 2026-09-06, Cursor\'s three corrections) — 12 one-row films / specials, 3 two-entry film series, 11 episodic OVA runs; the strange Fake prologue and the Oz picture drama deferred; four not-mints ruled as extras', note: 'the seed dry run read in chat (26 CREATE, 0 HELD); Sean: walk the Oshii films as one series' },
  { on: '2026-09-05T06:34:00Z', scope: 'the three witness promotions (go-list row 4): shield hero S2-S4 as an OVERRIDE_CHAINS ruled extension; trigun stampede + konosuba explosion as series rulings', note: 'the first sitting; the rest of the 267 TV-shaped candidates wait for /discover; the halo was staged 2026-09-05 before this timestamp' },
];

export const lastSitting = (): string | null => (SITTINGS.length ? [...SITTINGS].map((s) => s.on).sort().at(-1)! : null);
