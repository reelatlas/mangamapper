// RELATED WORKS — the ledger's derivation (I45; Sean 2026-09-05, the extras
// sitting). Every recap, compilation, special, OVA and film that AniList
// relates to a series we hold is a ROW in watch_order_entries (origin
// 'halo'), whether or not it counts (N4) and whether or not it surfaces
// (N31). Three layers, never collapsed: the ledger lists everything; the
// numbered count admits only counted extras (N8: a recap never becomes an
// integer row); the series page shows only labeled rows.
//
// The BUCKET is what the full media says, and it decides the standing BY
// RULE where a rule can:
//   recap            — SUMMARY / COMPILATION relations, or a recap title → filler, kind recap
//   original         — source ORIGINAL (T25: no instrument)            → filler
//   same_instrument  — adapts the owner's own manga (I38 pick) or a chain work (I41) → standing PENDING: the sitting / research decides (canon or mixed, with its chapters)
//   other_instrument — adapts another instrument                         → standing pending; also a series candidate (the KonoSuba-Explosion shape)
//   crossover        — reached by a CHARACTER edge only                  → filler (listed, not fetched by default)
//   unknown          — a source naming no instrument node, or an unregistered source → held for Sean
// The POSITION is derived from the work's air date against the series' episode
// dates (after the last episode that aired before it; 0.5 before ep 1) — a
// PROPOSAL; a ruling (watch-order-labels.ts, by AniList id) overrides it.
import { pickMangaNode } from './rulings/source-relations';

export type ExtraBucket = 'recap' | 'original' | 'same_instrument' | 'other_instrument' | 'crossover' | 'unknown' | 'promo' | 'alternative';

