// THE SITTING RECAP (I42; Sean's chat-checkpoint rule, 2026-08-28 → 2026-09-05):
// the discovery analogue of research/batchN/baseline.ts — GENERATED from the
// database + the derivation (P5, it cannot drift), one line per candidate,
// STORED state first, then the proposal with its signals, then a decision
// column for Sean; a table per franchise (I43) where the owner has one, else per owner, the
// default-disposed rows in one summary line after it. Paste the output into
// the chat message — never point Sean at a file for the baseline.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts [--scope sequel,series|extra|all] [--airing] [--owner <series-id>] [--limit N]
import { haloCandidates, loadDiscoveryInput, IGNORED_RELATIONS, type Candidate } from '../../lib/discovery';
import { FRANCHISE_OF } from '../../lib/rulings/franchises';

const arg = (k: string): string | null => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const scope = (arg('--scope') ?? 'sequel').split(',');
const airing = process.argv.includes('--airing');
const owner = arg('--owner');
const limit = Number(arg('--limit') ?? 400);

async function main() {
  const input = await loadDiscoveryInput();
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
