import { writeFileSync } from 'node:fs';
import { db } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, COMMUNITY_COUNT_OVERRIDES, EXTRAS_ADOPTED } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/resolve';
const OUT = process.argv[2] ?? '/tmp/batch14-ctx'; // pass an output dir; mkdir it first
// [id, target episode range (OUR numbering), kind, extra ask]
const TARGETS: [string, string, 'gap' | 'stitch', string][] = [
  ['kingdom', '39-76 and 130-155', 'stitch', 'Structure is being extended to S5 (AniList 155227, 13 eps = our 130-142, 2024) + S6 (190840, 13 eps = our 143-155, Oct-Dec 2025). Prior research (flag #814): ep 142 → ~ch 490, ep 155 → ch 540 — VERIFY with 2+ sources and add interiors. ALSO research the S2 gap (eps 39-76): arc-boundary anchors every ~4-6 eps.'],
  ['rent-a-girlfriend', '37-60', 'stitch', 'Structure is being extended with S4 (2025) and S5 (2026, airing?) — CONFIRM the AniList entries + episode counts for S4/S5 and their cumulative numbering (our S3 ends at ep 36 → ch 167). Flag #839 says S4 ends ~ch 214/vol 25 per WDTALO (single source — verify). Provide season-end anchors + interiors every ~3-4 eps.'],
  ['black-butler', '47-70', 'stitch', 'Structure is being extended: Public School Arc TV (AniList 166715, 11 eps, 2024 = our 47-57) + Emerald Witch Arc TV (179054, 13 eps, 2025 = our 58-70). Book of Murder OVAs (20670) and Book of the Atlantic film (21425) become ORDER-ONLY watch-order entries (not numbered). Flag #853: Public School = chs 67-85, Emerald Witch = chs 86-107, old MU pin 108 belongs at the Emerald Witch end. VERIFY + per-episode map. Also give the adaptation spans of Book of Murder and Atlantic for their order-only records, and confirm the community watch-order positions (after Book of Circus?).'],
  ['beastars', '25-48', 'stitch', 'Structure is being extended: FINAL SEASON Part 1 (AniList 136880, ONA 12 eps, Dec 2024 = our 25-36) + Part 2 (187267, 12 eps, Mar 2026 = our 37-48). Flag #854: adapts chs 100-196 completing the manga; ep 48 → 196/v22. VERIFY + per-episode map (Netflix batch releases; fandom episode pages).'],
  ['the-ancient-magus-bride', '25-48', 'stitch', 'Structure is being extended: SEASON 2 (AniList 154364, 12 eps, Apr 2023 = our 25-36) + SEASON 2 Part 2 (166452, 12 eps, Oct 2023 = our 37-48). The 2021 OVA "Nishi no Shounen to Seiran no Kishi" (130713, 3 eps) becomes an ORDER-ONLY entry — confirm its watch-order position and adaptation (it adapts a side story?). Prior finding: S2 endpoint = ch 95. VERIFY + per-episode map.'],
  ['golden-kamuy', '25-62', 'stitch', 'Structure is being extended: S3 (AniList 110355, 12 eps, 2020 = our 25-36), S4 (142343, 13 eps, 2022 = our 37-49), Final Season (166521, 13 eps, Jan-Mar 2026 = our 50-62, finishes the manga at ch 314). Flag #856 estimates S3 ≈ ch 140-200, S4 ≈ 201-273. Also: the OVAs (AniList 124756 "2nd Season OVA" 3 eps; 194872 2025 OVA; any others) carry TV-skipped canon — give each OVA its AniList id, community watch-order position, and adaptation span (our batch-12 record already has OVA 1 = chs 56-59, OVA 3 = 63-69). VERIFY + per-episode map.'],
  ['that-time-i-got-reincarnated-as-a-slime', '25-96', 'stitch', 'Structure is being extended: S2 (AniList 108511, 12 eps = our 25-36) + S2 Part 2 (116742, 12 eps = our 37-48) + S3 (156822, 24 eps = our 49-72) + S4 (182205, 24 eps, airing since Apr 2026 = our 73-96, ~19 aired). Also place the order-only entries: Coleus no Yume OVA (161802, 3 eps, 2023), the film Guren no Kizuna-hen (139498, 2022), Soukai no Namida-hen film (182206, 2026) — where do they sit in the watch order and what do they adapt (LN volume / manga chapters / original)? This entry maps to the MANGA (AniList manga 86399; MU coverage pin says ch 118 for the anime). Provide season-end anchors + interiors every ~3-4 eps IN MANGA CHAPTERS (not LN volumes), with the LN volume noted alongside.'],
  ['naruto-shippuden', '144-174', 'gap', 'Six-Tails Unleashed filler (144-151) then Pain arc canon 152-175: per-episode map for canon/mixed eps. Anchors before (ep 143) and after (ep 175) are listed below for continuity.'],
  ['yu-yu-hakusho-ghostfiles', '1-24', 'gap', 'Spirit Detective saga: per-episode map (the anime pads early; Wikipedia + fandom chapter pages).'],
  ['a-certain-scientific-railgun', '41-62', 'gap', 'Railgun S back half (Silent Party is anime-original — already typed) and Railgun T first half (Daihasei Festival arc): anchors for every canon/mixed ep in range.'],
  ['hajime-no-ippo-the-fighting', '89-101', 'gap', 'New Challenger interiors (our 77-102 = NC): per-episode map for 89-101 (Takamura vs Hawk etc.).'],
  ['hunter-x-hunter', '1-30', 'gap', 'HxH 1999: Hunter Exam + Zoldyck: per-episode map for 1-30 (anime-original padding exists — annotate).'],
  ['claymore', '1-19', 'gap', 'Per-episode map for 1-19 (eps 21-23 are loose_parallel + 24-26 divergence already annotated).'],
  ['world-trigger', '74-98', 'gap', 'S2 (our 74-85) + S3 (86-99): per-episode map (B-rank wars).'],
  ['dagashi-kashi', '1-23', 'gap', 'S1 (12 eps, 2016) + S2 (12 half-length eps, 2018): each ep adapts several short chapters — give the full chapters_adapted list per episode.'],
  ['cardcaptor-sakura', '1-92', 'gap', 'STRUCTURE QUESTION FIRST: our entry has 93 aired eps (the 70-ep 1998 series + the 22-ep Clear Card? check). The original manga = 50 chapters (12 vols); Clear Card is a separate manga. Report which of our episodes adapt which chapters (the 1998 anime interleaves anime-original card episodes — type them), and where Clear Card starts. Arc-level anchors are fine where the anime is loose.'],
  ['dragon-ball-z-kai', '1-166', 'gap', 'Kai follows the manga closely (chs 195-519 = the DBZ portion; Kai eps 1-97 Saiyan→Cell, 98-167 = Final Chapters/Buu). Provide saga-boundary anchors + interiors every ~5 eps (Kai episode ↔ manga chapter lists exist: kanzenshuu, dragonball fandom).'],
  ['reborn', '1-202', 'gap', 'Katekyo Hitman Reborn!: eps 1-19 daily-life (loose/anime-original heavy), Kokuyo 20-33, Varia 34-65, Future 66-141 (with filler), Inheritance 142-... Provide arc boundaries + interiors every ~5-8 eps; type anime-original stretches.'],
  ['rurouni-kenshin', '29-61', 'gap', 'Kyoto arc interiors (ep 28 → ch 48 is anchored; ep 62 → ch 151 end): per-episode map 29-61.'],
  ['edens-zero', '1-49', 'gap', 'S1 (25) + S2 (24): per-episode map (clean Mashima adaptation).'],
  ['to-love-ru-darkness', '1-23', 'gap', 'Darkness S1 (12) + 2nd (12, our 13-24) + OVAs? Confirm our 24 = TV only. Per-episode map (segment-based — list all chapters per ep).'],
  ['the-heroic-legend-of-arslan', '1-24', 'gap', 'S1 (25 eps, 2015): per-episode map (Arakawa manga; the anime also pulls from the novels — annotate novel-only stretches as divergence).'],
  ['silver-spoon', '1-21', 'gap', 'S1 (11) + S2 (11): per-episode map.'],
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
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 14`);
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
    lines.push(`## Volume boundaries (${(bounds ?? []).length}, source Wikipedia)`);
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
