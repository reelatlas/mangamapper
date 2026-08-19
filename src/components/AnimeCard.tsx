import { AnimeSeries } from '@/types/anime';
import { Card, CardContent } from '@/components/ui/card';
import { TvIcon as Tv, BookOpenIcon as BookOpen } from '@/components/icons';
import { useCatalogMapping } from '@/hooks/useCatalog';
import { usePositionLookup } from '@/hooks/usePositionLookup';
import { MappingStrip } from './MappingStrip';
import { PositionLabel } from './PositionLabel';
import { MapLookup } from './MapLookup';

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

  // newest episode WITH a mapping — a series can end on filler (e.g. Naruto)
  const latestMapping = anime.episodes.find((e) => e.mangaMapping)?.mangaMapping ?? null;
  const hasSource = mapping ? mapping.sourceType !== 'original' : anime.hasManga;
  const lookupEnabled = hasSource && !!mapping?.latestKnown;

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
            <div className="flex-1 p-4 flex flex-col gap-3.5 font-mono min-w-0">
              {/* Title block */}
              <div className="min-w-0">
                <div className="text-base font-semibold text-syntax-green leading-tight break-words">
                  {anime.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 break-words">
                  {anime.japaneseTitle}
                </div>
              </div>

              {/* Positions: labeled columns */}
              <div className="flex flex-wrap gap-x-10 gap-y-2 text-sm tabular-nums">
                <div>
                  <PositionLabel icon={Tv} label="anime" iconActive className="mb-0.5" />
                  <span>
                    <span className="text-muted-foreground">ep:</span>
                    <span className="text-foreground">{anime.currentEpisode}</span>
                    <span className="text-muted-foreground">/{anime.totalEpisodes ?? '—'}</span>
                  </span>
                </div>
                <div>
                  <PositionLabel icon={BookOpen} label="manga" iconActive={hasSource} className="mb-0.5" />
                  {hasSource && latestMapping ? (
                    <span>
                      <span className="text-muted-foreground">vol:</span>
                      <span className="text-foreground">{latestMapping.volume}</span>
                      <span className="text-muted-foreground">/{anime.totalVolumes ?? '—'}</span>
                      <span className="text-muted-foreground"> · </span>
                      <span className="text-muted-foreground">ch:</span>
                      <span className="text-foreground">{latestMapping.chapters}</span>
                      <span className="text-muted-foreground">/{anime.totalChapters ?? '—'}</span>
                    </span>
                  ) : hasSource ? (
                    <span className="text-muted-foreground">// mapping_pending</span>
                  ) : (
                    <span className="text-syntax-purple">// no_source (anime_original)</span>
                  )}
                </div>
              </div>

              {/* anime ↔ manga lookup (spec: docs/components/map-lookup.md) */}
              {lookupEnabled && <MapLookup lookup={lookup} seriesTitle={anime.title} />}

              {/* Whole-story density */}
              <div className="mt-auto pt-1 space-y-1.5">
                {mapping ? (
                  <>
                    <MappingStrip
                      spans={mapping.spans}
                      airedEpisodes={mapping.airedEpisodes}
                      markerEpisode={lookup.markerUnit}
                      mangaAheadUnits={mapping.mangaAheadUnits}
                      mangaAheadChapters={mapping.mangaAheadChapters}
                      onUnitClick={lookupEnabled ? lookup.stripClick : undefined}
                    />
                    <p className="text-[10px] tracking-wider text-muted-foreground">
                      {mapping.sourceType === 'original' ? (
                        <>
                          <span className="text-syntax-purple">anime_only</span>:{mapping.animeOnlyCount}
                        </>
                      ) : (
                        <>
                          <span className="text-accent">canon</span>:{mapping.canonCount}
                          {mapping.mixedCount > 0 && (
                            <>
                              {' · '}
                              <span className="text-syntax-amber">mixed</span>:{mapping.mixedCount}
                            </>
                          )}
                          {' · '}
                          <span className="text-destructive">filler</span>:{mapping.fillerCount}{' '}
                          ({mapping.fillerPercent}%)
                          {mapping.mangaAheadChapters != null && (
                            <>
                              {' · '}
                              <span className="text-accent/50">manga_only</span>:+{mapping.mangaAheadChapters}ch
                            </>
                          )}
                        </>
                      )}
                    </p>
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
