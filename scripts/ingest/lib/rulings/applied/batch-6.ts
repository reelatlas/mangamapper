// Applied rulings — apply-research-batch-6.ts (item-4 batch 2, 2026-08-23):
// 12 series, agent-verified 2+ sources. Divergent stretches annotate, never
// anchor. Kingdom's S5/S6p1 structure gap flagged. T2.1 extraction.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-6.ts';
const base = { ruledBy: 'session' as const, ruledOn: ON, cite: [SCRIPT] };
const anchor = (seriesId: string, episode: number, chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'A3', value: { episode, chapter, volume: null, source: 'manual' }, reason, ...base });
const annotate = (seriesId: string, episodes: number[], kind: string, chapters: string | null, reason: string): RulingEntry => ({ seriesId, ruleId: 'A43', value: { episodes, kind, chapters, asterisk_review: 'pending (if unset)' }, reason, ...base });
const cont = (seriesId: string, continue_from_chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'C8', value: { continue_from_chapter }, reason, ...base });

export const ENTRIES: RulingEntry[] = [
  anchor('noragami', 12, 11, 'S1 manga content = vols 1-3 (ch 11); canon stops mid-ep 10, 10b-12 = anime-original Rabo arc. animefillerguide + blessedyuki + Wikipedia ch list'),
  anchor('noragami', 25, 39, 'Aragoto finale = ch 38-39 (vol 10 end); Ebisu arc (30-39) rearranged — continue 40, re-read 30-39 advised. animefillerguide + wheredoestheanimeleaveoff'),
  anchor('the-seven-deadly-sins', 24, 100, 'S1 finale adapts 98-103 + ch 108 pulled forward; continue ~101. animefillerguide + fan consensus'),
  anchor('the-seven-deadly-sins', 52, 197, 'Revival of the Commandments finale = 195-197 (ep title = ch 196 title). animefillerguide + Wikipedia ch list'),
  anchor('the-seven-deadly-sins', 76, 267, 'Wrath of the Gods end ≈ 265-268 + cherry-picked 272/285 — SOFT (season rushed/skipped). animefillerguide + comicbook + doublesama'),
  anchor('the-seven-deadly-sins', 100, 346, 'Dragon\'s Judgement completes the manga (346). animefillerguide + Wikipedia'),
  anchor('bleach', 63, 183, 'Soul Society arc end (continue 184); 64-109 Bount filler. animefillerguide + Wikipedia ch list'),
  anchor('bleach', 167, 286, 'Grimmjow fight ends = ch 286 "Guillotine You Standing". animefillerguide + bleach.fandom'),
  anchor('bleach', 310, 423, 'Deicide/Aizen end = ch 423 (season 14 = 340-423). animefillerguide + Wikipedia + bleach.fandom'),
  anchor('bleach', 366, 479, 'Lost Substitute end = ch 479 — confirms our ch 1-479 scope; TYBW continues at 480. animefillerguide + animestoryguide'),
  anchor('berserk', 24, 78, 'Eclipse underway: ep 24 adapts 73-78 (Eclipse begins ch 73/vol 12). berserk.fandom ep pages'),
  anchor('berserk', 25, 87, 'ends mid-Eclipse ~ch 87 (covers 79-87 first half, omits 83, borrows 93-94 fragments) — anchor-with-caveat; many advise restarting from ch 1. berserk.fandom + wheredoestheanimeleaveoff'),
  anchor('eyeshield-21', 37, 79, 'American Death March arc end (ch 71-79/vol 9) — arc-level soft anchor. Wikipedia ch list + animefillerguide'),
  anchor('eyeshield-21', 145, 240, 'anime ends during Kanto Deimon-Ojo (ch 240) + anime-original NFL epilogue; ch 241+ (incl. Christmas Bowl, World Cup) never animated. wheredoestheanimeleaveoff + Wikipedia'),
  anchor('fist-of-the-north-star', 57, 83, 'Part 2 end: Rei vs Yuda concludes ~ch 83 (±1). Wikipedia ep list + hokuto.fandom'),
  anchor('fist-of-the-north-star', 109, 136, 'series 1 end (Raoh\'s defeat) = ch 136; HnK2 continues 137. Wikipedia + hokuto.fandom'),
  anchor('fist-of-the-north-star', 152, 210, 'HnK2 end = ch 210; ch 211-245 never animated (manga end ≠ anime end). Wikipedia + hokuto.fandom'),
  anchor('kingdom', 38, 173, 'S1 = ch 1-173 (Battle of Bayou end). mangashed + wheredoestheanimeleaveoff'),
  anchor('kingdom', 77, 261, 'S2 = 174-261 (vol 24). both guides exact'),
  anchor('kingdom', 103, 364, 'S3 end = ch 364 (Coalition Invasion; mangashed says ~355 — ±9, wdtalo/Wikipedia preferred). medium confidence'),
  anchor('kingdom', 129, 441, 'S4 end ≈ ch 437-441 (±4, wdtalo vol 41 ch 441 preferred). medium confidence'),
  anchor('d-gray-man', 51, 45, 'S1 ep 51 = Edo departure = Suman Dark arc start (~ch 45) — LOW-MED (eps 41-50 anime-only Lulu Bell arc nearby). dgrayman.fandom + Wikipedia'),
  anchor('d-gray-man', 103, 157, '2006 series adapted through ~ch 157 then replaced the Attack-on-HQ with an ORIGINAL ending. Wikipedia + mangashed'),
  anchor('d-gray-man', 116, 206, 'Hallow ends ch 206-208 (page-level per animefillerguide); safe continue 206+ — corrects the ~218 guess. animefillerguide + mangashed'),
  anchor('boruto-naruto-next-generations', 66, 10, 'Versus Momoshiki manga arc end (Boruto chs 1-10 = eps 53-66). narutopedia + cbr + sportskeeda'),
  anchor('boruto-naruto-next-generations', 151, 15, 'Mujina Bandits end (chs 11-15 = eps 141-151). narutopedia + cbr'),
  anchor('boruto-naruto-next-generations', 187, 23, 'Ao arc end (chs 16-23 = eps 178-187). narutopedia'),
  anchor('boruto-naruto-next-generations', 220, 55, 'Kawaki arc end (chs 24-55 = eps 188-220; Kurama/Isshiki). narutopedia + cbr'),
  anchor('welcome-to-demon-school-iruma-kun', 23, 44, 'S1 end = ch 43-44 (±1). wheredoestheanimeleaveoff + mangashed'),
  anchor('welcome-to-demon-school-iruma-kun', 44, 94, 'S2 end = ch 94 (vol 11) — both sources exact'),
  anchor('welcome-to-demon-school-iruma-kun', 65, 147, 'S3 end partially covers ch 147 (restart 147, Music Festival). both sources'),
  anchor('saint-seiya-knights-of-the-zodiac', 73, 46, 'Sanctuary end = vol 13 ch 46 (tankobon numbering — do not mix schemes). Wikipedia ch+ep lists'),
  anchor('saint-seiya-knights-of-the-zodiac', 114, 67, 'Poseidon end = vol 18 ch 67 (chs 47-67 = eps 100-114); Asgard 74-99 = 100% anime-original; Hades = later OVAs. Wikipedia'),

  annotate('noragami', [25], 'rearranged', 'ch 30-39', 'Ebisu arc heavily rearranged by the anime — re-read 30-39 advised'),
  annotate('the-seven-deadly-sins', [25, 26, 27, 28], 'divergence', null, 'Signs of Holy War: anime-original story (written by Suzuki, not adapted). animefillerguide + Wikipedia'),
  annotate('the-seven-deadly-sins', [76], 'partial', 'ch 198-267 rushed; 268/272/285 cherry-picked', 'Wrath of the Gods compressed and skipped content — endpoint soft'),
  annotate('berserk', [1], 'rearranged', 'ch 1 + parts of 2, 11', 'opens with the Black Swordsman arc, then eps 2-24 jump back to the Golden Age'),
  annotate('berserk', [25], 'partial', 'ch 79-87 (omits 83; borrows 93-94)', 'truncated mid-Eclipse ending'),
  annotate('eyeshield-21', [145], 'divergence', 'ch 240 + original epilogue', 'anime wraps the Shin-vs-Sena match then adds an original NFL flash-forward; two full manga arcs never animated'),
  annotate('d-gray-man', [103], 'divergence', '~ch 157 area', '2006 finale replaced the canonical Attack on HQ with an anime-original ending'),

  cont('noragami', 40, 'Aragoto finale = ch 38-39; continue 40 (re-read 30-39 advised).'),
  cont('eyeshield-21', 241, 'anime ends during ch 240; ch 241+ never animated.'),
  cont('fist-of-the-north-star', 211, 'HnK2 end = ch 210; ch 211-245 never animated.'),
  cont('d-gray-man', 206, 'Hallow ends ch 206-208 page-level; safe continue 206+.'),

  { seriesId: 'urusei-yatsura', ruleId: 'A40', value: { mapping_mode: 'loose' }, reason: 'researched loose verdict: episodic, out-of-order, source pool ≈ vols 1-29; final arc = the 1988 film.', ...base },
  { seriesId: 'kingdom', ruleId: 'I33', value: { flag: 'count_mismatch', aired: 129, trueAired: 155 }, reason: 'S5 (130-142, 2024) and S6 part 1 (143-155, Oct-Dec 2025) aired but are not stitched into the entry — extend structure, then anchors 142 → ~490 and 155 → 540 apply (researched, in batch-6 notes). Flag filed once; structure reconciliation is the fix.', ...base, retiresWhen: 'stitched 2026-08-23 (§12.34 stitch queue: Kingdom S5/S6 → 155)' },
];
