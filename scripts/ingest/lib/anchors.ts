// Shared anchor synchronization — used by afg-backfill, rederive-anchors,
// and the refresh-afg edge function (single source of truth for the anchor
// write path: monotonicity-filtered derivation, alignment gate, registry,
// flag dismissal, and the volumes-staleness event trigger).

import { deriveAnchors, deriveBonusChapters, type AfgPage, type AfgContinua } from './afg';
import { db, fileFlagOnce, selectAll } from './db';
import { upsertAnnotation } from './annotations';
import { CONTINUA_SUPPRESSED, registerIds, translateEpisodeNumber } from './resolve';
import { isAnchorSuppressed } from './rulings/anchor-suppressed';

// heading comparison: decode leftover entities, drop parenthetical year
// suffixes ("Rurouni Kenshin (1996)"), then collapse to word soup
const norm = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/\(\s*\d{4}\s*\)/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// AFG continua-manga application (Sean's full-source ruling 2026-08-23):
// a staged continua table becomes an end-frontier anchor (source
// 'afg-continua') + a volume boundary — behind the full gate stack:
// identity guard (heading vs series names — SHY's page carried Kamonohashi
// Ron's heading), self-consistency (continue-1 = end), chapter-space gate,
// episode sanity. PRECEDENCE at the (series, episode) PK: manual/wiki are
// never overwritten (continua cross-CHECKS them, disagreement >1 flags);
// chart-'afg'/mu yield to the curated continua (>2 disagreement flags).
// Boundaries write absent-only; a disagreeing Wikipedia boundary flags —
// sources verify each other in conjunction, none limits another.
// Shared by afg-continua-apply.ts (sweep) and refresh-afg (inline upkeep).
export async function applyContinua(
  runId: number,
  seriesId: string,
  continua: AfgContinua | null | undefined,
  // the AFG page's own highest charted episode — tells us which numbering
  // space the page lives in (see the conversion note below)
  afgPageMax?: number,
): Promise<'applied' | 'withheld' | 'kept_curated' | 'no_data' | 'suppressed' | 'refused_episode_type'> {
  // research-ruled suppression (Claymore/Kimi lesson): a source value proven
  // WRONG for a series must not re-enter on any refresh — same-episode
  // precedence can't stop it landing on a different episode
  if (CONTINUA_SUPPRESSED[seriesId]) {
    await db.from('chapter_anchors').delete().eq('series_id', seriesId).eq('source', 'afg-continua');
    return 'suppressed';
  }
  if (!continua || continua.endChapter === null) return 'no_data';
  const { data: s } = await db
    .from('series')
    .select('id, title, title_native, aired_episodes, total_chapters, latest_known_chapters, manga_anilist_id, search_text')
    .eq('id', seriesId)
    .maybeSingle();
  if (!s) return 'no_data';

  // parity-continue preservation (Sean's C2 rule 2026-08-24): snapshot the
  // old continua row's continue fields; restored below when the fresh pin
  // lands on the same episode
  const { data: prevContinua } = await db
    .from('chapter_anchors')
    .select('episode, continue_chapter, continue_kind, continue_note')
    .eq('series_id', s.id)
    .eq('source', 'afg-continua')
    .not('continue_chapter', 'is', null)
    .maybeSingle();
  await db.from('chapter_anchors').delete().eq('series_id', s.id).eq('source', 'afg-continua');

  const heading = continua.heading ? norm(continua.heading) : null;
  const names = norm(`${s.title} ${s.title_native ?? ''} ${s.search_text ?? ''} ${s.id.replace(/-/g, ' ')}`);
  if (heading && !names.includes(heading)) {
    await fileFlagOnce(runId, s.id, 'afg', 'parse_integrity', {
      continuaHeading: continua.heading,
      note: 'continua table heading names a DIFFERENT series (AFG template bug class — Cuckoos carried Dandadan\'s table) — data withheld, verify by hand',
    });
    return 'withheld';
  }
  // continue-from is READING GUIDANCE, not a restatement of the frontier —
  // AFG legitimately says "skip ahead to 127" (recap chapters) or "restart
  // at 76" (rushed adaptation). Only an absurd gap (>40 ch) marks the parse
  // itself suspect.
  if (
    continua.continueChapter !== null &&
    Math.abs(continua.continueChapter - 1 - continua.endChapter) > 40
  ) {
    await fileFlagOnce(runId, s.id, 'afg', 'parse_integrity', {
      endChapter: continua.endChapter,
      continueChapter: continua.continueChapter,
      note: 'continua frontier and continue-from are wildly apart — parse suspect, withheld',
    });
    return 'withheld';
  }
  const spaceMax = Math.max(s.total_chapters ?? 0, s.latest_known_chapters ?? 0);
  if (spaceMax > 0 && continua.endChapter > spaceMax + 10) {
    await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
      continuaEndChapter: continua.endChapter,
      spaceMax,
      note: "continua frontier exceeds this entry's chapter space — partial structure or edition mismatch; withheld",
    });
    return 'withheld';
  }
  // NUMBERING CONVERSION (§10 rule, systematized 2026-08-23): AFG counts in
  // MAL-style numbering — our community count can insert numbered OVAs/
  // specials mid-run (Haikyu's Riku vs Kuu = our eps 61-62, so AFG's "ep 85"
  // finale is OUR ep 87). The components table knows every insert: walk the
  // non-season numbered components in order, shifting the claimed episode
  // past each insert that lands at or before it.
  let ep: number | null = null;
  if (continua.endEpisode !== null) {
    let shifted = continua.endEpisode;
    // a page whose own chart reaches our full count is ALREADY in our
    // numbering space (its count includes the inserts) — no conversion
    const pageMatchesOurs = afgPageMax !== undefined && afgPageMax >= (s.aired_episodes ?? 0);
    if (!pageMatchesOurs) {
      const inserts = await selectAll<{ episode_start: number | null; episode_end: number | null; kind: string | null }>(
        'series_components',
        'episode_start, episode_end, kind',
        (q) => q.eq('series_id', s.id).not('kind', 'eq', 'season').not('episode_start', 'is', null).order('episode_start'),
      );
      for (const c of inserts) {
        const len = (c.episode_end ?? c.episode_start!) - c.episode_start! + 1;
        if (c.episode_start! <= shifted) shifted += len;
      }
    }
    if (shifted <= (s.aired_episodes ?? 0)) ep = shifted;
  }
  ep ??= s.aired_episodes;
  if (!ep) return 'no_data';

  // A1 at the writer (Sean's D4 ruling, 2026-08-25 — extending D1 to the AFG
  // writers after 49/49 audit hits adjudicated 45 junk / 4 mistyped): filler
  // rows NEVER take anchors (and A44 position-less rows never do). A continua end-frontier landing
  // on one states adaptation for an episode that adapts nothing — refuse the
  // ANCHOR; the continue-from is READING GUIDANCE, not a position, so it
  // still applies. Allow-list (canon/mixed) so unknown types fail closed; a
  // row-less episode can't be typed — the pin stands (D1 parity).
  const { data: epRow } = await db
    .from('episodes')
    .select('type')
    .eq('series_id', s.id)
    .eq('number', ep)
    .maybeSingle();
  if (isAnchorSuppressed(s.id, ep)) return 'refused_episode_type'; // A44: position-less by ruling — no continua anchor, no flag needed (the ruling is the record)
  if (epRow && epRow.type !== 'canon' && epRow.type !== 'mixed') {
    await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
      pinEpisode: ep,
      episodeType: epRow.type,
      continuaEndChapter: continua.endChapter,
      note: `AFG continua frontier lands on a ${epRow.type} episode — A1 forbids the anchor; withheld for research to place the honest terminal on the last canon/mixed episode (D4 episode-type refusal)`,
    });
    if (continua.continueChapter !== null) {
      await db
        .from('series')
        .update({ continue_from_chapter: continua.continueChapter, updated_at: new Date().toISOString() })
        .eq('id', s.id);
    }
    return 'refused_episode_type';
  }

  const { data: holder } = await db
    .from('chapter_anchors')
    .select('source, chapter')
    .eq('series_id', s.id)
    .eq('episode', ep)
    .maybeSingle();
  const diff = holder ? Math.abs(Number(holder.chapter) - continua.endChapter) : 0;
  if (holder && (holder.source === 'manual' || holder.source === 'wiki')) {
    if (diff > 1) {
      await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
        episode: ep,
        [holder.source]: holder.chapter,
        afgContinua: continua.endChapter,
        note: `continua frontier disagrees with the ${holder.source} anchor at ep ${ep} — cross-check finding, ${holder.source} kept`,
      });
    }
    return 'kept_curated';
  }
  if (holder && diff > 2) {
    await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
      episode: ep,
      [holder.source]: holder.chapter,
      afgContinua: continua.endChapter,
      note: `continua frontier disagrees with the ${holder.source} anchor at ep ${ep} by ${diff} ch — continua (curated) applied, verify`,
    });
  }
  const { error } = await db.from('chapter_anchors').upsert({
    series_id: s.id,
    episode: ep,
    volume: null,
    chapter: continua.endChapter,
    source: 'afg-continua',
    note: `AFG continua table: "${continua.text.slice(0, 180)}"`,
    ...(prevContinua && prevContinua.episode === ep
      ? { continue_chapter: prevContinua.continue_chapter, continue_kind: prevContinua.continue_kind, continue_note: prevContinua.continue_note }
      : {}),
  });
  if (error) throw new Error(`applyContinua(${s.id}): ${error.message}`);
  // three-numbers model (2026-08-23): the explicit continue-from is data of
  // its own (may skip recaps or backtrack — never derived as frontier+1).
  // Continua owns it ONLY where it owns the frontier: where manual/wiki
  // rule (kept_curated above), research rules the continue-point too.
  if (continua.continueChapter !== null) {
    await db
      .from('series')
      .update({ continue_from_chapter: continua.continueChapter, updated_at: new Date().toISOString() })
      .eq('id', s.id);
  }

  if (s.manga_anilist_id && continua.continueVolume !== null && continua.volumeStart !== null && continua.volumeEnd !== null) {
    const { data: existing } = await db
      .from('volume_boundaries')
      .select('chapter_start, chapter_end')
      .eq('manga_anilist_id', s.manga_anilist_id)
      .eq('volume', continua.continueVolume)
      .maybeSingle();
    if (!existing) {
      await db.from('volume_boundaries').insert({
        manga_anilist_id: s.manga_anilist_id,
        volume: continua.continueVolume,
        chapter_start: continua.volumeStart,
        chapter_end: continua.volumeEnd,
      });
    } else if (existing.chapter_start !== continua.volumeStart || existing.chapter_end !== continua.volumeEnd) {
      await fileFlagOnce(runId, s.id, 'afg', 'count_mismatch', {
        volume: continua.continueVolume,
        staged: existing,
        afg: { chapter_start: continua.volumeStart, chapter_end: continua.volumeEnd },
        note: 'AFG continua volume boundary disagrees with the staged (Wikipedia) boundary — verify which edition',
      });
    }
  }
  return 'applied';
}

