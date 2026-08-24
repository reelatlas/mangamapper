// Batch 17 context generator — GAP TIER (roadmap item 2, Sean-approved
// 2026-08-24): all 46 anchor_gap_research series (unanchored canon stretches
// → checkpoint anchor coverage per batch17/PROTOCOL.md) + the 7
// frontier_tail_null series (canon eps past the last anchor render null).
// Same context-file shape as batches 14-16.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch17/context.ts <outdir>
import { writeFileSync } from 'node:fs';
import { db } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, COMMUNITY_COUNT_OVERRIDES, EXTRAS_ADOPTED } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/resolve';
const OUT = process.argv[2] ?? '/tmp/batch17-ctx'; // pass an output dir; mkdir it first
// [id, target episodes (OUR numbering), kind, extra ask]
// gap = unanchored canon stretch (density per protocol: cheap per-episode
// fields → take all; else arc/season boundaries + every 3-5 eps; 100+ ep
// targets → boundary + ~every 10). tail = canon eps past the last anchor
// render null — a run-end/tail anchor (or a divergence/type verdict) closes it.
const TARGETS: [string, string, 'gap' | 'tail', string][] = [
  ['naruto-shippuden', '262-298', 'gap', 'War-arc zone: 21 unanchored CANON eps scattered inside the 262-298 filler-mix (AFL types are in our rows — anchor only canon/mixed). Manga region ~chs 515-540. naruto.fandom.com episode infoboxes + animefillerguide; do NOT touch the batch-15/16 exact records elsewhere.'],
  ['bleach', '111-126', 'gap', 'Arrancar arrival block (chs ~181-229). bleach.fandom.com episode pages carry chapter fields; existing anchors bracket at 110 and 127 — respect them.'],
  ['that-time-i-got-reincarnated-as-a-slime', '1-24', 'gap', 'S1. LN-source series — our chapter space is the MANGA (map to manga chapter numbers, never LN volumes). tensura.fandom.com episode pages list manga/LN counterparts; Wikipedia episode summaries corroborate.'],
  ['gintama', '1-368', 'gap', 'GIANT + episodic gag series: 345 unanchored canon eps. Gintama fandom episode pages list adapted Lessons (= chapters) — if per-episode fields are cheap, take them; else checkpoint lattice (arc boundaries + every ~10 canon eps). Heavy anime-original content (AFL) — never anchor those. Structure findings on any season-numbering trap.'],
  ['yu-yu-hakusho-ghostfiles', '45-65', 'gap', 'Chapter Black saga (chs ~113-152). Bracketed by existing records at 44 and 66. Fandom + the batch-14/15 numbering caution: en-WP chapter list runs +1 from vol 8 — stored anchors are fandom/JP numbering.'],
  ['hunter-x-hunter', '46-61', 'gap', 'HxH 1999 Yorknew stretch (chs ~64-119). Hunterpedia page-level fields are the proven primary (batch-14/15 verdicts); Wikipedia corroborates.'],
  ['world-trigger', '48-63', 'gap', 'S2→S3 gap (region ~chs 87-125). worldtrigger.fandom.com episode pages have chapter fields; batch-14 verdict (batch14/out/world-trigger.json) documents the source landscape.'],
  ['sailor-moon', '1-199', 'gap', 'GIANT 90s series, famously loose per-arc: each season loosely adapts one manga arc with heavy filler (AFL types in rows). Deliverable: season/arc boundary anchors + checkpoints where the adaptation is act-faithful, loose_parallel/abridged annotations where not — and an honest structure verdict if chapter-level anchoring is wrong for whole seasons. Manga numbering: use ACT numbering converted to our chapter space (state the conversion; the manga was renumbered across editions).'],
  ['shadows-house', '1-24', 'gap', 'S1+S2. shadowshouse.fandom.com episode pages carry chapter fields; MAL threads corroborate.'],
  ['vampire-knight', '1-25', 'gap', 'S1 + Guilty (chs ~1-46). vampireknight.fandom.com + Wikipedia.'],
  ['heavens-lost-property', '1-27', 'gap', 'S1+S2 (chs ~1-50, non-linear in spots). heavenslostproperty.fandom.com + MAL.'],
  ['fate-kaleid-liner-prisma-illya', '1-41', 'gap', 'STRUCTURE FIRST: each season adapts a DIFFERENT manga (1st series 2 vols, 2wei!, 3rei!!) but our entry has ONE chapter space (total 14 = the 1st series). Establish which season adapts which manga, anchor S1 (eps 1-10) in our space, and deliver structure notes + a flags_for_sean recommendation for how the later seasons should be scoped (do NOT force 2wei/3rei chapters into the 1st-series numbering). The healed ep-42 pin (ch 13) is MU-derived — verify or repair it.'],
  ['gantz', '1-25', 'gap', 'S1+S2 (chs ~1-115ish; anime diverges late S2 — annotate the divergence honestly). gantz.fandom.com + Wikipedia.'],
  ['rurouni-kenshin-2023', '25-46', 'gap', 'S2 Kyoto Disturbance (chs ~47-151). kenshin fandom episode pages carry chapter fields (proven in the 2023-series records for 1-24); respect existing anchors.'],
  ['kingdom', '1-37', 'gap', 'S1 (chs ~1-172). kingdom.fandom.com episode pages + MAL; the ruled-extension stitch covers later seasons — S1 is the gap.'],
  ['yowamushi-pedal', '1-37', 'gap', 'S1 (chs ~1-100). yowapeda.fandom.com + Wikipedia.'],
  ['skip-beat', '1-24', 'gap', 'Single season (chs ~1-44). skip-beat.fandom.com + Wikipedia; MAL threads.'],
  ['shugo-chara', '1-126', 'gap', 'GIANT: 3 seasons, Party-era heavy filler (AFL). Checkpoint lattice + season boundaries; shugochara.fandom.com.'],
  ['saint-seiya-knights-of-the-zodiac', '1-72', 'gap', 'Sanctuary→Poseidon region (58 unanchored of eps 1-72). seiya fandom + Wikipedia arc tables; Asgard is anime-original (types in rows).'],
  ['sailor-moon-crystal', '1-38', 'gap', 'Crystal maps ~1:1 to manga Acts — likely a cheap full per-episode sweep. State the Act→our-chapter-space conversion explicitly.'],
  ['eyeshield-21', '38-144', 'gap', 'Long stretch (chs ~130-333). eyeshield21.fandom.com + Wikipedia; checkpoint lattice ok.'],
  ['chrono-crusade', '1-24', 'gap', 'Anime diverges from the manga in the back half (original ending) — anchor the faithful front, divergence annotation + honest bound for the back. chronocrusade.fandom.com + Wikipedia.'],
  ['tokyo-mew-mew', '1-51', 'gap', 'Filler-mixed (AFL); checkpoint anchors on the canon spine (chs 1-~30ish?). tokyomewmew.fandom.com.'],
  ['fist-of-the-north-star', '58-108', 'gap', 'Post-Raoh-era stretch. hokuto.fandom.com + Wikipedia arc tables; respect existing 1-57 records.'],
  ['zatch-bell', '1-138', 'gap', 'GIANT (121 unanchored canon eps). zatchbell.fandom.com + animefillerguide; checkpoint lattice.'],
  ['hikaru-no-go', '1-74', 'gap', 'Chs 1-189ish; hikarunogo.fandom.com + Wikipedia; title matches are strong here.'],
  ['toriko', '1-146', 'gap', 'GIANT (129 unanchored canon eps, filler mixed). toriko.fandom.com + animefillerguide; checkpoint lattice.'],
  ['blade-of-the-immortal-ona', '1-23', 'gap', '2019 ONA compresses the entire ~219-ch manga into 24 eps — checkpoint anchors + abridged annotations; bladeoftheimmortal fandom + reviews (heavy compression is documented).'],
  ['arms-alchemy', '1-25', 'gap', 'Busou Renkin (chs 1-80ish). fandom thin — Wikipedia + MAL threads may carry the load.'],
  ['ace-of-the-diamond-act-ii', '1-51', 'gap', 'CHAPTER SPACE: Act II is its OWN manga numbering (our entry space) — never mix in Act-I chapter numbers. diamondnoace.fandom.com + Wikipedia.'],
  ['dragon-quest-the-adventure-of-dai', '1-99', 'gap', '2020 remake, 17 unanchored eps scattered — fill the gaps only (existing anchors elsewhere; respect them). dragonquest.fandom.com Dai pages + Wikipedia.'],
  ['bobobo-bo-bo-bobo', '1-75', 'gap', 'Gag series — if per-episode mapping is unsupportable, an honest loose/abridged structure verdict for stretches beats fabricated anchors. bobobo.fandom.com + ja sources.'],
  ['rave-master', '1-50', 'gap', 'Chs 1-~150. ravemaster.fandom.com + Wikipedia.'],
  ['x', '1-19', 'gap', 'X/1999: anime has an original ending (manga was unfinished) — one of our 3 unknown-coverage research cases. Deliverable: structure verdict (faithful front / divergence point / loose?) + anchors only where honest. x1999.fandom.com + Wikipedia.'],
  ['emma-a-victorian-romance', '1-23', 'gap', 'S1+S2 (chs 1-72). emma fandom thin — Wikipedia + MAL.'],
  ['detective-school-q', '1-44', 'gap', 'Fandom thin; ja.wikipedia episode table + MAL. Checkpoint anchors acceptable.'],
  ['angel-heart', '1-49', 'gap', 'Chs 1-~120ish. ja sources likely needed (fandom thin).'],
  ['kinnikuman', '1-118', 'gap', 'GIANT classic; kinnikuman.fandom.com + ja.wikipedia; checkpoint lattice.'],
  ['project-arms', '1-52', 'gap', 'Chs 1-~180ish; fandom thin — Wikipedia + ja sources; checkpoint lattice.'],
  ['fist-of-the-blue-sky', '1-25', 'gap', 'Souten no Ken (chs 1-~50ish region). ja sources + Wikipedia.'],
  ['hayate-the-combat-butler', '1-100', 'gap', '32 unanchored eps scattered across the seasons — fill gaps only, respect existing anchors. hayate fandom + Wikipedia.'],
  ['magic-knight-rayearth', '1-48', 'gap', '28 unanchored (2 seasons ≈ 2 manga series — mind the numbering: Rayearth II is its own 3 vols). rayearth.fandom.com + Wikipedia.'],
  ['detective-conan', '1-1204', 'gap', 'THE GIANT (636 unanchored canon eps). Detective Conan World (detectiveconanworld.com/wiki) has AUTHORITATIVE per-episode manga-file mappings ("files" = chapters) — use its API/tables; AFL types are in our rows. Checkpoint lattice: every ~20 canon eps + season/arc boundaries; do not attempt all 636 exhaustively. State the file→chapter numbering identity.'],
  ['d-gray-man', '52-102', 'gap', 'Back half + Hallow (chs ~90-218). dgrayman.fandom.com episode pages carry chapter fields.'],
  ['space-adventure-cobra', '1-30', 'gap', '1982 series; adaptation order may be loose — honest structure verdict + checkpoint anchors. cobra fandom thin; ja sources.'],
  ['sket-dance', '1-76', 'gap', 'Chs 1-~200; sketdance.fandom.com + Wikipedia; checkpoint lattice.'],
  // ---- frontier_tail_null (canon eps past the last anchor render null)
  ['soul-eater', '37-38', 'tail', 'TAIL: 2 canon eps past anchor ep 36 render null. Soul Eater famously diverges from the manga in its back half — establish whether 37+ still adapts manga (anchor) or is divergence (annotation + type verdict). souleater.fandom.com.'],
  ['elfen-lied', '13', 'tail', 'TAIL: ep 13 (finale) past anchor ep 12 — anchor it (finale anchors to what it adapts; the anime ending is partly original — annotate honestly).'],
  ['one-piece', '1175', 'tail', 'TAIL: newest ep past anchor 1174 — one anchor from onepiece.fandom.com episode page (chapter fields are reliable there). Do not touch anything else.'],
  ['mashle-magic-and-muscles', '25', 'tail', 'TAIL: ep 25 past anchor ep 24 — anchor from mashle fandom + Wikipedia.'],
  ['kenichi-the-mightiest-disciple', '51-61', 'tail', 'TAIL: 11 canon eps past anchor ep 50 — but the TV series is 50 eps; establish what rows 51-61 ARE (OVAs adopted as episodes?) and anchor or re-classify honestly. kenichi fandom.'],
  ['rurouni-kenshin', '63-70', 'tail', 'TAIL: 8 canon eps past anchor ep 62 (the 1996 series — Kyoto arc ends ~62; eps 63+ are the anime-original Christian arc region?) — likely type corrections (AFL says filler?) rather than anchors; verify against our row types and AFL.'],
  ['twin-star-exorcists', '21-50', 'tail', 'TAIL/DIVERGENCE: 30 canon-typed eps past anchor ep 20 — the anime famously departs into an original story arc (~ep 21+) with periodic manga returns (~ep 32?+). Establish the real structure: type corrections (anime-only-canon) for the original stretches, anchors where it returns to manga. sukehira fandom + MAL + reviews.'],
];
const compact = (a: { episode: number; chapter: number; start_chapter: number | null; chapters_adapted: string | null; volume: number | null; source: string; continue_chapter: number | null }) =>
  `ep${a.episode}→${a.chapter}${a.start_chapter != null ? ` [start ${a.start_chapter}]` : ''}${a.chapters_adapted ? ` {${a.chapters_adapted}}` : ''}${a.volume != null ? ` v${a.volume}` : ''} (${a.source})${a.continue_chapter != null ? ` continue→${a.continue_chapter}` : ''}`;
