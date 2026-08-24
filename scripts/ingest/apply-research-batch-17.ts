// Research batch 17 — the GAP TIER batch (roadmap item 2, Sean-approved
// 2026-08-24): the anchor_gap_research class (unanchored canon stretches) +
// the frontier_tail_null class (canon eps past the last anchor). Verdicts are
// DATA FILES in-repo (research/batch17/out/<series>.json — the cited record)
// applied under the §11 batch contract, batch-16 script lineage, with the
// batch-17 deltas:
//   1. ANCHOR DELETIONS (new): a verdict repair with new === null removes a
//      stored anchor entirely. Gap research surfaced a whole CLASS of these —
//      MU coverage pins that state a FRANCHISE/sequel endpoint and landed on a
//      scoped entry (ace-ii ep52 = Season 2's ch 259; yowamushi ep38 = the
//      season-5 franchise end; gantz ep26 = the Gantz:O movie; toriko ep147 =
//      a full volume past the frontier) or on an anime-original finale where
//      A1 forbids an anchor at all. Only via DELETIONS_APPROVED, never silent.
//   2. BOUNDARY_SEEDS (new): research-tier volume_boundaries rows recovered by
//      the agents (YYH v9-13, which our table lacked) or healing corrupt
//      stored rows (rave-master v9/v10 were polluted by omake numbering).
//   3. zone_level_only + annotation_updates + curated REPAIRS_APPROVED behave
//      exactly as in batches 15/16.
// Everything else follows batch 14: anchors upsert end/start/chapters_adapted/
// volume (source 'manual'), sliver-rule + running-order END normalization,
// REPAIR detection vs existing curated values, continue points, type
// corrections only via EPISODE_TYPE_OVERRIDES, flags_for_sean → ONE review
// bookmark per series. Re-runnable (safe to re-run as later verdicts land).
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-17.ts [--dry-run] [seriesId ...]

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { EPISODE_TYPE_OVERRIDES } from './lib/resolve';

const DRY = process.argv.includes('--dry-run');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DIR = join(dirname(fileURLToPath(import.meta.url)), 'research/batch17/out');
const B = 'research-tier batch 17 (2026-08-24, agent-verified 2+ sources, gap tier)';
const ZMARK = 'zone-acknowledged (batch 17)';
const now = () => new Date().toISOString();

type Anchor = { episode: number; end_chapter: number; start_chapter?: number | null; chapters_adapted?: string | null; volume?: number | null; confidence?: string; note?: string; sources?: string[] };
type Verdict = {
  series_id: string;
  summary?: string;
  anchors?: Anchor[];
  zone_level_only?: { episode: number; zone?: string; best_bound?: string; tried?: string; sources?: string[] }[];
  continue_points?: { episode: number; continue_chapter: number; note?: string }[];
  annotations?: { episodes: number[]; kind: string; chapters?: string | null; note?: string }[];
  annotation_updates?: { episodes: number[]; kind: string; chapters?: string | null; note?: string }[];
  type_corrections?: { episodes: number[]; type: string; note?: string; sources?: string[] }[];
  repairs?: { episode: number; field?: string; old?: unknown; new?: unknown; why?: string; sources?: string[] }[];
  structure?: { notes?: string; order_only?: { anilist_id?: number; title?: string; after_anilist_id?: number; adapts?: string; note?: string }[] };
  flags_for_sean?: string[];
};