// New anchors reaching this far past the last known volume boundary mean the
// manga has published new volumes — the EVENT that triggers a volumes
// re-ingest for that manga (validation tier is event-driven, never scheduled).
const VOLUME_STALE_MARGIN = 20;

export async function syncAnchors(
  runId: number,
  seriesId: string,
  afgSlug: string,
  page: Pick<AfgPage, 'episodes'>,
): Promise<{ anchors: number; withheld: boolean }> {
  const anchors = deriveAnchors(page.episodes);
  if (!anchors.length) return { anchors: 0, withheld: false };

  const { data: maxRow } = await db
    .from('episodes')
    .select('number')
    .eq('series_id', seriesId)
    .order('number', { ascending: false })
    .limit(1);
  const ourMax = maxRow?.[0]?.number ?? 0;
  const afgMax = page.episodes.reduce((m, e) => Math.max(m, e.number), 0);
  if (ourMax && Math.abs(afgMax - ourMax) > 12) {
    await fileFlagOnce(runId, afgSlug, 'afg', 'count_mismatch', {
      afgMax,
      ourMax,
      seriesId,
      note: 'AFG numbering misaligned — anchors withheld',
    });
    return { anchors: 0, withheld: true };
  }

  // CHAPTER-SPACE gate (Sean 2026-08-23, the Boruto ch-710 class): an AFG
  // page charted in franchise-continuous chapter numbering produces anchors
  // outside this series' own manga space (Boruto has 81 chapters; AFG's rows
  // said 702-710 — Naruto-space). One out-of-space anchor means the whole
  // page's numbering is suspect: withhold and flag, never partially write.
  // The margin absorbs a frontier slightly ahead of stale totals.
  const { data: chapterSpace } = await db
    .from('series')
    .select('total_chapters, latest_known_chapters')
    .eq('id', seriesId)
    .maybeSingle();
  const spaceMax = Math.max(chapterSpace?.total_chapters ?? 0, chapterSpace?.latest_known_chapters ?? 0);
  const maxAnchorCh = anchors.reduce((m, a) => Math.max(m, a.chapter), 0);
  if (spaceMax > 0 && maxAnchorCh > spaceMax + 10) {
    await fileFlagOnce(runId, afgSlug, 'afg', 'parse_integrity', {
      seriesId,
      maxAnchorCh,
      spaceMax,
      note: 'AFG chapters exceed this series\' own manga space — franchise-continuous numbering suspected; anchors withheld',
    });
    return { anchors: 0, withheld: true };
  }

  // PARITY-CONTINUE PRESERVATION (Sean's C2 rule 2026-08-24): continue
  // fields are CURATED data that may live on derived rows — the
  // delete+reinsert rebuild must carry them over by episode, or the hourly
  // cron erodes the catalog-wide parity conversion one series at a time.
  const prevCont = await selectAll<{ episode: number; continue_chapter: number | null; continue_kind: string | null; continue_note: string | null }>(
    'chapter_anchors',
    'episode, continue_chapter, continue_kind, continue_note',
    (q) => q.eq('series_id', seriesId).eq('source', 'afg').not('continue_chapter', 'is', null),
  );
  const contByEp = new Map(prevCont.map((c) => [c.episode, c]));
  await db.from('chapter_anchors').delete().eq('series_id', seriesId).eq('source', 'afg');
  // PRECEDENCE (completed 2026-08-23, the HxH ep-140 lesson): the PK allows
  // one anchor per episode, so a derived chart row at an episode holding a
  // manual/wiki (research-tier) anchor would OVERWRITE the ruling on every
  // refresh. Curated rows always win — derived rows at their episodes drop.
  const curated = await selectAll<{ episode: number; chapter: number }>('chapter_anchors', 'episode, chapter', (q) =>
    q.eq('series_id', seriesId).in('source', ['manual', 'wiki']),
  );
  const protectedEps = new Set(curated.map((c) => c.episode));
  // NUMBERING TRANSLATION (2026-08-23): chart episode numbers live in the
  // source's space — shift-ruled series translate exactly like episode rows
  // (dropped order-only entries never anchor)
  const translated = anchors
    .map((a) => ({ ...a, episode: translateEpisodeNumber(seriesId, a.episode, 'afg') }))
    .filter((a): a is typeof anchors[number] => a.episode !== null);
  // A1 at the writer (Sean's D4 ruling, 2026-08-25, extending D1 to the AFG
  // chart writer): filler rows NEVER take anchors (A44 position-less rows neither). AFG's
  // chapter column is a READING-POSITION CONVERSION that plateaus across
  // noncanon rows (proven by its own duplicate values — one-piece eps
  // 214/216 both print 313 on rows AFG itself marks *Filler), so a chart
  // value on a noncanon row is a conversion artifact, not an adaptation
  // claim. Allow-list (canon/mixed) so unknown types fail closed; row-less
  // episodes pass (can't be typed — D1 parity). Outcome-checked by the
  // anchor_on_noncanon_row audit class.
  // P32 (2026-08-26): this read was UNPAGED — one-piece / detective-conan
  // exceed 1000 rows, so episodes past the cap passed as "row-less". selectAll
  // proves the walk complete or throws.
  const typeRows = await selectAll<{ number: number; type: string }>('episodes', 'number, type', (q) => q.eq('series_id', seriesId));
  const typeByEp = new Map(typeRows.map((e) => [e.number, e.type]));
  const rows = translated
    .filter((a) => {
      const t = typeByEp.get(a.episode);
      return t === undefined || t === 'canon' || t === 'mixed';
    })
    // A44 (2026-08-26): rows ruled POSITION-LESS (cover-page serials, side
    // stories without a chapter number, acts behind an earlier anchor) never
    // take a chart anchor — the type gate cannot hold them (they are mixed)
    .filter((a) => !isAnchorSuppressed(seriesId, a.episode))
    .filter((a) => !protectedEps.has(a.episode))
    // curated-CONSISTENCY (2026-08-23, the Boruto ep-219 lesson): a derived
    // row that contradicts the ordering around a research-tier anchor
    // (chapter above a later curated anchor, or below an earlier one) is
    // chart imprecision — the ruling wins, the derived row drops. Ruled
    // rearrangements live as annotations, never as derived rows.
    .filter((a) =>
      (curated ?? []).every((c) =>
        a.episode < c.episode ? a.chapter <= c.chapter : a.episode > c.episode ? a.chapter >= c.chapter : true,
      ),
    )
    .map((a) => ({
      series_id: seriesId,
      episode: a.episode,
      volume: null,
      chapter: a.chapter,
      start_chapter: a.startChapter,
      chapters_adapted: a.chaptersAdapted,
      source: 'afg',
      note: a.arc,
      continue_chapter: contByEp.get(a.episode)?.continue_chapter ?? null,
      continue_kind: contByEp.get(a.episode)?.continue_kind ?? null,
      continue_note: contByEp.get(a.episode)?.continue_note ?? null,
    }));
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db.from('chapter_anchors').upsert(rows.slice(i, i + 500));
    if (error) throw new Error(`anchors (${seriesId}): ${error.message}`);
  }
  // bonus/fractional chapter associations → graft annotations, FILL-ONLY
  // (Sean's ruling 2026-08-23: never silently dropped — we must always know
  // what content makes up an episode; research-tier annotations at the same
  // episode+kind are never clobbered, and the pending review flags it)
  const bonus = deriveBonusChapters(page.episodes)
    .map((b) => ({ ...b, episode: translateEpisodeNumber(seriesId, b.episode, 'afg') }))
    .filter((b): b is { episode: number; chapters: number[] } => b.episode !== null);
  for (const b of bonus) {
    await upsertAnnotation(
      {
        series_id: seriesId,
        episode: b.episode,
        kind: 'graft',
        chapters: b.chapters.join(', '),
        note: `AFG chart lists bonus/fractional chapter(s) ${b.chapters.join(', ')} woven into this episode beyond the mainline (auto-recorded; research refines — may even BE the anchor if the episode adapts the bonus)`,
      },
      { ignoreDuplicates: true },
    );
  }
  if (bonus.length) {
    await db.from('series').update({ asterisk_review: 'pending' }).eq('id', seriesId).is('asterisk_review', null);
  }
  await registerIds(seriesId, { afg: afgSlug });
  await db
    .from('ingest_flags')
    .update({ status: 'dismissed', resolved_at: new Date().toISOString() })
    .eq('series_key', afgSlug)
    .eq('source', 'afg')
    .eq('status', 'open');

  // volumes-staleness event: anchors past the final boundary = new volumes exist
  const { data: series } = await db.from('series').select('manga_anilist_id').eq('id', seriesId).maybeSingle();
  if (series?.manga_anilist_id) {
    const { data: lastBoundary } = await db
      .from('volume_boundaries')
      .select('chapter_start')
      .eq('manga_anilist_id', series.manga_anilist_id)
      .order('volume', { ascending: false })
      .limit(1);
    const lastStart = lastBoundary?.[0]?.chapter_start;
    const maxChapter = Math.max(...rows.map((r) => r.chapter));
    if (lastStart != null && maxChapter > Number(lastStart) + VOLUME_STALE_MARGIN) {
      await fileFlagOnce(runId, `manga:${series.manga_anilist_id}`, 'wikipedia', 'count_mismatch', {
        seriesId,
        maxAnchorChapter: maxChapter,
        lastBoundaryStart: lastStart,
        note: 'anchors passed the last known volume boundary — published volumes likely grew; re-run volumes-backfill for this manga',
      });
    }
  }

  return { anchors: rows.length, withheld: false };
}
