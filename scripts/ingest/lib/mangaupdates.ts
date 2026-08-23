// MangaUpdates client (cross-check tier). Identity is NEVER title-guessed:
// the MangaDex bridge verifies it — MangaDex entries carry AniList + MU ids
// together (links.al / links.mu; the mu slug base36-decodes to their numeric
// id). No verified bridge → no MU data (flag, don't guess).
// MU AUP: cache aggressively (we do), credit MangaUpdates (footer, with
// AFL/AFG), reasonable request spacing (we pace ~1.5s).

const UA = 'mangaMapper/0.1 (ingest; contact: seanreedux@gmail.com)';
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface MuBridge {
  mangadexUuid: string;
  muSlug: string;
  muSeriesId: number;
}

// AniList manga id → MU id, verified through MangaDex's links block.
export async function bridgeViaMangaDex(anilistMangaId: number, title: string): Promise<MuBridge | null> {
  const res = await fetch(
    `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=10`,
    { headers: { 'User-Agent': UA } },
  );
  if (!res.ok) return null;
  const body = (await res.json()) as {
    data?: { id: string; attributes?: { links?: { al?: string; mu?: string } } }[];
  };
  for (const hit of body.data ?? []) {
    const links = hit.attributes?.links;
    if (links?.al === String(anilistMangaId) && links.mu) {
      // modern MU slugs are base36; legacy numeric ids appear verbatim
      const muSeriesId = /^\d+$/.test(links.mu) ? Number(links.mu) : parseInt(links.mu, 36);
      if (Number.isFinite(muSeriesId)) {
        return { mangadexUuid: hit.id, muSlug: links.mu, muSeriesId };
      }
    }
  }
  return null;
}

export interface MuSeries {
  series_id: number;
  title: string;
  latest_chapter: number | null;
  status: string | null; // free text: "115 Volumes (Ongoing)"
  completed: boolean | null; // MU's explicit flag — stronger than the status string
  type: string | null; // Manga / Manhwa / Manhua / Novel — validates our source_type
  anime: { start: string | null; end: string | null } | null;
  [extra: string]: unknown; // greedy staging: the FULL MU payload, never a trim
}

export async function fetchMuSeries(muSeriesId: number): Promise<MuSeries | null> {
  await sleep(1500);
  const res = await fetch(`https://api.mangaupdates.com/v1/series/${muSeriesId}`, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
  });
  if (!res.ok) return null;
  const j = (await res.json()) as Record<string, unknown>;
  return {
    ...j,
    series_id: Number(j.series_id),
    title: String(j.title ?? ''),
    latest_chapter: j.latest_chapter != null ? Number(j.latest_chapter) : null,
    status: j.status != null ? String(j.status) : null,
    completed: j.completed != null ? Boolean(j.completed) : null,
    type: j.type != null ? String(j.type) : null,
    anime: (j.anime as MuSeries['anime']) ?? null,
  };
}

// Hash only the fields our rules act on — MU payloads carry rating/rank
// churn that would otherwise fake a change every fetch.
export const muHash = (mu: MuSeries) => ({
  latest_chapter: mu.latest_chapter,
  status: mu.status,
  completed: mu.completed,
  type: mu.type,
  anime: mu.anime,
});
