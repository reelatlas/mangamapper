// AFG_CHART_SUPPRESSED — per-series suppression of the AFG CHART lane (the
// episode ↔ chapter table that syncAnchors turns into afg-tier anchors), the
// G26 principle applied to the chart the way CONTINUA_SUPPRESSED applies it
// to the frontier table (Sean + Cursor 2026-09-04): when research proves a
// page's chart cannot be joined to our numbering, the lane is suppressed for
// that series — the writer deletes the standing afg anchors and stops; a
// title join is NEVER the fix (the titles are in one order for only part of
// the page — the verifier proved a title join would re-mint a deleted anchor).
import type { RulingEntry } from './types';
import { toRecord } from './types';

export const ENTRIES: RulingEntry<string>[] = [
  {
    seriesId: 'ranma-1-2',
    ruleId: 'G26',
    value: "AFG's Ranma page prints its CHAPTER / type column in Digital-Remaster PRODUCTION order while its rows are indexed like our BROADCAST numbering — 41 of 161 rows mis-aligned by the index join (18 consecutive rows proven; the 'contradictions' at 90 / 123 / 124 / 131 / 134 / 156 were neighbours' real values we already anchor). Chart lane suppressed; the 42 standing afg anchors are the writer's to delete; AFL + ranma.fandom + ja-WP's deleted 原作 column cover the series.",
    reason: 'Batch 21 wave 1 (out/ranma-1-2-w1.json, verified w1-flips.md — the title-join alternative REFUTED), Sean ruled 2026-09-04 on Cursor\'s read: suppress the chart lane, not the continua table; drop the position-joined afg anchors so the misaligned rows stop feeding the census.',
    ruledBy: 'Sean',
    ruledOn: '2026-09-04',
    cite: ['scripts/ingest/research/batch21/out/ranma-1-2-w1.json', 'scripts/ingest/research/batch21/verify/w1-flips.md'],
  },
];

export const AFG_CHART_SUPPRESSED: Record<string, string> = toRecord(ENTRIES);
