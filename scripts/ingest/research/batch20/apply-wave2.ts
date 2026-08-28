// Batch 20 wave 2 — the curated apply (P10: the map decides). Sean ruled
// 2026-08-27 (WAVE2-RECOVERY §THE DECISIONS + his three fork closures, Cursor
// concurring): STEP 0 = the saint-seiya N22 re-migration, MARKER-KEYED — every
// saint-seiya anchor row that lacks the "space migration −1" marker shifts its
// chapter / start / continue values ≥ 30 by −1 (the batch-17 rows 43-72 were
// applied in Wikipedia's phantom +1 space and the one-shot migration, guarded
// on v8's end, never saw them) and is stamped; the three batch-17 annotations
// in the +1 space (43 abridged {30}, 47 divergence {32}, 64 partial {39}) shift
// too; the wave-2 rows 100-113 are delivered in OUR space and are stamped, not
// shifted. The `anchor_volume_mismatch` census class (P5) is the outcome proof:
// seiya 7 → 0. THEN the eight verdicts, FILE-DRIVEN with the curated overlay:
// the verifiers' corrections (hxh 80 START 143; bleach 153 END 263; d-gray-man
// continues 5/6/24 → 2/3/29 — C2 is the NEXT canon row's START, the bobobo
// precedent; kingdom's two false pcafe citation strings and the ep-78 cold-open
// wording; d-gray-man 40's loose_parallel {30, 44}; eyeshield's ep-21 note
// without "49-52"), the REJECTED eyeshield fence repairs (21 → 48: ch 49 pp 1-12
// ARE the Taiyo draw — AFG's 47-49 stands), the eyeshield ep-15 afg anchor
// DELETED (A1 — 15/16 filler by T6), the shippuden 478/479 note repairs, and
// the boundary rows the wave found missing (yyh v6-v9, bleach v28-32). Types
// (T6), the hxh dates (G53) and the yyh title are MAP edits asserted by the
// healers. Continues go through lib/continues.ts#writeCuratedContinue (C7).
// The shippuden display question is a UI-pass note, NOT a map (Sean: novel
// rows stay a dash, T26/P6). Idempotent; --dry-run prints every change.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave2.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../../lib/annotations';
import { writeCuratedContinue } from '../../lib/continues';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const VER = 'scripts/ingest/research/batch20/verify';
const B = 'research-tier batch 20 wave 2 (2026-08-27, the gap blocks; verified R24, Sean ruled)';
const SS = 'saint-seiya-knights-of-the-zodiac';
const MARKER = 'space migration −1 (phantom ch 30 removed, Sean 2026-08-25)';
const SERIES = ['hunter-x-hunter', SS, 'yu-yu-hakusho-ghostfiles', 'bleach', 'eyeshield-21', 'kingdom', 'd-gray-man', 'naruto-shippuden'];

