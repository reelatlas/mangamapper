import { useMemo, useState } from 'react';
import { AnimeSeries, EpisodeType } from '@/types/anime';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useCatalogMapping } from '@/hooks/useCatalog';
import { usePositionLookup } from '@/hooks/usePositionLookup';
import { buildEpisodeList } from '@/lib/mapping';
import { MappingStrip } from './MappingStrip';
import { InlinePositionRow } from './InlinePositionRow';
import { EpisodeList } from './EpisodeList';
import { TypeBadge, type TypeBadgeKind } from './TypeBadge';
import { StatusChip } from './StatusChip';

interface AnimeCardProps {
  anime: AnimeSeries;
  // takeover host wires the card's own close control (path bar x)
  onClose?: () => void;
}

// original run years for the identity line: "1997–1998", "1999", "2023–"
const airYears = (a: AnimeSeries): string | null => {
  if (!a.episodes.length) return null;
  const first = new Date(a.episodes[0].airDate).getFullYear();
  if (a.status === 'airing') return `${first}–`;
  const last = new Date(a.episodes[a.episodes.length - 1].airDate).getFullYear();
  return first === last ? String(first) : `${first}–${last}`;
};

// entrance line index for the print choreography (see .card-print in index.css)
const line = (i: number) => ({ 'data-line': true, style: { '--line-i': i } as React.CSSProperties });

