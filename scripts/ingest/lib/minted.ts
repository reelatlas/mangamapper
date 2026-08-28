// Row provenance (rule G57, Sean 2026-08-28): every episodes row names the
// writer that minted it, and a writer may DELETE only rows it minted — and
// only those its own payload no longer carries. There is no delete-then-
// insert any more: a writer UPSERTS its rows by (series_id, number), which
// re-stamps `minted_by` in place when it takes over a number another writer
// minted (the source that carries a number owns it), and then removes ONLY
// its own stale rows. A row nobody carries survives. Pure predicates here;
// `syncMintedRows` is the one shared write path (P2) every episode writer
// and edge runner uses.
export const MINTERS = ['afl', 'afg', 'wiki', 'stitch', 'anilist', 'manual'] as const;
export type MintedBy = (typeof MINTERS)[number];

/** may `writer` delete a row minted by `mintedBy`? only its own; an unstamped row (null) is nobody's — never deleted by a writer, listed by the census */
export const writerOwns = (mintedBy: string | null | undefined, writer: MintedBy): boolean => mintedBy === writer;

/**
 * The rows `writer` may delete: those it minted, inside [1, ceiling], whose
 * number its payload no longer carries. `ceiling` is the writer's translated
 * max (the range it refills); rows above it are never its business (an AFG
 * tail, a wiki fill on a ruled extension).
 */
export const staleOwnRows = <T extends { number: number; minted_by: string | null }>(existing: T[], payloadNumbers: Iterable<number>, writer: MintedBy, ceiling: number): T[] => {
  const carried = new Set(payloadNumbers);
  return existing.filter((r) => r.number <= ceiling && writerOwns(r.minted_by, writer) && !carried.has(r.number));
};

export type EpisodeRowIn = { series_id: string; number: number; title?: string | null; type?: string; air_date?: string | null; format?: string | null };

/**
 * The shared write path: upsert `rows` stamped `minted_by = writer` (taking
 * over any number another writer minted — in place, never a delete), then
 * delete the writer's OWN rows ≤ ceiling that the payload no longer carries.
 * Returns what it did. `ceiling` defaults to the payload's max.
 */
export async function syncMintedRows(seriesId: string, rows: EpisodeRowIn[], writer: MintedBy, ceiling?: number): Promise<{ upserted: number; deleted: number }> {
  const { db, selectAll } = await import('./db'); // lazy: the predicates above stay pure
  const stamped = rows.map((r) => ({ ...r, series_id: seriesId, minted_by: writer }));
  for (let i = 0; i < stamped.length; i += 500) {
    const { error } = await db.from('episodes').upsert(stamped.slice(i, i + 500), { onConflict: 'series_id,number' });
    if (error) throw new Error(`episodes upsert (${seriesId}, ${writer}): ${error.message}`);
  }
  const top = ceiling ?? rows.reduce((m, r) => Math.max(m, r.number), 0);
  const existing = await selectAll<{ number: number; minted_by: string | null }>('episodes', 'number, minted_by', (q) => q.eq('series_id', seriesId).lte('number', top));
  const stale = staleOwnRows(existing, rows.map((r) => r.number), writer, top);
  if (stale.length) {
    const { error } = await db.from('episodes').delete().eq('series_id', seriesId).eq('minted_by', writer).in('number', stale.map((r) => r.number));
    if (error) throw new Error(`episodes stale delete (${seriesId}, ${writer}): ${error.message}`);
  }
  return { upserted: stamped.length, deleted: stale.length };
}
