// AFG structural cross-check + identity registration (Sean 2026-08-23/24:
// AFG's series structuring is thoughtfully curated — consult it as evidence
// even where AFL exists). Compares every staged AFG page against canonical on
// three axes (naming / episode-grouping / season-hierarchy) and, with
// --register, enters confident matches into the identity registry so the
// daily AFG refresh cross-checks them from then on.
//
// Match tiers (identity-first, flag-first):
//   registry — already in series_external_ids (source 'afg')
//   ruled    — explicit human ruling in RULED below (durable, like the
//              stitcher's OVERRIDE_CHAINS)
//   slug     — AFG slug equals our id / afl_slug / slugified title  → register
//   title    — whitespace-insensitive FULL title/synonym equality; a key two
//              series both claim is ambiguous and never auto-matches → register
//   prefix   — subtitle-stripped equality (colon/paren cut, ≥5 chars); only
//              registers when the episode span INDEPENDENTLY agrees (±2 of
//              our max or a component boundary) — two weak signals must agree
//   anything else → reported for ruling; nothing suspicious auto-applies
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-afg-structure.ts [--register]

import { db, selectAll, startRun, finishRun } from './lib/db';
import { registerIds } from './lib/resolve';
import { slugify } from './lib/slug';

const REGISTER = process.argv.includes('--register');

// Explicit rulings: afg slug → our series id (null = ruled NOT a match).
const RULED: Record<string, string | null> = {
  // 90s original, NOT Crystal (synonym collision found in the 2026-08-24 audit)
  'bishoujo-senshi-sailor-moon': 'sailor-moon',
  // zero-episode AFG stub whose slug collides with our 2020 entry's id AND the
  // 1999 entry's afl_slug; AFG's title "Digimon Adventure" is the 1999 romaji
  // exactly (the 2020 reboot is "Digimon Adventure:" per AniList naming)
  'digimon-adventure': 'digimon-digital-monsters',
};

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
const squash = (s: string) => normalize(s).replace(/ /g, '');
// subtitle variants: text after a colon/dash, or a trailing parenthetical,
// is often dropped by one source and kept by the other
const prefixKeys = (s: string): string[] => {
  const out = new Set<string>();
  const colonCut = squash(s.split(/[:：—]/)[0]);
  const parenCut = squash(s.replace(/\s*\([^)]*\)\s*$/, ''));
  for (const k of [colonCut, parenCut]) {
    if (k && k !== squash(s) && k.length >= 5) out.add(k);
  }
  return [...out];
};

interface AfgRaw {
  title: string;
  seasons: string[];
  episodes: { number: number }[];
}

const addTo = (m: Map<string, Set<string>>, k: string, v: string) => {
  if (!m.has(k)) m.set(k, new Set());
  m.get(k)!.add(v);
};

