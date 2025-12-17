import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { AnimeCard } from '@/components/AnimeCard';
import { getAllAnime, searchAnime } from '@/data/mockAnime';
import { AnimeSeries } from '@/types/anime';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Search Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <SearchIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Search all anime</h1>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search by title, Japanese name, or genre..."
            className="mb-4"
          />

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="w-4 h-4" />
              <span>Filter:</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'airing' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('airing')}
              >
                Airing
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusFilter('completed')}
              >
                Completed
              </Button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary" className="text-sm">
              {results.length} anime found
            </Badge>
          </div>

          {results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No anime found matching your criteria
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

export default SearchPage;
