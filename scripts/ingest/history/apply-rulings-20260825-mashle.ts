// Sean's fractional ruling, 2026-08-25 (CHUNK1-RECOVERY.md §9): in-between
// entries (specials/OVAs/recaps/movies) live at FRACTIONAL watch-order
// positions (the Crunchyroll/community convention), never absorbed as
// integer rows. Mashle's S1 recap sat as integer row 7 (AFL numbering),
// shifting every later row one off from AFG/fandom/Wikipedia/AniList and
// making the AFG anchors on rows 8-12 each one row early (batch-17 A1 lane
// finding, cross-model verified 4/4).
//
// This migration renumbers mashle to the community convention:
//   1. row 7 (recap) → watch_order_entries position 6.5, kind 'recap',
//      mirrored in ingest_fractionals with disposition 'excluded_recap'
//   2. episode rows 8-25 → 7-24 (titles/types/air dates travel with rows)
//   3. AFG anchors 1-12 STAY KEYED AS-IS — they were always in the
//      recap-exclusive space, so renumbering the rows under them makes
//      every one correct in place (verified: anchor(8)=20-23 is fandom ep 8
//      "Wolves of Magic", which becomes our row 8)
//   4. manual anchors 24/25 (batch-17 tail records, OLD numbering) move to
//      23/24; annotations move with them; ep-7 recap annotation retires
//      into the watch-order entry's note
//   5. aired_episodes 25 → 24 (components 1-12/13-24/25+ are already
//      correct for the new numbering)
// The durable guard is SOURCE_NUMBERING_SHIFTS['mashle-magic-and-muscles']
// (spaces: ['afl']) — AFL refreshes translate forever; AFG/wiki need no
// translation. Idempotent: each step checks state before writing.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-rulings-20260825-mashle.ts [--dry-run]

import { db } from '../lib/db';

const DRY = process.argv.includes('--dry-run');
const SID = 'mashle-magic-and-muscles';
const RECAP_TITLE = 'Mash Burnedead and the Mysterious Letter';

async function main() {
  const { data: eps } = await db.from('episodes').select('number,title,type,air_date').eq('series_id', SID).order('number');
  const byNum = new Map((eps ?? []).map((e) => [e.number, e]));
  const recap = byNum.get(7);
  const already = !recap || recap.title !== RECAP_TITLE;
  console.log(`[mashle] ${eps?.length} rows; row 7 = "${byNum.get(7)?.title ?? '(absent)'}"${already ? ' — renumber already done' : ''}${DRY ? ' — DRY RUN' : ''}`);

  if (!already) {
    // 1. recap → watch-order entry at 6.5 (+ ingest_fractionals record)
    console.log('  recap → watch_order_entries 6.5 (kind recap) + ingest_fractionals excluded_recap');
    if (!DRY) {
      await db.from('ingest_fractionals').upsert({
        series_id: SID, position: 6.5, source: 'ruling', title: RECAP_TITLE, air_date: recap!.air_date,
        disposition: 'excluded_recap',
        note: "Sean's fractional ruling 2026-08-25: S1 recap ('Episode 6.5' on mashle.fandom; excluded by Wikipedia/AniList; AFL numbers it 7) recaps chs 1-16 — community convention holds it between eps 6 and 7; AFL-space translation via SOURCE_NUMBERING_SHIFTS",
      }, { onConflict: 'series_id,position' });
      await db.from('watch_order_entries').upsert({
        series_id: SID, position: 6.5, title: RECAP_TITLE, air_date: recap!.air_date, kind: 'recap',
        chapter: null, chapters_adapted: '1-16 (recap)', volume: null, display_label: null,
        note: 'S1 recap episode (fandom "Episode 6.5") — recaps chs 1-16, adapts nothing new; surfacing decided at the specials/OVAs design pass',
      }, { onConflict: 'series_id,position' });
      // its stored anchor (ch 17-20) belongs to "Puppet Master" — the row that
      // becomes 7 — so the anchor row stays; only the recap's annotation retires
      await db.from('episode_annotations').delete().eq('series_id', SID).eq('episode', 7).eq('kind', 'abridged');
      await db.from('episodes').delete().eq('series_id', SID).eq('number', 7);
    }
    // 2. renumber rows 8-25 → 7-24, ascending so the PK is never contested
    for (let n = 8; n <= 25; n++) {
      if (!byNum.has(n)) continue;
      console.log(`  row ${n} → ${n - 1}  (${byNum.get(n)!.title.slice(0, 40)})`);
      if (!DRY) {
        const { error } = await db.from('episodes').update({ number: n - 1 }).eq('series_id', SID).eq('number', n);
        if (error) throw new Error(`row ${n}: ${error.message}`);
      }
    }
    // 3/4. manual tail anchors + their annotations move with their rows
    for (const n of [24, 25]) {
      console.log(`  anchor ${n} → ${n - 1} (manual tail record travels with its row)`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').update({ episode: n - 1 }).eq('series_id', SID).eq('episode', n);
        if (error) throw new Error(`anchor ${n}: ${error.message}`);
        await db.from('episode_annotations').update({ episode: n - 1 }).eq('series_id', SID).eq('episode', n);
      }
    }
    // 5. counts
    console.log('  aired_episodes 25 → 24');
    if (!DRY) await db.from('series').update({ aired_episodes: 24, updated_at: new Date().toISOString() }).eq('id', SID);
  }

  // verify outcomes, not intentions
  const { data: after } = await db.from('episodes').select('number,title,type').eq('series_id', SID).order('number');
  const { data: anch } = await db.from('chapter_anchors').select('episode,chapter,start_chapter,source').eq('series_id', SID).order('episode');
  const n7 = (after ?? []).find((e) => e.number === 7);
  const a7 = (anch ?? []).find((a) => a.episode === 7);
  console.log(`  VERIFY rows=${after?.length} (want 24${DRY ? ' after apply' : ''}); row 7 = "${n7?.title}" [${n7?.type}]; anchor 7 = ch ${a7?.start_chapter}-${a7?.chapter} (${a7?.source})`);
  const { data: wo } = await db.from('watch_order_entries').select('position,kind,title').eq('series_id', SID);
  console.log(`  watch_order_entries: ${JSON.stringify(wo)}`);
}
main().then(() => process.exit(0));
