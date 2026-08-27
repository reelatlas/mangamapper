// SOURCE_KINDS — the registry of source kinds (rule T25, T4.0 D-9, ruled by
// Sean 2026-08-26; built T4.1). Source is series IDENTITY: `series.source_type`
// names what the anime ADAPTS, and every standing (canon / mixed / filler) is
// relative to it. This is a REGISTRY, not an enum: one declarative record per
// kind, values are AniList's own words lower-cased (no invented names), and a
// new source is one record + its instrument ruling — never a migration debate.
//
// Derivation (deriveSourceKind) = AniList `source` × the picked manga node's
// countryOfOrigin × SOURCE_TYPE_OVERRIDES. Anything the registry does not
// cover → null + flag: FAIL CLOSED, never default to manga.
//
// hasSource ≠ hasInstrument: hasSource = an adapted work exists (the kind is
// not `original`); hasInstrument = there are units to map to (unit ≠ none).
// Tail math and `{noun} only` badges need hasInstrument; a studio original
// IS its own source, so there is no `studio_only` tail.
//
// Pure — no db import — because src/data/catalog/assemble.ts (the app) reads
// the same registry the writers do (P2).
import { toRecord, type RulingEntry } from './types';

export type SourceUnit = 'chapter' | 'volume' | 'none';

export type SourceKind = {
  /** the stored `series.source_type` value — AniList's word, lower-cased */
  value: string;
  /** the noun for `{noun} only` badges and series labels (T4.5) */
  noun: string;
  /** the instrument's unit; 'none' = hasSource without hasInstrument (until a citeable, mapped example exists) */
  unit: SourceUnit;
  /** the tail badge when hasInstrument, else null */
  tailBadge: string | null;
  /** AniList `source` enum values that derive to this kind (empty = reserved / override-only) */
  anilistSources: string[];
  /** when set, derivation requires the picked manga node's countryOfOrigin to be one of these */
  countries?: string[];
  /** the series label when this kind is the source itself */
  seriesLabel?: string;
  /**
   * T27 (T4.3): what AFL's `anime_canon` class means on a series of this kind.
   * AFL's word means "canon to the anime, not from the manga": on a studio
   * original or a game adaptation that IS the source's own story (canon);
   * on a manga / novel / VN series it adheres to no source (filler) unless a
   * T6 ruling says otherwise.
   */
  aflAnimeCanon: 'canon' | 'filler';
  note?: string;
};

export const SOURCE_KINDS = [
  { value: 'manga', noun: 'manga', unit: 'chapter', tailBadge: 'manga only', anilistSources: ['MANGA', 'ONE_SHOT'], countries: ['JP'], aflAnimeCanon: 'filler' },
  { value: 'manhwa', noun: 'manhwa', unit: 'chapter', tailBadge: 'manhwa only', anilistSources: ['MANGA', 'ONE_SHOT'], countries: ['KR'], aflAnimeCanon: 'filler' },
  { value: 'manhua', noun: 'manhua', unit: 'chapter', tailBadge: 'manhua only', anilistSources: ['MANGA', 'ONE_SHOT'], countries: ['CN', 'TW', 'HK'], aflAnimeCanon: 'filler' },
  { value: 'webtoon', noun: 'webtoon', unit: 'chapter', tailBadge: 'webtoon only', anilistSources: [], aflAnimeCanon: 'filler', note: 'by ORIGIN, not format (Sean 2026-08-27, batch 19 B2-2): an original webcomic from outside KR / CN-TW-HK / JP — the OEL Tapas original the-beginning-after-the-end is the first use. A KR vertical-scroll comic is manhwa and a CN one manhua whatever its format (solo-leveling → manhwa). AniList has no WEBTOON manga format; enters only through SOURCE_TYPE_OVERRIDES' },
  { value: 'doujinshi', noun: 'doujinshi', unit: 'chapter', tailBadge: 'doujinshi only', anilistSources: ['DOUJINSHI'], aflAnimeCanon: 'filler' },
  { value: 'light_novel', noun: 'novel', unit: 'volume', tailBadge: 'novel only', anilistSources: ['LIGHT_NOVEL'], aflAnimeCanon: 'filler', note: 'volume-space instrument (T24)' },
  { value: 'web_novel', noun: 'novel', unit: 'volume', tailBadge: 'novel only', anilistSources: ['WEB_NOVEL'], aflAnimeCanon: 'filler' },
  { value: 'novel', noun: 'novel', unit: 'volume', tailBadge: 'novel only', anilistSources: ['NOVEL'], aflAnimeCanon: 'filler' },
  { value: 'visual_novel', noun: 'visual novel', unit: 'none', tailBadge: null, anilistSources: ['VISUAL_NOVEL'], aflAnimeCanon: 'filler', note: 'never collapsed into novel; no instrument until a citeable, mapped example exists' },
  { value: 'video_game', noun: 'game', unit: 'none', tailBadge: null, anilistSources: ['VIDEO_GAME', 'GAME'], aflAnimeCanon: 'canon', note: 'no instrument until a citeable, mapped example exists' },
  { value: 'original', noun: 'anime', unit: 'none', tailBadge: null, anilistSources: ['ORIGINAL'], seriesLabel: 'studio original', aflAnimeCanon: 'canon', note: 'the anime IS the source — hasSource false, no tail' },
  { value: 'other', noun: 'source', unit: 'none', tailBadge: null, anilistSources: ['OTHER'], aflAnimeCanon: 'filler', note: 'flag for a ruling: SOURCE_TYPE_OVERRIDES names the real kind' },
] as const satisfies readonly SourceKind[];

