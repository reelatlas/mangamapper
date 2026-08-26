// Batch 18 context generator — STANDING TIER (T4-GLOSSARY §6 step 5, Sean's
// go 2026-08-26): every row AFL calls "anime canon" that T4.3 stored as
// filler without a ruling (census class afl_anime_canon_unruled), plus the
// A-7 studio-ending class (divergence-annotated, on the review list) and the
// two PROVISIONAL adopted bases. Verdicts are STANDINGS + annotations per
// batch18/PROTOCOL.md — no anchors in this batch.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch18/context.ts <outdir>
import { writeFileSync } from 'node:fs';
import { db, selectAll } from '../../lib/db';
import { EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, translateEpisodeNumber } from '../../lib/resolve';
import { aflAnimeCanonStanding, sourceKindOf } from '../../lib/rulings/source-kinds';
import { STANDING_ANNOTATIONS } from '../../lib/rulings/standing-annotations';

const OUT = process.argv[2] ?? '/tmp/batch18-ctx'; // pass an output dir; mkdir it first

// [id, target episodes (OUR numbering), wave, ask]
// wave 1 = the big unruled blocks (full agents; Boruto split by arc)
// wave 2 = the A-7 studio-ending class (adopted{studio} or filler, cited)
// wave 3 = narrow bundles: 1-3 row series + the two provisional bases
export const TARGETS: [string, string, 1 | 2 | 3, string][] = [
  // ---- wave 1
  ['boruto-naruto-next-generations', '2-105', 1, 'Boruto A: the pre-manga stretch (Academy, Ghost, Byakuya, Versus Momoshiki lead-in, Chocho, Mitsuki\'s Disappearance). AFL calls all of it anime canon because the manga had not reached it. For EACH arc: is Kishimoto / Ikemoto / the studio credited with story, is it "canon" by author declaration, or is it studio material the community accepts? Row by row where arcs mix in manga-adapting episodes (the Momoshiki arc adapts chs 1-10). Deliver standings + adopted{basis} where a basis is documented, filler where not.'],
  ['boruto-naruto-next-generations', '120-220', 1, 'Boruto B: Mitsuki Retrieval → Time Slip → Mujina Bandits → Kara Actuation → Vessel → Kawaki (only the AFL anime-canon rows in 120-220; the manga-adapting rows are already canon with anchors — respect them). Same question as Boruto A; note the 221-286 block already carries adopted{community, PROVISIONAL} — if your arcs\' evidence changes that basis, say so in flags_for_sean.'],
  ['beyblade-metal-fusion', '4-45', 1, '32 anime-canon rows scattered through S1. Source is the Metal Fight Beyblade manga (Takafumi Adachi, CoroCoro); the anime is generally held to be its own continuity. Establish per row / per block: adapts the manga (canon), studio material the author or Takara Tomy declared canon (adopted{basis}), or filler. ja.wikipedia + the beyblade fandom.'],
  ['fullmetal-alchemist', '8-51', 1, 'FMA 2003: the famous divergence. Rows 8-51 AFL calls anime canon. Establish the divergence point precisely (which episodes still adapt Arakawa\'s chapters, which are Bones\' original story), and whether Arakawa\'s documented involvement ("original story, different ending" — she asked for it) gives the original half an author basis or leaves it filler. Present both readings with citations; Sean rules.'],
  ['dragon-ball-super', '16-95', 1, '15 anime-canon rows (16-17, 22, 50, 52, 71-72, 78-81, 90-91, 94-95). DBS is Toriyama-plotted (author basis is plausible for anime-only episodes) — cite Toriyama\'s credited involvement per episode/arc vs Toyotarou\'s manga; distinguish adopted{author} from padding filler.'],
  ['outlaw-star', '1-17', 1, '13 anime-canon rows out of 24 (1-8, 10-12, 15, 17). Source is Takehiko Ito\'s manga (Ultra Jump, 3 vols) — the anime outran it and diverges early. Establish which episodes adapt the manga at all; the rest are studio material: adopted{studio}? (Ito\'s studio-credit) or filler.'],
  ['soul-eater', '39-51', 1, 'The anime\'s original ending (Bones outran Ohkubo). Rows 39-51. Establish the divergence point and whether Ohkubo\'s involvement is documented (author basis) or it is a studio ending (filler + divergence, the A-7 class).'],
  // ---- wave 2 — the A-7 studio-ending class (already divergence-annotated, filler under T27)
  ['twin-star-exorcists', '21-50', 2, 'The anime\'s serialized finale that never returns to the manga (Yuto dies here, survives there). Sean\'s explicit review item: adopted{studio} (documented studio canon for the anime continuity) or filler? Cite Sukeno\'s involvement or lack of it.'],
  ['claymore', '24-26', 2, 'Madhouse outran the manga and wrote its own ending. adopted{studio} or filler — cite Yagi\'s involvement or lack of it.'],
  ['gto-great-teacher-onizuka', '22-28, 34, 42-43', 2, 'Anime-original mid-series block (22-28, 34) and the original ending (42-43). Same question, per block; Fujisawa\'s involvement.'],
  ['ajin-demi-human', '14-26', 2, 'Season 2 is anime-original with a non-canon ending (canon resumes at manga ch 22 per batch 12). adopted{studio} or filler; Sakurai\'s involvement.'],
  ['chrono-crusade', '22-24', 2, 'The original ending after ep 13\'s departure. adopted{studio} or filler; Moriyama\'s involvement.'],
  ['sailor-moon', '167-172', 2, 'The Nehelenia-revival arc (anime-original continuation of SuperS). adopted{studio} or filler; Takeuchi\'s involvement.'],
  ['a-certain-scientific-railgun', '13, 15-24, 41-48', 2, 'S1 back half (Big Spider / Poltergeist) and S\'s Silent Party: director-confirmed anime-original. adopted{studio}/{author} (Kamachi credited?) or filler.'],
  ['world-trigger', '48', 2, 'Anime-original breather inside the canon arc (49-63 are the RETCONNED Fugitive Arc — already annotated, do not re-litigate). adopted or filler for 48 alone.'],
  // ---- wave 3 — narrow bundles (several series per agent)
  ['one-piece', '213, 215, 453, 454, 456, 499, 506, 775, 1084', 3, 'Nine AFL anime-canon rows T4.3 stored filler (the batch-17 A1 verdict already ruled 737 mixed etc. — respect it). Per row: does it adapt manga content (canon/mixed), is it a recap/special (filler + abridged), or Oda-supervised anime material (adopted{author}: e.g. the Toriko crossover, the Sabo/Ace flashbacks)?'],
  ['akame-ga-kill', '20-24', 3, 'The anime\'s original ending (White Fox outran Takahiro). adopted{studio}/{author} (Takahiro credited?) or filler.'],
  ['black-clover', '13, 55, 56', 3, 'Three AFL anime-canon rows outside the adopted 130-157 block. Adapts chapters (canon)? Tabata-supervised (adopted{author})? Or filler.'],
  ['noragami', '11-12', 3, 'S1 finale is anime-original (Adachitoka\'s involvement?). adopted{basis} or filler.'],
  ['sgt-frog', '180, 357', 3, 'Two AFL anime-canon rows in a gag series. Recap/special (filler) or manga-adapting (canon)?'],
  ['86-eighty-six', '10', 3, 'Ep 10 (S1) — a recap or an anime-original interlude? filler + abridged, or canon.'],
  ['demon-slayer-kimetsu-no-yaiba', '27', 3, 'Ep 27: the Mugen Train "ep 1" / recap / original? Say what the entry IS and its standing.'],
  ['durarara', '25', 3, 'Ep 25: the Netflix-era OVA / special. Standing; note the format.'],
  ['fullmetal-alchemist-brotherhood', '1', 3, 'Ep 1 is anime-original (the Isaac McDougal episode). filler, or adopted (Arakawa involvement)?'],
  ['girls-last-tour', '4', 3, 'Ep 4 anime-canon per AFL — adapts a chapter or original? Standing.'],
  ['high-school-of-the-dead', '13', 3, 'Ep 13 = the Drifters of the Dead OVA; adapts the manga\'s bonus chapter? Standing + format note.'],
  ['naruto-shippuden', '28', 3, 'Ep 28 (Kakashi Gaiden lead-in?) — AFL anime canon; adapts manga (canon) or original (filler)? The 452-457 block is already side_source; do not touch it.'],
  ['steins-gate', '25', 3, 'Ep 25 "Egoistic Poriomania" — the original OVA; expected filler (VN default, T27). Confirm; note whether any VN material is adapted.'],
  ['sword-art-online', '50', 3, 'Ep 50 = Extra Edition (recap + original)? Standing + format note.'],
  ['vinland-saga', '5', 3, 'Ep 5 anime-canon per AFL — adapts chapters (canon) or original? Standing.'],
  ['beastars', '44', 3, 'BASIS ONLY: ep 44 is canon + adopted{studio, PROVISIONAL}. Which basis does the evidence support — studio bridge, author (Itagaki) involvement, or community? Cite.'],
  ['rurouni-kenshin-2023', '44', 3, 'Ep 44 adapts zero chapters and has no positive canon signal (filler under T27); 34 is adopted{author}. Is 44 also Watsuki material (adopted{author}) or filler? Cite.'],
];

