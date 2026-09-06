// THE SEED WRITER (G52's rostered form; I42's mint rule; Sean's go 2026-09-05,
// discovery step 3 — PROPOSAL.md §4). One writer creates a series from a
// `series` ruling in lib/rulings/discovery.ts, and it is the same machine
// every chain writer uses: identity FIRST (I2 — the AniList id is registered
// before anything else) → the SEQUEL chain walked under the ownership guard
// (I21: never into another series' entry; an ambiguous walk is HELD, never
// guessed) → aggregate (T25 source kind, I38 manga pick, I40 relation, I36
// scope) → the series row with OUR slug (I1; the ruling may name it) →
// components through the one planner (I39) → the franchise membership the
// sitting ruled (I43). It writes NO anchors (A1 / A44), NO rows (G59's
// writers mint them from a page or a ruled grid), and the series lands
// STAGED (P39) until a classifier registers or a ruling publishes it.
// Relations are not written here: relations.ts derives them from the
// AniList edges on the next heal (a kind AniList cannot express is a
// lib/rulings/relations.ts entry).
//
// planSeed is the DRY RUN — the writer's reading of the ruling (the walked
// chain, the slug, the manga pick), which Sean has not seen at ruling time;
// seedSeries writes only a plan that held nothing back. Run from /discover
// after the dry-run recap, never from `npm run heal`.

import { isoDate } from './related-works';
import { db } from './db';
import type { AniListMedia } from './anilist';
import { aggregate, aired, getMedia, ownedAnilistIds, walkChain, writeComponents } from './chain';
import { filterEpisodeRows, registerIds, stageAniList } from './resolve';
import { slugify } from './slug';
import { DISCOVERY_RULINGS, type DiscoveryRuling } from './rulings/discovery';
import { FRANCHISE_OF } from './rulings/franchises';

export type SeedPlan = {
  anilistId: number;
  ruling: DiscoveryRuling;
  /** the series that already owns the id, when one does (nothing to create) */
  owner: string | null;
  /** why the plan cannot be written (ambiguous walk, unavailable media, slug clash) */
  held: string | null;
  slug: string;
  title: string;
  chain: { id: number; title: string; format: string | null; status: string; episodes: number | null; aired: number }[];
  media: AniListMedia[];
  status: string;
  totalEpisodes: number | null;
  airedEpisodes: number;
  sourceType: string | null;
  mangaId: number | null;
  franchise: string | null;
  franchiseRuled: boolean;
};

/** the writer's reading of a ruling — no writes */
export async function planSeed(anilistId: number, ruling: DiscoveryRuling, owned?: Map<number, string> | Set<number>): Promise<SeedPlan> {
  const ownedSet = owned instanceof Map ? new Set(owned.keys()) : owned ?? (await ownedAnilistIds());
  const ownerOf = owned instanceof Map ? owned : null;
  const base: SeedPlan = { anilistId, ruling, owner: null, held: null, slug: ruling.slug ?? '', title: '', chain: [], media: [], status: '', totalEpisodes: null, airedEpisodes: 0, sourceType: null, mangaId: null, franchise: ruling.franchise ?? null, franchiseRuled: false };
  if (ownedSet.has(anilistId)) {
    const { data } = ownerOf ? { data: null } : await db.from('series_external_ids').select('series_id').eq('source', 'anilist').eq('external_id', String(anilistId)).maybeSingle();
    return { ...base, owner: ownerOf?.get(anilistId) ?? data?.series_id ?? 'another series' };
  }
  let media: AniListMedia[];
  let ambiguity: string | null = null;
  if (ruling.chain?.length) {
    media = (await Promise.all(ruling.chain.map(getMedia))).filter((m): m is AniListMedia => !!m);
    if (media.length !== ruling.chain.length) ambiguity = 'a ruled chain id is unavailable on AniList';
  } else {
    ({ chain: media, ambiguity } = await walkChain(anilistId, Number.POSITIVE_INFINITY, ownedSet));
  }
  if (!media.length) return { ...base, held: ambiguity ?? `anilist ${anilistId} unavailable` };
  const head = media[0];
  const title = head.title.english ?? head.title.romaji ?? String(head.id);
  let slug = ruling.slug ?? slugify(title);
  // I1: our slug, collisions resolved with -<year> then -<anilistId>; a ruled slug that clashes is held
  const { data: clash } = await db.from('series').select('id').eq('id', slug).maybeSingle();
  if (clash) {
    if (ruling.slug) return { ...base, held: `ruled slug '${slug}' is already a series`, title, media };
    for (const c of [`${slug}-${head.startDate.year ?? ''}`.replace(/-$/, ''), `${slug}-${head.id}`]) {
      const { data: c2 } = await db.from('series').select('id').eq('id', c).maybeSingle();
      if (!c2) { slug = c; break; }
    }
  }
  const agg = aggregate(media, null, title, ruling.slug ?? null) as Record<string, unknown>;
  const plan: SeedPlan = {
    ...base,
    held: ambiguity,
    slug,
    title,
    media,
    chain: media.map((m) => ({ id: m.id, title: m.title.romaji ?? String(m.id), format: m.format, status: m.status, episodes: m.episodes, aired: aired(m) })),
    status: String(agg.status ?? ''),
    totalEpisodes: (agg.total_episodes as number | null) ?? null,
    airedEpisodes: (agg.aired_episodes as number) ?? 0,
    sourceType: (agg.source_type as string | null) ?? null,
    mangaId: (agg.manga_anilist_id as number | null) ?? null,
    franchise: FRANCHISE_OF[slug] ?? ruling.franchise ?? null,
    franchiseRuled: !!FRANCHISE_OF[slug],
  };
  if (!ruling.relation && !ruling.restoration) plan.held = `no relation declared — I13 (d): a mint writes its relation (series_relations) and its franchise membership or does not mint; add relation: { to, kind } to the declaration`;
  else if (plan.franchise && !plan.franchiseRuled) plan.held = `franchise '${plan.franchise}' named by the ruling but no membership entry for '${slug}' in lib/rulings/franchises.ts — rule the membership with the seed`;
  return plan;
}

