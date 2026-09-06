// DISCOVERY — the candidate rule (I42, Sean's go 2026-09-05; the design is
// scripts/ingest/research/discovery/PROPOSAL.md v2.2). An unowned story
// relation of an owned AniList entry is a LISTED candidate, never silently
// absent: the catalog used to stop where AFL's page stopped (Shield Hero S2
// finished in 2022 and was invisible; 55 announced or airing seasons of
// series we hold were invisible). Everything here DERIVES from staging
// (ingest_anilist_media — the owned entries' relation edges, plus whatever
// candidate media discovery-stage.ts has staged) and the discovery ruling
// map; nothing here writes, and a PROPOSAL is a line in the census for Sean,
// never a write (I15 / I16 are rulings; I18 says even a source's page
// boundary is a hypothesis).
//
// Buckets (what the relation × format says):
//   sequel  — SEQUEL × TV / TV_SHORT / ONA (or an unknown format): the
//             component-or-series question
//   series  — PREQUEL / SIDE_STORY / SPIN_OFF / ALTERNATIVE / PARENT /
//             SAME_UNIVERSE / OTHER × TV-shaped: a separate-series candidate
//   extra   — any story relation × MOVIE / OVA / SPECIAL, and SUMMARY × TV:
//             I13 standalone by default, listed capped, never a work-list
//   ignored — CHARACTER / COMPILATION / CONTAINS / SOURCE / ADAPTATION edges
//             and MUSIC — noise by rule
// Proposal precedence for the `sequel` bucket (Cursor's row-3 fix, confirmed
// in data — PROPOSAL.md §1.5): (1) a ruling for the id itself is not a
// proposal; (2) an owner whose I15 ruling is DECLARED open-ended proposes
// `component` whatever the title (lib/rulings/discovery.ts#OPEN_ENDED —
// never OVERRIDE_CHAINS presence); (3) the signals — a season ORDINAL on an
// owner title → `component`; a DIFFERENT manga → `series`; a new subtitle or
// an unrelated title on the same or an unknown manga → `ambiguous` (Sean
// rules: Shippuden / TYBW went `series`, Demon Slayer's arc-titled seasons
// are components — the shape is real, so the honest proposal names it).
// Same manga is NO signal: four ruled I16 splits share one.

import { pickMangaNode } from './rulings/source-relations';
import type { DiscoveryRuling } from './rulings/discovery';
import { adaptedNodes, extraBucket, type ExtraBucket, ownerInstrumentIds, ownerInstrumentSet, PROMO, relatedWorkOwners } from './related-works';

export const SERIES_FORMATS = new Set(['TV', 'TV_SHORT', 'ONA']);
export const EXTRA_FORMATS = new Set(['MOVIE', 'OVA', 'SPECIAL']);
export const SERIES_RELATIONS = new Set(['PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE', 'PARENT', 'SAME_UNIVERSE', 'OTHER']);
export const RECAP_RELATIONS = new Set(['SUMMARY', 'COMPILATION']);
export const IGNORED_RELATIONS = new Set(['CONTAINS', 'SOURCE', 'ADAPTATION']);

/** I45 (2026-09-05): every related work is LISTED — recap and crossover are buckets, not noise; only MUSIC is ignored */
export type Bucket = 'sequel' | 'series' | 'extra' | 'recap' | 'crossover' | 'ignored';
export type Proposal = 'component' | 'series' | 'ambiguous' | 'standalone' | 'ignored' | ExtraBucket | 'unstaged';
export type Continuity = 'ordinal' | 'subtitle' | 'unrelated';

export type EdgeNode = {
  id: number;
  type: string;
  format?: string | null;
  status?: string | null;
  popularity?: number | null;
  title: { romaji: string | null; english?: string | null; native?: string | null };
};
export type MediaLike = {
  id: number;
  title: { romaji: string | null; english: string | null; native?: string | null };
  /** AniList's source tag (ORIGINAL / MANGA / LIGHT_NOVEL / …) — the extras derivation reads it (I45) */
  source?: string | null;
  synonyms?: string[];
  format: string | null;
  status: string | null;
  popularity: number;
  relations: { edges: { relationType: string; node: EdgeNode }[] } | null | undefined;
};

