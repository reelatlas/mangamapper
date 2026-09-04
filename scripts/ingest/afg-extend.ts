// AFG-driven extension (Sean 2026-08-24: populate what AFG/AFL know, always
// via repeatable mechanisms). For REGISTERED afg pages that cover more
// episodes than we hold (AFL lagging an airing show, or newer seasons never
// stitched — dan-da-dan showed 3 of 24), the AniList chain must INDEPENDENTLY
// confirm AFG's numbering (walkChain + the same ±2/lag finalize gate the
// stitcher uses) before anything applies. On confirm:
//   - series row re-aggregates from the chain (id / title / afl_slug PRESERVED)
//   - components rebuild with season ranges
//   - episodes MERGE: existing AFL rows stay the type authority; AFG fills
//     only the missing numbers, with AFG's own 3-way taxonomy
//   - anchors re-sync (monotonicity + alignment gates inside)
// Anything unconfirmed flags. Pages that intentionally span a RULED SPLIT
// (docs/franchise-rulings.md) are skipped by name, not silently re-merged —
// the ownership guard would stop the walk anyway; the skip list keeps the
// report honest about WHY.
//   npx tsx --env-file=.env.ingest scripts/ingest/afg-extend.ts

import { AFG_BASE, parseAfgPage } from './lib/afg';
import { politeFetch } from './lib/http';
import { contentHash } from './lib/hash';
import { db, selectAll, startRun, finishRun, fileFlagOnce } from './lib/db';
import { stageAniList, applyScope, applyEpisodeFloor, filterEpisodeRows } from './lib/resolve';
import { aired, walkChain, aggregate, writeComponents, ownedAnilistIds } from './lib/chain';
import { syncAnchors } from './lib/anchors';
import { loadEpisodeTies } from './lib/side-source';
import { RULED_SPLITS } from './lib/rulings/ruled-splits';

// Ruled splits live in lib/rulings/ruled-splits.ts (restructure T2.1): AFG
// pages whose numbering runs across one of OUR ruled splits, skipped by name.

