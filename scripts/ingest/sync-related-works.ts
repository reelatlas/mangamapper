// sync-related-works — THE RELATED-WORKS LEDGER writer (I45; HEAL roster,
// standard; Sean 2026-09-05: "make sure we have recaps, specials, films and
// everything, then decide whether to surface"). Every staged related work of
// an owned series (the halo's extra / recap / crossover buckets, lib/discovery)
// becomes a watch_order_entries row with origin 'halo': identity, relation,
// kind (T29), standing — a RULING (lib/rulings/related-works.ts, researched)
// over the RULE (recap / original / crossover → filler; same- or
// other-instrument → null, the sitting's) — a position (ruled, else derived:
// after the last episode aired before it), title, date, the ruled adaptation
// fields, and a note naming the bucket and the adapted work. It never writes
// display_label (rulings own surfacing, N31), never touches another origin's
// row (G57) and never deletes a row whose edge merely went stale (P24 — a
// listing, related_work_stale). Two removals are its own (Sean ruled
// 2026-09-05): a HALO row that duplicates a wiki / ruled row naming the same
// work — that row ADOPTS the AniList identity instead (I46, one row per
// work) — and a promotional entry (I45 amended: never a row). Idempotent;
// the note carries no date so every field is compared on every run.
//   npx tsx --env-file=.env.ingest scripts/ingest/sync-related-works.ts [--dry-run]
import { db, finishRun, selectAll, startRun } from './lib/db';
import { haloCandidates, loadDiscoveryInput } from './lib/discovery';
import { adaptedNodes, deriveWatchPosition, ledgerWorthy, ownerInstrumentSet, planRuledMoves, retiredByOwnership, extraKind, freePosition, isoDate, pickAdoption, relatedWorkStanding, type ExtraBucket } from './lib/related-works';
import { relatedWorkRuling } from './lib/rulings/related-works';
import { RULED_POSITION_BY_ANILIST } from './lib/rulings/watch-order-labels';
import { loadRelatedWorkRegistry, lookupRelatedWork, registerRelatedWorkIds, wikiKey } from './lib/related-work-ids';

const DRY = process.argv.includes('--dry-run');
const LEDGER_BUCKETS = new Set(['extra', 'recap', 'crossover']);

type Row = { series_id: string; position: number; anilist_id: number | null; origin: string | null; standing: string | null; kind: string | null; title: string; air_date: string | null; relation: string | null; note: string | null; chapter: number | null; volume: number | null; chapters_adapted: string | null };

/** the ledger note for a bucket — the rule that decided the standing, or what the sitting still owes */
function bucketNote(bucket: ExtraBucket, adapts: { title: string | null; format: string | null }[]): string {
  const works = adapts.map((n) => `${n.title ?? '?'} (${n.format ?? '?'})`).join(', ');
  switch (bucket) {
    case 'recap': return 'recap / compilation (filler by rule, N8: never a numbered row)';
    case 'original': return 'original side story (source ORIGINAL — filler by T25)';
    case 'crossover': return 'crossover by shared characters only (filler)';
    case 'alternative': return `an alternative adaptation (I16) — a different telling of the same source, not in this run${works ? `; adapts ${works} — a series candidate (step 2)` : '; no instrument named — held'}`;
    case 'same_instrument': return `adapts the series' own instrument: ${works} — standing and chapters pending the sitting / research`;
    case 'other_instrument': return `adapts another work: ${works} — ${adapts.some((n) => n.format === 'MANGA' || n.format === 'NOVEL') ? 'a series candidate too (the KonoSuba-Explosion shape)' : 'a one-shot tie-in'}`;
    default: return 'a source with no named instrument (AniList names no chapters — a franchise tag, a novel film without its edge, a visual-novel or game source) — held for Sean';
  }
}

const yearOf = (d: string | null | undefined): number | null => (d ? Number(String(d).slice(0, 4)) : null);

