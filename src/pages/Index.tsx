import { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { SourceFilter } from '@/components/SourceFilter';
import { getTopAiringAnime, searchAnime } from '@/data/mockAnime';
import { AnimeSeries, TrackingSite, StreamingService, TRACKING_SITES, STREAMING_SERVICES } from '@/types/anime';
import { Terminal, TrendingUp } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSeries[]>([]);
  const [trackingSite, setTrackingSite] = useState<TrackingSite>('mal');
  const [streamingService, setStreamingService] = useState<StreamingService>('all');

  const topAnime = useMemo(
    () => getTopAiringAnime(10, trackingSite, streamingService),
    [trackingSite, streamingService]
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSearchResults(searchAnime(query));
    } else {
      setSearchResults([]);
    }
  }, []);

  const isSearching = searchQuery.trim().length > 0;
  const displayedAnime = isSearching ? searchResults : topAnime;

  const trackingSiteLabel = TRACKING_SITES.find(s => s.value === trackingSite)?.label;
  const streamingServiceLabel = STREAMING_SERVICES.find(s => s.value === streamingService)?.label;

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      
      <main className="container py-8">
        {/* Hero section */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-dashed text-primary text-xs mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>{'>'} anime_to_manga_mapper</span>
          </div>
          
          <div className="mb-4">
            <pre className="text-2xl sm:text-3xl font-bold text-foreground inline-block">
              <span className="text-primary">find</span>
              <span className="text-muted-foreground">:</span>
              <span className="text-syntax-green"> manga_chapter</span>
            </pre>
          </div>
          
          <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-8">
            <span className="text-syntax-cyan">// </span>
            discover which manga volume and chapter corresponds to each anime episode
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="$ search --title 'anime name'"
            className="max-w-xl mx-auto"
          />
        </section>

        {/* Source filters */}
        {!isSearching && (
          <section className="mb-6">
            <SourceFilter
              trackingSite={trackingSite}
              streamingService={streamingService}
              onTrackingSiteChange={setTrackingSite}
              onStreamingServiceChange={setStreamingService}
            />
          </section>
        )}

        {/* Results section */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-sm">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{'>'}</span>
            <span>
              {isSearching 
                ? <><span className="text-syntax-cyan">search_results</span><span className="text-muted-foreground">.length</span> = <span className="text-syntax-amber">{searchResults.length}</span></>
                : streamingService === 'all' 
                  ? <><span className="text-syntax-cyan">top_airing</span><span className="text-muted-foreground"> · </span><span className="text-syntax-amber">{trackingSiteLabel}</span></>
                  : <><span className="text-syntax-cyan">top_airing</span><span className="text-muted-foreground"> · </span><span className="text-syntax-amber">{streamingServiceLabel}</span><span className="text-muted-foreground"> · </span><span className="text-syntax-amber">{trackingSiteLabel}</span></>
              }
            </span>
          </div>

          {displayedAnime.length > 0 ? (
            <div className="grid gap-4">
              {displayedAnime.map((anime, index) => (
                <AnimeCard 
                  key={anime.id} 
                  anime={anime} 
                  rank={!isSearching ? index + 1 : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed">
              <p className="text-muted-foreground text-sm">
                <span className="text-syntax-cyan">// </span>
                {isSearching 
                  ? `no results matching "${searchQuery}"`
                  : `no anime available on ${streamingServiceLabel}`
                }
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-primary">mangaMapper</span>
            <span className="mx-2">—</span>
            <span>// your guide from anime to manga</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