/** the stored vocabulary, derived from the registry — never a second list */
export type SourceKindValue = (typeof SOURCE_KINDS)[number]['value'];

export const SOURCE_KIND_VALUES: string[] = SOURCE_KINDS.map((k) => k.value);
const BY_VALUE = new Map<string, SourceKind>(SOURCE_KINDS.map((k) => [k.value, k]));

export const sourceKindOf = (value: string | null | undefined): SourceKind | null => (value ? BY_VALUE.get(value) ?? null : null);

/** an adapted work exists (identity) — false for studio originals and for an unruled/unknown kind */
export const seriesHasSource = (sourceType: string | null | undefined): boolean => {
  const k = sourceKindOf(sourceType);
  return !!k && k.value !== 'original';
};

/** T27: the standing an AFL `anime_canon` row takes on a series of this kind; unknown kind → filler (adheres to no identified source) */
export const aflAnimeCanonStanding = (sourceType: string | null | undefined): 'canon' | 'filler' => sourceKindOf(sourceType)?.aflAnimeCanon ?? 'filler';

/** there are units to map to — tail math, strip, `{noun} only` only when true */
export const seriesHasInstrument = (sourceType: string | null | undefined): boolean => {
  const k = sourceKindOf(sourceType);
  return !!k && k.value !== 'original' && k.unit !== 'none';
};