// Expanded variant — skin: instrument_v1 (Card Skin Lab a3222c3b, locked
// 2026-08-20). Solid border-strong (dashed = list vocabulary), path-bar
// window chrome, duotone cover with hover reveal, print entrance.
export const AnimeCard = ({ anime, onClose }: AnimeCardProps) => {
  const { data: mapping } = useCatalogMapping(anime.id);
  // Lookup state lives here so MapLookup (inputs) and MappingStrip (needle +
  // click-to-set) operate as one instrument.
  const lookup = usePositionLookup(anime, mapping);

  const hasSource = mapping ? mapping.sourceType !== 'original' : anime.hasManga;
  // The ep field works for EVERY mapped series (incl. anime-original) —
  // inline field, strip clicks, and list rows are one instrument. The vol/ch
  // fields are editable only when manga values exist (the hook handles it).
  const lookupEnabled = !!mapping && mapping.airedEpisodes > 0;

  // full aired run as rows + collapsible sections (docs/components/episode-list.md)
  const episodeList = useMemo(
    () => (mapping && mapping.airedEpisodes > 0 ? buildEpisodeList(anime, mapping) : null),
    [anime, mapping],
  );

  // list selection follows the lookup; a manga_only (hatch) position orients
  // the list at the nearest aired episode before it
  const selectedEp = useMemo(() => {
    const r = lookup.result;
    if (!r || !mapping) return null;
    if (r.state === 'run' && r.ep !== null && r.ep <= mapping.airedEpisodes) return r.ep;
    if (r.state === 'hatch') return mapping.airedEpisodes;
    return null;
  }, [lookup.result, mapping]);

  // visible slice of the list → the strip's minimap band (M1 fill-only)
  const [viewband, setViewband] = useState<{ start: number; end: number } | null>(null);
  // minimap visibility — user chrome preference (2026-08-21: some users
  // won't want the band), shared across cards via localStorage; the toggle
  // sits in the legend line's empty LEFT slot as a comment-command (it is
  // view chrome, not a data filter — never a TypeBadge)
  const [minimapOn, setMinimapOn] = useState(() => {
    try {
      return localStorage.getItem('mm:minimap') !== 'off';
    } catch {
      return true;
    }
  });
  const toggleMinimap = () =>
    setMinimapOn((v) => {
      try {
        localStorage.setItem('mm:minimap', v ? 'off' : 'on');
      } catch {
        /* private mode: session-only */
      }
      return !v;
    });

  // legend-as-filter, CLICK-TO-HIDE: everything is "selected" by default;
  // clicking a badge hides that type, clicking again restores it. Purely a
  // VIEW concern — the lookup instrument is never filtered.
  const [hiddenKinds, setHiddenKinds] = useState<ReadonlySet<TypeBadgeKind>>(new Set());
  const toggleFilter = (kind: TypeBadgeKind) =>
    setHiddenKinds((prev) => {
      const next = new Set(prev);
      if (next.has(kind)) next.delete(kind);
      else next.add(kind);
      return next;
    });
  const hiddenTypes = useMemo(() => {
    if (hiddenKinds.size === 0) return undefined;
    const hidden = new Set<EpisodeType | 'manga_only'>();
    (['canon', 'mixed', 'filler'] as const).forEach((t) => {
      if (hiddenKinds.has(t)) hidden.add(t);
    });
    if (hiddenKinds.has('anime_only')) hidden.add('anime-only-canon');
    if (hiddenKinds.has('manga_only')) hidden.add('manga_only');
    return hidden;
  }, [hiddenKinds]);
  const visibleSections = useMemo(
    () =>
      episodeList
        ? hiddenTypes
          ? episodeList.sections.filter((s) => !hiddenTypes.has(s.type))
          : episodeList.sections
        : [],
    [episodeList, hiddenTypes],
  );
  const badgeState = (kind: TypeBadgeKind) => ({
    onClick: () => toggleFilter(kind),
    pressed: !hiddenKinds.has(kind), // visible = selected
    dimmed: hiddenKinds.has(kind),
  });

  const years = airYears(anime);

  return (
      <Card className="overflow-hidden border-border-strong">
        {/* path bar — window chrome: where you are + the kill switch. The
            command metaphor ("> open(...)") was rejected as stale once the
            card is running; a path stays true for the card's whole life. */}
        <div
          className="flex items-center justify-between border-b border-border-strong px-3 py-2 text-[11px] leading-none"
          {...line(0)}
        >
          <span className="text-muted-foreground">~/catalog/{anime.id}</span>
          {onClose && (
            <button
              aria-label="close"
              onClick={onClose}
              className="text-[13px] leading-none text-muted-foreground hover:text-primary"
            >
              x
            </button>
          )}
        </div>
        <CardContent className="p-0">

            {/* Readout — full width; card rhythm: per-seam tokens
                (region/tight), not a uniform gap */}
            <div className="p-4 flex flex-col font-mono min-w-0">
              {/* Identity BAND (stamp ruling, 2026-08-20): 2:3 poster stamp
                  left (shown as-is; duotone shelved), titles top-aligned
                  beside it, chip far right. Gap stamp→titles = the readout's
                  own padding (gap-4 = p-4). The instrument runs full-width
                  BELOW the band. */}
              <div className="flex items-start justify-between gap-4 min-w-0" {...line(1)}>
                <div className="flex min-w-0 items-start gap-4">
                  <div className="relative aspect-[2/3] w-[104px] shrink-0 overflow-hidden border border-border-strong">
                    <img
                      src={anime.coverImage}
                      alt={anime.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 pt-0.5">
                    <div className="title-glow text-base font-semibold text-syntax-green leading-tight break-words">
                      {anime.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 break-words">
                      {anime.japaneseTitle}
                      {years && <span className="whitespace-nowrap"> · {years}</span>}
                    </div>
                  </div>
                </div>
                <StatusChip status={anime.status} className="mt-0.5 shrink-0" />
              </div>

              {/* THE position instrument — totals row and lookup merged: the
                  current numbers are the inputs, totals live after the /.
                  Spec: docs/components/position-row.md */}
              <div className="mt-loose" {...line(2)}>
                <InlinePositionRow anime={anime} mapping={mapping} lookup={lookup} hasSource={hasSource} />
              </div>

              {/* Whole-story density + episode list (C1 hierarchy: the badge
                  legend lives with the strip it describes; the list header is
                  purely functional; the episode total lives in anime totals) */}
              <div className="mt-tight">
                {mapping ? (
                  <>
                    <div {...line(3)}>
                    <MappingStrip
                      spans={mapping.spans}
                      airedEpisodes={mapping.airedEpisodes}
                      markerEpisode={lookup.markerUnit}
                      markerRest={lookup.markerRest}
                      mangaAheadUnits={mapping.mangaAheadUnits}
                      mangaAheadChapters={mapping.mangaAheadChapters}
                      onUnitClick={lookupEnabled ? lookup.stripClick : undefined}
                      viewband={minimapOn ? viewband : null}
                      hiddenTypes={hiddenTypes}
                    />
                    </div>
                    {/* badge legend — below the strip, right-aligned (G4,
                        2026-08-19): graphic first, key tucked right. Badges
                        with no data don't render; each badge is a
                        click-to-hide filter toggle */}
                    {/* chips carry their own boxes — gap back down from the
                        naked-tag gap-5 (that air was doing the brackets' job) */}
                    <div className="mt-tight flex flex-wrap items-center justify-end gap-2" {...line(4)}>
                      {/* minimap toggle — TypeBadge chip grammar (neutral
                          foreground tint, same wash/radius/fade-when-off),
                          but the "glyph" is a drawn MINIATURE of the strip
                          with its band — no word needed. Left slot: view
                          chrome, not a data filter. */}
                      <button
                        type="button"
                        onClick={toggleMinimap}
                        aria-pressed={minimapOn}
                        aria-label="toggle minimap band"
                        title="minimap"
                        className={cn(
                          'mr-auto inline-flex cursor-pointer items-center rounded-sm bg-foreground/[0.12] px-1.5 py-[0.4375rem] transition-opacity hover:opacity-75',
                          !minimapOn && 'opacity-40 hover:opacity-60',
                        )}
                      >
                        {/* the track (dim) with the band slice (bright) —
                            same tones as the real strip's M1 band */}
                        <span className="relative h-1.5 w-7 overflow-hidden rounded-[1px] bg-foreground/20">
                          <span className="absolute inset-y-0 left-[35%] w-[30%] bg-foreground/70" />
                        </span>
                      </button>
                      {mapping.sourceType === 'original' ? (
                        <TypeBadge
                          type="anime_only"
                          count={mapping.animeOnlyCount}
                          {...badgeState('anime_only')}
                        />
                      ) : (
                        <>
                          <TypeBadge type="canon" count={mapping.canonCount} {...badgeState('canon')} />
                          {mapping.mixedCount > 0 && (
                            <TypeBadge type="mixed" count={mapping.mixedCount} {...badgeState('mixed')} />
                          )}
                          {mapping.fillerCount > 0 && (
                            <TypeBadge
                              type="filler"
                              count={`${mapping.fillerCount} (${mapping.fillerPercent}%)`}
                              {...badgeState('filler')}
                            />
                          )}
                          {mapping.mangaAheadChapters != null && mapping.mangaAheadChapters > 0 && (
                            <TypeBadge
                              type="manga_only"
                              count={`+${mapping.mangaAheadChapters}ch`}
                              {...badgeState('manga_only')}
                            />
                          )}
                        </>
                      )}
                    </div>
                    {/* legend → list spacing matches the card's region rhythm;
                        separation is spacing, not divider lines */}
                    {episodeList && (
                      <div className="mt-region" {...line(5)}>
                        <EpisodeList
                          rows={episodeList.rows}
                          sections={visibleSections}
                          selectedEp={selectedEp}
                          jumpSerial={lookup.jumpSerial}
                          interactive={lookupEnabled}
                          onSelectEpisode={lookupEnabled ? lookup.selectEpisode : undefined}
                          onVisibleRangeChange={setViewband}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-1.5 w-full bg-muted" aria-hidden />
                )}
              </div>
            </div>
        </CardContent>
      </Card>
  );
};
