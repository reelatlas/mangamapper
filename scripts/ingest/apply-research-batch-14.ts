// Research batch 14 — item-4 batch 8 (2026-08-23, session 2): the seven
// ruled-extension series' new seasons (Kingdom S2 gap + S5/S6, Rent-a-
// Girlfriend S4/S5, Black Butler Public School + Emerald Witch, Beastars
// Final Season, Magus Bride S2, Golden Kamuy S3-Final, Slime S2-S4) + the
// top-16 anchor-gap tier by popularity. Verdicts are DATA FILES kept in-repo
// (research/batch14/out/<series>.json — the cited record; earlier batches'
// scratchpad verdicts were lost) and this script applies them under the §11
// batch contract: anchors upsert chapter + start_chapter + chapters_adapted +
// volume (source 'manual'); continue points; annotations (+ asterisk_review
// pending); order-only records WITH adaptation spans; REPAIRS of existing
// curated values are detected programmatically and printed, never silent;
// proposed type corrections apply only once they exist in
// EPISODE_TYPE_OVERRIDES (a bare DB retype would be clobbered by the next
// AFL refresh) — missing ones print as TODOs; agents' flags_for_sean become
// review bookmarks. Re-runnable.
//   npx tsx --env-file=.env.ingest scripts/ingest/apply-research-batch-14.ts [--dry-run] [seriesId ...]

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { EPISODE_TYPE_OVERRIDES } from './lib/resolve';

const DRY = process.argv.includes('--dry-run');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DIR = join(dirname(fileURLToPath(import.meta.url)), 'research/batch14/out');
const B = 'research-tier batch 14 (2026-08-23 s2, agent-verified 2+ sources, full-record)';
const now = () => new Date().toISOString();

type Anchor = { episode: number; end_chapter: number; start_chapter?: number | null; chapters_adapted?: string | null; volume?: number | null; confidence?: string; note?: string; sources?: string[] };
type Verdict = {
  series_id: string;
  summary?: string;
  anchors?: Anchor[];
  continue_points?: { episode: number; continue_chapter: number; note?: string }[];
  annotations?: { episodes: number[]; kind: string; chapters?: string | null; note?: string }[];
  type_corrections?: { episodes: number[]; type: string; note?: string; sources?: string[] }[];
  repairs?: { episode: number; field?: string; old?: unknown; new?: unknown; why?: string; sources?: string[] }[];
  structure?: { notes?: string; order_only?: { anilist_id?: number; title?: string; after_anilist_id?: number; adapts?: string; note?: string }[] };
  flags_for_sean?: string[];
};

