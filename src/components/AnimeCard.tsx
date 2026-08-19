import { useMemo, useState } from 'react';
import { AnimeSeries, EpisodeType } from '@/types/anime';
import { Card, CardContent } from '@/components/ui/card';
import { useCatalogMapping } from '@/hooks/useCatalog';
import { usePositionLookup } from '@/hooks/usePositionLookup';
import { buildEpisodeList } from '@/lib/mapping';
import { MappingStrip } from './MappingStrip';
import { InlinePositionRow } from './InlinePositionRow';
import { EpisodeList } from './EpisodeList';
import { TypeBadge, type TypeBadgeKind } from './TypeBadge';

interface AnimeCardProps {
  anime: AnimeSeries;
  rank?: number;
}

// Expanded variant ("v1 refined_pane"). A compact list-row variant will join
// it when the homepage becomes the compact list view.
export const AnimeCard = ({ anime, rank }: AnimeCardProps) => {
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

  // Navigation to the details page is intentionally disabled in browse mode —
  // clicking will become expand/collapse when the compact variant lands.
  return (
      <Card className="group overflow-hidden transition-all duration-200 hover:border-primary/50 border-dashed">
        <div className="terminal-header flex items-center justify-between">
          <span className="flex items-center gap-2">
            {rank && <span className="text-syntax-amber">#{String(rank).padStart(2, '0')}</span>}
            {rank && <span className="text-border">|</span>}
            <span className="text-muted-foreground">series_map</span>
          </span>
          <span className="text-muted-foreground">
            {anime.status === 'airing' ? (
              <span className="text-accent">airing</span>
            ) : anime.status === 'hiatus' ? (
              <span className="text-syntax-amber">hiatus</span>
            ) : (
              <span>{anime.status}</span>
            )}
          </span>
        </div>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Cover */}
            <div className="relative w-full sm:w-32 h-40 sm:h-auto shrink-0 self-stretch overflow-hidden border-b sm:border-b-0 sm:border-r border-dashed">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent sm:bg-gradient-to-r" />
            </div>

            {/* Readout */}
            {/* card rhythm: per-seam tokens (region/tight), not a uniform gap —
                positions→strip and strip→legend are the tight pairs */}
            <div className="flex-1 p-4 flex flex-col font-mono min-w-0">
              {/* Title block */}
              <div className="min-w-0">
                <div className="text-base font-semibold text-syntax-green leading-tight break-words">
                  {anime.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 break-words">
                  {anime.japaneseTitle}
                </div>
              </div>

              {/* THE position instrument — totals row and lookup merged: the
                  current numbers are the inputs, totals live after the /.
                  Spec: docs/components/position-row.md */}
              <div className="mt-loose">
                <InlinePositionRow anime={anime} mapping={mapping} lookup={lookup} hasSource={hasSource} />
              </div>

              {/* Whole-story density + episode list (C1 hierarchy: the badge
                  legend lives with the strip it describes; the list header is
                  purely functional; the episode total lives in anime totals) */}
              <div className="mt-tight">
                {mapping ? (
                  <>
                    <MappingStrip
                      spans={mapping.spans}
                      airedEpisodes={mapping.airedEpisodes}
                      markerEpisode={lookup.markerUnit}
                      markerRest={lookup.markerRest}
                      mangaAheadUnits={mapping.mangaAheadUnits}
                      mangaAheadChapters={mapping.mangaAheadChapters}
                      onUnitClick={lookupEnabled ? lookup.stripClick : undefined}
                      viewband={viewband}
                      hiddenTypes={hiddenTypes}
                    />
                    {/* badge legend — below the strip, right-aligned (G4,
                        2026-08-19): graphic first, key tucked right. Badges
                        with no data don't render; each badge is a
                        click-to-hide filter toggle */}
                    <div className="mt-tight flex flex-wrap items-center justify-end gap-1.5">
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
                      <div className="mt-region">
                        <EpisodeList
                          rows={episodeList.rows}
                          sections={visibleSections}
                          selectedEp={selectedEp}
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
          </div>
        </CardContent>
      </Card>
  );
};
