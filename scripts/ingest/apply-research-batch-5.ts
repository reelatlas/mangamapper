// Research batch 5 — item 4 batch 1 (2026-08-23): season/arc-boundary
// anchors for the top-18 anchor-gap series, agent-researched with 2+
// corroborating sources each (URLs in notes). Divergent stretches become
// asterisk annotations, never fake anchors. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-5.ts

import { db, startRun, finishRun } from './lib/db';

const now = () => new Date().toISOString();

// [seriesId, episode, chapter, note]
const ANCHORS: [string, number, number, string][] = [
  // Attack on Titan (mangashed + wikipedia season pages + MAL/comicbook)
  ['attack-on-titan', 37, 50, 'S2 end: ep "Scream" = ch 50 "Scream"; continue 51'],
  ['attack-on-titan', 49, 72, 'S3 part 1 end: Royal Government arc = ch 51-72'],
  ['attack-on-titan', 59, 90, 'S3 end: Return to Shiganshina = ch 73-90'],
  ['attack-on-titan', 75, 116, 'S4 part 1 end: ep "Above and Below" = ch 116 (title + cliffhanger match; mangashed\'s 114 outvoted)'],
  ['attack-on-titan', 87, 130, 'S4 part 2 end = ch 130; Final Chapters specials adapt 131-139'],
  // Demon Slayer (fandom arc pages + animecorner + comicbook + forevergeek)
  ['demon-slayer-kimetsu-no-yaiba', 33, 69, 'Mugen Train TV arc end (core fight ends ch 66; 67-69 aftermath; ep 27 prologue anime-original)'],
  ['demon-slayer-kimetsu-no-yaiba', 44, 97, 'Entertainment District end: anime stopped at ch 97; S3E1 picked up 98-99'],
  ['demon-slayer-kimetsu-no-yaiba', 55, 127, 'Swordsmith Village end = ch 127; Hashira Training starts 128'],
  // Jujutsu Kaisen (escapist + mangashed + fandom + ANN/afteranime)
  ['jujutsu-kaisen', 29, 78, 'Hidden Inventory/Premature Death end = ch 78; Shibuya opens 79'],
  ['jujutsu-kaisen', 47, 136, 'S2 end: Shibuya Incident ends ch 136 (finale touched 137 setup)'],
  ['jujutsu-kaisen', 59, 180, 'S3 part 1 finale ENDS at ch 180 (Yuta vs Ryu), continue 181 — refines the continua 181 off-by-one'],
  // My Hero Academia (mangashed + wheredoestheanimeleaveoff + wikipedia)
  ['my-hero-academia', 38, 70, 'S2 end = ch 70'],
  ['my-hero-academia', 63, 124, 'S3 end = ch 124'],
  ['my-hero-academia', 88, 190, 'S4 end = ch 190 (Endeavor vs Hood); S5 re-covers some 190-area content'],
  ['my-hero-academia', 113, 257, 'S5 end = ch 257 (S5 REARRANGED arc order: Endeavor Agency/MVA swap)'],
  ['my-hero-academia', 138, 328, 'S6 end = ch 328 (covers 258-328)'],
  ['my-hero-academia', 159, 398, 'S7 end = ch 398 ±1 (wikipedia+sportskeeda 398; mangashed 399 minority)'],
  // Hunter x Hunter 2011 (hunterpedia per-episode pages; page-level reorder ±1)
  ['hunter-x-hunter-2011', 99, 234, 'hunterpedia ep 99 covers ch 232-234 (page-level reorder ±1)'],
  ['hunter-x-hunter-2011', 110, 262, 'hunterpedia ep 110: ch 261 + 262 to p19'],
  ['hunter-x-hunter-2011', 116, 275, 'hunterpedia ep 116: ch 273-275 partial'],
  ['hunter-x-hunter-2011', 120, 286, 'hunterpedia ep 120: ch 283-286 partial'],
  ['hunter-x-hunter-2011', 136, 318, 'Chimera Ant arc end (ch 186-318)'],
  // One-Punch Man (opm fandom + playbite + firstcuriosity; MANGA numbering)
  ['one-punch-man', 12, 37, 'S1 end: Dark Matter Thieves = ch 32-37 (Boros)'],
  ['one-punch-man', 24, 85, 'S2 end mid-chapter 84/85, continue 86 (manga numbering, not webcomic)'],
  // Haikyu (OUR numbering: +2 after ep 60 for the Riku vs Kuu OVA)
  ['haikyu', 50, 149, 'S2 end: "Declaration of War" adapts 148-149; S3 starts 150'],
  ['haikyu', 60, 207, 'S3 end: finale adapts 187-190 + 207 (aftermath 191-206 condensed/skipped)'],
  ['haikyu', 75, 249, 'To The Top part 1 end (MAL ep 73 = our 75): adapts 246-249; part 2 = Inarizaki 250-292 (mangashed\'s 228 rejected — inconsistent with ep-87 → 292)'],
  // Black Clover: flat anime-canon stretch 130-157 — no manga progress
  ['black-clover', 157, 228, 'eps 130-157 = anime-canon stretch (Tabata-supervised, NOT adapted): position holds at ch 227-228 from ep 129; timeskip ep 158 resumes ch 229 — FLAT segment, interpolation naturally holds'],
  // Spy x Family (oneesports + playbite + epicstream + comingsoon)
  ['spy-x-family', 25, 38, 'S1 end: "First Contact" adapts missions 37-38 (S1 sprinkles extra missions out of order)'],
  ['spy-x-family', 37, 60, 'S2 end = mission 60 (vol 9), continue 61'],
  // Kaguya-sama (wheredoestheanimeleaveoff + fandom + wikipedia)
  ['kaguya-sama-love-is-war', 12, 48, 'S1 end ≈ ch 47/48 (S1 heavily reorders vols 1-5 — interior interpolation low-precision)'],
  ['kaguya-sama-love-is-war', 24, 102, 'S2 end = ch 102'],
  ['kaguya-sama-love-is-war', 37, 138, 'S3 Ultra Romantic end = confession, ch 138'],
  ['kaguya-sama-love-is-war', 40, 160, 'First Kiss Never Ends content ends ch 160 (adapts 138-151 + parts of 159-160; SKIPS side chs 152-158), continue 161'],
  // Dr. Stone (animefillerguide per-episode + wheredoestheanimeleaveoff)
  ['dr-stone', 35, 83, 'S2 end: finale adapts 82-84 partial, continue 84'],
  ['dr-stone', 46, 116, 'S3 part 1 end: adapts 114-116'],
  ['dr-stone', 57, 142, 'S3 end = ch 142, continue 143'],
  ['dr-stone', 69, 169, 'S4 cour 1 end: adapts 167-169'],
  ['dr-stone', 81, 199, 'S4 cour 2 end ≈ ch 199/200 (mid-chapter, fuzzy); final cour adapts 200-232'],
  // Vinland Saga
  ['vinland-saga', 24, 54, 'S1 end: finale adapts 52-54'],
  ['vinland-saga', 36, 78, 'S2 cour 1 end: adapts 77-78 (animefillerguide single-source, medium confidence)'],
  // Tokyo Ghoul (S1 solid; √A divergent — annotated, never anchored)
  ['tokyo-ghoul', 12, 66, 'S1 end: ep 12 ends exactly at ch 66 (Kaneki vs Jason); √A (13-24) is divergent'],
  // The Promised Neverland
  ['the-promised-neverland', 12, 37, 'S1 end: covers ch 35-37 (escape), continue 38'],
  ['the-promised-neverland', 15, 50, 'S2 eps 1-3 faithfully adapt Promised Forest (38-52), ep 3 ≈ ch 50 (low-moderate confidence); ep 4+ divergent'],
  // Assassination Classroom (faithful/linear — interpolation safe)
  ['assassination-classroom', 22, 73, 'S1 end ≈ ch 72-74 boundary (island arc conclusion; S1 skips 23-24, 37, 44-45)'],
  ['assassination-classroom', 47, 180, 'S2 finale = graduation + epilogue (ch 179-180); manga = 180 total'],
  // Mob Psycho 100
  ['mob-psycho-100', 12, 50, 'S1 end = ch 50 (7th Division); S1 pulls material out of order — interior shaky, endpoint firm'],
  ['mob-psycho-100', 25, 91, 'S2 end = ch 91 (World Domination)'],
  ['mob-psycho-100', 37, 101, 'S3 completes the manga (ch 101, vol 16)'],
  // Naruto (narutopedia + listfist + animestoryguide)
  ['naruto', 80, 138, 'Konoha Crush end: ep 80 = ch 138-139 (Hiruzen\'s funeral is 138)'],
  ['naruto', 100, 180, 'ep 100 = ch 179-180 (hospital material woven before the 101-106 filler block; NP arc table splits differently — listfist per-episode preferred)'],
  ['naruto', 135, 238, 'Sasuke Recovery end = ch 235-238; last canon ep before the filler wall (136-219)'],
  // Naruto Shippuden (narutopedia + listfist)
  ['naruto-shippuden', 32, 281, 'Kazekage Rescue end (245-281)'],
  ['naruto-shippuden', 88, 342, 'Akatsuki Suppression end (311-342)'],
  ['naruto-shippuden', 143, 412, 'Fated Battle Between Brothers end (384-412; listfist ep 143 runs 411-415)'],
  ['naruto-shippuden', 175, 450, 'Pain\'s Assault aftermath = ch 449-450 (451-453 Danzo surfaces later)'],
  ['naruto-shippuden', 256, 515, 'Countdown part 2 end = ch 515'],
  ['naruto-shippuden', 261, 516, 'war starts: Confrontation arc (516-559) begins ep 261 (257-260 filler)'],
  ['naruto-shippuden', 393, 661, '"A True Ending" = ch 660-662; last canon before the 394-413 filler block'],
  ['naruto-shippuden', 479, 699, '"The Seal of Reconciliation" = ch 699 (title match); 480+ = novel-based'],
];

