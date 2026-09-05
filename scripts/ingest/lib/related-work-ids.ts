// I46 (amended 2026-09-05 — Sean's identity concern: "our own id for our data, every source id maps into it, no
// mix-ups on the UI") — THE RELATED-WORK IDENTITY REGISTRY. The same rule as the series registry (I44,
// series_external_ids): an external id maps INTO our identity — (series_id, anilist_id) — exactly once; a
// different work already holding the id is a COLLISION, refused and listed by the census, never overwritten.
// Why a registry beside the row: watch_order_entries is keyed by (series_id, position); a wiki row is re-created
// by its own writer whenever its fractional record changes, and an AniList id written onto the row would go with
// it. The registry is where the join lives (I46's adoption registers the row's wiki key → the AniList id), so the
// wiki writer can put the identity back on creation. Titles are attributes, never keys (P2 / I44).
//   sources: 'anilist' (the identity), 'mal' (AniList's idMal, staged), 'wiki' (series@position — the writer's
//   own identity for a fractional row), later sources by name.

export type RelatedWorkIdentity = { anilist_id: number };
export type RegisteredBy = 'halo' | 'adoption' | 'ruling';

/** the wiki writer's identity for a fractional row: the series and the wiki-numbered position */
export const wikiKey = (seriesId: string, position: number | string): string => `${seriesId}@${Number(position)}`;

const regKey = (source: string, externalId: string | number) => `${source}:${externalId}`;

/** the whole registry in memory, keyed `${source}:${external_id}` — the one read every writer and the census share (P32) */
export async function loadRelatedWorkRegistry(): Promise<Map<string, RelatedWorkIdentity & { registered_by: string }>> {
  const { selectAll } = await import('./db'); // lazy: the predicates below are pure and unit-tested without a DB
  const rows = await selectAll<{ anilist_id: number; source: string; external_id: string; registered_by: string }>('related_work_external_ids', 'anilist_id, source, external_id, registered_by');
  return new Map(rows.map((r) => [regKey(r.source, r.external_id), { anilist_id: r.anilist_id, registered_by: r.registered_by }]));
}

export const lookupRelatedWork = (registry: Map<string, RelatedWorkIdentity>, source: string, externalId: string | number): RelatedWorkIdentity | null => registry.get(regKey(source, externalId)) ?? null;

/**
 * Register a work's external ids. Mirrors registerIds (lib/resolve.ts): an id already held by ANOTHER work is a collision —
 * returned (and listed by the census), never overwritten; an id the same work already holds for the source is refreshed.
 */
export async function registerRelatedWorkIds(identity: RelatedWorkIdentity, ids: Record<string, string | number | null | undefined>, by: RegisteredBy): Promise<{ registered: number; collisions: string[] }> {
  const { db } = await import('./db');
  let registered = 0; const collisions: string[] = [];
  for (const [source, val] of Object.entries(ids)) {
    if (val == null || val === '') continue;
    const external_id = String(val);
    const { error } = await db.from('related_work_external_ids').insert({ anilist_id: identity.anilist_id, source, external_id, registered_by: by });
    if (!error) { registered++; continue; }
    if (error.code !== '23505') throw new Error(`registerRelatedWorkIds(${identity.anilist_id}/${source}): ${error.message}`);
    const { data: existing } = await db.from('related_work_external_ids').select('anilist_id').eq('source', source).eq('external_id', external_id).maybeSingle();
    if (existing && existing.anilist_id !== identity.anilist_id) { collisions.push(`${source}:${external_id} already maps to work ${existing.anilist_id} — refused for ${identity.anilist_id} (I46: never overwritten)`); continue; }
    if (!existing) { // (anilist, source) unique hit: this work's id for the source changed — refresh it
      const { error: e2 } = await db.from('related_work_external_ids').update({ external_id, registered_by: by }).eq('anilist_id', identity.anilist_id).eq('source', source);
      if (e2) throw new Error(`registerRelatedWorkIds refresh: ${e2.message}`);
      registered++;
    }
  }
  return { registered, collisions };
}

/** a stored watch-order row as the census / the writers read it */
export type LedgerRowIdentity = { series_id: string; position: number; anilist_id: number | null; origin: string | null; title: string };

/**
 * the OUTCOME checks (P5), pure: what the registry should hold given the stored rows and the staged MAL ids, and where it disagrees.
 *   gap      — a halo row whose anilist / mal id is unregistered; a wiki / ruled row carrying an anilist_id whose wiki key is unregistered
 *   conflict — a wiki key registered to one work while the stored row at that key carries another id; a mal / anilist id registered to a
 *              work whose stored row disagrees
 *   orphan   — a registry entry whose work has no stored row (the row went, the identity stays — a listing, never a delete: P24)
 */
export function identityProblems(rows: LedgerRowIdentity[], registry: Map<string, RelatedWorkIdentity>, malOf: Map<number, number | null>): { gap: string[]; conflict: string[]; orphan: string[] } {
  const gap: string[] = [], conflict: string[] = [], orphan: string[] = []; const conflictKeys = new Set<string>();
  const stored = new Set(rows.filter((r) => r.anilist_id != null).map((r) => r.anilist_id as number));
  for (const r of rows) {
    if (r.anilist_id == null) continue;
    const check = (source: string, id: string | number, what: string) => {
      const hit = lookupRelatedWork(registry, source, id);
      if (!hit) gap.push(`${r.series_id} @${r.position}${r.origin !== 'halo' ? ` (${r.origin ?? 'wiki'})` : ''}: ${what} unregistered — run sync-related-works`);
      else if (hit.anilist_id !== r.anilist_id) { conflict.push(`${r.series_id} @${r.position}: ${what} is registered to work ${hit.anilist_id}, the row carries ${r.anilist_id} — a mix-up, refused (I46), Sean rules`); conflictKeys.add(regKey(source, id)); }
    };
    check('anilist', r.anilist_id, `anilist ${r.anilist_id}`);
    const mal = malOf.get(r.anilist_id); if (mal != null) check('mal', mal, `mal ${mal}`);
    if (r.origin !== 'halo') check('wiki', wikiKey(r.series_id, r.position), 'its wiki key');
  }
  for (const [k, v] of registry) if (!stored.has(v.anilist_id) && !conflictKeys.has(k)) orphan.push(`${k} → work ${v.anilist_id}: no stored row carries this identity (the row went, the identity stays — P24 listing)`);
  return { gap, conflict, orphan };
}
