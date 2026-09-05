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
import { adaptedNodes, deriveWatchPosition, extraKind, freePosition, isoDate, pickAdoption, relatedWorkStanding, type ExtraBucket } from './lib/related-works';
import { relatedWorkRuling } from './lib/rulings/related-works';
import { RULED_POSITION_BY_ANILIST } from './lib/rulings/watch-order-labels';

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
    let inserted = 0, updated = 0, unpositioned = 0, held = 0, adopted = 0, dropped = 0, ambiguous = 0;
    const remove = async (r: Row, why: string) => {
      dropped++;
      if (DRY) { console.log(`  remove ${r.series_id} @${r.position} ${r.title} — ${why}`); return; }
      const { error } = await db.from('watch_order_entries').delete().eq('series_id', r.series_id).eq('position', r.position);
      if (error) throw new Error(`${r.series_id}@${r.position}: ${error.message}`);
      takenBy.get(r.series_id)?.delete(Number(r.position));
    };
    for (const c of cands) {
      const m = input.staged.get(c.anilistId);
      const bucket = c.proposal as ExtraBucket;
      const date = m ? isoDate((m as { startDate?: { year?: number | null; month?: number | null; day?: number | null } | null }).startDate) : null;
      for (const sid of c.owners) {
        const key = `${sid}#${c.anilistId}`;
        let cur = byKey.get(key);
        // (e) a promotional entry is never a row — a halo row of ours goes (G57: our own origin only)
        if (bucket === 'promo') { if (cur && cur.origin === 'halo') { await remove(cur, 'promotional entry (I45 amended: never a related work)'); byKey.delete(key); } continue; }
        // (I46) a wiki / ruled row naming this work ADOPTS the identity; a halo duplicate goes. lib/related-works#pickAdoption decides —
        // it fails closed (two fits with nothing to separate them → listed by the census as related_work_duplicate, never adopted)
        if (!cur || cur.origin === 'halo') {
          const pool = unkeyed.get(sid) ?? [];
          const pick = pickAdoption({ title: c.title, year: yearOf(date) }, pool, (titlesBy.get(sid) ?? []).filter((t) => t.id !== c.anilistId));
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
            continue;
          }
        }
        if (cur && cur.origin !== 'halo') { counters.unchanged++; continue; } // a wiki / ruled row models this work — never overwritten here
        const ruling = relatedWorkRuling(sid, c.anilistId);
        const ruledPos = ruling?.position ?? RULED_POSITION_BY_ANILIST[sid]?.[c.anilistId];
        const derived = ruledPos ?? deriveWatchPosition(date, epsBy.get(sid) ?? []);
        if (derived == null && !cur) { unpositioned++; continue; } // no date, no ruling — listed by the census, never a guessed slot
        // IDENTITY is (series, anilist_id); POSITION is an attribute — ruled, else DERIVED, and a derived position re-derives on every run
        // (Sean 2026-09-05, the identity concern): a row moves when its ruled position changes, or when its unruled BASE SLOT changes (the
        // grid grew — a sequel season minted after the work's date; the air date corrected). Inside one slot a stored row keeps its 0.01
        // order (a wrong intra-slot order is a ruling, never a re-sort); a new arrival takes the next free step in air-date order.
        if (cur && ruling?.position != null && Number(cur.position) !== ruling.position) { await remove(cur, `moved to the ruled position ${ruling.position}`); byKey.delete(key); cur = undefined; }
        else if (cur && ruling?.position == null && derived != null && Math.floor(Number(cur.position)) !== Math.floor(derived)) { await remove(cur, `re-derived: the base slot moved ${Math.floor(Number(cur.position))} → ${Math.floor(derived)} (the grid changed)`); byKey.delete(key); cur = undefined; }
        const position = cur ? Number(cur.position) : ruling?.position ?? freePosition(derived!, takenBy.get(sid) ?? new Set());
        const standing = relatedWorkStanding(bucket, ruling);
        if (standing == null) held++;
        const row = {
          series_id: sid, position, anilist_id: c.anilistId, origin: 'halo', relation: [...c.relations].join('/'),
          kind: extraKind(c.format, bucket), standing, title: c.title, air_date: date,
          chapter: ruling?.chapter ?? null, volume: ruling?.volume ?? null, chapters_adapted: ruling?.chaptersAdapted ?? null,
          note: `${bucketNote(bucket, adaptedNodes(m ?? null))} · position ${ruling?.position != null ? 'ruled (I45 ruling layer)' : ruledPos != null ? 'ruled' : 'derived from the air date (a proposal)'}${ruling?.standing ? ' · standing ruled (I45 ruling layer)' : ''}${ruling?.note ? ` · ${ruling.note}` : ''} · I45 halo`,
        };
        const same = cur && cur.origin === 'halo' && cur.standing === standing && cur.kind === row.kind && cur.title === row.title && cur.air_date === row.air_date && cur.relation === row.relation && cur.note === row.note
          && (cur.chapter ?? null) === row.chapter && (cur.volume ?? null) === row.volume && (cur.chapters_adapted ?? null) === row.chapters_adapted;
        if (same) { counters.unchanged++; continue; }
        if (cur) updated++; else { inserted++; takenBy.set(sid, new Set([...(takenBy.get(sid) ?? []), position])); }
        if (DRY) { if (inserted + updated <= 25) console.log(`  ${cur ? 'update' : 'insert'} ${sid} @${position} ${c.title} [${row.kind} ${standing ?? 'pending'}] ${bucket}`); continue; }
        const { error } = await db.from('watch_order_entries').upsert({ ...row, display_label: cur ? undefined : null }, { onConflict: 'series_id,position' });
        if (error) throw new Error(`${key}: ${error.message}`);
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
    counters.changed = inserted + updated + adopted + dropped; counters.flagged = unpositioned + ambiguous;
    console.log(`[sync-related-works] ${cands.length} staged related works → ${inserted} inserted, ${updated} updated, ${counters.unchanged} unchanged, ${adopted} identities adopted by wiki / ruled rows (I46), ${dropped} halo rows removed (duplicates / promotional / moved), ${ambiguous} ambiguous matches left to the census, ${held} standing pending (the sitting), ${unpositioned} without a derivable position${DRY ? ' — DRY RUN' : ''}`);
    await finishRun(runId, 'ok', counters, `related-works ledger: ${inserted} inserted, ${updated} updated, ${adopted} adopted, ${dropped} removed${DRY ? ' (dry run)' : ''}`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err).slice(0, 200));
    throw err;
  }
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
