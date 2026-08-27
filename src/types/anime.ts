// T27: the standing vocabulary is exactly canon | mixed | filler (relative to
// the series' source, T25). 'anime-only-canon' was retired from data in T4.3
// and from the display in T4.5 (2026-08-26).
export type EpisodeType = 'canon' | 'mixed' | 'filler';

import type { SourceKindValue } from '../../scripts/ingest/lib/rulings/source-kinds';

// The stored vocabulary IS the SOURCE_KINDS registry (rule T25) — never a
// second list here. null = AniList named a source the registry does not
// cover (fails closed; series_without_source_kind is the ruling queue).
export type SourceType = SourceKindValue;

// A contiguous run of episodes sharing one type — the unit of the filler density strip
export interface EpisodeSpan {
  start: number; // inclusive episode number
  end: number;   // inclusive
  type: EpisodeType;
}

// Where to pick up the source material after the latest aired episode
export interface ContinuePoint {
  episode: number;          // the episode this continue point is relative to
  volume: number | null;
  chapters: string | null;  // e.g. "1093"
}

// Per-series summary powering the comparison-first UI
export interface MappingSummary {
  airedEpisodes: number;
  sourceType: SourceType | null;
  /** an adapted work exists — false for studio originals and unruled kinds (T25) */
  hasSource: boolean;
  /** there are units to map to (chapter / volume) — tail math, strip and manga position only when true (T25) */
  hasInstrument: boolean;
  spans: EpisodeSpan[];
  canonCount: number;
  mixedCount: number;
  fillerCount: number;
  fillerPercent: number;          // 0-100, rounded
  /** T25/T19: the `{noun} only` badge for the unadapted tail ('manga only', 'novel only'…); null when the source has no instrument */
  tailBadge: string | null;
  /** T25/T19: the series label for the source kind ('studio original' for originals; else the noun) — stored for the UI pass */
  sourceLabel: string;
  continueFrom: ContinuePoint | null; // null when there is no source material
  latestKnown: ContinuePoint | null;  // latest episode with a confirmed manga mapping
  // Canon source material never (or not yet) animated — the manga_only zone
  mangaAheadChapters: number | null;  // published chapters beyond anime coverage
  mangaAheadUnits: number;            // same, in episode-equivalents (for strip proportions)
}

export type AnimeStatus = 'airing' | 'finished' | 'hiatus' | 'upcoming';
export type MangaStatus = 'publishing' | 'finished' | 'hiatus' | 'none'; // 'none' = no source publication attached (T22; was the 'anime_only' homonym)

export type TrackingSite = 'mal' | 'anilist';
export type StreamingService = 'all' | 'crunchyroll' | 'netflix' | 'amazon' | 'disney-hulu' | 'bilibili' | 'hidive';

export const TRACKING_SITES: { value: TrackingSite; label: string }[] = [
  { value: 'mal', label: 'MAL' },
  { value: 'anilist', label: 'AniList' },
];

export const STREAMING_SERVICES: { value: StreamingService; label: string }[] = [
  { value: 'all', label: 'all' },
  { value: 'crunchyroll', label: 'crunchyroll' },
  { value: 'netflix', label: 'netflix' },
  { value: 'amazon', label: 'prime video' },
  { value: 'disney-hulu', label: 'disney+/hulu' },
  { value: 'bilibili', label: 'bilibili' },
  { value: 'hidive', label: 'hidive' },
];

export interface MangaMapping {
  // null when the source knows the chapter but not the volume (AFG anchors);
  // display sites render the vol: segment conditionally.
  volume: number | null;
  chapters: string; // e.g., "1-3" or "45"
  // The episode's OWN first chapter when the record states it. `chapters`
  // alone is ambiguous — a bare "86" means either "single-chapter episode,
  // exactly ch 86" or "only the end is known, derive the start" — and guessing
  // wrong is visible inside a reorder regime, where derivation from neighbours
  // is meaningless (Sean's Gintama ep-35 report, 2026-08-24: an exact ch-86
  // record rendered as ch 48 because the derivation walked backwards into a
  // jumped block). null/absent = genuinely unknown, derive.
  start?: number | null;
}

export interface WatchOrderEntry {
  position: number;       // fractional sort position in the episode flow (171, 171.5)
  label: string;          // the ruled surface label ("170+1", "170+1.5")
  title: string;
  airDate: string | null;
  kind: string | null;    // special / ova / movie …
  chapter: number | null; // what it adapts (end position)
  volume: number | null;
  chaptersAdapted: string | null;
}

export interface Episode {
  number: number;
  title: string;
  type: EpisodeType;
  mangaMapping: MangaMapping | null; // null for filler and off-source rows
  airDate: string;
  /** T26: canon by ruling but outside the source (adopted / side_source annotation) — no source position exists, render the honest dash */
  offSource?: boolean;
  /** T29: the format axis (tv / ova / special / movie / recap), independent of type; null = not yet derivable. Stored now, surfaced at the UI pass. */
  format?: 'tv' | 'ova' | 'special' | 'movie' | 'recap' | null;
}

export interface TrackingRanking {
  mal: number;      // MAL popularity rank for currently airing
  anilist: number;  // AniList popularity rank for currently airing
}

export interface AnimeSeries {
  id: string;
  title: string;
  japaneseTitle: string;
  coverImage: string;
  currentEpisode: number;
  totalEpisodes: number | null;
  status: AnimeStatus;
  mangaStatus: MangaStatus;
  hasManga: boolean;
  // SOURCE SCOPE: the range of the source material THIS series entry adapts.
  // A franchise split into distinct series (Naruto → Shippuden) is separate
  // entries, each scoped to its own portion — never lumped. Totals are the
  // scope's END (absolute numbering); start fields mark where the scope
  // BEGINS (null = starts at vol/ch 1, e.g. a first series). Sequels like
  // Bleach TYBW start mid-manga (vol 55 / ch 480).
  totalVolumes: number | null;   // last volume in this entry's scope (null = no source)
  totalChapters: number | null;  // last chapter in this entry's scope (null = no source)
  // 'loose': parallel telling, no chapter mapping is meaningful (Outlaw
  // Star, Sgt. Frog — research-tier verdicts); card shows an honest state
  // instead of mapping_pending
  mappingMode?: 'chapter' | 'loose';
  // real print-volume boundaries (Wikipedia-derived) — every chapter→volume
  // readout prefers these; the ratio estimate is only the boundary-less
  // fallback (estimated rows must never contradict curated neighbors)
  volumeBoundaries?: { volume: number; chapterStart: number; chapterEnd: number | null }[];
  // SURFACED order-only watch-order entries (Sean 2026-08-24): rows only
  // exist here when a per-series ruling set a display_label ("170+1") —
  // unlabeled entries stay data-side until their UI ruling
  watchOrderEntries?: WatchOrderEntry[];
  mangaStartVolume: number | null;
  mangaStartChapter: number | null;
  episodes: Episode[];
  // every name the series answers to (english/romaji/native + synonyms),
  // lowercased — the field's grep haystack beyond the display title
  searchText?: string;
  ranking: TrackingRanking;
  streamingOn: StreamingService[]; // Which services have this anime
  genres: string[];
  synopsis: string;
}
