// Batch 19 wave 1 — the curated apply (P10: the map decides). Sean ruled
// 2026-08-26 "as recommended" with four diffs (ajin keeps .5 with the
// Kodansha conversion stated; trigun continue 20 with the space-ends note;
// railgun 49 keeps graft{41} corrected, delete only partial{40-42}; DBS
// side_source with the screenplay + incorporation in the note). Types,
// T26 annotations and A44 suppressions are STANDING-MAP edits (episode-
// types / standing-annotations / anchor-suppressed) asserted by
// assert-overrides; this script carries what the maps cannot: manual-tier
// ANCHORS, CONTINUE POINTS (curated, never overwritten by the parity healer
// — C1 guard), research-origin ANNOTATION upserts / deletions, and the C8
// series continue. Idempotent; --dry-run prints every change. Extracted to
// lib/rulings/applied/batch-19.ts when the batch closes (P34).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch19/apply-wave1.ts [--dry-run]
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';

type AnchorRow = { chapter: number; start_chapter: number | null; source: string; chapters_adapted: string | null; volume: number | null };
type ContRow = { continue_chapter: number | null; continue_kind: string | null };

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch19/out';
const VER = 'scripts/ingest/research/batch19/verify';
const B = 'research-tier batch 19 wave 1 (2026-08-26, verified R24, Sean ruled)';

type Anchor = { sid: string; episode: number; chapter: number; start: number | null; adapted: string; volume: number | null; why: string; repair?: boolean };
type Continue = { sid: string; episode: number; chapter: number; kind: 'parity' | 'post_series'; note: string };
type Ann = { sid: string; episode: number; kind: string; chapters: string | null; note: string };
type AnnDel = { sid: string; episode: number; kind: string; why: string };

