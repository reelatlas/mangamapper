// The T26 adoption sitting — apply (Sean ruled 2026-09-05, T26-SITTING.md).
// The RULINGS land through the maps (T6 pins, STANDING_ANNOTATIONS, source-chains,
// retired-annotations) and the healer (assert-overrides). This script does the
// one thing the maps cannot: the RESEARCH-ORIGIN side_source rows keep their
// origin (P8 — a research row is a batch apply's, never the map's) and get
// (a) the work LABEL (I41 convention: chapters starts '<work>: …') and
// (b) a note that no longer states Line A ('canon relative to …').
//   npx tsx --env-file=.env.ingest scripts/ingest/research/batch22/apply-t26.ts [--dry-run]
import { db, selectAll } from '../../lib/db';
import { upsertAnnotation } from '../../lib/annotations';

const DRY = process.argv.includes('--dry-run');
const SIT = 'FILLER + side_source (T26, the adoption sitting — Sean 2026-09-05, research/batch22/T26-SITTING.md: a licence is not adoption)';

// research-origin rows: [series, episodes, label, the Line-A clause to replace, its replacement]
const ROWS: [string, number[], string, RegExp, string][] = [
  ['naruto-shippuden', [484, 485, 486, 487, 488], 'Sasuke Shinden: Book of Sunrise — the licensed novel (Shin Towada, ill. Kishimoto; Naruto Shinden vol 3)', /canon relative to (the franchise's )?licensed side source[^.]*\./i, SIT + '.'],
  ['naruto-shippuden', [489, 490, 491, 492, 493], 'Shikamaru Hiden: A Cloud Drifting in Silent Darkness — the licensed novel (Takashi Yano, ill. Kishimoto; Naruto Hiden)', /canon relative to (the franchise's )?licensed side source[^.]*\./i, SIT + '.'],
  ['naruto-shippuden', [494, 495, 496, 497, 498, 499, 500], 'Konoha Hiden: The Perfect Day for a Wedding — the licensed novel (Shō Hinata, ill. Kishimoto; Naruto Hiden)', /canon relative to (the franchise's )?licensed side source[^.]*\./i, SIT + '.'],
  ['dragon-ball-super', [6], "Battle of Gods: the 2013 film 『ドラゴンボールZ 神と神』 (脚本 渡辺雄介; 原作・ストーリー 鳥山明)", /$/, ''],
  ['beelzebub', [49], '', /$/, ''],
];

async function main() {
  let n = 0;
  for (const [sid, eps, label, lineA, repl] of ROWS) {
    const rows = await selectAll<{ episode: number; kind: string; chapters: string | null; note: string | null; origin: string | null }>('episode_annotations', 'episode, kind, chapters, note, origin', (q) => q.eq('series_id', sid).eq('kind', 'side_source').in('episode', eps));
    for (const r of rows) {
      if (r.origin === 'ruling') { console.log(`  ${sid} ep${r.episode}: ruling-origin — the map owns it, skipped`); continue; }
      const chapters = label ? (r.chapters && /^[^:]{2,60}:/.test(r.chapters) ? r.chapters : label) : r.chapters;
      let note = r.note ?? '';
      if (lineA.source !== '(?:)' && lineA.test(note)) note = note.replace(lineA, repl);
      else if (!/T26, the adoption sitting/.test(note)) note = `${SIT}. ${note}`;
      if (sid === 'dragon-ball-super' && r.episode === 6) note = `${note} SITTING NOTE (2026-09-05): the 脚本 check FAILED — Battle of Gods' screenplay is 渡辺雄介; Toriyama is credited 原作・ストーリー・キャラクターデザイン (Toei's staff page https://lineup.toei-anim.co.jp/ja/movie/2013_dragonballz/staff/ ; ja-WP 神と神). A ストーリー credit is not the Resurrection 'F' 原作・脚本 act, so no adopted{author} is stamped; the writer default makes the row filler + side_source. Sean's open call: T30's load-bearing test on the shared Battle of Gods arc (A46), queued with the narrow wave.`.replace(/\s+SITTING NOTE/, ' SITTING NOTE');
      if (chapters === r.chapters && note === r.note) { console.log(`  ${sid} ep${r.episode}: unchanged`); continue; }
      n++;
      console.log(`  ${sid} ep${r.episode}: label ${r.chapters ? 'kept' : 'SET'} · note ${note === r.note ? 'kept' : 'rewritten'}${DRY ? '' : ' → written'}`);
      if (!DRY) await upsertAnnotation({ series_id: sid, episode: r.episode, kind: 'side_source', chapters, note, origin: 'research' });
    }
  }
  console.log(`[apply-t26] ${n} research-origin side_source rows ${DRY ? 'would be' : ''} updated${DRY ? ' — DRY RUN' : ''}`);
  if (!DRY) { const { error } = await db.from('series').update({ asterisk_review: 'pending' }).in('id', ['naruto-shippuden', 'dragon-ball-super', 'beelzebub']).is('asterisk_review', null); if (error) throw new Error(error.message); }
}
main().then(() => process.exit(0));
