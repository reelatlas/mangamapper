// AFG registration rulings — explicit afg slug → our series id (restructure
// T2.1, 2026-08-26; formerly the RULED literal in
// scripts/ingest/audit-afg-structure.ts). The 'ruled' match tier of I3
// (identity-first, flag-first): a title key two series both claim never
// auto-matches (I4) — it comes here as a durable human ruling. `match: null`
// means ruled NOT a match (none today).
// seriesId = OUR series id the page registers to ('*' when ruled excluded);
// the lookup is keyed by the AFG slug the consumer resolves.

import type { RulingEntry } from './types';

export type AfgRegistration = { afgSlug: string; match: string | null };

export const ENTRIES: RulingEntry<AfgRegistration>[] = [
  {
    seriesId: 'sailor-moon',
    ruleId: 'I4',
    value: { afgSlug: 'bishoujo-senshi-sailor-moon', match: 'sailor-moon' },
    reason: "AFG's bishoujo-senshi-sailor-moon page is the 90s original, NOT Crystal — a synonym collision (both our entries carry the romaji) found in the 2026-08-24 audit, so the key is ambiguous and needs a ruling.",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: ['docs/franchise-rulings.md "AFG bishoujo-senshi-sailor-moon page = the 90s original"'],
  },
  {
    seriesId: 'digimon-digital-monsters',
    ruleId: 'I4',
    value: { afgSlug: 'digimon-adventure', match: 'digimon-digital-monsters' },
    reason: "Zero-episode AFG stub whose slug collides with our 2020 entry's id AND the 1999 entry's afl_slug; AFG's title \"Digimon Adventure\" is the 1999 romaji exactly (the 2020 reboot is \"Digimon Adventure:\" per AniList naming), so it registers to the 1999 series.",
    ruledBy: 'session',
    ruledOn: '2026-08-24',
    cite: ['docs/franchise-rulings.md "AFG digimon-adventure page = the 1999 series"'],
  },
];

/** audit-afg-structure.ts consumer shape: afg slug → our series id (null = ruled NOT a match) */
export const RULED: Record<string, string | null> = Object.fromEntries(ENTRIES.map((e) => [e.value.afgSlug, e.value.match]));
