// Applied rulings — apply-research-batch-3.ts (research-tier batch 3, Sean's
// sign-off 2026-08-23 "apply all A"): six frontier verdicts + the first
// population of the asterisk model. Script = cited record; extraction T2.1.
import type { RulingEntry } from '../types';

const ON = '2026-08-23';
const SCRIPT = 'scripts/ingest/apply-research-batch-3.ts';
const base = { ruledBy: 'Sean' as const, ruledOn: ON, cite: [SCRIPT] };

const anchor = (seriesId: string, episode: number | string, chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'A3', value: { episode, chapter, volume: null, source: 'manual' }, reason, ...base });
const annotate = (seriesId: string, episode: number, kind: string, chapters: string | null, reason: string): RulingEntry => ({ seriesId, ruleId: 'A43', value: { episode, kind, chapters }, reason, ...base });
const cont = (seriesId: string, continue_from_chapter: number, reason: string): RulingEntry => ({ seriesId, ruleId: 'C8', value: { continue_from_chapter }, reason, ...base });

export const ENTRIES: RulingEntry[] = [
  // ── 1. Claymore: original ending from ep 21; faithful through ep 20 ────
  anchor('claymore', 20, 56, 'last faithful episode → ch 54-56; eps 21-23 loose parallels of 57-59, 24-26 fully anime-original. animefillerguide.com/anime/claymore + wheredoestheanimeleaveoff.com + sportskeeda'),
  { seriesId: 'claymore', ruleId: 'A6', value: { deleteAnchors: { episodes: [24, 26], source: 'non-manual' } }, reason: 'eps 24-26 are fully anime-original — derived anchors on them violate A1 (filler / anime-only rows never carry anchors); deleted as the triage outcome.', ...base },
  { seriesId: 'claymore', ruleId: 'T6', value: { episodes: [24, 25, 26], type: 'anime-only-canon' }, reason: 'Madhouse outran the ongoing manga; eps 24-26 are the studio-original ending, retyped anime-only-canon.', ...base, retiresWhen: 'T4.0 (DRIFT-LIST A-7: studio-original endings — one class, three types; nothing retyped until then)' },
  annotate('claymore', 21, 'loose_parallel', 'ch 57-59', 'loosely parallels the Northern Campaign / Pieta battle with growing variations — anime outran the ongoing manga'),
  annotate('claymore', 22, 'loose_parallel', 'ch 57-59', 'loosely parallels the Northern Campaign / Pieta battle with growing variations — anime outran the ongoing manga'),
  annotate('claymore', 23, 'loose_parallel', 'ch 57-59', 'loosely parallels the Northern Campaign / Pieta battle with growing variations — anime outran the ongoing manga'),
  cont('claymore', 57, 'faithful adaptation ends at ch 56 (ep 20); readers continue at 57.'),

  // ── 2. Dorohedoro: ep 12 ends inside ch 41 (tail of vol 7) ─────────────
  anchor('dorohedoro', 12, 41, 'S1 ends near end of vol 7, final Kaiman/Nikaido scene from ch 41 (partial); minor skips en route. wheredoestheanimeleaveoff.com + mangashed.com + Wikipedia vol list'),
  annotate('dorohedoro', 12, 'partial', 'ch 41', 'finale ends mid-chapter-41; end-of-episode teaser images pull from later vol-7 chapters'),
  cont('dorohedoro', 42, 'S1 ends inside ch 41; continue at 42.'),

  // ── 3. Kimi ni Todoke: ch 86 unsupported; S3 finale → ch 75 ────────────
  { seriesId: 'kimi-ni-todoke-from-me-to-you', ruleId: 'P24', value: { deleteAnchors: { episode: '>= 40' } }, reason: 'the ch-86 anchor was a data error (mid-vol 21, unadapted) plus stale finale rows — deleted with evidence before the corrected finale anchor lands.', ...base },
  anchor('kimi-ni-todoke-from-me-to-you', 'aired_episodes (S3 finale, read at apply time)', 75, 'S3 finale ends at ch 75 / end of vol 18 (S3 skips chs 50-51); ch 86 was a data error (mid-vol 21, unadapted). mangashed.com + wheredoestheanimeleaveoff.com + animefillerguide.com'),
  cont('kimi-ni-todoke-from-me-to-you', 76, 'S3 finale ends at ch 75; continue at 76.'),

  // ── 4. Ayakashi Triangle: real reorder; finale ends ch 24 + graft ──────
  annotate('ayakashi-triangle', 9, 'rearranged', 'ch 26-27', 'anime plays chs 26-27 material early — genuine timeline reorder (displays as stored per the non-monotonic ruling)'),
  annotate('ayakashi-triangle', 12, 'graft', 'ch 34 scene', 'finale ends sequential coverage at ch 24 and grafts one scene from ch 34. animefillerguide.com + wheredoestheanimeleaveoff.com + ayakashi-triangle.fandom.com'),
  cont('ayakashi-triangle', 25, 'sequential coverage ends at ch 24; the ch-34 graft is not position.'),
  { seriesId: 'ayakashi-triangle', ruleId: 'A4', value: { max_adapted_chapter: 34 }, reason: 'coverage = furthest chapter adapted in the run: the finale grafts a ch-34 scene.', ...base },

  // ── 5. The Summer Hikaru Died: finale ends inside ch 26 ────────────────
  anchor('the-summer-hikaru-died', 12, 26, 'finale is mostly ch 26 with re-spliced ch-24 pages; small trim off ch 26 end. animefillerguide.com + wheredoestheanimeleaveoff.com'),
  annotate('the-summer-hikaru-died', 12, 'rearranged', 'ch 24 pages + ch 26', 'non-linear finale re-splices earlier chapter pages; ends inside ch 26'),
  cont('the-summer-hikaru-died', 27, 'finale ends inside ch 26; continue at 27.'),

  // ── 6. Kowloon Generic Romance: anime-original rearranged ending ───────
  annotate('kowloon-generic-romance', 11, 'rearranged', 'ch 77-78, 80, 82', 'highest chapter the anime touches (82) lands here, out of order'),
  annotate('kowloon-generic-romance', 12, 'divergence', 'ch 81', 'from ep 12 the anime diverges into its own "definitive ending" (ANN finale review: borrows then-unreleased chapter elements)'),
  annotate('kowloon-generic-romance', 13, 'divergence', 'ch 79 (rearranged)', 'anime-original framing over rearranged ch-79 material. animefillerguide.com + animenewsnetwork.com finale review + lostinanime.com'),
  cont('kowloon-generic-romance', 83, 'the anime touches ch 82 at most (out of order); readers continue at 83.'),
  { seriesId: 'kowloon-generic-romance', ruleId: 'A4', value: { max_adapted_chapter: 82 }, reason: 'coverage = furthest chapter adapted: ch 82 (ep 11, out of order).', ...base },

  // ── Kenshin 95-98: agenda 19b lands in the same model ──────────────────
  ...[95, 96, 97, 98].map((ep) => annotate('rurouni-kenshin', ep, 'side_story', 'pilot one-shots', 'adapts the pre-serialization pilot one-shots — real content outside mainline chapter numbering (episode titles matched the one-shots by name, 2026-08-24 research)')),
];