/** the relations that put a related work IN an owner's run — AniList's OTHER is how it labels an entry's own specials and shorts (Shippuden's Sunny Side Battle, Railgun S's bathhouse special), so it counts; ALTERNATIVE and SAME_UNIVERSE are a different telling or a different work (I16) */
/** the STRONG in-run relations — OTHER is weak: it owns a work only when nothing stronger reaches it and no ALTERNATIVE edge does (Prisma Illya's OTHER edge to the Heaven's Feel films must not out-rank Fate's ALTERNATIVE) */
export const STRONG_IN_RUN_RELATIONS = new Set(['SEQUEL', 'PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'SUMMARY', 'COMPILATION']); // PARENT is the owner's ANCESTOR (a spin-off's edge to the main line), never a work in the owner's run

/**
 * who owns a related work (I45 / I16), in precedence: (1) the owners that reached it by a STRONG in-run relation (SEQUEL / PREQUEL /
 * SIDE_STORY / SPIN_OFF / SUMMARY / COMPILATION — Sailor Moon Eternal continues Crystal even though the 1990s series calls it ALTERNATIVE);
 * (2) else an owner that is its own franchise BASE (or has no franchise) and reached it by ALTERNATIVE / SAME_UNIVERSE says "a different
 * telling of me": an alternative adaptation under that base (the 1995 Ghost in the Shell beside SAC); (3) else the owners that reached it by
 * OTHER (Shippuden's own specials); (4) else every owner. PARENT is never a claim (the owner is the child). Where AniList's labels still
 * mis-attribute (Fate/Zero's SEQUEL to three rival stay-night adaptations) a 'related_work' ruling names the owner and the bucket.
 */
export function relatedWorkOwners(ownerRelations: Map<string, Set<string>>, baseOf: (owner: string) => string = (o) => o): { owners: Set<string>; alternative: boolean } {
  const baseAlt = new Set<string>(); const strong = new Set<string>(); const other = new Set<string>();
  for (const [o, rels] of ownerRelations) {
    if ([...rels].some((r) => STRONG_IN_RUN_RELATIONS.has(r))) strong.add(o);
    else if ((rels.has('ALTERNATIVE') || rels.has('SAME_UNIVERSE')) && baseOf(o) === o) baseAlt.add(o);
    else if (rels.has('OTHER')) other.add(o);
  }
  if (strong.size) return { owners: strong, alternative: false };
  if (baseAlt.size) return { owners: baseAlt, alternative: true };
  if (other.size) return { owners: other, alternative: false };
  return { owners: new Set(ownerRelations.keys()), alternative: false };
}
export type Standing = 'canon' | 'mixed' | 'filler';

export type ExtraMedia = {
  id: number;
  title: { romaji: string | null; english?: string | null };
  format: string | null;
  status?: string | null;
  source?: string | null;
  episodes?: number | null;
  startDate?: { year?: number | null; month?: number | null; day?: number | null } | null;
  relations?: { edges: { relationType: string; node: { id: number; type: string; format?: string | null; popularity?: number | null; title: { romaji: string | null } } }[] } | null;
};

const RECAP_TITLE = /\b(recap|summary|digest|compilation|special edition|re-?cut)\b|総集編|ダイジェスト/i;
/** I45 (amended 2026-09-05, Sean's ruling (e)): a promotional entry — a trailer, PV, teaser, commercial, promotion — is never a related work; like a music video it is listed by the census (extra_promo) and never a ledger row. AniList gives no format for these (SPECIAL / ONA), the title is the signal */
export const PROMO = /\b(?:PV|trailer|promo(?:tion(?:al)?)?|teaser|CM|music video|uta gassen)\b|歌合戦|ミュージックビデオ/i; // Sean 2026-09-05 (wave 2): a music video AniList files as an OVA is still a music video

/** a title reduced to its comparable core: lower-case, no diacritics, a trailing parenthetical dropped ("(film, 2021-08-06)"), punctuation collapsed */
export const normTitle = (t: string): string => t.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/\s*\([^)]*\)\s*$/, '').replace(/[^a-z0-9]+/g, ' ').trim();

/** I46 — one row per work: does a stored row of another origin (a wiki fractional row, a ruling row) name this related work? equality of the cores, or containment when the shorter core is long enough to be a name (never "ova" against everything) */
export function matchRelatedTitle(candidateTitle: string, rowTitle: string): boolean {
  return titleMatch(candidateTitle, rowTitle) != null;
}

/** the strength of a title match: the cores are EQUAL, or one CONTAINS the other (a name-length core only) — an equal match beats a containing one when two works fit a row */
export function titleMatch(candidateTitle: string, rowTitle: string): 'equal' | 'contains' | null {
  const a = normTitle(candidateTitle), b = normTitle(rowTitle);
  if (!a || !b) return null;
  if (a === b) return 'equal';
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 10 && long.includes(short) ? 'contains' : null;
}

export type AdoptionPick<T> = { row: T; reason: string } | { row: T; ambiguous: string } | null;

/**
 * I46 — which stored row of another origin adopts this work's identity, if any. Fails closed: two rows fitting one work,
 * or two works fitting one row with nothing to separate them, is AMBIGUOUS (listed, never adopted). What separates them,
 * in order: an EQUAL title beats containing ones (Cardcaptor Sakura: The Movie vs ... The Movie 2: The Sealed Card); the
 * row's YEAR when exactly one of the fitting works shares it. Dates a year apart or more never adopt.
 */
export function pickAdoption<T extends { title: string; air_date?: string | null }>(
  work: { title: string; year: number | null },
  pool: T[],
  siblings: { title: string; year: number | null }[],
): AdoptionPick<T> {
  const fits = pool.filter((r) => titleMatch(work.title, r.title) != null);
  if (!fits.length) return null;
  if (fits.length > 1) return { row: fits[0], ambiguous: `the title fits ${fits.length} stored rows (@${fits.map((r) => (r as { position?: number }).position ?? '?').join(', @')})` };
  const row = fits[0];
  const rowYear = row.air_date ? Number(String(row.air_date).slice(0, 4)) : null;
  const mine = titleMatch(work.title, row.title);
  const rivals = siblings.filter((x) => titleMatch(x.title, row.title) != null).map((x) => ({ ...x, strength: titleMatch(x.title, row.title) }));
  if (rivals.length) {
    if (mine === 'equal' && rivals.every((r) => r.strength === 'contains')) return { row, reason: `exact title (${rivals.length} other work${rivals.length > 1 ? 's' : ''} only contain it)` };
    if (rivals.some((r) => r.strength === 'equal') && mine === 'contains') return null; // the exact one adopts on its turn
    if (rowYear != null) {
      const sameYear = [work, ...rivals].filter((x) => x.year === rowYear);
      if (sameYear.length === 1 && sameYear[0] === work) return { row, reason: `the row's year ${rowYear} picks this work of ${rivals.length + 1} that fit` };
      if (sameYear.length === 1) return null; // a rival shares the year — its turn
    }
    return { row, ambiguous: `also fits ${rivals.map((r) => r.title).join(' / ')}${rowYear == null ? ' and the row has no date' : ''}` };
  }
  if (rowYear != null && work.year != null && Math.abs(rowYear - work.year) > 1) return { row, ambiguous: `dates disagree (row ${rowYear}, work ${work.year})` };
  return { row, reason: mine === 'equal' ? 'exact title' : 'title' };
}

/** the node formats an AniList `source` names as its instrument (T25: the unit a standing is measured against) — a novelization of a manga-sourced film is a downstream adaptation, never its source */
export const SOURCE_FORMATS: Record<string, readonly string[]> = {
  MANGA: ['MANGA', 'ONE_SHOT'], ONE_SHOT: ['ONE_SHOT', 'MANGA'], DOUJINSHI: ['MANGA', 'ONE_SHOT'],
  LIGHT_NOVEL: ['NOVEL'], NOVEL: ['NOVEL'], WEB_NOVEL: ['NOVEL'],
};
/** our T25 source_type values whose instrument node is NOVEL-format on AniList (a series row registers no manga id for them) */
export const NOVEL_SOURCE_TYPES = new Set(['light_novel', 'novel', 'web_novel']);

export type AdaptedNode = { id: number; format: string | null; title: string | null };

/** the works a media adapts under its OWN source: ADAPTATION edges to MANGA-type nodes whose format the source names — [] when the source is ORIGINAL, unknown, or names nothing (an edge to a novelization is not a source) */
export function adaptedNodes(media: ExtraMedia | null): AdaptedNode[] {
  const formats = media?.source ? SOURCE_FORMATS[media.source] : undefined;
  if (!media || !formats) return [];
  return (media.relations?.edges ?? [])
    .filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA' && formats.includes(e.node.format ?? ''))
    .sort((a, b) => (b.node.popularity ?? 0) - (a.node.popularity ?? 0))
    .map((e) => ({ id: e.node.id, format: e.node.format ?? null, title: e.node.title?.romaji ?? null }));
}

/**
 * the owner's INSTRUMENT node set on AniList: the registered manga (I38's pick / MANGA_LINK_OVERRIDES) and every chain work (I41);
 * a novel-instrument series (T25 light_novel / novel / web_novel) registers no manga id — its instrument is the NOVEL-format node(s)
 * its OWN anime entries adapt (AniList splits some novels per volume; the union over every owned entry is the set). A manga owner's
 * novel edges (novelizations, side novels) are never its instrument.
 */
export function ownerInstrumentIds(owner: { sourceType: string | null; mangaId: number | null; chainWorkIds?: Iterable<number>; ownedMedia?: Iterable<ExtraMedia> }): Set<number> {
  const ids = new Set<number>(owner.chainWorkIds ?? []);
  if (owner.mangaId != null) ids.add(owner.mangaId);
  if (owner.sourceType && NOVEL_SOURCE_TYPES.has(owner.sourceType)) {
    for (const m of owner.ownedMedia ?? []) for (const e of m.relations?.edges ?? []) if (e.relationType === 'ADAPTATION' && e.node.type === 'MANGA' && e.node.format === 'NOVEL') ids.add(e.node.id);
  }
  return ids;
}

/** the bucket, from the relation kinds that reached the work and its own media (null media = unstaged) */
export function extraBucket(relations: Iterable<string>, media: ExtraMedia | null, owner: { mangaId: number | null; chainWorkIds?: Iterable<number>; instrumentIds?: Iterable<number> }, edgeTitle?: string | null): ExtraBucket | 'unstaged' {
  const rels = new Set(relations);
  const title = media ? `${media.title.english ?? ''} ${media.title.romaji ?? ''}` : (edgeTitle ?? ''); // an unfetched work is known by its edge title only
  if (PROMO.test(title)) return 'promo'; // never a related work, whatever its edges (I45 amended)
  if (rels.has('SUMMARY') || rels.has('COMPILATION')) return 'recap';
  const story = [...rels].filter((r) => r !== 'CHARACTER');
  if (!story.length && rels.has('CHARACTER')) return 'crossover';
  if (!media) return 'unstaged';
  if (RECAP_TITLE.test(title)) return 'recap';
  if (media.source === 'ORIGINAL') return 'original';
  const nodes = adaptedNodes(media);
  if (nodes.length) {
    const own = new Set<number>([...(owner.chainWorkIds ?? []), ...(owner.instrumentIds ?? [])]);
    if (owner.mangaId != null) own.add(owner.mangaId);
    return nodes.some((n) => own.has(n.id)) ? 'same_instrument' : 'other_instrument';
  }
  // a source that is not ORIGINAL and names no instrument node is HELD: AniList's franchise tag with no chapters behind it (most
  // franchise films), a novel film whose edge is missing, a visual-novel / game source AniList has no node for (the Heaven's Feel
  // films adapt their VN — a rule cannot call that filler; T25 gives the owner no unit, so the sitting / research decides)
  return 'unknown';
}

/** the standing a RULE can decide; null = the sitting / research decides (never a guess) */
export function extraStanding(bucket: ExtraBucket | 'unstaged'): Standing | null {
  if (bucket === 'recap' || bucket === 'original' || bucket === 'crossover') return 'filler';
  return null;
}

/** the format axis of a related work (T29's vocabulary for watch-order entries) */
export function extraKind(format: string | null, bucket: ExtraBucket | 'unstaged'): string | null {
  if (bucket === 'promo') return null; // never a row
  if (bucket === 'recap') return 'recap';
  if (format === 'MOVIE') return 'movie';
  if (format === 'OVA') return 'ova';
  if (format === 'SPECIAL') return 'special';
  if (format === 'TV' || format === 'TV_SHORT' || format === 'ONA') return 'special'; // a TV-shaped extra that reached us as a side story
  return null;
}

export const isoDate = (d: ExtraMedia['startDate']): string | null => (d?.year ? `${d.year}-${String(d.month ?? 1).padStart(2, '0')}-${String(d.day ?? 1).padStart(2, '0')}` : null);

/**
 * the derived watch position: after the last episode that aired on or before the work's date
 * (N + 0.5), 0.5 before the first episode, null with no date — a PROPOSAL, never a ruling
 */
export function deriveWatchPosition(date: string | null, episodes: { number: number; air_date: string | null }[]): number | null {
  if (!date) return null;
  let last = 0;
  for (const e of episodes) if (e.air_date && e.air_date <= date && e.number > last) last = e.number;
  return last + 0.5;
}

/** a free position at or just above the derived one (the ledger's key is (series, position); steps of 0.01 keep date order) */
export function freePosition(derived: number, taken: Set<number>): number {
  let p = derived;
  for (let i = 0; i < 50 && taken.has(Number(p.toFixed(2))); i++) p = Number((p + 0.01).toFixed(2));
  return Number(p.toFixed(2));
}

/** buckets that own a ledger row — a promo is listed by the census only; an unstaged work has no media yet */
export const ledgerWorthy = (bucket: ExtraBucket | 'unstaged'): boolean => bucket !== 'promo' && bucket !== 'unstaged';

/** the standing the ledger writes: a RULING (lib/rulings/related-works.ts — researched, Sean-signed) beats the rule; null = still pending the sitting */
export const relatedWorkStanding = (bucket: ExtraBucket | 'unstaged', ruling: { standing?: Standing | null } | null | undefined): Standing | null => ruling?.standing ?? extraStanding(bucket);

/** one ruled move of a ledger row: identity (series, anilist_id) from its stored position to its ruled one */
export type RuledMove = { seriesId: string; anilistId: number; from: number; to: number };

/**
 * I45 — the RULED MOVES of a run, planned BEFORE any row is touched (the writer's pre-pass). The ledger key is
 * (series, position) while identity is (series, anilist_id), so a mover must leave its slot before another row can
 * take it and its ruled slot must be free before it lands. Two movers may SWAP (Made in Abyss: the recap films
 * ahead of the feature) and a mover may take a slot another mover is leaving; a ruled slot held by a row that is
 * NOT moving is REFUSED — the mover keeps its stored position (the census lists stored ≠ ruled) and is never
 * removed. Found by the wave-4 verifier on kinnikuman 3276 → 119.5 (the PSA's slot): removing the mover first and
 * refusing the insert afterwards would have deleted the row (2026-09-05).
 */
export const planRuledMoves = (
  rows: { seriesId: string; anilistId: number | null; position: number }[],
  ruledOf: (seriesId: string, anilistId: number) => number | null | undefined,
): { moves: RuledMove[]; refused: (RuledMove & { heldBy: number | null })[] } => {
  const movers: RuledMove[] = [];
  for (const r of rows) {
    if (r.anilistId == null) continue;
    const to = ruledOf(r.seriesId, r.anilistId);
    if (to != null && Number(r.position) !== to) movers.push({ seriesId: r.seriesId, anilistId: r.anilistId, from: Number(r.position), to });
  }
  const leaving = new Set(movers.map((m) => `${m.seriesId}@${m.from}`));
  const moves: RuledMove[] = []; const refused: (RuledMove & { heldBy: number | null })[] = [];
  for (const m of movers) {
    const holder = rows.find((r) => r.seriesId === m.seriesId && Number(r.position) === m.to);
    if (holder && !leaving.has(`${m.seriesId}@${m.to}`)) refused.push({ ...m, heldBy: holder.anilistId });
    else moves.push(m);
  }
  return { moves, refused };
};

/**
 * E2 (2026-09-05) — a positioned ledger row whose integer BASE has no episode row in the owner's grid: the grid changed
 * under the position (a deleted row strands it; a RENUMBER (N11) does not — it re-keys ledger positions like anchors and
 * annotations, the apply-batch sweep). position 0.x (before ep 1) is allowed.
 */
export const ledgerBaseProblems = (
  rows: { seriesId: string; position: number; title?: string | null }[],
  episodeNumbers: (seriesId: string) => Set<number>,
  /** a RULED position is a fixed point, never stranded — Sean's community-numbered counted extras (my-hero-academia 171 = '170+1', N4) sit past the grid by ruling */
  isRuled: (seriesId: string, position: number) => boolean = () => false,
): string[] => {
  const out: string[] = [];
  for (const r of rows) {
    const base = Math.floor(Number(r.position));
    if (isRuled(r.seriesId, Number(r.position))) continue;
    if (base >= 1 && !episodeNumbers(r.seriesId).has(base)) out.push(`${r.seriesId} @${r.position} "${String(r.title ?? '').slice(0, 40)}": base episode ${base} has no row — the grid changed under the position (a renumber re-keys ledger positions like anchors; a deleted row strands them)`);
  }
  return out;
};

/**
 * E13 (2026-09-05) — inside one base slot the UNRULED rows must sit in air-date order among themselves; ruled rows are
 * fixed points and are skipped (once a cluster is partly ruled, mixed clusters are the normal case). A stored order that
 * disagrees is insertion history (ranma-1-2 @161.5x before its ruling) — a listing until the cluster is ruled, or until
 * the writer re-walks unruled rows between fixed points (after E1, the identity key).
 */
export const clusterDisorder = (
  rows: { seriesId: string; position: number; airDate: string | null; ruled: boolean; title?: string | null }[],
): string[] => {
  const by = new Map<string, typeof rows>();
  for (const r of rows) { const k = `${r.seriesId}#${Math.floor(Number(r.position))}`; by.set(k, [...(by.get(k) ?? []), r]); }
  const out: string[] = [];
  for (const [k, cluster] of by) {
    const unruled = cluster.filter((r) => !r.ruled && r.airDate).sort((a, b) => Number(a.position) - Number(b.position));
    for (let i = 1; i < unruled.length; i++) {
      if ((unruled[i].airDate as string) < (unruled[i - 1].airDate as string)) {
        out.push(`${k}: @${unruled[i - 1].position} (${unruled[i - 1].airDate}) sits before @${unruled[i].position} (${unruled[i].airDate}) — unruled rows out of air-date order (insertion history): rule the cluster, or the re-walk after E1`);
        break;
      }
    }
  }
  return out;
};