export type Candidate = {
  anilistId: number;
  title: string;
  format: string | null;
  status: string | null;
  popularity: number;
  /** every relation type that reached it (SEQUEL / SPIN_OFF / …) */
  relations: Set<string>;
  /** every owned series it hangs off */
  owners: Set<string>;
  /** owner → the relation kinds by which THAT owner reached it (an ALTERNATIVE-only owner is a different telling, I16) */
  ownerRelations: Map<string, Set<string>>;
  /** the entry whose edge found it first, and how many SEQUEL hops from an owned entry */
  via: number;
  hop: number;
  bucket: Bucket;
  proposal: Proposal;
  /** I13 (amended 2026-09-05): the ONE-ROW series that owns this work elsewhere — it is still an extra of THIS owner (JJK 0 on JJK's page); never a series or mint proposal */
  ownedElsewhere?: string;
  signals: string[];
  /** the candidate's own media is staged (discovery-stage.ts) — the full-media signals are available */
  staged: boolean;
  /** ingest_anilist_media.changed_at of the candidate row (null when unstaged) */
  changedAt: string | null;
  /** the candidate's own manga (I38's pick on its staged relations), null when unstaged or none */
  mangaId: number | null;
  ruling: DiscoveryRuling | null;
};

export type DiscoveryInput = {
  /** anilist id → our series id (heads + components) — the I21 ownership set */
  owned: Map<number, string>;
  /** every staged media, owned and candidate */
  staged: Map<number, MediaLike>;
  /** staged row → changed_at */
  changedAt: Map<number, string>;
  /** our series id → every title / synonym its staged components carry */
  ownerTitles: Map<string, string[]>;
  /** our series id → manga_anilist_id */
  ownerManga: Map<string, number | null>;
  rulings: Record<number, DiscoveryRuling>;
  openEnded: Set<string>;
  /** our series id → the manga ids on its reading chain (I41) — a chain work counts as the owner's own instrument */
  chainWorks?: Map<string, number[]>;
  /** our series id → its instrument node ids on AniList (ownerInstrumentIds: the registered manga, chain works, a novel owner's NOVEL nodes) */
  ownerInstruments?: Map<string, Set<number>>;
  /** our series id → the BASE series of its franchise (I43) — an alternative adaptation is attributed once, to the base, never to every member */
  franchiseBase?: Map<string, string>;
};

const norm = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// an ordinal at the head of what follows an owner title: "2nd Season", "Season 3",
// "3rd Season Part 2", "Second Season", "Part 2", "2nd Cour", "Final Season",
// "II" / "III", a SHORT bare number that is the whole remainder ("Iruma-kun 4",
// "City Hunter 2" — never "100 Years Quest", never a year), "2nd Attack"
// (Nagatoro), "Zoku" (a continuation)
const ORDINAL_HEAD = String.raw`\d+(?:st|nd|rd|th)\s+(?:season|attack|series|part|cour|stage)|(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+(?:season|part|cour|series|stage)|(?:season|part|cour|stage)\s*\d+|final\s+season|(?:ii|iii|iv|v|vi|vii|viii|ix|x)|zoku(?:\s*hen)?`;
const ORDINAL = new RegExp(String.raw`^(?:the\s+)?(?:(?:${ORDINAL_HEAD})(?:\s|$)|\d{1,2}(?:\s+(?:part|cour)\s*\d+)?$)`);

const RANK: Record<Continuity, number> = { ordinal: 2, subtitle: 1, unrelated: 0 };

