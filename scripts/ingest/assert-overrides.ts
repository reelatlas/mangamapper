// Assert the per-episode ruling maps over STANDING rows (T6 types, G53 air
// dates) and the G54 air-date order gate. Overrides re-apply inside
// filterEpisodeRows on every episode WRITE, but a ruling that enters a map
// after a row's last write leaves the stored row stale until the next
// source refresh — the eyeshield ep-74 lesson (2026-08-25). This healer
// closes the gap mechanically; idempotent; pairs with the ruling_violation
// and airdate_withheld outcome checks. Formerly assert-type-overrides.ts
// (renamed 2026-08-26 when air dates joined; G54 joined the same day).
//   npx tsx --env-file=.env.ingest scripts/ingest/assert-overrides.ts [--dry-run]

import { AFG_CHART_SUPPRESSED } from './lib/rulings/afg-chart-suppressed';
import { db, selectAll } from './lib/db';
import { EPISODE_TYPE_OVERRIDES } from './lib/resolve';
import { AIR_DATE_OVERRIDES } from './lib/rulings/air-dates';
import { EPISODE_TITLE_OVERRIDES } from './lib/rulings/episode-titles';
import { airdateOrderWalk } from './lib/airdate-order';
import { aflAnimeCanonStanding } from './lib/rulings/source-kinds';
import { STANDING_ANNOTATIONS } from './lib/rulings/standing-annotations';
import { upsertAnnotation } from './lib/annotations';
import { ANCHOR_SUPPRESSED } from './lib/rulings/anchor-suppressed';
import { retiredBySeries, RETIRED_ANNOTATIONS } from './lib/rulings/retired-annotations';
import { LOCKED } from './lib/rulings/permanence';
import { FRANCHISES, FRANCHISE_OF, franchiseMapProblems } from './lib/rulings/franchises';
import { deriveVisibility } from './lib/rulings/visibility';
import { arcsPartitionProblems, RULED_ARCS } from './lib/rulings/arcs';
import { RULED_CORRESPONDENCE, upsertCorrespondence } from './lib/rulings/correspondence';
import { SOURCE_RELATION_OVERRIDES } from './lib/rulings/source-relations';
import { CHAPTER_SPACE_OVERRIDES } from './lib/rulings/chapter-spaces';
import { loadAllEpisodeTies, sideSourceStandingProblem } from './lib/side-source';

const DRY = process.argv.includes('--dry-run');

async function assertMap(label: string, map: Record<string, Record<number, string | null>>, column: 'type' | 'air_date' | 'title') {
  let fixed = 0, checked = 0;
  for (const [sid, m] of Object.entries(map)) {
    const nums = Object.keys(m).map(Number);
    const rows = await selectAll<{ number: number; type: string; air_date: string | null; title: string | null }>('episodes', 'number, type, air_date, title', (q) => q.eq('series_id', sid).in('number', nums));
    for (const r of rows) {
      checked++;
      const want = m[r.number];
      if (r[column] !== want) {
        console.log(`  ${sid} ep${r.number} ${column}: ${r[column]} → ${want}`);
        if (!DRY) {
          const { error } = await db.from('episodes').update({ [column]: want }).eq('series_id', sid).eq('number', r.number);
          if (error) throw new Error(`${sid} ep${r.number}: ${error.message}`);
        }
        fixed++;
      }
    }
  }
  console.log(`[assert-overrides] ${label}: ${checked} ruled rows checked, ${fixed} asserted${DRY ? ' — DRY RUN' : ''}`);
}

