// The format axis (rule T29, T4.4 2026-08-26 — T4.0 D-11). An episode's
// FORMAT (tv / ova / special / movie / recap) is a second, independent axis
// beside its STANDING (canon / mixed / filler, T27): a movie that adheres is
// canon + movie; a recap can be filler or canon + recap. Derived, never
// typed by a source: the containing component's kind decides (season → tv;
// ova / special / movie carry their own), and FORMAT_OVERRIDES names the
// rows no component covers or a ruling corrects. Unknown → null (honest).
import { FORMAT_OVERRIDES } from './rulings/format-overrides';

export const FORMATS = ['tv', 'ova', 'special', 'movie', 'recap'] as const;
export type Format = (typeof FORMATS)[number];

const COMPONENT_KIND_FORMAT: Record<string, Format> = { season: 'tv', ova: 'ova', special: 'special', movie: 'movie' };

/** the ONE derivation (P2): the healer and the audit call this */
export const deriveFormat = (seriesId: string, episode: number, componentKind: string | null | undefined): Format | null => {
  const ruled = FORMAT_OVERRIDES[seriesId]?.[episode];
  if (ruled) return ruled;
  if (!componentKind) return null;
  return COMPONENT_KIND_FORMAT[componentKind] ?? null;
};