/** how a candidate title continues an owner title: an ORDINAL (a season count), a new SUBTITLE, or UNRELATED — the best over every owner title and every candidate title */
export function titleContinuity(candidateTitles: (string | null | undefined)[], ownerTitles: string[]): Continuity {
  let best: Continuity = 'unrelated';
  // an owner title is compared as written AND without a trailing disambiguator — AniList's "(TV)", "(2024)", "(2022)"
  const owners = [...new Set(ownerTitles.flatMap((t) => [norm(t), norm(t.replace(/\s*\([^)]*\)\s*$/, ''))]).filter(Boolean))];
  for (const raw of candidateTitles) {
    if (!raw) continue;
    const c = norm(raw);
    if (!c) continue;
    for (const o of owners) {
      let v: Continuity;
      if (c === o) v = 'ordinal'; // identical after normalization: a punctuation sequel ("Hataraku Maou-sama!!" vs "…-sama!", "Kaguya-sama wa Kokurasetai?")
      else if (c.startsWith(o + ' ')) v = ORDINAL.test(c.slice(o.length + 1)) ? 'ordinal' : 'subtitle';
      else continue;
      if (RANK[v] > RANK[best]) best = v;
      if (best === 'ordinal') return best;
    }
  }
  return best;
}

const seriesShaped = (format: string | null | undefined): boolean => format == null || SERIES_FORMATS.has(format);

/** bucket from what reached the candidate and what it is */
/** I13 (amended 2026-09-05): a work owned by another series is an extra HERE only when that series is one-row and the format is extras-shaped */
export const oneRowExtraElsewhere = (entriesOfThatSeries: number, format: string | null | undefined): boolean => entriesOfThatSeries === 1 && EXTRA_FORMATS.has(format ?? '');

export function bucketOf(relations: Set<string>, format: string | null | undefined): Bucket {
  if (format === 'MUSIC') return 'ignored';
  if ([...relations].some((r) => RECAP_RELATIONS.has(r))) return 'recap'; // a recap / compilation, whatever its format (N8: never a numbered row)
  const story = [...relations].filter((r) => !IGNORED_RELATIONS.has(r) && r !== 'CHARACTER');
  if (!story.length) return relations.has('CHARACTER') ? 'crossover' : 'ignored';
  if (format != null && EXTRA_FORMATS.has(format)) return 'extra';
  if (!seriesShaped(format)) return 'ignored'; // MANGA / NOVEL / ONE_SHOT nodes never come here (type ANIME only), but fail closed
  if (story.includes('SEQUEL')) return 'sequel';
  if (story.some((r) => SERIES_RELATIONS.has(r))) return 'series';
  return 'extra';
}

