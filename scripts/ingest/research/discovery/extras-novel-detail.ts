// held related works that carry a NOVEL / ONE_SHOT adaptation edge: the owner's registered
// instrument node vs the nodes the extra actually adapts — the read behind the T25 instrument-set
// question (does the owner's own anime name its light-novel node?).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/extras-novel-detail.ts
import { haloCandidates, loadDiscoveryInput } from '../../lib/discovery';
import { selectAll } from '../../lib/db';
type Edge = { relationType: string; node: { id: number; type: string; format?: string | null; title?: { romaji?: string | null } } };
async function main() {
  const input = await loadDiscoveryInput();
  const series = new Map((await selectAll<{ id: string; anilist_id: number | null; source_type: string | null; manga_anilist_id: number | null }>('series', 'id, anilist_id, source_type, manga_anilist_id')).map((s) => [s.id, s]));
  const cands = haloCandidates(input).filter((c) => c.proposal === 'unknown');
  const ownerNodes = (sid: string) => {
    const s = series.get(sid); const m = s?.anilist_id != null ? (input.staged.get(s.anilist_id) as { relations?: { edges: Edge[] } | null } | undefined) : undefined;
    return (m?.relations?.edges ?? []).filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA').map((e) => `${e.node.id}:${e.node.format}`).join(' ');
  };
  for (const c of cands) {
    const m = input.staged.get(c.anilistId) as { source?: string | null; relations?: { edges: Edge[] } | null } | undefined;
    const adapt = (m?.relations?.edges ?? []).filter((e) => e.relationType === 'ADAPTATION' && e.node.type === 'MANGA');
    if (!adapt.length) continue;
    for (const sid of c.owners) {
      const s = series.get(sid);
      console.log(`${sid} [${s?.source_type}] instrument=${s?.manga_anilist_id} chain=[${(input.chainWorks?.get(sid) ?? []).join(',')}] owner-anime-adaptations=[${ownerNodes(sid)}]`);
      console.log(`    ← ${c.title} (${c.format}, source ${m?.source}) adapts ${adapt.map((e) => `${e.node.id}:${e.node.format} "${e.node.title?.romaji ?? ''}"`).join(' | ')}`);
    }
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
