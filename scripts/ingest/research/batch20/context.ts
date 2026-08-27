// Batch 20 context generator — THE HONEST TERMINAL (PLAN.md, Sean's go
// 2026-08-27): lane A1 = the seven G36 refusals (MU's coverage pin lands on
// a filler row). Verdicts per batch20/PROTOCOL.md (batch 19's anchoring
// shape + the pages line + C7). Prints EVERY ruling on the series and ALL
// anchors (the outlaw-star lesson).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/context.ts <outdir>
import { writeFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, COMMUNITY_COUNT_OVERRIDES, translateEpisodeNumber } from '../../lib/resolve';
import { sourceKindOf } from '../../lib/rulings/source-kinds';
import { ANCHOR_SUPPRESSED } from '../../lib/rulings/anchor-suppressed';
import { ALL_RULINGS } from '../../lib/rulings/index';

const OUT = process.argv[2] ?? '/tmp/batch20-ctx';

const TERMINAL = (pin: string, extra = '') => `HONEST TERMINAL (lane A1, G36/G56): ${pin} Deliver (1) the LAST canon/mixed row's anchor — END / START / chapters_adapted / volume, ≥ 2 sources (A4/A10; "pages, not numbers"); (2) its post-series continue (C5 coverage + 1, or C1 in the straddled chapter) with the never-adapted range named for the reader; (3) whether MU's chapter is actually reached by that row (pin redundant, G56) or overstated / another edition (say what MU counted, G37); (4) repairs to stored anchors / types with old → new and evidence — a filler-typed row that in fact adapts source pages is a T28 type repair with 2 sources, never an anchor as stored (A1). ${extra}`;

// [id, target episodes (OUR numbering), lane, ask]
export const TARGETS: [string, string, 'A1', string][] = [
  ['zatch-bell', '136-140', 'A1', TERMINAL("MU's pin lands on ep 139 (filler) with coverage ch 212; the stored last anchor is ep 138 → 211.", 'Is 212 reached (ep 138 straddles into 212 → C1) or does MU count a recap / omake? The anime\'s original ending (139-150) is filler by ruling.')],
  ['hellsing', '10-13', 'A1', TERMINAL("MU's pin lands on ep 13 (filler) with coverage ch 12 (the 2001 TV series diverges into an original ending — the A-7 shape).", 'Which is the last row that adapts the manga at all (the Incognito arc is anime-original) and what does it reach?')],
  ['slam-dunk', '96-101', 'A1', TERMINAL("MU's pin lands on ep 101 (filler) with coverage ch 276; the anime ends before the Sannoh game.", 'Where does the last canon row actually end (ch ~276 is the Sannoh chapter?) — cite fandom + ja-WP; the 2022 film is a separate entry.')],
  ['kinnikuman', '116-121', 'A1', TERMINAL("MU's pin lands inside the filler block 120-137 (T6: the two anime-original arcs); the stored last canon anchors are eps 47/48 (119-123) with ep 47 partial{121}.", 'Batch 19 wave 2 (verified) found kinnikuman.fandom\'s Warsman-style citation chains, ja-WP segment titles and dアニメストア synopses; use them for the terminal at ep 119 (the Dream Tag arc end?) — and confirm the stored 48 → 123 [122] lattice if it bears on the terminal.')],
  ['toriko', '141-147', 'A1', TERMINAL("MU's pin is refused AND flag #695: MU's latest_chapter 2 vs AniList 396 — an EDITION question.", 'State the reading edition (the stored anchors\' space) and the terminal in it: ep 147 is the anime\'s end (the Cooking Festival / Ice Hell?) — cite fandom + ja-WP; note what MU numbers instead.')],
  ['gantz', '21-26', 'A1', TERMINAL("MU's pin lands on the anime's original-ending block (eps 22-26, filler by type) — the A-7 shape.", 'The last row that adapts the manga (the Buddha/Temple mission = ch ~237?) and its END; the second season\'s original ending is filler.')],
  ['gto-great-teacher-onizuka', '38-43', 'A1', TERMINAL("MU's pin is refused (ep 43 is filler? or the pin sits on a filler row in 42-43) AND flag #691: MU's latest_chapter 13 vs AniList 208 — an EDITION question.", 'Batch 18 ruled 42-43 filler + divergence; the terminal is the last canon/mixed row (41?) — cite fandom + ja-WP (Lesson numbers); state the reading edition (208 Lessons) vs what MU numbers.')],
];

