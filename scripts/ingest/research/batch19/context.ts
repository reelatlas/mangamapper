// Batch 19 context generator — ANCHORS AND CONTINUES (PLAN.md, Sean's go
// 2026-08-26): lane A3 frontier tails + lane B1 narrow follow-ups from
// batch 18. Verdicts per batch19/PROTOCOL.md (batch 17's anchoring shape).
// Prints EVERY ruling on the series (the outlaw-star lesson) and ALL anchors.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/context.ts <outdir>
import { writeFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, COMMUNITY_COUNT_OVERRIDES, translateEpisodeNumber } from '../../lib/resolve';
import { sourceKindOf } from '../../lib/rulings/source-kinds';
import { ANCHOR_SUPPRESSED } from '../../lib/rulings/anchor-suppressed';
import { ALL_RULINGS } from '../../lib/rulings/index';

const OUT = process.argv[2] ?? '/tmp/batch19-ctx';

// [id, target episodes (OUR numbering), lane, ask]
export const TARGETS: [string, string, 'A3' | 'B1' | 'B2' | 'B4' | 'B5', string][] = [
  ['claymore', '21-24', 'A3', "FRONTIER: batch 18 (verified R24) found eps 21/22/23 are close 1:1 adaptations of Scenes 57/58/59 (annotated divergence{57}/{58}/{59}, type mixed) and ep 24 opens on Scene 60's first section (filler + partial{60} by Sean's T28 ruling; 25-26 filler). The stored frontier is ep 20 → ch 56. Deliver: anchors 21→57, 22→58, 23→59 with START/chapters_adapted/volume and ≥2 sources each (claymorenew Scene pages, claymore.fandom episode pages, ja-WP); the post-series continue after ep 23 (60 — say whether ch 60's opening in ep 24 changes it; 13 printed chapters were never adapted, name the range); the ep-20 anchor's continue point (currently none) → parity 57. Ep 24 takes NO anchor (A1: filler)."],
  ['ajin-demi-human', '13-23', 'A3', "FRONTIER: batch 18 (verified R24) overturned batch 12 — eps 14-22 adapt manga ch 23-42 (ja-WP per-character 巻話↔第2期N話 tables; AllYourAnime per-episode comparisons; ajin fandom). Stored types now: 14/15/16 canon, 17 mixed, 18 filler, 19 mixed, 20-21 filler, 22 mixed, 23 filler; the last anchor is ep 13 → 21 [22] with continue 22 post_series. Deliver: anchors for every canon/mixed row 14-22 (14→23/24, 15→25, 16→26 + ch 28's opening?, 17→28, 19→27/27.5 (rearranged: 28 aired before 27 — A12/A13 apply, state the START honestly), 22→ the Forge Security arc 32-42 loosely — is 42 an honest END or is 22 anchor_hostile?); the ep-13 continue REPAIR (22 → 23, verifier-agreed); the post-series continue (verifier: honest continue 29 — ch 29, 30, 32-37 unadapted — vs 43; rule it with the evidence and the C-rules); ep 23's ch 43/44 echoes are annotations only (filler, A1)."],
  ['chrono-crusade', '15-16, 21', 'A3', "TAIL + RE-LOOK: ep 21 (mixed, graft{36-41}) is the one canon/mixed row past the last anchor (ep 20 → 30 [29], the adaptation bound; 22-24 filler = the Gonzo ending). Is ep 21 a position (an END inside 36-41 would leap the never-adapted 31-35 — A44 shape?) or anchor_hostile? Set the post-series continue on ep 20 (batch 17 proposed a full restart at Act 1 vs 31 — rule it under C-rules, naming the skipped Acts 7, 12-18, 31+). RE-LOOK 15-16 (mixed, no annotations, no anchors): the batch-18 verifier said the flag was understated — ja-WP places the Order/Pursuers material in the manga; do 15-16 adapt identifiable Acts (anchor or annotation), or are they anime-original with a mixed type that needs a T28 repair?"],
  ['trigun', '16, 18', 'A3', "TAIL (bundled with chrono-crusade — ONE JSON per series): two mixed rows past the last anchor (ep 15 → 20 [17], continue 20 post_series). Ep 16 'Fifth Moon' (divergence{20}, partial{16}): does it FINISH ch 20 (ep 15 stops partway, at Dominique's defeat) — then it is the honest END 20 anchor with C1 — or is it a fragment (anchor_hostile)? Ep 18 'Goodbye for Now' adapts Trigun Maximum ch 1-2 = ANOTHER chapter space (batch 17 flagged it anchor-forbidden): confirm as anchor_hostile with the citation. Nothing else in 17-26 (filler, A1)."],
  ['soul-eater', '36-40', 'B1', "CONTINUE 37 vs 40 (bundled with gto — ONE JSON per series): the stored post-series continue is ch 38 on ep 38 (→39 [38], partial 38-39); ep 36 (afg-continua) carries parity 38; batch 18 says the correct post-series reading position is ch 40 (ep 39 covers one scene of ch 40; ep 40 grafts ch 45 across the unadapted 41-44). Rule the honest resume under C-rules: 38 (finish the partially adapted chapters), 39, or 40 — with the page-level evidence of what ep 38 actually adapts of 38-39 and whether ch 40's Eruka/Crona opening in ep 39 is first-time coverage. Also ep 37 (filler, loose_parallel{38} + partial{38 slivers}): souleater.fandom says no corresponding chapters — confirm the stored type or propose the repair."],
  ['gto-great-teacher-onizuka', '25-26', 'B1', "SIDE_SOURCE QUESTION (bundled with soul-eater): eps 25-26 are filler + divergence + loose_parallel today; batch 18 flagged a defensible alternative — canon + side_source (Shonan Junai Gumi! ch 229/241: Nao's Queen-of-Hakosuka past, the Last Signal, her brother crippled in the race). Sean's ask: does SJG actually contain an Eikichi-vs-Kadena RACE (the episodes' spine), or only the character backstory the anime borrows? If SJG's chapters are ADAPTED (a race with these beats), the rows are canon + side_source{Shonan Junai Gumi} with the SJG chapters named; if only the setup is borrowed and the story is new, filler + loose_parallel stands. ≥2 sources incl. ja-WP / SJG chapter summaries. No anchors either way (another work's chapter space)."],
  ['a-certain-scientific-railgun', '14, 25, 49', 'B1', "TWO ROWS + A NOTE (bundled with dragon-ball-super — ONE JSON per series): (1) ep 14 'Special Workshop' is filler with no annotation; Sean ruled eps 15-24 canon + adopted{author, incorporation}. Ep 14 sits in the same anime-original cour but belongs to no arc — does the incorporation basis reach it (cite Kamachi's later use of anything from ep 14) or does it stay filler? (2) ep 25 (Railgun S #1) is filler + partial{~18 setup}; the toaru fandom says its library scene is lifted from ch 41 and the rest is original — the stored partial{~18} is WRONG: repair the annotation to the ch-41 tie (graft or partial per T28; filler stands unless the ch-41 scene is the episode's job), and say whether AFL's 'anime canon' on 20-25 changes anything under the adopted block. (3) ep 49's stored anchor {41 (Tokiwadai confrontation = redone ch 41 library scene), 43} — batch 18 asked for a graft note: confirm ep 49 re-does the ch-41 scene (annotation graft{41}) and that the END 43 stands."],
  ['dragon-ball-super', '18-27', 'B1', "STANDING + SIDE_SOURCE (bundled with railgun): eps 18-27 (Resurrection 'F' arc) are stored canon, but the DBS manga skipped that arc entirely (Kanzenshuu, ja-WP, fandom's empty manga-chapters field). The series' SOURCE is the Toyotarou/Toriyama DBS manga (batch 18). Deliver: the licensed work these rows adapt — the Resurrection 'F' FILM (Toriyama's own screenplay = author-written, but a film is not the manga), Toyotarou's 3-chapter 'Dragon Ball Z: Resurrection F' manga, or the Film Animation Comic — with citations; recommend canon + side_source{named work} vs filler under T27 (zero standing in the DBS manga), presenting both readings. No anchors (no chapter position exists in the DBS manga's space — say so). Row 22 is already filler by batch 18; do not re-judge it."],
  // ---- wave 2 (2026-08-26): B2 source kinds · B4 identity · B5 rearranged zones (B3 air dates use context-extra.ts)
  ['solo-leveling', '1-25', 'B2', "SOURCE KIND (T25, lane B2 — bundled with the-beginning-after-the-end and ghost-in-the-shell-arise-alternative-architecture; ONE JSON per series): the series is stored source_type 'other'. What does the anime ADAPT — the Korean webtoon (Dubu / Redice, KakaoPage 2018-2021, 179 ch) of Chugong's web novel, or the novel? The instrument question: if the webtoon is the source, the chapter space is the webtoon's own numbering (manhwa), and the SOURCE_TYPE_OVERRIDES value is 'manhwa' (a T25 kind — say whether the registry needs it). Deliver in structure.notes + flags_for_sean: the work, its chapter count and numbering unit, ≥2 sources (AniList's ADAPTATION edge, ja/en-WP, the publisher). No anchors, no type changes — a kind ruling only."],
  ['the-beginning-after-the-end', '1-12', 'B2', "SOURCE KIND (T25, lane B2): stored 'other'. The anime (2025) adapts TurtleMe's web novel via the Tapas webtoon (Fuyuki23) — which one is the adaptation edge on AniList, and which chapter space do fans map episodes to (webtoon chapters ~1-60 for S1?). Recommend 'manhwa' vs 'light_novel' with the evidence; the instrument follows the kind. No anchors."],
  ['ghost-in-the-shell-arise-alternative-architecture', '1-10', 'B2', "SOURCE KIND (T25, lane B2): stored 'other'. Alternative Architecture is the 2015 TV RE-CUT of the four Arise OVAs (+2 new episodes, Pyrophoric Cult). Is its source the Arise OVA series (an anime → 'original' under T25, canon to itself) or Shirow's manga (a manga-sourced adaptation)? Cite AniList's relation/source fields, ja-WP. Recommend the kind; say what the two new episodes adapt, if anything. No anchors."],
  ['yu-gi-oh-5d-s', '154-155', 'B4', "IDENTITY, NOT PLACEMENT (lane B4 — bundled with black-cat and the watch-order kinds file; ONE JSON per series): our rows 154 'Clashing Souls!' and 155 'Shining Forth To The Future' BOTH carry 2011-03-30; AniList / Wikipedia count 154 episodes. What IS row 155 — the second half of a one-hour double-length finale that AFL numbers separately (then the rows are one broadcast: an N11 numbering question — which row is the duplicate, and does the community count 154 or 155), or a real 155th episode? Cite ja-WP 各話リスト (放送日, 話数) and the fandom episode list. Deliver structure.notes + a repairs entry if a row must go (field 'row', old 155, new 'drop' — Sean rules) — no component placement, no anchor."],
  ['black-cat', '23-24', 'B4', "IDENTITY, NOT PLACEMENT (lane B4): row 24 'The Carefree Cat' is dated 2006-03-30 — the TV finale's date — but its title is the OVA Toozakaru Neko ('The Cat Who Went Away' / 'The Distant Cat', AniList 2589, released 2006-07-26). Which is row 24: the OVA (then the stored DATE is wrong → a G53 repair to 2006-07-26 and a structure note that it is the OVA), or a 24th TV episode (then the title is wrong)? ja-WP 各話リスト, fandom, AniList. No component placement — say what it is; Sean rules the structure."],
  ['detective-conan', '510, 511, 524, 585', 'B5', "REARRANGED ZONE (lane B5 — bundled with eyeshield-21 and kinnikuman; ONE JSON per series): four annotated rows carry chapter data (rearranged / graft facts) but no anchor, so interpolation may misplace them. Per row: anchor it under A3 when the sources give the exact chapters (Detective Conan World's per-episode manga-file mapping is authoritative: files = chapters) with START/END/chapters_adapted and the C-rules continue, or acknowledge the zone (anchor_hostile with why — a relocated fragment, A12/A44). Respect every stored anchor around them."],
  ['eyeshield-21', '38, 43, 62', 'B5', "REARRANGED ZONE (lane B5): rows 38, 43, 62 annotated with chapter data, no anchor. Anchor (exact chapters, ≥2 sources — eyeshield21.fandom, Wikipedia) or acknowledge (anchor_hostile). Note the stored anchors at 22-36 are batch-20 A2 territory — do not touch them; the E3-era START on row 61 (if any) stands."],
  ['kinnikuman', '32, 46', 'B5', "REARRANGED ZONE (lane B5): rows 32 and 46 annotated with chapter data, no anchor. Anchor or acknowledge. Traps: kinnikuman.fandom + ja-WP; the batch-17 'author-commissioned ≠ author-declared' note is about typing, not numbering; respect the stored anchors around them."],
  ['x', '9-19', 'B5', "REARRANGED ZONE (lane B5 — bundled with saint-seiya-knights-of-the-zodiac and tokyo-mew-mew; ONE JSON per series): rows 9-19 (seven annotated) carry chapter data but no anchor; X/1999's anime reorders the manga heavily and ends on its own (T10 only-ending class: 21-24 filler by ruling; ep 20 → ch 94 / v18 is RULED). Per row: an exact anchor under A3 where the sources (x1999 fandom, ja-WP, the batch-17 verdict batch17/out/x.json) give the chapters, else acknowledge the zone. Never contradict the ep-20 ruling."],
  ['saint-seiya-knights-of-the-zodiac', '29, 30, 32', 'B5', "REARRANGED ZONE (lane B5): rows 29, 30, 32 annotated, no anchor. Anchor or acknowledge; the batch-17 verifier REFUTED the 'phantom ch 53 / +2 from 50' claim — do not resurrect it; seiya fandom + Wikipedia arc tables; respect stored anchors."],
  ['tokyo-mew-mew', '25-28', 'B5', "REARRANGED ZONE (lane B5): rows 25-28 annotated with chapter data, no anchor (filler-mixed series, canon spine ch 1-~30; total 27 + the bonus story ruled). Anchor or acknowledge; tokyomewmew.fandom + Wikipedia; respect stored anchors."],
  ['ranma-1-2', '130', 'B5', "REARRANGED ZONE (lane B5 — bundled with bobobo-bo-bo-bobo, project-arms and emma-a-victorian-romance; ONE JSON per series): row 130 annotated with chapter data, no anchor (it is also in the mixed_fragment_only queue — a T28 call for Sean; say whether its tie is a fragment or a substantial share). Anchor or acknowledge; the ranma fandom episode pages carry chapter fields; the ep-153 G53 date ruling stands."],
  ['bobobo-bo-bo-bobo', '3', 'B5', "REARRANGED ZONE (lane B5): row 3 annotated, no anchor; a gag series where loose/abridged structure verdicts were accepted in batch 17 — anchor only if exact, else acknowledge."],
  ['project-arms', '44', 'B5', "REARRANGED ZONE (lane B5): row 44 annotated, no anchor; batch-17 checkpoint lattice stands (respect it); anchor if exact (ja sources), else acknowledge."],
  ['emma-a-victorian-romance', '2', 'B5', "REARRANGED ZONE (lane B5): row 2 annotated with chapter data, no anchor; anchor if exact (Wikipedia + MAL; the manga's 72 chapters), else acknowledge."],
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
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 19 (anchors and continues), lane ${lane}`);
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
