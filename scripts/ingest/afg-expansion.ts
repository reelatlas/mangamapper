// AFG expansion (Sean's YES, franchise-rulings + data-pipeline §12): AFG-only
// shows (Frieren, Solo Leveling…) become canonical series. AFL stays the type
// authority wherever it exists; here AFG's own 3-way taxonomy (red=filler,
// blue=mixed, plain=canon; no anime-canon) classifies episodes, with
// provenance via the identity registry (source 'afg').
//
// STITCH-AWARE (2026-08-24, Sean's go): AFG numbers episodes continuously
// across a whole story while AniList holds one entry per season, so the
// matched entry's SEQUEL chain is walked (lib/chain, ownership-guarded)
// before the alignment gate — multi-season AFG-only shows (Solo Leveling,
// Oshi no Ko…) now pass with proper season components instead of tripping
// the ±12 gate. All standard guards still apply: exact-match-or-flag,
// sparse guard, alignment ±2 with airing-lag allowance, scopes, registry.
//   npx tsx --env-file=.env.ingest scripts/ingest/afg-expansion.ts

import { AFG_BASE, parseAfgPage } from './lib/afg';
import { politeFetch } from './lib/http';
import { contentHash } from './lib/hash';
import { searchAnime } from './lib/anilist';
import { db, startRun, finishRun, fileFlagOnce } from './lib/db';
import { stageAniList, registerIds, applyScope, applyEpisodeFloor } from './lib/resolve';
import { aired, walkChain, aggregate, writeComponents, ownedAnilistIds } from './lib/chain';
import { syncAnchors } from './lib/anchors';
import { slugify } from './lib/slug';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const normalize = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').trim();
// whitespace-insensitive second key: AFG "Ao Ashi" vs AniList "Aoashi"
const squash = (s: string) => normalize(s).replace(/ /g, '');

