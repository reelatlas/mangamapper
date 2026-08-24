// Batch 16 context generator — reorder-hole closure batch (Sean-approved next
// task after the 2026-08-24 save point 8977c04): every remaining reorder hole
// from `verify-series-display --all` (38 holes, 10 series as of 2026-08-24).
// Same context-file shape as batches 14/15.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch16/context.ts <outdir>
import { writeFileSync } from 'node:fs';
import { db } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, COMMUNITY_COUNT_OVERRIDES, EXTRAS_ADOPTED } from '/Users/sean/Projects/mangamapper/scripts/ingest/lib/resolve';
const OUT = process.argv[2] ?? '/tmp/batch16-ctx'; // pass an output dir; mkdir it first
// [id, target episodes (OUR numbering), kind, extra ask] — every target is a
// HOLE: inside a reorder crossing with no exact record; each needs a full
// anchor WITH ITS OWN start_chapter (non-monotonic legal), or an evidenced
// zone_level_only verdict.
const TARGETS: [string, string, 'hole', string][] = [
  ['black-butler', '4-5', 'hole', 'S1 continuation of the shuffled opening: batch 15 established eps 1-3 (out/black-butler.json in batch15 — read it; ep 3 is ruled mixed in EPISODE_TYPE_OVERRIDES). Eps 4-5 sit inside the same reorder crossing: which parts of chs 4-6 (Jack the Ripper lead-in?) each adapts, interwoven with anime-original material. kuroshitsuji.fandom.com episode pages via MediaWiki API; the batch-14 verdict proved kuroshitsuji.wiki.gg is an independent second lineage — use both.'],
  ['bleach-thousand-year-blood-war', '39', 'hole', 'TYBW Part 3 finale region: batch 15 delivered exact records for 33/35/36/38 (batch15 out/bleach-thousand-year-blood-war.json — read it for the interleave facts: 630-654 with Friend deferred, Pernida/Lille split into blocks). Ep 39 (P3 finale) needs its own start_chapter + full list. Part 3 fandom episode pages carry chapter fields; AnimeCorner/ButWhyTho weekly reviews corroborate.'],
  ['cells-at-work', '18-20', 'hole', 'S2 (our eps 14-21) airs chapters out of order like S1 (episodic reorder). Eps 18-20 are holes needing full anchors with their own start_chapter. NOTE: S1 holes 4/12/13 were closed in batch 15 (batch15 out/cells-at-work.json) and eps 12/13 have NO episode rows — anchors alone drive synthesized rows (assemble.ts). Check whether 18-20 have episode rows in the context below; anchor regardless. Sources: hataraku-saibou.fandom.com episode pages ("Cell Chapter" fields) + MAL threads; S2 adapts late vols 5-6 + Code Black is a DIFFERENT manga — mainline chapters only.'],
  ['food-wars', '17 and 57', 'hole', 'Two isolated holes flanking zones batch 15 closed (batch15 out/food-wars.json — read it: 15-16 arc swap and prelims 19-23 are now exact; 56/58 Joichiro lift is exact). Ep 17 sits between the arc swap and the prelims interleave — its own start + list (chs ~40-44 tail? 34-39 region?). Ep 57 sits inside the 195-199 lift zone between the exact 56 and 58 records — which chapters remain for 57. shokugekinosoma.fandom.com episode pages + MAL threads.'],
  ['kamisama-kiss', '14-24', 'hole', 'ENTIRE S2 (our eps 14-24, 2015) airs out of manga order, same pattern as S1 which batch 15 fully solved per-episode (batch15 out/kamisama-kiss.json — read it for the source landscape that worked: kamisamahajimemashita.fandom.com chapter pages carry anime-episode reverse fields; Wikipedia episode summaries + MAL threads corroborate). S2 draws from roughly chs 31-90 non-linearly (Ookuninushi/Izumo, Akura-ou past arc pulled forward). Per-episode chapters_adapted + own start + honest continue points. Ep 10 S1 is ruled mixed — S2 may have mixed eps too: type_corrections where evidenced.'],
  ['miss-kobayashis-dragon-maid', '4-7', 'hole', 'S1 early block: batch 15 established eps 3, 11-12, 14, 16-24 (batch15 out/miss-kobayashis-dragon-maid.json — read it; eps 19/20/21/23 ruled mixed). Eps 4-7 are the remaining S1 holes — Kyoani weaves early vols 1-3 chapters non-linearly with original material; Kanna spinoff chapters labeled in chapters_adapted, never as mainline numbers. dragon-maid fandom + MAL; ja sources often best for Kyoani splits.'],
  ['naruto', '108-109', 'hole', 'Sasuke-vs-Naruto rooftop / retrieval lead-in: batch 15 anchored ep 107 (chs 173-175 + ch 184 graft — batch15 out/naruto.json). Eps 108-109 continue the crossing (175-181 region with graft displacement) — own starts + full lists. naruto.fandom.com chapter pages carry reverse anime fields; MAL threads dense.'],
  ['naruto-shippuden', '121-125 and 130-132', 'hole', 'Two hole blocks flanking batch-15 exact records (batch15 out/naruto-shippuden.json — READ IT FIRST: 119-120 Kakashi Gaiden graft and 127-129/134 Jiraiya-block fragments are now exact; 452-457 are ruled anime-only-canon in EPISODE_TYPE_OVERRIDES). Block A: 121-125 (Sasuke-vs-Itachi buildup / Hunt interleave, chs ~343-365 region with the Jiraiya thread starting to interleave). Block B: 130-132 (Jiraiya-vs-Pain, chs ~369-383 interleaved with the 127-129 flashback fragments already recorded — which mainline pages remain for 130-132). Own starts + full lists; fragments stated per ep. naruto.fandom.com reverse fields + MAL.'],
  ['nisekoi', '26', 'hole', 'S2 opener region: batch 15 anchored 21/23/25/28 (batch15 out/nisekoi.json — read it: 25 = ch 56 + anachronistic ch 104 graft; 28 = omake + spinoff). Ep 26 sits in the crossing after the ch-104 graft — its own start + list (chs ~61-63? verify). nisekoi.fandom.com chapter pages reverse-map; MAL threads.'],
  ['tokyo-ghoul-re', '19-22', 'hole', ':re S2 back half: batch 15 delivered 7, 14-18 (batch15 out/tokyo-ghoul-re.json — READ IT for the interleave facts: 17-18 = 99-120 jumps with 104/115 skipped) and research volume boundaries are seeded for :re v1-v16 (85611). Eps 19-22 compress chs ~121-158+ heavily with reordering (:re S2 famously compresses ~60 chapters into the back half). Own starts + full lists, or honest zone_level_only with the best bound — an acknowledged-approximate row beats a guess. tokyoghoul.fandom.com chapter pages reverse-map to :re episodes; ButWhyTho/TheReviewGeek reviewed :re S2 weekly.'],
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
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 16`);
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
