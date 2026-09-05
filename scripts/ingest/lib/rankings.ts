// RANKINGS — the AniList reader (G60; Sean's go 2026-09-05, discovery go-list
// step 4; the design is research/discovery/PROPOSAL.md §3). The seed engines:
// which IPs should exist at all. AniList's ranked lists are STAGED as daily
// snapshots (ingest_anilist_rankings — greedy, G51, kept as history) and read
// back into ONE queue, seed_candidate: every media in the latest snapshot of
// every list that no series owns (I21) and no halo edge reaches (a related
// title belongs to the halo, I42), collapsed to its chain head, scored by
// PRODUCT FIT (popularity × how much is left to read × recency), franchise-
// shaped ("new IP" unless a relation reaches an owned series). A rank is the
// SORT KEY of the queue — never standing, never a mint, never authority (R4);
// promotion is the seed writer on a `series` ruling, at a /discover sitting.
import type { AniListMedia } from './anilist';
import { pickMangaNode } from './rulings/source-relations';

export type RankingList = { name: string; kind: 'ANIME' | 'MANGA'; args: string; pages: number; note: string };

/** the lists, in the order they pay (PROPOSAL.md §3) — the argument strings are the whole query; ~28 requests a week */
export const LISTS: RankingList[] = [
  { name: 'airing-manga', kind: 'ANIME', args: 'type: ANIME, format_in: [TV, ONA], source_in: [MANGA], status: RELEASING, isAdult: false, sort: POPULARITY_DESC', pages: 2, note: 'the product edge: manga-sourced TV / ONA airing now (a complete list, ~60)' },
  { name: 'upcoming-manga', kind: 'ANIME', args: 'type: ANIME, format_in: [TV, ONA], source_in: [MANGA], status: NOT_YET_RELEASED, isAdult: false, sort: POPULARITY_DESC', pages: 2, note: 'announced manga-sourced TV / ONA' },
  { name: 'airing-novel', kind: 'ANIME', args: 'type: ANIME, format_in: [TV, ONA], source_in: [LIGHT_NOVEL, WEB_NOVEL, NOVEL], status: RELEASING, isAdult: false, sort: POPULARITY_DESC', pages: 1, note: 'novel-sourced airing now (volume-space instruments, T24)' },
  { name: 'upcoming-novel', kind: 'ANIME', args: 'type: ANIME, format_in: [TV, ONA], source_in: [LIGHT_NOVEL, WEB_NOVEL, NOVEL], status: NOT_YET_RELEASED, isAdult: false, sort: POPULARITY_DESC', pages: 1, note: 'announced novel-sourced' },
  { name: 'popular-manga', kind: 'ANIME', args: 'type: ANIME, format_in: [TV, ONA], source_in: [MANGA], isAdult: false, sort: POPULARITY_DESC', pages: 10, note: 'the legacy gap: all-time popularity, manga-sourced (top 500)' },
  { name: 'popular-novel', kind: 'ANIME', args: 'type: ANIME, format_in: [TV, ONA], source_in: [LIGHT_NOVEL, WEB_NOVEL, NOVEL], isAdult: false, sort: POPULARITY_DESC', pages: 4, note: 'all-time popularity, novel-sourced (top 200)' },
  { name: 'trending', kind: 'ANIME', args: 'type: ANIME, format_in: [TV, ONA], isAdult: false, sort: TRENDING_DESC', pages: 2, note: 'breakouts before they rank (any source; originals are filtered at the queue)' },
  { name: 'manga-first', kind: 'MANGA', args: 'type: MANGA, format: MANGA, isAdult: false, sort: POPULARITY_DESC', pages: 6, note: 'big manga whose anime we lack (their ADAPTATION edges); a manga with no anime is a watch list' },
];

export type RankingRow = { list: string; snapshot: string; rank: number; anilist_id: number; raw: unknown };

type Node = { id: number; type: string; format?: string | null; status?: string | null; episodes?: number | null; popularity?: number | null; chapters?: number | null; volumes?: number | null; countryOfOrigin?: string | null; startDate?: { year?: number | null } | null; title: { romaji: string | null; english?: string | null } };
type MediaLike = { id: number; type?: string; format?: string | null; status?: string | null; source?: string | null; episodes?: number | null; chapters?: number | null; popularity?: number | null; startDate?: { year?: number | null } | null; title: { romaji: string | null; english?: string | null }; relations?: { edges: { relationType: string; node: Node }[] } | null };

