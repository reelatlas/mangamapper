import { describe, it, expect } from "vitest";
import {
  canonEpToCh,
  canonEpStartCh,
  inReorderCrossing,
} from "./mapping";
import type {
  AnimeSeries,
  Episode,
  MappingSummary,
  EpisodeSpan,
} from "@/types/anime";

// ── fixtures ────────────────────────────────────────────────────────────────

const episode = (
  number: number,
  chapters: string | null,
  type: Episode["type"] = "canon",
): Episode => ({
  number,
  title: `Episode ${number}`,
  type,
  mangaMapping: chapters === null ? null : { volume: null, chapters },
  airDate: "2020-01-01",
});

const series = (episodes: Episode[], over: Partial<AnimeSeries> = {}): AnimeSeries => ({
  id: "test",
  title: "Test",
  japaneseTitle: "Test",
  coverImage: "",
  currentEpisode: episodes.length,
  totalEpisodes: episodes.length,
  status: "finished",
  mangaStatus: "finished",
  hasManga: true,
  totalVolumes: 10,
  totalChapters: 100,
  mangaStartVolume: null,
  mangaStartChapter: null,
  episodes,
  ranking: {} as AnimeSeries["ranking"],
  streamingOn: [],
  genres: [],
  synopsis: "",
  ...over,
});

const mapping = (
  spans: EpisodeSpan[],
  latestKnown: MappingSummary["latestKnown"],
  over: Partial<MappingSummary> = {},
): MappingSummary => {
  const aired = Math.max(...spans.map((s) => s.end));
  const count = (t: string) =>
    spans.filter((s) => s.type === t).reduce((n, s) => n + s.end - s.start + 1, 0);
  return {
    airedEpisodes: aired,
    sourceType: "manga",
    hasSource: true,
    hasInstrument: true,
    spans,
    canonCount: count("canon"),
    mixedCount: count("mixed"),
    fillerCount: count("filler"),
    tailBadge: "manga only",
    sourceLabel: "manga",
    fillerPercent: 0,
    continueFrom: null,
    latestKnown,
    mangaAheadChapters: null,
    mangaAheadUnits: 0,
    ...over,
  };
};

// ── tests ───────────────────────────────────────────────────────────────────

describe("canonEpToCh — anchored interpolation", () => {
  it("returns an anchor's own chapter exactly", () => {
    const eps = [episode(1, "1-5"), episode(2, null), episode(3, "6-10")];
    const m = mapping([{ start: 1, end: 3, type: "canon" }], { episode: 3, volume: null, chapters: "10" });
    expect(canonEpToCh(series(eps), m, 1)).toBe(5);
    expect(canonEpToCh(series(eps), m, 3)).toBe(10);
  });

  it("interpolates between two confirmed points", () => {
    // ep1 -> 10, ep5 -> 50; ep3 sits midway, so ~30
    const eps = [episode(1, "10"), episode(2, null), episode(3, null), episode(4, null), episode(5, "50")];
    const m = mapping([{ start: 1, end: 5, type: "canon" }], { episode: 5, volume: null, chapters: "50" });
    expect(canonEpToCh(series(eps), m, 3)).toBe(30);
  });

  it("refuses to extrapolate past the last confirmed point", () => {
    // Sean's Kenshin rule: canon episodes beyond the frontier may adapt side
    // stories or nothing -- an estimate there is a fabrication, not a guess.
    const eps = [episode(1, "1-5"), episode(2, "6-10"), episode(3, null), episode(4, null)];
    const m = mapping([{ start: 1, end: 4, type: "canon" }], { episode: 2, volume: null, chapters: "10" });
    expect(canonEpToCh(series(eps), m, 4)).toBeNull();
  });

  it("skips filler when counting toward a chapter", () => {
    // Filler 3-4 occupies no chapter space: ep5 is the 3rd CANON episode.
    const eps = [episode(1, "10"), episode(2, null), episode(3, null, "filler"),
                 episode(4, null, "filler"), episode(5, "30")];
    const m = mapping(
      [{ start: 1, end: 2, type: "canon" }, { start: 3, end: 4, type: "filler" }, { start: 5, end: 5, type: "canon" }],
      { episode: 5, volume: null, chapters: "30" },
    );
    expect(canonEpToCh(series(eps), m, 5)).toBe(30);
  });
});

