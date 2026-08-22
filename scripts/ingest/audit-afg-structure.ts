// AFG structural cross-check audit (Sean 2026-08-23/24: AFG's series
// structuring is thoughtfully curated — consult it as evidence even where AFL
// exists). This scan compares every staged AFG page against our canonical
// structure on three axes and classifies the relationship:
//   naming   — AFG's page title vs our canonical title/synonyms
//   grouping — AFG's episode span vs ours (stitch agreement; per-season pages)
//   hierarchy— AFG's season headers vs our series_components
// READ-ONLY: prints a report for ruling. Conflicts become flags/rulings in
// triage, never auto-applied (flag-first).
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-afg-structure.ts

import { db } from './lib/db';
import { slugify } from './lib/slug';

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();

// same spirit as match.ts titleCandidates: subtitle after a colon (or an em
// dash) is often dropped by one source and kept by the other
const titleKeys = (s: string): string[] => {
  const keys = [normalize(s)];
  const cut = normalize(s.split(/[:：—]/)[0]);
  // short prefixes collide ("Re:" matches everything) — require substance
  if (cut && cut !== keys[0] && cut.length >= 5) keys.push(cut);
  return keys.filter(Boolean);
};

interface AfgRaw {
  title: string;
  seasons: string[];
  episodes: { number: number }[];
}

