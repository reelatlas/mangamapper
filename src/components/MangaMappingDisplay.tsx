import { Episode } from '@/types/anime';
import { EpisodeBadge } from './EpisodeBadge';
import { BookOpen, Hash } from 'lucide-react';

interface MangaMappingDisplayProps {
  episode: Episode;
  showEpisodeNumber?: boolean;
}

export const MangaMappingDisplay = ({ episode, showEpisodeNumber = true }: MangaMappingDisplayProps) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50 border border-border/50">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showEpisodeNumber && (
          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
            <Hash className="w-4 h-4" />
            <span className="font-mono font-semibold text-foreground">{episode.number}</span>
          </div>
        )}
        <div className="truncate text-sm text-muted-foreground">
          {episode.title}
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <EpisodeBadge type={episode.type} />
        
        {episode.mangaMapping ? (
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="font-medium">
              Vol. {episode.mangaMapping.volume}, Ch. {episode.mangaMapping.chapters}
            </span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground italic">
            {episode.type === 'filler' ? 'No manga source' : 'Anime original story'}
          </span>
        )}
      </div>
    </div>
  );
};
