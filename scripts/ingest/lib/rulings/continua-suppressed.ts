// CONTINUA_SUPPRESSED — per-series suppression of the AFG continua source
// (G26, the Claymore/Kimi lesson 2026-08-23): same-episode precedence cannot
// stop a ruled-WRONG source value landing on a DIFFERENT episode — when
// research proves a source's frontier wrong for a series, that source is
// suppressed there entirely. Applied by the source's writer (applyContinua
// deletes the standing afg-continua anchor and stops); verified outcome-side
// by the ruling_violation audit.
//
// Consumer shape: Record<seriesId, string> — the string is the reasoning the
// writer / audit surface, so `value` and `reason` carry the same text.

import type { RulingEntry } from './types';
import { toRecord } from './types';

const entry = (seriesId: string, reason: string, ruledOn: string, extra: Partial<RulingEntry<string>> = {}): RulingEntry<string> => ({
  seriesId,
  ruleId: 'G26',
  value: reason,
  reason,
  ruledBy: 'session',
  ruledOn,
  ...extra,
});

export const ENTRIES: RulingEntry<string>[] = [
  entry(
    'you-and-i-are-polar-opposites',
    'continua endEpisode converts to our ep 11 while AFG\'s OWN chart rows put the frontier at ep 12 (chart: ep 11 = 26-28, ep 12 = 29-31) — a wrong-episode pin that overwrote real chart data and tripped anchor_start_offtrend (deep pass 2026-08-25); the chart rows carry the true frontier. Retire if AFG fixes its continua episode or the conversion gains a chart cross-check (restructuring-phase gate candidate)',
    '2026-08-25',
    { retiresWhen: 'AFG fixes its continua episode, or the continua→episode conversion gains a chart cross-check (restructure gate candidate)' },
  ),
  entry(
    'claymore',
    'continua says ep 26 → ch 54, but eps 24-26 are fully anime-original (research 2026-08-23) — the manual ep-20 → ch-56 anchor is the frontier',
    '2026-08-23',
  ),
  entry(
    'kimi-ni-todoke-from-me-to-you',
    'continua says ep 43 → ch 86 — ch 86 is unsupported anywhere (mid-vol 21, unadapted; research 2026-08-23); manual ep-44 → ch-75 is the frontier',
    '2026-08-23',
  ),
];

export const CONTINUA_SUPPRESSED: Record<string, string> = toRecord(ENTRIES);
