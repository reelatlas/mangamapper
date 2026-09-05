// Decision (d) of the extras sitting (Sean 2026-09-05): the other-instrument related works — each adapts a RUN of
// its own (a manga / novel that is not the owner's instrument) — as the INPUT LIST for step 2 (films as entries:
// the one-row series mint, I13's films ruling). This read fetches the adapted node's facts from AniList (format,
// chapters, volumes, status, popularity) so the pick is made on evidence, marks runs the catalog already holds as
// an instrument, and PROPOSES a pick under the threshold Sean set: the run has a chapter run of its own (a volume,
// or 8+ chapters, or still releasing) and the work is that run's adaptation. A one-shot is a tie-in, never a series.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/other-instrument-picks.ts
import { mangaByIds } from '../../lib/anilist';
import { haloCandidates, loadDiscoveryInput } from '../../lib/discovery';
import { adaptedNodes } from '../../lib/related-works';
import { FRANCHISE_OF } from '../../lib/rulings/franchises';

type Node = { id: number; title: { romaji: string | null; english: string | null }; format: string | null; status: string | null; chapters: number | null; volumes: number | null; popularity: number | null; startDate?: { year?: number | null } | null };
const slugify = (t: string) => t.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function main() {
  const input = await loadDiscoveryInput();
  const works = haloCandidates(input).filter((c) => c.proposal === 'other_instrument' || c.proposal === 'alternative'); // an alternative adaptation that adapts an instrument is the same shape (GitS 1995)
  const ownedInstrument = new Map<number, string>();
  for (const [sid, ids] of input.ownerInstruments ?? []) for (const id of ids) ownedInstrument.set(id, sid);
  const nodeIds = [...new Set(works.flatMap((c) => adaptedNodes((input.staged.get(c.anilistId) as never) ?? null).map((n) => n.id)))];
  const nodes = new Map<number, Node>();
  // the staged edges already carry the node's format / status / popularity (no chapters or volumes) — the fallback when AniList is down (P6: say so, never guess)
  type Edge = { relationType: string; node: { id: number; type: string; format?: string | null; status?: string | null; popularity?: number | null; chapters?: number | null; volumes?: number | null; startDate?: { year?: number | null } | null; title: { romaji: string | null; english?: string | null } } };
  for (const c of works) for (const e of (((input.staged.get(c.anilistId) as { relations?: { edges: Edge[] } | null } | undefined)?.relations?.edges) ?? [])) if (e.node.type === 'MANGA' && !nodes.has(e.node.id)) nodes.set(e.node.id, { id: e.node.id, title: { romaji: e.node.title.romaji, english: e.node.title.english ?? null }, format: e.node.format ?? null, status: e.node.status ?? null, chapters: e.node.chapters ?? null, volumes: e.node.volumes ?? null, popularity: e.node.popularity ?? null, startDate: e.node.startDate ?? null });
  let outage: string | null = null;
  try { for (const n of (await mangaByIds(nodeIds)) as Node[]) nodes.set(n.id, n); } catch (e) { outage = String(e).split('\n')[0].slice(0, 120); }
  console.log(`### Other-instrument picks — ${works.length} works adapting ${nodeIds.length} runs (${outage ? `AniList UNAVAILABLE (${outage}) — staged edge facts only (format / status / chapters / volumes / popularity as staged; no start dates, so a run that began AFTER the work — a comicalization — cannot be flagged yet); re-run when the API is back` : `AniList facts fetched ${new Date().toISOString().slice(0, 10)}`})\n`);
  console.log('| owner | work (anilist · format · year) | adapts (anilist) | run: format · status · ch/vol · pop | ours? | proposed | slug · franchise (if minted) | decision |');
  console.log('|---|---|---|---|---|---|---|---|');
  const rows: { pop: number; line: string }[] = [];
  for (const c of works) {
    const media = (input.staged.get(c.anilistId) as { startDate?: { year?: number | null } | null } | undefined);
    const owners = [...c.owners];
    const groups = [...new Set(owners.map((o) => FRANCHISE_OF[o] ?? o))];
    for (const a of adaptedNodes((input.staged.get(c.anilistId) as never) ?? null)) {
      const n = nodes.get(a.id);
      const ours = ownedInstrument.get(a.id);
      const run = n ? `${n.format ?? '?'} · ${n.status ?? '?'} · ${n.chapters ?? '?'}/${n.volumes ?? '?'} · ${n.popularity ?? 0}` : 'not on AniList?';
      const counted = n != null && (n.chapters != null || n.volumes != null);
      const isRun = n && (n.format === 'MANGA' || n.format === 'NOVEL') && (counted ? (n.volumes ?? 0) >= 1 || (n.chapters ?? 0) >= 8 || n.status === 'RELEASING' : true); // uncounted (API down): a MANGA / NOVEL run is proposed, the count is checked at the mint
      const workYear = media?.startDate?.year ?? null, runYear = n?.startDate?.year ?? null;
      const downstream = workYear != null && runYear != null && runYear > workYear; // the run began after the work: a comicalization / novelization, never the work's source
      const alt = c.proposal === 'alternative';
      // an alternative telling of the OWNER's own instrument (GitS 1995 beside SAC, Hellsing Ultimate, the Madoka / AoT / JJK compilation films) is not a
      // mechanical mint: a retelling is a series of its own (Sean ruled GitS 1995 a mint candidate), a compilation is a recap — research or Sean decides
      const ownTelling = alt && [...c.owners].some((o) => (input.ownerInstruments?.get(o) ?? new Set()).has(a.id));
      const proposed = ownTelling ? `alternative telling of ${[...c.owners].join('+')}'s own instrument — a retelling (a mint, Sean's call) or a compilation (a recap): research decides` : downstream ? `NOT a source — the run began ${runYear}, after the work (${workYear}): a comicalization / novelization; the work is held (research)` : ours ? `no mint — the run is ${ours}'s instrument (a same-instrument row there)` : a.format === 'ONE_SHOT' ? 'tie-in — never a series; research with (b)' : isRun ? `MINT (step 2): ${alt ? 'an alternative adaptation (I16) — ' : ''}a one-row staged series, this work as its anime${counted ? '' : ' (size unverified — AniList down)'}` : n ? 'hold — below the threshold (no volume, < 8 chapters, finished)' : 'hold — node not found';
      const title = n?.title.english ?? n?.title.romaji ?? a.title ?? String(a.id);
      const slug = isRun && !ours ? `${slugify(title)} · ${groups[0]}` : '';
      rows.push({ pop: c.popularity, line: `| ${groups.join(' + ')} | ${c.title.replace(/\|/g, '/')} (${c.anilistId} · ${c.format ?? '?'} · ${media?.startDate?.year ?? '?'}) | ${(a.title ?? '').replace(/\|/g, '/')} (${a.id}) | ${run} | ${ours ?? '—'} | ${proposed} | ${slug} | |` });
    }
  }
  if (process.argv.includes('--declare')) {
    // the signed picks as CANDIDATE_ENTRIES (lib/rulings/discovery.ts) — declarations; the MINT is step 2's writer, run from /discover
    console.log('\n// ---- decision (d) declarations (Sean signed 2026-09-05; the mint is step 2) ----');
    for (const r of rows.filter((x) => x.line.includes('| MINT'))) {
      const m = r.line.match(/^\| (.+?) \| (.+?) \((\d+) · (\w+) · (\S+)\) \| (.+?) \((\d+)\) \| (.+?) \| .+? \| (.+?) \| (\S+) · (\S+) \|/);
      if (!m) continue;
      const [, group, work, animeId, format, year, run, runId, facts, , slug, franchise] = m;
      console.log(`  { seriesId: 'anilist:${animeId}', ruleId: 'I13', value: { disposition: 'series', slug: '${slug}', franchise: '${franchise}' },\n    reason: "Decision (d) of the extras sitting (Sean 2026-09-05): ${work.replace(/"/g, "'")} (${format} ${year}) adapts ${run.replace(/"/g, "'")} (AniList manga ${runId}: ${facts}) — a run of its own; under the films ruling (I13) the work becomes a one-row staged series with that run as its instrument; its halo row stays the related work of ${group}. Mint: step 2's writer, from /discover.",\n    ruledBy: 'Sean', ruledOn: '2026-09-05', cite: ['scripts/ingest/research/discovery/EXTRAS-SITTING.md §0 (d)'] },`);
    }
    return;
  }
  for (const r of rows.sort((x, y) => y.pop - x.pop)) console.log(r.line);
  const mint = rows.filter((r) => r.line.includes('| MINT')).length, tie = rows.filter((r) => r.line.includes('tie-in —')).length, ours = rows.filter((r) => r.line.includes('no mint —')).length, hold = rows.filter((r) => r.line.includes('| hold')).length;
  console.log(`\nproposed: MINT ${mint} · tie-in ${tie} · already ours ${ours} · hold ${hold}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