/** one line per plan — the dry-run recap Sean reads before the mint */
export function seedLine(p: SeedPlan): string {
  if (p.owner) return `SKIP anilist ${p.anilistId}: already owned by ${p.owner}`;
  if (p.held) return `HELD anilist ${p.anilistId}${p.title ? ` "${p.title}"` : ''}: ${p.held}`;
  const rel = p.ruling.relation ? `${p.ruling.relation.kind} → ${p.ruling.relation.to} (relations.ts derives it from the AniList edge on the next heal)` : 'none ruled';
  return `CREATE series ${p.slug}${oneRow(p) ? ` [rows from AniList: ${p.media.length} film / special row(s)]` : ''} ← anilist ${p.anilistId} "${p.title}" · chain [${p.chain.map((c) => `${c.id} ${c.title} (${c.aired}${c.episodes == null ? '+' : ''} ${c.format ?? '?'} ${c.status})`).join(' → ')}] · ${p.airedEpisodes} eps · status ${p.status} · source ${p.sourceType ?? 'UNKNOWN (flag)'} · manga ${p.mangaId ?? 'none'} · franchise ${p.franchise ?? 'none'} · relation ${rel} · visibility STAGED (P39) · rows: none yet — the wiki writer (G59 A) mints them next`;
}

/** I13 (b): one entry, one episode — a film or a single special — gets its single row from AniList (the one-row path) */
export const oneRow = (p: { media: { episodes?: number | null; format?: string | null }[] }): boolean => p.media.length > 0 && p.media.every((m) => m.episodes === 1 || (m.episodes == null && m.format === 'MOVIE'));

/** the write — only a plan that held nothing back */
export async function seedSeries(p: SeedPlan): Promise<'created' | 'skipped'> {
  if (p.owner || p.held || !p.media.length) return 'skipped';
  for (const m of p.media) await stageAniList(m);
  const head = p.media[0];
  const row = { ...(aggregate(p.media, null, p.title, p.slug) as Record<string, unknown>), id: p.slug, visibility: 'staged', franchise_id: FRANCHISE_OF[p.slug] ?? null };
  const { error } = await db.from('series').upsert(row);
  if (error) throw new Error(`seed ${p.slug}: ${error.message}`);
  await registerIds(p.slug, { anilist: head.id, mal: head.idMal });
  await writeComponents(p.slug, p.media, null);
  // I13 (b) — THE ONE-ROW PATH (the named G59 path for films / single specials): a series whose every entry is a single-episode film or
  // special gets one row per entry from AniList's own media (title, air date) — lineage `anilist` (G57; never the wiki finder, which has no
  // list for a film); typed by the canon-tier default like a wiki row (type_default_unclassified lists it until research types it)
  if (oneRow(p)) { // every entry a single film / special → one row per entry, numbered in chain order (a two-film series: rows 1 and 2)
    const rows = p.media.map((m, k) => ({ series_id: p.slug, number: k + 1, title: m.title.english ?? m.title.romaji ?? p.title, type: 'canon', air_date: isoDate(m.startDate) }));
    const ruled = filterEpisodeRows(p.slug, rows, 'anilist', { sourceType: ((row as Record<string, unknown>).source_type as string | null) ?? null });
    if (ruled.length) { const { error: e2 } = await db.from('episodes').insert(ruled.map((r) => ({ ...r, minted_by: 'anilist' }))); if (e2) throw new Error(`seed ${p.slug} row 1: ${e2.message}`); }
  }
  return 'created';
}

/** every `series` ruling, planned against the current ownership set */
export async function planAllSeeds(): Promise<SeedPlan[]> {
  const owned = await ownedAnilistIds();
  const out: SeedPlan[] = [];
  for (const [id, ruling] of Object.entries(DISCOVERY_RULINGS)) {
    if (ruling.disposition !== 'series') continue;
    out.push(await planSeed(Number(id), ruling, owned));
  }
  return out;
}