// ---- the curated overlay (P10). Keyed `${sid}#${episode}`.
const ANCHOR_OVERRIDE: Record<string, { start?: number; end?: number; adapted?: string; why?: string }> = {
  'hunter-x-hunter#80': { start: 143, why: "START 143 (the verifier, A10): ep 80 opens on ch 142's closing pages (Jispa / Little Flower / the explosion) — by the verdict's own estimate ≤ 5 pages of a 15-page chapter whose Bomber reveal ep 79 already carried, so the remnant is a sliver and START is the first full chapter, 143. END 148 on hunterpedia's forward `Adapted` field + the chapter pages' reverse `Anime` field + en-WP's OVA synopsis. [high]" },
  'bleach#153': { end: 263, why: "END 263 (the verifier): ch 263 pp. 1-2 — the Kaien unmasking, the episode's closing scene — are contiguous FIRST-TIME mainline pages, not the ep-124 flash-forward shape; bleach's own stored line moves END on a trailing partial (ep 112 → 190). bleach.fandom's page-level field '254 (p.10-19), 255, 256 (p.1-4), 262 (p.15-19), 263 (p.1-2)' + AFG's chapter set; the 256 p.5 → 262 p.15 jump is the un-cross-cut (rearranged). Medium: the two-page share. [medium]" },
  'kingdom#78': { why: "ep 78 = ch 261 (p.15-17), 262-264: Duke Hyou's charge opens the Coalition arc (kingdom.fandom Episode 78 — its 'adapted from' field carries Episode 129's line verbatim, a copy-paste defect; the broadcast record shows the charge); pcafe's chapter→episode index; the licensor synopsis. The cold open is a flash-forward to the Kankoku Pass charge (ch 271-272), not a position. [high]" },
  'kingdom#81': { why: "ep 81 = ch 272 (p.16-18), 273-275, 276 (to the tower reaching the wall): kingdom.fandom's field DROPS ch 274 — restored on pcafe (274 → S3 ep 4) + the kingdom-anime.com synopsis (Kei Sha's trap) + a timestamped broadcast-reaction archive that ends the episode inside ch 276, not 275. [high]" },
  'kingdom#82': { why: "ep 82 = ch 276 (tail, re-entered after the 13-month COVID hiatus), 277-280: pcafe (280 → S3 ep 5) + the licensor synopsis + ja-WP's 第3シリーズ table (the 2020 → 2021 date jump at this row is the real hiatus). Medium: the 276 re-entry split. [medium]" },
};
const ANCHOR_REJECT = new Set<string>([]); // no delivered anchor rejected this wave
const REPAIR_REJECT = new Set<string>(['eyeshield-21#21']); // the fence repair 21 → 48 (both fields): REFUTED on the pages — ch 49 pp 1-12 are the Taiyo draw; AFG's 47-49 stands
const CONTINUE_OVERRIDE: Record<string, { chapter: number; note: string }> = {
  'd-gray-man#5': { chapter: 2, note: "C2 parity (the verifier's correction; the bobobo 3 → 3 [2] precedent): the anime plays chs 2-4 NEXT, in eps 6-7 (the Introduction arc's second half moved behind the Mater arc), so the reader resumes at ch 2 — not at 17. Chs 5-16 are already read; ep 8 restarts at 17 (C3: skip 5-16 on arrival)." },
  'd-gray-man#6': { chapter: 3, note: "C2 parity (the verifier's correction): ep 6 ends inside ch 3 (p. 14) and ep 7 carries the rest of 3 and ch 4 — resume in ch 3. Chs 5-16 are already read; ep 8 restarts at 17 (C3)." },
  'd-gray-man#24': { chapter: 29, note: "C2 parity (the verifier's correction): ep 25 is filler and ep 26 adapts ch 29 (the General Yeegar arc, moved behind the Krory arc) — resume at ch 29 (its pp 12-13 are what ep 26 pins; ch 30 'Missing in Action' is never adapted straight by either series). Chs 31-42 are already read; ep 38 restarts at 43 (C3)." },
  'eyeshield-21#21': { chapter: 53, note: "C2 parity (the verifier's reading of the pages): ep 21 carries ch 49 to the Taiyo draw (pp 1-12); ch 49's tail (pp 13-20, Ojo vs Shinryuji) and chs 50-52 are never adapted in running order (the result is reported at ep 37; 50-51 surface only as ep 106's flashback); ep 22 is anime-original and ep 23 restarts at ch 53." },
};
const ANNOTATION_OVERRIDE: Record<string, { chapters?: string | null; note?: string }> = {
  'd-gray-man#40#loose_parallel': { chapters: '30, 44', note: "T28 tie on a filler row (T6 2026-08-27): 'Requiem Rose' opens the anime-original Lulu Bell arc; its manga content is a spoken recap of ch 44 already animated in ep 39 and — the verifier — a balcony flashback that may be ch 30's Lenalee exchange (not found animated elsewhere). Position-less (A1/A44)." },
  'bleach#164#side_story': { chapters: '(Colorful Bleach omake Part 21)', note: "Ep 164 also animates 'Tedious Everyday Tales Colorful Bleach' Part 21 — Kubo's V Jump side series (KaraBuri+), not a mainline chapter: labelled, never converted to a mainline number; END stays 277. Parenthesised so no parser reads its '21' as a chapter." },
};
const ANNOTATION_DROP = new Set<string>(['hunter-x-hunter#80#abridged']); // single-source colour (hunterpedia's synopsis alone) — the verifier: droppable; dropped (R3)
const SEIYA_ANN_SHIFT: [number, string, string, string][] = [[43, 'abridged', '30', '29'], [47, 'divergence', '32', '31'], [64, 'partial', '39', '38']];
const BOUNDARY_SEEDS: { mangaId: number; sid: string; cite: string; vols: [number, number, number][] }[] = [
  { mangaId: 30053, sid: 'yu-yu-hakusho-ghostfiles', cite: 'batch20 wave 2 (verified): yuyuhakusho.fandom chapter pages Chapter_46…Chapter_82 volume field + en-WP chapter list (shifted +1 from vol 8 = Viz numbering)', vols: [[6, 46, 55], [7, 56, 63], [8, 64, 72], [9, 73, 81]] },
  { mangaId: 30012, sid: 'bleach', cite: 'batch20 wave 2 (verified): bleach.fandom volume pages 28-32 (reverse episodes fields) + en-WP Bleach season 8 (252-286 = vols 29-32)', vols: [[28, 243, 251], [29, 252, 260], [30, 261, 269], [31, 270, 278], [32, 279, 286]] },
];

