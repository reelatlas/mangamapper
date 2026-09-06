// THE RELATED-WORKS RESEARCH CONTEXT (I45's ruling layer; Sean ruled (b)/(c) 2026-09-05; PROTOCOL-extras.md).
// One markdown context per (owner, work) — the OWNER (instrument, chapter space), the WORK (AniList facts,
// relations, what it adapts), the STORED ledger row, the episode GRID around the position with its anchors,
// any existing ruling, and the ask — or, in triage mode, one context per OWNER listing its held works.
// Contexts capture CURRENT stored state: regenerate per session, write them to the scratchpad, never the repo.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/extras-context.ts <outdir> [--targets films|ovas|same|triage|owner:<id>|ids:<a,b>] [--limit N] [--list]
//   --targets films (default): same-instrument MOVIEs, popularity order — wave 1 · ovas: OVA / SPECIAL · same: all same-instrument
//   --targets triage: one context per owner of HELD works (the top owners first) · owner:<id>: every pending work of one owner · ids: explicit AniList ids
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { selectAll } from '../../lib/db';
import { haloCandidates, loadDiscoveryInput, type Candidate } from '../../lib/discovery';
import { adaptedNodes, isoDate } from '../../lib/related-works';
import { FRANCHISE_OF } from '../../lib/rulings/franchises';
import { relatedWorkRuling } from '../../lib/rulings/related-works';

const arg = (k: string): string | null => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const OUT = process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : '/tmp/extras-ctx';
const targets = arg('--targets') ?? 'films';
const limit = Number(arg('--limit') ?? 8);
const listOnly = process.argv.includes('--list');

type Media = { format?: string | null; status?: string | null; source?: string | null; episodes?: number | null; duration?: number | null; description?: string | null; startDate?: { year?: number | null; month?: number | null; day?: number | null } | null; title?: { romaji?: string | null; english?: string | null; native?: string | null }; relations?: { edges: { relationType: string; node: { id: number; type: string; format?: string | null; title: { romaji: string | null } } }[] } | null };
type Series = { id: string; title: string; title_english: string | null; source_type: string | null; manga_anilist_id: number | null; latest_known_chapters: number | null; total_chapters: number | null; max_adapted_chapter: number | null; manga_status: string | null; total_episodes: number | null; aired_episodes: number | null };
type Ep = { number: number; title: string | null; air_date: string | null; type: string | null };
type Anchor = { episode: number; chapter: number | null; start_chapter: number | null; chapters_adapted: string | null; continue_chapter: number | null };
type Row = { position: number; air_date?: string | null; standing: string | null; kind: string | null; note: string | null; chapter: number | null; chapters_adapted: string | null; display_label: string | null; origin: string | null };

const strip = (html: string | null | undefined) => (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 900);

