// Applied rulings — apply-research-batch-5.ts (item-4 batch 1, 2026-08-23):
// season/arc-boundary anchors for the top-18 anchor-gap series, agent-
// verified 2+ sources. Divergent stretches annotate, never anchor. T2.1.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-5.ts';
const base = { ruledBy: 'session' as const, ruledOn: ON, cite: [SCRIPT] };
const anchor = (seriesId: string, episode: number, chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'A3', value: { episode, chapter, volume: null, source: 'manual' }, reason, ...base });
const annotate = (seriesId: string, episodes: number[], kind: string, chapters: string | null, reason: string): RulingEntry => ({ seriesId, ruleId: 'A43', value: { episodes, kind, chapters, asterisk_review: 'pending (if unset)' }, reason, ...base });
const cont = (seriesId: string, continue_from_chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'C8', value: { continue_from_chapter }, reason, ...base });

export const ENTRIES: RulingEntry[] = [
  // Attack on Titan (mangashed + wikipedia season pages + MAL/comicbook)
  anchor('attack-on-titan', 37, 50, 'S2 end: ep "Scream" = ch 50 "Scream"; continue 51'),
  anchor('attack-on-titan', 49, 72, 'S3 part 1 end: Royal Government arc = ch 51-72'),
  anchor('attack-on-titan', 59, 90, 'S3 end: Return to Shiganshina = ch 73-90'),
  anchor('attack-on-titan', 75, 116, 'S4 part 1 end: ep "Above and Below" = ch 116 (title + cliffhanger match; mangashed\'s 114 outvoted)'),
  anchor('attack-on-titan', 87, 130, 'S4 part 2 end = ch 130; Final Chapters specials adapt 131-139'),
  // Demon Slayer (fandom arc pages + animecorner + comicbook + forevergeek)
  anchor('demon-slayer-kimetsu-no-yaiba', 33, 69, 'Mugen Train TV arc end (core fight ends ch 66; 67-69 aftermath; ep 27 prologue anime-original)'),
  anchor('demon-slayer-kimetsu-no-yaiba', 44, 97, 'Entertainment District end: anime stopped at ch 97; S3E1 picked up 98-99'),
  anchor('demon-slayer-kimetsu-no-yaiba', 55, 127, 'Swordsmith Village end = ch 127; Hashira Training starts 128'),
  // Jujutsu Kaisen (escapist + mangashed + fandom + ANN/afteranime)
  anchor('jujutsu-kaisen', 29, 78, 'Hidden Inventory/Premature Death end = ch 78; Shibuya opens 79'),
  anchor('jujutsu-kaisen', 47, 136, 'S2 end: Shibuya Incident ends ch 136 (finale touched 137 setup)'),
  anchor('jujutsu-kaisen', 59, 180, 'S3 part 1 finale ENDS at ch 180 (Yuta vs Ryu), continue 181 — refines the continua 181 off-by-one'),
  // My Hero Academia (mangashed + wheredoestheanimeleaveoff + wikipedia)
  anchor('my-hero-academia', 38, 70, 'S2 end = ch 70'),
  anchor('my-hero-academia', 63, 124, 'S3 end = ch 124'),
  anchor('my-hero-academia', 88, 190, 'S4 end = ch 190 (Endeavor vs Hood); S5 re-covers some 190-area content'),
  anchor('my-hero-academia', 113, 257, 'S5 end = ch 257 (S5 REARRANGED arc order: Endeavor Agency/MVA swap)'),
  anchor('my-hero-academia', 138, 328, 'S6 end = ch 328 (covers 258-328)'),
  anchor('my-hero-academia', 159, 398, 'S7 end = ch 398 ±1 (wikipedia+sportskeeda 398; mangashed 399 minority)'),
  // Hunter x Hunter 2011 (hunterpedia per-episode pages; page-level reorder ±1)
  anchor('hunter-x-hunter-2011', 99, 234, 'hunterpedia ep 99 covers ch 232-234 (page-level reorder ±1)'),
  anchor('hunter-x-hunter-2011', 110, 262, 'hunterpedia ep 110: ch 261 + 262 to p19'),
  anchor('hunter-x-hunter-2011', 116, 275, 'hunterpedia ep 116: ch 273-275 partial'),
  anchor('hunter-x-hunter-2011', 120, 286, 'hunterpedia ep 120: ch 283-286 partial'),
  anchor('hunter-x-hunter-2011', 136, 318, 'Chimera Ant arc end (ch 186-318)'),
  // One-Punch Man (opm fandom + playbite + firstcuriosity; MANGA numbering)
  anchor('one-punch-man', 12, 37, 'S1 end: Dark Matter Thieves = ch 32-37 (Boros)'),
  anchor('one-punch-man', 24, 85, 'S2 end mid-chapter 84/85, continue 86 (manga numbering, not webcomic)'),
  // Haikyu (OUR numbering: +2 after ep 60 for the Riku vs Kuu OVA)
  anchor('haikyu', 50, 149, 'S2 end: "Declaration of War" adapts 148-149; S3 starts 150'),
  anchor('haikyu', 60, 207, 'S3 end: finale adapts 187-190 + 207 (aftermath 191-206 condensed/skipped)'),
  anchor('haikyu', 75, 249, 'To The Top part 1 end (MAL ep 73 = our 75): adapts 246-249; part 2 = Inarizaki 250-292 (mangashed\'s 228 rejected — inconsistent with ep-87 → 292)'),
  // Black Clover: flat anime-canon stretch 130-157 — no manga progress
  anchor('black-clover', 157, 228, 'eps 130-157 = anime-canon stretch (Tabata-supervised, NOT adapted): position holds at ch 227-228 from ep 129; timeskip ep 158 resumes ch 229 — FLAT segment, interpolation naturally holds'),
  // Spy x Family (oneesports + playbite + epicstream + comingsoon)
  anchor('spy-x-family', 25, 38, 'S1 end: "First Contact" adapts missions 37-38 (S1 sprinkles extra missions out of order)'),
  anchor('spy-x-family', 37, 60, 'S2 end = mission 60 (vol 9), continue 61'),
  // Kaguya-sama (wheredoestheanimeleaveoff + fandom + wikipedia)
  anchor('kaguya-sama-love-is-war', 12, 48, 'S1 end ≈ ch 47/48 (S1 heavily reorders vols 1-5 — interior interpolation low-precision)'),
  anchor('kaguya-sama-love-is-war', 24, 102, 'S2 end = ch 102'),
  anchor('kaguya-sama-love-is-war', 37, 138, 'S3 Ultra Romantic end = confession, ch 138'),
  anchor('kaguya-sama-love-is-war', 40, 160, 'First Kiss Never Ends content ends ch 160 (adapts 138-151 + parts of 159-160; SKIPS side chs 152-158), continue 161'),
  // Dr. Stone (animefillerguide per-episode + wheredoestheanimeleaveoff)
  anchor('dr-stone', 35, 83, 'S2 end: finale adapts 82-84 partial, continue 84'),
  anchor('dr-stone', 46, 116, 'S3 part 1 end: adapts 114-116'),
  anchor('dr-stone', 57, 142, 'S3 end = ch 142, continue 143'),
  anchor('dr-stone', 69, 169, 'S4 cour 1 end: adapts 167-169'),
  anchor('dr-stone', 81, 199, 'S4 cour 2 end ≈ ch 199/200 (mid-chapter, fuzzy); final cour adapts 200-232'),
  // Vinland Saga
  anchor('vinland-saga', 24, 54, 'S1 end: finale adapts 52-54'),
  anchor('vinland-saga', 36, 78, 'S2 cour 1 end: adapts 77-78 (animefillerguide single-source, medium confidence)'),
  // Tokyo Ghoul (S1 solid; √A divergent — annotated, never anchored)
  anchor('tokyo-ghoul', 12, 66, 'S1 end: ep 12 ends exactly at ch 66 (Kaneki vs Jason); √A (13-24) is divergent'),
  // The Promised Neverland
  anchor('the-promised-neverland', 12, 37, 'S1 end: covers ch 35-37 (escape), continue 38'),
  anchor('the-promised-neverland', 15, 50, 'S2 eps 1-3 faithfully adapt Promised Forest (38-52), ep 3 ≈ ch 50 (low-moderate confidence); ep 4+ divergent'),
  // Assassination Classroom (faithful/linear — interpolation safe)
  anchor('assassination-classroom', 22, 73, 'S1 end ≈ ch 72-74 boundary (island arc conclusion; S1 skips 23-24, 37, 44-45)'),
  anchor('assassination-classroom', 47, 180, 'S2 finale = graduation + epilogue (ch 179-180); manga = 180 total'),
  // Mob Psycho 100
  anchor('mob-psycho-100', 12, 50, 'S1 end = ch 50 (7th Division); S1 pulls material out of order — interior shaky, endpoint firm'),
  anchor('mob-psycho-100', 25, 91, 'S2 end = ch 91 (World Domination)'),
  anchor('mob-psycho-100', 37, 101, 'S3 completes the manga (ch 101, vol 16)'),
  // Naruto (narutopedia + listfist + animestoryguide)
  anchor('naruto', 80, 138, 'Konoha Crush end: ep 80 = ch 138-139 (Hiruzen\'s funeral is 138)'),
  anchor('naruto', 100, 180, 'ep 100 = ch 179-180 (hospital material woven before the 101-106 filler block; NP arc table splits differently — listfist per-episode preferred)'),
  anchor('naruto', 135, 238, 'Sasuke Recovery end = ch 235-238; last canon ep before the filler wall (136-219)'),
  // Naruto Shippuden (narutopedia + listfist)
  anchor('naruto-shippuden', 32, 281, 'Kazekage Rescue end (245-281)'),
  anchor('naruto-shippuden', 88, 342, 'Akatsuki Suppression end (311-342)'),
  anchor('naruto-shippuden', 143, 412, 'Fated Battle Between Brothers end (384-412; listfist ep 143 runs 411-415)'),
  anchor('naruto-shippuden', 175, 450, 'Pain\'s Assault aftermath = ch 449-450 (451-453 Danzo surfaces later)'),
  anchor('naruto-shippuden', 256, 515, 'Countdown part 2 end = ch 515'),
  anchor('naruto-shippuden', 261, 516, 'war starts: Confrontation arc (516-559) begins ep 261 (257-260 filler)'),
  anchor('naruto-shippuden', 393, 661, '"A True Ending" = ch 660-662; last canon before the 394-413 filler block'),
  anchor('naruto-shippuden', 479, 699, '"The Seal of Reconciliation" = ch 699 (title match); 480+ = novel-based'),

  // ── annotations (divergent stretches annotate, never anchor) ───────────
  annotate('tokyo-ghoul', [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], 'divergence', 'parallels ch 67-143 timeframe', '√A is anime-original from the first minute (Kaneki joins Aogiri — opposite of the manga); finale echoes ch 143 imagery; community: read 136-140 + 143 (or restart at 67) before :re. mangashed + quora'),
  annotate('the-promised-neverland', [16, 17, 18, 19, 20, 21, 22, 23], 'divergence', 'compresses ch 53-181', 'ep 4+ anime-original with cherry-picked scenes; Goldy Pond and later arcs skipped entirely; montage-sprints to the manga ending. wikipedia + screenrant + denofgeek'),
  annotate('my-hero-academia', [113], 'rearranged', 'Endeavor Agency / MVA arcs', 'S5 swapped the arc order vs the manga; boundary anchor firm, interior order differs. mangashed + wheredoestheanimeleaveoff'),
  annotate('kaguya-sama-love-is-war', [40], 'partial', 'ch 139-151 + 159-160 (skips 152-158)', 'First Kiss Never Ends adapts the confession aftermath but skips the side chapters. fandom + wikipedia'),
  annotate('mob-psycho-100', [12], 'rearranged', 'S1 pulls ch ~56 material early', 'endpoint ch 50 firm; interior S1 order differs from the manga. cbr + mangashed'),

  // ── continue-from ──────────────────────────────────────────────────────
  cont('kaguya-sama-love-is-war', 161, 'First Kiss Never Ends content ends ch 160; continue 161.'),
  cont('jujutsu-kaisen', 181, 'S3 part 1 finale ends at ch 180; continue 181.'),
];