// G54: the air-date order gate over STANDING rows — the same walk the write
// gate runs; a deep out-of-order date that entered before the rule is
// withheld (NULL) here. Nothing is deleted; the audit class airdate_withheld
// (stored NULL where AFL staging has a date) is the review queue.
async function assertAirdateOrder() {
  const rows = await selectAll<{ series_id: string; number: number; air_date: string | null }>('episodes', 'series_id, number, air_date', (q) => q.not('air_date', 'is', null));
  const by = new Map<string, { number: number; air_date: string | null }[]>();
  for (const r of rows) {
    if (!by.has(r.series_id)) by.set(r.series_id, []);
    by.get(r.series_id)!.push(r);
  }
  let withheld = 0;
  for (const [sid, rs] of by) {
    const { withheld: w } = airdateOrderWalk(sid, rs);
    for (const x of w) {
      console.log(`  ${sid} ep${x.number} air_date ${x.date} → NULL (${x.days} d out of order against ep${x.against} ${x.againstDate}; G54)`);
      if (!DRY) {
        const { error } = await db.from('episodes').update({ air_date: null }).eq('series_id', sid).eq('number', x.number);
        if (error) throw new Error(`${sid} ep${x.number}: ${error.message}`);
      }
      withheld++;
    }
  }
  console.log(`[assert-overrides] air-date order (G54): ${by.size} series walked, ${withheld} dates withheld${DRY ? ' — DRY RUN' : ''}`);
}

// T27 (T4.3): a stored 'anime-only-canon' row is a pre-T4.3 leftover — it
// takes the standing its series' source kind gives AFL's class (original /
// game → canon, sourced → filler); T6 rulings are asserted right after and
// win. The migration 20260826200000 then forbids the value outright.
async function assertStandings() {
  const rows = await selectAll<{ series_id: string; number: number }>('episodes', 'series_id, number', (q) => q.eq('type', 'anime-only-canon'));
  if (!rows.length) { console.log('[assert-overrides] standings (T27): no anime-only-canon rows stand'); return; }
  const series = await selectAll<{ id: string; source_type: string | null }>('series', 'id, source_type');
  const kind = new Map(series.map((s) => [s.id, s.source_type]));
  const by = new Map<string, number>();
  for (const r of rows) {
    const standing = aflAnimeCanonStanding(kind.get(r.series_id));
    by.set(`${r.series_id}→${standing}`, (by.get(`${r.series_id}→${standing}`) ?? 0) + 1);
    if (!DRY) {
      const { error } = await db.from('episodes').update({ type: standing }).eq('series_id', r.series_id).eq('number', r.number);
      if (error) throw new Error(`${r.series_id} ep${r.number}: ${error.message}`);
    }
  }
  for (const [k, n] of by) console.log(`  ${k} ×${n}`);
  console.log(`[assert-overrides] standings (T27): ${rows.length} anime-only-canon rows → source-kind standing${DRY ? ' — DRY RUN' : ''}`);
}

// T26 (2026-09-05, the adoption sitting): a licence is not adoption — a canon /
// mixed row whose only source tie is an unadopted side_source is asserted
// FILLER over standing rows (lib/side-source.ts, the writer's default). A row
// a T6 pin holds canon / mixed is left to the pin and LISTED: the pin is the
// ruling, and if it restores Line A the census (side_source_unadopted →
// ruling_violation) says so. Runs AFTER the annotation maps and the T6 pins.
async function assertSideSourceStandings() {
  const ties = await loadAllEpisodeTies(); // annotations + anchors + (parallel series) correspondence rows — the census reads the same derivation
  let n = 0, pinned = 0;
  for (const e of await selectAll<{ series_id: string; number: number; type: string }>('episodes', 'series_id, number, type', (q) => q.in('type', ['canon', 'mixed']))) {
    const k = `${e.series_id}#${e.number}`;
    const t = ties.get(k);
    if (!t) continue;
    const problem = sideSourceStandingProblem(e.type, t);
    if (!problem) continue;
    const pin = EPISODE_TYPE_OVERRIDES[e.series_id]?.[e.number];
    if (pin && pin !== 'filler') { pinned++; console.log(`  ${e.series_id} ep${e.number}: ${problem} — held ${pin} by a T6 pin (the census lists it)`); continue; }
    n++;
    console.log(`  ${e.series_id} ep${e.number}: ${e.type} → filler (${problem.slice(0, 60)}…)`);
    if (!DRY) {
      const { error } = await db.from('episodes').update({ type: 'filler' }).eq('series_id', e.series_id).eq('number', e.number);
      if (error) throw new Error(`${e.series_id} ep${e.number}: ${error.message}`);
    }
  }
  console.log(`[assert-overrides] side_source standings (T26): ${n} rows → filler, ${pinned} held by a T6 pin${DRY ? ' — DRY RUN' : ''}`);
}

