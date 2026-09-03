// Deep consolidate after T28's sliver clause (2026-09-04): annotations that
// DESCRIBE a recap but were filed under another kind (abridged / partial /
// divergence) are re-kinded to `recap` — a vocabulary fix on facts the
// batch-8…17 verdicts already established (their notes are the evidence);
// no type moves here (the recap clause was applied to types when those rows
// were ruled — every pure-recap row below is already filler). Curated list,
// one entry per row with the reason; idempotent; --dry-run prints all.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/rekind-recaps.ts [--dry-run]
import { db, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';

const DRY = process.argv.includes('--dry-run');
const B = 'deep consolidate 2026-09-04 (T28 recap kind)';
type Move = { sid: string; episode: number; from: AnnotationKind; chapters: string | null; keepFrom?: boolean; why: string };
const MOVES: Move[] = [
  { sid: 'bleach', episode: 266, from: 'partial', chapters: 'the arc so far (a recap bridge; new canon footage begins ep 267)', why: 'batch 8: "recap bridge" filed as an empty partial' },
  { sid: 'my-hero-academia', episode: 64, from: 'divergence', chapters: 'the series so far (an anime-original recap framed as a news feature)', why: 'batch 10: "anime-original recap" filed as an empty divergence' },
  { sid: 'my-hero-academia', episode: 39, from: 'partial', chapters: 'the series so far', keepFrom: true, why: 'batch 12: "recap ep with an anime-original pool scene + ch 49.5 partial" — the partial{49.5} stays, the recap becomes its own kind' },
  { sid: 'my-hero-academia', episode: 160, from: 'abridged', chapters: '396-398', keepFrom: true, why: 'batch 14: "396-398 (recap) + 399-400" — the recap half becomes `recap`{396-398}; the abridged note stays for 399-400 (condensed adaptation)' },
  { sid: 'reborn', episode: 119, from: 'abridged', chapters: null, why: 'batch 14: a blanket "recap-heavy episodes" note copied onto 119 / 154 / 177 / 189 — 119 is recap-heavy (mixed, anchor 197 stands); the retold chapters were not itemized' },
  { sid: 'reborn', episode: 154, from: 'abridged', chapters: null, why: 'batch 14: the same blanket note — 154 is a recap (filler); the retold chapters were not itemized' },
  ...[78, 79, 80, 81, 82].map((episode) => ({ sid: 'fist-of-the-north-star', episode, from: 'divergence' as AnnotationKind, chapters: 'the run so far (a five-episode retrospective block between ch 109 and ch 110)', why: 'batch 17: "five-episode retrospective block" filed as divergence{none} — a retrospective is a recap' })),
  { sid: 'mashle-magic-and-muscles', episode: 7, from: 'abridged', chapters: '1-16', why: 'batch 17: "recap special: Regro and Brad read ch 1-16" — a recap, not a condensed adaptation; the canon 17-20 anchor stands' },
  { sid: 'project-arms', episode: 27, from: 'partial', chapters: 'the series so far (the first half is an anime-original clip show)', keepFrom: true, why: 'batch 17: mixed — a clip-show half (recap) + a canon half (partial{78} stays)' },
];

async function main() {
  const runId = DRY ? 0 : await startRun('resolve');
  let n = 0;
  for (const m of MOVES) {
    const { data: cur } = await db.from('episode_annotations').select('kind, chapters, note').eq('series_id', m.sid).eq('episode', m.episode).eq('kind', m.from).maybeSingle();
    const { data: has } = await db.from('episode_annotations').select('kind').eq('series_id', m.sid).eq('episode', m.episode).eq('kind', 'recap').maybeSingle();
    if (has) { console.log(`  ${m.sid} ep ${m.episode}: recap already present — skip`); continue; }
    console.log(`  ${m.sid} ep ${m.episode}: ${m.from}{${String(cur?.chapters ?? '').slice(0, 25)}} → recap{${String(m.chapters ?? '').slice(0, 40)}}${m.keepFrom ? ` (+ keep the ${m.from})` : ' (the old row deleted)'} — ${m.why.slice(0, 80)}`);
    if (!DRY) {
      await upsertAnnotation({ series_id: m.sid, episode: m.episode, kind: 'recap', chapters: m.chapters, note: `${m.why}. THE RECAP CLAUSE (T28): weightless in the standing; the remainder decides the type. Original note: ${String(cur?.note ?? '').slice(0, 500)} [${B}]`.slice(0, 1200), origin: 'research' });
      if (!m.keepFrom && cur) { const { error } = await db.from('episode_annotations').delete().eq('series_id', m.sid).eq('episode', m.episode).eq('kind', m.from); if (error) throw new Error(error.message); }
    }
    n++;
  }
  console.log(`[rekind-recaps] ${n} row(s)${DRY ? ' — DRY RUN' : ''}`);
  if (!DRY) await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: n, flagged: 0 }, `rekind-recaps: ${n}`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
