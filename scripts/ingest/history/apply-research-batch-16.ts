// Research batch 16 — the reorder-hole closure batch (Sean-approved after the
// 2026-08-24 save point 8977c04): all 38 remaining reorder holes from
// `verify-series-display --all` (10 series). Verdicts are DATA FILES in-repo
// (research/batch16/out/<series>.json — the cited record) applied under the
// §11 batch contract, batch-14 script lineage, with three batch-16 deltas:
//   1. zone_level_only verdicts: the target episode legitimately stays
//      zone-level — the matching episode_annotations row gets a
//      "zone-acknowledged (batch 16)" marker appended (audit-ui-truth splits
//      acknowledged rows into rearranged_zone_acknowledged so the open
//      work-list shrinks honestly, never silently).
//   2. annotation_updates: refined zone facts UPSERT over the stale note
//      (same key series_id,episode,kind).
//   3. agent `repairs` are APPLIED, not just printed — but only via the
//      curated REPAIRS_APPROVED list below (never silent, and
//      convention-sensitive ones stay out pending Sean's ruling; the rest of
//      a verdict's repairs print as report lines exactly like batch 14).
// Everything else follows batch 14: anchors upsert end/start/chapters_adapted/
// volume (source 'manual'), sliver-rule + running-order END normalization,
// REPAIR detection vs existing curated values, continue points, type
// corrections only via EPISODE_TYPE_OVERRIDES, flags_for_sean → ONE review
// bookmark per series. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-16.ts [--dry-run] [seriesId ...]

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, startRun, finishRun, fileFlagOnce } from '../lib/db';
import { EPISODE_TYPE_OVERRIDES } from '../lib/resolve';

const DRY = process.argv.includes('--dry-run');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DIR = join(dirname(fileURLToPath(import.meta.url)), 'research/batch16/out');
const B = 'research-tier batch 16 (2026-08-24, agent-verified 2+ sources, reorder-hole closure)';
const ZMARK = 'zone-acknowledged (batch 16)';
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
  ['kamisama-kiss#25#end_chapter', 'finale anchors to what it adapts (Sean A4 rule): ep 25 = chs 62-63; ch 64 is consumed by ep 24\'s opening graft (whose lifted END keeps position/coverage at 64)'],
  ['kamisama-kiss#25#start_chapter', 'season-envelope start 31 replaced by the per-episode record now that eps 14-24 are exact; ep 25 opens at ch 62'],
  ['kamisama-kiss#25#chapters_adapted', 'envelope list replaced; the envelope\'s factual content now lives in the S2 zone annotation (eps 14-25)'],
  ['kamisama-kiss#10#chapters_adapted', 'batch-15 error corrected: mixer boy is Kohiruimaki, a named ch-50 character — the goukon merges ch 50\'s group date with ch 25\'s beats (UA fandom ch-50 char list + completed-manga-review)'],
  // HELD for Sean (agent asked for a ruling):
  //   kamisama-kiss#10#end_chapter/volume — if the mixer segment closes the
  //   episode, running-order END is arguably 50 (v9) not 25 (v5); segment
  //   order not verified frame-level → DECISIONS-FOR-SEAN
]);
// Anchors excluded from apply pending Sean's ruling (key `${sid}#${episode}`):
const EXCLUDED_ANCHORS = new Map<string, string>([]);
// Entry-level updates ratified by this batch's research:
const SERIES_UPDATES: { sid: string; patch: Record<string, unknown>; why: string }[] = [];
// Curated annotations (applied like verdict annotation groups; feed the
// order-check ruledEps): zone facts the verdicts evidence but did not file.
const CURATED_ANNOTATIONS: { sid: string; episodes: number[]; kind: string; chapters?: string; note: string }[] = [
  {
    sid: 'food-wars', episodes: [17, 18], kind: 'rearranged', chapters: '34-39 after 40-44',
    note: 'curated batch 16: the Karaage Wars block (chs 34-39) airs AFTER the swapped-forward father-son cookoff (40-44) — eps 17-18 are the displaced side of the batch-9 arc-swap zone, whose annotation previously tagged only eps 15-16; evidence in research/batch16/out/food-wars.json (fandom two-sided map, exact JP title identity, ANN ep-17 review).',
  },
];
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
  console.log(`[batch-16] ${verdicts.length} verdict file(s)${DRY ? ' — DRY RUN' : ''}`);
  const runId = DRY ? -1 : await startRun('resolve');
  const totals = { anchors: 0, repairs: 0, zoneAck: 0, continues: 0, annotations: 0, retyped: 0, orderOnly: 0, bookmarks: 0, appliedRepairs: 0, skipped: 0 };
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
      const merged = new Map<number, { chapter: number; start: number | null }>();
      for (const a of existing ?? []) if (a.source !== 'mu') merged.set(a.episode, { chapter: a.chapter, start: a.start_chapter });
      for (const a of v.anchors ?? []) if (seenEp.has(Number(a.episode))) merged.set(Number(a.episode), { chapter: Number(a.end_chapter), start: a.start_chapter == null ? null : Number(a.start_chapter) });
      const ordered = [...merged.entries()].sort((x, y) => x[0] - y[0]);
      for (let i = 1; i < ordered.length; i++) {
        const [ep, cur] = ordered[i];
        const [pep, prev] = ordered[i - 1];
        if (!seenEp.has(ep) && !seenEp.has(pep)) continue;
        if ((cur.chapter < prev.chapter || (cur.start != null && cur.start < prev.chapter - 1)) && !ruledEps.has(ep)) {
          lines.push(`   WARN order: ep${ep} → ${cur.chapter}${cur.start != null ? ` [start ${cur.start}]` : ''} sits below ep${pep} → ${prev.chapter} with no rearranged/graft ruling — verify or annotate`);
        }
      }
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
      for (const z of v.zone_level_only ?? []) {
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

      // ---- agent repairs: curated application (REPAIRS_APPROVED), else report
      for (const r of v.repairs ?? []) {
        const ep = Number(r.episode);
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
            note: `batch 16 research notes (${notes.length}; full text: scripts/ingest/research/batch16/out/${sid}.json): ${notes.map((f, i) => `(${i + 1}) ${f}`).join(' ')}`.slice(0, 1800),
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

    console.log(report.join('\n'));
    console.log(`\n[batch-16] anchors ${totals.anchors} (repairs-detected ${totals.repairs}), zone-ack ${totals.zoneAck}, continue ${totals.continues}, annotations ${totals.annotations}, retyped ${totals.retyped}, applied-repairs ${totals.appliedRepairs}, bookmarks ${totals.bookmarks}, skipped ${totals.skipped}${DRY ? ' — nothing written' : ''}`);
    if (!DRY) await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: totals.anchors, flagged: totals.bookmarks }, `research batch 16: ${verdicts.length} series, ${totals.anchors} anchors, ${totals.zoneAck} zone-ack, ${totals.appliedRepairs} applied repairs`);
  } catch (e) {
    if (!DRY) await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
