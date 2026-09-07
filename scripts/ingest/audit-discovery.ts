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
//   extra_unknown                a source naming no instrument node — held for Sean
//   extra_unstaged               a related work whose media is not staged yet — run discovery-stage
//   extra_promo                  a promotional entry (trailer / PV / teaser / CM) — ignored like a music video: listed here, never a ledger row (I45 amended)
//   extra_alternative            I16 / I45: a work reached only by ALTERNATIVE / OTHER edges — a different telling of the same source, one row under the franchise base; a series candidate when it adapts an instrument
//   related_work_duplicate       I46: a halo row and a wiki / ruled row name the same work, or a wiki / ruled row without an identity matches a staged work — sync-related-works adopts + removes
//   related_work_identity_gap    I46 (amended): a stored identity the registry does not hold (a halo row's anilist / mal id, an adopted row's wiki key) — run sync-related-works
//   related_work_identity_conflict  an id registered to a DIFFERENT work than the stored row shows — a mix-up, refused, ruled by Sean
//   related_work_identity_orphan   a registry entry whose work has no stored row (the row went, the identity stays — P24 listing)
//   related_work_stale           a ledger row (origin halo) whose AniList edge no longer reaches the series (P24 — a listing)
//   related_work_violation       a ledger row whose standing / kind disagrees with the derivation (the healer must run)
//   related_work_short_unlisted  I48: a staged ≤ 5-min TV_SHORT / ONA spin-off routed to the ledger but holding NO row — run sync-related-works (violation)
//   discovery_new_since_sitting  TV-shaped candidates first staged / structurally changed after the last sitting, or never staged — THE TRIGGER TO SIT
//   discovery_ruled_unbuilt      a `series` ruling whose entry is still unowned — the seed writer has not run
//   discovery_ruling_stale       an `excluded` / `deferred` ruling whose entry is now owned, or that no owned entry relates to any more (P24 — a listing, never an auto-delete)
//   seed_candidate               G60: the latest ranked snapshots → unowned, un-haloed, series-shaped media collapsed to chain heads, scored by product fit — a ranked queue for the sitting, never authority (capped listing)
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-discovery.ts
import { candidateLine, discoveryClasses, haloCandidates, isShortForm, loadDiscoveryInput } from './lib/discovery';
import { lastSitting, SITTINGS } from './lib/rulings/discovery';
import { loadLatestRankings, seedCandidates, seedLine, type Seed } from './lib/rankings';
import { resolveDebt, resolveInputsOf } from './lib/anilist-refresh';
import { ENTRIES as RELATED_WORK_ENTRIES } from './lib/rulings/related-works';
import { selectAll } from './lib/db';
import { clusterDisorder, deriveWatchPosition, type ExtraBucket, pickAdoption, isoDate, ledgerBaseProblems, ledgerWorthy, matchRelatedTitle, relatedWorkStanding, extraKind } from './lib/related-works';
import { relatedWorkRuling } from './lib/rulings/related-works';
import { censusKindMark } from './lib/census-kinds';
import { CANDIDATE_ENTRIES } from './lib/rulings/discovery';
import { RULED_LABELS, RULED_POSITION_BY_ANILIST, RULED_RECORDS } from './lib/rulings/watch-order-labels';
import { identityProblems, loadRelatedWorkRegistry } from './lib/related-work-ids';

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
  const byBucket = (b: string) => extras.filter((c) => c.proposal === b && (!c.ruling || c.ruling.disposition === 'related_work' || c.ownedElsewhere)).map(candidateLine); // a minted one-row series elsewhere is still this owner's related work (I13 d)
  const allRows = await selectAll<any>('watch_order_entries', 'series_id, position, anilist_id, origin, standing, kind, title, air_date, chapter');
  const epsBy = new Map<string, { number: number; air_date: string | null }[]>();
  for (const e of await selectAll<{ series_id: string; number: number; air_date: string | null }>('episodes', 'series_id, number, air_date')) epsBy.set(e.series_id, [...(epsBy.get(e.series_id) ?? []), e]);
  const ledger = allRows.filter((r: any) => r.origin === 'halo');
  // I48 — the OUTCOME the short-form route promises: every staged short routed to the ledger has a row (any origin — a wiki / ruled row may have adopted it, I46)
  const rowIds = new Set((allRows as { anilist_id: number | null }[]).map((r) => r.anilist_id).filter((x): x is number => x != null));
  const shortUnlisted = cands
    .filter((c) => c.staged && c.bucket === 'extra' && c.proposal !== 'promo' && isShortForm(c.format, c.duration) && !(c.ruling && c.ruling.disposition !== 'related_work') && !rowIds.has(c.anilistId)) // a promo-titled short is never a row (I45) — not this class
    .map((c) => `${[...c.owners].join(',')}: anilist ${c.anilistId} ${c.title} [${c.format} ${c.duration} min] — short-form route (I48) with no ledger row — run sync-related-works`);
  const others = allRows.filter((r: any) => r.origin !== 'halo');
  const reach = new Map<string, typeof extras[number]>();
  for (const c of extras) for (const o of c.owners) reach.set(`${o}#${c.anilistId}`, c);
  const stale: string[] = [], violation: string[] = [], duplicate: string[] = [];
  const registry = await loadRelatedWorkRegistry();
  const malOf = new Map<number, number | null>(); for (const [id, m] of input.staged) malOf.set(id, (m as { idMal?: number | null }).idMal ?? null);
  const identity = identityProblems(allRows.map((r: any) => ({ series_id: r.series_id, position: Number(r.position), anilist_id: r.anilist_id, origin: r.origin, title: String(r.title) })), registry, malOf);
  // I46 — one row per work: a halo row beside a wiki / ruled row naming the same work; a wiki / ruled row with no identity that a staged work matches
  for (const l of ledger) for (const o of others) if (o.series_id === l.series_id && o.anilist_id == null && (RULED_POSITION_BY_ANILIST[l.series_id]?.[Number(l.anilist_id)] === Number(o.position) || matchRelatedTitle(String(l.title), String(o.title)))) duplicate.push(`${l.series_id}: halo @${l.position} "${String(l.title).slice(0, 40)}" duplicates the ${o.origin ?? 'wiki'} row @${o.position} "${String(o.title).slice(0, 40)}" — run sync-related-works (adopt + remove)`);
  const yearOf = (c: typeof extras[number]) => (input.staged.get(c.anilistId) as { startDate?: { year?: number | null } | null } | undefined)?.startDate?.year ?? null;
  for (const o of others) {
    if (o.anilist_id != null) continue;
    const here = extras.filter((c) => c.owners.has(o.series_id) && c.proposal !== 'promo');
    for (const c of here) {
      const pick = pickAdoption({ title: c.title, year: yearOf(c) }, [o], here.filter((x) => x !== c).map((x) => ({ title: x.title, year: yearOf(x) })));
      if (!pick) continue;
      duplicate.push('ambiguous' in pick
        ? `${o.series_id}: ${o.origin ?? 'wiki'} row @${o.position} "${String(o.title).slice(0, 40)}" has no identity — anilist ${c.anilistId} ${c.title} fits but ${pick.ambiguous} (I46 fails closed: a ruling names the identity)`
        : `${o.series_id}: ${o.origin ?? 'wiki'} row @${o.position} "${String(o.title).slice(0, 40)}" has no identity — anilist ${c.anilistId} ${c.title} fits (${pick.reason}; adoption pending: run sync-related-works)`);
    }
  }
  for (const l of ledger) {
    const c = reach.get(`${l.series_id}#${l.anilist_id}`);
    if (!c) { const elsewhere = extras.find((x) => x.anilistId === l.anilist_id); stale.push(elsewhere ? `${l.series_id} @${l.position}: "${String(l.title).slice(0, 40)}" — re-attributed by rule to ${[...elsewhere.owners].join(', ')} (${elsewhere.proposal}) — run sync-related-works` : `${l.series_id} @${l.position}: "${String(l.title).slice(0, 40)}" (anilist ${l.anilist_id}) — no AniList edge reaches the series any more (P24: a listing)`); continue; }
    const b = c.proposal as ExtraBucket;
    if (!ledgerWorthy(b)) { stale.push(`${l.series_id} @${l.position}: "${String(l.title).slice(0, 40)}" — promotional (I45 amended: never a row) — run sync-related-works`); continue; }
    const ruling = relatedWorkRuling(l.series_id, Number(l.anilist_id));
    const wantStanding = relatedWorkStanding(b, ruling), wantKind = ruling?.kind ?? extraKind(c.format, b);
    if (ruling?.title != null && l.title !== ruling.title) violation.push(`${l.series_id} @${l.position}: title ≠ ruled '${ruling.title}' (P8 repair) — run sync-related-works`);
    if (ruling?.airDate !== undefined && (l.air_date ?? null) !== ruling.airDate) violation.push(`${l.series_id} @${l.position}: air_date ${l.air_date} ≠ ruled ${ruling.airDate} (P8 repair) — run sync-related-works`);
    if (ruling?.chapter != null && Number(l.chapter) !== ruling.chapter) violation.push(`${l.series_id} @${l.position}: chapter ${l.chapter} ≠ ruled ${ruling.chapter} (I45 ruling layer) — run sync-related-works`);
    const labelPos = RULED_POSITION_BY_ANILIST[l.series_id]?.[Number(l.anilist_id)]; // the label map's ruled position by AniList id (the wiki-numbering layer) pins a row too
    if (ruling?.position != null && Number(l.position) !== ruling.position) violation.push(`${l.series_id} @${l.position}: position ≠ ruled ${ruling.position} (I45 ruling layer) — run sync-related-works`);
    else if (ruling?.position == null && labelPos != null && Number(l.position) !== labelPos) violation.push(`${l.series_id} @${l.position}: position ≠ ruled ${labelPos} (watch-order-labels, by AniList id) — run sync-related-works`);
    else if (ruling?.position == null && labelPos == null) {
      const m = input.staged.get(Number(l.anilist_id)) as { startDate?: { year?: number | null; month?: number | null; day?: number | null } | null } | undefined;
      const derived = deriveWatchPosition(ruling?.airDate !== undefined ? ruling.airDate : isoDate(m?.startDate), epsBy.get(l.series_id) ?? []); // a ruled date (P8) beats AniList's, as in the writer
      if (derived != null && Math.floor(derived) !== Math.floor(Number(l.position))) violation.push(`${l.series_id} @${l.position}: derived base slot is ${Math.floor(derived)} (the grid changed; position is an attribute, identity is the AniList id) — run sync-related-works`);
    }
    if ((l.standing ?? null) !== wantStanding && wantStanding != null) violation.push(`${l.series_id} @${l.position}: standing '${l.standing}' ≠ rule '${wantStanding}' (${b}) — run sync-related-works`);
    if ((l.kind ?? null) !== wantKind) violation.push(`${l.series_id} @${l.position}: kind '${l.kind}' ≠ derived '${wantKind}' — run sync-related-works`);
  }
  console.log(`[audit-discovery] related works (I45): ${extras.length} listed · same_instrument ${byBucket('same_instrument').length} · other_instrument ${byBucket('other_instrument').length} · recap ${byBucket('recap').length} · original ${byBucket('original').length} · crossover ${byBucket('crossover').length} · promo ${byBucket('promo').length} · alternative ${byBucket('alternative').length} · unknown ${byBucket('unknown').length} · unstaged ${byBucket('unstaged').length} · ledger rows ${ledger.length} (${ledger.filter((l: any) => l.standing == null).length} standing pending)`);
  // E3 — the research work-list (R27): a ledger row still pending its standing
  const unruled = [...ledger, ...others.filter((r: any) => r.anilist_id != null)].filter((r: any) => r.standing == null).map((r: any) => `${r.series_id} @${r.position} "${String(r.title).slice(0, 40)}" — ${reach.get(`${r.series_id}#${r.anilist_id}`)?.proposal ?? 'unreached'} (standing pending research)`);
  // I45 on ADOPTED rows (2026-09-06, the BSD Walking Alone verifier): a wiki / ruled row that carries an AniList id takes the ruled FACTS of the
  // work like a halo row — a stored disagreement is a violation; a ruled POSITION on such a row is refused by the writer and listed here
  for (const o of others) {
    if (o.anilist_id == null) continue;
    const ruling = relatedWorkRuling(o.series_id, Number(o.anilist_id)); if (!ruling) continue;
    if (ruling.standing !== undefined && (o.standing ?? null) !== ruling.standing) violation.push(`${o.series_id} @${o.position} (${o.origin} row): standing '${o.standing}' ≠ ruled '${ruling.standing}' (I45 on an adopted row) — run sync-related-works`);
    if (ruling.chapter !== undefined && (o.chapter == null ? null : Number(o.chapter)) !== ruling.chapter) violation.push(`${o.series_id} @${o.position} (${o.origin} row): chapter ${o.chapter} ≠ ruled ${ruling.chapter} (I45 on an adopted row) — run sync-related-works`);
    if (ruling.title != null && o.title !== ruling.title) violation.push(`${o.series_id} @${o.position} (${o.origin} row): title ≠ ruled '${ruling.title}' (P8 repair) — run sync-related-works`);
    if (ruling.airDate !== undefined && (o.air_date ?? null) !== ruling.airDate) violation.push(`${o.series_id} @${o.position} (${o.origin} row): air_date ${o.air_date} ≠ ruled ${ruling.airDate} (P8 repair) — run sync-related-works`);
    if (ruling.position != null && Number(o.position) !== ruling.position) violation.push(`${o.series_id} @${o.position} (${o.origin} row): a ruled position ${ruling.position} on an adopted row is refused — the fractional's position is its own ruling; rule the fractional, not the work`);
  }
  // P24 (the 2026-09-06 consolidate): a related-work RULING whose (series, anilist id) matches no ledger row — a row retired by ownership, a
  // moved owner, a typo — is dead weight that would silently re-apply if the row ever returned; the three PoT chain entries were the witness
  const rowKeys = new Set(allRows.filter((r: any) => r.anilist_id != null).map((r: any) => `${r.series_id}#${r.anilist_id}`));
  const rulingOrphans = RELATED_WORK_ENTRIES.filter((e) => !rowKeys.has(`${e.seriesId}#${e.value.anilistId}`)).map((e) => `${e.seriesId} × anilist ${e.value.anilistId}: a ruling with no ledger row — retire the entry or restore the row (P24)`);
  // E2 — a positioned row whose base episode has no row
  const epNumbers = new Map<string, Set<number>>(); for (const [sid, eps] of epsBy) epNumbers.set(sid, new Set(eps.map((e) => e.number)));
  const ruledPosition = (sid: string, pos: number, anilistId: number | null) => RULED_RECORDS[sid]?.[pos] != null || RULED_LABELS[sid]?.[pos] != null || (anilistId != null && (relatedWorkRuling(sid, anilistId)?.position === pos || RULED_POSITION_BY_ANILIST[sid]?.[anilistId] === pos));
  const rowById = new Map(allRows.map((r: any) => [`${r.series_id}@${Number(r.position)}`, r.anilist_id as number | null]));
  const baseMissing = ledgerBaseProblems(allRows.map((r: any) => ({ seriesId: r.series_id, position: Number(r.position), title: r.title })), (sid) => epNumbers.get(sid) ?? new Set(), (sid, pos) => ruledPosition(sid, pos, rowById.get(`${sid}@${pos}`) ?? null));
  // E13 — unruled rows inside one slot out of air-date order (insertion history)
  const isRuled = (r: any) => relatedWorkRuling(r.series_id, Number(r.anilist_id))?.position != null || RULED_POSITION_BY_ANILIST[r.series_id]?.[Number(r.anilist_id)] != null;
  const disorder = clusterDisorder(ledger.map((r: any) => ({ seriesId: r.series_id, position: Number(r.position), airDate: r.air_date ?? null, ruled: isRuled(r), title: r.title })));
  // I13 (d) — a minted series with a declared relation and no series_relations row between the pair (either direction)
  const relRows = await selectAll<{ from_series: string; to_series: string }>('series_relations', 'from_series, to_series');
  const linked = new Set(relRows.flatMap((r) => [`${r.from_series}→${r.to_series}`, `${r.to_series}→${r.from_series}`]));
  const ownedSlugs = new Set(input.owned.values());
  const relationMissing: string[] = [];
  for (const e of CANDIDATE_ENTRIES) {
    const v = e.value; if (v.disposition !== 'series' || !v.relation || !v.slug || !ownedSlugs.has(v.slug)) continue;
    if (!linked.has(`${v.slug}→${v.relation.to}`)) relationMissing.push(`${v.slug} → ${v.relation.to} (${v.relation.kind}): declared, series minted, no series_relations row — run relations.ts (a kind AniList cannot express needs a lib/rulings/relations.ts entry)`);
  }
  // G58 (amended 2026-09-06) — the resolve debt: a resolve input whose staged structure is not what its series was last resolved from, older than the daily run's reach
  const debtSeries = await selectAll<{ id: string; afl_slug: string | null; anilist_id: number | null }>('series', 'id, afl_slug, anilist_id');
  const debtComps = await selectAll<{ series_id: string; anilist_id: number; episode_start: number | null }>('series_components', 'series_id, anilist_id, episode_start');
  const debtStaged = new Map((await selectAll<{ anilist_id: number; content_hash: string | null; resolved_hash: string | null; resolved_at: string | null; changed_at: string | null }>('ingest_anilist_media', 'anilist_id, content_hash, resolved_hash, resolved_at, changed_at')).map((r) => [r.anilist_id, r]));
  const debtCompsBy = new Map<string, { anilistId: number; ranged: boolean }[]>();
  for (const c of debtComps) debtCompsBy.set(c.series_id, [...(debtCompsBy.get(c.series_id) ?? []), { anilistId: c.anilist_id, ranged: c.episode_start != null }]);
  const resolveDebtLines: string[] = [];
  for (const s of debtSeries) {
    const inp = resolveInputsOf({ id: s.id, aflSlug: s.afl_slug, headId: s.anilist_id, comps: debtCompsBy.get(s.id) ?? [] });
    const rows = inp.inputs.map((id) => { const st = debtStaged.get(id); return { anilistId: id, contentHash: st?.content_hash ?? null, resolvedHash: st?.resolved_hash ?? null, changedAt: st?.changed_at ?? null }; });
    for (const r of resolveDebt(rows, new Date())) resolveDebtLines.push(`${s.id}: anilist ${r.anilistId} staged ${String(r.changedAt ?? '?').slice(0, 10)} is not what the row was resolved from (resolved ${String(debtStaged.get(r.anilistId)?.resolved_at ?? 'never').slice(0, 10)}) — run refresh-anilist.ts (G58)`);
  }
  // the airing work-lists (2026-09-06): the halo's airing / announced TV-shaped candidates, airing first then popularity; the seed lists' airing / upcoming rows in list order
  const isLive = (st: string | null | undefined) => st === 'RELEASING' || st === 'NOT_YET_RELEASED';
  const haloAiring = [...classes.halo_sequel_unclaimed, ...classes.halo_series_unclaimed].filter((c) => isLive(c.status)).sort((a, b) => Number(b.status === 'RELEASING') - Number(a.status === 'RELEASING') || b.popularity - a.popularity);
  const airingRank = (x: Seed) => Math.min(Infinity, ...x.lists.filter((l) => l.list.startsWith('airing-') || l.list.startsWith('upcoming-')).map((l) => l.rank));
  const seedAiring = seeds.filter((x) => airingRank(x) < Infinity || isLive(x.status)).sort((a, b) => Number(b.status === 'RELEASING') - Number(a.status === 'RELEASING') || airingRank(a) - airingRank(b) || b.popularity - a.popularity);
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
    extra_promo: byBucket('promo'),
    extra_alternative: byBucket('alternative'),
    related_work_stale: stale,
    related_work_violation: violation,
    related_work_short_unlisted: shortUnlisted,
    related_work_duplicate: duplicate,
    related_work_identity_gap: identity.gap,
    related_work_identity_conflict: identity.conflict,
    related_work_identity_orphan: identity.orphan,
    related_work_unruled: unruled,
    related_work_base_missing: baseMissing,
    related_work_cluster_disorder: disorder,
    series_relation_missing: relationMissing,
    discovery_new_since_sitting: classes.discovery_new_since_sitting.map(candidateLine),
    discovery_ruled_unbuilt: classes.discovery_ruled_unbuilt.map((r) => `anilist ${r.anilistId}: ruled series${r.ruling.slug ? ` as ${r.ruling.slug}` : ''} but no series owns it — the seed writer has not run (I42)${r.candidate ? ` · ${r.candidate.title}` : ''}`),
    discovery_ruling_stale: classes.discovery_ruling_stale.map((r) => `anilist ${r.anilistId}: ${r.why} (P24 — re-rule or retire the entry)`),
    seed_candidate: seeds.map(seedLine),
    anilist_resolve_debt: resolveDebtLines,
    related_work_ruling_orphan: rulingOrphans,
    halo_airing: haloAiring.map(candidateLine),
    seed_airing: seedAiring.map(seedLine),
  };
  for (const [k, v] of Object.entries(lines)) {
    console.log(`\n${k}: ${v.length}${censusKindMark(k)}`);
    for (const l of v.slice(0, 60)) console.log('   ' + l);
    if (v.length > 60) console.log(`   …+${v.length - 60} more`);
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
