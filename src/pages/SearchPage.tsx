import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { getAllAnime, searchAnime } from '@/data/mockAnime';
import { AnimeSeries } from '@/types/anime';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<AnimeSeries[]>(getAllAnime());
  const [statusFilter, setStatusFilter] = useState<'all' | 'airing' | 'completed'>('all');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    let filtered = query.trim() ? searchAnime(query) : getAllAnime();
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(anime => anime.status === statusFilter);
    }
    
    setResults(filtered);
  }, [statusFilter]);

  const handleStatusFilter = (status: 'all' | 'airing' | 'completed') => {
    setStatusFilter(status);
    let filtered = searchQuery.trim() ? searchAnime(searchQuery) : getAllAnime();
    
    if (status !== 'all') {
      filtered = filtered.filter(anime => anime.status === status);
    }
    
    setResults(filtered);
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      <Header />
      
      <main className="container py-8">
        {/* Search Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <SearchIcon className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{'>'}</span>
            <span className="text-syntax-cyan">search_anime</span>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="$ search --query 'title or genre'"
            className="mb-4"
          />

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Filter className="w-3.5 h-3.5" />
              <span>--filter</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('all')}
                className="font-mono text-xs border-dashed"
              >
                [ALL]
              </Button>
              <Button
                variant={statusFilter === 'airing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('airing')}
                className="font-mono text-xs border-dashed"
              >
                [AIRING]
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('completed')}
                className="font-mono text-xs border-dashed"
              >
                [COMPLETE]
              </Button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs border border-dashed px-2 py-1">
              <span className="text-syntax-cyan">results</span>
              <span className="text-muted-foreground">.length = </span>
              <span className="text-syntax-amber">{results.length}</span>
            </span>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed">
              <p className="text-muted-foreground text-sm">
                <span className="text-syntax-cyan">// </span>
                no anime found matching criteria
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-dashed mt-16">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          <p>
            <span className="text-syntax-cyan">{'{'}</span>
            <span className="text-primary">mangaMapper</span>
            <span className="text-syntax-cyan">{'}'}</span>
            <span className="mx-2">—</span>
            <span>// your guide from anime to manga</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SearchPage;
