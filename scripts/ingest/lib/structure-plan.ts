// Pure planner module (no DB import) so the planner is unit-testable and
// shared by every writer and the healer (P2).
import { RULED_STRUCTURE, type RuledExtra } from './rulings/structure';

// The component PLANNER (I39, batch 19 E4): the one place structure rows are
// laid out. Chain members take running spans from their aired counts;
// RULED_STRUCTURE extras (numbered OVAs / specials / movies with their own
// AniList id) are placed after their anchor member and shift what follows;
// span overrides replace a member's AniList count with our space. Pure —
// unit-tested; writeComponents and heal-structure both call it (P2).
export type PlannedComponent = {
  anilist_id: number;
  season_order: number;
  episode_start: number | null;
  episode_end: number | null;
  label: string | null;
  kind: string;
};
export type PlanMember = { id: number; aired: number; label: string | null; kind: string; /** true when the count is final (episodes known or airing-next known) */ closed: boolean };

export function planComponents(seriesId: string, members: PlanMember[], orderOnly?: { id: number; after: number }[]): PlannedComponent[] {
  const ruled = RULED_STRUCTURE[seriesId];
  const extras = ruled?.extras ?? [];
  const out: PlannedComponent[] = [];
  let cursor = 0;
  let order = 0;
  const placeExtra = (x: RuledExtra) => {
    if (x.startAt != null) cursor = x.startAt - 1;
    order += 1;
    out.push({ anilist_id: x.anilistId, season_order: order, episode_start: cursor + 1, episode_end: cursor + x.rows, label: x.label, kind: x.kind });
    cursor += x.rows;
  };
  // extras chained onto another extra (angel-beats 9062 after 10067)
  const placeAfter = (anchorId: number) => {
    for (const x of extras.filter((e) => e.after === anchorId)) { placeExtra(x); placeAfter(x.anilistId); }
  };
  for (const x of extras.filter((e) => e.after === null)) { placeExtra(x); placeAfter(x.anilistId); }
  for (const m of members) {
    const span = ruled?.spans?.[m.id];
    order += 1;
    let start = m.aired > 0 ? cursor + 1 : null;
    let end = m.aired > 0 && m.closed ? cursor + m.aired : null;
    if (span?.episodeStart != null) { start = span.episodeStart; if (end != null) end = span.episodeStart + m.aired - 1; }
    if (span?.episodeEnd != null) end = span.episodeEnd;
    out.push({ anilist_id: m.id, season_order: order, episode_start: start, episode_end: end, label: m.label, kind: m.kind });
    if (end != null) cursor = end; else if (start != null) cursor = start - 1 + m.aired;
    placeAfter(m.id);
    for (const extra of orderOnly?.filter((x) => x.after === m.id) ?? []) {
      order += 1;
      out.push({ anilist_id: extra.id, season_order: order, episode_start: null, episode_end: null, label: null, kind: 'season' });
    }
  }
  return out;
}

