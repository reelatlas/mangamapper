import { AnimeSeries } from '@/types/anime';
import { Card, CardContent } from '@/components/ui/card';
import { MangaMappingDisplay } from './MangaMappingDisplay';
import { Badge } from '@/components/ui/badge';
import { Play, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnimeCardProps {
  anime: AnimeSeries;
  rank?: number;
}

export const AnimeCard = ({ anime, rank }: AnimeCardProps) => {
  const currentEpisode = anime.episodes[0]; // Most recent episode

  return (
    <Link to={`/anime/${anime.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 cursor-pointer">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            {/* Cover Image */}
            <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
              {rank && (
                <div className="absolute top-2 left-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md">
                  {rank}
                </div>
              )}
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent sm:bg-gradient-to-r" />
            </div>

            {/* Content */}
            <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                    {anime.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{anime.japaneseTitle}</p>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="gap-1">
                    <Play className="w-3 h-3" />
                    Ep {anime.currentEpisode}
                  </Badge>
                  {anime.status === 'airing' && (
                    <Badge className="bg-green-500/90 text-primary-foreground hover:bg-green-500">Airing</Badge>
                  )}
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1.5">
                {anime.genres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Current episode mapping */}
              {currentEpisode && (
                <div className="mt-auto">
                  <p className="text-xs text-muted-foreground mb-2 tracking-wide font-medium">
                    Latest episode
                  </p>
                  <MangaMappingDisplay episode={currentEpisode} showEpisodeNumber={false} />
                </div>
              )}

              {/* View details hint */}
              <div className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                View all episodes
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