function ranges(r: string): [number, number][] { return r.split(' and ').map((p) => { const [a, b] = p.split('-').map(Number); return [a, b ?? a]; }); }
async function main() {
  const index: string[] = [];
  for (const [id, range, kind, ask] of TARGETS) {
    const { data: s } = await db.from('series').select('*').eq('id', id).maybeSingle();
    if (!s) { console.log('MISSING', id); continue; }
    const { data: comps } = await db.from('series_components').select('*').eq('series_id', id).order('season_order');
    const { data: anchors } = await db.from('chapter_anchors').select('episode, chapter, start_chapter, chapters_adapted, volume, source, continue_chapter, note').eq('series_id', id).order('episode');
    const { data: ann } = await db.from('episode_annotations').select('episode, kind, chapters, note').eq('series_id', id).order('episode');
    const { data: bounds } = s.manga_anilist_id ? await db.from('volume_boundaries').select('volume, chapter_start, chapter_end').eq('manga_anilist_id', s.manga_anilist_id).order('volume') : { data: [] as any[] };
    const eps: any[] = [];
    for (let f = 0; ; f += 1000) { const { data } = await db.from('episodes').select('number, title, type, air_date').eq('series_id', id).order('number').range(f, f + 999); eps.push(...(data ?? [])); if (!data || data.length < 1000) break; }
    const { data: flags } = await db.from('ingest_flags').select('id, kind, detail').eq('series_key', id).eq('status', 'open');
    const rs = ranges(range);
    const inRange = (n: number) => rs.some(([a, b]) => n >= a - 3 && n <= b + 3);
    const lines: string[] = [];
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 17`);
    lines.push(`Kind: ${kind}. Target episodes (OUR cumulative numbering): ${range}.`);
    lines.push(`ASK: ${ask}`);
    lines.push('');
    lines.push(`## Entry facts`);
    lines.push(`status=${s.status} aired_episodes=${s.aired_episodes} total_episodes=${s.total_episodes} source_type=${s.source_type} mapping_mode=${s.mapping_mode}`);
    lines.push(`AniList anime id=${s.anilist_id} (MAL ${s.mal_id}); manga AniList id=${s.manga_anilist_id} manga_status=${s.manga_status} total_chapters=${s.total_chapters} latest_known_chapters=${s.latest_known_chapters} total_volumes=${s.total_volumes} manga_start_chapter=${s.manga_start_chapter} continue_from_chapter=${s.continue_from_chapter} max_adapted_chapter=${s.max_adapted_chapter}`);
    lines.push(`Components (season_order: anilist_id episodes [kind] label): ${(comps ?? []).map((c) => `${c.season_order}: ${c.anilist_id} ${c.episode_start ?? 'null'}-${c.episode_end ?? 'null'} [${c.kind}] ${c.label ?? ''}`).join(' | ') || 'none'}`);
    const rul: string[] = [];
    if (EPISODE_TYPE_OVERRIDES[id]) rul.push(`EPISODE_TYPE_OVERRIDES: ${JSON.stringify(EPISODE_TYPE_OVERRIDES[id])}`);
    if (SOURCE_NUMBERING_SHIFTS[id]) rul.push(`SOURCE_NUMBERING_SHIFTS: ${JSON.stringify(SOURCE_NUMBERING_SHIFTS[id])}`);
    if (COMMUNITY_COUNT_OVERRIDES[id]) rul.push(`COMMUNITY_COUNT_OVERRIDES: ${JSON.stringify(COMMUNITY_COUNT_OVERRIDES[id])}`);
    if (EXTRAS_ADOPTED.has(id)) rul.push('EXTRAS_ADOPTED');
    lines.push(`Rulings in code: ${rul.join('; ') || 'none'}`);
    lines.push('');
    lines.push(`## Existing anchors (${(anchors ?? []).length}) — ep→END chapter [start] {chapters_adapted} vol (source)`);
    lines.push((anchors ?? []).map(compact).join('\n') || 'none');
    lines.push('');
    lines.push(`## Existing annotations (${(ann ?? []).length})`);
    lines.push((ann ?? []).map((a) => `ep${a.episode} ${a.kind}${a.chapters ? ` {${a.chapters}}` : ''}: ${a.note ?? ''}`).join('\n') || 'none');
    lines.push('');
    lines.push(`## Volume boundaries (${(bounds ?? []).length})`);
    lines.push((bounds ?? []).map((b) => `v${b.volume}: ${b.chapter_start}-${b.chapter_end ?? '?'}`).join(', ') || 'none');
    lines.push('');
    lines.push(`## Episode rows in/near the target range (${eps.length} rows total) — number [type] title (air_date)`);
    lines.push(eps.filter((e) => inRange(e.number)).map((e) => `${e.number} [${e.type}] ${e.title || '(no title)'}${e.air_date ? ` (${e.air_date})` : ''}`).join('\n') || 'no rows in range');
    lines.push('');
    lines.push(`## Open flags`);
    lines.push((flags ?? []).map((f) => `#${f.id} [${f.kind}] ${JSON.stringify(f.detail).slice(0, 500)}`).join('\n') || 'none');
    writeFileSync(`${OUT}/${id}.md`, lines.join('\n'));
    index.push(`${id}: ${kind} ${range} — anchors ${(anchors ?? []).length}, rows ${eps.length}, aired ${s.aired_episodes}`);
  }
  console.log(index.join('\n'));
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