// CURATED ANCHORS (A3/A10/A4) — manual tier. `repair` = an existing row is
// rewritten (soul-eater 36 is afg-continua → manual, P8).
const ANCHORS: Anchor[] = [
  { sid: 'claymore', episode: 21, chapter: 57, start: 57, adapted: '57', volume: 10, why: 'Scene 57 end to end (claymorenew Anime Scene 21 + Scene 57; claymore.fandom; en-WP; AFG footnote "eps 21-23 correspond to chapters 57 to 59"; Shueisha vol 10 contents: SCENE57 ピエタ侵攻 I). Cold open = flashback recap (A10). [high]' },
  { sid: 'claymore', episode: 22, chapter: 58, start: 58, adapted: '58', volume: 11, why: 'Scene 58 end to end, no straddle (Scene 58 has no cold open; ep ends on the severed arm = Scene 58 pp 36-37). Shueisha vol 11: SCENE58 ピエタ侵攻 II. [high]' },
  { sid: 'claymore', episode: 23, chapter: 59, start: 59, adapted: '59', volume: 11, why: "Scene 59 end to end — the episode's cold open IS Scene 59's (Rigaldo's stump, pp 39-41); ends on Rigaldo shredded (pp 68-69). MU anime field: 'Vol 11, Chap 59 (Original Ending EP 24-26)'. The frontier: 24-26 are filler (Sean, T28). [high]" },
  { sid: 'ajin-demi-human', episode: 13, chapter: 22.5, start: 22, adapted: '22, 22.5 (escape heavily altered), 23 (opening beat: the second-wave video)', volume: 5, why: 'REPAIR END 21 → 22.5: the stored row was internally impossible (END 21 with START 22). AllYourAnime S1-13 is headed "Chapters 22-22.5" and closes on ch 23\'s video. NUMBERING: 22.5 / 27.5 are the fandom / scanlation unit the catalog uses (AniList 99, the stored ep-13 row); Kodansha prints them as FILE:22 / FILE:27 (1)/(2). [high]', repair: true },
  { sid: 'ajin-demi-human', episode: 14, chapter: 24, start: 23, adapted: '23, 24', volume: 5, why: 'A10/A13 START 23: anime-original helicopter cold open, then "incorporates Chapter 23\'s opening"; ch 24 (committee, call, hospital confrontation) "virtually one for one" (AllYourAnime S2-1; ajin.fandom ch 23/24; ja-WP). [high]' },
  { sid: 'ajin-demi-human', episode: 15, chapter: 25, start: 25, adapted: "25 (+ Sakurai's airliner assassination: ch 23's off-page kill dramatised with ch 19-20's hijack material)", volume: 6, why: 'Training / Ogura IBM test / gun range "virtually one for one" (AllYourAnime S2-2); airliner = graft (ja-WP 桜井和夫 5巻23話 → 第2期15話). Pre-credits mask/tickets block is anime-original. [high]' },
  { sid: 'ajin-demi-human', episode: 16, chapter: 26, start: 26, adapted: '26, 28 (opening scene only, pulled forward)', volume: 6, why: '"Both the manga and the anime open with the same scene" (AllYourAnime S2-3); ch 28\'s opening pulled forward = graft (same shape as the ep-12 ruling). Kishi restaging per AYA + fandom ep 16. [high]' },
  { sid: 'ajin-demi-human', episode: 17, chapter: 28, start: 28, adapted: '28', volume: 6, why: 'A10/A13 START 28, A4 END 28: "the anime jumps over chapters 27 and 27.5. Instead we open with content from Chapter 28" (AllYourAnime S2-4); ja-WP 甲斐/李 9巻41話 → 第2期17話. A documented reorder (rearranged annotation stands). [high]' },
  { sid: 'ajin-demi-human', episode: 19, chapter: 27.5, start: 27, adapted: '27 (hospital opening scene only), 27.5 (abridged)', volume: 6, why: 'The episode\'s A-story is the Shimomura flashback: it opens on ch 27\'s hospital framing scene then plays 27.5 (waking healed; the plan to sell her) — ch 27\'s body (job, stepfather, money, assault) is cut (AYA S2-6 "all exclusive to the manga"; ja-WP 省略). START 27 under A10 (the block\'s leading scene; page count unverified → medium); END 27.5 (fandom unit; Kodansha FILE:27 (2)). [START medium, END high]' },
  { sid: 'trigun', episode: 16, chapter: 20, start: 20, adapted: "16 (E.G. Mine confrontation only, re-staged mid-episode), 20 (the Angel Arm / Fifth Moon climax through the chapter's closing 'the news spreads' beat; ch 20's middle — Knives' resurrection, the brothers, Wolfwood's assignment — is never animated)", volume: 3, why: 'Ep 16 FINISHES ch 20 (trigunwiki FIFTH MOON chapter page splits it: Dominique fight → ep 15, Angel Arm / fifth moon → ep 16; trigun.fandom Fifth_Moon manga = Chapter 16 / Chapter 20; title = title). START 20 not 16 (A12: the E.G. Mine fragment is a relocated mid-episode block after three anime-original blocks; trigunwiki SCARS). [high]' },
  { sid: 'soul-eater', episode: 36, chapter: 37, start: 36, adapted: "36-37 (ch 37 only through ~p.30 — the chapter's closing Death Room scene, Shinigami calling in Internal Investigation and Joe Buttataki's manga debut, is NOT adapted)", volume: 10, why: "REPAIR END 36 → 37 on the afg-continua row (→ manual, P8): AFG's own page-level continua — 'Chapter 36 (p. 24-41) and 37 (p. 1-30) … start reading from Chapter 37 (p. 31)' — and its chart row '36, 37'; fandom bidirectional (Episode 36 ↔ Chapter 37); ep 36 ends at Medusa's Lair one scene before ch 37's close (fandom; en-WP vol-10 summary; Joe's anime debut = ep 37). [high]", repair: true },
  { sid: 'soul-eater', episode: 38, chapter: 39, start: 38, adapted: "38-39 (partial: Joe's arrival at the DWMA and the coffee running gag, Naigus's Uncanny-Sword ban relayed via Tsubaki, and the spire-smash challenge to Kid from ch 38; the Black☆Star vs Kid duel from ch 39; all heavily altered — ch 39's climax, Joe's murder, is never adapted)", volume: 10, why: 'CONFIRMED (A4); chapters_adapted text widened per the verifier (fandom Chapter 38 differences map the Naigus ban and the spire challenge into ep 38). [high]', repair: true },
];

