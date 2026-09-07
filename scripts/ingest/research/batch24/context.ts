// Batch 24 context generator (copied from batch 23 under P34, 2026-09-07): wave 1 = lane T, THE TYPING WAVE —
// the wiki-minted aired rows that render default-canon (type_default_unclassified): re-zero 51-66 / 67-79, Ace act II
// 53-65, gits-2026 1-9 (Sean's go 2026-09-07 with Cursor). Verdicts per batch24/PROTOCOL.md (the batch-21 shape; the
// instrument is stated PER ASK — a novel owner in volume space, a manga continuation, a new telling with the I40 fork).
// Prints EVERY ruling on the series and ALL anchors (the outlaw-star lesson).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch24/context.ts <outdir>
import { writeFileSync } from 'node:fs';
import { CHAPTER_SPACE_OVERRIDES } from '../../lib/rulings/chapter-spaces';
import { db, selectAll } from '../../lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, COMMUNITY_COUNT_OVERRIDES, translateEpisodeNumber } from '../../lib/resolve';
import { sourceKindOf } from '../../lib/rulings/source-kinds';
import { ANCHOR_SUPPRESSED } from '../../lib/rulings/anchor-suppressed';
import { ALL_RULINGS } from '../../lib/rulings/index';

const OUT = process.argv[2] ?? '/tmp/batch24-ctx';

const TERMINAL = (pin: string, extra = '') => `HONEST TERMINAL (lane A1, G36/G56): ${pin} Deliver (1) the LAST canon/mixed row's anchor — END / START / chapters_adapted / volume, ≥ 2 sources (A4/A10; "pages, not numbers"); (2) its post-series continue (C5 coverage + 1, or C1 in the straddled chapter) with the never-adapted range named for the reader; (3) whether MU's chapter is actually reached by that row (pin redundant, G56) or overstated / another edition (say what MU counted, G37); (4) repairs to stored anchors / types with old → new and evidence — a filler-typed row that in fact adapts source pages is a T28 type repair with 2 sources, never an anchor as stored (A1). ${extra}`;

const GAP = (fence: string, extra = '') => `GAP BLOCK (lane A2, anchor_gap_research): ${fence} Deliver an anchor for EVERY canon/mixed target row — END / START / chapters_adapted / volume, ≥ 2 sources (A4/A10; "pages, not numbers") — or an anchor_hostile entry with the A44 reason; filler-typed rows take nothing (A1) unless you propose the type repair with 2 sources (T28). The two bracketing stored anchors are the fence: a delivered END sits between them in running order, or you REPAIR the fence anchor with old → new and evidence. Continue points where rows skip source material (C2/C3 parity, the unseen range in the note) or end mid-chapter (C1 — any mid-chapter ending, not only at a filler boundary; Sean 2026-08-27). ${extra}`;

// [id, target episodes (OUR numbering), lane, ask]
const NARROW = (ask: string) => `NARROW FOLLOW-UP (lane C): ${ask} Deliver exactly this — anchors (≥ 2 sources, A4/A10) or anchor_hostile for the named rows, repairs with old → new, type corrections under T28, the named continue; rows outside the ask are not yours.`;
const DATES = (ask: string) => `NUMBERING / AIR DATES (lane B, N11 / G53 / G54): ${ask} Output the batch-19 B3 shape to out/airdates/<series>.json: repairs only (air_date / title, old → new, ≥ 2 sources), flags_for_sean for TRUE deviations (G54 acks) and numbering findings, structure.notes = the row → title → date identity table for the span. Never index-join (R20).`;

// [id, target episodes (OUR numbering), lane, ask, wave] — the wave tag is how validate.ts / scan.ts match a verdict file (`<id>-w<N>.json`; no suffix = the series' lowest wave)
const MUPIN = (ask: string) => `MU PIN VERIFICATION (lane L-D, mu_pin_unverified — G31/G32/G37/G56): ${ask} The series' ONLY anchor is an unverified MU frontier pin at the last aired episode. Verify the season END against TWO independent sources (the finale's chapter coverage: fandom episode/chapter pages, ja-WP, vol TOCs — "pages, not numbers", A4/A10): (1) CONFIRMED → deliver the same value as a manual-tier anchor with the citations (and START / chapters_adapted where the sources give pages); (2) WRONG → deliver the corrected anchor with old → new and what MU actually counted (a whole-manga count, another season's endpoint, a continue-pointer stored as an end, ANOTHER EDITION or a franchise-continuous space — name it, G37); (3) NO honest end exists (the finale is anime-original — A1) → anchor_hostile with the type evidence and the honest terminal on the last canon/mixed row. Add the C5 post-series continue (or C1 mid-chapter) with the never-adapted range named. Small task: ONE row plus its continue; rows below the finale are not yours.`;

const IDENTITY = (ask: string) => `IDENTITY (lane I, T21 direction — standings only, NO anchors): ${ask} Deliver type_corrections (≥ 2 sources, T28) + annotations (side_source / adopted{basis} / retconned / divergence) per row or arc, structure.notes = the arc table (arc → episodes → manga chapters → direction → rule id), flags for the forks; anchors: [] — a row that could take one later is a flag. Recap baseline on every row you name (stored type first).`;

