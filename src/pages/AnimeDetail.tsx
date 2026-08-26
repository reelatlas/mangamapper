import { useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EpisodeType } from '@/types/anime';
import { Header } from '@/components/Header';
import { MangaMappingDisplay } from '@/components/MangaMappingDisplay';
import { TypeBadge } from '@/components/TypeBadge';
import { StatusChip } from '@/components/StatusChip';
import { CollectionSection } from '@/components/CollectionSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCatalogSeries, useCatalogMapping } from '@/hooks/useCatalog';
import { MappingStrip } from '@/components/MappingStrip';
import { motion } from 'motion/react';
import { Play, ArrowLeft, SkipForward } from 'lucide-react';
import { TvIcon as Tv, BookOpenIcon as BookOpen } from '@/components/icons';

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: anime, isLoading } = useCatalogSeries(id);
  const { data: mapping } = useCatalogMapping(id);
  const [showAll, setShowAll] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<EpisodeType>>(new Set(['canon', 'mixed', 'filler', 'anime-only-canon']));

  const toggleFilter = useCallback((type: EpisodeType) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <Header />
        <main className="container py-16">
          <div className="flex items-center gap-2 py-16 justify-center border border-dashed text-sm">
            <motion.span
              className="text-muted-foreground"
              initial={{ opacity: 0.35 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            >
              {'>'} fetch_series({id}) ...
            </motion.span>
          </div>
        </main>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <Header />
        <main className="container py-16 text-center">
          <div className="border border-dashed p-8 max-w-md mx-auto">
            <p className="text-destructive text-sm mb-4">
              <span className="text-syntax-cyan">error</span>
              <span className="text-muted-foreground">: </span>
              <span className="text-syntax-green">anime_not_found</span>
            </p>
            <Button asChild className="border-dashed text-xs">
              <Link to="/" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> back_to_home
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Full-run counts from the mapping summary; fall back to the loaded
  // episode sample while the mapping is in flight.
  const canonCount = mapping?.canonCount ?? anime.episodes.filter(ep => ep.type === 'canon').length;
  const mixedCount = mapping?.mixedCount ?? anime.episodes.filter(ep => ep.type === 'mixed').length;
  const fillerCount = mapping?.fillerCount ?? anime.episodes.filter(ep => ep.type === 'filler').length;
  const animeOnlyCount = mapping?.animeOnlyCount ?? anime.episodes.filter(ep => ep.type === 'anime-only-canon').length;

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      
      <main className="container py-8">
        {/* Hero section */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          {/* Cover image */}
          <div className="w-full lg:w-64 shrink-0">
            <Card className="border-dashed overflow-hidden">
              <div className="terminal-header">
                <span className="text-muted-foreground">cover</span>
              </div>
              <div className="relative aspect-3/4">
                <img
                  src={anime.coverImage}
                  alt={anime.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
                {/* StatusChip is THE airing-status render (drift fix
                    2026-08-21) — the wrapper pill only grounds it on art */}
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="border px-2 py-1 bg-background/80 rounded-full">
                    <StatusChip status={anime.status} />
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-4">
            <Card className="border-dashed flex-1 flex flex-col">
              <div className="terminal-header">
                <span className="text-muted-foreground">series_data</span>
              </div>
              <CardContent className="p-4 space-y-3 text-sm flex-1">
                <div>
                  <span className="text-syntax-cyan">title</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green text-lg">{anime.title}</span>
                </div>
                <div>
                  <span className="text-syntax-cyan">title_jp</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-syntax-green">{anime.japaneseTitle}</span>
                </div>
                <div>
                  <span className="text-syntax-cyan">genres</span>
                  <span className="text-muted-foreground">: </span>
                  {anime.genres.map((genre, i) => (
                    <span key={genre}>
                      <span className="text-syntax-amber">{genre.toLowerCase()}</span>
                      {i < anime.genres.length - 1 && <span className="text-muted-foreground">, </span>}
                    </span>
                  ))}
                </div>
                <div className="pt-2 border-t border-dashed">
                  <span className="text-syntax-cyan">synopsis</span>
                  <span className="text-muted-foreground">: </span>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    {anime.synopsis}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <Play className="w-4 h-4 mx-auto mb-1 text-syntax-amber" />
                  <div className="text-xl font-bold text-syntax-amber">{anime.currentEpisode}</div>
                  <div className="text-[10px] text-muted-foreground">episodes</div>
                </CardContent>
              </Card>
              {/* type-encoded stats wear the syntax_v1 TYPE tokens (drift
                  fix 2026-08-21 — accent/destructive/syntax-purple were the
                  pre-syntax_v1 colors; episode-type encodings use ONLY
                  --type-*) */}
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <BookOpen className="w-4 h-4 mx-auto mb-1 text-type-canon" />
                  <div className="text-xl font-bold text-type-canon">{canonCount}</div>
                  <div className="text-[10px] text-muted-foreground">canon</div>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <Tv className="w-4 h-4 mx-auto mb-1 text-type-anime" />
                  <div className="text-xl font-bold text-type-anime">{animeOnlyCount}</div>
                  <div className="text-[10px] text-muted-foreground">anime only</div>
                </CardContent>
              </Card>
              <Card className="border-dashed">
                <CardContent className="p-3 text-center">
                  <SkipForward className="w-4 h-4 mx-auto mb-1 text-type-filler" />
                  <div className="text-xl font-bold text-type-filler">{fillerCount}</div>
                  <div className="text-[10px] text-muted-foreground">filler</div>
                </CardContent>
              </Card>
            </div>

            {/* Full-run density strip */}
            {mapping && (
              <Card className="border-dashed">
                <div className="terminal-header flex items-center justify-between">
                  <span className="text-muted-foreground">episode_density</span>
                  {/* colon-tight key:value + type tokens (drift fix — the
                      ep_1 underscore style and pre-syntax_v1 hues retired) */}
                  <span className="text-muted-foreground tabular-nums">
                    ep:1-{mapping.airedEpisodes}
                    {mapping.hasSource && (
                      <> · <span className="text-type-filler">filler</span>:{mapping.fillerPercent}%</>
                    )}
                    {mapping.mangaAheadChapters != null && (
                      <> · <span className="text-type-manga">manga_only</span>:+{mapping.mangaAheadChapters}ch</>
                    )}
                  </span>
                </div>
                <CardContent className="p-4">
                  <MappingStrip
                    spans={mapping.spans}
                    airedEpisodes={mapping.airedEpisodes}
                    mangaAheadUnits={mapping.mangaAheadUnits}
                    mangaAheadChapters={mapping.mangaAheadChapters}
                    className="h-2.5"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Collection section */}
        <div className="mb-6">
          <CollectionSection anime={anime} />
        </div>

        {/* Episodes list */}
        <Card className="border-dashed">
          <div className="terminal-header">
            <span className="text-muted-foreground">episode_list</span>
          </div>
          <div className="px-4 pt-3 pb-0 flex items-end justify-between flex-wrap gap-2">
            <div
              className="group cursor-pointer flex items-center gap-1 text-xs text-muted-foreground"
              onClick={() => setShowAll(!showAll)}
            >
              <span className="text-syntax-cyan">{'//'}</span>
              {' '}show {'>'} {showAll ? anime.currentEpisode : anime.episodes.length} of {anime.currentEpisode}
              <span className="opacity-0 group-hover:opacity-100 ml-2 text-syntax-cyan transition-opacity">
                {'>'} {showAll ? 'show_episodes(less)' : 'show_episodes(all)'}
              </span>
            </div>
            {/* legend = TypeBadges with counts inside, click-to-hide (the
                card's legend grammar; EpisodeBadge + "= explainer" text
                retired 2026-08-21). A badge with no data doesn't render. */}
            <div className="flex flex-wrap items-center gap-2">
              {canonCount > 0 && (
                <TypeBadge
                  type="canon"
                  count={canonCount}
                  onClick={() => toggleFilter('canon')}
                  pressed={activeFilters.has('canon')}
                  dimmed={!activeFilters.has('canon')}
                />
              )}
              {mixedCount > 0 && (
                <TypeBadge
                  type="mixed"
                  count={mixedCount}
                  onClick={() => toggleFilter('mixed')}
                  pressed={activeFilters.has('mixed')}
                  dimmed={!activeFilters.has('mixed')}
                />
              )}
              {fillerCount > 0 && (
                <TypeBadge
                  type="filler"
                  count={fillerCount}
                  onClick={() => toggleFilter('filler')}
                  pressed={activeFilters.has('filler')}
                  dimmed={!activeFilters.has('filler')}
                />
              )}
              {animeOnlyCount > 0 && (
                <TypeBadge
                  type="anime_only"
                  count={animeOnlyCount}
                  onClick={() => toggleFilter('anime-only-canon')}
                  pressed={activeFilters.has('anime-only-canon')}
                  dimmed={!activeFilters.has('anime-only-canon')}
                />
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <ScrollArea className={showAll ? 'max-h-[500px]' : ''}>
              <div className="space-y-2">
                {showAll
                  ? Array.from({ length: anime.currentEpisode }, (_, i) => {
                      const epNum = i + 1;
                      const episode = anime.episodes.find(ep => ep.number === epNum);
                      if (episode) {
                        if (!activeFilters.has(episode.type)) return null;
                        return (
                          <MangaMappingDisplay
                            key={episode.number}
                            episode={episode}
                            showEpisodeNumber={true}
                          />
                        );
                      }
                      return (
                        <div
                          key={epNum}
                          className="flex items-center gap-3 p-2.5 bg-muted/30 border border-dashed font-mono text-sm rounded-lg text-muted-foreground"
                        >
                          <span className="text-syntax-amber shrink-0">#{epNum}</span>
                          <span className="text-xs">// data_pending</span>
                        </div>
                      );
                    })
                  : anime.episodes
                      .filter(ep => activeFilters.has(ep.type))
                      .map((episode) => (
                        <MangaMappingDisplay
                          key={episode.number}
                          episode={episode}
                          showEpisodeNumber={true}
                        />
                      ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-foreground/40">mangaMapper</span>{' '}
            <span>// your journey continues</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AnimeDetail;