async function main() {
  const runId = await startRun('resolve');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  try {
    const input = await loadDiscoveryInput();
    // date-ascending, so works sharing a slot take it in air-date order (freePosition steps 0.01 per later work) — the KonoSuba S2 OVA (2017)
    // before Legend of Crimson (2019). A stored row keeps its position; a cluster's ORDER is a ruling (RelatedWorkRuling.position) once verdicts land
    const dateOf = (id: number) => { const m = input.staged.get(id) as { startDate?: { year?: number | null; month?: number | null; day?: number | null } | null } | undefined; return isoDate(m?.startDate) ?? '9999'; };
    const cands = haloCandidates(input).filter((c) => LEDGER_BUCKETS.has(c.bucket) && c.proposal !== 'unstaged').sort((x, y) => dateOf(x.anilistId).localeCompare(dateOf(y.anilistId)));
    const episodes = await selectAll<{ series_id: string; number: number; air_date: string | null }>('episodes', 'series_id, number, air_date');
    const epsBy = new Map<string, { number: number; air_date: string | null }[]>();
    for (const e of episodes) epsBy.set(e.series_id, [...(epsBy.get(e.series_id) ?? []), e]);
    const existing = await selectAll<Row>('watch_order_entries', 'series_id, position, anilist_id, origin, standing, kind, title, air_date, relation, note, chapter, volume, chapters_adapted');
    const byKey = new Map(existing.filter((e) => e.anilist_id != null).map((e) => [`${e.series_id}#${e.anilist_id}`, e]));
    // rows of another origin that carry no identity yet — the adoption pool (I46)
    const unkeyed = new Map<string, Row[]>();
    for (const e of existing) if (e.anilist_id == null && (e.origin ?? 'wiki') !== 'halo') unkeyed.set(e.series_id, [...(unkeyed.get(e.series_id) ?? []), e]);
    const titlesBy = new Map<string, { id: number; title: string; year: number | null }[]>();
    for (const c of cands) for (const sid of c.owners) titlesBy.set(sid, [...(titlesBy.get(sid) ?? []), { id: c.anilistId, title: c.title, year: yearOf(input.staged.get(c.anilistId) ? isoDate((input.staged.get(c.anilistId) as { startDate?: { year?: number | null } | null }).startDate) : null) }]);
    const takenBy = new Map<string, Set<number>>();
    for (const e of existing) takenBy.set(e.series_id, new Set([...(takenBy.get(e.series_id) ?? []), Number(e.position)]));
    // I46 (amended): THE IDENTITY REGISTRY — every id this writer knows maps into (series, anilist_id) once; only what the registry lacks is written
    const registry = await loadRelatedWorkRegistry();
    let registeredIds = 0; const collisions: string[] = [];
    const malOf = (id: number) => (input.staged.get(id) as { idMal?: number | null } | undefined)?.idMal ?? null;
    const register = async (sid: string, anilistId: number, ids: Record<string, string | number | null | undefined>, by: 'halo' | 'adoption') => {
      const missing: Record<string, string | number> = {};
      for (const [source, v] of Object.entries(ids)) if (v != null && v !== '' && !lookupRelatedWork(registry, source, v)) missing[source] = v;
      if (!Object.keys(missing).length) return;
      if (DRY) { registeredIds += Object.keys(missing).length; return; }
      const r = await registerRelatedWorkIds({ anilist_id: anilistId }, missing, by);
      registeredIds += r.registered; collisions.push(...r.collisions);
      for (const [source, v] of Object.entries(missing)) if (!r.collisions.some((c) => c.startsWith(`${source}:${v} `))) registry.set(`${source}:${v}`, { anilist_id: anilistId, registered_by: by });
    };
    // the backfill and the standing check: every stored row that carries an identity is registered (a halo row: anilist + mal; an adopted wiki / ruled row: those and its wiki key)
    for (const r of existing) {
      if (r.anilist_id == null) continue;
      if (r.origin === 'halo') await register(r.series_id, r.anilist_id, { anilist: r.anilist_id, mal: malOf(r.anilist_id) }, 'halo');
      else await register(r.series_id, r.anilist_id, { anilist: r.anilist_id, mal: malOf(r.anilist_id), wiki: wikiKey(r.series_id, r.position) }, 'adoption');
    }
    let inserted = 0, updated = 0, unpositioned = 0, held = 0, adopted = 0, dropped = 0, ambiguous = 0;
    const remove = async (r: Row, why: string) => {
      dropped++;
      takenBy.get(r.series_id)?.delete(Number(r.position)); // the slot frees in the dry run too, so the dry run shows the real re-insert
      if (DRY) { console.log(`  remove ${r.series_id} @${r.position} ${r.title} — ${why}`); return; }
      const { error } = await db.from('watch_order_entries').delete().eq('series_id', r.series_id).eq('position', r.position);
      if (error) throw new Error(`${r.series_id}@${r.position}: ${error.message}`);
    };
    // PRE-PASS — a ruled position moves a row: every mover is removed FIRST, then re-inserted at its ruled slot below. Two movers can swap
    // slots (Made in Abyss: the recap films ahead of the feature) — inserting over an occupied slot would overwrite that row's identity
    // (the key is series + position), so the slot must be free before the insert; a ruled slot still held by a NON-moving row is refused
    // E9 (I13 amended 2026-09-05): a row whose work is now a COMPONENT of its own series retires — the identity lives in the component
    const entriesOf = new Map<string, number>(); for (const o of input.owned.values()) entriesOf.set(o, (entriesOf.get(o) ?? 0) + 1);
    for (const r of retiredByOwnership(existing.map((x) => ({ seriesId: x.series_id, anilistId: x.anilist_id, origin: x.origin, row: x })), (id) => input.owned.get(id), (sid) => entriesOf.get(sid) ?? 0)) {
      const o = input.owned.get(r.anilistId!)!;
      await remove(r.row, o === r.seriesId ? `now a component of ${r.seriesId} (I13 e: a work owned by its own series is never its extra) — the identity lives in the component` : `now an entry of ${o}, a ${entriesOf.get(o)}-entry run (I13 d, the skip-split: a multi-entry run's entry is not another series' extra — the franchise page orders runs)`); byKey.delete(`${r.seriesId}#${r.anilistId}`);
      if ([...registry.values()].some((v) => v.anilist_id === r.anilistId)) {
        if (!DRY) { const { error } = await db.from('related_work_external_ids').delete().eq('anilist_id', r.anilistId); if (error) throw new Error(`registry ${r.anilistId}: ${error.message}`); }
        for (const [k, v] of registry) if (v.anilist_id === r.anilistId) registry.delete(k);
      }
    }
    // — planned BEFORE any row is touched (planRuledMoves): a mover whose ruled slot is held by a NON-moving row is refused and KEPT, never removed
    const ruledOf = (sid: string, id: number) => relatedWorkRuling(sid, id)?.position ?? RULED_POSITION_BY_ANILIST[sid]?.[id];
    const plan = planRuledMoves(existing.map((r) => ({ seriesId: r.series_id, anilistId: r.origin === 'halo' ? r.anilist_id : null, position: Number(r.position) })), ruledOf);
    for (const m of plan.refused) { ambiguous++; console.log(`  refused ${m.seriesId} @${m.to} for anilist ${m.anilistId} (stored @${m.from}): the ruled slot is held by ${m.heldBy ?? 'a row without identity'}, which is not moving — rule that row too; the row stays put (listed by the census)`); }
    for (const m of plan.moves) {
      const r = byKey.get(`${m.seriesId}#${m.anilistId}`);
      if (!r) continue;
      await remove(r, `moves to the ruled position ${m.to} (identity ${m.anilistId} keeps every field)`); byKey.delete(`${m.seriesId}#${m.anilistId}`);
    }
    for (const c of cands) {
      const m = input.staged.get(c.anilistId);
      const bucket = c.proposal as ExtraBucket;
      const date = m ? isoDate((m as { startDate?: { year?: number | null; month?: number | null; day?: number | null } | null }).startDate) : null;
      for (const sid of c.owners) {
        const key = `${sid}#${c.anilistId}`;
        let cur = byKey.get(key);
        // (e) a promotional entry is never a row — a halo row of ours goes (G57: our own origin only)
        if (!ledgerWorthy(bucket)) { // (e) a promotional entry is never a row — the ledger predicate lives in lib (E4)
          if (cur && cur.origin === 'halo') { await remove(cur, 'promotional entry (I45 amended: never a related work)'); byKey.delete(key); }
          // a promo is never a related work: its identity leaves the registry with its row (whether the row went this run or an earlier one) — no orphan
          if ([...registry.values()].some((v) => v.anilist_id === c.anilistId)) {
            if (!DRY) { const { error } = await db.from('related_work_external_ids').delete().eq('anilist_id', c.anilistId); if (error) throw new Error(`registry ${c.anilistId}: ${error.message}`); }
            for (const [k, v] of registry) if (v.anilist_id === c.anilistId) registry.delete(k);
          }
          continue;
        }
        // (I46) a wiki / ruled row naming this work ADOPTS the identity; a halo duplicate goes. lib/related-works#pickAdoption decides —
        // it fails closed (two fits with nothing to separate them → listed by the census as related_work_duplicate, never adopted)
        if (!cur || cur.origin === 'halo') {
          const pool = unkeyed.get(sid) ?? [];
          // identity FIRST (I46 / I44): a wiki row sitting at the position the label map rules for this AniList id IS this work, whatever its
          // title says ("Shin Kyoto-hen" vs "New Kyoto Arc"); the title match is the fallback, and it fails closed
          const labelPos = RULED_POSITION_BY_ANILIST[sid]?.[c.anilistId];
          const byRule = labelPos != null ? pool.find((r) => Number(r.position) === labelPos) : undefined;
          const pick = byRule ? { row: byRule, reason: `the label map rules this AniList id at @${labelPos} (identity, not a title match)` } : pickAdoption({ title: c.title, year: yearOf(date) }, pool, (titlesBy.get(sid) ?? []).filter((t) => t.id !== c.anilistId));
          if (pick && 'ambiguous' in pick) {
            ambiguous++;
            if (DRY) console.log(`  ambiguous ${sid} @${pick.row.position} "${pick.row.title}" ↔ ${c.title}: ${pick.ambiguous} — not adopted, listed by the census`);
          } else if (pick && 'reason' in pick) {
            const twin = pick.row;
            if (cur) { await remove(cur, `duplicate of the ${twin.origin ?? 'wiki'} row @${twin.position} (I46: one row per work)`); byKey.delete(key); }
            adopted++;
            if (DRY) console.log(`  adopt ${sid} @${twin.position} "${twin.title}" ← anilist ${c.anilistId} ${c.title} (${pick.reason}; the ${twin.origin ?? 'wiki'} row keeps its position, label and note)`);
            else {
              const { error } = await db.from('watch_order_entries').update({ anilist_id: c.anilistId, relation: twin.relation ?? [...c.relations].join('/') }).eq('series_id', sid).eq('position', twin.position);
              if (error) throw new Error(`${sid}@${twin.position}: ${error.message}`);
            }
            twin.anilist_id = c.anilistId; byKey.set(key, twin); unkeyed.set(sid, pool.filter((r) => r !== twin));
            await register(sid, c.anilistId, { anilist: c.anilistId, mal: malOf(c.anilistId), wiki: wikiKey(sid, twin.position) }, 'adoption'); // the join lives in the registry — it survives the row
            continue;
          }
        }
        if (cur && cur.origin !== 'halo') {
          // I45 ON AN ADOPTED ROW (2026-09-06, the BSD Walking Alone verifier: a ruling for a wiki-origin row landed nowhere and no class said so):
          // a wiki / ruled row models this work — its position, label and derived text are its own — but the RULED FACTS of the WORK (standing,
          // chapters, a repair, the ruling note) land on it exactly as on a halo row. A ruled POSITION is refused here (the fractional's position
          // is an identity-tier ruling of its own) and the census lists the disagreement (related_work_violation).
          const adoptedRuling = relatedWorkRuling(sid, c.anilistId);
          if (!adoptedRuling) { counters.unchanged++; continue; }
          const patch: Record<string, unknown> = {};
          if (adoptedRuling.standing !== undefined && cur.standing !== adoptedRuling.standing) patch.standing = adoptedRuling.standing;
          if (adoptedRuling.chapter !== undefined && (cur.chapter ?? null) !== adoptedRuling.chapter) patch.chapter = adoptedRuling.chapter;
          if (adoptedRuling.volume !== undefined && (cur.volume ?? null) !== adoptedRuling.volume) patch.volume = adoptedRuling.volume;
          if (adoptedRuling.chaptersAdapted !== undefined && (cur.chapters_adapted ?? null) !== adoptedRuling.chaptersAdapted) patch.chapters_adapted = adoptedRuling.chaptersAdapted;
          if (adoptedRuling.note && cur.note !== adoptedRuling.note) patch.note = adoptedRuling.note;
          if (adoptedRuling.title && cur.title !== adoptedRuling.title) patch.title = adoptedRuling.title;
          if (adoptedRuling.airDate !== undefined && (cur.air_date ?? null) !== adoptedRuling.airDate) patch.air_date = adoptedRuling.airDate;
          if (adoptedRuling.kind && cur.kind !== adoptedRuling.kind) patch.kind = adoptedRuling.kind;
          if (DRY && adoptedRuling.position != null && Number(cur.position) !== adoptedRuling.position) console.log(`  adopted ${sid} @${cur.position} ${c.title}: the ruled position ${adoptedRuling.position} is REFUSED on a ${cur.origin} row (its position is the fractional's own ruling) — listed by the census`);
          if (!Object.keys(patch).length) { counters.unchanged++; continue; }
          updated++;
          if (DRY) { console.log(`  update ${sid} @${cur.position} ${c.title} [${cur.origin} row — ruled ${Object.keys(patch).join(', ')}]`); continue; }
          const { error: ae } = await db.from('watch_order_entries').update(patch).eq('series_id', sid).eq('position', cur.position);
          if (ae) throw new Error(`${key}: ${ae.message}`);
          continue;
        }
        const ruling = relatedWorkRuling(sid, c.anilistId);
        const airDate = ruling?.airDate !== undefined ? ruling.airDate : date; // a ruled date (P8) beats AniList's
        const ruledPos = ruling?.position ?? RULED_POSITION_BY_ANILIST[sid]?.[c.anilistId];
        const derived = ruledPos ?? deriveWatchPosition(airDate, epsBy.get(sid) ?? []);
        if (derived == null && !cur) { unpositioned++; continue; } // no date, no ruling — listed by the census, never a guessed slot
        // IDENTITY is (series, anilist_id); POSITION is an attribute — ruled, else DERIVED, and a derived position re-derives on every run
        // (Sean 2026-09-05, the identity concern): a row moves when its ruled position changes, or when its unruled BASE SLOT changes (the
        // grid grew — a sequel season minted after the work's date; the air date corrected). Inside one slot a stored row keeps its 0.01
        // order (a wrong intra-slot order is a ruling, never a re-sort); a new arrival takes the next free step in air-date order.
        if (cur && ruling?.position == null && derived != null && Math.floor(Number(cur.position)) !== Math.floor(derived)) { await remove(cur, `re-derived: the base slot moved ${Math.floor(Number(cur.position))} → ${Math.floor(derived)} (the air date or the grid changed)`); byKey.delete(key); cur = undefined; }
        const position = cur ? Number(cur.position) : ruledPos ?? freePosition(derived!, takenBy.get(sid) ?? new Set());
        if (!cur && ruledPos != null && takenBy.get(sid)?.has(ruledPos)) { // the ruled slot is another (non-moving) row's — never overwrite an identity
          ambiguous++;
          if (DRY) console.log(`  refused ${sid} @${ruledPos} for ${c.title}: the ruled slot is held by another row — rule that row too (listed by the census)`);
          continue;
        }
        const standing = relatedWorkStanding(bucket, ruling);
        if (standing == null) held++;
        const row = {
          series_id: sid, position, anilist_id: c.anilistId, origin: 'halo', relation: [...c.relations].join('/'),
          kind: ruling?.kind ?? extraKind(c.format, bucket), standing, title: ruling?.title ?? c.title, air_date: airDate,
          chapter: ruling?.chapter ?? null, volume: ruling?.volume ?? null, chapters_adapted: ruling?.chaptersAdapted ?? null,
          note: `${bucketNote(bucket, adaptedNodes(m ?? null, ownerInstrumentSet({ mangaId: input.ownerManga.get(sid) ?? null, chainWorkIds: input.chainWorks?.get(sid) ?? [], instrumentIds: [...(input.ownerInstruments?.get(sid) ?? [])] })))} · position ${ruling?.position != null ? 'ruled (I45 ruling layer)' : ruledPos != null ? 'ruled' : 'derived from the air date (a proposal)'}${ruling?.standing ? ' · standing ruled (I45 ruling layer)' : ''}${ruling?.note ? ` · ${ruling.note}` : ''} · I45 halo`,
        };
        const same = cur && cur.origin === 'halo' && cur.standing === standing && cur.kind === row.kind && cur.title === row.title && cur.air_date === row.air_date && cur.relation === row.relation && cur.note === row.note
          && (cur.chapter ?? null) === row.chapter && (cur.volume ?? null) === row.volume && (cur.chapters_adapted ?? null) === row.chapters_adapted;
        if (same) { counters.unchanged++; continue; }
        if (cur) updated++; else { inserted++; takenBy.set(sid, new Set([...(takenBy.get(sid) ?? []), position])); }
        if (DRY) { if (inserted + updated <= 25) console.log(`  ${cur ? 'update' : 'insert'} ${sid} @${position} ${c.title} [${row.kind} ${standing ?? 'pending'}] ${bucket}`); continue; }
        const { error } = await db.from('watch_order_entries').upsert({ ...row, display_label: cur ? undefined : null }, { onConflict: 'series_id,position' });
        if (error) throw new Error(`${key}: ${error.message}`);
        await register(sid, c.anilistId, { anilist: c.anilistId, mal: malOf(c.anilistId) }, 'halo');
      }
    }
    // a halo row whose work the derivation now attributes ELSEWHERE (an alternative adaptation collapsed to the franchise base, I43) is ours to remove —
    // the edge did not vanish (that is P24's listing, related_work_stale); the RULE moved the row
    const ownersOf = new Map<number, Set<string>>(); for (const c of cands) ownersOf.set(c.anilistId, c.owners);
    for (const r of existing) {
      if (r.origin !== 'halo' || r.anilist_id == null) continue;
      const owners = ownersOf.get(r.anilist_id);
      if (owners && !owners.has(r.series_id)) await remove(r, `re-attributed by rule to ${[...owners].join(', ')} (an alternative adaptation sits once, under the franchise base — I16 / I43)`);
    }
    if (collisions.length) console.log(`  ${collisions.length} identity collision(s) refused (I46):\n    ${collisions.join('\n    ')}`);
    counters.changed = inserted + updated + adopted + dropped + registeredIds; counters.flagged = unpositioned + ambiguous + collisions.length;
    console.log(`[sync-related-works] ${cands.length} staged related works → ${inserted} inserted, ${updated} updated, ${counters.unchanged} unchanged, ${adopted} identities adopted by wiki / ruled rows (I46), ${dropped} halo rows removed (duplicates / promotional / moved), ${ambiguous} ambiguous matches left to the census, ${held} standing pending (the sitting), ${unpositioned} without a derivable position, ${registeredIds} identities registered${DRY ? ' — DRY RUN' : ''}`);
    await finishRun(runId, 'ok', counters, `related-works ledger: ${inserted} inserted, ${updated} updated, ${adopted} adopted, ${dropped} removed${DRY ? ' (dry run)' : ''}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