// ---- SOURCE_TYPE_OVERRIDES: AniList's mistakes, ruled (T25). A ruled value
// wins over derivation; it must be a registered kind (ledger-check / the
// healer refuse anything else).
export const OVERRIDE_ENTRIES: RulingEntry<string>[] = [
  {
    seriesId: 'outlaw-star',
    ruleId: 'T25',
    value: 'original',
    reason:
      "AniList says source MANGA, but the show is a co-primary media-mix, not an adaptation: Sunrise's official page credits 原作／矢立 肇、伊東岳彦 on the anime and 漫画／伊東岳彦 as the parallel branch (「メディアミックス作品でもある」); Hajime Yatate — Sunrise's house pseudonym — sits in the MANGA's own vol-1 index; Ito plotted the anime from 1994, the manga started 「テレビの放送に先駆けて」 as a lead-in, and he scripted ep 19 himself. The anime IS its own source; the 3-volume manga is a sibling telling (Sean's A40/G3 rulings already found no chapter mapping meaningful). Distinct from the Evangelion class (T21: manga adapts the anime) — sibling BY DESIGN. Batch 18, verified R24.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-26',
    cite: ['https://www.sunrise-world.net/titles/pickup_094.php', 'https://ja.wikipedia.org/wiki/星方武侠アウトロースター', 'scripts/ingest/research/batch18/verify/outlaw-star.md'],
  },
  // ---- batch 19 wave 2, lane B2 (2026-08-27; verified R24; Sean ruled). The
  // three `other` series were the T25 backlog; each is now a cited kind.
  {
    seriesId: 'solo-leveling',
    ruleId: 'T25',
    value: 'manhwa',
    reason:
      "AniList's `source: OTHER` on the anime (151807) is the error: its ONLY ADAPTATION edge is 105398 — format MANGA, countryOfOrigin KR (the KakaoPage webtoon, 2018-03-04 → 2021-12-29, D&C Media) — so deriveSourceKind(MANGA × KR) already reads manhwa; the override keeps the ruling aligned with the derivation (the god-of-high-school precedent). Aniplex / docomo 原作 credit the webtoon trio (DUBU / Chugong / h-goon, D&C Webtoon Biz.), not the novel; ja-WP: based on the webtoon; all 13 stored anchors are in the webtoon's chapter space (sololeveling.fandom {{WB}} column matches every row; our v7 = 98-110 boundary matches its volume table exactly). Not `webtoon`: that kind is by origin (OEL), and this work is Korean. TRAP (research-agent): the Yen Press PRINT edition re-numbers chapters (vol 1 = 'Chapters 1-3' for webtoon 1-12; vol 7 = 'Chapters 18-21' for 98-110) — never join an anchor on a Yen Press TOC. The stale ja-WP '15 volumes' cite is dropped (ja-WP says 既刊13巻; en-WP / fandom carry 15).",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/solo-leveling.json', 'scripts/ingest/research/batch19/verify/solo-leveling.md', 'https://anilist.co/manga/105398', 'https://sololeveling.fandom.com/wiki/Volume_%26_Chapter'],
  },
  {
    seriesId: 'the-beginning-after-the-end',
    ruleId: 'T25',
    value: 'webtoon',
    reason:
      "The anime adapts the Tapas WEBCOMIC (story TurtleMe, art Fuyuki23), not TurtleMe's web novel: the anime's own credit block reads verbatim 'Based on the comic series, created by TurtleMe and published by Tapas Entertainment' (official site; reproduced by Animate Times with 原作：TurtleMe / ストーリー監修：TurtleMe); the stored anchors are in the webcomic's chapter numbering (ep 12's 48-56 = the webcomic's season-2 finale ch 56 'All I Need', which adapts NOVEL ch 29 — a far coarser space). AniList carries NO media entry for the novel or the comic (183161 / 194317: source OTHER, only SEQUEL/PREQUEL edges), so derivation cannot produce a kind — the override is the only route. `webtoon`, NOT `manhwa`: the kind is BY ORIGIN (Sean 2026-08-27) — an OEL American Tapas Original (en-WP {{Infobox manhwa | OEL = y}}, 'American web novel series'; launched July 2018 in English on a then-US platform for the NA market; Tapas is Kakao-owned only since May 2021) with no Korean publication of origin; manhwa would assert a country the sources refute. TRAP: the fandom's `episode` field is the raw Tapas index (webcomic ch 48 = Tapas 57) — join on `episode_webtoon` / the chapter number only.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/the-beginning-after-the-end.json', 'scripts/ingest/research/batch19/verify/the-beginning-after-the-end.md', 'https://en.wikipedia.org/wiki/The_Beginning_After_the_End', 'https://tapas.io/series/The-Beginning-After-the-End'],
  },
  {
    seriesId: 'ghost-in-the-shell-arise-alternative-architecture',
    ruleId: 'T25',
    value: 'original',
    reason:
      "Alternative Architecture's source is the anime itself: eps 1-8 are a broadcast re-edit of the four 2013-14 Arise theatrical parts (ja-WP 各話リスト's 「オリジナル版エピソード出典」 column: #01-02 → border:4, #03-04 → border:1, #05-06 → border:2, #07-08 → border:3; the official site's INTRODUCTION 再編集 / 冲方丁による初期案 verbatim) and eps 9-10 PYROPHORIC CULT are 完全新作エピソード bridging into 新劇場版. Shirow's 攻殻機動隊 (AniList 31023, 11 ch / 1 vol) draws ADAPTATION edges to the 1995 film, S.A.C., Innocence and the 2026 TV — never to any Arise entry; AA (21056) is source OTHER with NO adaptation edge (ALTERNATIVE → the four films, SEQUEL → 21057). ja-WP's lead prints 「原作は士郎正宗の漫画」 — a franchise credit, not an adaptation (ja-WP itself calls Arise 「第4の攻殻」); Sleepless Eye (78321) is the project's comicalization (T21 direction). `original` per the outlaw-star precedent; a re-cut is the same work. Rides with the T6 retype of 9-10 to canon (EPISODE_TYPE_OVERRIDES) in the same apply — AFL classes them plain Filler, and nothing mechanical would flag it.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-27',
    cite: ['scripts/ingest/research/batch19/out/ghost-in-the-shell-arise-alternative-architecture.json', 'scripts/ingest/research/batch19/verify/ghost-in-the-shell-arise-alternative-architecture.md', 'https://ja.wikipedia.org/wiki/攻殻機動隊ARISE', 'https://anilist.co/anime/21056'],
  },
];
export const SOURCE_TYPE_OVERRIDES: Record<string, string> = toRecord(OVERRIDE_ENTRIES);