const TYPED = (ask: string) => `TYPED BLOCK (lane T, type_default_unclassified — the census line reads, verbatim: "the row's type is the wiki mint's default (canon) and no source has typed it"; G59 path A rows for a season the AFL page does not list; the default is OUR label, not a claim about the episode): ${ask} Deliver, for EVERY target row: (1) its standing under T25-T28 on ≥ 2 independent sources — a type_corrections entry where the default is wrong, and where canon is CONFIRMED say so per row in structure.notes (a confirmed default is a result, never an empty verdict); (2) an anchor — END / START / chapters_adapted / volume, ≥ 2 sources, A4 / A10 / A47, "pages, not numbers" — or an anchor_hostile entry with its A44 basis; (3) annotations for every non-source segment (weight: significant | sliver); (4) a continue only where C1-C3 apply (the block's frontier is derived from the anchors, never delivered as a post-series continue on a season that continues); (5) repairs for a stored title or air_date the pages refute (old → new, ≥ 2 sources; a wiki-minted row can be title-less — old is the empty string); (6) structure.notes = the block's arc ↔ instrument map; flags_for_sean for what only Sean can rule. Rows outside the ask are not yours. THE FORK IS NOT A PREMISE. AniList is down: the context's facts are STAGED — never guess a date, a count or an id.`;

const REZERO_INSTRUMENT = "THE INSTRUMENT IS THE LIGHT NOVEL (T24: source_type light_novel, NO manga link, and NO stored anchor on ANY of this series' 79 rows — you are the first to anchor it): anchors are in LN VOLUME space — end_chapter / start_chapter carry the LN VOLUME number (MF文庫J 長月達平『Re:ゼロから始める異世界生活』, the tankōbon numbering), volume the same number, chapters_adapted the chapters INSIDE the volume as the printed table of contents numbers them (never the web-novel arc/chapter numbering — a different space; say which space every cited page uses: ja-WP's episode list carries 原作 volume ranges per episode, the fandom's episode pages list the light-novel volume and chapter). The per-arc manga comicalizations are DOWNSTREAM licensed works: never the instrument, never a citation for a position (T24: never a fake manga position). AFL's page lists 1-50 only (the chain's retiresWhen) — the target rows carry no AFL claim. The stored air_date and title come from Wikipedia's table (G59) — repair only with ≥ 2 sources.";

// wave 2's reading of the same clause: rows 51-79 are anchored in this space now (§12.155); rows 1-50 are the block
const REZERO_INSTRUMENT_W2 = REZERO_INSTRUMENT.replace("NO stored anchor on ANY of this series' 79 rows — you are the first to anchor it", "rows 51-79 ARE anchored in this space (batch 24 wave 1, §12.155 — the context prints them; the convention is proven) and rows 1-50 are not");

