// AFG continua parser (G22 frontier / G38 re-derive) — proven on the staged
// sentences that broke it (batch 19 wave 2, 2026-08-27): AFG annotates
// partial chapters with page groups — "Chapter 104 (p. 23-36), 105 … and 108
// (p. 1-19) of the manga" — and the old lazy `[^.]*?` capture stopped at the
// "." in "p.", rendering a too-low frontier (solo-leveling 104 for AFG's own
// 108) on 26 served series. Two invariants: a "." followed by digits is not a
// sentence end; page parentheticals are stripped before the max (page
// numbers are never chapters — the ao-haru-ride 19 lesson from the first
// draft). Pure; no DB. Every row below is a verbatim staged sentence and the
// continue-from AFG prints next to it (the G22 self-consistency witness).
import { describe, expect, it } from 'vitest';
import { parseContinua, stripParentheticals } from './afg';

const wrap = (sentence: string, cont: number | null) =>
  `<div class="continua-manga"><table><tr><td>Where to start Foo manga after the anime? ` +
  `The anime ended at episode 12 of Season 1, which ${sentence}` +
  (cont === null ? '' : ` You should start reading from Chapter ${cont}.`) +
  `</td></tr></table>`;

describe('parseContinua — page parentheticals (G22)', () => {
  it.each([
    ['100-man-no-inochi-no-ue-ni-ore-wa-tatteiru', "corresponds to Chapter 24 (p. 33-35) and 25 of the manga", 25, 26],
    ['ahiru-no-sora', "corresponds to Chapter 138 (p. 47-54), 139, 140, 141, 145 and 146 of the manga", 146, 147],
    ['akame-ga-kill', "corresponds to Chapter 36 (p. 31-41), 37 and 38 of the manga", 38, 39],
    ['bleach', "corresponds to Chapter 668 (p. 3-17), 669, 670, 671, 672 (p. 1-6), 673 (p. 1-4), 674 (p. 7-17) and 676 of the manga", 676, 677],
    ['blue-box', "corresponds to Chapter 77 (p. 14-19), 78, 79 and 80 of the manga", 80, 81],
    ['blue-period', "equivalent to Chapter 24 (p. 4-48) and 25 (p. 2, 6-13, 17-50) of the manga", 25, 26],
    ['bokura-wa-minna-kawaisou', "equivalent to Chapters 34 (p. 4-19), 35 and 36 (p. 1-19) of the manga", 36, 36],
    ['chainsaw-man', "corresponds to Chapter 35 (p. 7-19) 36, 37 and 38 (p. 1-22) of the manga", 38, 38],
    ['claymore', "corresponds to Chapters 54 (pp. 26-30), 55 and 56 , which is where the anime leave off.", 56, 57],
    ['deadman-wonderland', "corresponds to Chapters 19 (pp. 21-47), 20 and 21 , which is where the anime leave off.", 21, 22],
    ['dorohedoro', "corresponds to Chapter 34 (p. 1-8), 39, 40 (p. 1-13, 22-24), 41 (p. 1-19, 21) and 42 (p. 3-6, 11, 14, 16) of the manga", 42, 42],
    ['fuuka', "equivalent to Chapter 24 (p. 14-18), 25 and 26 of the manga", 26, 27],
    ['gachiakuta', "corresponds to Chapter 84 (p. 7-19), 85, 86 and 87 of the manga", 87, 88],
    ['hunter-x-hunter-2011', "corresponds to Chapter 338 (p. 6-17) and 339 of the manga", 339, 340],
    ['jigokuraku', "corresponds to Chapter 71 (p. 1-3), 86, 87 (p. 14-19), 88, 89 y 94 (p. 11-14) of the manga", 94, 90],
    ['kaiju-no-8', "corresponds to Chapter 75 (p. 12-19), 76, 77, 78, 81 (p 5-21) and 82 of the manga", 82, 83],
    ['kakkou-no-iinazuke', "corresponds to Chapter 108 (p. 16-19), 110, 111, 112 and 114 (p. 18) of the manga", 114, 113],
    ['kekkon-yubiwa-monogatari', "equivalent to Chapter 29 (p. 13-40), 30 and 31 of the manga", 31, 32],
    ['kishuku-gakkou-no-juliet', "corresponds to Chapter 17 (p. 27-37), 18 and 19 (p. 1-5) of the manga", 19, 19],
    ['mato-seihei-no-slave', "corresponds to Chapter 82 (p. 15-17), 83, 84, 85 and 86 of the manga", 86, 87],
    ['mokushiroku-no-yonkishi', "equivalent to Chapter 55 (p. 2-22) ,56, 57 and 58 (p. 17-22) of the manga", 58, 58],
    ['my-hero-academia-vigilantes', "corresponds to Chapter 57 (p. 9-19), 58 and 66 of the manga", 66, 67],
    ['one-punch-man', "corresponds to Chapter 111, 112, 113 (p. 26-46), 114, 115 and 116 (p. 11-12; 22-27) of the manga", 116, 117],
    ['ore-monogatari', "corresponds to Chapters 33 (p. 16-40), 34 and 35 (*) , which is where the anime leave off.", 35, 36],
    ['oshi-no-ko', "corresponds to Chapter 119, 120 (p.1-7, 13-18), 121, 122, 123, 124, 125, 126 and 127 (p. 1-12) of the manga", 127, 127],
    ['ragna-crimson', "corresponds to Chapter 54 (p. 28-54), 55 and 56 of the manga", 56, 57],
    ['saikin-yatotta-maid-ga-ayashii', "equivalent to Chapter 25 (p. 8-17), 26 and 30 of the manga", 30, 27],
    ['solo-leveling', "corresponds to Chapter 104 (p. 23-36), 105, 106, 107 and 108 (p. 1-19) of the manga", 108, 108],
    ['soul-eater', "corresponds to Chapter 36 (p. 24-41) and 37 (p. 1-30) of the manga", 37, 37],
    ['the-case-study-of-vanitas', "corresponds to Chapter 53 (p. 29-35), 54, 54.5, 55, 55.5 of the manga", 55, 56],
    ['the-summer-hikaru-died', "corresponds to Chapter 24 (p. 9-10, 21-29) and 26 (p. 4-30) of the manga", 26, 27],
    ['twin-star-exorcists', "corresponds to Chapter 14 (p. 32-43) and 15 of the manga", 15, 16],
    ['witch-watch', "corresponds to Chapter 51 (p. 9-19), 53 and 52 (p. 4-21) of the manga", 53, 99],
    ['youkoso-jitsuryoku-shijou-shugi-no-kyoushitsu-e', "corresponds to Chapters 63 (p. 13-15), 64, 65, 66, 67 , 68, 69, 70, 71 and 72 , which is the last one published.", 72, null],
    ['yubisaki-to-renren', "corresponds to Chapter 20, 20.5 and 21 (p. 1-35) of the manga", 21, 21],
    ['zom-100-zombie-ni-naru-made-ni-shitai-100-no-koto', "corresponds to Chapter 20 (p. 32-44), 21 and 22 of the manga", 22, 23],
  ])('%s → frontier %d', (_slug, sentence, endChapter, cont) => {
    const c = parseContinua(wrap(sentence, cont));
    expect(c?.endChapter).toBe(endChapter);
    expect(c?.continueChapter).toBe(cont);
  });

  it('a plain list still parses (the pre-2026-08-27 shape)', () => {
    expect(parseContinua(wrap('corresponds to Chapter 150, 151, 152, 153, 154 and 155 of the manga.', 156))?.endChapter).toBe(155);
  });
  it('a "." followed by digits is not a sentence end; page numbers larger than any chapter never win', () => {
    expect(parseContinua(wrap('corresponds to Chapter 17 (p. 27-37), 18 and 19 (p. 1-5) of the manga.', 19))?.endChapter).toBe(19);
    expect(parseContinua(wrap('corresponds to Chapter 19 (p. 300-340) of the manga.', 20))?.endChapter).toBe(19);
  });
  it('stripParentheticals drops every parenthetical, nested-free', () => {
    expect(stripParentheticals('104 (p. 23-36), 105 and 108 (p. 1-19)').match(/\d+/g)).toEqual(['104', '105', '108']);
  });
});
