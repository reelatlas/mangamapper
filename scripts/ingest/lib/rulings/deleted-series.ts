// Ruled deletions — P40 (Sean 2026-09-05, after INCIDENT-2026-09-05). A
// `series` row is deleted by exactly one path (rebuild.ts, a canonical-shape
// migration under Sean's authorization) and every deletion is a RULING here;
// the tombstone ledger (series_ledger, kept by DB triggers) records what
// actually happened, and the census class series_deleted_unruled lists any
// ledger deletion no entry names. None today: the six incident deletions
// predate the ledger and were re-created under their old ids.
import { toSet, type RulingEntry } from './types';

export type DeletedSeries = { deletedOn: string };

export const ENTRIES: RulingEntry<DeletedSeries>[] = [];

export const RULED_DELETIONS: Set<string> = toSet(ENTRIES);
