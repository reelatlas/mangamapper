// A10 — the sliver rule, proven on the records that ruled it (2026-08-26,
// batch 19 E3). Pure; no DB.
import { describe, expect, it } from 'vitest';
import { sliverStart, sliverEnd, statedPages, volumeUnit } from './sliver';

describe('sliverStart (A10)', () => {
  it('MHA ep 170: an 8-page leading partial of the preceding chapter IS the start', () => {
    const v = sliverStart('429 (p.3-4, 14-19), 430-432', 430);
    expect(v.start).toBe(429);
    expect(v.reason).toBe('substantive');
    expect(v.pages).toBe(8);
  });
  it('a ≤5-page tail is scraps — the start stands (oshi-no-ko 26: 84 p.17-18)', () => {
    const v = sliverStart('84 (p.17-18), 85-88', 85);
    expect(v.start).toBe(85);
    expect(v.reason).toBe('scraps');
    expect(v.pages).toBe(2);
  });
  it('sliver / flashback wording is scraps whatever the page count', () => {
    expect(sliverStart('61 (tail: recap of the fight, 12 pages), 62-64', 62).start).toBe(62);
  });
  it('wordy shares count without a page count (bokuben 6: "16 (2nd half)")', () => {
    const v = sliverStart('16 (2nd half), 18, 19', 17);
    expect(v.start).toBe(16);
    expect(v.reason).toBe('substantive');
  });
  it('exactly 6 stated pages crosses the bar (MHA 61: 117 p10-15)', () => {
    expect(sliverStart('117 (p10-15), 118, 119, 120, 121 (p1-9)', 118).start).toBe(117);
  });
  it('AoT ep 87: a far-earlier relocated opener is never the position', () => {
    const v = sliverStart('123 (first half, relocated flashback), 130 (remainder)', 130);
    expect(v.start).toBe(130);
    expect(v.reason).toBe('not-preceding');
  });
  it('an unquantified "tail" / "part" is scraps (kingdom 51: "191 (tail)")', () => {
    expect(sliverStart('191 (tail), 192-193', 192).reason).toBe('scraps');
  });
  it('a record that opens on the start itself is simply proven', () => {
    expect(sliverStart('65-67', 65).reason).toBe('lead-is-start');
  });
  it('no leading number → nothing to judge', () => {
    expect(sliverStart(null, 65).reason).toBe('no-lead');
    expect(sliverStart('vol-34 extended ending pages', 135).reason).toBe('no-lead');
  });
});

describe('statedPages', () => {
  it('sums ranges; counts singles only when no range is given', () => {
    expect(statedPages('429 (p.3-4, 14-19)')).toBe(8);
    expect(statedPages('120 (p.7-19)')).toBe(13);
    expect(statedPages('99 (opens on the tail of 98)')).toBe(0);
  });
});