describe("canonEpStartCh — display shows the FIRST chapter animated", () => {
  // Sean's 2026-08-23 ruling: a row anchors where it STARTS in the manga.
  it("derives start as the previous episode's end + 1", () => {
    const eps = [episode(1, "1-5"), episode(2, "6-10")];
    const m = mapping([{ start: 1, end: 2, type: "canon" }], { episode: 2, volume: null, chapters: "10" });
    expect(canonEpStartCh(series(eps), m, 2)).toBe(6);
  });

  it("clamps the start to this episode's own end when both share a chapter", () => {
    // prevEnd+1 would be 11, but ep2 itself ends at 10 -- the shared chapter
    // is shown rather than a start that runs past the row's own end.
    const eps = [episode(1, "10"), episode(2, "10")];
    const m = mapping([{ start: 1, end: 2, type: "canon" }], { episode: 2, volume: null, chapters: "10" });
    expect(canonEpStartCh(series(eps), m, 2)).toBe(10);
  });

  it("starts the first episode at the entry's scope start, not chapter 1", () => {
    // A sequel entry scoped mid-manga (Bleach TYBW opens at ch 480).
    const eps = [episode(1, "485")];
    const m = mapping([{ start: 1, end: 1, type: "canon" }], { episode: 1, volume: null, chapters: "485" });
    const s = series(eps, { mangaStartChapter: 480, totalChapters: 686 });
    expect(canonEpStartCh(s, m, 1)).toBe(480);
  });
});

describe("inReorderCrossing — jumped-back adaptation order", () => {
  it("flags an unanchored episode spanning a back-jump", () => {
    // MHA's shape: a later episode adapts EARLIER chapters (241-252 aired
    // before 218-240). No formula may speak for the gap between them.
    const eps = [episode(1, "252"), episode(2, null), episode(3, "240")];
    const m = mapping([{ start: 1, end: 3, type: "canon" }], { episode: 3, volume: null, chapters: "240" });
    expect(inReorderCrossing(series(eps), m, 2)).toBe(true);
    expect(canonEpToCh(series(eps), m, 2)).toBeNull();
  });

  it("a successor whose START reaches back past the predecessor's END is a reorder even when its END re-touches the envelope (beelzebub 51, batch 22 wave 2)", () => {
    // ep 47 reached 115; ep 51 = 114-115 (ch 115's opening aired first, in 46/47; ep 51 goes back to 114 — A42 rearranged);
    // 48 and 50 are unanchored canon rows between them, 49 is mixed + off-source: they are holes (A18), never 115 / 114 painted by a formula
    const eps = [episode(47, "115"), episode(48, null), episode(49, null, "mixed"), episode(50, null), episode(51, "114-115")];
    const m = mapping([{ start: 47, end: 51, type: "canon" }], { episode: 51, volume: null, chapters: "114-115" });
    const s = series(eps);
    expect(inReorderCrossing(s, m, 48)).toBe(true);
    expect(inReorderCrossing(s, m, 50)).toBe(true);
    expect(canonEpToCh(s, m, 48)).toBeNull();
    expect(canonEpStartCh(s, m, 50)).toBeNull();
    expect(canonEpToCh(s, m, 51)).toBe(115); // the exact row resolves to its own point
    expect(canonEpToCh(s, m, 47)).toBe(115); // the predecessor is untouched
  });

  it("a shared chapter (successor START = predecessor END) is bridgeable — two episodes may share a chapter", () => {
    const eps = [episode(1, "10"), episode(2, null), episode(3, "10-12")];
    const m = mapping([{ start: 1, end: 3, type: "canon" }], { episode: 3, volume: null, chapters: "10-12" });
    expect(inReorderCrossing(series(eps), m, 2)).toBe(false);
    expect(canonEpToCh(series(eps), m, 2)).toBe(11);
  });

  it("does not flag a normal forward run", () => {
    const eps = [episode(1, "10"), episode(2, null), episode(3, "30")];
    const m = mapping([{ start: 1, end: 3, type: "canon" }], { episode: 3, volume: null, chapters: "30" });
    expect(inReorderCrossing(series(eps), m, 2)).toBe(false);
  });
});
