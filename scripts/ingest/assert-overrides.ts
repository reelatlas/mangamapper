// Assert the per-episode ruling maps over STANDING rows (T6 types, G53 air
// dates) and the G54 air-date order gate. Overrides re-apply inside
// filterEpisodeRows on every episode WRITE, but a ruling that enters a map
// after a row's last write leaves the stored row stale until the next
// source refresh — the eyeshield ep-74 lesson (2026-08-25). This healer
// closes the gap mechanically; idempotent; pairs with the ruling_violation
// and airdate_withheld outcome checks. Formerly assert-type-overrides.ts
// (renamed 2026-08-26 when air dates joined; G54 joined the same day).
//   npx tsx --env-file=.env.ingest scripts/ingest/assert-overrides.ts [--dry-run]

import { db, selectAll } from './lib/db';
import { EPISODE_TYPE_OVERRIDES } from './lib/resolve';
import { AIR_DATE_OVERRIDES } from './lib/rulings/air-dates';
import { airdateOrderWalk } from './lib/airdate-order';
import { aflAnimeCanonStanding } from './lib/rulings/source-kinds';
import { STANDING_ANNOTATIONS } from './lib/rulings/standing-annotations';
import { upsertAnnotation } from './lib/annotations';
import { ANCHOR_SUPPRESSED } from './lib/rulings/anchor-suppressed';
import { LOCKED } from './lib/rulings/permanence';

const DRY = process.argv.includes('--dry-run');

async function assertMap(label: string, map: Record<string, Record<number, string>>, column: 'type' | 'air_date') {
  let fixed = 0, checked = 0;
  for (const [sid, m] of Object.entries(map)) {
    const nums = Object.keys(m).map(Number);
    const rows = await selectAll<{ number: number; type: string; air_date: string | null }>('episodes', 'number, type, air_date', (q) => q.eq('series_id', sid).in('number', nums));
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

async function main() {
  await assertStandings();
  await assertAnchorSuppression();
  await assertPermanence();
  await assertMap('types (T6)', EPISODE_TYPE_OVERRIDES, 'type');
  await assertStandingAnnotations();
  await assertMap('air dates (G53)', AIR_DATE_OVERRIDES, 'air_date');
  await assertAirdateOrder();
}
main().then(() => process.exit(0));