/** the derivation — pure; the loader below feeds it from staging */
export function haloCandidates(input: DiscoveryInput): Candidate[] {
  const out = new Map<number, Candidate>();
  const at = (node: EdgeNode, relation: string, owner: string, via: number, hop: number): Candidate => {
    let c = out.get(node.id);
    if (!c) {
      const staged = input.staged.get(node.id) ?? null;
      c = {
        anilistId: node.id,
        title: staged?.title.english ?? staged?.title.romaji ?? node.title.english ?? node.title.romaji ?? String(node.id),
        format: staged?.format ?? node.format ?? null,
        status: staged?.status ?? node.status ?? null,
        popularity: staged?.popularity ?? node.popularity ?? 0,
        relations: new Set(),
        owners: new Set(),
        ownerRelations: new Map(),
        via,
        hop,
        bucket: 'ignored',
        proposal: 'ignored',
        signals: [],
        staged: staged != null,
        changedAt: input.changedAt.get(node.id) ?? null,
        mangaId: staged ? (pickMangaNode((staged.relations?.edges ?? []) as never)?.id ?? null) : null,
        ruling: input.rulings[node.id] ?? null,
      };
      out.set(node.id, c);
    }
    c.relations.add(relation);
    c.owners.add(owner);
    (c.ownerRelations.get(owner) ?? c.ownerRelations.set(owner, new Set()).get(owner)!).add(relation);
    if (hop < c.hop) { c.hop = hop; c.via = via; }
    return c;
  };

  // hop 1: every ANIME edge from an owned, staged entry to an entry this owner does not own. THE SKIP-SPLIT (I13 amended 2026-09-05,
  // the rule-logic evaluation E9): an entry owned by THIS owner (its own id or a component — the I21 set for that series) is never its
  // extra; an entry owned by ANOTHER series is an extra here only when that series is ONE-ROW (the film-mint shape, I13 b) and the format
  // is extras-shaped — JJK 0 stays on JJK's page after its mint; any entry of another MULTI-ENTRY run (its first entry or a component:
  // Stampede for Trigun, Greed Island for the 2011 series) is not — the franchise page orders runs (I43)
  const ownedBy = new Map<string, number>();
  for (const owner of input.owned.values()) ownedBy.set(owner, (ownedBy.get(owner) ?? 0) + 1);
  for (const [id, owner] of input.owned) {
    const m = input.staged.get(id);
    if (!m) continue;
    for (const e of m.relations?.edges ?? []) {
      if (e.node.type !== 'ANIME') continue;
      const ownerOf = input.owned.get(e.node.id);
      if (ownerOf === owner) continue;
      if (ownerOf != null && !oneRowExtraElsewhere(ownedBy.get(ownerOf) ?? 0, e.node.format)) continue;
      const c = at(e.node, e.relationType, owner, id, 1);
      if (ownerOf != null) c.ownedElsewhere = ownerOf;
    }
  }
  // hops 2+: SEQUEL chains through STAGED candidates (S2 staged → S3 seen), owners inherited
  const queue = [...out.values()].filter((c) => c.relations.has('SEQUEL'));
  const seen = new Set(queue.map((c) => c.anilistId));
  while (queue.length) {
    const c = queue.shift()!;
    const m = input.staged.get(c.anilistId);
    if (!m) continue;
    for (const e of m.relations?.edges ?? []) {
      if (e.relationType !== 'SEQUEL' || e.node.type !== 'ANIME' || input.owned.has(e.node.id)) continue;
      const owners = [...c.owners];
      const next = at(e.node, 'SEQUEL', owners[0], c.anilistId, c.hop + 1);
      for (const o of owners) { next.owners.add(o); (next.ownerRelations.get(o) ?? next.ownerRelations.set(o, new Set()).get(o)!).add('SEQUEL'); }
      if (!seen.has(next.anilistId)) { seen.add(next.anilistId); queue.push(next); }
    }
  }

  for (const c of out.values()) {
    c.bucket = bucketOf(c.relations, c.format);
    const s: string[] = [];
    if (c.format == null) s.push('format unknown');
    if (c.hop > 1) s.push(`hop ${c.hop} via ${c.via}`);
    if (c.bucket === 'ignored') { c.proposal = 'ignored'; c.signals = s; continue; }
    if (c.bucket === 'extra' || c.bucket === 'recap' || c.bucket === 'crossover') {
      // I45: the related-works bucket from the full media — recap / original / same_instrument / other_instrument / crossover / unknown
      // I16 / I45 (Sean 2026-09-05): a work NO owner reached by an in-run relation is an ALTERNATIVE ADAPTATION — a different telling of the
      // same source (the 1995 Ghost in the Shell beside SAC, the Heaven's Feel films beside every Fate entry) — never in a run: attributed
      // ONCE, to the franchise base (I43), and a series candidate when it adapts an instrument (step 2), held when the source has none
      const attribution = c.ruling?.disposition === 'related_work' && c.ruling.owner ? c.ruling : null; // a ruling beats the labels (Heaven's Feel → Fate)
      const who = attribution ? { owners: new Set([attribution.owner!]), alternative: attribution.bucket === 'alternative' } : relatedWorkOwners(c.ownerRelations, (o) => input.franchiseBase?.get(o) ?? o); // strong in-run owners > the base's ALTERNATIVE > OTHER-only owners
      if (!who.alternative && !c.relations.has('CHARACTER')) c.owners = who.owners; // a chronology link (a sibling's SEQUEL / PARENT / OTHER) beside a stronger claim does not own
      if (who.alternative && !c.relations.has('CHARACTER') && !PROMO.test(c.title)) { // a promotional entry is promo first, whatever reached it
        c.owners = who.owners; // the base(s) that claimed it
        const media = (input.staged.get(c.anilistId) as never) ?? null;
        const baseIds = [...who.owners];
        const adapts = adaptedNodes(media, ownerInstrumentSet({ mangaId: baseIds.map((o) => input.ownerManga.get(o) ?? null).find((m) => m != null) ?? null, chainWorkIds: baseIds.flatMap((o) => input.chainWorks?.get(o) ?? []), instrumentIds: baseIds.flatMap((o) => [...(input.ownerInstruments?.get(o) ?? [])]) }));
        const staged = input.staged.get(c.anilistId);
        c.proposal = staged ? 'alternative' : 'unstaged';
        if (attribution) s.push(`attributed to ${attribution.owner} by ruling (I45)`);
        if (staged) {
          if (adapts.length) s.push(`adapts ${adapts.map((n) => `${n.title ?? n.id} (${n.format ?? '?'})`).join(', ')}`);
          s.push(`alternative adaptation (I16) — reached only by ${[...c.relations].join('/')}: not in the run; ${adapts.length ? 'a series candidate (step 2, the mint)' : `source ${(staged as { source?: string | null }).source ?? 'unknown'} names no instrument — held`}`);
        } else s.push('not staged — run discovery-stage');
        c.signals = s; continue;
      }
      const ownerIds = [...c.owners];
      if (c.ownedElsewhere) s.push(`owned by ${c.ownedElsewhere} — its own one-row series; an extra here by I13, never a series or mint proposal`);
      const ownerManga = ownerIds.map((o) => input.ownerManga.get(o) ?? null).find((m) => m != null) ?? null;
      const media = (input.staged.get(c.anilistId) as never) ?? null;
      const ownerSet = { mangaId: ownerManga, chainWorkIds: ownerIds.flatMap((o) => input.chainWorks?.get(o) ?? []), instrumentIds: ownerIds.flatMap((o) => [...(input.ownerInstruments?.get(o) ?? [])]) };
      const b = extraBucket(c.relations, media, ownerSet, c.title);
      c.proposal = b;
      const adapts = adaptedNodes(media, ownerInstrumentSet(ownerSet));
      if (adapts.length) s.push(`adapts ${adapts.map((n) => `${n.title ?? n.id} (${n.format ?? '?'})`).join(', ')}`);
      s.push(b === 'unstaged' ? 'not staged — run discovery-stage' : `related work: ${b}${b === 'same_instrument' ? ' (the sitting: standing + chapters)' : b === 'other_instrument' ? (adapts.some((n) => n.format === 'MANGA' || n.format === 'NOVEL') ? ' (a series candidate too)' : ' (a one-shot tie-in)') : b === 'promo' ? ' (promotional: a trailer / PV / teaser / CM — ignored like a music video, never a ledger row)' : b === 'unknown' ? ' (hold for Sean)' : ' (filler by rule)'}`);
      c.signals = s; continue;
    }
    if (c.bucket === 'series') { c.proposal = 'series'; s.push(`relation ${[...c.relations].filter((r) => !IGNORED_RELATIONS.has(r)).join('/')}`); c.signals = s; continue; }
    // the sequel bucket — the precedence
    const open = [...c.owners].filter((o) => input.openEnded.has(o));
    if (open.length) { c.proposal = 'component'; s.push(`declared open-ended I15: ${open.join(', ')}`); c.signals = s; continue; }
    const staged = input.staged.get(c.anilistId);
    const titles = [c.title, staged?.title.romaji, staged?.title.english];
    const ownerTitles = [...c.owners].flatMap((o) => input.ownerTitles.get(o) ?? []);
    const cont = titleContinuity(titles, ownerTitles);
    const ownerMangas = [...c.owners].map((o) => input.ownerManga.get(o) ?? null).filter((x): x is number => x != null);
    if (cont === 'ordinal') { c.proposal = 'component'; s.push('title continuity: season ordinal'); c.signals = s; continue; }
    if (c.mangaId != null && ownerMangas.length && !ownerMangas.includes(c.mangaId)) {
      c.proposal = 'series';
      s.push(`title continuity: ${cont === 'subtitle' ? 'new subtitle' : 'unrelated title'}`, `different manga ${c.mangaId} vs ${ownerMangas.join('/')} (the Clear Card precedent)`);
      c.signals = s; continue;
    }
    c.proposal = 'ambiguous';
    s.push(`title continuity: ${cont === 'subtitle' ? 'new subtitle' : 'unrelated title'}`);
    s.push(!c.staged ? 'not staged (manga unknown — run discovery-stage)' : c.mangaId == null ? 'no manga edge' : ownerMangas.includes(c.mangaId) ? `same manga ${c.mangaId} (no signal)` : 'owner manga unknown');
    c.signals = s;
  }
  return [...out.values()].sort((a, b) => b.popularity - a.popularity);
}

