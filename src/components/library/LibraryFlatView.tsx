import { useMemo } from 'react';
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
  userId: string;
  onSave: () => void;
  onNewSeries: () => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const LibraryFlatView = ({ progress, readerSites, removeFromLibrary, viewMode, onViewModeChange, userId, onSave, onNewSeries, sortOption: progressSort, onSortChange: setProgressSort }: LibraryFlatViewProps) => {

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
          <div className="w-px h-5 bg-border mx-1" />
        </div>
        <div className="text-center py-16 border border-dashed">
          <div className="flex items-center justify-center mb-3">
            <div
              className="cursor-default"
              onMouseEnter={() => { document.getElementById('book-closed')?.classList.add('hidden'); document.getElementById('book-open')?.classList.remove('hidden'); }}
              onMouseLeave={() => { document.getElementById('book-closed')?.classList.remove('hidden'); document.getElementById('book-open')?.classList.add('hidden'); }}
            >
              <BookDashed className="w-6 h-6 text-muted-foreground" id="book-closed" />
              <BookOpenText className="w-6 h-6 text-muted-foreground hidden" id="book-open" />
            </div>
          </div>
          <div
            className="group/lib cursor-pointer"
            onClick={onNewSeries}
            onMouseEnter={() => { document.getElementById('book-closed')?.classList.add('hidden'); document.getElementById('book-open')?.classList.remove('hidden'); }}
            onMouseLeave={() => { document.getElementById('book-closed')?.classList.remove('hidden'); document.getElementById('book-open')?.classList.add('hidden'); }}
          >
            <p className="text-muted-foreground text-sm">
              <span>// library(empty)</span>
              <span className="hidden group-hover/lib:inline text-primary ml-2">{'>'} new_series</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ViewModeToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        <div className="w-px h-5 bg-border mx-1" />
        <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        <ToggleGroup type="single" value={progressSort} onValueChange={(val) => val && setProgressSort(val as SortOption)} className="gap-1">
          <ToggleGroupItem value="date-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">last_updated</ToggleGroupItem>
          <ToggleGroupItem value="date-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">first_updated</ToggleGroupItem>
          <ToggleGroupItem value="alpha-asc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">a→z</ToggleGroupItem>
          <ToggleGroupItem value="alpha-desc" className="text-xs font-mono px-2.5 h-7 border-dashed text-muted-foreground data-[state=on]:bg-muted data-[state=on]:text-foreground">z→a</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid gap-3 overflow-hidden">
        {sortedProgress.map((item) => (
          <SeriesCard
            key={item.id}
            item={item}
            readerSites={readerSites}
            onRemove={removeFromLibrary}
            userId={userId}
            onSave={onSave}
          />
        ))}
      </div>
    </div>
  );
};