export const TARGETS: [string, string, 'A1' | 'A2' | 'C' | 'B' | 'I' | 'T', string, number][] = [
  // ---- batch 24 wave 1 (Sean's go 2026-09-07, with Cursor) — THE TYPING WAVE, lane T
  ['re-zero-starting-life-in-another-world', '51-66', 'T', TYPED(`SEASON 3 (rows 51-66, 2024-10-02 → 2025-03-26; the anime's Arc 5 — verify WHICH LN volumes on the pages, ≥ 2 lineages). ${REZERO_INSTRUMENT} Every S3 row is our default canon — confirm or correct row by row (T28: a recap or a clip-show is filler; a numbered-volume side story of the LN itself is canon + side_story, the 86-ep-10 shape). File: out/re-zero-starting-life-in-another-world-w1a.json.`), 1],
  ['re-zero-starting-life-in-another-world', '67-79', 'T', TYPED(`SEASON 4 SO FAR (rows 67-79, 2026-04-08 → 2026-08-19, AIRING — rows 80-85 are unaired and NOT stored rows: not yours; the anime's Arc 6 — verify WHICH LN volumes on the pages, ≥ 2 lineages). ${REZERO_INSTRUMENT} Row 67 has NO stored title (the season-4 page's newest row was title-less at mint) — repair it (field title, old "", new …, ≥ 2 sources). Every S4 row is our default canon — confirm or correct row by row (T28). File: out/re-zero-starting-life-in-another-world-w1b.json.`), 1],
  ['ace-of-the-diamond-act-ii', '53-65', 'T', TYPED(`SECOND SEASON PART 1 (rows 53-65, component 177634, 2026-04-05 → 2026-06-28; Second Season Part 2 (213658) is announced and undated — ep 65's continue is END + 1 only under C1 (a straddled chapter), otherwise none). THE INSTRUMENT is the act II MANGA (AniList 86569: 308 chapters / 34 volumes, finished) in its OWN chapter space — never Act I's, never a count with specials. The stored map ends at ep 52 → END 169 [START 166] v19 (batch 17, manual; a stored ep-52 graft names ch 189 as the finale's teaser scene). MangaUpdates' curated coverage line reads "Vol 19, Chap 169 (S1) / Vol 30, Chap 259 (S2P1)" — a CROSS-CHECK, never a premise: the seam at 169 → 170 and the part's endpoint are what the pages prove (ja-WP's episode list with its 原作 ranges; the fandom's episode pages; ≥ 2 lineages). No volume_boundaries are stored for 86569: cite the tankōbon contents for every row's volume. Types: every row is our default canon — confirm or correct row by row (T28). File: out/ace-of-the-diamond-act-ii-w1.json.`), 1],
  // ---- batch 24 wave 2 (Sean's go 2026-09-07) — THE RE-ZERO GAP BLOCK, lane A2 in LN volume space
  ['re-zero-starting-life-in-another-world', '1-25', 'A2', GAP(`SEASON 1 (rows 1-25, 2016-04-04 → 2016-09-19; ep 1 is a double-length premiere) — the anime's Arcs 1-3: verify WHICH LN volumes on the pages, ≥ 2 lineages (Arc 1 / Arc 2 / Arc 3 are commonly bracketed as volumes 1 / 2-3 / 4-9 — a claim, not a premise). ${REZERO_INSTRUMENT_W2} THE TYPES STAND (AFL-typed canon, T4 advisory): a type_corrections entry needs T28 evidence on ≥ 2 sources. FENCES: none below (the series' first row); the block's own seam with S2 at ep 25 / 26 (Arc 3's last volume closes this block — say which) must agree with the w2b verdict. Not rows: the 2020 Director's Cut re-cut, the Memory Snow / Frozen Bonds OVAs, the Break Time shorts (a companion table on the same dates). File: out/re-zero-starting-life-in-another-world-w2a.json.`), 2],
  ['re-zero-starting-life-in-another-world', '26-50', 'A2', GAP(`SEASON 2 (rows 26-50, 2020-07-08 → 2021-03-24, two cours; ep 26 is a double-length premiere) — the anime's Arc 4 (the Sanctuary): verify WHICH LN volumes on the pages, ≥ 2 lineages (Arc 4 is commonly bracketed as volumes 10-15 — a claim, not a premise; the arc's time loops make the un-cross-cutting and any rearranged rows the weight-bearing claims). ${REZERO_INSTRUMENT_W2} THE TYPES STAND (AFL-typed canon, T4 advisory): a type_corrections entry needs T28 evidence on ≥ 2 sources. FENCES: the stored ep 51 → 16 [16] above (Arc 5 opens on volume 16 whole — wave 1's verdict); the seam with S1 at ep 25 / 26 must agree with the w2a verdict. Not rows: the Director's Cut re-cut, the OVAs, the Break Room shorts. File: out/re-zero-starting-life-in-another-world-w2b.json.`), 2],
  ['ghost-in-the-shell-2026', '1-9', 'T', TYPED(`THE GHOST IN THE SHELL (2026, Science SARU; component 177699; 10 episodes, 9 aired — ep 10 airs 2026-09-08 and is NOT a stored row: not yours). THE INSTRUMENT is the ORIGINAL MANGA (AniList 31023, 士郎正宗『攻殻機動隊』 1989-91: ONE volume, 11 numbered chapters — the stored space). The stored titles are the manga's chapter titles verbatim ("Prologue + Super Spartan i", "Junk Jungle ii + Megatech Machine i + ii" …): EVIDENCE the pages must confirm, never a premise. THE FORK — ruled as the question (Sean 2026-09-07, NOT "default canon"): (a) an ADAPTATION with ordinary anchors in the 11-chapter space, page splits in chapters_adapted (a half-chapter row's END is the chapter it reaches — A10's sliver rule and A47's tail rule decide); or (b) a PARALLEL telling (I40: two realizations of ONE unpublished outline, neither adapting the other — proven ONLY if the pages show it; then NO anchors: anchor_hostile per row citing I40, correspondence rows {episode, chapters, alignment: aligned | divergent | anime_only, note, sources} and structure.source_relation "parallel" with the evidence); or (c) the OUTLAW STAR class (T21 / original: the author's spine but no episode ↔ chapter source) — deliver whichever the pages prove. Standing per row under T25-T28: anime-original material beyond the manga's pages is mixed / filler with annotations. The 1.5 / 2 manga volumes are OTHER works (side_source at most); the 1995 film, Stand Alone Complex (52 rows on the same manga link, default canon, unanchored) and Arise are SEPARATE series (I16) and NOT yours — scope leakage is a defect; a franchise fact that bears on them goes in flags_for_sean only. No AFL page exists for this series. File: out/ghost-in-the-shell-2026-w1.json.`), 1],
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
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 24 (${lane === 'T' ? 'lane T — a typed block: every target row typed and anchored' : lane === 'A1' ? 'the honest terminal' : lane === 'A2' ? 'the gap blocks' : lane === 'C' ? 'narrow follow-ups' : lane === 'I' ? 'identity — standings and direction, no anchors' : 'numbering & dates'}), lane ${lane}`);
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
