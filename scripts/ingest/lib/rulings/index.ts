// Rulings index — ALL per-series rulings, standing and applied (restructure
// T2.1/T2.2). GENERATED FROM THE DIRECTORY LISTING by the coordinator; when
// a new map or applied file is added, add its import here (the system
// census asserts every file under lib/rulings/ is imported). Consumers read
// the derived lookups from the individual files; this index feeds
// scripts/restructure/gen-rulings.ts → docs/rulings.md.
import type { RulingEntry } from './types';
export * from './types';
import { ENTRIES as R0 } from './afg-registrations';
import { ENTRIES as R1 } from './applied/aot-finale';
import { ENTRIES as R2 } from './applied/aot-s4p2';
import { ENTRIES as R3 } from './applied/batch-1';
import { ENTRIES as R4 } from './applied/batch-10';
import { ENTRIES as R5 } from './applied/batch-11';
import { ENTRIES as R6 } from './applied/batch-12';
import { ENTRIES as R7 } from './applied/batch-13';
import { ENTRIES as R8 } from './applied/batch-14';
import { ENTRIES as R9 } from './applied/batch-15';
import { ENTRIES as R10 } from './applied/batch-16';
import { ENTRIES as R11 } from './applied/batch-17';
import { ENTRIES as R12 } from './applied/batch-3';
import { ENTRIES as R13 } from './applied/batch-4';
import { ENTRIES as R14 } from './applied/batch-5';
import { ENTRIES as R15 } from './applied/batch-6';
import { ENTRIES as R16 } from './applied/batch-7';
import { ENTRIES as R17 } from './applied/batch-8';
import { ENTRIES as R18 } from './applied/batch-9';
import { ENTRIES as R19 } from './applied/continue-points';
import { ENTRIES as R20 } from './applied/rearranged-anchors-2';
import { ENTRIES as R21 } from './applied/rearranged-anchors-3';
import { ENTRIES as R22 } from './applied/rearranged-anchors';
import { ENTRIES as R23 } from './applied/rulings-20260824';
import { ENTRIES as R24 } from './applied/rulings-20260825-mashle';
import { ENTRIES as R25 } from './applied/rulings-20260825b';
import { ENTRIES as R26 } from './applied/start-chapters';
import { ENTRIES as R27 } from './community-counts';
import { ENTRIES as R28 } from './continua-suppressed';
import { ENTRIES as R29 } from './episode-types';
import { ENTRIES as R30 } from './extras-adopted';
import { ENTRIES as R31 } from './mu-frontier-suppressed';
import { ENTRIES as R32 } from './numbering-shifts';
import { ENTRIES as R33 } from './override-chains';
import { ENTRIES as R34 } from './relations';
import { ENTRIES as R35 } from './reviewed-specials';
import { ENTRIES as R36 } from './ruled-splits';
import { ENTRIES as R37 } from './title-exclusions';
import { ENTRIES as R38 } from './watch-order-labels';

export const ALL_RULINGS: RulingEntry[] = [...R0, ...R1, ...R2, ...R3, ...R4, ...R5, ...R6, ...R7, ...R8, ...R9, ...R10, ...R11, ...R12, ...R13, ...R14, ...R15, ...R16, ...R17, ...R18, ...R19, ...R20, ...R21, ...R22, ...R23, ...R24, ...R25, ...R26, ...R27, ...R28, ...R29, ...R30, ...R31, ...R32, ...R33, ...R34, ...R35, ...R36, ...R37, ...R38];