// CURATED CONTINUE POINTS (C1/C2/C3/C5) — explicit value + kind + note; the
// parity healer keeps a continue at or below its END (C1 guard).
const CONTINUES: Continue[] = [
  { sid: 'claymore', episode: 20, chapter: 57, kind: 'parity', note: 'C2 parity: ep 21 starts at Scene 57; ep 20 finishes Scene 56 (the battle group awaiting the Northern Army) — parity and END+1 agree.' },
  { sid: 'claymore', episode: 23, chapter: 60, kind: 'post_series', note: "C5 post-series resume (coverage 59 + 1): ep 23 is the last row that carries a position; 24-26 are filler (Sean, T28). Ch 60's opening plays in ep 24 and its close is transplanted into ep 26, both on filler rows — the middle (Jean stopping Helen, the six-survivor last stand) never reached the screen, so 60 is the honest resume, not 61. Never adapted: Scene 60 in context + 61-155 (95 Scenes); tankōbon through 69 and magazine through 73 were in print before the finale." },
  { sid: 'ajin-demi-human', episode: 13, chapter: 23, kind: 'parity', note: "C1/C2 (batch 19, Sean 2026-08-26): ep 13 closes on ch 23's opening beat (Sato's second-wave video) and ep 14 starts at 23 — continue IN 23. Replaces the batch-12-era value 22 and its C3 'skip 23' note (that premise — S2 adapts nothing — was overturned in batch 18). Numbering: 22.5 is the fandom / scanlation unit (Kodansha FILE:22)." },
  { sid: 'ajin-demi-human', episode: 14, chapter: 25, kind: 'parity', note: 'C2 parity: ep 15 starts at ch 25; ep 14 finishes ch 24.' },
  { sid: 'ajin-demi-human', episode: 15, chapter: 26, kind: 'parity', note: 'C2 parity: ep 16 starts at ch 26; ep 15 finishes ch 25.' },
  { sid: 'ajin-demi-human', episode: 16, chapter: 28, kind: 'parity', note: 'C2 parity across a SKIP: ep 17 starts at ch 28 — a viewer in step with the anime resumes at 28; ch 27 / 27.5 come later (ep 19).' },
  { sid: 'ajin-demi-human', episode: 17, chapter: 27, kind: 'parity', note: 'C2 parity across the BACK-JUMP: the next row with source content (ep 19) starts at ch 27. C3 skip note: ch 28 was already covered by this episode — skip it on arrival unless re-reading.' },
  { sid: 'ajin-demi-human', episode: 19, chapter: 29, kind: 'post_series', note: 'C5 post-series resume = furthest first-time coverage (ch 28, ep 17) + 1. Ep 19 is the last row that holds a position; ep 22 restages ch 32-42 in a substituted setting and is position-less (A44). Never adapted: ch 29-30 (Tosaki/Sokabe ambush; Sato\'s Marine past), 32-37; 31/31.5 only loosely (ep 21). Content farms answer "continue at 22" on the premise batch 18 overturned. Numbering: 27.5 = Kodansha FILE:27 (2).' },
  { sid: 'chrono-crusade', episode: 20, chapter: 31, kind: 'post_series', note: "C5 post-series resume on the adaptation bound (MU: 'Ends at Vol 5, Chap 30 (Skips Chap 7, 12-18) Diverges to an original ending'): coverage 30 + 1. Never adapted: Acts 7, 12-18, 31-35, 42-56 and the v8 Epilogue — except the ep-22 Satella/Fiore crystallisation scene (partial, v7, annotation-only); 22-30 are a loose retelling; 36-41 (the Magdalene flashback, ep 21) were seen but rewritten — do not skip them. Batch 17's 'restart at Act 1' is reader advice, not a position." },
  { sid: 'trigun', episode: 16, chapter: 20, kind: 'post_series', note: "C5 post-series resume — the SPACE ENDS at ch 20 (trigunwiki 'twentieth and final chapter'; Tokuma vol 3 = 14-20 + two unnumbered bonus tracks): there is no ch 21 in this entry's numbering, so coverage + 1 has no referent; ch 20's middle (Knives' resurrection, the brothers, Wolfwood's assignment) is never animated, so re-reading ch 20 whole is the honest resume. Next is Trigun Maximum ch 1 (a separate entry's space). Sean 2026-08-26: (a) until the display total is ruled durably (latest_known re-derives every MU run), 20 is the row; not 21 (a chapter that does not exist)." },
  { sid: 'soul-eater', episode: 36, chapter: 37, kind: 'parity', note: "C1 straddle (Sean 2026-08-26: 'that is C1'): ep 36 ends mid-ch-37 (AFG: 'Chapter 36 (p. 24-41) and 37 (p. 1-30) … start reading from Chapter 37 (p. 31)'); the chapter's closing Death Room / Internal Investigation scene is never adapted straight (ep 37 rewrites it). NOT parity to ep 38's start 38 — the C1 guard keeps this value." },
  { sid: 'soul-eater', episode: 38, chapter: 37, kind: 'post_series', note: "C5 post-series resume = ch 37: the last row that adapts chapters (38) adapts only fragments of 38-39 and never their spine — ch 39's climax (Joe's murder) is unadapted and ch 40 opens on Stein's arrest for it, so 40 (batch 18) would skip the reader past the whole mole hunt; 38 is the defensible alternative (~10 pages lost); 37 finishes the straddled chapter (C1). Re-encounters at 38/39 are not a true re-read (Joe's premise differs; the duel's surroundings differ)." },
  { sid: 'a-certain-scientific-railgun', episode: 12, chapter: 18, kind: 'parity', note: "C2 parity (batch 19): ch 17 「七月二十五日」 was animated at ep 2 (its second half; toaru fandom ch 17 Adapted To = Episode 02; ja Railgun wiki arc map 幻想御手編 = 第1巻第1話～第3巻第17話 / 一期第1話～第12話), so the stored 17 and its note ('ch 17 aftermath comes as ep 14 graft', refuted under A6) both fail. Parity resolves against the next row with a KNOWN start — ep 26 (Railgun S #2) = ch 18 — not ep 15 (canon by adoption, position-less). Ch 16-special was never adapted." },
  { sid: 'a-certain-scientific-railgun', episode: 49, chapter: 44, kind: 'parity', note: "C2 parity: ep 49 closes ch 43 completely (Misaki and Gunha chosen) and ep 50 opens at ch 44 'Commencement'." },
];