// Curated approvals for agent `repairs` on NON-target episodes (target-ep
// corrections flow through the anchor upsert + REPAIR detection like batch
// 14). key = `${sid}#${episode}#${field}`; value = why-approved. A verdict
// repair NOT listed here prints as a report line only — convention-sensitive
// ones go to DECISIONS-FOR-SEAN instead. FILLED AFTER READING EVERY VERDICT.
const REPAIRS_APPROVED = new Map<string, string>([
  // ---- MU franchise/sequel-endpoint conflation (the batch-17 pattern): a MU
  // coverage pin stating a LATER entry's endpoint landed on this scoped entry.
  ['ace-of-the-diamond-act-ii#52#end_chapter', 'stored 259 is Act II SEASON 2 Part 1\'s 2026 endpoint on this finished 52-ep entry; the season ends ch 169 (fandom + MangaShed + WDTALO)'],
  ['ace-of-the-diamond-act-ii#52#volume', 'paired: ch 169 sits in vol 19 (166-174), not vol 30'],
  ['yowamushi-pedal#38#end_chapter', 'stored 544 is the WHOLE-FRANCHISE endpoint (post-season-5 "continue at 544") on this S1-only entry; S1 ends ch 140 (fandom + Wikipedia + Grande Road ep 1 opening at 140-145)'],
  ['yowamushi-pedal#38#volume', 'paired: ch 140 is vol 17 (138-146), not the season-5 franchise volume 63'],
  // ---- finale inflation (Sean's A4 rule: a finale anchors to what it ADAPTS)
  ['sailor-moon-crystal#39#end_chapter', 'A4 finale rule: ep 39 adapts Act 38 only; stored 60 was the manga\'s LAST chapter (Stars 11) filled in as a finale value'],
  ['sailor-moon-crystal#39#volume', 'paired: Act 38 sits in vol 10; v18 is the Stars arc end'],
  ['gintama#369#end_chapter', 'stored 704 counts the Jump GIGA chapters (699-704) that only THE FINAL movie adapts; the semi-final ep 369 adapts L693-696 (fandom fwd+reverse)'],
  // ---- plain wrong values, evidenced
  ['hikaru-no-go#75#end_chapter', 'finale adapts Game 148 (exact episode/chapter title match なつかしい笑顔 + explicit wiki chapter field); stored 166 unsupported'],
  ['hikaru-no-go#75#volume', 'paired: Game 148 closes vol 17 (fandom chapter list + Wikipedia)'],
  ['mashle-magic-and-muscles#24#end_chapter', 'resolves a double-claim: our ep 25 = chs 73-74, so ep 24 cannot also end at 74; wiki E23 = chs 71-72 (numbering offset verified by title+date)'],
  // HELD (not applied — see DECISIONS-FOR-SEAN batch 17):
  //   toriko#147 → handled as a DELETION instead (filler row, A1)
  //   shugo-chara#127 → agent kept the stored value deliberately (scene-level
  //   sliver only; AFL disagrees with fandom on the typing)
]);
// Stored anchors DELETED by this batch (key `${sid}#${episode}`). Gap research
// proved each one is not a position instrument for THIS entry at all.
const DELETIONS_APPROVED = new Map<string, string>([
  ['gantz#26', 'ep 26 is anime-original filler (A1: filler rows never take anchors) and the stored ch-280/v25 value is the Gantz:O MOVIE endpoint — wrong instrument on a forbidden row'],
  ['chrono-crusade#24', 'ep 24 is the anime-original ending (typed anime-only-canon this batch); the stored ch-30 value is MU\'s SERIES-level bound ("ends at Vol 5 Chap 30, diverges") misplaced onto it — the real ch-30 bound now sits on ep 20'],
  ['fate-kaleid-liner-prisma-illya#42', 'ep 42 is the Oath Under Snow movie adapting 3rei!! chs 29-39 — a DIFFERENT manga; the stored ch-13 pin is a wrong-chapter-space value in the 1st-series numbering (order-only until the entry is split)'],
  ['toriko#147', 'ep 147 is filler (A1) AND the stored ch-263 value overshoots the adaptation frontier by a full volume; the honest terminal anchor is ep 146 → ch 253, which this batch writes'],
]);
// Research-tier volume_boundaries recovered/healed by the agents. full = the
// rows replace every stored row for that manga; else upsert by volume.
const BOUNDARY_SEEDS: { sid: string; why: string; full?: boolean; rows: { volume: number; chapter_start: number; chapter_end: number | null }[] }[] = [
  {
    sid: 'yu-yu-hakusho-ghostfiles',
    why: 'our table had NO boundaries for this manga; recovered in fandom/JP numbering (the space our anchors use — en-WP runs +1 from vol 8) with fandom chapter pages and shifted en-WP agreeing exactly',
    rows: [
      { volume: 10, chapter_start: 82, chapter_end: 91 },
      { volume: 11, chapter_start: 92, chapter_end: 100 },
      { volume: 12, chapter_start: 101, chapter_end: 109 },
      { volume: 13, chapter_start: 110, chapter_end: 118 },
    ],
  },
  {
    sid: 'rave-master',
    why: 'stored v9 "65-14" and v10 "15-79" are corrupt (omake chapter numbering 0014/0015 polluted the parse); true v9=65-73, v10=74-79 per Wikipedia chapter list + fandom chapter pages',
    rows: [
      { volume: 9, chapter_start: 65, chapter_end: 73 },
      { volume: 10, chapter_start: 74, chapter_end: 79 },
    ],
  },
];
// Anchors excluded from apply pending Sean's ruling (key `${sid}#${episode}`):
const EXCLUDED_ANCHORS = new Map<string, string>([]);
// Curated zone acknowledgements: annotated episodes that legitimately carry NO
// anchor because what they touch is borrowed, concept-level, or a
// character-debut timing difference — Sean's A2/A3 rule (cameo/sliver
// borrowings never set position). The marker moves them out of the open
// research work-list into rearranged_zone_acknowledged, honestly rather than
// silently.
const CURATED_ZONE_ACK: { sid: string; episode: number; bound: string }[] = [
  { sid: 'chrono-crusade', episode: 6, bound: 'Satella is introduced via an anime-original mission; her manga intro (Act 15) is skipped entirely — no chapter adapted, A2 annotation-only' },
  { sid: 'chrono-crusade', episode: 8, bound: 'anime-original story borrowing only the spider/puppet CONCEPT from Acts 19-21 — concept-level, never a position' },
  { sid: 'chrono-crusade', episode: 21, bound: 'Mary Magdalene flashback pulls v6 material (36-41) far out of order inside an otherwise anime-original stretch — graft, not this episode\'s position' },
  { sid: 'sailor-moon', episode: 103, bound: 'character-timing difference (Chibiusa/Chibi Moon deferred vs the manga), not adapted chapters' },
  { sid: 'sailor-moon', episode: 113, bound: 'character-timing difference (Hotaru introduced mid-season vs Infinity\'s opening), not adapted chapters' },
  { sid: 'sailor-moon', episode: 133, bound: 'character-timing difference (Diana\'s debut relocated out of Black Moon), not adapted chapters' },
  { sid: 'shugo-chara', episode: 59, bound: 'partially re-covers ch 22 material already adapted by ep 39 — a re-tread, so ch 22 is not this episode\'s position' },
  { sid: 'shugo-chara', episode: 93, bound: 'Nagihiko\'s Beat Jumper debut (ch 34) grafted early; ch 34 is properly covered by its own later episode' },
];
// Entry-level updates ratified by this batch's research:
const SERIES_UPDATES: { sid: string; patch: Record<string, unknown>; why: string }[] = [];
// Curated annotations (applied like verdict annotation groups; feed the
// order-check ruledEps): zone facts the verdicts evidence but did not file.
const CURATED_ANNOTATIONS: { sid: string; episodes: number[]; kind: string; chapters?: string; note: string }[] = [
  {
    sid: 'sailor-moon', episodes: [73], kind: 'rearranged', chapters: '15-17',
    note: 'curated batch 17: ep 73 condenses the Rubeus abduction motif from chs 15-17 AFTER ep 71 already adapted ch 16 — a genuine step back in the loose R-season adaptation, rendered as stored (the derived-start rule keeps ep 72 at 17 rather than following the jump).',
  },
];
// DOCUMENTED REORDER REGIMES (batch 17). Each verdict PROVES its series adapts
// out of publication order, so below-predecessor anchors are honest data, not
// suspect values. The apply step derives the per-episode `rearranged`
// annotations from the anchors that actually jump (never a blanket claim over
// a season), which is what makes the audit read them as ruled.
// NOTE the shape trap these verdicts exposed: agents write regime spans as
// `episodes: [3, 201]` meaning "3 THROUGH 201", but the annotation contract is
// a LIST of episodes — those groups land on the two boundary episodes only.
// The derived annotations below are what actually covers the span.
const REORDER_REGIMES: Record<string, string> = {
  gintama: 'reorder regime (batch 17): Gintama adapts Lessons far out of publication order across its whole run — S1 shuffles vols 1-34 (ep 25 = L100 pulled ~60 chapters forward), Gintama\' opens on post-timeskip L324-326 then rewinds, Gintama° interleaves the skipped L384-465 backlog, and Porori-hen (329-341) is pure backlog slotted between Rakuyou and Silver Soul',
  'heavens-lost-property': 'reorder regime (batch 17): the anime adapts its short chapters out of order across both seasons, revisiting earlier material after later material',
  'shugo-chara': 'reorder regime (batch 17): Doki-era episodes revisit earlier chapters and our DB episode numbering diverges from broadcast order (rows 73-96 — episode-row audit flagged), so adjacent anchors legitimately step backwards',
  'kenichi-the-mightiest-disciple': 'reorder regime (batch 17): the OAD block (rows 51-61) adapts the Yami/YOMI saga out of manga order — Spark 158-166 before Eclair 145-150, a backfill of TV-skipped 106-109, then Boris 175-180 before 173-174',
  toriko: 'reorder regime (batch 17): ch 173 "Gourmet Santa" is pulled forward to the Christmas episode, and the war chapters 218-232 are regrouped per-fighter across eps 133-140',
  'hunter-x-hunter': 'reorder regime (batch 17): the Yorknew stretch pre-grafts and re-treads chapters (ch 72 p.1-3 into ep 50, the Uvogin fight stretched with overlapping page splits across eps 53-56, ch 83 mainline in ep 56 after its ep-45 pre-graft)',
  'that-time-i-got-reincarnated-as-a-slime': 'reorder regime (batch 17): S1 skips chs 40-42 and 44-45 and jumps to ch 43 + 46-52 for its final four episodes, leaving the skipped block to S2',
  kingdom: 'reorder regime (batch 17): ep 16 grafts the Ryo Fui introduction (chs 96-100) ahead of the campaign arc, and ep 22 skips 74-81 (adapted later in S2)',
  'sailor-moon-crystal': 'reorder regime (batch 17): Act 27 is split across eps 27-28, so the pair shares a chapter rather than advancing',
};
const REPAIR_FIELDS: Record<string, string> = {
  end_chapter: 'chapter', chapter: 'chapter', start_chapter: 'start_chapter',
  chapters_adapted: 'chapters_adapted', volume: 'volume', continue_chapter: 'continue_chapter',
};

