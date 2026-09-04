// Batch 22 context generator (copied from batch 21 under P34) (PLAN.md, Sean's go 2026-08-27): wave 1 = lane
// A1, the seven G36 refusals (the honest terminal, applied §12.78); wave 2 =
// lane A2, the eight small gap blocks (anchor_gap_research). Verdicts per batch20/PROTOCOL.md (batch 19's anchoring
// shape + the pages line + C7). Prints EVERY ruling on the series and ALL
// anchors (the outlaw-star lesson).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch22/context.ts <outdir>
import { writeFileSync } from 'node:fs';
import { CHAPTER_SPACE_OVERRIDES } from '../../lib/rulings/chapter-spaces';
import { db, selectAll } from '../../lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, COMMUNITY_COUNT_OVERRIDES, translateEpisodeNumber } from '../../lib/resolve';
import { sourceKindOf } from '../../lib/rulings/source-kinds';
import { ANCHOR_SUPPRESSED } from '../../lib/rulings/anchor-suppressed';
import { ALL_RULINGS } from '../../lib/rulings/index';

const OUT = process.argv[2] ?? '/tmp/batch20-ctx';

const TERMINAL = (pin: string, extra = '') => `HONEST TERMINAL (lane A1, G36/G56): ${pin} Deliver (1) the LAST canon/mixed row's anchor — END / START / chapters_adapted / volume, ≥ 2 sources (A4/A10; "pages, not numbers"); (2) its post-series continue (C5 coverage + 1, or C1 in the straddled chapter) with the never-adapted range named for the reader; (3) whether MU's chapter is actually reached by that row (pin redundant, G56) or overstated / another edition (say what MU counted, G37); (4) repairs to stored anchors / types with old → new and evidence — a filler-typed row that in fact adapts source pages is a T28 type repair with 2 sources, never an anchor as stored (A1). ${extra}`;

const GAP = (fence: string, extra = '') => `GAP BLOCK (lane A2, anchor_gap_research): ${fence} Deliver an anchor for EVERY canon/mixed target row — END / START / chapters_adapted / volume, ≥ 2 sources (A4/A10; "pages, not numbers") — or an anchor_hostile entry with the A44 reason; filler-typed rows take nothing (A1) unless you propose the type repair with 2 sources (T28). The two bracketing stored anchors are the fence: a delivered END sits between them in running order, or you REPAIR the fence anchor with old → new and evidence. Continue points where rows skip source material (C2/C3 parity, the unseen range in the note) or end mid-chapter (C1 — any mid-chapter ending, not only at a filler boundary; Sean 2026-08-27). ${extra}`;

// [id, target episodes (OUR numbering), lane, ask]
const NARROW = (ask: string) => `NARROW FOLLOW-UP (lane C): ${ask} Deliver exactly this — anchors (≥ 2 sources, A4/A10) or anchor_hostile for the named rows, repairs with old → new, type corrections under T28, the named continue; rows outside the ask are not yours.`;
const DATES = (ask: string) => `NUMBERING / AIR DATES (lane B, N11 / G53 / G54): ${ask} Output the batch-19 B3 shape to out/airdates/<series>.json: repairs only (air_date / title, old → new, ≥ 2 sources), flags_for_sean for TRUE deviations (G54 acks) and numbering findings, structure.notes = the row → title → date identity table for the span. Never index-join (R20).`;

// [id, target episodes (OUR numbering), lane, ask, wave] — the wave tag is how validate.ts / scan.ts match a verdict file (`<id>-w<N>.json`; no suffix = the series' lowest wave)
const MUPIN = (ask: string) => `MU PIN VERIFICATION (lane L-D, mu_pin_unverified — G31/G32/G37/G56): ${ask} The series' ONLY anchor is an unverified MU frontier pin at the last aired episode. Verify the season END against TWO independent sources (the finale's chapter coverage: fandom episode/chapter pages, ja-WP, vol TOCs — "pages, not numbers", A4/A10): (1) CONFIRMED → deliver the same value as a manual-tier anchor with the citations (and START / chapters_adapted where the sources give pages); (2) WRONG → deliver the corrected anchor with old → new and what MU actually counted (a whole-manga count, another season's endpoint, a continue-pointer stored as an end, ANOTHER EDITION or a franchise-continuous space — name it, G37); (3) NO honest end exists (the finale is anime-original — A1) → anchor_hostile with the type evidence and the honest terminal on the last canon/mixed row. Add the C5 post-series continue (or C1 mid-chapter) with the never-adapted range named. Small task: ONE row plus its continue; rows below the finale are not yours.`;

const IDENTITY = (ask: string) => `IDENTITY (lane I, T21 direction — standings only, NO anchors): ${ask} Deliver type_corrections (≥ 2 sources, T28) + annotations (side_source / adopted{basis} / retconned / divergence) per row or arc, structure.notes = the arc table (arc → episodes → manga chapters → direction → rule id), flags for the forks; anchors: [] — a row that could take one later is a flag. Recap baseline on every row you name (stored type first).`;

