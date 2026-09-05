// audit-discovery — the DISCOVERY census (I42; CENSUS roster, standard,
// read-only). Derives the halo from staging + the discovery ruling map
// (lib/discovery.ts — the same derivation the sitting and discovery-stage
// read, P2) and prints the classes in the census's own format: a count, then
// up to 60 lines. Every line is a PROPOSAL for Sean; nothing here writes.
//   halo_sequel_unclaimed        SEQUEL × TV-shaped, unruled — component or series? (the "we waited on AFL" class)
//   halo_series_unclaimed        PREQUEL / SIDE_STORY / SPIN_OFF / ALTERNATIVE / PARENT / SAME_UNIVERSE / OTHER × TV-shaped, unruled
//   extra_same_instrument        I45: a recap / special / OVA / film that adapts the owner's OWN instrument — the sitting's load (standing + chapters)
//   extra_other_instrument       adapts another instrument — a related work AND a series candidate
//   extra_recap / extra_original / extra_crossover   filler by rule (listed for the surfacing decision; capped)
//   extra_unknown                an instrument source with no manga edge — held for Sean
//   extra_unstaged               a related work whose media is not staged yet — run discovery-stage
//   related_work_stale           a ledger row (origin halo) whose AniList edge no longer reaches the series (P24 — a listing)
//   related_work_violation       a ledger row whose standing / kind disagrees with the derivation (the healer must run)
//   discovery_new_since_sitting  TV-shaped candidates first staged / structurally changed after the last sitting, or never staged — THE TRIGGER TO SIT
//   discovery_ruled_unbuilt      a `series` ruling whose entry is still unowned — the seed writer has not run
//   discovery_ruling_stale       an `excluded` / `deferred` ruling whose entry is now owned, or that no owned entry relates to any more (P24 — a listing, never an auto-delete)
//   seed_candidate               G60: the latest ranked snapshots → unowned, un-haloed, series-shaped media collapsed to chain heads, scored by product fit — a ranked queue for the sitting, never authority (capped listing)
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-discovery.ts
import { candidateLine, discoveryClasses, haloCandidates, loadDiscoveryInput } from './lib/discovery';
import { lastSitting, SITTINGS } from './lib/rulings/discovery';
import { loadLatestRankings, seedCandidates, seedLine } from './lib/rankings';
import { selectAll } from './lib/db';
import { extraKind, extraStanding, type ExtraBucket } from './lib/related-works';