export type DerivationInput = {
  /** AniList `source` on the anime media */
  source: string | null | undefined;
  /** the picked manga ADAPTATION node's countryOfOrigin (null when no node; undefined when the node predates the field — stale staging) */
  mangaCountry: string | null | undefined;
  /** a manga ADAPTATION edge exists (old AniList entries omit `source`) */
  hasMangaEdge: boolean;
};

export type Derivation = { value: string | null; reason: string; overridden: boolean };

/**
 * The one derivation (P2): resolve.ts, chain.ts#aggregate, the healer and the
 * audit all call this. Fails closed: an AniList source / country the registry
 * does not cover → null, and the caller flags it.
 */
export const deriveSourceKind = (seriesId: string, input: DerivationInput): Derivation => {
  const ruled = SOURCE_TYPE_OVERRIDES[seriesId];
  if (ruled) return { value: ruled, reason: 'SOURCE_TYPE_OVERRIDES', overridden: true };
  // old entries omit `source`; a manga ADAPTATION edge is evidence of a manga source (T20 fallback, kept)
  const src = input.source || (input.hasMangaEdge ? 'MANGA' : '');
  if (!src) return { value: null, reason: 'AniList source empty and no manga edge', overridden: false };
  const candidates: SourceKind[] = SOURCE_KINDS.filter((k) => (k.anilistSources as readonly string[]).includes(src));
  if (!candidates.length) return { value: null, reason: `AniList source ${src} is not registered`, overridden: false };
  const byCountry = candidates.filter((k) => k.countries);
  if (!byCountry.length) return { value: candidates[0].value, reason: `AniList source ${src}`, overridden: false };
  // country-refined kinds (manga / manhwa / manhua): the picked manga node decides
  if (input.mangaCountry === undefined) return { value: null, reason: `AniList source ${src}: manga node lacks countryOfOrigin (stale staging — re-stage AniList)`, overridden: false };
  if (input.mangaCountry === null) {
    // source declared MANGA but no manga node to refine by: AniList's own word stands
    const plain = byCountry.find((k) => k.countries!.includes('JP'));
    return plain ? { value: plain.value, reason: `AniList source ${src}, no manga node — JP assumed from the declared value` , overridden: false } : { value: null, reason: `AniList source ${src} without a node`, overridden: false };
  }
  const hit = byCountry.find((k) => k.countries!.includes(input.mangaCountry as string));
  return hit
    ? { value: hit.value, reason: `AniList source ${src} × manga country ${input.mangaCountry}`, overridden: false }
    : { value: null, reason: `AniList source ${src} × manga country ${input.mangaCountry} is not registered`, overridden: false };
};

// ---- T22: manga_status vocabulary. The attached publication's AniList
// status; 'none' when no source publication is attached ("no source
// publication to compare against" — replaces the 'anime_only' homonym, T4.0
// D-12). hasSource derives from the source kind alone, never from this.
export const MANGA_STATUS_MAP: Record<string, string> = {
  RELEASING: 'publishing',
  FINISHED: 'finished',
  HIATUS: 'hiatus',
  NOT_YET_RELEASED: 'publishing',
  CANCELLED: 'finished',
};
export const MANGA_STATUS_VALUES = ['publishing', 'finished', 'hiatus', 'none'] as const;
export const mangaStatusOf = (node: { status?: string | null } | null | undefined): string =>
  node ? MANGA_STATUS_MAP[node.status ?? ''] ?? 'publishing' : 'none';