// ANNOTATIONS — research-origin upserts (PK series, episode, kind: an
// existing row of the same kind is REWRITTEN — the corrected notes)
const ANNOTATIONS: Ann[] = [
  { sid: 'ajin-demi-human', episode: 14, kind: 'divergence', chapters: '23, 24', note: "Refines the season-wide divergence for this row: anime-original helicopter cold open; ch 23's second-wave video relocated to the episode's end." },
  { sid: 'ajin-demi-human', episode: 16, kind: 'graft', chapters: '28 (opening scene, pulled forward)', note: 'Ep 16 closes by pulling ch 28\'s opening scene forward (Kaito meeting his new cellmate) — the same graft shape as the ep-12 ruling.' },
  { sid: 'ajin-demi-human', episode: 22, kind: 'partial', chapters: '32-42 (loose)', note: "Restages the manga's Forge Security arc (ch 32-42) in a substituted setting (ja-WP: 武蔵重工の橋口 for フォージ安全の甲斐と李; 黒木 9巻38話 / 平沢 9巻42話 → 第2期22話): ch 32-37 have no counterpart; the last minutes launch the anime-original ending. Supports the A44 suppression — no position." },
  { sid: 'chrono-crusade', episode: 15, kind: 'loose_parallel', chapters: '22-26', note: "T28 tie for a row retyped FILLER (batch 19): the v4 block's furniture (San Francisco, Guilliam, the Pursuers) without its story — the manga's Pursuers HUNT the party (ja-WP 追跡者 entries), the anime's Order/Pursuers alliance is anime-only (a distant v7 echo at the Eden assault, a relocated concept, A2/A12); the Magdalene-reincarnation premise is anime-only (ja-WP Rosette). Fuji TV synopsis; tropedia." },
  { sid: 'chrono-crusade', episode: 16, kind: 'loose_parallel', chapters: '22-26', note: "T28 tie for a row retyped FILLER (batch 19): an anime-exclusive case built on Eliza Brown (fandom: 'only appearing in an anime-exclusive … Episode 16'); its one source-flavoured beat (Aion's reveal + kiss) is itself in tropedia's Anime Only list. Satella's backstory (Acts 15-17 / v7) is the real tie, unnumbered here. Fuji TV synopsis." },
  { sid: 'chrono-crusade', episode: 21, kind: 'graft', chapters: '36-41 (v6 flashback; extent inferred, end Act unverified)', note: "Zone-acknowledged (A7 → A44, batch 19): the Mary Magdalene flashback pulls v6 material far out of order inside the anime's own ending; only zone-level knowledge exists (fandom debut-manga = ch 36; en-WP's v6 titles 36-41; the cc-reread blog: Acts 36-38 are 'half of the flashbacks'; no source states which Acts ep 21 adapts). Divergent at both primaries (ja-WP: 聖女の偽者…神から遣わされた罠 vs the manga's Pandaemonium contract). No position — an END here would leap the never-adapted 31-35." },
  { sid: 'trigun', episode: 16, kind: 'divergence', chapters: '20', note: "trigunwiki: the Fifth Moon in the manga is Vash's Angel Arm forcibly activated by Knives with the brothers' confrontation; the anime restages the activation without ch 20's middle (Knives' resurrection, the brothers' confrontation, Wolfwood's reassignment) — and relocates ch 16's E.G. Mine confrontation into this episode." },
  { sid: 'soul-eater', episode: 36, kind: 'divergence', chapters: '37', note: "Ep 36 stops one scene short of the end of ch 37 (through ~p.30, AFG) and substitutes an anime-original outcome for the chapter's closing Death Room / Internal Investigation scene (Shinigami summoning Joe Buttataki); ep 37 rewrites that scene as a technology-consultant summons." },
  { sid: 'soul-eater', episode: 37, kind: 'loose_parallel', chapters: '37 (closing scene) - 38', note: "Refinement (batch 19, verifier-corrected): anime-original Kid detective episode with no corresponding chapters (fandom; ja-WP; AFG N/A) — filler stands; its ties are ch 37's closing summons rewritten and the Eruka/Crona alley beat from ch 38's CLOSING Deathbucks section ('Crona, Medusa's counting on you'), minus Maka overhearing." },
  { sid: 'a-certain-scientific-railgun', episode: 25, kind: 'graft', chapters: '41 (Tokiwadai library scene)', note: "REPLACES the refuted partial{~18 setup} (deleted): Railgun S #1 lifts ONE scene from manga ch 41 'Clique, Part 1' — the library confrontation (toaru fandom S#1 Adapted From: 'The library scene is lifted from the 41st … chapter, otherwise all the content is an anime original'; ch 41 Adapted To confirms); the rest is an original re-intro + Poltergeist coda. Ch 18's Adapted To is S ep 2 (our 26). Filler stands under T28 (one ~2-minute lifted scene)." },
  { sid: 'a-certain-scientific-railgun', episode: 49, kind: 'graft', chapters: '41', note: "CORRECTED (batch 19, verifier): the Tokiwadai confrontation is a REDONE version of ch 41's library scene, first adapted at ep 25 (Railgun S #1) — T#1's own 'Differences in Adaptation' says so; the hospital framing borrows the ch-41 COVER illustration (T#1 Adapted From tags ch 41 cover-only; the cover image confirms it). Re-use of a chapter first adapted elsewhere — never moves position (A4); END 43 stands, chapters_adapted = 43." },
  { sid: 'dragon-ball-super', episode: 18, kind: 'loose_parallel', chapters: '4', note: "The only DBS-manga correspondence anywhere in 18-27: ch 4's closing pages (Champa/Vados, Tagoma's report, Sorbet deciding to revive Frieza) parallel the episode's tag scene, staged differently (ja-WP files the divergence; fandom maps ch 4 ↔ ep 18 both ways). ja-WP puts ep 18 in the Beerus arc, fandom/AFL in the Frieza block. [kind: loose_parallel — the series' 91/94/95 use partial for a one-scene restaging; Sean may align]" },
];

