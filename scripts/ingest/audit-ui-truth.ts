// UI-truth audit (Sean 2026-08-24: "still quite a few series where manga says
// mapping pending"): replicates buildMapping's EXACT decision points
// (supabaseSource.ts) for every series and classifies what the card actually
// renders — the data-level coverage audit can say "resolved" while a UI gate
// (volume ratio, synthesis prerequisites) still blanks the display. Keep the
// logic in lockstep with supabaseSource.ts when either changes.
// Classes: ok_full / ok_no_volume / pending_* / no_source /
// integrity_eps_beyond_total (episodes outrun the component structure).
//   npx tsx --env-file=.env.ingest scripts/ingest/audit-ui-truth.ts

import { db } from './lib/db';
import { COMMUNITY_COUNT_OVERRIDES, CONTINUA_SUPPRESSED, EPISODE_TYPE_OVERRIDES, SOURCE_NUMBERING_SHIFTS } from './lib/resolve';

async function pageAll(table: string, select: string): Promise<any[]> {
  const out: any[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select(select).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  return out;
}

async function main() {
  const series = await pageAll('series', 'id, source_type, manga_status, status, aired_episodes, total_episodes, total_chapters, total_volumes, latest_known_chapters, manga_anilist_id, manga_start_chapter, mapping_mode, asterisk_review');
  const episodes = await pageAll('episodes', 'series_id, number, type, title, air_date');
  const anchors = await pageAll('chapter_anchors', 'series_id, episode, chapter, volume');
  const comps = await pageAll('series_components', 'series_id, episode_end, episode_start, anilist_id, kind, label');
  const bounds = await pageAll('volume_boundaries', 'manga_anilist_id, volume, chapter_start, chapter_end');

  const epsBy = new Map<string, { max: number; lastCanon: number; count: number }>();
  for (const e of episodes) {
    const s = epsBy.get(e.series_id) ?? { max: 0, lastCanon: 0, count: 0 };
    s.max = Math.max(s.max, e.number);
    s.count++;
    if (e.type !== 'filler') s.lastCanon = Math.max(s.lastCanon, e.number);
    epsBy.set(e.series_id, s);
  }
  const anchBy = new Map<string, { episode: number; chapter: number; volume: number | null }>();
  for (const a of anchors) {
    const cur = anchBy.get(a.series_id);
    if (!cur || a.episode > cur.episode) anchBy.set(a.series_id, a);
  }
  const compEnd = new Map<string, number>();
  for (const c of comps) {
    if (c.episode_end != null) compEnd.set(c.series_id, Math.max(compEnd.get(c.series_id) ?? 0, c.episode_end));
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
    integrity_eps_beyond_total: [], integrity_total_beyond_eps: [], integrity_double_claimed: [],
    special_numbered_unreviewed: [], anchor_gap_research: [], frontier_tail_null: [],
    anchor_nonmonotonic: [], anchor_beyond_chapter_space: [], ruling_violation: [],
    title_incomplete: [], airdate_incomplete: [], asterisk_unreviewed: [],
    fractional_unmodeled: [],
    no_source: [], ok_full: [], ok_no_volume: [], ok_loose: [],
    pending_airing_no_anchor: [], pending_finished_no_totals: [], pending_no_canon: [], pending_other: [],
  };
  // Sean's standing rule (2026-08-24): any non-typical entry (special/OVA/
  // movie/recap) NUMBERED into a run by any source is a research trigger —
  // verify against community consensus, ask Sean, then record the ruling
  // here. Reviewed = verified community-counted this session.
  const REVIEWED_NUMBERED_SPECIALS = new Set<string>([
    'initial-d:187', // Third Stage = AFL's ep 40 (the founding precedent)
    'attack-on-titan:146984', // Final Chapters Zenpen = ep 88 (AFL-numbered)
    'attack-on-titan:165790', // Final Chapters Kouhen = ep 89
    'hunter-x-hunter:137', // HxH 1999 OVA continuations (ruled in-flow)
    'hunter-x-hunter:138',
    'hunter-x-hunter:139',
    'fist-of-the-blue-sky:3864', // 4 DVD episodes, AFL numbers 23-26
    'hajime-no-ippo-the-fighting:12069', // Boxer's Fist = community ep 76
    'dr-stone:142876', // Ryuusui: order-only at position 36 (after Stone Wars) — Sean confirmed 2026-08-24 (his 'ep 95' was a typo; community places it mid-run)
  ]);
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
      const { data: bad } = await db.from('chapter_anchors').select('series_id, episode, chapter').in('series_id', suppressed).eq('source', 'afg-continua');
      for (const b of bad ?? []) classes.ruling_violation.push(`${b.series_id}: suppressed afg-continua anchor present (ep ${b.episode} → ch ${b.chapter})`);
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
    const fracs = await pageAll('ingest_fractionals', 'series_id, position, title');
    const oo = await pageAll('series_components', 'series_id, watch_position, episode_start');
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
    const annos = await pageAll('episode_annotations', 'series_id, kind');
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
    const annos = await pageAll('episode_annotations', 'series_id, episode, kind');
    const ruled = new Set(
      annos
        .filter((a: any) => a.kind === 'rearranged' || a.kind === 'graft')
        .map((a: any) => `${a.series_id}#${a.episode}`),
    );
    const spaceOf = new Map(series.map((s: any) => [s.id, Math.max(s.total_chapters ?? 0, s.latest_known_chapters ?? 0)]));
    for (const [sid, list] of bySeries) {
      list.sort((x, y) => x.episode - y.episode);
      for (let i = 1; i < list.length; i++) {
        if (list[i].chapter < list[i - 1].chapter) {
          if (ruled.has(`${sid}#${list[i].episode}`) || ruled.has(`${sid}#${list[i - 1].episode}`)) continue;
          classes.anchor_nonmonotonic.push(
            `${sid}: ep ${list[i - 1].episode}→ch${list[i - 1].chapter} then ep ${list[i].episode}→ch${list[i].chapter} — real reorder or junk? (ask Sean)`,
          );
        }
      }
      const space = spaceOf.get(sid) ?? 0;
      for (const a of list) {
        if (space > 0 && a.chapter > space + 10) {
          classes.anchor_beyond_chapter_space.push(`${sid}: ep ${a.episode}→ch${a.chapter} exceeds manga space (${space})`);
        }
      }
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
          // count canon/mixed rows in the gap (filler deserts are fine)
          const canonInGap = episodes.filter(
            (e: any) => e.series_id === row.id && e.number > prevEp && e.number < ep && e.type !== 'filler',
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

  for (const [k, v] of Object.entries(classes)) {
    console.log(`\n${k}: ${v.length}`);
    for (const id of v.slice(0, 40)) console.log('   ' + id);
    if (v.length > 40) console.log(`   …+${v.length - 40} more`);
  }
  console.log('\nlight_novel-source series:', lightNovel.length, '→', lightNovel.slice(0, 25).join(', '));
  const eightySix = series.find((s: any) => s.id.includes('86') || s.id.includes('eighty'));
  console.log('\n86 row:', JSON.stringify(eightySix));
}
main().then(() => process.exit(0));
