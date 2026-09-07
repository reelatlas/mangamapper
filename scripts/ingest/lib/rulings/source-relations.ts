// SOURCE RELATIONS — how the anime relates to its linked source work (rule
// I40, Sean 2026-08-28). `series.source_type` (T25) names WHAT the linked
// work is; `series.source_relation` names HOW the anime stands to it:
//   adaptation — the anime adapts the work (today's default world)
//   parallel   — two official realizations of ONE unpublished outline;
//                neither adapts the other (dragon-ball-super: the Toei series
//                and Toyotarou's manga from Toriyama's text outline; AniList's
//                anime→manga edge is ALTERNATIVE and correct)
// NULL when the series has no source (a studio original — T25 `original`).
//
// Consequences the gates and the display read from the relation, never from
// the series id:
//   - the manga link on a parallel series is a RULING (mangaAnilistId) — the
//     ADAPTATION-only pickManga has nothing to pick; pickMangaNode honours it
//   - standing on a parallel series is FROM THE OUTLINE OR NOT (T30), never
//     "in the manga or not": canon = the story in any telling, filler = studio
//     padding, mixed = both in one episode under the T28 bar
//   - positions on a parallel series are CORRESPONDENCE (A46: lib/rulings/
//     arcs.ts + correspondence.ts), never anchors or continue points — every
//     anchor writer refuses (syncAnchors / applyContinua / applyMuFrontier /
//     writeCuratedContinue), the healer removes standing rows, the census
//     lists parallel_has_anchor
//   - anchor_gap_research / frontier_tail_null / the pending_* classes skip a
//     parallel series — their instrument is the correspondence tables
// Pure — no db import — so src/data/catalog/assemble.ts reads the same map.
import { toRecord, type RulingEntry } from './types';

export const SOURCE_RELATIONS = ['adaptation', 'parallel'] as const;
export type SourceRelation = (typeof SOURCE_RELATIONS)[number];

export type SourceRelationRuling = {
  relation: SourceRelation;
  /** the linked manga when the relation is not derivable from an ADAPTATION edge (parallel) — the node must exist in the anime's staged relations */
  mangaAnilistId?: number;
};

