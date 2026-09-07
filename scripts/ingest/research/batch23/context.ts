// Batch 23 context generator (copied from batch 22 under P34, 2026-09-05) (PLAN.md, Sean's go 2026-08-27): wave 1 = lane
// A1, the seven G36 refusals (the honest terminal, applied §12.78); wave 2 =
// lane A2, the eight small gap blocks (anchor_gap_research). Verdicts per batch20/PROTOCOL.md (batch 19's anchoring
// shape + the pages line + C7). Prints EVERY ruling on the series and ALL
// anchors (the outlaw-star lesson).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch23/context.ts <outdir>
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
  // ---- batch 23 wave 1 (planned 2026-09-05 at the batch-22 close; NOT dispatched) — the queue wave 3 opened: round-grain maps and refuted pins, all research
  ['record-of-ragnarok', '12,18-41', 'C', NARROW("THE ROUND-GRAIN MAP (batch 22 wave 3 + its verifier, verify/w3-rok.md). THE STORED STATE ON 2026-09-07 — read the anchor table below, it is the premise and this sentence is not: batch 12 anchored this series one row per ROUND FINALE with the round's first chapter as START. Ep 12 → 19 [1] {1-19 + ch 20 partial} STILL STANDS and its START is a phantom back-reach (A13: ep 11 ends on ch 19; ep 12 does not open on ch 1) — deliver its exact START and page span as a repair old → new. Ep 17's START was repaired to 29 in wave 3; rows 13-17 are RULED (Sean 2026-09-05) and are not yours. The finale STARTs and spans on 22 / 27 / 33 / 38 were NULLED under A14 on 2026-09-07 (unknown, not a repair target — deliver each row's exact START and page span as its anchor); their ENDs 42 / 54 / 65 / 77 stand as batch 12's two-sourced finale ends unless the pages refute them — the wave-3 verifier read ep 22's END as likely 43 (37 of ch 43's 43 pages are ep 22's on the fandom's page-partitioned adapted= field and programming-cafe's 対応表) and ep 27's START as 52. EVERY OTHER TARGET ROW (18-21, 23-26, 28-32, 34-37, 39-41) now carries an AFG-TIER anchor (source 'afg' — a DERIVATION tier, P8: one site's per-episode chapter listing, mechanically re-derived on every sweep, e.g. 18 → 34 [34] {31, 34}, 19 → 36 [34] {32-36}, 23 → 45 [43], 26 → 51 [50], 28 → 55 [55] {54-55}, 32 → 63 [61], 37 → 76 [73], 41 → 83 [82]): ONE LINEAGE TO CHECK against the pages, never a premise and never a citation — where the pages confirm an afg value say so per row (a confirmed derivation is a result, never an empty verdict; it lands at the research tier), where they refute it deliver the page value. The healer-written parity continues on 21 → 31, 26 → 43, 32 → 55, 37 → 66 ('anime jumps back') encode the nulled phantom STARTs: deliver each row's real continue under C2 / C5 (a back-jump only where the pages show the next episode opening earlier). Deliver: an anchor for EVERY canon / mixed row 12-41 on the same instrument (the fandom's adapted= fields — run the page-closure check per straddled chapter, it fails at ch 36; programming-cafe's per-episode AND per-chapter tables the independent lineage; en-WP summaries for content), repairs old → new on the stored MANUAL values the pages refute (ep 12's START and span; an END on 22 / 27 / 33 / 38 where the pages say so), A47 on every tail, continues C2 parity. Identity first (R20): S1 (1-12, 2021), S2 part 1 (13-22, 2023-01-26), part 2 (23-27, 2023-07-12), S3 (28-42, 2025-12-10, one drop) joined on title + date. The RoK scope (the 155 / 156 seam) is a separate open item."), 1],
  ['eyeshield-21', '54-57', 'C', NARROW("EP 54's END 111 IS REFUTED (batch 22 wave 3's verifier, verify/w3-eyeshield.md — read it first): batch 17 pinned END 111 on the ARC BOUNDARY ('Fall Tournament Saga ends ch 111 at ep 54'), not pages; ch 111 'World of the Quarter-Finals' pp 6-19 (Kobanzame spying, stilt practice, Sena / Monta deliver cleats to Kyoshin, Kakei 'try and take me down', 'he's in Japan') is EPISODE 57 on three witnesses (TV Tokyo ep 57 「21」を知る者; the itsahanzo blog; the fandom's Episode 57 `chapters = 111th Down`). Deliver: ep 54 repair END 111 → 109 {109} (old → new, with the verifier's evidence re-cited from the pages); ep 57's OWN anchor (ch 111 + the Devil Bat Ghost half — read ch 115 'Like a Firework', unread so far) with `rearranged{111}` (a back-jump after ep 56's 114); eps 55 / 56's anchors confirmed or repaired on the pages; ep 54's continue re-derived under C5 (110 covered at ep 52; 111 unadapted until 57). Traps: title ≠ content; the fandom's 2026 episode pages + its ch → ep reverse index are ONE lineage (one editor, July 2026); its 2008-09 team / character pages are independent; TV Tokyo = b-ch (one licensor lineage); AFG stops mid-series; AFL has no page."), 1],
  ['sailor-moon', '73-77', 'C', NARROW("ACT 18'S ADAPTATION HOME (batch 22 wave 3's verifier, verify/w3-sailor-moon.md): the stored map adapts Act 18 (renewal numbering — EVERY stored sailor-moon record is the 60-act renewal space, NOT the original 52; say which space every number is in) NOWHERE: 73 → 17 [15] {15-17} + rearranged{15-17} (the ruled re-tread), 75 → 19; yet ja-WP ちびうさ dates the brooch theft — Act 18's opening beat — to R 27 = our ep 73 (「銀水晶入りの変身ブローチを盗んでしまい〈『R』27話〉」). Deliver: on the pages / the fandom's Act 17-18 pages' anime fields / ja-WP 各話リスト / Toei's guide, whether ep 73's END is 18 (a repair old → new; if so the A41 rearranged{15-17} MOVES with it — one ask, two records) and where the rest of Act 18 (Calaveras's broadcast, her death) lands in 74-77 — anchors or anchor_hostile per row. Also deliver the N35 shape for the space: total 60 acts (stored total_chapters 61 = AniList; the '+1 short-story unit' is unsourced) — a chapter-space statement with two sources, no number invented."), 1],
  ['beelzebub', '59', 'C', NARROW("EP 59's STORED NOTE IS STALE (batch 22 wave 3's verifier, verify/w3-beelzebub.md): the stored ep-59 anchor note says 'finale adapts ch 120 + first half of ch 121 (Kunieda vs Agiel…)', but Kunieda vs Agiel is ch 119 pp 9-19 (the Akumano arc page) and the fandom's reverse index gives chs 119-121 to ep 59 only; wave 3 landed ep 58 → 118 [116] with continue 119. Deliver ep 59's own START (119 on the pages?) and END (121 — MU's anime.end 'Vol 14, Chap 121' agrees), chapters_adapted, a note repair old → new, and the finale's continue under C5 (post_series: the manga continues; ch 122 is adapted by no episode, ch 123 is a forward graft in ep 58). Never touch 49 / 51 / 58 (ruled 2026-09-05)."), 1],
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