async function main() {
  const input = await loadDiscoveryInput();
  const cands = haloCandidates(input);
  const last = lastSitting();
  const classes = discoveryClasses(cands, input, last);
  const staged = cands.filter((c) => c.staged).length;
  console.log(`[audit-discovery] owned AniList ids ${input.owned.size} · candidates ${cands.length} (${staged} staged) · sequel ${cands.filter((c) => c.bucket === 'sequel').length} · series ${cands.filter((c) => c.bucket === 'series').length} · extra ${cands.filter((c) => c.bucket === 'extra').length} · ignored ${cands.filter((c) => c.bucket === 'ignored').length} · rulings ${Object.keys(input.rulings).length} · open-ended I15 ${input.openEnded.size} · last sitting ${last ?? 'none'}${SITTINGS.length ? ` (${SITTINGS.length} logged)` : ''}`);
  const airing = classes.halo_sequel_unclaimed.concat(classes.halo_series_unclaimed).filter((c) => c.status === 'RELEASING' || c.status === 'NOT_YET_RELEASED');
  console.log(`[audit-discovery] TV-shaped unruled: ${classes.halo_sequel_unclaimed.length + classes.halo_series_unclaimed.length} · of which RELEASING / NOT_YET_RELEASED ${airing.length} · proposals: component ${cands.filter((c) => c.proposal === 'component').length} · series ${cands.filter((c) => c.proposal === 'series').length} · ambiguous ${cands.filter((c) => c.proposal === 'ambiguous').length}`);
  // G60 — the seed queue from the latest ranked snapshots
  const rankings = await loadLatestRankings();
  const haloIds = new Set(cands.map((c) => c.anilistId));
  const seeds = seedCandidates(rankings, new Set(input.owned.keys()), haloIds);
  const perList = new Map<string, { rows: number; owned: number; halo: number }>();
  for (const r of rankings) { const p = perList.get(r.list) ?? { rows: 0, owned: 0, halo: 0 }; p.rows++; if (input.owned.has(r.anilist_id)) p.owned++; else if (haloIds.has(r.anilist_id)) p.halo++; perList.set(r.list, p); }
  console.log(`[audit-discovery] rankings (G60): ${rankings.length ? [...perList.entries()].map(([l, p]) => `${l} ${p.rows} rows (owned ${p.owned}, halo ${p.halo})`).join(' · ') : 'no snapshot yet — run discovery-stage --rankings'} → seed_candidate ${seeds.length}`);
  // I45 — the related-works buckets and the ledger's outcome
  const extras = cands.filter((c) => c.bucket === 'extra' || c.bucket === 'recap' || c.bucket === 'crossover');
  const byBucket = (b: string) => extras.filter((c) => c.proposal === b && !c.ruling).map(candidateLine);
  const ledger = await selectAll<any>('watch_order_entries', 'series_id, position, anilist_id, origin, standing, kind, title', (q) => q.eq('origin', 'halo'));
  const reach = new Map<string, typeof extras[number]>();
  for (const c of extras) for (const o of c.owners) reach.set(`${o}#${c.anilistId}`, c);
  const stale: string[] = [], violation: string[] = [];
  for (const l of ledger) {
    const c = reach.get(`${l.series_id}#${l.anilist_id}`);
    if (!c) { stale.push(`${l.series_id} @${l.position}: "${String(l.title).slice(0, 40)}" (anilist ${l.anilist_id}) — no AniList edge reaches the series any more (P24: a listing)`); continue; }
    const b = c.proposal as ExtraBucket;
    const wantStanding = extraStanding(b), wantKind = extraKind(c.format, b);
    if ((l.standing ?? null) !== wantStanding && wantStanding != null) violation.push(`${l.series_id} @${l.position}: standing '${l.standing}' ≠ rule '${wantStanding}' (${b}) — run sync-related-works`);
    if ((l.kind ?? null) !== wantKind) violation.push(`${l.series_id} @${l.position}: kind '${l.kind}' ≠ derived '${wantKind}' — run sync-related-works`);
  }
  console.log(`[audit-discovery] related works (I45): ${extras.length} listed · same_instrument ${byBucket('same_instrument').length} · other_instrument ${byBucket('other_instrument').length} · recap ${byBucket('recap').length} · original ${byBucket('original').length} · crossover ${byBucket('crossover').length} · unknown ${byBucket('unknown').length} · unstaged ${byBucket('unstaged').length} · ledger rows ${ledger.length} (${ledger.filter((l: any) => l.standing == null).length} standing pending)`);
  const lines: Record<string, string[]> = {
    halo_sequel_unclaimed: classes.halo_sequel_unclaimed.map(candidateLine),
    halo_series_unclaimed: classes.halo_series_unclaimed.map(candidateLine),
    extra_same_instrument: byBucket('same_instrument'),
    extra_other_instrument: byBucket('other_instrument'),
    extra_unknown: byBucket('unknown'),
    extra_unstaged: byBucket('unstaged'),
    extra_recap: byBucket('recap'),
    extra_original: byBucket('original'),
    extra_crossover: byBucket('crossover'),
    related_work_stale: stale,
    related_work_violation: violation,
    discovery_new_since_sitting: classes.discovery_new_since_sitting.map(candidateLine),
    discovery_ruled_unbuilt: classes.discovery_ruled_unbuilt.map((r) => `anilist ${r.anilistId}: ruled series${r.ruling.slug ? ` as ${r.ruling.slug}` : ''} but no series owns it — the seed writer has not run (I42)${r.candidate ? ` · ${r.candidate.title}` : ''}`),
    discovery_ruling_stale: classes.discovery_ruling_stale.map((r) => `anilist ${r.anilistId}: ${r.why} (P24 — re-rule or retire the entry)`),
    seed_candidate: seeds.map(seedLine),
  };
  for (const [k, v] of Object.entries(lines)) {
    console.log(`\n${k}: ${v.length}`);
    for (const l of v.slice(0, 60)) console.log('   ' + l);
    if (v.length > 60) console.log(`   …+${v.length - 60} more`);
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
