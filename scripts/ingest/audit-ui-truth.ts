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
import { COMMUNITY_COUNT_OVERRIDES, CONTINUA_SUPPRESSED, EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS, translateEpisodeNumber } from './lib/resolve';
import { AIRDATE_REGRESSION_THRESHOLD_DAYS, airdateOrderWalk } from './lib/airdate-order';
import { offWindowRows, seriesDatesInvalid } from './lib/wiki-identity';
import { sliverStart } from './lib/sliver';
import { RULED_STRUCTURE, RULED_EXTRA_KEYS } from './lib/rulings/structure';
import { RETIRED_ANNOTATIONS } from './lib/rulings/retired-annotations';
import { honestTerminal, pinRedundant } from './lib/honest-terminal';
import { orphanRecords } from './lib/row-presence';
import { STANDING_ANNOTATIONS } from './lib/rulings/standing-annotations';
import { AIR_DATE_OVERRIDES } from './lib/rulings/air-dates';
import { EPISODE_TITLE_OVERRIDES } from './lib/rulings/episode-titles';
import { continueUnprovenanced, curatedOverwritten } from './lib/continues';
import { ANCHOR_SUPPRESSED } from './lib/rulings/anchor-suppressed';
import { deriveFormat } from './lib/format';
import { LOCKED } from './lib/rulings/permanence';
import { ENTRIES as TYPE_RULINGS } from './lib/rulings/episode-types';
import { deriveSourceKind, seriesHasInstrument, seriesHasSource, SOURCE_TYPE_OVERRIDES } from './lib/rulings/source-kinds';
import { pickManga } from './lib/resolve';
import { annotationProblem } from './lib/annotations';
import { REVIEWED_NUMBERED_SPECIALS } from './lib/rulings/reviewed-specials';

