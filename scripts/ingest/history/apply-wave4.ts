// Batch 20 wave 4 — the curated apply (P10: the map decides). Sean ruled
// 2026-08-28 (WAVE4-RECOVERY §THE DECISIONS; Cursor's one START call): TMM 38
// → 20 [20] (A10: ch 19's three counterpart pages are a leading fragment, the
// hxh-80 shape — 19 stays in chapters_adapted and the rearranged tie); shugo
// 91 filler + graft {34}, 92 loose_parallel, the twelve retypes, ZONE_ACKS
// 93 → 91, the optional continue 80 → 32; TBATE 13-22 as delivered + row 12 →
// 58 parity with 57 named never-adapted; FotNS 53/60/126 (G53), ep 29 stays.
// Types (T6), dates + titles (G53), the four A45 retirements and the A7 re-key
// are MAP edits asserted by the healers; this script carries the anchors, the
// curated continues (C7), the annotations (with the verifier's text fixes) and
// the file-driven records. Idempotent; --dry-run prints every change.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave4.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const VER = 'scripts/ingest/research/batch20/verify';
const B = 'research-tier batch 20 wave 4 (2026-08-28, the standing lies; verified R24, Sean ruled)';
const FILES: [string, string, string][] = [
  ['the-beginning-after-the-end-w4.json', 'the-beginning-after-the-end', 'the-beginning-after-the-end-w4.md'],
  ['tokyo-mew-mew-w4.json', 'tokyo-mew-mew', 'tokyo-mew-mew-w4.md'],
  ['shugo-chara.json', 'shugo-chara', 'shugo-chara-w4.md'],
];
const ANCHOR_OVERRIDE: Record<string, { start?: number; adapted?: string; confidence?: string; why?: string }> = {
  'tokyo-mew-mew#38': { start: 20, adapted: "19 (closing beats, pp 102-107: Kish carried off, 'He saw all of it', Masaya's 'I knew you were a Mew Mew'), 20 (pp 108-121: the title page, 'I'd play along' / 'I LOVE YOU' pp 118-119, 'our little secret' pp 120-121)", confidence: 'high', why: "REPAIR 19 → 20 [20] v5 (Sean 2026-08-28): ep 38's payload straddles the chapter boundary — ch 19 pp 102-107 + ch 20 pp 108-121 on the TokyoPop vol-5 scan read on the leaves (folios 77/109/112/125 + the TOC fix the page formula; the verifier re-checked every quoted line) and TV Aichi's archived synopsis + en-WP's ep-38 summary ('He pretended not to know' = ch 20 p 118 only). Ch 20's pages are FIRST-TIME here (ep 36 carries the chapter's tail, pp ~135-147; ep 37 nothing) → the anchor + rearranged {19-20} under 'pages, not numbers'. START 20 under A10: ch 19's counterpart pages are three (103, 106-107), a leading fragment — the hxh-80 shape; 19 stays in chapters_adapted and the tie. [high]" },
};
const CONTINUE_ADD: { sid: string; episode: number; chapter: number; kind: 'parity' | 'post_series'; note: string }[] = [
  { sid: 'shugo-chara', episode: 80, chapter: 32, kind: 'parity', note: "C1 (Sean 2026-08-28): ep 80 ends inside ch 32 (its first part; the anime-original Lulu ?-egg arc — rows 82-96, filler — sits inside the split) and ep 97 carries ch 32's remainder + ch 33; resume IN 32. Sixteen rows would otherwise carry no reader instruction." },
  { sid: 'the-beginning-after-the-end', episode: 12, chapter: 58, kind: 'parity', note: "C2 parity (Sean 2026-08-28): ep 12 ends at ch 56; ch 57 (the Dragonspine Inn / Turman scene) is animated NOWHERE — rows 13-16 are anime-original (filler) — and ep 17 restarts at ch 58. Resume at 58; read 57 yourself if you want the inn scene." },
];
const ANNOTATION_OVERRIDE: Record<string, { chapters?: string | null; note?: string }> = {
  'tokyo-mew-mew#38#rearranged': { note: "REPLACES the stored rearranged {19} (batch 19). A41 settled reorder, 'pages, not numbers': ch 20 is split across two episodes in REVERSE order — ep 36 carries its TAIL (pp ~135-147: cat-Ichigo, Tart, Alto, 'Ryou?!'; pp 128-133, the parents' date, are in no episode) and ep 38 its opening (pp 108-121), first-time; ep 38 also closes ch 19 (pp 102-107). The anchor is 20 [20]." },
  'tokyo-mew-mew#38#divergence': { note: "The reveal is relocated wholesale: in ch 19 Masaya learns the truth because Kish attacks their lunch date and Ichigo is forced to transform in front of him; the anime moves the confession to a hospital bedside (TV Aichi's synopsis: 'Kish's attack … Ichigo hospitalised … Masaya's confession … the two promise to keep it their secret') — the beats are ch 19's and ch 20's, the staging is the anime's." },
};
const ANNOTATION_DROP = new Set<string>([]);

