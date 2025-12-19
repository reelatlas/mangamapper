import { useState, useCallback, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { getFilteredAnime, searchAnime, StatusFilter } from '@/data/mockAnime';
import { AnimeSeries } from '@/types/anime';
import { TrendingUp, Filter, Home } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AnimeSeries[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(() => {
    const saved = localStorage.getItem('mangamapper-home-status');
    return (saved === 'airing' || saved === 'completed') ? saved : 'airing';
  });
  const [resultLimit, setResultLimit] = useState<number>(() => {
    const saved = localStorage.getItem('mangamapper-home-limit');
    const parsed = saved ? parseInt(saved) : NaN;
    return [10, 50, 100].includes(parsed) ? parsed : 10;
  });

  // Persist filter preferences to localStorage
  useEffect(() => {
    localStorage.setItem('mangamapper-home-status', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('mangamapper-home-limit', resultLimit.toString());
  }, [resultLimit]);

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
            placeholder="search anime title..."
            className="max-w-xl"
          />
        </section>

        {/* Filters */}
        {!isSearching && (
          <section className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              
              {/* Status filter group */}
              <ToggleGroup 
                type="single" 
                value={statusFilter} 
                onValueChange={(val) => val && setStatusFilter(val as StatusFilter)}
                className="gap-1"
              >
                <ToggleGroupItem value="airing" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">airing</ToggleGroupItem>
                <ToggleGroupItem value="completed" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">complete</ToggleGroupItem>
              </ToggleGroup>
              
              {/* Separator between groups */}
              <div className="w-px h-5 bg-border mx-1" />
              
              {/* Limit filter group */}
              <ToggleGroup 
                type="single" 
                value={resultLimit.toString()} 
                onValueChange={(val) => val && setResultLimit(parseInt(val))}
                className="gap-1"
              >
                <ToggleGroupItem value="10" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">10</ToggleGroupItem>
                <ToggleGroupItem value="50" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">50</ToggleGroupItem>
                <ToggleGroupItem value="100" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">100</ToggleGroupItem>
              </ToggleGroup>
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
            <span>// find your next chapter</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
