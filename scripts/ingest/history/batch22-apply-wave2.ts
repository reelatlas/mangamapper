// Batch 22 wave 2 — the narrow wave, APPLY (Sean ruled 2026-09-05: decisions 1-4 as
// verified, beelzebub 15 filler). File-driven over the verdict JSONs with a curated
// OVERLAY (P10: the map decides, never the agent's field shape). The RULINGS land
// through the maps (T6 / T30 pins in episode-types.ts; the FMA records in
// standing-annotations.ts — ruling-tier rows the healer owns; arcs.ts; the T26
// parallel clause in lib/side-source.ts); this script lands what is RESEARCH-tier:
// research-origin annotations (same-kind upsert REPLACES), the three curated
// anchors (manual tier, P8), the ep-15 deletion (A1 / A44), two continues (C7),
// the two dbs-6 correspondence rows (A46), the dbs-6 note repair.
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch22/apply-wave2.ts [--dry-run]
import { readFileSync } from 'node:fs';
import { db, selectAll } from '../lib/db';
import { upsertAnnotation, type AnnotationKind } from '../lib/annotations';
import { writeCuratedContinue } from '../lib/continues';
import { upsertCorrespondence } from '../lib/rulings/correspondence';
import { volumeForChapter, type VolumeBound } from '../lib/volumes';
import { sliverEnd } from '../lib/sliver';

const DRY = process.argv.includes('--dry-run');
const OUT = 'scripts/ingest/research/batch22/out' /* P34: moved to history 2026-09-05 — never run */;
const B = '[batch 22 wave 2, verified R24, Sean ruled 2026-09-05 — WAVE2-RECOVERY.md]';
const V = '(verifier, verify/w2-*.md, 2026-09-05)';
const FILES = ['beelzebub-w2a.json', 'beelzebub-w2b.json', 'dragon-ball-super-w2.json']; // fullmetal-alchemist-w2.json lands through standing-annotations.ts (ruling-tier rows); boruto-naruto-next-generations-w2.json is a confirmation (no writes)