const SERIES_FORMATS = new Set(['TV', 'TV_SHORT', 'ONA']);
const STORY = new Set(['SEQUEL', 'PREQUEL', 'SIDE_STORY', 'SPIN_OFF', 'ALTERNATIVE', 'PARENT', 'SAME_UNIVERSE', 'SUMMARY', 'OTHER']);

/** PRODUCT FIT: popularity × continuation (how much is left to read) × recency — documented, re-tunable, never authority */
export function productFitScore(m: MediaLike): { score: number; factors: string[] } {
  const factors: string[] = [];
  let f = 1;
  const manga = m.type === 'MANGA' ? (m as unknown as Node) : (pickMangaNode((m.relations?.edges ?? []) as never) as Node | null);
  if (manga?.status === 'RELEASING') { f *= 1.5; factors.push('source still publishing ×1.5'); }
  const eps = m.type === 'MANGA' ? null : m.episodes ?? null;
  if (manga?.chapters && eps && manga.chapters > eps * 4) { f *= 1.25; factors.push(`far more to read (${manga.chapters} ch vs ${eps} eps) ×1.25`); }
  if (m.type !== 'MANGA') {
    if (m.status === 'RELEASING') { f *= 1.2; factors.push('airing ×1.2'); }
    else if (m.status === 'NOT_YET_RELEASED') { f *= 1.1; factors.push('announced ×1.1'); }
  }
  return { score: Math.round((m.popularity ?? 0) * f), factors };
}

export type Seed = {
  anilistId: number; title: string; format: string | null; status: string | null; source: string | null; year: number | null;
  popularity: number; score: number; factors: string[];
  lists: { list: string; rank: number }[];
  manga: { id: number; status: string | null; chapters: number | null; country: string | null } | null;
  /** an unowned PREQUEL: this is a later season of an unowned chain — the head is the seed */
  headId: number | null;
  /** from the manga-first list: the anime is an ADAPTATION edge of a ranked manga */
  viaManga: number | null;
};

/** the queue, pure: latest snapshot per list → unowned, un-haloed, series-shaped media, collapsed to chain heads, scored */
export function seedCandidates(rows: RankingRow[], owned: Set<number>, halo: Set<number>): Seed[] {
  const latest = new Map<string, string>();
  for (const r of rows) if (!latest.has(r.list) || r.snapshot > latest.get(r.list)!) latest.set(r.list, r.snapshot);
  const by = new Map<number, Seed>();
  const consider = (m: MediaLike, list: string, rank: number, viaManga: number | null) => {
    if (owned.has(m.id) || halo.has(m.id)) return;
    if (m.format != null && !SERIES_FORMATS.has(m.format)) return;
    if (m.source === 'ORIGINAL') return; // no instrument (T25) — the trending list carries originals; not the product
    const edges = m.relations?.edges ?? [];
    if (edges.some((e) => STORY.has(e.relationType) && e.node.type === 'ANIME' && owned.has(e.node.id))) return; // a relation reaches the catalog → the halo's row, not a seed
    const preq = edges.find((e) => e.relationType === 'PREQUEL' && e.node.type === 'ANIME' && (e.node.format == null || SERIES_FORMATS.has(e.node.format ?? '')));
    const headId = preq ? preq.node.id : null;
    const manga = m.type === 'MANGA' ? { id: m.id, status: m.status ?? null, chapters: m.chapters ?? null, country: null } : (() => { const n = pickMangaNode(edges as never) as Node | null; return n ? { id: n.id, status: n.status ?? null, chapters: n.chapters ?? null, country: n.countryOfOrigin ?? null } : null; })();
    const { score, factors } = productFitScore(m);
    let s = by.get(m.id);
    if (!s) { s = { anilistId: m.id, title: m.title.english ?? m.title.romaji ?? String(m.id), format: m.format ?? null, status: m.status ?? null, source: m.source ?? null, year: m.startDate?.year ?? null, popularity: m.popularity ?? 0, score, factors, lists: [], manga, headId, viaManga }; by.set(m.id, s); }
    s.lists.push({ list, rank });
  };
  for (const r of rows) {
    if (r.snapshot !== latest.get(r.list)) continue;
    const m = r.raw as MediaLike;
    if (m.type === 'MANGA') {
      // the manga-first list: the ranked media is the MANGA; its unowned ADAPTATION anime are the candidates
      for (const e of m.relations?.edges ?? []) {
        if (e.relationType !== 'ADAPTATION' || e.node.type !== 'ANIME') continue;
        consider({ id: e.node.id, type: 'ANIME', format: e.node.format ?? null, status: e.node.status ?? null, source: 'MANGA', episodes: e.node.episodes ?? null, popularity: e.node.popularity ?? m.popularity ?? 0, startDate: e.node.startDate ?? null, title: e.node.title, relations: { edges: [{ relationType: 'ADAPTATION', node: { id: m.id, type: 'MANGA', format: 'MANGA', status: m.status ?? null, chapters: m.chapters ?? null, popularity: m.popularity ?? null, title: m.title } }] } }, r.list, r.rank, m.id);
      }
      continue;
    }
    consider(m, r.list, r.rank, null);
  }
  return [...by.values()].sort((a, b) => b.score - a.score);
}

