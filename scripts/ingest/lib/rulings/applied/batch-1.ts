// Applied rulings — apply-research-batch.ts (research-tier batch 1, Sean's
// sign-off 2026-08-24). The script stays the cited record; this file is the
// typed extraction (restructure T2.1). Entries flagged OVERTAKEN were
// contradicted by a later ruling — re-running the script would revert it
// (DRIFT-LIST §E.5; P34).
import type { RulingEntry } from '../types';

const ON = '2026-08-24';
const SCRIPT = 'scripts/ingest/apply-research-batch.ts';

const anchor = (seriesId: string, episode: number, chapter: number, volume: number, reason: string, extra: Partial<RulingEntry> = {}): RulingEntry => ({
  seriesId, ruleId: 'A3', value: { episode, chapter, volume, source: 'manual' }, reason, ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT], ...extra,
});
const dismiss = (seriesId: string, verdict: string): RulingEntry => ({
  seriesId, ruleId: 'G3', value: { flags: 'open → confirmed', verdict }, reason: `open ingest_flags closed with verdict: ${verdict}`, ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT],
});
const orderOnly = (seriesId: string, reason: string): RulingEntry => ({
  seriesId, ruleId: 'N3', value: { action: 'toOrderOnly', nonSeasonComponents: 'episode range → null', seasonRanges: 'recomputed contiguously in season_order' }, reason, ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT],
});
const dup = (seriesId: string): RulingEntry => ({
  seriesId, ruleId: 'I15', value: { action: 'delete series + episodes + anchors + components + external ids', sourceMapDisposition: 'duplicate' },
  reason: 'Monogatari legacy duplicate — content lives in monogatari-series per the one-series ruling (one continuous story = ONE series).', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT, 'docs/franchise-rulings.md'],
});

