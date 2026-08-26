// UI-truth audit (Sean 2026-08-24: "still quite a few series where manga says
// mapping pending"): replicates buildMapping's EXACT decision points
// (supabaseSource.ts) for every series and classifies what the card actually
// renders — the data-level coverage audit can say "resolved" while a UI gate
// (volume ratio, synthesis prerequisites) still blanks the display. Keep the
// logic in lockstep with supabaseSource.ts when either changes.
// Classes: ok_full / ok_no_volume / pending_* / no_source /
// integrity_eps_beyond_total (episodes outrun the component structure).
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-ui-truth.ts

import { db, selectAll } from './lib/db';
import { c3Ahead, hasSkipLanguage } from './lib/c3';
import { COMMUNITY_COUNT_OVERRIDES, CONTINUA_SUPPRESSED, EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS } from './lib/resolve';
import { REVIEWED_NUMBERED_SPECIALS } from './lib/rulings/reviewed-specials';

async function main() {
  const series = await selectAll<any>('series', 'id, source_type, manga_status, status, aired_episodes, total_episodes, total_chapters, total_volumes, latest_known_chapters, manga_anilist_id, manga_start_chapter, mapping_mode, asterisk_review');
  const episodes = await selectAll<any>('episodes', 'series_id, number, type, title, air_date');
  const anchors = await selectAll<any>('chapter_anchors', 'series_id, episode, chapter, start_chapter, chapters_adapted, continue_chapter, continue_note, volume, source');
  const comps = await selectAll<any>('series_components', 'series_id, episode_end, episode_start, anilist_id, kind, label');
  const bounds = await selectAll<any>('volume_boundaries', 'manga_anilist_id, volume, chapter_start, chapter_end');

  const epsBy = new Map<string, { max: number; lastCanon: number; count: number }>();
  for (const e of episodes) {
    const s = epsBy.get(e.series_id) ?? { max: 0, lastCanon: 0, count: 0 };
    s.max = Math.max(s.max, e.number);
    s.count++;
    if (e.type !== 'filler') s.lastCanon = Math.max(s.lastCanon, e.number);
    epsBy.set(e.series_id, s);
  }
  const anchBy = new Map<string, { episode: number; chapter: number; volume: number | null }>();
  // MU-pin verification queue (Sean 2026-08-23): 5 of the first 10 solo MU
  // pins research checked were WRONG (whole-manga counts, other-season
  // endpoints, continue-pointers stored as ends). A series whose ONLY
  // anchors are source 'mu' is unverified BY DEFINITION — batches drain the
  // big ones via anchor_gap_research, but short series never cross the gap
  // threshold, so this class keeps every remaining unverified pin visible.
  // Verification exit: research confirms or corrects the pin and the batch
  // record rewrites it as source 'manual' with citations.
  const anchorSrcs = new Map<string, Set<string>>();
  for (const a of anchors) {
    const cur = anchBy.get(a.series_id);
    if (!cur || a.episode > cur.episode) anchBy.set(a.series_id, a);
    if (!anchorSrcs.has(a.series_id)) anchorSrcs.set(a.series_id, new Set());
    anchorSrcs.get(a.series_id)!.add(a.source);
  }
  const compEnd = new Map<string, number>();
  const degenerateSpans: string[] = [];
  for (const c of comps) {
    if (c.episode_end != null) compEnd.set(c.series_id, Math.max(compEnd.get(c.series_id) ?? 0, c.episode_end));
    // an unaired component must hold a NULL span, never start > end
    // (writeComponents guards this; Tokyo Revengers' Santen Sensou-hen
    // was the 51-50 escape that motivated the class)
    if (c.episode_start != null && c.episode_end != null && c.episode_start > c.episode_end) {
      degenerateSpans.push(`${c.series_id}: ${c.label} spans ${c.episode_start}-${c.episode_end}`);
    }
  }
  const boundsBy = new Map<number, any[]>();
  for (const b of bounds) {
    if (!boundsBy.has(b.manga_anilist_id)) boundsBy.set(b.manga_anilist_id, []);
    boundsBy.get(b.manga_anilist_id)!.push(b);
  }
  const volumeFor = (row: any, chapter: number): number | null => {
    for (const b of boundsBy.get(row.manga_anilist_id) ?? []) {
      if (chapter >= b.chapter_start && (b.chapter_end === null || chapter <= b.chapter_end)) return b.volume;
    }
    if (!row.total_volumes || !row.total_chapters) return null;
    return Math.min(row.total_volumes, Math.max(1, Math.ceil((chapter * row.total_volumes) / row.total_chapters)));
  };

  const classes: Record<string, string[]> = {
    boundaries_wrong_page: [], boundaries_beyond_total: [],
    integrity_eps_beyond_total: [], integrity_total_beyond_eps: [], integrity_double_claimed: [],
    integrity_degenerate_span: degenerateSpans,
    special_numbered_unreviewed: [], anchor_gap_research: [], frontier_tail_null: [],
    anchor_nonmonotonic: [], anchor_start_offtrend: [], anchor_beyond_chapter_space: [], anchor_beyond_display_total: [], anchor_fractional_chapter: [], anchor_on_noncanon_row: [], continue_skip_unnoted: [], boundaries_degenerate: [], ruling_violation: [],
    mu_pin_unverified: [],
    rearranged_zone_unanchored: [], rearranged_zone_acknowledged: [],
    title_incomplete: [], airdate_incomplete: [], asterisk_unreviewed: [],
    fractional_unmodeled: [],
    no_source: [], ok_full: [], ok_no_volume: [], ok_loose: [],
    pending_airing_no_anchor: [], pending_finished_no_totals: [], pending_no_canon: [], pending_other: [],
  };
  // Sean's standing rule (2026-08-24, N7): any non-typical entry NUMBERED
  // into a run by any source is a research trigger — the reviewed set (with
  // each ruling's reason) lives in lib/rulings/reviewed-specials.ts.
  for (const c of comps) {
    if (c.kind && c.kind !== 'season' && c.episode_start != null && !REVIEWED_NUMBERED_SPECIALS.has(`${c.series_id}:${c.anilist_id}`)) {
      classes.special_numbered_unreviewed.push(`${c.series_id}: ${c.kind} "${c.label ?? c.anilist_id}" numbered ${c.episode_start}-${c.episode_end ?? '?'} [${c.series_id}:${c.anilist_id}]`);
    }
  }
  // ownership integrity: one AniList entry claimed by two series' components
  // = legacy pre-ownership-guard damage or an unresolved duplicate entry
  {
    const claims = new Map<number, Set<string>>();
    for (const c of comps) {
      if (c.anilist_id == null) continue;
      if (!claims.has(c.anilist_id)) claims.set(c.anilist_id, new Set());
      claims.get(c.anilist_id)!.add(c.series_id);
    }
    for (const [aid, owners] of claims) {
      if (owners.size > 1) classes.integrity_double_claimed.push(`anilist ${aid} ← ${[...owners].join(' AND ')}`);
    }
  }
  // RULING VIOLATIONS (Sean 2026-08-23, "no one-offs — ways to ensure
  // integrity"): every ruling in lib/resolve is verified OUTCOME-side here,
  // so a writer that forgets the shared gate (or a new writer added later)
  // surfaces as data, regardless of which code path misbehaved. Enforcement
  // lives in filterEpisodeRows/applyCommunityCap; this checks the DB agrees.
  for (const [sid, o] of Object.entries(COMMUNITY_COUNT_OVERRIDES)) {
    const above = episodes.filter((e: any) => e.series_id === sid && e.number > o.cap);
    if (above.length) classes.ruling_violation.push(`${sid}: ${above.length} episode rows above the community cap ${o.cap}`);
    const row = series.find((s: any) => s.id === sid);
    if (row && (row.aired_episodes > o.cap || (row.total_episodes ?? 0) > o.cap)) {
      classes.ruling_violation.push(`${sid}: totals ${row.aired_episodes}/${row.total_episodes} exceed the community cap ${o.cap}`);
    }
  }
  // SHIFT VERIFICATION (Sean 2026-08-23: rules that move numbering must
  // prove nothing broke): for every SOURCE_NUMBERING_SHIFTS series, verify
  // outcome-side that (a) no two ADJACENT rows share a non-empty title (the
  // stale-zone signature — dr-stone's ep 57/58 wore the same title after a
  // partial heal) and (b) the numbered run is contiguous 1..max (translation
  // must never leave holes).
  for (const sid of Object.keys(SOURCE_NUMBERING_SHIFTS)) {
    const rows = episodes.filter((e: any) => e.series_id === sid).sort((a: any, b: any) => a.number - b.number);
    for (let i = 1; i < rows.length; i++) {
      const a = String(rows[i - 1].title ?? '').trim();
      const b = String(rows[i].title ?? '').trim();
      if (a && a === b) classes.ruling_violation.push(`${sid}: eps ${rows[i - 1].number}/${rows[i].number} share title "${a.slice(0, 30)}" — stale shifted row suspected`);
      if (rows[i].number !== rows[i - 1].number + 1) classes.ruling_violation.push(`${sid}: numbering hole between ${rows[i - 1].number} and ${rows[i].number} after translation`);
    }
  }
  {
    // suppressed sources must hold ZERO anchors on their series
    const suppressed = Object.keys(CONTINUA_SUPPRESSED);
    if (suppressed.length) {
      const bad = await selectAll<{ series_id: string; episode: number; chapter: number }>('chapter_anchors', 'series_id, episode, chapter', (q) => q.in('series_id', suppressed).eq('source', 'afg-continua'));
      for (const b of bad) classes.ruling_violation.push(`${b.series_id}: suppressed afg-continua anchor present (ep ${b.episode} → ch ${b.chapter})`);
    }
  }
  for (const [sid, types] of Object.entries(EPISODE_TYPE_OVERRIDES)) {
    for (const [num, want] of Object.entries(types)) {
      const row = episodes.find((e: any) => e.series_id === sid && e.number === Number(num));
      if (row && row.type !== want) classes.ruling_violation.push(`${sid} ep ${num}: type "${row.type}" contradicts the ruled override "${want}"`);
    }
  }

  // TITLE COMPLETENESS (episode-title initiative, agenda §12.19d — the audit
  // step): every aired episode should carry a real title (never
  // title_pending). Missing = AFL lag on new cours, canon-tier series with
  // no rows yet (titles come from Wikipedia episode lists / AniList labels),
  // or sparse pages. This class is the initiative's work-list.
  {
    const missingBy = new Map<string, number>();
    for (const e of episodes) {
      if (e.title == null || String(e.title).trim() === '') {
        missingBy.set(e.series_id, (missingBy.get(e.series_id) ?? 0) + 1);
      }
    }
    for (const row of series) {
      const rows = epsBy.get(row.id)?.count ?? 0;
      const missing = missingBy.get(row.id) ?? 0;
      const rowless = rows === 0 && (row.aired_episodes ?? 0) > 0;
      if (rowless) classes.title_incomplete.push(`${row.id}: ALL ${row.aired_episodes} eps title_pending (no episode rows — canon-tier)`);
      else if (missing > 0) classes.title_incomplete.push(`${row.id}: ${missing}/${rows} rows missing titles`);
      else if (rows > 0 && rows < (row.aired_episodes ?? 0)) {
        classes.title_incomplete.push(`${row.id}: ${(row.aired_episodes ?? 0) - rows} aired eps have no rows (AFL lag) — render title_pending`);
      }
    }
  }

  // FRACTIONAL entries lacking a watch-order model (Sean 2026-08-23): a
  // staged fractional separator with no order-only component near its
  // position is a non-main entry we have NOT yet ruled on — the ask-Sean
  // queue for specials/recaps/OVAs worth (or not worth) surfacing.
  {
    const fracs = (await selectAll<any>('ingest_fractionals', 'series_id, position, title, disposition')).filter((f: any) => !f.disposition);
    const oo = await selectAll<any>('series_components', 'series_id, watch_position, episode_start');
    const modeled = new Set(
      oo.filter((c: any) => c.episode_start === null && c.watch_position != null).map((c: any) => `${c.series_id}#${Math.floor(Number(c.watch_position))}`),
    );
    for (const f of fracs) {
      if (!modeled.has(`${f.series_id}#${Math.floor(Number(f.position))}`)) {
        classes.fractional_unmodeled.push(`${f.series_id} @ ${f.position}: "${String(f.title ?? '?').slice(0, 45)}" — rule: order-only comp, excluded-recap, or ignore?`);
      }
    }
  }

  // AIR-DATE completeness (metadata contract, Sean 2026-08-23): the year
  // line derives from episode air dates — missing dates degrade metadata.
  // Work-list for the episode-data initiative (dates come from AniList's
  // per-season start/end alongside Wikipedia titles).
  {
    const missingBy = new Map<string, number>();
    const totalBy = new Map<string, number>();
    for (const e of episodes) {
      totalBy.set(e.series_id, (totalBy.get(e.series_id) ?? 0) + 1);
      if (!e.air_date || !String(e.air_date).trim()) missingBy.set(e.series_id, (missingBy.get(e.series_id) ?? 0) + 1);
    }
    for (const [sid, n] of missingBy) classes.airdate_incomplete.push(`${sid}: ${n}/${totalBy.get(sid)} rows missing air_date`);
  }

  // ASTERISK review workflow (Sean 2026-08-23): kinds derive from
  // episode_annotations (single source of truth); series.asterisk_review
  // tracks sign-off. Heals annotated-but-unmarked series to 'pending';
  // 'pending' rows are Sean's sign-off queue for the asterisk UI pass.
  {
    const annos = await selectAll<any>('episode_annotations', 'series_id, kind');
    const kindsBy = new Map<string, Set<string>>();
    for (const a of annos) {
      if (!kindsBy.has(a.series_id)) kindsBy.set(a.series_id, new Set());
      kindsBy.get(a.series_id)!.add(a.kind);
    }
    for (const [sid, kinds] of kindsBy) {
      const row = series.find((s: any) => s.id === sid);
      if (row && !row.asterisk_review) {
        await db.from('series').update({ asterisk_review: 'pending' }).eq('id', sid);
        row.asterisk_review = 'pending';
      }
      if (row?.asterisk_review !== 'approved') {
        classes.asterisk_unreviewed.push(`${sid}: [${[...kinds].join(', ')}] — awaiting Sean sign-off`);
      }
    }
  }

  // non-monotonic anchor sequences (Sean 2026-08-23): confirmed chapters may
  // legitimately jump BACK at a later episode (adaptation reorder) — the
  // display now renders them as stored. Each hit here is therefore either
  // real flow (fine, review once) or numbering-space junk that slipped the
  // write-time chapter-space gate (Boruto's ch-710 class) — ask Sean.
  // Beyond-chapter-space anchors are flagged separately: an anchor chapter
  // past the series' own manga space is junk by definition.
  {
    const bySeries = new Map<string, any[]>();
    for (const a of anchors) {
      if (!bySeries.has(a.series_id)) bySeries.set(a.series_id, []);
      bySeries.get(a.series_id)!.push(a);
    }
    // ruled reorders carry rearranged/graft annotations — settled, stop asking
    const annos = await selectAll<any>('episode_annotations', 'series_id, episode, kind, chapters, note');
    const ruled = new Set(
      annos
        .filter((a: any) => a.kind === 'rearranged' || a.kind === 'graft')
        .map((a: any) => `${a.series_id}#${a.episode}`),
    );
    // REARRANGED-ZONE gap (Sean's GTO 20/21 report, 2026-08-23): an episode
    // annotated rearranged/graft WITH chapter data but NO anchor sits in a
    // zone where interpolation paints a plausible-but-WRONG value — GTO ep
    // 20 showed ~68 while the annotation knew 73-74. Every hit is a
    // research/promotion target: exact per-episode data becomes an anchor
    // (as-stored rendering handles non-monotonic); zone-level-only knowledge
    // stays here as an acknowledged-approximate review item.
    {
      const anchoredEps = new Set(anchors.map((a: any) => `${a.series_id}#${a.episode}`));
      const anchorCount = new Map<string, number>();
      for (const a of anchors) anchorCount.set(a.series_id, (anchorCount.get(a.series_id) ?? 0) + 1);
      const looseIds = new Set(series.filter((s: any) => s.mapping_mode === 'loose').map((s: any) => s.id));
      const hits = new Map<string, number[]>();
      const acked = new Map<string, number[]>();
      // filler/anime-only rows can NEVER take anchors (Sean's A1 ruling
      // 2026-08-24, MHA ep 104): a zone annotation on such a row is context,
      // not an open anchor target — the class must not ask for records the
      // rules forbid
      const epType = new Map(episodes.map((e: any) => [`${e.series_id}#${e.number}`, e.type]));
      for (const a of annos as any[]) {
        if (a.kind !== 'rearranged' && a.kind !== 'graft') continue;
        if (!a.chapters) continue;
        if (looseIds.has(a.series_id)) continue;
        if ((anchorCount.get(a.series_id) ?? 0) < 2) continue; // no interpolation happening
        if (anchoredEps.has(`${a.series_id}#${a.episode}`)) continue;
        const t = epType.get(`${a.series_id}#${a.episode}`);
        if (t === 'filler' || t === 'anime-only-canon') continue;
        // zone-acknowledged rows (batch-15 rule): research established that
        // only zone-level knowledge exists — an acknowledged-approximate
        // review item, not an open research target
        const bucket = String(a.note ?? '').includes('zone-acknowledged') ? acked : hits;
        if (!bucket.has(a.series_id)) bucket.set(a.series_id, []);
        bucket.get(a.series_id)!.push(a.episode);
      }
      for (const [sid, eps] of hits) {
        classes.rearranged_zone_unanchored.push(
          `${sid}: ${eps.length} annotated ep(s) with chapter data but no anchor (${[...new Set(eps)].sort((x, y) => x - y).slice(0, 12).join(', ')}${eps.length > 12 ? ', …' : ''}) — interpolation may misplace them`,
        );
      }
      for (const [sid, eps] of acked) {
        classes.rearranged_zone_acknowledged.push(
          `${sid}: ${eps.length} ep(s) research-acknowledged as zone-level-only (${[...new Set(eps)].sort((x, y) => x - y).slice(0, 12).join(', ')}${eps.length > 12 ? ', …' : ''}) — approximate render accepted`,
        );
      }
    }
    const spaceOf = new Map(series.map((s: any) => [s.id, Math.max(s.total_chapters ?? 0, s.latest_known_chapters ?? 0)]));
    // DISPLAY total per the same-edition band rule (assemble.ts totalChapters,
    // mirrored by applyMuFrontier's count→number conversion): for finished
    // manga the position row's denominator is MU's last chapter NUMBER when
    // AniList's COUNT sits just above it. Coverage must live in that space.
    const displayTotalOf = new Map(series.map((s: any) => {
      const t = s.total_chapters, l = s.latest_known_chapters;
      return [s.id, t != null && l != null && l < t && l >= t * 0.8 ? l : t] as const;
    }));
    const looseAll = new Set(series.filter((s: any) => s.mapping_mode === 'loose').map((s: any) => s.id));
    // A1 outcome check (Sean's A1 ruling, MHA ep 104; writer-side D1 gate
    // 2026-08-24): filler/anime-only rows never take anchors. applyMuFrontier
    // refuses MU pins at the writer; this catches ANY source's violation
    // standing in data. A hit means either the anchor is junk (delete via
    // research, honest terminal on the last canon/mixed ep) or the row's
    // TYPE is wrong — triage, never auto-delete.
    const typeByEp = new Map(episodes.map((e: any) => [`${e.series_id}#${e.number}`, e.type]));
    for (const [sid, list] of bySeries) {
      // LOOSE series are ruled non-linear — their anchors are borrow-maps
      // rendered as stored; monotonicity is not a claim they make
      if (looseAll.has(sid)) continue;
      list.sort((x, y) => x.episode - y.episode);
      for (let i = 1; i < list.length; i++) {
        if (list[i].chapter < list[i - 1].chapter) {
          if (ruled.has(`${sid}#${list[i].episode}`) || ruled.has(`${sid}#${list[i - 1].episode}`)) continue;
          classes.anchor_nonmonotonic.push(
            `${sid}: ep ${list[i - 1].episode}→ch${list[i - 1].chapter} then ep ${list[i].episode}→ch${list[i].chapter} — real reorder or junk? (ask Sean)`,
          );
        }
        // START off-trend (Sean's Oshi ep-4 report, 2026-08-23): a start far
        // below the previous anchor's end means a stray chart value or typo
        // poisoned the "first chapter animated" — the derive guard prevents
        // this for AFG rows; this outcome check catches manual/wiki typos and
        // any future writer that bypasses the guard. Ruled reorders are legal.
        const st = list[i].start_chapter;
        if (st != null && st < list[i - 1].chapter - 1) {
          if (ruled.has(`${sid}#${list[i].episode}`) || ruled.has(`${sid}#${list[i - 1].episode}`)) continue;
          classes.anchor_start_offtrend.push(
            `${sid}: ep ${list[i].episode} start ch${st} sits below prev anchor ep ${list[i - 1].episode}→ch${list[i - 1].chapter} — poisoned start or unruled reorder`,
          );
        }
      }
      const space = spaceOf.get(sid) ?? 0;
      for (const a of list) {
        if (space > 0 && a.chapter > space + 10) {
          classes.anchor_beyond_chapter_space.push(`${sid}: ep ${a.episode}→ch${a.chapter} exceeds manga space (${space})`);
        }
        // count-space pin crossing the number-space display total (Sean's
        // Tokyo Ghoul 144/143 report, 2026-08-24): the position row would
        // render coverage ABOVE its own denominator. Writer-side fix lives
        // in applyMuFrontier; this outcome check catches any writer.
        const dTotal = displayTotalOf.get(sid);
        if (dTotal != null && a.chapter > dTotal) {
          classes.anchor_beyond_display_total.push(`${sid}: ep ${a.episode}→ch${a.chapter} (${a.source}) exceeds the DISPLAY total ${dTotal} (same-edition band) — count-space value in a number-space instrument`);
        }
        // same guard for the OTHER position instruments on the row: START
        // lives strictly inside the run (≤ display total); CONTINUE may sit
        // exactly one past it (post_series = coverage+1, "you're done"), but
        // never further — a bigger value is the same count-space poison.
        if (dTotal != null && a.start_chapter != null && a.start_chapter > dTotal) {
          classes.anchor_beyond_display_total.push(`${sid}: ep ${a.episode} START ch${a.start_chapter} (${a.source}) exceeds the DISPLAY total ${dTotal} (same-edition band)`);
        }
        if (dTotal != null && a.continue_chapter != null && a.continue_chapter > dTotal + 1) {
          classes.anchor_beyond_display_total.push(`${sid}: ep ${a.episode} CONTINUE ch${a.continue_chapter} (${a.source}) exceeds the DISPLAY total ${dTotal}+1 (same-edition band)`);
        }
        // a DERIVED fractional-chapter anchor is a bonus/Memoire chapter
        // mis-scraped from a source chart (the Vanitas ep-5 → ch-15.5 case,
        // Sean 2026-08-23) — research it. A research-tier (manual/wiki)
        // fractional anchor is LEGAL: sometimes the bonus IS what the
        // episode adapts (Sean's amendment 2026-08-23).
        if (!Number.isInteger(a.chapter) && a.source !== 'manual' && a.source !== 'wiki') {
          classes.anchor_fractional_chapter.push(`${sid}: ep ${a.episode}→ch${a.chapter} (${a.source}) — bonus-chapter scrape? research the true value (bonus association belongs in episode_annotations)`);
        }
        const rowType = typeByEp.get(`${sid}#${a.episode}`);
        if (rowType && rowType !== 'canon' && rowType !== 'mixed') {
          classes.anchor_on_noncanon_row.push(`${sid}: ep ${a.episode}→ch${a.chapter} (${a.source}) anchored on a ${rowType} row — A1 forbids; junk anchor (delete, honest terminal on last canon/mixed ep) or wrong row type?`);
        }
        // C3 outcome check (Sean 2026-08-25): a continue point sitting below
        // chapters this same episode already covered (forward graft +
        // parity-back-jump) must tell the reader which chapters to skip on
        // arrival. Strictly greater — continue == an adapted chapter is C1
        // (mid-chapter straddle, re-reading intended). Healed by
        // apply-parity-continues.ts's C3 pass.
        {
          const ahead = c3Ahead(a.chapters_adapted ?? null, a.continue_chapter ?? null);
          if (ahead.length && !hasSkipLanguage(a.continue_note ?? null)) {
            classes.continue_skip_unnoted.push(`${sid}: ep ${a.episode} continue ${a.continue_chapter} but this episode covered ch ${ahead.join(', ')} ahead — C3 requires a skip-on-arrival note (run the parity healer)`);
          }
        }
      }
    }
  }
  // AFG title-marker gate (Sean's eyeshield report 2026-08-25): "* Filler"
  // in a stored title is AFG table annotation that leaked past the parser
  // strip — a reappearance means an episode writer bypassed the gate.
  for (const e of episodes) {
    if (/\*\s*Filler\s*$/i.test(e.title ?? '')) {
      classes.ruling_violation.push(`${e.series_id}: ep ${e.number} title carries AFG's "* Filler" marker — parser gate bypassed (lib/afg.ts strips it since 2026-08-25)`);
    }
  }
  const lightNovel: string[] = [];

  for (const row of series) {
    const e = epsBy.get(row.id) ?? { max: 0, lastCanon: 0, count: 0 };
    // lockstep with buildMapping: row-less canon-tier series default to
    // canon spans, so the last canon episode is the last aired one
    if (e.count === 0 && row.source_type !== 'original' && row.manga_status !== 'anime_only') {
      e.lastCanon = row.aired_episodes ?? 0;
    }
    const covered = Math.max(row.total_episodes ?? 0, compEnd.get(row.id) ?? 0, row.aired_episodes ?? 0);
    // any overshoot lists (reconcile-structure resolves what the chain can
    // confirm; what remains here = ruled extras + accepted 1-2 tolerance)
    if (e.max > covered) {
      classes.integrity_eps_beyond_total.push(`${row.id} (eps→${e.max}, structure=${covered})`);
    }
    // inverse direction (Sean's ±2 interrogation 2026-08-24): a FINISHED
    // series whose totals exceed its listed episodes means a source counts
    // content our episode list lacks (AFL missing a final special) — the
    // card would promise more episodes than the list shows
    if (row.status === 'finished' && row.aired_episodes > 0 && e.count > 0 && row.aired_episodes > e.count) {
      classes.integrity_total_beyond_eps.push(`${row.id} (aired/total=${row.aired_episodes}, rows=${e.count})`);
    }
    const hasSource = row.source_type !== 'original' && row.manga_status !== 'anime_only';
    if (!hasSource) { classes.no_source.push(row.id); continue; }
    if (row.source_type === 'light_novel') lightNovel.push(row.id);
    if (row.mapping_mode === 'loose') { classes.ok_loose.push(row.id); continue; }
    const latestAnchor = anchBy.get(row.id) ?? null;
    let latestKnown: { volume: number | null; chapters: number } | null = null;
    if (latestAnchor) latestKnown = { volume: latestAnchor.volume ?? volumeFor(row, latestAnchor.chapter), chapters: latestAnchor.chapter };
    if (!latestKnown && row.total_chapters && row.status === 'finished' && e.lastCanon > 0) {
      latestKnown = { volume: row.total_volumes ?? volumeFor(row, row.total_chapters), chapters: row.total_chapters };
    }
    // MU-only anchor set = unverified pin (research promotes to 'manual')
    const srcs = anchorSrcs.get(row.id);
    if (srcs && srcs.size === 1 && srcs.has('mu')) {
      classes.mu_pin_unverified.push(`${row.id}: sole anchor(s) are unverified MU pin(s) (ep ${anchBy.get(row.id)?.episode}→ch${anchBy.get(row.id)?.chapter})`);
    }
    if (latestKnown) {
      (latestKnown.volume != null ? classes.ok_full : classes.ok_no_volume).push(row.id);
      // anchor-density audit (Sean 2026-08-24: iron-clad accuracy, no
      // one-offs): a large canon-episode desert between confirmed anchor
      // points means the interpolated middle rests on nothing — those series
      // are research-tier targets for interior (arc-boundary) anchors
      const pts = (anchors.filter((a: any) => a.series_id === row.id) as any[])
        .map((a) => a.episode)
        .sort((x, y) => x - y);
      if (pts.length) {
        let worst = 0;
        let at = '';
        let prevEp = 0;
        for (const ep of [...pts, latestAnchor?.episode ?? pts[pts.length - 1]]) {
          // count canon/mixed rows in the gap (filler deserts are fine;
          // anime-only-canon has no manga counterpart BY DESIGN — the
          // Black Clover 130-157 lesson, research batch 8)
          const canonInGap = episodes.filter(
            (e: any) => e.series_id === row.id && e.number > prevEp && e.number < ep && e.type !== 'filler' && e.type !== 'anime-only-canon',
          ).length;
          if (canonInGap > worst) {
            worst = canonInGap;
            at = `eps ${prevEp + 1}-${ep - 1}`;
          }
          prevEp = ep;
        }
        if (worst > 12) classes.anchor_gap_research.push(`${row.id}: ${worst} unanchored canon eps (${at})`);
      }
      // TRAILING nulls (Sean 2026-08-23, the Kenshin/Haikyu/X class): canon
      // eps past the last anchor render null ch (beyond-frontier rule refuses
      // to extrapolate). Every hit is one of: a mis-numbered anchor (Haikyu's
      // OVA shift), a mistyped episode (X's anime-original ending), or real
      // side-story/continuation content needing research or the side-story
      // notation (Kenshin 95-98). Never auto-fix — each needs a ruling.
      if (latestAnchor) {
        const trailing = episodes.filter(
          (e: any) => e.series_id === row.id && e.number > latestAnchor.episode && (e.type === 'canon' || e.type === 'mixed'),
        ).length;
        if (trailing > 0) {
          classes.frontier_tail_null.push(`${row.id}: ${trailing} canon eps past anchor ep ${latestAnchor.episode} render null`);
        }
      }
    } else if (e.lastCanon === 0) classes.pending_no_canon.push(row.id);
    else if (row.status !== 'finished') classes.pending_airing_no_anchor.push(row.id);
    else if (!row.total_chapters) classes.pending_finished_no_totals.push(`${row.id} (manga ${row.manga_status}, latest_known=${row.latest_known_chapters})`);
    else classes.pending_other.push(row.id);
  }

  // VOLUME-BOUNDARY IDENTITY (2026-08-23 s2, the Slime ← Cells at Work! /
  // Made in Abyss ← Claymore class): a manga's Wikipedia boundary rows must
  // come from a page that names THAT manga (title-token overlap with any
  // series/synonym on the manga) and, for a finished manga with a known
  // total, must not run past the total (shared pages list sequels)
  {
    const brows = await selectAll<{ manga_anilist_id: number; volume: number; chapter_start: number; chapter_end: number | null; source_page: string | null; source: string }>(
      'volume_boundaries',
      'manga_anilist_id, volume, chapter_start, chapter_end, source_page, source',
    );
    const srows = await selectAll<{ id: string; title: string; title_english: string | null; synonyms: string[] | null; manga_anilist_id: number | null; total_chapters: number | null; manga_status: string | null }>(
      'series',
      'id, title, title_english, synonyms, manga_anilist_id, total_chapters, manga_status',
    );
    const byManga = new Map<number, typeof srows>();
    for (const sr of srows) if (sr.manga_anilist_id) byManga.set(sr.manga_anilist_id, [...(byManga.get(sr.manga_anilist_id) ?? []), sr]);
    const STOP = new Set(['the', 'of', 'a', 'an', 'and', 'list', 'chapters', 'chapter', 'manga', 'volumes', 'volume', 'no', 'wa', 'to', 'ni', 'in', 'on', 'x', 'i']);
    const toks = (x: string) => new Set(x.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, ' ').split(' ').filter((w) => w && !STOP.has(w)));
    const byPage = new Map<string, typeof brows>();
    for (const b of brows) {
      if (b.source !== 'wikipedia' || !b.source_page) continue;
      const k = `${b.manga_anilist_id}|${b.source_page}`;
      byPage.set(k, [...(byPage.get(k) ?? []), b]);
    }
    for (const [k, rs] of byPage) {
      const [mid, page] = k.split('|');
      const ss = byManga.get(Number(mid)) ?? [];
      if (!ss.length) continue;
      const pageT = toks(page);
      let best = 0;
      for (const n of ss.flatMap((x) => [x.title, x.title_english, ...((x.synonyms as string[] | null) ?? [])].filter(Boolean) as string[])) {
        const t = toks(n);
        let c = 0;
        for (const w of t) if (pageT.has(w)) c++;
        best = Math.max(best, t.size ? c / t.size : 0);
      }
      if (best < 0.5) classes.boundaries_wrong_page.push(`manga ${mid} (${ss.map((x) => x.id).join(', ')}) ← "${page}" (${rs.length} vols, overlap ${best.toFixed(2)})`);
      const total = Math.max(...ss.map((x) => x.total_chapters ?? 0));
      if (total && ss.some((x) => x.manga_status === 'finished')) {
        const bad = rs.filter((b) => b.chapter_start > total);
        if (bad.length) classes.boundaries_beyond_total.push(`manga ${mid} (${ss.map((x) => x.id).join(', ')}) total ${total}: ${bad.map((b) => `v${b.volume}:${b.chapter_start}-${b.chapter_end ?? '?'}`).join(' ')}`);
      }
      // IMPOSSIBLE rows (Sean's Sailor Moon "v3: chs 10-3" report, 2026-08-24):
      // a boundary whose end precedes its start, or whose start does not exceed
      // the previous volume's, is a parse artifact — each one silently
      // mis-labels the volume of every chapter after it. Gated at parse time
      // (lib/wikipedia boundariesWithDrops) and healed by
      // heal-volume-boundaries.ts; this is the outcome check.
      const ordered = [...rs].sort((a, b) => a.volume - b.volume);
      const impossible: string[] = [];
      for (let i = 0; i < ordered.length; i++) {
        const b = ordered[i];
        if (b.chapter_end != null && b.chapter_end < b.chapter_start) impossible.push(`v${b.volume}:${b.chapter_start}-${b.chapter_end} (end<start)`);
        else if (i > 0 && b.chapter_start <= ordered[i - 1].chapter_start) impossible.push(`v${b.volume}:${b.chapter_start} (start ≤ v${ordered[i - 1].volume}'s ${ordered[i - 1].chapter_start})`);
      }
      if (impossible.length) classes.boundaries_degenerate.push(`manga ${mid} (${ss.map((x) => x.id).join(', ')}): ${impossible.slice(0, 6).join(' ')}${impossible.length > 6 ? ` …+${impossible.length - 6}` : ''} — run heal-volume-boundaries.ts`);
    }
  }

  for (const [k, v] of Object.entries(classes)) {
    console.log(`\n${k}: ${v.length}`);
    for (const id of v.slice(0, 60)) console.log('   ' + id);
    if (v.length > 60) console.log(`   …+${v.length - 60} more`);
  }
  console.log('\nlight_novel-source series:', lightNovel.length, '→', lightNovel.slice(0, 25).join(', '));
  const eightySix = series.find((s: any) => s.id.includes('86') || s.id.includes('eighty'));
  console.log('\n86 row:', JSON.stringify(eightySix));
}
main().then(() => process.exit(0));
