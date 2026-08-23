// Research batch 6 — item 4 batch 2 (2026-08-23): 12 series, agent-verified
// (2+ sources each, URLs in notes). Divergent stretches annotate, never
// anchor. Kingdom's missing S5/S6p1 structure gap flagged. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-6.ts

import { db, startRun, finishRun, fileFlagOnce } from './lib/db';

const now = () => new Date().toISOString();

const ANCHORS: [string, number, number, string][] = [
  ['noragami', 12, 11, 'S1 manga content = vols 1-3 (ch 11); canon stops mid-ep 10, 10b-12 = anime-original Rabo arc. animefillerguide + blessedyuki + Wikipedia ch list'],
  ['noragami', 25, 39, 'Aragoto finale = ch 38-39 (vol 10 end); Ebisu arc (30-39) rearranged — continue 40, re-read 30-39 advised. animefillerguide + wheredoestheanimeleaveoff'],
  ['the-seven-deadly-sins', 24, 100, 'S1 finale adapts 98-103 + ch 108 pulled forward; continue ~101. animefillerguide + fan consensus'],
  ['the-seven-deadly-sins', 52, 197, 'Revival of the Commandments finale = 195-197 (ep title = ch 196 title). animefillerguide + Wikipedia ch list'],
  ['the-seven-deadly-sins', 76, 267, 'Wrath of the Gods end ≈ 265-268 + cherry-picked 272/285 — SOFT (season rushed/skipped). animefillerguide + comicbook + doublesama'],
  ['the-seven-deadly-sins', 100, 346, 'Dragon\'s Judgement completes the manga (346). animefillerguide + Wikipedia'],
  ['bleach', 63, 183, 'Soul Society arc end (continue 184); 64-109 Bount filler. animefillerguide + Wikipedia ch list'],
  ['bleach', 167, 286, 'Grimmjow fight ends = ch 286 "Guillotine You Standing". animefillerguide + bleach.fandom'],
  ['bleach', 310, 423, 'Deicide/Aizen end = ch 423 (season 14 = 340-423). animefillerguide + Wikipedia + bleach.fandom'],
  ['bleach', 366, 479, 'Lost Substitute end = ch 479 — confirms our ch 1-479 scope; TYBW continues at 480. animefillerguide + animestoryguide'],
  ['berserk', 24, 78, 'Eclipse underway: ep 24 adapts 73-78 (Eclipse begins ch 73/vol 12). berserk.fandom ep pages'],
  ['berserk', 25, 87, 'ends mid-Eclipse ~ch 87 (covers 79-87 first half, omits 83, borrows 93-94 fragments) — anchor-with-caveat; many advise restarting from ch 1. berserk.fandom + wheredoestheanimeleaveoff'],
  ['eyeshield-21', 37, 79, 'American Death March arc end (ch 71-79/vol 9) — arc-level soft anchor. Wikipedia ch list + animefillerguide'],
  ['eyeshield-21', 145, 240, 'anime ends during Kanto Deimon-Ojo (ch 240) + anime-original NFL epilogue; ch 241+ (incl. Christmas Bowl, World Cup) never animated. wheredoestheanimeleaveoff + Wikipedia'],
  ['fist-of-the-north-star', 57, 83, 'Part 2 end: Rei vs Yuda concludes ~ch 83 (±1). Wikipedia ep list + hokuto.fandom'],
  ['fist-of-the-north-star', 109, 136, 'series 1 end (Raoh\'s defeat) = ch 136; HnK2 continues 137. Wikipedia + hokuto.fandom'],
  ['fist-of-the-north-star', 152, 210, 'HnK2 end = ch 210; ch 211-245 never animated (manga end ≠ anime end). Wikipedia + hokuto.fandom'],
  ['kingdom', 38, 173, 'S1 = ch 1-173 (Battle of Bayou end). mangashed + wheredoestheanimeleaveoff'],
  ['kingdom', 77, 261, 'S2 = 174-261 (vol 24). both guides exact'],
  ['kingdom', 103, 364, 'S3 end = ch 364 (Coalition Invasion; mangashed says ~355 — ±9, wdtalo/Wikipedia preferred). medium confidence'],
  ['kingdom', 129, 441, 'S4 end ≈ ch 437-441 (±4, wdtalo vol 41 ch 441 preferred). medium confidence'],
  ['d-gray-man', 51, 45, 'S1 ep 51 = Edo departure = Suman Dark arc start (~ch 45) — LOW-MED (eps 41-50 anime-only Lulu Bell arc nearby). dgrayman.fandom + Wikipedia'],
  ['d-gray-man', 103, 157, '2006 series adapted through ~ch 157 then replaced the Attack-on-HQ with an ORIGINAL ending. Wikipedia + mangashed'],
  ['d-gray-man', 116, 206, 'Hallow ends ch 206-208 (page-level per animefillerguide); safe continue 206+ — corrects the ~218 guess. animefillerguide + mangashed'],
  ['boruto-naruto-next-generations', 66, 10, 'Versus Momoshiki manga arc end (Boruto chs 1-10 = eps 53-66). narutopedia + cbr + sportskeeda'],
  ['boruto-naruto-next-generations', 151, 15, 'Mujina Bandits end (chs 11-15 = eps 141-151). narutopedia + cbr'],
  ['boruto-naruto-next-generations', 187, 23, 'Ao arc end (chs 16-23 = eps 178-187). narutopedia'],
  ['boruto-naruto-next-generations', 220, 55, 'Kawaki arc end (chs 24-55 = eps 188-220; Kurama/Isshiki). narutopedia + cbr'],
  ['welcome-to-demon-school-iruma-kun', 23, 44, 'S1 end = ch 43-44 (±1). wheredoestheanimeleaveoff + mangashed'],
  ['welcome-to-demon-school-iruma-kun', 44, 94, 'S2 end = ch 94 (vol 11) — both sources exact'],
  ['welcome-to-demon-school-iruma-kun', 65, 147, 'S3 end partially covers ch 147 (restart 147, Music Festival). both sources'],
  ['saint-seiya-knights-of-the-zodiac', 73, 46, 'Sanctuary end = vol 13 ch 46 (tankobon numbering — do not mix schemes). Wikipedia ch+ep lists'],
  ['saint-seiya-knights-of-the-zodiac', 114, 67, 'Poseidon end = vol 18 ch 67 (chs 47-67 = eps 100-114); Asgard 74-99 = 100% anime-original; Hades = later OVAs. Wikipedia'],
];