async function main() {
  const series = await selectAll<any>('series', 'id, afl_slug, anilist_id, source_type, manga_status, status, start_date, end_date, aired_episodes, total_episodes, total_chapters, total_volumes, latest_known_chapters, manga_anilist_id, manga_start_chapter, mapping_mode, asterisk_review');
  const episodes = await selectAll<any>('episodes', 'series_id, number, type, title, air_date, format');
  const anchors = await selectAll<any>('chapter_anchors', 'series_id, episode, chapter, start_chapter, chapters_adapted, continue_chapter, continue_note, continue_source, volume, source');
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
    anchor_nonmonotonic: [], anchor_start_offtrend: [], start_sliver_mismatch: [], start_without_span: [], anchor_beyond_chapter_space: [], anchor_beyond_display_total: [], anchor_fractional_chapter: [], anchor_on_noncanon_row: [], continue_skip_unnoted: [], continue_provenance_missing: [], boundaries_degenerate: [], ruling_violation: [], repair_on_derivation_tier: [],
    mu_pin_unverified: [], mu_pin_flag_redundant: [], anchor_without_row: [], annotation_without_row: [],
    rearranged_zone_unanchored: [], rearranged_zone_acknowledged: [],
    title_incomplete: [], airdate_incomplete: [], airdate_regression: [], airdate_withheld: [], episode_date_off_window: [], asterisk_unreviewed: [],
    fractional_unmodeled: [], annotation_invalid: [], annotation_retired_standing: [], afl_anime_canon_unruled: [], format_missing: [], episode_without_component: [], watch_order_kind_missing: [],
    permanence_candidate: [], permanence_violation: [], mixed_fragment_only: [],
    series_without_source_kind: [], no_source: [], no_instrument: [], ok_full: [], ok_no_volume: [], ok_loose: [],
    pending_airing_no_anchor: [], pending_finished_no_totals: [], pending_no_canon: [], pending_other: [],
  };
  // T26: annotations are read once up front — the adopted / side_source rows
  // (canon with NO source counterpart by design, T14) and the set of
  // annotated rows are inputs to the gap audit and the AFL unruled queue.
  const offSource = new Set<string>();
  const annotated = new Set<string>();
  for (const a of await selectAll<any>('episode_annotations', 'series_id, episode, kind')) {
    if (a.kind === 'adopted' || a.kind === 'side_source') offSource.add(`${a.series_id}#${a.episode}`);
    annotated.add(`${a.series_id}#${a.episode}`);
  }
  // Sean's standing rule (2026-08-24, N7): any non-typical entry NUMBERED
  // into a run by any source is a research trigger — the reviewed set (with
  // each ruling's reason) lives in lib/rulings/reviewed-specials.ts.
  for (const c of comps) {
    // I39: a ruled extra is its own N7 review
    if (c.kind && c.kind !== 'season' && c.episode_start != null && !REVIEWED_NUMBERED_SPECIALS.has(`${c.series_id}:${c.anilist_id}`) && !RULED_EXTRA_KEYS.has(`${c.series_id}:${c.anilist_id}`)) {
      classes.special_numbered_unreviewed.push(`${c.series_id}: ${c.kind} "${c.label ?? c.anilist_id}" numbered ${c.episode_start}-${c.episode_end ?? '?'} [${c.series_id}:${c.anilist_id}]`);
    }
  }
  // A42 outcome check (2026-08-26, the third post-wave-1 /add-rule): an
  // anchor or annotation standing on an episode row the sources have not
  // produced. The display synthesizes the row (A42) so nothing is hidden
  // from the mapping — but the missing row is a fact to see: AFL lag
  // (research ahead of rows), a staging fault (cells-at-work's AFL page
  // staged 0 rows), a row-less series carrying only an MU pin, or a record
  // past aired_episodes (a numbering fault, named as such). Lists, never
  // deletes (A6) — the rows may still arrive.
  {
    const airedBy = new Map<string, number | null>(series.map((s: any) => [s.id, s.aired_episodes]));
    const annosAll = await selectAll<{ series_id: string; episode: number; kind: string }>('episode_annotations', 'series_id, episode, kind');
    const grp = <T extends { series_id: string; episode: number }>(list: { record: T; beyondAired: boolean }[], label: (r: T) => string) => {
      const by = new Map<string, { items: string[]; beyond: number }>();
      for (const o of list) { if (!by.has(o.record.series_id)) by.set(o.record.series_id, { items: [], beyond: 0 }); const g = by.get(o.record.series_id)!; g.items.push(label(o.record) + (o.beyondAired ? '!' : '')); if (o.beyondAired) g.beyond++; }
      return by;
    };
    for (const [sid, g] of grp(orphanRecords(episodes, anchors.map((a: any) => ({ series_id: a.series_id, episode: a.episode, source: a.source })), airedBy), (r) => `${r.episode} (${(r as any).source})`)) {
      classes.anchor_without_row.push(`${sid}: ${g.items.length} anchor${g.items.length === 1 ? '' : 's'} on rows that do not exist — ${g.items.join(', ')}${g.beyond ? ` — ${g.beyond} past aired_episodes (numbering fault)` : ` (${(airedBy.get(sid) ?? '?')} aired; AFL lag / staging fault / row-less series — the display synthesizes the row, A42)`}`);
    }
    for (const [sid, g] of grp(orphanRecords(episodes, annosAll, airedBy), (r) => `${r.episode}:${r.kind}`)) {
      classes.annotation_without_row.push(`${sid}: ${g.items.length} annotation${g.items.length === 1 ? '' : 's'} on rows that do not exist — ${g.items.join(', ')}${g.beyond ? ` — ${g.beyond} past aired_episodes` : ''}`);
    }
  }
  // G56 outcome check (2026-08-26): an OPEN "MU frontier pin lands on a
  // filler / position-less row" flag whose honest terminal (the non-MU
  // anchor on the last canon/mixed row at or before the pin) already
  // reaches MU's chapter is stale — the writer skips and closes it on its
  // next pass. Should be 0 after heal; lists, never flips.
  {
    const open = await selectAll<{ id: number; series_key: string; detail: { note?: string; pinEpisode?: number; muCoverageChapter?: number } }>('ingest_flags', 'id, series_key, detail', (q) => q.eq('status', 'open').eq('source', 'mangaupdates').eq('kind', 'count_mismatch'));
    for (const f of open) {
      if (!/^MU frontier pin lands on/.test(String(f.detail?.note ?? '')) || f.detail?.pinEpisode == null || f.detail?.muCoverageChapter == null) continue;
      const rows = episodes.filter((e: any) => e.series_id === f.series_key);
      const nonMu = anchors.filter((a: any) => a.series_id === f.series_key && a.source !== 'mu');
      const t = honestTerminal(rows, nonMu, f.detail.pinEpisode, (n) => ANCHOR_SUPPRESSED[f.series_key]?.includes(n) ?? false);
      if (pinRedundant(t, f.detail.muCoverageChapter)) classes.mu_pin_flag_redundant.push(`${f.series_key}: flag #${f.id} pin ep ${f.detail.pinEpisode} → MU ch ${f.detail.muCoverageChapter}, but ep ${t!.episode} → ch ${t!.chapter} (${t!.source}) already covers it — the writer should have skipped + closed it (G56)`);
    }
  }
  // I39 outcome check (batch 19 E4): every ruled extra stands as a component
  // row with its kind and its row count; every span override is honoured.
  // A miss means a chain writer bypassed the planner or the healer has not
  // run — ruling_violation, never silently re-derived here.
  for (const [sid, ruled] of Object.entries(RULED_STRUCTURE)) {
    const rows = comps.filter((c) => c.series_id === sid);
    if (!rows.length) continue; // unstitched — not a violation
    for (const x of ruled.extras ?? []) {
      const row = rows.find((c) => c.anilist_id === x.anilistId);
      if (!row) { classes.ruling_violation.push(`${sid}: ruled extra [${x.anilistId}] ${x.label} has no component row (I39) — run heal-structure`); continue; }
      const len = row.episode_start != null && row.episode_end != null ? row.episode_end - row.episode_start + 1 : null;
      if (row.kind !== x.kind || len !== x.rows || (x.startAt != null && row.episode_start !== x.startAt)) classes.ruling_violation.push(`${sid}: ruled extra [${x.anilistId}] stored ${row.kind} ${row.episode_start}-${row.episode_end} ≠ ruled ${x.kind} ×${x.rows}${x.startAt != null ? ` from ${x.startAt}` : ''} (I39)`);
    }
    for (const [id, span] of Object.entries(ruled.spans ?? {})) {
      const row = rows.find((c) => c.anilist_id === Number(id));
      if (!row) { classes.ruling_violation.push(`${sid}: span override on [${id}] but no such component (I39)`); continue; }
      if ((span.episodeStart != null && row.episode_start !== span.episodeStart) || (span.episodeEnd != null && row.episode_end !== span.episodeEnd)) classes.ruling_violation.push(`${sid}: [${id}] span ${row.episode_start}-${row.episode_end} ≠ ruled ${span.episodeStart ?? '·'}-${span.episodeEnd ?? '·'} (I39)`);
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
  // P8 repairs live at the manual tier (2026-08-26): a derivation-tier
  // anchor (mu / afg / afg-continua) whose note carries research or repair
  // provenance is a repair that the next re-derive will wipe.
  for (const a of anchors) {
    if (['mu', 'afg', 'afg-continua'].includes(a.source) && /research-tier|repair|Sean/i.test(a.note ?? '')) {
      classes.repair_on_derivation_tier.push(`${a.series_id}: ep ${a.episode} ${a.source} note reads research/repair — promote to manual (P8)`);
    }
  }
  // T25 source kinds (T4.1, 2026-08-26): series.source_type must equal what
  // the registry derives from CURRENT staging (+ SOURCE_TYPE_OVERRIDES) — a
  // writer that bypassed deriveSourceKind, or a healer that has not run,
  // surfaces here. NULL is the fail-closed outcome: its own class is the
  // ruling queue (series_without_source_kind), never a violation.
  {
    const ids = series.map((s: any) => s.anilist_id).filter((n: any) => n != null);
    const staged = await selectAll<{ anilist_id: number; raw: any }>('ingest_anilist_media', 'anilist_id, raw', (q) => q.in('anilist_id', ids));
    const rawBy = new Map(staged.map((r) => [r.anilist_id, r.raw]));
    for (const row of series) {
      if (row.source_type == null) classes.series_without_source_kind.push(`${row.id}: source_type NULL — AniList source ${rawBy.get(row.anilist_id)?.source ?? '?'} needs a SOURCE_KINDS record or a SOURCE_TYPE_OVERRIDES ruling`);
      const media = rawBy.get(row.anilist_id);
      if (!media) continue;
      const node = pickManga(media);
      const d = deriveSourceKind(row.id, { source: media.source, mangaCountry: node ? node.countryOfOrigin : null, hasMangaEdge: !!node });
      if (d.value !== row.source_type) classes.ruling_violation.push(`${row.id}: source_type '${row.source_type}' ≠ derived '${d.value}' (${d.reason}; T25)`);
      if (SOURCE_TYPE_OVERRIDES[row.id] && row.source_type !== SOURCE_TYPE_OVERRIDES[row.id]) classes.ruling_violation.push(`${row.id}: source_type '${row.source_type}' ≠ ruled '${SOURCE_TYPE_OVERRIDES[row.id]}' (T25)`);
    }
  }
  // T29 format axis (T4.4, 2026-08-26): every row's format must equal the
  // derivation (component kind + FORMAT_OVERRIDES) — a disagreement is a
  // healer that has not run or a writer that bypassed it; NULL is the honest
  // gap and its own queue (format_missing), and the structure gap behind
  // most nulls — a row no component covers — is named separately.
  {
    const compsBy = new Map<string, any[]>();
    for (const c of comps) { if (c.episode_start == null) continue; if (!compsBy.has(c.series_id)) compsBy.set(c.series_id, []); compsBy.get(c.series_id)!.push(c); }
    const missingBy = new Map<string, number[]>();
    const uncoveredBy = new Map<string, number[]>();
    for (const e of episodes) {
      const comp = (compsBy.get(e.series_id) ?? []).find((c: any) => e.number >= c.episode_start && (c.episode_end == null || e.number <= c.episode_end));
      const want = deriveFormat(e.series_id, e.number, comp?.kind ?? null);
      if ((want ?? null) !== (e.format ?? null)) classes.ruling_violation.push(`${e.series_id}: ep ${e.number} format '${e.format}' ≠ derived '${want}' (T29)`);
      if (!want) { if (!missingBy.has(e.series_id)) missingBy.set(e.series_id, []); missingBy.get(e.series_id)!.push(e.number); }
      if (!comp) { if (!uncoveredBy.has(e.series_id)) uncoveredBy.set(e.series_id, []); uncoveredBy.get(e.series_id)!.push(e.number); }
    }
    for (const [sid, nums] of missingBy) classes.format_missing.push(`${sid}: ${nums.length} rows with no format (${nums.slice(0, 6).join(', ')}${nums.length > 6 ? '…' : ''}) — no component covers them and no FORMAT_OVERRIDES ruling`);
    for (const [sid, nums] of uncoveredBy) classes.episode_without_component.push(`${sid}: ${nums.length} episode rows covered by no component (${nums.slice(0, 6).join(', ')}${nums.length > 6 ? '…' : ''}) — a numbered special / movie / OVA with no structure row (N7 + kind component), or a stale component span`);
    const wo = await selectAll<any>('watch_order_entries', 'series_id, position, kind, title');
    for (const w of wo) if (!w.kind) classes.watch_order_kind_missing.push(`${w.series_id} @${w.position}: "${String(w.title).slice(0, 40)}" has no kind`);
  }
  // A44 anchor suppression (2026-08-26): a stored anchor on a row ruled
  // position-less (cover-page serials, side stories without a chapter number,
  // acts behind an earlier anchor) = a writer bypassed the A1 gate stack or
  // the healer has not run.
  for (const [sid, eps] of Object.entries(ANCHOR_SUPPRESSED)) {
    for (const a of anchors) if (a.series_id === sid && eps.includes(a.episode)) classes.ruling_violation.push(`${sid}: ep ${a.episode} carries an anchor (${a.source} → ch ${a.chapter}) on a row ruled position-less (A44)`);
  }
  // G53 air-date overrides (2026-08-26): a stored air_date that disagrees with a ruled one = a writer bypassed filterEpisodeRows or the assert healer has not run.
  for (const [sid, dates] of Object.entries(AIR_DATE_OVERRIDES)) {
    for (const [num, want] of Object.entries(dates)) {
      const row = episodes.find((e: any) => e.series_id === sid && e.number === Number(num));
      if (row && row.air_date !== want) classes.ruling_violation.push(`${sid}: ep ${num} air_date ${row.air_date} ≠ ruled ${want} (G53)`);
    }
  }
  // C7 continue provenance (2026-08-27): a curated continue (continue_source
  // 'manual') wearing the healer's own note = the healer wrote over it (the
  // tokyo-mew-mew 28 shape) — a writer bypassed the gate. A stored continue
  // with NO marker = a writer forgot the column (listed, never auto-fixed).
  for (const a of anchors) {
    if (curatedOverwritten(a)) classes.ruling_violation.push(`${a.series_id}: ep ${a.episode} curated continue ${a.continue_chapter} carries the healer's note — overwritten (C7)`);
    if (continueUnprovenanced(a)) classes.continue_provenance_missing.push(`${a.series_id}: ep ${a.episode} continue ${a.continue_chapter} has no continue_source — the writer must set manual | healer | source (C7)`);
  }
  // G53 title overrides (2026-08-27): a transposition carries the title with the date — a stored title that disagrees with a ruled one = the same bypass.
  for (const [sid, titles] of Object.entries(EPISODE_TITLE_OVERRIDES)) {
    for (const [num, want] of Object.entries(titles)) {
      const row = episodes.find((e: any) => e.series_id === sid && e.number === Number(num));
      if (row && row.title !== want) classes.ruling_violation.push(`${sid}: ep ${num} title "${String(row.title).slice(0, 40)}" ≠ ruled "${want.slice(0, 40)}" (G53)`);
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

  // AIR-DATE ORDER (G54, 2026-08-26 — A-11). Two outcome classes from the
  // one lib walk (lib/airdate-order.ts):
  //   airdate_regression — a stored date earlier than its predecessor's and
  //     not ruled in AIRDATE_ORDER_ACK: the review queue (typo → G53 with a
  //     cited date; real broadcast order → an ack entry). A regression
  //     deeper than the threshold that is still standing means the gate
  //     could not name the outlier (a whole block changed era) — research.
  //   airdate_withheld — stored NULL where AFL staging holds a date for the
  //     row: the gate (or the healer) withheld it. Each is a G53 candidate;
  //     staging keeps AFL's claim (G51) so nothing is re-scraped to rule it.
  {
    const epsBySeries = new Map<string, any[]>();
    for (const e of episodes) {
      if (!epsBySeries.has(e.series_id)) epsBySeries.set(e.series_id, []);
      epsBySeries.get(e.series_id)!.push(e);
    }
    for (const [sid, rows] of epsBySeries) {
      const { regressions, withheld } = airdateOrderWalk(sid, rows);
      for (const r of regressions) classes.airdate_regression.push(`${sid}: ep ${r.number} ${r.date} is ${r.days} d before ep ${r.against} ${r.againstDate}${r.days > AIRDATE_REGRESSION_THRESHOLD_DAYS ? ' — block change, gate cannot name the outlier' : ''}`);
      for (const w of withheld) classes.ruling_violation.push(`${sid}: ep ${w.number} air_date ${w.date} stands ${w.days} d out of order — the G54 gate/healer should have withheld it`);
    }
    // SERIES WINDOW (G55, 2026-08-26 — batch 19 E2, the namesake lesson):
    // a TV row dated before its series began or long after a finished
    // series ended is usually ANOTHER show's row (a namesake's wiki page).
    // Lists, never flips: contamination → the E2-style purge (title + date
    // wiped, the honest gap), a true deviation → AIR_DATE_WINDOW_ACK, a
    // typo → G53. Ep 0 / non-tv formats are exempt by structure. A series
    // whose end_date precedes its start_date is a series-row fault and is
    // reported once instead of windowing its rows against garbage.
    for (const s of series) {
      const rows = epsBySeries.get(s.id) ?? [];
      if (seriesDatesInvalid(s)) { classes.episode_date_off_window.push(`${s.id}: series end_date ${s.end_date} precedes start_date ${s.start_date} — series-row fault, rows not windowed`); continue; }
      const off = offWindowRows(s.id, s, rows);
      if (!off.length) continue;
      const early = off.filter((o) => o.fit === 'before_start'), late = off.filter((o) => o.fit === 'after_end');
      const fmt = (l: typeof off) => (l.length > 4 ? `${l.slice(0, 3).map((o) => `${o.number} ${o.date}`).join(', ')} … ${l[l.length - 1].number} ${l[l.length - 1].date}` : l.map((o) => `${o.number} ${o.date}`).join(', '));
      classes.episode_date_off_window.push(`${s.id}: ${off.length} row${off.length === 1 ? '' : 's'} outside ${s.start_date}${s.end_date ? `→${s.end_date}` : '→'}${early.length ? ` — before start: ${fmt(early)}` : ''}${late.length ? ` — after end: ${fmt(late)}` : ''} (namesake contamination → purge; true deviation → G55 ack; typo → G53)`);
    }
    // T27 (T4.3): AFL's anime_canon claim is kept in staging (G51); a stored
    // FILLER row AFL calls anime-canon with no ruling on it (no T6 override,
    // no annotation) is the batch-18 work-list — derived here, never a
    // holding type in the canonical table.
    const unruledBy = new Map<string, number[]>();
    const aflBySeries = new Map(series.filter((s: any) => s.afl_slug).map((s: any) => [s.afl_slug, s.id]));
    const staged = await selectAll<{ slug: string; raw: any }>('ingest_afl_shows', 'slug, raw', (q) => q.in('slug', [...aflBySeries.keys()]));
    for (const st of staged) {
      const sid = aflBySeries.get(st.slug);
      if (!sid) continue;
      const stored = new Map((epsBySeries.get(sid) ?? []).map((e: any) => [e.number, e]));
      for (const ep of (st.raw?.episodes ?? []) as { number: number; airDate?: string | null }[]) {
        if (!ep.airDate) continue;
        const n = translateEpisodeNumber(sid, ep.number, 'afl');
        if (n == null) continue;
        const row = stored.get(n);
        // a ruled NULL (G53, 2026-08-27: an episode with no Japanese broadcast) is the outcome, not a withheld date
        const ruledNull = AIR_DATE_OVERRIDES[sid] && Object.prototype.hasOwnProperty.call(AIR_DATE_OVERRIDES[sid], n) && AIR_DATE_OVERRIDES[sid][n] === null;
        if (row && !row.air_date && !ruledNull) classes.airdate_withheld.push(`${sid}: ep ${n} stored NULL, AFL says ${ep.airDate} — G53 candidate (cite the correct date) or an ack`);
      }
      for (const ep of (st.raw?.episodes ?? []) as { number: number; type?: string }[]) {
        if (ep.type !== 'anime-only-canon') continue;
        const n = translateEpisodeNumber(sid, ep.number, 'afl');
        if (n == null) continue;
        const row = stored.get(n);
        if (!row || row.type !== 'filler') continue;
        if (EPISODE_TYPE_OVERRIDES[sid]?.[n] || annotated.has(`${sid}#${n}`)) continue;
        if (!unruledBy.has(sid)) unruledBy.set(sid, []);
        unruledBy.get(sid)!.push(n);
      }
    }
    for (const [sid, nums] of [...unruledBy].sort((a, b) => b[1].length - a[1].length)) {
      nums.sort((a, b) => a - b);
      classes.afl_anime_canon_unruled.push(`${sid}: ${nums.length} rows AFL calls anime-canon stored filler, unruled (${nums.slice(0, 12).join(', ')}${nums.length > 12 ? '…' : ''})`);
    }
  }

  // ASTERISK review workflow (Sean 2026-08-23): kinds derive from
  // episode_annotations (single source of truth); series.asterisk_review
  // tracks sign-off. Heals annotated-but-unmarked series to 'pending';
  // 'pending' rows are Sean's sign-off queue for the asterisk UI pass.
  {
    const annos = await selectAll<any>('episode_annotations', 'series_id, episode, kind, note, basis');
    // T26 (T4.2): the lib vocabulary and the DB constraint must agree — a
    // stored record the gate would refuse (unknown kind, adopted without a
    // basis, side_source without the work named) is a writer that bypassed
    // upsertAnnotation or a constraint that drifted from lib/annotations.ts
    for (const a of annos) {
      const problem = annotationProblem(a);
      if (problem) classes.annotation_invalid.push(`${a.series_id} ep ${a.episode} ${a.kind}: ${problem}`);
    }
    // A45 (2026-08-26): a standing row on a key retired by ruling is the
    // outcome the gate forbids and the healer removes — ruling_violation;
    // a retired key that is ALSO a standing T26 ruling is a contradiction
    // between two maps — ruling_violation too (fix the maps, never the data).
    for (const a of annos) {
      if (RETIRED_ANNOTATIONS.has(`${a.series_id}#${a.episode}#${a.kind}`)) {
        classes.annotation_retired_standing.push(`${a.series_id} ep ${a.episode} ${a.kind} — retired by ruling (A45), still stored; run assert-overrides`);
        classes.ruling_violation.push(`${a.series_id}: ep ${a.episode} annotation ${a.kind} is retired by ruling (A45) but still stored`);
      }
    }
    for (const [sid, list] of Object.entries(STANDING_ANNOTATIONS)) for (const st of list) for (const ep of st.episodes) if (RETIRED_ANNOTATIONS.has(`${sid}#${ep}#${st.kind}`)) classes.ruling_violation.push(`${sid}: ep ${ep} ${st.kind} is BOTH a standing T26 ruling and retired (A45) — the maps contradict`);
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
        if (t === 'filler' || offSource.has(`${a.series_id}#${a.episode}`)) continue; // T26: no source position exists on an adopted / side_source row
        if (ANCHOR_SUPPRESSED[a.series_id]?.includes(a.episode)) continue; // A44: ruled position-less — not an anchoring target
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
    // SLIVER RULE (A10, 2026-08-26 — batch 19 E3 / drift item A-6): the ONE
    // derivation in lib/sliver.ts re-run over EVERY manual anchor's own
    // chapters_adapted record — loose series included (their starts are
    // stored values too). Two listing classes, never flips:
    //   start_sliver_mismatch — stored START ≠ what the rule derives
    //     (batch-12 rows predate the rule; Sean signs each move)
    //   start_without_span — a START with no chapters_adapted record cannot
    //     be proven (the 27 batch-8/9 seeds until their spans land)
    for (const a of anchors) {
      if (a.source !== 'manual' || a.start_chapter == null) continue;
      if (!a.chapters_adapted) { classes.start_without_span.push(`${a.series_id}: ep ${a.episode} start ch${a.start_chapter} has no chapters_adapted record — unprovable under A10 (apply-e3 carries the seeding record)`); continue; }
      const v = sliverStart(a.chapters_adapted, a.start_chapter);
      if (v.start !== a.start_chapter) classes.start_sliver_mismatch.push(`${a.series_id}: ep ${a.episode} start ch${a.start_chapter} but the record opens on ch${v.start} '${v.lead.slice(0, 40)}' (≈${v.pages || '?'} p, ${v.reason}) — A10 says ${v.start}; Sean signs`);
    }
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
    if (e.count === 0 && seriesHasSource(row.source_type)) {
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
    // T25: identity vs instrument — a studio original / unruled kind has no
    // source; a VN / game / other series HAS a source but no units to map
    if (!seriesHasSource(row.source_type)) { classes.no_source.push(row.id); continue; }
    if (!seriesHasInstrument(row.source_type)) { classes.no_instrument.push(`${row.id} (${row.source_type})`); continue; }
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
            (e: any) => e.series_id === row.id && e.number > prevEp && e.number < ep && e.type !== 'filler' && !offSource.has(`${row.id}#${e.number}`),
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
        // A44 (batch 19, 2026-08-26): a ruled position-less row is not a
        // tail — its honest terminal IS the last anchor (akame 20-21)
        const trailing = episodes.filter(
          (e: any) => e.series_id === row.id && e.number > latestAnchor.episode && (e.type === 'canon' || e.type === 'mixed') && !ANCHOR_SUPPRESSED[row.id]?.includes(e.number),
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

  // T28 discrepancy queue (E1, 2026-08-26 — the parked add-rule): a row typed
  // MIXED before the materiality bar whose only recorded source ties are
  // fragment annotations (graft / partial / loose_parallel) and which carries
  // no anchor. The bar says such a row is filler + annotation; this class
  // LISTS the rows for Sean's reversal — it never flips one (P23). Rows a
  // T6 entry ruled on or after the bar's date are excluded: Sean already
  // judged them under it.
  {
    const FRAGMENT = new Set(['graft', 'partial', 'loose_parallel']);
    const ruledUnderBar = new Set<string>();
    for (const e of TYPE_RULINGS) if (e.ruledOn >= '2026-08-26') for (const n of Object.keys(e.value)) ruledUnderBar.add(`${e.seriesId}#${n}`);
    const anchored = new Set(anchors.map((a: any) => `${a.series_id}#${a.episode}`));
    const kindsBy = new Map<string, Set<string>>();
    for (const a of await selectAll<any>('episode_annotations', 'series_id, episode, kind')) {
      const k = `${a.series_id}#${a.episode}`;
      if (!kindsBy.has(k)) kindsBy.set(k, new Set());
      kindsBy.get(k)!.add(a.kind);
    }
    const hitsBy = new Map<string, string[]>();
    for (const e of episodes) {
      if (e.type !== 'mixed') continue;
      const k = `${e.series_id}#${e.number}`;
      if (anchored.has(k) || ruledUnderBar.has(k)) continue;
      const kinds = kindsBy.get(k);
      if (!kinds || ![...kinds].every((x) => FRAGMENT.has(x))) continue;
      if (!hitsBy.has(e.series_id)) hitsBy.set(e.series_id, []);
      hitsBy.get(e.series_id)!.push(`${e.number} [${[...kinds].join('+')}]`);
    }
    for (const [sid, rows] of hitsBy) classes.mixed_fragment_only.push(`${sid}: ${rows.length} mixed row(s) with only fragment ties and no anchor — ${rows.join(', ')} — T28 would say filler + annotation; Sean confirms the reverse or keeps the call`);
  }
  // P25 permanence (2026-08-26): the mechanical half of the lock criteria —
  // finished series (source finished too where an instrument exists) whose
  // mapping renders full, carrying at least one research/manual-tier anchor
  // (or nothing to map), with NO open census item on it. Meeting all of it
  // = permanence_candidate (Sean's signing queue: an entry in
  // lib/rulings/permanence.ts). A LOCKED series failing any of it =
  // permanence_violation — data drifted under a lock (P5).
  {
    const OPEN_CLASSES = ['integrity_eps_beyond_total', 'integrity_total_beyond_eps', 'integrity_double_claimed', 'integrity_degenerate_span', 'special_numbered_unreviewed', 'anchor_gap_research', 'frontier_tail_null', 'anchor_nonmonotonic', 'anchor_start_offtrend', 'anchor_beyond_chapter_space', 'anchor_beyond_display_total', 'anchor_fractional_chapter', 'anchor_on_noncanon_row', 'continue_skip_unnoted', 'continue_provenance_missing', 'boundaries_degenerate', 'boundaries_wrong_page', 'boundaries_beyond_total', 'ruling_violation', 'repair_on_derivation_tier', 'mu_pin_unverified', 'rearranged_zone_unanchored', 'title_incomplete', 'airdate_incomplete', 'airdate_regression', 'airdate_withheld', 'asterisk_unreviewed', 'fractional_unmodeled', 'annotation_invalid', 'afl_anime_canon_unruled', 'format_missing', 'episode_without_component', 'watch_order_kind_missing', 'series_without_source_kind', 'pending_airing_no_anchor', 'pending_finished_no_totals', 'pending_no_canon', 'pending_other'];
    const openBy = new Map<string, Set<string>>();
    const ids = new Set(series.map((s: any) => s.id));
    for (const c of OPEN_CLASSES) for (const line of classes[c] ?? []) {
      const sid = String(line).split(/[:\s]/)[0];
      if (!ids.has(sid)) continue;
      if (!openBy.has(sid)) openBy.set(sid, new Set());
      openBy.get(sid)!.add(c);
    }
    const full = new Set(classes.ok_full);
    const noMap = new Set([...classes.no_source, ...classes.no_instrument.map((x: string) => x.split(' ')[0])]);
    const researched = new Set(anchors.filter((a: any) => a.source !== 'afg' && a.source !== 'mu' && a.source !== 'afg-continua').map((a: any) => a.series_id));
    const verdict = (row: any): string | null => {
      if (row.status !== 'finished') return `anime ${row.status}`;
      if (!row.source_type || row.source_type === 'other') return `source kind ${row.source_type} (a ruling is pending, T25)`;
      const instrument = !noMap.has(row.id);
      if (instrument && row.manga_status !== 'finished') return `source ${row.manga_status}`;
      if (instrument && !full.has(row.id)) return 'mapping not full';
      if (instrument && !researched.has(row.id)) return 'no research/manual-tier anchor';
      const open = openBy.get(row.id);
      if (open?.size) return `open: ${[...open].join(', ')}`;
      return null;
    };
    for (const row of series) {
      const why = verdict(row);
      if (LOCKED.has(row.id)) { if (why) classes.permanence_violation.push(`${row.id}: LOCKED but ${why}`); }
      else if (!why) classes.permanence_candidate.push(`${row.id} (${noMap.has(row.id) ? 'no instrument' : 'full'}) — meets every mechanical criterion; Sean signs → lib/rulings/permanence.ts`);
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
