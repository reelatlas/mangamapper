import { describe, it, expect } from "vitest";
import {
  lastChapterNumber,
  episodeTypeAt,
  nextCanonEp,
  prevCanonEp,
} from "./mapping";
import type { MappingSummary } from "@/types/anime";

// A minimal but realistic summary: canon 1-10, filler 11-13, canon 14-20.
// Mirrors the common "filler desert in the middle of a run" shape.
const summary = (over: Partial<MappingSummary> = {}): MappingSummary => ({
  airedEpisodes: 20,
  sourceType: "manga",
    hasSource: true,
    hasInstrument: true,
  spans: [
    { start: 1, end: 10, type: "canon" },
    { start: 11, end: 13, type: "filler" },
    { start: 14, end: 20, type: "canon" },
  ],
  canonCount: 17,
  mixedCount: 0,
  fillerCount: 3,
  animeOnlyCount: 0,
  fillerPercent: 15,
  continueFrom: null,
  latestKnown: null,
  mangaAheadChapters: null,
  mangaAheadUnits: 0,
  ...over,
});

describe("lastChapterNumber", () => {
  it("takes the trailing chapter of a range", () => {
    expect(lastChapterNumber("1088-1089")).toBe(1089);
  });

  it("takes the last part of a comma list", () => {
    expect(lastChapterNumber("8-12,14")).toBe(14);
  });

  it("returns the number itself for a single chapter", () => {
    expect(lastChapterNumber("86")).toBe(86);
  });

  it("returns null for unparseable input rather than NaN", () => {
    expect(lastChapterNumber("")).toBeNull();
    expect(lastChapterNumber("none")).toBeNull();
  });
});

describe("episodeTypeAt", () => {
  const m = summary();

  it("reads the type from the containing span", () => {
    expect(episodeTypeAt(m, 5)).toBe("canon");
    expect(episodeTypeAt(m, 12)).toBe("filler");
    expect(episodeTypeAt(m, 20)).toBe("canon");
  });

  it("reports span boundaries inclusively", () => {
    expect(episodeTypeAt(m, 10)).toBe("canon");
    expect(episodeTypeAt(m, 11)).toBe("filler");
    expect(episodeTypeAt(m, 13)).toBe("filler");
    expect(episodeTypeAt(m, 14)).toBe("canon");
  });

  it("defaults to canon outside every span", () => {
    expect(episodeTypeAt(m, 999)).toBe("canon");
  });
});

describe("nextCanonEp / prevCanonEp", () => {
  const m = summary();

  it("steps to the adjacent episode inside a canon run", () => {
    expect(nextCanonEp(m, 5)).toBe(6);
    expect(prevCanonEp(m, 5)).toBe(4);
  });

  it("hops over the filler desert in both directions", () => {
    // 10 is the last canon before filler 11-13 -> next canon is 14
    expect(nextCanonEp(m, 10)).toBe(14);
    // 14 is the first canon after the desert -> previous canon is 10
    expect(prevCanonEp(m, 14)).toBe(10);
  });

  it("never returns a filler episode from inside the desert", () => {
    expect(nextCanonEp(m, 12)).toBe(14);
    expect(prevCanonEp(m, 12)).toBe(10);
  });

  it("returns null at the edges of the run", () => {
    expect(nextCanonEp(m, 20)).toBeNull();
    expect(prevCanonEp(m, 1)).toBeNull();
  });
});
