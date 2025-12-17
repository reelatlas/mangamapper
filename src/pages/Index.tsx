import { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { SourceFilter } from '@/components/SourceFilter';
import { getTopAiringAnime, searchAnime } from '@/data/mockAnime';
import { AnimeSeries, TrackingSite, StreamingService, TRACKING_SITES, STREAMING_SERVICES } from '@/types/anime';
import { TrendingUp, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero section */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Track anime to manga chapters
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Find your manga chapter
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover which manga volume and chapter corresponds to each anime episode.
            Never miss where to continue reading.
          </p>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by anime title, Japanese name, or genre..."
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
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {isSearching 
                ? `Search results ${searchResults.length > 0 ? `(${searchResults.length})` : ''}`
                : streamingService === 'all' 
                  ? `Top 10 currently airing (${trackingSiteLabel})`
                  : `Top 10 currently airing on ${streamingServiceLabel} (${trackingSiteLabel})`
              }
            </h2>
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
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                {isSearching 
                  ? `No anime found matching "${searchQuery}"`
                  : `No anime available on ${streamingServiceLabel}`
                }
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          <p>MangaMapper — Your guide from anime to manga</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
