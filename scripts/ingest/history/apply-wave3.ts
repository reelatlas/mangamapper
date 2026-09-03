// Batch 20 wave 3 — the curated apply (P10: the map decides). Sean ruled
// 2026-08-27: all eleven decisions as written (WAVE3-RECOVERY §THE DECISIONS),
// with the shugo-chara renumber built as an N11 `resort` form in lib (the
// span = AFL's rows 74-96 through both 96s, ordered by date, never by number;
// unit-tested against the identity table before the edges), the golden-kamuy
// block 25-46 as ONE atomic G53 ruling, TBATE 24 and FotNS 5 → filler, the
// rosario S1 continues CURATED (C7) under the C2-backwards reading — the
// parity healer is NOT turned on for regime series. Types (T6), the A44
// entries, the dates and titles (G53) and the resort (N11) are MAP edits
// asserted by the healers / the AFL write path; this script carries:
//   STEP 0  shugo-chara: re-fetch + re-stage its AFL page (the parser now keeps
//           the doubled 96), resolveSeries under the resort, then RE-KEY the
//           stored anchors / annotations old row → true row (the identity
//           table) and add the divergence fact to the restored true-95 row.
//   STEP 1  the eight verdicts, FILE-DRIVEN with the curated overlay (the
//           verifiers' corrections: kinnikuman 44 → 116 + no partial{117};
//           x rearranged {54-62, 63}; TBATE 24 no anchor, 23 → continue 85
//           post_series; solo 25's chapters_adapted plain; FotNS ep 5 hostile;
//           eyeshield 60/61 high; TMM as delivered).
//   STEP 2  rosario-vampire S1: 12 curated C2-backwards continues + ep 13 → 20
//           post_series, 6/7/11/17 named.
//   STEP 3  flags #688 / #860 / #937 / #1029 dismissed with their findings.
// Idempotent; --dry-run prints every change (no network in a dry run).
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch20/apply-wave3.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll, startRun, finishRun } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';
import { AFL_BASE, parseShowPage } from '../lib/afl';
import { politeFetch } from '../lib/http';
import { stageAfl, resolveSeries } from '../lib/resolve';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch20/out';
const VER = 'scripts/ingest/research/batch20/verify';
const B = 'research-tier batch 20 wave 3 (2026-08-27, narrow follow-ups; verified R24, Sean ruled)';
// [verdict file, series id, verify report]
const FILES: [string, string, string][] = [
  ['solo-leveling.json', 'solo-leveling', 'solo-leveling.md'],
  ['the-beginning-after-the-end.json', 'the-beginning-after-the-end', 'the-beginning-after-the-end.md'],
  ['kinnikuman-w3.json', 'kinnikuman', 'kinnikuman-w3.md'],
  ['x.json', 'x', 'x.md'],
  ['fist-of-the-north-star.json', 'fist-of-the-north-star', 'fist-of-the-north-star.md'],
  ['eyeshield-21-w3.json', 'eyeshield-21', 'eyeshield-tmm-w3.md'],
  ['tokyo-mew-mew.json', 'tokyo-mew-mew', 'eyeshield-tmm-w3.md'],
];