// T26: the ruled annotations exist for every row the map names — stamped
// origin 'ruling' — and every 'ruling' row the map no longer names is stale
// and is removed (batch 18: boruto 282-286 moved from adopted{community} to
// side_source; ajin's A-7 divergence spread shrank to 23-26; world-trigger 48
// divergence → side_story). Research-written rows ('research') are a batch
// apply's, never the map's to delete.
async function assertStandingAnnotations() {
  let n = 0, removed = 0;
  for (const [sid, list] of Object.entries(STANDING_ANNOTATIONS)) {
    const want = new Set<string>();
    for (const a of list) {
      for (const ep of a.episodes) {
        n++;
        want.add(`${ep}#${a.kind}`);
        if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind, basis: a.basis ?? null, chapters: a.chapters ?? null, note: a.note, origin: 'ruling' });
      }
    }
    const stored = await selectAll<{ episode: number; kind: string }>('episode_annotations', 'episode, kind', (q) => q.eq('series_id', sid).eq('origin', 'ruling'));
    for (const r of stored) {
      if (want.has(`${r.episode}#${r.kind}`)) continue;
      removed++;
      console.log(`  ${sid} ep${r.episode} ${r.kind}: ruling row not in STANDING_ANNOTATIONS → removed (stale)`);
      if (!DRY) {
        const { error } = await db.from('episode_annotations').delete().eq('series_id', sid).eq('episode', r.episode).eq('kind', r.kind);
        if (error) throw new Error(`${sid} ep${r.episode}: ${error.message}`);
      }
    }
    if (!DRY) await db.from('series').update({ asterisk_review: 'pending' }).eq('id', sid).is('asterisk_review', null);
  }
  console.log(`[assert-overrides] standing annotations (T26): ${n} rows asserted, ${removed} stale ruling rows removed, over ${Object.keys(STANDING_ANNOTATIONS).length} series${DRY ? ' — DRY RUN' : ''}`);
}

// A45: no annotation row stands on a key retired by ruling — any origin.
// The retirement entry IS the P24 deletion record; the writer gate refuses
// the key, so removing the standing row is the whole reconciliation.
async function assertRetiredAnnotations() {
  let removed = 0;
  for (const [sid, list] of retiredBySeries()) {
    const rows = await selectAll<{ episode: number; kind: string; origin: string | null }>('episode_annotations', 'episode, kind, origin', (q) => q.eq('series_id', sid).in('episode', list.map((x) => x.episode)));
    for (const r of rows) {
      if (!list.some((x) => x.episode === r.episode && x.kind === r.kind)) continue;
      console.log(`  ${sid} ep${r.episode} ${r.kind} (${r.origin ?? 'research'}): retired by ruling → removed (A45)`);
      if (!DRY) {
        const { error } = await db.from('episode_annotations').delete().eq('series_id', sid).eq('episode', r.episode).eq('kind', r.kind);
        if (error) throw new Error(`${sid} ep${r.episode} ${r.kind}: ${error.message}`);
      }
      removed++;
    }
  }
  console.log(`[assert-overrides] retired annotations (A45): ${RETIRED_ANNOTATIONS.size} ruled keys, ${removed} standing rows removed${DRY ? ' — DRY RUN' : ''}`);
}

// A44: no anchor stands on a row ruled position-less — the ruling entry IS
// the A6 triage, so the healer removes what the writers would now refuse.
async function assertAnchorSuppression() {
  let removed = 0;
  for (const [sid, eps] of Object.entries(ANCHOR_SUPPRESSED)) {
    const rows = await selectAll<{ episode: number; chapter: number; source: string }>('chapter_anchors', 'episode, chapter, source', (q) => q.eq('series_id', sid).in('episode', eps));
    for (const r of rows) {
      console.log(`  ${sid} ep${r.episode}: anchor ${r.source} → ch ${r.chapter} on a position-less row → removed (A44)`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', r.episode);
        if (error) throw new Error(`${sid} ep${r.episode}: ${error.message}`);
      }
      removed++;
    }
  }
  console.log(`[assert-overrides] anchor suppression (A44): ${Object.values(ANCHOR_SUPPRESSED).flat().length} ruled rows, ${removed} anchors removed${DRY ? ' — DRY RUN' : ''}`);
  // G26 on the CHART lane (2026-09-04): a series whose AFG chart is suppressed must hold NO afg-tier anchors — the writer's gate only
  // fires when the AFG sweep re-syncs the page (hash-gated), so the standing rows are asserted here (the eyeshield / T6 lesson)
  {
    let removed = 0;
    for (const sid of Object.keys(AFG_CHART_SUPPRESSED)) {
      const standing = await selectAll<{ episode: number }>('chapter_anchors', 'episode', (q) => q.eq('series_id', sid).eq('source', 'afg'));
      if (!standing.length) continue;
      const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('source', 'afg');
      if (error) throw new Error(`chart suppression ${sid}: ${error.message}`);
      removed += standing.length;
    }
    console.log(`[assert-overrides] chart suppression (G26): ${Object.keys(AFG_CHART_SUPPRESSED).length} ruled series, ${removed} afg anchors removed`);
  }
}