// ---- THE OVERLAY — every deviation from the file is a keyed entry with its reason (the verifier's corrections)
const ANNOTATION_OVERRIDE: Record<string, { chapters?: string; note?: (n: string) => string; why: string }> = {
  'beelzebub#15#graft': {
    why: "ep 18 carries the household return (flashback), the fever and Tōjō's entry; the beach tableau is ep 15's own staging — 'in full' overstated",
    note: (n) => n.replace("CH 23 IS ADAPTED PROPERLY BY EP 18, which animates Beel's summer cold, the fading Zebul Spell and Tōjō's entry", `CH 23 IS ADAPTED PROPERLY BY EP 18, which carries the Furuichi-household return (its cast list opens with the family, flashback), Beel's summer cold, the fading Zebul Spell and Tōjō's 登場; the BEACH TABLEAU (Tōjō on the slab, the 200 m of thugs, Aizawa, Jinno) is ep 15's OWN staging with the reveal withheld — ch 23's load-bearing beat is the reveal, and that is ep 18's ${V}`),
  },
  'beelzebub#26#partial': {
    why: 'the page split (51 pp 1-12 / 12-19) is the MANGA\'s, not ep 26\'s; Bandai 029 puts the classroom rumours + a Kido summons in ep 29 — no page numbers enter the record; END 51 stands on A47\'s unproven-tail convention',
    chapters: "51 (the Kido summons — the expulsion warning; the classroom rumours, Azusa's classroom and the Rokkisei confrontations are ep 29's)",
    note: (n) => `PAGE ATTRIBUTION WITHDRAWN ${V}: the arc page states the MANGA's split of ch 51 (pp 1-12 / 12-19) but no source says which pages ep 26 animates, and Bandai 029 opens ep 29 on the classroom Rokkisei rumours AND a Kido summons with Aoi — the Kido scene is split (26 = the expulsion warning, per Bandai 026 / en-WP / Kido's page 'anime debut = Episode 26'; 29 = the Rokkisei-enforcement line). END 51 stands on A47's unproven-tail convention (the share exists on ≥ 2 sources; its size is unstated). ${n.replace(/Twelve pages is far above A47's five-page bar and no source uses teaser wording for it, so /, 'No source uses teaser wording for the ch-51 share, so ')}`,
  },
  'beelzebub#49#side_story': {
    why: "'between printed ch 88 and ch 89' is MangaDex's decimal placement — no source documents where inside vol 10 the extra is bound",
    chapters: "the unnumbered special extra chapter 「ベルベル☆西遊記〜天竺までぶっとばせ!!〜」 ('BeelBeel☆Journey to the West ~Let's Head for Tenjiku!!~'), 5 story pages printed inside tankōbon volume 10 (unnumbered; the fandom's 'Special Extra' — resolve it on MangaDex by chapter UUID, never by '88.5': a third upload under that decimal is different omake)",
    note: (n) => n.replace('(the licensor\'s synopsis gives it beats 1 and 2 of nine)', `(the licensor's synopsis: beat 1 and the Kinkaku / Ginkaku-with-gourd core of beat 2 are the extra — the gourd's swallowing power and the string of other monsters are not; 'nine beats' is the verdict's own segmentation; scene-level fidelity is role- and prop-exact, not independently page-confirmed ${V})`),
  },
  'beelzebub#49#side_source': {
    why: "the verdict still over-credited the novel: the picture-book premise is undocumented in the episode (the anime's frame is the meta joke) and Tojo=Ox King / Hilda-beside-him are the EXTRA's own closing panel",
    note: (n) => n.replace(/weight: NON-SOURCE, and its actual contribution to what airs is UNVERIFIED beyond the premise \(Hilda's demon-world picture book swapping the worlds\) and the Tojo=Ox King \/ Hilda=Rasetsujo roles — the body of the episode most likely being anime-original\./, `weight: NON-SOURCE, and its VERIFIED contribution to what airs is NIL beyond the attribution (YTV / ja-WP 【小説版が原作。】): the picture-book premise is undocumented in the episode (the anime's frame is the meta joke 'we need to do a TV special every New Year's'), Tojo=Ox King and Hilda-beside-him are the EXTRA's own closing panel, and three independent accounts of the episode (YTV, the fandom, a 2012 viewer review) carry none of the novel's climax — the body of the episode is the anime's own ${V}.`),
  },
  'dragon-ball-super#6#divergence': {
    why: "the flashback is staged in eps 6 AND 7 (fandom ep 7 Appearances King Vegeta {{F}} + its Edits; Kanzenshuu eps-007); the manga's mid-fight placement is closer to ep 7's — 'ep 6 is the only telling' dropped; the fandom's lines are paraphrases, not panel text",
    note: (n) => n.replace("in-panel, Beerus 'was given a rude introduction' and Gotenks answers that Buu ate the pudding", "on the pages (Viz), Whis's 'wouldn't have happened if you all weren't so rude', Beerus's 'Boo ate all of it anyways!!' and Gotenks's '…because we wouldn't give you pudding?!'").replace("ep 6 is the only telling that stages it.", "the film and ep 6 stage it; the King Vegeta flashback is staged in the manga (mid-fight, p5) and in the anime in eps 6 (at arrival) AND 7 — not ep 6's alone " + V + "."),
  },
};
const ANNOTATION_SKIP = new Set<string>([]); // none — FMA's file is not walked at all

// research-origin side_source NOTE repair on dbs 6 (the verdict's repairs[0].new, with the verifier's two fixes)
const DBS6_NOTE_FIX = (n: string) => n
  .replace("ch 3 STAGES one beat the anime stages only in ep 6 (Vegeta's childhood flashback of Beerus atop King Vegeta — 'the debut of King Vegeta in the manga')", "ch 3 STAGES the King Vegeta flashback (p5, mid-fight — 'the debut of King Vegeta in the manga'), which the anime stages in eps 6 and 7")
  .replace("Beerus's own line 'was given a rude introduction' and Gotenks's 'Majin Buu ate it' — fandom", "on the pages: Whis 'wouldn't have happened if you all weren't so rude', Beerus 'Boo ate all of it anyways!!', Gotenks '…because we wouldn't give you pudding?!' — Viz ch 3, read by the verifier")
  + ` ${V}: CONFIRMED ON CH 3'S OWN PAGES (Viz's free chapter): p1 Goku 'Bulma's birthday party is right now… this is bad'; p2 the caption 'PLANET EARTH — A LUXURY CRUISE — BULMA'S BIRTHDAY PARTY VENUE'; p6 Bulma's slap 'This is my birthday and you're ruining it!'. The bonus pages' NUMBERS (38 / 54) are inferred from Kanzenshuu's chapter-start table.`;

// anchors: the curated overlay per row (chapters_adapted kept CLEAN of prose — the A47 parsers read it; the prose lives in the partial annotation)
const ANCHOR_SKIP: Record<string, string> = { 'beelzebub#26': 'CONFIRMED AS STORED (51 [50], afg tier) — no value moves, no write (P8 needs no flip)' };
const ANCHOR_CHAPTERS: Record<string, string> = { 'beelzebub#16': '21-22', 'beelzebub#51': '114-115' };
const ANCHOR_DELETE: { sid: string; episode: number; why: string }[] = [
  { sid: 'beelzebub', episode: 15, why: "retyped FILLER (A1): the ch-23 beach tableau is a sliver (restaged furniture, the reveal withheld — ep 18 carries it); the afg-tier anchor 23 [23] + its continue come out at the manual tier (P8); the T6 filler pin holds the AFG writer's A1 gate against a re-mint" },
];

async function main() {
  const bounds = new Map<number, VolumeBound[]>();
  const series = await selectAll<{ id: string; manga_anilist_id: number | null }>('series', 'id, manga_anilist_id');
  const mangaOf = new Map(series.map((s) => [s.id, s.manga_anilist_id]));
  const boundsFor = async (sid: string) => { const m = mangaOf.get(sid); if (!m) return []; if (!bounds.has(m)) bounds.set(m, await selectAll<VolumeBound>('volume_boundaries', 'volume, chapter_start, chapter_end', (q) => q.eq('manga_anilist_id', m).order('volume'))); return bounds.get(m)!; };
  const typeOf = new Map((await selectAll<any>('episodes', 'series_id, number, type')).map((e: any) => [`${e.series_id}#${e.number}`, e.type]));
  let anns = 0, anchors = 0, conts = 0, dels = 0, corr = 0;
  const touched = new Set<string>();

  for (const f of FILES) {
    const v = JSON.parse(readFileSync(`${OUT}/${f}`, 'utf8'));
    const sid: string = v.series_id; touched.add(sid);
    console.log(`\n== ${f} (${sid})`);
    // recap baseline for every row the file names (stored type first)
    const named = new Set<number>([...(v.type_corrections ?? []).flatMap((t: any) => t.episodes), ...(v.annotations ?? []).flatMap((a: any) => a.episodes), ...(v.anchors ?? []).map((a: any) => a.episode)]);
    for (const ep of [...named].sort((a, b) => a - b)) { const tc = (v.type_corrections ?? []).find((t: any) => t.episodes.includes(ep)); console.log(`  baseline ep ${ep} — stored ${typeOf.get(`${sid}#${ep}`)} → ${tc ? tc.type : 'no type change'} (pin in episode-types.ts)`); }
    // annotations (research-origin; same-kind upsert replaces)
    for (const a of v.annotations ?? []) for (const ep of a.episodes as number[]) {
      const key = `${sid}#${ep}#${a.kind}`;
      if (ANNOTATION_SKIP.has(key)) { console.log(`  annotation ep ${ep} ${a.kind} SKIPPED (ruling tier)`); continue; }
      const o = ANNOTATION_OVERRIDE[key];
      const chapters: string | null = o?.chapters ?? a.chapters ?? null;
      let note: string = `${a.note ?? ''} ${B}`;
      if (o?.note) note = `${o.note(a.note ?? '')} ${B}`;
      if (o?.note && note === `${a.note ?? ''} ${B}`) throw new Error(`overlay ${key}: the note replacement did not match — the verdict text changed`);
      console.log(`  annotation ep ${ep} ${a.kind}${chapters ? ` {${chapters.slice(0, 50)}…}` : ''}${o ? ` (overlay: ${o.why.slice(0, 70)}…)` : ''}`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: ep, kind: a.kind as AnnotationKind, chapters, note: note.slice(0, 4000), origin: 'research' });
      anns++;
    }
    // anchors (manual tier; volume derived; A47 against the TRUE next anchored row's START)
    const bd = await boundsFor(sid);
    for (const a of v.anchors ?? []) {
      const key = `${sid}#${a.episode}`;
      if (ANCHOR_SKIP[key]) { console.log(`  anchor ep ${a.episode} SKIPPED — ${ANCHOR_SKIP[key]}`); continue; }
      const end = Number(a.end_chapter ?? a.chapter); const start = a.start_chapter != null ? Number(a.start_chapter) : null;
      const chapters_adapted = ANCHOR_CHAPTERS[key] ?? a.chapters_adapted ?? null;
      const vol = volumeForChapter(bd, end);
      const { data: nxt } = await db.from('chapter_anchors').select('episode, start_chapter').eq('series_id', sid).gt('episode', Number(a.episode)).order('episode').limit(1).maybeSingle();
      const norm = sliverEnd(chapters_adapted, end, nxt?.start_chapter ?? null); // A47: the normalizer against the TRUE next anchored row's START
      const { data: cur } = await db.from('chapter_anchors').select('chapter, start_chapter, source').eq('series_id', sid).eq('episode', Number(a.episode)).maybeSingle();
      console.log(`  anchor ep ${a.episode} → ${start ?? '·'}-${end} v${vol ?? '·'} {${chapters_adapted}} manual${cur ? ` (was ${cur.start_chapter ?? '·'}-${cur.chapter} ${cur.source})` : ' (NEW)'}${vol !== a.volume ? ` (volume derived: agent said v${a.volume})` : ''}${norm.end !== end ? ` (A47 normalized from ${end} → ${norm.end}: tail '${norm.tail}', ${norm.pages} pp)` : ''}`);
      if (norm.end !== end) throw new Error(`${key}: A47 would move the END ${end} → ${norm.end} — curate an END_OVERRIDE before applying`);
      const row = { series_id: sid, episode: Number(a.episode), chapter: end, start_chapter: start, chapters_adapted, volume: vol, source: 'manual', note: `${a.note ?? ''} [${(a.sources ?? []).slice(0, 2).join(' ; ')}] ${B}`.slice(0, 600) };
      if (!DRY) { const { error } = await db.from('chapter_anchors').upsert(row, { onConflict: 'series_id,episode' }); if (error) throw new Error(`${key}: ${error.message}`); }
      anchors++;
    }
    for (const c of v.continue_points ?? []) {
      console.log(`  continue ep ${c.episode} → ${c.continue_chapter} (${c.kind})`);
      if (!DRY) await writeCuratedContinue(sid, Number(c.episode), { chapter: Number(c.continue_chapter), kind: c.kind, note: `${c.why ?? c.note ?? ''} ${B}` });
      conts++;
    }
    // dbs 6: the research-origin side_source note repair + the two correspondence rows (A46)
    if (sid === 'dragon-ball-super') {
      const rep = (v.repairs ?? []).find((r: any) => r.target === 'annotations' && r.field === 'note' && (r.episodes ?? []).includes(6));
      if (!rep) throw new Error('dbs 6: the note repair is missing from the verdict');
      const fixed = DBS6_NOTE_FIX(rep.new);
      if (fixed === rep.new + '') throw new Error('dbs 6: the note fix did not match — the verdict text changed');
      const { data: cur } = await db.from('episode_annotations').select('chapters, note, origin').eq('series_id', sid).eq('episode', 6).eq('kind', 'side_source').maybeSingle();
      if (!cur || cur.origin !== 'research') throw new Error(`dbs 6 side_source: expected a research-origin row, got ${cur?.origin}`);
      console.log(`  repair ep 6 side_source note (research origin; the label kept: ${(cur.chapters ?? '').slice(0, 40)}…)`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: 6, kind: 'side_source', chapters: cur.chapters, note: `${fixed} ${B}`.slice(0, 4000), origin: 'research' });
      anns++;
      const rows = [
        { episode: 6, chStart: 3, chEnd: 3, alignment: 'divergent' as const, note: "The same outline node told differently (A46): ch 3's opening Earth pages NARRATE the birthday-party visit (the interruption, Beerus's Super-Saiyan-God errand, Boo having eaten the pudding — Viz ch 3 p2-3, read by the verifier) and STAGE the King Vegeta flashback (p5); ch 2's closing page is the setup. The visit AS SCENES is the film's and the anime's. " + B },
        { episode: 6, chStart: null, chEnd: null, alignment: 'anime_only' as const, note: 'The party visit as SCENES (Beerus and Whis boarding the Princess Bulma, the placating, the octopus / takoyaki business substituted for the film\'s bingo song, Buu vs Beerus) appears in no chapter of the digest — the film\'s sequence, staged by the anime alone; the ep-4 precedent (one anime_only row + one divergent row). ' + B },
      ];
      for (const r of rows) { console.log(`  correspondence ep 6 ${r.alignment}${r.chStart != null ? ` ch ${r.chStart}` : ''}`); if (!DRY) await upsertCorrespondence(sid, r, 'research'); corr++; }
    }
  }
  for (const d of ANCHOR_DELETE) {
    const { data: cur } = await db.from('chapter_anchors').select('chapter, start_chapter, source, continue_chapter').eq('series_id', d.sid).eq('episode', d.episode).maybeSingle();
    console.log(`\n  DELETE anchor ${d.sid} ep ${d.episode}${cur ? ` (was ${cur.start_chapter ?? '·'}-${cur.chapter} ${cur.source}${cur.continue_chapter ? `, continue ${cur.continue_chapter}` : ''})` : ' (already absent)'} — ${d.why.slice(0, 90)}…`);
    if (!DRY && cur) { const { error } = await db.from('chapter_anchors').delete().eq('series_id', d.sid).eq('episode', d.episode); if (error) throw new Error(error.message); }
    if (cur) dels++;
  }
  if (!DRY) { const { error } = await db.from('series').update({ asterisk_review: 'pending' }).in('id', [...touched, 'fullmetal-alchemist']).is('asterisk_review', null); if (error) throw new Error(error.message); }
  console.log(`\n[apply-wave2] ${anns} annotations, ${anchors} anchors, ${conts} continues, ${dels} deletions, ${corr} correspondence rows${DRY ? ' — DRY RUN' : ''}; FMA's five records + the T6 / T30 pins land through the maps (assert-overrides)`);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
