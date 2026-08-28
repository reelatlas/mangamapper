// N11 resort (batch 20 wave 3, shugo-chara): the source's numbering inside a
// span is wrong as a sequence; rows are renumbered by payload position. Fixture
// = the verified identity table (verify/shugo-chara.md): AFL skips 73,
// transposes 75/76, 83/84, 90/91, prints 96 twice. Pure; no DB.
import { describe, expect, it } from 'vitest';
import { applyNumberingShift, SOURCE_NUMBERING_SHIFTS, type Shift } from './rulings/numbering-shifts';

// AFL payload rows 72-97 in PAGE ORDER (number | true-date | true episode) — from the identity table
const AFL: { number: number; air_date: string; title: string; type: string; want: number }[] = [
  { number: 72, air_date: '2009-02-28', title: '激震！おばあさま登場!!', type: 'filler', want: 72 },
  { number: 74, air_date: '2009-03-07', title: '(秘)！仲直りのレシピ？', type: 'filler', want: 73 },
  { number: 75, air_date: '2009-03-21', title: 'バレた!?歌唄が家にやってきた！', type: 'canon', want: 75 },
  { number: 76, air_date: '2009-03-14', title: 'どっきどきのホワイトデー！', type: 'canon', want: 74 },
  { number: 77, air_date: '2009-03-28', title: '新たなる敵!?月夜のバトル！', type: 'canon', want: 76 },
  { number: 78, air_date: '2009-04-04', title: '衝撃！壊された初デート!?', type: 'canon', want: 77 },
  { number: 79, air_date: '2009-04-11', title: 'あむちゃんのなが～い一日!?', type: 'canon', want: 78 },
  { number: 80, air_date: '2009-04-18', title: 'イクトとあむ 悲しみのバトル！', type: 'canon', want: 79 },
  { number: 81, air_date: '2009-04-25', title: '信じるキモチ！プラチナハート！', type: 'canon', want: 80 },
  { number: 82, air_date: '2009-05-02', title: '潜入！イースター社!?', type: 'canon', want: 81 },
  { number: 83, air_date: '2009-05-16', title: 'すれちがいの音楽博覧会？', type: 'canon', want: 83 },
  { number: 84, air_date: '2009-05-09', title: '熱闘！私がエースになる！', type: 'canon', want: 82 },
  { number: 85, air_date: '2009-05-23', title: '二階堂先生は先生だったぁ!?', type: 'canon', want: 84 },
  { number: 86, air_date: '2009-05-30', title: 'ち～す！噂のギャル登場!!', type: 'filler', want: 85 },
  { number: 87, air_date: '2009-06-06', title: '響け歌声！あの日のあたしに!!', type: 'canon', want: 86 },
  { number: 88, air_date: '2009-06-13', title: 'ナナを救え！しゅごキャラナース出動？', type: 'canon', want: 87 },
  { number: 89, air_date: '2009-06-20', title: '激突！ナゾたま大暴走！', type: 'canon', want: 88 },
  { number: 90, air_date: '2009-07-04', title: '伝えたい！このキモチ！', type: 'canon', want: 90 },
  { number: 91, air_date: '2009-06-27', title: '心、わかりあえて。', type: 'canon', want: 89 },
  { number: 92, air_date: '2009-07-11', title: '全開！僕のリズム！', type: 'canon', want: 91 },
  { number: 93, air_date: '2009-07-18', title: 'クールに決めろ！ビートジャンパー！', type: 'canon', want: 92 },
  { number: 94, air_date: '2009-07-25', title: 'ほしな歌唄、未来への飛翔！', type: 'canon', want: 93 },
  { number: 95, air_date: '2009-08-01', title: '進め！みけねこ捜索隊!?', type: 'canon', want: 94 },
  { number: 96, air_date: '2009-08-08', title: 'りまとやや、真珠の絆！', type: 'canon', want: 95 }, // AFL's FIRST 96 — the row the old parser dropped
  { number: 96, air_date: '2009-08-15', title: '届かない声、くだかれる思い。', type: 'canon', want: 96 },
  { number: 97, air_date: '2009-08-22', title: '唯世とイクト、運命のホロスコープ！', type: 'canon', want: 97 },
];