// P25: series.permanence mirrors the LOCKED map exactly
async function assertPermanence() {
  const rows = await selectAll<{ id: string; permanence: string | null }>('series', 'id, permanence');
  let n = 0;
  for (const r of rows) {
    const want = LOCKED.has(r.id) ? 'locked' : null;
    if ((r.permanence ?? null) === want) continue;
    n++;
    console.log(`  ${r.id}: permanence ${r.permanence} → ${want}`);
    if (!DRY) {
      const { error } = await db.from('series').update({ permanence: want }).eq('id', r.id);
      if (error) throw new Error(`${r.id}: ${error.message}`);
    }
  }
  console.log(`[assert-overrides] permanence (P25): ${LOCKED.size} locked, ${n} asserted${DRY ? ' — DRY RUN' : ''}`);
}

// I43: `franchises` rows + series.franchise_id mirror the ruling map (the
// permanence pattern): rows upserted, memberships asserted, a stored value the
// map does not state nulled, a stored franchise row the map does not state
// removed — converges in one run. A map with integrity problems is refused
// whole (fail closed), never half-mirrored.
async function assertFranchises() {
  const problems = franchiseMapProblems();
  if (problems.length) { console.log(`  franchises map REFUSED (I43): ${problems.join('; ')}`); return; }
  let asserted = 0, stale = 0;
  const rows = Object.entries(FRANCHISES).map(([id, f]) => ({ id, title: f.title, title_native: f.titleNative ?? null, note: f.note ?? null, base_series_id: f.base }));
  if (!DRY && rows.length) {
    const { error } = await db.from('franchises').upsert(rows, { onConflict: 'id' });
    if (error) throw new Error(`franchises upsert: ${error.message}`);
  }
  for (const r of await selectAll<{ id: string; franchise_id: string | null }>('series', 'id, franchise_id')) {
    const want = FRANCHISE_OF[r.id] ?? null;
    if ((r.franchise_id ?? null) === want) continue;
    asserted++;
    console.log(`  ${r.id}: franchise_id ${r.franchise_id ?? 'null'} → ${want ?? 'null'}`);
    if (!DRY) { const { error } = await db.from('series').update({ franchise_id: want }).eq('id', r.id); if (error) throw new Error(`${r.id}: ${error.message}`); }
  }
  for (const f of await selectAll<{ id: string }>('franchises', 'id')) {
    if (FRANCHISES[f.id]) continue;
    stale++;
    console.log(`  franchise '${f.id}': stored but not in the map → removed (stale, P24)`);
    if (!DRY) { const { error } = await db.from('franchises').delete().eq('id', f.id); if (error) throw new Error(`franchise ${f.id}: ${error.message}`); }
  }
  console.log(`[assert-overrides] franchises (I43): ${rows.length} franchises, ${Object.keys(FRANCHISE_OF).length} memberships, ${asserted} asserted, ${stale} stale rows removed${DRY ? ' — DRY RUN' : ''}`);
}

