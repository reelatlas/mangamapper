// Batch 20 wave 5 — the curated apply for dragon-ball-super under I40 / T30 /
// A46 (P10: the map decides). Sean ruled 2026-08-28: the parallel model (the
// timelines A/B/C canon, D filler, E mixed under T28); wave 5c (90 / 91 / 78 →
// canon; 1 / 2 / 89 mixed stand); wave 5d-5f = the series-wide re-pass (every
// row judged under T30, none projected). Types are a T6 MAP edit asserted by
// assert-overrides (the lifted rows MUST be pinned canon: AFL's 'anime canon'
// re-derives to filler on a manga-kind series, T27); the ep-78 rearranged{28}
// is an A45 retirement (the healer removes it). This script carries what the
// maps cannot: the row-level annotations (re-noted, added) and the
// episode_correspondence rows from the four verdicts (origin 'research').
// NO anchors, NO continues, NO blanket arc annotations (A46). Idempotent;
// --dry-run prints every change.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave5.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { upsertCorrespondence, type Alignment, type CorrespondenceRow } from '../lib/rulings/correspondence';
import { isParallelSeries } from '../lib/rulings/source-relations';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const SID = 'dragon-ball-super';
const FILES = ['dragon-ball-super-w5c.json', 'dragon-ball-super-w5d.json', 'dragon-ball-super-w5e.json', 'dragon-ball-super-w5f.json'];
const B = 'batch 20 wave 5 (2026-08-28; the parallel re-pass under T30, Sean ruled)';

// Row annotations lifted from the wave-5a verdict (the only 5a/5b row facts
// the re-pass keeps: the blanket arc stamps are the arc's note, A46)
const EXTRA_ANNOTATIONS: { episode: number; kind: AnnotationKind; chapters?: string | null; note: string }[] = [
  { episode: 6, kind: 'side_source', note: "Battle of Gods (the 2013 film 『ドラゴンボールZ 神と神』): the birthday-party sequence is the film's, not the manga's — the manga's four-chapter digest has nothing here (ch 3's episode index omits ep 6 and its summary carries none of it). The batch-19 film precedent (Resurrection 'F' rows 18-27). " + B },
];
// text fixes at curation (the verifier's / Sean's wording)
const ANNOTATION_OVERRIDE: Record<string, { chapters?: string | null; note?: string }> = {};
const ANNOTATION_DROP = new Set<string>([]);

const parseChapters = (s: string | null | undefined): [number, number][] => {
  if (s == null || String(s).trim() === '') return [];
  return String(s).split(',').map((p) => p.trim()).filter(Boolean).map((p) => {
    const m = /^(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)$/.exec(p) ?? /^(\d+(?:\.\d+)?)$/.exec(p);
    if (!m) throw new Error(`unparseable chapters '${s}'`);
    return [Number(m[1]), Number(m[2] ?? m[1])];
  });
};

async function main() {
  if (!isParallelSeries(SID)) throw new Error(`${SID} is not ruled parallel (I40) — this apply is for the correspondence instrument`);
  const runId = DRY ? 0 : await startRun('resolve');
  let annos = 0, rows = 0;
  const seen = new Set<string>();
  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    if (v.series_id !== SID) throw new Error(`${f}: series ${v.series_id}`);
    if ((v.anchors ?? []).length) throw new Error(`${f}: anchors on a parallel series (A46)`);
    for (const a of v.annotations ?? []) {
      for (const ep of a.episodes as number[]) {
        const key = `${ep}#${a.kind}`;
        if (ANNOTATION_DROP.has(key)) { console.log(`  drop annotation ${key} (curated)`); continue; }
        const o = ANNOTATION_OVERRIDE[key] ?? {};
        const rec = { series_id: SID, episode: ep, kind: a.kind as AnnotationKind, chapters: o.chapters !== undefined ? o.chapters : a.chapters ?? null, note: (o.note ?? `${a.note} [${B}]`).slice(0, 1200), origin: 'research' as const };
        console.log(`  annotation ${f} ep ${ep} ${a.kind}${rec.chapters ? `{${rec.chapters}}` : ''}`);
        if (!DRY) await upsertAnnotation(rec);
        annos++;
      }
    }
    for (const c of v.correspondence ?? []) {
      const ep = c.episode == null ? null : Number(c.episode);
      const ranges = parseChapters(c.chapters);
      const alignment = c.alignment as Alignment;
      const note = `${c.note ?? ''} [${f}; ${B}]`.slice(0, 1200);
      const items: CorrespondenceRow[] = ranges.length ? ranges.map(([s, e]) => ({ episode: ep, chStart: s, chEnd: e, alignment, note })) : [{ episode: ep, alignment, note }];
      for (const r of items) {
        const key = `${r.episode ?? '-'}:${r.chStart ?? '-'}-${r.chEnd ?? '-'}:${r.alignment}`;
        if (seen.has(key)) { console.log(`  correspondence ${key}: duplicate across verdicts — first wins`); continue; }
        seen.add(key);
        console.log(`  correspondence ${f} ep ${r.episode ?? '—'} ${r.alignment}${r.chStart != null ? ` ch ${r.chStart}${r.chEnd !== r.chStart ? `-${r.chEnd}` : ''}` : ''}`);
        if (!DRY) await upsertCorrespondence(SID, r, 'research');
        rows++;
      }
    }
  }
  for (const a of EXTRA_ANNOTATIONS) {
    console.log(`  annotation (curated) ep ${a.episode} ${a.kind}`);
    if (!DRY) await upsertAnnotation({ series_id: SID, episode: a.episode, kind: a.kind, chapters: a.chapters ?? null, note: a.note, origin: 'research' });
    annos++;
  }
  console.log(`[apply-wave5] ${annos} annotations, ${rows} correspondence rows${DRY ? ' — DRY RUN' : ''}. Types (T6) + the A45 retirement are MAP edits: run assert-overrides, then heal + census.`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: FILES.length, unchanged: 0, changed: annos + rows, flagged: 0 }, `apply-wave5: ${annos} annotations, ${rows} correspondence rows`);
}
main().then(() => process.exit(0));