const ANNOTATIONS: [string, number[], string, string | null, string][] = [
  ['noragami', [25], 'rearranged', 'ch 30-39', 'Ebisu arc heavily rearranged by the anime — re-read 30-39 advised'],
  ['the-seven-deadly-sins', [25, 26, 27, 28], 'divergence', null, 'Signs of Holy War: anime-original story (written by Suzuki, not adapted). animefillerguide + Wikipedia'],
  ['the-seven-deadly-sins', [76], 'partial', 'ch 198-267 rushed; 268/272/285 cherry-picked', 'Wrath of the Gods compressed and skipped content — endpoint soft'],
  ['berserk', [1], 'rearranged', 'ch 1 + parts of 2, 11', 'opens with the Black Swordsman arc, then eps 2-24 jump back to the Golden Age'],
  ['berserk', [25], 'partial', 'ch 79-87 (omits 83; borrows 93-94)', 'truncated mid-Eclipse ending'],
  ['eyeshield-21', [145], 'divergence', 'ch 240 + original epilogue', 'anime wraps the Shin-vs-Sena match then adds an original NFL flash-forward; two full manga arcs never animated'],
  ['d-gray-man', [103], 'divergence', '~ch 157 area', '2006 finale replaced the canonical Attack on HQ with an anime-original ending'],
];

const CONTINUE_FROM: [string, number][] = [
  ['noragami', 40],
  ['eyeshield-21', 241],
  ['fist-of-the-north-star', 211],
  ['d-gray-man', 206],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    for (const [sid, ep, ch, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, volume: null, source: 'manual',
        note: `research-tier batch 6 (2026-08-23, agent-verified 2+ sources): ${note}`,
      });
      if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
    }
    console.log(`anchors: ${ANCHORS.length}`);
    for (const [sid, eps, kind, chapters, note] of ANNOTATIONS) {
      for (const ep of eps) {
        const { error } = await db.from('episode_annotations').upsert({ series_id: sid, episode: ep, kind, chapters, note });
        if (error) throw new Error(`annotate ${sid} ep${ep}: ${error.message}`);
      }
      await db.from('series').update({ asterisk_review: 'pending', updated_at: now() }).eq('id', sid).is('asterisk_review', null);
    }
    for (const [sid, ch] of CONTINUE_FROM) {
      await db.from('series').update({ continue_from_chapter: ch, updated_at: now() }).eq('id', sid);
    }
    // Urusei Yatsura: researched loose verdict (episodic, out-of-order,
    // source pool ≈ vols 1-29; final arc = the 1988 film)
    await db.from('series').update({ mapping_mode: 'loose', updated_at: now() }).eq('id', 'urusei-yatsura');
    console.log('urusei-yatsura → loose (episodic out-of-order; pool vols 1-29)');
    // Kingdom structure gap: S5 (13) + S6p1 (13) aired — entry stops at 129
    await fileFlagOnce(runId, 'kingdom', 'resolve', 'count_mismatch', {
      aired: 129,
      trueAired: 155,
      note: 'S5 (130-142, 2024) and S6 part 1 (143-155, Oct-Dec 2025) aired but are not stitched into the entry — extend structure, then anchors 142 → ~490 and 155 → 540 apply (researched, in batch-6 notes)',
    });
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: ANCHORS.length, flagged: 1 }, 'research batch 6: item-4 batch 2 (12 series)');
    console.log('=== BATCH 6 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