const ranges = (s: string): [number, number][] => s.split(',').map((p) => p.trim()).map((p) => { const [a, b] = p.split('-').map(Number); return [a, b ?? a]; });

async function main() {
  const index: string[] = [];
  for (const [id, range, lane, ask] of TARGETS) {
    const { data: s } = await db.from('series').select('*').eq('id', id).maybeSingle();
    if (!s) { console.log('MISSING', id); continue; }
    const comps = await selectAll<any>('series_components', '*', (q) => q.eq('series_id', id).order('season_order'));
    const anchors = await selectAll<any>('chapter_anchors', 'episode, chapter, start_chapter, chapters_adapted, volume, source, continue_chapter, continue_kind, continue_note, note', (q) => q.eq('series_id', id).order('episode'));
    const ann = await selectAll<any>('episode_annotations', 'episode, kind, basis, chapters, note', (q) => q.eq('series_id', id).order('episode'));
    const eps = await selectAll<any>('episodes', 'number, title, type, air_date, format', (q) => q.eq('series_id', id).order('number'));
    const bounds = s.manga_anilist_id ? await selectAll<any>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', s.manga_anilist_id).order('volume')) : [];
    const flags = await selectAll<any>('ingest_flags', 'id, kind, detail', (q) => q.eq('series_key', id).eq('status', 'open'));
    const { data: afl } = s.afl_slug ? await db.from('ingest_afl_shows').select('raw').eq('slug', s.afl_slug).maybeSingle() : { data: null };
    const aflClaim = new Map<number, string>();
    for (const e of (afl?.raw?.episodes ?? []) as { number: number; type: string }[]) {
      const n = translateEpisodeNumber(id, e.number, 'afl');
      if (n != null) aflClaim.set(n, e.type === 'anime-only-canon' ? 'anime canon' : e.type);
    }
    const rs = ranges(range);
    const inRange = (n: number) => rs.some(([a, b]) => n >= a && n <= b);
    const near = (n: number) => rs.some(([a, b]) => n >= a - 4 && n <= b + 4);
    const kind = sourceKindOf(s.source_type);
    const lines: string[] = [];
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 20 (the honest terminal), lane ${lane}`);
    lines.push(`Target episodes (OUR cumulative numbering): ${range}.`);
    lines.push(`ASK: ${ask}`);
    lines.push('');
    lines.push('## The source and its chapter space');
    lines.push(`source kind = ${s.source_type ?? 'UNRULED'} (${kind?.noun ?? '?'}; instrument unit = ${kind?.unit ?? '?'}); manga link AniList ${s.manga_anilist_id ?? 'NONE'} (status ${s.manga_status}); chapter space: total_chapters=${s.total_chapters} latest_known=${s.latest_known_chapters} total_volumes=${s.total_volumes}; mapping_mode=${s.mapping_mode}`);
    lines.push('');
    lines.push('## Entry facts');
    lines.push(`status=${s.status} aired_episodes=${s.aired_episodes} total_episodes=${s.total_episodes}; AniList anime id=${s.anilist_id} (MAL ${s.mal_id})`);
    lines.push(`Components (season_order: anilist_id episodes [kind] label): ${comps.map((c) => `${c.season_order}: ${c.anilist_id} ${c.episode_start ?? 'null'}-${c.episode_end ?? 'null'} [${c.kind}] ${c.label ?? ''}`).join('; ')}`);
    const rul: string[] = [];
    if (EPISODE_TYPE_OVERRIDES[id]) rul.push(`EPISODE_TYPE_OVERRIDES (T6): ${JSON.stringify(EPISODE_TYPE_OVERRIDES[id])}`);
    if (SOURCE_NUMBERING_SHIFTS[id]) rul.push(`SOURCE_NUMBERING_SHIFTS (N11): ${JSON.stringify(SOURCE_NUMBERING_SHIFTS[id])}`);
    if (COMMUNITY_COUNT_OVERRIDES[id]) rul.push(`COMMUNITY_COUNT_OVERRIDES (N3): ${JSON.stringify(COMMUNITY_COUNT_OVERRIDES[id])}`);
    if (ANCHOR_SUPPRESSED[id]) rul.push(`ANCHOR_SUPPRESSED (A44, position-less by ruling): ${JSON.stringify(ANCHOR_SUPPRESSED[id])}`);
    for (const r of ALL_RULINGS.filter((r) => r.seriesId === id)) rul.push(`${r.ruleId} (${r.ruledBy} ${r.ruledOn}): ${JSON.stringify(r.value).slice(0, 160)} — ${r.reason.slice(0, 240)}`);
    lines.push(`Rulings in code (ALL — a verdict that contradicts one is a REPAIR with evidence, never a silent override):\n${rul.map((x) => `  - ${x}`).join('\n') || '  none'}`);
    lines.push('');
    lines.push(`## Existing anchors (ALL ${anchors.length}) — ep→END [START] {chapters_adapted} vol (source) | continue`);
    lines.push(anchors.map((a) => `ep${a.episode}→${a.chapter}${a.start_chapter != null ? ` [${a.start_chapter}]` : ''}${a.chapters_adapted ? ` {${a.chapters_adapted}}` : ''}${a.volume != null ? ` v${a.volume}` : ''} (${a.source})${a.continue_chapter != null ? ` | continue ${a.continue_chapter}${a.continue_kind ? `/${a.continue_kind}` : ''}${a.continue_note ? ` — ${String(a.continue_note).slice(0, 120)}` : ''}` : ''}${a.note && near(a.episode) ? ` — ${String(a.note).slice(0, 200)}` : ''}`).join('\n') || 'none');
    lines.push('');
    const grouped = new Map<string, number[]>();
    for (const a of ann) {
      const k = `${a.kind}${a.basis ? `{${a.basis}}` : ''}${a.chapters ? ` {${a.chapters}}` : ''}: ${(a.note ?? '').slice(0, 220)}`;
      if (!grouped.has(k)) grouped.set(k, []);
      grouped.get(k)!.push(a.episode);
    }
    lines.push(`## Existing annotations (${ann.length} rows, ${grouped.size} facts)`);
    lines.push([...grouped].map(([k, e2]) => `eps ${e2.length > 8 ? `${e2[0]}-${e2[e2.length - 1]} (${e2.length})` : e2.join(',')} ${k}`).join('\n') || 'none');
    lines.push('');
    lines.push(`## Volume boundaries (${bounds.length})`);
    lines.push(bounds.map((b) => `v${b.volume}: ${b.chapter_start}-${b.chapter_end ?? '?'}`).join(', ') || 'none');
    lines.push('');
    lines.push(`## TARGET rows — number [stored type | AFL's claim] title (air_date)   ← each needs an anchor, an anchor_hostile entry, or a stated A1 reason`);
    lines.push(eps.filter((e) => inRange(e.number)).map((e) => `${e.number} [${e.type} | AFL: ${aflClaim.get(e.number) ?? '—'}] ${e.title || '(no title)'}${e.air_date ? ` (${e.air_date})` : ''}`).join('\n') || 'no target rows');
    lines.push('');
    lines.push('## Rows near the range (orientation)');
    lines.push(eps.filter((e) => near(e.number) && !inRange(e.number)).map((e) => `${e.number} [${e.type} | AFL: ${aflClaim.get(e.number) ?? '—'}] ${e.title || '(no title)'}`).join('\n') || 'none');
    lines.push('');
    lines.push('## Open flags');
    lines.push(flags.map((f) => `#${f.id} [${f.kind}] ${JSON.stringify(f.detail).slice(0, 400)}`).join('\n') || 'none');
    writeFileSync(`${OUT}/${id}.md`, lines.join('\n'));
    index.push(`${lane}  ${id} ${range} — anchors ${anchors.length}, rows ${eps.length}, kind ${s.source_type}`);
  }
  console.log(index.join('\n'));
}
if (process.argv[1]?.endsWith('context.ts')) main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