// Standing REPAIRS from this session, recorded here for the ledger (idempotent).
const SESSION_REPAIRS: { sid: string; episode: number; patch: Record<string, unknown>; why: string }[] = [
  {
    sid: 'attack-on-titan',
    episode: 87,
    patch: { start_chapter: 130 },
    why: "AoT ep 87 start 123→130 (Sean's out-of-order report 2026-08-23): the ch-123 first-half cold open is a relocated flashback sliver — majority rule + start-sanity: off-trend openers stay in chapters_adapted (kept: '123 (first half, relocated flashback), 130 (remainder)') with the rearranged annotation; the position is 130",
  },
];

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
  console.log(`[batch-14] ${verdicts.length} verdict file(s)${DRY ? ' — DRY RUN' : ''}`);
  const runId = DRY ? -1 : await startRun('resolve');
  const totals = { anchors: 0, repairs: 0, continues: 0, annotations: 0, retyped: 0, orderOnly: 0, bookmarks: 0, skipped: 0 };
  const report: string[] = [];
  try {
    for (const v of verdicts) {
      const sid = v.series_id;
      const { data: s } = await db
        .from('series')
        .select('id, aired_episodes, total_chapters, latest_known_chapters, asterisk_review')
        .eq('id', sid)
        .maybeSingle();
      if (!s) {
        report.push(`!! ${sid}: series not found — verdict skipped`);
        continue;
      }
      const { data: existing } = await db
        .from('chapter_anchors')
        .select('episode, chapter, start_chapter, source, chapters_adapted')
        .eq('series_id', sid);
      const byEp = new Map((existing ?? []).map((a) => [a.episode, a]));
      const { data: comps } = await db.from('series_components').select('anilist_id, episode_end, season_order').eq('series_id', sid).order('season_order');
      const { data: srow } = await db.from('series').select('manga_anilist_id').eq('id', sid).maybeSingle();
      const { data: bounds } = srow?.manga_anilist_id
        ? await db.from('volume_boundaries').select('volume, chapter_start, chapter_end').eq('manga_anilist_id', srow.manga_anilist_id).order('volume')
        : { data: [] as { volume: number; chapter_start: number; chapter_end: number | null }[] };
      const volOf = (ch: number): number | null => {
        const b = (bounds ?? []).find((x) => ch >= x.chapter_start && (x.chapter_end == null || ch <= x.chapter_end));
        return b ? b.volume : null;
      };
      const { data: annRows } = await db.from('episode_annotations').select('episode, kind').eq('series_id', sid);
      const ruledEps = new Set<number>((annRows ?? []).filter((a) => a.kind === 'rearranged' || a.kind === 'graft').map((a) => a.episode));
      for (const g of v.annotations ?? []) if (g.kind === 'rearranged' || g.kind === 'graft') for (const ep of g.episodes ?? []) ruledEps.add(Number(ep));
      const lines: string[] = [`== ${sid}: ${v.anchors?.length ?? 0} anchors, ${v.continue_points?.length ?? 0} continue, ${v.annotations?.length ?? 0} annotation groups, ${v.type_corrections?.length ?? 0} type corrections`];
      if (v.summary) lines.push(`   ${v.summary.slice(0, 400)}`);

      // ---- anchors
      const seenEp = new Set<number>();
      for (const a of v.anchors ?? []) {
        const ep = Number(a.episode);
        let end = Number(a.end_chapter);
        let start = a.start_chapter == null ? null : Number(a.start_chapter);
        // SLIVER RULE (Sean 2026-08-23 s2, MHA ep 170): the episode's START is
        // the first chapter animated — a leading PARTIAL chapter counts unless
        // it is scraps that contribute basically nothing (≤ 5 pages, or the
        // record calls it a sliver/teaser/cold-open fragment). Agents applied a
        // stricter "first FULL chapter unless the tail is the bulk" reading;
        // normalize here so every record obeys one rule.
        {
          const lead = String(a.chapters_adapted ?? '').split(/,(?![^()]*\))/)[0]?.trim() ?? '';
          const leadNum = Number((lead.match(/^(\d+)(?!\.)/) ?? [])[1]);
          // only a leading partial of the IMMEDIATELY preceding chapter is a
          // tail continuation; a far-earlier chapter opening the episode is a
          // relocated graft/flashback and never the position (AoT ep 87 ruling)
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
        // running-order END convention (Dagashi S1's scrambled sampler: "58,
        // 32, 15" reported end 15): our END is the POSITION instrument — the
        // furthest mainline chapter the episode touches — so lift it to the
        // highest chapter in the adapted list when the agent's end sits below
        // the start; the full list keeps the real order
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

      // ---- cross-checks (review aid; the rearranged-zone rule still anchors
      // exact values): order against neighbors, and volume vs boundaries
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

      // ---- annotations
      let annotated = false;
      for (const g of v.annotations ?? []) {
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

      // ---- order-only records WITH spans (full-record rule); position =
      // the `after` component's end + .1/.2… (Ippo precedent: 76.3/76.6).
      // Entries already recorded (wiki fractionals, earlier batches) are
      // matched by title tokens and left alone — never duplicated.
      const { data: fracs } = await db.from('ingest_fractionals').select('position, title').eq('series_id', sid);
      const tok = (x: string) => new Set(x.toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter((w) => w.length > 2 && !['the', 'and', 'ova', 'hajime', 'ippo', 'movie', 'film', 'part'].includes(w)));
      const recorded = (title: string) => (fracs ?? []).find((f) => { const a = tok(String(f.title ?? '')); const b = tok(title); let n = 0; for (const w of b) if (a.has(w)) n++; return n >= Math.min(2, b.size); });
      let slot = 0;
      for (const o of v.structure?.order_only ?? []) {
        if (!o.title) continue;
        const have = recorded(o.title);
        if (have) { lines.push(`   order-only '${o.title}' already recorded @${have.position} ('${have.title}') — kept`); continue; }
        const after = (comps ?? []).find((c) => c.anilist_id === o.after_anilist_id);
        const base = after?.episode_end ?? null;
        if (base == null) { lines.push(`   order-only '${o.title}' (AniList ${o.anilist_id ?? '?'}): no numbered component for after=${o.after_anilist_id} — recorded in report only: adapts ${o.adapts ?? '?'}`); continue; }
        slot += 1;
        const position = base + slot / 10;
        lines.push(`   order-only '${o.title}' @${position}: adapts ${o.adapts ?? '?'}${o.anilist_id ? ` (AniList ${o.anilist_id})` : ''}`);
        if (!DRY) {
          const { error } = await db.from('ingest_fractionals').upsert({
            series_id: sid, position, source: 'ruling', title: o.title, disposition: 'order_only',
            note: `${o.adapts ? `Adapts ${o.adapts}. ` : ''}${o.note ?? ''} (${B})`.slice(0, 600),
          });
          if (error) throw new Error(`order-only ${sid} ${o.title}: ${error.message}`);
        }
        totals.orderOnly++;
      }
      if (v.structure?.notes) lines.push(`   structure: ${v.structure.notes.slice(0, 300)}`);

      // ---- agent repairs list + flags for Sean: ONE review bookmark per
      // series carrying every note (the full text lives in the verdict JSON)
      for (const r of v.repairs ?? []) lines.push(`   agent-reported repair ep${r.episode}: ${JSON.stringify(r).slice(0, 200)}`);
      const notes = (v.flags_for_sean ?? []).filter((f) => f && f.trim());
      for (const f of notes) lines.push(`   FLAG: ${f.slice(0, 220)}`);
      if (notes.length) {
        if (!DRY) {
          await fileFlagOnce(runId, sid, 'research', 'count_mismatch', {
            kind_of_note: 'sean_review_bookmark',
            note: `batch 14 research notes (${notes.length}; full text: scripts/ingest/research/batch14/out/${sid}.json): ${notes.map((f, i) => `(${i + 1}) ${f}`).join(' ')}`.slice(0, 1800),
          });
        }
        totals.bookmarks++;
      }
      report.push(...lines);
    }

    // ---- session repairs (ledger)
    for (const r of SESSION_REPAIRS) {
      if (ONLY.length && !ONLY.includes(r.sid)) continue;
      if (!DRY) {
        const { data: cur } = await db.from('chapter_anchors').select('note').eq('series_id', r.sid).eq('episode', r.episode).maybeSingle();
        const note = String(cur?.note ?? '');
        const patch = note.includes('REPAIR 2026-08-23') ? r.patch : { ...r.patch, note: `${note} | REPAIR 2026-08-23 (${B}): ${r.why}`.slice(0, 1200) };
        const { error } = await db.from('chapter_anchors').update(patch).eq('series_id', r.sid).eq('episode', r.episode);
        if (error) throw new Error(`session repair ${r.sid} ep${r.episode}: ${error.message}`);
      }
      report.push(`== session REPAIR ${r.sid} ep${r.episode}: ${JSON.stringify(r.patch)} — ${r.why.slice(0, 160)}`);
    }

    console.log(report.join('\n'));
    console.log(`\n[batch-14] anchors ${totals.anchors} (repairs ${totals.repairs}), continue ${totals.continues}, annotations ${totals.annotations}, retyped ${totals.retyped}, order-only ${totals.orderOnly}, bookmarks ${totals.bookmarks}, skipped ${totals.skipped}${DRY ? ' — nothing written' : ''}`);
    if (!DRY) await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: totals.anchors, flagged: totals.bookmarks }, `research batch 14: ${verdicts.length} series, ${totals.anchors} anchors, ${totals.repairs} repairs`);
  } catch (e) {
    if (!DRY) await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200));
    throw e;
  }
}
main().then(() => process.exit(0));