const KINDS = new Set(['divergence', 'partial', 'graft', 'rearranged', 'side_story', 'loose_parallel', 'abridged']);
const TYPES = new Set(['canon', 'mixed', 'filler', 'anime-only-canon']);

function loadVerdicts(): Verdict[] {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.json')).sort();
  const out: Verdict[] = [];
  for (const f of files) {
    const v = JSON.parse(readFileSync(join(DIR, f), 'utf8')) as Verdict;
    if (!v.series_id) throw new Error(`${f}: missing series_id`);
    if (ONLY.length && !ONLY.includes(v.series_id)) continue;
    out.push(v);
  }
  return out;
}

async function main() {
  const verdicts = loadVerdicts();
  console.log(`[batch-17] ${verdicts.length} verdict file(s)${DRY ? ' — DRY RUN' : ''}`);
  const runId = DRY ? -1 : await startRun('resolve');
  const totals = { anchors: 0, repairs: 0, zoneAck: 0, continues: 0, annotations: 0, retyped: 0, orderOnly: 0, bookmarks: 0, appliedRepairs: 0, deletions: 0, boundaries: 0, skipped: 0 };
  const report: string[] = [];
  try {
    for (const v of verdicts) {
      const sid = v.series_id;
      const { data: s } = await db
        .from('series')
        .select('id, aired_episodes, total_chapters, latest_known_chapters, asterisk_review, manga_anilist_id')
        .eq('id', sid)
        .maybeSingle();
      if (!s) {
        report.push(`!! ${sid}: series not found — verdict skipped`);
        continue;
      }
      const { data: existing } = await db
        .from('chapter_anchors')
        .select('episode, chapter, start_chapter, source, note, chapters_adapted')
        .eq('series_id', sid);
      const byEp = new Map((existing ?? []).map((a) => [a.episode, a]));
      const { data: bounds } = s.manga_anilist_id
        ? await db.from('volume_boundaries').select('volume, chapter_start, chapter_end').eq('manga_anilist_id', s.manga_anilist_id).order('volume')
        : { data: [] as { volume: number; chapter_start: number; chapter_end: number | null }[] };
      const volOf = (ch: number): number | null => {
        const b = (bounds ?? []).find((x) => ch >= x.chapter_start && (x.chapter_end == null || ch <= x.chapter_end));
        return b ? b.volume : null;
      };
      const { data: annRows } = await db.from('episode_annotations').select('episode, kind, note').eq('series_id', sid);
      const ruledEps = new Set<number>((annRows ?? []).filter((a) => a.kind === 'rearranged' || a.kind === 'graft').map((a) => a.episode));
      const allAnnGroups = [...(v.annotations ?? []), ...(v.annotation_updates ?? []), ...CURATED_ANNOTATIONS.filter((c) => c.sid === sid)];
      for (const g of allAnnGroups) if (g.kind === 'rearranged' || g.kind === 'graft') for (const ep of g.episodes ?? []) ruledEps.add(Number(ep));
      const lines: string[] = [`== ${sid}: ${v.anchors?.length ?? 0} anchors, ${v.zone_level_only?.length ?? 0} zone-level, ${v.continue_points?.length ?? 0} continue, ${allAnnGroups.length} annotation groups, ${v.type_corrections?.length ?? 0} type corrections, ${v.repairs?.length ?? 0} repairs`];
      if (v.summary) lines.push(`   ${v.summary.slice(0, 400)}`);

      // ---- anchors (batch-14 lineage: sliver rule + running-order END)
      const seenEp = new Set<number>();
      for (const a of v.anchors ?? []) {
        const ep = Number(a.episode);
        const excl = EXCLUDED_ANCHORS.get(`${sid}#${ep}`);
        if (excl) { lines.push(`   EXCLUDED ep${ep} (Sean decision pending): ${excl.slice(0, 160)}`); totals.skipped++; continue; }
        let end = Number(a.end_chapter);
        let start = a.start_chapter == null ? null : Number(a.start_chapter);
        // SLIVER RULE (Sean 2026-08-23 s2, MHA ep 170): the episode's START is
        // the first chapter animated — a leading PARTIAL chapter counts unless
        // it is scraps (≤5 pages / sliver/teaser wording). Normalize agent
        // records to the one rule.
        {
          const lead = String(a.chapters_adapted ?? '').split(/,(?![^()]*\))/)[0]?.trim() ?? '';
          const leadNum = Number((lead.match(/^(\d+)(?!\.)/) ?? [])[1]);
          if (start != null && Number.isInteger(leadNum) && leadNum >= 1 && leadNum === start - 1) {
            const pageSpans = [...lead.matchAll(/(\d+)\s*[-–]\s*(\d+)/g)].map((m) => Math.max(0, Number(m[2]) - Number(m[1]) + 1));
            const singles = (lead.match(/(?:p\.?\s*|,\s*)(\d+)(?!\s*[-–]|\d)/g) ?? []).length;
            const pages = pageSpans.reduce((x, y) => x + y, 0) + (pageSpans.length ? 0 : singles);
            const wordy = /half|most|bulk|remainder|rest of|majority|through/i.test(lead);
            const scrappy = /sliver|teaser|cold[- ]open|fragment|panel|scrap|recap|flashback|montage|preview|replay/i.test(lead);
            const substantive = !scrappy && (wordy || pages >= 6);
            if (substantive) {
              lines.push(`   sliver rule: ep${ep} start ${start} → ${leadNum} (leading partial '${lead.slice(0, 48)}' ≈ ${pages || '?'} pages)`);
              start = leadNum;
            }
          }
        }
        // running-order END convention: END is the POSITION instrument — lift
        // to the highest mainline chapter touched when the agent's end sits
        // below the start; the list keeps the real order
        if (start != null && start > end) {
          const nums = String(a.chapters_adapted ?? '').match(/\d+(?:\.\d+)?/g)?.map(Number).filter((n) => Number.isInteger(n)) ?? [];
          const top = Math.max(start, end, ...nums);
          lines.push(`   note: ep${ep} running-order end ${end} lifted to position ${top} (list: ${a.chapters_adapted})`);
          end = top;
        }
        if (!Number.isFinite(ep) || !Number.isFinite(end) || ep < 1 || end < 0) { lines.push(`   !! bad anchor ${JSON.stringify(a).slice(0, 120)}`); totals.skipped++; continue; }
        if (ep > (s.aired_episodes ?? 0)) { lines.push(`   !! ep${ep} > aired ${s.aired_episodes} — skipped`); totals.skipped++; continue; }
        if (start != null && start > end) { lines.push(`   !! ep${ep} start ${start} > end ${end} — skipped`); totals.skipped++; continue; }
        if (seenEp.has(ep)) { lines.push(`   !! ep${ep} duplicated in verdict — later entry skipped`); totals.skipped++; continue; }
        seenEp.add(ep);
        const prev = byEp.get(ep);
        if (prev && prev.source !== 'mu' && !String(prev.note ?? '').includes(B) && (prev.chapter !== end || (prev.start_chapter != null && start != null && prev.start_chapter !== start))) {
          lines.push(`   REPAIR ep${ep}: ${prev.source} ${prev.chapter}${prev.start_chapter != null ? ` [start ${prev.start_chapter}]` : ''} → ${end}${start != null ? ` [start ${start}]` : ''} — ${(a.note ?? '').slice(0, 140)}`);
          totals.repairs++;
        } else if (prev && prev.source === 'mu') {
          lines.push(`   mu pin ep${ep} ${prev.chapter} → manual ${end}${prev.chapter === end ? ' (verified)' : ' (REPLACED)'}`);
        }
        const space = Math.max(s.total_chapters ?? 0, s.latest_known_chapters ?? 0);
        if (space && end > space + 10) lines.push(`   note: ep${ep} → ${end} exceeds current chapter space ${space} — research tier sets the floor; latest_known heals via MU`);
        const note = `${B}: ${a.note ?? ''}${a.confidence ? ` [${a.confidence}]` : ''}${a.sources?.length ? ` <${a.sources.slice(0, 3).join(' ; ')}>` : ''}`.slice(0, 900);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').upsert({
            series_id: sid, episode: ep, chapter: end, start_chapter: start,
            chapters_adapted: a.chapters_adapted ?? null, volume: a.volume ?? null, source: 'manual', note,
          });
          if (error) throw new Error(`${sid} ep${ep}: ${error.message}`);
        }
        totals.anchors++;
      }

      // ---- cross-checks: order vs neighbors, volume vs boundaries
      const regimeAnn: { ep: number; note: string; chapters: string }[] = [];
      const merged = new Map<number, { chapter: number; start: number | null }>();
      for (const a of existing ?? []) if (a.source !== 'mu') merged.set(a.episode, { chapter: a.chapter, start: a.start_chapter });
      for (const a of v.anchors ?? []) if (seenEp.has(Number(a.episode))) merged.set(Number(a.episode), { chapter: Number(a.end_chapter), start: a.start_chapter == null ? null : Number(a.start_chapter) });
      const ordered = [...merged.entries()].sort((x, y) => x[0] - y[0]);
      const regime = REORDER_REGIMES[sid];
      for (let i = 1; i < ordered.length; i++) {
        const [ep, cur] = ordered[i];
        const [pep, prev] = ordered[i - 1];
        if (!seenEp.has(ep) && !seenEp.has(pep)) continue;
        if ((cur.chapter < prev.chapter || (cur.start != null && cur.start < prev.chapter - 1)) && !ruledEps.has(ep)) {
          if (regime) {
            // DOCUMENTED REORDER REGIME (batch-17): the verdict proves this
            // series adapts out of publication order, so a below-predecessor
            // anchor is real data, not a suspect value. Annotate exactly the
            // episodes that ACTUALLY jump — derived from the applied anchors,
            // never a blanket claim over a whole season — so the audit reads
            // them as ruled and the UI can surface the reorder.
            regimeAnn.push({ ep, note: `${regime} | this episode's record sits below ep ${pep} (ch ${prev.chapter}) — reorder, rendered as stored`, chapters: `${cur.start ?? cur.chapter}-${cur.chapter} after ${prev.chapter}` });
            ruledEps.add(ep);
          } else {
            lines.push(`   WARN order: ep${ep} → ${cur.chapter}${cur.start != null ? ` [start ${cur.start}]` : ''} sits below ep${pep} → ${prev.chapter} with no rearranged/graft ruling — verify or annotate`);
          }
        }
      }
      if (regimeAnn.length) lines.push(`   reorder regime: ${regimeAnn.length} episode(s) annotated rearranged (derived from the anchors that jump)`);
      for (const a of v.anchors ?? []) {
        if (a.volume == null || !seenEp.has(Number(a.episode))) continue;
        const bv = volOf(Number(a.end_chapter));
        if (bv != null && bv !== Number(a.volume)) lines.push(`   WARN volume: ep${a.episode} → ch ${a.end_chapter} is vol ${bv} by Wikipedia boundaries, verdict says vol ${a.volume}`);
      }

      // ---- continue points (anchor must exist)
      for (const c of v.continue_points ?? []) {
        const ep = Number(c.episode);
        if (!seenEp.has(ep) && !byEp.has(ep)) { lines.push(`   !! continue ep${ep}: no anchor — skipped`); totals.skipped++; continue; }
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').update({ continue_chapter: Number(c.continue_chapter) }).eq('series_id', sid).eq('episode', ep);
          if (error) throw new Error(`continue ${sid} ep${ep}: ${error.message}`);
        }
        totals.continues++;
      }

      // ---- annotations + annotation_updates (same upsert; updates supersede)
      let annotated = false;
      for (const g of allAnnGroups) {
        if (!KINDS.has(g.kind)) { lines.push(`   !! annotation kind '${g.kind}' unknown — skipped`); totals.skipped++; continue; }
        for (const ep of g.episodes ?? []) {
          if (!DRY) {
            const { error } = await db.from('episode_annotations').upsert(
              { series_id: sid, episode: Number(ep), kind: g.kind, chapters: g.chapters ?? null, note: `${B}: ${g.note ?? ''}`.slice(0, 600) },
              { onConflict: 'series_id,episode,kind' },
            );
            if (error) throw new Error(`annotate ${sid} ep${ep}: ${error.message}`);
          }
          totals.annotations++;
          annotated = true;
        }
      }
      // derived reorder-regime annotations (see REORDER_REGIMES). Written
      // AFTER the verdict's own groups so a real per-episode annotation always
      // wins the (series_id, episode, kind) key over the derived regime note.
      for (const ra of regimeAnn) {
        const hasOwn = allAnnGroups.some((g) => (g.kind === 'rearranged' || g.kind === 'graft') && (g.episodes ?? []).map(Number).includes(ra.ep));
        if (hasOwn) continue;
        if (!DRY) {
          const { error } = await db.from('episode_annotations').upsert(
            { series_id: sid, episode: ra.ep, kind: 'rearranged', chapters: ra.chapters, note: `${B}: ${ra.note}`.slice(0, 600) },
            { onConflict: 'series_id,episode,kind' },
          );
          if (error) throw new Error(`regime-annotate ${sid} ep${ra.ep}: ${error.message}`);
        }
        totals.annotations++;
        annotated = true;
      }
      if (annotated && !DRY && s.asterisk_review == null) {
        await db.from('series').update({ asterisk_review: 'pending', updated_at: now() }).eq('id', sid);
      }

      // ---- zone_level_only: acknowledge the zone on its annotation rows so
      // the audit separates acknowledged-approximate from unresearched. MUST
      // run AFTER the annotations upsert — an annotation_update on the same
      // (episode, kind) would otherwise overwrite the marker. Re-read the
      // rows so the marker lands on the freshly-written note.
      const { data: annNow } = DRY
        ? { data: annRows }
        : await db.from('episode_annotations').select('episode, kind, note').eq('series_id', sid);
      const zoneEntries = [
        ...(v.zone_level_only ?? []),
        ...CURATED_ZONE_ACK.filter((c) => c.sid === sid).map((c) => ({ episode: c.episode, best_bound: c.bound, zone: undefined, tried: undefined, sources: undefined })),
      ];
      for (const z of zoneEntries) {
        const ep = Number(z.episode);
        const rows = (annNow ?? []).filter((a) => a.episode === ep && (a.kind === 'rearranged' || a.kind === 'graft'));
        const ack = `${ZMARK}: ${z.best_bound ?? z.zone ?? ''}${z.tried ? ` | tried: ${z.tried}` : ''}${z.sources?.length ? ` <${z.sources.slice(0, 2).join(' ; ')}>` : ''}`.slice(0, 500);
        if (!rows.length) {
          // no zone annotation to acknowledge (e.g. a hole ep) — record the
          // bound as a fresh rearranged annotation carrying the marker
          lines.push(`   zone-ack ep${ep} (no existing annotation — creating): ${(z.best_bound ?? z.zone ?? '').slice(0, 100)}`);
          if (!DRY) {
            const { error } = await db.from('episode_annotations').upsert(
              { series_id: sid, episode: ep, kind: 'rearranged', chapters: z.zone ?? null, note: ack },
              { onConflict: 'series_id,episode,kind' },
            );
            if (error) throw new Error(`zone-ack ${sid} ep${ep}: ${error.message}`);
          }
        } else {
          for (const r of rows) {
            if (String(r.note ?? '').includes(ZMARK)) { lines.push(`   zone-ack ep${ep} [${r.kind}] already marked — kept`); continue; }
            lines.push(`   zone-ack ep${ep} [${r.kind}]: ${(z.best_bound ?? '').slice(0, 100)}`);
            if (!DRY) {
              const { error } = await db.from('episode_annotations')
                .update({ note: `${String(r.note ?? '')} | ${ack}`.slice(0, 900) })
                .eq('series_id', sid).eq('episode', ep).eq('kind', r.kind);
              if (error) throw new Error(`zone-ack ${sid} ep${ep}: ${error.message}`);
            }
          }
        }
        totals.zoneAck++;
      }

      // ---- type corrections: applied only when the code map carries them
      for (const t of v.type_corrections ?? []) {
        if (!TYPES.has(t.type)) { lines.push(`   !! type '${t.type}' unknown — skipped`); continue; }
        const map = EPISODE_TYPE_OVERRIDES[sid] ?? {};
        const missing = (t.episodes ?? []).filter((ep) => map[Number(ep)] !== t.type);
        if (missing.length) {
          lines.push(`   TODO type: ${sid} eps ${missing.join(',')} → ${t.type} — add to EPISODE_TYPE_OVERRIDES then re-run (${(t.note ?? '').slice(0, 120)})`);
          continue;
        }
        for (const ep of t.episodes ?? []) {
          if (!DRY) await db.from('episodes').update({ type: t.type }).eq('series_id', sid).eq('number', Number(ep));
          totals.retyped++;
        }
      }

      // ---- anchor DELETIONS (batch-17 delta): a curated removal of a stored
      // anchor that gap research proved is not this entry's instrument at all
      // (MU franchise/sequel endpoints, movie endpoints, anchors on rows A1
      // forbids). Keyed `${sid}#${episode}` in DELETIONS_APPROVED; a verdict
      // repair with new === null that is NOT approved prints only.
      // The CURATED decision drives deletions, not the agent's field shape: a
      // verdict may propose the same removal as `new: null` OR as a value
      // repair we decided to answer with a deletion instead (Toriko ep 147
      // proposed 263 → 253, but the row is filler and A1 forbids the anchor
      // outright — the honest terminal anchor is ep 146).
      for (const [key, why] of DELETIONS_APPROVED) {
        const [dsid, deps] = key.split('#');
        if (dsid !== sid) continue;
        const ep = Number(deps);
        if (!byEp.has(ep)) { lines.push(`   DELETE ep${ep}: already absent (idempotent re-run)`); continue; }
        const prev = byEp.get(ep)!;
        lines.push(`   DELETE anchor ep${ep} (${prev.source} → ch ${prev.chapter}): ${why.slice(0, 150)}`);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').delete().eq('series_id', sid).eq('episode', ep);
          if (error) throw new Error(`delete ${sid} ep${ep}: ${error.message}`);
        }
        totals.deletions++;
      }

      // ---- agent repairs: curated application (REPAIRS_APPROVED), else report
      for (const r of v.repairs ?? []) {
        if (r.new === null) continue; // proposed removals: the deletion pass above rules on them
        const ep = Number(r.episode);
        if (DELETIONS_APPROVED.has(`${sid}#${ep}`)) continue; // answered with a deletion
        const key = `${sid}#${ep}#${r.field ?? ''}`;
        const col = REPAIR_FIELDS[String(r.field ?? '')];
        if (seenEp.has(ep) && (r.field === 'end_chapter' || r.field === 'start_chapter')) {
          lines.push(`   repair ep${ep} (${r.field}) covered by this verdict's own anchor upsert`);
          continue;
        }
        if (REPAIRS_APPROVED.has(key) && col && byEp.has(ep)) {
          const why = REPAIRS_APPROVED.get(key)!;
          lines.push(`   APPLY repair ep${ep}: ${r.field} ${JSON.stringify(r.old)} → ${JSON.stringify(r.new)} — ${why.slice(0, 140)}`);
          if (!DRY) {
            const prev = byEp.get(ep)!;
            const note = `${String(prev.note ?? '')} | REPAIR (${B}): ${r.why ?? why}`.slice(0, 1200);
            const { error } = await db.from('chapter_anchors').update({ [col]: r.new as never, note }).eq('series_id', sid).eq('episode', ep);
            if (error) throw new Error(`repair ${sid} ep${ep}: ${error.message}`);
          }
          totals.appliedRepairs++;
        } else {
          lines.push(`   agent-reported repair ep${ep} (NOT auto-applied): ${JSON.stringify(r).slice(0, 200)}`);
        }
      }

      // ---- flags for Sean: ONE review bookmark per series
      const notes = (v.flags_for_sean ?? []).filter((f) => f && f.trim());
      for (const f of notes) lines.push(`   FLAG: ${f.slice(0, 220)}`);
      if (notes.length) {
        if (!DRY) {
          await fileFlagOnce(runId, sid, 'research', 'count_mismatch', {
            kind_of_note: 'sean_review_bookmark',
            note: `batch 17 research notes (${notes.length}; full text: scripts/ingest/research/batch17/out/${sid}.json): ${notes.map((f, i) => `(${i + 1}) ${f}`).join(' ')}`.slice(0, 1800),
          });
        }
        totals.bookmarks++;
      }
      if (v.structure?.notes) lines.push(`   structure: ${v.structure.notes.slice(0, 300)}`);
      report.push(...lines);
    }

    // ---- entry-level updates ratified by the batch
    for (const u of SERIES_UPDATES) {
      if (ONLY.length && !ONLY.includes(u.sid)) continue;
      report.push(`== series UPDATE ${u.sid}: ${JSON.stringify(u.patch)} — ${u.why.slice(0, 160)}`);
      if (!DRY) {
        const { error } = await db.from('series').update({ ...u.patch, updated_at: now() }).eq('id', u.sid);
        if (error) throw new Error(`series update ${u.sid}: ${error.message}`);
      }
    }

    // ---- research-tier volume boundaries (recovered or healing corrupt rows)
    for (const seed of BOUNDARY_SEEDS) {
      if (ONLY.length && !ONLY.includes(seed.sid)) continue;
      const { data: s } = await db.from('series').select('manga_anilist_id').eq('id', seed.sid).maybeSingle();
      if (!s?.manga_anilist_id) { report.push(`!! boundary seed ${seed.sid}: no manga_anilist_id — skipped`); continue; }
      report.push(`== boundary seed ${seed.sid} (manga ${s.manga_anilist_id}, ${seed.rows.length} rows${seed.full ? ', FULL replace' : ''}): ${seed.why.slice(0, 170)}`);
      if (!DRY) {
        if (seed.full) await db.from('volume_boundaries').delete().eq('manga_anilist_id', s.manga_anilist_id);
        const { error } = await db.from('volume_boundaries').upsert(
          seed.rows.map((r) => ({ manga_anilist_id: s.manga_anilist_id, ...r, source: 'research', source_page: `batch 17: ${seed.why}`.slice(0, 300) })),
          { onConflict: 'manga_anilist_id,volume' },
        );
        if (error) throw new Error(`boundary seed ${seed.sid}: ${error.message}`);
      }
      totals.boundaries += seed.rows.length;
    }

    console.log(report.join('\n'));
    console.log(`\n[batch-17] anchors ${totals.anchors} (repairs-detected ${totals.repairs}), DELETIONS ${totals.deletions}, boundaries ${totals.boundaries}, zone-ack ${totals.zoneAck}, continue ${totals.continues}, annotations ${totals.annotations}, retyped ${totals.retyped}, applied-repairs ${totals.appliedRepairs}, bookmarks ${totals.bookmarks}, skipped ${totals.skipped}${DRY ? ' — nothing written' : ''}`);
    if (!DRY) await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: totals.anchors, flagged: totals.bookmarks }, `research batch 17: ${verdicts.length} series, ${totals.anchors} anchors, ${totals.zoneAck} zone-ack, ${totals.appliedRepairs} applied repairs`);
  } catch (e) {
    if (!DRY) await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
