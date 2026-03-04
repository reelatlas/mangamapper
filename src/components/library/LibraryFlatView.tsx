import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArrowUpDown, BookOpen, Tv, Trash2, ExternalLink, Link2, X, Check, BookDashed, BookOpenText } from 'lucide-react';
import { getAnimeById } from '@/data/mockAnime';
import type { SortOption, AnimeProgress, ReaderSite } from '@/types/library';
import { getReadersForAnime } from '@/types/library';
import { ViewModeToggle, type ViewMode } from './ViewModeToggle';

interface LibraryFlatViewProps {
  progress: AnimeProgress[];
  readerSites: ReaderSite[];
  removeFromLibrary: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const LibraryFlatView = ({ progress, readerSites, removeFromLibrary, viewMode, onViewModeChange }: LibraryFlatViewProps) => {
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [progressSort, setProgressSort] = useState<SortOption>(() => {
    const saved = localStorage.getItem('mangamapper-library-progress-sort');
    return (['alpha-asc', 'alpha-desc', 'date-desc', 'date-asc'].includes(saved || '')) ? saved as SortOption : 'date-desc';
  });

  useEffect(() => {
    localStorage.setItem('mangamapper-library-progress-sort', progressSort);
  }, [progressSort]);

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

  if (progress.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        </div>
        <div className="text-center py-16 border border-dashed">
          <div className="group cursor-default mx-auto mb-3 w-fit">
            <BookDashed className="w-8 h-8 text-muted-foreground group-hover:hidden" />
            <BookOpenText className="w-8 h-8 text-muted-foreground hidden group-hover:block" />
          </div>
          <p className="text-muted-foreground text-sm">
            <span className="text-muted-foreground">// </span>library_empty
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            <Link to="/" className="hover:text-accent transition-colors">
              {'>'} explore_anime
            </Link>
            {' '}to add to your library
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        <ToggleGroup type="single" value={progressSort} onValueChange={(val) => val && setProgressSort(val as SortOption)} className="gap-1">
          <ToggleGroupItem value="date-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">last_updated</ToggleGroupItem>
          <ToggleGroupItem value="date-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">first_updated</ToggleGroupItem>
        </ToggleGroup>
        <div className="w-px h-5 bg-border mx-1" />
        <ToggleGroup type="single" value={progressSort} onValueChange={(val) => val && setProgressSort(val as SortOption)} className="gap-1">
          <ToggleGroupItem value="alpha-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">a→z</ToggleGroupItem>
          <ToggleGroupItem value="alpha-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">z→a</ToggleGroupItem>
        </ToggleGroup>
        <div className="w-px h-5 bg-border mx-1" />
        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      </div>

      <div className="grid gap-3 overflow-hidden">
        {sortedProgress.map((item) => {
          const anime = getAnimeById(item.anime_id);
          if (!anime) return null;

          return (
            <Link key={item.id} to={`/anime/${anime.id}`} className="block overflow-hidden">
              <Card className="border-dashed hover:border-primary/50 transition-colors cursor-pointer overflow-hidden">
                <CardContent className="p-4 overflow-hidden">
                  <div className="flex items-stretch gap-4">
                    <img src={anime.coverImage} alt={anime.title} className="w-14 min-h-[5rem] object-cover opacity-90 shrink-0" />
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <span className="text-sm text-syntax-green line-clamp-2">{anime.title}</span>
                      <div className="flex flex-col gap-1.5 mt-2 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Tv className={`w-3.5 h-3.5 shrink-0 ${item.last_watched_episode != null ? "text-primary" : "text-muted-foreground"}`} />
                          <span>
                            <span className="text-muted-foreground">ep:</span>
                            <span className={item.last_watched_episode != null ? "text-foreground" : "text-muted-foreground"}>{item.last_watched_episode ?? '—'}</span>
                          </span>
                        </div>
                        {anime.hasManga ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <BookOpen className={`w-3.5 h-3.5 shrink-0 ${(item.last_read_volume != null || item.last_read_chapter != null) ? "text-primary" : "text-muted-foreground"}`} />
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
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <BookOpen className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                              <span className="text-muted-foreground">anime_original; no_manga</span>
                            </div>
                            <div className="min-h-5" />
                          </>
                        )}
                        {anime.hasManga && (
                          <>
                            {getReadersForAnime(item.anime_id, readerSites).length > 0 ? (
                              <div className="flex items-center gap-1.5 min-h-5 flex-wrap">
                                <Link2 className="w-3.5 h-3.5 shrink-0 text-primary" />
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
                              <div className="flex items-center gap-1.5 text-muted-foreground min-h-5 flex-wrap">
                                <Link2 className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
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
                          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromLibrary(item.id); setConfirmingDeleteId(null); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingDeleteId(null); }} className="text-muted-foreground hover:text-muted-foreground hover:bg-muted">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setConfirmingDeleteId(item.id); }} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
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
    </div>
  );
};
