import { useState, useCallback, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { getFilteredAnime, searchAnime, StatusFilter } from '@/data/mockAnime';
import { AnimeSeries } from '@/types/anime';
import { TrendingUp, Filter, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSeries[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('airing');
  const [resultLimit, setResultLimit] = useState<number>(10);

  const filteredAnime = useMemo(
    () => getFilteredAnime({ status: statusFilter, limit: resultLimit, sortBy: 'popularity' }),
    [statusFilter, resultLimit]
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
  const displayedAnime = isSearching ? searchResults : filteredAnime;

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      
      <main className="container py-8">
        {/* Page header */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Home className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">home</span>
        </div>

        {/* Search section */}
        <section className="mb-10">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="$ search --title 'anime name'"
            className="max-w-xl"
          />
        </section>

        {/* Filters */}
        {!isSearching && (
          <section className="mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* Status filter */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Filter className="w-3.5 h-3.5" />
                  <span>--status</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusFilter('airing')}
                    className={`font-mono text-xs border-dashed ${statusFilter === 'airing' ? 'bg-secondary text-foreground hover:bg-secondary hover:text-foreground' : 'hover:bg-muted hover:text-foreground'}`}
                  >
                    airing
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStatusFilter('completed')}
                    className={`font-mono text-xs border-dashed ${statusFilter === 'completed' ? 'bg-secondary text-foreground hover:bg-secondary hover:text-foreground' : 'hover:bg-muted hover:text-foreground'}`}
                  >
                    complete
                  </Button>
                </div>
              </div>

              {/* Limit filter */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">--top</span>
                <div className="flex gap-2">
                  {[10, 50, 100].map((limit) => (
                    <Button
                      key={limit}
                      variant="outline"
                      size="sm"
                      onClick={() => setResultLimit(limit)}
                      className={`font-mono text-xs border-dashed ${resultLimit === limit ? 'bg-secondary text-foreground hover:bg-secondary hover:text-foreground' : 'hover:bg-muted hover:text-foreground'}`}
                    >
                      {limit}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
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
                : <><span className="text-syntax-cyan">top</span> <span className="text-syntax-amber">{resultLimit}</span> {statusFilter === 'airing' ? <span className="text-accent">airing</span> : <span className="text-muted-foreground">completed</span>}</>
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
                  : 'no anime found'
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
            <span className="text-foreground/40">mangaMapper</span>{' '}
            <span>// anime-to-manga</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