describe('N11 resort — shugo-chara (the identity table)', () => {
  const t = SOURCE_NUMBERING_SHIFTS['shugo-chara'];
  it('the entry is the ruled span 74-96 → 73 on the afl space', () => {
    expect(t.resort).toEqual({ from: 74, to: 96, start: 73 });
    expect(t.spaces).toEqual(['afl']);
  });
  it('renumbers by POSITION in date order: 74-95 → 73-94 with 75/83/90 keeping their own numbers, the doubled 96 → 95 and 96, 72 / 97 untouched, titles travel with rows', () => {
    const out = applyNumberingShift(t, AFL.map(({ want, ...r }) => r));
    expect(out.map((r) => r.number)).toEqual(AFL.map((r) => r.want));
    // the two 96s are two episodes, both kept, in payload order
    expect(out.find((r) => r.number === 95)?.title).toBe('りまとやや、真珠の絆！');
    expect(out.find((r) => r.number === 96)?.title).toBe('届かない声、くだかれる思い。');
    // the three transposed pairs: true order restored — dates ascend through the span (the identity table's TRUE dates)
    const span = out.filter((r) => r.number >= 73 && r.number <= 96).sort((a, b) => a.number - b.number).map((r) => r.air_date);
    expect([...span].sort()).toEqual(span);
    expect(out).toHaveLength(AFL.length);
  });
  it('resolves the REAL staged payload too: the year-off 2010 block (92-96) sits at the span\'s end and the 88/89 date tie keeps payload order', () => {
    // as staged 2026-08-27 (ingest_afl_shows raw): AFL numbers, AFL dates (88 = 06-20 duplicate of 89; 92-100 a year off) — G53 fixes the dates after translation
    const staged = [
      [74, '2009-03-07'], [75, '2009-03-21'], [76, '2009-03-14'], [77, '2009-03-28'], [78, '2009-04-04'], [79, '2009-04-11'], [80, '2009-04-18'], [81, '2009-04-25'], [82, '2009-05-02'],
      [83, '2009-05-16'], [84, '2009-05-09'], [85, '2009-05-23'], [86, '2009-05-30'], [87, '2009-06-06'], [88, '2009-06-20'], [89, '2009-06-20'], [90, '2009-07-04'], [91, '2009-06-27'],
      [92, '2010-07-01'], [93, '2010-07-18'], [94, '2010-07-25'], [95, '2010-08-01'], [96, '2010-08-08'], [96, '2010-08-15'], [97, '2010-08-22'],
    ] as [number, string][];
    const out = applyNumberingShift(t, staged.map(([number, air_date], i) => ({ number, air_date, type: 'canon', pos: i })));
    const byPos = new Map(out.map((r) => [r.pos, r.number]));
    // AFL 75 (03-21) → 75 and AFL 76 (03-14) → 74; 83 (05-16) → 83, 84 (05-09) → 82; 90 (07-04) → 90, 91 (06-27) → 89
    expect([byPos.get(1), byPos.get(2)]).toEqual([75, 74]);
    expect([byPos.get(9), byPos.get(10)]).toEqual([83, 82]);
    expect([byPos.get(16), byPos.get(17)]).toEqual([90, 89]);
    // the 88/89 tie: payload order kept (AFL 88 → 87, AFL 89 → 88)
    expect([byPos.get(14), byPos.get(15)]).toEqual([87, 88]);
    // the doubled 96: first → 95, second → 96; 97 untouched
    expect([byPos.get(22), byPos.get(23), byPos.get(24)]).toEqual([95, 96, 97]);
    expect(out).toHaveLength(25);
  });
  it('is idempotent on already-true numbering outside the span and never touches 97+', () => {
    const out = applyNumberingShift(t, [{ number: 97, type: 'canon' }, { number: 100, type: 'canon' }]);
    expect(out.map((r) => r.number)).toEqual([97, 100]);
  });
});

describe('applyNumberingShift — the old parser dedup lives here now', () => {
  it('collapses an exact same-number + same-type duplicate keeping the first (Boruto ep 182) and keeps differing types for the integrity check', () => {
    const none: Shift = { drop: [], shifts: [] };
    const out = applyNumberingShift(none, [{ number: 182, type: 'canon', t: 'a' }, { number: 182, type: 'canon', t: 'b' }, { number: 183, type: 'canon', t: 'c' }, { number: 183, type: 'filler', t: 'd' }]);
    expect(out.map((r) => `${r.number}${r.t}`)).toEqual(['182a', '183c', '183d']);
  });
  it('drop and shifts keep their semantics (5D\'s shape: drop 83, −1 from 84)', () => {
    const out = applyNumberingShift({ drop: [83], shifts: [{ from: 84, offset: -1 }] }, [{ number: 82 }, { number: 83 }, { number: 84 }, { number: 85 }]);
    expect(out.map((r) => r.number)).toEqual([82, 83, 84]);
  });
});