export const TARGETS: [string, string, 'A1' | 'A2' | 'C' | 'B' | 'I', string, number][] = [
  // ---- batch 22 wave 1 (2026-09-04; Sean's go) — the Boruto follow-up left by batch 21 wave 3
  ['boruto-naruto-next-generations', '19-23,39', 'I', IDENTITY("THE BORUTO CHAIN (I41, Sean ruled 2026-09-04): Naruto (AniList 30011, ch 1-700) → Naruto Gaiden (86171, its own tankōbon printed 700+1…700+10) → Boruto (87178, the entry's instrument, ch 1-80). Eps 19-23 are stored CANON adapting the Naruto Gaiden (the Seventh Hokage and the Scarlet Spring) and ep 39 adapts the Gaiden's second one-shot 満ちた月が照らす道 (printed at the back of Boruto vol 1; Narutopedia numbers it 'ch 0' in the Boruto space; AFG prints the work's TITLE in its chapters column) — none carries a chain_source annotation. Deliver for EACH row: the chain_source annotation in the I41 convention (chapters STARTS with the work label as written in the chain: 'Naruto Gaiden: ch 700+3' — never a bare Naruto-space number on a Boruto row), per-segment weights (T28; a Gaiden chapter adapted in full is significant, canon stands), divergence where the anime adds, and the row's type confirmed or corrected (2 sources: Narutopedia's episode pages + the Gaiden chapter pages, ja-WP's 各話リスト, TV Tokyo's synopses). Anchors: [] — these rows are position-less by the chain (another chapter space, A44); flag any row that adapts a BORUTO-space chapter as well. Ep 39's 'ch 0' status is a fork: state which work and which label you used and why. Join rows on title + air date (R20), never index."), 1],
  ['boruto-naruto-next-generations', '18,93-95', 'C', NARROW("AFL'S LOOSE MIXED BUCKET (batch 21 wave 3 finding): AFL types 1, 18, 24, 59, 93-95, 127, 157, 192, 210-211 'Mixed Canon/Filler'; wave 3 proved the bucket fires on a two-minute cold open (1), a closing status report (157) and an episode with no source at all (127). Eps 18 and 93-95 are the UNTESTED members (59 / 192 / 210-211 already carry anchors). Settle each by CHAPTER ACCOUNTING (T28, per-segment weights; a recap or a sliver is weightless, the remainder decides) on two sources beyond AFL / AFG — Narutopedia's episode pages (the Boruto manga chapter field and its absence framed by neighbours), the chapter pages, ja-WP's 各話リスト (no bold legend on the BORUTO page — read the prose), TV Tokyo's synopses. Deliver type_corrections or confirmations as the stored type, anchors where a mixed row adapts numbered BORUTO chapters and none is stored (A4 / A10 / A47), anchor_hostile with the A44 basis otherwise (no chapter number / another space / re-shown pages — never 'behind'), annotations per segment, and say which source lied. Eps 93-95 sit in the Mitsuki's Disappearance arc (anime-original) — check whether any Boruto-manga page is really in them."), 1],
];

const ranges = (s: string): [number, number][] => s.split(',').map((p) => p.trim()).map((p) => { const [a, b] = p.split('-').map(Number); return [a, b ?? a]; });

async function main() {
  const index: string[] = [];
  for (const [id, range, lane, ask, wave] of TARGETS) {
    // a series with more than one TARGETS entry gets one context file per entry (`<id>-w<wave>-<range>.md`), else `<id>.md`
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
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 20 (${lane === 'A1' ? 'the honest terminal' : lane === 'A2' ? 'the gap blocks' : lane === 'C' ? 'narrow follow-ups' : lane === 'I' ? 'identity — standings and direction, no anchors' : 'numbering & dates'}), lane ${lane}`);
    lines.push(`Target episodes (OUR cumulative numbering): ${range}.`);
    lines.push(`ASK: ${ask}`);
    lines.push('');
    lines.push('## The source and its chapter space');
    lines.push(`source kind = ${s.source_type ?? 'UNRULED'} (${kind?.noun ?? '?'}; instrument unit = ${kind?.unit ?? '?'}); manga link AniList ${s.manga_anilist_id ?? 'NONE'} (status ${s.manga_status}); chapter space: total_chapters=${s.total_chapters} latest_known=${s.latest_known_chapters} total_volumes=${s.total_volumes}; mapping_mode=${s.mapping_mode}`);
    {
      const cs = CHAPTER_SPACE_OVERRIDES[s.id];
      if (cs) lines.push(`RULED CHAPTER SPACE (N35): ${cs.chapters} chapters${cs.volumes ? ` / ${cs.volumes} volumes` : ''} — the PRINTED numbering; every stored value below is in it.${cs.sourceShifts?.length ? ` sourceShifts (a source's N → ours): ${cs.sourceShifts.map((x) => `${x.source}: from ${x.from} delta ${x.delta}`).join('; ')} — DELIVER IN THE PRINTED SPACE and state each conversion.` : ''}`);
    }
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
    const dup = TARGETS.filter((t) => t[0] === id).length > 1;
    writeFileSync(`${OUT}/${id}${dup ? `-w${wave}-${range.replace(/[^0-9a-z]+/gi, '_')}` : ''}.md`, lines.join('\n'));
    index.push(`${lane}  ${id} ${range} — anchors ${anchors.length}, rows ${eps.length}, kind ${s.source_type}`);
  }
  console.log(index.join('\n'));
}
if (process.argv[1]?.endsWith('context.ts')) main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