// ---- the curated overlay (P10)
const ANCHOR_OVERRIDE: Record<string, { end?: number; start?: number; adapted?: string; confidence?: string; why?: string }> = {
  'kinnikuman#44': { end: 116, adapted: '116-117 (ch 117 only its opening beat)', why: "END 116 (the verifier): the ch-117 plea the verdict placed in 44B is Toei's ep-45 synopsis text (ナツコが懇願); fandom 44B's plea is Laura Mackintosh, an anime-only tie — 44 carries ch 116 (the Warsman final's opening rounds, Toei's synopsis) and at most 117's first beat; ep 45 → 118 [117] unchanged. Medium. [medium]" },
  'solo-leveling#25': { adapted: '104-110', why: "REPAIR 108 → 110 (the verifier): fandom Episode 25 `adaptedFrom` = Chapter 104-110 {{WB}}, the Recruitment Arc page (webtoon 108-110 / Episode 25), Chapter 110's summary IS the finale's close (Go Gunhee's B-rank dungeon → the red gate → the shadow army → 'ready for the next hunt'); AFG's 108 is its continua cell repeated. ComicBook + GameRant say 110 independently. Was afg 108; manual now (P8). [high]" },
  'eyeshield-21#60': { confidence: 'high', why: "END 123 [122] (the verifier closed the fork): ep 60's body is ch 122 page-verified (Kakei's one-on-one counter p10, the Devil Bat Ghost crushed p17-19 = Bandai's モビィディック・アンカー) and it ends on Deimon's go-ahead touchdown after Kyoshin's field goal — ch 123's exact skeleton (MangaDex p3 FG, p21 TD, p22 '12-10, seven minutes left'), a third witness (a 2009 per-episode viewing log) narrating 18-17 at the cut; Bandai's ep-61 synopsis opens with the lead already taken. [high]" },
  'eyeshield-21#61': { confidence: 'high', why: "123 [123] (the verifier): ep 61 opens at 18-17 with 7:08 left and its payload is ch 123's そして一年後 flashback (Mizumachi's swim team, p15) played AFTER the comeback the manga puts it before → rearranged {123}; ch 124 opens (pp 2-5) directly on the Poseidon call — the anime's stalemate is padding, so END stays 123 and ep 62 → 124 [124] holds. [high]" },
};
const ANCHOR_REJECT = new Set<string>(['the-beginning-after-the-end#24']); // filler by T6 (Sean: the verifier's T28 reading) — A1, no anchor
const CONTINUE_OVERRIDE: Record<string, { chapter: number; kind?: 'parity' | 'post_series'; note: string }> = {
  'the-beginning-after-the-end#23': { chapter: 85, kind: 'post_series', note: "C5 post-series (Sean 2026-08-27): ep 23 is the anime's last row with source pages — ch 81-84 (81 Different, 82 The Announcement, 83 A Ball, 84 A Gentleman's Agreement — the Gideon deal, its last beat; three witnesses). Ep 24 is filler (a coda of ch 86's opening ceremony + a restaged reunion, T28) and takes no anchor. Resume at ch 85 'Anticipation': 85-88 (the uniforms; the Xyrus opening ceremony; Nicolas Dreyl / Lilia / Clive; the source's real reunion) are unseen — the anime ends inside webcomic season 4 (86-125) having skipped season 3's finale." },
};
const CONTINUE_DROP = new Set<string>(['the-beginning-after-the-end#24']); // the row is filler; its continue lives on ep 23
const ANNOTATION_OVERRIDE: Record<string, { chapters?: string | null; note?: string }> = {
  'x#17#rearranged': { chapters: '54-62, 63', note: "Batch 20 wave 3 (the verifier's version): ep 17 'Wish' is a recap of vols 14 (54-62) with its own first-time vol-14 material (Kakyō enters Kamui's dream; the Sacred Sword answer) and ch 63's sea dream — the entry's FIRST showing of that scene (the OVA prologue 'An Omen' is ep 0, outside the entry's 24 rows); 70.5 dropped (no source places the shooting in ep 17). Position-less (A44)." },
};
const ANNOTATION_DROP = new Set<string>(['kinnikuman#44#partial', 'kinnikuman#45#partial']); // the 117 straddle — refuted with END 116
const ANNOTATION_ADD: { sid: string; episode: number; kind: AnnotationKind; chapters: string | null; note: string }[] = [
  { sid: 'the-beginning-after-the-end', episode: 24, kind: 'graft', chapters: '86', note: "T28 tie on a filler row (Sean 2026-08-27): the finale's closing act quotes ch 86's Xyrus opening ceremony (Tessia on the student-council stage) as a half-sentence coda, and its night reunion is a restaging of ch 88's beat, not its pages ('completely rewrote how Tessia and Arthur reunite'); the rest — Shiun, the church duel, the city rampage — is anime-original. Position-less (A1/A44); the continue 85 lives on ep 23." },
];
// shugo-chara: old stored row → true row (the verified identity table, rows 74-96); rows not listed keep their number
const SHUGO_REKEY: Record<number, number> = { 74: 73, 75: 75, 76: 74, 77: 76, 78: 77, 79: 78, 80: 79, 81: 80, 82: 81, 83: 83, 84: 82, 85: 84, 86: 85, 87: 86, 88: 87, 89: 88, 90: 90, 91: 89, 92: 91, 93: 92, 94: 93, 95: 94, 96: 96 };
// rosario-vampire S1 (Sean 2026-08-27): the C2-backwards values derived from the stored rows; curated (C7), never the healer
const ROSARIO: { episode: number; chapter: number; kind: 'parity' | 'post_series'; note: string }[] = [
  { episode: 1, chapter: 2, kind: 'parity', note: 'C2 parity: ep 2 adapts ch 2 next. S1 never adapts chs 6, 7, 11 and 17 (Capu2 reaches back for some); the anime plays chs 3-5 in eps 5-6 after ep 3\'s ch 5.' },
  { episode: 2, chapter: 5, kind: 'parity', note: 'C2 parity: ep 3 adapts ch 5 next (the anime front-loads it); chs 3-4 follow in eps 5-6. S1 never adapts 6, 7, 11, 17.' },
  { episode: 3, chapter: 3, kind: 'parity', note: 'C2 parity, BACKWARDS: ep 5 adapts ch 3 next (ep 4 is filler); C3: ch 5 is already read — skip on arrival. S1 never adapts 6, 7, 11, 17.' },
  { episode: 5, chapter: 4, kind: 'parity', note: 'C2 parity: ep 6 adapts ch 4 next. S1 never adapts 6, 7, 11, 17.' },
  { episode: 6, chapter: 18, kind: 'parity', note: 'C2 parity: ep 7 jumps to ch 18-19 (S1\'s back half reorders 8-19); chs 6-7 are never adapted in S1; 8-17 follow out of order in eps 8-13. S1 never adapts 6, 7, 11, 17.' },
  { episode: 7, chapter: 12, kind: 'parity', note: 'C2 parity, BACKWARDS: ep 8 adapts ch 12 next; C3: chs 18-19 are already read — skip on arrival. S1 never adapts 6, 7, 11, 17.' },
  { episode: 8, chapter: 13, kind: 'parity', note: 'C2 parity: ep 9 adapts ch 13 next. S1 never adapts 6, 7, 11, 17.' },
  { episode: 9, chapter: 14, kind: 'parity', note: 'C2 parity: ep 10 adapts ch 14-16 next. S1 never adapts 6, 7, 11, 17.' },
  { episode: 10, chapter: 8, kind: 'parity', note: 'C2 parity, BACKWARDS: ep 11 adapts ch 8 next; C3: chs 12-16 are already read — skip on arrival. S1 never adapts 6, 7, 11, 17.' },
  { episode: 11, chapter: 9, kind: 'parity', note: 'C2 parity: ep 12 adapts ch 9 next. S1 never adapts 6, 7, 11, 17.' },
  { episode: 12, chapter: 9, kind: 'parity', note: 'C1: ep 13 opens on ch 9\'s second half (then ch 10, heavily altered) — resume in 9. S1 never adapts 6, 7, 11, 17.' },
  { episode: 13, chapter: 20, kind: 'post_series', note: 'C5 post-series (S1\'s end): coverage reaches ch 19 (ep 7), so resume at ch 20; chs 6, 7, 11 and 17 were never adapted in S1 (Capu2, a separate entry, reaches back for some). Sean 2026-08-27: curated under the C2-backwards reading, not a healer flip.' },
];

