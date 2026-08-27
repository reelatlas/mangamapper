// Row presence (rule A42's outcome check, added 2026-08-26 — the third
// post-wave-1 /add-rule). An exact anchor proves its episode exists and the
// display synthesizes a canon, title-pending row for it (A42); an annotation
// on a row-less episode rides on that synthesized row. What was INVISIBLE
// until this class: which anchors and annotations are standing on rows the
// sources have not produced — research ahead of AFL lag (bokuben 18-26), a
// staging fault (cells-at-work's AFL page staged 0 rows: 12-13 / 20-21), a
// row-less series carrying only an MU pin (shy, orient, code-black), a
// record past aired_episodes (a numbering fault). Pure; the census lists,
// never deletes (A6 — the rows may still arrive).

export type PresenceRow = { series_id: string; number: number };
export type PresenceRecord = { series_id: string; episode: number };
export type Orphan<T extends PresenceRecord> = { record: T; beyondAired: boolean };

/** records whose episode row does not exist; `beyondAired` when the episode also exceeds the series' aired count (a numbering fault, not lag) */
export const orphanRecords = <T extends PresenceRecord>(rows: PresenceRow[], records: T[], airedBy: Map<string, number | null | undefined>): Orphan<T>[] => {
  const have = new Set(rows.map((r) => `${r.series_id}#${r.number}`));
  const out: Orphan<T>[] = [];
  for (const rec of records) {
    if (!Number.isInteger(rec.episode)) continue;
    if (have.has(`${rec.series_id}#${rec.episode}`)) continue;
    const aired = airedBy.get(rec.series_id);
    out.push({ record: rec, beyondAired: aired != null && rec.episode > aired });
  }
  return out;
};