export type DiscoveryClasses = {
  halo_sequel_unclaimed: Candidate[];
  halo_series_unclaimed: Candidate[];
  halo_extra_standing: Candidate[];
  discovery_new_since_sitting: Candidate[];
  discovery_ruled_unbuilt: { anilistId: number; ruling: DiscoveryRuling; candidate: Candidate | null }[];
  discovery_ruling_stale: { anilistId: number; ruling: DiscoveryRuling; why: string }[];
};

/** the census classes over the derivation (P5 — outcomes, read from staging + the map) */
export function discoveryClasses(cands: Candidate[], input: DiscoveryInput, lastSitting: string | null): DiscoveryClasses {
  const byId = new Map(cands.map((c) => [c.anilistId, c]));
  const unruled = cands.filter((c) => !c.ruling);
  const out: DiscoveryClasses = {
    halo_sequel_unclaimed: unruled.filter((c) => c.bucket === 'sequel'),
    halo_series_unclaimed: unruled.filter((c) => c.bucket === 'series'),
    halo_extra_standing: unruled.filter((c) => c.bucket === 'extra' || c.bucket === 'recap' || c.bucket === 'crossover'),
    discovery_new_since_sitting: unruled.filter((c) => (c.bucket === 'sequel' || c.bucket === 'series') && (c.changedAt == null || lastSitting == null || c.changedAt > lastSitting)),
    discovery_ruled_unbuilt: [],
    discovery_ruling_stale: [],
  };
  for (const [idStr, ruling] of Object.entries(input.rulings)) {
    const id = Number(idStr);
    const owned = input.owned.has(id);
    const cand = byId.get(id) ?? null;
    if (ruling.disposition === 'related_work') continue; // an attribution: the candidate is a related work, never a series to build
    if (ruling.disposition === 'series') {
      if (!owned) out.discovery_ruled_unbuilt.push({ anilistId: id, ruling, candidate: cand });
      continue;
    }
    if (owned) out.discovery_ruling_stale.push({ anilistId: id, ruling, why: `ruled ${ruling.disposition} but the entry is now owned by ${input.owned.get(id)}` });
    else if (!cand) out.discovery_ruling_stale.push({ anilistId: id, ruling, why: `ruled ${ruling.disposition} but no owned entry relates to it any more (the edge is gone)` });
  }
  return out;
}