/** one line per seed — the census / recap convention */
export function seedLine(s: Seed): string {
  const lists = s.lists.map((l) => `${l.list} #${l.rank}`).join(', ');
  const manga = s.manga ? `manga ${s.manga.id} (${s.manga.status ?? '?'}${s.manga.chapters ? `, ${s.manga.chapters} ch` : ''}${s.manga.country ? `, ${s.manga.country}` : ''})` : 'no manga edge';
  const head = s.headId ? ` · a later season — its unowned prequel ${s.headId} is the head (walk at the sitting)` : '';
  return `seed: anilist ${s.anilistId} ${s.title} [${s.format ?? '?'} ${s.status ?? '?'} ${s.year ?? ''}] · ${lists} · score ${s.score}${s.factors.length ? ` (${s.factors.join('; ')})` : ''} · source ${s.source ?? '?'} · ${manga}${s.viaManga ? ` · via manga-first ${s.viaManga}` : ''}${head} → proposed: new IP, series`;
}

/** the snapshot writer (the weekly bundle and discovery-stage --rankings share it) — staging only */
export async function snapshotRankings(opts: { timeBudgetMs?: number; sleepMs?: number } = {}): Promise<{ lists: number; rows: number; requests: number; deferred: string[] }> {
  const { db } = await import('./db');
  const { pageMedia } = await import('./anilist');
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const t0 = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const out = { lists: 0, rows: 0, requests: 0, deferred: [] as string[] };
  for (const l of LISTS) {
    if (opts.timeBudgetMs && Date.now() - t0 > opts.timeBudgetMs) { out.deferred.push(l.name); continue; }
    const rows: RankingRow[] = [];
    for (let page = 1; page <= l.pages; page++) {
      const media = (await pageMedia(l.args, page, 50, l.kind)) as MediaLike[];
      out.requests++;
      media.forEach((m, i) => rows.push({ list: l.name, snapshot: today, rank: (page - 1) * 50 + i + 1, anilist_id: m.id, raw: m }));
      if (media.length < 50) break;
      await sleep(opts.sleepMs ?? 2100); // the 30 / min budget (G47)
    }
    for (let i = 0; i < rows.length; i += 200) {
      const { error } = await db.from('ingest_anilist_rankings').upsert(rows.slice(i, i + 200), { onConflict: 'list,snapshot,anilist_id' });
      if (error) throw new Error(`rankings ${l.name}: ${error.message}`);
    }
    out.lists++; out.rows += rows.length;
  }
  return out;
}

/** the latest snapshot of every list, for the census and the recap */
export async function loadLatestRankings(): Promise<RankingRow[]> {
  const { selectAll } = await import('./db');
  const rows = await selectAll<RankingRow>('ingest_anilist_rankings', 'list, snapshot, rank, anilist_id, raw');
  const latest = new Map<string, string>();
  for (const r of rows) if (!latest.has(r.list) || r.snapshot > latest.get(r.list)!) latest.set(r.list, r.snapshot);
  return rows.filter((r) => r.snapshot === latest.get(r.list));
}
