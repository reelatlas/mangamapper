// Watch-order entry rulings — N31 (restructure T2.1, 2026-08-26; formerly the
// RULED_LABELS / RULED_RECORDS literals in scripts/ingest/sync-watch-order.ts).
// One entry per ruled watch-order POSITION of a series: `record` carries the
// structured adaptation fields the ruling knows (chapter / volume /
// chapters_adapted / kind); `label` is the per-series SURFACE ruling — an
// entry with a label renders in the episode table in the +N format, an entry
// without one stays data-ready with display_label null.
//
// SURFACING IS PARKED (Sean 2026-08-24): MHA's labels ('170+1', '170+1.5')
// were briefly live, then pulled — surfacing waits for the
// specials/OVAs/movies STATUS design pass (the v2 reference point is N32).
// Re-activate by setting label: '170+1' / '170+1.5' on the two MHA entries.
// RULED_LABELS is therefore derived EMPTY today — authoritative both ways.

import type { RulingEntry } from './types';

export type WatchOrderRecord = { chapter: number; volume: number | null; chapters_adapted: string; kind: string };
export type WatchOrderRuling = { position: number; label?: string; record?: WatchOrderRecord };

export const ENTRIES: RulingEntry<WatchOrderRuling>[] = [
  {
    seriesId: 'my-hero-academia',
    ruleId: 'N31',
    value: { position: 171, record: { chapter: 431, volume: 42, chapters_adapted: '431', kind: 'special' } },
    reason:
      "'No. 170+1: More' (AniList 204356, 2026-05-02) adapts ch 431 (vol 42 bonus). Sean 2026-08-24: essential canon the community groups with the series, community-numbered 170+1 — order-only after the FINAL SEASON; counts stay 170. Label PARKED pending the specials/OVAs/movies STATUS design pass.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    retiresWhen: 'the STATUS design pass rules on surfacing — then the label is restored (N32)',
  },
  {
    seriesId: 'my-hero-academia',
    ruleId: 'N31',
    value: { position: 171.5, record: { chapter: 431.5, volume: 42, chapters_adapted: '431.5', kind: 'special' } },
    reason:
      "'I am a hero too' Eri special (AniList 211711, 2026-08-03) adapts ch 431.5 (vol 42). Sean's ruling: mangaMapper position 170+1.5, matching the manga's .5 bonus format — order-only after the FINAL SEASON; counts stay 170. Label PARKED pending the specials/OVAs/movies STATUS design pass.",
    ruledBy: 'Sean',
    ruledOn: '2026-08-24',
    retiresWhen: 'the STATUS design pass rules on surfacing — then the label is restored (N32)',
  },
];

/** sync-watch-order.ts consumer shape: series_id → position → surfaced label (absent = unsurfaced) */
export const RULED_LABELS: Record<string, Record<number, string>> = {};
/** sync-watch-order.ts consumer shape: series_id → position → structured adaptation record */
export const RULED_RECORDS: Record<string, Record<number, WatchOrderRecord>> = {};
for (const e of ENTRIES) {
  if (e.value.label != null) (RULED_LABELS[e.seriesId] ??= {})[e.value.position] = e.value.label;
  if (e.value.record) (RULED_RECORDS[e.seriesId] ??= {})[e.value.position] = e.value.record;
}