async function main() {
  const runId = await startRun('resolve');
  const L: string[] = [];
  try {
    for (const [file, sid, report] of FILES) {
      const v = JSON.parse(readFileSync(`${OUT}/${file}`, 'utf8'));
      for (const a of v.anchors ?? []) {
        const key = `${sid}#${a.episode}`;
        const o = ANCHOR_OVERRIDE[key] ?? {};
        const end = Number(a.end_chapter), start = o.start ?? (a.start_chapter != null ? Number(a.start_chapter) : null);
        const why = o.why ?? `${a.note} [${a.confidence}]`;
        const cur = (await selectAll<any>('chapter_anchors', 'chapter, start_chapter, source', (q) => q.eq('series_id', sid).eq('episode', a.episode)))[0];
        L.push(`  ANCHOR ${key}: ${cur ? `${cur.chapter} [${cur.start_chapter}] (${cur.source})` : 'NEW'} → ${end} [${start}] v${a.volume ?? '-'}${o.start || o.adapted ? ' (overlay)' : ''}`);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').upsert({ series_id: sid, episode: a.episode, chapter: end, start_chapter: start, chapters_adapted: o.adapted ?? a.chapters_adapted ?? null, volume: a.volume ?? null, source: 'manual', note: `${B}: ${why} <${OUT}/${file} ; ${VER}/${report}>`.slice(0, 1200) }, { onConflict: 'series_id,episode' });
          if (error) throw new Error(`anchor ${key}: ${error.message}`);
        }
      }
      for (const r of v.repairs ?? []) {
        if (['air_date', 'title'].includes(r.field)) { L.push(`  MAP repair ${sid}#${r.episode} ${r.field} (G53)`); continue; }
        if (['end_chapter', 'chapters_adapted'].includes(r.field) && sid === 'tokyo-mew-mew') { L.push(`  (repair ${sid}#${r.episode} ${r.field} carried by the anchor upsert)`); continue; }
        L.push(`  MAP repair ${sid}#${r.episode} ${r.field} (A45 / the annotation upserts)`);
      }
      for (const c of v.continue_points ?? []) {
        L.push(`  CONTINUE ${sid}#${c.episode} → ${c.continue_chapter}/${c.kind} (curated, C7)`);
        if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: Number(c.continue_chapter), kind: c.kind, note: `${B}: ${c.note}` });
      }
      for (const an of v.annotations ?? []) {
        for (const ep of an.episodes as number[]) {
          const key = `${sid}#${ep}#${an.kind}`;
          if (ANNOTATION_DROP.has(key)) { L.push(`  DROP ann ${key}`); continue; }
          const o = ANNOTATION_OVERRIDE[key] ?? {};
          const chapters = o.chapters !== undefined ? o.chapters : (an.chapters && !/^(none|n\/a)$/i.test(String(an.chapters)) ? String(an.chapters) : null);
          L.push(`  ANN ${key} {${chapters ?? ''}}${o.note ? ' (overlay)' : ''}`);
          if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: an.kind as AnnotationKind, chapters, basis: an.basis ?? null, note: `${B}: ${o.note ?? an.note}`.slice(0, 900), origin: 'research' });
        }
      }
      for (const tc of v.type_corrections ?? []) L.push(`  MAP type ${sid} eps ${tc.episodes} → ${tc.type} (T6)`);
      for (const h of v.anchor_hostile ?? []) L.push(`  HOSTILE ${sid}#${h.episode} (filler by T6 — no anchor)`);
    }
    for (const c of CONTINUE_ADD) {
      const cur = (await selectAll<any>('chapter_anchors', 'chapter, continue_chapter', (q) => q.eq('series_id', c.sid).eq('episode', c.episode)))[0];
      if (!cur) { L.push(`  CONTINUE ${c.sid}#${c.episode}: NO ANCHOR ROW — skipped`); continue; }
      L.push(`  CONTINUE ${c.sid}#${c.episode} (→ ${cur.chapter}) ${cur.continue_chapter ?? 'null'} → ${c.chapter}/${c.kind} (curated, added, C7)`);
      if (!DRY) await writeCuratedContinue(c.sid, c.episode, { chapter: c.chapter, kind: c.kind, note: `${B}: ${c.note}` });
    }
    L.push('  MAP FotNS dates 53 / 60 / 126 (G53, extended entry); ep 29 stays 05-16 (the lineage in the reason)');
    L.push('  MAP ZONE_ACKS shugo-chara A7 93 → 91 (batch-17.ts); A45 ×4 (TMM 38 partial + rearranged; shugo 91/92 divergence; shugo 92 graft)');
    console.log(L.join('\n'));
    console.log(`[apply-wave4] ${L.length} decisions${DRY ? ' (dry run)' : ' applied'}`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DRY ? 0 : L.length, flagged: 0 }, `batch 20 wave 4 apply${DRY ? ' dry' : ''}`);
  } catch (e) { await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200)); throw e; }
}
main().then(() => process.exit(0));
