// THE SITTING RECAP (I42; Sean's chat-checkpoint rule, 2026-08-28 → 2026-09-05):
// the discovery analogue of research/batchN/baseline.ts — GENERATED from the
// database + the derivation (P5, it cannot drift), one line per candidate,
// STORED state first, then the proposal with its signals, then a decision
// column for Sean; a table per franchise (I43) where the owner has one, else per owner, the
// default-disposed rows in one summary line after it. Paste the output into
// the chat message — never point Sean at a file for the baseline.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/discovery/recap.ts [--scope sequel,series|extras|all|seed] [--airing] [--owner <series-id>] [--limit N]
//   --scope extras --summary [--top N]: the sitting's LOAD tables instead of the per-work rows — bucket totals, the load per owner,
//   the same-instrument list (the sitting's load), the other-instrument list (series candidates vs one-shot tie-ins), PV / trailer suspects
import { haloCandidates, loadDiscoveryInput, IGNORED_RELATIONS, type Candidate } from '../../lib/discovery';
import { FRANCHISE_OF } from '../../lib/rulings/franchises';
import { loadLatestRankings, seedCandidates } from '../../lib/rankings';

const arg = (k: string): string | null => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const scope = (arg('--scope') ?? 'sequel').split(',');
const airing = process.argv.includes('--airing');
const owner = arg('--owner');
const summary = process.argv.includes('--summary');
const limit = Number(arg('--limit') ?? (summary ? 100000 : 400));
/** promotional specials the halo lists — a music video is ignored by rule (I45); a PV / trailer is Sean's call, so the summary names them */
const PROMO = /\b(?:PV|trailer|promo(?:tion(?:al)?)?|teaser|CM)\b/i;

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
    if (summary) {
      // the sitting's load tables (Sean 2026-09-05: the checkpoint is a generated table in chat — never an ad-hoc script over a file)
      const date = new Date().toISOString().slice(0, 10);
      const year = (c: Candidate) => (input.staged.get(c.anilistId) as { startDate?: { year?: number | null } } | undefined)?.startDate?.year ?? null;
      const groupOf = (c: Candidate) => [...new Set([...c.owners].map((x) => (FRANCHISE_OF[x] ? `franchise ${FRANCHISE_OF[x]}` : x)))].sort().join(' + ');
      const buckets = ['same_instrument', 'other_instrument', 'unknown', 'recap', 'original', 'crossover', 'unstaged'];
      const RULE: Record<string, string> = {
        same_instrument: "adapts the series' own instrument — standing PENDING (research: standing + chapters)",
        other_instrument: 'adapts another work under its own source — a series candidate (a run; step 2, the film mint) or a one-shot tie-in',
        unknown: 'a source naming no instrument node (a franchise tag with no chapters behind it, a novel film without its edge, a VN / game source) — HELD',
        recap: 'filler by rule; kind recap; never a numbered row (N8)', original: 'filler by T25 (source ORIGINAL)', crossover: 'filler; listed, not fetched (CHARACTER-only)',
        unstaged: 'not fetched yet — the next discovery-stage run',
      };
      const tot = new Map<string, number>(); for (const c of ex) tot.set(c.proposal, (tot.get(c.proposal) ?? 0) + 1);
      console.log(`### Related-works sitting summary — ${ex.length} works (generated ${date})\n`);
      console.log('| bucket | works | rule |'); console.log('|---|---|---|');
      for (const b of buckets) console.log(`| ${b} | ${tot.get(b) ?? 0} | ${RULE[b]} |`);
      console.log(`\nundated works (no derivable position — listed, never slotted): ${ex.filter((c) => year(c) == null).length}\n`);
      const per = new Map<string, Map<string, number>>();
      for (const c of ex) { const g = groupOf(c); const m = per.get(g) ?? new Map<string, number>(); m.set(c.proposal, (m.get(c.proposal) ?? 0) + 1); per.set(g, m); }
      const load = (m: Map<string, number>) => (m.get('same_instrument') ?? 0) + (m.get('other_instrument') ?? 0) + (m.get('unknown') ?? 0);
      const ranked = [...per.entries()].sort((a, b) => load(b[1]) - load(a[1]));
      const top = Number(arg('--top') ?? 30);
      console.log(`**The load per owner** (top ${top} by same + other + held; ${ranked.length} owners)\n`);
      console.log('| owner | total | same | other | held | recap | original | crossover | unstaged |'); console.log('|---|---|---|---|---|---|---|---|---|');
      const line = (name: string, m: Map<string, number>) => `| ${name} | ${[...m.values()].reduce((x, y) => x + y, 0)} | ${buckets.map((b) => m.get(b) ?? 0).join(' | ')} |`;
      for (const [g, m] of ranked.slice(0, top)) console.log(line(g, m));
      const rest = new Map<string, number>(); for (const [, m] of ranked.slice(top)) for (const [b, n] of m) rest.set(b, (rest.get(b) ?? 0) + n);
      if (ranked.length > top) console.log(line(`${ranked.length - top} more owners`, rest));
      const same = new Map<string, Candidate[]>(); for (const c of ex) if (c.proposal === 'same_instrument') { const g = groupOf(c); same.set(g, [...(same.get(g) ?? []), c]); }
      console.log(`\n**Same-instrument works — the sitting's load** (${ex.filter((c) => c.proposal === 'same_instrument').length})\n`);
      console.log('| owner | n | works (anilist id · format · year) |'); console.log('|---|---|---|');
      for (const [g, list] of [...same.entries()].sort((a, b) => b[1].length - a[1].length)) console.log(`| ${g} | ${list.length} | ${list.sort((a, b) => b.popularity - a.popularity).map((c) => `${c.title.replace(/\|/g, '/')} (${c.anilistId} · ${c.format ?? '?'} · ${year(c) ?? '?'})`).join('; ')} |`);
      console.log(`\n**Other-instrument works** (${ex.filter((c) => c.proposal === 'other_instrument').length}) — a run is a series candidate (step 2, the film mint); a one-shot is a tie-in\n`);
      console.log('| owner | work | adapts | shape |'); console.log('|---|---|---|---|');
      for (const c of ex.filter((x) => x.proposal === 'other_instrument').sort((a, b) => b.popularity - a.popularity)) {
        const adapts = (c.signals.find((x) => x.startsWith('adapts ')) ?? 'adapts ?').replace(/^adapts /, '');
        console.log(`| ${groupOf(c)} | ${c.title.replace(/\|/g, '/')} (${c.anilistId} · ${c.format ?? '?'} · ${year(c) ?? '?'}) | ${adapts.replace(/\|/g, '/')} | ${c.signals.some((x) => x.includes('one-shot tie-in')) ? 'one-shot tie-in' : 'a run — series candidate'} |`);
      }
      const promo = ex.filter((c) => PROMO.test(c.title));
      console.log(`\n**PV / trailer suspects** (${promo.length}) — I45 lists everything but music videos today; ignoring these is Sean's call\n`);
      for (const c of promo.sort((a, b) => b.popularity - a.popularity)) console.log(`- ${groupOf(c)}: ${c.title} (${c.anilistId} · ${c.format ?? '?'} · ${year(c) ?? '?'}) — bucket ${c.proposal}`);
      return;
    }
    console.log(`### Related-works sitting recap — ${ex.length} works over ${groups.size} franchises / owners (generated ${new Date().toISOString().slice(0, 10)})\n`);
    for (const [g, list] of [...groups.entries()].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`**${g}** (${list.length})\n`);
      console.log('| anilist | title | format · date | relation | bucket (rule) | standing | proposed | decision |');
      console.log('|---|---|---|---|---|---|---|---|');
      for (const c of list.sort((a, b) => b.popularity - a.popularity)) {
        const m = input.staged.get(c.anilistId) as { startDate?: { year?: number | null } } | undefined;
        const b = c.proposal;
        const standing = b === 'recap' || b === 'original' || b === 'crossover' ? 'filler (rule)' : b === 'unstaged' ? '—' : 'pending';
        const adapts = c.signals.find((x) => x.startsWith('adapts '));
        const proposed = b === 'same_instrument' ? `${adapts ?? 'adapts the instrument'} — research standing + chapters; surface when ruled` : b === 'other_instrument' ? `${adapts ?? 'adapts another work'} — ${c.signals.some((x) => x.includes('one-shot tie-in')) ? 'a one-shot tie-in; research' : 'a series candidate (seed) + a related work'}` : b === 'recap' ? 'ledger row, kind recap — surface only by label' : b === 'original' ? 'ledger row — optional viewing; surface only by label' : b === 'crossover' ? 'ledger row (unfetched) — listed' : b === 'unknown' ? 'HOLD: source with no manga edge' : 'stage first';
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