// P39: series.visibility mirrors the derivation (public ⇔ an afl / afg
// registration or a PUBLISHED ruling; else staged) — a seeded series stays
// hidden from list and search until a classifier lands or a ruling publishes it.
async function assertVisibility() {
  const has = new Map<string, { afl: boolean; afg: boolean }>();
  for (const e of await selectAll<{ series_id: string; source: string }>('series_external_ids', 'series_id, source', (q) => q.in('source', ['afl', 'afg']))) {
    const h = has.get(e.series_id) ?? { afl: false, afg: false };
    if (e.source === 'afl') h.afl = true; else h.afg = true;
    has.set(e.series_id, h);
  }
  let n = 0, staged = 0;
  for (const r of await selectAll<{ id: string; visibility: string | null }>('series', 'id, visibility')) {
    const want = deriveVisibility(r.id, has.get(r.id) ?? { afl: false, afg: false });
    if (want === 'staged') staged++;
    if ((r.visibility ?? 'public') === want) continue;
    n++;
    console.log(`  ${r.id}: visibility ${r.visibility ?? 'null'} → ${want}`);
    if (!DRY) { const { error } = await db.from('series').update({ visibility: want }).eq('id', r.id); if (error) throw new Error(`${r.id}: ${error.message}`); }
  }
  console.log(`[assert-overrides] visibility (P39): ${staged} staged, ${n} asserted${DRY ? ' — DRY RUN' : ''}`);
}

// A46: series_arcs mirrors RULED_ARCS (origin 'ruling'); a parallel series'
// arcs must partition 1..N — a map that does not is refused, never half-written.
async function assertArcs() {
  let n = 0, removed = 0, refused = 0;
  for (const [sid, arcs] of Object.entries(RULED_ARCS)) {
    const parallel = SOURCE_RELATION_OVERRIDES[sid]?.relation === 'parallel';
    const { data: maxRow } = await db.from('episodes').select('number').eq('series_id', sid).order('number', { ascending: false }).limit(1);
    const problems = arcsPartitionProblems(arcs, parallel ? maxRow?.[0]?.number ?? 0 : 0);
    if (problems.length) { refused++; console.log(`  ${sid}: RULED_ARCS refused — ${problems.join('; ')}`); continue; }
    const rows = arcs.map((a, i) => ({ series_id: sid, ordinal: i + 1, label: a.label, kind: a.kind, ep_start: a.epStart ?? null, ep_end: a.epEnd ?? null, ch_start: a.chStart ?? null, ch_end: a.chEnd ?? null, note: a.note, origin: 'ruling' }));
    n += rows.length;
    if (!DRY) {
      const { error } = await db.from('series_arcs').upsert(rows, { onConflict: 'series_id,ordinal' });
      if (error) throw new Error(`${sid} arcs: ${error.message}`);
    }
    const stale = await selectAll<{ ordinal: number }>('series_arcs', 'ordinal', (q) => q.eq('series_id', sid).eq('origin', 'ruling').gt('ordinal', rows.length));
    for (const r of stale) {
      removed++;
      console.log(`  ${sid} arc #${r.ordinal}: ruling row not in RULED_ARCS → removed (stale)`);
      if (!DRY) await db.from('series_arcs').delete().eq('series_id', sid).eq('ordinal', r.ordinal);
    }
  }
  console.log(`[assert-overrides] arcs (A46): ${n} rows asserted over ${Object.keys(RULED_ARCS).length} series, ${removed} stale removed, ${refused} maps refused${DRY ? ' — DRY RUN' : ''}`);
}

// A46: ruled correspondence rows mirror RULED_CORRESPONDENCE (origin 'ruling');
// research rows (an apply) are left alone.
async function assertCorrespondence() {
  let n = 0, removed = 0;
  for (const [sid, rows] of Object.entries(RULED_CORRESPONDENCE)) {
    const want = new Set(rows.map((r) => `${r.episode ?? '-'}:${r.chStart ?? '-'}-${r.chEnd ?? '-'}:${r.alignment}`));
    for (const r of rows) { n++; if (!DRY) await upsertCorrespondence(sid, r, 'ruling'); }
    const stored = await selectAll<{ id: number; episode: number | null; ch_start: number | null; ch_end: number | null; alignment: string }>('episode_correspondence', 'id, episode, ch_start, ch_end, alignment', (q) => q.eq('series_id', sid).eq('origin', 'ruling'));
    for (const s of stored) {
      const key = `${s.episode ?? '-'}:${s.ch_start == null ? '-' : Number(s.ch_start)}-${s.ch_end == null ? '-' : Number(s.ch_end)}:${s.alignment}`;
      if (want.has(key)) continue;
      removed++;
      console.log(`  ${sid} correspondence ${key}: ruling row not in RULED_CORRESPONDENCE → removed (stale)`);
      if (!DRY) await db.from('episode_correspondence').delete().eq('id', s.id);
    }
  }
  console.log(`[assert-overrides] correspondence (A46): ${n} ruled rows asserted, ${removed} stale removed${DRY ? ' — DRY RUN' : ''}`);
}