export const ENTRIES: RulingEntry<SourceRelationRuling>[] = [
  {
    seriesId: 'dragon-ball-super',
    ruleId: 'I40',
    value: { relation: 'parallel', mangaAnilistId: 86508 },
    reason:
      "Two official realizations of one unpublished text outline, not an adaptation in either direction: ja-WP (DBS 制作) — 「そのストーリー原案を基にして、テレビシリーズと漫画版それぞれのスタッフが同時進行で作品を制作しているため、大筋の物語の展開は同一だが…相互に補完する関係性となっている」; Kanzenshuu's manga guide records the same simultaneous production from Toriyama's outline and a monthly manga that ran BEHIND the weekly anime through the Future Trunks and Universe Survival arcs (chs 35-42 postdate the finale) and past it (chs 43-104: Moro, Granolah, Super Hero — never animated as TV). AniList types anime 21175 → manga 86508 as ALTERNATIVE (its ADAPTATION edges: none; the two films are ALTERNATIVE too) — a correct edge, so pickManga picks nothing and the link is this ruling: 86508 『ドラゴンボール超』 (漫画 とよたろう / 原作 鳥山明, V-Jump, first chapter 2015-06-20, its own 其之一…其之百四 numbering). Chapter numbers on this series are CORRESPONDENCE, never adaptation (A46); the standing is from-the-outline-or-not (T30); Toyotarou's separate three-chapter 『復活の「F」』 comic is a different chapter space (batch 19) and never mixes in. Wave 5 (batch 20) verified R24; Sean ruled the relation 2026-08-28 after the timelines model (A manga-only / B anime-only / C both / D studio padding / E mixed).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: [
      'https://ja.wikipedia.org/wiki/ドラゴンボール超',
      'https://www.kanzenshuu.com/manga/super/',
      'https://anilist.co/manga/86508',
      'scripts/ingest/research/batch20/out/dragon-ball-super-w5a.json',
      'scripts/ingest/research/batch20/out/dragon-ball-super-w5b.json',
      'scripts/ingest/research/batch20/WAVE5-RECOVERY.md',
    ],
  },
  {
    seriesId: 'attack-on-titan-no-regrets',
    ruleId: 'I38',
    value: { relation: 'adaptation', mangaAnilistId: 85199 },
    reason:
      "The step-2 seed dry run (2026-09-06): AniList tags the No Regrets OVA's source VISUAL_NOVEL (the pachislot game the OVA shares its title with), so the I38 pick found no manga; the OVA adapts 悔いなき選択 (Suruga, 2013-14, 11 ch / 2 vols; AniList 85199 / MAL 58007) — the tag routes, the edge is the fact (I47).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-06',
    cite: ['scripts/ingest/research/discovery/out/triage__attack-on-titan.json', 'https://anilist.co/manga/85199'],
  },
  {
    seriesId: 'magic-knight-rayearth-2026',
    ruleId: 'I38',
    value: { relation: 'adaptation', mangaAnilistId: 30119 },
    reason:
      "C2 (2026-09-07, the seed dry run): AniList links the 2026 series to the CLAMP manga (30119 — the 1994 series' own ADAPTATION instrument) with an ALTERNATIVE label, not ADAPTATION, so the I38 pick found no manga and the plan read 'manga none'. The edge-label trap on a re-adaptation: the tag routes, the edge is the fact (I47); a manual override, never a wider filter (I38).",
    ruledBy: 'Sean',
    ruledOn: '2026-09-07',
    cite: ['scripts/ingest/seed.ts --dry-run (2026-09-07)', 'https://anilist.co/anime/178868', 'https://anilist.co/manga/30119', 'docs/changelog.md §12.148'],
  },
];

/** seriesId → the ruled relation (parallel today; an adaptation ruling would only override a wrong derivation) */
export const SOURCE_RELATION_OVERRIDES: Record<string, SourceRelationRuling> = toRecord(ENTRIES);

/** seriesId → the ruled manga AniList id (a parallel series' link; consulted by pickMangaNode) */
export const MANGA_LINK_OVERRIDES: Record<string, number> = Object.fromEntries(
  ENTRIES.filter((e) => e.value.mangaAnilistId != null).map((e) => [e.seriesId, e.value.mangaAnilistId as number]),
);

export const isParallelSeries = (seriesId: string): boolean => SOURCE_RELATION_OVERRIDES[seriesId]?.relation === 'parallel';

/** the relation to store: null without a source (T25 identity), the ruling when one exists, else adaptation */
export const deriveSourceRelation = (seriesId: string, hasSource: boolean): SourceRelation | null =>
  hasSource ? SOURCE_RELATION_OVERRIDES[seriesId]?.relation ?? 'adaptation' : null;

type RelationEdge<N> = { relationType: string; node: N & { id: number; type: string; format: string | null; popularity?: number | null } };

/**
 * The source manga node from the anime's staged relations: an ADAPTATION
 * edge of format MANGA, most popular on ties — OR, when a ruling names the
 * link (a parallel series), that node whatever its relationType. The node
 * still comes from staging (volumes / chapters / country / status), so a
 * ruling can never invent a work: a ruled id absent from the relations
 * returns null and the census lists ruling_violation.
 */
export function pickMangaNode<N>(edges: RelationEdge<N>[], seriesId?: string | null): RelationEdge<N>['node'] | null {
  const ruled = seriesId ? MANGA_LINK_OVERRIDES[seriesId] : undefined;
  if (ruled != null) return edges.find((e) => e.node.id === ruled && e.node.type === 'MANGA')?.node ?? null;
  const candidates = edges
    .filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA' && e.node.format === 'MANGA')
    .sort((a, b) => (b.node.popularity ?? 0) - (a.node.popularity ?? 0));
  return candidates[0]?.node ?? null;
}
