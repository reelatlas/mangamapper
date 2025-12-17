import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { MangaMappingDisplay } from '@/components/MangaMappingDisplay';
import { EpisodeBadge } from '@/components/EpisodeBadge';
import { ProgressTracker } from '@/components/ProgressTracker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnimeById } from '@/data/mockAnime';
import { ArrowLeft, Calendar, Play, BookOpen, Info } from 'lucide-react';

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const anime = getAnimeById(id || '');

  if (!anime) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Anime not found</h1>
          <p className="text-muted-foreground mb-6">The anime you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  const canonCount = anime.episodes.filter(ep => ep.type === 'canon').length;
  const fillerCount = anime.episodes.filter(ep => ep.type === 'filler').length;
  const animeOnlyCount = anime.episodes.filter(ep => ep.type === 'anime-only-canon').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </Button>

        {/* Hero section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10">
          {/* Cover image */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[3/4]">
              <img
                src={anime.coverImage}
                alt={anime.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className={anime.status === 'airing' ? 'bg-green-500/90 text-primary-foreground' : 'bg-secondary'}>
                  {anime.status === 'airing' ? 'Currently airing' : 'Completed'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">{anime.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">{anime.japaneseTitle}</p>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {anime.genres.map((genre) => (
                <Badge key={genre} variant="secondary">{genre}</Badge>
              ))}
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">{anime.synopsis}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Play className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{anime.currentEpisode}</div>
                  <div className="text-xs text-muted-foreground">Episodes</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-2xl font-bold">{canonCount}</div>
                  <div className="text-xs text-muted-foreground">Canon</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-destructive">F</span>
                  </div>
                  <div className="text-2xl font-bold">{fillerCount}</div>
                  <div className="text-xs text-muted-foreground">Filler</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="w-5 h-5 mx-auto mb-1 rounded-full bg-accent-foreground/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-accent-foreground">A</span>
                  </div>
                  <div className="text-2xl font-bold">{animeOnlyCount}</div>
                  <div className="text-xs text-muted-foreground">Anime only</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="mb-6">
          <ProgressTracker anime={anime} />
        </div>

        {/* Legend */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Episode types:</span>
              </div>
              <div className="flex items-center gap-2">
                <EpisodeBadge type="canon" />
                <span className="text-muted-foreground">— Follows manga</span>
              </div>
              <div className="flex items-center gap-2">
                <EpisodeBadge type="filler" />
                <span className="text-muted-foreground">— Not in manga</span>
              </div>
              <div className="flex items-center gap-2">
                <EpisodeBadge type="anime-only-canon" />
                <span className="text-muted-foreground">— Canon but anime-only story</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Episodes list */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              All episodes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {anime.episodes.map((episode) => (
                <MangaMappingDisplay 
                  key={episode.number} 
                  episode={episode}
                  showEpisodeNumber={true}
                />
              ))}
            </div>
            
            {anime.episodes.length < anime.currentEpisode && (
              <p className="text-center text-sm text-muted-foreground mt-6 py-4 border-t">
                Showing {anime.episodes.length} of {anime.currentEpisode} episodes.
                <br />
                Full episode list coming soon.
              </p>
            )}
          </CardContent>
        </Card>
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

export default AnimeDetail;