async function main() {
  const pages = await selectAll<{ slug: string; raw: AfgRaw }>('ingest_afg_pages', 'slug, raw');
  const series = await selectAll<{
    id: string;
    afl_slug: string | null;
    title: string;
    title_english: string | null;
    synonyms: string[] | null;
    aired_episodes: number;
    status: string;
  }>('series', 'id, afl_slug, title, title_english, synonyms, aired_episodes, status');
  const components = await selectAll<{
    series_id: string;
    season_order: number;
    episode_start: number;
    episode_end: number | null;
  }>('series_components', 'series_id, season_order, episode_start, episode_end');
  const registry = await selectAll<{ series_id: string; external_id: string; source: string }>(
    'series_external_ids',
    'series_id, external_id, source',
  ).then((rows) => rows.filter((r) => r.source === 'afg'));
  const episodes = await selectAll<{ series_id: string; number: number }>('episodes', 'series_id, number');

  const epMax = new Map<string, number>();
  for (const e of episodes) epMax.set(e.series_id, Math.max(epMax.get(e.series_id) ?? 0, e.number));
  const compsBySeries = new Map<string, typeof components>();
  for (const c of components) {
    if (!compsBySeries.has(c.series_id)) compsBySeries.set(c.series_id, []);
    compsBySeries.get(c.series_id)!.push(c);
  }
  const regBySlug = new Map(registry.map((r) => [r.external_id, r.series_id]));
  const regBySeries = new Map(registry.map((r) => [r.series_id, r.external_id]));
  const seriesById = new Map(series.map((s) => [s.id, s]));

  const slugKeys = new Map<string, Set<string>>();
  const titleFull = new Map<string, Set<string>>();
  const titlePrefix = new Map<string, Set<string>>();
  for (const s of series) {
    addTo(slugKeys, s.id, s.id);
    if (s.afl_slug) addTo(slugKeys, s.afl_slug, s.id);
    addTo(slugKeys, slugify(s.title), s.id);
    for (const t of [s.title, s.title_english, ...(s.synonyms ?? [])]) {
      if (!t) continue;
      addTo(titleFull, squash(t), s.id);
      for (const k of prefixKeys(t)) addTo(titlePrefix, k, s.id);
    }
  }

  // episode-span agreement: within ±2 of the series' own max, or of a
  // component boundary (a season-scoped AFG page)
  const spanAgrees = (seriesId: string, afgMax: number): boolean => {
    if (!afgMax) return false;
    const ours = epMax.get(seriesId) ?? seriesById.get(seriesId)?.aired_episodes ?? 0;
    if (ours && Math.abs(afgMax - ours) <= 2) return true;
    return (compsBySeries.get(seriesId) ?? []).some(
      (c) => c.episode_end != null && Math.abs(c.episode_end - afgMax) <= 2,
    );
  };

  type Match = { page: { slug: string; raw: AfgRaw }; seriesId: string; via: string };
  const matched: Match[] = [];
  const unmatched: { slug: string; title: string; eps: number }[] = [];
  const needsRuling: string[] = [];

  for (const p of pages) {
    const afgMax = p.raw.episodes.reduce((m, e) => Math.max(m, e.number), 0);
    const resolveTier = (): { seriesId: string; via: string } | 'excluded' | null => {
      if (regBySlug.has(p.slug)) return { seriesId: regBySlug.get(p.slug)!, via: 'registry' };
      if (p.slug in RULED) {
        return RULED[p.slug] === null ? 'excluded' : { seriesId: RULED[p.slug]!, via: 'ruled' };
      }
      const slugCands = new Set([
        ...(slugKeys.get(p.slug) ?? []),
        ...(slugKeys.get(slugify(p.raw.title)) ?? []),
      ]);
      if (slugCands.size === 1) return { seriesId: [...slugCands][0], via: 'slug' };
      if (slugCands.size > 1) {
        const bySpan = [...slugCands].filter((id) => spanAgrees(id, afgMax));
        if (bySpan.length === 1) return { seriesId: bySpan[0], via: 'slug+span' };
        needsRuling.push(`${p.slug}: slug tier ambiguous between [${[...slugCands].join(', ')}]`);
        return null;
      }
      const fullCands = titleFull.get(squash(p.raw.title)) ?? new Set<string>();
      if (fullCands.size === 1) return { seriesId: [...fullCands][0], via: 'title' };
      if (fullCands.size > 1) {
        const bySpan = [...fullCands].filter((id) => spanAgrees(id, afgMax));
        if (bySpan.length === 1) return { seriesId: bySpan[0], via: 'title+span' };
        needsRuling.push(`${p.slug} "${p.raw.title}": title tier ambiguous between [${[...fullCands].join(', ')}]`);
        return null;
      }
      // prefix tier: name-prefix AND span must independently agree
      const prefCands = new Set<string>([
        ...(titlePrefix.get(squash(p.raw.title)) ?? []),
        ...prefixKeys(p.raw.title).flatMap((k) => [...(titleFull.get(k) ?? []), ...(titlePrefix.get(k) ?? [])]),
      ]);
      if (prefCands.size) {
        const bySpan = [...prefCands].filter((id) => spanAgrees(id, afgMax));
        if (bySpan.length === 1) return { seriesId: bySpan[0], via: 'prefix+span' };
        if (afgMax) {
          needsRuling.push(
            `${p.slug} "${p.raw.title}" (${afgMax} eps): prefix candidates [${[...prefCands].join(', ')}] — span did not disambiguate`,
          );
        }
        return null;
      }
      return null;
    };

    const tier = resolveTier();
    if (tier === 'excluded') continue;
    if (!tier) {
      unmatched.push({ slug: p.slug, title: p.raw.title, eps: p.raw.episodes.length });
      continue;
    }
    matched.push({ page: p, seriesId: tier.seriesId, via: tier.via });
  }

  // ---- registration (--register) ----
  const registered: string[] = [];
  const regSkipped: string[] = [];
  if (REGISTER) {
    const runId = await startRun('afg');
    try {
      // one afg id per series (registry constraint): prefer the strongest tier
      const TIER_RANK: Record<string, number> = { ruled: 0, slug: 1, 'slug+span': 2, title: 3, 'title+span': 4, 'prefix+span': 5 };
      const bySeries = new Map<string, Match[]>();
      for (const m of matched) {
        if (m.via === 'registry') continue;
        if (!bySeries.has(m.seriesId)) bySeries.set(m.seriesId, []);
        bySeries.get(m.seriesId)!.push(m);
      }
      for (const [seriesId, ms] of bySeries) {
        const existing = regBySeries.get(seriesId);
        ms.sort((a, b) => (TIER_RANK[a.via] ?? 9) - (TIER_RANK[b.via] ?? 9));
        const [best, ...rest] = ms;
        if (existing) {
          if (existing !== best.page.slug) {
            regSkipped.push(`${seriesId}: already registered to afg:${existing}, not overwriting with ${best.page.slug}`);
          }
          continue;
        }
        await registerIds(seriesId, { afg: best.page.slug });
        registered.push(`${seriesId} ← afg:${best.page.slug} (${best.via})`);
        // identity resolved: close any open match flags for this page
        await db
          .from('ingest_flags')
          .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
          .in('series_key', [best.page.slug, `afg:${best.page.slug}`])
          .eq('kind', 'match_ambiguous')
          .eq('status', 'open');
        for (const r of rest) {
          regSkipped.push(`${seriesId}: second page afg:${r.page.slug} (${r.via}) not registered — one afg id per series`);
        }
      }
      await finishRun(
        runId,
        'ok',
        { fetched: 0, unchanged: 0, changed: registered.length, flagged: needsRuling.length },
        'afg identity registration',
      );
    } catch (err) {
      await finishRun(runId, 'error', { fetched: 0, unchanged: 0, changed: registered.length, flagged: 0 }, String(err));
      throw err;
    }
  }

  // ---- structural report ----
  const pagesPerSeries = new Map<string, Match[]>();
  for (const m of matched) {
    if (!pagesPerSeries.has(m.seriesId)) pagesPerSeries.set(m.seriesId, []);
    pagesPerSeries.get(m.seriesId)!.push(m);
  }

  const aligned: string[] = [];
  const namingDiffers: string[] = [];
  const groupingConflicts: string[] = [];
  const hierarchyNotes: string[] = [];
  const unregistered: string[] = [];

  for (const [seriesId, ms] of pagesPerSeries) {
    const s = seriesById.get(seriesId)!;
    const ourMax = epMax.get(seriesId) ?? s.aired_episodes ?? 0;
    const comps = compsBySeries.get(seriesId) ?? [];

    for (const m of ms) {
      const raw = m.page.raw;
      const afgMax = raw.episodes.reduce((mx, e) => Math.max(mx, e.number), 0);
      const label = `${seriesId} ← afg:${m.page.slug}`;

      if (m.via !== 'registry') unregistered.push(`${label} (${m.via})`);

      const ourNames = [s.title, s.title_english, ...(s.synonyms ?? [])].filter(Boolean).map((t) => squash(t!));
      if (!ourNames.includes(squash(raw.title))) {
        namingDiffers.push(`${label}: AFG "${raw.title}" vs ours "${s.title}"`);
      }

      if (!afgMax || raw.episodes.length < 6) continue; // sparse page, no signal
      const delta = afgMax - ourMax;
      if (Math.abs(delta) <= 2) {
        aligned.push(label);
      } else if (delta < 0) {
        const comp = comps.find((c) => c.episode_end != null && Math.abs(c.episode_end - afgMax) <= 2);
        groupingConflicts.push(
          `${label}: AFG max ${afgMax} < ours ${ourMax}` +
            (comp ? ` — matches component #${comp.season_order} boundary (season-scoped page)` : ' — no component boundary matches'),
        );
      } else {
        groupingConflicts.push(
          `${label}: AFG max ${afgMax} > ours ${ourMax} (unstitched newer seasons? ruled split? AFL lag?) — afg-extend candidate`,
        );
      }

      const afgSeasons = raw.seasons.length;
      if (afgSeasons > 0 && comps.length > 1 && afgSeasons !== comps.length) {
        hierarchyNotes.push(`${label}: AFG lists ${afgSeasons} seasons; we hold ${comps.length} components`);
      }
    }
  }

  const covered = new Set(pagesPerSeries.keys());
  const noAfg = series.filter((s) => !covered.has(s.id)).map((s) => s.id);

  const section = (title: string, rows: string[]) => {
    console.log(`\n== ${title} (${rows.length}) ==`);
    for (const r of rows) console.log('  ' + r);
  };

  console.log('=== AFG STRUCTURAL CROSS-CHECK ===');
  console.log(`AFG pages staged: ${pages.length} | matched to canonical: ${matched.length} | unmatched: ${unmatched.length}`);
  console.log(`canonical series: ${series.length} | with AFG counterpart: ${covered.size} | without: ${noAfg.length}`);
  if (REGISTER) {
    section('REGISTERED THIS RUN', registered);
    section('REGISTRATION SKIPPED', regSkipped);
  }
  section('NEEDS RULING — ambiguous identity, never auto-matched', needsRuling);
  section('GROUPING CONFLICTS — AFG span disagrees with ours (ruling material)', groupingConflicts);
  section('HIERARCHY — AFG season count vs our components', hierarchyNotes);
  section('NAMING DIFFERS — AFG title not among our names', namingDiffers);
  if (!REGISTER) section('MATCHED BUT UNREGISTERED — run with --register', unregistered);
  const unmatchedWithData = unmatched.filter((u) => u.eps >= 6);
  section(
    'UNMATCHED AFG PAGES WITH EPISODE DATA — expansion/match candidates',
    unmatchedWithData.map((u) => `${u.slug}: "${u.title}" (${u.eps} eps)`),
  );
  console.log(
    `\n== UNMATCHED, NO EPISODE TABLE (${unmatched.length - unmatchedWithData.length}) == pages our parser found no conversion table on — no structural signal`,
  );
  console.log(`== ALIGNED (${aligned.length}) == spans agree ±2 — cross-check passes`);
  console.log(`== NO AFG COUNTERPART (${noAfg.length}) == no structural cross-check available for these`);
}
main().then(() => process.exit(0));