async function main() {
  const input = await loadDiscoveryInput();
  const all = haloCandidates(input).filter((c) => c.bucket === 'extra' || c.bucket === 'recap' || c.bucket === 'crossover');
  const series = new Map((await selectAll<Series>('series', 'id, title, title_english, source_type, manga_anilist_id, latest_known_chapters, total_chapters, max_adapted_chapter, manga_status, total_episodes, aired_episodes')).map((s) => [s.id, s]));
  const rows = await selectAll<Row & { series_id: string; anilist_id: number | null; title: string | null }>('watch_order_entries', 'series_id, anilist_id, position, standing, kind, note, chapter, chapters_adapted, display_label, origin, title, air_date');
  const rowOf = new Map(rows.filter((r) => r.anilist_id != null).map((r) => [`${r.series_id}#${r.anilist_id}`, r]));
  const year = (c: Candidate) => (input.staged.get(c.anilistId) as Media | undefined)?.startDate?.year ?? null;

  // ---- triage mode: one context per owner of held works
  if (targets === 'triage') {
    const held = all.filter((c) => c.proposal === 'unknown');
    const byOwner = new Map<string, Candidate[]>();
    for (const c of held) for (const o of c.owners) byOwner.set(o, [...(byOwner.get(o) ?? []), c]);
    const owners = [...byOwner.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, limit);
    if (listOnly) { console.log('| owner | held works | the shelf |'); console.log('|---|---|---|'); for (const [o, l] of owners) console.log(`| ${o} | ${l.length} | ${l.sort((a, b) => b.popularity - a.popularity).slice(0, 6).map((c) => c.title).join('; ')}${l.length > 6 ? '; …' : ''} |`); return; }
    mkdirSync(OUT, { recursive: true });
    for (const [o, list] of owners) {
      const s = series.get(o);
      const lines = [`# TRIAGE context — ${o} (${list.length} held related works) — generated ${new Date().toISOString().slice(0, 10)}`, '', `## THE ASK`, `Of these ${list.length} works AniList tags with a source but names no chapters for, which adapt the owner's instrument AT ALL? One entry per work: yes / no / unclear, the chapters when yes, two sources each. Output: ONE JSON per owner (PROTOCOL-extras.md, TRIAGE shape) at the path in your task.`, '', ...ownerBlock(s, o), '', `## THE WORKS (popularity order)`];
      for (const c of list.sort((a, b) => b.popularity - a.popularity)) {
        const m = input.staged.get(c.anilistId) as Media | undefined;
        const row = rowOf.get(`${o}#${c.anilistId}`);
        lines.push(`- anilist ${c.anilistId} · **${c.title}** · ${c.format ?? '?'} · ${isoDate(m?.startDate) ?? 'undated'} · AniList source ${m?.source ?? 'null'} · reached by ${[...c.relations].join('/')} · stored ${row ? `@${row.position} kind ${row.kind ?? '?'} standing ${row.standing ?? 'pending'}` : 'no row (undated)'}${m?.description ? ` · "${strip(m.description).slice(0, 240)}"` : ''}`);
      }
      writeFileSync(join(OUT, `triage__${o}.md`), lines.join('\n') + '\n');
      console.log(`  wrote triage__${o}.md (${list.length} works)`);
    }
    return;
  }

  // ---- per-work modes
  let picked = all.filter((c) => c.proposal === 'same_instrument');
  if (targets === 'films') picked = picked.filter((c) => c.format === 'MOVIE');
  else if (targets === 'ovas') picked = picked.filter((c) => c.format === 'OVA' || c.format === 'SPECIAL');
  else if (targets.startsWith('owner:')) { const o = targets.slice(6); picked = all.filter((c) => c.owners.has(o) && (c.proposal === 'same_instrument' || c.proposal === 'other_instrument' || c.proposal === 'unknown')); }
  else if (targets.startsWith('ids:')) { const ids = new Set(targets.slice(4).split(',').map(Number)); picked = all.filter((c) => ids.has(c.anilistId)); }
  // R27 — the work-list is the UNRULED rows (a standing already set leaves the queue; `related_work_unruled` is the census twin); explicit ids: / owner: modes keep everything
  if (!targets.startsWith('ids:') && !targets.startsWith('owner:')) picked = picked.filter((c) => [...c.owners].some((o) => !rowOf.get(`${o}#${c.anilistId}`)?.standing));
  picked = picked.sort((a, b) => b.popularity - a.popularity).slice(0, limit);
  if (listOnly) {
    console.log(`| # | owner | work | anilist | format · year | stored position | popularity |`); console.log('|---|---|---|---|---|---|---|');
    let i = 0;
    for (const c of picked) for (const o of c.owners) { const row = rowOf.get(`${o}#${c.anilistId}`); console.log(`| ${++i} | ${o} | ${c.title} | ${c.anilistId} | ${c.format ?? '?'} · ${year(c) ?? '?'} | ${row ? `@${row.position} (${row.kind ?? '?'}, ${row.standing ?? 'pending'})` : 'none (undated)'} | ${c.popularity} |`); }
    return;
  }
  mkdirSync(OUT, { recursive: true });
  for (const c of picked) {
    const m = input.staged.get(c.anilistId) as Media | undefined;
    for (const o of c.owners) {
      const s = series.get(o); if (!s) continue;
      const row = rowOf.get(`${o}#${c.anilistId}`);
      const eps = (await selectAll<Ep>('episodes', 'number, title, air_date, type', (q) => q.eq('series_id', o))).sort((a, b) => a.number - b.number);
      const anchors = new Map((await selectAll<Anchor>('chapter_anchors', 'episode, chapter, start_chapter, chapters_adapted, continue_chapter', (q) => q.eq('series_id', o))).map((a) => [a.episode, a]));
      const pos = row ? Number(row.position) : null;
      const around = pos == null ? eps.slice(-6) : eps.filter((e) => e.number >= Math.floor(pos) - 4 && e.number <= Math.floor(pos) + 3);
      const adapts = adaptedNodes(m as never);
      const ruling = relatedWorkRuling(o, c.anilistId);
      const lines = [
        `# Related-work context — ${o} × anilist ${c.anilistId} "${c.title}" — generated ${new Date().toISOString().slice(0, 10)}`, '',
        `## THE ASK`,
        `Standing of this work relative to ${o}'s instrument (T25 / T28), the CHAPTERS it adapts in that instrument's printed numbering, and the POSITION verdict (stored ${pos ?? 'none — undated'}: confirm or correct). Two sources. Output: ONE JSON (PROTOCOL-extras.md, PER WORK shape) at the path in your task.`, '',
        ...ownerBlock(s, o), '',
        `## THE WORK (AniList ${c.anilistId})`,
        `- title: ${c.title}${m?.title?.native ? ` · ${m.title.native}` : ''}`,
        `- format ${c.format ?? '?'} · status ${m?.status ?? '?'} · aired ${isoDate(m?.startDate) ?? 'undated'} · episodes ${m?.episodes ?? '?'} · duration ${m?.duration ?? '?'} min · AniList source tag ${m?.source ?? 'null'}`,
        `- reached the owner by: ${[...c.relations].join('/')}${c.hop > 1 ? ` (hop ${c.hop} via ${c.via})` : ''}`,
        `- adapts per AniList edges: ${adapts.length ? adapts.map((n) => `${n.title ?? n.id} (${n.id}, ${n.format ?? '?'})`).join('; ') : 'no instrument node named'}`,
        `- other relations: ${(m?.relations?.edges ?? []).filter((e) => e.relationType !== 'ADAPTATION').map((e) => `${e.relationType} → ${e.node.title.romaji ?? e.node.id} (${e.node.type}${e.node.format ? ' ' + e.node.format : ''})`).join('; ') || 'none'}`,
        m?.description ? `- AniList synopsis: "${strip(m.description)}"` : '- AniList synopsis: none', '',
        `## STORED LEDGER ROW (watch_order_entries, origin ${row?.origin ?? '—'})`,
        // P29 (the Food Wars verifier, 2026-09-06 — the second sighting after Noragami): the stored AIR DATE is printed so a wrong AniList date is a repair the author can see (RelatedWorkRuling.airDate), not one the verifier finds
        row ? `- position ${row.position} · kind ${row.kind ?? '?'} · standing ${row.standing ?? 'PENDING'} · chapter ${row.chapter ?? '—'} · chapters_adapted ${row.chapters_adapted ?? '—'} · air_date ${row.air_date ?? '—'} (a wrong AniList date is an airDate repair) · label ${row.display_label ?? '(unsurfaced)'}\n- note: ${row.note ?? ''}` : '- no row: the work has no air date on AniList, so no position was derived (listed, never slotted)', '',
        // P29 (the Noragami verifier, 2026-09-06): a proposed position must SEE the slots the owner's other rows hold — the writer refuses a ruled
        // move onto a held slot (planRuledMoves), so a story-slot proposal that collides is a cluster ruling, never a lone value
        `## THE OWNER'S OTHER LEDGER ROWS (the slots held today — a proposed position that collides is a CLUSTER ruling)`,
        ...(rows.filter((r) => r.series_id === o && r.anilist_id !== c.anilistId).sort((a, b) => a.position - b.position).map((r) => `- @${r.position} · ${r.kind ?? '?'} · ${r.standing ?? 'PENDING'} · anilist ${r.anilist_id ?? '—'} · ${String(r.title ?? '').slice(0, 60)}`)),
        '',
        `## EXISTING RULING (lib/rulings/related-works.ts)`, ruling ? `- ${JSON.stringify(ruling)}` : '- none — this verdict creates it', '',
        `## THE GRID AROUND THE POSITION (our episode rows; anchors are the instrument's chapters)`,
        '| ep | date | type | title | anchor (start–chapter · adapted · continue) |', '|---|---|---|---|---|',
        ...around.map((e) => { const a = anchors.get(e.number); return `| ${e.number}${pos != null && e.number === Math.floor(pos) ? ' ◀ the work sits after this row' : ''} | ${e.air_date ?? ''} | ${e.type ?? ''} | ${(e.title ?? '').replace(/\|/g, '/')} | ${a ? `${a.start_chapter ?? '?'}–${a.chapter ?? '?'} · ${a.chapters_adapted ?? ''} · ${a.continue_chapter ?? ''}` : ''} |`; }),
        '', `Owner's run: ${eps.length} rows${eps.length ? ` (ep ${eps[0].number} ${eps[0].air_date ?? '?'} → ep ${eps[eps.length - 1].number} ${eps[eps.length - 1].air_date ?? '?'})` : ''}.`,
        (() => { const last = [...anchors.values()].filter((x) => x.chapter != null).sort((x, y) => y.episode - x.episode)[0]; return last ? `The run's HONEST TERMINAL (the last anchored row): ep ${last.episode} → END ch ${last.chapter}${last.continue_chapter != null ? ` · continue ${last.continue_chapter}` : ''} — rows after it carry no chapter; a work continuing the run starts after ch ${last.chapter}.` : 'The run carries no chapter anchors (a novel owner, or an unanchored run) — the position rests on dates and content.'; })(),
      ];
      const file = `${o}__${c.anilistId}.md`;
      writeFileSync(join(OUT, file), lines.join('\n') + '\n');
      console.log(`  wrote ${file}`);
    }
  }
  console.log(`[extras-context] ${picked.length} work(s) → ${OUT}`);
}

function ownerBlock(s: Series | undefined, o: string): string[] {
  if (!s) return [`## THE OWNER — ${o} (not in canonical?)`];
  return [
    `## THE OWNER — ${s.id}${FRANCHISE_OF[s.id] ? ` (franchise ${FRANCHISE_OF[s.id]})` : ''}`,
    `- ${s.title}${s.title_english ? ` / ${s.title_english}` : ''} · source_type ${s.source_type ?? '?'} · instrument node (AniList manga id) ${s.manga_anilist_id ?? 'none registered (a novel owner: the NOVEL node its anime adapts)'}`,
    `- chapter space: latest known ${s.latest_known_chapters ?? '?'} · total ${s.total_chapters ?? '?'} · max adapted by the run ${s.max_adapted_chapter ?? '?'} · manga ${s.manga_status ?? '?'} · episodes ${s.aired_episodes ?? '?'} / ${s.total_episodes ?? '?'}`,
    `- standing vocabulary: canon = adapts THIS instrument's chapters · mixed = a substantial share does (T28) · filler = none of it (an original, a recap, a promo)`,
  ];
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