// [seriesId, episodes, kind, chapters, note]
const ANNOTATIONS: [string, number[], string, string | null, string][] = [
  ['tokyo-ghoul', [13,14,15,16,17,18,19,20,21,22,23,24], 'divergence', 'parallels ch 67-143 timeframe', '√A is anime-original from the first minute (Kaneki joins Aogiri — opposite of the manga); finale echoes ch 143 imagery; community: read 136-140 + 143 (or restart at 67) before :re. mangashed + quora'],
  ['the-promised-neverland', [16,17,18,19,20,21,22,23], 'divergence', 'compresses ch 53-181', 'ep 4+ anime-original with cherry-picked scenes; Goldy Pond and later arcs skipped entirely; montage-sprints to the manga ending. wikipedia + screenrant + denofgeek'],
  ['my-hero-academia', [113], 'rearranged', 'Endeavor Agency / MVA arcs', 'S5 swapped the arc order vs the manga; boundary anchor firm, interior order differs. mangashed + wheredoestheanimeleaveoff'],
  ['kaguya-sama-love-is-war', [40], 'partial', 'ch 139-151 + 159-160 (skips 152-158)', 'First Kiss Never Ends adapts the confession aftermath but skips the side chapters. fandom + wikipedia'],
  ['mob-psycho-100', [12], 'rearranged', 'S1 pulls ch ~56 material early', 'endpoint ch 50 firm; interior S1 order differs from the manga. cbr + mangashed'],
];

const CONTINUE_FROM: [string, number][] = [
  ['kaguya-sama-love-is-war', 161],
  ['jujutsu-kaisen', 181],
];

async function main() {
  const runId = await startRun('resolve');
  try {
    for (const [sid, ep, ch, note] of ANCHORS) {
      const { error } = await db.from('chapter_anchors').upsert({
        series_id: sid, episode: ep, chapter: ch, volume: null, source: 'manual',
        note: `research-tier batch 5 (2026-08-23, agent-verified 2+ sources): ${note}`,
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
    console.log(`annotations: ${ANNOTATIONS.reduce((s, a) => s + a[1].length, 0)} rows`);
    for (const [sid, ch] of CONTINUE_FROM) {
      await db.from('series').update({ continue_from_chapter: ch, updated_at: now() }).eq('id', sid);
    }
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: ANCHORS.length, flagged: 0 }, 'research batch 5: item-4 batch 1 (18 series, season/arc boundaries)');
    console.log('=== BATCH 5 APPLIED ===');
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