async function pageAll<T>(table: string, select: string): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(select).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function main() {
  const pages = await pageAll<{ slug: string; raw: AfgRaw }>('ingest_afg_pages', 'slug, raw');
  const series = await pageAll<{
    id: string;
    afl_slug: string | null;
    title: string;
    title_english: string | null;
    synonyms: string[] | null;
    total_episodes: number | null;
    aired_episodes: number;
    status: string;
  }>('series', 'id, afl_slug, title, title_english, synonyms, total_episodes, aired_episodes, status');
  const components = await pageAll<{
    series_id: string;
    season_order: number;
    episode_start: number;
    episode_end: number | null;
  }>('series_components', 'series_id, season_order, episode_start, episode_end');
  const registry = await pageAll<{ series_id: string; external_id: string }>(
    'series_external_ids',
    'series_id, external_id, source',
  ).then((rows) => rows.filter((r: any) => r.source === 'afg'));
  const episodes = await pageAll<{ series_id: string; number: number }>('episodes', 'series_id, number');

  const epMax = new Map<string, number>();
  for (const e of episodes) epMax.set(e.series_id, Math.max(epMax.get(e.series_id) ?? 0, e.number));
  const compsBySeries = new Map<string, typeof components>();
  for (const c of components) {
    if (!compsBySeries.has(c.series_id)) compsBySeries.set(c.series_id, []);
    compsBySeries.get(c.series_id)!.push(c);
  }
  const regBySlug = new Map(registry.map((r) => [r.external_id, r.series_id]));

  // slug + normalized-title lookup into canonical
  const bySlug = new Map<string, string>();
  const byTitle = new Map<string, string>();
  for (const s of series) {
    bySlug.set(s.id, s.id);
    if (s.afl_slug) bySlug.set(s.afl_slug, s.id);
    bySlug.set(slugify(s.title), s.id);
    for (const t of [s.title, s.title_english, ...(s.synonyms ?? [])]) {
      if (!t) continue;
      for (const k of titleKeys(t)) if (!byTitle.has(k)) byTitle.set(k, s.id);
    }
  }
  const seriesById = new Map(series.map((s) => [s.id, s]));

  type Match = { page: { slug: string; raw: AfgRaw }; seriesId: string; via: string };
  const matched: Match[] = [];
  const unmatched: { slug: string; title: string; eps: number }[] = [];
  for (const p of pages) {
    const titleHit = titleKeys(p.raw.title).map((k) => byTitle.get(k)).find(Boolean);
    const [via, seriesId]: [string | null, string | null] = regBySlug.has(p.slug)
      ? ['registry', regBySlug.get(p.slug)!]
      : bySlug.has(p.slug)
        ? ['slug', bySlug.get(p.slug)!]
        : bySlug.has(slugify(p.raw.title))
          ? ['title-slug', bySlug.get(slugify(p.raw.title))!]
          : titleHit
            ? ['title', titleHit]
            : [null, null];
    if (!via || !seriesId) {
      unmatched.push({ slug: p.slug, title: p.raw.title, eps: p.raw.episodes.length });
      continue;
    }
    matched.push({ page: p, seriesId, via });
  }

  // group pages per series — AFG splitting what we grouped shows up here
  const pagesPerSeries = new Map<string, Match[]>();
  for (const m of matched) {
    if (!pagesPerSeries.has(m.seriesId)) pagesPerSeries.set(m.seriesId, []);
    pagesPerSeries.get(m.seriesId)!.push(m);
  }

  const aligned: string[] = [];
  const namingDiffers: string[] = [];
  const groupingConflicts: string[] = [];
  const hierarchyNotes: string[] = [];
  const splitBySeasons: string[] = [];
  const unregistered: string[] = [];

  for (const [seriesId, ms] of pagesPerSeries) {
    const s = seriesById.get(seriesId)!;
    const ourMax = epMax.get(seriesId) ?? s.aired_episodes ?? s.total_episodes ?? 0;
    const comps = compsBySeries.get(seriesId) ?? [];

    if (ms.length > 1) {
      splitBySeasons.push(
        `${seriesId}: ${ms.length} AFG pages [${ms.map((m) => m.page.slug).join(', ')}] vs our single entry (${comps.length || 1} components, ${ourMax} eps)`,
      );
    }

    for (const m of ms) {
      const raw = m.page.raw;
      const afgMax = raw.episodes.reduce((mx, e) => Math.max(mx, e.number), 0);
      const afgSeasons = raw.seasons.length;
      const label = `${seriesId} ← afg:${m.page.slug}`;

      if (m.via !== 'registry') unregistered.push(`${label} (matched via ${m.via})`);

      // naming
      const ourNames = [s.title, s.title_english, ...(s.synonyms ?? [])].filter(Boolean).map((t) => normalize(t!));
      if (!ourNames.includes(normalize(raw.title))) {
        namingDiffers.push(`${label}: AFG "${raw.title}" vs ours "${s.title}"`);
      }

      // grouping: does AFG's continuous numbering agree with our stitched span?
      const delta = afgMax - ourMax;
      if (!afgMax || raw.episodes.length < 6) continue; // sparse page, no signal
      if (Math.abs(delta) <= 2) {
        aligned.push(label);
      } else if (delta < 0) {
        // AFG page covers a sub-span — season page of a stitched whole, or scoped entry
        const comp = comps.find((c) => c.episode_end != null && Math.abs(c.episode_end - afgMax) <= 2);
        groupingConflicts.push(
          `${label}: AFG max ${afgMax} < ours ${ourMax}` +
            (comp ? ` — matches component #${comp.season_order} boundary (season-scoped page)` : ' — no component boundary matches'),
        );
      } else {
        groupingConflicts.push(
          `${label}: AFG max ${afgMax} > ours ${ourMax} (AFG numbers beyond our run — specials? next season live?)`,
        );
      }

      // hierarchy: season headers vs our components
      if (afgSeasons > 0 && comps.length > 1 && afgSeasons !== comps.length) {
        hierarchyNotes.push(`${label}: AFG lists ${afgSeasons} seasons; we hold ${comps.length} components`);
      }
    }
  }

  // our series with no AFG counterpart at all (no cross-check available)
  const covered = new Set(pagesPerSeries.keys());
  const noAfg = series.filter((s) => !covered.has(s.id)).map((s) => s.id);

  const section = (title: string, rows: string[]) => {
    console.log(`\n== ${title} (${rows.length}) ==`);
    for (const r of rows) console.log('  ' + r);
  };

  console.log('=== AFG STRUCTURAL CROSS-CHECK ===');
  console.log(`AFG pages staged: ${pages.length} | matched to canonical: ${matched.length} | unmatched: ${unmatched.length}`);
  console.log(`canonical series: ${series.length} | with AFG counterpart: ${covered.size} | without: ${noAfg.length}`);
  section('GROUPING CONFLICTS — AFG span disagrees with ours (ruling material)', groupingConflicts);
  section('AFG SPLITS WHAT WE GROUPED — multiple pages → one canonical entry', splitBySeasons);
  section('HIERARCHY — AFG season count vs our components', hierarchyNotes);
  section('NAMING DIFFERS — AFG title not among our names', namingDiffers);
  section('MATCHED BUT UNREGISTERED — afg id should enter the registry', unregistered);
  const unmatchedWithData = unmatched.filter((u) => u.eps >= 6);
  const unmatchedEmpty = unmatched.filter((u) => u.eps < 6);
  section(
    'UNMATCHED AFG PAGES WITH EPISODE DATA — expansion/match candidates',
    unmatchedWithData.map((u) => `${u.slug}: "${u.title}" (${u.eps} eps)`),
  );
  console.log(
    `\n== UNMATCHED, NO EPISODE TABLE (${unmatchedEmpty.length}) == pages our parser found no conversion table on — no structural signal`,
  );
  console.log(`\n== ALIGNED (${aligned.length}) == spans agree ±2 — cross-check passes`);
  console.log(`== NO AFG COUNTERPART (${noAfg.length}) == no structural cross-check available for these`);
}
main().then(() => process.exit(0));