describe('sliverEnd (A47 — the END-side twin, Sean 2026-09-02)', () => {
  it('one-piece-log ep 10: a 2-page tail of 618 that ep 11 starts on is ep 11\'s — END 617', () => {
    const v = sliverEnd('616 (pp. 2-17), 617 (pp. 2-17), 618 (pp. 3-4)', 618, 618);
    expect(v.end).toBe(617);
    expect(v.reason).toBe('owned-tail');
    expect(v.pages).toBe(2);
  });
  it('orient ep 12 as delivered: the tail already sits beyond END (46 with "47 (pp. 1-5)") — nothing moves', () => {
    expect(sliverEnd('43-46, 47 (pp. 1-5, teaser)', 46, 47).reason).toBe('tail-not-end');
    expect(sliverEnd('43-46, 47 (pp. 1-5, teaser)', 46, 47).end).toBe(46);
  });
  it('orient ep 12 had it been stored 47: the 5-page owned tail moves it back to 46', () => {
    expect(sliverEnd('43-46, 47 (pp. 1-5)', 47, 47).end).toBe(46);
  });
  it('a substantive straddle stays (made-in-abyss 13: 26 pp 1-11 of 16) — and a finale has no owner anyway', () => {
    expect(sliverEnd('23 pp 1-18 · 24 pp 1-16 · 25 pp 1-20 · 26 pp 1-11 of 16', 26, null).reason).toBe('no-next');
    expect(sliverEnd('264 (pp. 1-12), 265 (pp. 1-9)', 265, 265).end).toBe(265);
  });
  it('the next episode must START on the tail chapter for the tail to be owned', () => {
    expect(sliverEnd('617, 618 (pp. 3-4)', 618, 619).reason).toBe('next-not-on-end');
  });
  it('sliver / teaser wording is scraps whatever the count; an unquantified plain tail is not', () => {
    expect(sliverEnd('120, 121 (cold-open teaser)', 121, 121).end).toBe(120);
    expect(sliverEnd('120, 121', 121, 121).reason).toBe('substantive');
  });
  it('a chapter range in the note text is not a page count (kimi-ni-todoke 38, detective-conan 510)', () => {
    expect(sliverEnd('45, 46 — 44-45 skipped', 46, 46).reason).toBe('substantive');
    expect(sliverEnd('637, 638 (opening of the 638-640 paper-airplane case)', 638, 638).reason).toBe('substantive');
    expect(sliverEnd('312 (pp. 1-18), 313 (p.1-4)', 313, 313).end).toBe(312);
  });
  it('a tail that is the episode\'s ONLY record never moves (d-gray-man 66: one page of 78; reborn 159: a sliver of 232)', () => {
    expect(sliverEnd('78 (approx. p13 only)', 78, 78).reason).toBe('sole-segment');
    expect(sliverEnd('232 (sliver; mostly anime-original baseball)', 232, 232).end).toBe(232);
  });
  it('a whole trailing range is never a scrap', () => {
    expect(sliverEnd('598-599', 599, 599).reason).toBe('tail-not-end');
  });
});

describe('the VOLUME vocabulary (T24, the re-zero landing 2026-09-07 — a novel owner anchored in LN volumes)', () => {
  it('reads the volume of a vN segment and nothing inside it', () => {
    expect(volumeUnit('v20 ch 7 (from the proposal to the chapter\'s end)')).toBe(20);
    expect(volumeUnit('v22 ch 2-ch 4 (an added conversation)')).toBe(22);
    expect(volumeUnit('vol 21 prologue')).toBe(21);
    expect(volumeUnit('84 (p.17-18)')).toBeNull();
  });
  it('sliverStart: a lead on the START volume is the start; a leading partial of the preceding volume counts unless its wording says scraps — chapters are not pages', () => {
    expect(sliverStart('v20 ch 7 (from the proposal to the chapter\'s end), v21 prologue, v21 ch 1', 20).reason).toBe('lead-is-start');
    expect(sliverStart('v18 ch 5, v19 prologue, v19 ch 1-2', 19)).toMatchObject({ start: 18, reason: 'substantive', pages: 0 });
    expect(sliverStart('v18 ch 5 (a teaser of the arc to come), v19 prologue', 19)).toMatchObject({ start: 19, reason: 'scraps' });
  });
  it('sliverEnd: a volume-space tail on the END that the next episode starts on stays unless its wording says scraps; a tail on another volume never moves the END', () => {
    expect(sliverEnd('v23 ch 5, v23 ch 6, v24 ch 1 (the closing respawn beat only)', 24, 24).reason).toBe('substantive');
    expect(sliverEnd('v23 ch 5, v23 ch 6, v24 ch 1 (a teaser of the next volume)', 24, 24)).toMatchObject({ end: 23, reason: 'owned-tail' });
    expect(sliverEnd('v23 ch 5, v23 ch 6, v24 ch 1 (the closing respawn beat only)', 23, 24).reason).toBe('tail-not-end');
    expect(sliverEnd('v20 ch 1, v20 ch 6-7 (ch 7 unfinished — ep 67 continues in it)', 20, 20).reason).toBe('substantive');
    // re-zero 59: the END volume is carried by the body ('v19 prologue, v19 ch 1-2'); a scrap-worded tail of the SAME volume never moves it
    expect(sliverEnd('v18 ch 5, v19 prologue, v19 ch 1-2, v19 ch 6 (out-of-order fragment)', 19, 19).reason).toBe('substantive');
    expect(sliverEnd('v18 ch 5, v19 ch 6 (out-of-order fragment)', 19, 19)).toMatchObject({ end: 18, reason: 'owned-tail' });
  });
});
