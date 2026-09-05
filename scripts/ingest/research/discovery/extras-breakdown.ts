// the HELD bucket of the related-works ledger (I45), broken down — a read for the sitting:
// what AniList says the held work is based on, whether any ADAPTATION edge lands on the
// owner's instrument node (series.manga_anilist_id or a chain work, I41), the owner's T25
// source, and how many ledger pairs already sit on a wiki watch-order list.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/extras-breakdown.ts
import { haloCandidates, loadDiscoveryInput } from '../../lib/discovery';
import { selectAll } from '../../lib/db';

type Edge = { relationType: string; node: { id: number; type: string; format?: string | null } };
const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

async function main() {
  const input = await loadDiscoveryInput();
  const series = new Map((await selectAll<{ id: string; source_type: string | null }>('series', 'id, source_type')).map((s) => [s.id, s.source_type]));
  const wiki = await selectAll<{ series_id: string; title: string }>('watch_order_entries', 'series_id, title', (q) => q.eq('origin', 'wiki'));
  const wikiBy = new Map<string, Set<string>>();
  for (const w of wiki) { const s = wikiBy.get(w.series_id) ?? new Set<string>(); s.add(norm(w.title)); wikiBy.set(w.series_id, s); }
  const cands = haloCandidates(input).filter((c) => c.bucket === 'extra' || c.bucket === 'recap' || c.bucket === 'crossover');
  const agg = new Map<string, number>(); const bump = (k: string) => agg.set(k, (agg.get(k) ?? 0) + 1);
  const byBucket = new Map<string, number>();
  let onWiki = 0, pairs = 0; const wikiHits: string[] = [];
  for (const c of cands) {
    const m = input.staged.get(c.anilistId) as { source?: string | null; relations?: { edges: Edge[] } | null } | undefined;
    for (const sid of c.owners) {
      pairs++;
      const titles = wikiBy.get(sid);
      const t = norm(c.title);
      if (titles && [...titles].some((w) => w === t || w.includes(t) || t.includes(w))) { onWiki++; wikiHits.push(`${sid}: ${c.title} [${c.proposal}]`); }
    }
    byBucket.set(c.proposal, (byBucket.get(c.proposal) ?? 0) + 1);
    if (c.proposal !== 'unknown') continue;
    const edges = m?.relations?.edges ?? [];
    const adapt = edges.filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA');
    const owners = [...c.owners];
    const instr = new Set(owners.flatMap((o) => [input.ownerManga.get(o) ?? -1, ...(input.chainWorks?.get(o) ?? [])]));
    const hitsOwner = adapt.some((e) => instr.has(e.node.id));
    const fmts = [...new Set(adapt.map((e) => e.node.format ?? '?'))].sort().join('+') || 'none';
    const otype = [...new Set(owners.map((o) => series.get(o) ?? 'null'))].sort().join('+');
    bump(`source=${m?.source ?? 'null'} | adaptation-edges=${fmts} | on-owner-instrument=${hitsOwner} | owner-source=${otype}`);
  }
  console.log(`works ${cands.length} · owner pairs ${pairs} · pairs on a wiki watch-order list ${onWiki}`);
  console.log('by bucket:', [...byBucket].sort().map(([k, v]) => `${k}=${v}`).join(' '));
  console.log('\nHELD (unknown) — what AniList says:');
  for (const [k, v] of [...agg].sort((a, b) => b[1] - a[1])) console.log(String(v).padStart(4), k);
  console.log('\non a wiki list:'); for (const h of wikiHits) console.log('  ' + h);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
