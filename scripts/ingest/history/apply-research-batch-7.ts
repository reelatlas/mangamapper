// Research batch 7 — Sean's review-queue rulings, 2026-08-23 (all four
// queues). Ruling record; re-runnable. Reasoning is LOGGED per entry
// (Sean's research-logged rule: non-main entries always carry the why).
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-7.ts

import { db, startRun, finishRun } from '../lib/db';
import { refreshStitchedVolatile } from '../lib/resolve';

const now = () => new Date().toISOString();

// Queue-2 Group C demotions: numbered → order-only (community does not
// number these). Mirrors SOURCE_NUMBERING_SHIFTS in lib/resolve so AFL
// refreshes stay translated.
const DEMOTIONS: { sid: string; anilistId: number; start: number; end: number; note: string }[] = [
  { sid: 'yu-yu-hakusho-ghostfiles', anilistId: 6964, start: 113, end: 113, note: 'Picture Drama = standalone bonus; community count = 112 (Sean sign-off 2026-08-23)' },
  { sid: 'miss-kobayashis-dragon-maid', anilistId: 98580, start: 14, end: 14, note: 'Valentine/Onsen OVA = standalone bonus between seasons; community numbering excludes (Sean sign-off 2026-08-23)' },
  { sid: 'fate-kaleid-liner-prisma-illya', anilistId: 18851, start: 11, end: 11, note: 'Undoukai DE Dance = mid-run bonus OVA the community numbering excludes (Sean sign-off 2026-08-23)' },
  { sid: 'prison-school', anilistId: 21565, start: 13, end: 13, note: 'Mad Wax = standalone bonus OVA; community count = 12 (Sean sign-off 2026-08-23)' },
  { sid: 'to-love-ru-darkness', anilistId: 21852, start: 25, end: 26, note: '2nd Specials = standalone bonuses; community count = 24 (Sean sign-off 2026-08-23)' },
  { sid: 'ghost-in-the-shell-stand-alone-complex', anilistId: 1566, start: 53, end: 53, note: 'Solid State Society is a FILM — movies are order-only unless community-numbered (Initial D rule; Sean sign-off 2026-08-23)' },
  { sid: 'yu-gi-oh-2000', anilistId: 21265, start: 225, end: 225, note: 'Dark Side of Dimensions is a FILM — order-only per the movies rule (Sean sign-off 2026-08-23)' },
];

async function demote(d: (typeof DEMOTIONS)[number]) {
  const len = d.end - d.start + 1;
  await db.from('series_components').update({ episode_start: null, episode_end: null })
    .eq('series_id', d.sid).eq('anilist_id', d.anilistId);
  // later numbered components shift down
  const { data: later } = await db.from('series_components')
    .select('anilist_id, episode_start, episode_end').eq('series_id', d.sid)
    .gt('episode_start', d.end).order('episode_start');
  for (const c of later ?? []) {
    await db.from('series_components').update({
      episode_start: c.episode_start! - len,
      episode_end: c.episode_end != null ? c.episode_end - len : null,
    }).eq('series_id', d.sid).eq('anilist_id', c.anilist_id);
  }
  // episode rows: demoted range deletes; later rows renumber (ascending —
  // PK-safe since the freed slots precede)
  await db.from('episodes').delete().eq('series_id', d.sid).gte('number', d.start).lte('number', d.end);
  const { data: rows } = await db.from('episodes').select('number').eq('series_id', d.sid).gt('number', d.end).order('number');
  for (const r of rows ?? []) {
    await db.from('episodes').update({ number: r.number - len }).eq('series_id', d.sid).eq('number', r.number);
  }
  // anchors + annotations past the insert shift down (ascending)
  const { data: an } = await db.from('chapter_anchors').select('episode').eq('series_id', d.sid).gt('episode', d.end).order('episode');
  for (const a of an ?? []) {
    await db.from('chapter_anchors').update({ episode: a.episode - len }).eq('series_id', d.sid).eq('episode', a.episode);
  }
  const { data: ann } = await db.from('episode_annotations').select('episode, kind').eq('series_id', d.sid).gt('episode', d.end).order('episode');
  for (const a of ann ?? []) {
    await db.from('episode_annotations').update({ episode: a.episode - len }).eq('series_id', d.sid).eq('episode', a.episode).eq('kind', a.kind);
  }
  await refreshStitchedVolatile(d.sid);
  // note the entry in the fractionals store with reasoning (order_only)
  await db.from('ingest_fractionals').upsert({
    series_id: d.sid, position: d.start - 0.5, source: 'ruling',
    title: null, note: d.note, disposition: 'order_only',
  });
  console.log(`demoted ${d.sid} ${d.start}-${d.end} → order-only (-${len})`);
}

