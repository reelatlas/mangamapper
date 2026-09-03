// Rulings index — ALL per-series rulings, standing and applied (restructure
// T2.1/T2.2). GENERATED FROM THE DIRECTORY LISTING by the coordinator; when
// a new map or applied file is added, add its import here (the system
// census asserts every file under lib/rulings/ is imported). Consumers read
// the derived lookups from the individual files; this index feeds
// scripts/restructure/gen-rulings.ts → docs/rulings.md.
import type { RulingEntry } from './types';
export * from './types';
import { ENTRIES as EAIR } from './air-dates';
import { ENTRIES as ETIT } from './episode-titles';
import { ENTRIES as EORD } from './air-date-order';
import { ENTRIES as EWIN } from './air-date-window';
import { ENTRIES as ESTRUCT } from './structure';
import { ENTRIES as ERET } from './retired-annotations';
import { OVERRIDE_ENTRIES as ESRC } from './source-kinds';
import { ENTRIES as ESTAND } from './standing-annotations';
import { ENTRIES as EANCH } from './anchor-suppressed';
import { ENTRIES as EFMT } from './format-overrides';
import { ENTRIES as EPERM } from './permanence';
import { ENTRIES as E0 } from './afg-registrations';
import { ENTRIES as E1 } from './applied/aot-finale';
import { ENTRIES as E2 } from './applied/aot-s4p2';
import { ENTRIES as E3 } from './applied/batch-1';
import { ENTRIES as E4 } from './applied/batch-10';
import { ENTRIES as E5 } from './applied/batch-11';
import { ENTRIES as E6 } from './applied/batch-12';
import { ENTRIES as E7 } from './applied/batch-13';
import { ENTRIES as E8 } from './applied/batch-14';
import { ENTRIES as E9 } from './applied/batch-15';
import { ENTRIES as E10 } from './applied/batch-16';
import { ENTRIES as E11 } from './applied/batch-17';
import { ENTRIES as E12 } from './applied/batch-3';
import { ENTRIES as E13 } from './applied/batch-4';
import { ENTRIES as E14 } from './applied/batch-5';
import { ENTRIES as E15 } from './applied/batch-6';
import { ENTRIES as E16 } from './applied/batch-7';
import { ENTRIES as E17 } from './applied/batch-8';
import { ENTRIES as E18 } from './applied/batch-9';
import { ENTRIES as E19 } from './applied/continue-points';
import { ENTRIES as E20 } from './applied/rearranged-anchors-2';
import { ENTRIES as E21 } from './applied/rearranged-anchors-3';
import { ENTRIES as E22 } from './applied/rearranged-anchors';
import { ENTRIES as E23 } from './applied/rulings-20260824';
import { ENTRIES as E24 } from './applied/rulings-20260825-mashle';
import { ENTRIES as E25 } from './applied/rulings-20260825b';
import { ENTRIES as E26 } from './applied/start-chapters';
import { ENTRIES as E27 } from './community-counts';
import { ENTRIES as E28 } from './continua-suppressed';
import { ENTRIES as E29 } from './episode-types';
import { ENTRIES as E30 } from './extras-adopted';
import { ENTRIES as E31 } from './mu-frontier-suppressed';
import { ENTRIES as E32 } from './numbering-shifts';
import { ENTRIES as E33 } from './override-chains';
import { ENTRIES as E34 } from './relations';
import { ENTRIES as E35 } from './reviewed-specials';
import { ENTRIES as E36 } from './ruled-splits';
import { ENTRIES as E37 } from './title-exclusions';
import { ENTRIES as E38 } from './watch-order-labels';
import { ENTRIES as E39 } from './source-relations';
import { ENTRIES as E40 } from './arcs';
import { ENTRIES as E41 } from './correspondence';
import { ENTRIES as E42 } from './chapter-spaces';
import { ENTRIES as E43 } from './source-chains';
import { ENTRIES as E44 } from './applied/batch-20-waves-1-8';
import { ENTRIES as E45 } from './applied/batch-20-waves-9-16';

export const ALL_RULINGS: RulingEntry[] = [...EAIR, ...ETIT, ...EORD, ...EWIN, ...ESTRUCT, ...ERET, ...ESRC, ...ESTAND, ...EANCH, ...EFMT, ...EPERM, ...E0, ...E1, ...E2, ...E3, ...E4, ...E5, ...E6, ...E7, ...E8, ...E9, ...E10, ...E11, ...E12, ...E13, ...E14, ...E15, ...E16, ...E17, ...E18, ...E19, ...E20, ...E21, ...E22, ...E23, ...E24, ...E25, ...E26, ...E27, ...E28, ...E29, ...E30, ...E31, ...E32, ...E33, ...E34, ...E35, ...E36, ...E37, ...E38, ...E39, ...E40, ...E41, ...E42, ...E43, ...E44, ...E45];