async function main() {
  const runId = await startRun('resolve');
  const L: string[] = [];
  try {
    // ---- STEP 0: shugo-chara — re-fetch, re-stage, resolve under the N11 resort, re-key
    {
      const { data: s } = await db.from('series').select('afl_slug, title').eq('id', 'shugo-chara').maybeSingle();
      L.push(`  SHUGO re-fetch ${AFL_BASE}/shows/${s!.afl_slug} → stageAfl (the parser keeps the doubled 96) → resolveSeries (N11 resort 74-96 → 73-96 by date) → re-key anchors/annotations`);
      if (!DRY) {
        const res = await politeFetch(`${AFL_BASE}/shows/${s!.afl_slug}`, {});
        if (!res.html) throw new Error(`shugo-chara AFL fetch: status ${res.status}`);
        const page = parseShowPage(res.html);
        const dup = page.episodes.filter((e) => e.number === 96).length;
        L.push(`  SHUGO staged rows ${page.episodes.length}, '96' rows ${dup}`);
        if (dup !== 2) throw new Error(`expected AFL to print 96 twice, saw ${dup} — the live page changed; stop and re-plan`);
        const outcome = await stageAfl(runId, s!.afl_slug, page, { etag: res.etag ?? null, lastModified: res.lastModified ?? null, expectedTitle: s!.title });
        L.push(`  SHUGO stageAfl: ${outcome}`);
        if (outcome === 'held') throw new Error('shugo-chara AFL page held (integrity / large diff) — stop');
        const r = await resolveSeries(runId, s!.afl_slug);
        L.push(`  SHUGO resolveSeries: ${r.episodes} episodes${r.flagged ? ' (flagged)' : ''}`);
      }
      // re-key old → true, ascending (every move is downward or a stay, so each target is vacated first)
      for (const table of ['chapter_anchors', 'episode_annotations'] as const) {
        const rows = await selectAll<any>(table, 'episode', (q) => q.eq('series_id', 'shugo-chara').order('episode'));
        const occupied = new Set(rows.map((r) => Number(r.episode))); // simulated in memory so the dry run and the real run see the same sequence
        const eps = [...occupied].filter((n) => n >= 74 && n <= 96).sort((a, b) => a - b);
        for (const old of eps) {
          const nu = SHUGO_REKEY[old];
          if (nu == null || nu === old) continue;
          const clash = occupied.has(nu);
          L.push(`  SHUGO re-key ${table} ep${old} → ep${nu}${clash ? ' (TARGET OCCUPIED)' : ''}`);
          if (clash) throw new Error(`re-key ${table} ${old} → ${nu}: target occupied`);
          occupied.delete(old); occupied.add(nu);
          if (!DRY) { const { error } = await db.from(table).update({ episode: nu }).eq('series_id', 'shugo-chara').eq('episode', old); if (error) throw new Error(`re-key ${table} ${old}: ${error.message}`); }
        }
      }
      // the restored true-95 row (りまとやや、真珠の絆！) sits inside the stored divergence block 86-96 ("between 32 and 33") — carry the fact
      const div = (await selectAll<any>('episode_annotations', 'note, chapters', (q) => q.eq('series_id', 'shugo-chara').eq('episode', 96).eq('kind', 'divergence')))[0];
      if (div) {
        L.push('  SHUGO annotation ep95 divergence (the restored row joins the 86-96 block)');
        if (!DRY) await upsertAnnotation({ series_id: 'shugo-chara', episode: 95, kind: 'divergence', chapters: div.chapters, note: `${div.note ?? ''} | the true ep 95 (りまとやや、真珠の絆！ 2009-08-08), restored by the N11 resort 2026-08-27 (AFL printed it as a second '96')`.slice(0, 900), origin: 'research' });
      }
    }

    // ---- STEP 1: the verdicts, file-driven with the overlay
    for (const [file, sid, report] of FILES) {
      const v = JSON.parse(readFileSync(`${OUT}/${file}`, 'utf8'));
      for (const a of v.anchors ?? []) {
        const key = `${sid}#${a.episode}`;
        if (ANCHOR_REJECT.has(key)) { L.push(`  REJECT anchor ${key} (filler by T6, A1)`); continue; }
        const o = ANCHOR_OVERRIDE[key] ?? {};
        const end = o.end ?? Number(a.end_chapter), start = o.start ?? (a.start_chapter != null ? Number(a.start_chapter) : null);
        const why = o.why ?? `${a.note} [${o.confidence ?? a.confidence}]`;
        const cur = (await selectAll<any>('chapter_anchors', 'chapter, start_chapter, source', (q) => q.eq('series_id', sid).eq('episode', a.episode)))[0];
        L.push(`  ANCHOR ${key}: ${cur ? `${cur.chapter} [${cur.start_chapter}] (${cur.source})` : 'NEW'} → ${end} [${start}] v${a.volume ?? '-'}${o.end || o.start || o.adapted || o.confidence ? ' (overlay)' : ''}`);
        if (!DRY) {
          const { error } = await db.from('chapter_anchors').upsert({ series_id: sid, episode: a.episode, chapter: end, start_chapter: start, chapters_adapted: o.adapted ?? a.chapters_adapted ?? null, volume: a.volume ?? null, source: 'manual', note: `${B}: ${why} <${OUT}/${file} ; ${VER}/${report}>`.slice(0, 1200) }, { onConflict: 'series_id,episode' });
          if (error) throw new Error(`anchor ${key}: ${error.message}`);
        }
      }
      for (const r of v.repairs ?? []) {
        const key = `${sid}#${r.episode}`;
        if (['air_date', 'title'].includes(r.field)) { L.push(`  MAP repair ${key} ${r.field} (G53 map)`); continue; }
        if (r.field === 'end_chapter' && sid === 'solo-leveling') { L.push(`  (repair ${key} carried by the ep-25 anchor upsert)`); continue; }
        const col: Record<string, string> = { end_chapter: 'chapter', chapter: 'chapter', start_chapter: 'start_chapter', chapters_adapted: 'chapters_adapted', volume: 'volume', note: 'note', continue_note: 'continue_note' };
        const c = col[r.field];
        if (!c) { L.push(`  SKIP repair ${key} ${r.field}: ${String(r.why ?? '').slice(0, 80)}… (a record note, not a column — see the recovery)`); continue; }
        const cur = (await selectAll<any>('chapter_anchors', 'chapter, note, continue_note, source', (q) => q.eq('series_id', sid).eq('episode', r.episode)))[0];
        if (!cur) { L.push(`  SKIP repair ${key} ${c}: no stored anchor`); continue; }
        const value = ['note', 'continue_note'].includes(c) ? `${B}: ${r.new}`.slice(0, c === 'continue_note' ? 600 : 1200) : r.new;
        L.push(`  REPAIR ${key} ${c}: → ${String(r.new).slice(0, 70)}…`);
        if (!DRY) { const { error } = await db.from('chapter_anchors').update({ [c]: value, source: 'manual' }).eq('series_id', sid).eq('episode', r.episode); if (error) throw new Error(`repair ${key}: ${error.message}`); }
      }
      const seenCont = new Set<string>();
      for (const c of v.continue_points ?? []) {
        const key = `${sid}#${c.episode}`;
        if (CONTINUE_DROP.has(key)) { L.push(`  DROP continue ${key}`); continue; }
        const o = CONTINUE_OVERRIDE[key]; seenCont.add(key);
        L.push(`  CONTINUE ${key} → ${o?.chapter ?? c.continue_chapter}/${o?.kind ?? c.kind}${o ? ' (overlay)' : ''} (curated, C7)`);
        if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: o?.chapter ?? Number(c.continue_chapter), kind: o?.kind ?? c.kind, note: `${B}: ${o?.note ?? c.note}` });
      }
      for (const [key, o] of Object.entries(CONTINUE_OVERRIDE)) if (key.startsWith(`${sid}#`) && !seenCont.has(key)) {
        const ep = Number(key.split('#')[1]);
        L.push(`  CONTINUE ${key} → ${o.chapter}/${o.kind} (overlay, added) (curated, C7)`);
        if (!DRY) await writeCuratedContinue(sid, ep, { chapter: o.chapter, kind: o.kind ?? 'parity', note: `${B}: ${o.note}` });
      }
      for (const an of v.annotations ?? []) {
        for (const ep of an.episodes as number[]) {
          const key = `${sid}#${ep}#${an.kind}`;
          if (ANNOTATION_DROP.has(key)) { L.push(`  DROP ann ${key}`); continue; }
          const o = ANNOTATION_OVERRIDE[key] ?? {};
          const chapters = o.chapters !== undefined ? o.chapters : (an.chapters && !/^(none|n\/a)$/i.test(String(an.chapters)) ? String(an.chapters) : null);
          L.push(`  ANN ${key} {${chapters ?? ''}}${o.note || o.chapters !== undefined ? ' (overlay)' : ''}`);
          if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: an.kind as AnnotationKind, chapters, basis: an.basis ?? null, note: `${B}: ${o.note ?? an.note}`.slice(0, 900), origin: 'research' });
        }
      }
      for (const tc of v.type_corrections ?? []) L.push(`  MAP type ${sid} eps ${tc.episodes} → ${tc.type} (T6, asserted by the healer)`);
      for (const h of v.anchor_hostile ?? []) L.push(`  HOSTILE ${sid}#${h.episode} (A44 map / filler by T6 — no anchor)`);
    }
    for (const a of ANNOTATION_ADD) {
      L.push(`  ANN ${a.sid}#${a.episode}#${a.kind} {${a.chapters ?? ''}} (added)`);
      if (!DRY) await upsertAnnotation({ series_id: a.sid, episode: a.episode, kind: a.kind, chapters: a.chapters, note: `${B}: ${a.note}`.slice(0, 900), origin: 'research' });
    }
    // TBATE ep 24: any stored anchor on the now-filler row goes (A1)
    {
      const e24 = await selectAll<any>('chapter_anchors', 'chapter', (q) => q.eq('series_id', 'the-beginning-after-the-end').eq('episode', 24));
      L.push(`  DELETE the-beginning-after-the-end ep24 anchor (A1, filler by T6): ${e24.length ? `${e24[0].chapter} → gone` : 'already absent'}`);
      if (!DRY && e24.length) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', 'the-beginning-after-the-end').eq('episode', 24); if (error) throw new Error(error.message); }
    }

    // ---- STEP 2: rosario-vampire S1 curated continues
    for (const c of ROSARIO) {
      const cur = (await selectAll<any>('chapter_anchors', 'chapter, continue_chapter', (q) => q.eq('series_id', 'rosario-vampire').eq('episode', c.episode)))[0];
      if (!cur) { L.push(`  ROSARIO ep${c.episode}: NO ANCHOR ROW — skipped`); continue; }
      L.push(`  ROSARIO ep${c.episode} (→ ${cur.chapter}) continue ${cur.continue_chapter ?? 'null'} → ${c.chapter}/${c.kind} (curated, C7)`);
      if (!DRY) await writeCuratedContinue('rosario-vampire', c.episode, { chapter: c.chapter, kind: c.kind, note: `${B}: ${c.note}` });
    }

    // ---- STEP 3: flags
    const now = new Date().toISOString();
    for (const [id, why] of [
      [688, "RESOLVED (batch 20 wave 3, verified R24): no edition divergence — MU's own record says 27 tankōbon and its coverage segments for this entry read 'Vol 16, Chap 136 (1983 S1)' / 'Vol 24, Chap 210 (1983 S2)', exactly our stored terminals in AniList's 245-chapter space (hokuto.fandom Chapter 1-245 with our volume blocks; hokutosite 全245話); MU's latest_chapter 71 is the 2023-11-16 Deux83 release 'v8 c67-71' (v8 = 63-71, same space). NOTE for capture: MU's string now carries a 2026-remake segment; the picker keeps '(1986 Movie/Legend of Raoh 1)' because its year is in-window — a lib gap witness (no data effect: the chosen max is still 210)."],
      [860, "RESOLVED (batch 20 wave 3, verified R24): no numbering offset — rows 25-46 held the Golden Dōga Gekijō web shorts' titles AND dates verbatim (AFL's title authority stops at row 24; en-WP's second {{Episode list}} block filled 25-46); the backfill's own compare showed 20 conflicts today = rows 25-44 (22 at flag time, before batch 19 fixed 45/46). Repaired as one atomic G53 title+date block (air-dates.ts + episode-titles.ts); rows 1-24 and 47-62 join 1:1."],
      [937, "RESOLVED (batch 20 wave 3, verified R24): the episode-row audit is done — AFL skips no. 73, transposes 75/76, 83/84, 90/91 and prints 96 twice; the rows' dates and titles are true, the NUMBERS were wrong as a sequence. Ruled as an N11 `resort` (numbering-shifts.ts: rows 74-96 by date → 73-96, the doubled 96 = true 95 + 96, the true-95 row restored), the G53 date map re-keyed, the 107/108 transposition swapped (G53 title+date), 35/37/46 repaired; no G54 ack anywhere."],
      [1029, "RESOLVED (batch 20 wave 3, verified R24): the afg-tier hole 13-24 is anchored on the webtoon's own numbering (sololeveling.fandom {{WB}} × AFG agree 10/12; the arc pages' event index), the fence 12 → 45 confirmed and 25 → 108 repaired to 110 (the finale runs through ch 110); continue 111 post_series. MU still has no anime coverage for this entry — the frontier is the manual terminal."],
    ] as const) {
      const { data } = await db.from('ingest_flags').select('status, detail').eq('id', id).maybeSingle();
      L.push(`  FLAG #${id}: ${data?.status} → dismissed`);
      if (!DRY && data?.status === 'open') { const { error } = await db.from('ingest_flags').update({ status: 'dismissed', resolved_at: now, detail: { ...(data.detail as object), dismissed_why: why, dismissed_on: '2026-08-27' } }).eq('id', id); if (error) throw new Error(error.message); }
    }
    console.log(L.join('\n'));
    console.log(`[apply-wave3] ${L.length} decisions${DRY ? ' (dry run)' : ' applied'}`);
    await finishRun(runId, 'ok', { fetched: 0, unchanged: 0, changed: DRY ? 0 : L.length, flagged: 0 }, `batch 20 wave 3 apply${DRY ? ' dry' : ''}`);
  } catch (e) { await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: 0, flagged: 0 }, String(e).slice(0, 200)); throw e; }
}
main().then(() => process.exit(0));