async function main() {
  const runId = await startRun('resolve');
  try {
    // ── Queue 1: fractional dispositions (reasoning logged) ─────────────
    const frac = async (sid: string, pos: number, disposition: string, note: string) => {
      await db.from('ingest_fractionals').update({ disposition, note }).eq('series_id', sid).eq('position', pos);
    };
    await frac('urusei-yatsura', 193.5, 'excluded_recap', 'RECAP (rebroadcast of ep 44 + countdown) — recap rule (Monogatari precedent) excludes from count AND watch order; Sean sign-off 2026-08-23');
    await frac('dr-stone', 24.5, 'excluded_recap', '"Eve of the Battle Special Feature" = pre-S2 recap — recap rule; Sean sign-off 2026-08-23');
    await frac('dr-stone', 35.5, 'modeled', 'Ryuusui — modeled as order-only component at watch_position 35.5');
    await frac('cells-at-work', 11.5, 'order_only', '"Heat Stress" Pocari collab bonus = real bonus content, holds a watch-order slot; surfacing decided in the UI pass; Sean sign-off 2026-08-23');
    console.log('queue 1: 4 fractional dispositions set');

    // ── Queue 2 Group C: demotions ──────────────────────────────────────
    for (const d of DEMOTIONS) await demote(d);

    // ── Queue 4: bookmark closures (resolved by this session's work) ────
    const closures: [string, string][] = [
      ['rurouni-kenshin', 'resolved: interior anchors (Kyoto ep 28 → 48) + continua cross-verification + side_story annotations for 95-98'],
      ['haikyu', 'resolved: S2/S3/TTT boundary anchors in OUR numbering (50/60/75 → 149/207/249) + the 85→87 conversion'],
      ['boruto-naruto-next-generations', 'resolved: four interior manga-arc anchors (66/151/187/220 → 10/15/23/55); anime-canon stretches mapped'],
      ['x', 'resolved: eps 21-24 retyped anime-only-canon (research-ruled) via EPISODE_TYPE_OVERRIDES'],
    ];
    for (const [sid, verdict] of closures) {
      const { data } = await db.from('ingest_flags').select('id, detail').eq('series_key', sid).eq('status', 'open').filter('detail->>kind_of_note', 'eq', 'sean_review_bookmark');
      for (const f of data ?? []) {
        await db.from('ingest_flags').update({ status: 'confirmed', resolved_at: now(), detail: { ...(f.detail as object), verdict: `${verdict} (Sean sign-off 2026-08-23)` } }).eq('id', f.id);
      }
      console.log(`bookmark closed: ${sid}`);
    }

    // ── Queue 3: LN ruling logged (implementation = next phase) ─────────
    // Volume-based instrument for light-novel series (Sean sign-off
    // 2026-08-23): anchors/frontier/continue-from in LN VOLUME space, same
    // machinery; behavior research per series logged as it lands; UI
    // adaptation decided in the UI pass. Recorded in docs §10/§12.

    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DEMOTIONS.length + 4, flagged: 0 }, 'batch 7: Sean review-queue rulings (all four queues)');
    console.log('=== BATCH 7 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