async function main() {
  const runId = await startRun('afg');
  const counters = { fetched: 0, unchanged: 0, changed: 0, flagged: 0 };
  const actions: string[] = [];
  let created = 0;

  try {
    // targets: staged AFG pages with real episode lists, not already serving a canonical series
    const { data: pages } = await db.from('ingest_afg_pages').select('slug, raw, etag, last_modified');
    const { data: series } = await db.from('series').select('id, afl_slug, title');
    const taken = new Set<string>();
    for (const s of series ?? []) {
      if (s.afl_slug) taken.add(s.afl_slug);
      taken.add(s.id);
      taken.add(slugify(s.title));
    }
    const { data: afgReg } = await db.from('series_external_ids').select('external_id').eq('source', 'afg');
    for (const r of afgReg ?? []) taken.add(r.external_id);

    const targets = (pages ?? []).filter((p) => {
      const raw = p.raw as { title: string; episodes: unknown[] };
      return raw.episodes.length >= 6 && !taken.has(p.slug) && !taken.has(slugify(raw.title));
    });
    console.log(`[expansion] ${targets.length} AFG-only candidates`);

    const owned = await ownedAnilistIds();

    for (const t of targets) {
      try {
        // fresh fetch so the typed parser output is guaranteed (raw HTML kept
        // greedily — AFG's between-season reading guidance lives in the prose)
        const res = await politeFetch(`${AFG_BASE}/anime/${t.slug}/`);
        counters.fetched++;
        if (res.status !== 200 || !res.html) {
          actions.push(`${t.slug}: HTTP ${res.status}`);
          continue;
        }
        const page = parseAfgPage(res.html);
        if (page.episodes.length < 6) continue;
        await db.from('ingest_afg_pages').upsert({
          slug: t.slug,
          raw: { title: page.title, seasons: page.seasons, episodes: page.episodes },
          raw_html: res.html,
          content_hash: contentHash({ title: page.title, seasons: page.seasons, episodes: page.episodes }),
          etag: res.etag,
          last_modified: res.lastModified,
          fetched_at: new Date().toISOString(),
          changed_at: new Date().toISOString(),
        });

        // exact-match-or-flag against AniList (series formats preferred;
        // whitespace-insensitive full-title equality, never prefix-matching).
        // Accented queries can return zero hits (Café Terrace) — retry the
        // search ASCII-folded; the equality check itself is unchanged.
        let hits = await searchAnime(page.title);
        await sleep(800);
        if (!hits.length) {
          hits = await searchAnime(normalize(page.title));
          await sleep(800);
        }
        const want = squash(page.title);
        const SERIES_FORMATS = new Set(['TV', 'TV_SHORT', 'ONA']);
        const sorted = [...hits].sort(
          (a, b) => Number(SERIES_FORMATS.has(b.format ?? '')) - Number(SERIES_FORMATS.has(a.format ?? '')),
        );
        const hit = sorted.find((h) =>
          [h.title.romaji, h.title.english, h.title.native, ...h.synonyms]
            .filter(Boolean)
            .some((x) => squash(String(x)) === want),
        );
        if (!hit) {
          await fileFlagOnce(runId, `afg:${t.slug}`, 'afg', 'match_ambiguous', {
            title: page.title,
            candidates: hits.map((h) => ({ id: h.id, romaji: h.title.romaji })),
          });
          counters.flagged++;
          actions.push(`${t.slug}: no exact AniList match — flagged`);
          continue;
        }

        const afgMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);

        // AFG numbers the whole story: walk the matched entry's chain
        // (ownership-guarded — never crosses into another canonical series)
        const { chain, ambiguity } = await walkChain(hit.id, afgMax, owned);
        if (!chain.length || ambiguity) {
          await fileFlagOnce(runId, `afg:${t.slug}`, 'afg', 'match_ambiguous', {
            title: page.title,
            anilistId: hit.id,
            ambiguity: ambiguity ?? 'empty chain',
          });
          counters.flagged++;
          actions.push(`${t.slug}: chain ambiguity — flagged (${ambiguity})`);
          continue;
        }
        const chainAired = chain.reduce((s, m) => s + aired(m), 0);
        const lagOk =
          chainAired > afgMax && chainAired - afgMax <= aired(chain[chain.length - 1]);
        if (Math.abs(chainAired - afgMax) > 2 && !lagOk) {
          await fileFlagOnce(runId, `afg:${t.slug}`, 'afg', 'count_mismatch', {
            afgMax,
            chainAired,
            chain: chain.map((m) => ({ id: m.id, title: m.title.romaji, aired: aired(m) })),
            note: 'AFG numbering misaligned with the AniList chain — expansion withheld',
          });
          counters.flagged++;
          actions.push(`${t.slug}: afg ${afgMax} vs chain ${chainAired} — flagged`);
          continue;
        }
        // sparse guard against the whole chain (same rule as the resolver's)
        const chainFinished = chain.every((m) => m.status !== 'RELEASING');
        const chainTotal = chain.every((m) => m.episodes != null)
          ? chain.reduce((s, m) => s + (m.episodes ?? 0), 0)
          : null;
        if (chainFinished && chainTotal != null && page.episodes.length < chainTotal * 0.6) {
          await fileFlagOnce(runId, `afg:${t.slug}`, 'afg', 'count_mismatch', {
            sparse: true,
            afgClassified: page.episodes.length,
            chainTotal,
          });
          counters.flagged++;
          continue;
        }

        for (const m of chain) await stageAniList(m);
        const row = aggregate(chain, null, page.title);
        let id: string | null = null;
        for (const candidate of [row.id, `${row.id}-${chain[0].startDate.year ?? ''}`, `${row.id}-${chain[0].id}`]) {
          const clean = candidate.replace(/-$/, '');
          const { data: clash } = await db.from('series').select('id').eq('id', clean).maybeSingle();
          if (!clash) {
            id = clean;
            break;
          }
        }
        if (!id) continue;
        row.id = id;
        row.search_text = [row.search_text, page.title.toLowerCase()].join(' ');
        Object.assign(
          row,
          await applyScope(`afg:${t.slug}`, {
            total_volumes: row.total_volumes,
            total_chapters: row.total_chapters,
            manga_start_volume: row.manga_start_volume,
            manga_start_chapter: row.manga_start_chapter,
          }),
        );

        applyEpisodeFloor(id, row, afgMax);
        const { error: sErr } = await db.from('series').upsert(row);
        if (sErr) throw new Error(sErr.message);
        await registerIds(id, { anilist: chain[0].id, mal: chain[0].idMal, afg: t.slug });
        for (const m of chain) owned.add(m.id);

        await db.from('episodes').delete().eq('series_id', id);
        const epRows = page.episodes.map((e) => ({
          series_id: id!,
          number: e.number,
          title: e.title,
          type: e.type, // AFG's 3-way; no anime-canon in their vocabulary
          air_date: null,
        }));
        for (let i = 0; i < epRows.length; i += 500) {
          const { error } = await db.from('episodes').insert(epRows.slice(i, i + 500));
          if (error) throw new Error(error.message);
        }
        await writeComponents(id, chain, null);
        await syncAnchors(runId, id, t.slug, page);

        // identity + counts resolved: close any flags this page accumulated
        await db
          .from('ingest_flags')
          .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
          .eq('series_key', `afg:${t.slug}`)
          .eq('status', 'open');

        created++;
        counters.changed++;
        actions.push(
          `CREATED ${id} (${epRows.length} eps, ${chain.length} season${chain.length > 1 ? 's' : ''}: ${chain.map((m) => m.id).join(' → ')})`,
        );
      } catch (e) {
        actions.push(`${t.slug}: ERROR ${String(e).slice(0, 100)}`);
      }
    }

    await finishRun(runId, 'ok', counters, `afg expansion: ${created} series created`);
    console.log('\n=== AFG EXPANSION COMPLETE ===');
    for (const a of actions) console.log('  -', a);
    const { count } = await db.from('series').select('*', { count: 'exact', head: true });
    console.log(`canonical series: ${count} (+${created})`);
  } catch (err) {
    await finishRun(runId, 'error', counters, String(err));
    throw err;
  }
}
main().then(() => process.exit(0));