// ANNOTATION DELETIONS (P24 shape, batch-17 precedent) — a verdict proved
// the stored annotation itself wrong. Claymore's three stale loose_parallel
// {57-59} rows are NOT here: Sean 2026-08-26 — they wait for a durable
// annotation-delete shape.
const ANN_DELETIONS: AnnDel[] = [
  { sid: 'a-certain-scientific-railgun', episode: 25, kind: 'partial', why: "partial{~18 setup} refuted three ways: the episode page says only the library scene (ch 41) is adapted; ch 18's Adapted To = Railgun S ep 2 (our 26); the ja Railgun wiki maps 妹達編 to S #2+. Replaced by graft{41}." },
  { sid: 'a-certain-scientific-railgun', episode: 49, kind: 'partial', why: 'partial{40-42} contradicts the stored abridged{40-42} on the same row and the chapter pages (ch 40 → S ep 17 rat scene only; ch 42 → the T Drama CD only). abridged{40-42} is the correct fact; two annotations asserting opposites on one row is a defect (verifier).' },
];

// ROW TEXT REPAIRS on existing anchors (chapters_adapted only; values stand)
const ADAPTED_FIX: { sid: string; episode: number; adapted: string; why: string }[] = [
  { sid: 'a-certain-scientific-railgun', episode: 49, adapted: '43', why: "The ch-41 component was a re-done scene of a chapter first adapted at ep 25 (annotation graft{41}), not content of this episode's position; T#1 Adapted From = ch 43 (+ ch 41 cover-only)." },
];

