import { Episode } from '@/types/anime';
import { EpisodeBadge } from './EpisodeBadge';

interface MangaMappingDisplayProps {
  episode: Episode;
  showEpisodeNumber?: boolean;
}

export const MangaMappingDisplay = ({ episode, showEpisodeNumber = true }: MangaMappingDisplayProps) => {
  return (
    <div className="flex items-center justify-between gap-4 p-2.5 bg-muted/30 border border-dashed font-mono text-sm">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {showEpisodeNumber && (
          <span className="text-syntax-amber shrink-0">
            #{String(episode.number).padStart(4, '0')}
          </span>
        )}
        <span className="truncate text-muted-foreground text-xs">
          {episode.title}
        </span>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <EpisodeBadge type={episode.type} />
        
        {episode.mangaMapping ? (
          <span className="text-xs">
            <span className="text-syntax-cyan">vol</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-syntax-amber">{episode.mangaMapping.volume}</span>
            <span className="text-muted-foreground"> · </span>
            <span className="text-syntax-cyan">ch</span>
            <span className="text-muted-foreground">:</span>
            <span className="text-syntax-amber">{episode.mangaMapping.chapters}</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {episode.type === 'filler' ? '// no_source' : '// anime_original'}
          </span>
        )}
      </div>
    </div>
  );
};
