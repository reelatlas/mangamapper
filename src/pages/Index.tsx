import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { getTopAiringAnime, searchAnime } from '@/data/mockAnime';
import { AnimeSeries } from '@/types/anime';
import { TrendingUp, Sparkles } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSeries[]>([]);

  const topAnime = getTopAiringAnime(10);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Hero Section */}
        <section className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Track anime to manga chapters
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Find Your Manga Chapter
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

        {/* Results Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">
              {isSearching 
                ? `Search Results ${searchResults.length > 0 ? `(${searchResults.length})` : ''}`
                : 'Top 10 Airing on Crunchyroll'
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
                  : 'No anime available'
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
