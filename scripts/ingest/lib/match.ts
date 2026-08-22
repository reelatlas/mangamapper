// AFL slug → AniList id, in confidence order (docs/data-pipeline.md §3):
// source_map (incl. manual overrides) → AniFiller seed → exact title/synonym
// match via AniList search. Anything ambiguous files a flag and matches
// nothing — guessing is what the flag queue exists to prevent.

import { db, fileFlag } from './db';
import { searchAnime } from './anilist';

const ANIFILLER_RAW = 'https://raw.githubusercontent.com/AniraTeam/AniFiller/main/data/shows';

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

export interface MatchResult {
  anilistId: number;
  malId: number | null;
  method: 'anifiller_seed' | 'exact_title' | 'synonym' | 'manual';
}

async function fromSourceMap(slug: string): Promise<MatchResult | null> {
  const { data, error } = await db
    .from('source_map')
    .select('anilist_id, mal_id, match_method')
    .eq('afl_slug', slug)
    .maybeSingle();
  if (error) throw new Error(`source_map read (${slug}): ${error.message}`);
  if (!data?.anilist_id) return null;
  return { anilistId: data.anilist_id, malId: data.mal_id, method: data.match_method };
}

// AniFiller (github.com/AniraTeam/AniFiller) pre-joined 182 AFL slugs to
// AniList/MAL ids. Unlicensed, so we use ONLY the id mapping (a fact), never
// its episode data — our AFL scrape is the data source.
async function fromAniFillerSeed(slug: string): Promise<{ anilistId: number; malId: number | null } | null> {
  const res = await fetch(`${ANIFILLER_RAW}/${slug}.json`, {
    headers: { 'User-Agent': 'mangaMapper/0.1 (ingest; contact: seanreedux@gmail.com)' },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`AniFiller seed fetch (${slug}): ${res.status}`);
  const json = (await res.json()) as { mappings?: { anilist_id?: number; mal_id?: number } };
  if (!json.mappings?.anilist_id) return null;
  return { anilistId: json.mappings.anilist_id, malId: json.mappings.mal_id ?? null };
}

// AFL index titles carry parenthetical alternates ("A Certain Magical Index
// (Toaru Majutsu No Index)") — both halves are search candidates.
function titleCandidates(displayTitle: string): string[] {
  const m = displayTitle.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!m) return [displayTitle];
  return [m[1].trim(), m[2].trim()].filter(Boolean);
}

// Returns 'duplicate' when another AFL slug already owns this AniList id —
// the caller flags it (two AFL pages for one series needs a merge ruling).
async function persist(
  slug: string,
  result: MatchResult,
  confidence: number,
  verified: boolean,
): Promise<'ok' | 'duplicate'> {
  const { error } = await db.from('source_map').upsert({
    afl_slug: slug,
    anilist_id: result.anilistId,
    mal_id: result.malId,
    match_method: result.method,
    confidence,
    verified,
    updated_at: new Date().toISOString(),
  });
  if (error?.code === '23505') return 'duplicate';
  if (error) throw new Error(`source_map write (${slug}): ${error.message}`);
  return 'ok';
}

async function flagDuplicate(runId: number, slug: string, result: MatchResult) {
  const { data: owner } = await db
    .from('source_map')
    .select('afl_slug')
    .eq('anilist_id', result.anilistId)
    .maybeSingle();
  await fileFlag(runId, slug, 'afl', 'match_ambiguous', {
    reason: 'anilist_id already mapped to another AFL slug — likely duplicate AFL pages for one series',
    anilistId: result.anilistId,
    ownerSlug: owner?.afl_slug ?? null,
  });
}

export async function matchSlug(runId: number, slug: string, displayTitle: string): Promise<MatchResult | null> {
  const existing = await fromSourceMap(slug);
  if (existing) return existing;

  const finish = async (result: MatchResult, confidence: number, verified: boolean) => {
    const outcome = await persist(slug, result, confidence, verified);
    if (outcome === 'duplicate') {
      await flagDuplicate(runId, slug, result);
      return null;
    }
    return result;
  };

  const seed = await fromAniFillerSeed(slug);
  if (seed) return finish({ ...seed, method: 'anifiller_seed' }, 1, true);

  const candidates = titleCandidates(displayTitle);
  let slugAsTitle: string;
  try {
    slugAsTitle = normalize(decodeURIComponent(slug).replace(/-/g, ' '));
  } catch {
    slugAsTitle = normalize(slug.replace(/-/g, ' '));
  }
  const wanted = new Set([...candidates.map(normalize), slugAsTitle]);

  const seen = new Map<number, Awaited<ReturnType<typeof searchAnime>>[number]>();
  for (const candidate of candidates) {
    for (const hit of await searchAnime(candidate)) seen.set(hit.id, hit);
  }
  // Series-format entries first: an AFL show page is a TV-ish run, so "Monster"
  // the TV series must outrank "Monster" the music video on an exact-title tie.
  const SERIES_FORMATS = new Set(['TV', 'TV_SHORT', 'ONA']);
  const hits = [...seen.values()].sort(
    (a, b) => Number(SERIES_FORMATS.has(b.format ?? '')) - Number(SERIES_FORMATS.has(a.format ?? '')),
  );

  for (const hit of hits) {
    const titles = [hit.title.romaji, hit.title.english, hit.title.native].filter(Boolean) as string[];
    if (titles.some((t) => wanted.has(normalize(t)))) {
      return finish({ anilistId: hit.id, malId: hit.idMal, method: 'exact_title' }, 0.95, false);
    }
  }
  for (const hit of hits) {
    if (hit.synonyms.some((s) => wanted.has(normalize(s)))) {
      return finish({ anilistId: hit.id, malId: hit.idMal, method: 'synonym' }, 0.85, false);
    }
  }

  await fileFlag(runId, slug, 'afl', 'match_ambiguous', {
    displayTitle,
    candidates: hits.map((h) => ({ id: h.id, romaji: h.title.romaji, english: h.title.english })),
  });
  return null;
}
