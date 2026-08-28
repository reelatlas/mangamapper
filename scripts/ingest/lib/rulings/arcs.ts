// RULED ARCS — the arc-grain correspondence (rule A46, Sean 2026-08-28). An
// arc is how a stretch of the anime and a stretch of the source sit on the
// story: `shared` (both tellings have the arc — timelines A/B/C live inside
// it), `anime_only` (studio padding no other telling carries — timeline D;
// the mechanical B-vs-D proxy: a canon row inside an anime_only arc is an
// audit conflict unless adopted{author}), `manga_only` (the manga's own
// story / the post-anime tail; ch_end null = open to the frontier),
// `side_source` (another licensed work — a film — named in note). Arcs are
// PERMITTED on any series and REQUIRED to partition 1..N on a parallel one.
// Asserted into series_arcs by assert-overrides.ts (origin 'ruling').
import { toRecord, type RulingEntry } from './types';

export const ARC_KINDS = ['shared', 'anime_only', 'manga_only', 'side_source'] as const;
export type ArcKind = (typeof ARC_KINDS)[number];

export type Arc = {
  label: string;
  kind: ArcKind;
  epStart?: number;
  epEnd?: number;
  chStart?: number;
  /** null on a manga_only arc = open to the current frontier */
  chEnd?: number | null;
  note: string;
};

/** the shape rules, as data — the migration's check constraints say the same thing */
export const arcProblem = (a: Arc): string | null => {
  if (!(ARC_KINDS as readonly string[]).includes(a.kind)) return `kind '${a.kind}' is not in the vocabulary`;
  const hasEp = a.epStart != null && a.epEnd != null;
  const hasCh = a.chStart != null;
  if (a.kind === 'manga_only' && (a.epStart != null || a.epEnd != null || !hasCh)) return 'manga_only takes chapters only';
  if ((a.kind === 'anime_only' || a.kind === 'side_source') && (!hasEp || hasCh || a.chEnd != null)) return `${a.kind} takes episodes only`;
  if (a.kind === 'shared' && (!hasEp || !hasCh)) return 'shared needs both an episode range and a chapter range';
  if (a.kind === 'side_source' && !a.note.trim()) return 'side_source must name the work in note';
  if (hasEp && (a.epEnd as number) < (a.epStart as number)) return `episode range ${a.epStart}-${a.epEnd} is backwards`;
  if (a.chStart != null && a.chEnd != null && a.chEnd < a.chStart) return `chapter range ${a.chStart}-${a.chEnd} is backwards`;
  return null;
};

/**
 * Episode-side partition check: the arcs that carry episodes must cover
 * 1..totalEpisodes exactly once; chapter ranges must not overlap. Returns
 * the problems (empty = a partition). Pure; the census and the tests call it.
 */
export function arcsPartitionProblems(arcs: Arc[], totalEpisodes: number): string[] {
  const problems: string[] = [];
  for (const a of arcs) { const p = arcProblem(a); if (p) problems.push(`${a.label}: ${p}`); }
  const eps = arcs.filter((a) => a.epStart != null && a.epEnd != null).sort((x, y) => (x.epStart as number) - (y.epStart as number));
  let next = 1;
  for (const a of eps) {
    const s = a.epStart as number, e = a.epEnd as number;
    if (s > next) problems.push(`episodes ${next}-${s - 1} are in no arc`);
    if (s < next) problems.push(`${a.label} overlaps the previous arc at episodes ${s}-${Math.min(e, next - 1)}`);
    next = Math.max(next, e + 1);
  }
  if (totalEpisodes > 0 && next <= totalEpisodes) problems.push(`episodes ${next}-${totalEpisodes} are in no arc`);
  const chs = arcs.filter((a) => a.chStart != null).sort((x, y) => (x.chStart as number) - (y.chStart as number));
  let chNext = -Infinity;
  for (const a of chs) {
    const s = a.chStart as number;
    if (s < chNext) problems.push(`${a.label} overlaps the previous arc's chapters from ${s}`);
    chNext = a.chEnd == null ? Infinity : Math.max(chNext, (a.chEnd as number) + 1);
  }
  return problems;
}

/** the arc an episode falls in (episode-carrying kinds only) */
export const arcOfEpisode = (arcs: Arc[], episode: number): Arc | null => arcs.find((a) => a.epStart != null && a.epEnd != null && episode >= a.epStart && episode <= a.epEnd) ?? null;

