// ADOPTION — a source page attaches to a series that already exists (I44;
// Sean's go 2026-09-05, discovery step 3; PROPOSAL.md §1.1). Before this,
// resolveSeries looked a series up by afl_slug ONLY and minted a new slug
// otherwise, so an AFL page arriving for a seeded or AFG-only series (a
// series that already OWNS the AniList id in the registry, I2) threw
// ID COLLISION and broke the hourly cron for that slug — every seeded show
// AFL later charted would have. Identity comes first: the registry maps the
// page's AniList id INTO our id; the page then ADOPTS that series — afl_slug
// set, the afl id registered, AFL's rows upserted with minted_by 'afl'
// re-stamping the wiki rows in place (G57: the source that carries a number
// owns it), AFL's types taking over under T4 precedence.
//
// THE GATE (Cursor's closing note, 2026-09-05): an id match is not proof the
// page is the same show — the ladder's title tiers have matched namesakes
// before (G55). Adoption of a series that already carries rows needs TWO
// signals (I3's rule for AFG registration): the identity match AND span
// agreement — AFL's classified max within ±2 of our episode max, or within ±2
// of a component boundary (AFL charting S1 of a series we hold as S1+S2 is
// lag, I26, not a different show). Anything else is HELD (flag
// `adoption_held`, census class of the same name) for a ruling; a series'
// rows are never overwritten on a title match alone.


export type AdoptionVerdict = { ok: true; basis: string } | { ok: false; problem: string };

/** the pure gate: does AFL's classified span agree with the series we would adopt? */
export function adoptionVerdict(aflMax: number, ourMax: number, componentEnds: number[]): AdoptionVerdict {
  if (ourMax === 0) return { ok: true, basis: 'the series holds no episode rows yet — nothing to disagree with' };
  if (Math.abs(aflMax - ourMax) <= 2) return { ok: true, basis: `AFL's ${aflMax} agrees with our ${ourMax} (±2)` };
  const boundary = componentEnds.find((e) => Math.abs(aflMax - e) <= 2);
  if (boundary != null) return { ok: true, basis: `AFL's ${aflMax} ends on a component boundary (${boundary}) — AFL lags the later seasons (I26)` };
  return { ok: false, problem: `AFL's ${aflMax} classified vs our ${ourMax} rows (components end at ${componentEnds.join(', ') || 'none'}) — not the same span; held for a ruling (I44)` };
}

export type AdoptionOutcome = 'none' | 'adopted' | 'held';

/**
 * Identity-first (I2): if a series already owns this AniList id and carries no afl_slug, the AFL
 * page adopts it behind the gate. Returns 'none' when no such series exists (the caller mints),
 * 'adopted' when afl_slug is now set (the caller proceeds as an existing series), 'held' when the
 * gate refused (flagged; the caller writes nothing).
 */
export async function adoptByIdentity(runId: number, slug: string, anilistId: number, aflMax: number): Promise<AdoptionOutcome> {
  const { db, fileFlagOnce, selectAll } = await import('./db'); // lazy: adoptionVerdict above is pure and unit-tested without a DB
  const { data: reg } = await db.from('series_external_ids').select('series_id').eq('source', 'anilist').eq('external_id', String(anilistId)).maybeSingle();
  if (!reg) return 'none';
  const { data: s } = await db.from('series').select('id, afl_slug').eq('id', reg.series_id).maybeSingle();
  if (!s) return 'none';
  if (s.afl_slug === slug) return 'none'; // already this page's series — the normal path
  if (s.afl_slug) {
    // a second AFL page for a series another page already registered: I12's duplicate question, never a second series
    await fileFlagOnce(runId, slug, 'resolve', 'match_ambiguous', { reason: `anilist ${anilistId} is owned by ${s.id} (afl_slug ${s.afl_slug}) — a second AFL page for one series needs an I12 ruling`, ownerSeries: s.id, ownerSlug: s.afl_slug });
    return 'held';
  }
  const rows = await selectAll<{ number: number }>('episodes', 'number', (q) => q.eq('series_id', s.id));
  const ourMax = rows.reduce((m, r) => Math.max(m, r.number), 0);
  const comps = await selectAll<{ episode_end: number | null }>('series_components', 'episode_end', (q) => q.eq('series_id', s.id));
  const verdict = adoptionVerdict(aflMax, ourMax, comps.map((c) => c.episode_end).filter((e): e is number => e != null));
  if (verdict.ok === false) {
    await fileFlagOnce(runId, slug, 'resolve', 'adoption_held', { seriesId: s.id, anilistId, aflMax, ourMax, problem: verdict.problem });
    return 'held';
  }
  const { error } = await db.from('series').update({ afl_slug: slug, updated_at: new Date().toISOString() }).eq('id', s.id);
  if (error) throw new Error(`adopt (${slug} → ${s.id}): ${error.message}`);
  const { registerIds } = await import('./resolve'); // lazy: resolve.ts imports this module
  await registerIds(s.id, { afl: slug });
  console.log(`[adopt] ${slug} → ${s.id} (anilist ${anilistId}; ${verdict.basis})`);
  return 'adopted';
}