/** one line per candidate — the census / recap convention: owner first, stored state, then the proposal */
export function candidateLine(c: Candidate): string {
  const owners = [...c.owners].join(',');
  const rel = [...c.relations].filter((r) => !IGNORED_RELATIONS.has(r)).join('/') || [...c.relations].join('/');
  const stored = c.ruling ? `ruled ${c.ruling.disposition}` : 'unowned, no ruling';
  return `${owners}: anilist ${c.anilistId} ${c.title} [${c.format ?? '?'} ${c.status ?? '?'}] pop ${c.popularity} ← ${rel} · stored: ${stored} → proposed: ${c.proposal}${c.signals.length ? ` (${c.signals.join('; ')})` : ''}`;
}

/** the loader every reader shares (P2): owned ids, staging, owner titles / manga, the ruling map */
export async function loadDiscoveryInput(): Promise<DiscoveryInput> {
  const { selectAll } = await import('./db'); // lazy: the derivation above is pure and unit-tested without a DB
  const { DISCOVERY_RULINGS, OPEN_ENDED } = await import('./rulings/discovery');
  const series = await selectAll<{ id: string; anilist_id: number | null; manga_anilist_id: number | null; source_type: string | null }>('series', 'id, anilist_id, manga_anilist_id, source_type');
  const comps = await selectAll<{ series_id: string; anilist_id: number }>('series_components', 'series_id, anilist_id');
  const owned = new Map<number, string>();
  const ownerManga = new Map<string, number | null>();
  for (const s of series) { if (s.anilist_id != null) owned.set(s.anilist_id, s.id); ownerManga.set(s.id, s.manga_anilist_id); }
  for (const c of comps) owned.set(c.anilist_id, c.series_id);
  const staged = new Map<number, MediaLike>();
  const changedAt = new Map<number, string>();
  for (const r of await selectAll<{ anilist_id: number; raw: MediaLike; changed_at: string }>('ingest_anilist_media', 'anilist_id, raw, changed_at')) {
    staged.set(r.anilist_id, r.raw);
    changedAt.set(r.anilist_id, r.changed_at);
  }
  const ownerTitles = new Map<string, string[]>();
  for (const [id, owner] of owned) {
    const m = staged.get(id);
    if (!m) continue;
    const list = ownerTitles.get(owner) ?? [];
    for (const t of [m.title.romaji, m.title.english, ...(m.synonyms ?? [])]) if (t) list.push(t);
    ownerTitles.set(owner, list);
  }
  const { SOURCE_CHAINS } = await import('./rulings/source-chains');
  const chainWorks = new Map<string, number[]>();
  for (const [sid, chain] of Object.entries(SOURCE_CHAINS as Record<string, { works?: { anilistMangaId?: number | null }[] }>)) chainWorks.set(sid, (chain.works ?? []).map((w) => w.anilistMangaId).filter((n): n is number => n != null)); // I41: the chain's field is anilistMangaId (read as anilistId until 2026-09-05 — every chain looked empty)
  // T25 / I45: every owner's instrument node set — a novel owner's NOVEL nodes come from the edges of its own owned entries
  const ownedBy = new Map<string, number[]>();
  for (const [id, owner] of owned) ownedBy.set(owner, [...(ownedBy.get(owner) ?? []), id]);
  const { ENTRIES: FRANCHISE_ENTRIES, FRANCHISE_OF } = await import('./rulings/franchises');
  const baseOf = new Map<string, string>();
  for (const e of FRANCHISE_ENTRIES as { seriesId: string; value: { franchise: string | null; base?: true } }[]) if (e.value.base && e.value.franchise) baseOf.set(e.value.franchise, e.seriesId);
  const franchiseBase = new Map<string, string>();
  for (const s of series) { const f = (FRANCHISE_OF as Record<string, string | null | undefined>)[s.id]; const b = f ? baseOf.get(f) : undefined; if (b) franchiseBase.set(s.id, b); }
  const ownerInstruments = new Map<string, Set<number>>();
  for (const s of series) ownerInstruments.set(s.id, ownerInstrumentIds({ sourceType: s.source_type, mangaId: s.manga_anilist_id, chainWorkIds: chainWorks.get(s.id), ownedMedia: (ownedBy.get(s.id) ?? []).map((id) => staged.get(id) as never).filter(Boolean) }));
  return { owned, staged, changedAt, ownerTitles, ownerManga, rulings: DISCOVERY_RULINGS, openEnded: OPEN_ENDED, chainWorks, ownerInstruments, franchiseBase };
}