async function main() {
  const runId = await startRun('afg');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];

  try {
    const registry = await selectAll<{ series_id: string; external_id: string }>('series_external_ids', 'series_id, external_id', (q) => q.eq('source', 'afg'));
    const seriesRows = await selectAll<{ id: string; afl_slug: string | null; anilist_id: number | null; title: string; aired_episodes: number | null }>(
      'series',
      'id, afl_slug, anilist_id, title, aired_episodes',
    );
    const seriesById = new Map(seriesRows.map((s) => [s.id, s]));

    for (const reg of registry) {
      try {
        const s = seriesById.get(reg.series_id);
        if (!s?.anilist_id) continue;
        if (RULED_SPLITS.has(reg.external_id)) {
          actions.push(`${s.id}: afg:${reg.external_id} spans a ruled split — skipped by ruling`);
          continue;
        }
        const { data: staged } = await db
          .from('ingest_afg_pages')
          .select('raw')
          .eq('slug', reg.external_id)
          .maybeSingle();
        const stagedRaw = staged?.raw as { episodes: { number: number }[] } | undefined;
        if (!stagedRaw || stagedRaw.episodes.length < 6) continue;
        const stagedMax = stagedRaw.episodes.reduce((m, e) => Math.max(m, e.number), 0);

        const { data: maxRow } = await db
          .from('episodes')
          .select('number')
          .eq('series_id', s.id)
          .order('number', { ascending: false })
          .limit(1);
        const ourMax = maxRow?.[0]?.number ?? 0;
        const { count: ourCount } = await db
          .from('episodes')
          .select('*', { count: 'exact', head: true })
          .eq('series_id', s.id);
        // candidacy compares against the series' STRUCTURE (components /
        // totals / aired), not the episodes table — a pre-stitch-aware
        // expansion could hold AFG's full multi-season list against a
        // single-season structure (Cuckoos 36 eps vs total 24), which the
        // episode count alone can't see
        const comps = await selectAll<{ episode_end: number | null }>('series_components', 'episode_end', (q) => q.eq('series_id', s.id));
        const covered = Math.max(
          0,
          ...comps.map((c) => c.episode_end ?? 0),
        );
        const structure = Math.max(covered, s.aired_episodes ?? 0);
        // extend only when AFG'S numbering outruns our structure — our own
        // episodes exceeding it is the ruled AFL-extras class (Angel Beats
        // OVAs, Kenshin 95-100), already accepted per-case; walking chains to
        // "explain" extras grabs unrelated OVAs
        const wantsExtend = stagedMax > structure + 2;
        const wantsFill = stagedMax > ourMax + 2 || (ourCount ?? 0) < stagedRaw.episodes.length;
        if (!wantsExtend && !wantsFill) continue;

        // fresh fetch: typed parser output + raw HTML guaranteed
        const res = await politeFetch(`${AFG_BASE}/anime/${reg.external_id}/`);
        counters.fetched++;
        if (res.status !== 200 || !res.html) {
          actions.push(`${s.id}: HTTP ${res.status} on afg:${reg.external_id}`);
          continue;
        }
        const page = parseAfgPage(res.html);
        await db.from('ingest_afg_pages').upsert({
          slug: reg.external_id,
          raw: { title: page.title, seasons: page.seasons, episodes: page.episodes },
          raw_html: res.html,
          content_hash: contentHash({ title: page.title, seasons: page.seasons, episodes: page.episodes }),
          etag: res.etag,
          last_modified: res.lastModified,
          fetched_at: new Date().toISOString(),
          changed_at: new Date().toISOString(),
        });
        const afgMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
        if (afgMax <= structure + 2 && afgMax <= ourMax + 2 && (ourCount ?? 0) >= page.episodes.length) continue;

        // the AniList chain must independently confirm AFG's numbering
        const owned = await ownedAnilistIds(s.id);
        const { chain, ambiguity } = await walkChain(s.anilist_id, afgMax, owned);
        const chainAired = chain.reduce((sum, m) => sum + aired(m), 0);
        const lagOk = chainAired > afgMax && chain.length > 0 && chainAired - afgMax <= aired(chain[chain.length - 1]);
        if (!chain.length || ambiguity || (Math.abs(chainAired - afgMax) > 2 && !lagOk)) {
          await fileFlagOnce(runId, `afg:${reg.external_id}`, 'afg', 'count_mismatch', {
            stage: 'extend',
            seriesId: s.id,
            afgMax,
            ourMax,
            chainAired,
            chain: chain.map((m) => ({ id: m.id, title: m.title.romaji, aired: aired(m) })),
            ambiguity,
            note: 'AFG covers more than we hold but the AniList chain does not confirm — possible ruled split, specials numbering, or relation-graph gap',
          });
          counters.flagged++;
          actions.push(`FLAGGED ${s.id}: afg ${afgMax} vs chain ${chainAired} (ours ${ourMax})${ambiguity ? ` — ${ambiguity}` : ''}`);
          continue;
        }
        if (chainAired < ourMax - 2 && !lagOk) {
          actions.push(`${s.id}: chain (${chainAired}) would shrink us (${ourMax}) — skipped`);
          continue;
        }

        for (const m of chain) await stageAniList(m);
        const row = aggregate(chain, s.afl_slug, s.title);
        row.id = s.id; // canonical id is stable once assigned — never re-keyed here
        row.title = s.title; // naming changes go through resolver/stitcher paths only
        Object.assign(
          row,
          await applyScope(s.afl_slug ?? `afg:${reg.external_id}`, {
            total_volumes: row.total_volumes,
            total_chapters: row.total_chapters,
            manga_start_volume: row.manga_start_volume,
            manga_start_chapter: row.manga_start_chapter,
          }),
        );
        applyEpisodeFloor(s.id, row, Math.max(afgMax, ourMax));
        const { error: sErr } = await db.from('series').upsert(row);
        if (sErr) throw new Error(sErr.message);

        // MERGE episodes: existing rows (AFL = type authority) untouched;
        // AFG fills only the numbers we lack
        const have = new Set<number>();
        for (const r of await selectAll<{ number: number }>('episodes', 'number', (q) => q.eq('series_id', s.id))) have.add(r.number);
        // per-series rulings (community caps + type overrides) apply to
        // every episode writer, extension fills included
        const fill = filterEpisodeRows(s.id, page.episodes
          .filter((e) => !have.has(e.number))
          .map((e) => ({ series_id: s.id, number: e.number, title: e.title, type: e.type, air_date: null })), 'afg', { ties: await loadEpisodeTies(s.id) }); // T26: the side_source default
        for (let i = 0; i < fill.length; i += 500) {
          const { error } = await db.from('episodes').insert(fill.slice(i, i + 500).map((r) => ({ ...r, minted_by: 'afg' }))); // G57: the fill is AFG's
          if (error) throw new Error(error.message);
        }

        await writeComponents(s.id, chain, s.afl_slug);
        await syncAnchors(runId, s.id, reg.external_id, page);
        await db
          .from('ingest_flags')
          .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
          .in('series_key', [reg.external_id, `afg:${reg.external_id}`])
          .eq('kind', 'count_mismatch')
          .eq('status', 'open');

        counters.changed++;
        actions.push(
          `EXTENDED ${s.id}: ${ourMax} → ${afgMax} eps (+${fill.length} from AFG), ${chain.length} components (${chain.map((m) => m.id).join(' → ')})`,
        );
      } catch (e) {
        actions.push(`${reg.series_id}: ERROR ${String(e).slice(0, 120)}`);
      }
    }

    await finishRun(runId, 'ok', counters, 'afg extend');
    console.log('\n=== AFG EXTEND COMPLETE ===');
    for (const a of actions) console.log('  -', a);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
