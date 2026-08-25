// Sean's wave-2 structural rulings, 2026-08-25 (verifier-confirmed; records:
// CHUNK1-RECOVERY.md §13-§14, docs §12). Three one-time migrations, each
// idempotent and each with its durable guard named:
//
// 1. SAINT-SEIYA CHAPTER-SPACE MIGRATION — stored space (Wikipedia's 110)
//    contains ONE phantom chapter: "ch 30" 金牛宮の戦闘, which is anime
//    episode 43's title (en-WP even preserved the anime's ruby gloss
//    "Batoru"). True tankōbon space = 109 chapters, UNIFORM −1 for stored
//    values ≥ 30 (the verifier REFUTED the verdict's second phantom at ch 53
//    and its "+2 from 50" leg — Shueisha's own vol-15 TOC has 4 chapters).
//    Migrates volume_boundaries (manga 31045) and ALL saint-seiya anchors
//    (chapter/start/continue values ≥ 30 shift −1). Run AFTER the batch
//    apply so the fresh wave-2 anchors (delivered in stored space) convert
//    too. series.total_chapters (249) is AniList count-space — untouched.
//    Also fixes the verdict's ep-31 row defect (start 25 → 24, adapted
//    "24-25"). Durable guard: the corrected boundaries carry
//    source='research' notes; Wikipedia re-ingest disagreement FLAGS, never
//    overwrites research rows.
// 2. PROJECT-ARMS PHANTOM ROW — episode row 53 "PS2 Video Game" is an
//    animefillerlist artifact (a Bandai PS2 game, air date 2002-03-28 —
//    BEFORE ep 52's 03-30). The row is deleted here; its mu anchor is
//    deleted by the batch's DELETIONS_APPROVED; counts 53→52 via
//    SERIES_UPDATES. Durable guard: COMMUNITY_COUNT_OVERRIDES cap 52 (added
//    in lib/resolve.ts alongside this script) so the next AFL refresh
//    cannot resurrect the row.
// 3. TRIGUN MU CROSS-ASSOCIATION — ingest_mangaupdates maps our AniList
//    30703 (Trigun, 3 vols/20 ch) to mu_series 30005048940 "Trigun Maximum"
//    (latest 102). Wrong auto-match: the association row is deleted and
//    series.latest_known_chapters nulled (total_chapters=23 governs a
//    finished manga; bestLatestKnown re-derives only from a correct row).
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-rulings-20260825b.ts [--dry-run]

import { db } from './lib/db';

const DRY = process.argv.includes('--dry-run');
const SS = 'saint-seiya-knights-of-the-zodiac';
const SS_MANGA = 31045;