export const ENTRIES: RulingEntry[] = [
  // ── A. Frontier anchors (manual, cited) ────────────────────────────────
  anchor('rurouni-kenshin', 62, 151, 18, 'Kyoto arc end; eps 63+ anime-original. mangashed.com + wheredoestheanimeleaveoff.com + Wikipedia'),
  anchor('rurouni-kenshin-2023', 47, 106, 13, 'Kyoto Disturbance end (Act 106 partially adapted). animefillerguide.com + wheredoestheanimeleaveoff.com + kenshin.fandom.com'),
  anchor('haikyu', 85, 292, 33, 'S4 end = Ch 292 "The Same Old Night Never Comes Again". Wikipedia + wheredoestheanimeleaveoff.com + haikyuu.fandom.com', {
    retiresWhen: 'OVERTAKEN 2026-08-23 — the ep-85 row was converted to OUR numbering (ep 87, +2 for the Riku vs Kuu OVA; batch 7 bookmark closure, N14 Haikyu ep-85 lesson)',
  }),
  anchor('boruto-naruto-next-generations', 293, 67, 17, 'Ep 293 hiatus finale = end of Ch 67 "Rift". sportskeeda + mangashed + boruto.fandom.com'),
  anchor('x', 20, 84, 17, 'research-tier (medium confidence): follows manga to ~vol 17/ch 84 at ep 20, then original ending. xtvclamp.fandom.com + Wikipedia + cbr.com', {
    retiresWhen: 'OVERTAKEN — x ep 20 re-ruled to ch 94 / vol 18 (DRIFT-LIST §A closed items, §12); eps 21-24 retyped (T10 only-ending class)',
  }),
  dismiss('rurouni-kenshin', 'research-tier frontier applied as manual anchor (sources in anchor note); Sean sign-off 2026-08-24'),
  dismiss('rurouni-kenshin-2023', 'research-tier frontier applied as manual anchor (sources in anchor note); Sean sign-off 2026-08-24'),
  dismiss('haikyu', 'research-tier frontier applied as manual anchor (sources in anchor note); Sean sign-off 2026-08-24'),
  dismiss('boruto-naruto-next-generations', 'research-tier frontier applied as manual anchor (sources in anchor note); Sean sign-off 2026-08-24'),
  dismiss('x', 'research-tier frontier applied as manual anchor (sources in anchor note); Sean sign-off 2026-08-24'),

  // ── B. Loose-adaptation verdicts ───────────────────────────────────────
  { seriesId: 'sgt-frog', ruleId: 'A40', value: { mapping_mode: 'loose' }, reason: '71% filler, manga stories cherry-picked non-linearly across 358 eps — no chapter mapping meaningful (animefillerlist + Wikipedia)', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT] },
  { seriesId: 'outlaw-star', ruleId: 'A40', value: { mapping_mode: 'loose' }, reason: "parallel telling: anime finished ~11 months before the manga; episodic vs manga's direct Leyline drive (Wikipedia + anime-planet)", ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT] },
  dismiss('sgt-frog', 'research-tier verdict: loose adaptation — no chapter mapping is meaningful; mapping_mode=loose; Sean sign-off 2026-08-24'),
  dismiss('outlaw-star', 'research-tier verdict: loose adaptation — no chapter mapping is meaningful; mapping_mode=loose; Sean sign-off 2026-08-24'),

  // ── C. Souten no Ken conflation repair ─────────────────────────────────
  {
    seriesId: 'fist-of-the-blue-sky', ruleId: 'I16',
    value: { deleteComponent: { anilist_id: 967 }, rebuild: [{ anilist_id: 1541, season_order: 1, episode_start: 1, episode_end: 22, label: 'Souten no Ken', kind: 'season' }] },
    reason: 'Hokuto no Ken (AniList 967) component removed from the Souten no Ken series — 109+22=131 conflation proven; the prequel spin-off is its own series (22 TV eps).',
    ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT],
  },
  {
    seriesId: 'fist-of-the-blue-sky', ruleId: 'I19',
    value: { component: { anilist_id: 3864, season_order: 2, episode_start: 23, episode_end: 26, label: 'Souten no Ken (DVD episodes)', kind: 'ova' } },
    reason: 'DVD episodes stored as an in-flow OVA span 23-26 so the run counts 26.',
    ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT],
    retiresWhen: 'OVERTAKEN 2026-08-25 (apply-rulings-20260825b §6, Sean, verifier-confirmed) — the four DVD-only episodes are WITHHELD TV eps (production 16/17/18/21), not OVAs; component demoted to ORDER-ONLY (null span). Re-running the batch script recreates the wrong span (DRIFT-LIST §E.5).',
  },
  { seriesId: 'fist-of-the-blue-sky', ruleId: 'N3', value: { aired_episodes: 26, total_episodes: 26 }, reason: '22 TV + 4 DVD eps = 26 after the conflation repair.', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT] },
  { seriesId: 'fist-of-the-blue-sky', ruleId: 'G38', value: { deleteAnchors: { source: 'mu' } }, reason: 'mu anchors were derived against the conflated (Hokuto no Ken) scope — wiped; the MU writer re-derives on the next run.', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT] },

  // ── D. Monogatari legacy duplicates (one-series ruling) ────────────────
  dup('nisemonogatari'), dup('monogatari-series-second-season'), dup('hanamonogatari'), dup('tsukimonogatari'), dup('owarimonogatari'),

  // ── E. Community-count restructures (Sean's numbered-vs-event rule) ────
  { seriesId: 'psycho-pass', ruleId: 'N3', value: { deleteEpisodes: [42, 43, 44] }, reason: 'First Inspector + films = watch-order events; community count is 41 eps (Sean ruling) — the three film rows drop.', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT] },
  orderOnly('psycho-pass', 'First Inspector + films = watch-order events; 41 eps (Sean ruling)'),
  orderOnly('k', 'Missing Kings movie = watch-order event; 26 eps'),
  orderOnly('hayate-the-combat-butler', 'OVA + movie = watch-order events; 101 eps'),
  orderOnly('hajime-no-ippo-the-fighting', 'Champion Road / Mashiba OVA = watch-order events; 127 eps'),

  // ── F. Community-counted specials become rows ──────────────────────────
  {
    seriesId: 'dr-stone', ruleId: 'N3', value: { addRow: { number: 95, title: 'Dr. STONE: Ryuusui', type: 'canon', air_date: '2022-07-10' } },
    reason: 'Ryuusui TV special adapts ch 84-89; community-counted — Sean ruling.', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT],
    retiresWhen: 'OVERTAKEN 2026-08-23 (batch 7 Q1: Ryuusui "modeled as order-only component at watch_position 35.5"; SOURCE_NUMBERING_SHIFTS dr-stone drop [36]) — the row-95 creation contradicts the later order-only ruling (DRIFT-LIST §E.5).',
  },
  { seriesId: 'fate-stay-night-unlimited-blade-works', ruleId: 'N3', value: { addRow: { number: 0, title: 'Prologue', type: 'anime-only-canon', air_date: '2014-10-04' } }, reason: 'broadcast prologue; count starts at 0 per Sean.', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT] },
  { seriesId: 'darwin-s-game', ruleId: 'N3', value: { addRow: { number: 11, title: 'Sunset Ravens', type: 'canon', air_date: '2020-03-20' } }, reason: 'finale; community list stale — MAL + ANN.', ruledBy: 'Sean', ruledOn: ON, cite: [SCRIPT] },
];
