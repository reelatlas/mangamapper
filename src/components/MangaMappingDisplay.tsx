import { Episode, EpisodeType } from '@/types/anime';
import { TypeBadge, type TypeBadgeKind } from './TypeBadge';

// Episode→chapter row (detail page). Re-skinned onto the card grammar
// (2026-08-21, EpisodeBadge retirement): TypeBadge is the type token,
// `#1` never `#0001`, vol/ch as muted-key + foreground-value, and `—` is
// the universal null for a missing source position (filler / off-source) —
// `// comments` are reserved for system messages.

const KIND: Record<EpisodeType, TypeBadgeKind> = {
  canon: 'canon',
  mixed: 'mixed',
  filler: 'filler',
};

interface MangaMappingDisplayProps {
  episode: Episode;
  showEpisodeNumber?: boolean;
}

export const MangaMappingDisplay = ({ episode, showEpisodeNumber = true }: MangaMappingDisplayProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-muted/30 border border-dashed font-mono text-sm rounded-lg">
      <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 min-w-0">
        {showEpisodeNumber && (
          <span className="text-syntax-amber shrink-0">#{episode.number}</span>
        )}
        <span className="truncate text-muted-foreground text-xs">
          {episode.title}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <TypeBadge type={KIND[episode.type]} />

        {episode.mangaMapping ? (
          <span className="text-xs tabular-nums">
            {episode.mangaMapping.volume !== null && (
              <>
                <span className="text-muted-foreground">vol:</span>
                {episode.mangaMapping.volume}
                <span className="text-muted-foreground"> · </span>
              </>
            )}
            <span className="text-muted-foreground">ch:</span>
            {episode.mangaMapping.chapters}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60">—</span>
        )}
      </div>
    </div>
  );
};