// C8 SERIES CONTINUE (series.continue_from_chapter)
const SERIES_CONTINUE: { sid: string; chapter: number; why: string }[] = [
  { sid: 'claymore', chapter: 60, why: "The stored 57 (batch 3: 'faithful adaptation ends at ch 56 (ep 20)') rested on AFG's summary line that AFG's own footnote contradicts; eps 21-23 adapt Scenes 57-59 1:1 (batch 18 verified, batch 19 anchored). Post-series resume 60 per C5; continua is G26-suppressed for claymore." },
];

async function main() {
  const runId = await startRun('resolve');
  const lines: string[] = [];
  let n = 0;
  try {
    for (const a of ANCHORS) {
      const cur = (await selectAll<AnchorRow>('chapter_anchors', 'chapter, start_chapter, source, chapters_adapted, volume', (q) => q.eq('series_id', a.sid).eq('episode', a.episode)))[0];
      const note = `${B}: ${a.why} <${OUT}/${a.sid}.json ; ${VER}/${a.sid === 'gto-great-teacher-onizuka' ? 'gto' : a.sid}.md>`.slice(0, 900);
      lines.push(`  ANCHOR ${a.sid} ep${a.episode}: ${cur ? `${cur.chapter} [${cur.start_chapter}] (${cur.source})` : 'NEW'} → ${a.chapter} [${a.start}] v${a.volume} (manual)`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').upsert({ series_id: a.sid, episode: a.episode, chapter: a.chapter, start_chapter: a.start, chapters_adapted: a.adapted, volume: a.volume, source: 'manual', note }, { onConflict: 'series_id,episode' });
        if (error) throw new Error(`anchor ${a.sid} ep${a.episode}: ${error.message}`);
      }
      n++;
    }
    for (const c of CONTINUES) {
      const cur = (await selectAll<ContRow>('chapter_anchors', 'continue_chapter, continue_kind', (q) => q.eq('series_id', c.sid).eq('episode', c.episode)))[0];
      if (!cur) { lines.push(`  !! continue ${c.sid} ep${c.episode}: no anchor row (apply anchors first)`); continue; }
      lines.push(`  CONTINUE ${c.sid} ep${c.episode}: ${cur.continue_chapter ?? '—'}/${cur.continue_kind ?? '—'} → ${c.chapter}/${c.kind}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').update({ continue_chapter: c.chapter, continue_kind: c.kind, continue_note: c.note.slice(0, 600) }).eq('series_id', c.sid).eq('episode', c.episode);
        if (error) throw new Error(`continue ${c.sid} ep${c.episode}: ${error.message}`);
      }
      n++;
    }
    for (const f of ADAPTED_FIX) {
      lines.push(`  ADAPTED ${f.sid} ep${f.episode}: → "${f.adapted}"`);
      if (!DRY) { const { error } = await db.from('chapter_anchors').update({ chapters_adapted: f.adapted }).eq('series_id', f.sid).eq('episode', f.episode); if (error) throw new Error(error.message); }
      n++;
    }
    for (const d of ANN_DELETIONS) {
      const cur = await selectAll<{ note: string | null }>('episode_annotations', 'note', (q) => q.eq('series_id', d.sid).eq('episode', d.episode).eq('kind', d.kind));
      lines.push(`  ANN-DELETE ${d.sid} ep${d.episode} ${d.kind}: ${cur.length ? 'present → delete' : 'already absent'}`);
      if (!DRY && cur.length) { const { error } = await db.from('episode_annotations').delete().eq('series_id', d.sid).eq('episode', d.episode).eq('kind', d.kind); if (error) throw new Error(error.message); }
      n++;
    }
    for (const a of ANNOTATIONS) {
      lines.push(`  ANN ${a.sid} ep${a.episode} ${a.kind} {${a.chapters ?? ''}}`);
      if (!DRY) await upsertAnnotation({ series_id: a.sid, episode: a.episode, kind: a.kind as AnnotationKind, chapters: a.chapters, note: `${B}: ${a.note}`.slice(0, 900), origin: 'research' });
      n++;
    }
    for (const s of SERIES_CONTINUE) {
      const cur = (await selectAll<{ continue_from_chapter: number | null }>('series', 'continue_from_chapter', (q) => q.eq('id', s.sid)))[0];
      lines.push(`  SERIES-CONTINUE ${s.sid}: ${cur?.continue_from_chapter} → ${s.chapter}`);
      if (!DRY) { const { error } = await db.from('series').update({ continue_from_chapter: s.chapter }).eq('id', s.sid); if (error) throw new Error(error.message); }
      n++;
    }
    console.log(lines.join('\n'));
    console.log(`[apply-wave1] ${n} decisions${DRY ? ' (dry run)' : ' applied'}`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DRY ? 0 : n, flagged: 0 }, `batch 19 wave 1 apply${DRY ? ' dry' : ''}`);
  } catch (e) {
    await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