export const ENTRIES: RulingEntry<Arc[]>[] = [
  {
    seriesId: 'dragon-ball-super',
    ruleId: 'A46',
    value: [
      { label: 'Battle of Gods', kind: 'shared', epStart: 1, epEnd: 14, chStart: 1, chEnd: 4, note: "Both tellings descend from the 2013 film 『神と神』: the anime re-composes it as about one cour (ja-WP DBS 制作), the manga is a four-chapter DIGEST (65 pages; ja-WP 漫画版, Kanzenshuu). Told scene-by-scene differently (ja-WP 相違点). Ep 4 (the Pilaf gang) is studio padding inside the arc — filler by type, not an arc cut; ep 6 is film-only (side_source)." },
      { label: "Resurrection 'F'", kind: 'side_source', epStart: 15, epEnd: 27, note: "The anime restages the 2015 film 『ドラゴンボールZ 復活の「F」』 (原作・脚本 鳥山明); the manga SKIPS the arc (ja-WP 漫画：未登場; the Golden Frieza Saga's manga field is empty) and narrates its outcome twice (ch 5's opening, ch 32's flashback). Rows 18-21 / 23-27 carry side_source{the film} (batch 19); 15-17 and 22 are Toei bridges (filler)." },
      { label: 'Universe 6', kind: 'shared', epStart: 28, epEnd: 41, chStart: 5, chEnd: 13, note: "Toriyama's outline realized simultaneously by separate staffs (ja-WP: 同時進行 … 大筋の物語の展開は同一だが … 相互に補完する関係性); the manga three months ahead in print at the start, the anime three months ahead by the arc's end. Same spine, different paths (Blue Kaioken vs Super Saiyan God, the Hit fight's shape)." },
      { label: 'Copy-Vegeta', kind: 'anime_only', epStart: 42, epEnd: 46, note: "A mini anime-only saga (dragonball.fandom; the saga's manga field and Duplicate Vegeta's MangaName are empty); Kanzenshuu's chapter list has no gap between Champa ch 13 and Future Trunks ch 14; ja-WP does not list it among the arcs Toriyama outlined. Studio padding — timeline D." },
      { label: 'Future Trunks', kind: 'shared', epStart: 47, epEnd: 67, chStart: 14, chEnd: 26, note: "Both realize the outline; the anime ran AHEAD in publication (ep 47 2016-06-12 vs ch 14 2016-07-21) and the two diverge at almost every load-bearing beat (who visits Universe 10 — ep 53 is the anime's version of the Zamasu node the manga gives to Shin and Kibito; the Zamasu resolution). Eps 50 and 52 are slice-of-life padding inside the arc (filler by type)." },
      { label: 'Toei interludes', kind: 'anime_only', epStart: 68, epEnd: 76, note: "Nine anime-only episodes (the Shenron wish, the Arale crossover, the baseball match, the Great Saiyaman film, Krillin's training); manga ch 27 skips straight from the Zamasu aftermath into the Universe Survival arc and pairs with ep 77. Studio padding — timeline D." },
      { label: 'Universe Survival', kind: 'shared', epStart: 77, epEnd: 131, chStart: 27, chEnd: 42, note: "Recruitment 77-96 ↔ chs 27-32; the Tournament of Power 97-131 ↔ chs 33-42. The anime aired first throughout (ch 27 six months after ep 77; chs 35-42 postdate the finale). ~4:1 compression: the manga's Zen Exhibition is a twelve-God battle royal (the anime's Zeno Expo 79-81 is its own telling), Kale's rampage (chs 37-38) replaces many individual fights, Kefla fights Gohan, Ultra Instinct arrives from Kaioken exhaustion; the shared spine is the announcement, the ten-man teams, the 48-minute format, Frieza's recruitment, Universe 9 erased first, Goku's Ultra Instinct, Universes 7 and 11 last, Android 17's wish." },
      { label: 'Galactic Patrol Prisoner → Granolah → Super Hero', kind: 'manga_only', chStart: 43, chEnd: null, note: "The manga continues past the TV series (chs 43-104 as of 2025-04, on hiatus: Moro, Granolah the Survivor, the Super Hero arc) — never animated as television. Timeline A; the reading view's 'manga only' tail." },
    ],
    reason: "The wave-5 direction table (batch 20, R24-verified): the arcs and their T21 directions were the research deliverable; Sean ruled the model 2026-08-28 (arcs partition a parallel series; anime_only = studio padding; the film arc is side_source, not A-E). Ep-level interludes inside shared arcs (4, 16-17, 22, 50, 52) stay filler by TYPE — the arc is not cut around them.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-28',
    cite: ['scripts/ingest/research/batch20/WAVE5-RECOVERY.md', 'scripts/ingest/research/batch20/out/dragon-ball-super-w5a.json', 'scripts/ingest/research/batch20/out/dragon-ball-super-w5b.json', 'https://ja.wikipedia.org/wiki/ドラゴンボール超', 'https://www.kanzenshuu.com/manga/super/'],
  },
];

export const RULED_ARCS: Record<string, Arc[]> = toRecord(ENTRIES);