async function main() {
  console.log(`[rulings-20260825b]${DRY ? ' DRY RUN' : ''}`);

  // ---- 1. saint-seiya space migration (idempotence marker: v8 end 31 → 30)
  const { data: v8 } = await db.from('volume_boundaries').select('chapter_end').eq('manga_anilist_id', SS_MANGA).eq('volume', 8).maybeSingle();
  if (v8?.chapter_end === 31) {
    const { data: bounds } = await db.from('volume_boundaries').select('volume, chapter_start, chapter_end').eq('manga_anilist_id', SS_MANGA).order('volume');
    for (const b of bounds ?? []) {
      const ns = b.chapter_start >= 30 ? b.chapter_start - 1 : b.chapter_start;
      const ne = b.chapter_end != null && b.chapter_end >= 30 ? b.chapter_end - 1 : b.chapter_end;
      if (ns !== b.chapter_start || ne !== b.chapter_end) {
        console.log(`  ss boundary v${b.volume}: ${b.chapter_start}-${b.chapter_end} → ${ns}-${ne}`);
        if (!DRY) {
          const { error } = await db.from('volume_boundaries')
            .update({ chapter_start: ns, chapter_end: ne, source: 'research', source_page: 'phantom-ch-30 space migration (Sean 2026-08-25, §12): true tankōbon space 109 per Shueisha TOCs; uniform −1 for stored ≥30' })
            .eq('manga_anilist_id', SS_MANGA).eq('volume', b.volume);
          if (error) throw new Error(`ss v${b.volume}: ${error.message}`);
        }
      }
    }
    const { data: anchors } = await db.from('chapter_anchors').select('episode, chapter, start_chapter, continue_chapter, note').eq('series_id', SS).order('episode');
    for (const a of anchors ?? []) {
      const nc = a.chapter >= 30 ? a.chapter - 1 : a.chapter;
      const nsc = a.start_chapter != null && a.start_chapter >= 30 ? a.start_chapter - 1 : a.start_chapter;
      const ncc = a.continue_chapter != null && a.continue_chapter >= 30 ? a.continue_chapter - 1 : a.continue_chapter;
      if (nc !== a.chapter || nsc !== a.start_chapter || ncc !== a.continue_chapter) {
        console.log(`  ss anchor ep${a.episode}: ch ${a.start_chapter}-${a.chapter} → ${nsc}-${nc}`);
        if (!DRY) {
          const note = `${String(a.note ?? '')} | space migration −1 (phantom ch 30 removed, Sean 2026-08-25)`.slice(0, 1200);
          const { error } = await db.from('chapter_anchors')
            .update({ chapter: nc, start_chapter: nsc, continue_chapter: ncc, note })
            .eq('series_id', SS).eq('episode', a.episode);
          if (error) throw new Error(`ss ep${a.episode}: ${error.message}`);
        }
      }
    }
  } else {
    console.log('  ss space migration: already done (v8 end ≠ 31)');
  }
  // ep-31 verdict defect (post-migration values: adapted "24-25" → start 24)
  const { data: e31 } = await db.from('chapter_anchors').select('start_chapter, chapters_adapted').eq('series_id', SS).eq('episode', 31).maybeSingle();
  if (e31 && e31.start_chapter === 25 && String(e31.chapters_adapted ?? '').startsWith('24')) {
    console.log('  ss ep31: start 25 → 24 (verdict row defect — adapted "24-25")');
    if (!DRY) await db.from('chapter_anchors').update({ start_chapter: 24 }).eq('series_id', SS).eq('episode', 31);
  }

  // ---- 2. project-arms phantom row
  const { data: row53 } = await db.from('episodes').select('title').eq('series_id', 'project-arms').eq('number', 53).maybeSingle();
  if (row53) {
    console.log(`  project-arms: deleting phantom row 53 ("${row53.title}")`);
    if (!DRY) {
      const { error } = await db.from('episodes').delete().eq('series_id', 'project-arms').eq('number', 53);
      if (error) throw new Error(`pa row53: ${error.message}`);
    }
  } else {
    console.log('  project-arms row 53: already absent');
  }

  // ---- 3. trigun MU cross-association
  const { data: mu } = await db.from('ingest_mangaupdates').select('mu_series_id').eq('manga_anilist_id', 30703).maybeSingle();
  if (mu?.mu_series_id === 30005048940) {
    console.log('  trigun: deleting wrong MU association (30703 → "Trigun Maximum") + nulling latest_known 102');
    if (!DRY) {
      await db.from('ingest_mangaupdates').delete().eq('manga_anilist_id', 30703);
      await db.from('series').update({ latest_known_chapters: null, updated_at: new Date().toISOString() }).eq('id', 'trigun');
    }
  } else {
    console.log('  trigun MU association: already fixed');
  }
  // ---- 4. eyeshield phantom row 155 (added same day, Sean's pending-rows
  // report): AFG's chart numbers its 145th row "155." — the extend path
  // materialized it as a duplicate finale (no air date) and the mu anime-end
  // pin landed on it; totals floored to 155 and the UI synthesized 146-154
  // as pending. Real finale = row 145 (manual anchor ch 240 already
  // stands). Durable guards: COMMUNITY_COUNT_OVERRIDES cap 145 +
  // EXTRAS_ADOPTED entry removed (its premise was this typo).
  const { data: es155 } = await db.from('episodes').select('title').eq('series_id', 'eyeshield-21').eq('number', 155).maybeSingle();
  if (es155) {
    console.log('  eyeshield: deleting phantom row 155 (AFG finale-number typo) + its mu anchor; totals 155 → 145');
    if (!DRY) {
      await db.from('chapter_anchors').delete().eq('series_id', 'eyeshield-21').eq('episode', 155);
      await db.from('episodes').delete().eq('series_id', 'eyeshield-21').eq('number', 155);
      await db.from('series').update({ aired_episodes: 145, total_episodes: 145, updated_at: new Date().toISOString() }).eq('id', 'eyeshield-21');
    }
  } else {
    console.log('  eyeshield row 155: already absent');
  }
  console.log('[rulings-20260825b] done');
}
main().then(() => process.exit(0));
