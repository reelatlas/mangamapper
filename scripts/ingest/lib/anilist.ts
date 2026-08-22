// AniList GraphQL client, paced for the degraded 30 req/min limit (treated as
// permanent — see docs/data-pipeline.md §1). Batches 50 media per request via
// id_in, so a full catalog sweep is ~8 requests.

const ANILIST_URL = 'https://graphql.anilist.co';
const PACE_MS = 2200; // ~27 req/min ceiling, under the 30 limit

let lastRequest = 0;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const wait = lastRequest + PACE_MS - Date.now();
  if (wait > 0) await sleep(wait);
  lastRequest = Date.now();

  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('retry-after')) || 60;
    await sleep(retryAfter * 1000 + 500);
    return gql(query, variables);
  }
  if (!res.ok) throw new Error(`AniList ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) throw new Error(`AniList GraphQL: ${body.errors[0].message}`);
  if (!body.data) throw new Error('AniList: empty data');
  return body.data;
}

// Tier 1 + 2 (+ cheap tier-3 scalars). Everything lands raw in staging;
// promotion is the resolver's decision. docs/data-pipeline.md §7.
const MEDIA_FIELDS = `
  id idMal
  title { romaji english native }
  synonyms format status source countryOfOrigin
  startDate { year month day } endDate { year month day }
  season seasonYear episodes duration
  nextAiringEpisode { episode airingAt }
  averageScore meanScore popularity favourites trending
  genres tags { name rank isMediaSpoiler }
  coverImage { extraLarge color } bannerImage isAdult
  description(asHtml: false)
  studios(isMain: true) { nodes { name } }
  externalLinks { site type language url }
  relations { edges { relationType node {
    id type format status popularity chapters volumes
    title { romaji native }
  } } }
`;

export interface AniListMedia {
  id: number;
  idMal: number | null;
  title: { romaji: string | null; english: string | null; native: string | null };
  synonyms: string[];
  format: string | null;
  status: string;
  source: string | null;
  countryOfOrigin: string | null;
  startDate: { year: number | null; month: number | null; day: number | null };
  endDate: { year: number | null; month: number | null; day: number | null };
  season: string | null;
  seasonYear: number | null;
  episodes: number | null;
  duration: number | null;
  nextAiringEpisode: { episode: number; airingAt: number } | null;
  averageScore: number | null;
  meanScore: number | null;
  popularity: number;
  favourites: number | null;
  trending: number | null;
  genres: string[];
  tags: { name: string; rank: number; isMediaSpoiler: boolean }[];
  coverImage: { extraLarge: string | null; color: string | null };
  bannerImage: string | null;
  isAdult: boolean;
  description: string | null;
  studios: { nodes: { name: string }[] };
  externalLinks: { site: string; type: string | null; language: string | null; url: string | null }[];
  relations: {
    edges: {
      relationType: string;
      node: {
        id: number;
        type: string;
        format: string | null;
        status: string | null;
        popularity: number | null;
        chapters: number | null;
        volumes: number | null;
        title: { romaji: string | null; native: string | null };
      };
    }[];
  };
}

export async function mediaByIds(ids: number[]): Promise<AniListMedia[]> {
  const out: AniListMedia[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const chunk = ids.slice(i, i + 50);
    const data = await gql<{ Page: { media: AniListMedia[] } }>(
      `query ($ids: [Int]) { Page(perPage: 50) { media(id_in: $ids, type: ANIME) { ${MEDIA_FIELDS} } } }`,
      { ids: chunk },
    );
    out.push(...data.Page.media);
  }
  return out;
}

export interface AniListSearchHit {
  id: number;
  idMal: number | null;
  format: string | null;
  title: { romaji: string | null; english: string | null; native: string | null };
  synonyms: string[];
}

export async function searchAnime(search: string): Promise<AniListSearchHit[]> {
  const data = await gql<{ Page: { media: AniListSearchHit[] } }>(
    `query ($search: String) { Page(perPage: 5) { media(search: $search, type: ANIME) {
      id idMal format title { romaji english native } synonyms
    } } }`,
    { search },
  );
  return data.Page.media;
}