const shift = (v: number | null | undefined) => (v != null && v >= 30 ? v - 1 : v ?? null);

async function main() {
  const runId = await startRun('resolve');
  const L: string[] = [];
  try {
    // ---- STEP 0: the saint-seiya marker-keyed re-migration (N22, Sean 2026-08-27)
    const ssAnchors = await selectAll<any>('chapter_anchors', 'episode, chapter, start_chapter, continue_chapter, volume, note', (q) => q.eq('series_id', SS).order('episode'));
    for (const a of ssAnchors) {
      if (String(a.note ?? '').includes(MARKER)) continue;
      const nc = shift(a.chapter), ns = shift(a.start_chapter), ncc = shift(a.continue_chapter);
      const moved = nc !== a.chapter || ns !== a.start_chapter || ncc !== a.continue_chapter;
      L.push(`  MIGRATE ${SS} ep${a.episode}: ${a.chapter} [${a.start_chapter}] c${a.continue_chapter} → ${nc} [${ns}] c${ncc}${moved ? '' : ' (below 30: stamp only)'}`);
      if (!DRY) {
        const { error } = await db.from('chapter_anchors').update({ chapter: nc, start_chapter: ns, continue_chapter: ncc, note: `${String(a.note ?? '')} | ${MARKER}${moved ? ' (marker-keyed re-migration, batch 20 wave 2 — the batch-17 rows sat in the +1 space)' : ''}`.slice(0, 1200) }).eq('series_id', SS).eq('episode', a.episode);
        if (error) throw new Error(`migrate ep${a.episode}: ${error.message}`);
      }
    }
    for (const [ep, kind, from, to] of SEIYA_ANN_SHIFT) {
      const cur = (await selectAll<any>('episode_annotations', 'chapters, note', (q) => q.eq('series_id', SS).eq('episode', ep).eq('kind', kind)))[0];
      if (!cur || String(cur.chapters) !== from) { L.push(`  MIGRATE-ANN ${SS} ep${ep} ${kind}: ${cur ? `{${cur.chapters}} already migrated` : 'absent'}`); continue; }
      L.push(`  MIGRATE-ANN ${SS} ep${ep} ${kind}: {${from}} → {${to}}`);
      if (!DRY) { const { error } = await db.from('episode_annotations').update({ chapters: to, note: `${cur.note ?? ''} | ${MARKER}`.slice(0, 900) }).eq('series_id', SS).eq('episode', ep).eq('kind', kind); if (error) throw new Error(error.message); }
    }

    // ---- the eight verdicts, file-driven with the overlay
    for (const sid of SERIES) {
      const v = JSON.parse(readFileSync(`${OUT}/${sid}.json`, 'utf8'));
      for (const a of v.anchors ?? []) {
        const key = `${sid}#${a.episode}`;
        if (ANCHOR_REJECT.has(key)) { L.push(`  REJECT anchor ${key}`); continue; }
        const o = ANCHOR_OVERRIDE[key] ?? {};
        const end = o.end ?? Number(a.end_chapter), start = o.start ?? (a.start_chapter != null ? Number(a.start_chapter) : null);
        const why = `${o.why ?? `${a.note} [${a.confidence}]`}`;
        const cur = (await selectAll<any>('chapter_anchors', 'chapter, start_chapter, source', (q) => q.eq('series_id', sid).eq('episode', a.episode)))[0];
        L.push(`  ANCHOR ${key}: ${cur ? `${cur.chapter} [${cur.start_chapter}] (${cur.source})` : 'NEW'} → ${end} [${start}] v${a.volume ?? '-'}${o.end || o.start ? ' (overlay)' : ''}`);
        if (!DRY) {
          const note = `${B}: ${why} <${OUT}/${sid}.json ; ${VER}/${sid}.md>${sid === SS ? ` | ${MARKER}` : ''}`.slice(0, 1200);
          const { error } = await db.from('chapter_anchors').upsert({ series_id: sid, episode: a.episode, chapter: end, start_chapter: start, chapters_adapted: o.adapted ?? a.chapters_adapted ?? null, volume: a.volume ?? null, source: 'manual', note }, { onConflict: 'series_id,episode' });
          if (error) throw new Error(`anchor ${key}: ${error.message}`);
        }
      }
      // repairs: anchor-field repairs on stored rows (P8: the row flips to manual); note repairs; rejected ones reported
      for (const r of v.repairs ?? []) {
        const key = `${sid}#${r.episode}`;
        if (REPAIR_REJECT.has(key)) { L.push(`  REJECT repair ${key} ${r.field} ${r.old} → ${r.new} (refuted R24)`); continue; }
        if (['air_date', 'title'].includes(r.field)) { L.push(`  MAP repair ${key} ${r.field}: ${r.old} → ${r.new} (G53 map, asserted by the healer)`); continue; }
        const col: Record<string, string> = { end_chapter: 'chapter', chapter: 'chapter', start_chapter: 'start_chapter', chapters_adapted: 'chapters_adapted', volume: 'volume', note: 'note', continue_chapter: 'continue_chapter' };
        const c = col[r.field];
        if (!c) { L.push(`  SKIP repair ${key} ${r.field} (no column)`); continue; }
        const cur = (await selectAll<any>('chapter_anchors', 'chapter, start_chapter, chapters_adapted, volume, note, source', (q) => q.eq('series_id', sid).eq('episode', r.episode)))[0];
        if (!cur) { L.push(`  SKIP repair ${key} ${r.field}: no stored anchor`); continue; }
        const value = c === 'note' ? `${B}: ${r.new} <${OUT}/${sid}.json ; ${VER}/${sid}.md>`.slice(0, 1200) : r.new;
        L.push(`  REPAIR ${key} ${c}: ${c === 'note' ? String(cur.note ?? '').slice(0, 60) + '…' : cur[c]} → ${c === 'note' ? String(r.new).slice(0, 60) + '…' : r.new} (${cur.source} → manual)`);
        if (!DRY) { const { error } = await db.from('chapter_anchors').update({ [c]: value, source: 'manual' }).eq('series_id', sid).eq('episode', r.episode); if (error) throw new Error(`repair ${key}: ${error.message}`); }
      }
      for (const c of v.continue_points ?? []) {
        const key = `${sid}#${c.episode}`;
        const o = CONTINUE_OVERRIDE[key];
        L.push(`  CONTINUE ${key} → ${o?.chapter ?? c.continue_chapter}/${c.kind}${o ? ' (overlay)' : ''} (curated, C7)`);
        if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: o?.chapter ?? Number(c.continue_chapter), kind: c.kind, note: `${B}: ${o?.note ?? c.note}` });
      }
      for (const an of v.annotations ?? []) {
        for (const ep of an.episodes as number[]) {
          const key = `${sid}#${ep}#${an.kind}`;
          if (ANNOTATION_DROP.has(key)) { L.push(`  DROP ann ${key}`); continue; }
          const o = ANNOTATION_OVERRIDE[key] ?? {};
          const chapters = o.chapters !== undefined ? o.chapters : (an.chapters && !/^(none|n\/a)$/i.test(String(an.chapters)) ? String(an.chapters) : null);
          L.push(`  ANN ${key} {${chapters ?? ''}}${o.note || o.chapters !== undefined ? ' (overlay)' : ''}`);
          if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: an.kind as AnnotationKind, chapters, basis: an.basis ?? null, note: `${B}: ${o.note ?? an.note}${sid === SS ? ` | ${MARKER}` : ''}`.slice(0, 900), origin: 'research' });
        }
      }
      for (const tc of v.type_corrections ?? []) L.push(`  MAP type ${sid} eps ${tc.episodes} → ${tc.type} (T6 map, asserted by the healer; re-resolve the series)`);
    }
    // d-gray-man ep 51: the fence repair's page string travels with END 46 (the verdict's flag; the verifier: ch 44's share is its last page)
    {
      const cur = (await selectAll<any>('chapter_anchors', 'chapters_adapted', (q) => q.eq('series_id', 'd-gray-man').eq('episode', 51)))[0];
      const want = '44 (last page), 45 (p1-10), 46 (p2-10)';
      L.push(`  REPAIR d-gray-man#51 chapters_adapted: ${cur?.chapters_adapted ?? 'null'} → ${want}`);
      if (!DRY && cur && cur.chapters_adapted !== want) { const { error } = await db.from('chapter_anchors').update({ chapters_adapted: want, source: 'manual' }).eq('series_id', 'd-gray-man').eq('episode', 51); if (error) throw new Error(error.message); }
    }
    // shippuden ep 478: the same stale "479 re-covers → 700" pointer (the verifier)
    {
      const cur = (await selectAll<any>('chapter_anchors', 'note', (q) => q.eq('series_id', 'naruto-shippuden').eq('episode', 478)))[0];
      if (cur && /479 re-covers → 700/.test(String(cur.note))) {
        L.push('  REPAIR naruto-shippuden#478 note: "479 re-covers → 700" → "479 finishes 699; ch 700 is never adapted"');
        if (!DRY) { const { error } = await db.from('chapter_anchors').update({ note: String(cur.note).replace('479 re-covers → 700', '479 finishes ch 699 — ch 700 is never adapted by Shippuden (batch 20 wave 2, verified: Narutopedia + ja-WP 原作の第699話まで; Boruto ep 24 carries 700)') }).eq('series_id', 'naruto-shippuden').eq('episode', 478); if (error) throw new Error(error.message); }
      } else L.push(`  REPAIR naruto-shippuden#478 note: ${cur ? 'already clean' : 'no row'}`);
    }
    // eyeshield ep 15: the afg anchor 15 → 34 on a row now filler by T6 (A1) — ch 34 is ep 17's material (the verifier, page-checked)
    {
      const e15 = await selectAll<any>('chapter_anchors', 'chapter, source', (q) => q.eq('series_id', 'eyeshield-21').eq('episode', 15));
      L.push(`  DELETE eyeshield-21 ep15 anchor (A1, filler by T6): ${e15.length ? `${e15[0].chapter} (${e15[0].source}) → gone` : 'already absent'}`);
      if (!DRY && e15.length) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', 'eyeshield-21').eq('episode', 15); if (error) throw new Error(error.message); }
    }
    // boundary rows the wave found missing (insert where the volume is absent; never replace)
    for (const s of BOUNDARY_SEEDS) {
      const have = new Set((await selectAll<any>('volume_boundaries', 'volume', (q) => q.eq('manga_anilist_id', s.mangaId))).map((b) => b.volume));
      const rows = s.vols.filter(([v]) => !have.has(v)).map(([volume, chapter_start, chapter_end]) => ({ manga_anilist_id: s.mangaId, volume, chapter_start, chapter_end, source: 'research', source_page: s.cite.slice(0, 200) }));
      L.push(`  BOUNDARIES ${s.sid} (${s.mangaId}): +${rows.length} rows (${rows.map((r) => `v${r.volume}:${r.chapter_start}-${r.chapter_end}`).join(' ') || 'none missing'})`);
      if (!DRY && rows.length) { const { error } = await db.from('volume_boundaries').insert(rows); if (error) throw new Error(`boundaries ${s.sid}: ${error.message}`); }
    }
    // flag dispositions the verdicts settled
    const now = new Date().toISOString();
    for (const [id, why] of [
      [677, "RESOLVED (batch 20 wave 2, verified R24): not an edition divergence — MU's anime coverage for this work is the labelled segment 'Vol 54, Chap 479 (Bleach)' (= our scope and the ep-366 anchor); its latest_chapter 250 is the chapter of the latest-DATED release records (a weekly re-release run ending 2023-09-30); 'Vol 74, Chap 705 (TYBW P4)' belongs to the I20 split entry. NOTE for capture: pickEntrySegments picks 479 only because MU's ') /Vol' defeats the splitter — normalised, both labels are undecidable (the per-series MU segment rulings queue)."],
      [702, "RESOLVED (batch 20 wave 2, verified R24): AniList's 249 is the Weekly Shōnen Jump INSTALLMENT count (246 WSJ installments + the V Jump #247 + 2 specials; the Poseidon arc = #113-157), not a chapter count; MU's latest_chapter 33 is a release artefact; the reading edition is the 109-chapter tankōbon (V6/N22), and the batch-20 re-migration put every stored value in it."],
    ] as const) {
      const { data } = await db.from('ingest_flags').select('status, detail').eq('id', id).maybeSingle();
      L.push(`  FLAG #${id}: ${data?.status} → dismissed`);
      if (!DRY && data?.status === 'open') { const { error } = await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: now, detail: { ...(data.detail as object), dismissed_why: why, dismissed_on: '2026-08-27' } }).eq('id', id); if (error) throw new Error(error.message); }
    }
    console.log(L.join('\n'));
    console.log(`[apply-wave2] ${L.length} decisions${DRY ? ' (dry run)' : ' applied'}`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DRY ? 0 : L.length, flagged: 0 }, `batch 20 wave 2 apply${DRY ? ' dry' : ''}`);
  } catch (e) { await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200)); throw e; }
}
main().then(() => process.exit(0));