const ranges = (s: string): [number, number][] =>
  s.split(',').map((p) => p.trim()).map((p) => {
    const [a, b] = p.split('-').map(Number);
    return [a, b ?? a];
  });

async function main() {
  const index: string[] = [];
  for (const [id, range, wave, ask] of TARGETS) {
    const { data: s } = await db.from('series').select('*').eq('id', id).maybeSingle();
    if (!s) { console.log('MISSING', id); continue; }
    const comps = await selectAll<any>('series_components', '*', (q) => q.eq('series_id', id).order('season_order'));
    const anchors = await selectAll<any>('chapter_anchors', 'episode, chapter, start_chapter, chapters_adapted, volume, source, note', (q) => q.eq('series_id', id).order('episode'));
    const ann = await selectAll<any>('episode_annotations', 'episode, kind, basis, chapters, note', (q) => q.eq('series_id', id).order('episode'));
    const eps = await selectAll<any>('episodes', 'number, title, type, air_date', (q) => q.eq('series_id', id).order('number'));
    const { data: afl } = s.afl_slug ? await db.from('ingest_afl_shows').select('raw').eq('slug', s.afl_slug).maybeSingle() : { data: null };
    const aflClaim = new Map<number, string>();
    for (const e of (afl?.raw?.episodes ?? []) as { number: number; type: string }[]) {
      const n = translateEpisodeNumber(id, e.number, 'afl');
      if (n != null) aflClaim.set(n, e.type === 'anime-only-canon' ? 'anime canon' : e.type);
    }
    const rs = ranges(range);
    const inRange = (n: number) => rs.some(([a, b]) => n >= a && n <= b);
    const near = (n: number) => rs.some(([a, b]) => n >= a - 3 && n <= b + 3);
    const kind = sourceKindOf(s.source_type);
    const lines: string[] = [];
    lines.push(`# ${s.title} (series_id: ${id}) — research context, batch 18 (standing tier), wave ${wave}`);
    lines.push(`Target episodes (OUR cumulative numbering): ${range}.`);
    lines.push(`ASK: ${ask}`);
    lines.push('');
    lines.push('## The source — standing is relative to THIS');
    lines.push(`source kind = ${s.source_type ?? 'UNRULED (null)'} (${kind?.noun ?? '?'}; instrument unit = ${kind?.unit ?? '?'}). AFL's "anime canon" on this kind defaults to ${aflAnimeCanonStanding(s.source_type)} under T27 — that default is what the target rows carry now; your verdict replaces it.`);
    lines.push(`manga/publication link: AniList ${s.manga_anilist_id ?? 'none'} (status ${s.manga_status}), total_chapters=${s.total_chapters} latest_known=${s.latest_known_chapters} total_volumes=${s.total_volumes}`);
    lines.push('');
    lines.push('## Entry facts');
    lines.push(`status=${s.status} aired_episodes=${s.aired_episodes} total_episodes=${s.total_episodes} mapping_mode=${s.mapping_mode}; AniList anime id=${s.anilist_id} (MAL ${s.mal_id})`);
    lines.push(`Components (season_order: anilist_id episodes [kind] label): ${comps.map((c) => `${c.season_order}: ${c.anilist_id} ${c.episode_start ?? 'null'}-${c.episode_end ?? 'null'} [${c.kind}] ${c.label ?? ''}`).join(' | ') || 'none'}`);
    const rul: string[] = [];
    if (EPISODE_TYPE_OVERRIDES[id]) rul.push(`EPISODE_TYPE_OVERRIDES (T6, ruled — a verdict that contradicts one is a REPAIR with evidence): ${JSON.stringify(EPISODE_TYPE_OVERRIDES[id])}`);
    if (SOURCE_NUMBERING_SHIFTS[id]) rul.push(`SOURCE_NUMBERING_SHIFTS: ${JSON.stringify(SOURCE_NUMBERING_SHIFTS[id])}`);
    if (STANDING_ANNOTATIONS[id]) rul.push(`STANDING_ANNOTATIONS (T26): ${STANDING_ANNOTATIONS[id].map((a) => `${a.kind}${a.basis ? `{${a.basis}}` : ''} eps ${a.episodes.length > 12 ? `${a.episodes[0]}-${a.episodes[a.episodes.length - 1]} (${a.episodes.length})` : a.episodes.join(',')}`).join('; ')}`);
    lines.push(`Rulings in code: ${rul.join(' · ') || 'none'}`);
    lines.push('');
    // group identical annotation records (a T26 block is one fact over many rows)
    const grouped = new Map<string, number[]>();
    for (const a of ann) {
      const k = `${a.kind}${a.basis ? `{${a.basis}}` : ''}${a.chapters ? ` {${a.chapters}}` : ''}: ${(a.note ?? '').slice(0, 220)}`;
      if (!grouped.has(k)) grouped.set(k, []);
      grouped.get(k)!.push(a.episode);
    }
    lines.push(`## Existing annotations (${ann.length} rows, ${grouped.size} facts)`);
    lines.push([...grouped].map(([k, eps2]) => `eps ${eps2.length > 8 ? `${eps2[0]}-${eps2[eps2.length - 1]} (${eps2.length})` : eps2.join(',')} ${k}`).join('\n') || 'none');
    lines.push('');
    lines.push(`## Anchors bracketing the block (${anchors.length} total) — ep→END chapter [start] {chapters_adapted} vol (source)`);
    lines.push(anchors.filter((a) => near(a.episode)).map((a) => `ep${a.episode}→${a.chapter}${a.start_chapter != null ? ` [${a.start_chapter}]` : ''}${a.chapters_adapted ? ` {${a.chapters_adapted}}` : ''}${a.volume != null ? ` v${a.volume}` : ''} (${a.source})`).join('\n') || 'none near the block');
    lines.push('');
    // the TARGET rows are the ones AFL calls anime canon inside the range —
    // the rest of the range is orientation (already adapting, already ruled)
    // wave 1 ranges are broad (arcs) → only AFL's anime-canon rows inside them;
    // waves 2-3 name their rows exactly (T6-ruled A-7 blocks, single rows)
    const isTarget = (e: any) => inRange(e.number) && (wave !== 1 || aflClaim.get(e.number) === 'anime canon');
    const targets = eps.filter(isTarget);
    lines.push(`## TARGET rows (${targets.length}) — number [stored standing | AFL's claim] title (air_date)   ← every row here needs a standings entry`);
    lines.push(targets.map((e) => `${e.number} [${e.type} | AFL: ${aflClaim.get(e.number)}] ${e.title || '(no title)'}${e.air_date ? ` (${e.air_date})` : ''}`).join('\n') || 'no target rows in range');
    lines.push('');
    lines.push(`## Other rows in / near the range (orientation only — do not re-judge unless you find a repair)`);
    lines.push(eps.filter((e) => near(e.number) && !isTarget(e)).map((e) => `${e.number} [${e.type} | AFL: ${aflClaim.get(e.number) ?? '—'}] ${e.title || '(no title)'}`).join('\n') || 'none');
    const file = `${OUT}/${id}${TARGETS.filter((t) => t[0] === id).length > 1 ? `-${range.split('-')[0]}` : ''}.md`;
    writeFileSync(file, lines.join('\n'));
    index.push(`wave ${wave}  ${id} ${range} — ${targets.length} target rows, kind ${s.source_type}`);
  }
  console.log(index.join('\n'));
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
