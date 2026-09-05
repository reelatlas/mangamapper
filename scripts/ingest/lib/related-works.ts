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

export type ExtraBucket = 'recap' | 'original' | 'same_instrument' | 'other_instrument' | 'crossover' | 'unknown';
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
export function extraBucket(relations: Iterable<string>, media: ExtraMedia | null, owner: { mangaId: number | null; chainWorkIds?: Iterable<number>; instrumentIds?: Iterable<number> }): ExtraBucket | 'unstaged' {
  const rels = new Set(relations);
  if (rels.has('SUMMARY') || rels.has('COMPILATION')) return 'recap';
  const story = [...rels].filter((r) => r !== 'CHARACTER');
  if (!story.length && rels.has('CHARACTER')) return 'crossover';
  if (!media) return 'unstaged';
  const title = `${media.title.english ?? ''} ${media.title.romaji ?? ''}`;
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