/**
 * STAGE THE HALO (I42): fetch and stage every unowned TV-shaped story relation of an owned entry,
 * walking SEQUEL chains through what was just staged, under a per-run budget (G58: a deferral is
 * data — an unstaged candidate leads the next run). Staging only — never a series, never a
 * component. Shared by discovery-stage.ts (the event script) and the refresh-discovery bundle.
 */
export async function stageHalo(opts: { budget?: number; rounds?: number; timeBudgetMs?: number; dryRun?: boolean; log?: (line: string) => void } = {}): Promise<{ staged: number; deferred: number; tv: number; tvStaged: number; extras: number; ignored: number; missing: number[]; requests: number }> {
  const { mediaByIds } = await import('./anilist');
  const { stageAniList } = await import('./resolve');
  const log = opts.log ?? (() => {});
  const BUDGET = opts.budget ?? 250, ROUNDS = opts.rounds ?? 3, t0 = Date.now();
  const input = await loadDiscoveryInput();
  let staged = 0, deferred = 0, requests = 0;
  const missing: number[] = [];
  for (let round = 1; round <= ROUNDS; round++) {
    if (opts.timeBudgetMs && Date.now() - t0 > opts.timeBudgetMs) break;
    const cands = haloCandidates(input);
    const want = cands.filter((c) => !c.staged && !PROMO.test(c.title) && (c.bucket === 'sequel' || c.bucket === 'series' || c.bucket === 'extra' || c.bucket === 'recap')).sort((a, b) => b.popularity - a.popularity); // I45: extras and recaps are staged too; crossovers are listed, not fetched
    if (!want.length) { log(`[stage-halo] round ${round}: nothing unstaged — the halo is staged`); break; }
    const take = want.slice(0, Math.max(0, BUDGET - staged));
    deferred = want.length - take.length;
    log(`[stage-halo] round ${round}: ${want.length} TV-shaped candidates unstaged, staging ${take.length}${deferred ? ` (${deferred} deferred to the next run — budget ${BUDGET})` : ''}${opts.dryRun ? ' — DRY RUN' : ''}`);
    for (const c of take.slice(0, 12)) log(`   ${[...c.owners].join(',')}: anilist ${c.anilistId} ${c.title} [${c.format ?? '?'} ${c.status ?? '?'}] pop ${c.popularity} ← ${[...c.relations].join('/')}${c.hop > 1 ? ` (hop ${c.hop})` : ''}`);
    if (take.length > 12) log(`   …+${take.length - 12} more`);
    if (opts.dryRun || !take.length) break;
    const media = await mediaByIds(take.map((c) => c.anilistId));
    requests += Math.ceil(take.length / 50);
    for (const m of media) {
      await stageAniList(m);
      input.staged.set(m.id, m as unknown as MediaLike);
      input.changedAt.set(m.id, new Date().toISOString());
      staged++;
    }
    for (const c of take) if (!media.some((m) => m.id === c.anilistId)) missing.push(c.anilistId);
    if (staged >= BUDGET) { log(`[stage-halo] budget ${BUDGET} reached — the rest leads the next run`); break; }
  }
  const after = haloCandidates(input);
  const tv = after.filter((c) => c.bucket === 'sequel' || c.bucket === 'series');
  return { staged, deferred, tv: tv.length, tvStaged: tv.filter((c) => c.staged).length, extras: after.filter((c) => c.bucket === 'extra').length, ignored: after.filter((c) => c.bucket === 'ignored').length, missing, requests };
}
