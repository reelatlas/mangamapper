import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ArrowUpDown, BookDashed, BookOpenText } from 'lucide-react';
import { getAnimeById } from '@/data/mockAnime';
import type { SortOption, AnimeProgress, ReaderSite } from '@/types/library';
import { ViewModeToggle, type ViewMode } from './ViewModeToggle';
import { SeriesCard } from './SeriesCard';

interface LibraryFlatViewProps {
  progress: AnimeProgress[];
  readerSites: ReaderSite[];
  removeFromLibrary: (id: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const LibraryFlatView = ({ progress, readerSites, removeFromLibrary, viewMode, onViewModeChange }: LibraryFlatViewProps) => {
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
          <div className="ml-auto">
            <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          </div>
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
        <div className="ml-auto">
          <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        </div>
      </div>

      <div className="grid gap-3 overflow-hidden">
        {sortedProgress.map((item) => (
          <SeriesCard
            key={item.id}
            item={item}
            readerSites={readerSites}
            onRemove={removeFromLibrary}
          />
        ))}
      </div>
    </div>
  );
};
