import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useLibraryData } from '@/hooks/useLibraryData';
import { getAnimeById } from '@/data/mockAnime';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Library as LibraryIcon, BookOpen, Tv, Trash2, ExternalLink, Link2, ArrowUpDown, X, Check, BookDashed } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { SortOption } from '@/types/library';
import { getReadersForAnime } from '@/types/library';

const Library = () => {
  const navigate = useNavigate();
  const { user, authLoading, loading, progress, readerSites, removeFromLibrary } = useLibraryData();
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const [progressSort, setProgressSort] = useState<SortOption>(() => {
    const saved = localStorage.getItem('mangamapper-library-progress-sort');
    return (['alpha-asc', 'alpha-desc', 'date-desc', 'date-asc'].includes(saved || '')) ? saved as SortOption : 'date-desc';
  });

  useEffect(() => {
    localStorage.setItem('mangamapper-library-progress-sort', progressSort);
  }, [progressSort]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const sortedProgress = useMemo(() => {
    const sorted = [...progress];
    switch (progressSort) {
      case 'alpha-asc':
        return sorted.sort((a, b) => {
          const titleA = getAnimeById(a.anime_id)?.title || '';
          const titleB = getAnimeById(b.anime_id)?.title || '';
          return titleA.localeCompare(titleB);
        });
      case 'alpha-desc':
        return sorted.sort((a, b) => {
          const titleA = getAnimeById(a.anime_id)?.title || '';
          const titleB = getAnimeById(b.anime_id)?.title || '';
          return titleB.localeCompare(titleA);
        });
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
      case 'date-desc':
      default:
        return sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
  }, [progress, progressSort]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background font-mono">
        <Header />
        <main className="container py-8">
          <div className="flex items-center justify-center py-16">
            <p className="text-muted-foreground text-sm">...loading</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-mono overflow-x-hidden">
      <Header />
      
      <main className="container py-8 overflow-hidden">
        <div className="flex items-center gap-2 mb-6 text-sm">
          <LibraryIcon className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">{'>'}</span>
          <span className="text-syntax-cyan">my_library</span>
        </div>

        <div className="space-y-4">
          {progress.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              
              <ToggleGroup 
                type="single" 
                value={progressSort} 
                onValueChange={(val) => val && setProgressSort(val as SortOption)}
                className="gap-1"
              >
                <ToggleGroupItem value="date-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">last_updated</ToggleGroupItem>
                <ToggleGroupItem value="date-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">first_updated</ToggleGroupItem>
              </ToggleGroup>
              
              <div className="w-px h-5 bg-border mx-1" />
              
              <ToggleGroup 
                type="single" 
                value={progressSort} 
                onValueChange={(val) => val && setProgressSort(val as SortOption)}
                className="gap-1"
              >
                <ToggleGroupItem value="alpha-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">a→z</ToggleGroupItem>
                <ToggleGroupItem value="alpha-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">z→a</ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
          
          {progress.length > 0 ? (
            <div className="grid gap-3 overflow-hidden">
              {sortedProgress.map((item) => {
                const anime = getAnimeById(item.anime_id);
                if (!anime) return null;
                
                return (
                  <Link key={item.id} to={`/anime/${anime.id}`} className="block overflow-hidden">
                    <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
                      <CardContent className="p-4 overflow-hidden">
                        <div className="flex items-stretch gap-4">
                          <img
                            src={anime.coverImage}
                            alt={anime.title}
                            className="w-14 min-h-[5rem] object-cover opacity-90 shrink-0"
                          />
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <span className="text-sm text-syntax-green truncate block">
                              {anime.title}
                            </span>
                            <div className="flex flex-col gap-1.5 mt-2 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Tv className={`w-3.5 h-3.5 ${item.last_watched_episode != null ? "text-primary" : "text-muted-foreground"}`} />
                                <span>
                                  <span className="text-muted-foreground">ep:</span>
                                  <span className={item.last_watched_episode != null ? "text-foreground" : "text-muted-foreground"}>{item.last_watched_episode ?? '—'}</span>
                                </span>
                              </div>
                              
                              {anime.hasManga ? (
                                <div className="flex items-center gap-1.5">
                                  <BookOpen className={`w-3.5 h-3.5 ${(item.last_read_volume != null || item.last_read_chapter != null) ? "text-primary" : "text-muted-foreground"}`} />
                                  <span>
                                    <span className="text-muted-foreground">vol:</span>
                                    <span className={item.last_read_volume != null ? "text-foreground" : "text-muted-foreground"}>{item.last_read_volume ?? '—'}</span>
                                  </span>
                                  <span className="text-muted-foreground">·</span>
                                  <span>
                                    <span className="text-muted-foreground">ch:</span>
                                    <span className={item.last_read_chapter != null ? "text-foreground" : "text-muted-foreground"}>{item.last_read_chapter ?? '—'}</span>
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="text-muted-foreground">anime_original; no_manga</span>
                                  </div>
                                  {/* Placeholder row to match manga cards with reader link row */}
                                  <div className="min-h-5" />
                                </>
                              )}
                              
                              {anime.hasManga && (
                                <>
                                  {getReadersForAnime(item.anime_id, readerSites).length > 0 ? (
                                    <div className="flex items-center gap-1.5 min-h-5 flex-wrap">
                                      <Link2 className="w-3.5 h-3.5 text-primary" />
                                      {getReadersForAnime(item.anime_id, readerSites).map((reader) => (
                                        <Button
                                          key={reader.id}
                                          variant="outline"
                                          size="sm"
                                          className="h-5 px-1.5 text-[10px] font-mono border-dashed gap-1 max-w-full"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            window.open(reader.series_url!, '_blank');
                                          }}
                                        >
                                          <span className="truncate">{reader.name}</span>
                                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                        </Button>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5 text-muted-foreground min-h-5">
                                      <Link2 className="w-3.5 h-3.5 text-muted-foreground" />
                                      <span>no_reader_link</span>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start">
                          {confirmingDeleteId === item.id ? (
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  removeFromLibrary(item.id);
                                  setConfirmingDeleteId(null);
                                }}
                                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setConfirmingDeleteId(null);
                                }}
                                className="text-muted-foreground hover:text-muted-foreground hover:bg-muted"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setConfirmingDeleteId(item.id);
                              }}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed">
              <BookDashed className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                <span className="text-muted-foreground">// </span>library_empty
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                <Link 
                  to="/"
                  className="hover:text-accent transition-colors"
                >
                  {'>'} explore_anime
                </Link>
                {' '}to add to your library
              </p>
            </div>
          )}
        </div>
      </main>

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

export default Library;
