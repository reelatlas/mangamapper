// THE SITTING RECAP (I42; Sean's chat-checkpoint rule, 2026-08-28 → 2026-09-05):
// the discovery analogue of research/batchN/baseline.ts — GENERATED from the
// database + the derivation (P5, it cannot drift), one line per candidate,
// STORED state first, then the proposal with its signals, then a decision
// column for Sean; a table per franchise (I43) where the owner has one, else per owner, the
// default-disposed rows in one summary line after it. Paste the output into
// the chat message — never point Sean at a file for the baseline.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts [--scope sequel,series|extras|all|seed] [--airing] [--owner <series-id>] [--limit N]
import { haloCandidates, loadDiscoveryInput, IGNORED_RELATIONS, type Candidate } from '../../lib/discovery';
import { FRANCHISE_OF } from '../../lib/rulings/franchises';
import { loadLatestRankings, seedCandidates } from '../../lib/rankings';

const arg = (k: string): string | null => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const scope = (arg('--scope') ?? 'sequel').split(',');
const airing = process.argv.includes('--airing');
const owner = arg('--owner');
const limit = Number(arg('--limit') ?? 400);

async function main() {
  const input = await loadDiscoveryInput();
  if (scope.includes('seed')) {
    // G60 — the seed table: new IPs from the ranked lists, franchise-shaped (none has a franchise: a relation to the catalog would make it the halo's)
    const all = haloCandidates(input);
    const seeds = seedCandidates(await loadLatestRankings(), new Set(input.owned.keys()), new Set(all.map((c) => c.anilistId))).slice(0, limit);
    console.log(`### Seed sitting recap — ${seeds.length} new IPs from the latest ranked snapshots (generated ${new Date().toISOString().slice(0, 10)})\n`);
    console.log('| anilist | title | format · status · year | lists · ranks | score (factors) | source · manga | proposed | decision |');
    console.log('|---|---|---|---|---|---|---|---|');
    for (const s of seeds) console.log(`| ${s.anilistId} | ${s.title.replace(/\|/g, '/')} | ${s.format ?? '?'} · ${s.status ?? '?'} · ${s.year ?? ''} | ${s.lists.map((l) => `${l.list} #${l.rank}`).join(', ')} | ${s.score}${s.factors.length ? ` (${s.factors.join('; ')})` : ''} | ${s.source ?? '?'} · ${s.manga ? `${s.manga.id} ${s.manga.status ?? ''}${s.manga.chapters ? ` ${s.manga.chapters} ch` : ''}` : 'no manga edge'} | **new IP, series**${s.headId ? ` (head = prequel ${s.headId})` : ''}${s.viaManga ? ' (via manga-first)' : ''} | |`);
    return;
  }
  if (scope.includes('extras')) {
    // I45 — the related-works sitting table: every recap / special / OVA / film of an owned series, by franchise, with the bucket a rule
    // decided, the standing it implies, the derived position, and the decision column (surface? research? a series?)
    const ex = haloCandidates(input).filter((c) => c.bucket === 'extra' || c.bucket === 'recap' || c.bucket === 'crossover').filter((c) => !owner || c.owners.has(owner)).slice(0, limit);
    const groups = new Map<string, typeof ex>();
    for (const c of ex) { const k = [...new Set([...c.owners].map((x) => (FRANCHISE_OF[x] ? `franchise ${FRANCHISE_OF[x]}` : x)))].sort().join(' + '); groups.set(k, [...(groups.get(k) ?? []), c]); }
    console.log(`### Related-works sitting recap — ${ex.length} works over ${groups.size} franchises / owners (generated ${new Date().toISOString().slice(0, 10)})\n`);
    for (const [g, list] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`**${g}** (${list.length})\n`);
      console.log('| anilist | title | format · date | relation | bucket (rule) | standing | proposed | decision |');
      console.log('|---|---|---|---|---|---|---|---|');
      for (const c of list.sort((a, b) => b.popularity - a.popularity)) {
        const m = input.staged.get(c.anilistId) as { startDate?: { year?: number | null } } | undefined;
        const b = c.proposal;
        const standing = b === 'recap' || b === 'original' || b === 'crossover' ? 'filler (rule)' : b === 'unstaged' ? '—' : 'pending';
        const proposed = b === 'same_instrument' ? 'research standing + chapters; surface when ruled' : b === 'other_instrument' ? 'a series candidate (seed) + a related work' : b === 'recap' ? 'ledger row, kind recap — surface only by label' : b === 'original' ? 'ledger row — optional viewing; surface only by label' : b === 'crossover' ? 'ledger row (unfetched) — listed' : b === 'unknown' ? 'HOLD: source with no manga edge' : 'stage first';
        console.log(`| ${c.anilistId} | ${c.title.replace(/\|/g, '/')} | ${c.format ?? '?'} · ${m?.startDate?.year ?? '?'} | ${[...c.relations].join('/')} | **${b}** | ${standing} | ${proposed} | |`);
      }
      console.log('');
    }
    return;
  }
  let cands = haloCandidates(input).filter((c) => c.bucket !== 'ignored');
  if (!scope.includes('all')) cands = cands.filter((c) => scope.includes(c.bucket));
  if (airing) cands = cands.filter((c) => c.status === 'RELEASING' || c.status === 'NOT_YET_RELEASED');
  if (owner) cands = cands.filter((c) => c.owners.has(owner));
  cands = cands.slice(0, limit);
  const byOwner = new Map<string, Candidate[]>();
  // a table per FRANCHISE (I43) where the owner has one, else per owner
  for (const c of cands) { const o = [...new Set([...c.owners].map((x) => (FRANCHISE_OF[x] ? `franchise ${FRANCHISE_OF[x]}` : x)))].sort().join(' + '); byOwner.set(o, [...(byOwner.get(o) ?? []), c]); }
  const rel = (c: Candidate) => [...c.relations].filter((r) => !IGNORED_RELATIONS.has(r)).join('/');
  console.log(`### Discovery sitting recap — scope ${scope.join(',')}${airing ? ' · airing / announced only' : ''}${owner ? ` · owner ${owner}` : ''} — ${cands.length} candidates over ${byOwner.size} owners (generated ${new Date().toISOString().slice(0, 10)})\n`);
  for (const [o, list] of [...byOwner.entries()].sort((a, b) => Math.max(...b[1].map((c) => c.popularity)) - Math.max(...a[1].map((c) => c.popularity)))) {
    console.log(`**${o}**\n`);
    console.log('| anilist | title | format · status | evidence | stored | proposed (signals) | decision |');
    console.log('|---|---|---|---|---|---|---|');
    for (const c of list) {
      const stored = c.ruling ? `ruled ${c.ruling.disposition}` : 'unowned · no ruling';
      console.log(`| ${c.anilistId} | ${c.title.replace(/\|/g, '/')} | ${c.format ?? '?'} · ${c.status ?? '?'} · pop ${c.popularity} | ← ${rel(c)}${c.hop > 1 ? ` (hop ${c.hop} via ${c.via})` : ''} | ${stored} | **${c.proposal}** (${c.signals.join('; ')}) | |`);
    }
    console.log('');
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