// A46: no anchor and no continue point stands on a PARALLEL series — the
// writers now refuse them; the relation ruling is the A6 triage record, so
// the healer removes what the writers would refuse and lists each row.
async function assertParallelNoAnchors() {
  let removed = 0;
  for (const [sid, r] of Object.entries(SOURCE_RELATION_OVERRIDES)) {
    if (r.relation !== 'parallel') continue;
    const rows = await selectAll<{ episode: number; chapter: number; source: string }>('chapter_anchors', 'episode, chapter, source', (q) => q.eq('series_id', sid));
    for (const a of rows) {
      console.log(`  ${sid} ep${a.episode}: anchor ${a.source} → ch ${a.chapter} on a parallel series → removed (A46; the ep→ch is correspondence, not a position)`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', a.episode);
        if (error) throw new Error(`${sid} ep${a.episode}: ${error.message}`);
      }
      removed++;
    }
  }
  console.log(`[assert-overrides] parallel series (A46): ${Object.values(SOURCE_RELATION_OVERRIDES).filter((r) => r.relation === 'parallel').length} ruled, ${removed} anchors removed${DRY ? ' — DRY RUN' : ''}`);
}

// N35: series totals mirror the ruled chapter space (a re-derive cannot undo it)
async function assertChapterSpaces() {
  let n = 0;
  for (const [sid, r] of Object.entries(CHAPTER_SPACE_OVERRIDES)) {
    const { data: s } = await db.from('series').select('total_chapters, total_volumes, latest_known_chapters').eq('id', sid).maybeSingle();
    if (!s) continue;
    // a latest_known above the ruled ceiling is the source's unit count (dai 349 vs the printed 348) — clamp it (N35)
    const latest = s.latest_known_chapters != null && s.latest_known_chapters > r.chapters ? r.chapters : s.latest_known_chapters;
    const want = { total_chapters: r.chapters, total_volumes: r.volumes ?? s.total_volumes, latest_known_chapters: latest };
    if (s.total_chapters === want.total_chapters && s.total_volumes === want.total_volumes && s.latest_known_chapters === want.latest_known_chapters) continue;
    n++;
    console.log(`  ${sid}: totals ${s.total_chapters}/${s.total_volumes} → ${want.total_chapters}/${want.total_volumes}${s.latest_known_chapters !== want.latest_known_chapters ? ` (latest_known ${s.latest_known_chapters} → ${want.latest_known_chapters})` : ''} (N35)`);
    if (!DRY) {
      const { error } = await db.from('series').update(want).eq('id', sid);
      if (error) throw new Error(`${sid}: ${error.message}`);
    }
  }
  console.log(`[assert-overrides] chapter spaces (N35): ${Object.keys(CHAPTER_SPACE_OVERRIDES).length} ruled, ${n} asserted${DRY ? ' — DRY RUN' : ''}`);
}

async function main() {
  await assertStandings();
  await assertChapterSpaces();
  await assertParallelNoAnchors();
  await assertArcs();
  await assertCorrespondence();
  await assertAnchorSuppression();
  await assertPermanence();
  await assertFranchises();
  await assertVisibility();
  await assertMap('types (T6)', EPISODE_TYPE_OVERRIDES, 'type');
  await assertRetiredAnnotations();
  await assertStandingAnnotations();
  // T26: AFTER the annotation maps have landed (an adopted{basis} / chain_source /
  // side_story written above is what exempts a row) and AFTER the T6 pins — the
  // healer must converge in one run (the G54 lesson)
  await assertSideSourceStandings();
  await assertMap('air dates (G53)', AIR_DATE_OVERRIDES, 'air_date');
  await assertMap('titles (G53)', EPISODE_TITLE_OVERRIDES, 'title');
  await assertAirdateOrder();
}
main().then(() => process.exit(0));
